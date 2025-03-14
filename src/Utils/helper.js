export const parseDate = (dateStr) => {
  if (!dateStr) return new Date();
  
  // If it's already an ISO date string (contains 'T' and 'Z')
  if (dateStr.includes('T') && dateStr.includes('Z')) {
    return new Date(dateStr);
  }
  
  // For DD-MMM-YY format
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const monthNames = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      
      const day = parseInt(parts[0], 10);
      const month = monthNames[parts[1]];
      let year = parseInt(parts[2], 10);
      year = year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year;
      
      return new Date(year, month, day);
    }
  }
  
  // Fallback to standard Date parsing
  return new Date(dateStr);
};

  // Check if auction is currently live
  export const isAuctionLive = (auctionDate) => {
    if (!auctionDate) return false;
    
    const today = new Date();
    const parsedAuctionDate = parseDate(auctionDate);
    
    // Compare only year, month, and day
    return (
      parsedAuctionDate.getFullYear() === today.getFullYear() &&
      parsedAuctionDate.getMonth() === today.getMonth() &&
      parsedAuctionDate.getDate() === today.getDate()
    );
  };

// Check if registration is still open
export const isRegistrationOpen = (emdDate, auctionDate) => {
  if (!emdDate || !auctionDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsedEMDDate = parseDate(emdDate);
  const parsedAuctionDate = parseDate(auctionDate);
  return parsedEMDDate >= today && parsedAuctionDate > today;
};

export const getTimeRemaining = (endDate) => {
    if (!endDate) return 0;
    
    const parsedEndDate = parseDate(endDate);
    const total = parsedEndDate - Date.now();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };
