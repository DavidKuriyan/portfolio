import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Procedural "Guardian Shield" geometry — shared by the on-site R3F viewer
 * and the GLB exporter so the exported model matches what renders live.
 *
 * The shield silhouette is a rounded heraldic shield built from a Shape,
 * then extruded and beveled to give it real 3D depth.
 */

export const SHIELD = {
  /** Overall height of the shield (world units). */
  height: 3.0,
  /** Overall width of the shield. */
  width: 2.3,
  /** Extrusion depth of the glass body. */
  depth: 0.22,
  /** Rim bevel size. */
  bevel: 0.07,
} as const;

/**
 * Heraldic shield outline centered at the origin (x = width axis, y = height axis).
 * Wide shoulders at the top, tapering to a point at the bottom.
 */
export function shieldOutline(width: number = SHIELD.width, height: number = SHIELD.height): THREE.Shape {
  const s = new THREE.Shape();
  const hw = width / 2;
  const hh = height / 2;

  s.moveTo(0, hh); // top center
  // Top edge with slightly rounded shoulders
  s.lineTo(hw * 0.78, hh);
  s.quadraticCurveTo(hw, hh, hw, hh * 0.82);
  // Right side straight down, then curving to the bottom point
  s.lineTo(hw, hh * 0.05);
  s.quadraticCurveTo(hw, -hh * 0.62, 0, -hh);
  // Left side mirrored
  s.quadraticCurveTo(-hw, -hh * 0.62, -hw, hh * 0.05);
  s.lineTo(-hw, hh * 0.82);
  s.quadraticCurveTo(-hw, hh, -hw * 0.78, hh);
  s.lineTo(0, hh);

  return s;
}

/** Slightly inset outline, used for the inner bevel/frame. */
export function shieldInset(inset: number): THREE.Shape {
  return shieldOutline(SHIELD.width - inset * 2, SHIELD.height - inset * 2);
}

/** Extrude a shield shape into a solid slab with beveled edges. */
function extrudeShield(shape: THREE.Shape, depth: number, bevel: number): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 5,
    curveSegments: 48,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

/**
 * A grid of points sampled inside the shield silhouette, used to grow
 * circuit-trace polylines between neighbouring nodes.
 */
function pointsInShield(count: number, rng: () => number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const hw = SHIELD.width / 2 - 0.25;
  const hh = SHIELD.height / 2 - 0.25;
  let guard = 0;
  while (pts.length < count && guard++ < count * 40) {
    const x = (rng() * 2 - 1) * hw;
    const y = (rng() * 2 - 1) * hh;
    // Approximate inside test against the shield silhouette.
    const t = y / hh; // -1 bottom .. 1 top
    const halfWidthAt = t >= 0 ? hw : hw * (1 - Math.pow(-t, 1.4) * 0.95);
    if (Math.abs(x) <= halfWidthAt) {
      pts.push(new THREE.Vector3(x, y, 0));
    }
  }
  return pts;
}

/** Deterministic RNG so the design is stable between viewer and exporter. */
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

export type CircuitNetwork = {
  /** Merged geometry of all circuit traces (thin boxes). */
  traces: THREE.BufferGeometry;
  /** Merged geometry of all circuit nodes (spheres). */
  nodes: THREE.BufferGeometry;
  /** Node positions for sequential illumination. */
  nodePositions: THREE.Vector3[];
};

/** Build circuit traces + nodes connecting interior points inside the shield. */
export function buildCircuitNetwork(seed = 1337): CircuitNetwork {
  const rng = mulberry32(seed);
  const pts = pointsInShield(22, rng);
  const traceGeos: THREE.BufferGeometry[] = [];
  const nodeGeos: THREE.BufferGeometry[] = [];

  const traceMat = new THREE.BoxGeometry(1, 1, 1); // unit box, scaled per trace

  // Connect each point to its 1–2 nearest neighbours to form traces.
  pts.forEach((p, i) => {
    const neighbours = pts
      .map((q, j) => ({ q, j, d: p.distanceTo(q) }))
      .filter((n) => n.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);

    neighbours.forEach(({ q }) => {
      const dir = new THREE.Vector3().subVectors(q, p);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(p, q).multiplyScalar(0.5);
      const g = traceMat.clone();
      g.scale(len, 0.018, 0.018);
      // Orient box along the segment.
      const angle = Math.atan2(dir.y, dir.x);
      const rot = new THREE.Matrix4().makeRotationZ(angle);
      g.applyMatrix4(rot);
      g.translate(mid.x, mid.y, 0);
      traceGeos.push(g);
    });

    const node = new THREE.SphereGeometry(0.045, 16, 12);
    node.translate(p.x, p.y, 0);
    nodeGeos.push(node);
  });

  traceMat.dispose();

  return {
    traces: mergeGeometries(traceGeos, false)!,
    nodes: mergeGeometries(nodeGeos, false)!,
    nodePositions: pts,
  };
}

/** Orbiting particle positions around the outer edge of the shield. */
export function buildParticles(count = 90, seed = 99): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const pos = new Float32Array(count * 3);
  const hw = SHIELD.width / 2 + 0.12;
  const hh = SHIELD.height / 2 + 0.12;
  for (let i = 0; i < count; i++) {
    const t = rng() * Math.PI * 2;
    // Parametric path hugging the shield outline (ellipse-ish).
    const r = 1 + (rng() - 0.5) * 0.08;
    pos[i * 3 + 0] = Math.cos(t) * hw * r;
    pos[i * 3 + 1] = Math.sin(t) * hh * r;
    pos[i * 3 + 2] = (rng() - 0.5) * 0.5;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

export type ShieldMeshes = {
  glass: THREE.BufferGeometry;
  rim: THREE.BufferGeometry;
  ridge: THREE.BufferGeometry;
  circuit: CircuitNetwork;
  core: THREE.BufferGeometry;
  particles: THREE.BufferGeometry;
};

/** Assemble all shield meshes. */
export function buildShieldMeshes(): ShieldMeshes {
  // Outer glass body (transparent ice-blue crystal).
  const glass = extrudeShield(shieldOutline(), SHIELD.depth, SHIELD.bevel);

  // Polished silver rim — an inner ring inset from the outer edge.
  const rimShape = shieldInset(0.02);
  rimShape.holes.push(shieldInset(0.16));
  const rim = extrudeShield(rimShape, SHIELD.depth + 0.06, SHIELD.bevel * 0.8);

  // Decorative inner ridge/frame just inside the rim.
  const ridgeShape = shieldInset(0.2);
  ridgeShape.holes.push(shieldInset(0.27));
  const ridge = extrudeShield(ridgeShape, SHIELD.depth + 0.02, 0.02);

  // Glowing cyan energy core at the center.
  const core = new THREE.IcosahedronGeometry(0.42, 3);

  return {
    glass,
    rim,
    ridge,
    circuit: buildCircuitNetwork(),
    core,
    particles: buildParticles(),
  };
}
