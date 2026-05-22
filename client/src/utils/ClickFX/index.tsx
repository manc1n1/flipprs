import styles from './ClickFX.module.css';

import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import y1 from '@/assets/clickfx/yellow_frame1.png';
import y2 from '@/assets/clickfx/yellow_frame2.png';
import y3 from '@/assets/clickfx/yellow_frame3.png';
import y4 from '@/assets/clickfx/yellow_frame4.png';

import r1 from '@/assets/clickfx/red_frame1.png';
import r2 from '@/assets/clickfx/red_frame2.png';
import r3 from '@/assets/clickfx/red_frame3.png';
import r4 from '@/assets/clickfx/red_frame4.png';

type TSprite = {
  id: number;
  x: number;
  y: number;
  frames: string[];
  size: number;
  duration: number;
};

export default function ClickFX() {
  const [sprites, setSprites] = useState<TSprite[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const target = e.target as Element | null;
      const isLink = !!target?.closest(
        'a, button, th, [role="link"], [data-clickfx="link"]',
      );

      const frames = isLink ? [r1, r2, r3, r4] : [y1, y2, y3, y4];

      const id = ++idRef.current;
      const x = e.clientX;
      const y = e.clientY;

      setSprites((prev) => [
        ...prev,
        { id, x, y, frames, size: 16, duration: 300 },
      ]);

      window.setTimeout(() => {
        setSprites((prev) => prev.filter((s) => s.id !== id));
      }, 300);
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return ReactDOM.createPortal(
    <div
      className={styles.layer}
      aria-hidden
    >
      {sprites.map((s) => (
        <span
          key={s.id}
          className={styles.sprite}
          style={
            {
              '--x': `${s.x}px`,
              '--y': `${s.y}px`,
              '--size': `${s.size}px`,
              '--duration': `${s.duration}ms`,
              '--f1': `url(${s.frames[0]})`,
              '--f2': `url(${s.frames[1]})`,
              '--f3': `url(${s.frames[2]})`,
              '--f4': `url(${s.frames[3]})`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>,
    document.body,
  );
}
