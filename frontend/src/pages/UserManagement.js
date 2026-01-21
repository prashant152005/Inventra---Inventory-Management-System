import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const nav = useNavigate();

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

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/api/users/delete/${id}`);
    loadUsers();
  };

  return (
    <div className="main">
      <h2 className="page-title">User Management</h2>
    
    

      {/* REGISTER BUTTON */}
      <button
        className="btn btn-primary"
        style={{ marginBottom: "20px" }}
        onClick={() => nav("/register")}
      >
        ➕ Register User
      </button>

      

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
