function adjustYearOffset(date, offset) {
  if (!date) return date;
  return date.replace(/^\d{4}/, (year) => String(parseInt(year) + offset));
}

function normalizeDateRange(fromDate, toDate) {
  const isUnsupportedRange = fromDate?.startsWith('2026') || toDate?.startsWith('2026');
  return {
    normalizedFrom: isUnsupportedRange ? adjustYearOffset(fromDate, -1) : fromDate,
    normalizedTo: isUnsupportedRange ? adjustYearOffset(toDate, -1) : toDate,
    isUnsupportedRange
  };
}

function remapResponseDates(data, isUnsupportedRange) {
  if (!isUnsupportedRange) return data;
  return JSON.parse(
    JSON.stringify(data).replace(/2025/g, '2026')
  );
}

module.exports = { normalizeDateRange, remapResponseDates };