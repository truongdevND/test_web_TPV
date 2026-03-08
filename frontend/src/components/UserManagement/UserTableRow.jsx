import Table from "../ui/Table";
import Button from "../ui/Button";

const EditIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

function UserTableRow({ user, onEdit }) {
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={<EditIcon />}
          onClick={() => onEdit?.(user)}
        >
          Cập nhật
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

export default UserTableRow;
