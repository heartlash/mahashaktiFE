export const convertTimestampToReadableDate = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const options = { weekday: 'long' };
  return date.toLocaleDateString("en-US", options);
};

export const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

export const getFormattedDate = (dateString) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const today = new Date();
  const date = new Date(dateString);

  // Helper function to get day suffix
  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // For 4th to 20th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Check if the date is today
  if (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  ) {
    return "Today";
  }

  // Check if the date is yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (
    yesterday.getFullYear() === date.getFullYear() &&
    yesterday.getMonth() === date.getMonth() &&
    yesterday.getDate() === date.getDate()
  ) {
    return "Yesterday";
  }

  // Check if the date is in the same week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  if (date >= startOfWeek && date <= endOfWeek) {
    return days[date.getDay()];
  }

  // Return formatted date (e.g., 21st April or 21st April 2023 if past year)
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const suffix = getDaySuffix(day);

  if (date.getFullYear() === today.getFullYear()) {
    return `${day}${suffix} ${month}`;
  } else {
    return `${day}${suffix} ${month} ${date.getFullYear()}`;
  }
};


const getDaySuffix = (day) => {
  if (day > 3 && day < 21) return 'th'; // covers 11th - 19th
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};


export const getMonthStartAndEndDate = (month, year) => {
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  // End date is the first day of the next month (December 1 for November input)
  const endDate = new Date(Date.UTC(year, month, 0));


  return {
    startDate: startDate.toISOString().split('T')[0], // Format YYYY-MM-DD
    endDate: endDate.toISOString().split('T')[0]    // Format YYYY-MM-DD
  };
}

export const formatDateToDDMMYYYY = (dateString) => {

  const date = new Date(dateString);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0'); // Pad single digit days with leading zero
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
  const year = date.getFullYear();

  // Format date to dd-mm-yyyy
  return `${day}-${month}-${year}`;
}

export const calculateWeeksPassed = (genesisDate) => {
  // Ensure the input date is a valid Date object
  const start = new Date(genesisDate);

  if (isNaN(start.getTime())) {
    throw new Error("Invalid date provided.");
  }

  const today = new Date();
  const timeDifference = today - start; // Time difference in milliseconds
  const millisecondsInAWeek = 1000 * 60 * 60 * 24 * 7;

  // Calculate and return the number of weeks
  return Math.floor(timeDifference / millisecondsInAWeek);
};
