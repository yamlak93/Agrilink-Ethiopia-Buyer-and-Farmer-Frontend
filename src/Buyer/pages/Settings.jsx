import React, { useState } from "react";
import "../../Css/Devices.css"; // Import Devices.css for ms-md-250
import Navbar from "../components/Navbar"; // Assuming Navbar is in components folder
import Sidebar from "../components/Sidebar"; // Assuming Sidebar is in components folder
import StylishModal from "../components/StylishModal"; // Assuming StylishModal is in components folder
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    fullName: "Abebe Kebede",
    email: "abebe@example.com",
    phoneNumber: "+251 91 987 6543",
    location: "Addis Ababa",
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

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Simulate saving profile changes
    console.log("Saving profile changes:", profileData);
    setIsEditing(false);

    setModal({
      isVisible: true,
      message: "Profile updated successfully!",
      type: "success",
    });
  };

  const handleSavePassword = () => {
    // Simulate password change logic
    console.log("Changing password:", passwordData);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setModal({
        isVisible: true,
        message: "New password and confirmation do not match.",
        type: "error",
      });
    } else {
      setModal({
        isVisible: true,
        message: "Password updated successfully!",
        type: "success",
      });
      // Clear password fields after successful update
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleCloseModal = () => {
    setModal({ isVisible: false, message: "", type: "" });
  };

  const renderProfileContent = () => {
    return (
      <div className="card my-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title">Profile Information</h5>
            {!isEditing && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                <FontAwesomeIcon icon={faPencilAlt} className="me-2" /> Edit
              </button>
            )}
          </div>
          <p className="card-text">
            Update your personal information and profile details
          </p>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                name="fullName"
                value={profileData.fullName}
                readOnly={!isEditing}
                onChange={handleProfileInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={profileData.email}
                readOnly={!isEditing}
                onChange={handleProfileInputChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={profileData.phoneNumber}
                readOnly={!isEditing}
                onChange={handleProfileInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={profileData.location}
                readOnly={!isEditing}
                onChange={handleProfileInputChange}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            {isEditing && (
              <button className="btn btn-success" onClick={handleSaveProfile}>
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPasswordContent = () => {
    return (
      <div className="card my-4">
        <div className="card-body">
          <h5 className="card-title">Change Password</h5>
          <p className="card-text">Update your account password</p>
          <div className="mb-3">
            <label htmlFor="currentPassword" className="form-label">
              Current Password
            </label>
            <input
              type="password"
              className="form-control"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              required
            />
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-success" onClick={handleSavePassword}>
              Update Password
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px", width: "100%" }} // Keep marginTop for navbar offset
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>Account Settings</h2>
              <p className="text-muted">
                Manage your account settings and preferences
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
                Profile
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "password" ? "active" : ""
                }`}
                onClick={() => setActiveTab("password")}
              >
                Password
              </button>
            </li>
          </ul>

          {activeTab === "profile"
            ? renderProfileContent()
            : renderPasswordContent()}
        </div>
      </div>

      <StylishModal
        isVisible={modal.isVisible}
        message={modal.message}
        type={modal.type}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Settings;
