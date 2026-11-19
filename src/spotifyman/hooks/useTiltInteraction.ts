import { useCallback, useRef, useState, type PointerEvent, type WheelEvent } from 'react';
import { TiltState } from '../types';
import { TILT_DEFAULT } from '../engine/constants';
import { asTilt } from '../engine/tilt';

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export function useTiltInteraction() {
  const [tilt, setTilt] = useState<TiltState>(() => asTilt(TILT_DEFAULT));
  const [isDragging, setIsDragging] = useState(false);
  const tiltRef = useRef<TiltState>(asTilt(TILT_DEFAULT));
  const drag = useRef({
    active: false,
    x: 0,
    y: 0,
    rx: TILT_DEFAULT.rx,
    ry: TILT_DEFAULT.ry,
    rz: TILT_DEFAULT.rz,
  });

  const commit = useCallback((next: TiltState) => {
    const safe = asTilt(next);
    tiltRef.current = safe;
    setTilt(safe);
  }, []);

  const resetTilt = useCallback(() => {
    drag.current.active = false;
    commit(asTilt(TILT_DEFAULT));
    setIsDragging(false);
  }, [commit]);

  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const current = asTilt(tiltRef.current);
    drag.current.active = true;
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
    drag.current.rx = current.rx;
    drag.current.ry = current.ry;
    drag.current.rz = current.rz;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const baseRx = d.rx;
    const baseRy = d.ry;
    const baseRz = d.rz;
    const prev = asTilt(tiltRef.current);

    if (e.shiftKey) {
      commit({
        ...prev,
        rz: clamp(Math.round(baseRz + dx * 0.3), -180, 180),
      });
    } else {
      commit({
        ...prev,
        ry: clamp(Math.round(baseRy + dx * 0.3), -75, 75),
        rx: clamp(Math.round(baseRx - dy * 0.3), -75, 75),
      });
    }
  }, [commit]);

  const handlePointerUp = useCallback(() => {
    drag.current.active = false;
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const prev = asTilt(tiltRef.current);
    commit({
      ...prev,
      perspective: clamp(Math.round(prev.perspective + e.deltaY * 2), 400, 3000),
    });
  }, [commit]);

  return {
    tilt: asTilt(tilt),
    setTilt: commit,
    resetTilt,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  };
}
