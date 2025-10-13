import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const FarmLocationModal = ({
  isVisible,
  onClose,
  onAddFarmLocation,
  initialLocation,
}) => {
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    if (initialLocation) {
      setNewLocation({
        name: initialLocation.name || "",
        address: initialLocation.address || "",
      });
    } else {
      setNewLocation({ name: "", address: "" });
    }
  }, [initialLocation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (newLocation.name && newLocation.address) {
      onAddFarmLocation(newLocation);
      setNewLocation({ name: "", address: "" });
    }
  };

  return (
    <Modal show={isVisible} onHide={onClose} centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#f8faf8", borderBottom: "none" }}
      >
        <Modal.Title style={{ color: "#28a745", fontWeight: "600" }}>
          {initialLocation ? "Edit Farm Location" : "Add Farm Location"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px" }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#28a745", fontWeight: "600" }}>
              Farm Name
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newLocation.name}
              onChange={handleInputChange}
              placeholder="Enter farm name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#28a745", fontWeight: "600" }}>
              Address
            </Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={newLocation.address}
              onChange={handleInputChange}
              placeholder="Enter farm address"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: "none", justifyContent: "flex-end" }}>
        <Button
          variant="secondary"
          onClick={onClose}
          style={{ marginRight: "10px" }}
        >
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          {initialLocation ? "Update Location" : "Add Location"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FarmLocationModal;
