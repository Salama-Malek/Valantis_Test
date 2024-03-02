import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for making HTTP requests
import md5 from "md5"; // Import md5 for generating authentication string

const ProductList = () => {
  // State variables for managing products, filtered products, error, current page, filters
  const [products, setProducts] = useState([]); // State for storing fetched products
  const [filteredProducts, setFilteredProducts] = useState([]); // State for storing filtered products
  const [error, setError] = useState(null); // State for handling errors
  const [currentPage, setCurrentPage] = useState(1); // State for tracking current page
  const [nameFilter, setNameFilter] = useState(""); // State for name filter
  const [priceFilter, setPriceFilter] = useState(""); // State for price filter
  const [brandFilter, setBrandFilter] = useState(""); // State for brand filter
  const productsPerPage = 50; // Number of products per page

  // useEffect hook for fetching products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const password = "Valantis"; // Password for authentication
        const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, ""); // Current timestamp
        const authString = md5(`${password}_${timestamp}`); // Generate authentication string

        const requestBody = {
          action: "get_ids", // API action to get product IDs
          params: {
            offset: (currentPage - 1) * productsPerPage, // Calculate offset based on current page
            limit: productsPerPage, // Limit number of products per page
          },
        };

        const response = await axios.post( // Send POST request to API endpoint
          "https://api.valantis.store:41000/", // API endpoint URL
          requestBody, // Request body
          {
            headers: {
              "X-Auth": authString, // Include authentication string in headers
            },
          }
        );

        handleProductsResponse(response.data.result); // Process API response
      } catch (error) {
        console.error("Error fetching products:", error); // Log error if request fails
        setError(error); // Set error state
      }
    };

    fetchProducts(); // Call fetchProducts function
  }, [currentPage]); // Trigger useEffect when currentPage changes

  // Function to handle API response and fetch product details
  const handleProductsResponse = async (productIds) => {
    try {
      const password = "Valantis"; // Password for authentication
      const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, ""); // Current timestamp
      const authString = md5(`${password}_${timestamp}`); // Generate authentication string

      const requestBody = {
        action: "get_items", // API action to get product items
        params: { ids: productIds }, // Pass product IDs as parameters
      };

      const response = await axios.post( // Send POST request to API endpoint
        "https://api.valantis.store:41000/", // API endpoint URL
        requestBody, // Request body
        {
          headers: {
            "X-Auth": authString, // Include authentication string in headers
          },
        }
      );

      setProducts(response.data.result || []); // Set products state with fetched product details
    } catch (error) {
      console.error("Error fetching product details:", error); // Log error if request fails
      setError(error); // Set error state
    }
  };

  // useEffect hook for applying filters to products
  useEffect(() => {
    const applyFilters = () => {
      let filtered = products.filter((product) => {
        const name = product.product || ""; // Extract product name or use empty string
        const price = product.price || ""; // Extract product price or use empty string
        const brand = product.brand || ""; // Extract product brand or use empty string

        // Filter products based on name, price, and brand
        return (
          name.toLowerCase().includes(nameFilter.toLowerCase()) && // Filter by name (case-insensitive)
          price.toString().includes(priceFilter) && // Filter by price (exact match)
          brand.toLowerCase().includes(brandFilter.toLowerCase()) // Filter by brand (case-insensitive)
        );
      });
      setFilteredProducts(filtered); // Set filtered products state
    };

    applyFilters(); // Call applyFilters function
  }, [nameFilter, priceFilter, brandFilter, products]); // Trigger useEffect when filters or products change

  // Function to handle next page navigation
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Increment currentPage by 1
  };

  // Function to handle previous page navigation
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Decrement currentPage by 1 (minimum value is 1)
  };

  // Event handler for name filter change
  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value); // Update name filter state
  };

  // Event handler for price filter change
  const handlePriceFilterChange = (event) => {
    setPriceFilter(event.target.value); // Update price filter state
  };

  // Event handler for brand filter change
  const handleBrandFilterChange = (event) => {
    setBrandFilter(event.target.value); // Update brand filter state
  };

  // Render error message if an error occurs during fetching
  if (error) {
    return <div>Error fetching products. Please try again later.</div>;
  }

  // Render product list, filters, pagination, etc.
  return (
    <div className="product-list-container">
      <h1>Product List</h1>
      <div className="filter-input">
        <input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={handleNameFilterChange}
        />
        <input
          type="text"
          placeholder="Filter by price"
          value={priceFilter}
          onChange={handlePriceFilterChange}
        />
        <input
          type="text"
          placeholder="Filter by brand"
          value={brandFilter}
          onChange={handleBrandFilterChange}
        />
      </div>
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id} className="product-item">
            <div>Product ID: {product.id}</div>
            <div>Name: {product.product}</div>
            <div>Price: {product.price}</div>
            <div>Brand: {product.brand || "Unknown"}</div>
          </li>
        ))}
      </ul>

      
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous Page
        </button>
        <button onClick={handleNextPage}>Next Page</button>
      </div>
    </div>
  );
};

export default ProductList;
