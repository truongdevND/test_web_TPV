import { useEffect, useState } from "react";
import userService from "../../services/userService";
import UserTable from "./UserTable";
import Pagination from "./Pagination";

const DEFAULT_PAGE_SIZE = 10;

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

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAll({
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      setUsers(response.data || []);
      setPagination({
        page: response.page ?? 1,
        pageSize: response.pageSize ?? DEFAULT_PAGE_SIZE,
        totalRecords: response.totalRecords ?? 0,
        totalPages: response.totalPages ?? 1,
      });
    } catch (err) {
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
      setUsers([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Quản lý người dùng
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Xem và quản lý danh sách người dùng trong hệ thống
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm font-medium">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
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
            <UserTable users={users} />
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.totalRecords}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
