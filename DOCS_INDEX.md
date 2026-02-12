# Developer Documentation Index

Welcome to **Zoe Resume Builder** development! 👋

This folder contains comprehensive guides to help you set up and work on the project.

---

## 📚 Documentation

### For First-Time Setup

1. **[DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)** - Complete setup guide
   - **Start here if you're new!**
   - Detailed step-by-step instructions
   - Explains every command and concept
   - Perfect for beginners
   - ~30 minutes to complete

2. **[QUICK_START.md](./QUICK_START.md)** - Fast setup for experienced devs
   - For developers familiar with the stack
   - Quick commands only
   - ~5 minutes to get running

### For Ongoing Development

3. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common problems & solutions
   - Database issues
   - Docker problems
   - Build errors
   - Feature-specific fixes
   - Reset commands

---

## 🚀 Which Guide Should I Use?

### "I'm new to development"
→ **Start with [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)**
- Explains everything in simple terms
- Covers all prerequisites
- Has screenshots and examples
- Includes learning resources

### "I know React/Node.js/Docker"
→ **Use [QUICK_START.md](./QUICK_START.md)**
- Just the commands you need
- No explanations, just action
- Get running in 5 minutes

### "Something isn't working"
→ **Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
- Organized by problem type
- Copy-paste solutions
- Reset commands
- Debug tips

---

## 📖 Additional Resources

### Project Documentation
- **README.md** - Project overview and features
- **CLAUDE.md** - AI assistant guidelines
- **AI_*.md** - AI implementation notes

### Technology Stack
- [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- [React](https://react.dev/) - UI library
- [Drizzle ORM](https://orm.drizzle.team/) - Database toolkit
- [Better Auth](https://www.better-auth.com/) - Authentication
- [Docker](https://docs.docker.com/) - Containerization
- [PostgreSQL](https://www.postgresql.org/docs/) - Database

### Community
- **GitHub Issues** - Report bugs or request features
- **Discord** - Chat with other developers
- **Documentation Site** - https://docs.rxresu.me

---

## 🎯 Quick Links

### First Time Setup
```bash
# 1. Clone repo
git clone <your-repo-url>
cd zoe-resume-builder

# 2. Start services
docker-compose -f compose.dev.yml up -d

# 3. Setup environment
cp .env.example .env
# Edit .env with your AUTH_SECRET

# 4. Setup database
pnpm db:push

# 5. Install & run
pnpm install
pnpm dev
```

### Daily Development
```bash
# Start everything
docker-compose -f compose.dev.yml up -d
pnpm dev

# Stop when done
# Ctrl+C (stops dev server)
docker-compose -f compose.dev.yml down
```

### Common Commands
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm typecheck    # Check types
pnpm lint         # Format code
pnpm db:studio    # Open database GUI
```

---

## 🆘 Getting Help

**Can't find what you need?**

1. Search the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide
2. Check [GitHub Issues](https://github.com/yourusername/zoe-resume-builder/issues)
3. Ask in Discord community
4. Create a new issue with:
   - What you were trying to do
   - What went wrong (full error message)
   - Your environment (OS, Node version, etc.)

---

## 📝 Contributing

Before submitting code:

1. ✅ Run `pnpm typecheck` (no errors)
2. ✅ Run `pnpm lint` (formats code)
3. ✅ Test your changes locally
4. ✅ Write clear commit messages
5. ✅ Update documentation if needed

---

## 🎓 Learning Path

**New to the tech stack?**

1. Start with JavaScript/TypeScript basics
2. Learn React fundamentals
3. Understand file-based routing (TanStack Router)
4. Learn Docker basics
5. Practice with PostgreSQL

**Recommended tutorials:**
- [React Tutorial](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Docker Getting Started](https://docs.docker.com/get-started/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

---

## 📂 Project Structure

```
zoe-resume-builder/
├── 📄 DEVELOPMENT_SETUP.md      ← Detailed setup guide
├── 📄 QUICK_START.md            ← Quick reference
├── 📄 TROUBLESHOOTING.md        ← Problem solutions
├── 📄 README.md                 ← Project overview
├── 📄 .env.example              ← Environment variables template
├── 📄 compose.dev.yml           ← Docker services config
├── 📦 package.json              ← Dependencies & scripts
│
├── src/
│   ├── routes/                  ← Pages (file-based routing)
│   ├── components/              ← Reusable UI components
│   ├── integrations/            ← Backend (API, DB, Auth)
│   ├── schema/                  ← Data validation (Zod)
│   ├── hooks/                   ← React hooks
│   ├── utils/                   ← Helper functions
│   └── styles/                  ← Global CSS
│
├── public/                      ← Static files
├── migrations/                  ← Database migrations
├── locales/                     ← Translations (i18n)
└── docs/                        ← Additional documentation
```

---

## 🌟 Tips for Success

1. **Read error messages** - They usually tell you what's wrong
2. **Check the logs** - Terminal and Docker logs have answers
3. **Use TypeScript** - It catches errors before runtime
4. **Test locally** - Always verify changes work before committing
5. **Ask questions** - The community is here to help!

---

## 📌 Important Notes

- **Don't commit `.env`** - It contains secrets (in .gitignore)
- **Docker must be running** - Backend services need Docker
- **Port 3000 must be free** - Or change APP_URL in .env
- **Node.js 20+ required** - Older versions won't work
- **pnpm only** - Don't use npm or yarn

---

**Ready to code?** Pick your guide and let's build! 🚀

- New developer → [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)
- Quick start → [QUICK_START.md](./QUICK_START.md)
- Having issues → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Happy coding!** 💻
