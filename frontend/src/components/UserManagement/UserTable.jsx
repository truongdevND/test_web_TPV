import UserTableHead from "./UserTableHead";
import UserTableRow from "./UserTableRow";

function UserTable({ users }) {
  if (!users?.length) {
    return (
      <div className="py-16 px-6 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">Chưa có người dùng nào</p>
        <p className="text-sm text-slate-400 mt-1">Dữ liệu sẽ hiển thị tại đây khi có</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm [&_tbody_tr:last-child_td]:border-b-0">
        <UserTableHead />
        <tbody>
          {users.map((user) => (
            <UserTableRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
