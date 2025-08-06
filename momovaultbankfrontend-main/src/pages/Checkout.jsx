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
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Shipping Details */}
        <div className="md:col-span-7">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  required
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shipping Address</label>
                <textarea
                  required
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={quoteItems.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-5">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {Array.isArray(quoteItems) && quoteItems.map((item) => (
                <div key={item?.id || `temp-${Math.random()}`} className="flex items-start gap-4 border-b pb-3">
                  <img
                    src={item?.selectedImage || 'https://example.com/default-image.jpg'}
                    alt={typeof item?.title === 'string' ? item.title : 'Product'}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item?.title || 'Untitled Product'}</p>
                    <p className="text-xs text-gray-500">
                      Quantity: {item?.quantity || 0} × {formatPrice(item?.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrice(Number(item?.price || 0) * Number(item?.quantity || 0))}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4 text-lg font-semibold">
              Total: {formatPrice(totalPrice)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
