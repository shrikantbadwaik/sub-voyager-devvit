/**
 * Redis Key Patterns for SubVoyager
 * 
 * This file defines all Redis key patterns used in the application.
 * Keeping them centralized prevents key conflicts and makes schema changes easier.
 */

// ============================================================================
// EXPEDITIONS
// ============================================================================

// Individual expedition data: expedition:{id}
export const expeditionKey = (id: string) => `expedition:${id}`;

// Counter for expedition IDs: expedition:id:counter
export const expeditionIdCounter = () => `expedition:id:counter`;

// List of all expedition IDs by status: expeditions:{status}
export const expeditionsByStatus = (status: 'approved' | 'pending' | 'rejected') => 
  `expeditions:${status}`;

// List of expedition IDs by city: expeditions:city:{city}
export const expeditionsByCity = (city: string) => `expeditions:city:${city.toLowerCase()}`;

// List of expedition IDs by tag: expeditions:tag:{tag}
export const expeditionsByTag = (tag: string) => `expeditions:tag:${tag}`;

// Geospatial index for expeditions: expeditions:geo
export const expeditionsGeo = () => `expeditions:geo`;

// ============================================================================
// USERS
// ============================================================================

// User profile: user:{username}
export const userKey = (username: string) => `user:${username}`;

// User's unlocked expeditions (SET): user:{username}:unlocked
export const userUnlocked = (username: string) => `user:${username}:unlocked`;

// User's completed expeditions (SET): user:{username}:completed
export const userCompleted = (username: string) => `user:${username}:completed`;

// User's created expeditions (SET): user:{username}:created
export const userCreated = (username: string) => `user:${username}:created`;

// User completion details: user:{username}:completion:{expeditionId}
export const userCompletionKey = (username: string, expeditionId: string) => 
  `user:${username}:completion:${expeditionId}`;

// ============================================================================
// LEADERBOARDS
// ============================================================================

// Global leaderboard (SORTED SET by points): leaderboard:global
export const leaderboardGlobal = () => `leaderboard:global`;

// City leaderboard: leaderboard:city:{city}
export const leaderboardCity = (city: string) => `leaderboard:city:${city.toLowerCase()}`;

// ============================================================================
// STATISTICS
// ============================================================================

// Total stats: stats:total
export const statsTotal = () => `stats:total`;

