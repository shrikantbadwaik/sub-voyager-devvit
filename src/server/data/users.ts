import { redis } from '@devvit/web/server';
import type { UserProfile, UserCompletion } from '../../shared/types/expeditions';
import * as keys from './redis-keys';

/**
 * Get or create a user profile
 */
export async function getUserProfile(username: string): Promise<UserProfile> {
  const data = await redis.get(keys.userKey(username));
  
  if (data) {
    return JSON.parse(data) as UserProfile;
  }
  
  // Create new user profile
  const newProfile: UserProfile = {
    username,
    joinedAt: new Date().toISOString(),
    totalPoints: 0,
    expeditionsCreated: 0,
    expeditionsUnlocked: 0,
    expeditionsCompleted: 0,
    level: 1,
    badges: [],
  };
  
  await saveUserProfile(newProfile);
  return newProfile;
}

/**
 * Save user profile
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const profileData = JSON.stringify(profile);
  await redis.set(keys.userKey(profile.username), profileData);
}

/**
 * Check if user has unlocked an expedition
 */
export async function hasUnlocked(username: string, expeditionId: string): Promise<boolean> {
  const unlockedHash = await redis.hGet(keys.userUnlocked(username), expeditionId);
  return unlockedHash !== undefined && unlockedHash !== null;
}

/**
 * Check if user has completed an expedition
 */
export async function hasCompleted(username: string, expeditionId: string): Promise<boolean> {
  const completedHash = await redis.hGet(keys.userCompleted(username), expeditionId);
  return completedHash !== undefined && completedHash !== null;
}

/**
 * Unlock an expedition for a user
 */
export async function unlockExpedition(username: string, expeditionId: string): Promise<void> {
  // Add to user's unlocked hash
  await redis.hSet(keys.userUnlocked(username), { [expeditionId]: new Date().toISOString() });
  
  // Update user profile
  const profile = await getUserProfile(username);
  profile.expeditionsUnlocked += 1;
  await saveUserProfile(profile);
}

/**
 * Mark an expedition as completed for a user
 */
export async function completeExpedition(
  username: string,
  expeditionId: string,
  completion: UserCompletion
): Promise<void> {
  // Add to user's completed hash
  await redis.hSet(keys.userCompleted(username), { [expeditionId]: new Date().toISOString() });
  
  // Store completion details
  const completionData = JSON.stringify(completion);
  await redis.set(keys.userCompletionKey(username, expeditionId), completionData);
  
  // Update user profile
  const profile = await getUserProfile(username);
  profile.expeditionsCompleted += 1;
  profile.totalPoints += completion.pointsAwarded;
  
  // Calculate level (simple: 1 level per 50 points)
  profile.level = Math.floor(profile.totalPoints / 50) + 1;
  
  await saveUserProfile(profile);
  
  // Update leaderboards
  await updateLeaderboard(username, profile.totalPoints);
}

/**
 * Track expedition creation by user
 */
export async function trackExpeditionCreation(
  username: string,
  expeditionId: string
): Promise<void> {
  // Add to user's created hash
  await redis.hSet(keys.userCreated(username), { [expeditionId]: new Date().toISOString() });
  
  // Update user profile
  const profile = await getUserProfile(username);
  profile.expeditionsCreated += 1;
  await saveUserProfile(profile);
}

/**
 * Get user's unlocked expedition IDs
 */
export async function getUserUnlockedIds(username: string): Promise<string[]> {
  const unlockedHash = await redis.hGetAll(keys.userUnlocked(username));
  return unlockedHash ? Object.keys(unlockedHash) : [];
}

/**
 * Get user's completed expedition IDs
 */
export async function getUserCompletedIds(username: string): Promise<string[]> {
  const completedHash = await redis.hGetAll(keys.userCompleted(username));
  return completedHash ? Object.keys(completedHash) : [];
}

/**
 * Get user's created expedition IDs
 */
export async function getUserCreatedIds(username: string): Promise<string[]> {
  const createdHash = await redis.hGetAll(keys.userCreated(username));
  return createdHash ? Object.keys(createdHash) : [];
}

/**
 * Get completion details for a specific expedition
 */
export async function getUserCompletion(
  username: string,
  expeditionId: string
): Promise<UserCompletion | null> {
  const data = await redis.get(keys.userCompletionKey(username, expeditionId));
  if (!data) return null;
  
  return JSON.parse(data) as UserCompletion;
}

/**
 * Update global and city leaderboards
 */
export async function updateLeaderboard(username: string, totalPoints: number): Promise<void> {
  // Update global leaderboard (using sorted set)
  await redis.zAdd(keys.leaderboardGlobal(), {
    member: username,
    score: totalPoints,
  });
}

/**
 * Get global leaderboard
 */
export async function getGlobalLeaderboard(limit: number = 100): Promise<Array<{ username: string; score: number; rank: number }>> {
  const results = await redis.zRange(keys.leaderboardGlobal(), 0, limit - 1, { by: 'rank', reverse: true });
  
  if (!results || results.length === 0) return [];
  
  return results.map((item, index) => ({
    username: typeof item === 'string' ? item : item.member,
    score: typeof item === 'string' ? 0 : item.score,
    rank: index + 1,
  }));
}

/**
 * Get user's rank on global leaderboard
 */
export async function getUserRank(username: string): Promise<number | null> {
  const rank = await redis.zRank(keys.leaderboardGlobal(), username);
  return rank !== undefined && rank !== null ? rank + 1 : null;
}

/**
 * Award points to user (used for various achievements)
 */
export async function awardPoints(username: string, points: number, reason?: string): Promise<void> {
  const profile = await getUserProfile(username);
  profile.totalPoints += points;
  profile.level = Math.floor(profile.totalPoints / 50) + 1;
  
  await saveUserProfile(profile);
  await updateLeaderboard(username, profile.totalPoints);
  
  console.log(`Awarded ${points} points to ${username}. Reason: ${reason || 'N/A'}`);
}
