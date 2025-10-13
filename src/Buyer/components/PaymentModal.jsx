import React from "react";

const PaymentModal = ({
  show,
  onClose,
  onConfirm,
  basePrice,
  tax,
  deliveryFee,
  totalPrice,
  needDelivery,
  setNeedDelivery,
  quantity,
  unit,
  location,
}) => {
  if (!show) return null;

  const handleChapaDemoPayment = () => {
    // Simulate opening Chapa Demo Checkout
    const checkoutWindow = window.open(
      "https://checkout.chapa.co/checkout/payment/test-payment", // DEMO URL
      "Chapa Demo Payment",
      "width=600,height=700"
    );

    // Simulate waiting for payment
    setTimeout(() => {
      if (checkoutWindow) checkoutWindow.close();
      alert("✅ Demo payment successful via Chapa!");
      onConfirm(); // call parent confirm
    }, 3000); // after 3 sec assume payment done
  };

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      aria-labelledby="paymentModalLabel"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
          style={{
            borderRadius: "15px",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
            background: "linear-gradient(135deg, #ffffff, #f0f4f8)",
          }}
        >
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title" id="paymentModalLabel">
              Secure Payment Processing
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4">
            <h6 className="text-primary fw-bold mb-3">Order Summary</h6>
            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between">
                <span>
                  Base Price ({quantity} {unit})
                </span>
                <span>{basePrice.toLocaleString()} ETB</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Tax (15%)</span>
                <span>{tax.toLocaleString()} ETB</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Delivery Fee (2%)</span>
                <span>{deliveryFee.toLocaleString()} ETB</span>
              </li>
              <li className="list-group-item d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>{totalPrice.toLocaleString()} ETB</span>
              </li>
            </ul>
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="deliveryCheckbox"
                checked={needDelivery}
                onChange={(e) => setNeedDelivery(e.target.checked)}
              />
              <label
                className="form-check-label text-dark"
                htmlFor="deliveryCheckbox"
              >
                I need delivery to {location}
              </label>
            </div>
            <button
              className="btn btn-success w-100"
              style={{
                background: "#28a745",
                borderRadius: "8px",
                padding: "12px",
              }}
              onClick={handleChapaDemoPayment}
            >
              Pay with Chapa Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
