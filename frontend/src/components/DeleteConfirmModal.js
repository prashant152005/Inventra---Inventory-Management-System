import "../styles/modal.css";

export default function DeleteConfirmModal({ product, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>Confirm Delete</h3>

        <p>
          Are you sure you want to delete
          <b> {product.productName}</b> (SKU: {product.sku})?
        </p>

        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>
            Yes, Delete
          </button>

          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
