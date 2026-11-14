<div align="center">
  <img src="readme-banner.png" alt="The Moon, Mars, and a lander on a lunar surface" width="100%" />

  <h1>Ghosts in the Dust</h1>
  <p><strong>A planetary archaeology archive of humanity's missions on the Moon and Mars.</strong></p>
  <p>
    <a href="https://ghosts-in-the-dust.vercel.app/">Live Demo</a>
    · Explore historic missions, landing sites, hardware, and the stories left behind.
  </p>
</div>

## Overview

Ghosts in the Dust is an interactive 3D archive for exploring historic lunar and Martian missions. Navigate the Moon and Mars, locate missions on their surfaces, inspect available hardware models, and explore mission records through a shared interface.

## Features

- **3D planetary explorer** — textured Moon and Mars with interactive camera controls.
- **Mission archive** — explore six curated mission records across both planetary bodies.
- **Telemetry dossiers** — view archival mission status, dates, coordinates, and specifications.
- **Timeline & comparison** — explore missions chronologically and compare records.
- **Hardware inspector** — inspect available GLB/GLTF models, with configured fallbacks.
- **Guided exploration** — follow a chronological journey through the missions.
- **Final Hours** — read mission-ending narratives and optionally use browser speech synthesis.

## Tech stack

React · Vite · Three.js · React Three Fiber · Drei · Tailwind CSS · Framer Motion

## Run locally

```bash
git clone <repository-url>
cd ghosts-in-the-dust
npm install
npm run dev
```

## Validation

```bash
npm test
npm run build
```

> **Note:** Mission dossiers are based on the project's curated archival dataset; they are not live spacecraft telemetry. Final Hours narration uses browser speech synthesis where supported.
