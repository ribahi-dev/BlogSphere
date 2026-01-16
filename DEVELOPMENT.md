# Development Configuration Guide

## Local Development Setup

This guide helps you set up the project for local development.

### Prerequisites
- PHP 8.2 or higher
- Node.js 18 or higher
- Composer
- Git
- SQLite or PostgreSQL

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd projet-php
```

### Step 2: Backend Setup

```bash
cd backend

# Copy environment file
cp .env .env.local

# Install dependencies
composer install

# Run database migrations
php bin/console doctrine:migrations:migrate

# Start the development server
symfony server:start --no-tls --port=8000
```

The backend will be available at: `http://localhost:8000`

### Step 3: Frontend Setup

In a new terminal:

```bash
# From project root
npm install

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

### Step 4: Verify Installation

```bash
# Check installation
bash verify.sh
```

---

## Testing the Application

### Test with Built-in Test Script

```bash
bash test_backend.sh
```

### Test with Postman

1. Import `postman_collection.json` into Postman
2. Set the base URL: `http://localhost:8000/api`
3. Create test users and test endpoints

### Manual Testing with cURL

**Register a user:**
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

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Create article:**
```bash
curl -X POST http://localhost:8000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Article",
    "content": "Article content here",
    "description": "Short description"
  }'
```

---

## Database Management

### View Database Status
```bash
cd backend
php bin/console doctrine:migrations:status
```

### Create a New Migration
```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

### Reset Database
```bash
# WARNING: This deletes all data!
rm backend/var/data.db
php bin/console doctrine:migrations:migrate
```

### View Database Schema
```bash
php bin/console doctrine:query:sql "SELECT * FROM user;"
```

---

## Debugging

### Backend Logs
```bash
# View logs
tail -f backend/var/log/dev.log

# Clear logs
rm backend/var/log/dev.log
```

### Frontend Errors
- Check browser console: F12 → Console
- Check Network tab for API errors
- Check localStorage for token

### API Debugging
```bash
# Test API endpoint
curl -v http://localhost:8000/api/articles

# With token
curl -v http://localhost:8000/api/articles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Configuration Files

### Backend Configuration
```
backend/.env.local                    # Local environment variables
backend/config/services.yaml          # Service configuration
backend/config/packages/security.yaml # Security rules
```

### Frontend Configuration
```
.env.local                     # Frontend variables
vite.config.ts                 # Vite configuration
tsconfig.json                  # TypeScript configuration
```

---

## Development Commands

### Backend Commands
```bash
cd backend

# Clear cache
php bin/console cache:clear

# Create entity
php bin/console make:entity

# Run migrations
php bin/console doctrine:migrations:migrate

# Database validation
php bin/console doctrine:schema:validate
```

### Frontend Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Useful Tips

### Using Symfony Console
```bash
cd backend

# List all commands
php bin/console list

# Get help for a command
php bin/console help make:entity
```

### Using Composer
```bash
cd backend

# Update dependencies
composer update

# Add new package
composer require package-name

# List installed packages
composer show
```

### Using npm
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# List installed packages
npm list --depth=0
```

---

## Troubleshooting

### "Composer install" fails
```bash
# Clear Composer cache
composer clearcache

# Try again
composer install --no-interaction
```

### "npm install" fails
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Database connection error
1. Check .env.local DATABASE_URL
2. Ensure database file exists
3. Check permissions on var/ directory

### Port already in use
```bash
# Backend on different port
symfony server:start --no-tls --port=8001

# Frontend on different port
VITE_PORT=5174 npm run dev
```

---

## IDE Setup (VSCode)

### Recommended Extensions
1. **PHP Intelephense** - PHP language support
2. **REST Client** - Test API directly
3. **Postman** - API testing
4. **Thunder Client** - Alternative to Postman
5. **GitLens** - Git integration
6. **Prettier** - Code formatter
7. **ESLint** - JavaScript linting

### Settings
```json
{
  "[php]": {
    "editor.defaultFormatter": "bmewburn.vscode-intelephense-client"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Git Workflow

### Commit Changes
```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Add feature description"

# Push
git push origin main
```

### Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

---

## Performance Tips

1. **Enable Query Caching**: Check Doctrine configuration
2. **Use Database Indexes**: Already configured
3. **Minimize HTTP Requests**: Frontend caching
4. **Enable GZIP Compression**: Server configuration
5. **Use CDN**: For production assets

---

## Security Best Practices

1. Never commit `.env.local` or credentials
2. Use strong APP_SECRET
3. Keep dependencies updated
4. Validate all user input
5. Use HTTPS in production
6. Regularly backup database
7. Monitor logs for errors

---

## Next Steps

1. Read the [Project Guide](PROJECT_GUIDE.md)
2. Review [API Documentation](API_COMPLETE_DOCUMENTATION.md)
3. Check [QUICK_START.md](QUICK_START.md)
4. Test all API endpoints
5. Explore the codebase

---

**Happy Developing!** 🚀
