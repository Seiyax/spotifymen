import React, { useEffect, useRef, useState } from 'react';
import { CardState, TiltState } from '../../types';
import { LAYOUTS } from '../../engine/constants';
import {
  cardGeom,
  renderCard,
} from '../../engine/canvasRenderer';
import { Pin, RotateCcw } from 'lucide-react';

interface StageProps {
  state: CardState;
  coverImg: HTMLImageElement | null;
  tilt: TiltState;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
  onResetTilt: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  onCodeLoad: () => void;
  onCardRenderedSize?: (size: number, overflow: boolean) => void;
}

export const Stage: React.FC<StageProps> = ({
  state,
  coverImg,
  tilt,
  isDragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
  onResetTilt,
  isPinned,
  onTogglePin,
  onCodeLoad,
  onCardRenderedSize,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const layout = LAYOUTS[state.layoutKey];
  const [tipDismissed, setTipDismissed] = useState(false);

  // Re-render canvas whenever relevant props change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== layout.w || canvas.height !== layout.h) {
      canvas.width = layout.w;
      canvas.height = layout.h;
    }

    let animId = requestAnimationFrame(() => {
      const info = renderCard(ctx, state, layout, coverImg, tilt, {
        fullBleed: false,
        flat: false,
        onCodeLoad,
      });
      if (onCardRenderedSize) {
        onCardRenderedSize(info.size, info.overflow);
      }
    });

    return () => cancelAnimationFrame(animId);
  }, [state, coverImg, tilt, layout, onCodeLoad, onCardRenderedSize]);

  // Compute CSS glare gradient
  const getGlareCss = () => {
    if (state.glareStyle === 'none' || state.glare <= 0) return 'none';
    if (state.glareStyle === 'spotlight' || state.glareStyle === 'follow') {
      return `radial-gradient(ellipse 85% 85% at 30% 22%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.34) 30%, rgba(255,255,255,0.08) 65%, rgba(255,255,255,0) 100%)`;
    }
    return `linear-gradient(115deg, transparent 28%, rgba(255,255,255,0.55) 42%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.38) 58%, transparent 72%)`;
  };

  // Compute geom for glare inset & border radius
  const geo = cardGeom(
    state.layoutKey,
    state.theme,
    state.cardDepth,
    state.bgStyle,
    tilt
  );
  const pc = (v: number) => (v * 100).toFixed(4) + '%';
  const insetStyle = `${pc(geo.y / layout.h)} ${pc(
    (layout.w - geo.x - geo.w) / layout.w
  )} ${pc((layout.h - geo.y - geo.h) / layout.h)} ${pc(geo.x / layout.w)}`;
  const radiusStyle = `${pc(geo.r / geo.w)} / ${pc(geo.r / geo.h)}`;

  const aspectRatio = layout.w / layout.h;

  return (
    <main
      className={`relative flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden transition-all duration-300 min-h-[380px] md:min-h-0 select-none ${
        isPinned ? 'sticky top-0 z-20 shadow-2xl bg-[#121212]' : ''
      }`}
      style={
        {
          '--glow': state.color,
        } as React.CSSProperties
      }
    >
      {/* Background radial atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-colors duration-700 animate-pulse"
        style={{
          background: `radial-gradient(650px 520px at 50% 50%, ${state.color}33, transparent 70%), radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0) 0 0 / 24px 24px`,
        }}
      />

      {/* Top badges & controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="text-[11px] font-medium tracking-wide text-[#b3b3b3] bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1db954] animate-ping" />
          <span>
            {layout.label.split(' · ')[0]} · {layout.w} × {layout.h} px
          </span>
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePin}
          title={isPinned ? 'Unpin preview' : 'Pin preview to top'}
          aria-pressed={isPinned}
          className={`md:hidden flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-md transition-all shadow-sm ${
            isPinned
              ? 'bg-[#1db954] text-black border-[#1db954]'
              : 'bg-white/5 text-[#b3b3b3] border-white/10 hover:text-white'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onResetTilt}
          title="Reset tilt"
          className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-[#b3b3b3] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all shadow-sm active:scale-95"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset tilt</span>
        </button>
      </div>

      {/* 3D Scene */}
      <div
        ref={sceneRef}
        onPointerDown={(e) => {
          setTipDismissed(true);
          onPointerDown(e);
        }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onDoubleClick={onResetTilt}
        className={`relative z-1 flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform touch-none ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{
          width: `min(100%, ${layout.preview[0]}px, calc((85vh - 140px) * ${aspectRatio}))`,
          aspectRatio: `${aspectRatio}`,
          perspective: `${tilt.perspective}px`,
          filter:
            'drop-shadow(0 40px 35px rgba(0, 0, 0, 0.6)) drop-shadow(0 12px 14px rgba(0, 0, 0, 0.4))',
        }}
      >
        {/* Tilted Card Canvas Container */}
        <div
          className={`relative w-full h-full transition-transform will-change-transform ${
            isDragging
              ? 'transition-none'
              : 'duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]'
          }`}
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) rotateZ(${tilt.rz}deg)`,
          }}
        >
          <canvas
            ref={canvasRef}
            width={layout.w}
            height={layout.h}
            className="w-full h-full block rounded-[inherit]"
          />

          {/* Glare Glass Overlay */}
          <div
            className="absolute pointer-events-none transition-all duration-300"
            style={{
              inset: insetStyle,
              borderRadius: radiusStyle,
              background: getGlareCss(),
              opacity: state.glare / 100,
              mixBlendMode: 'overlay',
            }}
          />
        </div>
      </div>

      {/* Bottom Hint */}
      <p
        className={`absolute bottom-3 text-center text-xs text-[#707070] transition-opacity duration-500 pointer-events-none px-4 ${
          tipDismissed ? 'opacity-30' : 'opacity-80'
        }`}
      >
        <span className="hidden sm:inline">
          Drag to tilt · Shift + drag to rotate · Scroll to adjust depth · Double-click to reset
        </span>
        <span className="sm:hidden">Drag card to tilt 3D preview</span>
      </p>
    </main>
  );
};
