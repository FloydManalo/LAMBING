const TOOLS = [
  {
    key: 'aidoc',
    name: 'Aidoc',
    category: 'imaging',
    catLabel: 'Medical Imaging',
    short: 'Flags strokes, brain aneurysms, and urgent findings on medical scans.',
    purpose: 'Helps doctors identify urgent medical conditions and coordinate patient care across radiology, heart care, and brain and blood vessel care.',
    functions: 'Analyzes medical scans for stroke, brain aneurysms, and blood vessel issues; sends urgent alerts to care teams; supports follow-up across hospital systems.',
    helps: 'Helps doctors spot critical scans immediately and improves team communication, reducing delays in patient assessment and treatment.',
    pros: 'Identifies urgent cases fast; improves medical team coordination; organizes patient management; reduces scan review delays.',
    cons: 'May produce incorrect findings; requires doctor review; needs compatible hospital systems; costly installation and maintenance.',
    tech: 'Medical image analysis, machine learning, and automated alerts',
    url: 'https://www.aidoc.com/',
    bg: 'linear-gradient(135deg,#ff4a1c,#2c0c04)'
  },
  {
    key: 'lunit',
    name: 'Lunit',
    category: 'imaging',
    catLabel: 'Medical Imaging',
    short: 'Examines chest X-rays, mammograms, and tissue samples for early cancer signs.',
    purpose: 'Uses AI to help doctors detect cancer early, review medical images, and support cancer treatment research.',
    functions: 'Analyzes chest X-rays and mammograms for breast cancer and chest abnormalities; analyzes cancer tissue images for treatment planning.',
    helps: 'Helps doctors review screening images more efficiently and highlights signs needing further testing, supporting earlier detection for patients.',
    pros: 'Supports cancer screening and early detection; speeds up image review; aids cancer research; offers multiple oncology AI tools.',
    cons: 'May produce incorrect findings; requires physician confirmation; needs specialized medical equipment; limited availability in some countries.',
    tech: 'Deep learning, medical image analysis, and AI-based tissue analysis',
    url: 'https://www.lunit.io/en/',
    bg: 'linear-gradient(135deg,#d9381e,#141414)'
  },
  {
    key: 'gleamer',
    name: 'Gleamer',
    category: 'imaging',
    catLabel: 'Medical Imaging',
    short: 'Detects bone fractures, lung nodules, and chest or breast abnormalities on scans.',
    purpose: 'Develops specialized AI imaging tools (BoneView, ChestView, BoneMetrics, LungCT, BreastView, AutoReport) to make scan reviews faster and more accurate.',
    functions: 'Detects bone fractures on X-rays, chest abnormalities, lung nodules on CT scans, and breast abnormalities on mammograms; automates bone measurements and draft reports.',
    helps: 'Reduces time spent on routine measurements and report drafting while helping doctors spot subtle injuries or illnesses sooner.',
    pros: 'Spots subtle abnormalities; speeds up medical image review; cuts down repetitive measurement and reporting tasks; covers multiple scan types.',
    cons: 'May produce incorrect results; requires physician review; needs compatible imaging systems; availability varies by healthcare facility.',
    tech: 'Deep learning, medical image analysis, automated measurements, and AI-assisted reporting',
    url: 'https://www.gleamer.ai/',
    bg: 'linear-gradient(135deg,#ff7a3d,#1e1410)'
  },
  {
    key: 'eko',
    name: 'Eko Health – SENSORA',
    category: 'heart',
    catLabel: 'Heart & Vitals',
    short: 'Pairs with digital stethoscopes to spot irregular heartbeats and murmurs.',
    purpose: 'Analyzes heart sounds and electrical signals during routine exams to help clinicians spot heart conditions that need further testing.',
    functions: 'Analyzes stethoscope audio and ECG signals; detects atrial fibrillation (irregular heartbeat), structural heart murmurs, and signs of reduced heart pumping ability.',
    helps: 'Gives doctors real-time insights during routine checkups, supporting earlier heart testing for patients.',
    pros: 'Identifies key heart conditions; delivers results during routine exams; supports earlier assessment; works with compatible digital stethoscopes.',
    cons: 'Cannot detect every heart condition; requires compatible hardware; requires doctor review; intended for specific patient groups and settings.',
    tech: 'Machine learning, heart sound analysis, and electrical signal analysis',
    url: 'https://www.ekohealth.com/pages/sensora',
    bg: 'linear-gradient(135deg,#198f70,#0b1f1a)'
  },
  {
    key: 'heartflow',
    name: 'Heartflow Analysis',
    category: 'heart',
    catLabel: 'Heart & Vitals',
    short: 'Builds a 3D model of heart arteries from a CT scan to assess blood flow.',
    purpose: 'Creates a detailed 3D model of a patient’s coronary arteries from CT scan images to assess coronary artery disease.',
    functions: 'Analyzes coronary CT scans; builds 3D artery models; assesses plaque buildup and estimates how narrowed arteries affect blood flow.',
    helps: 'Helps doctors evaluate artery blockages without immediate invasive procedures and decide on the best next steps for treatment.',
    pros: 'Provides detailed 3D artery insights; helps assess coronary artery disease; guides treatment decisions; uses an existing CT scan.',
    cons: 'Requires a suitable CT scan; not intended for every patient or heart condition; sensitive to image quality; must be reviewed with other medical info.',
    tech: 'Artificial intelligence, 3D modeling, and computer-based blood flow analysis',
    url: 'https://www.heartflow.com/',
    bg: 'linear-gradient(135deg,#2fe0b0,#102420)'
  },
  {
    key: 'ultromics',
    name: 'Ultromics – EchoGo',
    category: 'heart',
    catLabel: 'Heart & Vitals',
    short: 'Reviews heart ultrasound scans to detect hidden heart failure conditions.',
    purpose: 'Analyzes heart ultrasound (echocardiogram) images to help doctors identify complex heart conditions like HFpEF and cardiac amyloidosis.',
    functions: 'Evaluates ultrasound images of the heart; screens for signs of heart failure with preserved ejection fraction (HFpEF) and cardiac amyloidosis.',
    helps: 'Helps doctors recognize subtle heart conditions that are hard to catch in routine exams, reducing delays in follow-up care.',
    pros: 'Identifies hard-to-spot heart diseases; enhances heart ultrasound exams; gives extra diagnostic context; reduces assessment delays.',
    cons: 'Does not detect all heart diseases; requires suitable ultrasound image quality; cannot confirm a diagnosis alone; requires combined medical testing.',
    tech: 'Deep learning and ultrasound image analysis',
    url: 'https://www.ultromics.com/',
    bg: 'linear-gradient(135deg,#1d6b57,#0c1412)'
  },
  {
    key: 'luminetics',
    name: 'Digital Diagnostics – LumineticsCore',
    category: 'screening',
    catLabel: 'Early Screening',
    short: 'Screens eye scans in adults with diabetes to catch diabetic eye disease early.',
    purpose: 'Detects more than mild diabetic retinopathy in adults aged 22+ with diabetes so vision-threatening eye disease is caught early.',
    functions: 'Analyzes retinal images from the back of the eye; provides point-of-care screening results without waiting for a specialist to read every image.',
    helps: 'Makes diabetic eye screening accessible during regular clinic visits and identifies patients who need prompt referral to an eye doctor.',
    pros: 'Fast screening results; supports early detection of diabetic eye disease; increases screening access; works without on-site specialist interpretation.',
    cons: 'Intended only for eligible adults with diabetes; cannot detect all eye diseases; may produce incorrect results; does not replace a full eye exam.',
    tech: 'Machine learning and AI retinal image analysis',
    url: 'https://www.digitaldiagnostics.com/products/eye-disease/lumineticscore/',
    bg: 'linear-gradient(135deg,#c98a2c,#1c1408)'
  },
  {
    key: 'derm',
    name: 'Skin Analytics – DERM',
    category: 'screening',
    catLabel: 'Early Screening',
    short: 'Analyzes close-up photos of moles and skin spots for possible skin cancer.',
    purpose: 'Examines detailed images of moles and skin lesions to assess skin cancer risk and prioritize specialist dermatology care.',
    functions: 'Analyzes close-up dermoscopic photos of skin spots; classifies whether a lesion appears low-risk or requires urgent dermatologist review.',
    helps: 'Reduces unnecessary clinic visits for low-risk skin spots while helping patients with suspicious lesions see a specialist faster.',
    pros: 'Supports early skin cancer detection; reduces specialist wait times; makes skin triage more efficient; prioritizes high-risk patients.',
    cons: 'May produce incorrect results; requires clear, properly captured images; cannot assess every skin condition; suspicious cases still need specialist exams.',
    tech: 'Deep learning and AI dermatology image analysis',
    url: 'https://skin-analytics.com/',
    bg: 'linear-gradient(135deg,#e09f3e,#21170a)'
  },
  {
    key: 'ibex',
    name: 'Ibex Medical Analytics',
    category: 'screening',
    catLabel: 'Early Screening',
    short: 'Helps pathologists review digital biopsy slides for breast, prostate, and stomach cancer.',
    purpose: 'Analyzes digital pathology slides of tissue samples to help specialists detect cancer cells and prioritize urgent cases.',
    functions: 'Scans digital biopsy tissue slides; flags suspicious cancer cells across breast, prostate, and stomach tissue; organizes cases for closer review.',
    helps: 'Improves review efficiency and consistency for pathologists, supporting timely and accurate cancer diagnoses for patients.',
    pros: 'Supports cancer detection and diagnosis; speeds up tissue slide review; adds diagnostic insights; improves review consistency.',
    cons: 'May miss abnormalities or produce false flags; requires digital pathology scanners; requires specialist confirmation; regional approvals vary.',
    tech: 'Deep learning, digital tissue image analysis, and machine learning',
    url: 'https://ibex-ai.com/solutions/',
    bg: 'linear-gradient(135deg,#9e6b21,#17120b)'
  },
  {
    key: 'abridge',
    name: 'Abridge',
    category: 'workflow',
    catLabel: 'Clinical Assistant',
    short: 'Turns doctor-patient conversations into organized medical notes automatically.',
    purpose: 'Reduces clinical documentation burden before, during, and after appointments so doctors can focus on listening to patients.',
    functions: 'Summarizes patient records before visits; converts consultation conversations into structured clinical notes and follow-up summaries.',
    helps: 'Saves doctors hours of typing and helps organize medical records, giving patients more eye contact and clearer explanations during visits.',
    pros: 'Cuts documentation time; organizes patient records; lets doctors focus on patients; improves care team communication.',
    cons: 'May misunderstand parts of conversations; draft notes can contain errors; requires doctor review and editing; demands strict patient data privacy.',
    tech: 'Speech recognition, generative AI, and natural language processing',
    url: 'https://www.abridge.com/',
    bg: 'linear-gradient(135deg,#6d4aff,#161029)'
  }
];

const grid = document.getElementById('tool-grid');
const modal = document.getElementById('tool-modal');
const body = modal.querySelector('.body');

function renderGrid(filter = 'all') {
  grid.innerHTML = TOOLS.map(t => `
    <button class="card" data-key="${t.key}" ${filter !== 'all' && t.category !== filter ? 'hidden' : ''}>
      <div class="thumb" style="background-image:url(assets/images/tool-${t.key}.jpg),url(assets/images/tool-${t.key}.svg),${t.bg}"></div>
      <span class="mono">${t.catLabel}</span>
      <strong>${t.name}</strong>
      <small>${t.short}</small>
    </button>
  `).join('');
}
renderGrid();

document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    renderGrid(btn.dataset.filter);
  });
});

grid.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  const t = TOOLS.find(x => x.key === card.dataset.key);
  if (!t) return;
  body.innerHTML = `
    <span class="mono">${t.catLabel}</span>
    <h3>${t.name}</h3>
    <p class="lead">${t.purpose}</p>
    <h5>Core Functions</h5><p>${t.functions}</p>
    <h5>How It Helps Doctors & Patients</h5><p>${t.helps}</p>
    <div class="mg">
      <div class="pro"><h5>Advantages</h5><p>${t.pros}</p></div>
      <div class="con"><h5>Limitations</h5><p>${t.cons}</p></div>
    </div>
    <div class="note"><strong>AI Technology Used:</strong> ${t.tech}</div>
    <a class="btn" href="${t.url}" target="_blank" rel="noopener noreferrer">Visit Official Site →</a>
  `;
  modal.showModal();
});

modal.querySelector('.close').onclick = () => modal.close();
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

document.getElementById('inquiry')?.addEventListener('submit', e => {
  e.preventDefault();
  e.target.querySelector('output').textContent = 'Thank you! Your feedback has been recorded for our CC 100 R&D team.';
  e.target.reset();
});