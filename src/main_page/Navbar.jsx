import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logoGreen from "../assets/logoGreen.png";
import { FaGlobe } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

const Navbar = () => {
  const [showLanguages, setShowLanguages] = useState(false);

  const handleLanguageSelect = (lang) => {
    console.log("Selected language:", lang);
    setShowLanguages(false); // Close dropdown after selection
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        backgroundColor: "transparent",
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div className="container-fluid">
        {/* Logo and Brand */}
        <Link
          to="/home"
          className="navbar-brand d-flex align-items-center gap-2"
        >
          <img src={logoGreen} width={50} alt="Logo" />
          <span className="text-success">AgriLink Ethiopia</span>
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ border: "none" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto ">
            {["Home", "About", "Contact"].map((name) => (
              <li className="nav-item" key={name}>
                <NavLink
                  to={`/${name.toLowerCase()}`}
                  className={({ isActive }) =>
                    "nav-link" +
                    (isActive ? " active text-success fw-bold" : "")
                  }
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Language Dropdown */}
          <div className="position-relative me-3">
            <button
              className="btn d-flex align-items-center gap-2 text-success"
              style={{
                borderRadius: "6px",
                border: "2px solid green",
                backgroundColor: "transparent",
                padding: "8px 12px",
              }}
              onClick={() => setShowLanguages(!showLanguages)}
            >
              <FaGlobe />
              <IoMdArrowDropdown />
            </button>

            {showLanguages && (
              <ul
                className="list-unstyled m-0 p-2"
                style={{
                  position: "absolute",
                  top: "110%",
                  right: 0,
                  background: "rgba(0, 0, 0, 0.85)",
                  borderRadius: "6px",
                  minWidth: "150px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                  zIndex: 2000,
                }}
              >
                <li>
                  <button
                    className="dropdown-item text-white"
                    style={{ background: "transparent" }}
                    onClick={() => handleLanguageSelect("en")}
                  >
                    English
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-white"
                    style={{ background: "transparent" }}
                    onClick={() => handleLanguageSelect("am")}
                  >
                    አማርኛ (Amharic)
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item text-white"
                    style={{ background: "transparent" }}
                    onClick={() => handleLanguageSelect("om")}
                  >
                    Afaan Oromoo
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* Auth Buttons */}
          <Link to="/login">
            <button
              className="btn text-success fw-semibold px-4 me-2"
              style={{
                border: "2px solid green",
                borderRadius: "8px",
                backgroundColor: "transparent",
                boxShadow: "0 1px 4px rgba(255,255,255,0.2)",
              }}
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
