import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, Globe, Mail, Phone } from "lucide-react";
import logoGreen from "../assets/logoGreen.png";
import axios from "axios";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function LoginPage() {
  const { t, i18n } = useTranslation(); // Initialize i18n translation
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "", // Combined field for email or phone
    password: "",
    role: "Buyer",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("userLanguage") || "en"
  ); // Default to saved or English
  const navigate = useNavigate();

  // Handle language change
  const handleLanguageSelect = (value) => {
    i18n.changeLanguage(value); // Update language
    setSelectedLanguage(value); // Update state
    localStorage.setItem("userLanguage", value); // Persist in localStorage
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

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
    } else {
      try {
        const payload = { ...formData, role: formData.role };
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          payload
        );
        setSuccess(t("auth.loginSuccess")); // ✅ use translated success message
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Immediate redirect on success
        navigate(`/${formData.role.toLowerCase()}/dashboard`);
      } catch (err) {
        setErrors({
          general: err.response?.data?.message || t("errors.loginFailed"),
        });
      }
    }
  };

  // Effect to clear errors after 3 seconds
  useEffect(() => {
    if (errors.general || Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
    // Set initial language on mount
    if (selectedLanguage && ["en", "am", "om"].includes(selectedLanguage)) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [errors, selectedLanguage, i18n]);

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 position-relative"
      style={{
        background: "linear-gradient(135deg, #e8f5e9, #ffffff, #f1f8e9)",
        overflow: "hidden",
      }}
    >
      {/* Decorative organic shapes */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "250px",
          height: "250px",
          background: "rgba(46, 204, 113, 0.25)",
          top: "-80px",
          left: "-80px",
          filter: "blur(80px)",
        }}
      ></div>
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "250px",
          height: "250px",
          background: "rgba(76, 175, 80, 0.25)",
          bottom: "-80px",
          right: "-80px",
          filter: "blur(80px)",
        }}
      ></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            {/* Logo & Title */}
            <div className="d-flex align-items-center justify-content-center mb-4 animate-fadeIn">
              <img
                src={logoGreen}
                alt="AgriLink logo"
                className="img-fluid"
                style={{ maxWidth: "70px" }}
              />
              <h1 className="ms-2 fw-bold text-success">AgriLink Ethiopia</h1>
            </div>

            {/* Glassmorphism Card */}
            <div
              className="card border-0 shadow-lg animate-fadeInUp"
              style={{
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="card-body p-4">
                {/* Language Selector */}
                <div className="mb-3">
                  <label className="form-label fw-medium small text-dark">
                    <Globe size={16} className="me-1" />
                    {t("common.language")}
                  </label>
                  <select
                    className="form-select form-select-sm rounded"
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageSelect(e.target.value)}
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
                <h4 className="fw-bold text-dark">{t("auth.welcome")}</h4>
                <p className="text-muted small mb-4">{t("auth.loginTitle")}</p>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                  {/* Role Selector */}
                  <div className="mb-3">
                    <label className="form-label fw-medium small text-dark">
                      <User size={16} className="me-1" />
                      {t("common.role")}
                    </label>
                    <select
                      name="role"
                      className={`form-select ${
                        errors.role ? "is-invalid" : ""
                      }`}
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="Buyer">{t("roles.buyer")}</option>
                      <option value="Farmer">{t("roles.farmer")}</option>
                    </select>
                  </div>

                  {/* Identifier (Email or Phone) */}
                  <div className="mb-3">
                    <label className="form-label fw-medium small text-dark">
                      {formData.role === "Buyer" ? (
                        <>
                          <Mail size={16} className="me-1" />
                          {t("auth.loginEmailorPhone")}
                        </>
                      ) : (
                        <>
                          <Phone size={16} className="me-1" />
                          {t("common.phone")}
                        </>
                      )}
                    </label>
                    <input
                      type="text"
                      name="identifier"
                      className={`form-control ${
                        errors.identifier ? "is-invalid" : ""
                      }`}
                      placeholder={
                        formData.role === "Buyer"
                          ? "your.email@example.com or 0900000000"
                          : "0900000000"
                      }
                      value={formData.identifier}
                      onChange={handleChange}
                    />
                    {errors.identifier && (
                      <div className="invalid-feedback">
                        {errors.identifier}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-medium small text-dark">
                      <Lock size={16} className="me-1" />
                      {t("auth.password")}
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={() => setShowPassword(!showPassword)}
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
                    <div className="text-end mt-1">
                      <Link
                        to="/forgot-password"
                        className="text-success small text-decoration-none"
                      >
                        {t("auth.forgotPassword")}
                      </Link>
                    </div>
                  </div>

                  {/* Login Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn fw-semibold text-white"
                      style={{
                        borderRadius: "30px",
                        background: "linear-gradient(45deg, #2ecc71, #27ae60)",
                        transition: "0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.background =
                          "linear-gradient(45deg, #27ae60, #219653)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.background =
                          "linear-gradient(45deg, #2ecc71, #27ae60)")
                      }
                    >
                      {t("auth.login")}
                    </button>
                  </div>
                </form>

                {/* Register Link */}
                <p className="text-center text-muted small mt-3">
                  {t("auth.noAccount")}{" "}
                  <Link
                    to="/register"
                    className="text-success fw-medium text-decoration-none"
                  >
                    {t("auth.signup")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {success && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3 px-3 py-2 rounded text-white"
          style={{ background: "#28a745", zIndex: 1050 }}
        >
          {success}
        </div>
      )}

      {/* Error Toast */}
      {errors.general && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3 px-3 py-2 rounded text-white"
          style={{ background: "#dc3545", zIndex: 1050 }}
        >
          {errors.general}
        </div>
      )}

      {/* Custom animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }
        .animate-fadeInUp { animation: fadeIn 0.8s ease forwards; }
      `}</style>
    </div>
  );
}
