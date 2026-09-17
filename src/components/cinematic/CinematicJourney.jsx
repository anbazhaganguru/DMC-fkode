import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cinematicImages } from '../../data/images';
import { transitionsConfig, JOURNEY_PHASES } from '../../data/transitions';
import SectionTransition from './SectionTransition';

gsap.registerPlugin(ScrollTrigger);

// Global persistent image cache & decoded tracking to eliminate redundant loads/decodes
const globalImageCache = new Map();
const decodedImageUrls = new Set();

function decodeImageAsync(img, url) {
  if (!img || decodedImageUrls.has(url)) return Promise.resolve(img);
  if ('decode' in img) {
    return img.decode()
      .then(() => {
        decodedImageUrls.add(url);
        return img;
      })
      .catch(() => {
        decodedImageUrls.add(url);
        return img;
      });
  }
  decodedImageUrls.add(url);
  return Promise.resolve(img);
}

function preloadImage(url) {
  if (!url) return Promise.resolve(null);
  if (globalImageCache.has(url)) {
    const existing = globalImageCache.get(url);
    if (existing.complete && existing.naturalWidth > 0) {
      if (!decodedImageUrls.has(url)) {
        return decodeImageAsync(existing, url);
      }
      return Promise.resolve(existing);
    }
    return new Promise((resolve) => {
      existing.addEventListener('load', () => {
        decodeImageAsync(existing, url).then(resolve);
      }, { once: true });
      existing.addEventListener('error', () => resolve(existing), { once: true });
    });
  }

  return new Promise((resolve) => {
    const img = new Image();
    globalImageCache.set(url, img);
    img.onload = () => {
      decodeImageAsync(img, url).then(resolve);
    };
    img.onerror = () => {
      console.warn(`[CinematicJourney] Failed to load image: ${url}`);
      resolve(img);
    };
    img.src = url;
  });
}

// Start preloading initial Home frames immediately at module evaluation time
const earlyDesktopFrame = cinematicImages?.home?.desktop?.[0];
const earlyMobileFrame = cinematicImages?.home?.mobile?.[0];
if (earlyDesktopFrame) {
  preloadImage(earlyDesktopFrame);
}
if (earlyMobileFrame) {
  preloadImage(earlyMobileFrame);
}

function drawSingleCover(ctx, img, canvasWidth, canvasHeight, alpha = 1.0, scale = 1.0, originX = 0.5, originY = 0.5) {
  if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;

  // Unified centered cover fit derived strictly from canvas container dimensions
  const scaleCover = Math.max(canvasWidth / img.naturalWidth, canvasHeight / img.naturalHeight);
  const baseWidth = img.naturalWidth * scaleCover;
  const baseHeight = img.naturalHeight * scaleCover;

  const renderWidth = baseWidth * scale;
  const renderHeight = baseHeight * scale;

  const drawX = (canvasWidth - renderWidth) * originX;
  const drawY = (canvasHeight - renderHeight) * originY;

  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.drawImage(img, drawX, drawY, renderWidth, renderHeight);
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

  let cameraScale = 1.0;
  if (isHome) {
    const overallProgress = maxIndex > 0 ? clampedVirtual / maxIndex : 0;
    cameraScale = 1.0 + (overallProgress * 0.04);
  }

  if (baseIndex === nextIndex || !nextImg || !nextImg.complete) {
    if (baseImg && baseImg.complete) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawSingleCover(ctx, baseImg, canvasWidth, canvasHeight, 1.0, cameraScale);
      ctx.globalAlpha = 1.0;
    }
    return;
  }

  let nextAlpha = 0;
  if (total === 2) {
    if (fraction <= 0.15) {
      nextAlpha = 0;
    } else if (fraction >= 0.85) {
      nextAlpha = 1;
    } else {
      const t = (fraction - 0.15) / 0.70;
      nextAlpha = t * t * (3 - 2 * t);
    }
  } else if (isHome && baseIndex === 3 && nextIndex === 4) {
    if (fraction <= 0.0) {
      nextAlpha = 0;
    } else if (fraction >= 0.70) {
      nextAlpha = 1;
    } else {
      const t = fraction / 0.70;
      nextAlpha = t * t * (3 - 2 * t);
    }
  } else {
    if (fraction <= 0.25) {
      nextAlpha = 0;
    } else if (fraction >= 0.75) {
      nextAlpha = 1;
    } else {
      const t = (fraction - 0.25) / 0.50;
      nextAlpha = t * t * (3 - 2 * t);
    }
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (nextAlpha <= 0) {
    drawSingleCover(ctx, baseImg, canvasWidth, canvasHeight, 1.0, cameraScale);
  } else if (nextAlpha >= 1) {
    drawSingleCover(ctx, nextImg, canvasWidth, canvasHeight, 1.0, cameraScale);
  } else {
    drawSingleCover(ctx, baseImg, canvasWidth, canvasHeight, 1.0, cameraScale);
    drawSingleCover(ctx, nextImg, canvasWidth, canvasHeight, nextAlpha, cameraScale);
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
  const lastRenderedRef = useRef({ section: '', virtualProgress: -999, phaseProgress: -999 });

  // Passive static states for transition wrappers
  const [transitionStates] = useState({
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

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const mql = window.matchMedia('(max-width: 768px)');
    const reducedMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');

    isMobileRef.current = mql.matches;
    setIsMobile(mql.matches);
    setIsReducedMotion(reducedMotionMql.matches);

    if (reducedMotionMql.matches) {
      return;
    }

    // DPR cap: 1.5 for desktop, 1.25 for mobile/tablet to avoid GPU fill rate strain
    const updateCanvasSize = () => {
      const dprCap = isMobileRef.current ? 1.25 : 1.5;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const viewport = viewportRef.current;
      const width = viewport ? viewport.clientWidth : window.innerWidth;
      const height = viewport ? viewport.clientHeight : window.innerHeight;

      const targetWidth = Math.round(width * dpr);
      const targetHeight = Math.round(height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        // Configure smoothing once during canvas resize
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';

        canvasDimsRef.current = { width: targetWidth, height: targetHeight };
        lastRenderedRef.current.virtualProgress = -999; // force redraw on resize
      }
    };

    updateCanvasSize();

    // Sequence Frame Retrieval
    const getFrames = (sec) => {
      const secImgs = cinematicImages[sec];
      if (!secImgs) return [];
      return isMobileRef.current ? (secImgs.mobile || secImgs.desktop) : secImgs.desktop;
    };

    const homeFrames = getFrames('home');
    const aboutFrames = getFrames('about');
    const therapyFrames = getFrames('therapy');
    const recoveryFrames = getFrames('recovery');

    // Prioritized Asynchronous Decoding:
    // 1. Visible Home frames decoded immediately
    homeFrames.forEach((url) => preloadImage(url));

    // 2. Next section (About) preloaded shortly after initial render
    const timerAbout = setTimeout(() => {
      aboutFrames.forEach((url) => preloadImage(url));
    }, 150);

    // 3. Upcoming sequences (Therapy & Recovery) preloaded progressively
    const timerUpcoming = setTimeout(() => {
      therapyFrames.forEach((url) => preloadImage(url));
      recoveryFrames.forEach((url) => preloadImage(url));
    }, 400);

    // Section Entry Cross-Dissolve Helper
    const renderCrossDissolve = (outgoingUrl, incomingUrl, blendProgress, width, height) => {
      const outImg = globalImageCache.get(outgoingUrl);
      const inImg = globalImageCache.get(incomingUrl);
      const p = Math.max(0, Math.min(1, blendProgress));
      const alpha = p * p * (3 - 2 * p);

      ctx.clearRect(0, 0, width, height);
      if (outImg && outImg.complete) {
        drawSingleCover(ctx, outImg, width, height, 1.0, 1.0);
      }
      if (inImg && inImg.complete && alpha > 0) {
        drawSingleCover(ctx, inImg, width, height, alpha, 1.0);
      }
      ctx.globalAlpha = 1.0;
    };

    // Cache stable DOM references for overlays and child sections on mount
    const cachedOverlays = [];
    if (overlaysContainer) {
      const overlayNodes = overlaysContainer.querySelectorAll('.cinematic-section-overlay');
      overlayNodes.forEach((el) => {
        const sec = el.getAttribute('data-section');
        cachedOverlays.push({
          el,
          sec,
          aboutEl: sec === 'about' ? el.querySelector('#about') : null,
          therapyEl: sec === 'therapy' ? el.querySelector('#therapy') : null,
          recoveryEl: sec === 'recovery' ? (el.querySelector('#recovery-for') || el.querySelector('#recovery')) : null,
          lastOpacity: '',
          lastVisibility: '',
          lastPointerEvents: ''
        });
      });
    }

    const setOverlayStyle = (item, opStr, visStr, peStr) => {
      if (item.lastOpacity !== opStr) {
        item.el.style.opacity = opStr;
        item.lastOpacity = opStr;
      }
      if (item.lastVisibility !== visStr) {
        item.el.style.visibility = visStr;
        item.lastVisibility = visStr;
      }
      if (item.lastPointerEvents !== peStr) {
        item.el.style.pointerEvents = peStr;
        item.lastPointerEvents = peStr;
      }
    };

    // Single rAF-based render scheduling pipeline
    let rafId = null;
    const renderState = {
      p: 0,
      activePhase: JOURNEY_PHASES[0],
      phaseProgress: 0,
      frames: homeFrames,
      virtualVal: 0,
      section: 'home',
      force: false
    };

    const executeRender = () => {
      rafId = null;

      const { p, activePhase, phaseProgress, frames, virtualVal, section, force } = renderState;
      const { width, height } = canvasDimsRef.current;

      // 1. Canvas Redundancy Check
      const last = lastRenderedRef.current;
      const sectionChanged = last.section !== section;
      const delta = Math.abs(virtualVal - last.virtualProgress);

      // Render only if forced, section changed, or progress has moved by >= 0.0015
      if (width > 0 && height > 0 && (force || sectionChanged || delta >= 0.0015)) {
        last.section = section;
        last.virtualProgress = virtualVal;
        last.phaseProgress = phaseProgress;

        const total = frames.length;
        const normPhaseProgress = total > 1 ? virtualVal / (total - 1) : 0;

        if (section === 'about' && normPhaseProgress < 0.20) {
          const hFrames = getFrames('home');
          const outgoingUrl = hFrames[hFrames.length - 1];
          const incomingUrl = frames[0];
          renderCrossDissolve(outgoingUrl, incomingUrl, normPhaseProgress / 0.20, width, height);
        } else if (section === 'therapy' && normPhaseProgress < 0.20) {
          const aFrames = getFrames('about');
          const outgoingUrl = aFrames[aFrames.length - 1];
          const incomingUrl = frames[0];
          renderCrossDissolve(outgoingUrl, incomingUrl, normPhaseProgress / 0.20, width, height);
        } else if (section === 'recovery' && normPhaseProgress < 0.20) {
          const tFrames = getFrames('therapy');
          const outgoingUrl = tFrames[tFrames.length - 1];
          const incomingUrl = frames[0];
          renderCrossDissolve(outgoingUrl, incomingUrl, normPhaseProgress / 0.20, width, height);
        } else {
          drawInterpolatedFrames(ctx, frames, virtualVal, width, height, section === 'home');
        }
      }

      // 2. Synchronize Section Overlays (using cached references)
      cachedOverlays.forEach((item) => {
        const sec = item.sec;
        if (sec === activePhase.section) {
          const isPersistentOverlay = sec === 'about' || sec === 'therapy' || sec === 'recovery';
          let fadeOut = 1.0;
          if (!isPersistentOverlay) {
            fadeOut = phaseProgress > 0.82 ? (1 - phaseProgress) / 0.18 : 1.0;
          } else if (sec === 'about' && phaseProgress >= 0.85) {
            fadeOut = phaseProgress >= 0.96 ? 0.0 : Math.max(0, 1.0 - (phaseProgress - 0.85) / (0.96 - 0.85));
          }

          const fadeIn = (sec === 'home' || isPersistentOverlay || phaseProgress >= 0.15) ? 1.0 : phaseProgress / 0.15;
          const op = Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
          const opStr = op.toFixed(2);
          const visStr = op > 0 ? 'visible' : 'hidden';
          const peStr = op > 0.5 ? 'auto' : 'none';
          setOverlayStyle(item, opStr, visStr, peStr);

          const secFrames = getFrames(sec);
          const secVirtualVal = phaseProgress * Math.max(1, secFrames.length - 1);
          const secPrevFrame = Math.floor(secVirtualVal);
          const secCurrFrame = Math.min(secPrevFrame + 1, secFrames.length - 1);

          if (sec === 'about' && typeof item.aboutEl?.updateAboutProgress === 'function') {
            item.aboutEl.updateAboutProgress(phaseProgress, secVirtualVal, secPrevFrame, secCurrFrame);
          } else if (sec === 'therapy' && typeof item.therapyEl?.updateTherapyProgress === 'function') {
            item.therapyEl.updateTherapyProgress(phaseProgress, secVirtualVal, secPrevFrame, secCurrFrame);
          } else if (sec === 'recovery' && typeof item.recoveryEl?.updateRecoveryProgress === 'function') {
            item.recoveryEl.updateRecoveryProgress(phaseProgress, secVirtualVal, secPrevFrame, secCurrFrame);
          }
        } else {
          const previousFrame = Math.floor(virtualVal);
          const currentFrame = Math.min(previousFrame + 1, frames.length - 1);
          const isPhoto5Starting = (previousFrame === 3 && currentFrame === 4) || virtualVal >= 3.0;

          if (sec === 'about' && activePhase.section === 'home' && isPhoto5Starting) {
            const progressInPhoto5 = Math.max(0, Math.min(1, (virtualVal - 3.0) / 0.35));
            const loaderFadeIn = progressInPhoto5 * progressInPhoto5 * (3 - 2 * progressInPhoto5);
            const op = Math.max(0.05, loaderFadeIn);
            setOverlayStyle(item, op.toFixed(2), 'visible', 'auto');

            if (typeof item.aboutEl?.updateAboutProgress === 'function') {
              item.aboutEl.updateAboutProgress(0);
            }
          } else if (sec === 'therapy' && activePhase.section === 'about' && phaseProgress >= 0.88) {
            const therapyEmergence = Math.max(0, Math.min(1, (phaseProgress - 0.88) / 0.12));
            const smoothAlpha = therapyEmergence * therapyEmergence * (3 - 2 * therapyEmergence);
            const opStr = smoothAlpha.toFixed(2);
            setOverlayStyle(item, opStr, smoothAlpha > 0 ? 'visible' : 'hidden', 'none');

            if (typeof item.therapyEl?.updateTherapyProgress === 'function') {
              item.therapyEl.updateTherapyProgress(0);
            }
          } else if (sec === 'recovery' && activePhase.section === 'therapy' && phaseProgress >= 0.90) {
            const recoveryEmergence = Math.max(0, Math.min(1, (phaseProgress - 0.90) / 0.10));
            const smoothAlpha = recoveryEmergence * recoveryEmergence * (3 - 2 * recoveryEmergence);
            setOverlayStyle(item, smoothAlpha.toFixed(2), 'visible', 'none');

            if (typeof item.recoveryEl?.updateRecoveryProgress === 'function') {
              item.recoveryEl.updateRecoveryProgress(0, 0, 0, 0);
            }
          } else if (sec === 'therapy' && activePhase.section === 'recovery' && phaseProgress < 0.10) {
            const therapyExitAlpha = Math.max(0, 1 - phaseProgress / 0.10);
            const opStr = (therapyExitAlpha * 0.4).toFixed(2);
            setOverlayStyle(item, opStr, therapyExitAlpha > 0 ? 'visible' : 'hidden', 'none');
          } else {
            setOverlayStyle(item, '0', 'hidden', 'none');

            if (sec === 'about' && typeof item.aboutEl?.updateAboutProgress === 'function') {
              const isPast = p > activePhase.end;
              item.aboutEl.updateAboutProgress(isPast ? 1 : 0);
            } else if (sec === 'therapy' && typeof item.therapyEl?.updateTherapyProgress === 'function') {
              const isPast = p > activePhase.end;
              item.therapyEl.updateTherapyProgress(isPast ? 1 : -1);
            } else if (sec === 'recovery' && typeof item.recoveryEl?.updateRecoveryProgress === 'function') {
              const isPast = p > activePhase.end;
              item.recoveryEl.updateRecoveryProgress(isPast ? 1 : -1);
            }
          }
        }
      });
    };

    const scheduleRender = (p, force = false) => {
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

      const phaseProgress = (p - activePhase.start) / activePhase.duration;
      const frames = getFrames(activePhase.section);
      const virtualVal = phaseProgress * (frames.length - 1);

      renderState.p = p;
      renderState.activePhase = activePhase;
      renderState.phaseProgress = phaseProgress;
      renderState.frames = frames;
      renderState.virtualVal = virtualVal;
      renderState.section = activePhase.section;
      renderState.force = force;

      if (!rafId) {
        rafId = requestAnimationFrame(executeRender);
      }
    };

    // Draw initial Home Frame 0 immediately on mount
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
        scrub: 0.8,
        onUpdate: (self) => {
          scheduleRender(self.progress);
        }
      });

      // Render Frame 0 immediately on initialization & refresh ScrollTrigger
      scheduleRender(0, true);
      ScrollTrigger.refresh();

      // Anchor links smooth navigation listener
      const handleAnchorClick = (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        const targetId = href.replace('#', '');

        if (targetId === 'home') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        if (targetId === 'cta') {
          e.preventDefault();
          const ctaEl = document.getElementById('cta');
          if (ctaEl) {
            const ctaTop = ctaEl.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: ctaTop, behavior: 'smooth' });
          } else {
            const targetScroll = mainTrigger.end + window.innerHeight;
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          }
          return;
        }

        // Find phase matching targetId
        const targetPhase = JOURNEY_PHASES.find(
          (p) => p.section === targetId || p.id === targetId || (targetId === 'recovery-for' && p.section === 'recovery')
        );

        if (targetPhase) {
          e.preventDefault();
          const triggerStart = mainTrigger.start;
          const triggerDistance = mainTrigger.end - mainTrigger.start;
          const targetScroll = triggerStart + targetPhase.start * triggerDistance + 20;
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      };

      document.addEventListener('click', handleAnchorClick);

      return () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
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
      clearTimeout(timerAbout);
      clearTimeout(timerUpcoming);
      clearTimeout(resizeTimer);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
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
