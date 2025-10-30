import { useState, useEffect, useCallback } from 'react';
import type { Expedition, ExpeditionTag } from '../../shared/types/expeditions';
import type { ListExpeditionsResponse, ErrorResponse } from '../../shared/types/api';

export function useExpeditions(city?: string, tag?: ExpeditionTag) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const loadExpeditions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (tag) params.append('tag', tag);
      params.append('limit', '50');

      const response = await fetch(`/api/expeditions/list?${params}`);
      const data = await response.json();

      if ('status' in data && data.status === 'error') {
        const errorData = data as ErrorResponse;
        setError(errorData.message);
        return;
      }

      const listData = data as ListExpeditionsResponse;
      setExpeditions(listData.expeditions);
      setHasMore(listData.hasMore);
    } catch (err) {
      console.error('Failed to load expeditions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load expeditions');
    } finally {
      setLoading(false);
    }
  }, [city, tag]);

  useEffect(() => {
    loadExpeditions();
  }, [loadExpeditions]);

  return {
    expeditions,
    loading,
    error,
    hasMore,
    reload: loadExpeditions,
  };
}

