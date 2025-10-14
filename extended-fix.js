// Extended Fix for Missing Functions
// This adds all potentially missing utility functions

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsFilePath = path.join(__dirname, 'dist/public/assets/index-CqymNPEV.js');

console.log('🔧 Applying extended fixes for missing functions...');

// Read the bundled JS file
let content = fs.readFileSync(jsFilePath, 'utf8');

// Check if fixes are already applied
if (content.includes('// Extended Fix:')) {
  console.log('⚠️  Extended fixes already applied. Skipping...');
  process.exit(0);
}

// Add all missing utility functions at the beginning
const extendedFixes = `
// Extended Fix: Add all missing utility functions

// Format Number (for balance, amounts, etc.)
function formatNumber(num) {
  if (num === null || num === undefined || num === '') return '0.00';
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return '0.00';
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Parse Number (for form inputs)
function parseNumber(str) {
  if (!str || str === '') return 0;
  const num = typeof str === 'string' ? parseFloat(str.replace(/,/g, '')) : str;
  return isNaN(num) ? 0 : num;
}

// Calculate Balance (for transactions)
function calculateBalance(transactions) {
  if (!Array.isArray(transactions)) return 0;
  
  let balance = 0;
  transactions.forEach(t => {
    const amount = parseFloat(t.amount || 0);
    if (t.type === 'topup') {
      balance += amount;
    } else if (t.type === 'expense') {
      balance -= amount;
    }
  });
  return balance;
}

// Format Date (for display)
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Format Currency (with symbol)
function formatCurrency(amount, currency = 'BDT') {
  const num = formatNumber(amount);
  const symbol = currency === 'BDT' ? '৳' : currency === 'USD' ? '$' : '€';
  return symbol + ' ' + num;
}

// Calculate Invoice Total
function calculateInvoiceTotal(lineItems, discountPercent = 0, vatPercent = 0) {
  if (!Array.isArray(lineItems)) return 0;
  
  let subtotal = 0;
  lineItems.forEach(item => {
    const amount = parseFloat(item.amount || 0);
    subtotal += amount;
  });
  
  const discount = (subtotal * parseFloat(discountPercent || 0)) / 100;
  const afterDiscount = subtotal - discount;
  const vat = (afterDiscount * parseFloat(vatPercent || 0)) / 100;
  const total = afterDiscount + vat;
  
  return total;
}

// Make functions globally available
window.formatNumber = formatNumber;
window.parseNumber = parseNumber;
window.calculateBalance = calculateBalance;
window.formatDate = formatDate;
window.formatCurrency = formatCurrency;
window.calculateInvoiceTotal = calculateInvoiceTotal;

console.log('✅ Extended utility functions loaded');
`;

// Inject the fixes at the beginning of the file (remove old formatNumber fix if exists)
if (content.includes('// Fix: Add missing formatNumber function')) {
  // Remove old fix
  const lines = content.split('\n');
  const startIndex = lines.findIndex(l => l.includes('// Fix: Add missing formatNumber function'));
  if (startIndex !== -1) {
    // Find end of old fix (before the bundled code starts)
    const endIndex = lines.findIndex((l, i) => i > startIndex && l.includes('var OP=') || l.includes('var __defProp='));
    if (endIndex !== -1) {
      lines.splice(startIndex, endIndex - startIndex);
      content = lines.join('\n');
    }
  }
}

// Add new extended fixes
content = extendedFixes + '\n' + content;

// Write back
fs.writeFileSync(jsFilePath, content, 'utf8');

console.log('✅ Extended fixes applied successfully!');
console.log('📁 File updated:', jsFilePath);
console.log('');
console.log('Fixed functions:');
console.log('  ✅ formatNumber - Format numbers with decimals');
console.log('  ✅ parseNumber - Parse string to number');
console.log('  ✅ calculateBalance - Calculate client balance from transactions');
console.log('  ✅ formatDate - Format dates for display');
console.log('  ✅ formatCurrency - Format amounts with currency symbol');
console.log('  ✅ calculateInvoiceTotal - Calculate invoice totals with discount/VAT');
console.log('');
console.log('Next steps:');
console.log('1. Download the fixed file: dist/public/assets/index-CqymNPEV.js');
console.log('2. Upload to your shared hosting');
console.log('3. Restart Node.js app');
console.log('4. Clear browser cache (Ctrl + Shift + Delete)');
console.log('5. Test: Top-up, Invoice, and all other features');
