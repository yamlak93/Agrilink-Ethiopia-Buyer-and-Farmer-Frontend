// components/ProductCard.js
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card h-100 shadow-sm" style={{ cursor: "pointer" }}>
        <div className="card-body">
          <div
            className="d-flex justify-content-center align-items-center bg-light mb-3"
            style={{ height: "150px" }}
          >
            <span className="text-muted">📦</span>
          </div>
          <h6 className="fw-bold">{product.name}</h6>
          <small className="text-muted d-block mb-1">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
            {product.location}
          </small>
          <p className="text-success fw-bold mb-1">
            {product.price} ETB/{product.unit}
          </p>
          <small className="text-muted d-block mb-2">
            Available: {product.available} {product.unit}
          </small>
          <small className="text-muted">Farmer: {product.farmer}</small>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
