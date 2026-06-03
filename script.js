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
  q8: null, q9: null, q10: null, q11: null,
  q12: [],
  q13: null, q14: null, q15: null,
};

// ============================================================
// QUIZ INIT
// ============================================================
function initQuiz() {
  const dotsWrap = document.getElementById('dotsWrap');
  if (!dotsWrap) return;

  for (let i = 1; i <= TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 1 ? ' active' : '');
    d.id = 'dot' + i;
    dotsWrap.appendChild(d);
  }
  updateUI();
}

// ============================================================
// UI UPDATE
// ============================================================
function updateUI() {
  document.getElementById('stepLabel').textContent = current + ' of ' + TOTAL;
  document.getElementById('progressFill').style.width = (current / TOTAL * 100) + '%';
  document.getElementById('btnBack').style.visibility = current === 1 ? 'hidden' : 'visible';

  const btnContinue = document.getElementById('btnContinue');
  if (current === TOTAL) {
    btnContinue.innerHTML = 'Show Me My Profile <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M13 6L19 12L13 18" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  } else {
    btnContinue.innerHTML = 'Continue <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M13 6L19 12L13 18" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  for (let i = 1; i <= TOTAL; i++) {
    const d = document.getElementById('dot' + i);
    if (d) d.className = 'dot' + (i === current ? ' active' : i < current ? ' done' : '');
  }
  checkContinue();
}

function checkContinue() {
  const slide = document.querySelector('.slide.active');
  const isMulti = slide && slide.dataset.multi === 'true';
  const hasSelection = isMulti
    ? slide && slide.querySelectorAll('.choice.selected').length > 0
    : slide && slide.querySelector('.choice.selected') !== null;
  document.getElementById('btnContinue').classList.toggle('enabled', !!hasSelection);
}

// ============================================================
// SELECTION
// ============================================================
function selectChoice(el) {
  el.parentElement.querySelectorAll('.choice').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  saveAnswer();
  checkContinue();
}

// Immediate redirect for disqualified choices (Q2 Other State)
function selectChoiceDisqualify(el) {
  el.parentElement.querySelectorAll('.choice').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  saveAnswer();
  // Redirect immediately — no need to click Continue
  setTimeout(() => {
    window.top.location.href = CONFIG.disqualifiedUrl;
  }, 300); // small delay so user sees selection
}

function selectMulti(el) {
  const allChoices = el.parentElement.querySelectorAll('.choice');
  if (el.dataset.value === 'none') {
    allChoices.forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
  } else {
    allChoices[0].classList.remove('selected');
    el.classList.toggle('selected');
  }
  saveAnswer();
  checkContinue();
}

// ============================================================
// SAVE ANSWERS
// ============================================================
function saveAnswer() {
  const slide = document.querySelector('.slide.active');
  const slideNum = parseInt(slide.dataset.slide);
  const key = 'q' + slideNum;

  if (slideNum === 12) {
    answers.q12 = [];
    slide.querySelectorAll('.choice.selected').forEach(c => {
      if (c.dataset.tag) answers.q12.push(c.dataset.tag);
    });
    return;
  }

  const el = slide.querySelector('.choice.selected');
  if (!el) return;
  answers[key] = {
    value: el.dataset.value || null,
    tag:   el.dataset.tag   || null,
    stage: el.dataset.stage || null,
    score: el.dataset.score !== undefined ? parseInt(el.dataset.score) : null,
  };
}

// ============================================================
// COMPUTE RESULT
// ============================================================
function computeResult() {
  // Stage from Q3
  const stage = (answers.q3 && answers.q3.stage) ? answers.q3.stage : 'perimenopausal';

  // Severity score from Q4–Q11
  let totalScore = 0;
  for (let i = 4; i <= 11; i++) {
    const a = answers['q' + i];
    if (a && a.score !== null) totalScore += a.score;
  }

  let severityTag, severityLabel;
  if (totalScore <= CONFIG.severity.mildMax) {
    severityTag = CONFIG.tags.severityMild; severityLabel = 'mild';
  } else if (totalScore <= CONFIG.severity.moderateMax) {
    severityTag = CONFIG.tags.severityModerate; severityLabel = 'moderate';
  } else {
    severityTag = CONFIG.tags.severitySevere; severityLabel = 'severe';
  }

  // Collect all tags
  const tags = [];
  if (answers.q2 && answers.q2.tag) tags.push(answers.q2.tag);
  tags.push(stage === 'perimenopausal' ? CONFIG.tags.perimenopausal : CONFIG.tags.menopausal);
  tags.push(severityTag);
  if (answers.q12 && answers.q12.length > 0) answers.q12.forEach(t => { if (!tags.includes(t)) tags.push(t); });
  if (answers.q13 && answers.q13.tag) tags.push(answers.q13.tag);
  if (answers.q14 && answers.q14.tag) tags.push(answers.q14.tag);
  if (answers.q15 && answers.q15.tag) tags.push(answers.q15.tag);

  return { tags, stage, severityLabel, totalScore };
}

// ============================================================
// NAVIGATION
// ============================================================
function goNext() {
  // Q2 disqualify check
  if (current === 2 && answers.q2 && answers.q2.tag === CONFIG.tags.disqualified) {
    window.top.location.href = CONFIG.disqualifiedUrl + '?tag=' + CONFIG.tags.disqualified;
    return;
  }

  if (current >= TOTAL) {
    const result = computeResult();
    const params = new URLSearchParams({
      tags:     result.tags.join(','),
      stage:    result.stage,
      severity: result.severityLabel,
      score:    result.totalScore,
    });
    window.top.location.href = CONFIG.resultsUrl + '?' + params.toString();
    return;
  }

  document.querySelector('.slide.active').classList.remove('active');
  current++;
  document.querySelector('[data-slide="' + current + '"]').classList.add('active');
  updateUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
  if (current <= 1) return;
  document.querySelector('.slide.active').classList.remove('active');
  current--;
  document.querySelector('[data-slide="' + current + '"]').classList.add('active');
  updateUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// RESULTS PAGE RENDER
// ============================================================
function initResults() {
  const resultsEl = document.getElementById('results');
  if (!resultsEl) return;

  // Read from URL params
  const p        = new URLSearchParams(window.location.search);
  const tags     = p.get('tags')     || '';
  const stage    = p.get('stage')    || '';
  const severity = p.get('severity') || 'mild';
  const score    = parseInt(p.get('score') || '0');

  // Clean the URL after reading — no ugly params shown to user
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  const plan     = PLANS[severity] || PLANS.mild;

  // Build CTA URL with quiz data as URL params for GHL calendar pre-fill
  // GHL calendar custom fields needed: quiz_severity, quiz_stage, quiz_score, quiz_tags
  // GHL calendar still needs URL params for custom field pre-fill
  const calendarParams = new URLSearchParams({
    quiz_severity: severity,
    quiz_stage:    stage,
    quiz_score:    score,
    quiz_tags:     tags,
  });
  document.getElementById('ctaBtn').href = CONFIG.calendarUrl + '?' + calendarParams.toString();

  // Render content
  document.getElementById('headline').innerHTML      = plan.headline;
  document.getElementById('subheadline').textContent = plan.subheadline;
  document.getElementById('infoText').textContent    = plan.info;
  document.getElementById('planName').textContent    = plan.name;
  document.getElementById('planPrice').textContent   = plan.price;
  document.getElementById('planIncludes').innerHTML  = plan.includes.map(i => `<li>${i}</li>`).join('');

  const scoreBadge = document.getElementById('scoreBadge');
  scoreBadge.textContent = severity === 'mild' ? 'Mild (0–8)' : severity === 'moderate' ? 'Moderate (9–16)' : 'Significant (17–24)';
  scoreBadge.className   = 'score-badge ' + severity;

  const scoreBar = document.getElementById('scoreBar');
  scoreBar.className = 'score-bar-fill ' + severity;

  document.getElementById('loading').style.display = 'none';
  resultsEl.classList.add('visible');

  setTimeout(() => {
    scoreBar.style.width = Math.min((score / 24) * 100, 100) + '%';
  }, 300);
}



// ============================================================
// DISQUALIFIED PAGE
// ============================================================
function initDisqualified() {
  const page = document.getElementById('disqualified-page');
  if (!page) return;

  // Handle GHL form submit — show thank you message
  // Replace YOUR_GHL_FORM_ID with your actual GHL form ID
  const form = document.getElementById('waitlist-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('waitlist-email').value;
    if (!email) return;

    // Hide form, show thank you
    document.getElementById('form-wrap').style.display = 'none';
    document.getElementById('thankyou-wrap').style.display = 'block';

    // Submit to GHL embedded form via fetch
    // Replace YOUR_GHL_FORM_ACTION with your GHL form endpoint
    fetch('YOUR_GHL_FORM_ACTION', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email: email })
    }).catch(() => {}); // silent fail — thank you message already shown
  });
}

window.addEventListener('load', () => {
  if (document.getElementById('dotsWrap'))        initQuiz();
  if (document.getElementById('results'))         initResults();
  if (document.getElementById('disqualified-page')) initDisqualified();
});
