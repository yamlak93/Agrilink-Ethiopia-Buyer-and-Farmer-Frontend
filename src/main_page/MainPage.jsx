"use client";
import React, { useState, useEffect } from "react";
import {
  Leaf,
  Users,
  Truck,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Package,
  Star,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import heroImg from "../assets/heroImg.jpg";
import whyAgrilink from "../assets/whyAgrilink.png";
import "../Css/MainPage.css";
import { useTranslation } from "react-i18next";

export default function MainPage() {
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
        className="hero-section vh-100 min-vh-80-mob d-flex align-items-center position-relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(${heroImg})`,
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
              {t("mainpage.hero.badge")}
            </div>
            <h1 className="display-4 display-md-3 fw-bold mb-3 mb-md-4 lh-1">
              {t("mainpage.hero.title")}{" "}
              <span className="text-gradient d-block">
                {t("mainpage.hero.titleHighlight")}
              </span>
            </h1>
            <p className="lead mb-4 mb-md-5 max-w-3xl mx-auto opacity-90 fs-6 fs-md-base">
              {t("mainpage.hero.description")}
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-4 mb-md-5">
              <a
                href="/register"
                className="btn-modern btn-primary d-flex align-items-center justify-content-center gap-2"
              >
                {t("mainpage.hero.btnSell")} <ArrowRight className="icon-sm" />
              </a>
              <a
                href="/login"
                className="btn-modern btn-secondary d-flex align-items-center justify-content-center gap-2"
              >
                {t("navigation.browseProducts")}{" "}
                <ChevronRight className="icon-sm" />
              </a>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-3 gap-md-4 text-sm">
              {[
                { value: "2,340+", key: "farmers" },
                { value: "1,820+", key: "deliveries" },
                { value: "98%", key: "satisfaction" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center gap-2 stat-item"
                >
                  <div className="dot-sm bg-white"></div>
                  <span>
                    <strong>{stat.value}</strong>{" "}
                    {t(`mainpage.hero.stats.${stat.key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="min-vh-80-mob d-flex align-items-center bg-white py-5 py-md-0">
        <div className="container px-4 px-md-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-3">
              {t("mainpage.how.title")}
            </h2>
            <p className="lead text-muted">{t("mainpage.how.subtitle")}</p>
          </div>
          <div className="row g-4 g-md-5 justify-content-center">
            {[
              {
                icon: Users,
                title: "mainpage.how.steps.profile.title",
                desc: "mainpage.how.steps.profile.desc",
              },
              {
                icon: TrendingUp,
                title: "mainpage.how.steps.list.title",
                desc: "mainpage.how.steps.list.desc",
              },
              {
                icon: Truck,
                title: "mainpage.how.steps.delivery.title",
                desc: "mainpage.how.steps.delivery.desc",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="col-12 col-md-4">
                  <div className="step-card p-4 p-md-5 text-center h-100 d-flex flex-column justify-content-center">
                    <div className="icon-circle mb-4 mx-auto">
                      <Icon size={36} className="text-white" />
                    </div>
                    <h5 className="fw-bold mb-3">{t(item.title)}</h5>
                    <p className="text-muted flex-grow-1">{t(item.desc)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="min-vh-80-mob d-flex align-items-center bg-light py-5 py-md-0">
        <div className="container px-4 px-md-5">
          <div className="row align-items-center g-4 g-md-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <h2 className="display-5 fw-bold mb-4 mb-md-5">
                {t("mainpage.why.title")}
              </h2>
              <div className="row g-3 g-md-4">
                {[
                  "direct",
                  "pricing",
                  "quality",
                  "logistics",
                  "payments",
                  "community",
                ].map((key, i) => {
                  const icons = [
                    Users,
                    TrendingUp,
                    CheckCircle,
                    Truck,
                    Package,
                    Leaf,
                  ];
                  const Icon = icons[i];
                  return (
                    <div key={i} className="col-12 col-md-6">
                      <div className="feature-card p-3 p-md-4 rounded-3 shadow-sm h-100 d-flex gap-3">
                        <div className="icon-box flex-shrink-0">
                          <Icon size={28} className="text-white" />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">
                            {t(`mainpage.why.items.${key}.title`)}
                          </h6>
                          <p className="text-muted small mb-0">
                            {t(`mainpage.why.items.${key}.desc`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 mb-4 mb-lg-0">
              <div className="hero-image-box rounded-3 overflow-hidden shadow-lg">
                <img
                  src={whyAgrilink}
                  alt={t("mainpage.why.imageAlt")}
                  className="w-100 h-100 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="min-vh-80-mob d-flex align-items-center bg-white py-5 py-md-0">
        <div className="container px-4 px-md-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              {t("mainpage.impact.title")}
            </h2>
            <p className="lead text-muted">{t("mainpage.impact.subtitle")}</p>
          </div>
          <div className="row g-3 g-md-4 justify-content-center">
            {[
              { value: "2,340+", key: "farmers", icon: Users },
              { value: "1,820+", key: "deliveries", icon: Truck },
              { value: "350+", key: "buyers", icon: Package },
              { value: "98%", key: "satisfaction", icon: Star },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="col-6 col-md-3">
                  <div className="impact-card text-center p-4 p-md-5 rounded-3 shadow-sm h-100 d-flex flex-column justify-content-center">
                    <div className="icon-circle-lg mb-3 mx-auto">
                      <Icon size={40} className="text-white" />
                    </div>
                    <h3 className="fw-bold text-success mb-1">{stat.value}</h3>
                    <p className="text-muted small">
                      {t(`mainpage.impact.stats.${stat.key}`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="min-vh-80-mob d-flex align-items-center text-white bg-success position-relative overflow-hidden py-5 py-md-0">
        <div className="container text-center position-relative z-10 px-4 px-md-5">
          <h2 className="display-5 fw-bold mb-4">{t("mainpage.cta.title")}</h2>
          <p className="lead mb-4 mb-md-5 opacity-90">
            {t("mainpage.cta.subtitle")}
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <a href="/register" className="btn-modern btn-light">
              {t("mainpage.cta.btnFarmer")}
            </a>
            <a href="/login" className="btn-modern btn-outline-light">
              {t("mainpage.cta.btnBuyer")} <ChevronRight className="icon-sm" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
