# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `NEXTAUTH_SECRET`: Generate a random string (you can use `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Optional, for Google OAuth
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Create a new project or select existing
     - Enable Google+ API
     - Create OAuth 2.0 credentials
     - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

3. **Initialize database:**
   ```bash
   npm run db:generate  # Generate Prisma client
   npm run db:push      # Create database schema
   npm run db:seed      # Seed default schools
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## First User Setup

1. Click "Get Started" on the welcome screen
2. Sign up with email/password or Google
3. Select your school during onboarding
4. Start creating service listings!

## Admin Access

Currently, any authenticated user can access the admin dashboard at `/admin`. In production, you should add role-based access control.

## Troubleshooting

### Database Issues
- If you get database errors, try deleting `prisma/dev.db` and running `npm run db:push` again
- Make sure SQLite is available on your system

### Authentication Issues
- Make sure `NEXTAUTH_SECRET` is set in `.env`
- For Google OAuth, verify your redirect URI matches exactly

### Port Already in Use
- Change the port by running: `PORT=3001 npm run dev`

