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

export const Days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun"
]

export const dateFormat = (date: Date, newDate: Date) => {
  let newDateFormat
  if (newDate.getFullYear() !== date.getFullYear()) newDateFormat = `${Months[date.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
  else if (newDate.getMonth() !== date.getMonth()) newDateFormat = `${Months[date.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
  else if (newDate.getDay() - date.getDay() > 7) newDateFormat = `${Months[date.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
  else {
    const isAm = date.getHours() < 12 ? "AM" : "PM";
    newDateFormat = `${Days[date.getDay()]} ${isAm === "AM" ? date.getHours() : date.getHours() - 12}:${date.getMinutes()} ${isAm}`;
  }
  return newDateFormat
}