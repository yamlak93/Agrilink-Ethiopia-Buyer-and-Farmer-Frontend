import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next"; // Import useTranslation
const ProductCard = ({
  title,
  price,
  unit,
  location,
  available,
  imageUrl,
  onViewDetails,
}) => {
  const { t, i18n } = useTranslation(); // Initialize i18n translation
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <div
            className="placeholder-image mb-3 bg-light rounded d-flex justify-content-center align-items-center"
            style={{
              height: "150px",
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Image will be set as background; fallback text removed */}
          </div>
          <h6 className="fw-bold">{title}</h6>
          <p className="text-success fw-semibold">
            {price} {t("payments.etb")} / {t(`units.${unit.toLowerCase()}`)}
          </p>
          <p className="text-muted">
            {t("common.location")}: {location}
          </p>
          <p className="text-muted">
            {available} {t(`units.${unit.toLowerCase()}`)}{" "}
            {t("common.available")}
          </p>
          <button className="btn btn-success w-100" onClick={onViewDetails}>
            {t("products.viewDetails")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
