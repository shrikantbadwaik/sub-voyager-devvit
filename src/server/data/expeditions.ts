import { redis } from '@devvit/web/server';
import type { Expedition, Coordinates } from '../../shared/types/expeditions';
import * as keys from './redis-keys';

/**
 * Generate a unique expedition ID
 */
export async function generateExpeditionId(): Promise<string> {
  const counter = await redis.incrBy(keys.expeditionIdCounter(), 1);
  return `exp_${counter.toString().padStart(6, '0')}`;
}

/**
 * Create a new expedition
 */
export async function createExpedition(expedition: Expedition): Promise<void> {
  const expeditionData = JSON.stringify(expedition);

  // Store expedition data
  await redis.set(keys.expeditionKey(expedition.id), expeditionData);

  // Store expedition IDs in hashes (using hashes as sets)
  await redis.hSet(keys.expeditionsByStatus(expedition.status), { [expedition.id]: '1' });
  await redis.hSet(keys.expeditionsByCity(expedition.location.city), { [expedition.id]: '1' });
  await redis.hSet(keys.expeditionsByTag(expedition.tag), { [expedition.id]: '1' });

  // Note: Geospatial indexing not available in Devvit Redis MVP
  // Will implement simple lat/lng filtering in v1.0
}

/**
 * Get an expedition by ID
 */
export async function getExpedition(id: string): Promise<Expedition | null> {
  const data = await redis.get(keys.expeditionKey(id));
  if (!data) return null;

  return JSON.parse(data) as Expedition;
}

/**
 * Update an expedition
 */
export async function updateExpedition(expedition: Expedition): Promise<void> {
  const expeditionData = JSON.stringify(expedition);
  await redis.set(keys.expeditionKey(expedition.id), expeditionData);
}

/**
 * Get expeditions by status
 */
export async function getExpeditionsByStatus(
  status: 'approved' | 'pending' | 'rejected',
  limit?: number,
  offset?: number
): Promise<Expedition[]> {
  const idsHash = await redis.hGetAll(keys.expeditionsByStatus(status));
  const ids = idsHash ? Object.keys(idsHash) : [];

  // Apply pagination
  const paginatedIds = limit ? ids.slice(offset || 0, (offset || 0) + limit) : ids;

  // Fetch all expeditions in parallel
  const expeditions = await Promise.all(paginatedIds.map((id: string) => getExpedition(id)));

  // Filter out nulls and return
  return expeditions.filter((exp): exp is Expedition => exp !== null);
}

/**
 * Get expeditions by city
 */
export async function getExpeditionsByCity(
  city: string,
  limit?: number,
  offset?: number
): Promise<Expedition[]> {
  const idsHash = await redis.hGetAll(keys.expeditionsByCity(city));
  const ids = idsHash ? Object.keys(idsHash) : [];

  // Apply pagination
  const paginatedIds = limit ? ids.slice(offset || 0, (offset || 0) + limit) : ids;

  // Fetch all expeditions in parallel
  const expeditions = await Promise.all(paginatedIds.map((id: string) => getExpedition(id)));

  // Filter out nulls and only return approved expeditions
  return expeditions.filter((exp): exp is Expedition => exp !== null && exp.status === 'approved');
}

/**
 * Get expeditions by tag
 */
export async function getExpeditionsByTag(
  tag: string,
  limit?: number,
  offset?: number
): Promise<Expedition[]> {
  const idsHash = await redis.hGetAll(keys.expeditionsByTag(tag));
  const ids = idsHash ? Object.keys(idsHash) : [];

  // Apply pagination
  const paginatedIds = limit ? ids.slice(offset || 0, (offset || 0) + limit) : ids;

  // Fetch all expeditions in parallel
  const expeditions = await Promise.all(paginatedIds.map((id: string) => getExpedition(id)));

  // Filter out nulls and only return approved expeditions
  return expeditions.filter((exp): exp is Expedition => exp !== null && exp.status === 'approved');
}

/**
 * Get all approved expeditions
 */
export async function getAllExpeditions(limit?: number, offset?: number): Promise<Expedition[]> {
  return getExpeditionsByStatus('approved', limit, offset);
}

/**
 * Search expeditions by multiple criteria
 */
export async function searchExpeditions(params: {
  city?: string;
  tag?: string;
  status?: 'approved' | 'pending';
  limit?: number;
  offset?: number;
}): Promise<Expedition[]> {
  const { city, tag, status = 'approved', limit, offset } = params;

  let expeditionIds: string[];

  if (city && tag) {
    // Get intersection of city and tag
    const cityIdsHash = await redis.hGetAll(keys.expeditionsByCity(city));
    const tagIdsHash = await redis.hGetAll(keys.expeditionsByTag(tag));
    const cityIds = cityIdsHash ? Object.keys(cityIdsHash) : [];
    const tagIds = tagIdsHash ? Object.keys(tagIdsHash) : [];
    expeditionIds = cityIds.filter((id: string) => tagIds.includes(id));
  } else if (city) {
    const idsHash = await redis.hGetAll(keys.expeditionsByCity(city));
    expeditionIds = idsHash ? Object.keys(idsHash) : [];
  } else if (tag) {
    const idsHash = await redis.hGetAll(keys.expeditionsByTag(tag));
    expeditionIds = idsHash ? Object.keys(idsHash) : [];
  } else {
    const idsHash = await redis.hGetAll(keys.expeditionsByStatus(status));
    expeditionIds = idsHash ? Object.keys(idsHash) : [];
  }

  // Apply pagination
  const paginatedIds = limit
    ? expeditionIds.slice(offset || 0, (offset || 0) + limit)
    : expeditionIds;

  // Fetch all expeditions in parallel
  const expeditions = await Promise.all(paginatedIds.map((id: string) => getExpedition(id)));

  // Filter by status and nulls
  return expeditions.filter((exp): exp is Expedition => exp !== null && exp.status === status);
}

/**
 * Get nearby expeditions using simple distance calculation
 * Note: For MVP, this is a simple implementation. Will optimize in v1.0
 */
export async function getNearbyExpeditions(
  coordinates: Coordinates,
  radiusKm: number = 10,
  limit?: number
): Promise<Expedition[]> {
  // Get all approved expeditions
  const allExpeditions = await getAllExpeditions();

  // Calculate distance and filter
  const nearby = allExpeditions
    .map((exp) => ({
      expedition: exp,
      distance: calculateDistance(coordinates, exp.location.coordinates),
    }))
    .filter((item) => item.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map((item) => item.expedition);

  return nearby;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Increment expedition counters
 */
export async function incrementExpeditionUnlocks(expeditionId: string): Promise<void> {
  const expedition = await getExpedition(expeditionId);
  if (!expedition) return;

  expedition.unlockCount += 1;
  await updateExpedition(expedition);
}

export async function incrementExpeditionCompletions(expeditionId: string): Promise<void> {
  const expedition = await getExpedition(expeditionId);
  if (!expedition) return;

  expedition.completionCount += 1;
  await updateExpedition(expedition);
}

/**
 * Approve an expedition (for moderation)
 */
export async function approveExpedition(
  expeditionId: string,
  approvedBy: string
): Promise<boolean> {
  const expedition = await getExpedition(expeditionId);
  if (!expedition) return false;

  // Remove from pending
  await redis.hDel(keys.expeditionsByStatus('pending'), [expeditionId]);

  // Add to approved
  await redis.hSet(keys.expeditionsByStatus('approved'), { [expeditionId]: '1' });

  // Update expedition
  expedition.status = 'approved';
  expedition.approvedAt = new Date().toISOString();
  expedition.approvedBy = approvedBy;
  await updateExpedition(expedition);

  return true;
}
