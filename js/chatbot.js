/* ==========================================
   LAMBING AI - RULE-BASED FIRST AID ASSISTANT
   Simulated small language model
   No Gemini | No API | No Backend Required

   500 intents = 50 first-aid topics x 10 situations.
   The "model" is a lightweight NLP engine:
   normalization -> synonyms -> typo tolerance ->
   emergency detection -> context detection -> scoring.
========================================== */

(function () {
  "use strict";

  const cfg = {
    title: "LAMBING AI",
    greeting:
      "Hi! I'm LAMBING AI. I can help you understand basic first aid and what to do during common emergencies. What's happening?",
    placeholder: "Describe what happened...",
    accent: "#FF4A1C",
    ...(window.LAMBING_CHAT || {})
  };

  let busy = false;

  /* ==========================================
  1. LANGUAGE DATA
  ========================================== */

  /* ---------- A. SYNONYM DICTIONARY ---------- */

  const SYNONYMS = {
    // Wounds and bleeding
    bleeding: ["bleed", "bleeds", "bled", "bleeding", "hemorrhage", "haemorrhage"],
    cut: ["cuts", "wound", "wounds", "laceration", "lacerations", "sliced"],
    scrape: ["abrasion", "road rash", "scraped", "scrapes", "graze", "grazed"],
    bruise: ["bruising", "bruised", "contusion", "black and blue"],
    puncture: ["puncture", "punctured", "stab wound", "pierced"],

    // Burns
    burn: ["burns", "burned", "burnt", "scald", "scalded", "scalding"],
    chemical: ["acid", "bleach", "cleaner", "detergent", "chemical"],
    electrical: ["electric", "electrical", "electrocuted", "shock", "shocked"],

    // Breathing
    choking: ["choked", "choking", "chokes", "choke", "something stuck in throat"],
    breathing: ["breathe", "breathing", "respiration", "breath"],
    wheezing: ["wheeze", "wheezing"],
    asthma: ["asthma", "asthmatic"],

    // Heart and neurological emergencies
    heart: ["cardiac", "heart"],
    stroke: ["stroke", "brain attack"],
    seizure: ["convulsion", "convulsions", "convulsing", "seizures", "epileptic"],
    faint: ["fainting", "fainted", "passed out", "pass out", "blacked out"],

    // Injuries
    fracture: ["fracture", "broken", "broke", "cracked bone"],
    bite: ["bit", "bitten", "biting", "bites"],
    swallow: ["swallowed", "swallowing", "ingested", "drank", "ate"],
    fall: ["fell", "fallen", "falling", "tripped"],
    sprain: ["sprained", "twisted", "twisting", "twist"],
    dislocation: ["dislocated", "joint out of place"],
    swelling: ["swollen", "swelling", "puffy"],

    // Environmental emergencies
    heat: ["hot weather", "overheated", "heat exposure"],
    cold: ["freezing", "very cold", "cold exposure"],
    drowning: ["submerged", "underwater", "near drowning"],

    // Poisoning
    poison: ["poisoned", "toxic", "toxin", "poisoning"],
    overdose: ["overdosed", "too much medication"],

    // Eye, ear, and dental
    eye: ["eyes", "eyeball", "vision"],
    tooth: ["teeth", "dental", "tooth"],
    ear: ["ears", "ear canal"],

    // General symptoms
    pain: ["ache", "aching", "hurting", "hurt", "hurts", "sore"],
    dizzy: ["dizziness", "lightheaded", "light headed"],
    vomiting: ["vomit", "throwing up", "threw up"],
    fever: ["febrile", "high temperature", "body temperature"]
  };

  const STOP_WORDS = new Set([
    "a", "an", "the", "is", "am", "are", "was", "were", "be", "been", "i", "me", "my",
    "mine", "we", "our", "you", "your", "he", "she", "it", "its", "they", "them", "his",
    "her", "their", "to", "of", "in", "on", "at", "and", "or", "with", "what", "should",
    "do", "does", "did", "how", "help", "about", "for", "from", "has", "have", "had",
    "that", "this", "there", "just", "please", "can", "will", "would", "could", "so",
    "as", "by", "into", "up", "out", "some", "something", "someone", "get", "got", "now",
    "think", "off", "down", "over", "after", "while", "during", "when", "if", "but", "also", "because", "then", "than", "like"
  ]);

  /* ---------- B. TEXT NORMALIZATION ---------- */

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function normalizeQuestion(question) {
    let text = String(question || "")
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s'-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Normalize contractions to one consistent form.
    text = text
      .replace(/\bcan'?t\b/g, "cannot")
      .replace(/\bcan not\b/g, "cannot")
      .replace(/\bwon'?t\b/g, "will not")
      .replace(/\bdon'?t\b/g, "do not")
      .replace(/\bdoesn't\b/g, "does not")
      .replace(/\bdidn't\b/g, "did not")
      .replace(/\bisn't\b/g, "is not")
      .replace(/\bcouldn't\b/g, "could not")
      .replace(/\bi'm\b/g, "i am")
      .replace(/\bit's\b/g, "it is");

    // Normalize selected plural forms.
    text = text
      .replace(/\bchemicals\b/g, "chemical")
      .replace(/\beyes\b/g, "eye")
      .replace(/\bwounds\b/g, "wound")
      .replace(/\bburns\b/g, "burn")
      .replace(/\bcuts\b/g, "cut")
      .replace(/\bbites\b/g, "bite")
      .replace(/\bteeth\b/g, "tooth");

    return text;
  }

  // Single-word synonyms go in a lookup table; multi-word ones become phrase rules.
  const SYNONYM_LOOKUP = {};
  const PHRASE_SYNONYMS = [];

  for (const [canonical, variations] of Object.entries(SYNONYMS)) {
    for (const variation of variations) {
      const norm = normalizeQuestion(variation);
      if (norm.includes(" ")) {
        PHRASE_SYNONYMS.push({
          re: new RegExp(`\\b${escapeRegExp(norm)}\\b`, "g"),
          length: norm.length,
          canonical
        });
      } else {
        SYNONYM_LOOKUP[norm] = canonical;
      }
    }
  }
  PHRASE_SYNONYMS.sort((a, b) => b.length - a.length);

  /* ---------- C. TOKEN EXTRACTION ---------- */

  // Very light stemmer so "burned/burn", "swallowed/swallow", "bleeding/bleed" agree.
  function stem(word) {
    if (word.length <= 4) return word;
    if (word.endsWith("ing") && word.length - 3 >= 4) return word.slice(0, -3);
    if (word.endsWith("ed") && word.length - 2 >= 4) return word.slice(0, -2);
    if (word.endsWith("s") && !word.endsWith("ss") && word.length - 1 >= 4) return word.slice(0, -1);
    return word;
  }

  let VOCAB = null; // Map(stem -> final token), filled after the intents are built

  function correctToken(token) {
    if (!VOCAB || VOCAB.has(token) || token.length < 6) return token;
    for (const [word, final] of VOCAB) {
      if (Math.abs(word.length - token.length) <= 1 && word.length >= 6 &&
          levenshteinDistance(token, word) <= 1) {
        return final;
      }
    }
    return token;
  }

  function extractQuestionTokens(text, correctTypos) {
    let normalized = normalizeQuestion(text);

    for (const rule of PHRASE_SYNONYMS) {
      normalized = normalized.replace(rule.re, rule.canonical);
    }

    return normalized
      .split(/\s+/)
      .filter(token => token.length > 1 && !STOP_WORDS.has(token))
      .map(token => stem(SYNONYM_LOOKUP[token] || token))
      .map(token => (correctTypos ? correctToken(token) : token));
  }

  /* ---------- D. TYPO SIMILARITY ---------- */

  function levenshteinDistance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);

    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    return matrix[b.length][a.length];
  }

  function wordsAreSimilar(a, b) {
    if (a === b) return true;
    // Avoid fuzzy matching short words because it creates false matches.
    if (a.length < 5 || b.length < 5) return false;
    return levenshteinDistance(a, b) <= 1;
  }

  /* ---------- E. CONTEXT DETECTION ---------- */

  const CONTEXT_KEYWORDS = {
    at_home: ["at home", "inside the house", "in my house", "in the kitchen", "in the bathroom"],
    at_school: ["at school", "in school", "inside the classroom", "in class", "in the classroom"],
    at_work: ["at work", "in the office", "at my workplace", "at the office", "at the factory"],
    during_sports: ["during sports", "while exercising", "during exercise", "while playing", "during a game", "during practice", "while running"],
    on_the_street: ["on the street", "outside", "on the road", "on the sidewalk", "in the street"],
    after_a_fall: ["after a fall", "after falling", "when i fell", "after i fell", "fell down", "fell off", "fell from"],
    after_an_accident: ["after an accident", "during an accident", "vehicle accident", "car accident", "motorcycle accident", "road accident", "crash"],
    while_alone: ["while alone", "i am alone", "by myself", "no one is around", "nobody is around", "home alone"],
    helping_someone: ["helping someone", "my friend", "another person", "a stranger", "my classmate", "my coworker", "my neighbor"],
    in_a_child: ["in a child", "my child", "my baby", "my kid", "my son", "my daughter", "my toddler", "a child", "a baby", "an infant"]
  };

  function detectContext(question) {
    const text = normalizeQuestion(question);

    for (const [contextId, phrases] of Object.entries(CONTEXT_KEYWORDS)) {
      if (phrases.some(phrase => text.includes(phrase))) return contextId;
    }
    return null;
  }

  /* ---------- F. EMERGENCY DETECTION ---------- */

  /*
    Emergency signals are checked separately so an ordinary keyword
    match can never hide an immediately life-threatening situation.
    Patterns run on normalized text (cannot, will not, etc.).
  */

  const EMERGENCY_SIGNALS = [
    { id: "not_breathing", boosts: ["cardiac_arrest"],
      pattern: /\b(not breathing|stopped breathing|no normal breathing|only gasping|gasping for air)\b/i },
    { id: "cannot_breathe", boosts: ["asthma_attack"],
      pattern: /\b(cannot breathe|difficulty breathing|struggling to breathe|short of breath)\b/i },
    { id: "severe_bleeding", boosts: ["severe_bleeding"],
      pattern: /\b(blood is pouring|bleeding heavily|bleeding badly|uncontrolled bleeding|blood will not stop|bleeding will not stop|cannot stop the bleeding)\b/i },
    { id: "unconscious", boosts: ["cardiac_arrest"],
      pattern: /\b(unconscious|unresponsive|will not wake up|cannot wake them|cannot wake him|cannot wake her)\b/i },
    { id: "severe_choking", boosts: ["choking_adult"],
      pattern: /\b(cannot speak and breathe|cannot cough or breathe|choking and cannot breathe|airway blocked|cannot cough or speak)\b/i },
    { id: "anaphylaxis", boosts: ["anaphylaxis"],
      pattern: /\b(throat is closing|tongue swelling|tongue is swelling|throat swelling|severe allergic reaction|anaphylaxis)\b/i },
    { id: "stroke", boosts: ["stroke"],
      pattern: /\b(face drooping|face is drooping|one side of face|sudden arm weakness|slurred speech|signs of stroke)\b/i },
    { id: "cardiac", boosts: ["chest_pain"],
      pattern: /\b(possible heart attack|heart attack|crushing chest pain|severe chest pressure|chest pain and shortness of breath)\b/i },
    { id: "prolonged_seizure", boosts: ["seizure"],
      pattern: /\b(seizure lasting five minutes|seizure for 5 minutes|seizure lasting more than five minutes|seizure lasting 5 minutes|repeated seizures)\b/i },
    { id: "drowning", boosts: ["drowning"],
      pattern: /\b(drowning|underwater and not breathing|pulled from water and not breathing)\b/i },
    { id: "electrical", boosts: ["electrical_burn"],
      pattern: /\b(electrocuted|electric shock and unconscious|electrical injury and not breathing)\b/i }
  ];

  function detectEmergency(question) {
    const text = normalizeQuestion(question);
    return EMERGENCY_SIGNALS.filter(signal => signal.pattern.test(text));
  }

  /* ==========================================
  2. FIRST AID RESPONSE DATABASE (500 ENTRIES)

     50 topics x 10 situations = 500 intents.

     Each topic: [id, category, label, phrases, response]
  ========================================== */

  const TOPICS = [
    ["minor_cut", "Wounds and bleeding", "Minor cut on the hand", "small cut on my hand;cut on my finger;minor hand cut;i cut myself;i cut my hand",
     "Wash your hands. Rinse the cut under clean running water, apply gentle pressure if it is bleeding, and cover it with a clean dressing. Change the dressing when wet or dirty. Seek care for a deep or gaping cut, persistent bleeding, loss of sensation or movement, or signs of infection."],
    ["deep_cut", "Wounds and bleeding", "Deep or gaping cut", "deep cut;gaping wound;cut that looks deep",
     "Apply firm, continuous direct pressure with sterile gauze or a clean cloth. If blood soaks through, add more material without removing the first layer. Do not probe the wound or remove embedded objects. Arrange urgent medical care; call emergency services for severe or uncontrolled bleeding."],
    ["puncture_wound", "Wounds and bleeding", "Puncture wound", "puncture wound;stepped on something sharp;deep nail puncture",
     "Do not dig into the wound or try to remove a deeply embedded object. Control bleeding with gentle pressure around the object, cover with a clean dressing, and seek prompt medical assessment. A clinician should assess infection and tetanus risk."],
    ["abrasion", "Wounds and bleeding", "Skin scrape or abrasion", "scraped skin;road rash;skin rubbed off",
     "Rinse the area with clean running water and gently remove loose surface dirt. Avoid harsh scrubbing. Cover with a clean non-stick dressing and change it regularly. Seek care if the area is extensive, contaminated, very painful, or shows infection."],
    ["severe_bleeding", "Wounds and bleeding", "Severe external bleeding", "blood is pouring out;heavy bleeding;bleeding will not stop;i am bleeding a lot;bleeding a lot",
     "Call emergency services immediately. Apply firm, continuous pressure directly to the wound with gauze or cloth. Do not repeatedly lift the dressing to check. If an object is embedded, do not remove it; apply pressure around it. Follow the emergency dispatcher’s instructions."],
    ["nosebleed", "Wounds and bleeding", "Nosebleed", "nosebleed;blood coming from my nose;nose is bleeding",
     "Sit upright, lean forward, and pinch the soft part of the nose continuously for 10–15 minutes while breathing through the mouth. Do not tilt the head back or pack the nose with tissue. Seek urgent care for heavy bleeding, injury, breathing difficulty, or bleeding that persists."],
    ["bruising", "Wounds and bleeding", "Bruise after a bump", "bruise after hitting something;black and blue mark;contusion",
     "Rest the area and apply a cold pack wrapped in cloth for short intervals. Do not put ice directly on skin. Seek medical assessment for severe pain, major swelling, a rapidly expanding bruise, unexplained bruising, or use of blood-thinning medication."],
    ["embedded_object", "Wounds and bleeding", "Object embedded in a wound", "glass stuck in wound;knife stuck in skin;object embedded in wound",
     "Do not pull out or push the object further in. Apply pressure around it to control bleeding, stabilize it with bulky dressings if possible, and seek emergency medical care. Call emergency services for severe bleeding or a large/deep object."],
    ["amputation", "Wounds and bleeding", "Traumatic finger or limb amputation", "finger cut off;amputated finger;limb severed",
     "Call emergency services immediately and control bleeding with firm direct pressure. Do not wash or scrub the severed part. Wrap it in clean, slightly damp gauze, place it in a sealed bag, and keep the bag cool in a container of ice water; do not place tissue directly on ice. Send it with the person to hospital."],
    ["animal_bite", "Wounds and bleeding", "Animal bite wound", "dog bite;cat bite;animal bit me;bitten by a dog;i was bitten by an animal",
     "Wash the wound immediately with soap and running water for at least 15 minutes. Control bleeding with clean gauze and cover loosely. Seek medical care promptly for rabies risk assessment, wound care, and tetanus review. Do not wait for symptoms of rabies."],
    ["human_bite", "Wounds and bleeding", "Human bite wound", "human bite;someone bit me;person bit my hand",
     "Wash the wound thoroughly with soap and running water. Control bleeding and cover with a clean dressing. Seek prompt medical assessment because human bites can become infected and may need specific treatment."],
    ["burn_minor", "Burns", "Small thermal burn", "small burn;burned my finger;minor hot surface burn;i burned myself;i burned my hand",
     "Cool the burn under cool or lukewarm running water for 20 minutes as soon as possible. Remove nearby jewelry or loose clothing unless stuck to the skin. Do not use ice, butter, toothpaste, or oils. Cover loosely with a clean non-fluffy dressing."],
    ["burn_large", "Burns", "Large or deep burn", "large burn;deep burn;skin looks charred",
     "Call emergency services for a large, deep, or serious burn. Stop the burning process and cool with cool running water if safe, while preventing the person from becoming cold. Do not pull away stuck clothing or apply creams. Cover loosely with a clean, non-fluffy dressing."],
    ["scald", "Burns", "Hot liquid scald", "hot water spilled on me;boiling water burn;tea spilled on skin",
     "Remove wet clothing and jewelry near the burn unless stuck to skin. Cool under cool running water for 20 minutes. Do not use ice or home remedies and do not burst blisters. Seek urgent care for extensive, deep, or sensitive-area burns."],
    ["chemical_burn_skin", "Burns", "Chemical burn on skin", "chemical spilled on skin;cleaner burned my skin;acid on my arm",
     "Protect yourself from the chemical. Remove contaminated clothing and jewelry while avoiding contact with the chemical. Brush off dry powder before flushing, then rinse the skin with plenty of running water for at least 20 minutes. Call emergency services or poison control and bring the product container information."],
    ["chemical_eye", "Burns and eye injuries", "Chemical splash in eye", "chemical in my eye;cleaner splashed in eye;acid got in eye",
     "Immediately rinse the eye continuously with clean lukewarm running water for at least 20 minutes, holding the eyelids open if possible. Remove contact lenses if easy while rinsing. Do not rub or try to neutralize the chemical. Obtain urgent emergency medical care."],
    ["electrical_burn", "Burns", "Electrical injury or burn", "electric shock burn;electrical burn;shocked by wire",
     "Do not touch the person until the power source is switched off and the scene is safe. Call emergency services. Once safe, check responsiveness and normal breathing; start CPR and use an AED if needed and you are able. Electrical injuries need urgent medical assessment even if skin marks look small."],
    ["sunburn", "Burns", "Sunburn", "sunburn;skin burned by sun;red painful skin after sun",
     "Move out of the sun. Cool the skin with a cool shower or damp cloth and drink fluids. Do not apply ice directly or pop blisters. Seek medical care for extensive blistering, severe pain, fever, confusion, or signs of dehydration."],
    ["choking_adult", "Breathing emergencies", "Adult severe choking", "adult choking;food stuck in throat;cannot cough or speak;i am choking;i think i am choking",
     "If the person can cough forcefully, encourage coughing. If they cannot speak, breathe, or cough effectively, call emergency services and give up to 5 back blows followed by up to 5 abdominal thrusts, repeating as needed. If they become unresponsive, begin CPR and follow dispatcher instructions."],
    ["choking_infant", "Breathing emergencies", "Infant choking", "baby choking;infant choking on milk;baby cannot breathe",
     "Call emergency services. For an infant under 1 year with severe choking, give 5 back blows with the infant supported face-down, then 5 chest thrusts; repeat. Do not use abdominal thrusts and do not perform blind finger sweeps. If unresponsive, begin infant CPR if trained and follow dispatcher instructions."],
    ["asthma_attack", "Breathing emergencies", "Asthma attack", "asthma attack;wheezing and short of breath;can't catch my breath asthma",
     "Help the person sit upright and stay calm. Help them use their own prescribed reliever inhaler according to their asthma action plan. Call emergency services if symptoms are severe, worsening, they cannot speak normally, or the inhaler is not helping. Do not leave them alone."],
    ["anaphylaxis", "Allergic reactions", "Severe allergic reaction", "anaphylaxis;throat swelling after food;severe allergic reaction",
     "This is a life-threatening emergency. Call emergency services. Help the person use their prescribed epinephrine auto-injector immediately in the outer mid-thigh, following its instructions. Have them lie flat with legs raised if tolerated; if breathing is difficult, they may sit carefully. Do not let them stand or walk. A second dose may be needed after 5–15 minutes if symptoms persist and another device is available."],
    ["hyperventilation", "Breathing emergencies", "Rapid breathing or hyperventilation", "breathing too fast;hyperventilating;can't slow my breathing",
     "Help the person sit comfortably and speak calmly. Encourage gentle, slow breathing without forcing it. Do not use a paper bag. New, severe, or unexplained breathing difficulty, chest pain, fainting, or blue/grey lips requires emergency assessment."],
    ["drowning", "Breathing emergencies", "Person rescued from water", "pulled someone from water;near drowning;person rescued from pool",
     "Ensure the scene is safe and call emergency services. Get the person out of the water only if safe. Check responsiveness and normal breathing. If they are not breathing normally, start CPR with rescue breaths if trained and use an AED when available. Anyone with breathing symptoms after submersion needs urgent medical evaluation."],
    ["chest_pain", "Heart emergencies", "Possible heart attack or chest pain", "chest pain;pressure in chest;possible heart attack",
     "Call emergency services immediately for new, severe, or unexplained chest pain, especially with breathlessness, sweating, nausea, or pain spreading to the arm, jaw, or back. Have the person rest in a comfortable position. Do not let them drive themselves. Follow dispatcher instructions."],
    ["cardiac_arrest", "Heart emergencies", "Unresponsive person not breathing normally", "person collapsed not breathing;no pulse and unconscious;cardiac arrest",
     "Call emergency services and send someone for an AED. If the person is unresponsive and not breathing normally or is only gasping, begin chest compressions in the center of the chest, hard and fast at 100–120 per minute. Use the AED as soon as available and follow its prompts. Continue until help takes over."],
    ["stroke", "Neurological emergencies", "Possible stroke", "face drooping;arm weakness and speech problem;possible stroke",
     "Call emergency services immediately. Note the time symptoms began or when the person was last known well. Use FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services. Do not give food, drink, or medication. Do not wait for symptoms to improve."],
    ["seizure", "Neurological emergencies", "Generalized seizure", "person having seizure;convulsing;epileptic seizure",
     "Protect the person from nearby hazards and cushion their head. Time the seizure. Do not restrain them and put nothing in their mouth. When movements stop, check breathing and place them on their side if possible. Call emergency services for a first seizure, seizure lasting 5 minutes or more, repeated seizures, injury, pregnancy, or breathing difficulty."],
    ["fainting", "Neurological emergencies", "Fainting episode", "fainted;passed out briefly;feels like fainting;i feel faint;i feel dizzy and might faint",
     "If they feel faint, help them lie flat and raise their legs if there is no injury and it is comfortable. If unconscious, check breathing and call emergency services if they do not wake promptly or are not breathing normally. Do not give food or drink until fully alert. Unexplained fainting needs medical assessment."],
    ["head_injury", "Head injuries", "Head injury or concussion concern", "hit my head;concussion;head injury after fall",
     "Stop activity and seek medical assessment after a significant head injury. Call emergency services for loss of consciousness, worsening headache, repeated vomiting, seizure, confusion, weakness, unequal pupils, or blood/fluid from the ears or nose. Keep the neck still if spinal injury is possible. Do not leave the person alone."],
    ["spinal_injury", "Head and spinal injuries", "Suspected neck or spinal injury", "neck injury after accident;possible spinal injury;back injury after fall",
     "Call emergency services. Ask the person not to move and keep the head and neck in the position found. Do not try to straighten them or move them unless there is immediate danger or you must open the airway. Monitor breathing and follow dispatcher instructions."],
    ["fracture_arm", "Bone and joint injuries", "Possible arm fracture", "broken arm;arm fracture;arm looks deformed",
     "Keep the arm still in the position found and support it with padding or a sling if this does not cause pain. Do not straighten the limb or push exposed bone back in. Cover any open wound with a sterile dressing. Seek urgent medical care; call emergency services for severe injury or poor circulation."],
    ["fracture_leg", "Bone and joint injuries", "Possible leg fracture", "broken leg;leg fracture;cannot stand after leg injury",
     "Do not move or straighten the leg. Keep the person still and support the limb in the position found. Do not allow them to walk. Call emergency services for deformity, an open fracture, severe pain, or suspected hip/thigh injury."],
    ["sprain_ankle", "Bone and joint injuries", "Ankle sprain", "twisted ankle;ankle swelling after running;ankle sprain",
     "Protect the ankle and stop activities that cause pain. Rest, apply a cold pack wrapped in cloth for up to 20 minutes at a time, use comfortable compression if appropriate, and elevate it. Seek assessment if unable to bear weight, pain is severe, or fracture is possible."],
    ["sprain_wrist", "Bone and joint injuries", "Wrist sprain", "twisted wrist;wrist swelling after fall;wrist sprain",
     "Rest and protect the wrist. Apply a cold pack wrapped in cloth for up to 20 minutes at a time and elevate it. Remove rings before swelling increases. Seek medical assessment for deformity, severe pain, numbness, or difficulty moving the wrist."],
    ["dislocation", "Bone and joint injuries", "Joint dislocation", "dislocated shoulder;joint out of place;elbow dislocation",
     "Keep the joint still in the position found. Do not try to put it back in place. Apply a cold pack wrapped in cloth if tolerated and seek urgent medical care. Call emergency services if there is severe pain, numbness, or loss of circulation."],
    ["muscle_cramp", "Bone and joint injuries", "Muscle cramp", "muscle cramp;leg cramp;calf suddenly tightened",
     "Stop the activity and gently stretch and massage the affected muscle if comfortable. Drink water, especially after sweating. Do not force a painful stretch. Seek medical care for persistent, recurrent, severe cramps or cramps with weakness, swelling, or illness."],
    ["heat_exhaustion", "Environmental emergencies", "Heat exhaustion", "heat exhaustion;dizzy in hot weather;weak and sweating in heat",
     "Move to a cool shaded place, loosen excess clothing, cool the skin with water and airflow, and give small sips of water only if fully alert and able to swallow. Seek medical help if symptoms worsen or do not improve promptly. Confusion, seizure, or collapse may indicate heat stroke: call emergency services and cool rapidly."],
    ["hypothermia", "Environmental emergencies", "Hypothermia or cold exposure", "very cold and shivering;hypothermia;confused after cold exposure",
     "Call emergency services for suspected hypothermia, especially with confusion, drowsiness, or reduced shivering. Move to shelter, remove wet clothing, wrap in dry blankets, and warm the center of the body gently. Handle the person gently. Do not use direct intense heat or rub cold limbs."],
    ["frostbite", "Environmental emergencies", "Frostbite", "frostbite;white numb fingers from cold;frozen toes",
     "Move to a warm place and protect the area from further cold. Do not rub, massage, or use direct heat. If refreezing is not a risk and medical care is available, rewarm in warm—not hot—water. Seek urgent medical care; avoid walking on frostbitten feet."],
    ["lightning", "Environmental emergencies", "Lightning strike", "struck by lightning;lightning hit someone",
     "The person does not carry an electrical charge; it is safe to help once the scene is safe. Call emergency services. Check responsiveness and breathing. If not breathing normally, begin CPR and use an AED if available. Treat burns and injuries while awaiting help."],
    ["poison_swallowed", "Poisoning and exposure", "Swallowed a potentially poisonous substance", "swallowed poison;drank cleaning liquid;ate something toxic;swallowed bleach;i swallowed something poisonous",
     "Call your local poison center or emergency services immediately and identify the substance, amount, and time. Do not induce vomiting or give food, drink, or home remedies unless a poison specialist instructs you. Keep the container or label for medical staff."],
    ["opioid_overdose", "Poisoning and exposure", "Suspected opioid overdose", "opioid overdose;person unresponsive after drugs;slow breathing after painkillers",
     "Call emergency services. If naloxone is available, give it according to its instructions. Support breathing and begin CPR if the person is not breathing normally and you are trained or instructed. Give another naloxone dose after 2–3 minutes if there is no response and another dose is available. Stay with the person until help arrives."],
    ["inhaled_fumes", "Poisoning and exposure", "Inhaled smoke or toxic fumes", "breathed in fumes;inhaled gas;smoke inhalation",
     "Move to fresh air only if you can do so without entering a dangerous area. Call emergency services or poison control. Do not re-enter the contaminated space. Seek urgent medical care for coughing, headache, dizziness, chest tightness, confusion, or breathing difficulty."],
    ["carbon_monoxide", "Poisoning and exposure", "Possible carbon monoxide exposure", "carbon monoxide poisoning;generator fumes indoors;headache from gas heater",
     "Get everyone outside into fresh air immediately without putting yourself at risk. Call emergency services and do not re-enter the building until authorities say it is safe. Seek urgent medical evaluation even if symptoms improve."],
    ["chemical_skin", "Poisoning and exposure", "Chemical contact with skin", "chemical on skin;bleach spilled on arm;cleaning chemical exposure",
     "Avoid touching the chemical. Remove contaminated clothing and jewelry. Brush off dry powders first, then flush the skin with plenty of running water for at least 20 minutes. Contact poison control or emergency services and provide the product label."],
    ["eye_foreign_body", "Eye, ear and dental emergencies", "Dust or loose particle in eye", "dust in eye;eyelash in eye;small particle in eye",
     "Do not rub the eye. Wash your hands and gently rinse the eye with clean water or sterile saline. Blink several times. Do not use tweezers or tools. Seek urgent care for pain, vision changes, embedded material, or symptoms that persist."],
    ["nose_object", "Eye, ear and dental emergencies", "Object stuck in nose", "bead stuck in nose;object in nostril;something stuck up nose",
     "Encourage the person to breathe through the mouth and avoid sniffing the object farther in. Do not probe with tools or repeatedly attempt removal. Seek medical help, especially for button batteries or magnets, which require emergency removal."],
    ["ear_object", "Eye, ear and dental emergencies", "Object or insect in ear", "insect in ear;bead stuck in ear;something inside my ear",
     "Do not insert cotton buds, tweezers, or other tools. Do not pour liquid into the ear if a battery, sharp object, or damaged eardrum is possible. Seek medical assessment. A button battery in the ear is an emergency."],
    ["tooth_avulsion", "Eye, ear and dental emergencies", "Knocked-out permanent tooth", "tooth knocked out;permanent tooth fell out;tooth avulsed",
     "Pick up the tooth by the crown, not the root. If dirty, rinse briefly with milk or saline; do not scrub. If it is a permanent tooth and the person is conscious and able, gently place it back in the socket without forcing it. Otherwise store it in milk or saline and seek an emergency dentist immediately. Baby teeth should not be replanted."]
  ];

  const CONTEXTS = [
    ["at_home", "at home"],
    ["at_school", "at school"],
    ["at_work", "at work"],
    ["during_sports", "during sports or exercise"],
    ["on_the_street", "on the street"],
    ["after_a_fall", "after a fall"],
    ["after_an_accident", "after an accident"],
    ["while_alone", "while alone"],
    ["helping_someone", "while helping another person"],
    ["in_a_child", "in a child"]
  ];

  /* Extra guidance appended when the situation is recognized,
     so the 10 variants of each topic are genuinely different. */
  const CONTEXT_NOTES = {
    at_home: "Since you are at home: unlock the door and turn on the lights so responders can reach you, and have someone wait outside to guide them if possible.",
    at_school: "Since this is at school: tell a teacher, the school nurse, or staff right away and ask them to contact the parents or guardians.",
    at_work: "Since this is at work: alert a supervisor or the workplace first-aid officer, and ask a trained colleague to bring the first-aid kit or AED if available.",
    during_sports: "Since this happened during sports or exercise: stop play right away and do not let the person return to the activity until they have been checked.",
    on_the_street: "Since you are outside: move away from traffic if you can do so safely, and ask a bystander to call 911 and stay with you.",
    after_a_fall: "Since this followed a fall: avoid moving the person if a head, neck, or back injury is possible, and watch for symptoms that get worse.",
    after_an_accident: "Since this followed an accident: make sure the area is safe from traffic, fire, or other hazards before approaching, and do not move the person unless there is immediate danger.",
    while_alone: "Since you are alone: call 911 first and put the phone on speaker so your hands are free. Give the dispatcher your exact location and follow their instructions.",
    helping_someone: "While helping another person: protect yourself first, use gloves or a barrier if available, tell the person what you are doing, and stay with them until help arrives.",
    in_a_child: "Since this involves a child: call for help early, stay calm and reassuring, and do not give any medication unless a doctor or poison center tells you to. Children often need professional assessment sooner than adults."
  };

  const SELF_NOTE =
    "Since this is happening to you: stay calm, sit or lie down somewhere safe, and ask someone nearby to help. " +
    "If it is serious or getting worse, call 911 or have someone call for you. " +
    "Do not drive yourself if you feel faint, have chest pain, or are bleeding heavily.";

  function isAboutSelf(question) {
    const text = normalizeQuestion(question);
    return /\b(i|me|myself|my)\b/.test(text) &&
      !/\b(someone|somebody|he|she|they|him|her|his|their|person|friend|child|baby|kid|son|daughter|mother|father|mom|dad|girl|boy|man|woman|patient|student|classmate|coworker|neighbor|stranger)\b/.test(text);
  }

  const HIGH_PRIORITY_TOPICS = new Set([
    "cardiac_arrest", "choking_adult", "choking_infant", "anaphylaxis", "severe_bleeding",
    "stroke", "seizure", "poison_swallowed", "chemical_burn_skin", "chemical_eye",
    "chemical_skin", "opioid_overdose", "carbon_monoxide", "chest_pain", "drowning"
  ]);

  const EMERGENCY_TOPICS = new Set([
    "deep_cut", "severe_bleeding", "embedded_object", "amputation", "burn_large",
    "chemical_burn_skin", "chemical_eye", "electrical_burn", "choking_adult", "choking_infant",
    "anaphylaxis", "drowning", "chest_pain", "cardiac_arrest", "stroke", "seizure",
    "head_injury", "spinal_injury", "fracture_arm", "fracture_leg", "heat_exhaustion",
    "hypothermia", "lightning", "poison_swallowed", "opioid_overdose", "inhaled_fumes",
    "carbon_monoxide", "chemical_skin"
  ]);

  function compileKeywordRegex(phrase) {
    // Same normalization as user input, so "can't" and "cannot" always agree.
    const cleaned = normalizeQuestion(phrase);
    return new RegExp(`(?:^|\\b)${escapeRegExp(cleaned)}(?:\\b|$)`, "i");
  }

  function buildResponses(topicsList, contextsList) {
    const list = [];

    for (const [tid, category, label, phrases, response] of topicsList) {
      const basePhrases = phrases.split(";").map(p => p.trim()).filter(Boolean);

      // Topic vocabulary is shared by all 10 situations of the topic.
      const tokens = new Set(extractQuestionTokens(label + " " + basePhrases.join(" ")));
      const tokenList = [...tokens];

      for (const [suffix, context] of contextsList) {
        const rawKeywords = [];

        for (const p of basePhrases) {
          rawKeywords.push(p);
          rawKeywords.push(`${p} ${context}`);
        }
        rawKeywords.push(
          `what should I do about ${label.toLowerCase()} ${context}`,
          `how do I help someone with ${label.toLowerCase()} ${context}`
        );

        list.push({
          id: `${tid}_${suffix}`,
          topic: tid,
          contextId: suffix,
          category,
          situation: `${label} (${context})`,
          baseSituation: label,
          priority: HIGH_PRIORITY_TOPICS.has(tid) ? 100 : 70,
          keywords: [...new Set(rawKeywords)].map(compileKeywordRegex),
          tokens,
          tokenList,
          response,
          emergency: EMERGENCY_TOPICS.has(tid)
        });
      }
    }

    return list;
  }

  const RESPONSES = buildResponses(TOPICS, CONTEXTS);

  // Known words (intent vocabulary + synonym variations) used to fix typos in user input.
  VOCAB = new Map();
  for (const r of RESPONSES) for (const t of r.tokenList) VOCAB.set(t, t);
  for (const [variation, canonical] of Object.entries(SYNONYM_LOOKUP)) {
    const key = stem(variation);
    if (!VOCAB.has(key)) VOCAB.set(key, stem(canonical));
  }

  // Rare words (few topics use them) are far more telling than common ones.
  const TOKEN_WEIGHT = new Map();
  (function () {
    const topicTokens = new Map();
    for (const r of RESPONSES) topicTokens.set(r.topic, r.tokens);
    const df = new Map();
    for (const tokens of topicTokens.values()) {
      for (const t of tokens) df.set(t, (df.get(t) || 0) + 1);
    }
    for (const [t, count] of df) {
      TOKEN_WEIGHT.set(t, 1 + Math.log(topicTokens.size / count));
    }
  })();

  /* ==========================================
  3. QUESTION PROCESSING ENGINE (NLP-STYLE)
  ========================================== */

  /* ---------- A. INTENT SCORING ---------- */

  function scoreIntent(intent, question, inputTokens, detectedContext, boostedTopics) {
    let score = 0;
    let matchedPhrases = 0;
    let matchedTokens = 0;

    // 1. Exact phrase matching.
    for (const keywordRegex of intent.keywords) {
      keywordRegex.lastIndex = 0;

      if (keywordRegex.test(question)) {
        matchedPhrases++;
        // Longer phrase matches are generally more meaningful.
        score += Math.min(keywordRegex.source.length * 0.15, 12);
      }
    }

    // 2. Token overlap, with small typo tolerance.
    for (const token of inputTokens) {
      if (intent.tokens.has(token)) {
        matchedTokens++;
        score += 1.5 * (TOKEN_WEIGHT.get(token) || 1);
      } else {
        const close = intent.tokenList.find(candidate => wordsAreSimilar(token, candidate));
        if (close) {
          matchedTokens++;
          score += 0.75 * (TOKEN_WEIGHT.get(close) || 1);
        }
      }
    }

    // 3. Reward coverage of the topic's important words.
    const coverage = intent.tokens.size
      ? Math.min(1, matchedTokens / Math.min(intent.tokens.size, 6))
      : 0;
    score += coverage * 5;

    // 4. Context matching.
    if (detectedContext && intent.contextId === detectedContext) {
      score += 10;
    }

    // 5. Emergency signals nudge the matching life-threatening topics.
    if (boostedTopics.has(intent.topic)) {
      score += 8;
    }

    // 6. Small priority adjustment; never overpowers a much stronger text match.
    score += Math.min(intent.priority / 100, 1.5);

    return { score, matchedPhrases, matchedTokens, coverage };
  }

  /* ---------- B. MAIN NLP MATCHER ---------- */

  function understandQuestion(question) {
    const normalized = normalizeQuestion(question);

    if (!normalized || normalized.length < 2) {
      return {
        intent: null,
        confidence: 0,
        emergency: false,
        emergencySignals: [],
        message: "Please describe the first-aid situation."
      };
    }

    const inputTokens = [...new Set(extractQuestionTokens(normalized, true))];
    const detectedContext = detectContext(normalized);
    const signals = detectEmergency(normalized);
    const emergencySignals = signals.map(s => s.id);
    const boostedTopics = new Set(signals.flatMap(s => s.boosts));

    let bestMatch = null;
    let bestScore = 0;
    let secondBestScore = 0;
    let bestDetails = null;

    for (const intent of RESPONSES) {
      const details = scoreIntent(intent, normalized, inputTokens, detectedContext, boostedTopics);

      if (details.score > bestScore) {
        secondBestScore = bestScore;
        bestScore = details.score;
        bestMatch = intent;
        bestDetails = details;
      } else if (details.score > secondBestScore) {
        secondBestScore = details.score;
      }
    }

    // No meaningful match.
    if (!bestMatch || bestScore < 5) {
      return {
        intent: null,
        confidence: 0,
        emergency: emergencySignals.length > 0,
        emergencySignals,
        detectedContext,
        message:
          "I am not sure which first-aid situation you are describing. " +
          "Please explain what happened, which part of the body is affected, " +
          "and what symptoms are present."
      };
    }

    // Confidence considers match strength and the gap to the runner-up.
    const separation = bestScore - secondBestScore;
    const confidence = Math.min(
      0.99,
      Math.max(
        0.1,
        (bestScore / (bestScore + 15)) * 0.8 +
        (separation / (bestScore + 1)) * 0.2
      )
    );

    return {
      intent: bestMatch,
      confidence: Number(confidence.toFixed(2)),
      emergency: emergencySignals.length > 0 || bestMatch.emergency,
      emergencySignals,
      detectedContext,
      score: Number(bestScore.toFixed(2)),
      matchedPhrases: bestDetails.matchedPhrases,
      matchedTokens: bestDetails.matchedTokens
    };
  }

  /* ---------- C. RESPONSE GENERATOR ---------- */

  const EMERGENCY_BANNER =
    "⚠️ POSSIBLE EMERGENCY\n\n" +
    "Call 911 in the Philippines immediately if someone is in immediate danger. " +
    "Do not delay emergency care while using this chatbot.";

  function smallTalk(question) {
    const text = normalizeQuestion(question);

    if (/^(hi|hello|hey|kumusta|good (morning|afternoon|evening))( there| po| lambing)?$/.test(text)) {
      return "Hello! Tell me what happened, who is affected, and what symptoms you see, and I will share basic first-aid steps.\n\nIf someone is in immediate danger, call 911.";
    }

    if (/^(thanks|thank you|salamat|ok thanks|okay thanks)( po| so much| a lot)?$/.test(text)) {
      return "You're welcome! Stay safe. If anything gets worse, call 911 or get medical help right away.";
    }

    return null;
  }

  function getReply(question) {
    const talk = smallTalk(question);
    if (talk) return talk;

    const result = understandQuestion(question);

    if (!result.intent) {
      if (result.emergency) {
        return (
          "⚠️ POSSIBLE EMERGENCY\n\n" +
          "Your message may describe a life-threatening situation. " +
          "Call 911 in the Philippines immediately if someone is in danger. " +
          "Follow the emergency dispatcher's instructions.\n\n" +
          result.message
        );
      }

      return (
        result.message +
        "\n\nI can help with wounds, bleeding, burns, choking, fractures, sprains, fainting, seizures, animal bites, poisoning, and other basic first-aid situations." +
        "\n\n🚨 If someone is in immediate danger, call 911 in the Philippines."
      );
    }

    const intent = result.intent;
    const contextMatched = result.detectedContext && intent.contextId === result.detectedContext;

    const parts = [];

    if (result.emergency) parts.push(EMERGENCY_BANNER);

    if (result.confidence < 0.4 && !result.emergency) {
      parts.push("I am not completely sure, but this may be the closest match:");
    }

    parts.push(intent.response);

    if (contextMatched && CONTEXT_NOTES[intent.contextId]) {
      parts.push(CONTEXT_NOTES[intent.contextId]);
    }

    if (isAboutSelf(question) && !["helping_someone", "in_a_child"].includes(result.detectedContext)) {
      parts.push(SELF_NOTE);
    }

    parts.push(
      "---\n" +
      "Situation: " + (contextMatched ? intent.situation : intent.baseSituation) +
      "\nInformation category: " + intent.category +
      "\nMatch confidence: " + Math.round(result.confidence * 100) + "%" +
      "\n\nLAMBING AI provides general first-aid information, not a diagnosis."
    );

    return parts.join("\n\n");
  }

  // Optional hook for testing in a console or Node: set window.LAMBING_DEBUG = true first.
  if (window.LAMBING_DEBUG) {
    window.LAMBING_API = { RESPONSES, understandQuestion, getReply, normalizeQuestion, extractQuestionTokens };
  }

  /* ==========================================
  4. CHAT INTERFACE STYLES
  ========================================== */

  const css = `
    .lbc * { box-sizing: border-box; }

    .lbc {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 9999;
      font-family: Inter, system-ui, sans-serif;
      color: #111;
    }

    .lbc-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      border: 0;
      cursor: pointer;
      background: ${cfg.accent};
      color: white;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 18px;
      border-radius: 999px;
      box-shadow: 0 6px 20px #0004;
    }

    .lbc-win {
      position: absolute;
      right: 0;
      bottom: 60px;
      width: 360px;
      max-width: calc(100vw - 24px);
      height: 480px;
      max-height: calc(100dvh - 100px);
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 40px #0004;
      opacity: 0;
      transform: translateY(12px);
      pointer-events: none;
      visibility: hidden;
      transition: .2s ease;
    }

    .lbc.open .lbc-win {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
      visibility: visible;
    }

    .lbc-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0b0b0b;
      color: white;
      padding: 14px;
    }

    .lbc-head b { font-size: 15px; }

    .lbc-head small {
      display: block;
      font-size: 11px;
      color: #aaa;
    }

    .lbc-x {
      border: 0;
      background: transparent;
      color: white;
      font-size: 24px;
      cursor: pointer;
    }

    .lbc-log {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      background: #f6f6f4;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .lbc-msg {
      max-width: 85%;
      padding: 10px 13px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .lbc-msg.bot {
      align-self: flex-start;
      background: white;
      border: 1px solid #e5e5e0;
      border-bottom-left-radius: 4px;
    }

    .lbc-msg.user {
      align-self: flex-end;
      background: ${cfg.accent};
      color: white;
      border-bottom-right-radius: 4px;
    }

    .lbc-note {
      padding: 8px 12px;
      font-size: 11px;
      color: #777;
      background: white;
      border-top: 1px solid #eee;
    }

    .lbc-form {
      display: flex;
      gap: 8px;
      padding: 10px;
      background: white;
      border-top: 1px solid #eee;
    }

    .lbc-in {
      flex: 1;
      min-width: 0;
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 11px;
      font-size: 14px;
      outline: none;
    }

    .lbc-in:focus { border-color: ${cfg.accent}; }

    .lbc-send {
      border: 0;
      border-radius: 10px;
      background: #0b0b0b;
      color: white;
      font-weight: 600;
      padding: 0 17px;
      cursor: pointer;
    }

    .lbc-send:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    @media(max-width: 480px) {
      .lbc { right: 12px; bottom: 12px; }
      .lbc-win {
        width: calc(100vw - 24px);
        height: 70dvh;
      }
    }

    @media(prefers-reduced-motion: reduce) {
      .lbc-win { transition: none; }
    }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ==========================================
  5. ELEMENT CREATION
  ========================================== */

  function el(tag, cls, text) {
    const node = document.createElement(tag);

    if (cls) node.className = cls;
    if (text != null) node.textContent = text;

    return node;
  }

  const root = el("div", "lbc");
  const win = el("div", "lbc-win");

  win.id = "lbc-window";
  win.setAttribute("role", "dialog");
  win.setAttribute("aria-label", cfg.title);

  const head = el("div", "lbc-head");
  const titleWrap = el("div");

  titleWrap.appendChild(el("b", null, cfg.title));
  titleWrap.appendChild(
    el("small", null, "Rule-based AI • First Aid Assistant")
  );

  const closeBtn = el("button", "lbc-x", "×");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close chat");

  head.append(titleWrap, closeBtn);

  const log = el("div", "lbc-log");
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");

  const note = el(
    "div",
    "lbc-note",
    "Basic first-aid information only. Not a substitute for professional medical care. Emergencies: call 911."
  );

  const form = el("form", "lbc-form");

  const input = el("input", "lbc-in");
  input.type = "text";
  input.placeholder = cfg.placeholder;
  input.maxLength = 500;
  input.autocomplete = "off";
  input.setAttribute("aria-label", "Message");
  input.required = true;

  const send = el("button", "lbc-send", "Send");
  send.type = "submit";

  form.append(input, send);
  win.append(head, log, note, form);

  const toggle = el("button", "lbc-toggle", "Chat with our AI");
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "lbc-window");

  root.append(win, toggle);
  document.body.appendChild(root);

  /* ==========================================
  6. CHAT BEHAVIOR
  ========================================== */

  function addMsg(who, message) {
    const msg = el("div", "lbc-msg " + who, message);
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
    return msg;
  }

  function setOpen(open) {
    root.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Hide chat" : "Chat with our AI";

    if (open) {
      if (!log.children.length) {
        addMsg("bot", cfg.greeting);
      }

      input.focus();
    }
  }

  /* ==========================================
  7. MESSAGE SUBMISSION
  ========================================== */

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const question = input.value.trim();

    if (!question || busy) return;

    busy = true;
    send.disabled = true;
    send.textContent = "...";
    input.disabled = true;

    input.value = "";

    addMsg("user", question);

    const typing = addMsg("bot", "Analyzing your situation...");

    setTimeout(function () {
      let reply;

      try {
        reply = getReply(question);
      } catch (err) {
        console.error("[LAMBING AI]", err);
        reply =
          "Sorry, something went wrong on my side.\n\n" +
          "🚨 If someone is in danger, call 911 immediately.";
      }

      typing.remove();
      addMsg("bot", reply);

      busy = false;
      send.disabled = false;
      send.textContent = "Send";
      input.disabled = false;
      input.focus();
    }, 350);
  });

  /* ==========================================
  8. EVENT LISTENERS
  ========================================== */

  toggle.addEventListener("click", function () {
    setOpen(!root.classList.contains("open"));
  });

  closeBtn.addEventListener("click", function () {
    setOpen(false);
    toggle.focus();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && root.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });
})();