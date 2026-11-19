import type { CardState, LayoutConfig, ThemeKey } from '../types';
import { luma, mixHex, rgba } from '../utils/colorUtils';

export const SIGNATURE_THEMES = [
  'pixelart',
  'chalkboard',
  'glowsketch',
  'ps2',
  'comicart',
  'flatvector',
  'dankoe',
  'cgimotion',
  'lego',
  'zackd',
] as const satisfies readonly ThemeKey[];

const SIGNATURE = new Set<string>(SIGNATURE_THEMES);

export function isSignatureTheme(theme: ThemeKey): boolean {
  return SIGNATURE.has(theme);
}

type Pass = { dx: number; dy: number; color: string; main: boolean };

export type CardPalette = {
  text: string;
  surface: string;
  glow: string | null;
  wall: string;
  neon: string | null;
  shadowDark: string | null;
  passes: Pass[];
};

const pass = (color: string, dx = 0, dy = 0, main = true): Pass => ({
  dx,
  dy,
  color,
  main,
});

export function applySignaturePalette(
  theme: ThemeKey,
  P: CardPalette,
  bg: string
): boolean {
  if (!isSignatureTheme(theme)) return false;
  const ink = luma(bg) > 150 ? '#141414' : '#F7F4EC';

  switch (theme) {
    case 'pixelart': {
      P.surface = mixHex(bg, '#ffffff', 0.72);
      P.text = '#141414';
      P.wall = '#1a1a1a';
      P.passes = [pass('#141414')];
      break;
    }
    case 'chalkboard': {
      P.surface = mixHex('#143226', bg, 0.22);
      P.text = '#F4F0E4';
      P.wall = '#3d2914';
      P.passes = [pass('#F4F0E4')];
      break;
    }
    case 'glowsketch': {
      const neon = luma(bg) < 80 ? mixHex(bg, '#ffffff', 0.45) : bg;
      P.surface = '#07070c';
      P.text = mixHex(neon, '#ffffff', 0.35);
      P.glow = neon;
      P.neon = neon;
      P.wall = '#050508';
      P.passes = [pass(P.text)];
      break;
    }
    case 'ps2': {
      P.surface = '#140826';
      P.text = '#E7F6FF';
      P.glow = mixHex(bg, '#7ee0ff', 0.4);
      P.wall = '#070212';
      P.passes = [pass('#E7F6FF')];
      break;
    }
    case 'comicart': {
      P.surface = '#FFF6D2';
      P.text = '#161616';
      P.wall = '#111111';
      P.passes = [pass('#161616', 4, 4, false), pass('#161616')];
      break;
    }
    case 'flatvector': {
      P.surface = bg;
      P.text = ink;
      P.wall = mixHex(bg, '#000000', 0.35);
      P.passes = [pass(ink)];
      break;
    }
    case 'dankoe': {
      P.surface = '#0C0C0C';
      P.text = '#F3F0E8';
      P.neon = bg;
      P.wall = '#000000';
      P.passes = [pass('#F3F0E8')];
      break;
    }
    case 'cgimotion': {
      P.surface = '#07080d';
      P.text = '#F4F7FF';
      P.glow = mixHex(bg, '#ffffff', 0.15);
      P.wall = '#05060a';
      P.passes = [pass('#F4F7FF')];
      break;
    }
    case 'lego': {
      const plastic = mixHex(bg, '#ffffff', 0.12);
      P.surface = plastic;
      P.text = luma(plastic) > 150 ? '#1a1a1a' : '#FFF8EE';
      P.wall = mixHex(plastic, '#000000', 0.28);
      P.passes = [pass(P.text)];
      break;
    }
    case 'zackd': {
      P.surface = '#0A0A0A';
      P.text = '#FFFFFF';
      P.neon = '#FFE14A';
      P.wall = '#000000';
      P.passes = [pass('#FFFFFF')];
      break;
    }
    default:
      return false;
  }
  return true;
}

function rr(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.max(0, Math.min(r, w / 2, h / 2));
  g.beginPath();
  g.moveTo(x + rad, y);
  g.arcTo(x + w, y, x + w, y + h, rad);
  g.arcTo(x + w, y + h, x, y + h, rad);
  g.arcTo(x, y + h, x, y, rad);
  g.arcTo(x, y, x + w, y, rad);
  g.closePath();
}

export function paintSignatureBody(
  g: CanvasRenderingContext2D,
  state: CardState,
  layout: LayoutConfig,
  P: CardPalette
): boolean {
  if (!isSignatureTheme(state.theme)) return false;
  const { w: W, h: H } = layout;
  const bg = state.color;
  const theme = state.theme;

  if (theme === 'pixelart') {
    g.fillStyle = '#101010';
    g.fillRect(0, 0, W, H);
    const cell = Math.max(18, Math.round(Math.min(W, H) / 28));
    const cols = [
      mixHex(bg, '#000000', 0.35),
      mixHex(bg, '#ffffff', 0.35),
      mixHex(bg, '#000000', 0.05),
      mixHex(bg, '#ffffff', 0.62),
    ];
    const inset = cell * 2;
    for (let y = inset; y < H - inset; y += cell) {
      for (let x = inset; x < W - inset; x += cell) {
        const ix = Math.floor(x / cell);
        const iy = Math.floor(y / cell);
        g.fillStyle = cols[(ix + iy * 2) % cols.length];
        g.fillRect(x, y, cell - 2, cell - 2);
      }
    }
    g.strokeStyle = '#000000';
    g.lineWidth = Math.max(10, cell * 0.7);
    g.strokeRect(inset / 2, inset / 2, W - inset, H - inset);
    g.fillStyle = '#000000';
    g.fillRect(0, 0, W, cell);
    g.fillStyle = mixHex(bg, '#ffffff', 0.7);
    g.fillRect(cell * 0.4, cell * 0.28, cell * 0.45, cell * 0.45);
    return true;
  }

  if (theme === 'chalkboard') {
    g.fillStyle = mixHex('#5a3a22', '#2a170c', 0.35);
    g.fillRect(0, 0, W, H);
    const m = Math.round(Math.min(W, H) * 0.035);
    g.fillStyle = P.surface;
    rr(g, m, m, W - m * 2, H - m * 2, 12);
    g.fill();
    g.save();
    rr(g, m, m, W - m * 2, H - m * 2, 12);
    g.clip();
    g.globalAlpha = 0.18;
    g.strokeStyle = 'rgba(255,255,255,0.35)';
    g.lineWidth = 2;
    for (let y = m + 36; y < H - m; y += 34) {
      g.beginPath();
      g.moveTo(m + 18, y);
      g.lineTo(W - m - 12, y + ((y / 34) % 2 ? 1.5 : -1));
      g.stroke();
    }
    g.globalAlpha = 0.09;
    g.fillStyle = '#F4F0E4';
    for (let i = 0; i < 80; i++) {
      const x = m + ((i * 97) % (W - m * 2));
      const y = m + ((i * 53) % (H - m * 2));
      g.fillRect(x, y, 2, 1);
    }
    g.restore();
    g.strokeStyle = 'rgba(90,42,20,0.9)';
    g.lineWidth = 8;
    rr(g, m + 4, m + 4, W - m * 2 - 8, H - m * 2 - 8, 8);
    g.stroke();
    return true;
  }

  if (theme === 'glowsketch') {
    g.fillStyle = '#07070c';
    g.fillRect(0, 0, W, H);
    const neon = P.neon || bg;
    g.save();
    g.globalAlpha = 0.55;
    g.strokeStyle = neon;
    g.lineWidth = 3;
    g.lineJoin = 'round';
    for (let i = 0; i < 4; i++) {
      g.globalAlpha = 0.18 + i * 0.08;
      rr(g, 28 + i * 3, 26 + i * 2, W - 60 - i * 4, H - 58 - i * 3, 26);
      g.stroke();
    }
    g.strokeStyle = rgba(neon, 0.35);
    g.lineWidth = 1.5;
    g.beginPath();
    for (let x = 40; x < W - 40; x += 46) {
      g.moveTo(x, 70);
      g.lineTo(x + 18, 96);
      g.lineTo(x + 8, 130);
    }
    g.stroke();
    const glow = g.createRadialGradient(W * 0.5, H * 0.45, 20, W * 0.5, H * 0.45, Math.max(W, H) * 0.55);
    glow.addColorStop(0, rgba(neon, 0.28));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    g.globalAlpha = 1;
    g.fillStyle = glow;
    g.fillRect(0, 0, W, H);
    g.restore();
    return true;
  }

  if (theme === 'ps2') {
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, mixHex(bg, '#87d7ff', 0.55));
    sky.addColorStop(0.42, '#2a1460');
    sky.addColorStop(1, '#070212');
    g.fillStyle = sky;
    g.fillRect(0, 0, W, H);
    g.save();
    g.globalAlpha = 0.55;
    g.fillStyle = mixHex(bg, '#1a0830', 0.4);
    const tris = 7;
    for (let i = 0; i < tris; i++) {
      const x = (W / tris) * i;
      g.beginPath();
      g.moveTo(x, H * 0.62);
      g.lineTo(x + W / tris, H * 0.62);
      g.lineTo(x + W / tris / 2, H * (0.28 + (i % 2) * 0.08));
      g.closePath();
      g.fill();
    }
    g.restore();
    g.fillStyle = 'rgba(8,0,20,0.45)';
    g.fillRect(0, H * 0.58, W, H * 0.42);
    g.strokeStyle = 'rgba(180,230,255,0.7)';
    g.lineWidth = 3;
    const c = 28;
    g.strokeRect(c, c, W - c * 2, H - c * 2);
    g.lineWidth = 6;
    const L = 42;
    for (const [x, y, sx, sy] of [
      [c, c, 1, 1],
      [W - c, c, -1, 1],
      [c, H - c, 1, -1],
      [W - c, H - c, -1, -1],
    ] as const) {
      g.beginPath();
      g.moveTo(x, y + sy * L);
      g.lineTo(x, y);
      g.lineTo(x + sx * L, y);
      g.stroke();
    }
    return true;
  }

  if (theme === 'comicart') {
    g.fillStyle = '#111';
    g.fillRect(10, 12, W, H);
    g.fillStyle = '#FFF6D2';
    g.fillRect(0, 0, W, H);
    g.save();
    g.beginPath();
    g.rect(0, 0, W, H);
    g.clip();
    g.fillStyle = mixHex(bg, '#ff2d55', 0.35);
    const step = 22;
    for (let y = 0; y < H; y += step) {
      for (let x = (y / step) % 2 ? step / 2 : 0; x < W; x += step) {
        g.beginPath();
        g.arc(x, y, 3.2, 0, Math.PI * 2);
        g.fill();
      }
    }
    g.strokeStyle = 'rgba(0,0,0,0.18)';
    g.lineWidth = 2;
    for (let i = 0; i < 14; i++) {
      g.beginPath();
      g.moveTo(-20, H * 0.15 + i * 18);
      g.lineTo(W * 0.45, H * 0.02 + i * 10);
      g.stroke();
    }
    g.fillStyle = '#FFE14A';
    g.strokeStyle = '#111';
    g.lineWidth = 6;
    g.lineJoin = 'miter';
    g.beginPath();
    const cx = W - Math.min(W, H) * 0.16;
    const cy = Math.min(W, H) * 0.16;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const rad = i % 2 ? 18 : 40;
      g[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    }
    g.closePath();
    g.fill();
    g.stroke();
    g.restore();
    g.strokeStyle = '#111';
    g.lineWidth = 12;
    g.strokeRect(8, 8, W - 16, H - 16);
    return true;
  }

  if (theme === 'flatvector') {
    const a = mixHex(bg, '#000000', 0.18);
    const b = mixHex(bg, '#ffffff', 0.28);
    const c = mixHex(bg, '#000000', 0.45);
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    g.fillStyle = b;
    g.beginPath();
    g.arc(0, 0, Math.min(W, H) * 0.42, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = a;
    g.beginPath();
    g.arc(W, H, Math.min(W, H) * 0.55, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = c;
    g.fillRect(0, H * 0.72, W * 0.28, H * 0.08);
    g.fillStyle = luma(bg) > 160 ? '#111' : '#fff';
    g.fillRect(W * 0.08, H * 0.08, Math.min(W, H) * 0.06, Math.min(W, H) * 0.06);
    return true;
  }

  if (theme === 'dankoe') {
    g.fillStyle = '#0C0C0C';
    g.fillRect(0, 0, W, H);
    g.fillStyle = bg;
    g.fillRect(0, 0, Math.max(8, Math.round(Math.min(W, H) * 0.012)), H);
    g.fillStyle = 'rgba(243,240,232,0.85)';
    const y = Math.round(H * 0.2);
    g.fillRect(layout.pad, y, Math.min(120, W * 0.18), 2);
    return true;
  }

  if (theme === 'cgimotion') {
    g.fillStyle = '#05060a';
    g.fillRect(0, 0, W, H);
    g.save();
    const streaks = 9;
    for (let i = 0; i < streaks; i++) {
      const grd = g.createLinearGradient(0, 0, W, H * 0.2);
      grd.addColorStop(0, 'rgba(0,0,0,0)');
      grd.addColorStop(0.45, rgba(mixHex(bg, i % 2 ? '#00e5ff' : '#ff4fd8', 0.45), 0.55));
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = grd;
      g.save();
      g.translate(W * 0.5, H * (0.15 + i * 0.09));
      g.rotate(-0.45);
      g.fillRect(-W, -10, W * 2, 8 + (i % 3) * 6);
      g.restore();
    }
    const spec = g.createRadialGradient(W * 0.28, H * 0.22, 10, W * 0.28, H * 0.22, W * 0.45);
    spec.addColorStop(0, 'rgba(255,255,255,0.28)');
    spec.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = spec;
    g.fillRect(0, 0, W, H);
    g.restore();
    g.strokeStyle = rgba(mixHex(bg, '#ffffff', 0.4), 0.8);
    g.lineWidth = 2;
    rr(g, 18, 18, W - 36, H - 36, 20);
    g.stroke();
    return true;
  }

  if (theme === 'lego') {
    const plastic = P.surface;
    const lip = mixHex(plastic, '#000000', 0.22);
    const hi = mixHex(plastic, '#ffffff', 0.45);
    g.fillStyle = lip;
    g.fillRect(0, 0, W, H);
    const m = Math.round(Math.min(W, H) * 0.03);
    g.fillStyle = plastic;
    rr(g, m, m + 8, W - m * 2, H - m * 2 - 8, 14);
    g.fill();
    const studs = Math.max(6, Math.round(W / 90));
    const sr = Math.min(26, (W - m * 4) / studs / 2.4);
    const y = m + sr + 10;
    g.fillStyle = hi;
    for (let i = 0; i < studs; i++) {
      const x = m + 24 + ((W - m * 2 - 48) * (i + 0.5)) / studs;
      g.beginPath();
      g.arc(x, y, sr, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = plastic;
      g.beginPath();
      g.arc(x - sr * 0.15, y - sr * 0.18, sr * 0.72, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = 'rgba(255,255,255,0.55)';
      g.beginPath();
      g.arc(x - sr * 0.28, y - sr * 0.32, sr * 0.22, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = hi;
    }
    return true;
  }

  if (theme === 'zackd') {
    g.fillStyle = '#070707';
    g.fillRect(0, 0, W, H);
    const bar = Math.round(Math.min(W, H) * 0.055);
    g.fillStyle = '#000';
    g.fillRect(0, 0, W, bar);
    g.fillRect(0, H - bar, W, bar);
    g.fillStyle = '#FFE14A';
    g.fillRect(layout.pad, H - bar - Math.round(H * 0.08), Math.min(W * 0.42, 280), Math.max(8, bar * 0.45));
    g.fillStyle = '#ff2a2a';
    g.beginPath();
    g.arc(layout.pad + 8, bar + 22, 7, 0, Math.PI * 2);
    g.fill();
    return true;
  }

  return false;
}

export function overlaySignature(
  g: CanvasRenderingContext2D,
  theme: ThemeKey,
  layout: LayoutConfig
) {
  if (theme !== 'ps2' && theme !== 'zackd' && theme !== 'chalkboard') return;
  const { w: W, h: H } = layout;
  g.save();
  if (theme === 'ps2') {
    g.fillStyle = 'rgba(0,0,0,0.18)';
    for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 1);
  } else if (theme === 'zackd') {
    g.globalAlpha = 0.22;
    for (let i = 0; i < 26; i++) {
      const x = (i * 137) % W;
      g.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.45)';
      g.fillRect(x, 0, 1, H);
    }
  } else {
    g.globalAlpha = 0.08;
    g.fillStyle = '#000';
    g.fillRect(0, 0, W, H);
  }
  g.restore();
}
