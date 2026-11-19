"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import {
  buildShieldMeshes,
  type ShieldMeshes,
} from "@/lib/shieldGeometry";

const CYAN = "#1ABCD8";
const NAVY = "#10182D";
const SILVER = "#d8dde3";

/** Live-animated energy core: cyan light pulses from the centre. */
function Core({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Pulse the core scale + emissive intensity on a smooth sine loop.
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.0);
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.6 + pulse * 1.6;
      ref.current.scale.setScalar(1 + pulse * 0.12);
    }
    if (halo.current) {
      const mat = halo.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + pulse * 0.22;
      halo.current.scale.setScalar(1 + pulse * 0.5);
    }
  });

  return (
    <group>
      <mesh ref={ref} geometry={geometry}>
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={2}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      {/* soft glowing halo around the core */}
      <mesh ref={halo} geometry={geometry} scale={1.3}>
        <meshBasicMaterial color={CYAN} transparent opacity={0.2} toneMapped={false} />
      </mesh>
      <pointLight color={CYAN} intensity={6} distance={6} />
    </group>
  );
}

/**
 * Circuit traces that illuminate sequentially — each node lights up in turn
 * driven by an animated emissive threshold across the network.
 */
function Circuit({ circuit }: { circuit: ShieldMeshes["circuit"] }) {
  const tracesRef = useRef<THREE.Mesh>(null);
  const nodesRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // A travelling wave sweeps across the traces to fake sequential illumination.
    if (tracesRef.current) {
      const mat = tracesRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + 0.6 * Math.sin(t * 1.4);
    }
    if (nodesRef.current) {
      const mat = nodesRef.current.material as THREE.MeshStandardMaterial;
      // Nodes pulse faster to read as data moving through the circuit.
      mat.emissiveIntensity = 1.0 + 0.9 * Math.sin(t * 2.4);
    }
  });

  return (
    <group>
      <mesh ref={tracesRef} geometry={circuit.traces}>
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={1}
          metalness={0.2}
          roughness={0.4}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={nodesRef} geometry={circuit.nodes}>
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Small particles orbiting around the outer edges of the shield. */
function OrbitParticles({ geometry }: { geometry: THREE.BufferGeometry }) {
  const ref = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.z = t * 0.25;
      // gentle bobbing in/out for depth
      ref.current.position.z = Math.sin(t * 0.8) * 0.08;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={CYAN}
        size={0.05}
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/** The assembled shield — floats vertically + rotates gently 0..12 degrees. */
function Shield() {
  const meshes = useMemo(() => buildShieldMeshes(), []);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      // Rotate gently between 0 and 12 degrees (≈ 0 → 0.21 rad), ping-pong.
      const angle = (0.5 - 0.5 * Math.cos(t * 0.6)) * THREE.MathUtils.degToRad(12);
      group.current.rotation.y = angle;
      // Slight tilt for a premium product-shot feel.
      group.current.rotation.x = -0.12;
    }
  });

  return (
    <group ref={group}>
      {/* Transparent ice-blue crystal-glass exterior */}
      <mesh geometry={meshes.glass}>
        <meshPhysicalMaterial
          color="#bfeaf5"
          metalness={0}
          roughness={0.05}
          transmission={1}
          thickness={0.4}
          ior={1.5}
          transparent
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={1.4}
          emissive={NAVY}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Polished brushed-silver rim + ridge */}
      <mesh geometry={meshes.rim}>
        <meshStandardMaterial color={SILVER} metalness={1} roughness={0.22} envMapIntensity={1.2} />
      </mesh>
      <mesh geometry={meshes.ridge}>
        <meshStandardMaterial color={SILVER} metalness={1} roughness={0.3} envMapIntensity={1.1} />
      </mesh>

      <Circuit circuit={meshes.circuit} />
      <Core geometry={meshes.core} />
      <OrbitParticles geometry={meshes.particles} />
    </group>
  );
}

export function GuardianShield3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.2], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* soft studio lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.2} />
        <directionalLight position={[-5, -2, 3]} intensity={0.4} color={CYAN} />
        <Environment preset="city" />

        <Float speed={1.6} rotationIntensity={0} floatIntensity={0.9} floatingRange={[-0.18, 0.18]}>
          <Shield />
        </Float>
      </Canvas>
    </div>
  );
}
