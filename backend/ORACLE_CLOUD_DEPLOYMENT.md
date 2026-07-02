# Oracle Cloud Infrastructure (OCI) Deployment Guide

## Prerequisites

- Oracle Cloud Linux VM (Ubuntu 20.04+ or Oracle Linux 8+)
- SSH access to the VM
- Domain name (optional, but recommended)
- Neon PostgreSQL database (already configured)
- Cloudinary account (already configured)

---

## Initial Server Setup

### 1. Connect to Your OCI VM

```bash
ssh -i /path/to/your/private-key.pem ubuntu@<your-vm-ip>
```

### 2. Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Install Node.js 18+

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should be v18.x or higher
npm --version
```

### 4. Install PM2 Globally

```bash
sudo npm install -g pm2
pm2 --version
```

### 5. Install Git

```bash
sudo apt install -y git
```

---

## Deploy Backend Application

### 1. Clone Repository

```bash
cd /home/ubuntu
git clone https://github.com/Kevin-1chuli/Interior_webApp.git
cd Interior_webApp/backend
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Create Production Environment File

```bash
nano .env
```

**Add these environment variables:**

```env
# Database (Neon PostgreSQL)
DATABASE_URL="<your-neon-connection-string-with-pooling>"

# Server
PORT=4000
NODE_ENV=production

# JWT Secret (use a secure random string)
JWT_SECRET="<your-secure-jwt-secret>"

# CORS (Your Vercel frontend URL)
FRONTEND_URL="https://your-vercel-app.vercel.app"

# Cloudinary
CLOUDINARY_CLOUD_NAME="<your-cloud-name>"
CLOUDINARY_API_KEY="<your-api-key>"
CLOUDINARY_API_SECRET="<your-api-secret>"
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Push Database Schema (First Time Only)

```bash
npx prisma db push
```

### 6. Seed Database (Optional)

```bash
npm run seed
```

### 7. Build Application

```bash
npm run build
```

**Verify build output:**
- Check that `dist/` folder was created
- Check that `dist/server.js` exists

### 8. Create Logs Directory

```bash
mkdir -p logs
```

### 9. Start Application with PM2

```bash
pm2 start ecosystem.config.js
```

### 10. Verify Application is Running

```bash
pm2 status
pm2 logs ngb-backend --lines 50
```

### 11. Test Health Endpoint

```bash
curl http://localhost:4000/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"2026-07-01T..."}
```

---

## Configure Firewall

### 1. Open Port 4000

**For Ubuntu with UFW:**
```bash
sudo ufw allow 4000/tcp
sudo ufw enable
sudo ufw status
```

**For Oracle Linux with firewalld:**
```bash
sudo firewall-cmd --permanent --add-port=4000/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports
```

### 2. Configure OCI Security List

1. Go to OCI Console → Networking → Virtual Cloud Networks
2. Select your VCN
3. Click on "Security Lists"
4. Click on your security list
5. Add Ingress Rule:
   - **Source CIDR:** `0.0.0.0/0`
   - **IP Protocol:** TCP
   - **Destination Port Range:** `4000`
6. Save

---

## Setup PM2 Startup Script

### 1. Generate Startup Script

```bash
pm2 startup
```

**Follow the command output** - it will give you a command like:
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

**Copy and run that command.**

### 2. Save PM2 Process List

```bash
pm2 save
```

### 3. Test Reboot

```bash
sudo reboot
```

**After reboot, check if PM2 auto-started:**
```bash
ssh -i /path/to/your/private-key.pem ubuntu@<your-vm-ip>
pm2 list
```

---

## Setup Nginx Reverse Proxy (Recommended)

### 1. Install Nginx

```bash
sudo apt install -y nginx
```

### 2. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/ngb-backend
```

**Add this configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/ngb-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Open Port 80

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp  # For HTTPS
```

### 5. Configure OCI Security List for HTTP/HTTPS

Add ingress rules for ports:
- **80** (HTTP)
- **443** (HTTPS)

---

## Setup SSL with Let's Encrypt (Optional but Recommended)

### 1. Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com
```

**Follow the prompts:**
- Enter your email
- Agree to terms
- Choose to redirect HTTP to HTTPS (recommended)

### 3. Auto-Renewal Test

```bash
sudo certbot renew --dry-run
```

---

## Update Vercel Environment Variable

### 1. Get Your Backend URL

**If using domain:**
```
https://your-domain.com
```

**If using IP only:**
```
http://your-vm-ip:4000
```

### 2. Update Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Update `NEXT_PUBLIC_API_URL`:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-domain.com` (or `http://your-vm-ip:4000`)
5. Redeploy frontend

---

## Useful PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs ngb-backend

# View last 100 lines
pm2 logs ngb-backend --lines 100

# Monitor resources
pm2 monit

# Restart application
pm2 restart ngb-backend

# Stop application
pm2 stop ngb-backend

# Delete application from PM2
pm2 delete ngb-backend

# Save current process list
pm2 save

# View detailed info
pm2 show ngb-backend
```

---

## Update Application (After Changes)

### 1. Pull Latest Changes

```bash
cd /home/ubuntu/Interior_webApp/backend
git pull origin main
```

### 2. Install New Dependencies (if any)

```bash
npm ci
```

### 3. Regenerate Prisma Client (if schema changed)

```bash
npx prisma generate
```

### 4. Push Database Changes (if schema changed)

```bash
npx prisma db push
```

### 5. Rebuild Application

```bash
npm run build
```

### 6. Restart with PM2

```bash
pm2 restart ngb-backend
```

### 7. Verify

```bash
pm2 logs ngb-backend --lines 50
curl http://localhost:4000/health
```

---

## Troubleshooting

### Application Won't Start

**Check logs:**
```bash
pm2 logs ngb-backend --err --lines 100
```

**Common issues:**
- Missing environment variables in `.env`
- Database connection failure (check `DATABASE_URL`)
- Port already in use (change `PORT` in `.env`)

### Database Connection Errors

**Verify connection string:**
```bash
cd /home/ubuntu/Interior_webApp/backend
npx prisma db push --preview-feature
```

### Port Not Accessible from Outside

**Check firewall:**
```bash
sudo ufw status
```

**Check OCI Security List:**
- Ensure ingress rule for port 4000 exists
- Check CIDR is `0.0.0.0/0`

### Application Crashes Frequently

**Check memory:**
```bash
free -h
pm2 monit
```

**Increase max memory in `ecosystem.config.js`:**
```javascript
max_memory_restart: '2G'  // Increase from 1G
```

---

## Security Best Practices

### 1. Firewall Rules

Only open necessary ports:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 4000 (Backend - if not using Nginx)

### 2. Environment Variables

Never commit `.env` file to git. Always use secure random strings for:
- `JWT_SECRET`
- Database passwords

### 3. Keep System Updated

```bash
sudo apt update && sudo apt upgrade -y
```

### 4. Monitor Logs

```bash
pm2 logs ngb-backend
```

### 5. Backup Database

Neon provides automatic backups, but you can also:
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

---

## Production Checklist

- [ ] Node.js 18+ installed
- [ ] PM2 installed globally
- [ ] Repository cloned
- [ ] Dependencies installed (`npm ci`)
- [ ] `.env` file created with all variables
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Application built (`npm run build`)
- [ ] Logs directory created
- [ ] Application started with PM2 (`pm2 start ecosystem.config.js`)
- [ ] PM2 startup script configured
- [ ] Firewall configured (UFW or firewalld)
- [ ] OCI Security List configured
- [ ] Nginx installed and configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] Vercel `NEXT_PUBLIC_API_URL` updated
- [ ] Frontend redeployed
- [ ] Health endpoint tested
- [ ] Login tested from frontend

---

## Quick Deployment Commands

After cloning the repository to Oracle Cloud VM:

```bash
# Navigate to backend
cd Interior_webApp/backend

# Install dependencies
npm ci

# Create .env file (add your actual credentials)
nano .env

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Build application
npm run build

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Setup auto-start
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs ngb-backend --lines 50

# Test health endpoint
curl http://localhost:4000/health
```

**Your backend is now deployed! 🎉**

---

**Support:** If you encounter issues, check PM2 logs first: `pm2 logs ngb-backend`
