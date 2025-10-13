import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./main_page/MainPage";
import Login from "./auth/Login";
import Register from "./auth/Register";
import About from "./main_page/About";
import Contact from "./main_page/Contact";
import Privacy from "./main_page/Privacy";
import Dashboard from "./Farmer/pages/Dashboard";
import Products from "./Farmer/pages/Products";
import Tips from "./Farmer/pages/Tips";
import Orders from "./Farmer/pages/Orders";
import AnalyticsDashboard from "./Farmer/pages/AnalyticsDashboard";
import SettingsPage from "./Farmer/pages/SettingsPage";
import AddProduct from "./Farmer/pages/AddProducts";
import BuyerDashboard from "./Buyer/pages/Dashboard";
import BrowseProducts from "./Buyer/pages/Browse Products";
import ProductDetailPage from "./Buyer/components/ProductDetailPage";
import OrdersPage from "./Buyer/pages/OrdersPage";
import Settings from "./Buyer/pages/Settings";
import TermsOfService from "./Buyer/components/TermsOfService";
import PageNotFound from "./others/PageNotFound";
import ErrorPage from "./others/ErrorPage";
import LoadingPage from "./others/LoadingPage";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/home" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/farmer/dashboard" element={<Dashboard />} />
          <Route path="/farmer/products" element={<Products />} />
          <Route path="/farmer/orders" element={<Orders />} />
          <Route path="/farmer/tips" element={<Tips />} />
          <Route path="/farmer/analytics" element={<AnalyticsDashboard />} />
          <Route path="/farmer/settings" element={<SettingsPage />} />
          <Route path="/farmer/add-product" element={<AddProduct />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/products" element={<BrowseProducts />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/buyer/orders" element={<OrdersPage />} />
          <Route path="/buyer/settings" element={<Settings />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
