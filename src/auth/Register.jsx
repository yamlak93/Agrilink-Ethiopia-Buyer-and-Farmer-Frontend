import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import logoGreen from "../assets/logoGreen.png";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function RegistrationPage() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (name === "role" && value === "Farmer") {
      setFormData((prev) => ({ ...prev, role: value, email: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate required fields
    if (!formData.name.trim()) newErrors.name = t("errors.required");
    if (!formData.phone.trim()) newErrors.phone = t("errors.required");
    if (!formData.location.trim()) newErrors.location = t("errors.required");
    if (!formData.password.trim()) newErrors.password = t("errors.required");
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = t("errors.required");
    if (!formData.role) newErrors.role = t("errors.required");

    // Additional validations
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = t("errors.invalidPhone");
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = t("errors.passwordMin6");
    }
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = t("errors.passwordMismatch");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      setSuccess(t("auth.signupSuccess"));
      setErrors({});
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || t("auth.signupFailed"),
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
                {t("app.title")}
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
                    className="form-select form-select-sm rounded-pill custom-dropdown"
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageSelect(e.target.value)}
                    aria-label={t("common.language")}
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #2ecc71",
                      transition: "all 0.3s ease",
                      paddingRight: "2.5rem",
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
                  {t("auth.signupTitle")}
                </h4>
                <p
                  className="text-muted small mb-4 animate-fadeIn"
                  style={{ animationDelay: "0.3s" }}
                >
                  {t("auth.enterDetails")}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                  {/* Full Name */}
                  <div
                    className="mb-4 animate-fadeIn"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <User size={18} className="me-2" />
                      {t("common.fullName")}
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-white border-end-0"
                        style={{ borderColor: "#2ecc71" }}
                      >
                        <User size={18} className="text-success" />
                      </span>
                      <input
                        name="name"
                        type="text"
                        className="form-control rounded-end-pill"
                        placeholder={t("common.fullNamePlaceholder")}
                        value={formData.name}
                        onChange={handleChange}
                        aria-label={t("common.fullName")}
                        aria-describedby={
                          errors.name ? "name-error" : undefined
                        }
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid #2ecc71",
                          transition: "all 0.3s ease",
                        }}
                      />
                    </div>
                    {errors.name && (
                      <div className="text-danger small mt-1" id="name-error">
                        {errors.name}
                      </div>
                    )}
                  </div>

                  {/* Role Selector */}
                  <div
                    className="mb-4 animate-fadeIn"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <User size={18} className="me-2" />
                      {t("common.role")}
                    </label>
                    <div className="d-flex gap-3">
                      <div className="form-check custom-radio">
                        <input
                          type="radio"
                          name="role"
                          id="farmer"
                          value="Farmer"
                          className="form-check-input"
                          checked={formData.role === "Farmer"}
                          onChange={handleChange}
                          aria-label={t("roles.farmer")}
                          aria-describedby={
                            errors.role ? "role-error" : undefined
                          }
                        />
                        <label
                          htmlFor="farmer"
                          className="form-check-label d-flex align-items-center custom-radio-label"
                          style={{
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid #2ecc71",
                            borderRadius: "20px",
                            padding: "8px 12px",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {t("roles.farmer")}
                        </label>
                      </div>
                      <div className="form-check custom-radio">
                        <input
                          type="radio"
                          name="role"
                          id="buyer"
                          value="Buyer"
                          className="form-check-input"
                          checked={formData.role === "Buyer"}
                          onChange={handleChange}
                          aria-label={t("roles.buyer")}
                          aria-describedby={
                            errors.role ? "role-error" : undefined
                          }
                        />
                        <label
                          htmlFor="buyer"
                          className="form-check-label d-flex align-items-center custom-radio-label"
                          style={{
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid #2ecc71",
                            borderRadius: "20px",
                            padding: "8px 12px",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {t("roles.buyer")}
                        </label>
                      </div>
                    </div>
                    {errors.role && (
                      <div className="text-danger small mt-1" id="role-error">
                        {errors.role}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div
                    className="mb-4 animate-fadeIn"
                    style={{ animationDelay: "0.6s" }}
                  >
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <Phone size={18} className="me-2" />
                      {t("common.phone")}
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-white border-end-0"
                        style={{ borderColor: "#2ecc71" }}
                      >
                        <Phone size={18} className="text-success" />
                      </span>
                      <input
                        name="phone"
                        type="tel"
                        className="form-control rounded-end-pill"
                        placeholder={t("common.phonePlaceholder")}
                        value={formData.phone}
                        onChange={handleChange}
                        aria-label={t("common.phone")}
                        aria-describedby={
                          errors.phone ? "phone-error" : undefined
                        }
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid #2ecc71",
                          transition: "all 0.3s ease",
                        }}
                      />
                    </div>
                    {errors.phone && (
                      <div className="text-danger small mt-1" id="phone-error">
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  {formData.role === "Buyer" && (
                    <div
                      className="mb-4 animate-fadeIn"
                      style={{ animationDelay: "0.7s" }}
                    >
                      <label className="form-label fw-semibold text-dark d-flex align-items-center">
                        <Mail size={18} className="me-2" />
                        {t("common.email")}
                      </label>
                      <div className="input-group">
                        <span
                          className="input-group-text bg-white border-end-0"
                          style={{ borderColor: "#2ecc71" }}
                        >
                          <Mail size={18} className="text-success" />
                        </span>
                        <input
                          name="email"
                          type="email"
                          className="form-control rounded-end-pill"
                          placeholder={t("common.emailPlaceholder")}
                          value={formData.email}
                          onChange={handleChange}
                          aria-label={t("common.email")}
                          style={{
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid #2ecc71",
                            transition: "all 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div
                    className="mb-4 animate-fadeIn"
                    style={{
                      animationDelay:
                        formData.role === "Buyer" ? "0.8s" : "0.7s",
                    }}
                  >
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <MapPin size={18} className="me-2" />
                      {t("common.location")}
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-white border-end-0"
                        style={{ borderColor: "#2ecc71" }}
                      >
                        <MapPin size={18} className="text-success" />
                      </span>
                      <input
                        name="location"
                        type="text"
                        className="form-control rounded-end-pill"
                        placeholder={t("cities.addisAbaba")}
                        value={formData.location}
                        onChange={handleChange}
                        aria-label={t("common.location")}
                        aria-describedby={
                          errors.location ? "location-error" : undefined
                        }
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid #2ecc71",
                          transition: "all 0.3s ease",
                        }}
                      />
                    </div>
                    {errors.location && (
                      <div
                        className="text-danger small mt-1"
                        id="location-error"
                      >
                        {errors.location}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div
                    className="mb-4 animate-fadeIn"
                    style={{
                      animationDelay:
                        formData.role === "Buyer" ? "0.9s" : "0.8s",
                    }}
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
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        aria-label={t("auth.password")}
                        aria-describedby={
                          errors.password ? "password-error" : undefined
                        }
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
                            ? t("settings.password.hide")
                            : t("settings.password.show")
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
                      <div
                        className="text-danger small mt-1"
                        id="password-error"
                      >
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div
                    className="mb-4 animate-fadeIn"
                    style={{
                      animationDelay:
                        formData.role === "Buyer" ? "1.0s" : "0.9s",
                    }}
                  >
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <Lock size={18} className="me-2" />
                      {t("auth.confirmPassword")}
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-white border-end-0"
                        style={{ borderColor: "#2ecc71" }}
                      >
                        <Lock size={18} className="text-success" />
                      </span>
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="********"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        aria-label={t("auth.confirmPassword")}
                        aria-describedby={
                          errors.confirmPassword
                            ? "confirmPassword-error"
                            : undefined
                        }
                        style={{
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid #2ecc71",
                          transition: "all 0.3s ease",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-success rounded-start-0 rounded-pill"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? t("settings.password.hide")
                            : t("settings.password.show")
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div
                        className="text-danger small mt-1"
                        id="confirmPassword-error"
                      >
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {/* Register Button */}
                  <div
                    className="d-grid mb-4 animate-fadeIn"
                    style={{
                      animationDelay:
                        formData.role === "Buyer" ? "1.1s" : "1.0s",
                    }}
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
                      {isSubmitting ? t("common.updating") : t("auth.signup")}
                    </button>
                  </div>

                  {/* Login Link */}
                  <p
                    className="text-center text-muted small animate-fadeIn"
                    style={{
                      animationDelay:
                        formData.role === "Buyer" ? "1.2s" : "1.1s",
                    }}
                  >
                    {t("auth.haveAccount")}{" "}
                    <Link
                      to="/login"
                      className="text-success fw-medium text-decoration-none hover-underline"
                    >
                      {t("auth.login")}
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
        .custom-radio-label {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .custom-radio-label:hover {
          transform: scale(1.05);
          background: rgba(46, 204, 113, 0.1) !important;
        }
        .form-check-input:checked + .custom-radio-label {
          background: rgba(46, 204, 113, 0.2) !important;
          border-color: #27ae60 !important;
        }
        .form-check-input:focus + .custom-radio-label {
          box-shadow: 0 0 8px rgba(46, 204, 113, 0.4);
        }
        .custom-dropdown {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232ecc71' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 16px;
        }
        .custom-dropdown:hover {
          transform: scale(1.02);
        }
        .custom-dropdown:focus {
          transform: scale(1.02);
          border-color: #2ecc71 !important;
          box-shadow: 0 0 8px rgba(46, 204, 113, 0.4) !important;
          background: rgba(255, 255, 255, 1) !important;
        }
        @media (max-width: 576px) {
          .card-body {
            padding: 1.5rem !important;
          }
          .col-md-7 {
            padding: 0 1rem;
          }
          button, .form-select, .form-control {
            font-size: 0.9rem;
            padding: 10px;
          }
          .custom-radio-label {
            padding: 6px 10px;
            font-size: 0.9rem;
          }
          .custom-dropdown {
            background-position: right 0.75rem center;
            background-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
