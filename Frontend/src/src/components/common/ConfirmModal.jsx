import React from "react";
import "./ConfirmModal.scss";

const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <h3>{title || "Xác nhận"}</h3>
        <p>{message || "Bạn có chắc chắn muốn thực hiện hành động này?"}</p>
        <div className="buttons">
          <button className="btn cancel" onClick={onCancel}>Hủy</button>
          <button className="btn confirm" onClick={onConfirm}>Đồng ý</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;