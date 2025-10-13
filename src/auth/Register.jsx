import React, { useState, useEffect } from "react";
import logoGreen from "../assets/logoGreen.png";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role" && value === "Farmer") {
      setFormData((prev) => ({ ...prev, role: value, email: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = t("errors.fullNameRequired");
    if (!formData.phone.trim()) newErrors.phone = t("errors.phoneRequired");
    if (!formData.location.trim())
      newErrors.location = t("errors.locationRequired");
    if (!formData.password.trim())
      newErrors.password = t("errors.passwordRequired");
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = t("errors.confirmPasswordRequired");
    if (!formData.role) newErrors.role = t("errors.roleRequired");

    if (formData.password && formData.password.length < 6) {
      newErrors.password = t("errors.passwordLength");
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
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          formData
        );
        setSuccess(t("auth.registerSuccess")); // Translated success
        setErrors({});
        navigate("/login");
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setErrors({ general: err.response.data.message });
        } else {
          setErrors({ general: t("errors.registrationFailed") });
        }
      }
    }
  };

  // Clear errors after 3 seconds
  useEffect(() => {
    if (errors.general || Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (selectedLanguage && ["en", "am", "om"].includes(selectedLanguage)) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [errors, selectedLanguage, i18n]);

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
        position: "relative",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            {/* Logo */}
            <div className="d-flex align-items-center justify-content-center mb-4">
              <img src={logoGreen} alt="AgriLink Logo" width={65} />
              <h1 className="ms-2 h3 fw-bold text-success">
                AgriLink Ethiopia
              </h1>
            </div>

            {/* Registration Card */}
            <div
              className="card shadow-lg border-0 rounded-4 p-4"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Language Selector */}
              <div className="mb-3">
                <label className="form-label small fw-medium">
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
                  <option value="om">{t("settings.languageList.oromo")}</option>
                </select>
              </div>

              <form noValidate onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-2">
                  <label className="form-label small fw-medium">
                    {t("common.fullName")}
                  </label>
                  <input
                    name="name"
                    type="text"
                    className={`form-control form-control-sm ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    placeholder={t("common.fullNamePlaceholder")}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Role */}
                <div className="mb-3">
                  <label className="form-label small fw-medium">
                    {t("common.role")}
                  </label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        name="role"
                        id="farmer"
                        value="Farmer"
                        className="form-check-input"
                        checked={formData.role === "Farmer"}
                        onChange={handleChange}
                      />
                      <label htmlFor="farmer" className="form-check-label">
                        {t("roles.farmer")}
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="role"
                        id="buyer"
                        value="Buyer"
                        className="form-check-input"
                        checked={formData.role === "Buyer"}
                        onChange={handleChange}
                      />
                      <label htmlFor="buyer" className="form-check-label">
                        {t("roles.buyer")}
                      </label>
                    </div>
                  </div>
                  {errors.role && (
                    <div className="text-danger small mt-1">{errors.role}</div>
                  )}
                </div>

                {/* Phone */}
                <div className="mb-2">
                  <label className="form-label small fw-medium">
                    {t("common.phone")}
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className={`form-control form-control-sm ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    placeholder="+251900000000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>

                {/* Email */}
                {formData.role === "Buyer" && (
                  <div className="mb-2">
                    <label className="form-label small fw-medium">
                      {t("common.email")}
                    </label>
                    <input
                      name="email"
                      type="email"
                      className={`form-control form-control-sm ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder={t("common.emailPlaceholder")}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                )}

                {/* Location */}
                <div className="mb-2">
                  <label className="form-label small fw-medium">
                    {t("common.location")}
                  </label>
                  <input
                    name="location"
                    type="text"
                    className={`form-control form-control-sm ${
                      errors.location ? "is-invalid" : ""
                    }`}
                    placeholder={t("cities.addisAbaba")}
                    value={formData.location}
                    onChange={handleChange}
                  />
                  {errors.location && (
                    <div className="invalid-feedback">{errors.location}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-2">
                  <label className="form-label small fw-medium">
                    {t("auth.password")}
                  </label>
                  <div className="input-group input-group-sm">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="********"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        background: "linear-gradient(45deg, #2ecc71, #27ae60)",
                        color: "white",
                        border: "none",
                        borderRadius: "0 5px 5px 0",
                        padding: "0 12px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label small fw-medium">
                    {t("auth.confirmPassword")}
                  </label>
                  <div className="input-group input-group-sm">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      placeholder="********"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{
                        background: "linear-gradient(45deg, #2ecc71, #27ae60)",
                        color: "white",
                        border: "none",
                        borderRadius: "0 5px 5px 0",
                        padding: "0 12px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Register Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn fw-semibold text-white"
                    style={{
                      background: "linear-gradient(45deg, #2ecc71, #27ae60)",
                      transition: "0.3s ease",
                    }}
                  >
                    {t("auth.signup")}
                  </button>
                </div>
              </form>

              {/* Login Link */}
              <p className="mt-4 text-center text-muted small">
                {t("auth.haveAccount")}{" "}
                <Link to="/login" className="text-success text-decoration-none">
                  {t("auth.login")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      {success && (
        <div className="custom-toast bg-success text-white">{success}</div>
      )}
      {errors.general && (
        <div className="custom-toast bg-danger text-white">
          {errors.general}
        </div>
      )}
    </div>
  );
}
