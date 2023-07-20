const parseSeconds = (trackLength) =>
  `${String(Math.floor(trackLength / 60)).padStart(2, '0')}:${String(trackLength % 60).padStart(2, '0')}`;

// Example usage
const trackLengthInSeconds = 600;
const formattedTime = parseSeconds(trackLengthInSeconds);
console.log(`Track length: ${formattedTime}`);