# LAMBING
**Learning AI for Medical Benefits, Innovation, and Nurturing Guidance** — a student-friendly health literacy portal that explains how real-world artificial intelligence helps doctors and patients in clinical care, paired with practical health literacy takeaways for college students.

Developed by **Francis Floyd G. Manalo**, **Jesus Karol M. Rombano**, **Yerahmiel M. De Roxas**, and **John Kirby G. Braceros** — 1st-year BS Computer Science students at **Batangas State University - Alangilan** (CICS), for **CC 100 – Introduction to Computing** *(Category 9: Information Technology and Artificial Intelligence – AI-Powered Healthcare Systems)*.

---

## The Problem
Artificial intelligence is already helping hospitals spot diseases earlier, handle emergencies faster, and give doctors more face-to-face time with patients. However, most explanations online are either too technical for students to digest or mixed up with sci-fi myths and unverified health claims.

**LAMBING** bridges that gap by translating real clinical AI workflows into plain, accessible language—making it clear that medical AI acts as a **second pair of eyes** while licensed physicians remain in full control of every diagnosis.

---

## Key Features & Page Architecture
- **Scroll-Driven Hero & Initiative Reveal (`#hero-stage`):** Full-viewport scroll stage with transparent alpha canvas overlays that introduces the LAMBING mission and research scope.
- **Interactive Tablet Showcase (`#tablet`):** Multi-tab dashboard preview covering *Overview*, *AI Systems*, *AI Literacy*, *Researchers*, and *R&D Scope*.
- **4-Step Clinical Workflow (`#how`):** Interactive hover-to-expand cards tracing the real clinical path:
  1. *Hospital devices capture medical data* (scans, heart audio, close-up images, visit speech)
  2. *10 specialized systems highlight key patterns* across 4 clinical domains
  3. *A licensed doctor verifies every AI alert* (100% physician sign-off)
  4. *Faster triage & more human focus*
- **Dark Obsidian Clinical Benefits Stage (`#advantages`):** Compact interactive split showcase with custom SVG illustrations (`adv-urgent.svg`, `adv-early.svg`, `adv-paperwork.svg`, `adv-wait.svg`, `adv-checkup.svg`) plus a dedicated view of shared limitations across all 10 platforms.
- **AI Health Hub Constellation (`#ai-hub`):** Floating, hover-to-expand visual collage featuring all 10 researched clinical AI systems and their logos.
- **10-System Directory & Literacy Takeaways (`#ai-tools`, `#guides`):** Filterable catalog and plain-language health literacy takeaways.
- **R&D Q&A Companion (`#chatbot-root`):** Backend-ready conversational Q&A container placed after the tool directory and literacy guides so visitors can ask follow-up questions after exploring the platforms.

---

## Clinical AI System Research
Instead of using fictional examples, we researched **10 real healthcare AI systems** using their official product guides across four clinical domains: **Medical Imaging**, **Heart & Vitals**, **Early Screening**, and **Clinical Assistant**.

| # | System | Domain | Clinical Role |
| :- | :--- | :--- | :--- |
| **01** | **Aidoc** | Medical Imaging | Flags urgent findings like strokes and brain aneurysms on scans so emergency teams act faster. |
| **02** | **Lunit** | Medical Imaging | Analyzes chest X-rays, mammograms, and pathology slides to help detect cancer signs earlier. |
| **03** | **Abridge** | Clinical Assistant | Converts doctor–patient conversations into structured clinical notes automatically. |
| **04** | **Eko Health – SENSORA** | Heart & Vitals | Pairs with digital stethoscopes to detect atrial fibrillation and heart murmurs during routine exams. |
| **05** | **Heartflow Analysis** | Heart & Vitals | Builds a 3D model of coronary arteries from CT scans to evaluate how plaque affects blood flow. |
| **06** | **Gleamer** | Medical Imaging | Uses specialized X-ray and CT modules (*BoneView, ChestView, LungCT, BreastView*) to spot fractures and abnormalities. |
| **07** | **Digital Diagnostics – LumineticsCore** | Early Screening | Evaluates diabetic eye scans at the point of care to catch early diabetic retinopathy without long waits. |
| **08** | **Skin Analytics – DERM** | Early Screening | Assesses close-up images of skin lesions to flag possible skin cancer and prioritize urgent dermatologist referrals. |
| **09** | **Ultromics – EchoGo** | Heart & Vitals | Analyzes echocardiograms (heart ultrasounds) to help clinicians detect subtle heart failure indicators. |
| **10** | **Ibex Medical Analytics** | Early Screening | Assists pathologists in reviewing digital biopsy slides for breast, prostate, and gastric cancers. |

---

## What We Learned
- **AI assists doctors—it never replaces them:** Every platform we studied acts as a decision-support tool; a licensed physician always reviews and confirms the final diagnosis.
- **Speed saves lives in emergencies:** Triage tools like Aidoc and Gleamer surface critical strokes and fractures within minutes.
- **Early detection improves outcomes:** Point-of-care and screening systems catch subtle signs across retina, skin, cardiac, and biopsy exams before conditions worsen.
- **Less typing means better bedside care:** Ambient documentation tools like Abridge reduce administrative burden so clinicians can focus on patients.

---

## Limitations & Disclaimer
- **Educational Literacy Only (Not Medical Advice):** LAMBING is a student research and health literacy portal. It does not diagnose symptoms, interpret personal medical scans, or replace a visit to a licensed physician or campus clinic.
- **Frontend Prototype:** All interactive animations, visual schematics, SVG illustrations, and tool profiles are complete; the `#chatbot-root` Q&A assistant is structured and ready for backend API integration.

---

## Project Structure
```text
LAMBING/
├── index.html              # Main single-page application (Hero, Tablet, Stepper, Advantages, AI Hub, Tools, Chatbot)
├── css/
│   └── style.css           # Responsive styles, scroll transitions, hover-to-expand cards, and dark/light themes
├── js/
│   ├── main.js             # Canvas hero animation, stepper cards, advantages switcher, and AI Health Hub collage
│   ├── tools-data.js       # Structured dataset and filter controls for the 10 clinical AI systems
│   └── chatbot.js          # Backend-ready mount point for the #chatbot-root Q&A companion
├── assets/
│   ├── icons/              # Favicon and UI icons
│   ├── logos/              # Official logos for all 10 researched clinical AI systems
│   └── images/             # Custom SVG clinical illustrations (adv-*.svg) and hero media
└── README.md               # Project documentation