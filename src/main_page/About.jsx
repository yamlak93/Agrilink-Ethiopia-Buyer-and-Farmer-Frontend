import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import aboutImg from "../assets/aboutImg.png";

const About = () => {
  const glassStyle = {
    background: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)", // for Safari
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  };

  return (
    <>
      <Navbar />
      <section
        className="text-success"
        style={{
          backgroundImage: `url(${aboutImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "60px 20px",
          position: "relative",
        }}
      >
        {/* Overlay */}
        {/* <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            zIndex: 1,
          }}
        ></div> */}

        {/* Content */}
        <div
          className="container"
          style={{
            maxWidth: "950px",
            position: "relative",
            zIndex: 2,
            marginTop: "40px",
          }}
        >
          {/* Hero Section */}
          <div className="text-center mb-5" style={glassStyle}>
            <div className="p-4">
              <h2 className="fw-bold display-5 mb-3">
                🌱 Welcome to AgriLink Ethiopia
              </h2>
              <p className="lead text-muted">
                Empowering Ethiopian farmers through technology, transparency,
                and connection. AgriLink transforms agriculture into a
                collaborative, informed, and resilient ecosystem.
              </p>
            </div>
          </div>

          {/* Vision Section */}
          <div className="mb-5 p-4" style={glassStyle}>
            <h4 className="fw-bold mb-3">🚀 Our Vision</h4>
            <p className="text-muted">
              AgriLink isn't just a platform—it’s a mission-driven solution that
              connects farmers, buyers, and advisors in real time. Our
              mobile-friendly, multilingual interface reduces inefficiencies,
              empowers rural communities, and modernizes agricultural practices.
            </p>
          </div>

          {/* Features Section */}
          <div className="mb-5 p-4" style={glassStyle}>
            <h4 className="fw-bold mb-4">✨ Key Features</h4>
            <div className="row">
              <div className="col-md-6">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item bg-transparent border-0">
                    👨‍🌾 Direct farmer-buyer marketplace
                  </li>
                  <li className="list-group-item bg-transparent border-0">
                    🚚 Real-time delivery tracking
                  </li>
                  <li className="list-group-item bg-transparent border-0">
                    📦 Digital order & transaction management
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item bg-transparent border-0">
                    🌦️ Smart alerts: pest, weather, and tips
                  </li>
                  <li className="list-group-item bg-transparent border-0">
                    💳 Secure payments via Chapa
                  </li>
                  <li className="list-group-item bg-transparent border-0">
                    🔔 Multilingual notifications & accessibility
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Impact Section */}
          <div className="p-4" style={glassStyle}>
            <h4 className="fw-bold mb-3">🌍 Why It Matters</h4>
            <p className="text-muted">
              By connecting farmers directly to markets, reducing post-harvest
              losses, and integrating real-time information, AgriLink supports
              sustainable agriculture and boosts rural livelihoods.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
