export const CATEGORIES = ['Shorts', 'VFX', 'Animation', 'Modelling', 'Art']

export const projects = [
  // ── Shorts ───────────────────────────────────────────────
  {
    id: 'escape-detention',
    title: 'Escape from Detention',
    category: 'Shorts',
    year: '2026',
    description: 'A solo-built cinematic anime sequence — 1,600 frames, four environments, a custom Fresnel toon shader across 985 materials, and a 10-machine distributed render. Self-directed end-to-end in 10 weeks.',
    tools: ['Blender', 'After Effects', 'Premiere Pro'],
    featured: false,
    accent: '#f5c518',
    colorBg: '#1a1600',
    detailLayout: 'playbill',
    media: [
      { type: 'video', src: '/assets/escape-detention.mp4', label: 'Final Render' },
    ],
  },
  {
    id: 'hotsauce-ad',
    title: "Heldberg's Hot Sauce",
    category: 'Shorts',
    year: '2025',
    description: 'Commercial animation for Heldberg\'s Hot Sauce. Motion graphics and product visualization with punchy energy.',
    tools: ['Illustrator', 'Photoshop', 'Blender'],
    featured: false,
    accent: '#ff7a5a',
    colorBg: '#1d0f0e',
    client: 'Class-Initiated Project',
    turnaround: '6 Weeks',
    goals: [
      "To design and produce a stylised advertisement for an existing brand, translating its product identity into a visually distinctive motion piece using illustration, compositing, and 3D animation techniques.",
    ],
    strategy: [
      "Selected Heldbergs — a German board game brand with an unexpectedly quirky hot sauce line — as the subject, drawn to the humour and visual character of its packaging. Structured the ad in two tonal halves: an opening sequence inspired by the moody, stylised visual language of Peacemaker's \"Oh Lord\" title sequence, transitioning into a bright, saturated aesthetic reminiscent of retro Japanese TV product commercials to introduce each hot sauce product individually. Typography and 2D graphic elements were designed in Illustrator and Photoshop, while all 3D models, textures, and the final rendered sequence were built and animated in Blender, using plane-based motion graphics to drive transitions and on-screen elements.",
    ],
    results: [
      "Delivered a 33-second advertisement showcasing five-plus hot sauce products, blending a moody, stylised opening with a vibrant, retro-inspired product showcase. The final piece combined custom typography, 2D compositing, and fully rendered 3D animation into a cohesive brand narrative, successfully translating Heldbergs' quirky packaging identity into a distinctive motion graphics piece.",
    ],
    media: [
      { type: 'video', src: '/assets/HotSauceAd.mp4', label: 'Commercial' },
    ],
  },
  {
    id: 'cyberpunk-workshop',
    title: 'Cyberpunk Workshop',
    category: 'Shorts',
    year: '2025',
    description: 'Hard-surface modeling and look development of a retro-futurist vehicle and airship. Weathered metal, worn fabric, neon reflections.',
    tools: ['Blender', 'Substance Painter', 'Arnold'],
    featured: false,
    accent: '#a78bfa',
    colorBg: '#16121d',
    turnaround: '12 Weeks',
    goals: [
      "To model and rig a vehicle asset for a collaborative animation sequence, contributing to a production pipeline rendered in Arnold.",
    ],
    strategy: [
      "Led the modelling and rigging of the hero vehicle asset, building a clean, production-ready mesh and functional rig, while also contributing to texturing and lighting/rendering the final sequence.",
    ],
    results: [
      "Delivered a fully modelled and rigged vehicle asset, with additional contributions to texturing and lighting, completing 1 of 12 segments in the group's final rendered animation sequence.",
    ],
    media: [
      { type: 'video', src: '/assets/cyberpunk-ship.mp4', label: 'Ship' },
      { type: 'video', src: '/assets/blimp.mp4',          label: 'Blimp Model' },
    ],
  },

  // ── VFX ──────────────────────────────────────────────────
  {
    id: 'fools-gold',
    title: "Fool's Gold",
    category: 'VFX',
    year: '2024',
    description: 'Procedural animation study exploring alchemical transformation through particle systems and fluid dynamics. Gold emerges from noise.',
    tools: ['Houdini', 'Redshift'],
    featured: true,
    accent: '#ffb3ad',
    colorBg: '#1d100f',
    client: 'Class-Initiated Project',
    turnaround: '3 Weeks',
    goals: [
      "To visualise the movement and behaviour of a physical object or material through dynamics and simulation, applying procedural, node-based workflows to produce a 20–30 second showcase animation.",
    ],
    strategy: [
      "Designed a rigid body dynamics and pyro simulation sequence in Houdini, where a gold coin is tossed from a pile of dispersing smoke, flips through the air trailing a stream of particles, then falls and fractures using a Voronoi fracture setup with glue constraints. On impact, the fracture and a secondary smoke burst were triggered using an impact-based VEX wrangle, dispersing the surrounding smoke source. The pyro simulation itself used a sparse pyro solver with volume sourcing and gas disturbance to create natural, turbulent cloud movement, while the non-destructive node-based workflow allowed the timing, motion, and destruction to be refined iteratively throughout production.",
    ],
    results: [
      "Delivered a full 20-second showcase video depicting a gold coin tossed from a dispersing pile of smoke, trailing particles through the air before falling and fracturing on impact. The rigid body fracture and pyro simulation combined to create a dynamic, physically-driven sequence, successfully meeting the assessment's technical and creative requirements for procedural simulation.",
    ],
    caseStudy: {
      role: 'Technical Artist',
      duration: '3 weeks',
      overview: 'A self-directed study in procedural motion — gold materialising from noise fields using Houdini VEX wrangles and Redshift volume rendering.',
      acts: [
        { label: 'Act I — Concept', body: 'Starting from a simple question: can transformation feel inevitable? The particle system was seeded with Perlin noise and grown outward using point-attract forces.' },
        { label: 'Act II — Execution', body: 'Each grain of gold required custom shader work in Redshift — metallic roughness mapped to velocity magnitude, giving faster particles a brighter sheen.' },
        { label: 'Act III — Finishing', body: 'Composited in After Effects with film grain, chromatic aberration, and a warm colour grade to push the alchemical mood.' },
      ],
    },
    media: [
      { type: 'video', src: '/assets/fools-gold.mp4',        label: 'Final Render' },
      { type: 'video', src: '/assets/fools-gold-process.mp4',label: 'Process' },
      { type: 'image', src: '/assets/fools-gold-thumb.png',  label: 'Still' },
      { type: 'image', src: '/assets/fools-gold-thumb2.png', label: 'Still 02' },
    ],
  },
  {
    id: 'star-dunes',
    title: 'Star Dunes',
    category: 'VFX',
    year: '2024',
    description: 'Generative terrain sculpted by wind simulations. Dunes that shift with the logic of real desert systems — slow, inevitable, infinite.',
    tools: ['Houdini', 'Karma'],
    featured: false,
    accent: '#87d0f6',
    colorBg: '#171a26',
    client: 'Class-Initiated Project',
    turnaround: '3 Weeks',
    goals: [
      "This project explores procedural and fractal-based approaches to visualising natural growth and structural phenomena, using node-based, non-destructive workflows to translate complex, organic behaviours into a short 3D showcase sequence.",
    ],
    strategy: [
      "Built a particle-based simulation in Houdini to visualise a sand-like cluster of points, using a POP network driven by noise and turbulence forces to create organic, swirling motion across the cluster's surface. Point attributes were used to control colour variation and density, giving the final form a star- or nebula-like appearance, while the non-destructive node-based workflow allowed for iterative refinement of the particle behaviour and shading throughout production.",
    ],
    results: [
      "Delivered a full 10 second showcase video presenting a star-like particle cluster, achieved through a noise and turbulence-driven simulation in Houdini. The final piece successfully translated a complex, organic phenomenon into a cohesive procedural sequence, meeting all technical and creative requirements of the assessment.",
    ],
    media: [
      { type: 'video', src: '/assets/star-dunes.mp4',         label: 'Final Render' },
      { type: 'video', src: '/assets/star-dunes-process.mp4', label: 'Process' },
      { type: 'image', src: '/assets/star-dunes-thumb.png',   label: 'Still' },
      { type: 'image', src: '/assets/star-dunes-thumb2.png',  label: 'Still 02' },
    ],
  },
  {
    id: 'moonlace',
    title: 'Moonlace Butterfly',
    category: 'VFX',
    year: '2024',
    description: 'Procedural creature animation with organic wing geometry. A study in natural rhythm and the mathematics of flight.',
    tools: ['Houdini', 'Redshift', 'After Effects'],
    featured: false,
    accent: '#e9c349',
    colorBg: '#1a1418',
    client: 'Class-Initiated Project',
    turnaround: '3 Weeks',
    goals: [
      "To create a piece of generative animated art through procedural modelling and animation techniques, visualising an abstract or figurative concept in a 10–20 second broadcast-style sequence.",
    ],
    strategy: [
      "Designed a generative animation sequence in Houdini depicting a \"magical butterfly\" landing on an arm and triggering a procedural transformation, revealing an entirely new arm beneath. Two separate arm models were built using distinct procedural node networks, with the transformation driven by a Pyro Spread solver that propagated outward from the butterfly's landing point across the arm's surface, converting the original arm into the revealed one. The butterfly's flight path and landing were choreographed to trigger the transformation event, while the non-destructive, node-based workflow allowed the reveal pattern, timing, and visual styling to be refined iteratively throughout production.",
    ],
    results: [
      "Delivered a 16-second generative animation showcasing a butterfly-triggered transformation, where a Pyro Spread-driven reveal seamlessly transitioned one procedurally modelled arm into another. The sequence successfully translated an abstract, figurative concept into a polished, broadcast-style visual, meeting the assessment's technical and creative requirements for generative animated art.",
    ],
    media: [
      { type: 'video', src: '/assets/moonlace.mp4',         label: 'Final Render' },
      { type: 'video', src: '/assets/moonlace-process.mp4', label: 'Process' },
      { type: 'image', src: '/assets/moonlace-thumb.png',   label: 'Still' },
    ],
  },
  {
    id: 'camera-tracking',
    title: 'Camera Tracking',
    category: 'VFX',
    year: '2025',
    description: 'Live-action VFX shot with precision camera solve and seamless CG integration. Reality extended without seam.',
    tools: ['Maya', 'After Effects'],
    featured: false,
    accent: '#7be0b8',
    colorBg: '#101a18',
    client: 'Class-Initiated Project',
    turnaround: '3 Weeks',
    goals: [
      "To integrate photorealistic 3D elements into a live-action cinematic shot, expanding an ancient temple environment through advanced lighting, shading, and compositing to achieve seamless VFX integration.",
    ],
    strategy: [
      "Took a pre-modelled and pre-animated 3D scene of two warriors sheltering in an ancient temple and built out the full surrounding environment and atmosphere to expand it into a believable abandoned temple exterior and interior. Applied camera/motion tracking in Maya to align the 3D elements accurately with the live-action plate, then lit the scene to match the lighting conditions, colour, and mood of the live footage for a photorealistic result. Rendered the sequence in passes to allow for greater control over the final look, then composited the CG and live-action elements together in After Effects to achieve a seamless integration between the two.",
    ],
    results: [
      "Delivered a full 20-second VFX sequence at 1280x720, seamlessly integrating the pre-animated 3D warrior characters into a live-action ancient temple setting. Motion tracking, matched lighting, and multi-pass compositing in After Effects came together to achieve a photorealistic result, successfully blending the CG environment and live-action plate into a cohesive cinematic shot.",
    ],
    media: [
      { type: 'video', src: '/assets/camera-tracking.mp4', label: 'Shot' },
    ],
  },

  // ── Animation ────────────────────────────────────────────
  // (empty for now — Animation projects not yet compiled)

  // ── Modelling ────────────────────────────────────────────
  {
    id: 'realistic-render',
    title: 'Realistic Render',
    category: 'Modelling',
    year: '2024',
    description: 'Photo-realistic 3D render pushing the limits of material and lighting simulation. The boundary between photograph and render dissolves.',
    tools: ['Blender', 'Cycles', 'Photoshop'],
    featured: false,
    accent: '#d4af37',
    colorBg: '#151412',
    media: [
      { type: 'image', src: '/assets/realistic-01.png', label: 'Thumbnail' },
      { type: 'image', src: '/assets/realistic-a.png',  label: 'Render 01' },
      { type: 'image', src: '/assets/realistic-b.png',  label: 'Render 02' },
      { type: 'image', src: '/assets/realistic-c.png',  label: 'Render 03' },
      { type: 'image', src: '/assets/realistic-d.png',  label: 'Render 04' },
    ],
  },
  {
    id: 'cyberpunk-blimp',
    title: 'Cyberpunk Blimp',
    category: 'Modelling',
    year: '',
    description: 'Coming soon.',
    tools: [],
    featured: false,
    accent: '#d4af37',
    colorBg: '#141110',
    media: [],
  },
  {
    id: 'ponta',
    title: 'Ponta',
    category: 'Modelling',
    year: '',
    description: 'Coming soon.',
    tools: [],
    featured: false,
    accent: '#d4af37',
    colorBg: '#141110',
    media: [],
  },
  {
    id: 'wakaba',
    title: 'Wakaba',
    category: 'Modelling',
    year: '',
    description: 'Coming soon.',
    tools: [],
    featured: false,
    accent: '#d4af37',
    colorBg: '#141110',
    media: [],
  },
  {
    id: 'rendering-02',
    title: '02 Rendering',
    category: 'Modelling',
    year: '2024',
    description: 'A stylised-realistic human character study, built to develop foundational character modelling and hair grooming skills.',
    tools: ['Daz 3D', 'Blender'],
    featured: false,
    accent: '#d4af37',
    colorBg: '#141110',
    client: 'Self-Initiated Project',
    turnaround: '1 Week',
    goals: [
      "To learn and apply stylised-realistic human character modelling techniques, and to develop proficiency in hair simulation and grooming within a 3D pipeline.",
    ],
    strategy: [
      "Undertook self-directed study into character modelling and hair simulation workflows, combining Daz 3D and Blender to build foundational skills in sculpting stylised-realistic human anatomy and grooming hair systems. Applied this research to model, texture, and shade a stylised-realistic human character, then used Blender's particle hair system to groom and simulate a styled hairdo suited to the character.",
    ],
    results: [
      "Produced a fully modelled and textured stylised-realistic human character, complete with a Blender particle-based hair system styled and simulated to complement the character's design — successfully building foundational skills in character modelling and hair grooming for future production work.",
    ],
    media: [
      { type: 'image', src: '/assets/rendering-02-thumb.png', label: 'Thumbnail' },
      { type: 'image', src: '/assets/rendering-02-a.png',     label: 'Render 01' },
      { type: 'image', src: '/assets/rendering-02-b.png',     label: 'Render 02' },
      { type: 'image', src: '/assets/rendering-02-c.png',     label: 'Render 03' },
      { type: 'image', src: '/assets/rendering-02-d.png',     label: 'Render 04' },
    ],
  },

  // ── Art ──────────────────────────────────────────────────
  // (empty for now — no real projects assigned yet)
]
