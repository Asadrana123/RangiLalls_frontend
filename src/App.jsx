import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Layout/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Registration from "./Pages/Registration"
import Login from "./Pages/Login";
import AuctionDetails from "./Pages/AuctionDetails";
import TenderPayment from "./Pages/TenderPayment";
import ForgotPassword from "./Pages/ForgotPassword";
import PrivateRoutes from "./Routes/PrivateRoutes";
import VerifyEmail from "./Pages/VerifyEmail";
import Footer from "./Components/Layout/Footer";
import { checkAuthStatus } from "./redux/Slices/authSlice";
import ContactUs from "./Pages/ContactUs";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {fetchProperties} from "./redux/Slices/propertySlice";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  useEffect(() => {
      dispatch(fetchProperties());
    }, [dispatch]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Register" element={<Registration />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/property/:id" element={<AuctionDetails />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/property/:id/tender-payment" element={<TenderPayment />} />
        </Route>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
