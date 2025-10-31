# 📝 SubVoyager Changelog

All notable changes to this project will be documented in this file.

---

## [MVP Enhanced v2] - 2025-10-30

### 🔄 Added - CI/CD Pipeline

#### GitHub Actions Workflows

- **CI - Build and Test** - Automated building and validation on every push/PR

  - Type checking with TypeScript
  - ESLint code linting
  - Client and server builds
  - Artifact uploading
  - Build summary reporting

- **Code Quality** - Comprehensive code quality checks

  - ESLint with error reporting
  - Prettier formatting validation
  - TypeScript type checking
  - Quality report generation

- **Dependency Review** - Security and dependency management

  - Automated vulnerability scanning
  - npm audit integration
  - PR comments with findings
  - Fail on moderate+ severity

- **Deploy to Staging** - Staging deployment preparation

  - Automated on push to `develop`
  - Manual workflow dispatch option
  - Build validation
  - Deployment summaries

- **Deploy to Production** - Production deployment workflow
  - Triggered by GitHub releases
  - Manual dispatch with confirmation
  - Full checks and validation
  - Deployment documentation

#### GitHub Templates

- **Pull Request Template** - Standardized PR format

  - Type of change selection
  - Testing checklist
  - Version targeting
  - Review checklist

- **Bug Report Template** - Structured bug reporting

  - Environment details
  - Reproduction steps
  - Expected vs actual behavior
  - Affected area tagging

- **Feature Request Template** - Feature proposal format
  - Problem statement
  - Proposed solution
  - Use case description
  - Version targeting

#### Documentation

- **CI_CD_SETUP.md** - Comprehensive CI/CD guide
  - Workflow descriptions
  - Setup instructions
  - Usage examples
  - Troubleshooting guide
  - Best practices
  - Cost estimates

### 🎨 Added - UI/UX Improvements

#### First-Time User Experience

- **Welcome Tutorial Modal** - Comprehensive 5-step guide shown on first visit
  - Explains browse → unlock → visit → complete → earn flow
  - Visual step numbers with colored circles
  - Points system breakdown (Easy: 10pts, Medium: 20pts, Hard: 30pts)
  - Beautiful gradient design with clear call-to-action
  - Persists in localStorage (shows only once)

#### Help System

- **Help Button (❓)** in header - Always accessible
- Re-opens tutorial modal on click
- Provides quick reference for confused users

#### Expedition Detail Enhancements

- **Unlock State Improvements**:
  - Orange info box explaining 2-step process
  - Clear "Step 1" and "Step 2" instructions
  - Better button label: "🔓 Unlock & Add to My Adventures"
  - Clarifying text: "No points awarded yet..."
- **Unlocked State Improvements**:
  - Blue info box: "Expedition Unlocked"
  - Reminder text about visiting location
  - Better button label: "✅ I Visited This Place - Submit Proof"
- **Completed State Improvements**:
  - Shows points earned: "You earned {X} points from this adventure"
  - Enhanced green success message

### 📚 Documentation

- Created **PRODUCT_ROADMAP.md** - Comprehensive product vision document

  - MVP feature breakdown
  - v1.0, v2.0, v3.0+ roadmaps
  - Monetization strategy
  - Success metrics
  - Technical architecture
  - 50+ pages of detailed planning

- Created **UI_IMPROVEMENTS.md** - UI enhancement documentation

  - Before/after comparisons
  - User flow diagrams
  - Component changes
  - Future enhancement ideas

- Created **CHANGELOG.md** - This file

### 🐛 Fixed

- **Auto-Approval Issue** - Expeditions now auto-approve on creation (status: 'approved')
  - Previously: Expeditions created as 'pending' but not visible
  - Now: Immediate visibility for MVP testing
  - Marked as approved by 'system'

### ⚡ Technical Improvements

- No linting errors
- Clean build output
- Optimized bundle sizes

---

## [MVP Core] - 2025-10-30

### 🎉 Initial Release

#### Backend Features

- ✅ Complete Express server with 8 API endpoints
- ✅ Redis data layer with optimized queries
- ✅ User authentication via Reddit
- ✅ Points & leveling system
- ✅ Leaderboard infrastructure

#### Frontend Features

- ✅ React 19 + TypeScript
- ✅ Interactive map view (Leaflet + OpenStreetMap)
- ✅ Grid list view
- ✅ Expedition creation form
- ✅ Expedition detail modal
- ✅ User profile modal
- ✅ City & tag filters
- ✅ Responsive design (mobile-friendly)

#### Core User Flows

- ✅ Browse expeditions on map or list
- ✅ Create new expeditions with photos
- ✅ Unlock expeditions (commit to exploring)
- ✅ Complete expeditions (submit proof)
- ✅ Earn points and level up
- ✅ View profile stats

#### Data Models

- ✅ Expeditions with full metadata
- ✅ User profiles with stats
- ✅ Unlock/completion tracking
- ✅ Leaderboard with sorted sets

---

## Upcoming Releases

### [v1.0] - Planned (Weeks 5-12)

**Target**: Public Beta Launch

#### Planned Features

- [ ] Moderation system with approval queue
- [ ] External image hosting (Cloudinary/Imgur)
- [ ] Multiple photos per expedition (up to 5)
- [ ] Reddit post integration (auto-create posts)
- [ ] Badge system (10+ badge types)
- [ ] Enhanced leaderboards (city-wise)
- [ ] Search functionality
- [ ] Favorites/bookmarks
- [ ] Notifications system
- [ ] Analytics dashboard for mods
- [ ] Performance optimizations

#### Technical Improvements

- [ ] Unit tests
- [ ] E2E tests
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Lazy loading
- [ ] Service worker for offline support

---

### [v2.0] - Planned (Months 4-6)

**Target**: Monetization Ready

#### Planned Features

- [ ] Seasonal expedition packs
- [ ] Sponsored/featured expeditions
- [ ] Premium subscription ($4.99/month)
- [ ] Business partner dashboard
- [ ] Review & rating system
- [ ] Social features (follow users, activity feed)
- [ ] Team expeditions
- [ ] Expedition passport (digital & print)
- [ ] Advanced completion verification

#### Monetization Activation

- [ ] Premium tier launch
- [ ] Business partnerships (5-10 pilots)
- [ ] Seasonal pack sales
- [ ] Apply for Reddit Developer Fund

---

### [v3.0+] - Future Vision (6+ months)

**Target**: Platform Maturity & Scale

#### Planned Features

- [ ] Global expansion (50+ cities)
- [ ] Multi-language support
- [ ] AI-powered recommendations
- [ ] AR mode for expeditions
- [ ] Voice integration
- [ ] Travel platform integrations
- [ ] Event organization
- [ ] Creator marketplace
- [ ] Mobile app (React Native)

---

## Version History

| Version          | Date         | Status      | Key Features                                      |
| ---------------- | ------------ | ----------- | ------------------------------------------------- |
| **MVP Enhanced** | Oct 30, 2025 | ✅ Complete | UI improvements, help system, documentation       |
| **MVP Core**     | Oct 30, 2025 | ✅ Complete | Full core functionality, 8 APIs, map & list views |
| **v1.0**         | Weeks 5-12   | 📋 Planned  | Moderation, Reddit integration, badges            |
| **v2.0**         | Months 4-6   | 📋 Planned  | Monetization, premium, partnerships               |
| **v3.0+**        | 6+ months    | 🔮 Future   | Global scale, AI, mobile app                      |

---

## Breaking Changes

### None Yet

- MVP is first release
- All changes have been additive
- Backward compatible with existing data

### Future Breaking Changes (v1.0)

- Image storage will migrate from base64 to URLs
- Existing base64 images will be converted
- No user action required (automatic migration)

---

## Migration Guide

### From MVP Core → MVP Enhanced

**No migration needed!** All changes are additive:

- Existing expeditions work as before
- Existing user profiles unchanged
- New UI enhancements visible immediately

**To deploy:**

```bash
npm run build
npm run deploy
```

**To test locally:**

```bash
npm run dev
```

---

## Known Issues

### Current (MVP Enhanced)

- **Images stored as base64** - Will be fixed in v1.0 with external hosting
- **No image compression** - Large images (>5MB) rejected, but not optimized
- **No offline support** - Requires internet connection
- **Single photo per expedition** - Multi-photo support coming in v1.0
- **Auto-approval for all** - Moderation system coming in v1.0

### Workarounds

- **Large images**: Compress before upload using external tools
- **Offline**: Download screenshots of unlocked expeditions for reference
- **Multiple photos**: Create multiple expeditions for the same location (not ideal)

---

## Performance Metrics

### Build Sizes (MVP Enhanced)

```
Client Bundle:
  - index.html: 0.46 kB
  - index.css:  37.35 kB (11.22 kB gzipped)
  - index.js:   379.82 kB (116.58 kB gzipped)

Server Bundle:
  - index.cjs:  4,996.37 kB
```

### Load Times (Estimated)

- Initial load: ~2-3 seconds (with caching)
- Map render: ~1 second
- Expedition list: < 1 second
- Image loading: Depends on size (base64 = slower)

---

## Contributing

### How to Report Issues

1. Check existing issues in this changelog
2. Create a Reddit post in r/subvoyager_dev
3. Tag maintainer: u/[your-username]

### How to Suggest Features

1. Review PRODUCT_ROADMAP.md to see if already planned
2. Submit feature request via modmail
3. Include use case and expected behavior

---

## Credits

### Built With

- [React](https://react.dev/) - UI framework
- [Leaflet](https://leafletjs.com/) - Map library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Devvit](https://developers.reddit.com/) - Reddit platform
- [Vite](https://vite.dev/) - Build tool
- [Express](https://expressjs.com/) - Backend server

### Special Thanks

- Reddit Devvit team for the platform
- r/Devvit community for support
- Early testers from r/subvoyager_dev

---

## License

BSD-3-Clause License

---

**Maintained by**: SubVoyager Team  
**Last Updated**: October 30, 2025  
**Next Update**: v1.0 Release
