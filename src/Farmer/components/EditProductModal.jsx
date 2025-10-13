import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";

const unitOptions = ["kilogram (kg)", "quintal", "piece"];

const EditProductModal = ({ isVisible, product, onClose, onSave }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    unit: "",
    location: "",
    available: "",
    category: "",
    status: "",
    harvestDate: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isVisible && product) {
      setFormData({
        title: product.title || "",
        price: product.price || "",
        unit: product.unit || "",
        location: product.location || "",
        available: product.available || "",
        category: product.category || "",
        status: product.status || "",
        harvestDate: product.harvestDate
          ? product.harvestDate.split("T")[0]
          : "",
        description: product.description || "",
        imageFile: null,
      });
      setImagePreview(product.imageUrl || "");
      setError("");
    }
  }, [isVisible, product]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError(t("products.noAuthToken"));
          return;
        }
        const response = await axios.get(
          "http://localhost:5000/api/locations",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLocations(response.data.map((loc) => loc.farmLocation));
      } catch (err) {
        setError(t("products.fetchLocationsFailed"));
        console.error(err);
        setLocations([]);
      }
    };
    if (isVisible) fetchLocations();
  }, [isVisible, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError("");

    if (file) {
      const maxFileSize = 5 * 1024 * 1024;
      const acceptedFileTypes = ["image/jpeg", "image/png"];

      if (file.size > maxFileSize) {
        setError(t("products.fileSizeError"));
        e.target.value = null;
        setImagePreview(product.imageUrl || "");
        setFormData((prev) => ({ ...prev, imageFile: null }));
        return;
      }

      if (!acceptedFileTypes.includes(file.type)) {
        setError(t("products.fileTypeError"));
        e.target.value = null;
        setImagePreview(product.imageUrl || "");
        setFormData((prev) => ({ ...prev, imageFile: null }));
        return;
      }

      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, imageFile: file }));
    } else {
      setImagePreview(product.imageUrl || "");
      setFormData((prev) => ({ ...prev, imageFile: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) return;

    const updatedProduct = { ...product, ...formData };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(t("products.noAuthToken"));
        return;
      }

      const formDataToSend = new FormData();
      Object.entries(updatedProduct).forEach(([key, value]) => {
        if (key !== "imageFile") formDataToSend.append(key, value);
      });
      if (formData.imageFile) {
        formDataToSend.append("imageFile", formData.imageFile);
      }

      const response = await axios.put(
        `http://localhost:5000/api/products/${product.productId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const finalProduct = {
          ...updatedProduct,
          imageUrl: response.data.imageUrl || product.imageUrl,
        };
        onSave(finalProduct);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || t("products.updateFailed"));
      console.error("Error details:", err.response?.data || err.message);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`modal fade ${isVisible ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow rounded-4 border-0">
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold text-success">
              {t("products.editProduct")}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 pt-0">
              {error && <div className="alert alert-danger">{error}</div>}

              {/* IMAGE PREVIEW */}
              <div className="d-flex flex-column align-items-center mb-4">
                <div
                  className="rounded-circle overflow-hidden mb-3 border border-3 border-success"
                  style={{ width: "150px", height: "150px" }}
                >
                  <img
                    src={
                      imagePreview ||
                      "https://dummyimage.com/150x150/d4d4d4/666&text=Product+Image"
                    }
                    alt={t("products.productPreviewAlt")}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="productImage"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <label className="input-group-text" htmlFor="productImage">
                    {t("common.chooseImage")}
                  </label>
                </div>
              </div>

              {/* FORM FIELDS */}
              <div className="mb-3">
                <label className="form-label text-muted">
                  {t("products.name")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">
                  {t("products.price")}
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">
                  {t("common.unit")}
                </label>
                <select
                  className="form-select"
                  name="unit"
                  value={formData.unit || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t("common.unit")}</option>
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">
                  {t("common.location")}
                </label>
                <select
                  className="form-select"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t("common.location")}</option>
                  {locations.length === 0 ? (
                    <option value="" disabled>
                      {t("products.noLocations")}
                    </option>
                  ) : (
                    locations.map((loc, idx) => (
                      <option key={idx} value={loc}>
                        {loc}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">
                  {t("products.available")}
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="available"
                  value={formData.available}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">
                  {t("products.category")}
                </label>
                <select
                  className="form-select"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
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
                  <option value="Vegetables">
                    {t("categories.Vegetables")}
                  </option>
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
                <label className="form-label text-muted">
                  {t("common.status")}
                </label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t("common.status")}</option>
                  <option value="available">{t("common.available")}</option>
                  <option value="out of stock">{t("common.outOfStock")}</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">
                  {t("products.harvestDate")}
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">
                  {t("products.description")}
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer border-top-0 pt-0">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill fw-semibold"
                onClick={onClose}
              >
                {t("products.cancel")}
              </button>
              <button
                type="submit"
                className="btn btn-success rounded-pill fw-semibold"
              >
                {t("common.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
