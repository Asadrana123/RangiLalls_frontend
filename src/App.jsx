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
// Import new User Dashboard components
import UserDashboard from "./Pages/UserDashboard";
import ProfileSettings from "./Pages/ProfileSettings";
import InterestedProperties from "./Pages/InterestedProperties";
import BiddingHistory from "./Pages/BiddingHistory";

// Import policy pages
import Feedback from "./Pages/Feedback";
import Disclaimer from "./Pages/Disclaimer";
import TermsOfUse from "./Pages/TermsOfUse";
import WebsiteAccessibility from "./Pages/WebsiteAccessibility";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import HyperLinkPolicy from "./Pages/HyperLinkPolicy";
import CopyrightPolicy from "./Pages/CopyrightPolicy";
import ArchivalPolicy from "./Pages/ArchivalPolicy";
import WebsiteSecurityPolicy from "./Pages/WebsiteSecurityPolicy";
import WebsiteMonitoringPolicy from "./Pages/WebsiteMonitoringPolicy";
import ContentReviewPolicy from "./Pages/ContentReviewPolicy";
import WebsiteContingencyManagementPolicy from "./Pages/WebsiteContingencyManagementPolicy";
import ContentContributionPolicy from "./Pages/ContentContributionPolicy";

function App() {
  const dispatch = useDispatch();
  const propertyLoading = useSelector((state) => state.property.loading);
  const userLoading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  if (propertyLoading || userLoading) {
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
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            {/* Policy Pages */}
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/website-accessibility" element={<WebsiteAccessibility />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/hyperlinking-policy" element={<HyperLinkPolicy />} />
            <Route path="/copyright-policy" element={<CopyrightPolicy />} />
            <Route path="/content-archival-policy" element={<ArchivalPolicy />} />
            <Route path="/website-security-policy" element={<WebsiteSecurityPolicy />} />
            <Route path="/website-monitoring-policy" element={<WebsiteMonitoringPolicy />} />
            <Route path="/content-review-policy" element={<ContentReviewPolicy />} />
            <Route path="/website-contingency-management-policy" element={<WebsiteContingencyManagementPolicy />} />
            <Route path="/content-map" element={<ContentContributionPolicy />} />
            
            <Route element={<PrivateAdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/property/:id/tender-payment" element={<TenderPayment />} />
              <Route path="/property/:id/auction-registration" element={<AuctionRegistration />} />
              <Route path="/property/:id/live-auction" element={<LiveAuctionRoom />} />
              {/* New User Dashboard Routes */}
              <Route path="/dashboard" element={<UserDashboard />}>
                <Route index element={<ProfileSettings />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="interested-properties" element={<InterestedProperties />} />
                <Route path="bidding-history" element={<BiddingHistory />} />
              </Route>
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;