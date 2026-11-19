"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { buildFingerprintMeshes, FP, type FingerprintMeshes } from "@/lib/fingerprintGeometry";

const CYAN = "#1ABCD8";
const ICE = "#9fe8f5";
const SILVER = "#d8dde3";

/** Glowing biometric core at the centre. */
function Core({ core, halo }: { core: THREE.BufferGeometry; halo: THREE.BufferGeometry }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.6);
    if (coreRef.current) {
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2 + pulse * 2;
      coreRef.current.rotation.y = t * 0.6;
      coreRef.current.scale.setScalar(1 + pulse * 0.12);
    }
    if (haloRef.current) {
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + pulse * 0.22;
      haloRef.current.scale.setScalar(1 + pulse * 0.5);
    }
  });

  return (
    <group>
      <mesh ref={coreRef} geometry={core}>
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      <mesh ref={haloRef} geometry={halo} scale={1.6}>
        <meshBasicMaterial color={CYAN} transparent opacity={0.2} toneMapped={false} depthWrite={false} />
      </mesh>
      <pointLight color={CYAN} intensity={7} distance={7} />
    </group>
  );
}

/** Fingerprint ridges that illuminate gradually, wave radiating outward. */
function Ridges({ groups }: { groups: FingerprintMeshes["ridgeGroups"] }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // A wave travels from centre (order 0) outward (order max) over time.
    const wave = (t * 0.45) % 1.6; // 0..1.6 sweeping radius factor
    groups.forEach((g, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const bandT = g.order / Math.max(1, groups.length - 1); // 0..1
      const bandRadius = bandT * 1.2;
      const dist = Math.abs(wave - bandRadius);
      // Ridges glow when the wave passes over them; dim otherwise.
      const glow = Math.max(0, 1 - dist * 3.5);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.35 + glow * 1.9;
    });
  });

  return (
    <group>
      {groups.map((g, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          geometry={g.geometry}
        >
          <meshStandardMaterial
            color={ICE}
            emissive={CYAN}
            emissiveIntensity={0.4}
            roughness={0.35}
            metalness={0.1}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Slowly rotating outer scanner ring + ticks. */
function ScannerRing({ ring, ticks }: { ring: THREE.BufferGeometry; ticks: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.2;
    }
  });
  return (
    <group ref={ref}>
      <mesh geometry={ring}>
        <meshStandardMaterial color={SILVER} metalness={1} roughness={0.2} envMapIntensity={1.4} />
      </mesh>
      <mesh geometry={ticks}>
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Scanning beam that travels across the fingerprint. */
function ScanBeam({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Sweep the beam left-to-right and back, easing at the edges.
    const sweep = Math.sin(t * 0.8); // -1..1
    const x = sweep * FP.radius * 1.05;
    if (ref.current) {
      ref.current.position.x = x;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.4;
    }
    if (glowRef.current) {
      glowRef.current.position.x = x;
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      // Brighter as it crosses the centre.
      const centreBoost = 1 - Math.abs(sweep) * 0.4;
      mat.opacity = 0.18 * centreBoost;
    }
  });

  return (
    <group>
      <mesh ref={ref} geometry={geometry}>
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {/* soft wide glow following the beam */}
      <mesh ref={glowRef} geometry={geometry} scale={[6, 1, 1]}>
        <meshBasicMaterial color={CYAN} transparent opacity={0.18} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Particles gently floating around the scanner. */
function Particles({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.15;
      ref.current.position.y = Math.sin(t * 0.7) * 0.06;
    }
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color={ICE} size={0.04} transparent opacity={0.7} sizeAttenuation depthWrite={false} toneMapped={false} />
    </points>
  );
}

function Scanner() {
  const m = useMemo(() => buildFingerprintMeshes(), []);
  return (
    <group>
      <Ridges groups={m.ridgeGroups} />
      <Core core={m.core} halo={m.coreHalo} />
      <ScannerRing ring={m.ring} ticks={m.ringTicks} />
      <ScanBeam geometry={m.scanBeam} />
      <Particles geometry={m.particles} />
    </group>
  );
}

export function FingerprintScanner3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2.6, 6.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 7, 5]} intensity={1.2} />
        <directionalLight position={[-5, 1, 3]} intensity={0.45} color={CYAN} />
        <Environment preset="city" />
        <Float speed={1.4} rotationIntensity={0} floatIntensity={0.7} floatingRange={[-0.15, 0.15]}>
          <Scanner />
        </Float>
      </Canvas>
    </div>
  );
}
