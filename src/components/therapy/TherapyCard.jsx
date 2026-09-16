import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Footprints,
  Activity,
  Snowflake,
  Flame,
  CircleDot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkle
} from 'lucide-react';
import './TherapyCard.css';

// Icon Map Helper
const iconMap = {
  Footprints,
  Activity,
  Snowflake,
  Flame,
  CircleDot,
  Sparkles
};

export const TherapyCard = ({ data, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'benefits' | 'expect' | 'faqs'
  const cardRef = useRef(null);

  // Motion values for exact 3D tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Spring physics for butter-smooth tilt response
  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);
  const sheenX = useSpring(rawMouseX, springConfig);
  const sheenY = useSpring(rawMouseY, springConfig);

  const IconComponent = iconMap[data.iconName] || Sparkles;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const xVal = (e.clientX - rect.left) / width - 0.5;
    const yVal = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(xVal);
    mouseY.set(yVal);
    rawMouseX.set(e.clientX - rect.left);
    rawMouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    rawMouseX.set(0);
    rawMouseY.set(0);
  };

  const handleTouchToggle = (e) => {
    // Mobile tap support to toggle detail view
    e.stopPropagation();
    setIsHovered((prev) => !prev);
  };

  return (
    <div className="therapy-3d-perspective-wrapper">
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTouchToggle}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        className={`therapy-3d-card therapy-3d-card--theme-${index + 1} ${isHovered ? 'therapy-3d-card--hovered' : ''}`}
      >
        {/* Layer 0: Image Background with Scale & Depth */}
        <div className="therapy-3d-card__bg-layer" style={{ transform: 'translateZ(0px)' }}>
          <img
            src={data.image}
            alt={data.title}
            className="therapy-3d-card__image"
            loading="lazy"
          />
          <div className="therapy-3d-card__dark-overlay" />
          <div className="therapy-3d-card__gradient-vignette" />
          <div className="therapy-3d-card__pattern-overlay" />
        </div>

        {/* Dynamic Light Sheen Following Cursor */}
        <motion.div
          className="therapy-3d-card__sheen"
          style={{
            transform: 'translateZ(15px)',
            background: isHovered
              ? `radial-gradient(360px circle at ${sheenX.get()}px ${sheenY.get()}px, rgba(255, 255, 255, 0.18), transparent 70%)`
              : 'none'
          }}
        />

        {/* Rotating Decorative Accent Ring */}
        <div className="therapy-3d-card__decorative-ring" style={{ transform: 'translateZ(20px)' }}>
          <div className="therapy-3d-card__ring-inner" />
        </div>

        {/* Layer 1: Header (Category Badge & Icon) */}
        <div className="therapy-3d-card__header" style={{ transform: 'translateZ(40px)' }}>
          <div className="therapy-3d-card__category-badge">
            <span className="therapy-3d-card__number">{data.number}</span>
            <span className="therapy-3d-card__category-text">{data.category}</span>
          </div>

          <div className="therapy-3d-card__icon-wrapper">
            <IconComponent className="therapy-3d-card__icon" />
          </div>
        </div>

        {/* Layer 2: Main Content Container (Title & Summary / Detail Reveal) */}
        <div className="therapy-3d-card__body" style={{ transform: 'translateZ(45px)' }}>
          <h3 className="therapy-3d-card__title">{data.title}</h3>

          <AnimatePresence mode="wait">
            {!isHovered ? (
              /* Before Hover State: Summary Tagline */
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="therapy-3d-card__summary-state"
              >
                <p className="therapy-3d-card__tagline">"{data.tagline}"</p>
                <div className="therapy-3d-card__explore-btn">
                  <span>Explore Treatment</span>
                  <ArrowRight className="therapy-3d-card__explore-arrow" />
                </div>
              </motion.div>
            ) : (
              /* Hover State: Full PDF Detail View Inside Fixed Dimensions */
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="therapy-3d-card__details-state"
                onClick={(e) => e.stopPropagation()} // Allow clicking tabs without closing
              >
                {/* Navigation Pills for Detail Tabs */}
                <div className="therapy-3d-card__tabs">
                  <button
                    className={`therapy-3d-card__tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTab('overview'); }}
                  >
                    About
                  </button>
                  <button
                    className={`therapy-3d-card__tab ${activeTab === 'benefits' ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTab('benefits'); }}
                  >
                    Benefits
                  </button>
                  <button
                    className={`therapy-3d-card__tab ${activeTab === 'expect' ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTab('expect'); }}
                  >
                    Session
                  </button>
                  <button
                    className={`therapy-3d-card__tab ${activeTab === 'faqs' ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTab('faqs'); }}
                  >
                    FAQs
                  </button>
                </div>

                {/* Tab Content Container (Fixed Height Scrollable Inner Area) */}
                <div className="therapy-3d-card__tab-content custom-scrollbar">
                  {activeTab === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="therapy-3d-card__pane"
                    >
                      <h4 className="therapy-3d-card__section-label">What Is This Therapy?</h4>
                      <p className="therapy-3d-card__paragraph">{data.whatIsThis}</p>

                      <h4 className="therapy-3d-card__section-label">Who May Choose This?</h4>
                      <p className="therapy-3d-card__paragraph">{data.whoMayChoose}</p>
                    </motion.div>
                  )}

                  {activeTab === 'benefits' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="therapy-3d-card__pane"
                    >
                      <h4 className="therapy-3d-card__section-label">Key Wellness Benefits</h4>
                      <ul className="therapy-3d-card__list">
                        {data.benefits.map((b, i) => (
                          <li key={i} className="therapy-3d-card__list-item">
                            <CheckCircle2 className="therapy-3d-card__check-icon" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === 'expect' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="therapy-3d-card__pane"
                    >
                      <h4 className="therapy-3d-card__section-label">What to Expect</h4>
                      <p className="therapy-3d-card__paragraph">{data.whatToExpect}</p>

                      <h4 className="therapy-3d-card__section-label">Why Choose DWC</h4>
                      <ul className="therapy-3d-card__list">
                        {data.whyChoose.map((w, i) => (
                          <li key={i} className="therapy-3d-card__list-item">
                            <Sparkle className="therapy-3d-card__sparkle-icon" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === 'faqs' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="therapy-3d-card__pane"
                    >
                      <h4 className="therapy-3d-card__section-label">Frequently Asked Questions</h4>
                      <div className="therapy-3d-card__faq-list">
                        {data.faqs.map((faq, i) => (
                          <div key={i} className="therapy-3d-card__faq-item">
                            <p className="therapy-3d-card__faq-q">
                              <HelpCircle className="therapy-3d-card__faq-icon" />
                              {faq.q}
                            </p>
                            <p className="therapy-3d-card__faq-a">{faq.a}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ambient Outer Card Glow */}
        <div className="therapy-3d-card__ambient-glow" style={{ transform: 'translateZ(-10px)' }} />
      </motion.article>
    </div>
  );
};

export default TherapyCard;
