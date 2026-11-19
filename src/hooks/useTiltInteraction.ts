import { useCallback, useEffect, useRef, useState } from 'react';
import { TiltState } from '../types';
import { TILT_DEFAULT } from '../engine/constants';

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export function useTiltInteraction() {
  const [tilt, setTilt] = useState<TiltState>({ ...TILT_DEFAULT });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    x: number;
    y: number;
    rx: number;
    ry: number;
    rz: number;
  } | null>(null);

  const resetTilt = useCallback(() => {
    setTilt({ ...TILT_DEFAULT });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      rx: tilt.rx,
      ry: tilt.ry,
      rz: tilt.rz,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
  }, [tilt]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;

    if (e.shiftKey) {
      setTilt((prev) => ({
        ...prev,
        rz: clamp(Math.round(dragRef.current!.rz + dx * 0.3), -180, 180),
      }));
    } else {
      setTilt((prev) => ({
        ...prev,
        ry: clamp(Math.round(dragRef.current!.ry + dx * 0.3), -75, 75),
        rx: clamp(Math.round(dragRef.current!.rx - dy * 0.3), -75, 75),
      }));
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setTilt((prev) => ({
      ...prev,
      perspective: clamp(
        Math.round(prev.perspective + e.deltaY * 2),
        400,
        3000
      ),
    }));
  }, []);

  return {
    tilt,
    setTilt,
    resetTilt,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  };
}
