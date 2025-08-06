@@ .. @@
-import { Box, Button, Grid, TextField, Typography, Paper } from '@mui/material';
+import { Button } from '@/components/ui/button';
+import { Input } from '@/components/ui/input';
+import { Label } from '@/components/ui/label';
+import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { useCartContext } from '../Context/appstate/CartContext/CartContext';
 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
+import { FaShoppingCart, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

 const Checkout = () => {
   const { quoteItems = [], totalPrice = 0, handleCheckout } = useCartContext();
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
     fullName: '',
     email: '',
     phone: '',
     address: '',
+    city: '',
+    postalCode: '',
   });
+  const [loading, setLoading] = useState(false);

   const handleChange = (e) => {
     setFormData({
       ...formData,
       [e.target.name]: e.target.value
     });
   };

-  const handleSubmit = (e) => {
+  const handleSubmit = async (e) => {
     e.preventDefault();
-    handleCheckout(formData);
-    navigate('/confirmation');
+    setLoading(true);
+    
+    try {
+      const success = await handleCheckout(formData);
+      if (success) {
+        navigate('/order-confirmation');
+      }
+    } catch (error) {
+      console.error('Checkout failed:', error);
+    } finally {
+      setLoading(false);
+    }
   };

-  // Add formatter helper
   const formatPrice = (price) => `E${Number(price || 0).toFixed(2)}`;

   return (
-    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
-      <Typography variant="h4" gutterBottom>Checkout</Typography>
-      
-      <Grid container spacing={3}>
-        <Grid item xs={12} md={7}>
-          <Paper sx={{ p: 3 }}>
-            <Typography variant="h6" gutterBottom>Shipping Details</Typography>
-            <form onSubmit={handleSubmit}>
-              <Grid container spacing={2}>
-                <Grid item xs={12}>
-                  <TextField
-                    required
-                    fullWidth
-                    name="fullName"
-                    label="Full Name"
-                    value={formData.fullName}
-                    onChange={handleChange}
-                  />
-                </Grid>
-                <Grid item xs={12}>
-                  <TextField
-                    required
-                    fullWidth
-                    name="email"
-                    label="Email"
-                    type="email"
-                    value={formData.email}
-                    onChange={handleChange}
-                  />
-                </Grid>
-                <Grid item xs={12}>
-                  <TextField
-                    required
-                    fullWidth
-                    name="phone"
-                    label="Phone Number"
-                    value={formData.phone}
-                    onChange={handleChange}
-                  />
-                </Grid>
-                <Grid item xs={12}>
-                  <TextField
-                    required
-                    fullWidth
-                    name="address"
-                    label="Shipping Address"
-                    multiline
-                    rows={3}
-                    value={formData.address}
-                    onChange={handleChange}
-                  />
-                </Grid>
-                <Grid item xs={12}>
-                  <Button
-                    type="submit"
-                    variant="contained"
-                    fullWidth
-                    size="large"
-                    disabled={quoteItems.length === 0}
-                  >
-                    Place Order
-                  </Button>
-                </Grid>
-              </Grid>
-            </form>
-          </Paper>
-        </Grid>
+    <div className="min-h-screen bg-gray-50 py-8">
+      <div className="max-w-6xl mx-auto px-4">
+        <div className="mb-8">
+          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
+          <p className="text-gray-600">Complete your order below</p>
+        </div>
+        
+        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
+          {/* Shipping Details */}
+          <Card>
+            <CardHeader>
+              <CardTitle className="flex items-center gap-2">
+                <FaUser className="text-momoBlue" />
+                Shipping Details
+              </CardTitle>
+            </CardHeader>
+            <CardContent>
+              <form onSubmit={handleSubmit} className="space-y-4">
+                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
+                  <div>
+                    <Label htmlFor="fullName">Full Name *</Label>
+                    <Input
+                      id="fullName"
+                      name="fullName"
+                      value={formData.fullName}
+                      onChange={handleChange}
+                      required
+                      placeholder="Enter your full name"
+                    />
+                  </div>
+                  
+                  <div>
+                    <Label htmlFor="phone">Phone Number *</Label>
+                    <div className="relative">
+                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
+                      <Input
+                        id="phone"
+                        name="phone"
+                        type="tel"
+                        value={formData.phone}
+                        onChange={handleChange}
+                        required
+                        placeholder="76123456"
+                        className="pl-10"
+                      />
+                    </div>
+                  </div>
+                </div>

-        <Grid item xs={12} md={5}>
-          <Paper sx={{ p: 3 }}>
-            <Typography variant="h6" gutterBottom>Order Summary</Typography>
-            {Array.isArray(quoteItems) && quoteItems.map((item) => (
-              <Box key={item?.id || `temp-${Math.random()}`} sx={{ display: 'flex', mb: 2 }}>
-                <img
-                  src={item?.selectedImage || 'https://example.com/default-image.jpg'}
-                  alt={typeof item?.title === 'string' ? item.title : 'Product'}
-                  style={{ width: 50, height: 50, marginRight: 10 }}
-                />
-                <Box sx={{ flex: 1 }}>
-                  <Typography variant="body1">
-                    {typeof item?.title === 'string' ? item.title : 'Untitled Product'}
-                  </Typography>
-                  <Typography variant="body2" color="text.secondary">
-                    Quantity: {typeof item?.quantity === 'number' ? item.quantity : 0} × {formatPrice(item?.price)}
-                  </Typography>
-                </Box>
-                <Typography variant="body1">
-                  {formatPrice(Number(item?.price || 0) * Number(item?.quantity || 0))}
-                </Typography>
-              </Box>
-            ))}
-            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
-              <Typography variant="h6">
-                Total: {formatPrice(totalPrice)}
-              </Typography>
-            </Box>
-          </Paper>
-        </Grid>
-      </Grid>
-    </Box>
+                <div>
+                  <Label htmlFor="email">Email Address *</Label>
+                  <div className="relative">
+                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
+                    <Input
+                      id="email"
+                      name="email"
+                      type="email"
+                      value={formData.email}
+                      onChange={handleChange}
+                      required
+                      placeholder="your@email.com"
+                      className="pl-10"
+                    />
+                  </div>
+                </div>

+                <div>
+                  <Label htmlFor="address">Street Address *</Label>
+                  <div className="relative">
+                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
+                    <textarea
+                      id="address"
+                      name="address"
+                      value={formData.address}
+                      onChange={handleChange}
+                      required
+                      rows={3}
+                      placeholder="Enter your full address"
+                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-momoBlue focus:border-transparent resize-none"
+                    />
+                  </div>
+                </div>

+                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
+                  <div>
+                    <Label htmlFor="city">City *</Label>
+                    <Input
+                      id="city"
+                      name="city"
+                      value={formData.city}
+                      onChange={handleChange}
+                      required
+                      placeholder="City"
+                    />
+                  </div>
+                  
+                  <div>
+                    <Label htmlFor="postalCode">Postal Code</Label>
+                    <Input
+                      id="postalCode"
+                      name="postalCode"
+                      value={formData.postalCode}
+                      onChange={handleChange}
+                      placeholder="Postal Code"
+                    />
+                  </div>
+                </div>

+                <Button
+                  type="submit"
+                  disabled={quoteItems.length === 0 || loading}
+                  className="w-full bg-momoBlue hover:bg-blue-700 py-3 text-lg"
+                >
+                  {loading ? 'Processing...' : 'Place Order'}
+                </Button>
+              </form>
+            </CardContent>
+          </Card>

+          {/* Order Summary */}
+          <Card>
+            <CardHeader>
+              <CardTitle className="flex items-center gap-2">
+                <FaShoppingCart className="text-momoBlue" />
+                Order Summary
+              </CardTitle>
+            </CardHeader>
+            <CardContent>
+              <div className="space-y-4">
+                {Array.isArray(quoteItems) && quoteItems.map((item) => (
+                  <div key={item?.id || `temp-${Math.random()}`} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
+                    <img
+                      src={item?.selectedImage || item?.images?.[0] || 'https://via.placeholder.com/60'}
+                      alt={typeof item?.title === 'string' ? item.title : 'Product'}
+                      className="w-15 h-15 object-cover rounded"
+                    />
+                    <div className="flex-1">
+                      <h4 className="font-medium">
+                        {typeof item?.title === 'string' ? item.title : 'Untitled Product'}
+                      </h4>
+                      <p className="text-sm text-gray-600">
+                        Quantity: {typeof item?.quantity === 'number' ? item.quantity : 0} × {formatPrice(item?.price)}
+                      </p>
+                    </div>
+                    <div className="text-right">
+                      <p className="font-semibold text-momoBlue">
+                        {formatPrice(Number(item?.price || 0) * Number(item?.quantity || 0))}
+                      </p>
+                    </div>
+                  </div>
+                ))}
+                
+                <div className="border-t pt-4">
+                  <div className="flex justify-between items-center text-lg font-bold">
+                    <span>Total:</span>
+                    <span className="text-momoBlue">{formatPrice(totalPrice)}</span>
+                  </div>
+                </div>
+                
+                <div className="bg-blue-50 p-4 rounded-lg">
+                  <h4 className="font-semibold text-momoBlue mb-2">Order Information</h4>
+                  <ul className="text-sm text-gray-600 space-y-1">
+                    <li>• Free delivery within Eswatini</li>
+                    <li>• Estimated delivery: 2-5 business days</li>
+                    <li>• Payment on delivery available</li>
+                    <li>• 30-day return policy</li>
+                  </ul>
+                </div>
+              </div>
+            </CardContent>
+          </Card>
+        </div>
+      </div>
+    </div>
   );
 };

 export default Checkout;