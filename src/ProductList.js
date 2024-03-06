import React, { useState, useEffect } from "react";
import axios from "axios";
import md5 from "md5";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const productsPerPage = 50;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const password = "Valantis";
        const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
        const authString = md5(`${password}_${timestamp}`);

        const requestBody = {
          action: "get_ids",
          params: {
            offset: (currentPage - 1) * productsPerPage,
            limit: productsPerPage,
          },
        };

        const response = await axios.post(
          "https://api.valantis.store:41000/",
          requestBody,
          {
            headers: {
              "X-Auth": authString,
            },
          }
        );

        handleProductsResponse(response.data.result);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const handleProductsResponse = async (productIds) => {
    try {
      const password = "Valantis";
      const timestamp = new Date().toISOString().split("T")[0].replace(/-/g, "");
      const authString = md5(`${password}_${timestamp}`);

      const requestBody = {
        action: "get_items",
        params: { ids: productIds },
      };

      const response = await axios.post(
        "https://api.valantis.store:41000/",
        requestBody,
        {
          headers: {
            "X-Auth": authString,
          },
        }
      );

      setProducts(response.data.result || []);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError(error);
    }
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = products.filter((product) => {
        const productName = product.product.toLowerCase();
        const productBrand = product.brand ? product.brand.toLowerCase() : '';
        const productPrice = product.price.toString();

        const nameFilterMatch = productName.includes(nameFilter.toLowerCase());
        const brandFilterMatch = productBrand.includes(brandFilter.toLowerCase());
        const priceFilterMatch = productPrice.startsWith(priceFilter);

        return nameFilterMatch && brandFilterMatch && priceFilterMatch;
      });
      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [nameFilter, priceFilter, brandFilter, products]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
  };

  const handlePriceFilterChange = (event) => {
    setPriceFilter(event.target.value);
  };

  const handleBrandFilterChange = (event) => {
    setBrandFilter(event.target.value);
  };

  if (error) {
    return <div>Error fetching products. Please try again later.</div>;
  }

  return (
    <div className="product-list-container">
      <h1>Product List</h1>
      <div className="filter-input">
        <input
          type="text"
          placeholder="Фильтр по имени"
          value={nameFilter}
          onChange={handleNameFilterChange}
        />
        <input
          type="text"
          placeholder="Фильтр по цене"
          value={priceFilter}
          onChange={handlePriceFilterChange}
        />
        <input
          type="text"
          placeholder="Фильтр по бренду"
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
          Предыдущая страница
        </button>
        <button onClick={handleNextPage}>Следующая страница</button>
      </div>
    </div>
  );
};

export default ProductList;
