import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";
const PrivateRoute = () => {
  const {loading,user} = useSelector((state) => state.auth);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/Login" />;
};

export default PrivateRoute;
