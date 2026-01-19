import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";


export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "" });

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: { Authorization: `Bearer ${token}` }
  });

  const loadUsers = async () => {
    const res = await api.get("/api/users/all");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const registerStaff = async () => {
    if (!newUser.username || !newUser.password) {
      alert("All fields required");
      return;
    }

    await api.post("/api/users/register", newUser);
    setNewUser({ username: "", password: "" });
    loadUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/api/users/delete/${id}`);
    loadUsers();
  };

  return (
    <div className="main">
      <h2 className="page-title">User Management</h2>

      {/* ADD STAFF */}
      <div className="form-box">
        <h3>Register Staff</h3>

        <input
          placeholder="Username"
          value={newUser.username}
          onChange={e => setNewUser({ ...newUser, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={e => setNewUser({ ...newUser, password: e.target.value })}
        />

        <button className="btn btn-primary" onClick={registerStaff}>
          Register Staff
        </button>
      </div>

      {/* USERS TABLE */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                {u.role !== "ADMIN" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
