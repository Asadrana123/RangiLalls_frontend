import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import api from "../Utils/axios";
import {
  Timer,
  IndianRupee,
  Users,
  ArrowUpCircle,
  History,
  Building2,
  MapPin,
  AlertCircle,
  Clock,
  ArrowBigUp,
} from "lucide-react";
import { useParams } from "react-router-dom";

// Main component
const LiveAuctionRoom = () => {
  // Redux state
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { properties } = useSelector((state) => state.property);

  // Component state
  const [property, setProperty] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Bidding state
  const [currentBid, setCurrentBid] = useState(0);
  const [currentBidder, setCurrentBidder] = useState(null);
  const [participants, setParticipants] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);

  // Auto-bidding state
  const [isAutoBidding, setIsAutoBidding] = useState(false);
  const [maxAutoBidAmount, setMaxAutoBidAmount] = useState("");
  const [autoBidIncrement, setAutoBidIncrement] = useState(1000);

  const chatContainerRef = useRef(null);

  // Socket initialization function
  const calculateTimeRemaining = () => {
    if (!property) return null;

    const today = new Date();
    const auctionDate = new Date(today);

    // Set auction hours (10 AM to 5 PM)
    const startTime = new Date(today);
    startTime.setHours(12, 0, 0, 0);

    const endTime = new Date(today);
    endTime.setHours(17, 0, 0, 0);
    
    if (today < startTime) {
        const temp= Math.floor((endTime - today) / 1000);
        console.log(temp);
        return temp;
    }

    // If after 5 PM, show 0
    if (today > endTime) {
      return 0;
    }

    // During auction, show remaining time
    return Math.floor((endTime - today) / 1000);
  };
  const initializeSocket = (prop) => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token: localStorage.getItem("token") },
    });

    newSocket.on("connect", () => {
      console.log("Connected to auction server");
      newSocket.emit("join-auction", prop["Auction ID"]);
    });

    newSocket.on("auction-status", (status) => {
      setCurrentBid(status.currentBid || prop["Reserve Price (Rs.)"]);
      setCurrentBidder(status.currentBidder);
      setParticipants(status.participants);
      setBidHistory(status.recentBids || []);
    });

    newSocket.on("bid-update", (update) => {
      setCurrentBid(update.currentBid);
      setCurrentBidder(update.currentBidder);
      setBidHistory((prev) => [update, ...prev].slice(0, 50));
      setError("");

      // Handle auto-bidding
      if (
        isAutoBidding &&
        update.currentBidder?.id !== user._id &&
        update.currentBid + autoBidIncrement <= parseFloat(maxAutoBidAmount)
      ) {
        setTimeout(() => {
          newSocket.emit("place-bid", {
            auctionId: prop["Auction ID"],
            bidAmount: update.currentBid + autoBidIncrement,
          });
        }, 1000);
      }
    });

    newSocket.on("timer-update", setTimeLeft);
    newSocket.on("bid-error", (errorMessage) => {
      setError(errorMessage);
      setIsAutoBidding(false);
    });

    return newSocket;
  };

  // Main initialization effect
  useEffect(() => {
    let currentSocket = null;

    const checkAccess = async () => {
      try {
        if (!id) {
          setError("Property ID is required");
          setLoading(false);
          return;
        }

        const prop = properties.find((p) => p._id === id);
        if (!prop) {
          setError("Property not found");
          setLoading(false);
          return;
        }

        setProperty(prop);

        const response = await api.get(
          `/auction/check-access/${prop["Auction ID"]}`
        );
        if (!response.data.success) {
          setError(response.data.error);
          setHasAccess(false);
        } else {
          setHasAccess(true);
          currentSocket = initializeSocket(prop);
          setSocket(currentSocket);
          setCurrentBid(prop["Reserve Price (Rs.)"]);
        }
      } catch (error) {
        console.error("Access check error:", error);
        setError(error.response.data.error || "Error checking auction access");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();

    // Cleanup function
    return () => {
      if (currentSocket) {
        currentSocket.disconnect();
      }
    };
  }, [id, properties]);
  // Add this useEffect after the main initialization effect
  useEffect(() => {
    let timerInterval;

    if (property) {
      // Initial calculation
      setTimeLeft(calculateTimeRemaining());

      // Update every second
      timerInterval = setInterval(() => {
        const remaining = calculateTimeRemaining();
        setTimeLeft(remaining);

        // Emit timer update to other participants
        if (socket?.connected) {
          socket.emit("auction-timer", {
            auctionId: property["Auction ID"],
            timeLeft: remaining,
          });
        }

        // End auction if time is up
        if (remaining <= 0) {
          clearInterval(timerInterval);
        }
      }, 1000);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [property, socket]);

  // Bid submission handler
  const handleBidSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount <= currentBid) {
      setError(
        `Please enter a valid bid amount higher than ₹${currentBid.toLocaleString()}`
      );
      return;
    }

    if (!socket?.connected) {
      setError("Not connected to auction server");
      return;
    }

    socket.emit("place-bid", {
      auctionId: property["Auction ID"],
      bidAmount: amount,
    });

    setBidAmount("");
  };

  // Auto-bidding toggle handler
  const toggleAutoBidding = () => {
    if (
      !isAutoBidding &&
      (!maxAutoBidAmount || parseFloat(maxAutoBidAmount) <= currentBid)
    ) {
      setError("Please set a valid maximum auto-bid amount");
      return;
    }
    setIsAutoBidding(!isAutoBidding);
    setError("");
  };

  // Time formatter
  const formatTime = (seconds) => {
    if (!seconds) return "--:--:--";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 bg-gray-50 px-6 py-4 rounded-lg">
          Loading
        </div>
      </div>
    );
  }
  // Error state
  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg mt-20">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p>{error || "You do not have access to this auction"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-6 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Property Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <Building2 className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">
                {property["Property Type"]}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {property["Property Location (City)"]}, {property["State"]}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Bidding Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Bid Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Current Highest Bid</p>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-6 h-6 text-primary" />
                    <span className="text-3xl font-bold text-primary">
                      {currentBid?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {timeLeft > 0 ? "Time Remaining" : "Auction Status"}
                  </p>
                  <div className="flex items-center gap-2 text-xl font-mono">
                    <Timer className="w-5 h-5 text-primary" />
                    {timeLeft === null ? (
                      "Loading..."
                    ) : timeLeft === 0 ? (
                      <span className="text-red-500">Auction Ended</span>
                    ) : timeLeft > 5 * 3600 ? (
                      <span className="text-green-500">Starts at 10:00 AM</span>
                    ) : (
                      formatTime(timeLeft)
                    )}
                  </div>
                </div>
              </div>

              {/* Bid Input */}
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder={`Min. bid: ₹${(
                        currentBid + 1000
                      ).toLocaleString()}`}
                      min={currentBid + 1000}
                      step="1000"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={timeLeft <= 0 || timeLeft > 5 * 3600}
                    className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                      timeLeft <= 0 || timeLeft > 7 * 3600
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary-dark transition-colors"
                    }`}
                  >
                    Place Bid
                    <ArrowUpCircle className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                  </div>
                )}
              </form>

              {/* Auto Bidding */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Auto Bidding</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input
                    type="number"
                    value={maxAutoBidAmount}
                    onChange={(e) => setMaxAutoBidAmount(e.target.value)}
                    className="p-2 border rounded-lg"
                    placeholder="Maximum bid amount"
                    disabled={isAutoBidding}
                  />
                  <input
                    type="number"
                    value={autoBidIncrement}
                    onChange={(e) =>
                      setAutoBidIncrement(parseInt(e.target.value))
                    }
                    className="p-2 border rounded-lg"
                    placeholder="Bid increment"
                    min="1000"
                    step="1000"
                    disabled={isAutoBidding}
                  />
                </div>
                <button
                  onClick={toggleAutoBidding}
                  className="w-full p-2 rounded-lg transition-colors bg-primary text-white"
                >
                  {isAutoBidding ? "Stop Auto Bidding" : "Start Auto Bidding"}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Active Participants</h3>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{participants}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Session started at {property["Auction Date"]}</span>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Bid History</h3>
              </div>
              <div
                ref={chatContainerRef}
                className="space-y-3 max-h-[400px] overflow-y-auto"
              >
                {bidHistory.map((bid, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      bid.currentBidder?.id === user._id
                        ? "bg-primary/10"
                        : "bg-gray-50"
                    }`}
                  >
                    <ArrowBigUp
                      className={`w-5 h-5 ${
                        bid.currentBidder?.id === user._id
                          ? "text-primary"
                          : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">
                        ₹{bid.currentBid.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        by {bid.currentBidder?.name}
                      </p>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(bid.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAuctionRoom;
