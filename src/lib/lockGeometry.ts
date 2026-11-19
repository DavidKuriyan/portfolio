import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Procedural "Security Lock" geometry — shared by the on-site R3F viewer
 * and the GLB exporter so the exported model matches what renders live.
 *
 * Anatomy:
 *   - Transparent crystal-glass lock body (rounded, beveled).
 *   - Chrome/silver shackle (a U-tube) that can open & close.
 *   - Glowing cyan encrypted core inside the body.
 *   - Fine circuit traces across the glass surface.
 *   - A cyan energy ring orbiting the body.
 *   - Floating particles.
 */

export const LOCK = {
  /** Lock body width. */
  bodyW: 1.7,
  /** Lock body height. */
  bodyH: 1.5,
  /** Lock body depth. */
  bodyD: 0.7,
  /** Shackle tube radius. */
  shackleTube: 0.085,
  /** Shackle major radius. */
  shackleR: 0.48,
  /** Shackle vertical leg length. */
  shackleLeg: 0.7,
} as const;

export type LockMeshes = {
  body: THREE.BufferGeometry;
  core: THREE.BufferGeometry;
  coreCircuit: THREE.BufferGeometry;
  surfaceCircuit: THREE.BufferGeometry;
  shackle: THREE.BufferGeometry;
  energyRing: THREE.BufferGeometry;
  particles: THREE.BufferGeometry;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rounded-rectangle shape helper. */
function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Rounded, beveled glass lock body. */
function buildBody(): THREE.BufferGeometry {
  const shape = roundedRect(LOCK.bodyW, LOCK.bodyH, 0.3);
  // Punch a rounded hole in the top-center where the shackle seats.
  const hole = new THREE.Path();
  const hr = 0.16;
  const hy = LOCK.bodyH / 2 - 0.12;
  hole.absarc(0, hy, hr, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: LOCK.bodyD,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 6,
    curveSegments: 32,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

/**
 * Chrome shackle — a U shape made from a half-torus + two straight legs.
 * Positioned so its legs enter the body's top hole.
 */
function buildShackle(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  const { shackleTube, shackleR, shackleLeg } = LOCK;

  // Half torus forming the arch (upper half).
  const arch = new THREE.TorusGeometry(shackleR, shackleTube, 20, 48, Math.PI);
  // arch is in XY plane, opening downward; raise so legs reach the body top.
  geos.push(arch);

  // Two straight legs dropping from the arch ends into the body.
  const legGeo = new THREE.CapsuleGeometry(shackleTube, shackleLeg, 8, 16);
  const left = legGeo.clone();
  left.translate(-shackleR, -shackleLeg / 2, 0);
  const right = legGeo.clone();
  right.translate(shackleR, -shackleLeg / 2, 0);
  geos.push(left, right);

  const merged = mergeGeometries(geos, false)!;
  // Lift the whole shackle so legs sit inside the body's top hole.
  merged.translate(0, LOCK.bodyH / 2 - 0.12, 0);
  return merged;
}

/** Glowing encrypted core — a faceted crystal inside the body. */
function buildCore(): THREE.BufferGeometry {
  const g = new THREE.OctahedronGeometry(0.34, 1);
  g.scale(1, 1.25, 0.8);
  return g;
}

/** Internal circuit lattice around the core. */
function buildCoreCircuit(seed = 5): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const geos: THREE.BufferGeometry[] = [];
  // Rings at various heights + spokes.
  for (let i = 0; i < 4; i++) {
    const y = (i - 1.5) * 0.18;
    const r = 0.3 + rng() * 0.08;
    const ring = new THREE.TorusGeometry(r, 0.008, 8, 48);
    ring.rotateX(Math.PI / 2);
    ring.translate(0, y, 0);
    geos.push(ring);
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const spoke = new THREE.BoxGeometry(0.5, 0.008, 0.008);
    spoke.rotateY(a);
    spoke.translate(0, 0, 0);
    // push spokes to varying heights
    spoke.translate(0, (rng() - 0.5) * 0.4, 0);
    geos.push(spoke);
  }
  return mergeGeometries(geos, false)!;
}

/** Fine circuit traces across the front & back glass surface. */
function buildSurfaceCircuit(seed = 42): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const geos: THREE.BufferGeometry[] = [];
  const W = LOCK.bodyW * 0.72;
  const H = LOCK.bodyH * 0.72;

  // Horizontal + vertical traces forming a PCB-like grid with gaps.
  for (let i = 0; i < 7; i++) {
    const y = -H / 2 + (i / 6) * H;
    const len = W * (0.5 + rng() * 0.5);
    const seg = new THREE.BoxGeometry(len, 0.012, 0.012);
    seg.translate((rng() - 0.5) * (W - len), y, 0);
    geos.push(seg);
  }
  for (let i = 0; i < 5; i++) {
    const x = -W / 2 + (i / 4) * W;
    const len = H * (0.4 + rng() * 0.5);
    const seg = new THREE.BoxGeometry(0.012, len, 0.012);
    seg.translate(x, (rng() - 0.5) * (H - len), 0);
    geos.push(seg);
  }
  // Node pads.
  for (let i = 0; i < 14; i++) {
    const pad = new THREE.CylinderGeometry(0.035, 0.035, 0.02, 16);
    pad.rotateX(Math.PI / 2);
    pad.translate(
      (rng() - 0.5) * W,
      (rng() - 0.5) * H,
      0,
    );
    geos.push(pad);
  }

  const merged = mergeGeometries(geos, false)!;
  // Place a copy on the front and a mirrored copy on the back.
  const front = merged.clone();
  front.translate(0, 0, LOCK.bodyD / 2 + 0.1);
  const back = merged.clone();
  back.rotateY(Math.PI);
  back.translate(0, 0, -(LOCK.bodyD / 2 + 0.1));
  return mergeGeometries([merged.translate(0, 0, 0), front, back], false)!;
}

/** A thin energy ring that will orbit the body (torus). */
function buildEnergyRing(): THREE.BufferGeometry {
  const g = new THREE.TorusGeometry(1.15, 0.022, 12, 128);
  return g;
}

/** Gentle floating particles around the lock. */
function buildParticles(count = 60, seed = 77): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = rng() * Math.PI * 2;
    const r = 1.1 + rng() * 0.9;
    pos[i * 3 + 0] = Math.cos(a) * r;
    pos[i * 3 + 1] = (rng() - 0.5) * 2.4;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

export function buildLockMeshes(): LockMeshes {
  return {
    body: buildBody(),
    core: buildCore(),
    coreCircuit: buildCoreCircuit(),
    surfaceCircuit: buildSurfaceCircuit(),
    shackle: buildShackle(),
    energyRing: buildEnergyRing(),
    particles: buildParticles(),
  };
}
