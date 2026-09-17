import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import './KineticMobileMenu.css';

// Register GSAP CustomEase
gsap.registerPlugin(CustomEase);

// Create Sterling Gate signature kinetic ease if not already registered
let gateEase = 'power3.out';
try {
  CustomEase.create('gateEase', '0.76, 0, 0.24, 1');
  gateEase = 'gateEase';
} catch {
  gateEase = 'power3.out';
}

const MENU_ITEMS = [
  { number: '01', label: 'HOME', href: '#home', id: 'home' },
  { number: '02', label: 'ABOUT', href: '#about', id: 'about' },
  { number: '03', label: 'THERAPY', href: '#therapy', id: 'therapy' },
  { number: '04', label: 'RECOVERY FOR', href: '#recovery', id: 'recovery' },
  { number: '05', label: 'BOOK AN APPOINTMENT', href: '#cta', id: 'cta' }
];

/**
 * KineticMenuToggle Component
 * Replaces the default mobile hamburger toggle with the Sterling Gate kinetic
 * "MENU" / "CLOSE" vertical text shift and rotating cross icon.
 */
export const KineticMenuToggle = ({ isOpen, onToggle }) => {
  return (
    <button
      type="button"
      className={`kinetic-menu-toggle ${isOpen ? 'kinetic-menu-toggle--open' : ''}`}
      onClick={onToggle}
      aria-label={isOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
      aria-expanded={isOpen}
    >
      <div className="kinetic-toggle-text-wrap" aria-hidden="true">
        <span className="kinetic-toggle-label kinetic-toggle-label--menu">MENU</span>
        <span className="kinetic-toggle-label kinetic-toggle-label--close">CLOSE</span>
      </div>
      <div className="kinetic-toggle-icon" aria-hidden="true">
        <span className="kinetic-toggle-bar" />
        <span className="kinetic-toggle-bar" />
      </div>
    </button>
  );
};

/**
 * KineticMobileMenu Component
 * Full-screen kinetic reveal navigation for mobile & tablet (<= 1024px)
 * Featuring layered backdrop curtains, ambient pastel shapes, and kinetic staggered typography.
 */
export const KineticMobileMenu = ({
  isOpen,
  onClose,
  activeSection = 'home',
  onNavigate
}) => {
  const overlayRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const linksRef = useRef([]);
  const shapesRef = useRef([]);
  const footerRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const ambientTweensRef = useRef([]);

  // Close Menu Sequence with Sterling Gate Easing
  const handleClose = useCallback((callback) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // Kill ambient floating tweens
    ambientTweensRef.current.forEach((t) => t && t.kill && t.kill());
    ambientTweensRef.current = [];

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        if (overlayRef.current) {
          overlayRef.current.classList.remove('kinetic-overlay--visible');
        }
        isAnimatingRef.current = false;
        if (onClose) onClose();
        if (typeof callback === 'function') callback();
      }
    });

    // 1. Links slide out
    const validLinks = linksRef.current.filter(Boolean);
    if (validLinks.length) {
      tl.to(validLinks, {
        yPercent: -35,
        opacity: 0,
        duration: 0.22,
        stagger: 0.02,
        ease: 'power2.in'
      });
    }

    // 2. Footer metadata fades out
    if (footerRef.current) {
      tl.to(footerRef.current, {
        opacity: 0,
        duration: 0.18,
        ease: 'power2.in'
      }, '<');
    }

    // 3. Layered backdrop panels slide up out of viewport
    if (layer2Ref.current) {
      tl.to(layer2Ref.current, {
        yPercent: -100,
        duration: 0.42,
        ease: gateEase
      }, '-=0.08');
    }

    if (layer1Ref.current) {
      tl.to(layer1Ref.current, {
        yPercent: -100,
        duration: 0.42,
        ease: gateEase
      }, '-=0.36');
    }
  }, [onClose]);

  // Entrance Sequence
  useEffect(() => {
    if (!isOpen) return;

    const overlay = overlayRef.current;
    const layer1 = layer1Ref.current;
    const layer2 = layer2Ref.current;
    const links = linksRef.current.filter(Boolean);
    const footer = footerRef.current;
    const shapes = shapesRef.current.filter(Boolean);

    if (!overlay || !layer1 || !layer2) return;

    // Prevent background scrolling while menu is open
    document.body.style.overflow = 'hidden';
    overlay.classList.add('kinetic-overlay--visible');

    // Reset positions
    gsap.set([layer1, layer2], { yPercent: -100 });
    gsap.set(links, { yPercent: 120, opacity: 0 });
    if (footer) gsap.set(footer, { opacity: 0, y: 15 });

    // Entrance Timeline
    const tl = gsap.timeline();

    // Layer 1: Accent curtain slides in
    tl.to(layer1, {
      yPercent: 0,
      duration: 0.62,
      ease: gateEase
    })
    // Layer 2: Main Warm Cream panel slides in
    .to(layer2, {
      yPercent: 0,
      duration: 0.70,
      ease: gateEase
    }, '-=0.52')
    // Staggered links reveal through clipping mask
    .to(links, {
      yPercent: 0,
      opacity: 1,
      duration: 0.52,
      stagger: 0.055,
      ease: gateEase
    }, '-=0.38')
    // Footer coordinates reveal
    .to(footer, {
      opacity: 0.85,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.25');

    // Start gentle idle ambient drift on shapes
    ambientTweensRef.current = shapes.map((shape, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      return gsap.to(shape, {
        x: dir * (15 + i * 5),
        y: -dir * (12 + i * 4),
        rotation: dir * (10 + i * 3),
        duration: 6 + i * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3
      });
    });

    return () => {
      tl.kill();
      ambientTweensRef.current.forEach((t) => t && t.kill && t.kill());
      ambientTweensRef.current = [];
    };
  }, [isOpen]);

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Ambient Shape Hover Reaction
  const handleItemHover = (index) => {
    shapesRef.current.forEach((shape, i) => {
      if (!shape) return;
      if (i === index) {
        gsap.to(shape, {
          scale: 1.4,
          opacity: 0.48,
          rotation: '+=20',
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        gsap.to(shape, {
          scale: 0.9,
          opacity: 0.12,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  };

  const handleItemLeave = () => {
    shapesRef.current.forEach((shape) => {
      if (!shape) return;
      gsap.to(shape, {
        scale: 1.0,
        opacity: 0.20,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  };

  // Link Click: Animate menu close, then smoothly navigate to target section
  const handleLinkClick = (e, item) => {
    e.preventDefault();

    // Trigger brief reactive pulse on the corresponding shape
    handleItemHover(MENU_ITEMS.findIndex((m) => m.id === item.id));

    handleClose(() => {
      if (onNavigate) {
        onNavigate(item.id);
      }

      // Smooth scroll execution using existing DWC CinematicJourney scroll mechanism
      if (item.id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (item.id === 'cta') {
        // Reuses the exact CTA calculation: scrolls past the pinned timeline directly to CTA
        const ctaEl = document.getElementById('cta');
        if (ctaEl) {
          const ctaTop = ctaEl.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: ctaTop, behavior: 'smooth' });
        }
      } else {
        // Dispatch click via anchor to let CinematicJourney phase calculator handle target position
        const tempAnchor = document.createElement('a');
        tempAnchor.setAttribute('href', item.href);
        tempAnchor.style.position = 'fixed';
        tempAnchor.style.top = '-9999px';
        document.body.appendChild(tempAnchor);
        tempAnchor.click();
        document.body.removeChild(tempAnchor);
      }
    });
  };

  return (
    <div
      ref={overlayRef}
      className={`kinetic-overlay ${isOpen ? 'kinetic-overlay--visible' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* 1. Backdrop Layer 1: Tinted Accent Curtain */}
      <div ref={layer1Ref} className="kinetic-layer-accent" aria-hidden="true" />

      {/* 2. Backdrop Layer 2: Primary Warm Cream Sanctuary Panel */}
      <div ref={layer2Ref} className="kinetic-layer-primary">
        {/* Background Ambient Shapes */}
        <div className="kinetic-ambient-shapes" aria-hidden="true">
          {MENU_ITEMS.map((_, i) => (
            <div
              key={i}
              ref={(el) => { shapesRef.current[i] = el; }}
              className={`kinetic-ambient-shape kinetic-ambient-shape--${i}`}
            />
          ))}
        </div>

        {/* Content Wrapper */}
        <div className="kinetic-content-wrap">
          {/* Header Bar inside Overlay */}
          <div className="kinetic-header">
            <a
              href="#home"
              className="kinetic-brand"
              onClick={(e) => handleLinkClick(e, MENU_ITEMS[0])}
              aria-label="Daniel Wellness Center"
            >
              <div className="kinetic-brand-badge">
                <span className="kinetic-brand-badge-letter">D</span>
              </div>
              <div className="kinetic-brand-text">
                <span className="kinetic-brand-title">DWC</span>
                <span className="kinetic-brand-subtitle">SANCTUARY</span>
              </div>
            </a>

            <KineticMenuToggle
              isOpen={true}
              onToggle={() => handleClose()}
            />
          </div>

          {/* Navigation Links (Staggered Entrance) */}
          <nav className="kinetic-nav-container" aria-label="Mobile Menu Links">
            <ul className="kinetic-nav-list">
              {MENU_ITEMS.map((item, idx) => {
                const isActive =
                  activeSection === item.id ||
                  (item.id === 'recovery' && activeSection === 'recovery-for');

                return (
                  <li key={item.id} className="kinetic-nav-mask">
                    <a
                      ref={(el) => { linksRef.current[idx] = el; }}
                      href={item.href}
                      className={`kinetic-nav-link ${isActive ? 'kinetic-nav-link--active' : ''}`}
                      onMouseEnter={() => handleItemHover(idx)}
                      onMouseLeave={handleItemLeave}
                      onFocus={() => handleItemHover(idx)}
                      onBlur={handleItemLeave}
                      onClick={(e) => handleLinkClick(e, item)}
                    >
                      <span className="kinetic-link-num">{item.number}</span>
                      <span className="kinetic-link-label">
                        {item.label}
                        {isActive && <span className="kinetic-link-indicator" aria-hidden="true" />}
                      </span>
                      <svg
                        className="kinetic-link-arrow"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Metadata & Coordinates */}
          <div ref={footerRef} className="kinetic-footer">
            <div className="kinetic-footer-item">
              <span className="kinetic-footer-label">SANCTUARY</span>
              <span className="kinetic-footer-value">Banu Nagar, Ambattur, Chennai</span>
            </div>
            <div className="kinetic-footer-item">
              <span className="kinetic-footer-label">DIRECT CONTACT</span>
              <a href="tel:7358313291" className="kinetic-footer-value kinetic-footer-value--link">
                7358313291
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KineticMobileMenu;
