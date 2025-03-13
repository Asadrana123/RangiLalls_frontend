import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  Timer,
  IndianRupee,
  Users,
  ArrowUpCircle,
  History,
  Building2,
  MapPin,
  AlertCircle,
  ChevronLeft,
  ArrowBigUp,
  Clock
} from 'lucide-react';

const LiveAuctionRoom = ({ property }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [currentBid, setCurrentBid] = useState(property["Reserve Price (Rs.)"]);
  const [currentBidder, setCurrentBidder] = useState(null);
  const [participants, setParticipants] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState('');
  const [bidHistory, setBidHistory] = useState([]);
  const [isAutoBidding, setIsAutoBidding] = useState(false);
  const [maxAutoBidAmount, setMaxAutoBidAmount] = useState('');
  const [autoBidIncrement, setAutoBidIncrement] = useState(1000);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(`${process.env.VITE_BACKEND_URL}/api`, {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to auction server');
      newSocket.emit('join-auction', property["Auction ID"]);
    });

    newSocket.on('auction-status', (status) => {
      setCurrentBid(status.currentBid);
      setCurrentBidder(status.currentBidder);
      setParticipants(status.participants);
      setBidHistory(status.recentBids || []);
    });

    newSocket.on('bid-update', (update) => {
      setCurrentBid(update.currentBid);
      setCurrentBidder(update.currentBidder);
      setBidHistory(prev => [update, ...prev].slice(0, 50));
      setError('');

      // Auto-bidding logic
      if (isAutoBidding && 
          update.currentBidder?.id !== user._id && 
          update.currentBid + autoBidIncrement <= parseFloat(maxAutoBidAmount)) {
        setTimeout(() => {
          newSocket.emit('place-bid', {
            auctionId: property["Auction ID"],
            bidAmount: update.currentBid + autoBidIncrement
          });
        }, 1000);
      }
    });

    newSocket.on('timer-update', (time) => {
      setTimeLeft(time);
    });

    newSocket.on('bid-error', (errorMessage) => {
      setError(errorMessage);
      setIsAutoBidding(false);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.close();
    };
  }, [token, property]);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount <= currentBid) {
      setError('Please enter a valid bid amount higher than the current bid');
      return;
    }

    socket.emit('place-bid', {
      auctionId: property["Auction ID"],
      bidAmount: amount
    });

    setBidAmount('');
  };

  const toggleAutoBidding = () => {
    if (!isAutoBidding && (!maxAutoBidAmount || parseFloat(maxAutoBidAmount) <= currentBid)) {
      setError('Please set a valid maximum auto-bid amount');
      return;
    }
    setIsAutoBidding(!isAutoBidding);
    setError('');
  };

  const formatTime = (seconds) => {
    if (!seconds) return '--:--:--';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-50 pt-6">
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
                <span>{property["Property Location (City)"]}, {property["State"]}</span>
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
                  <p className="text-sm text-gray-500">Time Remaining</p>
                  <div className="flex items-center gap-2 text-xl font-mono">
                    <Timer className="w-5 h-5 text-primary" />
                    {formatTime(timeLeft)}
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
                      placeholder={`Min. bid: ₹${(currentBid + 1000).toLocaleString()}`}
                      min={currentBid + 1000}
                      step="1000"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
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
                    onChange={(e) => setAutoBidIncrement(parseInt(e.target.value))}
                    className="p-2 border rounded-lg"
                    placeholder="Bid increment"
                    min="1000"
                    step="1000"
                    disabled={isAutoBidding}
                  />
                </div>
                <button
                  onClick={toggleAutoBidding}
                  className={`w-full p-2 rounded-lg transition-colors ${
                    isAutoBidding
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isAutoBidding ? 'Stop Auto Bidding' : 'Start Auto Bidding'}
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
                        ? 'bg-primary/10'
                        : 'bg-gray-50'
                    }`}
                  >
                    <ArrowBigUp className={`w-5 h-5 ${
                      bid.currentBidder?.id === user._id
                        ? 'text-primary'
                        : 'text-gray-500'
                    }`} />
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