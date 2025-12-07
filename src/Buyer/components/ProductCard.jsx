// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product }) => {
  const { t } = useTranslation();

  const imageSrc =
    product.imageUrl || product.image
      ? product.imageUrl || `data:image/jpeg;base64,${product.image}`
      : null;

  // === TRANSLATE UNIT ===
  const translateUnit = (unit) => {
    const key = unit?.toLowerCase().trim();
    return t(`units.${key}`, { defaultValue: unit });
  };

  // === TRANSLATE CITY / LOCATION ===
  const translateLocation = (location) => {
    const key = location?.toLowerCase().replace(/\s+/g, "");
    return t(`cities.${key}`, { defaultValue: location });
  };

  return (
    <Link
      to={`/product/${product.productId}`}
      className="text-decoration-none"
      style={{ display: "block" }}
    >
      <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden hover-shadow">
        <div
          className="position-relative"
          style={{ height: "180px", background: "#f8f9fa" }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.productName || product.name}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}
          {!imageSrc && (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              <i className="bi bi-image fs-1"></i>
            </div>
          )}
          <span className="position-absolute top-0 end-0 bg-success text-white px-2 py-1 small rounded-start">
            {translateUnit(product.unit)}
          </span>
        </div>

        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold text-success">
            {product.productName || product.name}
          </h6>
          <p className="text-muted small flex-grow-1">
            {product.description || t("common.noDescription")}
          </p>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted small">
              {t("common.location")}: {translateLocation(product.location)}
            </span>
            <span className="text-muted small">
              {t("roles.farmer")}: {product.farmer || product.farmerName}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="h5 fw-bold text-success mb-0">
              {product.price} {t("payments.etb")}
            </span>
            <span className="btn btn-success btn-sm rounded-pill px-3">
              {t("common.view")}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        .card-body a {
          pointer-events: none;
        }
      `}</style>
    </Link>
  );
};

export default ProductCard;
