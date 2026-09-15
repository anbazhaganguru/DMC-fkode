import React from 'react';

export const Home = () => {
  return (
    <div id="home" className="hero-section">
      {/* Cinematic Atmosphere Protection Layers */}
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-atmosphere__desktop-left" />
        <div className="hero-atmosphere__desktop-top" />
        <div className="hero-atmosphere__mobile-top" />
        <div className="hero-atmosphere__mobile-bottom" />
      </div>

      {/* Main Hero Content Area - Three Independent Layout Blocks */}
      <div className="hero-container">
        {/* Zone 2: Main Hero Content Group (Eyebrow, Headline, Description, CTAs) */}
        <div className="hero-main-group">
          {/* BLOCK 01: Eyebrow Tag Group */}
          <div className="hero-block hero-block--eyebrow">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow__dot" />
              <span className="hero-eyebrow__text hero-eyebrow__text--desktop">DANIEL WELLNESS CENTER</span>
              <span className="hero-eyebrow__text hero-eyebrow__text--mobile">01 / WELLNESS</span>
            </div>
          </div>

          {/* BLOCK 02: Main Hero Headline Group */}
          <div className="hero-block hero-block--headline">
            <h1 className="hero-headline">
              <span className="hero-headline__line hero-headline__line--roman">
                Take Time for<br className="hero-br-mobile" /> Your Body.
              </span>
              <span className="hero-headline__line hero-headline__line--italic">
                Take Time for<br className="hero-br-mobile" /> Your Well-being.
              </span>
            </h1>
          </div>

          {/* BLOCK 03: Supporting Description & Action CTAs */}
          <div className="hero-block hero-block--details">
            {/* Supporting Paragraph */}
            <p className="hero-paragraph">
              Wellness experiences designed around relaxation, recovery support, body comfort, and overall well-being.
            </p>

            {/* Secondary Supporting Quote with Sage Border (Desktop Only) */}
            <div className="hero-quote">
              <p className="hero-quote__text">
                Every individual has different needs, which is why we encourage a personalized approach when choosing a wellness experience.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="hero-ctas">
              <a href="#cta" className="hero-btn-primary">
                <span className="hero-btn-primary__label">BOOK AN APPOINTMENT</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hero-btn-icon"
                  aria-hidden="true"
                >
                  <path
                    d="M9 3L14 8M14 8L9 13M14 8H2"
                    stroke="currentColor"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a href="#therapy" className="hero-btn-secondary">
                <span className="hero-btn-secondary__label">EXPLORE WELLNESS SERVICES</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hero-btn-secondary__arrow"
                  aria-hidden="true"
                >
                  <path
                    d="M9 3L14 8M14 8L9 13M14 8H2"
                    stroke="currentColor"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Zone 3: Editorial Wellness Values Micro-Footer Strip */}
        <div className="hero-micro-footer">
          <div className="hero-micro-item">
            <span className="hero-micro-dot hero-micro-dot--sage hero-micro-dot--desktop" />
            <span className="hero-micro-label">CLINICAL PRECISION</span>
          </div>
          <span className="hero-micro-separator" aria-hidden="true">•</span>
          <div className="hero-micro-item">
            <span className="hero-micro-dot hero-micro-dot--blue hero-micro-dot--desktop" />
            <span className="hero-micro-label">TAILORED RECOVERY</span>
          </div>
          <span className="hero-micro-separator" aria-hidden="true">•</span>
          <div className="hero-micro-item">
            <span className="hero-micro-dot hero-micro-dot--blush hero-micro-dot--desktop" />
            <span className="hero-micro-label">QUIET SANCTUARY</span>
          </div>
        </div>
      </div>

      {/* Bottom Anchor Bar (Desktop & Mobile) */}
      <div className="hero-bottom-bar">
        {/* Desktop Left Indicator */}
        <div className="hero-bottom-bar__left hero-bottom-bar__left--desktop">
          <span className="hero-bottom-bar__divider" />
          <span className="hero-bottom-bar__label">SANCTUARY ENVIRONMENT 01</span>
        </div>

        {/* Mobile Left Indicator */}
        <div className="hero-bottom-bar__left hero-bottom-bar__left--mobile">
          <span className="hero-bottom-bar__dot" />
          <span className="hero-bottom-bar__label">SANCTUARY 01</span>
        </div>

        {/* Desktop Right Scroll Indicator */}
        <div className="hero-bottom-bar__right hero-bottom-bar__right--desktop">
          <span className="hero-bottom-bar__scroll-text">SCROLL TO EXPLORE</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hero-bottom-bar__arrow"
            aria-hidden="true"
          >
            <path
              d="M11.0833 8.16667L6.99996 12.25M6.99996 12.25L2.91663 8.16667M6.99996 12.25V1.75"
              stroke="#1E2522"
              strokeOpacity="0.6"
              strokeWidth="1.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Mobile Right Scroll Indicator */}
        <div className="hero-bottom-bar__right hero-bottom-bar__right--mobile">
          <span className="hero-bottom-bar__scroll-text">SCROLL</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hero-bottom-bar__arrow"
            aria-hidden="true"
          >
            <path
              d="M9.5 7L6 10.5M6 10.5L2.5 7M6 10.5V1.5"
              stroke="#1E2522"
              strokeOpacity="0.6"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Home;

