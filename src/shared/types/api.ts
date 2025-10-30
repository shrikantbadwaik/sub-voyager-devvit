import type {
  Expedition,
  UserProfile,
  UserCompletion,
  LeaderboardEntry,
  Coordinates,
  ExpeditionTag,
  ExpeditionDifficulty,
} from './expeditions';

// ============================================================================
// INITIALIZATION
// ============================================================================

export type InitResponse = {
  type: 'init';
  postId: string;
  username: string;
  userProfile: UserProfile;
};

// ============================================================================
// EXPEDITION ENDPOINTS
// ============================================================================

// POST /api/expeditions/create
export type CreateExpeditionRequest = {
  title: string;
  description: string;
  coordinates: Coordinates;
  address: string;
  city: string;
  photo: string; // Base64 encoded image for MVP
  tag: ExpeditionTag;
  difficulty: ExpeditionDifficulty;
};

export type CreateExpeditionResponse = {
  success: boolean;
  expedition?: Expedition;
  error?: string;
};

// GET /api/expeditions/list
export type ListExpeditionsRequest = {
  city?: string;
  tag?: ExpeditionTag;
  status?: 'approved' | 'pending';
  limit?: number;
  offset?: number;
};

export type ListExpeditionsResponse = {
  expeditions: Expedition[];
  total: number;
  hasMore: boolean;
};

// GET /api/expeditions/:id
export type GetExpeditionResponse = {
  expedition: Expedition | null;
  isUnlocked: boolean;
  isCompleted: boolean;
};

// ============================================================================
// USER ACTION ENDPOINTS
// ============================================================================

// POST /api/expeditions/:id/unlock
export type UnlockExpeditionResponse = {
  success: boolean;
  message: string;
  userProfile: UserProfile;
};

// POST /api/expeditions/:id/complete
export type CompleteExpeditionRequest = {
  photo?: string; // Optional completion photo (base64)
  notes?: string;
};

export type CompleteExpeditionResponse = {
  success: boolean;
  message: string;
  completion?: UserCompletion;
  userProfile: UserProfile;
  pointsAwarded: number;
};

// GET /api/user/profile
export type GetUserProfileResponse = {
  profile: UserProfile;
  unlockedExpeditions: string[]; // Array of expedition IDs
  completedExpeditions: string[]; // Array of expedition IDs
};

// GET /api/user/expeditions
export type GetUserExpeditionsResponse = {
  created: Expedition[];
  unlocked: Expedition[];
  completed: Array<{
    expedition: Expedition;
    completion: UserCompletion;
  }>;
};

// ============================================================================
// LEADERBOARD ENDPOINTS
// ============================================================================

// GET /api/leaderboard
export type GetLeaderboardRequest = {
  city?: string;
  limit?: number;
};

export type GetLeaderboardResponse = {
  leaderboard: LeaderboardEntry[];
  currentUserRank?: number;
};

// ============================================================================
// ERROR RESPONSE
// ============================================================================

export type ErrorResponse = {
  status: 'error';
  message: string;
  code?: string;
};
