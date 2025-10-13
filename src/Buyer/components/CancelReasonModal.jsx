import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CancelReasonModal = ({ show, onClose, onConfirm, orderId }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim()) {
      onConfirm(orderId, reason);
      setReason("");
      onClose();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cancel Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please provide a reason for cancelling order #{orderId}:</p>
        <Form>
          <Form.Group controlId="cancelReason">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter cancellation reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleSubmit}
          disabled={!reason.trim()}
        >
          Confirm Cancellation
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelReasonModal;
