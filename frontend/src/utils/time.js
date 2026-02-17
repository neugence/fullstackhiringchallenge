/**
 * Format a date string into human-readable relative time
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted relative time (e.g., "Just now", "2m ago", "Yesterday")
 */
export function formatRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;

  // For older dates, show formatted date
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Format save status timestamp
 * @param {Date|string} timestamp - Date object or ISO string
 * @returns {string} Formatted time (e.g., "just now", "5s ago", "2m ago")
 */
export function formatSaveTime(timestamp) {
  const savedTime = new Date(timestamp);
  const now = new Date();
  const diffMs = now - savedTime;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  
  if (diffSecs < 10) return 'just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  
  return savedTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });
}
