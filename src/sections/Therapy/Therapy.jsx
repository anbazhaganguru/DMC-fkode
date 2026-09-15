import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import TherapyCard from '../../components/therapy/TherapyCard';
import { therapyData } from '../../data/therapy';
import './Therapy.css';

export const Therapy = () => {
  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const cardsTrackRef = useRef(null);
  const stateRef = useRef({ stage: 'initial' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(loaderRef.current, { opacity: 0, y: 0, visibility: 'hidden' });
      gsap.set(contentWrapperRef.current, { opacity: 0, y: 24, visibility: 'hidden', pointerEvents: 'none' });
    }, containerRef);

    /**
     * Master Scroll Synchronizer for Therapy Section
     * Driven directly by CinematicJourney's master progress & frame transition state using GSAP.
     * On Desktop: Controls section fade-in / stage state.
     * On Mobile: Translates vertical page scroll progress into horizontal card journey (01 -> 06) with a subtle fade handoff into Recovery.
     */
    const updateTherapyProgress = (rawP, rawVirtualVal, prevFrame, currFrame) => {
      if (rawP < 0) {
        stateRef.current.stage = 'initial';
        gsap.set(loaderRef.current, { opacity: 0, y: 0, visibility: 'hidden' });
        gsap.set(contentWrapperRef.current, { opacity: 0, y: 24, visibility: 'hidden', pointerEvents: 'none' });
        if (cardsTrackRef.current && window.innerWidth <= 768) {
          gsap.set(cardsTrackRef.current, { x: 0 });
        }
        return;
      }

      const p = Math.max(0, Math.min(1, rawP));
      const v = rawVirtualVal !== undefined ? rawVirtualVal : p;
      const currentState = stateRef.current;

      const loader = loaderRef.current;
      const contentWrapper = contentWrapperRef.current;

      if (!loader || !contentWrapper) return;

      // Stage 1: Therapy Photo 1 STARTS (v < 0.45) - Editorial Loader
      if (v < 0.45) {
        if (currentState.stage !== 'photo1') {
          currentState.stage = 'photo1';
          ctx.add(() => {
            gsap.to(loader, { opacity: 1, y: 0, duration: 0.5, visibility: 'visible', ease: 'power2.out', overwrite: 'auto' });
            gsap.to(contentWrapper, { opacity: 0, y: 24, duration: 0.3, visibility: 'hidden', pointerEvents: 'none', ease: 'power2.out', overwrite: 'auto' });
            if (cardsTrackRef.current && window.innerWidth <= 768) {
              gsap.set(cardsTrackRef.current, { x: 0 });
            }
          });
        }
      }
      // Stage 2: Therapy Cards Active (v >= 0.45)
      else {
        if (currentState.stage !== 'photo2') {
          currentState.stage = 'photo2';
          ctx.add(() => {
            gsap.to(loader, { opacity: 0, y: -12, duration: 0.4, visibility: 'hidden', ease: 'power2.out', overwrite: 'auto' });
            gsap.to(contentWrapper, { opacity: 1, y: 0, duration: 0.6, visibility: 'visible', pointerEvents: 'auto', ease: 'power2.out', overwrite: 'auto' });
          });
        }

        // Mobile Vertical-Scroll-Driven Horizontal Card Track Movement & Recovery Handoff Fade
        if (window.innerWidth <= 768 && cardsTrackRef.current) {
          // Track movement from v = 0.45 to 0.92 (Card 01 centered to Card 06 centered)
          const mobileP = Math.max(0, Math.min(1, (v - 0.45) / 0.47));
          const snapItems = cardsTrackRef.current.children;

          if (snapItems && snapItems.length >= 6) {
            const cardWidth = snapItems[0].offsetWidth;
            const gap = 16; // 16px gap between mobile cards
            const stepDistance = cardWidth + gap;
            const maxScroll = stepDistance * 5; // 5 steps to reach Card 06
            const targetX = -mobileP * maxScroll;

            gsap.to(cardsTrackRef.current, {
              x: targetX,
              duration: 0.1,
              ease: 'none',
              overwrite: 'auto'
            });
          }

          // Subtle fade transition from v = 0.92 to 1.00 as user scrolls into Recovery
          const fadeOpacity = v > 0.92 ? Math.max(0, 1 - (v - 0.92) / 0.08) : 1;
          gsap.to(contentWrapper, {
            opacity: fadeOpacity,
            duration: 0.1,
            overwrite: 'auto'
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

          {/* Desktop Wide 3x2 Grid / Mobile Pinned Horizontal Scroll Journey */}
          <div className="therapy-cards-container">
            <div ref={cardsTrackRef} className="therapy-cards-grid">
              {therapyData.slice(0, 6).map((item, idx) => (
                <div key={item.id} className="therapy-card-snap-item">
                  <TherapyCard data={item} index={idx} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Therapy;
