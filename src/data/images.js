/**
 * Centralized Image Configuration for DWC Website
 *
 * Sequence Order:
 * - Home (5 frames): 01 -> 05
 * - About (2 frames): 02 -> 05
 * - Therapy (5 frames): 01 -> 05
 * - Recovery (5 frames): 01 -> 05
 * - CTA (Static, 1 image)
 * - Footer (Static, 1 image)
 *
 * Supports responsive layouts with separate desktop and mobile assets.
 */

// Desktop Home Sequence (5 frames)
import homeDesktop01 from '../assets/images/desktop/home/01_home_clinic_wide.webp';
import homeDesktop02 from '../assets/images/desktop/home/02_home_clinic_approach.webp';
import homeDesktop03 from '../assets/images/desktop/home/03_home_table_approach.webp';
import homeDesktop04 from '../assets/images/desktop/home/04_home_notepad_reveal.webp';
import homeDesktop05 from '../assets/images/desktop/home/05_home_notepad_closeup.webp';

// Mobile Home Sequence (5 frames)
import homeMobile01 from '../assets/images/mobile/home/01_home_clinic_wide.webp';
import homeMobile02 from '../assets/images/mobile/home/02_home_clinic_approach.webp';
import homeMobile03 from '../assets/images/mobile/home/03_home_table_approach.webp';
import homeMobile04 from '../assets/images/mobile/home/04_home_notepad_reveal.webp';
import homeMobile05 from '../assets/images/mobile/home/05_home_notepad_closeup.webp';

// Desktop About Sequence (2 frames)
import aboutDesktop02 from '../assets/images/desktop/about/02_about_wellness_reveal.webp';
import aboutDesktop05 from '../assets/images/desktop/about/05_about_treatment_doorway.webp';

// Mobile About Sequence (2 frames)
import aboutMobile02 from '../assets/images/mobile/about/02_about_wellness_reveal.webp';
import aboutMobile05 from '../assets/images/mobile/about/05_about_treatment_doorway.webp';

// Desktop Therapy Sequence (5 frames)
import therapyDesktop01 from '../assets/images/desktop/therapy/01_therapy_lab_entry.webp';
import therapyDesktop02 from '../assets/images/desktop/therapy/02_therapy_lab_wide.webp';
import therapyDesktop03 from '../assets/images/desktop/therapy/03_therapy_equipment_approach.webp';
import therapyDesktop04 from '../assets/images/desktop/therapy/04_therapy_treatment_detail.webp';
import therapyDesktop05 from '../assets/images/desktop/therapy/05_therapy_card_environment.webp';

// Mobile Therapy Sequence (5 frames)
import therapyMobile01 from '../assets/images/mobile/therapy/01_therapy_lab_entry.webp';
import therapyMobile02 from '../assets/images/mobile/therapy/02_therapy_lab_wide.webp';
import therapyMobile03 from '../assets/images/mobile/therapy/03_therapy_equipment_approach.webp';
import therapyMobile04 from '../assets/images/mobile/therapy/04_therapy_treatment_detail.webp';
import therapyMobile05 from '../assets/images/mobile/therapy/05_therapy_card_environment.webp';

// Desktop Recovery Sequence (5 frames)
import recoveryDesktop01 from '../assets/images/desktop/recovery/01_recovery_treatment_exit.webp';
import recoveryDesktop02 from '../assets/images/desktop/recovery/02_recovery_lounge_wide.webp';
import recoveryDesktop03 from '../assets/images/desktop/recovery/03_recovery_lounge_detail.webp';
import recoveryDesktop04 from '../assets/images/desktop/recovery/04_recovery_window_light.webp';
import recoveryDesktop05 from '../assets/images/desktop/recovery/05_recovery_bright_lounge.webp';

// Mobile Recovery Sequence (5 frames)
import recoveryMobile01 from '../assets/images/mobile/recovery/01_recovery_treatment_exit.webp';
import recoveryMobile02 from '../assets/images/mobile/recovery/02_recovery_lounge_wide.webp';
import recoveryMobile03 from '../assets/images/mobile/recovery/03_recovery_lounge_detail.webp';
import recoveryMobile04 from '../assets/images/mobile/recovery/04_recovery_window_light.webp';
import recoveryMobile05 from '../assets/images/mobile/recovery/05_recovery_bright_lounge.webp';

// Static CTA Images
import ctaDesktop from '../assets/images/desktop/cta/cta_wellness_lounge.webp';
import ctaMobile from '../assets/images/mobile/cta/cta_wellness_lounge.webp';

// Static Footer Images
import footerDesktop from '../assets/images/desktop/footer/footer_wellness_background.webp';
import footerMobile from '../assets/images/mobile/footer/footer_wellness_background.webp';

export const cinematicImages = {
  home: {
    desktop: [
      homeDesktop01,
      homeDesktop02,
      homeDesktop03,
      homeDesktop04,
      homeDesktop05
    ],
    mobile: [
      homeMobile01,
      homeMobile02,
      homeMobile03,
      homeMobile04,
      homeMobile05
    ]
  },
  about: {
    desktop: [
      aboutDesktop02,
      aboutDesktop05
    ],
    mobile: [
      aboutMobile02,
      aboutMobile05
    ]
  },
  therapy: {
    desktop: [
      therapyDesktop01,
      therapyDesktop02,
      therapyDesktop03,
      therapyDesktop04,
      therapyDesktop05
    ],
    mobile: [
      therapyMobile01,
      therapyMobile02,
      therapyMobile03,
      therapyMobile04,
      therapyMobile05
    ]
  },
  recovery: {
    desktop: [
      recoveryDesktop01,
      recoveryDesktop02,
      recoveryDesktop03,
      recoveryDesktop04,
      recoveryDesktop05
    ],
    mobile: [
      recoveryMobile01,
      recoveryMobile02,
      recoveryMobile03,
      recoveryMobile04,
      recoveryMobile05
    ]
  }
};

export const staticImages = {
  cta: {
    desktop: ctaDesktop,
    mobile: ctaMobile
  },
  footer: {
    desktop: footerDesktop,
    mobile: footerMobile
  }
};

export default {
  cinematicImages,
  staticImages
};
