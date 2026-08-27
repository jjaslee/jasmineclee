import { buildProjectPath } from '../utils/routes.js'

const PHOTOGRAPHY_SITE_URL = 'https://jascielle-photography.vercel.app/'

const PHOTO_PROJECT_DEFINITIONS = [
  {
    id: 'ember',
    slug: 'ember',
    title: 'Ember',
    files: ['IMG_3251.jpg', '4S7A2211.jpg', 'IMG_3134.jpg', 'IMG_1782.jpg', 'IMG_0935.jpg', 'IMG_0408.jpg', 'IMG_9388.jpg', 'IMG_9197.jpg'],
  },
  {
    id: 'passing',
    slug: 'passing',
    title: 'Passing',
    files: ['IMG_4171.jpg', 'IMG_4164.jpg', 'IMG_4013.jpg', 'IMG_0346.jpg', 'IMG_0857.jpg', 'IMG_9446.jpg', 'IMG_9083.jpg', 'IMG_9443.jpg'],
  },
  {
    id: 'tidal',
    slug: 'tidal',
    title: 'Tidal',
    files: ['IMG_9347.jpg', 'IMG_9000.jpg', 'IMG_9338.jpg', 'IMG_8949.jpg', 'IMG_9244.jpg', 'IMG_3827.jpg', 'IMG_1072.jpg', 'IMG_1423.jpg'],
  },
  {
    id: 'canopy',
    slug: 'canopy',
    title: 'Canopy',
    files: ['IMG_9424.jpg', 'IMG_2396.jpg', 'IMG_1925.jpg', 'IMG_3908.jpg', 'IMG_8912.jpg', 'IMG_3916.jpg', 'IMG_4493.jpg', 'IMG_3917.jpg'],
  },
]
const AQUASYNC_ITEMS = [
  {
    type: 'doc',
    pages: [
      '/design/aquasync/aquasync-01.jpg',
      '/design/aquasync/aquasync-02.jpg',
      '/design/aquasync/aquasync-03.jpg',
      '/design/aquasync/aquasync-04.jpg',
      '/design/aquasync/aquasync-05.jpg',
      '/design/aquasync/aquasync-06.jpg',
      '/design/aquasync/aquasync-07.jpg',
      '/design/aquasync/aquasync-08.jpg',
    ],
  },
  {
    type: 'doc',
    pages: [
      '/design/aquasync/aquasync-doc2-01.jpg',
      '/design/aquasync/aquasync-doc2-02.jpg',
      '/design/aquasync/aquasync-doc2-03.jpg',
      '/design/aquasync/aquasync-doc2-04.jpg',
      '/design/aquasync/aquasync-doc2-05.jpg',
      '/design/aquasync/aquasync-doc2-06.jpg',
      '/design/aquasync/aquasync-doc2-07.jpg',
      '/design/aquasync/aquasync-doc2-08.jpg',
      '/design/aquasync/aquasync-doc2-09.jpg',
      '/design/aquasync/aquasync-doc2-10.jpg',
      '/design/aquasync/aquasync-doc2-11.jpg',
      '/design/aquasync/aquasync-doc2-12.jpg',
      '/design/aquasync/aquasync-doc2-13.jpg',
      '/design/aquasync/aquasync-doc2-14.jpg',
      '/design/aquasync/aquasync-doc2-15.jpg',
      '/design/aquasync/aquasync-doc2-16.jpg',
      '/design/aquasync/aquasync-doc2-17.jpg',
    ],
  },
  {
    type: 'doc',
    pages: ['/design/aquasync/aquasync-doc3-02.jpg', '/design/aquasync/aquasync-doc3-01.jpg'],
  },
  {
    type: 'phoneScrollImage',
    coverSrc: '/design/aquasync/aquasync-figma-cover.jpg',
    frameSrc: '/design/aquasync/aquasync-phone-frame.svg',
    screenSrc: '/design/aquasync/aquasync-gui-scroll.png',
  },
  {
    type: 'image',
    src: '/design/aquasync/aquasync-dashboard-ui.png',
  },
]

const DESIGN_FOLDER_CAPTIONS = {
  Astron:
    'An astronomy magazine that presents the eight planets through an approachable, illustrative style, using hand-drawn elements and annotated layouts to make complex information more engaging and accessible.',
  'Digital Drawing':
    'Exploring illustration and graphic design through character-driven compositions, experimenting with typography, color, and layout to shape distinct visual narratives across editorial and poster formats',
  AquaSync:
    `AquaSync is a universal hydration tracking system that turns any cup into a connected experience. By combining passive sensing with a companion interface, it makes water intake visible, effortless, and consistent over time.
    
    DESIGN FOUNDATION
Insight
Users struggle to track hydration across different containers and lack awareness of total daily intake.

Principles
Make hydration visible in real time
Remove dependency on a single bottle
Fit seamlessly into daily routines
Provide clear, intuitive feedback

System Decision
A smart sensing base with wireless syncing and a companion interface that enables real-time tracking across any cup.

PRODUCT OVERVIEW
Overview
A universal hydration tracking system that pairs a smart sensing base with a companion app to monitor water intake across any cup.

Problem
Hydration is inconsistent due to fragmented tracking and lack of immediate feedback.

Approach
Measure intake through a sensing base
Sync data from cup to phone
Support universal cup usage
Reinforce habits through real-time feedback

Outcome
Transforms any cup into a connected system, making hydration visible, trackable, and consistent.
`,
  'Lazy Day Lines': `A brand concept exploring color, line, and form through cozy, slow-paced visuals that reframe rest and productivity as part of the same rhythm.

DESIGN FOUNDATION

Insight
Young adults associate rest and productivity with conflicting aesthetics, often lacking visual language that normalizes slow, cozy routines.

Principles

Embrace softness without losing structure
Use muted, warm tones to evoke calm and familiarity
Keep forms simple, fluid, and approachable
Balance stillness with subtle visual movement

Creative Direction
A visual identity built on layered shapes, hand-drawn lines, and a warm, desaturated palette to capture a “cozy productivity” aesthetic.

PRODUCT OVERVIEW

Overview
A brand concept exploring how color, form, and line can shape a calm, cozy visual language around rest, study, and self-care.

Problem
Existing productivity visuals feel rigid or high-energy, while rest-focused visuals lack structure—leaving a gap in representing balanced, everyday routines.

Approach

Experiment with color palettes that evoke warmth and calm
Iterate on logo forms using loose, hand-drawn linework
Layer soft geometric shapes to create depth and rhythm
Explore compositions that reflect relaxed, everyday moments

Outcome
A cohesive visual system that communicates comfort, softness, and quiet productivity, resonating with a younger audience seeking balance in their routines.`,
  'Cal Hacks': `Led the visual direction and design execution for Cal Hacks, shaping themes, branding systems, and deliverables across recruitment, events, and hackathons.

DESIGN FOUNDATION

Insight
Students are drawn to hackathons through strong visual identity and clear messaging, but engagement drops when branding feels inconsistent or disconnected across platforms.

Principles

Create a cohesive identity across all touchpoints
Design for clarity and fast communication
Balance innovation with accessibility
Maintain consistency across a large team

Creative Direction
Developed adaptable visual themes that translate across digital and physical formats, guiding a team of designers to produce cohesive assets for recruitment campaigns, event materials, and hackathon experiences.

APPROACH
Defined seasonal themes and visual systems for each event cycle
Directed and collaborated with a team of designers on asset creation
Designed materials for recruitment, social media, and event branding
Ensured consistency across platforms, timelines, and teams

OUTCOME
Delivered a cohesive visual identity across large-scale events, supporting engagement for thousands of participants and enabling clear, consistent communication throughout the hackathon experience.

https://ai.hackberkeley.org/`,
  'The Studio Index': `A curated digital archive that transforms subjective aesthetic preferences into a structured, browsable system through filtering, categorization, and interaction.

DESIGN FOUNDATION

Insight
Aesthetic taste is often intuitive and difficult to articulate, making it hard to organize, revisit, or act on.

Principles

Translate subjective taste into structured data
Enable fast, intuitive filtering and discovery
Maintain clarity across dense information
Support both exploration and action

System Design
A classification system that encodes objects by aesthetic, spatial context, and function, supported by a backend pipeline that collects, normalizes, and structures data. The system connects discovery to action through direct links to purchase.

APPROACH
Designed a flexible schema to categorize objects across multiple dimensions
Built a data pipeline to scrape and normalize item data
Developed filtering and browsing interfaces for exploration
Created detailed item views with context, materials, and sourcing
Integrated external links to enable direct purchasing
Implemented a personal journal system for saving and revisiting entries

OUTCOME

A scalable system that bridges data, interface, and real-world action-allowing users to discover, organize, and directly acquire items that align with their aesthetic.

https://the-studio-index.vercel.app/`,
  'Fluttering Kindness': `A public mural transforming an everyday utility space into a welcoming visual experience through storytelling and color.

DESIGN FOUNDATION

Insight
Public spaces are often overlooked or purely functional, missing opportunities to foster connection and positivity within a community.

Principles

Design for visibility and approachability
Use color to create warmth and openness
Tell a simple, uplifting visual story
Integrate with the physical environment

System Design
A multi-surface composition that wraps around the structure, guiding the viewer through a continuous narrative of butterflies, growth, and interaction.

APPROACH
Developed concept sketches to map visuals across each face of the structure
Coordinated with city stakeholders to align on design, placement, and approval
Designed compositions that flow seamlessly across edges and corners
Selected a bright, inviting color palette to increase visibility
Painted and executed the mural on-site, adapting to scale and surface constraints
Returned to restore and repaint sections after graffiti, maintaining the integrity of the work

OUTCOME

A community-facing installation that balances creative vision with real-world constraints, sustaining its presence and impact over time.`,
}
const TECHNICALS_FOLDER_CAPTIONS = {
  Goniometrix: `A wearable system that measures joint range of motion and provides real-time feedback to improve movement accuracy and consistency.

DESIGN FOUNDATION

Insight
Traditional goniometers require manual alignment and second-person use, making independent measurement inconsistent and difficult.

User research revealed that the main breakdown was inconsistent placement and difficulty interpreting results, not just measurement.

Principles

Enable independent use
Provide subtle, real-time feedback
Reduce setup ambiguity
Support long-term learning

DESIGN PROCESS
Identify — We began by framing the problem: traditional goniometers are difficult to use independently because they require manual alignment, interpretation, and often a second person.
Understand — Through interviews and observations with patients and athletes, we identified key needs around placement consistency, feedback clarity, and long-term habit formation.
Conceptualize — We explored wearable and feedback-driven concepts, then mapped them across feasibility, impact, and alignment with user needs to narrow toward a dual-IMU wearable system.
Realize — We built a working hardware-software prototype with dual IMU sensing, ESP32 processing, haptic/audio feedback, and a custom GUI for real-time visualization and tracking.

SYSTEM (SENSE → PREDICT → ACTUATE)

Sense
Dual IMU sensors capture joint movement, with calibration to reduce drift.

Predict
An ESP32 processes data and classifies movement relative to target ranges (~10° tolerance).

Actuate
Vibration motors and a speaker provide graded haptic and audio feedback. Data is transmitted via Bluetooth to a custom-coded GUI that visualizes movement, logs sessions, and tracks progress.

Experience
Users move from guessing to feeling and understanding their motion in real time.

OUTCOME

A hardware–software system integrating sensing, embedded processing, Bluetooth communication, and a custom-built interface to support independent, data-driven movement training.

REFLECTION
This project showed me that the biggest challenge was not only measuring joint angle, but making the feedback understandable during independent use. User research shifted our focus from simple measurement toward real-time guidance, haptics, and visual progress tracking. If I continued the project, I would improve IMU calibration, expand to other ROM motions (e.g. abduction / adduction), reduce the wearable size, and test whether users reach target ROM more consistently with feedback enabled.

MY ROLE
I contributed to user research synthesis, concept development, GUI design/implementation, and the final visual presentation.

GUI LINK
https://kamronsoltani.github.io/goniometer/`,
  'Kinetic Origamic': `A kinetic installation combining physical design and embedded systems to explore how folded structures transform through controlled motion.

DESIGN FOUNDATION

Insight
Designing for motion requires both form exploration and precise control-balancing aesthetics with mechanical behavior.

Principles

Design for smooth, continuous motion
Balance structure with flexibility
Maintain clarity across movement states
Integrate form and mechanism as one system

System Design
A servo-driven mechanism controlled through Arduino sweep motion, enabling the origami structure to transition between states of expansion and contraction.

APPROACH
Prototyped folding behaviors through iterative paper models
Defined discrete motion states (resting, intermediate, lifted)
Implemented servo sweep control using Arduino
Integrated mechanical and structural components into a cohesive system

OUTCOME

A working kinetic system that demonstrates the integration of physical design and simple embedded control, highlighting both form exploration and technical execution.`,
  'Gear System': `A fabricated gear system exploring motion, tolerance, and mechanical fit across different materials and fabrication methods.

DESIGN FOUNDATION

Insight
Small inaccuracies in digital models can lead to failure in physical systems, making precision and tolerance critical when translating designs across materials and processes.

Principles

Design for accurate motion and alignment
Account for material and fabrication constraints
Iterate between digital and physical models
Prioritize fit and function

System Design
A two-gear system mounted within a structured frame, designed in CAD and fabricated through both 3D printing and laser cutting to evaluate differences in tolerance, rigidity, and assembly.

APPROACH
Modeled gears and frame in CAD for controlled interaction
Prototyped using 3D printing to test iterative fit and motion
Produced a laser cut version to explore rigid material constraints
Adjusted bore hole sizing to achieve precise tolerance fitting
Compared performance across fabrication methods

OUTCOME

A functional gear system demonstrating smooth motion and precise fit, while highlighting how material and fabrication choices impact mechanical behavior and design decisions.`,
  'Water Automata': `A kinetic machine that simulates the ripple effect of falling water through mechanical motion and layered components.

DESIGN FOUNDATION

Insight
Natural phenomena like water ripples are visually simple but mechanically complex, requiring coordinated motion to recreate convincingly.

Principles

Translate natural motion into mechanical systems
Use repetition and symmetry to create smooth patterns
Balance structure with moving components
Design for both function and visual storytelling

System Design
A cam-driven mechanism where rotating elements push concentric wooden rings to simulate water ripples, activated through a hand-cranked gear system.

APPROACH
Developed initial concepts and dimensional layouts to estimate structure and motion
Prototyped cam and ring interactions to test movement and fit
Iterated on friction, alignment, and structural stability through multiple builds
Integrated laser cut components, gears, and enclosure into a cohesive system
Added 3D printed elements to enhance the visual narrative

OUTCOME

A hand-driven kinetic installation that recreates the visual rhythm of water ripples, combining mechanical precision with a playful, narrative-driven experience.

https://drive.google.com/file/d/1j1Xlg2a20wX-nFJne45IpIBMELtVFU76/view`,
}

const KINETIC_ORIGAMIC_ITEMS = [
  {
    type: 'image',
    src: '/technicals/kinetic-origamic/kinetic-origamic-motion-01.gif',
    title: 'Motion Study',
    desc: 'Servo-driven movement of transitions between states.',
  },
  {
    type: 'image',
    src: '/technicals/kinetic-origamic/kinetic-origamic-final-prototype-01.jpg',
    title: 'Final Prototype',
    desc: 'Integrated form and mechanism in the completed kinetic system.',
  },
  {
    type: 'doc',
    coverSrc: '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-01.jpg',
    title: 'Process & System',
    desc: 'Prototyping, mechanism design, and motion development.',
    pages: [
      '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-01.jpg',
      '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-02.jpg',
      '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-03.jpg',
      '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-04.jpg',
      '/technicals/kinetic-origamic/kinetic-origamic-doc-01-page-05.jpg',
    ],
  },
]

const GONIOMETRIX_ITEMS = [
  {
    type: 'video',
    src: '/technicals/mechatronic-goniometer/mechatronic-goniometer-interaction-01.mp4',
    title: 'Interaction',
    desc: 'Real-time feedback loop between user movement and interface',
  },
  {
    type: 'image',
    src: '/technicals/mechatronic-goniometer/goniometrix-poster.png',
    title: 'Poster',
    desc: 'Detailed overview of methodology and design journey',
    pdfHref: '/technicals/mechatronic-goniometer/goniometrix-poster.pdf',
  },
  {
    type: 'doc',
    coverSrc: '/technicals/mechatronic-goniometer/goniometrix-hardware-photo-01.png',
    title: 'Hardware Prototype',
    desc: 'Wearable modules (IMUs, vibration motors, speaker)',
    pages: [
      '/technicals/mechatronic-goniometer/goniometrix-hardware-photo-01.png',
      '/technicals/mechatronic-goniometer/goniometrix-hardware-photo-02.png',
      '/technicals/mechatronic-goniometer/mechatronic-goniometer-hardware-prototype-01.png',
      '/technicals/mechatronic-goniometer/mechatronic-goniometer-hardware-prototype-02.png',
    ],
  },
  {
    type: 'image',
    src: '/technicals/mechatronic-goniometer/goniometrix-roadmap.png',
    title: 'Roadmap',
    desc: 'Connecting research insights, concept development, and prototyping',
    pdfHref: '/technicals/mechatronic-goniometer/goniometrix-roadmap.pdf',
  },
  {
    type: 'image',
    src: '/technicals/mechatronic-goniometer/mechatronic-goniometer-system-01.png',
    title: 'System',
    desc: 'Sensing, feedback, and user interaction loop',
  },
]

const WATER_AUTOMATA_ITEMS = [
  {
    type: 'image',
    src: '/technicals/water-automata/water-automata-motion-01.gif',
    title: 'Motion',
    desc: 'Hand-cranked ripple simulation in motion',
  },
  {
    type: 'doc',
    coverSrc: '/technicals/water-automata/water-automata-concepts-01.jpg',
    title: 'Concepts',
    desc: 'Early sketches exploring form and layout',
    pages: [
      '/technicals/water-automata/water-automata-concepts-01.jpg',
      '/technicals/water-automata/water-automata-concepts-02.jpg',
      '/technicals/water-automata/water-automata-concepts-03.jpg',
    ],
  },
  {
    type: 'doc',
    coverSrc: '/technicals/water-automata/water-automata-process-01.jpg',
    title: 'Process',
    desc: 'Iteration, assembly, and mechanism testing',
    pages: [
      '/technicals/water-automata/water-automata-process-01.jpg',
      '/technicals/water-automata/water-automata-process-02.jpg',
      '/technicals/water-automata/water-automata-process-03.jpg',
      '/technicals/water-automata/water-automata-process-04.jpg',
      '/technicals/water-automata/water-automata-process-05.jpg',
      '/technicals/water-automata/water-automata-process-06.jpg',
      '/technicals/water-automata/water-automata-process-07.jpg',
    ],
  },
  {
    type: 'doc',
    coverSrc: '/technicals/water-automata/water-automata-fab-files-01.jpg',
    title: 'Fabrication Files',
    desc: 'CAD models and laser cut layouts',
    pages: [
      '/technicals/water-automata/water-automata-fab-files-01.jpg',
      '/technicals/water-automata/water-automata-fab-files-02.jpg',
      '/technicals/water-automata/water-automata-fab-files-03.jpg',
      '/technicals/water-automata/water-automata-fab-files-04.jpg',
      '/technicals/water-automata/water-automata-fab-files-05.jpg',
      '/technicals/water-automata/water-automata-fab-files-06.jpg',
    ],
  },
  {
    type: 'doc',
    coverSrc: '/technicals/water-automata/water-automata-final-machine-01.jpg',
    title: 'Final Machine',
    desc: 'Completed build and assembled system',
    pages: [
      '/technicals/water-automata/water-automata-final-machine-01.jpg',
      '/technicals/water-automata/water-automata-final-machine-02.jpg',
    ],
  },
]

const GEAR_SYSTEM_ITEMS = [
  {
    type: 'doc',
    coverSrc: '/technicals/gear-system/gear-system-laser-cut-01.jpg',
    title: 'Laser Cut System',
    desc: 'Laser-cut gear system exploring rigid material constraints and precision fitting',
    pages: [
      '/technicals/gear-system/gear-system-laser-cut-01.jpg',
      '/technicals/gear-system/gear-system-laser-cut-02.jpg',
      '/technicals/gear-system/gear-system-laser-cut-03.jpg',
    ],
  },
  {
    type: 'doc',
    coverSrc: '/technicals/gear-system/gear-system-fab-process-01.jpg',
    title: 'Fabrication Process (Laser Cut)',
    desc: 'Tolerance testing and vector preparation for accurate laser fabrication.',
    pages: [
      '/technicals/gear-system/gear-system-fab-process-01.jpg',
      '/technicals/gear-system/gear-system-fab-process-02.jpg',
      '/technicals/gear-system/gear-system-fab-process-03.jpg',
      '/technicals/gear-system/gear-system-fab-process-04.jpg',
    ],
  },
  {
    type: 'doc',
    coverSrc: '/technicals/gear-system/gear-system-3d-print-dev-01.jpg',
    title: '3D Print Development',
    desc: 'Iterative prototyping to refine fit, motion, and assembly',
    pages: [
      '/technicals/gear-system/gear-system-3d-print-dev-01.jpg',
      '/technicals/gear-system/gear-system-3d-print-dev-02.jpg',
      '/technicals/gear-system/gear-system-3d-print-dev-03.jpg',
      '/technicals/gear-system/gear-system-3d-print-dev-04.jpg',
      '/technicals/gear-system/gear-system-3d-print-dev-05.jpg',
      '/technicals/gear-system/gear-system-3d-print-dev-06.jpg',
    ],
  },
  {
    type: 'doc',
    coverSrc: '/technicals/gear-system/gear-system-final-3d-print-01.jpg',
    title: 'Final System (3D Print)',
    desc: 'Integrated gear system demonstrating smooth motion and precise fit',
    pages: [
      '/technicals/gear-system/gear-system-final-3d-print-01.jpg',
      '/technicals/gear-system/gear-system-final-3d-print-02.jpg',
      '/technicals/gear-system/gear-system-final-3d-print-03.jpg',
    ],
  },
]
const AQUASYNC_GRID_HOVER = [
  { title: 'Product Overview', desc: 'How the system works end-to-end' },
  { title: 'Campaign', desc: 'Why hydration habits fail' },
  { title: 'Ideation', desc: 'Exploring low-friction interaction' },
  { title: 'Mobile UI', desc: 'Real-time intake + feedback' },
  { title: 'Desktop UI', desc: 'Long-term habit insights' },
]

const LAZY_DAY_LINES_GRID_HOVER = [
  { title: 'Color Palette', desc: 'Warm, muted tones for a calm, cozy feel' },
  { title: 'Logo Exploration', desc: 'Soft, minimal mark variations' },
  { title: 'Illustration Style', desc: 'Soft compositions exploring cozy, everyday scenes' },
  { title: 'Applications', desc: 'Playful applications across stickers and everyday items' },
]

const CAL_HACKS_GRID_HOVER = [
  { title: "Spring '26 Recruitment Campaign", desc: 'Multi-platform visuals for fast, clear engagement.' },
  {
    title: 'Cal Hacks 12.0 Event Branding',
    desc: 'Large-scale physical assets for clarity, navigation, and consistency',
  },
  {
    title: 'Mid-Cycle Activation',
    desc: 'Extends the recruitment system to sustain engagement leading up to the event',
  },
  { title: 'AI Hackathon', desc: 'Led cohesive visual direction across the event' },
]

const LAZY_DAY_LINES_ITEMS = [
  { type: 'image', src: '/design/lazy-day-lines/lazy-day-lines-color-palette.png' },
  { type: 'image', src: '/design/lazy-day-lines/lazy-day-lines-logo-exploration.png' },
  {
    type: 'doc',
    coverSrc: '/design/lazy-day-lines/lazy-day-lines-illustration-style-01.png',
    pages: [
      '/design/lazy-day-lines/lazy-day-lines-illustration-style-01.png',
      '/design/lazy-day-lines/lazy-day-lines-illustration-style-02.png',
      '/design/lazy-day-lines/lazy-day-lines-illustration-style-03.png',
    ],
  },
  { type: 'image', src: '/design/lazy-day-lines/lazy-day-lines-applications-single.png' },
]

const CAL_HACKS_ITEMS = [
  {
    type: 'doc',
    coverSrc: '/design/cal-hacks/cal-hacks-spr26-recruitment-01.png',
    pages: [
      '/design/cal-hacks/cal-hacks-spr26-recruitment-01.png',
      '/design/cal-hacks/cal-hacks-spr26-recruitment-02.png',
      '/design/cal-hacks/cal-hacks-spr26-recruitment-03.png',
      '/design/cal-hacks/cal-hacks-spr26-recruitment-04.png',
      '/design/cal-hacks/cal-hacks-spr26-recruitment-05.png',
    ],
  },
  {
    type: 'doc',
    coverSrc: '/design/cal-hacks/cal-hacks-12-event-branding-01.jpg',
    pages: [
      '/design/cal-hacks/cal-hacks-12-event-branding-01.jpg',
      '/design/cal-hacks/cal-hacks-12-event-branding-02.jpg',
      '/design/cal-hacks/cal-hacks-12-event-branding-03.jpg',
      '/design/cal-hacks/cal-hacks-12-event-branding-04.png',
      '/design/cal-hacks/cal-hacks-12-event-branding-05.png',
    ],
  },
  {
    type: 'doc',
    coverSrc: '/design/cal-hacks/cal-hacks-mid-cycle-activation-01.png',
    pages: [
      '/design/cal-hacks/cal-hacks-mid-cycle-activation-01.png',
      '/design/cal-hacks/cal-hacks-mid-cycle-activation-02.png',
      '/design/cal-hacks/cal-hacks-mid-cycle-activation-03.png',
      '/design/cal-hacks/cal-hacks-mid-cycle-activation-04.jpg',
    ],
  },
  {
    type: 'scrollImage',
    coverSrc: '/design/cal-hacks/cal-hacks-ai-hackathon-scroll.png',
    src: '/design/cal-hacks/cal-hacks-ai-hackathon-scroll.png',
  },
]

const FLUTTERING_KINDNESS_ITEMS = [
  {
    type: 'image',
    src: '/design/fluttering-kindness/fluttering-kindness-01-concept-sketch.jpg',
    title: 'Concept Sketch',
    desc: 'Early composition mapping the mural across surfaces',
  },
  {
    type: 'doc',
    coverSrc: '/design/fluttering-kindness/fluttering-kindness-03-final-mural.jpg',
    title: 'Final Mural (Initial)',
    desc: 'First completed installation of the mural in its original state',
    pages: [
      '/design/fluttering-kindness/fluttering-kindness-03-final-mural.jpg',
      '/design/fluttering-kindness/fluttering-kindness-04-final-mural.jpg',
    ],
  },
  {
    type: 'image',
    src: '/design/fluttering-kindness/fluttering-kindness-02-final-mural.jpg',
    title: 'Final Mural (Restored)',
    desc: 'Repainted version following graffiti, preserving the original design',
  },
]

const CATEGORY_DEFINITIONS = [
  { id: 'design', title: 'Design', label: 'DESIGN', bodyColor: '#50C0FA', tabColor: '#1688C4', borderColor: '#29A1F4', iconType: 'pen', order: 0 },
  { id: 'technicals', title: 'Technicals', label: 'TECHNICALS', bodyColor: '#C0F000', tabColor: '#8EAC12', borderColor: '#C0F000', iconType: 'monitor', order: 1 },
  {
    id: 'photos',
    title: 'Photos',
    label: 'PHOTOS',
    bodyColor: '#C96AED',
    tabColor: '#A825D9',
    borderColor: '#C96AED',
    iconType: 'camera',
    order: 2,
    externalUrl: PHOTOGRAPHY_SITE_URL,
    externalLabel: 'Jascielle Photography',
  },
]

function publicMediaPaths(category, slug, filenames) {
  return filenames.map((filename) => `/${category}/${slug}/${filename}`)
}

function withHoverCopy(items, hoverCopy) {
  return items.map((item, index) => ({
    ...item,
    ...(hoverCopy[index] || {}),
  }))
}

function mediaThumbnail(media) {
  const first = media?.[0]
  if (typeof first === 'string') return first
  if (!first || typeof first !== 'object') return null
  if (first.type === 'doc') return first.coverSrc || first.pages?.[0] || null
  if (first.type === 'phoneScrollImage' || first.type === 'scrollImage') {
    return first.coverSrc || first.src || null
  }
  return first.src || null
}

const RAW_PROJECTS = [
  {
    id: 'cal-hacks',
    slug: 'cal-hacks',
    title: 'Cal Hacks',
    legacyCategory: 'design',
    summary: DESIGN_FOLDER_CAPTIONS['Cal Hacks'],
    media: withHoverCopy(CAL_HACKS_ITEMS, CAL_HACKS_GRID_HOVER),
    order: 0,
  },
  {
    id: 'aquasync',
    slug: 'aquasync',
    title: 'AquaSync',
    legacyCategory: 'design',
    summary: DESIGN_FOLDER_CAPTIONS.AquaSync,
    summaryLeadBold: true,
    media: withHoverCopy(AQUASYNC_ITEMS, AQUASYNC_GRID_HOVER),
    mediaPresentation: 'aquasync',
    order: 1,
  },
  {
    id: 'astron',
    slug: 'astron',
    title: 'Astron',
    legacyCategory: 'design',
    summary: DESIGN_FOLDER_CAPTIONS.Astron,
    media: publicMediaPaths('design', 'astron', [
      'astron-01.png',
      'astron-02.png',
      'astron-03.png',
      'astron-04.png',
      'astron-05.png',
      'astron-06.png',
    ]),
    order: 2,
  },
  {
    id: 'lazy-day-lines',
    slug: 'lazy-day-lines',
    title: 'Lazy Day Lines',
    legacyCategory: 'design',
    summary: DESIGN_FOLDER_CAPTIONS['Lazy Day Lines'],
    media: withHoverCopy(LAZY_DAY_LINES_ITEMS, LAZY_DAY_LINES_GRID_HOVER),
    order: 3,
  },
  {
    id: 'digital-drawing',
    slug: 'digital-drawing',
    title: 'Digital Drawing',
    legacyCategory: 'design',
    summary: DESIGN_FOLDER_CAPTIONS['Digital Drawing'],
    media: publicMediaPaths('design', 'digital-drawing', [
      'digital-drawing-lia-cover-v2.png',
      'digital-drawing-lia-cover.png',
      'forest-elder.png',
      'shattering.png',
    ]),
    order: 4,
  },
  {
    id: 'the-studio-index',
    slug: 'the-studio-index',
    title: 'The Studio Index',
    legacyCategory: 'design',
    summary: DESIGN_FOLDER_CAPTIONS['The Studio Index'],
    media: publicMediaPaths('design', 'the-studio-index', [
      'the-studio-index-archive-light.png',
      'the-studio-index-journal-light.png',
      'the-studio-index-about-dark.png',
    ]),
    order: 5,
  },
  {
    id: 'fluttering-kindness',
    slug: 'fluttering-kindness',
    title: 'Fluttering Kindness',
    legacyCategory: 'design',
    summary: DESIGN_FOLDER_CAPTIONS['Fluttering Kindness'],
    media: FLUTTERING_KINDNESS_ITEMS,
    order: 6,
  },
  {
    id: 'goniometrix',
    slug: 'goniometrix',
    title: 'Goniometrix',
    legacyCategory: 'technicals',
    summary: TECHNICALS_FOLDER_CAPTIONS.Goniometrix,
    media: GONIOMETRIX_ITEMS,
    order: 0,
  },
  {
    id: 'kinetic-origamic',
    slug: 'kinetic-origamic',
    title: 'Kinetic Origamic',
    legacyCategory: 'technicals',
    summary: TECHNICALS_FOLDER_CAPTIONS['Kinetic Origamic'],
    media: KINETIC_ORIGAMIC_ITEMS,
    order: 1,
  },
  {
    id: 'gear-system',
    slug: 'gear-system',
    title: 'Gear System',
    legacyCategory: 'technicals',
    summary: TECHNICALS_FOLDER_CAPTIONS['Gear System'],
    media: GEAR_SYSTEM_ITEMS,
    order: 2,
  },
  {
    id: 'water-automata',
    slug: 'water-automata',
    title: 'Water Automata',
    legacyCategory: 'technicals',
    summary: TECHNICALS_FOLDER_CAPTIONS['Water Automata'],
    media: WATER_AUTOMATA_ITEMS,
    order: 3,
  },
  ...PHOTO_PROJECT_DEFINITIONS.map(({ files, ...project }, order) => {
    const media = publicMediaPaths('photos', project.slug, files)
    return {
      ...project,
      legacyCategory: 'photos',
      media,
      order,
    }
  }),
]

export const PROJECT_CATEGORIES = CATEGORY_DEFINITIONS.map((category) => ({ ...category }))

export const PROJECTS = RAW_PROJECTS.map((project) => ({
  ...project,
  route: buildProjectPath(project.legacyCategory, project.slug),
  thumbnail: mediaThumbnail(project.media),
}))

export const JASCIELLE_PHOTOGRAPHY_URL = PHOTOGRAPHY_SITE_URL

export function getProjectsByLegacyCategory(category) {
  return PROJECTS.filter((project) => project.legacyCategory === category).sort(
    (a, b) => a.order - b.order,
  )
}

export function getProjectByLegacyCategoryAndSlug(category, slug) {
  if (!slug) return null
  return (
    PROJECTS.find(
      (project) => project.legacyCategory === category && project.slug === slug,
    ) || null
  )
}

export function getProjectByLegacyCategoryAndTitle(category, title) {
  if (!title) return null
  return (
    PROJECTS.find(
      (project) => project.legacyCategory === category && project.title === title,
    ) || null
  )
}
