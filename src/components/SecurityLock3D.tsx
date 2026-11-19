"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { buildLockMeshes, LOCK, type LockMeshes } from "@/lib/lockGeometry";

const CYAN = "#1ABCD8";
const ICE = "#9fe8f5";
const CHROME = "#e6ebf0";
const NAVY = "#10182D";

/** Pulsing encrypted core inside the glass body. */
function Core({ core, circuit }: { core: THREE.BufferGeometry; circuit: THREE.BufferGeometry }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const circuitRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
    if (coreRef.current) {
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.8 + pulse * 1.6;
      coreRef.current.rotation.y = t * 0.5;
      coreRef.current.scale.setScalar(1 + pulse * 0.08);
    }
    if (haloRef.current) {
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + pulse * 0.2;
      haloRef.current.scale.setScalar(1 + pulse * 0.4);
    }
    if (circuitRef.current) {
      (circuitRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9 + 0.7 * Math.sin(t * 2.6);
    }
  });

  return (
    <group>
      <mesh ref={coreRef} geometry={core}>
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2} roughness={0.2} toneMapped={false} />
      </mesh>
      <mesh ref={haloRef} geometry={core} scale={1.35}>
        <meshBasicMaterial color={CYAN} transparent opacity={0.16} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh ref={circuitRef} geometry={circuit}>
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1} toneMapped={false} />
      </mesh>
      <pointLight color={CYAN} intensity={6} distance={6} />
    </group>
  );
}

/**
 * Chrome shackle that opens slightly and closes on a loop.
 * One leg stays seated; the shackle pivots to lift the free side.
 */
function Shackle({ geometry }: { geometry: THREE.BufferGeometry }) {
  const pivot = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pivot.current) {
      // Smooth open/close cycle: eases between closed (0) and slightly open (~0.22 rad).
      const open = (0.5 - 0.5 * Math.cos(t * 1.1));
      // Ease with a hold at the top for a mechanical feel.
      const eased = Math.pow(open, 1.6);
      pivot.current.rotation.z = eased * 0.22;
    }
  });

  return (
    // Pivot at the left (seated) leg so rotating lifts the free right side.
    <group position={[-LOCK.shackleR, 0, 0]}>
      <group ref={pivot}>
        <group position={[LOCK.shackleR, 0, 0]}>
          <mesh geometry={geometry}>
            <meshStandardMaterial color={CHROME} metalness={1} roughness={0.08} envMapIntensity={1.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Circuit traces across the glass surface, sequentially lit. */
function SurfaceCircuit({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.7 + 0.6 * Math.sin(t * 1.6);
    }
  });
  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color={ICE} emissive={ICE} emissiveIntensity={0.9} toneMapped={false} />
    </mesh>
  );
}

/** Cyan energy ring travelling around the body. */
function EnergyRing({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.7) * 0.25;
      ref.current.rotation.y = t * 1.1;
      ref.current.position.y = Math.sin(t * 0.9) * 0.25;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.4 + 0.8 * Math.sin(t * 3);
    }
  });
  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.6} toneMapped={false} />
    </mesh>
  );
}

/** Particles gently floating around the lock. */
function Particles({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.12;
      ref.current.position.y = Math.sin(t * 0.6) * 0.08;
    }
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color={ICE} size={0.045} transparent opacity={0.75} sizeAttenuation depthWrite={false} toneMapped={false} />
    </points>
  );
}

function Lock() {
  const m = useMemo(() => buildLockMeshes(), []);
  const root = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (root.current) {
      // Slow rotation around the vertical axis.
      root.current.rotation.y = t * 0.45;
      root.current.rotation.x = -0.08; // subtle product-shot tilt
    }
  });

  return (
    <group ref={root}>
      {/* Crystal-glass body */}
      <mesh geometry={m.body}>
        <meshPhysicalMaterial
          color={ICE}
          metalness={0}
          roughness={0.05}
          transmission={1}
          thickness={0.5}
          ior={1.5}
          transparent
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={1.5}
          emissive={NAVY}
          emissiveIntensity={0.12}
        />
      </mesh>

      <Shackle geometry={m.shackle} />
      <Core core={m.core} circuit={m.coreCircuit} />
      <SurfaceCircuit geometry={m.surfaceCircuit} />
      <EnergyRing geometry={m.energyRing} />
      <Particles geometry={m.particles} />
    </group>
  );
}

export function SecurityLock3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.3} />
        <directionalLight position={[-5, -1, 3]} intensity={0.4} color={CYAN} />
        <Environment preset="city" />
        <Lock />
      </Canvas>
    </div>
  );
}
