/**
 * Section Transition Configurations for DWC Website
 *
 * Each transition configuration defines:
 * - id: unique identifier
 * - type: transition visual effect archetype
 * - fromImage: last frame of outgoing section (desktop & mobile)
 * - toImage: first frame of incoming section (desktop & mobile)
 * - origin: transform origin for camera movement
 * - fromScale: [start, end] scale values for outgoing image
 * - toScale: [start, end] scale values for incoming image
 * - visualParams: custom parameters for lighting, vignette, and depth
 */

import { cinematicImages, staticImages } from './images';

export const transitionsConfig = {
  homeToAbout: {
    id: 'home-to-about',
    type: 'notepad',
    fromImage: {
      desktop: cinematicImages.home.desktop[3], // 04_home_notepad_reveal (Photo 4)
      mobile: cinematicImages.home.mobile[3]
    },
    toImage: {
      desktop: cinematicImages.about.desktop[0], // 02_about_wellness_reveal
      mobile: cinematicImages.about.mobile[0]
    },
    origin: '50% 50%',
    fromScale: [1.06, 1.06], // Holds final Frame 5 scale with zero second zoom
    toScale: [1.0, 1.0],   // Optical photo-to-photo alignment
    overlayType: 'paper-bridge',
    description: 'Cinematic photo-to-photo tonal bridge into the About section.'
  },

  aboutToTherapy: {
    id: 'about-to-therapy',
    type: 'doorway',
    fromImage: {
      desktop: cinematicImages.about.desktop[1], // 05_about_treatment_doorway (2-frame About sequence index 1)
      mobile: cinematicImages.about.mobile[1]
    },
    toImage: {
      desktop: cinematicImages.therapy.desktop[0], // 01_therapy_lab_entry
      mobile: cinematicImages.therapy.mobile[0]
    },
    origin: '50% 48%',
    fromScale: [1.05, 1.48],
    toScale: [0.90, 1.0],
    overlayType: 'doorway-depth',
    description: 'Corridor doorway depth transition into the therapy lab.'
  },

  therapyToRecovery: {
    id: 'therapy-to-recovery',
    type: 'light-exposure',
    fromImage: {
      desktop: cinematicImages.therapy.desktop[4], // 05_therapy_card_environment
      mobile: cinematicImages.therapy.mobile[4]
    },
    toImage: {
      desktop: cinematicImages.recovery.desktop[0], // 01_recovery_treatment_exit
      mobile: cinematicImages.recovery.mobile[0]
    },
    origin: '50% 50%',
    fromScale: [1.0, 1.15],
    toScale: [1.08, 1.0],
    overlayType: 'natural-bloom',
    description: 'Clinical to sunlit recovery transition with natural exposure shift.'
  },

  recoveryToCTA: {
    id: 'recovery-to-cta',
    type: 'window-light',
    fromImage: {
      desktop: cinematicImages.recovery.desktop[4], // 05_recovery_bright_lounge
      mobile: cinematicImages.recovery.mobile[4]
    },
    toImage: {
      desktop: staticImages.cta.desktop, // cta_wellness_lounge
      mobile: staticImages.cta.mobile
    },
    origin: '65% 42%',
    fromScale: [1.0, 1.20],
    toScale: [1.06, 1.0],
    overlayType: 'window-wash',
    description: 'Lounge window daylight wash transition into the CTA sanctuary.'
  }
};

// Phase Weights Configuration for Journey Progress Partitioning
// Sequences have weight 1.0 (or 1.15 for therapy with cards)
// Bridges have weight 0.55 (~280px of natural scroll)
export const PHASE_WEIGHTS = [
  { id: 'home', type: 'sequence', weight: 0.60, section: 'home' },
  { id: 'trans-home-about', type: 'transition', weight: 0.18, transitionKey: 'homeToAbout' },
  { id: 'about', type: 'sequence', weight: 1.25, section: 'about' },
  { id: 'trans-about-therapy', type: 'transition', weight: 0.55, transitionKey: 'aboutToTherapy' },
  { id: 'therapy', type: 'sequence', weight: 1.15, section: 'therapy' },
  { id: 'trans-therapy-recovery', type: 'transition', weight: 0.55, transitionKey: 'therapyToRecovery' },
  { id: 'recovery', type: 'sequence', weight: 1.0, section: 'recovery' },
  { id: 'trans-recovery-cta', type: 'transition', weight: 0.55, transitionKey: 'recoveryToCTA' }
];

const totalWeight = PHASE_WEIGHTS.reduce((acc, p) => acc + p.weight, 0);

let accumWeight = 0;
export const JOURNEY_PHASES = PHASE_WEIGHTS.map((p) => {
  const start = accumWeight / totalWeight;
  accumWeight += p.weight;
  const end = accumWeight / totalWeight;
  return {
    ...p,
    start,
    end,
    duration: end - start
  };
});

export default transitionsConfig;
