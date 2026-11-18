import { i as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { C as Box, D as AlignRight, E as AlignLeft, O as AlignCenter, S as Check, T as Archive, _ as Link2, b as CircleHelp, c as SlidersVertical, d as RotateCcw, f as Redo2, g as LoaderCircle, h as Minus, i as Type, l as Share2, m as Palette, n as WandSparkles, o as Trash2, p as Plus, r as Undo2, s as Sparkles, t as X, u as Search, v as Download, w as Bookmark, x as ChevronDown, y as Copy } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CfjlphHC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function hexToRgb(hex) {
	let h = String(hex || "").trim().replace("#", "");
	if (h.length === 3) h = h.split("").map((c) => c + c).join("");
	return {
		r: parseInt(h.slice(0, 2), 16) || 0,
		g: parseInt(h.slice(2, 4), 16) || 0,
		b: parseInt(h.slice(4, 6), 16) || 0
	};
}
function rgba(hex, alpha) {
	const { r, g, b } = hexToRgb(hex);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
/** Perceived luminance 0-255 */
function luma(hex) {
	const { r, g, b } = hexToRgb(hex);
	return (r * 299 + g * 587 + b * 114) / 1e3;
}
/** Contrast text color (#000000 or #FFFFFF) */
function contrastColor(hex) {
	return luma(hex) > 150 ? "#000000" : "#FFFFFF";
}
/** Blend two #RRGGBB colors (t = 0 -> a, t = 1 -> b) */
function mixHex(a, b, t) {
	const A = hexToRgb(a);
	const B = hexToRgb(b);
	const f = (x, y) => Math.min(255, Math.max(0, Math.round(x + (y - x) * t)));
	return "#" + [
		f(A.r, B.r),
		f(A.g, B.g),
		f(A.b, B.b)
	].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function rgb2hsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;
	const mx = Math.max(r, g, b);
	const mn = Math.min(r, g, b);
	const l = (mx + mn) / 2;
	let h = 0;
	let sat = 0;
	if (mx !== mn) {
		const d = mx - mn;
		sat = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
		h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
		h /= 6;
	}
	return [
		h,
		sat,
		l
	];
}
function hsl2hex(h, sat, l) {
	const f = (p, q, t) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	const q = l < .5 ? l * (1 + sat) : l + sat - l * sat;
	const p = 2 * l - q;
	return "#" + [
		f(p, q, h + 1 / 3),
		f(p, q, h),
		f(p, q, h - 1 / 3)
	].map((v) => Math.min(255, Math.max(0, Math.round(v * 255))).toString(16).padStart(2, "0")).join("").toUpperCase();
}
/** Extract up to `max` vivid, distinct colors from a 32 x 32 sample */
function extractCoverColors(img, max = 5) {
	const S = 32;
	const c = document.createElement("canvas");
	c.width = c.height = S;
	const x = c.getContext("2d", { willReadFrequently: true });
	if (!x) return [];
	x.drawImage(img, 0, 0, S, S);
	const d = x.getImageData(0, 0, S, S).data;
	const buckets = /* @__PURE__ */ new Map();
	for (let i = 0; i < d.length; i += 4) {
		if (d[i + 3] < 200) continue;
		const r = d[i];
		const g = d[i + 1];
		const b = d[i + 2];
		const [, sat, l] = rgb2hsl(r, g, b);
		if (l < .12 || l > .9 || sat < .18) continue;
		const key = r >> 5 << 6 | g >> 5 << 3 | b >> 5;
		const e = buckets.get(key) || {
			n: 0,
			r: 0,
			g: 0,
			b: 0
		};
		e.n++;
		e.r += r;
		e.g += g;
		e.b += b;
		buckets.set(key, e);
	}
	const ranked = [...buckets.values()].map((e) => {
		const r = e.r / e.n;
		const g = e.g / e.n;
		const b = e.b / e.n;
		const [h, sat, l] = rgb2hsl(r, g, b);
		return {
			r,
			g,
			b,
			h,
			sat,
			l,
			score: e.n * (.35 + sat) * (1 - Math.abs(l - .5))
		};
	}).sort((a, b) => b.score - a.score);
	const picked = [];
	for (const c2 of ranked) {
		if (picked.every((o) => Math.hypot(o.r - c2.r, o.g - c2.g, o.b - c2.b) > 60)) picked.push(c2);
		if (picked.length >= max) break;
	}
	const hexes = picked.map((c2) => hsl2hex(c2.h, Math.min(.95, Math.max(.5, c2.sat)), Math.min(.55, Math.max(.32, c2.l))));
	return [...new Set(hexes)];
}
var SIGNATURE = /* @__PURE__ */ new Set([
	"pixelart",
	"chalkboard",
	"glowsketch",
	"ps2",
	"comicart",
	"flatvector",
	"dankoe",
	"cgimotion",
	"lego",
	"zackd"
]);
function isSignatureTheme(theme) {
	return SIGNATURE.has(theme);
}
var pass = (color, dx = 0, dy = 0, main = true) => ({
	dx,
	dy,
	color,
	main
});
function applySignaturePalette(theme, P, bg) {
	if (!isSignatureTheme(theme)) return false;
	const ink = luma(bg) > 150 ? "#141414" : "#F7F4EC";
	switch (theme) {
		case "pixelart":
			P.surface = mixHex(bg, "#ffffff", .72);
			P.text = "#141414";
			P.wall = "#1a1a1a";
			P.passes = [pass("#141414")];
			break;
		case "chalkboard":
			P.surface = mixHex("#143226", bg, .22);
			P.text = "#F4F0E4";
			P.wall = "#3d2914";
			P.passes = [pass("#F4F0E4")];
			break;
		case "glowsketch": {
			const neon = luma(bg) < 80 ? mixHex(bg, "#ffffff", .45) : bg;
			P.surface = "#07070c";
			P.text = mixHex(neon, "#ffffff", .35);
			P.glow = neon;
			P.neon = neon;
			P.wall = "#050508";
			P.passes = [pass(P.text)];
			break;
		}
		case "ps2":
			P.surface = "#140826";
			P.text = "#E7F6FF";
			P.glow = mixHex(bg, "#7ee0ff", .4);
			P.wall = "#070212";
			P.passes = [pass("#E7F6FF")];
			break;
		case "comicart":
			P.surface = "#FFF6D2";
			P.text = "#161616";
			P.wall = "#111111";
			P.passes = [pass("#161616", 4, 4, false), pass("#161616")];
			break;
		case "flatvector":
			P.surface = bg;
			P.text = ink;
			P.wall = mixHex(bg, "#000000", .35);
			P.passes = [pass(ink)];
			break;
		case "dankoe":
			P.surface = "#0C0C0C";
			P.text = "#F3F0E8";
			P.neon = bg;
			P.wall = "#000000";
			P.passes = [pass("#F3F0E8")];
			break;
		case "cgimotion":
			P.surface = "#07080d";
			P.text = "#F4F7FF";
			P.glow = mixHex(bg, "#ffffff", .15);
			P.wall = "#05060a";
			P.passes = [pass("#F4F7FF")];
			break;
		case "lego": {
			const plastic = mixHex(bg, "#ffffff", .12);
			P.surface = plastic;
			P.text = luma(plastic) > 150 ? "#1a1a1a" : "#FFF8EE";
			P.wall = mixHex(plastic, "#000000", .28);
			P.passes = [pass(P.text)];
			break;
		}
		case "zackd":
			P.surface = "#0A0A0A";
			P.text = "#FFFFFF";
			P.neon = "#FFE14A";
			P.wall = "#000000";
			P.passes = [pass("#FFFFFF")];
			break;
		default: return false;
	}
	return true;
}
function rr(g, x, y, w, h, r) {
	const rad = Math.max(0, Math.min(r, w / 2, h / 2));
	g.beginPath();
	g.moveTo(x + rad, y);
	g.arcTo(x + w, y, x + w, y + h, rad);
	g.arcTo(x + w, y + h, x, y + h, rad);
	g.arcTo(x, y + h, x, y, rad);
	g.arcTo(x, y, x + w, y, rad);
	g.closePath();
}
function paintSignatureBody(g, state, layout, P) {
	if (!isSignatureTheme(state.theme)) return false;
	const { w: W, h: H } = layout;
	const bg = state.color;
	const theme = state.theme;
	if (theme === "pixelart") {
		g.fillStyle = "#101010";
		g.fillRect(0, 0, W, H);
		const cell = Math.max(18, Math.round(Math.min(W, H) / 28));
		const cols = [
			mixHex(bg, "#000000", .35),
			mixHex(bg, "#ffffff", .35),
			mixHex(bg, "#000000", .05),
			mixHex(bg, "#ffffff", .62)
		];
		const inset = cell * 2;
		for (let y = inset; y < H - inset; y += cell) for (let x = inset; x < W - inset; x += cell) {
			g.fillStyle = cols[(Math.floor(x / cell) + Math.floor(y / cell) * 2) % cols.length];
			g.fillRect(x, y, cell - 2, cell - 2);
		}
		g.strokeStyle = "#000000";
		g.lineWidth = Math.max(10, cell * .7);
		g.strokeRect(inset / 2, inset / 2, W - inset, H - inset);
		g.fillStyle = "#000000";
		g.fillRect(0, 0, W, cell);
		g.fillStyle = mixHex(bg, "#ffffff", .7);
		g.fillRect(cell * .4, cell * .28, cell * .45, cell * .45);
		return true;
	}
	if (theme === "chalkboard") {
		g.fillStyle = mixHex("#5a3a22", "#2a170c", .35);
		g.fillRect(0, 0, W, H);
		const m = Math.round(Math.min(W, H) * .035);
		g.fillStyle = P.surface;
		rr(g, m, m, W - m * 2, H - m * 2, 12);
		g.fill();
		g.save();
		rr(g, m, m, W - m * 2, H - m * 2, 12);
		g.clip();
		g.globalAlpha = .18;
		g.strokeStyle = "rgba(255,255,255,0.35)";
		g.lineWidth = 2;
		for (let y = m + 36; y < H - m; y += 34) {
			g.beginPath();
			g.moveTo(m + 18, y);
			g.lineTo(W - m - 12, y + (y / 34 % 2 ? 1.5 : -1));
			g.stroke();
		}
		g.globalAlpha = .09;
		g.fillStyle = "#F4F0E4";
		for (let i = 0; i < 80; i++) {
			const x = m + i * 97 % (W - m * 2);
			const y = m + i * 53 % (H - m * 2);
			g.fillRect(x, y, 2, 1);
		}
		g.restore();
		g.strokeStyle = "rgba(90,42,20,0.9)";
		g.lineWidth = 8;
		rr(g, m + 4, m + 4, W - m * 2 - 8, H - m * 2 - 8, 8);
		g.stroke();
		return true;
	}
	if (theme === "glowsketch") {
		g.fillStyle = "#07070c";
		g.fillRect(0, 0, W, H);
		const neon = P.neon || bg;
		g.save();
		g.globalAlpha = .55;
		g.strokeStyle = neon;
		g.lineWidth = 3;
		g.lineJoin = "round";
		for (let i = 0; i < 4; i++) {
			g.globalAlpha = .18 + i * .08;
			rr(g, 28 + i * 3, 26 + i * 2, W - 60 - i * 4, H - 58 - i * 3, 26);
			g.stroke();
		}
		g.strokeStyle = rgba(neon, .35);
		g.lineWidth = 1.5;
		g.beginPath();
		for (let x = 40; x < W - 40; x += 46) {
			g.moveTo(x, 70);
			g.lineTo(x + 18, 96);
			g.lineTo(x + 8, 130);
		}
		g.stroke();
		const glow = g.createRadialGradient(W * .5, H * .45, 20, W * .5, H * .45, Math.max(W, H) * .55);
		glow.addColorStop(0, rgba(neon, .28));
		glow.addColorStop(1, "rgba(0,0,0,0)");
		g.globalAlpha = 1;
		g.fillStyle = glow;
		g.fillRect(0, 0, W, H);
		g.restore();
		return true;
	}
	if (theme === "ps2") {
		const sky = g.createLinearGradient(0, 0, 0, H);
		sky.addColorStop(0, mixHex(bg, "#87d7ff", .55));
		sky.addColorStop(.42, "#2a1460");
		sky.addColorStop(1, "#070212");
		g.fillStyle = sky;
		g.fillRect(0, 0, W, H);
		g.save();
		g.globalAlpha = .55;
		g.fillStyle = mixHex(bg, "#1a0830", .4);
		const tris = 7;
		for (let i = 0; i < tris; i++) {
			const x = W / tris * i;
			g.beginPath();
			g.moveTo(x, H * .62);
			g.lineTo(x + W / tris, H * .62);
			g.lineTo(x + W / tris / 2, H * (.28 + i % 2 * .08));
			g.closePath();
			g.fill();
		}
		g.restore();
		g.fillStyle = "rgba(8,0,20,0.45)";
		g.fillRect(0, H * .58, W, H * .42);
		g.strokeStyle = "rgba(180,230,255,0.7)";
		g.lineWidth = 3;
		const c = 28;
		g.strokeRect(c, c, W - 56, H - 56);
		g.lineWidth = 6;
		const L = 42;
		for (const [x, y, sx, sy] of [
			[
				c,
				c,
				1,
				1
			],
			[
				W - c,
				c,
				-1,
				1
			],
			[
				c,
				H - c,
				1,
				-1
			],
			[
				W - c,
				H - c,
				-1,
				-1
			]
		]) {
			g.beginPath();
			g.moveTo(x, y + sy * L);
			g.lineTo(x, y);
			g.lineTo(x + sx * L, y);
			g.stroke();
		}
		return true;
	}
	if (theme === "comicart") {
		g.fillStyle = "#111";
		g.fillRect(10, 12, W, H);
		g.fillStyle = "#FFF6D2";
		g.fillRect(0, 0, W, H);
		g.save();
		g.beginPath();
		g.rect(0, 0, W, H);
		g.clip();
		g.fillStyle = mixHex(bg, "#ff2d55", .35);
		const step = 22;
		for (let y = 0; y < H; y += step) for (let x = y / step % 2 ? step / 2 : 0; x < W; x += step) {
			g.beginPath();
			g.arc(x, y, 3.2, 0, Math.PI * 2);
			g.fill();
		}
		g.strokeStyle = "rgba(0,0,0,0.18)";
		g.lineWidth = 2;
		for (let i = 0; i < 14; i++) {
			g.beginPath();
			g.moveTo(-20, H * .15 + i * 18);
			g.lineTo(W * .45, H * .02 + i * 10);
			g.stroke();
		}
		g.fillStyle = "#FFE14A";
		g.strokeStyle = "#111";
		g.lineWidth = 6;
		g.lineJoin = "miter";
		g.beginPath();
		const cx = W - Math.min(W, H) * .16;
		const cy = Math.min(W, H) * .16;
		for (let i = 0; i < 16; i++) {
			const a = i / 16 * Math.PI * 2;
			const rad = i % 2 ? 18 : 40;
			g[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
		}
		g.closePath();
		g.fill();
		g.stroke();
		g.restore();
		g.strokeStyle = "#111";
		g.lineWidth = 12;
		g.strokeRect(8, 8, W - 16, H - 16);
		return true;
	}
	if (theme === "flatvector") {
		const a = mixHex(bg, "#000000", .18);
		const b = mixHex(bg, "#ffffff", .28);
		const c = mixHex(bg, "#000000", .45);
		g.fillStyle = bg;
		g.fillRect(0, 0, W, H);
		g.fillStyle = b;
		g.beginPath();
		g.arc(0, 0, Math.min(W, H) * .42, 0, Math.PI * 2);
		g.fill();
		g.fillStyle = a;
		g.beginPath();
		g.arc(W, H, Math.min(W, H) * .55, 0, Math.PI * 2);
		g.fill();
		g.fillStyle = c;
		g.fillRect(0, H * .72, W * .28, H * .08);
		g.fillStyle = luma(bg) > 160 ? "#111" : "#fff";
		g.fillRect(W * .08, H * .08, Math.min(W, H) * .06, Math.min(W, H) * .06);
		return true;
	}
	if (theme === "dankoe") {
		g.fillStyle = "#0C0C0C";
		g.fillRect(0, 0, W, H);
		g.fillStyle = bg;
		g.fillRect(0, 0, Math.max(8, Math.round(Math.min(W, H) * .012)), H);
		g.fillStyle = "rgba(243,240,232,0.85)";
		const y = Math.round(H * .2);
		g.fillRect(layout.pad, y, Math.min(120, W * .18), 2);
		return true;
	}
	if (theme === "cgimotion") {
		g.fillStyle = "#05060a";
		g.fillRect(0, 0, W, H);
		g.save();
		const streaks = 9;
		for (let i = 0; i < streaks; i++) {
			const grd = g.createLinearGradient(0, 0, W, H * .2);
			grd.addColorStop(0, "rgba(0,0,0,0)");
			grd.addColorStop(.45, rgba(mixHex(bg, i % 2 ? "#00e5ff" : "#ff4fd8", .45), .55));
			grd.addColorStop(1, "rgba(0,0,0,0)");
			g.fillStyle = grd;
			g.save();
			g.translate(W * .5, H * (.15 + i * .09));
			g.rotate(-.45);
			g.fillRect(-W, -10, W * 2, 8 + i % 3 * 6);
			g.restore();
		}
		const spec = g.createRadialGradient(W * .28, H * .22, 10, W * .28, H * .22, W * .45);
		spec.addColorStop(0, "rgba(255,255,255,0.28)");
		spec.addColorStop(1, "rgba(255,255,255,0)");
		g.fillStyle = spec;
		g.fillRect(0, 0, W, H);
		g.restore();
		g.strokeStyle = rgba(mixHex(bg, "#ffffff", .4), .8);
		g.lineWidth = 2;
		rr(g, 18, 18, W - 36, H - 36, 20);
		g.stroke();
		return true;
	}
	if (theme === "lego") {
		const plastic = P.surface;
		const lip = mixHex(plastic, "#000000", .22);
		const hi = mixHex(plastic, "#ffffff", .45);
		g.fillStyle = lip;
		g.fillRect(0, 0, W, H);
		const m = Math.round(Math.min(W, H) * .03);
		g.fillStyle = plastic;
		rr(g, m, m + 8, W - m * 2, H - m * 2 - 8, 14);
		g.fill();
		const studs = Math.max(6, Math.round(W / 90));
		const sr = Math.min(26, (W - m * 4) / studs / 2.4);
		const y = m + sr + 10;
		g.fillStyle = hi;
		for (let i = 0; i < studs; i++) {
			const x = m + 24 + (W - m * 2 - 48) * (i + .5) / studs;
			g.beginPath();
			g.arc(x, y, sr, 0, Math.PI * 2);
			g.fill();
			g.fillStyle = plastic;
			g.beginPath();
			g.arc(x - sr * .15, y - sr * .18, sr * .72, 0, Math.PI * 2);
			g.fill();
			g.fillStyle = "rgba(255,255,255,0.55)";
			g.beginPath();
			g.arc(x - sr * .28, y - sr * .32, sr * .22, 0, Math.PI * 2);
			g.fill();
			g.fillStyle = hi;
		}
		return true;
	}
	if (theme === "zackd") {
		g.fillStyle = "#070707";
		g.fillRect(0, 0, W, H);
		const bar = Math.round(Math.min(W, H) * .055);
		g.fillStyle = "#000";
		g.fillRect(0, 0, W, bar);
		g.fillRect(0, H - bar, W, bar);
		g.fillStyle = "#FFE14A";
		g.fillRect(layout.pad, H - bar - Math.round(H * .08), Math.min(W * .42, 280), Math.max(8, bar * .45));
		g.fillStyle = "#ff2a2a";
		g.beginPath();
		g.arc(layout.pad + 8, bar + 22, 7, 0, Math.PI * 2);
		g.fill();
		return true;
	}
	return false;
}
function overlaySignature(g, theme, layout) {
	if (theme !== "ps2" && theme !== "zackd" && theme !== "chalkboard") return;
	const { w: W, h: H } = layout;
	g.save();
	if (theme === "ps2") {
		g.fillStyle = "rgba(0,0,0,0.18)";
		for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 1);
	} else if (theme === "zackd") {
		g.globalAlpha = .22;
		for (let i = 0; i < 26; i++) {
			const x = i * 137 % W;
			g.fillStyle = i % 4 === 0 ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)";
			g.fillRect(x, 0, 1, H);
		}
	} else {
		g.globalAlpha = .08;
		g.fillStyle = "#000";
		g.fillRect(0, 0, W, H);
	}
	g.restore();
}
var LAYOUTS = {
	square: {
		label: "Classic Square · 1:1",
		w: 1024,
		h: 1024,
		radius: 48,
		pad: 80,
		cover: 120,
		coverR: 12,
		headGap: 36,
		logo: 72,
		wordmark: 52,
		logoGap: 36,
		lyricGap: 64,
		lyricMin: 24,
		lyricMax: 120,
		lyricMiddle: false,
		titleSize: 38,
		titleLine: 46,
		artistSize: 30,
		artistLine: 40,
		preview: [
			560,
			480,
			420
		]
	},
	wide: {
		label: "Cinematic Wide · 16:9",
		w: 1280,
		h: 720,
		radius: 40,
		pad: 64,
		cover: 160,
		coverR: 12,
		headGap: 32,
		logo: 52,
		wordmark: 38,
		logoGap: 24,
		lyricGap: 36,
		lyricMin: 20,
		lyricMax: 120,
		lyricMiddle: true,
		titleSize: 44,
		titleLine: 52,
		artistSize: 30,
		artistLine: 40,
		preview: [
			880,
			720,
			560
		]
	},
	story: {
		label: "Story · 9:16",
		w: 720,
		h: 1280,
		radius: 44,
		pad: 64,
		cover: 128,
		coverR: 12,
		headGap: 28,
		logo: 60,
		wordmark: 42,
		logoGap: 28,
		lyricGap: 48,
		lyricMin: 22,
		lyricMax: 120,
		lyricMiddle: true,
		titleSize: 36,
		titleLine: 44,
		artistSize: 28,
		artistLine: 36,
		preview: [
			400,
			360,
			300
		]
	},
	portrait: {
		label: "Portrait · 4:5",
		w: 1024,
		h: 1280,
		radius: 48,
		pad: 80,
		cover: 120,
		coverR: 12,
		headGap: 36,
		logo: 72,
		wordmark: 52,
		logoGap: 36,
		lyricGap: 64,
		lyricMin: 24,
		lyricMax: 120,
		lyricMiddle: false,
		titleSize: 38,
		titleLine: 46,
		artistSize: 30,
		artistLine: 40,
		preview: [
			500,
			440,
			380
		]
	},
	tall: {
		label: "Tall Phone · 9:19.5",
		w: 720,
		h: 1558,
		radius: 44,
		pad: 64,
		cover: 128,
		coverR: 12,
		headGap: 28,
		logo: 60,
		wordmark: 42,
		logoGap: 28,
		lyricGap: 48,
		lyricMin: 22,
		lyricMax: 120,
		lyricMiddle: true,
		titleSize: 36,
		titleLine: 44,
		artistSize: 28,
		artistLine: 36,
		preview: [
			380,
			340,
			280
		]
	}
};
var FORMATS = {
	png: {
		mime: "image/png",
		ext: "png",
		q: void 0,
		label: "PNG",
		solid: false
	},
	jpg: {
		mime: "image/jpeg",
		ext: "jpg",
		q: .95,
		label: "JPG",
		solid: true
	},
	webp: {
		mime: "image/webp",
		ext: "webp",
		q: .92,
		label: "WebP",
		solid: false
	}
};
var EXPORT_PRESETS = [
	{
		id: "ig-post",
		label: "IG Post",
		w: 1080,
		h: 1350,
		layout: "portrait"
	},
	{
		id: "ig-story",
		label: "Story / Reel / TikTok",
		w: 1080,
		h: 1920,
		layout: "story"
	},
	{
		id: "square",
		label: "Square",
		w: 1080,
		h: 1080,
		layout: "square"
	},
	{
		id: "x",
		label: "X / Twitter",
		w: 1600,
		h: 900,
		layout: "wide"
	},
	{
		id: "wall-phone",
		label: "Wallpaper phone",
		w: 1170,
		h: 2532,
		layout: "tall"
	},
	{
		id: "wall-desk",
		label: "Wallpaper desktop",
		w: 1920,
		h: 1080,
		layout: "wide"
	}
];
var CANON = {
	portrait: "ig-post",
	story: "ig-story",
	square: "square",
	wide: "x",
	tall: "wall-phone"
};
var presetById = (id) => EXPORT_PRESETS.find((p) => p.id === id) || null;
var TILT_DEFAULT = {
	rx: 12,
	ry: -15,
	rz: 2,
	perspective: 1200
};
var GLARE = {
	angle: 115,
	stops: [
		[0, "rgba(255,255,255,0)"],
		[.28, "rgba(255,255,255,0)"],
		[.42, "rgba(255,255,255,0.55)"],
		[.5, "rgba(255,255,255,0.12)"],
		[.58, "rgba(255,255,255,0.38)"],
		[.72, "rgba(255,255,255,0)"],
		[1, "rgba(255,255,255,0)"]
	],
	lin: {
		holo: {
			angle: 125,
			stops: [
				[0, "rgba(255,60,170,0)"],
				[.16, "rgba(255,60,170,.38)"],
				[.32, "rgba(255,205,60,.42)"],
				[.48, "rgba(60,255,160,.44)"],
				[.64, "rgba(60,170,255,.44)"],
				[.8, "rgba(170,90,255,.38)"],
				[1, "rgba(170,90,255,0)"]
			]
		},
		gloss: {
			angle: 180,
			stops: [
				[0, "rgba(255,255,255,.55)"],
				[.22, "rgba(255,255,255,.22)"],
				[.47, "rgba(255,255,255,.10)"],
				[.475, "rgba(255,255,255,0)"],
				[1, "rgba(255,255,255,0)"]
			]
		},
		sweep: {
			angle: 100,
			stops: [
				[0, "rgba(255,255,255,0)"],
				[.36, "rgba(255,255,255,0)"],
				[.47, "rgba(255,255,255,.75)"],
				[.53, "rgba(255,255,255,.75)"],
				[.64, "rgba(255,255,255,0)"],
				[1, "rgba(255,255,255,0)"]
			]
		}
	},
	spot: {
		x: .3,
		y: .22,
		r: .85,
		stops: [
			[0, "rgba(255,255,255,0.70)"],
			[.3, "rgba(255,255,255,0.34)"],
			[.65, "rgba(255,255,255,0.08)"],
			[1, "rgba(255,255,255,0)"]
		]
	}
};
var PRESET_COLORS = [
	"#A7429A",
	"#E8115B",
	"#F59B23",
	"#1DB954",
	"#509BF5",
	"#7358FF",
	"#2D46B9",
	"#FF6437",
	"#F5D547",
	"#E6E6FA",
	"#B3B3B3",
	"#181818"
];
var FONT = "'Poppins', 'Segoe UI', Arial, sans-serif";
var LYRIC_FONTS = {
	poppins: {
		id: "poppins",
		label: "Poppins",
		family: FONT,
		weight: 700,
		k: 1
	},
	serif: {
		id: "serif",
		label: "Serif",
		family: "'Playfair Display', Georgia, 'Times New Roman', serif",
		weight: 700,
		k: 1,
		load: "Playfair Display"
	},
	hand: {
		id: "hand",
		label: "Handwritten",
		family: "'Caveat', 'Segoe Print', 'Bradley Hand', cursive",
		weight: 700,
		k: 1.22,
		load: "Caveat"
	},
	condensed: {
		id: "condensed",
		label: "Condensed",
		family: "'Oswald', 'Arial Narrow', 'Roboto Condensed', sans-serif",
		weight: 600,
		k: 1.1,
		load: "Oswald"
	},
	bold: {
		id: "bold",
		label: "Heavy",
		family: "'Archivo Black', 'Arial Black', Impact, sans-serif",
		weight: 400,
		k: .94,
		load: "Archivo Black"
	},
	mono: {
		id: "mono",
		label: "Typewriter",
		family: "'Courier New', ui-monospace, Menlo, Consolas, monospace",
		weight: 700,
		k: .9
	},
	pixel: {
		id: "pixel",
		label: "Pixel",
		family: "'Press Start 2P', 'Courier New', monospace",
		weight: 400,
		k: .62,
		load: "Press Start 2P"
	},
	chalk: {
		id: "chalk",
		label: "Chalk",
		family: "'Patrick Hand', 'Caveat', cursive",
		weight: 400,
		k: 1.18,
		load: "Patrick Hand"
	},
	marker: {
		id: "marker",
		label: "Marker",
		family: "'Permanent Marker', 'Caveat', cursive",
		weight: 400,
		k: 1.05,
		load: "Permanent Marker"
	},
	comicpop: {
		id: "comicpop",
		label: "Comic",
		family: "'Bangers', 'Arial Black', Impact, sans-serif",
		weight: 400,
		k: 1.08,
		load: "Bangers"
	},
	editorial: {
		id: "editorial",
		label: "Editorial",
		family: "'Newsreader', 'Playfair Display', Georgia, serif",
		weight: 600,
		k: 1.02,
		load: "Newsreader"
	},
	motion: {
		id: "motion",
		label: "Motion",
		family: "'Orbitron', 'Oswald', sans-serif",
		weight: 700,
		k: .82,
		load: "Orbitron"
	},
	plastic: {
		id: "plastic",
		label: "Plastic",
		family: "'Fredoka', 'Poppins', sans-serif",
		weight: 700,
		k: 1.02,
		load: "Fredoka"
	},
	film: {
		id: "film",
		label: "Film",
		family: "'Poppins', 'Segoe UI', sans-serif",
		weight: 600,
		k: 1,
		load: "Poppins"
	}
};
var THEME_FONT = {
	notebook: "hand",
	polaroid: "hand",
	newspaper: "serif",
	ticket: "condensed",
	brutalism: "bold",
	pixel: "bold",
	y2k: "bold",
	wrapped: "bold",
	receipt: "mono",
	gameboy: "bold",
	comic: "bold",
	pixelart: "pixel",
	chalkboard: "chalk",
	glowsketch: "marker",
	ps2: "bold",
	comicart: "comicpop",
	flatvector: "bold",
	dankoe: "editorial",
	cgimotion: "motion",
	lego: "plastic",
	zackd: "film"
};
var THEMES = {
	classic: {
		label: "Classic",
		desc: "Metallic sheen on Wide, flat color on Square.",
		icon: "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"4\"/><path d=\"M8 15l5-6\"/>"
	},
	brutalism: {
		label: "Brutalism",
		desc: "Sharp corners, a thick black border and a hard offset shadow.",
		icon: "<rect x=\"3\" y=\"3\" width=\"14\" height=\"14\"/><path d=\"M7 21h14V7\"/>"
	},
	cyberpunk: {
		label: "Cyberpunk",
		desc: "Near-black card with glowing neon text and borders.",
		icon: "<path d=\"M13 2L4 14h7l-1 8 9-12h-7z\"/>"
	},
	glass: {
		label: "Glass",
		desc: "Frosted glass pane with lit edges over a color glow.",
		icon: "<rect x=\"3\" y=\"7\" width=\"12\" height=\"12\" rx=\"3\" opacity=\".55\"/><rect x=\"9\" y=\"4\" width=\"12\" height=\"12\" rx=\"3\"/>"
	},
	clay: {
		label: "Clay",
		desc: "Pastel, puffy and soft with huge rounded corners.",
		icon: "<path d=\"M12 3c5 0 9 3 9 8.5S17.5 21 12 21 3 17 3 11.5 7 3 12 3z\"/><path d=\"M8 8c1-1.4 2.4-2 4-2\"/>"
	},
	neumorphism: {
		label: "Neumorphic",
		desc: "Soft extruded surface with light and dark shadows.",
		icon: "<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"5.5\"/><rect x=\"8\" y=\"8\" width=\"8\" height=\"8\" rx=\"3\"/>"
	},
	vinyl: {
		label: "Vinyl",
		desc: "A black record with grooves and a color label, half hidden behind the lyrics.",
		icon: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 3a9 9 0 0 1 9 9\"/>"
	},
	ticket: {
		label: "Ticket",
		desc: "Cream concert ticket with a tear-off stub and a barcode.",
		icon: "<path d=\"M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z\"/><path d=\"M14 6v12\" stroke-dasharray=\"2 2\"/>"
	},
	polaroid: {
		label: "Polaroid",
		desc: "White instant-photo paper with a strip of tape on top.",
		icon: "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\"/><rect x=\"7\" y=\"6\" width=\"10\" height=\"9\"/>"
	},
	y2k: {
		label: "Y2K Chrome",
		desc: "Glossy chrome gradient with a horizon band and sparkles.",
		icon: "<path d=\"M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z\"/>"
	},
	aurora: {
		label: "Aurora",
		desc: "Dark card with soft glowing color blooms from your card color.",
		icon: "<path d=\"M3 15c3-6 6-6 9 0s6 6 9 0\"/><path d=\"M3 10c3-5 6-5 9 0s6 5 9 0\"/>"
	},
	pixel: {
		label: "Retro Pixel",
		desc: "An 8-bit window with a title bar, chunky border and hard shadow.",
		icon: "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\"/><path d=\"M4 9h16M7.5 6.5h.01M10.5 6.5h.01\"/>"
	},
	notebook: {
		label: "Notebook",
		desc: "Ruled paper with a red margin line and punched holes.",
		icon: "<rect x=\"5\" y=\"3\" width=\"15\" height=\"18\" rx=\"2\"/><path d=\"M9 3v18M12 8h5M12 12h5\"/>"
	},
	newspaper: {
		label: "Newspaper",
		desc: "Aged newsprint with halftone dots and double rules.",
		icon: "<path d=\"M5 4h14v16H5z\"/><path d=\"M8 8h8M8 12h3M13 12h3M8 16h8\"/>"
	},
	sticker: {
		label: "Sticker",
		desc: "Die-cut sticker with a thick white outline and a peeled corner.",
		icon: "<path d=\"M5 4h14v10l-5 6H5z\"/><path d=\"M19 14h-5v6\"/>"
	},
	holo: {
		label: "Holo Card",
		desc: "Foil trading card with a rainbow frame, dark panel and sparkles.",
		icon: "<path d=\"M12 3l2.2 5.3 5.8.5-4.4 3.8 1.4 5.6L12 15l-5 3.2 1.4-5.6L4 8.8l5.8-.5z\"/>"
	},
	wrapped: {
		label: "Wrapped",
		desc: "Bold gradient lock-screen look with big soft shapes and a home bar.",
		icon: "<rect x=\"6\" y=\"2.5\" width=\"12\" height=\"19\" rx=\"3\"/><path d=\"M9.5 7h5M9.5 11h5\"/><circle cx=\"12\" cy=\"17\" r=\"1\"/>"
	},
	cassette: {
		label: "Cassette",
		desc: "Cream tape shell with label stripes, screws and a reel window.",
		icon: "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"2\"/><circle cx=\"8.5\" cy=\"12\" r=\"2\"/><circle cx=\"15.5\" cy=\"12\" r=\"2\"/><path d=\"M8 18l1.5-3h5l1.5 3\"/>"
	},
	receipt: {
		label: "Receipt",
		desc: "Thermal paper with torn zigzag edges, dashed rules and a typewriter font.",
		icon: "<path d=\"M5 3v18l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5V3l-2 1.5L14 3l-2 1.5L10 3 8 4.5z\"/><path d=\"M8.5 9h7M8.5 13h5\"/>"
	},
	gameboy: {
		label: "Gameboy",
		desc: "Grey handheld shell with a dark bezel and a four-shade green LCD.",
		icon: "<rect x=\"5\" y=\"2.5\" width=\"14\" height=\"19\" rx=\"2.5\"/><rect x=\"8\" y=\"5.5\" width=\"8\" height=\"6\" rx=\"1\"/><path d=\"M9 16h3M10.5 14.5v3\"/><circle cx=\"15.5\" cy=\"16\" r=\".6\"/>"
	},
	stained: {
		label: "Stained Glass",
		desc: "Jewel-toned panes from your card color, set in thick black lead.",
		icon: "<path d=\"M5 21V10a7 7 0 0 1 14 0v11z\"/><path d=\"M12 3v18M5 12h14M5 17h14\"/>"
	},
	neon: {
		label: "Neon Sign",
		desc: "Glowing glass tube on a dark brick wall, with a flickering gap.",
		icon: "<path d=\"M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z\"/><path d=\"M10 19.5h4M10.5 21.5h3\"/>"
	},
	comic: {
		label: "Comic Panel",
		desc: "Inked panel with halftone dots and a thick black frame.",
		icon: "<path d=\"M4 5h16v11H11l-4 4v-4H4z\"/><path d=\"M8 9h8M8 12h5\"/>"
	},
	pixelart: {
		label: "Pixel Art",
		desc: "Chunky 8-bit tiles.",
		icon: "<path d=\"M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4z\"/>"
	},
	chalkboard: {
		label: "Chalkboard",
		desc: "Chalk on a green board.",
		icon: "<rect x=\"3\" y=\"4\" width=\"18\" height=\"14\" rx=\"1\"/><path d=\"M7 17c2-2 3-2 5 0\"/>"
	},
	glowsketch: {
		label: "Glow Sketch",
		desc: "Neon hand-drawn lines.",
		icon: "<path d=\"M5 16c2-6 4-8 7-8s4 3 7 1\"/><path d=\"M8 19c1.5-2 3-2 5 0\"/>"
	},
	ps2: {
		label: "PS2",
		desc: "Low-poly console era.",
		icon: "<path d=\"M4 16l8-10 8 10z\"/><path d=\"M8 16l4-5 4 5\"/>"
	},
	comicart: {
		label: "Comic Art",
		desc: "Halftone ink and bursts.",
		icon: "<path d=\"M5 6h10l2 3-2 9H5z\"/><path d=\"M15 6l4 2-2 4\"/>"
	},
	flatvector: {
		label: "Flat Vector",
		desc: "Hard shapes, no shading.",
		icon: "<circle cx=\"8\" cy=\"8\" r=\"4\"/><rect x=\"12\" y=\"12\" width=\"8\" height=\"8\"/>"
	},
	dankoe: {
		label: "Dan Koe",
		desc: "Quiet editorial type.",
		icon: "<path d=\"M5 7h14M5 12h10M5 17h12\"/>"
	},
	cgimotion: {
		label: "CGI Motion",
		desc: "Glossy streaks and chrome.",
		icon: "<path d=\"M3 15c4-8 8-8 12 0M3 10c4-6 8-6 14-1\"/>"
	},
	lego: {
		label: "Lego",
		desc: "Plastic brick with studs.",
		icon: "<rect x=\"3\" y=\"8\" width=\"18\" height=\"10\" rx=\"1\"/><circle cx=\"8\" cy=\"8\" r=\"2\"/><circle cx=\"16\" cy=\"8\" r=\"2\"/>"
	},
	zackd: {
		label: "Zackd",
		desc: "Letterbox and caption bar.",
		icon: "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\"/><path d=\"M3 8h18M6 15h8\"/>"
	}
};
var THEME_GLARE = {
	classic: "diagonal",
	brutalism: "none",
	cyberpunk: "sweep",
	glass: "gloss",
	clay: "spotlight",
	neumorphism: "spotlight",
	vinyl: "sweep",
	ticket: "diagonal",
	polaroid: "gloss",
	y2k: "holo",
	aurora: "spotlight",
	pixel: "none",
	notebook: "none",
	newspaper: "none",
	sticker: "gloss",
	holo: "holo",
	wrapped: "spotlight",
	cassette: "gloss",
	receipt: "none",
	gameboy: "diagonal",
	stained: "spotlight",
	neon: "sweep",
	comic: "none",
	pixelart: "none",
	chalkboard: "none",
	glowsketch: "sweep",
	ps2: "diagonal",
	comicart: "none",
	flatvector: "none",
	dankoe: "none",
	cgimotion: "sweep",
	lego: "spotlight",
	zackd: "none"
};
var THEME_INSET = {
	classic: [
		0,
		0,
		0,
		0
	],
	brutalism: [
		14,
		14,
		28,
		28
	],
	cyberpunk: [
		34,
		34,
		34,
		34
	],
	glass: [
		44,
		44,
		44,
		44
	],
	clay: [
		28,
		28,
		60,
		60
	],
	neumorphism: [
		40,
		40,
		40,
		40
	],
	vinyl: [
		28,
		28,
		40,
		44
	],
	ticket: [
		28,
		28,
		28,
		44
	],
	polaroid: [
		32,
		48,
		36,
		48
	],
	y2k: [
		30,
		30,
		36,
		48
	],
	aurora: [
		28,
		28,
		28,
		44
	],
	pixel: [
		14,
		14,
		28,
		28
	],
	notebook: [
		28,
		28,
		28,
		44
	],
	newspaper: [
		28,
		28,
		28,
		44
	],
	sticker: [
		44,
		44,
		56,
		60
	],
	holo: [
		28,
		28,
		28,
		44
	],
	wrapped: [
		24,
		24,
		32,
		40
	],
	cassette: [
		28,
		28,
		28,
		44
	],
	receipt: [
		24,
		28,
		24,
		44
	],
	gameboy: [
		28,
		28,
		36,
		44
	],
	stained: [
		28,
		28,
		28,
		44
	],
	neon: [
		34,
		34,
		34,
		34
	],
	comic: [
		14,
		14,
		28,
		28
	],
	pixelart: [
		0,
		0,
		0,
		0
	],
	chalkboard: [
		0,
		0,
		0,
		0
	],
	glowsketch: [
		0,
		0,
		0,
		0
	],
	ps2: [
		0,
		0,
		0,
		0
	],
	comicart: [
		12,
		12,
		20,
		20
	],
	flatvector: [
		0,
		0,
		0,
		0
	],
	dankoe: [
		0,
		0,
		0,
		0
	],
	cgimotion: [
		0,
		0,
		0,
		0
	],
	lego: [
		0,
		0,
		0,
		0
	],
	zackd: [
		0,
		0,
		0,
		0
	]
};
var THEME_R = {
	holo: 36,
	wrapped: 56,
	cassette: 22,
	receipt: 0,
	gameboy: 24,
	stained: 14,
	neon: 28,
	comic: 0,
	brutalism: 0,
	clay: 64,
	pixel: 0,
	pixelart: 4,
	chalkboard: 14,
	glowsketch: 28,
	ps2: 8,
	comicart: 4,
	flatvector: 28,
	dankoe: 6,
	cgimotion: 20,
	lego: 12,
	zackd: 2,
	newspaper: 6,
	polaroid: 10,
	notebook: 16,
	ticket: 20,
	sticker: 56,
	y2k: 80
};
var COVER_RADIUS = {
	holo: 12,
	wrapped: 28,
	cassette: 6,
	receipt: 0,
	gameboy: 0,
	stained: 6,
	neon: 14,
	comic: 0,
	brutalism: 0,
	glass: 16,
	clay: 28,
	neumorphism: 20,
	vinyl: 6,
	ticket: 10,
	polaroid: 4,
	y2k: 30,
	aurora: 20,
	pixel: 0,
	pixelart: 0,
	chalkboard: 6,
	glowsketch: 16,
	ps2: 4,
	comicart: 0,
	flatvector: 18,
	dankoe: 4,
	cgimotion: 14,
	lego: 8,
	zackd: 2,
	notebook: 4,
	newspaper: 0,
	sticker: 20
};
var EXTRUDE_GAIN = 1.5;
var lx = -.6;
var ly = -.8;
var ll = Math.hypot(lx, ly);
var LIGHT_DIR = {
	x: lx / ll,
	y: ly / ll
};
var rad$1 = (deg) => deg * Math.PI / 180;
var fontGen = 0;
var incrementFontGen = () => fontGen++;
var wordWidths = /* @__PURE__ */ new Map();
function wordWidth(g, word, size, fontFamily, weight, k) {
	const key = `${fontGen}|${fontFamily}|${weight}|${size}|${k}|${word}`;
	let w = wordWidths.get(key);
	if (w === void 0) {
		w = g.measureText(word).width;
		if (wordWidths.size > 8e3) wordWidths.clear();
		wordWidths.set(key, w);
	}
	return w;
}
function parseLyrics(text) {
	const paras = text.split("\n").map((raw) => {
		const t = raw.trim();
		return t ? t.split(/\s+/) : null;
	});
	while (paras.length && paras[0] === null) paras.shift();
	while (paras.length && paras[paras.length - 1] === null) paras.pop();
	return paras;
}
var themeRadius = (theme, baseRadius) => THEME_R[theme] !== void 0 ? THEME_R[theme] : baseRadius;
function cardGeom(layoutKey, theme, cardDepth, bgStyle, tilt, fixedExtrude = false) {
	const L = LAYOUTS[layoutKey];
	const bx = bgStyle === "none" ? 0 : Math.round(Math.min(L.w, L.h) * .075);
	const [l0, t0, r0, b0] = THEME_INSET[theme] || [
		0,
		0,
		0,
		0
	];
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
		r: themeRadius(theme, L.radius) * s
	};
}
function getExtrusionVector(depth, tilt, fixed = false) {
	if (!(depth > 0)) return {
		dx: 0,
		dy: 0,
		len: 0,
		lit: 0
	};
	let dx;
	let dy;
	if (fixed) dx = dy = depth;
	else {
		const rx = rad$1(tilt.rx);
		const ry = rad$1(tilt.ry);
		const rz = rad$1(tilt.rz);
		const sx = -Math.sin(ry) * 1 * depth * EXTRUDE_GAIN;
		const sy = Math.sin(rx) * Math.cos(ry) * depth * EXTRUDE_GAIN;
		dx = Math.cos(rz) * sx + Math.sin(rz) * sy;
		dy = -Math.sin(rz) * sx + Math.cos(rz) * sy;
	}
	dx = Math.round(dx * 100) / 100;
	dy = Math.round(dy * 100) / 100;
	const len = Math.hypot(dx, dy);
	const lit = len ? (dx * LIGHT_DIR.x + dy * LIGHT_DIR.y) / len : 0;
	return {
		dx,
		dy,
		len,
		lit
	};
}
var rampCache = /* @__PURE__ */ new Map();
function getRamp(baseColor, wallColor, theme, v, n) {
	const glass = theme === "glass";
	const base = glass ? mixHex(baseColor, "#ffffff", .5) : wallColor;
	const key = `${base}|${v.lit.toFixed(2)}|${n}|${glass ? 1 : 0}`;
	let r = rampCache.get(key);
	if (r) return r;
	if (rampCache.size > 50) rampCache.clear();
	const near = v.lit >= 0 ? mixHex(base, "#ffffff", .1 + .3 * v.lit) : mixHex(base, "#000000", .05 - .1 * v.lit);
	const deep = mixHex(base, "#000000", (glass ? .2 : .4) + .25 * (1 - v.lit) / 2);
	r = [];
	for (let k = 0; k < n; k++) r.push(mixHex(near, deep, Math.pow((k + 1) / n, .85)));
	rampCache.set(key, r);
	return r;
}
var layerMemo = /* @__PURE__ */ new Map();
function getLayers(depth, tilt, baseColor, wallColor, theme, maxN, fixed = false) {
	const v = getExtrusionVector(depth, tilt, fixed);
	if (v.len < .5) return null;
	const n = Math.max(1, Math.min(maxN, Math.ceil(v.len)));
	const key = `${v.dx}|${v.dy}|${wallColor}|${theme}|${baseColor}|${n}`;
	let out = layerMemo.get(key);
	if (out) return out;
	if (layerMemo.size > 30) layerMemo.clear();
	const ramp = getRamp(baseColor, wallColor, theme, v, n);
	out = [];
	for (let i = n; i >= 1; i--) out.push({
		dx: v.dx * i / n,
		dy: v.dy * i / n,
		color: ramp[i - 1]
	});
	layerMemo.set(key, out);
	return out;
}
function roundedPath(g, x, y, w, h, r) {
	g.moveTo(x + r, y);
	g.arcTo(x + w, y, x + w, y + h, r);
	g.arcTo(x + w, y + h, x, y + h, r);
	g.arcTo(x, y + h, x, y, r);
	g.arcTo(x, y, x + w, y, r);
	g.closePath();
}
function roundedRect(g, x, y, w, h, r) {
	g.beginPath();
	roundedPath(g, x, y, w, h, r);
}
var wallLayer = null;
function getWallLayer(w, h) {
	if (!wallLayer) wallLayer = document.createElement("canvas");
	if (wallLayer.width !== w || wallLayer.height !== h) {
		wallLayer.width = w;
		wallLayer.height = h;
	}
	return wallLayer;
}
function extrudeWalls(g, shape, depth, tilt, baseColor, wallColor, theme, b, fixed = false) {
	const v = getExtrusionVector(depth, tilt, fixed);
	if (v.len < .5) return;
	const glass = theme === "glass";
	const n = Math.max(1, Math.min(80, Math.ceil(v.len / (v.len > 40 ? 2 : 1))));
	const ramp = getRamp(baseColor, wallColor, theme, v, n);
	const clipOut = (c) => {
		c.beginPath();
		c.rect(-8192, -8192, 16384, 16384);
		shape(c, 0, 0);
		c.clip("evenodd");
	};
	let t = g;
	let layer = null;
	if (glass) {
		layer = getWallLayer(g.canvas.width, g.canvas.height);
		const layerCtx = layer.getContext("2d");
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
		shape(t, v.dx * i / n, v.dy * i / n);
		t.fill();
	}
	if (b) {
		const cx = b.x + b.w / 2 + v.dx / 2;
		const cy = b.y + b.h / 2 + v.dy / 2;
		const hd = (Math.hypot(b.w, b.h) + v.len) / 2;
		const gr = t.createLinearGradient(cx + LIGHT_DIR.x * hd, cy + LIGHT_DIR.y * hd, cx - LIGHT_DIR.x * hd, cy - LIGHT_DIR.y * hd);
		gr.addColorStop(0, "rgba(255,255,255,0.20)");
		gr.addColorStop(.45, "rgba(255,255,255,0)");
		gr.addColorStop(.55, "rgba(0,0,0,0)");
		gr.addColorStop(1, "rgba(0,0,0,0.35)");
		t.fillStyle = gr;
		const stride = Math.max(2, Math.ceil(n / 12));
		for (let i = n; i >= 1; i -= stride) {
			t.beginPath();
			shape(t, v.dx * i / n, v.dy * i / n);
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
		g.globalAlpha *= .3;
		g.drawImage(layer, 0, 0);
		g.restore();
		g.save();
		clipOut(g);
		g.lineJoin = "round";
		g.strokeStyle = "rgba(255,255,255,0.8)";
		g.lineWidth = 2.5;
		g.beginPath();
		shape(g, v.dx, v.dy);
		g.stroke();
		g.strokeStyle = "rgba(255,255,255,0.4)";
		g.lineWidth = 1.5;
		g.beginPath();
		shape(g, 0, 0);
		g.stroke();
		g.restore();
	}
}
function letterSpacing(g, px) {
	if ("letterSpacing" in g) g.letterSpacing = px + "px";
}
function wrapLine(g, text, maxWidth) {
	const words = text.split(/\s+/);
	const lines = [];
	let line = "";
	for (const word of words) {
		const test = line ? line + " " + word : word;
		if (g.measureText(test).width > maxWidth && line) {
			lines.push(line);
			line = word;
		} else line = test;
	}
	lines.push(line);
	return lines;
}
function ellipsize(g, text, maxWidth) {
	if (g.measureText(text).width <= maxWidth) return text;
	while (text.length > 1 && g.measureText(text + "…").width > maxWidth) text = text.slice(0, -1);
	return text.trimEnd() + "…";
}
function getPalette(theme, bg) {
	const P = {
		text: contrastColor(bg),
		surface: bg,
		glow: null,
		wall: mixHex(bg, "#000000", .45),
		neon: null,
		shadowDark: null,
		passes: [{
			dx: 0,
			dy: 0,
			color: contrastColor(bg),
			main: true
		}]
	};
	if (applySignaturePalette(theme, P, bg)) {
		if (!P.wall) P.wall = mixHex(P.surface, "#000000", .45);
		return P;
	}
	switch (theme) {
		case "cyberpunk":
			P.neon = luma(bg) < 90 ? mixHex(bg, "#ffffff", .55) : mixHex(bg, "#ffffff", .2);
			P.text = P.neon;
			P.glow = bg;
			P.wall = mixHex(P.neon, "#000000", .62);
			break;
		case "glass":
			P.text = "#FFFFFF";
			break;
		case "vinyl":
			P.surface = mixHex(bg, "#000000", .84);
			P.text = "#FFFFFF";
			break;
		case "aurora":
			P.surface = mixHex(bg, "#000000", .82);
			P.text = "#FFFFFF";
			break;
		case "ticket":
			P.surface = mixHex(bg, "#ffffff", .9);
			P.text = mixHex(bg, "#000000", .72);
			break;
		case "polaroid":
			P.surface = "#FAF8F3";
			P.text = "#262626";
			break;
		case "y2k":
			P.surface = mixHex(bg, "#ffffff", .6);
			P.text = luma(mixHex(bg, "#ffffff", .5)) > 150 ? mixHex(bg, "#000000", .78) : "#0d0d1a";
			break;
		case "pixel":
			P.surface = mixHex(bg, "#ffffff", .86);
			P.text = "#111111";
			break;
		case "notebook":
			P.surface = "#FBF7EA";
			P.text = "#243049";
			break;
		case "newspaper":
			P.surface = "#EAE5D6";
			P.text = "#161616";
			break;
		case "holo":
			P.surface = mixHex(bg, "#000000", .82);
			P.text = "#FFFFFF";
			break;
		case "cassette":
			P.surface = mixHex(bg, "#F2E8D0", .88);
			P.text = "#2A2118";
			break;
		case "receipt":
			P.surface = "#FAF9F4";
			P.text = "#1A1A1A";
			break;
		case "gameboy":
			P.surface = "#9BBC0F";
			P.text = "#0F380F";
			break;
		case "stained":
			P.surface = mixHex(bg, "#000000", .5);
			P.text = "#FFFFFF";
			break;
		case "comic":
			P.surface = mixHex(bg, "#ffffff", .86);
			P.text = "#111111";
			break;
		case "neon":
			P.neon = luma(bg) < 90 ? mixHex(bg, "#ffffff", .55) : mixHex(bg, "#ffffff", .25);
			P.text = P.neon;
			P.glow = bg;
			P.surface = "#0D0A10";
			P.wall = mixHex(P.neon, "#000000", .62);
			break;
		case "clay":
			P.surface = mixHex(bg, "#ffffff", .5);
			P.text = luma(P.surface) > 128 ? mixHex(bg, "#000000", .62) : "#FFFFFF";
			break;
		case "neumorphism":
			P.surface = mixHex(bg, "#ffffff", .62);
			P.text = mixHex(P.surface, "#000000", .62);
			P.shadowDark = rgba(mixHex(bg, "#000000", .4), .55);
	}
	if (!P.wall) P.wall = mixHex(P.surface, "#000000", .45);
	P.passes = [{
		dx: 0,
		dy: 0,
		color: P.text,
		main: true
	}];
	return P;
}
function cardFrame(layout, theme, hideCover) {
	const W = layout.w;
	const H = layout.h;
	const pad = layout.pad;
	const wide = W / H >= 1.3;
	const f = {
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
		stub: null
	};
	if (theme === "ticket") {
		if (wide) {
			const sw = Math.round(W * .2);
			f.stub = {
				v: true,
				at: W - sw,
				len: sw
			};
			f.x1 = W - sw - 44;
		} else {
			const sh = Math.round(H * .17);
			f.stub = {
				v: false,
				at: H - sh,
				len: sh
			};
			f.y1 = H - sh - 36;
		}
	}
	if (!f.hw) f.hw = f.x1 - f.hx;
	return f;
}
var logoSprites = /* @__PURE__ */ new Map();
function getLogoSprite(color, logoSize, sc) {
	const key = `${color}|${logoSize}|${sc}`;
	let off = logoSprites.get(key);
	if (off) return off;
	if (logoSprites.size >= 30) logoSprites.clear();
	const r = logoSize / 2;
	off = document.createElement("canvas");
	off.width = off.height = Math.round(logoSize * sc);
	const og = off.getContext("2d");
	if (!og) return off;
	og.setTransform(sc, 0, 0, sc, 0, 0);
	og.globalCompositeOperation = "source-over";
	og.globalAlpha = 1;
	og.fillStyle = color;
	og.beginPath();
	og.arc(r, r, r, 0, Math.PI * 2);
	og.fill();
	og.globalCompositeOperation = "destination-out";
	og.strokeStyle = "#000000";
	og.lineCap = "round";
	og.lineJoin = "round";
	for (const a of [
		{
			x1: -.56,
			y1: -.22,
			qx: .04,
			qy: -.46,
			x2: .6,
			y2: -.12,
			w: .16
		},
		{
			x1: -.47,
			y1: .04,
			qx: .02,
			qy: -.14,
			x2: .5,
			y2: .14,
			w: .13
		},
		{
			x1: -.38,
			y1: .27,
			qx: .01,
			qy: .13,
			x2: .4,
			y2: .35,
			w: .1
		}
	]) {
		og.lineWidth = a.w * r;
		og.beginPath();
		og.moveTo(r + a.x1 * r, r + a.y1 * r);
		og.quadraticCurveTo(r + a.qx * r, r + a.qy * r, r + a.x2 * r, r + a.y2 * r);
		og.stroke();
	}
	og.globalCompositeOperation = "source-over";
	logoSprites.set(key, off);
	return off;
}
var patternCache = /* @__PURE__ */ new Map();
function tilePattern(ctx, key, size, draw) {
	if (patternCache.has(key)) return patternCache.get(key) || null;
	const c = document.createElement("canvas");
	c.width = c.height = size;
	const cx = c.getContext("2d");
	if (cx) draw(cx, size);
	const p = ctx.createPattern(c, "repeat");
	if (patternCache.size > 50) patternCache.clear();
	patternCache.set(key, p);
	return p;
}
function sparkle(g, x, y, r, color) {
	g.fillStyle = color;
	g.beginPath();
	g.moveTo(x, y - r);
	g.quadraticCurveTo(x, y, x + r, y);
	g.quadraticCurveTo(x, y, x, y + r);
	g.quadraticCurveTo(x, y, x - r, y);
	g.quadraticCurveTo(x, y, x, y - r);
	g.fill();
}
function cardDrop(g, W, H, R, fill, blur = 30, oy = 14, unit = 1) {
	g.save();
	g.shadowColor = "rgba(0,0,0,0.42)";
	g.shadowBlur = blur * unit;
	g.shadowOffsetX = 0;
	g.shadowOffsetY = oy * unit;
	g.fillStyle = fill;
	roundedRect(g, 0, 0, W, H, R);
	g.fill();
	g.restore();
}
var stubCache = {
	key: "",
	bars: [],
	no: ""
};
function stubBars(title, artist) {
	const key = `${title}|${artist}`;
	if (stubCache.key !== key) {
		let h = 2166136261;
		for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619) >>> 0;
		const rnd = () => {
			h = h + 1831565813 >>> 0;
			let t = h;
			t = Math.imul(t ^ t >>> 15, t | 1);
			t ^= t + Math.imul(t ^ t >>> 7, t | 61);
			return ((t ^ t >>> 14) >>> 0) / 4294967296;
		};
		const bars = [
			1,
			1,
			1
		];
		let sum = 3;
		while (sum < 110) {
			const w = [
				1,
				1,
				2,
				2,
				3,
				4
			][Math.floor(rnd() * 6)];
			bars.push(w);
			sum += w;
		}
		bars.push(1, 1, 1);
		stubCache.bars = bars;
		stubCache.no = "No. " + String(Math.floor(rnd() * 9e5) + 1e5);
		stubCache.key = key;
	}
	return stubCache;
}
function drawStub(g, P, st, layout, title, artist) {
	const W = layout.w;
	const H = layout.h;
	const c = stubBars(title, artist);
	g.save();
	if (st.v) {
		g.translate(st.at + st.len / 2, H / 2);
		g.rotate(Math.PI / 2);
	} else g.translate(W / 2, st.at + st.len / 2);
	const lw = (st.v ? H : W) - 150;
	const lh = st.len - (st.v ? 72 : 56);
	const top = -lh / 2;
	const fs = 22;
	g.fillStyle = P.text;
	g.textBaseline = "top";
	g.font = `600 ${fs}px ${FONT}`;
	letterSpacing(g, 0);
	g.globalAlpha = .8;
	g.textAlign = "left";
	g.fillText("Admit one", -lw / 2, top);
	g.textAlign = "right";
	g.fillText(c.no, lw / 2, top);
	g.globalAlpha = 1;
	g.textAlign = "left";
	const u = lw / c.bars.reduce((a, b) => a + b, 0);
	const y0 = top + fs + 16;
	const bh = lh - fs - 16;
	let x = -lw / 2;
	c.bars.forEach((w, i) => {
		if (i % 2 === 0) g.fillRect(x, y0, w * u, bh);
		x += w * u;
	});
	g.restore();
}
function drawCoverPlaceholder(g, x, y, size, textColor) {
	g.fillStyle = rgba(textColor, .16);
	g.fillRect(x, y, size, size);
	g.fillStyle = rgba(textColor, .55);
	const cx = x + size / 2;
	const cy = y + size / 2;
	const u = size / 100;
	g.beginPath();
	g.ellipse(cx - 9 * u, cy + 16 * u, 11 * u, 8.5 * u, -.35, 0, Math.PI * 2);
	g.fill();
	g.fillRect(cx + .5 * u, cy - 26 * u, 5 * u, 42 * u);
	g.beginPath();
	g.moveTo(cx + 5.5 * u, cy - 26 * u);
	g.quadraticCurveTo(cx + 24 * u, cy - 20 * u, cx + 20 * u, cy - 2 * u);
	g.quadraticCurveTo(cx + 18 * u, cy - 14 * u, cx + 5.5 * u, cy - 14 * u);
	g.closePath();
	g.fill();
}
function coverRadius(coverShape, theme, cs, defaultR) {
	if (coverShape === "square") return 0;
	if (coverShape === "rounded") return Math.round(cs * .16);
	if (coverShape === "circle") return cs / 2;
	return COVER_RADIUS[theme] !== void 0 ? COVER_RADIUS[theme] : defaultR;
}
function drawCover(g, state, layout, P, coverImg, tilt, unit = 1, fixedExtrude = false) {
	const f = cardFrame(layout, state.theme, state.hide.cover);
	const x = f.cx;
	const y = f.cy;
	const S = f.cs;
	const r = coverRadius(state.coverShape, state.theme, S, layout.coverR);
	const cd = Math.round(state.cardDepth * 1);
	if (cd > 0) extrudeWalls(g, (c, ox, oy) => roundedPath(c, x + ox, y + oy, S, S, r), cd, tilt, state.color, P.wall, state.theme, {
		x,
		y,
		w: S,
		h: S
	}, fixedExtrude);
	if (state.theme === "clay") {
		g.save();
		g.shadowColor = rgba(mixHex(state.color, "#000000", .55), .5);
		g.shadowBlur = 18 * unit;
		g.shadowOffsetX = 8 * unit;
		g.shadowOffsetY = 8 * unit;
		g.fillStyle = P.surface;
		roundedRect(g, x, y, S, S, r);
		g.fill();
		g.restore();
	} else if (state.theme === "neumorphism") {
		g.save();
		g.fillStyle = P.surface;
		roundedRect(g, x, y, S, S, r);
		g.shadowColor = "rgba(255,255,255,0.9)";
		g.shadowBlur = 12 * unit;
		g.shadowOffsetX = -6 * unit;
		g.shadowOffsetY = -6 * unit;
		g.fill();
		g.shadowColor = P.shadowDark || "rgba(0,0,0,0.4)";
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
	} else drawCoverPlaceholder(g, x, y, S, P.text);
	g.restore();
	if (state.theme === "brutalism" || state.theme === "comic") {
		g.strokeStyle = "#000000";
		g.lineWidth = 6;
		roundedRect(g, x + 3, y + 3, S - 6, S - 6, Math.max(0, r - 3));
		g.stroke();
	} else if (state.theme === "gameboy") {
		g.save();
		roundedRect(g, x, y, S, S, r);
		g.clip();
		g.globalCompositeOperation = "multiply";
		g.fillStyle = "#9BBC0F";
		g.fillRect(x, y, S, S);
		g.restore();
		g.strokeStyle = "#0F380F";
		g.lineWidth = 5;
		roundedRect(g, x + 2.5, y + 2.5, S - 5, S - 5, 0);
		g.stroke();
	} else if (state.theme === "cyberpunk" || state.theme === "neon") {
		g.save();
		g.shadowColor = state.color;
		g.shadowBlur = 15 * unit;
		g.strokeStyle = P.neon || "#00FFCC";
		g.lineWidth = 2.5;
		roundedRect(g, x + 1.25, y + 1.25, S - 2.5, S - 2.5, r - 1);
		g.stroke();
		g.restore();
	} else if (state.theme === "glass") {
		g.strokeStyle = "rgba(255,255,255,0.55)";
		g.lineWidth = 1.5;
		roundedRect(g, x + .75, y + .75, S - 1.5, S - 1.5, r - 1);
		g.stroke();
	}
}
var headerCache = {
	key: "",
	titleLines: [],
	artist: ""
};
function drawHeader(g, state, layout, P, tilt, unit = 1, fixedExtrude = false) {
	const f = cardFrame(layout, state.theme, state.hide.cover);
	const x = f.hx;
	const maxWidth = f.hw;
	const titleSize = layout.titleSize;
	const titleLine = layout.titleLine;
	const artistSize = layout.artistSize;
	const artistLine = layout.artistLine;
	const title = state.title.trim() || "Song title";
	const artistText = state.artist.trim() || "Artist";
	g.textBaseline = "top";
	g.font = `700 ${titleSize}px ${FONT}`;
	letterSpacing(g, -.5);
	const key = `${fontGen}|${state.layoutKey}|${maxWidth}|${title}|${artistText}`;
	if (headerCache.key !== key) {
		let lines = wrapLine(g, title, maxWidth);
		if (lines.length > 2) {
			lines = lines.slice(0, 2);
			lines[1] = ellipsize(g, lines[1] + " …", maxWidth);
		}
		headerCache.titleLines = lines.map((l) => ellipsize(g, l, maxWidth));
		g.font = `400 ${artistSize}px ${FONT}`;
		letterSpacing(g, 0);
		headerCache.artist = ellipsize(g, artistText, maxWidth);
		headerCache.key = key;
		g.font = `700 ${titleSize}px ${FONT}`;
		letterSpacing(g, -.5);
	}
	const titleLines = state.hide.title ? [] : headerCache.titleLines;
	const total = titleLines.length * titleLine + (state.hide.artist ? 0 : artistLine);
	const y0 = f.top ? f.hy : f.hy - total / 2;
	const yArtist = y0 + titleLines.length * titleLine;
	const lay = getLayers(Math.round(state.cardDepth * 1), tilt, state.color, P.wall, state.theme, 16, fixedExtrude);
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
			letterSpacing(g, -.5);
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
		g.globalAlpha = p.main ? .85 : 1;
		g.fillStyle = p.color;
		g.fillText(headerCache.artist, x + p.dx, yArtist + p.dy);
	}
	g.globalAlpha = 1;
	if (P.glow) {
		g.shadowColor = "rgba(0,0,0,0)";
		g.shadowBlur = 0;
	}
}
var lyricFontObj = (stateFont, theme) => {
	return LYRIC_FONTS[stateFont === "auto" ? THEME_FONT[theme] || "poppins" : stateFont] || LYRIC_FONTS.poppins;
};
var lyricFontCss = (size, stateFont, theme) => {
	const f = lyricFontObj(stateFont, theme);
	return `${f.weight} ${(size * f.k).toFixed(2)}px ${f.family}`;
};
function layoutLyrics(g, paras, size, maxWidth, stateFont, theme, build = false) {
	const lineHeight = Math.round(size * 1.2);
	const gap = Math.round(lineHeight * .5);
	const f = lyricFontObj(stateFont, theme);
	g.font = lyricFontCss(size, stateFont, theme);
	letterSpacing(g, -size * .02);
	const space = wordWidth(g, " ", size, f.family, f.weight, f.k);
	const rows = [];
	let height = 0;
	let tooWide = false;
	for (let pi = 0; pi < paras.length; pi++) {
		const words = paras[pi];
		if (!words) {
			height += gap;
			if (build) rows.push({
				text: "",
				h: gap
			});
			continue;
		}
		let line = "";
		let lineW = 0;
		for (const word of words) {
			const w = wordWidth(g, word, size, f.family, f.weight, f.k);
			if (w > maxWidth) tooWide = true;
			if (lineW && lineW + space + w > maxWidth) {
				height += lineHeight;
				if (build) rows.push({
					text: line,
					h: lineHeight,
					p: pi
				});
				line = build ? word : "";
				lineW = w;
			} else {
				if (build) line = lineW ? line + " " + word : word;
				lineW = lineW ? lineW + space + w : w;
			}
		}
		height += lineHeight;
		if (build) rows.push({
			text: line,
			h: lineHeight,
			p: pi
		});
	}
	letterSpacing(g, 0);
	return {
		rows,
		height,
		tooWide
	};
}
function fitLyricSize(g, paras, maxWidth, avail, minSize, maxSize, stateFont, theme) {
	const fits = (s) => {
		const m = layoutLyrics(g, paras, s, maxWidth, stateFont, theme, false);
		return !m.tooWide && m.height <= avail;
	};
	if (!fits(minSize)) return {
		size: minSize,
		overflow: true
	};
	if (fits(maxSize)) return {
		size: maxSize,
		overflow: false
	};
	let lo = minSize;
	let hi = maxSize - 1;
	while (lo < hi) {
		const mid = lo + hi + 1 >> 1;
		if (fits(mid)) lo = mid;
		else hi = mid - 1;
	}
	let best = lo;
	for (let s = lo + 1, end = Math.min(maxSize, lo + 12); s <= end; s++) if (fits(s)) best = s;
	return {
		size: best,
		overflow: false
	};
}
var barUnit = (logoSize) => logoSize / 72 * .85;
var barSpace = (hideBar, logoSize) => hideBar ? 0 : Math.round(156 * barUnit(logoSize));
function drawLyrics(g, state, layout, P, tilt, unit = 1, fixedExtrude = false) {
	const f = cardFrame(layout, state.theme, state.hide.cover);
	const maxWidth = f.x1 - f.lx;
	const top = f.ltop;
	const bSpace = barSpace(state.hide.bar, layout.logo);
	const avail = f.y1 - layout.logo - layout.logoGap - bSpace - top;
	const hasText = state.lyrics.trim().length > 0;
	const paras = parseLyrics(hasText ? state.lyrics : "Your lyrics\nwill appear here");
	let size;
	let overflow;
	if (state.autoFit) {
		const fitRes = fitLyricSize(g, paras, maxWidth, avail, layout.lyricMin, layout.lyricMax, state.lyricFont, state.theme);
		size = fitRes.size;
		overflow = fitRes.overflow;
	} else {
		size = state.lyricSize;
		const checkLayout = layoutLyrics(g, paras, size, maxWidth, state.lyricFont, state.theme, false);
		overflow = checkLayout.height > avail || checkLayout.tooWide;
	}
	const layoutRes = layoutLyrics(g, paras, size, maxWidth, state.lyricFont, state.theme, true);
	g.globalAlpha = hasText ? 1 : .45;
	const baseAlpha = g.globalAlpha;
	const hl = hasText && state.hlLine >= 0 && state.hlLine < paras.length ? state.hlLine : -1;
	const ra = (row) => hl >= 0 && row.p !== hl ? baseAlpha * .34 : baseAlpha;
	g.font = lyricFontCss(size, state.lyricFont, state.theme);
	g.textBaseline = "top";
	letterSpacing(g, -size * .02);
	const ax = state.align === "center" ? f.lx + maxWidth / 2 : state.align === "right" ? f.x1 : f.lx;
	g.textAlign = state.align;
	const y0 = top + (f.mid ? Math.max(0, (avail - layoutRes.height) / 2) : 0);
	const lay = getLayers(Math.round(state.cardDepth * 1), tilt, state.color, P.wall, state.theme, 20, fixedExtrude);
	if (lay) for (const o of lay) {
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
		g.shadowColor = "rgba(0,0,0,0)";
		g.shadowBlur = 0;
	}
	g.textAlign = "left";
	letterSpacing(g, 0);
	g.globalAlpha = 1;
	return {
		size,
		overflow
	};
}
function drawProgress(g, layout, P, unit = 1) {
	const f = cardFrame(layout, "classic", false);
	const u = barUnit(layout.logo);
	const x0 = f.bx0;
	const x1 = f.x1;
	const w = x1 - x0;
	const frac = .38;
	const ty = f.y1 - layout.logo - layout.logoGap - barSpace(false, layout.logo) + 26 * u + 8 * u;
	const th = Math.max(4, 7 * u);
	const kr = 11 * u;
	const tsY = ty + kr + 26 * u;
	g.save();
	if (P.glow) {
		g.shadowColor = P.glow;
		g.shadowBlur = 12 * unit;
	}
	g.fillStyle = P.text;
	g.globalAlpha = .3;
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
	g.textBaseline = "alphabetic";
	g.globalAlpha = .75;
	g.textAlign = "left";
	g.fillText("1:24", x0, tsY);
	g.textAlign = "right";
	g.fillText("-2:07", x1, tsY);
	g.textAlign = "left";
	g.globalAlpha = 1;
	const cx = (x0 + x1) / 2;
	const cy = tsY + 24 * u + 30 * u;
	const gap = Math.min(w / 5, 118 * u);
	const i = 13 * u;
	g.strokeStyle = P.text;
	g.fillStyle = P.text;
	g.lineWidth = 3 * u;
	g.lineCap = "round";
	g.lineJoin = "round";
	g.globalAlpha = .8;
	g.beginPath();
	g.moveTo(cx - 2 * gap - i, cy + i * .6);
	g.lineTo(cx - 2 * gap - i * .2, cy + i * .6);
	g.lineTo(cx - 2 * gap + i, cy - i * .6);
	g.moveTo(cx - 2 * gap - i, cy - i * .6);
	g.lineTo(cx - 2 * gap - i * .2, cy - i * .6);
	g.lineTo(cx - 2 * gap + i, cy + i * .6);
	g.stroke();
	roundedRect(g, cx + 2 * gap - i, cy - i * .6, i * 2, i * 1.2, i * .5);
	g.stroke();
	const tri = (tx, d) => {
		g.beginPath();
		g.moveTo(tx - d * i * .7, cy - i);
		g.lineTo(tx + d * i * .7, cy);
		g.lineTo(tx - d * i * .7, cy + i);
		g.closePath();
		g.fill();
	};
	g.globalAlpha = 1;
	tri(cx - gap + i * .3, -1);
	g.fillRect(cx - gap - i * .95, cy - i, 3 * u, i * 2);
	tri(cx + gap - i * .3, 1);
	g.fillRect(cx + gap + i * .95 - 3 * u, cy - i, 3 * u, i * 2);
	g.beginPath();
	g.arc(cx, cy, 30 * u, 0, Math.PI * 2);
	g.fill();
	if (P.glow) {
		g.shadowColor = "rgba(0,0,0,0)";
		g.shadowBlur = 0;
	}
	g.fillStyle = P.surface || "#000";
	g.fillRect(cx - 9 * u, cy - 11 * u, 6.5 * u, 22 * u);
	g.fillRect(cx + 2.5 * u, cy - 11 * u, 6.5 * u, 22 * u);
	g.restore();
}
function drawFooter(g, state, layout, P, tilt, unit = 1, fixedExtrude = false) {
	const f = cardFrame(layout, state.theme, state.hide.cover);
	const x = f.fx;
	const y = f.y1 - layout.logo;
	const cy = y + layout.logo / 2;
	const sc = Math.max(1, Math.ceil(g.getTransform ? g.getTransform().a : 1));
	const sprite = getLogoSprite(P.text, layout.logo, sc);
	const lay = getLayers(Math.round(state.cardDepth * 1), tilt, state.color, P.wall, state.theme, 16, fixedExtrude);
	if (lay) for (let k = 0; k < lay.length; k++) {
		const o = lay[k];
		g.drawImage(getLogoSprite(lay[k - k % 4].color, layout.logo, sc), x + o.dx, y + o.dy, layout.logo, layout.logo);
	}
	if (P.glow) {
		g.shadowColor = P.glow;
		g.shadowBlur = 15 * unit;
	}
	g.drawImage(sprite, x, y, layout.logo, layout.logo);
	g.font = `700 ${layout.wordmark}px ${FONT}`;
	g.textBaseline = "middle";
	const k = Math.max(1, Math.round(layout.wordmark / 26));
	letterSpacing(g, -k);
	const wx = x + layout.logo + Math.round(layout.logo * .22);
	if (lay) {
		if (P.glow) {
			g.shadowColor = "rgba(0,0,0,0)";
			g.shadowBlur = 0;
		}
		for (const o of lay) {
			g.fillStyle = o.color;
			g.fillText("Spotify", wx + o.dx, cy + k + o.dy);
		}
		if (P.glow) {
			g.shadowColor = P.glow;
			g.shadowBlur = 15 * unit;
		}
	}
	for (const p of P.passes) {
		g.fillStyle = p.color;
		g.fillText("Spotify", wx + p.dx, cy + k + p.dy);
	}
	letterSpacing(g, 0);
	g.textBaseline = "alphabetic";
	if (P.glow) {
		g.shadowColor = "rgba(0,0,0,0)";
		g.shadowBlur = 0;
	}
}
var codeCache = /* @__PURE__ */ new Map();
function drawCode(g, state, layout, P, onLoad) {
	if (!state.trackId || !/^#[0-9a-f]{6}$/i.test(P.surface)) return;
	const f = cardFrame(layout, state.theme, state.hide.cover);
	const h = layout.logo;
	const w = h * 4;
	const x = f.x1 - w;
	const y = f.y1 - layout.logo;
	const url = `https://scannables.scdn.co/uri/plain/png/${P.surface.slice(1)}/${luma(P.surface) < 150 ? "white" : "black"}/640/spotify:track:${state.trackId}`;
	let im = codeCache.get(url);
	if (im === void 0) {
		const img = new Image();
		img.crossOrigin = "anonymous";
		codeCache.set(url, "loading");
		img.onload = () => {
			codeCache.set(url, img);
			onLoad();
		};
		img.onerror = () => {
			codeCache.set(url, "fail");
		};
		img.src = url;
		return;
	}
	if (typeof im === "string") return;
	g.save();
	roundedRect(g, x, y, w, h, h * .16);
	g.clip();
	g.drawImage(im, x, y, w, h);
	g.restore();
}
var blurBgImg = null;
var blurBgCanvas = null;
function blurredCover(coverImg) {
	if (!coverImg || !coverImg.naturalWidth) return null;
	if (blurBgImg === coverImg && blurBgCanvas) return blurBgCanvas;
	let cur = document.createElement("canvas");
	cur.width = cur.height = 24;
	const cx = cur.getContext("2d");
	if (!cx) return null;
	cx.drawImage(coverImg, 0, 0, 24, 24);
	for (const n of [
		64,
		160,
		256
	]) {
		const nx = document.createElement("canvas");
		nx.width = nx.height = n;
		const nc = nx.getContext("2d");
		if (nc) {
			nc.imageSmoothingQuality = "high";
			nc.drawImage(cur, 0, 0, n, n);
		}
		cur = nx;
	}
	blurBgImg = coverImg;
	blurBgCanvas = cur;
	return cur;
}
function paintMetalBackground(g, W, H, radius, bg, fullBleed) {
	const silver = "#D3D6DC";
	const linear = g.createLinearGradient(0, 0, W, H);
	[
		[0, mixHex(bg, silver, .4)],
		[.3, mixHex(bg, silver, .1)],
		[.52, mixHex(bg, "#FFFFFF", .16)],
		[.76, mixHex(bg, "#000000", .1)],
		[1, mixHex(bg, "#000000", .24)]
	].forEach(([p, c]) => linear.addColorStop(p, c));
	const hx = W * .82;
	const hy = -H * .05;
	const radial = g.createRadialGradient(hx, hy, 0, hx, hy, W * .6);
	radial.addColorStop(0, "rgba(255,255,255,0.22)");
	radial.addColorStop(1, "rgba(255,255,255,0)");
	const bevel = g.createLinearGradient(0, 0, 0, H);
	bevel.addColorStop(0, "rgba(255,255,255,0.40)");
	bevel.addColorStop(.35, "rgba(255,255,255,0.06)");
	bevel.addColorStop(1, "rgba(255,255,255,0)");
	g.save();
	if (fullBleed) {
		g.beginPath();
		g.rect(0, 0, W, H);
	} else roundedRect(g, 0, 0, W, H, radius);
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
function paintBgStyle(g, layout, bgStyle, bg, fullBleed, coverImg) {
	const W = layout.w;
	const H = layout.h;
	g.save();
	if (fullBleed) {
		g.beginPath();
		g.rect(0, 0, W, H);
	} else roundedRect(g, 0, 0, W, H, layout.radius);
	g.clip();
	const bc = bgStyle === "blur" ? blurredCover(coverImg) : null;
	if (bc) {
		const k = Math.max(W, H) / 256;
		g.drawImage(bc, (W - 256 * k) / 2, (H - 256 * k) / 2, 256 * k, 256 * k);
		g.fillStyle = "rgba(0,0,0,0.3)";
		g.fillRect(0, 0, W, H);
	} else if (bgStyle === "pattern") {
		g.fillStyle = mixHex(bg, "#000000", .55);
		g.fillRect(0, 0, W, H);
		const pat = tilePattern(g, "bgdots", 40, (c, n) => {
			c.fillStyle = "rgba(255,255,255,0.16)";
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
		a.addColorStop(0, mixHex(bg, "#ffffff", .22));
		a.addColorStop(.55, bg);
		a.addColorStop(1, mixHex(bg, "#000000", .62));
		g.fillStyle = a;
		g.fillRect(0, 0, W, H);
	}
	g.restore();
}
function paintBackdrop(g, layout, theme, bg, P, bgStyle, cardDepth, fullBleed, coverImg) {
	if (bgStyle !== "none") {
		paintBgStyle(g, layout, bgStyle, bg, fullBleed, coverImg);
		return;
	}
	if (theme === "classic") {
		if (fullBleed && cardDepth > 0) {
			g.fillStyle = bg;
			g.fillRect(0, 0, layout.w, layout.h);
		}
		return;
	}
	if (!(fullBleed || theme === "cyberpunk" || theme === "glass" || theme === "neumorphism" || theme === "neon")) return;
	const W = layout.w;
	const H = layout.h;
	g.save();
	if (fullBleed) {
		g.beginPath();
		g.rect(0, 0, W, H);
	} else roundedRect(g, 0, 0, W, H, layout.radius);
	g.clip();
	if (theme === "glass") {
		const base = g.createLinearGradient(0, 0, W, H);
		base.addColorStop(0, mixHex(bg, "#000000", .35));
		base.addColorStop(1, mixHex(bg, "#000000", .72));
		const o1 = g.createRadialGradient(W * .2, H * .2, 0, W * .2, H * .2, W * .55);
		o1.addColorStop(0, rgba(mixHex(bg, "#ffffff", .12), .95));
		o1.addColorStop(1, rgba(bg, 0));
		const accent = mixHex(bg, "#00D4FF", .55);
		const o2 = g.createRadialGradient(W * .86, H * .86, 0, W * .86, H * .86, W * .5);
		o2.addColorStop(0, rgba(accent, .85));
		o2.addColorStop(1, rgba(accent, 0));
		g.fillStyle = base;
		g.fillRect(0, 0, W, H);
		g.fillStyle = o1;
		g.fillRect(0, 0, W, H);
		g.fillStyle = o2;
		g.fillRect(0, 0, W, H);
	} else {
		g.fillStyle = theme === "cyberpunk" || theme === "neon" ? "#0a0a0a" : theme === "neumorphism" ? P.surface : bg;
		g.fillRect(0, 0, W, H);
	}
	g.restore();
}
function paintCardBody(g, state, layout, P, tilt, fullBleed, unit = 1, fixedExtrude = false) {
	const W = layout.w;
	const H = layout.h;
	const theme = state.theme;
	const bg = state.color;
	const R = themeRadius(theme, layout.radius);
	const D = state.cardDepth;
	if (D > 0) extrudeWalls(g, (c, ox, oy) => roundedPath(c, ox, oy, W, H, R), D, tilt, bg, P.wall, theme, {
		x: 0,
		y: 0,
		w: W,
		h: H
	}, fixedExtrude);
	if (!paintSignatureBody(g, state, layout, P)) switch (theme) {
		case "brutalism":
			if (D === 0) {
				g.fillStyle = "#000000";
				g.fillRect(12, 12, W, H);
			}
			g.fillStyle = bg;
			g.fillRect(0, 0, W, H);
			g.strokeStyle = "#000000";
			g.lineWidth = 8;
			g.strokeRect(4, 4, W - 8, H - 8);
			break;
		case "cyberpunk":
			g.fillStyle = "#0a0a0a";
			roundedRect(g, 0, 0, W, H, R);
			g.fill();
			g.save();
			g.shadowColor = bg;
			g.shadowBlur = 15 * unit;
			g.strokeStyle = P.neon || "#00FFCC";
			g.lineWidth = 4;
			roundedRect(g, 2, 2, W - 4, H - 4, R - 2);
			g.stroke();
			g.stroke();
			g.restore();
			g.strokeStyle = rgba(P.neon || "#00FFCC", .22);
			g.lineWidth = 1.5;
			roundedRect(g, 14, 14, W - 28, H - 28, R - 12);
			g.stroke();
			break;
		case "glass": {
			const shine = g.createLinearGradient(0, 0, W, H);
			shine.addColorStop(0, "rgba(255,255,255,0.30)");
			shine.addColorStop(.32, "rgba(255,255,255,0.10)");
			shine.addColorStop(.5, "rgba(255,255,255,0)");
			shine.addColorStop(1, "rgba(255,255,255,0.05)");
			g.fillStyle = "rgba(255, 255, 255, 0.1)";
			roundedRect(g, 0, 0, W, H, R);
			g.fill();
			g.save();
			roundedRect(g, 0, 0, W, H, R);
			g.clip();
			g.fillStyle = shine;
			g.fillRect(0, 0, W, H);
			g.restore();
			const o = .75;
			g.lineWidth = 1.5;
			g.lineCap = "round";
			g.strokeStyle = "rgba(255,255,255,0.16)";
			roundedRect(g, o, o, W - 2 * o, H - 2 * o, R - o);
			g.stroke();
			g.strokeStyle = "rgba(255,255,255,0.85)";
			g.beginPath();
			g.moveTo(o, H - R);
			g.lineTo(o, R);
			g.arcTo(o, o, R, o, R - o);
			g.lineTo(W - R, o);
			g.stroke();
			g.strokeStyle = "rgba(0,0,0,0.30)";
			g.beginPath();
			g.moveTo(W - o, R);
			g.lineTo(W - o, H - R);
			g.arcTo(W - o, H - o, W - R, H - o, R - o);
			g.lineTo(R, H - o);
			g.stroke();
			g.lineCap = "butt";
			break;
		}
		case "clay": {
			const inner = g.createLinearGradient(0, 0, W, H);
			inner.addColorStop(0, mixHex(P.surface, "#ffffff", .6));
			inner.addColorStop(.6, mixHex(P.surface, "#ffffff", .12));
			inner.addColorStop(1, P.surface);
			const rim = g.createLinearGradient(0, 0, W, H);
			rim.addColorStop(0, "rgba(0,0,0,0)");
			rim.addColorStop(.5, "rgba(0,0,0,0)");
			rim.addColorStop(1, rgba(mixHex(bg, "#000000", .6), .32));
			g.save();
			g.shadowColor = rgba(mixHex(bg, "#000000", .55), .55);
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
		case "neumorphism":
			g.save();
			g.fillStyle = P.surface;
			roundedRect(g, 0, 0, W, H, R);
			g.shadowColor = "rgba(255,255,255,0.95)";
			g.shadowBlur = 26 * unit;
			g.shadowOffsetX = -13 * unit;
			g.shadowOffsetY = -13 * unit;
			g.fill();
			g.shadowColor = P.shadowDark || "rgba(0,0,0,0.4)";
			g.shadowOffsetX = 13 * unit;
			g.shadowOffsetY = 13 * unit;
			g.fill();
			g.restore();
			break;
		case "vinyl": {
			cardDrop(g, W, H, R, P.surface, 34, 16, unit);
			g.save();
			roundedRect(g, 0, 0, W, H, R);
			g.clip();
			const cx = W;
			const cy = H;
			const rr = Math.min(W, H) * .55;
			g.fillStyle = "#0a0a0a";
			g.beginPath();
			g.arc(cx, cy, rr, 0, 7);
			g.fill();
			g.lineWidth = 1.5;
			for (let r = rr * .36; r < rr - 6; r += 7) {
				g.strokeStyle = `rgba(255,255,255,${.03 + .035 * Math.abs(Math.sin(r * .7))})`;
				g.beginPath();
				g.arc(cx, cy, r, 0, 7);
				g.stroke();
			}
			g.fillStyle = "rgba(255,255,255,0.06)";
			for (const a of [-2.3, .84]) {
				g.beginPath();
				g.moveTo(cx, cy);
				g.arc(cx, cy, rr, a, a + .5);
				g.fill();
			}
			g.fillStyle = bg;
			g.beginPath();
			g.arc(cx, cy, rr * .3, 0, 7);
			g.fill();
			g.strokeStyle = "rgba(0,0,0,0.25)";
			g.lineWidth = 3;
			g.beginPath();
			g.arc(cx, cy, rr * .24, 0, 7);
			g.stroke();
			g.fillStyle = P.surface;
			g.beginPath();
			g.arc(cx, cy, 9, 0, 7);
			g.fill();
			g.restore();
			break;
		}
		case "ticket": {
			const st = cardFrame(layout, theme, state.hide.cover).stub || {
				v: false,
				at: H - 150,
				len: 150
			};
			const nr = 18;
			cardDrop(g, W, H, R, P.surface, 28, 14, unit);
			g.save();
			g.globalCompositeOperation = "destination-out";
			for (const [x, y] of st.v ? [[st.at, 0], [st.at, H]] : [[0, st.at], [W, st.at]]) {
				g.beginPath();
				g.arc(x, y, nr, 0, 7);
				g.fill();
			}
			g.restore();
			g.save();
			g.strokeStyle = rgba(P.text, .4);
			g.lineWidth = 3;
			g.lineCap = "round";
			g.setLineDash([1, 11]);
			g.beginPath();
			if (st.v) {
				g.moveTo(st.at, 34);
				g.lineTo(st.at, H - nr - 16);
			} else {
				g.moveTo(34, st.at);
				g.lineTo(W - nr - 16, st.at);
			}
			g.stroke();
			g.restore();
			g.save();
			g.strokeStyle = rgba(P.text, .32);
			g.lineWidth = 3;
			g.setLineDash([12, 9]);
			roundedRect(g, 26, 26, st.v ? st.at - 26 - 28 : W - 52, st.v ? H - 52 : st.at - 26 - 28, Math.max(4, R - 12));
			g.stroke();
			g.restore();
			drawStub(g, P, st, layout, state.title, state.artist);
			break;
		}
		case "polaroid": {
			cardDrop(g, W, H, R, P.surface, 30, 16, unit);
			const pg = g.createLinearGradient(0, 0, 0, H);
			pg.addColorStop(0, "rgba(255,255,255,0)");
			pg.addColorStop(1, "rgba(0,0,0,0.07)");
			g.fillStyle = pg;
			roundedRect(g, 0, 0, W, H, R);
			g.fill();
			g.strokeStyle = "rgba(0,0,0,0.08)";
			g.lineWidth = 2;
			roundedRect(g, 1, 1, W - 2, H - 2, R);
			g.stroke();
			g.save();
			g.translate(W / 2, 4);
			g.rotate(-.045);
			g.fillStyle = "rgba(255,226,150,0.78)";
			g.fillRect(-96, -22, 192, 50);
			g.fillStyle = "rgba(255,255,255,0.35)";
			g.fillRect(-96, -22, 192, 12);
			g.restore();
			break;
		}
		case "y2k": {
			cardDrop(g, W, H, R, P.surface, 34, 16, unit);
			const gr = g.createLinearGradient(0, 0, 0, H);
			gr.addColorStop(0, mixHex(bg, "#ffffff", .85));
			gr.addColorStop(.46, mixHex(bg, "#ffffff", .55));
			gr.addColorStop(.54, mixHex(bg, "#ffffff", .5));
			gr.addColorStop(1, mixHex(bg, "#ffffff", .78));
			g.fillStyle = gr;
			roundedRect(g, 0, 0, W, H, R);
			g.fill();
			g.save();
			roundedRect(g, 0, 0, W, H, R);
			g.clip();
			g.fillStyle = "rgba(255,255,255,0.35)";
			g.beginPath();
			g.ellipse(W * .4, -H * .12, W * .8, H * .3, 0, 0, 7);
			g.fill();
			sparkle(g, W * .9, H * .12, 34, "rgba(255,255,255,0.95)");
			sparkle(g, W * .82, H * .2, 16, "rgba(255,255,255,0.8)");
			sparkle(g, W * .1, H * .92, 26, "rgba(255,255,255,0.9)");
			g.restore();
			g.strokeStyle = "rgba(255,255,255,0.95)";
			g.lineWidth = 8;
			roundedRect(g, 4, 4, W - 8, H - 8, R - 4);
			g.stroke();
			g.strokeStyle = rgba(mixHex(bg, "#000000", .5), .45);
			g.lineWidth = 2;
			roundedRect(g, 10, 10, W - 20, H - 20, R - 10);
			g.stroke();
			break;
		}
		case "aurora":
			cardDrop(g, W, H, R, P.surface, 34, 16, unit);
			g.save();
			roundedRect(g, 0, 0, W, H, R);
			g.clip();
			for (const [x, y, k, c] of [
				[
					.12,
					.18,
					.75,
					bg
				],
				[
					.9,
					.38,
					.62,
					mixHex(bg, "#00D4FF", .6)
				],
				[
					.45,
					.98,
					.78,
					mixHex(bg, "#FF4FD8", .55)
				]
			]) {
				const rg = g.createRadialGradient(W * x, H * y, 0, W * x, H * y, Math.max(W, H) * k * .7);
				rg.addColorStop(0, rgba(c, .9));
				rg.addColorStop(1, rgba(c, 0));
				g.fillStyle = rg;
				g.fillRect(0, 0, W, H);
			}
			g.restore();
			g.strokeStyle = "rgba(255,255,255,0.14)";
			g.lineWidth = 2;
			roundedRect(g, 1, 1, W - 2, H - 2, R);
			g.stroke();
			break;
		case "pixel": {
			if (D === 0) {
				g.fillStyle = "#000000";
				g.fillRect(12, 12, W, H);
			}
			g.fillStyle = P.surface;
			g.fillRect(0, 0, W, H);
			const pat = tilePattern(g, "pxdots", 16, (c, n) => {
				c.fillStyle = "rgba(0,0,0,0.07)";
				c.fillRect(0, 0, n / 2, n / 2);
				c.fillRect(n / 2, n / 2, n / 2, n / 2);
			});
			if (pat) {
				g.fillStyle = pat;
				g.fillRect(0, 0, W, H);
			}
			g.fillStyle = bg;
			g.fillRect(0, 0, W, 44);
			g.fillStyle = "#000000";
			g.fillRect(0, 40, W, 6);
			for (let i = 0; i < 3; i++) {
				g.fillStyle = i === 0 ? "#ffffff" : "rgba(255,255,255,0.55)";
				g.fillRect(18 + i * 26, 14, 14, 14);
			}
			g.strokeStyle = "#000000";
			g.lineWidth = 8;
			g.strokeRect(4, 4, W - 8, H - 8);
			break;
		}
		case "notebook": {
			cardDrop(g, W, H, R, P.surface, 28, 14, unit);
			g.save();
			roundedRect(g, 0, 0, W, H, R);
			g.clip();
			g.strokeStyle = "rgba(70,120,200,0.26)";
			g.lineWidth = 2;
			for (let y = 60; y < H; y += 56) {
				g.beginPath();
				g.moveTo(0, y);
				g.lineTo(W, y);
				g.stroke();
			}
			const mx = Math.max(40, layout.pad - 28);
			g.strokeStyle = "rgba(220,70,70,0.5)";
			g.lineWidth = 3;
			g.beginPath();
			g.moveTo(mx, 0);
			g.lineTo(mx, H);
			g.stroke();
			for (const f of [
				.2,
				.5,
				.8
			]) {
				g.fillStyle = "rgba(0,0,0,0.16)";
				g.beginPath();
				g.arc(18, H * f, 11, 0, 7);
				g.fill();
				g.fillStyle = "rgba(0,0,0,0.12)";
				g.beginPath();
				g.arc(19, H * f + 2, 8, 0, 7);
				g.fill();
			}
			g.restore();
			break;
		}
		case "newspaper": {
			cardDrop(g, W, H, R, P.surface, 26, 12, unit);
			const pat = tilePattern(g, "halftone", 12, (c, n) => {
				c.fillStyle = "rgba(0,0,0,0.10)";
				c.beginPath();
				c.arc(n / 2, n / 2, 1.5, 0, 7);
				c.fill();
			});
			if (pat) {
				g.fillStyle = pat;
				roundedRect(g, 0, 0, W, H, R);
				g.fill();
			}
			g.strokeStyle = "rgba(22,22,22,0.85)";
			g.lineWidth = 4;
			g.strokeRect(22, 22, W - 44, H - 44);
			g.lineWidth = 1.5;
			g.strokeRect(31, 31, W - 62, H - 62);
			break;
		}
		case "sticker": {
			g.save();
			g.shadowColor = "rgba(0,0,0,0.4)";
			g.shadowBlur = 24 * unit;
			g.shadowOffsetX = 0;
			g.shadowOffsetY = 12 * unit;
			g.fillStyle = "#ffffff";
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
			sg.addColorStop(0, "rgba(255,255,255,0.22)");
			sg.addColorStop(.45, "rgba(255,255,255,0)");
			g.fillStyle = sg;
			g.fillRect(0, 0, W, H);
			const f = Math.min(W, H) * .13;
			g.save();
			g.shadowColor = "rgba(0,0,0,0.35)";
			g.shadowBlur = 14 * unit;
			g.shadowOffsetX = -4 * unit;
			g.shadowOffsetY = -4 * unit;
			g.fillStyle = mixHex(bg, "#ffffff", .8);
			g.beginPath();
			g.moveTo(W - f, H + 2);
			g.lineTo(W + 2, H - f);
			g.lineTo(W - f * .2, H - f * .2);
			g.closePath();
			g.fill();
			g.restore();
			g.restore();
			break;
		}
		case "holo": {
			cardDrop(g, W, H, R, P.surface, 34, 16, unit);
			g.save();
			roundedRect(g, 0, 0, W, H, R);
			g.clip();
			const hsl = (h, a) => `hsla(${h},95%,62%,${a})`;
			const fo = g.createLinearGradient(0, 0, W, H);
			[
				0,
				60,
				130,
				190,
				250,
				310,
				360
			].forEach((h, i, a) => fo.addColorStop(i / (a.length - 1), hsl(h, .95)));
			g.fillStyle = fo;
			g.fillRect(0, 0, W, H);
			g.fillStyle = P.surface;
			roundedRect(g, 20, 20, W - 40, H - 40, Math.max(6, R - 14));
			g.fill();
			const sh = g.createLinearGradient(0, H, W, 0);
			[
				0,
				90,
				180,
				270,
				330
			].forEach((h, i, a) => sh.addColorStop(i / (a.length - 1), hsl(h, .16)));
			g.fillStyle = sh;
			roundedRect(g, 20, 20, W - 40, H - 40, Math.max(6, R - 14));
			g.fill();
			sparkle(g, W * .93, H * .07, 20, "rgba(255,255,255,0.9)");
			sparkle(g, W * .87, H * .12, 10, "rgba(255,255,255,0.7)");
			sparkle(g, W * .07, H * .955, 14, "rgba(255,255,255,0.8)");
			g.restore();
			g.strokeStyle = "rgba(255,255,255,0.55)";
			g.lineWidth = 2;
			roundedRect(g, 1, 1, W - 2, H - 2, R);
			g.stroke();
			break;
		}
		case "wrapped": {
			cardDrop(g, W, H, R, bg, 34, 16, unit);
			g.save();
			roundedRect(g, 0, 0, W, H, R);
			g.clip();
			const wg = g.createLinearGradient(0, 0, W, H);
			const m = Math.min(W, H);
			wg.addColorStop(0, mixHex(bg, "#ffffff", .18));
			wg.addColorStop(.55, bg);
			wg.addColorStop(1, mixHex(bg, "#7358FF", .5));
			g.fillStyle = wg;
			g.fillRect(0, 0, W, H);
			g.fillStyle = "rgba(255,255,255,0.10)";
			g.beginPath();
			g.arc(W * .92, H * .12, m * .34, 0, 7);
			g.fill();
			g.fillStyle = "rgba(0,0,0,0.10)";
			g.beginPath();
			g.arc(W * .02, H * .98, m * .42, 0, 7);
			g.fill();
			g.strokeStyle = "rgba(255,255,255,0.14)";
			g.lineWidth = m * .05;
			g.beginPath();
			g.arc(W * .8, H * .9, m * .3, 0, 7);
			g.stroke();
			g.fillStyle = rgba(P.text, .5);
			roundedRect(g, W / 2 - 70, H - 20, 140, 6, 3);
			g.fill();
			g.restore();
			break;
		}
		case "cassette": {
			cardDrop(g, W, H, R, P.surface, 30, 14, unit);
			g.save();
			roundedRect(g, 0, 0, W, H, R);
			g.clip();
			[
				bg,
				mixHex(bg, "#ffffff", .4),
				mixHex(bg, "#000000", .3),
				bg
			].forEach((c, i) => {
				g.fillStyle = c;
				g.fillRect(0, i * 8, W, 8);
			});
			const bh = 46;
			g.fillStyle = mixHex(P.surface, "#000000", .22);
			g.beginPath();
			g.moveTo(W * .12, H);
			g.lineTo(W * .17, H - bh);
			g.lineTo(W * .83, H - bh);
			g.lineTo(W * .88, H);
			g.closePath();
			g.fill();
			g.fillStyle = rgba(P.text, .55);
			for (const x of [.3, .7]) {
				g.beginPath();
				g.arc(W * x, H - bh * .45, 10, 0, 7);
				g.fill();
			}
			g.strokeStyle = "rgba(0,0,0,0.3)";
			g.lineWidth = 2;
			for (const [x, y] of [
				[24, 54],
				[W - 24, 54],
				[24, H - 24],
				[W - 24, H - 24]
			]) {
				g.fillStyle = "rgba(0,0,0,0.16)";
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
		case "receipt": {
			const n = Math.round(W / 22);
			const tw = W / n;
			const tt = 10;
			const zig = (c) => {
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
			g.shadowColor = "rgba(0,0,0,0.4)";
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
			sg.addColorStop(0, "rgba(0,0,0,0.05)");
			sg.addColorStop(.5, "rgba(255,255,255,0.35)");
			sg.addColorStop(1, "rgba(0,0,0,0.05)");
			g.fillStyle = sg;
			g.fillRect(0, 0, W, H);
			g.strokeStyle = rgba(P.text, .4);
			g.lineWidth = 3;
			g.setLineDash([10, 8]);
			const ry = layout.pad + layout.cover + layout.lyricGap / 2;
			g.beginPath();
			g.moveTo(layout.pad, ry);
			g.lineTo(W - layout.pad, ry);
			g.stroke();
			g.setLineDash([]);
			g.fillStyle = rgba(P.text, .5);
			g.font = `600 22px 'Courier New', monospace`;
			letterSpacing(g, 2);
			g.textAlign = "center";
			g.textBaseline = "alphabetic";
			g.fillText("*** THANK YOU ***", W / 2, H - 30);
			g.textAlign = "left";
			letterSpacing(g, 0);
			g.restore();
			break;
		}
		case "gameboy": {
			cardDrop(g, W, H, R, "#C9C6BB", 30, 14, unit);
			g.save();
			roundedRect(g, 0, 0, W, H, R);
			g.clip();
			g.fillStyle = "#5B5D74";
			roundedRect(g, 14, 14, W - 28, H - 28, 14);
			g.fill();
			g.fillStyle = P.surface;
			roundedRect(g, 30, 30, W - 60, H - 60, 6);
			g.fill();
			const pat = tilePattern(g, "lcd", 6, (c, k) => {
				c.fillStyle = "rgba(15,56,15,0.10)";
				c.fillRect(0, 0, k, 1);
				c.fillRect(0, 0, 1, k);
			});
			if (pat) {
				g.fillStyle = pat;
				roundedRect(g, 30, 30, W - 60, H - 60, 6);
				g.fill();
			}
			g.fillStyle = "#D33A4A";
			g.beginPath();
			g.arc(22, H / 2, 3.5, 0, 7);
			g.fill();
			g.restore();
			break;
		}
		case "stained": {
			cardDrop(g, W, H, R, "#0c0c10", 30, 14, unit);
			g.save();
			roundedRect(g, 0, 0, W, H, R);
			g.clip();
			const cols = 5;
			const rows = Math.max(4, Math.round(cols * H / W));
			const cw = W / cols;
			const rh = H / rows;
			let sd = 7;
			const rnd = () => (sd = sd * 16807 % 2147483647) / 2147483647;
			const pts = [];
			for (let j = 0; j <= rows; j++) {
				pts.push([]);
				for (let i = 0; i <= cols; i++) {
					const jx = (rnd() - .5) * cw * .55;
					const jy = (rnd() - .5) * rh * .55;
					pts[j].push([i * cw + (i % cols ? jx : 0), j * rh + (j % rows ? jy : 0)]);
				}
			}
			const cs = [
				bg,
				mixHex(bg, "#E8115B", .5),
				mixHex(bg, "#F5B700", .55),
				mixHex(bg, "#1DB9D6", .55),
				mixHex(bg, "#7358FF", .55)
			];
			const quad = (j, i) => {
				g.beginPath();
				[
					pts[j][i],
					pts[j][i + 1],
					pts[j + 1][i + 1],
					pts[j + 1][i]
				].forEach((q, k) => k ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]));
				g.closePath();
			};
			for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
				g.fillStyle = mixHex(cs[Math.floor(rnd() * cs.length)], "#000000", .5);
				quad(j, i);
				g.fill();
			}
			const lg = g.createRadialGradient(W / 2, H * .4, 0, W / 2, H * .4, Math.max(W, H) * .7);
			lg.addColorStop(0, "rgba(255,255,255,0.18)");
			lg.addColorStop(1, "rgba(255,255,255,0)");
			g.fillStyle = lg;
			g.fillRect(0, 0, W, H);
			g.strokeStyle = "#07070a";
			g.lineWidth = 7;
			g.lineJoin = "round";
			for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
				quad(j, i);
				g.stroke();
			}
			g.lineWidth = 18;
			roundedRect(g, 0, 0, W, H, R);
			g.stroke();
			g.restore();
			break;
		}
		case "neon": {
			cardDrop(g, W, H, R, P.surface, 30, 14, unit);
			g.save();
			roundedRect(g, 0, 0, W, H, R);
			g.clip();
			const pat = tilePattern(g, "brick", 64, (c, k) => {
				c.fillStyle = "rgba(255,255,255,0.07)";
				c.fillRect(0, 0, k, 2);
				c.fillRect(0, k / 2, k, 2);
				c.fillRect(0, 0, 2, k / 2);
				c.fillRect(k / 2, k / 2, 2, k / 2);
			});
			if (pat) {
				g.fillStyle = pat;
				g.fillRect(0, 0, W, H);
			}
			const wg = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * .65);
			wg.addColorStop(0, rgba(bg, .2));
			wg.addColorStop(1, rgba(bg, 0));
			g.fillStyle = wg;
			g.fillRect(0, 0, W, H);
			g.restore();
			const per = 2 * (W + H);
			const tube = (ins, lw, col, blur) => {
				g.save();
				g.shadowColor = bg;
				g.shadowBlur = blur * unit;
				g.strokeStyle = col;
				g.lineWidth = lw;
				g.lineCap = "round";
				g.setLineDash([per - 70, 70]);
				roundedRect(g, ins, ins, W - 2 * ins, H - 2 * ins, Math.max(6, R - ins));
				g.stroke();
				g.stroke();
				g.restore();
			};
			tube(18, 7, P.neon || "#00FFCC", 26);
			tube(34, 3, rgba(P.neon || "#00FFCC", .7), 14);
			tube(18, 2, mixHex(P.neon || "#00FFCC", "#ffffff", .75), 0);
			break;
		}
		case "comic": {
			if (D === 0) {
				g.fillStyle = "#111111";
				g.fillRect(14, 14, W, H);
			}
			g.fillStyle = P.surface;
			g.fillRect(0, 0, W, H);
			g.save();
			g.beginPath();
			g.rect(0, 0, W, H);
			g.clip();
			g.fillStyle = mixHex(bg, "#ffffff", .15);
			g.beginPath();
			const reach = Math.min(W, H) * .9;
			const st = 26;
			for (let y = 0; y < H; y += st) for (let x = 0; x < W; x += st) {
				const d = Math.hypot(W - x, H - y) / reach;
				if (d >= 1) continue;
				const rr = 9 * (1 - d);
				g.moveTo(x + rr, y);
				g.arc(x, y, rr, 0, 7);
			}
			g.fill();
			g.fillStyle = "#FFD60A";
			g.strokeStyle = "#111111";
			g.lineWidth = 5;
			g.lineJoin = "miter";
			g.beginPath();
			for (let i = 0; i < 24; i++) {
				const a = i * Math.PI / 12;
				const r = i % 2 ? 24 : 46;
				g[i ? "lineTo" : "moveTo"](W - 34 + Math.cos(a) * r, 34 + Math.sin(a) * r);
			}
			g.closePath();
			g.fill();
			g.stroke();
			g.restore();
			g.strokeStyle = "#111111";
			g.lineWidth = 10;
			g.strokeRect(5, 5, W - 10, H - 10);
			break;
		}
		default: {
			const bleed = fullBleed && D === 0;
			if (state.layoutKey === "wide") paintMetalBackground(g, W, H, layout.radius, bg, bleed);
			else {
				g.fillStyle = bg;
				if (bleed) g.fillRect(0, 0, W, H);
				else {
					roundedRect(g, 0, 0, W, H, layout.radius);
					g.fill();
				}
			}
		}
	}
}
function themeFinish(g, theme, bg, P, layout) {
	const W = layout.w;
	const H = layout.h;
	const R = themeRadius(theme, layout.radius);
	const m = Math.min(W, H);
	const clipCard = () => {
		g.save();
		roundedRect(g, 0, 0, W, H, R);
		g.clip();
	};
	const grain = (a) => {
		const pat = tilePattern(g, "grain" + a, 96, (c, n) => {
			for (let i = 0; i < 520; i++) {
				c.fillStyle = Math.random() < .5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
				c.fillRect(Math.random() * n, Math.random() * n, 1.4, 1.4);
			}
		});
		if (pat) {
			g.fillStyle = pat;
			g.fillRect(0, 0, W, H);
		}
	};
	const topLight = (a, h = .55) => {
		const l = g.createLinearGradient(0, 0, 0, H * h);
		l.addColorStop(0, `rgba(255,255,255,${a})`);
		l.addColorStop(1, "rgba(255,255,255,0)");
		g.fillStyle = l;
		g.fillRect(0, 0, W, H);
	};
	const vignette = (a) => {
		const v = g.createRadialGradient(W / 2, H / 2, m * .35, W / 2, H / 2, Math.max(W, H) * .78);
		v.addColorStop(0, "rgba(0,0,0,0)");
		v.addColorStop(1, `rgba(0,0,0,${a})`);
		g.fillStyle = v;
		g.fillRect(0, 0, W, H);
	};
	switch (theme) {
		case "classic":
			clipCard();
			topLight(.1);
			grain(.035);
			g.restore();
			break;
		case "brutalism":
			g.save();
			g.beginPath();
			g.rect(10, H - 36, W - 20, 26);
			g.clip();
			g.strokeStyle = "#000";
			g.lineWidth = 6;
			for (let x = -40; x < W + 40; x += 22) {
				g.beginPath();
				g.moveTo(x, H - 8);
				g.lineTo(x + 26, H - 40);
				g.stroke();
			}
			g.restore();
			g.strokeStyle = "#000";
			g.lineWidth = 3;
			g.strokeRect(20, 20, W - 40, H - 40);
			break;
		case "cyberpunk":
			clipCard();
			g.strokeStyle = rgba(P.neon || "#00FFCC", .07);
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
			g.fillStyle = "rgba(0,0,0,0.22)";
			for (let y = 0; y < H; y += 6) g.fillRect(0, y, W, 2);
			vignette(.45);
			g.restore();
			g.save();
			g.shadowColor = P.neon || "#00FFCC";
			g.shadowBlur = 12;
			g.strokeStyle = P.neon || "#00FFCC";
			g.lineWidth = 5;
			g.lineCap = "square";
			for (const [x, y, sx, sy] of [
				[
					30,
					30,
					1,
					1
				],
				[
					W - 30,
					30,
					-1,
					1
				],
				[
					30,
					H - 30,
					1,
					-1
				],
				[
					W - 30,
					H - 30,
					-1,
					-1
				]
			]) {
				g.beginPath();
				g.moveTo(x, y + sy * 46);
				g.lineTo(x, y);
				g.lineTo(x + sx * 46, y);
				g.stroke();
			}
			g.restore();
			break;
		case "glass":
			clipCard();
			topLight(.14, .4);
			grain(.03);
			g.fillStyle = "rgba(255,255,255,0.18)";
			g.beginPath();
			g.ellipse(W * .5, -H * .38, W * .9, H * .55, 0, 0, 7);
			g.fill();
			g.restore();
			break;
		case "clay":
			clipCard();
			grain(.03);
			g.fillStyle = "rgba(255,255,255,0.55)";
			g.beginPath();
			g.ellipse(W * .2, H * .1, m * .1, m * .045, -.5, 0, 7);
			g.fill();
			g.restore();
			break;
		case "neumorphism":
			clipCard();
			grain(.025);
			g.restore();
			break;
		case "vinyl":
			clipCard();
			topLight(.07);
			g.restore();
			break;
		case "ticket":
			clipCard();
			grain(.05);
			g.restore();
			break;
		case "polaroid":
			clipCard();
			grain(.04);
			vignette(.07);
			g.restore();
			break;
		case "y2k":
			clipCard();
			g.strokeStyle = "rgba(255,255,255,0.18)";
			g.lineWidth = 2;
			for (let i = -H; i < W; i += 36) {
				g.beginPath();
				g.moveTo(i, H);
				g.lineTo(i + H, 0);
				g.stroke();
			}
			g.restore();
			break;
		case "aurora":
			clipCard();
			grain(.045);
			vignette(.35);
			const starPat = tilePattern(g, "stars", 160, (c, n) => {
				for (let i = 0; i < 14; i++) {
					c.fillStyle = `rgba(255,255,255,${.25 + Math.random() * .5})`;
					c.beginPath();
					c.arc(Math.random() * n, Math.random() * n, Math.random() * 1.4 + .4, 0, 7);
					c.fill();
				}
			});
			if (starPat) {
				g.fillStyle = starPat;
				g.fillRect(0, 0, W, H);
			}
			g.restore();
			break;
		case "pixel":
			g.fillStyle = "rgba(255,255,255,0.35)";
			g.fillRect(8, 48, W - 16, 4);
			g.fillStyle = "rgba(0,0,0,0.18)";
			g.fillRect(8, H - 14, W - 16, 6);
			break;
		case "notebook":
			clipCard();
			grain(.04);
			vignette(.08);
			g.restore();
			break;
		case "newspaper":
			clipCard();
			grain(.06);
			vignette(.14);
			g.restore();
			break;
		case "sticker":
			clipCard();
			g.strokeStyle = "rgba(255,255,255,0.35)";
			g.lineWidth = 3;
			roundedRect(g, 10, 10, W - 20, H - 20, Math.max(6, R - 10));
			g.stroke();
			g.restore();
			break;
		case "holo":
			clipCard();
			g.globalCompositeOperation = "overlay";
			const hg = g.createLinearGradient(0, 0, W, H);
			[
				"#ff4fd8",
				"#4fe3ff",
				"#fff36b",
				"#6bff9e",
				"#ff4fd8"
			].forEach((c, i, a) => hg.addColorStop(i / (a.length - 1), c));
			g.fillStyle = hg;
			g.globalAlpha = .35;
			g.fillRect(0, 0, W, H);
			g.restore();
			break;
		case "wrapped":
			clipCard();
			grain(.035);
			topLight(.1);
			g.restore();
			break;
		case "cassette":
			clipCard();
			grain(.04);
			topLight(.08);
			g.restore();
			break;
		case "receipt":
			g.save();
			g.globalAlpha = 1;
			const rpat = tilePattern(g, "paperfx", 96, (c, n) => {
				for (let i = 0; i < 380; i++) {
					c.fillStyle = `rgba(0,0,0,${.02 + Math.random() * .03})`;
					c.fillRect(Math.random() * n, Math.random() * n, 1.3, 1.3);
				}
			});
			if (rpat) {
				g.fillStyle = rpat;
				g.fillRect(0, 12, W, H - 24);
			}
			g.restore();
			break;
		case "gameboy":
			clipCard();
			topLight(.08);
			g.restore();
			break;
		case "stained":
			clipCard();
			vignette(.35);
			g.restore();
			break;
		case "neon":
			clipCard();
			vignette(.4);
			grain(.03);
			g.restore();
			break;
		case "comic":
			clipCard();
			grain(.03);
			g.restore();
	}
}
function paintGlare(g, state, layout, tilt, fixedExtrude = false) {
	if (state.glareStyle === "none" || state.glare <= 0) return;
	const geo = cardGeom(state.layoutKey, state.theme, state.cardDepth, state.bgStyle, tilt, fixedExtrude);
	g.save();
	roundedRect(g, geo.x, geo.y, geo.w, geo.h, geo.r);
	g.clip();
	g.globalCompositeOperation = "overlay";
	g.globalAlpha = state.glare / 100;
	if (state.glareStyle === "spotlight" || state.glareStyle === "follow") {
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
		g.fillRect((geo.x - px) / rx, (geo.y - py) / ry, geo.w / rx, geo.h / ry);
	} else {
		const L = GLARE.lin[state.glareStyle] || GLARE;
		const a = L.angle * Math.PI / 180;
		const dx = Math.sin(a);
		const dy = -Math.cos(a);
		const half = (Math.abs(geo.w * Math.sin(a)) + Math.abs(geo.h * Math.cos(a))) / 2;
		const cx = geo.x + geo.w / 2;
		const cy = geo.y + geo.h / 2;
		const grad = g.createLinearGradient(cx - dx * half, cy - dy * half, cx + dx * half, cy + dy * half);
		for (const [p, color] of L.stops) grad.addColorStop(p, color);
		g.fillStyle = grad;
		g.fillRect(geo.x, geo.y, geo.w, geo.h);
	}
	g.restore();
}
function renderCard(g, state, layout, coverImg, tilt, { fullBleed = false, flat = false, onCodeLoad = () => {} } = {}) {
	const theme = state.theme;
	const bg = state.color;
	const P = getPalette(theme, bg);
	const geo = cardGeom(state.layoutKey, theme, state.cardDepth, state.bgStyle, tilt, flat);
	const unit = (g.getTransform ? g.getTransform().a : 1) * geo.s;
	g.clearRect(0, 0, layout.w, layout.h);
	paintBackdrop(g, layout, theme, bg, P, state.bgStyle, state.cardDepth, fullBleed, coverImg);
	g.save();
	g.translate(geo.x, geo.y);
	g.scale(geo.s, geo.s);
	paintCardBody(g, state, layout, P, tilt, fullBleed && state.bgStyle === "none", unit, flat);
	themeFinish(g, theme, bg, P, layout);
	if (!state.hide.cover) drawCover(g, state, layout, P, coverImg, tilt, unit, flat);
	if (!(state.hide.title && state.hide.artist)) drawHeader(g, state, layout, P, tilt, unit, flat);
	const info = drawLyrics(g, state, layout, P, tilt, unit, flat);
	if (!state.hide.bar) drawProgress(g, layout, P, unit);
	if (!state.hide.logo) drawFooter(g, state, layout, P, tilt, unit, flat);
	if (!state.hide.code) drawCode(g, state, layout, P, onCodeLoad);
	overlaySignature(g, theme, layout);
	g.restore();
	g.shadowColor = "rgba(0,0,0,0)";
	g.shadowBlur = 0;
	return info;
}
var LayoutSection = ({ state, onChange, onToast }) => {
	const lyricParas = parseLyrics(state.lyrics);
	const toggleHide = (key) => {
		if (key === "code" && state.hide.code && !state.trackId) {
			onToast("Paste a Spotify track link under Search first. The Spotify Code needs a track ID.");
			return;
		}
		onChange({ hide: {
			...state.hide,
			[key]: !state.hide[key]
		} });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs font-bold uppercase tracking-wider text-[#1db954]",
				children: "Layout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-medium text-[#b3b3b3]",
					children: "Lyric Alignment"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2 p-1 bg-[#202020] border border-[#333333] rounded-xl",
					children: [
						"left",
						"center",
						"right"
					].map((align) => {
						const isSelected = state.align === align;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onChange({ align }),
							className: `flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium capitalize transition-all ${isSelected ? "bg-[#1db954] text-black font-semibold shadow-sm" : "text-[#a0a0a0] hover:text-white hover:bg-white/5"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: align })]
						}, align);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-medium text-[#b3b3b3]",
					children: "Show on Card"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						{
							key: "cover",
							label: "Cover art"
						},
						{
							key: "title",
							label: "Song title"
						},
						{
							key: "artist",
							label: "Artist"
						},
						{
							key: "logo",
							label: "Spotify logo"
						},
						{
							key: "bar",
							label: "Progress bar"
						},
						{
							key: "code",
							label: "Spotify Code"
						}
					].map(({ key, label }) => {
						const isVisible = !state.hide[key];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => toggleHide(key),
							className: `px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isVisible ? "bg-[#1db954]/15 border-[#1db954] text-white shadow-sm" : "bg-[#222222] border-[#333333] text-[#707070] hover:text-[#a0a0a0]"}`,
							children: label
						}, key);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5 pt-2 border-t border-[#262626]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-[#b3b3b3]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Card Depth (Volumetric Extrusion)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-white font-medium",
							children: [state.cardDepth, " px"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 40,
						value: state.cardDepth,
						onChange: (e) => onChange({ cardDepth: parseInt(e.target.value, 10) }),
						className: "w-full accent-[#1db954] cursor-pointer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-[#808080]",
						children: "Extrudes the card, cover art, text, and logo along real-time 3D tilt vectors."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#262626]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-[#b3b3b3]",
						children: "Glare Style"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: state.glareAuto ? "auto" : state.glareStyle,
						onChange: (e) => {
							const val = e.target.value;
							if (val === "auto") onChange({ glareAuto: true });
							else onChange({
								glareAuto: false,
								glareStyle: val
							});
						},
						className: "w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#1db954]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "auto",
								children: "Auto (Theme default)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "diagonal",
								children: "Diagonal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "spotlight",
								children: "Spotlight"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "follow",
								children: "Cursor follow"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "holo",
								children: "Holographic"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "gloss",
								children: "Frosted gloss"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "sweep",
								children: "Sweep"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "none",
								children: "None"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-[#b3b3b3]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Glare Intensity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-white",
							children: [state.glare, "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 100,
						value: state.glare,
						onChange: (e) => onChange({ glare: parseInt(e.target.value, 10) }),
						className: "w-full accent-[#1db954] cursor-pointer"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#262626]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-[#b3b3b3]",
						children: "Cover Shape"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: state.hide.cover ? "hidden" : state.coverShape,
						onChange: (e) => {
							const val = e.target.value;
							if (val === "hidden") onChange({ hide: {
								...state.hide,
								cover: true
							} });
							else onChange({
								coverShape: val,
								hide: {
									...state.hide,
									cover: false
								}
							});
						},
						className: "w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#1db954]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "auto",
								children: "Theme default"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "square",
								children: "Square"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "rounded",
								children: "Rounded"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "circle",
								children: "Circle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "hidden",
								children: "Hidden"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-[#b3b3b3]",
						children: "Lyric Font"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: state.lyricFont,
						onChange: (e) => onChange({ lyricFont: e.target.value }),
						className: "w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#1db954]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "auto",
							children: "Theme default"
						}), Object.entries(LYRIC_FONTS).map(([k, font]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: font.label
						}, k))]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5 pt-2 border-t border-[#262626]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-[#b3b3b3]",
						children: "Highlight a Line"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: state.hlLine,
						onChange: (e) => onChange({ hlLine: parseInt(e.target.value, 10) }),
						className: "w-full px-3 py-2 bg-[#242424] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#1db954]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "-1",
							children: "Off (All lines active)"
						}), lyricParas.map((words, idx) => {
							if (!words) return null;
							const text = words.join(" ");
							const preview = text.length > 36 ? text.slice(0, 35) + "…" : text;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: idx,
								children: [
									idx + 1,
									". ",
									preview
								]
							}, idx);
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-[#808080]",
						children: "Emphasizes one line and softens the others (Spotify karaoke style)."
					})
				]
			})
		]
	});
};
var LS_KEY = "lyric-card-settings-v1";
var RECENT_KEY = "lyric-card-recent-v1";
var LOOKS_KEY = "lyric-card-looks-v1";
function saveSettings(state) {
	try {
		localStorage.setItem(LS_KEY, JSON.stringify({
			color: state.color,
			theme: state.theme,
			align: state.align,
			fmt: state.fmt,
			glare: state.glare,
			glareStyle: state.glareStyle,
			cardDepth: state.cardDepth,
			hide: state.hide,
			autoFit: state.autoFit,
			size: state.lyricSize,
			scale: state.scale,
			coverShape: state.coverShape,
			lyricFont: state.lyricFont,
			bgStyle: state.bgStyle,
			glareAuto: state.glareAuto,
			autoColor: state.autoColor,
			layoutKey: state.layoutKey
		}));
	} catch (e) {}
}
function loadSettings() {
	try {
		const d = JSON.parse(localStorage.getItem("lyric-card-settings-v1") || "null");
		if (!d) return {};
		return d;
	} catch (e) {
		return {};
	}
}
function getRecentSearches() {
	try {
		const a = JSON.parse(localStorage.getItem("lyric-card-recent-v1") || "[]");
		return Array.isArray(a) ? a.filter((x) => typeof x === "string").slice(0, 6) : [];
	} catch (e) {
		return [];
	}
}
function addRecentSearch(q) {
	if (!q.trim()) return getRecentSearches();
	const current = getRecentSearches();
	const next = [q.trim(), ...current.filter((x) => x.toLowerCase() !== q.trim().toLowerCase())].slice(0, 6);
	try {
		localStorage.setItem(RECENT_KEY, JSON.stringify(next));
	} catch (e) {}
	return next;
}
function clearRecentSearches() {
	try {
		localStorage.removeItem(RECENT_KEY);
	} catch (e) {}
	return [];
}
function getSavedLooks() {
	try {
		const a = JSON.parse(localStorage.getItem("lyric-card-looks-v1") || "[]");
		return Array.isArray(a) ? a.filter((x) => x && typeof x.name === "string" && x.look).slice(0, 12) : [];
	} catch (e) {
		return [];
	}
}
function saveLook(name, look) {
	const filtered = getSavedLooks().filter((p) => p.name.toLowerCase() !== name.toLowerCase());
	const next = [{
		name,
		look
	}, ...filtered].slice(0, 12);
	try {
		localStorage.setItem(LOOKS_KEY, JSON.stringify(next));
	} catch (e) {}
	return next;
}
function deleteLook(index) {
	const current = getSavedLooks();
	current.splice(index, 1);
	try {
		localStorage.setItem(LOOKS_KEY, JSON.stringify(current));
	} catch (e) {}
	return current;
}
function encodeLookHash(obj) {
	return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decodeLookHash(hash) {
	return JSON.parse(decodeURIComponent(escape(atob(hash.replace(/-/g, "+").replace(/_/g, "/")))));
}
var LooksSection = ({ state, onApplyLook, onToast }) => {
	const [looks, setLooks] = (0, import_react.useState)([]);
	const [lookName, setLookName] = (0, import_react.useState)("");
	const [copiedLink, setCopiedLink] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setLooks(getSavedLooks());
	}, []);
	const handleSaveLook = (e) => {
		e.preventDefault();
		const name = lookName.trim().slice(0, 24) || `Look ${looks.length + 1}`;
		const next = saveLook(name, {
			t: state.theme,
			c: state.color,
			g: state.glareAuto ? "auto" : state.glareStyle,
			gi: state.glare,
			l: state.layoutKey,
			cs: state.hide.cover ? "hidden" : state.coverShape,
			lf: state.lyricFont,
			bg: state.bgStyle,
			d: state.cardDepth,
			a: state.align,
			ac: state.autoColor
		});
		setLooks(next);
		setLookName("");
		onToast(`Saved look "${name}"`);
	};
	const handleDeleteLook = (index, name) => {
		const next = deleteLook(index);
		setLooks(next);
		onToast(`Deleted "${name}"`);
	};
	const handleCopyLink = async () => {
		const lookData = {
			t: state.theme,
			c: state.color,
			g: state.glareAuto ? "auto" : state.glareStyle,
			gi: state.glare,
			l: state.layoutKey,
			cs: state.hide.cover ? "hidden" : state.coverShape,
			lf: state.lyricFont,
			bg: state.bgStyle,
			d: state.cardDepth,
			a: state.align,
			ac: state.autoColor,
			ti: state.title.slice(0, 80),
			ar: state.artist.slice(0, 80),
			ly: state.lyrics.slice(0, 700)
		};
		if (state.coverUrl && /^https:\/\/[^?#\s]{1,300}$/i.test(state.coverUrl.trim())) lookData.cu = state.coverUrl.trim();
		const hashStr = "#look=" + encodeLookHash(lookData);
		const fullUrl = window.location.href.split("#")[0] + hashStr;
		try {
			await navigator.clipboard.writeText(fullUrl);
			setCopiedLink(true);
			window.history.replaceState(null, "", hashStr);
			onToast("Shareable link copied to clipboard!");
			setTimeout(() => setCopiedLink(false), 2500);
		} catch (e) {
			onToast("Could not access clipboard. Copy from browser address bar.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs font-bold uppercase tracking-wider text-[#1db954]",
				children: "Looks"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-[#b3b3b3]",
						children: "Backdrop Behind Card"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: state.bgStyle,
						onChange: (e) => onApplyLook({
							...state,
							bg: e.target.value,
							t: state.theme,
							c: state.color,
							g: state.glareStyle,
							gi: state.glare,
							l: state.layoutKey,
							cs: state.coverShape,
							lf: state.lyricFont,
							d: state.cardDepth,
							a: state.align,
							ac: state.autoColor
						}),
						className: "w-full px-3.5 py-2.5 bg-[#242424] border border-[#333333] rounded-xl text-xs text-white outline-none focus:border-[#1db954]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "none",
								children: "None (Direct background)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "blur",
								children: "Blurred album cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "gradient",
								children: "Atmospheric gradient"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "pattern",
								children: "Dot pattern matrix"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-[#808080]",
						children: "Inlays the card into an ambient canvas backdrop for wallpapers and social posts."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveLook,
				className: "space-y-2 pt-2 border-t border-[#262626]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-[#b3b3b3]",
						children: "Save Current Look"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: lookName,
							onChange: (e) => setLookName(e.target.value),
							maxLength: 24,
							placeholder: "Name this look, e.g. Night Drive",
							className: "flex-1 px-3 py-2 bg-[#242424] border border-[#333333] rounded-xl text-xs text-white placeholder-[#707070] outline-none focus:border-[#1db954]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "flex items-center gap-1.5 px-4 py-2 bg-[#1db954] hover:bg-[#1ed760] text-black font-semibold text-xs rounded-xl transition-all active:scale-95 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-[#808080]",
						children: "Saves theme, colors, depth, lighting, typography, and card geometry."
					}),
					looks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2 pt-2",
						children: looks.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 px-2.5 py-1 bg-[#222222] border border-[#383838] rounded-full text-xs text-[#d0d0d0] hover:border-[#1db954] transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									onApplyLook(item.look);
									onToast(`Applied look "${item.name}"`);
								},
								className: "hover:text-white font-medium",
								children: item.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleDeleteLook(idx, item.name),
								"aria-label": `Delete look ${item.name}`,
								className: "text-[#707070] hover:text-[#ff7b7b] transition-colors p-0.5 ml-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3 h-3" })
							})]
						}, idx))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-2 border-t border-[#262626] space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-[#b3b3b3]",
						children: "Shareable Link"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleCopyLink,
						className: "w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-[#383838] hover:border-white/20 rounded-xl text-xs font-semibold text-white transition-all active:scale-98 shadow-sm",
						children: copiedLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-[#1db954]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#1db954]",
							children: "Link Copied!"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-4 h-4 text-[#1db954]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copy Link to this Card" })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-[#808080]",
						children: "Generates a hash URL holding the layout, colors, typography, lyrics, and public artwork link."
					})
				]
			})
		]
	});
};
var SearchError = class extends Error {
	http;
	status;
	constructor(message, status) {
		super(message);
		this.name = "SearchError";
		if (status !== void 0) {
			this.http = true;
			this.status = status;
		}
	}
};
var ITUNES_URL = "https://itunes.apple.com/search";
var SPOTIFY_OEMBED = "https://open.spotify.com/oembed";
var REQUEST_TIMEOUT = 8e3;
var SPOTIFY_TRACK_RE = /^https?:\/\/open\.spotify\.com\/(?:intl-[a-z-]+\/)?track\/([A-Za-z0-9]+)/i;
var netMsg = (m) => navigator.onLine === false ? "You're offline. Searching needs an internet connection, but you can still edit and export your card." : m;
async function fetchJson(url, timeout = REQUEST_TIMEOUT) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), timeout);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			referrerPolicy: "no-referrer"
		});
		if (!res.ok) throw new SearchError(`HTTP ${res.status}`, res.status);
		return await res.json();
	} finally {
		clearTimeout(timer);
	}
}
var jsonpCounter = 0;
function jsonp(url) {
	return new Promise((resolve, reject) => {
		const cb = "__itunesCb" + ++jsonpCounter;
		const script = document.createElement("script");
		let timer;
		const cleanup = () => {
			clearTimeout(timer);
			delete window[cb];
			script.remove();
		};
		window[cb] = (data) => {
			cleanup();
			resolve(data);
		};
		script.onerror = () => {
			cleanup();
			reject(/* @__PURE__ */ new Error("jsonp network error"));
		};
		timer = setTimeout(() => {
			cleanup();
			reject(/* @__PURE__ */ new Error("jsonp timeout"));
		}, REQUEST_TIMEOUT);
		script.src = url + "&callback=" + cb;
		document.head.appendChild(script);
	});
}
async function searchItunes(query) {
	const url = `${ITUNES_URL}?term=${encodeURIComponent(query)}&entity=song&limit=8`;
	let data;
	try {
		data = await fetchJson(url);
	} catch (err) {
		if (err instanceof SearchError && err.http) throw new SearchError(`iTunes returned an error (${err.status}). Please try again in a moment.`);
		try {
			data = await jsonp(url);
		} catch (_) {
			throw new SearchError(netMsg("Couldn't reach iTunes. Check your internet connection and try again."));
		}
	}
	const hits = (data && Array.isArray(data.results) ? data.results : []).filter((h) => h.artworkUrl100);
	if (!hits.length) throw new SearchError(`No results found for "${query}". Try different keywords.`);
	return hits.map((h) => ({
		thumb: h.artworkUrl100,
		cover: h.artworkUrl100.replace("100x100", "600x600"),
		title: h.trackName || "",
		artist: h.artistName || "",
		album: h.collectionName || "",
		duration: h.trackTimeMillis ? Math.round(h.trackTimeMillis / 1e3) : 0
	}));
}
async function fetchSpotifyCover(rawUrl) {
	const match = rawUrl.match(SPOTIFY_TRACK_RE);
	if (!match) throw new SearchError("That does not look like a Spotify track link. It should start with https://open.spotify.com/track/");
	const trackId = match[1];
	const canonical = `https://open.spotify.com/track/${trackId}`;
	let data;
	try {
		data = await fetchJson(`${SPOTIFY_OEMBED}?url=${encodeURIComponent(canonical)}`);
	} catch (err) {
		if (err instanceof SearchError && err.http) throw new SearchError(err.status === 404 ? "Spotify could not find that track. Check the link and try again." : `Spotify returned an error (${err.status}). Please try again in a moment.`);
		throw new SearchError(netMsg("Couldn't reach Spotify (network issue or blocked by CORS). Try the keyword search instead."));
	}
	if (!data || !data.thumbnail_url) throw new SearchError("Spotify did not return a cover image for this track.");
	return {
		coverUrl: data.thumbnail_url,
		trackId
	};
}
var SearchSection = ({ onSelectSong, onSpotifyTrack, onToast }) => {
	const [query, setQuery] = (0, import_react.useState)("");
	const [isSearching, setIsSearching] = (0, import_react.useState)(false);
	const [results, setResults] = (0, import_react.useState)([]);
	const [searchHint, setSearchHint] = (0, import_react.useState)(null);
	const [recent, setRecent] = (0, import_react.useState)([]);
	const [showDropdown, setShowDropdown] = (0, import_react.useState)(false);
	const [showSpotifyBox, setShowSpotifyBox] = (0, import_react.useState)(false);
	const [spotifyUrl, setSpotifyUrl] = (0, import_react.useState)("");
	const [isFetchingSpotify, setIsFetchingSpotify] = (0, import_react.useState)(false);
	const [spotifyHint, setSpotifyHint] = (0, import_react.useState)(null);
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setRecent(getRecentSearches());
	}, []);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) setShowDropdown(false);
		};
		document.addEventListener("pointerdown", handleClickOutside);
		return () => document.removeEventListener("pointerdown", handleClickOutside);
	}, []);
	(0, import_react.useEffect)(() => {
		if (query.trim().length < 2) {
			setResults([]);
			setShowDropdown(false);
			setIsSearching(false);
			return;
		}
		const timer = setTimeout(async () => {
			setIsSearching(true);
			setSearchHint(null);
			try {
				const hits = await searchItunes(query.trim());
				setResults(hits);
				setShowDropdown(true);
				setSearchHint({ text: `${hits.length} songs found. Pick one from the list.` });
			} catch (err) {
				setResults([]);
				setSearchHint({
					text: err instanceof SearchError ? err.message : "Failed to search iTunes.",
					isError: true
				});
			} finally {
				setIsSearching(false);
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [query]);
	const handleManualSearch = async (e) => {
		e.preventDefault();
		if (!query.trim()) {
			setSearchHint({
				text: "Type a song or artist to search for.",
				isError: true
			});
			return;
		}
		setIsSearching(true);
		setSearchHint(null);
		try {
			const hits = await searchItunes(query.trim());
			setResults(hits);
			setShowDropdown(true);
			setSearchHint({ text: `${hits.length} songs found. Pick one below.` });
			const updated = addRecentSearch(query.trim());
			setRecent(updated);
		} catch (err) {
			setResults([]);
			setSearchHint({
				text: err instanceof SearchError ? err.message : "Something went wrong. Please try again.",
				isError: true
			});
		} finally {
			setIsSearching(false);
		}
	};
	const handleSelect = (song) => {
		onSelectSong(song);
		const updated = addRecentSearch(`${song.title} ${song.artist}`);
		setRecent(updated);
		setShowDropdown(false);
		onToast(`Loaded "${song.title}" by ${song.artist}`);
	};
	const handleSpotifySubmit = async (e) => {
		e.preventDefault();
		if (!spotifyUrl.trim()) {
			setSpotifyHint({
				text: "Paste a Spotify track link first.",
				isError: true
			});
			return;
		}
		setIsFetchingSpotify(true);
		setSpotifyHint({ text: "Fetching cover from Spotify…" });
		try {
			const { coverUrl, trackId } = await fetchSpotifyCover(spotifyUrl.trim());
			onSpotifyTrack(coverUrl, trackId);
			setSpotifyHint({
				text: "Cover found!",
				isError: false
			});
			onToast("Cover art fetched from Spotify!");
		} catch (err) {
			setSpotifyHint({
				text: err instanceof SearchError ? err.message : "Could not fetch Spotify track.",
				isError: true
			});
		} finally {
			setIsFetchingSpotify(false);
		}
	};
	const handleRecentClear = () => {
		clearRecentSearches();
		setRecent([]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		ref: containerRef,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs font-bold uppercase tracking-wider text-[#1db954]",
				children: "Search"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleManualSearch,
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-3.5 text-[#707070] pointer-events-none",
								children: isSearching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin text-[#1db954]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								onFocus: () => {
									if (results.length > 0) setShowDropdown(true);
								},
								placeholder: "Search song or artist...",
								className: "w-full pl-10 pr-24 py-2.5 bg-[#242424] hover:bg-[#282828] focus:bg-[#282828] border border-[#333333] focus:border-[#1db954] focus:ring-4 focus:ring-[#1db954]/15 rounded-xl text-sm text-white placeholder-[#707070] outline-none transition-all",
								autoComplete: "off",
								spellCheck: "false"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: isSearching,
								className: "absolute right-1.5 px-3.5 py-1.5 bg-[#1db954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-semibold text-xs rounded-lg transition-all active:scale-95",
								children: isSearching ? "Searching" : "Search"
							})
						]
					}),
					searchHint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mt-2 text-xs ${searchHint.isError ? "text-[#ff7b7b]" : "text-[#1db954]"}`,
						children: searchHint.text
					}),
					showDropdown && results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						role: "listbox",
						className: "absolute top-full left-0 right-0 mt-2 z-30 max-h-72 overflow-y-auto bg-[#1e1e1e] border border-[#333333] rounded-xl shadow-2xl p-1.5 space-y-1 scrollbar-thin scrollbar-thumb-[#444444]",
						children: results.map((song, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleSelect(song),
							className: "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: song.thumb,
									alt: "",
									className: "w-11 h-11 rounded-md object-cover bg-[#333333] shrink-0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-white truncate group-hover:text-[#1db954] transition-colors",
										children: song.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-[#a0a0a0] truncate",
										children: [song.artist, song.album].filter(Boolean).join(" · ")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-[#1db954] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mr-1" })
							]
						}) }, `${song.title}-${song.artist}-${i}`))
					})
				]
			}),
			recent.length > 0 && !query && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs text-[#808080]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recent searches" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleRecentClear,
						className: "hover:text-white transition-colors",
						children: "Clear"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: recent.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setQuery(item);
						},
						className: "px-3 py-1 bg-[#222222] hover:bg-[#2a2a2a] border border-[#333333] hover:border-[#1db954] text-xs text-[#d0d0d0] hover:text-white rounded-full transition-all truncate max-w-full",
						children: item
					}, idx))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-2 border-t border-[#262626]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setShowSpotifyBox((prev) => !prev),
					className: "flex items-center gap-2 text-xs font-medium text-[#b3b3b3] hover:text-white transition-colors",
					"aria-expanded": showSpotifyBox,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `w-3.5 h-3.5 transition-transform duration-200 ${showSpotifyBox ? "rotate-180 text-[#1db954]" : ""}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "w-3.5 h-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Or paste a Spotify Track Link" })
					]
				}), showSpotifyBox && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSpotifySubmit,
					className: "mt-3 p-3 bg-white/[0.03] border border-[#2e2e2e] rounded-xl space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: spotifyUrl,
							onChange: (e) => setSpotifyUrl(e.target.value),
							placeholder: "https://open.spotify.com/track/...",
							className: "w-full pl-3 pr-20 py-2 bg-[#222222] border border-[#383838] focus:border-[#1db954] focus:ring-2 focus:ring-[#1db954]/20 rounded-lg text-xs text-white placeholder-[#606060] outline-none",
							spellCheck: "false"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isFetchingSpotify,
							className: "absolute right-1 px-3 py-1 bg-[#1db954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-semibold text-xs rounded-md transition-all",
							children: isFetchingSpotify ? "Fetching" : "Fetch"
						})]
					}), spotifyHint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-xs ${spotifyHint.isError ? "text-[#ff7b7b]" : "text-[#1db954]"}`,
						children: spotifyHint.text
					})]
				})]
			})
		]
	});
};
var ALL_THEMES = Object.keys(THEMES);
var StyleSection = ({ state, onChange, onSetTheme, onSetLayout, coverPalette, onMatchCoverColor, renderedLyricSize, hasTextOverflow }) => {
	const currentTheme = THEMES[state.theme] || THEMES.classic;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs uppercase tracking-wider font-bold text-[#1db954]",
					children: "Card Layout"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1 bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl",
					children: Object.keys(LAYOUTS).map((key) => {
						const l = LAYOUTS[key];
						const isSelected = state.layoutKey === key;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSetLayout(key),
							className: `flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-all ${isSelected ? "bg-[#1db954] text-black font-semibold shadow-md" : "text-[#b3b3b3] hover:text-white hover:bg-white/5"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.label.split(" · ")[0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] ${isSelected ? "text-black/70" : "text-[#707070]"}`,
								children: l.label.split(" · ")[1]
							})]
						}, key);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-bold uppercase tracking-wider text-[#1db954]",
						children: "Styles"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-[#808080]",
						children: currentTheme.label
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-1.5",
					children: ALL_THEMES.map((key) => {
						const t = THEMES[key];
						const on = state.theme === key;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onSetTheme(key),
							"aria-pressed": on,
							title: t.label,
							className: `min-h-9 truncate rounded-md px-1.5 text-[11px] ${on ? "bg-[#1db954] font-semibold text-black" : "bg-[#242424] text-[#c8c8c8] hover:bg-[#2c2c2c] hover:text-white"}`,
							children: t.label
						}, key);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs uppercase tracking-wider font-bold text-[#1db954]",
							children: "Card Background"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-mono text-[#b3b3b3]",
							children: state.color
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [PRESET_COLORS.map((hex) => {
							const isSelected = state.color.toUpperCase() === hex.toUpperCase();
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onChange({
									color: hex,
									autoColor: false
								}),
								style: { backgroundColor: hex },
								"aria-label": `Color ${hex}`,
								className: `w-7 h-7 rounded-full transition-transform active:scale-90 ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-[#121212] scale-110 shadow-lg" : "hover:scale-110 opacity-90 hover:opacity-100"}`
							}, hex);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							title: "Pick custom color",
							className: "relative w-7 h-7 rounded-full cursor-pointer overflow-hidden border border-white/20 hover:scale-110 transition-transform active:scale-90 shadow-sm",
							style: { background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								suppressHydrationWarning: true,
								type: "color",
								value: state.color,
								onChange: (e) => onChange({
									color: e.target.value.toUpperCase(),
									autoColor: false
								}),
								className: "absolute -inset-4 w-16 h-16 opacity-0 cursor-pointer"
							})
						})]
					}),
					coverPalette.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 space-y-1.5 border-t border-[#262626]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-[#808080]",
							children: "From the cover art:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [coverPalette.map((hex) => {
								const isSelected = state.color.toUpperCase() === hex.toUpperCase();
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onChange({
										color: hex,
										autoColor: false
									}),
									style: { backgroundColor: hex },
									title: `Cover color: ${hex}`,
									className: `w-7 h-7 rounded-full transition-transform ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-[#121212] scale-110" : "hover:scale-110 opacity-80 hover:opacity-100"}`
								}, hex);
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onMatchCoverColor,
								className: "flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-[#333333] hover:border-white/20 text-xs font-medium text-[#d0d0d0] hover:text-white rounded-full transition-all active:scale-95 ml-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "w-3.5 h-3.5 text-[#1db954]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Match Cover" })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2.5 pt-1 cursor-pointer select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							suppressHydrationWarning: true,
							type: "checkbox",
							checked: state.autoColor,
							onChange: (e) => onChange({ autoColor: e.target.checked }),
							className: "w-4 h-4 mt-0.5 rounded border-[#444444] text-[#1db954] focus:ring-[#1db954] accent-[#1db954]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-medium text-white",
							children: "Auto color from cover"
						}) })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 pt-2 border-t border-[#262626]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2.5 cursor-pointer select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							suppressHydrationWarning: true,
							type: "checkbox",
							checked: state.autoFit,
							onChange: (e) => onChange({ autoFit: e.target.checked }),
							className: "w-4 h-4 mt-0.5 rounded border-[#444444] text-[#1db954] focus:ring-[#1db954] accent-[#1db954]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-medium text-white",
							children: "Auto-fit text"
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-[#b3b3b3]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lyrics Font Size" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-white font-medium",
									children: [renderedLyricSize || state.lyricSize, " px"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => onChange({
											lyricSize: Math.max(16, state.lyricSize - 2),
											autoFit: false
										}),
										className: "w-7 h-7 flex items-center justify-center rounded-full border border-[#444444] hover:border-white bg-[#222222] text-white transition-all active:scale-95",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "w-3 h-3" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										suppressHydrationWarning: true,
										type: "range",
										min: 16,
										max: 120,
										value: state.lyricSize,
										onChange: (e) => onChange({
											lyricSize: parseInt(e.target.value, 10),
											autoFit: false
										}),
										className: "flex-1 accent-[#1db954] cursor-pointer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => onChange({
											lyricSize: Math.min(120, state.lyricSize + 2),
											autoFit: false
										}),
										className: "w-7 h-7 flex items-center justify-center rounded-full border border-[#444444] hover:border-white bg-[#222222] text-white transition-all active:scale-95",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3 h-3" })
									})
								]
							}),
							hasTextOverflow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#ff7b7b]",
								children: "Lyrics don't fit."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2.5 pt-1 cursor-pointer select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							suppressHydrationWarning: true,
							type: "checkbox",
							checked: state.transparent,
							onChange: (e) => onChange({ transparent: e.target.checked }),
							className: "w-4 h-4 mt-0.5 rounded border-[#444444] text-[#1db954] focus:ring-[#1db954] accent-[#1db954]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-medium text-white",
							children: "Transparent export"
						}) })]
					})
				]
			})
		]
	});
};
var TextSection = ({ state, onChange, onOpenLyricsModal }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xs font-bold uppercase tracking-wider text-[#1db954]",
				children: "Song"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "coverUrl",
						className: "block text-xs font-medium text-[#b3b3b3]",
						children: "Cover URL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "coverUrl",
						type: "text",
						value: state.coverUrl,
						onChange: (e) => onChange({ coverUrl: e.target.value }),
						placeholder: "https://example.com/album-cover.jpg",
						className: "w-full px-3.5 py-2.5 bg-[#242424] hover:bg-[#282828] focus:bg-[#282828] border border-[#333333] focus:border-[#1db954] focus:ring-4 focus:ring-[#1db954]/15 rounded-xl text-sm text-white placeholder-[#707070] outline-none transition-all",
						spellCheck: "false"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-[#808080]",
						children: "Direct image link (CORS enabled) or fetched automatically via Search."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "songTitle",
					className: "block text-xs font-medium text-[#b3b3b3]",
					children: "Song Title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "songTitle",
					type: "text",
					value: state.title,
					onChange: (e) => onChange({ title: e.target.value }),
					placeholder: "Enter song title...",
					className: "w-full px-3.5 py-2.5 bg-[#242424] hover:bg-[#282828] focus:bg-[#282828] border border-[#333333] focus:border-[#1db954] focus:ring-4 focus:ring-[#1db954]/15 rounded-xl text-sm text-white placeholder-[#707070] outline-none transition-all"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "artistName",
					className: "block text-xs font-medium text-[#b3b3b3]",
					children: "Artist Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "artistName",
					type: "text",
					value: state.artist,
					onChange: (e) => onChange({ artist: e.target.value }),
					placeholder: "Enter artist name...",
					className: "w-full px-3.5 py-2.5 bg-[#242424] hover:bg-[#282828] focus:bg-[#282828] border border-[#333333] focus:border-[#1db954] focus:ring-4 focus:ring-[#1db954]/15 rounded-xl text-sm text-white placeholder-[#707070] outline-none transition-all"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "lyrics",
						className: "text-xs font-medium text-[#b3b3b3]",
						children: "Lyrics"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onOpenLyricsModal,
						className: "flex items-center gap-1.5 px-3 py-1 bg-[#1e1e1e] hover:bg-white/10 border border-[#383838] hover:border-white/20 text-[#1db954] hover:text-[#1ed760] text-xs font-medium rounded-full transition-all active:scale-95 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select Lyrics" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "lyrics",
					rows: 5,
					value: state.lyrics,
					onChange: (e) => onChange({ lyrics: e.target.value }),
					placeholder: "Type or paste your favorite lyrics here. Line breaks are kept intact.",
					className: "w-full px-3.5 py-2.5 bg-[#242424] hover:bg-[#282828] focus:bg-[#282828] border border-[#333333] focus:border-[#1db954] focus:ring-4 focus:ring-[#1db954]/15 rounded-xl text-sm text-white placeholder-[#707070] outline-none transition-all resize-y leading-relaxed font-sans"
				})]
			})
		]
	});
};
var Header = ({ canUndo, canRedo, onUndo, onRedo, onOpenHelp, onToast }) => {
	const [deferredPrompt, setDeferredPrompt] = (0, import_react.useState)(null);
	const [isInstallable, setIsInstallable] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const handleBeforeInstall = (e) => {
			e.preventDefault();
			setDeferredPrompt(e);
			setIsInstallable(true);
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstall);
		const ua = navigator.userAgent;
		const isIOS = /iphone|ipad|ipod/i.test(ua) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
		const isStandalone = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
		if (isIOS && !isStandalone) setIsInstallable(true);
		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
		};
	}, []);
	const handleInstallClick = async () => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			if ((await deferredPrompt.userChoice).outcome === "accepted") onToast("App installation started");
			setDeferredPrompt(null);
			setIsInstallable(false);
		} else {
			const ua = navigator.userAgent;
			if (/iphone|ipad|ipod/i.test(ua)) onToast("Tap the Share icon in Safari, then select \"Add to Home Screen\".");
			else onToast("To install, open your browser menu and choose \"Install App\" or \"Add to Home Screen\".");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "relative flex items-center justify-between gap-3 px-5 py-4 border-b border-[#282828] bg-[#121212]/90 backdrop-blur-xl shrink-0 z-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:-rotate-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					className: "w-8 h-8 drop-shadow-[0_4px_12px_rgba(29,185,84,0.35)]",
					viewBox: "0 0 48 48",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "24",
							cy: "24",
							r: "24",
							fill: "#1db954"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M11 17.5c8-2.4 18-1.8 25.5 2.6",
							stroke: "#000",
							strokeWidth: "3.6",
							strokeLinecap: "round",
							fill: "none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M12.5 25c6.7-2 15-1.4 21 2.1",
							stroke: "#000",
							strokeWidth: "3",
							strokeLinecap: "round",
							fill: "none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M14 31.6c5.3-1.5 11.3-1 16 1.7",
							stroke: "#000",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							fill: "none"
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-base font-bold tracking-tight",
				children: "SpotifyMan"
			}) })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end gap-[3px] h-4 px-1.5 py-0.5 opacity-70",
					"aria-hidden": "true",
					title: "Audio visualizer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-[3px] h-full rounded-sm bg-[#1db954] origin-bottom animate-[bounce_1.1s_ease-in-out_infinite]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-[3px] h-full rounded-sm bg-[#1db954] origin-bottom animate-[bounce_0.9s_ease-in-out_infinite_-0.4s]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-[3px] h-full rounded-sm bg-[#1db954] origin-bottom animate-[bounce_1.3s_ease-in-out_infinite_-0.8s]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-[3px] h-full rounded-sm bg-[#1db954] origin-bottom animate-[bounce_1.0s_ease-in-out_infinite_-0.2s]" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 bg-[#1e1e1e] border border-[#333333] rounded-full p-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onUndo,
						disabled: !canUndo,
						title: "Undo (Ctrl+Z)",
						"aria-label": "Undo",
						className: "w-7 h-7 flex items-center justify-center rounded-full text-[#b3b3b3] hover:text-white disabled:opacity-30 disabled:hover:text-[#b3b3b3] transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "w-3.5 h-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onRedo,
						disabled: !canRedo,
						title: "Redo (Ctrl+Shift+Z)",
						"aria-label": "Redo",
						className: "w-7 h-7 flex items-center justify-center rounded-full text-[#b3b3b3] hover:text-white disabled:opacity-30 disabled:hover:text-[#b3b3b3] transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Redo2, { className: "w-3.5 h-3.5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onOpenHelp,
					title: "Keyboard shortcuts (?)",
					"aria-label": "Keyboard shortcuts",
					className: "w-8 h-8 flex items-center justify-center rounded-full text-[#b3b3b3] hover:text-white hover:bg-white/5 border border-transparent hover:border-[#333333] transition-all",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "w-4 h-4" })
				}),
				isInstallable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleInstallClick,
					className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Install"
					})]
				})
			]
		})]
	});
};
var CardViewport = (0, import_react.lazy)(() => import("./CardViewport-B32Op7rw.mjs"));
var ViewBoundary = class extends import_react.Component {
	state = { failed: false };
	static getDerivedStateFromError() {
		return { failed: true };
	}
	render() {
		return this.state.failed ? this.props.fallback : this.props.children;
	}
};
var Stage = ({ state, coverImg, tilt, isDragging, fontEpoch, onPointerDown, onPointerMove, onPointerUp, onWheel, onResetTilt, onCardRenderedSize }) => {
	const layout = LAYOUTS[state.layoutKey];
	const themeLabel = THEMES[state.theme]?.label ?? "Classic";
	const [show3d, setShow3d] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setShow3d(true), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative flex h-full w-full flex-col items-center justify-center overflow-hidden select-none",
		style: { ["--glow"]: state.color },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0",
				style: { background: `radial-gradient(520px 420px at 50% 46%, ${state.color}33, transparent 70%)` }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-3 left-3 z-10 flex max-w-[70%] items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "truncate rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium text-[#d0d0d0] backdrop-blur-md",
					children: [
						themeLabel,
						" · ",
						layout.w,
						"×",
						layout.h
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-3 right-3 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onResetTilt,
					"aria-label": "Reset tilt",
					className: "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-[#d0d0d0] backdrop-blur-md active:scale-95",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onPointerDown,
				onPointerMove,
				onPointerUp,
				onPointerCancel: onPointerUp,
				onWheel,
				onDoubleClick: onResetTilt,
				className: `relative z-1 h-full w-full touch-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewBoundary, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full items-center justify-center text-xs text-[#b3b3b3]",
						children: "3D preview unavailable"
					}),
					children: show3d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: null,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardViewport, {
							state,
							coverImg,
							tilt,
							dragging: isDragging,
							fontEpoch,
							onSize: onCardRenderedSize
						})
					}) : null
				})
			})
		]
	});
};
var TABS = [
	{
		id: "search",
		label: "Search",
		icon: Search
	},
	{
		id: "text",
		label: "Text",
		icon: Type
	},
	{
		id: "style",
		label: "Style",
		icon: Palette
	},
	{
		id: "layout",
		label: "Layout",
		icon: SlidersVertical
	},
	{
		id: "looks",
		label: "Looks",
		icon: Sparkles
	}
];
var TabNav = ({ activeTab, onTabChange }) => {
	const listRef = (0, import_react.useRef)(null);
	const [inkStyle, setInkStyle] = (0, import_react.useState)({
		left: 0,
		width: 0
	});
	const updateInk = () => {
		if (!listRef.current) return;
		const activeBtn = listRef.current.querySelector(`button[data-tab="${activeTab}"]`);
		if (activeBtn) setInkStyle({
			left: activeBtn.offsetLeft + 12,
			width: Math.max(0, activeBtn.offsetWidth - 24)
		});
	};
	(0, import_react.useEffect)(() => {
		updateInk();
		window.addEventListener("resize", updateInk);
		return () => window.removeEventListener("resize", updateInk);
	}, [activeTab]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "relative flex items-center border-b border-[#282828] bg-[#161616]/95 backdrop-blur-md px-3 shrink-0 h-12 overflow-x-auto scrollbar-none",
		"aria-label": "Editor sections",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: listRef,
			className: "relative flex items-center h-full w-full",
			children: [TABS.map((tab) => {
				const Icon = tab.icon;
				const isActive = activeTab === tab.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-tab": tab.id,
					role: "tab",
					"aria-selected": isActive,
					onClick: () => onTabChange(tab.id),
					className: `relative flex items-center justify-center gap-2 px-4 h-full text-xs font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#1db954] rounded-md ${isActive ? "text-white" : "text-[#888888] hover:text-[#d0d0d0]"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
				}, tab.id);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute bottom-0 h-[3px] rounded-t-full bg-[#1db954] shadow-[0_-2px_12px_rgba(29,185,84,0.6)] transition-all duration-300 ease-out pointer-events-none",
				style: {
					left: `${inkStyle.left}px`,
					width: `${inkStyle.width}px`
				}
			})]
		})
	});
};
var rad = (deg) => deg * Math.PI / 180;
/** 3x3 row-major matrix multiply */
function mul3(a, b) {
	const o = new Array(9).fill(0);
	for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) for (let k = 0; k < 3; k++) o[r * 3 + c] += a[r * 3 + k] * b[k * 3 + c];
	return o;
}
/** 3x3 inverse via adjugate */
function invert3(m) {
	const [a, b, c, d, e, f, g, h, i] = m;
	const A = e * i - f * h;
	const B = -(d * i - f * g);
	const C = d * h - e * g;
	const det = a * A + b * B + c * C;
	if (Math.abs(det) < 1e-12) return [
		1,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		1
	];
	const k = 1 / det;
	return [
		A * k,
		-(b * i - c * h) * k,
		(b * f - c * e) * k,
		B * k,
		(a * i - c * g) * k,
		-(a * f - c * d) * k,
		C * k,
		-(a * h - b * g) * k,
		(a * e - b * d) * k
	];
}
/**
* Homography H mapping card-plane points (x, y, 1), centered on the card (origin = W/2, H/2),
* to screen points (X*w, Y*w, w), replicating CSS:
*   perspective(d) rotateX(rx) rotateY(ry) rotateZ(rz)
*/
function buildHomography(d, tilt) {
	const [cx, sx] = [Math.cos(rad(tilt.rx)), Math.sin(rad(tilt.rx))];
	const [cy, sy] = [Math.cos(rad(tilt.ry)), Math.sin(rad(tilt.ry))];
	const [cz, sz] = [Math.cos(rad(tilt.rz)), Math.sin(rad(tilt.rz))];
	const M = mul3([
		1,
		0,
		0,
		0,
		cx,
		-sx,
		0,
		sx,
		cx
	], mul3([
		cy,
		0,
		sy,
		0,
		1,
		0,
		-sy,
		0,
		cy
	], [
		cz,
		-sz,
		0,
		sz,
		cz,
		0,
		0,
		0,
		1
	]));
	return [
		M[0],
		M[1],
		0,
		M[3],
		M[4],
		0,
		-M[6] / d,
		-M[7] / d,
		1
	];
}
/** Project a card-plane point to screen space using H */
function project(H, x, y) {
	const w = H[6] * x + H[7] * y + H[8];
	return {
		x: (H[0] * x + H[1] * y + H[2]) / w,
		y: (H[3] * x + H[4] * y + H[5]) / w
	};
}
/**
* Warp a source canvas through the 3D homography with bilinear, alpha-premultiplied sampling.
*/
function warpCard(source, H, k, canvasW, canvasH) {
	const halfW = canvasW / 2;
	const halfH = canvasH / 2;
	const SW = canvasW * k;
	const SH = canvasH * k;
	const corners = [
		[-halfW, -halfH],
		[halfW, -halfH],
		[halfW, halfH],
		[-halfW, halfH]
	].map(([x, y]) => project(H, x, y));
	const minX = Math.floor(k * Math.min(...corners.map((p) => p.x)));
	const minY = Math.floor(k * Math.min(...corners.map((p) => p.y)));
	const maxX = Math.ceil(k * Math.max(...corners.map((p) => p.x)));
	const maxY = Math.ceil(k * Math.max(...corners.map((p) => p.y)));
	const outW = Math.max(1, maxX - minX);
	const outH = Math.max(1, maxY - minY);
	const srcCtx = source.getContext("2d");
	if (!srcCtx) throw new Error("Could not get 2d context from source canvas");
	const src = srcCtx.getImageData(0, 0, SW, SH).data;
	const dstImage = new ImageData(outW, outH);
	const dst = dstImage.data;
	const inv = invert3(H);
	for (let py = 0; py < outH; py++) {
		const Y = (minY + py + .5) / k;
		for (let px = 0; px < outW; px++) {
			const X = (minX + px + .5) / k;
			const w = inv[6] * X + inv[7] * Y + inv[8];
			const u = ((inv[0] * X + inv[1] * Y + inv[2]) / w + halfW) * k - .5;
			const v = ((inv[3] * X + inv[4] * Y + inv[5]) / w + halfH) * k - .5;
			if (u < -1 || v < -1 || u > SW || v > SH) continue;
			const x0 = Math.floor(u);
			const y0 = Math.floor(v);
			const fx = u - x0;
			const fy = v - y0;
			let r = 0;
			let g = 0;
			let b = 0;
			let a = 0;
			for (let j = 0; j < 2; j++) {
				const yy = y0 + j;
				if (yy < 0 || yy >= SH) continue;
				const wy = j ? fy : 1 - fy;
				for (let i = 0; i < 2; i++) {
					const xx = x0 + i;
					if (xx < 0 || xx >= SW) continue;
					const wgt = (i ? fx : 1 - fx) * wy;
					const idx = (yy * SW + xx) * 4;
					const al = src[idx + 3] / 255 * wgt;
					r += src[idx] * al;
					g += src[idx + 1] * al;
					b += src[idx + 2] * al;
					a += al;
				}
			}
			if (a > 0) {
				const o = (py * outW + px) * 4;
				dst[o] = r / a;
				dst[o + 1] = g / a;
				dst[o + 2] = b / a;
				dst[o + 3] = a * 255;
			}
		}
	}
	const out = document.createElement("canvas");
	out.width = outW;
	out.height = outH;
	const outCtx = out.getContext("2d");
	if (outCtx) outCtx.putImageData(dstImage, 0, 0);
	return out;
}
function slugify(text) {
	return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "");
}
function fileBaseName(title, artist, suffix, ext = "png") {
	const parts = [slugify(title), slugify(artist)].filter(Boolean);
	return (parts.length ? parts.join("_") : "lyric-card") + suffix + "." + ext;
}
function canvasToBlob(canvas, type = "image/png", quality) {
	return new Promise((resolve, reject) => {
		canvas.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("toBlob returned null")), type, quality);
	});
}
function saveBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 15e3);
}
async function encodeCanvas(canvas, fmtKey) {
	const f = FORMATS[fmtKey] || FORMATS.png;
	const blob = await canvasToBlob(canvas, f.mime, f.q);
	if (f.mime !== "image/png" && blob.type && blob.type !== f.mime) {
		if (f.mime === "image/webp");
		return {
			blob,
			fmt: "png",
			fellBack: true
		};
	}
	return {
		blob,
		fmt: FORMATS[fmtKey] ? fmtKey : "png",
		fellBack: false
	};
}
function dimsFor(key, state, social = false) {
	const L = LAYOUTS[key];
	const p = social ? presetById(CANON[key]) : presetById(state.preset) && presetById(state.preset)?.layout === key ? presetById(state.preset) : null;
	return p ? {
		w: p.w,
		h: p.h
	} : {
		w: Math.round(L.w * state.scale),
		h: Math.round(L.h * state.scale)
	};
}
function renderFlatCanvas(key, dims, fmtKey, state, coverImg) {
	const layout = LAYOUTS[key];
	const out = document.createElement("canvas");
	out.width = dims.w;
	out.height = dims.h;
	const g = out.getContext("2d");
	if (!g) throw new Error("Could not get 2d context for flat canvas export");
	g.scale(dims.w / layout.w, dims.h / layout.h);
	const solid = (FORMATS[fmtKey] || FORMATS.png).solid || !state.transparent;
	renderCard(g, {
		...state,
		layoutKey: key
	}, layout, coverImg, {
		rx: 0,
		ry: 0,
		rz: 0,
		perspective: 1200
	}, {
		fullBleed: solid,
		flat: true
	});
	return out;
}
function renderCard3D(state, coverImg, displayedWidth = 560) {
	const layout = LAYOUTS[state.layoutKey];
	const scale = state.scale;
	const flat = document.createElement("canvas");
	flat.width = layout.w * scale;
	flat.height = layout.h * scale;
	const fg = flat.getContext("2d");
	if (!fg) throw new Error("Could not create context for 3d bake");
	fg.scale(scale, scale);
	const tilt = {
		rx: 12,
		ry: -15,
		rz: 2,
		perspective: 1200
	};
	renderCard(fg, state, layout, coverImg, tilt, {
		fullBleed: false,
		flat: false
	});
	paintGlare(fg, state, layout, tilt, false);
	const warped = warpCard(flat, buildHomography(tilt.perspective * (layout.w / (displayedWidth || 560)), tilt), scale, layout.w, layout.h);
	const pad = 150 * scale;
	const out = document.createElement("canvas");
	out.width = warped.width + pad * 2;
	out.height = warped.height + pad * 2;
	const og = out.getContext("2d");
	if (!og) throw new Error("Could not create output context for 3D card");
	og.save();
	og.shadowColor = "rgba(0, 0, 0, 0.55)";
	og.shadowBlur = 60 * scale;
	og.shadowOffsetY = 60 * scale;
	og.drawImage(warped, pad, pad);
	og.restore();
	og.save();
	og.shadowColor = "rgba(0, 0, 0, 0.35)";
	og.shadowBlur = 18 * scale;
	og.shadowOffsetY = 16 * scale;
	og.drawImage(warped, pad, pad);
	og.restore();
	return out;
}
var CRC_TABLE = (() => {
	const t = /* @__PURE__ */ new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
		t[n] = c >>> 0;
	}
	return t;
})();
function crc32(u8) {
	let c = 4294967295;
	for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 255] ^ c >>> 8;
	return (c ^ 4294967295) >>> 0;
}
function makeZip(files) {
	const te = new TextEncoder();
	const parts = [];
	const central = [];
	const d = /* @__PURE__ */ new Date();
	const time = d.getHours() << 11 | d.getMinutes() << 5 | d.getSeconds() >> 1;
	const date = Math.max(1980, d.getFullYear()) - 1980 << 9 | d.getMonth() + 1 << 5 | d.getDate();
	let offset = 0;
	for (const f of files) {
		const name = te.encode(f.name);
		const crc = crc32(f.data);
		const size = f.data.length;
		const lh = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(30));
		lh.setUint32(0, 67324752, true);
		lh.setUint16(4, 20, true);
		lh.setUint16(6, 2048, true);
		lh.setUint16(8, 0, true);
		lh.setUint16(10, time, true);
		lh.setUint16(12, date, true);
		lh.setUint32(14, crc, true);
		lh.setUint32(18, size, true);
		lh.setUint32(22, size, true);
		lh.setUint16(26, name.length, true);
		lh.setUint16(28, 0, true);
		parts.push(lh.buffer, name, f.data);
		const ch = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(46));
		ch.setUint32(0, 33639248, true);
		ch.setUint16(4, 20, true);
		ch.setUint16(6, 20, true);
		ch.setUint16(8, 2048, true);
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
	const end = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(22));
	end.setUint32(0, 101010256, true);
	end.setUint16(8, files.length, true);
	end.setUint16(10, files.length, true);
	end.setUint32(12, cdSize, true);
	end.setUint32(16, offset, true);
	return new Blob([
		...parts,
		...central,
		end.buffer
	], { type: "application/zip" });
}
var ExportModal = ({ isOpen, onClose, state, coverImg, onUpdateState, onToast }) => {
	const [isExporting, setIsExporting] = (0, import_react.useState)(false);
	const [statusMsg, setStatusMsg] = (0, import_react.useState)(null);
	if (!isOpen) return null;
	presetById(state.preset);
	const currentFormat = FORMATS[state.fmt] || FORMATS.png;
	const currentLayout = LAYOUTS[state.layoutKey];
	const handleSelectPreset = (id) => {
		const p = presetById(id);
		if (!p) return;
		onUpdateState({
			preset: p.id,
			layoutKey: p.layout
		});
		onToast(`Preset: ${p.label} (${p.w} × ${p.h})`);
	};
	const handleSelectScale = (scale) => {
		onUpdateState({
			scale,
			preset: null
		});
		onToast(`Export scale: ${currentLayout.w * scale} × ${currentLayout.h * scale}`);
	};
	const handleDownloadFlat = async () => {
		setIsExporting(true);
		setStatusMsg("Rendering flat card…");
		try {
			const dims = dimsFor(state.layoutKey, state);
			const { blob, fmt, fellBack } = await encodeCanvas(renderFlatCanvas(state.layoutKey, dims, state.fmt, state, coverImg), state.fmt);
			saveBlob(blob, fileBaseName(state.title, state.artist, `_${state.layoutKey}`, FORMATS[fmt].ext));
			onToast(fellBack ? `${FORMATS[state.fmt].label} fallback to PNG` : `Downloaded ${FORMATS[fmt].label} (${dims.w} × ${dims.h})`);
			onClose();
		} catch (e) {
			console.error(e);
			onToast("Export failed. The cover image may block cross-origin use.");
		} finally {
			setIsExporting(false);
			setStatusMsg(null);
		}
	};
	const handleDownload3D = async () => {
		setIsExporting(true);
		setStatusMsg("Baking 3D card perspective & shadows…");
		try {
			await new Promise((r) => setTimeout(r, 40));
			const { blob } = await encodeCanvas(renderCard3D(state, coverImg), "png");
			saveBlob(blob, fileBaseName(state.title, state.artist, "_3d", "png"));
			onToast("3D Card downloaded (PNG with transparency)");
			onClose();
		} catch (e) {
			console.error(e);
			onToast("3D Export failed. Check image CORS.");
		} finally {
			setIsExporting(false);
			setStatusMsg(null);
		}
	};
	const handleCopyClipboard = async () => {
		if (!navigator.clipboard || typeof window.ClipboardItem === "undefined" || !navigator.clipboard.write) {
			onToast("Clipboard copy is not supported in this browser. Use Download instead.");
			return;
		}
		setIsExporting(true);
		setStatusMsg("Copying image to clipboard…");
		try {
			const dims = dimsFor(state.layoutKey, state);
			const out = renderFlatCanvas(state.layoutKey, dims, "png", state, coverImg);
			const blobPromise = new Promise((resolve, reject) => {
				out.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("toBlob failed")), "image/png");
			});
			await navigator.clipboard.write([new window.ClipboardItem({ "image/png": blobPromise })]);
			onToast("Copied card to clipboard!");
			onClose();
		} catch (e) {
			console.error(e);
			onToast("Copy failed. Browser may block clipboard image writes.");
		} finally {
			setIsExporting(false);
			setStatusMsg(null);
		}
	};
	const handleNativeShare = async () => {
		if (!navigator.share) {
			onToast("Sharing files is not supported on this device.");
			return;
		}
		setIsExporting(true);
		setStatusMsg("Preparing share sheet…");
		try {
			const dims = dimsFor(state.layoutKey, state);
			const { blob, fmt } = await encodeCanvas(renderFlatCanvas(state.layoutKey, dims, state.fmt, state, coverImg), state.fmt);
			const name = fileBaseName(state.title, state.artist, `_${state.layoutKey}`, FORMATS[fmt].ext);
			const file = new File([blob], name, { type: blob.type || FORMATS[fmt].mime });
			if (navigator.canShare && !navigator.canShare({ files: [file] })) {
				saveBlob(blob, name);
				onToast("File sharing unsupported. Saved to downloads.");
				onClose();
				return;
			}
			await navigator.share({
				files: [file],
				title: [state.title, state.artist].filter(Boolean).join(" – ") || "Lyric Card"
			});
			onToast("Shared successfully!");
			onClose();
		} catch (e) {
			if (e && e.name !== "AbortError") onToast("Share sheet closed.");
		} finally {
			setIsExporting(false);
			setStatusMsg(null);
		}
	};
	const handleDownloadZip = async () => {
		setIsExporting(true);
		const keys = [
			"square",
			"wide",
			"story",
			"portrait",
			"tall"
		];
		const files = [];
		try {
			for (let i = 0; i < keys.length; i++) {
				const k = keys[i];
				setStatusMsg(`Rendering ${i + 1} of ${keys.length}: ${LAYOUTS[k].label.split(" · ")[0]}…`);
				await new Promise((r) => setTimeout(r, 30));
				const res = await encodeCanvas(renderFlatCanvas(k, dimsFor(k, state, true), state.fmt, state, coverImg), state.fmt);
				const arrayBuf = await res.blob.arrayBuffer();
				const fname = fileBaseName(state.title, state.artist, `_${k}`, FORMATS[res.fmt].ext);
				files.push({
					name: fname,
					data: new Uint8Array(arrayBuf)
				});
			}
			setStatusMsg("Compressing ZIP archive…");
			saveBlob(makeZip(files), fileBaseName(state.title, state.artist, "_all-layouts", "zip"));
			onToast(`Zip downloaded (${files.length} layout cards)`);
			onClose();
		} catch (e) {
			console.error(e);
			onToast("Zip creation failed.");
		} finally {
			setIsExporting(false);
			setStatusMsg(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "dialog",
		"aria-modal": "true",
		className: "fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: onClose,
			className: "absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex flex-col w-full sm:max-w-md max-h-[90vh] bg-[#1a1a1a] border border-[#2f2f2f] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl overflow-y-auto space-y-5 animate-in slide-in-from-bottom-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between pb-3 border-b border-[#2a2a2a]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-bold text-white",
						children: "Export & Download"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#909090]",
						children: "Save high-resolution flat cards, 3D cards, or batch bundles."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-[#a0a0a0] hover:text-white transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs uppercase tracking-wider font-bold text-[#1db954]",
						children: "Size Presets"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: EXPORT_PRESETS.map((p) => {
							const isSelected = state.preset === p.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleSelectPreset(p.id),
								className: `flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${isSelected ? "bg-[#1db954]/20 border-[#1db954] text-white shadow-sm" : "bg-[#222222] border-[#333333] hover:border-[#444444] text-[#d0d0d0]"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold",
									children: p.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10.5px] text-[#808080]",
									children: [
										p.w,
										" × ",
										p.h
									]
								})]
							}, p.id);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-[#b3b3b3]",
						children: "Image Scale"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 p-1 bg-[#222222] border border-[#333333] rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleSelectScale(1),
							className: `py-2 text-xs font-semibold rounded-lg transition-all ${state.scale === 1 && !state.preset ? "bg-[#1db954] text-black shadow-sm" : "text-[#888888] hover:text-white"}`,
							children: [
								"1x (",
								currentLayout.w,
								" × ",
								currentLayout.h,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleSelectScale(2),
							className: `py-2 text-xs font-semibold rounded-lg transition-all ${state.scale === 2 && !state.preset ? "bg-[#1db954] text-black shadow-sm" : "text-[#888888] hover:text-white"}`,
							children: [
								"2x (",
								currentLayout.w * 2,
								" × ",
								currentLayout.h * 2,
								")"
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-medium text-[#b3b3b3]",
						children: "Format"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2 p-1 bg-[#222222] border border-[#333333] rounded-xl",
						children: [
							"png",
							"jpg",
							"webp"
						].map((fmt) => {
							const isSelected = state.fmt === fmt;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onUpdateState({ fmt }),
								className: `py-2 text-xs font-semibold uppercase rounded-lg transition-all ${isSelected ? "bg-[#1db954] text-black shadow-sm" : "text-[#888888] hover:text-white"}`,
								children: [
									fmt,
									" ",
									fmt !== "jpg" ? "· alpha" : ""
								]
							}, fmt);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2.5 pt-2 border-t border-[#2a2a2a]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: isExporting,
							onClick: handleDownloadFlat,
							className: "w-full py-3 px-4 bg-[#1db954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Download Flat (",
								currentFormat.label,
								")"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: isExporting,
							onClick: handleDownload3D,
							className: "w-full py-3 px-4 bg-[#262626] hover:bg-[#303030] disabled:opacity-50 text-white font-semibold text-xs border border-[#383838] rounded-full flex items-center justify-center gap-2 transition-all active:scale-98",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "w-4 h-4 text-[#1db954]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download 3D Card (PNG)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: isExporting,
							onClick: handleCopyClipboard,
							className: "w-full py-2.5 px-4 bg-transparent hover:bg-white/5 text-[#d0d0d0] hover:text-white font-medium text-xs border border-[#333333] rounded-full flex items-center justify-center gap-2 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copy to Clipboard" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: isExporting,
							onClick: handleNativeShare,
							className: "w-full py-2.5 px-4 bg-transparent hover:bg-white/5 text-[#d0d0d0] hover:text-white font-medium text-xs border border-[#333333] rounded-full flex items-center justify-center gap-2 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Share Image" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: isExporting,
							onClick: handleDownloadZip,
							className: "w-full py-2.5 px-4 bg-transparent hover:bg-white/5 text-[#d0d0d0] hover:text-white font-medium text-xs border border-[#333333] rounded-full flex items-center justify-center gap-2 transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "w-3.5 h-3.5 text-[#1db954]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download All 5 Layouts (.zip)" })]
						})
					]
				}),
				statusMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-2 text-xs text-[#1db954] animate-pulse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: statusMsg })]
				})
			]
		})]
	});
};
var KeyboardHelpModal = ({ isOpen, onClose }) => {
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && isOpen) onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "dialog",
		"aria-modal": "true",
		className: "fixed inset-0 z-[120] flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: onClose,
			className: "absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-sm bg-[#1e1e1e] border border-[#333333] rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pb-2 border-b border-[#2c2c2c]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-bold text-white",
					children: "Keyboard Shortcuts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-[#a0a0a0] hover:text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "space-y-2.5 text-xs text-[#b3b3b3]",
				children: [
					{
						key: "E",
						desc: "Open Export dialog"
					},
					{
						key: "1 – 5",
						desc: "Switch layout (Square, Wide, Story, Portrait, Tall)"
					},
					{
						key: "←  →",
						desc: "Cycle previous / next card theme"
					},
					{
						key: "Ctrl + Z",
						desc: "Undo card changes"
					},
					{
						key: "Ctrl + ⇧ + Z",
						desc: "Redo card changes"
					},
					{
						key: "?",
						desc: "Toggle this keyboard shortcuts dialog"
					},
					{
						key: "Esc",
						desc: "Close any active modal or sheet"
					}
				].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[#e0e0e0]",
						children: item.desc
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: "px-2 py-1 rounded bg-[#2a2a2a] border border-[#3c3c3c] text-white font-mono text-[11px] shadow-sm shrink-0",
						children: item.key
					})]
				}, idx))
			})]
		})]
	});
};
var LYRICS_API = "https://api.lyrics.ovh/v1";
var LRCLIB_API = "https://lrclib.net/api";
var LYRICS_TIMEOUT = 6e3;
var NOT_FOUND = "Lyrics not found for this song. You can type them manually.";
var OFFLINE_LYRICS = "You're offline, so lyrics can't be fetched. You can type them manually.";
var cleanTitle = (t) => t.replace(/\s*[\(\[].*?[\)\]]/g, "").replace(/\s+-\s+.*$/, "").trim();
var stripFeat = (t) => t.replace(/\s*[\(\[]\s*(?:feat|ft|featuring|with)\.?\s[^\)\]]*[\)\]]/gi, "").replace(/\s+(?:feat|ft|featuring)\.?\s.*$/i, "").trim();
function lyricQueries(artist, title) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const add = (a, t) => {
		a = (a || "").trim();
		t = (t || "").trim();
		const k = (a + "|" + t).toLowerCase();
		if (a && t && !seen.has(k)) {
			seen.add(k);
			out.push([a, t]);
		}
	};
	const a1 = artist.trim();
	const a2 = stripFeat(a1);
	const a3 = a2.split(/\s*(?:,|&|;|\band\b)\s*/i)[0];
	const tc = cleanTitle(title);
	const tn = stripFeat(tc);
	add(a1, tc);
	add(a1, tn);
	add(a2, tn);
	add(a3, tn);
	add(a1, title);
	return out;
}
function stripLrc(text) {
	return String(text || "").split(/\r?\n/).filter((l) => !/^\s*\[[a-z]{1,}:[^\]]*\]\s*$/i.test(l)).map((l) => l.replace(/\[\d{1,3}:\d{2}(?:[.:]\d{1,3})?\]/g, "").replace(/<\d{1,3}:\d{2}(?:[.:]\d{1,3})?>/g, "").trim()).join("\n");
}
function parseStanzas(raw) {
	const lines = String(raw || "").replace(/\r\n?/g, "\n").split("\n").map((l) => l.trim()).filter((l) => l && !/^paroles de la chanson/i.test(l));
	const blocks = [];
	for (let i = 0; i < lines.length; i += 1) blocks.push(lines.slice(i, i + 1).join("\n"));
	return blocks;
}
function bestLrclib(list, duration) {
	const ok = (Array.isArray(list) ? list : []).filter((r) => r && !r.instrumental && (r.plainLyrics && r.plainLyrics.trim() || r.syncedLyrics && r.syncedLyrics.trim()));
	if (!ok.length) return null;
	if (duration > 0) ok.sort((a, b) => Math.abs((a.duration || 1e9) - duration) - Math.abs((b.duration || 1e9) - duration));
	return ok[0];
}
var lrcText = (r) => r && !r.instrumental ? r.plainLyrics && r.plainLyrics.trim() ? r.plainLyrics : r.syncedLyrics ? stripLrc(r.syncedLyrics) : "" : "";
async function fetchLyrics(artist, title, duration = 0, stale = () => false) {
	const q = lyricQueries(artist, title);
	const asHit = (text, source) => {
		const blocks = parseStanzas(text);
		return blocks.length ? {
			blocks,
			source
		} : null;
	};
	let hit = null;
	try {
		const d = await fetchJson(`${LYRICS_API}/${encodeURIComponent(q[0][0])}/${encodeURIComponent(q[0][1])}`, LYRICS_TIMEOUT);
		hit = asHit(d && d.lyrics, "lyrics.ovh");
	} catch (_) {}
	for (const [a, t] of q.slice(0, 4)) {
		if (hit || stale()) break;
		try {
			hit = asHit(lrcText(await fetchJson(`${LRCLIB_API}/get?${`track_name=${encodeURIComponent(t)}&artist_name=${encodeURIComponent(a)}` + (duration > 0 ? `&duration=${Math.round(duration)}` : "")}`, LYRICS_TIMEOUT)), "LRCLIB");
		} catch (_) {}
	}
	const best = q[Math.min(1, q.length - 1)];
	for (const qs of [`track_name=${encodeURIComponent(q[0][1])}&artist_name=${encodeURIComponent(q[0][0])}`, `q=${encodeURIComponent(best[0] + " " + best[1])}`]) {
		if (hit || stale()) break;
		try {
			hit = asHit(lrcText(bestLrclib(await fetchJson(`${LRCLIB_API}/search?${qs}`, LYRICS_TIMEOUT), duration)), "LRCLIB");
		} catch (_) {}
	}
	if (!hit) throw new SearchError(navigator.onLine === false ? OFFLINE_LYRICS : NOT_FOUND);
	return hit;
}
var LyricsModal = ({ isOpen, onClose, artist, title, duration = 0, cardColor, onApplyLyrics, onToast }) => {
	const [blocks, setBlocks] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	const [source, setSource] = (0, import_react.useState)("");
	const [shakingIdx, setShakingIdx] = (0, import_react.useState)(null);
	const { r, g, b } = hexToRgb(cardColor);
	const lum = (r * 299 + g * 587 + b * 114) / 1e3;
	const textColor = contrastColor(cardColor);
	const highlightTextColor = lum < 60 ? "#ffffff" : cardColor;
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		if (!title.trim() || !artist.trim()) {
			setErrorMsg("Enter a song title and artist first, or pick one via Search.");
			setBlocks([]);
			setSelected([]);
			return;
		}
		let isMounted = true;
		setIsLoading(true);
		setErrorMsg(null);
		setSelected([]);
		setBlocks([]);
		setSource("");
		fetchLyrics(artist, title, duration, () => !isMounted).then((res) => {
			if (!isMounted) return;
			setBlocks(res.blocks);
			setSource(res.source);
			setIsLoading(false);
		}).catch((err) => {
			if (!isMounted) return;
			setErrorMsg(err.message || "Could not find lyrics for this song.");
			setIsLoading(false);
		});
		return () => {
			isMounted = false;
		};
	}, [
		isOpen,
		artist,
		title,
		duration
	]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && isOpen) onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);
	if (!isOpen) return null;
	const handleToggleBlock = (index) => {
		if (selected.includes(index)) setSelected((prev) => prev.filter((i) => i !== index));
		else {
			if (selected.length >= 4) {
				setShakingIdx(index);
				setTimeout(() => setShakingIdx(null), 400);
				onToast(`You can select up to 4 lines`);
				return;
			}
			setSelected((prev) => [...prev, index]);
		}
	};
	const handleContinue = () => {
		if (selected.length === 0) return;
		onApplyLyrics([...selected].sort((a, b) => a - b).map((i) => blocks[i]).join("\n"));
		onClose();
		onToast("Lyrics applied to card");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "dialog",
		"aria-modal": "true",
		className: "fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: onClose,
			className: "absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex flex-col w-full sm:max-w-xl h-[85vh] sm:h-[82vh] max-h-[820px] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-6",
			style: {
				backgroundColor: cardColor,
				color: textColor
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between px-5 py-4 border-b border-black/10 shrink-0",
					style: { backgroundColor: cardColor },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							"aria-label": "Close",
							className: "w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/10 active:scale-95 transition-all",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-6 h-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center min-w-0 flex-1 px-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold truncate",
									children: "Select Lyrics"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs opacity-75 truncate",
									children: selected.length ? `${selected.length} of 4 lines selected` : `Tap up to 4 lines`
								}),
								source && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] opacity-60 font-mono mt-0.5",
									children: ["Source: ", source]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 shrink-0" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-5 sm:p-7 space-y-2 overscroll-contain scrollbar-none",
					children: [
						isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-full flex flex-col items-center justify-center gap-3 py-16 opacity-85",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Fetching lyrics…"
							})]
						}),
						errorMsg && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-full flex flex-col items-center justify-center text-center p-6 gap-2 opacity-80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: errorMsg
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs opacity-75",
								children: "You can manually type or paste lyrics directly into the editor text field."
							})]
						}),
						!isLoading && !errorMsg && blocks.map((line, idx) => {
							const isSelected = selected.includes(idx);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleToggleBlock(idx),
								className: `w-full text-left p-3.5 sm:p-4 rounded-2xl font-bold text-lg sm:text-2xl tracking-tight leading-tight transition-all active:scale-[0.99] ${shakingIdx === idx ? "animate-bounce" : ""} ${isSelected ? "bg-black shadow-xl opacity-100 scale-[1.01]" : "opacity-40 hover:opacity-75 bg-transparent"}`,
								style: { color: isSelected ? highlightTextColor : textColor },
								children: line
							}, idx);
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "relative px-6 py-4 pb-8 sm:pb-4 border-t border-black/10 flex justify-center shrink-0",
					style: { backgroundColor: cardColor },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleContinue,
						disabled: selected.length === 0,
						className: "w-full max-w-sm py-3.5 px-6 rounded-full font-bold text-sm bg-white text-black hover:scale-102 active:scale-98 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl",
						children: "Continue"
					})
				})
			]
		})]
	});
};
var Toast = ({ message, isError }) => {
	if (!message) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "status",
		"aria-live": "polite",
		className: `fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] max-w-[90vw] md:max-w-md px-5 py-3 rounded-xl bg-[#222222]/95 backdrop-blur-md border border-[#333333] shadow-2xl text-sm font-medium text-white flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${isError ? "border-l-4 border-l-[#ff5c5c]" : "border-l-4 border-l-[#1db954]"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: message })
	});
};
var DEFAULT_STATE = {
	title: "Neon Hour",
	artist: "Night Market",
	lyrics: "City lights on the glass\nYour name in the static\nWe keep the chorus on\nUntil the room goes quiet",
	coverUrl: "",
	color: "#1DB954",
	theme: "classic",
	layoutKey: "square",
	coverShape: "auto",
	lyricFont: "auto",
	align: "left",
	hlLine: -1,
	bgStyle: "none",
	glareStyle: "diagonal",
	glare: 70,
	glareAuto: true,
	cardDepth: 48,
	autoFit: true,
	lyricSize: 48,
	transparent: false,
	scale: 2,
	fmt: "png",
	autoColor: true,
	hide: {
		cover: false,
		title: false,
		artist: false,
		logo: false,
		bar: true,
		code: true
	},
	trackId: null,
	preset: null
};
function useCardState() {
	const [state, setStateInternal] = (0, import_react.useState)(() => {
		const saved = loadSettings();
		return {
			...DEFAULT_STATE,
			...saved,
			hide: {
				...DEFAULT_STATE.hide,
				...saved.hide || {}
			}
		};
	});
	const [songMeta, setSongMeta] = (0, import_react.useState)(null);
	const historyRef = (0, import_react.useRef)([{
		color: state.color,
		theme: state.theme,
		title: state.title,
		artist: state.artist,
		lyrics: state.lyrics,
		layoutKey: state.layoutKey
	}]);
	const historyIndexRef = (0, import_react.useRef)(0);
	const isHistoryActionRef = (0, import_react.useRef)(false);
	const [canUndo, setCanUndo] = (0, import_react.useState)(false);
	const [canRedo, setCanRedo] = (0, import_react.useState)(false);
	const updateHistoryState = (0, import_react.useCallback)(() => {
		setCanUndo(historyIndexRef.current > 0);
		setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
	}, []);
	const pushHistory = (0, import_react.useCallback)((snapshot) => {
		if (isHistoryActionRef.current) return;
		const history = historyRef.current;
		const curIndex = historyIndexRef.current;
		const cur = history[curIndex];
		if (cur && cur.color === snapshot.color && cur.theme === snapshot.theme && cur.title === snapshot.title && cur.artist === snapshot.artist && cur.lyrics === snapshot.lyrics && cur.layoutKey === snapshot.layoutKey) return;
		historyRef.current = history.slice(0, curIndex + 1);
		historyRef.current.push(snapshot);
		if (historyRef.current.length > 100) historyRef.current.shift();
		historyIndexRef.current = historyRef.current.length - 1;
		updateHistoryState();
	}, [updateHistoryState]);
	const historyDebounceRef = (0, import_react.useRef)(null);
	const queueHistoryPush = (0, import_react.useCallback)((newState) => {
		if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);
		historyDebounceRef.current = setTimeout(() => {
			pushHistory({
				color: newState.color,
				theme: newState.theme,
				title: newState.title,
				artist: newState.artist,
				lyrics: newState.lyrics,
				layoutKey: newState.layoutKey
			});
		}, 400);
	}, [pushHistory]);
	const setState = (0, import_react.useCallback)((updater) => {
		setStateInternal((prev) => {
			const next = typeof updater === "function" ? updater(prev) : {
				...prev,
				...updater
			};
			saveSettings(next);
			queueHistoryPush(next);
			return next;
		});
	}, [queueHistoryPush]);
	const undo = (0, import_react.useCallback)(() => {
		if (historyIndexRef.current <= 0) return;
		historyIndexRef.current -= 1;
		const s = historyRef.current[historyIndexRef.current];
		isHistoryActionRef.current = true;
		setStateInternal((prev) => ({
			...prev,
			color: s.color,
			theme: s.theme,
			title: s.title,
			artist: s.artist,
			lyrics: s.lyrics,
			layoutKey: s.layoutKey
		}));
		updateHistoryState();
		setTimeout(() => {
			isHistoryActionRef.current = false;
		}, 50);
	}, [updateHistoryState]);
	const redo = (0, import_react.useCallback)(() => {
		if (historyIndexRef.current >= historyRef.current.length - 1) return;
		historyIndexRef.current += 1;
		const s = historyRef.current[historyIndexRef.current];
		isHistoryActionRef.current = true;
		setStateInternal((prev) => ({
			...prev,
			color: s.color,
			theme: s.theme,
			title: s.title,
			artist: s.artist,
			lyrics: s.lyrics,
			layoutKey: s.layoutKey
		}));
		updateHistoryState();
		setTimeout(() => {
			isHistoryActionRef.current = false;
		}, 50);
	}, [updateHistoryState]);
	const setTheme = (0, import_react.useCallback)((theme) => {
		setState((prev) => ({
			...prev,
			theme,
			glareStyle: prev.glareAuto ? THEME_GLARE[theme] || "diagonal" : prev.glareStyle
		}));
	}, [setState]);
	const setLayoutKey = (0, import_react.useCallback)((layoutKey) => {
		setState((prev) => ({
			...prev,
			layoutKey,
			preset: null
		}));
	}, [setState]);
	(0, import_react.useEffect)(() => {
		const hash = window.location.hash || "";
		const m = /^#look=([A-Za-z0-9_-]{1,6000})$/.exec(hash);
		if (!m) return;
		try {
			const o = decodeLookHash(m[1]);
			if (o && typeof o === "object") setState((prev) => ({
				...prev,
				theme: o.t || prev.theme,
				color: o.c || prev.color,
				glareStyle: o.g === "auto" ? THEME_GLARE[o.t] || "diagonal" : o.g || prev.glareStyle,
				glareAuto: o.g === "auto",
				glare: typeof o.gi === "number" ? o.gi : prev.glare,
				layoutKey: o.l || prev.layoutKey,
				coverShape: o.cs || prev.coverShape,
				lyricFont: o.lf || prev.lyricFont,
				bgStyle: o.bg || prev.bgStyle,
				cardDepth: typeof o.d === "number" ? o.d : prev.cardDepth,
				align: o.a || prev.align,
				autoColor: typeof o.ac === "boolean" ? o.ac : prev.autoColor,
				title: typeof o.ti === "string" ? o.ti : prev.title,
				artist: typeof o.ar === "string" ? o.ar : prev.artist,
				lyrics: typeof o.ly === "string" ? o.ly : prev.lyrics,
				coverUrl: typeof o.cu === "string" ? o.cu : prev.coverUrl
			}));
		} catch (e) {
			console.warn("Failed to parse look from hash", e);
		}
	}, [setState]);
	return {
		state,
		setState,
		setTheme,
		setLayoutKey,
		songMeta,
		setSongMeta,
		undo,
		redo,
		canUndo,
		canRedo
	};
}
var clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
function useTiltInteraction() {
	const [tilt, setTilt] = (0, import_react.useState)({ ...TILT_DEFAULT });
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const dragRef = (0, import_react.useRef)(null);
	return {
		tilt,
		setTilt,
		resetTilt: (0, import_react.useCallback)(() => {
			setTilt({ ...TILT_DEFAULT });
		}, []),
		isDragging,
		handlePointerDown: (0, import_react.useCallback)((e) => {
			dragRef.current = {
				x: e.clientX,
				y: e.clientY,
				rx: tilt.rx,
				ry: tilt.ry,
				rz: tilt.rz
			};
			e.currentTarget.setPointerCapture(e.pointerId);
			setIsDragging(true);
		}, [tilt]),
		handlePointerMove: (0, import_react.useCallback)((e) => {
			if (!dragRef.current) return;
			const dx = e.clientX - dragRef.current.x;
			const dy = e.clientY - dragRef.current.y;
			if (e.shiftKey) setTilt((prev) => ({
				...prev,
				rz: clamp(Math.round(dragRef.current.rz + dx * .3), -180, 180)
			}));
			else setTilt((prev) => ({
				...prev,
				ry: clamp(Math.round(dragRef.current.ry + dx * .3), -75, 75),
				rx: clamp(Math.round(dragRef.current.rx - dy * .3), -75, 75)
			}));
		}, []),
		handlePointerUp: (0, import_react.useCallback)(() => {
			dragRef.current = null;
			setIsDragging(false);
		}, []),
		handleWheel: (0, import_react.useCallback)((e) => {
			e.preventDefault();
			setTilt((prev) => ({
				...prev,
				perspective: clamp(Math.round(prev.perspective + e.deltaY * 2), 400, 3e3)
			}));
		}, [])
	};
}
function App() {
	const { state, setState, setTheme, setLayoutKey, songMeta, setSongMeta, undo, redo, canUndo, canRedo } = useCardState();
	const { tilt, resetTilt, isDragging, handlePointerDown, handlePointerMove, handlePointerUp, handleWheel } = useTiltInteraction();
	const [activeTab, setActiveTab] = (0, import_react.useState)("style");
	const [coverImg, setCoverImg] = (0, import_react.useState)(null);
	const [coverPalette, setCoverPalette] = (0, import_react.useState)([]);
	const [renderedLyricSize, setRenderedLyricSize] = (0, import_react.useState)(state.lyricSize);
	const [hasTextOverflow, setHasTextOverflow] = (0, import_react.useState)(false);
	const [fontEpoch, setFontEpoch] = (0, import_react.useState)(0);
	const [lyricsModalOpen, setLyricsModalOpen] = (0, import_react.useState)(false);
	const [exportModalOpen, setExportModalOpen] = (0, import_react.useState)(false);
	const [keyboardHelpOpen, setKeyboardHelpOpen] = (0, import_react.useState)(false);
	const [toastMessage, setToastMessage] = (0, import_react.useState)(null);
	const [toastIsError, setToastIsError] = (0, import_react.useState)(false);
	const toastTimerRef = (0, import_react.useRef)(null);
	const showToast = (0, import_react.useCallback)((msg, isError = false) => {
		setToastMessage(msg);
		setToastIsError(isError);
		if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
		toastTimerRef.current = setTimeout(() => setToastMessage(null), 2200);
	}, []);
	(0, import_react.useEffect)(() => {
		const faces = [
			"400 16px \"Press Start 2P\"",
			"400 32px \"Patrick Hand\"",
			"400 32px \"Permanent Marker\"",
			"400 32px \"Bangers\"",
			"600 32px \"Newsreader\"",
			"700 32px \"Orbitron\"",
			"700 32px \"Fredoka\"",
			"700 32px \"Poppins\""
		];
		let alive = true;
		Promise.all(faces.map((f) => document.fonts.load(f).catch(() => void 0))).then(() => {
			if (!alive) return;
			incrementFontGen();
			setFontEpoch((n) => n + 1);
		});
		return () => {
			alive = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!state.coverUrl) {
			setCoverImg(null);
			setCoverPalette([]);
			return;
		}
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.referrerPolicy = "no-referrer";
		img.onload = () => {
			setCoverImg(img);
			try {
				const pal = extractCoverColors(img);
				setCoverPalette(pal);
				if (state.autoColor && pal.length > 0) setState({ color: pal[0] });
			} catch {
				setCoverPalette([]);
			}
		};
		img.onerror = () => {
			setCoverImg(null);
			setCoverPalette([]);
			showToast("Cover art could not load.", true);
		};
		img.src = state.coverUrl;
	}, [
		state.coverUrl,
		state.autoColor,
		setState,
		showToast
	]);
	const handleMatchCoverColor = (0, import_react.useCallback)(() => {
		if (coverPalette.length > 0) setState({
			color: coverPalette[0],
			autoColor: false
		});
		else showToast("No cover yet.", true);
	}, [
		coverPalette,
		setState,
		showToast
	]);
	const handleSelectSong = (0, import_react.useCallback)((song) => {
		setState({
			title: song.title,
			artist: song.artist,
			coverUrl: song.cover,
			trackId: null
		});
		setSongMeta({
			title: song.title,
			artist: song.artist,
			duration: song.duration
		});
		setActiveTab("text");
		setLyricsModalOpen(true);
	}, [setState, setSongMeta]);
	const handleSpotifyTrack = (0, import_react.useCallback)((coverUrl, trackId) => {
		setState({
			coverUrl,
			trackId
		});
	}, [setState]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			const activeEl = document.activeElement;
			if (activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA" || activeEl?.tagName === "SELECT" || activeEl?.hasAttribute("contenteditable")) return;
			if (lyricsModalOpen || exportModalOpen || keyboardHelpOpen) return;
			if (e.ctrlKey || e.metaKey) {
				const key = e.key.toLowerCase();
				if (key === "z") {
					e.preventDefault();
					if (e.shiftKey) redo();
					else undo();
					return;
				}
				if (key === "y") {
					e.preventDefault();
					redo();
					return;
				}
			}
			if (e.key === "?") {
				e.preventDefault();
				setKeyboardHelpOpen((prev) => !prev);
			} else if (e.key.toLowerCase() === "e") {
				e.preventDefault();
				setExportModalOpen(true);
			} else if ([
				"1",
				"2",
				"3",
				"4",
				"5"
			].includes(e.key)) {
				e.preventDefault();
				setLayoutKey([
					"square",
					"wide",
					"story",
					"portrait",
					"tall"
				][parseInt(e.key, 10) - 1]);
			} else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
				e.preventDefault();
				const themes = Object.keys(THEMES);
				const nextTheme = themes[(themes.indexOf(state.theme) + (e.key === "ArrowRight" ? 1 : -1) + themes.length) % themes.length];
				setTheme(nextTheme);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		lyricsModalOpen,
		exportModalOpen,
		keyboardHelpOpen,
		redo,
		undo,
		setLayoutKey,
		setTheme,
		state.theme
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh w-full flex-col overflow-hidden bg-[#121212] text-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
					canUndo,
					canRedo,
					onUndo: undo,
					onRedo: redo,
					onOpenHelp: () => setKeyboardHelpOpen(true),
					onToast: showToast
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col lg:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "order-2 flex min-h-0 flex-1 flex-col border-t border-[#282828] bg-[#181818] lg:order-1 lg:w-[400px] lg:flex-none lg:border-t-0 lg:border-r xl:w-[424px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden shrink-0 lg:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
								canUndo,
								canRedo,
								onUndo: undo,
								onRedo: redo,
								onOpenHelp: () => setKeyboardHelpOpen(true),
								onToast: showToast
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabNav, {
							activeTab,
							onTabChange: setActiveTab
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-5",
							children: [
								activeTab === "search" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchSection, {
									onSelectSong: handleSelectSong,
									onSpotifyTrack: handleSpotifyTrack,
									onToast: showToast
								}),
								activeTab === "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextSection, {
									state,
									onChange: setState,
									onOpenLyricsModal: () => setLyricsModalOpen(true)
								}),
								activeTab === "style" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleSection, {
									state,
									onChange: setState,
									onSetTheme: setTheme,
									onSetLayout: setLayoutKey,
									coverPalette,
									onMatchCoverColor: handleMatchCoverColor,
									renderedLyricSize,
									hasTextOverflow
								}),
								activeTab === "layout" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutSection, {
									state,
									onChange: setState,
									onToast: showToast
								}),
								activeTab === "looks" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LooksSection, {
									state,
									onApplyLook: (look) => {
										setState((prev) => ({
											...prev,
											theme: look.t || prev.theme,
											color: look.c || prev.color,
											glareStyle: look.g === "auto" ? prev.glareStyle : look.g || prev.glareStyle,
											glare: typeof look.gi === "number" ? look.gi : prev.glare,
											layoutKey: look.l || prev.layoutKey,
											coverShape: look.cs || prev.coverShape,
											lyricFont: look.lf || prev.lyricFont,
											bgStyle: look.bg || prev.bgStyle,
											cardDepth: typeof look.d === "number" ? look.d : prev.cardDepth,
											align: look.a || prev.align,
											autoColor: typeof look.ac === "boolean" ? look.ac : prev.autoColor
										}));
									},
									onToast: showToast
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
							className: "shrink-0 border-t border-[#282828] bg-[#141414]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setExportModalOpen(true),
								className: "flex w-full items-center justify-center gap-2 rounded-full bg-[#1db954] py-3 text-sm font-bold text-black active:scale-[0.98]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Export card"]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "order-1 h-[34svh] min-h-[210px] max-h-[380px] shrink-0 lg:order-2 lg:h-auto lg:max-h-none lg:min-h-0 lg:flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stage, {
						state,
						coverImg,
						tilt,
						isDragging,
						fontEpoch,
						onPointerDown: handlePointerDown,
						onPointerMove: handlePointerMove,
						onPointerUp: handlePointerUp,
						onWheel: handleWheel,
						onResetTilt: resetTilt,
						onCardRenderedSize: (size, overflow) => {
							setRenderedLyricSize(size);
							setHasTextOverflow(overflow);
						}
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LyricsModal, {
				isOpen: lyricsModalOpen,
				onClose: () => setLyricsModalOpen(false),
				artist: state.artist,
				title: state.title,
				duration: songMeta?.duration,
				cardColor: state.color,
				onApplyLyrics: (lyrics) => setState({ lyrics }),
				onToast: showToast
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportModal, {
				isOpen: exportModalOpen,
				onClose: () => setExportModalOpen(false),
				state,
				coverImg,
				onUpdateState: setState,
				onToast: showToast
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyboardHelpModal, {
				isOpen: keyboardHelpOpen,
				onClose: () => setKeyboardHelpOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toast, {
				message: toastMessage,
				isError: toastIsError
			})
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => SplitComponent });
var SplitComponent = App;
//#endregion
export { mixHex as a, LAYOUTS as i, paintGlare as n, renderCard as r, routes_exports as t };
