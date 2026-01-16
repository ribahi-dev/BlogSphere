# 🚀 QUICK START GUIDE

## Your Blog Platform is Ready! 

### What's Included?
✅ Full-stack application with React + Symfony
✅ User authentication with JWT tokens
✅ 2 User Roles: AUTHOR and ADMIN
✅ Complete CRUD for articles and comments
✅ Production-ready code

---

## ⚡ 5-Minute Setup (Windows)

1. **Run Setup Script**:
   ```bash
   setup.bat
   ```

2. **Start Backend** (in new terminal):
   ```bash
   cd backend
   symfony server:start --no-tls --port=8000
   ```

3. **Start Frontend** (in new terminal):
   ```bash
   npm run dev
   ```

4. **Open Browser**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

---

## ⚡ 5-Minute Setup (Mac/Linux)

1. **Run Setup Script**:
   ```bash
   bash setup.sh
   ```

2. **Start Backend** (in new terminal):
   ```bash
   cd backend
   symfony server:start --no-tls --port=8000
   ```

3. **Start Frontend** (in new terminal):
   ```bash
   npm run dev
   ```

4. **Open Browser**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

---

## 👥 Test User Roles

### Create an AUTHOR Account
1. Go to http://localhost:5173/register
2. Select **Profil: Auteur**
3. Fill in details and click "Créer mon compte"
4. You'll be logged in and redirected to home

**AUTHOR Permissions:**
- ✅ Write and publish articles
- ✅ Edit own articles
- ✅ View published articles
- ✅ View public comments
- ❌ Cannot write comments
- ❌ Cannot manage users

### Create an ADMIN Account
1. Go to http://localhost:5173/register
2. Select **Profil: Admin**
3. Enter the **Admin Code**: `ChangeMeAdminCode` (from `.env.local`)
4. Fill in other details and click "Créer mon compte"
5. You'll be logged in with full admin privileges

**ADMIN Permissions:**
- ✅ All AUTHOR permissions
- ✅ Write comments on any article
- ✅ Edit/delete any comment
- ✅ Edit/delete any article
- ✅ View and manage all users
- ✅ Change user roles (AUTHOR ↔ ADMIN)

### Security Note
⚠️ **Change the Admin Code!**

Edit `backend/.env.local`:
```
ADMIN_SECRET_CODE=YourSecureCodeHere
```

Then clear cache:
```bash
cd backend
php bin/console cache:clear
```

---

## 📝 Key Features to Try

### As Author:
1. Register as author
2. Create a new article (draft)
3. Edit the article
4. Publish the article
5. View it in the public list

### As Admin:
1. Register as admin
2. View all published articles
3. Write a comment on an article
4. Manage users (change roles)
5. Delete articles or comments

### As Public User:
1. View all published articles
2. Read article details
3. See comments

---

## 📚 Documentation

- **[Full API Documentation](API_COMPLETE_DOCUMENTATION.md)** - Complete API endpoints
- **[Project Guide](PROJECT_GUIDE.md)** - Architecture and setup
- **[Backend README](backend/README_BACKEND.md)** - Backend specific info

---

## 🧪 Test the API

### Register as AUTHOR (Terminal)
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Author",
    "email": "author@test.local",
    "password": "Password123",
    "userType": "AUTHOR"
  }'
```

### Register as ADMIN (Terminal)
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Admin",
    "email": "admin@test.local",
    "password": "Password123",
    "userType": "ADMIN",
    "adminCode": "ChangeMeAdminCode"
  }'
```

### Login (Terminal)
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@test.local",
    "password": "Password123"
  }'
```

Response contains `token` — copy it for authenticated requests:
```bash
TOKEN="your-token-here"

# Get user profile
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Create article
curl -X POST http://localhost:8000/api/articles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Article",
    "content": "Article content here",
    "description": "Brief description"
  }'
```

### Using Postman
1. Import `postman_collection.json` in Postman
2. Set variables (tokens, URLs)
3. Test all endpoints

---

## 🔧 Troubleshooting

### Backend won't start?
```bash
cd backend
composer install
php bin/console doctrine:migrations:migrate
symfony server:start --no-tls --port=8000
```

### Frontend won't connect?
- Check if backend is running on port 8000
- Clear browser cache
- Check `.env.local` file (VITE_API_URL)

### Database errors?
```bash
cd backend
php bin/console doctrine:migrations:migrate --no-interaction
```

### Reset everything?
```bash
# Delete database
rm backend/var/data.db

# Re-migrate
cd backend
php bin/console doctrine:migrations:migrate
```

---

## 📦 Project Structure

```
Backend (Symfony)
├── Controllers: API endpoints
├── Entities: User, Article, Comment
├── Services: JWT, Google OAuth
└── Migrations: Database setup

Frontend (React)
├── Pages: Login, Articles, Editor
├── Components: Reusable UI components
├── Services: API client
└── Hooks: Custom React hooks
```

---

## 🎯 Next Steps

1. ✅ Register and create an article
2. ✅ Publish an article
3. ✅ Test admin features
4. ✅ Try the API with Postman
5. ✅ Deploy to production

---

## 🚀 Deploy to Production

### Before deploying:
1. Update `APP_SECRET` to a strong random value
2. Set `APP_ENV=prod`
3. Configure your database (PostgreSQL recommended)
4. Set proper CORS_ALLOW_ORIGIN
5. Use HTTPS

### Backend:
```bash
composer install --no-dev
php bin/console cache:clear
php bin/console doctrine:migrations:migrate
```

### Frontend:
```bash
npm run build
# Deploy dist/ folder to your server
```

---

## 💡 Tips

- Keep tokens secure (never expose in code)
- Use HTTPS in production
- Backup your database regularly
- Test thoroughly before deployment
- Check logs in `backend/var/log/`

---

## 📞 Need Help?

1. Check the [Full Documentation](PROJECT_GUIDE.md)
2. Review [API Documentation](API_COMPLETE_DOCUMENTATION.md)
3. Check backend logs: `backend/var/log/`
4. Check browser console for frontend errors

---

## ✨ Congratulations!

Your blog platform is ready to use! 🎉

Start creating amazing content!
