# Deploy to Railway Now - Quick Steps

## ✅ Issue Fixed

**Problem:** Backend failed to start on Railway because it tried to load `.env` file

**Solution:** Modified `server.ts` to only load `.env` in development. Railway provides environment variables directly.

---

## 🚀 Deploy in 3 Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Fix Railway startup - conditional env loading"
git push origin main
```

### Step 2: Railway Auto-Deploys

Railway will automatically:
1. Detect the push
2. Build the backend
3. Start the server

**Monitor in Railway Dashboard:**
- Go to Deployments tab
- Click active deployment
- Watch logs

### Step 3: Verify It Works

```bash
# Test health endpoint (replace with your Railway URL)
curl https://your-railway-app.up.railway.app/health

# Expected response:
{"status":"ok","timestamp":"2026-07-02T..."}
```

---

## 📋 Pre-Deployment Checklist

Verify these environment variables are set in Railway → Variables:

- [ ] `DATABASE_URL` - Neon pooling URL with `?sslmode=require`
- [ ] `JWT_SECRET` - Secure random string (32+ chars)
- [ ] `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
- [ ] `CLOUDINARY_API_KEY` - From Cloudinary dashboard
- [ ] `CLOUDINARY_API_SECRET` - From Cloudinary dashboard
- [ ] `FRONTEND_URL` - Your Vercel URL (https://your-app.vercel.app)
- [ ] `NODE_ENV` - Set to `production`

---

## 🔍 Expected Railway Logs

After deployment, you should see:

```
Installing dependencies...
✓ Dependencies installed

Generating Prisma Client...
✓ Prisma Client generated

Building TypeScript...
✓ Build complete

Starting server...
✓ JWT_SECRET configured
✓ DATABASE_URL configured
✓ Cloudinary configured: your-cloud-name
Starting server...
PORT: 3000
NODE_ENV: production
Connecting to database...
✓ Database connected
✓ Server running on port 3000
✓ Environment: production
✓ Health check available at /health
```

---

## ⚠️ If Deployment Fails

### Check Railway Logs for Error Messages

**Error: "JWT_SECRET is not set"**
→ Add `JWT_SECRET` in Railway → Variables

**Error: "DATABASE_URL is not set"**
→ Add `DATABASE_URL` in Railway → Variables

**Error: "Error connecting to database"**
→ Verify `DATABASE_URL` is correct Neon pooling URL

**Error: "Application failed to respond"**
→ Check all required environment variables are set

---

## 🎯 After Successful Deployment

### Update Vercel Frontend

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Update `NEXT_PUBLIC_API_URL` to your Railway URL
5. Redeploy frontend

### Test Full Stack

1. Open your Vercel frontend
2. Navigate to `/admin/login`
3. Try logging in
4. Check browser console for errors
5. Verify products load correctly

---

## 📁 What Was Changed

**Single file modified:** `backend/src/server.ts`

**Changes:**
- Conditional `.env` loading (development only)
- Improved error messages
- Enhanced startup logging

**Everything else unchanged:**
- No database schema changes
- No API route changes
- No authentication changes
- No frontend changes needed (yet)

---

## 🆘 Need Help?

Read these files for detailed information:

1. **`RAILWAY_STARTUP_FIX.md`** - Detailed explanation of the fix
2. **`backend/DEPLOY_TO_RAILWAY.md`** - Complete deployment guide
3. **`backend/RAILWAY_DEPLOYMENT.md`** - Troubleshooting guide

---

## ✅ Quick Verification Commands

```bash
# 1. Verify Railway deployment is live
curl https://your-railway-app.up.railway.app/health

# 2. Test products endpoint
curl https://your-railway-app.up.railway.app/api/products

# 3. Test auth endpoint (should return 400 - missing credentials)
curl -X POST https://your-railway-app.up.railway.app/api/auth/login
```

---

**You're ready to deploy! Push to GitHub and Railway will handle the rest.** 🚀
