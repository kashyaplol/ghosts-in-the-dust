# Coordinate Conventions & Planetary Datum Notes

## Stored coordinate format (`src/data/equipment.json`)

- **Latitude:** Signed decimal degrees in the range `-90°` to `+90°`. North latitudes are positive (`+`); south latitudes are negative (`-`).
- **Longitude:** East-positive decimal degrees in the range `0°` to less than `360°` (`[0°, 360°)`). West longitudes from historical reports are expressed as `360° - westLongitude`.

## Planetary latitude datums (planetocentric vs. planetographic)

- **Planetocentric** and **planetographic** latitudes are distinct geometric definitions due to planetary flattening (especially pronounced on Mars) and must **not** be silently interchanged.
- The underlying coordinate datum and reference system should be recorded per mission wherever the primary NASA source specifies it.
- Do not assume all missions in `equipment.json` share an identical latitude datum unless each mission's individual primary source record explicitly confirms it.
- **Viking 1 Lander (`22.27° N, 312.05° E`):** Explicitly recorded in **planetocentric** coordinates as identified by NASA NSSDCA / NASA Viking mission archives (whereas older or alternative planetographic references cite approximately `22.48° N, 47.94°–48° W`).

## Three.js scene coordinate conversion (`src/utils/coordinates.js`)

- `latLongToVector3(lat, lon, radius)` maps the stored `(latitude, longitude)` numbers directly onto Cartesian `(x, y, z)` positions on the spherical 3D globe (`radius = 2.05` over the `radius = 2` planet surface).
- This helper performs geometric spherical-to-Cartesian projection for rendering only; it **does not** convert between planetary coordinate datums (such as planetographic vs. planetocentric latitude or different prime-meridian frames).
