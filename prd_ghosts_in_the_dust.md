# Product Requirements Document: Ghosts in the Dust

**Project Name:** Ghosts in the Dust  
**Track:** NASA Hackathon Challenge — *Abandoned but Not Forgotten*  
**Document Status:** Final MVP Specification  
**Tech Stack:** React 18, Vite, Three.js, `@react-three/fiber`, `@react-three/drei`, Tailwind CSS, Framer Motion, Web Speech API  

---

## 1. Executive Summary & Vision

Decades of space exploration have left legendary robotic explorers, landers, and descent modules stranded across the Moon and Mars. **Ghosts in the Dust** turns scattered static NASA archives into an interactive, 3D WebGL planetary explorer and sci-fi telemetry dashboard. Users can orbit the Moon and Mars in 3D, inspect landing sites, analyze cause-of-death telemetry, inspect 3D models of decommissioned hardware, and listen to synthesized "Final Hours" narrative audio transmissions.

---

## 2. Target Audience & Problem Statement

* **The Problem:** Historical NASA hardware data (locations, technical lifespans, failure reasons) is buried in static text tables and technical reports. Existing web visualizers rely on flat 2D maps that lack emotional resonance and visual depth.
* **Target Audience:** Hackathon judges, space enthusiasts, educators, and students seeking an immersive storytelling experience.
* **Core Value Proposition:** High-production 3D WebGL graphics paired with zero-latency glassmorphism UI overlays and atmospheric synthesized audio.

---

## 3. System Architecture & Tech Stack

```
[ Web Browser ]
   │
   ├── UI Overlay Layer (HTML/DOM)
   │     ├── Header (Planet Toggle / Search)
   │     ├── TelemetryHUD (Framer Motion Glass Panel)
   │     ├── HardwareInspector (Modal Canvas)
   │     └── AudioPlayer (Web Speech API + Synthesizer)
   │
   ├── 3D WebGL Layer (React Three Fiber / Three.js)
   │     ├── PlanetGlobe (Moon/Mars Shaders + Textures)
   │     ├── MarkerPins (Spherical-to-Cartesian Vector3 Math)
   │     └── OrbitControls (Camera Management)
   │
   └── Static Data Storage (`equipment.json`)
```

### Stack Breakdown
* **Framework:** React 18 with Vite
* **Styling:** Tailwind CSS (Custom Dark Space Theme)
* **3D Canvas:** `three`, `@react-three/fiber`, `@react-three/drei`
* **Animations:** `framer-motion`
* **Iconography:** `lucide-react`
* **Audio:** Web Speech API (`window.speechSynthesis`) + Web Audio API filters

---

## 4. Core Feature Specifications

### F-1: 3D Planetary Explorer
* **Description:** A WebGL interactive sphere representing the Moon or Mars.
* **Requirements:**
  * Render textured 3D spheres using NASA JPL 2K surface map textures.
  * Support dynamic toggle between **Moon** (lunar gray theme) and **Mars** (Martian red theme).
  * Convert spherical coordinates ($\text{Lat}, \text{Lon}$) into 3D Cartesian coordinates $(x, y, z)$ on a sphere of radius $R$ using standard geometry conversion:
    $$x = R \cdot \cos(\text{lat}) \cdot \cos(\text{lon})$$
    $$y = R \cdot \sin(\text{lat})$$
    $$z = -R \cdot \cos(\text{lat}) \cdot \sin(\text{lon})$$
  * Render interactive glowing 3D markers at converted coordinates.
  * Clicking a pin triggers a smooth camera fly-to transition toward the selected coordinates and selects the mission ID in global state.

### F-2: Sci-Fi Telemetry HUD Panel
* **Description:** A floating glassmorphism dashboard overlaid on the 3D canvas.
* **Requirements:**
  * Must use `pointer-events-none` on parent overlays to preserve mouse drag/orbit controls on the 3D canvas beneath.
  * Slide-in animated entry via Framer Motion when a marker is selected.
  * Display mission details: Landing Date, Last Signal Timestamp, Operational Status, Primary Objectives, and Failure Analysis (e.g., "Solar panels covered by dust storm").
  * Action button to launch the **3D Hardware Inspector**.
  * Action button to trigger the **"Final Hours" Audio Narrative**.

### F-3: 3D Hardware Inspector Modal
* **Description:** A popup modal hosting a secondary React Three Fiber canvas for close-up hardware inspection.
* **Requirements:**
  * Render dynamic `.gltf`/`.glb` 3D vehicle models or low-poly wireframe fallback geometries if asset loading delays occur.
  * Provide interactive orbit controls (360-degree rotation, zoom, auto-rotate toggle).
  * Wireframe toggle switch to highlight structural components.

### F-4: "Final Hours" Audio & Narrative Engine
* **Description:** An audio player generating synthesized "transmission logs" of each probe's final moments.
* **Requirements:**
  * Leverage `window.speechSynthesis` to read script transcripts written in the first-person perspective of the probe.
  * Render an animated voice wave/spectrogram indicator in the HUD during playback.

---

## 5. Data Schema Specification (`src/data/equipment.json`)

The application consumes static JSON containing pre-formatted coordinates and metadata for launch targets.

```json
[
  {
    "id": "oppy-2004",
    "name": "Opportunity Rover (MER-B)",
    "body": "Mars",
    "latitude": -1.9482,
    "longitude": 354.4742,
    "landedDate": "2004-01-25",
    "lastSignalDate": "2018-06-10",
    "status": "Lost Contact",
    "causeOfDeath": "Planet-wide Martian dust storm blocked solar arrays, leading to critical battery depletion.",
    "primaryMission": "Search for and characterize a wide range of rocks and soils that hold clues to past water activity on Mars.",
    "technicalSpecs": {
      "mass": "185 kg",
      "powerSource": "Solar Array & Lithium-ion Batteries",
      "totalDistance": "45.16 km"
    },
    "narrativeTranscript": "My battery is low and it's getting dark. Dust has covered the solar panels. Entering final sleep cycle at Endeavour Crater."
  }
]
```

---

## 6. UI/UX Design System & Theme Specs

### Color Palette
| Token | Hex Value | Usage |
|---|---|---|
| `space-black` | `#08090c` | Global background & canvas backdrop |
| `panel-dark` | `#12141d` | HUD panels and glass background (`rgba(18,20,29,0.85)`) |
| `glass-border` | `rgba(255,255,255,0.1)` | Panel outlines and dividers |
| `neon-cyan` | `#00f3ff` | Active selection, primary buttons, Moon telemetry |
| `solar-amber` | `#ffb703` | Status warnings, Mars telemetry, hardware tags |
| `alert-red` | `#ff4d4d` | Mission failure indicators, status "Lost Contact" |

### Typography
* **Monospace System Font:** `Courier New`, `JetBrains Mono`, or `Fira Code` (for telemetry values, coordinates, and timestamp displays).
* **Sans-Serif Font:** `Inter` or system sans-serif (for UI titles and narrative body text).

---

## 7. Non-Functional Requirements & Key Metrics

* **Performance Target:** Continuous $60\text{ FPS}$ in WebGL context on modern standard browsers (Chrome, Edge, Firefox, Safari).
* **Initial Page Load:** Under $2.5\text{ s}$ (static bundle + procedural sphere fallbacks).
* **Responsiveness:** Desktop-first design optimized for standard $1920 \times 1080$ and $1440 \times 900$ display resolutions.

---

## 8. Hackathon Execution Roadmap (Phased Milestones)

| Phase | Milestone | Deliverables | Target Completion |
|---|---|---|---|
| **Phase 1** | Architecture & Math Setup | Setup Vite, Tailwind, `latLongToVector3()` helper, static `equipment.json` schema. | Hour 0 – 3 |
| **Phase 2** | 3D Planetary Canvas | Render `PlanetGlobe.jsx`, apply Moon/Mars textures, render 3D `MarkerPin.jsx` meshes. | Hour 3 – 8 |
| **Phase 3** | Telemetry HUD & State | Connect pin click events to React state, build glassmorphism `TelemetryHUD.jsx` with Framer Motion. | Hour 8 – 14 |
| **Phase 4** | Inspector & Audio | Add `HardwareInspector.jsx` modal, wire Web Speech API for final mission transmissions. | Hour 14 – 18 |
| **Phase 5** | Polish & Deployment | Fine-tune camera transitions, dark theme accents, and deploy to Vercel/Netlify. | Hour 18 – 24 |