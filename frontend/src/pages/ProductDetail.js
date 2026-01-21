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

      <h2>{product.productName}</h2>
      
      <div className="product-card">
        <p><b>SKU:</b> {product.sku}</p>
        <p><b>Price:</b> ₹{product.unitPrice}</p>
        <p><b>Stock:</b> {product.quantity}</p>
        <p><b>Low Stock Limit:</b> {product.reorderLevel}</p>

        <p>
          <b>Status:</b>{" "}
          {isLow
            ? <span className="low-stock">Low Stock</span>
            : <span className="in-stock">In Stock</span>}
        </p>

        {isLow && (
          <div className="alert-box">
            ⚠ Stock below reorder level
          </div>
        )}
      </div>

      {/* ADMIN ACTIONS */}
      {role === "ADMIN" && (
        <div className="admin-actions">
          
          <div className="action-box">
            <h4>Update Stock</h4>
            <input
              type="number"
              placeholder="+ / - Quantity"
              value={qtyChange}
              onChange={e => setQtyChange(e.target.value)}
            />
            <button onClick={updateStock}>Update</button>
          </div>

          <div className="action-box">
            <h4>Update Price</h4>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
            <button onClick={updatePrice}>Save Price</button>
          </div>

          <button className="delete-btn" onClick={deleteProduct}>
            🗑 Delete Product
          </button>
          
          <button className="dashboard" onClick={() => nav("/inventory")}>
        Back to Dashboard
      </button>

        </div>
      )}
    </div>
  );
}
