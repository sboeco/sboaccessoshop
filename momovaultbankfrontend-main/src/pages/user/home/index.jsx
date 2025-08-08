import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/api/axiosInstance";
import { FaBoxOpen, FaShoppingCart, FaBars, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "@/Context/appstate/CartContext/CartContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { onAdd, totalQuantities } = useCartContext();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const bannerImages = [
    "https://res.cloudinary.com/dtdcvyuvd/image/upload/v1732694352/earpods1_hhfacv.jpg",
    "https://res.cloudinary.com/dtdcvyuvd/image/upload/v1732694263/pink-headphones_djzzbf.webp",
    "https://res.cloudinary.com/dtdcvyuvd/image/upload/v1737954756/airfryers_lyul3e.jpg",
  ];

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint = selectedCategory
        ? `/api/products?category=${selectedCategory}`
        : `/api/products`;
      const res = await axiosInstance.get(endpoint);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setIsLoading(false);
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
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo and Hamburger Menu */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 lg:hidden"
            >
              <FaBars size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">takealot</h1>
          </div>

          {/* Search Bar (Mobile and Desktop) */}
          <div className="flex-1 mx-4 lg:mx-8">
            <div className="relative w-full max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Search for products, brands..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Right side: Login, Cart */}
          <div className="flex items-center gap-2 lg:gap-4">
            <a href="#" className="hidden md:block text-gray-700 hover:text-blue-600 transition-colors">Login</a>
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <FaShoppingCart size={20} />
              {totalQuantities > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQuantities}
                </span>
              )}
            </button>
        </div>
    </div>
        
        {/* Desktop Categories Menu (Hidden on Mobile) */}
        <div className="hidden lg:flex justify-start items-center bg-gray-50 border-t border-b px-4 py-2">
          <div className="container mx-auto flex gap-6">
            <button onClick={() => handleCategorySelect("")} className={`font-semibold ${selectedCategory === "" ? "text-blue-600" : "text-gray-700"}`}>All Products</button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`font-semibold ${selectedCategory === cat.name ? "text-blue-600" : "text-gray-700"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-white rounded-b-lg shadow-xl z-50 animate-fade-in">
            <div className="py-3">
              <div className="px-4 py-2 text-lg font-semibold text-gray-800 border-b">
                Categories
              </div>
              <button
                onClick={() => handleCategorySelect("")}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors ${
                  selectedCategory === "" ? "bg-gray-100 text-blue-600" : "text-gray-700"
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors ${
                    selectedCategory === cat.name ? "bg-gray-100 text-blue-600" : "text-gray-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Layout */}
      <main className="container mx-auto px-4 py-8 flex gap-6">
        {/* Desktop Categories Sidebar (Hidden on Mobile) */}
        <aside className="hidden lg:block w-64 bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
          <nav>
            <ul>
              <li>
                <button
                  onClick={() => handleCategorySelect("")}
                  className={`w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors ${
                    selectedCategory === "" ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"
                  }`}
                >
                  All Products
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat._id}>
                  <button
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors ${
                      selectedCategory === cat.name ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Banner Section */}
          <section className="relative h-[200px] md:h-[300px] lg:h-[400px] rounded-xl overflow-hidden mb-8">
            <div className="relative w-full h-full">
              {bannerImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-blue-600" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </section>

          {/* Products Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Featured Products
              </h2>
              <button className="text-sm text-blue-600 hover:underline">
                View All
              </button>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
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
                      <div className="flex items-center justify-between mt-4">
                        <p className="font-bold text-lg text-gray-900">
                          E {product.price}
                        </p>
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors"
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
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;