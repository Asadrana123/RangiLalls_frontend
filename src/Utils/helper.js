export const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    
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
    return new Date(dateStr);
  };

  // Check if auction is currently live
export const isAuctionLive = (auctionDate) => {
  if (!auctionDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsedAuctionDate = parseDate(auctionDate);
  return parsedAuctionDate.getTime() === today.getTime();
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
