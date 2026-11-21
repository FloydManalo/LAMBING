# LAMBING

**Learning AI for Medical Benefits, Innovation, and Nurturing Guidance** — a simple, student-friendly website that explains how real-world artificial intelligence helps doctors and patients in healthcare, paired with basic campus wellness tips for college students.

Developed by Floyd Manalo, Jesus Rombano, Yerahmiel De Roxas, and Kirby Braceros, 1st-year BS Computer Science students at Batangas State University - Alangilan, for **CC 100 – Introduction to Computing** (Category 9: Information Technology and Artificial Intelligence – AI-Powered Healthcare Systems).

## The Problem

Artificial intelligence is already helping hospitals spot diseases earlier, handle emergencies faster, and give doctors more time with patients. However, most explanations online are either too technical for students to read or mixed up with sci-fi myths and unverified health advice.

At the same time, campus clinics often get busy with basic questions—like medical clearance requirements—while students sometimes just need a quick guide on when to rest and when to see the school nurse.

**LAMBING** solves both by explaining the real benefits of medical AI in plain language while sharing helpful campus wellness reminders.

## The Idea

LAMBING focuses on **three main ways AI helps in healthcare**, backed by real tools used in hospitals today:

* **Faster Emergency Triage** – AI quickly checks medical scans to spot urgent problems like strokes or broken bones so emergency teams can treat critical patients right away (`Aidoc`, `Gleamer`).
* **Earlier Disease Detection** – AI helps doctors catch early warning signs in X-rays, heart sounds, eye scans, skin checks, and lab tests while illnesses are still easier to treat (`Lunit`, `Eko Health`, `Heartflow`, `LumineticsCore`, `Skin Analytics`, `Ultromics`, `Ibex`).
* **Less Paperwork, More Human Care** – AI note-taking tools listen during checkups and write down clinical notes automatically, giving doctors more time to talk with their patients (`Abridge`).

To make the site extra useful for students, we also included:

* **Quick Campus Care Guides** – Simple checklists for medical/dental clearance, fever care, screen-time eye strain, and minor first aid.
* **Q&A Chat Box (`#chatbot-root`)** – A dedicated spot on the page where our backend teammate can connect a simple Q&A assistant to answer student questions about medical AI.

## Clinical AI System Research

Instead of using fictional examples, we researched 10 real healthcare AI tools using their official product guides across four areas: **Medical Imaging**, **Heart & Vitals**, **Early Screening**, and **Clinical Assistant**.

### The 10 AI Tools We Reviewed

1. **Aidoc** *(Medical Imaging)* – Checks scans right away to spot urgent conditions like strokes and brain aneurysms so emergency teams can act faster.
2. **Lunit** *(Medical Imaging)* – Examines chest X-rays, mammograms, and tissue samples to help doctors detect signs of cancer earlier.
3. **Abridge** *(Clinical Assistant)* – Turns doctor-patient conversations into organized medical notes automatically, cutting down paperwork for doctors.
4. **Eko Health – SENSORA** *(Heart & Vitals)* – Pairs with digital stethoscopes to detect irregular heartbeats (like atrial fibrillation) and heart murmurs during checkups.
5. **Heartflow Analysis** *(Heart & Vitals)* – Builds a 3D model of a patient's heart arteries from a CT scan to check how plaque affects blood flow.
6. **Gleamer** *(Medical Imaging)* – Uses specialized X-ray and CT tools (*BoneView*, *ChestView*, *LungCT*, *BreastView*) to help clinicians spot fractures and abnormalities quickly.
7. **Digital Diagnostics – LumineticsCore** *(Early Screening)* – Checks eye scans in adults with diabetes to catch early signs of diabetic eye disease without long wait times.
8. **Skin Analytics – DERM** *(Early Screening)* – Analyzes close-up photos of moles and skin spots to flag possible skin cancer and prioritize urgent dermatologist visits.
9. **Ultromics – EchoGo** *(Heart & Vitals)* – Reviews heart ultrasound scans to help doctors spot tricky heart conditions that are easy to miss.
10. **Ibex Medical Analytics** *(Early Screening)* – Helps pathologists review digital biopsy slides to detect breast, prostate, and stomach cancers more accurately.

### What We Learned

* **AI helps doctors—it doesn't replace them:** Every tool we studied works like a smart second pair of eyes, and a licensed doctor still makes the final call.
* **Speed matters in emergencies:** Tools like Aidoc and Gleamer help hospital teams spot critical injuries and strokes much sooner.
* **Catching illness early saves lives:** Screening tools help doctors find subtle health issues before they get worse.
* **AI can make care feel more personal:** Tools like Abridge handle repetitive typing so doctors can focus face-to-face on their patients.

## Limitations

* **For learning only (not medical advice):** LAMBING is an educational website. It cannot diagnose symptoms or replace a visit to a doctor or campus nurse.
* **Campus details may change:** Clearance steps and clinic hours follow general campus routines and may vary by semester.
* **Frontend-only for now:** The website layout, filters, and tool popups are ready, while the live Q&A chat box is waiting for backend integration.

## Development Progress

### Completed

* Built the responsive webpage layout (`index.html`) and styling (`css/style.css`).
* Added interactive detail popups (`js/tools-data.js`) showing how each of the 10 medical AI tools works, along with its pros and limitations.
* Added category filter buttons (*All Systems*, *Medical Imaging*, *Heart & Vitals*, *Early Screening*, *Clinical Assistant*).
* Wrote student-friendly campus care guides and responsible AI reminders.
* Prepared an empty `#chatbot-root` container for our backend developer to connect the Q&A chat feature.

### Next Steps

* Connect the live Q&A assistant into `#chatbot-root`.
* Add local medical and campus wellness photos inside `assets/images/`.
* Do final copy and layout checks before our CC 100 presentation.

## Project Files

| File | Description |
| :--- | :--- |
| `index.html` | Main webpage with the hero banner, medical AI benefits, 10-tool directory, care guides, detail popup, and `#chatbot-root` box. |
| `css/style.css` | Stylesheet for page layout, colors, fonts, mobile responsiveness, and popups. |
| `js/main.js` | Handles navigation and general page interactions. |
| `js/tools-data.js` | Stores info for all 10 medical AI tools, category filters, and popup controls. |
| `js/chatbot.js` | Script file ready for mounting the Q&A assistant inside `#chatbot-root`. |
| `assets/icons/favicon.svg` | Medical cross icon for the browser tab and navbar. |
| `assets/images/` | Folder for local hero, wellness, and medical AI images. |

## How to Run

1. **Download the Project** – Save the `LAMBING` folder to your computer.
2. **Add Images (Optional)** – Place `.jpg` photos inside `assets/images/` (`hero-medical.jpg`, `about-care.jpg`, and `tool-*.jpg`). Built-in gradient backgrounds keep cards looking neat even without images.
3. **Open in a Browser** – Double-click `index.html` to view the website, or open it using VS Code **Live Server**.
4. **Connect the Q&A Bot (Backend)** – Mount the conversational Q&A UI inside `<div id="chatbot-root"></div>` in `index.html`.

## Data Sources

* **Official Medical AI Product Guides:** Aidoc, Lunit, Abridge, Eko Health, Heartflow, Gleamer, Digital Diagnostics, Skin Analytics, Ultromics, and Ibex Medical Analytics.
* **Campus Health Services Guidelines:** General student medical/dental clearance checklists and basic wellness reminders.

## Project Status

**LAMBING** is an active 1st-year student project for **CC 100 – Introduction to Computing**. Right now, the frontend layout and medical AI research are complete, and the `#chatbot-root` container is ready for our backend teammate to plug in the Q&A assistant.