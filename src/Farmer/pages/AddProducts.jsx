import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProductDetailsCard from "../components/ProductDetailsCard";
import PricingCard from "../components/PricingCard";
import ProductImageCard from "../components/ProductImageCard";
import StylishModal from "../components/StylishModal";
import LoadingModal from "../../others/LoadingPage";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../../api/api"; // Import the api.js client
import { useTranslation } from "react-i18next";

const AddProduct = () => {
  const { t } = useTranslation();

  const [product, setProduct] = useState({
    productName: "",
    category: "",
    description: "",
    price: 0,
    quantity: 0,
    unit: "Kilogram (kg)",
    location: "",
    productImage: null,
    harvestDate: "",
  });

  const [modal, setModal] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file) => {
    setProduct((prev) => ({ ...prev, productImage: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.productName ||
      !product.category ||
      !product.price ||
      !product.quantity ||
      !product.location
    ) {
      setModal({
        isVisible: true,
        message: t("products.fillRequiredFields"),
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("category", product.category);
    formData.append("description", product.description || "");
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("unit", product.unit);
    formData.append("location", product.location);
    if (product.productImage) {
      formData.append("productImage", product.productImage);
    }
    formData.append("harvestDate", product.harvestDate || null);

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", {
          replace: true,
          state: { message: "No token available. Please log in again." },
        });
        return;
      }
      await apiClient.post("/products", formData);

      setIsLoading(false);
      setModal({
        isVisible: true,
        message: t("products.addSuccess", { productName: product.productName }),
        type: "success",
      });

      setProduct({
        productName: "",
        category: "",
        description: "",
        price: 0,
        quantity: 0,
        unit: "Kilogram (kg)",
        location: "",
        productImage: null,
        harvestDate: "",
      });
    } catch (err) {
      setIsLoading(false);
      let errorMessage = t("products.failedAddProduct");
      let errorDetails = err.message || "Unknown error";

      if (err.code === "ECONNABORTED") {
        errorMessage = t("products.networkError");
        errorDetails = t("products.networkError");
      } else if (err.response) {
        errorMessage =
          err.response.data?.message ||
          `Server Error: ${err.response.status} ${err.response.statusText}`;
        errorDetails = err.response.data?.error || err.response.data;
      }

      navigate("/error", {
        state: { error: { message: errorMessage, details: errorDetails } },
      });
    }
  };

  const handleCloseModal = () => {
    setModal({ isVisible: false, message: "", type: "" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", {
        replace: true,
        state: { message: "No token available. Please log in again." },
      });
    }

    const modalState = location.state?.modal;
    if (modalState) {
      setModal(modalState);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, navigate]);

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>{t("products.addProduct")}</h2>
              <p className="text-muted">{t("products.subtitle")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <ProductDetailsCard
                  product={product}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <PricingCard product={product} handleChange={handleChange} />
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12">
                <ProductImageCard handleImageChange={handleImageChange} />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <Link to="/farmer/dashboard" className="me-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                >
                  {t("products.cancel")}
                </button>
              </Link>

              <button type="submit" className="btn btn-success">
                {t("products.addProductButton")}
              </button>
            </div>
          </form>
        </div>
      </div>

      <StylishModal
        isVisible={modal.isVisible}
        message={modal.message}
        type={modal.type}
        onClose={handleCloseModal}
      />
      <LoadingModal isLoading={isLoading} />
    </>
  );
};

export default AddProduct;
