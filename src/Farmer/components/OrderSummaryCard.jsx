import React from "react";

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
        <div className="d-flex align-items-center">
          {icon && <span className="fs-3 me-3">{icon}</span>}
          <h2 className="card-title">{value}</h2>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
