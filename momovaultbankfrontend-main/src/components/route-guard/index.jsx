import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";
import PropTypes from "prop-types";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  console.log("AUTH CHECK:", authenticated, user);

  // 🚫 If not logged in, remember the page they were trying to visit
  if (!authenticated && !location.pathname.includes("/auth")) {
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // 🧍 Block regular users from accessing /admin routes
  if (
    authenticated &&
    user?.role !== "admin" &&
    location.pathname.startsWith("/admin")
  ) {
    return <Navigate to="/home" replace />;
  }

  // 👑 Block admin users from accessing /user routes
  if (
    authenticated &&
    user?.role === "user" &&
    location.pathname.startsWith("/user")
  ) {
    return <Navigate to="/home" replace />;
  }

  // ✅ Allow access
  return <Fragment>{element}</Fragment>;
}

RouteGuard.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
  element: PropTypes.element.isRequired,
};

export default RouteGuard;
