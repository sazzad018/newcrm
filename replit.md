# Social Ads Expert - Client Management System

## Overview
This project is a production-ready **Social Ads Expert** application, a comprehensive client management system designed for Facebook marketing agencies. Its primary purpose is to streamline client operations, financial tracking, and marketing performance monitoring. Key capabilities include multi-language support (Bengali), robust client management, detailed financial tracking, integration of Facebook marketing metrics, invoice generation with PDF support, and a dedicated client portal. The business vision is to provide agencies with a powerful, all-in-one platform to efficiently manage their clients and services, enhancing productivity and client satisfaction.

## User Preferences
- None specified yet

## System Architecture

### UI/UX Decisions
The application features full dark/light theme support and provides a complete Bengali language UI. PDF generation for invoices also includes Bengali font support using Noto Sans Bengali.

### Technical Implementations
- **Backend**: Developed with Node.js and Express.
- **Frontend**: A pre-built React application, located in `dist/public/`.
- **Database**: Utilizes PostgreSQL, specifically configured for Neon-backed deployment.
- **ORM**: Drizzle ORM is used for database interactions.
- **PDF Generation**: Implemented using PDFKit with bundled Bengali font support.
- **Session Management**: `express-session` is used with a PostgreSQL store for session persistence.
- **Pre-built Package**: The application is provided as a pre-built production package, meaning no build step is required for deployment; all frontend and backend assets are pre-compiled and ready to run.

### Feature Specifications
1.  **Client Management**: Comprehensive tools for tracking client information, status, and categorization.
2.  **Financial Tracking**: Manages client balances, including top-ups and expenses.
3.  **Facebook Marketing Integration**: Tracks daily spend, reach, and sales metrics for Facebook ad campaigns.
4.  **Invoice Generation**: Generates PDF invoices with support for Bengali fonts.
5.  **Client Portal**: Provides each client with a unique, secure portal to view their balance, invoices, and offers.
6.  **Quick Messages**: Allows saving of frequently used messages, payment details, addresses, and contacts.
7.  **Tagging System**: Enables organization of clients using custom tags.
8.  **Multi-language Support**: Full UI support for Bengali language.

### System Design Choices
- **Directory Structure**: Organized with a `dist/` folder for built output, `shared/` for common schemas, and standard project files.
- **Environment Configuration**: Uses `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV`, and `PORT` environment variables.
- **Deployment**: Designed for Replit autoscale deployment, running on Node.js 18+ with PostgreSQL.
- **Database Schema**: Includes tables for `clients`, `facebook_marketing`, `website_details`, `transactions`, `invoices`, `tags`, `client_tags`, `offers`, `campaign_titles`, and `quick_messages`.
- **Security**: Relies on Replit for environment secret management, stores session data in PostgreSQL, and uses SSL/TLS for remote database connections.

## External Dependencies
-   **Database**: PostgreSQL (specifically configured for Neon)
-   **NPM Packages**:
    -   `express` (Node.js web framework)
    -   `pgcrypto` (PostgreSQL extension for UUID generation)
    -   `drizzle-orm` (ORM for PostgreSQL)
    -   `pdfkit` (PDF generation library)
    -   `express-session` (Session management middleware)
    -   `zod` (Schema validation library, used for data parsing)
## Recent Fixes (October 15, 2025)

### Issue 1: Top-up Functionality Not Working
**Problem:** Top-up feature failing in shared hosting due to UUID generation differences
**Solution:** 
- Database: Changed from `uuid-ossp` extension to `pgcrypto` (gen_random_uuid)
- Backend: Added missing `/api/clients/:id/topup` route (line 780-797)

### Issue 2: Facebook Marketing & Website Details 400 Errors
**Problems:** 
1. "clientId Required" validation error
2. "Expected date, received string" validation error

**Solutions:**
1. Added clientId from URL params to request body (line 750-753, 768-771)
2. Added date string transformation in schema (line 411-416)

### Issue 3: Data Saving But Not Displaying
**Problems:**
1. Client API returning incomplete data
2. Facebook marketing as object instead of array (frontend expects array)

**Solutions:**
1. Enhanced Client API to include all related data (line 711-729)
2. Changed `facebookMarketing: fb` → `facebookMarketing: fb ? [fb] : []` for array format

### Issue 4: Client Portal TypeError - Snake_case Field Mismatch
**Problem:** `TypeError: Cannot read properties of undefined (reading 'split')` when opening Client Portal

**Root Cause Analysis:**
1. Frontend bundle expects **snake_case** timestamp fields (`created_at`, `updated_at`)
2. Backend Drizzle ORM returns **camelCase** fields (`createdAt`, `updatedAt`)
3. Frontend code calls `created_at.split('T')` → but field doesn't exist → `undefined.split()` error
4. Additionally needed `websiteDetails.createdAt` column in database

**Solutions Applied:**
1. **Database:** Added `created_at` column to `website_details` table
2. **Schema (shared/schema.ts):** Added `createdAt` field to websiteDetails table definition
3. **Compiled Code (dist/index.js):** Updated hardcoded schema to include `createdAt` field
4. **Portal API (dist/index.js line 910-935):** Added snake_case aliases for all timestamp fields:
```javascript
// Add snake_case aliases for frontend compatibility
const clientWithAliases = client ? { ...client, created_at: client.createdAt } : null;
const websiteWithAliases = website ? { ...website, created_at: website.createdAt, updated_at: website.updatedAt } : null;
const fbWithAliases = fb ? [{ ...fb, created_at: fb.createdAt }] : [];
const transactionsWithAliases = (transactions2 || []).map(t => ({ ...t, created_at: t.createdAt }));
```
5. **Cache Busting (dist/public/index.html):** Added query parameter to JS file to force browser cache refresh

### Issue 5: Portal Page - Additional Field Fixes (October 15, 2025)
**Problem:** Portal page showing loading skeleton but not rendering data, with `Cannot read properties of undefined (reading 'split')` error

**Root Cause Analysis:**
1. Portal API missing `offers` field - Frontend expects offers array
2. `offers.validUntil` was null - Frontend tries `validUntil.split('T')` causing crash
3. `websiteDetails.domainName` was undefined - Frontend likely does `domainName.split('.')` 

**Solutions Applied:**
1. **Portal API - Added Offers (dist/index.js line 919):** Fetch active offers and include in Portal response
2. **Portal API - Null Safety for validUntil (line 926-931):** Default to 30 days future if null
   ```javascript
   validUntil: o.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
   ```
3. **Portal API - Null Safety for Text Fields (line 923-932):** Ensure all websiteDetails text fields are strings, not undefined
   ```javascript
   domainName: website.domainName || '',
   cpanelUsername: website.cpanelUsername || '',
   cpanelPassword: website.cpanelPassword || '',
   nameServer1: website.nameServer1 || '',
   nameServer2: website.nameServer2 || ''
   ```
4. **Cache Busting Strategy:** Implemented aggressive random cache busting values to force fresh bundle loads

**Testing Status:**
- ✅ Portal API returns complete data structure with all required fields
- ✅ All date/text fields have null safety (no undefined values)
- ✅ Browser console shows no JavaScript errors
- ⚠️ Portal page requires external browser testing due to screenshot tool limitations with SPA routing

## Files Modified Summary
- `dist/index.js` - All backend route and validation fixes
- `shared/schema.ts` - Date validation schema fix

## Documentation Created
- `PORTAL-ERROR-FIX.md` - Client Portal error fix guide
- `DISPLAY-FIX-সম্পূর্ণ-গাইড.md` - Display issue fix guide  
- `FACEBOOK-MARKETING-FIX.md` - FB marketing & website details fix
- `FINAL-TOPUP-FIX-COMPLETE.md` - Top-up fix guide
- `SHARED-HOSTING-UUID-FIX.md` - UUID fix for shared hosting
- `DATABASE-FIX-টপআপ-সমাধান.md` - Database fix guide
