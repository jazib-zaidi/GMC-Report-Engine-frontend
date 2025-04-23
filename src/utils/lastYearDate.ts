export function getLastYearDateRange({ startDate, endDate }) {
  const getLastYearDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  };

  return {
    startDate: getLastYearDate(startDate),
    endDate: getLastYearDate(endDate),
  };
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
