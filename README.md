# 🗺️ SubVoyager

> Discover hidden gems, unlock micro-expeditions, and explore your city like never before.

**SubVoyager** is an interactive, community-driven expedition discovery platform built on Reddit's developer platform. Users discover and share "micro-expeditions" — hidden gems, photo spots, local food hunts, cultural rituals, and off-beat walking routes in their city or region.

## ✨ Features

### MVP (Current)

- 📋 **Expedition List View** - Browse expeditions in a beautiful card-based grid layout
- ➕ **Create Expeditions** - Share your discoveries with photos, locations, and descriptions
- 🔓 **Unlock System** - Add expeditions to your personal adventure list
- ✅ **Complete Expeditions** - Mark expeditions as completed with proof photos and notes
- 🎮 **Gamification** - Earn points, level up, and track your progress
- 🏆 **User Profiles** - View stats, badges, and achievements
- 🎯 **Smart Filtering** - Filter by city, tag (food, culture, nature, history, adventure, photo)
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ℹ️ **First-Time Help** - Interactive tutorial for new users

### Coming in v1.0+

- 📍 **Geolocation Verification** - Auto-verify you're actually at the location
- 🔔 **Proximity Notifications** - Get notified when near unlocked expeditions
- 🏅 **Enhanced Leaderboards** - Global, city-based, and completion rate rankings
- ⭐ **Reviews & Ratings** - Rate and review completed expeditions
- 👥 **Social Features** - Comments, likes, and sharing
- 🎯 **Challenges & Quests** - Time-limited challenges and streaks

See [PRODUCT_ROADMAP.md](./PRODUCT_ROADMAP.md) for the complete feature roadmap.

## 🏗️ Tech Stack

- **[Devvit](https://developers.reddit.com/)**: Reddit's developer platform for immersive experiences
- **[React 19](https://react.dev/)**: Modern UI with hooks and concurrent features
- **[TypeScript](https://www.typescriptlang.org/)**: Full type safety across client and server
- **[Vite](https://vite.dev/)**: Lightning-fast build tool and dev server
- **[Express](https://expressjs.com/)**: Backend API server
- **[Redis](https://redis.io/)**: In-memory data store via Devvit's Redis client
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first styling

## 🚀 Getting Started

### Prerequisites

- **Node.js 22+** (required by Devvit)
- **npm** or **yarn**
- **Reddit Account** (for Devvit authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shrikantbadwaik/sub-voyager.git
   cd sub-voyager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Login to Reddit (first time only)**

   ```bash
   npm run login
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   This starts a live development environment on Reddit where you can test your app.

### Development Workflow

```bash
# Development (live on Reddit)
npm run dev

# Build for production
npm run build

# Run tests and checks
npm run check              # Run all checks (type-check, lint, prettier)
npm run type-check         # TypeScript validation
npm run lint               # ESLint
npm run lint:fix           # Auto-fix linting issues
npm run prettier           # Format code

# Deployment
npm run deploy             # Upload new version to Reddit
npm run launch             # Publish app for review
```

## 📁 Project Structure

```
sub-voyager/
├── src/
│   ├── client/              # React frontend (webview)
│   │   ├── components/      # UI components
│   │   │   ├── ExpeditionCard.tsx      # Expedition summary cards
│   │   │   ├── ExpeditionDetail.tsx    # Full expedition view
│   │   │   ├── ExpeditionForm.tsx      # Create expedition form
│   │   │   ├── UserProfile.tsx         # User stats & badges
│   │   │   └── FirstTimeHelp.tsx       # Tutorial modal
│   │   ├── hooks/           # React hooks
│   │   │   ├── useInit.ts             # App initialization
│   │   │   └── useExpeditions.ts      # Expedition data
│   │   ├── utils/           # Helper functions
│   │   │   └── api.ts                 # API client
│   │   └── App.tsx          # Main app component
│   │
│   ├── server/              # Express backend
│   │   ├── data/            # Redis data layer
│   │   │   ├── redis-keys.ts         # Key patterns
│   │   │   ├── expeditions.ts        # Expedition CRUD
│   │   │   └── users.ts              # User data & leaderboard
│   │   ├── core/            # Core Devvit logic
│   │   │   └── post.ts               # Reddit post integration
│   │   └── index.ts         # Express server & API routes
│   │
│   └── shared/              # Shared code
│       └── types/           # TypeScript types
│           ├── expeditions.ts        # Core data models
│           └── api.ts                # API contracts
│
├── .github/workflows/       # CI/CD pipelines
├── dist/                    # Build output
├── tools/                   # Build configuration
└── docs/                    # Documentation
    ├── PRODUCT_ROADMAP.md   # Feature roadmap
    ├── CI_CD_SETUP.md       # CI/CD documentation
    ├── SECURITY.md          # Security guidelines
    └── CHANGELOG.md         # Version history
```

## 🔌 API Endpoints

| Endpoint                        | Method | Description                               |
| ------------------------------- | ------ | ----------------------------------------- |
| `/api/init`                     | GET    | Initialize app, fetch user profile        |
| `/api/expeditions/create`       | POST   | Create new expedition                     |
| `/api/expeditions/list`         | GET    | List expeditions (with filters)           |
| `/api/expeditions/:id`          | GET    | Get expedition details & status           |
| `/api/expeditions/:id/unlock`   | POST   | Unlock expedition for user                |
| `/api/expeditions/:id/complete` | POST   | Submit completion with proof              |
| `/api/user/profile`             | GET    | Get user profile & stats                  |
| `/api/user/expeditions`         | GET    | Get user's unlocked/completed expeditions |

See [src/server/index.ts](./src/server/index.ts) for full API documentation.

## 🎮 How It Works

### For Explorers (Users)

1. **Browse** expeditions in the list view
2. **Unlock** an expedition to add it to your adventure list
3. **Visit** the location and experience it in real life
4. **Complete** the expedition by uploading a photo and notes
5. **Earn Points** and level up as you complete more expeditions

### Points System

- **Create Expedition**: 10 points
- **Unlock Expedition**: 0 points (just adds to your list)
- **Complete Expedition**: Points awarded based on difficulty
  - Easy: 10 points
  - Medium: 20 points
  - Hard: 30 points

### Levels

- **Level 1 (Newbie)**: 0-99 points
- **Level 2 (Explorer)**: 100-249 points
- **Level 3 (Adventurer)**: 250-499 points
- **Level 4 (Pro Explorer)**: 500-999 points
- **Level 5 (Legend)**: 1000+ points

## 🧪 CI/CD

SubVoyager uses GitHub Actions for automated testing and deployment:

- ✅ **Build & Test**: Automated on every push and PR
- ✅ **Code Quality**: ESLint, Prettier, TypeScript checks
- ✅ **Security**: npm audit, dependency review
- ✅ **Staging Deploy**: Auto-deploy to staging on main branch
- ✅ **Production Deploy**: Manual approval required

See [CI_CD_SETUP.md](./CI_CD_SETUP.md) for complete documentation.

## 🔒 Security

We take security seriously. All dependencies are regularly audited, and we follow best practices for data handling and user privacy.

See [SECURITY.md](./SECURITY.md) for our security policy and vulnerability management.

## 📝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run checks: `npm run check`
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- TypeScript for all new code
- Follow existing patterns in the codebase
- Run `npm run check` before committing
- Write meaningful commit messages

## 📄 License

This project is licensed under the BSD-3-Clause License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Devvit](https://developers.reddit.com/) by Reddit
- Icons and UI inspired by modern design principles

## 📧 Contact

- **Developer**: Shrikant Badwaik
- **GitHub**: [@shrikantbadwaik](https://github.com/shrikantbadwaik)
- **Project Link**: [https://github.com/shrikantbadwaik/sub-voyager](https://github.com/shrikantbadwaik/sub-voyager)

## 🗺️ Roadmap

SubVoyager is actively under development! Check out our [PRODUCT_ROADMAP.md](./PRODUCT_ROADMAP.md) for:

- ✅ Completed MVP features
- 🚧 In-progress features
- 📋 Planned enhancements (v1.0, v2.0, v3.0+)
- 💡 Future ideas and community requests

---

**Made with ❤️ for explorers, by explorers**

_Discover your city. Share your adventures. Unlock the extraordinary._
