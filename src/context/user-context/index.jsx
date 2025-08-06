@@ .. @@
 import { createContext, useState } from "react";

 export const UserContext = createContext(null);

 export default function UserProvider({ children }) {
-  const [userVaults, setUserVaults] = useState([]); // List of user's vaults
-  const [activeVault, setActiveVault] = useState(null); // Currently selected vault
-  const [depositInProgress, setDepositInProgress] = useState(false); // Deposit loading status
-  const [withdrawalRequest, setWithdrawalRequest] = useState(null); // Withdrawal request details
+  const [userOrders, setUserOrders] = useState([]); // List of user's orders
+  const [activeOrder, setActiveOrder] = useState(null); // Currently selected order
+  const [orderInProgress, setOrderInProgress] = useState(false); // Order processing status
+  const [userProfile, setUserProfile] = useState(null); // User profile data

   return (
     <UserContext.Provider
       value={{
-        userVaults,
-        setUserVaults,
-        activeVault,
-        setActiveVault,
-        depositInProgress,
-        setDepositInProgress,
-        withdrawalRequest,
-        setWithdrawalRequest,
+        userOrders,
+        setUserOrders,
+        activeOrder,
+        setActiveOrder,
+        orderInProgress,
+        setOrderInProgress,
+        userProfile,
+        setUserProfile,
       }}
     >
       {children}
     </UserContext.Provider>
   );
 }