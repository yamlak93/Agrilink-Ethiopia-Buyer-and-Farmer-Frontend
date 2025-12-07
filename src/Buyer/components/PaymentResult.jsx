// src/pages/PaymentResult.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  AlertCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";

const API_BASE = "http://localhost:5000/api";

const PaymentResult = () => {
  const { t } = useTranslation();

  // === TRANSLATE UNIT ===
  const translateUnit = (unit) => {
    if (!unit) return "";
    const key = unit.toLowerCase().trim();
    return t(`units.${key}`, { defaultValue: unit });
  };

  const [status, setStatus] = useState(t("paymentResult.status.verifying"));
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [finalError, setFinalError] = useState("");

  const rawQuery = window.location.search;
  const fixedQuery = rawQuery.replace(/&amp;/g, "&");
  const params = new URLSearchParams(fixedQuery);

  const tx_ref = params.get("tx_ref");
  const orderIdParam = params.get("orderId");
  const productId = params.get("productId");
  const quantity = params.get("quantity");
  const isCart = params.get("cart") === "true";

  useEffect(() => {
    const verifyAndFetch = async () => {
      if (!tx_ref || !orderIdParam) {
        setFinalError(t("paymentResult.errors.invalidLink"));
        setLoading(false);
        return;
      }

      let deliveryAddress = "";
      let storedOrderId = orderIdParam;

      if (isCart) {
        const pendingCart = localStorage.getItem("pending_cart_payment");
        deliveryAddress = localStorage.getItem("pending_address") || "";

        if (!pendingCart || !deliveryAddress.trim()) {
          setFinalError(t("paymentResult.errors.missingCart"));
          setLoading(false);
          return;
        }

        let cartData;
        try {
          cartData = JSON.parse(pendingCart);
          storedOrderId = cartData.orderId || orderIdParam;
        } catch (e) {
          setFinalError(t("paymentResult.errors.invalidCart"));
          setLoading(false);
          return;
        }

        const verifyUrl = `${API_BASE}/chapa/verify-cart`;

        try {
          const res = await fetch(verifyUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              tx_ref,
              orderId: storedOrderId,
              cartItems: cartData.items,
              deliveryAddress,
            }),
          });

          const data = await res.json();

          if (data.success) {
            localStorage.setItem("cart_payment_success", "true");
            await fetchReceipt(storedOrderId);
            localStorage.removeItem("pending_cart_payment");
            localStorage.removeItem("pending_address");
            return;
          }
        } catch (err) {
          console.warn("Network error during cart verify:", err.message);
        }

        await fetchReceipt(storedOrderId);
      } else {
        const pending = localStorage.getItem("pending_payment");
        if (pending) {
          try {
            const data = JSON.parse(pending);
            deliveryAddress = data.deliveryAddress || "";
            storedOrderId = data.orderId || orderIdParam;
          } catch (e) {
            console.error("Failed to parse pending_payment:", e);
          }
        }

        const finalOrderId = storedOrderId;

        if (deliveryAddress.trim()) {
          const verifyUrl = new URL(`${API_BASE}/chapa/verify`);
          verifyUrl.searchParams.append("tx_ref", tx_ref);
          verifyUrl.searchParams.append("orderId", finalOrderId);
          verifyUrl.searchParams.append("productId", productId);
          verifyUrl.searchParams.append("quantity", quantity);
          verifyUrl.searchParams.append("deliveryAddress", deliveryAddress);

          try {
            const res = await fetch(verifyUrl.toString(), {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            const data = await res.json();

            if (data.success) {
              await fetchReceipt(finalOrderId);
              return;
            }
          } catch (err) {
            console.warn("Network error during verify:", err.message);
          }
        }

        await fetchReceipt(finalOrderId);
      }
    };

    const fetchReceipt = async (oid) => {
      try {
        const receiptRes = await fetch(`${API_BASE}/chapa/receipt/${oid}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (receiptRes.status === 404) {
          setFinalError(t("paymentResult.errors.notFound"));
          setLoading(false);
          return;
        }

        if (!receiptRes.ok) {
          throw new Error(`HTTP ${receiptRes.status}`);
        }

        const receiptData = await receiptRes.json();

        if (receiptData.success && receiptData.receipt) {
          setReceipt(receiptData.receipt);
          setOrderId(oid);
          setStatus(t("paymentResult.status.success"));
          localStorage.removeItem("pending_payment");
        } else {
          throw new Error(receiptData.message || "Invalid receipt data");
        }
      } catch (err) {
        setFinalError(t("paymentResult.errors.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [tx_ref, orderIdParam, productId, quantity, isCart, t]);

  const generatePDF = () => {
    const input = document.getElementById("receipt");
    if (!input) return;

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      pdf.save(`AGRILINK_Receipt_${receipt?.orderId || "unknown"}.pdf`);
    });
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center p-5 bg-white rounded-3 shadow-lg">
          <Loader2
            size={56}
            className="text-success mx-auto mb-4 animate-spin"
          />
          <h4 className="fw-semibold text-dark">
            {t("paymentResult.loading.title")}
          </h4>
          <p className="text-muted mt-2">
            {t("paymentResult.loading.subtitle")}
          </p>
          <div className="mt-3 small text-success">
            <span className="spinner-grow spinner-grow-sm me-2" />
            {t("paymentResult.loading.connecting")}
          </div>
        </div>
        <style>{`
          .animate-spin { animation: spin 1.2s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const isSuccess = !!receipt;

  return (
    <div className="container py-5 bg-light min-vh-100">
      <div className="text-center mb-5">
        <div
          className={`card mx-auto shadow-lg border-5 border-top ${
            isSuccess ? "border-success" : "border-danger"
          }`}
          style={{ maxWidth: "520px" }}
        >
          <div className="card-body p-5">
            {isSuccess ? (
              <CheckCircle size={80} className="text-success mx-auto mb-4" />
            ) : (
              <XCircle size={80} className="text-danger mx-auto mb-4" />
            )}

            <h3
              className={`card-title fs-2 fw-bold mb-3 ${
                isSuccess ? "text-success" : "text-danger"
              }`}
            >
              {isSuccess ? status : t("paymentResult.failure.title")}
            </h3>

            {orderId && (
              <p className="text-muted mb-3">
                {t("paymentResult.labels.orderId")}:{" "}
                <span className="font-monospace fw-bold text-success bg-light px-2 py-1 rounded">
                  {orderId}
                </span>
              </p>
            )}

            {!isSuccess && finalError && (
              <div
                className="alert alert-warning d-flex align-items-center mt-3"
                role="alert"
              >
                <AlertCircle size={20} className="me-2 flex-shrink-0" />
                <div className="small">{finalError}</div>
              </div>
            )}

            <div className="d-grid gap-3 d-sm-flex justify-content-center mt-4">
              {isSuccess ? (
                <Link
                  to="/buyer/orders"
                  className="btn btn-success btn-lg fw-semibold shadow-sm px-4"
                >
                  {t("paymentResult.buttons.viewOrders")}
                </Link>
              ) : (
                <Link
                  to="/support"
                  className="btn btn-danger btn-lg fw-semibold shadow-sm px-4"
                >
                  {t("paymentResult.buttons.contactSupport")}
                </Link>
              )}
              <Link
                to="/products"
                className="btn btn-outline-secondary btn-lg fw-semibold px-4"
              >
                {t("paymentResult.buttons.continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {receipt && (
        <>
          <hr
            className="border-secondary border-2 border-dashed my-5 d-print-none"
            style={{ maxWidth: "800px", margin: "auto" }}
          />
          <div className="mx-auto" style={{ maxWidth: "800px" }}>
            <div
              id="receipt"
              className="card shadow-xl overflow-hidden border border-success"
            >
              <div className="bg-success text-white p-4 text-center">
                <h1 className="fs-1 fw-bolder text-uppercase mb-0">
                  AGRI LINK
                </h1>
                <p className="text-white-50 small fst-italic mb-0">
                  {t("paymentResult.receipt.slogan")}
                </p>
              </div>

              <div className="bg-light p-2 text-center small text-muted border-bottom border-success border-2">
                <p className="mb-0">{t("paymentResult.receipt.contact")}</p>
              </div>

              <div className="card-body p-4 p-md-5">
                <div className="row g-3 small bg-light p-3 rounded mb-4">
                  <div className="col-6 col-md-3">
                    <p className="fw-semibold text-muted mb-1">
                      {t("paymentResult.receipt.orderId")}
                    </p>
                    <p className="font-monospace fs-5 text-success mb-0">
                      {receipt.orderId}
                    </p>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="fw-semibold text-muted mb-1">
                      {t("paymentResult.receipt.transactionId")}
                    </p>
                    <p className="font-monospace text-success small mb-0 break-all">
                      {receipt.transactionId}
                    </p>
                  </div>
                  <div className="col-6 col-md-3">
                    <p className="fw-semibold text-muted mb-1">
                      {t("paymentResult.receipt.dateTime")}
                    </p>
                    <p className="text-dark mb-0">{receipt.date}</p>
                  </div>
                </div>

                <div className="border-bottom border-dashed border-success border-2 my-4"></div>

                <div>
                  <h3 className="fs-4 fw-bold text-dark border-start border-4 border-success ps-3 mb-4">
                    {t("paymentResult.receipt.purchaseSummary")}
                  </h3>
                  <div className="bg-success-subtle p-4 rounded-3 border border-success-subtle">
                    {receipt.products ? (
                      receipt.products.map((prod, idx) => (
                        <div
                          key={idx}
                          className="d-flex justify-content-between align-items-center mb-3"
                        >
                          <div>
                            <p className="fw-bold text-dark fs-5 mb-0">
                              {prod.productName}
                            </p>
                            <p className="small text-muted mb-0">
                              {prod.quantity} ×{" "}
                              {parseFloat(prod.unitPrice).toFixed(2)}{" "}
                              {t("payments.etb")}{" "}
                              {t("paymentResult.receipt.per")}{" "}
                              {translateUnit(prod.unit)}
                              {prod.farmerName
                                ? ` ${t("paymentResult.receipt.from")} ${
                                    prod.farmerName
                                  }`
                                : ""}
                            </p>
                          </div>
                          <p className="fw-bolder fs-4 text-success mb-0">
                            {(prod.unitPrice * prod.quantity).toFixed(2)}{" "}
                            {t("payments.etb")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="fw-bold text-dark fs-5 mb-0">
                            {receipt.product.productName}
                          </p>
                          <p className="small text-muted mb-0">
                            {receipt.product.quantity} ×{" "}
                            {parseFloat(receipt.product.unitPrice).toFixed(2)}{" "}
                            {t("payments.etb")}{" "}
                            {t("paymentResult.receipt.perUnit")}
                          </p>
                        </div>
                        <p className="fw-bolder fs-4 text-success mb-0">
                          {receipt.breakdown.basePrice} {t("payments.etb")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-success-subtle p-4 rounded-3 mt-4">
                  <div className="d-flex justify-content-between small mb-2">
                    <span className="text-dark">
                      {t("paymentResult.receipt.subtotal")}
                    </span>
                    <span className="fw-semibold text-dark">
                      {receipt.breakdown.basePrice} {t("payments.etb")}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small mb-2">
                    <span className="text-muted">
                      {t("paymentResult.receipt.tax")}
                    </span>
                    <span className="fw-medium text-dark">
                      + {receipt.breakdown.tax} {t("payments.etb")}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between small mb-2">
                    <span className="text-muted">
                      {t("paymentResult.receipt.delivery")}
                    </span>
                    <span className="fw-medium text-dark">
                      + {receipt.breakdown.deliveryFee} {t("payments.etb")}
                    </span>
                  </div>
                  <div className="border-top border-dark-subtle pt-3 mt-3">
                    <div className="d-flex justify-content-between fs-5 fw-bolder">
                      <span className="text-success">
                        {t("paymentResult.receipt.totalPaid")}
                      </span>
                      <span className="text-success">
                        {receipt.breakdown.total} {t("payments.etb")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center py-4 bg-warning-subtle rounded-3 mt-4">
                  <p className="fs-5 fw-bold text-success mb-1">
                    {t("paymentResult.receipt.thankYou")}
                  </p>
                  <p className="small text-muted mb-0">
                    {t("paymentResult.receipt.deliveryTime")}
                  </p>
                </div>
              </div>

              <div className="card-footer bg-light text-center d-print-none p-3">
                <button
                  onClick={generatePDF}
                  className="btn btn-success btn-lg fw-bold shadow-sm d-flex align-items-center mx-auto"
                >
                  <Download size={22} className="me-2" />
                  {t("paymentResult.buttons.downloadReceipt")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .border-dashed {
          border-style: dashed !important;
        }
        .break-all {
          word-break: break-all;
        }
        .font-monospace {
          font-family: SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace !important;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt,
          #receipt * {
            visibility: visible;
          }
          #receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none !important;
            box-shadow: none !important;
          }
          .d-print-none {
            display: none !important;
          }
          .bg-success,
          .bg-success-subtle,
          .bg-light,
          .bg-warning-subtle {
            background-color: #f0f0f0 !important;
            -webkit-print-color-adjust: exact;
            color: #000 !important;
          }
          .text-success,
          .text-dark,
          .text-muted {
            color: #000 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentResult;
