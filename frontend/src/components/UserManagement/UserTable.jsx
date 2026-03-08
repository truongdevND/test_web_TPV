import Table from "../ui/Table";
import UserTableHead from "./UserTableHead";
import UserTableRow from "./UserTableRow";

const EmptyIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const SKELETON_ROW_COUNT = 10;
const COLUMN_COUNT = 7;

function UserTable({ users, onEdit, onDelete, deletingId, loading = false }) {
  if (loading) {
    return (
      <Table>
        <UserTableHead />
        <Table.Body>
          {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
            <Table.SkeletonRow key={i} colCount={COLUMN_COUNT} />
          ))}
        </Table.Body>
      </Table>
    );
  }

  if (!users?.length) {
    return (
      <Table.Empty
        icon={<EmptyIcon />}
        title="Chưa có người dùng nào"
        description="Dữ liệu sẽ hiển thị tại đây khi có"
      />
    );
  }

  return (
    <Table>
      <UserTableHead />
      <Table.Body>
        {users.map((user) => (
          <UserTableRow
            key={user.id}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            deletingId={deletingId}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default UserTable;
