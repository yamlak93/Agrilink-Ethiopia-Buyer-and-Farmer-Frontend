// src/Farmer/components/CancelReasonModal.jsx
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";

const CancelReasonModal = ({ show, onClose, onConfirm, orderId }) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(orderId, reason);
      setReason("");
    }
  };

  if (!show) return null;

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
      style={{ zIndex: 1060 }} // HIGHER THAN OrderDetailModal (1050)
      dialogClassName="modal-dialog-centered"
    >
      <Modal.Header
        closeButton
        className="bg-danger text-white"
        style={{
          background: "linear-gradient(90deg, #dc3545, #c82333)",
        }}
      >
        <Modal.Title className="fw-bold">
          {t("orders.cancelOrder")} #{orderId}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-3">{t("orders.cancelWarning")}</p>
        <textarea
          className="form-control"
          rows="4"
          placeholder={t("orders.enterReason")}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ resize: "none" }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {t("common.close")}
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          disabled={!reason.trim()}
        >
          {t("orders.cancelOrder")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelReasonModal;
