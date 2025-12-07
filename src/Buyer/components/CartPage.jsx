// src/pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link, useLocation } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart, MapPin } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";

const API_BASE = "http://localhost:5000/api";

const CartPage = () => {
  const { t } = useTranslation();

  // === TRANSLATE UNIT ===
  const translateUnit = (unit) => {
    if (!unit) return "";
    const key = unit.toLowerCase().trim();
    return t(`units.${key}`, { defaultValue: unit });
  };

  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const { basePrice, tax, deliveryFee, totalPrice, itemCount } = getCartTotal();
  const token = localStorage.getItem("token");

  const location = useLocation();

  // --------------------------------------------------------------
  // 1. Detect successful cart-payment return
  // --------------------------------------------------------------
  useEffect(() => {
    const cartSuccess = localStorage.getItem("cart_payment_success");
    if (cartSuccess === "true") {
      clearCart();
      localStorage.removeItem("cart_payment_success");
      localStorage.removeItem("pending_cart_payment");
      localStorage.removeItem("pending_address");
    }
  }, [location.pathname, clearCart]);

  // --------------------------------------------------------------
  // 2. PAY NOW → open address modal
  // --------------------------------------------------------------
  const handlePayNow = () => {
    if (cartItems.length === 0) {
      alert(t("cart.alerts.empty"));
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    const txRef = `tx-${Date.now()}`;

    localStorage.setItem(
      "pending_cart_payment",
      JSON.stringify({
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        orderId,
        txRef,
      })
    );

    setShowAddressModal(true);
    setDeliveryAddress("");
    setAddressError("");
  };

  // --------------------------------------------------------------
  // 3. Submit address → initialise Chapa
  // --------------------------------------------------------------
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      setAddressError(t("cart.modal.addressError"));
      return;
    }

    setAddressLoading(true);
    setAddressError("");

    try {
      localStorage.setItem("pending_address", deliveryAddress.trim());

      const pending = JSON.parse(localStorage.getItem("pending_cart_payment"));
      const payload = {
        cartItems: pending.items,
        return_url: `${window.location.origin}/payment/result`,
      };

      const res = await fetch(`${API_BASE}/chapa/initialize-cart`, {
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
        localStorage.removeItem("pending_cart_payment");
        localStorage.removeItem("pending_address");
        alert(data.message || t("cart.alerts.initFailed"));
        setShowAddressModal(false);
      }
      localStorage.removeItem("agrilink_cart");
    } catch (err) {
      localStorage.removeItem("pending_cart_payment");
      localStorage.removeItem("pending_address");
      alert(t("cart.alerts.networkError"));
      setShowAddressModal(false);
    } finally {
      setAddressLoading(false);
    }
  };

  // --------------------------------------------------------------
  // 4. Empty-cart UI
  // --------------------------------------------------------------
  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <ShoppingCart size={80} className="text-success mb-4" />
        <h3 className="fw-bold text-dark mb-3">{t("cart.empty.title")}</h3>
        <p className="text-muted mb-4">{t("cart.empty.subtitle")}</p>
        <Link to="/products" className="btn btn-success btn-lg px-5">
          {t("cart.empty.shopNow")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container py-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="fw-bold text-success d-flex align-items-center gap-2">
            <ShoppingCart size={32} />
            {t("cart.header.title")}
            <span className="badge bg-success fs-6 ms-2">{itemCount}</span>
          </h2>
          <button
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
            onClick={clearCart}
          >
            <Trash2 size={16} /> {t("cart.header.clearCart")}
          </button>
        </div>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {cartItems.map((item, index) => (
                  <div
                    key={item.productId}
                    className={`p-4 ${
                      index !== cartItems.length - 1 ? "border-bottom" : ""
                    }`}
                  >
                    <div className="d-flex gap-3 align-items-start">
                      {/* Product Info */}
                      <div className="flex-grow-1">
                        <h6 className="fw-bold text-dark mb-1">
                          <Link
                            to={`/buyer/products/${item.productId}`}
                            className="text-decoration-none text-success-hover"
                          >
                            {item.productName}
                          </Link>
                        </h6>
                        <p className="text-muted small mb-1">
                          {t("cart.item.farmer")}:{" "}
                          <strong>{item.farmerName}</strong>
                        </p>
                        <p className="text-success fw-semibold mb-0">
                          {item.price.toLocaleString()} {t("payments.etb")} /{" "}
                          {translateUnit(item.unit)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 36, height: 36 }}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          style={{ width: 60 }}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.productId,
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          min="1"
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 36, height: 36 }}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div className="text-end" style={{ minWidth: 110 }}>
                        <p className="fw-bold text-success fs-5 mb-2">
                          {(item.price * item.quantity).toLocaleString()}{" "}
                          {t("payments.etb")}
                        </p>
                        <button
                          className="btn btn-sm btn-link text-danger p-0"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm sticky-top"
              style={{ top: 20 }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold text-success mb-4">
                  {t("cart.summary.title")}
                </h5>
                <div className="bg-light rounded-3 p-3 mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">
                      {t("cart.summary.subtotal")}
                    </span>
                    <span className="fw-semibold">
                      {basePrice.toFixed(2)} {t("payments.etb")}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">{t("cart.summary.tax")}</span>
                    <span className="fw-medium">
                      + {tax.toFixed(2)} {t("payments.etb")}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">
                      {t("cart.summary.delivery")}
                    </span>
                    <span className="fw-medium">
                      + {deliveryFee.toFixed(2)} {t("payments.etb")}
                    </span>
                  </div>
                </div>
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold fs-4">
                      {t("cart.summary.total")}
                    </span>
                    <span className="fw-bold fs-4 text-success">
                      {totalPrice.toFixed(2)} {t("payments.etb")}
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-success w-100 mt-4 py-3 fw-bold text-uppercase shadow-sm"
                  onClick={handlePayNow}
                >
                  {t("cart.summary.payNow")}
                </button>
                <Link
                  to="/products"
                  className="btn btn-outline-success w-100 mt-2"
                >
                  {t("cart.summary.continueShopping")}
                </Link>
                <div className="alert alert-success-subtle mt-3 p-2 text-center">
                  <small className="text-success">
                    {t("cart.summary.secureCheckout")}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === DELIVERY ADDRESS MODAL === */}
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
                  <MapPin size={22} /> {t("cart.modal.title")}
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
                      {t("cart.modal.label")}
                    </label>
                    <textarea
                      className="form-control border-success-subtle"
                      rows="4"
                      placeholder={t("cart.modal.placeholder")}
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        setAddressError("");
                      }}
                      disabled={addressLoading}
                      required
                      style={{ resize: "none" }}
                    />
                    {addressError && (
                      <div className="text-danger small mt-1">
                        {addressError}
                      </div>
                    )}
                  </div>
                  <small className="text-muted">{t("cart.modal.note")}</small>
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
                    className="btn btn-success px-5"
                    disabled={addressLoading}
                  >
                    {addressLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {t("common.processing")}
                      </>
                    ) : (
                      t("cart.modal.proceed")
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .text-success-hover:hover {
          color: #198754 !important;
          text-decoration: underline !important;
        }
        .btn-outline-secondary:hover {
          background-color: #f8f9fa;
        }
        .card {
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
};

export default CartPage;
