// src/components/ProductSection.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductsSection = ({ products = [] }) => {
  const { t } = useTranslation();

  // === TRANSLATE UNIT ===
  const translateUnit = (unit) => {
    const key = unit?.toLowerCase().trim();
    return t(`units.${key}`, { defaultValue: unit });
  };

  // === TRANSLATE CITY / LOCATION ===
  const translateLocation = (location) => {
    const key = location?.toLowerCase().replace(/\s+/g, ""); // e.g. "Addis Ababa" → "addisababa"
    return t(`cities.${key}`, { defaultValue: location });
  };

  const handleProduct = () => {
    // Placeholder for future functionality
  };

  return (
    <div className="card shadow-sm p-4 h-100">
      <h5 className="fw-bold mb-3">{t("buyerDashboard.recentProducts")}</h5>
      <p className="text-muted mb-4">{t("buyerDashboard.freshFromFarmers")}</p>

      {/* Scrollable container */}
      <div
        className="overflow-auto"
        style={{
          maxHeight: "280px",
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",
        }}
      >
        {products.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted mb-0">{t("buyerDashboard.noProducts")}</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.productId}
              className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3 order-item"
              style={{
                transition: "all 0.2s ease",
              }}
              onClick={handleProduct}
            >
              {/* IMAGE */}
              <div className="d-flex align-items-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "5px",
                      objectFit: "cover",
                      border: "none",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      color: "#6c757d",
                    }}
                  >
                    {t("common.na")}
                  </div>
                )}
              </div>

              {/* PRODUCT INFO */}
              <div className="flex-grow-1 ms-3">
                <h6 className="mb-1 fw-semibold">{product.productName}</h6>
                <small className="text-muted d-block">
                  {translateLocation(product.location)}
                </small>
              </div>

              {/* PRICE + BADGE */}
              <div className="text-end">
                <p className="mb-0 fw-bold text-success">
                  {product.price} ETB/{translateUnit(product.unit)}
                </p>
                <span className="badge bg-success text-white">
                  {t("common.available")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BUTTON */}
      <Link
        to="/products"
        className="mt-4 btn btn-outline-success w-100 fw-semibold shadow-sm"
      >
        {t("navigation.browseProducts")}
      </Link>

      {/* SCROLLBAR & HOVER STYLE */}
      <style>
        {`
          .overflow-auto::-webkit-scrollbar {
            width: 6px;
          }
          .overflow-auto::-webkit-scrollbar-track {
            background: transparent;
          }
          .overflow-auto::-webkit-scrollbar-thumb {
            background-color: transparent;
          }
          .order-item:hover {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 8px;
          }
        `}
      </style>
    </div>
  );
};

export default ProductsSection;
