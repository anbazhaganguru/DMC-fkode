import React, { useEffect, useRef } from 'react';
import './About.css';

export const About = () => {
  const containerRef = useRef(null);
  const cardsStageRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const balanceStageRef = useRef(null);
  const balanceContentRef = useRef(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Movement bounds for horizontal balance progression
    const startX = 0;
    const endX = isMobile ? 45 : 440;
    const travelRange = endX - startX;

    /**
     * Master Scroll Synchronizer:
     * Driven directly by CinematicJourney's master ScrollTrigger progress.
     * ZERO React re-renders, purely hardware-accelerated 3D GPU transforms.
     *
     * Timeline Progression:
     * 0.00 -> 0.20: About entry, dimensional cards emerge from depth
     * 0.20 -> 0.50: Cards progressively come forward toward the viewer
     * 0.50 -> 0.72: Cards settle; floating balance content emerges
     * 0.72 -> 0.90: Balance content travels visibly LEFT -> RIGHT
     * 0.90 -> 1.00: Balance content fades forward into Therapy handoff
     */
    const updateAboutProgress = (rawP) => {
      const p = Math.max(0, Math.min(1, rawP));

      const card1 = card1Ref.current;
      const card2 = card2Ref.current;
      const cardsStage = cardsStageRef.current;
      const balanceStage = balanceStageRef.current;
      const balanceContent = balanceContentRef.current;

      // ====================================================================
      // 1. CARDS PHASE (0.00 -> 0.72)
      // ====================================================================
      if (cardsStage && card1 && card2) {
        if (p < 0.001) {
          // Resting before sequence
          cardsStage.style.visibility = 'visible';
          cardsStage.style.opacity = '0';
          card1.style.transform = 'translate3d(0, 40px, 0) scale(0.82)';
          card1.style.opacity = '0';
          card2.style.transform = 'translate3d(0, 55px, -60px) scale(0.76)';
          card2.style.opacity = '0';
        } else if (p <= 0.20) {
          // 0.00 -> 0.20: Emerge from depth
          const tEmerge = p / 0.20;
          cardsStage.style.visibility = 'visible';
          cardsStage.style.opacity = '1';

          const op1 = tEmerge * 0.85;
          const op2 = tEmerge * 0.75;
          card1.style.transform = 'translate3d(0, 40px, 0) scale(0.82)';
          card1.style.opacity = op1.toFixed(3);
          card2.style.transform = 'translate3d(0, 55px, -60px) scale(0.76)';
          card2.style.opacity = op2.toFixed(3);
        } else if (p <= 0.50) {
          // 0.20 -> 0.50: Cards progressively come forward
          const tForward = (p - 0.20) / 0.30;
          // Smooth cinematic easing: cubic ease-out
          const eased = tForward * tForward * (3 - 2 * tForward);

          cardsStage.style.visibility = 'visible';
          cardsStage.style.opacity = '1';

          const scale1 = 0.82 + (eased * 0.18); // 0.82 -> 1.00
          const y1 = 40 - (eased * 40);         // 40px -> 0px
          const op1 = 0.85 + (eased * 0.15);     // 0.85 -> 1.00

          const scale2 = 0.76 + (eased * 0.18); // 0.76 -> 0.94
          const y2 = 55 - (eased * 55);         // 55px -> 0px
          const op2 = 0.75 + (eased * 0.15);     // 0.75 -> 0.90
          const z2 = -60 + (eased * 40);        // -60px -> -20px

          card1.style.transform = `translate3d(0, ${y1.toFixed(1)}px, 0) scale(${scale1.toFixed(4)})`;
          card1.style.opacity = op1.toFixed(3);

          card2.style.transform = `translate3d(0, ${y2.toFixed(1)}px, ${z2.toFixed(1)}px) scale(${scale2.toFixed(4)})`;
          card2.style.opacity = op2.toFixed(3);
        } else if (p <= 0.60) {
          // 0.50 -> 0.60: Cards settle and hold
          cardsStage.style.visibility = 'visible';
          cardsStage.style.opacity = '1';
          card1.style.transform = 'translate3d(0, 0, 0) scale(1)';
          card1.style.opacity = '1';
          card2.style.transform = 'translate3d(0, 0, -20px) scale(0.94)';
          card2.style.opacity = '0.90';
        } else if (p <= 0.72) {
          // 0.60 -> 0.72: Cards gently dissolve as balance content establishes
          const tDissolve = (p - 0.60) / 0.12;
          const op = 1 - tDissolve;
          const scaleOut = 1.0 - (tDissolve * 0.04);
          const yOut = -(tDissolve * 15);

          cardsStage.style.visibility = 'visible';
          cardsStage.style.opacity = op.toFixed(3);
          card1.style.transform = `translate3d(0, ${yOut.toFixed(1)}px, 0) scale(${scaleOut.toFixed(4)})`;
          card2.style.transform = `translate3d(0, ${yOut.toFixed(1)}px, -20px) scale(${(scaleOut * 0.94).toFixed(4)})`;
        } else {
          // > 0.72: Completely hidden
          cardsStage.style.visibility = 'hidden';
          cardsStage.style.opacity = '0';
        }
      }

      // ====================================================================
      // 2. FLOATING BALANCE CONTENT PHASE (0.55 -> 1.00)
      // ====================================================================
      if (balanceStage && balanceContent) {
        if (p < 0.55) {
          balanceStage.style.visibility = 'hidden';
          balanceStage.style.opacity = '0';
        } else if (p <= 0.72) {
          // 0.55 -> 0.72: Emerges and establishes on the LEFT
          const tEnter = (p - 0.55) / 0.17;
          const eased = tEnter * tEnter * (3 - 2 * tEnter);
          const y = 20 - (eased * 20); // 20px -> 0px

          balanceStage.style.visibility = 'visible';
          balanceStage.style.opacity = eased.toFixed(3);
          balanceContent.style.transform = `translate3d(${startX}px, ${y.toFixed(1)}px, 0)`;
        } else if (p <= 0.90) {
          // 0.72 -> 0.90: Travels visibly from LEFT -> RIGHT
          const tTravel = (p - 0.72) / 0.18;
          // Smooth progressive motion
          const currentX = startX + (tTravel * travelRange);

          balanceStage.style.visibility = 'visible';
          balanceStage.style.opacity = '1';
          balanceContent.style.transform = `translate3d(${currentX.toFixed(1)}px, 0, 0)`;
        } else {
          // 0.90 -> 1.00: Cinematic handoff into Therapy
          const tExit = (p - 0.90) / 0.10;
          const op = Math.max(0, 1 - tExit);
          const yExit = -(tExit * 20); // drifts slightly up
          const currentX = endX + (tExit * 20);

          balanceStage.style.visibility = op > 0 ? 'visible' : 'hidden';
          balanceStage.style.opacity = op.toFixed(3);
          balanceContent.style.transform = `translate3d(${currentX.toFixed(1)}px, ${yExit.toFixed(1)}px, 0)`;
        }
      }
    };

    // Attach updater directly to DOM element for zero-latency direct invocation
    const container = containerRef.current;
    if (container) {
      container.updateAboutProgress = updateAboutProgress;
    }

    // Set initial position
    updateAboutProgress(0);

    return () => {
      if (container) {
        delete container.updateAboutProgress;
      }
    };
  }, []);

  return (
    <div id="about" ref={containerRef} className="about-cinematic-stage">
      {/* ------------------------------------------------------------------
          1. Dimensional About Cards Stage (0.00 -> 0.72)
          ------------------------------------------------------------------ */}
      <div ref={cardsStageRef} className="about-cards-stage" aria-label="About Presentation Cards">
        <div className="about-cards-composition">
          {/* Card 1: Dominant Physical Object */}
          <article ref={card1Ref} className="about-card about-card--primary">
            {/* Eyebrow */}
            <div className="about-card__eyebrow">
              <span className="about-card__dot" aria-hidden="true" />
              <span className="about-card__eyebrow-text">DANIEL WELLNESS METHOD · 01</span>
            </div>

            {/* Display Title */}
            <h2 className="about-card__headline">
              <span className="about-card__headline-line">Clinical Precision.</span>
              <span className="about-card__headline-line about-card__headline-line--italic">
                Quiet Sanctuary.
              </span>
            </h2>

            {/* Body */}
            <p className="about-card__body">
              A restorative space designed to realign physical balance through personalized clinical protocols.
            </p>

            {/* Method Pillars */}
            <div className="about-card__pillars">
              <div className="about-card__pillar-item">
                <span className="about-card__pillar-num">01</span>
                <span className="about-card__pillar-title">PERSONALIZED CARE MAPPING</span>
              </div>
              <div className="about-card__pillar-item">
                <span className="about-card__pillar-num">02</span>
                <span className="about-card__pillar-title">TARGETED TISSUE RECOVERY</span>
              </div>
              <div className="about-card__pillar-item">
                <span className="about-card__pillar-num">03</span>
                <span className="about-card__pillar-title">WHOLE-BODY EQUILIBRIUM</span>
              </div>
            </div>
          </article>

          {/* Card 2: Secondary Depth Companion Card */}
          <article ref={card2Ref} className="about-card about-card--secondary" aria-hidden="true">
            <div className="about-card__secondary-top">
              <span className="about-card__secondary-eyebrow">FOUNDATIONAL VALUES</span>
              <div className="about-card__harmonic-dots">
                <span className="about-card__harmonic-dot about-card__harmonic-dot--sage" />
                <span className="about-card__harmonic-dot about-card__harmonic-dot--blue" />
                <span className="about-card__harmonic-dot about-card__harmonic-dot--rose" />
              </div>
            </div>

            <h3 className="about-card__secondary-headline">
              Mind · Body · Environment
            </h3>

            <p className="about-card__secondary-body">
              Where holistic serenity converges with scientific precision.
            </p>

            <div className="about-card__secondary-mark">
              <span className="about-card__secondary-seal">SANCTUARY ASSURANCE</span>
            </div>
          </article>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. Floating Balance Content Stage (0.55 -> 1.00)
          Floating cinematic editorial layer travelling LEFT -> RIGHT
          ------------------------------------------------------------------ */}
      <div ref={balanceStageRef} className="about-balance-stage" aria-label="Restorative Equilibrium Story">
        <div ref={balanceContentRef} className="about-balance-showcase">
          {/* Badge */}
          <div className="about-balance__eyebrow">
            <span className="about-balance__dot" aria-hidden="true" />
            <span className="about-balance__badge-text">RESTORATIVE EQUILIBRIUM</span>
          </div>

          {/* Headline */}
          <h2 className="about-balance__headline">
            Restoring Your Body’s <span className="about-balance__headline-italic">Natural Balance.</span>
          </h2>

          {/* Restrained Body Paragraph */}
          <p className="about-balance__body">
            Every treatment is calibrated to restore posture, alleviate tension, and revitalize energy.
          </p>

          {/* 3 Horizontal Equilibrium Anchors */}
          <div className="about-balance__anchors">
            <span className="about-balance__anchor-item">POSTURAL REALIGNMENT</span>
            <span className="about-balance__anchor-separator" aria-hidden="true">•</span>
            <span className="about-balance__anchor-item">SOMATIC RECOVERY</span>
            <span className="about-balance__anchor-separator" aria-hidden="true">•</span>
            <span className="about-balance__anchor-item">ENDURING COMFORT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
