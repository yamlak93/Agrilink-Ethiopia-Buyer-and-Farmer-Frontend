import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const PricingCard = ({ product: initialProduct, handleChange, onSave }) => {
  const { t } = useTranslation();
  const [product, setProduct] = useState(
    initialProduct || {
      price: "",
      quantity: "",
      unit: "kilogram (kg)",
      location: "",
    }
  );
  const [error, setError] = useState("");
  const [locations, setLocations] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch farmer's locations
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error(t("errors.noToken"));
        const response = await axios.get(
          "http://localhost:5000/api/locations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLocations(response.data || []);
      } catch (err) {
        console.error(t("errors.networkError"), err);
        setLocations([]);
        setError(t("errors.fetchLocationsFailed"));
      }
    };
    fetchLocations();
  }, [t]);

  useEffect(() => {
    if (product.quantity === 0 || product.quantity === "") {
      setError(t("products.quantityError"));
    } else if (product.price === "" || parseFloat(product.price) < 0) {
      setError(t("products.priceError"));
    } else if (!product.location) {
      setError(t("products.locationError"));
    } else {
      setError("");
    }
  }, [product.quantity, product.price, product.location, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    if (handleChange) handleChange(e);
  };

  const handleSaveClick = async () => {
    if (error) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error(t("errors.noToken"));
      await axios.post(
        "http://localhost:5000/api/products",
        {
          ...product,
          price: parseFloat(product.price),
          quantity: parseInt(product.quantity),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onSave) onSave();
      setProduct({
        price: "",
        quantity: "",
        unit: "kilogram (kg)",
        location: "",
      });
      setError(t("products.saveSuccess"));
    } catch (err) {
      console.error(t("errors.saveFailed"), err);
      setError(t("errors.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="card h-100 shadow-sm rounded-4"
      style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
    >
      <div
        className="card-body p-4"
        onMouseEnter={(e) => {
          e.currentTarget.parentElement.style.transform = "translateY(-5px)";
          e.currentTarget.parentElement.style.boxShadow =
            "0 8px 16px rgba(0, 0, 0, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.parentElement.style.transform = "translateY(0)";
          e.currentTarget.parentElement.style.boxShadow =
            "0 4px 8px rgba(0, 0, 0, 0.05)";
        }}
      >
        <h5
          className="card-title text-primary fw-bold mb-3"
          style={{ borderBottom: "2px solid #28a745", paddingBottom: "5px" }}
        >
          {t("products.pricingTitle")}
        </h5>
        <p className="card-text text-muted mb-4">
          {t("products.pricingSubtitle")}
        </p>

        {error && (
          <div className="alert alert-danger mb-3 p-2" role="alert">
            {error}
          </div>
        )}

        <form>
          <div className="mb-3">
            <label
              htmlFor="price"
              className="form-label text-secondary fw-medium"
            >
              {t("products.price")} ({t("payments.etb")}) *
            </label>
            <input
              type="number"
              className={`form-control ${
                error && !product.price ? "is-invalid" : ""
              }`}
              id="price"
              name="price"
              placeholder="0.00"
              step="0.01"
              value={product.price}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label
                htmlFor="quantity"
                className="form-label text-secondary fw-medium"
              >
                {t("products.quantity")} *
              </label>
              <input
                type="number"
                className={`form-control ${
                  error && (product.quantity === 0 || !product.quantity)
                    ? "is-invalid"
                    : ""
                }`}
                id="quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>

            <div className="col-md-6">
              <label
                htmlFor="unit"
                className="form-label text-secondary fw-medium"
              >
                {t("common.unit")} *
              </label>
              <select
                className="form-select"
                id="unit"
                name="unit"
                value={product.unit}
                onChange={handleInputChange}
                required
              >
                <option value="kilogram (kg)">
                  {t("units.kilogram (kg)")}
                </option>
                <option value="quintal">{t("units.quintal")}</option>
                <option value="piece">{t("units.piece")}</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="location"
              className="form-label text-secondary fw-medium"
            >
              {t("common.location")} *
            </label>
            <select
              className={`form-select ${
                error && !product.location ? "is-invalid" : ""
              }`}
              id="location"
              name="location"
              value={product.location}
              onChange={handleInputChange}
              required
            >
              <option value="">{t("common.location")}</option>
              {locations.map((loc) => (
                <option key={loc.farmerLocationId} value={loc.farmLocation}>
                  {loc.farmLocation}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricingCard;
