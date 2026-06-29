# 🏗️ Backend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        NGB Interior Backend                      │
│                    (Node.js + Express + Prisma)                  │
└─────────────────────────────────────────────────────────────────┘

                              │
                              ▼
                    
┌─────────────────────────────────────────────────────────────────┐
│                         Entry Point                              │
│                      server.ts (Port 5000)                       │
│  • Connects to PostgreSQL via Prisma                             │
│  • Starts Express server                                         │
│  • Handles graceful shutdown                                     │
└─────────────────────────────────────────────────────────────────┘

                              │
                              ▼

┌─────────────────────────────────────────────────────────────────┐
│                        Express App (app.ts)                      │
│  • CORS middleware (Vercel frontend)                             │
│  • JSON body parser (10MB limit)                                 │
│  • Route mounting                                                │
│  • Global error handler                                          │
└─────────────────────────────────────────────────────────────────┘

                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼

    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ /api/auth    │  │ /api/products│  │ /api/projects│
    │  (Routes)    │  │   (Routes)   │  │   (Routes)   │
    └──────────────┘  └──────────────┘  └──────────────┘
            │                 │                 │
            ▼                 ▼                 ▼

    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │Auth          │  │Products      │  │Projects      │
    │Controller    │  │Controller    │  │Controller    │
    └──────────────┘  └──────────────┘  └──────────────┘
            │                 │                 │
            └─────────────────┼─────────────────┘
                              │
                              ▼

                    ┌──────────────────┐
                    │  Prisma Client   │
                    │   (prisma.ts)    │
                    └──────────────────┘
                              │
                              ▼

                    ┌──────────────────┐
                    │   PostgreSQL     │
                    │    Database      │
                    │  • users         │
                    │  • products      │
                    │  • projects      │
                    └──────────────────┘
```

## Request Flow

### Public Request (Get Products)
```
Client Request
    │
    ▼
GET /api/products
    │
    ▼
Products Route
    │
    ▼
getProducts Controller
    │
    ▼
Prisma Query (SELECT * FROM products)
    │
    ▼
PostgreSQL Database
    │
    ▼
Response: { success: true, data: [...], pagination: {...} }
```

### Protected Request (Create Product)
```
Client Request (with JWT token)
    │
    ▼
POST /api/products
    │
    ▼
Auth Middleware
    │  • Extracts JWT from Authorization header
    │  • Verifies token with JWT_SECRET
    │  • Attaches user to req.user
    │
    ├─ Valid Token ──────┐
    │                    │
    │                    ▼
    │           Products Route
    │                    │
    │                    ▼
    │           createProduct Controller
    │                    │
    │                    ▼
    │           Prisma Insert
    │                    │
    │                    ▼
    │           PostgreSQL
    │                    │
    │                    ▼
    │           Response: { success: true, data: {...} }
    │
    └─ Invalid Token ────> 401 Unauthorized
```

## Directory Structure

```
backend/
│
├── src/
│   ├── controllers/           # Business logic layer
│   │   ├── auth.controller.ts      # Login logic
│   │   ├── products.controller.ts  # Product CRUD
│   │   └── projects.controller.ts  # Project CRUD
│   │
│   ├── middleware/           # Request interceptors
│   │   ├── auth.middleware.ts      # JWT verification
│   │   └── error.middleware.ts     # Error handling
│   │
│   ├── routes/              # API endpoint definitions
│   │   ├── auth.routes.ts          # Auth routes
│   │   ├── products.routes.ts      # Product routes
│   │   └── projects.routes.ts      # Project routes
│   │
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server entry point
│   └── prisma.ts           # Prisma client
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Initial data seeder
│
├── .env                   # Environment config
├── .gitignore
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

## Data Models

### User Model
```typescript
{
  id: string (UUID)
  username: string (unique)
  password: string (bcrypt hashed)
  email: string | null
  role: string (default: "admin")
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Product Model
```typescript
{
  id: string (UUID)
  name: string
  description: string | null
  category: string (indexed)
  price: Decimal
  currency: string (default: "UGX")
  images: JSON array
  materials: JSON array
  dimensions: string | null
  isAvailable: boolean (indexed)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Project Model
```typescript
{
  id: string (UUID)
  title: string
  location: string | null
  category: string | null (indexed)
  style: string | null
  problem: string | null
  solution: string | null
  beforeImages: JSON array
  afterImages: JSON array
  budgetRange: string | null
  isFeatured: boolean (indexed)
  createdAt: DateTime
  updatedAt: DateTime
}
```

## API Endpoints

### Authentication
| Method | Endpoint          | Auth | Description           |
|--------|-------------------|------|-----------------------|
| POST   | /api/auth/login   | No   | Admin login (JWT)     |

### Products
| Method | Endpoint          | Auth | Description           |
|--------|-------------------|------|-----------------------|
| GET    | /api/products     | No   | Get products list     |
| POST   | /api/products     | Yes  | Create new product    |

**Query Parameters (GET):**
- `category` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Projects
| Method | Endpoint          | Auth | Description           |
|--------|-------------------|------|-----------------------|
| GET    | /api/projects     | No   | Get projects list     |
| POST   | /api/projects     | Yes  | Create new project    |

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Admin Login Flow                           │
└──────────────────────────────────────────────────────────────┘

1. Admin submits username + password
         │
         ▼
2. Backend finds user by username
         │
         ├─ User not found ──> 401 Unauthorized
         │
         ▼
3. Compare password with bcrypt
         │
         ├─ Invalid password ──> 401 Unauthorized
         │
         ▼
4. Generate JWT token
         │  • Payload: { id, username }
         │  • Secret: JWT_SECRET
         │  • Expiry: 7 days
         │
         ▼
5. Return token + user info
         │
         ▼
6. Frontend stores token (localStorage/cookie)
         │
         ▼
7. Future requests include: Authorization: Bearer <token>
         │
         ▼
8. Auth middleware verifies token on protected routes
```

## Security Features

### ✅ Implemented
- **Password Hashing**: bcrypt with 10 rounds
- **JWT Authentication**: Token-based auth with expiration
- **Environment Variables**: Secrets not in code
- **CORS**: Restricted to frontend origin
- **Input Validation**: Required field checks
- **SQL Injection Protection**: Prisma parameterized queries
- **Error Handling**: No sensitive info in error messages

### 🔒 Best Practices
- Use HTTPS in production
- Rotate JWT_SECRET regularly
- Implement rate limiting (future)
- Add request logging (future)
- Use strong DATABASE_URL password
- Never commit .env to git

## Database Schema Design

```sql
-- Users table (Admin accounts)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,  -- bcrypt hashed
  email VARCHAR,
  role VARCHAR DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  currency VARCHAR DEFAULT 'UGX',
  images JSON DEFAULT '[]',
  materials JSON DEFAULT '[]',
  dimensions VARCHAR,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_available ON products(is_available);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  location VARCHAR,
  category VARCHAR,
  style VARCHAR,
  problem TEXT,
  solution TEXT,
  before_images JSON DEFAULT '[]',
  after_images JSON DEFAULT '[]',
  budget_range VARCHAR,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
```

## Technology Choices

| Component | Technology | Reason |
|-----------|-----------|---------|
| Runtime | Node.js | JavaScript ecosystem, async I/O |
| Framework | Express | Simple, flexible, well-documented |
| Database | PostgreSQL | ACID, reliable, scalable |
| ORM | Prisma | Type-safe, migrations, modern API |
| Auth | JWT | Stateless, scalable, standard |
| Password | bcryptjs | Industry standard hashing |
| Language | TypeScript | Type safety, better DX |

## Performance Considerations

- **Indexing**: Category and availability fields indexed
- **Pagination**: Limit large datasets (20 items/page)
- **Connection Pooling**: Prisma manages connections
- **JSON Fields**: Efficient storage for arrays
- **Async/Await**: Non-blocking I/O

## Deployment Architecture

```
┌────────────────────────────────────────────────────────┐
│                    Production Setup                     │
└────────────────────────────────────────────────────────┘

Frontend (Vercel)                Backend (Railway/Render)
    │                                     │
    │  API Requests                       │
    │  (CORS allowed)                     │
    └────────────────────────────────────►│
                                          │
                                          ▼
                                 Express Server
                                    (Node.js)
                                          │
                                          ▼
                                 PostgreSQL Database
                                 (Managed Service)
```

## Environment Setup

### Development
```env
DATABASE_URL=postgresql://localhost:5432/ngb_dev
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Production
```env
DATABASE_URL=postgresql://user:pass@prod.db:5432/ngb_prod
FRONTEND_URL=https://ngbinterior.vercel.app
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
```

---

**Architecture Status: ✅ COMPLETE**

Clean separation of concerns, secure authentication, scalable design.
