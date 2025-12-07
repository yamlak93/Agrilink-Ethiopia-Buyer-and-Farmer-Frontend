// src/components/ConfirmationModal.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ConfirmationModal = ({
  isVisible,
  message,
  onClose,
  onConfirm,
  loading,
}) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1051 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0 rounded-3">
            <div className="modal-header border-0 pb-2">
              <h5 className="modal-title fw-bold text-danger">
                Confirm Delete
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
                aria-label="Close"
              />
            </div>

            <div className="modal-body pt-2">
              <p className="mb-0 text-dark">{message}</p>
            </div>

            <div className="modal-footer border-0 pt-2">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger px-4"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
