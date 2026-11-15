# Third-Party Assets, Media & Licensing Credits

This document audits every bundled 3D model, planetary texture, archival photograph, decoder binary, font stack, and software dependency inspected in the repository. Where upstream creator URLs or license terms are not recorded in the project or embedded in binary headers, they are marked **UNVERIFIED** rather than guessed.

No repository-wide `LICENSE` file is included in `kashyaplol/ghosts-in-the-dust` at this time.

---

## 1. 3D Hardware Models (`public/models/*.glb`)

All four `.glb` files were inspected at the glTF JSON header level. Each reports `"generator": "Khronos glTF Blender I/O v4.2.57"` and `"version": "2.0"`, with **no embedded `copyright`, `author`, `license`, or `sourceUrl` metadata**.

| Asset Filename | Mission | Size & Extensions | Creator / Publisher | Original Source URL | License | Redistribution / Attribution Status |
|---|---|---|---|---|---|---|
| `public/models/apollo-lunar-module.glb` | Apollo 11 Lunar Module | ~717 KB (`KHR_draco_mesh_compression`, `EXT_texture_webp`; includes `"UNITED STATES"` texture decal) | **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** — Upstream creator, source URL, and redistribution/commercial rights are not documented in the repository. |
| `public/models/opportunity-mer-b.glb` | Opportunity Rover | ~37 KB (`KHR_draco_mesh_compression`) | **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** — Upstream creator, source URL, and redistribution/commercial rights are not documented. |
| `public/models/viking-lander.glb` | Viking 1 Lander | ~1.85 MB (uncompressed glTF) | **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** — Upstream creator, source URL, and redistribution/commercial rights are not documented. |
| `public/models/ingenuity-mars-helicopter.glb` | Ingenuity Helicopter | ~2.02 MB (`KHR_draco_mesh_compression`, `EXT_texture_webp`; mesh names match `MHP_JR_AV_ROTOR_STOWED_120717_A1...`) | **UNVERIFIED** *(mesh naming resembles NASA/JPL Mars Helicopter CAD assemblies, but unconfirmed)* | **UNVERIFIED** | **UNVERIFIED** | **UNVERIFIED** — Upstream source URL and redistribution terms are not documented. |

**Smallest Safe Corrective Action:** Before public/commercial redistribution or final judging verification, obtain and record the exact upstream download URLs and license terms for all four `.glb` models—or replace any third-party/CC-NC models with verified public-domain NASA 3D Resources exports (`https://science.nasa.gov/3d-resources/`).

---

## 2. Archival Hardware Photographs (`public/images/probes/*.webp`)

| Asset Filename | Mission | Creator / Publisher | Original Source URL | License | Required Attribution & Notes |
|---|---|---|---|---|---|
| `public/images/probes/apollo-15-lrv.webp` | Apollo 15 Lunar Roving Vehicle | NASA (Apollo 15 surface photograph; Hasselblad Réseau crosses visible) | **UNVERIFIED EXACT URL** *(documented in `README.md` / `hardwareImages.js` as sourced via Wikimedia Commons; NASA photo ID not recorded)* | NASA Media Usage / Public Domain (U.S. Government work, subject to NASA Media Usage Guidelines) | UI displays: `NASA, Apollo 15 mission imagery via Wikimedia Commons`. **Action:** Record exact Wikimedia Commons file URL and NASA AS15 photo ID. |
| `public/images/probes/curiosity-rover.webp` | Curiosity Rover | NASA/JPL-Caltech (Spacecraft Assembly Facility photograph) | **UNVERIFIED EXACT URL** *(documented in `README.md` / `hardwareImages.js` as sourced via Wikimedia Commons; PIA ID not recorded)* | NASA/JPL-Caltech Image Policy / Public Domain (subject to NASA Media Usage Guidelines) | UI displays: `NASA/JPL-Caltech, Curiosity MSL imagery via Wikimedia Commons`. **Action:** Record exact Wikimedia Commons file URL and NASA PIA photo ID. |

---

## 3. Planetary Surface Textures (`public/textures/*.jpg`)

| Asset Filename | Body | Creator / Publisher | Original Source URL | License | Notes |
|---|---|---|---|---|---|
| `public/textures/moon_surface.jpg` | Moon | Attributed in `README.md` to NASA/JPL-Caltech *(header notes `IDL TIFF file` / `Adobe Photoshop 26.0` processing on `2025-12-02`)* | **UNVERIFIED EXACT URL** | **UNVERIFIED** *(if directly derived from NASA LRO/Clementine public-domain data, public domain; if sourced from a third-party texture pack, third-party terms may apply)* | **Action:** Record exact upstream texture URL and license (or replace with a directly cited NASA CGI Moon Kit / LRO equirectangular map). |
| `public/textures/mars_surface.jpg` | Mars | Attributed in `README.md` to NASA/JPL-Caltech | **UNVERIFIED EXACT URL** | **UNVERIFIED** *(same verification requirement as `moon_surface.jpg`)* | **Action:** Record exact upstream texture URL and license (or replace with a directly cited NASA MOLA/Viking global map). |

---

## 4. Mesh Decoder Binaries (`public/draco/*`)

| Asset Filenames | Publisher | Source URL | License | Attribution & Notes |
|---|---|---|---|---|
| `public/draco/draco_decoder.js`, `public/draco/draco_decoder.wasm`, `public/draco/draco_wasm_wrapper.js` | Google Draco (`google/draco`) | `https://github.com/google/draco` *(bundled locally for offline/reliable `DRACOLoader` decoding)* | Apache License 2.0 *(standard upstream license for Google Draco; no separate `LICENSE` copy currently resides in `public/draco/`)* | **Action:** Include upstream Apache-2.0 copyright/license notice alongside bundled binaries for redistribution compliance. |

---

## 5. Typography & Runtime Libraries

- **Fonts (`index.html`, `src/index.css`, `tailwind.config.js`):** Uses system and locally installed font families only (`Palatino Linotype`, `Book Antiqua`, `Georgia`, `Liberation Serif`, `Noto Sans`, `Segoe UI`, `JetBrains Mono`, system UI/monospace). **No external CDN fonts (e.g., Google Fonts) or bundled `.woff2` font files are used.**
- **Frontend Stack (`package.json`):** `react` (MIT), `react-dom` (MIT), `three` (MIT), `@react-three/fiber` (MIT), `@react-three/drei` (MIT), `framer-motion` (MIT), `lucide-react` (ISC), `clsx` (MIT), `tailwind-merge` (MIT), `tailwindcss` (MIT), `vite` (MIT).
