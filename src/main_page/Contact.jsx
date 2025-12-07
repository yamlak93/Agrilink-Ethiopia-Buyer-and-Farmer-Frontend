"use client";
import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send, ChevronRight } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import contactImg from "../assets/contactImg.png";
import "../Css/ContactPage.css";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return t("contactUs.form.errors.name");
    if (!formData.email.trim()) return t("contactUs.form.errors.email");
    if (!formData.subject.trim()) return t("contactUs.form.errors.subject");
    if (!formData.message.trim()) return t("contactUs.form.errors.message");
    if (!formData.email.includes("@"))
      return t("contactUs.form.errors.emailValid");
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSending(true);
    setError("");
    setSubmitted(false);

    const currentTime = new Intl.DateTimeFormat("en-ET", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Africa/Addis_Ababa",
    }).format(new Date());

    const templateParams = {
      name: formData.name,
      email: formData.email,
      type: formData.type,
      subject: formData.subject,
      message: formData.message,
      time: currentTime,
    };

    emailjs
      .send(
        "service_i8e2fhx",
        "template_nsszch1",
        templateParams,
        "48BtOMSBHziCwyPtR"
      )
      .then(
        () => {
          setSubmitted(true);
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
            type: "general",
          });
        },
        (err) => {
          console.error("EmailJS Error:", err);
          setError(t("contactUs.form.errors.sendFailed"));
        }
      )
      .finally(() => {
        setIsSending(false);
        setTimeout(() => setSubmitted(false), 5000);
      });
  };

  return (
    <>
      <div className="navbar-fixed">
        <Navbar />
      </div>

      {/* HERO */}
      <section
        className="hero-section vh-100 min-vh-80-mob d-flex align-items-center position-relative overflow-hidden snap-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(${contactImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container position-relative z-10 px-4 px-md-5">
          <div
            className={`text-center text-white ${
              animate ? "animate-in" : "opacity-0"
            }`}
          >
            <div className="glass-badge mb-3 mb-md-4">
              {t("contactUs.hero.badge")}
            </div>
            <h1 className="display-4 display-md-3 fw-bold mb-3 mb-md-4 lh-1">
              {t("contactUs.hero.title")}{" "}
              <span className="text-gradient d-block">
                {t("contactUs.hero.titleHighlight")}
              </span>
            </h1>
            <p className="lead mb-4 mb-md-5 max-w-3xl mx-auto opacity-90 fs-6 fs-md-base">
              {t("contactUs.hero.description")}
            </p>
            <a
              href="#contact-form"
              className="btn-modern btn-light d-inline-flex align-items-center gap-2"
            >
              {t("contactUs.hero.btn")} <ChevronRight className="icon-sm" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="min-vh-80-mob d-flex align-items-start bg-white py-5 snap-section">
        <div className="container px-4 px-md-5 pt-5 pt-md-0">
          <div className="row g-3 g-md-4 justify-content-center">
            {[
              {
                icon: Mail,
                key: "email",
              },
              {
                icon: Phone,
                key: "phone",
              },
              {
                icon: MapPin,
                key: "office",
              },
              {
                icon: Clock,
                key: "response",
              },
            ].map((info, i) => {
              const Icon = info.icon;
              return (
                <div key={i} className="col-6 col-md-3">
                  <div className="contact-card p-4 p-md-5 text-center h-100 d-flex flex-column justify-content-center rounded-3 shadow-sm">
                    <div className="icon-circle-lg mb-3 mx-auto">
                      <Icon size={40} className="text-white" />
                    </div>
                    <h5 className="fw-bold mb-1">
                      {t(`contactUs.info.items.${info.key}.title`)}
                    </h5>
                    <p className="text-success small mb-1">
                      {t(`contactUs.info.items.${info.key}.content`)}
                    </p>
                    <p className="text-muted small">
                      {t(`contactUs.info.items.${info.key}.subtext`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORM + FAQ */}
      <section
        id="contact-form"
        className="min-vh-80-mob d-flex align-items-start bg-light py-5 snap-section"
      >
        <div className="container px-4 px-md-5 pt-5 pt-md-0">
          <div className="row g-5">
            {/* FORM */}
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-5 text-success">
                {t("contactUs.form.title")}
              </h2>
              <form onSubmit={handleSubmit} className="contact-form">
                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bold">
                    {t("contactUs.form.labels.name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-control form-control-lg"
                    placeholder={t("contactUs.form.placeholders.name")}
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">
                    {t("contactUs.form.labels.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-control form-control-lg"
                    placeholder={t("contactUs.form.placeholders.email")}
                  />
                </div>

                {/* Subject Type */}
                <div className="mb-3">
                  <label htmlFor="type" className="form-label fw-bold">
                    {t("contactUs.form.labels.type")}
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-select form-select-lg"
                  >
                    {["general", "support", "farmer", "buyer", "delivery"].map(
                      (key) => (
                        <option key={key} value={key}>
                          {t(`contactUs.form.options.${key}`)}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Subject */}
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label fw-bold">
                    {t("contactUs.form.labels.subject")}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-control form-control-lg"
                    placeholder={t("contactUs.form.placeholders.subject")}
                  />
                </div>

                {/* Message */}
                <div className="mb-4">
                  <label htmlFor="message" className="form-label fw-bold">
                    {t("contactUs.form.labels.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="form-control form-control-lg"
                    placeholder={t("contactUs.form.placeholders.message")}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  {isSending ? (
                    <>
                      {t("contactUs.form.sending")}{" "}
                      <Send className="icon-sm animate-spin" />
                    </>
                  ) : (
                    <>
                      <Send className="icon-sm" />
                      {t("contactUs.form.submit")}
                    </>
                  )}
                </button>

                {/* Success */}
                {submitted && (
                  <div className="alert alert-success mt-4 p-4 rounded-3 text-center">
                    <strong>{t("contactUs.form.success.title")}</strong>{" "}
                    {t("contactUs.form.success.message")}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="alert alert-danger mt-4 p-4 rounded-3 text-center">
                    <strong>{t("contactUs.form.errors.title")}:</strong> {error}
                  </div>
                )}
              </form>
            </div>

            {/* FAQ */}
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-5 text-success">
                {t("contactUs.faq.title")}
              </h2>
              <div className="space-y-3">
                {[
                  "delivery",
                  "payment",
                  "cancel",
                  "registration",
                  "support",
                ].map((key, i) => (
                  <div key={i} className="faq-card p-4 rounded-3 shadow-sm">
                    <h6 className="fw-bold text-success mb-2">
                      {t(`contactUs.faq.items.${key}.q`)}
                    </h6>
                    <p className="text-muted small mb-0">
                      {t(`contactUs.faq.items.${key}.a`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="min-vh-80-mob d-flex align-items-center bg-success text-white py-5 snap-section">
        <div className="container px-4 px-md-5 text-center">
          <h2 className="display-5 fw-bold mb-4">{t("contactUs.cta.title")}</h2>
          <p className="lead mb-5 opacity-90">{t("contactUs.cta.subtitle")}</p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <a href="/register" className="btn-modern btn-light">
              {t("contactUs.cta.btnStart")}
            </a>
            <a href="/about" className="btn-modern btn-outline-light">
              {t("contactUs.cta.btnLearn")}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
