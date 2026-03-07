import { useEffect, useState } from "react";
import userService from "../services/userService";

function Test() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await userService.getAll();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>

      {users.map((u) => (
        <p key={u.id}>{u.name}</p>
      ))}
    </div>
  );
}

export default Test;
