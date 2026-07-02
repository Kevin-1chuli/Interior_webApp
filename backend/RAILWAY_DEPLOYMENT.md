# Railway Deployment Guide

## Prerequisites

- GitHub repository with your code
- Railway account (https://railway.app)
- Neon PostgreSQL database
- Cloudinary account

---

## Step 1: Prepare Your Repository

Ensure these files exist in your `backend/` folder:

- ✅ `package.json` - with correct build and start scripts
- ✅ `nixpacks.toml` - Railway build configuration
- ✅ `prisma/schema.prisma` - Database schema
- ✅ `.env.example` - Template for environment variables
- ✅ Health check endpoint at `/health`

**Verify build works locally:**
```bash
cd backend
npm ci
npx prisma generate
npm run build
npm start
```

---

## Step 2: Create Railway Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your repository: `Interior_webApp`
6. Railway will detect the backend folder automatically

---

## Step 3: Configure Root Directory

Railway needs to know your backend is in a subfolder:

1. In Railway project → **Settings**
2. Scroll to **"Root Directory"**
3. Set to: `backend`
4. Click **"Save"**

---

## Step 4: Add Environment Variables

In Railway project → **Variables** tab, add:

### Required Variables:

```env
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
JWT_SECRET=your-secure-random-jwt-secret-minimum-32-characters
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Optional Variables:
- `PORT` - Railway sets this automatically, usually not needed

**Important:**
- Use your **Neon connection pooling URL** for `DATABASE_URL` (ends with `?sslmode=require`)
- Generate a secure random string for `JWT_SECRET` (use: `openssl rand -base64 32`)
- Set `FRONTEND_URL` to your actual Vercel deployment URL

---

## Step 5: Deploy

Railway will automatically deploy when you add the variables.

**Monitor deployment:**
1. Go to **Deployments** tab
2. Click on the active deployment
3. View build logs in real-time

**Expected build steps:**
```
✓ Installing dependencies (npm ci)
✓ Generating Prisma Client (npx prisma generate)
✓ Building TypeScript (npm run build)
✓ Starting server (npm start)
```

---

## Step 6: Verify Deployment

### Get Your Backend URL

1. In Railway project → **Settings** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. Copy the generated URL (e.g., `https://ngb-backend-production.up.railway.app`)

### Test Health Check

```bash
curl https://your-railway-app.up.railway.app/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"2026-07-02T..."}
```

### Test API Endpoints

```bash
# Test products endpoint
curl https://your-railway-app.up.railway.app/api/products

# Test login endpoint (should return 400 for missing credentials)
curl -X POST https://your-railway-app.up.railway.app/api/auth/login
```

---

## Step 7: Update Frontend Environment Variable

### In Vercel:

1. Go to Vercel Dashboard
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL`:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-railway-app.up.railway.app`
5. Click **Save**
6. Redeploy your frontend (Deployments → Redeploy)

---

## Step 8: Test Full Stack

1. Open your Vercel frontend URL
2. Navigate to `/admin/login`
3. Try logging in with admin credentials
4. Verify products load on furniture page
5. Check browser console for any API errors

---

## Troubleshooting

### Build Fails

**Check Railway logs for errors:**
1. Go to Deployments tab
2. Click failed deployment
3. Read error messages

**Common issues:**
- Missing `nixpacks.toml` → Create it
- TypeScript errors → Fix and push
- Missing dependencies → Check `package.json`

### Database Connection Errors

**Verify:**
- `DATABASE_URL` is correct Neon pooling connection string
- Connection string includes `?sslmode=require`
- Prisma generated successfully during build

**Test locally:**
```bash
cd backend
DATABASE_URL="your-neon-url" npx prisma db push
```

### CORS Errors in Frontend

**Verify:**
- `FRONTEND_URL` in Railway matches your Vercel URL exactly
- No trailing slash in `FRONTEND_URL`
- Vercel `NEXT_PUBLIC_API_URL` points to Railway URL

**Check backend logs:**
```
Railway project → Deployments → View Logs
```

### Health Check Fails

**Ensure:**
- `/health` endpoint exists in `backend/src/app.ts`
- Server is starting successfully
- PORT is not hardcoded (use `process.env.PORT`)

---

## Update Deployment (After Code Changes)

Railway automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Railway will:
1. Detect the push
2. Rebuild automatically
3. Deploy new version
4. Keep old version running until new one is healthy

---

## Environment Variables Reference

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `DATABASE_URL` | ✅ | `postgresql://user:pass@host/db?sslmode=require` | Neon pooling URL |
| `JWT_SECRET` | ✅ | `super-secret-random-string-32-chars-min` | Min 32 characters |
| `CLOUDINARY_CLOUD_NAME` | ✅ | `your-cloud-name` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | ✅ | `123456789012345` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | ✅ | `abcdefghijklmnop` | From Cloudinary dashboard |
| `FRONTEND_URL` | ✅ | `https://your-app.vercel.app` | No trailing slash |
| `NODE_ENV` | ✅ | `production` | Set to production |
| `PORT` | ❌ | Auto-set by Railway | Don't manually set |

---

## Monitoring

### View Logs

1. Railway project → **Deployments**
2. Click active deployment
3. View real-time logs

### Restart Service

1. Railway project → **Settings**
2. Scroll to **"Service"**
3. Click **"Restart"**

### Rollback Deployment

1. Railway project → **Deployments**
2. Find previous successful deployment
3. Click **"⋮"** menu → **"Rollback to this version"**

---

## Cost Optimization

Railway offers:
- **Free tier:** $5 credit/month
- **Pay-as-you-go:** After free credits

**Tips to reduce costs:**
- Use Neon's free tier (pooling connection)
- Optimize build time (use `npm ci` not `npm install`)
- Monitor resource usage in Railway dashboard

---

## Security Best Practices

✅ **Do:**
- Use environment variables for all secrets
- Generate strong random `JWT_SECRET` (32+ chars)
- Use HTTPS for production (Railway provides this)
- Keep dependencies updated
- Monitor deployment logs

❌ **Don't:**
- Commit `.env` file to git
- Hardcode secrets in code
- Use weak JWT secrets
- Expose internal endpoints publicly

---

## Quick Reference Commands

### Local Development
```bash
cd backend
npm run dev
```

### Local Build Test
```bash
cd backend
npm ci
npx prisma generate
npm run build
npm start
```

### Generate Secure JWT Secret
```bash
openssl rand -base64 32
```

### Test Health Endpoint
```bash
curl https://your-railway-app.up.railway.app/health
```

### Push Changes
```bash
git add .
git commit -m "Your message"
git push origin main
```

---

## Support

**Railway Documentation:** https://docs.railway.app  
**Railway Discord:** https://discord.gg/railway  
**Neon Documentation:** https://neon.tech/docs

---

## Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] Railway project created
- [ ] Root directory set to `backend`
- [ ] All environment variables added
- [ ] Deployment successful (green status)
- [ ] Health check passes
- [ ] Railway domain generated
- [ ] Vercel `NEXT_PUBLIC_API_URL` updated
- [ ] Frontend redeployed
- [ ] Login works from frontend
- [ ] Products load correctly
- [ ] No CORS errors in browser console

**Your backend is now live on Railway! 🚀**
