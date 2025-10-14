# 🚀 Production Deployment - Social Ads Expert
## Terminal/SSH ছাড়া cPanel Deployment

এই package সম্পূর্ণ **production-ready** এবং pre-built। শুধু upload করে run করতে হবে।

---

## ✅ কী কী আছে এই Package এ

- ✅ **Built Frontend** (dist/public/)
- ✅ **Built Backend** (dist/index.js - No Vite! Production-ready!)
- ✅ **Database Schema** (database.sql - No superuser needed!)
- ✅ **Shared Types** (shared/)
- ✅ **Production Package.json** (শুধু essential runtime dependencies)
- ✅ **Environment Template** (.env.example)

---

## 📋 Step-by-Step Deployment

### ধাপ ১: Database Setup (phpPgAdmin)

1. **cPanel → phpPgAdmin** এ যান
2. নতুন database তৈরি করুন (নাম: `social_ads_db`)
3. Database select করুন
4. **SQL** tab এ যান
5. `database.sql` ফাইলের content copy করুন
6. SQL tab এ paste করে **Execute** করুন
7. সব tables তৈরি হয়েছে verify করুন

**Database Credentials সংরক্ষণ করুন:**
- Host (যেমন: localhost)
- Port (যেমন: 5432)
- Username
- Password
- Database Name (social_ads_db)

---

### ধাপ ২: Files Upload (cPanel File Manager)

1. **cPanel → File Manager** এ যান
2. আপনার app folder যান (যেমন: `public_html/social-ads/`)
3. এই package এর **সব files** upload করুন:
   ```
   ✅ dist/
   ✅ shared/
   ✅ package.json
   ✅ .env.example
   ```
4. Upload complete হওয়ার পর verify করুন

---

### ধাপ ৩: Environment Variables Setup

1. Upload করা folder এ `.env` নামে file তৈরি করুন
2. `.env.example` এর content copy করুন
3. আপনার database credentials দিয়ে update করুন:

```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/social_ads_db
SESSION_SECRET=random-secret-key-minimum-20-characters
NODE_ENV=production
PORT=5000
```

**Important Notes:**
- `SESSION_SECRET` এর জন্য একটা random string তৈরি করুন (20+ characters)
- Database credentials ঠিক মতো দিন
- Port number আপনার hosting অনুযায়ী পরিবর্তন করুন (যদি প্রয়োজন হয়)

---

### ধাপ ৪: cPanel Node.js App Setup

1. **cPanel → Setup Node.js App** এ যান
2. **Create Application** click করুন
3. Configuration:

   **Node.js version:** 18.x বা 20.x (highest available)
   
   **Application mode:** Production
   
   **Application root:** আপনার folder path (যেমন: `/home/username/public_html/social-ads`)
   
   **Application URL:** আপনার domain/subdomain (যেমন: `social-ads.yourdomain.com`)
   
   **Application startup file:** `dist/index.js`
   
   **Run NPM Install:** ✅ চেক করুন (এটা automatically dependencies install করবে)

4. **Create** বা **Save** click করুন
5. Application start হওয়ার জন্য অপেক্ষা করুন (1-2 মিনিট)

---

### ধাপ ৫: Application Start

cPanel Node.js App page এ:

1. **Start Application** button click করুন
2. Status **"Running"** হওয়া পর্যন্ত wait করুন
3. **Open Application** click করে test করুন

---

## ✅ Verification Checklist

Application running হলে verify করুন:

- [ ] Homepage সঠিকভাবে load হচ্ছে
- [ ] Dark/Light mode toggle কাজ করছে
- [ ] Database connection successful
- [ ] Bengali font সঠিকভাবে show হচ্ছে

---

## 🔧 Troubleshooting

### ❌ Application Start হচ্ছে না

**Check করুন:**
- Node.js version 18+ আছে কিনা
- `dist/index.js` file আছে কিনা
- `.env` file সঠিকভাবে configured আছে কিনা

**Solution:**
- cPanel Node.js App → Logs check করুন
- Error message দেখে fix করুন

---

### ❌ Database Connection Error

**Check করুন:**
- `DATABASE_URL` সঠিক আছে কিনা
- PostgreSQL database running আছে কিনা
- Username/Password correct আছে কিনা

**Solution:**
```env
# Format ঠিক আছে কিনা verify করুন
DATABASE_URL=postgresql://USER:PASS@HOST:5432/DATABASE
```

---

### ❌ Port Already in Use

**Solution:**
- `.env` file এ PORT পরিবর্তন করুন (5000 → 3000 বা অন্য)
- cPanel Node.js App restart করুন

---

### ❌ Dependencies Install হচ্ছে না

**যদি "Run NPM Install" কাজ না করে:**

Option 1: Support থেকে সাহায্য নিন
```
Support ticket: "Please run 'npm install --production' in my app directory"
```

Option 2: Node.js version পরিবর্তন করুন
- cPanel → Node.js App → Version change করে retry করুন

---

## 📝 Important Notes

### File Permissions
Ensure করুন:
- **Folders:** 755
- **Files:** 644
- **.env file:** 600 (secure)

### Security
- `.env` file কখনো public করবেন না
- Database credentials secure রাখুন
- Regular backup নিন

### Updates করার জন্য
1. নতুন build করুন (local machine এ বা Replit এ)
2. শুধু `dist/` folder replace করুন
3. cPanel থেকে application **Restart** করুন

---

## 🎯 Post-Deployment Tasks

Deploy সফল হলে:

1. **Admin Access Setup:**
   - প্রথম client তৈরি করুন
   - Test করুন সব features

2. **Company Information:**
   - Invoice settings configure করুন
   - Company details update করুন

3. **Backup Setup:**
   - Database backup schedule করুন
   - Files backup plan করুন

4. **Domain Setup:**
   - Custom domain point করুন (যদি প্রয়োজন হয়)
   - SSL certificate enable করুন

---

## 📞 Support

যদি সমস্যা হয়:

1. **Logs check করুন:** cPanel → Node.js App → View Logs
2. **Browser Console:** F12 → Console tab দেখুন
3. **Hosting Support:** Support ticket create করুন
4. **Database Check:** phpPgAdmin দিয়ে tables verify করুন

---

## ✨ Congratulations!

আপনার **Social Ads Expert** application এখন live! 🎉

**Access করুন:**
- Admin Panel: `https://yourdomain.com`
- Client Portal: `https://yourdomain.com/portal/[PORTAL_ID]`

**সফল Deployment!** 🚀
