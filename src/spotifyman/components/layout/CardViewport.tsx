import { ContactShadows, RoundedBox } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { paintGlare, renderCard } from '../../engine/canvasRenderer';
import { LAYOUTS } from '../../engine/constants';
import type { CardState, TiltState } from '../../types';
import { mixHex } from '../../utils/colorUtils';

type Mat = {
  roughness: number;
  metalness: number;
  clearcoat: number;
  emissive: number;
  nearest: boolean;
  toon: boolean;
  basic: boolean;
};

function lookFor(theme: CardState['theme']): Mat {
  switch (theme) {
    case 'pixel':
    case 'pixelart':
    case 'gameboy':
      return { roughness: 1, metalness: 0, clearcoat: 0, emissive: 0, nearest: true, toon: false, basic: true };
    case 'chalkboard':
    case 'notebook':
    case 'newspaper':
    case 'receipt':
      return { roughness: 0.94, metalness: 0, clearcoat: 0, emissive: 0, nearest: false, toon: false, basic: false };
    case 'glowsketch':
    case 'neon':
    case 'cyberpunk':
      return { roughness: 0.4, metalness: 0.06, clearcoat: 0.25, emissive: 0.22, nearest: false, toon: false, basic: false };
    case 'ps2':
      return { roughness: 0.58, metalness: 0.12, clearcoat: 0.2, emissive: 0.04, nearest: true, toon: false, basic: false };
    case 'comic':
    case 'comicart':
    case 'brutalism':
      return { roughness: 0.88, metalness: 0, clearcoat: 0, emissive: 0, nearest: false, toon: true, basic: false };
    case 'flatvector':
    case 'sticker':
      return { roughness: 1, metalness: 0, clearcoat: 0, emissive: 0, nearest: false, toon: false, basic: true };
    case 'dankoe':
      return { roughness: 0.82, metalness: 0.02, clearcoat: 0.04, emissive: 0, nearest: false, toon: false, basic: false };
    case 'cgimotion':
    case 'y2k':
    case 'holo':
    case 'aurora':
      return { roughness: 0.12, metalness: 0.62, clearcoat: 1, emissive: 0.08, nearest: false, toon: false, basic: false };
    case 'lego':
    case 'clay':
      return { roughness: 0.28, metalness: 0.02, clearcoat: 0.55, emissive: 0, nearest: false, toon: false, basic: false };
    case 'zackd':
      return { roughness: 0.62, metalness: 0.18, clearcoat: 0.15, emissive: 0, nearest: false, toon: false, basic: false };
    case 'glass':
      return { roughness: 0.06, metalness: 0.08, clearcoat: 1, emissive: 0.02, nearest: false, toon: false, basic: false };
    case 'vinyl':
      return { roughness: 0.22, metalness: 0.7, clearcoat: 0.7, emissive: 0, nearest: false, toon: false, basic: false };
    default:
      return { roughness: 0.42, metalness: 0.06, clearcoat: 0.28, emissive: 0, nearest: false, toon: false, basic: false };
  }
}

function useCardTexture(
  state: CardState,
  coverImg: HTMLImageElement | null,
  fontEpoch: number,
  onSize?: (size: number, overflow: boolean) => void
) {
  const holder = useRef<{
    canvas: HTMLCanvasElement;
    tex: THREE.CanvasTexture;
    w: number;
    h: number;
  } | null>(null);
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  const sizeRef = useRef(onSize);
  sizeRef.current = onSize;

  useEffect(() => {
    const layout = LAYOUTS[state.layoutKey];
    let slot = holder.current;
    if (!slot || slot.w !== layout.w || slot.h !== layout.h) {
      const canvas = document.createElement('canvas');
      canvas.width = layout.w;
      canvas.height = layout.h;
      const next = new THREE.CanvasTexture(canvas);
      next.colorSpace = THREE.SRGBColorSpace;
      next.anisotropy = 8;
      next.wrapS = THREE.ClampToEdgeWrapping;
      next.wrapT = THREE.ClampToEdgeWrapping;
      slot?.tex.dispose();
      slot = { canvas, tex: next, w: layout.w, h: layout.h };
      holder.current = slot;
      setTex(next);
    }
    const ctx = slot.canvas.getContext('2d');
    if (!ctx) return;
    const flat = { ...state, cardDepth: 0 };
    const tilt: TiltState = { rx: 0, ry: 0, rz: 0, perspective: 1200 };
    const info = renderCard(ctx, flat, layout, coverImg, tilt, {
      flat: true,
      fullBleed: false,
    });
    paintGlare(ctx, flat, layout, tilt, true);
    sizeRef.current?.(info.size, info.overflow);
    const pixel =
      state.theme === 'pixel' ||
      state.theme === 'pixelart' ||
      state.theme === 'gameboy' ||
      state.theme === 'ps2';
    slot.tex.magFilter = pixel ? THREE.NearestFilter : THREE.LinearFilter;
    slot.tex.minFilter = pixel ? THREE.NearestFilter : THREE.LinearMipmapLinearFilter;
    slot.tex.generateMipmaps = !pixel;
    slot.tex.needsUpdate = true;
  }, [state, coverImg, fontEpoch]);

  useEffect(() => () => holder.current?.tex.dispose(), []);

  return tex;
}

function FrontFace({
  tex,
  theme,
  color,
}: {
  tex: THREE.Texture;
  theme: CardState['theme'];
  color: string;
}) {
  const mat = lookFor(theme);
  const grad = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 4;
    c.height = 1;
    const g = c.getContext('2d');
    if (!g) return null;
    ['#222', '#666', '#bbb', '#fff'].forEach((col, i) => {
      g.fillStyle = col;
      g.fillRect(i, 0, 1, 1);
    });
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.colorSpace = THREE.NoColorSpace;
    return t;
  }, []);

  if (mat.basic) {
    return <meshBasicMaterial map={tex} transparent toneMapped={false} />;
  }
  if (mat.toon && grad) {
    return <meshToonMaterial map={tex} gradientMap={grad} transparent />;
  }
  return (
    <meshPhysicalMaterial
      map={tex}
      transparent
      roughness={mat.roughness}
      metalness={mat.metalness}
      clearcoat={mat.clearcoat}
      clearcoatRoughness={0.28}
      emissive={color}
      emissiveIntensity={mat.emissive}
    />
  );
}

function Studs({
  w,
  h,
  z,
  color,
}: {
  w: number;
  h: number;
  z: number;
  color: string;
}) {
  const count = Math.max(5, Math.round(w / 0.34));
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const y = h / 2 - 0.11;
    for (let i = 0; i < count; i++) {
      const x = -w / 2 + 0.16 + ((w - 0.32) * (i + 0.5)) / count;
      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, w, h, z]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.055, 0.06, 0.05, 18]} />
      <meshPhysicalMaterial color={color} roughness={0.26} clearcoat={0.7} />
    </instancedMesh>
  );
}

function CardMesh({
  state,
  tex,
  tilt,
  dragging,
}: {
  state: CardState;
  tex: THREE.Texture | null;
  tilt: TiltState;
  dragging: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.PointLight>(null);
  const layout = LAYOUTS[state.layoutKey];
  const aspect = layout.w / layout.h;
  const max = 2.42;
  const w = aspect >= 1 ? max : max * aspect;
  const h = aspect >= 1 ? max / aspect : max;
  const depthMul =
    state.theme === 'dankoe' || state.theme === 'flatvector'
      ? 0.62
      : state.theme === 'lego'
        ? 1.35
        : state.theme === 'pixelart' || state.theme === 'pixel'
          ? 1.15
          : 1;
  const depth = (0.055 + (state.cardDepth / 100) * 0.22) * depthMul;
  const radiusWorld = (Math.min(layout.radius, 80) / layout.w) * w;
  const radius = Math.min(radiusWorld, Math.min(w, h) * 0.18, Math.max(0.02, depth * 0.42));
  const side = mixHex(state.color, '#000000', state.theme === 'chalkboard' ? 0.1 : 0.38);
  const mat = lookFor(state.theme);
  const draggingRef = useRef(dragging);
  draggingRef.current = dragging;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current && !draggingRef.current) {
      group.current.position.y = Math.sin(t * 0.85) * 0.03;
    } else if (group.current) {
      group.current.position.y = 0;
    }
    if (spin.current && (state.theme === 'cgimotion' || state.theme === 'holo' || state.theme === 'y2k')) {
      spin.current.position.x = Math.sin(t * 0.8) * 2.4;
      spin.current.position.y = 0.9 + Math.cos(t * 0.6) * 0.7;
    }
  });

  return (
    <group
      ref={group}
      rotation={[
        THREE.MathUtils.degToRad(tilt.rx),
        THREE.MathUtils.degToRad(tilt.ry),
        THREE.MathUtils.degToRad(tilt.rz),
      ]}
    >
      {state.theme === 'chalkboard' && (
        <RoundedBox
          args={[w + 0.2, h + 0.2, Math.max(0.05, depth * 0.78)]}
          radius={0.05}
          smoothness={3}
          position={[0, 0, -0.03]}
        >
          <meshStandardMaterial color="#6a4324" roughness={0.78} />
        </RoundedBox>
      )}

      {(state.theme === 'glowsketch' || state.theme === 'neon' || state.theme === 'cyberpunk') && (
        <mesh position={[0, 0, -0.08]}>
          <planeGeometry args={[w * 1.12, h * 1.12]} />
          <meshBasicMaterial
            color={state.color}
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {state.theme === 'ps2' && (
        <mesh position={[0.15, -0.05, -0.55]} rotation={[0.5, 0.7, 0.2]}>
          <icosahedronGeometry args={[0.72, 0]} />
          <meshStandardMaterial
            color={state.color}
            flatShading
            wireframe
            transparent
            opacity={0.45}
          />
        </mesh>
      )}

      {state.theme === 'zackd' && (
        <>
          <mesh position={[-w / 2 - 0.07, 0, 0]}>
            <boxGeometry args={[0.045, h * 0.92, depth * 0.8]} />
            <meshStandardMaterial color="#141414" roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[w / 2 + 0.07, 0, 0]}>
            <boxGeometry args={[0.045, h * 0.92, depth * 0.8]} />
            <meshStandardMaterial color="#141414" roughness={0.6} metalness={0.2} />
          </mesh>
        </>
      )}

      <RoundedBox args={[w, h, depth]} radius={radius} smoothness={state.theme === 'ps2' ? 1 : 4} bevelSegments={state.theme === 'ps2' ? 1 : 3}>
        <meshStandardMaterial
          color={state.theme === 'lego' ? state.color : side}
          roughness={mat.roughness}
          metalness={mat.metalness}
        />
      </RoundedBox>

      {tex && (
        <mesh position={[0, 0, depth / 2 + 0.006]}>
          <planeGeometry args={[w * 0.99, h * 0.99]} />
          <FrontFace tex={tex} theme={state.theme} color={state.color} />
        </mesh>
      )}

      {state.theme === 'lego' && (
        <Studs w={w} h={h} z={depth / 2 + 0.03} color={mixHex(state.color, '#ffffff', 0.18)} />
      )}

      <pointLight
        ref={spin}
        position={[1.4, 1.2, 2.2]}
        intensity={state.theme === 'cgimotion' ? 8 : 0}
        color={state.color}
        distance={8}
      />
    </group>
  );
}

export default function CardViewport({
  state,
  coverImg,
  tilt,
  dragging,
  fontEpoch,
  onSize,
}: {
  state: CardState;
  coverImg: HTMLImageElement | null;
  tilt: TiltState;
  dragging: boolean;
  fontEpoch: number;
  onSize?: (size: number, overflow: boolean) => void;
}) {
  const tex = useCardTexture(state, coverImg, fontEpoch, onSize);
  const dpr: [number, number] =
    typeof window !== 'undefined' && window.innerWidth < 800 ? [1, 1.25] : [1, 1.6];

  return (
    <Canvas
      dpr={dpr}
      shadows={false}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.04, 6.55], fov: 28 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={0.62} />
      <directionalLight position={[-3.2, 4.2, 5.4]} intensity={1.25} />
      <directionalLight position={[2.6, -1.4, 3]} intensity={0.28} color={state.color} />
      <spotLight position={[0, 3.2, 4.5]} angle={0.55} penumbra={0.85} intensity={1.35} />
      <CardMesh state={state} tex={tex} tilt={tilt} dragging={dragging} />
      <ContactShadows position={[0, -1.55, 0]} opacity={0.48} scale={9} blur={2.5} far={4} />
    </Canvas>
  );
}
