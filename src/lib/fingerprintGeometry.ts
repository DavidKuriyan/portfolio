import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Procedural "Biometric Fingerprint Scanner" geometry — shared by the on-site
 * R3F viewer and the GLB exporter.
 *
 * Anatomy:
 *   - A 3D fingerprint sculpture from many flowing ridge lines in a whorl
 *     pattern, displaced into a circular 3D dome.
 *   - A glowing cyan biometric core at the centre.
 *   - A rotating outer circular scanner ring.
 *   - A scanning beam bar that sweeps across the ridges.
 */

export const FP = {
  radius: 1.6,
  ridges: 46,
  domeHeight: 0.32,
  ridgeTube: 0.014,
  ringRadius: 2.0,
} as const;

export type FingerprintMeshes = {
  ridges: THREE.BufferGeometry;
  ridgeGroups: { geometry: THREE.BufferGeometry; order: number }[];
  core: THREE.BufferGeometry;
  coreHalo: THREE.BufferGeometry;
  ring: THREE.BufferGeometry;
  ringTicks: THREE.BufferGeometry;
  scanBeam: THREE.BufferGeometry;
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

function ridgeCurve(index: number, total: number): THREE.CatmullRomCurve3 {
  const rng = mulberry32(1000 + index);
  const t = index / (total - 1);
  const baseR = 0.08 + t * FP.radius * 0.92;
  const squash = 1.28 - t * 0.18;
  const irregularity = t * 0.12;
  const phase = rng() * Math.PI * 2;
  const points: THREE.Vector3[] = [];
  const segs = 72;
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    const wob =
      1 +
      irregularity * Math.sin(a * 3 + phase) +
      irregularity * 0.5 * Math.sin(a * 5 - phase);
    const x = Math.cos(a) * baseR * wob;
    const y = Math.sin(a) * baseR * squash * wob;
    const radial = Math.hypot(x, y) / FP.radius;
    const z = FP.domeHeight * Math.cos(radial * Math.PI * 0.5);
    points.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(points, true, "centripetal");
}

function buildRidges() {
  const groups: { geometry: THREE.BufferGeometry; order: number }[] = [];
  const bands = 6;
  const perBand = Math.ceil(FP.ridges / bands);
  for (let b = 0; b < bands; b++) {
    const geos: THREE.BufferGeometry[] = [];
    const start = b * perBand;
    const end = Math.min(FP.ridges, start + perBand);
    for (let i = start; i < end; i++) {
      const curve = ridgeCurve(i, FP.ridges);
      geos.push(new THREE.TubeGeometry(curve, 96, FP.ridgeTube, 6, true));
    }
    groups.push({ geometry: mergeGeometries(geos, false)!, order: b });
  }
  const all = mergeGeometries(
    groups.map((g) => g.geometry.clone()),
    false,
  )!;
  return { groups, all };
}

function buildCore() {
  return {
    core: new THREE.IcosahedronGeometry(0.16, 3),
    halo: new THREE.IcosahedronGeometry(0.16, 3),
  };
}

function buildRing() {
  const ring = new THREE.TorusGeometry(FP.ringRadius, 0.03, 20, 200);
  ring.rotateX(Math.PI / 2);

  const tickGeos: THREE.BufferGeometry[] = [];
  const tickCount = 90;
  for (let i = 0; i < tickCount; i++) {
    const a = (i / tickCount) * Math.PI * 2;
    const long = i % 5 === 0;
    const len = long ? 0.16 : 0.08;
    const tick = new THREE.BoxGeometry(0.012, 0.012, len);
    const r = FP.ringRadius + (long ? 0.12 : 0.08);
    tick.translate(0, 0, len / 2);
    tick.rotateX(Math.PI / 2);
    tick.rotateY(-a);
    tick.translate(Math.cos(a) * r, 0, Math.sin(a) * r);
    tickGeos.push(tick);
  }
  return { ring, ringTicks: mergeGeometries(tickGeos, false)! };
}

function buildScanBeam() {
  return new THREE.BoxGeometry(0.05, FP.radius * 2.1, 0.02);
}

function buildParticles(count = 80, seed = 13): THREE.BufferGeometry {
  const rng = mulberry32(seed);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = rng() * Math.PI * 2;
    const r = FP.ringRadius + 0.1 + rng() * 0.7;
    pos[i * 3 + 0] = Math.cos(a) * r;
    pos[i * 3 + 1] = (rng() - 0.5) * 0.6;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
}

export function buildFingerprintMeshes(): FingerprintMeshes {
  const { groups, all } = buildRidges();
  const { core, halo } = buildCore();
  const { ring, ringTicks } = buildRing();
  return {
    ridges: all,
    ridgeGroups: groups,
    core,
    coreHalo: halo,
    ring,
    ringTicks,
    scanBeam: buildScanBeam(),
    particles: buildParticles(),
  };
}
