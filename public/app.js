const initialState = () => ({
  step: 0,
  reportGenerated: false,
  company: {
    name: 'Acme Logistics BV',
    country: 'Netherlands',
    industry: 'Logistics',
    employees: '120',
    revenue: '12M-50M'
  },
  answers: {
    energy: '120000',
    emissionsTracked: 'yes',
    renewable: '28',
    employeesTotal: '120',
    diversity: '36',
    antiCorruption: 'yes',
    riskManagement: 'basic',
    comments: 'We want a guided workflow for our first sustainability report.'
  }
});

let state = initialState();

const steps = ['Company', 'Questionnaire', 'Rules', 'Report'];

const stepsEl = document.getElementById('steps');
const screenEl = document.getElementById('screen');
const summaryPanelEl = document.getElementById('summaryPanel');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');
const progressLabel = document.getElementById('progressLabel');
const progressFill = document.getElementById('progressFill');

function getProgress() {
  const total = Object.values(state.company).filter(Boolean).length + Object.values(state.answers).filter(Boolean).length;
  return Math.min(100, Math.round((total / 13) * 100));
}

function activeRules() {
  const rules = [];
  if (state.company.industry === 'Logistics') {
    rules.push({
      id: 'transport',
      title: 'Transport emissions section required',
      reason: 'Industry = Logistics',
      impact: 'Adds transport and fuel-disclosure prompts to the report.'
    });
  }
  if (Number(state.company.employees) >= 100) {
    rules.push({
      id: 'workforce',
      title: 'Expanded workforce disclosure',
      reason: 'Employees >= 100',
      impact: 'Adds workforce, diversity, and safety summary.'
    });
  }
  if (state.answers.emissionsTracked === 'no') {
    rules.push({
      id: 'gap',
      title: 'Carbon data gap flag',
      reason: 'Emissions tracked = No',
      impact: 'Adds an action-plan note for future carbon accounting.'
    });
  }
  if (state.answers.antiCorruption === 'yes') {
    rules.push({
      id: 'gov',
      title: 'Governance evidence requested',
      reason: 'Anti-corruption policy = Yes',
      impact: 'Governance section is stronger, but still needs supporting policy evidence.'
    });
  }
  return rules;
}

function reportModel() {
  const rules = activeRules();
  const environment = state.answers.emissionsTracked === 'yes'
    ? `The company reports ${state.answers.energy} kWh of energy usage and ${state.answers.renewable}% renewable energy usage.`
    : 'The company does not yet track emissions in a structured way and should begin monthly measurement.';
  return {
    overview: `${state.company.name} is a ${state.company.country}-based ${state.company.industry.toLowerCase()} company with ${state.company.employees} employees and revenue in the ${state.company.revenue} range.`,
    environment,
    social: `The company reports ${state.answers.employeesTotal} employees and ${state.answers.diversity}% diversity representation in the selected metric.`,
    governance: state.answers.antiCorruption === 'yes'
      ? `An anti-corruption policy is indicated. Risk management maturity is ${state.answers.riskManagement}.`
      : 'No anti-corruption policy is currently confirmed.',
    nextStep: rules.some(rule => rule.id === 'gap')
      ? 'Primary next step: define ownership for Scope 1 and Scope 2 data collection.'
      : 'Primary next step: attach evidence and prepare the draft for internal review.'
  };
}

function renderSteps() {
  stepsEl.innerHTML = steps.map((step, index) => `
    <button class="step-btn ${state.step === index ? 'active' : ''}" data-step="${index}">
      <span class="step-mini">Step ${index + 1}</span>
      <strong>${step}</strong>
    </button>
  `).join('');

  document.querySelectorAll('[data-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.step = Number(btn.dataset.step);
      render();
    });
  });
}

function formCompany() {
  return `
    <h3>Company setup</h3>
    <p class="muted">These inputs determine which questions and disclosures appear later.</p>
    <div class="form-grid">
      <label>Company name
        <input data-group="company" data-field="name" value="${state.company.name}" />
      </label>
      <label>Country
        <input data-group="company" data-field="country" value="${state.company.country}" />
      </label>
      <label>Industry
        <select data-group="company" data-field="industry">
          ${['Logistics', 'Manufacturing', 'Retail', 'Software'].map(v => `<option ${state.company.industry === v ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
      </label>
      <label>Employees
        <input data-group="company" data-field="employees" value="${state.company.employees}" />
      </label>
      <label class="full">Revenue range
        <select data-group="company" data-field="revenue">
          ${['0-2M', '2M-12M', '12M-50M', '50M+'].map(v => `<option ${state.company.revenue === v ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
      </label>
    </div>
  `;
}

function formQuestionnaire() {
  return `
    <h3>ESG questionnaire</h3>
    <p class="muted">A short collection flow that you can expand later with uploads and evidence requests.</p>
    <div class="form-grid">
      <label>Energy consumption (kWh)
        <input data-group="answers" data-field="energy" value="${state.answers.energy}" />
      </label>
      <label>Emissions tracked?
        <select data-group="answers" data-field="emissionsTracked">
          <option value="yes" ${state.answers.emissionsTracked === 'yes' ? 'selected' : ''}>Yes</option>
          <option value="no" ${state.answers.emissionsTracked === 'no' ? 'selected' : ''}>No</option>
        </select>
      </label>
      <label>Renewable energy (%)
        <input data-group="answers" data-field="renewable" value="${state.answers.renewable}" />
      </label>
      <label>Total employees
        <input data-group="answers" data-field="employeesTotal" value="${state.answers.employeesTotal}" />
      </label>
      <label>Diversity metric (%)
        <input data-group="answers" data-field="diversity" value="${state.answers.diversity}" />
      </label>
      <label>Anti-corruption policy
        <select data-group="answers" data-field="antiCorruption">
          <option value="yes" ${state.answers.antiCorruption === 'yes' ? 'selected' : ''}>Yes</option>
          <option value="no" ${state.answers.antiCorruption === 'no' ? 'selected' : ''}>No</option>
        </select>
      </label>
      <label>Risk management maturity
        <select data-group="answers" data-field="riskManagement">
          <option value="basic" ${state.answers.riskManagement === 'basic' ? 'selected' : ''}>Basic</option>
          <option value="developing" ${state.answers.riskManagement === 'developing' ? 'selected' : ''}>Developing</option>
          <option value="advanced" ${state.answers.riskManagement === 'advanced' ? 'selected' : ''}>Advanced</option>
        </select>
      </label>
      <label class="full">Customer note
        <textarea data-group="answers" data-field="comments">${state.answers.comments}</textarea>
      </label>
    </div>
  `;
}

function formRules() {
  const rules = activeRules();
  return `
    <h3>Rule evaluation</h3>
    <p class="muted">A simple view that makes the compliance logic visible during a demo conversation.</p>
    <div class="stack">
      ${rules.length ? rules.map(rule => `
        <div class="rule">
          <div class="rule-header">
            <div>
              <strong>${rule.title}</strong>
              <p class="muted"><strong>Reason:</strong> ${rule.reason}</p>
              <p>${rule.impact}</p>
            </div>
            <span class="badge">Active</span>
          </div>
        </div>
      `).join('') : `<div class="info-box">No rules triggered for this company profile.</div>`}
      <div class="info-box">
        <strong>Suggested storage model</strong>
        <p class="muted">Questions in a database, rules in JSON or tables, and evaluation logic in the backend service layer.</p>
      </div>
    </div>
  `;
}

function formReport() {
  const report = reportModel();
  return `
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:start;">
      <div>
        <h3>Generated report</h3>
        <p class="muted">This turns the collected inputs into a first-pass sustainability narrative.</p>
      </div>
      <button id="generateBtn" class="button primary">Generate report</button>
    </div>
    ${state.reportGenerated ? `
      <div class="stack">
        <div class="report-section"><strong>Company overview</strong><p>${report.overview}</p></div>
        <div class="report-section"><strong>Environment</strong><p>${report.environment}</p></div>
        <div class="report-section"><strong>Social</strong><p>${report.social}</p></div>
        <div class="report-section"><strong>Governance</strong><p>${report.governance}</p></div>
        <div class="report-section"><strong>Next step</strong><p>${report.nextStep}</p></div>
      </div>
    ` : `<div class="info-box">Click <strong>Generate report</strong> to show a drafted output.</div>`}
  `;
}

function renderScreen() {
  if (state.step === 0) screenEl.innerHTML = formCompany();
  if (state.step === 1) screenEl.innerHTML = formQuestionnaire();
  if (state.step === 2) screenEl.innerHTML = formRules();
  if (state.step === 3) screenEl.innerHTML = formReport();

  document.querySelectorAll('input[data-field], select[data-field], textarea[data-field]').forEach(el => {
    const handler = event => {
      const group = event.target.dataset.group;
      const field = event.target.dataset.field;
      state[group][field] = event.target.value;
      render();
    };
    el.addEventListener('input', handler);
    el.addEventListener('change', handler);
  });

  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      state.reportGenerated = true;
      render();
    });
  }
}

function renderSummary() {
  const rules = activeRules();
  summaryPanelEl.innerHTML = `
    <div class="info-box">
      <strong>Company</strong>
      <p class="muted">${state.company.name} · ${state.company.industry} · ${state.company.employees} employees</p>
    </div>
    <div class="info-box">
      <strong>Rule count</strong>
      <p class="muted">${rules.length} rule(s) currently active</p>
    </div>
    <div class="info-box">
      <strong>Architecture hint</strong>
      <p class="muted">Frontend form → backend rules engine → generated report output.</p>
      <p class="codeish">DB: companies, questions, answers, reports</p>
      <p class="codeish">Rules: JSON or versioned tables</p>
    </div>
  `;
}

function renderProgress() {
  const progress = getProgress();
  progressLabel.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;
}

function renderButtons() {
  backBtn.disabled = state.step === 0;
  nextBtn.disabled = state.step === steps.length - 1;
}

function render() {
  renderSteps();
  renderScreen();
  renderSummary();
  renderProgress();
  renderButtons();
}

backBtn.addEventListener('click', () => {
  state.step = Math.max(0, state.step - 1);
  render();
});

nextBtn.addEventListener('click', () => {
  state.step = Math.min(steps.length - 1, state.step + 1);
  render();
});

resetBtn.addEventListener('click', () => {
  state = initialState();
  render();
});

render();
