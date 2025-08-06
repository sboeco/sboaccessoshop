import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/api/axiosInstance";
import { FaTags, FaBoxOpen, FaShoppingCart } from "react-icons/fa"; // Added FaShoppingCart for cart button
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
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    onAdd(
      {
        ...product,
        id: product._id,
        name: product.name,
        price: product.price,
        images: product.images || [],
      },
      1
    );
    setTimeout(() => {
      navigate("/cart");
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-10 bg-gray-50 min-h-screen font-sans">
      {/* Top Header - Inspired by UI Image */}
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-col">
          <p className="text-gray-500 text-sm">Hello,</p>
          <h1 className="text-2xl font-bold text-gray-800">Welcome</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-32 sm:w-64 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button onClick={() => navigate('/cart')} className="relative p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-orange-100 transition-colors">
            <FaShoppingCart />
          </button>
        </div>
      </header>

      {/* Categories Section */}
      <section className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <FaTags className="text-orange-500" /> Categories
          </h2>
          <button className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
            View All
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === ""
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.name
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products Section - Styled to match the image */}
      <section className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <FaBoxOpen className="text-orange-500" /> Products
          </h2>
          <button className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
            View All
          </button>
        </div>
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105"
              >
                {/* Clickable area for product details */}
                <div
                  onClick={() => handleProductClick(product._id)}
                  className="cursor-pointer p-2"
                >
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-1 px-1">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 px-1 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 px-1">
                    <p className="font-bold text-sm sm:text-lg text-orange-500">
                      R {product.price}
                    </p>
                    <button
                      className="bg-orange-500 text-white p-2 rounded-full text-sm hover:bg-orange-600 transition-colors"
                      onClick={(e) => handleAddToCart(e, product)}
                      aria-label="Add to cart"
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;