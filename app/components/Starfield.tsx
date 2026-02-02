'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Props {
  speedFactor?: number;
  backgroundColor?: string;
  starColor?: [number, number, number];
  starCount?: number;
}

export default function Starfield(props: Props) {
  const {
    speedFactor = 0.05,
    backgroundColor = 'black',
    starColor = [255, 255, 255],
    starCount = 800,
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext('2d');
    if (!c) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let animationId: number;
    let isVisible = true;

    const setCanvasExtents = () => {
      canvas.width = w;
      canvas.height = h;
    };

    setCanvasExtents();

    const makeStars = (count: number) => {
      const out = [];
      for (let i = 0; i < count; i++) {
        const s = {
          x: Math.random() * 1600 - 800,
          y: Math.random() * 900 - 450,
          z: Math.random() * 1000,
        };
        out.push(s);
      }
      return out;
    };

    const stars = makeStars(starCount);

    const clear = () => {
      c.fillStyle = backgroundColor;
      c.fillRect(0, 0, canvas.width, canvas.height);
    };

    const putPixel = (x: number, y: number, brightness: number) => {
      const rgb = `rgba(${starColor[0]},${starColor[1]},${starColor[2]},${brightness})`;
      c.fillStyle = rgb;
      c.fillRect(x, y, 1, 1);
    };

    const moveStars = (distance: number) => {
      const count = stars.length;
      for (let i = 0; i < count; i++) {
        const s = stars[i];
        s.z -= distance;
        while (s.z <= 1) {
          s.z += 1000;
        }
      }
    };

    const drawStars = () => {
      clear();
      const cx = w / 2;
      const cy = h / 2;

      const count = stars.length;
      for (let i = 0; i < count; i++) {
        const star = stars[i];
        const x = cx + star.x / (star.z * 0.001);
        const y = cy + star.y / (star.z * 0.001);

        if (x < 0 || x >= w || y < 0 || y >= h) {
          continue;
        }

        const d = star.z / 1000.0;
        const b = 1 - d * d;

        putPixel(x, y, b);
      }
    };

    // For reduced motion: just draw static stars once
    if (prefersReducedMotion) {
      drawStars();
      return;
    }

    let prevTime: number;
    const init = (time: number) => {
      prevTime = time;
      animationId = requestAnimationFrame(tick);
    };

    const tick = (time: number) => {
      if (!isVisible) {
        animationId = requestAnimationFrame(tick);
        return;
      }

      const elapsed = time - prevTime;
      prevTime = time;

      moveStars(elapsed * speedFactor);
      drawStars();

      animationId = requestAnimationFrame(tick);
    };

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      setCanvasExtents();
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationId = requestAnimationFrame(init);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    starColor,
    backgroundColor,
    speedFactor,
    starCount,
    prefersReducedMotion,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        padding: 0,
        margin: 0,
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 10,
        opacity: 1,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        willChange: prefersReducedMotion ? 'auto' : 'transform',
      }}
    />
  );
}
