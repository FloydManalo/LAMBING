# LAMBING
**Learning AI for Medical Benefits, Innovation, and Nurturing Guidance**

A student-friendly health literacy web app that explains how real-world artificial intelligence helps doctors and patients in hospitals—without the confusing medical jargon or sci-fi myths.

---

## About the Project
Artificial intelligence is already helping hospitals spot illnesses earlier, handle emergencies faster, and give doctors more time to talk with patients. However, most information online is either packed with heavy technical terms or mixed up with fake health claims.

**LAMBING** makes real medical AI easy to understand. It breaks down how 10 real-world healthcare tools work in plain language—showing that AI acts as a helpful "second pair of eyes," while real doctors always make the final call.

---

## Key Features
* **Smooth Scroll Intro:** Full-screen scroll animation introducing the project mission.
* **Interactive Preview Tablet:** Clickable dashboard tabs covering the project overview, AI tools, health tips, and research team.
* **4-Step Hospital Workflow:** Interactive cards showing the real path from hospital scan to doctor sign-off:
  1. **Capture:** Medical devices collect scans, heart sounds, or photos.
  2. **Highlight:** Specialized AI flags important patterns for the doctor.
  3. **Verify:** A licensed doctor checks and confirms every result.
  4. **Care:** Faster emergency response and more face-to-face time with patients.
* **Benefits & Limits Showcase:** Visual breakdown of how AI helps in hospitals, paired with honest notes on what AI *cannot* do.
* **10 Real Clinical AI Tools:** A filterable directory featuring real systems used in hospitals today (including **Aidoc**, **Lunit**, **Abridge**, **Eko Health**, **Heartflow**, **Gleamer**, **LumineticsCore**, **Skin Analytics**, **Ultromics**, and **Ibex**).
* **Ready-to-Connect Q&A Box:** A built-in chat interface ready for future AI backend integration.

---

## Tech Stack
* **HTML5** – Single-page structure and semantic layout
* **CSS3** – Custom dark/light themes, responsive grid, and hover-to-expand animations
* **Vanilla JavaScript** – Scroll-driven canvas animation, interactive tabs, and tool filtering
* **SVG Graphics** – Custom vector illustrations and official product logos

---

## Project Structure
```text
LAMBING/
├── index.html          # Main web page
├── css/
│   └── style.css       # Layout, themes, and animations
├── js/
│   ├── main.js         # Scroll effects and interactive UI controls
│   ├── tools-data.js   # Data and filters for the 10 AI tools
│   └── chatbot.js      # Q&A chat container setup
├── assets/
│   ├── icons/          # Browser and UI icons
│   ├── logos/          # Logos for the 10 healthcare AI systems
│   └── images/         # Custom SVG illustrations and hero visuals
└── README.md           # Project documentation
