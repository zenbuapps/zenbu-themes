'use client';

import { useEffect, useRef, useState } from 'react';
import type { PageBlock } from '../../types';

interface Slide { imageUrl: string; action: string; }

interface Props {
  block: PageBlock;
  content: Record<string, string>;
}

export function HeroCarousel({ block, content }: Props) {
  const b = block as unknown as { slides?: Slide[]; autoplayMs?: number };
  const slides = Array.isArray(b.slides) ? b.slides : [];
  const autoplayMs = b.autoplayMs ?? 5500;
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (slides.length === 0) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % slides.length), autoplayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, autoplayMs]);

  const go = (i: number) => {
    setIdx(i);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(v => (v + 1) % slides.length), autoplayMs);
  };

  const handleCta = (action: string) => {
    if (!action) return;
    if (action.startsWith('#')) {
      document.querySelector(action)?.scrollIntoView({ behavior: 'smooth' });
    } else if (action.includes('#')) {
      const [path, anchor] = action.split('#');
      const currentPath = window.location.pathname;
      if (currentPath === path || path === '' || path === '/') {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = action.startsWith('/') ? action : '/' + action;
      }
    } else {
      window.location.href = action.startsWith('/') ? action : '/' + action;
    }
  };

  if (slides.length === 0) return null;

  const active = slides[idx];
  const title = content[`slide${idx}_title`] ?? '';
  const cta = content[`slide${idx}_cta`] ?? '';

  return (
    <section className="hero">
      <div className="hero-slides" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {slides.map((s, i) => (
          <div
            className="hero-slide"
            key={i}
            style={{ backgroundImage: `url(${s.imageUrl})` }}
          />
        ))}
      </div>
      <div className="hero-content" key={idx}>
        <div className="title" style={{ whiteSpace: 'pre-line' }}>{title}</div>
        {cta && (
          <button className="btn btn-primary" onClick={() => handleCta(active.action)}>
            {cta}
          </button>
        )}
      </div>
      {slides.length > 1 && (
        <>
          <button
            className="hero-arrow left"
            onClick={() => go((idx - 1 + slides.length) % slides.length)}
            aria-label="prev"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 5 L8 12 L15 19" />
            </svg>
          </button>
          <button
            className="hero-arrow right"
            onClick={() => go((idx + 1) % slides.length)}
            aria-label="next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 5 L16 12 L9 19" />
            </svg>
          </button>
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={i === idx ? 'active' : ''}
                onClick={() => go(i)}
                aria-label={`slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
