export const formatDateToDDMMMYY = (dateInput) => {
  const date = new Date(dateInput);
  const day = String(date.getDate()).padStart(2, '0');

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];

  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits

  return `${day}-${month}-${year}`;
};


  // Check if auction is currently live
  export const isAuctionLive = (auctionDate) => {
    if (!auctionDate) return false;
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const auction = new Date(auctionDate);
    auction.setHours(0, 0, 0, 0);
  
    return auction.getTime() === today.getTime();
  };

// Check if registration is still open
export const isRegistrationOpen = (emdDate, auctionDate) => {
  if (!emdDate || !auctionDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const emd = new Date(emdDate);
  emd.setHours(0, 0, 0, 0);

  const auction = new Date(auctionDate);
  auction.setHours(0, 0, 0, 0);

  return emd >= today && auction > today;
};

export const getTimeRemaining = (endDate) => {
  if (!endDate) return 0;

  const end = new Date(endDate);
  const now = new Date();

  const diff = end - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return days > 0 ? days : 0;
};
