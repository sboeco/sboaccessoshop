


import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/api/axiosInstance";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "@/Context/appstate/CartContext/CartContext";
import Footer from "@/components/user-view/Footer"; 

const HomePage = () => {
  const navigate = useNavigate();
  const { onAdd, totalQuantities } = useCartContext();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // NEW pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // Products per page

  const bannerImages = [
    "https://res.cloudinary.com/dtdcvyuvd/image/upload/v1732694352/earpods1_hhfacv.jpg",
    "https://res.cloudinary.com/dtdcvyuvd/image/upload/v1732694263/pink-headphones_djzzbf.webp",
    "https://res.cloudinary.com/dtdcvyuvd/image/upload/v1737954756/airfryers_lyul3e.jpg",
  ];

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      let endpoint = `/api/products`;
      const params = new URLSearchParams();
      
      params.append("page", page);
      params.append("limit", limit);

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      endpoint += `?${params.toString()}`;

      const res = await axiosInstance.get(endpoint);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, page]);

  // Trigger fetch on search, category, or page change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, fetchProducts]);

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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1); // reset to first page
    setIsMenuOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
           {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              <FaBars size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">SBO-EXPRESS-SHOP</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
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
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 rounded-full bg-orange-100 text-gray-700 hover:bg-orange-200 transition-colors"
            >
              <FaShoppingCart size={20} />
              {totalQuantities > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalQuantities}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-4 w-64 bg-white rounded-lg shadow-xl z-50 animate-fade-in">
            <div className="py-3">
              <div className="px-4 py-2 text-lg font-semibold text-gray-800 border-b">
                Categories
              </div>
              <button
                onClick={() => handleCategorySelect("")}
                className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors ${
                  selectedCategory === ""
                    ? "bg-orange-50 text-orange-500"
                    : "text-gray-700"
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors ${
                    selectedCategory === cat.name
                      ? "bg-orange-50 text-orange-500"
                      : "text-gray-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Banner Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="relative w-full h-full">
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-all duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">Discover Great Deals</h2>
                  <p className="text-lg mb-4">Shop the latest trends now!</p>
                  <button
                  
                    className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
                  >
                    Up to 50% Off
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="w-full h-48 object-contain p-4"
                  />
                  <div className="p-4 border-t">
                    <h3 className="font-semibold text-base text-gray-800 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 my-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
                      <p className="font-bold text-lg text-gray-900">
                        E {product.price}
                      </p>
                      <button
                        className="bg-orange-500 text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                        onClick={(e) => handleAddToCart(e, product)}
                        aria-label="Add to cart"
                      >
                        <span className="text-sm font-semibold">Buy Now</span>
                        <FaShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md border ${
                  page === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                }`}
              >
                Prev
              </button>

              <span className="px-4 py-2">{page} / {totalPages}</span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-md border ${
                  page === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
};
export default HomePage;
