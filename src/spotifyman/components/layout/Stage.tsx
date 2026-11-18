import { Component, lazy, Suspense, useEffect, useState, type FC, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent } from 'react';
import { RotateCcw } from 'lucide-react';
import type { CardState, TiltState } from '../../types';
import { LAYOUTS, THEMES } from '../../engine/constants';

const CardViewport = lazy(() => import('./CardViewport'));

interface StageProps {
  state: CardState;
  coverImg: HTMLImageElement | null;
  tilt: TiltState;
  isDragging: boolean;
  fontEpoch: number;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
  onWheel: (e: WheelEvent<HTMLDivElement>) => void;
  onResetTilt: () => void;
  onCardRenderedSize?: (size: number, overflow: boolean) => void;
}

class ViewBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export const Stage: FC<StageProps> = ({
  state,
  coverImg,
  tilt,
  isDragging,
  fontEpoch,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
  onResetTilt,
  onCardRenderedSize,
}) => {
  const layout = LAYOUTS[state.layoutKey];
  const themeLabel = THEMES[state.theme]?.label ?? 'Classic';
  const [show3d, setShow3d] = useState(false);
  useEffect(() => setShow3d(true), []);

  return (
    <main
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden select-none"
      style={{ ['--glow' as string]: state.color }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(520px 420px at 50% 46%, ${state.color}33, transparent 70%)`,
        }}
      />

      <div className="absolute top-3 left-3 z-10 flex max-w-[70%] items-center gap-2">
        <span className="truncate rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-medium text-[#d0d0d0] backdrop-blur-md">
          {themeLabel} · {layout.w}×{layout.h}
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10">
        <button
          type="button"
          onClick={onResetTilt}
          aria-label="Reset tilt"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-[#d0d0d0] backdrop-blur-md active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onDoubleClick={onResetTilt}
        className={`relative z-1 h-full w-full touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <ViewBoundary
          fallback={
            <div className="flex h-full items-center justify-center text-xs text-[#b3b3b3]">
              3D preview unavailable
            </div>
          }
        >
          {show3d ? (
            <Suspense fallback={null}>
              <CardViewport
                state={state}
                coverImg={coverImg}
                tilt={tilt}
                dragging={isDragging}
                fontEpoch={fontEpoch}
                onSize={onCardRenderedSize}
              />
            </Suspense>
          ) : null}
        </ViewBoundary>
      </div>
    </main>
  );
};
