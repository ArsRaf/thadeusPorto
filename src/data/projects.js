// Order drives the reel, the chapters and the next-feature sequence.
// Animation leads: Escape from Detention is the flagship project.
export const CATEGORIES = ['Animation', 'Shorts', 'VFX', 'Modelling', 'Art']

export const projects = [
  // ── Shorts ───────────────────────────────────────────────
  {
    id: 'escape-detention',
    title: 'Escape from Detention',
    category: 'Animation',
    year: '2026',
    description: 'A solo-built cinematic anime sequence — 1,600 frames, four environments, a custom Fresnel toon shader across 985 materials, and a 10-machine distributed render. Self-directed end-to-end in 10 weeks.',
    tools: ['Blender', 'Substance', 'After Effects', 'Premiere Pro'],
    featured: false,
    accent: '#f5c518',
    colorBg: '#1a1600',
    detailLayout: 'playbill',
    goals: [
      'To carry a single character project through every stage of the pipeline independently — concept, modelling, rigging, shading, environment integration, animation, VFX, rendering and post-production — with no team to hand work off to.',
    ],
    strategy: [
      'Built the main character from a base established in a Studio Spooky Graphics course, then pushed the design through the "friction of opposites" — mashing two polar-opposite concepts (Sun Wukong and the shojo magic-girl trope, Japanese 80s delinquents and youkai exorcists) into one silhouette, with a ghost companion as the antagonist’s foil.',
      'Custom shader work bypassed conventional lighting complexity: the scene is lit with a single key light and a one-colour HDRI, with the shader carrying the rest of the look.',
      'The explosion effect runs off a single armature — one controller drives every ring, puff, streak and splash in precise time — with 350 star instances driven by a Hair-type particle system repurposed for sparks. The visual complexity comes from a hand-painted texture animating over simple sculpted geometry rather than modelled detail.',
    ],
    results: [
      'Delivered a complete animated sequence with a fully rigged and shaded hero character, ghost companion, spear and monster, integrated into classroom and town environments.',
    ],
    credits: [
      'Classroom environment — "Streets of Japan" era classroom asset purchased on CGTrader from RafaelRodrigues, with shaders and textures re-authored for this project.',
      'Town environment — "Streets of Japan 3D model" by Mostafa Ebrahim Fathallah, purchased on CGTrader.',
    ],
    preview: [
      '/assets/wakaba-x06.jpg',
      '/assets/ed-town-shot.jpg',
      '/assets/ed-explosion-final.jpg',
      '/assets/ed-keyframe.jpg',
      '/assets/wakaba-x01.jpg',
      '/assets/ed-classroom.jpg',
    ],
    stats: [
      { v: '1,600', l: 'Frames Rendered' },
      { v: '985',   l: 'Toon Materials' },
      { v: '79K',   l: 'Keyframes Cleaned' },
      { v: '561',   l: 'Town Objects' },
      { v: '10',    l: 'Machine Render Farm' },
      { v: '1',     l: 'Director' },
    ],
    stats: [
      { v: '1,600', l: 'Frames Rendered' },
      { v: '985',   l: 'Toon Materials' },
      { v: '79K',   l: 'Keyframes Cleaned' },
      { v: '561',   l: 'Town Objects' },
      { v: '10',    l: 'Machine Render Farm' },
      { v: '4',     l: 'Environments' },
      { v: '350',   l: 'Spark Instances' },
      { v: '10',    l: 'Week Schedule' },
      { v: '1',     l: 'Director' },
    ],
    media: [
      { type: 'video', src: '/assets/escape-detention.mp4', label: 'Final Render' , poster: '/assets/posters/escape-detention.jpg' },

      { chapter: 'Concept & Reference', note: 'Where the idea came from — the character, the staff, the town, and the score.' },
      { type: 'image', src: '/assets/ed-char-illus.jpg', label: 'Character Illustration', shape: 'port' , note: 'Two opposite ideas mashed into one silhouette: a shojo magic girl and a Japanese 80s delinquent.' },
      { type: 'image', src: '/assets/ed-staff-ref.jpg', label: 'Staff — Reference', shape: 'wide' , note: 'The shakujo — a ringed monk staff — chosen so the antagonist reads as an exorcist.' },
      { type: 'image', src: '/assets/ed-town-ref.jpg', label: 'Town — Reference', shape: 'wide' , note: 'Reference for the streets the character escapes into.' },
      { type: 'image', src: '/assets/ed-ost-ref.jpg', label: 'Score — Reference', shape: 'band' , note: 'The track the cut was timed against.' },

      { chapter: 'Modelling', note: 'T-pose, topology, and the shakujo staff — built from scratch.' },
      { type: 'image', src: '/assets/ed-turn-textured.jpg', label: 'Turnaround — Textured', shape: 'port' , note: 'Final turnaround with the toon shader applied.' },
      { type: 'image', src: '/assets/ed-turn-clay.jpg', label: 'Turnaround — Clay', shape: 'port' , note: 'The same pose untextured — silhouette and topology checked before any colour.' },
      { type: 'image', src: '/assets/ed-char-tpose.jpg', label: 'Character — T-Pose', shape: 'port' },
      { type: 'image', src: '/assets/ed-staff-blender.jpg', label: 'Staff — Blender', shape: 'tall' , note: 'Full-length staff model in the viewport.' },
      { type: 'image', src: '/assets/ed-staff-model.jpg', label: 'Staff — Model', shape: 'tall' },
      { type: 'image', src: '/assets/ed-staff-detail.jpg', label: 'Staff — Ofuda Detail', shape: 'port' , note: 'Ofuda talismans modelled as separate geometry so they swing on their own.' },
      { chapter: 'Topology', note: 'Under the shading — the polygon structure the whole character is built on.' },
      { type: 'image', src: '/assets/ed-poly-01.jpg', label: 'Poly Structure 01', shape: 'half' },
      { type: 'image', src: '/assets/ed-poly-02.jpg', label: 'Poly Structure 02', shape: 'third' },
      { type: 'image', src: '/assets/ed-poly-03.jpg', label: 'Poly Structure 03', shape: 'tall' },
      { type: 'image', src: '/assets/wakaba-thumb.jpg', label: 'Hero Pose', shape: 'hero' , note: 'Hero pose used for the key art.' },
      { type: 'image', src: '/assets/wakaba-a.jpg', label: 'Wireframe — Head', shape: 'third' },
      { type: 'image', src: '/assets/wakaba-b.jpg', label: 'Wireframe — Body', shape: 'third' },
      { type: 'image', src: '/assets/wakaba-c.jpg', label: 'Wireframe — Detail', shape: 'third' },
      { type: 'image', src: '/assets/wakaba-d.jpg', label: 'Wireframe — Pass 04', shape: 'half' },
      { type: 'image', src: '/assets/wakaba-e.jpg', label: 'Wireframe — Pass 05', shape: 'half' },

      { chapter: 'Supporting Cast', note: 'The ghost companion and the monster, each modelled and shaded from scratch.' },
      { type: 'image', src: '/assets/ed-ghost-01.jpg', label: 'Ghost — Design', shape: 'port' , note: 'A person who exorcises monsters ought to have a creepy companion.' },
      { type: 'image', src: '/assets/ed-ghost-02.jpg', label: 'Ghost — Render', shape: 'third' },
      { type: 'image', src: '/assets/ed-ghost-poly.jpg', label: 'Ghost — Poly Structure', shape: 'tall' , note: 'Kept deliberately low-poly — the ghost reads by shape, not detail.' },
      { type: 'image', src: '/assets/ed-ghost-mesh.jpg', label: 'Ghost — Mesh', shape: 'half' },
      { type: 'image', src: '/assets/ed-monster.jpg', label: 'Monster — Design', shape: 'port' , note: 'The antagonist of the second act.' },
      { type: 'image', src: '/assets/ed-monster-poly.jpg', label: 'Monster — Poly Structure', shape: 'half' },

      { chapter: 'Rigging & Shading', note: 'A custom Fresnel toon shader driving 985 materials.' },
      { type: 'image', src: '/assets/ed-shader-nodes.jpg', label: 'Toon Shader — Node Graph', shape: 'hero' , note: 'The custom Fresnel toon shader. A ColorRamp on a Fresnel node drives the terminator, which meant lighting the whole film with one key and a single-colour HDRI.' },
      { type: 'image', src: '/assets/ed-rig.jpg', label: 'Rig — Assets', shape: 'half' , note: 'Rig assets laid out for animation.' },
      { type: 'image', src: '/assets/ed-staff-rig.jpg', label: 'Staff — Armature', shape: 'tall' , note: 'The staff carries its own armature so it animates independently of the hand.' },
      { type: 'image', src: '/assets/ed-shaders.jpg', label: 'Shader Variants', shape: 'half' , note: 'Shader variants tested across the cast.' },
      { type: 'image', src: '/assets/ed-coloring.jpg', label: 'Colour Treatment', shape: 'half' },

      { chapter: 'Environment', note: 'Two worlds — the detention hall and the town beyond it.' },
      { type: 'image', src: '/assets/wakaba-x08.jpg', label: 'Town Blockout — 561 Objects', shape: 'hero' , note: '561 objects, each with a scheduled visibility window so the town loads in shot order.' },
      { type: 'image', src: '/assets/ed-town-wire.jpg', label: 'Town — Wireframe Layout', shape: 'half' , note: 'Layout wireframe of the same town.' },
      { type: 'image', src: '/assets/wakaba-x07.jpg', label: 'Classroom — Before Shading', shape: 'half' , note: 'The purchased classroom asset as it arrived.' },
      { type: 'image', src: '/assets/ed-classroom.jpg', label: 'Classroom — Lighting Pass', shape: 'half' , note: 'The same room after re-authoring the shaders and lighting.' },
      { chapter: 'In Camera', note: 'The same worlds once shader, lighting and character are all in place.' },
      { type: 'image', src: '/assets/wakaba-x06.jpg', label: 'Opening Shot — Detention', shape: 'hero' , note: 'The opening beat — detention, before anything goes wrong.' },
      { type: 'image', src: '/assets/ed-keyframe.jpg', label: 'Key Frame — Detention Beat', shape: 'half' },
      { type: 'image', src: '/assets/wakaba-x04.jpg', label: 'Town Environment', shape: 'half' },
      { type: 'image', src: '/assets/ed-town-shot.jpg', label: 'Character in Town', shape: 'half' },
      { type: 'image', src: '/assets/wakaba-x01.jpg', label: 'Character in Scene', shape: 'half' },

      { chapter: 'Visual Effects', note: 'One armature drives every ring, puff and streak of the explosion.' },
      { type: 'image', src: '/assets/ed-explosion-geo.jpg', label: 'Explosion — Geometry & Ideation', shape: 'hero' , note: 'A single armature parents every piece of the effect — move one controller and the whole assembly moves in time.' },
      { type: 'image', src: '/assets/wakaba-x02.jpg', label: 'Explosion Element — Ribbon', shape: 'third' , note: '350 star instances via a Hair particle system, repurposed for sparks.' },
      { type: 'image', src: '/assets/wakaba-x09.jpg', label: 'Explosion Element — Loop', shape: 'third' },
      { type: 'image', src: '/assets/ed-explosion-final.jpg', label: 'Explosion — Final Frame', shape: 'half' , note: 'The visual complexity comes from a hand-painted texture animating over simple sculpted geometry.' },
      { type: 'image', src: '/assets/wakaba-x03.jpg', label: 'Explosion — Composite', shape: 'half' },

      { chapter: 'Edit & Post', note: 'Cut, graded and scored across a 10-machine render farm.' },
      { type: 'image', src: '/assets/ed-edit.jpg', label: 'Edit — Sequence', shape: 'hero' , note: 'Cut, graded and scored in post.' },
      { type: 'image', src: '/assets/wakaba-x12.jpg', label: 'Edit & Sound Timeline', shape: 'half' },
      { type: 'image', src: '/assets/wakaba-stats.jpg', label: 'Production Stats', shape: 'half' , note: 'Final production tally.' },
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
    stats: [
      { v: '5',  l: 'Label Designs' },
      { v: '30s', l: 'Spot Length' },
      { v: '1',  l: 'Set Build' },
    ],
    preview: [
      '/assets/hotsauce-a.jpg',
      '/assets/hotsauce-e.jpg',
      '/assets/hotsauce-b.jpg',
    ],
    media: [
      { type: 'video', src: '/assets/HotSauceAd.mp4', label: 'Final Spot' , poster: '/assets/posters/HotSauceAd.jpg' },

      { chapter: 'Blockout', note: 'The set laid out in grey before any material work — camera, spacing and the fall of the hanging bars resolved first.' },
      { type: 'image', src: '/assets/hotsauce-c.jpg', label: 'Set Blockout', shape: 'hero',
        note: 'Bottles, banners and light bars placed as plain geometry to lock the composition.' },

      { chapter: 'Modelling', note: 'One bottle, five labels, and the chili that carries the product shots.' },
      { type: 'image', src: '/assets/hotsauce-d.jpg', label: 'Bottle Clay Renders', shape: 'hero',
        note: 'The five bottles untextured — silhouette and cap detail checked before the labels go on.' },
      { type: 'image', src: '/assets/hotsauce-f.jpg', label: 'Chili — Shaded', shape: 'half',
        note: 'Subsurface and specular tuned so the skin reads as waxy rather than plastic.' },
      { type: 'image', src: '/assets/hotsauce-g.jpg', label: 'Chili — Alternate Angle', shape: 'half' },
      { type: 'image', src: '/assets/hotsauce-h.jpg', label: 'Chili — Detail', shape: 'third' },

      { chapter: 'Look-Dev', note: 'Neon bars, coloured bounce, and the labels finally in place.' },
      { type: 'image', src: '/assets/hotsauce-e.jpg', label: 'Set — Lit & Shaded', shape: 'hero',
        note: 'The same blockout with materials and practical lighting — teal and orange rims doing the separation.' },

      { chapter: 'Final Frames', note: 'The delivered product renders.' },
      { type: 'image', src: '/assets/hotsauce-a.jpg', label: 'Hero Render — Full Range', shape: 'hero',
        note: 'All five labels in one frame, each lit by its own pool so the artwork stays legible.' },
      { type: 'image', src: '/assets/hotsauce-b.jpg', label: 'Product Shot', shape: 'port',
        note: 'Single-bottle shot for the brand page.' },
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
    stats: [
      { v: '2',  l: 'Hero Assets' },
      { v: '5',  l: 'Design Iterations' },
      { v: '02', l: 'Sibling Motif' },
    ],
    media: [
      { type: 'video', src: '/assets/cyberpunk-ship.mp4', label: 'Final Render — Ship' , poster: '/assets/posters/cyberpunk-ship.jpg' },

      { chapter: 'Ideation', note: 'Blimp + sci-fi = ??? — working out what the airship even is.' },
      { type: 'image', src: '/assets/blimp-e.jpg', label: 'First Sketch — Basic Function' },

      { chapter: 'Design & Blueprint', note: 'Techwear straps, a repurposed train gondola, and the "02" sibling motif.' },
      { type: 'image', src: '/assets/blimp-b.jpg', label: 'Annotated Blueprint — Side View' },
      { type: 'image', src: '/assets/blimp-d.jpg', label: 'Detail Drawing — Harness & Rotor' },

      { chapter: 'Concept Mockup', note: 'Painted to test the silhouette and night lighting before modelling.' },
      { type: 'image', src: '/assets/blimp-a.jpg', label: 'Painted Mock-up' },

      { chapter: 'Modelling', note: 'Hard-surface build — panelled hull, rigging lines, running lights.' },
      { type: 'image', src: '/assets/blimp-c.jpg', label: 'Clay Render — Finished Model' },
      { type: 'video', src: '/assets/blimp.mp4', label: 'Turntable' , poster: '/assets/posters/blimp.jpg' },
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
      { type: 'video', src: '/assets/fools-gold.mp4',        label: 'Final Render' , poster: '/assets/posters/fools-gold.jpg' },
      { type: 'video', src: '/assets/fools-gold-process.mp4',label: 'Process' , poster: '/assets/posters/fools-gold-process.jpg' },
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
      { type: 'video', src: '/assets/star-dunes.mp4',         label: 'Final Render' , poster: '/assets/posters/star-dunes.jpg' },
      { type: 'video', src: '/assets/star-dunes-process.mp4', label: 'Process' , poster: '/assets/posters/star-dunes-process.jpg' },
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
      { type: 'video', src: '/assets/moonlace.mp4',         label: 'Final Render' , poster: '/assets/posters/moonlace.jpg' },
      { type: 'video', src: '/assets/moonlace-process.mp4', label: 'Process' , poster: '/assets/posters/moonlace-process.jpg' },
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
    stats: [
      { v: '20s', l: 'Sequence Length' },
      { v: '1280x720', l: 'Delivery Format' },
    ],
    media: [
      { type: 'video', src: '/assets/camera-tracking.mp4', label: 'Shot' , poster: '/assets/posters/camera-tracking.jpg' },
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
    stats: [
      { v: '10', l: 'Render Passes' },
      { v: '2', l: 'Character Studies' },
      { v: '4K', l: 'Render Resolution' },
    ],
    media: [
      { type: 'image', src: '/assets/realistic-01.png', label: 'Hero Render' },
      { type: 'image', src: '/assets/realistic-a.png', label: 'Character Study 01' },
      { type: 'image', src: '/assets/realistic-b.png', label: 'Character Study 02' },
      { type: 'image', src: '/assets/realistic-c.png', label: 'Character Study 03' },
      { type: 'image', src: '/assets/realistic-d.png', label: 'Character Study 04' },
    ],
    strategy: [
      'Developed two separate node networks: a house generator that assembles parametric building forms, and a terrain generator producing varied landscape views from the same graph.',
    ],
    results: [
      'Both generators deliver multiple distinct outputs from a single network, with the terrain system producing a range of landscape views by parameter change alone.',
    ],
    stats: [
      { v: '2', l: 'Node Networks' },
      { v: '5', l: 'Terrain Variations' },
      { v: '1', l: 'Parametric House System' },
    ],
    media: [
      { type: 'image', src: '/assets/procedural-thumb.jpg', label: 'House Generator' },
      { type: 'image', src: '/assets/procedural-a.jpg',     label: 'Terrain — View 01' },
      { type: 'image', src: '/assets/procedural-b.jpg',     label: 'Terrain — View 02' },
      { type: 'image', src: '/assets/procedural-c.jpg',     label: 'Terrain — View 03' },
      { type: 'image', src: '/assets/procedural-d.jpg',     label: 'Terrain — View 04' },
      { type: 'image', src: '/assets/procedural-e.jpg', label: 'Terrain — View 05' },
    ],
  },

  // ── Art ──────────────────────────────────────────────────
  // (empty for now — no real projects assigned yet)
  {
    id: 'procedural-modelling',
    title: 'Procedural Modelling',
    category: 'Modelling',
    year: '2026',
    description: 'Two node-based generators built in Houdini — a parametric house system and a terrain generator — where the network, not the mesh, is the deliverable.',
    tools: ['Houdini'],
    featured: false,
    accent: '#d4af37',
    colorBg: '#141110',
    client: 'Self-Initiated Project',
    turnaround: 'Ongoing',
    stats: [
      { v: '2', l: 'Node Networks' },
      { v: '5', l: 'Terrain Variations' },
      { v: '1', l: 'Parametric House System' },
    ],
    goals: [
      'To build reusable procedural systems rather than one-off models — generators whose parameters can be driven to produce many variations from a single network.',
    ],
    strategy: [
      'Developed two separate node networks: a house generator that assembles parametric building forms, and a terrain generator producing varied landscape views from the same graph.',
    ],
    results: [
      'Both generators deliver multiple distinct outputs from a single network, with the terrain system producing a range of landscape views by parameter change alone.',
    ],
    media: [
      { type: 'image', src: '/assets/procedural-thumb.jpg', label: 'House Generator' },
      { type: 'image', src: '/assets/procedural-a.jpg', label: 'Terrain — View 01' },
      { type: 'image', src: '/assets/procedural-b.jpg', label: 'Terrain — View 02' },
      { type: 'image', src: '/assets/procedural-c.jpg', label: 'Terrain — View 03' },
      { type: 'image', src: '/assets/procedural-d.jpg', label: 'Terrain — View 04' },
      { type: 'image', src: '/assets/procedural-e.jpg', label: 'Terrain — View 05' },
    ],
  },
]
