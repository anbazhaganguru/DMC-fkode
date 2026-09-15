import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './RecoveryFor.css';

export const RecoveryFor = () => {
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
     * Master Scroll Synchronizer for Recovery Section
     * Driven directly by CinematicJourney's master progress & frame transition state using GSAP.
     */
    const updateRecoveryProgress = (rawP, rawVirtualVal, prevFrame, currFrame) => {
      const p = Math.max(0, Math.min(1, rawP));
      const v = rawVirtualVal !== undefined ? rawVirtualVal : p;
      const currentState = stateRef.current;

      const loader = loaderRef.current;
      const contentWrapper = contentWrapperRef.current;

      if (!loader || !contentWrapper) return;

      // Stage 1: Recovery Photo 1 STARTS (v < 0.50)
      if (v < 0.50) {
        if (currentState.stage !== 'photo1') {
          currentState.stage = 'photo1';
          ctx.add(() => {
            gsap.to(loader, { opacity: 1, y: 0, duration: 0.6, visibility: 'visible', ease: 'power2.out' });
            gsap.to(contentWrapper, { opacity: 0, y: 24, duration: 0.3, visibility: 'hidden', pointerEvents: 'none', ease: 'power2.out' });
          });
        }
      }
      // Stage 2: Recovery Photo 2 STARTS (v >= 0.50) - Recovery Cards remain 100% visible!
      else {
        if (currentState.stage !== 'photo2') {
          currentState.stage = 'photo2';
          ctx.add(() => {
            gsap.to(loader, { opacity: 0, y: -12, duration: 0.4, visibility: 'hidden', ease: 'power2.out' });
            gsap.to(contentWrapper, { opacity: 1, y: 0, duration: 0.8, visibility: 'visible', pointerEvents: 'auto', ease: 'power2.out' });
          });
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.updateRecoveryProgress = updateRecoveryProgress;
    }

    updateRecoveryProgress(0, 0, 0, 0);

    return () => {
      if (container) {
        delete container.updateRecoveryProgress;
      }
      ctx.revert();
    };
  }, []);

  return (
    <div id="recovery-for" ref={containerRef} className="recovery-cinematic-stage">
      {/* Soft Multi-Layered Atmosphere Overlay */}
      <div className="recovery-atmosphere" aria-hidden="true">
        <div className="recovery-fade-overlay" />
      </div>

      {/* 1. Centered Editorial Chapter Loader (03 RECOVERY) */}
      <div ref={loaderRef} className="recovery-loader" aria-label="Chapter 03 Loader">
        <div className="recovery-loader__content">
          <div className="recovery-loader__line recovery-loader__line--top" />
          <span className="recovery-loader__number">03</span>
          <h2 className="recovery-loader__title">RECOVERY</h2>
          <span className="recovery-loader__subtitle">RECOVERY & WELL-BEING</span>
          <div className="recovery-loader__line recovery-loader__line--bottom" />
        </div>
      </div>

      {/* 2. Main Recovery Editorial Showcase Content */}
      <div ref={contentWrapperRef} className="recovery-editorial-container">
        <div className="recovery-editorial-inner">
          <div className="recovery-eyebrow">
            <span className="recovery-eyebrow__dot" aria-hidden="true" />
            <span className="recovery-eyebrow__number">03</span>
            <span className="recovery-eyebrow__divider">/</span>
            <span className="recovery-eyebrow__text">RECOVERY FOR</span>
          </div>

          <h2 className="recovery-headline">
            Designed to Support <span className="recovery-headline--italic">Your Healing Journey.</span>
          </h2>

          <p className="recovery-paragraph">
            Whether recovering from strenuous physical activity, managing daily muscle fatigue, or seeking a tranquil sanctuary for whole-body restoration, our programs are tailored around your individual well-being goals.
          </p>

          <div className="recovery-pillars">
            <div className="recovery-pillar-item">
              <span className="recovery-pillar-num">01</span>
              <span className="recovery-pillar-title">ATHLETIC RECOVERY & MUSCLE REPAIR</span>
            </div>
            <div className="recovery-pillar-item">
              <span className="recovery-pillar-num">02</span>
              <span className="recovery-pillar-title">POSTURAL REALIGNMENT & STRESS RELIEF</span>
            </div>
            <div className="recovery-pillar-item">
              <span className="recovery-pillar-num">03</span>
              <span className="recovery-pillar-title">CHRONIC DISCOMFORT & MOBILITY CARE</span>
            </div>
          </div>

          <div className="recovery-micro-footer">
            <span className="recovery-micro-dash">—</span>
            <span className="recovery-micro-label">ENDURING COMFORT & RECOVERY SUPPORT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryFor;
