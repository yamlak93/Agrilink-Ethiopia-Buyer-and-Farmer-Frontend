import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "../../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import EditProductModal from "../components/EditProductModal";
import ConfirmationModal from "../components/ConfirmationModal";
import StylishModal from "../components/StylishModal";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Loader from "../../assets/Agriculture Loader.mp4"; // Import the loader video
import { useTranslation } from "react-i18next"; // Import useTranslation

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Controlled by useEffect
  const navigate = useNavigate(); // Initialize navigate for redirection

  // Fetch products for the logged-in farmer on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Show loading modal when fetching starts
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", { replace: true }); // Redirect to login if no token
          return;
        }
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Products data:", response.data); // Debug: Log the API response
        setProducts(response.data); // API should include category or equivalent field
      } catch (err) {
        let errorMessage = "Failed to fetch products. Please try again.";
        let errorDetails = err.message || "Unknown error";

        if (err.code === "ECONNABORTED") {
          errorMessage = "Network Error: Request timed out.";
          errorDetails = "Please check your internet connection.";
        } else if (err.response) {
          if (err.response.status === 401) {
            // Handle JWT expiration
            localStorage.removeItem("token"); // Clear expired token
            navigate("/login", {
              replace: true,
              state: { message: "Session expired. Please log in again." },
            }); // Redirect to login
            return;
          }
          errorMessage =
            err.response.data?.message ||
            `Server Error: ${err.response.status} ${err.response.statusText}`;
          errorDetails = err.response.data?.error || err.response.data;
        }

        navigate("/error", {
          state: {
            error: {
              message: errorMessage,
              details: errorDetails,
            },
          },
        });
      } finally {
        setLoading(false); // Hide loading modal when fetching ends
      }
    };
    fetchProducts();
  }, [navigate]);

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.unit.toLowerCase().includes(searchTerm.toLowerCase());

    const productCategory =
      product.category || // Preferred field
      product.type || // Alternative field
      product.productCategory || // Another alternative
      "Uncategorized"; // Default if no match

    const matchesCategory =
      !categoryFilter ||
      categoryFilter === "All Categories" ||
      productCategory === categoryFilter;

    console.log(
      `Product: ${product.title}, Category: ${productCategory}, Filter: ${categoryFilter}, Matches: ${matchesCategory}`
    ); // Debug each product
    return matchesSearch && matchesCategory;
  });

  // Handlers for Detail Modal
  const handleOpenDetailModal = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedProduct(null);
  };

  // Handlers for Edit Modal
  const handleOpenEditModal = () => {
    setDetailModalVisible(false);
    setEditModalVisible(true);
  };
  const handleCloseEditModal = () => setEditModalVisible(false);

  const handleSaveEdit = (updatedProduct) => {
    setProducts(
      products.map((p) =>
        p.productId === updatedProduct.productId
          ? { ...p, ...updatedProduct }
          : p
      )
    );
    setEditModalVisible(false);
    setSuccessModalVisible(true);
  };

  // Handlers for Confirmation Modal
  const handleOpenConfirmationModal = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(false);
    setConfirmationModalVisible(true);
  };
  const handleCloseConfirmationModal = () => setConfirmationModalVisible(false);

  const handleConfirmDelete = async () => {
    setLoading(true); // Show loading modal during delete
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true }); // Redirect to login if no token
        return;
      }
      await axios.delete(
        `http://localhost:5000/api/products/${selectedProduct.productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(
        products.filter((p) => p.productId !== selectedProduct.productId)
      );
      setConfirmationModalVisible(false);
      setSuccessModalVisible(true);
    } catch (err) {
      let errorMessage = "Failed to delete product. Please try again.";
      let errorDetails = err.message || "Unknown error";

      if (err.code === "ECONNABORTED") {
        errorMessage = "Network Error: Request timed out.";
        errorDetails = "Please check your internet connection.";
      } else if (err.response) {
        if (err.response.status === 401) {
          // Handle JWT expiration
          localStorage.removeItem("token"); // Clear expired token
          navigate("/login", {
            replace: true,
            state: { message: "Session expired. Please log in again." },
          }); // Redirect to login
          return;
        }
        errorMessage =
          err.response.data?.message ||
          `Server Error: ${err.response.status} ${err.response.statusText}`;
        errorDetails = err.response.data?.error || err.response.data;
      }

      navigate("/error", {
        state: {
          error: {
            message: errorMessage,
            details: errorDetails,
          },
        },
      });
    } finally {
      setLoading(false); // Hide loading modal after delete
    }
  };

  // Handlers for Success Modal
  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
    setSelectedProduct(null);
  };
  const { t, i18n } = useTranslation(); // Initialize i18n translation
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
            <Link to={"/farmer/add-product"}>
              <button className="btn btn-success">
                <FaPlus className="me-2" />
                {t("products.addProduct")}
              </button>
            </Link>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <header className="mb-4">
              <h2>{t("products.title")}</h2>
              <p className="text-muted">{t("products.subtitle")}</p>
            </header>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                className="form-control w-50 me-3"
                placeholder={t("common.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-select w-25"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">{t("categories.all")}</option>
                <option value="Cereals">{t("categories.Cereals")}</option>
                <option value="Beans & Peas">
                  {t("categories.Beans & Peas")}
                </option>
                <option value="Crops for Selling">
                  {t("categories.Crops for Selling")}
                </option>
                <option value="Fruits">{t("categories.Fruits")}</option>
                <option value="Vegetables">{t("categories.Vegetables")}</option>
                <option value="Animals & Products">
                  {t("categories.Animals & Products")}
                </option>
                <option value="Oil Seeds">{t("categories.Oil Seeds")}</option>
                <option value="Spices">{t("categories.Spices")}</option>
                <option value="Flowers">{t("categories.Flowers")}</option>
                <option value="Processing Crops">
                  {t("categories.Processing Crops")}
                </option>
              </select>
            </div>

            {loading && (
              <div
                className="text-center"
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  style={{
                    width: "300px",
                    height: "300px",
                    display: "block",
                    margin: "0 auto",
                  }}
                >
                  <source src={Loader} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {!loading && (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.productId}
                      title={product.title}
                      price={product.price}
                      unit={product.unit}
                      location={product.location}
                      available={product.available}
                      imageUrl={product.imageUrl}
                      onViewDetails={() => handleOpenDetailModal(product)}
                    />
                  ))
                ) : (
                  <div className="text-center p-4 text-muted">
                    {t("products.noProducts")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modals */}
      <ProductDetailModal
        isVisible={isDetailModalVisible}
        product={selectedProduct}
        onClose={handleCloseDetailModal}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenConfirmationModal}
      />
      <EditProductModal
        isVisible={isEditModalVisible}
        product={selectedProduct}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
      />
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        message={t("confirmations.deleteConfirm")}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmDelete}
      />
      <StylishModal
        isVisible={isSuccessModalVisible}
        message={t("confirmations.actionSuccess")}
        type="success"
        onClose={handleCloseSuccessModal}
      />
    </>
  );
};

export default Products;
