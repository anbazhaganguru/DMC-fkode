import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './About.css';

export const About = () => {
  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const firstHalfRef = useRef(null);
  const secondHalfRef = useRef(null);
  const stateRef = useRef({ stage: 'initial' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(loaderRef.current, { opacity: 1, y: 0, visibility: 'visible' });
      gsap.set(contentWrapperRef.current, { opacity: 0, visibility: 'hidden' });
      gsap.set(firstHalfRef.current, { opacity: 0, y: 24 });
      gsap.set(secondHalfRef.current, { opacity: 0, y: 24, pointerEvents: 'none' });
    }, containerRef);

    /**
     * Master Scroll Synchronizer for About Section
     * Driven directly by CinematicJourney's master progress & frame transition state using GSAP.
     */
    const updateAboutProgress = (rawP, rawVirtualVal, prevFrame, currFrame) => {
      const p = Math.max(0, Math.min(1, rawP));
      const v = rawVirtualVal !== undefined ? rawVirtualVal : p;
      const currentState = stateRef.current;

      const loader = loaderRef.current;
      const contentWrapper = contentWrapperRef.current;
      const firstHalf = firstHalfRef.current;
      const secondHalf = secondHalfRef.current;

      if (!loader || !contentWrapper || !firstHalf || !secondHalf) return;

      // Stage 0: Initial / Home Photo 5 & Early About Photo 1 (About Loader active & visible)
      if (v < 0.35) {
        if (currentState.stage !== 'loader') {
          currentState.stage = 'loader';
          ctx.add(() => {
            gsap.to(loader, { opacity: 1, y: 0, duration: 0.4, visibility: 'visible', ease: 'power2.out' });
            gsap.to(contentWrapper, { opacity: 0, duration: 0.3, visibility: 'hidden', ease: 'power2.out' });
            gsap.to(firstHalf, { opacity: 0, y: 24, duration: 0.3, ease: 'power2.out' });
            gsap.to(secondHalf, { opacity: 0, y: 24, duration: 0.3, pointerEvents: 'none', ease: 'power2.out' });
          });
        }
      }
      // Stage 1: About Photo 1 Mid-Point (First-Half Content Reveals, Loader Dissolves)
      else if (v < 0.70) {
        if (currentState.stage !== 'photo1') {
          currentState.stage = 'photo1';
          ctx.add(() => {
            gsap.to(loader, { opacity: 0, y: -12, duration: 0.5, visibility: 'hidden', ease: 'power2.out' });
            gsap.to(contentWrapper, { opacity: 1, duration: 0.4, visibility: 'visible', ease: 'power2.out' });
            gsap.to(firstHalf, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
            gsap.to(secondHalf, { opacity: 0, y: 24, duration: 0.3, pointerEvents: 'none', ease: 'power2.out' });
          });
        }
      }
      // Stage 2: About Photo 2 (Second-Half Content Reveals alongside First-Half)
      else {
        if (currentState.stage !== 'photo2') {
          currentState.stage = 'photo2';
          ctx.add(() => {
            gsap.to(loader, { opacity: 0, y: -12, duration: 0.3, visibility: 'hidden', ease: 'power2.out' });
            gsap.to(contentWrapper, { opacity: 1, duration: 0.4, visibility: 'visible', ease: 'power2.out' });
            gsap.to(firstHalf, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
            gsap.to(secondHalf, { opacity: 1, y: 0, duration: 0.8, pointerEvents: 'auto', ease: 'power2.out' });
          });
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.updateAboutProgress = updateAboutProgress;
    }

    updateAboutProgress(0, 0, 0, 0);

    return () => {
      if (container) {
        delete container.updateAboutProgress;
      }
      ctx.revert();
    };
  }, []);

  return (
    <div id="about" ref={containerRef} className="about-cinematic-stage">
      {/* Soft Multi-Layered Feathered Ivory Atmosphere Overlay */}
      <div className="about-atmosphere" aria-hidden="true">
        <div className="about-fade-overlay" />
      </div>

      {/* 1. Centered Editorial Chapter Loader */}
      <div ref={loaderRef} className="about-loader" aria-label="Chapter 01 Loader">
        <div className="about-loader__content">
          <div className="about-loader__line about-loader__line--top" />
          <span className="about-loader__number">01</span>
          <h2 className="about-loader__title">ABOUT</h2>
          <span className="about-loader__subtitle">A PERSONALIZED WELLNESS JOURNEY</span>
          <div className="about-loader__line about-loader__line--bottom" />
        </div>
      </div>

      {/* 2. Main Right-Aligned Editorial Content Container */}
      <div ref={contentWrapperRef} className="about-editorial-container">
        <div className="about-editorial-inner">
          {/* First-Half Content Group */}
          <div ref={firstHalfRef} className="about-content-group about-content-group--first">
            {/* Eyebrow Chapter Tag */}
            <div className="about-eyebrow">
              <span className="about-eyebrow__dot" aria-hidden="true" />
              <span className="about-eyebrow__number">01</span>
              <span className="about-eyebrow__divider">/</span>
              <span className="about-eyebrow__text">ABOUT</span>
            </div>

            {/* Main Headline */}
            <h2 className="about-headline">
              <span className="about-headline__line">A More Personalized</span>
              <span className="about-headline__line about-headline__line--italic">
                Approach to Wellness.
              </span>
            </h2>

            {/* First Supporting Paragraph */}
            <p className="about-paragraph about-paragraph--first">
              Every individual has different needs, which is why we encourage a personalized approach when choosing a wellness experience.
            </p>
          </div>

          {/* Second-Half Content Group */}
          <div ref={secondHalfRef} className="about-content-group about-content-group--second">
            {/* Second Supporting Paragraph */}
            <p className="about-paragraph about-paragraph--second">
              At Daniel Wellness Center, our services are designed around relaxation, recovery support, body comfort, and overall well-being.
            </p>

            {/* Action CTAs */}
            <div className="about-ctas">
              <a href="#cta" className="about-btn-primary">
                <span className="about-btn-primary__label">BOOK AN APPOINTMENT</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="about-btn-icon"
                  aria-hidden="true"
                >
                  <path
                    d="M9 3L14 8M14 8L9 13M14 8H2"
                    stroke="#FDFCFA"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a href="#therapy" className="about-btn-secondary">
                EXPLORE WELLNESS SERVICES
              </a>
            </div>

            {/* Bottom Micro Label */}
            <div className="about-micro-footer">
              <span className="about-micro-dash">—</span>
              <span className="about-micro-label">PERSONALIZED WELLNESS JOURNEY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

