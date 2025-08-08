import { Route, Routes } from "react-router-dom";
import AuthPage from "@/pages/auth";
import AdminDashboard from "@/pages/admin";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import { Toaster } from "react-hot-toast";
import HomePage from "@/pages/user/home";
import NotFoundPage from "@/pages/not-found";

import { CartProvider } from "./Context/appstate/CartContext/CartContext";
import ProductDetails from "./pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <CartProvider>
      <Routes>
        {/* Root goes to Home page (public) */}
        <Route path="/" element={<HomePage />} />

        {/* Auth page */}
        <Route
          path="/auth"
          element={
            <RouteGuard
              element={<AuthPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />

        {/* Admin dashboard - protected */}
        <Route
          path="/admin"
          element={
            <RouteGuard
              element={<AdminDashboard />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />

        {/* Public product details */}
        <Route path="/product/:productId" element={<ProductDetails />} />

        {/* Public cart page */}
        <Route path="/cart" element={<Cart />} />

        {/* Checkout - protected */}
        <Route
          path="/checkout"
          element={
            <RouteGuard
              element={<Checkout />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </CartProvider>
  );
}

export default App;
