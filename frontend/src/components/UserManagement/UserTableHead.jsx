function UserTableHead() {
  const columns = [
    "Mã",
    "Họ tên",
    "Ngày sinh",
    "Email",
    "Số điện thoại",
    "Địa chỉ",
  ];

  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th
            key={col}
            className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/80 border-b border-slate-200"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default UserTableHead;
