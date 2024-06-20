export const Months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const dateFormat = (date: Date, newDate: Date): string => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const diffInDays = Math.round(Math.abs((newDate.getTime() - date.getTime()) / millisecondsPerDay));

  if (isToday(date, newDate)) {
    const isAM = date.getHours() < 12 ? 'AM' : 'PM';
    const hours = date.getHours() % 12 || 12; // Convert 0 hours to 12 AM
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Today ${hours}:${minutes} ${isAM}`;
  } else if (isYesterday(date, newDate)) {
    const isAM = date.getHours() < 12 ? 'AM' : 'PM';
    const hours = date.getHours() % 12 || 12; // Convert 0 hours to 12 AM
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Yesterday ${hours}:${minutes} ${isAM}`;
  } else if (diffInDays <= 7) {
    const dayOfWeek = Days[date.getDay()];
    const isAM = date.getHours() < 12 ? 'AM' : 'PM';
    const hours = date.getHours() % 12 || 12; // Convert 0 hours to 12 AM
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${dayOfWeek} ${hours}:${minutes} ${isAM}`;
  } else {
    return `${Months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
};

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

// Helper function to check if the given date is today
const isToday = (date: Date, newDate: Date): boolean => {
  return isSameDay(date, newDate);
};

// Helper function to check if the given date is yesterday
const isYesterday = (date: Date, newDate: Date): boolean => {
  const yesterday = new Date(newDate);
  yesterday.setDate(newDate.getDate() - 1);
  return isSameDay(date, yesterday);
};

export const formatNumber = (number: number) => {
  if (number === 0) return '0'; // Handle zero case explicitly

  const SI_SYMBOLS = ['', 'k', 'M', 'B', 'T', 'P', 'E'];

  // Calculate tier based on absolute value
  const tier = Math.floor(Math.log10(Math.abs(number)) / 3);

  // Use two decimal places for formatting
  const decimals = 2;

  // Calculate the scaled number based on the tier
  const scale = Math.pow(10, tier * 3);
  const scaledNumber = number / scale;

  // Format the scaled number to two decimal places
  let formattedNumber = scaledNumber.toFixed(decimals);

  // Remove trailing zeros and decimal point if not needed
  formattedNumber = parseFloat(formattedNumber).toString();

  const symbol = SI_SYMBOLS[tier];

  return `${formattedNumber}${symbol}`;
};
