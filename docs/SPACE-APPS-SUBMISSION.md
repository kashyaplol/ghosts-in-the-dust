# NASA Space Apps Challenge 2026 — Project Submission Responses

## 1. Project Name
Ghosts in the Dust

---

## 2. High-Level Project Summary
**Ghosts in the Dust** is an interactive 3D planetary archaeology archive for exploring six landmark NASA surface missions across the Moon and Mars. Users can rotate textured globes of the Moon and Mars, inspect mission landing sites with verified archival coordinates, examine 3D spacecraft models and archival photography, compare missions side by side, follow chronological guided tours, and listen to browser-synthesized narrative transmissions grounded in official NASA records.

---

## 3. Link to Project Demo
`[PLACEHOLDER — Insert public URL to 7-slide presentation or recorded demo video before submitting]`

*(A 7-slide PDF demo generated from live application screenshots is prepared in `docs/Ghosts-in-the-Dust-Demo-Slides.pdf`.)*

---

## 4. Link to Final Project
- **Live Web Application:** https://ghosts-in-the-dust.vercel.app/
- **Source Code Repository:** https://github.com/kashyaplol/ghosts-in-the-dust

---

## 5. Detailed Project Description
Decades of lunar and Martian exploration have left iconic robotic explorers, descent stages, and rovers resting across two worlds—from Tranquility Base to Jezero Crater. Yet their histories are often scattered across static tables, separate mission pages, and technical catalogs that make it difficult for students and the public to visualize *where* each spacecraft landed, *how* its engineering compared to other missions, and *how long* it operated.

**Ghosts in the Dust** unifies six curated NASA surface missions into a single web-based 3D observatory built with React, Vite, Three.js (`@react-three/fiber` / `@react-three/drei`), and Tailwind CSS:

1. **Interactive 3D Planetary Globes (Moon & Mars):** Users switch seamlessly between the Moon and Mars, orbit and zoom smoothly (via mouse/touch or a vertical telemetry zoom slider), and click glowing surface markers mapped directly from planetary latitude and east-positive longitude coordinates (`0°` to `<360°`).
2. **Mission Telemetry HUD & NASA Source Attribution:** Selecting any mission flies the camera to its landing coordinates and opens a structured telemetry dossier showing landing date, last-signal status (distinguishing historical end dates from `ACTIVE / OPERATIONAL` status for Curiosity), operational lifespan, cause of signal loss or decommissioning, dry mass, power source, surface traverse, primary objective, and expandable direct links to official NASA references.
3. **3D Hardware Inspector:** Four missions (`Apollo 11 Lunar Module`, `Viking 1 Lander`, `Opportunity Rover`, and `Ingenuity Helicopter`) render interactive 3D `.glb` models with 360-degree rotation, auto-rotate, and wireframe toggles using a locally bundled Draco decoder (`/draco/`). Missions without bundled 3D models (`Apollo 15 Lunar Roving Vehicle` and `Curiosity Rover`) present zoomable NASA/JPL archival photographs clearly labeled as archival imagery, with procedural geometry fallbacks if any visual asset is unavailable.
4. **Chronological Timeline, Side-by-Side Comparison & Guided Exploration:** Users can filter and browse missions chronologically, compare any two missions parameter-by-parameter with differing fields highlighted, search by keyword/body/status/year, or take a step-by-step guided tour across all six sites.
5. **Final Hours · Mission Narrative:** Each mission includes a first-person educational narrative script read aloud via the browser's Web Speech API (`window.speechSynthesis`), explicitly labeled as browser-generated narration rather than original mission audio.

**Educational Impact:** Designed for classrooms, museums, and space enthusiasts, the archive turns isolated archival facts into spatial, comparative, and memorable exploration without requiring any external backend, login, or specialized hardware.

---

## 6. Use of Super Intelligence
The core idea, concept, and solution direction for **Ghosts in the Dust** were independently conceived by the project originator **before** any AI agent or AI development tool was used.

AI tools—specifically Google AI Studio / Gemini coding assistance (and earlier development-session AI coding aids during initial repository drafting)—were subsequently used as development and editorial aids for:
- **Code & UI Refinement:** Assisting with React/Three.js implementation, responsive camera framing, accessible HUD controls, and Vite configuration.
- **Test Authoring:** Writing automated Node `--test` regression suites (`tests/*.test.mjs`) covering coordinate geometry, mission schema integrity, source attribution, and operational-status semantics.
- **Data Auditing & Documentation:** Cross-checking displayed mission specifications (such as Apollo 11's `2,034 kg` dry descent stage mass and `0.25 km` EVA traverse, Viking 1 and Ingenuity coordinates, and Opportunity's Eagle Crater landing vs. Endeavour Crater traverse) against NASA NSSDCA, NASA Science, and NASA JPL documentation.
- **Editorial Mission Scripts:** Drafting and refining the first-person educational `narrativeTranscript` scripts.

**Media & Audio Disclosures:**
- **No AI-generated images or videos** are used in the application; hardware photos (`apollo-15-lrv.webp`, `curiosity-rover.webp`) are archival NASA/JPL photographs, and surface maps are NASA/JPL-Caltech planetary textures.
- **No generative AI audio API** is used; spoken narration uses the browser's built-in Web Speech API and is explicitly labeled in the UI as *"Final Hours · Mission Narrative"* and *"Browser-generated narration. Not original mission audio."*
- Full details are documented in `docs/AI-USE-AND-ACKNOWLEDGEMENTS.md`.

---

## 7. NASA Data
**Ghosts in the Dust** does **not** call any live NASA API or Deep Space Network telemetry feed at runtime. All mission metadata is stored locally in `src/data/equipment.json` and curated from official NASA archival pages.

### Direct NASA Source References Used per Mission

1. **Apollo 11 Lunar Module (`apollo-11-lm`)**
   - *Sources:* [NASA NSSDCA — Apollo 11](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11info.html) and [NASA NSSDCA — Apollo 11 Lunar Module / EASEP (1969-059C)](https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C)
   - *Directly Verified NASA Data:* Landing date (`1969-07-20`), ascent liftoff/end date (`1969-07-21`), Mare Tranquillitatis coordinates (`0.67408° N, 23.47297° E` classic ALSJ/NSSDCA; `0.67409° N, 23.47298° E` LROC refinement), LM-5 descent stage dry mass (`2,034 kg`), silver-zinc battery power, EVA traverse (`0.25 km`), and ascent-stage jettison history.
2. **Apollo 15 Lunar Roving Vehicle (`apollo-15-lrv`)**
   - *Source:* [NASA — Apollo Missions](https://www.nasa.gov/specials/apollo50th/missions.html) *(supplemented during audit by NASA NSSDCA `1971-063C`)*
   - *Directly Verified vs. Supplemental:* Landing date (`1971-07-30`), last surface operation (`1971-08-02`), Hadley–Apennine coordinates (`26.1322° N, 3.6339° E`), LRV mass (`210 kg`), dual 36-volt silver-zinc batteries, and `27.76 km` traverse. *Note:* The linked general Apollo 50th overview page does not list every rover technical specification individually; those values come from NASA NSSDCA/Apollo mission reports.
3. **Viking 1 Lander (`viking-1-lander`)**
   - *Source:* [NASA Science — Viking 1](https://science.nasa.gov/mission/viking-1/) *(supplemented during audit by NASA NSSDCA `1975-075C`, `nssdc.gsfc.nasa.gov/planetary/viking.html`, and NASA/JPL Viking factsheets)*
   - *Directly Verified vs. Supplemental:* Landing date (`1976-07-20`), final transmission date (`1982-11-11`; formal communications end cited by project overview/NSSDCA as `1982-11-13`—documented in `docs/mission-data-notes.md`), planetocentric Chryse Planitia coordinates (`22.27° N, 312.05° E` per NSSDCA; planetographic variants cite `~22.48° N, 47.94°–48° W`), `572 kg` dry landed mass, RTG power, `0 km` stationary lander traverse, and faulty-command antenna pointing loss.
4. **Opportunity Rover (`opportunity-mer-b`)**
   - *Source:* [NASA Science — Opportunity](https://science.nasa.gov/mission/mer-opportunity/) *(supplemented by NASA NSSDCA `2003-032A` and JPL Opportunity mission reports)*
   - *Directly Verified Data:* Landing date (`2004-01-25`) at **Eagle Crater** in Meridiani Planum (`1.9482° S, 354.4742° E`), final signal (`2018-06-10`), `185 kg` mass, solar array + lithium-ion battery power, `45.16 km` odometer traverse ending near **Endeavour Crater**, and global dust storm signal loss.
5. **Curiosity Rover (`curiosity-msl`)**
   - *Source:* [NASA JPL — Mars Science Laboratory: Curiosity Rover](https://www.jpl.nasa.gov/missions/mars-science-laboratory-curiosity-rover-msl/) *(supplemented by NASA NSSDCA `2011-070A`)*
   - *Directly Verified Data:* Landing date (`2012-08-06`) at Bradbury Landing in Gale Crater (`4.5895° S, 137.4417° E`), `899 kg` mass, MMRTG power, `Operational` status (`lastSignalDate: null`, displayed as `ACTIVE / OPERATIONAL` with `archiveSnapshotDate: "2026-11-11"` dataset metadata), and `35.78 km` traverse snapshot.
6. **Ingenuity Helicopter (`ingenuity-helicopter`)**
   - *Source:* [NASA Science — Ingenuity Mars Helicopter](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/) *(supplemented by NASA NSSDCA `2020-052A`)*
   - *Directly Verified Data:* Landing date aboard Perseverance (`2021-02-18`) in Jezero Crater (`18.4447° N, 77.4508° E`), final flight (`2024-01-18`), `1.8 kg` mass, solar panel + lithium-ion battery power, `17.23 km` total flight distance, and Flight 72 rotor damage ending flight operations.

### Editorial / Summarized vs. Direct Data
- **`causeOfDeath` and `primaryMission`:** Concise, plain-language summaries authored by the team from official NASA mission histories.
- **`narrativeTranscript`:** Original first-person educational storytelling scripts written/refined by the team with AI editorial assistance—not NASA telemetry or transcripts.
- **General `sources` Links:** Some mission `sources` entries (such as NASA Science mission overview pages and Apollo 50th overview) serve as general public reference links and do not individually contain every displayed technical field; primary NSSDCA spacecraft catalog values verified during the audit are documented here and in `docs/`.

---

## 8. Space Agency Partner Data and Other References
- **Space Agency Partner Data:** None used. This project relies solely on NASA archival resources and does not integrate ESA, JAXA, CSA, or other Space Agency Partner APIs or datasets.
- **Other References & Bundled Open-Source / Third-Party Assets:**
  - **Google Draco Decoder (`public/draco/*`):** Apache-2.0 (`https://github.com/google/draco`) for client-side GLB mesh decompression.
  - **Archival Photographs (`public/images/probes/*.webp`):** NASA / NASA/JPL-Caltech photographs sourced via Wikimedia Commons (exact Commons URLs pending entry in `docs/ASSET-CREDITS.md`).
  - **Planetary Surface Maps (`public/textures/moon_surface.jpg`, `mars_surface.jpg`):** Attributed to NASA/JPL-Caltech (exact upstream map URLs currently unverified in repo; tracked in `docs/ASSET-CREDITS.md`).
  - **3D `.glb` Hardware Models (`public/models/*.glb`):** Bundled locally; upstream creators and license terms are currently marked **UNVERIFIED** in `docs/ASSET-CREDITS.md` for follow-up verification prior to public redistribution.
  - **Open-Source Software Stack:** React, Vite, Three.js, `@react-three/fiber`, `@react-three/drei`, Tailwind CSS, Framer Motion, and Lucide Icons.
