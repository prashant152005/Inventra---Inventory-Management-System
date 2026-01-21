import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/product.css";

export default function ProductDetail() {
  const { sku } = useParams();
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [product, setProduct] = useState(null);
  const [qtyChange, setQtyChange] = useState("");
  const [price, setPrice] = useState("");

  const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // LOAD PRODUCT
  useEffect(() => {
    api.get("/api/inventory/all")
      .then(res => {
        const found = res.data.find(p => p.sku === sku);
        if (!found) {
          alert("Product not found");
          nav("/inventory");
        }
        setProduct(found);
        setPrice(found.unitPrice);
      })
      .catch(() => {
        alert("Session expired");
        localStorage.clear();
        nav("/");
      });
  }, [sku]);

  if (!product) return <p style={{ padding: 20 }}>Loading...</p>;

  const isLow = product.quantity <= product.reorderLevel;

  // UPDATE STOCK
  const updateStock = async () => {
    if (!qtyChange) return alert("Enter quantity");

    await api.post("/api/inventory/update", {
      sku: product.sku,
      quantity: Number(qtyChange)
    });

    nav("/inventory");
  };

  // UPDATE PRICE
  const updatePrice = async () => {
    await api.post("/api/inventory/update", {
      sku: product.sku,
      productName: product.productName,
      unitPrice: Number(price),
      quantity: 0,
      reorderLevel: product.reorderLevel
    });

    nav("/inventory");
  };

  // DELETE PRODUCT
  const deleteProduct = async () => {
    if (!window.confirm("Delete this product permanently?")) return;

    await api.delete(`/api/inventory/delete/${product.id}`);
    nav("/inventory");
  };

    return (
  <div className="product-page">
<button
  className="btn secondary back-btn"
  onClick={() => nav("/inventory")}
>
  ← Back to Dashboard
</button>

    {/* HEADER */}
    <div className="product-header">
      <h2>{product.productName}</h2>
      <span className={`status-badge ${isLow ? "low" : "ok"}`}>
        {isLow ? "LOW STOCK" : "IN STOCK"}
      </span>
    </div>

    {/* PRODUCT INFO */}
    <div className="product-card">
      <div className="info-row">
        <span>SKU</span>
        <strong>{product.sku}</strong>
      </div>

      <div className="info-row">
        <span>Unit Price</span>
        <strong>₹{product.unitPrice}</strong>
      </div>

      <div className="info-row">
        <span>Available Stock</span>
        <strong>{product.quantity}</strong>
      </div>

      <div className="info-row">
        <span>Reorder Level</span>
        <strong>{product.reorderLevel}</strong>
      </div>

      {isLow && (
        <div className="alert-box">
          ⚠ Stock is below reorder threshold
        </div>
      )}
    </div>

    {/* ADMIN ACTIONS */}
    {role === "ADMIN" && (
      <div className="admin-section">

        <h3>Admin Controls</h3>

        <div className="actions-grid">

          <div className="action-box">
            <h4>Update Stock</h4>
            <input
              type="number"
              placeholder="Add / Reduce Quantity"
              value={qtyChange}
              onChange={e => setQtyChange(e.target.value)}
            />
            <button className="btn primary" onClick={updateStock}>
              Update Stock
            </button>
          </div>

          <div className="action-box">
            <h4>Update Price</h4>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
            <button className="btn primary" onClick={updatePrice}>
              Save Price
            </button>
          </div>

        </div>

        <button className="btn danger" onClick={deleteProduct}>
          🗑 Delete Product
        </button>
      </div>
    )}

    <button
  className="btn secondary back-btn-top"
  onClick={() => nav("/inventory")}
>
  ← Back to Dashboard
</button>


  </div>
);
}
