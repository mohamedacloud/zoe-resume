# 🚀 Zoe Resume Builder - Quick Setup Guide

Welcome! This guide will help you get the resume builder running on your machine in **under 5 minutes**.

## 📋 Prerequisites

Before you start, make sure you have these installed:

- **Node.js** (v20 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (Package manager) - [Install guide](https://pnpm.io/installation)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)

### Check if you have them installed:

```bash
node --version   # Should show v20.x.x or higher
pnpm --version   # Should show 9.x.x or higher
docker --version # Should show version info
```

## 🎯 Quick Start (3 Steps)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/roshni2003/zoe-resume-builder.git
cd zoe-resume-builder

# Install dependencies
pnpm install
```

### Step 2: Start Services

```bash
# Start PostgreSQL database and other services in Docker
docker compose up -d

# Wait 10 seconds for services to start
```

### Step 3: Run the App

```bash
# Start the development server
pnpm dev
```

**That's it!** 🎉 Open your browser and go to:
👉 **http://localhost:3000**

## 🛠️ What Just Happened?

When you ran `docker compose up -d`, it started:
- ✅ PostgreSQL database (stores all resume data)
- ✅ Browserless (generates PDF exports)
- ✅ SeaweedFS (handles file uploads)

When you ran `pnpm dev`, it started:
- ✅ Frontend (React app)
- ✅ Backend API (handles data and AI)
- ✅ Database migrations (creates tables automatically)

## 🔧 Configuration (Optional)

The app works out of the box with default settings. If you want to customize:

### Get Your Own AI API Key (For AI Features)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your key
4. Open `.env` file and replace:
   ```bash
   VITE_AI_API_KEY=your-api-key-here
   ```

**Note:** The app works without AI - it just won't have AI-powered suggestions.

## 📚 Common Commands

```bash
# Start the app
pnpm dev

# Stop Docker services
docker compose down

# Restart everything fresh
docker compose down
docker compose up -d
pnpm dev

# View database in browser
pnpm db:studio
# Opens Drizzle Studio at http://localhost:4983

# Build for production
pnpm build
```

## 🐛 Troubleshooting

### "Port 5432 already in use"
Another PostgreSQL is running. Either:
- Stop it: `brew services stop postgresql` (on Mac)
- Or change port in `compose.yml`

### "Port 3000 already in use"
Another app is using port 3000. Stop it or change the port in your code.

### "Database connection failed"
Make sure Docker services are running:
```bash
docker compose ps
# Should show postgres, browserless, seaweedfs as "running"
```

### "pnpm command not found"
Install pnpm:
```bash
npm install -g pnpm
```

### Database needs reset
```bash
docker compose down -v  # Deletes all data
docker compose up -d    # Fresh start
pnpm dev
```

## 🌐 Deploying to Production

### Option 1: Vercel (Recommended - Easiest)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your repo
5. Add environment variables:
   - `DATABASE_URL` - Get from [Supabase](https://supabase.com) or [Neon](https://neon.tech)
   - `AUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `VITE_AI_API_KEY` - Your Google AI key
6. Click Deploy

### Option 2: Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Railway will auto-detect the setup
5. Add a PostgreSQL database from Railway's marketplace
6. Deploy!

### Environment Variables for Production

Copy these to your hosting platform:

```bash
# App URLs (change yourdomain.com)
APP_URL=https://yourdomain.com
PRINTER_ENDPOINT=https://yourdomain.com

# Database (get from Supabase/Neon/Railway)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Security (generate random 32-char string)
AUTH_SECRET=your-32-character-secret-key

# AI (optional - for AI features)
VITE_AI_API_KEY=your-google-ai-key
VITE_AI_MODEL=models/gemini-2.0-flash-exp
VITE_AI_PROVIDER=gemini
VITE_AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

## 📖 Project Structure

```
zoe-resume-builder/
├── src/
│   ├── routes/          # Pages (home, dashboard, builder)
│   ├── components/      # Reusable UI components
│   ├── dialogs/         # Modals and popups
│   ├── integrations/    # Database, Auth, AI, APIs
│   └── utils/           # Helper functions
├── public/              # Static files (images, templates)
├── compose.yml          # Docker services config
├── .env                 # Your local environment variables
└── package.json         # Dependencies
```

## 🤝 Getting Help

- **Issues?** Open an issue on [GitHub](https://github.com/roshni2003/zoe-resume-builder/issues)
- **Questions?** Check existing issues or create a discussion

## ⚡ Pro Tips

1. **First time?** Use Docker Desktop app to see if services are running
2. **Database viewer:** Run `pnpm db:studio` to see your data visually
3. **Hot reload:** Changes to code auto-refresh the browser
4. **Guest mode:** App creates a guest user automatically - no signup needed!

## 🎓 Learn More

- [TanStack Start](https://tanstack.com/start) - The React framework used
- [Drizzle ORM](https://orm.drizzle.team/) - Database toolkit
- [Better Auth](https://www.better-auth.com/) - Authentication system
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Made with ❤️ by Roshni**

Need help? Open an issue or check the [GitHub Discussions](https://github.com/roshni2003/zoe-resume-builder/discussions)
