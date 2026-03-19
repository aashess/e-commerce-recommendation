# E-Commerce Recommendation Platform - Backend API

A production-ready Node.js/Express backend for an e-commerce platform with authentication, product management, shopping cart, checkout, and Razorpay payment integration.

## 🚀 Features

### Authentication & Security
- ✅ Local email/password authentication with bcrypt hashing
- ✅ Google OAuth integration
- ✅ JWT token-based sessions (7-day expiry)
- ✅ CSRF protection with Redis-backed tokens
- ✅ Rate limiting on sensitive endpoints
- ✅ Input validation and sanitization
- ✅ Secure cookie handling (HttpOnly, Secure, SameSite)

### E-Commerce Features
- ✅ Product catalog with categories and subcategories
- ✅ Shopping cart with quantity management (max 100 units)
- ✅ Order management with status tracking
- ✅ Razorpay payment gateway integration
- ✅ Email verification via Mailtrap
- ✅ Role-based access control (Admin/Customer)

### Production Ready
- ✅ Structured logging with Winston
- ✅ Error handling with proper HTTP status codes
- ✅ PostgreSQL with Prisma ORM
- ✅ Redis for caching and CSRF token storage
- ✅ CORS configuration for frontend integration
- ✅ Environment configuration for multiple deployments

## 🛠️ Tech Stack

**Core:**
- Express.js 5.2.1
- Node.js (v20+)
- Prisma 7.3 (ORM)

**Database & Caching:**
- PostgreSQL (with SSL)
- Redis

**Authentication & Security:**
- JWT (jsonwebtoken)
- bcrypt
- CSRF tokens
- Helmet

**External Services:**
- Google OAuth
- Razorpay Payment Gateway
- Mailtrap Email Service

**Logging & Monitoring:**
- Winston

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js v20 or higher
- PostgreSQL 12+ running
- Redis running
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone <repository-url>
cd e-commerce-recommendation
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?sslmode=require"

# JWT
JWT_SECRET_KEY="your-secret-key-change-this"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Razorpay
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

# Mailtrap
MAILTRAP_TOKEN="your-mailtrap-token"

# Redis
REDIS_URL="redis://default:password@hostname:port"

# Environment
NODE_ENV="development"
PORT=3000

# CORS
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
```

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# (Optional) Generate Prisma client
npx prisma generate
```

### 4. Run Locally

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```bash
POST /api/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "CUSTOMER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully. Please verify your email.",
  "data": {
    "id": "user-id",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```bash
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "CUSTOMER"
    },
    "csrfToken": "csrf-token-value"
  }
}
```

#### Verify Email
```bash
POST /api/user/verify-email
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "123456"
}
```

### Cart Endpoints

#### Add to Cart
```bash
POST /api/cart/addToCart
Authorization: Bearer <token>
csrfToken: <csrf-token>
Content-Type: application/json

{
  "productId": "product-uuid",
  "quantity": 2
}
```

#### Get Cart Items
```bash
GET /api/cart/getAllCartItems
Authorization: Bearer <token>
csrfToken: <csrf-token>
```

#### Update Quantity
```bash
PUT /api/cart/add-quantity
Authorization: Bearer <token>
csrfToken: <csrf-token>
Content-Type: application/json

{
  "cartItemId": "item-uuid",
  "newQuantity": 3
}
```

### Product Endpoints

#### Get All Products
```bash
GET /api/product/all-products
```

#### Get All Categories
```bash
GET /api/product/all-categories
```

#### Create Product (Admin Only)
```bash
POST /api/product/create-product
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 999,
  "stock": 100,
  "subcategoryId": "category-uuid"
}
```

### Checkout & Payment

#### Place Order
```bash
POST /api/checkout/place-order
Authorization: Bearer <token>
csrfToken: <csrf-token>
Content-Type: application/json

{
  "cartItemIds": ["item-uuid-1", "item-uuid-2"]
}
```

#### Create Payment Order
```bash
POST /payment/order
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 99900,
  "currency": "INR",
  "notes": "Order payment"
}
```

## 📁 Project Structure

```
src/
├── server.js                 # Main entry point
├── config/                   # Configuration files
│   ├── prisma.js            # Database config
│   ├── redis.js             # Redis config
│   ├── logger.js            # Winston logger
│   ├── razorpay.js          # Razorpay config
│   └── oauthClient.js       # Google OAuth config
├── middleware/              # Express middleware
│   ├── auth.middleware.js      # JWT authentication
│   ├── admin.middleware.js     # Role-based access
│   ├── csrf.middleware.js      # CSRF token validation
│   └── errorHandler.middleware.js # Global error handling
├── controller/              # Request handlers
│   ├── user/               # User authentication & profile
│   ├── product/            # Product management
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Order checkout
│   └── payment/            # Payment processing
├── router/                 # Route definitions
│   ├── user/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── payment/
│   └── authRoutes.js
├── utils/                  # Helper functions
│   ├── responseFormat.js   # Response formatting
│   ├── validation.js       # Input validation
│   ├── jwtToken.js         # JWT utilities
│   └── generateVerificationCode.js
├── mailtrap/               # Email service
│   ├── email.js
│   ├── mailtrap.config.js
│   └── emailTemplate.js
└── auth/                   # OAuth handlers
    ├── googleLogin.js
    └── googleCallback.js
```

## 🔒 Security Best Practices Implemented

1. **Input Validation:** All user inputs validated using custom validators
2. **Password Security:** bcrypt with 10 salt rounds
3. **JWT Tokens:** 7-day expiry, verified on each request
4. **CSRF Protection:** Token-based with Redis storage
5. **Rate Limiting:** Applied to authentication endpoints
6. **SQL Injection:** Protected via Prisma ORM
7. **XSS Protection:** HttpOnly cookies, output encoding
8. **HTTPS:** Secure flag on cookies in production
9. **Environment Variables:** No secrets in code
10. **Error Handling:** Detailed logging without exposing sensitive info

## 📊 Database Schema

**Key Tables:**
- `users` - User accounts
- `accounts` - OAuth/local credentials
- `products` - Product catalog
- `categories` & `subcategories` - Product organization
- `cart` & `cartItems` - Shopping cart
- `orders` & `orderItems` - Order management

See `prisma/schema.prisma` for detailed schema.

## 🚀 Deployment

### Heroku/Railway/Render

1. **Set Environment Variables:**
   - DATABASE_URL (PostgreSQL database URL)
   - REDIS_URL (Redis connection string)
   - NODE_ENV=production
   - All other secrets from .env

2. **Deploy:**
   ```bash
   git push heroku main
   ```

3. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   ```

The `Procfile` in the root automatically handles the release and web processes.

### Docker Deployment

```bash
docker build -t e-commerce-api .
docker run -p 3000:3000 --env-file .env e-commerce-api
```

## 🧪 Testing

Currently, tests are not implemented. To add tests:

```bash
npm install --save-dev jest supertest
npm test
```

## 📝 Logging

Winston logs are stored in:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

In production, these are sent to external services (e.g., ELK stack).

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 🆘 Support

For issues and questions, please open an GitHub issue.

---

**Last Updated:** March 2026
**Version:** 1.0.0
