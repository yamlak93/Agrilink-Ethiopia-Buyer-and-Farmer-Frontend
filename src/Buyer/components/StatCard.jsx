import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";

const StatCard = ({ title, value, description, icon, iconBgClass }) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex align-items-center">
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${iconBgClass}`}
          style={{ width: "50px", height: "50px" }}
        >
          <FontAwesomeIcon icon={icon} size="lg" className="text-white" />
        </div>
        <div>
          <p className="text-muted mb-0">{title}</p>
          <h4 className="fw-bold mb-0">{value}</h4>
          <small className="text-muted">{description}</small>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
