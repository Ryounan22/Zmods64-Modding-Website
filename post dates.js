function timeAgo(dateString) {
  const now = new Date();
  // Parse YYYY-MM-DD into a Date
  const [year, month, day] = dateString.split("-").map(Number);
  const postDate = new Date(year, month - 1, day); // JS months are 0-based
  const seconds = Math.floor((now - postDate) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return count === 1 ? `${count} ${interval.label} ago` : `${count} ${interval.label}s ago`;
    }
  }
  return "just now";
}

document.addEventListener("DOMContentLoaded", () => {
  const postDateElement = document.getElementById("post-date");
  if (postDateElement && postDateElement.dataset.date) {
    const dateString = postDateElement.dataset.date;
    postDateElement.textContent = "Posted " + timeAgo(dateString);
  }
});
