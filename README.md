# Iqbal Mobile Repairing Center — Management System v2.0

**Developer: Muhammad Iqbal | 0317-5825000 | iqbalje@gmail.com**

---

## 📁 Project Structure

```
IMRC/
├── index.html          ← Dashboard (main page)
├── login.html          ← Login & Admin Creation
├── add_parties.html    ← Manage Parties / Customers
├── add_products.html   ← Manage Products & Stock
├── purchase.html       ← Purchase / Incoming Stock
├── sales.html          ← Sale Invoices (POS)
├── payments.html       ← Payment Received & Outstanding
├── reports.html        ← Profit/Loss & Stock Reports
├── settings.html       ← Company, Users, Backup, Sync
├── css/
│   └── style.css       ← Shared stylesheet
└── js/
    ├── db.js           ← Data layer, utilities, helpers
    └── sidebar.js      ← (reference, not used directly)
```

---

## 🚀 How to Run (Locally)

1. Download / unzip the IMRC folder to your desktop.
2. Open `login.html` in **Google Chrome** or **Microsoft Edge**.
3. Go to **Create Admin** tab → fill details → click **Create Administrator**.
4. Fill in **Company Setup** form → click **Save & Continue**.
5. Login with your username and password.
6. You're in! Start by adding Parties, then Products.

> ⚠️ **Important:** All data is stored in browser **localStorage**.  
> Always use the same browser on the same computer to keep your data.  
> Use **Settings → Export Backup** regularly to save your data as a JSON file.

---

## ✅ Features

### 1. Smart POS Sale System
- Type any product name → live dropdown with stock & rate info
- Arrow key navigation + Enter to select
- Auto-fills rate, calculates total instantly

### 2. Partial Payment System
- **Partial**: Enter custom amount received
- **Full Payment**: Auto-fills full outstanding amount
- **Credit Clear**: One-click clear all balance

### 3. Outstanding Balance Tracker
- Dashboard shows total outstanding + top 5 pending parties
- WhatsApp reminder button per party
- Running marquee on dashboard

### 4. Sale Return System
- Select a previous sale → check items to return → enter qty
- Stock auto-restored, party balance adjusted automatically

### 5. WhatsApp Integration
- Sale invoice with item details, balance, bill-creator name
- Payment received confirmation with before/after balance
- Outstanding reminder messages
- Works via wa.me links (opens WhatsApp Web or app)

### 6. User Role Management
- Admin: full access to everything
- User: access based on permission toggles
- Permissions: Parties, Products, Purchase, Sale, Payments, Reports
- Edit permissions any time from Settings

### 7. Company Settings
- Set name, phone, email, address
- Auto-reflects in all invoices, WhatsApp messages, print bills

### 8. Google Sheets Sync
- Paste your Google Apps Script URL in Settings
- Click Sync Now → all data pushed to Google Sheets
- Auto-syncs on every Save action

### 9. Print System
- Professional invoice with company header, items, totals
- Print Low Stock report
- Opens in new window with print button

### 10. Data Backup & Restore
- Export all data as JSON (download to desktop)
- Restore from backup JSON file
- Danger zone: clear sales / purchases / all data

### 11. Low Stock Alerts
- Blinking badge on dashboard
- Export to Excel (XLSX)
- Print report with shortfall column

### 12. Reports
- Date range filter with Today/Week/Month/Year shortcuts
- Period summary: Total Sales, Cost, Net Profit
- Product-wise profit & margin breakdown
- Party-wise: bills, payments received, balance
- Export any report to Excel

---

## 🔧 Google Apps Script Setup

1. Go to [script.google.com](https://script.google.com)
2. Click **New Project**
3. Paste the script code from **Settings → Google Apps Script Code**
4. Click **Deploy → New Deployment → Web App**
5. Set **Execute As:** Me, **Who has access:** Anyone
6. Copy the Web App URL
7. Paste it in **Settings → Google Sheets Sync**

---

## 💾 Data Storage

All data is saved in **browser localStorage** under these keys:
- `imrc_parties` — party list
- `imrc_products` — product catalog & stock
- `imrc_purchases` — purchase history
- `imrc_sales` — sale invoices
- `imrc_payments` — payment records
- `imrc_returns` — sale returns
- `imrc_users` — user accounts
- `imrc_company` — company settings
- `imrc_session` — login session
- `imrc_theme` — dark/light theme
- `imrc_gs_url` — Google Script URL

---

## 📱 Responsive Design
- Desktop: Full sidebar + content
- Tablet (≤900px): 2-column forms collapse
- Mobile (≤700px): Sidebar collapses to icons only

---

## 🛡️ Security Notes
- Passwords stored as base64 (not plain text)
- Session stored in localStorage — single browser only
- No internet required except for WhatsApp & Google Sheets sync
- For production use, consider a proper backend server

---

*Developer: Muhammad Iqbal | 0317-5825000 | iqbalje@gmail.com*
