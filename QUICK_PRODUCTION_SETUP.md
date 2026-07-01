# Quick Production Setup Guide

## 🚀 3-Step Production Deployment

All frontend code is ready. Follow these steps to go live:

---

## Step 1: Deploy Backend (15 mins)

### Using Railway (Recommended)

1. **Sign up:** [railway.app](https://railway.app)

2. **Create Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - **Important:** Set root directory to `backend`

3. **Add Environment Variables:**
   ```env
   DATABASE_URL=postgresql://user:pass@host.neon.tech:5432/dbname
   PORT=4000
   NODE_ENV=production
   JWT_SECRET=generate-a-super-secure-64-character-random-string-here
   FRONTEND_URL=https://your-vercel-app.vercel.app
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Configure Build:**
   - Build Command: `npm run build`
   - Start Command: `npm start`

5. **Deploy & Copy URL:**
   - Railway auto-deploys
   - Copy the URL (e.g., `https://ngb-backend.railway.app`)

6. **Run Migrations:**
   - Open Railway terminal
   - Run:
     ```bash
     npx prisma db push
     npx prisma generate
     npm run seed
     ```

---

## Step 2: Configure Vercel (5 mins)

1. **Go to Vercel Project Settings:**
   - Navigate to your project
   - Click **Settings → Environment Variables**

2. **Add Environment Variable:**
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://ngb-backend.railway.app` (your Railway URL from Step 1)
   - **Environments:** ✅ Production ✅ Preview ✅ Development
   - Click **Save**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**
   - Wait ~2 minutes for build

---

## Step 3: Update Backend CORS (5 mins)

1. **Open file:** `backend/src/app.ts`

2. **Find CORS configuration** and update:
   ```typescript
   const corsOptions = {
     origin: [
       'http://localhost:3000',
       'https://your-actual-vercel-url.vercel.app', // ← Change this
     ],
     credentials: true
   };
   
   app.use(cors(corsOptions));
   ```

3. **Commit and push:**
   ```bash
   git add backend/src/app.ts
   git commit -m "Update CORS for production"
   git push
   ```
   
   Railway will auto-redeploy.

---

## ✅ Test Production

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Open Vercel URL on mobile**
3. **Test admin login:** `/admin/login`
   - Username: `admin`
   - Password: `ngb2024` (change this immediately!)
4. **Test features:**
   - Products load from API ✓
   - Delete a product (should persist) ✓
   - Create a product with images ✓
   - Dashboard shows properly ✓

---

## 🔧 Quick Troubleshooting

### Can't Login
```bash
# In Railway terminal:
npm run seed
```

### CORS Error
- Check `backend/src/app.ts` has your Vercel URL
- Push changes to trigger redeploy

### API Not Found
- Verify `NEXT_PUBLIC_API_URL` in Vercel settings
- Check Railway backend is running (green status)

### Stale Data on Mobile
- Clear browser cache
- Try incognito mode
- Force refresh (Ctrl+Shift+R)

---

## 🎯 What Changed in Code

All frontend files now use:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
```

Instead of hardcoded:
```typescript
const apiUrl = 'http://localhost:4000'; // ❌ Old way
```

**Files updated:**
- `context/AdminAuthContext.tsx`
- `app/admin/products/page.tsx`
- `app/admin/products/new/page.tsx`
- `app/admin/projects/new/page.tsx`

**Utility files** (already abstracted):
- `lib/config.ts` - Centralized configuration
- `lib/api.ts` - API fetch utilities
- `lib/auth.ts` - Authentication utilities

---

## 📱 Expected Result

### Before
- Deleted products still showing ❌
- Changes not visible on mobile ❌
- API calls to localhost fail ❌

### After
- Products update in real-time ✅
- All changes visible everywhere ✅
- API calls to production backend ✅

---

## 🔐 Security Checklist

- [ ] Change default admin password (`admin`/`ngb2024`)
- [ ] Use secure JWT_SECRET (64+ random characters)
- [ ] Backend `.env` not committed to Git
- [ ] CORS configured with specific domains
- [ ] Database SSL enabled (Neon default)
- [ ] All URLs use HTTPS in production

---

## 📞 Need Help?

1. Check Railway logs for backend errors
2. Check Vercel logs for frontend errors
3. Check browser console (F12) for client errors
4. Verify all environment variables are set

**Common issue:** "Still seeing old data"
- Clear cache completely
- Try different browser/device
- Wait 5 minutes for CDN cache to expire

---

**Total Time:** ~25 minutes  
**Difficulty:** Easy (step-by-step guide)  
**Result:** Fully functional production app! 🎉

