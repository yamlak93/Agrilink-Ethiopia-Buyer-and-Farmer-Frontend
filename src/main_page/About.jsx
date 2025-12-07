"use client";
import React, { useState, useEffect } from "react";
import {
  Leaf,
  Users,
  Truck,
  Bell,
  DollarSign,
  Globe,
  Zap,
  ChevronRight,
  Shield,
  TrendingUp,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import aboutImg from "../assets/aboutImg.png";
import "../Css/AboutPage.css";
import vision from "../assets/vision.jpg";
import { useTranslation } from "react-i18next";

export default function About() {
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
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(${aboutImg})`,
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
              {t("about.hero.badge")}
            </div>
            <h1 className="display-4 display-md-3 fw-bold mb-3 mb-md-4 lh-1">
              {t("about.hero.title")}{" "}
              <span className="text-gradient d-block">
                {t("about.hero.titleHighlight")}
              </span>
            </h1>
            <p className="lead mb-4 mb-md-5 max-w-3xl mx-auto opacity-90 fs-6 fs-md-base">
              {t("about.hero.description")}
            </p>
            <a
              href="#vision"
              className="btn-modern btn-light d-inline-flex align-items-center gap-2"
            >
              {t("about.hero.btn")} <ChevronRight className="icon-sm" />
            </a>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section
        id="vision"
        className="min-vh-80-mob d-flex align-items-start bg-white py-5 snap-section"
      >
        <div className="container px-4 px-md-5 pt-5 pt-md-0">
          <div className="row align-items-center g-4 g-md-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <h2 className="display-5 fw-bold mb-3 mb-md-4">
                {t("about.vision.title")}
              </h2>
              <p className="lead text-muted mb-3">
                {t("about.vision.mission")}
              </p>
              <p className="text-muted">{t("about.vision.description")}</p>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 mb-4 mb-lg-0">
              <div className="hero-image-box rounded-3 overflow-hidden shadow-lg">
                <img
                  src={vision}
                  alt={t("about.vision.imageAlt")}
                  className="w-100 h-100 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="min-vh-80-mob d-flex align-items-start bg-light py-5 snap-section">
        <div className="container px-4 px-md-5 pt-5 pt-md-0">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              {t("about.features.title")}
            </h2>
            <p className="lead text-muted">{t("about.features.subtitle")}</p>
          </div>
          <div className="row g-3 g-md-4">
            {[
              {
                icon: Users,
                key: "marketplace",
              },
              {
                icon: Truck,
                key: "tracking",
              },
              {
                icon: Bell,
                key: "alerts",
              },
              {
                icon: DollarSign,
                key: "payments",
              },
              {
                icon: Globe,
                key: "multilingual",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="col-12 col-md-6 col-lg-4">
                  <div className="feature-card p-3 p-md-4 rounded-3 shadow-sm h-100 d-flex gap-3">
                    <div className="icon-box flex-shrink-0">
                      <Icon size={28} className="text-white" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">
                        {t(`about.features.items.${feature.key}.title`)}
                      </h6>
                      <p className="text-muted small mb-0">
                        {t(`about.features.items.${feature.key}.desc`)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="min-vh-80-mob d-flex align-items-start bg-white py-5 snap-section">
        <div className="container px-4 px-md-5 pt-5 pt-md-0">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              {t("about.impact.title")}
            </h2>
            <p className="lead text-muted">{t("about.impact.subtitle")}</p>
          </div>
          <div className="row g-3 g-md-4 justify-content-center">
            {[
              { value: "30%", key: "waste", icon: Shield },
              { value: "45%", key: "earnings", icon: TrendingUp },
              { value: "2,000+", key: "users", icon: Users },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="col-6 col-md-4">
                  <div className="impact-card text-center p-4 p-md-5 rounded-3 shadow-sm h-100 d-flex flex-column justify-content-center">
                    <div className="icon-circle-lg mb-3 mx-auto">
                      <Icon size={40} className="text-white" />
                    </div>
                    <h3 className="fw-bold text-success mb-1">{stat.value}</h3>
                    <p className="text-muted small">
                      {t(`about.impact.stats.${stat.key}`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
