# 🚀 START HERE - Complete Setup Instructions

## Step 1: Quick Setup (Automatic)

### Option A: Windows (Recommended)
```bash
# Simply run this batch file:
setup.bat
```

### Option B: Manual Setup

#### Backend Setup
```bash
cd backend

# Install dependencies
composer install

# Run migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Initialize test data
php init.php

# Start server
symfony server:start -d
```

#### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Step 2: Access the Application

Once both servers are running:

- **Frontend**: http://127.0.0.1:8081
- **Backend API**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/api/docs

## Step 3: Test Credentials

Use these credentials to test the application:

```
Author Account:
  Email: author1@test.com
  Password: password123
  Role: Can create, edit, publish articles

Admin Account:
  Email: admin@test.com
  Password: password123
  Role: Full access to admin panel
```

## Step 4: Test the Complete Flow

### 1. Register a New User
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "password123",
    "name": "New User",
    "userType": "AUTHOR"
  }'
```

### 2. Login
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "password123"
  }'

# Copy the returned token and use for authenticated requests
```

### 3. Create an Article
```bash
curl -X POST http://127.0.0.1:8000/api/articles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Article",
    "content": "This is the content of my article",
    "description": "Short description",
    "published": false
  }'
```

### 4. List Articles
```bash
curl http://127.0.0.1:8000/api/articles
```

### 5. View User Profile
```bash
curl http://127.0.0.1:8000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Admin Dashboard (Admin Only)
```bash
curl http://127.0.0.1:8000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## Features Summary

### ✅ User Features
- [x] Registration with email and password
- [x] Login with JWT authentication
- [x] Profile management (name, bio, avatar)
- [x] Change password
- [x] View articles
- [x] Create articles
- [x] Edit own articles
- [x] Delete own articles
- [x] Publish/unpublish articles
- [x] Add comments
- [x] View comments

### ✅ Admin Features
- [x] Admin dashboard with statistics
  - Total users count
  - Total articles count
  - Published vs unpublished articles
  - Total comments
  - Articles without tags
  - Recent articles and users
- [x] Manage all users
- [x] View all articles (including unpublished)
- [x] Edit any article
- [x] Delete any article
- [x] View all comments
- [x] Send messages to users
- [x] Receive messages

## 📊 Database

The application uses PostgreSQL with the following main tables:

- **user**: User accounts and authentication
- **article**: Blog articles with authors
- **comment**: Comments on articles
- **category**: Article categories
- **tag**: Article tags
- **message**: Admin messages to users

All relationships are properly configured with foreign keys and cascade rules.

## 🔐 Security

- ✅ JWT tokens with 24-hour expiry
- ✅ Bcrypt password hashing
- ✅ Role-based access control (RBAC)
- ✅ Authorization headers on protected routes
- ✅ CORS configuration
- ✅ Input validation

## 🐛 Troubleshooting

### Issue: "Port 8000 already in use"
```bash
cd backend
symfony server:stop
# Wait 2 seconds
symfony server:start -d
```

### Issue: "Database connection error"
```bash
cd backend
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

### Issue: "npm modules not found"
```bash
npm install
npm run dev
```

### Issue: "Token validation error"
- Make sure your token is not expired (24 hours)
- Include the full "Bearer TOKEN" in Authorization header
- Use the correct admin token for admin endpoints

## 📁 Project Structure

```
/backend          - Symfony API
  /src
    /Controller   - API endpoints
    /Entity       - Database models
    /Service      - Business logic
  /migrations     - Database migrations
  /config         - Configuration

/src              - React Frontend
  /pages          - Page components
  /components     - Reusable components
  /services       - API client
  /styles         - CSS files

/public           - Static files
```

## 📚 API Documentation

See [COMPLETE_SETUP.md](COMPLETE_SETUP.md) for detailed API endpoint documentation.

## 🎯 Next Steps

1. Open http://127.0.0.1:8081 in your browser
2. Register or login with test credentials
3. Create your first article
4. If admin: Access admin dashboard
5. Test all features

## 💡 Tips

- Keep tokens safe and don't expose them
- Use HTTPS in production
- Keep your password strong
- Use the admin code when registering admin accounts
- All timestamps are in UTC

## ✨ What's Working

Everything is fully functional:
- ✅ User registration and authentication
- ✅ Article creation and management
- ✅ Comments system
- ✅ Admin dashboard and management
- ✅ Role-based permissions
- ✅ Database persistence
- ✅ JWT authentication
- ✅ Real-time updates

## 🚀 Ready to Go!

Your application is complete and ready for production use.

For issues, check the browser console (F12) or backend logs:
```bash
cd backend
symfony server:log
```

Happy coding! 🎉
