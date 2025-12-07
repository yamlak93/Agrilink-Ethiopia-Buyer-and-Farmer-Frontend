import React, { useState, useEffect } from "react";
import TipCard from "./TipCard";
import Loader from "../../assets/Agriculture Loader.webm";
import apiClient from "../../api/api"; // Import the api.js client
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const ResourcesContent = () => {
  const [resourcesData, setResourcesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token available");
        }
        console.log(
          "Fetching resources with token:",
          token.substring(0, 5) + "..."
        );

        const response = await apiClient.get("/tips/resources");
        console.log("API response:", response.data);
        setResourcesData(response.data.resources || []);
      } catch (err) {
        console.error("Failed to fetch resources:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", {
            replace: true,
            state: { message: "Session expired. Please log in again." },
          });
          return;
        }
        setError("Failed to load resources. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [navigate]);

  return (
    <div>
      {loading && (
        <div
          className="text-center"
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
      {error && <div className="text-center text-danger">{error}</div>}
      {!loading && !error && (
        <>
          {resourcesData.length > 0 ? (
            resourcesData.map((resource) => (
              <TipCard
                key={resource.tipId}
                title={resource.title}
                category={resource.category}
                date={resource.date}
                content={resource.content}
              />
            ))
          ) : (
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">📚 No Resources Available</h5>
                <p className="card-text">
                  Check back later for helpful farming resources.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResourcesContent;
