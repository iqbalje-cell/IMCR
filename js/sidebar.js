/* =====================================================
   IMRC - Sidebar Renderer
   sidebar.js — injects sidebar HTML into all pages
   ===================================================== */

function renderSidebar(activePage) {
  const sidebarHTML = `
    <div id="sidebar">
      <div class="sidebar-header">Navigation</div>
      <div class="sidebar-menu">
        <a class="sidebar-item" data-page="dashboard" href="index.html">
          <i class="fas fa-th-large"></i><span>Dashboard</span>
        </a>
        <div class="sidebar-divider"></div>
        <a class="sidebar-item" data-page="parties" data-perm="parties" href="add_parties.html">
          <i class="fas fa-users"></i><span>Add Parties</span>
        </a>
        <a class="sidebar-item" data-page="products" data-perm="products" href="add_products.html">
          <i class="fas fa-box"></i><span>Add Products</span>
        </a>
        <a class="sidebar-item" data-page="purchase" data-perm="purchase" href="purchase.html">
          <i class="fas fa-shopping-cart"></i><span>Purchase Products</span>
        </a>
        <a class="sidebar-item" data-page="sale" data-perm="sale" href="sales.html">
          <i class="fas fa-receipt"></i><span>Sale Products</span>
        </a>
        <div class="sidebar-divider"></div>
        <a class="sidebar-item" data-page="payments" data-perm="payments" href="payments.html">
          <i class="fas fa-hand-holding-usd"></i><span>Payments</span>
        </a>
        <a class="sidebar-item" data-page="report" data-perm="report" href="reports.html">
          <i class="fas fa-chart-bar"></i><span>Reports</span>
        </a>
        <div class="sidebar-divider"></div>
        <a class="sidebar-item" data-page="settings" href="settings.html">
          <i class="fas fa-cog"></i><span>Settings</span>
        </a>
      </div>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="user-avatar" id="sidebar-avatar">A</div>
          <div>
            <div style="font-size:12px;color:var(--text-primary);font-weight:600" id="sidebar-username">Admin</div>
            <div style="font-size:10px;color:var(--text-muted)" id="sidebar-role">Administrator</div>
          </div>
        </div>
      </div>
    </div>`;

  const titleBarHTML = `
    <div id="title-bar">
      <div class="title-logo"><i class="fas fa-mobile-alt" style="font-size:10px"></i></div>
      <div class="title-text company-name-title">Iqbal Mobile Repairing Center — Management System</div>
      <div class="title-actions">
        <button class="title-btn" title="Toggle Theme" onclick="toggleTheme()"><i class="fas fa-adjust"></i></button>
        <button class="title-btn" title="Logout" onclick="logout()"><i class="fas fa-sign-out-alt"></i></button>
      </div>
    </div>`;

  const statusBarHTML = `
    <div id="status-bar">
      <div class="status-item"><i class="fas fa-circle" style="color:#4ec9b0;font-size:8px"></i> Connected</div>
      <div class="status-item" id="status-user"><i class="fas fa-user"></i> Admin</div>
      <div class="status-item" id="status-time"></div>
      <div style="margin-left:auto" class="status-item company-name-title"><i class="fas fa-mobile-alt"></i> IMRC</div>
    </div>`;

  const toastHTML = `<div id="toast-container"></div>`;

  // Insert into page structure
  const wrapper = document.getElementById('page-wrapper');
  if (wrapper) {
    wrapper.insertAdjacentHTML('beforebegin', titleBarHTML);
    wrapper.insertAdjacentHTML('afterbegin', sidebarHTML);
    wrapper.insertAdjacentHTML('afterend', statusBarHTML);
  }
  document.body.insertAdjacentHTML('beforeend', toastHTML);
}
