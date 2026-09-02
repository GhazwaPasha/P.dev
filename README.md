# Handoff: 3D Interactive Portfolio Site

## Overview
A personal portfolio site (Home, About, Projects) with an iOS liquid-glass aesthetic, a cursor-tracking 3D character hero on the Home screen, a butterfly-shaped custom cursor, and icon-based top navigation.

## About the Design Files
The files in this bundle are **design references built in HTML** — working prototypes showing intended look, layout, and behavior, not production code to copy directly. The task is to recreate these designs in the target codebase's existing environment (React, Vue, native, etc.) using its established patterns and libraries — or, if no environment exists yet, choose the most appropriate framework and implement there. The 3D hero specifically uses three.js directly; keep or reimplement via react-three-fiber (or equivalent) depending on the target stack.

## Fidelity
**High-fidelity.** Colors, spacing, typography, and the 3D behavior are final — recreate pixel- and behavior-accurate.

## Screens / Views

### Home (Home.dc.html)
- **Purpose**: Landing screen with a live 3D character hero that reacts to the cursor.
- **Layout**: Full-viewport (`100vh`, no page scroll). Fixed pill nav centered at top (`top:20px`). Hero section fills the remaining vertical space below the nav (absolutely positioned container: `top:120px` to `bottom:40px`, `max-width:760px`, centered horizontally) — do NOT use percentage `height:100%` through a conditional-render wrapper; it collapses to `min-height`. Prefer flex `flex:1`/`min-height:0` or absolute positioning against the viewport.
- **Components**:
  - **3D hero (canvas)**: three.js scene loading `avatar.glb` (GLTF/GLB, Draco + Meshopt compressed — register `DRACOLoader` + `MeshoptDecoder` on the `GLTFLoader`). Camera framed to crop from hairline (~top 2% of model bbox) to just above the belly (~62% down the bbox), filling the frame vertically edge-to-edge with no margin (`dist = distForHeight` only — do not average with a width-based distance, or wide/short viewports leave letterbox gaps). Head bone rotates toward cursor position (mapped from pointer coords to a small yaw/pitch range). Idle animation loop: breathing pulse (subtle chest/scale oscillation), gentle sway, vertical bob — all continuous, low-amplitude, always running. Blink driven by morph targets (`eyeBlinkLeft`/`eyeBlinkRight` or similar) on an interval with randomized jitter (~2-5s). Arms manually posed via bone rotation (upperarm bent ~0.75-0.85 rad in, forearm ~0.1 rad) to rest naturally at the sides/hips rather than the model's default T-pose — do this once after load, before the render loop starts, on bones matched by name regex (`arm`, `forearm`, `hand`, case-insensitive, `left`/`right` sign flip).
  - **Lighting**: ambient light (soft fill) + one key directional light + one cool rim directional light from the back-left.
  - **Lens materials**: any material named with `lens`/`glass` (excluding `frame`) set `transparent:true`, `opacity:~0.25`, `depthWrite:false` so glasses read as glass.
  - **Fallback**: if the GLB fails to load (timeout ~45s, cancelled on first download-progress event), show a static image (`image-slot`) instead of the 3D canvas.
  - **Custom cursor**: butterfly-shaped SVG (two wings, wing-flap keyframe animation ~0.32s loop) that follows the pointer (`position:fixed`, transformed via JS on `pointermove`); the OS cursor is hidden (`cursor:none`) over the hero.
  - **Nav pill**: `position:fixed`, top-centered, frosted glass (`backdrop-filter:blur(24px) saturate(160%)`, translucent white background, subtle border + shadow), three icon links (house/person/grid), active icon tinted blue, inactive gray, `gap:20px` between icons.
- **Background**: soft multi-color radial blur blobs (blue/purple, `filter:blur(90px)`) behind everything, low opacity.

### About / Projects (About.dc.html, Projects.dc.html)
- Same nav pill and background treatment as Home; no 3D hero. (Recreate their specific content from those files directly — not detailed further here since this handoff focuses on the 3D hero work.)

## Interactions & Behavior
- Pointer move over the page → hero head bone yaw/pitch toward pointer, clamped to a small natural range; smoothed (lerp), not instant.
- Idle (no recent pointer movement) → breathing/sway/bob continue regardless; head slowly returns toward center-facing.
- Blink fires on its own timer, independent of gaze.
- Nav links are plain anchors to the sibling HTML files; active state = current page's icon tinted.
- Butterfly cursor wings flap continuously; position tracks the real pointer 1:1.

## State Management
- Load state machine: `loading → loaded` or `loading → fallback` (on error or watchdog timeout).
- Pointer position (normalized -1..1 or similar) stored and smoothed per frame for head tracking.
- Blink state: boolean/weight ramped up/down around scheduled blink times.
- Idle animation phase: continuous elapsed-time based (no discrete state needed, just `clock.getElapsedTime()`).

## Design Tokens
- Background wash: `oklch(97% 0.01 260)` base, blurred blob accents `oklch(78% 0.12 255)` (blue) and `oklch(78% 0.12 305)` (purple/pink).
- Nav active icon color: `oklch(58% 0.16 255)`; inactive: `oklch(70% 0.01 260)`.
- Cursor butterfly wing color: `oklch(62% 0.16 255)`.
- Nav pill radius: full pill (`border-radius:999px`); nav icon hit targets `32x32px`.
- Camera FOV: 35°.

## Assets
- `avatar.glb` — the 3D character model (GLTF binary, Draco/Meshopt-compressed, includes morph targets for facial blendshapes including blink).
- No other custom image/icon assets; nav icons are inline SVG paths (house/person-silhouette/grid).

## Files
- `Home.dc.html` — hero + 3D character logic (all of the above).
- `About.dc.html`, `Projects.dc.html` — other pages sharing nav/background.
- `avatar.glb` — character model referenced by Home.dc.html.
