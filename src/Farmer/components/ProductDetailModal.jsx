import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next"; // Import useTranslation
import {
  faTimes,
  faEdit,
  faTrash,
  faStar,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const ProductDetailModal = ({
  isVisible,
  product,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const { t, i18n } = useTranslation(); // Initialize i18n translation

  useEffect(() => {
    const fetchReviews = async () => {
      if (!isVisible || !product?.productId) return;
      setLoadingReviews(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/reviews?productId=${product.productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReviews(response.data || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [isVisible, product?.productId]);

  if (!isVisible || !product) return null;

  const imageSrc = product.imageUrl || "https://picsum.photos/800/600?random=1";

  // This function is for the harvest date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  // ✨ NEW: Function to format the review's 'createdAt' timestamp
  const formatReviewDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000; // years
    if (interval > 1) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    interval = seconds / 86400; // days
    if (interval > 1) {
      return Math.floor(interval) + `${t("common.dago")}`;
    }
    interval = seconds / 3600; // hours
    if (interval > 1) {
      return Math.floor(interval) + `${t("common.hago")}`;
    }
    interval = seconds / 60; // minutes
    if (interval > 1) {
      return Math.floor(interval) + `${t("common.mago")}`;
    }
    return "just now";
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i <= rating ? "text-warning" : "text-secondary"}
          style={{ marginRight: "2px", opacity: i <= rating ? 1 : 0.5 }}
        />
      );
    }
    return stars;
  };

  return (
    <div
      className={`modal fade ${isVisible ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered mt-3">
        <div className="modal-content shadow-lg rounded-4 border-0">
          <div className="position-relative">
            <img
              src={imageSrc}
              alt={product.title || "Product Image"}
              className="rounded-top-4"
              style={{ height: "300px", width: "100%", objectFit: "cover" }}
            />
            <button
              onClick={onClose}
              className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="p-4 p-md-5">
            {/* Product Details... */}
            <h4 className="fw-bold mb-3 text-success">
              {product.title || "Untitled Product"}
            </h4>
            <p className="text-muted fst-italic mb-2">
              {t("common.locationText")} {product.location || "Unknown"}
            </p>

            <p className="text-primary fw-semibold fs-5">
              {product.price ? `${product.price} ${t("payments.etb")}` : "N/A"}{" "}
              / {t(`units.${product.unit.toLowerCase()}`)}{" "}
            </p>

            <hr
              className="my-4"
              style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
            />

            <div className="row mb-3">
              <div className="col-md-6">
                <p className="text-muted mb-0">
                  <strong>{t("common.location")}:</strong>{" "}
                  <span className="text-dark">
                    {product.location || "Unknown"}
                  </span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="text-muted mb-0">
                  <strong>{t("common.available")}:</strong>{" "}
                  <span className="text-dark">
                    {product.available
                      ? `${product.available} ${t(
                          `units.${product.unit.toLowerCase()}`
                        )}`
                      : "N/A"}
                  </span>
                </p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <p className="text-muted mb-0">
                  <strong>{t("common.category")}:</strong>{" "}
                  <span className="text-dark">
                    {t(`categories.${product.category}`)}
                  </span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="text-muted mb-0">
                  <strong>{t("products.harvestDate")}:</strong>{" "}
                  <span className="text-dark">
                    {formatDate(product.harvestDate)}
                  </span>
                </p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <p className="text-muted mb-0">
                  <strong>{t("common.status")}:</strong>{" "}
                  <span className="text-dark">
                    {" "}
                    {t(`statuses.${product.status}`)}{" "}
                  </span>
                </p>
              </div>
            </div>

            <hr
              className="my-4"
              style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
            />

            <h6 className="fw-bold text-secondary mb-2">
              {t("products.details")}
            </h6>
            <p className="text-muted">
              {product.description ||
                `This premium ${
                  product.title?.toLowerCase() || "product"
                } is sourced directly from the farmers, ensuring the highest quality and freshness.`}
            </p>

            {/* --- REVIEW SECTION AND BUTTONS --- */}
            <div className="d-flex justify-content-between align-items-start mt-4">
              <div className="card shadow-sm p-3 flex-grow-1 border-0 bg-light">
                <h5 className="card-title mb-3 fw-bold text-success">
                  {t("common.reviews")}
                </h5>
                <div
                  className="review-list"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {loadingReviews ? (
                    <div className="d-flex justify-content-center align-items-center p-4">
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div
                        key={index}
                        className={`py-3 ${
                          index < reviews.length - 1 ? "border-bottom" : ""
                        }`}
                      >
                        {/* ✨ MODIFIED: Header for each review */}
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-2"
                              style={{
                                width: "32px",
                                height: "32px",
                                fontSize: "14px",
                              }}
                            >
                              {(review.buyerName || "A")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <strong className="text-dark me-2">
                                {review.buyerName || "Anonymous"}
                              </strong>
                              <small className="text-muted">
                                {formatReviewDate(review.createdAt)}
                              </small>
                            </div>
                          </div>
                          <div>{renderStars(review.stars || 0)}</div>
                        </div>

                        <p
                          className="text-muted mb-0 ps-1"
                          style={{ marginLeft: "40px" }}
                        >
                          {review.reviewText || "No comment provided."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted p-4">
                      <FontAwesomeIcon
                        icon={faCommentDots}
                        size="2x"
                        className="mb-2"
                      />
                      <p className="mb-0 fw-semibold">No Reviews Yet</p>
                      <small>Be the first to share your thoughts!</small>
                    </div>
                  )}
                </div>
              </div>

              {/* These buttons are unchanged */}
              <div className="ms-3 d-flex flex-column align-items-end">
                <button
                  className="btn btn-outline-primary rounded-pill mb-2"
                  onClick={() => onEdit(product)}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  {t("products.editProduct")}
                </button>
                <button
                  className="btn btn-outline-danger rounded-pill"
                  onClick={() => onDelete(product)}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                  {t("products.deleteProduct")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
