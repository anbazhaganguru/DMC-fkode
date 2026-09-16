import React, { useEffect, useRef } from 'react';
import aboutDesktopImg from '../../assets/images/desktop/about/02_about_wellness_reveal.webp';
import aboutMobileImg from '../../assets/images/mobile/about/02_about_wellness_reveal.webp';
import './About.css';

/**
 * About Section — Daniel Wellness Center (DWC)
 * Main About Text + Scroll-Driven Full Viewport Photo Zoom + Editorial Reveal
 *
 * Sequence:
 * 0.00 -> 0.14: Chapter 01 Loader visible
 * 0.14 -> 0.18: Loader fades out, small centered photo & main About text enter
 * 0.18 -> 0.62: Photo smoothly zooms to FULL VIEWPORT (100vw x 100vh), main title splits (PERSONALIZED <- | -> WELLNESS JOURNEY)
 * 0.62 -> 0.85: Photo is fully viewport-fitted; ONLY THEN About editorial content reveals
 * 0.85 -> 1.00: Continuous seamless cross-fade to Therapy Chapter 02 Loader
 */
export const About = () => {
  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const bgRef = useRef(null);
  const expandStageRef = useRef(null);
  const mediaCardRef = useRef(null);
  const overlayRef = useRef(null);
  const splitHeroRef = useRef(null);
  const titleLeftRef = useRef(null);
  const titleRightRef = useRef(null);
  const editorialRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const loader = loaderRef.current;
    const bg = bgRef.current;
    const expandStage = expandStageRef.current;
    const mediaCard = mediaCardRef.current;
    const overlay = overlayRef.current;
    const splitHero = splitHeroRef.current;
    const titleLeft = titleLeftRef.current;
    const titleRight = titleRightRef.current;
    const editorial = editorialRef.current;

    if (!container || !loader || !bg || !expandStage || !mediaCard || !overlay || !splitHero || !titleLeft || !titleRight || !editorial) {
      return;
    }

    const checkIsMobile = () => window.innerWidth < 768;

    /**
     * Master Scroll Synchronizer for About Section
     * Driven deterministically by master ScrollTrigger progress.
     */
    const updateAboutProgress = (rawP) => {
      const p = Math.max(0, Math.min(1, rawP !== undefined ? rawP : 0));
      const isMobile = checkIsMobile();

      // Viewport dimensions
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Initial small centered card dimensions
      const initialW = isMobile ? 270 : 300;
      const initialH = isMobile ? 350 : 400;

      // Target full viewport dimensions: strictly 100vw x 100vh
      const targetW = vw;
      const targetH = vh;

      // Title translation distance (in vw)
      const maxTitleX = isMobile ? 12 : 14;

      // -------------------------------------------------------------
      // STAGE 1: About Chapter Loader (0.00 -> 0.14 hold, 0.14 -> 0.18 dissolve)
      // -------------------------------------------------------------
      if (p < 0.14) {
        loader.style.opacity = '1';
        loader.style.transform = 'translate3d(0, 0, 0)';
        loader.style.visibility = 'visible';

        expandStage.style.opacity = '0';
        expandStage.style.visibility = 'hidden';

        bg.style.opacity = '1';
        bg.style.visibility = 'visible';

        // Keep photo at initial small state
        mediaCard.style.width = `${initialW}px`;
        mediaCard.style.height = `${initialH}px`;
        mediaCard.style.borderRadius = '18px';
        mediaCard.style.boxShadow = '0 24px 64px rgba(30, 37, 34, 0.14)';
        overlay.style.backgroundColor = 'rgba(30, 37, 34, 0.18)';
        overlay.style.borderRadius = '18px';

        splitHero.style.opacity = '0';
        splitHero.style.visibility = 'hidden';
        titleLeft.style.transform = 'translate3d(0, 0, 0)';
        titleRight.style.transform = 'translate3d(0, 0, 0)';

        editorial.style.opacity = '0';
        editorial.style.transform = 'translate3d(0, 30px, 0)';
        editorial.style.visibility = 'hidden';
        editorial.style.pointerEvents = 'none';
        return;
      }

      // Loader dissolve (0.14 -> 0.18)
      if (p < 0.18) {
        const tDissolve = (p - 0.14) / 0.04;
        loader.style.opacity = (1 - tDissolve).toFixed(3);
        loader.style.transform = `translate3d(0, ${(-tDissolve * 15).toFixed(1)}px, 0)`;
        loader.style.visibility = 'visible';

        // Small centered photo & main About text enter smoothly at initial state
        expandStage.style.opacity = tDissolve.toFixed(3);
        expandStage.style.visibility = 'visible';

        bg.style.opacity = '1';
        bg.style.visibility = 'visible';

        mediaCard.style.width = `${initialW}px`;
        mediaCard.style.height = `${initialH}px`;
        mediaCard.style.borderRadius = '18px';
        mediaCard.style.boxShadow = '0 24px 64px rgba(30, 37, 34, 0.14)';
        overlay.style.backgroundColor = 'rgba(30, 37, 34, 0.18)';
        overlay.style.borderRadius = '18px';

        splitHero.style.opacity = tDissolve.toFixed(3);
        splitHero.style.visibility = 'visible';
        titleLeft.style.transform = 'translate3d(0, 0, 0)';
        titleRight.style.transform = 'translate3d(0, 0, 0)';

        editorial.style.opacity = '0';
        editorial.style.transform = 'translate3d(0, 30px, 0)';
        editorial.style.visibility = 'hidden';
        editorial.style.pointerEvents = 'none';
        return;
      }

      // Beyond 0.18: Loader is completely hidden
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';

      // -------------------------------------------------------------
      // STAGE 2: Photo Smooth Zoom to FULL VIEWPORT (0.18 -> 0.62)
      // Main About title splits horizontally as photo expands
      // -------------------------------------------------------------
      const pExpand = Math.max(0, Math.min(1, (p - 0.18) / 0.44));

      if (pExpand >= 1) {
        // Exact 100vw x 100vh full viewport state
        mediaCard.style.width = '100vw';
        mediaCard.style.height = '100vh';
        mediaCard.style.borderRadius = '0px';
        mediaCard.style.boxShadow = 'none';
        overlay.style.borderRadius = '0px';
      } else {
        const curW = initialW + pExpand * (targetW - initialW);
        const curH = initialH + pExpand * (targetH - initialH);
        const curRadius = (1 - pExpand) * 18;
        const curShadowAlpha = (1 - pExpand) * 0.14;

        mediaCard.style.width = `${curW.toFixed(1)}px`;
        mediaCard.style.height = `${curH.toFixed(1)}px`;
        mediaCard.style.borderRadius = `${curRadius.toFixed(1)}px`;
        mediaCard.style.boxShadow = `0 24px 64px rgba(30, 37, 34, ${curShadowAlpha.toFixed(3)})`;
        overlay.style.borderRadius = `${curRadius.toFixed(1)}px`;
      }

      // Title split translation
      const curTitleX = pExpand * maxTitleX;
      titleLeft.style.transform = `translate3d(-${curTitleX.toFixed(2)}vw, 0, 0)`;
      titleRight.style.transform = `translate3d(${curTitleX.toFixed(2)}vw, 0, 0)`;

      // Background fade (Warm Cream / Soft Ivory fades out as photo fills viewport)
      const bgOpacity = Math.max(0, 1 - pExpand);
      bg.style.opacity = bgOpacity.toFixed(3);
      bg.style.visibility = bgOpacity > 0.01 ? 'visible' : 'hidden';

      // Subtle photo overlay (0.18 -> 0.06)
      const overlayAlpha = 0.18 - pExpand * 0.12;
      overlay.style.backgroundColor = `rgba(30, 37, 34, ${overlayAlpha.toFixed(3)})`;

      // -------------------------------------------------------------
      // STAGE 3: Editorial About Content Reveal (0.62 -> 0.85)
      // Content reveals ONLY AFTER photo reaches full viewport!
      // -------------------------------------------------------------
      if (p < 0.62) {
        splitHero.style.opacity = '1';
        splitHero.style.visibility = 'visible';

        editorial.style.opacity = '0';
        editorial.style.transform = 'translate3d(0, 30px, 0)';
        editorial.style.visibility = 'hidden';
        editorial.style.pointerEvents = 'none';

        expandStage.style.opacity = '1';
        expandStage.style.visibility = 'visible';
        return;
      }

      // Main title gently dissolves as editorial card reveals
      const titleFade = Math.max(0, 1 - (p - 0.62) / 0.08);
      splitHero.style.opacity = titleFade.toFixed(3);
      splitHero.style.visibility = titleFade > 0.01 ? 'visible' : 'hidden';

      // 0.62 -> 0.85: Editorial content smoothly reveals upward
      const pContent = Math.max(0, Math.min(1, (p - 0.62) / 0.12));
      const contentY = (1 - pContent) * 30;
      editorial.style.opacity = pContent.toFixed(3);
      editorial.style.transform = `translate3d(0, ${contentY.toFixed(1)}px, 0)`;
      editorial.style.visibility = pContent > 0.01 ? 'visible' : 'hidden';
      editorial.style.pointerEvents = pContent > 0.6 ? 'auto' : 'none';

      // -------------------------------------------------------------
      // STAGE 4: About -> Therapy Cross-Fade Handoff (0.85 -> 1.00)
      // -------------------------------------------------------------
      if (p >= 0.85) {
        const pOut = Math.max(0, Math.min(1, (p - 0.85) / 0.11)); // fades out 0.85 -> 0.96
        const stageOpacity = Math.max(0, 1 - pOut);
        expandStage.style.opacity = stageOpacity.toFixed(3);
        expandStage.style.visibility = stageOpacity > 0.01 ? 'visible' : 'hidden';
        expandStage.style.pointerEvents = stageOpacity > 0.5 ? 'auto' : 'none';
        splitHero.style.opacity = '0';
        splitHero.style.visibility = 'hidden';
      } else {
        expandStage.style.opacity = '1';
        expandStage.style.visibility = 'visible';
        expandStage.style.pointerEvents = 'auto';
      }
    };

    container.updateAboutProgress = updateAboutProgress;

    // Initialize at frame 0
    updateAboutProgress(0);

    return () => {
      delete container.updateAboutProgress;
    };
  }, []);

  return (
    <div id="about" ref={containerRef} className="about-cinematic-stage">
      {/* 1. Ambient Warm Cream & Soft Ivory Layer (fades as photo expands) */}
      <div ref={bgRef} className="about-ambient-bg" aria-hidden="true" />

      {/* 2. Centered Editorial Chapter 01 Loader */}
      <div ref={loaderRef} className="about-loader" aria-label="Chapter 01 Loader">
        <div className="about-loader__content">
          <div className="about-loader__line about-loader__line--top" />
          <span className="about-loader__number">01</span>
          <h2 className="about-loader__title">ABOUT</h2>
          <span className="about-loader__subtitle">A PERSONALIZED WELLNESS JOURNEY</span>
          <div className="about-loader__line about-loader__line--bottom" />
        </div>
      </div>

      {/* 3. ScrollExpandMedia Experience Stage */}
      <div ref={expandStageRef} className="about-expand-stage" aria-label="About Cinematic Zoom Experience">
        {/* Centered Expanding Photo Card (expands from small card to 100vw x 100vh) */}
        <div ref={mediaCardRef} className="about-media-card">
          <picture className="about-media__picture">
            <source media="(max-width: 768px)" srcSet={aboutMobileImg} />
            <img
              src={aboutDesktopImg}
              alt="Daniel Wellness Center Serene Atmosphere"
              className="about-media__img"
              loading="eager"
            />
          </picture>
          {/* Subtle Wellness Overlay */}
          <div ref={overlayRef} className="about-media__overlay" aria-hidden="true" />
        </div>

        {/* Main About Title floating over/around the center photo (Transforms outward on scroll) */}
        <div ref={splitHeroRef} className="about-split-hero">
          <div className="about-split-title-wrap">
            <h2 ref={titleLeftRef} className="about-split-title about-split-title--left">
              PERSONALIZED
            </h2>
            <h2 ref={titleRightRef} className="about-split-title about-split-title--right">
              WELLNESS JOURNEY
            </h2>
          </div>
        </div>

        {/* 4. Editorial About Content (Reveals ONLY AFTER full photo expansion at 0.62) */}
        <div ref={editorialRef} className="about-editorial-wrap">
          <div className="about-editorial-card">
            {/* Eyebrow */}
            <div className="about-editorial__eyebrow">
              <span className="about-editorial__dot" aria-hidden="true" />
              <span className="about-editorial__eyebrow-text">ABOUT / 01</span>
            </div>

            {/* Headline */}
            <h3 className="about-editorial__headline">
              A Personalized Approach to Your Well-being
            </h3>

            {/* Philosophy */}
            <p className="about-editorial__philosophy">
              “Every individual has different needs, which is why we encourage a personalized approach when choosing a wellness experience.”
            </p>

            {/* Paragraph */}
            <p className="about-editorial__paragraph">
              At Daniel Wellness Center, our services are designed around relaxation, recovery support, body comfort, and overall well-being.
            </p>

            {/* Experiences Pillars */}
            <div className="about-editorial__experiences">
              <div className="about-exp-item">
                <span className="about-exp-num">01</span>
                <span className="about-exp-label">RELAXATION</span>
              </div>
              <span className="about-exp-divider" aria-hidden="true">/</span>
              <div className="about-exp-item">
                <span className="about-exp-num">02</span>
                <span className="about-exp-label">RECOVERY SUPPORT</span>
              </div>
              <span className="about-exp-divider" aria-hidden="true">/</span>
              <div className="about-exp-item">
                <span className="about-exp-num">03</span>
                <span className="about-exp-label">BODY COMFORT</span>
              </div>
              <span className="about-exp-divider" aria-hidden="true">/</span>
              <div className="about-exp-item">
                <span className="about-exp-num">04</span>
                <span className="about-exp-label">OVERALL WELL-BEING</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="about-editorial__actions">
              <a href="#cta" className="about-editorial__btn-primary">
                <span>BOOK AN APPOINTMENT</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="about-btn-arrow"
                >
                  <path
                    d="M9 3L14 8M14 8L9 13M14 8H2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a href="#therapy" className="about-editorial__btn-secondary">
                EXPLORE WELLNESS SERVICES
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
