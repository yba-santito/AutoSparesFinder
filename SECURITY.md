# Security Implementation - MVP Hardening

## Overview
This document outlines the security measures implemented to make the JJ Auto Spares application MVP-ready.

## Security Features Implemented

### 1. Environment Configuration ✓
- **File**: `.env` (development) and `.env.example` (template)
- **Details**: All sensitive values managed via environment variables
- **Variables**:
  - `PORT`: Server port (default 3000)
  - `NODE_ENV`: Environment mode (development/production)
  - `JWT_SECRET`: Secret key for JWT token signing
  - `DB_PATH`: Database file path
  - `CORS_ORIGIN`: Allowed CORS origins
  - `RATE_LIMIT_WINDOW`: Rate limit window in minutes
  - `RATE_LIMIT_MAX_REQUESTS`: Max requests per window

### 2. JWT Authentication ✓
- **Backend**: `server.js` implements JWT token generation and verification
- **Token Generation**: 
  - Issued on successful login (24-hour expiry)
  - Contains: `user_id`, `username`, `role`
  - Signed with `JWT_SECRET` from environment
- **Token Verification**:
  - `verifyToken` middleware protects all `/api/admin/*` routes
  - Token extracted from `Authorization: Bearer <token>` header
  - Invalid/expired tokens return 401 Unauthorized
- **Frontend Storage**:
  - JWT stored in `localStorage` as `token`
  - Included in `Authorization` header for all admin API calls

### 3. Password Security ✓
- **Hashing**: bcryptjs v2.4.3 with 10 salt rounds
- **Database**: Passwords stored as `password_hash` (not plain text)
- **Login Process**:
  - User lookup by username
  - Password comparison using `bcryptjs.compare()`
  - Credential mismatch returns generic "Invalid credentials" (prevents user enumeration)
- **Test Credentials**: All test users have hashed passwords
  - admin / admin123
  - manager / manager123
  - staff / staff123

### 4. Input Validation ✓
- **POST /api/admin/parts**:
  - All fields required: sku, brand, part_number, part_type_id, price, stock_quantity
  - Price and stock_quantity validated as non-negative numbers
  - Duplicate SKU check (UNIQUE constraint)
- **PUT /api/admin/parts/:partId**:
  - All fields required: brand, part_number, price, stock_quantity
  - Price and stock_quantity validated as non-negative numbers
  - SKU is read-only (cannot be updated)
- **GET /api/admin/search-parts**:
  - Query parameter must be at least 2 characters
  - Results limited to 50 records

### 5. HTTP Security Headers ✓
- **X-Content-Type-Options**: `nosniff` (prevent MIME type sniffing)
- **X-Frame-Options**: `DENY` (prevent clickjacking)
- **CORS Headers**: Properly configured with `Authorization` header support
- **Content-Type**: application/json enforced for API responses

### 6. Error Handling ✓
- **Development**: Full error messages logged to console
- **Production**: Generic error messages returned to client (prevents information leakage)
- **Status Codes**: Proper HTTP status codes (400, 401, 404, 500)

### 7. Request Logging ✓
- All API requests logged with timestamp, method, and path
- Format: `[ISO-8601-Timestamp] METHOD /path`
- Useful for debugging and security auditing

## Protected Routes

### Public Routes (No Token Required)
- `GET /`: API status
- `GET /api/parts`: List all parts (customer browsing)
- `GET /api/products`: Alias for /api/parts with vehicle filters

### Protected Routes (JWT Required)
- `GET /api/admin/search-parts?query=X`: Search parts inventory
- `GET /api/admin/part-types`: List part types
- `POST /api/admin/parts`: Add new part
- `PUT /api/admin/parts/:partId`: Update part
- All routes require valid JWT in `Authorization` header

### Authentication Routes
- `POST /api/auth/login`: Issue JWT token

## Testing the Security Implementation

### 1. Test User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
Expected response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### 2. Test Protected Route with Token
```bash
TOKEN="your_jwt_token_here"
curl -X GET http://localhost:3000/api/admin/part-types \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Test Protected Route without Token
```bash
curl -X GET http://localhost:3000/api/admin/part-types
```
Expected response: `{"error":"No token provided"}` (401 Unauthorized)

### 4. Test Invalid Token
```bash
curl -X GET http://localhost:3000/api/admin/part-types \
  -H "Authorization: Bearer invalid.token.here"
```
Expected response: `{"error":"Invalid or expired token"}` (401 Unauthorized)

## Frontend Implementation

### Login Flow
1. User enters credentials on `/login` page
2. Frontend POSTs to `/api/auth/login`
3. Backend validates and returns JWT token
4. Frontend stores token in `localStorage.setItem('token', data.token)`
5. Frontend navigates to `/admin-portal`

### Admin Portal
1. On load, checks if user exists in localStorage
2. All admin API calls include `Authorization: Bearer <token>` header
3. On logout, removes both user and token from localStorage
4. Token automatically included via `getAuthHeaders()` helper function

## Database Security

### SQL Injection Prevention ✓
- All queries use parameterized statements
- User input passed as parameters, not string concatenation
- Examples:
  - `db.run(sql, [makeName, modelName, year], callback)`
  - `db.get(sql, [username], callback)`

### Type Safety ✓
- Year comparisons use `CAST(? AS INTEGER)` to prevent string comparison issues
- Numeric inputs validated before database operations

## Production Deployment Checklist

Before deploying to production:

1. **Environment Variables**
   - [ ] Change `JWT_SECRET` to a strong random value
   - [ ] Set `NODE_ENV=production`
   - [ ] Update `CORS_ORIGIN` to actual domain(s)
   - [ ] Configure `DB_PATH` for production database
   - [ ] Set rate limit values appropriately

2. **HTTPS/TLS**
   - [ ] Enable HTTPS on production server
   - [ ] Install valid SSL certificate
   - [ ] Update CORS_ORIGIN to use https://

3. **Database**
   - [ ] Create new database with production data
   - [ ] Hash all user passwords with secure salt rounds
   - [ ] Set up database backups
   - [ ] Implement database access controls

4. **Monitoring**
   - [ ] Set up request logging (e.g., Winston, Morgan)
   - [ ] Configure error monitoring (e.g., Sentry)
   - [ ] Set up alerts for security events

5. **Additional Security**
   - [ ] Implement rate limiting middleware (express-rate-limit)
   - [ ] Add request size limits
   - [ ] Enable helmet.js for additional HTTP headers
   - [ ] Set up CSRF protection if needed
   - [ ] Implement account lockout after failed login attempts
   - [ ] Add password change functionality
   - [ ] Implement audit logging for admin actions

## Notes

- Current implementation is suitable for MVP prototype
- For production, implement additional hardening measures from checklist
- Regularly update dependencies: `npm audit`, `npm update`
- Store JWT_SECRET securely (use secrets management system)
- Implement 2FA for admin accounts in future versions
