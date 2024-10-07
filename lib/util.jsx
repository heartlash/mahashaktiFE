export const convertTimestampToReadableDate = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const options = { weekday: 'long' };
  return date.toLocaleDateString("en-US", options);
};

export const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

export const getFormattedDate = (dateString) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateString);
  const today = new Date();

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

  // Return formatted date (e.g., 21st April)
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const suffix = getDaySuffix(day);

  return `${day}${suffix} ${month}`;
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
  // Ensure month is zero-indexed for JavaScript Date object
  const startDate = new Date(year, month - 1, 1);
  // Calculate the end date by setting the date to the first day of the next month and subtracting one day
  const endDate = new Date(year, month, 0);


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
