import React from "react";

const SummaryCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="col-md-3 mb-3">
      <div className="card p-3 shadow-sm h-100">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6>{title}</h6>
            <h4 className="fw-bold">{value}</h4>
            <small className="text-muted">{subtitle}</small>
          </div>
          <div className="fs-3">{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
