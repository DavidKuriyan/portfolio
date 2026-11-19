# David Kuriyan E — Cybersecurity Portfolio

Premium personal portfolio built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, **Motion**, and **React Three Fiber / Three.js**.

## Features

- Animated 3D hero cube (desktop only — disabled on phones for smooth scrolling)
- Sections: About, Arsenal, Case Files, Field Work, Credentials, Contact
- Real project screenshots and genuine tool logos
- Three interactive 3D showcase pages with downloadable `.glb` models:
  - `/showcase/network-sphere` — Global Network Sphere
  - `/showcase/data-cube` — Encrypted Data Cube
  - `/showcase/ai-security-core` — AI Security Core
- Legacy 3D pages: `/shield`, `/fortress`, `/lock`, `/fingerprint`
- Command palette (`Ctrl/Cmd + K`), synthesized UI sounds (Web Audio, no audio files)
- Fully mobile-responsive: offscreen 3D canvases pause rendering, reduced DPR on touch devices, no layout shift or horizontal overflow

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Production

```bash
npm run build
npm start
```

To test from a phone on the same network:

```bash
npx next start -H 0.0.0.0 -p 3100
```

Then open `http://<your-laptop-LAN-IP>:3100` on the phone. For dev mode over LAN, add the laptop's IP to `allowedDevOrigins` in `next.config.ts`.

## Regenerating the showcase GLB models

```bash
npx tsx scripts/exportModels3d.ts
```

Exports the builders in `src/lib/models3d/catalog.js` to `public/glb/*.glb`.

## Structure

```
src/app          # routes (home, showcase/*, legacy 3D pages)
src/components   # UI + 3D stage components
src/lib          # profile data, geometry builders, sound engine
public           # logo, tool logos, case-file screenshots, GLB models
scripts          # GLB export utility
```
"# portfolio" 
