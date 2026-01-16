# 🚀 Complete Blog Application - Full Stack Setup

This is a complete, fully functional blog application with user authentication, article management, and admin dashboard.

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [User Roles & Permissions](#user-roles--permissions)
- [Testing](#testing)

## ✨ Features

### User Features
- ✅ User Registration (with email validation)
- ✅ User Login with JWT Authentication
- ✅ Profile Management (name, bio, avatar)
- ✅ Change Password
- ✅ Create Articles
- ✅ Edit/Delete Own Articles
- ✅ Publish/Unpublish Articles
- ✅ Add Comments to Articles
- ✅ View All Articles
- ✅ View User Profiles

### Admin Features
- ✅ Admin Dashboard with Statistics
- ✅ View All Users
- ✅ View All Articles (including unpublished)
- ✅ Edit Any Article
- ✅ Delete Any Article
- ✅ Flag/Report Articles
- ✅ View All Comments
- ✅ Send Messages to Users
- ✅ Receive Messages from Users
- ✅ View Visitor Statistics

## 🛠 Technology Stack

### Backend
- **Framework**: Symfony 7.4
- **Database**: PostgreSQL 18
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: Doctrine ORM 3.6
- **Language**: PHP 8.2+

### Frontend
- **Framework**: React 18
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 5.4.19
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Query

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Node.js 18+
- PostgreSQL 18
- Composer
- npm or yarn

### Installation

1. **Clone/Setup Project** (already done)
   ```bash
   cd "c:\Users\elmeh\Desktop\projet php"
   ```

2. **Run Setup Script**
   ```bash
   # On Windows
   setup.bat
   
   # Or manually:
   cd backend
   composer install
   php bin/console doctrine:migrations:migrate --no-interaction
   php bin/console cache:clear
   symfony server:start -d
   
   cd ..
   npm install
   npm run dev
   ```

3. **Access Application**
   - Frontend: http://127.0.0.1:8081
   - Backend API: http://127.0.0.1:8000
   - Backend Admin: http://127.0.0.1:8000/admin

## 🗄 Database

### Schema
```
User
├── id (PK)
├── email (unique)
├── password (bcrypt hashed)
├── name
├── bio (nullable)
├── avatar (nullable)
├── user_type (AUTHOR | ADMIN)
├── roles (JSON)
├── google_id (nullable)
├── created_at
├── updated_at

Article
├── id (PK)
├── title
├── content
├── slug (unique)
├── description
├── author_id (FK → User)
├── category_id (FK → Category)
├── published (boolean)
├── created_at
├── updated_at
├── published_at

Comment
├── id (PK)
├── content
├── author_id (FK → User)
├── article_id (FK → Article)
├── created_at
├── updated_at

Category
├── id (PK)
├── name
├── slug (unique)

Tag
├── id (PK)
├── name
├── slug (unique)

Message (for admin messaging)
├── id (PK)
├── sender_id (FK → User)
├── recipient_id (FK → User)
├── subject
├── content
├── is_read
├── created_at
```

## 🔌 API Endpoints

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name",
  "userType": "AUTHOR"  // or "ADMIN" with adminCode
}

Response: { token, user }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: { token, user }
```

### User Endpoints

#### Get Profile
```
GET /api/user/profile
Authorization: Bearer {token}

Response: { id, name, email, bio, avatar, ... }
```

#### Update Profile
```
PUT /api/user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Name",
  "bio": "New bio",
  "avatar": "https://..."
}

Response: { message, user }
```

#### Change Password
```
POST /api/user/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}

Response: { message }
```

### Article Endpoints

#### List Articles (Public)
```
GET /api/articles?page=1&limit=10

Response: { data: [...], pagination: {...} }
```

#### Get Article
```
GET /api/articles/{id}
# or
GET /api/articles/{slug}

Response: { id, title, content, author, ... }
```

#### Create Article (Auth Required)
```
POST /api/articles
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Article Title",
  "content": "Article content",
  "description": "Short description",
  "published": false
}

Response: { id, title, slug, ... }
```

#### Update Article (Author or Admin)
```
PUT /api/articles/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "published": true
}

Response: { id, title, ... }
```

#### Delete Article (Author or Admin)
```
DELETE /api/articles/{id}
Authorization: Bearer {token}

Response: { message }
```

#### Get User's Articles
```
GET /api/articles/user/my-articles
Authorization: Bearer {token}

Response: [{ id, title, published, ... }]
```

#### Publish/Unpublish Article
```
POST /api/articles/{id}/publish
Authorization: Bearer {token}
Content-Type: application/json

{
  "published": true
}

Response: { message, article }
```

### Comment Endpoints

#### Get Article Comments
```
GET /api/articles/{id}/comments

Response: [{ id, content, author, createdAt, ... }]
```

#### Add Comment (Auth Required)
```
POST /api/articles/{id}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Comment text"
}

Response: { id, content, author, ... }
```

#### Delete Comment (Author or Admin)
```
DELETE /api/comments/{id}
Authorization: Bearer {token}

Response: { message }
```

### Admin Endpoints (Admin Only)

#### List All Users
```
GET /api/admin/users
Authorization: Bearer {token}

Response: [{ id, email, name, userType, ... }]
```

#### List All Articles (including unpublished)
```
GET /api/admin/articles
Authorization: Bearer {token}

Response: [{ id, title, published, author, ... }]
```

#### Get Dashboard Stats
```
GET /api/admin/dashboard
Authorization: Bearer {token}

Response: {
  totalUsers: number,
  totalArticles: number,
  articlesWithoutTags: number,
  visitorsCount: number,
  ...
}
```

#### Get All Comments
```
GET /api/admin/comments
Authorization: Bearer {token}

Response: [{ id, content, author, article, ... }]
```

#### Send Message to User
```
POST /api/admin/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipientId": 1,
  "subject": "Message subject",
  "content": "Message content"
}

Response: { id, subject, ... }
```

#### Get Messages
```
GET /api/admin/messages
Authorization: Bearer {token}

Response: [{ id, sender, subject, isRead, ... }]
```

## 👥 User Roles & Permissions

### AUTHOR Role
- ✅ View published articles
- ✅ Create articles
- ✅ Edit own articles
- ✅ Delete own articles
- ✅ Publish/unpublish articles
- ✅ Add comments
- ✅ Manage own profile
- ❌ Cannot access admin panel
- ❌ Cannot modify other users' articles

### ADMIN Role
- ✅ All AUTHOR permissions
- ✅ View all users
- ✅ View all articles (including unpublished)
- ✅ Edit any article
- ✅ Delete any article
- ✅ View all comments
- ✅ Send messages to users
- ✅ View dashboard statistics
- ✅ Manage website content

## 🧪 Testing

### Test Credentials

```
Author 1:
  Email: author1@test.com
  Password: password123
  Role: AUTHOR

Author 2:
  Email: author2@test.com
  Password: password123
  Role: AUTHOR

Admin:
  Email: admin@test.com
  Password: password123
  Role: ADMIN
```

### Test Flow

1. **Register New User**
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

2. **Login**
   ```bash
   curl -X POST http://127.0.0.1:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "newuser@test.com",
       "password": "password123"
     }'
   ```

3. **Create Article**
   ```bash
   curl -X POST http://127.0.0.1:8000/api/articles \
     -H "Authorization: Bearer {TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "My First Article",
       "content": "Article content here",
       "description": "Short description",
       "published": true
     }'
   ```

4. **View Articles**
   ```bash
   curl http://127.0.0.1:8000/api/articles
   ```

## 📁 Project Structure

```
projet php/
├── backend/                          (Symfony API)
│   ├── src/
│   │   ├── Controller/              (API Controllers)
│   │   │   ├── AuthController.php
│   │   │   ├── ArticleController.php
│   │   │   ├── UserController.php
│   │   │   ├── CommentController.php
│   │   │   ├── AdminController.php
│   │   │   └── CategoryController.php
│   │   ├── Entity/                  (Database Models)
│   │   │   ├── User.php
│   │   │   ├── Article.php
│   │   │   ├── Comment.php
│   │   │   ├── Category.php
│   │   │   ├── Tag.php
│   │   │   └── Message.php
│   │   ├── Service/                 (Business Logic)
│   │   │   ├── JwtService.php
│   │   │   └── GoogleOAuthService.php
│   │   └── Repository/              (Data Access)
│   ├── migrations/                   (Database Migrations)
│   ├── config/                       (Symfony Configuration)
│   ├── composer.json
│   └── bin/console
├── src/                              (React Frontend)
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── Profile.tsx
│   │   ├── Articles.tsx
│   │   ├── ArticleDetail.tsx
│   │   ├── Admin.tsx
│   │   ├── AuthorDashboard.tsx
│   │   └── ArticleEditor.tsx
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── ArticleCard.tsx
│   │   └── ...
│   ├── services/
│   │   └── api.ts
│   ├── hooks/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

## 🔐 Security Features

- ✅ JWT Token Authentication (24-hour expiry)
- ✅ Bcrypt Password Hashing
- ✅ CORS Configuration
- ✅ Role-Based Access Control (RBAC)
- ✅ Input Validation
- ✅ SQL Injection Protection (ORM)
- ✅ Bearer Token Required for Protected Routes

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
symfony server:stop
# Wait 2 seconds
symfony server:start -d
```

**Database Connection Error:**
```bash
cd backend
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

**Migrations Failed:**
```bash
php bin/console doctrine:migrations:migrate --allow-no-migration
```

### Frontend Issues

**Port 8081 already in use:**
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9  # macOS/Linux
```

**Module not found errors:**
```bash
npm install
npm run dev
```

## 📝 Notes

- All passwords are hashed with bcrypt
- JWT tokens expire after 24 hours
- Timestamps are in UTC
- Slugs are auto-generated from titles
- Articles are soft-deleted (not physically deleted)
- Database uses PostgreSQL 18

## 🤝 Contributing

This is a complete, production-ready application. All features are implemented and tested.

## 📞 Support

For issues or questions, check the logs:
```bash
# Backend logs
cd backend
symfony server:log

# Frontend console
# Open browser DevTools (F12)
```

---

**Status**: ✅ FULLY FUNCTIONAL & TESTED
**Last Updated**: 2026-01-13
