/**
 * DWC Therapy & Treatment Services Data Source
 * Content source of truth: DANIEL WELLNESS CENTER Detailed Website Service Content PDF
 */

import cardReflexology from '../assets/images/desktop/therapy/card_reflexology.jpg';
import cardTaping from '../assets/images/desktop/therapy/card_taping.jpg';
import cardIceBath from '../assets/images/desktop/therapy/card_ice_bath.jpg';
import cardSteamBath from '../assets/images/desktop/therapy/card_steam_bath.jpg';
import cardCupping from '../assets/images/desktop/therapy/card_cupping.jpg';
import cardBamboo from '../assets/images/desktop/therapy/card_bamboo.jpg';

export const therapyData = [
  {
    id: 'reflexology',
    number: '01',
    category: 'THERAPY 01',
    title: 'Reflexology',
    tagline: 'Restore Balance. Relax Deeply. Feel Refreshed.',
    image: cardReflexology,
    iconName: 'Footprints',
    introduction: 'Reflexology is a relaxing wellness practice that focuses on specific pressure points, particularly on the feet. It is designed to create a calming experience and support overall relaxation. For many people, reflexology becomes a peaceful break from everyday stress, prolonged standing, physical tiredness, and mental tension.',
    whatIsThis: 'During a reflexology session, controlled pressure and massage-style techniques are applied to selected areas. The experience focuses on comfort and relaxation while helping the client unwind in a calm environment. It can be a suitable wellness choice for people who simply want dedicated time for rest and body relaxation.',
    benefits: [
      'Promotes deep relaxation',
      'May help reduce everyday stress and tension',
      'Supports a sense of overall body comfort',
      'Encourages a calm and peaceful wellness experience',
      'May support circulation through massage-based techniques',
      'Can help people feel refreshed after a busy day'
    ],
    whoMayChoose: 'Reflexology may appeal to people who spend long hours standing, walking, working at a desk, managing everyday stress, or simply looking for a relaxing wellness experience. Suitability depends on the individual\'s comfort and circumstances.',
    whatToExpect: 'Your session begins with an understanding of your comfort and wellness goals. You can then relax while controlled pressure techniques are applied. The experience is intended to be calm, comfortable, and personalized rather than rushed.',
    whyChoose: [
      'Personalized attention',
      'Comfort-focused approach',
      'Professional guidance',
      'Clean and relaxing environment',
      'Easy appointment process'
    ],
    faqs: [
      {
        q: 'How long does a session take?',
        a: 'Session duration can vary depending on the service plan and individual requirements.'
      },
      {
        q: 'Is reflexology painful?',
        a: 'Pressure levels can be adjusted according to your comfort.'
      },
      {
        q: 'Do I need an appointment?',
        a: 'Appointments are recommended for a smoother experience.'
      }
    ]
  },
  {
    id: 'taping-therapy',
    number: '02',
    category: 'THERAPY 02',
    title: 'Taping Therapy',
    tagline: 'Support Your Movement. Stay Active With Confidence.',
    image: cardTaping,
    iconName: 'Activity',
    introduction: 'Taping Therapy is a supportive technique that uses specially designed therapeutic tape to provide external support to selected muscles and joints while allowing natural movement. It is commonly considered as part of a broader recovery and movement-support approach.',
    whatIsThis: 'Depending on individual needs, tape may be applied to areas that require additional support. The application method can vary based on the body area, movement requirements, and the reason for seeking support. A proper assessment and professional guidance are important before deciding on suitability.',
    benefits: [
      'Provides external support to selected areas',
      'May support comfortable movement',
      'Can be considered for active lifestyles and recovery routines',
      'May help provide awareness and support during movement',
      'Allows movement while providing a supportive application'
    ],
    whoMayChoose: 'This service may be considered by physically active individuals, people seeking additional support during movement, or those following a recovery plan. Individual suitability should always be discussed before application.',
    whatToExpect: 'The therapist first understands the area of concern and movement needs. The skin is prepared and the tape is applied using an appropriate technique. You may receive guidance about basic care and how long the application is intended to remain in place.',
    whyChoose: [
      'Individual-focused application',
      'Professional guidance',
      'Attention to comfort and movement needs',
      'Supportive approach rather than a one-size-fits-all method'
    ],
    faqs: [
      {
        q: 'Can I move normally with the tape?',
        a: 'The purpose of therapeutic taping often includes allowing movement while providing support, depending on the application.'
      },
      {
        q: 'How long can the tape stay on?',
        a: 'This depends on the type of tape, skin condition, activity level, and professional guidance.'
      },
      {
        q: 'Can everyone use taping therapy?',
        a: 'Suitability varies, especially for people with sensitive skin or certain skin conditions.'
      }
    ]
  },
  {
    id: 'ice-bath-therapy',
    number: '03',
    category: 'THERAPY 03',
    title: 'Ice Bath Therapy',
    tagline: 'Refresh Your Body. Reset Your Mind. Support Your Recovery.',
    image: cardIceBath,
    iconName: 'Snowflake',
    introduction: 'Ice Bath Therapy uses controlled cold-water exposure as part of a wellness and recovery routine. It has become popular among active individuals and people interested in post-activity recovery experiences.',
    whatIsThis: 'The experience involves spending a controlled amount of time in cold water under appropriate guidance. Because cold exposure can affect the body significantly, preparation, individual tolerance, and professional supervision are important.',
    benefits: [
      'Provides an intense refreshing experience',
      'Popular as part of post-activity recovery routines',
      'May support a feeling of recovery after physical exertion',
      'Can create a strong sense of mental refreshment',
      'Encourages disciplined breathing and controlled exposure'
    ],
    whoMayChoose: 'Ice Bath Therapy may be of interest to athletes, fitness enthusiasts, and active individuals. It is not automatically suitable for everyone, and individual health considerations should be discussed before participation.',
    whatToExpect: 'Before beginning, the process and comfort expectations should be explained. The session focuses on controlled exposure and monitoring individual tolerance. Clients should never feel pressured to continue beyond a safe limit.',
    whyChoose: [
      'Guidance-focused approach',
      'Attention to individual tolerance',
      'Clear preparation and session instructions',
      'Recovery and wellness-focused environment'
    ],
    faqs: [
      {
        q: 'Is an ice bath suitable for everyone?',
        a: 'No. Certain health conditions may make cold exposure unsuitable, so professional guidance is necessary.'
      },
      {
        q: 'How long is the session?',
        a: 'Duration should be determined based on the program, individual tolerance, and appropriate guidance.'
      },
      {
        q: 'What should I do before the session?',
        a: 'Follow the preparation instructions provided by the wellness professional.'
      }
    ]
  },
  {
    id: 'steam-bath',
    number: '04',
    category: 'THERAPY 04',
    title: 'Steam Bath',
    tagline: 'Step Into Warmth. Leave Feeling Relaxed.',
    image: cardSteamBath,
    iconName: 'Flame',
    introduction: 'A Steam Bath offers a warm and calming environment designed to help you take a break from daily stress and enjoy a deeply relaxing wellness experience. The warm steam environment can help create a feeling of comfort and encourage the body to unwind.',
    whatIsThis: 'Steam Bath sessions are often chosen by people looking for relaxation after a busy day, physical activity, or periods of body stiffness. Hydration and individual comfort should always be considered.',
    benefits: [
      'Promotes a deep feeling of relaxation',
      'May help create a sense of looseness in tired muscles',
      'Supports a calming wellness routine',
      'Can be a refreshing self-care experience',
      'Encourages time away from everyday stress'
    ],
    whoMayChoose: 'This service may be suitable for people seeking relaxation, a calming environment, and a wellness-focused self-care experience. Individual tolerance and health considerations should be discussed where relevant.',
    whatToExpect: 'You can enter the steam environment and relax for the recommended duration while paying attention to comfort and hydration. The goal is a calm experience, not prolonged exposure beyond your comfort.',
    whyChoose: [
      'Comfortable wellness environment',
      'Clear guidance',
      'Focus on relaxation and client comfort',
      'Easy integration with other wellness services'
    ],
    faqs: [
      {
        q: 'How long should I stay in a steam bath?',
        a: 'Duration depends on individual tolerance and professional guidance.'
      },
      {
        q: 'Should I drink water?',
        a: 'Hydration is generally important before and after heat-based wellness experiences.'
      },
      {
        q: 'Can everyone use a steam bath?',
        a: 'Certain health conditions may require medical advice before using heat-based services.'
      }
    ]
  },
  {
    id: 'cupping-therapy',
    number: '05',
    category: 'THERAPY 05',
    title: 'Cupping Therapy',
    tagline: 'Release Tension. Relax Your Body. Support Your Wellness.',
    image: cardCupping,
    iconName: 'CircleDot',
    introduction: 'Cupping Therapy is a traditional technique that uses specially designed cups placed on selected areas of the body. It is commonly included in wellness routines focused on relaxation, body comfort, and muscle tension release.',
    whatIsThis: 'The technique creates a suction effect on the skin. Different approaches may be used depending on the service and individual requirements. Before the session, it is important to understand what the experience involves and discuss any concerns.',
    benefits: [
      'May support muscle relaxation',
      'Can be part of a body tension-release routine',
      'May support a feeling of improved body comfort',
      'Often chosen for back and shoulder tension',
      'Provides a unique relaxation experience'
    ],
    whoMayChoose: 'People experiencing everyday muscle tightness, physical tiredness, or those looking for a traditional wellness experience may be interested in cupping. Individual suitability should always be considered.',
    whatToExpect: 'The therapist discusses your comfort and identifies suitable areas for the session. Cups are placed using an appropriate technique and monitored throughout the experience. Temporary marks can occur depending on the technique.',
    whyChoose: [
      'Professional guidance',
      'Comfort-focused communication',
      'Personalized wellness approach',
      'Clear explanation before the session'
    ],
    faqs: [
      {
        q: 'Will cupping leave marks?',
        a: 'Temporary marks can occur depending on the technique and individual response.'
      },
      {
        q: 'Is cupping painful?',
        a: 'The experience varies, but comfort should be discussed with the therapist.'
      },
      {
        q: 'What should I do after a session?',
        a: 'Follow the aftercare guidance provided for your specific session.'
      }
    ]
  },
  {
    id: 'bamboo-therapy',
    number: '06',
    category: 'THERAPY 06',
    title: 'Bamboo Therapy',
    tagline: 'Experience the Natural Power of Bamboo. Deep Relaxation Starts Here.',
    image: cardBamboo,
    iconName: 'Sparkles',
    introduction: 'Bamboo Therapy is a unique massage-based wellness experience that uses specially designed smooth bamboo tools to apply controlled pressure and flowing movements across different areas of the body. It combines the natural feel of bamboo with massage-style techniques to create a deeply relaxing experience.',
    whatIsThis: 'Different bamboo tools can be used depending on the body area and desired pressure. The shape and firmness of bamboo allow broad, flowing movements as well as more focused techniques. The experience is designed around relaxation, muscle comfort, and overall rejuvenation.',
    benefits: [
      'Supports deep muscle relaxation',
      'May help reduce feelings of everyday body stiffness',
      'Encourages stress relief and mental relaxation',
      'Massage-based techniques may support circulation',
      'Can be included in post-activity recovery routines',
      'Provides a refreshing full-body wellness experience'
    ],
    whoMayChoose: 'Bamboo Therapy may appeal to people who enjoy deeper massage-style pressure, experience everyday body tightness, lead physically active lifestyles, or simply want a unique and natural relaxation experience.',
    whatToExpect: 'The session begins by understanding your comfort level and wellness goals. Appropriate bamboo tools are selected, and pressure is adjusted based on your comfort. Smooth rolling and massage-style movements are used.',
    whyChoose: [
      'Personalized pressure based on comfort',
      'Natural bamboo-based wellness experience',
      'Professional guidance',
      'Relaxing and comfortable environment',
      'Individual-focused service recommendations'
    ],
    faqs: [
      {
        q: 'What makes Bamboo Therapy different from a regular massage?',
        a: 'It uses specially designed bamboo tools to create smooth rolling and controlled pressure techniques.'
      },
      {
        q: 'Can pressure be adjusted?',
        a: 'Yes, comfort and pressure preferences should be discussed during the session.'
      },
      {
        q: 'Who may enjoy Bamboo Therapy?',
        a: 'People looking for deeper relaxation, muscle comfort, and a unique massage-style wellness experience.'
      }
    ]
  }
];

export default therapyData;
