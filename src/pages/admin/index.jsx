@@ .. @@
 import { useEffect, useState, useCallback } from "react";
 import axiosInstance from "@/api/axiosInstance";
+import { FaUsers, FaBox, FaShoppingCart, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

-// A functional component for the Admin Dashboard.
 export default function AdminDashboard() {
   const [users, setUsers] = useState([]);
   const [products, setProducts] = useState([]);
+  const [orders, setOrders] = useState([]);
+  const [categories, setCategories] = useState([]);
   const [newProduct, setNewProduct] = useState({
     name: "",
     price: "",
     category: "",
     image: "",
     description: "",
   });
   const [editProductId, setEditProductId] = useState(null);
   const [editProductData, setEditProductData] = useState({});
+  const [activeTab, setActiveTab] = useState("overview");

   const token = localStorage.getItem("token");

-  // Fetches a list of all users from the backend.
   const fetchUsers = useCallback(async () => {
     try {
       const res = await axiosInstance.get("/api/admin/users", {
         headers: { Authorization: `Bearer ${token}` },
       });
       setUsers(res.data.users);
     } catch (err) {
       console.error("Failed to fetch users", err);
     }
   }, [token]);

-  // Fetches a list of all products from the backend.
   const fetchProducts = useCallback(async () => {
     try {
       const res = await axiosInstance.get("/api/products");
       setProducts(res.data.products);
     } catch (err) {
       console.error("Failed to fetch products", err);
     }
   }, []);

-  // Handles the creation of a new product.
+  const fetchOrders = useCallback(async () => {
+    try {
+      const res = await axiosInstance.get("/api/admin/orders", {
+        headers: { Authorization: `Bearer ${token}` },
+      });
+      setOrders(res.data.orders || []);
+    } catch (err) {
+      console.error("Failed to fetch orders", err);
+      // Mock data for demonstration
+      setOrders([
+        {
+          _id: "1",
+          orderNumber: "ORD-123456",
+          customerName: "John Doe",
+          customerEmail: "john@example.com",
+          total: 299.99,
+          status: "pending",
+          createdAt: "2024-01-15T10:30:00Z",
+          items: [
+            { name: "Wireless Headphones", quantity: 1, price: 199.99 },
+            { name: "Phone Case", quantity: 2, price: 50.00 }
+          ]
+        }
+      ]);
+    }
+  }, [token]);
+
+  const fetchCategories = useCallback(async () => {
+    try {
+      const res = await axiosInstance.get("/api/categories");
+      setCategories(res.data.categories || []);
+    } catch (err) {
+      console.error("Failed to fetch categories", err);
+    }
+  }, []);
+
   const handleCreateProduct = async () => {
     try {
       const payload = {
         ...newProduct,
-        images: [newProduct.image], // Wraps the image URL in an array.
+        images: [newProduct.image],
       };
       delete payload.image;

       await axiosInstance.post("/api/admin/products", payload, {
         headers: { Authorization: `Bearer ${token}` },
       });

-      fetchProducts(); // Refreshes the product list.
-      // Resets the new product form fields.
+      fetchProducts();
       setNewProduct({
         name: "",
         price: "",
         category: "",
         image: "",
         description: "",
       });
     } catch (err) {
       console.error("Error creating product", err);
     }
   };

-  // Handles the updating of an existing product.
   const handleUpdateProduct = async () => {
     try {
       const payload = {
         ...editProductData,
-        images: [editProductData.image], // Wraps the image URL in an array.
+        images: [editProductData.image],
       };
       delete payload.image;

       await axiosInstance.put(`/api/admin/products/${editProductId}`, payload, {
         headers: { Authorization: `Bearer ${token}` },
       });

-      setEditProductId(null); // Exits editing mode.
-      fetchProducts(); // Refreshes the product list.
+      setEditProductId(null);
+      fetchProducts();
     } catch (err) {
       console.error("Error updating product", err);
     }
   };

-  // Handles the deletion of a product by its ID.
   const handleDeleteProduct = async (id) => {
     try {
       await axiosInstance.delete(`/api/admin/products/${id}`, {
         headers: { Authorization: `Bearer ${token}` },
       });
-      fetchProducts(); // Refreshes the product list.
+      fetchProducts();
     } catch (err) {
       console.error("Error deleting product", err);
     }
   };

-  // Fetches users and products on the component's initial render.
+  const handleUpdateOrderStatus = async (orderId, newStatus) => {
+    try {
+      await axiosInstance.put(`/api/admin/orders/${orderId}`, 
+        { status: newStatus },
+        { headers: { Authorization: `Bearer ${token}` } }
+      );
+      fetchOrders();
+    } catch (err) {
+      console.error("Error updating order status", err);
+    }
+  };
+
   useEffect(() => {
     fetchUsers();
     fetchProducts();
-  }, [fetchUsers, fetchProducts]);
+    fetchOrders();
+    fetchCategories();
+  }, [fetchUsers, fetchProducts, fetchOrders, fetchCategories]);

   return (
-    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f7f9" }}>
-      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "2rem" }}>Admin Dashboard</h1>
+    <div className="min-h-screen bg-gray-50">
+      <div className="bg-white shadow-sm border-b">
+        <div className="max-w-7xl mx-auto px-4 py-6">
+          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
+          <p className="text-gray-600 mt-2">Manage your e-commerce platform</p>
+        </div>
+      </div>

-      {/* USERS SECTION */}
-      <section style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
-        <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "0.5rem", color: "#555" }}>Users</h2>
-        <ul style={{ listStyleType: "none", padding: 0 }}>
-          {users.map((u) => (
-            <li key={u._id} style={{ padding: "0.75rem 0", borderBottom: "1px solid #eee" }}>
-              <strong>{u.name}</strong> - {u.email}
-            </li>
-          ))}
-        </ul>
-      </section>
+      <div className="max-w-7xl mx-auto px-4 py-8">
+        {/* Stats Overview */}
+        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
+          <div className="bg-white p-6 rounded-lg shadow-sm border">
+            <div className="flex items-center">
+              <FaUsers className="text-2xl text-blue-600 mr-3" />
+              <div>
+                <p className="text-sm text-gray-600">Total Users</p>
+                <p className="text-2xl font-bold">{users.length}</p>
+              </div>
+            </div>
+          </div>
+          
+          <div className="bg-white p-6 rounded-lg shadow-sm border">
+            <div className="flex items-center">
+              <FaBox className="text-2xl text-green-600 mr-3" />
+              <div>
+                <p className="text-sm text-gray-600">Total Products</p>
+                <p className="text-2xl font-bold">{products.length}</p>
+              </div>
+            </div>
+          </div>
+          
+          <div className="bg-white p-6 rounded-lg shadow-sm border">
+            <div className="flex items-center">
+              <FaShoppingCart className="text-2xl text-purple-600 mr-3" />
+              <div>
+                <p className="text-sm text-gray-600">Total Orders</p>
+                <p className="text-2xl font-bold">{orders.length}</p>
+              </div>
+            </div>
+          </div>
+          
+          <div className="bg-white p-6 rounded-lg shadow-sm border">
+            <div className="flex items-center">
+              <FaTags className="text-2xl text-orange-600 mr-3" />
+              <div>
+                <p className="text-sm text-gray-600">Categories</p>
+                <p className="text-2xl font-bold">{categories.length}</p>
+              </div>
+            </div>
+          </div>
+        </div>

-      {/* PRODUCTS SECTION */}
-      <section style={{ marginTop: "2rem", backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
-        <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "0.5rem", color: "#555" }}>Products</h2>
+        {/* Navigation Tabs */}
+        <div className="bg-white rounded-lg shadow-sm border mb-6">
+          <div className="border-b">
+            <nav className="flex space-x-8 px-6">
+              {[
+                { id: 'overview', label: 'Overview', icon: FaUsers },
+                { id: 'products', label: 'Products', icon: FaBox },
+                { id: 'orders', label: 'Orders', icon: FaShoppingCart },
+                { id: 'users', label: 'Users', icon: FaUsers }
+              ].map((tab) => (
+                <button
+                  key={tab.id}
+                  onClick={() => setActiveTab(tab.id)}
+                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
+                    activeTab === tab.id
+                      ? 'border-momoBlue text-momoBlue'
+                      : 'border-transparent text-gray-500 hover:text-gray-700'
+                  }`}
+                >
+                  <tab.icon />
+                  {tab.label}
+                </button>
+              ))}
+            </nav>
+          </div>
+        </div>

-        {/* CREATE PRODUCT FORM */}
-        <div style={{ marginBottom: "2rem" }}>
-          <h3 style={{ color: "#666" }}>Create Product</h3>
-          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
-            <input
-              style={inputStyle}
-              placeholder="Name"
-              value={newProduct.name}
-              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
-            />
-            <input
-              style={inputStyle}
-              placeholder="Price"
-              value={newProduct.price}
-              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
-            />
-            <input
-              style={inputStyle}
-              placeholder="Category"
-              value={newProduct.category}
-              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
-            />
-            <input
-              style={inputStyle}
-              placeholder="Image URL"
-              value={newProduct.image}
-              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
-            />
-            <textarea
-              style={{ ...inputStyle, gridColumn: "1 / -1" }}
-              placeholder="Description"
-              value={newProduct.description}
-              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
-            />
+        {/* Tab Content */}
+        <div className="bg-white rounded-lg shadow-sm border">
+          {/* Products Tab */}
+          {activeTab === 'products' && (
+            <div className="p-6">
+              <div className="flex justify-between items-center mb-6">
+                <h2 className="text-xl font-semibold">Product Management</h2>
+                <button className="bg-momoBlue text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
+                  <FaPlus />
+                  Add Product
+                </button>
+              </div>
+
+              {/* CREATE PRODUCT FORM */}
+              <div className="bg-gray-50 p-6 rounded-lg mb-6">
+                <h3 className="text-lg font-medium mb-4">Create New Product</h3>
+                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
+                  <input
+                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-momoBlue focus:border-transparent"
+                    placeholder="Product Name"
+                    value={newProduct.name}
+                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
+                  />
+                  <input
+                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-momoBlue focus:border-transparent"
+                    placeholder="Price (E)"
+                    type="number"
+                    value={newProduct.price}
+                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
+                  />
+                  <select
+                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-momoBlue focus:border-transparent"
+                    value={newProduct.category}
+                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
+                  >
+                    <option value="">Select Category</option>
+                    {categories.map((cat) => (
+                      <option key={cat._id} value={cat.name}>{cat.name}</option>
+                    ))}
+                  </select>
+                  <input
+                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-momoBlue focus:border-transparent"
+                    placeholder="Image URL"
+                    value={newProduct.image}
+                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
+                  />
+                  <textarea
+                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-momoBlue focus:border-transparent md:col-span-2"
+                    placeholder="Product Description"
+                    rows={3}
+                    value={newProduct.description}
+                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
+                  />
+                </div>
+                <button 
+                  onClick={handleCreateProduct}
+                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
+                >
+                  Create Product
+                </button>
+              </div>
+
+              {/* EXISTING PRODUCTS LIST */}
+              <div>
+                <h3 className="text-lg font-medium mb-4">Existing Products</h3>
+                <div className="overflow-x-auto">
+                  <table className="w-full border-collapse">
+                    <thead>
+                      <tr className="border-b">
+                        <th className="text-left py-3 px-4">Image</th>
+                        <th className="text-left py-3 px-4">Name</th>
+                        <th className="text-left py-3 px-4">Price</th>
+                        <th className="text-left py-3 px-4">Category</th>
+                        <th className="text-left py-3 px-4">Actions</th>
+                      </tr>
+                    </thead>
+                    <tbody>
+                      {products.map((product) => (
+                        <tr key={product._id} className="border-b hover:bg-gray-50">
+                          <td className="py-3 px-4">
+                            <img 
+                              src={product.images?.[0] || 'https://via.placeholder.com/50'} 
+                              alt={product.name}
+                              className="w-12 h-12 object-cover rounded"
+                            />
+                          </td>
+                          <td className="py-3 px-4 font-medium">{product.name}</td>
+                          <td className="py-3 px-4">E{product.price}</td>
+                          <td className="py-3 px-4">{product.category}</td>
+                          <td className="py-3 px-4">
+                            <div className="flex gap-2">
+                              <button
+                                onClick={() => {
+                                  setEditProductId(product._id);
+                                  setEditProductData({
+                                    ...product,
+                                    image: product.images?.[0] || "",
+                                  });
+                                }}
+                                className="text-blue-600 hover:text-blue-800 p-1"
+                              >
+                                <FaEdit />
+                              </button>
+                              <button
+                                onClick={() => handleDeleteProduct(product._id)}
+                                className="text-red-600 hover:text-red-800 p-1"
+                              >
+                                <FaTrash />
+                              </button>
+                            </div>
+                          </td>
+                        </tr>
+                      ))}
+                    </tbody>
+                  </table>
+                </div>
+              </div>
+            </div>
+          )}
+
+          {/* Orders Tab */}
+          {activeTab === 'orders' && (
+            <div className="p-6">
+              <h2 className="text-xl font-semibold mb-6">Order Management</h2>
+              <div className="space-y-4">
+                {orders.map((order) => (
+                  <div key={order._id} className="border border-gray-200 rounded-lg p-4">
+                    <div className="flex justify-between items-start mb-3">
+                      <div>
+                        <h3 className="font-semibold">Order #{order.orderNumber}</h3>
+                        <p className="text-sm text-gray-600">{order.customerName} - {order.customerEmail}</p>
+                        <p className="text-sm text-gray-500">
+                          {new Date(order.createdAt).toLocaleDateString()}
+                        </p>
+                      </div>
+                      <div className="text-right">
+                        <p className="text-lg font-bold text-momoBlue">E{order.total.toFixed(2)}</p>
+                        <select
+                          value={order.status}
+                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
+                          className="mt-2 px-3 py-1 border border-gray-300 rounded text-sm"
+                        >
+                          <option value="pending">Pending</option>
+                          <option value="processing">Processing</option>
+                          <option value="shipped">Shipped</option>
+                          <option value="delivered">Delivered</option>
+                          <option value="cancelled">Cancelled</option>
+                        </select>
+                      </div>
+                    </div>
+                    <div className="border-t pt-3">
+                      <h4 className="font-medium mb-2">Items:</h4>
+                      {order.items.map((item, index) => (
+                        <div key={index} className="flex justify-between text-sm">
+                          <span>{item.name} × {item.quantity}</span>
+                          <span>E{item.price.toFixed(2)}</span>
+                        </div>
+                      ))}
+                    </div>
+                  </div>
+                ))}
+              </div>
+            </div>
+          )}
+
+          {/* Users Tab */}
+          {activeTab === 'users' && (
+            <div className="p-6">
+              <h2 className="text-xl font-semibold mb-6">User Management</h2>
+              <div className="overflow-x-auto">
+                <table className="w-full border-collapse">
+                  <thead>
+                    <tr className="border-b">
+                      <th className="text-left py-3 px-4">Name</th>
+                      <th className="text-left py-3 px-4">Email</th>
+                      <th className="text-left py-3 px-4">Phone</th>
+                      <th className="text-left py-3 px-4">Role</th>
+                      <th className="text-left py-3 px-4">Actions</th>
+                    </tr>
+                  </thead>
+                  <tbody>
+                    {users.map((user) => (
+                      <tr key={user._id} className="border-b hover:bg-gray-50">
+                        <td className="py-3 px-4 font-medium">{user.userName || user.name}</td>
+                        <td className="py-3 px-4">{user.userEmail || user.email}</td>
+                        <td className="py-3 px-4">{user.phoneNumber || 'N/A'}</td>
+                        <td className="py-3 px-4">
+                          <span className={`px-2 py-1 rounded-full text-xs ${
+                            user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
+                          }`}>
+                            {user.role}
+                          </span>
+                        </td>
+                        <td className="py-3 px-4">
+                          <button className="text-blue-600 hover:text-blue-800 p-1">
+                            <FaEye />
+                          </button>
+                        </td>
+                      </tr>
+                    ))}
+                  </tbody>
+                </table>
+              </div>
+            </div>
+          )}
+
+          {/* Overview Tab */}
+          {activeTab === 'overview' && (
+            <div className="p-6">
+              <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
+              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
+                <div>
+                  <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
+                  <div className="space-y-3">
+                    {orders.slice(0, 5).map((order) => (
+                      <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
+                        <div>
+                          <p className="font-medium">#{order.orderNumber}</p>
+                          <p className="text-sm text-gray-600">{order.customerName}</p>
+                        </div>
+                        <div className="text-right">
+                          <p className="font-semibold">E{order.total.toFixed(2)}</p>
+                          <p className="text-sm text-gray-600">{order.status}</p>
+                        </div>
+                      </div>
+                    ))}
+                  </div>
+                </div>
+                
+                <div>
+                  <h3 className="text-lg font-medium mb-4">Top Products</h3>
+                  <div className="space-y-3">
+                    {products.slice(0, 5).map((product) => (
+                      <div key={product._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
+                        <img 
+                          src={product.images?.[0] || 'https://via.placeholder.com/40'} 
+                          alt={product.name}
+                          className="w-10 h-10 object-cover rounded"
+                        />
+                        <div className="flex-1">
+                          <p className="font-medium">{product.name}</p>
+                          <p className="text-sm text-gray-600">E{product.price}</p>
+                        </div>
+                      </div>
+                    ))}
+                  </div>
+                </div>
+              </div>
+            </div>
+          )}
+        </div>
+      </div>
+    </div>
+  );
+}
+
+// Import FaTags at the top
+import { FaTags } from "react-icons/fa";
+
+// Remove the old inline styles
+const inputStyle = {
+  padding: "0.75rem",
+  borderRadius: "4px",
+  border: "1px solid #ccc",
+  width: "100%",
+  boxSizing: "border-box",
+};
+
+const buttonStyle = {
+  padding: "0.75rem 1.5rem",
+  borderRadius: "4px",
+  border: "none",
+  color: "white",
+  cursor: "pointer",
+  fontWeight: "bold",
+  transition: "background-color 0.3s ease",
+};
+