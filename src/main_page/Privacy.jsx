"use client";
import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  UserCheck,
  FileText,
  Mail,
  ChevronRight,
  User,
  Package,
  DollarSign,
  Activity,
  MapPin,
  Target,
  Bell,
  Truck,
  BarChart,
  Key,
  Users,
  Ban,
  Edit,
  Trash2,
} from "lucide-react";
import Navbar from "./navbar";
import Footer from "./footer";
import "../css/PrivacyPage.css";
import { useTranslation } from "react-i18next";

export default function PrivacyPage() {
  const { t } = useTranslation();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <>
      <div className="navbar-fixed">
        <Navbar />
      </div>

      {/* HERO */}
      <section
        className="hero-section vh-100 min-vh-80-mob d-flex align-items-center position-relative overflow-hidden snap-section"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9f5e9 100%)",
        }}
      >
        <div className="container position-relative z-10 px-4 px-md-5">
          <div
            className={`text-center ${animate ? "animate-in" : "opacity-0"}`}
          >
            <div className="glass-badge mb-3 mb-md-4">
              {t("privacyPolicy.hero.badge")}
            </div>
            <h1 className="display-4 display-md-3 fw-bold mb-3 mb-md-4 lh-1 text-success">
              {t("privacyPolicy.hero.title")}{" "}
              <span className="text-gradient d-block">
                {t("privacyPolicy.hero.titleHighlight")}
              </span>
            </h1>
            <p className="lead mb-4 mb-md-5 max-w-3xl mx-auto opacity-90 fs-6 fs-md-base">
              {t("privacyPolicy.hero.description")}
            </p>
            <a
              href="#privacy-content"
              className="btn-modern btn-success d-inline-flex align-items-center gap-2"
            >
              {t("privacyPolicy.hero.btn")} <ChevronRight className="icon-sm" />
            </a>
          </div>
        </div>
      </section>

      {/* PRIVACY CONTENT */}
      <section
        id="privacy-content"
        className="min-vh-80-mob d-flex align-items-start bg-white py-5 snap-section"
      >
        <div className="container px-4 px-md-5 pt-5 pt-md-0">
          <div className="max-w-4xl mx-auto">
            {/* Intro */}
            <div className="text-center mb-5">
              <p className="lead text-muted max-w-3xl mx-auto">
                {t("privacyPolicy.intro")}
              </p>
            </div>

            {/* Section 1: What We Collect */}
            <div className="privacy-card p-4 p-md-5 mb-4">
              <div className="d-flex align-items-start gap-3">
                <div className="icon-circle-lg flex-shrink-0">
                  <Shield size={36} className="text-white" />
                </div>
                <div>
                  <h5 className="fw-bold mb-3 text-success">
                    {t("privacyPolicy.sections.collect.title")}
                  </h5>
                  <ul className="list-unstyled text-muted mb-0">
                    {[
                      "personal",
                      "products",
                      "transactions",
                      "behavior",
                      "location",
                    ].map((key) => (
                      <li
                        key={key}
                        className="mb-2 d-flex align-items-start gap-2"
                      >
                        {key === "personal" && (
                          <User
                            size={16}
                            className="text-success mt-1 flex-shrink-0"
                          />
                        )}
                        {key === "products" && (
                          <Package
                            size={16}
                            className="text-success mt-1 flex-shrink-0"
                          />
                        )}
                        {key === "transactions" && (
                          <DollarSign
                            size={16}
                            className="text-success mt-1 flex-shrink-0"
                          />
                        )}
                        {key === "behavior" && (
                          <Activity
                            size={16}
                            className="text-success mt-1 flex-shrink-0"
                          />
                        )}
                        {key === "location" && (
                          <MapPin
                            size={16}
                            className="text-success mt-1 flex-shrink-0"
                          />
                        )}
                        {t(`privacyPolicy.sections.collect.items.${key}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2: Why We Collect It */}
            <div className="privacy-card p-4 p-md-5 mb-4">
              <div className="d-flex align-items-start gap-3">
                <div className="icon-circle-lg flex-shrink-0">
                  <UserCheck size={36} className="text-white" />
                </div>
                <div>
                  <h5 className="fw-bold mb-3 text-success">
                    {t("privacyPolicy.sections.why.title")}
                  </h5>
                  <p className="text-muted mb-3">
                    {t("privacyPolicy.sections.why.intro")}
                  </p>
                  <ul className="list-unstyled text-muted mb-0">
                    {["matches", "alerts", "payments", "improvements"].map(
                      (key) => (
                        <li
                          key={key}
                          className="mb-2 d-flex align-items-start gap-2"
                        >
                          {key === "matches" && (
                            <Target
                              size={16}
                              className="text-success mt-1 flex-shrink-0"
                            />
                          )}
                          {key === "alerts" && (
                            <Bell
                              size={16}
                              className="text-success mt-1 flex-shrink-0"
                            />
                          )}
                          {key === "payments" && (
                            <Truck
                              size={16}
                              className="text-success mt-1 flex-shrink-0"
                            />
                          )}
                          {key === "improvements" && (
                            <BarChart
                              size={16}
                              className="text-success mt-1 flex-shrink-0"
                            />
                          )}
                          {t(`privacyPolicy.sections.why.items.${key}`)}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Data Protection & Security */}
            <div className="privacy-card p-4 p-md-5 mb-4">
              <div className="d-flex align-items-start gap-3">
                <div className="icon-circle-lg flex-shrink-0">
                  <Lock size={36} className="text-white" />
                </div>
                <div>
                  <h5 className="fw-bold mb-3 text-success">
                    {t("privacyPolicy.sections.security.title")}
                  </h5>
                  <ul className="list-unstyled text-muted mb-0">
                    {[
                      { key: "encryption", icon: Key },
                      { key: "auth", icon: Shield },
                      { key: "roles", icon: Users },
                      { key: "nosell", icon: Ban },
                    ].map((item) => (
                      <li
                        key={item.key}
                        className="mb-2 d-flex align-items-start gap-2"
                      >
                        <item.icon
                          size={16}
                          className="text-success mt-1 flex-shrink-0"
                        />
                        {t(`privacyPolicy.sections.security.items.${item.key}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4: Your Rights */}
            <div className="privacy-card p-4 p-md-5 mb-4">
              <div className="d-flex align-items-start gap-3">
                <div className="icon-circle-lg flex-shrink-0">
                  <FileText size={36} className="text-white" />
                </div>
                <div>
                  <h5 className="fw-bold mb-3 text-success">
                    {t("privacyPolicy.sections.rights.title")}
                  </h5>
                  <ul className="list-unstyled text-muted mb-0">
                    {[
                      { key: "update", icon: Edit },
                      { key: "delete", icon: Trash2 },
                      { key: "laws", icon: Shield },
                    ].map((item) => (
                      <li
                        key={item.key}
                        className="mb-2 d-flex align-items-start gap-2"
                      >
                        <item.icon
                          size={16}
                          className="text-success mt-1 flex-shrink-0"
                        />
                        {t(`privacyPolicy.sections.rights.items.${item.key}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 5: Contact */}
            <div className="privacy-card p-4 p-md-5">
              <div className="d-flex align-items-start gap-3">
                <div className="icon-circle-lg flex-shrink-0">
                  <Mail size={36} className="text-white" />
                </div>
                <div>
                  <h5 className="fw-bold mb-3 text-success">
                    {t("privacyPolicy.sections.contact.title")}
                  </h5>
                  <p className="text-muted mb-0">
                    {t("privacyPolicy.sections.contact.message")}{" "}
                    <a href="/contact" className="text-success fw-bold">
                      {t("privacyPolicy.sections.contact.link")}
                    </a>{" "}
                    {t("privacyPolicy.sections.contact.response")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
