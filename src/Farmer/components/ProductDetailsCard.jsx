import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const ProductDetailsCard = ({ product: initialProduct, handleChange }) => {
  const { t } = useTranslation();
  const [product, setProduct] = useState(
    initialProduct || {
      productName: "",
      category: "",
      description: "",
      harvestDate: "",
    }
  );
  const [error, setError] = useState("");

  useEffect(() => {
    // Validate all required fields
    if (
      !product.productName ||
      !product.category ||
      !product.description ||
      !product.harvestDate
    ) {
      setError(t("products.requiredFieldsError"));
    } else {
      setError("");
    }
  }, [
    product.productName,
    product.category,
    product.description,
    product.harvestDate,
    t,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    if (handleChange) handleChange(e);
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
          {t("products.details")}
        </h5>
        <p className="card-text text-muted mb-4">{t("products.basicInfo")}</p>

        {error && (
          <div className="alert alert-danger mb-3 p-2" role="alert">
            {error}
          </div>
        )}

        <form>
          <div className="mb-3">
            <label
              htmlFor="productName"
              className="form-label text-secondary fw-medium"
            >
              {t("products.productName")} *
            </label>
            <input
              type="text"
              className={`form-control ${
                error && !product.productName ? "is-invalid" : ""
              }`}
              id="productName"
              name="productName"
              placeholder={t("products.productNamePlaceholder")}
              value={product.productName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="category"
              className="form-label text-secondary fw-medium"
            >
              {t("products.category")} *
            </label>
            <select
              className={`form-select ${
                error && !product.category ? "is-invalid" : ""
              }`}
              id="category"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              required
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

          <div className="mb-3">
            <label
              htmlFor="description"
              className="form-label text-secondary fw-medium"
            >
              {t("products.description")} *
            </label>
            <textarea
              className={`form-control ${
                error && !product.description ? "is-invalid" : ""
              }`}
              id="description"
              name="description"
              rows="3"
              placeholder={t("products.descriptionPlaceholder")}
              value={product.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="harvestDate"
              className="form-label text-secondary fw-medium"
            >
              {t("products.harvestDate")} *
            </label>
            <input
              type="date"
              className={`form-control ${
                error && !product.harvestDate ? "is-invalid" : ""
              }`}
              id="harvestDate"
              name="harvestDate"
              value={product.harvestDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
