import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";

import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import axiosInstance from "@/api/axiosInstance"; //  use axiosInstance directly

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //  REGISTER USER
 async function handleRegisterUser(event) {
  if (event?.preventDefault) {
    event.preventDefault();
  }

  try {
    const response = await axiosInstance.post("/auth/register", {
      ...signUpFormData,
      role: "user",
    });

    if (response.data.success) {
      toast.success("Registration successful!");

      // Automatically log in the new user
      const loginResponse = await axiosInstance.post("/auth/login", {
        userEmail: signUpFormData.userEmail,
        password: signUpFormData.password,
      });

      const data = loginResponse.data;

      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        localStorage.setItem("userId", data.data.user._id);

        setAuth({
          authenticate: true,
          user: data.data.user,
        });

        // Don't navigate here, just return success
        return true;
      } else {
        toast.error(
          "Account created, but automatic login failed. Please sign in."
        );
        return false;
      }
    } else {
      toast.error(response.data.message || "Registration failed.");
      return false;
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Registration failed. Try again."
    );
    return false;
  }
}
 // LOGIN USER
async function handleLoginUser(event, redirectPath) {
  if (event?.preventDefault) {
    event.preventDefault();
  }

  try {
    const response = await axiosInstance.post("/auth/login", signInFormData);
    const data = response.data;

    if (data.success) {
      sessionStorage.setItem("accessToken", JSON.stringify(data.data.accessToken));
      localStorage.setItem("userId", data.data.user._id);

      setAuth({
        authenticate: true,
        user: data.data.user,
      });

      toast.success("You have successfully logged in!");

      if (data.data.user.role === "admin") {
        navigate("/admin");
      } else if (redirectPath) {
        navigate(redirectPath); // Use passed redirect path
      } else {
        navigate("/home");
      }
      return true;
    } else {
      setAuth({ authenticate: false, user: null });
      toast.error(data?.message || "Login failed. Please try again.");
      return false;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed. Please try again.");
    return false;
  }
}
  // CHECK AUTH ON PAGE LOAD
  async function checkAuthUser() {
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      const data = response.data;

      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({ authenticate: false, user: null });
      }
    } catch (error) {
      console.log(error);
      setAuth({ authenticate: false, user: null });
    } finally {
      setLoading(false);
    }
  }

  // LOGOUT / RESET SESSION
  function resetCredentials() {
    setAuth({ authenticate: false, user: null });
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate("/auth");
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
