# NGB Interior Backend API

Node.js + Express + Prisma + PostgreSQL backend for NGB Interior web app.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create `.env` file in the `backend` folder:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ngb_interior"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

Replace `username`, `password`, and database name with your PostgreSQL credentials.

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (creates tables)
npm run prisma:push
```

### 4. Create Admin User

Run this SQL directly in your PostgreSQL database or through Prisma Studio:

```sql
INSERT INTO users (id, username, password, email, role)
VALUES (
  gen_random_uuid(),
  'admin',
  '$2a$10$YourHashedPasswordHere', -- Use bcrypt to hash 'ngb2024' or your password
  'admin@ngbinterior.com',
  'admin'
);
```

Or create a seed script to do this programmatically.

### 5. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 6. Test API

Health check:
```bash
curl http://localhost:5000/health
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login (returns JWT token)

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (requires auth)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (requires auth)

## Production Build

```bash
npm run build
npm start
```

## Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

## Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
