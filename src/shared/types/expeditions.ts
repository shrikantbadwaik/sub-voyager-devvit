// Expedition Tags/Categories
export type ExpeditionTag = 'food' | 'photo-spot' | 'culture' | 'walk' | 'nature' | 'hidden-gem';

// Expedition Difficulty Levels
export type ExpeditionDifficulty = 'easy' | 'medium' | 'hard';

// Expedition Status
export type ExpeditionStatus = 'pending' | 'approved' | 'rejected';

// Geographic coordinates
export type Coordinates = {
  lat: number;
  lng: number;
};

// Location information
export type Location = {
  coordinates: Coordinates;
  address: string;
  city: string;
  region?: string;
  country: string;
};

// Photo data
export type Photo = {
  url: string;
  caption?: string;
  uploadedAt: string;
};

// Core Expedition Entity
export type Expedition = {
  id: string;
  title: string;
  description: string;
  location: Location;
  photo: Photo; // MVP: single photo only
  tag: ExpeditionTag;
  difficulty: ExpeditionDifficulty;
  status: ExpeditionStatus;
  createdBy: string; // Reddit username
  createdAt: string; // ISO timestamp
  approvedAt?: string;
  approvedBy?: string; // Moderator username
  points: number; // Points awarded for completion
  completionCount: number; // How many users completed this
  unlockCount: number; // How many users unlocked this
};

// User profile and stats
export type UserProfile = {
  username: string;
  joinedAt: string;
  totalPoints: number;
  expeditionsCreated: number;
  expeditionsUnlocked: number;
  expeditionsCompleted: number;
  level: number;
  badges: string[];
};

// User's unlocked expedition
export type UserUnlock = {
  expeditionId: string;
  username: string;
  unlockedAt: string;
};

// User's completed expedition
export type UserCompletion = {
  expeditionId: string;
  username: string;
  completedAt: string;
  photo?: Photo; // Optional: user's photo of completion
  notes?: string; // User's reflection/notes
  pointsAwarded: number;
};

// Leaderboard entry
export type LeaderboardEntry = {
  username: string;
  totalPoints: number;
  rank: number;
  expeditionsCompleted: number;
};
