# Wildfire Tracker — Project Context

A React app that plots active wildfires worldwide on an interactive map, using NASA
satellite fire-detection data. Purpose: show people where fires are burning near-real-time
so they can avoid those areas.

Owner: Matheus. Repo: https://github.com/matheus223ou/wildfire-tracker

---

## Run it

```bash
npm install
npm start          # http://localhost:3000
```

No API keys, no `.env` values needed. The `.env` file in the repo is empty.

---

## Stack

| Piece | Choice | Why |
|---|---|---|
| Map rendering | Leaflet via `react-leaflet` v4 | Google Maps JS API requires a billing account; Leaflet is free |
| Map tiles | OpenStreetMap | Free, no API key |
| Data | NASA FIRMS (VIIRS NOAA-20, 24h global CSV) | Global coverage, ~3h latency |
| Clustering | `react-leaflet-cluster` **3.1.1** (pinned) | v4+ requires React 19; this project is React 18.3.1 |
| Framework | Create React App (`react-scripts` 5.0.1) | — |

**Do not upgrade `react-leaflet-cluster` past 3.1.1** without also upgrading React to 19.
That was a real peer-dependency conflict, resolved deliberately by pinning.

---

## Architecture / data flow

```
browser → /api/firms (our own server) → NASA FIRMS → back → browser
```

The browser never calls NASA directly. **NASA FIRMS does not send an
`Access-Control-Allow-Origin` header**, so a direct browser `fetch()` is blocked by CORS
(confirmed empirically: real headless-browser fetch returns `Failed to fetch`, while
PowerShell/server-side fetch of the same URL succeeds — CORS is browser-only).

The proxy exists in two forms, both answering the same path `/api/firms`, so frontend
code never changes between environments:

- `src/setupProxy.js` — **local dev only.** CRA auto-loads this file on `npm start`.
  Uses `http-proxy-middleware` (ships with react-scripts, no install needed).
  **This is the one actually doing the work today**, since the app isn't deployed.
- `api/firms.js` — **production.** Vercel-style serverless function. Dormant until deployed.

Upstream URL (identical in both files):
```
https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_Global_24h.csv
```

---

## Files

```
api/firms.js                       serverless proxy (production, dormant)
src/setupProxy.js                  dev proxy (active locally)
src/App.js                         fetch + CSV parse + confidence filter
src/components/Map.js              MapContainer, clustering, click state
src/components/LocationMarker.js   one fire = a 10px divIcon dot
src/components/LocationInfoBox.js  floating detail panel
src/index.css                      header, .map, .fire-marker, .location-info
```

---

## The data (FIRMS CSV)

Columns: `latitude, longitude, bright_ti4, scan, track, acq_date, acq_time, satellite,
confidence, version, bright_ti5, frp, daynight`

- `acq_date` + `acq_time` are **separate fields**, time is 4-digit UTC (`0035`, `2350`).
- `confidence` = `low` | `nominal` | `high` — **detection certainty, NOT fire severity.**
  We filter out only `low` (likely false positives: sun glint, cloud edges). Keeping only
  `high` would discard real fires, since a big fire obscured by smoke often reads `nominal`.
- `frp` = Fire Radiative Power in MW — **this** is the intensity/severity measure.
- Volume: ~99k–117k rows per 24h window, globally, from this one satellite.
- "24h" in the filename = size of the rolling history window, **not** the delay.
  Actual latency measured at **~3.4–3.7 hours** (satellite pass → available in feed).

---

## Known gaps / next steps

1. **No error handling** on the fetch. If the proxy or NASA fails, the app hangs on
   "Fetching Data..." forever. Needs try/catch + a user-facing error state.
2. **No CSV schema validation.** `parseCSV` trusts the header row. If NASA renames a
   column, it breaks silently.
3. **~24s initial load** — fetching + parsing the full ~10MB CSV client-side. Better:
   filter/aggregate inside the proxy and send the browser a smaller payload.
4. **No caching.** Source data updates only a few times a day; refetching the full feed
   on every page load is wasteful. Proxy-side cache of 30–60min would help.
5. **No tests.**
6. **Unused deps**: `@iconify/icons-mdi`, `@iconify/react` are still in package.json but
   nothing imports them anymore (the flame icon was replaced by a CSS dot).
7. **Not deployed.** `api/firms.js` is ready for Vercel but no deployment exists yet.

---

## History (why the code looks like this)

Chronological, because several decisions only make sense as reactions to a bug:

1. **Google Maps React → Leaflet.** Billing requirement.
2. **EONET era.** Used `eonet.gsfc.nasa.gov/api/v2.1/events?category=8`.
3. **Crash bug.** No date scoping meant fetching the *entire historical archive* — 6,672
   events. Rendering that many markers froze the tab (renderer hit 500MB+, minutes to
   paint; 50 markers rendered in ~5s by comparison). Fixed with `&days=N`.
4. **Invisible info box bug.** `.location-info` had *no CSS positioning*, so it rendered
   in normal flow *below* a `100vh` map — present in the DOM, off-screen. Fixed with
   `position: fixed` + `z-index: 1001` (above Leaflet's controls, which top out at 1000).
5. **EONET category filter is unreliable.** At `days=15`, *every* returned "wildfire" was
   actually an iceberg or tropical storm. Added a defensive client-side filter
   (`categories.some(c => c.id === 8)`) rather than trusting the server's filtering.
6. **EONET is structurally wrong for this project.** It sources wildfires largely from
   **IRWIN**, a US federal, human-reported interagency system → US-only coverage. Plus a
   ~20-day reporting lag. No query tweak fixes either.
7. **→ FIRMS.** Satellite-based, global, ~3h latency. Tradeoff: raw detections, no event
   names, enormous volume (same fire re-detected every satellite pass).
8. **Volume mitigations**: one satellite (NOAA-20, newest) instead of all three; drop
   `low` confidence; **clustering** (the actual crash-prevention mechanism).
9. **CORS blocker** → the proxy described above.
10. **22-second click delay.** `markers` was rebuilt on *every* render; `locationInfo`
    state lived in the same component, so each click rebuilt ~100k React elements and
    forced `MarkerClusterGroup` to re-index everything. Fixed with `useMemo(..., [eventData])`.
    Measured: **22,420ms → 76ms.**

---

## Working style notes (for whoever/whatever picks this up)

- Matheus is actively learning this stack and prepping to explain this project in job
  interviews. Explain the *why*, name concepts precisely (e.g. "peer dependency conflict",
  not "compatibility problem"), and distinguish what was **measured** from what was
  **inferred**.
- Verify claims against live data/browser rather than asserting from memory — that habit
  caught several of the bugs above.
- `master` branch still holds the old EONET version as a historical reference.
  `main` is current.
