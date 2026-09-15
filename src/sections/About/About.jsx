import React, { useEffect, useRef } from 'react';
import './About.css';

export const About = () => {
  const containerRef = useRef(null);
  const stage1Ref = useRef(null);
  const stage2Ref = useRef(null);
  const bottomBarRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize initial hidden states immediately on mount with display: none
    if (stage1Ref.current) {
      stage1Ref.current.style.display = 'none';
      stage1Ref.current.style.opacity = '0';
      stage1Ref.current.style.visibility = 'hidden';
      stage1Ref.current.style.pointerEvents = 'none';
    }
    if (stage2Ref.current) {
      stage2Ref.current.style.display = 'none';
      stage2Ref.current.style.opacity = '0';
      stage2Ref.current.style.visibility = 'hidden';
      stage2Ref.current.style.pointerEvents = 'none';
    }
    if (bottomBarRef.current) {
      bottomBarRef.current.style.display = 'none';
      bottomBarRef.current.style.opacity = '0';
      bottomBarRef.current.style.visibility = 'hidden';
    }

    // Direct performance-optimized callback attached to DOM node for master CinematicJourney
    container.updateAboutProgress = (progress) => {
      const p = Math.max(0, Math.min(1, progress));
      const stage1 = stage1Ref.current;
      const stage2 = stage2Ref.current;
      const bottomBar = bottomBarRef.current;

      // STAGE 1 (Photo 1 - 02_about_wellness_reveal.webp):
      // Physical display:none isolation during Loader and Photo 1 entry (p <= 0.12).
      // Zero rendering, zero ghost text.
      // Reveals only when user performs scroll interaction inside About (0.12 -> 0.35).
      if (stage1) {
        const children = stage1.children;
        if (p <= 0.12) {
          stage1.style.display = 'none';
          stage1.style.opacity = '0';
          stage1.style.visibility = 'hidden';
          stage1.style.pointerEvents = 'none';
          if (children) {
            for (let i = 0; i < children.length; i++) {
              children[i].style.opacity = '0';
              children[i].style.transform = 'translateY(20px)';
            }
          }
        } else if (p >= 0.35) {
          stage1.style.display = 'flex';
          stage1.style.opacity = '1';
          stage1.style.visibility = 'visible';
          stage1.style.pointerEvents = 'auto';
          if (children) {
            for (let i = 0; i < children.length; i++) {
              children[i].style.opacity = '1';
              children[i].style.transform = 'translateY(0px)';
            }
          }
        } else {
          stage1.style.display = 'flex';
          stage1.style.visibility = 'visible';
          stage1.style.opacity = '1';
          stage1.style.pointerEvents = 'auto';
          if (children) {
            // Stagger offsets: Eyebrow (0.12), Headline (0.16), Paragraph (0.20)
            const delays = [0.12, 0.16, 0.20];
            const duration = 0.15;
            for (let i = 0; i < children.length; i++) {
              const delay = delays[i] || 0.12;
              let childOp = 0;
              let childY = 20;
              if (p > delay) {
                const t = Math.min(1, (p - delay) / duration);
                childOp = t * t * (3 - 2 * t);
                childY = 20 * (1 - t);
              }
              children[i].style.opacity = childOp.toFixed(3);
              children[i].style.transform = `translateY(${childY.toFixed(1)}px)`;
            }
          }
        }
      }

      // STAGE 2 (Photo 2 - 05_about_treatment_doorway.webp):
      // Secondary Quote & CTAs emerge ONLY when p > 0.45 (Photo 2 stage)
      // and REMAIN 100% VISIBLE continuously through Photo 2's final frame and hold.
      if (stage2) {
        if (p <= 0.45) {
          stage2.style.display = 'none';
          stage2.style.opacity = '0';
          stage2.style.visibility = 'hidden';
          stage2.style.pointerEvents = 'none';
        } else if (p >= 0.75) {
          stage2.style.display = 'flex';
          stage2.style.opacity = '1';
          stage2.style.visibility = 'visible';
          stage2.style.pointerEvents = 'auto';
          stage2.style.transform = 'translateY(0px)';
        } else {
          stage2.style.display = 'flex';
          stage2.style.visibility = 'visible';
          stage2.style.pointerEvents = 'auto';
          const t = (p - 0.45) / 0.30;
          const s2Op = t * t * (3 - 2 * t);
          const s2Y = 20 * (1 - t);
          stage2.style.opacity = s2Op.toFixed(3);
          stage2.style.transform = `translateY(${s2Y.toFixed(1)}px)`;
        }
      }

      // BOTTOM MICRO LABEL:
      // Fades in softly alongside Stage 2 (0.50 -> 0.78) and REMAINS 100% VISIBLE.
      if (bottomBar) {
        if (p <= 0.50) {
          bottomBar.style.display = 'none';
          bottomBar.style.opacity = '0';
          bottomBar.style.visibility = 'hidden';
        } else if (p >= 0.78) {
          bottomBar.style.display = 'flex';
          bottomBar.style.opacity = '1';
          bottomBar.style.visibility = 'visible';
        } else {
          bottomBar.style.display = 'flex';
          bottomBar.style.visibility = 'visible';
          const t = (p - 0.50) / 0.28;
          const barOp = t * t * (3 - 2 * t);
          bottomBar.style.opacity = barOp.toFixed(3);
        }
      }
    };
  }, []);

  return (
    <div id="about" ref={containerRef} className="about-section">
      {/* Cinematic Right Fade Atmosphere Layer */}
      <div className="about-atmosphere" aria-hidden="true">
        <div className="about-atmosphere__right" />
        <div className="about-atmosphere__top" />
      </div>

      {/* Main Foreground Content Container */}
      <div className="about-container">
        <div className="about-main-group">
          
          {/* STAGE 1 CONTENT: Revealed ONLY on Photo 1 (02_about_wellness_reveal) */}
          <div
            ref={stage1Ref}
            className="about-stage-group about-stage-group--1"
            style={{ display: 'none', opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
          >
            {/* BLOCK 01: Eyebrow Tag Group */}
            <div className="about-block about-block--eyebrow">
              <div className="about-eyebrow">
                <span className="about-eyebrow__dot" />
                <span className="about-eyebrow__text">DANIEL WELLNESS CENTER</span>
              </div>
            </div>

            {/* BLOCK 02: Main Heading */}
            <div className="about-block about-block--headline">
              <h2 className="about-headline">
                <span className="about-headline__line about-headline__line--roman">
                  A More Personalized
                </span>
                <span className="about-headline__line about-headline__line--italic">
                  Approach to Wellness.
                </span>
              </h2>
            </div>

            {/* Supporting Paragraph */}
            <p className="about-paragraph">
              Every individual has different needs, which is why we encourage a personalized approach when choosing a wellness experience.
            </p>
          </div>

          {/* STAGE 2 CONTENT: Revealed Cumulatively ONLY on Photo 2 (05_about_treatment_doorway) */}
          <div
            ref={stage2Ref}
            className="about-stage-group about-stage-group--2"
            style={{ display: 'none', opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
          >
            {/* Secondary Supporting Statement with Sage Border */}
            <div className="about-quote">
              <p className="about-quote__text">
                At Daniel Wellness Center, our services are designed around relaxation, recovery support, body comfort, and overall well-being.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="about-ctas">
              <a href="#cta" className="about-btn-primary">
                <span className="about-btn-primary__label">BOOK AN APPOINTMENT</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="about-btn-icon"
                  aria-hidden="true"
                >
                  <path
                    d="M9 3L14 8M14 8L9 13M14 8H2"
                    stroke="currentColor"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a href="#therapy" className="about-btn-secondary">
                <span className="about-btn-secondary__label">EXPLORE WELLNESS SERVICES</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="about-btn-secondary__arrow"
                  aria-hidden="true"
                >
                  <path
                    d="M9 3L14 8M14 8L9 13M14 8H2"
                    stroke="currentColor"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Right Micro Label */}
      <div
        ref={bottomBarRef}
        className="about-bottom-bar"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <div className="about-bottom-bar__left">
          <span className="about-bottom-bar__divider" />
          <span className="about-bottom-bar__label">PERSONALIZED WELLNESS JOURNEY</span>
        </div>
      </div>
    </div>
  );
};

export default About;
