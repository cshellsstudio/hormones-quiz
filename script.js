// ============================================================
// CONFIG — EDIT THESE VALUES
// ============================================================
const CONFIG = {

  // ── TAGS ──────────────────────────────────────────────────
  tags: {
    stateFL:          'state-florida',
    stateAZ:          'state-arizona',
    stateTX:          'state-texas',
    disqualified:     'disqualified',

    perimenopausal:   'perimenopausal',
    menopausal:       'menopausal',

    severityMild:     'severity-mild',
    severityModerate: 'severity-moderate',
    severitySevere:   'severity-severe',

    criticalHistory:  'critical-history',

    q13HrtRx:         'q13-hrt-rx',
    q13Contraceptive: 'q13-contraceptive',
    q13OtcSupplements:'q13-otc-supplements',

    q14StandardBlood: 'q14-standard-blood',
    q14Specialized:   'q14-specialized',
    longerConsult:    'longer-consult',

    lowIntent:        'low-intent',
    cold:             'cold',
    warm:             'warm',
    hot:              'hot',
  },

  // ── URLS ──────────────────────────────────────────────────
  resultsUrl:      'https://quiz.rcreshil.online/results.html',
  disqualifiedUrl: 'https://quiz.rcreshil.online/disqualified.html',

  // ── GHL ROUND ROBIN CALENDAR ──────────────────────────────
  calendarUrl: 'https://link.funnelgenie.io/widget/bookings/telehealth-consultation',

  // ── GHL WEBHOOK (receives email + tags before booking) ────
  webhookUrl: 'https://services.leadconnectorhq.com/hooks/uhLI3atfL6jskyRIKRqT/webhook-trigger/8533662f-17a8-4c93-b34c-48dc0aa3426d',

  // ── SEVERITY SCORE RANGES (Q4–Q11, max = 24) ─────────────
  severity: {
    mildMax:     8,
    moderateMax: 16,
  }
};

// ============================================================
// PLAN DATA
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
  const stepEl = document.getElementById('stepLabel');
  if (stepEl) stepEl.textContent = current + ' of ' + TOTAL;
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

function selectChoiceDisqualify(el) {
  el.parentElement.querySelectorAll('.choice').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  saveAnswer();
  setTimeout(() => {
    window.location.href = CONFIG.disqualifiedUrl;
  }, 300);
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
  const stage = (answers.q3 && answers.q3.stage) ? answers.q3.stage : 'perimenopausal';

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
    window.location.href = CONFIG.disqualifiedUrl;
    return;
  }

  if (current >= TOTAL) {
    const result = computeResult();

    // Save to localStorage — results page will read from here (no URL params needed)
    localStorage.setItem('quizResult', JSON.stringify({
      tags:     result.tags,
      stage:    result.stage,
      severity: result.severityLabel,
      score:    result.totalScore,
    }));

    window.location.href = CONFIG.resultsUrl;
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

  // Read from localStorage first, fall back to URL params
  const raw  = localStorage.getItem('quizResult');
  const data = raw ? JSON.parse(raw) : null;
  // Keep quizResult in localStorage until email is submitted

  const p        = new URLSearchParams(window.location.search);
  const tags     = data ? (data.tags || []).join(',') : (p.get('tags')     || '');
  const stage    = data ? (data.stage    || '')        : (p.get('stage')    || '');
  const severity = data ? (data.severity || 'mild')    : (p.get('severity') || 'mild');
  const score    = data ? parseInt(data.score  || '0') : parseInt(p.get('score') || '0');

  // Clean URL if params present
  if (p.has('tags') && window.history && window.history.replaceState) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const plan = PLANS[severity] || PLANS.mild;

  // Build CTA URL
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
// EMAIL CAPTURE (results page)
// ============================================================
function submitEmail() {
  const emailInput = document.getElementById('emailInput');
  const firstNameInput = document.getElementById('firstNameInput');
  const submitBtn = document.getElementById('emailSubmitBtn');
  const emailCard = document.getElementById('emailCard');
  const emailError = document.getElementById('emailError');

  const email = emailInput ? emailInput.value.trim() : '';
  const firstName = firstNameInput ? firstNameInput.value.trim() : '';

  // Basic validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (emailError) { emailError.textContent = 'Please enter a valid email address.'; emailError.style.display = 'block'; }
    return;
  }
  if (emailError) emailError.style.display = 'none';

  // Disable button while submitting
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

  // Read stored result data
  const raw = localStorage.getItem('quizResult');
  console.log('[quiz] raw localStorage:', raw);
  const data = raw ? JSON.parse(raw) : {};
  console.log('[quiz] data.tags:', data.tags);
  localStorage.removeItem('quizResult');

  const payload = {
    email,
    firstName,
    tags:     (data.tags || []).join(","),
    stage:       data.stage    || '',
    severity:    data.severity || '',
    score:       data.score    || 0,
  };
  console.log('[quiz] payload:', JSON.stringify(payload));

  fetch(CONFIG.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  .then(() => {
    // Show success state
    const firstName = firstNameInput ? firstNameInput.value.trim() : '';
    if (emailCard) emailCard.innerHTML = `
      <div style="padding:24px;text-align:center;">
        <div style="width:52px;height:52px;border-radius:50%;background:rgba(74,124,111,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M7 12.5L10.5 16L17 9" stroke="#4a7c6f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <p style="font-family:'Cormorant Garamond',serif;font-size:1.35rem;color:var(--text-dark);margin-bottom:8px;font-weight:400;">You're all set${firstName ? ', ' + firstName : ''}!</p>
        <p style="font-size:0.85rem;color:var(--text-mid);line-height:1.65;margin:0;">Your hormone profile has been saved. Select a time below to meet with your clinician — no charge.</p>
      </div>`;
    // Show the CTA section
    const ctaSection = document.getElementById('ctaSection');
    if (ctaSection) ctaSection.style.display = 'block';
    // Smooth scroll to CTA
    setTimeout(() => { if (ctaSection) ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
  })
  .catch(() => {
    // Webhook failed silently — show the same success state so the user isn't blocked
    const firstName = firstNameInput ? firstNameInput.value.trim() : '';
    if (emailCard) emailCard.innerHTML = `
      <div style="padding:24px;text-align:center;">
        <div style="width:52px;height:52px;border-radius:50%;background:rgba(74,124,111,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M7 12.5L10.5 16L17 9" stroke="#4a7c6f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <p style="font-family:'Cormorant Garamond',serif;font-size:1.35rem;color:var(--text-dark);margin-bottom:8px;font-weight:400;">You're all set${firstName ? ', ' + firstName : ''}!</p>
        <p style="font-size:0.85rem;color:var(--text-mid);line-height:1.65;margin:0;">Your hormone profile has been saved. Select a time below to meet with your clinician — no charge.</p>
      </div>`;
    const ctaSection = document.getElementById('ctaSection');
    if (ctaSection) ctaSection.style.display = 'block';
    setTimeout(() => { if (ctaSection) ctaSection.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
  });
}

// ============================================================
// AUTO INIT
// ============================================================
window.addEventListener('load', () => {
  if (document.getElementById('dotsWrap')) initQuiz();
  if (document.getElementById('results'))  initResults();
});
