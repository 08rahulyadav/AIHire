import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const userRole = String(user?.role || "")
    .trim()
    .toLowerCase();

  const roles = allowedRoles.map((role) =>
    String(role).trim().toLowerCase()
  );

  if (roles.length > 0 && !roles.includes(userRole)) {
    if (userRole === "recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />;
    }

    if (userRole === "candidate") {
      return <Navigate to="/candidate/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;