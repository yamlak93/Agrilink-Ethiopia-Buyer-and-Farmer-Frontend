import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
} from "lucide-react";
import logoGreen from "../assets/logoGreen.png";
import apiClient from "../api/api";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    role: "", // no default role
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("userLanguage") || "en"
  );
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);
  const navigate = useNavigate();

  // ────────────────────── Language handling ──────────────────────
  const languages = [
    { code: "en", label: t("settings.languageList.english"), flag: "UK" },
    { code: "am", label: t("settings.languageList.amharic"), flag: "Ethiopia" },
    { code: "om", label: t("settings.languageList.oromo"), flag: "Oromia" },
  ];

  const handleLanguageSelect = (lang) => {
    i18n.changeLanguage(lang.code);
    setSelectedLanguage(lang.code);
    localStorage.setItem("userLanguage", lang.code);
    setIsLangOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ────────────────────── Form handling ──────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Role
    if (!formData.role) newErrors.role = t("errors.roleRequired");

    // Identifier
    if (!formData.identifier.trim()) {
      newErrors.identifier =
        formData.role === "Buyer"
          ? t("errors.buyerIdentifierRequired")
          : t("errors.farmerIdentifierRequired");
    }

    // Password
    if (!formData.password.trim())
      newErrors.password = t("errors.passwordRequired");

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // ──> USING apiClient (adds token, baseURL, interceptors) <──
      const response = await apiClient.post("/auth/login", formData);

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

  // ────────────────────── Toast clearing ──────────────────────
  useEffect(() => {
    if (success || errors.general) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setErrors((prev) => ({ ...prev, general: "" }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, errors.general]);

  useEffect(() => {
    if (["en", "am", "om"].includes(selectedLanguage)) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage, i18n]);

  return (
    <div
      className="d-flex align-items-center justify-content-center position-relative"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #d4f1d8, #ffffff, #e8f5e9)",
        overflow: "hidden",
        padding: "1rem 0",
      }}
    >
      {/* Decorative blobs */}
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
      />
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
      />

      <div className="container" style={{ maxWidth: "420px" }}>
        <div className="text-center mb-3">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <img
              src={logoGreen}
              alt="AgriLink logo"
              className="img-fluid"
              style={{ width: "60px", height: "60px" }}
            />
            <h1
              className="ms-2 fw-bold text-success"
              style={{ fontSize: "1.6rem" }}
            >
              AgriLink Ethiopia
            </h1>
          </div>
        </div>

        {/* Glassmorphic Card */}
        <div
          className="card border-0 shadow-lg"
          style={{
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.18)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          }}
        >
          <div className="card-body p-4">
            {/* Language selector */}
            <div className="mb-3 position-relative" ref={langRef}>
              <button
                type="button"
                className="btn btn-outline-success rounded-pill w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setIsLangOpen(!isLangOpen)}
                style={{
                  fontSize: "0.9rem",
                  padding: "0.5rem 1rem",
                  borderColor: "#2ecc71",
                }}
              >
                <Globe size={18} />
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isLangOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isLangOpen && (
                <div
                  className="position-absolute start-0 end-0 mt-1 bg-white rounded-3 shadow-lg border"
                  style={{
                    zIndex: 1000,
                    maxHeight: "200px",
                    overflowY: "auto",
                    top: "100%",
                  }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className="w-100 text-start px-3 py-2 border-0 bg-transparent hover-bg-light-success d-flex align-items-center gap-2"
                      onClick={() => handleLanguageSelect(lang)}
                      style={{
                        fontSize: "0.9rem",
                        backgroundColor:
                          selectedLanguage === lang.code
                            ? "#d4f1d8"
                            : "transparent",
                      }}
                    >
                      <span className="fw-bold">{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Heading */}
            <h4 className="fw-bold text-dark mb-1">{t("auth.welcome")}</h4>
            <p className="text-muted small mb-3">{t("auth.loginTitle")}</p>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* Role pills */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark d-flex align-items-center">
                  <User size={16} className="me-1" />
                  {t("common.role")}
                </label>
                <div className="d-flex gap-2">
                  <div className="form-check">
                    <input
                      type="radio"
                      name="role"
                      id="buyer"
                      value="Buyer"
                      className="btn-check"
                      checked={formData.role === "Buyer"}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="buyer"
                      className={`btn rounded-pill px-3 py-1 ${
                        errors.role
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                      }`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {t("roles.buyer")}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="role"
                      id="farmer"
                      value="Farmer"
                      className="btn-check"
                      checked={formData.role === "Farmer"}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="farmer"
                      className={`btn rounded-pill px-3 py-1 ${
                        errors.role
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                      }`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {t("roles.farmer")}
                    </label>
                  </div>
                </div>
                {errors.role && (
                  <div className="text-danger small mt-1">{errors.role}</div>
                )}
              </div>

              {/* Identifier */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark d-flex align-items-center">
                  {formData.role === "Buyer" ? (
                    <>
                      <Mail size={16} className="me-1" />
                      {t("auth.loginEmailorPhone")}
                    </>
                  ) : formData.role === "Farmer" ? (
                    <>
                      <Phone size={16} className="me-1" />
                      {t("common.phone")}
                    </>
                  ) : (
                    <>
                      <Mail size={16} className="me-1" />
                      {t("auth.loginEmailorPhone")}
                    </>
                  )}
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text bg-white border-end-0"
                    style={{
                      borderColor: errors.identifier ? "#dc3545" : "#2ecc71",
                    }}
                  >
                    {formData.role === "Buyer" || !formData.role ? (
                      <Mail
                        size={16}
                        className={errors.identifier ? "text-danger" : ""}
                      />
                    ) : (
                      <Phone
                        size={16}
                        className={errors.identifier ? "text-danger" : ""}
                      />
                    )}
                  </span>
                  <input
                    type="text"
                    name="identifier"
                    className={`form-control rounded-end-pill ${
                      errors.identifier ? "is-invalid" : ""
                    }`}
                    placeholder={
                      formData.role === "Buyer" || !formData.role
                        ? t("common.emailPlaceholder")
                        : t("common.phonePlaceholder")
                    }
                    value={formData.identifier}
                    onChange={handleChange}
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
                {errors.identifier && (
                  <div className="invalid-feedback d-block">
                    {errors.identifier}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark d-flex align-items-center">
                  <Lock size={16} className="me-1" />
                  {t("auth.password")}
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text bg-white border-end-0"
                    style={{
                      borderColor: errors.password ? "#dc3545" : "#2ecc71",
                    }}
                  >
                    <Lock
                      size={16}
                      className={errors.password ? "text-danger" : ""}
                    />
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
                    style={{ fontSize: "0.9rem" }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-success rounded-start-0 rounded-pill"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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

              {/* Submit */}
              <div className="d-grid mb-3">
                <button
                  type="submit"
                  className="btn text-white position-relative"
                  disabled={isSubmitting}
                  style={{
                    borderRadius: "30px",
                    background: "linear-gradient(45deg, #2ecc71, #27ae60)",
                    padding: "0.65rem",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      {t("auth.loggingIn")}
                    </>
                  ) : (
                    t("auth.login")
                  )}
                </button>
              </div>

              {/* Register link */}
              <p className="text-center text-muted small mb-0">
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

      {/* Success / error toasts */}
      {success && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3 px-4 py-3 rounded text-white animate-toast-in"
          style={{
            background: "rgba(40, 167, 69, 0.95)",
            backdropFilter: "blur(5px)",
            zIndex: 1050,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <AlertCircle size={18} className="me-2" />
          {errors.general}
        </div>
      )}

      {/* Inline CSS (unchanged) */}
      <style jsx>{`
        .hover-underline {
          position: relative;
        }
        .hover-underline::after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background: #2ecc71;
          transition: width 0.3s;
        }
        .hover-underline:hover::after {
          width: 100%;
        }
        .transition-transform {
          transition: transform 0.2s;
        }
        .rotate-180 {
          transform: rotate(180deg);
        }
        .hover-bg-light-success:hover {
          background: #d4f1d8 !important;
        }
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-toast-in {
          animation: toastIn 0.5s forwards;
        }
        .btn-check:checked + .btn {
          background: #2ecc71 !important;
          color: #fff !important;
          border-color: #2ecc71 !important;
        }
        .btn-check:focus + .btn,
        .btn-check:active + .btn {
          box-shadow: 0 0 0 0.2rem rgba(46, 204, 113, 0.5) !important;
        }
        .is-invalid ~ .input-group-text,
        .is-invalid {
          border-color: #dc3545 !important;
        }
      `}</style>
    </div>
  );
}
