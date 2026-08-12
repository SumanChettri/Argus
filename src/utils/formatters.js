export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return [hrs, mins, secs]
    .map(v => (v < 10 ? '0' + v : v))
    .join(':');
}

export function formatCoordinates(lat, lng, precision = 4) {
  if (lat === undefined || lng === undefined || lat === null || lng === null) {
    return 'N/A';
  }
  const latStr = Math.abs(lat).toFixed(precision) + '° ' + (lat >= 0 ? 'N' : 'S');
  const lngStr = Math.abs(lng).toFixed(precision) + '° ' + (lng >= 0 ? 'E' : 'W');
  return `${latStr}, ${lngStr}`;
}

export function formatTimeOnly(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
