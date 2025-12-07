// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StylishModal from "../components/StylishModal";
import ConfirmationModal from "../components/ConfirmationModal";
import FarmLocationModal from "../components/FarmLocationModal";
import BankDetailsModal from "../components/BankDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faEdit,
  faEye,
  faEyeSlash,
  faMapMarkerAlt,
  faPlusCircle,
  faCheckCircle,
  faEdit as faEditIcon,
} from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../assets/Agriculture Loader.mp4";
import { useTranslation } from "react-i18next";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    const navigate = this.props.navigate;
    navigate("/error", { state: { error: error.message }, replace: true });
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
    location: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [modal, setModal] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const [isFarmLocationModalVisible, setIsFarmLocationModalVisible] =
    useState(false);
  const [farmLocations, setFarmLocations] = useState([]);
  const [editingLocationIndex, setEditingLocationIndex] = useState(null);
  const [editedLocation, setEditedLocation] = useState({
    name: "",
    address: "",
  });
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(true);

  // BANK STATE
  const [bankDetails, setBankDetails] = useState([]);
  const [chapaBanks, setChapaBanks] = useState([]);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const farmerId = user.id || "";

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        // Profile
        const profileRes = await apiClient.get(
          `/settings/farmers/${farmerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfileData({
          fullName: profileRes.data.farmerName || "",
          phoneNumber: profileRes.data.phoneNumber
            ? `+251 ${profileRes.data.phoneNumber}`
            : "",
          location: profileRes.data.location || "",
        });

        // Bank Details
        const bankRes = await apiClient.get(
          `/settings/farmers/${farmerId}/bank`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBankDetails(bankRes.data.bankDetails || []);

        // Chapa Banks
        try {
          const chapaRes = await fetch(
            "http://localhost:5000/api/auth/chapa/banks",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (chapaRes.ok) {
            const data = await chapaRes.json();
            setChapaBanks(data.data || []);
          }
        } catch (err) {
          console.error("Failed to fetch Chapa banks:", err);
          setChapaBanks([]);
        }

        await fetchFarmLocations();
      } catch (err) {
        navigate("/error", { state: { error: err.message }, replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, farmerId]);

  const fetchFarmLocations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiClient.get(`/farmerlocations/${farmerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmLocations(res.data.locations || []);
    } catch (err) {
      console.error("Failed to fetch farm locations:", err);
    }
  };

  // PROFILE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await apiClient.put(
        `/settings/farmers/${farmerId}`,
        {
          farmerName: profileData.fullName,
          phoneNumber: profileData.phoneNumber.replace("+251 ", ""),
          location: profileData.location,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      setModal({
        isVisible: true,
        message: t("settings.profile.updateSuccess"),
        type: "success",
      });
    } catch (err) {
      setModal({
        isVisible: true,
        message: t("settings.profile.updateError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (passwordData.currentPassword.length < 6) {
        setModal({
          isVisible: true,
          message: t("settings.password.minLength"),
          type: "error",
        });
        setLoading(false);
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setModal({
          isVisible: true,
          message: t("settings.password.mismatch"),
          type: "error",
        });
        setLoading(false);
        return;
      }
      await apiClient.put(
        `/settings/farmers/${farmerId}/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModal({
        isVisible: true,
        message: t("settings.password.updateSuccess"),
        type: "success",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setModal({
        isVisible: true,
        message: t("settings.password.updateError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () =>
    setModal({ isVisible: false, message: "", type: "" });

  // FARM LOCATIONS
  const handleAddFarmLocation = async (loc) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await apiClient.post(
        "/farmerlocations",
        {
          farmerId,
          farmName: loc.name,
          farmLocation: loc.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFarmLocations((prev) => [...prev, res.data.location]);
      setIsFarmLocationModalVisible(false);
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.addSuccess"),
        type: "success",
      });
    } catch (err) {
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.addError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocation = (i) => {
    setEditingLocationIndex(i);
    setEditedLocation({
      name: farmLocations[i].farmName,
      address: farmLocations[i].farmLocation,
    });
    setIsFarmLocationModalVisible(true);
  };

  const handleUpdateLocation = async (loc) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const id = farmLocations[editingLocationIndex].farmerLocationId;
      const res = await apiClient.put(
        `/farmerlocations/${id}`,
        {
          farmerId,
          farmName: loc.name,
          farmLocation: loc.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFarmLocations((prev) =>
        prev.map((l, i) => (i === editingLocationIndex ? res.data.location : l))
      );
      setEditingLocationIndex(null);
      setIsFarmLocationModalVisible(false);
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.updateSuccess"),
        type: "success",
      });
    } catch (err) {
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.updateError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (i) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(
        `/farmerlocations/${farmLocations[i].farmerLocationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFarmLocations((prev) => prev.filter((_, idx) => idx !== i));
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.deleteSuccess"),
        type: "success",
      });
    } catch (err) {
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.deleteError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/settings/farmers/${farmerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      setModal({
        isVisible: true,
        message: t("settings.deleteAccount.success"),
        type: "success",
      });
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setModal({
        isVisible: true,
        message: t("settings.deleteAccount.error"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (f) => {
    setShowPassword((prev) => ({ ...prev, [f]: !prev[f] }));
  };

  // BANK: EDIT ONLY
  const openBankModal = (bank) => {
    setEditingBank(bank);
    setIsBankModalOpen(true);
  };

  const closeBankModal = () => {
    setIsBankModalOpen(false);
    setEditingBank(null);
  };

  const handleSaveBank = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await apiClient.put(
        `/settings/farmers/${farmerId}/bank/${editingBank.id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = await apiClient.get(`/settings/farmers/${farmerId}/bank`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBankDetails(res.data.bankDetails || []);
      setModal({
        isVisible: true,
        message: t("settings.profile.bankUpdated"),
        type: "success",
      });
    } catch (err) {
      setModal({
        isVisible: true,
        message: t("settings.profile.bankUpdateError"),
        type: "error",
      });
    } finally {
      setLoading(false);
      closeBankModal();
    }
  };

  const renderProfileContent = () => {
    return (
      <div className="card my-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title">{t("settings.profile.title")}</h5>
            {!isEditing && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <FontAwesomeIcon icon={faPencilAlt} className="me-2" />{" "}
                {t("settings.profile.edit")}
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center p-5">
              <video
                autoPlay
                loop
                muted
                style={{ width: "300px", height: "300px" }}
              >
                <source src={Loader} type="video/webm" />
              </video>
            </div>
          ) : (
            <>
              {/* Profile Fields */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    {t("settings.profile.fullName")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={profileData.fullName}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    {t("settings.profile.phoneNumber")}
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    {t("settings.profile.location")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={profileData.location}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Farm Locations */}
              <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6
                    style={{
                      color: "#28a745",
                      fontWeight: "600",
                      borderBottom: "2px solid #28a745",
                      paddingBottom: "5px",
                    }}
                  >
                    {t("settings.profile.farmLocations")}
                  </h6>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      setEditingLocationIndex(null);
                      setEditedLocation({ name: "", address: "" });
                      setIsFarmLocationModalVisible(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} className="me-2" />{" "}
                    {t("settings.profile.addFarm")}
                  </button>
                </div>
                {farmLocations.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                    {farmLocations.map((loc, i) => (
                      <div key={i} className="col">
                        <div className="card h-100 shadow-sm border-0 rounded-3">
                          <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                              <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                style={{
                                  color: "#28a745",
                                  fontSize: "1.5rem",
                                  marginRight: "10px",
                                }}
                              />
                              <h5
                                className="card-title mb-0"
                                style={{ color: "#28a745" }}
                              >
                                {loc.farmName}
                              </h5>
                            </div>
                            <p
                              className="card-text text-muted"
                              style={{ fontSize: "0.9rem" }}
                            >
                              {t("settings.profile.farmAddress")}:{" "}
                              {loc.farmLocation}
                            </p>
                          </div>
                          <div className="card-footer bg-transparent border-0 d-flex justify-content-end p-3">
                            <button
                              className="btn btn-outline-warning btn-sm me-2"
                              onClick={() => handleEditLocation(i)}
                            >
                              <FontAwesomeIcon icon={faEdit} />{" "}
                              {t("settings.profile.edit")}
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteLocation(i)}
                            >
                              <FontAwesomeIcon icon={faTrash} />{" "}
                              {t("settings.profile.delete")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    {t("settings.profile.noLocations")}
                  </div>
                )}
              </div>

              {/* BANK DETAILS – NO ADD BUTTON */}
              <div className="mt-5">
                <h6
                  style={{
                    color: "#28a745",
                    fontWeight: "600",
                    borderBottom: "2px solid #28a745",
                    paddingBottom: "5px",
                    marginBottom: "1rem",
                  }}
                >
                  {t("settings.profile.bankDetails")}
                </h6>

                {bankDetails.length > 0 ? (
                  <div className="row g-3">
                    {bankDetails.map((bank) => {
                      const bankInfo = chapaBanks.find(
                        (b) => b.id === bank.bankId
                      );
                      return (
                        <div key={bank.id} className="col-md-6">
                          <div className="card h-100 shadow-sm border-0 position-relative">
                            <div
                              className="position-absolute top-0 end-0 p-2 d-flex gap-1"
                              style={{ zIndex: 1 }}
                            >
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openBankModal(bank)}
                              >
                                <FontAwesomeIcon icon={faEditIcon} />
                              </button>
                            </div>
                            <div className="card-body">
                              <h6 className="card-title mb-1">
                                {bank.accountName}
                                {bank.isDefault && (
                                  <span className="badge bg-success ms-2">
                                    {t("settings.profile.default")}
                                  </span>
                                )}
                              </h6>
                              <p className="text-muted mb-1">
                                <strong>{t("farmer.bank")}:</strong>{" "}
                                {bankInfo?.name || "Unknown"}
                              </p>
                              <p className="text-muted mb-1">
                                <strong>{t("farmer.accountNumber")}:</strong>{" "}
                                {bank.accountNumber}
                              </p>
                              <p className="text-muted mb-0">
                                <strong>{t("common.status")}:</strong>{" "}
                                {bank.isVerified ? (
                                  <span className="text-success">
                                    <FontAwesomeIcon icon={faCheckCircle} />{" "}
                                    {t("common.verified")}
                                  </span>
                                ) : (
                                  <span className="text-warning">
                                    {t("common.pending")}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    {t("settings.profile.noBankDetails")}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end mt-4">
                {isEditing && (
                  <button className="btn btn-success me-2" onClick={handleSave}>
                    {t("settings.profile.saveChanges")}
                  </button>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => setDeleteConfirmationVisible(true)}
                >
                  {t("settings.profile.deleteAccount")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderPasswordContent = () => {
    return (
      <div className="card my-4">
        <div className="card-body">
          <h5 className="card-title">{t("settings.password.title")}</h5>
          <p className="card-text">{t("settings.password.description")}</p>
          {loading && (
            <div className="text-center p-5">
              <video
                autoPlay
                loop
                muted
                style={{ width: "300px", height: "300px" }}
              >
                <source src={Loader} type="video/webm" />
              </video>
            </div>
          )}
          {!loading && (
            <>
              <div className="mb-3 position-relative">
                <label className="form-label">
                  {t("settings.password.currentPassword")}
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.currentPassword ? "text" : "password"}
                    className="form-control"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => togglePasswordVisibility("currentPassword")}
                  >
                    <FontAwesomeIcon
                      icon={showPassword.currentPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  {t("settings.password.newPassword")}
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.newPassword ? "text" : "password"}
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => togglePasswordVisibility("newPassword")}
                  >
                    <FontAwesomeIcon
                      icon={showPassword.newPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  {t("settings.password.confirmPassword")}
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    className="form-control"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    <FontAwesomeIcon
                      icon={showPassword.confirmPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-4">
                <button
                  className="btn btn-success"
                  onClick={handlePasswordSave}
                >
                  {t("settings.password.updatePassword")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary navigate={navigate}>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>{t("settings.accountSettings.title")}</h2>
              <p className="text-muted">
                {t("settings.accountSettings.description")}
              </p>
            </div>
          </div>

          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "profile" ? "active" : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                {t("settings.tabs.profile")}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "password" ? "active" : ""
                }`}
                onClick={() => setActiveTab("password")}
              >
                {t("settings.tabs.password")}
              </button>
            </li>
          </ul>

          {loading ? (
            <div className="text-center p-5">
              <video
                autoPlay
                loop
                muted
                style={{ width: "300px", height: "300px" }}
              >
                <source src={Loader} type="video/webm" />
              </video>
            </div>
          ) : activeTab === "profile" ? (
            renderProfileContent()
          ) : (
            renderPasswordContent()
          )}

          {/* EDIT BANK MODAL */}
          <BankDetailsModal
            isOpen={isBankModalOpen}
            onClose={closeBankModal}
            bank={editingBank}
            chapaBanks={chapaBanks}
            onSave={handleSaveBank}
          />

          <StylishModal
            isVisible={modal.isVisible && !isDeleteConfirmationVisible}
            message={modal.message}
            type={modal.type}
            onClose={handleCloseModal}
          />

          <ConfirmationModal
            isVisible={isDeleteConfirmationVisible}
            message={t("settings.deleteAccount.confirm")}
            onClose={() => setDeleteConfirmationVisible(false)}
            onConfirm={handleDeleteAccount}
          />
        </div>
      </div>

      <FarmLocationModal
        isVisible={isFarmLocationModalVisible}
        onClose={() => setIsFarmLocationModalVisible(false)}
        onAddFarmLocation={
          editingLocationIndex !== null
            ? handleUpdateLocation
            : handleAddFarmLocation
        }
        initialLocation={editingLocationIndex !== null ? editedLocation : null}
      />
    </ErrorBoundary>
  );
};

export default SettingsPage;
