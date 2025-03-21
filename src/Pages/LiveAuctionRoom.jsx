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
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);
  const [wasAutoBiddingEnabled, setWasAutoBiddingEnabled] = useState(false);
  const [minAutoBidAmount, setMinAutoBidAmount] = useState(0);
  const [minManualBid, setMinManualBid] = useState(0);
  const socketInitializedRef = useRef(false);
  // Bidding state
  const [currentBid, setCurrentBid] = useState(0);
  const [currentBidder, setCurrentBidder] = useState(null);
  const [participants, setParticipants] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const autoBiddingRef = useRef(false);
  const maxAutoBidAmountRef = useRef("");
  const autoBidIncrementRef = useRef(1000);
  const [isProcessingAutoBid, setIsProcessingAutoBid] = useState(false);
  const lastProcessedBidRef = useRef(null);
  // Auto-bidding state
  const [isAutoBidding, setIsAutoBidding] = useState(false);
  const [maxAutoBidAmount, setMaxAutoBidAmount] = useState("");
  const [autoBidIncrement, setAutoBidIncrement] = useState(1000);
  const chatContainerRef = useRef(null);

  // Socket initialization function
  const calculateTimeRemaining = () => {
    if (!property) return null;

    const now = new Date();

    // Use the property's stored end time if available
    const endTime = property.auctionEndTime
      ? new Date(property.auctionEndTime)
      : new Date(property.auctionDate);

    // If no specific end time is set, default to 5 PM
    if (!property.auctionEndTime) {
      endTime.setHours(17, 0, 0, 0);
    }

    // If auction has ended
    if (now > endTime) {
      return 0;
    }

    // Return remaining seconds
    return Math.floor((endTime - now) / 1000);
  };
  const initializeSocket = (prop) => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token: localStorage.getItem("token") },
    });

    newSocket.on("connect", () => {
      console.log("Connected to auction server");
      newSocket.emit("join-auction", prop._id);
    });
    newSocket.on("min-bid-update", (data) => {
      console.log(currentBid);
      if(data.minManualBid!==0) setMinManualBid(data.minManualBid);
    });
    newSocket.on("auction-extended", (newEndTimeStr) => {
      console.log("Auction extended to:", newEndTimeStr);

      // Update the property object with the new end time
      setProperty((prevProperty) => ({
        ...prevProperty,
        auctionEndTime: newEndTimeStr,
        auctionExtensionCount: (prevProperty.auctionExtensionCount || 0) + 1,
      }));
    });
    newSocket.on("auction-status", (status) => {
      console.log(currentBid, status.currentBid);
      setCurrentBid(status.currentBid || prop.reservePrice);
      setCurrentBidder(status.currentBidder);
      setParticipants(status.participants);
      setBidHistory(status.recentBids || []);
    });
    newSocket.on("participant-update", (status) => {
      setParticipants(status.count);
    });
    newSocket.on("bid-update", (update) => {
      console.log("Received bid update:", update);
      setCurrentBid(update.currentBid);
      setCurrentBidder(update.currentBidder);
      
      // Update bid history if this is a new bid
      setBidHistory((prev) => {
        const exists = prev.some(
          (bid) =>
            bid.timestamp === update.timestamp &&
            bid.currentBid === update.currentBid &&
            bid.currentBidder?.id === update.currentBidder?.id
        );
        return exists ? prev : [update, ...prev].slice(0, 50);
      });
      
      setError("");
      
      // Prevent duplicate auto-bids by checking if we've already processed this bid
      const bidSignature = `${update.currentBid}-${update.timestamp}`;
      if (lastProcessedBidRef.current === bidSignature) {
        console.log("Already processed this bid, skipping auto-bid check");
        return;
      }
      
      // Check if we should trigger an auto-bid
      if (
        autoBiddingRef.current &&                                  // Auto-bidding is enabled
        !isProcessingAutoBid &&                                    // Not already processing an auto-bid
        update.currentBidder?.id !== user._id &&                   // Bid is not from current user
        update.currentBid + autoBidIncrementRef.current <=         // Next bid won't exceed maximum
          parseFloat(maxAutoBidAmountRef.current)
      ) {
        console.log("Auto-bid conditions met, preparing to place auto-bid");
        
        // Mark that we're processing an auto-bid and record this bid
        setIsProcessingAutoBid(true);
        lastProcessedBidRef.current = bidSignature;
        
        // Calculate the next bid amount
        const nextBidAmount = update.currentBid + autoBidIncrementRef.current;
        
        // Use setTimeout to delay the auto-bid
        setTimeout(() => {
          console.log("Placing auto-bid:", nextBidAmount);
          newSocket.emit("place-bid", {
            auctionId: prop?._id,
            bidAmount: nextBidAmount,
            isAutoBid: true
          });
          
          // Reset the processing flag after a short delay
          // This prevents multiple auto-bids from being triggered in quick succession
          setTimeout(() => {
            setIsProcessingAutoBid(false);
          }, 1000);
        }, 3000);
      } else {
        console.log(
          "Auto-bidding not triggered because:",
          !autoBiddingRef.current
            ? "auto-bidding is off"
            : isProcessingAutoBid
            ? "already processing an auto-bid"
            : update.currentBidder?.id === user._id
            ? "bid is from current user"
            : "next bid would exceed maximum"
        );
      }
    });;

    //newSocket.on("timer-update", setTimeLeft);
    newSocket.on("bid-error", (errorMessage) => {
      setError(errorMessage);
      console.log(errorMessage);
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
  
        const response = await api.get(`/auction/check-access/${prop._id}`);
        if (!response.data.success) {
          setError(response.data.error);
          setHasAccess(false);
        } else {
          setHasAccess(true);
          
          // Only initialize socket if it hasn't been initialized yet
          if (!socketInitializedRef.current) {
            console.log("Initializing socket connection");
            currentSocket = initializeSocket(prop);
            setSocket(currentSocket);
            socketInitializedRef.current = true;
          }
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
        console.log("Disconnecting socket");
        currentSocket.disconnect();
        socketInitializedRef.current = false;
      }
    };
  }, [id, properties]);
  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        if (!property) return;

        // Fetch current auto-bid info
        const response = await api.get(`/auto-bidding/info/${property._id}`);

        if (response.data.success) {
          // Set minimum auto-bid amount for new auto-bids - must be higher than highest auto-bid
          setMinAutoBidAmount(response.data.minAutoBidAmount);
          // Set minimum manual bid amount based on second highest auto-bid + 1
          // This is already calculated properly on the backend in the minManualBid property
          const minimumManualBid = Math.max(
            response.data.minManualBid, // Second highest auto-bid + 1
            currentBid + 1000 // Or at least 1000 more than current bid
          );
          setMinManualBid(minimumManualBid);
        }
      } catch (error) {
        console.error("Error fetching auction data:", error);
      }
    };

    fetchAuctionData();
  }, [property, currentBid]);
  useEffect(() => {
    const fetchAutoBiddingSettings = async () => {
      try {
        if (!property) return;

        const response = await api.get(
          `/auto-bidding/settings/${property._id}`
        );

        if (response.data.success && response.data.data) {
          const settings = response.data.data;

          if (settings.enabled) {
            setIsAutoBidding(true);
            // If auto-bidding is enabled, mark it as "used" for this session
            setWasAutoBiddingEnabled(true);
            autoBiddingRef.current = true;
            maxAutoBidAmountRef.current = settings.maxAmount.toString();
            autoBidIncrementRef.current = settings.increment;
            setMaxAutoBidAmount(settings.maxAmount.toString());
            setAutoBidIncrement(settings.increment);
          }
        }
      } catch (error) {
        console.error("Error fetching auto-bidding settings:", error);
      }
    };

    fetchAutoBiddingSettings();
  }, [property]);
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
            auctionId: property._id,
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
      auctionId: property._id,
      bidAmount: amount,
    });

    setBidAmount("");
  };

  // Auto-bidding toggle handler
  const toggleAutoBidding = async () => {
    try {
      // Validation checks
      if (!isAutoBidding) {
        const maxAmount = parseFloat(maxAutoBidAmount);
        console.log(currentBid);
        if (isNaN(maxAmount) || maxAmount <= currentBid) {
          setError(
            "Please enter a maximum bid amount higher than the current bid"
          );
          return;
        }
        // Check against minimum required auto-bid amount
        if (minAutoBidAmount > 0 && maxAmount < minAutoBidAmount) {
          setError("AutoBid limit reached, Please entered different amount");
          return;
        }
        // About to enable auto-bidding, so mark it as used
        setWasAutoBiddingEnabled(true);
      }

      // Can't turn off auto-bidding once enabled
      if (isAutoBidding) {
        setError("Auto-bidding cannot be disabled once activated");
        return;
      }

      // If we're here, we're enabling auto-bidding for the first time
      const response = await api.post("/auto-bidding/settings", {
        auctionId: property._id,
        enabled: true,
        maxAmount: parseFloat(maxAutoBidAmount),
        increment: parseInt(autoBidIncrement),
      });

      if (response.data.success) {
        // Only update UI if save was successful
        setIsAutoBidding(true);
        setError("");
        console.log("Auto-bidding settings saved:", response.data.data);
        autoBiddingRef.current = true;
      }
    } catch (error) {
      console.error("Failed to save auto-bidding settings:", error);
      setError(
        error.response?.data?.error || "Failed to save auto-bidding settings"
      );
    }
  };

  const handleMaxAmountChange = (e) => {
    const value = e.target.value;
    setMaxAutoBidAmount(value);
    maxAutoBidAmountRef.current = value;
  };

  const handleIncrementChange = (e) => {
    const value = parseInt(e.target.value);
    setAutoBidIncrement(value);
    autoBidIncrementRef.current = value;
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
                {property.propertyType || "Untitled Property"}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {property.propertyLocation}, {property.state}
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
                  <div className="flex justify-end items-center gap-2 text-xl font-mono">
                    <Timer className="w-5 h-5 text-primary" />
                    {timeLeft === null ? (
                      "Loading..."
                    ) : timeLeft === 0 ? (
                      <span className="text-red-500">Auction Ended</span>
                    ) : timeLeft > 7 * 3600 ? (
                      <span className="text-green-500">Starts at 10:00 AM</span>
                    ) : (
                      formatTime(timeLeft)
                    )}
                  </div>
                  {/* {property.auctionExtensionCount > 0 && (
                    <div className="mt-2 flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
                      <span className="text-sm text-yellow-600">
                        Extended {property.auctionExtensionCount}{" "}
                        {property.auctionExtensionCount === 1
                          ? "time"
                          : "times"}
                        <span className="ml-1 text-xs text-gray-500">
                          (Ends:{" "}
                          {new Date(property.auctionEndTime).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                          )
                        </span>
                      </span>
                    </div>
                  )} */}
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
                      placeholder={
                        minManualBid > 0
                          ? `Min. bid: ₹${minManualBid.toLocaleString()}`
                          : `Min. bid: ₹${(currentBid + 1000).toLocaleString()}`
                      }
                      min={minManualBid > 0 ? minManualBid : currentBid + 1000}
                      step="1000"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={timeLeft <= 0 || timeLeft > 7 * 3600}
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

                {error &&
                  error.includes(
                    "Please enter a valid bid amount higher than"
                  ) && (
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
                    onChange={handleMaxAmountChange}
                    className="p-2 border rounded-lg"
                    placeholder="Maximum bid amount"
                    disabled={isAutoBidding || wasAutoBiddingEnabled}
                  />
                  <input
                    type="number"
                    value={autoBidIncrement}
                    onChange={handleIncrementChange}
                    className="p-2 border rounded-lg"
                    placeholder="Bid increment"
                    min="1000"
                    step="1000"
                    disabled={isAutoBidding || wasAutoBiddingEnabled}
                  />
                </div>
                {isAutoBidding && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 text-green-700 mb-3">
                    Auto-bidding is active and cannot be disabled
                  </div>
                )}
                <button
                  onClick={toggleAutoBidding}
                  disabled={
                    timeLeft <= 0 ||
                    timeLeft > 7 * 3600 ||
                    isAutoBidding ||
                    wasAutoBiddingEnabled
                  }
                  className={`w-full p-2 rounded-lg transition-color ${
                    timeLeft <= 0 ||
                    timeLeft > 7 * 3600 ||
                    isAutoBidding ||
                    wasAutoBiddingEnabled
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary-dark transition-colors"
                  }`}
                >
                  Start Auto Bidding
                </button>
                {wasAutoBiddingEnabled && !isAutoBidding && (
                  <div className="mt-2 text-xs text-red-500">
                    Auto-bidding has already been used for this auction
                  </div>
                )}
              </div>
              {error && error.includes("Please enter a maximum bid amount") && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              )}
              {error && error.includes("AutoBid limit reached") && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              )}
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
                <span>
                  Session started at{" "}
                  {new Date(property.auctionDate).toLocaleDateString()}
                </span>
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
                        by{" "}
                        {bid.currentBidder?.id === user._id
                          ? "You"
                          : "Other bidder"}
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
