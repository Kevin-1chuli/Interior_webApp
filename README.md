# NGB Interior Web App

A full-stack interior design and furniture e-commerce web application built with Next.js, Express, Prisma, and PostgreSQL.

## ⚠️ Security Notice

**NEVER commit the following files:**
- `backend/.env` - Contains production secrets
- `.env.local` - Contains local development secrets

**All sensitive credentials (DATABASE_URL, JWT_SECRET, Cloudinary keys) must only be stored in:**
- Local `.env` files (gitignored)
- Production environment variables (Railway, Vercel)
- Never in code or documentation files

## Features

### Public Website
- Beautiful landing page with hero sections
- Furniture catalog with categories
- Project showcase (before/after galleries)
- Interior design consultation request form
- Contact page
- Responsive design with mobile support

### Admin Dashboard
- Role-based authentication (Owner & Staff roles)
- Product management (Create, Read, Delete)
- Project management
- Staff account management (Owner only)
- Cloudinary image upload integration
- Password reset functionality
- Secure JWT authentication

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom styles
- **Icons**: Lucide React
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Image Storage**: Cloudinary

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Cloudinary account for image uploads

## Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ngb-interior-web-app
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd backend
npm install
```

### 4. Environment Setup

#### Backend Environment Variables
Copy `backend/.env.example` to `backend/.env` and fill in your credentials:

```env
# Database (Get from Neon or your PostgreSQL provider)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Server
PORT=4000
NODE_ENV=development

# JWT (Generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS
FRONTEND_URL=http://localhost:3000

# Cloudinary (Get from cloudinary.com dashboard)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 5. Database Setup

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with initial admin user
npm run seed
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `ngb2024`
- Role: `OWNER`

⚠️ **Important**: Change these credentials after first login!

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

### Production Build

**Frontend:**
```bash
npm run build
npm start
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

## Project Structure

```
ngb-interior-web-app/
├── app/                      # Next.js app directory
│   ├── (site)/              # Public website pages
│   │   ├── furniture/       # Furniture catalog
│   │   ├── projects/        # Project showcase
│   │   ├── interior-design/ # Design request form
│   │   └── contact/         # Contact page
│   └── admin/               # Admin dashboard
│       ├── login/           # Login page
│       ├── dashboard/       # Dashboard home
│       ├── products/        # Product management
│       ├── projects/        # Project management
│       ├── staff/           # Staff management (Owner only)
│       ├── forgot-password/ # Password reset request
│       └── reset-password/  # Password reset form
├── backend/                 # Express backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth & upload middleware
│   │   ├── routes/          # API routes
│   │   └── config/          # Cloudinary config
│   └── prisma/
│       ├── schema.prisma    # Database schema
│       └── seed.ts          # Database seeder
├── components/              # React components
├── context/                 # React context providers
└── lib/                     # Utility functions

```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/staff` - Create staff (Owner only)
- `GET /api/auth/staff` - List staff (Owner only)
- `DELETE /api/auth/staff/:id` - Delete staff (Owner only)

### Products
- `GET /api/products` - Get all products (public)
- `POST /api/products` - Create product (authenticated)
- `DELETE /api/products/:id` - Delete product (authenticated)

### Projects
- `GET /api/projects` - Get all projects (public)
- `POST /api/projects` - Create project (authenticated)
- `DELETE /api/projects/:id` - Delete project (authenticated)

## Database Schema

### User
- Stores admin and staff accounts
- Roles: `OWNER` | `STAFF`
- Password hashing with bcrypt
- Password reset token support

### Product
- Furniture items with images
- Categories, pricing, materials
- Cloudinary image URLs stored as JSON array

### Project
- Before/after project showcases
- Categories, styles, budget ranges
- Featured flag for homepage display

## Security Features

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ Role-based access control
- ✅ Password reset with token expiry
- ✅ Environment variable protection
- ✅ CORS configuration
- ✅ Input validation

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set environment variables (if any)
3. Deploy

### Backend (Railway/Render)
1. Connect your GitHub repo
2. Set all environment variables from `.env.example`
3. Run build command: `npm run build`
4. Start command: `npm start`
5. Run migrations: `npx prisma db push`

### Database (Neon)
Already configured for serverless PostgreSQL with connection pooling.

## Development Notes

- ✅ **API Configuration**: Frontend uses `NEXT_PUBLIC_API_URL` environment variable with fallback to `http://localhost:4000` for development
- ✅ **Environment-Based**: All API calls now use `process.env.NEXT_PUBLIC_API_URL` for production compatibility
- ⚠️ **Production Setup**: Set `NEXT_PUBLIC_API_URL` in Vercel to your deployed backend URL
- 📧 **Email Integration**: Password reset currently uses owner-managed approach (no email required)
- 🔐 **Security**: Default credentials (`admin`/`ngb2024`) should be changed immediately after first deployment
- 📚 **Deployment Guide**: See `DEPLOYMENT.md` and `QUICK_PRODUCTION_SETUP.md` for step-by-step production deployment

## License

Private Project - All Rights Reserved

## Support

For issues or questions, contact the development team.
