"use client";

/**
 * Treasure-Planet style holographic solar map. Each planet is a section.
 *
 * Performance notes:
 *  - Geometries are low-poly (spheres ≤24×18) — there are 7 spheres total.
 *  - No postprocessing; "bloom" is faked with additive transparent halos.
 *  - DPR is capped via Drei AdaptiveDpr, events via AdaptiveEvents.
 *  - The Canvas is dynamic-imported in Header3D with ssr:false.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Sparkles,
  Stars,
  Html,
} from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

import { sections, type SectionPlanet } from "./data";

/* ------------------------------ sun ------------------------------ */
function Sun() {
  const core = useRef<THREE.Mesh>(null!);
  const halo = useRef<THREE.Mesh>(null!);
  const corona = useRef<THREE.Mesh>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    core.current.rotation.y = t * 0.05;
    halo.current.scale.setScalar(1 + Math.sin(t * 0.6) * 0.04);
    corona.current.scale.setScalar(1 + Math.sin(t * 0.4 + 1.0) * 0.06);
    corona.current.rotation.z = t * 0.02;
  });

  return (
    <group>
      {/* core */}
      <mesh ref={core}>
        <sphereGeometry args={[0.55, 48, 32]} />
        <meshStandardMaterial
          color="#ffe2b3"
          emissive="#ffb463"
          emissiveIntensity={2.6}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>
      {/* inner halo */}
      <mesh ref={halo}>
        <sphereGeometry args={[0.85, 32, 24]} />
        <meshBasicMaterial
          color="#ffb463"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* outer corona */}
      <mesh ref={corona}>
        <sphereGeometry args={[1.35, 32, 24]} />
        <meshBasicMaterial
          color="#ff904a"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------ orbit ring ------------------------------ */
/** Thin glowing torus drawn on the planet's tilted orbital plane. */
function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.0035, 8, 128]} />
      <meshBasicMaterial
        color="#d6a85f"
        transparent
        opacity={0.22}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------ planet ------------------------------ */
function Planet({
  p,
  selectedAnchor,
  onSelect,
  onHoverChange,
}: {
  p: SectionPlanet;
  selectedAnchor: string | null;
  onSelect: (anchor: string) => void;
  onHoverChange: (p: SectionPlanet | null) => void;
}) {
  const orbitRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const [hover, setHover] = useState(false);

  const isSelected = selectedAnchor === p.anchor;

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const a = t * p.speed + p.phase;
    if (orbitRef.current) {
      orbitRef.current.position.set(Math.cos(a) * p.radius, 0, Math.sin(a) * p.radius);
    }
    if (meshRef.current) meshRef.current.rotation.y = t * 0.4;
    if (haloRef.current) {
      const base = hover || isSelected ? 1.6 : 1.0;
      const breathe = 1 + Math.sin(t * 1.2 + p.phase) * 0.06;
      haloRef.current.scale.setScalar(base * breathe);
    }
  });

  return (
    <group ref={orbitRef}>
      {/* planet core */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          onHoverChange(p);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHover(false);
          onHoverChange(null);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(p.anchor);
        }}
      >
        <sphereGeometry args={[p.size, 24, 18]} />
        <meshStandardMaterial
          color={p.hue}
          emissive={p.hue}
          emissiveIntensity={hover || isSelected ? 2.6 : 1.05}
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>

      {/* additive halo (fake bloom) */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[p.size * 2.0, 20, 16]} />
        <meshBasicMaterial
          color={p.hue}
          transparent
          opacity={hover || isSelected ? 0.32 : 0.13}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* always-visible label, pulled out from the planet */}
      <Html
        center
        distanceFactor={6}
        position={[0, p.size + 0.18, 0]}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          className={`planet-label${hover || isSelected ? " is-active" : ""}`}
          style={{
            color: p.hue,
            textShadow: `0 0 12px ${p.hue}80`,
          }}
        >
          {p.label}
        </div>
      </Html>
    </group>
  );
}

/* ------------------------------ camera rig ------------------------------ */
/**
 * Mouse parallax + click "FOV kick".
 * When `zoomKick` is true, FOV briefly narrows and the camera dollies in.
 */
function CameraRig({ zoomKick }: { zoomKick: boolean }) {
  const { camera, mouse, size } = useThree();
  const baselineFov = 52;
  const kickFov = 38;

  useFrame((_, dt) => {
    // ---- parallax ----
    const aspect = size.width / size.height;
    const targetX = mouse.x * 0.55 * Math.min(1.4, aspect);
    const targetY = 3.0 + mouse.y * 0.35;
    camera.position.x += (targetX - camera.position.x) * Math.min(dt * 1.6, 1);
    camera.position.y += (targetY - camera.position.y) * Math.min(dt * 1.4, 1);

    // ---- zoom kick on click ----
    const targetFov = zoomKick ? kickFov : baselineFov;
    const targetZ = zoomKick ? 5.4 : 7.6;
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov += (targetFov - cam.fov) * Math.min(dt * 5, 1);
    cam.position.z += (targetZ - cam.position.z) * Math.min(dt * 4, 1);
    cam.updateProjectionMatrix();

    cam.lookAt(0, 0, 0);
  });

  return null;
}

/* ------------------------------ scene ------------------------------ */
function Scene({
  zoomKick,
  selectedAnchor,
  onSelect,
  onHoverChange,
}: {
  zoomKick: boolean;
  selectedAnchor: string | null;
  onSelect: (anchor: string) => void;
  onHoverChange: (p: SectionPlanet | null) => void;
}) {
  return (
    <>
      <color attach="background" args={["#04060f"]} />
      <fog attach="fog" args={["#04060f", 6, 18]} />

      {/* light: warm point at sun + soft fill */}
      <ambientLight intensity={0.22} color="#a8c0ff" />
      <pointLight
        position={[0, 0, 0]}
        intensity={2.4}
        color="#ffb463"
        distance={26}
        decay={1.6}
      />
      <directionalLight position={[2, 4, 2]} intensity={0.18} color="#9cc1ff" />

      <Sun />

      {/* planets — each in its own tilted orbital plane */}
      {sections.map((p) => (
        <group key={p.anchor} rotation={[p.tilt, 0, 0]}>
          <OrbitRing radius={p.radius} />
          <Planet
            p={p}
            selectedAnchor={selectedAnchor}
            onSelect={onSelect}
            onHoverChange={onHoverChange}
          />
        </group>
      ))}

      {/* nebula dust + far stars */}
      <Sparkles
        count={140}
        scale={[18, 9, 18]}
        size={2}
        speed={0.22}
        opacity={0.65}
        color="#cfe6ff"
      />
      <Stars
        radius={50}
        depth={22}
        count={1600}
        factor={2.4}
        saturation={0.4}
        fade
        speed={0.35}
      />

      <CameraRig zoomKick={zoomKick} />
    </>
  );
}

/* ------------------------------ canvas wrapper ------------------------------ */
export default function SolarScene({
  zoomKick,
  selectedAnchor,
  onSelect,
  onHoverChange,
}: {
  zoomKick: boolean;
  selectedAnchor: string | null;
  onSelect: (anchor: string) => void;
  onHoverChange: (p: SectionPlanet | null) => void;
}) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      camera={{ position: [0, 3.2, 7.6], fov: 52, near: 0.1, far: 60 }}
      style={{ width: "100%", height: "100%" }}
    >
      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
      <Suspense fallback={null}>
        <Scene
          zoomKick={zoomKick}
          selectedAnchor={selectedAnchor}
          onSelect={onSelect}
          onHoverChange={onHoverChange}
        />
      </Suspense>
    </Canvas>
  );
}
