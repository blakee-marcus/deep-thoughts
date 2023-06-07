// function to format a timestamp, accepts the timestamp and an `options` object as parameters
module.exports = (
  timestamp,
  { monthLength = 'short', dateSuffix = true } = {}
) => {
  const now = new Date();
  const dateObj = new Date(timestamp);
  const diffMs = now - dateObj;
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);

  if (diffSeconds < 60) {
    return `${diffSeconds}s`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const formattedMonth = dateObj.toLocaleString('en-US', { month: 'short' });
  const dayOfMonth = dateObj.getDate();
  const year = dateObj.getFullYear();
  let hour =
    dateObj.getHours() > 12
      ? Math.floor(dateObj.getHours() / 2)
      : dateObj.getHours();
  if (hour === 0) {
    hour = 12;
  }
  const minutes = dateObj.getMinutes();
  const periodOfDay = dateObj.getHours() >= 12 ? 'pm' : 'am';

  const currentYear = now.getFullYear();
  if (year === currentYear) {
    return `${formattedMonth} ${dayOfMonth}`;
  }

  const formattedTimeStamp = `${formattedMonth} ${dayOfMonth}, ${year}`;
  return formattedTimeStamp;
};

