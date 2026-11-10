import assert from 'node:assert';
import { parseGTFSTime, formatTime, computeHeadways, getNextDepartures } from './src/index.mjs';

assert.strictEqual(parseGTFSTime('08:30:00'), 510);
assert.strictEqual(parseGTFSTime('25:15:00'), 1515);
assert.strictEqual(formatTime(510), '8:30am');
assert.strictEqual(formatTime(1515), '1:15am');

const departures = [480, 495, 510, 525, 540]; // Every 15 minutes from 8:00am to 9:00am
const stats = computeHeadways(departures);
assert.strictEqual(stats.medianHeadwayMinutes, 15);
assert.strictEqual(stats.count, 5);

const next = getNextDepartures(departures, 500, 2);
assert.strictEqual(next.length, 2);
assert.strictEqual(next[0].time, '8:30am');
assert.strictEqual(next[0].minutesUntil, 10);

console.log('✓ All GTFS pipeline unit tests passed successfully');
