// Checkout.jsx
import { useCartContext } from '../Context/appstate/CartContext/CartContext';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/auth-context/'; // Import the AuthContext

const Checkout = () => {
  const { quoteItems = [], totalPrice = 0 } = useCartContext();
  const { auth } = useContext(AuthContext); // Access the auth object from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    momoNumber: '',
    fullName: '',
    email: auth.user ? auth.user.userEmail : '', // Pre-fill with user email
    phone: auth.user ? auth.user.phoneNumber : '', // Pre-fill with user phone
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    if (!auth.user || !auth.user._id) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    // Step 1: Create order
    const orderPayload = {
      userId: auth.user._id, 
      momoNumber: formData.momoNumber,
      products: quoteItems.map((item) => ({
        productId: item._id, //  ✅ ADD THIS LINE
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPrice,
      shippingInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      },
    };

      const orderRes = await axiosInstance.post('api/orders/create', orderPayload);
      const orderId = orderRes.data.orderId;

      // Step 2: Trigger MoMo Payment
      const paymentRes = await axiosInstance.post('momo/money-collect', {
        amount: totalPrice,
        phoneNumber: formData.momoNumber,
        userId: auth.user._id, // Also use the user's _id for the payment request
        orderId,
      });

      if (paymentRes.data.status === 'SUCCESSFUL') {
        navigate('/confirmation');
      } else {
        setError(paymentRes.data.message || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout Error:', error.response?.data || error.message || error);
      const backendErrorMessage = error.response?.data?.message || error.response?.data?.error;
      const genericMessage = 'Something went wrong during checkout. Please try again.';
      setError(backendErrorMessage || genericMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `E${Number(price || 0).toFixed(2)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shipping Details */}
        <div className="lg:col-span-7">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Delivery Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Display error message if it exists */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter MoMo Number To Pay With</label>
                <input
                  required
                  type="text"
                  name="momoNumber"
                  value={formData.momoNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                />
              </div>

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
                  disabled={quoteItems.length === 0 || loading}
                  className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Pay'}
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