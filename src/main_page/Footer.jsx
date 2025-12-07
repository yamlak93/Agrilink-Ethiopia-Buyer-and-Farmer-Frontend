import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer
        className="bg-success text-light pt-5 pb-4"
        style={{ borderTop: "5px solid #28a745" }}
      >
        <div className="container">
          <div className="row g-4">
            {/* Branding */}
            <div className="col-md-4">
              <h4 className="fw-bold text-light">{t("footer.brand")}</h4>
              <p className="text-light small">{t("footer.description")}</p>
            </div>

            {/* Quick Links */}
            <div className="col-md-4">
              <h5 className="text-light mb-3">{t("footer.links.title")}</h5>
              <ul className="list-unstyled text-muted">
                {[
                  { to: "/home", key: "home" },
                  { to: "/about", key: "about" },
                  { to: "/contact", key: "contact" },
                  { to: "/privacy", key: "privacy" },
                ].map((link) => (
                  <li key={link.key}>
                    <Link
                      to={link.to}
                      className="text-light text-decoration-none"
                    >
                      {t(`footer.links.items.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div className="col-md-4">
              <h5 className="text-light mb-3">{t("footer.social.title")}</h5>
              <div className="d-flex gap-3">
                {[
                  { platform: "facebook", icon: "bi-facebook" },
                  { platform: "twitter", icon: "bi-twitter-x" },
                  { platform: "instagram", icon: "bi-instagram" },
                  { platform: "linkedin", icon: "bi-linkedin" },
                ].map((social) => (
                  <a
                    key={social.platform}
                    href="#"
                    className="text-light fs-4"
                    aria-label={t(`footer.social.items.${social.platform}`)}
                  >
                    <i className={`bi ${social.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <hr className="text-light mt-5" />

          <div className="text-center text-light small">
            © {currentYear} {t("footer.copyright")}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
