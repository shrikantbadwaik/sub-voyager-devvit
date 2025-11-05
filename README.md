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

## 📝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run checks: `npm run check`
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the BSD-3-Clause License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Devvit](https://developers.reddit.com/) by Reddit
- Icons and UI inspired by modern design principles

## 📧 Contact

- **Developer**: Shrikant Badwaik
- **GitHub**: [@shrikantbadwaik](https://github.com/shrikantbadwaik)
- **Project Link**: [https://github.com/shrikantbadwaik/sub-voyager](https://github.com/shrikantbadwaik/sub-voyager)

---

**Made with ❤️ for explorers, by explorers**

_Discover your city. Share your adventures. Unlock the extraordinary._
