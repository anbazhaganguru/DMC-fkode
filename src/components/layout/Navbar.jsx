import React, { useState, useEffect } from 'react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const journeyEl = document.getElementById('cinematic-journey');
      if (journeyEl) {
        const rect = journeyEl.getBoundingClientRect();
        if (rect.bottom < window.innerHeight / 2) {
          setActiveSection('cta');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo Mark */}
        <a
          href="#home"
          className="navbar-brand-link"
          onClick={() => handleLinkClick('home')}
          aria-label="Daniel Wellness Center - Home"
        >
          <div className="navbar-brand-badge">
            <span className="navbar-brand-badge-letter">D</span>
          </div>
          <div className="navbar-brand-text">
            {/* Desktop Brand Text */}
            <span className="navbar-brand-title navbar-brand-title--desktop">
              DANIEL WELLNESS CENTER
            </span>
            <span className="navbar-brand-subtitle navbar-brand-subtitle--desktop">
              SANCTUARY OF RESTORATION
            </span>

            {/* Mobile Brand Text */}
            <span className="navbar-brand-title navbar-brand-title--mobile">
              DWC
            </span>
            <span className="navbar-brand-subtitle navbar-brand-subtitle--mobile">
              WELLNESS
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav-desktop" aria-label="Main Navigation">
          <a
            href="#home"
            className={`nav-link ${activeSection === 'home' ? 'nav-link--active' : ''}`}
            onClick={() => handleLinkClick('home')}
          >
            <span>HOME</span>
            {activeSection === 'home' && <span className="nav-link__indicator" />}
          </a>
          <a
            href="#about"
            className={`nav-link ${activeSection === 'about' ? 'nav-link--active' : ''}`}
            onClick={() => handleLinkClick('about')}
          >
            <span>ABOUT</span>
            {activeSection === 'about' && <span className="nav-link__indicator" />}
          </a>
          <a
            href="#therapy"
            className={`nav-link ${activeSection === 'therapy' ? 'nav-link--active' : ''}`}
            onClick={() => handleLinkClick('therapy')}
          >
            <span>THERAPY</span>
            {activeSection === 'therapy' && <span className="nav-link__indicator" />}
          </a>
          <a
            href="#recovery-for"
            className={`nav-link ${activeSection === 'recovery-for' ? 'nav-link--active' : ''}`}
            onClick={() => handleLinkClick('recovery-for')}
          >
            <span>RECOVERY FOR</span>
            {activeSection === 'recovery-for' && <span className="nav-link__indicator" />}
          </a>
        </nav>

        {/* Desktop CTA Action */}
        <div className="navbar-action-desktop">
          <a
            href="#cta"
            className="navbar-btn-book"
            onClick={() => handleLinkClick('cta')}
          >
            BOOK AN APPOINTMENT
          </a>
        </div>

        {/* Mobile Quick Action & Menu Toggle */}
        <div className="navbar-action-mobile">
          <a
            href="#cta"
            className="navbar-btn-book-mobile"
            onClick={() => handleLinkClick('cta')}
            aria-label="Book an Appointment"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </a>
          <button
            type="button"
            className={`navbar-menu-toggle ${mobileMenuOpen ? 'navbar-menu-toggle--open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="navbar-menu-bar" />
            <span className="navbar-menu-bar" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          <nav className="navbar-mobile-nav" aria-label="Mobile Navigation">
            <a
              href="#home"
              className={`mobile-nav-link ${activeSection === 'home' ? 'mobile-nav-link--active' : ''}`}
              onClick={() => handleLinkClick('home')}
            >
              HOME
            </a>
            <a
              href="#about"
              className={`mobile-nav-link ${activeSection === 'about' ? 'mobile-nav-link--active' : ''}`}
              onClick={() => handleLinkClick('about')}
            >
              ABOUT
            </a>
            <a
              href="#therapy"
              className={`mobile-nav-link ${activeSection === 'therapy' ? 'mobile-nav-link--active' : ''}`}
              onClick={() => handleLinkClick('therapy')}
            >
              THERAPY
            </a>
            <a
              href="#recovery-for"
              className={`mobile-nav-link ${activeSection === 'recovery-for' ? 'mobile-nav-link--active' : ''}`}
              onClick={() => handleLinkClick('recovery-for')}
            >
              RECOVERY FOR
            </a>
            <a
              href="#cta"
              className={`mobile-nav-link ${activeSection === 'cta' ? 'mobile-nav-link--active' : ''}`}
              onClick={() => handleLinkClick('cta')}
            >
              CONTACT
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

