# Ghosts in the Dust — 7-Slide Project Demo Script & Visual Guide

*(Matches the exported 7-slide PDF at `docs/Ghosts-in-the-Dust-Demo-Slides.pdf`.)*

---

## Slide 1 — Title & Team Introduction
- **Title:** Ghosts in the Dust
- **Subtitle:** An Interactive 3D Planetary Archaeology Archive of Historic Moon and Mars Surface Missions
- **Team Name:** `[Insert Team Name]`
- **Team Members:** `[Insert Team Member Name(s)]`
- **Selected Challenge:** `[Insert Selected 2026 NASA Space Apps Challenge Title]`
- **Links:** `https://ghosts-in-the-dust.vercel.app/` · `https://github.com/kashyaplol/ghosts-in-the-dust`
- **Visual:** Clean dark-space title card paired with genuine screenshot of the Moon & Apollo 11 archive view.

## Slide 2 — The Problem
- **Heading:** Why Planetary Exploration Records Need Spatial Context
- **Key Points:**
  - Historic Moon and Mars missions sit across scattered static archives, mission overviews, and technical catalogs.
  - Flat tables make it hard for students and the public to picture *where* each spacecraft landed relative to craters, maria, and plains.
  - Comparing hardware mass, power systems, lifespans, and causes of signal loss across eras requires opening dozens of separate pages.
- **Visual:** Genuine screenshot of the Mission Timeline + Mars globe (`Gale Crater` / `Curiosity`) showing how spatial context connects chronology to terrain.

## Slide 3 — Our Solution
- **Heading:** An Interactive Planetary Archaeology Instrument
- **Key Points:**
  - Combines WebGL 3D globes of the Moon and Mars with a mission-control archive interface.
  - Curates six landmark missions: **Apollo 11 LM**, **Apollo 15 LRV**, **Viking 1 Lander**, **Opportunity**, **Curiosity**, and **Ingenuity**.
  - Built for zero-backend, instant educational exploration directly in any modern web browser.
- **Visual:** Genuine screenshot of the full interactive explorer (`Apollo 11 Lunar Module` telemetry HUD + expanded NASA Source References + vertical camera zoom control).

## Slide 4 — Explore and Inspect
- **Heading:** Navigate Two Worlds & Inspect Spacecraft Hardware in 3D
- **Key Points:**
  - Smoothly toggle between Moon and Mars, orbit/zoom freely, and fly directly to verified landing coordinates (`0°` to `<360°` East-positive).
  - Inspect four interactive 3D `.glb` spacecraft models (`Apollo 11 LM`, `Viking 1`, `Opportunity`, `Ingenuity`) with 360° orbit, auto-rotate, and wireframe toggles.
  - View zoomable archival NASA/JPL photographs for `Apollo 15 LRV` and `Curiosity`, with procedural fallback geometry if any asset is unavailable.
- **Visual:** Side-by-side genuine screenshots of the 3D Hardware Inspector showing **Apollo 11 Lunar Module** and **Ingenuity Helicopter** `.glb` models.

## Slide 5 — Discover Mission History
- **Heading:** Chronology, Side-by-Side Comparison & Narrative Exploration
- **Key Points:**
  - **Mission Timeline:** Chronological index filterable by Moon or Mars.
  - **Mission Comparison:** Side-by-side specification table highlighting differences in landing dates, power sources, dry mass, and traverse distances.
  - **Guided Exploration & Final Hours:** Chronological tour and first-person educational narratives read via the browser's Web Speech API—explicitly labeled *"Browser-generated narration. Not original mission audio."*
- **Visual:** Side-by-side genuine screenshots of **Mission Comparison** and **Final Hours · Mission Narrative**.

## Slide 6 — Technology, NASA Data & AI Acknowledgements
- **Heading:** Architecture, Verified NASA Sources & Transparent Disclosures
- **Key Points:**
  - **Tech Stack:** React 18, Vite 5, Three.js / `@react-three/fiber` / `@react-three/drei`, local Draco WASM decoder, Tailwind CSS, Framer Motion, Web Speech API.
  - **NASA Data:** Curated static archive (`src/data/equipment.json`) grounded in NASA NSSDCA (`1969-059C`, `1971-063C`, `1975-075C`, `2003-032A`, `2011-070A`, `2020-052A`), NASA Science, and NASA JPL mission records; no live NASA API calls.
  - **AI & Asset Transparency:** Original concept independently conceived by the project originator before AI tool use; AI assisted with code, tests, factual audits, and creative script editing. Third-party `.glb` and texture URLs pending upstream license verification are openly tracked in `docs/ASSET-CREDITS.md`.
- **Visual:** Structured architecture & provenance summary panel alongside genuine Curiosity operational-status screenshot (`ACTIVE / OPERATIONAL`, `Ongoing`).

## Slide 7 — Impact & Future Possibilities
- **Heading:** Educational Impact & Future Roadmap
- **Key Points:**
  - Makes lunar and Martian exploration tangible for classrooms, science outreach, and curious learners through spatial discovery.
  - **Future Possibilities:** Expand archive coverage to additional lunar/planetary landers (e.g., Surveyor, Viking 2, Pathfinder, InSight, Perseverance), add verified public-domain NASA 3D Resources provenance manifests, and integrate multilingual accessibility.
  - **Try It Live:** `https://ghosts-in-the-dust.vercel.app/`
  - **Source & Docs:** `https://github.com/kashyaplol/ghosts-in-the-dust`
- **Visual:** Clean closing card with genuine Viking 1 Chryse Planitia & Mission Narrative screenshot and direct project QR/URLs.
