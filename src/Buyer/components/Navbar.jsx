import React from "react";
import logoGreen from "../../assets/logoGreen.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  return (
    <>
      <nav
        className="navbar navbar-light bg-light shadow-sm"
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1050,
          height: "60px",
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Logo */}
          <div className="logo d-flex align-items-center">
            <img src={logoGreen} width={36} alt="Logo" className="me-2" />
            <span className="fw-bold text-success d-none d-lg-inline">
              AgriLink Ethiopia
            </span>
          </div>

          {/* Welcome Text and Right-Side Elements */}
          <div className="d-flex align-items-center">
            {/* Welcome Text */}
            <span
              className="welcome-text me-2"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px", // Smaller for mobile
                fontWeight: "600",
                color: "#2ecc71",
              }}
            >
              Welcome, Abebe
            </span>

            {/* Right-Side Elements */}
            <div className="rightside d-flex align-items-center">
              {/* Language Dropdown */}
              <select
                className="form-select me-2 bg-light text-dark"
                style={{
                  width: "80px", // Smaller width for mobile
                  height: "28px",
                  borderRadius: "6px",
                  border: "2px solid green",
                  padding: "2px",
                  fontSize: "12px", // Smaller font for mobile
                }}
                defaultValue="en"
                onChange={(e) => {
                  const selectedLang = e.target.value;
                  console.log("Selected language:", selectedLang);
                }}
              >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
                <option value="om">Afaan Oromoo</option>
              </select>

              {/* Logout Icon */}
              <Link to={"/login"}>
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  style={{ color: "red", cursor: "pointer" }}
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
