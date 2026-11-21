# LAMBING

**Learning AI for Medical Benefits, Innovation, and Nurturing Guidance** — an AI-powered healthcare literacy and campus wellness web portal concept designed to help college students navigate campus clinic services and understand how real-world artificial intelligence supports modern medical care.

Developed by Floyd Manalo, Jesus Rombano, Yerahmiel De Roxas, and Kirby Braceros, all 1st-year BS Computer Science student at Batangas State University - Alangilan, as a final project for **CC 100 – Introduction to Computing** (Category 9: Information Technology and Artificial Intelligence – AI-Powered Healthcare Systems).

---

## The Problem

Campus health services frequently experience congestion from routine student inquiries—such as medical and dental clearance requirements—while students often lack a single, trustworthy guide on when to rest at home versus when to visit the university clinic.

At the same time, artificial intelligence is rapidly transforming clinical diagnostics and hospital workflows, yet many students encounter either overly technical medical literature or unverified health advice online.

**LAMBING** explores how a structured web interface can combine practical campus wellness protocols, clear profiles of verified medical AI systems, and a modular conversational assistant.

---

## The Idea

LAMBING aims to bring together:

- **Campus Care Protocols** – Step-by-step student guidance for medical and dental clearance, fever monitoring, academic burnout, and minor first aid.
- **Clinical AI Directory** – Accessible breakdowns of 10 real-world AI healthcare systems across medical imaging, cardiology, early screening, and clinical documentation.
- **Responsible AI Literacy** – Transparent summaries of how each AI tool works, its clinical benefits, its technical limitations, and why physician verification remains essential.
- **Modular AI Companion Mount** – A dedicated `#chatbot-root` frontend container prepared for a backend developer to integrate an interactive campus wellness assistant.

The portal is designed strictly as an educational and non-diagnostic health literacy tool—helping students make informed decisions without replacing licensed healthcare professionals.

---

## Clinical AI System Research

To ground the platform in actual medical technology rather than speculative concepts, 10 deployed healthcare AI platforms were reviewed using official product documentation and clinical overviews across four specialties: **Medical Imaging**, **Heart & Vitals**, **Early Screening**, and **Clinical Assistant**.

### Systems Reviewed

1. **Aidoc** *(Medical Imaging)*
   - Analyzes radiology scans to flag urgent findings such as strokes and brain aneurysms, alerting care teams to prioritize time-sensitive cases.
2. **Lunit** *(Medical Imaging)*
   - Uses deep learning to examine chest X-rays, mammograms, and tissue samples to support earlier cancer detection and treatment research.
3. **Abridge** *(Clinical Assistant)*
   - Converts doctor-patient consultations into structured clinical notes, reducing documentation workload so clinicians can focus on patients.
4. **Eko Health – SENSORA** *(Heart & Vitals)*
   - Pairs with digital stethoscopes to analyze heart sounds and electrical signals for irregular heartbeats (such as atrial fibrillation) and murmurs.
5. **Heartflow Analysis** *(Heart & Vitals)*
   - Builds 3D models of coronary arteries from existing CT scans to evaluate plaque buildup and estimate how narrowing affects blood flow.
6. **Gleamer** *(Medical Imaging)*
   - Provides specialized radiography and CT modules (*BoneView*, *ChestView*, *LungCT*, *BreastView*) to assist clinicians in detecting fractures and abnormalities.
7. **Digital Diagnostics – LumineticsCore** *(Early Screening)*
   - Analyzes retinal images in adults with diabetes to detect early signs of diabetic retinopathy without specialist wait times.
8. **Skin Analytics – DERM** *(Early Screening)*
   - Evaluates detailed images of moles and skin lesions to flag potential skin cancer and prioritize high-risk specialist referrals.
9. **Ultromics – EchoGo** *(Heart & Vitals)*
   - Analyzes echocardiogram ultrasound images to help clinicians identify complex conditions such as HFpEF and cardiac amyloidosis.
10. **Ibex Medical Analytics** *(Early Screening)*
    - Examines digitized biopsy tissue slides to assist pathologists in identifying breast, prostate, and stomach cancers.

### Initial Observations

- **Assistive triage over automation:** Deployed clinical AI systems primarily flag urgent cases or subtle patterns for human review rather than issuing autonomous diagnoses.
- **Reducing clinician burnout:** Ambient documentation tools like Abridge demonstrate how AI can improve patient care indirectly by returning consultation time to doctors.
- **Mandatory human oversight:** Every reviewed platform requires confirmation from a licensed physician or specialist due to potential false positives and imaging constraints.
- **Student relevance:** While hospital imaging suites are operated by specialists, organizing their capabilities clearly helps students understand how modern healthcare systems work.

---

## Research & System Limitations

The clinical tool summaries presented in LAMBING are compiled from official vendor documentation and public product descriptions rather than independent clinical trials.

- **Non-diagnostic boundary:** LAMBING provides general health literacy and campus clinic navigation only; it cannot diagnose symptoms or replace medical consultation.
- **Institutional variation:** Medical clearance requirements and operating hours reflect general campus clinic workflows and may vary depending on academic term guidelines.
- **Frontend-only scope:** The repository currently covers frontend structure, content, and UI interactivity while awaiting backend chatbot integration.

---

## Current Development Progress

The project began as a structured concept for **CC 100** and has progressed into a responsive multi-section web prototype.

### Completed

- Designed and built the single-page semantic layout (`index.html`) and responsive stylesheet (`css/style.css`).
- Compiled structured research profiles and interactive detail modals (`js/tools-data.js`) for all 10 medical AI platforms.
- Implemented category filtering (*All Systems*, *Medical Imaging*, *Heart & Vitals*, *Early Screening*, *Clinical Assistant*).
- Added four campus care guides and campus clinic desk contact details.
- Created an isolated `#chatbot-root` mount frame in the AI Health Hub for backend integration.

### Next Steps

- Integrate the live conversational AI service developed by the backend developer into `#chatbot-root`.
- Populate `assets/images/` with high-resolution, properly licensed clinical and campus wellness photographs.
- Refine desktop and mobile component layouts in Google Stitch and Figma before final project presentation.

**Current limitation:** The existing build renders static campus care guides, interactive AI system modals, and a ready backend mount container, but does not yet feature live chatbot responses or functional form submission.

---

## Project Files

| File | Description |
| :--- | :--- |
| `index.html` | Main single-page structure containing the hero, initiative overview, 10-tool directory, care guides, modal, and `#chatbot-root` mount. |
| `css/style.css` | Responsive layout grids, typography rules, theme variables, and modal styling. |
| `js/tools-data.js` | Research dataset for the 10 clinical AI systems, category filter logic, and detail modal controller. |
| `assets/icons/favicon.svg` | Custom SVG medical cross brand icon. |
| `assets/images/` | Local directory for hero, initiative, and medical AI platform photographs. |

---

## How to Run

1. **Clone or Download the Repository**
   Download the project folder to your local machine.
2. **Add Local Image Assets (Optional)**
   Place `.jpg` photographs inside `assets/images/` matching the filenames referenced in `index.html` (`hero-medical.jpg`, `about-care.jpg`, and `tool-*.jpg`). Built-in gradient fallbacks prevent broken layouts if images are omitted.
3. **Open in a Web Browser**
   Open `index.html` directly in any modern browser, or run a local development server (such as VS Code Live Server) for live reload while editing.
4. **Backend Chatbot Integration**
   To attach the conversational assistant, mount the chatbot UI directly onto `<div id="chatbot-root"></div>` inside the **AI Health Hub** section of `index.html`.

---

## Data Sources

### Currently Used

- **Official Clinical AI Product Documentation:** Aidoc, Lunit, Abridge, Eko Health, Heartflow, Gleamer, Digital Diagnostics, Skin Analytics, Ultromics, and Ibex Medical Analytics.
- **Campus Health Services Guidelines:** Standard student medical/dental clearance checklists and wellness triage thresholds.

### Planned Data Sources

- **Backend Conversational AI Service:** To power interactive student wellness Q&A inside `#chatbot-root`.

---

## Project Status

**LAMBING** is an early-stage student web development project created for **CC 100 – Introduction to Computing**. Current development focuses on clear information architecture, accurate medical AI literacy, and modular frontend engineering so the conversational assistant can be seamlessly integrated by the backend developer.