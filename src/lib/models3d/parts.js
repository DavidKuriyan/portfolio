import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Deterministic RNG so models look identical on every load and match the GLB.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const C = {
  CYAN: "#1ABCD8",
  ICE: "#9fe8f5",
  ICE2: "#E7F4F9",
  SILVER: "#d8dde3",
  NAVY: "#10182D",
};

/** Merge many geometries into one (returns null-safe). */
export function merge(geos, useGroups = false) {
  const list = geos.filter(Boolean);
  if (list.length === 0) return new THREE.BufferGeometry();
  // Normalize: convert everything to non-indexed so attributes are compatible.
  const normalized = list.map((g) => {
    const ng = g.index ? g.toNonIndexed() : g;
    // Ensure position/normal/uv attributes exist consistently.
    if (!ng.attributes.normal) ng.computeVertexNormals();
    return ng;
  });
  const result = mergeGeometries(normalized, useGroups);
  return result || new THREE.BufferGeometry();
}

/** Build a tube along a list of Vector3 points. */
export function tubeAlong(points, radius = 0.014, closed = false, segs = 64) {
  const curve = new THREE.CatmullRomCurve3(points, closed, "centripetal");
  return new THREE.TubeGeometry(curve, segs, radius, 6, closed);
}

/** A straight cylinder "link" between two points. */
export function linkGeo(a, b, radius = 0.008) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const g = new THREE.CylinderGeometry(radius, radius, len, 6);
  g.translate(0, len / 2, 0);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()));
  g.translate(a.x, a.y, a.z);
  return g;
}

/** A flat torus ring lying in the XZ plane (horizontal). */
export function ringGeo(radius, tube = 0.03, segs = 160) {
  const g = new THREE.TorusGeometry(radius, tube, 16, segs);
  g.rotateX(Math.PI / 2);
  return g;
}

/** Evenly spaced node spheres around a ring of `radius`. */
export function ringNodesGeo(radius, count, size = 0.05, y = 0) {
  const geos = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const g = new THREE.SphereGeometry(size, 12, 8);
    g.translate(Math.cos(a) * radius, y, Math.sin(a) * radius);
    geos.push(g);
  }
  return merge(geos);
}

/** Fibonacci sphere point distribution (even coverage). */
export function fibonacciSphere(n, radius, rng = Math.random) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
  }
  return pts;
}

/**
 * Build a network graph: nodes + links to nearby neighbours + ready-to-travel
 * packet paths. Shapes: "sphere" | "ellipsoid" | "brain" | "cloud".
 */
export function buildGraph({
  count = 90,
  shape = "sphere",
  radius = 1.4,
  seed = 1,
  maxLink = 0.62,
  maxLinks = 3,
  gap = 0,
  centerNode = false,
}) {
  const rng = mulberry32(seed);
  let pts = [];
  if (shape === "sphere" || shape === "ellipsoid") {
    pts = fibonacciSphere(count, radius, rng);
    if (shape === "ellipsoid") {
      pts = pts.map((p) => new THREE.Vector3(p.x * 0.82, p.y * 1.0, p.z * 0.7));
    }
  } else if (shape === "brain") {
    // Two lobes with a central fissure gap.
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const u = rng() * Math.PI * 2;
      const v = Math.acos(2 * rng() - 1);
      const r = radius * (0.7 + rng() * 0.3);
      let x = Math.sin(v) * Math.cos(u) * r * 0.78;
      const y = Math.cos(v) * r * 0.86;
      const z = Math.sin(v) * Math.sin(u) * r * 0.92;
      x = Math.abs(x) * side + side * gap;
      // squash the underside to suggest a brain silhouette
      pts.push(new THREE.Vector3(x, y - (y < 0 ? 0.12 : 0), z));
    }
  } else {
    // cloud
    for (let i = 0; i < count; i++) {
      pts.push(new THREE.Vector3((rng() - 0.5) * radius * 2, (rng() - 0.5) * radius * 2, (rng() - 0.5) * radius * 2));
    }
  }

  const nodes = pts.map((p) => p.clone());

  // Connect each node to its nearest neighbours.
  const edges = [];
  const seen = new Set();
  pts.forEach((p, i) => {
    const near = pts
      .map((q, j) => ({ j, d: p.distanceTo(q) }))
      .filter((n) => n.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, maxLinks);
    near.forEach(({ j, d }) => {
      if (d > maxLink) return;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      edges.push([i, j]);
    });
  });

  if (centerNode) {
    nodes.push(new THREE.Vector3(0, 0, 0));
    const ci = nodes.length - 1;
    pts.forEach((_, i) => edges.push([i, ci]));
  }

  // Precompute smooth paths for travelling packets.
  const curves = edges.map(([a, b]) => {
    const A = nodes[a];
    const B = nodes[b];
    const mid = new THREE.Vector3().addVectors(A, B).multiplyScalar(0.5);
    // slight outward bow so links read as arcs
    mid.multiplyScalar(1.12);
    return new THREE.CatmullRomCurve3([A, mid, B], false, "centripetal");
  });

  // Geometry of all links merged into a single mesh.
  const links = merge(edges.map(([a, b]) => linkGeo(nodes[a], nodes[b], 0.006)));
  const nodeGeo = merge(nodes.map((p) => new THREE.SphereGeometry(0.032, 10, 8).translate(p.x, p.y, p.z)));

  return { nodes, edges, curves, links, nodeGeo };
}

/** Merged small octahedra at given positions (export-friendly particles). */
export function particlesGeo(positions, size = 0.02) {
  return merge(positions.map((p) => new THREE.OctahedronGeometry(size, 0).translate(p.x, p.y, p.z)));
}
