import React from "react";
import Navbar from "../components/Navbar"; // Assuming Navbar is in components folder
import Sidebar from "../components/Sidebar"; // Assuming Sidebar is in components folder
import StatCard from "../components/StatCard";
import OrdersSection from "../components/OrderSection"; // Changed from RecentOrdersSection
import ProductsSection from "../components/ProductSection"; // Changed from RecommendedProductsSection
import "../../Css/Devices.css"; // Import Devices.css for ms-md-250
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faClock,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; // Import Link for navigation

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }} // Keep marginTop for navbar offset
        >
          {/* Welcome Section */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold">Welcome, Abebe!</h2>
              <p className="text-muted">
                Here's an overview of your buying activity
              </p>
            </div>
            {/* Browse Products Button */}
            <Link to="/products">
              {" "}
              {/* Redirect to BrowseProducts.jsx */}
              <button className="btn btn-success">Browse Products</button>
            </Link>
          </div>

          {/* Stat Cards Section */}
          <div className="row mb-4">
            <div className="col-md-4">
              <StatCard
                title="Total Orders Placed"
                value="24"
                description="+2 from last month"
                icon={faShoppingCart}
                iconBgClass="bg-success"
              />
            </div>
            <div className="col-md-4">
              <StatCard
                title="Pending Deliveries"
                value="3"
                description="Expected within 2-3 days"
                icon={faClock}
                iconBgClass="bg-warning"
              />
            </div>
            <div className="col-md-4">
              <StatCard
                title="Completed Deliveries"
                value="21"
                description="+2 from last month"
                icon={faCheckCircle}
                iconBgClass="bg-primary"
              />
            </div>
          </div>

          {/* Recent Orders and Recommended Products Sections */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <OrdersSection /> {/* Changed from RecentOrdersSection */}
            </div>
            <div className="col-md-6 mb-4">
              <ProductsSection />{" "}
              {/* Changed from RecommendedProductsSection */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
