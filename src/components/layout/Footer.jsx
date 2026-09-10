import React from 'react';
import { siteConfig } from '../../data/site';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
