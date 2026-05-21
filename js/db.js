/* =====================================================
   IMRC - Shared Data Layer & Utilities
   db.js — used by all pages
   ===================================================== */

// ===== DATA LAYER =====
const DB = {
  get(key, def = []) {
    try { return JSON.parse(localStorage.getItem('imrc_' + key)) ?? def; }
    catch { return def; }
  },
  set(key, val) { localStorage.setItem('imrc_' + key, JSON.stringify(val)); },
  getObj(key, def = {}) {
    try { return JSON.parse(localStorage.getItem('imrc_' + key)) ?? def; }
    catch { return def; }
  }
};

// ===== SESSION =====
const Session = {
  get() {
    try { return JSON.parse(localStorage.getItem('imrc_session')); }
    catch { return null; }
  },
  set(user) { localStorage.setItem('imrc_session', JSON.stringify({ id: user.id, username: user.username, role: user.role })); },
  clear() { localStorage.removeItem('imrc_session'); },
  requireLogin() {
    const sess = Session.get();
    if (!sess) { window.location.href = 'login.html'; return null; }
    const users = DB.get('users', []);
    const user = users.find(u => u.id === sess.id);
    if (!user) { Session.clear(); window.location.href = 'login.html'; return null; }
    return user;
  }
};

// ===== COMPANY SETTINGS =====
const Company = {
  get() {
    return DB.getObj('company', {
      name: 'Iqbal Mobile Repairing Center',
      phone: '0317-5825000',
      email: 'iqbalje@gmail.com',
      address: 'Sialkot, Pakistan'
    });
  },
  set(data) { DB.set('company', data); }
};

// ===== TOAST =====
function showToast(msg, type = 'info') {
  let tc = document.getElementById('toast-container');
  if (!tc) { tc = document.createElement('div'); tc.id = 'toast-container'; document.body.appendChild(tc); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { info: 'fa-info-circle', success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-circle' };
  t.innerHTML = `<i class="fas ${icons[type] || 'fa-info-circle'}"></i> ${msg}`;
  tc.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 3200);
}

// ===== CONFIRM MODAL =====
function showConfirm(title, message, onConfirm, type = 'danger') {
  const existing = document.getElementById('confirm-modal-overlay');
  if (existing) existing.remove();
  const colors = { danger: '#f44747', warning: '#ce9178', info: '#007acc' };
  const icons = { danger: '🗑️', warning: '⚠️', info: 'ℹ️' };
  const overlay = document.createElement('div');
  overlay.id = 'confirm-modal-overlay';
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = `
    <div class="modal confirm-modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" onclick="document.getElementById('confirm-modal-overlay').remove()"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">
        <div class="confirm-icon">${icons[type]}</div>
        <p style="color:var(--text-secondary);font-size:13px">${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('confirm-modal-overlay').remove()"><i class="fas fa-times"></i> Cancel</button>
        <button class="btn btn-danger" id="confirm-yes-btn" style="background:${colors[type]}"><i class="fas fa-check"></i> Confirm</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('confirm-yes-btn').onclick = () => {
    overlay.remove();
    onConfirm();
  };
}

// ===== CLOCK =====
function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const el = document.getElementById('status-time');
  if (el) el.innerHTML = `<i class="far fa-clock"></i> ${timeStr}`;
}

// ===== THEME =====
function applyTheme() {
  if (localStorage.getItem('imrc_theme') === 'light') document.body.classList.add('light-theme');
}
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  localStorage.setItem('imrc_theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}

// ===== DATE =====
function todayISO() { return new Date().toISOString().split('T')[0]; }
function formatDate(d) {
  if (!d) return '—';
  const parts = d.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// ===== SLIP GENERATOR =====
function generateSlip() {
  const sales = DB.get('sales', []);
  return 'Iq-' + String(sales.length + 1).padStart(4, '0');
}

// ===== WHATSAPP MESSAGE BUILDER =====
function buildWhatsAppMsg(sale, party, company) {
  const co = company || Company.get();
  const itemLines = sale.items.map(i => `  • ${i.productName} x${i.qty} @ Rs${i.rate} = Rs${i.total.toLocaleString()}`).join('\n');
  let msg = `🏬 *${co.name}*\n`;
  msg += `📞 ${co.phone}\n`;
  msg += `─────────────────\n`;
  msg += `📋 Slip: ${sale.slip}\n`;
  msg += `📅 Date: ${formatDate(sale.date)}\n`;
  msg += `👤 Party: ${party.name}\n`;
  if (sale.createdBy) msg += `🧑‍💼 Bill by: ${sale.createdBy}\n`;
  msg += `─────────────────\n`;
  msg += `*Items:*\n${itemLines}\n`;
  msg += `─────────────────\n`;
  msg += `Bill Total: Rs ${sale.billTotal.toLocaleString()}\n`;
  if (sale.prevBal > 0) msg += `Previous Balance: Rs ${sale.prevBal.toLocaleString()}\n`;
  msg += `*Grand Total: Rs ${sale.grandTotal.toLocaleString()}*\n`;
  const paid = sale.paid || 0;
  const remaining = sale.grandTotal - paid;
  if (paid > 0) {
    msg += `✅ Amount Paid: Rs ${paid.toLocaleString()}\n`;
    if (remaining > 0) msg += `⚠️ Remaining: Rs ${remaining.toLocaleString()}\n`;
  }
  msg += `─────────────────\n`;
  if (sale.saleType === 'Cash' && remaining <= 0) {
    msg += `✅ *Hamarey sath karobaar kerney ka Shukerya!*\n💚 Aapka payment receive ho gaya.`;
  } else {
    msg += `⚠️ *Hamarey sath karobaar kerney ka Shukerya!*\n💰 Aapka outstanding: Rs ${remaining.toLocaleString()}\nBraey meherbani jald payment karein.`;
  }
  return msg;
}

// ===== WHATSAPP SEND =====
function sendWA(contact, msg) {
  const phone = (contact || '').replace(/[^0-9]/g, '');
  const intPhone = phone.startsWith('0') ? '92' + phone.slice(1) : phone;
  window.open(`https://wa.me/${intPhone}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ===== PAYMENT REMINDER WA =====
function sendPaymentReminder(partyId) {
  const parties = DB.get('parties', []);
  const party = parties.find(p => p.id == partyId);
  if (!party) return;
  const co = Company.get();
  let msg = `🏬 *${co.name}*\n📞 ${co.phone}\n`;
  msg += `─────────────────\n`;
  msg += `As-salamu Alaykum ${party.name},\n\n`;
  msg += `Aap ka outstanding balance:\n`;
  msg += `*Rs ${(party.balance || 0).toLocaleString()}*\n\n`;
  msg += `Braey meherbani jald payment karein.\n`;
  msg += `─────────────────\n`;
  msg += `Shukerya! 🙏`;
  sendWA(party.contact, msg);
}

// ===== AUTO SYNC =====
async function autoSync() {
  const url = localStorage.getItem('imrc_gs_url');
  if (!url) return;
  try {
    const data = {
      parties: DB.get('parties', []),
      products: DB.get('products', []),
      purchases: DB.get('purchases', []),
      sales: DB.get('sales', []),
    };
    await fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'syncAll', data }) });
  } catch (e) { /* silent */ }
}

// ===== SIDEBAR INIT =====
function initSidebar(activePage) {
  const user = Session.requireLogin();
  if (!user) return null;
  applyTheme();

  // Set user info
  const nameEl = document.getElementById('sidebar-username');
  const roleEl = document.getElementById('sidebar-role');
  const avatarEl = document.getElementById('sidebar-avatar');
  const statusUserEl = document.getElementById('status-user');
  if (nameEl) nameEl.textContent = user.name || user.username;
  if (roleEl) roleEl.textContent = user.role === 'admin' ? 'Administrator' : 'User';
  if (avatarEl) avatarEl.textContent = (user.name || user.username)[0].toUpperCase();
  if (statusUserEl) statusUserEl.innerHTML = `<i class="fas fa-user"></i> ${user.name || user.username}`;

  // Mark active
  document.querySelectorAll('.sidebar-item[data-page]').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-page') === activePage);
  });

  // Hide settings for non-admin
  if (user.role !== 'admin') {
    const settingsItem = document.querySelector('.sidebar-item[data-page="settings"]');
    if (settingsItem) settingsItem.style.display = 'none';
  }

  // Apply permissions
  if (user.role !== 'admin') {
    const perms = user.permissions || {};
    document.querySelectorAll('.sidebar-item[data-perm]').forEach(el => {
      const p = el.getAttribute('data-perm');
      if (!perms[p]) el.style.display = 'none';
    });
  }

  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  // Company title
  const co = Company.get();
  document.querySelectorAll('.company-name-title').forEach(el => el.textContent = co.name);

  // Low stock badge
  const products = DB.get('products', []);
  const lowCount = products.filter(p => p.stock <= (p.lowAlert || 5)).length;
  const badge = document.getElementById('low-stock-badge');
  if (badge) badge.textContent = lowCount > 0 ? lowCount : '';

  return user;
}

// ===== LOGOUT =====
function logout() {
  showConfirm('Logout', 'Are you sure you want to logout?', () => {
    Session.clear();
    window.location.href = 'login.html';
  }, 'warning');
}

// ===== DATA BACKUP =====
function backupData() {
  const data = {
    exportDate: new Date().toISOString(),
    version: '2.0',
    parties: DB.get('parties', []),
    products: DB.get('products', []),
    purchases: DB.get('purchases', []),
    sales: DB.get('sales', []),
    users: DB.get('users', []).map(u => ({ ...u, password: '***' })),
    company: Company.get()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `IMRC_Backup_${todayISO()}.json`;
  a.click();
  showToast('Backup downloaded!', 'success');
}

function restoreData(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.parties) DB.set('parties', data.parties);
      if (data.products) DB.set('products', data.products);
      if (data.purchases) DB.set('purchases', data.purchases);
      if (data.sales) DB.set('sales', data.sales);
      if (data.company) DB.set('company', data.company);
      showToast('Data restored successfully! Reloading...', 'success');
      setTimeout(() => location.reload(), 1500);
    } catch (err) {
      showToast('Invalid backup file!', 'error');
    }
  };
  reader.readAsText(file);
}

// ===== FORMAT CURRENCY =====
function fmtMoney(n) { return 'Rs ' + (parseFloat(n) || 0).toLocaleString(); }

// ===== PRINT INVOICE =====
function printInvoice(sale) {
  const party = DB.get('parties', []).find(p => p.id == sale.partyId) || { name: sale.partyName, contact: '' };
  const co = Company.get();
  const paid = sale.paid || (sale.saleType === 'Cash' ? sale.grandTotal : 0);
  const remaining = sale.grandTotal - paid;
  const win = window.open('', '_blank', 'width=800,height=600');
  win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${sale.slip}</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; font-size: 13px; color: #222; background: #fff; margin: 0; padding: 20px; }
    .inv-header { text-align: center; border-bottom: 2px solid #007acc; padding-bottom: 12px; margin-bottom: 16px; }
    .inv-header h1 { font-size: 20px; color: #007acc; margin-bottom: 4px; }
    .inv-header p { font-size: 12px; color: #555; margin: 2px 0; }
    .inv-meta { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 12px; }
    .inv-meta div { line-height: 1.8; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
    th { background: #007acc; color: #fff; padding: 8px; text-align: left; font-size: 12px; }
    td { padding: 7px 8px; border-bottom: 1px solid #e0e0e0; font-size: 12px; }
    tr:nth-child(even) td { background: #f9f9f9; }
    .totals { text-align: right; border-top: 2px solid #007acc; padding-top: 10px; }
    .totals div { margin-bottom: 4px; font-size: 13px; }
    .grand { font-size: 16px; font-weight: 700; color: #007acc; }
    .footer { text-align: center; margin-top: 20px; font-size: 11px; color: #888; border-top: 1px solid #e0e0e0; padding-top: 10px; }
    @media print { button { display: none; } }
  </style></head><body>
  <div class="inv-header">
    <h1>${co.name}</h1>
    <p>📞 ${co.phone} | 📧 ${co.email}</p>
    <p>📍 ${co.address || ''}</p>
  </div>
  <div class="inv-meta">
    <div>
      <strong>Party:</strong> ${party.name}<br>
      <strong>Contact:</strong> ${party.contact || '—'}<br>
      <strong>Type:</strong> ${sale.saleType}
    </div>
    <div style="text-align:right">
      <strong>Slip No:</strong> ${sale.slip}<br>
      <strong>Date:</strong> ${formatDate(sale.date)}<br>
      <strong>Bill By:</strong> ${sale.createdBy || 'Admin'}
    </div>
  </div>
  <table>
    <thead><tr><th>#</th><th>Product</th><th>Qty</th><th>Rate</th><th>Total</th></tr></thead>
    <tbody>${sale.items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.productName}</td><td>${it.qty}</td><td>Rs ${(it.rate || 0).toLocaleString()}</td><td>Rs ${(it.total || 0).toLocaleString()}</td></tr>`).join('')}</tbody>
  </table>
  <div class="totals">
    <div>Bill Total: <strong>Rs ${sale.billTotal.toLocaleString()}</strong></div>
    ${sale.prevBal > 0 ? `<div>Previous Balance: <strong>Rs ${sale.prevBal.toLocaleString()}</strong></div>` : ''}
    <div class="grand">Grand Total: Rs ${sale.grandTotal.toLocaleString()}</div>
    ${paid > 0 ? `<div style="color:#1e8e3e">Paid: Rs ${paid.toLocaleString()}</div>` : ''}
    ${remaining > 0 ? `<div style="color:#c62828">Remaining: Rs ${remaining.toLocaleString()}</div>` : ''}
  </div>
  <div class="footer">
    Developer: Muhammad Iqbal | ${co.phone} | ${co.email}<br>
    Thank you for your business!
  </div>
  <br><button onclick="window.print()">🖨️ Print</button>
  </body></html>`);
  win.document.close();
}

// ===== PRINT LOW STOCK =====
function printLowStock() {
  const products = DB.get('products', []);
  const low = products.filter(p => p.stock <= (p.lowAlert || 5));
  const co = Company.get();
  const win = window.open('', '_blank', 'width=800,height=600');
  win.document.write(`<!DOCTYPE html><html><head><title>Low Stock Report</title>
  <style>
    body { font-family:'Segoe UI',sans-serif; font-size:13px; color:#222; padding:20px; }
    h2 { color:#007acc; }
    table { width:100%; border-collapse:collapse; margin-top:14px; }
    th { background:#007acc; color:#fff; padding:8px; font-size:12px; }
    td { padding:7px 8px; border-bottom:1px solid #e0e0e0; font-size:12px; }
    .footer { text-align:center; margin-top:20px; font-size:11px; color:#888; }
    @media print { button { display:none; } }
  </style></head><body>
  <h2>${co.name} — Low Stock Alert</h2>
  <p>Date: ${formatDate(todayISO())} | Total Low Items: ${low.length}</p>
  <table><thead><tr><th>#</th><th>Product</th><th>Purchase Rate</th><th>Sale Rate</th><th>Stock</th><th>Alert Level</th><th>Short By</th></tr></thead>
  <tbody>${low.map((p, i) => `<tr><td>${i + 1}</td><td>${p.name}</td><td>Rs ${p.purchaseRate.toLocaleString()}</td><td>Rs ${p.saleRate.toLocaleString()}</td><td style="color:#c62828;font-weight:700">${p.stock}</td><td>${p.lowAlert}</td><td>${Math.max(0, p.lowAlert - p.stock)}</td></tr>`).join('')}</tbody>
  </table>
  <div class="footer">Developer: Muhammad Iqbal | ${co.phone} | ${co.email}</div>
  <br><button onclick="window.print()">🖨️ Print</button>
  </body></html>`);
  win.document.close();
}
