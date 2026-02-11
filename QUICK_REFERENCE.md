# ⚡ Quick Reference

Essential commands for working with Zoe Resume Builder.

## 🚀 Getting Started

```bash
# First time setup
./setup.sh

# Or manual setup
pnpm install
cp .env.example .env
docker compose up -d
pnpm dev
```

## 📦 Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Check code style |
| `pnpm db:studio` | Open database GUI |
| `docker compose up -d` | Start services |
| `docker compose down` | Stop services |
| `docker compose ps` | Check service status |
| `docker compose logs -f` | View logs |

## 🌐 URLs

| Service | URL |
|---------|-----|
| **App** | http://localhost:3000 |
| **Database Studio** | http://localhost:4983 |
| **Email Viewer** | http://localhost:8025 |

## 📂 Important Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `compose.yml` | Docker services config |
| `SETUP.md` | Detailed setup guide |
| `TROUBLESHOOTING.md` | Common issues |

## 🐳 Docker Services

| Service | Port | Purpose |
|---------|------|---------|
| **postgres** | 5432 | Database |
| **browserless** | 3000 | PDF generation |
| **seaweedfs** | 8333 | File storage |

## 🔧 Troubleshooting Quick Fixes

```bash
# Reset everything
docker compose down -v && docker compose up -d

# Clear cache
rm -rf .vinxi .react-router node_modules/.vite

# Restart dev server
# Press Ctrl+C, then:
pnpm dev

# Check if services are running
docker compose ps

# View logs
docker compose logs -f postgres
docker compose logs -f browserless
```

## 🛠️ Development

```bash
# Create a new branch
git checkout -b feature/my-feature

# Run linter
pnpm lint

# Build and test
pnpm build
pnpm preview

# Commit changes
git add .
git commit -m "feat: add new feature"
git push
```

## 📝 Environment Variables (Production)

```bash
# Required
DATABASE_URL=postgresql://...
AUTH_SECRET=<32-char-random-string>
APP_URL=https://yourdomain.com

# Optional
VITE_AI_API_KEY=<google-ai-key>
```

## 🚨 Emergency Commands

```bash
# Kill everything
pkill -f "pnpm dev"
docker compose down

# Complete reset (⚠️ deletes all data)
docker compose down -v
rm -rf node_modules pnpm-lock.yaml
pnpm install
docker compose up -d
pnpm dev
```

## 📞 Get Help

- 📚 [Full Setup Guide](SETUP.md)
- 🔧 [Troubleshooting](TROUBLESHOOTING.md)
- 🐛 [Report Issue](https://github.com/roshni2003/zoe-resume-builder/issues)
- 💬 [Discussions](https://github.com/roshni2003/zoe-resume-builder/discussions)

---

**Pro Tip:** Bookmark this file! Press `Cmd+D` (Mac) or `Ctrl+D` (Windows/Linux)
