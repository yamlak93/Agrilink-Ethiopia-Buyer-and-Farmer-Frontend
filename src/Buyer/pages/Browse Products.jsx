import React, { useState } from "react";
import "../../Css/Devices.css"; // Import Devices.css for ms-md-250
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import products from "../data/products"; // ✅ import shared data

const BrowseProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="container-fluid p-4 ms-md-250"
          style={{ marginTop: "60px" }} // Keep marginTop for navbar offset
        >
          <h2 className="fw-bold">Browse Products</h2>
          <p className="text-muted mb-4">
            Discover fresh produce directly from farmers
          </p>

          {/* Search & Filter */}
          <div className="mb-4 d-flex align-items-center">
            <input
              type="text"
              className="form-control me-3"
              style={{ width: "250px" }}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-select"
              style={{ width: "150px" }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Grains">Grains</option>
              <option value="Coffee">Coffee</option>
              <option value="Fruits">Fruits</option>
              <option value="Honey">Honey</option>
              <option value="Vegetables">Vegetables</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="row">
            <div className="col-12">
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="col">
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center mt-5">
                    No products found for this filter.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowseProducts;
