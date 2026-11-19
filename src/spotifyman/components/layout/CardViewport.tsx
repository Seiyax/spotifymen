import { ContactShadows } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { getPalette, paintGlare, renderCard } from '../../engine/canvasRenderer';
import { LAYOUTS } from '../../engine/constants';
import { setPreviewGrab } from '../../engine/exportEngine';
import { asTilt } from '../../engine/tilt';
import type { CardState, ThemeKey, TiltState } from '../../types';
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

function shellFor(theme: ThemeKey, color: string) {
  const P = getPalette(theme, color);
  const paper =
    theme === 'ticket' ||
    theme === 'polaroid' ||
    theme === 'notebook' ||
    theme === 'newspaper' ||
    theme === 'receipt' ||
    theme === 'cassette';
  const sharp =
    theme === 'brutalism' ||
    theme === 'pixel' ||
    theme === 'pixelart' ||
    theme === 'comic' ||
    theme === 'comicart' ||
    theme === 'receipt' ||
    theme === 'newspaper' ||
    theme === 'zackd' ||
    theme === 'gameboy' ||
    theme === 'dankoe' ||
    theme === 'ps2';

  let side = mixHex(P.surface, '#000000', 0.45);
  let depthMul = 1;
  let radiusMul = 1;

  if (theme === 'vinyl') {
    side = '#0c0c0c';
    depthMul = 0.55;
    radiusMul = 0.85;
  } else if (theme === 'glass') {
    side = mixHex(color, '#ffffff', 0.55);
    depthMul = 0.62;
  } else if (theme === 'lego' || theme === 'clay') {
    side = theme === 'lego' ? color : mixHex(P.surface, '#000000', 0.16);
    depthMul = theme === 'lego' ? 1.45 : 1.25;
    radiusMul = theme === 'clay' ? 1.35 : 0.7;
  } else if (theme === 'pixel' || theme === 'pixelart') {
    side = '#141414';
    depthMul = 0.85;
    radiusMul = 0;
  } else if (theme === 'gameboy') {
    side = '#8d9368';
    depthMul = 1.05;
    radiusMul = 0.15;
  } else if (paper) {
    side = mixHex(P.surface, '#000000', 0.14);
    depthMul = 0.32;
    radiusMul = theme === 'receipt' || theme === 'newspaper' ? 0 : 0.45;
  } else if (theme === 'chalkboard') {
    side = '#5c3b22';
    depthMul = 0.9;
  } else if (theme === 'neon' || theme === 'cyberpunk' || theme === 'glowsketch') {
    side = '#07070c';
    depthMul = 0.7;
  } else if (theme === 'classic' || theme === 'wrapped' || theme === 'aurora') {
    side = mixHex(color, '#000000', 0.62);
  } else if (sharp) {
    side = mixHex(P.surface, '#000000', 0.62);
    radiusMul = 0;
  }

  return { side, depthMul, radiusMul, sharp };
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
    try {
      const flat = { ...state, cardDepth: 0 };
      const tilt: TiltState = { rx: 0, ry: 0, rz: 0, perspective: 1200 };
      const info = renderCard(ctx, flat, layout, coverImg, tilt, {
        flat: true,
        fullBleed: false,
      });
      paintGlare(ctx, flat, layout, tilt, true);
      sizeRef.current?.(info.size, info.overflow);
    } catch (err) {
      console.error(err);
    }
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
  tilt: TiltState | null;
  dragging: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.PointLight>(null);
  const pose = asTilt(tilt);
  const layout = LAYOUTS[state.layoutKey];
  const aspect = layout.w / layout.h;
  const max = 2.42;
  const w = aspect >= 1 ? max : max * aspect;
  const h = aspect >= 1 ? max / aspect : max;
  const shell = shellFor(state.theme, state.color);
  const depth = (0.05 + (state.cardDepth / 100) * 0.18) * shell.depthMul;
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

  const bodyMat = (
    <meshStandardMaterial
      color={shell.side}
      roughness={mat.roughness}
      metalness={state.theme === 'vinyl' ? 0.55 : mat.metalness}
    />
  );

  return (
    <group
      ref={group}
      rotation={[
        THREE.MathUtils.degToRad(pose.rx),
        THREE.MathUtils.degToRad(pose.ry),
        THREE.MathUtils.degToRad(pose.rz),
      ]}
    >
      {state.theme === 'chalkboard' && (
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[w + 0.16, h + 0.16, Math.max(0.04, depth * 0.9)]} />
          <meshStandardMaterial color="#6a4324" roughness={0.78} />
        </mesh>
      )}

      {(state.theme === 'glowsketch' || state.theme === 'neon' || state.theme === 'cyberpunk') && (
        <mesh position={[0, 0, -0.08]}>
          <planeGeometry args={[w * 1.08, h * 1.08]} />
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

      {state.theme === 'vinyl' && (
        <mesh position={[w * 0.28, -h * 0.2, -0.015]} rotation={[Math.PI / 2, 0, 0.15]}>
          <cylinderGeometry args={[Math.min(w, h) * 0.38, Math.min(w, h) * 0.38, 0.018, 40]} />
          <meshStandardMaterial color="#101010" roughness={0.4} metalness={0.35} />
        </mesh>
      )}

      <mesh>
        <boxGeometry args={[w, h, depth]} />
        {bodyMat}
      </mesh>

      {tex && (
        <mesh position={[0, 0, depth / 2 + 0.004]}>
          <planeGeometry args={[w * 0.992, h * 0.992]} />
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

function PreviewGrab() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    setPreviewGrab(() => {
      gl.render(scene, camera);
      const src = gl.domElement;
      const out = document.createElement('canvas');
      out.width = src.width;
      out.height = src.height;
      const ctx = out.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(src, 0, 0);
      return out;
    });
    return () => setPreviewGrab(null);
  }, [gl, scene, camera]);
  return null;
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
  tilt: TiltState | null;
  dragging: boolean;
  fontEpoch: number;
  onSize?: (size: number, overflow: boolean) => void;
}) {
  const tex = useCardTexture(state, coverImg, fontEpoch, onSize);
  const dpr: [number, number] =
    typeof window !== 'undefined' && window.innerWidth < 800 ? [1, 1.25] : [1, 1.75];

  return (
    <Canvas
      dpr={dpr}
      shadows={false}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.04, 6.55], fov: 28 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[-3.2, 4.2, 5.4]} intensity={1.15} />
      <directionalLight position={[2.4, -1.2, 3.2]} intensity={0.22} color="#f2f2f2" />
      <spotLight position={[0, 3.2, 4.5]} angle={0.55} penumbra={0.85} intensity={1.05} />
      <PreviewGrab />
      <CardMesh state={state} tex={tex} tilt={tilt} dragging={dragging} />
      <ContactShadows position={[0, -1.55, 0]} opacity={0.42} scale={9} blur={2.5} far={4} />
    </Canvas>
  );
}
