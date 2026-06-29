# Backend Quick Start Guide

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (local or cloud)
- npm or yarn

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Database

Create `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME"
JWT_SECRET="your-secret-key-change-in-production"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

**Example for local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:admin@localhost:5432/ngb_interior"
JWT_SECRET="ngb-interior-secret-2024"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

### Step 3: Initialize Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:push

# Seed with admin user and sample data
npm run seed
```

### Step 4: Start Server

```bash
npm run dev
```

✓ Server runs at `http://localhost:5000`

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"ngb2024"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

## 🔑 Default Admin Credentials

- **Username:** `admin`
- **Password:** `ngb2024`

⚠️ Change these in production!

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth & error handling
│   ├── routes/          # API route definitions
│   ├── app.ts           # Express app setup
│   ├── server.ts        # Server entry point
│   └── prisma.ts        # Database client
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
├── .env                 # Environment config
└── package.json
```

## 🛠️ Useful Commands

```bash
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm start                # Run production build
npm run prisma:studio    # Open database GUI
npm run seed             # Re-seed database
```

## 🐛 Troubleshooting

### Database connection fails
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

### Port already in use
- Change PORT in .env
- Kill process using port 5000

### Prisma errors
```bash
npm run prisma:generate
npm run prisma:push
```

## 🔗 Next Steps

1. Connect frontend to backend (update API URLs)
2. Set up image upload (Cloudinary)
3. Deploy to production (Railway, Render, or Vercel)
4. Set up environment variables in hosting platform
