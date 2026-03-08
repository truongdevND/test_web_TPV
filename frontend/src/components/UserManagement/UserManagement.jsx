import { useEffect, useState, useCallback } from "react";
import userService from "../../services/userService";
import { Button, ConfirmModal, Input } from "../ui";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import UserFormModal from "./UserFormModal";

const PlusIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const DEFAULT_PAGE_SIZE = 10;
const SORT_BY_OPTIONS = [
  { value: "id", label: "ID" },
  { value: "code", label: "Mã" },
  { value: "fullName", label: "Họ tên" },
  { value: "dateOfBirth", label: "Ngày sinh" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Số điện thoại" },
  { value: "address", label: "Địa chỉ" },
];

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalRecords: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formDirty, setFormDirty] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteUser, setPendingDeleteUser] = useState(null);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [pendingModalAction, setPendingModalAction] = useState(null); // { type: 'create' | 'edit', user?: any }

  const [filters, setFilters] = useState({
    search: "",
    address: "",
    sortBy: "id",
    sortDesc: false,
  });

  const buildParams = useCallback(
    (page, overrides = {}) => {
      const params = {
        Page: page ?? pagination.page,
        PageSize: pagination.pageSize,
        SortBy: overrides.sortBy ?? filters.sortBy,
        SortDesc: overrides.sortDesc ?? filters.sortDesc,
      };
      const search = overrides.search ?? filters.search;
      const address = overrides.address ?? filters.address;
      if (search?.trim()) params.Search = search.trim();
      if (address?.trim()) params.Address = address.trim();
      return params;
    },
    [pagination.page, pagination.pageSize, filters.search, filters.address, filters.sortBy, filters.sortDesc]
  );

  const fetchUsers = useCallback(
    async (page = pagination.page, paramOverrides = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await userService.getAll(buildParams(page, paramOverrides));
        setUsers(response.data || []);
        setPagination((prev) => ({
          ...prev,
          page: response.page ?? page,
          pageSize: response.pageSize ?? prev.pageSize,
          totalRecords: response.totalRecords ?? 0,
          totalPages: response.totalPages ?? 1,
        }));
      } catch (err) {
        setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
        setUsers([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [buildParams, pagination.page]
  );

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1);
  };

  const handleSortChange = (name, value) => {
    const overrides = { ...filters };
    if (name === "sortBy") overrides.sortBy = value;
    if (name === "sortDesc") overrides.sortDesc = value === "true";
    setFilters(overrides);
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, overrides);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      search: "",
      address: "",
      sortBy: "id",
      sortDesc: false,
    };
    setFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, defaultFilters);
  };

  const openCreateModal = () => {
    if (modalOpen && formDirty) {
      setPendingModalAction({ type: "create" });
      setConfirmDiscardOpen(true);
      return;
    }
    setSelectedUser(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    if (modalOpen && formDirty) {
      setPendingModalAction({ type: "edit", user });
      setConfirmDiscardOpen(true);
      return;
    }
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setFormDirty(false);
  };

  const handleSubmitUser = async (formData) => {
    setSubmitLoading(true);
    try {
      if (modalMode === "create") {
        await userService.create(formData);
      } else {
        await userService.update(selectedUser.id, formData);
      }
      closeModal();
      await fetchUsers(pagination.page);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      alert(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteUser = (user) => {
    setPendingDeleteUser(user);
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!pendingDeleteUser) return;
    setDeletingId(pendingDeleteUser.id);
    try {
      await userService.delete(pendingDeleteUser.id);
      setConfirmDeleteOpen(false);
      setPendingDeleteUser(null);
      await fetchUsers(pagination.page);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Không thể xóa người dùng. Vui lòng thử lại.";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Quản lý người dùng
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Xem và quản lý danh sách người dùng trong hệ thống
          </p>
        </div>
        <Button variant="primary" icon={<PlusIcon />} onClick={openCreateModal} className="shrink-0">
          Tạo mới
        </Button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[180px] flex-1">
              <Input
                name="search"
                label="Tìm kiếm"
                placeholder="Tên, email, SĐT, mã..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="min-w-[160px]">
              <Input
                name="address"
                label="Địa chỉ"
                placeholder="Lọc theo địa chỉ"
                value={filters.address}
                onChange={(e) => handleFilterChange("address", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <label className="block text-sm font-medium text-slate-700 mb-1 w-full">Sắp xếp</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange("sortBy", e.target.value)}
                className="h-[42px] px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-sm"
              >
                {SORT_BY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={String(filters.sortDesc)}
                onChange={(e) => handleSortChange("sortDesc", e.target.value)}
                className="h-[42px] px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-sm"
              >
                <option value="false">A → Z</option>
                <option value="true">Z → A</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleClearFilters}
                disabled={loading}
              >
                Xóa lọc
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                icon={<SearchIcon />}
                onClick={handleSearch}
                disabled={loading}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
        {error ? (
          <div className="mx-4 my-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </span>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        ) : (
          <>
            <UserTable
              users={users}
              onEdit={openEditModal}
              onDelete={handleDeleteUser}
              deletingId={deletingId}
              loading={loading}
            />
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.totalRecords}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          </>
        )}
      </div>

      <UserFormModal
        open={modalOpen}
        onClose={closeModal}
        mode={modalMode}
        initialData={selectedUser}
        onSubmit={handleSubmitUser}
        loading={submitLoading}
        onDirtyChange={setFormDirty}
      />

      <ConfirmModal
        open={confirmDeleteOpen}
        title="Xác nhận xóa"
        description={
          pendingDeleteUser
            ? `Bạn có chắc muốn xóa người dùng "${pendingDeleteUser.fullName}" (${pendingDeleteUser.code})?`
            : "Bạn có chắc muốn xóa người dùng này?"
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmVariant="danger"
        loading={deletingId === pendingDeleteUser?.id}
        onCancel={() => {
          if (deletingId) return;
          setConfirmDeleteOpen(false);
          setPendingDeleteUser(null);
        }}
        onConfirm={confirmDeleteUser}
      />

      <ConfirmModal
        open={confirmDiscardOpen}
        title="Xác nhận hủy"
        description="Bạn có chắc muốn hủy thao tác hiện tại? Các thay đổi chưa lưu sẽ bị mất."
        confirmText="Hủy thay đổi"
        cancelText="Tiếp tục"
        confirmVariant="danger"
        onCancel={() => {
          setConfirmDiscardOpen(false);
          setPendingModalAction(null);
        }}
        onConfirm={() => {
          setConfirmDiscardOpen(false);
          const action = pendingModalAction;
          setPendingModalAction(null);
          if (!action) return;
          if (action.type === "create") {
            setSelectedUser(null);
            setModalMode("create");
            setModalOpen(true);
            return;
          }
          if (action.type === "edit") {
            setSelectedUser(action.user);
            setModalMode("edit");
            setModalOpen(true);
          }
        }}
      />
    </div>
  );
}

export default UserManagement;
