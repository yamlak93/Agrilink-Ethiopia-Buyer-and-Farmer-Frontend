import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/Devices.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StylishModal from "../components/StylishModal";
import ConfirmationModal from "../components/ConfirmationModal";
import FarmLocationModal from "../components/FarmLocationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faTrash,
  faEdit,
  faEye,
  faEyeSlash,
  faMapMarkerAlt,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../api/api"; // Import the api.js client
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../assets/Agriculture Loader.mp4";
import { useTranslation } from "react-i18next";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const navigate = this.props.navigate;
    navigate("/error", { state: { error: error.message }, replace: true });
  }

  render() {
    if (this.state.hasError) {
      return null; // Component will redirect in componentDidCatch
    }
    return this.props.children;
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

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const farmerId = user.id || "";

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      console.log("Fetching user data, farmerId:", farmerId);
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
          console.log("No token, redirecting to login");
          navigate("/login", { replace: true });
          return;
        }
        const response = await apiClient.get(`/settings/farmers/${farmerId}`);
        console.log("API Response:", response.data);
        setProfileData({
          fullName: response.data.farmerName || "",
          phoneNumber: response.data.phoneNumber
            ? `+251 ${response.data.phoneNumber}`
            : "",
          location: response.data.location || "",
        });
        await fetchFarmLocations();
      } catch (err) {
        console.error(
          "Failed to fetch user data:",
          err.response?.data || err.message
        );
        navigate("/error", { state: { error: err.message }, replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchUserData().catch((err) => {
      console.error("Uncaught error in fetchUserData:", err);
      navigate("/error", { state: { error: err.message }, replace: true });
    });
  }, [navigate, farmerId]);

  const fetchFarmLocations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      const response = await apiClient.get(`/farmerlocations/${farmerId}`);
      setFarmLocations(response.data.locations || []);
    } catch (err) {
      console.error("Failed to fetch farm locations:", err);
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.addError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      await apiClient.put(`/settings/farmers/${farmerId}`, {
        farmerName: profileData.fullName,
        phoneNumber: profileData.phoneNumber.replace("+251 ", ""),
        location: profileData.location,
      });
      setIsEditing(false);
      setModal({
        isVisible: true,
        message: t("settings.profile.updateSuccess"),
        type: "success",
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
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
      if (!token) throw new Error("No token available");

      setModal({ isVisible: false, message: "", type: "" });

      console.log(
        "Current Password Length:",
        passwordData.currentPassword.length
      );

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

      await apiClient.put(`/settings/farmers/${farmerId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
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
      console.error("Failed to update password:", err);
      setModal({
        isVisible: true,
        message: t("settings.password.updateError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModal({ isVisible: false, message: "", type: "" });
  };

  const handleAddFarmLocation = async (newLocation) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      const response = await apiClient.post("/farmerlocations", {
        farmerId,
        farmName: newLocation.name,
        farmLocation: newLocation.address,
      });
      setFarmLocations([...farmLocations, response.data.location]);
      setIsFarmLocationModalVisible(false);
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.addSuccess"),
        type: "success",
      });
    } catch (err) {
      console.error("Failed to add farm location:", err);
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.addError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocation = (index) => {
    setEditingLocationIndex(index);
    setEditedLocation({
      ...farmLocations[index],
      name: farmLocations[index].farmName,
      address: farmLocations[index].farmLocation,
    });
    setIsFarmLocationModalVisible(true);
  };

  const handleUpdateLocation = async (updatedLocation) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      const locationToUpdate = farmLocations[editingLocationIndex];
      const response = await apiClient.put(
        `/farmerlocations/${locationToUpdate.farmerLocationId}`,
        {
          farmerId,
          farmName: updatedLocation.name,
          farmLocation: updatedLocation.address,
        }
      );
      const updatedLocations = farmLocations.map((loc, i) =>
        i === editingLocationIndex ? response.data.location : loc
      );
      setFarmLocations(updatedLocations);
      setEditingLocationIndex(null);
      setEditedLocation({ name: "", address: "" });
      setIsFarmLocationModalVisible(false);
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.updateSuccess"),
        type: "success",
      });
    } catch (err) {
      console.error("Failed to update farm location:", err);
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.updateError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (index) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      const locationToDelete = farmLocations[index];
      await apiClient.delete(
        `/farmerlocations/${locationToDelete.farmerLocationId}`
      );
      const updatedLocations = farmLocations.filter((_, i) => i !== index);
      setFarmLocations(updatedLocations);
      setModal({
        isVisible: true,
        message: t("settings.farmLocation.deleteSuccess"),
        type: "success",
      });
    } catch (err) {
      console.error("Failed to delete farm location:", err);
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
      if (!token) throw new Error("No token available");
      console.log("Attempting to delete account for farmerId:", farmerId);
      const response = await apiClient.delete(`/settings/farmers/${farmerId}`);
      console.log("Delete response:", response.data);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setModal({
        isVisible: true,
        message: t("settings.deleteAccount.success"),
        type: "success",
      });
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      console.error(
        "Failed to delete account:",
        err.response?.data || err.message
      );
      setModal({
        isVisible: true,
        message: t("settings.deleteAccount.error"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderProfileContent = () => {
    const FarmLocation = ({ locations }) => {
      return (
        <div className="mt-4">
          <h6
            className="mb-4"
            style={{
              color: "#28a745",
              fontWeight: "600",
              borderBottom: "2px solid #28a745",
              paddingBottom: "5px",
            }}
          >
            {t("settings.profile.farmLocations")}
          </h6>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {locations.length > 0 ? (
              locations.map((location, index) => (
                <div key={index} className="col">
                  <div
                    className="card h-100 shadow-sm border-0 rounded-3"
                    style={{
                      transition: "transform 0.2s, box-shadow 0.2s",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8faf8 100%)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0, 0, 0, 0.05)";
                    }}
                  >
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
                          {location.farmName}
                        </h5>
                      </div>
                      <p
                        className="card-text text-muted"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {t("settings.profile.farmAddress")}:{" "}
                        {location.farmLocation}
                      </p>
                    </div>
                    <div className="card-footer bg-transparent border-0 d-flex justify-content-end p-3">
                      <button
                        className="btn btn-outline-warning btn-sm me-2"
                        onClick={() => handleEditLocation(index)}
                        style={{ padding: "4px 12px", fontSize: "0.875rem" }}
                      >
                        <FontAwesomeIcon icon={faEdit} />{" "}
                        {t("settings.profile.edit")}
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteLocation(index)}
                        style={{ padding: "4px 12px", fontSize: "0.875rem" }}
                      >
                        <FontAwesomeIcon icon={faTrash} />{" "}
                        {t("settings.profile.delete")}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-4">
                {t("settings.profile.noLocations")}
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="card my-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
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
          <p className="card-text">{t("settings.profile.description")}</p>

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
            <>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="fullName" className="form-label">
                    {t("settings.profile.fullName")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={profileData.fullName}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3"></div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    {t("settings.profile.phoneNumber")}
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="location" className="form-label">
                    {t("settings.profile.location")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={profileData.location}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6
                    className="mb-0"
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
                    style={{ padding: "6px 12px" }}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} className="me-2" />{" "}
                    {t("settings.profile.addFarm")}
                  </button>
                </div>
                {farmLocations.length > 0 ? (
                  <FarmLocation locations={farmLocations} />
                ) : (
                  <div className="text-center text-muted py-4">
                    {t("settings.profile.noLocations")}
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
            <>
              <div className="mb-3 position-relative">
                <label htmlFor="currentPassword" className="form-label">
                  {t("settings.password.currentPassword")}
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.currentPassword ? "text" : "password"}
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => togglePasswordVisibility("currentPassword")}
                    style={{ zIndex: 1 }}
                  >
                    <FontAwesomeIcon
                      icon={showPassword.currentPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="newPassword" className="form-label">
                  {t("settings.password.newPassword")}
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.newPassword ? "text" : "password"}
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => togglePasswordVisibility("newPassword")}
                    style={{ zIndex: 1 }}
                  >
                    <FontAwesomeIcon
                      icon={showPassword.newPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="confirmPassword" className="form-label">
                  {t("settings.password.confirmPassword")}
                </label>
                <div className="input-group">
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    style={{ zIndex: 1 }}
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

          <ul className="nav nav-tabs">
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
          {!loading &&
            (activeTab === "profile"
              ? renderProfileContent()
              : renderPasswordContent())}

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
