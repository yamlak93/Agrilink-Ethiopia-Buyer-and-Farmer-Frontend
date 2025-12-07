// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StylishModal from "../components/StylishModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../../api/api";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile"); // internal key
  const [profileData, setProfileData] = useState({
    buyerName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [modal, setModal] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    fetchBuyerData();
  }, []);

  const fetchBuyerData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const response = await apiClient.get("/buyer/profile");
      const buyer = response.data;

      setProfileData({
        buyerName: buyer.buyerName || "",
        email: buyer.email || "",
        phoneNumber: buyer.phoneNumber || "",
        address: buyer.address || "",
      });
    } catch (error) {
      console.error("Error fetching buyer data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        setModal({
          isVisible: true,
          message: t("buyerProfile.errors.loadFailed"),
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await apiClient.put("/buyer/update-profile", profileData);
      setIsEditing(false);
      setModal({
        isVisible: true,
        message: t("buyerProfile.profile.success"),
        type: "success",
      });
    } catch (error) {
      setModal({
        isVisible: true,
        message:
          error.response?.data?.message ||
          t("buyerProfile.profile.updateFailed"),
        type: "error",
      });
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setModal({
        isVisible: true,
        message: t("buyerProfile.password.mismatch"),
        type: "error",
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setModal({
        isVisible: true,
        message: t("buyerProfile.password.minLength"),
        type: "error",
      });
      return;
    }

    try {
      await apiClient.put("/buyer/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setModal({
        isVisible: true,
        message: t("buyerProfile.password.success"),
        type: "success",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setModal({
        isVisible: true,
        message:
          error.response?.data?.message ||
          t("buyerProfile.password.updateFailed"),
        type: "error",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await apiClient.delete("/buyer/delete-account");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setModal({
        isVisible: true,
        message: t("buyerProfile.danger.deleted"),
        type: "success",
      });
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (error) {
      setModal({
        isVisible: true,
        message:
          error.response?.data?.message ||
          t("buyerProfile.danger.deleteFailed"),
        type: "error",
      });
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setModal({ isVisible: false, message: "", type: "" });
  };

  // === TABS (internal keys + translated labels) ===
  const tabs = [
    { key: "profile", label: t("buyerProfile.tabs.profile") },
    { key: "password", label: t("buyerProfile.tabs.password") },
    { key: "account", label: t("buyerProfile.tabs.account") },
  ];

  const renderProfileContent = () => {
    if (loading) {
      return (
        <div className="card my-4 text-center">
          <div className="card-body">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">{t("common.loading")}</span>
            </div>
            <p className="mt-2">{t("buyerProfile.profile.loading")}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="card my-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title">{t("buyerProfile.profile.title")}</h5>
            {!isEditing && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
                {t("common.edit")}
              </button>
            )}
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">
                {t("buyerProfile.profile.name")}
              </label>
              <input
                type="text"
                className="form-control"
                name="buyerName"
                value={profileData.buyerName}
                readOnly={!isEditing}
                onChange={handleProfileInputChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                {t("buyerProfile.profile.email")}
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={profileData.email}
                readOnly={!isEditing}
                onChange={handleProfileInputChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                {t("buyerProfile.profile.phone")}
              </label>
              <input
                type="tel"
                className="form-control"
                name="phoneNumber"
                value={profileData.phoneNumber}
                readOnly={!isEditing}
                onChange={handleProfileInputChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                {t("buyerProfile.profile.address")}
              </label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={profileData.address}
                readOnly={!isEditing}
                onChange={handleProfileInputChange}
              />
            </div>
          </div>

          {isEditing && (
            <div className="d-flex justify-content-end mt-4 gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setIsEditing(false);
                  fetchBuyerData();
                }}
              >
                {t("common.cancel")}
              </button>
              <button className="btn btn-success" onClick={handleSaveProfile}>
                {t("common.save")}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPasswordContent = () => (
    <div className="card my-4">
      <div className="card-body">
        <h5 className="card-title">{t("buyerProfile.password.title")}</h5>
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label">
              {t("buyerProfile.password.current")}
            </label>
            <input
              type="password"
              className="form-control"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              {t("buyerProfile.password.new")}
            </label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              {t("buyerProfile.password.confirm")}
            </label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-success" onClick={handleSavePassword}>
            {t("buyerProfile.password.update")}
          </button>
        </div>
      </div>
    </div>
  );

  const renderDangerZone = () => (
    <div className="card my-4 border-danger">
      <div className="card-body">
        <h5 className="card-title text-danger">
          {t("buyerProfile.danger.title")}
        </h5>
        <p className="text-muted">{t("buyerProfile.danger.warning")}</p>
        <button
          className="btn btn-danger"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <FontAwesomeIcon icon={faTrash} className="me-2" />
          {t("buyerProfile.danger.delete")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <div className="mb-4">
            <h2>{t("buyerProfile.pageTitle")}</h2>
            <p className="text-muted">{t("buyerProfile.pageSubtitle")}</p>
          </div>

          <ul className="nav nav-tabs mb-4">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link ${
                    activeTab === tab.key ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {activeTab === "profile"
            ? renderProfileContent()
            : activeTab === "password"
            ? renderPasswordContent()
            : renderDangerZone()}
        </div>
      </div>

      <StylishModal
        isVisible={modal.isVisible}
        message={modal.message}
        type={modal.type}
        onClose={handleCloseModal}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-danger">
                <h5 className="modal-title text-danger">
                  {t("buyerProfile.danger.confirmTitle")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                />
              </div>
              <div className="modal-body">
                <p className="fw-bold">
                  {t("buyerProfile.danger.confirmQuestion")}
                </p>
                <p className="text-muted">
                  {t("buyerProfile.danger.confirmWarning")}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  {t("common.cancel")}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      {t("common.deleting")}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTrash} className="me-2" />
                      {t("buyerProfile.danger.delete")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
