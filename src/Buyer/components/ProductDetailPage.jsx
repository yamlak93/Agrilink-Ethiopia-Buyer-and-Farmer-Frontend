import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import PaymentModal from "./PaymentModal";
import ProductCard from "./ProductCard";
import products from "../data/products"; // import shared products

const ProductDetailPage = () => {
  const { id } = useParams();

  // Get the clicked product from the shared products
  const product = products.find((p) => p.id === parseInt(id));

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [needDelivery, setNeedDelivery] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!product) return <div className="p-4">Product not found.</div>;

  // Get other products from the same farmer (excluding the current one)
  const farmerProducts = products.filter(
    (p) =>
      p.farmer.trim().toLowerCase() === product.farmer.trim().toLowerCase() &&
      p.id !== product.id
  );

  const basePrice = quantity * product.price;
  const tax = basePrice * 0.15; // 15% tax
  const deliveryFee = needDelivery ? basePrice * 0.02 : 0; // 2% delivery fee
  const totalPrice = basePrice + tax + deliveryFee;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      const newReview = {
        id: Date.now(),
        rating,
        comment,
        date: new Date().toLocaleDateString(),
      };
      setReviews([newReview, ...reviews]);
      setRating(0);
      setComment("");
    }
  };

  const handlePlaceOrder = () => setShowPaymentModal(true);
  const handleConfirmPayment = () => {
    console.log("Payment confirmed. Total: ", totalPrice);
    setShowPaymentModal(false);
  };

  return (
    <div className="container py-4">
      <Link to="/products" className="text-success mb-3 d-block">
        &larr; Back to Browse
      </Link>

      {/* Product Detail */}
      <div className="row">
        <div className="col-md-5">
          <div
            className="bg-light rounded d-flex align-items-center justify-content-center"
            style={{ height: "400px" }}
          >
            <span className="text-muted">Image Placeholder</span>
          </div>
        </div>
        <div className="col-md-7">
          <h4 className="fw-bold">{product.name}</h4>
          <p className="text-muted">{product.location}</p>
          <h5 className="text-success fw-bold">
            {product.price.toLocaleString()} ETB / {product.unit}
          </h5>
          <p className="mt-3">{product.description}</p>
          <ul className="list-unstyled mb-3">
            <li>
              <strong>Farmer:</strong> {product.farmer}
            </li>
            <li>
              <strong>Harvest Date:</strong> {product.harvestDate}
            </li>
            <li>
              <strong>Available:</strong> {product.available} {product.unit}
            </li>
          </ul>

          <div className="mb-3">
            <label className="form-label">Quantity ({product.unit})</label>
            <input
              type="number"
              className="form-control w-50"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value)))
              }
              max={product.available}
              min="1"
            />
            <small className="text-muted">
              Available: {product.available} {product.unit}
            </small>
          </div>

          <div className="mb-3">
            <strong>Total Price:</strong>{" "}
            <span className="text-success fw-bold">
              {totalPrice.toLocaleString()} ETB
            </span>
          </div>

          <button className="btn btn-success w-50" onClick={handlePlaceOrder}>
            Place Order
          </button>
          <p className="text-muted small mt-2">
            By placing an order, you agree to our{" "}
            <Link to="/terms-of-service" className="text-success">
              Terms of Service
            </Link>{" "}
            and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Farmer Info + Reviews */}
      <div className="row mt-4">
        <div
          className="col-md-6 p-4 border rounded"
          style={{
            background: "linear-gradient(135deg, #f9f9f9, #ffffff)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h6 className="text-primary fw-bold">About the Farmer</h6>
          <div className="mb-3">
            <h5 className="text-dark fw-bold mb-1">{product.farmer}</h5>
            <p className="text-muted mb-1">
              <strong>Location:</strong> {product.location}
            </p>
            <p className="text-muted mb-1">
              <strong>Phone:</strong> {product.farmerPhone}
            </p>
            <p className="text-secondary small">
              Experienced local farmer dedicated to sustainable and organic
              farming practices.
            </p>
          </div>
        </div>

        <div
          className="col-md-6 p-4 border rounded"
          style={{
            background: "linear-gradient(135deg, #f9f9f9, #ffffff)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h6 className="text-primary fw-bold">Leave a Review</h6>
          <form onSubmit={handleReviewSubmit} className="mb-4">
            <div className="mb-3">
              <label className="form-label text-dark">Rating</label>
              <div className="star-rating d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} className="me-2">
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      checked={rating === star}
                      onChange={() => setRating(star)}
                      className="d-none"
                    />
                    <span
                      className="star"
                      style={{
                        fontSize: "28px",
                        color: star <= rating ? "#ffd700" : "#e0e0e0",
                        cursor: "pointer",
                        transition: "color 0.3s",
                      }}
                    >
                      ★
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-dark">Comment</label>
              <textarea
                className="form-control border-secondary"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                style={{ background: "#f8f9fa", borderRadius: "8px" }}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                background: "#28a745",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              Submit Review
            </button>
          </form>
          {reviews.length > 0 && (
            <div>
              <h6 className="text-primary fw-bold">Reviews</h6>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="card mb-3"
                  style={{ borderRadius: "10px", border: "1px solid #e0e0e0" }}
                >
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong className="text-dark">
                          Rating: {review.rating} ★
                        </strong>
                        <p className="mb-0 text-muted small">
                          {review.comment}
                        </p>
                      </div>
                      <small className="text-muted">{review.date}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Products from same farmer */}
      {farmerProducts.length > 0 && (
        <div className="mt-5">
          <h5 className="fw-bold mb-3">More from {product.farmer}</h5>
          <div className="row g-3">
            {farmerProducts.map((fp) => (
              <div className="col-md-3" key={fp.id}>
                <ProductCard product={fp} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handleConfirmPayment}
        basePrice={basePrice}
        tax={tax}
        deliveryFee={deliveryFee}
        totalPrice={totalPrice}
        needDelivery={needDelivery}
        setNeedDelivery={setNeedDelivery}
        quantity={quantity}
        unit={product.unit}
        location={product.location}
      />
    </div>
  );
};

export default ProductDetailPage;
