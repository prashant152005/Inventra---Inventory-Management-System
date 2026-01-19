import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";
import AddUpdateProductModal from "../components/AddUpdateProductModal";
import DeleteProductModal from "../components/DeleteConfirmModal";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const role = localStorage.getItem("role");
  const nav = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:8080/api/inventory",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  useEffect(() => {
    api.get("/all").then(res => setItems(res.data));
  }, []);

  return (
    <div className="dashboard-page">

      <h2 className="dashboard-title">Dashboard</h2>

      {/* SUMMARY CARDS */}
      <div className="dashboard-cards">
        <div className="card blue">
          <h3>Total Products</h3>
          <p>{items.length}</p>
        </div>

        <div className="card green">
          <h3>In Stock</h3>
          <p>{items.filter(i => i.quantity > i.reorderLevel).length}</p>
        </div>

        <div className="card red">
          <h3>Low Stock</h3>
          <p>{items.filter(i => i.quantity <= i.reorderLevel).length}</p>
        </div>

        {role === "ADMIN" && (
          <div className="card purple">
            <h3>Total Users</h3>
            <p>Admin View</p>
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      {role === "ADMIN" && (
        <div className="dashboard-actions">
          <button className="btn primary" onClick={() => setShowAdd(true)}>
            ➕ Add / Update Product
          </button>

          <button className="btn danger" onClick={() => setShowDelete(true)}>
            🗑 Delete Product
          </button>

          <button className="btn secondary" onClick={() => nav("/users")}>
            👤 Manage Users
          </button>
        </div>
      )}

      {/* MODALS */}
      {showAdd && <AddUpdateProductModal onClose={() => setShowAdd(false)} />}
      {showDelete && <DeleteProductModal onClose={() => setShowDelete(false)} />}

    </div>
  );
}
