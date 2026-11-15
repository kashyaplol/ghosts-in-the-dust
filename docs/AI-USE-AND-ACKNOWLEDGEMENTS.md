# AI Use & Acknowledgements — Ghosts in the Dust

## 1. Human Origin & Ideation Declaration

The core idea, concept, problem framing, and creative direction for **Ghosts in the Dust**—an interactive 3D planetary archaeology archive exploring historic Moon and Mars surface missions—were **independently conceived by the project originator before any AI agent or AI development tool was used**.

AI tools were used subsequently as development, debugging, editorial, and quality-assurance aids. They did not originate the project concept.

---

## 2. AI Tools Used

- **Google AI Studio / Gemini coding engine** (including `models/gemini-4-hydrogen` in AI Studio Build sessions): Used for code refinement, bug fixing, test authoring, factual/technical verification assistance against NASA references, and compliance documentation drafting.
- **Prior development-session AI assistance** (exact earlier tool identifiers and commit history are not available locally because `.git` is not present in the workspace): Assisted with initial React/Three.js scaffolding and draft mission descriptions prior to the audit passes.

---

## 3. Summary of AI Contributions by Area

| Area | Role of AI Tools | Disclosure & Verification Notes |
|---|---|---|
| **Source Code & Implementation** | Assisted in implementing and refining React components (`TelemetryHUD`, `AudioPlayer`, `HardwareInspector`, `CameraController`, `MissionTimeline`, `MissionComparison`, `GuidedExploration`), Vite configuration, and utility helpers. | Reviewed and tested via `npm test`, `npm run build`, and headless Chromium verification in this workspace. |
| **Test Development** | Assisted in authoring Node `--test` regression suites (`tests/*.test.mjs`). | All 41 unit/integration checks pass locally; tests verify schema, geometry, UI hooks, and consistency rather than serving as primary-source proof. |
| **Data Processing & Factual Audit** | Assisted in cross-checking mission specs, coordinates, and date semantics against cited NASA NSSDCA, NASA Science, and NASA JPL documentation (e.g., Apollo 11 `2,034 kg` dry descent stage & `0.25 km` traverse; Viking 1 planetocentric `22.27° N, 312.05° E`; Ingenuity `18.4447° N`; Curiosity `ACTIVE / OPERATIONAL` semantics; Opportunity Eagle Crater landing vs. Endeavour Crater destination). | Verified values trace to named NASA references in `src/data/equipment.json` and `docs/`. Upstream provenance of bundled 3D `.glb` files and exact upstream texture/photo URLs remain unverified in the repository (see `docs/ASSET-CREDITS.md`). |
| **Mission Narratives (`narrativeTranscript`)** | First-person narrative scripts in `src/data/equipment.json` were drafted and editorially refined with AI assistance. | These scripts are **creative educational narratives** ("Final Hours · Mission Narrative"), not authentic historical spacecraft logs or NASA transcripts. |
| **Audio / Narration** | No external generative AI TTS API or pre-rendered AI audio files are used. The app uses the user's browser **Web Speech API** (`window.speechSynthesis`). | `AudioPlayer.jsx` explicitly discloses: *"Final Hours · Mission Narrative"* and *"Browser-generated narration. Not original mission audio."* |
| **Images, Videos & 3D Models** | **No AI-generated images or videos are included.** `apollo-15-lrv.webp` and `curiosity-rover.webp` are authentic NASA/JPL photographs; `moon_surface.jpg` and `mars_surface.jpg` are NASA/JPL-Caltech planetary surface maps; the 4 `.glb` files carry `Khronos glTF Blender I/O v4.2.57` exporter headers. | Because no assets are confirmed AI-generated visuals, no synthetic AI watermarks were applied. Upstream creator/license metadata for the 4 `.glb` models is unverified and flagged in `docs/ASSET-CREDITS.md`. |

---

## 4. NASA Branding & Generated Content Compliance Check

- **NASA Branding:** No AI-generated artwork containing NASA insignia, logos, flags, or mission patches exists in the application.
  - Note: Authentic clean-room mission emblems visible on the Spacecraft Assembly Facility wall inside `public/images/probes/curiosity-rover.webp` are part of the genuine NASA/JPL photograph.
  - Note: `public/models/apollo-lunar-module.glb` contains `"UNITED STATES"` texture decals on the descent stage model; upstream provenance/license of this Blender `.glb` export is currently unverified (`docs/ASSET-CREDITS.md`).
- **Authentic vs. Synthesized Media:** `StaticHardwareImage.jsx` labels genuine archival photos as `NASA ARCHIVAL IMAGE` / `Archival Mission Photograph`. `AudioPlayer.jsx` labels synthesized speech as `Browser-generated narration. Not original mission audio.`
- **Mission Names:** Historical NASA mission names are used strictly as factual archival references and do not imply NASA endorsement.
