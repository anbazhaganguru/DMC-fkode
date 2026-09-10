import React from 'react';
import { staticImages } from '../../data/images';
import Button from '../../components/common/Button';

export const CTA = () => {
  return (
    <section id="cta" className="static-section">
      <picture>
        <source media="(max-width: 768px)" srcSet={staticImages.cta.mobile} />
        <img
          src={staticImages.cta.desktop}
          alt="DWC Wellness Lounge"
          className="static-section__bg"
          loading="lazy"
        />
      </picture>
      <div className="static-section__content">
        <h2>Begin Your Recovery Journey</h2>
        <p>Experience personalized care and state-of-the-art therapeutic recovery.</p>
        <Button variant="primary">Book a Consultation</Button>
      </div>
    </section>
  );
};

export default CTA;
