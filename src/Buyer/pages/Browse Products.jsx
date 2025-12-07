// src/Buyer/pages/BrowseProducts.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/Devices.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import Loader from "../../assets/Agriculture Loader.mp4";
import { useTranslation } from "react-i18next";

const API_BASE = "http://localhost:5000/api";

const BrowseProducts = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const SLIDER_MIN = 0;
  const [sliderMaxDynamic, setSliderMaxDynamic] = useState(5000);
  const [rangeValues, setRangeValues] = useState([SLIDER_MIN, 5000]);

  const [apiMinPrice, setApiMinPrice] = useState(SLIDER_MIN);
  const [apiMaxPrice, setApiMaxPrice] = useState(5000);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const debounceTimer = useRef(null);
  const hasSetMax = useRef(false);

  // === DEBOUNCE SLIDER ===
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setApiMinPrice(rangeValues[0]);
      setApiMaxPrice(rangeValues[1]);
    }, 500);

    return () => clearTimeout(debounceTimer.current);
  }, [rangeValues]);

  // === FETCH PRODUCTS + SET DYNAMIC MAX ONCE ===
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (categoryFilter !== "All") params.append("category", categoryFilter);
        if (searchTerm) params.append("search", searchTerm);
        if (apiMinPrice > SLIDER_MIN) params.append("minPrice", apiMinPrice);
        if (apiMaxPrice < sliderMaxDynamic)
          params.append("maxPrice", apiMaxPrice);

        const res = await fetch(`${API_BASE}/buyer/products?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error((await res.json()).message || "Failed");

        const { products: productList = [] } = await res.json();

        setProducts(productList);
        setFilteredProducts(productList);

        // === SET DYNAMIC MAX ONLY ONCE ===
        if (!hasSetMax.current && productList.length > 0) {
          const actualMax = Math.ceil(
            Math.max(...productList.map((p) => p.price))
          );
          const newMax = actualMax + 100;

          setSliderMaxDynamic(newMax);
          setRangeValues([SLIDER_MIN, newMax]);
          setApiMaxPrice(newMax);
          hasSetMax.current = true;
        }
      } catch (err) {
        console.error(err);
        if (err.message.includes("token")) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate, categoryFilter, searchTerm, apiMinPrice, apiMaxPrice]);

  // === SLIDER CHANGE ===
  const handleRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const isMin = e.target.id === "min";

    setRangeValues((prev) => {
      const [min, max] = prev;
      let newMin = isMin ? value : min;
      let newMax = isMin ? max : value;

      if (newMin > newMax - 50) newMin = newMax - 50;
      if (newMax < newMin + 50) newMax = newMin + 50;

      newMin = Math.max(SLIDER_MIN, newMin);
      newMax = Math.min(sliderMaxDynamic, newMax);

      return [newMin, newMax];
    });
  };

  // === PROGRESS BAR ===
  const progressWidth =
    sliderMaxDynamic > SLIDER_MIN
      ? ((rangeValues[1] - rangeValues[0]) / (sliderMaxDynamic - SLIDER_MIN)) *
        100
      : 0;
  const progressLeft =
    sliderMaxDynamic > SLIDER_MIN
      ? ((rangeValues[0] - SLIDER_MIN) / (sliderMaxDynamic - SLIDER_MIN)) * 100
      : 0;

  // === RESET FILTERS ===
  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setRangeValues([SLIDER_MIN, sliderMaxDynamic]);
    setApiMinPrice(SLIDER_MIN);
    setApiMaxPrice(sliderMaxDynamic);
    hasSetMax.current = false;
  };

  // === CATEGORIES (using your exact JSON keys) ===
  const categoryMap = {
    All: "all",
    Cereals: "Cereals",
    "Beans & Peas": "Beans & Peas",
    "Crops for Selling": "Crops for Selling",
    Fruits: "Fruits",
    Vegetables: "Vegetables",
    "Animals & Products": "Animals & Products",
    "Oil Seeds": "Oil Seeds",
    Spices: "Spices",
    Flowers: "Flowers",
    "Processing Crops": "Processing Crops",
  };

  const categories = Object.entries(categoryMap).map(([english, key]) => ({
    value: english,
    label: t(`categories.${key}`, { defaultValue: english }),
  }));

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <h2 className="fw-bold text-success">{t("browseProducts.title")}</h2>
          <p className="text-muted mb-4">{t("browseProducts.subtitle")}</p>

          {/* FILTER CARD */}
          <div
            className="card shadow-lg border-0 rounded-4 p-4 mb-5"
            style={{ background: "linear-gradient(135deg, #f8f9fa, #ffffff)" }}
          >
            <div className="row g-4 align-items-end">
              {/* Search */}
              <div className="col-md-4">
                <label className="form-label fw-semibold text-success">
                  {t("browseProducts.searchLabel")}
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control ps-5 py-2 border-success-subtle shadow-sm"
                    placeholder={t("browseProducts.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="position-absolute top-50 start-0 translate-middle-y ps-4 text-success z-10">
                    <i className="bi bi-search fs-5"></i>
                  </span>
                </div>
              </div>

              {/* Category */}
              <div className="col-md-3">
                <label className="form-label fw-semibold text-success">
                  {t("browseProducts.categoryLabel")}
                </label>
                <select
                  className="form-select border-success-subtle shadow-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE SLIDER */}
              <div className="col-md-5">
                <label className="form-label fw-semibold text-success d-block">
                  {t("browseProducts.priceRange")}:{" "}
                  <span className="text-dark">
                    {rangeValues[0]} {t("payments.etb")} — {rangeValues[1]}{" "}
                    {t("payments.etb")}
                  </span>
                </label>
                <div className="position-relative" style={{ height: "50px" }}>
                  <div
                    className="slider-track"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      right: 0,
                      height: "6px",
                      background: "#e9ecef",
                      borderRadius: "3px",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <div
                    className="slider-progress"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${progressLeft}%`,
                      width: `${progressWidth}%`,
                      height: "6px",
                      background: "linear-gradient(to right, #2ecc71, #27ae60)",
                      borderRadius: "3px",
                      transform: "translateY(-50%)",
                      transition: "all 0.15s ease",
                    }}
                  />
                  <input
                    type="range"
                    className="slider-thumb min"
                    min={SLIDER_MIN}
                    max={sliderMaxDynamic}
                    step="50"
                    value={rangeValues[0]}
                    id="min"
                    onChange={handleRangeChange}
                    style={{
                      position: "absolute",
                      width: "100%",
                      background: "transparent",
                      pointerEvents: "none",
                      appearance: "none",
                      zIndex: 2,
                      top: "10px",
                    }}
                  />
                  <input
                    type="range"
                    className="slider-thumb max"
                    min={SLIDER_MIN}
                    max={sliderMaxDynamic}
                    step="50"
                    value={rangeValues[1]}
                    id="max"
                    onChange={handleRangeChange}
                    style={{
                      position: "absolute",
                      width: "100%",
                      background: "transparent",
                      pointerEvents: "none",
                      appearance: "none",
                      zIndex: 2,
                      top: "10px",
                    }}
                  />
                </div>

                <style jsx>{`
                  .slider-thumb::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border: 3px solid #2ecc71;
                    border-radius: 50%;
                    cursor: grab;
                    pointer-events: auto;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                    transition: all 0.2s;
                  }
                  .slider-thumb::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                  }
                  .slider-thumb::-webkit-slider-thumb:active {
                    cursor: grabbing;
                  }
                  .slider-thumb::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: white;
                    border: 3px solid #2ecc71;
                    border-radius: 50%;
                    cursor: grab;
                    pointer-events: auto;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                  }
                `}</style>
              </div>
            </div>

            <div className="mt-4 text-end">
              <button
                className="btn btn-outline-danger px-4"
                onClick={handleResetFilters}
              >
                {t("browseProducts.resetFilters")}
              </button>
            </div>
          </div>

          {/* PRODUCTS */}
          {loading ? (
            <div className="text-center py-5">
              <video
                autoPlay
                loop
                muted
                style={{ width: "300px", height: "300px" }}
              >
                <source src={Loader} type="video/mp4" />
              </video>
              <p className="mt-3 text-muted">{t("browseProducts.loading")}</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.productId} className="col">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-muted fs-5">
                    {t("browseProducts.noProductsFound")}
                  </p>
                  <button
                    className="btn btn-outline-success"
                    onClick={handleResetFilters}
                  >
                    {t("browseProducts.showAll")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BrowseProducts;
