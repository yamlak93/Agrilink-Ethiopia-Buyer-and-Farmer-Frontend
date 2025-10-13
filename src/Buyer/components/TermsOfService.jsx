import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 text-primary fw-bold">
        Terms of Service
      </h1>
      <div
        className="card p-4 shadow-sm"
        style={{ background: "#f8f9fa", borderRadius: "10px" }}
      >
        <h4 className="text-dark mb-3">Welcome to Our Platform</h4>
        <p className="text-muted">
          These Terms of Service ("Terms") govern your use of our website and
          services provided by [Your Company Name]. By accessing or using our
          platform, you agree to be bound by these Terms. If you do not agree,
          please do not use our services.
        </p>

        <h5 className="text-dark mt-4">1. Acceptance of Terms</h5>
        <p className="text-muted">
          By using our platform, you confirm that you are at least 18 years old
          and have the legal capacity to enter into this agreement. We reserve
          the right to update these Terms at any time, and continued use
          constitutes acceptance of the revised Terms.
        </p>

        <h5 className="text-dark mt-4">2. Use of Services</h5>
        <p className="text-muted">
          You may use our platform to purchase agricultural products as offered.
          You agree not to use the platform for any unlawful purposes or to
          infringe on the rights of others. Unauthorized access or misuse may
          result in termination of your account.
        </p>

        <h5 className="text-dark mt-4">3. Payment and Delivery</h5>
        <p className="text-muted">
          All transactions are processed securely via Chapa. Prices include a
          15% tax, and an optional 2% delivery fee may apply. Delivery is
          available within the listed locations, subject to availability. We are
          not liable for delays caused by external factors.
        </p>

        <h5 className="text-dark mt-4">4. Intellectual Property</h5>
        <p className="text-muted">
          All content on this platform, including text, images, and logos, is
          the property of [Your Company Name] and protected by copyright laws.
          You may not reproduce or distribute any content without prior written
          consent.
        </p>

        <h5 className="text-dark mt-4">5. Limitation of Liability</h5>
        <p className="text-muted">
          Agrilink Ethiopia is not responsible for any indirect damages arising
          from the use of our services. Our liability is limited to the amount
          paid for the product in question.
        </p>

        <p className="text-muted mt-4">
          For any questions, contact us at{" "}
          <a href="mailto:support@yourcompany.com" className="text-success">
            support@yourcompany.com
          </a>
          .
        </p>
        <div className="text-center mt-4">
          <Link
            to="/products"
            className="btn btn-primary"
            style={{
              background: "#28a745",
              border: "none",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
