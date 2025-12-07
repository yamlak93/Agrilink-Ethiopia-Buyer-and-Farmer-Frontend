// src/components/BankDetailsModal.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const BankDetailsModal = ({
  isOpen,
  onClose,
  bank,
  chapaBanks = [],
  onSave,
}) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    bankId: "",
    accountNumber: "",
    accountName: "",
    isDefault: true, // ← Always default
  });

  const [error, setError] = useState("");

  // Populate form when bank data changes
  useEffect(() => {
    if (bank && isOpen) {
      setForm({
        bankId: bank.bankId?.toString() || "",
        accountNumber: bank.accountNumber || "",
        accountName: bank.accountName || "",
        isDefault: true, // Force default
      });
      setError("");
    }
  }, [bank, isOpen]);

  if (!isOpen || !bank) return null;

  const selectedBank = chapaBanks.find((b) => b.id === parseInt(form.bankId));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSave = () => {
    if (!selectedBank) {
      setError(t("errors.selectBank"));
      return;
    }

    const digits = form.accountNumber.replace(/\D/g, "");
    if (digits.length !== selectedBank.acct_length) {
      setError(
        t("errors.accountLength", {
          expected: selectedBank.acct_length,
          actual: digits.length,
        })
      );
      return;
    }

    onSave({
      ...form,
      accountNumber: digits,
      bankId: Number(form.bankId),
    });
    onClose();
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header bg-success text-white d-flex justify-content-between align-items-center">
            <h5 className="modal-title mb-0">
              {t("settings.profile.editBank")}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              style={{ filter: "invert(1)" }}
            />
          </div>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label">{t("farmer.bank")}</label>
              <select
                className="form-select"
                name="bankId"
                value={form.bankId}
                onChange={handleChange}
              >
                <option value="">-- {t("farmer.selectBank")} --</option>
                {chapaBanks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.acct_length} {t("common.digits")})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">{t("farmer.accountNumber")}</label>
              <input
                type="text"
                className={`form-control ${error ? "is-invalid" : ""}`}
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                placeholder={t("farmer.accountNumberPlaceholder")}
                inputMode="numeric"
              />
              {error && <div className="invalid-feedback d-block">{error}</div>}
              {selectedBank && (
                <small className="text-muted">
                  {t("farmer.accountLengthHint", {
                    length: selectedBank.acct_length,
                  })}
                </small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">{t("farmer.accountName")}</label>
              <input
                type="text"
                className="form-control"
                name="accountName"
                value={form.accountName}
                onChange={handleChange}
                placeholder={t("farmer.accountNamePlaceholder")}
              />
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
                id="isDefault"
              />
              <label className="form-check-label" htmlFor="isDefault">
                {t("settings.profile.setDefault")}
              </label>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={handleSave}>
                {t("common.update")}
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                {t("common.cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsModal;
