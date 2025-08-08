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
  event.preventDefault();

  try {
    const response = await axiosInstance.post("/auth/register", {
      ...signUpFormData,
      role: "user", // optional
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

        // ✅ Redirect after signup + login
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get("redirect");

        if (redirectPath) {
          navigate(redirectPath);
        } else {
          navigate("/home");
        }
      } else {
        toast.error("Account created, but automatic login failed. Please sign in.");
        navigate("/auth");
      }
    } else {
      toast.error(response.data.message || "Registration failed.");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Registration failed. Try again."
    );
  }
}
  // LOGIN USER
 async function handleLoginUser(event) {
  event.preventDefault();

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

      // ✅ Check if redirect param exists
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect");

      if (data.data.user.role === "admin") {
        navigate("/admin");
      } else if (redirectPath) {
        navigate(redirectPath); // Go back to the original page
      } else {
        navigate("/home");
      }
    } else {
      setAuth({ authenticate: false, user: null });
      toast.error(data?.message || "Login failed. Please try again.");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed. Please try again.");
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
