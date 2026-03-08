using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/users")]
    public class UsersController : ControllerBase
    {
        private readonly JsonUserService _service;

        public UsersController(JsonUserService service)
        {
            _service = service;
        }

        // GET /api/v1/users
        [HttpGet]
        public IActionResult GetAll([FromQuery] QueryParams query)
        {
            try
            {
                if (query.Page < 1) query.Page = 1;
                if (query.PageSize < 1 || query.PageSize > 100) query.PageSize = 10;

                var result = _service.GetPaged(query);
                return StatusCode(200, ApiResponse<PagedResult<User>>.Ok(result, "Lấy danh sách người dùng thành công"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
            }
        }

        // POST /api/v1/users
        [HttpPost]
        public IActionResult Create([FromBody] CreateUserDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return StatusCode(400, ApiResponse<string>.BadRequest("Dữ liệu không hợp lệ"));

                var existingEmail = _service.GetAll()
                                            .FirstOrDefault(u => u.Email.ToLower() == dto.Email.ToLower());
                if (existingEmail != null)
                    return StatusCode(409, ApiResponse<string>.Conflict($"Email {dto.Email} đã tồn tại"));

                var existingCode = _service.GetAll()
                                           .FirstOrDefault(u => u.Code.ToLower() == dto.Code.ToLower());
                if (existingCode != null)
                    return StatusCode(409, ApiResponse<string>.Conflict($"Mã {dto.Code} đã tồn tại"));

                var created = _service.Create(dto);
                return StatusCode(201, ApiResponse<User>.Created(created, "Tạo người dùng thành công"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
            }
        }

        // GET /api/v1/users/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                if (id <= 0)
                    return StatusCode(400, ApiResponse<string>.BadRequest("ID phải lớn hơn 0"));

                var user = _service.GetById(id);
                if (user == null)
                    return StatusCode(404, ApiResponse<string>.NotFound($"Không tìm thấy người dùng với ID = {id}"));

                return StatusCode(200, ApiResponse<User>.Ok(user, "Lấy thông tin người dùng thành công"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
            }
        }

        // PUT /api/v1/users/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                if (id <= 0)
                    return StatusCode(400, ApiResponse<string>.BadRequest("ID phải lớn hơn 0"));

                var existing = _service.GetById(id);
                if (existing == null)
                    return StatusCode(404, ApiResponse<string>.NotFound($"Không tìm thấy người dùng với ID = {id}"));

                _service.Update(id, dto);
                return StatusCode(200, ApiResponse<User>.Ok(_service.GetById(id)!, "Cập nhật người dùng thành công"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
            }
        }

        // DELETE /api/v1/users/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                if (id <= 0)
                    return StatusCode(400, ApiResponse<string>.BadRequest("ID phải lớn hơn 0"));

                var existing = _service.GetById(id);
                if (existing == null)
                    return StatusCode(404, ApiResponse<string>.NotFound($"Không tìm thấy người dùng với ID = {id}"));

                _service.Delete(id);
                return StatusCode(200, ApiResponse<string>.Ok($"Xóa người dùng ID = {id} thành công"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ServerError(ex.Message));
            }
        }
    }
}