@@ .. @@
 import AuthPage from "@/pages/auth";
 import AdminDashboard from "@/pages/admin";
 import RouteGuard from "./components/route-guard";
 import { useContext } from "react";
 import { AuthContext } from "./context/auth-context";
 import { Toaster } from "react-hot-toast";
 import HomePage from "@/pages/user/home";
 import NotFoundPage from "@/pages/not-found";
-import DepositPage from "@/pages/user/deposit";
-import WithdrawPage from "@/pages/user/withdraw";
 import { CartProvider } from "./Context/appstate/CartContext/CartContext";
 import ProductDetails from "./pages/ProductDetails";
+import CheckoutPage from "./pages/Checkout";
+import OrderConfirmation from "./pages/OrderConfirmation";
+import UserProfile from "./pages/user/profile";

 function App() {
   const { auth } = useContext(AuthContext);

   return (
     <CartProvider>
       <Routes>
         {/* Redirect root to /auth */}
         <Route path="/" element={<Navigate to="/auth" />} />

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

         <Route
           path="/home"
           element={
             <RouteGuard
               element={<HomePage />}
               authenticated={auth?.authenticate}
               user={auth?.user}
             />
           }
         />

-        <Route
-          path="/deposit"
-          element={
-            <RouteGuard
-              element={<DepositPage />}
-              authenticated={auth?.authenticate}
-              user={auth?.user}
-            />
-          }
-        />
-
-        <Route
-          path="/withdraw"
-          element={
-            <RouteGuard
-              element={<WithdrawPage />}
-              authenticated={auth?.authenticate}
-              user={auth?.user}
-            />
-          }
-        />
+        <Route
+          path="/checkout"
+          element={
+            <RouteGuard
+              element={<CheckoutPage />}
+              authenticated={auth?.authenticate}
+              user={auth?.user}
+            />
+          }
+        />
+
+        <Route
+          path="/order-confirmation"
+          element={
+            <RouteGuard
+              element={<OrderConfirmation />}
+              authenticated={auth?.authenticate}
+              user={auth?.user}
+            />
+          }
+        />
+
+        <Route
+          path="/profile"
+          element={
+            <RouteGuard
+              element={<UserProfile />}
+              authenticated={auth?.authenticate}
+              user={auth?.user}
+            />
+          }
+        />

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

         <Route
           path="/product/:productId"
           element={
             <RouteGuard
+              element={<ProductDetails />}
+              authenticated={auth?.authenticate}
+              user={auth?.user}
+            />
+          }
+        />
+
+        <Route
+          path="/cart"
+          element={
+            <RouteGuard>
-              <ProductDetails />
+              <div>Cart Page - Will be implemented as modal/sidebar</div>
             </RouteGuard>
           }
         />

         <Route path="*" element={<NotFoundPage />} />
       </Routes>

       <Toaster position="top-right" reverseOrder={false} />
     </CartProvider>
   );
 }

 export default App;