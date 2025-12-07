// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  CreditCard,
  Star,
  Trash2,
  X,
  MapPin,
} from "lucide-react";
import ConfirmationModal from "../components/ConfirmationModal";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const API_BASE = "http://localhost:5000/api";

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // === DELIVERY ADDRESS MODAL STATES ===
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);

  const token = localStorage.getItem("token");
  let currentUserId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload.id;
    } catch (e) {
      console.error("Invalid token");
    }
  }

  // === TRANSLATE UNIT & CITY ===
  const translateUnit = (unit) =>
    t(`units.${unit?.toLowerCase().trim()}`, { defaultValue: unit });
  const translateCity = (city) =>
    t(`cities.${city?.toLowerCase().replace(/\s+/g, "")}`, {
      defaultValue: city,
    });

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const prodRes = await fetch(`${API_BASE}/buyer/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!prodRes.ok) throw new Error("Product not found");
        const productData = await prodRes.json();
        setProduct(productData);

        const farmerRes = await fetch(
          `${API_BASE}/buyer/products?farmerId=${productData.farmerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const farmerData = await farmerRes.json();
        setFarmerProducts(
          (farmerData.products || [])
            .filter((p) => p.productId !== id)
            .slice(0, 4)
        );

        const reviewRes = await fetch(
          `${API_BASE}/buyer/products/${id}/reviews`
        );
        const reviewData = await reviewRes.json();
        setReviews(reviewData.reviews || []);
      } catch (err) {
        console.error(err);
        alert(t("productDetails.errorLoad"));
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, token, t]);

  const handleAddToCart = () => {
    if (quantity > product.quantity || isAdding) return;
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, quantity);
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }, 300);
  };

  const handleBuyNow = () => {
    if (quantity > product.quantity) return;
    localStorage.setItem(
      "pending_payment",
      JSON.stringify({
        productId: product.productId,
        quantity,
        deliveryAddress: "",
        orderId: `ORD-${Date.now()}`,
      })
    );
    setShowAddressModal(true);
    setDeliveryAddress("");
    setAddressError("");
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      setAddressError(t("productDetails.addressRequired"));
      return;
    }
    setAddressLoading(true);
    setAddressError("");
    try {
      const pending = JSON.parse(localStorage.getItem("pending_payment"));
      pending.deliveryAddress = deliveryAddress.trim();
      localStorage.setItem("pending_payment", JSON.stringify(pending));

      const payload = {
        productId: product.productId,
        quantity,
        return_url: `${window.location.origin}/payment/result`,
      };

      const res = await fetch(`${API_BASE}/chapa/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        localStorage.removeItem("pending_payment");
        alert(data.message || t("productDetails.paymentFailed"));
        setShowAddressModal(false);
      }
    } catch (err) {
      localStorage.removeItem("pending_payment");
      alert(t("productDetails.networkError"));
      setShowAddressModal(false);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/buyer/products/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          stars: rating,
          reviewText: comment.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const reviewRes = await fetch(`${API_BASE}/buyer/products/${id}/reviews`);
      const data = await reviewRes.json();
      setReviews(data.reviews || []);
      setRating(0);
      setComment("");
    } catch (err) {
      alert(t("productDetails.reviewFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    setDeleting(reviewToDelete);
    try {
      const res = await fetch(
        `${API_BASE}/buyer/products/review/${reviewToDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed");
      setReviews(reviews.filter((r) => r.reviewId !== reviewToDelete));
    } catch (err) {
      alert(t("productDetails.deleteFailed"));
    } finally {
      setDeleting(null);
      setShowConfirm(false);
      setReviewToDelete(null);
    }
  };

  const closeModal = () => {
    setShowConfirm(false);
    setReviewToDelete(null);
  };

  if (loading)
    return (
      <div className="text-center py-5">{t("productDetails.loading")}</div>
    );
  if (!product) return null;

  const basePrice = quantity * product.price;
  const tax = basePrice * 0.15;
  const deliveryFee = basePrice * 0.1;
  const totalPrice = basePrice + tax + deliveryFee;

  return (
    <div className="container py-4">
      <Link to="/products" className="text-success mb-3 d-block">
        <button className="btn btn-success flex-fill">
          <FaArrowLeft className="me-2" />
          {t("productDetails.backToBrowse")}
        </button>
      </Link>

      {/* PRODUCT DETAILS */}
      <div className="row">
        <div className="col-md-5">
          <div
            className="bg-light rounded overflow-hidden shadow-sm"
            style={{ height: "400px" }}
          >
            {product.image ? (
              <img
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.productName}
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                <i className="bi bi-image fs-1"></i>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-7">
          <h4 className="fw-bold">{product.productName}</h4>
          <p className="text-muted">{translateCity(product.location)}</p>
          <h5 className="text-success fw-bold">
            {product.price} {t("payments.etb")} / {translateUnit(product.unit)}
          </h5>
          <p className="mt-3">
            {product.description || t("common.noDescription")}
          </p>

          <ul className="list-unstyled mb-3">
            <li>
              <strong>{t("productDetails.farmer")}:</strong>{" "}
              {product.farmerName}
            </li>
            <li>
              <strong>{t("productDetails.available")}:</strong>{" "}
              {product.quantity} {translateUnit(product.unit)}
            </li>
          </ul>

          <div className="mb-3">
            <label className="form-label">{t("productDetails.quantity")}</label>
            <input
              type="number"
              className="form-control w-50"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(
                    1,
                    Math.min(product.quantity, parseInt(e.target.value) || 1)
                  )
                )
              }
              min="1"
              max={product.quantity}
            />
          </div>

          <div className="mb-3 p-3 bg-light rounded">
            <strong>{t("productDetails.total")}:</strong>{" "}
            <span className="text-success fw-bold fs-5">
              {totalPrice.toFixed(2)} {t("payments.etb")}
            </span>
            <br />
            <small className="text-muted">
              {t("productDetails.tax")} (15%): {tax.toFixed(2)}{" "}
              {t("payments.etb")} | {t("productDetails.delivery")} (10%):{" "}
              {deliveryFee.toFixed(2)} {t("payments.etb")}
            </small>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-success flex-fill position-relative overflow-hidden transition-all"
              onClick={handleAddToCart}
              disabled={quantity > product.quantity || isAdding}
              style={{
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontWeight: "600",
              }}
            >
              {!isAdding && !justAdded && (
                <>
                  <ShoppingCart size={18} />
                  {t("productDetails.addToCart")}
                </>
              )}
              {isAdding && (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  />
                  {t("productDetails.adding")}
                </>
              )}
              {justAdded && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="d-flex align-items-center gap-2 text-success"
                >
                  <CheckCircle size={20} fill="#28a745" stroke="white" />
                  {t("productDetails.added")}
                </motion.div>
              )}
            </button>
            <button
              className="btn btn-success flex-fill"
              onClick={handleBuyNow}
              disabled={quantity > product.quantity}
            >
              <CreditCard size={18} className="me-2" />{" "}
              {t("productDetails.buyNow")}
            </button>
          </div>
        </div>
      </div>

      {/* MORE FROM FARMER */}
      {farmerProducts.length > 0 && (
        <div className="mt-5">
          <h5 className="fw-bold mb-3">{t("productDetails.moreFromFarmer")}</h5>
          <div className="row g-3">
            {farmerProducts.map((p) => (
              <div className="col-6 col-md-4 col-lg-3" key={p.productId}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS */}
      <div className="mt-5">
        <h5 className="fw-bold mb-4">{t("productDetails.reviewsTitle")}</h5>

        <div
          className="card shadow-sm p-4 mb-4 border-0"
          style={{ background: "linear-gradient(135deg, #f8f9fa, #ffffff)" }}
        >
          <h6 className="fw-semibold text-success">
            {t("productDetails.writeReview")}
          </h6>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-3">
              <label className="form-label">{t("productDetails.rating")}</label>
              <div className="d-flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="btn p-0"
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={28}
                      fill={star <= rating ? "#ffc107" : "none"}
                      stroke={star <= rating ? "#ffc107" : "#6c757d"}
                      className="transition-all"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                {t("productDetails.yourReview")}
              </label>
              <textarea
                className="form-control border-success-subtle"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("productDetails.reviewPlaceholder")}
                required
                style={{ resize: "none" }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success px-4"
              disabled={submitting || rating === 0 || !comment.trim()}
            >
              {submitting
                ? t("productDetails.submitting")
                : t("productDetails.submitReview")}
            </button>
          </form>
        </div>

        <div className="row g-3">
          {reviews.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-chat-square-text fs-1 text-muted"></i>
              <p className="text-muted mt-2">{t("productDetails.noReviews")}</p>
            </div>
          ) : (
            reviews.map((review) => {
              const isOwnReview =
                currentUserId && review.userId === currentUserId;
              return (
                <div key={review.reviewId} className="col-12">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: "40px",
                                height: "40px",
                                fontSize: "14px",
                              }}
                            >
                              {review.buyerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong className="d-block">
                                {review.buyerName}
                              </strong>
                              <small className="text-muted">
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </small>
                            </div>
                          </div>
                        </div>
                        {isOwnReview && (
                          <button
                            onClick={() => handleDeleteReview(review.reviewId)}
                            className="btn btn-sm btn-outline-danger p-1"
                            disabled={deleting === review.reviewId}
                            title={t("productDetails.deleteReview")}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="d-flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < review.stars ? "#ffc107" : "none"}
                            stroke={i < review.stars ? "#ffc107" : "#ced4da"}
                          />
                        ))}
                        <span className="ms-2 text-muted small">
                          {review.stars}/5
                        </span>
                      </div>

                      <p className="mb-0 text-dark">{review.reviewText}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* DELIVERY ADDRESS MODAL */}
      {showAddressModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  <MapPin size={20} /> {t("productDetails.deliveryAddress")}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddressModal(false)}
                  disabled={addressLoading}
                />
              </div>

              <form onSubmit={handleAddressSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      {t("productDetails.whereDeliver")}
                    </label>
                    <textarea
                      className="form-control border-success-subtle"
                      rows="4"
                      placeholder={t("productDetails.addressPlaceholder")}
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        setAddressError("");
                      }}
                      disabled={addressLoading}
                      required
                    />
                    {addressError && (
                      <small className="text-danger mt-1 d-block">
                        {addressError}
                      </small>
                    )}
                  </div>
                  <small className="text-muted">
                    {t("productDetails.addressNote")}
                  </small>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAddressModal(false)}
                    disabled={addressLoading}
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success px-4"
                    disabled={addressLoading}
                  >
                    {addressLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {t("productDetails.processing")}
                      </>
                    ) : (
                      t("productDetails.proceedPayment")
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW DELETE CONFIRMATION */}
      <ConfirmationModal
        isVisible={showConfirm}
        message={t("productDetails.confirmDelete")}
        onClose={closeModal}
        onConfirm={confirmDelete}
        loading={deleting !== null}
      />
    </div>
  );
};

export default ProductDetailPage;
