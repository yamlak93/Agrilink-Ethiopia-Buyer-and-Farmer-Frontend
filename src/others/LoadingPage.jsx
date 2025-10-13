import React from "react";
import { motion } from "framer-motion";
import { FaTractor, FaLeaf } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css"; // Optional: If using Bootstrap alongside Tailwind

// Animation variants for the modal
const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

// Animation variants for the spinning tractor
const tractorVariants = {
  rotate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Animation variants for the plants
const plantVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: i * 0.3,
      ease: "easeOut",
    },
  }),
};

const LoadingModal = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative w-full max-w-md">
            {/* Spinning Tractor */}
            <motion.div
              className="text-green-800 mb-4"
              variants={tractorVariants}
              animate="rotate"
            >
              <FaTractor size={60} />
            </motion.div>

            {/* Loading Text */}
            <h2 className="text-xl font-bold text-green-800 mb-2">
              Harvesting Data...
            </h2>
            <p className="text-green-600">
              Please wait while we process your request
            </p>

            {/* Growing Plants */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="text-green-600"
                  variants={plantVariants}
                  custom={i}
                  initial="initial"
                  animate="animate"
                >
                  <FaLeaf size={30} />
                </motion.div>
              ))}
            </div>

            {/* Soil Line */}
            <div
              className="bg-brown-600 mt-4"
              style={{
                width: "150px",
                height: "8px",
                margin: "0 auto",
                borderRadius: "4px",
              }}
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default LoadingModal;
