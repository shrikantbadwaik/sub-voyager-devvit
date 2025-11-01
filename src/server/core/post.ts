import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration
      appDisplayName: 'SubVoyager',
      backgroundUri: 'splash-bg.png',
      buttonLabel: 'Start Exploring',
      description: 'Discover hidden gems and local expeditions in your city',
      heading: '🗺️ SubVoyager',
      appIconUri: 'app-icon.png',
    },
    postData: {
      appVersion: '1.0.0-mvp',
    },
    subredditName: subredditName,
    title: '🗺️ SubVoyager - Discover Hidden Gems in Your City',
  });
};
