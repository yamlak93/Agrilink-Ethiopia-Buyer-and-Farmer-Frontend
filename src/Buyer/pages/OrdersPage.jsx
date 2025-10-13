import React, { useState } from "react";
import "../../Css/Devices.css"; // Import Devices.css for ms-md-250
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar"; // Assuming Navbar is in components folder
import Sidebar from "../components/Sidebar"; // Assuming Sidebar is in components folder
import OrderCard from "../components/OrderCard"; // Assuming OrderCard is in the same folder as OrdersPage
import OrderDetailModal from "../components/OrderDetailModal"; // Import the new modal
import StylishModal from "../components/StylishModal"; // Assuming StylishModal is in components folder
import CancelReasonModal from "../components/CancelReasonModal"; // New modal for cancellation reason
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// Sample order data
const initialOrders = [
  {
    id: 1,
    productName: "Teff - Premium Quality",
    orderId: "ORD-001",
    farmerName: "Kebede Tadesse",
    location: "Addis Ababa",
    orderDate: "2025-05-12",
    quantity: 1,
    unit: "quintal",
    deliveryDate: "2023-05-15",
    totalPrice: "1,200",
    status: "Delivered",
  },
  {
    id: 2,
    productName: "Organic Coffee Beans",
    orderId: "ORD-002",
    farmerName: "Almaz Haile",
    location: "Yirgacheffe",
    orderDate: "2023-05-18",
    quantity: 2,
    unit: "kg",
    deliveryDate: "2023-05-21",
    totalPrice: "1,700",
    status: "Shipped",
  },
  {
    id: 3,
    productName: "Fresh Avocados",
    orderId: "ORD-003",
    farmerName: "Girma Bekele",
    location: "Hawassa",
    orderDate: "2023-05-20",
    quantity: 10,
    unit: "kg",
    deliveryDate: "2023-05-22",
    totalPrice: "350",
    status: "Pending",
  },
  {
    id: 4,
    productName: "Honey - Pure",
    orderId: "ORD-004",
    farmerName: "Tigist Mengistu",
    location: "Gonder",
    orderDate: "2023-05-25",
    quantity: 2,
    unit: "liter",
    deliveryDate: "2023-05-28",
    totalPrice: "1,000",
    status: "Pending",
  },
  {
    id: 5,
    productName: "Red Onions",
    orderId: "ORD-005",
    farmerName: "Dawit Hailu",
    location: "Mekelle",
    orderDate: "2023-05-27",
    quantity: 20,
    unit: "kg",
    deliveryDate: "2023-05-30",
    totalPrice: "500",
    status: "Pending",
  },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
  });
  // State to control the visibility of the OrderDetailModal
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  // State to store the currently selected order for the modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // State for CancelReasonModal
  const [isCancelReasonModalVisible, setCancelReasonModalVisible] =
    useState(false);
  const [selectedOrderIdForCancel, setSelectedOrderIdForCancel] =
    useState(null);

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "All Orders" || order.status === activeTab;
    const matchesSearch =
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.farmerName.toLowerCase().includes(searchTerm.toLowerCase());

    // Exact date match using string comparison
    const matchesDate =
      !dateFilter.startDate || order.orderDate === dateFilter.startDate;

    return matchesTab && matchesSearch && matchesDate;
  });

  // Handler to open the Order Detail Modal
  const handleOpenDetailModal = (order) => {
    setSelectedOrder(order); // Set the order data to be displayed
    setDetailModalVisible(true); // Make the modal visible
  };

  // Handler to close the Order Detail Modal
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false); // Hide the modal
    setSelectedOrder(null); // Clear selected order when closing
  };

  // Handler to initiate order cancellation
  const handleCancelOrder = (orderId) => {
    setSelectedOrderIdForCancel(orderId);
    setCancelReasonModalVisible(true); // Open the cancel reason modal
  };

  // Handler to confirm cancellation with reason
  const handleConfirmCancel = (orderId, reason) => {
    console.log(`Cancelling order with ID: ${orderId}, Reason: ${reason}`);
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: "Cancelled", cancelReason: reason }
          : order
      )
    );
    setCancelReasonModalVisible(false); // Close the cancel reason modal
    setSuccessMessage(`Order ${orderId} has been cancelled. Reason: ${reason}`);
    setSuccessModalVisible(true); // Show success modal
  };

  // Handler for closing the success modal
  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
    setSuccessMessage("");
  };

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }} // Keep marginTop for navbar offset
        >
          <h2
            className="fw-bold"
            style={{ fontSize: "24px", color: "#1a2e5a" }}
          >
            My Orders
          </h2>
          <p
            className="text-muted"
            style={{ fontSize: "14px", color: "#6c757d" }}
          >
            Track and manage your purchases
          </p>

          <div className="bg-white p-4 rounded shadow-sm">
            <h5 className="mb-3">Order History</h5>

            {/* Tabs for order filtering */}
            <ul className="nav nav-pills mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "All Orders" ? "bg-success text-white" : ""
                  }`}
                  onClick={() => setActiveTab("All Orders")}
                >
                  All Orders
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "Pending" ? "bg-success text-white" : ""
                  }`}
                  onClick={() => setActiveTab("Pending")}
                >
                  Pending
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "Shipped" ? "bg-success text-white" : ""
                  }`}
                  onClick={() => setActiveTab("Shipped")}
                >
                  Shipped
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "Delivered" ? "bg-success text-white" : ""
                  }`}
                  onClick={() => setActiveTab("Delivered")}
                >
                  Delivered
                </button>
              </li>
            </ul>

            {/* Search and Date Filter Section */}
            <div className="mb-4 d-flex align-items-center">
              <input
                type="text"
                className="form-control me-3"
                style={{
                  width: "250px",
                  fontSize: "14px",
                  color: "#495057",
                  borderColor: "#ced4da",
                  padding: "6px 12px",
                  borderRadius: "4px",
                }}
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="date"
                className="form-control"
                style={{
                  width: "150px",
                  fontSize: "14px",
                  color: "#495057",
                  borderColor: "#ced4da",
                  padding: "6px 12px",
                  borderRadius: "4px",
                }}
                value={dateFilter.startDate}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, startDate: e.target.value })
                }
              />
            </div>

            {/* List of Order Cards */}
            <div className="order-list">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleOpenDetailModal}
                  />
                ))
              ) : (
                <p className="text-muted text-center mt-5">
                  No orders found for this filter.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal: Its visibility is controlled by isDetailModalVisible */}
      <OrderDetailModal
        isVisible={isDetailModalVisible}
        order={selectedOrder}
        onClose={handleCloseDetailModal}
        onCancelOrder={handleCancelOrder}
      />

      {/* Success Modal (assuming StylishModal is available) */}
      <StylishModal
        isVisible={isSuccessModalVisible}
        message={successMessage}
        type="success"
        onClose={handleCloseSuccessModal}
      />

      {/* Cancel Reason Modal */}
      <CancelReasonModal
        show={isCancelReasonModalVisible}
        onClose={() => setCancelReasonModalVisible(false)}
        onConfirm={handleConfirmCancel}
        orderId={selectedOrderIdForCancel}
      />
    </>
  );
};

export default OrdersPage;
