import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.user);
  return isAuthenticated ? <Outlet /> : <Navigate to="/Login" />;
};

export default PrivateRoute;
