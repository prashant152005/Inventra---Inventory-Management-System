import { useState } from "react";
import axios from "axios";
import "../styles/inventory.css";

export default function AddUpdateProductModal({ onClose, onSuccess }) {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    sku: "",
    productName: "",
    unitPrice: "",
    quantity: "",
    reorderLevel: ""
  });

  const submit = async () => {
    if (!form.sku || !form.productName) {
      alert("SKU and Product Name required");
      return;
    }

    await axios.post(
      "http://localhost:8080/api/inventory/update",
      {
        sku: form.sku,
        productName: form.productName,
        unitPrice: Number(form.unitPrice),
        quantity: Number(form.quantity),
        reorderLevel: Number(form.reorderLevel)
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    onSuccess();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Add / Update Product</h3>

        <input placeholder="SKU"
          value={form.sku}
          onChange={e => setForm({ ...form, sku: e.target.value })}
        />

        <input placeholder="Product Name"
          value={form.productName}
          onChange={e => setForm({ ...form, productName: e.target.value })}
        />

        <input type="number" placeholder="Unit Price"
          value={form.unitPrice}
          onChange={e => setForm({ ...form, unitPrice: e.target.value })}
        />

        <input type="number" placeholder="Quantity (+/-)"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
        />

        <input type="number" placeholder="Low Stock Limit"
          value={form.reorderLevel}
          onChange={e => setForm({ ...form, reorderLevel: e.target.value })}
        />

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={submit}>
            Save
          </button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
