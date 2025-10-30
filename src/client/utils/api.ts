/**
 * API helper functions for SubVoyager client
 */

import type {
  CreateExpeditionRequest,
  CreateExpeditionResponse,
  UnlockExpeditionResponse,
  CompleteExpeditionRequest,
  CompleteExpeditionResponse,
  ErrorResponse,
} from '../../shared/types/api';

/**
 * Create a new expedition
 */
export async function createExpedition(
  data: CreateExpeditionRequest
): Promise<CreateExpeditionResponse> {
  const response = await fetch('/api/expeditions/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if ('status' in result && result.status === 'error') {
    throw new Error((result as ErrorResponse).message);
  }

  return result as CreateExpeditionResponse;
}

/**
 * Unlock an expedition
 */
export async function unlockExpedition(
  expeditionId: string
): Promise<UnlockExpeditionResponse> {
  const response = await fetch(`/api/expeditions/${expeditionId}/unlock`, {
    method: 'POST',
  });

  const result = await response.json();

  if ('status' in result && result.status === 'error') {
    throw new Error((result as ErrorResponse).message);
  }

  return result as UnlockExpeditionResponse;
}

/**
 * Complete an expedition
 */
export async function completeExpedition(
  expeditionId: string,
  data: CompleteExpeditionRequest
): Promise<CompleteExpeditionResponse> {
  const response = await fetch(`/api/expeditions/${expeditionId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if ('status' in result && result.status === 'error') {
    throw new Error((result as ErrorResponse).message);
  }

  return result as CompleteExpeditionResponse;
}

/**
 * Convert image file to base64
 */
export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

