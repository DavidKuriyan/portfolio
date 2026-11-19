"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";

/**
 * Renders a .glb from /public with gentle idle motion.
 * Transparent canvas — sits cleanly on the light portfolio background.
 */
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  // Clone once per loaded scene so multiple instances don't share state.
  const cloned = useMemo(() => scene.clone(true), [scene]);

  return (
    <group>
      <group scale={1.05}>
        <primitive object={cloned} />
      </group>
    </group>
  );
}

export function GlbStage({
  url,
  className,
  float = true,
}: {
  url: string;
  className?: string;
  float?: boolean;
}) {
  const content = (
    <Suspense fallback={null}>
      <Model url={url} />
    </Suspense>
  );

  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [maxDpr, setMaxDpr] = useState(2);

  // Stop rendering while the stage is offscreen — keeps page scroll smooth.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "150px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Phones get a lower pixel cap; the models still look crisp at 1.5x.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) setMaxDpr(1.5);
  }, []);

  return (
    <div ref={hostRef} className={className}>
      <Canvas
        dpr={[1, maxDpr]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0.4, 5.4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.2} />
        <directionalLight position={[-5, 2, -4]} intensity={0.5} color="#1ABCD8" />
        <Environment preset="city" />
        {float ? (
          <Float speed={1.4} rotationIntensity={0} floatIntensity={0.7} floatingRange={[-0.14, 0.14]}>
            {content}
          </Float>
        ) : (
          content
        )}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.2}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(Math.PI * 3) / 4}
        />
        <PageScrollTouch />
      </Canvas>
    </div>
  );
}

/**
 * Vertical swipes should scroll the page on phones, while horizontal drags
 * still orbit the model. (OrbitControls otherwise locks touch-action: none.)
 */
function PageScrollTouch() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    gl.domElement.style.touchAction = "pan-y";
  }, [gl]);
  return null;
}
