/**
 * CAWS PetAdopt Unified Continuous Flow (Streamlined Demo Edition)
 * Follows RepoHive UXHub (https://uxhub.repohive.com/) UI/UX Field Guide
 * Flow: Open App -> Login -> Registration -> User Information -> Request Information -> Review -> Submit -> Confirmation
 */

// --- 1. Rescued Pet Catalog (3 Essential Pets for Fast Demo) ---
const PETS = [
  {
    id: '1',
    name: 'Milo',
    breed: 'Philippine Native / Aspin',
    age: '1 year, 2 mos',
    gender: 'Male',
    image: '/images/pet-1.jpg',
    tags: ['Vaccinated', 'Neutered', 'Playful'],
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Golden Retriever Mix',
    age: '8 months',
    gender: 'Female',
    image: '/images/pet-2.png',
    tags: ['Vaccinated', 'Gentle', 'Friendly'],
  },
  {
    id: '3',
    name: 'Rocky',
    breed: 'Terrier Cross',
    age: '2 years',
    gender: 'Male',
    image: '/images/pet-3.jpg',
    tags: ['Trained', 'Loyal', 'Healthy'],
  }
];

// --- 2. Central State (Pre-filled with Realistic Demo Defaults) ---
const state = {
  currentStep: 'open', // 'open' | 'login' | 'register' | 'user_info' | 'request_info' | 'review' | 'confirmation'
  theme: localStorage.getItem('caws_theme') || 'light',

  user: {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    adopterId: 'ADP-0842'
  },

  request: {
    selectedPetId: '1',
    idType: 'Philippine National ID (PhilSys)',
    idAttached: false,
    reason: ''
  },

  submission: {
    refNo: 'CAWS-2026-8942',
    submittedAt: ''
  },

  errors: {},
  pwdVisible: false
};

document.documentElement.setAttribute('data-theme', state.theme);

// --- 3. Stepper Stage Definitions ---
const STEPPER_STAGES = [
  { key: 'auth', label: '1. Account', sub: 'Sign in / Register', steps: ['login', 'register'] },
  { key: 'profile', label: '2. Profile', sub: 'User Information', steps: ['user_info'] },
  { key: 'request', label: '3. Request', sub: 'Pet & Details', steps: ['request_info'] },
  { key: 'review', label: '4. Review', sub: 'Verify Details', steps: ['review'] },
  { key: 'confirmed', label: '5. Done', sub: 'Confirmed', steps: ['confirmation'] }
];

function getActiveStageIndex() {
  if (state.currentStep === 'open') return -1;
  if (state.currentStep === 'login' || state.currentStep === 'register') return 0;
  if (state.currentStep === 'user_info') return 1;
  if (state.currentStep === 'request_info') return 2;
  if (state.currentStep === 'review') return 3;
  if (state.currentStep === 'confirmation') return 4;
  return -1;
}

// --- 4. Navigation & Flow Controls ---
function navigateTo(step) {
  state.currentStep = step;
  state.errors = {};
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    const invalid = document.querySelector('[aria-invalid="true"]');
    if (invalid) {
      invalid.focus();
    } else {
      const firstInput = document.querySelector('.field-input');
      if (firstInput && state.currentStep !== 'open') firstInput.focus();
    }
  }, 60);
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('caws_theme', state.theme);
  document.documentElement.setAttribute('data-theme', state.theme);
  render();
}

// --- 5. Streamlined Validations ---
function validateLogin() {
  const errs = {};
  if (!state.user.email || !state.user.email.trim()) {
    errs.email = 'Enter your email address.';
  } else if (!/\S+@\S+\.\S+/.test(state.user.email.trim())) {
    errs.email = 'Enter a valid email address, like adopter@caws.org.';
  }

  if (!state.user.password || state.user.password.length < 6) {
    errs.password = 'Enter a password with at least 6 characters.';
  }

  state.errors = errs;
  if (Object.keys(errs).length > 0) {
    render();
    focusFirstInvalid();
    return false;
  }
  return true;
}

function validateRegister() {
  const errs = {};
  if (!state.user.fullName || state.user.fullName.trim().length < 2) {
    errs.fullName = 'Enter your full legal name.';
  }
  if (!state.user.email || !/\S+@\S+\.\S+/.test(state.user.email.trim())) {
    errs.email = 'Enter a valid email address.';
  }
  if (!state.user.password || state.user.password.length < 6) {
    errs.password = 'Password must be at least 6 characters.';
  }

  state.errors = errs;
  if (Object.keys(errs).length > 0) {
    render();
    focusFirstInvalid();
    return false;
  }
  return true;
}

function validateUserInfo() {
  const errs = {};
  if (!state.user.fullName || state.user.fullName.trim().length < 2) {
    errs.fullName = 'Enter your full legal name.';
  }
  const cleanPhone = state.user.phone.replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length !== 11 || !cleanPhone.startsWith('09')) {
    errs.phone = 'Enter an 11-digit Philippine phone number starting with 09.';
  }
  if (!state.user.address || state.user.address.trim().length < 3) {
    errs.address = 'Enter your residence address in Cagayan de Oro.';
  }

  state.errors = errs;
  if (Object.keys(errs).length > 0) {
    render();
    focusFirstInvalid();
    return false;
  }
  return true;
}

function validateRequestInfo() {
  const errs = {};
  if (!state.request.selectedPetId) {
    errs.pet = 'Please select a pet to adopt.';
  }
  if (!state.request.idAttached) {
    errs.id = 'Please click to attach your Valid Government ID.';
  }
  if (!state.request.reason || state.request.reason.trim().length < 5) {
    errs.reason = 'Please provide a brief reason for adopting this pet.';
  }

  state.errors = errs;
  if (Object.keys(errs).length > 0) {
    render();
    focusFirstInvalid();
    return false;
  }
  return true;
}

function focusFirstInvalid() {
  setTimeout(() => {
    const el = document.querySelector('[aria-invalid="true"]');
    if (el) el.focus();
  }, 40);
}

// --- 6. UXHub Component Helpers ---
function renderErrorSummary(errors) {
  const keys = Object.keys(errors);
  if (keys.length === 0) return '';
  return `
    <div class="error-summary-banner" role="alert" aria-live="assertive" id="error-summary">
      <svg class="error-summary-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <div class="error-summary-content">
        <p>Please fix the highlighted fields to continue:</p>
        <ul>
          ${keys.map(k => `<li>${errors[k]}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}


function renderField({ id, label, value = '', placeholder = '', helper = '', error = '', type = 'text', required = true, isPassword = false }) {
  const isInvalid = Boolean(error);
  const helpId = `${id}-help`;
  const errId = `${id}-error`;
  const describedBy = [helper ? helpId : '', error ? errId : ''].filter(Boolean).join(' ');

  return `
    <div class="field-group">
      <label for="${id}" class="field-label">
        ${label} ${required ? '<span class="required-star" title="Required">*</span>' : ''}
      </label>
      <div class="input-wrapper">
        <input
          id="${id}"
          name="${id}"
          type="${isPassword ? (state.pwdVisible ? 'text' : 'password') : type}"
          value="${escapeHtml(value)}"
          placeholder="${escapeHtml(placeholder)}"
          ${required ? 'required' : ''}
          aria-required="${required}"
          aria-invalid="${isInvalid ? 'true' : 'false'}"
          ${describedBy ? `aria-describedby="${describedBy}"` : ''}
          class="field-input ${isPassword ? 'with-icon-right' : ''}"
        />
        ${isPassword ? `
          <button
            type="button"
            class="password-toggle-btn"
            id="${id}-toggle"
            aria-label="${state.pwdVisible ? 'Hide password' : 'Show password'}"
            aria-pressed="${state.pwdVisible ? 'true' : 'false'}"
            onclick="window.togglePasswordVisibility()"
          >
            <svg style="width:18px;height:18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${state.pwdVisible
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>'}
            </svg>
          </button>
        ` : ''}
      </div>
      ${helper ? `<p id="${helpId}" class="field-helper">${helper}</p>` : ''}
      ${error ? `
        <p id="${errId}" role="alert" class="field-error">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>${error}</span>
        </p>
      ` : ''}
    </div>
  `;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- 7. Screen Views ---

// Screen 1: Open App
function renderOpenApp() {
  return `
    <div class="app-card hero-screen">
      <div class="card-accent-bar"></div>
      <span class="portal-badge" style="margin-bottom: 16px;">CDO Animal Welfare Society Inc.</span>
      <img src="/images/logo.png" alt="CAWS Logo" style="width:80px;height:80px;border-radius:9999px;margin-bottom:16px;box-shadow:0 0 20px var(--primary-glow);border:2px solid var(--primary-border);" />
      <h2 class="hero-title">Adopt a Companion</h2>
      <p class="hero-desc">A simple, continuous adoption process from account setup to official confirmation.</p>
      
      <div style="width:100%; display:flex; flex-direction:column; gap:12px;">
        <button type="button" class="btn btn-primary btn-block" onclick="window.navigateTo('login')">
          Get Started
        </button>
        <button type="button" class="btn btn-secondary btn-block" onclick="window.navigateTo('register')">
          Create New Account
        </button>
      </div>
    </div>
  `;
}

// Screen 2: Login (Prompt 1: Auth Form)
function renderLogin() {
  return `
    <div class="app-card">
      <div class="card-accent-bar"></div>
      <div class="card-header">
        <span class="portal-badge" style="margin-bottom:8px;">Step 1 of 5 : Login</span>
        <h2>Sign In</h2>
        <p>Access your applicant profile.</p>
      </div>

      ${renderErrorSummary(state.errors)}

      <form id="form_login" onsubmit="event.preventDefault(); window.handleLoginSubmit();" class="form-stack" novalidate>
        ${renderField({
          id: 'login_email',
          label: 'Email Address',
          value: state.user.email,
          placeholder: 'e.g. adopter@caws.org',
          helper: 'Enter your registered email address.',
          error: state.errors.email,
          type: 'email'
        })}

        ${renderField({
          id: 'login_password',
          label: 'Password',
          value: state.user.password,
          placeholder: 'Enter your password',
          helper: 'Minimum 6 characters.',
          error: state.errors.password,
          type: 'password',
          isPassword: true
        })}

        <div class="btn-row">
          <button type="button" class="btn btn-secondary btn-back" onclick="window.navigateTo('open')">
            Back
          </button>
          <button type="submit" class="btn btn-primary">
            Sign In & Continue
          </button>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:0.8rem; padding-top:12px; border-top:1px solid var(--border-color);">
          <span style="color:var(--text-secondary);">New to CAWS?</span>
          <button type="button" class="btn-edit-link" onclick="window.navigateTo('register')">
            Register Account
          </button>
        </div>
      </form>
    </div>
  `;
}

// Screen 3: Registration (Prompt 1: Auth Form)
function renderRegister() {
  return `
    <div class="app-card">
      <div class="card-accent-bar"></div>
      <div class="card-header">
        <span class="portal-badge" style="margin-bottom:8px;">Step 1 of 5 : Register</span>
        <h2>Create Account</h2>
        <p>Quick 3-field registration.</p>
      </div>

      ${renderErrorSummary(state.errors)}

      <form id="form_register" onsubmit="event.preventDefault(); window.handleRegisterSubmit();" class="form-stack" novalidate>
        ${renderField({
          id: 'reg_name',
          label: 'Full Name',
          value: state.user.fullName,
          placeholder: 'e.g. Maria Elena Santos',
          helper: 'Your real full name.',
          error: state.errors.fullName
        })}

        ${renderField({
          id: 'reg_email',
          label: 'Email Address',
          value: state.user.email,
          placeholder: 'e.g. maria@example.com',
          helper: 'Your contact email.',
          error: state.errors.email,
          type: 'email'
        })}

        ${renderField({
          id: 'reg_password',
          label: 'Password',
          value: state.user.password,
          placeholder: 'At least 6 characters',
          helper: 'Minimum 6 characters.',
          error: state.errors.password,
          type: 'password',
          isPassword: true
        })}

        <div class="btn-row">
          <button type="button" class="btn btn-secondary btn-back" onclick="window.navigateTo('login')">
            Back
          </button>
          <button type="submit" class="btn btn-primary">
            Register & Continue
          </button>
        </div>
      </form>
    </div>
  `;
}

// Screen 4: User Information (Prompt 2: Stepper Step 1)
function renderUserInfo() {
  return `
    <div class="app-card wide">
      <div class="card-accent-bar"></div>
      <div class="card-header">
        <span class="portal-badge" style="margin-bottom:8px;">Step 2 of 5 : Profile</span>
        <h2>User Information</h2>
        <p>Basic contact and residence details for verification.</p>
      </div>

      ${renderErrorSummary(state.errors)}

      <form id="form_user_info" onsubmit="event.preventDefault(); window.handleUserInfoSubmit();" class="form-stack" novalidate>
        ${renderField({
          id: 'user_fullName',
          label: 'Full Name',
          value: state.user.fullName,
          placeholder: 'e.g. Maria Elena Santos',
          helper: 'Real name matching your government ID.',
          error: state.errors.fullName
        })}

        ${renderField({
          id: 'user_phone',
          label: 'Mobile Number (11 digits)',
          value: state.user.phone,
          placeholder: '09171234567',
          helper: 'Format: 09XXXXXXXXX',
          error: state.errors.phone,
          type: 'tel',
          maxLength: 11
        })}

        ${renderField({
          id: 'user_address',
          label: 'Residence Address',
          value: state.user.address,
          placeholder: 'e.g. Barangay Nazareth, Cagayan de Oro City',
          helper: 'City and street address.',
          error: state.errors.address
        })}

        <div class="btn-row">
          <button type="button" class="btn btn-secondary btn-back" onclick="window.navigateTo('login')">
            Back
          </button>
          <button type="submit" class="btn btn-primary">
            Continue to Pet Request
          </button>
        </div>
      </form>
    </div>
  `;
}

// Screen 5: Request Information (Prompt 2: Stepper Step 2)
function renderRequestInfo() {
  const selectedPet = PETS.find(p => p.id === state.request.selectedPetId) || PETS[0];

  return `
    <div class="app-card wide">
      <div class="card-accent-bar"></div>
      <div class="card-header">
        <span class="portal-badge" style="margin-bottom:8px;">Step 3 of 5 : Pet Request</span>
        <h2>Request Information</h2>
        <p>Pick a pet and confirm your adoption request.</p>
      </div>

      ${renderErrorSummary(state.errors)}

      <form id="form_request_info" onsubmit="event.preventDefault(); window.handleRequestInfoSubmit();" class="form-stack" novalidate>
        
        <!-- 1. Pick a Pet -->
        <div class="field-group">
          <label class="field-label">Select Companion Pet <span class="required-star">*</span></label>
          <div class="pet-selection-grid" style="grid-template-columns: repeat(3, 1fr);">
            ${PETS.map(pet => {
              const isSelected = pet.id === state.request.selectedPetId;
              return `
                <div class="pet-card-opt ${isSelected ? 'selected' : ''}" onclick="window.selectPet('${pet.id}')">
                  <div class="pet-img-box" style="height:90px;">
                    <img src="${pet.image}" alt="${pet.name}" />
                    ${isSelected ? `
                      <div class="pet-check-badge">
                        <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                    ` : ''}
                  </div>
                  <div class="pet-info-box" style="padding:8px 10px;">
                    <p class="pet-name">${pet.name}</p>
                    <p class="pet-breed-tag">${pet.breed}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <p class="field-helper">Selected: <strong>${selectedPet.name}</strong> (${selectedPet.breed}).</p>
        </div>

        <!-- 2. Simple ID Verification Toggle -->
        <div class="field-group">
          <label class="field-label">Government ID Document <span class="required-star">*</span></label>
          <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:var(--bg-subtle); border:1px solid var(--border-color); border-radius:var(--radius-md);">
            <div>
              <p style="font-size:0.85rem; font-weight:700; color:var(--text-primary);">Philippine National ID (PhilSys)</p>
              <p style="font-size:0.75rem; color:var(--text-secondary);">${state.request.idAttached ? 'Attached & Verified' : 'No ID attached'}</p>
            </div>
            <button type="button" class="btn ${state.request.idAttached ? 'btn-secondary' : 'btn-primary'}" style="padding:6px 14px; font-size:0.75rem;" onclick="window.toggleIdAttach()">
              ${state.request.idAttached ? 'Attached (OK)' : 'Attach ID'}
            </button>
          </div>
          ${state.errors.id ? `<p role="alert" class="field-error">${state.errors.id}</p>` : ''}
        </div>

        <!-- 3. Simple Reason for Adoption -->
        <div class="field-group">
          <label for="req_reason" class="field-label">Reason for Adoption <span class="required-star">*</span></label>
          <textarea
            id="req_reason"
            name="req_reason"
            rows="2"
            required
            aria-required="true"
            aria-invalid="${state.errors.reason ? 'true' : 'false'}"
            placeholder="e.g. Loving family home with a secured yard"
            class="field-input"
          >${escapeHtml(state.request.reason)}</textarea>
          <p class="field-helper">Brief reason why you want to adopt ${selectedPet.name}.</p>
          ${state.errors.reason ? `<p role="alert" class="field-error"><span>${state.errors.reason}</span></p>` : ''}
        </div>

        <div class="btn-row">
          <button type="button" class="btn btn-secondary btn-back" onclick="window.navigateTo('user_info')">
            Back
          </button>
          <button type="submit" class="btn btn-primary">
            Review Application
          </button>
        </div>
      </form>
    </div>
  `;
}

// Screen 6: Review (Prompt 2: Stepper Step 3)
function renderReview() {
  const selectedPet = PETS.find(p => p.id === state.request.selectedPetId) || PETS[0];

  return `
    <div class="app-card wide">
      <div class="card-accent-bar"></div>
      <div class="card-header">
        <span class="portal-badge" style="margin-bottom:8px;">Step 4 of 5 : Review</span>
        <h2>Review Application</h2>
        <p>Verify your details before final submission.</p>
      </div>

      <div class="review-section">
        <div class="review-section-header">
          <span class="review-section-title">Applicant Details</span>
          <button type="button" class="btn-edit-link" onclick="window.navigateTo('user_info')">Edit</button>
        </div>
        <div class="review-grid">
          <div class="review-item"><p>Name</p><p>${state.user.fullName}</p></div>
          <div class="review-item"><p>Email</p><p>${state.user.email}</p></div>
          <div class="review-item"><p>Phone</p><p>${state.user.phone}</p></div>
          <div class="review-item"><p>Address</p><p>${state.user.address}</p></div>
        </div>
      </div>

      <div class="review-section">
        <div class="review-section-header">
          <span class="review-section-title">Adoption Pet & Verification</span>
          <button type="button" class="btn-edit-link" onclick="window.navigateTo('request_info')">Edit</button>
        </div>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
          <img src="${selectedPet.image}" alt="${selectedPet.name}" style="width:50px;height:50px;border-radius:var(--radius-md);object-fit:cover;border:2px solid var(--primary-border);" />
          <div>
            <h4 style="font-size:0.95rem; font-weight:700;">${selectedPet.name} (${selectedPet.breed})</h4>
            <p style="font-size:0.75rem; color:var(--text-secondary);">${selectedPet.gender} • ${selectedPet.age}</p>
          </div>
        </div>
        <div class="review-grid">
          <div class="review-item"><p>Government ID</p><p>PhilSys Verified</p></div>
          <div class="review-item"><p>Adoption Reason</p><p>${state.request.reason}</p></div>
        </div>
      </div>

      <div class="btn-row">
        <button type="button" class="btn btn-secondary btn-back" onclick="window.navigateTo('request_info')">
          Back
        </button>
        <button type="button" class="btn btn-primary" onclick="window.handleFinalSubmit()">
          Submit Adoption Application
        </button>
      </div>
    </div>
  `;
}

// Screen 7 & 8: Confirmation (Prompt 3: Confirmation)
function renderConfirmation() {
  const selectedPet = PETS.find(p => p.id === state.request.selectedPetId) || PETS[0];

  return `
    <div class="app-card wide confirmation-card">
      <div class="card-accent-bar"></div>

      <div class="celebration-icon-wrap">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
      </div>

      <span class="portal-badge" style="background:var(--success-bg); color:var(--success); border-color:var(--success-border);">
        Application Submitted
      </span>

      <h2 style="font-family:var(--font-display); font-size:1.6rem; font-weight:800; margin-top:10px;">
        Adoption Request Confirmed!
      </h2>

      <p style="font-size:0.88rem; color:var(--text-secondary); max-width:480px; margin-top:6px;">
        Thank you, <strong>${state.user.fullName}</strong>! Your application for <strong>${selectedPet.name}</strong> has been logged.
      </p>

      <div class="ref-pill">
        <span>Reference Number:</span>
        <strong style="color:var(--primary); font-family:monospace;">${state.submission.refNo}</strong>
      </div>

      <div class="timeline-box">
        <h3 class="timeline-title">Next Steps</h3>
        <div class="timeline-steps">
          <div class="timeline-step active">
            <div class="timeline-bullet">1</div>
            <div class="timeline-step-content">
              <h5>Screening & Verification</h5>
              <p>Staff reviews your contact details and shelter eligibility.</p>
            </div>
          </div>
          <div class="timeline-step">
            <div class="timeline-bullet">2</div>
            <div class="timeline-step-content">
              <h5>Meet & Handover</h5>
              <p>Meet ${selectedPet.name} at CAWS shelter to complete the adoption.</p>
            </div>
          </div>
        </div>
      </div>

      <button type="button" class="btn btn-primary btn-block" onclick="window.navigateTo('open')">
        Done / Return to Home
      </button>
    </div>
  `;
}

// --- 8. App Shell ---
function render() {
  const app = document.getElementById('app');
  const activeIdx = getActiveStageIndex();

  app.innerHTML = `
    <header class="app-navbar">
      <div class="brand-wrap" onclick="window.navigateTo('open')">
        <img src="/images/logo.png" alt="CAWS Logo" class="brand-logo" />
        <div class="brand-text">
          <h1>CAWS PetAdopt</h1>
          <p>Rescue & Welfare Flow</p>
        </div>
      </div>

      <div class="nav-actions">
        <button type="button" class="btn-icon" title="Toggle Theme" onclick="window.toggleTheme()">
          <svg style="width:18px;height:18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${state.theme === 'dark'
              ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>'
              : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>'}
          </svg>
        </button>

        ${state.currentStep !== 'open' ? `
          <button type="button" class="btn-icon" title="Reset Demo" onclick="window.navigateTo('open')">
            <svg style="width:18px;height:18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        ` : ''}
      </div>
    </header>

    ${activeIdx >= 0 ? `
      <section class="stepper-container" aria-label="Adoption progress">
        <nav class="stepper-nav">
          ${STEPPER_STAGES.map((stage, idx) => {
            const isActive = idx === activeIdx;
            const isCompleted = idx < activeIdx;
            return `
              <div class="step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed clickable' : ''}"
                ${isCompleted ? `onclick="window.navigateTo('${stage.steps[0]}')"` : ''}>
                <div class="step-number">
                  ${isCompleted ? `
                    <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  ` : `${idx + 1}`}
                </div>
                <div class="step-label-group">
                  <span class="step-title">${stage.label}</span>
                  <span class="step-subtitle">${stage.sub}</span>
                </div>
              </div>
              ${idx < STEPPER_STAGES.length - 1 ? `
                <div class="stepper-line ${idx < activeIdx ? 'completed' : ''}"></div>
              ` : ''}
            `;
          }).join('')}
        </nav>
      </section>
    ` : ''}

    <main class="main-content" id="main-content">
      ${(() => {
        switch (state.currentStep) {
          case 'open': return renderOpenApp();
          case 'login': return renderLogin();
          case 'register': return renderRegister();
          case 'user_info': return renderUserInfo();
          case 'request_info': return renderRequestInfo();
          case 'review': return renderReview();
          case 'confirmation': return renderConfirmation();
          default: return renderOpenApp();
        }
      })()}
    </main>

    <footer style="text-align:center; padding:16px; font-size:0.75rem; color:var(--text-muted); border-top:1px solid var(--border-color); background:var(--bg-surface);">
      <p>CAWS CDO Animal Welfare Society Inc. • Unified Continuous Adoption Flow</p>
    </footer>
  `;

  attachInputListeners();
}

function attachInputListeners() {
  const inputs = document.querySelectorAll('.field-input, textarea.field-input');
  inputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const id = e.target.id;
      if (id === 'login_email' || id === 'reg_email') state.user.email = e.target.value;
      if (id === 'login_password' || id === 'reg_password') state.user.password = e.target.value;
      if (id === 'reg_name' || id === 'user_fullName') state.user.fullName = e.target.value;
      if (id === 'user_phone') state.user.phone = e.target.value;
      if (id === 'user_address') state.user.address = e.target.value;
      if (id === 'req_reason') state.request.reason = e.target.value;
    });
  });
}

// --- 9. Global Handlers ---
window.navigateTo = navigateTo;
window.toggleTheme = toggleTheme;

window.togglePasswordVisibility = function() {
  state.pwdVisible = !state.pwdVisible;
  const pwdInput = document.getElementById('login_password') || document.getElementById('reg_password');
  const toggleBtn = document.getElementById('login_password-toggle') || document.getElementById('reg_password-toggle');
  if (pwdInput && toggleBtn) {
    pwdInput.type = state.pwdVisible ? 'text' : 'password';
    toggleBtn.setAttribute('aria-pressed', state.pwdVisible ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', state.pwdVisible ? 'Hide password' : 'Show password');
  }
};

window.handleLoginSubmit = function() {
  const emailEl = document.getElementById('login_email');
  const pwdEl = document.getElementById('login_password');
  if (emailEl) state.user.email = emailEl.value;
  if (pwdEl) state.user.password = pwdEl.value;
  if (validateLogin()) navigateTo('user_info');
};

window.handleRegisterSubmit = function() {
  const nameEl = document.getElementById('reg_name');
  const emailEl = document.getElementById('reg_email');
  const pwdEl = document.getElementById('reg_password');
  if (nameEl) state.user.fullName = nameEl.value;
  if (emailEl) state.user.email = emailEl.value;
  if (pwdEl) state.user.password = pwdEl.value;
  if (validateRegister()) navigateTo('user_info');
};

window.handleUserInfoSubmit = function() {
  const nameEl = document.getElementById('user_fullName');
  const phoneEl = document.getElementById('user_phone');
  const addrEl = document.getElementById('user_address');
  if (nameEl) state.user.fullName = nameEl.value;
  if (phoneEl) state.user.phone = phoneEl.value;
  if (addrEl) state.user.address = addrEl.value;
  if (validateUserInfo()) navigateTo('request_info');
};

window.handleRequestInfoSubmit = function() {
  const reasonEl = document.getElementById('req_reason');
  if (reasonEl) state.request.reason = reasonEl.value;
  if (validateRequestInfo()) navigateTo('review');
};

window.selectPet = function(petId) {
  state.request.selectedPetId = petId;
  delete state.errors.pet;
  render();
};

window.toggleIdAttach = function() {
  state.request.idAttached = !state.request.idAttached;
  delete state.errors.id;
  render();
};

window.handleFinalSubmit = function() {
  state.submission.refNo = `CAWS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  navigateTo('confirmation');
};

render();
