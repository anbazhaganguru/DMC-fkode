import React, { useState } from 'react';
import { staticImages } from '../../data/images';
import './CTA.css';

/**
 * Approved DWC Wellness Focus Options
 * Corresponding to the core DWC wellness pillars
 */
const WELLNESS_FOCUS_OPTIONS = [
  { id: 'relaxation', label: '01 RELAXATION', title: 'Relaxation' },
  { id: 'recovery', label: '02 RECOVERY SUPPORT', title: 'Recovery Support' },
  { id: 'comfort', label: '03 BODY COMFORT', title: 'Body Comfort' },
  { id: 'wellbeing', label: '04 OVERALL WELL-BEING', title: 'Overall Well-being' }
];

export const CTA = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [selectedFocus, setSelectedFocus] = useState('Relaxation');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocusClick = (title) => {
    setSelectedFocus(title);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      return;
    }
    // Controlled React submission: prevent page reload, no alerts, display graceful inline confirmation
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      message: ''
    });
    setSelectedFocus('Relaxation');
    setIsSubmitted(false);
  };

  return (
    <section id="cta" className="dwc-contact-section" aria-label="Contact & Appointments">
      {/* 1. Full-Screen Background Image with Responsive Mobile/Desktop Assets */}
      <div className="dwc-contact-bg-wrap" aria-hidden="true">
        <picture className="dwc-contact-picture">
          <source media="(max-width: 768px)" srcSet={staticImages.cta.mobile} />
          <img
            src={staticImages.cta.desktop}
            alt="Daniel Wellness Center Serene Atmosphere"
            className="dwc-contact-bg-img"
            loading="lazy"
          />
        </picture>
      </div>

      {/* 2. Soft Scandinavian Scrim Overlay for Readability & Contrast */}
      <div className="dwc-contact-scrim" aria-hidden="true" />

      {/* 3. Subtle Deterministic Ambient Lighting Drift (No Math.random, No Particles) */}
      <div className="dwc-contact-ambient-glow" aria-hidden="true" />

      {/* 4. Foreground Content Container (Two-Column Desktop, Single-Column Mobile) */}
      <div className="dwc-contact-container">
        {/* Left Column: Editorial Brand Content & Official DWC Contact Coordinates */}
        <div className="dwc-contact-editorial-col">
          {/* Eyebrow */}
          <div className="dwc-contact-eyebrow">
            <span className="dwc-eyebrow-dot" aria-hidden="true" />
            <span className="dwc-eyebrow-text">DANIEL WELLNESS CENTER / CONTACT</span>
          </div>

          {/* Headline */}
          <h2 className="dwc-contact-headline">
            Begin Your <br className="dwc-desktop-br" />Recovery Journey
          </h2>

          {/* Philosophy Quote */}
          <p className="dwc-contact-philosophy">
            “Every individual has different needs, which is why we encourage a personalized approach when choosing a wellness experience.”
          </p>

          {/* Supporting Description */}
          <p className="dwc-contact-description">
            At Daniel Wellness Center, our services are designed around relaxation, recovery support, body comfort, and overall well-being.
          </p>

          {/* Official DWC Contact Information Panel */}
          <div className="dwc-contact-info-panel">
            {/* Location */}
            <div className="dwc-info-item">
              <div className="dwc-info-icon-wrap" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="dwc-info-body">
                <span className="dwc-info-label">LOCATION</span>
                <address className="dwc-info-value dwc-info-address">
                  Daniel Wellness Center<br />
                  5th Avenue, Banu Nagar, Ambattur, Chennai
                </address>
              </div>
            </div>

            {/* Phone & Email (Split Row) */}
            <div className="dwc-info-row-split">
              {/* Phone */}
              <div className="dwc-info-item">
                <div className="dwc-info-icon-wrap" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="dwc-info-body">
                  <span className="dwc-info-label">PHONE</span>
                  <a href="tel:7358313291" className="dwc-info-link">
                    7358313291
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="dwc-info-item">
                <div className="dwc-info-icon-wrap" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="dwc-info-body">
                  <span className="dwc-info-label">EMAIL</span>
                  <a href="mailto:aswinkumar8949@gmail.com" className="dwc-info-link">
                    aswinkumar8949@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Instagram */}
            <div className="dwc-info-item dwc-info-item--social">
              <div className="dwc-info-icon-wrap" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>
              <div className="dwc-info-body">
                <span className="dwc-info-label">INSTAGRAM</span>
                <a
                  href="https://instagram.com/aswin_reflexologist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dwc-info-link"
                >
                  @aswin_reflexologist
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Elevated Contact & Appointment Form Panel */}
        <div className="dwc-contact-form-col">
          <div className="dwc-contact-card">
            <div className="dwc-card-header">
              <h3 className="dwc-card-title">Schedule a Consultation</h3>
              <p className="dwc-card-subtitle">
                Share your details and select your preferred focus to arrange your visit.
              </p>
            </div>

            {isSubmitted ? (
              <div className="dwc-form-success" role="status">
                <div className="dwc-success-badge" aria-hidden="true">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="dwc-success-title">Enquiry Received</h4>
                <p className="dwc-success-desc">
                  Thank you, <strong>{formData.fullName}</strong>. Your appointment request for{' '}
                  <strong>{selectedFocus}</strong> has been registered. Our wellness concierge will contact you at{' '}
                  <strong>{formData.email}</strong> shortly.
                </p>
                <button type="button" onClick={handleReset} className="dwc-success-reset-btn">
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="dwc-contact-form" noValidate={false}>
                {/* Full Name */}
                <div className="dwc-form-group">
                  <label htmlFor="dwc-fullName" className="dwc-field-label">
                    FULL NAME <span className="dwc-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="dwc-fullName"
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Eleanor Vance"
                    className="dwc-field-input"
                    autoComplete="name"
                  />
                </div>

                {/* Email & Phone */}
                <div className="dwc-form-row">
                  <div className="dwc-form-group">
                    <label htmlFor="dwc-email" className="dwc-field-label">
                      EMAIL ADDRESS <span className="dwc-required" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="dwc-email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="dwc-field-input"
                      autoComplete="email"
                    />
                  </div>

                  <div className="dwc-form-group">
                    <label htmlFor="dwc-phone" className="dwc-field-label">
                      PHONE NUMBER <span className="dwc-optional">(OPTIONAL)</span>
                    </label>
                    <input
                      id="dwc-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="dwc-field-input"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Wellness Focus (Interactive Chips) */}
                <div className="dwc-form-group">
                  <label className="dwc-field-label">
                    SELECT WELLNESS FOCUS
                  </label>
                  <div className="dwc-focus-chips" role="radiogroup" aria-label="Wellness Focus">
                    {WELLNESS_FOCUS_OPTIONS.map((item) => {
                      const isSelected = selectedFocus === item.title;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleFocusClick(item.title)}
                          className={`dwc-chip ${isSelected ? 'dwc-chip--active' : ''}`}
                        >
                          <span className="dwc-chip-dot" aria-hidden="true" />
                          <span className="dwc-chip-text">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message / Special Requirements */}
                <div className="dwc-form-group">
                  <label htmlFor="dwc-message" className="dwc-field-label">
                    MESSAGE / SPECIAL REQUIREMENTS <span className="dwc-optional">(OPTIONAL)</span>
                  </label>
                  <textarea
                    id="dwc-message"
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your wellness goals or session preferences..."
                    className="dwc-field-textarea"
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" className="dwc-submit-btn">
                  <span>SEND ENQUIRY</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="dwc-btn-arrow"
                  >
                    <path
                      d="M9 3L14 8M14 8L9 13M14 8H2"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
