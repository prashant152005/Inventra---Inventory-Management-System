import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import AddUpdateProductModal from "./AddUpdateProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const nav = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // LOAD INVENTORY (SAFE)
  const loadInventory = async () => {
    try {
      const res = await api.get("/api/inventory/all");
      setItems(res.data || []);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        nav("/");
      } else {
        alert("Server unavailable. Try again.");
      }
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // DELETE PRODUCT (ADMIN)
  const deleteProduct = async () => {
    try {
      await api.delete(`/api/inventory/delete/${deleteTarget.id}`);
      setDeleteTarget(null);
      loadInventory();
    } catch {
      alert("Failed to delete product");
    }
  };

  // LOGOUT (MANUAL ONLY)
  const logout = () => {
    localStorage.clear();
    nav("/");
  };

  // UI
  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <span>Inventra Inventory System</span>
        <span>{role}</span>
      </div>

      <div className="dashboard-container">
        {/* SIDEBAR */}
        <div className="sidebar">
          {role === "ADMIN" && (
            <a onClick={() => nav("/users")}>User Management</a>
          )}
          {role === "ADMIN" && (
  <a onClick={() => nav("/register-admin")}>
    Register Admin
  </a>
)}

          <a className="active">Inventory</a>
          <a className="logout" onClick={logout}>Logout</a>
        </div>

        {/* MAIN */}
        <div className="main">
          <h2 className="page-title">Inventory</h2>

          {/* SUMMARY CARDS */}
          <div className="cards">
            <div className="card blue">
              <h3>Total Products</h3>
              <p>{items.length}</p>
            </div>

            <div className="card green">
              <h3>In Stock</h3>
              <p>{items.filter(p => p.quantity > p.reorderLevel).length}</p>
            </div>

            <div className="card red">
              <h3>Low Stock</h3>
              <p>{items.filter(p => p.quantity <= p.reorderLevel).length}</p>
            </div>
          </div>

          {/* ADMIN ACTION */}
          {role === "ADMIN" && (
            <button
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
              onClick={() => setShowModal(true)}
            >
              ➕ Add / Update Product
            </button>
          )}

          {/* INVENTORY TABLE */}
          <table className="product-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                {role === "ADMIN" && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td onClick={() => nav(`/inventory/${p.sku}`)}>{p.sku}</td>
                  <td onClick={() => nav(`/inventory/${p.sku}`)}>{p.productName}</td>
                  <td>{p.quantity}</td>
                  <td>₹{p.unitPrice}</td>
                  <td>
                    {p.quantity <= p.reorderLevel ? (
                      <span className="low-stock">Low</span>
                    ) : (
                      <span className="in-stock">In Stock</span>
                    )}
                  </td>

                  {role === "ADMIN" && (
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => setDeleteTarget(p)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {items.length === 0 && (
            <p className="empty-msg">No products found</p>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showModal && (
        <AddUpdateProductModal
          onClose={() => setShowModal(false)}
          onSuccess={loadInventory}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={deleteProduct}
        />
      )}
    </>
  );
}
