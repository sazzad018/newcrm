# 🔐 cPanel এ Admin Login সেটআপ করার সহজ পদ্ধতি

## লগইন সিস্টেম কিভাবে কাজ করে?

আপনার অ্যাডমিন লগইন পাসওয়ার্ড একটি **Environment Variable** হিসেবে সংরক্ষিত থাকে যার নাম **`ADMIN_PASSWORD`**। এটি `.env` ফাইলে বা cPanel এর Node.js App settings এ সেট করতে হয়।

---

## 📋 পাসওয়ার্ড সেটআপ করার ৩টি পদ্ধতি

### পদ্ধতি ১: `.env` ফাইল দিয়ে (সবচেয়ে সহজ) ✅

1. **cPanel → File Manager** এ যান
2. আপনার app folder এ যান (যেমন: `public_html/social-ads/`)
3. `.env` ফাইল খুঁজে edit করুন (বা নতুন তৈরি করুন)
4. এই লাইনটি যোগ করুন:

```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/social_ads_db
SESSION_SECRET=random-secret-key-minimum-20-characters
NODE_ENV=production
PORT=5000
ADMIN_PASSWORD=আপনার_শক্তিশালী_পাসওয়ার্ড
```

5. **Save** করুন
6. **cPanel → Node.js App → Restart Application** click করুন
7. ✅ এখন লগইন পেজে গিয়ে আপনার পাসওয়ার্ড দিয়ে লগইন করুন!

---

### পদ্ধতি ২: cPanel Node.js App Settings দিয়ে

1. **cPanel → Setup Node.js App** এ যান
2. আপনার application খুঁজে **Edit** (পেন্সিল আইকন) click করুন
3. নিচে **Environment Variables** section খুঁজুন
4. Add করুন:
   - **Name:** `ADMIN_PASSWORD`
   - **Value:** আপনার পাসওয়ার্ড (যেমন: `MySecure@Password123`)
5. **Save** click করুন
6. Application **Restart** করুন
7. ✅ লগইন করুন!

---

### পদ্ধতি ৩: SSH দিয়ে (যদি SSH access থাকে)

```bash
# App folder এ যান
cd ~/public_html/social-ads/

# .env ফাইল edit করুন
nano .env

# এই লাইনটি যোগ করুন:
ADMIN_PASSWORD=আপনার_পাসওয়ার্ড

# Save করুন (Ctrl+X, তারপর Y, তারপর Enter)

# Application restart করুন
touch tmp/restart.txt
```

---

## 🔄 পাসওয়ার্ড পরিবর্তন করার নিয়ম

### যদি `.env` ফাইল ব্যবহার করেন:

1. **File Manager** → `.env` ফাইল edit করুন
2. `ADMIN_PASSWORD=পুরাতন_পাসওয়ার্ড` লাইনটি খুঁজুন
3. নতুন পাসওয়ার্ড দিয়ে replace করুন:
   ```env
   ADMIN_PASSWORD=নতুন_শক্তিশালী_পাসওয়ার্ড
   ```
4. **Save** করুন
5. **Node.js App → Restart** করুন
6. ✅ নতুন পাসওয়ার্ড দিয়ে লগইন করুন!

### যদি cPanel Environment Variables ব্যবহার করেন:

1. **Node.js App → Edit** করুন
2. **Environment Variables** section এ যান
3. `ADMIN_PASSWORD` খুঁজে **Edit** click করুন
4. নতুন পাসওয়ার্ড দিন
5. **Save** → **Restart**
6. ✅ নতুন পাসওয়ার্ড কাজ করবে!

---

## ⚠️ গুরুত্বপূর্ণ নিরাপত্তা টিপস

### শক্তিশালী পাসওয়ার্ড তৈরি করুন:
✅ **ভালো পাসওয়ার্ড:**
- `MyCompany@2025!Secure`
- `Admin#SocialAds$2025`
- `!Secure#Pass@789`

❌ **দুর্বল পাসওয়ার্ড:**
- `123456`
- `password`
- `admin`

### নিরাপত্তা নিশ্চিত করুন:
- ✅ পাসওয়ার্ড কমপক্ষে ১০ অক্ষরের হবে
- ✅ বড় হাতের অক্ষর, ছোট হাতের অক্ষর, সংখ্যা ও চিহ্ন ব্যবহার করুন
- ✅ `.env` ফাইলের permission `600` বা `644` রাখুন
- ❌ পাসওয়ার্ড কাউকে শেয়ার করবেন না
- ❌ `.env` ফাইল public folder এ রাখবেন না

---

## 🧪 পরীক্ষা করুন

পাসওয়ার্ড সেট করার পর:

1. আপনার website এ যান (যেমন: `https://yourdomain.com`)
2. লগইন পেজ দেখতে পাবেন
3. আপনার সেট করা পাসওয়ার্ড দিন
4. **"লগইন করুন"** click করুন
5. ✅ সফলভাবে Admin Dashboard এ প্রবেশ করবেন!

---

## 🔧 যদি সমস্যা হয়

### ❌ "Invalid password" error দেখাচ্ছে:

**Check করুন:**
- `.env` ফাইলে `ADMIN_PASSWORD` সঠিকভাবে সেট করা আছে কিনা
- Extra space বা line break নেই কিনা
- Application restart করেছেন কিনা

**Solution:**
```env
# ভুল (extra space আছে)
ADMIN_PASSWORD = mypassword

# সঠিক (no space)
ADMIN_PASSWORD=mypassword
```

---

### ❌ লগইন পেজ load হচ্ছে না:

**Check করুন:**
- Node.js App running আছে কিনা (cPanel → Node.js App)
- Database connection সঠিক আছে কিনা
- Application logs check করুন

**Solution:**
1. Node.js App page এ যান
2. **View Logs** click করুন
3. Error message দেখে fix করুন

---

### ❌ পাসওয়ার্ড ভুলে গেছেন:

**Solution:**
1. `.env` ফাইল বা Environment Variables এ যান
2. `ADMIN_PASSWORD` এর value দেখুন বা নতুন পাসওয়ার্ড সেট করুন
3. Application restart করুন

---

## 📝 সম্পূর্ণ `.env` ফাইল Example

```env
# Database Configuration
DATABASE_URL=postgresql://cpanel_user:your_db_password@localhost:5432/cpanel_user_socialads

# Session Security
SESSION_SECRET=your-random-secret-key-here-minimum-32-characters-recommended

# Environment
NODE_ENV=production
PORT=5000

# Admin Login
ADMIN_PASSWORD=YourSecurePassword@2025
```

---

## ✅ সম্পূর্ণ সেটআপ Checklist

- [ ] Database তৈরি করেছেন (`database.sql` run করেছেন)
- [ ] Files upload করেছেন
- [ ] `.env` ফাইল তৈরি করেছেন
- [ ] `DATABASE_URL` সঠিকভাবে configured করেছেন
- [ ] `SESSION_SECRET` সেট করেছেন
- [ ] `ADMIN_PASSWORD` সেট করেছেন ✅
- [ ] Node.js App configured করেছেন
- [ ] Application running আছে
- [ ] লগইন successfully হয়েছে! 🎉

---

## 🎯 পরবর্তী পদক্ষেপ

লগইন সফল হলে:

1. ✅ প্রথম client তৈরি করুন
2. ✅ Company information update করুন
3. ✅ Invoice settings configure করুন
4. ✅ System test করুন

---

**Happy Managing!** 🚀

আপনার **Social Ads Expert** সম্পূর্ণভাবে কাজ করছে! 🎉
