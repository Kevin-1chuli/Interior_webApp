# Deploy to Railway - Quick Guide

## ✅ Pre-Deployment Checklist

Your backend is **ready for Railway deployment**. All files are configured correctly.

### Verified Components:
- ✅ Build works (`npm run build` succeeds)
- ✅ Start script configured (`node dist/server.js`)
- ✅ Health check endpoint at `/health`
- ✅ Nixpacks configuration file (`nixpacks.toml`)
- ✅ CORS configured for Vercel frontend
- ✅ Prisma client auto-generates
- ✅ Environment variables externalized
- ✅ No Oracle Cloud dependencies
- ✅ `.env` file in `.gitignore`

---

## 🚀 Railway Deployment Steps

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Prepare backend for Railway deployment"
git push origin main
```

### Step 2: Create Railway Project

1. Go to **https://railway.app**
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository: **`Interior_webApp`**
6. Railway will detect the Node.js project

### Step 3: Configure Root Directory

Railway needs to know the backend is in a subfolder:

1. In Railway dashboard → Click your service
2. Go to **Settings** tab
3. Scroll to **"Root Directory"**
4. Enter: `backend`
5. Click **Save**

### Step 4: Add Environment Variables

In Railway dashboard → **Variables** tab, add these:

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secure-random-jwt-secret-at-least-32-characters
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

**Important:**
- Use your **Neon pooling connection URL** (not direct connection)
- Generate a secure `JWT_SECRET`: `openssl rand -base64 32`
- Copy exact values from your Cloudinary dashboard
- Set `FRONTEND_URL` to your **actual Vercel URL** (no trailing slash)

### Step 5: Deploy

After adding variables, Railway will automatically start building and deploying.

**Monitor the deployment:**
1. Click on your service
2. Go to **Deployments** tab
3. Click the active deployment
4. Watch the build logs

**Expected output:**
```
✓ Installing dependencies (npm ci)
✓ Generating Prisma Client
✓ Building TypeScript (npm run build)
✓ Starting server (npm start)
✓ Database connected
✓ Server running on port 3000
```

### Step 6: Generate Public URL

1. In Railway dashboard → **Settings** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Copy the generated URL (e.g., `https://ngb-backend-production.up.railway.app`)

### Step 7: Test Deployment

```bash
# Test health check
curl https://your-railway-app.up.railway.app/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"2026-07-02T..."}
```

**Test API endpoints:**
```bash
# Should return empty array or products
curl https://your-railway-app.up.railway.app/api/products

# Should return 400 (missing credentials)
curl -X POST https://your-railway-app.up.railway.app/api/auth/login
```

### Step 8: Update Vercel Frontend

1. Go to **Vercel Dashboard**
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update or add `NEXT_PUBLIC_API_URL`:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-railway-app.up.railway.app`
   - **Environments:** Production, Preview, Development
5. Click **Save**
6. Go to **Deployments** tab
7. Click **"Redeploy"** on latest deployment

### Step 9: Test Full Stack

1. Open your Vercel frontend URL
2. Navigate to `/admin/login`
3. Try logging in
4. Open browser DevTools → Console
5. Check for any API errors
6. Verify products load on furniture page

---

## 🔍 Troubleshooting

### Build Fails

**Check Railway logs:**
- Railway Dashboard → Deployments → Click failed deployment
- Read error messages

**Common issues:**
- Missing `nixpacks.toml` → Should be in `backend/` folder
- TypeScript errors → Fix locally and push
- Missing dependencies → Check `package.json`

### Database Connection Error

**Verify:**
- `DATABASE_URL` is correct
- URL includes `?sslmode=require`
- Neon database is accessible

**Test locally:**
```bash
cd backend
set DATABASE_URL=your-neon-url
npx prisma db push
```

### Server Won't Start

**Check Railway logs for:**
- Missing environment variables (JWT_SECRET, DATABASE_URL, etc.)
- Database connection errors
- Port binding errors (Railway sets PORT automatically)
- Prisma client generation errors

**Common error messages and fixes:**

1. **"JWT_SECRET is not set"**
   - Go to Railway → Variables
   - Add `JWT_SECRET` variable
   - Generate secure value: `openssl rand -base64 32`

2. **"DATABASE_URL is not set"**
   - Go to Railway → Variables
   - Add `DATABASE_URL` variable
   - Use Neon pooling URL with `?sslmode=require`

3. **"Application failed to respond"**
   - Server is exiting during startup
   - Check all required environment variables are set
   - Verify DATABASE_URL is accessible from Railway
   - Check logs for specific error message

### CORS Errors

**Verify:**
- `FRONTEND_URL` in Railway matches Vercel URL **exactly**
- No trailing slash in `FRONTEND_URL`
- Vercel `NEXT_PUBLIC_API_URL` points to Railway URL

**Check:**
```bash
# View Railway logs
Railway Dashboard → Deployments → View Logs
```

### Frontend Can't Connect

**Verify:**
- Vercel `NEXT_PUBLIC_API_URL` is correct
- Railway domain is publicly accessible
- No typos in environment variables
- Frontend was redeployed after variable change

---

## 📊 Monitoring

### View Logs

1. Railway Dashboard → Your Service
2. Click **Deployments** tab
3. Click active deployment
4. Scroll to see real-time logs

### Restart Service

1. Railway Dashboard → Settings
2. Scroll to **"Service"**
3. Click **"Restart"**

### Metrics

1. Railway Dashboard → Your Service
2. Click **"Metrics"** tab
3. View CPU, Memory, Network usage

---

## 🔐 Security Checklist

- [x] `.env` file is in `.gitignore`
- [x] No secrets in code
- [x] JWT_SECRET is strong (32+ chars)
- [x] DATABASE_URL includes `sslmode=require`
- [x] CORS restricts to Vercel domain
- [x] HTTPS enabled (Railway provides this)

---

## 🔄 Update Process

After making code changes:

```bash
# Commit and push
git add .
git commit -m "Update backend"
git push origin main
```

Railway will:
1. Detect the push
2. Automatically rebuild
3. Deploy new version
4. Keep old version running until new one is healthy

---

## 📝 Environment Variables Reference

| Variable | Required | Example | Where to Get |
|----------|----------|---------|--------------|
| `DATABASE_URL` | ✅ | `postgresql://user:pass@host/db?sslmode=require` | Neon dashboard (use pooling URL) |
| `JWT_SECRET` | ✅ | `abc123...` (32+ chars) | Generate: `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | ✅ | `dgxyz123` | Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | ✅ | `123456789012345` | Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | ✅ | `abcdefghijklmnop` | Cloudinary dashboard |
| `FRONTEND_URL` | ✅ | `https://your-app.vercel.app` | Your Vercel URL (no slash at end) |
| `NODE_ENV` | ✅ | `production` | Set to `production` |
| `PORT` | ❌ | Auto-set by Railway | Don't add manually |

---

## ✅ Deployment Complete!

Once all steps are done:

- ✅ Backend running on Railway
- ✅ Frontend running on Vercel
- ✅ Database on Neon
- ✅ Images on Cloudinary
- ✅ HTTPS enabled
- ✅ CORS configured
- ✅ Health checks passing

**Your full stack is now live!** 🎉

---

## 📚 Additional Resources

- **Railway Documentation:** https://docs.railway.app
- **Nixpacks Documentation:** https://nixpacks.com
- **Prisma Documentation:** https://www.prisma.io/docs
- **Neon Documentation:** https://neon.tech/docs

---

## 🆘 Need Help?

- Railway Discord: https://discord.gg/railway
- Railway Support: https://railway.app/help
- Check Railway status: https://status.railway.app

**Good luck with your deployment!** 🚀
