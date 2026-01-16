# 📚 Complete Blog Application

> A fully functional, production-ready blog platform with user authentication, article management, and admin dashboard.

## 🚀 Quick Start

### The Fastest Way to Get Started

```bash
# Windows users - simply run:
RUN.bat

# Or run setup:
setup.bat
```

Then open http://127.0.0.1:8081 in your browser!

## 📖 Documentation

1. **[START HERE](START_HERE.md)** - Quick setup and test instructions
2. **[IMPLEMENTATION COMPLETE](IMPLEMENTATION_COMPLETE.md)** - Complete feature list and architecture
3. **[COMPLETE SETUP](COMPLETE_SETUP.md)** - Detailed API documentation
4. **[System Status](SYSTEM_STATUS.md)** - Current system state

## 🎯 What's Included

### ✅ User Features
- User registration and login
- Profile management
- Change password
- Create articles
- Edit/delete own articles
- Publish articles
- View all articles
- Add comments
- View comments

### ✅ Admin Features
- Admin dashboard with statistics
- Manage all users
- Moderate all articles
- View all comments
- Send messages to users
- Edit/delete any article
- Dashboard shows:
  - Total users count
  - Total articles count
  - Published vs unpublished
  - Total comments
  - Articles without tags
  - Recent articles and users

### ✅ Technical Features
- JWT authentication (24-hour tokens)
- Role-based access control
- Bcrypt password hashing
- PostgreSQL database
- Symfony REST API
- React frontend with TypeScript
- Real-time data updates
- Responsive design

## 🔑 Test Credentials

```
Author:  author1@test.com / password123
Author:  author2@test.com / password123
Admin:   admin@test.com / password123
```

## 📡 Access Points

After starting the application:

- **Frontend**: http://127.0.0.1:8081 (User Interface)
- **Backend API**: http://127.0.0.1:8000/api (REST API)
- **API Docs**: http://127.0.0.1:8000/api/docs (Swagger UI)

## 🛠 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | 18 / 5.6 |
| Build Tool | Vite | 5.4.19 |
| Backend | Symfony | 7.4 |
| Database | PostgreSQL | 18 |
| Authentication | JWT | HS256 |
| ORM | Doctrine | 3.6 |
| Language | PHP | 8.2+ |

## 💾 Database Schema

```
User (id, email, password, name, bio, avatar, user_type, roles)
Article (id, title, content, slug, author_id, category_id, published)
Comment (id, content, author_id, article_id)
Category (id, name, slug)
Tag (id, name, slug)
Message (id, sender_id, recipient_id, subject, content)
```

## 🔐 Security

- JWT tokens with 24-hour expiry
- Bcrypt password hashing
- Role-based access control
- Bearer token authentication
- CORS configuration
- SQL injection protection
- Input validation

## 📁 Project Structure

```
projet php/
├── backend/                 (Symfony API)
│   ├── src/
│   │   ├── Controller/
│   │   ├── Entity/
│   │   └── Service/
│   ├── migrations/
│   └── config/
├── src/                     (React Frontend)
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── styles/
├── START_HERE.md            ← Read this first!
├── IMPLEMENTATION_COMPLETE.md
├── COMPLETE_SETUP.md
└── RUN.bat / setup.bat
```

## 🧪 Quick Test

```bash
# 1. Login
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"author1@test.com","password":"password123"}'

# 2. Create article
curl -X POST http://127.0.0.1:8000/api/articles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Content","published":false}'

# 3. List articles
curl http://127.0.0.1:8000/api/articles

# 4. Admin dashboard
curl http://127.0.0.1:8000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## 🎮 Features in Action

### For Content Creators
1. Register or login
2. Create new article
3. Save as draft or publish
4. Edit articles anytime
5. View article statistics

### For Admins
1. Login with admin account
2. Access admin dashboard
3. View all users and articles
4. Moderate content
5. Send messages to users

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8000 in use | `symfony server:stop` then restart |
| Database error | `php bin/console doctrine:database:create` |
| Missing modules | `npm install` or `composer install` |
| Token expired | Login again to get new token |

## 📚 API Reference

See **[COMPLETE_SETUP.md](COMPLETE_SETUP.md)** for detailed API documentation including:
- All 30+ endpoints
- Request/response examples
- Authentication requirements
- Error codes

## 🚀 Production Deployment

1. Set environment to `prod`
2. Use HTTPS
3. Configure CORS for your domain
4. Set strong JWT secret
5. Use production database
6. Enable caching
7. Set up monitoring

See deployment guides in documentation.

## 💡 Key Features Explained

### Authentication
- Users get JWT token on login
- Token valid for 24 hours
- Include in "Authorization: Bearer TOKEN" header
- Automatic logout on expiry

### Articles
- Create as draft (not published)
- Publish to make visible
- Only authors or admins can edit/delete
- Automatic slug generation
- Categories and tags support

### Admin Dashboard
- Real-time statistics
- Recent activities
- User management
- Article moderation
- Message system

### Data Persistence
- All data saved to PostgreSQL
- Automatic migrations
- No data loss on restart
- Backup-ready

## ✨ What's Working

- ✅ User registration
- ✅ User login & JWT
- ✅ Profile management
- ✅ Article CRUD
- ✅ Comments system
- ✅ Admin dashboard
- ✅ Database persistence
- ✅ Role-based permissions
- ✅ Frontend UI
- ✅ Responsive design

## 🎯 Next Steps

1. Read **[START_HERE.md](START_HERE.md)**
2. Run `RUN.bat` or `setup.bat`
3. Open http://127.0.0.1:8081
4. Test with provided credentials
5. Create your first article!

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check backend logs: `symfony server:log`
3. Review **[COMPLETE_SETUP.md](COMPLETE_SETUP.md)**
4. Check database: `php bin/console doctrine:query:sql`

## 📄 License

This project is complete and ready for use.

---

**Status**: ✅ FULLY IMPLEMENTED  
**Last Updated**: 2026-01-14  
**Version**: 1.0.0

**Ready to use! Start with [START_HERE.md](START_HERE.md)** 🚀
- ✅ Write comments on published articles
- ✅ Delete any article
- ✅ Delete any comment
- ✅ Promote/demote users
- ✅ View all users and articles

### Public Features
- ✅ View all published articles
- ✅ Read article details
- ✅ View comments
- ✅ No authentication required

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+ with Composer
- Node.js 18+ with npm
- Git

### Windows Users
```bash
# Run the setup script
setup.bat
```

### Mac/Linux Users
```bash
# Run the setup script
bash setup.sh
```

### Manual Setup

**Backend**:
```bash
cd backend
composer install
php bin/console doctrine:migrations:migrate
symfony server:start --no-tls --port=8000
```

**Frontend** (new terminal):
```bash
npm install
npm run dev
```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- API Docs: Visit [API Documentation](API_COMPLETE_DOCUMENTATION.md)

---

## 📁 Project Structure

```
blog-platform/
├── backend/                    # Symfony Application
│   ├── src/
│   │   ├── Controller/        # API Controllers
│   │   ├── Entity/            # Database Models
│   │   ├── Repository/        # Database Queries
│   │   └── Service/           # Business Logic
│   ├── config/
│   ├── migrations/            # Database Migrations
│   └── public/                # Web Root
│
├── src/                       # React Frontend
│   ├── components/            # Reusable Components
│   ├── pages/                 # Page Components
│   ├── services/              # API Services
│   └── main.tsx               # Entry Point
│
├── API_COMPLETE_DOCUMENTATION.md
├── PROJECT_GUIDE.md
├── QUICK_START.md
└── package.json
```

---

## 🔐 Authentication & Authorization

### User Roles

| Role | Create Articles | Publish | Comments | Manage Users | Delete Any |
|------|-----------------|---------|----------|--------------|-----------|
| Author | ✅ | ✅ (own) | ❌ | ❌ | ❌ |
| Admin | ✅ | ✅ (any) | ✅ | ✅ | ✅ |
| Public | ❌ | ❌ | ❌ | ❌ | ❌ |

### Token Storage
Tokens are stored in browser's localStorage:
```javascript
localStorage.setItem('auth_token', token);
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Articles
- `GET /api/articles` - List published articles
- `GET /api/articles/{id}` - Get article detail
- `POST /api/articles` - Create new article
- `PUT /api/articles/{id}` - Update article
- `POST /api/articles/{id}/publish` - Publish article
- `DELETE /api/articles/{id}` - Delete article

### Comments
- `GET /api/comments/article/{id}` - List comments
- `POST /api/comments` - Create comment (admin only)
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

    ### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/{id}/role` - Update user role

---

## 🧪 Testing

### Using Postman
1. Import `postman_collection.json`
2. Set base URL: `http://localhost:8000/api`
3. Create test accounts and test endpoints

### Using cURL
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Pass123!",
    "name": "Test User",
    "userType": "AUTHOR"
  }'
```

### Using Test Script
```bash
bash test_backend.sh
```

---

## 🛠️ Development

### Tech Stack

**Backend**:
- Symfony 7.4 Framework
- API Platform
- Doctrine ORM
- JWT Authentication
- SQLite/PostgreSQL

**Frontend**:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Environment Configuration

**Backend** (.env.local):
```env
APP_ENV=dev
APP_SECRET=your-secret-key
DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
FRONTEND_URL=http://localhost:5173
JWT_EXPIRATION=7
```

**Frontend** (.env.local):
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 📊 Database Schema

### Users
- id, email, password, name, user_type, roles, created_at, google_id

### Articles
- id, author_id, title, content, description, published, created_at, updated_at, published_at

### Comments
- id, article_id, author_id, content, created_at, updated_at

---

## 🚨 Troubleshooting

### Backend Issues
```bash
# Check if migrations are up to date
cd backend
php bin/console doctrine:migrations:status

# Run missing migrations
php bin/console doctrine:migrations:migrate

# Clear cache
php bin/console cache:clear
```

### Frontend Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Check `.env.local` for correct API URL
- Verify backend is running on port 8000

### Authentication Issues
- Ensure JWT_EXPIRATION is set in .env.local
- Check token format in browser console
- Verify Authorization header is correct

---

## 🚀 Production Deployment

### Backend Deployment
1. Clone repository
2. Update `.env.local` for production
3. Run migrations: `php bin/console doctrine:migrations:migrate`
4. Set `APP_ENV=prod`
5. Configure web server (Apache/Nginx)

### Frontend Deployment
1. Build: `npm run build`
2. Deploy `dist/` folder to web server
3. Configure API URL for production
4. Setup HTTPS

### Security Checklist
- [ ] Change APP_SECRET
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Configure proper CORS
- [ ] Setup firewall rules
- [ ] Regular backups
- [ ] Update dependencies

---

## 📚 Documentation

- [Quick Start Guide](QUICK_START.md) - Get running in 5 minutes
- [API Documentation](API_COMPLETE_DOCUMENTATION.md) - All endpoints
- [Project Guide](PROJECT_GUIDE.md) - Architecture and details
- [Backend README](backend/README_BACKEND.md) - Backend setup

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Documentation](#-documentation)
3. Check application logs

---

## ✅ Project Status

**Status**: ✨ **PRODUCTION READY**

All core features implemented and tested.

### Version History
- v2.0.0 - Added RBAC and improved backend
- v1.0.0 - Initial release

---

## 🎉 Thank You

Thank you for using Blog Platform!

Happy blogging! 🚀

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
