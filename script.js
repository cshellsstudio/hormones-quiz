// ============================================================
// CONFIG — EDIT THESE VALUES
// ============================================================
const CONFIG = {

  // ── TAGS ──────────────────────────────────────────────────
  // Baguhin ang values para tumugma sa GHL tags mo
  tags: {
    // Q2 - Location
    stateFL:          'state-florida',        // <- palitan
    stateAZ:          'state-arizona',        // <- palitan
    stateTX:          'state-texas',          // <- palitan
    disqualified:     'disqualified',         // <- palitan (Q2 Other State)

    // Q3 - Stage
    perimenopausal:   'perimenopausal',       // <- palitan
    menopausal:       'menopausal',           // <- palitan

    // Q4–Q11 - Severity (computed from score)
    severityMild:     'severity-mild',        // <- palitan (score 0–8)
    severityModerate: 'severity-moderate',    // <- palitan (score 9–16)
    severitySevere:   'severity-severe',      // <- palitan (score 17–24)

    // Q12 - Medical History
    criticalHistory:  'critical-history',     // <- palitan

    // Q13 - Current Medications
    q13HrtRx:         'q13-hrt-rx',           // <- palitan (answer B)
    q13Contraceptive: 'q13-contraceptive',    // <- palitan (answer C)
    q13OtcSupplements:'q13-otc-supplements',  // <- palitan (answer D)

    // Q14 - Lab Testing
    q14StandardBlood: 'q14-standard-blood',   // <- palitan (answer B)
    q14Specialized:   'q14-specialized',      // <- palitan (answer C)
    longerConsult:    'longer-consult',       // <- palitan (answer D)

    // Q15 - Lead Scoring
    lowIntent:        'low-intent',           // <- palitan (answer A)
    cold:             'cold',                 // <- palitan (answer B)
    warm:             'warm',                 // <- palitan (answer C)
    hot:              'hot',                  // <- palitan (answer D)
  },

  // ── URLS ──────────────────────────────────────────────────
  // Palitan ng actual URLs pagkatapos mong i-host ang pages
  resultsUrl:      'results.html',      // <- palitan (results.html)
  disqualifiedUrl: 'disqualified.html', // <- palitan (disqualify page)

  // ── GHL ROUND ROBIN CALENDAR ──────────────────────────────
  // Isang calendar lang — GHL ang bahala sa routing per clinician
  calendarUrl: 'https://YOUR_GHL_CALENDAR_LINK',         // <- palitan

  // ── SEVERITY SCORE RANGES (Q4–Q11, max = 24) ─────────────
  severity: {
    mildMax:     8,   // 0–8   = mild
    moderateMax: 16,  // 9–16  = moderate
                      // 17–24 = severe
  }
};

// ============================================================
// PLAN DATA — edit messaging and includes here
// ============================================================
const PLANS = {
  mild: {
    name: 'Essentials',
    price: '$129 / month',
    headline: 'Your hormones are <em>beginning to shift.</em>',
    subheadline: 'Your symptoms suggest early hormonal changes. The good news — this is the ideal time to take action before symptoms progress.',
    info: 'Early hormonal shifts are very manageable with the right support. The Essentials plan gives you expert guidance and ongoing clinician access to help you stay ahead of symptoms.',
    includes: [
      'Personalized symptom assessment',
      'HRT eligibility review',
      'Prescription / refill management',
      'Secure async clinician messaging',
      'Quarterly virtual follow-ups',
    ]
  },
  moderate: {
    name: 'Comprehensive Hormone Optimization',
    price: '$249 / month',
    headline: 'Your symptoms are <em>ready for relief.</em>',
    subheadline: 'Your results indicate moderate hormonal changes affecting your daily comfort. A targeted hormone optimization plan can make a meaningful difference.',
    info: 'Moderate symptoms respond well to bioidentical hormone therapy. The Comprehensive plan gives you monthly care-plan optimization and unlimited clinician access to get your hormones back in balance.',
    includes: [
      'Everything in Essentials',
      'Monthly care-plan optimization',
      'Unlimited clinician messaging',
      'Priority response times',
      'Sleep & mood support',
      'Sexual wellness support',
      'Lifestyle & supplement guidance',
    ]
  },
  severe: {
    name: 'Concierge — Longevity & Hormone Transformation',
    price: '$399 / month',
    headline: 'Your body is asking for <em>serious support.</em>',
    subheadline: 'Your results indicate significant hormonal disruption affecting your daily life. You deserve comprehensive, premium care — not a one-size-fits-all solution.',
    info: 'Severe symptoms require a full-spectrum approach. The Concierge plan combines advanced hormone panels, weekly check-ins, and personalized longevity planning for women who need — and deserve — the best.',
    includes: [
      'Everything in Comprehensive',
      'Weekly care check-ins',
      'Priority clinician access',
      'Advanced hormone panels',
      'Metabolic wellness support',
      'Bone health support',
      'Cognitive longevity support',
      'Personalized longevity planning',
    ]
  }
};

// ============================================================
// QUIZ STATE
// ============================================================
const TOTAL = 15;
let current = 1;

const answers = {
  q1: null, q2: null, q3: null,
  q4: null, q5: null, q6: null, q7: null,
  q8
