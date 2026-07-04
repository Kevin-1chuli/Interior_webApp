# Vercel Deployment Guide - Connect to Railway Backend

## 🎯 Current Status

✅ **Backend Deployed:** https://interiorwebapp-production.up.railway.app  
⚠️ **Frontend:** Needs environment variable configuration in Vercel

---

## 🚀 Vercel Environment Variables Setup

### Step 1: Open Vercel Project Settings

1. Go to https://vercel.com/dashboard
2. Select your project (ngb-interior-web-app)
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add Required Environment Variables

Add these **exact** environment variables:

#### Variable 1: Backend API URL
```
Name:  NEXT_PUBLIC_API_URL
Value: https://interiorwebapp-production.up.railway.app
Environment: Production, Preview, Development (select all)
```

#### Variable 2: Frontend URL (Optional but recommended)
```
Name:  NEXT_PUBLIC_FRONTEND_URL
Value: https://your-vercel-domain.vercel.app
Environment: Production, Preview, Development (select all)
```

**Important Notes:**
- ✅ No trailing slash in `NEXT_PUBLIC_API_URL`
- ✅ No `/api` at the end of the URL
- ✅ Must start with `https://` (not `http://`)
- ✅ Select all three environments (Production, Preview, Development)

---

## 🔄 Step 3: Redeploy Frontend

After adding environment variables, you **MUST** trigger a new deployment for changes to take effect:

### Option A: Redeploy from Vercel Dashboard
1. Go to **Deployments** tab
2. Click the **three dots** (•••) on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (optional for faster build)
5. Click **Redeploy**

### Option B: Trigger deployment via Git Push
```bash
# Make a small change to trigger rebuild
git commit --allow-empty -m "Trigger Vercel redeploy with Railway backend URL"
git push
```

---

## ✅ Verification Steps

### 1. Check Build Logs
In Vercel deployment logs, you should see:
```
Building...
Environment Variables:
- NEXT_PUBLIC_API_URL: https://interiorwebapp-production.up.railway.app
```

### 2. Check Browser Console
After deployment, open your Vercel site and check browser console:

**Expected Output:**
```
=== Frontend Configuration ===
API URL: https://interiorwebapp-production.up.railway.app
Frontend URL: https://your-app.vercel.app
Environment: production
Hostname: your-app.vercel.app
NEXT_PUBLIC_API_URL env var: https://interiorwebapp-production.up.railway.app
==============================
```

**❌ Wrong Output (env var not set):**
```
API URL: http://localhost:4000
NEXT_PUBLIC_API_URL env var: NOT SET
❌ CRITICAL: NEXT_PUBLIC_API_URL not set in production!
```

### 3. Test API Connections

Open browser Network tab and test:
- Products page: Should fetch from `https://interiorwebapp-production.up.railway.app/api/products`
- Projects page: Should fetch from `https://interiorwebapp-production.up.railway.app/api/projects`

**All requests should return 200 OK**

---

## 🐛 Troubleshooting

### Issue: Still seeing localhost:4000 in production

**Cause:** Environment variable not set or deployment not rebuilt

**Fix:**
1. Double-check environment variable is saved in Vercel
2. Ensure you selected **all three environments** (Production, Preview, Development)
3. **Redeploy** the frontend (environment variables are baked in at build time)

### Issue: CORS errors in production

**Cause:** Railway backend CORS not configured for Vercel URL

**Fix:**
1. Add Vercel URL to Railway environment variables:
   ```
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   ```
2. Backend CORS is already configured to use `process.env.FRONTEND_URL`
3. Restart Railway service after adding variable

### Issue: API requests fail with 502/503

**Cause:** Railway backend might be down or restarting

**Check:**
1. Visit https://interiorwebapp-production.up.railway.app/health
2. Should return: `{"status":"ok","timestamp":"...","uptime":123}`
3. Check Railway logs for errors

---

## 📋 Environment Variables Checklist

- [ ] `NEXT_PUBLIC_API_URL` added in Vercel
- [ ] Value is `https://interiorwebapp-production.up.railway.app` (no trailing slash)
- [ ] Applied to Production, Preview, and Development environments
- [ ] Frontend redeployed after adding variables
- [ ] Browser console shows Railway URL (not localhost)
- [ ] Network requests go to Railway backend
- [ ] API calls return data successfully

---

## 🎉 Success Criteria

When everything is working:

✅ **Frontend URL:** https://your-app.vercel.app  
✅ **Backend URL:** https://interiorwebapp-production.up.railway.app  
✅ **Browser Console:** Shows Railway URL  
✅ **Network Tab:** All API calls go to Railway  
✅ **Data Loading:** Products and projects load from database  
✅ **Admin Login:** Works with Railway backend  

---

## 📝 Quick Reference

### Railway Backend
- **URL:** https://interiorwebapp-production.up.railway.app
- **Health Check:** https://interiorwebapp-production.up.railway.app/health
- **API Base:** https://interiorwebapp-production.up.railway.app/api

### Vercel Frontend
- **Required Env Var:** `NEXT_PUBLIC_API_URL`
- **Value:** `https://interiorwebapp-production.up.railway.app`
- **After Adding:** Must redeploy to apply

### Testing
```bash
# Test backend health
curl https://interiorwebapp-production.up.railway.app/health

# Test products endpoint
curl https://interiorwebapp-production.up.railway.app/api/products

# Test projects endpoint
curl https://interiorwebapp-production.up.railway.app/api/projects
```

---

## 🔐 Additional Configuration (Optional)

### Custom Domain Setup
If you have a custom domain:

1. **Backend (Railway):**
   - Add custom domain in Railway settings
   - Update `NEXT_PUBLIC_API_URL` in Vercel to custom domain

2. **Frontend (Vercel):**
   - Add custom domain in Vercel settings
   - Update `FRONTEND_URL` in Railway to custom domain

### Preview Deployments
Vercel preview deployments will also use the Railway backend if you selected "Preview" environment when adding variables.

---

**Last Updated:** Current deployment  
**Backend:** Railway (Stable ✅)  
**Frontend:** Vercel (Needs env var configuration ⚠️)
