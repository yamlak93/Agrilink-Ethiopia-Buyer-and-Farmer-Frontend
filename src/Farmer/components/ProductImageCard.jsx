import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faExclamationCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const ProductImageCard = ({ handleImageChange, onSave }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const SUPPORTED_FORMATS = ["image/jpeg", "image/png"];

  useEffect(() => {
    // Validate if an image is required and not uploaded yet
    if (!preview && !isUploaded) {
      setError(t("products.imageRequired"));
    } else {
      setError(null);
    }
  }, [preview, isUploaded, t]);

  const handleDragOver = (e) => e.preventDefault();

  const validateFile = (file) => {
    if (!file) return false;

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError(t("products.invalidImageFormat"));
      return false;
    }
    if (file.size > MAX_SIZE) {
      setError(t("products.imageSizeExceeded"));
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      handleImageChange(file);
      setPreview(URL.createObjectURL(file));
      setIsUploaded(false); // Reset uploaded state until saved
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      handleImageChange(file);
      setPreview(URL.createObjectURL(file));
      setIsUploaded(false); // Reset uploaded state until saved
    } else {
      e.target.value = null; // Clear input for re-selection
    }
  };

  const handleSaveClick = () => {
    if (!preview) {
      setError(t("products.imageRequired"));
      return;
    }
    setIsSaving(true);
    try {
      // Simulate save action (replace with actual API call if needed)
      setTimeout(() => {
        setIsUploaded(true);
        setIsSaving(false);
        if (onSave) onSave();
        setError(t("products.imageSaveSuccess"));
      }, 1000); // Simulated delay
    } catch (err) {
      setIsSaving(false);
      setError(t("products.imageSaveFailed"));
      console.error(t("errors.saveFailed"), err);
    }
  };

  return (
    <div
      className="card h-100 shadow-sm rounded-4"
      style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
    >
      <div
        className="card-body p-4"
        onMouseEnter={(e) => {
          e.currentTarget.parentElement.style.transform = "translateY(-5px)";
          e.currentTarget.parentElement.style.boxShadow =
            "0 8px 16px rgba(0, 0, 0, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.parentElement.style.transform = "translateY(0)";
          e.currentTarget.parentElement.style.boxShadow =
            "0 4px 8px rgba(0, 0, 0, 0.05)";
        }}
      >
        <h5
          className="card-title text-primary fw-bold mb-3"
          style={{ borderBottom: "2px solid #28a745", paddingBottom: "5px" }}
        >
          {t("products.productImage")}
        </h5>
        <p className="card-text text-muted mb-4">
          {t("products.productImageSubtitle")}
        </p>

        {error && !isUploaded && (
          <div
            className="alert alert-danger d-flex align-items-center mb-3"
            role="alert"
          >
            <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
            {error}
          </div>
        )}
        {isUploaded && (
          <div
            className="alert alert-success d-flex align-items-center mb-3"
            role="alert"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
            {error || t("products.imageSaveSuccess")}
          </div>
        )}

        <div
          className="border border-2 border-dashed rounded-3 p-5 text-center mt-3 position-relative"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ backgroundColor: "#f8faf8", minHeight: "250px" }}
        >
          {preview ? (
            <div className="mb-3">
              <img
                src={preview}
                alt={t("products.productPreviewAlt")}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "200px", objectFit: "contain" }}
              />
            </div>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faUpload}
                className="fa-3x text-muted mb-3"
                style={{ color: "#28a745" }}
              />
              <p className="text-muted fw-medium">
                {t("products.uploadPrompt")}
              </p>
              <p className="text-muted">{t("products.dragDrop")}</p>
              <p className="text-muted small">
                {t("products.imageRequirements")}
              </p>
            </>
          )}

          <input
            type="file"
            id="file-upload"
            className="d-none"
            onChange={handleFileSelect}
            accept="image/jpeg,image/png"
            required
          />
          <label
            htmlFor="file-upload"
            className="btn btn-outline-primary mt-3"
            style={{ padding: "8px 20px" }}
          >
            {preview ? t("products.changeImage") : t("products.selectImage")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductImageCard;
