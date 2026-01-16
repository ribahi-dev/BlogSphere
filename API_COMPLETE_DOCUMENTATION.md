# API Documentation - Complete

## Base URL
```
http://localhost:8000/api
```

## Authentication
All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### 1. Register User
**POST** `/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe",
  "userType": "AUTHOR"  // Optional: AUTHOR (default) or ADMIN
}
```

**Response:**
```json
{
  "message": "Inscription réussie",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "AUTHOR",
    "roles": ["ROLE_AUTHOR", "ROLE_USER"]
  }
}
```

### 2. Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:** Same as register

### 3. Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "userType": "AUTHOR",
  "roles": ["ROLE_AUTHOR", "ROLE_USER"],
  "isAdmin": false,
  "isAuthor": true
}
```

### 4. Check Email Existence
**POST** `/auth/check-email`

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "exists": true
}
```

### 5. Logout
**POST** `/auth/logout`

**Response:**
```json
{
  "message": "Logout successful. Please remove the token from localStorage."
}
```

---

## Article Endpoints

### 1. List All Published Articles (Public)
**GET** `/articles`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Article Title",
    "description": "Short description",
    "content": "First 200 characters...",
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "publishedAt": "2026-01-11 10:30:00",
    "commentsCount": 2
  }
]
```

### 2. Get Article Detail (Public)
**GET** `/articles/{id}`

**Response:**
```json
{
  "id": 1,
  "title": "Article Title",
  "description": "Short description",
  "content": "Full article content...",
  "author": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "published": true,
  "createdAt": "2026-01-10 10:00:00",
  "updatedAt": null,
  "publishedAt": "2026-01-11 10:30:00",
  "commentsCount": 2
}
```

### 3. Get My Articles (Author/Admin)
**GET** `/articles/my-articles`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** Array of article objects

### 4. Create Article (Author/Admin)
**POST** `/articles`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "My Article",
  "content": "Full article content here...",
  "description": "Short description"
}
```

**Response:** Article object with `published: false`

### 5. Update Article (Owner/Admin)
**PUT** `/articles/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "description": "Updated description"
}
```

**Response:** Updated article object

### 6. Publish Article (Owner/Admin)
**POST** `/articles/{id}/publish`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "title": "Article Title",
  "published": true,
  "publishedAt": "2026-01-11 10:30:00",
  ...
}
```

### 7. Delete Article (Owner/Admin)
**DELETE** `/articles/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Article deleted successfully"
}
```

---

## Comment Endpoints

### 1. List Comments for Article (Public)
**GET** `/comments/article/{articleId}`

**Response:**
```json
[
  {
    "id": 1,
    "content": "Great article!",
    "author": {
      "id": 2,
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "articleId": 1,
    "createdAt": "2026-01-11 11:00:00",
    "updatedAt": null
  }
]
```

### 2. Create Comment (Admin Only)
**POST** `/comments`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "content": "Great article!",
  "articleId": 1
}
```

**Response:** Comment object

### 3. Update Comment (Owner/Admin)
**PUT** `/comments/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "content": "Updated comment text"
}
```

**Response:** Updated comment object

### 4. Delete Comment (Owner/Article Author/Admin)
**DELETE** `/comments/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Comment deleted successfully"
}
```

---

## Admin Endpoints

### 1. List All Users (Admin Only)
**GET** `/admin/users`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "AUTHOR",
    "roles": ["ROLE_AUTHOR", "ROLE_USER"],
    "createdAt": "2026-01-10 10:00:00"
  }
]
```

### 2. Update User Role (Admin Only)
**PUT** `/admin/users/{id}/role`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "userType": "ADMIN"
}
```

**Response:**
```json
{
  "message": "User role updated",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "ADMIN",
    "roles": ["ROLE_ADMIN", "ROLE_USER"]
  }
}
```

---

## User Roles

- **ROLE_USER**: Basic user role (everyone)
- **ROLE_AUTHOR**: Can create, edit, and publish articles
- **ROLE_ADMIN**: Can manage all articles, create comments, and manage users

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "error": "Article not found"
}
```

### 400 Bad Request
```json
{
  "error": "Title and content are required"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message"
}
```

---

## Setup Instructions

1. Install dependencies:
```bash
cd backend
composer install
```

2. Configure environment:
```bash
# Edit .env.local with your database and JWT settings
cp .env .env.local
```

3. Run migrations:
```bash
php bin/console doctrine:migrations:migrate
```

4. Start the server:
```bash
symfony server:start --no-tls --port=8000
```

5. Test the API:
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```
