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
    const isMobile = window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      gsap.set(loaderRef.current, { opacity: 0, y: 0, visibility: 'hidden' });
      gsap.set(contentWrapperRef.current, { opacity: 0, y: 0, visibility: 'hidden', pointerEvents: 'none' });

      // Initialize card snap items at entrance state
      if (cardsTrackRef.current) {
        const snapItems = cardsTrackRef.current.children;
        gsap.set(snapItems, { opacity: 0, y: 24, scale: 0.97 });
        gsap.set(cardsTrackRef.current, { x: 0 });
      }
    }, containerRef);

    /**
     * Master Scroll Synchronizer for Therapy Section
     * Driven directly by CinematicJourney's master progress using GSAP.
     *
     * Progress Timeline:
     * 0.00 -> 0.12: STAGE A - Chapter 02 Editorial Loader (02 THERAPY)
     *               Loader is displayed, then dissolves naturally between 0.08 and 0.12.
     * 0.12 -> 0.17: STAGE B - Short Breathing Interval (0.12 -> 0.14) & Card 01 Entrance/Settle (0.14 -> 0.17)
     *               Card 01 is centered, translateX is 0px.
     * 0.17 -> 0.82: STAGE C - Horizontal Journey (01 -> 02 -> 03 -> 04 -> 05 -> 06)
     * 0.82 -> 0.90: Therapy Settles (Card 06 resting centered)
     * 0.90 -> 1.00: Subtle Opacity Transition Handoff to Recovery
     */
    const updateTherapyProgress = (rawP, rawVirtualVal, prevFrame, currFrame) => {
      const loader = loaderRef.current;
      const contentWrapper = contentWrapperRef.current;
      const cardsTrack = cardsTrackRef.current;
      if (!contentWrapper || !loader) return;

      const snapItems = cardsTrack ? cardsTrack.children : null;
      const mobile = window.innerWidth <= 768;

      // When before Therapy section (e.g. while in About or reset)
      if (rawP < 0) {
        stateRef.current.stage = 'initial';
        gsap.killTweensOf([loader, contentWrapper]);
        gsap.set(loader, { opacity: 0, y: 0, visibility: 'hidden' });
        gsap.set(contentWrapper, { opacity: 0, y: 0, visibility: 'hidden', pointerEvents: 'none' });
        if (snapItems) {
          gsap.killTweensOf(snapItems);
          gsap.set(snapItems, { opacity: 0, y: 24, scale: 0.97 });
        }
        if (cardsTrack) {
          gsap.set(cardsTrack, { x: 0 });
        }
        return;
      }

      const p = Math.max(0, Math.min(1, rawP));

      // Stage 1 / STAGE A: Chapter 02 Editorial Loader (0.00 <= p < 0.12)
      if (p < 0.12) {
        if (stateRef.current.stage !== 'loader') {
          stateRef.current.stage = 'loader';
          gsap.killTweensOf([loader, contentWrapper]);
          if (snapItems) {
            gsap.killTweensOf(snapItems);
            gsap.set(snapItems, { opacity: 0, y: 24, scale: 0.97 });
          }
          gsap.set(contentWrapper, {
            opacity: 0,
            y: 0,
            visibility: 'hidden',
            pointerEvents: 'none'
          });
        }

        // Lock card track at exactly x = 0 throughout the entire loader stage
        if (cardsTrack) {
          gsap.set(cardsTrack, { x: 0 });
        }

        // Smooth dissolve of loader as p approaches 0.12 (0.08 -> 0.12)
        if (p >= 0.08) {
          const dissolve = Math.max(0, 1 - (p - 0.08) / 0.04);
          gsap.set(loader, { opacity: dissolve, y: 0, visibility: dissolve > 0 ? 'visible' : 'hidden' });
        } else {
          gsap.set(loader, { opacity: 1, y: 0, visibility: 'visible' });
        }
      }
      // STAGE B: Card 01 Entrance & Settle (0.12 <= p < 0.17)
      // Loader has completely finished; Card 01 enters and settles centered; cardsTrack is strictly locked at x = 0
      else if (p < 0.17) {
        gsap.set(loader, {
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none'
        });

        if (cardsTrack) {
          gsap.set(cardsTrack, { x: 0 });
        }

        if (stateRef.current.stage !== 'entrance') {
          stateRef.current.stage = 'entrance';
          gsap.killTweensOf([loader, contentWrapper]);
          gsap.set(contentWrapper, {
            opacity: 1,
            y: 0,
            visibility: 'visible',
            pointerEvents: 'auto'
          });

          if (snapItems) {
            gsap.killTweensOf(snapItems);
            if (mobile) {
              // Mobile: Card 01 entrance from y: 24, scale: 0.97 to y: 0, scale: 1
              gsap.fromTo(
                snapItems[0],
                { opacity: 0, y: 24, scale: 0.97 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.45,
                  ease: 'power2.out',
                  overwrite: 'auto'
                }
              );
              if (snapItems.length > 1) {
                gsap.set(Array.from(snapItems).slice(1), { opacity: 1, y: 0, scale: 1 });
              }
            } else {
              // Desktop: Controlled GSAP staggered entrance for 3x2 grid
              gsap.fromTo(
                snapItems,
                { opacity: 0, y: 24, scale: 0.97 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.50,
                  stagger: 0.06,
                  ease: 'power2.out',
                  overwrite: 'auto'
                }
              );
            }
          }
        }
      }
      // STAGE C: Horizontal Card Journey (0.17 <= p <= 0.82) & Settle / Recovery (0.82 < p <= 1.00)
      else {
        if (stateRef.current.stage !== 'journey') {
          stateRef.current.stage = 'journey';
          gsap.killTweensOf([loader, contentWrapper]);
          gsap.set(loader, {
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none'
          });
          gsap.set(contentWrapper, {
            opacity: 1,
            y: 0,
            visibility: 'visible',
            pointerEvents: 'auto'
          });

          if (snapItems) {
            gsap.set(snapItems, { opacity: 1, y: 0, scale: 1 });
          }
        }

        // Mobile Horizontal Card Journey (0.17 -> 0.82) & Settle (0.82 -> 0.90)
        // Normalized strictly from 0.17 to 0.82: at p = 0.17, cardProgress = 0, mobileX = 0
        if (mobile && cardsTrack) {
          const cardProgress = Math.max(0, Math.min(1, (p - 0.17) / (0.82 - 0.17)));
          const viewportWidth = window.innerWidth;
          const targetX = -cardProgress * (5 * viewportWidth);
          gsap.set(cardsTrack, { x: targetX });
        } else if (cardsTrack) {
          gsap.set(cardsTrack, { x: 0 });
        }

        // Settle & Recovery Transition Fade (0.90 -> 1.00)
        const fadeOpacity = p > 0.90 ? Math.max(0, 1 - (p - 0.90) / 0.10) : 1;
        gsap.set(contentWrapper, { opacity: fadeOpacity });
      }
    };

    const handleResize = () => {
      if (cardsTrackRef.current && window.innerWidth > 768) {
        gsap.set(cardsTrackRef.current, { x: 0 });
      }
    };
    window.addEventListener('resize', handleResize);

    const container = containerRef.current;
    if (container) {
      container.updateTherapyProgress = updateTherapyProgress;
    }

    updateTherapyProgress(0);

    return () => {
      window.removeEventListener('resize', handleResize);
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

      {/* Main Therapy Showcase Content (6 Cards UI) */}
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
