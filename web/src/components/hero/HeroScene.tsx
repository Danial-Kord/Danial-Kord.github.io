"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Html, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";

import { projects } from "@/lib/projects";

/** Smoothly scroll to an element id on the current page. */
function scrollToAnchor(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  // brief glow on the target so the user sees what was clicked
  el.classList.add("anchor-target");
  window.setTimeout(() => el.classList.remove("anchor-target"), 1400);
}

/* ---------- floor: dim infinite grid (custom shader) ---------- */
function GridFloor() {
  const ref = useRef<THREE.Mesh>(null);
  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.6, -10]}
    >
      <planeGeometry args={[120, 120, 1, 1]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{
          uColor: { value: new THREE.Color("#7fffd4") },
          uFade: { value: 18.0 },
        }}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          varying vec3 vWorld;
          void main() {
            vUv = uv;
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorld = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          uniform vec3 uColor;
          uniform float uFade;
          varying vec3 vWorld;
          float gridLine(vec2 p, float scale, float thick) {
            vec2 g = abs(fract(p * scale - 0.5) - 0.5) / fwidth(p * scale);
            float l = min(g.x, g.y);
            return 1.0 - smoothstep(0.0, thick, l);
          }
          void main() {
            float major = gridLine(vWorld.xz, 0.25, 1.2);
            float minor = gridLine(vWorld.xz, 1.0, 1.0) * 0.25;
            float g = clamp(major + minor, 0.0, 1.0);
            // distance fade so the floor disappears into fog
            float d = length(vWorld.xz - vec2(0.0, -8.0));
            float fade = 1.0 - smoothstep(6.0, uFade, d);
            float a = g * fade * 0.55;
            if (a < 0.005) discard;
            gl_FragColor = vec4(uColor, a);
          }
        `}
      />
    </mesh>
  );
}

/* ---------- one project station ---------- */
function Station({
  position,
  hue,
  title,
  anchor,
  onSelect,
}: {
  position: [number, number, number];
  hue: string;
  title: string;
  anchor: string;
  onSelect: (anchor: string) => void;
}) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sphereRef.current) {
      sphereRef.current.position.y =
        position[1] + Math.sin(t * 0.9 + position[0]) * 0.08;
      sphereRef.current.rotation.y = t * 0.4;
    }
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.1 + position[2]) * 0.05;
      haloRef.current.scale.setScalar(hover ? s * 1.6 : s);
    }
  });

  return (
    <group position={position}>
      {/* dim pillar grounding the station */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
        <meshBasicMaterial color="#1c2230" />
      </mesh>

      {/* emissive core */}
      <mesh
        ref={sphereRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(anchor);
        }}
      >
        <icosahedronGeometry args={[0.18, 1]} />
        <meshStandardMaterial
          color={hue}
          emissive={hue}
          emissiveIntensity={hover ? 4.5 : 2.6}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* additive halo to fake bloom without postprocessing */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshBasicMaterial
          color={hue}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* label */}
      <Html
        position={[0.45, 0.05, 0]}
        center={false}
        zIndexRange={[10, 0]}
        style={{
          pointerEvents: "none",
          opacity: hover ? 1 : 0.6,
          transition: "opacity 200ms ease",
          transform: "translate3d(0,0,0)",
        }}
      >
        <div
          className="font-mono text-[10px] tracking-[0.18em] uppercase whitespace-nowrap"
          style={{ color: hue, textShadow: `0 0 12px ${hue}80` }}
        >
          ▸ {title}
        </div>
      </Html>
    </group>
  );
}

/* ---------- camera rig: slow forward dolly + mouse parallax ---------- */
function CameraRig() {
  const { camera, mouse } = useThree();
  const startZ = 4.2;
  const driftSpeed = 0.06; // units / sec
  const driftMax = 1.4;

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    // Slow ping-pong dolly so we don't sail past every station
    const drift = Math.sin(t * driftSpeed) * driftMax;
    const targetZ = startZ - drift - 0.6;

    // mouse parallax
    const targetX = mouse.x * 0.6;
    const targetY = 1.0 + mouse.y * 0.25;

    camera.position.x += (targetX - camera.position.x) * Math.min(dt * 1.6, 1);
    camera.position.y += (targetY - camera.position.y) * Math.min(dt * 1.6, 1);
    camera.position.z += (targetZ - camera.position.z) * Math.min(dt * 0.8, 1);
    camera.lookAt(0, 0.6, -8);
  });
  return null;
}

/* ---------- whole scene ---------- */
function Scene() {
  const handleSelect = (anchor: string) => scrollToAnchor(anchor);

  return (
    <>
      <color attach="background" args={["#06070a"]} />
      <fog attach="fog" args={["#06070a", 4, 14]} />

      <ambientLight intensity={0.18} />
      <directionalLight position={[3, 4, 2]} intensity={0.4} color="#9fb6ff" />

      <CameraRig />
      <GridFloor />

      {/* dust motes */}
      <Sparkles
        count={70}
        size={2}
        scale={[14, 4, 14]}
        position={[0, 0.6, -6]}
        speed={0.25}
        opacity={0.5}
        color="#7fffd4"
      />

      {projects.map((p) => (
        <Station
          key={p.slug}
          position={p.station}
          hue={p.hue}
          title={p.title}
          anchor={p.anchor}
          onSelect={handleSelect}
        />
      ))}
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.0, 4.2], fov: 55, near: 0.1, far: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
