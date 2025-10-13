import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import contactImg from "../assets/contactImg.png";

const Contact = () => {
  const glassStyle = {
    background: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)", // Safari support
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    color: "#000",
  };

  return (
    <>
      <Navbar />
      <section
        style={{
          backgroundImage: `url(${contactImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "80px 20px",
          minHeight: "100vh",
        }}
        className="d-flex align-items-center justify-content-center"
      >
        <div
          className="container"
          style={{
            maxWidth: "900px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="text-center mb-5" style={glassStyle}>
            <div className="p-4">
              <h2 className="fw-bold display-5 text-success mb-3">
                📬 Contact Us
              </h2>
              <p className="lead text-muted">
                We'd love to hear from you. Whether you’re a farmer, buyer, or
                just curious about AgriLink Ethiopia—reach out and let's build
                something great together!
              </p>
            </div>
          </div>

          <div className="p-4" style={glassStyle}>
            <form>
              <div className="mb-4">
                <label className="form-label fw-semibold text-success">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={inputStyle}
                  placeholder="e.g Abebe Kebede"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-success">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  style={inputStyle}
                  placeholder="e.g. abebe@example.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-success">
                  Message
                </label>
                <textarea
                  className="form-control"
                  style={inputStyle}
                  rows="5"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-success px-4 py-2 fw-semibold rounded-pill"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
