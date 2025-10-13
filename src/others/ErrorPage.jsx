import React from "react";
import { motion } from "framer-motion";
import { FaTractor } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

// Animation variants for the container
const containerVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Animation variants for the tractor icon
const tractorVariants = {
  initial: { x: -100, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
  hover: {
    x: [0, 10, -10, 0],
    transition: { repeat: Infinity, duration: 2 },
  },
};

const ErrorPage = ({ errorMessage, errorDetails }) => {
  const navigate = useNavigate(); // Initialize navigate

  const handleGoToLogin = () => {
    navigate("/login"); // Redirect to login page
  };

  return (
    <motion.div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-red-100 p-3"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="text-center col-12 col-md-8 col-lg-6 mx-auto">
        {/* Animated Tractor Icon with red outline */}
        <motion.div
          className="display-1 text-red-600 mb-4"
          variants={tractorVariants}
          animate="animate"
          whileHover="hover"
        >
          <FaTractor />
        </motion.div>
        {/* Error Message */}
        <h1 className="display-4 font-weight-bold text-red-800 mb-3">
          Oops! Something Went Wrong
        </h1>
        <p className="lead text-red-600 mb-4">
          {errorMessage ||
            "An unexpected error occurred. Please try again later."}
        </p>
        {errorDetails && (
          <p className="text-red-700 mb-4">Details: {errorDetails}</p>
        )}
        {/* Decorative Elements with red theme */}
        <div className="mt-4 d-flex justify-content-center gap-3">
          <motion.div
            className="bg-red-500 rounded-circle"
            style={{ width: "16px", height: "16px" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <motion.div
            className="bg-red-500 rounded-circle"
            style={{ width: "16px", height: "16px" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          />
          <motion.div
            className="bg-red-500 rounded-circle"
            style={{ width: "16px", height: "16px" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
          />
        </div>
        {/* Button to redirect to login */}
        <motion.button
          className="btn btn-danger mt-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoToLogin}
        >
          Go to Login
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ErrorPage;
