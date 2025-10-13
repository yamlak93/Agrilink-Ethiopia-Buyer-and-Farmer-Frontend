import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import EditProductModal from "./EditProductModal";
import ConfirmationModal from "./ConfirmationModal";
import StylishModal from "./StylishModal";
import SalesAnalytics from "./SalesAnalytics"; // Import SalesAnalytics

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isNotificationModalVisible, setNotificationModalVisible] =
    useState(false); // State for NotificationModal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    // Trigger NotificationModal when switching to Analytics tab
    if (tabName === "analytics") {
      setNotificationModalVisible(true);
    }
  };

  // Handler for opening the Detail Modal
  const handleOpenDetailModal = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
    console.log("Opening Detail Modal for:", product); // Debug log
  };

  // Handler for closing the Detail Modal
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedProduct(null);
  };

  // Handlers for Edit Modal
  const handleOpenEditModal = () => {
    setDetailModalVisible(false);
    setEditModalVisible(true);
  };
  const handleCloseEditModal = () => setEditModalVisible(false);

  const handleSaveEdit = (updatedProduct) => {
    // Simulate saving (in a real app, this would update a backend)
    console.log("Saved updated product:", updatedProduct);
    setEditModalVisible(false);
    setSuccessMessage("Product updated successfully!");
    setSuccessModalVisible(true);
  };

  // Handlers for Confirmation Modal
  const handleOpenConfirmationModal = () => {
    setDetailModalVisible(false);
    setConfirmationModalVisible(true);
  };
  const handleCloseConfirmationModal = () => setConfirmationModalVisible(false);

  const handleConfirmDelete = () => {
    // Simulate deletion (in a real app, this would remove from a backend)
    console.log("Deleted product:", selectedProduct);
    setConfirmationModalVisible(false);
    setSuccessMessage("Product deleted successfully!");
    setSuccessModalVisible(true);
  };

  // Handler for closing the Success Modal
  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
    setSelectedProduct(null);
  };

  // Handler for closing the Notification Modal
  const handleCloseNotificationModal = () => {
    setNotificationModalVisible(false);
  };

  return (
    <div>
      {/* Navigation buttons */}
      <ul className="nav nav-pills mb-3">
        <li className="nav-item me-2">
          <button
            className={`btn btn-success ${
              activeTab === "products" ? "active" : ""
            }`}
            onClick={() => handleTabClick("products")}
          >
            My Products
          </button>
        </li>
        <li className="nav-item me-2">
          <button
            className={`btn btn-success ${
              activeTab === "orders" ? "active" : ""
            }`}
            onClick={() => handleTabClick("orders")}
          >
            Recent Orders
          </button>
        </li>
      </ul>

      {/* Products tab content */}
      {activeTab === "products" && (
        <>
          <div className="row">
            <ProductCard
              title="Organic Teff"
              price="1,200"
              unit="kg"
              location="Addis Ababa"
              available="50"
              imageUrl="https://picsum.photos/200/300?random=1"
              onViewDetails={() =>
                handleOpenDetailModal({
                  title: "Organic Teff",
                  price: "1,200",
                  unit: "kg",
                  location: "Addis Ababa",
                  available: "50",
                  imageUrl: "https://picsum.photos/200/300?random=1",
                })
              }
            />
            <ProductCard
              title="Fresh Coffee Beans"
              price="450"
              unit="kg"
              location="Jimma"
              available="100"
              imageUrl="https://picsum.photos/200/300?random=2"
              onViewDetails={() =>
                handleOpenDetailModal({
                  title: "Fresh Coffee Beans",
                  price: "450",
                  unit: "kg",
                  location: "Jimma",
                  available: "100",
                  imageUrl: "https://picsum.photos/200/300?random=2",
                })
              }
            />
            <ProductCard
              title="Red Onions"
              price="35"
              unit="kg"
              location="Mekelle"
              available="200"
              imageUrl="https://picsum.photos/200/300?random=3"
              onViewDetails={() =>
                handleOpenDetailModal({
                  title: "Red Onions",
                  price: "35",
                  unit: "kg",
                  location: "Mekelle",
                  available: "200",
                  imageUrl: "https://picsum.photos/200/300?random=3",
                })
              }
            />
          </div>

          <div className="text-center mt-3">
            <Link to="/farmer/products" className="btn btn-success text-white">
              View All Products
            </Link>
          </div>
        </>
      )}

      {/* Orders tab content */}
      {activeTab === "orders" && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-3">
            <thead className="table-success">
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Buyer</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD001</td>
                <td>Organic Teff</td>
                <td>Biruk Tesfaye</td>
                <td>30 kg</td>
                <td>2025-08-01</td>
                <td>
                  <span className="badge bg-warning text-dark">Pending</span>
                </td>
              </tr>
              <tr>
                <td>#ORD002</td>
                <td>Fresh Coffee Beans</td>
                <td>Selam Fikre</td>
                <td>20 kg</td>
                <td>2025-07-30</td>
                <td>
                  <span className="badge bg-success">Delivered</span>
                </td>
              </tr>
              <tr>
                <td>#ORD003</td>
                <td>Red Onions</td>
                <td>Daniel Kebede</td>
                <td>50 kg</td>
                <td>2025-07-28</td>
                <td>
                  <span className="badge bg-danger">Cancelled</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      <ProductDetailModal
        isVisible={isDetailModalVisible}
        product={selectedProduct}
        onClose={handleCloseDetailModal}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenConfirmationModal}
      />

      {/* Edit Modal */}
      <EditProductModal
        isVisible={isEditModalVisible}
        product={selectedProduct}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
      />

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        message="Are you sure you want to delete this product?"
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmDelete}
      />

      {/* Success Modal */}
      <StylishModal
        isVisible={isSuccessModalVisible}
        message={successMessage}
        type="success"
        onClose={handleCloseSuccessModal}
      />
    </div>
  );
};

export default ProductTabs;
