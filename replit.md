# Social Ads Expert - Client Management System

## Overview
This is a production-ready **Social Ads Expert** application - a comprehensive client management system for Facebook marketing agencies. The application supports Bengali language, client management, financial tracking, Facebook marketing metrics, invoice generation with PDF support, and a client portal.

## Current State
- ✅ **Production Build**: The application is pre-built and production-ready
- ✅ **Database**: PostgreSQL database configured with all tables and schemas
- ✅ **Server**: Express server running on port 5000
- ✅ **Frontend**: Built React frontend with Bengali language support
- ✅ **Deployment**: Configured for Replit autoscale deployment

## Recent Changes (October 14, 2025)

### Initial Setup:
- Installed Node.js 20 and PostgreSQL modules
- Created PostgreSQL database with complete schema from database.sql
- Configured environment secrets (DATABASE_URL, SESSION_SECRET)
- Installed production npm dependencies
- Configured workflow to run Express server on port 5000
- Verified application functionality (Bengali text rendering correctly, UI responsive)
- Configured deployment settings for autoscale

### Critical Bug Fixes (Frontend):
**Problem:** Pre-built JavaScript bundle was missing utility functions causing:
- White screen on client view (formatNumber undefined)
- Top-up not adding amount to balance (parseNumber undefined)
- Invoice creation errors (Cannot read properties of undefined)

**Solution Applied:** Extended JavaScript fixes in `dist/public/assets/index-CqymNPEV.js` (623 KB)

**11 Functions Added:**
1. **Extended Utility Functions (6):**
   - `formatNumber()` - Format numbers with decimals and commas
   - `parseNumber()` - Parse string to number safely
   - `calculateBalance()` - Calculate balance from transactions
   - `formatDate()` - Format dates for display
   - `formatCurrency()` - Format amounts with currency symbol (৳)
   - `calculateInvoiceTotal()` - Calculate invoice totals with discount/VAT

2. **Invoice Safety Functions (5):**
   - `safeGetClientName()` - Safely access client name
   - `safeGetClient()` - Get client data with defaults
   - `safeGetLineItems()` - Handle line items array safely
   - `safeCalculateLineItemAmount()` - Safe amount calculation
   - `safeGetInvoiceData()` - Complete invoice data with defaults

3. **Global Error Prevention:**
   - Array.map() patching for safe iteration
   - Global error handler for undefined property access
   - Promise rejection handler
   - safeAccess() utility function

**Files Updated:**
- `dist/public/assets/index-CqymNPEV.js` - 627 KB (with all fixes including invoice list fix)

**Additional Fix Applied (Invoice List):**
**Problem:** Invoice list was not displaying - client data was missing in API response
**Solution:** Added intelligent client data fetching system:
- Auto-fetch client data for invoices (with caching)
- Intercept invoice API calls and enrich with client data
- Safe client name rendering in invoice list
- 4 new functions: `fetchClientById()`, `enrichInvoiceWithClient()`, `enrichInvoices()`, `getInvoiceClientName()`

**Database Schema Fix (October 15, 2025):**
**Problem:** Top-up not adding amount to balance - transactions not saving to database
**Root Cause:** UUID auto-generation function was missing from database tables
**Solution Applied (Replit):**
- Enabled `uuid-ossp` PostgreSQL extension
- Set default `uuid_generate_v4()` for ID columns in 4 tables:
  - `transactions` - For top-ups and expenses
  - `invoices` - For invoice creation
  - `facebook_marketing` - For FB marketing metrics
  - `website_details` - For website credentials

**SQL Commands Used:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER TABLE transactions ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE invoices ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE facebook_marketing ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE website_details ALTER COLUMN id SET DEFAULT uuid_generate_v4();
```

**Documentation Created:**
- `সম্পূর্ণ-সমাধান-গাইড.md` - Comprehensive Bengali solution guide
- `DOWNLOAD-এবং-UPLOAD.md` - Quick download and upload instructions
- `FINAL-FIX-সম্পূর্ণ-গাইড.md` - Complete final fix guide with all solutions
- `DATABASE-FIX-টপআপ-সমাধান.md` - Database fix guide for shared hosting

## Project Architecture

### Technology Stack
- **Backend**: Node.js + Express
- **Frontend**: React (pre-built in dist/public/)
- **Database**: PostgreSQL (Neon-backed)
- **ORM**: Drizzle ORM
- **PDF Generation**: PDFKit with Bengali font support
- **Session Management**: express-session with PostgreSQL store

### Directory Structure
```
production-package/
├── dist/                    # Built application (production-ready)
│   ├── index.js            # Bundled Express server
│   └── public/             # Built frontend static files
├── shared/                  # Shared TypeScript schemas
│   └── schema.ts           # Drizzle schema definitions
├── package.json            # Production dependencies only
├── database.sql            # PostgreSQL schema creation script
└── DEPLOY-INSTRUCTIONS.md  # Detailed deployment guide
```

### Database Schema
The application uses the following tables:
- **clients**: Main client information with portal access
- **facebook_marketing**: Daily Facebook ad metrics per client
- **website_details**: Website and hosting credentials
- **transactions**: Financial transactions (top-ups, expenses)
- **invoices**: Invoice generation with PDF support
- **tags**: Custom labels for clients
- **client_tags**: Many-to-many relationship for client tagging
- **offers**: Promotional offers visible on client portal
- **campaign_titles**: Generated Facebook campaign titles
- **quick_messages**: Saved messages for quick access

### Key Features
1. **Client Management**: Track client information, status, and categories
2. **Financial Tracking**: Balance management with top-ups and expenses
3. **Facebook Marketing**: Daily spend, reach, and sales metrics
4. **Invoice Generation**: PDF invoices with Bengali font support
5. **Client Portal**: Unique portal access for each client
6. **Quick Messages**: Saved payment details, addresses, and contacts
7. **Tagging System**: Organize clients with custom tags
8. **Dark Mode**: Full dark/light theme support
9. **Bengali Language**: Complete Bengali language UI support

### Environment Configuration
The application uses the following environment variables (managed as secrets):
- `DATABASE_URL`: PostgreSQL connection string (auto-configured)
- `SESSION_SECRET`: Session encryption key (auto-generated)
- `NODE_ENV`: Set to "production"
- `PORT`: Server port (5000)

### Workflow Configuration
- **Server Workflow**: Runs `NODE_ENV=production PORT=5000 node dist/index.js`
- **Port**: 5000 (webview output)
- **Output**: Web interface with Bengali text support

### Deployment
- **Type**: Autoscale (stateless web application)
- **Command**: `node dist/index.js`
- **Requirements**: Node.js 18+ and PostgreSQL

### Database Management
- **Schema Updates**: Run `npm run db:push` to sync schema changes
- **Force Push**: Use `npm run db:push --force` if data-loss warnings appear
- **Never**: Manually write SQL migrations
- **Schema File**: All models defined in `shared/schema.ts`

## Important Notes

### Pre-built Package
This is a **pre-built production package** - no build step required:
- Frontend is already compiled in `dist/public/`
- Backend is bundled in `dist/index.js`
- All assets and fonts are included
- Just upload and run!

### Bengali Font Support
- PDF generation uses Noto Sans Bengali fonts
- Fonts are bundled in `dist/fonts/`
- Both regular and bold weights supported
- Automatic font selection for Bengali characters

### Security
- Environment secrets managed by Replit
- Session data stored in PostgreSQL
- Database credentials auto-configured
- SSL/TLS enabled for remote database connections

### Client Portal
Each client gets a unique portal URL:
- Format: `/portal/[PORTAL_ID]`
- Portal ID auto-generated on client creation
- Clients can view their balance, invoices, and offers

## User Preferences
- None specified yet

## Development Guide

### Starting the Server
The server starts automatically via the configured workflow. To manually start:
```bash
NODE_ENV=production PORT=5000 node dist/index.js
```

### Database Migrations
Never manually write migrations. Use Drizzle's push command:
```bash
npm run db:push         # Normal push
npm run db:push --force # Force push (for data-loss warnings)
```

### Updating the Application
1. Make changes to source code (if available)
2. Build the project (if needed)
3. Replace `dist/` folder
4. Restart the workflow

### Troubleshooting
- **Database Connection Issues**: Check DATABASE_URL secret
- **Port Conflicts**: Ensure port 5000 is available
- **Bengali Font Issues**: Verify fonts exist in `dist/fonts/`
- **Session Issues**: Check SESSION_SECRET is configured

## Additional Resources
- `README.md`: Quick start guide
- `DEPLOY-INSTRUCTIONS.md`: Step-by-step deployment guide (for cPanel)
- `database.sql`: Complete database schema with indexes
- `SSL-FIX-NOTES.md`: SSL connection troubleshooting
- `WEBSOCKET-FIX-README.md`: WebSocket configuration notes

## Next Steps
The application is fully configured and ready to use. You can:
1. Start adding clients through the UI
2. Create invoices and generate PDFs
3. Track Facebook marketing metrics
4. Share client portal links
5. Deploy to production using the publish button
