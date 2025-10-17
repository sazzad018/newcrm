# SQL Permission Fixes - সম্পূর্ণ গাইড

## 📋 সারসংক্ষেপ

এই document এ **Shared Hosting PostgreSQL** এর জন্য সব SQL permission fixes এবং database optimization এর complete guide আছে।

---

## 🎯 প্রধান সমস্যা ও সমাধান

### সমস্যা ১: `gen_random_uuid()` Permission Error

**সমস্যা:**
```sql
ERROR: permission denied for function gen_random_uuid()
```

**কারণ:**
- Shared hosting এ PostgreSQL extension `pgcrypto` enabled নেই
- `gen_random_uuid()` function এর permission নেই
- Database user এর superuser access নেই

**সমাধান:**
✅ **Node.js এ UUID generation করা** (Backend code এ)

```javascript
// ❌ আগে (Database এ UUID generate)
id: varchar("id").primaryKey().default(sql`gen_random_uuid()`)

// ✅ এখন (Node.js এ UUID generate)
import { randomUUID } from 'crypto';

function generateUUID() {
  return randomUUID(); // Node.js built-in UUID generator
}

// Database schema তে শুধু field define করা
id: varchar("id").primaryKey()

// Insert করার সময় Node.js থেকে UUID পাঠানো
const id = generateUUID();
await db.insert(table).values({ id, ...otherData });
```

---

## 🔧 Database Schema Fixes

### ১. সব Tables এর ID Field Fix

**সমস্যা:**
সব tables এ `gen_random_uuid()` default value ছিল যা shared hosting এ কাজ করে না।

**সমাধান SQL:**

```sql
-- ✅ সব tables থেকে gen_random_uuid() default remove করা

-- Clients table
ALTER TABLE clients 
  ALTER COLUMN id DROP DEFAULT;

-- Facebook Marketing table
ALTER TABLE facebook_marketing 
  ALTER COLUMN id DROP DEFAULT;

-- Transactions table
ALTER TABLE transactions 
  ALTER COLUMN id DROP DEFAULT;

-- Invoices table
ALTER TABLE invoices 
  ALTER COLUMN id DROP DEFAULT;

-- Tags table
ALTER TABLE tags 
  ALTER COLUMN id DROP DEFAULT;

-- Client Tags table
ALTER TABLE client_tags 
  ALTER COLUMN id DROP DEFAULT;

-- Offers table
ALTER TABLE offers 
  ALTER COLUMN id DROP DEFAULT;

-- Campaign Titles table
ALTER TABLE campaign_titles 
  ALTER COLUMN id DROP DEFAULT;

-- Quick Messages table
ALTER TABLE quick_messages 
  ALTER COLUMN id DROP DEFAULT;

-- Website Details table (যদি থাকে)
ALTER TABLE website_details 
  ALTER COLUMN id DROP DEFAULT;
```

---

## 📊 Data Migration Fixes

### ২. Transaction Type Fix

**সমস্যা:**
Frontend expect করে `type: "topup"` এবং `type: "expense"` কিন্তু database এ ছিল `"top-up"` (hyphen সহ)।

**সমাধান SQL:**

```sql
-- ✅ সব "top-up" কে "topup" তে convert করা
UPDATE transactions 
SET type = 'topup' 
WHERE type = 'top-up';

-- Result: 30 rows updated (বা যত transactions আছে)
```

**কেন প্রয়োজন:**
- Frontend minified code এ strict check: `.type === "topup"`
- Hyphen থাকলে match হয় না
- Portal এ Total Top-ups $0.00 দেখাতো

---

## 🗂️ Complete SQL Setup Script

**নতুন Database Setup এর জন্য:**

```sql
-- ================================
-- STEP 1: Tables তৈরি করা
-- ================================

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  balance DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR DEFAULT 'active',
  portal_id VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facebook Marketing Table
CREATE TABLE IF NOT EXISTS facebook_marketing (
  id VARCHAR PRIMARY KEY,
  client_id VARCHAR NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  daily_spend DECIMAL(10, 2) DEFAULT 0,
  reach INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  campaign_details TEXT,
  ad_account_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR PRIMARY KEY,
  client_id VARCHAR NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL CHECK (type IN ('topup', 'expense')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR PRIMARY KEY,
  client_id VARCHAR NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number VARCHAR UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR DEFAULT 'unpaid',
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
  id VARCHAR PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client Tags Junction Table
CREATE TABLE IF NOT EXISTS client_tags (
  id VARCHAR PRIMARY KEY,
  client_id VARCHAR NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  tag_id VARCHAR NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, tag_id)
);

-- Offers Table
CREATE TABLE IF NOT EXISTS offers (
  id VARCHAR PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_active VARCHAR DEFAULT 'true',
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign Titles Table
CREATE TABLE IF NOT EXISTS campaign_titles (
  id VARCHAR PRIMARY KEY,
  client_name TEXT NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  end_date TIMESTAMP NOT NULL,
  generated_title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quick Messages Table
CREATE TABLE IF NOT EXISTS quick_messages (
  id VARCHAR PRIMARY KEY,
  category VARCHAR NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Website Details Table
CREATE TABLE IF NOT EXISTS website_details (
  id VARCHAR PRIMARY KEY,
  client_id VARCHAR UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
  domain TEXT,
  hosting_info TEXT,
  login_url TEXT,
  username TEXT,
  password TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- STEP 2: Indexes তৈরি করা
-- ================================

-- Performance optimization এর জন্য
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_portal_id ON clients(portal_id);
CREATE INDEX IF NOT EXISTS idx_fb_marketing_client ON facebook_marketing(client_id);
CREATE INDEX IF NOT EXISTS idx_fb_marketing_date ON facebook_marketing(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_client ON transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_client_tags_client ON client_tags(client_id);
CREATE INDEX IF NOT EXISTS idx_client_tags_tag ON client_tags(tag_id);

-- ================================
-- STEP 3: Data Validation
-- ================================

-- Transaction types শুধু 'topup' বা 'expense' হতে পারবে
-- (Already handled in CHECK constraint above)

-- Offers এর is_active শুধু 'true' বা 'false' string হতে পারবে
ALTER TABLE offers 
  ADD CONSTRAINT offers_is_active_check 
  CHECK (is_active IN ('true', 'false'));
```

---

## 🔄 Existing Database Migration

**যদি আগে থেকে Database থাকে:**

```sql
-- ================================
-- Migration Script for Existing Database
-- ================================

-- Step 1: Remove gen_random_uuid() defaults
ALTER TABLE clients ALTER COLUMN id DROP DEFAULT;
ALTER TABLE facebook_marketing ALTER COLUMN id DROP DEFAULT;
ALTER TABLE transactions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE invoices ALTER COLUMN id DROP DEFAULT;
ALTER TABLE tags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE client_tags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE offers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE campaign_titles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE quick_messages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE website_details ALTER COLUMN id DROP DEFAULT;

-- Step 2: Fix transaction types
UPDATE transactions SET type = 'topup' WHERE type = 'top-up';
UPDATE transactions SET type = 'expense' WHERE type = 'top-up' OR type LIKE '%expense%';

-- Step 3: Verify data
SELECT COUNT(*) as total_topup FROM transactions WHERE type = 'topup';
SELECT COUNT(*) as total_expense FROM transactions WHERE type = 'expense';

-- Step 4: Add missing indexes (if not exists)
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_portal_id ON clients(portal_id);
CREATE INDEX IF NOT EXISTS idx_fb_marketing_client ON facebook_marketing(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_client ON transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
```

---

## ✅ Verification Queries

**Setup সম্পূর্ণ করার পর এই queries run করুন:**

```sql
-- ১. Check করুন সব tables আছে কিনা
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ২. Transaction types verify করুন
SELECT type, COUNT(*) as count 
FROM transactions 
GROUP BY type;

-- Expected output:
-- topup   | 30
-- expense | 0 (বা যদি FB marketing থেকে synthetic transactions থাকে)

-- ৩. Clients verify করুন
SELECT COUNT(*) as total_clients, 
       COUNT(*) FILTER (WHERE status = 'active') as active_clients
FROM clients;

-- ৪. Check করুন কোনো gen_random_uuid() default আছে কিনা (থাকা উচিত নয়)
SELECT 
  table_name,
  column_name,
  column_default
FROM information_schema.columns
WHERE column_default LIKE '%gen_random_uuid%';

-- Expected: 0 rows (কোনো result থাকা উচিত নয়)

-- ৫. Portal IDs check করুন (unique এবং valid UUID)
SELECT 
  COUNT(*) as total_portals,
  COUNT(DISTINCT portal_id) as unique_portals
FROM clients 
WHERE portal_id IS NOT NULL;
```

---

## 🚀 Drizzle ORM Push Command

**Schema changes push করার জন্য:**

```bash
# Normal push (recommended first)
npm run db:push

# যদি data loss warning আসে:
npm run db:push --force
```

**কখন `--force` use করবেন:**
- ✅ Local development database এ
- ✅ Test data এ
- ❌ Production database এ (সাবধান!)

---

## 📝 Backend Code Changes

### Node.js এ UUID Generation

**File: `dist/index.js` (বা আপনার backend code)**

```javascript
import { randomUUID } from 'crypto';

// UUID generator function
function generateUUID() {
  return randomUUID();
}

// Example usage in storage class
async createClient(data) {
  const id = generateUUID(); // Node.js generated UUID
  const portalId = generateUUID(); // Portal ID ও Node.js থেকে
  
  const [client] = await db.insert(clients)
    .values({ 
      ...data, 
      id,           // Manual UUID
      portalId      // Manual UUID
    })
    .returning();
    
  return client;
}

// সব create operations এ same pattern
async createTransaction(data) {
  const id = generateUUID();
  const [transaction] = await db.insert(transactions)
    .values({ ...data, id })
    .returning();
  return transaction;
}
```

---

## 🔐 Security Best Practices

### ১. Connection String Format

**Shared Hosting এর জন্য:**

```bash
# .env file
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

**Important:**
- ✅ Always use `sslmode=require` for remote connections
- ✅ Never commit `.env` file to git
- ✅ Use environment variables in production

### ২. User Permissions

**Minimum required permissions:**

```sql
-- Your database user এর কমপক্ষে এই permissions থাকা দরকার:

GRANT CONNECT ON DATABASE your_database TO your_user;
GRANT USAGE ON SCHEMA public TO your_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

---

## 🐛 Common Errors & Solutions

### Error 1: Permission Denied for gen_random_uuid()

```sql
ERROR: permission denied for function gen_random_uuid()
```

**Solution:**
✅ Backend code এ UUID generate করুন (উপরে দেখানো হয়েছে)

---

### Error 2: Column has incorrect type

```sql
ERROR: column "id" is of type character varying but expression is of type uuid
```

**Solution:**
```sql
-- Schema তে varchar use করুন, uuid নয়
ALTER TABLE table_name ALTER COLUMN id TYPE VARCHAR;
```

---

### Error 3: Transaction type mismatch

```
Frontend shows $0.00 for Total Top-ups
```

**Solution:**
```sql
-- Transaction types fix করুন
UPDATE transactions SET type = 'topup' WHERE type = 'top-up';
```

---

### Error 4: Foreign key violation

```sql
ERROR: insert or update on table violates foreign key constraint
```

**Solution:**
```sql
-- Referenced record আছে কিনা check করুন
SELECT * FROM clients WHERE id = 'your-client-id';

-- যদি না থাকে, প্রথমে client create করুন
INSERT INTO clients (id, name, ...) VALUES (...);
```

---

## 📊 Performance Optimization

### Essential Indexes

```sql
-- সবচেয়ে important indexes

-- Clients
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_portal_id ON clients(portal_id);

-- Facebook Marketing
CREATE INDEX idx_fb_marketing_client ON facebook_marketing(client_id);
CREATE INDEX idx_fb_marketing_date ON facebook_marketing(date DESC);

-- Transactions
CREATE INDEX idx_transactions_client ON transactions(client_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(created_at DESC);

-- Invoices
CREATE INDEX idx_invoices_client ON invoices(client_id);

-- Client Tags
CREATE INDEX idx_client_tags_client ON client_tags(client_id);
CREATE INDEX idx_client_tags_tag ON client_tags(tag_id);
```

---

## 🎯 Testing Checklist

Setup complete করার পর এই checklist follow করুন:

- [ ] ✅ সব tables created হয়েছে
- [ ] ✅ কোনো `gen_random_uuid()` default নেই
- [ ] ✅ Transaction types সব `topup` বা `expense`
- [ ] ✅ Indexes created হয়েছে
- [ ] ✅ Foreign keys কাজ করছে
- [ ] ✅ Portal IDs unique এবং valid
- [ ] ✅ Backend থেকে data insert করতে পারছেন
- [ ] ✅ Portal page এ correct totals দেখাচ্ছে
- [ ] ✅ Campaign title generator কাজ করছে

---

## 📞 Support Commands

### Database Connection Test

```bash
# PostgreSQL connection test
psql "$DATABASE_URL" -c "SELECT version();"
```

### Quick Database Reset (Development Only!)

```bash
# ⚠️ WARNING: এটা সব data delete করবে!
# শুধুমাত্র local/development এ use করুন

# Drop all tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# Then re-run setup script
```

---

## 🎉 সম্পূর্ণ!

এই documentation follow করলে আপনার Shared Hosting PostgreSQL database সম্পূর্ণভাবে configure হবে এবং সব permission issues fix হবে।

**যদি কোনো সমস্যা হয়:**
1. Verification queries run করুন
2. Error logs check করুন
3. Common Errors section দেখুন

**শুভকামনা!** 🚀
