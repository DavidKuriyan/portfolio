import * as THREE from "three";
import {
  C,
  mulberry32,
  merge,
  tubeAlong,
  linkGeo,
  ringGeo,
  ringNodesGeo,
  fibonacciSphere,
  buildGraph,
  particlesGeo,
} from "./parts.js";

const { CYAN, ICE, ICE2, SILVER, NAVY } = C;

// ---------- shared materials ----------
const glass = (color = ICE, opacity = 0.28) =>
  new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness: 0.06,
    transmission: 1,
    thickness: 0.3,
    ior: 1.45,
    transparent: true,
    opacity,
    clearcoat: 1,
    envMapIntensity: 1.3,
    emissive: new THREE.Color(NAVY),
    emissiveIntensity: 0.1,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
const chrome = (rough = 0.12) =>
  new THREE.MeshStandardMaterial({ color: SILVER, metalness: 1, roughness: rough, envMapIntensity: 1.5 });
const glowMat = (color = CYAN, intensity = 1.6) =>
  new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.3, toneMapped: false });
const iceGlow = (intensity = 1.0) => glowMat(ICE, intensity);

// ===================================================================
// 6. GLOBAL NETWORK SPHERE
// ===================================================================
function buildGlobe() {
  const g = new THREE.Group();
  g.name = "NetworkSphere";

  const graph = buildGraph({ count: 150, shape: "sphere", radius: 1.5, seed: 6, maxLink: 0.6, maxLinks: 3 });

  // Outer glass globe.
  const globe = new THREE.Mesh(new THREE.SphereGeometry(1.55, 64, 48), glass(ICE2, 0.14));
  globe.name = "Globe";
  g.add(globe);

  // Node + link meshes.
  const links = new THREE.Mesh(graph.links, iceGlow(0.7));
  links.name = "NetworkLinks";
  g.add(links);
  const nodes = new THREE.Mesh(graph.nodeGeo, glowMat(CYAN, 1.6));
  nodes.name = "NetworkNodes";
  g.add(nodes);

  // Protective shield at centre.
  const shield = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), glowMat(CYAN, 2));
  shield.scale.set(0.8, 1, 0.8);
  shield.name = "CentralShield";
  g.add(shield);
  const shieldLight = new THREE.PointLight(new THREE.Color(CYAN), 5, 5);
  shieldLight.position.set(0, 0, 0);
  g.add(shieldLight);

  // Data packets travelling along links.
  const packetCount = 26;
  const packetMeshes = [];
  for (let i = 0; i < packetCount; i++) {
    const c = graph.curves[i % graph.curves.length];
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), glowMat(ICE, 2.2));
    m.userData.curve = c;
    m.userData.offset = (i / packetCount + Math.random() * 0.0) % 1;
    m.userData.speed = 0.25 + (i % 5) * 0.08;
    g.add(m);
    packetMeshes.push(m);
  }

  g.userData.animate = (t) => {
    g.rotation.y = t * 0.12; // globe rotates slowly
    // links illuminate sequentially via wave
    links.material.emissiveIntensity = 0.5 + 0.4 * Math.sin(t * 1.5);
    // shield pulses with cyan light
    const pulse = 0.5 + 0.5 * Math.sin(t * 2);
    shield.scale.setScalar(0.8 + pulse * 0.18);
    shield.material.emissiveIntensity = 1.6 + pulse * 1.6;
    shieldLight.intensity = 3.5 + pulse * 3;
    // data packets travel between nodes
    packetMeshes.forEach((m) => {
      const u = (m.userData.offset + t * m.userData.speed) % 1;
      m.userData.curve.getPointAt(u, m.position);
    });
  };

  return g;
}

// ===================================================================
// 7. ENCRYPTED DATA CUBE
// ===================================================================
function buildCube() {
  const g = new THREE.Group();
  g.name = "DataCube";
  const S = 2.0;

  // Outer glass cube.
  const outer = new THREE.Mesh(new THREE.BoxGeometry(S, S, S), glass(ICE2, 0.22));
  outer.name = "GlassCube";
  g.add(outer);

  // Metallic bevel edges (12 edges).
  const edgeGeos = [];
  const e = S / 2;
  const corners = [
    [-e, -e, -e], [e, -e, -e], [e, e, -e], [-e, e, -e],
    [-e, -e, e], [e, -e, e], [e, e, e], [-e, e, e],
  ];
  const edgePairs = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  edgePairs.forEach(([a, b]) => edgeGeos.push(linkGeo(new THREE.Vector3(...corners[a]), new THREE.Vector3(...corners[b]), 0.025)));
  const edges = new THREE.Mesh(merge(edgeGeos), chrome(0.1));
  edges.name = "BevelEdges";
  g.add(edges);

  // Internal rotating layers (three concentric wireframe boxes).
  const layers = [];
  for (let i = 0; i < 3; i++) {
    const size = S * (0.75 - i * 0.18);
    const holder = new THREE.Group();
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size)),
      new THREE.LineBasicMaterial({ color: new THREE.Color(CYAN), transparent: true, opacity: 0.6 }),
    );
    holder.add(wire);
    // circuit face pattern on each layer
    const faces = [];
    for (let f = 0; f < 6; f++) {
      const plane = new THREE.PlaneGeometry(size * 0.9, size * 0.9);
      const pts = [];
      const rg = mulberry32(70 + i * 10 + f);
      for (let k = 0; k < 10; k++) {
        const x = (rg() - 0.5) * size * 0.8;
        const y = (rg() - 0.5) * size * 0.8;
        pts.push(new THREE.Vector3(x, y, 0));
      }
      const circuitGeo = merge(pts.slice(1).map((p, k) => linkGeo(pts[k], p, 0.006)));
      const cm = new THREE.Mesh(circuitGeo, glowMat(CYAN, 1.3));
      const dirs = [[0,0,1],[0,0,-1],[0,1,0],[0,-1,0],[1,0,0],[-1,0,0]];
      cm.position.set(...dirs[f].map((d) => d * size * 0.5));
      if (dirs[f][2] !== 0) cm.rotation.y = dirs[f][2] > 0 ? 0 : Math.PI;
      else if (dirs[f][1] !== 0) cm.rotation.x = dirs[f][1] > 0 ? -Math.PI/2 : Math.PI/2;
      else cm.rotation.y = dirs[f][0] > 0 ? Math.PI/2 : -Math.PI/2;
      faces.push(cm);
    }
    const faceGroup = new THREE.Group();
    faces.forEach((f) => faceGroup.add(f));
    holder.add(faceGroup);
    g.add(holder);
    layers.push({ holder, dir: i % 2 === 0 ? 1 : -1 });
  }

  // Bright cyan energy core.
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 3), glowMat(CYAN, 2.4));
  core.name = "EnergyCore";
  g.add(core);
  const coreLight = new THREE.PointLight(new THREE.Color(CYAN), 6, 6);
  g.add(coreLight);

  // Particles entering/exiting through cube edges.
  const pCount = 40;
  const pPos = [];
  for (let i = 0; i < pCount; i++) {
    const edge = edgePairs[i % edgePairs.length];
    const A = new THREE.Vector3(...corners[edge[0]]);
    const B = new THREE.Vector3(...corners[edge[1]]);
    pPos.push(A.clone().lerp(B, Math.random()));
  }
  const particles = new THREE.Points(particlesGeo(pPos, 0.03), new THREE.PointsMaterial({ color: ICE, size: 0.07, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }));
  g.add(particles);

  g.userData.animate = (t) => {
    g.rotation.y = t * 0.25;
    g.rotation.x = Math.sin(t * 0.4) * 0.3;
    // internal layers rotate independently
    layers.forEach((l, i) => {
      l.holder.rotation.y = l.dir * t * (0.4 + i * 0.2);
      l.holder.rotation.x = l.dir * t * 0.2;
    });
    // core pulse
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
    core.scale.setScalar(1 + pulse * 0.2);
    core.material.emissiveIntensity = 1.8 + pulse * 1.8;
    coreLight.intensity = 4 + pulse * 4;
    // particles flow along edges
    const pp = particles.geometry.attributes.position;
    pPos.forEach((_, i) => {
      const edge = edgePairs[i % edgePairs.length];
      const A = new THREE.Vector3(...corners[edge[0]]);
      const B = new THREE.Vector3(...corners[edge[1]]);
      const u = (Math.random() * 0.001 + (t * 0.3 + i / pCount)) % 1;
      const p = A.clone().lerp(B, u);
      pp.setXYZ(i, p.x, p.y, p.z);
    });
    pp.needsUpdate = true;
  };

  return g;
}

// ===================================================================
// 13. AI SECURITY CORE (crystalline sphere)
// ===================================================================
function buildSecurityCore() {
  const g = new THREE.Group();
  g.name = "AISecurityCore";

  // Outer crystalline sphere.
  const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 2), glass(ICE2, 0.2));
  sphere.name = "CrystalSphere";
  g.add(sphere);

  // Inner neural processing structure (graph).
  const graph = buildGraph({ count: 60, shape: "sphere", radius: 0.95, seed: 13, maxLink: 0.55, maxLinks: 3, centerNode: true });
  const pathways = new THREE.Mesh(graph.links, iceGlow(0.7));
  pathways.name = "NeuralConnections";
  g.add(pathways);
  const nodes = new THREE.Mesh(graph.nodeGeo, glowMat(CYAN, 1.8));
  nodes.name = "NeuralNodes";
  g.add(nodes);

  // Interconnected geometric rings on the exterior.
  const rings = [];
  for (let i = 0; i < 4; i++) {
    const holder = new THREE.Group();
    holder.rotation.x = (i / 4) * Math.PI;
    holder.rotation.y = (i / 4) * Math.PI * 0.5;
    const r = new THREE.Mesh(ringGeo(1.65, 0.018), chrome(0.2));
    r.name = `GeoRing${i}`;
    holder.add(r);
    // miniature circuit ticks
    const ticks = [];
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      const tick = new THREE.BoxGeometry(0.01, 0.01, 0.1);
      tick.rotateX(Math.PI / 2);
      tick.rotateY(-a);
      tick.translate(Math.cos(a) * 1.65, 0, Math.sin(a) * 1.65);
      ticks.push(tick);
    }
    const tm = new THREE.Mesh(merge(ticks), glowMat(CYAN, 1.2));
    holder.add(tm);
    g.add(holder);
    rings.push({ holder, dir: i % 2 === 0 ? 1 : -1, speed: 0.3 + i * 0.1 });
  }

  // Energy pulse ring traveling around the sphere.
  const pulseRing = new THREE.Mesh(ringGeo(1.55, 0.03, 96), glowMat(CYAN, 2.2));
  pulseRing.name = "EnergyPulse";
  g.add(pulseRing);

  // Orbiting particles.
  const pCount = 30;
  const pPos = [];
  for (let i = 0; i < pCount; i++) {
    const a = (i / pCount) * Math.PI * 2;
    pPos.push(new THREE.Vector3(Math.cos(a) * 1.9, (i % 3 - 1) * 0.3, Math.sin(a) * 1.9));
  }
  const particles = new THREE.Points(particlesGeo(pPos, 0.025), new THREE.PointsMaterial({ color: ICE, size: 0.06, transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false }));
  g.add(particles);

  g.userData.animate = (t) => {
    // inner core rotates slowly
    nodes.rotation.y = t * 0.3;
    pathways.rotation.y = t * 0.3;
    // neural connections illuminate progressively
    pathways.material.emissiveIntensity = 0.5 + 0.4 * Math.sin(t * 1.6);
    nodes.material.emissiveIntensity = 1.4 + 0.6 * Math.sin(t * 2.2);
    // geometric rings rotate independently
    rings.forEach((r) => { r.holder.rotation.z = r.dir * t * r.speed; });
    // energy pulse travels around sphere
    pulseRing.rotation.y = t * 0.9;
    pulseRing.material.emissiveIntensity = 1.8 + 0.8 * Math.sin(t * 2.6);
    // particles orbit
    particles.rotation.y = t * 0.25;
  };

  return g;
}

// Builders used by the three model showcase pages.
export const BUILDERS = {
  globe: buildGlobe,
  cube: buildCube,
  securityCore: buildSecurityCore,
};
