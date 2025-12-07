import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, Lock, User, Globe, Key } from "lucide-react";
import logoGreen from "../assets/logoGreen.png";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState("request"); // 'request', 'verify', 'reset'
  const [formData, setFormData] = useState({
    identifier: "",
    role: "Buyer",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]); // For 6 input boxes
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("userLanguage") || "en"
  );
  const inputRefs = useRef([]); // Refs for focusing input boxes

  // Handle language change
  const handleLanguageSelect = (value) => {
    i18n.changeLanguage(value);
    setSelectedLanguage(value);
    localStorage.setItem("userLanguage", value);
  };

  // Handle form field changes (identifier, role, passwords)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle code digit changes
  const handleCodeChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Allow only single digit or empty

    const newCodeDigits = [...codeDigits];
    newCodeDigits[index] = value;
    setCodeDigits(newCodeDigits);

    // Update formData.code
    const newCode = newCodeDigits.join("");
    setFormData((prev) => ({ ...prev, code: newCode }));
    setErrors((prev) => ({ ...prev, code: "" }));

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace and arrow key navigation
  const handleCodeKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle pasting code
  const handleCodePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, ""); // Only digits
    if (pasted.length === 6) {
      const newCodeDigits = pasted.split("").slice(0, 6);
      setCodeDigits(newCodeDigits);
      setFormData((prev) => ({ ...prev, code: newCodeDigits.join("") }));
      setErrors((prev) => ({ ...prev, code: "" }));
      inputRefs.current[5].focus();
    }
  };

  // Step 1: Request code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.identifier.trim()) {
      newErrors.identifier =
        formData.role === "Buyer"
          ? t("errors.emailOrPhoneRequired")
          : t("errors.phoneRequired");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = { identifier: formData.identifier, role: formData.role };
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        payload
      );
      setSuccess(response.data.message || t("auth.codeSent"));
      setErrors({});
      setStep("verify");
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || t("errors.codeSendFailed"),
      });
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = t("errors.codeRequired");
    else if (formData.code.length !== 6)
      newErrors.code = t("errors.code6Digits");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = { ...formData };
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-reset-code",
        payload
      );
      setSuccess(response.data.message || t("auth.codeVerified"));
      setErrors({});
      setStep("reset");
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || t("errors.invalidCode"),
      });
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.newPassword.trim())
      newErrors.newPassword = t("errors.newPasswordRequired");
    else if (formData.newPassword.length < 6)
      newErrors.newPassword = t("errors.passwordMin6");

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = t("errors.confirmPasswordRequired");

    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = t("errors.passwordMismatch");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = { ...formData };
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        payload
      );
      setSuccess(response.data.message || t("auth.passwordReset"));
      setErrors({});
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || t("errors.passwordResetFailed"),
      });
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

  // Render content for each step
  const renderStepContent = () => {
    switch (step) {
      case "request":
        return (
          <>
            <h4 className="fw-bold text-dark">{t("auth.forgotPassword")}</h4>
            <p className="text-muted small mb-4">{t("auth.enterDetails")}</p>
            <form onSubmit={handleRequestCode} noValidate>
              <div className="mb-3">
                <label className="form-label fw-medium small text-dark">
                  <User size={16} className="me-1" />
                  {t("common.role")}
                </label>
                <select
                  name="role"
                  className={`form-select ${errors.role ? "is-invalid" : ""}`}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Buyer">{t("roles.buyer")}</option>
                  <option value="Farmer">{t("roles.farmer")}</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium small text-dark">
                  {formData.role === "Buyer" ? (
                    <>
                      <Mail size={16} className="me-1" /> {t("common.email")}
                    </>
                  ) : (
                    <>
                      <Phone size={16} className="me-1" /> {t("common.phone")}
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
                      ? t("common.emailPlaceholder")
                      : t("common.phonePlaceholder")
                  }
                  value={formData.identifier}
                  onChange={handleChange}
                />
                {errors.identifier && (
                  <div className="invalid-feedback">{errors.identifier}</div>
                )}
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn fw-semibold text-white"
                  style={{
                    borderRadius: "30px",
                    background: "linear-gradient(45deg, #2ecc71, #27ae60)",
                    transition: "0.3s ease",
                  }}
                >
                  {t("auth.sendCode")}
                </button>
              </div>
            </form>
          </>
        );

      case "verify":
        return (
          <>
            <h4 className="fw-bold text-dark">{t("auth.verifyCode")}</h4>
            <p className="text-muted small mb-4">
              {formData.role === "Buyer"
                ? t("auth.codeSentToEmail")
                : t("auth.codeSentToPhone")}
            </p>
            <form onSubmit={handleVerifyCode} noValidate>
              <div className="mb-3">
                <label className="form-label fw-medium small text-dark">
                  <Key size={16} className="me-1" />
                  {t("auth.verificationCode")}
                </label>
                <div className="d-flex justify-content-center gap-2">
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      onPaste={index === 0 ? handleCodePaste : null}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className={`form-control text-center fs-4 ${
                        errors.code ? "is-invalid" : ""
                      }`}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                      }}
                      placeholder="0"
                    />
                  ))}
                </div>
                {errors.code && (
                  <div className="invalid-feedback d-block text-center">
                    {errors.code}
                  </div>
                )}
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn fw-semibold text-white"
                  style={{
                    borderRadius: "30px",
                    background: "linear-gradient(45deg, #2ecc71, #27ae60)",
                    transition: "0.3s ease",
                  }}
                >
                  {t("auth.verifyCode")}
                </button>
              </div>
            </form>
          </>
        );

      case "reset":
        return (
          <>
            <h4 className="fw-bold text-dark">{t("auth.resetPassword")}</h4>
            <p className="text-muted small mb-4">{t("auth.password")}</p>
            <form onSubmit={handleResetPassword} noValidate>
              <div className="mb-3">
                <label className="form-label fw-medium small text-dark">
                  <Lock size={16} className="me-1" /> {t("auth.password")}
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className={`form-control ${
                    errors.newPassword ? "is-invalid" : ""
                  }`}
                  placeholder="********"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                {errors.newPassword && (
                  <div className="invalid-feedback">{errors.newPassword}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium small text-dark">
                  <Lock size={16} className="me-1" />{" "}
                  {t("auth.confirmPassword")}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn fw-semibold text-white"
                  style={{
                    borderRadius: "30px",
                    background: "linear-gradient(45deg, #2ecc71, #27ae60)",
                    transition: "0.3s ease",
                  }}
                >
                  {t("auth.resetPassword")}
                </button>
              </div>
            </form>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 position-relative"
      style={{
        background: "linear-gradient(135deg, #e8f5e9, #ffffff, #f1f8e9)",
        overflow: "hidden",
      }}
    >
      {/* Decorative shapes */}
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
            {/* Logo */}
            <div className="d-flex align-items-center justify-content-center mb-4 animate-fadeIn">
              <img
                src={logoGreen}
                alt="AgriLink logo"
                className="img-fluid"
                style={{ maxWidth: "70px" }}
              />
              <h1 className="ms-2 fw-bold text-success">AgriLink Ethiopia</h1>
            </div>

            {/* Card */}
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
                    <Globe size={16} className="me-1" /> {t("common.language")}
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

                {/* Step content */}
                {renderStepContent()}

                {/* Back to login */}
                <p className="text-center text-muted small mt-3">
                  {t("auth.rememberPassword")}{" "}
                  <Link
                    to="/login"
                    className="text-success fw-medium text-decoration-none"
                  >
                    {t("auth.backToLogin")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      {success && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3 px-3 py-2 rounded text-white"
          style={{ background: "#28a745", zIndex: 1050 }}
        >
          {success}
        </div>
      )}
      {errors.general && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3 px-3 py-2 rounded text-white"
          style={{ background: "#dc3545", zIndex: 1050 }}
        >
          {errors.general}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }
        .animate-fadeInUp { animation: fadeIn 0.8s ease forwards; }
        .form-control:focus {
          border-color: #2ecc71;
          box-shadow: 0 0 5px rgba(46, 204, 113, 0.5);
        }
      `}</style>
    </div>
  );
}
