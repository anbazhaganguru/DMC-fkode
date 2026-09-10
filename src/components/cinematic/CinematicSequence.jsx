import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Global persistent image cache: URL -> HTMLImageElement
// Satisfies constraint: Do not reload already cached images unnecessarily
const globalImageCache = new Map();

/**
 * Preload an image URL and resolve to HTMLImageElement
 */
function preloadImage(url) {
  if (!url) return Promise.resolve(null);
  if (globalImageCache.has(url)) {
    const existing = globalImageCache.get(url);
    if (existing.complete) {
      return Promise.resolve(existing);
    }
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
      console.warn(`[CinematicSequence] Failed to load image: ${url}`);
      resolve(img);
    };
    img.src = url;
  });
}

/**
 * Object-fit: cover drawing helper
 */
function drawSingleCover(ctx, img, canvasWidth, canvasHeight, alpha = 1.0) {
  if (!img || !img.complete || !img.naturalWidth || !img.naturalHeight) return;

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  let renderWidth, renderHeight, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    renderWidth = canvasWidth;
    renderHeight = canvasWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvasHeight - renderHeight) / 2;
  } else {
    renderHeight = canvasHeight;
    renderWidth = canvasHeight * imgRatio;
    offsetX = (canvasWidth - renderWidth) / 2;
    offsetY = 0;
  }

  ctx.globalAlpha = alpha;
  ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
}

/**
 * High-performance smooth frame interpolation on HTML5 Canvas
 *
 * Designed specifically for continuous camera progression between AI keyframes:
 * - Base frame stays visually dominant through the majority of its window (no sluggish ghosting).
 * - Subtle, smooth transition bridge centered between keyframes (0.35 -> 0.65).
 * - Always draws a 100% opaque base layer first (eliminating flashes, flickering, or dark seams).
 */
function drawInterpolatedFrames(ctx, activeFrames, virtualProgress, canvasWidth, canvasHeight) {
  const total = activeFrames.length;
  if (total === 0) return;

  const maxIndex = total - 1;
  const clampedVirtual = Math.max(0, Math.min(virtualProgress, maxIndex));
  const baseIndex = Math.floor(clampedVirtual);
  const nextIndex = Math.min(baseIndex + 1, maxIndex);
  const fraction = clampedVirtual - baseIndex; // 0.0 -> 1.0

  const baseImg = globalImageCache.get(activeFrames[baseIndex]);
  const nextImg = globalImageCache.get(activeFrames[nextIndex]);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // If at final frame or same frame, draw base frame crisp and opaque
  if (baseIndex === nextIndex || !nextImg || !nextImg.complete) {
    if (baseImg && baseImg.complete) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawSingleCover(ctx, baseImg, canvasWidth, canvasHeight, 1.0);
      ctx.globalAlpha = 1.0;
    }
    return;
  }

  // Calculate subtle interpolation bridge
  // - fraction in [0.0, 0.35]: baseIndex is 100% crisp, 0% next
  // - fraction in [0.35, 0.65]: subtle transition bridge with smoothstep
  // - fraction in [0.65, 1.0]: nextIndex is 100% crisp, 0% base
  let nextAlpha = 0;
  if (fraction <= 0.35) {
    nextAlpha = 0;
  } else if (fraction >= 0.65) {
    nextAlpha = 1;
  } else {
    const t = (fraction - 0.35) / 0.30;
    nextAlpha = t * t * (3 - 2 * t); // cubic smoothstep curve
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (nextAlpha <= 0) {
    // 100% base frame
    drawSingleCover(ctx, baseImg, canvasWidth, canvasHeight, 1.0);
  } else if (nextAlpha >= 1) {
    // 100% next frame
    drawSingleCover(ctx, nextImg, canvasWidth, canvasHeight, 1.0);
  } else {
    // Base frame visually dominant underneath (100% opaque, no transparent gap)
    drawSingleCover(ctx, baseImg, canvasWidth, canvasHeight, 1.0);
    // Subtle interpolation layer on top
    drawSingleCover(ctx, nextImg, canvasWidth, canvasHeight, nextAlpha);
  }

  ctx.globalAlpha = 1.0;
}

/**
 * CinematicSequence Component
 *
 * High-performance, data-driven cinematic image-sequence engine.
 */
export const CinematicSequence = ({
  images,
  sectionId,
  pinDistance = '+=120%',
  className = '',
  children
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const currentFramesRef = useRef([]);
  const canvasDimsRef = useRef({ width: 0, height: 0 });
  const virtualFrameRef = useRef(0);
  const lastRenderedVirtualRef = useRef(-1);
  const isMobileRef = useRef(false);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !images) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // 1. Determine initial breakpoint (<= 768px mobile)
    const mql = window.matchMedia('(max-width: 768px)');
    isMobileRef.current = mql.matches;
    currentFramesRef.current = isMobileRef.current
      ? (images.mobile || images.desktop || [])
      : (images.desktop || []);

    const frames = currentFramesRef.current;
    if (!frames.length) return;

    // 2. Render helper with throttle on sub-pixel virtual frame delta
    const renderVirtualFrame = (virtualProgress, force = false) => {
      const activeFrames = currentFramesRef.current;
      if (!activeFrames.length) return;

      // Throttle: only redraw if virtual frame changed by at least 0.003
      if (!force && Math.abs(virtualProgress - lastRenderedVirtualRef.current) < 0.003) {
        return;
      }

      lastRenderedVirtualRef.current = virtualProgress;
      const { width, height } = canvasDimsRef.current;
      if (width > 0 && height > 0) {
        drawInterpolatedFrames(ctx, activeFrames, virtualProgress, width, height);
      }
    };

    // 3. Canvas sizing with devicePixelRatio support
    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      canvasDimsRef.current = { width: canvas.width, height: canvas.height };
      renderVirtualFrame(virtualFrameRef.current, true);
    };

    // Initial sizing
    updateCanvasSize();

    // 4. Scoped Image Preloading
    // Frame 0 loads first and paints immediately to eliminate any blank visual flash
    preloadImage(frames[0]).then(() => {
      isLoadedRef.current = true;
      renderVirtualFrame(0, true);

      // Preload remaining frames 1..N in parallel for this section
      for (let i = 1; i < frames.length; i++) {
        preloadImage(frames[i]).then(() => {
          // If user scrolled while loading, ensure canvas reflects loaded frame
          renderVirtualFrame(virtualFrameRef.current, true);
        });
      }
    });

    // 5. Reduced Motion Check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 6. GSAP Context & ScrollTrigger Setup
    const gsapContext = gsap.context(() => {
      if (prefersReducedMotion) {
        // Reduced motion: Do not pin or scrub; show frame 0 statically
        return;
      }

      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: pinDistance,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.6, // Natural inertia without sluggish lag or rubber-banding
        fastScrollEnd: true,
        onUpdate: (self) => {
          const progress = self.progress; // 0.0 -> 1.0
          const total = currentFramesRef.current.length;
          if (total <= 1) return;

          // Continuous fractional progress across keyframe range (e.g. 0.0 -> 4.0 for 5 frames)
          const virtualVal = progress * (total - 1);
          virtualFrameRef.current = virtualVal;
          renderVirtualFrame(virtualVal);
        }
      });
    }, container);

    // 7. Breakpoint Change Listener
    // Reinitializes sequence only when crossing the 768px threshold
    const handleBreakpointChange = (e) => {
      isMobileRef.current = e.matches;
      currentFramesRef.current = e.matches
        ? (images.mobile || images.desktop || [])
        : (images.desktop || []);

      currentFramesRef.current.forEach((url) => preloadImage(url));
      renderVirtualFrame(virtualFrameRef.current, true);
      ScrollTrigger.refresh();
    };
    mql.addEventListener('change', handleBreakpointChange);

    // 8. Debounced Resize Handler
    // Only resizes canvas and refreshes ScrollTrigger; does NOT recreate gsap.context()
    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateCanvasSize();
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // 9. Teardown
    return () => {
      clearTimeout(resizeTimer);
      mql.removeEventListener('change', handleBreakpointChange);
      window.removeEventListener('resize', handleResize);
      gsapContext.revert();
    };
  }, [images, pinDistance, sectionId]);

  return (
    <div
      ref={containerRef}
      id={sectionId}
      className={`cinematic-sequence-wrapper ${className}`.trim()}
      data-sequence-id={sectionId}
    >
      <canvas
        ref={canvasRef}
        className="cinematic-canvas"
        aria-hidden="true"
      />
      {children && (
        <div className="cinematic-overlay-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default CinematicSequence;
