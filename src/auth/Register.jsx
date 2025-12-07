// ─────────────────────────────────────────────────────────────────────────────
//  RegistrationPage.jsx – Farmer: Bank Details for Chapa Payout (Backend Sync)
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  Home,
  Trees,
  Building2,
  CreditCard,
  UserCheck,
} from "lucide-react";
import logoGreen from "../assets/logoGreen.png";
import apiClient from "../api/api";
import { useTranslation } from "react-i18next";

export default function RegistrationPage() {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Bank states ──
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountLengthError, setAccountLengthError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
    role: "",
    farmName: "",
    farmLocation: "",
    bankId: "",
    accountNumber: "",
    accountName: "",
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

  // ────────────────────── Fetch Chapa Banks (Backend Route) ──────────────────────
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await apiClient.get("/auth/chapa/banks"); // ← Matches authRoutes
        setBanks(res.data.data || []);
      } catch (err) {
        console.error("Failed to load banks:", err);
        setErrors({ general: t("errors.bankLoadFailed") });
      }
    };

    if (formData.role === "Farmer") {
      fetchBanks();
    } else {
      setBanks([]);
      setSelectedBank(null);
    }
  }, [formData.role, t]);

  // ────────────────────── Validate Account Length ──────────────────────
  useEffect(() => {
    if (!formData.accountNumber || !selectedBank) {
      setAccountLengthError("");
      return;
    }

    const digitsOnly = formData.accountNumber.replace(/\D/g, "");
    const expected = selectedBank.acct_length;
    const actual = digitsOnly.length;

    if (actual !== expected) {
      setAccountLengthError(t("errors.accountLength", { expected, actual }));
    } else {
      setAccountLengthError("");
    }
  }, [formData.accountNumber, selectedBank, t]);

  // ────────────────────── Form handling ──────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset dependent fields
    if (name === "role" && value === "Farmer") {
      setFormData((prev) => ({
        ...prev,
        role: value,
        email: "",
        farmName: prev.farmName,
        farmLocation: prev.farmLocation,
      }));
    } else if (name === "role" && value === "Buyer") {
      setFormData((prev) => ({
        ...prev,
        role: value,
        farmName: "",
        farmLocation: "",
        bankId: "",
        accountNumber: "",
        accountName: "",
      }));
      setSelectedBank(null);
    } else if (name === "bankId") {
      const bank = banks.find((b) => b.id === parseInt(value));
      setSelectedBank(bank);
      setFormData((prev) => ({ ...prev, bankId: value }));
    } else if (name === "accountNumber") {
      // Only allow digits
      const digits = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, accountNumber: digits }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (name === "accountNumber") {
      setAccountLengthError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Common validation
    if (!formData.name.trim()) newErrors.name = t("errors.required");
    if (!formData.phone.trim()) newErrors.phone = t("errors.required");
    if (!formData.location.trim()) newErrors.location = t("errors.required");
    if (!formData.password.trim()) newErrors.password = t("errors.required");
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = t("errors.required");
    if (!formData.role) newErrors.role = t("errors.required");

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = t("errors.invalidPhone");
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = t("errors.passwordMin6");
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("errors.passwordMismatch");
    }

    // Farmer-specific
    if (formData.role === "Farmer") {
      if (!formData.farmName.trim()) newErrors.farmName = t("errors.required");
      if (!formData.farmLocation.trim())
        newErrors.farmLocation = t("errors.required");
      if (!formData.bankId) newErrors.bankId = t("errors.required");
      if (!formData.accountNumber.trim())
        newErrors.accountNumber = t("errors.required");
      if (!formData.accountName.trim())
        newErrors.accountName = t("errors.required");

      if (accountLengthError) {
        newErrors.accountNumber = accountLengthError;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone,
        location: formData.location.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        ...(formData.role === "Buyer" &&
          formData.email && { email: formData.email.trim() }),
        ...(formData.role === "Farmer" && {
          farmName: formData.farmName.trim(),
          farmLocation: formData.farmLocation.trim(),
          chapaBankId: parseInt(formData.bankId),
          accountNumber: formData.accountNumber,
          accountName: formData.accountName.trim(),
        }),
      };

      await apiClient.post("/auth/register", payload); // ← Matches authRoutes
      setSuccess(t("auth.signupSuccess"));
      setErrors({});
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const message = err.response?.data?.message || t("auth.signupFailed");
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear toasts
  useEffect(() => {
    if (success || errors.general) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setErrors((prev) => ({ ...prev, general: "" }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, errors.general]);

  useEffect(() => {
    if (["en", "am", "om"].includes(selectedLanguage)) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage, i18n]);

  // ────────────────────── JSX ──────────────────────
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

            <h4 className="fw-bold text-dark mb-1">{t("auth.signupTitle")}</h4>
            <p className="text-muted small mb-3">{t("auth.enterDetails")}</p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark d-flex align-items-center">
                  <User size={16} className="me-1" />
                  {t("common.fullName")}
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text bg-white border-end-0"
                    style={{ borderColor: errors.name ? "#dc3545" : "#2ecc71" }}
                  >
                    <User
                      size={16}
                      className={errors.name ? "text-danger" : ""}
                    />
                  </span>
                  <input
                    type="text"
                    name="name"
                    className={`form-control rounded-end-pill ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    placeholder={t("common.fullNamePlaceholder")}
                    value={formData.name}
                    onChange={handleChange}
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
                {errors.name && (
                  <div className="invalid-feedback d-block">{errors.name}</div>
                )}
              </div>

              {/* Role */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark d-flex align-items-center">
                  <User size={16} className="me-1" />
                  {t("common.role")}
                </label>
                <div className="d-flex gap-2">
                  {["Farmer", "Buyer"].map((r) => (
                    <div className="form-check" key={r}>
                      <input
                        type="radio"
                        name="role"
                        id={r.toLowerCase()}
                        value={r}
                        className="btn-check"
                        checked={formData.role === r}
                        onChange={handleChange}
                      />
                      <label
                        htmlFor={r.toLowerCase()}
                        className={`btn rounded-pill px-3 py-1 ${
                          errors.role
                            ? "btn-outline-danger"
                            : "btn-outline-success"
                        }`}
                        style={{ fontSize: "0.85rem" }}
                      >
                        {t(`roles.${r.toLowerCase()}`)}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.role && (
                  <div className="text-danger small mt-1">{errors.role}</div>
                )}
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark d-flex align-items-center">
                  <Phone size={16} className="me-1" />
                  {t("common.phone")}
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text bg-white border-end-0"
                    style={{
                      borderColor: errors.phone ? "#dc3545" : "#2ecc71",
                    }}
                  >
                    <Phone
                      size={16}
                      className={errors.phone ? "text-danger" : ""}
                    />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-control rounded-end-pill ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    placeholder={t("common.phonePlaceholder")}
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
                {errors.phone && (
                  <div className="invalid-feedback d-block">{errors.phone}</div>
                )}
              </div>

              {/* Email (Buyer only) */}
              {formData.role === "Buyer" && (
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    <Mail size={16} className="me-1" />
                    {t("common.email")}
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Mail size={16} className="text-success" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control rounded-end-pill"
                      placeholder={t("common.emailPlaceholder")}
                      value={formData.email}
                      onChange={handleChange}
                      style={{ fontSize: "0.9rem" }}
                    />
                  </div>
                </div>
              )}

              {/* Farmer Fields */}
              {formData.role === "Farmer" && (
                <>
                  {/* Farm Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <Home size={16} className="me-1" />
                      {t("farmer.farmName")}
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-white border-end-0"
                        style={{
                          borderColor: errors.farmName ? "#dc3545" : "#2ecc71",
                        }}
                      >
                        <Home
                          size={16}
                          className={errors.farmName ? "text-danger" : ""}
                        />
                      </span>
                      <input
                        type="text"
                        name="farmName"
                        className={`form-control rounded-end-pill ${
                          errors.farmName ? "is-invalid" : ""
                        }`}
                        placeholder={t("farmer.farmNamePlaceholder")}
                        value={formData.farmName}
                        onChange={handleChange}
                        style={{ fontSize: "0.9rem" }}
                      />
                    </div>
                    {errors.farmName && (
                      <div className="invalid-feedback d-block">
                        {errors.farmName}
                      </div>
                    )}
                  </div>

                  {/* Farm Location */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <Trees size={16} className="me-1" />
                      {t("farmer.farmLocation")}
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-white border-end-0"
                        style={{
                          borderColor: errors.farmLocation
                            ? "#dc3545"
                            : "#2ecc71",
                        }}
                      >
                        <Trees
                          size={16}
                          className={errors.farmLocation ? "text-danger" : ""}
                        />
                      </span>
                      <input
                        type="text"
                        name="farmLocation"
                        className={`form-control rounded-end-pill ${
                          errors.farmLocation ? "is-invalid" : ""
                        }`}
                        placeholder={t("farmer.farmLocationPlaceholder")}
                        value={formData.farmLocation}
                        onChange={handleChange}
                        style={{ fontSize: "0.9rem" }}
                      />
                    </div>
                    {errors.farmLocation && (
                      <div className="invalid-feedback d-block">
                        {errors.farmLocation}
                      </div>
                    )}
                  </div>

                  {/* Bank */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <Building2 size={16} className="me-1" />
                      {t("farmer.bank")}
                    </label>
                    <select
                      name="bankId"
                      className={`form-select rounded-pill ${
                        errors.bankId ? "is-invalid" : ""
                      }`}
                      value={formData.bankId}
                      onChange={handleChange}
                      style={{ fontSize: "0.9rem" }}
                    >
                      <option value="">{t("farmer.selectBank")}</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                    {errors.bankId && (
                      <div className="invalid-feedback d-block">
                        {errors.bankId}
                      </div>
                    )}
                  </div>

                  {/* Account Number */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <CreditCard size={16} className="me-1" />
                      {t("farmer.accountNumber")}
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-white border-end-0"
                        style={{
                          borderColor: errors.accountNumber
                            ? "#dc3545"
                            : "#2ecc71",
                        }}
                      >
                        <CreditCard
                          size={16}
                          className={errors.accountNumber ? "text-danger" : ""}
                        />
                      </span>
                      <input
                        type="text"
                        name="accountNumber"
                        className={`form-control rounded-end-pill ${
                          errors.accountNumber ? "is-invalid" : ""
                        }`}
                        placeholder={t("farmer.accountNumberPlaceholder")}
                        value={formData.accountNumber}
                        onChange={handleChange}
                        style={{ fontSize: "0.9rem" }}
                      />
                    </div>
                    {errors.accountNumber && (
                      <div className="invalid-feedback d-block">
                        {errors.accountNumber}
                      </div>
                    )}
                    {selectedBank && (
                      <small className="text-muted">
                        {t("farmer.accountLengthHint", {
                          length: selectedBank.acct_length,
                        })}
                      </small>
                    )}
                  </div>

                  {/* Account Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <UserCheck size={16} className="me-1" />
                      {t("farmer.accountName")}
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-white border-end-0"
                        style={{
                          borderColor: errors.accountName
                            ? "#dc3545"
                            : "#2ecc71",
                        }}
                      >
                        <UserCheck
                          size={16}
                          className={errors.accountName ? "text-danger" : ""}
                        />
                      </span>
                      <input
                        type="text"
                        name="accountName"
                        className={`form-control rounded-end-pill ${
                          errors.accountName ? "is-invalid" : ""
                        }`}
                        placeholder={t("farmer.accountNamePlaceholder")}
                        value={formData.accountName}
                        onChange={handleChange}
                        style={{ fontSize: "0.9rem" }}
                      />
                    </div>
                    {errors.accountName && (
                      <div className="invalid-feedback d-block">
                        {errors.accountName}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Personal Location */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark d-flex align-items-center">
                  <MapPin size={16} className="me-1" />
                  {t("common.location")}
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text bg-white border-end-0"
                    style={{
                      borderColor: errors.location ? "#dc3545" : "#2ecc71",
                    }}
                  >
                    <MapPin
                      size={16}
                      className={errors.location ? "text-danger" : ""}
                    />
                  </span>
                  <input
                    type="text"
                    name="location"
                    className={`form-control rounded-end-pill ${
                      errors.location ? "is-invalid" : ""
                    }`}
                    placeholder={t("cities.addisAbaba")}
                    value={formData.location}
                    onChange={handleChange}
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
                {errors.location && (
                  <div className="invalid-feedback d-block">
                    {errors.location}
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
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark d-flex align-items-center">
                  <Lock size={16} className="me-1" />
                  {t("auth.confirmPassword")}
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text bg-white border-end-0"
                    style={{
                      borderColor: errors.confirmPassword
                        ? "#dc3545"
                        : "#2ecc71",
                    }}
                  >
                    <Lock
                      size={16}
                      className={errors.confirmPassword ? "text-danger" : ""}
                    />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ fontSize: "0.9rem" }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-success rounded-start-0 rounded-pill"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="invalid-feedback d-block">
                    {errors.confirmPassword}
                  </div>
                )}
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
                      {t("auth.registering")}
                    </>
                  ) : (
                    t("auth.signup")
                  )}
                </button>
              </div>

              <p className="text-center text-muted small mb-0">
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

      {/* Toasts */}
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

      {/* Inline CSS */}
      <style jsx>{`
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
        .is-invalid {
          border-color: #dc3545 !important;
        }
      `}</style>
    </div>
  );
}
