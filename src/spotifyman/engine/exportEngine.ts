import { CardState, ExportFormat, LayoutKey } from '../types';
import {
  CANON,
  FORMATS,
  LAYOUTS,
  presetById,
} from './constants';
import { paintGlare, renderCard } from './canvasRenderer';
import { buildHomography, warpCard } from './perspective3D';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function fileBaseName(
  title: string,
  artist: string,
  suffix: string,
  ext = 'png'
): string {
  const parts = [slugify(title), slugify(artist)].filter(Boolean);
  return (parts.length ? parts.join('_') : 'lyric-card') + suffix + '.' + ext;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob returned null'))),
      type,
      quality
    );
  });
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

let webpOk: boolean | null = null;
export function supportsWebp(): boolean {
  if (webpOk === null) {
    try {
      const c = document.createElement('canvas');
      c.width = c.height = 1;
      webpOk = c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch (e) {
      webpOk = false;
    }
  }
  return webpOk;
}

export async function encodeCanvas(
  canvas: HTMLCanvasElement,
  fmtKey: ExportFormat
): Promise<{ blob: Blob; fmt: ExportFormat; fellBack: boolean }> {
  const f = FORMATS[fmtKey] || FORMATS.png;
  const blob = await canvasToBlob(canvas, f.mime, f.q);
  if (f.mime !== 'image/png' && blob.type && blob.type !== f.mime) {
    if (f.mime === 'image/webp') webpOk = false;
    return { blob, fmt: 'png', fellBack: true };
  }
  return {
    blob,
    fmt: FORMATS[fmtKey] ? fmtKey : 'png',
    fellBack: false,
  };
}

export function dimsFor(
  key: LayoutKey,
  state: CardState,
  social = false
): { w: number; h: number } {
  const L = LAYOUTS[key];
  const p = social
    ? presetById(CANON[key])
    : presetById(state.preset) && presetById(state.preset)?.layout === key
    ? presetById(state.preset)
    : null;
  return p
    ? { w: p.w, h: p.h }
    : { w: Math.round(L.w * state.scale), h: Math.round(L.h * state.scale) };
}

export function renderFlatCanvas(
  key: LayoutKey,
  dims: { w: number; h: number },
  fmtKey: ExportFormat,
  state: CardState,
  coverImg: HTMLImageElement | null
): HTMLCanvasElement {
  const layout = LAYOUTS[key];
  const out = document.createElement('canvas');
  out.width = dims.w;
  out.height = dims.h;
  const g = out.getContext('2d');
  if (!g) throw new Error('Could not get 2d context for flat canvas export');

  g.scale(dims.w / layout.w, dims.h / layout.h);
  const solid =
    (FORMATS[fmtKey] || FORMATS.png).solid || !state.transparent;
  renderCard(
    g,
    { ...state, layoutKey: key },
    layout,
    coverImg,
    { rx: 0, ry: 0, rz: 0, perspective: 1200 },
    { fullBleed: solid, flat: true }
  );
  return out;
}

export function renderCard3D(
  state: CardState,
  coverImg: HTMLImageElement | null,
  displayedWidth = 560
): HTMLCanvasElement {
  const layout = LAYOUTS[state.layoutKey];
  const scale = state.scale;

  // 1. Flat card with glare baked in
  const flat = document.createElement('canvas');
  flat.width = layout.w * scale;
  flat.height = layout.h * scale;
  const fg = flat.getContext('2d');
  if (!fg) throw new Error('Could not create context for 3d bake');
  fg.scale(scale, scale);

  const tilt = {
    rx: 12,
    ry: -15,
    rz: 2,
    perspective: 1200,
  };

  renderCard(fg, state, layout, coverImg, tilt, {
    fullBleed: false,
    flat: false,
  });
  paintGlare(fg, state, layout, tilt, false);

  // 2. Perspective distance
  const d = tilt.perspective * (layout.w / (displayedWidth || 560));

  // 3. Warp through homography
  const H = buildHomography(d, tilt);
  const warped = warpCard(flat, H, scale, layout.w, layout.h);

  // 4. Compose on padded transparent canvas with dual drop shadow
  const pad = 150 * scale;
  const out = document.createElement('canvas');
  out.width = warped.width + pad * 2;
  out.height = warped.height + pad * 2;
  const og = out.getContext('2d');
  if (!og) throw new Error('Could not create output context for 3D card');

  og.save();
  og.shadowColor = 'rgba(0, 0, 0, 0.55)';
  og.shadowBlur = 60 * scale;
  og.shadowOffsetY = 60 * scale;
  og.drawImage(warped, pad, pad);
  og.restore();

  og.save();
  og.shadowColor = 'rgba(0, 0, 0, 0.35)';
  og.shadowBlur = 18 * scale;
  og.shadowOffsetY = 16 * scale;
  og.drawImage(warped, pad, pad);
  og.restore();

  return out;
}

// CRC32 table for zero-dependency zip archive
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(u8: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < u8.length; i++) {
    c = CRC_TABLE[(c ^ u8[i]) & 255] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

export function makeZip(files: { name: string; data: Uint8Array }[]): Blob {
  const te = new TextEncoder();
  const parts: (ArrayBuffer | Uint8Array)[] = [];
  const central: (ArrayBuffer | Uint8Array)[] = [];
  const d = new Date();
  const time =
    (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const date =
    ((Math.max(1980, d.getFullYear()) - 1980) << 9) |
    ((d.getMonth() + 1) << 5) |
    d.getDate();
  let offset = 0;

  for (const f of files) {
    const name = te.encode(f.name);
    const crc = crc32(f.data);
    const size = f.data.length;

    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true);
    lh.setUint16(4, 20, true);
    lh.setUint16(6, 0x0800, true);
    lh.setUint16(8, 0, true);
    lh.setUint16(10, time, true);
    lh.setUint16(12, date, true);
    lh.setUint32(14, crc, true);
    lh.setUint32(18, size, true);
    lh.setUint32(22, size, true);
    lh.setUint16(26, name.length, true);
    lh.setUint16(28, 0, true);

    parts.push(lh.buffer, name, f.data);

    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true);
    ch.setUint16(4, 20, true);
    ch.setUint16(6, 20, true);
    ch.setUint16(8, 0x0800, true);
    ch.setUint16(10, 0, true);
    ch.setUint16(12, time, true);
    ch.setUint16(14, date, true);
    ch.setUint32(16, crc, true);
    ch.setUint32(20, size, true);
    ch.setUint32(24, size, true);
    ch.setUint16(28, name.length, true);
    ch.setUint16(30, 0, true);
    ch.setUint16(32, 0, true);
    ch.setUint16(34, 0, true);
    ch.setUint16(36, 0, true);
    ch.setUint32(38, 0, true);
    ch.setUint32(42, offset, true);

    central.push(ch.buffer, name);
    offset += 30 + name.length + size;
  }

  const cdSize = central.reduce((n, p) => n + p.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, cdSize, true);
  end.setUint32(16, offset, true);

  return new Blob([...parts, ...central, end.buffer] as any[], {
    type: 'application/zip',
  });
}
