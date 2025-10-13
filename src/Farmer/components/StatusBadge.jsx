import React from "react";

const getStatusStyle = (status) => {
  switch (status) {
    case "Delivered":
      return { backgroundColor: "#d1e7dd", color: "#0f5132" }; // Green
    case "In Transit":
      return { backgroundColor: "#cff4fc", color: "#055160" }; // Blue
    case "Processing":
      return { backgroundColor: "#fff3cd", color: "#664d03" }; // Yellow
    case "Pending":
      return { backgroundColor: "#f8d7da", color: "#842029" }; // Red
    default:
      return { backgroundColor: "#e2e3e5", color: "#41464b" }; // Gray
  }
};

const StatusBadge = ({ status }) => {
  const style = getStatusStyle(status);

  const badgeStyle = {
    ...style,
    padding: "0.25em 0.6em",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.8rem",
  };

  return <span style={badgeStyle}>{status}</span>;
};

export default StatusBadge;
