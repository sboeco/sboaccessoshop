import { useCartContext } from '../Context/appstate/CartContext/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Checkout = () => {
  const { quoteItems = [], totalPrice = 0, handleCheckout } = useCartContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCheckout(formData);
    navigate('/confirmation');
  };

  const formatPrice = (price) => `E${Number(price || 0).toFixed(2)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shipping Details */}
        <div className="lg:col-span-7">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  required
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
                <textarea
                  required
                  name="address"
                  rows={4}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={quoteItems.length === 0}
                  className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-6">
              {Array.isArray(quoteItems) && quoteItems.map((item) => (
                <div key={item?.id || `temp-${Math.random()}`} className="flex items-start gap-4 border-b border-gray-100 pb-4">
                  <img
                    src={item?.selectedImage || 'https://example.com/default-image.jpg'}
                    alt={typeof item?.title === 'string' ? item.title : 'Product'}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-900">{item?.title || 'Untitled Product'}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Quantity: {item?.quantity || 0} × {formatPrice(item?.price)}
                    </p>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {formatPrice(Number(item?.price || 0) * Number(item?.quantity || 0))}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-6 mt-6 text-xl font-bold text-gray-900">
              Total: {formatPrice(totalPrice)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;