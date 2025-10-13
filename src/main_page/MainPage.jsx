import React from "react";

import CountUp from "react-countup";
import heroImg from "../assets/heroImg.jpg";
import { Link } from "react-router-dom";

import "../index.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainPage = () => {
  return (
    <>
      {/*Navigation bar and other components*/}

      <Navbar />
      <section
        className="text-success d-flex align-items-center justify-content-center"
        style={{
          height: "100vh",
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Overlay for dimming background */}
        {/* <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.22)", // light semi-transparent overlay
            zIndex: 1,
          }}
        ></div> */}

        {/* Content layer */}
        <div className="text-center text-light" style={{ zIndex: 2 }}>
          <h1 className="display-5 fw-bold" style={{ fontSize: "5rem" }}>
            Connecting Farmers and Buyers Across Ethiopia
          </h1>
          <p className="lead">
            AgriLink Ethiopia provides a direct marketplace for farmers to sell{" "}
            <br />
            their produce and for buyers to access fresh, local products.
          </p>

          <div className="mt-4">
            <Link to="/register">
              <button
                className="btn text-dark fw-semibold px-4 me-3"
                style={{
                  border: "2px solid rgba(0, 128, 0, 0.5)",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)", // Safari
                  transition: "all 0.3s ease",
                  marginRight: "25px",
                  width: "150px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.4)";
                  e.target.style.border = "2px solid rgba(0, 128, 0, 0.7)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.25)";
                  e.target.style.border = "2px solid rgba(0, 128, 0, 0.5)";
                }}
              >
                Start now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* H O W  I T  W O R K S  S E C T I O N */}
      <section
        style={{
          backgroundColor: "#f9f9f9",
          padding: "80px 20px",
          height: "100vh",
        }}
      >
        <div className="text-center mb-5">
          <h2
            className="fw-bold text-success display-6"
            style={{ fontSize: "3rem" }}
          >
            How AgriLink Ethiopia Works
          </h2>
          <p className="lead text-muted">
            Seamlessly connect farmers with buyers through a trusted digital
            marketplace.
          </p>
        </div>

        <div className="container">
          <div className="row justify-content-center g-4">
            {/* Step 1 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4 hover-scale">
                <div className="mb-3 fs-1 text-success">👨‍🌾</div>
                <h4 className="fw-semibold text-dark mb-2">Farmers Register</h4>
                <p className="text-muted">
                  Local farmers create digital profiles and showcase their fresh
                  produce to potential buyers.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4 hover-scale">
                <div className="mb-3 fs-1 text-warning">🛒</div>
                <h4 className="fw-semibold text-dark mb-2">Buyers Browse</h4>
                <p className="text-muted">
                  Verified buyers explore and select products by type,
                  freshness, and location.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center p-4 hover-scale">
                <div className="mb-3 fs-1 text-info">🚚</div>
                <h4 className="fw-semibold text-dark mb-2">Secure Delivery</h4>
                <p className="text-muted">
                  AgriLink coordinates delivery with care and speed to ensure
                  satisfaction for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* G E T  S T A T E D  S E C T I O N  */}
      <section
        className="d-flex flex-wrap align-items-center justify-content-between"
        style={{
          padding: "80px 20px",
          backgroundColor: "#fff",
          height: "100vh",
        }}
      >
        <div className="col-md-6 mb-5 mb-md-0">
          <h2 className="fw-bold text-success display-5 mb-3">
            Ready to Make a Difference?
          </h2>
          <p className="text-muted lead">
            Join the AgriLink community and start connecting farmers and buyers
            today. Whether you're here to sell, purchase, or support local
            agriculture getting started is simple.
          </p>
          <ul className="list-unstyled mt-4">
            <li className="mb-3">✅ Create your free account</li>
            <li className="mb-3">🌾 Set up your farmer or buyer profile</li>
            <li className="mb-3">📦 Begin browsing or listing fresh produce</li>
          </ul>
          <Link to="/register" className="btn btn-success btn-lg mt-4">
            Get Started Now
          </Link>
        </div>

        <div className="col-md-5">
          <div className="row g-4">
            <div className="col-6">
              <div className="bg-light border rounded text-center p-4 shadow-sm stat-card">
                <h3 className="fw-bold text-success mb-1">
                  <CountUp end={2340} duration={2} />+
                </h3>
                <p className="text-muted small">Farmers Registered</p>
              </div>
            </div>

            <div className="col-6">
              <div className="bg-light border rounded text-center p-4 shadow-sm stat-card">
                <h3 className="fw-bold text-warning mb-1">
                  <CountUp end={1820} duration={2.2} />+
                </h3>
                <p className="text-muted small">Successful Deliveries</p>
              </div>
            </div>

            <div className="col-6">
              <div className="bg-light border rounded text-center p-4 shadow-sm stat-card">
                <h3 className="fw-bold text-info mb-1">
                  <CountUp end={350} duration={1.5} />+
                </h3>
                <p className="text-muted small">Active Buyers</p>
              </div>
            </div>

            <div className="col-6">
              <div className="bg-light border rounded text-center p-4 shadow-sm stat-card">
                <h3 className="fw-bold text-primary mb-1">
                  <CountUp end={98} duration={1.2} />%
                </h3>
                <p className="text-muted small">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* F O O T E R */}
      <Footer />
    </>
  );
};

export default MainPage;
