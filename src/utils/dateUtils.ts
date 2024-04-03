export const parseDate = (date: Date | string | null, separator?: string) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const day = dateObj.toLocaleDateString('sr-latn-SR', {day: '2-digit'});
  const month = dateObj.toLocaleDateString('sr-latn-SR', {month: '2-digit'});
  const year = dateObj.toLocaleDateString('sr-latn-SR', {year: 'numeric'}).replace('.', '');

  if (separator) return `${day}${separator}${month}${separator}${year}`;
  return `${day}/${month}/${year}`;
};

export const parseDateForBackend = (date: Date | null) => {
  if (!date) return null;

  const pickedDate = new Date(date);
  pickedDate.setMinutes(pickedDate.getMinutes() - pickedDate.getTimezoneOffset());

  return pickedDate.toISOString();
};
