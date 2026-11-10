/**
 * GTFS Timetable Pipeline
 * Core algorithms for parsing schedules, computing headways, and formatting stop departures.
 *
 * Live deployments:
 * - Headway: https://headway.shivrajsinh.in (Australia & Phoenix transit schedules)
 * - Stopwatch: https://transit.shivrajsinh.in (120+ transit networks across 6 countries)
 */

/**
 * Converts GTFS seconds after midnight or "HH:MM:SS" into minutes since midnight.
 * Handles trips crossing midnight (e.g., 25:30:00 -> 1530).
 */
export function parseGTFSTime(timeStr) {
  if (typeof timeStr === 'number') return Math.floor(timeStr / 60);
  const parts = timeStr.trim().split(':').map(Number);
  if (parts.length < 2) return null;
  return parts[0] * 60 + parts[1] + (parts[2] ? Math.round(parts[2] / 60) : 0);
}

/**
 * Formats minutes since midnight into 12-hour or 24-hour time display.
 */
export function formatTime(minutes, is24Hour = false) {
  const norm = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  const mm = m.toString().padStart(2, '0');
  if (is24Hour) {
    return `${h.toString().padStart(2, '0')}:${mm}`;
  }
  const period = h >= 12 ? 'pm' : 'am';
  const displayH = h % 12 || 12;
  return `${displayH}:${mm}${period}`;
}

/**
 * Computes typical headway (interval between departures) across peak and off-peak periods.
 * @param {number[]} departureMinutes - Sorted array of departure minutes throughout the day.
 * @returns {object} Summary including median headway, min headway, first and last trip.
 */
export function computeHeadways(departureMinutes) {
  if (!departureMinutes || departureMinutes.length === 0) {
    return { count: 0, firstTrip: null, lastTrip: null, medianHeadway: null, minHeadway: null };
  }

  const sorted = [...departureMinutes].sort((a, b) => a - b);
  const intervals = [];
  for (let i = 1; i < sorted.length; i++) {
    const diff = sorted[i] - sorted[i - 1];
    if (diff > 0 && diff <= 120) { // filter out overnight gaps
      intervals.push(diff);
    }
  }

  intervals.sort((a, b) => a - b);
  const medianHeadway = intervals.length > 0 
    ? intervals[Math.floor(intervals.length / 2)] 
    : null;
  const minHeadway = intervals.length > 0 ? intervals[0] : null;

  return {
    count: sorted.length,
    firstTrip: formatTime(sorted[0]),
    lastTrip: formatTime(sorted[sorted.length - 1]),
    medianHeadwayMinutes: medianHeadway,
    minHeadwayMinutes: minHeadway
  };
}

/**
 * Finds the upcoming departures relative to a target time.
 */
export function getNextDepartures(departureMinutes, currentMinute, limit = 5) {
  const future = departureMinutes
    .filter(m => m >= currentMinute)
    .sort((a, b) => a - b)
    .slice(0, limit);

  return future.map(m => ({
    time: formatTime(m),
    minutesUntil: m - currentMinute
  }));
}
