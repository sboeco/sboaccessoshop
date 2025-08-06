@@ .. @@
-import Box from '@mui/material/Box'
-import IconButton from '@mui/material/IconButton'
-import { Button, Typography } from '@mui/material'
+import { Button } from '@/components/ui/button'
 import { useCartContext } from '../Context/appstate/CartContext/CartContext'
 import { Link } from 'react-router-dom'
-import { Divider } from '@mui/material'
-import RemoveIcon from '@mui/icons-material/Remove'
-import DeleteIcon from '@mui/icons-material/Delete'
-import AddIcon from '@mui/icons-material/Add'
+import { FaMinus, FaPlus, FaTrash, FaShoppingBag } from 'react-icons/fa'

 const Cart = () => {
   const {
     totalQuantities = 0,
     quoteItems = [],
     onRemove,
     totalPrice = 0,
     toggleCartItemQuanitity,
+    setShowCart,
   } = useCartContext()

   const formatPrice = (price) => `E${Number(price || 0).toFixed(2)}`

+  const handleCheckout = () => {
+    setShowCart(false);
+  };

   return (
-    <> 
-      <Box
-        sx={{
-          width: 500,
-          display: 'flex',
-          flexDirection: 'column',
-          height: '100%',
-          paddingLeft: 2,
-          position: 'relative',
-        }}
-        role='presentation'
-      >
-        <Box>
-          <Box sx={{ width: 400 }} role='presentation'>
-            {/* Title */}
-            <Typography variant='h3' sx={{ fontWeight: 'bold', mt: 4 }}>
-              Items in Cart {' '}
-              <em style={{ color: 'red' }}>
-                {typeof totalQuantities === 'number' ? totalQuantities : 0}
-              </em>
-            </Typography>
+    <div className="flex flex-col h-full">
+      <div className="flex-1 p-4">
+        {/* No cart items */}
+        {quoteItems.length < 1 && (
+          <div className="flex flex-col items-center justify-center h-full text-center">
+            <FaShoppingBag className="text-6xl text-gray-300 mb-4" />
+            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
+            <p className="text-gray-500 mb-6">Add some products to get started</p>
+            <Button 
+              onClick={() => setShowCart(false)}
+              className="bg-momoBlue hover:bg-blue-700"
+            >
+              Continue Shopping
+            </Button>
+          </div>
+        )}

-            {/* No cart items */}
-            {quoteItems.length < 1 && (
-              <Box
-                display='flex'
-                flexDirection='column'
-                alignItems='center'
-                mt={5}
-                p={4}
-                borderRadius='10px'
-              >
-                <Typography variant='h1' gutterBottom>
-                  Your cart is empty
-                </Typography>
-
-                <Box
-                  sx={{
-                    display: 'flex',
-                    justifyContent: 'center',
-                    marginBottom: 8,
-                    marginTop: 4,
-                  }}
-                >
-                  
-                </Box>
-
-                <Link to='/'>
-                  <Button variant='contained' size='small'>
-                    Go shopping
-                  </Button>
-                </Link>
-              </Box>
-            )}
-
-            {/* Items */}
-            {Array.isArray(quoteItems) && quoteItems.length >= 1 &&
-              quoteItems.map((item) => (
-                <Box
-                  key={item?.id || `temp-${Math.random()}`}
-                  sx={{ display: 'flex', flexDirection: 'column' }}
-                >
-                  <Box
-                    sx={{
-                      display: 'flex',
-                      alignItems: 'center',
-                      justifyContent: 'space-between',
-                      mb: 2,
-                    }}
-                  >
-                    {/* Product image */}
-                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
-                      <img
-                        src={item?.selectedImage || 'https://example.com/default-image.jpg'}
-                        alt={typeof item?.title === 'string' ? item.title : 'Product'}
-                        style={{ width: 70, height: 70 }}
-                      />
-                    </Box>
-
-                    {/* Price */}
-                    <Typography variant='body1' sx={{ ml: 2 }}>
-                      {formatPrice(item?.price)}
-                    </Typography>
-
-                    {/* Title */}
-                    <Typography variant='body1' sx={{ ml: 2 }}>
-                      {typeof item?.title === 'string' ? item.title : 'Untitled Product'}
-                    </Typography>
-
-                    {/* Increment and Decrement buttons */}
-                    <Box
-                      sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}
-                    >
-                      {/* Decrement button */}
-                      <IconButton
-                        onClick={() => toggleCartItemQuanitity(item.id, 'dec')}
-                      >
-                        <RemoveIcon style={{ color: 'red' }} />
-                      </IconButton>
-
-                      {/* Count */}
-                      <Typography variant='body1' sx={{ mx: 1 }}>
-                        {typeof item?.quantity === 'number' ? item.quantity : 0}
-                      </Typography>
-
-                      {/* Increment button */}
-                      <IconButton
-                        onClick={() => toggleCartItemQuanitity(item.id, 'inc')}
-                      >
-                        <AddIcon style={{ color: 'green' }} />
-                      </IconButton>
-                    </Box>
-
-                    {/* Delete button */}
-                    <Box>
-                      <IconButton onClick={() => onRemove(item)}>
-                        <DeleteIcon />
-                      </IconButton>
-                    </Box>
-                  </Box>
-                  <Divider />
-                </Box>
-              ))}
-
-            {/* Total price and Checkout button */}
-            {quoteItems?.length >= 1 && (
-              <Box sx={{ mt: 3 }}>
-                <Typography
-                  variant='subtitle1'
-                  sx={{ fontWeight: 'bold', mb: 1 }}
-                >
-                  {formatPrice(totalPrice)}
-                </Typography>
-                <Link to="/checkout" style={{ textDecoration: 'none' }}>
-                  <Button
-                    variant='contained'
-                    color='primary'
-                    size='small'
-                  >
-                    Checkout
-                  </Button>
-                </Link>
-              </Box>
-            )}
-          </Box>
-        </Box>
-      </Box>
-    </>
+        {/* Items */}
+        {Array.isArray(quoteItems) && quoteItems.length >= 1 && (
+          <div className="space-y-4">
+            {quoteItems.map((item) => (
+              <div
+                key={item?.id || `temp-${Math.random()}`}
+                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
+              >
+                {/* Product image */}
+                <img
+                  src={item?.selectedImage || item?.images?.[0] || 'https://via.placeholder.com/80'}
+                  alt={typeof item?.title === 'string' ? item.title : 'Product'}
+                  className="w-16 h-16 object-cover rounded"
+                />
+
+                {/* Product details */}
+                <div className="flex-1">
+                  <h4 className="font-medium text-sm">
+                    {typeof item?.title === 'string' ? item.title : 'Untitled Product'}
+                  </h4>
+                  <p className="text-momoBlue font-semibold">
+                    {formatPrice(item?.price)}
+                  </p>
+                </div>
+
+                {/* Quantity controls */}
+                <div className="flex items-center gap-2">
+                  <button
+                    onClick={() => toggleCartItemQuanitity(item.id, 'dec')}
+                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
+                  >
+                    <FaMinus className="text-xs text-gray-600" />
+                  </button>
+                  
+                  <span className="w-8 text-center font-medium">
+                    {typeof item?.quantity === 'number' ? item.quantity : 0}
+                  </span>
+                  
+                  <button
+                    onClick={() => toggleCartItemQuanitity(item.id, 'inc')}
+                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
+                  >
+                    <FaPlus className="text-xs text-gray-600" />
+                  </button>
+                </div>
+
+                {/* Delete button */}
+                <button
+                  onClick={() => onRemove(item)}
+                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
+                >
+                  <FaTrash className="text-sm" />
+                </button>
+              </div>
+            ))}
+          </div>
+        )}
+      </div>
+
+      {/* Total and Checkout - Fixed at bottom */}
+      {quoteItems?.length >= 1 && (
+        <div className="border-t bg-white p-4 space-y-4">
+          <div className="flex justify-between items-center">
+            <span className="text-lg font-semibold">Total:</span>
+            <span className="text-xl font-bold text-momoBlue">
+              {formatPrice(totalPrice)}
+            </span>
+          </div>
+          
+          <Link to="/checkout" className="block">
+            <Button
+              onClick={handleCheckout}
+              className="w-full bg-momoBlue hover:bg-blue-700 py-3"
+            >
+              Proceed to Checkout
+            </Button>
+          </Link>
+        </div>
+      )}
+    </div>
   )
 }

 export default Cart