import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/api/axiosInstance";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
  });
  const [editProductId, setEditProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({});

  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
      console.log("Users fetched:", res.data.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, [token]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  }, []);

  const handleCreateProduct = async () => {
    try {
      const payload = {
        ...newProduct,
        images: [newProduct.image],
      };
      delete payload.image;

      await axiosInstance.post("/api/admin/products", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProducts();
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

  const handleUpdateProduct = async () => {
    try {
      const payload = {
        ...editProductData,
        images: [editProductData.image],
      };
      delete payload.image;

      await axiosInstance.put(`/api/admin/products/${editProductId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditProductId(null);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, [fetchUsers, fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Admin Dashboard</h1>

      {/* USERS SECTION */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-4">
          Users ({users.length})
        </h2>
        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={u._id}
              className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <div>
                <span className="font-medium text-gray-800">{u.userName}</span> -{" "}
                <span className="text-gray-600">{u.userEmail}</span>{" "}
                <span className="text-sm text-gray-500">({u.role})</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-4">
          Products
        </h2>

        {/* CREATE PRODUCT FORM */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-600 mb-4">Create Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            />
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition col-span-1 md:col-span-2"
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              rows={4}
            />
          </div>
          <button
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
            onClick={handleCreateProduct}
          >
            Create Product
          </button>
        </div>

        {/* EXISTING PRODUCTS LIST */}
        <div>
          <h3 className="text-lg font-medium text-gray-600 mb-4">Existing Products</h3>
          <ul className="space-y-3">
            {products.map((p) => (
              <li
                key={p._id}
                className="flex items-center gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition"
              >
                {editProductId === p._id ? (
                  // EDIT MODE
                  <>
                    <input
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={editProductData.name}
                      onChange={(e) =>
                        setEditProductData({ ...editProductData, name: e.target.value })
                      }
                    />
                    <input
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={editProductData.image || ""}
                      onChange={(e) =>
                        setEditProductData({ ...editProductData, image: e.target.value })
                      }
                      placeholder="Image URL"
                    />
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                      onClick={handleUpdateProduct}
                    >
                      Save
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition font-medium"
                      onClick={() => setEditProductId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  // VIEW MODE
                  <>
                    <span className="flex-grow">
                      <span className="font-medium text-gray-800">{p.name}</span> -{" "}
                      <span className="text-gray-600">${p.price}</span>
                    </span>
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition font-medium"
                      onClick={() => {
                        setEditProductId(p._id);
                        setEditProductData({
                          ...p,
                          image: p.images?.[0] || "",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
                      onClick={() => handleDeleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}