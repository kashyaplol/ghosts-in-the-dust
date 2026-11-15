# Ghosts in the Dust

**An interactive planetary archaeology archive of historic human and robotic missions on the Moon and Mars.**

Explore where we landed, inspect the hardware we left behind, and read the stories of the machines that never came home.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?logo=threedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)

[**Live app**](https://ghosts-in-the-dust.vercel.app/) · [**Demo video**](https://drive.google.com/file/d/1E60RxOVrNMyd-kCyZ53iEvmTip6_mqsm/view?usp=drive_link)

---

## Contents

- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Data accuracy and testing](#data-accuracy-and-testing)
- [Narration](#narration)
- [Limitations](#limitations)
- [Roadmap](#roadmap)
- [Credits](#credits)
- [License](#license)

## About

Landers, rovers and descent stages from decades of exploration are still sitting on the Moon and Mars. They are the first human-made artifacts on other worlds, yet most people know them only as dates in a timeline.

*Ghosts in the Dust* puts them on navigable 3D globes, next to sourced mission facts and a clearly labelled retelling of how each one ended. It is a curated educational archive of six missions, not a comprehensive database.

## Features

- **Two worlds.** Switch between a textured Moon and Mars. Orbit, zoom, focus and fly to any mission marker.
- **Mission dossiers.** Status, landing and last-signal dates, lifespan, coordinates, technical specifications, primary mission and end-of-mission details, with collapsible NASA source links.
- **Hardware inspector.** A 3D viewer loads GLB/GLTF models (Draco-compressed where needed) and falls back to archival photographs or static representations when no model is available.
- **Guided exploration.** A chronological tour of the archive, plus a timeline and side-by-side mission comparison.
- **Final Hours.** A short dramatized narrative for each mission with optional spoken narration.
- **Navigation.** Mission search and filters, a synchronized zoom control, keyboard shortcuts and an onboarding tutorial.

## Tech stack

React 18, Vite, Three.js, React Three Fiber, Drei, Tailwind CSS, Framer Motion, the Web Speech API, GLB/GLTF with Draco, deployed on Vercel.

## Architecture

The app is entirely client-side. There is no backend or database.

<img width="1024" height="572" alt="image" src="https://github.com/user-attachments/assets/74dfb411-b9c1-49a7-a5d1-87dcb717a0d3" />


*Architecture diagram, AI-generated with Gemini.*

1. **Data:** `src/data/equipment.json` holds the curated mission records, sources and narratives.
2. **Logic:** pure utilities for coordinates, search and filtering, timeline, comparison and zoom, covered by tests.
3. **State:** shared React state for selection, active planet, camera and UI.
4. **Scene:** React Three Fiber renders the globe, lighting, markers and camera; Drei provides controls and model loading.
5. **UI:** React and Tailwind overlays for dossiers, timeline, comparison, tutorial and audio controls.
6. **Build and hosting:** Vite production build, served by Vercel.

## Getting started

```bash
git clone https://github.com/kashyaplol/ghosts-in-the-dust.git
cd ghosts-in-the-dust
npm ci
npm run dev
```

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm test` | Run the automated test suite |
| `npm run build` | Create a production build |

Textures and models are served from `public/` and are not downloaded at runtime.

## Project structure

```text
src/
  data/                 Curated mission records (equipment.json)
  utils/                Coordinates, search, timeline, comparison, zoom
  components/
    3d/                 Globe, markers, camera, hardware inspector
    ui/                 Dossier, timeline, compare, tutorial, audio
public/
  textures/             Moon and Mars surface maps
  models/               GLB/GLTF hardware models
  draco/                Draco decoder
  images/probes/        Hardware reference photographs
tests/                  Automated tests
docs/                   Coordinate conventions and data notes
```

## Data accuracy and testing

- **Audited data.** Apollo 11 specifications were checked against NASA NSSDCA records and corrected.
- **Verified coordinates.** Automated tests check every marker for correct hemisphere, east/west direction and agreement with the Three.js sphere projection. Longitudes are east-positive, 0° to 360°. See [coordinate conventions](docs/coordinate-conventions.md).
- **Documented ambiguities.** Cases such as Viking 1's two end-of-mission dates and latitude datum differences are explained in [mission data notes](docs/mission-data-notes.md).
- **Static, not live.** Curiosity is shown as *Active / Operational* with an archive snapshot date instead of a fabricated last-signal time.

Run the suite with `npm test`.

## Narration

The *Final Hours* panel is labelled **Mission Narrative**. The text is a dramatized retelling, not an archival transcript, and the spoken audio is **browser-generated speech** (Web Speech API), not original mission audio or NASA recordings. The panel says so on screen. Available voices depend on your browser and operating system.

## Limitations

- Six curated missions, not a full catalogue.
- Archival data only; no live spacecraft telemetry.
- Dossier source links point to general mission pages. Only the Apollo 11 specifications have been audited individually.
- Optimized for desktop browsers; mobile layout and performance are not fully verified.
- The JavaScript bundle is large (over 1 MB); code-splitting is a planned optimization.

## Roadmap

- Per-field source citations
- More landing sites and descent stages (Apollo, Surveyor, Lunokhod, Spirit, Phoenix)
- Orbital imagery of each site
- A heritage-preservation layer covering how these sites are protected

## Credits

- Planet textures: NASA/JPL-Caltech.
- Hardware photographs: NASA, via Wikimedia Commons.
- Mission data: NASA NSSDCA, NASA Science and NASA JPL, linked from each dossier.
- Built with assistance from AI tools (ChatGPT, Gemini, Claude).
- Independent educational project, not endorsed by NASA.

## License

No open-source license has been selected. All rights are reserved by the authors. NASA-sourced imagery and data remain subject to NASA's media usage guidelines.
