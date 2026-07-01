# 🚀 Deploy Backend NOW - Quick Guide

## Changes Made ✅

1. **backend/railway.json** - Railway deployment config
2. **backend/nixpacks.toml** - Build configuration
3. **backend/package.json** - Added `postinstall` script for Prisma
4. **backend/src/app.ts** - Improved CORS for multiple origins
5. **Pushed to GitHub** - Commit `40ea20a`

---

## 📋 Deployment Steps (15 minutes)

### 1️⃣ Create Railway Account (2 mins)
```
1. Go to: https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway
```

### 2️⃣ Deploy Backend (3 mins)
```
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose: ngb-interior-web-app
4. Railway will auto-detect configuration
```

### 3️⃣ Configure Root Directory (1 min)
```
1. Click on your service → "Settings"
2. Under "Build & Deploy":
   - Root Directory: backend
   - Build Command: npm ci && npm run build
   - Start Command: npm start
```

### 4️⃣ Add Environment Variables (5 mins)
```
In Railway → Variables tab, add:

DATABASE_URL=<your-neon-postgresql-connection-string>

NODE_ENV=production

JWT_SECRET=<generate-a-secure-64-character-random-string>

CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

FRONTEND_URL=https://YOUR_VERCEL_URL.vercel.app

PORT=4000
```

⚠️ **IMPORTANT:** 
- Get DATABASE_URL from your Neon dashboard (use connection pooling URL)
- Generate JWT_SECRET: Use a secure random string generator
- Get Cloudinary credentials from your Cloudinary dashboard
- Replace FRONTEND_URL with your actual Vercel URL

### 5️⃣ Get Railway URL (1 min)
```
1. After deployment completes
2. Go to: Settings → Domains
3. Copy the URL (e.g., https://ngb-backend.up.railway.app)
```

### 6️⃣ Configure Vercel (2 mins)
```
1. Go to Vercel project → Settings → Environment Variables
2. Add:
   Name: NEXT_PUBLIC_API_URL
   Value: https://YOUR_RAILWAY_URL.up.railway.app
   Environments: ✅ All
3. Click Save
4. Deployments → Redeploy latest
```

### 7️⃣ Update Railway FRONTEND_URL (1 min)
```
1. Go back to Railway → Variables
2. Update FRONTEND_URL to your actual Vercel URL
3. Railway auto-redeploys
```

---

## ✅ Test Deployment

### Backend Health Check:
```bash
curl https://YOUR_RAILWAY_URL.up.railway.app/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### Test Login API:
```bash
curl -X POST https://YOUR_RAILWAY_URL.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"ngb2024"}'
```

### Test Frontend:
1. Clear browser cache
2. Open Vercel URL on mobile
3. Go to `/admin/login`
4. Login with: `admin` / `ngb2024`
5. Check products page loads from API
6. Try deleting a product - should persist!

---

## 🎯 What You'll Get

**Backend URL Example:**
```
https://ngb-backend-production.up.railway.app
```

**Vercel Environment Variable:**
```
NEXT_PUBLIC_API_URL=https://ngb-backend-production.up.railway.app
```

---

## 🐛 Quick Troubleshooting

### Build fails?
- Check Railway logs: Dashboard → Deployments → Click deployment
- Verify root directory is `backend`

### CORS error?
- Ensure FRONTEND_URL in Railway matches your Vercel URL exactly
- No trailing slash

### Can't login?
- Check Railway logs for database connection
- May need to run: `railway run npx prisma db push`

---

## 📞 Need Help?

View detailed instructions: **BACKEND_DEPLOYMENT_INSTRUCTIONS.md**

---

**Ready to deploy? Start with Step 1! 🚀**

**Time Required:** ~15 minutes  
**Difficulty:** Easy (copy-paste configuration)
