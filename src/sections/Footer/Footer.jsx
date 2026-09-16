import React from 'react';
import { staticImages } from '../../data/images';
import './Footer.css';

export const Footer = () => {
  return (
    <footer id="footer" className="site-footer" aria-label="Website Footer">
      {/* Atmosphere Background Layer */}
      <div className="footer-bg-wrap" aria-hidden="true">
        <picture>
          <source media="(max-width: 768px)" srcSet={staticImages.footer.mobile} />
          <img
            src={staticImages.footer.desktop}
            alt=""
            className="footer-bg-img"
            loading="lazy"
          />
        </picture>
        <div className="footer-bg-scrim" />
      </div>

      <div className="footer-container">
        {/* Main 4-Column Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand & Philosophy */}
          <div className="footer-col footer-col--brand">
            <a href="#home" className="footer-brand-link" aria-label="Daniel Wellness Center - Home">
              <div className="footer-brand-badge">
                <span className="footer-brand-badge-letter">D</span>
              </div>
              <div className="footer-brand-text">
                <span className="footer-brand-title">DANIEL WELLNESS CENTER</span>
                <span className="footer-brand-subtitle">SANCTUARY OF RESTORATION</span>
              </div>
            </a>
            <p className="footer-brand-desc">
              Holistic wellness experiences designed around relaxation, recovery support, body comfort, and personalized care.
            </p>
            <div className="footer-brand-pill">
              <span className="footer-brand-pill-dot" />
              <span className="footer-brand-pill-text">SANCTUARY OF WELL-BEING</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="footer-col footer-col--nav">
            <h4 className="footer-col-title">NAVIGATION</h4>
            <nav className="footer-nav-list" aria-label="Footer Navigation">
              <a href="#home" className="footer-nav-link">HOME</a>
              <a href="#about" className="footer-nav-link">ABOUT</a>
              <a href="#therapy" className="footer-nav-link">THERAPY</a>
              <a href="#recovery-for" className="footer-nav-link">RECOVERY FOR</a>
              <a href="#cta" className="footer-nav-link footer-nav-link--highlight">CONTACT</a>
              <a href="#cta" className="footer-nav-link footer-nav-link--highlight">BOOK AN APPOINTMENT</a>
            </nav>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="footer-col footer-col--contact">
            <h4 className="footer-col-title">LOCATION & CONTACT</h4>
            <div className="footer-contact-item">
              <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="footer-contact-text">
                <strong>Daniel Wellness Center</strong><br />
                5th Avenue, Banu Nagar,<br />
                Ambattur, Chennai
              </div>
            </div>

            <div className="footer-contact-item">
              <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:7358313291" className="footer-contact-link">
                7358313291
              </a>
            </div>

            <div className="footer-contact-item">
              <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href="mailto:aswinkumar8949@gmail.com" className="footer-contact-link">
                aswinkumar8949@gmail.com
              </a>
            </div>
          </div>

          {/* Column 4: Direct Action & Instagram */}
          <div className="footer-col footer-col--action">
            <h4 className="footer-col-title">CONNECT</h4>
            <a
              href="https://instagram.com/aswin_reflexologist"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Follow Aswin Reflexologist on Instagram"
            >
              <svg className="footer-social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>@aswin_reflexologist</span>
            </a>

            <a href="#cta" className="footer-btn-appointment">
              BOOK AN APPOINTMENT
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle Brand Signoff */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Daniel Wellness Center. All rights reserved.
          </p>
          <p className="footer-signoff">
            A Sanctuary for Natural Healing &amp; Restoration
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
