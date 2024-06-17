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

export const dateFormat = (date: Date, newDate: Date) => {
  let newDateFormat;
  if (newDate.getFullYear() !== date.getFullYear())
    newDateFormat = `${
      Months[date.getMonth()]
    } ${newDate.getDate()}, ${newDate.getFullYear()}`;
  else if (newDate.getMonth() !== date.getMonth())
    newDateFormat = `${
      Months[date.getMonth()]
    } ${newDate.getDate()}, ${newDate.getFullYear()}`;
  else if (newDate.getDay() - date.getDay() > 7)
    newDateFormat = `${
      Months[date.getMonth()]
    } ${newDate.getDate()}, ${newDate.getFullYear()}`;
  else {
    const isAm = date.getHours() < 12 ? 'AM' : 'PM';
    newDateFormat = `${Days[date.getDay()]} ${
      isAm === 'AM' ? date.getHours() : date.getHours() - 12
    }:${date.getMinutes()} ${isAm}`;
  }
  return newDateFormat;
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
