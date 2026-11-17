/* ==========================================================
   Sakhi360 — plain JavaScript port of the React app.
   Sections: 1) data  2) engines  3) state  4) views  5) wiring
   ========================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1) DATA
     --------------------------------------------------------- */
  const STORAGE_KEYS = {
    cycles: 'sakhi360_cycles_v2',
    journals: 'sakhi360_journals_v1',
    hazards: 'sakhi360_hazards_v1',
    contacts: 'sakhi360_contacts_v1',
    pins: 'sakhi360_pins_v1',
    lessons: 'sakhi360_lessons_v1',
    selfCheck: 'sakhi360_selfcheck_v1'
  };

  const DEFAULT_PIN_CONFIG = { realPin: '2026', decoyPin: '0000', panicPin: '9999' };

  const PILLAR_TITLES = {
    overview: 'Clinical Overview',
    body: 'Body · Cycle & PCOS Care',
    mind: 'Mind · Therapy & Encrypted Vault',
    safety: 'Safety · Silent SOS & OSM Route',
    defense: 'Digital · Privacy Defense',
    growth: 'Growth · Savings & Literacy',
    wiki: 'SakhiPedia · PCOS & Health Wiki'
  };

  const SIDEBAR_SECTIONS = [
    { group: 'Patient Summary', items: [{ id: 'overview', label: 'Clinical Overview', icon: 'dashboard' }] },
    { group: 'Care & Screening', items: [
      { id: 'body', label: 'Body · Cycle & PCOS', icon: 'heart' },
      { id: 'mind', label: 'Mind · Vault & AI', icon: 'brain' }
    ] },
    { group: 'Emergency & Defense', items: [
      { id: 'safety', label: 'Safety · SOS & Route', icon: 'shield' },
      { id: 'defense', label: 'Digital · Defense', icon: 'lock' }
    ] },
    { group: 'Wellness & Growth', items: [{ id: 'growth', label: 'Growth · Savings & News', icon: 'sprout' }] },
    { group: 'Knowledge Base', items: [{ id: 'wiki', label: 'SakhiPedia · PCOS Wiki', icon: 'book' }] }
  ];

  const MOBILE_NAV = [
    { id: 'body', label: 'Body', icon: 'heart' },
    { id: 'mind', label: 'Mind', icon: 'brain' },
    { id: 'safety', label: 'Safety', icon: 'shield' },
    { id: 'defense', label: 'Defense', icon: 'lock' },
    { id: 'growth', label: 'Growth', icon: 'sprout' }
  ];

  const METHODOLOGY_STEPS = [
    { step: '01', title: 'Capture', detail: 'Cycle dates, PCOS symptoms, mood check-ins, location, and timestamped evidence.' },
    { step: '02', title: 'Analyse', detail: 'AI screening for PCOS markers, mood support, safe route risk, deepfake & stalkerware checks.' },
    { step: '03', title: 'Protect', detail: 'AES-256-GCM encrypted local vault, Dual PIN access, Calculator Stealth, and Panic Wipe.' },
    { step: '04', title: 'Act', detail: 'Hold-to-confirm Silent SOS, offline BLE Mesh relay, NCII takedown notice, and FIR pack.' },
    { step: '05', title: 'Grow', detail: 'Bank-free savings planning, career & legal skill modules, and a calm safe news digest.' }
  ];

  const FEASIBILITY_MITIGATIONS = [
    { risk: 'AI accuracy', strategy: 'Screening only, not diagnosis; explicit doctor prompts' },
    { risk: 'False or misused SOS', strategy: 'Confirm gesture, silent cancel PIN, trusted contacts' },
    { risk: 'Mesh range & battery', strategy: 'Low-power BLE opportunistic relay between nearby users' },
    { risk: 'Sparse safe-route data', strategy: 'OSM street-lighting tags + anonymous crowd reports' },
    { risk: 'Abuser finds the app', strategy: 'Decoy PIN, calculator stealth disguise, panic wipe' }
  ];

  const SEED_CYCLE_LOGS = [
    { id: 'c-1', startDate: '2026-08-18', durationDays: 5, flowIntensity: 'moderate', symptoms: ['Fatigue', 'Lower back ache'], notes: 'Baseline cycle' },
    { id: 'c-2', startDate: '2026-09-15', durationDays: 5, flowIntensity: 'moderate', symptoms: ['Cramps', 'Bloating'], notes: '28-day cycle' },
    { id: 'c-3', startDate: '2026-10-17', durationDays: 4, flowIntensity: 'moderate', symptoms: ['Mild headache'], notes: '32-day cycle' }
  ];

  const BREAST_SELF_CHECK_STEPS = [
    { step: 1, title: 'Visual Check in Mirror (Arms at Sides)', detail: 'Look for changes in symmetry, skin dimpling, puckering, redness, or nipple inversion.', duration: '1 min' },
    { step: 2, title: 'Visual Check (Arms Raised Overhead)', detail: 'Raise both arms high and check if both sides lift evenly without skin tethering.', duration: '1 min' },
    { step: 3, title: 'Lying Down — Circular Pad Palpation', detail: 'Use the flat pads of your three middle fingers in small dime-sized circles with light, medium, and firm pressure.', duration: '3 min' },
    { step: 4, title: 'Collarbone to Underarm Sweep', detail: 'Check vertically from collarbone to bra line and outward into the armpit tissue for firm knots or thickening.', duration: '2 min' },
    { step: 5, title: 'Gentle Nipple Check & Monthly Note', detail: 'Check for unusual discharge or tenderness. Best done 3–5 days after your period ends (or on a fixed day each month).', duration: '1 min' }
  ];

  const PREGNANCY_TRIMESTER_GUIDE = [
    { trimester: '1st Trimester (Weeks 1–12)', focus: 'Folic acid (400 mcg), hydration, baseline thyroid & hemoglobin check, nausea-friendly small meals.', redFlags: 'Severe one-sided pelvic pain, heavy bleeding, persistent dizziness, or inability to keep fluids down.' },
    { trimester: '2nd Trimester (Weeks 13–26)', focus: 'Anomaly scan (18–20 wks), iron + calcium supplementation, gestational diabetes screening (24–28 wks).', redFlags: 'Sudden facial/hand swelling, blurred vision, severe headache, or fluid leakage.' },
    { trimester: '3rd Trimester (Weeks 27–40)', focus: 'Daily kick counts, blood pressure monitoring, hospital birth bag & emergency transport plan.', redFlags: 'Noticeable drop in baby movements, regular contractions before 37 weeks, or sudden bleeding.' }
  ];

  const SEED_HAZARD_REPORTS = [
    { id: 'hr-1', edgeId: 'e2', hazardType: 'unlit_street', note: 'Culvert lights non-functional after 7 PM (OSM lit=no)', reportedAt: '2026-11-14T20:15:00Z' },
    { id: 'hr-2', edgeId: 'e3', hazardType: 'isolated_alley', note: 'Low visibility behind warehouse wall', reportedAt: '2026-11-13T21:40:00Z' }
  ];

  const SEED_MESH_NODES = [
    { id: 'you', label: 'Your Device (Offline)', x: 80, y: 210, batteryPercent: 64, hasCellularGateway: false },
    { id: 'peer-1', label: 'Sakhi Node #104', x: 195, y: 140, batteryPercent: 82, hasCellularGateway: false },
    { id: 'peer-2', label: 'Sakhi Node #219', x: 210, y: 265, batteryPercent: 45, hasCellularGateway: false },
    { id: 'peer-3', label: 'Sakhi Node #308', x: 345, y: 175, batteryPercent: 71, hasCellularGateway: false },
    { id: 'peer-4', label: 'Campus Guard Relay', x: 475, y: 120, batteryPercent: 95, hasCellularGateway: true },
    { id: 'peer-5', label: 'Transit Kiosk Gateway', x: 485, y: 260, batteryPercent: 90, hasCellularGateway: true }
  ];

  const OSM_NODES = [
    { id: 'metro', label: 'Knowledge Park Metro', x: 75, y: 295, type: 'transit' },
    { id: 'hostel', label: 'Girls Hostel Gate', x: 560, y: 80, type: 'residential' },
    { id: 'plaza', label: 'Central Market Chowk', x: 245, y: 245, type: 'market' },
    { id: 'alley', label: 'Old Service Lane', x: 255, y: 115, type: 'residential' },
    { id: 'clinic', label: '24x7 Care Clinic', x: 405, y: 270, type: 'clinic' },
    { id: 'campus', label: 'University Main Blvd', x: 405, y: 145, type: 'campus' },
    { id: 'underpass', label: 'Bypass Underpass', x: 145, y: 155, type: 'transit' },
    { id: 'park', label: 'Sector Park Corner', x: 545, y: 235, type: 'residential' }
  ];

  const OSM_EDGES = [
    { id: 'e1', from: 'metro', to: 'plaza', streetName: 'Station Main Rd', distanceMeters: 420, lit: true, crowdScore: 9, policePatrol: true },
    { id: 'e2', from: 'metro', to: 'underpass', streetName: 'Shortcut Culvert', distanceMeters: 280, lit: false, crowdScore: 2, policePatrol: false },
    { id: 'e3', from: 'underpass', to: 'alley', streetName: 'Warehouse Backlane', distanceMeters: 260, lit: false, crowdScore: 1, policePatrol: false },
    { id: 'e4', from: 'alley', to: 'hostel', streetName: 'North Perimeter Track', distanceMeters: 510, lit: false, crowdScore: 3, policePatrol: false },
    { id: 'e5', from: 'plaza', to: 'clinic', streetName: 'Hospital Avenue', distanceMeters: 390, lit: true, crowdScore: 8, policePatrol: true },
    { id: 'e6', from: 'plaza', to: 'campus', streetName: 'Academic Arcade', distanceMeters: 430, lit: true, crowdScore: 8, policePatrol: true },
    { id: 'e7', from: 'alley', to: 'campus', streetName: 'Library Link Rd', distanceMeters: 310, lit: true, crowdScore: 6, policePatrol: false },
    { id: 'e8', from: 'clinic', to: 'campus', streetName: 'Pharmacy Cross Rd', distanceMeters: 290, lit: true, crowdScore: 7, policePatrol: false },
    { id: 'e9', from: 'campus', to: 'hostel', streetName: 'Lit Avenue North', distanceMeters: 380, lit: true, crowdScore: 7, policePatrol: true },
    { id: 'e10', from: 'clinic', to: 'park', streetName: 'East Ring Rd', distanceMeters: 360, lit: true, crowdScore: 6, policePatrol: false },
    { id: 'e11', from: 'park', to: 'hostel', streetName: 'Hostel East Gate Rd', distanceMeters: 340, lit: true, crowdScore: 7, policePatrol: true }
  ];

  const BANK_FREE_SAVINGS_GUIDES = [
    { id: 'sg-1', title: 'Three-Envelope Cash Safety Split', category: 'Zero-Bank Method',
      summary: 'Divide weekly cash or scholarship stipends into Essentials (60%), Quiet Emergency Stash (25%), and Skill Fund (15%) in opaque tamper-evident envelopes.',
      steps: [
        'Keep emergency cash split across two physical locations rather than one purse.',
        'Use Sakhi360 Calculator Vault to log cash balances locally without SMS/bank statement alerts.',
        'Set a weekly micro-target (e.g. ₹250/week = ₹13,000/year independent safety buffer).'
      ] },
    { id: 'sg-2', title: 'Post Office & Jan Dhan Independent Account Checklist', category: 'Low-Document Banking',
      summary: 'Open an independent savings account under your own phone number when ready—without linking family-shared devices.',
      steps: [
        'India Post Payments Bank (IPPB) or basic BSBDA accounts need zero minimum balance.',
        'Register a dedicated personal SIM / email for OTPs and turn off lock-screen SMS previews.',
        'Verify nominee and passbook custody stays exclusively with you.'
      ] },
    { id: 'sg-3', title: 'Community Chit & SHG Red-Flag Audit', category: 'Fraud Protection',
      summary: 'Protect small savings groups from unregistered schemes by checking 4 mandatory rules before contributing.',
      steps: [
        'Verify state registration under the Chit Funds Act or NRLM Self-Help Group ledger.',
        'Never hand over original Aadhaar/PAN or blank signed cheques to informal agents.',
        'Always keep a photo receipt inside your encrypted Sakhi360 vault.'
      ] }
  ];

  const CAREER_SKILL_MODULES = [
    { id: 'cm-1', title: 'Remote Freelancing & Invoice Independence', track: 'Career & Income', duration: '25 min',
      lessons: [
        'Creating a privacy-safe portfolio without exposing personal home address',
        'Setting fair hourly/project rates and using milestone payments',
        'Basic PAN / UPI merchant receipt hygiene for independent earners'
      ] },
    { id: 'cm-2', title: 'Workplace Safety & POSH Act Rights', track: 'Legal Literacy', duration: '15 min',
      lessons: [
        'What counts as workplace harassment (including digital/late-night messages)',
        'How to file with an Internal Committee (IC) or Local Committee (LC) within 3 months',
        'Preserving timestamped screenshots securely inside an encrypted vault'
      ] },
    { id: 'cm-3', title: 'Digital Hygiene & Cyber-Resilience', track: 'Tech Foundations', duration: '20 min',
      lessons: [
        'Auditing Google/Apple account active sessions and two-factor authenticator apps',
        'Spotting deepfake extortion scams and using StopNCII hash protection',
        'Securing WhatsApp & Instagram privacy settings against location leaks'
      ] },
    { id: 'cm-4', title: 'Zero-FIR, 181 & Cybercrime 1930 Playbook', track: 'Civic Safety', duration: '15 min',
      lessons: [
        'Right to file a Zero-FIR at any police station regardless of jurisdiction',
        'Reporting financial or image-based abuse immediately on 1930 / cybercrime.gov.in',
        'Recording evidence metadata without altering original image/audio hashes'
      ] }
  ];

  const CURATED_SAFE_NEWS = [
    { id: 'news-1', category: 'Health', title: 'Why Irregular Cycles Deserve Personalized Tracking Windows', source: 'ACOG Clinical Guidance Digest', readTime: '3 min read',
      summary: 'Clinicians recognize the menstrual cycle as a vital sign. Flexible prediction ranges reduce anxiety and flag early hormonal shifts like PCOS sooner.' },
    { id: 'news-2', category: 'Safety & Rights', title: '24-Hour Takedown Rules for Non-Consensual Morphed Imagery', source: 'Digital Rights & IT Rules Brief', readTime: '4 min read',
      summary: 'Under India’s IT Rules 2021, platforms must act within 24 hours on NCII/deepfake complaints. Hash-matching via StopNCII stops re-uploads without sharing raw photos.' },
    { id: 'news-3', category: 'Finance', title: 'Building an Independent Emergency Fund on a Student Budget', source: 'Women’s Financial Literacy Collective', readTime: '3 min read',
      summary: 'Starting with ₹200–₹300 a week builds autonomy and resilience. Practical steps for cash-envelope safety and zero-balance independent accounts.' },
    { id: 'news-4', category: 'Careers', title: 'Tier-2 & Tier-3 Women Entering Remote UI, QA & Data Roles', source: 'Skills & Workforce Watch', readTime: '4 min read',
      summary: 'Verified open-source portfolios and micro-credentials are helping college students land flexible remote internships without relocating.' }
  ];

  const RESEARCH_IMPACT_STATS = [
    { metric: '4.45 lakh', label: 'Crimes against women cases registered in India in 2022 (~52 every hour)', source: 'NCRB Crime in India 2022' },
    { metric: '1 in 5', label: 'Young Indian women affected by PCOS, often unaware of early markers', source: 'The Week (2025)' },
    { metric: '84%', label: 'Of 25 period apps studied shared user health data with third parties', source: 'ORCHA Study (2022)' }
  ];

  const RESEARCH_REFERENCES = [
    'NCRB, Crime in India 2022: 4.45 lakh crimes-against-women cases (Daily Excelsior)',
    'NCRB 2022: ~52 cases registered every hour (The Tribune)',
    'PCOS: the hidden struggle of one in five young Indian women (The Week, 2025)',
    'ORCHA (2022): Privacy issues with period tracking apps (Digital Health News)',
    'Privacy International: No Body’s Business but Mine, Vol. 2 (privacyinternational.org)',
    'ACOG Committee Opinion No. 651 (2015): Menstrual cycle as a vital sign (doi:10.1097/AOG.0000000000001215)'
  ];

  const DECOY_STUDY_NOTES = [
    { id: 'd1', title: 'Organic Chemistry — Exam Revision Notes', date: 'Nov 14', body: 'Review SN1 vs SN2 reaction mechanisms, stereochemistry inversion, and polar protic vs aprotic solvents before Friday quiz.' },
    { id: 'd2', title: 'Quick Masala Oats & Dal Khichdi Recipe', date: 'Nov 12', body: '1 cup rolled oats, 1/2 tsp turmeric, cumin seeds, chopped carrots & peas. Simmer 6 minutes with 2.5 cups water.' },
    { id: 'd3', title: 'Monthly Hostel Mess & Stationery Budget', date: 'Nov 10', body: 'Notebooks ₹320, Metro card recharge ₹500, Library printouts ₹140, Laundry ₹250.' }
  ];

  const WIKI_CATEGORIES = ['All', 'PCOS & Hormones', 'Menstrual & Reproductive', 'Cancer & Screening', 'Life Stages & Wellness', 'Mental Well-being', 'Safety & Legal Rights'];

  const ENCYCLOPEDIA_ARTICLES = [
    {
      id: 'pcos',
      title: `Polycystic Ovary Syndrome (PCOS)`,
      subtitle: `Endocrine & metabolic condition affecting ovulation, androgen balance, and insulin sensitivity`,
      category: 'PCOS & Hormones',
      lastReviewed: 'November 2026',
      infobox: { heading: 'PCOS Clinical Summary', rows: [
        { label: 'Specialty', value: 'Gynecology, Endocrinology' },
        { label: 'Prevalence', value: '~1 in 5 young Indian women (often undiagnosed)' },
        { label: 'Diagnostic Standard', value: 'Rotterdam Criteria (2 of 3 features)' },
        { label: 'Core Domains', value: 'Ovulatory irregularity · Androgen excess · Ovarian morphology' },
        { label: 'Common Lab Panel', value: 'LH/FSH, Free Testosterone, TSH, Prolactin, Fasting Insulin, HbA1c' },
        { label: 'Imaging', value: 'Pelvic / Transabdominal Ultrasound (day 2–5)' }
      ] },
      lead: `Polycystic ovary syndrome (PCOS) is a common hormonal and metabolic condition affecting reproductive-age women. Despite its name, having ovarian "cysts" (which are actually immature follicles) is neither required nor sufficient on its own for diagnosis. Early recognition helps prevent long-term metabolic, cardiovascular, and fertility complications.`,
      sections: [
        { id: 'signs-symptoms', heading: '1. Signs and Symptoms',
          paragraphs: [`Symptoms often emerge gradually during adolescence or early twenties and vary widely from person to person. Some individuals experience primarily cycle irregularity, while others notice skin, hair, or energy changes first.`],
          bullets: [
            `Irregular or infrequent periods: Cycles consistently longer than 35 days (oligomenorrhea), fewer than 8–9 periods per year, or unpredictable bleeding.`,
            `Hyperandrogenic skin and hair changes: Persistent jawline/chin cystic acne, excess coarse hair on the face, chest, or abdomen (hirsutism), or scalp hair thinning.`,
            `Energy and metabolic signals: Post-meal fatigue or sugar crashes, unexplained central weight gain, or darkened velvety skin patches on the neck or underarms (acanthosis nigricans).`,
            `Mood and sleep impacts: Higher rates of anxiety, low mood, and sleep disruption linked to hormonal and insulin fluctuations.`
          ] },
        { id: 'rotterdam-criteria', heading: '2. Rotterdam Diagnostic Criteria (2 of 3)',
          paragraphs: [`Clinicians internationally diagnose PCOS in adults using the Rotterdam Consensus Criteria after ruling out mimicking conditions such as thyroid disorders, hyperprolactinemia, or non-classic congenital adrenal hyperplasia. At least two of the following three features must be present:`],
          bullets: [
            `Ovulatory dysfunction: Irregular, infrequent, or absent menstrual cycles.`,
            `Clinical or biochemical hyperandrogenism: Visible excess facial/body hair, severe acne, or elevated blood androgen levels (e.g., total/free testosterone, DHEA-S).`,
            `Polycystic ovarian morphology (PCOM): Ultrasound showing multiple small peripheral follicles or enlarged ovarian volume (note: ultrasound alone is not recommended for diagnosis within 8 years of first menstruation due to normal adolescent multifollicular ovaries).`
          ] },
        { id: 'pathophysiology', heading: '3. Insulin Resistance & Hormonal Feedback Loop',
          paragraphs: [
            `Between 50% and 75% of individuals with PCOS—including lean PCOS phenotypes—exhibit underlying insulin resistance. When muscle and fat cells respond weakly to insulin, the pancreas produces extra insulin to keep blood sugar stable.`,
            `Elevated circulating insulin directly stimulates ovarian theca cells to produce higher amounts of androgens and suppresses hepatic sex hormone-binding globulin (SHBG). This raises free testosterone, which disrupts normal follicle maturation and ovulation.`
          ] },
        { id: 'clinical-tests', heading: '4. Recommended Clinical Workup',
          paragraphs: [`Digital symptom screeners (such as Sakhi360’s Early PCOS Detector) can highlight overlapping markers, but only a qualified physician can confirm PCOS through targeted laboratory tests and clinical history:`],
          bullets: [
            `Hormonal panel (typically drawn fasting in early follicular phase, days 2–5): LH, FSH, Total & Free Testosterone, DHEA-S, TSH (thyroid), and Serum Prolactin.`,
            `Metabolic screening: Fasting glucose, Fasting insulin (for HOMA-IR), HbA1c, and fasting lipid profile.`,
            `Pelvic ultrasound: Evaluates endometrial thickness and ovarian follicle count when clinically indicated.`
          ] },
        { id: 'management', heading: '5. Evidence-Based Management',
          paragraphs: [`Treatment is individualized around the person’s primary goals—whether regulating cycles, clearing skin/hair symptoms, supporting fertility, or improving insulin sensitivity.`],
          bullets: [
            `Nutrition & movement: Balanced protein + high-fiber meals to blunt glucose spikes, paired with regular resistance training and brisk walking to improve insulin sensitivity even without weight loss.`,
            `Sleep & stress hygiene: Prioritizing 7–8 hours of sleep reduces evening cortisol, which otherwise worsens insulin resistance.`,
            `Targeted medical therapy (prescribed by a doctor): Combined hormonal contraceptives for cycle/endometrial protection and acne; insulin sensitizers such as metformin or myo-inositol; anti-androgens where appropriate.`
          ] },
        { id: 'differential', heading: '6. Conditions That Mimic PCOS',
          paragraphs: [`Because irregular periods and fatigue are shared across multiple conditions, doctors routinely rule out hypothyroidism, elevated prolactin, premature ovarian insufficiency, hypothalamic amenorrhea (from under-fueling or intense stress), and iron/vitamin D/B12 deficiencies.`] }
      ],
      relatedIds: ['irregular-cycles', 'insulin-resistance', 'hyperandrogenism', 'mental-health-hormones'],
      references: [
        `Teede HJ et al. (2023). International Evidence-based Guideline for the Assessment and Management of Polycystic Ovary Syndrome.`,
        `The Week (2025). PCOS: The hidden struggle of one in five young Indian women.`,
        `ACOG Committee Opinion No. 651 (2015). Menstrual Cycle as a Vital Sign.`
      ],
      actionTarget: { pillar: 'body', label: 'Open Early PCOS Detector' }
    },
    {
      id: 'irregular-cycles',
      title: `Irregular Menstrual Cycles & Cycle Physiology`,
      subtitle: `Understanding cycle variability, four hormonal phases, and clinical red flags`,
      category: 'Menstrual & Reproductive',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Cycle Physiology Reference', rows: [
        { label: 'Typical Adult Range', value: '21 to 35 days (day 1 to next day 1)' },
        { label: 'Normal Period Bleed', value: '2 to 7 days' },
        { label: 'Oligomenorrhea', value: 'Cycles consistently > 35 days' },
        { label: 'Secondary Amenorrhea', value: '3+ missed months in prior regular cycles' },
        { label: 'Clinical Consensus', value: 'ACOG Vital Sign Standard' }
      ] },
      lead: `A menstrual cycle is counted from the first day of full menstrual bleeding to the day before the next period begins. Most mainstream trackers assume a rigid 28-day clock, creating needless anxiety for anyone whose natural rhythm runs 30–36 days or varies under stress, travel, or PCOS.`,
      sections: [
        { id: 'four-phases', heading: '1. The Four Phases of the Cycle',
          paragraphs: [`The menstrual cycle is coordinated by feedback between the hypothalamus, pituitary gland, and ovaries (the HPO axis):`],
          bullets: [
            `Menstrual Phase (Days 1–5): Estrogen and progesterone drop, triggering shedding of the uterine lining.`,
            `Follicular Phase (Day 1 to Ovulation): FSH stimulates ovarian follicles; rising estrogen rebuilds the endometrium. Stress or PCOS typically lengthens this phase.`,
            `Ovulatory Window (Mid-cycle): An LH surge releases a mature egg. Cervical mucus often becomes clear and stretchy.`,
            `Luteal Phase (~11–16 days): The corpus luteum secretes progesterone. If pregnancy does not occur, progesterone falls and the next cycle begins.`
          ] },
        { id: 'when-to-see-doctor', heading: '2. When Irregularity Needs Medical Review',
          paragraphs: [`Occasional 3–5 day shifts from exams, illness, or sleep loss are normal. Seek a clinician’s evaluation if you notice persistent patterns:`],
          bullets: [
            `Cycles repeatedly shorter than 21 days or longer than 35 days.`,
            `Going 90+ days without a period (risk of endometrial buildup if unaddressed).`,
            `Soaking through a pad or tampon every 1–2 hours for consecutive hours, or bleeding lasting > 7 days.`,
            `Severe pelvic pain that prevents daily study or work despite standard pain relief.`
          ] }
      ],
      relatedIds: ['pcos', 'insulin-resistance', 'pregnancy-care'],
      references: [`ACOG Committee Opinion No. 651 (2015). Menstrual Cycle as a Vital Sign. doi:10.1097/AOG.0000000000001215.`],
      actionTarget: { pillar: 'body', label: 'Open Irregular-Cycle Tracker' }
    },
    {
      id: 'insulin-resistance',
      title: `Insulin Resistance & Metabolic Markers`,
      subtitle: `How insulin signaling interacts with ovarian hormones, energy, and skin markers`,
      category: 'PCOS & Hormones',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Metabolic Markers', rows: [
        { label: 'Skin Sign', value: 'Acanthosis nigricans (neck, underarm folds)' },
        { label: 'Key Lab Tests', value: 'Fasting Insulin, Fasting Glucose, HbA1c' },
        { label: 'Daily Symptoms', value: 'Post-meal drowsiness, intense sweet cravings' },
        { label: 'Primary Lifestyle Lever', value: 'Protein-first meals + strength movement' }
      ] },
      lead: `Insulin is the hormone that moves glucose from the bloodstream into cells for energy. In insulin resistance, cells require higher insulin levels to absorb the same amount of glucose. Crucially, fasting blood sugar and HbA1c can stay completely normal for years while fasting insulin is already elevated.`,
      sections: [
        { id: 'recognizing-signs', heading: '1. Subtle Early Indicators',
          paragraphs: [`Because standard blood glucose tests often miss early hyperinsulinemia, clinicians watch for physical and symptom clues:`],
          bullets: [
            `Acanthosis nigricans: Dark, velvety hyperpigmentation on the back of the neck, knuckles, or underarms.`,
            `Postprandial crash: Heavy sleepiness or brain fog 60–90 minutes after carbohydrate-rich meals.`,
            `Reactive cravings: Sudden irritability or shakiness if meals are delayed.`
          ] },
        { id: 'practical-habits', heading: '2. Practical Metabolic Support',
          paragraphs: [`Simple meal sequencing and muscle engagement lower post-meal insulin spikes without restrictive dieting:`],
          bullets: [
            `Eat fiber (vegetables/dal) and protein (paneer, eggs, legumes, curd, tofu) before refined starches.`,
            `Take a 10–15 minute walk after dinner—contracting leg muscles absorb glucose independently of insulin.`,
            `Avoid skipping meals followed by high-sugar snacks, which exaggerates insulin surges.`
          ] }
      ],
      relatedIds: ['pcos', 'hyperandrogenism'],
      references: [`Diamanti-Kandarakis E, Dunaif A. (2012). Insulin resistance and the polycystic ovary syndrome revisited. Endocrine Reviews.`],
      actionTarget: { pillar: 'body', label: 'Check Metabolic Markers in Screener' }
    },
    {
      id: 'hyperandrogenism',
      title: `Hyperandrogenism: Hormonal Acne, Hirsutism & Hair Thinning`,
      subtitle: `Understanding androgen-sensitive skin and hair changes in women’s health`,
      category: 'PCOS & Hormones',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Clinical Signs', rows: [
        { label: 'Acne Distribution', value: 'Lower third of face (jawline, chin, neck)' },
        { label: 'Hirsutism', value: 'Coarse terminal hair on lip, chin, chest, abdomen' },
        { label: 'Scalp Pattern', value: 'Widening central part (androgenetic alopecia)' },
        { label: 'Lab Check', value: 'Total/Free Testosterone, DHEA-S, 17-OHP' }
      ] },
      lead: `Androgens (such as testosterone and DHEA-S) are normally present in women in small amounts. When ovaries or adrenal glands produce excess androgens—or hair follicles and oil glands become extra sensitive to them—characteristic skin and hair signs appear.`,
      sections: [
        { id: 'acne-vs-hormonal', heading: '1. Hormonal Acne vs. Everyday Breakouts',
          paragraphs: [`While surface blackheads on the T-zone often respond to topical washes, hormonal acne driven by elevated androgens typically appears as deeper, tender cysts along the jawline, chin, and upper neck and frequently flares before menstruation.`] },
        { id: 'hair-changes', heading: '2. Hirsutism and Scalp Thinning',
          paragraphs: [`Androgens transform fine, light vellus hairs on the chin, upper lip, sideburns, or lower abdomen into thicker terminal hairs (hirsutism). Simultaneously, high dihydrotestosterone (DHT) at the scalp can shrink scalp follicles, causing a widening hair part. Always check ferritin (iron stores), vitamin D, and thyroid alongside androgens when evaluating hair loss.`] }
      ],
      relatedIds: ['pcos', 'insulin-resistance'],
      references: [`Martin KA et al. (2018). Evaluation and Treatment of Hirsutism in Premenopausal Women: Endocrine Society Clinical Practice Guideline.`],
      actionTarget: { pillar: 'body', label: 'Evaluate Skin & Hair Markers' }
    },
    {
      id: 'pregnancy-care',
      title: `Pregnancy Milestones, Nutrition & Urgent Red Flags`,
      subtitle: `Trimester-by-trimester prenatal checkups and emergency warning signs`,
      category: 'Menstrual & Reproductive',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Antenatal Essentials', rows: [
        { label: '1st Trimester (Wks 1–12)', value: 'Folic acid 400 mcg, baseline CBC/TSH, dating scan' },
        { label: '2nd Trimester (Wks 13–26)', value: 'Anomaly scan (18–20w), Iron/Calcium, OGTT (24–28w)' },
        { label: '3rd Trimester (Wks 27–40)', value: 'BP checks, daily fetal kick counts, birth plan' }
      ] },
      lead: `Consistent antenatal checkups protect both maternal and fetal health by catching anemia, gestational diabetes, and blood-pressure disorders early.`,
      sections: [
        { id: 'urgent-red-flags', heading: '1. Red Flags Requiring Immediate Hospital Care',
          paragraphs: [`Never wait for a scheduled appointment if any of the following occur during pregnancy:`],
          bullets: [
            `Vaginal bleeding, gush of watery fluid, or severe one-sided abdominal pain.`,
            `Sudden swelling of face/hands, severe persistent headache, or blurred vision (preeclampsia warning signs).`,
            `Noticeable reduction in fetal movements in the third trimester.`,
            `High fever or painful urination.`
          ] }
      ],
      relatedIds: ['irregular-cycles', 'breast-self-check'],
      references: [`WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience.`],
      actionTarget: { pillar: 'body', label: 'View Trimester Guide' }
    },
    {
      id: 'breast-self-check',
      title: `Breast Self-Awareness & Monthly Check Guide`,
      subtitle: `How to recognize normal cyclic breast changes vs. signs worth clinical review`,
      category: 'Menstrual & Reproductive',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Self-Check Protocol', rows: [
        { label: 'Best Timing', value: '3–5 days after period ends (least tender)' },
        { label: 'Frequency', value: 'Once monthly on a consistent date' },
        { label: 'Technique', value: 'Flat finger pads · 3 pressure levels · Quadrant + armpit sweep' }
      ] },
      lead: `Breast self-awareness helps women learn what is normal for their own bodies so new or persistent changes are noticed early. Most breast lumps in young women are benign cysts or fibroadenomas, yet any persistent change deserves a doctor’s exam.`,
      sections: [
        { id: 'what-to-look-for', heading: '1. Warning Signs to Discuss With a Doctor',
          paragraphs: [`Contact a clinic or gynecologist if you notice:`],
          bullets: [
            `A new, firm, painless lump or localized thickening that persists past one full menstrual cycle.`,
            `Skin dimpling, puckering ("orange-peel" texture), redness, or warmth.`,
            `Newly inverted nipple or spontaneous bloody/clear single-duct discharge.`,
            `Persistent swelling in the armpit or above the collarbone.`
          ] }
      ],
      relatedIds: ['pregnancy-care', 'irregular-cycles'],
      references: [`Breast Health Global Initiative / National Cancer Institute Clinical Breast Awareness Guidelines.`],
      actionTarget: { pillar: 'body', label: 'Start 5-Step Breast Check' }
    },
    {
      id: 'mental-health-hormones',
      title: `Mental Well-being, Stress & Hormonal Balance`,
      subtitle: `Evidence-based coping tools, cortisol-cycle effects, and judgment-free support`,
      category: 'Mental Well-being',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Mind-Body Link', rows: [
        { label: 'PCOS Overlap', value: 'Higher screening rates of anxiety & mood shifts' },
        { label: 'Autonomic Reset', value: '4-7-8 paced breathing & 5-4-3-2-1 grounding' },
        { label: 'Helpline (India)', value: '14416 (Tele-MANAS 24x7) · 181 (Women Helpline)' }
      ] },
      lead: `Chronic psychological stress activates the hypothalamic-pituitary-adrenal (HPA) axis, raising cortisol. Elevated cortisol can worsen insulin resistance, disrupt sleep, and delay ovulation—creating a two-way bridge between mental well-being and menstrual health.`,
      sections: [
        { id: 'coping-mechanisms', heading: '1. Immediate Physiological Reset Tools',
          paragraphs: [`Extended exhalations (such as 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s) stimulate the vagus nerve and lower heart rate within 2–3 minutes. Sensory 5-4-3-2-1 grounding interrupts acute panic spirals by anchoring attention in the immediate physical environment.`] }
      ],
      relatedIds: ['pcos', 'privacy-safety-rights'],
      references: [`Dokras A et al. (2018). Androgen Excess and PCOS Society recommendations on depression and anxiety screening in PCOS.`],
      actionTarget: { pillar: 'mind', label: 'Open Encrypted Journal & AI Support' }
    },
    {
      id: 'privacy-safety-rights',
      title: `Digital Privacy, Zero-FIR & NCII Takedown Rights`,
      subtitle: `Protecting health data, countering stalkerware, and legal remedies for image-based abuse`,
      category: 'Safety & Legal Rights',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Emergency & Legal Reference (India)', rows: [
        { label: 'Emergency Dispatch', value: '112 (All-in-one) · 181 (Women Helpline)' },
        { label: 'Cyber Crime Portal', value: '1930 · cybercrime.gov.in' },
        { label: 'NCII Takedown Law', value: 'IT Rules 2021 Rule 3(2)(b) — 24-hour removal' },
        { label: 'Period App Privacy', value: '84% of studied apps leaked user data (ORCHA 2022)' }
      ] },
      lead: `Independent audits by ORCHA (2022) and Privacy International found that the vast majority of commercial period-tracking apps share intimate reproductive data with third-party ad brokers. Sakhi360 stores sensitive entries encrypted locally with AES-256-GCM and provides rapid legal defense tools.`,
      sections: [
        { id: 'zero-fir', heading: '1. Right to File a Zero-FIR',
          paragraphs: [`Under Indian criminal procedure, a police station cannot refuse to register a cognizable offense because the incident occurred outside its local jurisdiction. A Zero-FIR can be filed at any nearby police station and is then transferred to the appropriate station.`] },
        { id: 'deepfake-takedown', heading: '2. Deepfake & Non-Consensual Imagery Takedown',
          paragraphs: [`Under Rule 3(2)(b) of India’s Information Technology Rules (2021) and IT Act Sections 66E, 67, and 67A, social platforms must act within 24 hours to remove non-consensual morphed or intimate imagery. Generating a local cryptographic hash via StopNCII.org blocks re-uploads across participating platforms without uploading your raw photos.`] }
      ],
      relatedIds: ['mental-health-hormones', 'pcos'],
      references: [
        `ORCHA (2022). Privacy issues with period tracking apps.`,
        `Privacy International. No Body’s Business but Mine, Vol. 2.`,
        `NCRB Crime in India 2022.`
      ],
      actionTarget: { pillar: 'defense', label: 'Open Takedown & Privacy Shield' }
    }
  ];

  /* ---- Expanded SakhiPedia content ----
     Summarised in our own words from Wikipedia (CC BY-SA 4.0) and the cited clinical guidance.
     Figures carry the year of the source where it is older. Educational only. */
  const WIKI_NOTE = 'Wikipedia contributors. ';
  const WP = function (title, slug) { return WIKI_NOTE + title + '. Wikipedia, The Free Encyclopedia (read November 2026). https://en.wikipedia.org/wiki/' + slug; };

  (function expandPcos() {
    const pcos = ENCYCLOPEDIA_ARTICLES[0];
    pcos.infobox.rows.push(
      { label: 'New Name (2026)', value: 'PMOS — Polyendocrine Metabolic Ovarian Syndrome (Lancet consensus, May 2026)' },
      { label: 'Global Prevalence', value: '5–18% depending on criteria; WHO estimate 6–13% of reproductive-age women' },
      { label: 'Other Names', value: 'Stein–Leventhal syndrome, hyperandrogenic anovulation' }
    );
    pcos.relatedIds.push('hormonal-contraception', 'endometriosis', 'womens-health-overview');
    pcos.sections.push(
      { id: 'naming-pmos', heading: '7. Why the Name Is Changing: PCOS → PMOS',
        paragraphs: [
          `In May 2026 an international expert consensus published in The Lancet proposed replacing “polycystic ovary syndrome” with “polyendocrine metabolic ovarian syndrome” (PMOS). The old label suggested an ovarian problem built around cysts, yet the “cysts” are really stalled immature follicles and are not needed for diagnosis. The condition also reaches well beyond the ovaries.`,
          `Doctors say the change is gradual: diagnosis, criteria and treatment guidance are mostly unchanged for now, and “PCOS” will keep appearing on records, prescriptions and insurance forms for some time. You do not need to do anything because of the rename.`
        ] },
      { id: 'causes-genetics', heading: '8. Causes & Risk Factors',
        paragraphs: [`The exact cause is unknown. It appears to come from a mix of inherited and environmental influences that act through insulin signalling and androgen production.`],
        bullets: [
          `Genetics: the condition clusters in families, and identical twins match about twice as often as non-identical twins. Genome studies have linked roughly two dozen gene regions, a number of them confirmed in more than one study.`,
          `Early signs: early pubic hair (premature adrenarche), a family history, and excess weight raise the likelihood.`,
          `Possible contributors still being studied: low birth weight, higher androgen exposure before birth, and chemicals that disturb hormones (such as bisphenol A and phthalates). Much of the evidence on effects across generations comes from animal studies.`,
          `Symptoms usually begin around puberty. Starting hormonal contraception very early can hide the pattern until the pill is stopped.`
        ] },
      { id: 'how-hormones-interact', heading: '9. How the Hormones Interact',
        paragraphs: [
          `In PCOS the brain’s signal to the ovaries (GnRH) pulses faster, so LH rises while FSH stays about the same. High LH pushes ovarian theca cells to make extra androgens, and those androgens together with a high anti-Müllerian hormone (AMH) from many small follicles stop follicles from maturing, so ovulation becomes rare.`,
          `Insulin resistance feeds the loop: extra insulin lowers SHBG (the protein that binds testosterone), leaving more free androgen. Body fat also makes androgens and adds low-grade inflammation, which is why metabolic and reproductive symptoms reinforce each other. Insulin resistance can occur even in lean women.`
        ] },
      { id: 'diagnosis-today', heading: '10. How Doctors Diagnose It Today',
        paragraphs: [`Diagnosis needs other causes ruled out first. The widely recommended Rotterdam approach asks for two of three features; the 2023 international guideline refined how to apply them.`],
        bullets: [
          `Irregular cycles: for example a single cycle longer than 90 days, cycles usually shorter than 21 or longer than 45 days, or cycles usually longer than 35 days from three years after the first period.`,
          `Androgen excess: visible signs (hirsutism scored on the Ferriman–Gallwey scale, persistent acne, scalp thinning) or raised blood androgens, ideally measured by mass spectrometry. Hormonal contraception can distort results, so a washout of about three months may be needed.`,
          `Polycystic ovaries on ultrasound (commonly at least 20 follicles of 2–9 mm, or ovarian volume of 10 cm³ or more) or a high AMH level. In adults the guideline lets doctors use either ultrasound or AMH, not both, to avoid over-diagnosis.`,
          `Teenagers: both irregular cycles and androgen excess are required, and a single feature means “at risk” with reassessment later.`,
          `Older criteria: the 1990 NIH criteria were stricter, requiring both irregular cycles and androgen excess. The 2006 Androgen Excess Society criteria were never widely adopted.`,
          `Rule-outs: thyroid disease (TSH), raised prolactin, and non-classic congenital adrenal hyperplasia (17-hydroxyprogesterone). Strongly masculine changes (virilisation) point to a different cause, such as an androgen-producing tumour.`
        ] },
      { id: 'complications', heading: '11. Long-Term Health Risks',
        paragraphs: [`PCOS is a lifelong condition, and regular monitoring matters more than the cyst count. Risks are higher but not inevitable.`],
        bullets: [
          `Metabolic: roughly three to seven times the risk of metabolic problems; about 40% develop metabolic syndrome. Type 2 diabetes risk is clearly higher in women who are overweight, with less clear increase in lean women. Fatty liver disease, high cholesterol and high blood pressure are more common.`,
          `Heart and blood vessels: studies suggest about double the risk of coronary disease and stroke compared with women of the same BMI without PCOS.`,
          `Uterine lining: about three times the risk of endometrial cancer, linked to long gaps without periods. Having a withdrawal bleed at least every three months (often via hormonal treatment) protects the lining.`,
          `Sleep apnoea is more frequent, especially with higher body weight.`,
          `Mental health: higher rates of depression, anxiety, bipolar disorder, OCD, binge eating and body-image distress. Screening and treatment (therapy, CBT, medication) are part of good care.`,
          `Pregnancy: higher chances of gestational diabetes, high blood pressure, pre-eclampsia, miscarriage and newborn intensive-care admission, so early antenatal monitoring is advised.`
        ] },
      { id: 'treatment-detail', heading: '12. Treatment Options in Detail',
        paragraphs: [`There is no cure; treatment is matched to the person’s main goal and reviewed over time. Ask your doctor which options suit you.`],
        bullets: [
          `Lifestyle first: even a 5% weight loss can improve metabolic markers. Guidance is about 150 minutes of moderate activity per week to prevent weight gain and about 250 minutes for weight loss. No single diet has proved best.`,
          `Combined oral contraceptives: first-line for cycle control, acne and hirsutism, and they lower endometrial cancer risk. Hair changes may take 6–12 months to improve. Progestin-only pills regulate bleeding but do not treat androgen symptoms; progestins with androgenic effects are best avoided.`,
          `Metformin: used (off-label) when BMI is above 25 to improve insulin resistance and lipids; stomach upset is common. GLP-1 medicines such as liraglutide or semaglutide may give larger metabolic gains and are stopped at least two months before trying to conceive.`,
          `Anti-androgens (spironolactone, flutamide): can ease hirsutism when contraceptives are unsuitable; they must not be used in pregnancy, and finasteride is likewise avoided.`,
          `Inositol: some metabolic benefit, but metformin is preferred for hirsutism and abdominal fat. Laser hair removal or shaving can help cosmetically. Bariatric surgery is considered at BMI above 35.`,
          `Fertility: letrozole is first-line and beats clomiphene for live births. Other steps include clomiphene with or without metformin, gonadotropin injections (higher chance of twins or more), laparoscopic ovarian drilling, and finally IVF, where freezing all embryos or in-vitro maturation lowers the risk of over-stimulation. Families end up the same size as in women without PCOS.`
        ] },
      { id: 'monitoring', heading: '13. Monitoring Checklist',
        paragraphs: [`A practical schedule to discuss with your doctor:`],
        bullets: [
          `A two-hour glucose tolerance test at diagnosis, repeated every one to three years depending on risk.`,
          `Lipid profile and yearly blood-pressure checks; weight and waist tracking.`,
          `Screening for low mood, anxiety and sleep problems at each review.`,
          `An endometrial check or progestin cover if periods are very infrequent.`
        ] },
      { id: 'epidemiology', heading: '14. How Common Is It?',
        paragraphs: [
          `It is the most common hormonal disorder in women of reproductive age. Reported prevalence runs from about 5% to 18% depending on which criteria are used (the WHO estimate is 6–13%): around 10–13% by Rotterdam criteria and about 5.5% by the stricter NIH criteria. Rates look higher in South-East Asia and the Eastern Mediterranean, and are rising partly because of broader criteria and better detection.`,
          `Presentation differs by ancestry: South Asian women often show more metabolic features and a higher BMI at the same stage, East Asian women less hirsutism, and African and Hispanic American women more insulin resistance. In the United States the yearly cost has been put above US$15 billion, and research funding has lagged behind conditions with similar numbers of patients.`
        ] },
      { id: 'history', heading: '15. A Short History',
        paragraphs: [
          `Hippocrates described women with thick skin and absent periods. An Italian text in 1721 recorded infertile women with enlarged, hardened ovaries, and the French physician Achille Chéreau likely gave the first formal description of polycystic ovaries in 1844. In 1935 Irving Stein and Michael Leventhal tied the ovarian changes to excess hair, absent periods and infertility, giving the syndrome its old eponym. The metabolic side was studied from the 1980s, genetics from the 1990s, and the 2026 consensus produced the new name.`
        ] }
    );
    pcos.references.push(
      WP('Polycystic ovary syndrome', 'PCOS'),
      `Teede HJ et al. (2026). Polyendocrine metabolic ovarian syndrome: the new name for polycystic ovary syndrome — a multistep global consensus process. The Lancet.`,
      `Yale Medicine (June 2026). PCOS is renamed PMOS.`
    );
  })();

  (function expandCycles() {
    const cyc = ENCYCLOPEDIA_ARTICLES.filter(function (a) { return a.id === 'irregular-cycles'; })[0];
    cyc.infobox.rows.push(
      { label: 'Cycle Median', value: '28 days (range 21–35)' },
      { label: 'Typical Blood Loss', value: 'About 30–60 mL per period' },
      { label: 'First Period (Menarche)', value: 'Usually age 12–13 (earlier in precocious puberty)' },
      { label: 'Last Period (Menopause)', value: 'Usually 45–55, average about 52' }
    );
    cyc.relatedIds.push('endometriosis', 'fibroids', 'menopause', 'hormonal-contraception');
    cyc.sections.push(
      { id: 'hormone-timeline', heading: '3. Hormones Behind the Cycle',
        paragraphs: [
          `The brain’s hypothalamus releases GnRH, which tells the pituitary to release FSH and LH. Early in the cycle FSH helps follicles grow while rising oestrogen thickens the womb lining. A surge of LH triggers ovulation roughly 10–12 hours later.`,
          `After ovulation the empty follicle becomes the corpus luteum and makes progesterone. If no pregnancy occurs, progesterone and oestrogen fall and the lining is shed. Seen from the womb’s side the phases are menstrual, proliferative and secretory; from the ovary’s side they are follicular, ovulation and luteal.`
        ],
        bullets: [
          `Follicular phase is shorter with age: about 14 days at ages 18–24 and about 10 days at 40–44.`,
          `Luteal phase is steadier: 10–16 days, averaging 14.`,
          `An egg survives 24 hours or less after release.`
        ] },
      { id: 'common-disorders', heading: '4. Common Period Problems',
        paragraphs: [`These are frequent, treatable, and worth raising with a doctor when they disrupt life.`],
        bullets: [
          `PMS: acne, breast tenderness, bloating, tiredness and mood changes in the days before a period. PMDD is the severe form that disrupts daily life, affecting about 3–8% of women.`,
          `Dysmenorrhoea (painful periods): cramping that can spread to the back and thighs. Pain that stops you from working or studying is not something to simply endure; it can point to conditions such as endometriosis.`,
          `Menorrhagia (heavy bleeding): raises the risk of iron-deficiency anaemia, so ask about a ferritin and haemoglobin check.`,
          `Anovulation: common soon after the first periods and before menopause, but chronic anovulation affects roughly 6–15% of women of reproductive age. Stress, eating disorders and very intense training can cause it, as can PCOS.`
        ] },
      { id: 'ovulation-signs', heading: '5. Spotting Ovulation (and the Limits of Tracking)',
        paragraphs: [`Signs of fertile days include clear, stretchy, egg-white cervical mucus, a mild one-sided mid-cycle ache (mittelschmerz) and a small rise in morning basal body temperature after ovulation. Ovulation often falls near day 14, but not in every cycle or every person.`],
        bullets: [
          `About one in three cycles that look normal may not involve ovulation, so calendar or mucus tracking alone can miss anovulation.`,
          `Fertility-awareness methods are less reliable than hormonal or device methods for preventing pregnancy.`,
          `Hormonal contraception changes the pattern; the bleed on the pill is a withdrawal bleed, not a true period.`
        ] }
    );
    cyc.references.push(WP('Menstrual cycle', 'Menstrual_cycle'));
  })();

  ENCYCLOPEDIA_ARTICLES.filter(function (a) { return a.id === 'breast-self-check'; })[0].relatedIds.push('breast-cancer');

  ENCYCLOPEDIA_ARTICLES.push(
    {
      id: 'womens-health-overview',
      title: `Women’s Health: A Global Overview`,
      subtitle: `Leading causes of illness and death, reproductive health, mental health and why women’s needs differ`,
      category: 'Life Stages & Wellness',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Key Numbers', rows: [
        { label: 'Top Killer', value: 'Cardiovascular disease — about 35% of women’s deaths worldwide' },
        { label: 'Top 3 Cancers (2020)', value: 'Breast, lung, colorectal (about 44.5% of cases)' },
        { label: 'Anaemia', value: 'Up to 30% of women and 42% of pregnant women' },
        { label: 'Depression', value: 'About twice as common as in men' },
        { label: 'Maternal Deaths (2013)', value: '≈ 289,000 — WHO says ~99% are preventable' },
        { label: 'India Helplines', value: '112 · 181 (Women) · 14416 (Tele-MANAS) · 1930 (Cyber)' }
      ] },
      lead: `Women’s health is more than reproductive health. It covers physical, mental and social well-being across the whole life, and it includes conditions that affect women only, conditions that affect women differently, and the social factors (income, violence, access to care) that shape every outcome.`,
      sections: [
        { id: 'big-causes', heading: '1. What Women Mostly Fall Ill and Die From',
          paragraphs: [`Worldwide the leading cause of death in women is heart and blood-vessel disease, yet it is still widely thought of as a “men’s disease”, and symptoms in women can look different and be missed.`],
          bullets: [
            `Cardiovascular disease: about 35% of deaths in women globally.`,
            `Cancer is second. Lung cancer has overtaken others as the top cancer killer of women; breast cancer is the most common cancer (about a quarter of all cases); cervical cancer is the fourth most common; ovarian cancer is usually found late (over half at stage III or beyond) and has no effective screening test.`,
            `Dementia causes about 4.5% of female deaths versus 2.0% of male deaths, and about two-thirds of people with Alzheimer’s are women.`,
            `Osteoporosis: about 16% of women over 50 (US data) have it at the hip or spine, versus about 4% of men.`,
            `Anaemia (mostly iron deficiency): up to 30% of women and 42% of pregnant women.`
          ] },
        { id: 'reproductive', heading: '2. Reproductive & Sexual Health',
          paragraphs: [`Reproductive issues account for about one-third of health problems in women aged 15–44.`],
          bullets: [
            `Maternal health: roughly 289,000 women died of pregnancy-related causes in 2013, about 800 a day; sub-Saharan Africa and South Asia carry 86% of the toll. Severe bleeding is the leading direct cause. Nearly all of these deaths are preventable with skilled care.`,
            `Obstetric fistula affects about 2 million women, with up to 100,000 new cases each year.`,
            `Contraception: global use was about 55% (2014), as low as 25% in parts of Africa, and some 222 million women lacked access.`,
            `Child marriage: an estimated 70 million women had been married as children by 2012, highest in South Asia (48%) and Africa (42%).`,
            `Female genital mutilation affects over 200 million women and girls.`,
            `Syphilis in pregnancy still causes over 300,000 fetal and newborn deaths a year; it is treatable and screening is cheap.`
          ] },
        { id: 'mental-violence', heading: '3. Mental Health & Safety',
          paragraphs: [`Almost one in four women experiences a mental-health problem in her lifetime. Depression is about twice as common as in men, often around hormonal transitions such as puberty, pregnancy, the postnatal period and menopause. Suicide rates are lower than in men, but it is a leading cause of death for women under 60.`],
          bullets: [
            `About 35% of women worldwide have experienced physical or sexual violence, and 38% of female murders are committed by an intimate partner.`,
            `Women who are homeless, imprisoned or using substances are around 10–13 times more likely to die at a given age than other women.`
          ] },
        { id: 'sex-differences', heading: '4. Why Women Are Not Just “Smaller Men”',
          paragraphs: [`Biology and medicine differ by sex more than most people assume.`],
          bullets: [
            `Women live longer than men in nearly every country but spend more years in poor health.`,
            `Women often respond differently to drugs, yet in one 2004 analysis they were under a quarter of clinical-trial participants, and only 10–47% in heart-disease trials.`,
            `Lifetime stroke risk is higher in women; non-smoking women have about three times the lung-cancer risk of non-smoking men.`,
            `Women are diagnosed with cancer at younger ages, although their lifetime chance is lower (about 38% versus 45%).`
          ] },
        { id: 'screening-checklist', heading: '5. Screening & Prevention Checklist',
          paragraphs: [`Talk with a doctor about which of these apply to you and when:`],
          bullets: [
            `Cervical screening (Pap or HPV test) and HPV vaccination — see the Cervical Cancer article.`,
            `Breast awareness and, from the recommended age, mammography — see Breast Cancer.`,
            `Blood pressure, cholesterol, blood sugar and weight, especially with PCOS or a family history.`,
            `Haemoglobin / ferritin, vitamin D and B12 if you have heavy periods, fatigue or a vegetarian diet.`,
            `Bone health from midlife: weight-bearing exercise, calcium and vitamin D.`,
            `Mental-health check-ins during major life transitions.`
          ] }
      ],
      relatedIds: ['pcos', 'cervical-cancer', 'breast-cancer', 'menopause', 'mental-health-hormones'],
      references: [
        WP('Women’s health', 'Women%27s_health'),
        `World Health Organization. Women’s health fact sheets.`
      ],
      actionTarget: { pillar: 'body', label: 'Open Body Pillar' }
    },
    {
      id: 'endometriosis',
      title: `Endometriosis`,
      subtitle: `Tissue like the womb lining growing outside the womb, a major cause of period pain and infertility`,
      category: 'Menstrual & Reproductive',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Endometriosis at a Glance', rows: [
        { label: 'Who', value: 'About 10% of women of reproductive age (~200 million worldwide)' },
        { label: 'Typical Sites', value: 'Ovaries, fallopian tubes, pelvic lining; rarely lungs, diaphragm, skin' },
        { label: 'Main Symptom', value: 'Painful periods and chronic pelvic pain' },
        { label: 'Diagnosis Delay', value: 'Often 5–12 years from first symptoms' },
        { label: 'Gold-Standard Test', value: 'Laparoscopy with biopsy (imaging first)' },
        { label: 'Fertility', value: 'Affects about a quarter of diagnosed women' }
      ] },
      lead: `In endometriosis, tissue that resembles the lining of the womb grows in other places, most often on the ovaries, fallopian tubes and the pelvic lining. This tissue responds to the monthly hormone cycle, causing inflammation, scarring and pain. Symptoms range from none to severely disabling and usually ease after menopause.`,
      sections: [
        { id: 'endo-symptoms', heading: '1. Symptoms',
          paragraphs: [`Pain typically follows the menstrual cycle and peaks during the period, but can become constant.`],
          bullets: [
            `Very painful periods (dysmenorrhoea) and long-term pelvic pain.`,
            `Pain during sex, urination or bowel movements, especially around menstruation.`,
            `Heavy bleeding and fatigue.`,
            `Difficulty getting pregnant — sometimes the only symptom.`
          ] },
        { id: 'endo-causes', heading: '2. Causes & Risk Factors',
          paragraphs: [`The cause is not fully known. Leading ideas include backflow of menstrual blood, genetic predisposition, immune dysfunction and hormones; oestrogen fuels the lesions.`],
          bullets: [
            `A mother, sister or daughter with endometriosis raises risk several-fold.`,
            `Early first period, short cycles, low body weight, never having given birth, and blocked menstrual outflow.`,
            `Possible links: exposure to certain hormone-disrupting chemicals, night-shift work and high red-meat intake.`
          ] },
        { id: 'endo-diagnosis', heading: '3. Diagnosis — and Why It Takes So Long',
          paragraphs: [`A doctor combines your history, a pelvic exam and ultrasound or MRI. Laparoscopy (keyhole surgery) with biopsy confirms it, and there is no validated blood test. Many patients are told severe period pain is “normal”, which is a major reason for delays of 5–12 years. Keep a symptom diary and ask directly whether endometriosis could be involved.`] },
        { id: 'endo-treatment', heading: '4. Treatment',
          paragraphs: [`There is no cure, but symptoms can be controlled.`],
          bullets: [
            `First-line: pain relievers (NSAIDs) plus hormonal treatment — progestins, continuous combined contraceptive pills or a hormonal IUD.`,
            `Second-line: GnRH modulators; third-line: aromatase inhibitors.`,
            `Surgery is used when medicines fail, when large endometriomas (ovarian cysts) are present, or when fertility is affected. Symptoms often return after surgery, and hormone suppression afterwards lowers that risk.`
          ] },
        { id: 'endo-fertility', heading: '5. Fertility & Pregnancy',
          paragraphs: [`About a quarter of women with endometriosis have infertility. Inflammation and endometriomas can reduce ovarian reserve, and surgery on endometriomas can lower it further, so fertility specialists weigh surgery carefully. IVF is effective. In pregnancy there is a higher chance of placenta previa, preterm birth, pre-eclampsia, placental abruption and stillbirth, so antenatal care should note the diagnosis.`] },
        { id: 'endo-other', heading: '6. Wider Health Links',
          paragraphs: [`Deep disease can cause bowel obstruction. Studies link endometriosis with cardiovascular disease, depression and anxiety, autoimmune conditions and a small increase in some cancers (ovarian, thyroid), which makes regular follow-up worthwhile.`] }
      ],
      relatedIds: ['irregular-cycles', 'pcos', 'hormonal-contraception', 'fibroids'],
      references: [WP('Endometriosis', 'Endometriosis')],
      actionTarget: { pillar: 'body', label: 'Log Period Pain in Cycle Tracker' }
    },
    {
      id: 'fibroids',
      title: `Uterine Fibroids`,
      subtitle: `Common non-cancerous growths of the womb muscle`,
      category: 'Menstrual & Reproductive',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Fibroids at a Glance', rows: [
        { label: 'Nature', value: 'Benign smooth-muscle tumours of the uterus (leiomyomas)' },
        { label: 'How Common', value: 'An estimated 20–80% of women by age 50' },
        { label: 'Main Symptoms', value: 'Heavy or long periods, pelvic pressure, anaemia' },
        { label: 'First Tests', value: 'Pelvic exam and ultrasound (MRI if unclear)' },
        { label: 'Cancer Risk', value: 'Very rare (leiomyosarcoma)' }
      ] },
      lead: `Uterine fibroids are non-cancerous lumps of muscle that grow in the womb wall, singly or in groups and from microscopic to very large. Many women never notice them, and they often shrink after menopause because they depend on oestrogen and progesterone.`,
      sections: [
        { id: 'fib-symptoms', heading: '1. Symptoms & Risk Factors',
          paragraphs: [`Many women have no symptoms. When present they can include:`],
          bullets: [
            `Heavy or prolonged periods leading to anaemia, tiredness and breathlessness.`,
            `Pelvic or lower-back pain, pain during sex, bloating or constipation.`,
            `Pressure on the bladder causing frequent urination.`,
            `Risk factors: family history (about three times the risk for daughters of affected mothers), African ancestry, obesity, PCOS, diabetes, high blood pressure and never having given birth. A diet rich in fruit and vegetables may lower risk, while high red-meat intake may raise it.`
          ] },
        { id: 'fib-diagnosis-treatment', heading: '2. Diagnosis & Treatment',
          paragraphs: [`A pelvic exam and ultrasound usually suffice. Rapid growth, especially after menopause, prompts closer checking for the rare cancerous form.`],
          bullets: [
            `No symptoms: usually just watch and review.`,
            `Medicines: NSAIDs for pain, iron for anaemia, hormonal options (pills, levonorgestrel IUD) and GnRH analogues, usually short-term and often before surgery.`,
            `Procedures: myomectomy (removes fibroids, keeps the womb and fertility), uterine artery embolisation, ablation techniques, MR-guided focused ultrasound, or hysterectomy.`
          ] },
        { id: 'fib-pregnancy', heading: '3. Fibroids, Fertility & Pregnancy',
          paragraphs: [`Fibroids explain only about 3% of infertility. Most women with fibroids have normal pregnancies, though fibroids inside the womb cavity (submucosal) are the most likely to interfere with implantation. During pregnancy they can be linked to bleeding, miscarriage, preterm labour or an unusual baby position. One review suggested that uterine artery embolisation may increase later miscarriage risk, so women who want children should discuss myomectomy as an option.`] }
      ],
      relatedIds: ['irregular-cycles', 'endometriosis', 'pcos'],
      references: [WP('Uterine fibroid', 'Uterine_fibroid')],
      actionTarget: { pillar: 'body', label: 'Track Heavy-Bleeding Symptoms' }
    },
    {
      id: 'menopause',
      title: `Menopause & Perimenopause`,
      subtitle: `The natural end of periods: timing, symptoms, long-term health and treatment choices`,
      category: 'Life Stages & Wellness',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Menopause Reference', rows: [
        { label: 'Definition', value: '12 consecutive months with no period' },
        { label: 'Usual Age', value: '45–55; average about 51–52' },
        { label: 'Perimenopause', value: 'Often 3–5 years, sometimes longer; can start in late 30s–40s' },
        { label: 'Early Menopause', value: 'Before age 45; premature ovarian insufficiency before 40' },
        { label: 'Key Long-Term Risks', value: 'Osteoporosis, heart disease, diabetes' }
      ] },
      lead: `Menopause is the permanent end of menstrual periods, confirmed after a full year without bleeding. It is a natural part of ageing, but it can also happen earlier because of surgery, chemotherapy or other medical causes. The years leading up to it (perimenopause) bring the most noticeable changes.`,
      sections: [
        { id: 'meno-phases', heading: '1. Perimenopause and Timing',
          paragraphs: [`During perimenopause cycles become irregular in length and flow while oestrogen levels swing. Smoking tends to bring menopause earlier, and pregnancy may delay it. Menopause before 45 is called early; ovarian failure before 40 is premature ovarian insufficiency, which can follow removal of the ovaries, chemotherapy, radiation, autoimmune disease, untreated coeliac disease, or have no known cause.`] },
        { id: 'meno-symptoms', heading: '2. Symptoms',
          paragraphs: [`Severity varies enormously from woman to woman.`],
          bullets: [
            `Hot flushes, night sweats and sleep problems.`,
            `Vaginal dryness and discomfort, urinary changes.`,
            `Joint pain, fatigue, mood changes and trouble concentrating (“brain fog”).`
          ] },
        { id: 'meno-longterm', heading: '3. Long-Term Health After Menopause',
          paragraphs: [`Falling oestrogen speeds bone loss, raising the risk of osteoporosis and fractures. Cholesterol rises, fat shifts to the abdomen, and insulin resistance increases, so heart disease and diabetes risk climbs. Not smoking and managing blood pressure, cholesterol and weight can reduce these risks. Women with PCOS should keep up metabolic checks after menopause too.`] },
        { id: 'meno-treatment', heading: '4. Treatment & Self-Care',
          paragraphs: [`Options depend on symptoms and personal risk, so discuss them with a clinician.`],
          bullets: [
            `Menopausal hormone therapy is the most effective option for hot flushes and also protects bone; suitability depends on clot, heart and breast-cancer history.`,
            `Non-hormonal choices: certain antidepressants (SSRIs/SNRIs), gabapentin, fezolinetant, cognitive behavioural therapy and clinical hypnosis.`,
            `For dryness: vaginal moisturisers, lubricants and low-dose vaginal oestrogen.`,
            `Lifestyle: limit caffeine, alcohol and nicotine; use cooling measures; do weight-bearing exercise; get enough calcium and vitamin D. Evidence for supplements and herbal remedies is limited, so check with a clinician first.`
          ] }
      ],
      relatedIds: ['irregular-cycles', 'womens-health-overview', 'breast-cancer'],
      references: [WP('Menopause', 'Menopause')],
      actionTarget: { pillar: 'body', label: 'Open Cycle Tracker' }
    },
    {
      id: 'cervical-cancer',
      title: `Cervical Cancer, HPV & Screening`,
      subtitle: `A largely preventable cancer: vaccination, screening and early treatment`,
      category: 'Cancer & Screening',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Cervical Cancer Facts', rows: [
        { label: 'Cause', value: 'Persistent high-risk HPV infection (about 99% of cases)' },
        { label: 'Time to Develop', value: 'Usually 10–20 years from pre-cancer' },
        { label: 'Screening (US example)', value: 'Pap from 21; every 3 years; HPV test every 5 years from 30 to 65' },
        { label: 'Vaccine Ages', value: 'Usually 9–26, best before exposure' },
        { label: 'Global Burden (2022)', value: '≈ 660,000 new cases, 350,000 deaths' },
        { label: 'India', value: 'Five-year survival about 46%; age-adjusted rates falling' }
      ] },
      lead: `Cervical cancer is caused by long-lasting infection with high-risk types of the human papillomavirus (HPV). Most HPV infections clear on their own, and the few that persist take 10–20 years to become cancer, which is why vaccination and regular screening are so effective.`,
      sections: [
        { id: 'cc-symptoms', heading: '1. Symptoms & Risk Factors',
          paragraphs: [`Early disease often has no symptoms. Warning signs that need prompt review:`],
          bullets: [
            `Bleeding between periods, after sex or after a pelvic exam, or after menopause.`,
            `Unusual vaginal discharge, pelvic pain or pain during sex.`,
            `Advanced disease: weight loss, tiredness, leg swelling, back pain, or blood in urine or stool.`,
            `Risk factors: HPV (the dominant factor), smoking, HIV or a weakened immune system, long-term oral contraceptive use, many pregnancies, early first sex or many partners, and genetics.`
          ] },
        { id: 'cc-vaccine', heading: '2. HPV Vaccination',
          paragraphs: [`Licensed vaccines protect against between two and seven high-risk HPV types and could prevent up to 90% of cervical cancers. They work best when given before any exposure, usually between ages 9 and 26. By the end of 2023 143 countries offered it to girls. Screening is still needed after vaccination because the vaccine does not cover every type. WHO’s elimination goal is fewer than 4 cases per 100,000 women.`] },
        { id: 'cc-screening', heading: '3. Screening',
          paragraphs: [`Screening finds pre-cancer changes before they turn into cancer. Regular Pap or acid-based screening every 3–5 years can cut incidence by up to 80%. A single Pap can miss cancers, so repeating on schedule matters.`],
          bullets: [
            `US guidance: start at 21; Pap alone every 3 years from 21; from 30 to 65 choose Pap every 3 years, HPV test every 5 years or both together every 5 years; screening before 25 brings little benefit; stopping after 65 is reasonable with a record of normal results.`,
            `Europe: start between 20 and 30 (preferably not before 25).`,
            `Abnormal result: a colposcopy and biopsy confirm or exclude disease. Follow your local programme; in India ask your gynaecologist or a government screening centre.`
          ] },
        { id: 'cc-treatment', heading: '4. Treatment & Outlook',
          paragraphs: [`Treatment depends on stage and the wish to have children: cone biopsy, trachelectomy or hysterectomy for early disease; radiation with cisplatin-based chemotherapy for locally advanced disease; and immunotherapy (pembrolizumab, cemiplimab) or tisotumab vedotin for recurrent or spreading disease.`],
          bullets: [
            `Five-year survival by stage: about 85% at stage 1, 65% at stage 2, 35% at stage 3 and 7% at stage 4 — roughly 66% overall.`,
            `Around 88% of cases and 90% of deaths occur in low- and middle-income countries, mainly where screening and vaccination are limited.`
          ] }
      ],
      relatedIds: ['womens-health-overview', 'hormonal-contraception', 'breast-cancer'],
      references: [WP('Cervical cancer', 'Cervical_cancer'), `World Health Organization. Cervical cancer elimination initiative.`],
      actionTarget: { pillar: 'body', label: 'Open Body Pillar' }
    },
    {
      id: 'breast-cancer',
      title: `Breast Cancer: Risk, Screening & Treatment`,
      subtitle: `The most common cancer in women worldwide — what raises risk and how it is found`,
      category: 'Cancer & Screening',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Breast Cancer Facts', rows: [
        { label: 'Share of Women’s Cancers', value: 'About 25% worldwide' },
        { label: 'Global Cases (2022)', value: '≈ 2.3 million diagnosed, ≈ 670,000 deaths' },
        { label: 'Inherited Share', value: '5–10% (BRCA1/BRCA2 mutations)' },
        { label: 'Screening Test', value: 'Mammography (many guidelines: yearly or 2-yearly from 50)' },
        { label: '5-Year Survival', value: '~91% overall; >99% if confined to the breast' },
        { label: 'Men', value: 'Under 1% of cases' }
      ] },
      lead: `Breast cancer begins in the cells of the milk ducts or lobules. It is the most common cancer in women, and outcomes are very good when it is found early. Awareness of your own breasts helps, but screening mammograms, not self-exams, are what reduce deaths.`,
      sections: [
        { id: 'bc-signs', heading: '1. Signs to Act On',
          paragraphs: [`Many cancers are found by screening before symptoms appear. See a doctor promptly for:`],
          bullets: [
            `A new lump — painless, firm and irregular lumps are more concerning (most lumps in young women are benign, but still get checked).`,
            `Skin dimpling or redness, a newly inverted nipple or nipple discharge.`,
            `Swollen lymph nodes in the armpit or near the collarbone.`,
            `Spread to other organs can cause bone pain, breathlessness, liver symptoms or neurological changes.`
          ] },
        { id: 'bc-risks', heading: '2. Risk Factors',
          paragraphs: [`Most women with breast cancer have no strong risk factor, but these raise the odds:`],
          bullets: [
            `Age: about three-quarters of cases occur after 50.`,
            `Genetics: BRCA1/BRCA2 and other inherited mutations; a close relative with breast cancer.`,
            `Hormonal timing: early first period, late menopause, no children or first birth later in life, and combined hormone replacement therapy. Breastfeeding lowers risk.`,
            `Lifestyle: alcohol (even small amounts), excess weight, inactivity, smoking and a high-fat diet.`,
            `Previous breast cancer or chest radiation before age 30.`
          ] },
        { id: 'bc-screening', heading: '3. Screening',
          paragraphs: [`Mammography reduces breast-cancer deaths by at least about 20%. Most guidelines advise it every year or two for women aged 50–70, and some from the 40s. It misses about 1 in 8 cancers and can give false alarms, and dense breast tissue can hide tumours, in which case ultrasound or MRI may be added.`],
          bullets: [
            `Clinical breast examination is widely used, but its effect on survival is unproven.`,
            `Self-exams have not been shown to lower deaths, yet knowing what is normal for you helps you notice change early — see the Breast Self-Awareness guide.`,
            `Women with a strong family history or known BRCA mutation should ask a doctor about starting earlier and about MRI.`
          ] },
        { id: 'bc-types', heading: '4. Types & Treatment',
          paragraphs: [`About 85% are ductal and 10% lobular. Tumours are also classified by hormone receptors (oestrogen/progesterone) and HER2 (about 15–20%); triple-negative tumours lack all three and tend to grow faster.`],
          bullets: [
            `Early disease: surgery (lumpectomy or mastectomy, often with sentinel lymph-node biopsy), then radiation, chemotherapy, HER2-targeted drugs or hormone therapy depending on the tumour.`,
            `Spread disease (metastatic): control and quality of life using chemotherapy, hormone therapy, targeted drugs and bone-strengthening medicines.`,
            `Supportive care, counselling and peer groups are an important part of treatment.`
          ] },
        { id: 'bc-prevention', heading: '5. Prevention & Outlook',
          paragraphs: [`Healthy weight, limited alcohol, regular activity and breastfeeding prevent a meaningful share of cases. High-risk women may be offered tamoxifen, raloxifene or aromatase inhibitors, or preventive surgery. About 91% of women live at least five years after diagnosis; survival is above 99% when confined to the breast and about 31% once it has spread to distant sites. Survival is lower where screening and treatment are hard to reach.`] }
      ],
      relatedIds: ['breast-self-check', 'womens-health-overview', 'cervical-cancer', 'menopause'],
      references: [WP('Breast cancer', 'Breast_cancer'), `World Health Organization. Breast cancer fact sheet.`],
      actionTarget: { pillar: 'body', label: 'Start 5-Step Breast Check' }
    },
    {
      id: 'hormonal-contraception',
      title: `Hormonal Contraception: Types, Effectiveness & Health Effects`,
      subtitle: `Pills, patches, rings, implants, injections, IUDs and emergency options — including uses in PCOS`,
      category: 'Menstrual & Reproductive',
      lastReviewed: 'November 2026',
      infobox: { heading: 'Contraception Reference', rows: [
        { label: 'Implant', value: 'Failure about 0.05%/yr; lasts ~3–5 years' },
        { label: 'Pill (typical use)', value: 'About 8%/yr; under 1% with perfect use' },
        { label: 'Injection', value: 'Depo-Provera ~3%/yr, every ~3 months' },
        { label: 'Emergency', value: 'Copper IUD most effective; ulipristal or levonorgestrel pills' },
        { label: 'STI Protection', value: 'None — condoms are still needed' },
        { label: 'India Only', value: 'Ormeloxifene (non-steroidal pill)' }
      ] },
      lead: `Hormonal contraceptives use synthetic versions of female hormones to prevent pregnancy. They are also prescribed to treat painful or heavy periods, acne, unwanted hair and PCOS. The best choice depends on health history, preferences and how reliably a method will be used.`,
      sections: [
        { id: 'hc-types', heading: '1. Main Types',
          paragraphs: [`Methods differ in hormones, how often you use them and who controls them.`],
          bullets: [
            `Combined pill (oestrogen + progestin): daily for 21 days, then a 7-day break.`,
            `Progestogen-only pill (“mini-pill”): daily with no break.`,
            `Patch: three weekly patches, then a patch-free week. Vaginal ring: worn three weeks, removed for one.`,
            `Injections: about every 3 months (Depo-Provera) or 2 months, and some combined monthly injections.`,
            `Implant: a small rod under the upper-arm skin, lasting around 3–5 years.`,
            `Hormonal IUD/IUS (such as Mirena): inserted by a clinician, lasts several years and also reduces heavy bleeding.`,
            `Emergency contraception: copper IUD (most effective), ulipristal acetate (prescription) or levonorgestrel (often over the counter).`
          ] },
        { id: 'hc-effectiveness', heading: '2. How Well They Work',
          paragraphs: [`With perfect use, hormonal methods fail less than 1% of the time per year. Methods that do not depend on remembering (implant, IUS) perform the same in real life, around 0.05–0.3%. Pills, patches and rings fail about 8% a year with typical use, and Depo-Provera about 3%. None of them protect against sexually transmitted infections.`] },
        { id: 'hc-risks', heading: '3. Side Effects & Risks',
          paragraphs: [`Most people tolerate these methods well; discuss your own risks with a clinician.`],
          bullets: [
            `Common: breakthrough bleeding (more with progestogen-only methods), lighter withdrawal bleeds, or no bleeding at all with some methods. No proven link to weight gain.`,
            `Blood clots: oestrogen-containing methods raise the risk of deep-vein thrombosis; progestogen-only methods are not believed to. Combined pills also carry higher heart-attack and stroke risk for smokers over 35 and people with diabetes, obesity or heart disease.`,
            `Cancer: combined methods slightly raise breast-cancer risk while in use, falling back to baseline about 10 years after stopping; they roughly halve endometrial and ovarian cancer risk for at least 10 years; small increases are seen for cervical and liver cancer.`,
            `Mood: studies are mixed, and most find no meaningful change, though some people are sensitive to hormonal shifts.`,
            `Breastfeeding: oestrogen methods may reduce milk supply; progestogen-only methods are not believed to.`
          ] },
        { id: 'hc-benefits', heading: '4. Benefits Beyond Contraception',
          paragraphs: [`In PCOS, combined pills reduce ovarian androgen production, regulate cycles and protect the womb lining, and they are the most commonly prescribed treatment for hirsutism (improvement can take 6–12 months). They also reduce heavy bleeding, ease period pain, and the hormonal IUD sharply cuts bleeding and iron loss. Pills are often stopped before trying to conceive, so ask about timing.`] }
      ],
      relatedIds: ['pcos', 'irregular-cycles', 'endometriosis', 'cervical-cancer'],
      references: [WP('Hormonal contraception', 'Hormonal_contraception')],
      actionTarget: { pillar: 'body', label: 'Open Early PCOS Detector' }
    }
  );

  /* ---------------------------------------------------------
     2) ENGINES (health, safety, defense) + helpers
     --------------------------------------------------------- */
  function daysBetween(isoA, isoB) {
    const a = new Date(isoA + 'T00:00:00Z').getTime();
    const b = new Date(isoB + 'T00:00:00Z').getTime();
    return Math.round((b - a) / 86400000);
  }
  function addDays(iso, days) {
    const d = new Date(iso + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function analyzeCycles(logs, referenceDateIso) {
    if (logs.length === 0) {
      return {
        averageCycleDays: 28, minCycleDays: 28, maxCycleDays: 28, variabilityDays: 0, isIrregular: false,
        predictedWindowStart: addDays(referenceDateIso, 25), predictedWindowEnd: addDays(referenceDateIso, 31),
        daysSinceLastStart: 0, currentPhaseLabel: 'No cycle logged yet',
        clinicalNote: 'Log at least two period start dates so Sakhi360 can adapt to your unique rhythm.'
      };
    }
    const sorted = logs.slice().sort((a, b) => a.startDate.localeCompare(b.startDate));
    const latest = sorted[sorted.length - 1];
    const daysSinceLastStart = Math.max(0, daysBetween(latest.startDate, referenceDateIso));

    const intervals = [];
    for (let i = 1; i < sorted.length; i++) {
      const gap = daysBetween(sorted[i - 1].startDate, sorted[i].startDate);
      if (gap >= 14 && gap <= 120) intervals.push(gap);
    }

    if (intervals.length === 0) {
      return {
        averageCycleDays: 29, minCycleDays: 25, maxCycleDays: 34, variabilityDays: 9, isIrregular: false,
        predictedWindowStart: addDays(latest.startDate, 25), predictedWindowEnd: addDays(latest.startDate, 34),
        daysSinceLastStart,
        currentPhaseLabel: daysSinceLastStart <= latest.durationDays ? 'Menstrual phase' : 'Follicular / Luteal',
        clinicalNote: 'Add one more prior cycle to calculate your personal cycle variability range.'
      };
    }

    const sum = intervals.reduce((acc, v) => acc + v, 0);
    const averageCycleDays = Math.round(sum / intervals.length);
    const minCycleDays = Math.min.apply(null, intervals);
    const maxCycleDays = Math.max.apply(null, intervals);
    const variabilityDays = maxCycleDays - minCycleDays;
    const isIrregular = variabilityDays >= 8 || intervals.some(function (d) { return d < 21 || d > 35; });

    const buffer = isIrregular ? Math.max(4, Math.ceil(variabilityDays / 2)) : 2;
    const predictedWindowStart = addDays(latest.startDate, Math.max(21, averageCycleDays - buffer));
    const predictedWindowEnd = addDays(latest.startDate, averageCycleDays + buffer);

    let currentPhaseLabel = 'Luteal / Late Cycle';
    if (daysSinceLastStart <= latest.durationDays) currentPhaseLabel = 'Menstrual Phase';
    else if (daysSinceLastStart < Math.round(averageCycleDays * 0.45)) currentPhaseLabel = 'Follicular Phase';
    else if (daysSinceLastStart <= Math.round(averageCycleDays * 0.58)) currentPhaseLabel = 'Ovulatory Window (Estimate)';
    else if (daysSinceLastStart > maxCycleDays + 5) currentPhaseLabel = 'Extended Cycle Window';

    const clinicalNote = isIrregular
      ? 'Your cycle length varies by ' + variabilityDays + ' days (' + minCycleDays + '–' + maxCycleDays + ' days). Sakhi360 uses a widened ' + (buffer * 2) + '-day prediction window rather than rigid 28-day assumptions.'
      : 'Your recorded cycles average ' + averageCycleDays + ' days with low variance (' + variabilityDays + ' days).';

    return { averageCycleDays, minCycleDays, maxCycleDays, variabilityDays, isIrregular, predictedWindowStart, predictedWindowEnd, daysSinceLastStart, currentPhaseLabel, clinicalNote };
  }

  function evaluatePcosRisk(input) {
    let score = 0;
    const factors = [];
    if (input.irregularCycles) { score += 30; factors.push('Irregular or prolonged cycles (>35d / <21d / skipped)'); }

    if (input.fatigueLevel === 'mild') score += 6;
    else if (input.fatigueLevel === 'moderate') { score += 12; factors.push('Persistent moderate fatigue'); }
    else if (input.fatigueLevel === 'severe') { score += 18; factors.push('Severe daily fatigue & energy crashes'); }

    if (input.acneSeverity === 'mild') score += 7;
    else if (input.acneSeverity === 'cystic') { score += 16; factors.push('Hormonal / jawline cystic acne'); }

    if (input.hairSigns === 'facial_body_excess') { score += 18; factors.push('Excess facial/body hair (hirsutism indicator)'); }
    else if (input.hairSigns === 'scalp_thinning') { score += 14; factors.push('Scalp hair thinning / widening part'); }
    else if (input.hairSigns === 'both') { score += 22; factors.push('Both hirsutism & scalp thinning'); }

    const m = input.metabolicMarkers;
    if (m.sugarCravingsOrCrash) { score += 5; factors.push('Post-meal fatigue or sugar cravings'); }
    if (m.unexplainedWeightGain) { score += 5; factors.push('Unexplained central weight gain'); }
    if (m.darkSkinPatches) { score += 6; factors.push('Darkened skin patches (neck/underarms — insulin marker)'); }
    if (m.familyHistoryDiabetesOrPcos) { score += 4; factors.push('Family history of PCOS or type 2 diabetes'); }

    const clamped = Math.min(100, score);
    let tier = 'Low';
    let doctorPrompt = 'Your current symptom profile shows low PCOS indicators. Continue logging cycles so any new shifts are spotted early.';
    if (clamped >= 55) {
      tier = 'Elevated';
      doctorPrompt = 'Multiple Rotterdam & metabolic indicators overlap here. Consider booking a gynecologist visit and sharing your cycle log for a hormone panel (LH/FSH, free testosterone, TSH, fasting insulin/HbA1c) and pelvic ultrasound.';
    } else if (clamped >= 28) {
      tier = 'Moderate';
      doctorPrompt = 'A few hormonal or metabolic markers are present. Track symptoms for 2–3 cycles and discuss thyroid, vitamin D/B12, and androgen markers with a doctor if symptoms persist.';
    }
    return {
      score: clamped, tier: tier, contributingFactors: factors, doctorPrompt: doctorPrompt,
      disclaimer: 'Screening aid only — not a medical diagnosis. Only a qualified clinician can diagnose PCOS after clinical labs and imaging.'
    };
  }

  /* Offline replacement for the server's AI doctor-prep endpoint */
  function buildDoctorPrep(result, analysis) {
    const cycleTxt = analysis.minCycleDays + '–' + analysis.maxCycleDays + ' days (' + (analysis.isIrregular ? 'irregular' : 'regular') + ')';
    const tierText = {
      Low: 'Your answers show few PCOS-linked markers right now.',
      Moderate: 'Your answers show a few markers that are worth watching over the next 2–3 cycles.',
      Elevated: 'Your answers show several overlapping markers that are worth discussing with a doctor soon.'
    }[result.tier];
    return {
      summary: tierText + ' Your logged cycle pattern is ' + cycleTxt + '. This is a screening guide, not a diagnosis.',
      doctorQuestions: [
        'Should I get a hormone panel (LH/FSH, free testosterone, TSH, prolactin) and when in my cycle should it be drawn?',
        'Do my symptoms warrant a pelvic ultrasound, and is it reliable at my age?',
        'Should I be checked for insulin resistance (fasting insulin, HbA1c) or for thyroid, vitamin D and B12 deficiency?'
      ],
      lifestyleSteps: [
        'Eat protein and fibre before refined starches, and avoid long gaps between meals.',
        'Walk 10–15 minutes after dinner and add two short strength sessions a week.',
        'Aim for 7–8 hours of consistent sleep and keep logging every cycle.'
      ],
      disclaimer: 'This is educational guidance only and not a medical diagnosis; please see a qualified clinician.'
    };
  }

  function resolvePinMode(enteredPin, config) {
    const clean = String(enteredPin).trim();
    if (!clean) return 'invalid';
    if (clean === config.panicPin) return 'panic_wipe';
    if (clean === config.decoyPin) return 'decoy';
    if (clean === config.realPin) return 'real';
    return 'invalid';
  }

  function evaluateStalkerwareRisk(input) {
    let riskScore = 0;
    const findings = [];
    if (input.unknownDeviceAdmin) { riskScore += 28; findings.push({ title: 'Unrecognized Device Administrator active', severity: 'high', remediation: 'Open Settings -> Security -> Device Admin Apps and revoke unknown entries immediately.' }); }
    if (input.accessibilityServiceAbuse) { riskScore += 25; findings.push({ title: 'Non-accessibility app holds full Screen/Keystroke Accessibility permission', severity: 'high', remediation: 'Disable suspicious Accessibility services and check WhatsApp/Signal linked devices.' }); }
    if (input.hiddenLauncherIcon) { riskScore += 22; findings.push({ title: 'Stealth package with hidden home-screen launcher icon detected', severity: 'high', remediation: 'Inspect Settings -> Apps -> See all apps (show system/disabled) for generic names like "System Update Service".' }); }
    if (input.backgroundMicOrLocationSpike) { riskScore += 15; findings.push({ title: 'Repeated background microphone / GPS wakeups while screen locked', severity: 'medium', remediation: 'Check Privacy Dashboard (24h timeline) and revoke Always-Allow permissions.' }); }
    if (input.sideloadedUnknownApp) { riskScore += 15; findings.push({ title: 'App installed outside official Play Store / App Store', severity: 'medium', remediation: 'Run Play Protect scan and audit APK sources; change primary Google/Apple account password from a safe device.' }); }
    if (input.unrecognizedBatteryDrain) { riskScore += 10; findings.push({ title: 'Unexplained overnight cellular upload / battery drain', severity: 'medium', remediation: 'Review cellular data usage per app and enable Sakhi360 Calculator Stealth mode before changing passwords.' }); }

    const clamped = Math.min(100, riskScore);
    let threatLevel = 'Clean';
    if (clamped >= 45) threatLevel = 'High Stalkerware Risk';
    else if (clamped >= 15) threatLevel = 'Review Suggested';
    return { riskScore: clamped, threatLevel: threatLevel, findings: findings };
  }

  /* Real Web Crypto AES-256-GCM (PBKDF2-derived key) */
  function toBase64(bytes) { let s = ''; for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s); }
  function fromBase64(b64) { const bin = atob(b64); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }

  function requireCrypto() {
    if (!window.crypto || !window.crypto.subtle) throw new Error('Web Crypto is unavailable. Open this page over https:// or http://localhost.');
    return window.crypto;
  }
  async function deriveAesKey(passphrase, salt) {
    const c = requireCrypto();
    const material = await c.subtle.importKey('raw', new TextEncoder().encode(passphrase), { name: 'PBKDF2' }, false, ['deriveKey']);
    return c.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: 60000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  async function encryptVaultText(plaintext, passphrase) {
    const c = requireCrypto();
    const salt = c.getRandomValues(new Uint8Array(16));
    const iv = c.getRandomValues(new Uint8Array(12));
    const key = await deriveAesKey(passphrase, salt);
    const buf = await c.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, new TextEncoder().encode(plaintext));
    return 'AES256GCM.' + toBase64(salt) + '.' + toBase64(iv) + '.' + toBase64(new Uint8Array(buf));
  }
  async function decryptVaultText(payload, passphrase) {
    const c = requireCrypto();
    const parts = payload.split('.');
    if (parts.length !== 4 || parts[0] !== 'AES256GCM') throw new Error('Invalid encrypted payload format');
    const key = await deriveAesKey(passphrase, fromBase64(parts[1]));
    const plain = await c.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(parts[2]) }, key, fromBase64(parts[3]));
    return new TextDecoder().decode(plain);
  }

  function evaluateCalculatorExpression(expr) {
    const sanitized = String(expr).replace(/[^0-9+\-*/.%() ]/g, '').trim();
    if (!sanitized) return '0';
    try {
      const result = new Function('"use strict"; return (' + sanitized + ');')();
      if (typeof result !== 'number' || !isFinite(result)) return 'Error';
      return Number.isInteger(result) ? String(result) : String(Number(result.toFixed(6)));
    } catch (e) {
      return 'Error';
    }
  }

  /* Safe route (Dijkstra over OSM-style graph) */
  function computeSafeRoute(startId, endId, mode, hazardReports) {
    const nodes = OSM_NODES, edges = OSM_EDGES;
    const hazardSet = new Set(hazardReports.map(function (r) { return r.edgeId; }));
    const adj = new Map();
    nodes.forEach(function (n) { adj.set(n.id, []); });
    edges.forEach(function (edge) {
      const hasHazard = hazardSet.has(edge.id);
      let weight = edge.distanceMeters;
      if (mode === 'safest') {
        const lightingPenalty = edge.lit ? 0 : 900;
        const crowdPenalty = (10 - edge.crowdScore) * 65;
        const patrolBonus = edge.policePatrol ? -80 : 0;
        const hazardPenalty = hasHazard ? 1800 : 0;
        weight = Math.max(50, edge.distanceMeters + lightingPenalty + crowdPenalty + patrolBonus + hazardPenalty);
      }
      adj.get(edge.from).push({ to: edge.to, edge: edge, weight: weight });
      adj.get(edge.to).push({ to: edge.from, edge: edge, weight: weight });
    });

    const dist = new Map(), prevNode = new Map(), prevEdge = new Map();
    const unvisited = new Set(nodes.map(function (n) { return n.id; }));
    nodes.forEach(function (n) { dist.set(n.id, Infinity); prevNode.set(n.id, null); prevEdge.set(n.id, null); });
    dist.set(startId, 0);

    while (unvisited.size > 0) {
      let current = null, best = Infinity;
      unvisited.forEach(function (id) { const d = dist.get(id); if (d < best) { best = d; current = id; } });
      if (!current || best === Infinity) break;
      if (current === endId) break;
      unvisited.delete(current);
      adj.get(current).forEach(function (nb) {
        if (!unvisited.has(nb.to)) return;
        const alt = best + nb.weight;
        if (alt < dist.get(nb.to)) { dist.set(nb.to, alt); prevNode.set(nb.to, current); prevEdge.set(nb.to, nb.edge); }
      });
    }

    const nodeIds = [], edgeIds = [], traversed = [];
    let cursor = endId;
    while (cursor) {
      nodeIds.unshift(cursor);
      const e = prevEdge.get(cursor);
      if (e) { edgeIds.unshift(e.id); traversed.unshift(e); }
      cursor = prevNode.get(cursor) || null;
    }

    const totalDistanceMeters = traversed.reduce(function (s, e) { return s + e.distanceMeters; }, 0);
    const estimatedMinutes = Math.max(1, Math.round(totalDistanceMeters / 75));
    const litMeters = traversed.filter(function (e) { return e.lit && !hazardSet.has(e.id); }).reduce(function (s, e) { return s + e.distanceMeters; }, 0);
    const lightingCoveragePercent = totalDistanceMeters > 0 ? Math.round((litMeters / totalDistanceMeters) * 100) : 100;
    const traversedHazards = traversed.filter(function (e) { return !e.lit || hazardSet.has(e.id); }).length;

    let safetyGrade = 'High Safety';
    if (lightingCoveragePercent < 55 || traversedHazards >= 2) safetyGrade = 'High Risk';
    else if (lightingCoveragePercent < 85 || traversedHazards === 1) safetyGrade = 'Moderate Caution';

    return { mode: mode, nodeIds: nodeIds, edgeIds: edgeIds, totalDistanceMeters: totalDistanceMeters, estimatedMinutes: estimatedMinutes, lightingCoveragePercent: lightingCoveragePercent, safetyGrade: safetyGrade };
  }

  /* BLE mesh relay (BFS to nearest gateway) */
  function simulateBleMeshRelay(sourceNodeId, nodes, maxHopRange, maxTtl) {
    const nodeMap = new Map(nodes.map(function (n) { return [n.id, n]; }));
    const source = nodeMap.get(sourceNodeId);
    const packetId = 'BLE-SOS-' + Math.abs(sourceNodeId.charCodeAt(0) * 131 + nodes.length * 37).toString(16).toUpperCase();
    const fail = { reachedGateway: false, gatewayNodeId: null, hops: [], totalLatencyMs: 0, packetId: packetId, encryptedPayloadBytes: 128 };
    if (!source) return fail;

    const queue = [{ id: sourceNodeId, path: [] }];
    const visited = new Set([sourceNodeId]);
    while (queue.length > 0) {
      const current = queue.shift();
      const curr = nodeMap.get(current.id);
      if (curr.hasCellularGateway && current.path.length > 0) {
        return { reachedGateway: true, gatewayNodeId: curr.id, hops: current.path, totalLatencyMs: current.path.length * 140, packetId: packetId, encryptedPayloadBytes: 128 };
      }
      if (current.path.length >= maxTtl) continue;
      const neighbors = nodes
        .filter(function (n) { return !visited.has(n.id) && n.batteryPercent > 10; })
        .map(function (n) { return { node: n, distance: Math.hypot(n.x - curr.x, n.y - curr.y) }; })
        .filter(function (it) { return it.distance <= maxHopRange; })
        .sort(function (a, b) { return a.distance - b.distance; });
      neighbors.forEach(function (it) {
        visited.add(it.node.id);
        const rssiDbm = Math.round(-45 - (it.distance / maxHopRange) * 42);
        queue.push({ id: it.node.id, path: current.path.concat([{ fromId: curr.id, toId: it.node.id, rssiDbm: rssiDbm, hopNumber: current.path.length + 1 }]) });
      });
    }
    return fail;
  }

  function buildFirIncidentPack(p) {
    const evidence = ['Encrypted GPS/Cell Coordinates'];
    if (p.audioCaptured) evidence.push('Ambient Audio Buffer (SHA-256 Sealed)');
    if (p.photoCaptured) evidence.push('Front/Rear Timestamped Frame');
    const referenceId = 'SAKHI-FIR-' + p.timestampIso.replace(/[^0-9]/g, '').slice(0, 12);
    const summaryText = [
      'SAKHI360 SILENT SOS — FIR-READY INCIDENT PACK',
      'Reference ID: ' + referenceId,
      'Timestamp (UTC): ' + p.timestampIso,
      'Location: ' + p.locationLabel + ' (' + p.coordinates + ')',
      'Evidence Attached: ' + evidence.join(', '),
      'Trusted Contacts Dispatched: ' + (p.trustedContacts.join(', ') || 'Local Helpline Fallback (112 / 181)'),
      'Integrity Note: Captured via Sakhi360 Silent SOS mode. Preserve original timestamps for police/Zero-FIR filing.'
    ].join('\n');
    return { referenceId: referenceId, generatedAtIso: p.timestampIso, summaryText: summaryText };
  }

  /* Offline replacements for the server-side AI endpoints */
  function companionReply(text, mood) {
    const t = text.toLowerCase();
    const helplines = 'If you are ever in immediate danger, use the Silent SOS tool here or call 112 (Emergency), 181 (Women’s Helpline) or 14416 (Tele-MANAS).';
    if (/(suicid|kill myself|end it|self[- ]?harm|hurt myself|don.?t want to live)/.test(t)) {
      return 'I’m really glad you told me. You deserve support right now, and you do not have to carry this alone.\n\nPlease reach out to someone you trust, or call 14416 (Tele-MANAS, 24x7) or 112 right away. ' + helplines;
    }
    if (/(unsafe|danger|abus|hit me|following me|stalk|threat|scared of him)/.test(t)) {
      return 'Your safety comes first. Take a slow breath; you are not overreacting.\n\nIf you can, move to a place with people, and use Silent SOS in the Safety pillar to send your location quietly. ' + helplines;
    }
    if (/(overwhelm|too much|can.?t cope|stressed|stress)/.test(t)) {
      return 'That sounds like a lot to hold at once, and it makes sense to feel stretched.\n\nTry this for two minutes: breathe in for 4, hold for 7, out for 8. Then name one thing you can see, one you can touch and one you can hear. We can take it one small step at a time.';
    }
    if (/(calm|panic|anxi|nervous|breath)/.test(t)) {
      return 'Let’s slow things down together. Breathe in for 4 counts, hold for 7, and breathe out for 8, and repeat three times.\n\nThen try the 5-4-3-2-1 grounding checklist in Coping Exercises: it gently pulls attention back to the room around you.';
    }
    if (/(boundar|say no|pressure|guilty)/.test(t)) {
      return 'Setting a boundary is a form of self-respect. A calm, short script helps: “I’m not comfortable with that, so I’m going to say no.”\n\nYou don’t owe a long explanation. Practise it once out loud, and choose one person you trust to back you up.';
    }
    if (/(sad|low|cry|lonely|alone|hopeless|empty)/.test(t)) {
      return 'I’m sorry it feels heavy right now. Your feelings are valid, and you don’t have to fix them today.\n\nWould writing a few lines in your encrypted journal help? Sometimes naming it makes it a little lighter. Reaching out to someone you trust can help too.';
    }
    if (/(period|cycle|pcos|cramp|acne)/.test(t)) {
      return 'Cycle and hormone changes can really affect mood and energy. The Body pillar can track your cycles, and SakhiPedia explains PCOS in plain language.\n\nIf symptoms are persistent, a gynecologist can check them properly. I can only offer general support, not a diagnosis.';
    }
    return 'Thank you for sharing that with me. I’m here, and this space is private and judgment-free.' + (mood ? ' I see your mood check-in says “' + mood + '”.' : '') + '\n\nWould you like to try a short calming exercise, write it in your journal, or just keep talking?';
  }

  function journalReflection(text, mood) {
    const snippet = text.length > 80 ? text.slice(0, 80).trim() + '…' : text;
    return 'It sounds like you are feeling ' + String(mood).toLowerCase() + ', and it took care to put “' + snippet + '” into words. Your willingness to check in with yourself shows real strength.\n\nTiny 2-minute step: place a hand on your chest, breathe out slowly for a count of six, and name one thing that went even slightly right today.';
  }

  function takedownTemplate(platform, incidentType, ref, ctx) {
    return 'URGENT NCII / DEEPFAKE TAKEDOWN NOTICE — IT RULES 2021 (24-HOUR COMPLIANCE)\n\n' +
      'To: Grievance Officer, ' + platform + '\n' +
      'Subject: Immediate Removal of Non-Consensual Morphed / Deepfake Content\n' +
      'Reference URL / Account: ' + (ref || '[Insert URL / Handle]') + '\n\n' +
      'Dear Grievance Officer,\n' +
      'I am formally reporting ' + incidentType + ' hosted on ' + platform + '. Under Rule 3(2)(b) of India\'s Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and Sections 66E / 67 / 67A of the IT Act, intermediaries are legally obligated to disable access to non-consensual intimate or morphed imagery within 24 hours of receipt.\n\n' +
      'Details: ' + (ctx || 'Synthetic/morphed image published without consent.') + '\n\n' +
      'Please confirm removal and preserve server logs for Cyber Crime Portal complaint (1930 / cybercrime.gov.in).';
  }

  /* Wiki "Ask" — answers from the article's own text (no server needed) */
  function wikiAnswer(article, question) {
    const words = question.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 3; });
    let best = null, bestScore = 0;
    article.sections.forEach(function (sec) {
      const blocks = sec.paragraphs.concat(sec.bullets || []);
      blocks.forEach(function (b) {
        const lower = (sec.heading + ' ' + b).toLowerCase();
        let score = 0;
        words.forEach(function (w) { if (lower.indexOf(w) !== -1) score++; });
        if (score > bestScore) { bestScore = score; best = { heading: sec.heading, text: b }; }
      });
    });
    if (!best) {
      return 'I could not find that in “' + article.title + '”. Try rephrasing with a keyword from the article, or search another SakhiPedia article.\n\nThis is educational information only, not a medical diagnosis.';
    }
    return 'From “' + article.title + '” — ' + best.heading + ':\n' + best.text + '\n\nThis is educational information only, not a medical diagnosis. Please check with a qualified clinician for personal advice.';
  }

  /* ---------- tiny helpers ---------- */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
  function todayIso() { return new Date().toISOString().slice(0, 10); }
  function readJson(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }
  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage may be blocked */ }
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* Lucide-style inline SVG icons */
  const ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    steth: '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/>',
    check: '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    wind: '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
    checksq: '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    news: '<path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"/><rect x="10" y="6" width="8" height="4" rx="1"/>',
    download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    radio: '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>',
    nav: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
    copy: '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    file: '<path d="M12 6a8 8 0 0 0-8 8v4h16v-4a8 8 0 0 0-8-8z"/><path d="M12 2v4"/>',
    phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    link: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    backspace: '<path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"/><line x1="18" x2="12" y1="9" y2="15"/><line x1="12" x2="18" y1="9" y2="15"/>',
    smartphone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    shieldcheck: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    filewarn: '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    openbook: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'
  };
  function ic(name, cls) {
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  /* ---------------------------------------------------------
     3) STATE
     --------------------------------------------------------- */
  const S = {
    surface: 'real',            // real | stealth | decoy
    wiped: false,
    active: 'overview',
    wikiActive: 'pcos',

    cycles: readJson(STORAGE_KEYS.cycles, clone(SEED_CYCLE_LOGS)),
    journals: readJson(STORAGE_KEYS.journals, []),
    hazards: readJson(STORAGE_KEYS.hazards, clone(SEED_HAZARD_REPORTS)),
    contacts: readJson(STORAGE_KEYS.contacts, ['Maa (+91-98XXXXXX10)', 'Ananya Hostel Friend (+91-97XXXXXX45)']),
    pins: readJson(STORAGE_KEYS.pins, clone(DEFAULT_PIN_CONFIG)),
    lessons: readJson(STORAGE_KEYS.lessons, []),
    selfCheck: readJson(STORAGE_KEYS.selfCheck, null),

    // Body
    bodyTab: 'cycle',
    selSymptoms: ['Fatigue'],
    cycleErr: '',
    pcosInput: null,
    pcosResult: null,
    pcosAdvice: null,
    trimester: 0,
    checkedSteps: [],

    // Mind
    mood: 'Calm',
    unlocked: {},
    showCipher: null,
    reflection: '',
    journalErr: '',
    encrypting: false,
    breathing: false,
    breathSec: 0,
    breathTimer: null,
    grounding: [],
    chatBusy: false,
    chat: [{ role: 'assistant', text: 'Hi, I am Sakhi. This space is judgment-free and private. How are you feeling today, or would you like to try a quick calming exercise together?' }],

    // Safety
    safetyTab: 'sos',
    includeAudio: true,
    includePhoto: true,
    armed: false,
    fir: null,
    cancelMsg: '',
    routeStart: 'metro',
    routeEnd: 'hostel',
    routeMode: 'safest',
    repEdge: 'e9',
    repType: 'unlit_street',
    meshOffline: true,
    meshResult: null,
    live: { status: 'idle', deviceName: '', coords: null, sent: 0, lastSend: 0, packetId: '', log: [], watchId: null, device: null, char: null, sending: false },

    // Digital
    td: { platform: 'Instagram / Meta', type: 'Non-consensual morphed / deepfake image' },
    takedown: '',
    copied: false,
    signals: { unknownDeviceAdmin: false, accessibilityServiceAbuse: false, hiddenLauncherIcon: false, backgroundMicOrLocationSpike: true, unrecognizedBatteryDrain: false, sideloadedUnknownApp: false },
    scan: null,
    pinMsg: '',
    confirmWipe: false,

    // Growth
    weekly: 250,
    weeks: 24,
    newsCat: 'All',

    // Wiki
    wikiSearch: '',
    wikiCat: 'All',
    wikiAnswer: '',

    // Calculator + decoy
    calc: { display: '0', raw: '', hist: '' },
    decoyNotes: clone(DECOY_STUDY_NOTES)
  };

  function save(name) {
    const map = { cycles: 'cycles', journals: 'journals', hazards: 'hazards', contacts: 'contacts', pins: 'pins', lessons: 'lessons', selfCheck: 'selfCheck' };
    writeJson(STORAGE_KEYS[map[name]], S[name]);
  }

  function cycleAnalysis() { return analyzeCycles(S.cycles, todayIso()); }

  /* ---------------------------------------------------------
     4) VIEWS (each returns an HTML string)
     --------------------------------------------------------- */
  function pageHead(title, desc, extra) {
    return '<div class="page-head"><div><h1 class="page-title">' + title + '</h1><p class="muted">' + desc + '</p></div>' + (extra || '') + '</div>';
  }
  function tabBtn(group, id, label, active, onCls) {
    return '<button type="button" role="tab" aria-selected="' + (active === id) + '" class="tab ' + (active === id ? onCls : '') + '" data-action="' + group + '" data-arg="' + id + '">' + label + '</button>';
  }

  /* ---------- Overview ---------- */
  function viewOverview() {
    const a = cycleAnalysis();
    const pathways = [
      { id: 'body', title: 'Body · Reproductive & PCOS Screening', sub: 'Irregular-cycle tracker, early PCOS detector, pregnancy & breast self-check guide.', metric: S.cycles.length + ' cycles · ' + (a.isIrregular ? 'Irregular window' : 'Steady'), icon: 'heart', color: 'var(--teal)' },
      { id: 'mind', title: 'Mind · Encrypted Therapy Journal & AI', sub: 'AES-256-GCM encrypted private journal, mood tracker, AI companion & coping exercises.', metric: S.journals.length + ' encrypted entries', icon: 'brain', color: 'var(--navy-2)' },
      { id: 'safety', title: 'Safety · Emergency SOS & OSM Safe Route', sub: 'Silent SOS with Zero-FIR pack, OSM lit route planner & offline BLE Mesh relay.', metric: S.hazards.length + ' route alerts · ' + S.contacts.length + ' contacts', icon: 'shield', color: 'var(--red)' },
      { id: 'defense', title: 'Digital · Privacy & Stalkerware Defense', sub: 'Deepfake takedown assistant, stalkerware permission audit, dual PIN & stealth lock.', metric: 'AES-256-GCM Active', icon: 'lock', color: 'var(--navy-2)' },
      { id: 'growth', title: 'Growth · Savings, Skills & Safe Briefing', sub: 'Bank-free savings planner, career & legal literacy modules, algorithm-free news.', metric: S.lessons.length + ' lessons completed', icon: 'sprout', color: 'var(--green)' }
    ];
    const range = a.minCycleDays === a.maxCycleDays ? a.averageCycleDays + ' days' : a.minCycleDays + '–' + a.maxCycleDays + ' days';

    return '<div class="view">' +
      '<section class="card card-lg hero"><div class="stack-xs" style="max-width:672px">' +
        '<div class="eyebrow">' + ic('activity', 'i4') + '<span>Sakhi360 Clinical &amp; Safety Companion · Device-First Private Vault</span></div>' +
        '<h1>Women’s Health, Mental Care, Safety &amp; Digital Defense Chart</h1>' +
        '<p class="muted">All cycle logs, PCOS screenings, encrypted reflections, and emergency incident packs remain stored privately on your device—concealable behind a working calculator.</p>' +
      '</div><div class="hero-actions">' +
        '<button type="button" class="btn teal-bg" data-nav="body">Open PCOS Screener ' + ic('arrow', 'i4') + '</button>' +
        '<button type="button" class="btn outline" data-wiki="pcos">' + ic('openbook', 'i4 teal') + ' PCOS Encyclopedia</button>' +
        '<button type="button" class="btn outline" data-nav="safety">Silent SOS &amp; Route</button>' +
      '</div></section>' +

      '<section class="grid g4 c2-sm c4-lg" aria-label="Clinical Summary Strip">' +
        '<div class="tile vital"><div class="k">Cycle Window Prediction</div><div class="v">' + range + '</div><div class="s t">Next: ' + a.predictedWindowStart + ' → ' + a.predictedWindowEnd + '</div></div>' +
        '<div class="tile vital"><div class="k">Encrypted Mind Vault</div><div class="v">' + S.journals.length + ' entries</div><div class="s">AES-256-GCM local encryption</div></div>' +
        '<div class="tile vital"><div class="k">Mobility &amp; SOS Readiness</div><div class="v">' + S.contacts.length + ' contacts</div><div class="s">' + S.hazards.length + ' active OSM route hazard alerts</div></div>' +
        '<div class="tile vital"><div class="k">Self-Check &amp; Empowerment</div><div class="v">' + S.lessons.length + ' lessons</div><div class="s">' + (S.selfCheck ? 'Breast check: ' + esc(S.selfCheck) : 'Monthly breast check pending') + '</div></div>' +
      '</section>' +

      '<section class="grid s7-5">' +
        '<div class="card flush"><div class="card-head"><h2 class="sec-title sm">Active Care &amp; Safety Modules (5 Pillars)</h2><span class="xs dim">Zero ads · Zero data brokers</span></div><div class="divide">' +
        pathways.map(function (p) {
          return '<button type="button" class="pathway" data-nav="' + p.id + '"><div class="row gap-m" style="align-items:flex-start;min-width:0"><span class="ic" style="color:' + p.color + '">' + ic(p.icon) + '</span><div style="min-width:0"><div class="t">' + p.title + '</div><p class="d">' + p.sub + '</p><div class="m">' + p.metric + '</div></div></div>' + ic('chevron', 'i4 dim') + '</button>';
        }).join('') +
        '</div></div>' +
        '<div class="card"><div class="row between" style="align-items:baseline"><h2 class="sec-title sm">5-Step Clinical &amp; Safety Protocol</h2><span class="xs dim">End-to-End Flow</span></div><div class="divide">' +
        METHODOLOGY_STEPS.map(function (m) {
          return '<div class="step"><span class="n">' + m.step + '</span><div><h3>' + m.title + '</h3><p>' + m.detail + '</p></div></div>';
        }).join('') +
        '</div></div>' +
      '</section>' +

      '<section class="grid s5-7">' +
        '<div class="card"><h2 class="sec-title sm">Public Health &amp; Safety Evidence</h2><div class="divide-200">' +
        RESEARCH_IMPACT_STATS.map(function (s) {
          return '<div class="stat"><div class="big">' + s.metric + '</div><p>' + s.label + '</p><p class="src">' + s.source + '</p></div>';
        }).join('') + '</div></div>' +
        '<div class="card"><h2 class="sec-title sm">Clinical &amp; Safety Risk Safeguards</h2><div class="table-wrap"><table><thead><tr><th>Challenge / Risk</th><th>Built-in Safeguard</th></tr></thead><tbody>' +
        FEASIBILITY_MITIGATIONS.map(function (r) { return '<tr><td class="strong">' + r.risk + '</td><td style="color:var(--slate-600)">' + r.strategy + '</td></tr>'; }).join('') +
        '</tbody></table></div></div>' +
      '</section>' +

      '<footer class="card"><div class="row" style="font-size:14px;font-weight:700;color:var(--navy)">' + ic('book', 'i4') + '<h2 style="font-size:14px">Clinical References &amp; Project Credits</h2></div>' +
        '<ol class="ol-refs two">' + RESEARCH_REFERENCES.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ol>' +
        '<div class="row between wrap xs dim sep-t200" style="gap:8px"><span>Sakhi360 · Team Pragati (Soumya Srivastava, Ansh Goel, Shirsh Gupta, Ankit Chaudhary)</span><span>Galgotias University · IEEE WIE Empowerment Initiative</span></div>' +
      '</footer>' +
    '</div>';
  }

  /* ---------- Body ---------- */
  function cycleChartHtml() {
    if (S.cycles.length < 2) return '';
    const sorted = S.cycles.slice().sort(function (a, b) { return a.startDate.localeCompare(b.startDate); });
    const intervals = sorted.slice(1).map(function (c, idx) {
      return { label: c.startDate.slice(5), days: daysBetween(sorted[idx].startDate, c.startDate) };
    });
    let g = '';
    const yOf = function (d) { const cl = Math.max(15, Math.min(50, d)); return 100 - ((cl - 15) / 35) * 80; };
    const xOf = function (i) { return intervals.length === 1 ? 230 : 75 + (i * 320) / (intervals.length - 1); };
    intervals.forEach(function (pt, i) {
      const x = xOf(i), y = yOf(pt.days);
      const inRange = pt.days >= 21 && pt.days <= 35;
      if (i > 0) g += '<line x1="' + xOf(i - 1) + '" y1="' + yOf(intervals[i - 1].days) + '" x2="' + x + '" y2="' + y + '" stroke="#FFFFFF" stroke-width="2"/>';
      g += '<circle cx="' + x + '" cy="' + y + '" r="5" fill="' + (inRange ? '#FF4D94' : '#D97706') + '" stroke="#FFFFFF" stroke-width="1.5"/>' +
        '<text x="' + x + '" y="' + (y - 9) + '" text-anchor="middle" font-size="10" font-weight="600" fill="#FFFFFF" font-family="monospace">' + pt.days + 'd</text>' +
        '<text x="' + x + '" y="114" text-anchor="middle" font-size="9" fill="#C4B5F0" font-family="monospace">' + pt.label + '</text>';
    });
    return '<div class="sep-t stack-xs" style="padding-top:16px"><div class="row between xs"><b class="navy">Cycle Length Variability Chart (Days)</b><span class="dim">Shaded zone = 21–35d clinical reference</span></div>' +
      '<svg viewBox="0 0 460 120" class="chart-svg" role="img" aria-label="Cycle interval trend chart">' +
      '<rect x="40" y="45" width="395" height="38" fill="#FF4D94" fill-opacity="0.10"/>' +
      '<line x1="40" y1="45" x2="435" y2="45" stroke="#FF4D94" stroke-dasharray="3 3" stroke-opacity="0.45"/>' +
      '<line x1="40" y1="83" x2="435" y2="83" stroke="#FF4D94" stroke-dasharray="3 3" stroke-opacity="0.45"/>' +
      '<text x="8" y="49" font-size="9" fill="#FF9AC8" font-family="monospace">35d</text><text x="8" y="86" font-size="9" fill="#FF9AC8" font-family="monospace">21d</text>' +
      g + '</svg></div>';
  }

  function bodyCycleTab() {
    const a = cycleAnalysis();
    const symptoms = ['Cramps', 'Fatigue', 'Jawline acne', 'Bloating', 'Headache', 'Mood shift'];
    const hist = S.cycles.slice().sort(function (x, y) { return y.startDate.localeCompare(x.startDate); });
    return '<div class="grid" style="grid-template-columns:1fr"><div class="grid s5-7">' +
      '<div class="card"><div class="row">' + ic('calendar', 'i5 teal') + '<h2 class="sec-title">Log Period &amp; Symptoms</h2></div>' +
      '<form data-form="cycle" class="stack-s" novalidate>' +
        '<div><label class="lbl" for="cycle-start-date">Start Date</label><input id="cycle-start-date" type="date" class="field tnum" value="' + todayIso() + '"></div>' +
        '<div class="grid c2-sm g3" style="grid-template-columns:1fr 1fr"><div><label class="lbl" for="cycle-duration">Duration (Days)</label><input id="cycle-duration" type="number" min="1" max="14" value="5" class="field tnum"></div>' +
        '<div><label class="lbl" for="cycle-flow">Flow Intensity</label><select id="cycle-flow" class="field"><option value="spotting">Spotting</option><option value="light">Light</option><option value="moderate" selected>Moderate</option><option value="heavy">Heavy</option></select></div></div>' +
        '<div><span class="lbl">Symptoms</span><div class="row wrap gap-s" style="gap:8px">' +
        symptoms.map(function (s) { const on = S.selSymptoms.indexOf(s) !== -1; return '<button type="button" class="chip ' + (on ? 'teal-on' : '') + '" aria-pressed="' + on + '" data-action="toggleSymptom" data-arg="' + esc(s) + '">' + s + '</button>'; }).join('') +
        '</div></div>' +
        '<div><label class="lbl" for="cycle-notes">Private Note (optional)</label><input id="cycle-notes" type="text" class="field" placeholder="Stress, sleep shifts, or medication..."></div>' +
        (S.cycleErr ? '<p class="msg-err">' + S.cycleErr + '</p>' : '') +
        '<button type="submit" class="btn teal-bg block">Save Cycle Log Locally</button>' +
      '</form></div>' +

      '<div class="stack">' +
        '<div class="card"><div class="row between wrap"><h2 class="sec-title">Adaptive Cycle Insights</h2><span class="xs" style="font-weight:500;color:var(--slate-600)">' + (a.isIrregular ? 'Irregular-Friendly Window Active' : 'Steady Rhythm Pattern') + '</span></div>' +
          '<div class="grid g4 c2-sm c4-sm" style="grid-template-columns:repeat(2,1fr)">' +
            '<div class="mini"><div class="k">Average Length</div><div class="v">' + a.averageCycleDays + ' days</div></div>' +
            '<div class="mini"><div class="k">Variability Range</div><div class="v">' + a.minCycleDays + '–' + a.maxCycleDays + 'd</div></div>' +
            '<div class="mini"><div class="k">Current Phase</div><div class="teal" style="font-size:14px;font-weight:700;margin-top:4px">' + a.currentPhaseLabel + '</div></div>' +
            '<div class="mini"><div class="k">Next Window</div><div class="mono navy" style="font-size:12px;font-weight:600;margin-top:4px">' + a.predictedWindowStart + ' → ' + a.predictedWindowEnd + '</div></div>' +
          '</div>' +
          '<p class="muted sep-t" style="line-height:1.6">' + a.clinicalNote + '</p>' + cycleChartHtml() + '</div>' +

        '<div class="card"><h3 class="sub-title">Recorded Cycle History</h3><div class="table-wrap"><table><thead><tr><th>Start Date</th><th>Duration</th><th>Flow</th><th>Symptoms &amp; Notes</th></tr></thead><tbody>' +
        (hist.length ? hist.map(function (c) {
          return '<tr><td class="mono nw navy xs">' + esc(c.startDate) + '</td><td class="nw tnum">' + c.durationDays + ' days</td><td class="nw" style="text-transform:capitalize">' + esc(c.flowIntensity) + '</td><td class="xs" style="color:var(--slate-600)">' + (esc(c.symptoms.concat(c.notes ? [c.notes] : []).join(' · ')) || 'No symptoms noted') + '</td></tr>';
        }).join('') : '<tr><td colspan="4" class="xs dim">No cycles recorded yet.</td></tr>') +
        '</tbody></table></div></div>' +
      '</div></div></div>';
  }

  function pcosResultHtml() {
    const r = S.pcosResult;
    if (!r) {
      return '<div class="card center">' + ic('steth', 'i8 dim') + '<h3 class="sub-title">Ready for Screening</h3><p class="muted" style="max-width:448px">Select any cycle, skin, hair, fatigue, or metabolic markers on the left and run the screening to generate a private doctor-ready summary.</p></div>';
    }
    const icon = r.tier === 'Elevated' ? ic('alert', 'i5 red') : r.tier === 'Moderate' ? ic('alert', 'i5 amber') : ic('check', 'i5 green');
    const adv = S.pcosAdvice;
    return '<div class="card">' +
      '<div class="row between sep-b"><div><span class="xs dim">Screening Indicator Tier</span><div class="tier-line">' + icon + '<span>' + r.tier + ' Indicator Profile</span></div></div><div style="text-align:right"><span class="xs dim">Index</span><div class="score-big">' + r.score + '/100</div></div></div>' +
      (r.contributingFactors.length ? '<div class="stack-xs"><h3 class="upper">Observed Screening Markers</h3><ul class="bullets">' + r.contributingFactors.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div class="well" style="padding:16px"><h3 style="font-size:14px;font-weight:700;color:var(--navy)">Doctor Prompt &amp; Next Steps</h3><p style="font-size:14px;color:var(--slate-700);line-height:1.6">' + r.doctorPrompt + '</p><p class="xs dim" style="padding-top:4px">' + r.disclaimer + '</p></div>' +
      '<div class="stack-s"><button type="button" class="btn navy-bg" style="align-self:flex-start" data-action="doctorPrep">' + ic('sparkles', 'i4') + ' Generate Doctor-Visit Prep</button>' +
      (adv ? '<div class="well" style="background:#fff"><p style="font-size:14px;color:var(--slate-700);line-height:1.6">' + esc(adv.summary) + '</p>' +
        '<div><h4 class="xs navy" style="margin-bottom:4px">Questions to Ask Your Doctor</h4><ul class="bullets xs-b">' + adv.doctorQuestions.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul></div>' +
        '<div><h4 class="xs navy" style="margin-bottom:4px">Supportive Daily Habits</h4><ul class="bullets xs-b">' + adv.lifestyleSteps.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul></div>' +
        '<p class="xxs dim">' + esc(adv.disclaimer) + '</p></div>' : '') +
      '</div></div>';
  }

  function bodyPcosTab() {
    const a = cycleAnalysis();
    if (!S.pcosInput) {
      S.pcosInput = { irregularCycles: a.isIrregular, fatigueLevel: 'moderate', acneSeverity: 'mild', hairSigns: 'none',
        metabolicMarkers: { sugarCravingsOrCrash: true, unexplainedWeightGain: false, darkSkinPatches: false, familyHistoryDiabetesOrPcos: false } };
    }
    const p = S.pcosInput;
    const opt = function (val, label, cur) { return '<option value="' + val + '"' + (cur === val ? ' selected' : '') + '>' + label + '</option>'; };
    const markers = [
      { key: 'sugarCravingsOrCrash', label: 'Post-meal energy crash / sugar cravings' },
      { key: 'unexplainedWeightGain', label: 'Unexplained central weight gain' },
      { key: 'darkSkinPatches', label: 'Darkened neck/underarm skin patches' },
      { key: 'familyHistoryDiabetesOrPcos', label: 'Family history of PCOS or diabetes' }
    ];
    return '<div class="grid s6-6">' +
      '<div class="card"><div class="row between wrap"><div class="row">' + ic('activity', 'i5 teal') + '<h2 class="sec-title">Early PCOS Symptom Screener</h2></div>' +
        '<button type="button" class="link-btn" data-wiki="pcos">' + ic('openbook', 'i35') + ' Read PCOS Wiki Guide</button></div>' +
      '<p class="xs" style="color:var(--slate-600)">Evaluates cycle irregularity, fatigue, hormonal acne, hair indicators, and metabolic markers. Screening aid only—never a clinical diagnosis.</p>' +
      '<div class="stack-s">' +
        '<label class="checkbox-card"><input type="checkbox" data-pcos="irregularCycles"' + (p.irregularCycles ? ' checked' : '') + '><div><span class="title">Irregular, delayed (&gt;35d), or skipped periods</span><span class="desc">Auto-detected from your logs: ' + (a.isIrregular ? 'Yes (irregular variance observed)' : 'Not detected in logs') + '</span></div></label>' +
        '<div class="grid c3-sm g3" style="grid-template-columns:1fr">' +
          '<div><label class="lbl" for="pcos-fatigue">Fatigue Level</label><select id="pcos-fatigue" class="field" data-pcos="fatigueLevel">' + opt('none', 'None', p.fatigueLevel) + opt('mild', 'Mild', p.fatigueLevel) + opt('moderate', 'Moderate', p.fatigueLevel) + opt('severe', 'Severe', p.fatigueLevel) + '</select></div>' +
          '<div><label class="lbl" for="pcos-acne">Acne Pattern</label><select id="pcos-acne" class="field" data-pcos="acneSeverity">' + opt('none', 'None', p.acneSeverity) + opt('mild', 'Mild breakouts', p.acneSeverity) + opt('cystic', 'Jawline / Cystic acne', p.acneSeverity) + '</select></div>' +
          '<div><label class="lbl" for="pcos-hair">Hair Markers</label><select id="pcos-hair" class="field" data-pcos="hairSigns">' + opt('none', 'None', p.hairSigns) + opt('facial_body_excess', 'Excess facial/body hair', p.hairSigns) + opt('scalp_thinning', 'Scalp thinning', p.hairSigns) + opt('both', 'Both', p.hairSigns) + '</select></div>' +
        '</div>' +
        '<div class="stack-xs"><span class="lbl" style="margin:0">Metabolic Markers</span><div class="grid c2-sm tight">' +
        markers.map(function (m) { return '<label class="checkbox-card compact"><input type="checkbox" data-pcos-m="' + m.key + '"' + (p.metabolicMarkers[m.key] ? ' checked' : '') + '>' + m.label + '</label>'; }).join('') +
        '</div></div>' +
        '<button type="button" class="btn teal-bg block" data-action="runPcos">Run PCOS Screening</button>' +
      '</div></div>' +
      '<div id="pcos-result" class="stack-s">' + pcosResultHtml() + '</div></div>';
  }

  function bodyPregnancyTab() {
    const t = PREGNANCY_TRIMESTER_GUIDE[S.trimester];
    return '<div class="grid s6-6">' +
      '<div class="card"><h2 class="sec-title">Pregnancy Trimester Insights &amp; Red Flags</h2>' +
      '<div class="row" style="gap:8px">' + PREGNANCY_TRIMESTER_GUIDE.map(function (_, i) { return '<button type="button" class="chip semi ' + (S.trimester === i ? 'navy-on' : '') + '" data-action="trimester" data-arg="' + i + '">Trimester ' + (i + 1) + '</button>'; }).join('') + '</div>' +
      '<div class="well" style="padding:16px;gap:12px"><h3 class="sub-title">' + t.trimester + '</h3>' +
        '<div><span class="xs dim" style="font-weight:600">Routine Care Focus</span><p style="font-size:14px;color:var(--slate-700);margin-top:2px;line-height:1.6">' + t.focus + '</p></div>' +
        '<div class="sep-t200" style="border-top:1px solid var(--slate-200);padding-top:12px"><span class="xs red" style="font-weight:600">When to Seek Urgent Care</span><p style="font-size:14px;color:var(--slate-700);margin-top:2px;line-height:1.6">' + t.redFlags + '</p></div></div></div>' +

      '<div class="card"><div class="row between wrap"><h2 class="sec-title">5-Step Breast Self-Check Guide</h2><span id="selfcheck-date" class="xs dim tnum">' + (S.selfCheck ? 'Last completed: ' + esc(S.selfCheck) : 'Not logged this month') + '</span></div>' +
      '<p class="xs" style="color:var(--slate-600)">Best performed monthly 3–5 days after your period ends. Check off each step as you complete it.</p>' +
      '<div class="well row" style="flex-direction:row;gap:16px;padding:14px"><svg viewBox="0 0 100 100" style="width:80px;height:80px;flex:none" role="img" aria-label="Breast palpation quadrants diagram"><circle cx="50" cy="50" r="38" fill="#FFFFFF" stroke="#FF4D94" stroke-width="2"/><line x1="50" y1="12" x2="50" y2="88" stroke="#CBD5E1" stroke-dasharray="3 2"/><line x1="12" y1="50" x2="88" y2="50" stroke="#CBD5E1" stroke-dasharray="3 2"/><circle cx="50" cy="50" r="7" fill="#FF4D94" fill-opacity="0.2" stroke="#FF4D94" stroke-width="1.5"/><path d="M 50 18 L 50 82 M 34 22 L 34 78 M 66 22 L 66 78" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>' +
        '<div class="xs" style="color:var(--slate-600)"><div class="navy" style="font-weight:700;margin-bottom:4px">Vertical Strip &amp; Quadrant Sweep</div><p>Cover all four quadrants plus the underarm tail using light, medium, and firm finger-pad pressure.</p></div></div>' +
      '<div class="stack-xs" style="gap:10px">' + BREAST_SELF_CHECK_STEPS.map(function (it) {
        const done = S.checkedSteps.indexOf(it.step) !== -1;
        return '<label class="step-check ' + (done ? 'done' : '') + '"><input type="checkbox" class="check-green" data-bstep="' + it.step + '"' + (done ? ' checked' : '') + '><div class="body"><div class="top"><b>0' + it.step + '. ' + it.title + '</b><span class="mono xs dim">' + it.duration + '</span></div><p>' + it.detail + '</p></div></label>';
      }).join('') + '</div>' +
      '<button type="button" id="selfcheck-btn" class="btn navy-bg block" data-action="markSelfCheck">Mark Monthly Self-Check Completed (' + S.checkedSteps.length + '/5 Steps)</button></div></div>';
  }

  function viewBody() {
    const tabs = '<div class="tabs" role="tablist" aria-label="Body pillar tools">' +
      tabBtn('bodyTab', 'cycle', 'Cycle Tracker', S.bodyTab, 'on-navy') +
      tabBtn('bodyTab', 'pcos', 'Early PCOS Detector', S.bodyTab, 'on-teal') +
      tabBtn('bodyTab', 'pregnancy', 'Pregnancy &amp; Breast Check', S.bodyTab, 'on-navy') + '</div>';
    const body = S.bodyTab === 'cycle' ? bodyCycleTab() : S.bodyTab === 'pcos' ? bodyPcosTab() : bodyPregnancyTab();
    return '<div class="view">' + pageHead('Body · Health, Cycle &amp; PCOS Care', 'Irregular-cycle friendly predictions, early PCOS symptom screening, pregnancy &amp; self-check guides.', tabs) + body + '</div>';
  }

  /* ---------- Mind ---------- */
  const MOODS = ['Calm', 'Hopeful', 'Tired', 'Anxious', 'Overwhelmed', 'Strong'];
  const GROUNDING_STEPS = [
    '5 things you can see around you right now',
    '4 things you can physically touch (fabric, desk, floor)',
    '3 distinct sounds you can hear',
    '2 scents you notice or recall',
    '1 slow steady breath and one kind thing you did today'
  ];

  function breathPhaseText() {
    const s = S.breathSec;
    return s < 4 ? 'Inhale gently (' + (4 - s) + 's)' : s < 11 ? 'Hold softly (' + (11 - s) + 's)' : 'Exhale slowly (' + (19 - s) + 's)';
  }
  function breathRegionHtml() {
    if (!S.breathing) return '';
    return '<div class="well row between" style="flex-direction:row;padding:16px"><span style="font-size:14px;font-weight:700;color:var(--navy)">' + breathPhaseText() + '</span><span class="mono xs dim">Cycle sec ' + (S.breathSec + 1) + '/19</span></div>';
  }
  function vaultListHtml() {
    if (!S.journals.length) return '<p class="xs dim" style="padding:16px 0">No encrypted entries yet. Save a note above to verify AES-256-GCM storage.</p>';
    return '<div class="vault-list">' + S.journals.map(function (rec) {
      const plain = S.unlocked[rec.id];
      const cipher = S.showCipher === rec.id;
      return '<div class="vault-entry"><div class="row between wrap xs dim" style="gap:8px"><span class="navy" style="font-weight:600">' + esc(rec.mood) + ' · <span class="mono" style="font-weight:400">' + esc(rec.createdAtIso.slice(0, 10)) + '</span></span>' +
        '<div class="row" style="gap:8px"><button type="button" class="link-btn plain" data-action="inspectCipher" data-arg="' + esc(rec.id) + '">' + ic('eye', 'i35') + (cipher ? 'Hide Cipher' : 'Inspect AES') + '</button>' +
        '<button type="button" class="link-btn" data-action="toggleDecrypt" data-arg="' + esc(rec.id) + '">' + ic(plain ? 'lock' : 'unlock', 'i35') + (plain ? 'Lock' : 'Decrypt') + '</button></div></div>' +
        (cipher ? '<p class="cipher">' + esc(rec.cipherText) + '</p>' : plain ? '<p style="font-size:14px;color:var(--slate-800);line-height:1.6;white-space:pre-wrap">' + esc(plain) + '</p>' : '<p class="mono xs dim">[Locked AES-256-GCM Ciphertext — click Decrypt to view]</p>') + '</div>';
    }).join('') + '</div>';
  }
  function chatLogHtml() {
    return S.chat.map(function (m) { return '<div class="msg ' + m.role + '"><div class="bubble">' + esc(m.text) + '</div></div>'; }).join('') +
      (S.chatBusy ? '<div class="xs dim">Sakhi is writing thoughtfully...</div>' : '');
  }

  function viewMind() {
    return '<div class="view">' + pageHead('Mind · Encrypted Journal &amp; AI Companion', 'AES-256-GCM encrypted personal journal, mood tracker, guided coping exercises, and judgment-free support.') +
    '<div class="grid s6-6 stretch">' +
      '<div class="card"><div class="row between"><div class="row">' + ic('lock', 'i5 navy') + '<h2 class="sec-title">Private Encrypted Journal</h2></div><span class="xs mono dim">AES-256-GCM</span></div>' +
      '<form data-form="journal" class="stack-s">' +
        '<div><span class="lbl" style="margin-bottom:6px">Current Mood Check-in</span><div id="mood-row" class="row wrap" style="gap:8px">' +
        MOODS.map(function (m) { return '<button type="button" class="chip ' + (S.mood === m ? 'navy-on' : '') + '" aria-pressed="' + (S.mood === m) + '" data-action="mood" data-arg="' + m + '">' + m + '</button>'; }).join('') + '</div></div>' +
        '<div><label class="lbl" for="journal-textarea">Private Entry (encrypted locally before storage)</label><textarea id="journal-textarea" rows="4" class="field" placeholder="Write freely without judgment..."></textarea></div>' +
        '<p id="journal-err" class="msg-err">' + esc(S.journalErr) + '</p>' +
        '<div class="row wrap" style="gap:10px"><button type="submit" class="btn teal-bg">' + ic('lock', 'i4') + ' Encrypt &amp; Save to Vault</button>' +
        '<button type="button" class="btn outline" data-action="reflect">' + ic('sparkles', 'i4 teal') + ' Gentle AI Reflection</button></div>' +
      '</form>' +
      '<div id="reflect-region">' + (S.reflection ? '<div class="well" style="padding:14px;font-size:14px;color:var(--slate-700);line-height:1.6;white-space:pre-line"><span class="xs teal" style="font-weight:600">Sakhi Reflection</span>' + esc(S.reflection) + '</div>' : '') + '</div>' +
      '<div class="stack-s sep-t200" style="flex:1"><div class="row between"><h3 style="font-size:14px;font-weight:700;color:var(--navy)" id="vault-title">Encrypted Vault Entries (' + S.journals.length + ')</h3><span class="xs dim">Stored as ciphertext</span></div><div id="vault-list">' + vaultListHtml() + '</div></div></div>' +

      '<div class="stack" style="flex:1">' +
        '<div class="card"><div class="row between wrap"><div class="row">' + ic('wind', 'i5 green') + '<h2 class="sec-title">Coping Exercises</h2></div>' +
          '<button type="button" id="breath-btn" class="btn sm ' + (S.breathing ? 'red-bg' : 'navy-bg') + '" data-action="breathing">' + (S.breathing ? 'Stop 4-7-8 Breathing' : 'Start 4-7-8 Breathing') + '</button></div>' +
          '<div id="breath-region">' + breathRegionHtml() + '</div>' +
          '<div class="stack-xs" style="gap:6px"><div class="row xs" style="gap:6px;font-weight:600;color:var(--slate-700)">' + ic('checksq', 'i35 navy') + '<span>5-4-3-2-1 Grounding Checklist</span></div>' +
          GROUNDING_STEPS.map(function (s, i) {
            const on = S.grounding.indexOf(i) !== -1;
            return '<label class="plain-check xs" style="padding:4px 0;font-size:12px"><input type="checkbox" class="check-green" data-ground="' + i + '"' + (on ? ' checked' : '') + '><span class="' + (on ? 'line-through' : '') + '">' + s + '</span></label>';
          }).join('') + '</div></div>' +

        '<div class="card flex-col-fill"><div class="stack-s"><div class="row between"><h2 class="sec-title">Sakhi Support Chatbot</h2><span class="xs dim" id="chat-mood">Judgment-free · Mood: ' + S.mood + '</span></div>' +
          '<div class="row wrap" style="gap:8px">' + ['I feel overwhelmed today', 'Help me calm down quickly', 'Tips for setting safe boundaries'].map(function (p) { return '<button type="button" class="prompt-chip" data-action="chatPrompt" data-arg="' + esc(p) + '">' + p + '</button>'; }).join('') + '</div>' +
          '<div id="chat-log" class="chat-box">' + chatLogHtml() + '</div></div>' +
          '<form data-form="chat" class="row" style="gap:8px"><label for="sakhi-chat-input" class="sr-only">Message Sakhi</label><input id="sakhi-chat-input" type="text" class="field fill" placeholder="Share what is on your mind..." autocomplete="off"><button type="submit" class="btn teal-bg">' + ic('send', 'i4') + ' Send</button></form>' +
        '</div>' +
      '</div>' +
    '</div></div>';
  }

  /* ---------- Safety ---------- */
  function contactsHtml() {
    return '<ul class="divide">' + S.contacts.map(function (c, i) {
      return '<li class="contact-li"><span>' + esc(c) + '</span><button type="button" class="icon-btn" aria-label="Remove ' + esc(c) + '" data-action="removeContact" data-arg="' + i + '">' + ic('trash', 'i4') + '</button></li>';
    }).join('') + '</ul>';
  }
  function sosRightHtml() {
    if (!S.fir) {
      return '<div class="center" style="text-align:center;padding:40px 0;display:flex;flex-direction:column;align-items:center;gap:8px">' + ic('check', 'i8 dim') + '<h3 class="sub-title">Standby · No Active SOS</h3><p class="muted" style="max-width:448px">Arm the confirm gesture and trigger Silent SOS on the left to test encrypted evidence sealing, contact dispatch, and Zero-FIR export.</p><p class="xs dim" style="padding-top:8px">National Helplines: 112 (Emergency) · 181 (Women’s Helpline) · 1930 (Cyber Crime)</p></div>';
    }
    return '<div class="stack-s"><div class="row between sep-b" style="border-color:var(--slate-200)"><div><span class="xs red" style="font-weight:600">Silent SOS Dispatched</span><h3 class="mono navy" style="font-size:18px;font-weight:700">' + esc(S.fir.referenceId) + '</h3></div>' +
      '<button type="button" class="btn navy-bg sm" data-action="downloadFir">' + ic('download', 'i4') + ' Download FIR Pack</button></div>' +
      '<pre class="mono-pre">' + esc(S.fir.summaryText) + '</pre>' +
      '<form data-form="cancelSos" class="stack-xs sep-t200"><label class="lbl" for="silent-cancel-pin">Silent Cancel (Enter Real Vault PIN ' + esc(S.pins.realPin) + ' if triggered by mistake)</label>' +
      '<div class="row" style="gap:8px"><input id="silent-cancel-pin" type="password" class="field mono-f fill" placeholder="Enter Vault PIN"><button type="submit" class="btn outline sm">Silent Cancel</button></div></form></div>';
  }
  function sosTab() {
    return '<div class="grid s6-6"><div class="card"><div class="row">' + ic('shield', 'i5 red') + '<h2 class="sec-title">Silent SOS Dispatch (No Siren)</h2></div>' +
      '<p class="xs" style="color:var(--slate-600);line-height:1.6">Captures encrypted GPS coordinates, ambient audio seal, and camera frame silently—with a two-step confirm gesture to prevent accidental alerts.</p>' +
      '<div class="stack-xs" style="gap:10px"><label class="plain-check"><input type="checkbox" class="check-navy" data-sos="includeAudio"' + (S.includeAudio ? ' checked' : '') + '>Include sealed ambient audio buffer</label>' +
      '<label class="plain-check"><input type="checkbox" class="check-navy" data-sos="includePhoto"' + (S.includePhoto ? ' checked' : '') + '>Include silent timestamped camera frame</label></div>' +
      '<div class="well" style="padding:16px;gap:12px"><label class="plain-check" style="font-weight:600;color:var(--navy)"><input type="checkbox" class="check-red" data-sos="armed"' + (S.armed ? ' checked' : '') + '>Confirm Gesture: Arm Silent SOS Dispatch</label>' +
      '<button type="button" id="sos-trigger" class="btn red-bg xl block"' + (S.armed ? '' : ' disabled') + ' data-action="triggerSos">Trigger Silent SOS &amp; Build FIR Pack</button></div>' +
      '<p id="sos-msg" class="msg-ok">' + esc(S.cancelMsg) + '</p>' +
      '<div class="sep-t200 stack-s"><h3 style="font-size:14px;font-weight:700;color:var(--navy)">Trusted SOS Contacts</h3><div id="contacts-region">' + contactsHtml() + '</div>' +
      '<form data-form="addContact" class="row" style="gap:8px"><label for="new-sos-contact" class="sr-only">Add trusted contact</label><input id="new-sos-contact" type="text" class="field xs-field fill" placeholder="Name &amp; phone (e.g. Didi +91-98XXXXXX22)"><button type="submit" class="btn navy-bg sm">' + ic('plus', 'i35') + ' Add</button></form></div></div>' +
      '<div id="sos-right" class="card">' + sosRightHtml() + '</div></div>';
  }

  function routeMapHtml(route) {
    const hazardSet = new Set(S.hazards.map(function (r) { return r.edgeId; }));
    const nodeById = new Map(OSM_NODES.map(function (n) { return [n.id, n]; }));
    let svg = '<svg viewBox="0 0 640 360" role="img" aria-label="Neighborhood OSM lighting and safe route map"><defs><pattern id="osm-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-opacity=".1" stroke-width="0.7"/></pattern></defs><rect width="640" height="360" fill="url(#osm-grid)"/>';
    OSM_EDGES.forEach(function (e) {
      const a = nodeById.get(e.from), b = nodeById.get(e.to);
      const onRoute = route.edgeIds.indexOf(e.id) !== -1;
      const haz = hazardSet.has(e.id);
      const stroke = onRoute ? (S.routeMode === 'safest' ? '#16A34A' : '#FF4D94') : (haz || !e.lit ? '#FCA5A5' : '#CBD5E1');
      svg += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + stroke + '" stroke-width="' + (onRoute ? 6 : 3) + '"' + (!e.lit && !onRoute ? ' stroke-dasharray="5 4"' : '') + ' stroke-linecap="round"/>';
    });
    OSM_EDGES.forEach(function (e) {
      const a = nodeById.get(e.from), b = nodeById.get(e.to);
      if (!hazardSet.has(e.id) && e.lit) return;
      svg += '<g transform="translate(' + (a.x + b.x) / 2 + ',' + (a.y + b.y) / 2 + ')"><circle r="9" fill="#DC2626"/><text x="0" y="3.5" text-anchor="middle" fill="#FFFFFF" font-size="10" font-weight="bold">!</text></g>';
    });
    OSM_NODES.forEach(function (n) {
      const isStart = n.id === S.routeStart, isEnd = n.id === S.routeEnd, inPath = route.nodeIds.indexOf(n.id) !== -1;
      const above = n.id === 'alley' || n.id === 'hostel';
      const rectY = above ? -30 : 13, textY = above ? -18 : 25;
      svg += '<g transform="translate(' + n.x + ',' + n.y + ')"><circle r="' + (isStart || isEnd ? 10 : 7) + '" fill="' + (isStart ? '#8B5CF6' : isEnd ? '#FF4D94' : inPath ? '#16A34A' : '#FFFFFF') + '" stroke="#FFFFFF" stroke-width="2.5"/>' +
        '<rect x="-58" y="' + rectY + '" width="116" height="17" rx="4" fill="#FFFFFF" fill-opacity="0.94" stroke="#E2E8F0" stroke-width="1"/>' +
        '<text x="0" y="' + textY + '" text-anchor="middle" fill="#2a1259" font-size="10" font-weight="600">' + esc(n.label) + '</text></g>';
    });
    return svg + '</svg>';
  }
  function routePanelHtml() {
    const route = computeSafeRoute(S.routeStart, S.routeEnd, S.routeMode, S.hazards);
    return '<div class="map-box">' + routeMapHtml(route) + '</div>' +
      '<div class="grid g3 c4-sm stat-c" style="grid-template-columns:repeat(2,1fr)">' +
      '<div class="mini sm"><div class="k">Distance</div><div class="v" style="font-size:16px">' + route.totalDistanceMeters + ' m</div></div>' +
      '<div class="mini sm"><div class="k">Walk ETA</div><div class="v" style="font-size:16px">' + route.estimatedMinutes + ' min</div></div>' +
      '<div class="mini sm"><div class="k">OSM Lit Coverage</div><div class="v green" style="font-size:16px">' + route.lightingCoveragePercent + '%</div></div>' +
      '<div class="mini sm"><div class="k">Safety Rating</div><div class="navy" style="font-size:12px;font-weight:700;margin-top:4px">' + route.safetyGrade + '</div></div></div>';
  }
  function hazardListHtml() {
    return S.hazards.map(function (rep) {
      const e = OSM_EDGES.filter(function (x) { return x.id === rep.edgeId; })[0];
      return '<div class="alert-item"><b>' + esc(e ? e.streetName : rep.edgeId) + '</b><span>' + esc(rep.note) + '</span></div>';
    }).join('');
  }
  function routeTab() {
    const nodeOpts = function (cur) { return OSM_NODES.map(function (n) { return '<option value="' + n.id + '"' + (cur === n.id ? ' selected' : '') + '>' + esc(n.label) + '</option>'; }).join(''); };
    const edgeOpts = OSM_EDGES.map(function (e) { return '<option value="' + e.id + '"' + (S.repEdge === e.id ? ' selected' : '') + '>' + esc(e.streetName) + ' (' + (e.lit ? 'OSM lit=yes' : 'OSM lit=no') + ')</option>'; }).join('');
    const types = [['unlit_street', 'Streetlights out / dark stretch'], ['isolated_alley', 'Isolated / zero foot traffic'], ['harassment_hotspot', 'Harassment / unsafe gathering'], ['broken_cctv', 'Damaged CCTV / blind spot']];
    return '<div class="grid s7-5"><div class="card"><div class="row between wrap"><div class="row">' + ic('nav', 'i5 navy') + '<h2 class="sec-title">OSM Safe Route Map</h2></div>' +
      '<div class="seg"><button type="button" class="' + (S.routeMode === 'safest' ? 'on-navy' : '') + '" data-action="routeMode" data-arg="safest">Safest (Lit &amp; Patrolled)</button><button type="button" class="' + (S.routeMode === 'fastest' ? 'on-teal' : '') + '" data-action="routeMode" data-arg="fastest">Fastest Shortest</button></div></div>' +
      '<div class="grid c2-sm g3" style="grid-template-columns:1fr 1fr"><div><label class="lbl" for="route-start">Start Point</label><select id="route-start" class="field" data-sel="routeStart">' + nodeOpts(S.routeStart) + '</select></div>' +
      '<div><label class="lbl" for="route-end">Destination</label><select id="route-end" class="field" data-sel="routeEnd">' + nodeOpts(S.routeEnd) + '</select></div></div>' +
      '<div id="route-panel" class="stack-s">' + routePanelHtml() + '</div></div>' +

      '<div class="card"><div class="row">' + ic('alert', 'i5 amber') + '<h2 class="sec-title">Anonymous Crowd Hazard Report</h2></div>' +
      '<p class="xs" style="color:var(--slate-600)">Reporting a broken streetlight or unsafe stretch immediately updates the Safe Route solver so all nearby routes avoid it.</p>' +
      '<form data-form="hazard" class="stack-s"><div><label class="lbl" for="hazard-street">Street Segment</label><select id="hazard-street" class="field" data-sel="repEdge">' + edgeOpts + '</select></div>' +
      '<div><label class="lbl" for="hazard-type">Hazard Type</label><select id="hazard-type" class="field" data-sel="repType">' + types.map(function (t) { return '<option value="' + t[0] + '"' + (S.repType === t[0] ? ' selected' : '') + '>' + t[1] + '</option>'; }).join('') + '</select></div>' +
      '<div><label class="lbl" for="hazard-note">Observation Note (anonymous)</label><input id="hazard-note" type="text" class="field" placeholder="e.g., 3 poles unlit near corner gate"></div>' +
      '<button type="submit" class="btn navy-bg block">Submit Anonymous Report &amp; Reroute</button></form>' +
      '<div class="sep-t200 stack-xs"><h3 class="upper" id="alert-count">Active Crowd Alerts (' + S.hazards.length + ')</h3><div id="hazard-list" class="scroll-48">' + hazardListHtml() + '</div></div></div></div>';
  }

  function meshSvgHtml() {
    let svg = '<svg viewBox="0 0 560 330" role="img" aria-label="Bluetooth Mesh SOS relay topology">';
    SEED_MESH_NODES.forEach(function (a, i) {
      SEED_MESH_NODES.slice(i + 1).forEach(function (b) {
        if (Math.hypot(a.x - b.x, a.y - b.y) > 185) return;
        const active = S.meshResult && S.meshResult.hops.some(function (h) { return (h.fromId === a.id && h.toId === b.id) || (h.fromId === b.id && h.toId === a.id); });
        svg += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + (active ? '#FF4D94' : '#CBD5E1') + '" stroke-width="' + (active ? 4 : 1.5) + '"' + (active ? '' : ' stroke-dasharray="4 4"') + '/>';
      });
    });
    SEED_MESH_NODES.forEach(function (n) {
      const you = n.id === 'you';
      svg += '<g transform="translate(' + n.x + ',' + n.y + ')"><circle r="' + (you ? 13 : 10) + '" fill="' + (you ? '#DC2626' : n.hasCellularGateway ? '#16A34A' : '#8B5CF6') + '"/>' +
        '<text x="0" y="25" text-anchor="middle" fill="#FFFFFF" font-size="10" font-weight="600">' + esc(n.label) + '</text>' +
        '<text x="0" y="36" text-anchor="middle" fill="#C4B5F0" font-size="9">Bat ' + n.batteryPercent + '%' + (n.hasCellularGateway ? ' · Gateway' : '') + '</text></g>';
    });
    return svg + '</svg>';
  }
  function meshRightHtml() {
    const r = S.meshResult;
    if (!r) return '<p class="muted">Click “Broadcast Encrypted BLE Mesh SOS Beacon” to trace multi-hop relay discovery to the nearest online gateway.</p>';
    const label = function (id) { const n = SEED_MESH_NODES.filter(function (x) { return x.id === id; })[0]; return n ? n.label : id; };
    return '<div class="stack-s"><div class="grid c2-sm g3" style="grid-template-columns:1fr 1fr">' +
      '<div class="mini"><div class="k">Packet ID</div><div class="mono navy" style="font-size:12px;font-weight:700;margin-top:2px">' + esc(r.packetId) + '</div></div>' +
      '<div class="mini"><div class="k">Gateway Reached</div><div class="green" style="font-size:14px;font-weight:700;margin-top:2px">' + (r.reachedGateway ? 'Delivered' : 'Queued') + '</div></div>' +
      '<div class="mini"><div class="k">Relay Hops</div><div class="mono navy" style="font-weight:700">' + r.hops.length + '</div></div>' +
      '<div class="mini"><div class="k">Total Latency</div><div class="mono navy" style="font-weight:700">' + r.totalLatencyMs + ' ms</div></div></div>' +
      '<div class="stack-xs"><h4 class="upper">Hop Trace</h4>' + r.hops.map(function (h) {
        return '<div class="hop"><span class="navy" style="font-weight:500">Hop ' + h.hopNumber + ': ' + esc(label(h.fromId)) + ' → ' + esc(label(h.toId)) + '</span><span class="mono dim">' + h.rssiDbm + ' dBm</span></div>';
      }).join('') + '</div></div>';
  }
  const LIVE_STATUS = {
    idle: 'Ready — tap the button to pick a nearby Bluetooth device',
    scanning: 'Choose a nearby device in the browser pop-up…',
    connecting: 'Connecting to the selected device…',
    live: 'LIVE — location is being sent to the nearby device',
    noservice: 'Connected, but this device cannot receive Sakhi SOS data',
    unsupported: 'Web Bluetooth is not available in this browser',
    error: 'Bluetooth link failed',
    stopped: 'Live SOS stopped'
  };
  function liveRegionHtml() {
    const L = S.live;
    const c = L.coords && L.coords.coords;
    const tone = L.status === 'live' ? 'green' : (L.status === 'idle' || L.status === 'stopped' || L.status === 'scanning' || L.status === 'connecting') ? 'navy' : 'red';
    return '<div class="well" style="padding:14px;gap:10px">' +
      '<div class="row between wrap" style="gap:8px"><b class="' + tone + '" style="font-size:13px">' + (L.status === 'live' ? '● ' : '') + LIVE_STATUS[L.status] + '</b>' +
      (L.deviceName ? '<span class="xs dim">Device: <b class="navy">' + esc(L.deviceName) + '</b></span>' : '') + '</div>' +
      '<div class="grid g3" style="grid-template-columns:repeat(3,1fr)">' +
        '<div class="mini sm"><div class="k xxs">Latitude</div><div class="mono navy" style="font-size:12px;font-weight:700">' + (c ? c.latitude.toFixed(6) : '—') + '</div></div>' +
        '<div class="mini sm"><div class="k xxs">Longitude</div><div class="mono navy" style="font-size:12px;font-weight:700">' + (c ? c.longitude.toFixed(6) : '—') + '</div></div>' +
        '<div class="mini sm"><div class="k xxs">GPS accuracy</div><div class="mono navy" style="font-size:12px;font-weight:700">' + (c ? '±' + Math.round(c.accuracy) + ' m' : '—') + '</div></div></div>' +
      '<div class="row between xs dim"><span>Packet ' + esc(L.packetId || '—') + '</span><span>Updates sent: <b class="navy">' + L.sent + '</b></span></div>' +
      (L.log.length ? '<ul style="list-style:none;display:flex;flex-direction:column;gap:3px;font-size:11px;color:var(--slate-600);font-family:var(--font-mono)">' + L.log.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' : '') +
      '</div>';
  }

  function meshTab() {
    return '<div class="grid s7-5"><div class="card"><div class="row between wrap"><div class="row">' + ic('radio', 'i5 teal') + '<h2 class="sec-title">Offline Bluetooth (BLE) Mesh Relay</h2></div>' +
      '<label class="plain-check xs" style="font-weight:600"><input type="checkbox" data-sos="meshOffline"' + (S.meshOffline ? ' checked' : '') + '>Cellular Offline Mode</label></div>' +
      '<p class="xs" style="color:var(--slate-600)">When mobile data or cellular signal drops (basements, highways, outages), Sakhi360 relays an encrypted 128-byte SOS beacon hop-by-hop across nearby Sakhi BLE peers until one reaches a cellular gateway.</p>' +
      '<div id="mesh-map" class="map-box">' + meshSvgHtml() + '</div>' +
      '<div class="card" style="padding:16px;gap:12px;border-color:var(--red)"><div class="row">' + ic('shield', 'i5 red') + '<h3 class="sub-title">Live Bluetooth SOS — send exact location</h3></div>' +
      '<p class="xs" style="color:var(--slate-600);line-height:1.6">Tap SOS to pick a nearby Bluetooth device. Sakhi360 connects to it and streams your exact GPS fix (refreshed every 5 s) until you stop. The receiving device must run the Sakhi SOS service.</p>' +
      '<div class="row wrap" style="gap:10px"><button type="button" class="btn red-bg xl fill" data-action="liveSos">SOS · Connect &amp; Send Live Location</button>' +
      '<button type="button" class="btn outline xl" data-action="liveStop">Stop</button></div>' +
      '<div id="live-region">' + liveRegionHtml() + '</div></div>' +
      '<button type="button" class="btn teal-bg block" data-action="broadcastMesh">Run Mesh Relay Simulation (demo map only)</button></div>' +
      '<div class="card"><h3 class="sub-title">Mesh Relay Telemetry</h3><div id="mesh-right">' + meshRightHtml() + '</div></div></div>';
  }

  function viewSafety() {
    const tabs = '<div class="tabs" role="tablist" aria-label="Safety tools">' +
      tabBtn('safetyTab', 'sos', 'Silent SOS &amp; FIR Pack', S.safetyTab, 'on-red') +
      tabBtn('safetyTab', 'route', 'Safe Route Planner', S.safetyTab, 'on-navy') +
      tabBtn('safetyTab', 'mesh', 'Offline BLE Mesh SOS', S.safetyTab, 'on-navy') + '</div>';
    const body = S.safetyTab === 'sos' ? sosTab() : S.safetyTab === 'route' ? routeTab() : meshTab();
    return '<div class="view">' + pageHead('Safety &amp; Mobility · SOS, OSM Safe Route &amp; BLE Mesh', 'Hold/confirm Silent SOS with FIR-ready evidence pack, lit route planner, and offline Bluetooth Mesh relay.', tabs) + body + '</div>';
  }

  /* ---------- Digital defense ---------- */
  function takedownOutHtml() {
    if (!S.takedown) return '';
    return '<div class="stack-xs sep-t200"><div class="row between"><span class="xs navy" style="font-weight:700">Ready-to-Send Takedown Notice</span><button type="button" class="link-btn" data-action="copyDraft">' + ic(S.copied ? 'check' : 'copy', 'i35') + (S.copied ? 'Copied' : 'Copy Text') + '</button></div><pre class="mono-pre cap">' + esc(S.takedown) + '</pre></div>';
  }
  function scanOutHtml() {
    const r = S.scan;
    if (!r) return '';
    return '<div class="well" style="padding:16px;gap:12px"><div class="row between"><div class="row">' + (r.threatLevel === 'Clean' ? ic('shieldcheck', 'i5 green') : ic('alert', 'i5 red')) + '<b class="navy" style="font-size:14px">' + r.threatLevel + '</b></div><span class="mono navy" style="font-size:14px;font-weight:700">Risk ' + r.riskScore + '/100</span></div>' +
      (r.findings.length ? '<ul style="list-style:none;display:flex;flex-direction:column;gap:8px;font-size:12px">' + r.findings.map(function (f) { return '<li class="sep-t200" style="padding-top:8px;border-top:1px solid var(--slate-200)"><div class="navy" style="font-weight:600">' + esc(f.title) + '</div><div style="color:var(--slate-600);margin-top:2px">' + esc(f.remediation) + '</div></li>'; }).join('') + '</ul>' : '<p class="xs" style="color:var(--slate-600)">No stalkerware permission anomalies flagged.</p>') + '</div>';
  }
  function wipeConfirmHtml() {
    if (!S.confirmWipe) return '';
    return '<div class="warn-box"><p class="xs red" style="font-weight:600">Confirm Panic Wipe: This immediately clears encrypted journal entries, cycle logs, and SOS contacts from this browser and switches to Decoy Mode.</p><div class="row" style="gap:8px"><button type="button" class="btn red-bg sm" data-action="wipeYes">Yes, Wipe Sensitive Data</button><button type="button" class="btn outline sm" data-action="wipeNo" style="color:var(--slate-700)">Cancel</button></div></div>';
  }
  function viewDefense() {
    const sel = function (list, cur) { return list.map(function (o) { return '<option' + (cur === o ? ' selected' : '') + '>' + o + '</option>'; }).join(''); };
    const sigs = [['unknownDeviceAdmin', 'Unknown Device Admin app active'], ['accessibilityServiceAbuse', 'App abusing Accessibility service'], ['hiddenLauncherIcon', 'Hidden home-screen app icon'], ['backgroundMicOrLocationSpike', 'Background mic / GPS spikes'], ['sideloadedUnknownApp', 'App sideloaded outside store'], ['unrecognizedBatteryDrain', 'Overnight data/battery drain']];
    return '<div class="view">' + pageHead('Digital Defense · Takedown, Stalkerware &amp; Privacy Shield', 'Deepfake/morphed-image takedown assistant, stalkerware permission scanner, dual PIN, calculator stealth &amp; panic wipe.') +
    '<div class="grid s6-6">' +
      '<div class="card"><div class="row">' + ic('filewarn', 'i5 teal') + '<h2 class="sec-title">Deepfake &amp; Morphed-Image Takedown Assistant</h2></div>' +
      '<form data-form="takedown" class="stack-s" style="gap:14px"><div class="grid c2-sm g3" style="grid-template-columns:1fr 1fr">' +
        '<div><label class="lbl" for="td-platform">Platform</label><select id="td-platform" class="field" data-sel-td="platform">' + sel(['Instagram / Meta', 'Telegram Channel / Group', 'WhatsApp', 'X (Twitter)', 'External Website / Search'], S.td.platform) + '</select></div>' +
        '<div><label class="lbl" for="td-type">Incident Type</label><select id="td-type" class="field" data-sel-td="type">' + sel(['Non-consensual morphed / deepfake image', 'AI synthetic video impersonation', 'Sextortion / blackmail threat', 'Doxxing & private photo leak'], S.td.type) + '</select></div></div>' +
        '<div><label class="lbl" for="td-ref">Offending URL, Account Handle, or StopNCII Hash</label><input id="td-ref" type="text" class="field" placeholder="https://... or @username"></div>' +
        '<div><label class="lbl" for="td-context">Brief Description (Do not paste sensitive personal IDs)</label><textarea id="td-context" rows="2" class="field" style="border-radius:8px" placeholder="Describe impersonation or blackmail demand..."></textarea></div>' +
        '<button type="submit" class="btn teal-bg block">Generate Legal Takedown &amp; Grievance Draft</button></form>' +
      '<div id="takedown-out" class="stack-s">' + takedownOutHtml() + '</div>' +
      '<div class="well xs" style="color:var(--slate-600)"><div class="navy" style="font-weight:700">Immediate Action Checklist</div><p>1. Generate a privacy-preserving digital hash at <span class="mono">StopNCII.org</span> without uploading raw images.</p><p>2. Report on <span class="mono">cybercrime.gov.in</span> or call <span class="mono" style="font-weight:600">1930</span> (India).</p></div></div>' +

      '<div class="stack">' +
        '<div class="card"><div class="row">' + ic('smartphone', 'i5 navy') + '<h2 class="sec-title">Stalkerware &amp; Spyware Detector</h2></div>' +
        '<p class="xs" style="color:var(--slate-600)">Audit device permissions and stealth telemetry behaviors commonly abused by spouseware/stalkerware apps.</p>' +
        '<div class="grid c2-sm tight">' + sigs.map(function (s) { return '<label class="checkbox-card compact"><input type="checkbox" class="check-cyan" data-sig="' + s[0] + '"' + (S.signals[s[0]] ? ' checked' : '') + '>' + s[1] + '</label>'; }).join('') + '</div>' +
        '<button type="button" class="btn navy-bg block" data-action="runScan">Run Stalkerware Permission Audit</button><div id="scan-out">' + scanOutHtml() + '</div></div>' +

        '<div class="card"><h2 class="sec-title">Privacy Shield · Dual PIN &amp; Stealth Disguise</h2>' +
        '<form data-form="pins" class="stack-s" style="gap:12px"><div class="grid g3" style="grid-template-columns:repeat(3,1fr)">' +
          '<div><label class="lbl" for="real-pin">Real Vault PIN</label><input id="real-pin" type="text" class="field mono-f" value="' + esc(S.pins.realPin) + '"></div>' +
          '<div><label class="lbl" for="decoy-pin">Decoy PIN</label><input id="decoy-pin" type="text" class="field mono-f" value="' + esc(S.pins.decoyPin) + '"></div>' +
          '<div><label class="lbl" for="panic-pin">Panic Wipe PIN</label><input id="panic-pin" type="text" class="field mono-f pin-red" value="' + esc(S.pins.panicPin) + '"></div></div>' +
        '<p id="pin-msg" class="msg-navy">' + esc(S.pinMsg) + '</p>' +
        '<button type="submit" class="btn outline sm" style="align-self:flex-start">Update Dual PIN Codes</button></form>' +
        '<div class="sep-t200 row wrap" style="gap:12px"><button type="button" class="btn navy-bg" data-action="enterStealth">' + ic('calc', 'i4') + ' Launch Calculator Stealth Now</button>' +
        '<button type="button" class="btn outline-red" data-action="wipeAsk">' + ic('trash', 'i4') + ' Panic Wipe Vault</button></div>' +
        '<div id="wipe-confirm">' + wipeConfirmHtml() + '</div></div>' +
      '</div></div></div>';
  }

  /* ---------- Growth ---------- */
  function growthCalcHtml() {
    const total = S.weekly * S.weeks;
    const emergency = Math.round(total * 0.65);
    return '<div class="grid g3" style="grid-template-columns:repeat(3,1fr);padding-top:8px">' +
      '<div class="mini"><div class="k xxs">Total Saved</div><div class="v mono" style="font-size:16px">' + inr(total) + '</div></div>' +
      '<div class="mini"><div class="k xxs">Safety Stash</div><div class="v mono green" style="font-size:16px">' + inr(emergency) + '</div></div>' +
      '<div class="mini"><div class="k xxs">Skill Fund</div><div class="v mono teal" style="font-size:16px">' + inr(total - emergency) + '</div></div></div>';
  }
  function newsRegionHtml() {
    const cats = ['All', 'Health', 'Safety & Rights', 'Finance', 'Careers'];
    const list = S.newsCat === 'All' ? CURATED_SAFE_NEWS : CURATED_SAFE_NEWS.filter(function (n) { return n.category === S.newsCat; });
    return '<div class="row wrap" style="gap:6px;justify-content:flex-end">' + cats.map(function (c) { return '<button type="button" class="chip semi ' + (S.newsCat === c ? 'navy-on' : '') + '" data-action="newsCat" data-arg="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<div class="grid c2-md" style="gap:16px">' + list.map(function (n) {
        return '<article class="well" style="padding:16px;gap:8px"><div class="row xs dim" style="gap:8px"><span class="teal" style="font-weight:600">' + esc(n.category) + '</span><span aria-hidden="true">·</span><span>' + esc(n.source) + '</span><span aria-hidden="true">·</span><span>' + esc(n.readTime) + '</span></div>' +
          '<h3 style="font-size:16px;font-weight:700;color:var(--navy);line-height:1.35">' + esc(n.title) + '</h3><p class="muted" style="line-height:1.6">' + esc(n.summary) + '</p>' +
          '<div class="row xs green" style="gap:6px;font-weight:500;padding-top:4px">' + ic('check', 'i35') + '<span>Verified constructive briefing · Zero engagement tracking</span></div></article>';
      }).join('') + '</div>';
  }
  function viewGrowth() {
    const totalLessons = CAREER_SKILL_MODULES.reduce(function (a, m) { return a + m.lessons.length; }, 0);
    return '<div class="view" style="gap:32px">' + pageHead('Growth · Bank-Free Savings, Skills &amp; Safe News', 'Independent financial literacy without mandatory bank exposure, career/legal skill modules, and an algorithm-free safe news feed.') +
    '<section class="grid s5-7"><div class="card"><div class="row">' + ic('wallet', 'i5 green') + '<h2 class="sec-title">Bank-Free Emergency Buffer Planner</h2></div>' +
      '<div class="stack-s"><div><div class="row between xs" style="font-weight:600;color:var(--slate-700);margin-bottom:4px"><label for="weekly-save">Weekly Cash / Micro-Savings (₹)</label><span id="weekly-out" class="mono navy">₹' + S.weekly + '/week</span></div><input id="weekly-save" type="range" min="50" max="2000" step="50" value="' + S.weekly + '" data-range="weekly"></div>' +
      '<div><div class="row between xs" style="font-weight:600;color:var(--slate-700);margin-bottom:4px"><label for="weeks-horizon">Saving Duration</label><span id="weeks-out" class="mono navy">' + S.weeks + ' weeks</span></div><input id="weeks-horizon" class="range-navy" type="range" min="4" max="52" step="4" value="' + S.weeks + '" data-range="weeks"></div>' +
      '<div id="growth-calc">' + growthCalcHtml() + '</div></div></div>' +
      '<div class="stack-s">' + BANK_FREE_SAVINGS_GUIDES.map(function (g) {
        return '<div class="card" style="padding:20px;gap:10px"><div class="row between wrap"><h3 class="sub-title">' + esc(g.title) + '</h3><span class="xs dim" style="font-weight:500">' + esc(g.category) + '</span></div><p class="muted">' + esc(g.summary) + '</p><ul class="bullets xs-b" style="padding-top:4px">' + g.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div></section>' +

    '<section class="card"><div class="row between wrap"><div class="row">' + ic('cap', 'i5 navy') + '<h2 class="sec-title">Career &amp; Empowerment Skill Modules</h2></div><span id="lesson-count" class="mono xs green" style="font-weight:600">' + S.lessons.length + '/' + totalLessons + ' lessons completed</span></div>' +
      '<div class="grid c2-md" style="gap:16px">' + CAREER_SKILL_MODULES.map(function (m) {
        return '<div class="well" style="padding:16px;gap:12px"><div class="row between" style="align-items:baseline;gap:8px"><h3 style="font-size:14px;font-weight:700;color:var(--navy)">' + esc(m.title) + '</h3><span class="xs dim nw">' + esc(m.track) + ' · ' + esc(m.duration) + '</span></div>' +
          '<div class="stack-xs" style="gap:6px">' + m.lessons.map(function (l, i) {
            const key = m.id + '-' + i, done = S.lessons.indexOf(key) !== -1;
            return '<label class="plain-check" style="align-items:flex-start;font-size:12px;padding:4px 0"><input type="checkbox" class="check-green" data-lesson="' + key + '"' + (done ? ' checked' : '') + '><span class="' + (done ? 'line-through' : '') + '">' + esc(l) + '</span></label>';
          }).join('') + '</div></div>';
      }).join('') + '</div></section>' +

    '<section class="card"><div class="row"><span class="teal">' + ic('news', 'i5') + '</span><h2 class="sec-title">Curated Safe News Feed (No Toxic Algorithms)</h2></div><div id="news-region" class="stack-s">' + newsRegionHtml() + '</div></section></div>';
  }

  /* ---------- Wiki ---------- */
  function wikiFiltered() {
    const q = S.wikiSearch.trim().toLowerCase();
    return ENCYCLOPEDIA_ARTICLES.filter(function (art) {
      if (S.wikiCat !== 'All' && art.category !== S.wikiCat) return false;
      if (!q) return true;
      const hay = [art.title, art.subtitle, art.lead].concat(art.sections.reduce(function (acc, s) { return acc.concat([s.heading], s.paragraphs, s.bullets || []); }, [])).join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }
  function wikiActiveArticle() {
    const f = wikiFiltered();
    return ENCYCLOPEDIA_ARTICLES.filter(function (a) { return a.id === S.wikiActive; })[0] || f[0] || ENCYCLOPEDIA_ARTICLES[0];
  }
  function wikiIndexHtml() {
    const list = wikiFiltered();
    const active = wikiActiveArticle();
    return '<div class="idx-head"><b class="xs navy">Articles (' + list.length + ')</b><span class="xxs dim">A–Z Index</span></div>' +
      (list.length === 0 ? '<div class="xs dim stack-xs" style="padding:16px"><p>No articles match “' + esc(S.wikiSearch) + '”.</p><button type="button" class="link-btn" data-action="wikiReset">Reset search filter</button></div>'
        : '<nav class="divide" aria-label="Encyclopedia Articles">' + list.map(function (a) {
          return '<button type="button" class="idx-item ' + (a.id === active.id ? 'sel' : '') + '" data-action="wikiOpen" data-arg="' + a.id + '"><div class="t">' + esc(a.title) + '</div><div class="c">' + esc(a.category) + '</div></button>';
        }).join('') + '</nav>');
  }
  function wikiArticleHtml() {
    const a = wikiActiveArticle();
    return '<header class="sep-b" style="border-bottom:1px solid var(--slate-200);display:flex;flex-direction:column;gap:8px"><div class="row between wrap xs dim" style="gap:8px"><span>' + esc(a.category) + ' · Reviewed ' + esc(a.lastReviewed) + '</span><span>Educational reference only — not a substitute for clinical diagnosis</span></div>' +
      '<h2 class="art-title font-display">' + esc(a.title) + '</h2><p class="muted">' + esc(a.subtitle) + '</p></header>' +
      '<div class="grid s7-5-xl" style="gap:24px"><div class="stack-s" style="gap:20px"><p class="lead">' + esc(a.lead) + '</p>' +
        '<div class="well toc" style="padding:16px;gap:8px"><div class="upper navy" style="font-size:12px">Contents</div><ul>' + a.sections.map(function (s) { return '<li><a href="#" data-scroll="wiki-sec-' + s.id + '">' + esc(s.heading) + '</a></li>'; }).join('') + '</ul></div></div>' +
        '<aside class="infobox"><div class="hd">' + esc(a.infobox.heading) + '</div><dl style="margin:0">' + a.infobox.rows.map(function (r) { return '<div class="rw"><dt>' + esc(r.label) + '</dt><dd>' + esc(r.value) + '</dd></div>'; }).join('') + '</dl>' +
        (a.actionTarget ? '<div class="act"><button type="button" class="btn teal-bg sm block" data-nav="' + a.actionTarget.pillar + '">' + esc(a.actionTarget.label) + ' ' + ic('arrow', 'i35') + '</button></div>' : '') + '</aside></div>' +
      '<div class="stack" style="gap:24px;padding-top:8px">' + a.sections.map(function (s) {
        return '<section id="wiki-sec-' + s.id + '" class="art-sec"><h3>' + esc(s.heading) + '</h3>' + s.paragraphs.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
          (s.bullets ? '<ul class="bullets" style="padding-left:4px">' + s.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' : '') + '</section>';
      }).join('') + '</div>' +
      (a.relatedIds.length ? '<section class="art-sec" style="gap:10px"><h3 style="font-size:14px">See Also (Related Articles)</h3><div class="row wrap" style="gap:8px">' + a.relatedIds.map(function (rid) {
        const t = ENCYCLOPEDIA_ARTICLES.filter(function (x) { return x.id === rid; })[0];
        return t ? '<button type="button" class="rel-btn" data-action="wikiOpen" data-arg="' + rid + '">' + ic('link', 'i35') + esc(t.title) + '</button>' : '';
      }).join('') + '</div></section>' : '') +
      '<section class="art-sec" style="gap:12px"><div class="row" style="gap:8px"><span class="teal">' + ic('sparkles', 'i4') + '</span><h3 style="font-size:14px">Ask Sakhi a Question About ' + esc(a.title) + '</h3></div>' +
        '<form data-form="wikiAsk" class="row wrap" style="gap:8px"><label for="wiki-ai-question" class="sr-only">Ask a medical education question</label><input id="wiki-ai-question" type="text" class="field fill" style="min-width:200px" placeholder="e.g., What blood tests should I ask for regarding this topic?"><button type="submit" class="btn navy-bg sm">Ask</button></form>' +
        '<div id="wiki-answer">' + (S.wikiAnswer ? '<div class="ai-answer">' + esc(S.wikiAnswer) + '</div>' : '') + '</div></section>' +
      '<footer class="art-sec" style="gap:6px"><h3 class="upper" style="font-size:12px">References</h3><ol class="ol-refs">' + a.references.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ol></footer>';
  }
  function viewWiki() {
    return '<div class="view"><div class="card" style="gap:16px"><div class="row wrap" style="justify-content:space-between;gap:16px"><div class="stack-xs" style="gap:4px;flex:1;min-width:260px"><div class="eyebrow">' + ic('openbook', 'i4') + '<span>SakhiPedia · Clinical &amp; Safety Reference Encyclopedia</span></div>' +
      '<h1 class="page-title">Women’s Health, PCOS &amp; Legal Rights Knowledge Base</h1><p class="muted">Search structured medical articles on PCOS, Rotterdam diagnostic criteria, insulin resistance, cycles, pregnancy, and legal protections.</p></div>' +
      '<div class="search-wrap"><label for="wiki-search" class="sr-only">Search SakhiPedia articles</label>' + ic('search', 'i4') + '<input id="wiki-search" type="search" class="field" value="' + esc(S.wikiSearch) + '" placeholder="Search PCOS, Rotterdam, insulin, Zero-FIR..."></div></div>' +
      '<div id="wiki-cats" class="row wrap" style="gap:6px">' + WIKI_CATEGORIES.map(function (c) { return '<button type="button" class="chip semi ' + (S.wikiCat === c ? 'navy-on' : '') + '" data-action="wikiCat" data-arg="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div></div>' +
      '<div class="grid s3-9"><aside id="wiki-index" class="card flush">' + wikiIndexHtml() + '</aside><article id="wiki-article" class="card article">' + wikiArticleHtml() + '</article></div></div>';
  }

  /* ---------- Stealth calculator & decoy ---------- */
  const CALC_KEYS = [['C', '(', ')', '/'], ['7', '8', '9', '*'], ['4', '5', '6', '-'], ['1', '2', '3', '+'], ['0', '.', '⌫', '=']];
  function stealthHtml() {
    return '<main class="calc"><div class="calc-top"><b>CalcPro</b><span>Standard</span></div>' +
      '<div class="calc-screen"><div id="calc-hist" class="calc-hist">' + (esc(S.calc.hist) || '&nbsp;') + '</div><div id="calc-disp" class="calc-disp" data-testid="calculator-display">' + esc(S.calc.display) + '</div></div>' +
      '<div class="calc-keys">' + CALC_KEYS.reduce(function (a, r) { return a.concat(r); }, []).map(function (k) {
        const cls = k === '=' ? 'eq' : ['/', '*', '-', '+'].indexOf(k) !== -1 ? 'op' : k === 'C' ? 'clr' : '';
        const label = k === '⌫' ? 'Backspace' : k === '=' ? 'Equals' : k === 'C' ? 'Clear' : k;
        return '<button type="button" class="ckey ' + cls + '" aria-label="' + label + '" data-key="' + esc(k) + '">' + (k === '⌫' ? ic('backspace', 'i5') : esc(k)) + '</button>';
      }).join('') + '</div></main>';
  }
  function decoyNotesHtml() {
    return S.decoyNotes.map(function (n) {
      return '<article class="note"><div class="meta"><span>Notebook</span><span>' + esc(n.date) + '</span></div><h2>' + esc(n.title) + '</h2><p>' + esc(n.body) + '</p></article>';
    }).join('');
  }
  function decoyHtml() {
    return '<header><div class="wrap"><div class="logo">' + ic('openbook', 'i5') + '<span>QuickStudy Notes</span></div>' +
      '<button type="button" class="btn outline sm" style="color:var(--slate-700)" data-action="lockCalc">' + ic('lock', 'i35') + ' Lock</button></div></header>' +
      '<main>' + (S.wiped ? '<div class="banner">Local cache reset complete. Showing standard study notebook.</div>' : '') +
      '<form data-form="decoyNote" class="note-form"><h1>Add Class / Recipe Note</h1><input id="decoy-title" type="text" class="field" placeholder="Note title..."><textarea id="decoy-body" rows="2" class="field" style="border-radius:8px" placeholder="Write summary..."></textarea>' +
      '<button type="submit" class="btn-dark">' + ic('plus', 'i4') + ' Save Note</button></form>' +
      '<div id="decoy-notes" class="notes-grid">' + decoyNotesHtml() + '</div></main>';
  }

  /* ---------------------------------------------------------
     5) WIRING — chrome, rendering, events, actions
     --------------------------------------------------------- */
  const $ = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  function setHtml(sel, html) { const el = $(sel); if (el) el.innerHTML = html; }
  function setText(sel, text) { const el = $(sel); if (el) el.textContent = text; }

  function renderChrome() {
    $('#brand-icon').innerHTML = ic('heart', 'i5');
    $('#mobile-wiki-btn').innerHTML = ic('openbook', 'i35') + 'Wiki';

    $('#sidebar-nav').innerHTML = SIDEBAR_SECTIONS.map(function (sec) {
      return '<div class="nav-group"><div class="nav-group-title">' + sec.group + '</div>' + sec.items.map(function (it) {
        return '<button type="button" class="nav-item ' + (S.active === it.id ? 'active' : '') + '" data-nav="' + it.id + '"' + (S.active === it.id ? ' aria-current="page"' : '') + '>' + ic(it.icon) + '<span style="overflow:hidden;text-overflow:ellipsis">' + it.label + '</span></button>';
      }).join('') + '</div>';
    }).join('');

    $('#mobile-nav').innerHTML = MOBILE_NAV.map(function (it) {
      return '<button type="button" class="' + (S.active === it.id ? 'active' : '') + '" data-nav="' + it.id + '">' + ic(it.icon) + '<span>' + it.label + '</span></button>';
    }).join('');

    $('#crumb-title').textContent = PILLAR_TITLES[S.active];
    $('#mobile-wiki-btn').classList.toggle('active', S.active === 'wiki');
    renderVaultKeys();
  }
  function renderVaultKeys() {
    $('#vk-real').textContent = S.pins.realPin;
    $('#vk-decoy').textContent = S.pins.decoyPin;
    $('#vk-panic').textContent = S.pins.panicPin;
  }

  const VIEWS = { overview: viewOverview, body: viewBody, mind: viewMind, safety: viewSafety, defense: viewDefense, growth: viewGrowth, wiki: viewWiki };

  function renderView() {
    if (S.active !== 'mind') stopBreathing();
    $('#main').innerHTML = VIEWS[S.active]();
    if (S.active === 'mind') {
      const log = $('#chat-log');
      if (log) log.scrollTop = log.scrollHeight;
    }
    renderChrome();
  }
  function setPillar(id) {
    S.active = id;
    renderView();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  function openWiki(articleId) {
    S.wikiActive = articleId || 'pcos';
    S.wikiAnswer = '';
    setPillar('wiki');
  }

  function setSurface(next) {
    S.surface = next;
    $('#shell').hidden = next !== 'real';
    $('#stealth').hidden = next !== 'stealth';
    $('#decoy').hidden = next !== 'decoy';
    if (next === 'stealth') $('#stealth').innerHTML = stealthHtml();
    if (next === 'decoy') $('#decoy').innerHTML = decoyHtml();
    if (next === 'real') { renderChrome(); renderView(); }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function panicWipe() {
    Object.keys(STORAGE_KEYS).forEach(function (k) { try { localStorage.removeItem(STORAGE_KEYS[k]); } catch (e) { /* ignore */ } });
    S.cycles = []; S.journals = []; S.contacts = []; S.lessons = []; S.selfCheck = null; S.unlocked = {};
    S.fir = null; S.reflection = ''; S.pcosResult = null; S.pcosAdvice = null;
    S.wiped = true;
    ['cycles', 'journals', 'contacts', 'lessons', 'selfCheck'].forEach(save);
    setSurface('decoy');
  }

  /* ---------- Calculator stealth ---------- */
  function calcPress(key) {
    const c = S.calc;
    if (key === 'C') { c.display = '0'; c.raw = ''; c.hist = ''; return calcPaint(); }
    if (key === '⌫') {
      c.display = c.display.length <= 1 ? '0' : c.display.slice(0, -1);
      c.raw = c.raw.slice(0, -1);
      return calcPaint();
    }
    if (key === '=') {
      const candidate = c.raw || c.display;
      const mode = resolvePinMode(candidate, S.pins);
      if (mode !== 'invalid') {
        c.display = '0'; c.raw = ''; c.hist = '';
        if (mode === 'panic_wipe') return panicWipe();
        S.wiped = false;
        return setSurface(mode === 'decoy' ? 'decoy' : 'real');
      }
      const result = evaluateCalculatorExpression(c.display);
      c.hist = c.display + ' =';
      c.display = result;
      c.raw = '';
      return calcPaint();
    }
    c.raw += key;
    if (c.display === '0' && /[0-9]/.test(key)) c.display = key;
    else if (c.display === 'Error') c.display = /[0-9]/.test(key) ? key : '0';
    else c.display += key;
    calcPaint();
  }
  function calcPaint() {
    const d = $('#calc-disp'), h = $('#calc-hist');
    if (d) d.textContent = S.calc.display;
    if (h) h.innerHTML = esc(S.calc.hist) || '&nbsp;';
  }

  /* ---------- Mind helpers ---------- */
  function stopBreathing() {
    if (S.breathTimer) { clearInterval(S.breathTimer); S.breathTimer = null; }
    S.breathing = false;
  }
  function startBreathing() {
    if (S.breathTimer) clearInterval(S.breathTimer);
    S.breathing = true; S.breathSec = 0;
    S.breathTimer = setInterval(function () {
      const region = $('#breath-region');
      if (!region) { stopBreathing(); return; }
      S.breathSec = (S.breathSec + 1) % 19;
      region.innerHTML = breathRegionHtml();
    }, 1000);
  }
  function refreshChat() {
    const log = $('#chat-log');
    if (!log) return;
    log.innerHTML = chatLogHtml();
    log.scrollTop = log.scrollHeight;
  }
  function sendChat(text) {
    const out = String(text || '').trim();
    if (!out || S.chatBusy) return;
    S.chat.push({ role: 'user', text: out });
    S.chatBusy = true;
    refreshChat();
    setTimeout(function () {
      S.chat.push({ role: 'assistant', text: companionReply(out, S.mood) });
      S.chatBusy = false;
      refreshChat();
    }, 650);
  }
  function refreshVault() {
    setHtml('#vault-list', vaultListHtml());
    setText('#vault-title', 'Encrypted Vault Entries (' + S.journals.length + ')');
  }

  /* ---------- Click actions ---------- */
  /* ---------- Live Bluetooth SOS (Web Bluetooth + Geolocation) ----------
     Protocol the receiving device must expose (GATT peripheral):
       Service        5a4b1360-6c0d-4f7e-9b1a-0000a1b2c3d4
       Characteristic 5a4b1361-6c0d-4f7e-9b1a-0000a1b2c3d4  (write / write-without-response)
     Payload: one UTF-8 JSON line per update, sent in 20-byte chunks, ended by "\n":
       {"t":"SOS","id":"BLE-SOS-xxxx","lat":28.474400,"lon":77.504000,"acc":8,"ts":"ISO-8601"} */
  const SAKHI_SERVICE = '5a4b1360-6c0d-4f7e-9b1a-0000a1b2c3d4';
  const SAKHI_CHAR = '5a4b1361-6c0d-4f7e-9b1a-0000a1b2c3d4';

  function paintLive() { setHtml('#live-region', liveRegionHtml()); }
  function liveLog(msg) {
    S.live.log.unshift(new Date().toLocaleTimeString('en-IN') + ' · ' + msg);
    S.live.log = S.live.log.slice(0, 8);
    paintLive();
  }
  async function liveSend(force) {
    const L = S.live;
    if (L.status !== 'live' || !L.char || !L.coords || L.sending) return;
    if (!force && Date.now() - L.lastSend < 5000) return;
    L.sending = true;
    try {
      const c = L.coords.coords;
      const line = JSON.stringify({ t: 'SOS', id: L.packetId, lat: Number(c.latitude.toFixed(6)), lon: Number(c.longitude.toFixed(6)), acc: Math.round(c.accuracy), ts: new Date(L.coords.timestamp).toISOString() }) + '\n';
      const bytes = new TextEncoder().encode(line);
      for (let i = 0; i < bytes.length; i += 20) {
        const chunk = bytes.slice(i, i + 20);
        if (L.char.properties.writeWithoutResponse && L.char.writeValueWithoutResponse) await L.char.writeValueWithoutResponse(chunk);
        else await L.char.writeValue(chunk);
      }
      L.lastSend = Date.now();
      L.sent++;
      liveLog('Location sent (±' + Math.round(c.accuracy) + ' m)');
    } catch (err) {
      liveLog('Send failed: ' + (err && err.message ? err.message : err));
    } finally {
      L.sending = false;
    }
  }
  function liveStartGps() {
    const L = S.live;
    if (!navigator.geolocation) { liveLog('Geolocation is not available on this device'); return; }
    if (L.watchId !== null) navigator.geolocation.clearWatch(L.watchId);
    L.watchId = navigator.geolocation.watchPosition(function (pos) {
      L.coords = pos;
      paintLive();
      liveSend(false);
    }, function (err) {
      liveLog('Location error: ' + err.message);
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
  }
  function liveStop(reason) {
    const L = S.live;
    if (L.watchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(L.watchId);
    L.watchId = null;
    try { if (L.device && L.device.gatt && L.device.gatt.connected) L.device.gatt.disconnect(); } catch (e) { /* ignore */ }
    L.char = null; L.device = null;
    L.status = reason || 'stopped';
    paintLive();
  }
  function liveStart() {
    const L = S.live;
    if (L.status === 'scanning' || L.status === 'connecting' || L.status === 'live') return;
    L.log = []; L.sent = 0; L.lastSend = 0; L.coords = null; L.deviceName = '';
    L.packetId = 'BLE-SOS-' + Date.now().toString(16).toUpperCase().slice(-6);
    // requestDevice must be called straight from the click (user gesture)
    const request = navigator.bluetooth
      ? navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: [SAKHI_SERVICE] })
      : null;
    S.meshResult = simulateBleMeshRelay('you', SEED_MESH_NODES, 185, 4);
    setHtml('#mesh-map', meshSvgHtml());
    setHtml('#mesh-right', meshRightHtml());
    liveStartGps();
    if (!request) {
      L.status = 'unsupported';
      liveLog('Use Chrome or Edge (Android, Windows, macOS, Linux) over https:// or localhost. iPhone Safari does not support Web Bluetooth.');
      return;
    }
    L.status = 'scanning';
    paintLive();
    request.then(function (device) {
      L.device = device;
      L.deviceName = device.name || 'Unnamed device';
      L.status = 'connecting';
      paintLive();
      device.addEventListener('gattserverdisconnected', function () {
        if (S.live.status === 'live') { S.live.char = null; S.live.status = 'error'; liveLog('Device disconnected'); }
      });
      return device.gatt.connect();
    }).then(function (server) {
      liveLog('Bluetooth connected');
      return server.getPrimaryService(SAKHI_SERVICE).then(function (svc) {
        return svc.getCharacteristic(SAKHI_CHAR);
      }, function () {
        L.status = 'noservice';
        liveLog('No Sakhi SOS service on ' + L.deviceName + ' — pick a device running the Sakhi receiver');
        try { server.disconnect(); } catch (e) { /* ignore */ }
        return null;
      });
    }).then(function (ch) {
      if (!ch) { paintLive(); return; }
      L.char = ch;
      L.status = 'live';
      liveLog('Receiver found — streaming location');
      liveSend(true);
    }).catch(function (err) {
      if (err && err.name === 'NotFoundError') { L.status = 'stopped'; liveLog('No device selected'); }
      else { L.status = 'error'; liveLog('Bluetooth error: ' + (err && err.message ? err.message : err)); }
    });
  }

  const ACTIONS = {
    liveSos: function () { liveStart(); },
    liveStop: function () { liveStop('stopped'); liveLog('Stopped by user'); },
    bodyTab: function (arg) { S.bodyTab = arg; renderView(); },
    safetyTab: function (arg) { S.safetyTab = arg; renderView(); },

    toggleSymptom: function (arg, el) {
      const i = S.selSymptoms.indexOf(arg);
      if (i === -1) S.selSymptoms.push(arg); else S.selSymptoms.splice(i, 1);
      el.classList.toggle('teal-on', i === -1);
      el.setAttribute('aria-pressed', String(i === -1));
    },
    runPcos: function () {
      S.pcosResult = evaluatePcosRisk(S.pcosInput);
      S.pcosAdvice = null;
      setHtml('#pcos-result', pcosResultHtml());
    },
    doctorPrep: function () {
      if (!S.pcosResult) return;
      S.pcosAdvice = buildDoctorPrep(S.pcosResult, cycleAnalysis());
      setHtml('#pcos-result', pcosResultHtml());
    },
    trimester: function (arg) { S.trimester = Number(arg); renderView(); },
    markSelfCheck: function () {
      S.selfCheck = todayIso();
      save('selfCheck');
      setText('#selfcheck-date', 'Last completed: ' + S.selfCheck);
    },

    mood: function (arg) {
      S.mood = arg;
      $$('#mood-row .chip').forEach(function (b) {
        const on = b.getAttribute('data-arg') === arg;
        b.classList.toggle('navy-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      setText('#chat-mood', 'Judgment-free · Mood: ' + arg);
    },
    reflect: function () {
      const t = ($('#journal-textarea').value || '').trim();
      if (!t) { S.journalErr = 'Type a journal thought first if you want a gentle AI reflection.'; setText('#journal-err', S.journalErr); return; }
      S.journalErr = ''; setText('#journal-err', '');
      S.reflection = journalReflection(t, S.mood);
      setHtml('#reflect-region', '<div class="well" style="padding:14px;font-size:14px;color:var(--slate-700);line-height:1.6;white-space:pre-line"><span class="xs teal" style="font-weight:600">Sakhi Reflection</span>' + esc(S.reflection) + '</div>');
    },
    inspectCipher: function (arg) { S.showCipher = S.showCipher === arg ? null : arg; refreshVault(); },
    toggleDecrypt: function (arg) {
      if (S.unlocked[arg]) { delete S.unlocked[arg]; refreshVault(); return; }
      const rec = S.journals.filter(function (r) { return r.id === arg; })[0];
      if (!rec) return;
      decryptVaultText(rec.cipherText, S.pins.realPin).then(function (plain) {
        S.unlocked[arg] = plain; refreshVault();
      }).catch(function () {
        S.journalErr = 'Unable to decrypt entry with active vault PIN.'; setText('#journal-err', S.journalErr);
      });
    },
    breathing: function () {
      if (S.breathing) stopBreathing(); else startBreathing();
      const btn = $('#breath-btn');
      btn.textContent = S.breathing ? 'Stop 4-7-8 Breathing' : 'Start 4-7-8 Breathing';
      btn.classList.toggle('red-bg', S.breathing);
      btn.classList.toggle('navy-bg', !S.breathing);
      setHtml('#breath-region', breathRegionHtml());
    },
    chatPrompt: function (arg) { sendChat(arg); },

    triggerSos: function () {
      if (!S.armed) return;
      const nowIso = new Date().toISOString();
      const finalize = function (coords, label) {
        S.fir = buildFirIncidentPack({ coordinates: coords, locationLabel: label, audioCaptured: S.includeAudio, photoCaptured: S.includePhoto, trustedContacts: S.contacts, timestampIso: nowIso });
        S.cancelMsg = '';
        setHtml('#sos-right', sosRightHtml());
        setText('#sos-msg', '');
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          finalize(pos.coords.latitude.toFixed(4) + '° N, ' + pos.coords.longitude.toFixed(4) + '° E', 'Live GPS Fix');
        }, function () {
          finalize('28.4744° N, 77.5040° E', 'Knowledge Park II Sector (Last Cached Fix)');
        }, { timeout: 1500 });
      } else {
        finalize('28.4744° N, 77.5040° E', 'Knowledge Park II Sector (Cached Fix)');
      }
    },
    downloadFir: function () {
      if (!S.fir) return;
      const blob = new Blob([S.fir.summaryText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = S.fir.referenceId + '.txt';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    },
    removeContact: function (arg) {
      S.contacts.splice(Number(arg), 1);
      save('contacts');
      setHtml('#contacts-region', contactsHtml());
    },
    routeMode: function (arg) { S.routeMode = arg; renderView(); },
    broadcastMesh: function () {
      S.meshResult = simulateBleMeshRelay('you', SEED_MESH_NODES, 185, 4);
      setHtml('#mesh-map', meshSvgHtml());
      setHtml('#mesh-right', meshRightHtml());
    },

    copyDraft: function () {
      if (!S.takedown) return;
      const done = function () {
        S.copied = true; setHtml('#takedown-out', takedownOutHtml());
        setTimeout(function () { S.copied = false; setHtml('#takedown-out', takedownOutHtml()); }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(S.takedown).then(done, done);
      else done();
    },
    runScan: function () { S.scan = evaluateStalkerwareRisk(S.signals); setHtml('#scan-out', scanOutHtml()); },
    enterStealth: function () { setSurface('stealth'); },
    wipeAsk: function () { S.confirmWipe = true; setHtml('#wipe-confirm', wipeConfirmHtml()); },
    wipeNo: function () { S.confirmWipe = false; setHtml('#wipe-confirm', ''); },
    wipeYes: function () { S.confirmWipe = false; panicWipe(); },

    newsCat: function (arg) { S.newsCat = arg; setHtml('#news-region', newsRegionHtml()); },

    wikiOpen: function (arg) {
      S.wikiActive = arg; S.wikiAnswer = '';
      setHtml('#wiki-index', wikiIndexHtml());
      setHtml('#wiki-article', wikiArticleHtml());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    wikiCat: function (arg) {
      S.wikiCat = arg;
      $$('#wiki-cats .chip').forEach(function (b) { b.classList.toggle('navy-on', b.getAttribute('data-arg') === arg); });
      setHtml('#wiki-index', wikiIndexHtml());
    },
    wikiReset: function () {
      S.wikiSearch = ''; S.wikiCat = 'All';
      const inp = $('#wiki-search'); if (inp) inp.value = '';
      $$('#wiki-cats .chip').forEach(function (b) { b.classList.toggle('navy-on', b.getAttribute('data-arg') === 'All'); });
      setHtml('#wiki-index', wikiIndexHtml());
    },

    lockCalc: function () { setSurface('stealth'); }
  };

  document.addEventListener('click', function (e) {
    const t = e.target;
    if (!t || !t.closest) return;

    const key = t.closest('[data-key]');
    if (key) { calcPress(key.getAttribute('data-key')); return; }

    const scrollEl = t.closest('[data-scroll]');
    if (scrollEl) {
      e.preventDefault();
      const target = document.getElementById(scrollEl.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const wikiEl = t.closest('[data-wiki]');
    if (wikiEl) { openWiki(wikiEl.getAttribute('data-wiki')); return; }

    const navEl = t.closest('[data-nav]');
    if (navEl) { setPillar(navEl.getAttribute('data-nav')); return; }

    const actEl = t.closest('[data-action]');
    if (actEl) {
      const fn = ACTIONS[actEl.getAttribute('data-action')];
      if (fn) fn(actEl.getAttribute('data-arg'), actEl);
    }
  });

  /* ---------- Change / input handlers ---------- */
  document.addEventListener('change', function (e) {
    const t = e.target;
    if (!t || !t.getAttribute) return;
    let v;

    if ((v = t.getAttribute('data-pcos'))) { S.pcosInput[v] = t.type === 'checkbox' ? t.checked : t.value; return; }
    if ((v = t.getAttribute('data-pcos-m'))) { S.pcosInput.metabolicMarkers[v] = t.checked; return; }

    if ((v = t.getAttribute('data-bstep'))) {
      const n = Number(v), i = S.checkedSteps.indexOf(n);
      if (t.checked && i === -1) S.checkedSteps.push(n);
      if (!t.checked && i !== -1) S.checkedSteps.splice(i, 1);
      const label = t.closest('.step-check');
      if (label) label.classList.toggle('done', t.checked);
      setText('#selfcheck-btn', 'Mark Monthly Self-Check Completed (' + S.checkedSteps.length + '/5 Steps)');
      return;
    }
    if ((v = t.getAttribute('data-ground'))) {
      const n = Number(v), i = S.grounding.indexOf(n);
      if (t.checked && i === -1) S.grounding.push(n);
      if (!t.checked && i !== -1) S.grounding.splice(i, 1);
      const span = t.nextElementSibling; if (span) span.classList.toggle('line-through', t.checked);
      return;
    }

    if ((v = t.getAttribute('data-sos'))) {
      S[v] = t.checked;
      if (v === 'armed') { const b = $('#sos-trigger'); if (b) b.disabled = !t.checked; }
      return;
    }
    if ((v = t.getAttribute('data-sel'))) {
      S[v] = t.value;
      if (v === 'routeStart' || v === 'routeEnd') setHtml('#route-panel', routePanelHtml());
      return;
    }
    if ((v = t.getAttribute('data-sel-td'))) { S.td[v] = t.value; return; }
    if ((v = t.getAttribute('data-sig'))) { S.signals[v] = t.checked; return; }

    if ((v = t.getAttribute('data-lesson'))) {
      const i = S.lessons.indexOf(v);
      if (t.checked && i === -1) S.lessons.push(v);
      if (!t.checked && i !== -1) S.lessons.splice(i, 1);
      save('lessons');
      const span = t.nextElementSibling; if (span) span.classList.toggle('line-through', t.checked);
      const total = CAREER_SKILL_MODULES.reduce(function (a, m) { return a + m.lessons.length; }, 0);
      setText('#lesson-count', S.lessons.length + '/' + total + ' lessons completed');
    }
  });

  document.addEventListener('input', function (e) {
    const t = e.target;
    if (!t || !t.getAttribute) return;
    const range = t.getAttribute('data-range');
    if (range) {
      S[range] = Number(t.value);
      setText('#weekly-out', '₹' + S.weekly + '/week');
      setText('#weeks-out', S.weeks + ' weeks');
      setHtml('#growth-calc', growthCalcHtml());
      return;
    }
    if (t.id === 'wiki-search') {
      S.wikiSearch = t.value;
      setHtml('#wiki-index', wikiIndexHtml());
    }
  });

  /* ---------- Form submissions ---------- */
  const FORMS = {
    cycle: function () {
      const start = $('#cycle-start-date').value;
      if (!start) { S.cycleErr = 'Please select a period start date.'; renderView(); return; }
      S.cycleErr = '';
      S.cycles.push({
        id: 'cycle-' + Date.now(), startDate: start,
        durationDays: Number($('#cycle-duration').value) || 4,
        flowIntensity: $('#cycle-flow').value,
        symptoms: S.selSymptoms.slice(),
        notes: $('#cycle-notes').value.trim() || undefined
      });
      save('cycles');
      renderView();
    },

    journal: function () {
      const ta = $('#journal-textarea');
      const text = ta.value.trim();
      if (!text) { S.journalErr = 'Write a few words before saving to your encrypted vault.'; setText('#journal-err', S.journalErr); return; }
      S.journalErr = ''; setText('#journal-err', '');
      if (S.encrypting) return;
      S.encrypting = true;
      encryptVaultText(text, S.pins.realPin).then(function (cipherText) {
        const rec = { id: 'j-' + Date.now(), createdAtIso: new Date().toISOString(), mood: S.mood, cipherText: cipherText };
        S.journals.unshift(rec);
        save('journals');
        S.unlocked[rec.id] = text;
        const box = $('#journal-textarea'); if (box) box.value = '';
        refreshVault();
      }).catch(function (err) {
        S.journalErr = (err && err.message) || 'Encryption failed in browser crypto engine.';
        setText('#journal-err', S.journalErr);
      }).then(function () { S.encrypting = false; });
    },

    chat: function () {
      const input = $('#sakhi-chat-input');
      const text = input.value;
      input.value = '';
      sendChat(text);
    },

    cancelSos: function () {
      const input = $('#silent-cancel-pin');
      if (input.value.trim() === S.pins.realPin) {
        S.fir = null; S.armed = false;
        S.cancelMsg = 'Silent SOS cancelled cleanly. Contacts notified of safe status.';
        renderView();
      } else {
        S.cancelMsg = 'PIN did not match — SOS remains active.';
        setText('#sos-msg', S.cancelMsg);
      }
    },

    addContact: function () {
      const input = $('#new-sos-contact');
      const v = input.value.trim();
      if (!v) return;
      S.contacts.push(v);
      save('contacts');
      input.value = '';
      setHtml('#contacts-region', contactsHtml());
    },

    hazard: function () {
      S.hazards.unshift({
        id: 'hr-' + Date.now(), edgeId: S.repEdge, hazardType: S.repType,
        note: $('#hazard-note').value.trim() || 'Anonymous community lighting/safety alert',
        reportedAt: new Date().toISOString()
      });
      save('hazards');
      renderView();
    },

    takedown: function () {
      S.takedown = takedownTemplate(S.td.platform, S.td.type, $('#td-ref').value.trim(), $('#td-context').value.trim());
      S.copied = false;
      setHtml('#takedown-out', takedownOutHtml());
    },

    pins: function () {
      const r = $('#real-pin').value, d = $('#decoy-pin').value, p = $('#panic-pin').value;
      if (r.length < 4 || d.length < 4 || p.length < 4) S.pinMsg = 'All PINs must be at least 4 digits.';
      else if (new Set([r, d, p]).size < 3) S.pinMsg = 'Real, Decoy, and Panic PINs must all be distinct.';
      else {
        S.pins = { realPin: r, decoyPin: d, panicPin: p };
        save('pins');
        renderVaultKeys();
        S.pinMsg = 'Dual PIN & Panic Wipe codes updated.';
      }
      setText('#pin-msg', S.pinMsg);
    },

    wikiAsk: function () {
      const q = $('#wiki-ai-question').value.trim();
      if (!q) return;
      S.wikiAnswer = wikiAnswer(wikiActiveArticle(), q);
      setHtml('#wiki-answer', '<div class="ai-answer">' + esc(S.wikiAnswer) + '</div>');
    },

    decoyNote: function () {
      const title = $('#decoy-title').value.trim(), body = $('#decoy-body').value.trim();
      if (!title || !body) return;
      S.decoyNotes.unshift({ id: 'd-' + Date.now(), title: title, date: 'Today', body: body });
      $('#decoy-title').value = ''; $('#decoy-body').value = '';
      setHtml('#decoy-notes', decoyNotesHtml());
    }
  };

  document.addEventListener('submit', function (e) {
    const form = e.target && e.target.closest ? e.target.closest('[data-form]') : null;
    if (!form) return;
    e.preventDefault();
    const fn = FORMS[form.getAttribute('data-form')];
    if (fn) fn();
  });

  /* Keyboard support for the calculator surface */
  window.addEventListener('keydown', function (e) {
    if (S.surface !== 'stealth') return;
    if (/^[0-9+\-*/.()]$/.test(e.key)) { e.preventDefault(); calcPress(e.key); }
    else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calcPress('='); }
    else if (e.key === 'Backspace') { e.preventDefault(); calcPress('⌫'); }
    else if (e.key === 'Escape') { e.preventDefault(); calcPress('C'); }
  });

  /* ---------- Boot ---------- */
  renderChrome();
  setSurface('real');
})();

/* ---- 5-second splash screen ---- */
(function () {
  var el = document.getElementById('splash');
  if (!el) return;
  var done = false;
  function hide() {
    if (done) return; done = true;
    el.classList.add('out');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 700);
  }
  setTimeout(hide, 5000);
  var skip = document.getElementById('splash-skip');
  if (skip) skip.addEventListener('click', hide);
})();