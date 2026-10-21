/**
 * CA Ashok Aghav & Co. (Chartered Accountants)
 * Interactive Client-Side Logic & Tax Computational Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initTaxCalculator();
  initDocumentChecklists();
  initMobileMenu();
  setupCopyrightYear();
});

/* ==========================================================================
   1. Live Office Hours & Status (Real-time awareness)
   ========================================================================== */
function initOfficeStatus() {
  const badge = document.getElementById('liveStatusBadge');
  const text = document.getElementById('liveStatusText');
  if (!badge || !text) return;

  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeVal = hour + (minute / 60);

  // Office schedule: Mon (1) to Sat (6), 10:00 AM to 6:00 PM (18:00)
  if (day === 0) {
    // Sunday
    badge.style.background = 'rgba(239, 68, 68, 0.15)';
    badge.style.borderColor = 'rgba(239, 68, 68, 0.35)';
    badge.style.color = '#ef4444';
    text.textContent = 'Closed Today (Sunday) · Opens 10:00 AM Mon';
  } else if (timeVal >= 10 && timeVal < 17) {
    // Open normal hours
    text.textContent = 'Open Today: 10:00 AM – 6:00 PM';
  } else if (timeVal >= 17 && timeVal < 18) {
    // Closes soon
    badge.style.background = 'rgba(245, 158, 11, 0.15)';
    badge.style.borderColor = 'rgba(245, 158, 11, 0.35)';
    badge.style.color = '#f59e0b';
    text.textContent = 'Closes Soon · Closes at 6:00 PM';
  } else {
    // Before 10 AM or after 6 PM on Mon-Sat
    const nextDay = day === 6 ? 'Monday' : 'tomorrow';
    badge.style.background = 'rgba(148, 163, 184, 0.15)';
    badge.style.borderColor = 'rgba(148, 163, 184, 0.35)';
    badge.style.color = '#cbd5e1';
    text.textContent = `Office Closed · Opens 10:00 AM ${nextDay}`;
  }
}

/* ==========================================================================
   2. Comprehensive Income Tax Calculator (Old vs New Regime)
   ========================================================================== */
function initTaxCalculator() {
  const incomeInput = document.getElementById('annualIncome');
  const ded80CInput = document.getElementById('deduction80C');
  const ded80DInput = document.getElementById('deduction80D');
  const hraLoanInput = document.getElementById('hraHomeLoan');
  const calcBtn = document.getElementById('calculateTaxBtn');

  if (!incomeInput) return;

  const runCalculation = () => {
    const grossIncome = Math.max(0, parseFloat(incomeInput.value) || 0);
    const ded80C = Math.min(150000, Math.max(0, parseFloat(ded80CInput.value) || 0));
    const ded80D = Math.max(0, parseFloat(ded80DInput.value) || 0);
    const hraLoan = Math.max(0, parseFloat(hraLoanInput.value) || 0);

    // --- NEW REGIME COMPUTATION ---
    // Standard deduction under New Regime is ₹75,000 (updated budget)
    const newStdDeduction = 75000;
    const newTaxableIncome = Math.max(0, grossIncome - newStdDeduction);
    let newBaseTax = 0;

    // Slabs for New Regime:
    // 0 - 3,00,000 : Nil
    // 3,00,001 - 7,00,000 : 5%
    // 7,00,001 - 10,00,000 : 10%
    // 10,00,001 - 12,00,000 : 15%
    // 12,00,001 - 15,00,000 : 20%
    // Above 15,00,000 : 30%

    if (newTaxableIncome > 1500000) {
      newBaseTax += (newTaxableIncome - 1500000) * 0.30;
      newBaseTax += 300000 * 0.20; // 12-15L
      newBaseTax += 200000 * 0.15; // 10-12L
      newBaseTax += 300000 * 0.10; // 7-10L
      newBaseTax += 400000 * 0.05; // 3-7L
    } else if (newTaxableIncome > 1200000) {
      newBaseTax += (newTaxableIncome - 1200000) * 0.20;
      newBaseTax += 200000 * 0.15;
      newBaseTax += 300000 * 0.10;
      newBaseTax += 400000 * 0.05;
    } else if (newTaxableIncome > 1000000) {
      newBaseTax += (newTaxableIncome - 1000000) * 0.15;
      newBaseTax += 300000 * 0.10;
      newBaseTax += 400000 * 0.05;
    } else if (newTaxableIncome > 700000) {
      newBaseTax += (newTaxableIncome - 700000) * 0.10;
      newBaseTax += 400000 * 0.05;
    } else if (newTaxableIncome > 300000) {
      newBaseTax += (newTaxableIncome - 300000) * 0.05;
    }

    // Section 87A rebate: If taxable income <= ₹7,00,000, tax liability is NIL
    if (newTaxableIncome <= 700000) {
      newBaseTax = 0;
    }

    const newCess = newBaseTax * 0.04;
    const newTotalTax = Math.round(newBaseTax + newCess);

    // --- OLD REGIME COMPUTATION ---
    const oldStdDeduction = 50000;
    const totalOldDeductions = oldStdDeduction + ded80C + ded80D + hraLoan;
    const oldTaxableIncome = Math.max(0, grossIncome - totalOldDeductions);
    let oldBaseTax = 0;

    // Slabs for Old Regime:
    // 0 - 2,50,000 : Nil
    // 2,50,001 - 5,00,000 : 5%
    // 5,00,001 - 10,00,000 : 20%
    // Above 10,00,000 : 30%

    if (oldTaxableIncome > 1000000) {
      oldBaseTax += (oldTaxableIncome - 1000000) * 0.30;
      oldBaseTax += 500000 * 0.20; // 5-10L
      oldBaseTax += 250000 * 0.05; // 2.5-5L
    } else if (oldTaxableIncome > 500000) {
      oldBaseTax += (oldTaxableIncome - 500000) * 0.20;
      oldBaseTax += 250000 * 0.05;
    } else if (oldTaxableIncome > 250000) {
      oldBaseTax += (oldTaxableIncome - 250000) * 0.05;
    }

    // Section 87A rebate: If taxable income <= ₹5,00,000, tax liability is NIL
    if (oldTaxableIncome <= 500000) {
      oldBaseTax = 0;
    }

    const oldCess = oldBaseTax * 0.04;
    const oldTotalTax = Math.round(oldBaseTax + oldCess);

    // Format & update DOM
    const formatINR = (val) => '₹' + Math.round(val).toLocaleString('en-IN');

    document.getElementById('newTaxable').textContent = formatINR(newTaxableIncome);
    document.getElementById('newCess').textContent = formatINR(newCess);
    document.getElementById('newTotalTax').textContent = formatINR(newTotalTax);

    document.getElementById('oldTaxable').textContent = formatINR(oldTaxableIncome);
    document.getElementById('oldTotalDeductions').textContent = formatINR(totalOldDeductions);
    document.getElementById('oldTotalTax').textContent = formatINR(oldTotalTax);

    // Highlight recommendation
    const newCard = document.getElementById('newRegimeCard');
    const oldCard = document.getElementById('oldRegimeCard');
    const newTag = document.getElementById('newRegimeTag');
    const oldTag = document.getElementById('oldRegimeTag');
    const recBox = document.getElementById('recommendationBox');
    const recTitle = document.getElementById('recTitle');
    const recDesc = document.getElementById('recDesc');

    if (newTotalTax < oldTotalTax) {
      const diff = oldTotalTax - newTotalTax;
      newCard.classList.add('winner');
      oldCard.classList.remove('winner');
      newTag.textContent = '★ Best Option for You';
      oldTag.textContent = 'Higher Tax';
      recTitle.textContent = `New Regime Saves You ${formatINR(diff)}!`;
      recDesc.textContent = `With current deductions, opting for the New Tax Regime is more beneficial. We will verify your final AIS/TIS to ensure no exemptions are missed.`;
      recBox.style.backgroundColor = '#ecfdf5';
      recBox.style.borderColor = '#10b981';
      recTitle.style.color = '#065f46';
      recDesc.style.color = '#047857';
    } else if (oldTotalTax < newTotalTax) {
      const diff = newTotalTax - oldTotalTax;
      oldCard.classList.add('winner');
      newCard.classList.remove('winner');
      oldTag.textContent = '★ Best Option for You';
      newTag.textContent = 'Higher Tax';
      recTitle.textContent = `Old Regime Saves You ${formatINR(diff)}!`;
      recDesc.textContent = `Thanks to high 80C, 80D, and HRA/Home loan exemptions, the Old Regime saves you substantial money.`;
      recBox.style.backgroundColor = '#fffbeb';
      recBox.style.borderColor = '#c99e32';
      recTitle.style.color = '#855d0a';
      recDesc.style.color = '#78350f';
    } else {
      newCard.classList.remove('winner');
      oldCard.classList.remove('winner');
      newTag.textContent = 'Equal Tax';
      oldTag.textContent = 'Equal Tax';
      recTitle.textContent = `Both Regimes Result in the Same Tax!`;
      recDesc.textContent = `Both options result in ₹${newTotalTax.toLocaleString('en-IN')} tax. New regime has fewer compliance requirements.`;
      recBox.style.backgroundColor = '#f1f5f9';
      recBox.style.borderColor = '#cbd5e1';
      recTitle.style.color = '#1e293b';
      recDesc.style.color = '#475569';
    }
  };

  // Attach live listeners
  [incomeInput, ded80CInput, ded80DInput, hraLoanInput].forEach(inp => {
    inp.addEventListener('input', runCalculation);
  });
  if (calcBtn) calcBtn.addEventListener('click', runCalculation);

  // Initial calculation run
  runCalculation();
}

/* ==========================================================================
   3. Interactive Document Checklist Wizard
   ========================================================================== */
const checklistData = {
  salaried: [
    { title: "Form 16 (Part A & B)", sub: "Issued by your employer showing total salary and TDS deducted." },
    { title: "Annual Information Statement (AIS / TIS)", sub: "We can help you download this directly from the IT portal." },
    { title: "All Bank Account Statements / Interest Certificates", sub: "Savings interest and fixed deposit TDS certificates (Form 16A)." },
    { title: "Investment & Exemption Proofs", sub: "PPF, LIC receipts, Sukanya Samriddhi, ELSS statement, tuition fees receipts." },
    { title: "Health Insurance Receipts (Sec 80D)", sub: "Mediclaim policy receipts for self, spouse, children, and senior parents." },
    { title: "Rent Receipts / Home Loan Interest Certificate", sub: "Interest & principal repayment certificate issued by lending bank." }
  ],
  business: [
    { title: "Books of Accounts / Sales & Purchase Ledgers", sub: "Summary of gross business turnover and expenses during the financial year." },
    { title: "GST Returns (GSTR-1 & GSTR-3B copies)", sub: "Total turnover reported under GST to ensure zero revenue discrepancy." },
    { title: "Current & Savings Bank Statements", sub: "Complete financial year statement in Excel or PDF format." },
    { title: "TDS Credit (Form 26AS)", sub: "TDS deducted by clients under Section 194C, 194J, or 194H." },
    { title: "Asset Purchase & Depreciation Invoices", sub: "Invoices for office equipment, machinery, laptops, or commercial vehicles." },
    { title: "Unsecured Loans & Interest Details", sub: "Statements for business loans, partner borrowings, and working capital limits." }
  ],
  capitalgains: [
    { title: "Capital Gains Tax Statement from Broker", sub: "Zerodha, Groww, AngelOne, Upstox, or ICICI Direct capital gains report." },
    { title: "Mutual Fund Capital Gain Statement", sub: "CAMS or KFintech consolidated capital gain summary (LTCG / STCG)." },
    { title: "Property Sale / Purchase Deeds", sub: "Registered index II, registry papers, brokerage bills, and construction bills." },
    { title: "Crypto / Virtual Digital Asset Statement", sub: "CoinDCX, WazirX, or international exchange transaction reports." },
    { title: "Foreign ESOP / RSU Vested Records", sub: "Form 67 and foreign tax deduction proofs for US tech stocks." },
    { title: "Section 54 / 54EC Exemption Receipts", sub: "Capital gain exemption bond receipts (REC, NHAI) or new home deed." }
  ],
  gst: [
    { title: "PAN Card of Proprietor / Entity", sub: "Mandatory primary identification document." },
    { title: "Aadhaar Card with Mobile Linked", sub: "Needed for instant biometric / OTP e-sign authentication." },
    { title: "Proof of Business Place (Electricity Bill / Rent Agreement)", sub: "Latest utility bill within 2 months and NOC from property owner." },
    { title: "Cancelled Cheque or Bank Passbook", sub: "Showing account holder name, account number, and IFSC code." },
    { title: "Shop Act License / Gumasta (If available)", sub: "Municipal corporation trade registration or Udyam MSME certificate." },
    { title: "Passport Size Photograph", sub: "High resolution digital portrait photo of applicant / partners." }
  ]
};

function initDocumentChecklists() {
  switchDocList('salaried', document.querySelector('.doc-tab'));
}

function switchDocList(type, tabEl) {
  const tabs = document.querySelectorAll('.doc-tab');
  tabs.forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');

  const container = document.getElementById('docListContainer');
  if (!container) return;

  const items = checklistData[type] || checklistData.salaried;
  container.innerHTML = items.map(item => `
    <div class="doc-check-item">
      <span class="doc-check-icon">✓</span>
      <div>
        <strong>${item.title}</strong>
        <span>${item.sub}</span>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   6. FAQ Accordion Logic
   ========================================================================== */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all others for neat experience
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));

  if (!isOpen) {
    item.classList.add('open');
  }
}

/* ==========================================================================
   7. Modal Booking & Contact Form Handlers
   ========================================================================== */
function openBookingModal(serviceName) {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (serviceName) {
    const sel = document.getElementById('modalService');
    if (sel) {
      for (let i = 0; i < sel.options.length; i++) {
        if (sel.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) || sel.options[i].value.includes(serviceName)) {
          sel.selectedIndex = i;
          break;
        }
      }
    }
  }
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOnOverlay(e) {
  if (e.target.id === 'bookingModal') {
    closeBookingModal();
  }
}

// Modal Form Submit -> Open direct WhatsApp with pre-filled message
function handleModalSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('modalName').value.trim();
  const phone = document.getElementById('modalPhone').value.trim();
  const service = document.getElementById('modalService').value;
  const mode = document.getElementById('modalMode').value;
  const time = document.getElementById('modalTime').value;
  const notes = document.getElementById('modalNotes').value.trim();

  const lines = [
    'Hello CA Ashok Aghav Sir,',
    '',
    'I would like to schedule a consultation with your firm. Here are my details:',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service Required: ${service}`,
    `Consultation Mode: ${mode}`,
    `Preferred Time Slot: ${time}`
  ];

  if (notes) {
    lines.push(`Query / Details: ${notes}`);
  }

  lines.push('');
  lines.push('Please let me know your availability.');
  lines.push('Thank you.');

  const fullMsg = lines.join('\n');
  const waUrl = `https://wa.me/917798775647?text=${encodeURIComponent(fullMsg)}`;

  closeBookingModal();
  window.open(waUrl, '_blank');
}

// Page Contact Form Submit
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phoneNum').value.trim();
  const service = document.getElementById('serviceType').value;
  const mode = document.getElementById('preferredMode').value;
  const date = document.getElementById('preferredDate').value;
  const details = document.getElementById('clientMessage').value.trim();

  const formEl = document.getElementById('contactInquiryForm');
  const successBox = document.getElementById('formSuccessMessage');
  const directLink = document.getElementById('directWaSuccessLink');

  const lines = [
    'Hello CA Ashok Aghav Sir,',
    '',
    'I would like to schedule a consultation with your firm. Here are my details:',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service Required: ${service}`,
    `Preferred Mode: ${mode}`,
    `Preferred Date: ${date || 'Flexible / Earliest available'}`
  ];

  if (details) {
    lines.push(`Query / Details: ${details}`);
  }

  lines.push('');
  lines.push('Looking forward to your response.');
  lines.push('Thank you.');

  const fullMsg = lines.join('\n');
  const waUrl = `https://wa.me/917798775647?text=${encodeURIComponent(fullMsg)}`;

  if (directLink) directLink.href = waUrl;
  if (formEl) formEl.style.display = 'none';
  if (successBox) successBox.style.display = 'block';

  // Open WhatsApp in new tab automatically
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 400);
}

/* ==========================================================================
   8. Mobile Navigation Toggle
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.remove('open');
}

/* ==========================================================================
   9. Footer Year
   ========================================================================== */
function setupCopyrightYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}
