# Backend — Symfony 7.4 Complete Setup & Documentation

### Project Structure

```
backend/
├── src/
│   ├── Entity/
│   │   ├── User.php        - User with role-based system
│   │   ├── Article.php     - Article model
│   │   └── Comment.php     - Comment model
│   ├── Controller/
│   │   ├── AuthController.php      - Authentication endpoints
│   │   ├── ArticleController.php   - Article CRUD
│   │   ├── CommentController.php   - Comment management
│   │   └── AdminController.php     - Admin features
│   ├── Repository/
│   │   ├── ArticleRepository.php   - Article queries
│   │   └── CommentRepository.php   - Comment queries
│   └── Service/
│       ├── JwtService.php          - JWT token management
│       └── GoogleOAuthService.php  - Google OAuth
├── config/
│   ├── services.yaml      - Service configuration
│   └── packages/
│       ├── security.yaml  - Security/RBAC rules
│       ├── nelmio_cors.yaml - CORS configuration
│       └── api_platform.yaml - API Platform config
├── migrations/
│   └── Version20260111120000.php - Database schema
└── public/
    └── index.php - Entry point
```

## Features

### Authentication
- Email/password registration with user type support
- JWT token-based login (7-day expiration)
- Two user types: AUTHOR and ADMIN
- Google OAuth integration
- Automatic role assignment

### Articles Management
- Create, read, update, delete (CRUD) operations
- Draft/published workflow
- Author relationships and permissions
- Full-text search ready
- Admin can manage all articles

### Comments System (Admin-Only)
- Read comments on published articles (public)
- Create comments (admin only)
- Edit comments (owner or admin)
- Delete comments (owner, article author, or admin)
- Full audit trail with timestamps

### Admin Dashboard
- List all users
- Change user roles (AUTHOR ↔ ADMIN)
- Manage all articles and comments
- User statistics

## Quick Start (5 minutes)

### Prerequisites
- PHP 8.2+
- Composer
- SQLite (default) or PostgreSQL

### Installation

```bash
cd backend
composer install
php bin/console doctrine:migrations:migrate
symfony server:start --no-tls --port=8000
```

API available at: `http://localhost:8000/api`

## API Endpoints Summary

### Auth (18 endpoints total)
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login with credentials
- GET `/api/auth/me` - Get current user profile
- POST `/api/auth/check-email` - Check email availability
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/google/callback` - Google OAuth callback

### Articles
- GET `/api/articles` - List published articles (public)
- GET `/api/articles/{id}` - Get article details
- POST `/api/articles` - Create new article
- PUT `/api/articles/{id}` - Update article
- POST `/api/articles/{id}/publish` - Publish article
- DELETE `/api/articles/{id}` - Delete article
- GET `/api/articles/my-articles` - Get user's articles

### Comments
- GET `/api/comments/article/{id}` - List comments (public)
- POST `/api/comments` - Create comment (admin only)
- PUT `/api/comments/{id}` - Update comment
- DELETE `/api/comments/{id}` - Delete comment

### Admin
- GET `/api/admin/users` - List all users (admin only)
- PUT `/api/admin/users/{id}/role` - Update user role (admin only)

## Testing

### Register Test User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User",
    "userType": "AUTHOR"
  }'
```

### Test with Provided Script
```bash
bash test_backend.sh
```

### Test with Postman
Import `postman_collection.json` from project root

## Database

### Schema (SQLite for dev)
- **users**: id, email, password, name, user_type, roles, created_at, google_id
- **articles**: id, author_id, title, content, description, published, created_at, updated_at, published_at
- **comments**: id, article_id, author_id, content, created_at, updated_at

### Migrations
```bash
php bin/console doctrine:migrations:migrate  # Run migrations
php bin/console doctrine:migrations:status   # Check status
```

## Environment Configuration

### Development (.env.local)
```env
APP_ENV=dev
APP_SECRET=dev-secret-key
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
FRONTEND_URL=http://localhost:5173
JWT_EXPIRATION=7
CORS_ALLOW_ORIGIN=^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$
```

### Production
```env
APP_ENV=prod
APP_SECRET=<strong-random-string>
DATABASE_URL="postgresql://user:pass@host:5432/blog"
FRONTEND_URL=https://yourdomain.com
JWT_EXPIRATION=7
CORS_ALLOW_ORIGIN=https://yourdomain.com
```

## Security Features

✅ Password hashing (bcrypt/argon)
✅ JWT token authentication
✅ Role-based access control (RBAC)
✅ CORS protection
✅ Input validation
✅ Secure error handling
✅ Token expiration

## Common Commands

```bash
# Cache management
php bin/console cache:clear

# Create migration
php bin/console make:migration

# Run migrations
php bin/console doctrine:migrations:migrate

# Debug routes
php bin/console debug:router

# View logs
tail -f var/log/dev.log
```

## Troubleshooting

### Database error
```bash
chmod -R 755 var/
php bin/console doctrine:migrations:migrate
```

### Port in use
```bash
symfony server:start --no-tls --port=8001
```

### Composer issues
```bash
composer clearcache
composer install --no-interaction
```

## Production Deployment

1. Set `APP_ENV=prod`
2. Generate strong `APP_SECRET`
3. Configure PostgreSQL
4. Setup HTTPS
5. Run migrations: `php bin/console doctrine:migrations:migrate`
6. Clear cache: `php bin/console cache:clear --env=prod`
7. Setup monitoring and backups

## Documentation

- [API_COMPLETE_DOCUMENTATION.md](../API_COMPLETE_DOCUMENTATION.md) - Full API reference
- [PROJECT_GUIDE.md](../PROJECT_GUIDE.md) - Architecture and setup
- [QUICK_START.md](../QUICK_START.md) - 5-minute quick start
- [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md) - Production deployment

## Status

✅ **Production Ready**
✅ **All Features Implemented**
✅ **Fully Documented**
