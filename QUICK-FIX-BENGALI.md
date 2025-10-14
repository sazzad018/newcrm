# 🚀 তাড়াতাড়ি Permission Fix করুন!

## ❌ আপনার Error:
```
400: {"error":"permission denied for relation clients"}
```

---

## ✅ সবচেয়ে সহজ সমাধান (5 মিনিটে Fix!)

### ধাপ ১: Database User খুঁজুন

**cPanel → File Manager** এ যান:
- আপনার app folder খুলুন (যেমন: `/home/beautyzo/akafshop.com/`)
- `.env` file open করুন
- এই line খুঁজুন:

```env
DATABASE_URL=postgresql://beautyzo_user:password@localhost/mydb
                          ^^^^^^^^^^^^
                          এই নাম note করুন!
```

**উদাহরণ:** `beautyzo_user` হলে এটাই আপনার database user

---

### ধাপ ২: phpPgAdmin Open করুন

1. **cPanel Dashboard** এ যান
2. **phpPgAdmin** click করুন (Databases section এ)
3. আপনার **database** select করুন
4. **SQL** tab এ click করুন

---

### ধাপ ৩: এই SQL Paste করুন

**Important:** নিচের SQL এ `beautyzo_user` কে **আপনার actual database user** দিয়ে replace করুন!

```sql
-- সব জায়গায় beautyzo_user কে আপনার user দিয়ে replace করুন!

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO beautyzo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO beautyzo_user;
GRANT USAGE ON SCHEMA public TO beautyzo_user;

ALTER TABLE clients OWNER TO beautyzo_user;
ALTER TABLE facebook_marketing OWNER TO beautyzo_user;
ALTER TABLE website_details OWNER TO beautyzo_user;
ALTER TABLE transactions OWNER TO beautyzo_user;
ALTER TABLE invoices OWNER TO beautyzo_user;
ALTER TABLE tags OWNER TO beautyzo_user;
ALTER TABLE client_tags OWNER TO beautyzo_user;
ALTER TABLE offers OWNER TO beautyzo_user;
ALTER TABLE quick_messages OWNER TO beautyzo_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT ALL PRIVILEGES ON TABLES TO beautyzo_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT ALL PRIVILEGES ON SEQUENCES TO beautyzo_user;
```

**SQL box এ paste করুন এবং Execute button click করুন!**

---

### ধাপ ৪: Application Restart করুন

1. **cPanel → Setup Node.js App** এ যান
2. আপনার application select করুন
3. **Restart** button click করুন
4. **Open Application** click করুন

---

## 🎉 Done! Application এখন কাজ করবে!

---

## 📌 যদি এখনও Error আসে?

### তাহলে Tables পুনরায় তৈরি করুন:

#### 1. পুরানো Tables Delete করুন:

**phpPgAdmin → SQL** tab এ paste করুন:

```sql
DROP TABLE IF EXISTS client_tags CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS facebook_marketing CASCADE;
DROP TABLE IF EXISTS website_details CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS quick_messages CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
```

**Execute** করুন।

#### 2. নতুন Tables তৈরি করুন:

1. **SQL box পরিষ্কার করুন**
2. **`database.sql`** file open করুন (আপনার upload folder এ)
3. **সম্পূর্ণ content copy করে SQL box এ paste করুন**
4. **Execute** click করুন

#### 3. Application Restart করুন:

- **cPanel → Setup Node.js App → Restart**

**✅ এখন perfect ভাবে কাজ করবে!**

---

## 🔧 Alternative Method: .env File Update

যদি আপনার কাছে **postgres** বা **superuser** access থাকে:

**.env file edit করুন:**

```env
# Before
DATABASE_URL=postgresql://beautyzo_user:password@localhost/mydb

# After (superuser দিয়ে)
DATABASE_URL=postgresql://postgres:admin_password@localhost/mydb
```

**Save করুন এবং app restart করুন।**

**Note:** এটা temporary solution। Production এ recommended না।

---

## 📞 সাহায্য দরকার?

**Check করুন:**

1. ✅ Database user সঠিক আছে কিনা (.env file এ)
2. ✅ SQL এ সঠিক username দিয়েছেন কিনা
3. ✅ Tables exist করে কিনা (phpPgAdmin এ check করুন)
4. ✅ Application restart করেছেন কিনা

**এখনও সমস্যা থাকলে আমাকে জানান!** 💪

---

## 📚 বিস্তারিত Guide

আরও বিস্তারিত জানতে দেখুন:
- `PERMISSION-FIX-GUIDE.md` (English detailed guide)
- `fix-permissions.sql` (Ready-to-use SQL file)
