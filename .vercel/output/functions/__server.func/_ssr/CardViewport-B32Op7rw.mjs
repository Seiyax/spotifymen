import { i as __toESM } from "../_runtime.mjs";
import { c as LinearFilter, d as NearestFilter, f as Object3D, h as require_react, i as useFrame, l as LinearMipmapLinearFilter, m as require_jsx_runtime, n as RoundedBox, o as CanvasTexture, p as SRGBColorSpace, r as Canvas, s as ClampToEdgeWrapping, t as ContactShadows, u as MathUtils } from "../_libs/@react-three/drei+[...].mjs";
import { a as mixHex, i as LAYOUTS, n as paintGlare, r as renderCard } from "./routes-CfjlphHC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CardViewport-B32Op7rw.js
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
	const layout = LAYOUTS[state.layoutKey];
	const aspect = layout.w / layout.h;
	const max = 2.42;
	const w = aspect >= 1 ? max : max * aspect;
	const h = aspect >= 1 ? max / aspect : max;
	const depthMul = state.theme === "dankoe" || state.theme === "flatvector" ? .62 : state.theme === "lego" ? 1.35 : state.theme === "pixelart" || state.theme === "pixel" ? 1.15 : 1;
	const depth = (.055 + state.cardDepth / 100 * .22) * depthMul;
	const radiusWorld = Math.min(layout.radius, 80) / layout.w * w;
	const radius = Math.min(radiusWorld, Math.min(w, h) * .18, Math.max(.02, depth * .42));
	const side = mixHex(state.color, "#000000", state.theme === "chalkboard" ? .1 : .38);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		rotation: [
			MathUtils.degToRad(tilt.rx),
			MathUtils.degToRad(tilt.ry),
			MathUtils.degToRad(tilt.rz)
		],
		children: [
			state.theme === "chalkboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundedBox, {
				args: [
					w + .2,
					h + .2,
					Math.max(.05, depth * .78)
				],
				radius: .05,
				smoothness: 3,
				position: [
					0,
					0,
					-.03
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [w * 1.12, h * 1.12] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
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
			state.theme === "zackd" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-w / 2 - .07,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.045,
					h * .92,
					depth * .8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#141414",
					roughness: .6,
					metalness: .2
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					w / 2 + .07,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.045,
					h * .92,
					depth * .8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#141414",
					roughness: .6,
					metalness: .2
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundedBox, {
				args: [
					w,
					h,
					depth
				],
				radius,
				smoothness: state.theme === "ps2" ? 1 : 4,
				bevelSegments: state.theme === "ps2" ? 1 : 3,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: state.theme === "lego" ? state.color : side,
					roughness: mat.roughness,
					metalness: mat.metalness
				})
			}),
			tex && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					depth / 2 + .006
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [w * .99, h * .99] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrontFace, {
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
function CardViewport({ state, coverImg, tilt, dragging, fontEpoch, onSize }) {
	const tex = useCardTexture(state, coverImg, fontEpoch, onSize);
	const dpr = typeof window !== "undefined" && window.innerWidth < 800 ? [1, 1.25] : [1, 1.6];
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .62 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					-3.2,
					4.2,
					5.4
				],
				intensity: 1.25
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					2.6,
					-1.4,
					3
				],
				intensity: .28,
				color: state.color
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("spotLight", {
				position: [
					0,
					3.2,
					4.5
				],
				angle: .55,
				penumbra: .85,
				intensity: 1.35
			}),
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
				opacity: .48,
				scale: 9,
				blur: 2.5,
				far: 4
			})
		]
	});
}
//#endregion
export { CardViewport as default };
