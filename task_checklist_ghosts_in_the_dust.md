# Project Task Breakdown: Ghosts in the Dust

**Project Track:** NASA Hackathon — *Abandoned but Not Forgotten*  
**Repo Target:** `ghosts-in-the-dust`  
**Execution Strategy:** Parallel workstreams (3D Engine, UI/HUD, Data Architecture)

---

## Phase 1: Environment, Tooling & Mathematical Foundation (Hours 0 – 3)

### 1.1 Project Setup & Dependencies
- [ ] Initialize React + Vite project in local repository.
- [ ] Install core dependencies:
  ```bash
  npm install three @react-three/fiber @react-three/drei framer-motion lucide-react clsx tailwind-merge
  npm install -D tailwindcss postcss autoprefixer
  ```
- [ ] Initialize Tailwind CSS (`npx tailwindcss init -p`).

### 1.2 Design System & Styling Setup
- [ ] Configure `tailwind.config.js` with custom color palette (`space-black`, `panel-dark`, `neon-cyan`, `solar-amber`, `alert-red`).
- [ ] Add base directives and global body styles to `src/index.css` (`bg-[#08090c]`, `overflow-hidden`, monospace typography).

### 1.3 Math & Coordinate Utilities
- [ ] Create `src/utils/coordinates.js` for spherical to 3D Cartesian Vector3 conversion:
  $$x = R \cdot \cos(\text{lat}) \cdot \cos(\text{lon})$$
  $$y = R \cdot \sin(\text{lat})$$
  $$z = -R \cdot \cos(\text{lat}) \cdot \sin(\text{lon})$$
- [ ] Add unit tests or simple console log verifications for known coordinates (e.g., Apollo 11 at $0.67408^\circ \text{N}, 23.47297^\circ \text{E}$).

### 1.4 Data Architecture Scaffolding
- [ ] Populate `src/data/equipment.json` with complete records for at least 6 historic missions:
  - [ ] Apollo 11 Lunar Module (Moon)
  - [ ] Apollo 15 LRV (Moon)
  - [ ] Opportunity Rover (Mars)
  - [ ] Curiosity Rover (Mars)
  - [ ] Viking 1 Lander (Mars)
  - [ ] Ingenuity Helicopter (Mars)

---

## Phase 2: 3D Planetary Canvas & Vector3 Marker Placement (Hours 3 – 8)

### 2.1 WebGL Canvas Container
- [ ] Build `src/components/3d/CanvasContainer.jsx` wrapping R3F `<Canvas>` with ambient light, point lights, and shadow settings.
- [ ] Implement `@react-three/drei` `<OrbitControls>` with damping and zoom limits.

### 2.2 Planetary Renderer (`PlanetGlobe.jsx`)
- [ ] Download 2K texture maps (`moon_surface.jpg`, `mars_surface.jpg`) into `public/textures/`.
- [ ] Build `PlanetGlobe.jsx` to render a 3D sphere mesh using high-resolution textures.
- [ ] Add atmosphere glow/shader effect around the planetary limb.
- [ ] Implement smooth texture/color crossfade when toggling between Moon and Mars views.

### 2.3 3D Marker Pins (`MarkerPin.jsx`)
- [ ] Build `MarkerPin.jsx` using low-poly glowing mesh primitives (cone, pulsing ring, or beacon light).
- [ ] Position pins dynamically using `latLongToVector3()` helper functions.
- [ ] Add hover state (scale up, highlight glow) and click state trigger.

### 2.4 Camera Fly-To Animation
- [ ] Implement smooth camera movement toward selected coordinates using `gsap` or R3F `useFrame` lerp logic when a user clicks a pin.

---

## Phase 3: Glassmorphism Telemetry HUD & UI Overlay (Hours 8 – 14)

### 3.1 Global State Management
- [ ] Create React state hook or Context (`src/context/SpaceContext.jsx`):
  - `activeBody`: `"Moon"` | `"Mars"`
  - `selectedEquipment`: `EquipmentObject` | `null`
  - `isInspectorOpen`: `boolean`
  - `isPlayingAudio`: `boolean`

### 3.2 Header & Navigation (`Header.jsx`)
- [ ] Build fixed header with title logo, mission counter, and body toggle buttons (Moon / Mars).
- [ ] Add search/filter bar to jump directly to specific equipment by name.

### 3.3 Sci-Fi Telemetry Panel (`TelemetryHUD.jsx`)
- [ ] Build overlay container with `pointer-events-none` (ensuring 3D background remains drag-scrollable).
- [ ] Build sliding panel (`pointer-events-auto`) using Framer Motion (`initial={{ x: 400 }} animate={{ x: 0 }}`).
- [ ] Display mission metadata:
  - Landing Date & Decommission Timestamp
  - Operational Lifespan Counter
  - Primary Objectives & Tech Specs (Mass, Power Source, Distance Covered)
  - Cause of Failure box with warning status tag (`alert-red` styling)
- [ ] Add CTA buttons: "Inspect 3D Hardware" and "Play Final Log".

---

## Phase 4: 3D Hardware Inspector & Audio Engine (Hours 14 – 18)

### 4.1 Hardware Inspector Modal (`HardwareInspector.jsx`)
- [ ] Create modal overlay triggered by the HUD inspect CTA.
- [ ] Embed a secondary isolated R3F canvas inside the modal.
- [ ] Add wireframe toggle switch and auto-rotate controls.
- [ ] Implement fallback geometric representation if GLTF loading fails or model file is missing.

### 4.2 "Final Hours" Transmission Engine (`AudioPlayer.jsx`)
- [ ] Build audio player component using Web Speech API (`window.speechSynthesis`).
- [ ] Configure voice pitch, rate, and radio filter effects to simulate distant space transmissions.
- [ ] Add live transcript typing animation effect matching speech output.
- [ ] Add animated visualizer bars (CSS/Canvas waveform indicator) during audio playback.

---

## Phase 5: Polish, Performance & Hackathon Delivery (Hours 18 – 24)

### 5.1 Performance Optimization & Polish
- [ ] Audit WebGL framerate to ensure smooth $60\text{ FPS}$ performance.
- [ ] Implement texture lazy loading and asset preloading screens.
- [ ] Fine-tune space skybox backdrop (starfield particles / star map background).

### 5.2 QA & Cross-Browser Testing
- [ ] Verify responsiveness on common laptop resolutions ($1920 \times 1080$, $1440 \times 900$).
- [ ] Ensure click handling and raycasting on 3D pins work consistently across Chrome, Edge, and Firefox.

### 5.3 Deployment & Demo Prep
- [ ] Build production assets (`npm run build`).
- [ ] Deploy live application to Vercel or Netlify.
- [ ] Record a 2-minute video pitch highlighting 3D navigation, HUD telemetry, and audio logs.
- [ ] Update repository `README.md` with demo links, screenshot previews, and build instructions.