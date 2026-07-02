let itemCount = 0;

const defaultItems = [
  { desc: 'Website Design & Development', qty: 1, rate: 2500 },
  { desc: 'UI/UX Consultation', qty: 5, rate: 150 },
];

function init() {
  setDefaultDates();
  defaultItems.forEach(item => addItem(item.desc, item.qty, item.rate));
  calculateTotals();
  updatePreview();
  setupEventListeners();
}

function setDefaultDates() {
  const now = new Date();
  const issueDate = now.toISOString().split('T')[0];
  const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  document.getElementById('issueDate').value = issueDate;
  document.getElementById('dueDate').value = dueDate;
  document.getElementById('invoiceNumber').value = 'INV-' + now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(Math.floor(Math.random() * 9000) + 1000);
}

function setupEventListeners() {
  const fields = document.querySelectorAll('input, textarea, select');
  fields.forEach(f => f.addEventListener('input', updatePreview));

  document.getElementById('taxRate').addEventListener('input', calculateTotals);
  document.getElementById('discount').addEventListener('input', calculateTotals);

  document.getElementById('addItemBtn').addEventListener('click', () => addItem('', 1, 0));
  document.getElementById('exportPdfBtn').addEventListener('click', exportPDF);
  document.getElementById('clearBtn').addEventListener('click', clearForm);
  document.getElementById('sampleBtn').addEventListener('click', loadSampleData);
}

function addItem(desc = '', qty = 1, rate = 0) {
  itemCount++;
  const id = `item-${itemCount}`;
  const tbody = document.getElementById('itemsBody');
  const tr = document.createElement('tr');
  tr.id = id;
  tr.innerHTML = `
    <td class="item-desc"><input type="text" class="item-desc-input" value="${escapeHtml(desc)}" placeholder="Description of service/product"></td>
    <td class="item-qty"><input type="number" class="item-qty-input" value="${qty}" min="0" step="1"></td>
    <td class="item-rate"><input type="number" class="item-rate-input" value="${rate}" min="0" step="0.01"></td>
    <td class="item-amount" id="${id}-amount">$0.00</td>
    <td class="item-actions"><button class="btn-remove-item" onclick="removeItem('${id}')" title="Remove item">×</button></td>
  `;
  tbody.appendChild(tr);

  const inputs = tr.querySelectorAll('input');
  inputs.forEach(inp => {
    inp.addEventListener('input', () => {
      calculateItemAmount(id);
      calculateTotals();
      updatePreview();
    });
  });

  calculateItemAmount(id);
  calculateTotals();
  updatePreview();
}

function removeItem(id) {
  const el = document.getElementById(id);
  if (el) {
    el.remove();
    calculateTotals();
    updatePreview();
  }
}

function calculateItemAmount(id) {
  const tr = document.getElementById(id);
  if (!tr) return;
  const qty = parseFloat(tr.querySelector('.item-qty-input').value) || 0;
  const rate = parseFloat(tr.querySelector('.item-rate-input').value) || 0;
  const amount = qty * rate;
  tr.querySelector('.item-amount').textContent = formatCurrency(amount);
  return amount;
}

function calculateTotals() {
  const rows = document.querySelectorAll('#itemsBody tr');
  let subtotal = 0;
  rows.forEach(row => {
    const qty = parseFloat(row.querySelector('.item-qty-input')?.value) || 0;
    const rate = parseFloat(row.querySelector('.item-rate-input')?.value) || 0;
    subtotal += qty * rate;
  });

  const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
  const discount = parseFloat(document.getElementById('discount').value) || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount - discount;

  document.getElementById('subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('taxAmount').textContent = formatCurrency(taxAmount);
  document.getElementById('discountAmount').textContent = formatCurrency(discount);
  document.getElementById('totalAmount').textContent = formatCurrency(total);

  return { subtotal, taxRate, taxAmount, discount, total };
}

function getFormData() {
  const data = {
    companyName: document.getElementById('companyName').value || 'Your Company Name',
    companyEmail: document.getElementById('companyEmail').value || '',
    companyPhone: document.getElementById('companyPhone').value || '',
    companyAddress: document.getElementById('companyAddress').value || '',
    clientName: document.getElementById('clientName').value || 'Client Name',
    clientEmail: document.getElementById('clientEmail').value || '',
    clientPhone: document.getElementById('clientPhone').value || '',
    clientAddress: document.getElementById('clientAddress').value || '',
    invoiceNumber: document.getElementById('invoiceNumber').value || 'INV-001',
    issueDate: document.getElementById('issueDate').value || '',
    dueDate: document.getElementById('dueDate').value || '',
    notes: document.getElementById('notes').value || '',
    terms: document.getElementById('terms').value || '',
  };

  const items = [];
  document.querySelectorAll('#itemsBody tr').forEach(row => {
    const desc = row.querySelector('.item-desc-input')?.value || '';
    const qty = parseFloat(row.querySelector('.item-qty-input')?.value) || 0;
    const rate = parseFloat(row.querySelector('.item-rate-input')?.value) || 0;
    if (desc || qty || rate) {
      items.push({ desc, qty, rate, amount: qty * rate });
    }
  });

  const totals = calculateTotals();
  return { ...data, items, ...totals };
}

function updatePreview() {
  const data = getFormData();
  const preview = document.getElementById('invoicePreview');

  if (!data.items.length) {
    preview.innerHTML = `
      <div class="preview-empty">
        <div class="icon">📄</div>
        <h3>No items yet</h3>
        <p>Add line items to your invoice to see a live preview here.</p>
      </div>
    `;
    return;
  }

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d + 'T12:00:00');
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  let itemsHtml = '';
  data.items.forEach(item => {
    itemsHtml += `<tr>
      <td>${escapeHtml(item.desc) || '—'}</td>
      <td>${item.qty}</td>
      <td>${formatCurrency(item.rate)}</td>
      <td>${formatCurrency(item.amount)}</td>
    </tr>`;
  });

  preview.innerHTML = `
    <div class="preview-header">
      <div class="preview-brand">
        <h2>${escapeHtml(data.companyName)}</h2>
        <p>${escapeHtml(data.companyAddress)}<br>
        ${escapeHtml(data.companyEmail)}<br>
        ${escapeHtml(data.companyPhone)}</p>
      </div>
      <div class="preview-invoice-meta">
        <h3>INVOICE</h3>
        <p><span class="meta-label">Invoice #:</span> <span class="meta-value">${escapeHtml(data.invoiceNumber)}</span><br>
        <span class="meta-label">Issue Date:</span> <span class="meta-value">${formatDate(data.issueDate)}</span><br>
        <span class="meta-label">Due Date:</span> <span class="meta-value">${formatDate(data.dueDate)}</span></p>
      </div>
    </div>

    <div class="preview-parties">
      <div class="preview-bill-from">
        <h4>From</h4>
        <div class="name">${escapeHtml(data.companyName)}</div>
        <div class="detail">${escapeHtml(data.companyAddress)}<br>${escapeHtml(data.companyEmail)}<br>${escapeHtml(data.companyPhone)}</div>
      </div>
      <div class="preview-bill-to">
        <h4>Bill To</h4>
        <div class="name">${escapeHtml(data.clientName)}</div>
        <div class="detail">${escapeHtml(data.clientAddress)}<br>${escapeHtml(data.clientEmail)}<br>${escapeHtml(data.clientPhone)}</div>
      </div>
    </div>

    <table class="preview-items-table">
      <thead>
        <tr>
          <th style="text-align:left;width:50%">Description</th>
          <th style="text-align:right">Quantity</th>
          <th style="text-align:right">Rate</th>
          <th style="text-align:right">Amount</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div class="preview-totals">
      <div class="preview-total-row">
        <span class="label">Subtotal</span>
        <span class="amount">${formatCurrency(data.subtotal)}</span>
      </div>
      ${data.taxRate > 0 ? `<div class="preview-total-row">
        <span class="label">Tax (${data.taxRate}%)</span>
        <span class="amount">${formatCurrency(data.taxAmount)}</span>
      </div>` : ''}
      ${data.discount > 0 ? `<div class="preview-total-row">
        <span class="label">Discount</span>
        <span class="amount">-${formatCurrency(data.discount)}</span>
      </div>` : ''}
      <div class="preview-total-row total">
        <span class="label">Total</span>
        <span class="amount">${formatCurrency(data.total)}</span>
      </div>
    </div>

    ${data.notes || data.terms ? `<div class="preview-footer">
      ${data.notes ? `<div><strong>Notes</strong>${escapeHtml(data.notes)}</div>` : ''}
      ${data.terms ? `<div style="margin-top:12px"><strong>Terms & Conditions</strong>${escapeHtml(data.terms)}</div>` : ''}
    </div>` : ''}
  `;
}

function exportPDF() {
  const data = getFormData();
  if (!data.items.length) {
    showToast('Add at least one item before exporting.', false);
    return;
  }

  const btn = document.getElementById('exportPdfBtn');
  btn.disabled = true;
  btn.textContent = 'Generating PDF...';

  const h2c = window.html2canvas;
  const jsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF || null;

  if (!h2c || !jsPDF) {
    btn.disabled = false;
    btn.textContent = '↓ Export PDF';
    showToast('PDF library not loaded. Refresh page.', false);
    return;
  }

  const original = document.getElementById('invoicePreview');
  const clone = original.cloneNode(true);
  clone.style.position = 'fixed';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '794px';
  clone.style.background = '#ffffff';
  clone.style.zIndex = '9999';
  clone.style.pointerEvents = 'none';
  document.body.appendChild(clone);

  setTimeout(() => {
    h2c(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      background: '#ffffff',
      width: clone.scrollWidth,
      height: clone.scrollHeight,
    }).then((canvas) => {
      document.body.removeChild(clone);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const margin = 8;
      const usableW = pdfW - margin * 2;
      const imgH = (canvas.height / canvas.width) * usableW;
      const pageH = pdf.internal.pageSize.getHeight() - margin * 2;

      let heightLeft = imgH;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', margin, margin + position, usableW, imgH);
      heightLeft -= pageH;

      while (heightLeft > 0) {
        position -= pageH;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, margin + position, usableW, imgH);
        heightLeft -= pageH;
      }

      pdf.save(`${data.invoiceNumber || 'invoice'}.pdf`);
      btn.disabled = false;
      btn.textContent = '↓ Export PDF';
      showToast('PDF exported successfully!', true);
    }).catch((err) => {
      console.error('html2canvas error:', err);
      if (clone.parentNode) document.body.removeChild(clone);
      btn.disabled = false;
      btn.textContent = '↓ Export PDF';
      showToast('PDF export failed. Check console.', false);
      alert('PDF Error: ' + err.message);
    });
  }, 400);
}

function clearForm() {
  if (!confirm('Clear all invoice data?')) return;
  document.querySelectorAll('.form-section input, .form-section textarea').forEach(el => {
    if (el.type !== 'button' && el.type !== 'submit') el.value = '';
  });
  document.getElementById('itemsBody').innerHTML = '';
  document.getElementById('taxRate').value = '';
  document.getElementById('discount').value = '';
  setDefaultDates();
  calculateTotals();
  updatePreview();
  showToast('Form cleared.', true);
}

function loadSampleData() {
  document.getElementById('companyName').value = 'Excel Corp';
  document.getElementById('companyEmail').value = 'hello@excelcorp.com';
  document.getElementById('companyPhone').value = '+1 (555) 123-4567';
  document.getElementById('companyAddress').value = '123 Business Ave, Suite 400\nSan Francisco, CA 94105';

  document.getElementById('clientName').value = 'TechStart Inc.';
  document.getElementById('clientEmail').value = 'billing@techstart.io';
  document.getElementById('clientPhone').value = '+1 (555) 987-6543';
  document.getElementById('clientAddress').value = '456 Innovation Drive\nPalo Alto, CA 94301';

  document.getElementById('invoiceNumber').value = 'INV-2026-0721';
  document.getElementById('issueDate').value = '2026-07-01';
  document.getElementById('dueDate').value = '2026-07-31';

  document.getElementById('itemsBody').innerHTML = '';
  itemCount = 0;
  addItem('Website Redesign - Homepage', 1, 3500);
  addItem('Landing Page Development', 3, 1200);
  addItem('SEO Optimization', 1, 800);
  addItem('Hosting Setup & Configuration', 1, 250);

  document.getElementById('taxRate').value = 8.5;
  document.getElementById('discount').value = 200;
  document.getElementById('notes').value = 'Payment is due within 30 days. Thank you for your business!';
  document.getElementById('terms').value = 'All services are provided as described in the proposal. Any additional work will be billed separately.';

  calculateTotals();
  updatePreview();
  showToast('Sample data loaded!', true);
}

function formatCurrency(n) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(msg, success) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast' + (success ? ' success' : '') + ' show';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

document.addEventListener('DOMContentLoaded', init);
