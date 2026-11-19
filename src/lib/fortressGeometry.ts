import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Procedural "Zero Trust Fortress" geometry — shared by the on-site R3F viewer
 * and the GLB exporter so the exported model matches what renders live.
 *
 * Structure (concentric, along Y):
 *   - Glowing cyan energy core at the centre.
 *   - A glass hexagonal core shell.
 *   - Three independently-rotating protective rings (Identity → Authentication → Access).
 *   - A breathing outer glass barrier (expands/contracts in a loop).
 */

export const FORTRESS = {
  /** Core radius. */
  coreRadius: 0.42,
  /** Radii of the three security rings (Identity, Auth, Access). */
  ringRadii: [1.15, 1.6, 2.05] as const,
  /** Base radius of the breathing outer barrier. */
  barrierRadius: 2.6,
  /** Barrier half-height. */
  barrierHeight: 3.0,
  /** Radius of each ring torus tube. */
  ringTube: 0.045,
} as const;

export type SecurityRing = {
  geometry: THREE.BufferGeometry;
  /** Node markers sitting on the ring (access points / checkpoints). */
  nodes: THREE.BufferGeometry;
  /** Luminous circuit inlay on the ring plane. */
  inlay: THREE.BufferGeometry;
};

export type FortressMeshes = {
  core: THREE.BufferGeometry;
  coreShell: THREE.BufferGeometry;
  coreCircuit: THREE.BufferGeometry;
  rings: SecurityRing[];
  barrier: THREE.BufferGeometry;
  travellers: THREE.BufferGeometry;
};

/** Deterministic RNG so viewer and exporter match. */
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

/** A security ring = torus band + checkpoint node spheres + radial circuit inlay. */
function buildRing(radius: number, nodeCount: number, seed: number): SecurityRing {
  const rng = mulberry32(seed);

  // Main band.
  const band = new THREE.TorusGeometry(radius, FORTRESS.ringTube, 24, 160);
  band.rotateX(Math.PI / 2); // lie flat in the XZ plane

  // A secondary thinner band slightly offset for a "layered" premium look.
  const thin = new THREE.TorusGeometry(radius, FORTRESS.ringTube * 0.4, 16, 160);
  thin.rotateX(Math.PI / 2);
  thin.translate(0, 0.12, 0);

  // Checkpoint nodes evenly spaced on the ring.
  const nodeGeos: THREE.BufferGeometry[] = [];
  const inlayGeos: THREE.BufferGeometry[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const a = (i / nodeCount) * Math.PI * 2;
    const x = Math.cos(a) * radius;
    const z = Math.sin(a) * radius;

    const node = new THREE.OctahedronGeometry(0.085, 0);
    node.translate(x, 0, z);
    nodeGeos.push(node);

    // Radial inlay spokes connecting this node inward toward the core.
    const innerR = radius * 0.7;
    const segLen = radius - innerR;
    const spoke = new THREE.BoxGeometry(segLen, 0.012, 0.012);
    const mid = (radius + innerR) / 2;
    spoke.rotateY(-a);
    spoke.translate(Math.cos(a) * mid, 0, Math.sin(a) * mid);
    inlayGeos.push(spoke);

    // Occasional short tangential tick for circuit texture.
    if (rng() > 0.5) {
      const tick = new THREE.BoxGeometry(0.012, 0.012, 0.16);
      const ta = a + 0.18;
      tick.translate(Math.cos(ta) * innerR, 0, Math.sin(ta) * innerR);
      inlayGeos.push(tick);
    }
  }

  const geometry = mergeGeometries([band, thin], false)!;
  const nodes = mergeGeometries(nodeGeos, false)!;
  const inlay = mergeGeometries(inlayGeos, false)!;

  return { geometry, nodes, inlay };
}

/** Glowing circuit panels dotted over the core shell surface. */
function buildCoreCircuit(seed = 7): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const geos: THREE.BufferGeometry[] = [];
  const R = FORTRESS.coreRadius;
  // Latitude/longitude grid lines hugging the sphere.
  for (let i = 0; i < 6; i++) {
    const lat = new THREE.TorusGeometry(R * 1.005, 0.008, 8, 64);
    lat.rotateX(Math.PI / 2);
    lat.translate(0, (i - 2.5) * (R * 0.32), 0);
    // scale the torus down near the poles to avoid poking through
    const shrink = Math.cos(((i - 2.5) * (R * 0.32)) / R);
    if (shrink > 0.15) {
      lat.scale(shrink, 1, shrink);
      geos.push(lat);
    }
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const lon = new THREE.TorusGeometry(R * 1.005, 0.008, 8, 64);
    lon.rotateY(a);
    geos.push(lon);
  }
  // A few random short meridian dashes for detail.
  for (let i = 0; i < 10; i++) {
    const dash = new THREE.BoxGeometry(0.012, 0.012, R * 0.5);
    const a = rng() * Math.PI * 2;
    dash.rotateY(a);
    geos.push(dash);
  }
  return mergeGeometries(geos, false)!;
}

/** The breathing outer glass barrier — an open glass cylinder (lathed). */
function buildBarrier(): THREE.BufferGeometry {
  const R = FORTRESS.barrierRadius;
  const H = FORTRESS.barrierHeight;
  // Lathe a rounded-top profile for a "capsule barrier" silhouette.
  const pts: THREE.Vector2[] = [];
  const segs = 12;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const y = -H / 2 + t * H;
    const bump = Math.sin(t * Math.PI) * 0.12; // slight barrel bulge
    pts.push(new THREE.Vector2(R + bump, y));
  }
  const geo = new THREE.LatheGeometry(pts, 96);
  // Make it double-sided in the viewer; exporter keeps normals.
  return geo;
}

/**
 * Particles that travel between layers — positioned on paths linking
 * the core out to the outer barrier along random angles.
 */
export function buildTravellers(count = 70, seed = 21): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const pos = new Float32Array(count * 3);
  const maxR = FORTRESS.barrierRadius * 0.95;
  for (let i = 0; i < count; i++) {
    const a = rng() * Math.PI * 2;
    // Distribute radii across all the rings + gaps so particles sit "between layers".
    const t = rng();
    const r = 0.5 + t * (maxR - 0.5);
    const y = (rng() - 0.5) * FORTRESS.barrierHeight * 0.6;
    pos[i * 3 + 0] = Math.cos(a) * r;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

/** Assemble all fortress meshes. */
export function buildFortressMeshes(): FortressMeshes {
  const core = new THREE.IcosahedronGeometry(FORTRESS.coreRadius * 0.78, 3);
  const coreShell = new THREE.IcosahedronGeometry(FORTRESS.coreRadius, 4);
  const coreCircuit = buildCoreCircuit();

  const rings = FORTRESS.ringRadii.map((r, i) =>
    buildRing(r, 6 + i * 2, 100 + i * 17),
  );

  return {
    core,
    coreShell,
    coreCircuit,
    rings,
    barrier: buildBarrier(),
    travellers: buildTravellers(),
  };
}
