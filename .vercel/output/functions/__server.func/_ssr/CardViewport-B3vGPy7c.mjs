import { i as __toESM } from "../_runtime.mjs";
import { a as useThree, c as ClampToEdgeWrapping, d as MathUtils, f as NearestFilter, g as require_react, h as require_jsx_runtime, i as useFrame, l as LinearFilter, m as SRGBColorSpace, n as RoundedBox, p as Object3D, r as Canvas, s as CanvasTexture, t as ContactShadows, u as LinearMipmapLinearFilter } from "../_libs/@react-three/drei+[...].mjs";
import { a as renderCard, c as mixHex, i as paintGlare, n as setPreviewGrab, o as LAYOUTS, r as getPalette, s as TILT_DEFAULT } from "./routes-BuTKxiYG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CardViewport-B3vGPy7c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function lookFor(theme) {
	switch (theme) {
		case "pixel":
		case "pixelart":
		case "gameboy": return {
			roughness: 1,
			metalness: 0,
			clearcoat: 0,
			emissive: 0,
			nearest: true,
			toon: false,
			basic: true
		};
		case "chalkboard":
		case "notebook":
		case "newspaper":
		case "receipt": return {
			roughness: .94,
			metalness: 0,
			clearcoat: 0,
			emissive: 0,
			nearest: false,
			toon: false,
			basic: false
		};
		case "glowsketch":
		case "neon":
		case "cyberpunk": return {
			roughness: .4,
			metalness: .06,
			clearcoat: .25,
			emissive: .22,
			nearest: false,
			toon: false,
			basic: false
		};
		case "ps2": return {
			roughness: .58,
			metalness: .12,
			clearcoat: .2,
			emissive: .04,
			nearest: true,
			toon: false,
			basic: false
		};
		case "comic":
		case "comicart":
		case "brutalism": return {
			roughness: .88,
			metalness: 0,
			clearcoat: 0,
			emissive: 0,
			nearest: false,
			toon: true,
			basic: false
		};
		case "flatvector":
		case "sticker": return {
			roughness: 1,
			metalness: 0,
			clearcoat: 0,
			emissive: 0,
			nearest: false,
			toon: false,
			basic: true
		};
		case "dankoe": return {
			roughness: .82,
			metalness: .02,
			clearcoat: .04,
			emissive: 0,
			nearest: false,
			toon: false,
			basic: false
		};
		case "cgimotion":
		case "y2k":
		case "holo":
		case "aurora": return {
			roughness: .12,
			metalness: .62,
			clearcoat: 1,
			emissive: .08,
			nearest: false,
			toon: false,
			basic: false
		};
		case "lego":
		case "clay": return {
			roughness: .28,
			metalness: .02,
			clearcoat: .55,
			emissive: 0,
			nearest: false,
			toon: false,
			basic: false
		};
		case "zackd": return {
			roughness: .62,
			metalness: .18,
			clearcoat: .15,
			emissive: 0,
			nearest: false,
			toon: false,
			basic: false
		};
		case "glass": return {
			roughness: .06,
			metalness: .08,
			clearcoat: 1,
			emissive: .02,
			nearest: false,
			toon: false,
			basic: false
		};
		case "vinyl": return {
			roughness: .22,
			metalness: .7,
			clearcoat: .7,
			emissive: 0,
			nearest: false,
			toon: false,
			basic: false
		};
		default: return {
			roughness: .42,
			metalness: .06,
			clearcoat: .28,
			emissive: 0,
			nearest: false,
			toon: false,
			basic: false
		};
	}
}
function shellFor(theme, color) {
	const P = getPalette(theme, color);
	const paper = theme === "ticket" || theme === "polaroid" || theme === "notebook" || theme === "newspaper" || theme === "receipt" || theme === "cassette";
	const sharp = theme === "brutalism" || theme === "pixel" || theme === "pixelart" || theme === "comic" || theme === "comicart" || theme === "receipt" || theme === "newspaper" || theme === "zackd" || theme === "gameboy" || theme === "dankoe" || theme === "ps2";
	let side = mixHex(P.surface, "#000000", .45);
	let depthMul = 1;
	let radiusMul = 1;
	if (theme === "vinyl") {
		side = "#0c0c0c";
		depthMul = .55;
		radiusMul = .85;
	} else if (theme === "glass") {
		side = mixHex(color, "#ffffff", .55);
		depthMul = .62;
	} else if (theme === "lego" || theme === "clay") {
		side = theme === "lego" ? color : mixHex(P.surface, "#000000", .16);
		depthMul = theme === "lego" ? 1.45 : 1.25;
		radiusMul = theme === "clay" ? 1.35 : .7;
	} else if (theme === "pixel" || theme === "pixelart") {
		side = "#141414";
		depthMul = .85;
		radiusMul = 0;
	} else if (theme === "gameboy") {
		side = "#8d9368";
		depthMul = 1.05;
		radiusMul = .15;
	} else if (paper) {
		side = mixHex(P.surface, "#000000", .14);
		depthMul = .32;
		radiusMul = theme === "receipt" || theme === "newspaper" ? 0 : .45;
	} else if (theme === "chalkboard") {
		side = "#5c3b22";
		depthMul = .9;
	} else if (theme === "neon" || theme === "cyberpunk" || theme === "glowsketch") {
		side = "#07070c";
		depthMul = .7;
	} else if (theme === "classic" || theme === "wrapped" || theme === "aurora") side = mixHex(color, "#000000", .62);
	else if (sharp) {
		side = mixHex(P.surface, "#000000", .62);
		radiusMul = 0;
	}
	return {
		side,
		depthMul,
		radiusMul,
		sharp
	};
}
function useCardTexture(state, coverImg, fontEpoch, onSize) {
	const holder = (0, import_react.useRef)(null);
	const [tex, setTex] = (0, import_react.useState)(null);
	const sizeRef = (0, import_react.useRef)(onSize);
	sizeRef.current = onSize;
	(0, import_react.useEffect)(() => {
		const layout = LAYOUTS[state.layoutKey];
		let slot = holder.current;
		if (!slot || slot.w !== layout.w || slot.h !== layout.h) {
			const canvas = document.createElement("canvas");
			canvas.width = layout.w;
			canvas.height = layout.h;
			const next = new CanvasTexture(canvas);
			next.colorSpace = SRGBColorSpace;
			next.anisotropy = 8;
			next.wrapS = ClampToEdgeWrapping;
			next.wrapT = ClampToEdgeWrapping;
			slot?.tex.dispose();
			slot = {
				canvas,
				tex: next,
				w: layout.w,
				h: layout.h
			};
			holder.current = slot;
			setTex(next);
		}
		const ctx = slot.canvas.getContext("2d");
		if (!ctx) return;
		const flat = {
			...state,
			cardDepth: 0
		};
		const tilt = {
			rx: 0,
			ry: 0,
			rz: 0,
			perspective: 1200
		};
		const info = renderCard(ctx, flat, layout, coverImg, tilt, {
			flat: true,
			fullBleed: false
		});
		paintGlare(ctx, flat, layout, tilt, true);
		sizeRef.current?.(info.size, info.overflow);
		const pixel = state.theme === "pixel" || state.theme === "pixelart" || state.theme === "gameboy" || state.theme === "ps2";
		slot.tex.magFilter = pixel ? NearestFilter : LinearFilter;
		slot.tex.minFilter = pixel ? NearestFilter : LinearMipmapLinearFilter;
		slot.tex.generateMipmaps = !pixel;
		slot.tex.needsUpdate = true;
	}, [
		state,
		coverImg,
		fontEpoch
	]);
	(0, import_react.useEffect)(() => () => holder.current?.tex.dispose(), []);
	return tex;
}
function FrontFace({ tex, theme, color }) {
	const mat = lookFor(theme);
	const grad = (0, import_react.useMemo)(() => {
		const c = document.createElement("canvas");
		c.width = 4;
		c.height = 1;
		const g = c.getContext("2d");
		if (!g) return null;
		[
			"#222",
			"#666",
			"#bbb",
			"#fff"
		].forEach((col, i) => {
			g.fillStyle = col;
			g.fillRect(i, 0, 1, 1);
		});
		const t = new CanvasTexture(c);
		t.magFilter = NearestFilter;
		t.minFilter = NearestFilter;
		t.colorSpace = "";
		return t;
	}, []);
	if (mat.basic) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
		map: tex,
		transparent: true,
		toneMapped: false
	});
	if (mat.toon && grad) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshToonMaterial", {
		map: tex,
		gradientMap: grad,
		transparent: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshPhysicalMaterial", {
		map: tex,
		transparent: true,
		roughness: mat.roughness,
		metalness: mat.metalness,
		clearcoat: mat.clearcoat,
		clearcoatRoughness: .28,
		emissive: color,
		emissiveIntensity: mat.emissive
	});
}
function Studs({ w, h, z, color }) {
	const count = Math.max(5, Math.round(w / .34));
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const mesh = ref.current;
		if (!mesh) return;
		const dummy = new Object3D();
		const y = h / 2 - .11;
		for (let i = 0; i < count; i++) {
			const x = -w / 2 + .16 + (w - .32) * (i + .5) / count;
			dummy.position.set(x, y, z);
			dummy.rotation.set(Math.PI / 2, 0, 0);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		}
		mesh.instanceMatrix.needsUpdate = true;
	}, [
		count,
		w,
		h,
		z
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref,
		args: [
			void 0,
			void 0,
			count
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			.055,
			.06,
			.05,
			18
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshPhysicalMaterial", {
			color,
			roughness: .26,
			clearcoat: .7
		})]
	});
}
function CardMesh({ state, tex, tilt, dragging }) {
	const group = (0, import_react.useRef)(null);
	const spin = (0, import_react.useRef)(null);
	const pose = tilt ?? TILT_DEFAULT;
	const layout = LAYOUTS[state.layoutKey];
	const aspect = layout.w / layout.h;
	const max = 2.42;
	const w = aspect >= 1 ? max : max * aspect;
	const h = aspect >= 1 ? max / aspect : max;
	const shell = shellFor(state.theme, state.color);
	const depth = (.05 + state.cardDepth / 100 * .18) * shell.depthMul;
	const radiusWorld = Math.min(layout.radius, 80) / layout.w * w * shell.radiusMul;
	const radius = shell.sharp ? .004 : Math.min(radiusWorld, Math.min(w, h) * .12, Math.max(.012, depth * .35));
	const mat = lookFor(state.theme);
	const draggingRef = (0, import_react.useRef)(dragging);
	draggingRef.current = dragging;
	useFrame(({ clock }) => {
		const t = clock.elapsedTime;
		if (group.current && !draggingRef.current) group.current.position.y = Math.sin(t * .85) * .03;
		else if (group.current) group.current.position.y = 0;
		if (spin.current && (state.theme === "cgimotion" || state.theme === "holo" || state.theme === "y2k")) {
			spin.current.position.x = Math.sin(t * .8) * 2.4;
			spin.current.position.y = .9 + Math.cos(t * .6) * .7;
		}
	});
	const bodyMat = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
		color: shell.side,
		roughness: mat.roughness,
		metalness: state.theme === "vinyl" ? .55 : mat.metalness
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		rotation: [
			MathUtils.degToRad(pose.rx || 0),
			MathUtils.degToRad(pose.ry || 0),
			MathUtils.degToRad(pose.rz || 0)
		],
		children: [
			state.theme === "chalkboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundedBox, {
				args: [
					w + .16,
					h + .16,
					Math.max(.04, depth * .9)
				],
				radius: .04,
				smoothness: 2,
				position: [
					0,
					0,
					-.02
				],
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#6a4324",
					roughness: .78
				})
			}),
			(state.theme === "glowsketch" || state.theme === "neon" || state.theme === "cyberpunk") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					-.08
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [w * 1.08, h * 1.08] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: state.color,
					transparent: true,
					opacity: .22,
					blending: 2,
					depthWrite: false
				})]
			}),
			state.theme === "ps2" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.15,
					-.05,
					-.55
				],
				rotation: [
					.5,
					.7,
					.2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("icosahedronGeometry", { args: [.72, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: state.color,
					flatShading: true,
					wireframe: true,
					transparent: true,
					opacity: .45
				})]
			}),
			state.theme === "vinyl" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					w * .28,
					-h * .2,
					-.015
				],
				rotation: [
					Math.PI / 2,
					0,
					.15
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					Math.min(w, h) * .38,
					Math.min(w, h) * .38,
					.018,
					40
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#101010",
					roughness: .4,
					metalness: .35
				})]
			}),
			shell.sharp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				w,
				h,
				depth
			] }), bodyMat] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundedBox, {
				args: [
					w,
					h,
					depth
				],
				radius,
				smoothness: state.theme === "ps2" ? 1 : 3,
				bevelSegments: 2,
				children: bodyMat
			}),
			tex && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					depth / 2 + .004
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [w * .992, h * .992] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrontFace, {
					tex,
					theme: state.theme,
					color: state.color
				})]
			}),
			state.theme === "lego" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studs, {
				w,
				h,
				z: depth / 2 + .03,
				color: mixHex(state.color, "#ffffff", .18)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				ref: spin,
				position: [
					1.4,
					1.2,
					2.2
				],
				intensity: state.theme === "cgimotion" ? 8 : 0,
				color: state.color,
				distance: 8
			})
		]
	});
}
function PreviewGrab() {
	const gl = useThree((s) => s.gl);
	const scene = useThree((s) => s.scene);
	const camera = useThree((s) => s.camera);
	(0, import_react.useEffect)(() => {
		setPreviewGrab(() => {
			gl.render(scene, camera);
			const src = gl.domElement;
			const out = document.createElement("canvas");
			out.width = src.width;
			out.height = src.height;
			const ctx = out.getContext("2d");
			if (!ctx) return null;
			ctx.drawImage(src, 0, 0);
			return out;
		});
		return () => setPreviewGrab(null);
	}, [
		gl,
		scene,
		camera
	]);
	return null;
}
function CardViewport({ state, coverImg, tilt, dragging, fontEpoch, onSize }) {
	const tex = useCardTexture(state, coverImg, fontEpoch, onSize);
	const dpr = typeof window !== "undefined" && window.innerWidth < 800 ? [1, 1.25] : [1, 1.75];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		dpr,
		shadows: false,
		gl: {
			antialias: true,
			alpha: true,
			powerPreference: "high-performance"
		},
		camera: {
			position: [
				0,
				.04,
				6.55
			],
			fov: 28
		},
		onCreated: ({ gl }) => gl.setClearColor(0, 0),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .7 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					-3.2,
					4.2,
					5.4
				],
				intensity: 1.15
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					2.4,
					-1.2,
					3.2
				],
				intensity: .22,
				color: "#f2f2f2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("spotLight", {
				position: [
					0,
					3.2,
					4.5
				],
				angle: .55,
				penumbra: .85,
				intensity: 1.05
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewGrab, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMesh, {
				state,
				tex,
				tilt,
				dragging
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactShadows, {
				position: [
					0,
					-1.55,
					0
				],
				opacity: .42,
				scale: 9,
				blur: 2.5,
				far: 4
			})
		]
	});
}
//#endregion
export { CardViewport as default };
