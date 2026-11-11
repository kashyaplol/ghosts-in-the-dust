# Ghosts in the Dust

An interactive Three.js archive of historic NASA missions on the Moon and Mars.

## Development

```bash
npm ci
npm run dev
```

Run the deterministic checks and production build with:

```bash
npm test
npm run build
```

## Planet textures

The local surface maps are loaded from:

- `public/textures/moon_surface.jpg`
- `public/textures/mars_surface.jpg`

The Moon and Mars surface imagery is attributed to NASA/JPL-Caltech. The
application uses these local files only; it does not download textures at
runtime. If a local texture is unavailable, the corresponding procedural
fallback remains available.
