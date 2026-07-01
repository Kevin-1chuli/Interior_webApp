# Backend Deployment Instructions

## 🚀 Deploy to Railway

### Step 1: Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Click "Login with GitHub"
3. Authorize Railway to access your repositories

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `ngb-interior-web-app`
4. Railway will detect the repository

### Step 3: Configure Root Directory
1. After selecting the repo, click on "Settings"
2. Under "Build & Deploy" section, set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`

### Step 4: Add Environment Variables
In Railway project → Variables tab, add these:

```env
DATABASE_URL=<your-neon-postgresql-connection-string-with-pooling>

NODE_ENV=production

JWT_SECRET=<generate-secure-64-character-random-string>

CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

FRONTEND_URL=https://your-vercel-app.vercel.app

PORT=4000
```

**⚠️ Security Notes:**
- **DATABASE_URL**: Get from Neon dashboard (use connection pooling URL ending in `-pooler`)
- **JWT_SECRET**: Generate with: `openssl rand -base64 64` or use a password generator
- **Cloudinary credentials**: Get from Cloudinary dashboard → Settings → Access Keys
- **FRONTEND_URL**: Replace with your actual Vercel deployment URL

### Step 5: Deploy
1. Railway will automatically start deploying
2. Wait 3-5 minutes for build to complete
3. Click on your service → "Settings" → "Domains"
4. Copy the Railway URL (e.g., `https://ngb-backend.up.railway.app`)

### Step 6: Run Database Migrations
1. In Railway dashboard, click on your service
2. Go to "Variables" tab and add a new variable temporarily:
   ```
   RAILWAY_RUN_BUILD_COMMAND=npx prisma db push
   ```
3. Trigger a redeploy
4. After successful deployment, remove this variable

Alternatively, use Railway CLI:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run npx prisma db push

# Seed database (optional, creates admin user)
railway run npx prisma db seed
```

### Step 7: Test Backend
Visit your Railway URL + `/health`:
```
https://your-backend.railway.app/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-07-01T..."
}
```

Test API endpoints:
```bash
# Health check
curl https://your-backend.railway.app/health

# Test login
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"ngb2024"}'
```

---

## 🔧 Configure Vercel (Frontend)

### Step 1: Add Environment Variable
1. Go to your Vercel project
2. Navigate to: **Settings → Environment Variables**
3. Add new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend.railway.app` (your Railway URL)
   - **Environments**: ✅ Production ✅ Preview ✅ Development
4. Click **Save**

### Step 2: Redeploy Frontend
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click "..." → "Redeploy"
4. Wait 2-3 minutes

### Step 3: Update Backend CORS
1. Update `FRONTEND_URL` in Railway:
   - Go to Railway → Variables
   - Update `FRONTEND_URL` to your actual Vercel URL
   - Example: `https://ngb-interior.vercel.app`
2. Railway will auto-redeploy

---

## ✅ Verification Checklist

After deployment:

- [ ] Railway backend deployed successfully
- [ ] Backend health check works: `/health`
- [ ] Database connected (check Railway logs)
- [ ] Cloudinary configured (check logs for "Cloudinary configured")
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] Vercel redeployed with new env var
- [ ] `FRONTEND_URL` in Railway matches Vercel URL
- [ ] Can login at Vercel URL + `/admin/login`
- [ ] Products load from API (not static data)
- [ ] Can create/delete products
- [ ] Images upload via Cloudinary

---

## 🐛 Troubleshooting

### Build fails on Railway
**Check:**
- Root directory is set to `backend`
- All environment variables are set
- DATABASE_URL is correct

**View logs:**
- Railway dashboard → Your service → "Deployments" → Click on deployment

### "CORS Error" in browser
**Fix:**
- Update `FRONTEND_URL` in Railway to your Vercel URL
- Ensure it matches exactly (no trailing slash)
- Redeploy backend

### "Cannot connect to database"
**Fix:**
- Verify DATABASE_URL in Railway variables
- Check Neon database is active
- Ensure connection pooling URL is used (contains `-pooler`)

### Admin login fails
**Fix:**
```bash
# Seed database
railway run npx prisma db seed
```

### Images not uploading
**Fix:**
- Verify Cloudinary credentials in Railway
- Check Railway logs for Cloudinary errors

---

## 📝 Final Configuration Summary

### Railway Backend URL:
```
https://[your-app-name].up.railway.app
```

### Vercel Environment Variable:
```env
NEXT_PUBLIC_API_URL=https://[your-app-name].up.railway.app
```

### Test Production:
1. Clear browser cache
2. Visit Vercel URL on mobile
3. Login at `/admin/login`
4. Test CRUD operations
5. Verify data persists

---

**Deployment Time:** ~15 minutes  
**Status:** Ready to deploy 🚀
