const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ring = document.getElementById('ring');
const ringCenter = document.getElementById('ringCenter');
const heroStage = document.getElementById('heroStage');
const heroEl = document.getElementById('home');
const heroCopy = heroEl ? heroEl.querySelector('.hero-copy') : null;
const blackVeil = document.getElementById('blackVeil');
const ringCanvas = document.getElementById('ring-canvas');
const rCtx = ringCanvas ? ringCanvas.getContext('2d', { alpha: true }) : null;

const cols = ['#ff4a1c','#ffd08a','#2fe0b0','#a78bfa','#ffffff'];
const streakCols = ['#2fe0b0','#ffd08a','#e879f9','#ff6a1a','#67e8f9','#fde047'];

// Deterministic pseudo-random helper
const hash = n => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

// Pre-render soft bokeh sprites offscreen once
const BOKEH_SPRITES = streakCols.map(color => {
  const off = document.createElement('canvas');
  off.width = off.height = 64;
  const c = off.getContext('2d');
  const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, color);
  g.addColorStop(0.45, color + '66');
  g.addColorStop(1, color + '00');
  c.fillStyle = g;
  c.fillRect(0, 0, 64, 64);
  return off;
});

// 120 crisp non-glowing target ring ticks
const RING_TICKS = Array.from({ length: 120 }, (_, i) => ({
  angle: (i * 3 * Math.PI) / 180,
  r2: 150 + 14 + ((i * 37) % 26),
  color: cols[i % 5]
}));

// Group streaks by color index for batched canvas drawing (12 draw calls instead of 300)
const STREAKS_BY_COLOR = streakCols.map(() => []);
for (let i = 0; i < 144; i++) {
  const colorIdx = Math.floor(hash(i * 6.83 + 31) * streakCols.length);
  STREAKS_BY_COLOR[colorIdx].push({
    cos: Math.cos(hash(i * 1.37 + 2) * Math.PI * 2),
    sin: Math.sin(hash(i * 1.37 + 2) * Math.PI * 2),
    offset: hash(i * 2.13 + 7),
    speed: 0.7 + hash(i * 3.17 + 11) * 0.85,
    lenScale: 0.55 + hash(i * 5.71 + 23) * 0.85
  });
}

const BOKEH_ORBS = Array.from({ length: 26 }, (_, i) => ({
  cos: Math.cos(hash(i * 1.91 + 41) * Math.PI * 2),
  sin: Math.sin(hash(i * 1.91 + 41) * Math.PI * 2),
  offset: hash(i * 2.71 + 53),
  size: 32 + hash(i * 3.89 + 67) * 68,
  colorIdx: Math.floor(hash(i * 4.61 + 79) * streakCols.length)
}));

ring.innerHTML = `<g id="rg">${RING_TICKS.map(tk =>
  `<line x1="${Math.cos(tk.angle)*150}" y1="${Math.sin(tk.angle)*150}" x2="${Math.cos(tk.angle)*tk.r2}" y2="${Math.sin(tk.angle)*tk.r2}" stroke="${tk.color}" stroke-width="2.5" stroke-linecap="round"/>`
).join('')}</g>`;

// Tablet showcase: bento dashboard summarizing the 10 researched clinical AI systems.
const CAT = {imaging:'#ff4a1c', heart:'#2fe0b0', screening:'#ffd08a', workflow:'#a78bfa'};
const order = ['imaging','imaging','imaging','heart','heart','heart','screening','screening','screening','workflow'];
const seg = order.map(c => `<i style="background:${CAT[c]}"></i>`).join('');
let ticks = '';
for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180, r2 = 62 + 10 + (i * 29 % 18);
  ticks += `<line x1="${Math.cos(a)*62}" y1="${Math.sin(a)*62}" x2="${Math.cos(a)*r2}" y2="${Math.sin(a)*r2}" stroke="${CAT[order[Math.floor(i/6)]]}" stroke-width="2.5" stroke-linecap="round"/>`; }
const legend = [['Imaging',3,'imaging'],['Heart',3,'heart'],['Screening',3,'screening'],['Assistant',1,'workflow']].map(([n,c,k]) => `<span><i style="background:${CAT[k]}"></i>${n} ${c}</span>`).join('');
const card = (cls, inner, img = '') => `<div class="bc ${cls}"${img ? ` style="--img:url('${img}')"` : ''}>${inner}</div>`;
const SYSTEM_CARDS = [
  { name: 'Aidoc', mark: 'AI', desc: 'Flags urgent strokes and brain bleeds on CT scans for faster triage.', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.aidoc.com&size=256' },
  { name: 'Lunit', mark: 'LU', desc: 'Highlights suspicious lung nodules and breast lesions on X-rays.', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.lunit.io&size=256' },
  { name: 'Gleamer', mark: 'GL', desc: 'Detects subtle bone fractures and joint injuries on radiographs.', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.gleamer.ai&size=256' },
  { name: 'Eko SENSORA', mark: 'EK', desc: 'Screens heart sounds for murmurs and AFib during routine exams.', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.ekohealth.com&size=256' },
  { name: 'Heartflow', mark: 'HF', desc: 'Builds a 3D model of coronary arteries from standard heart CT scans.', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.heartflow.com&size=256' },
  { name: 'Ultromics EchoGo', mark: 'UL', desc: 'Analyzes ultrasound heart videos to catch early heart failure signs.', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.ultromics.com&size=256' },
  { name: 'LumineticsCore', mark: 'LC', desc: 'Checks retinal photos for early signs of diabetic eye disease.', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.digitaldiagnostics.com&size=256' },
  { name: 'Skin Analytics DERM', mark: 'SA', desc: 'Evaluates dermoscopic skin photos to help flag possible melanoma.', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://skin-analytics.com&size=256' },
  { name: 'Ibex', mark: 'IB', desc: 'Assists pathologists in spotting prostate and breast cancer in biopsies.', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ibex-ai.com&size=256' },
  { name: 'Abridge', mark: 'AB', desc: 'Turns doctor-patient conversations into organized clinical notes.', logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.abridge.com&size=256' }
];

// Populate AI Health Hub Collage (Larger Cards, Strict Superpower-Style Scatter)
const HUB_LAYOUT = [
  // Top-left large tilted orange card
  { x: '17%', y: '17%', w: 228, h: 192, rot: '-12deg', dx: '-34vw', dy: '-28vh', spin: '-20deg', theme: 't-orange' },
  // Upper-left medium light card
  { x: '35%', y: '24%', w: 132, h: 152, rot: '6deg',   dx: '-14vw', dy: '-34vh', spin: '15deg',  theme: 't-light'  },
  // Top-center bleeding orange card
  { x: '50%', y: '6%',  w: 174, h: 210, rot: '-2deg',  dx: '0vw',   dy: '-38vh', spin: '-10deg', theme: 't-orange' },
  // Top-right wide tilted dark card
  { x: '82%', y: '18%', w: 276, h: 186, rot: '11deg',  dx: '36vw',  dy: '-30vh', spin: '22deg',  theme: 't-dark'   },
  // Mid-left vertical dark card
  { x: '10%', y: '53%', w: 146, h: 188, rot: '5deg',   dx: '-40vw', dy: '2vh',   spin: '-16deg', theme: 't-dark'   },
  // Mid-right vertical mint card
  { x: '89%', y: '54%', w: 152, h: 196, rot: '-6deg',  dx: '40vw',  dy: '4vh',   spin: '18deg',  theme: 't-mint'   },
  // Bottom-left edge-bleeding light card
  { x: '18%', y: '93%', w: 224, h: 168, rot: '10deg',  dx: '-32vw', dy: '34vh',  spin: '20deg',  theme: 't-light'  },
  // Bottom-center-left compact light card
  { x: '41%', y: '88%', w: 134, h: 142, rot: '-7deg',  dx: '-8vw',  dy: '36vh',  spin: '-14deg', theme: 't-light'  },
  // Bottom-center-right medium dark card
  { x: '64%', y: '87%', w: 128, h: 128, rot: '8deg',   dx: '14vw',  dy: '34vh',  spin: '16deg',  theme: 't-dark'   },
  // Bottom-right edge-bleeding orange card
  { x: '82%', y: '92%', w: 208, h: 184, rot: '-11deg', dx: '34vw',  dy: '32vh',  spin: '-22deg', theme: 't-orange' }
];

const hubField = document.getElementById('hubField');
if (hubField) {
  hubField.innerHTML = SYSTEM_CARDS.map((sys, i) => {
    const pos = HUB_LAYOUT[i];
    return `
      <a class="hub-node ${pos.theme}" href="#ai-tools"
         style="--x:${pos.x};--y:${pos.y};--w:${pos.w}px;--h:${pos.h}px;--rot:${pos.rot};--dx:${pos.dx};--dy:${pos.dy};--spin:${pos.spin}">
        <div class="hub-card">
          <div class="hub-logo">
            <img src="${sys.logo}" alt="${sys.name} logo" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
            <span>${sys.mark}</span>
          </div>
          <p class="hub-desc">${sys.desc}</p>
        </div>
        <span class="hub-caption">${sys.name}</span>
      </a>
    `;
  }).join('');
}

const LITERACY_TOPICS = [
  {
    id: 'oversight',
    label: 'Human oversight',
    tag: 'CC 100 R&D Guide · 10 Clinical AI Platforms',
    title: 'AI assists, doctors still decide',
    intro: 'None of the 10 AI tools in our study replace a doctor. Each system acts like a fast second pair of eyes that highlights patterns or organizes notes, while a licensed doctor checks every result before making a diagnosis.',
    metricName: 'Doctor verification',
    metricSub: 'Required before treatment',
    status: 'Always required',
    statusSub: '10 of 10 tools',
    markerPct: 90,
    listTitle: 'How doctors and AI work together in real clinics:',
    steps: [
      'Urgent scan alerts: Aidoc flags possible strokes on brain CT scans so radiologists review them faster.',
      'Cancer screening: Lunit and Ibex highlight suspicious spots on X-rays and tissue slides for specialists to confirm.',
      'Early checkups: LumineticsCore spots signs of diabetes eye damage and refers patients to an eye doctor.',
      'Visit notes: Abridge drafts medical notes from clinic talks, and the doctor reviews and edits them.'
    ],
    calloutTitle: 'Key takeaway for students and patients',
    calloutBody: 'AI helps medical teams work faster and stay organized, but humans always make the final medical call.',
    chartTitle: '4-Step Clinical Workflow (All 10 Systems)',
    chartBadge: 'Doctor signs off at Step 3',
    chartType: 'flow',
    bars: [
      { label: '1. Patient test', val: 'Input', h: 38 },
      { label: '2. AI flags', val: 'Assist', h: 62 },
      { label: '3. MD checks', val: 'Verify', h: 86 },
      { label: '4. Care plan', val: 'Decide', h: 100 }
    ]
  },
  {
    id: 'limitations',
    label: 'AI limitations',
    tag: 'CC 100 R&D Guide · Accuracy & Boundaries',
    title: 'Clinical AI is helpful, not perfect',
    intro: 'Every AI system in our research can make mistakes. Models can raise false alarms, miss rare conditions, or mishear words during a checkup, which is why doctors never rely on AI alone.',
    metricName: 'Independent accuracy',
    metricSub: 'Using AI without human review',
    status: 'Needs review',
    statusSub: 'Flagged in all 10 guides',
    markerPct: 62,
    listTitle: 'Common limits found across our 10 R&D profiles:',
    steps: [
      'False flags or missed signs: Imaging tools like Gleamer, Lunit, and Ibex can occasionally misread a scan or biopsy.',
      'Narrow focus: Tools like Eko SENSORA and LumineticsCore only check for specific conditions, not every disease.',
      'Speech errors: Abridge may mishear medical words during a visit, so doctors must proofread every note.',
      'Needs full context: Heartflow and Ultromics EchoGo must be combined with physical exams and other lab tests.'
    ],
    calloutTitle: 'Why AI cannot work alone',
    calloutBody: 'An AI score is only one clue. Doctors combine it with your health history and symptoms before deciding.',
    chartTitle: 'Common Limits Across the 10 Researched Tools',
    chartBadge: 'Out of 10 systems',
    chartType: 'bar',
    bars: [
      { label: 'Needs MD check', val: '10 / 10', h: 100 },
      { label: 'Can misread', val: '8 / 10', h: 80 },
      { label: 'Special gear', val: '7 / 10', h: 70 },
      { label: 'Specific group', val: '6 / 10', h: 60 }
    ]
  },
  {
    id: 'hardware',
    label: 'Input & hardware',
    tag: 'CC 100 R&D Guide · Data & Equipment',
    title: 'Good AI results need clear inputs',
    intro: 'Medical AI only works well when given sharp images, clean audio, and compatible hospital gear. Blurry scans or unsupported devices can lower accuracy or stop the tool from running.',
    metricName: 'Scan & device quality',
    metricSub: 'Needed for reliable AI output',
    status: 'Essential',
    statusSub: 'Hardware-dependent',
    markerPct: 78,
    listTitle: 'What each type of AI needs to work properly:',
    steps: [
      'Clear CT and X-ray scans: Heartflow and Aidoc need high-quality hospital scans to map arteries or spot strokes.',
      'Digital stethoscopes: Eko SENSORA only works when paired with compatible digital heart monitors.',
      'Sharp close-up photos: Skin Analytics DERM and LumineticsCore need clear skin or eye images to screen safely.',
      'Digital lab scanners: Ibex requires tissue biopsies to be digitized before AI can inspect the cells.'
    ],
    calloutTitle: 'Clear input, clearer insight',
    calloutBody: 'Even the smartest medical software cannot fix a blurry X-ray or a noisy stethoscope recording.',
    chartTitle: 'Primary Input Used by the 10 Systems',
    chartBadge: '10 platforms total',
    chartType: 'bar',
    bars: [
      { label: 'CT & X-ray scans', val: '4 tools', h: 92 },
      { label: 'Photos & slides', val: '3 tools', h: 70 },
      { label: 'Heart signals', val: '2 tools', h: 48 },
      { label: 'Visit audio', val: '1 tool', h: 26 }
    ]
  },
  {
    id: 'privacy',
    label: 'Scope & privacy',
    tag: 'CC 100 R&D Guide · Eligibility & Safety',
    title: 'Built for specific patients & strict privacy',
    intro: 'Clinical AI tools are tested for specific age groups, conditions, and clinic settings. Hospitals must also protect patient records and follow local health approvals before using them.',
    metricName: 'Patient privacy & eligibility',
    metricSub: 'Clinical safety standards',
    status: 'Protected',
    statusSub: 'Strict clinical rules',
    markerPct: 84,
    listTitle: 'Important safety rules from our 10 R&D guides:',
    steps: [
      'Specific patient groups: LumineticsCore is meant for adults aged 22+ with diabetes who have not been diagnosed yet.',
      'Targeted heart checks: Ultromics EchoGo and Heartflow focus on specific heart conditions rather than general checkups.',
      'Country approvals vary: Some tools from Lunit and Ibex are only cleared for clinical use in certain countries.',
      'Data security matters: Platforms like Abridge and Aidoc handle sensitive medical records that must stay private.'
    ],
    calloutTitle: 'How LAMBING stays safe',
    calloutBody: 'LAMBING is a student health literacy guide. It explains how these tools work without collecting personal medical data.',
    chartTitle: 'Where the 10 AI Systems Are Used',
    chartBadge: 'By care setting',
    chartType: 'bar',
    bars: [
      { label: 'Hospital imaging', val: '4 tools', h: 92 },
      { label: 'Heart clinics', val: '3 tools', h: 70 },
      { label: 'Routine screen', val: '2 tools', h: 48 },
      { label: 'Clinic visits', val: '1 tool', h: 26 }
    ]
  },
  {
    id: 'tech',
    label: 'Core AI tech',
    tag: 'CC 100 R&D Guide · How the Software Works',
    title: 'Four core technologies power these tools',
    intro: 'Instead of one single AI, healthcare uses four specialized methods. Each method is matched to a specific medical task, from reading X-rays and heart waves to 3D artery modeling and visit notes.',
    metricName: 'Specialized medical AI',
    metricSub: 'Trained on clinical datasets',
    status: '4 core methods',
    statusSub: 'Matched to task',
    markerPct: 88,
    listTitle: 'The four AI methods found in our R&D database:',
    steps: [
      'Deep learning & vision: Reads X-rays, ultrasound videos, skin spots, and tissue slides (Lunit, Gleamer, DERM, EchoGo, Ibex).',
      'Machine learning & signals: Analyzes heart sounds, electrical waves, retinal photos, and urgent alerts (Aidoc, SENSORA, LumineticsCore).',
      '3D blood flow modeling: Turns heart CT scans into a 3D artery map to estimate blood flow (Heartflow).',
      'Speech & language AI: Listens to doctor-patient talks and organizes them into clean notes (Abridge).'
    ],
    calloutTitle: 'Purpose-built, not general chat',
    calloutBody: 'Unlike general chatbots, these clinical tools are trained and tested for narrow medical tasks.',
    chartTitle: 'AI Methods Used Across the 10 Platforms',
    chartBadge: 'Some tools use 2 methods',
    chartType: 'bar',
    bars: [
      { label: 'Deep vision', val: '6 tools', h: 95 },
      { label: 'Signal & ML', val: '4 tools', h: 65 },
      { label: '3D flow model', val: '1 tool', h: 22 },
      { label: 'Speech & NLP', val: '1 tool', h: 22 }
    ]
  }
];

function renderLiteracyTopic(topic) {
  const chartBody = topic.chartType === 'flow'
    ? (() => {
        const coords = [
          { x: 55, y: 58 },
          { x: 182, y: 42 },
          { x: 308, y: 24 },
          { x: 435, y: 14 }
        ];
        const pts = coords.map(c => `${c.x},${c.y}`).join(' ');
        const area = `55,72 ${pts} 435,72`;
        return `
          <svg viewBox="0 0 490 90" class="lit-svg" role="img" aria-label="${topic.chartTitle}">
            <defs>
              <linearGradient id="litArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ff4a1c" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#ff4a1c" stop-opacity="0.01"/>
              </linearGradient>
            </defs>
            <line x1="24" y1="72" x2="466" y2="72" stroke="#ececec" stroke-width="1"/>
            <polygon points="${area}" fill="url(#litArea)"/>
            <polyline points="${pts}" fill="none" stroke="#ff4a1c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            ${topic.bars.map((b, i) => `
              <circle cx="${coords[i].x}" cy="${coords[i].y}" r="4" fill="#fff" stroke="#ff4a1c" stroke-width="2.2"/>
              <text x="${coords[i].x}" y="${coords[i].y - 7}" text-anchor="middle" class="lit-val">${b.val}</text>
              <text x="${coords[i].x}" y="85" text-anchor="middle" class="lit-lbl">${b.label}</text>
            `).join('')}
          </svg>
        `;
      })()
    : `
      <div class="lit-bars" role="img" aria-label="${topic.chartTitle}">
        ${topic.bars.map((b, i) => `
          <div class="lit-bar-col">
            <span class="lit-bar-val">${b.val}</span>
            <div class="lit-bar-track">
              <div class="lit-bar-fill ${i === 0 ? 'top' : ''}" style="height:${b.h}%"></div>
            </div>
            <span class="lit-bar-lbl">${b.label}</span>
          </div>
        `).join('')}
      </div>
    `;

  return `
    <span class="lit-tag">${topic.tag}</span>
    <h3>${topic.title}</h3>
    <p class="lit-intro">${topic.intro}</p>

    <div class="lit-metric">
      <div>
        <strong>${topic.metricName}</strong>
        <span>${topic.metricSub}</span>
      </div>
      <div class="lit-status">
        <span><i class="lit-dot"></i>${topic.status}</span>
        <small>${topic.statusSub}</small>
      </div>
      <div class="lit-range" aria-hidden="true">
        <div class="lit-track">
          <span class="lit-fill" style="width:${topic.markerPct}%"></span>
          <span class="lit-pin" style="left:${topic.markerPct}%"></span>
        </div>
        <div class="lit-scale"><span>AI assist</span><span>MD verify</span></div>
      </div>
    </div>

    <div class="lit-steps">
      <h4>${topic.listTitle}</h4>
      <ol>
        ${topic.steps.map(step => `<li>${step}</li>`).join('')}
      </ol>
    </div>

    <div class="lit-note">
      <div class="lit-note-ic">R&D</div>
      <div>
        <strong>${topic.calloutTitle}</strong>
        <span>${topic.calloutBody}</span>
      </div>
    </div>

    <div class="lit-chart-card">
      <div class="lit-chart-top">
        <strong>${topic.chartTitle}</strong>
        <span class="lit-pill"><i class="lit-dot"></i>${topic.chartBadge}</span>
      </div>
      ${chartBody}
    </div>
  `;
}

const RESEARCHERS = [
  {
    name: 'Francis Floyd G. Manalo',
    initials: 'FM',
    role: 'BSCS 1st Year · Lead Developer, Slide Deck & Documentation',
    photo: '',
    bio: 'Leads overall development, organizes project documentation, and prepares the CC 100 presentation deck for LAMBING at Batangas State University - Alangilan.'
  },
  {
    name: 'Jesus Karol M. Rombano',
    initials: 'JR',
    role: 'BSCS 1st Year · Full-Stack & UI/UX',
    photo: '',
    bio: 'Builds end-to-end site functionality and shapes the user experience, ensuring smooth navigation across all interactive health literacy modules.'
  },
  {
    name: 'Yerahmiel M. De Roxas',
    initials: 'YD',
    role: 'BSCS 1st Year · Front-End & Designer',
    photo: '',
    bio: 'Designs the visual layout, typography, and responsive front-end components that present clinical AI concepts in a clean, student-friendly format.'
  },
  {
    name: 'John Kirby G. Braceros',
    initials: 'JB',
    role: 'BSCS 1st Year · Research & Development',
    photo: '',
    bio: 'Conducts primary research and verifies clinical functions, advantages, and safety limitations across all 10 healthcare AI platforms.'
  }
];

const DESK_SCOPES = {
  method: {
    badge: 'How we studied each tool',
    summary: 'We reviewed all 10 clinical AI tools using official product guides, checking what each tool does, how it helps care teams, its limits, and the AI tech behind it.',
    tags: ['10 verified tools', '6 review points each', 'Official guides only']
  },
  domains: {
    badge: '4 areas of hospital & clinic care',
    summary: 'Our study covers emergency scans (Aidoc, Lunit, Gleamer), heart checks (SENSORA, Heartflow, EchoGo), early screening (LumineticsCore, DERM, Ibex), and visit notes (Abridge).',
    tags: ['3 imaging tools', '6 heart & screening', '1 note assistant']
  },
  ethics: {
    badge: 'Built for learning, not diagnosis',
    summary: 'LAMBING is a student health literacy guide for CC 100. It never collects patient records or gives medical advice, reminding users that doctors always make the final call.',
    tags: ['No patient data', 'Doctors still decide', 'CC 100 student guide']
  }
};

const DESK_FAQS = [
  {
    q: 'Why these 10 AI tools?',
    a: 'They represent real-world clinical systems across radiology, cardiology, eye/skin screening, pathology, and clinical documentation backed by official product guides.'
  },
  {
    q: 'Can LAMBING diagnose illness?',
    a: 'No. LAMBING is an educational literacy portal for CC 100. Every researched tool requires a licensed doctor to review findings and make medical decisions.'
  },
  {
    q: 'What AI tech powers them?',
    a: 'The 10 platforms rely on deep learning image analysis, machine learning signal processing, 3D coronary blood flow modeling, and medical speech recognition.'
  }
];

function renderDeskScope(key) {
  const data = DESK_SCOPES[key] || DESK_SCOPES.method;
  const pillsHtml = data.tags
    .map(tag => '<span class="desk-tag-item"><i class="desk-tag-dot"></i>' + tag + '</span>')
    .join('');
  return `
    <span class="desk-badge">${data.badge}</span>
    <p class="desk-desc">${data.summary}</p>
    <div class="desk-tags">${pillsHtml}</div>
  `;
}

const views = {
home: `<div class="bento">
${card('k s2',`<small>R&D Database</small><h4>10 clinical AI platforms researched</h4><div class="seg">${seg}</div><div class="leg">${legend}</div>`)}
${card('o',`<small>Clinical impact</small><b class="num">05</b><small>Core ways AI assists doctors & patients</small>`,'https://i.pinimg.com/1200x/32/75/8c/32758c4905e2a04cc1a5e08695c36d28.jpg')}
${card('w',`<small>Core technologies</small><svg viewBox="0 0 200 110" class="gauge"><path d="M20 100A80 80 0 0 1 180 100" fill="none" stroke="#e6e6e6" stroke-width="10" stroke-linecap="round"/><path d="M20 100A80 80 0 0 1 155 42" fill="none" stroke="#ff4a1c" stroke-width="10" stroke-linecap="round"/></svg><h4>Deep Learning</h4><p>Powers image analysis, 3D artery modeling, heart sound checks, and speech notes.</p>`)}
${card('k',`<small>Specialty coverage</small><h4>10 systems, 4 domains</h4><svg viewBox="-100 -100 200 200" class="ringm">${ticks}</svg>`)}
${card('w',`<small>Mandatory physician verification</small><div class="dr"><span>Dr</span>Licensed physician</div><p class="st">AI flags potential finding</p><p class="st">Doctor reviews & confirms</p><p class="st">Patient receives guided care</p>`)}
</div>`,
systems: `<div class="sys-board">
  <div class="sys-top">
    <h3>AI systems</h3>
    <a class="sys-all" href="#ai-tools"><span>10</span>Inspect all 10 systems →</a>
  </div>
  <div class="sys-grid">
    ${SYSTEM_CARDS.map(s => `
      <a class="sys-card" href="#ai-tools">
        <div class="sys-thumb">
          <div class="sys-logo-box">
            <img src="${s.logo}" alt="${s.name} logo" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
            <span class="sys-fallback">${s.mark}</span>
          </div>
        </div>
        <h5>${s.name}</h5>
        <p>${s.desc}</p>
        <span class="sys-cta">Learn more</span>
      </a>
    `).join('')}
  </div>
</div>`,
guides: `<div class="lit-board">
  <aside class="lit-nav" aria-label="AI literacy principles">
    <div class="lit-badge" title="10 R&D Systems">10</div>
    <div class="lit-nav-list">
      ${LITERACY_TOPICS.map((t, i) => `
        <button type="button" class="lit-tab ${i === 0 ? 'on' : ''}" data-lit="${t.id}">
          <span class="lit-bullet"></span>${t.label}
        </button>
      `).join('')}
    </div>
  </aside>
  <article class="lit-main" id="litMain">
    ${renderLiteracyTopic(LITERACY_TOPICS[0])}
  </article>
</div>`,
safety: `<div class="res-board">
  <div class="res-top">
    <div>
      <h3>Researchers</h3>
      <p class="res-sub">CC 100: Introduction to Computing · Category 9 Research Team</p>
    </div>
    <div class="res-uni">
      <span class="res-crest" aria-hidden="true">BSU</span>
      <div>
        <strong>Batangas State University</strong>
        <small>Alangilan Campus · BS Computer Science</small>
      </div>
    </div>
  </div>
  <div class="res-grid">
    ${RESEARCHERS.map(r => `
      <article class="res-card">
        <div class="res-head">
          <div class="res-avatar" title="Profile photo placeholder for ${r.name}">
            ${r.photo ? `<img src="${r.photo}" alt="${r.name}" onerror="this.remove()">` : ''}
            <span class="res-init">${r.initials}</span>
          </div>
          <div class="res-meta">
            <h5>${r.name}</h5>
            <span>${r.role}</span>
          </div>
        </div>
        <p class="res-bio">${r.bio}</p>
        <div class="res-foot">
          <span class="res-campus"><i class="res-spartan"></i>BatStateU - Alangilan</span>
          <span class="res-tag">Red Spartans · BSCS</span>
        </div>
      </article>
    `).join('')}
  </div>
</div>`,
desk: `<div class="desk-board">
    <div class="desk-top">
      <section class="desk-scope">
        <div class="desk-scope-head">
          <div>
            <span class="desk-eyebrow">Course & Research Scope</span>
            <h4>CC 100 · Category 9</h4>
            <p class="desk-track">AI-Powered Healthcare Systems</p>
          </div>
          <div class="desk-tabs" role="tablist" aria-label="R&D scope details">
            <button type="button" class="desk-pill on" data-scope="method">Method</button>
            <button type="button" class="desk-pill" data-scope="domains">Domains</button>
            <button type="button" class="desk-pill" data-scope="ethics">Boundaries</button>
          </div>
        </div>
        <div class="desk-scope-body" id="deskScopeBody">
          ${renderDeskScope('method')}
        </div>
      </section>

      <section class="desk-uni" style="--campus:url('https://the-post-cdn.sgp1.digitaloceanspaces.com/2022/07/CAMPUS-4-JULY-7.png')">
        <div class="desk-uni-top">
          <span class="desk-uni-pill"><i class="desk-spartan"></i>The National Engineering University</span>
        </div>
        <div class="desk-uni-foot">
          <small>Institution · CICS</small>
          <h4>BatStateU - Alangilan</h4>
          <p>Bachelor of Science in Computer Science · 1st Year</p>
        </div>
      </section>
    </div>

    <section class="desk-qa">
      <div class="desk-qa-left">
        <div class="desk-qa-head">
          <span class="desk-live"><i class="desk-pulse"></i>R&D Feedback Desk</span>
          <h4>Questions about our research?</h4>
        </div>
        <div class="desk-chips">
          ${DESK_FAQS.map((f, i) => '<button type="button" class="desk-chip ' + (i === 0 ? 'on' : '') + '" data-faq="' + i + '">' + f.q + '</button>').join('')}
        </div>
        <div class="desk-answer" id="deskAnswer">
          <strong>${DESK_FAQS[0].q}</strong>
          <p>${DESK_FAQS[0].a}</p>
        </div>
      </div>

      <form class="desk-qa-right" id="deskForm">
        <label for="deskInput">Ask our CC 100 research team</label>
        <textarea id="deskInput" rows="2" placeholder="Type a question about our 10 clinical AI tools or R&D sources..."></textarea>
        <div class="desk-qa-actions">
          <span>Replies via R&D Contact Section</span>
          <button type="submit" class="desk-submit">Open the R&D desk →</button>
        </div>
      </form>
    </section>
  </div>`
};

const tabs = [
  ['home', 'Overview', 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'],
  ['systems', 'AI systems', 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  ['guides', 'AI literacy', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-1 13l-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10z'],
  ['safety', 'Researchers', 'M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'],
  ['desk', 'R&D scope', 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5']
];
const panel = document.getElementById('panel'), bar = document.querySelector('.pills');
bar.innerHTML = tabs.map(([k,n,d]) => `<button role="tab" data-t="${k}" aria-selected="false"><svg width="16" height="16" viewBox="0 0 24 24" fill="${k==='desk'||k==='systems'?'none':'currentColor'}" stroke="currentColor" stroke-width="2"><path d="${d}"/></svg>${n}</button>`).join('');
const pills = [...bar.children];
function showView(k){ panel.innerHTML = views[k]; panel.style.animation = 'none'; void panel.offsetWidth; panel.style.animation = ''; pills.forEach(b => b.setAttribute('aria-selected', b.dataset.t === k)); }
let idx = 0, auto = !still, seen = false;
pills.forEach((b, i) => b.addEventListener('click', () => { auto = false; idx = i; showView(b.dataset.t); }));
showView('home');

document.addEventListener('click', e => {
  const btn = e.target.closest('.lit-tab');
  if (!btn) return;
  const topic = LITERACY_TOPICS.find(t => t.id === btn.dataset.lit);
  const main = document.getElementById('litMain');
  if (!topic || !main) return;
  document.querySelectorAll('.lit-tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  main.innerHTML = renderLiteracyTopic(topic);
  main.scrollTop = 0;
});

// Compact Advantages & Limitations Stage
const ADV_ITEMS = [
  {
    img: 'assets/images/adv-urgent.svg',
    alt: 'A scan with an urgent finding highlighted in orange',
    title: 'Urgent cases are found sooner',
    desc: 'AI checks scans for emergencies like stroke, brain aneurysms, and fractures and alerts care teams right away so critical patients are seen first.',
    tools: 'Aidoc, Gleamer'
  },
  {
    img: 'assets/images/adv-early.svg',
    alt: 'Magnified cells with one suspicious area marked',
    title: 'Disease signs are caught earlier',
    desc: 'AI helps spot early signs of cancer and heart failure across chest X-rays, mammograms, heart ultrasounds, and biopsy slides.',
    tools: 'Lunit, Ultromics EchoGo, Ibex'
  },
  {
    img: 'assets/images/adv-paperwork.svg',
    alt: 'A sound wave turning into lines of text on a note',
    title: 'Less paperwork, more listening',
    desc: 'Speech recognition and language models turn doctor-patient conversations into organized medical notes so doctors can focus on the patient instead of the screen.',
    tools: 'Abridge'
  },
  {
    img: 'assets/images/adv-wait.svg',
    alt: 'A close-up of an eye with a marked center',
    title: 'Shorter waits for specialist checks',
    desc: 'Point-of-care screening tools evaluate diabetic eye scans and suspicious skin spots during routine visits to prioritize urgent specialist referrals.',
    tools: 'Digital Diagnostics LumineticsCore, Skin Analytics DERM'
  },
  {
    img: 'assets/images/adv-checkup.svg',
    alt: 'A heartbeat line with one beat highlighted',
    title: 'Routine check-ups tell more',
    desc: 'Digital stethoscopes and 3D coronary models uncover irregular heart rhythms, murmurs, and artery blockages from routine exams and existing CT scans.',
    tools: 'Eko SENSORA, Heartflow'
  }
];

document.addEventListener('click', e => {
  const tab = e.target.closest('.adv-tab');
  const viewer = document.getElementById('advViewer');
  if (!tab || !viewer) return;

  document.querySelectorAll('.adv-tab').forEach(t => {
    t.classList.remove('on');
    t.setAttribute('aria-selected', 'false');
  });
  tab.classList.add('on');
  tab.setAttribute('aria-selected', 'true');

  const idx = Number(tab.dataset.adv);
  viewer.style.animation = 'none';
  void viewer.offsetWidth;
  viewer.style.animation = '';

  if (idx === 5) {
    viewer.classList.add('is-limits');
    viewer.innerHTML = `
      <div class="adv-body">
        <span class="mono" style="display:block;margin-bottom:8px">Clinical Safety Boundaries</span>
        <h3>Shared limitations across all 10 tools</h3>
        <ul class="adv-lim-list">
          <li>AI can produce false positives or miss subtle abnormalities.</li>
          <li>A licensed doctor or specialist must always review and confirm results.</li>
          <li>Tools require compatible hospital hardware and clear image quality.</li>
          <li>Patient medical data must remain strictly private and secure.</li>
          <li>Setup, maintenance, and regional availability can be limited.</li>
        </ul>
      </div>
    `;
  } else {
    const item = ADV_ITEMS[idx];
    viewer.classList.remove('is-limits');
    viewer.innerHTML = `
      <img class="adv-pic" src="${item.img}" alt="${item.alt}">
      <div class="adv-body">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <p class="ex">Researched tools: <a href="#ai-tools">${item.tools}</a></p>
      </div>
    `;
  }
});

new IntersectionObserver(e => { seen = e[0].isIntersecting; }, {threshold: .5}).observe(document.getElementById('tablet'));
setInterval(() => { if (auto && seen) { idx = (idx + 1) % tabs.length; showView(tabs[idx][0]); } }, 4200);

// Smooth anchor links (lands directly on the revealed ring for #about)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#about' && heroStage && !still) {
      e.preventDefault();
      const targetY = heroStage.offsetTop + heroStage.offsetHeight - innerHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: still ? 'auto' : 'smooth' });
  });
});

// Fast scroll renderer: Hero Overlay (0 -> 0.35) -> Warp Tunnel (0.30 -> 0.75) -> Initiative Ring (0.70 -> 1.0)
const fly = document.querySelector('.fly'), rg = document.getElementById('rg');
const clamp01 = v => Math.min(1, Math.max(0, v));
const smoothstep = v => { const x = clamp01(v); return x * x * (3 - 2 * x); };
let cw = 0, ch = 0, dpr = 1, dirty = true, warpP = 0, flyP = 0;

function resizeRingCanvas() {
  if (!ringCanvas || !rCtx) return;
  dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  cw = ringCanvas.clientWidth;
  ch = ringCanvas.clientHeight;
  ringCanvas.width = Math.round(cw * dpr);
  ringCanvas.height = Math.round(ch * dpr);
  dirty = true;
}
resizeRingCanvas();
addEventListener('resize', resizeRingCanvas, { passive: true });
addEventListener('scroll', () => { dirty = true; }, { passive: true });

function renderRingSequence(p) {
  if (!rCtx || !cw || !ch) return;

  // 1. Hero zoom & fade into black (0.0 -> 0.36)
  const heroZoom = smoothstep(p / 0.38);
  const copyFade = 1 - smoothstep(p / 0.22);
  const veilAlpha = smoothstep((p - 0.16) / 0.22);

  if (heroEl) {
    heroEl.style.transform = `scale(${(1 + heroZoom * 0.22).toFixed(4)})`;
    heroEl.style.opacity = (1 - veilAlpha).toFixed(3);
  }
  if (heroCopy) {
    heroCopy.style.opacity = copyFade.toFixed(3);
    heroCopy.style.transform = `translate3d(0, ${(-heroZoom * 28).toFixed(1)}px, 0)`;
  }
  if (blackVeil) {
    blackVeil.style.opacity = veilAlpha.toFixed(3);
  }

  // Clear transparent canvas so p=0 shows pure hero with zero overhead
  rCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  rCtx.clearRect(0, 0, cw, ch);

  if (p <= 0.002) {
    ring.style.opacity = '0';
    ringCenter.style.opacity = '0';
    return;
  }

  const cx = cw * 0.5;
  const cy = ch * 0.5;
  const maxR = Math.hypot(cx, cy) * 1.15;
  const ringRadius = (Math.min(560, cw * 0.88) / 400) * 150;

  // 2. Bokeh orbs overlay on hero first (0.02 -> 0.42)
  const bokehAlpha = smoothstep(p / 0.1) * (1 - smoothstep((p - 0.26) / 0.18));
  if (bokehAlpha > 0.01) {
    for (let i = 0; i < BOKEH_ORBS.length; i++) {
      const b = BOKEH_ORBS[i];
      const t = (b.offset + p * 1.6) % 1;
      const dist = 28 + t * maxR * 0.9;
      const sz = b.size * (0.45 + t * 1.15);
      rCtx.globalAlpha = bokehAlpha * Math.sin(t * Math.PI) * 0.65;
      rCtx.drawImage(
        BOKEH_SPRITES[b.colorIdx],
        cx + b.cos * dist - sz * 0.5,
        cy + b.sin * dist - sz * 0.5,
        sz,
        sz
      );
    }
  }

  // 3. Radial warp streaks start subtly over hero (p=0.06), peak in tunnel (p=0.45), clear out (p=0.82)
  const streakAlpha = smoothstep((p - 0.05) / 0.18) * (1 - smoothstep((p - 0.62) / 0.22));
  const innerClear = smoothstep((p - 0.44) / 0.36);
  const innerHoleR = 14 + innerClear * (ringRadius * 1.7);

  if (streakAlpha > 0.005) {
    rCtx.lineCap = 'round';
    const travel = p * 2.4;

    for (let c = 0; c < streakCols.length; c++) {
      const group = STREAKS_BY_COLOR[c];
      rCtx.strokeStyle = streakCols[c];

      // Batched soft outer glow pass
      rCtx.globalAlpha = streakAlpha * 0.2 * (1 - innerClear * 0.7);
      rCtx.lineWidth = 11;
      rCtx.beginPath();
      for (let i = 0; i < group.length; i++) {
        const s = group[i];
        const prog = (s.offset + travel * s.speed) % 1;
        const rStart = Math.max(innerHoleR, 16 + prog * maxR * 0.72);
        if (rStart >= maxR) continue;
        const rEnd = rStart + maxR * 0.38 * s.lenScale * (0.35 + prog * 1.1);
        rCtx.moveTo(cx + s.cos * rStart, cy + s.sin * rStart);
        rCtx.lineTo(cx + s.cos * rEnd, cy + s.sin * rEnd);
      }
      rCtx.stroke();

      // Batched bright inner core pass
      rCtx.globalAlpha = streakAlpha * 0.88;
      rCtx.lineWidth = 3.4;
      rCtx.stroke();
    }
  }
  rCtx.globalAlpha = 1;

  // 4. Crisp non-glowing Initiative ring & headline lock in (0.68 -> 1.0)
  const ringReveal = smoothstep((p - 0.66) / 0.22);
  const textReveal = smoothstep((p - 0.75) / 0.2);
  ring.style.opacity = ringReveal.toFixed(3);
  ring.style.transform = `scale(${(0.86 + 0.14 * ringReveal).toFixed(4)})`;
  ringCenter.style.opacity = textReveal.toFixed(3);
  ringCenter.style.transform = `scale(${(0.92 + 0.08 * textReveal).toFixed(4)})`;
}

function getHeroGoal() {
  if (!heroStage) return 0;
  const r = heroStage.getBoundingClientRect();
  return clamp01(-r.top / Math.max(1, r.height - innerHeight));
}

function frame() {
  if (!still && dirty) {
    rg.setAttribute('transform', `rotate(${scrollY * 0.12})`);

    const goal = getHeroGoal();
    warpP += (goal - warpP) * 0.24;
    if (Math.abs(goal - warpP) < 0.0008) warpP = goal;
    renderRingSequence(warpP);

    const box = fly.getBoundingClientRect();
    const goalFly = clamp01(-box.top / (box.height - innerHeight) * 1.85);
    flyP += (goalFly - flyP) * 0.22;
    if (Math.abs(goalFly - flyP) < 0.0008) flyP = goalFly;
    fly.style.setProperty('--p', flyP.toFixed(4));

    if (warpP === goal && flyP === goalFly) dirty = false;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// AI literacy slider arrows.
const sl = document.getElementById('slider');
document.getElementById('prev').onclick = () => sl.scrollBy({left: -sl.clientWidth * .6, behavior: 'smooth'});
document.getElementById('next').onclick = () => sl.scrollBy({left: sl.clientWidth * .6, behavior: 'smooth'});

// Glowing curve draws when it appears on screen.
const curve = document.getElementById('curve');
curve.style.setProperty('--len', curve.getTotalLength());
new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { curve.classList.add('on'); o.disconnect(); } }, {threshold: .4}).observe(curve);

// Tablet follows the cursor: tilts toward the pointer and slides a soft glare across the glass.
const tb = document.getElementById('tablet'), sc = tb.closest('.show');
let tx = 0, ty = 0, cx = 0, cy = 0, tg = 0, cg = 0, run = false;
function follow(){
  cx += (tx - cx) * .08; cy += (ty - cy) * .08; cg += (tg - cg) * .1;
  tb.style.transform = `perspective(1200px) rotateY(${cx * 14}deg) rotateX(${-cy * 10}deg) translate3d(${cx * 14}px,${cy * 10}px,0)`;
  tb.style.setProperty('--sx', (50 + cx * 70) + '%');
  tb.style.setProperty('--gx', (50 + cx * 90) + '%');
  tb.style.setProperty('--gy', (50 + cy * 90) + '%');
  tb.style.setProperty('--glare', (0.04 + cg * 0.16).toFixed(3));
  tb.style.setProperty('--glow', (0.04 + cg * 0.24).toFixed(3));
  sc.style.setProperty('--bx', cx); sc.style.setProperty('--by', cy);
  if (Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(tg - cg) > .001) requestAnimationFrame(follow); else run = false;
}
function kick(){ if (!run) { run = true; requestAnimationFrame(follow); } }
if (!still) {
  sc.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; const r = sc.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; tg = 1; kick(); });
  sc.addEventListener('pointerleave', () => { tx = 0; ty = 0; tg = 0; kick(); });
}

// How clinical AI works (4 Unique Themes: Compact -> Expands on Hover/Tap)
const steps = {
  1: `
    <div>
      <div class="hw-top">
        <span class="hw-kicker">Step 01 · Clinical Input</span>
        <span class="hw-cue">Hover to inspect ↗</span>
      </div>
      <h4 class="hw-h">Hospital devices capture raw medical data</h4>
    </div>
    <div class="hw-detail s1-rows">
      <div class="s1-row"><i style="background:#ff4a1c"></i><span>CT Scans, X-Rays & Mammograms</span><em>Aidoc · Lunit · Gleamer · Heartflow</em></div>
      <div class="s1-row"><i style="background:#2fe0b0"></i><span>Stethoscope Audio & Heart Ultrasounds</span><em>Eko SENSORA · Ultromics EchoGo</em></div>
      <div class="s1-row"><i style="background:#ffd08a"></i><span>Retina, Skin & Biopsy Images</span><em>LumineticsCore · DERM · Ibex</em></div>
      <div class="s1-row"><i style="background:#a78bfa"></i><span>Doctor–Patient Consultation Speech</span><em>Abridge</em></div>
    </div>
  `,
  2: `
    <div>
      <div class="hw-top">
        <span class="hw-kicker">Step 02 · AI Pattern Scan</span>
        <span class="hw-cue">Hover to inspect ↗</span>
      </div>
      <h4 class="hw-h">10 specialized systems highlight key findings</h4>
    </div>
    <div class="hw-detail s2-bars">
      <div class="s2-bar"><span>Medical Imaging</span><div class="s2-track"><span style="width:90%;background:#ff4a1c"></span></div><b>3 tools</b></div>
      <div class="s2-bar"><span>Heart & Vitals</span><div class="s2-track"><span style="width:90%;background:#2fe0b0"></span></div><b>3 tools</b></div>
      <div class="s2-bar"><span>Early Screening</span><div class="s2-track"><span style="width:90%;background:#f59e0b"></span></div><b>3 tools</b></div>
      <div class="s2-bar"><span>Clinical Notes</span><div class="s2-track"><span style="width:35%;background:#8b5cf6"></span></div><b>1 tool</b></div>
    </div>
  `,
  3: `
    <div>
      <div class="hw-top">
        <span class="hw-kicker">Step 03 · Mandatory MD Gate</span>
        <span class="hw-cue">Hover to inspect ↗</span>
      </div>
      <h4 class="hw-h">A licensed doctor verifies every AI alert</h4>
    </div>
    <div class="hw-detail s3-gate">
      <div class="s3-box">
        <small>AI Output (Assistive)</small>
        <p>Flags possible strokes, fractures, lesions, or draft notes—can still make mistakes.</p>
      </div>
      <span class="s3-arrow">→</span>
      <div class="s3-box md">
        <small>Physician Decision (Final)</small>
        <p>Doctor checks scans, symptoms & lab tests before confirming any diagnosis.</p>
      </div>
    </div>
  `,
  4: `
    <div>
      <div class="hw-top">
        <span class="hw-kicker">Step 04 · Patient Outcome</span>
        <span class="hw-cue">Hover to inspect ↗</span>
      </div>
      <h4 class="hw-h">Faster triage & more time with patients</h4>
    </div>
    <div class="hw-detail s4-kpis">
      <div class="s4-kpi"><b>Earlier</b><span>Emergency stroke & fracture alerts reach care teams faster.</span></div>
      <div class="s4-kpi"><b>Focused</b><span>Automated visit notes reduce typing so doctors listen more.</span></div>
      <div class="s4-kpi"><b>100%</b><span>Human-led care across all 10 researched clinical AI systems.</span></div>
    </div>
  `
};

document.querySelectorAll('.scr').forEach(el => {
  el.innerHTML = steps[el.dataset.s];
  el.addEventListener('click', () => el.classList.toggle('open'));
});

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), {threshold: .35});
document.querySelectorAll('.vl, .scr, .pic').forEach(el => io.observe(el));

document.addEventListener('click', e => {
  const scopeBtn = e.target.closest('.desk-pill');
  if (scopeBtn) {
    const box = document.getElementById('deskScopeBody');
    if (!box) return;
    document.querySelectorAll('.desk-pill').forEach(b => b.classList.remove('on'));
    scopeBtn.classList.add('on');
    box.innerHTML = renderDeskScope(scopeBtn.dataset.scope);
    return;
  }

  const faqBtn = e.target.closest('.desk-chip');
  if (faqBtn) {
    const item = DESK_FAQS[Number(faqBtn.dataset.faq)];
    const ans = document.getElementById('deskAnswer');
    if (!item || !ans) return;
    document.querySelectorAll('.desk-chip').forEach(b => b.classList.remove('on'));
    faqBtn.classList.add('on');
    ans.innerHTML = '<strong>' + item.q + '</strong><p>' + item.a + '</p>';
  }
});

document.addEventListener('submit', e => {
  if (e.target.id !== 'deskForm') return;
  e.preventDefault();
  const q = document.getElementById('deskInput')?.value.trim();
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    const targetField = contactSection.querySelector('textarea, input[type="text"]');
    if (targetField && q) targetField.value = q;
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
});