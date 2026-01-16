# Complete Application Implementation Guide

## Overview
Complete, fully functional application with:
- User registration (as Author)
- User login with JWT
- User profile management
- Article creation and publishing
- Admin dashboard
- Comments system
- Role-based access control

## Database Entities Required

### 1. User Entity (✓ Already exists)
- id, email, password, name, bio, avatar
- roles, userType (AUTHOR/ADMIN)
- createdAt, updatedAt, googleId

### 2. Article Entity (✓ Already exists)
- id, title, content, slug, description
- author (ManyToOne: User)
- category (ManyToOne: Category)
- tags (ManyToMany: Tag)
- published (boolean)
- createdAt, updatedAt, publishedAt

### 3. Comment Entity (✓ Already exists)
- id, content, author (ManyToOne: User)
- article (ManyToOne: Article)
- createdAt, updatedAt

### 4. Category Entity (✓ Already exists)
- id, name, slug

### 5. Tag Entity (✓ Already exists)
- id, name, slug

### 6. Message Entity (NEW - for admin messaging)
- id, sender (ManyToOne: User)
- recipient (ManyToOne: User)
- subject, content, isRead
- createdAt

## API Endpoints Structure

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout

### User Profile
- GET /api/user/profile - Get current user profile
- PUT /api/user/profile - Update profile
- POST /api/user/change-password - Change password
- GET /api/users/{id} - Get any user profile

### Articles (User)
- GET /api/articles - List all articles
- GET /api/articles/{id} - Get single article
- POST /api/articles - Create article
- PUT /api/articles/{id} - Update article
- DELETE /api/articles/{id} - Delete article
- POST /api/articles/{id}/publish - Publish article

### Comments (User)
- GET /api/articles/{id}/comments - Get article comments
- POST /api/articles/{id}/comments - Add comment
- DELETE /api/comments/{id} - Delete comment

### Admin Endpoints
- GET /api/admin/users - List all users
- GET /api/admin/articles - List all articles (for moderation)
- PUT /api/admin/articles/{id} - Modify article
- DELETE /api/admin/articles/{id} - Delete article
- POST /api/admin/articles/{id}/flag - Flag article
- GET /api/admin/dashboard - Get dashboard stats
- GET /api/admin/comments - Get all comments
- POST /api/admin/messages - Send message to user
- GET /api/admin/messages - Get messages

## Frontend Pages

### Public Pages
- /login - Login page
- /register - Registration page
- /home - Home page with article listing

### User Pages
- /profile - User profile management
- /settings - Account settings
- /my-articles - List user's articles
- /articles/new - Create new article
- /articles/{id}/edit - Edit article
- /articles/{id}/view - View article with comments

### Admin Pages
- /admin/dashboard - Admin dashboard
- /admin/users - Manage users
- /admin/articles - Moderate articles
- /admin/comments - Review comments
- /admin/messages - Messages from/to users

## Status
- Backend Controllers: Need creation/updates
- Frontend Pages: Need creation
- Database Migrations: Need creation
- Testing: Need end-to-end testing

