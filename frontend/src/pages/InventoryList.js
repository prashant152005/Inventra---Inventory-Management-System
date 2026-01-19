import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/inventory.css";

export default function InventoryList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/api/inventory/all")
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div className="inventory-page">
      <h2>Inventory</h2>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr
              key={p.id}
              className="clickable"
              onClick={() => navigate(`/inventory/${p.sku}`)}
            >
              <td>{p.productName}</td>
              <td>{p.quantity}</td>
              <td>₹{p.unitPrice}</td>
              <td>
                {p.quantity <= p.reorderLevel
                  ? <span className="low">Low</span>
                  : <span className="ok">In Stock</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
