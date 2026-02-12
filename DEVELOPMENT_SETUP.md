# Development Setup Guide - Zoe Resume Builder

This guide will help you set up **Zoe Resume Builder** (based on Reactive Resume) on your local machine for development. We'll walk through every step in simple language, perfect for beginners!

## 📋 Table of Contents

- [What You'll Need](#what-youll-need)
- [Step 1: Install Required Software](#step-1-install-required-software)
- [Step 2: Get the Code](#step-2-get-the-code)
- [Step 3: Setup Backend Services](#step-3-setup-backend-services)
- [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
- [Step 5: Setup Database](#step-5-setup-database)
- [Step 6: Install Dependencies](#step-6-install-dependencies)
- [Step 7: Start Development Server](#step-7-start-development-server)
- [Troubleshooting](#troubleshooting)

---

## What You'll Need

Before we start, here's what you need to install on your computer:

1. **Node.js** (version 20 or higher) - JavaScript runtime
2. **pnpm** (version 10.28.2 or higher) - Package manager (faster than npm)
3. **Docker Desktop** - To run backend services (database, storage, etc.)
4. **Git** - Version control system
5. **A code editor** - We recommend VS Code

---

## Step 1: Install Required Software

### 1.1 Install Node.js

**For macOS:**
```bash
# Using Homebrew (recommended)
brew install node@20

# Verify installation
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
```

**For Windows:**
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer (.msi file)
3. Follow the installation wizard
4. Open Command Prompt and verify:
```cmd
node --version
npm --version
```

**For Linux (Ubuntu/Debian):**
```bash
# Install using NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 1.2 Install pnpm

Once Node.js is installed, install pnpm globally:

```bash
npm install -g pnpm@10.28.2

# Verify installation
pnpm --version  # Should show 10.28.2 or higher
```

### 1.3 Install Docker Desktop

**For macOS:**
1. Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. Open the .dmg file and drag Docker to Applications
3. Launch Docker Desktop
4. Wait for it to start (whale icon in menu bar)

**For Windows:**
1. Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. Run the installer
3. Follow the installation wizard
4. Restart your computer if prompted
5. Launch Docker Desktop

**For Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (to avoid using sudo)
sudo usermod -aG docker $USER
# Log out and log back in for this to take effect
```

Verify Docker is running:
```bash
docker --version
docker-compose --version
```

### 1.4 Install Git

**For macOS:**
```bash
# Using Homebrew
brew install git

# Verify
git --version
```

**For Windows:**
1. Download from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer
3. Use default options
4. Verify in Command Prompt:
```cmd
git --version
```

**For Linux:**
```bash
sudo apt-get install git

# Verify
git --version
```

---

## Step 2: Get the Code

### 2.1 Clone the Repository

Open your terminal (or Command Prompt on Windows) and navigate to where you want to store the project:

```bash
# Navigate to your projects folder
cd ~/Desktop  # or any folder you prefer

# Clone the repository
git clone https://github.com/yourusername/zoe-resume-builder.git

# Enter the project directory
cd zoe-resume-builder
```

### 2.2 Verify Project Structure

Make sure you're in the right directory:

```bash
# List files - you should see package.json, src/, etc.
ls -la  # macOS/Linux
dir     # Windows
```

---

## Step 3: Setup Backend Services

The application needs several services to run (database, storage, PDF printer). We'll use Docker to run all of them easily!

### 3.1 Start Docker Desktop

Make sure Docker Desktop is running (you should see the whale icon in your system tray/menu bar).

### 3.2 Start Backend Services

Run this command in your project directory:

```bash
docker-compose -f compose.dev.yml up -d
```

**What this does:**
- `-f compose.dev.yml` - Uses the development configuration file
- `up` - Starts all services
- `-d` - Runs in background (detached mode)

**Services that will start:**
1. **PostgreSQL** (Database) - Port 5432
2. **Adminer** (Database UI) - Port 8080
3. **Browserless** (PDF Generation) - Port 4000
4. **SeaweedFS** (File Storage) - Port 8333
5. **Mailpit** (Email Testing) - Port 1025 & 8025

### 3.3 Verify Services are Running

```bash
# Check running containers
docker-compose -f compose.dev.yml ps

# You should see all services with status "Up"
```

**Access Service UIs:**
- Database Admin: http://localhost:8080
- Email Viewer: http://localhost:8025
- File Storage: http://localhost:8333

### 3.4 Wait for Services to be Ready

First time setup takes 1-2 minutes. Check the logs to ensure everything is ready:

```bash
# View all service logs
docker-compose -f compose.dev.yml logs

# Or follow logs in real-time
docker-compose -f compose.dev.yml logs -f

# Press Ctrl+C to stop viewing logs
```

---

## Step 4: Configure Environment Variables

Environment variables tell the app how to connect to services and configure features.

### 4.1 Copy the Example File

```bash
# Copy .env.example to .env
cp .env.example .env
```

### 4.2 Edit the .env File

Open `.env` in your code editor. Here's what each setting means:

```bash
# --- Server ---
TZ="Etc/UTC"                                    # Timezone
APP_URL="http://localhost:3000"                 # Where your app runs

# --- Printer (PDF Generation) ---
PRINTER_APP_URL="http://host.docker.internal:3000"  # Don't change this
PRINTER_ENDPOINT="ws://localhost:4000?token=1234567890"

# --- Database ---
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# --- Authentication ---
# Generate a secret key using: openssl rand -hex 32
AUTH_SECRET="change-me-to-a-secure-secret-key-in-production"

# --- Email (Development) ---
SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="Zoe Resume Builder <noreply@zoeresume.com>"
SMTP_SECURE="false"

# --- Storage (Development) ---
S3_ACCESS_KEY_ID="seaweedfs"
S3_SECRET_ACCESS_KEY="seaweedfs"
S3_REGION="us-east-1"
S3_ENDPOINT="http://localhost:8333"
S3_BUCKET="reactive-resume"
S3_FORCE_PATH_STYLE="true"

# --- Feature Flags ---
FLAG_DEBUG_PRINTER="false"
FLAG_DISABLE_SIGNUPS="false"
FLAG_DISABLE_EMAIL_AUTH="false"
```

### 4.3 Generate AUTH_SECRET

You need a secure random key for authentication:

**For macOS/Linux:**
```bash
openssl rand -hex 32
```

**For Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

Copy the generated key and replace `change-me-to-a-secure-secret-key-in-production` in your `.env` file.

### 4.4 Optional: Setup Social Login (Advanced)

If you want Google or GitHub login:

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/auth/callback/google` as redirect URI
6. Copy Client ID and Secret to `.env`:
```bash
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Homepage URL to `http://localhost:3000`
4. Set callback URL to `http://localhost:3000/auth/callback/github`
5. Copy Client ID and Secret to `.env`:
```bash
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

---

## Step 5: Setup Database

Now we'll create the database tables and initial data.

### 5.1 Run Database Migrations

```bash
# This creates all necessary tables in PostgreSQL
pnpm db:push
```

**What this does:**
- Reads database schema from `src/integrations/drizzle/schema/`
- Creates tables in PostgreSQL
- Sets up initial structure

### 5.2 Verify Database Setup

You can check your database using Adminer:

1. Open http://localhost:8080 in your browser
2. Login with these credentials:
   - **System:** PostgreSQL
   - **Server:** postgres
   - **Username:** postgres
   - **Password:** postgres
   - **Database:** postgres
3. Click "Login"
4. You should see tables like `user`, `resume`, `session`, etc.

---

## Step 6: Install Dependencies

Now let's install all the JavaScript packages the app needs:

```bash
# Install all dependencies
pnpm install
```

**This will install:**
- React and React Router (Frontend framework)
- TanStack Start (Full-stack framework)
- Drizzle ORM (Database toolkit)
- Better Auth (Authentication)
- Tiptap (Rich text editor)
- And ~150 other packages

**This may take 3-5 minutes on first install.**

### 6.1 Verify Installation

```bash
# Check that node_modules folder was created
ls -la | grep node_modules  # macOS/Linux
dir | findstr node_modules   # Windows

# You should see a node_modules folder
```

---

## Step 7: Start Development Server

Everything is ready! Let's start the development server.

### 7.1 Start the App

```bash
pnpm dev
```

**What you'll see:**
```
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

### 7.2 Open the App

1. Open your browser
2. Go to http://localhost:3000
3. You should see "Zoe Resume Builder" with a "Get Started" button

### 7.3 Create Your First Account

1. Click "Get Started"
2. You'll be redirected to the dashboard login page
3. Click "Sign Up" or "Register"
4. Fill in your details:
   - Name
   - Email
   - Password
5. Click "Create Account"

**Note:** Emails will be sent to Mailpit (http://localhost:8025), not real email addresses.

### 7.4 Verify Email (Development)

1. Open http://localhost:8025 in another tab
2. You should see a verification email
3. Click the verification link in the email
4. Your account is now verified!

---

## 🎉 Success! You're Ready to Develop

Your development environment is fully set up! Here's what's running:

| Service | URL | Purpose |
|---------|-----|---------|
| App | http://localhost:3000 | Main application |
| Database Admin | http://localhost:8080 | View/edit database |
| Email Viewer | http://localhost:8025 | View test emails |
| Storage | http://localhost:8333 | File storage admin |

---

## Common Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run type checking
pnpm typecheck

# Format code
pnpm lint

# View database in GUI
pnpm db:studio

# Generate database migrations
pnpm db:generate

# Stop all Docker services
docker-compose -f compose.dev.yml down

# Restart all Docker services
docker-compose -f compose.dev.yml restart

# View service logs
docker-compose -f compose.dev.yml logs -f
```

---

## Troubleshooting

### Problem: Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find what's using the port
lsof -ti:3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use a different port
# In .env, change APP_URL to http://localhost:3001
```

### Problem: Docker Services Won't Start

**Error:** `Cannot connect to Docker daemon`

**Solution:**
1. Make sure Docker Desktop is running
2. Restart Docker Desktop
3. Try again:
```bash
docker-compose -f compose.dev.yml up -d
```

### Problem: Database Connection Failed

**Error:** `Connection refused - connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose -f compose.dev.yml ps

# If not running, start it
docker-compose -f compose.dev.yml up -d postgres

# Wait 30 seconds, then try again
```

### Problem: pnpm install Fails

**Error:** Various dependency errors

**Solution:**
```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and lockfile
rm -rf node_modules pnpm-lock.yaml

# Install again
pnpm install
```

### Problem: Database Tables Not Created

**Solution:**
```bash
# Run migrations again
pnpm db:push

# Or generate and migrate
pnpm db:generate
pnpm db:migrate
```

### Problem: Can't Access Database Admin (Adminer)

**Solution:**
```bash
# Restart adminer service
docker-compose -f compose.dev.yml restart adminer

# Check logs
docker-compose -f compose.dev.yml logs adminer
```

### Problem: PDF Generation Not Working

**Error:** Cannot generate PDF

**Solution:**
```bash
# Check browserless is running
docker-compose -f compose.dev.yml ps browserless

# Restart browserless
docker-compose -f compose.dev.yml restart browserless

# Check the printer endpoint in .env
# Should be: PRINTER_ENDPOINT="ws://localhost:4000?token=1234567890"
```

### Problem: File Upload Not Working

**Solution:**
```bash
# Check SeaweedFS is running
docker-compose -f compose.dev.yml ps seaweedfs

# Restart SeaweedFS
docker-compose -f compose.dev.yml restart seaweedfs

# Recreate the bucket
docker-compose -f compose.dev.yml up seaweedfs_create_bucket
```

### Problem: Hot Reload Not Working

**Solution:**
1. Check if `pnpm dev` is still running
2. Restart the dev server (Ctrl+C, then `pnpm dev` again)
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Problem: TypeScript Errors

**Solution:**
```bash
# Run type checking
pnpm typecheck

# If you see errors in node_modules, try:
rm -rf node_modules .tanstack
pnpm install
```

---

## Getting Help

If you're stuck:

1. **Check the logs:**
   - App logs: In your terminal where `pnpm dev` is running
   - Docker logs: `docker-compose -f compose.dev.yml logs -f`

2. **Search for the error message** on Google or Stack Overflow

3. **Ask for help:**
   - Create an issue on GitHub
   - Join the Discord community
   - Check the documentation at https://docs.rxresu.me

---

## Next Steps

Now that your environment is set up, you can:

1. **Explore the codebase:**
   - `src/routes/` - Page components
   - `src/components/` - Reusable UI components
   - `src/integrations/` - Backend services
   - `src/schema/` - Data validation schemas

2. **Make your first change:**
   - Edit `src/routes/_home/index.tsx`
   - Change "Zoe Resume Builder" to something else
   - Save and see it update in the browser!

3. **Learn the tech stack:**
   - [TanStack Start](https://tanstack.com/start) - Framework
   - [React](https://react.dev/) - UI library
   - [Drizzle ORM](https://orm.drizzle.team/) - Database
   - [Better Auth](https://www.better-auth.com/) - Authentication

4. **Read the architecture:**
   - Check `docs/contributing/architecture.mdx`
   - Understand how data flows
   - Learn about the resume builder

---

## Project Structure Overview

```
zoe-resume-builder/
├── src/
│   ├── routes/              # Pages and routing
│   │   ├── _home/           # Homepage
│   │   ├── auth/            # Login/Register pages
│   │   ├── dashboard/       # Dashboard pages
│   │   └── builder/         # Resume builder
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (buttons, inputs, etc.)
│   │   └── ...              # Feature components
│   ├── integrations/        # Backend services
│   │   ├── drizzle/         # Database ORM
│   │   ├── auth/            # Authentication
│   │   └── orpc/            # API routes
│   ├── schema/              # Data validation (Zod schemas)
│   ├── hooks/               # React hooks
│   ├── utils/               # Helper functions
│   └── styles/              # Global styles
├── public/                  # Static files (images, icons, etc.)
├── migrations/              # Database migrations
├── locales/                 # Translations (i18n)
├── docs/                    # Documentation
├── .env                     # Environment variables (YOU CREATE THIS)
├── .env.example             # Example environment variables
├── package.json             # Dependencies and scripts
├── compose.dev.yml          # Docker services for development
├── vite.config.ts           # Build configuration
└── tsconfig.json            # TypeScript configuration
```

---

## Important Files

- **`.env`** - Your local configuration (never commit this!)
- **`package.json`** - All dependencies and scripts
- **`vite.config.ts`** - Build and dev server config
- **`drizzle.config.ts`** - Database configuration
- **`src/router.tsx`** - Main app router
- **`src/integrations/drizzle/schema/`** - Database schema

---

## Development Tips

### 1. Use TypeScript Strictly
This project uses TypeScript. Your editor will show type errors. Fix them before running the app.

### 2. Use the Database Studio
```bash
pnpm db:studio
```
This opens a GUI at http://localhost:4983 to view/edit your database directly.

### 3. Check Email in Mailpit
All emails in development go to Mailpit (http://localhost:8025), not real email addresses.

### 4. Use React DevTools
Install React DevTools browser extension to inspect components and state.

### 5. Hot Reload is Your Friend
Save your files and the browser automatically refreshes. No need to restart the server!

### 6. Format Code Before Committing
```bash
pnpm lint
```
This formats your code using Biome (similar to Prettier).

---

## Environment Variables Explained

| Variable | What It Does | Default |
|----------|--------------|---------|
| `APP_URL` | Your app's URL | http://localhost:3000 |
| `DATABASE_URL` | PostgreSQL connection string | postgresql://... |
| `AUTH_SECRET` | Secret key for sessions/JWT | (generate one!) |
| `PRINTER_ENDPOINT` | PDF generation service | ws://localhost:4000?token=... |
| `SMTP_HOST` | Email server hostname | localhost |
| `SMTP_PORT` | Email server port | 1025 |
| `S3_ENDPOINT` | File storage URL | http://localhost:8333 |
| `FLAG_DISABLE_SIGNUPS` | Disable new registrations | false |
| `FLAG_DISABLE_EMAIL_AUTH` | Disable email/password login | false |

---

## Frequently Asked Questions

### Q: Do I need to restart the dev server after changing .env?
**A:** Yes! Press Ctrl+C to stop, then run `pnpm dev` again.

### Q: Can I use a different database?
**A:** The app is designed for PostgreSQL. Other databases are not supported.

### Q: How do I reset the database?
**A:** 
```bash
# Stop services
docker-compose -f compose.dev.yml down

# Remove volumes (this deletes all data!)
docker volume rm reactive_resume_postgres_data

# Start services again
docker-compose -f compose.dev.yml up -d

# Run migrations
pnpm db:push
```

### Q: Can I run without Docker?
**A:** Not easily. You'd need to install and configure PostgreSQL, Browserless, SeaweedFS, and Mailpit manually. Docker makes it much easier!

### Q: How do I update dependencies?
**A:**
```bash
# Check for updates
pnpm outdated

# Update all dependencies
pnpm update

# Update a specific package
pnpm update <package-name>
```

### Q: Where are uploaded files stored in development?
**A:** In SeaweedFS, which stores data in a Docker volume. Files persist between restarts.

### Q: How do I add a new page?
**A:** Create a new file in `src/routes/`. TanStack Start uses file-based routing.

Example:
```bash
# Create src/routes/about.tsx
# Automatically available at /about
```

---

## Congratulations! 🎊

You now have a fully functional development environment for Zoe Resume Builder!

**Happy coding!** 🚀

---

**Last Updated:** February 2026  
**Version:** 5.0.5  
**Maintained by:** Your Team
