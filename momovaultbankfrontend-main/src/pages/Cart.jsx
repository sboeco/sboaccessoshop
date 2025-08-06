import { useCartContext } from '../Context/appstate/CartContext/CartContext'
import { Link } from 'react-router-dom'

import { Minus, Plus, Trash2 } from 'lucide-react' // Tailwind-friendly icons (or use Heroicons)

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
    <div className="w-full max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Items in Cart{' '}
        <em className="text-red-500">
          {typeof totalQuantities === 'number' ? totalQuantities : 0}
        </em>
      </h1>

      {/* Empty Cart */}
      {quoteItems.length < 1 && (
        <div className="flex flex-col items-center mt-10 p-6 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <Link to="/">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
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
              className="flex items-center gap-4 border-b pb-4"
            >
              {/* Product Image */}
              <img
                src={item?.selectedImage || 'https://example.com/default-image.jpg'}
                alt={item?.title || 'Product'}
                className="w-16 h-16 object-cover rounded"
              />

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-medium">{item?.title || 'Untitled Product'}</h3>
                <p className="text-sm text-gray-500">{formatPrice(item?.price)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCartItemQuanitity(item.id, 'dec')}
                  className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  <Minus className="w-4 h-4 text-red-500" />
                </button>
                <span className="px-2">{item?.quantity || 0}</span>
                <button
                  onClick={() => toggleCartItemQuanitity(item.id, 'inc')}
                  className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4 text-green-500" />
                </button>
              </div>

              {/* Remove Item */}
              <button
                onClick={() => onRemove(item)}
                className="ml-2 p-1 rounded hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total and Checkout */}
      {quoteItems.length >= 1 && (
        <div className="mt-6 flex flex-col items-start">
          <p className="text-lg font-bold mb-2">Total: {formatPrice(totalPrice)}</p>
          <Link to="/checkout">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Cart
