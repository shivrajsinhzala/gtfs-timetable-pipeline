# GTFS Timetable Pipeline

A lightweight, zero-dependency Node.js engine for parsing GTFS (General Transit Feed Specification) data, computing vehicle headways, and generating static timetable schedules.

Used in production to generate static schedules and live departure boards for:
* **[Headway](https://headway.shivrajsinh.in)** — Public transit timetables, stop departure boards, and frequency analysis for Australia and Phoenix.
* **[Stopwatch](https://transit.shivrajsinh.in)** — Static timetables and transit departure boards covering 120+ networks and 290,000+ stops worldwide.

---

## Key Features

1. **Midnight-Crossing Time Normalisation**: Correctly parses 24h+ GTFS times (e.g. `25:30:00` for 1:30 AM next day) into clean chronological minutes.
2. **Frequency & Headway Estimation**: Automatically calculates median headway, minimum rush-hour intervals, and service spans without expensive database indexing.
3. **Stop Departure Boards**: Filters and formats next upcoming departures for any stop code with instant client-side execution.
4. **Static Site Integration**: Designed for static site generators like [Astro](https://astro.build) to pre-render hundreds of thousands of route and stop pages with zero runtime server latency.

---

## Live Deployments & Showcase

* **Live Australian & Phoenix Schedules**: [https://headway.shivrajsinh.in](https://headway.shivrajsinh.in)
* **Global Open GTFS Timetables**: [https://transit.shivrajsinh.in](https://transit.shivrajsinh.in)

---

## Quick Start

```javascript
import { parseGTFSTime, computeHeadways, getNextDepartures } from 'gtfs-timetable-pipeline';

// Parse arrival/departure times
const departureMinutes = parseGTFSTime('07:45:00'); // 465

// Compute frequency statistics across a route's daily trips
const trips = [420, 435, 450, 465, 480, 500, 520];
const metrics = computeHeadways(trips);
console.log(metrics);
// {
//   count: 7,
//   firstTrip: '7:00am',
//   lastTrip: '8:40am',
//   medianHeadwayMinutes: 15,
//   minHeadwayMinutes: 15
// }

// Client-side next departures
const next = getNextDepartures(trips, 460, 2);
console.log(next);
// [ { time: '7:45am', minutesUntil: 5 }, { time: '8:00am', minutesUntil: 20 } ]
```

---

## How It Works in Production

At [Headway](https://headway.shivrajsinh.in) and [Stopwatch](https://transit.shivrajsinh.in), weekly automated jobs download official GTFS archives from transit agency portals and the Mobility Database. 

The pipeline:
1. Decompresses `calendar.txt`, `calendar_dates.txt`, `routes.txt`, `trips.txt`, `stop_times.txt`, and `stops.txt`.
2. Identifies the primary operational patterns (Monday–Friday common trips, Saturday, Sunday) over the next 4 weeks.
3. Groups trips by direction and timepoint stops (up to 7 major stops per timetable table).
4. Generates static JSON shards ingested by Astro to produce lightweight HTML pages.

---

## License

MIT © [Shivrajsinh Zala](https://github.com/shivrajsinhzala)
