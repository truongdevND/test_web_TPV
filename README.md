# Hướng dẫn phát triển API — Cole LMS Backend

## Thứ tự thực hiện

```
Entity → Repository → DTO → Service → Controller
```

---

## Bước 1 — Entity

**Vị trí:** `lms/src/main/java/vn/cole/lms/db/entity/`

Entity mapping 1-1 với bảng trong DB. Thường đã có sẵn, chỉ tạo mới khi thêm tính năng hoàn toàn mới.

```java
@Entity
@Table(name = "class_sessions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ClassSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private CourseClass courseClass;

    @Column(name = "session_date")
    private LocalDate sessionDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ClassSessionStatus status;

    @PrePersist
    protected void onCreate() {
        if (status == null) status = ClassSessionStatus.NOT_COMPLETED;
    }
}
```

**Quy tắc:**
- Dùng `FetchType.LAZY` cho mọi quan hệ — tránh load dữ liệu không cần thiết
- Enum lưu dạng `STRING` (không phải `ORDINAL`)
- Soft delete dùng field `deletedAt` thay vì xóa thật
- Dùng `@PrePersist` / `@PreUpdate` để tự set `createdAt`, `updatedAt`

---

## Bước 2 — Repository

**Vị trí:** `lms/src/main/java/vn/cole/lms/db/repository/`

```java
@Repository
public interface ClassSessionRepository extends JpaRepository<ClassSession, Long> {

    // Query đơn giản — Spring tự sinh
    List<ClassSession> findByCourseClassId(Long classId);

    // Query phức tạp — viết JPQL tay
    @Query("""
        SELECT cs FROM ClassSession cs
        JOIN FETCH cs.courseClass cc
        LEFT JOIN FETCH cc.course c
        WHERE cs.lecturerId = :lecturerId
        AND (:fromDate IS NULL OR cs.sessionDate >= :fromDate)
        AND (:toDate   IS NULL OR cs.sessionDate <= :toDate)
        ORDER BY cs.sessionDate ASC, cs.startTime ASC
    """)
    List<ClassSession> findScheduleByLecturer(
            @Param("lecturerId") Long lecturerId,
            @Param("fromDate")   LocalDate fromDate,
            @Param("toDate")     LocalDate toDate
    );

    // Trả thẳng DTO qua JPQL constructor
    @Query("""
        SELECT new vn.cole.lms.db.dto.response.SomeDTO(
            cs.id, cs.title, cc.name
        )
        FROM ClassSession cs
        JOIN cs.courseClass cc
        WHERE cs.lecturerId = :lecturerId
    """)
    List<SomeDTO> findDTOByLecturer(@Param("lecturerId") Long lecturerId);
}
```

**Quy tắc:**
- Dùng `JOIN FETCH` để tránh N+1 query
- Filter điều kiện tại tầng DB, không filter trong Java
- Với nullable param, dùng pattern `(:param IS NULL OR field = :param)`
- Batch load nhiều ID: `WHERE entity.id IN :ids`

---

## Bước 3 — DTO

**Vị trí:**
- Request: `lms/src/main/java/vn/cole/lms/db/dto/request/`
- Response: `lms/src/main/java/vn/cole/lms/db/dto/response/`

### Request DTO

```java
@Data
public class CreateSessionRequest {
    private Long classId;
    private String title;
    private String sessionDate;   // nhận dạng String, parse trong service
    private String startTime;
}
```

### Response DTO

```java
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SessionDetailDTO {
    private Long sessionId;
    private String title;
    private String sessionDate;   // trả ra đã format: "dd/MM/yyyy"
    private String startTime;     // "HH:mm"
    private String statusLabel;

    // Computed field — không cần lưu DB
    private String className;
    private String courseName;
}
```

**Quy tắc:**
- Request DTO: dùng kiểu `String` cho date/time, parse trong service
- Response DTO: dùng `@Builder` để build dễ trong service
- Không đặt entity vào DTO — chỉ primitive type và String
- Enum trong response DTO: nên trả cả `status` (enum) và `statusLabel` (String)

---

## Bước 4 — Service

**Vị trí:** `lms/src/main/java/vn/cole/lms/service/`

```java
@Service
public class ClassSessionService {

    private final ClassSessionRepository sessionRepository;
    private final ClassRepository classRepository;

    // Constructor injection — KHÔNG dùng @Autowired field injection
    public ClassSessionService(ClassSessionRepository sessionRepository,
                               ClassRepository classRepository) {
        this.sessionRepository = sessionRepository;
        this.classRepository   = classRepository;
    }

    // ─── GET (query) → readOnly = true ───────────────────────────────────

    @Transactional(readOnly = true)
    public List<SessionDetailDTO> getSchedule(Long lecturerId,
                                              LocalDate fromDate,
                                              LocalDate toDate) {
        // 1. Validate
        if (!lecturerRepository.existsById(lecturerId)) {
            throw new RuntimeException("Lecturer not found: " + lecturerId);
        }

        // 2. Query
        List<ClassSession> sessions =
                sessionRepository.findScheduleByLecturer(lecturerId, fromDate, toDate);

        // 3. Map → DTO
        return sessions.stream()
                .map(this::toScheduleDTO)
                .toList();
    }

    private SessionDetailDTO toScheduleDTO(ClassSession cs) {
        CourseClass cc = cs.getCourseClass();
        return SessionDetailDTO.builder()
                .sessionId(cs.getId())
                .title(cs.getTitle())
                .sessionDate(DateUtils.formatDate(cs.getSessionDate()))
                .startTime(formatTime(cs.getStartTime()))
                .statusLabel(cs.getStatus().getLabel())
                .className(cc != null ? cc.getName() : null)
                .courseName(cc != null && cc.getCourse() != null ? cc.getCourse().getName() : null)
                .build();
    }

    // ─── POST/PUT/DELETE → @Transactional ────────────────────────────────

    @Transactional
    public void createSession(CreateSessionRequest request) {
        // 1. Validate
        CourseClass courseClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        // 2. Build entity
        ClassSession session = ClassSession.builder()
                .courseClass(courseClass)
                .title(request.getTitle())
                .sessionDate(DateUtils.parseDate(request.getSessionDate()))
                .build();

        // 3. Save
        sessionRepository.save(session);
    }

    // ─── Soft delete ──────────────────────────────────────────────────────

    @Transactional
    public void deleteSession(Long sessionId) {
        ClassSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getDeletedAt() != null) {
            throw new RuntimeException("Already deleted");
        }

        session.setDeletedAt(LocalDateTime.now());
        // Không cần gọi save() — JPA dirty checking tự detect
    }

    // ─── Helper ──────────────────────────────────────────────────────────

    private String formatTime(LocalTime time) {
        if (time == null) return null;
        return String.format("%02d:%02d", time.getHour(), time.getMinute());
    }
}
```

**Quy tắc:**
- `@Transactional(readOnly = true)` cho mọi method GET/query
- `@Transactional` cho mọi method tạo/sửa/xóa
- Validate đầu vào trước khi query
- Tách logic map entity → DTO ra helper method riêng (`toXxxDTO`)
- Không gọi `save()` khi chỉ update field trong transaction (`@Transactional` + dirty check tự xử lý)

---

## Bước 5 — Controller

**Vị trí:** `lms/src/main/java/vn/cole/lms/controller/`

```java
@RestController
@RequestMapping("/class-session")
public class ClassSessionController extends BaseController {

    private final ClassSessionService sessionService;

    public ClassSessionController(ClassSessionService sessionService) {
        this.sessionService = sessionService;
    }

    // ─── GET ─────────────────────────────────────────────────────────────

    @GetMapping("/lecturer/{lecturerId}/schedule")
    public ResponseEntity<ApiResponse<List<SessionDetailDTO>>> getSchedule(
            @PathVariable Long lecturerId,
            @RequestParam(value = "from_date", required = false) String fromDate,
            @RequestParam(value = "to_date",   required = false) String toDate
    ) {
        try {
            LocalDate from = DateUtils.parseDate(fromDate);
            LocalDate to   = DateUtils.parseDate(toDate);
            return sendSuccess("Get schedule successfully",
                    sessionService.getSchedule(lecturerId, from, to));
        } catch (Exception e) {
            return sendError("Get schedule failed: " + e.getMessage());
        }
    }

    // ─── POST ────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> create(
            @RequestBody CreateSessionRequest request
    ) {
        try {
            sessionService.createSession(request);
            return sendSuccess("Create session successfully");
        } catch (Exception e) {
            return sendError("Create session failed: " + e.getMessage());
        }
    }

    // ─── DELETE ──────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            sessionService.deleteSession(id);
            return sendSuccess("Delete session successfully");
        } catch (Exception e) {
            return sendError("Delete session failed: " + e.getMessage());
        }
    }
}
```

**Quy tắc:**
- Luôn extends `BaseController`
- Dùng `try/catch` bao toàn bộ — không để exception thoát ra ngoài
- Dùng `sendSuccess()` / `sendError()` — không dùng `ResponseEntity` thô
- Controller **không chứa business logic** — chỉ nhận request, gọi service, trả response
- Tên method message: `"Get/Create/Update/Delete Xxx successfully"` / `"... failed: " + e.getMessage()`

---

## Cấu trúc thư mục tham khảo

```
db/
├── entity/
│   └── classes/
│       └── ClassSession.java          ← Bước 1
├── repository/
│   └── ClassSessionRepository.java    ← Bước 2
└── dto/
    ├── request/
    │   └── courseclass/
    │       └── CreateSessionRequest.java   ← Bước 3
    └── response/
        └── courseclass/
            └── SessionDetailDTO.java       ← Bước 3

service/
└── courseclass/
    └── ClassSessionService.java       ← Bước 4

controller/
└── ClassSessionController.java        ← Bước 5
```

---

## Response format chuẩn

### Thành công — có data
```json
{
  "success": true,
  "message": "Get schedule successfully",
  "data": [ ... ],
  "timestamp": "2025-05-08T10:00:00"
}
```

### Thành công — không data (create/delete)
```json
{
  "success": true,
  "message": "Create successfully",
  "data": null,
  "timestamp": "2025-05-08T10:00:00"
}
```

### Thất bại
```json
{
  "success": false,
  "message": "Get schedule failed: Lecturer not found: 99",
  "data": null,
  "timestamp": "2025-05-08T10:00:00"
}
```

### Phân trang
```json
{
  "success": true,
  "message": "Get list successfully",
  "data": {
    "content": [ ... ],
    "page": 1,
    "per_page": 10,
    "total_elements": 42,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```

---

## Checklist trước khi hoàn thành

- [ ] Repository dùng `JOIN FETCH` — không để N+1
- [ ] Service có `@Transactional` / `@Transactional(readOnly = true)`
- [ ] Validate input trước khi xử lý
- [ ] Controller bọc `try/catch`
- [ ] Response DTO không expose trực tiếp entity
- [ ] Soft delete dùng `deletedAt`, không xóa cứng
- [ ] Date/time format thống nhất: `dd/MM/yyyy` và `HH:mm`
