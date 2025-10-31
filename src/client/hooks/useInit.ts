import { useState, useEffect } from 'react';
import type { InitResponse, ErrorResponse } from '../../shared/types/api';
import type { UserProfile } from '../../shared/types/expeditions';

export function useInit() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [postId, setPostId] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch('/api/init');
        const data = await response.json();

        if ('status' in data && data.status === 'error') {
          const errorData = data as ErrorResponse;
          setError(errorData.message);
          return;
        }

        const initData = data as InitResponse;
        setUsername(initData.username);
        setUserProfile(initData.userProfile);
        setPostId(initData.postId);
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize');
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  return {
    loading,
    error,
    username,
    userProfile,
    postId,
    refreshProfile: () => {
      void (async () => {
        try {
          const response = await fetch('/api/user/profile');
          const data = await response.json();
          if ('profile' in data) {
            setUserProfile(data.profile);
          }
        } catch (err) {
          console.error('Failed to refresh profile:', err);
        }
      })();
    },
  };
}

