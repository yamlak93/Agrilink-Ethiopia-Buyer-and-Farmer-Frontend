// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import logoGreen from "../assets/logoGreen.png";
import { FaGlobe } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import "../Css/Navbar.css";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [showLanguages, setShowLanguages] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const saved = localStorage.getItem("userLanguage");
    if (saved && ["en", "am", "om"].includes(saved)) {
      i18n.changeLanguage(saved);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [i18n]);

  const handleLanguageSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("userLanguage", code);
    setShowLanguages(false);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg glass-navbar ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="container-fluid px-4 py-2">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img src={logoGreen} alt="AgriLink" className="logo-img" />
          <span className="brand-text">{t("mainpage.navbar.brand")}</span>
        </Link>

        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-4">
            {["home", "about", "contact"].map((key) => (
              <li className="nav-item" key={key}>
                <NavLink
                  to={key === "" ? "/" : `/${key}`}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-pill transition-all ${
                      isActive ? "nav-active" : ""
                    }`
                  }
                >
                  {t(`mainpage.navbar.links.${key}`)}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Language + Login */}
          <div className="d-flex align-items-center gap-3 flex-column flex-lg-row">
            <div className="position-relative">
              <button
                className="btn-lang d-flex align-items-center gap-2 p-2 rounded-pill"
                onClick={() => setShowLanguages(!showLanguages)}
              >
                <FaGlobe className="icon-globe" />
                <span className="d-lg-none me-2">
                  {t("mainpage.navbar.language")}
                </span>
                <IoMdArrowDropdown
                  className={`icon-arrow ${showLanguages ? "rotate" : ""}`}
                />
              </button>

              {showLanguages && (
                <div className="lang-dropdown">
                  {[
                    { code: "en", key: "settings.languageList.english" },
                    { code: "am", key: "settings.languageList.amharic" },
                    { code: "om", key: "settings.languageList.oromo" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      className="lang-item"
                      onClick={() => handleLanguageSelect(lang.code)}
                    >
                      {t(lang.key)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/login" className="w-100 w-lg-auto">
              <button className="btn-login px-4 py-2 rounded-pill w-100">
                {t("auth.login")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
