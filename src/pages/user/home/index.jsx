@@ .. @@
 import { useEffect, useState, useCallback } from "react";
 import axiosInstance from "@/api/axiosInstance";
-import { FaTags, FaBoxOpen } from "react-icons/fa";
+import { FaTags, FaBoxOpen, FaSearch, FaFilter } from "react-icons/fa";
 import { useNavigate } from "react-router-dom";
 import { useCartContext } from "@/Context/appstate/CartContext/CartContext";
+import Cart from "@/pages/Cart";

 const HomePage = () => {
   const navigate = useNavigate();
-  const { onAdd } = useCartContext();
+  const { onAdd, showCart, setShowCart } = useCartContext();
   const [categories, setCategories] = useState([]);
   const [selectedCategory, setSelectedCategory] = useState("");
   const [products, setProducts] = useState([]);
+  const [searchTerm, setSearchTerm] = useState("");
+  const [loading, setLoading] = useState(false);

   const fetchProducts = useCallback(async () => {
     try {
+      setLoading(true);
       const endpoint = selectedCategory
         ? `/api/products?category=${selectedCategory}`
         : `/api/products`;

       const res = await axiosInstance.get(endpoint);
       setProducts(res.data.products || []);
     } catch (err) {
       console.error("Failed to fetch products", err);
+    } finally {
+      setLoading(false);
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
     fetchProducts();
   }, [fetchProducts]);

   const handleProductClick = (productId) => {
-    navigate(`/product/${productId}`); // Make sure this matches the route path exactly
+    navigate(`/product/${productId}`);
   };

   const handleAddToCart = (e, product) => {
-    e.stopPropagation(); // Prevent navigation when clicking add to cart
+    e.stopPropagation();
     onAdd(
       {
         id: product._id,
         name: product.name,
         price: product.price,
         images: product.images,
       },
       1
     );
   };

+  // Filter products based on search term
+  const filteredProducts = products.filter(product =>
+    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
+    product.description.toLowerCase().includes(searchTerm.toLowerCase())
+  );

   return (
-    <div className="p-8 space-y-10 bg-gray-100 min-h-screen">
-      <h1 className="text-3xl font-bold mb-6">Welcome to SBO Accessories 🛍️</h1>
+    <>
+      <div className="p-4 md:p-8 space-y-6 bg-gray-50 min-h-screen">
+        {/* Hero Section */}
+        <div className="bg-gradient-to-r from-momoBlue to-blue-600 text-white rounded-lg p-8 text-center">
+          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to SBO Accessories 🛍️</h1>
+          <p className="text-lg opacity-90">Discover amazing products at great prices</p>
+        </div>

-      {/* Categories */}
-      <section className="bg-white rounded-lg shadow p-6">
-        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
-          <FaTags /> Shop by Category
-        </h2>
-        <div className="flex flex-wrap gap-3">
-          <button
-            onClick={() => setSelectedCategory("")}
-            className={`px-4 py-2 rounded ${
-              selectedCategory === ""
-                ? "bg-green-600 text-white"
-                : "bg-gray-200 text-gray-700"
-            }`}
-          >
-            All
-          </button>
-          {categories.map((cat) => (
+        {/* Search and Filters */}
+        <div className="bg-white rounded-lg shadow-sm p-6">
+          <div className="flex flex-col md:flex-row gap-4 items-center">
+            {/* Search Bar */}
+            <div className="relative flex-1">
+              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
+              <input
+                type="text"
+                placeholder="Search products..."
+                value={searchTerm}
+                onChange={(e) => setSearchTerm(e.target.value)}
+                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-momoBlue focus:border-transparent"
+              />
+            </div>
+            
+            {/* Category Filter */}
+            <div className="flex items-center gap-2">
+              <FaFilter className="text-gray-500" />
+              <select
+                value={selectedCategory}
+                onChange={(e) => setSelectedCategory(e.target.value)}
+                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-momoBlue focus:border-transparent"
+              >
+                <option value="">All Categories</option>
+                {categories.map((cat) => (
+                  <option key={cat._id} value={cat.name}>
+                    {cat.name}
+                  </option>
+                ))}
+              </select>
+            </div>
+          </div>
+        </div>
+
+        {/* Categories Pills */}
+        <section className="bg-white rounded-lg shadow-sm p-6">
+          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
+            <FaTags className="text-momoBlue" /> Shop by Category
+          </h2>
+          <div className="flex flex-wrap gap-3">
             <button
-              key={cat._id}
-              onClick={() => setSelectedCategory(cat.name)}
-              className={`px-4 py-2 rounded ${
-                selectedCategory === cat.name
-                  ? "bg-green-600 text-white"
-                  : "bg-gray-200 text-gray-700"
-              }`}
+              onClick={() => setSelectedCategory("")}
+              className={`px-4 py-2 rounded-full transition-colors ${
+                selectedCategory === ""
+                  ? "bg-momoBlue text-white"
+                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
+              }`}
             >
-              {cat.name}
+              All
             </button>
-          ))}
-        </div>
-      </section>
+            {categories.map((cat) => (
+              <button
+                key={cat._id}
+                onClick={() => setSelectedCategory(cat.name)}
+                className={`px-4 py-2 rounded-full transition-colors ${
+                  selectedCategory === cat.name
+                    ? "bg-momoBlue text-white"
+                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
+                }`}
+              >
+                {cat.name}
+              </button>
+            ))}
+          </div>
+        </section>

-      {/* Products */}
-      <section className="bg-white rounded-lg shadow p-6">
-        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
-          <FaBoxOpen /> Products
-        </h2>
-        {products.length === 0 ? (
-          <p>No products available.</p>
-        ) : (
-          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
-            {products.map((product) => (
-              <div
-                key={product._id}
-                className="border rounded p-4 shadow-sm bg-white group relative"
-              >
-                {/* Clickable overlay for the entire card except the button */}
-                <div
-                  onClick={() => handleProductClick(product._id)}
-                  className="cursor-pointer"
+        {/* Products */}
+        <section className="bg-white rounded-lg shadow-sm p-6">
+          <div className="flex items-center justify-between mb-6">
+            <h2 className="text-xl font-semibold flex items-center gap-2">
+              <FaBoxOpen className="text-momoBlue" /> Products
+            </h2>
+            <span className="text-gray-500">
+              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
+            </span>
+          </div>
+          
+          {loading ? (
+            <div className="flex justify-center items-center py-12">
+              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-momoBlue"></div>
+            </div>
+          ) : filteredProducts.length === 0 ? (
+            <div className="text-center py-12">
+              <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
+              <p className="text-gray-500 text-lg">No products found</p>
+              {searchTerm && (
+                <p className="text-gray-400 mt-2">Try adjusting your search terms</p>
+              )}
+            </div>
+          ) : (
+            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
+              {filteredProducts.map((product) => (
+                <div
+                  key={product._id}
+                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white group hover:shadow-md transition-shadow"
                 >
-                  <img
-                    src={product.images?.[0] || "https://via.placeholder.com/150"}
-                    alt={product.name}
-                    className="w-full h-40 object-cover mb-4 rounded group-hover:opacity-90 transition-opacity"
-                  />
-                  <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600">
-                    {product.name}
-                  </h3>
-                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
-                    {product.description}
-                  </p>
-                  <p className="text-green-600 font-bold mb-2">
-                    R {product.price}
-                  </p>
-                </div>
+                  {/* Clickable overlay for the entire card except the button */}
+                  <div
+                    onClick={() => handleProductClick(product._id)}
+                    className="cursor-pointer"
+                  >
+                    <div className="relative">
+                      <img
+                        src={product.images?.[0] || "https://via.placeholder.com/300x200"}
+                        alt={product.name}
+                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
+                      />
+                      {product.images?.length > 1 && (
+                        <span className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
+                          +{product.images.length - 1} more
+                        </span>
+                      )}
+                    </div>
+                    <div className="p-4">
+                      <h3 className="font-semibold text-lg mb-2 group-hover:text-momoBlue transition-colors line-clamp-1">
+                        {product.name}
+                      </h3>
+                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
+                        {product.description}
+                      </p>
+                      <div className="flex items-center justify-between mb-3">
+                        <span className="text-2xl font-bold text-green-600">
+                          E{product.price}
+                        </span>
+                        {product.category && (
+                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
+                            {product.category}
+                          </span>
+                        )}
+                      </div>
+                    </div>
+                  </div>

-                {/* Independent Add to Cart button */}
-                <button
-                  className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-colors"
-                  onClick={(e) => {
-                    e.stopPropagation();
-                    handleAddToCart(e, product);
-                  }}
-                >
-                  Add to Cart
-                </button>
-              </div>
-            ))}
-          </div>
-        )}
-      </section>
-    </div>
+                  {/* Independent Add to Cart button */}
+                  <div className="p-4 pt-0">
+                    <button
+                      className="w-full bg-momoBlue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
+                      onClick={(e) => {
+                        e.stopPropagation();
+                        handleAddToCart(e, product);
+                      }}
+                    >
+                      Add to Cart
+                    </button>
+                  </div>
+                </div>
+              ))}
+            </div>
+          )}
+        </section>
+      </div>
+
+      {/* Cart Sidebar */}
+      {showCart && (
+        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
+          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
+            <div className="p-4 border-b flex justify-between items-center">
+              <h2 className="text-lg font-semibold">Shopping Cart</h2>
+              <button
+                onClick={() => setShowCart(false)}
+                className="text-gray-500 hover:text-gray-700"
+              >
+                ✕
+              </button>
+            </div>
+            <Cart />
+          </div>
+        </div>
+      )}
+    </>
   );
 };

 export default HomePage;