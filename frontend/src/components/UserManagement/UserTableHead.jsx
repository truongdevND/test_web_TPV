import Table from "../ui/Table";

const COLUMNS = [
  "Mã",
  "Họ tên",
  "Ngày sinh",
  "Email",
  "Số điện thoại",
  "Địa chỉ",
  "Thao tác",
];

function UserTableHead() {
  return (
    <Table.Head>
      <tr>
        {COLUMNS.map((col) => (
          <Table.HeadCell key={col}>{col}</Table.HeadCell>
        ))}
      </tr>
    </Table.Head>
  );
}

export default UserTableHead;
