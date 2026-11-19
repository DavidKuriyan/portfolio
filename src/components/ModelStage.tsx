"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Generic stage for JS-defined 3D models.
 * `build()` returns a THREE.Group whose userData.animate(t) is called each frame.
 */
export function ModelStage({
  build,
  className,
  camera = [0, 2.2, 6.6],
  fov = 42,
  float = true,
}: {
  build: () => THREE.Group;
  className?: string;
  camera?: [number, number, number];
  fov?: number;
  float?: boolean;
}) {
  const buildRef = useRef(build);
  buildRef.current = build;
  const groupRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [maxDpr, setMaxDpr] = useState(2);

  // Stop rendering while offscreen so long pages keep scrolling smoothly.
  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "150px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Lower the pixel cap on touch devices for steadier frame times.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) setMaxDpr(1.5);
  }, []);

  return (
    <div ref={groupRef} className={className}>
      <Canvas
        dpr={[1, maxDpr]}
        camera={{ position: camera, fov }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        frameloop={visible ? "always" : "never"}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.2} />
        <directionalLight position={[-5, 2, -4]} intensity={0.5} color="#1ABCD8" />
        <Environment preset="city" />
        {float ? (
          <Float speed={1.3} rotationIntensity={0} floatIntensity={0.6} floatingRange={[-0.14, 0.14]}>
            <ModelRoot build={buildRef.current} />
          </Float>
        ) : (
          <ModelRoot build={buildRef.current} />
        )}
        <OrbitControlsWrapper active={visible} />
      </Canvas>
    </div>
  );
}

/** Mounted once inside the Canvas; never redefined on re-render. */
function OrbitControlsWrapper({ active }: { active: boolean }) {
  const { camera, gl } = useThree();
  const [controls, setControls] = useState<OrbitControls | null>(null);

  useEffect(() => {
    const c = new OrbitControls(camera as THREE.PerspectiveCamera, gl.domElement);
    c.enableDamping = true;
    c.dampingFactor = 0.08;
    c.enablePan = false;
    c.minDistance = 3.5;
    c.maxDistance = 12;
    // Keep vertical page scrolling usable on touch devices; horizontal drags orbit.
    gl.domElement.style.touchAction = "pan-y";
    setControls(c);
    return () => {
      setControls(null);
      c.dispose();
    };
  }, [camera, gl]);

  // Only advance damping while the stage is on screen.
  useEffect(() => {
    if (!active || !controls) return;
    let raf = requestAnimationFrame(function tick() {
      controls.update();
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [active, controls]);

  return null;
}

function ModelRoot({ build }: { build: () => THREE.Group }) {
  // Build the model group exactly once.
  const group = useMemo(() => build(), [build]);

  useFrame(({ clock }) => {
    if (group && typeof group.userData.animate === "function") {
      group.userData.animate(clock.getElapsedTime());
    }
  });

  return <primitive object={group} />;
}

export type ModelComponent = ComponentType<{ className?: string }>;
