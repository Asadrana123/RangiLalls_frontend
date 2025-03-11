import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Layout/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Registration from "./Pages/Registration";
import Login from "./Pages/Login";
import AuctionDetails from "./Pages/AuctionDetails";
import TenderPayment from "./Pages/TenderPayment";
import ForgotPassword from "./Pages/ForgotPassword";
import PrivateRoutes from "./Routes/PrivateRoutes";
import PrivateAdminRoute from "./Routes/PrivateAdminRoute";
import VerifyEmail from "./Pages/VerifyEmail";
import ResetPassword from "./Pages/ResetPassword";
import AuctionRegistration from "./Pages/AuctionRegistration";
import Footer from "./Components/Layout/Footer";
import { checkAuthStatus } from "./redux/Slices/authSlice";
import ContactUs from "./Pages/ContactUs";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchProperties } from "./redux/Slices/propertySlice";
import LiveAuctionRoom from "./Pages/LiveAuctionRoom";
import AdminDashboard from "./Pages/AdminDashboard";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";
import UnauthorizedPage from "./Pages/UnAuthorizedPage";
function App() {
  const dispatch = useDispatch();
  const  propertyLoading  = useSelector((state) => state.property.loading);
  const  userLoading  = useSelector((state) => state.auth.loading);
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);
  if (propertyLoading||userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/Register" element={<Registration />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/property/:id" element={<AuctionDetails />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/unauthorized" element={<UnauthorizedPage/>}/>
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route element={<PrivateAdminRoute />}>
              <Route 
                path="/admin"
                element={<AdminDashboard/>}
              />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route
                path="/property/:id/tender-payment"
                element={<TenderPayment />}
              />
              <Route
                path="/property/:id/auction-registration"
                element={<AuctionRegistration />}
              />
              <Route
                path="/property/:id/live-auction"
                element={<LiveAuctionRoom />}
              />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
