# Deployment Guide - NGB Interior Web App

## 🚀 Quick Deployment to Vercel

### Prerequisites
- GitHub repository with latest code
- Vercel account connected to GitHub
- Backend API deployed and accessible (Railway, Render, or similar)

---

## Frontend Deployment (Vercel)

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Add modern dashboard with environment variable support"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository: `Interior_webApp`
4. Click "Import"

### Step 3: Configure Environment Variables
In Vercel project settings, add these environment variables:

**Required:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**Optional:**
```
NEXT_PUBLIC_FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Important:** 
- Do NOT include `/api` at the end of `NEXT_PUBLIC_API_URL`
- The backend URL should be just the base URL (e.g., `https://api.ngbinterior.com`)
- Make sure backend allows CORS from your Vercel domain

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Visit your deployment URL

---

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `backend` folder as root

3. **Add Environment Variables**
   ```
   DATABASE_URL=your-neon-postgres-url
   PORT=4000
   NODE_ENV=production
   JWT_SECRET=your-super-secret-key
   FRONTEND_URL=https://your-vercel-app.vercel.app
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Configure Build Settings**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Root Directory: `backend`

5. **Deploy**
   - Railway will auto-deploy
   - Copy your Railway URL
   - Update Vercel's `NEXT_PUBLIC_API_URL` with this URL

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Create "New Web Service"
3. Connect GitHub repo
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add same environment variables as Railway
6. Deploy and copy URL

---

## Database Setup (Neon PostgreSQL)

Your database is already configured. Just ensure:

1. **Neon Dashboard**
   - Go to [neon.tech](https://neon.tech)
   - Copy connection string
   - Add to backend env variables

2. **Run Migrations** (if needed)
   ```bash
   # In backend directory
   npx prisma db push
   npx prisma generate
   npm run seed
   ```

---

## CORS Configuration

Update `backend/src/app.ts` to allow your Vercel domain:

```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app',
    'https://your-custom-domain.com' // if you have one
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

Then commit and push to trigger redeployment.

---

## Testing Production Deployment

### 1. Test Frontend
- Visit your Vercel URL
- Should see homepage
- Navigation should work

### 2. Test Admin Login
- Go to `/admin/login`
- Login with: `admin` / `ngb2024`
- Should redirect to dashboard
- Check browser console for errors

### 3. Test API Connection
- Open browser DevTools → Network tab
- Try to load products or projects
- API calls should go to your backend URL
- Check for CORS errors (if any, update backend CORS)

### 4. Test Mobile
- Open on mobile device or use Chrome DevTools device emulation
- Click hamburger menu
- Drawer should slide in smoothly
- All pages should be responsive

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., `admin.ngbinterior.com`)
3. Update DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_FRONTEND_URL` if needed

### Add Custom Domain to Backend
1. In Railway/Render, add custom domain
2. Update DNS records
3. Update Vercel's `NEXT_PUBLIC_API_URL`
4. Update backend CORS to allow new domain

---

## Environment Variables Reference

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_FRONTEND_URL=https://your-app.vercel.app
```

### Backend (Railway/Render)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
PORT=4000
NODE_ENV=production
JWT_SECRET=your-64-character-secret
FRONTEND_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-secret
```

---

## Troubleshooting

### "Network Error" in Production
**Problem:** API calls failing
**Solution:** 
- Check `NEXT_PUBLIC_API_URL` is correct in Vercel
- Verify backend is running (visit backend URL in browser)
- Check backend CORS allows your Vercel domain

### "Invalid Credentials" on Login
**Problem:** Can't login even with correct credentials
**Solution:**
- Ensure backend database has seeded admin user
- Run seed script on production: `npm run seed`
- Check JWT_SECRET is set on backend

### Mobile Menu Not Working
**Problem:** Hamburger doesn't open drawer
**Solution:**
- Clear browser cache
- Check for JavaScript errors in console
- Verify Vercel build succeeded

### Images Not Loading
**Problem:** Product/project images not displaying
**Solution:**
- Verify Cloudinary credentials in backend
- Check image URLs in database are valid
- Test Cloudinary upload in production

### Build Failed on Vercel
**Problem:** Vercel build errors
**Solution:**
- Check build logs in Vercel dashboard
- Ensure all dependencies in package.json
- Try local build: `npm run build`
- Fix TypeScript errors

---

## Security Checklist

Before going live:

- [ ] Changed default admin password (`admin` / `ngb2024`)
- [ ] JWT_SECRET is secure (64+ random characters)
- [ ] Backend .env is NOT committed to Git
- [ ] CORS configured with specific domains (not `*`)
- [ ] Database has SSL enabled (Neon default)
- [ ] Cloudinary credentials are secure
- [ ] No API keys exposed in frontend code
- [ ] HTTPS enabled on all URLs

---

## Monitoring

### Vercel Analytics
- Enable in Vercel dashboard → Analytics
- Track page views, performance

### Error Monitoring (Optional)
- Add Sentry for error tracking
- Monitor API errors in Railway/Render logs

### Uptime Monitoring (Optional)
- Use UptimeRobot or Pingdom
- Monitor backend API availability

---

## Rollback Strategy

If deployment breaks:

1. **Frontend (Vercel)**
   - Go to Deployments tab
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Backend (Railway/Render)**
   - Go to Deployments
   - Redeploy previous version
   - Or fix and push new commit

3. **Database**
   - Neon has automatic backups
   - Can restore from backup in dashboard

---

## Success Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] Admin login works
- [ ] Dashboard displays properly
- [ ] Products page loads data from API
- [ ] Projects page loads data from API
- [ ] Staff page works (for OWNER)
- [ ] Mobile hamburger menu works
- [ ] Images upload via Cloudinary
- [ ] Password reset emails work (if configured)
- [ ] No console errors in production

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Vercel build logs
3. Check Railway/Render backend logs
4. Verify all environment variables are set correctly
5. Test API endpoints directly (Postman/curl)

Your app should now be live! 🎉

**Frontend:** `https://your-app.vercel.app`
**Backend:** `https://your-backend.railway.app`
**Admin:** `https://your-app.vercel.app/admin`
