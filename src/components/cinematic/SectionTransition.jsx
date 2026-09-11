import React, { useEffect, useRef } from 'react';

/**
 * Cubic smoothstep interpolation helper
 */
function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/**
 * SectionTransition Component
 *
 * Config-driven cinematic bridge between two major website sections.
 * Performs dedicated optical / camera transitions:
 * - 'notepad': Physical camera push into paper surface, warm tonal bridge
 * - 'doorway': Corridor depth zoom through treatment doorway into lab
 * - 'light-exposure': Natural exposure shift & soft daylight bloom
 * - 'window-light': Tracking toward lounge windows with ambient daylight wash
 *
 * Uses GPU-accelerated CSS transforms and opacity updates without triggering React re-renders.
 */
export const SectionTransition = ({
  config,
  progress = 0,
  isActive = false,
  isMobile = false
}) => {
  const containerRef = useRef(null);
  const outgoingImgRef = useRef(null);
  const incomingImgRef = useRef(null);
  const overlayVignetteRef = useRef(null);
  const overlayToneRef = useRef(null);
  const chapterLoaderRef = useRef(null);
  const chapterTitleRef = useRef(null);
  const chapterRuleTopRef = useRef(null);
  const chapterRuleBottomRef = useRef(null);
  const chapterAxisTopRef = useRef(null);
  const chapterAxisBottomRef = useRef(null);
  const chapterSubRef = useRef(null);

  const {
    id,
    type,
    fromImage,
    toImage,
    origin = '50% 50%',
    fromScale = [1.0, 1.35],
    toScale = [1.12, 1.0]
  } = config;

  const currentFromSrc = isMobile ? (fromImage.mobile || fromImage.desktop) : fromImage.desktop;
  const currentToSrc = isMobile ? (toImage.mobile || toImage.desktop) : toImage.desktop;

  useEffect(() => {
    const container = containerRef.current;
    const outgoing = outgoingImgRef.current;
    const incoming = incomingImgRef.current;
    const vignette = overlayVignetteRef.current;
    const tone = overlayToneRef.current;
    const chapterLoader = chapterLoaderRef.current;

    if (!container || !outgoing || !incoming) return;

    if (!isActive) {
      container.style.visibility = 'hidden';
      container.style.opacity = '0';
      return;
    }

    container.style.visibility = 'visible';
    container.style.opacity = '1';

    const p = Math.max(0, Math.min(1, progress));

    // Common Scale Calculations
    const outScaleVal = fromScale[0] + (fromScale[1] - fromScale[0]) * p;
    const inScaleVal = toScale[0] + (toScale[1] - toScale[0]) * p;

    // Apply specific transition choreographies
    switch (type) {
      case 'notepad': {
        // Both outgoing notepad and incoming About reveal are rendered directly on the Canvas
        // with exact subpixel cover-fit and seamless scale continuity.
        // Hiding duplicate DOM imgs prevents any DOM-vs-Canvas fit, scale, or subpixel discrepancy.
        outgoing.style.opacity = '0';
        incoming.style.opacity = '0';

        // Peripheral vignette: softens desk edges
        if (vignette) {
          const vigOpacity = Math.sin(p * Math.PI) * 0.70;
          vignette.style.opacity = vigOpacity.toFixed(3);
        }

        // Warm paper luminescence bridge (gentle bell curve, no white flash)
        if (tone) {
          const toneOpacity = Math.sin(p * Math.PI) * 0.35;
          tone.style.opacity = toneOpacity.toFixed(3);
        }

        // Editorial Luxury Chapter Loader Animation (Centered Architectural "01 / ABOUT")
        if (chapterLoader) {
          let loaderOp = 0;
          let translateY = 12;
          let ruleScaleX = 0;
          let axisScaleY = 0;
          let titleOp = 0;
          let titleY = 10;
          let subOp = 0;

          if (p >= 0.00 && p <= 0.35) {
            loaderOp = Math.min(1.0, p / 0.16);
            translateY = 12 * (1 - Math.min(1.0, p / 0.20));
            
            axisScaleY = Math.min(1.0, p / 0.18);
            ruleScaleX = Math.min(1.0, Math.max(0, p / 0.22));
            titleOp = Math.min(1.0, Math.max(0, p / 0.20));
            titleY = 10 * (1 - Math.min(1.0, Math.max(0, p / 0.20)));
            subOp = Math.min(1.0, Math.max(0, (p - 0.04) / 0.22));
          } else if (p > 0.35 && p < 0.55) {
            loaderOp = 1.0;
            translateY = 0;
            axisScaleY = 1.0;
            ruleScaleX = 1.0;
            titleOp = 1.0;
            titleY = 0;
            subOp = 1.0;
          } else if (p >= 0.55 && p <= 0.85) {
            const t = (p - 0.55) / 0.30;
            const fade = 1.0 - smoothstep(0, 0.85, t);
            loaderOp = fade;
            translateY = -12 * smoothstep(0, 1, t);
            axisScaleY = fade;
            ruleScaleX = fade;
            titleOp = fade;
            titleY = -8 * smoothstep(0, 1, t);
            subOp = fade;
          } else {
            loaderOp = 0;
            translateY = 12;
            ruleScaleX = 0;
            axisScaleY = 0;
            titleOp = 0;
            titleY = 10;
            subOp = 0;
          }

          chapterLoader.style.opacity = loaderOp.toFixed(3);
          chapterLoader.style.transform = `translate(-50%, calc(-50% + ${translateY.toFixed(1)}px))`;

          if (chapterTitleRef.current) {
            chapterTitleRef.current.style.opacity = titleOp.toFixed(3);
            chapterTitleRef.current.style.transform = `translateY(${titleY.toFixed(1)}px)`;
          }
          if (chapterRuleTopRef.current) {
            chapterRuleTopRef.current.style.transform = `scaleX(${ruleScaleX.toFixed(3)})`;
          }
          if (chapterRuleBottomRef.current) {
            chapterRuleBottomRef.current.style.transform = `scaleX(${ruleScaleX.toFixed(3)})`;
          }
          if (chapterAxisTopRef.current) {
            chapterAxisTopRef.current.style.transform = `scaleY(${axisScaleY.toFixed(3)})`;
          }
          if (chapterAxisBottomRef.current) {
            chapterAxisBottomRef.current.style.transform = `scaleY(${axisScaleY.toFixed(3)})`;
          }
          if (chapterSubRef.current) {
            chapterSubRef.current.style.opacity = subOp.toFixed(3);
          }
        }
        break;
      }

      case 'doorway': {
        // Outgoing corridor doorway push forward
        const outOpacity = p <= 0.48 ? 1.0 : 1.0 - smoothstep(0.48, 0.85, p);
        outgoing.style.transform = `scale(${outScaleVal.toFixed(4)})`;
        outgoing.style.opacity = outOpacity.toFixed(3);
        outgoing.style.transformOrigin = origin;

        // Incoming therapy entry emerges from doorway portal
        const inOpacity = smoothstep(0.38, 0.82, p);
        incoming.style.transform = `scale(${inScaleVal.toFixed(4)})`;
        incoming.style.opacity = inOpacity.toFixed(3);
        incoming.style.transformOrigin = origin;

        // Doorway aperture vignette: darkens surrounding corridor walls
        if (vignette) {
          const vigOpacity = smoothstep(0.1, 0.55, p) * (p > 0.75 ? 1.0 - smoothstep(0.75, 0.95, p) : 1.0);
          vignette.style.opacity = (vigOpacity * 0.85).toFixed(3);
        }

        // Threshold depth atmospheric softening
        if (tone) {
          const toneOpacity = Math.sin(p * Math.PI) * 0.25;
          tone.style.opacity = toneOpacity.toFixed(3);
        }
        break;
      }

      case 'light-exposure': {
        // Natural exposure shift from clinical to recovery
        const outOpacity = p <= 0.45 ? 1.0 : 1.0 - smoothstep(0.45, 0.80, p);
        outgoing.style.transform = `scale(${outScaleVal.toFixed(4)})`;
        outgoing.style.opacity = outOpacity.toFixed(3);
        outgoing.style.transformOrigin = origin;

        // Controlled subtle brightness exposure
        const exposureGain = 1.0 + Math.sin(p * Math.PI) * 0.22;
        outgoing.style.filter = `brightness(${exposureGain.toFixed(3)})`;

        // Incoming recovery emerges through the daylight wash
        const inOpacity = smoothstep(0.32, 0.78, p);
        incoming.style.transform = `scale(${inScaleVal.toFixed(4)})`;
        incoming.style.opacity = inOpacity.toFixed(3);
        incoming.style.transformOrigin = origin;

        // Natural warm daylight bloom overlay
        if (tone) {
          const bloomOpacity = Math.sin(p * Math.PI) * 0.36;
          tone.style.opacity = bloomOpacity.toFixed(3);
        }
        break;
      }

      case 'window-light': {
        // Camera moves toward bright lounge windows
        const outOpacity = p <= 0.50 ? 1.0 : 1.0 - smoothstep(0.50, 0.86, p);
        outgoing.style.transform = `scale(${outScaleVal.toFixed(4)})`;
        outgoing.style.opacity = outOpacity.toFixed(3);
        outgoing.style.transformOrigin = origin;

        // Soft natural brightness wash
        const washBrightness = 1.0 + Math.sin(p * Math.PI) * 0.24;
        outgoing.style.filter = `brightness(${washBrightness.toFixed(3)})`;

        // CTA sanctuary destination emerges seamlessly
        const inOpacity = smoothstep(0.35, 0.82, p);
        incoming.style.transform = `scale(${inScaleVal.toFixed(4)})`;
        incoming.style.opacity = inOpacity.toFixed(3);
        incoming.style.transformOrigin = origin;

        // Window sunlight diffusion wash
        if (tone) {
          const washOpacity = Math.sin(p * Math.PI) * 0.38;
          tone.style.opacity = washOpacity.toFixed(3);
        }
        break;
      }

      default:
        break;
    }
  }, [progress, isActive, type, fromScale, toScale, origin]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`section-transition-layer section-transition--${type}`}
      aria-hidden={!isActive}
      data-transition-type={type}
    >
      {/* Outgoing Base Image */}
      <img
        ref={outgoingImgRef}
        src={currentFromSrc}
        alt=""
        className="section-transition__img section-transition__img--outgoing"
        loading="eager"
        decoding="async"
      />

      {/* Incoming Target Image */}
      <img
        ref={incomingImgRef}
        src={currentToSrc}
        alt=""
        className="section-transition__img section-transition__img--incoming"
        loading="eager"
        decoding="async"
      />

      {/* Dynamic Overlay Vignettes & Lighting Bridges */}
      <div
        ref={overlayVignetteRef}
        className={`section-transition__overlay section-transition__overlay--vignette section-transition__vignette--${type}`}
      />
      <div
        ref={overlayToneRef}
        className={`section-transition__overlay section-transition__overlay--tone section-transition__tone--${type}`}
      />

      {/* Luxury Editorial Chapter Title Card (Home -> About Transition) */}
      {type === 'notepad' && (
        <div
          ref={chapterLoaderRef}
          className="section-transition__chapter-loader"
          aria-hidden="true"
        >
          <div className="chapter-loader__content">
            <span className="chapter-loader__number">01</span>
            <div className="chapter-loader__axis-top" ref={chapterAxisTopRef} />
            <div className="chapter-loader__rule chapter-loader__rule--top" ref={chapterRuleTopRef} />
            
            <h2 className="chapter-loader__title" ref={chapterTitleRef}>
              ABOUT
            </h2>

            <div className="chapter-loader__rule chapter-loader__rule--bottom" ref={chapterRuleBottomRef} />
            <div className="chapter-loader__axis-bottom" ref={chapterAxisBottomRef} />
            
            <span className="chapter-loader__subtitle" ref={chapterSubRef}>
              A PERSONALIZED WELLNESS JOURNEY
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionTransition;
