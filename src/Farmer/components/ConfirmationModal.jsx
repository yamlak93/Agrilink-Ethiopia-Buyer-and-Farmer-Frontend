import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";

const ConfirmationModal = ({ isVisible, message, onClose, onConfirm }) => {
  if (!isVisible) {
    return null;
  }
  const { t } = useTranslation();

  return (
    <div
      className={`modal fade ${isVisible ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 1051 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow rounded">
          <div className="modal-header">
            <h5 className="modal-title">{t("confirmations.title")}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              {t("confirmations.noCancel")}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              {t("confirmations.yesDelete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
