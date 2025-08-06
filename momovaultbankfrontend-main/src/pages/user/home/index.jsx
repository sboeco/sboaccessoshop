import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/api/axiosInstance";
import { FaTags, FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "@/Context/appstate/CartContext/CartContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { onAdd } = useCartContext();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const endpoint = selectedCategory
        ? `/api/products?category=${selectedCategory}`
        : `/api/products`;

      const res = await axiosInstance.get(endpoint);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Make sure this matches the route path exactly
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    onAdd(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
      },
      1
    );
  };

  return (
    <div className="p-8 space-y-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to SBO Accessories 🛍️</h1>

      {/* Categories */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FaTags /> Shop by Category
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded ${
              selectedCategory === ""
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded ${
                selectedCategory === cat.name
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FaBoxOpen /> Products
        </h2>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded p-4 shadow-sm bg-white group relative"
              >
                {/* Clickable overlay for the entire card except the button */}
                <div
                  onClick={() => handleProductClick(product._id)}
                  className="cursor-pointer"
                >
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-4 rounded group-hover:opacity-90 transition-opacity"
                  />
                  <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-green-600 font-bold mb-2">
                    R {product.price}
                  </p>
                </div>

                {/* Independent Add to Cart button */}
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(e, product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
