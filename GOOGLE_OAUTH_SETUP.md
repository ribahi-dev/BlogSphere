# Google OAuth Setup Guide for Goal Achiever Pal

## Overview
The project now has:
- **Frontend**: React app with Google login buttons on `/login` and `/register`
- **Backend**: Symfony API with Google OAuth callback at `/api/auth/google/callback`

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **OAuth consent screen** and set up the app (fill in app name, user support email, etc.)
5. Go to **Credentials** → **Create OAuth 2.0 Client ID** → **Web application**
6. Add Authorized redirect URIs:
   ```
   http://localhost:8000/api/auth/google/callback
   ```she
7. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Environment Variables

### Backend (`backend/.env.local`)
```bash
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

### Frontend (`.env` in project root)
```bash
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

## Step 3: Start the Project

### Terminal 1 - Frontend
```bash
npm run dev
```
App runs at `http://localhost:8082`

### Terminal 2 - Backend
```bash
cd backend
php bin/console server:run
# or if symfony CLI is installed:
symfony server:start
```
Backend runs at `http://localhost:8000`

## Step 4: Test Google Sign-In

1. Open frontend at `http://localhost:8082/login`
2. Click "Continuer avec Google"
3. You'll be redirected to Google's consent screen
4. After consent, you'll be redirected back and logged in with your token stored in `localStorage`

## How It Works

1. **User clicks "Continuer avec Google"**
   - Frontend redirects to Google OAuth with `client_id`, `scope`, and `redirect_uri`

2. **User authorizes**
   - Google redirects back to frontend callback: `http://localhost:8082/auth/google/callback?code=...`

3. **Frontend callback handler**
   - Receives the auth code and redirects to backend: `http://localhost:8000/api/auth/google/callback?code=...`

4. **Backend processes authorization code**
   - Exchanges code for Google access token
   - Gets user info from Google
   - Creates or finds user in database
   - Generates JWT token
   - Redirects frontend to home page with token stored in `localStorage`

5. **Frontend is now authenticated**
   - Token is sent in `Authorization: Bearer <token>` header for API calls
   - User info accessible via `/api/auth/me` endpoint

## Database

Tables created:
- `user`: Stores user profile and Google ID
- `oauth_token`: Stores access/refresh tokens

Use SQLite for local development (already configured).

## Notes

- JWT tokens are generated server-side (not production-grade, but functional)
- For production: use `lcobucci/jwt` or similar library
- CORS is configured to allow requests from `localhost`
- User signup is automatic on first Google login

## Troubleshooting

- **"Google not configured"**: Check `.env` and `.env.local` for `GOOGLE_CLIENT_ID`
- **Redirect URI mismatch**: Ensure URIs in Google Console match `.env` variables exactly
- **Database errors**: Run `php bin/console doctrine:migrations:migrate` again
- **Backend not responding**: Check Symfony server is running on port 8000
