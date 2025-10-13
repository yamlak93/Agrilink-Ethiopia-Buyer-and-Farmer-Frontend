// components/CardItem.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CardItem = ({
  title,
  subtitle,
  badgeText,
  badgeType,
  endTop,
  endBottom,
}) => {
  return (
    <div className="card p-3 mb-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h6 className="fw-bold mb-1">{title}</h6>
          <small className="text-muted">{subtitle}</small>
        </div>
        <div className="text-end">
          {badgeText && (
            <span
              className={`badge ${
                badgeType === "warning"
                  ? "bg-warning text-dark"
                  : badgeType === "success"
                  ? "bg-success"
                  : "bg-secondary"
              }`}
            >
              {badgeText}
            </span>
          )}
          <div className="fw-bold mt-1">{endTop}</div>
          {endBottom && <small className="text-muted">{endBottom}</small>}
        </div>
      </div>
    </div>
  );
};

export default CardItem;
