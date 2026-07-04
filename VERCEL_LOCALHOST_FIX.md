# Vercel Localhost API URL Issue - Fixed ✅

## 🔍 ROOT CAUSE

Your Vercel production deployment is making API requests to `http://localhost:4000` because:

**The environment variable `NEXT_PUBLIC_API_URL` is NOT set in Vercel.**

### How Next.js Environment Variables Work:

1. **Build Time:** Vercel builds your Next.js app
2. **Environment Variable Evaluation:** `process.env.NEXT_PUBLIC_API_URL` is evaluated **during build**
3. **If Not Set:** Falls back to `'http://localhost:4000'`
4. **Hardcoded in Build:** The localhost URL is then baked into the JavaScript bundle
5. **Runtime:** Browser tries to connect to localhost (fails in production)

---

## ✅ SOLUTION

### Two-Part Fix:

#### 1. Enhanced Error Detection (Code Changes)
Added runtime checks to detect missing environment variables in production and log clear error messages.

#### 2. Set Environment Variable in Vercel (You Must Do This)
Add `NEXT_PUBLIC_API_URL` in Vercel Dashboard.

---

## 📁 FILES MODIFIED (2 files)

### 1. `lib/config.ts` ✅

**Changes:**
- Added `getConfigApiUrl()` function with runtime environment detection
- Detects if running in production (hostname !== 'localhost')
- Logs critical error if `NEXT_PUBLIC_API_URL` not set in production
- Added browser-side configuration logging for debugging
- Added API call logging in getApiUrl()

**Why:**
- Helps identify the issue immediately in browser console
- Makes debugging easier
- Provides clear error messages

**Key additions:**
```typescript
// Runtime check for Vercel deployments
function getConfigApiUrl(): string {
  if (typeof window !== 'undefined') {
    const isProduction = window.location.hostname !== 'localhost';
    
    if (isProduction && !process.env.NEXT_PUBLIC_API_URL) {
      console.error('❌ CRITICAL: NEXT_PUBLIC_API_URL not set in production!');
    }
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}

// Logs in browser console:
// === Frontend Configuration ===
// API URL: http://localhost:4000 (or Railway URL)
// NEXT_PUBLIC_API_URL env var: NOT SET (or actual value)
```

### 2. `lib/api.ts` ✅

**Changes:**
- Enhanced logging for all API calls
- Logs API_BASE_URL on module load
- Logs NEXT_PUBLIC_API_URL env var value
- Detailed fetch logging with [fetchProducts] and [fetchProjects] prefixes
- Logs URL, HTTP status, error details

**Why:**
- Provides complete visibility into what URL is being called
- Makes it obvious if localhost is being used in production
- Helps debug network issues

**Key additions:**
```typescript
console.log('[lib/api.ts] API_BASE_URL:', API_BASE_URL);
console.log('[lib/api.ts] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'NOT SET');

console.log('[fetchProducts] Fetching from:', url);
console.error('[fetchProducts] HTTP Error:', response.status);
```

---

## ⚠️ CRITICAL: Set Environment Variable in Vercel

### You MUST Do This:

1. Go to **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-railway-app.up.railway.app` ⚠️ NO trailing slash
   - **Environments:** Check all (Production, Preview, Development)
5. Click **Save**
6. **IMPORTANT:** Go to **Deployments** tab
7. Click **"Redeploy"** on latest deployment
8. Wait for rebuild to complete

### Why Redeploy is Required:

Environment variables in Next.js are evaluated **at build time**. Simply adding the variable doesn't update already-built code. You must trigger a new build.

---

## 🧪 VERIFICATION

### After Redeploying to Vercel:

Open your Vercel URL in browser and check console. You should see:

```
=== Frontend Configuration ===
API URL: https://your-railway-app.up.railway.app
Frontend URL: https://your-vercel-app.vercel.app
Environment: production
Hostname: your-vercel-app.vercel.app
NEXT_PUBLIC_API_URL env var: https://your-railway-app.up.railway.app
==============================

[lib/api.ts] API_BASE_URL: https://your-railway-app.up.railway.app
[lib/api.ts] NEXT_PUBLIC_API_URL: https://your-railway-app.up.railway.app

[fetchProducts] Fetching from: https://your-railway-app.up.railway.app/api/products
[fetchProducts] Success, got 3 products
```

### If You Still See Localhost:

```
API URL: http://localhost:4000  ❌ PROBLEM!
NEXT_PUBLIC_API_URL env var: NOT SET  ❌ ENV VAR MISSING!
```

**This means:**
1. Environment variable not set in Vercel, OR
2. You didn't redeploy after adding it

**Fix:** Add variable and REDEPLOY.

---

## 📋 CHECKLIST

### Backend (Railway):
- [x] Backend deployed to Railway
- [x] Server binds to 0.0.0.0
- [x] Health check passes: `curl https://railway.app/health`
- [x] API endpoints respond: `curl https://railway.app/api/products`

### Frontend (Vercel):
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] Value is Railway URL (NO trailing slash)
- [ ] Applied to all environments (Production, Preview, Development)
- [ ] **Redeployed** after adding variable
- [ ] Browser console shows Railway URL (not localhost)
- [ ] API calls succeed
- [ ] Products/projects load

---

## 🚨 COMMON MISTAKES

### 1. ❌ Forgetting to Redeploy
**Problem:** Added env var but didn't redeploy  
**Fix:** Must redeploy to trigger new build

### 2. ❌ Trailing Slash in URL
**Problem:** `https://railway.app/` (with slash)  
**Fix:** `https://railway.app` (no slash)

### 3. ❌ Wrong Environment Variable Name
**Problem:** `API_URL` or `BACKEND_URL`  
**Fix:** Must be exactly `NEXT_PUBLIC_API_URL`

### 4. ❌ Not Applied to All Environments
**Problem:** Only set for Production  
**Fix:** Check all three: Production, Preview, Development

### 5. ❌ Railway Backend Not Working
**Problem:** Railway backend returns errors  
**Fix:** Verify Railway deployment first: `curl https://railway.app/health`

---

## 📊 DEBUGGING STEPS

### Step 1: Check Vercel Environment Variables
1. Vercel Dashboard → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_API_URL` exists
3. Verify value is correct Railway URL
4. Verify applied to all environments

### Step 2: Redeploy
1. Vercel Dashboard → Deployments
2. Click latest deployment → "Redeploy"
3. Wait for build to complete

### Step 3: Check Browser Console
1. Open your Vercel URL
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for configuration logs
5. Verify API_URL is Railway URL (not localhost)

### Step 4: Check Network Tab
1. DevTools → Network tab
2. Reload page
3. Look for API requests
4. Verify they go to Railway URL
5. Check response status (should be 200)

### Step 5: Verify Railway Backend
```bash
# Test health
curl https://your-railway-app.up.railway.app/health

# Test products
curl https://your-railway-app.up.railway.app/api/products
```

---

## 🎯 EXPECTED RESULT

### Before Fix:
```
Browser Console:
❌ API URL: http://localhost:4000
❌ [fetchProducts] Fetching from: http://localhost:4000/api/products
❌ Network Error: Failed to fetch

Network Tab:
❌ GET http://localhost:4000/api/products (failed)
```

### After Fix:
```
Browser Console:
✅ API URL: https://your-railway-app.up.railway.app
✅ [fetchProducts] Fetching from: https://your-railway-app.up.railway.app/api/products
✅ [fetchProducts] Success, got 3 products

Network Tab:
✅ GET https://your-railway-app.up.railway.app/api/products (200 OK)
```

---

## 🔄 DEPLOYMENT FLOW

```
1. Code Changes (Done) ✅
   ↓
2. Push to GitHub
   ↓
3. Backend: Railway auto-deploys ✅
   ↓
4. Backend: Get Railway URL (e.g., https://ngb-backend.up.railway.app)
   ↓
5. Vercel: Add NEXT_PUBLIC_API_URL = Railway URL ⚠️ YOU MUST DO THIS
   ↓
6. Vercel: Redeploy ⚠️ YOU MUST DO THIS
   ↓
7. Vercel: New build uses Railway URL ✅
   ↓
8. Frontend: API calls go to Railway instead of localhost ✅
```

---

## 📝 SUMMARY

### The Problem:
- Vercel production uses `http://localhost:4000`
- This happens because `NEXT_PUBLIC_API_URL` is not set in Vercel
- Next.js bakes env vars into build at build time
- Without env var, falls back to localhost

### The Fix:
1. **Code changes (done):** Enhanced logging to detect the issue
2. **Vercel setup (you must do):** Add `NEXT_PUBLIC_API_URL` and redeploy

### Files Changed:
- `lib/config.ts` - Runtime detection and logging
- `lib/api.ts` - Enhanced API call logging

### What You Must Do:
1. Set `NEXT_PUBLIC_API_URL` in Vercel (Railway URL)
2. **Redeploy** in Vercel
3. Check browser console to verify

---

**After you set the environment variable and redeploy, your production frontend will connect to Railway backend instead of localhost!** 🚀
