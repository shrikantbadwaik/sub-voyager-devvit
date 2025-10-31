# 🗺️ SubVoyager Product Roadmap

**An interactive, community-driven map experience for discovering hidden gems and local expeditions**

---

## 📋 Table of Contents

- [Overview](#overview)
- [MVP (Current Version)](#mvp-current-version)
- [Version 1.0](#version-10)
- [Version 2.0](#version-20)
- [Version 3.0+](#version-30)
- [Future Enhancements](#future-enhancements)
- [Monetization Strategy](#monetization-strategy)
- [Technical Architecture](#technical-architecture)

---

## Overview

### Vision Statement

SubVoyager transforms Reddit communities into vibrant exploration platforms where travelers and locals discover, share, and complete micro-expeditions—hidden gems, photo spots, food hunts, cultural rituals, and off-beat routes. Through gamification and user-generated content, we create a sense of adventure within the Reddit ecosystem.

### Target Audience

- **Primary**: Urban explorers, travel enthusiasts, locals seeking new experiences
- **Geographic Focus**: Indian cities (Mumbai, Delhi, Jaipur, Bangalore, Pune) with global expansion potential
- **Reddit Communities**: r/IndiaTravel, r/Mumbai, r/Delhi, city-specific travel subreddits

### Unique Value Proposition

While many Reddit apps focus on quizzes and challenges, SubVoyager uniquely combines:

- Real-world exploration with digital engagement
- Map-based discovery
- User-generated expedition content
- Gamification with meaningful rewards
- Community building through shared experiences

---

## MVP (Current Version)

**Status**: ✅ Complete | **Timeline**: Weeks 1-4 | **Target**: Proof of Concept & Early Testing

### Core Features

#### 1. Expedition Creation

- ✅ User submission form with:
  - Title, description (500 chars max)
  - Location (coordinates, address, city)
  - Single photo upload (base64, max 5MB)
  - Tag selection (food, photo-spot, culture, walk, nature, hidden-gem)
  - Difficulty level (easy/medium/hard)
- ✅ Auto-approval system (no moderation queue for MVP)
- ✅ Instant publication to map/list

#### 2. Map View

- ✅ Interactive Leaflet map with OpenStreetMap tiles
- ✅ Expedition markers showing all approved locations
- ✅ Click marker to view popup with basic info
- ✅ Click popup to open full detail modal

#### 3. List View

- ✅ Grid layout of expedition cards (responsive: 1/2/3 columns)
- ✅ Card displays: image, title, description (2 lines), location, tags, stats
- ✅ Visual indicators for unlocked/completed status

#### 4. Expedition Details & Actions

- ✅ Full modal with expedition information
- ✅ **Unlock Action**: Commit to exploring (adds to user's adventure list)
- ✅ **Complete Action**: Submit proof of visit with optional photo & notes
- ✅ Clear step-by-step instructions for users
- ✅ Visual status indicators (unlocked/completed badges)

#### 5. Points & Leveling System

- ✅ Points awarded on completion:
  - Easy: 10 points
  - Medium: 20 points
  - Hard: 30 points
- ✅ Auto-leveling: 1 level per 50 points
- ✅ Real-time profile updates

#### 6. User Profile

- ✅ Profile modal showing:
  - Username, current level, total points
  - Stats: created, unlocked, completed counts
  - Member since date
  - Badges placeholder (for future)

#### 7. Filtering & Search

- ✅ Filter by city (Mumbai, Delhi, Jaipur, Bangalore, Pune)
- ✅ Filter by tag (all 6 categories)
- ✅ Combined city + tag filtering
- ✅ Real-time results update

#### 8. First-Time User Experience

- ✅ Welcome modal on first visit
- ✅ Step-by-step guide explaining unlock → visit → complete flow
- ✅ Points system explanation
- ✅ Help button (❓) accessible anytime from header

### Technical Stack (MVP)

**Frontend:**

- React 19.1.0 with TypeScript
- Tailwind CSS 4.1.6 for styling
- Leaflet 1.9.4 & react-leaflet for maps
- Vite for build tooling

**Backend:**

- Express 5.1.0 server (serverless)
- Devvit Web APIs (Reddit integration)
- Redis for data storage

**Data Storage:**

- Redis hashes for expeditions (indexed by status, city, tag)
- Redis strings for user profiles
- Redis hashes for user relationships (unlocked, completed, created)
- Redis sorted sets for leaderboards

### API Endpoints (MVP)

| Endpoint                        | Method | Purpose                               |
| ------------------------------- | ------ | ------------------------------------- |
| `/api/init`                     | GET    | Initialize app, load user profile     |
| `/api/expeditions/create`       | POST   | Submit new expedition                 |
| `/api/expeditions/list`         | GET    | Browse expeditions (with filters)     |
| `/api/expeditions/:id`          | GET    | Get expedition details + user status  |
| `/api/expeditions/:id/unlock`   | POST   | Unlock expedition                     |
| `/api/expeditions/:id/complete` | POST   | Complete expedition with proof        |
| `/api/user/profile`             | GET    | Get user profile and stats            |
| `/api/user/expeditions`         | GET    | Get user's created/unlocked/completed |

### Known Limitations (MVP)

1. **Image Storage**: Base64 encoding (not optimal for performance)
2. **No Moderation**: All expeditions auto-approve
3. **Simple Geospatial**: Distance calculations on all records
4. **Single Photo**: Only one image per expedition
5. **No Validation**: Photo/location verification not implemented
6. **Hardcoded Country**: All expeditions assume "India"
7. **No Badges**: Badge system placeholder only
8. **No Reddit Integration**: Doesn't create Reddit posts yet

### Success Metrics (MVP)

- ✅ App builds and deploys successfully
- ✅ Users can create expeditions
- ✅ Users can browse map and list views
- ✅ Users can unlock and complete expeditions
- ✅ Points and leveling work correctly
- 🎯 Target: 10+ expeditions created
- 🎯 Target: 5+ active users
- 🎯 Target: 20+ completions

---

## Version 1.0

**Status**: 📋 Planned | **Timeline**: Weeks 5-12 (8 weeks) | **Target**: Public Beta Launch

### Goals

- Production-ready app for first community (r/Mumbai or r/IndiaTravel)
- Proper moderation and content quality
- Better performance and user experience
- Reddit integration for virality

### New Features

#### 1. Hybrid Moderation System (Three-Tier Approval)

> **MVP Note:** Currently auto-approving all expeditions for testing. Full system in v1.0.

##### **Tier 1: Trusted User Auto-Approval** 🌟

**Eligibility Criteria:**
- Level 7+ (350+ points)
- Completion rate > 70%
- No rejected expeditions in last 30 days
- Account age > 30 days

**How It Works:**
- Submissions from trusted users → Immediately `status: 'approved'`
- Auto-approval privilege can be revoked if quality drops
- Rewards active, quality contributors
- Reduces moderation workload

##### **Tier 2: Community Voting** 👥

**For Level 1-6 Users:**
- Submissions → `status: 'pending_community_review'`
- Visible to Level 3+ users for voting
- Voting Period: 48 hours

**Voting Mechanism:**
- ✅ Upvote: "This looks good" (approve recommendation)
- ⚠️ Downvote: "Needs review" (with reason: spam/wrong location/inappropriate)
- Voters earn +1 point per vote
- Bonus +5 points if vote aligns with final decision

**Auto-Approval Thresholds:**
- **10+ upvotes** and **< 3 downvotes** → Auto-approve
- **5+ downvotes** → Escalate to moderator
- **48 hours** with no decision → Escalate to moderator
- **Mixed signals** (5-9 upvotes, 3-4 downvotes) → Escalate to moderator

##### **Tier 3: Moderator Final Authority** 👮

**Moderator Dashboard:**
- View all pending expeditions (community-voted & escalated)
- Filter by status, city, tag, date, vote count
- Bulk approve/reject functionality
- User management (ban/shadowban)
- **Override any community decision** (final say)

**Moderator Actions:**
- ✅ **Approve** → `status: 'approved'`
- ❌ **Reject** → `status: 'rejected'` + mandatory reason
- 🔄 **Override Community Vote** → Approve/reject despite votes
- 🚫 **Ban User** → Block future submissions
- 📝 **Edit Submission** → Fix typos, update details before approval

**Notification System:**
- User notified of approval/rejection via Reddit message
- Rejection includes reason and improvement suggestions
- Appeal button for rejected submissions (30-day window)

**Additional Moderation Tools:**

- **Auto-Moderation Rules**
  - Profanity filter for titles/descriptions
  - Duplicate detection (similar titles + coordinates within 100m)
  - Rate limiting (max 5 submissions per user per day)
  - Image validation (min 800x600px, max 10MB, JPG/PNG/WebP)
  - Spam pattern detection (repeated URLs, promotional text)

- **Community Reporting**
  - Report button on any expedition
  - Categories: Spam, Wrong Location, Inappropriate, Duplicate, Other
  - Auto-flag at 3+ reports → Priority moderator queue
  - Reporter anonymity maintained
  - False reporting penalties after review

- **Trust Score System**
  - Algorithm calculates user submission quality
  - Factors:
    - Approval rate (approved / total submissions)
    - Community vote ratios
    - Report frequency (how often they're reported)
    - Edit history (frequent edits = lower trust)
  - Trust score affects:
    - Eligibility for auto-approval (Tier 1)
    - Visibility in community voting
    - Rate limiting thresholds

- **Moderation Analytics Dashboard**
  - Approval rates by user, city, tag
  - Common rejection reasons (chart)
  - Average time to approval
  - Community voting participation metrics
  - Top contributors (by approvals)
  - Moderation queue health (pending count, wait times)

#### 2. Enhanced Media Support

- **Multiple Photos per Expedition**
  - Upload up to 5 photos per expedition
  - Photo gallery/carousel in detail view
  - Thumbnail grid in card view
- **External Image Hosting**
  - Integrate Cloudinary or Imgur API
  - Image optimization (compression, multiple sizes)
  - CDN delivery for fast loading
  - Remove base64 encoding
- **Photo Guidelines**
  - Maximum file size: 10MB per image
  - Supported formats: JPG, PNG, WebP
  - Automatic orientation correction
  - EXIF data stripping for privacy

#### 3. Reddit Integration

- **Auto-Post Creation**
  - When expedition is approved, create Reddit post
  - Post template: "[New Expedition] {title} - {city}"
  - Include first photo, description, map link
  - Link back to app for full experience
- **Comment Notifications**
  - Users notified when their expedition post gets comments
  - Reply to comments from within app (future)
- **Subreddit Customization**
  - Each subreddit can have custom post flair
  - Custom footer text in posts
  - Opt-in/out of auto-posting per subreddit

#### 4. Improved Geospatial Features

- **Optimized Nearby Search**
  - Index expeditions by geohash
  - Efficient radius queries
  - "Near Me" button using browser geolocation
- **Distance Display**
  - Show distance from user's current location
  - Show distance in search results
  - Sort by distance option
- **Map Clustering**
  - Cluster nearby markers at low zoom levels
  - Show count in cluster marker
  - Expand on click

#### 5. Badge System

- **Expedition Badges**
  - First Explorer (complete 1st expedition)
  - City Explorer (complete 5 in one city)
  - City Master (complete 25 in one city)
  - Foodie (complete 10 food expeditions)
  - Photographer (complete 10 photo-spot expeditions)
  - Culture Vulture (complete 10 culture expeditions)
  - Completionist (complete all expeditions in a city)
- **Creator Badges**
  - First Creator (create 1st expedition)
  - Content Creator (create 10 expeditions)
  - Community Champion (50+ expeditions created)
- **Special Badges**
  - Early Adopter (joined during beta)
  - Weekend Warrior (complete 3 in one weekend)
  - Streak Master (complete expeditions 7 days in a row)
- **Badge Display**
  - Show badges on profile
  - Badge showcase on expedition detail (if created by badge holder)
  - Badge progress tracking

#### 6. Enhanced Leaderboards

- **Global Leaderboard**
  - Top 100 users by points
  - Reset monthly/quarterly option
  - All-time and current period tabs
- **City Leaderboards**
  - Separate leaderboard per city
  - Top explorers per city
- **Category Leaderboards**
  - Food experts, photo spot hunters, culture enthusiasts
- **Completion Rate Leaderboard**
  - "Top explorers who complete what they unlock"
  - Metric: (completed / unlocked) × 100%
  - Encourages finishing started expeditions
  - Minimum 5 unlocks to qualify
- **Leaderboard Rewards**
  - Top 3 get special flair
  - Monthly winner gets featured post

#### 7. User Experience Improvements

- **Search Functionality**
  - Search expeditions by name
  - Search by address/landmark
  - Auto-complete suggestions
- **Favorites/Bookmarks**
  - Save expeditions without unlocking
  - "Wishlist" separate from "Unlocked"
- **Notifications**
  - New expeditions near you
  - Your unlocked expeditions are nearby (location-based)
  - Achievement unlocked (badges, level ups)
- **Offline Support**
  - Cache expedition data locally
  - View unlocked expeditions offline
  - Queue completion submissions for when online

#### 8. Analytics Dashboard (for Mods)

- **App Statistics**
  - Total expeditions, users, completions
  - Daily/weekly/monthly active users
  - Most popular expeditions
  - Most active cities
- **User Insights**
  - User growth over time
  - Retention metrics
  - Average time to complete
- **Content Insights**
  - Average expeditions per user
  - Popular tags/categories
  - Quality score (completion rate per expedition)

### Technical Improvements (v1.0)

- **Performance**
  - Lazy loading for expedition list
  - Virtual scrolling for large lists
  - Image lazy loading
  - Service worker for caching
- **Error Handling**
  - Better error messages
  - Retry logic for failed requests
  - Offline detection
- **Testing**
  - Unit tests for critical functions
  - Integration tests for API endpoints
  - E2E tests for core user flows
- **Monitoring**
  - Error tracking (Sentry or similar)
  - Performance monitoring
  - User analytics (privacy-focused)

### Success Metrics (v1.0)

- 🎯 100+ expeditions across 3+ cities
- 🎯 50+ monthly active users
- 🎯 200+ total completions
- 🎯 80%+ approval rate for submissions
- 🎯 Average 3+ expeditions completed per active user
- 🎯 Positive community feedback (Reddit comments, modmail)

---

## Version 2.0

**Status**: 📋 Planned | **Timeline**: Months 4-6 | **Target**: Monetization Ready & Scale

### Goals

- Scale to multiple subreddits (10+ communities)
- Activate monetization streams
- Advanced social features
- Premium tier launch

### New Features

#### 1. Seasonal Expedition Packs

- **What**: Curated themed expedition collections
- **Examples**:
  - "Monsoon Mumbai" - 10 rain-special spots
  - "Winter Himalayan Towns" - Cold weather expeditions
  - "Holi Special" - Festival locations
  - "Street Food Safari" - City food trails
- **Features**:
  - Pack purchase or premium access
  - Exclusive expeditions not available individually
  - Pack completion bonus (extra 50 points)
  - Pack leaderboard
  - Time-limited availability

#### 2. Sponsored/Featured Expeditions

- **Local Business Partnerships**
  - Cafés, restaurants, tour operators pay to feature
  - "Sponsored by..." badge on expedition
  - Highlighted on map (different marker color)
  - Promoted in list view (top slot)
- **Discount Integration**
  - Exclusive discount codes for expedition completers
  - Show discount code after completion
  - Track usage for business analytics
  - Revenue share with businesses
- **Pricing Model**:
  - $50-100 per month for featured spot
  - $200-500 for seasonal pack sponsorship
  - Commission on coupon redemptions (10-15%)

#### 3. Premium Subscription

- **Premium Features** ($4.99/month or $49/year):
  - Early access to new cities/expeditions (1 week early)
  - Exclusive premium expeditions (10-20 per month)
  - Ad-free experience (if ads introduced)
  - Offline map download for entire city
  - Premium badge on profile
  - Double XP for 1 expedition per day
  - Custom profile avatar frames
  - Priority support
  - Access to all seasonal packs
- **Family Plan** ($9.99/month):
  - Up to 5 accounts
  - Shared expedition progress tracking
  - Family leaderboard

#### 4. Partner Dashboard

- **Business Portal**
  - Login for partner businesses
  - Create/edit sponsored expeditions
  - View analytics (views, unlocks, completions)
  - Manage discount codes
  - Generate reports
  - Payment management
- **Self-Service**
  - Submit expedition draft
  - Pay via Stripe/PayPal
  - Approve terms and conditions
  - Choose featured duration

#### 5. Social Features

- **Follow System**
  - Follow other explorers
  - See followers/following counts
  - Feed of followed users' activities
- **Activity Feed**
  - "User X completed Expedition Y"
  - "User X created a new expedition"
  - "User X reached Level 10"
- **Share & Embed**
  - Share expedition to Reddit comment
  - Share to other social media (Twitter, Instagram)
  - Embeddable expedition widgets
- **Team Expeditions**
  - Create expedition groups (2-10 people)
  - Shared progress tracking
  - Team completion rewards (bonus points)
  - Team leaderboard

#### 6. Reviews & Ratings

- **Expedition Reviews**
  - 5-star rating system
  - Written review after completion
  - Helpful/not helpful voting on reviews
- **Review Display**
  - Average rating shown on card
  - Reviews visible in detail view
  - Filter by rating
- **Photo Galleries**
  - See all completion photos from other users
  - Gallery view in expedition detail
  - Sort by recency or popularity
  - Like/react to user photos
  - "Featured photo" selected by community votes
- **Quality Control**
  - Low-rated expeditions flagged for review
  - Creator notified of low ratings
  - Option to improve/update expedition

#### 7. Advanced Completion Verification

- **Photo Verification**
  - AI-based image similarity check (compare submission to original)
  - Geolocation EXIF data check
  - Timestamp verification
- **Location Verification**
  - Optional: check-in at location required
  - Geofencing (must be within 100m of coordinates)
  - Prevents remote completions
- **Anti-Cheat**
  - Rate limiting on completions (max 10 per day)
  - Flag suspicious patterns (e.g., 50 completions in 1 hour)
  - Manual review of flagged completions

#### 8. Expedition Passport (Digital & Print)

- **Digital Passport**
  - Beautiful visual summary of completed expeditions
  - Map showing all visited locations
  - Stats, badges, favorite expedition
  - Shareable PDF export
- **Print Version**
  - Physical passport booklet ($10-15)
  - Stamp/sticker for each completed expedition
  - Shipped to user's address
  - Collector's item

#### 9. Advanced Gamification

- **Quests & Challenges**
  - Time-limited challenges: "Complete 5 food expeditions this week"
  - Unlock challenges: "Unlock 5 expeditions this week"
  - Progressive quests: "Complete 1 in each city"
  - Hidden achievements
  - Quest rewards (bonus points, exclusive badges)
- **Time-Limited Bonuses**
  - Complete within 7 days of unlock: +5 bonus points
  - Complete within 30 days of unlock: +2 bonus points
  - Visual countdown timer on unlocked expeditions
  - "Expired" status if not completed within 90 days (can re-unlock)
- **Streaks**
  - Daily login streak
  - Weekly completion streak
  - Completion chain: Complete 3 unlocked expeditions in a row → bonus badge
  - Streak rewards (multipliers)
- **Seasonal Events**
  - Halloween special expeditions
  - New Year exploration challenge
  - Festival-themed content

### Technical Improvements (v2.0)

- **Scalability**
  - Redis clustering
  - Database partitioning by city
  - CDN for all static assets
  - Rate limiting per IP/user
- **Mobile App** (Consideration)
  - React Native app for iOS/Android
  - Push notifications
  - Better offline support
  - Native camera integration
- **API for Third Parties**
  - Public API for partners
  - OAuth authentication
  - Rate-limited endpoints
  - API documentation (Swagger)

### Success Metrics (v2.0)

- 🎯 1,000+ expeditions across 10+ cities
- 🎯 500+ monthly active users
- 🎯 5,000+ total completions
- 🎯 50+ premium subscribers
- 🎯 5+ paying business partners
- 🎯 $500+ monthly recurring revenue (MRR)
- 🎯 Apply for Reddit Developer Fund

---

## Version 3.0+

**Status**: 🔮 Future Vision | **Timeline**: 6+ months | **Target**: Platform Maturity & Expansion

### Global Expansion

- **Multi-Country Support**
  - Support for 50+ cities globally
  - Localization (multiple languages)
  - Currency conversion for sponsorships
  - Regional moderator teams
- **International Partnerships**
  - Tourism boards
  - Travel agencies
  - Hotel chains
  - Airlines (travel rewards integration)

### Advanced Features

- **AI-Powered Recommendations**
  - Personalized expedition suggestions based on:
    - Past completions
    - Preferred tags
    - Difficulty level
    - Location proximity
  - ML model for predicting expedition quality
- **Augmented Reality**
  - AR mode for finding expeditions
  - AR photo filters at locations
  - Virtual treasure hunts
- **Voice Integration**
  - Voice-guided navigation to expeditions
  - Audio stories at expedition locations
  - Podcast-style expedition descriptions
- **Integration with Travel Platforms**
  - Google Maps integration
  - TripAdvisor cross-posting
  - Booking.com partnership (hotel recommendations)

### Community Tools

- **Event Organization**
  - Organize group meetups for expeditions
  - Event calendar
  - RSVP functionality
  - Live location sharing during event
- **Creator Tools**
  - Expedition creation wizard with templates
  - Bulk upload for tour guides
  - Analytics for creators (views, completions)
  - Revenue sharing for popular expeditions
- **Moderation Tools**
  - Auto-moderation with ML
  - Community voting on submissions
  - Trusted user program (skip moderation)

### Monetization Evolution

- **Marketplace**
  - Sell expedition packs created by users
  - Revenue share (70/30 split)
  - Premium expedition creation tools ($20/month)
- **Merchandise**
  - Branded SubVoyager gear (t-shirts, hats, stickers)
  - City-specific expedition maps (posters)
  - Expedition passport refills
- **Advertising** (Careful Implementation)
  - Native ads in expedition feed
  - Sponsored posts (clearly labeled)
  - Video ads (skippable) for premium unlocks

---

## Future Enhancements (Backlog)

### Quality of Life

- Dark mode
- Accessibility improvements (screen reader support, keyboard navigation)
- Multiple map providers (Google Maps, Mapbox options)
- Export user data (GDPR compliance)
- Account deletion workflow

### Engagement Features

- Daily expedition recommendations
- Monthly recap email (your achievements)
- Year-end wrapped (Spotify-style)
- Expedition difficulty voting (let users vote on difficulty)
- Weather integration (show current weather at expedition location)

### Advanced Analytics

- Heatmap of popular areas
- Time-to-complete analytics per expedition
- Seasonal popularity trends
- User journey analytics (discovery → unlock → complete funnel)

### Integration Ideas

- Strava integration (track walks/hikes to expeditions)
- Reddit flair based on level
- Discord bot for expedition notifications
- Twitter bot for daily featured expedition

---

## Monetization Strategy

### Revenue Streams

| Stream                    | Target        | Timeline          | Effort | Notes                          |
| ------------------------- | ------------- | ----------------- | ------ | ------------------------------ |
| **Premium Subscriptions** | $2,000/month  | v2.0 (Month 4)    | Medium | Core monetization              |
| **Business Partnerships** | $1,500/month  | v2.0 (Month 5)    | High   | Requires sales effort          |
| **Seasonal Packs**        | $500/month    | v2.0 (Month 6)    | Medium | One-time purchases             |
| **Expedition Passport**   | $300/month    | v2.0 (Month 6)    | Low    | Print-on-demand                |
| **Creator Revenue Share** | $200/month    | v3.0+ (Month 9+)  | High   | Platform fee from paid content |
| **Merchandise**           | $400/month    | v3.0+ (Month 12+) | Medium | Print-on-demand                |
| **Reddit Developer Fund** | $5,000-10,000 | v2.0 (Month 6)    | Low    | One-time or recurring grant    |

**Total MRR Projection (12 months)**: $5,000-7,000

### Pricing Strategy

**Freemium Model:**

- Free tier: Full access to core features, community expeditions
- Premium tier: Exclusive content, enhanced features, ad-free

**Premium Pricing:**

- Monthly: $4.99 (target 100 subscribers = $500/month)
- Annual: $49.99 (2 months free, target 50 subscribers = $2,500/year)
- Family: $9.99/month (target 20 subscriptions = $200/month)

**Business Partnerships:**

- Featured Expedition: $100/month per location
- Seasonal Pack Sponsorship: $500/pack
- Custom Partnership: $1,000-5,000 (tourism boards, large businesses)

---

## Technical Architecture

### Current Stack (MVP)

```
┌─────────────────────────────────────────────┐
│              Frontend (React)               │
│  - Vite build                               │
│  - Tailwind CSS                             │
│  - React Leaflet (maps)                     │
│  - TypeScript                               │
└──────────────────┬──────────────────────────┘
                   │ fetch('/api/...')
                   ↓
┌─────────────────────────────────────────────┐
│         Backend (Express + Devvit)          │
│  - Express 5.1.0 (serverless)               │
│  - Devvit Web APIs                          │
│  - Reddit integration                       │
└──────────────┬────────────┬─────────────────┘
               │            │
               ↓            ↓
     ┌─────────────┐  ┌──────────┐
     │    Redis    │  │  Reddit  │
     │ (Data Store)│  │   API    │
     └─────────────┘  └──────────┘
```

### Future Architecture (v2.0+)

```
┌────────────┐  ┌─────────────┐  ┌──────────────┐
│   React    │  │React Native │  │  Public API  │
│    Web     │  │  Mobile App │  │  (Partners)  │
└──────┬─────┘  └──────┬──────┘  └──────┬───────┘
       │               │                │
       └───────────────┴────────────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │    API Gateway        │
           │  - Auth               │
           │  - Rate Limiting      │
           │  - Load Balancing     │
           └──────────┬────────────┘
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
┌──────────────┐ ┌──────────┐ ┌──────────┐
│   Express    │ │  Redis   │ │  CDN     │
│   Backend    │ │ Cluster  │ │ (Images) │
└──────┬───────┘ └────┬─────┘ └──────────┘
       │              │
       ↓              ↓
┌──────────────┐ ┌──────────┐
│   Reddit     │ │External  │
│    API       │ │Services  │
│              │ │(Stripe,  │
│              │ │Cloudinary│
└──────────────┘ └──────────┘
```

### Data Models

**Key Redis Patterns:**

```
expedition:{id}                    → Expedition JSON
expedition:id:counter              → Auto-incrementing ID
expeditions:approved               → Hash of approved expedition IDs
expeditions:city:{city}            → Hash of expedition IDs by city
expeditions:tag:{tag}              → Hash of expedition IDs by tag

user:{username}                    → User profile JSON
user:{username}:unlocked           → Hash of unlocked expedition IDs
user:{username}:completed          → Hash of completed expedition IDs
user:{username}:created            → Hash of created expedition IDs
user:{username}:completion:{id}    → Completion details JSON

leaderboard:global                 → Sorted set (score = points)
```

---

## Success Metrics & KPIs

### Engagement Metrics

- **Daily Active Users (DAU)**
- **Monthly Active Users (MAU)**
- **DAU/MAU Ratio** (stickiness)
- **Average sessions per user per week**
- **Average session duration**

### Content Metrics

- **Expeditions created per week**
- **Expedition approval rate** (approved / submitted)
- **Average expeditions per city**
- **Completion rate** (completed / unlocked)
- **Time to completion** (days from unlock to complete)

### Growth Metrics

- **User growth rate** (week-over-week, month-over-month)
- **Retention** (Day 1, Day 7, Day 30)
- **Viral coefficient** (new users from shares)
- **Subreddit growth** (installations per subreddit)

### Monetization Metrics

- **Monthly Recurring Revenue (MRR)**
- **Average Revenue Per User (ARPU)**
- **Customer Lifetime Value (LTV)**
- **Conversion rate** (free → premium)
- **Churn rate** (premium cancellations)

### Quality Metrics

- **Average expedition rating**
- **Report rate** (reports per 1000 expeditions)
- **Moderation backlog** (pending submissions)
- **Support ticket volume**

---

## Risk Mitigation

### Technical Risks

- **Redis limits**: Monitor storage usage, implement data retention policies
- **Performance at scale**: Load testing, caching strategies, CDN
- **Devvit platform changes**: Stay updated with Reddit developer updates

### Product Risks

- **User adoption**: Strong onboarding, clear value proposition, referral program
- **Content quality**: Robust moderation, user reporting, quality guidelines
- **Monetization resistance**: Generous free tier, clear premium value

### Business Risks

- **Competitor apps**: Continuous innovation, community focus, unique features
- **Reddit policy changes**: Diversify (standalone web app as backup)
- **Seasonal fluctuations**: Year-round content, indoor expeditions, virtual options

---

## Development Priorities

### High Priority (Must Have)

1. Moderation system (v1.0)
2. Image hosting optimization (v1.0)
3. Reddit post integration (v1.0)
4. Badge system (v1.0)
5. Premium tier (v2.0)

### Medium Priority (Should Have)

1. Advanced search (v1.0)
2. Reviews & ratings (v2.0)
3. Seasonal packs (v2.0)
4. Business partnerships (v2.0)
5. Mobile app (v2.0+)

### Low Priority (Nice to Have)

1. AR features (v3.0+)
2. Voice integration (v3.0+)
3. Marketplace (v3.0+)
4. Merchandise (v3.0+)

---

## Team & Resources

### Current (MVP)

- 1 Developer (full-stack)

### v1.0 Needs

- 1 Full-stack developer
- 1 Designer (part-time or contract)
- 2-3 Moderators (community volunteers)

### v2.0+ Needs

- 2 Developers (1 frontend, 1 backend)
- 1 Designer (full-time)
- 1 Business development / partnerships
- 5-10 Moderators across cities
- 1 Community manager

---

## Conclusion

SubVoyager has strong potential to become the go-to exploration platform on Reddit, with a clear path from MVP to monetization. The focus on real-world engagement, community-driven content, and gamification differentiates it from typical Reddit apps. With careful execution of the roadmap, SubVoyager can achieve sustainable revenue while providing genuine value to urban explorers and travel communities.

**Next Immediate Steps:**

1. Complete MVP testing with r/subvoyager_dev
2. Gather user feedback and iterate
3. Launch v1.0 with moderation and Reddit integration
4. Target first production subreddit (r/Mumbai)
5. Build toward monetization in v2.0

---

**Document Version**: 1.0  
**Last Updated**: October 30, 2025  
**Maintained By**: SubVoyager Team
