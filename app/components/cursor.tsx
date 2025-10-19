import React, { useEffect, useRef, useState } from 'react';
import { BsCursorFill } from 'react-icons/bs';

export function Cursor(): React.ReactElement {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [active, setActive] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const inactivityTimer = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const clearInactivity = () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = null;
      }
    };

    const scheduleHide = (delay = 600) => {
      clearInactivity();
      inactivityTimer.current = window.setTimeout(() => {
        setVisible(false);
        inactivityTimer.current = null;
      }, delay) as unknown as number;
    };

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      scheduleHide();
    };

    const onLeave = () => {
      setVisible(false);
      clearInactivity();
    };
    const onDown = () => setActive(true);
    const onUp = () => setActive(false);

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a,button,input,textarea,select,details,[role=button],[role=link]'
      );
      setHovering(Boolean(interactive));
    };

    const onTouchStart = () => {
      // hide cursor on touch devices and stop tracking
      setIsTouch(true);
      setVisible(false);
      clearInactivity();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseenter', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseenter', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('touchstart', onTouchStart);
      clearInactivity();
    };
  }, []);

  // if touch was detected, don't render the custom cursor
  if (isTouch) return <></>;

  const baseClasses =
    'pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out';
  const visibilityClass = visible ? 'opacity-100' : 'opacity-0';
  const scaleClass = hovering ? 'scale-125' : active ? 'scale-75' : 'scale-100';

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ left: pos.x, top: pos.y }}
      className={`${baseClasses} ${visibilityClass} ${scaleClass}`}
    >
      <BsCursorFill className="w-5 h-5 text-black dark:text-white -rotate-70" />
    </div>
  );
}
