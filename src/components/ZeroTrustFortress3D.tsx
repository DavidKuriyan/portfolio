"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import {
  buildFortressMeshes,
  FORTRESS,
  type FortressMeshes,
  type SecurityRing,
} from "@/lib/fortressGeometry";

const CYAN = "#1ABCD8";
const ICE = "#9fe8f5";
const SILVER = "#d8dde3";
const NAVY = "#10182D";

/** Glowing cyan core with pulsing light. */
function Core({ core, shell, circuit }: {
  core: THREE.BufferGeometry;
  shell: THREE.BufferGeometry;
  circuit: THREE.BufferGeometry;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const circuitRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.8);
    if (coreRef.current) {
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.8 + pulse * 1.6;
      coreRef.current.scale.setScalar(1 + pulse * 0.1);
      coreRef.current.rotation.y = t * 0.3;
    }
    if (haloRef.current) {
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + pulse * 0.2;
      haloRef.current.scale.setScalar(1 + pulse * 0.45);
    }
    if (circuitRef.current) {
      (circuitRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.8 + 0.7 * Math.sin(t * 2.2);
      circuitRef.current.rotation.y = -t * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={coreRef} geometry={core}>
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh ref={haloRef} geometry={core} scale={1.35}>
        <meshBasicMaterial color={CYAN} transparent opacity={0.18} toneMapped={false} depthWrite={false} />
      </mesh>
      {/* glass shell around the core */}
      <mesh geometry={shell}>
        <meshPhysicalMaterial
          color={ICE}
          metalness={0}
          roughness={0.06}
          transmission={1}
          thickness={0.3}
          ior={1.45}
          transparent
          clearcoat={1}
          envMapIntensity={1.3}
          emissive={NAVY}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* luminous circuit surface on the shell */}
      <mesh ref={circuitRef} geometry={circuit}>
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1} toneMapped={false} />
      </mesh>
      <pointLight color={CYAN} intensity={8} distance={8} />
    </group>
  );
}

/** A single security layer that rotates independently. */
function SecurityLayer({ ring, index }: { ring: SecurityRing; index: number }) {
  const group = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      // Each ring rotates at its own speed & direction.
      const dir = index % 2 === 0 ? 1 : -1;
      group.current.rotation.y = dir * t * (0.18 + index * 0.07);
      // gentle tilt wobble for depth
      group.current.rotation.x = Math.sin(t * 0.4 + index) * 0.08;
    }
    if (nodesRef.current) {
      const mat = nodesRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.9 + 0.8 * Math.sin(t * 2 + index * 1.3);
    }
  });

  return (
    <group ref={group}>
      {/* polished aluminium band */}
      <mesh geometry={ring.geometry}>
        <meshStandardMaterial color={SILVER} metalness={1} roughness={0.18} envMapIntensity={1.3} />
      </mesh>
      {/* checkpoint nodes */}
      <mesh ref={nodesRef} geometry={ring.nodes}>
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1} toneMapped={false} />
      </mesh>
      {/* luminous circuit inlay */}
      <mesh geometry={ring.inlay}>
        <meshStandardMaterial color={ICE} emissive={ICE} emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** The breathing outer glass barrier — expands & contracts in a loop. */
function Barrier({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      const breathe = 0.5 + 0.5 * Math.sin(t * 0.9);
      const s = 1 + breathe * 0.07; // gentle expand/contract
      ref.current.scale.set(s, 1, s);
      ref.current.rotation.y = t * 0.08;
    }
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshPhysicalMaterial
        color={ICE}
        metalness={0}
        roughness={0.08}
        transmission={1}
        thickness={0.25}
        ior={1.4}
        transparent
        opacity={0.85}
        clearcoat={1}
        envMapIntensity={1.2}
        emissive={CYAN}
        emissiveIntensity={0.06}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Cyan particles travelling between the layers. */
function Travellers({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Points>(null);
  const radii = useMemo(() => {
    // per-particle base radius + angle derived from position for orbit motion
    const pos = geometry.getAttribute("position");
    const arr: { r: number; a: number; y: number; speed: number }[] = [];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      arr.push({
        r: Math.hypot(x, z),
        a: Math.atan2(z, x),
        y,
        speed: 0.3 + (i % 5) * 0.12,
      });
    }
    return arr;
  }, [geometry]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      const pos = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      radii.forEach((p, i) => {
        const a = p.a + t * p.speed * (i % 2 ? 1 : -1);
        pos.setXYZ(i, Math.cos(a) * p.r, p.y + Math.sin(t * 0.8 + i) * 0.05, Math.sin(a) * p.r);
      });
      pos.needsUpdate = true;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={CYAN}
        size={0.05}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function Fortress() {
  const meshes = useMemo(() => buildFortressMeshes(), []);
  const root = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (root.current) {
      // slow premium showcase rotation of the whole assembly
      root.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group ref={root}>
      <Core core={meshes.core} shell={meshes.coreShell} circuit={meshes.coreCircuit} />
      {meshes.rings.map((r, i) => (
        <SecurityLayer key={i} ring={r} index={i} />
      ))}
      <Barrier geometry={meshes.barrier} />
      <Travellers geometry={meshes.travellers} />
    </group>
  );
}

export function ZeroTrustFortress3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 3.2, 7.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.55} color="#bfe9ff" />
        <directionalLight position={[5, 8, 5]} intensity={1.1} />
        <directionalLight position={[-6, 2, -4]} intensity={0.5} color={CYAN} />
        <Environment preset="city" />
        <Fortress />
      </Canvas>
    </div>
  );
}
