import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/api/axiosInstance";

// A functional component for the Admin Dashboard.
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

  // Fetches a list of all users from the backend.
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

  // Fetches a list of all products from the backend.
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  }, []);

  // Handles the creation of a new product.
  const handleCreateProduct = async () => {
    try {
      const payload = {
        ...newProduct,
        images: [newProduct.image], // Wraps the image URL in an array.
      };
      delete payload.image;

      await axiosInstance.post("/api/admin/products", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProducts(); // Refreshes the product list.
      // Resets the new product form fields.
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

  // Handles the updating of an existing product.
  const handleUpdateProduct = async () => {
    try {
      const payload = {
        ...editProductData,
        images: [editProductData.image], // Wraps the image URL in an array.
      };
      delete payload.image;

      await axiosInstance.put(`/api/admin/products/${editProductId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditProductId(null); // Exits editing mode.
      fetchProducts(); // Refreshes the product list.
    } catch (err) {
      console.error("Error updating product", err);
    }
  };

  // Handles the deletion of a product by its ID.
  const handleDeleteProduct = async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(); // Refreshes the product list.
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  // Fetches users and products on the component's initial render.
  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, [fetchUsers, fetchProducts]);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f7f9" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "2rem" }}>Admin Dashboard</h1>

      {/* USERS SECTION */}
      <section style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "0.5rem", color: "#555" }}>Users</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {users.map((u) => (
            <li key={u._id} style={{ padding: "0.75rem 0", borderBottom: "1px solid #eee" }}>
              <strong>{u.name}</strong> - {u.email}
            </li>
          ))}
        </ul>
      </section>

      {/* PRODUCTS SECTION */}
      <section style={{ marginTop: "2rem", backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "0.5rem", color: "#555" }}>Products</h2>

        {/* CREATE PRODUCT FORM */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#666" }}>Create Product</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <input
              style={inputStyle}
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            />
            <textarea
              style={{ ...inputStyle, gridColumn: "1 / -1" }}
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
          </div>
          <button style={{ ...buttonStyle, backgroundColor: "#4CAF50", marginTop: "1rem" }} onClick={handleCreateProduct}>
            Create Product
          </button>
        </div>

        {/* EXISTING PRODUCTS LIST */}
        <div>
          <h3 style={{ color: "#666" }}>Existing Products</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {products.map((p) => (
              <li key={p._id} style={{ padding: "0.75rem 0", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "1rem" }}>
                {editProductId === p._id ? (
                  // EDIT MODE
                  <>
                    <input
                      style={inputStyle}
                      value={editProductData.name}
                      onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                    />
                    <input
                      style={inputStyle}
                      value={editProductData.image || ""}
                      onChange={(e) => setEditProductData({ ...editProductData, image: e.target.value })}
                      placeholder="Image URL"
                    />
                    <button style={{ ...buttonStyle, backgroundColor: "#007BFF" }} onClick={handleUpdateProduct}>
                      Save
                    </button>
                    <button style={{ ...buttonStyle, backgroundColor: "#6c757d" }} onClick={() => setEditProductId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  // VIEW MODE
                  <>
                    <span style={{ flexGrow: 1 }}>
                      <strong>{p.name}</strong> - ${p.price}
                    </span>
                    <button
                      style={{ ...buttonStyle, backgroundColor: "#ffc107" }}
                      onClick={() => {
                        setEditProductId(p._id);
                        setEditProductData({
                          ...p,
                          image: p.images?.[0] || "", // Pre-fills the image field.
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button style={{ ...buttonStyle, backgroundColor: "#dc3545" }} onClick={() => handleDeleteProduct(p._id)}>
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

// Reusable styles for a cleaner look.
const inputStyle = {
  padding: "0.75rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  borderRadius: "4px",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "background-color 0.3s ease",
};