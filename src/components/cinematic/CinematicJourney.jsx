import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinematicImages } from '../../data/images';
import { transitionsConfig, JOURNEY_PHASES } from '../../data/transitions';
import SectionTransition from './SectionTransition';

gsap.registerPlugin(ScrollTrigger);

// Global persistent image cache to eliminate redundant image reloads
const globalImageCache = new Map();

// Start preloading initial Home frames immediately at module evaluation time
const earlyDesktopFrame = cinematicImages?.home?.desktop?.[0];
const earlyMobileFrame = cinematicImages?.home?.mobile?.[0];
if (earlyDesktopFrame) {
  const earlyImgD = new Image();
  earlyImgD.src = earlyDesktopFrame;
  globalImageCache.set(earlyDesktopFrame, earlyImgD);
}
if (earlyMobileFrame) {
  const earlyImgM = new Image();
  earlyImgM.src = earlyMobileFrame;
  globalImageCache.set(earlyMobileFrame, earlyImgM);
}

function preloadImage(url) {
  if (!url) return Promise.resolve(null);
  if (globalImageCache.has(url)) {
    const existing = globalImageCache.get(url);
    if (existing.complete) return Promise.resolve(existing);
    return new Promise((resolve) => {
      existing.addEventListener('load', () => resolve(existing), { once: true });
      existing.addEventListener('error', () => resolve(existing), { once: true });
    });
  }

  return new Promise((resolve) => {
    const img = new Image();
    globalImageCache.set(url, img);
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn(`[CinematicJourney] Failed to load image: ${url}`);
      resolve(img);
    };
    img.src = url;
  });
}

function drawSingleCover(ctx, img, canvasWidth, canvasHeight, alpha = 1.0, scale = 1.0, originX = 0.5, originY = 0.5) {
  if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  let baseWidth, baseHeight;

  if (canvasRatio > imgRatio) {
    baseWidth = canvasWidth;
    baseHeight = canvasWidth / imgRatio;
  } else {
    baseHeight = canvasHeight;
    baseWidth = canvasHeight * imgRatio;
  }

  const renderWidth = baseWidth * scale;
  const renderHeight = baseHeight * scale;
  const offsetX = (canvasWidth - renderWidth) * originX;
  const offsetY = (canvasHeight - renderHeight) * originY;

  ctx.globalAlpha = alpha;
  ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
}

function drawInterpolatedFrames(ctx, activeFrames, virtualProgress, canvasWidth, canvasHeight, isHome = false) {
  const total = activeFrames.length;
  if (total === 0) return;

  const maxIndex = total - 1;
  const clampedVirtual = Math.max(0, Math.min(virtualProgress, maxIndex));
  const baseIndex = Math.floor(clampedVirtual);
  const nextIndex = Math.min(baseIndex + 1, maxIndex);
  const fraction = clampedVirtual - baseIndex;

  const baseImg = globalImageCache.get(activeFrames[baseIndex]);
  const nextImg = globalImageCache.get(activeFrames[nextIndex]);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // ONE continuous camera movement across the entire Home cinematic timeline
  // No local per-frame reset, no zoom-out between frames.
  // Scale moves monotonically forward driven by overall Home progress:
  // progress 0.00 -> scale 1.00 (Frame 1)
  // progress 0.25 -> scale ~1.015 (Frame 2)
  // progress 0.50 -> scale ~1.030 (Frame 3)
  // progress 0.75 -> scale ~1.045 (Frame 4)
  // progress 1.00 -> scale ~1.060 (Frame 5)
  let cameraScale = 1.0;
  let originX = 0.5;
  let originY = 0.5;

  if (isHome) {
    const overallProgress = maxIndex > 0 ? clampedVirtual / maxIndex : 0;
    cameraScale = 1.0 + (overallProgress * 0.06);
    originX = 0.50 + (overallProgress * 0.035);
    originY = 0.50 + (overallProgress * 0.025);
  }

  if (baseIndex === nextIndex || !nextImg || !nextImg.complete) {
    if (baseImg && baseImg.complete) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawSingleCover(ctx, baseImg, canvasWidth, canvasHeight, 1.0, cameraScale, originX, originY);
      ctx.globalAlpha = 1.0;
    }
    return;
  }

  let nextAlpha = 0;
  if (total === 2) {
    // 2-frame sequence (About: 02 -> 05): wide, luxurious smooth cross-dissolve
    // 0.00 -> 0.18: Frame 0 established cleanly
    // 0.18 -> 0.82: gradual cinematic progression into Frame 1
    // 0.82 -> 1.00: Frame 1 settles fully into final state before transition
    if (fraction <= 0.18) {
      nextAlpha = 0;
    } else if (fraction >= 0.82) {
      nextAlpha = 1;
    } else {
      const t = (fraction - 0.18) / 0.64;
      nextAlpha = t * t * (3 - 2 * t);
    }
  } else {
    if (fraction <= 0.30) {
      nextAlpha = 0;
    } else if (fraction >= 0.70) {
      nextAlpha = 1;
    } else {
      const t = (fraction - 0.30) / 0.40;
      nextAlpha = t * t * (3 - 2 * t);
    }
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (nextAlpha <= 0) {
    drawSingleCover(ctx, baseImg, canvasWidth, canvasHeight, 1.0, cameraScale, originX, originY);
  } else if (nextAlpha >= 1) {
    drawSingleCover(ctx, nextImg, canvasWidth, canvasHeight, 1.0, cameraScale, originX, originY);
  } else {
    drawSingleCover(ctx, baseImg, canvasWidth, canvasHeight, 1.0, cameraScale, originX, originY);
    drawSingleCover(ctx, nextImg, canvasWidth, canvasHeight, nextAlpha, cameraScale, originX, originY);
  }

  ctx.globalAlpha = 1.0;
}

function renderHomeToAboutTransition(ctx, homeImgUrl, aboutImgUrl, progress, canvasWidth, canvasHeight) {
  const homeImg = globalImageCache.get(homeImgUrl);
  const aboutImg = globalImageCache.get(aboutImgUrl);

  const p = Math.max(0, Math.min(1, progress));

  // Home Frame 5 holds its exact final settled scale (1.060) and origin (0.535, 0.525)
  const homeScale = 1.06;
  const homeOriginX = 0.535;
  const homeOriginY = 0.525;

  // About 02 enters at its exact, intended natural starting scale (1.000) and origin (0.5, 0.5)
  const aboutScale = 1.0;
  const aboutOriginX = 0.5;
  const aboutOriginY = 0.5;

  // Smooth emergence matching the paper-bridge lighting curve
  let aboutAlpha = 0;
  if (p <= 0.08) {
    aboutAlpha = 0;
  } else if (p >= 0.78) {
    aboutAlpha = 1.0;
  } else {
    const t = (p - 0.08) / 0.70;
    aboutAlpha = t * t * (3 - 2 * t);
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Always draw Home Frame 5 solid underneath as long as aboutAlpha < 1.0
  if (aboutAlpha < 1.0 && homeImg && homeImg.complete) {
    drawSingleCover(ctx, homeImg, canvasWidth, canvasHeight, 1.0, homeScale, homeOriginX, homeOriginY);
  }

  // Draw About 02 on top using the exact same canvas drawSingleCover engine
  if (aboutAlpha > 0 && aboutImg && aboutImg.complete) {
    drawSingleCover(ctx, aboutImg, canvasWidth, canvasHeight, aboutAlpha, aboutScale, aboutOriginX, aboutOriginY);
  }

  ctx.globalAlpha = 1.0;
}

export const CinematicJourney = ({ children }) => {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const overlaysContainerRef = useRef(null);
  const canvasDimsRef = useRef({ width: 0, height: 0 });
  const isMobileRef = useRef(false);
  const lastRenderedKeyRef = useRef('');

  // Active state for transitions
  const [transitionStates, setTransitionStates] = useState({
    homeToAbout: { progress: 0, isActive: false },
    aboutToTherapy: { progress: 0, isActive: false },
    therapyToRecovery: { progress: 0, isActive: false },
    recoveryToCTA: { progress: 0, isActive: false }
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Explicitly guarantee refresh/reload starts at Home at scroll position 0
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    ScrollTrigger.clearScrollMemory();
    window.scrollTo(0, 0);

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const overlaysContainer = overlaysContainerRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const mql = window.matchMedia('(max-width: 768px)');
    const reducedMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');

    isMobileRef.current = mql.matches;
    setIsMobile(mql.matches);
    setIsReducedMotion(reducedMotionMql.matches);

    if (reducedMotionMql.matches) {
      return;
    }

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = viewportRef.current;
      const width = viewport ? viewport.clientWidth : window.innerWidth;
      const height = viewport ? viewport.clientHeight : window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      canvasDimsRef.current = { width: canvas.width, height: canvas.height };
    };

    updateCanvasSize();

    // Preload sequence frames
    const getFrames = (sec) => {
      const secImgs = cinematicImages[sec];
      if (!secImgs) return [];
      return isMobileRef.current ? (secImgs.mobile || secImgs.desktop) : secImgs.desktop;
    };

    // Preload initial frames of all sections
    ['home', 'about', 'therapy', 'recovery'].forEach((sec) => {
      const frames = getFrames(sec);
      frames.forEach((url) => preloadImage(url));
    });

    // Render helper
    const renderFrame = (activeFrames, virtualProgress, section = 'home', force = false) => {
      if (!activeFrames || !activeFrames.length) return;
      const key = `${activeFrames[0]}_${virtualProgress.toFixed(3)}`;
      if (!force && key === lastRenderedKeyRef.current) return;
      lastRenderedKeyRef.current = key;

      const { width, height } = canvasDimsRef.current;
      if (width > 0 && height > 0) {
        drawInterpolatedFrames(ctx, activeFrames, virtualProgress, width, height, section === 'home');
      }
    };

    // Draw initial Home Frame 0 immediately on mount
    const homeFrames = getFrames('home');
    const initImg = globalImageCache.get(homeFrames[0]) || new Image();
    if (!globalImageCache.has(homeFrames[0])) {
      initImg.src = homeFrames[0];
      globalImageCache.set(homeFrames[0], initImg);
    }

    const drawInitialNow = () => {
      const { width, height } = canvasDimsRef.current;
      if (width > 0 && height > 0 && initImg.complete && initImg.naturalWidth > 0) {
        ctx.clearRect(0, 0, width, height);
        drawSingleCover(ctx, initImg, width, height, 1.0, 1.0, 0.5, 0.5);
      }
    };

    if (initImg.complete && initImg.naturalWidth > 0) {
      drawInitialNow();
    } else {
      initImg.addEventListener('load', drawInitialNow, { once: true });
    }

    // GSAP ScrollTrigger Context
    const gsapContext = gsap.context(() => {
      const pinDistance = `${Math.round(window.innerHeight * 4.2)}px`;

      const mainTrigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${pinDistance}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.5,
        fastScrollEnd: true,
        onUpdate: (self) => {
          const p = self.progress; // 0.0 -> 1.0

          // Determine active phase
          let activePhase = JOURNEY_PHASES[0];
          for (let i = 0; i < JOURNEY_PHASES.length; i++) {
            const phase = JOURNEY_PHASES[i];
            if (p >= phase.start && p <= phase.end) {
              activePhase = phase;
              break;
            } else if (p > phase.end && i === JOURNEY_PHASES.length - 1) {
              activePhase = phase;
            }
          }

          // 1. Handle Sequence Rendering
          if (activePhase.type === 'sequence') {
            const phaseProgress = (p - activePhase.start) / activePhase.duration;
            const frames = getFrames(activePhase.section);
            const virtualVal = phaseProgress * (frames.length - 1);
            renderFrame(frames, virtualVal, activePhase.section);

            // Deactivate all transition layers
            setTransitionStates((prev) => {
              let changed = false;
              const next = { ...prev };
              Object.keys(next).forEach((k) => {
                if (next[k].isActive) {
                  next[k] = { progress: 0, isActive: false };
                  changed = true;
                }
              });
              return changed ? next : prev;
            });

            // Update overlay opacities and synchronize About UI
            if (overlaysContainer) {
              const overlayEls = overlaysContainer.querySelectorAll('.cinematic-section-overlay');
              overlayEls.forEach((el) => {
                const sec = el.getAttribute('data-section');
                if (sec === activePhase.section) {
                  // Fade out overlay near end of section sequence (last 18%)
                  const fadeOut = phaseProgress > 0.82 ? (1 - phaseProgress) / 0.18 : 1.0;
                  // Fade in overlay at start of section sequence (first 15%)
                  // Home section is already visible from initial load/scroll 0
                  const fadeIn = (sec === 'home' || phaseProgress >= 0.15) ? 1.0 : phaseProgress / 0.15;
                  const op = Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
                  el.style.opacity = op.toFixed(2);
                  el.style.visibility = op > 0 ? 'visible' : 'hidden';
                  el.style.pointerEvents = op > 0.5 ? 'auto' : 'none';

                  // Directly drive About UI progress from master journey progress
                  if (sec === 'about') {
                    const aboutEl = el.querySelector('#about');
                    if (aboutEl && typeof aboutEl.updateAboutProgress === 'function') {
                      aboutEl.updateAboutProgress(phaseProgress);
                    }
                  }
                } else {
                  el.style.opacity = '0';
                  el.style.visibility = 'hidden';
                  el.style.pointerEvents = 'none';

                  if (sec === 'about') {
                    const aboutEl = el.querySelector('#about');
                    if (aboutEl && typeof aboutEl.updateAboutProgress === 'function') {
                      const isPast = p > activePhase.end;
                      aboutEl.updateAboutProgress(isPast ? 1 : 0);
                    }
                  }
                }
              });
            }
          }

          // 2. Handle Bridge / Transition Rendering
          if (activePhase.type === 'transition') {
            const bridgeProgress = Math.max(0, Math.min(1, (p - activePhase.start) / activePhase.duration));
            const tKey = activePhase.transitionKey;

            if (tKey === 'homeToAbout') {
              const homeFrames = getFrames('home');
              const aboutFrames = getFrames('about');
              const { width, height } = canvasDimsRef.current;
              if (width > 0 && height > 0 && homeFrames.length && aboutFrames.length) {
                renderHomeToAboutTransition(
                  ctx,
                  homeFrames[homeFrames.length - 1],
                  aboutFrames[0],
                  bridgeProgress,
                  width,
                  height
                );
                lastRenderedKeyRef.current = `trans_homeToAbout_${bridgeProgress.toFixed(3)}`;
              }
            }

            setTransitionStates((prev) => {
              return {
                ...prev,
                [tKey]: { progress: bridgeProgress, isActive: true }
              };
            });

            // Hide all section overlays during active bridge
            if (overlaysContainer) {
              const overlayEls = overlaysContainer.querySelectorAll('.cinematic-section-overlay');
              overlayEls.forEach((el) => {
                el.style.opacity = '0';
                el.style.visibility = 'hidden';
                el.style.pointerEvents = 'none';
              });

              const aboutEl = overlaysContainer.querySelector('#about');
              if (aboutEl && typeof aboutEl.updateAboutProgress === 'function') {
                if (tKey === 'homeToAbout') {
                  aboutEl.updateAboutProgress(0);
                } else if (tKey === 'aboutToTherapy') {
                  aboutEl.updateAboutProgress(1);
                }
              }
            }
          }
        }
      });

      // Render Frame 0 immediately on initialization
      renderFrame(homeFrames, 0, 'home', true);

      // Anchor links smooth navigation listener
      const handleAnchorClick = (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        const targetId = href.replace('#', '');

        // Find phase matching targetId
        let targetPhase = null;
        if (targetId === 'home') targetPhase = JOURNEY_PHASES[0];
        else if (targetId === 'about') targetPhase = JOURNEY_PHASES[2];
        else if (targetId === 'therapy') targetPhase = JOURNEY_PHASES[4];
        else if (targetId === 'recovery-for' || targetId === 'recovery') targetPhase = JOURNEY_PHASES[6];
        else if (targetId === 'cta') {
          // Scroll to the end of the journey pin
          e.preventDefault();
          const targetScroll = mainTrigger.end + 50;
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          return;
        }

        if (targetPhase) {
          e.preventDefault();
          const triggerStart = mainTrigger.start;
          const triggerDistance = mainTrigger.end - mainTrigger.start;
          const targetScroll = triggerStart + targetPhase.start * triggerDistance + 10;
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      };

      document.addEventListener('click', handleAnchorClick);

      return () => {
        document.removeEventListener('click', handleAnchorClick);
      };
    }, container);

    // Responsive Breakpoint Listener
    const handleBreakpointChange = (e) => {
      isMobileRef.current = e.matches;
      setIsMobile(e.matches);
      ScrollTrigger.refresh();
    };
    mql.addEventListener('change', handleBreakpointChange);

    // Resize Handler
    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateCanvasSize();
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimer);
      mql.removeEventListener('change', handleBreakpointChange);
      window.removeEventListener('resize', handleResize);
      gsapContext.revert();
    };
  }, []);

  // Accessibility: Fallback for Reduced Motion
  if (isReducedMotion) {
    return (
      <div className="cinematic-journey-static">
        {children}
      </div>
    );
  }

  const initialPosterSrc = isMobile
    ? (cinematicImages.home.mobile[0] || cinematicImages.home.desktop[0])
    : cinematicImages.home.desktop[0];

  return (
    <div
      ref={containerRef}
      className="cinematic-journey-wrapper"
      id="cinematic-journey"
    >
      <div ref={viewportRef} className="cinematic-journey-viewport">
        {/* Instant Native Poster for immediate zero-lag first paint */}
        <img
          src={initialPosterSrc}
          alt=""
          aria-hidden="true"
          className="cinematic-canvas-poster"
        />

        {/* Unified Canvas Sequence Engine */}
        <canvas
          ref={canvasRef}
          className="cinematic-canvas"
          aria-hidden="true"
        />

        {/* Cinematic Section-to-Section Transitions */}
        <SectionTransition
          config={transitionsConfig.homeToAbout}
          progress={transitionStates.homeToAbout.progress}
          isActive={transitionStates.homeToAbout.isActive}
          isMobile={isMobile}
        />

        <SectionTransition
          config={transitionsConfig.aboutToTherapy}
          progress={transitionStates.aboutToTherapy.progress}
          isActive={transitionStates.aboutToTherapy.isActive}
          isMobile={isMobile}
        />

        <SectionTransition
          config={transitionsConfig.therapyToRecovery}
          progress={transitionStates.therapyToRecovery.progress}
          isActive={transitionStates.therapyToRecovery.isActive}
          isMobile={isMobile}
        />

        <SectionTransition
          config={transitionsConfig.recoveryToCTA}
          progress={transitionStates.recoveryToCTA.progress}
          isActive={transitionStates.recoveryToCTA.isActive}
          isMobile={isMobile}
        />

        {/* Section Overlay Content Layers */}
        <div ref={overlaysContainerRef} className="cinematic-overlays-container">
          {React.Children.map(children, (child) => {
            if (!child) return null;
            const secId = child.props.id || (child.type && child.type.name ? child.type.name.toLowerCase() : '');
            let matchedKey = null;
            if (secId.includes('home')) matchedKey = 'home';
            else if (secId.includes('about')) matchedKey = 'about';
            else if (secId.includes('therapy')) matchedKey = 'therapy';
            else if (secId.includes('recovery')) matchedKey = 'recovery';

            const isHome = matchedKey === 'home';

            return (
              <div
                data-section={matchedKey || 'generic'}
                className={`cinematic-section-overlay cinematic-section-overlay--${matchedKey || 'generic'}`}
                style={{
                  opacity: isHome ? 1 : 0,
                  visibility: isHome ? 'visible' : 'hidden',
                  pointerEvents: isHome ? 'auto' : 'none'
                }}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CinematicJourney;
