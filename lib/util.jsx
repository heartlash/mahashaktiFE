export const convertTimestampToReadableDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const options = { weekday: 'long'};
    return date.toLocaleDateString("en-US", options);
};


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
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
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
  
  
  export const getCurrentMonthInfo = () => {
    const today = new Date();
  
    // Get the current year and month
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 0-indexed, so January is 0 and December is 11
  
    const startDate = year + "-" + month + "-" + "01";
    const endDate = new Date(year, month, 0)

  
    return {
      currentMonth: month, // 1-indexed, so January is 1 and December is 12
      startDate,
      endDate,
    };
  };
  