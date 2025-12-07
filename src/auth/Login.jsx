import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Globe,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import logoGreen from "../assets/logoGreen.png";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    role: "Buyer",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("userLanguage") || "en"
  );
  const navigate = useNavigate();

  // Handle language change
  const handleLanguageSelect = (value) => {
    i18n.changeLanguage(value);
    setSelectedLanguage(value);
    localStorage.setItem("userLanguage", value);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (formData.role === "Buyer" && !formData.identifier.trim()) {
      newErrors.identifier = t("errors.buyerIdentifierRequired");
    } else if (formData.role === "Farmer" && !formData.identifier.trim()) {
      newErrors.identifier = t("errors.farmerIdentifierRequired");
    }
    if (!formData.password.trim())
      newErrors.password = t("errors.passwordRequired");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData, role: formData.role };
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        payload
      );
      setSuccess(t("auth.loginSuccess"));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setTimeout(
        () => navigate(`/${formData.role.toLowerCase()}/dashboard`),
        1500
      );
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || t("errors.loginFailed"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (errors.general || Object.keys(errors).length > 0 || success) {
      const timer = setTimeout(() => {
        setErrors({});
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (selectedLanguage && ["en", "am", "om"].includes(selectedLanguage)) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [errors, success, selectedLanguage, i18n]);

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 position-relative"
      style={{
        background: "linear-gradient(145deg, #d4f1d8, #ffffff, #e8f5e9)",
        overflow: "hidden",
      }}
    >
      {/* Decorative organic shapes */}
      <div
        className="position-absolute rounded-circle animate-pulse"
        style={{
          width: "300px",
          height: "300px",
          background: "rgba(46, 204, 113, 0.3)",
          top: "-100px",
          left: "-100px",
          filter: "blur(90px)",
        }}
      ></div>
      <div
        className="position-absolute rounded-circle animate-pulse"
        style={{
          width: "300px",
          height: "300px",
          background: "rgba(76, 175, 80, 0.3)",
          bottom: "-100px",
          right: "-100px",
          filter: "blur(90px)",
        }}
      ></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5">
            {/* Logo & Title */}
            <div className="d-flex align-items-center justify-content-center mb-5 animate-slideInDown">
              <img
                src={logoGreen}
                alt="AgriLink logo"
                className="img-fluid"
                style={{ maxWidth: "80px", transition: "transform 0.3s ease" }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
              <h1
                className="ms-3 fw-bold text-success"
                style={{ fontSize: "2rem" }}
              >
                AgriLink Ethiopia
              </h1>
            </div>

            {/* Glassmorphism Card */}
            <div
              className="card border-0 shadow-lg animate-slideInUp"
              style={{
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="card-body p-5">
                {/* Language Selector */}
                <div
                  className="mb-4 animate-fadeIn"
                  style={{ animationDelay: "0.1s" }}
                >
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    <Globe size={18} className="me-2" />
                    {t("common.language")}
                  </label>
                  <select
                    className="form-select form-select-sm rounded-pill"
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageSelect(e.target.value)}
                    aria-label={t("common.language")}
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #2ecc71",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <option value="en">
                      {t("settings.languageList.english")}
                    </option>
                    <option value="am">
                      {t("settings.languageList.amharic")}
                    </option>
                    <option value="om">
                      {t("settings.languageList.oromo")}
                    </option>
                  </select>
                </div>

                {/* Heading */}
                <h4
                  className="fw-bold text-dark mb-2 animate-fadeIn"
                  style={{ animationDelay: "0.2s" }}
                >
                  {t("auth.welcome")}
                </h4>
                <p
                  className="text-muted small mb-4 animate-fadeIn"
                  style={{ animationDelay: "0.3s" }}
                >
                  {t("auth.loginTitle")}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                  {/* Role Selector */}
                  <div
                    className="mb-4 animate-fadeIn"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <User size={18} className="me-2" />
                      {t("common.role")}
                    </label>
                    <select
                      name="role"
                      className={`form-select rounded-pill ${
                        errors.role ? "is-invalid" : ""
                      }`}
                      value={formData.role}
                      onChange={handleChange}
                      aria-label={t("common.role")}
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #2ecc71",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <option value="Buyer">{t("roles.buyer")}</option>
                      <option value="Farmer">{t("roles.farmer")}</option>
                    </select>
                  </div>

                  {/* Identifier (Email or Phone) */}
                  <div
                    className="mb-4 animate-fadeIn"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      {formData.role === "Buyer" ? (
                        <>
                          <Mail size={18} className="me-2" />
                          {t("auth.loginEmailorPhone")}
                        </>
                      ) : (
                        <>
                          <Phone size={18} className="me-2" />
                          {t("common.phone")}
                        </>
                      )}
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-white border-end-0"
                        style={{ borderColor: "#2ecc71" }}
                      >
                        {formData.role === "Buyer" ? (
                          <Mail size={18} className="text-success" />
                        ) : (
                          <Phone size={18} className="text-success" />
                        )}
                      </span>
                      <input
                        type="text"
                        name="identifier"
                        className={`form-control rounded-end-pill ${
                          errors.identifier ? "is-invalid" : ""
                        }`}
                        placeholder={
                          formData.role === "Buyer"
                            ? t("common.emailPlaceholder")
                            : t("common.phonePlaceholder")
                        }
                        value={formData.identifier}
                        onChange={handleChange}
                        aria-label={
                          formData.role === "Buyer"
                            ? t("common.email")
                            : t("common.phone")
                        }
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid #2ecc71",
                          transition: "all 0.3s ease",
                        }}
                      />
                    </div>
                    {errors.identifier && (
                      <div className="invalid-feedback">
                        {errors.identifier}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div
                    className="mb-4 animate-fadeIn"
                    style={{ animationDelay: "0.6s" }}
                  >
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <Lock size={18} className="me-2" />
                      {t("auth.password")}
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-white border-end-0"
                        style={{ borderColor: "#2ecc71" }}
                      >
                        <Lock size={18} className="text-success" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        aria-label={t("auth.password")}
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid #2ecc71",
                          transition: "all 0.3s ease",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-success rounded-start-0 rounded-pill"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword
                            ? t("auth.hidePassword")
                            : t("auth.showPassword")
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                    <div className="text-end mt-2">
                      <Link
                        to="/forgot-password"
                        className="text-success small fw-medium text-decoration-none hover-underline"
                      >
                        {t("auth.forgotPassword")}
                      </Link>
                    </div>
                  </div>

                  {/* Login Button */}
                  <div
                    className="d-grid mb-4 animate-fadeIn"
                    style={{ animationDelay: "0.7s" }}
                  >
                    <button
                      type="submit"
                      className="btn fw-semibold text-white position-relative"
                      disabled={isSubmitting}
                      style={{
                        borderRadius: "30px",
                        background: "linear-gradient(45deg, #2ecc71, #27ae60)",
                        padding: "12px",
                        transition: "all 0.3s ease",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.background =
                          "linear-gradient(45deg, #27ae60, #219653)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.background =
                          "linear-gradient(45deg, #2ecc71, #27ae60)";
                      }}
                    >
                      {isSubmitting ? (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      {isSubmitting ? t("auth.loggingIn") : t("auth.login")}
                    </button>
                  </div>

                  {/* Register Link */}
                  <p
                    className="text-center text-muted small animate-fadeIn"
                    style={{ animationDelay: "0.8s" }}
                  >
                    {t("auth.noAccount")}{" "}
                    <Link
                      to="/register"
                      className="text-success fw-medium text-decoration-none hover-underline"
                    >
                      {t("auth.signup")}
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      {success && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3 px-4 py-3 rounded text-white animate-toast-in"
          style={{
            background: "rgba(40, 167, 69, 0.95)",
            backdropFilter: "blur(5px)",
            zIndex: 1050,
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CheckCircle size={18} className="me-2" />
          {success}
        </div>
      )}
      {errors.general && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3 px-4 py-3 rounded text-white animate-toast-in"
          style={{
            background: "rgba(220, 53, 69, 0.95)",
            backdropFilter: "blur(5px)",
            zIndex: 1050,
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <AlertCircle size={18} className="me-2" />
          {errors.general}
        </div>
      )}

      <style>{`
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInDown { animation: slideInDown 0.6s ease forwards; }
        .animate-slideInUp { animation: slideInUp 0.8s ease forwards; }
        .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }
        .animate-toast-in { animation: toastIn 0.5s ease forwards; }
        .form-control:focus, .form-select:focus {
          border-color: #2ecc71 !important;
          box-shadow: 0 0 8px rgba(46, 204, 113, 0.4) !important;
          background: rgba(255, 255, 255, 1) !important;
        }
        .input-group-text {
          background: rgba(255, 255, 255, 0.9) !important;
          border-color: #2ecc71 !important;
        }
        .form-control, .form-select {
          transition: all 0.3s ease;
        }
        .hover-underline {
          position: relative;
        }
        .hover-underline:hover:after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: -2px;
          left: 0;
          background: #2ecc71;
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s ease;
        }
        .hover-underline:hover:after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
        .spinner-border {
          vertical-align: middle;
        }
        @media (max-width: 576px) {
          .card-body {
            padding: 1.5rem !important;
          }
          .col-md-7 {
            padding: 0 1rem;
          }
          button {
            font-size: 0.9rem;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}
