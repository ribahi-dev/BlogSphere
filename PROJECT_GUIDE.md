# Blog Platform - Complete Project Guide

## Project Overview

A complete full-stack blog platform with:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Symfony 7.4 with API Platform
- **Authentication**: JWT with role-based access control (RBAC)
- **Roles**: AUTHOR (can create & publish articles) and ADMIN (can manage all content)

---

## 🎯 Key Features

### For Authors
- ✅ Register and login
- ✅ Create draft articles
- ✅ Edit their own articles
- ✅ Publish articles
- ✅ Delete their own articles
- ✅ View all their articles
- ✅ View published articles from other authors
- ✅ View comments on their articles

### For Admins
- ✅ All author permissions
- ✅ View and manage all users
- ✅ Write comments on published articles
- ✅ Update user roles (AUTHOR ↔ ADMIN)
- ✅ Delete any article
- ✅ Delete any comment

### Public
- ✅ View all published articles
- ✅ View article details
- ✅ View comments

---

## 📁 Project Structure

```
projet php/
├── backend/                      # Symfony Backend
│   ├── src/
│   │   ├── Controller/          # API Controllers
│   │   │   ├── AuthController.php
│   │   │   ├── ArticleController.php
│   │   │   ├── CommentController.php
│   │   │   └── AdminController.php
│   │   ├── Entity/              # Database Models
│   │   │   ├── User.php
│   │   │   ├── Article.php
│   │   │   └── Comment.php
│   │   ├── Repository/          # Database Queries
│   │   │   ├── ArticleRepository.php
│   │   │   └── CommentRepository.php
│   │   └── Service/             # Business Logic
│   │       ├── JwtService.php
│   │       └── GoogleOAuthService.php
│   ├── config/
│   │   ├── packages/
│   │   │   ├── security.yaml
│   │   │   ├── nelmio_cors.yaml
│   │   │   └── api_platform.yaml
│   │   └── services.yaml
│   ├── migrations/              # Database Migrations
│   ├── var/                     # SQLite Database
│   ├── public/                  # Web Root
│   └── composer.json            # Dependencies
│
├── src/                         # React Frontend
│   ├── components/
│   │   ├── articles/            # Article Components
│   │   ├── home/                # Home Components
│   │   ├── layout/              # Layout Components
│   │   └── ui/                  # UI Components
│   ├── pages/
│   │   ├── ArticleEditor.tsx    # Create/Edit Article
│   │   ├── Articles.tsx         # List Articles
│   │   ├── Login.tsx            # Login Page
│   │   └── ... other pages
│   ├── services/
│   │   └── api.ts               # API Client
│   └── main.tsx                 # Entry Point
│
├── package.json                 # Frontend Dependencies
└── vite.config.ts               # Vite Config
```

---

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer
- SQLite (or another database)

### Backend Setup

1. **Navigate to backend**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
composer install
```

3. **Configure environment**:
```bash
# Copy environment file
cp .env .env.local

# Edit .env.local with:
APP_ENV=dev
APP_SECRET=your-secret-key
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
FRONTEND_URL=http://localhost:5173
JWT_EXPIRATION=7
```

4. **Create database and run migrations**:
```bash
# Create database (auto-created by SQLite on first access)
php bin/console doctrine:migrations:migrate
```

5. **Start server**:
```bash
symfony server:start --no-tls --port=8000
```

Or using PHP built-in server:
```bash
php -S 127.0.0.1:8000 -t public
```

### Frontend Setup

1. **Navigate to frontend** (from project root):
```bash
cd .. # if in backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
Create `.env.local` in project root:
```env
VITE_API_URL=http://localhost:8000/api
```

4. **Start dev server**:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 🔐 Authentication & Roles

### User Types

#### 1. AUTHOR (Default)
- Can create articles (draft)
- Can edit/delete their own articles
- Can publish their own articles
- Cannot manage users
- Cannot write comments

#### 2. ADMIN
- All AUTHOR permissions
- Can write comments on any article
- Can delete any article
- Can manage user roles
- Can view all users

### Token Format

JWT Token includes:
```json
{
  "sub": "1",                           // User ID
  "email": "user@example.com",
  "name": "John Doe",
  "roles": ["ROLE_AUTHOR", "ROLE_USER"],
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/check-email` - Check if email exists
- `POST /api/auth/logout` - Logout user

### Articles
- `GET /api/articles` - List published articles (public)
- `GET /api/articles/{id}` - Get article detail (public)
- `GET /api/articles/my-articles` - Get user's articles (auth required)
- `POST /api/articles` - Create article (auth required)
- `PUT /api/articles/{id}` - Update article (owner or admin)
- `POST /api/articles/{id}/publish` - Publish article (owner or admin)
- `DELETE /api/articles/{id}` - Delete article (owner or admin)

### Comments
- `GET /api/comments/article/{articleId}` - List comments (public)
- `POST /api/comments` - Create comment (admin only)
- `PUT /api/comments/{id}` - Update comment (owner or admin)
- `DELETE /api/comments/{id}` - Delete comment (owner, article author, or admin)

### Admin
- `GET /api/admin/users` - List all users (admin only)
- `PUT /api/admin/users/{id}/role` - Update user role (admin only)

---

## 🧪 Testing

### Test with Curl

**Register Author**:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@example.com",
    "password": "Author123!",
    "name": "Test Author",
    "userType": "AUTHOR"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@example.com",
    "password": "Author123!"
  }'
```

**Create Article** (replace TOKEN with actual token):
```bash
curl -X POST http://localhost:8000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "My Article",
    "content": "Article content here...",
    "description": "Short description"
  }'
```

### Using Test Script
```bash
bash test_backend.sh
```

---

## 📊 Database Schema

### Users Table
- `id` (Integer, PK)
- `email` (String, unique)
- `password` (String, hashed)
- `name` (String)
- `user_type` (String: AUTHOR, ADMIN)
- `roles` (JSON)
- `created_at` (DateTime)
- `google_id` (String, nullable)

### Articles Table
- `id` (Integer, PK)
- `author_id` (Integer, FK)
- `title` (String)
- `content` (Text)
- `description` (String)
- `published` (Boolean)
- `created_at` (DateTime)
- `updated_at` (DateTime)
- `published_at` (DateTime)

### Comments Table
- `id` (Integer, PK)
- `article_id` (Integer, FK)
- `author_id` (Integer, FK)
- `content` (Text)
- `created_at` (DateTime)
- `updated_at` (DateTime)

---

## 🔒 Security

### Features
- ✅ Password hashing (bcrypt/argon)
- ✅ JWT token-based auth
- ✅ CORS protection
- ✅ Role-based access control (RBAC)
- ✅ Request validation
- ✅ Token expiration (7 days by default)

### Best Practices
1. Never commit `.env.local` file
2. Use HTTPS in production
3. Set strong `APP_SECRET`
4. Update `JWT_EXPIRATION` for production
5. Configure proper CORS_ALLOW_ORIGIN

---

## 🛠️ Development

### Common Tasks

**Clear cache**:
```bash
cd backend
php bin/console cache:clear
```

**Run Doctrine migrations**:
```bash
php bin/console doctrine:migrations:migrate
```

**Generate entities**:
```bash
php bin/console make:entity
```

**Run linter**:
```bash
npm run lint
```

**Build for production**:
```bash
npm run build
```

---

## 📝 Environment Variables

### Backend (.env.local)
```env
APP_ENV=dev
APP_SECRET=your-secret-here
DATABASE_URL=sqlite:///%kernel.project_dir%/var/data.db
FRONTEND_URL=http://localhost:5173
JWT_EXPIRATION=7
CORS_ALLOW_ORIGIN=^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🚨 Troubleshooting

### Backend not connecting
- Check if Symfony server is running: `symfony server:status`
- Check `.env.local` database URL
- Run migrations: `php bin/console doctrine:migrations:migrate`

### Frontend API errors
- Check `VITE_API_URL` in `.env.local`
- Verify backend CORS settings
- Check browser console for errors

### Authentication failed
- Verify token is in localStorage
- Check token expiration (7 days)
- Confirm correct Authorization header format

### Database errors
- Ensure SQLite is writable
- Check `var/` directory permissions
- Run migrations

---

## 📚 Additional Resources

- [Symfony Documentation](https://symfony.com/doc)
- [API Platform Documentation](https://api-platform.com)
- [React Documentation](https://react.dev)
- [JWT.io](https://jwt.io)

---

## ✅ Project Checklist

- [x] User authentication (JWT)
- [x] Role-based access control
- [x] Article CRUD operations
- [x] Comment system
- [x] Admin management panel
- [x] Article publishing workflow
- [x] Database migrations
- [x] API documentation
- [x] Frontend integration
- [x] Error handling
- [x] CORS configuration
- [x] Production-ready code

---

## 🎉 Project Status

**Status**: ✅ **COMPLETE AND PRODUCTION-READY**

All features implemented and tested. Ready for deployment.

---

## 📞 Support

For issues or questions, check:
1. API_COMPLETE_DOCUMENTATION.md
2. Backend logs: `var/log/`
3. Browser console for frontend errors
4. API responses for detailed error messages
