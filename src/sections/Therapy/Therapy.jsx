import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import TherapyCard from '../../components/therapy/TherapyCard';
import { therapyData } from '../../data/therapy';
import './Therapy.css';

export const Therapy = () => {
  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const stateRef = useRef({ stage: 'initial' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(loaderRef.current, { opacity: 0, y: 0, visibility: 'hidden' });
      gsap.set(contentWrapperRef.current, { opacity: 0, y: 24, visibility: 'hidden', pointerEvents: 'none' });
    }, containerRef);

    /**
     * Master Scroll Synchronizer for Therapy Section
     * Driven directly by CinematicJourney's master progress & frame transition state using GSAP.
     */
    const updateTherapyProgress = (rawP, rawVirtualVal, prevFrame, currFrame) => {
      if (rawP < 0) {
        stateRef.current.stage = 'initial';
        gsap.set(loaderRef.current, { opacity: 0, y: 0, visibility: 'hidden' });
        gsap.set(contentWrapperRef.current, { opacity: 0, y: 24, visibility: 'hidden', pointerEvents: 'none' });
        return;
      }

      const p = Math.max(0, Math.min(1, rawP));
      const v = rawVirtualVal !== undefined ? rawVirtualVal : p;
      const currentState = stateRef.current;

      const loader = loaderRef.current;
      const contentWrapper = contentWrapperRef.current;

      if (!loader || !contentWrapper) return;

      // Stage 1: Therapy Photo 1 STARTS (v < 0.50)
      if (v < 0.50) {
        if (currentState.stage !== 'photo1') {
          currentState.stage = 'photo1';
          ctx.add(() => {
            gsap.to(loader, { opacity: 1, y: 0, duration: 0.6, visibility: 'visible', ease: 'power2.out', overwrite: 'auto' });
            gsap.to(contentWrapper, { opacity: 0, y: 24, duration: 0.3, visibility: 'hidden', pointerEvents: 'none', ease: 'power2.out', overwrite: 'auto' });
          });
        }
      }
      // Stage 2: Therapy Photo 2 STARTS (v >= 0.50) - Therapy Cards remain 100% visible!
      else {
        if (currentState.stage !== 'photo2') {
          currentState.stage = 'photo2';
          ctx.add(() => {
            gsap.to(loader, { opacity: 0, y: -12, duration: 0.4, visibility: 'hidden', ease: 'power2.out', overwrite: 'auto' });
            gsap.to(contentWrapper, { opacity: 1, y: 0, duration: 0.8, visibility: 'visible', pointerEvents: 'auto', ease: 'power2.out', overwrite: 'auto' });
          });
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.updateTherapyProgress = updateTherapyProgress;
    }

    updateTherapyProgress(0, 0, 0, 0);

    return () => {
      if (container) {
        delete container.updateTherapyProgress;
      }
      ctx.revert();
    };
  }, []);

  return (
    <div id="therapy" ref={containerRef} className="therapy-cinematic-stage">
      {/* Soft Multi-Layered Atmosphere Overlay */}
      <div className="therapy-atmosphere" aria-hidden="true">
        <div className="therapy-fade-overlay" />
      </div>

      {/* 1. Centered Editorial Chapter Loader (02 THERAPY) */}
      <div ref={loaderRef} className="therapy-loader" aria-label="Chapter 02 Loader">
        <div className="therapy-loader__content">
          <div className="therapy-loader__line therapy-loader__line--top" />
          <span className="therapy-loader__number">02</span>
          <h2 className="therapy-loader__title">THERAPY</h2>
          <span className="therapy-loader__subtitle">PERSONALIZED THERAPY & RECOVERY</span>
          <div className="therapy-loader__line therapy-loader__line--bottom" />
        </div>
      </div>

      {/* 2. Main Therapy Showcase Content (6 Cards UI) */}
      <div ref={contentWrapperRef} className="therapy-editorial-container">
        <div className="therapy-editorial-inner">
          <div className="therapy-header">
            <div className="therapy-eyebrow">
              <span className="therapy-eyebrow__dot" aria-hidden="true" />
              <span className="therapy-eyebrow__number">02</span>
              <span className="therapy-eyebrow__divider">/</span>
              <span className="therapy-eyebrow__text">THERAPY SERVICES</span>
            </div>
            <h2 className="therapy-headline">
              Targeted Care <span className="therapy-headline--italic">Calibrated for You.</span>
            </h2>
          </div>

          <div className="therapy-cards-grid">
            {therapyData.slice(0, 6).map((item) => (
              <TherapyCard
                key={item.id}
                title={item.title}
                description={item.description}
                category={item.category}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Therapy;
