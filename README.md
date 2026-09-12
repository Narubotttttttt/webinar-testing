# CAWS PetAdopt - Unified Continuous Flow Web Application

A modern, standalone web application that unifies all instructor prompts into a seamless, continuous user experience:
**Open App -> Login -> Registration -> User Information -> Request Information -> Review -> Submit -> Confirmation**

This application strictly implements the design, accessibility, and form validation standards from the **[RepoHive UXHub](https://uxhub.repohive.com/)** UI/UX Field Guide.

---

## Getting Started

### 1. Development Server
Run the application locally:

```bash
cd unified-app
npm run dev
```

The app runs on `http://localhost:3000`.

### 2. Production Build
```bash
npm run build
npm run preview
```

---

## Continuous Flow Architecture

| Flow Stage | Prompt Item | Features & UXHub Standards Implemented |
| :--- | :--- | :--- |
| **1. Open App** | Welcome & Landing | Brand hero presentation, feature highlights, direct entry points into authentication. |
| **2. Login** | Prompt 1: Auth Form | Top error summary banner (`role="alert"`), explicit labels above inputs, format example placeholders, show/hide password toggle, accessible auto-focus on invalid fields. |
| **3. Registration** | Prompt 1: Auth Form | Single-column vertical layout (`form-layout-best-practices`), password strength guidance, confirmation matching, welfare agreement pledge. |
| **4. User Information** | Prompt 2: Stepper (Stage 1) | Adopter ID badge, verified 11-digit Philippine phone format checking (`09xxxxxxxxx`), structured city/province/barangay/street inputs. |
| **5. Request Information** | Prompt 2: Stepper (Stage 2) | Interactive pet catalog selector with real photos, document upload dropzones (Valid Government ID and Barangay Clearance), residence type segmented chips, other pets details, and adoption reason statement. |
| **6. Review** | Prompt 2: Stepper (Stage 3) | Full consolidated review card with section breakdown and direct "Edit" shortcuts back to earlier stages; adopter commitments agreement checkbox. |
| **7. Submit** | Active Action | Action button with active verb ("Submit Adoption Application"), simulated real-time verification processing. |
| **8. Confirmation** | Prompt 3: Confirmation | Celebratory success badge, unique application reference number (`CAWS-2026-XXXX`), adoption milestone pipeline timeline, and printable application slip. |

---

## RepoHive UXHub Standards Applied

* **Placeholder vs Label (`placeholder-vs-label`):** Never uses placeholders as the only label. All inputs feature permanent labels above the field. Placeholders only provide format examples (e.g., `e.g. adopter@example.com`).
* **Input Field Anatomy (`input-field-anatomy`):** Every field links its label, input, helper text, and inline error message via `aria-describedby` and `aria-invalid`.
* **Accessible Error Handling (`accessible-error-handling`):** Renders an Error Summary Alert at the top on failed submissions and automatically shifts keyboard focus to the first invalid field.
* **Password Field Best Practices (`password-field-best-practices`):** Includes an accessible toggle button with dynamic `aria-label` and `aria-pressed` states.
* **Form Layout Best Practices (`form-layout-best-practices`):** Single-column vertical flow for effortless vertical scanning.
* **Writing Button Labels (`writing-button-labels`):** Uses descriptive active verbs ("Sign In & Continue", "Save & Continue", "Submit Adoption Application").
* **Multi-Step Forms (`multi-step-forms-wizards`):** Persistent stepper progress bar with back-navigation and state retention across all steps.
* **Confirmation Feedback (`success-confirmation-feedback`):** Action-specific confirmation with tracking reference number and clear next steps.
