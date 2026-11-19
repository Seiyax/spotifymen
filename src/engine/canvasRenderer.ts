import {
  BgStyle,
  CardState,
  LayoutConfig,
  LayoutKey,
  ThemeKey,
  TiltState,
} from '../types';
import {
  CHILD_DEPTH_RATIO,
  COVER_RADIUS,
  EXTRUDE_GAIN,
  EXTRUDE_X_SIGN,
  FONT,
  GLARE,
  LAYOUTS,
  LIGHT_DIR,
  LYRIC_FONTS,
  THEME_FONT,
  THEME_INSET,
  THEME_R,
} from './constants';
import {
  contrastColor,
  hexToRgb,
  luma,
  mixHex,
  rgba,
} from '../utils/colorUtils';

const rad = (deg: number): number => (deg * Math.PI) / 180;

let fontGen = 0;
export const incrementFontGen = () => fontGen++;

// Cache word measurements
const wordWidths = new Map<string, number>();

export function wordWidth(
  g: CanvasRenderingContext2D,
  word: string,
  size: number,
  fontFamily: string,
  weight: number | string,
  k: number
): number {
  const key = `${fontGen}|${fontFamily}|${weight}|${size}|${k}|${word}`;
  let w = wordWidths.get(key);
  if (w === undefined) {
    w = g.measureText(word).width;
    if (wordWidths.size > 8000) wordWidths.clear();
    wordWidths.set(key, w);
  }
  return w;
}

export function parseLyrics(text: string): (string[] | null)[] {
  const paras = text.split('\n').map((raw) => {
    const t = raw.trim();
    return t ? t.split(/\s+/) : null;
  });
  while (paras.length && paras[0] === null) paras.shift();
  while (paras.length && paras[paras.length - 1] === null) paras.pop();
  return paras;
}

export const themeRadius = (theme: ThemeKey, baseRadius: number): number =>
  THEME_R[theme] !== undefined ? THEME_R[theme]! : baseRadius;

export function cardGeom(
  layoutKey: LayoutKey,
  theme: ThemeKey,
  cardDepth: number,
  bgStyle: BgStyle,
  tilt: TiltState,
  fixedExtrude = false
) {
  const L = LAYOUTS[layoutKey];
  const bx =
    bgStyle === 'none' ? 0 : Math.round(Math.min(L.w, L.h) * 0.075);
  const [l0, t0, r0, b0] = THEME_INSET[theme] || [0, 0, 0, 0];
  const l = l0 + bx;
  const t = t0 + bx;
  const r = r0 + bx;
  const b = b0 + bx;
  const aw = L.w - l - r;
  const ah = L.h - t - b;

  const v = getExtrusionVector(cardDepth, tilt, fixedExtrude);
  const ex = Math.abs(v.dx);
  const ey = Math.abs(v.dy);
  const s = Math.min(aw / (L.w + ex), ah / (L.h + ey));
  const w = L.w * s;
  const h = L.h * s;
  const totalW = w + ex * s;
  const totalH = h + ey * s;

  return {
    s,
    w,
    h,
    x: l + (aw - totalW) / 2 + (v.dx < 0 ? -v.dx * s : 0),
    y: t + (ah - totalH) / 2 + (v.dy < 0 ? -v.dy * s : 0),
    r: themeRadius(theme, L.radius) * s,
  };
}

export function getExtrusionVector(
  depth: number,
  tilt: TiltState,
  fixed = false
) {
  if (!(depth > 0)) return { dx: 0, dy: 0, len: 0, lit: 0 };
  let dx: number;
  let dy: number;
  if (fixed) {
    dx = dy = depth;
  } else {
    const rx = rad(tilt.rx);
    const ry = rad(tilt.ry);
    const rz = rad(tilt.rz);
    const sx = -Math.sin(ry) * EXTRUDE_X_SIGN * depth * EXTRUDE_GAIN;
    const sy = Math.sin(rx) * Math.cos(ry) * depth * EXTRUDE_GAIN;
    dx = Math.cos(rz) * sx + Math.sin(rz) * sy;
    dy = -Math.sin(rz) * sx + Math.cos(rz) * sy;
  }
  dx = Math.round(dx * 100) / 100;
  dy = Math.round(dy * 100) / 100;
  const len = Math.hypot(dx, dy);
  const lit = len ? (dx * LIGHT_DIR.x + dy * LIGHT_DIR.y) / len : 0;
  return { dx, dy, len, lit };
}

const rampCache = new Map<string, string[]>();
export function getRamp(
  baseColor: string,
  wallColor: string,
  theme: ThemeKey,
  v: { dx: number; dy: number; len: number; lit: number },
  n: number
): string[] {
  const glass = theme === 'glass';
  const base = glass ? mixHex(baseColor, '#ffffff', 0.5) : wallColor;
  const key = `${base}|${v.lit.toFixed(2)}|${n}|${glass ? 1 : 0}`;
  let r = rampCache.get(key);
  if (r) return r;
  if (rampCache.size > 50) rampCache.clear();
  const near =
    v.lit >= 0
      ? mixHex(base, '#ffffff', 0.1 + 0.3 * v.lit)
      : mixHex(base, '#000000', 0.05 - 0.1 * v.lit);
  const deep = mixHex(
    base,
    '#000000',
    (glass ? 0.2 : 0.4) + (0.25 * (1 - v.lit)) / 2
  );
  r = [];
  for (let k = 0; k < n; k++) {
    r.push(mixHex(near, deep, Math.pow((k + 1) / n, 0.85)));
  }
  rampCache.set(key, r);
  return r;
}

const layerMemo = new Map<string, { dx: number; dy: number; color: string }[]>();
export function getLayers(
  depth: number,
  tilt: TiltState,
  baseColor: string,
  wallColor: string,
  theme: ThemeKey,
  maxN: number,
  fixed = false
) {
  const v = getExtrusionVector(depth, tilt, fixed);
  if (v.len < 0.5) return null;
  const n = Math.max(1, Math.min(maxN, Math.ceil(v.len)));
  const key = `${v.dx}|${v.dy}|${wallColor}|${theme}|${baseColor}|${n}`;
  let out = layerMemo.get(key);
  if (out) return out;
  if (layerMemo.size > 30) layerMemo.clear();
  const ramp = getRamp(baseColor, wallColor, theme, v, n);
  out = [];
  for (let i = n; i >= 1; i--) {
    out.push({ dx: (v.dx * i) / n, dy: (v.dy * i) / n, color: ramp[i - 1] });
  }
  layerMemo.set(key, out);
  return out;
}

export function roundedPath(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

export function roundedRect(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  g.beginPath();
  roundedPath(g, x, y, w, h, r);
}

let wallLayer: HTMLCanvasElement | null = null;
function getWallLayer(w: number, h: number): HTMLCanvasElement {
  if (!wallLayer) wallLayer = document.createElement('canvas');
  if (wallLayer.width !== w || wallLayer.height !== h) {
    wallLayer.width = w;
    wallLayer.height = h;
  }
  return wallLayer;
}

export function extrudeWalls(
  g: CanvasRenderingContext2D,
  shape: (c: CanvasRenderingContext2D, ox: number, oy: number) => void,
  depth: number,
  tilt: TiltState,
  baseColor: string,
  wallColor: string,
  theme: ThemeKey,
  b?: { x: number; y: number; w: number; h: number },
  fixed = false
) {
  const v = getExtrusionVector(depth, tilt, fixed);
  if (v.len < 0.5) return;
  const glass = theme === 'glass';
  const n = Math.max(1, Math.min(80, Math.ceil(v.len / (v.len > 40 ? 2 : 1))));
  const ramp = getRamp(baseColor, wallColor, theme, v, n);

  const clipOut = (c: CanvasRenderingContext2D) => {
    c.beginPath();
    c.rect(-8192, -8192, 16384, 16384);
    shape(c, 0, 0);
    c.clip('evenodd');
  };

  let t = g;
  let layer: HTMLCanvasElement | null = null;

  if (glass) {
    layer = getWallLayer(g.canvas.width, g.canvas.height);
    const layerCtx = layer.getContext('2d');
    if (layerCtx) {
      t = layerCtx;
      t.setTransform(1, 0, 0, 1, 0, 0);
      t.clearRect(0, 0, layer.width, layer.height);
      t.setTransform(g.getTransform());
    }
  }

  t.save();
  clipOut(t);
  for (let i = n; i >= 1; i--) {
    t.fillStyle = ramp[i - 1];
    t.beginPath();
    shape(t, (v.dx * i) / n, (v.dy * i) / n);
    t.fill();
  }

  if (b) {
    const cx = b.x + b.w / 2 + v.dx / 2;
    const cy = b.y + b.h / 2 + v.dy / 2;
    const hd = (Math.hypot(b.w, b.h) + v.len) / 2;
    const gr = t.createLinearGradient(
      cx + LIGHT_DIR.x * hd,
      cy + LIGHT_DIR.y * hd,
      cx - LIGHT_DIR.x * hd,
      cy - LIGHT_DIR.y * hd
    );
    gr.addColorStop(0, 'rgba(255,255,255,0.20)');
    gr.addColorStop(0.45, 'rgba(255,255,255,0)');
    gr.addColorStop(0.55, 'rgba(0,0,0,0)');
    gr.addColorStop(1, 'rgba(0,0,0,0.35)');
    t.fillStyle = gr;
    const stride = Math.max(2, Math.ceil(n / 12));
    for (let i = n; i >= 1; i -= stride) {
      t.beginPath();
      shape(t, (v.dx * i) / n, (v.dy * i) / n);
      t.fill();
    }
    t.beginPath();
    shape(t, v.dx, v.dy);
    t.fill();
  }
  t.restore();

  if (glass && layer) {
    g.save();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha *= 0.3;
    g.drawImage(layer, 0, 0);
    g.restore();

    g.save();
    clipOut(g);
    g.lineJoin = 'round';
    g.strokeStyle = 'rgba(255,255,255,0.8)';
    g.lineWidth = 2.5;
    g.beginPath();
    shape(g, v.dx, v.dy);
    g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.4)';
    g.lineWidth = 1.5;
    g.beginPath();
    shape(g, 0, 0);
    g.stroke();
    g.restore();
  }
}

export function letterSpacing(g: CanvasRenderingContext2D, px: number) {
  if ('letterSpacing' in g) {
    (g as any).letterSpacing = px + 'px';
  }
}

export function wrapLine(
  g: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (g.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  lines.push(line);
  return lines;
}

export function ellipsize(
  g: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  if (g.measureText(text).width <= maxWidth) return text;
  while (text.length > 1 && g.measureText(text + '…').width > maxWidth) {
    text = text.slice(0, -1);
  }
  return text.trimEnd() + '…';
}

export function getPalette(theme: ThemeKey, bg: string) {
  const P = {
    text: contrastColor(bg),
    surface: bg,
    glow: null as string | null,
    wall: mixHex(bg, '#000000', 0.45),
    neon: null as string | null,
    shadowDark: null as string | null,
    passes: [{ dx: 0, dy: 0, color: contrastColor(bg), main: true }],
  };

  switch (theme) {
    case 'cyberpunk':
      P.neon =
        luma(bg) < 90
          ? mixHex(bg, '#ffffff', 0.55)
          : mixHex(bg, '#ffffff', 0.2);
      P.text = P.neon;
      P.glow = bg;
      P.wall = mixHex(P.neon, '#000000', 0.62);
      break;
    case 'glass':
      P.text = '#FFFFFF';
      break;
    case 'vinyl':
      P.surface = mixHex(bg, '#000000', 0.84);
      P.text = '#FFFFFF';
      break;
    case 'aurora':
      P.surface = mixHex(bg, '#000000', 0.82);
      P.text = '#FFFFFF';
      break;
    case 'ticket':
      P.surface = mixHex(bg, '#ffffff', 0.9);
      P.text = mixHex(bg, '#000000', 0.72);
      break;
    case 'polaroid':
      P.surface = '#FAF8F3';
      P.text = '#262626';
      break;
    case 'y2k':
      P.surface = mixHex(bg, '#ffffff', 0.6);
      P.text =
        luma(mixHex(bg, '#ffffff', 0.5)) > 150
          ? mixHex(bg, '#000000', 0.78)
          : '#0d0d1a';
      break;
    case 'pixel':
      P.surface = mixHex(bg, '#ffffff', 0.86);
      P.text = '#111111';
      break;
    case 'notebook':
      P.surface = '#FBF7EA';
      P.text = '#243049';
      break;
    case 'newspaper':
      P.surface = '#EAE5D6';
      P.text = '#161616';
      break;
    case 'holo':
      P.surface = mixHex(bg, '#000000', 0.82);
      P.text = '#FFFFFF';
      break;
    case 'cassette':
      P.surface = mixHex(bg, '#F2E8D0', 0.88);
      P.text = '#2A2118';
      break;
    case 'receipt':
      P.surface = '#FAF9F4';
      P.text = '#1A1A1A';
      break;
    case 'gameboy':
      P.surface = '#9BBC0F';
      P.text = '#0F380F';
      break;
    case 'stained':
      P.surface = mixHex(bg, '#000000', 0.5);
      P.text = '#FFFFFF';
      break;
    case 'comic':
      P.surface = mixHex(bg, '#ffffff', 0.86);
      P.text = '#111111';
      break;
    case 'neon':
      P.neon =
        luma(bg) < 90
          ? mixHex(bg, '#ffffff', 0.55)
          : mixHex(bg, '#ffffff', 0.25);
      P.text = P.neon;
      P.glow = bg;
      P.surface = '#0D0A10';
      P.wall = mixHex(P.neon, '#000000', 0.62);
      break;
    case 'clay':
      P.surface = mixHex(bg, '#ffffff', 0.5);
      P.text =
        luma(P.surface) > 128 ? mixHex(bg, '#000000', 0.62) : '#FFFFFF';
      break;
    case 'neumorphism':
      P.surface = mixHex(bg, '#ffffff', 0.62);
      P.text = mixHex(P.surface, '#000000', 0.62);
      P.shadowDark = rgba(mixHex(bg, '#000000', 0.4), 0.55);
      break;
  }

  if (!P.wall) P.wall = mixHex(P.surface, '#000000', 0.45);
  P.passes = [{ dx: 0, dy: 0, color: P.text, main: true }];
  return P;
}

export function cardFrame(
  layout: LayoutConfig,
  theme: ThemeKey,
  hideCover: boolean
) {
  const W = layout.w;
  const H = layout.h;
  const pad = layout.pad;
  const wide = W / H >= 1.3;

  const f: {
    cx: number;
    cy: number;
    cs: number;
    hx: number;
    hy: number;
    hw: number;
    top: boolean;
    lx: number;
    x1: number;
    y1: number;
    ltop: number;
    mid: boolean;
    bx0: number;
    fx: number;
    stub: { v: boolean; at: number; len: number } | null;
  } = {
    cx: pad,
    cy: pad,
    cs: layout.cover,
    hx: pad + (hideCover ? 0 : layout.cover + layout.headGap),
    hy: pad + layout.cover / 2,
    hw: 0,
    top: false,
    lx: pad,
    x1: W - pad,
    y1: H - pad,
    ltop: pad + layout.cover + layout.lyricGap,
    mid: layout.lyricMiddle,
    bx0: pad,
    fx: pad,
    stub: null,
  };

  if (theme === 'ticket') {
    if (wide) {
      const sw = Math.round(W * 0.2);
      f.stub = { v: true, at: W - sw, len: sw };
      f.x1 = W - sw - 44;
    } else {
      const sh = Math.round(H * 0.17);
      f.stub = { v: false, at: H - sh, len: sh };
      f.y1 = H - sh - 36;
    }
  }

  if (!f.hw) f.hw = f.x1 - f.hx;
  return f;
}

const logoSprites = new Map<string, HTMLCanvasElement>();
export function getLogoSprite(
  color: string,
  logoSize: number,
  sc: number
): HTMLCanvasElement {
  const key = `${color}|${logoSize}|${sc}`;
  let off = logoSprites.get(key);
  if (off) return off;
  if (logoSprites.size >= 30) logoSprites.clear();

  const r = logoSize / 2;
  off = document.createElement('canvas');
  off.width = off.height = Math.round(logoSize * sc);
  const og = off.getContext('2d');
  if (!og) return off;
  og.setTransform(sc, 0, 0, sc, 0, 0);
  og.globalCompositeOperation = 'source-over';
  og.globalAlpha = 1;

  og.fillStyle = color;
  og.beginPath();
  og.arc(r, r, r, 0, Math.PI * 2);
  og.fill();

  og.globalCompositeOperation = 'destination-out';
  og.strokeStyle = '#000000';
  og.lineCap = 'round';
  og.lineJoin = 'round';

  const arcs = [
    { x1: -0.56, y1: -0.22, qx: 0.04, qy: -0.46, x2: 0.6, y2: -0.12, w: 0.16 },
    { x1: -0.47, y1: 0.04, qx: 0.02, qy: -0.14, x2: 0.5, y2: 0.14, w: 0.13 },
    { x1: -0.38, y1: 0.27, qx: 0.01, qy: 0.13, x2: 0.4, y2: 0.35, w: 0.1 },
  ];
  for (const a of arcs) {
    og.lineWidth = a.w * r;
    og.beginPath();
    og.moveTo(r + a.x1 * r, r + a.y1 * r);
    og.quadraticCurveTo(
      r + a.qx * r,
      r + a.qy * r,
      r + a.x2 * r,
      r + a.y2 * r
    );
    og.stroke();
  }
  og.globalCompositeOperation = 'source-over';
  logoSprites.set(key, off);
  return off;
}

const patternCache = new Map<string, CanvasPattern | null>();
export function tilePattern(
  ctx: CanvasRenderingContext2D,
  key: string,
  size: number,
  draw: (c: CanvasRenderingContext2D, n: number) => void
): CanvasPattern | null {
  if (patternCache.has(key)) return patternCache.get(key) || null;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const cx = c.getContext('2d');
  if (cx) draw(cx, size);
  const p = ctx.createPattern(c, 'repeat');
  if (patternCache.size > 50) patternCache.clear();
  patternCache.set(key, p);
  return p;
}

export function sparkle(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(x, y - r);
  g.quadraticCurveTo(x, y, x + r, y);
  g.quadraticCurveTo(x, y, x, y + r);
  g.quadraticCurveTo(x, y, x - r, y);
  g.quadraticCurveTo(x, y, x, y - r);
  g.fill();
}

export function cardDrop(
  g: CanvasRenderingContext2D,
  W: number,
  H: number,
  R: number,
  fill: string,
  blur = 30,
  oy = 14,
  unit = 1
) {
  g.save();
  g.shadowColor = 'rgba(0,0,0,0.42)';
  g.shadowBlur = blur * unit;
  g.shadowOffsetX = 0;
  g.shadowOffsetY = oy * unit;
  g.fillStyle = fill;
  roundedRect(g, 0, 0, W, H, R);
  g.fill();
  g.restore();
}

const stubCache: { key: string; bars: number[]; no: string } = {
  key: '',
  bars: [],
  no: '',
};

export function stubBars(title: string, artist: string) {
  const key = `${title}|${artist}`;
  if (stubCache.key !== key) {
    let h = 2166136261;
    for (let i = 0; i < key.length; i++) {
      h = Math.imul(h ^ key.charCodeAt(i), 16777619) >>> 0;
    }
    const rnd = () => {
      h = (h + 0x6d2b79f5) >>> 0;
      let t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const bars = [1, 1, 1];
    let sum = 3;
    while (sum < 110) {
      const w = [1, 1, 2, 2, 3, 4][Math.floor(rnd() * 6)];
      bars.push(w);
      sum += w;
    }
    bars.push(1, 1, 1);
    stubCache.bars = bars;
    stubCache.no = 'No. ' + String(Math.floor(rnd() * 900000) + 100000);
    stubCache.key = key;
  }
  return stubCache;
}

export function drawStub(
  g: CanvasRenderingContext2D,
  P: ReturnType<typeof getPalette>,
  st: { v: boolean; at: number; len: number },
  layout: LayoutConfig,
  title: string,
  artist: string
) {
  const W = layout.w;
  const H = layout.h;
  const c = stubBars(title, artist);
  g.save();
  if (st.v) {
    g.translate(st.at + st.len / 2, H / 2);
    g.rotate(Math.PI / 2);
  } else {
    g.translate(W / 2, st.at + st.len / 2);
  }
  const lw = (st.v ? H : W) - 150;
  const lh = st.len - (st.v ? 72 : 56);
  const top = -lh / 2;
  const fs = 22;

  g.fillStyle = P.text;
  g.textBaseline = 'top';
  g.font = `600 ${fs}px ${FONT}`;
  letterSpacing(g, 0);
  g.globalAlpha = 0.8;
  g.textAlign = 'left';
  g.fillText('Admit one', -lw / 2, top);
  g.textAlign = 'right';
  g.fillText(c.no, lw / 2, top);
  g.globalAlpha = 1;
  g.textAlign = 'left';

  const total = c.bars.reduce((a, b) => a + b, 0);
  const u = lw / total;
  const y0 = top + fs + 16;
  const bh = lh - fs - 16;
  let x = -lw / 2;
  c.bars.forEach((w, i) => {
    if (i % 2 === 0) g.fillRect(x, y0, w * u, bh);
    x += w * u;
  });
  g.restore();
}

export function drawCoverPlaceholder(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  textColor: string
) {
  g.fillStyle = rgba(textColor, 0.16);
  g.fillRect(x, y, size, size);

  g.fillStyle = rgba(textColor, 0.55);
  const cx = x + size / 2;
  const cy = y + size / 2;
  const u = size / 100;

  g.beginPath();
  g.ellipse(cx - 9 * u, cy + 16 * u, 11 * u, 8.5 * u, -0.35, 0, Math.PI * 2);
  g.fill();
  g.fillRect(cx + 0.5 * u, cy - 26 * u, 5 * u, 42 * u);
  g.beginPath();
  g.moveTo(cx + 5.5 * u, cy - 26 * u);
  g.quadraticCurveTo(cx + 24 * u, cy - 20 * u, cx + 20 * u, cy - 2 * u);
  g.quadraticCurveTo(cx + 18 * u, cy - 14 * u, cx + 5.5 * u, cy - 14 * u);
  g.closePath();
  g.fill();
}

export function coverRadius(
  coverShape: CardState['coverShape'],
  theme: ThemeKey,
  cs: number,
  defaultR: number
): number {
  if (coverShape === 'square') return 0;
  if (coverShape === 'rounded') return Math.round(cs * 0.16);
  if (coverShape === 'circle') return cs / 2;
  return COVER_RADIUS[theme] !== undefined ? COVER_RADIUS[theme]! : defaultR;
}

export function drawCover(
  g: CanvasRenderingContext2D,
  state: CardState,
  layout: LayoutConfig,
  P: ReturnType<typeof getPalette>,
  coverImg: HTMLImageElement | null,
  tilt: TiltState,
  unit = 1,
  fixedExtrude = false
) {
  const f = cardFrame(layout, state.theme, state.hide.cover);
  const x = f.cx;
  const y = f.cy;
  const S = f.cs;
  const r = coverRadius(state.coverShape, state.theme, S, layout.coverR);

  const cd = Math.round(state.cardDepth * CHILD_DEPTH_RATIO);
  if (cd > 0) {
    extrudeWalls(
      g,
      (c, ox, oy) => roundedPath(c, x + ox, y + oy, S, S, r),
      cd,
      tilt,
      state.color,
      P.wall,
      state.theme,
      { x, y, w: S, h: S },
      fixedExtrude
    );
  }

  if (state.theme === 'clay') {
    g.save();
    g.shadowColor = rgba(mixHex(state.color, '#000000', 0.55), 0.5);
    g.shadowBlur = 18 * unit;
    g.shadowOffsetX = 8 * unit;
    g.shadowOffsetY = 8 * unit;
    g.fillStyle = P.surface;
    roundedRect(g, x, y, S, S, r);
    g.fill();
    g.restore();
  } else if (state.theme === 'neumorphism') {
    g.save();
    g.fillStyle = P.surface;
    roundedRect(g, x, y, S, S, r);
    g.shadowColor = 'rgba(255,255,255,0.9)';
    g.shadowBlur = 12 * unit;
    g.shadowOffsetX = -6 * unit;
    g.shadowOffsetY = -6 * unit;
    g.fill();
    g.shadowColor = P.shadowDark || 'rgba(0,0,0,0.4)';
    g.shadowOffsetX = 6 * unit;
    g.shadowOffsetY = 6 * unit;
    g.fill();
    g.restore();
  }

  g.save();
  roundedRect(g, x, y, S, S, r);
  g.clip();
  if (coverImg && coverImg.naturalWidth) {
    const side = Math.min(coverImg.naturalWidth, coverImg.naturalHeight);
    const sx = (coverImg.naturalWidth - side) / 2;
    const sy = (coverImg.naturalHeight - side) / 2;
    g.drawImage(coverImg, sx, sy, side, side, x, y, S, S);
  } else {
    drawCoverPlaceholder(g, x, y, S, P.text);
  }
  g.restore();

  if (state.theme === 'brutalism' || state.theme === 'comic') {
    g.strokeStyle = '#000000';
    g.lineWidth = 6;
    roundedRect(g, x + 3, y + 3, S - 6, S - 6, Math.max(0, r - 3));
    g.stroke();
  } else if (state.theme === 'gameboy') {
    g.save();
    roundedRect(g, x, y, S, S, r);
    g.clip();
    g.globalCompositeOperation = 'multiply';
    g.fillStyle = '#9BBC0F';
    g.fillRect(x, y, S, S);
    g.restore();
    g.strokeStyle = '#0F380F';
    g.lineWidth = 5;
    roundedRect(g, x + 2.5, y + 2.5, S - 5, S - 5, 0);
    g.stroke();
  } else if (state.theme === 'cyberpunk' || state.theme === 'neon') {
    g.save();
    g.shadowColor = state.color;
    g.shadowBlur = 15 * unit;
    g.strokeStyle = P.neon || '#00FFCC';
    g.lineWidth = 2.5;
    roundedRect(g, x + 1.25, y + 1.25, S - 2.5, S - 2.5, r - 1);
    g.stroke();
    g.restore();
  } else if (state.theme === 'glass') {
    g.strokeStyle = 'rgba(255,255,255,0.55)';
    g.lineWidth = 1.5;
    roundedRect(g, x + 0.75, y + 0.75, S - 1.5, S - 1.5, r - 1);
    g.stroke();
  }
}

const headerCache = { key: '', titleLines: [] as string[], artist: '' };

export function drawHeader(
  g: CanvasRenderingContext2D,
  state: CardState,
  layout: LayoutConfig,
  P: ReturnType<typeof getPalette>,
  tilt: TiltState,
  unit = 1,
  fixedExtrude = false
) {
  const f = cardFrame(layout, state.theme, state.hide.cover);
  const x = f.hx;
  const maxWidth = f.hw;

  const titleSize = layout.titleSize;
  const titleLine = layout.titleLine;
  const artistSize = layout.artistSize;
  const artistLine = layout.artistLine;

  const title = state.title.trim() || 'Song title';
  const artistText = state.artist.trim() || 'Artist';

  g.textBaseline = 'top';
  g.font = `700 ${titleSize}px ${FONT}`;
  letterSpacing(g, -0.5);

  const key = `${fontGen}|${state.layoutKey}|${maxWidth}|${title}|${artistText}`;
  if (headerCache.key !== key) {
    let lines = wrapLine(g, title, maxWidth);
    if (lines.length > 2) {
      lines = lines.slice(0, 2);
      lines[1] = ellipsize(g, lines[1] + ' …', maxWidth);
    }
    headerCache.titleLines = lines.map((l) => ellipsize(g, l, maxWidth));

    g.font = `400 ${artistSize}px ${FONT}`;
    letterSpacing(g, 0);
    headerCache.artist = ellipsize(g, artistText, maxWidth);
    headerCache.key = key;

    g.font = `700 ${titleSize}px ${FONT}`;
    letterSpacing(g, -0.5);
  }

  const titleLines = state.hide.title ? [] : headerCache.titleLines;
  const total =
    titleLines.length * titleLine + (state.hide.artist ? 0 : artistLine);
  const y0 = f.top ? f.hy : f.hy - total / 2;
  const yArtist = y0 + titleLines.length * titleLine;

  const lay = getLayers(
    Math.round(state.cardDepth * CHILD_DEPTH_RATIO),
    tilt,
    state.color,
    P.wall,
    state.theme,
    16,
    fixedExtrude
  );

  if (lay) {
    for (const o of lay) {
      g.fillStyle = o.color;
      let y = y0;
      for (const line of titleLines) {
        g.fillText(line, x + o.dx, y + o.dy);
        y += titleLine;
      }
    }
    if (!state.hide.artist) {
      g.font = `400 ${artistSize}px ${FONT}`;
      letterSpacing(g, 0);
      for (const o of lay) {
        g.fillStyle = o.color;
        g.fillText(headerCache.artist, x + o.dx, yArtist + o.dy);
      }
      g.font = `700 ${titleSize}px ${FONT}`;
      letterSpacing(g, -0.5);
    }
  }

  if (P.glow) {
    g.shadowColor = P.glow;
    g.shadowBlur = 15 * unit;
  }

  for (const p of P.passes) {
    g.fillStyle = p.color;
    let y = y0;
    for (const line of titleLines) {
      g.fillText(line, x + p.dx, y + p.dy);
      y += titleLine;
    }
  }

  g.font = `400 ${artistSize}px ${FONT}`;
  letterSpacing(g, 0);
  for (const p of state.hide.artist ? [] : P.passes) {
    g.globalAlpha = p.main ? 0.85 : 1;
    g.fillStyle = p.color;
    g.fillText(headerCache.artist, x + p.dx, yArtist + p.dy);
  }
  g.globalAlpha = 1;
  if (P.glow) {
    g.shadowColor = 'rgba(0,0,0,0)';
    g.shadowBlur = 0;
  }
}

export const lyricFontObj = (stateFont: string, theme: ThemeKey) => {
  const effectiveKey =
    stateFont === 'auto'
      ? (THEME_FONT[theme] || 'poppins')
      : stateFont;
  return (LYRIC_FONTS as any)[effectiveKey] || LYRIC_FONTS.poppins;
};

export const lyricFontCss = (
  size: number,
  stateFont: string,
  theme: ThemeKey
) => {
  const f = lyricFontObj(stateFont, theme);
  return `${f.weight} ${(size * f.k).toFixed(2)}px ${f.family}`;
};

export function layoutLyrics(
  g: CanvasRenderingContext2D,
  paras: (string[] | null)[],
  size: number,
  maxWidth: number,
  stateFont: string,
  theme: ThemeKey,
  build = false
) {
  const lineHeight = Math.round(size * 1.2);
  const gap = Math.round(lineHeight * 0.5);
  const f = lyricFontObj(stateFont, theme);
  g.font = lyricFontCss(size, stateFont, theme);
  letterSpacing(g, -size * 0.02);
  const space = wordWidth(g, ' ', size, f.family, f.weight, f.k);

  const rows: { text: string; h: number; p?: number }[] = [];
  let height = 0;
  let tooWide = false;

  for (let pi = 0; pi < paras.length; pi++) {
    const words = paras[pi];
    if (!words) {
      height += gap;
      if (build) rows.push({ text: '', h: gap });
      continue;
    }
    let line = '';
    let lineW = 0;
    for (const word of words) {
      const w = wordWidth(g, word, size, f.family, f.weight, f.k);
      if (w > maxWidth) tooWide = true;
      if (lineW && lineW + space + w > maxWidth) {
        height += lineHeight;
        if (build) rows.push({ text: line, h: lineHeight, p: pi });
        line = build ? word : '';
        lineW = w;
      } else {
        if (build) line = lineW ? line + ' ' + word : word;
        lineW = lineW ? lineW + space + w : w;
      }
    }
    height += lineHeight;
    if (build) rows.push({ text: line, h: lineHeight, p: pi });
  }

  letterSpacing(g, 0);
  return { rows, height, tooWide };
}

export function fitLyricSize(
  g: CanvasRenderingContext2D,
  paras: (string[] | null)[],
  maxWidth: number,
  avail: number,
  minSize: number,
  maxSize: number,
  stateFont: string,
  theme: ThemeKey
) {
  const fits = (s: number) => {
    const m = layoutLyrics(g, paras, s, maxWidth, stateFont, theme, false);
    return !m.tooWide && m.height <= avail;
  };

  if (!fits(minSize)) return { size: minSize, overflow: true };
  if (fits(maxSize)) return { size: maxSize, overflow: false };

  let lo = minSize;
  let hi = maxSize - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (fits(mid)) lo = mid;
    else hi = mid - 1;
  }

  let best = lo;
  for (let s = lo + 1, end = Math.min(maxSize, lo + 12); s <= end; s++) {
    if (fits(s)) best = s;
  }
  return { size: best, overflow: false };
}

export const barUnit = (logoSize: number) => (logoSize / 72) * 0.85;
export const barSpace = (hideBar: boolean, logoSize: number) =>
  hideBar ? 0 : Math.round(156 * barUnit(logoSize));

export function drawLyrics(
  g: CanvasRenderingContext2D,
  state: CardState,
  layout: LayoutConfig,
  P: ReturnType<typeof getPalette>,
  tilt: TiltState,
  unit = 1,
  fixedExtrude = false
) {
  const f = cardFrame(layout, state.theme, state.hide.cover);
  const maxWidth = f.x1 - f.lx;
  const top = f.ltop;
  const bSpace = barSpace(state.hide.bar, layout.logo);
  const bottom = f.y1 - layout.logo - layout.logoGap - bSpace;
  const avail = bottom - top;

  const hasText = state.lyrics.trim().length > 0;
  const text = hasText ? state.lyrics : 'Your lyrics\nwill appear here';
  const paras = parseLyrics(text);

  let size: number;
  let overflow: boolean;

  if (state.autoFit) {
    const fitRes = fitLyricSize(
      g,
      paras,
      maxWidth,
      avail,
      layout.lyricMin,
      layout.lyricMax,
      state.lyricFont,
      state.theme
    );
    size = fitRes.size;
    overflow = fitRes.overflow;
  } else {
    size = state.lyricSize;
    const checkLayout = layoutLyrics(
      g,
      paras,
      size,
      maxWidth,
      state.lyricFont,
      state.theme,
      false
    );
    overflow = checkLayout.height > avail || checkLayout.tooWide;
  }

  const layoutRes = layoutLyrics(
    g,
    paras,
    size,
    maxWidth,
    state.lyricFont,
    state.theme,
    true
  );

  g.globalAlpha = hasText ? 1 : 0.45;
  const baseAlpha = g.globalAlpha;
  const hl =
    hasText && state.hlLine >= 0 && state.hlLine < paras.length
      ? state.hlLine
      : -1;
  const ra = (row: { p?: number }) =>
    hl >= 0 && row.p !== hl ? baseAlpha * 0.34 : baseAlpha;

  g.font = lyricFontCss(size, state.lyricFont, state.theme);
  g.textBaseline = 'top';
  letterSpacing(g, -size * 0.02);

  const ax =
    state.align === 'center'
      ? f.lx + maxWidth / 2
      : state.align === 'right'
      ? f.x1
      : f.lx;
  g.textAlign = state.align;

  const y0 =
    top + (f.mid ? Math.max(0, (avail - layoutRes.height) / 2) : 0);

  const lay = getLayers(
    Math.round(state.cardDepth * CHILD_DEPTH_RATIO),
    tilt,
    state.color,
    P.wall,
    state.theme,
    20,
    fixedExtrude
  );

  if (lay) {
    for (const o of lay) {
      g.fillStyle = o.color;
      let y = y0;
      for (const row of layoutRes.rows) {
        if (row.text) {
          g.globalAlpha = ra(row);
          g.fillText(row.text, ax + o.dx, y + o.dy);
        }
        y += row.h;
      }
    }
  }

  if (P.glow) {
    g.shadowColor = P.glow;
    g.shadowBlur = 15 * unit;
  }

  for (const p of P.passes) {
    g.fillStyle = p.color;
    let y = y0;
    for (const row of layoutRes.rows) {
      if (row.text) {
        g.globalAlpha = ra(row);
        g.fillText(row.text, ax + p.dx, y + p.dy);
      }
      y += row.h;
    }
  }

  if (P.glow) {
    g.shadowColor = 'rgba(0,0,0,0)';
    g.shadowBlur = 0;
  }
  g.textAlign = 'left';
  letterSpacing(g, 0);
  g.globalAlpha = 1;

  return { size, overflow };
}

export function drawProgress(
  g: CanvasRenderingContext2D,
  layout: LayoutConfig,
  P: ReturnType<typeof getPalette>,
  unit = 1
) {
  const f = cardFrame(layout, 'classic', false);
  const u = barUnit(layout.logo);
  const x0 = f.bx0;
  const x1 = f.x1;
  const w = x1 - x0;
  const frac = 0.38;

  const top =
    f.y1 - layout.logo - layout.logoGap - barSpace(false, layout.logo) + 26 * u;
  const ty = top + 8 * u;
  const th = Math.max(4, 7 * u);
  const kr = 11 * u;
  const tsY = ty + kr + 26 * u;

  g.save();
  if (P.glow) {
    g.shadowColor = P.glow;
    g.shadowBlur = 12 * unit;
  }
  g.fillStyle = P.text;
  g.globalAlpha = 0.3;
  roundedRect(g, x0, ty - th / 2, w, th, th / 2);
  g.fill();
  g.globalAlpha = 1;
  roundedRect(g, x0, ty - th / 2, w * frac, th, th / 2);
  g.fill();
  g.beginPath();
  g.arc(x0 + w * frac, ty, kr, 0, Math.PI * 2);
  g.fill();

  g.font = `600 ${22 * u}px ${FONT}`;
  letterSpacing(g, 0);
  g.textBaseline = 'alphabetic';
  g.globalAlpha = 0.75;
  g.textAlign = 'left';
  g.fillText('1:24', x0, tsY);
  g.textAlign = 'right';
  g.fillText('-2:07', x1, tsY);
  g.textAlign = 'left';
  g.globalAlpha = 1;

  const cx = (x0 + x1) / 2;
  const cy = tsY + 24 * u + 30 * u;
  const gap = Math.min(w / 5, 118 * u);
  const i = 13 * u;

  g.strokeStyle = P.text;
  g.fillStyle = P.text;
  g.lineWidth = 3 * u;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.globalAlpha = 0.8;

  // shuffle
  g.beginPath();
  g.moveTo(cx - 2 * gap - i, cy + i * 0.6);
  g.lineTo(cx - 2 * gap - i * 0.2, cy + i * 0.6);
  g.lineTo(cx - 2 * gap + i, cy - i * 0.6);
  g.moveTo(cx - 2 * gap - i, cy - i * 0.6);
  g.lineTo(cx - 2 * gap - i * 0.2, cy - i * 0.6);
  g.lineTo(cx - 2 * gap + i, cy + i * 0.6);
  g.stroke();

  // repeat
  roundedRect(g, cx + 2 * gap - i, cy - i * 0.6, i * 2, i * 1.2, i * 0.5);
  g.stroke();

  // previous / next
  const tri = (tx: number, d: number) => {
    g.beginPath();
    g.moveTo(tx - d * i * 0.7, cy - i);
    g.lineTo(tx + d * i * 0.7, cy);
    g.lineTo(tx - d * i * 0.7, cy + i);
    g.closePath();
    g.fill();
  };
  g.globalAlpha = 1;
  tri(cx - gap + i * 0.3, -1);
  g.fillRect(cx - gap - i * 0.95, cy - i, 3 * u, i * 2);
  tri(cx + gap - i * 0.3, 1);
  g.fillRect(cx + gap + i * 0.95 - 3 * u, cy - i, 3 * u, i * 2);

  // play / pause disc
  g.beginPath();
  g.arc(cx, cy, 30 * u, 0, Math.PI * 2);
  g.fill();

  if (P.glow) {
    g.shadowColor = 'rgba(0,0,0,0)';
    g.shadowBlur = 0;
  }
  g.fillStyle = P.surface || '#000';
  g.fillRect(cx - 9 * u, cy - 11 * u, 6.5 * u, 22 * u);
  g.fillRect(cx + 2.5 * u, cy - 11 * u, 6.5 * u, 22 * u);
  g.restore();
}

export function drawFooter(
  g: CanvasRenderingContext2D,
  state: CardState,
  layout: LayoutConfig,
  P: ReturnType<typeof getPalette>,
  tilt: TiltState,
  unit = 1,
  fixedExtrude = false
) {
  const f = cardFrame(layout, state.theme, state.hide.cover);
  const x = f.fx;
  const y = f.y1 - layout.logo;
  const cy = y + layout.logo / 2;

  const sc = Math.max(1, Math.ceil(g.getTransform ? g.getTransform().a : 1));
  const sprite = getLogoSprite(P.text, layout.logo, sc);

  const lay = getLayers(
    Math.round(state.cardDepth * CHILD_DEPTH_RATIO),
    tilt,
    state.color,
    P.wall,
    state.theme,
    16,
    fixedExtrude
  );

  if (lay) {
    for (let k = 0; k < lay.length; k++) {
      const o = lay[k];
      g.drawImage(
        getLogoSprite(lay[k - (k % 4)].color, layout.logo, sc),
        x + o.dx,
        y + o.dy,
        layout.logo,
        layout.logo
      );
    }
  }

  if (P.glow) {
    g.shadowColor = P.glow;
    g.shadowBlur = 15 * unit;
  }
  g.drawImage(sprite, x, y, layout.logo, layout.logo);

  g.font = `700 ${layout.wordmark}px ${FONT}`;
  g.textBaseline = 'middle';
  const k = Math.max(1, Math.round(layout.wordmark / 26));
  letterSpacing(g, -k);
  const wx = x + layout.logo + Math.round(layout.logo * 0.22);

  if (lay) {
    if (P.glow) {
      g.shadowColor = 'rgba(0,0,0,0)';
      g.shadowBlur = 0;
    }
    for (const o of lay) {
      g.fillStyle = o.color;
      g.fillText('Spotify', wx + o.dx, cy + k + o.dy);
    }
    if (P.glow) {
      g.shadowColor = P.glow;
      g.shadowBlur = 15 * unit;
    }
  }

  for (const p of P.passes) {
    g.fillStyle = p.color;
    g.fillText('Spotify', wx + p.dx, cy + k + p.dy);
  }
  letterSpacing(g, 0);
  g.textBaseline = 'alphabetic';
  if (P.glow) {
    g.shadowColor = 'rgba(0,0,0,0)';
    g.shadowBlur = 0;
  }
}

const codeCache = new Map<string, HTMLImageElement | 'loading' | 'fail'>();
export function drawCode(
  g: CanvasRenderingContext2D,
  state: CardState,
  layout: LayoutConfig,
  P: ReturnType<typeof getPalette>,
  onLoad: () => void
) {
  if (!state.trackId || !/^#[0-9a-f]{6}$/i.test(P.surface)) return;
  const f = cardFrame(layout, state.theme, state.hide.cover);
  const h = layout.logo;
  const w = h * 4;
  const x = f.x1 - w;
  const y = f.y1 - layout.logo;
  const url = `https://scannables.scdn.co/uri/plain/png/${P.surface.slice(
    1
  )}/${luma(P.surface) < 150 ? 'white' : 'black'}/640/spotify:track:${
    state.trackId
  }`;

  let im = codeCache.get(url);
  if (im === undefined) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    codeCache.set(url, 'loading');
    img.onload = () => {
      codeCache.set(url, img);
      onLoad();
    };
    img.onerror = () => {
      codeCache.set(url, 'fail');
    };
    img.src = url;
    return;
  }
  if (typeof im === 'string') return;
  g.save();
  roundedRect(g, x, y, w, h, h * 0.16);
  g.clip();
  g.drawImage(im, x, y, w, h);
  g.restore();
}

let blurBgImg: HTMLImageElement | null = null;
let blurBgCanvas: HTMLCanvasElement | null = null;

export function blurredCover(coverImg: HTMLImageElement | null) {
  if (!coverImg || !coverImg.naturalWidth) return null;
  if (blurBgImg === coverImg && blurBgCanvas) return blurBgCanvas;

  let cur = document.createElement('canvas');
  cur.width = cur.height = 24;
  const cx = cur.getContext('2d');
  if (!cx) return null;
  cx.drawImage(coverImg, 0, 0, 24, 24);

  for (const n of [64, 160, 256]) {
    const nx = document.createElement('canvas');
    nx.width = nx.height = n;
    const nc = nx.getContext('2d');
    if (nc) {
      nc.imageSmoothingQuality = 'high';
      nc.drawImage(cur, 0, 0, n, n);
    }
    cur = nx;
  }
  blurBgImg = coverImg;
  blurBgCanvas = cur;
  return cur;
}

export function paintMetalBackground(
  g: CanvasRenderingContext2D,
  W: number,
  H: number,
  radius: number,
  bg: string,
  fullBleed: boolean
) {
  const silver = '#D3D6DC';
  const linear = g.createLinearGradient(0, 0, W, H);
  [
    [0.0, mixHex(bg, silver, 0.4)],
    [0.3, mixHex(bg, silver, 0.1)],
    [0.52, mixHex(bg, '#FFFFFF', 0.16)],
    [0.76, mixHex(bg, '#000000', 0.1)],
    [1.0, mixHex(bg, '#000000', 0.24)],
  ].forEach(([p, c]) => linear.addColorStop(p as number, c as string));

  const hx = W * 0.82;
  const hy = -H * 0.05;
  const radial = g.createRadialGradient(hx, hy, 0, hx, hy, W * 0.6);
  radial.addColorStop(0, 'rgba(255,255,255,0.22)');
  radial.addColorStop(1, 'rgba(255,255,255,0)');

  const bevel = g.createLinearGradient(0, 0, 0, H);
  bevel.addColorStop(0, 'rgba(255,255,255,0.40)');
  bevel.addColorStop(0.35, 'rgba(255,255,255,0.06)');
  bevel.addColorStop(1, 'rgba(255,255,255,0)');

  g.save();
  if (fullBleed) {
    g.beginPath();
    g.rect(0, 0, W, H);
  } else {
    roundedRect(g, 0, 0, W, H, radius);
  }
  g.clip();

  g.fillStyle = linear;
  g.fillRect(0, 0, W, H);
  g.fillStyle = radial;
  g.fillRect(0, 0, W, H);

  if (!fullBleed) {
    g.strokeStyle = bevel;
    g.lineWidth = 3;
    roundedRect(g, 1.5, 1.5, W - 3, H - 3, radius - 1.5);
    g.stroke();
  }
  g.restore();
}

export function paintBgStyle(
  g: CanvasRenderingContext2D,
  layout: LayoutConfig,
  bgStyle: BgStyle,
  bg: string,
  fullBleed: boolean,
  coverImg: HTMLImageElement | null
) {
  const W = layout.w;
  const H = layout.h;
  g.save();
  if (fullBleed) {
    g.beginPath();
    g.rect(0, 0, W, H);
  } else {
    roundedRect(g, 0, 0, W, H, layout.radius);
  }
  g.clip();

  const bc = bgStyle === 'blur' ? blurredCover(coverImg) : null;
  if (bc) {
    const k = Math.max(W, H) / 256;
    g.drawImage(bc, (W - 256 * k) / 2, (H - 256 * k) / 2, 256 * k, 256 * k);
    g.fillStyle = 'rgba(0,0,0,0.3)';
    g.fillRect(0, 0, W, H);
  } else if (bgStyle === 'pattern') {
    g.fillStyle = mixHex(bg, '#000000', 0.55);
    g.fillRect(0, 0, W, H);
    const pat = tilePattern(g, 'bgdots', 40, (c, n) => {
      c.fillStyle = 'rgba(255,255,255,0.16)';
      c.beginPath();
      c.arc(n / 2, n / 2, 3.2, 0, 6.3);
      c.fill();
    });
    if (pat) {
      g.fillStyle = pat;
      g.fillRect(0, 0, W, H);
    }
  } else {
    const a = g.createLinearGradient(0, 0, W, H);
    a.addColorStop(0, mixHex(bg, '#ffffff', 0.22));
    a.addColorStop(0.55, bg);
    a.addColorStop(1, mixHex(bg, '#000000', 0.62));
    g.fillStyle = a;
    g.fillRect(0, 0, W, H);
  }
  g.restore();
}

export function paintBackdrop(
  g: CanvasRenderingContext2D,
  layout: LayoutConfig,
  theme: ThemeKey,
  bg: string,
  P: ReturnType<typeof getPalette>,
  bgStyle: BgStyle,
  cardDepth: number,
  fullBleed: boolean,
  coverImg: HTMLImageElement | null
) {
  if (bgStyle !== 'none') {
    paintBgStyle(g, layout, bgStyle, bg, fullBleed, coverImg);
    return;
  }
  if (theme === 'classic') {
    if (fullBleed && cardDepth > 0) {
      g.fillStyle = bg;
      g.fillRect(0, 0, layout.w, layout.h);
    }
    return;
  }
  const wants =
    fullBleed ||
    theme === 'cyberpunk' ||
    theme === 'glass' ||
    theme === 'neumorphism' ||
    theme === 'neon';
  if (!wants) return;

  const W = layout.w;
  const H = layout.h;
  g.save();
  if (fullBleed) {
    g.beginPath();
    g.rect(0, 0, W, H);
  } else {
    roundedRect(g, 0, 0, W, H, layout.radius);
  }
  g.clip();

  if (theme === 'glass') {
    const base = g.createLinearGradient(0, 0, W, H);
    base.addColorStop(0, mixHex(bg, '#000000', 0.35));
    base.addColorStop(1, mixHex(bg, '#000000', 0.72));
    const o1 = g.createRadialGradient(
      W * 0.2,
      H * 0.2,
      0,
      W * 0.2,
      H * 0.2,
      W * 0.55
    );
    o1.addColorStop(0, rgba(mixHex(bg, '#ffffff', 0.12), 0.95));
    o1.addColorStop(1, rgba(bg, 0));
    const accent = mixHex(bg, '#00D4FF', 0.55);
    const o2 = g.createRadialGradient(
      W * 0.86,
      H * 0.86,
      0,
      W * 0.86,
      H * 0.86,
      W * 0.5
    );
    o2.addColorStop(0, rgba(accent, 0.85));
    o2.addColorStop(1, rgba(accent, 0));

    g.fillStyle = base;
    g.fillRect(0, 0, W, H);
    g.fillStyle = o1;
    g.fillRect(0, 0, W, H);
    g.fillStyle = o2;
    g.fillRect(0, 0, W, H);
  } else {
    g.fillStyle =
      theme === 'cyberpunk' || theme === 'neon'
        ? '#0a0a0a'
        : theme === 'neumorphism'
        ? P.surface
        : bg;
    g.fillRect(0, 0, W, H);
  }
  g.restore();
}

export function paintCardBody(
  g: CanvasRenderingContext2D,
  state: CardState,
  layout: LayoutConfig,
  P: ReturnType<typeof getPalette>,
  tilt: TiltState,
  fullBleed: boolean,
  unit = 1,
  fixedExtrude = false
) {
  const W = layout.w;
  const H = layout.h;
  const theme = state.theme;
  const bg = state.color;
  const R = themeRadius(theme, layout.radius);
  const D = state.cardDepth;

  if (D > 0) {
    extrudeWalls(
      g,
      (c, ox, oy) => roundedPath(c, ox, oy, W, H, R),
      D,
      tilt,
      bg,
      P.wall,
      theme,
      { x: 0, y: 0, w: W, h: H },
      fixedExtrude
    );
  }

  switch (theme) {
    case 'brutalism': {
      if (D === 0) {
        g.fillStyle = '#000000';
        g.fillRect(12, 12, W, H);
      }
      g.fillStyle = bg;
      g.fillRect(0, 0, W, H);
      g.strokeStyle = '#000000';
      g.lineWidth = 8;
      g.strokeRect(4, 4, W - 8, H - 8);
      break;
    }
    case 'cyberpunk': {
      g.fillStyle = '#0a0a0a';
      roundedRect(g, 0, 0, W, H, R);
      g.fill();
      g.save();
      g.shadowColor = bg;
      g.shadowBlur = 15 * unit;
      g.strokeStyle = P.neon || '#00FFCC';
      g.lineWidth = 4;
      roundedRect(g, 2, 2, W - 4, H - 4, R - 2);
      g.stroke();
      g.stroke();
      g.restore();
      g.strokeStyle = rgba(P.neon || '#00FFCC', 0.22);
      g.lineWidth = 1.5;
      roundedRect(g, 14, 14, W - 28, H - 28, R - 12);
      g.stroke();
      break;
    }
    case 'glass': {
      const shine = g.createLinearGradient(0, 0, W, H);
      shine.addColorStop(0, 'rgba(255,255,255,0.30)');
      shine.addColorStop(0.32, 'rgba(255,255,255,0.10)');
      shine.addColorStop(0.5, 'rgba(255,255,255,0)');
      shine.addColorStop(1, 'rgba(255,255,255,0.05)');

      g.fillStyle = 'rgba(255, 255, 255, 0.1)';
      roundedRect(g, 0, 0, W, H, R);
      g.fill();
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      g.fillStyle = shine;
      g.fillRect(0, 0, W, H);
      g.restore();

      const o = 0.75;
      g.lineWidth = 1.5;
      g.lineCap = 'round';
      g.strokeStyle = 'rgba(255,255,255,0.16)';
      roundedRect(g, o, o, W - 2 * o, H - 2 * o, R - o);
      g.stroke();
      g.strokeStyle = 'rgba(255,255,255,0.85)';
      g.beginPath();
      g.moveTo(o, H - R);
      g.lineTo(o, R);
      g.arcTo(o, o, R, o, R - o);
      g.lineTo(W - R, o);
      g.stroke();
      g.strokeStyle = 'rgba(0,0,0,0.30)';
      g.beginPath();
      g.moveTo(W - o, R);
      g.lineTo(W - o, H - R);
      g.arcTo(W - o, H - o, W - R, H - o, R - o);
      g.lineTo(R, H - o);
      g.stroke();
      g.lineCap = 'butt';
      break;
    }
    case 'clay': {
      const inner = g.createLinearGradient(0, 0, W, H);
      inner.addColorStop(0, mixHex(P.surface, '#ffffff', 0.6));
      inner.addColorStop(0.6, mixHex(P.surface, '#ffffff', 0.12));
      inner.addColorStop(1, P.surface);
      const rim = g.createLinearGradient(0, 0, W, H);
      rim.addColorStop(0, 'rgba(0,0,0,0)');
      rim.addColorStop(0.5, 'rgba(0,0,0,0)');
      rim.addColorStop(1, rgba(mixHex(bg, '#000000', 0.6), 0.32));

      g.save();
      g.shadowColor = rgba(mixHex(bg, '#000000', 0.55), 0.55);
      g.shadowBlur = 44 * unit;
      g.shadowOffsetX = 18 * unit;
      g.shadowOffsetY = 18 * unit;
      g.fillStyle = P.surface;
      roundedRect(g, 0, 0, W, H, R);
      g.fill();
      g.restore();

      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      g.fillStyle = inner;
      roundedRect(g, 12, 12, W - 38, H - 38, R - 12);
      g.fill();
      g.strokeStyle = rim;
      g.lineWidth = 30;
      roundedRect(g, 0, 0, W, H, R);
      g.stroke();
      g.restore();
      break;
    }
    case 'neumorphism': {
      g.save();
      g.fillStyle = P.surface;
      roundedRect(g, 0, 0, W, H, R);
      g.shadowColor = 'rgba(255,255,255,0.95)';
      g.shadowBlur = 26 * unit;
      g.shadowOffsetX = -13 * unit;
      g.shadowOffsetY = -13 * unit;
      g.fill();
      g.shadowColor = P.shadowDark || 'rgba(0,0,0,0.4)';
      g.shadowOffsetX = 13 * unit;
      g.shadowOffsetY = 13 * unit;
      g.fill();
      g.restore();
      break;
    }
    case 'vinyl': {
      cardDrop(g, W, H, R, P.surface, 34, 16, unit);
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      const cx = W;
      const cy = H;
      const rr = Math.min(W, H) * 0.55;
      g.fillStyle = '#0a0a0a';
      g.beginPath();
      g.arc(cx, cy, rr, 0, 7);
      g.fill();
      g.lineWidth = 1.5;
      for (let r = rr * 0.36; r < rr - 6; r += 7) {
        g.strokeStyle = `rgba(255,255,255,${
          0.03 + 0.035 * Math.abs(Math.sin(r * 0.7))
        })`;
        g.beginPath();
        g.arc(cx, cy, r, 0, 7);
        g.stroke();
      }
      g.fillStyle = 'rgba(255,255,255,0.06)';
      for (const a of [-2.3, 0.84]) {
        g.beginPath();
        g.moveTo(cx, cy);
        g.arc(cx, cy, rr, a, a + 0.5);
        g.fill();
      }
      g.fillStyle = bg;
      g.beginPath();
      g.arc(cx, cy, rr * 0.3, 0, 7);
      g.fill();
      g.strokeStyle = 'rgba(0,0,0,0.25)';
      g.lineWidth = 3;
      g.beginPath();
      g.arc(cx, cy, rr * 0.24, 0, 7);
      g.stroke();
      g.fillStyle = P.surface;
      g.beginPath();
      g.arc(cx, cy, 9, 0, 7);
      g.fill();
      g.restore();
      break;
    }
    case 'ticket': {
      const f = cardFrame(layout, theme, state.hide.cover);
      const st = f.stub || { v: false, at: H - 150, len: 150 };
      const nr = 18;
      cardDrop(g, W, H, R, P.surface, 28, 14, unit);
      g.save();
      g.globalCompositeOperation = 'destination-out';
      for (const [x, y] of st.v
        ? [
            [st.at, 0],
            [st.at, H],
          ]
        : [
            [0, st.at],
            [W, st.at],
          ]) {
        g.beginPath();
        g.arc(x, y, nr, 0, 7);
        g.fill();
      }
      g.restore();
      g.save();
      g.strokeStyle = rgba(P.text, 0.4);
      g.lineWidth = 3;
      g.lineCap = 'round';
      g.setLineDash([1, 11]);
      g.beginPath();
      if (st.v) {
        g.moveTo(st.at, nr + 16);
        g.lineTo(st.at, H - nr - 16);
      } else {
        g.moveTo(nr + 16, st.at);
        g.lineTo(W - nr - 16, st.at);
      }
      g.stroke();
      g.restore();

      g.save();
      g.strokeStyle = rgba(P.text, 0.32);
      g.lineWidth = 3;
      g.setLineDash([12, 9]);
      const bw = st.v ? st.at - 26 - 28 : W - 52;
      const bh = st.v ? H - 52 : st.at - 26 - 28;
      roundedRect(g, 26, 26, bw, bh, Math.max(4, R - 12));
      g.stroke();
      g.restore();
      drawStub(g, P, st, layout, state.title, state.artist);
      break;
    }
    case 'polaroid': {
      cardDrop(g, W, H, R, P.surface, 30, 16, unit);
      const pg = g.createLinearGradient(0, 0, 0, H);
      pg.addColorStop(0, 'rgba(255,255,255,0)');
      pg.addColorStop(1, 'rgba(0,0,0,0.07)');
      g.fillStyle = pg;
      roundedRect(g, 0, 0, W, H, R);
      g.fill();
      g.strokeStyle = 'rgba(0,0,0,0.08)';
      g.lineWidth = 2;
      roundedRect(g, 1, 1, W - 2, H - 2, R);
      g.stroke();
      g.save();
      g.translate(W / 2, 4);
      g.rotate(-0.045);
      g.fillStyle = 'rgba(255,226,150,0.78)';
      g.fillRect(-96, -22, 192, 50);
      g.fillStyle = 'rgba(255,255,255,0.35)';
      g.fillRect(-96, -22, 192, 12);
      g.restore();
      break;
    }
    case 'y2k': {
      cardDrop(g, W, H, R, P.surface, 34, 16, unit);
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, mixHex(bg, '#ffffff', 0.85));
      gr.addColorStop(0.46, mixHex(bg, '#ffffff', 0.55));
      gr.addColorStop(0.54, mixHex(bg, '#ffffff', 0.5));
      gr.addColorStop(1, mixHex(bg, '#ffffff', 0.78));
      g.fillStyle = gr;
      roundedRect(g, 0, 0, W, H, R);
      g.fill();
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      g.fillStyle = 'rgba(255,255,255,0.35)';
      g.beginPath();
      g.ellipse(W * 0.4, -H * 0.12, W * 0.8, H * 0.3, 0, 0, 7);
      g.fill();
      sparkle(g, W * 0.9, H * 0.12, 34, 'rgba(255,255,255,0.95)');
      sparkle(g, W * 0.82, H * 0.2, 16, 'rgba(255,255,255,0.8)');
      sparkle(g, W * 0.1, H * 0.92, 26, 'rgba(255,255,255,0.9)');
      g.restore();
      g.strokeStyle = 'rgba(255,255,255,0.95)';
      g.lineWidth = 8;
      roundedRect(g, 4, 4, W - 8, H - 8, R - 4);
      g.stroke();
      g.strokeStyle = rgba(mixHex(bg, '#000000', 0.5), 0.45);
      g.lineWidth = 2;
      roundedRect(g, 10, 10, W - 20, H - 20, R - 10);
      g.stroke();
      break;
    }
    case 'aurora': {
      cardDrop(g, W, H, R, P.surface, 34, 16, unit);
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      for (const [x, y, k, c] of [
        [0.12, 0.18, 0.75, bg],
        [0.9, 0.38, 0.62, mixHex(bg, '#00D4FF', 0.6)],
        [0.45, 0.98, 0.78, mixHex(bg, '#FF4FD8', 0.55)],
      ] as [number, number, number, string][]) {
        const rg = g.createRadialGradient(
          W * x,
          H * y,
          0,
          W * x,
          H * y,
          Math.max(W, H) * k * 0.7
        );
        rg.addColorStop(0, rgba(c, 0.9));
        rg.addColorStop(1, rgba(c, 0));
        g.fillStyle = rg;
        g.fillRect(0, 0, W, H);
      }
      g.restore();
      g.strokeStyle = 'rgba(255,255,255,0.14)';
      g.lineWidth = 2;
      roundedRect(g, 1, 1, W - 2, H - 2, R);
      g.stroke();
      break;
    }
    case 'pixel': {
      if (D === 0) {
        g.fillStyle = '#000000';
        g.fillRect(12, 12, W, H);
      }
      g.fillStyle = P.surface;
      g.fillRect(0, 0, W, H);
      const pat = tilePattern(g, 'pxdots', 16, (c, n) => {
        c.fillStyle = 'rgba(0,0,0,0.07)';
        c.fillRect(0, 0, n / 2, n / 2);
        c.fillRect(n / 2, n / 2, n / 2, n / 2);
      });
      if (pat) {
        g.fillStyle = pat;
        g.fillRect(0, 0, W, H);
      }
      g.fillStyle = bg;
      g.fillRect(0, 0, W, 44);
      g.fillStyle = '#000000';
      g.fillRect(0, 40, W, 6);
      for (let i = 0; i < 3; i++) {
        g.fillStyle = i === 0 ? '#ffffff' : 'rgba(255,255,255,0.55)';
        g.fillRect(18 + i * 26, 14, 14, 14);
      }
      g.strokeStyle = '#000000';
      g.lineWidth = 8;
      g.strokeRect(4, 4, W - 8, H - 8);
      break;
    }
    case 'notebook': {
      cardDrop(g, W, H, R, P.surface, 28, 14, unit);
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      g.strokeStyle = 'rgba(70,120,200,0.26)';
      g.lineWidth = 2;
      for (let y = 60; y < H; y += 56) {
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(W, y);
        g.stroke();
      }
      const mx = Math.max(40, layout.pad - 28);
      g.strokeStyle = 'rgba(220,70,70,0.5)';
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(mx, 0);
      g.lineTo(mx, H);
      g.stroke();
      for (const f of [0.2, 0.5, 0.8]) {
        g.fillStyle = 'rgba(0,0,0,0.16)';
        g.beginPath();
        g.arc(18, H * f, 11, 0, 7);
        g.fill();
        g.fillStyle = 'rgba(0,0,0,0.12)';
        g.beginPath();
        g.arc(19, H * f + 2, 8, 0, 7);
        g.fill();
      }
      g.restore();
      break;
    }
    case 'newspaper': {
      cardDrop(g, W, H, R, P.surface, 26, 12, unit);
      const pat = tilePattern(g, 'halftone', 12, (c, n) => {
        c.fillStyle = 'rgba(0,0,0,0.10)';
        c.beginPath();
        c.arc(n / 2, n / 2, 1.5, 0, 7);
        c.fill();
      });
      if (pat) {
        g.fillStyle = pat;
        roundedRect(g, 0, 0, W, H, R);
        g.fill();
      }
      g.strokeStyle = 'rgba(22,22,22,0.85)';
      g.lineWidth = 4;
      g.strokeRect(22, 22, W - 44, H - 44);
      g.lineWidth = 1.5;
      g.strokeRect(31, 31, W - 62, H - 62);
      break;
    }
    case 'sticker': {
      g.save();
      g.shadowColor = 'rgba(0,0,0,0.4)';
      g.shadowBlur = 24 * unit;
      g.shadowOffsetX = 0;
      g.shadowOffsetY = 12 * unit;
      g.fillStyle = '#ffffff';
      roundedRect(g, -16, -16, W + 32, H + 32, R + 16);
      g.fill();
      g.restore();
      g.fillStyle = bg;
      roundedRect(g, 0, 0, W, H, R);
      g.fill();
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      const sg = g.createLinearGradient(0, 0, W, H);
      sg.addColorStop(0, 'rgba(255,255,255,0.22)');
      sg.addColorStop(0.45, 'rgba(255,255,255,0)');
      g.fillStyle = sg;
      g.fillRect(0, 0, W, H);
      const f = Math.min(W, H) * 0.13;
      g.save();
      g.shadowColor = 'rgba(0,0,0,0.35)';
      g.shadowBlur = 14 * unit;
      g.shadowOffsetX = -4 * unit;
      g.shadowOffsetY = -4 * unit;
      g.fillStyle = mixHex(bg, '#ffffff', 0.8);
      g.beginPath();
      g.moveTo(W - f, H + 2);
      g.lineTo(W + 2, H - f);
      g.lineTo(W - f * 0.2, H - f * 0.2);
      g.closePath();
      g.fill();
      g.restore();
      g.restore();
      break;
    }
    case 'holo': {
      cardDrop(g, W, H, R, P.surface, 34, 16, unit);
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      const hsl = (h: number, a: number) => `hsla(${h},95%,62%,${a})`;
      const fo = g.createLinearGradient(0, 0, W, H);
      [0, 60, 130, 190, 250, 310, 360].forEach((h, i, a) =>
        fo.addColorStop(i / (a.length - 1), hsl(h, 0.95))
      );
      g.fillStyle = fo;
      g.fillRect(0, 0, W, H);
      g.fillStyle = P.surface;
      roundedRect(g, 20, 20, W - 40, H - 40, Math.max(6, R - 14));
      g.fill();
      const sh = g.createLinearGradient(0, H, W, 0);
      [0, 90, 180, 270, 330].forEach((h, i, a) =>
        sh.addColorStop(i / (a.length - 1), hsl(h, 0.16))
      );
      g.fillStyle = sh;
      roundedRect(g, 20, 20, W - 40, H - 40, Math.max(6, R - 14));
      g.fill();
      sparkle(g, W * 0.93, H * 0.07, 20, 'rgba(255,255,255,0.9)');
      sparkle(g, W * 0.87, H * 0.12, 10, 'rgba(255,255,255,0.7)');
      sparkle(g, W * 0.07, H * 0.955, 14, 'rgba(255,255,255,0.8)');
      g.restore();
      g.strokeStyle = 'rgba(255,255,255,0.55)';
      g.lineWidth = 2;
      roundedRect(g, 1, 1, W - 2, H - 2, R);
      g.stroke();
      break;
    }
    case 'wrapped': {
      cardDrop(g, W, H, R, bg, 34, 16, unit);
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      const wg = g.createLinearGradient(0, 0, W, H);
      const m = Math.min(W, H);
      wg.addColorStop(0, mixHex(bg, '#ffffff', 0.18));
      wg.addColorStop(0.55, bg);
      wg.addColorStop(1, mixHex(bg, '#7358FF', 0.5));
      g.fillStyle = wg;
      g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(255,255,255,0.10)';
      g.beginPath();
      g.arc(W * 0.92, H * 0.12, m * 0.34, 0, 7);
      g.fill();
      g.fillStyle = 'rgba(0,0,0,0.10)';
      g.beginPath();
      g.arc(W * 0.02, H * 0.98, m * 0.42, 0, 7);
      g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.14)';
      g.lineWidth = m * 0.05;
      g.beginPath();
      g.arc(W * 0.8, H * 0.9, m * 0.3, 0, 7);
      g.stroke();
      g.fillStyle = rgba(P.text, 0.5);
      roundedRect(g, W / 2 - 70, H - 20, 140, 6, 3);
      g.fill();
      g.restore();
      break;
    }
    case 'cassette': {
      cardDrop(g, W, H, R, P.surface, 30, 14, unit);
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      [bg, mixHex(bg, '#ffffff', 0.4), mixHex(bg, '#000000', 0.3), bg].forEach(
        (c, i) => {
          g.fillStyle = c;
          g.fillRect(0, i * 8, W, 8);
        }
      );
      const bh = 46;
      g.fillStyle = mixHex(P.surface, '#000000', 0.22);
      g.beginPath();
      g.moveTo(W * 0.12, H);
      g.lineTo(W * 0.17, H - bh);
      g.lineTo(W * 0.83, H - bh);
      g.lineTo(W * 0.88, H);
      g.closePath();
      g.fill();
      g.fillStyle = rgba(P.text, 0.55);
      for (const x of [0.3, 0.7]) {
        g.beginPath();
        g.arc(W * x, H - bh * 0.45, 10, 0, 7);
        g.fill();
      }
      g.strokeStyle = 'rgba(0,0,0,0.3)';
      g.lineWidth = 2;
      for (const [x, y] of [
        [24, 54],
        [W - 24, 54],
        [24, H - 24],
        [W - 24, H - 24],
      ]) {
        g.fillStyle = 'rgba(0,0,0,0.16)';
        g.beginPath();
        g.arc(x, y, 9, 0, 7);
        g.fill();
        g.beginPath();
        g.moveTo(x - 5, y - 5);
        g.lineTo(x + 5, y + 5);
        g.stroke();
      }
      g.restore();
      break;
    }
    case 'receipt': {
      const n = Math.round(W / 22);
      const tw = W / n;
      const tt = 10;
      const zig = (c: CanvasRenderingContext2D) => {
        c.beginPath();
        c.moveTo(0, tt);
        for (let i = 0; i < n; i++) {
          c.lineTo(i * tw + tw / 2, 0);
          c.lineTo((i + 1) * tw, tt);
        }
        c.lineTo(W, H - tt);
        for (let i = n; i > 0; i--) {
          c.lineTo(i * tw - tw / 2, H);
          c.lineTo((i - 1) * tw, H - tt);
        }
        c.closePath();
      };
      g.save();
      g.shadowColor = 'rgba(0,0,0,0.4)';
      g.shadowBlur = 28 * unit;
      g.shadowOffsetX = 0;
      g.shadowOffsetY = 14 * unit;
      g.fillStyle = P.surface;
      zig(g);
      g.fill();
      g.restore();
      g.save();
      zig(g);
      g.clip();
      const sg = g.createLinearGradient(0, 0, W, 0);
      sg.addColorStop(0, 'rgba(0,0,0,0.05)');
      sg.addColorStop(0.5, 'rgba(255,255,255,0.35)');
      sg.addColorStop(1, 'rgba(0,0,0,0.05)');
      g.fillStyle = sg;
      g.fillRect(0, 0, W, H);
      g.strokeStyle = rgba(P.text, 0.4);
      g.lineWidth = 3;
      g.setLineDash([10, 8]);
      const ry = layout.pad + layout.cover + layout.lyricGap / 2;
      g.beginPath();
      g.moveTo(layout.pad, ry);
      g.lineTo(W - layout.pad, ry);
      g.stroke();
      g.setLineDash([]);
      g.fillStyle = rgba(P.text, 0.5);
      g.font = `600 22px 'Courier New', monospace`;
      letterSpacing(g, 2);
      g.textAlign = 'center';
      g.textBaseline = 'alphabetic';
      g.fillText('*** THANK YOU ***', W / 2, H - 30);
      g.textAlign = 'left';
      letterSpacing(g, 0);
      g.restore();
      break;
    }
    case 'gameboy': {
      cardDrop(g, W, H, R, '#C9C6BB', 30, 14, unit);
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      g.fillStyle = '#5B5D74';
      roundedRect(g, 14, 14, W - 28, H - 28, 14);
      g.fill();
      g.fillStyle = P.surface;
      roundedRect(g, 30, 30, W - 60, H - 60, 6);
      g.fill();
      const pat = tilePattern(g, 'lcd', 6, (c, k) => {
        c.fillStyle = 'rgba(15,56,15,0.10)';
        c.fillRect(0, 0, k, 1);
        c.fillRect(0, 0, 1, k);
      });
      if (pat) {
        g.fillStyle = pat;
        roundedRect(g, 30, 30, W - 60, H - 60, 6);
        g.fill();
      }
      g.fillStyle = '#D33A4A';
      g.beginPath();
      g.arc(22, H / 2, 3.5, 0, 7);
      g.fill();
      g.restore();
      break;
    }
    case 'stained': {
      cardDrop(g, W, H, R, '#0c0c10', 30, 14, unit);
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      const cols = 5;
      const rows = Math.max(4, Math.round((cols * H) / W));
      const cw = W / cols;
      const rh = H / rows;
      let sd = 7;
      const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      const pts: [number, number][][] = [];
      for (let j = 0; j <= rows; j++) {
        pts.push([]);
        for (let i = 0; i <= cols; i++) {
          const jx = (rnd() - 0.5) * cw * 0.55;
          const jy = (rnd() - 0.5) * rh * 0.55;
          pts[j].push([
            i * cw + (i % cols ? jx : 0),
            j * rh + (j % rows ? jy : 0),
          ]);
        }
      }
      const cs = [
        bg,
        mixHex(bg, '#E8115B', 0.5),
        mixHex(bg, '#F5B700', 0.55),
        mixHex(bg, '#1DB9D6', 0.55),
        mixHex(bg, '#7358FF', 0.55),
      ];
      const quad = (j: number, i: number) => {
        g.beginPath();
        [pts[j][i], pts[j][i + 1], pts[j + 1][i + 1], pts[j + 1][i]].forEach(
          (q, k) => (k ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))
        );
        g.closePath();
      };
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          g.fillStyle = mixHex(
            cs[Math.floor(rnd() * cs.length)],
            '#000000',
            0.5
          );
          quad(j, i);
          g.fill();
        }
      }
      const lg = g.createRadialGradient(
        W / 2,
        H * 0.4,
        0,
        W / 2,
        H * 0.4,
        Math.max(W, H) * 0.7
      );
      lg.addColorStop(0, 'rgba(255,255,255,0.18)');
      lg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = lg;
      g.fillRect(0, 0, W, H);
      g.strokeStyle = '#07070a';
      g.lineWidth = 7;
      g.lineJoin = 'round';
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          quad(j, i);
          g.stroke();
        }
      }
      g.lineWidth = 18;
      roundedRect(g, 0, 0, W, H, R);
      g.stroke();
      g.restore();
      break;
    }
    case 'neon': {
      cardDrop(g, W, H, R, P.surface, 30, 14, unit);
      g.save();
      roundedRect(g, 0, 0, W, H, R);
      g.clip();
      const pat = tilePattern(g, 'brick', 64, (c, k) => {
        c.fillStyle = 'rgba(255,255,255,0.07)';
        c.fillRect(0, 0, k, 2);
        c.fillRect(0, k / 2, k, 2);
        c.fillRect(0, 0, 2, k / 2);
        c.fillRect(k / 2, k / 2, 2, k / 2);
      });
      if (pat) {
        g.fillStyle = pat;
        g.fillRect(0, 0, W, H);
      }
      const wg = g.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.65
      );
      wg.addColorStop(0, rgba(bg, 0.2));
      wg.addColorStop(1, rgba(bg, 0));
      g.fillStyle = wg;
      g.fillRect(0, 0, W, H);
      g.restore();

      const per = 2 * (W + H);
      const tube = (ins: number, lw: number, col: string, blur: number) => {
        g.save();
        g.shadowColor = bg;
        g.shadowBlur = blur * unit;
        g.strokeStyle = col;
        g.lineWidth = lw;
        g.lineCap = 'round';
        g.setLineDash([per - 70, 70]);
        roundedRect(g, ins, ins, W - 2 * ins, H - 2 * ins, Math.max(6, R - ins));
        g.stroke();
        g.stroke();
        g.restore();
      };
      tube(18, 7, P.neon || '#00FFCC', 26);
      tube(34, 3, rgba(P.neon || '#00FFCC', 0.7), 14);
      tube(18, 2, mixHex(P.neon || '#00FFCC', '#ffffff', 0.75), 0);
      break;
    }
    case 'comic': {
      if (D === 0) {
        g.fillStyle = '#111111';
        g.fillRect(14, 14, W, H);
      }
      g.fillStyle = P.surface;
      g.fillRect(0, 0, W, H);
      g.save();
      g.beginPath();
      g.rect(0, 0, W, H);
      g.clip();
      g.fillStyle = mixHex(bg, '#ffffff', 0.15);
      g.beginPath();
      const reach = Math.min(W, H) * 0.9;
      const st = 26;
      for (let y = 0; y < H; y += st) {
        for (let x = 0; x < W; x += st) {
          const d = Math.hypot(W - x, H - y) / reach;
          if (d >= 1) continue;
          const rr = 9 * (1 - d);
          g.moveTo(x + rr, y);
          g.arc(x, y, rr, 0, 7);
        }
      }
      g.fill();
      g.fillStyle = '#FFD60A';
      g.strokeStyle = '#111111';
      g.lineWidth = 5;
      g.lineJoin = 'miter';
      g.beginPath();
      for (let i = 0; i < 24; i++) {
        const a = (i * Math.PI) / 12;
        const r = i % 2 ? 24 : 46;
        g[i ? 'lineTo' : 'moveTo'](
          W - 34 + Math.cos(a) * r,
          34 + Math.sin(a) * r
        );
      }
      g.closePath();
      g.fill();
      g.stroke();
      g.restore();
      g.strokeStyle = '#111111';
      g.lineWidth = 10;
      g.strokeRect(5, 5, W - 10, H - 10);
      break;
    }
    default: {
      const bleed = fullBleed && D === 0;
      if (state.layoutKey === 'wide') {
        paintMetalBackground(g, W, H, layout.radius, bg, bleed);
      } else {
        g.fillStyle = bg;
        if (bleed) {
          g.fillRect(0, 0, W, H);
        } else {
          roundedRect(g, 0, 0, W, H, layout.radius);
          g.fill();
        }
      }
    }
  }
}

export function themeFinish(
  g: CanvasRenderingContext2D,
  theme: ThemeKey,
  bg: string,
  P: ReturnType<typeof getPalette>,
  layout: LayoutConfig
) {
  const W = layout.w;
  const H = layout.h;
  const R = themeRadius(theme, layout.radius);
  const m = Math.min(W, H);

  const clipCard = () => {
    g.save();
    roundedRect(g, 0, 0, W, H, R);
    g.clip();
  };

  const grain = (a: number) => {
    const pat = tilePattern(g, 'grain' + a, 96, (c, n) => {
      for (let i = 0; i < 520; i++) {
        c.fillStyle =
          Math.random() < 0.5
            ? `rgba(255,255,255,${a})`
            : `rgba(0,0,0,${a})`;
        c.fillRect(Math.random() * n, Math.random() * n, 1.4, 1.4);
      }
    });
    if (pat) {
      g.fillStyle = pat;
      g.fillRect(0, 0, W, H);
    }
  };

  const topLight = (a: number, h = 0.55) => {
    const l = g.createLinearGradient(0, 0, 0, H * h);
    l.addColorStop(0, `rgba(255,255,255,${a})`);
    l.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = l;
    g.fillRect(0, 0, W, H);
  };

  const vignette = (a: number) => {
    const v = g.createRadialGradient(
      W / 2,
      H / 2,
      m * 0.35,
      W / 2,
      H / 2,
      Math.max(W, H) * 0.78
    );
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, `rgba(0,0,0,${a})`);
    g.fillStyle = v;
    g.fillRect(0, 0, W, H);
  };

  switch (theme) {
    case 'classic':
      clipCard();
      topLight(0.1);
      grain(0.035);
      g.restore();
      break;
    case 'brutalism':
      g.save();
      g.beginPath();
      g.rect(10, H - 36, W - 20, 26);
      g.clip();
      g.strokeStyle = '#000';
      g.lineWidth = 6;
      for (let x = -40; x < W + 40; x += 22) {
        g.beginPath();
        g.moveTo(x, H - 8);
        g.lineTo(x + 26, H - 40);
        g.stroke();
      }
      g.restore();
      g.strokeStyle = '#000';
      g.lineWidth = 3;
      g.strokeRect(20, 20, W - 40, H - 40);
      break;
    case 'cyberpunk':
      clipCard();
      g.strokeStyle = rgba(P.neon || '#00FFCC', 0.07);
      g.lineWidth = 1;
      for (let x = 0; x < W; x += 64) {
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x, H);
        g.stroke();
      }
      for (let y = 0; y < H; y += 64) {
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(W, y);
        g.stroke();
      }
      g.fillStyle = 'rgba(0,0,0,0.22)';
      for (let y = 0; y < H; y += 6) g.fillRect(0, y, W, 2);
      vignette(0.45);
      g.restore();
      g.save();
      g.shadowColor = P.neon || '#00FFCC';
      g.shadowBlur = 12;
      g.strokeStyle = P.neon || '#00FFCC';
      g.lineWidth = 5;
      g.lineCap = 'square';
      for (const [x, y, sx, sy] of [
        [30, 30, 1, 1],
        [W - 30, 30, -1, 1],
        [30, H - 30, 1, -1],
        [W - 30, H - 30, -1, -1],
      ]) {
        g.beginPath();
        g.moveTo(x, y + sy * 46);
        g.lineTo(x, y);
        g.lineTo(x + sx * 46, y);
        g.stroke();
      }
      g.restore();
      break;
    case 'glass':
      clipCard();
      topLight(0.14, 0.4);
      grain(0.03);
      g.fillStyle = 'rgba(255,255,255,0.18)';
      g.beginPath();
      g.ellipse(W * 0.5, -H * 0.38, W * 0.9, H * 0.55, 0, 0, 7);
      g.fill();
      g.restore();
      break;
    case 'clay':
      clipCard();
      grain(0.03);
      g.fillStyle = 'rgba(255,255,255,0.55)';
      g.beginPath();
      g.ellipse(W * 0.2, H * 0.1, m * 0.1, m * 0.045, -0.5, 0, 7);
      g.fill();
      g.restore();
      break;
    case 'neumorphism':
      clipCard();
      grain(0.025);
      g.restore();
      break;
    case 'vinyl':
      clipCard();
      topLight(0.07);
      g.restore();
      break;
    case 'ticket':
      clipCard();
      grain(0.05);
      g.restore();
      break;
    case 'polaroid':
      clipCard();
      grain(0.04);
      vignette(0.07);
      g.restore();
      break;
    case 'y2k':
      clipCard();
      g.strokeStyle = 'rgba(255,255,255,0.18)';
      g.lineWidth = 2;
      for (let i = -H; i < W; i += 36) {
        g.beginPath();
        g.moveTo(i, H);
        g.lineTo(i + H, 0);
        g.stroke();
      }
      g.restore();
      break;
    case 'aurora':
      clipCard();
      grain(0.045);
      vignette(0.35);
      const starPat = tilePattern(g, 'stars', 160, (c, n) => {
        for (let i = 0; i < 14; i++) {
          c.fillStyle = `rgba(255,255,255,${0.25 + Math.random() * 0.5})`;
          c.beginPath();
          c.arc(
            Math.random() * n,
            Math.random() * n,
            Math.random() * 1.4 + 0.4,
            0,
            7
          );
          c.fill();
        }
      });
      if (starPat) {
        g.fillStyle = starPat;
        g.fillRect(0, 0, W, H);
      }
      g.restore();
      break;
    case 'pixel':
      g.fillStyle = 'rgba(255,255,255,0.35)';
      g.fillRect(8, 48, W - 16, 4);
      g.fillStyle = 'rgba(0,0,0,0.18)';
      g.fillRect(8, H - 14, W - 16, 6);
      break;
    case 'notebook':
      clipCard();
      grain(0.04);
      vignette(0.08);
      g.restore();
      break;
    case 'newspaper':
      clipCard();
      grain(0.06);
      vignette(0.14);
      g.restore();
      break;
    case 'sticker':
      clipCard();
      g.strokeStyle = 'rgba(255,255,255,0.35)';
      g.lineWidth = 3;
      roundedRect(g, 10, 10, W - 20, H - 20, Math.max(6, R - 10));
      g.stroke();
      g.restore();
      break;
    case 'holo':
      clipCard();
      g.globalCompositeOperation = 'overlay';
      const hg = g.createLinearGradient(0, 0, W, H);
      ['#ff4fd8', '#4fe3ff', '#fff36b', '#6bff9e', '#ff4fd8'].forEach(
        (c, i, a) => hg.addColorStop(i / (a.length - 1), c)
      );
      g.fillStyle = hg;
      g.globalAlpha = 0.35;
      g.fillRect(0, 0, W, H);
      g.restore();
      break;
    case 'wrapped':
      clipCard();
      grain(0.035);
      topLight(0.1);
      g.restore();
      break;
    case 'cassette':
      clipCard();
      grain(0.04);
      topLight(0.08);
      g.restore();
      break;
    case 'receipt':
      g.save();
      g.globalAlpha = 1;
      const rpat = tilePattern(g, 'paperfx', 96, (c, n) => {
        for (let i = 0; i < 380; i++) {
          c.fillStyle = `rgba(0,0,0,${0.02 + Math.random() * 0.03})`;
          c.fillRect(Math.random() * n, Math.random() * n, 1.3, 1.3);
        }
      });
      if (rpat) {
        g.fillStyle = rpat;
        g.fillRect(0, 12, W, H - 24);
      }
      g.restore();
      break;
    case 'gameboy':
      clipCard();
      topLight(0.08);
      g.restore();
      break;
    case 'stained':
      clipCard();
      vignette(0.35);
      g.restore();
      break;
    case 'neon':
      clipCard();
      vignette(0.4);
      grain(0.03);
      g.restore();
      break;
    case 'comic':
      clipCard();
      grain(0.03);
      g.restore();
      break;
  }
}

export function paintGlare(
  g: CanvasRenderingContext2D,
  state: CardState,
  layout: LayoutConfig,
  tilt: TiltState,
  fixedExtrude = false
) {
  if (state.glareStyle === 'none' || state.glare <= 0) return;
  const geo = cardGeom(
    state.layoutKey,
    state.theme,
    state.cardDepth,
    state.bgStyle,
    tilt,
    fixedExtrude
  );

  g.save();
  roundedRect(g, geo.x, geo.y, geo.w, geo.h, geo.r);
  g.clip();
  g.globalCompositeOperation = 'overlay';
  g.globalAlpha = state.glare / 100;

  if (state.glareStyle === 'spotlight' || state.glareStyle === 'follow') {
    const sp = GLARE.spot;
    const px = geo.x + geo.w * sp.x;
    const py = geo.y + geo.h * sp.y;
    const rx = geo.w * sp.r;
    const ry = geo.h * sp.r;
    g.translate(px, py);
    g.scale(rx, ry);
    const grad = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    for (const [p, color] of sp.stops) grad.addColorStop(p, color);
    g.fillStyle = grad;
    g.fillRect(
      (geo.x - px) / rx,
      (geo.y - py) / ry,
      geo.w / rx,
      geo.h / ry
    );
  } else {
    const L = (GLARE.lin as any)[state.glareStyle] || GLARE;
    const a = (L.angle * Math.PI) / 180;
    const dx = Math.sin(a);
    const dy = -Math.cos(a);
    const half =
      (Math.abs(geo.w * Math.sin(a)) + Math.abs(geo.h * Math.cos(a))) / 2;
    const cx = geo.x + geo.w / 2;
    const cy = geo.y + geo.h / 2;
    const grad = g.createLinearGradient(
      cx - dx * half,
      cy - dy * half,
      cx + dx * half,
      cy + dy * half
    );
    for (const [p, color] of L.stops) grad.addColorStop(p, color);
    g.fillStyle = grad;
    g.fillRect(geo.x, geo.y, geo.w, geo.h);
  }
  g.restore();
}

export function renderCard(
  g: CanvasRenderingContext2D,
  state: CardState,
  layout: LayoutConfig,
  coverImg: HTMLImageElement | null,
  tilt: TiltState,
  {
    fullBleed = false,
    flat = false,
    onCodeLoad = () => {},
  }: { fullBleed?: boolean; flat?: boolean; onCodeLoad?: () => void } = {}
): { size: number; overflow: boolean } {
  const theme = state.theme;
  const bg = state.color;
  const P = getPalette(theme, bg);
  const geo = cardGeom(
    state.layoutKey,
    theme,
    state.cardDepth,
    state.bgStyle,
    tilt,
    flat
  );
  const currentTransform = g.getTransform ? g.getTransform().a : 1;
  const unit = currentTransform * geo.s;

  g.clearRect(0, 0, layout.w, layout.h);
  paintBackdrop(
    g,
    layout,
    theme,
    bg,
    P,
    state.bgStyle,
    state.cardDepth,
    fullBleed,
    coverImg
  );

  g.save();
  g.translate(geo.x, geo.y);
  g.scale(geo.s, geo.s);
  paintCardBody(
    g,
    state,
    layout,
    P,
    tilt,
    fullBleed && state.bgStyle === 'none',
    unit,
    flat
  );
  themeFinish(g, theme, bg, P, layout);
  if (!state.hide.cover) {
    drawCover(g, state, layout, P, coverImg, tilt, unit, flat);
  }
  if (!(state.hide.title && state.hide.artist)) {
    drawHeader(g, state, layout, P, tilt, unit, flat);
  }
  const info = drawLyrics(g, state, layout, P, tilt, unit, flat);
  if (!state.hide.bar) {
    drawProgress(g, layout, P, unit);
  }
  if (!state.hide.logo) {
    drawFooter(g, state, layout, P, tilt, unit, flat);
  }
  if (!state.hide.code) {
    drawCode(g, state, layout, P, onCodeLoad);
  }
  g.restore();

  g.shadowColor = 'rgba(0,0,0,0)';
  g.shadowBlur = 0;

  return info;
}
