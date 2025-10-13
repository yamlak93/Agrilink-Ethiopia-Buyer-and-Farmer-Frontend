import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Privacy = () => {
  return (
    <>
      <Navbar />
      <section
        className="text-success"
        style={{
          backgroundColor: "#f8f9fa",
          padding: "80px 20px",
          minHeight: "100vh",
        }}
      >
        <div className="container" style={{ maxWidth: "950px" }}>
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5 text-success mb-3">
              🔐 Privacy Policy
            </h2>
            <p className="lead text-muted">
              AgriLink Ethiopia values your privacy. Here’s a transparent
              breakdown of how your data is handled.
            </p>
          </div>

          {/* Section 1: What We Collect */}
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <h5 className="fw-bold mb-3">1. What We Collect</h5>
            <ul className="text-muted">
              <li>👤 Personal info: full name, phone, email, region, role</li>
              <li>📦 Product info: listings, categories, price, quantity</li>
              <li>📈 Transactions: order activity, delivery records</li>
              <li>🧠 Behavior: navigation, preferences, activity trends</li>
              <li>🌐 Location: for delivery coordinations</li>
            </ul>
          </div>

          {/* Section 2: Why We Collect It */}
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <h5 className="fw-bold mb-3">2. Why We Collect It</h5>
            <p className="text-muted mb-2">Your data helps us:</p>
            <ul className="text-muted">
              <li>✅ Personalize your experience</li>
              <li>✅ Connect farmers with buyers</li>
              <li>✅ Provide timely farming tips & alerts</li>
              <li>✅ Facilitate secure payments & deliveries</li>
            </ul>
          </div>

          {/* Section 3: Data Protection & Security */}
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <h5 className="fw-bold mb-3">3. Data Protection & Security</h5>
            <ul className="text-muted">
              <li>🔒 Passwords stored using bcrypt encryption</li>
              <li>🔐 Authenticated access with JWT tokens</li>
              <li>👮 Role-based restrictions across user types</li>
              <li>🚫 No selling or renting of personal data</li>
            </ul>
          </div>

          {/* Section 4: Your Rights */}
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <h5 className="fw-bold mb-3">4. Your Rights</h5>
            <ul className="text-muted">
              <li>✏️ Update profile or preferences anytime</li>
              <li>🗑️ Delete your account & request full data removal</li>

              <li>📜 Protected under Ethiopian data privacy policies</li>
            </ul>
          </div>

          {/* Section 5: Contact */}
          <div className="bg-white rounded shadow-sm p-4">
            <h5 className="fw-bold mb-3">5. Contact Us</h5>
            <p className="text-muted">
              Have a privacy question or concern? Reach us by visiting the
              <strong> Contact page.</strong> We respond with care and clarity.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Privacy;
