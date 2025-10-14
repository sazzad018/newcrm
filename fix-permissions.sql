-- =========================================
-- Permission Fix for Shared Hosting
-- =========================================
-- Run this SQL to grant permissions to your database user
-- Replace 'your_database_user' with your actual username

-- Example: If your DATABASE_URL is:
-- postgresql://beautyzo_user:pass@localhost/mydb
-- Then replace 'your_database_user' with 'beautyzo_user'

-- =========================================
-- STEP 1: Grant permissions on all tables
-- =========================================

-- Grant all permissions on existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_database_user;

-- Grant permissions on future tables (auto-grant)
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT ALL PRIVILEGES ON TABLES TO your_database_user;

-- =========================================
-- STEP 2: Grant permissions on sequences
-- =========================================

-- Grant all permissions on existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_database_user;

-- Grant permissions on future sequences (auto-grant)
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT ALL PRIVILEGES ON SEQUENCES TO your_database_user;

-- =========================================
-- STEP 3: Grant schema usage permission
-- =========================================

GRANT USAGE ON SCHEMA public TO your_database_user;

-- =========================================
-- STEP 4: Make user owner of all tables
-- =========================================

-- Change ownership of tables to your user
ALTER TABLE clients OWNER TO your_database_user;
ALTER TABLE facebook_marketing OWNER TO your_database_user;
ALTER TABLE website_details OWNER TO your_database_user;
ALTER TABLE transactions OWNER TO your_database_user;
ALTER TABLE invoices OWNER TO your_database_user;
ALTER TABLE tags OWNER TO your_database_user;
ALTER TABLE client_tags OWNER TO your_database_user;
ALTER TABLE offers OWNER TO your_database_user;
ALTER TABLE quick_messages OWNER TO your_database_user;

-- =========================================
-- VERIFICATION (Optional - Run to check)
-- =========================================

-- Check table permissions
-- SELECT tablename, tableowner 
-- FROM pg_tables 
-- WHERE schemaname = 'public';

-- Check user privileges
-- SELECT grantee, privilege_type 
-- FROM information_schema.role_table_grants 
-- WHERE table_schema = 'public' 
-- AND grantee = 'your_database_user';
