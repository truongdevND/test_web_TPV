function UserTableRow({ user }) {
  return (
    <tr className="group border-b border-slate-100 last:border-0 hover:bg-indigo-50/50 transition-colors">
      <td className="px-5 py-4 text-left">
        <span className="font-medium text-indigo-600">{user.code}</span>
      </td>
      <td className="px-5 py-4 text-left font-medium text-slate-800">{user.fullName}</td>
      <td className="px-5 py-4 text-left text-slate-600">{user.dateOfBirth}</td>
      <td className="px-5 py-4 text-left text-slate-600">{user.email}</td>
      <td className="px-5 py-4 text-left text-slate-600">{user.phone}</td>
      <td className="px-5 py-4 text-left text-slate-600">{user.address}</td>
    </tr>
  );
}

export default UserTableRow;
