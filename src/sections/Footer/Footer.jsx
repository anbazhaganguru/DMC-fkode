import React from 'react';
import { staticImages } from '../../data/images';
import { siteConfig } from '../../data/site';
import { navigationLinks } from '../../data/navigation';

export const Footer = () => {
  return (
    <footer id="footer" className="site-footer">
      <picture>
        <source media="(max-width: 768px)" srcSet={staticImages.footer.mobile} />
        <img
          src={staticImages.footer.desktop}
          alt="DWC Wellness Background"
          className="footer-bg"
          loading="lazy"
        />
      </picture>
      <div className="footer-container">
        <h3>{siteConfig.name}</h3>
        <p>{siteConfig.tagline}</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', margin: '1.5rem 0' }}>
          {navigationLinks.map((link) => (
            <a key={link.id} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </div>
        <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
