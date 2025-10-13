import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
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
              <h4 className="fw-bold text-light">AgriLink Ethiopia</h4>
              <p className="text-light small">
                Bridging farmers and buyers with technology that empowers local
                agriculture.
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-md-4">
              <h5 className="text-light mb-3">Quick Links</h5>
              <ul className="list-unstyled text-muted">
                <li>
                  <Link to={"/"} className="text-light text-decoration-none">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/about"}
                    className="text-light text-decoration-none"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/contact"}
                    className="text-light text-decoration-none"
                  >
                    Contact
                  </Link>
                </li>

                <li>
                  <Link
                    to={"/privacy"}
                    className="text-light text-decoration-none"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="col-md-4">
              <h5 className="text-light mb-3">Follow Us</h5>
              <div className="d-flex gap-3">
                <a href="#" className="text-light fs-4">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-light fs-4">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="#" className="text-light fs-4">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-light fs-4">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          <hr className="text-light mt-5" />

          <div className="text-center text-light small">
            &copy; {new Date().getFullYear()} AgriLink Ethiopia. All rights
            reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
