"use client";

import React, { useState, useRef, useEffect } from "react";

interface MobileBeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function MobileBeforeAfterSlider({ beforeImage, afterImage }: MobileBeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);

  const updatePositionFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let p = ((clientX - rect.left) / rect.width) * 100;
    p = Math.max(0, Math.min(100, p));
    setPos(p);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    updatePositionFromClientX(e.touches[0].clientX);
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    updatePositionFromClientX(e.clientX);
  };

  useEffect(() => {
    const start = (e: TouchEvent) => { isDragging.current = true; onTouchMove(e); };
    const end = () => { isDragging.current = false; };
    const mstart = (e: MouseEvent) => { isDragging.current = true; onMouseMove(e); };
    const mend = () => { isDragging.current = false; };
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', end);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', mend);
    return () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', end);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', mend);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-black rounded-2xl">
      <div className="absolute inset-0">
        <img src={beforeImage} alt="before" className="w-full h-full object-cover" draggable={false} />
      </div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={afterImage} alt="after" className="w-full h-full object-cover" draggable={false} />
      </div>

      {/* handle */}
      <div
        onPointerDown={() => { isDragging.current = true; }}
        onPointerUp={() => { isDragging.current = false; }}
        onPointerMove={(e) => { if (e.clientX) updatePositionFromClientX(e.clientX); }}
        className="absolute top-0 bottom-0"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)', zIndex: 20 }}
      >
        <div className="w-[2px] h-full bg-white/60 mx-auto" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-300">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </div>
      </div>
    </div>
  );
}
