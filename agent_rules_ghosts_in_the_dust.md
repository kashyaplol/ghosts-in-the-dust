# AI Agent Code Generation Rules: Ghosts in the Dust

**Target Workspace:** `ghosts-in-the-dust`  
**Primary Stack:** React 18, Vite, Three.js, `@react-three/fiber` (R3F), `@react-three/drei`, Tailwind CSS, Framer Motion  

---

## 1. System Role & Execution Instructions

When generating or refactoring code for this repository, act as a **Senior 3D Web Engineer and React Architect**. You must generate production-ready code that compiles without warnings under Vite and WebGL canvas contexts.

### Critical Behavioral Mandates
* **No Truncation or Placeholders:** Never use comment placeholders such as `// ... rest of the code` or `// TODO: implement`. Output full, executable component logic.
* **Modular File Constraint:** Keep file lengths strictly under 200 lines. Split UI overlays, 3D meshes, and custom hooks into isolated single-responsibility files.
* **Never Mix HTML DOM Inside Canvas:** Standard HTML components (`div`, `button`) must stay strictly outside the R3F `<Canvas>` component unless wrapped in `@react-three/drei`'s `<Html>` utility.

---

## 2. Import & Dependency Validation Rules

Always verify package sources to avoid hallucinated imports:

| Concept / Helper | Correct Package Source | Incorrect Sources |
|---|---|---|
| `useFrame`, `useThree`, `extend`, `Canvas` | `@react-three/fiber` | `three`, `@react-three/drei` |
| `OrbitControls`, `Html`, `useGLTF`, `Stars` | `@react-three/drei` | `three`, `@react-three/fiber` |
| `Vector3`, `Color`, `Matrix4`, `Euler` | `three` | `@react-three/fiber` |
| `motion`, `AnimatePresence` | `framer-motion` | `lucide-react` |
| `Zap`, `Radio`, `Globe`, `X`, `ChevronRight` | `lucide-react` | `react-icons` |

---

## 3. WebGL & Math Implementation Specifications

### Spherical-to-Cartesian Coordinate Conversion
All landing site coordinates from `src/data/equipment.json` must be transformed into 3D Cartesian space using the standard conversion formula:

$$x = R \cdot \cos(\text{lat}) \cdot \cos(\text{lon})$$
$$y = R \cdot \sin(\text{lat})$$
$$z = -R \cdot \cos(\text{lat}) \cdot \sin(\text{lon})$$

* Angles must be converted from degrees to radians prior to evaluating trigonometric functions:
  $$\text{radians} = \text{degrees} \times \left( \frac{\pi}{180} \right)$$
* Always use the centralized utility function from `@/utils/coordinates.js`. Do NOT implement raw trigonometry inside component render loops.

### Performance & Memory Lifecycle Rules
1. **Asset Disposal:** Whenever a mesh or material unmounts, call `.dispose()` on geometries and materials inside a `useEffect` cleanup return to prevent WebGL memory leaks.
2. **Suspense Wrapping:** Wrap any 3D model loaders or texture imports in React `<Suspense fallback={<FallbackMesh />}>` blocks.
3. **Texture Resolution:** Surface textures stored in `/public/textures/` must stay within $2048 \times 1024$ resolution to guarantee load times below $2.5\text{ s}$.

---

## 4. UI Overlay & Glassmorphism Rules

### Pointer-Events Architecture
To allow users to orbit the 3D globe while interacting with overlay HUD panels, always observe the pointer event hierarchy:

```jsx
// Correct HUD Overlay Parent:
<div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between">
  {/* Children components MUST re-enable pointer events for interactive elements */}
  <Header className="pointer-events-auto" />
  <TelemetryHUD className="pointer-events-auto" />
</div>
```

### Design Token Adherence
Use the following Tailwind classes for all UI elements:

* **Backgrounds:** `bg-[#08090c]` (canvas backdrop), `bg-[#12141d]/85` (glass panels)
* **Borders:** `border border-white/10` or `border-[#00f3ff]/30`
* **Accents:** `text-[#00f3ff]` (Cyan / Moon active), `text-[#ffb703]` (Amber / Mars active), `text-[#ff4d4d]` (Red / Lost Contact status)
* **Typography:** `font-mono` for coordinates, timestamps, and numeric telemetry values. `font-sans` for body copy and historical narratives.

---

## 5. Verification Checklist for Code Outputs

Before outputting code solutions, mentally verify:
1. Does `npm run build` pass without missing import errors?
2. Are state changes (`selectedEquipment`, `activeBody`) handled via `SpaceContext`?
3. Is `window.speechSynthesis.cancel()` invoked before triggering new audio playback?
4. Are interactive elements styled with explicit hover and focus states?