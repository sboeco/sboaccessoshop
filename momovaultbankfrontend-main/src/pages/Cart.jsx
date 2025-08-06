import { useCartContext } from '../Context/appstate/CartContext/CartContext'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'

const Cart = () => {
  const {
    totalQuantities = 0,
    quoteItems = [],
    onRemove,
    totalPrice = 0,
    toggleCartItemQuanitity,
  } = useCartContext()

  const formatPrice = (price) => `E${Number(price || 0).toFixed(2)}`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Your Cart{' '}
        <span className="text-orange-600">
          {typeof totalQuantities === 'number' ? totalQuantities : 0}{' '}
          {totalQuantities === 1 ? 'Item' : 'Items'}
        </span>
      </h1>

      {/* Empty Cart */}
      {quoteItems.length < 1 && (
        <div className="flex flex-col items-center mt-12 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your cart is empty</h2>
          <Link to="/">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200">
              Go Shopping
            </button>
          </Link>
        </div>
      )}

      {/* Cart Items */}
      {quoteItems.length >= 1 && (
        <div className="space-y-6">
          {quoteItems.map((item) => (
            <div
              key={item?.id || `temp-${Math.random()}`}
              className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition duration-200"
            >
              {/* Product Image */}
              <img
                src={item?.selectedImage || 'https://example.com/default-image.jpg'}
                alt={item?.title || 'Product'}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{item?.title || 'Untitled Product'}</h3>
                <p className="text-sm text-gray-600 mt-1">{formatPrice(item?.price)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                <button
                  onClick={() => toggleCartItemQuanitity(item.id, 'dec')}
                  className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-200 transition duration-200"
                >
                  <Minus className="w-5 h-5 text-orange-500" />
                </button>
                <span className="px-4 text-gray-900 font-medium">{item?.quantity || 0}</span>
                <button
                  onClick={() => toggleCartItemQuanitity(item.id, 'inc')}
                  className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-200 transition duration-200"
                >
                  <Plus className="w-5 h-5 text-orange-500" />
                </button>
              </div>

              {/* Remove Item */}
              <button
                onClick={() => onRemove(item)}
                className="p-2 rounded-full hover:bg-orange-100 transition duration-200"
              >
                <Trash2 className="w-5 h-5 text-orange-600 hover:text-orange-700" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total and Checkout */}
      {quoteItems.length >= 1 && (
        <div className="mt-8 flex flex-col items-end bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <p className="text-xl font-bold text-gray-900 mb-4">Total: {formatPrice(totalPrice)}</p>
          <Link to="/checkout">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Cart
