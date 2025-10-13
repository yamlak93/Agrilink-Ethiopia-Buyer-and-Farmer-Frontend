import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const recommendedProducts = [
  {
    id: 1,
    name: "Organic Coffee Beans",
    location: "Yirgacheffe, Ethiopia",
    price: "850 ETB/kg",
  },
  {
    id: 2,
    name: "Organic Coffee Beans",
    location: "Yirgacheffe, Ethiopia",
    price: "850 ETB/kg",
  },
  {
    id: 3,
    name: "Organic Coffee Beans",
    location: "Yirgacheffe, Ethiopia",
    price: "850 ETB/kg",
  },
  {
    id: 4,
    name: "Premium Honey",
    location: "Bale, Ethiopia",
    price: "500 ETB/kg",
  },
];

const ProductsSection = () => {
  return (
    <div className="card shadow-sm p-4 h-100">
      <h5 className="fw-bold mb-3">Recommended Products</h5>
      <p className="text-muted mb-4">Based on your previous purchases</p>

      {/* Scrollable container */}
      <div
        className="overflow-auto"
        style={{
          maxHeight: "280px",
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",
        }}
      >
        {recommendedProducts.map((product) => (
          <div
            key={product.id}
            className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3 order-item"
            style={{
              transition: "all 0.2s ease",
            }}
          >
            <div className="d-flex align-items-center bg-success p-3 rounded">
              img
            </div>
            <div>
              <h6 className="mb-1 fw-semibold">{product.name}</h6>
              <small className="text-muted d-block">{product.location}</small>
            </div>
            <div className="text-end">
              <p className="mb-0 fw-bold text-success">{product.price}</p>
              <span className="badge bg-light text-dark">Available</span>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/products"
        className="mt-4 btn btn-outline-success w-100 fw-semibold shadow-sm"
      >
        Browse all products →
      </Link>

      {/* Transparent Scrollbar CSS */}
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
