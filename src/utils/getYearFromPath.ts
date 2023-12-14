export const getYearFromPath = (pathname: string) => {
  const yearRegex = /\b\d{4}\b/;
  const match = pathname.match(yearRegex);
  return match ? parseInt(match[0]) : 0;
};
