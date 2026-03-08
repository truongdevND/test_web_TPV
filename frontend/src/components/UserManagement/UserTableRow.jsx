import Table from "../ui/Table";
import Button from "../ui/Button";

const EditIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

function UserTableRow({ user, onEdit, onDelete, deletingId }) {
  const isDeleting = deletingId === user.id;

  return (
    <Table.Row>
      <Table.Cell>
        <span className="font-medium text-indigo-600">{user.code}</span>
      </Table.Cell>
      <Table.Cell className="font-medium text-slate-800">{user.fullName}</Table.Cell>
      <Table.Cell>{user.dateOfBirth}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{user.phone}</Table.Cell>
      <Table.Cell>{user.address}</Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<EditIcon />}
            onClick={() => onEdit?.(user)}
            disabled={isDeleting}
          >
            Cập nhật
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            icon={<TrashIcon />}
            onClick={() => onDelete?.(user)}
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}

export default UserTableRow;
