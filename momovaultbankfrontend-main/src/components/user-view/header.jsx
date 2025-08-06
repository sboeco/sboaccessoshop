import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaShoppingCart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useCartContext } from '@/Context/appstate/CartContext/CartContext';

export default function Header({ categories, selectedCategory, handleCategorySelect }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { totalQuantities = 0 } = useCartContext();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-momoBlue transition-colors"
            >
              <FaBars size={24} />
            </button>
            <div className="flex items-center">
              <img src="/momobank.png" alt="Logo" className="h-8 w-auto mr-2" />
              <h1 className="text-2xl font-bold text-momoBlue">Mo Pocket</h1>
            </div>
          </div>
          <div className="sm:hidden">
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

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
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
          <div className="hidden sm:block">
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
                selectedCategory === "" ? "bg-orange-50 text-orange-500" : "text-gray-700"
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors ${
                  selectedCategory === cat.name ? "bg-orange-50 text-orange-500" : "text-gray-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

Header.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  handleCategorySelect: PropTypes.func.isRequired,
};
