# 🔧 Shared Hosting Fix Guide
## formatNumber Bug এর সমাধান

## ❌ সমস্যা
আপনার shared hosting এ:
- ক্লায়েন্ট দেখার পেজ সাদা হয়ে যাচ্ছে
- ইনভয়েস তৈরির সময় পেজ সাদা হয়ে যাচ্ছে
- Browser console এ error: **"formatNumber is not defined"**

## ✅ সমাধান (2টি পদ্ধতি)

---

### পদ্ধতি ১: Fixed File Upload করুন (সবচেয়ে সহজ)

#### ধাপ ১: Fixed File Download করুন
এই Replit project থেকে নতুন fixed file download করুন:
- File: `dist/public/assets/index-CqymNPEV.js`
- Size: প্রায় 618 KB (একটু বড় হবে fix এর কারণে)

#### ধাপ ২: Shared Hosting এ Upload করুন
1. **cPanel → File Manager** এ যান
2. আপনার app folder খুলুন (যেমন: `/public_html/social-ads/`)
3. Navigate করুন: `dist/public/assets/`
4. পুরানো `index-CqymNPEV.js` file **delete** করুন
5. নতুন fixed `index-CqymNPEV.js` file **upload** করুন

#### ধাপ ৩: Application Restart করুন
1. **cPanel → Setup Node.js App** এ যান
2. আপনার app select করুন
3. **"Restart"** button click করুন

#### ধাপ ৪: Browser Cache Clear করুন
1. Browser এ **Ctrl + Shift + Delete** চাপুন
2. "Cached images and files" select করুন
3. **"Clear data"** করুন
4. Application এ গিয়ে **Ctrl + F5** চাপুন (hard refresh)

---

### পদ্ধতি ২: Auto Fix Script চালান (Advanced)

#### ধাপ ১: Fix Script Upload করুন
1. এই file download করুন: `fix-frontend-bug.js`
2. আপনার shared hosting এর app root folder এ upload করুন

#### ধাপ ২: Script Run করুন
Terminal/SSH access থাকলে:
```bash
cd /path/to/your/app
node fix-frontend-bug.js
```

**অথবা** cPanel Node.js App দিয়ে:
1. cPanel → Setup Node.js App → Run command:
2. Command: `node fix-frontend-bug.js`
3. Execute করুন

#### ধাপ ৩: Application Restart করুন
- cPanel → Setup Node.js App → Restart

---

## 🧪 Test করুন

Fix সঠিকভাবে হয়েছে কিনা verify করুন:

### ১. ক্লায়েন্ট দেখুন:
1. Dashboard থেকে যেকোনো client এ click করুন
2. Client details page load হচ্ছে কিনা দেখুন
3. Balance, transactions সব দেখা যাচ্ছে কিনা check করুন

### ২. ইনভয়েস তৈরি করুন:
1. "ইনভয়েস" menu এ যান
2. "নতুন ইনভয়েস যোগ করুন" click করুন
3. Invoice form ঠিকমতো load হচ্ছে কিনা check করুন
4. Client select করতে পারছেন কিনা verify করুন

### ৩. Browser Console Check:
1. **F12** চাপুন
2. **Console** tab এ যান
3. কোনো error নেই তো দেখুন
4. যদি এখনও "formatNumber" error দেখায়, browser cache আবার clear করুন

---

## 📋 Verification Checklist

- [ ] Fixed file upload হয়েছে (618+ KB)
- [ ] Application restart হয়েছে
- [ ] Browser cache clear হয়েছে
- [ ] Hard refresh করেছি (Ctrl + F5)
- [ ] Client details page কাজ করছে
- [ ] Invoice form load হচ্ছে
- [ ] Browser console এ কোনো error নেই

---

## 🚨 এখনও সমস্যা থাকলে

### সম্ভাব্য কারণ:

#### ১. Browser Cache এখনও আছে
**সমাধান:**
```
Chrome/Edge: Settings → Privacy → Clear browsing data → Cached images
Firefox: Options → Privacy → Clear Data → Cached Web Content
```

#### ২. CDN/Cloudflare Cache
যদি CDN/Cloudflare ব্যবহার করেন:
- Cloudflare dashboard এ Purge Everything করুন
- CDN cache clear করুন

#### ৩. File Upload ঠিকমতো হয়নি
**Check করুন:**
```bash
# Terminal/SSH এ:
ls -lh dist/public/assets/index-CqymNPEV.js

# Output: 618K বা তার বেশি হতে হবে
```

#### ৪. Wrong File Path
**Verify করুন:**
```
সঠিক path: /home/username/public_html/app-name/dist/public/assets/
যদি ভিন্ন folder structure হয়, সেই অনুযায়ী adjust করুন
```

---

## 📞 Technical Details

### কি হয়েছিল?
Pre-built package এ `formatNumber` নামের একটা utility function missing ছিল। এই function টা:
- Client balance format করতে ব্যবহার হয়
- Invoice amounts display করতে লাগে
- Transaction amounts show করতে প্রয়োজন

### Fix কি করে?
```javascript
function formatNumber(num) {
  if (num === null || num === undefined || num === '') return '0';
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return '0';
  return value.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}
window.formatNumber = formatNumber;
```

এই function টা JavaScript bundle এর শুরুতে add করা হয়েছে।

---

## ✅ সফল হলে

এখন আপনি পারবেন:
- ✅ ক্লায়েন্ট details দেখতে
- ✅ Balance properly formatted দেখতে
- ✅ Invoice তৈরি করতে
- ✅ Transactions track করতে
- ✅ PDF invoice generate করতে

---

## 🎉 আরও সাহায্য

এখনও সমস্যা থাকলে:
1. Browser console এর screenshot পাঠান
2. cPanel error logs check করুন
3. আপনার hosting provider এর support এ যোগাযোগ করুন

**Happy Coding!** 🚀
