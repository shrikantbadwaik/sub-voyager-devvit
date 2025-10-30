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
      backgroundUri: 'default-splash.png',
      buttonLabel: 'Start Exploring',
      description: 'Discover hidden gems and local expeditions in your city',
      entryUri: 'index.html',
      heading: '🗺️ SubVoyager',
      appIconUri: 'default-icon.png',
    },
    postData: {
      appVersion: '1.0.0-mvp',
    },
    subredditName: subredditName,
    title: '🗺️ SubVoyager - Discover Hidden Gems in Your City',
  });
};
