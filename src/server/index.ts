import express from 'express';
import type {
  InitResponse,
  CreateExpeditionRequest,
  CreateExpeditionResponse,
  ListExpeditionsResponse,
  GetExpeditionResponse,
  UnlockExpeditionResponse,
  CompleteExpeditionRequest,
  CompleteExpeditionResponse,
  GetUserProfileResponse,
  GetUserExpeditionsResponse,
  ErrorResponse,
} from '../shared/types/api';
import type { Expedition, UserCompletion, ExpeditionTag, ExpeditionDifficulty } from '../shared/types/expeditions';
import { reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';
import * as expeditionsDb from './data/expeditions';
import * as usersDb from './data/users';

const app = express();

// Middleware for JSON body parsing
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

// ============================================================================
// INITIALIZATION
// ============================================================================

router.get<{ postId: string }, InitResponse | ErrorResponse>(
  '/api/init',
  async (_req, res): Promise<void> => {
    const { postId } = context;

    if (!postId) {
      console.error('API Init Error: postId not found in devvit context');
      res.status(400).json({
        status: 'error',
        message: 'postId is required but missing from context',
      });
      return;
    }

    try {
      const username = await reddit.getCurrentUsername();
      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      // Get or create user profile
      const userProfile = await usersDb.getUserProfile(username);

      res.json({
        type: 'init',
        postId: postId,
        username: username,
        userProfile: userProfile,
      });
    } catch (error) {
      console.error(`API Init Error for post ${postId}:`, error);
      let errorMessage = 'Unknown error during initialization';
      if (error instanceof Error) {
        errorMessage = `Initialization failed: ${error.message}`;
      }
      res.status(400).json({ status: 'error', message: errorMessage });
    }
  }
);

// ============================================================================
// EXPEDITION ENDPOINTS
// ============================================================================

// Create new expedition
router.post<unknown, CreateExpeditionResponse | ErrorResponse, CreateExpeditionRequest>(
  '/api/expeditions/create',
  async (req, res): Promise<void> => {
    try {
      const username = await reddit.getCurrentUsername();
      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      const { title, description, coordinates, address, city, photo, tag, difficulty } = req.body;

      // Validate required fields
      if (
        !title ||
        !description ||
        !coordinates ||
        !address ||
        !city ||
        !photo ||
        !tag ||
        !difficulty
      ) {
      res.status(400).json({
          status: 'error',
          message: 'Missing required fields',
        });
        return;
      }

      // Generate expedition ID
      const expeditionId = await expeditionsDb.generateExpeditionId();

      // Create expedition object
      const expedition: Expedition = {
        id: expeditionId,
        title,
        description,
        location: {
          coordinates,
          address,
          city,
          country: 'India', // MVP: hardcoded
        },
        photo: {
          url: photo, // For MVP, storing base64 directly
          uploadedAt: new Date().toISOString(),
        },
        tag,
        difficulty,
        status: 'approved', // MVP: Auto-approve all expeditions for testing
        createdBy: username,
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(), // Auto-approved
        approvedBy: 'system', // Auto-approved by system
        points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30,
        completionCount: 0,
        unlockCount: 0,
      };

      // Save expedition
      await expeditionsDb.createExpedition(expedition);

      // Track user creation
      await usersDb.trackExpeditionCreation(username, expeditionId);

      res.json({
        success: true,
        expedition: expedition,
      });
    } catch (error) {
      console.error('Error creating expedition:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create expedition',
      });
    }
  }
);

// List expeditions with filters
router.get<unknown, ListExpeditionsResponse | ErrorResponse>(
  '/api/expeditions/list',
  async (req, res): Promise<void> => {
    try {
      const city = req.query.city as string | undefined;
      const tag = req.query.tag as string | undefined;
      const status = (req.query.status as 'approved' | 'pending') || 'approved';
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const expeditions = await expeditionsDb.searchExpeditions({
        ...(city && { city }),
        ...(tag && { tag }),
        status,
        limit: limit + 1, // Get one extra to check if there are more
        offset,
      });

      const hasMore = expeditions.length > limit;
      const results = hasMore ? expeditions.slice(0, limit) : expeditions;

      res.json({
        expeditions: results,
        total: results.length,
        hasMore,
      });
    } catch (error) {
      console.error('Error listing expeditions:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to list expeditions',
      });
    }
  }
);

// Get single expedition
router.get<{ id: string }, GetExpeditionResponse | ErrorResponse>(
  '/api/expeditions/:id',
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;
      const username = await reddit.getCurrentUsername();

      const expedition = await expeditionsDb.getExpedition(id);

      if (!expedition) {
        res.status(404).json({
          status: 'error',
          message: 'Expedition not found',
      });
      return;
    }

      // Check if user has unlocked/completed
      const isUnlocked = username ? await usersDb.hasUnlocked(username, id) : false;
      const isCompleted = username ? await usersDb.hasCompleted(username, id) : false;

      res.json({
        expedition,
        isUnlocked,
        isCompleted,
      });
    } catch (error) {
      console.error('Error getting expedition:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to get expedition',
      });
    }
  }
);

// ============================================================================
// USER ACTION ENDPOINTS
// ============================================================================

// Unlock an expedition
router.post<{ id: string }, UnlockExpeditionResponse | ErrorResponse>(
  '/api/expeditions/:id/unlock',
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;
      const username = await reddit.getCurrentUsername();

      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      // Check if expedition exists
      const expedition = await expeditionsDb.getExpedition(id);
      if (!expedition) {
        res.status(404).json({
          status: 'error',
          message: 'Expedition not found',
        });
        return;
      }

      // Check if already unlocked
      const alreadyUnlocked = await usersDb.hasUnlocked(username, id);
      if (alreadyUnlocked) {
        res.status(400).json({
          status: 'error',
          message: 'Expedition already unlocked',
        });
        return;
      }

      // Unlock the expedition
      await usersDb.unlockExpedition(username, id);
      await expeditionsDb.incrementExpeditionUnlocks(id);

      const userProfile = await usersDb.getUserProfile(username);

      res.json({
        success: true,
        message: 'Expedition unlocked successfully!',
        userProfile,
      });
    } catch (error) {
      console.error('Error unlocking expedition:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to unlock expedition',
      });
    }
  }
);

// Complete an expedition
router.post<{ id: string }, CompleteExpeditionResponse | ErrorResponse, CompleteExpeditionRequest>(
  '/api/expeditions/:id/complete',
  async (req, res): Promise<void> => {
    try {
      const { id } = req.params;
      const username = await reddit.getCurrentUsername();

      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      // Check if expedition exists
      const expedition = await expeditionsDb.getExpedition(id);
      if (!expedition) {
        res.status(404).json({
          status: 'error',
          message: 'Expedition not found',
        });
        return;
      }

      // Check if unlocked
      const isUnlocked = await usersDb.hasUnlocked(username, id);
      if (!isUnlocked) {
        res.status(400).json({
          status: 'error',
          message: 'You must unlock this expedition first',
        });
        return;
      }

      // Check if already completed
      const alreadyCompleted = await usersDb.hasCompleted(username, id);
      if (alreadyCompleted) {
        res.status(400).json({
          status: 'error',
          message: 'Expedition already completed',
        });
        return;
      }

      const { photo, notes } = req.body;

      // Create completion record
      const completion: UserCompletion = {
        expeditionId: id,
        username,
        completedAt: new Date().toISOString(),
        ...(photo && { photo: { url: photo, uploadedAt: new Date().toISOString() } }),
        ...(notes && { notes }),
        pointsAwarded: expedition.points,
      };

      // Complete the expedition
      await usersDb.completeExpedition(username, id, completion);
      await expeditionsDb.incrementExpeditionCompletions(id);

      const userProfile = await usersDb.getUserProfile(username);

    res.json({
        success: true,
        message: `Expedition completed! You earned ${expedition.points} points!`,
        completion,
        userProfile,
        pointsAwarded: expedition.points,
    });
    } catch (error) {
      console.error('Error completing expedition:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to complete expedition',
      });
    }
  }
);

// Get user profile
router.get<unknown, GetUserProfileResponse | ErrorResponse>(
  '/api/user/profile',
  async (_req, res): Promise<void> => {
    try {
      const username = await reddit.getCurrentUsername();

      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      const profile = await usersDb.getUserProfile(username);
      const unlockedExpeditions = await usersDb.getUserUnlockedIds(username);
      const completedExpeditions = await usersDb.getUserCompletedIds(username);

      res.json({
        profile,
        unlockedExpeditions,
        completedExpeditions,
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to get user profile',
      });
    }
  }
);

// Get user's expeditions (created, unlocked, completed)
router.get<unknown, GetUserExpeditionsResponse | ErrorResponse>(
  '/api/user/expeditions',
  async (_req, res): Promise<void> => {
    try {
      const username = await reddit.getCurrentUsername();

      if (!username) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
      });
      return;
    }

      // Get expedition IDs
      const createdIds = await usersDb.getUserCreatedIds(username);
      const unlockedIds = await usersDb.getUserUnlockedIds(username);
      const completedIds = await usersDb.getUserCompletedIds(username);

      // Fetch expeditions
      const [created, unlocked, completedExpeditions] = await Promise.all([
        Promise.all(createdIds.map((id) => expeditionsDb.getExpedition(id))),
        Promise.all(unlockedIds.map((id) => expeditionsDb.getExpedition(id))),
        Promise.all(completedIds.map((id) => expeditionsDb.getExpedition(id))),
      ]);

      // Get completion details for completed expeditions
      const completed = await Promise.all(
        completedExpeditions
          .filter((exp): exp is Expedition => exp !== null)
          .map(async (exp) => {
            const completion = await usersDb.getUserCompletion(username, exp.id);
            return {
              expedition: exp,
              completion: completion!,
            };
          })
      );

    res.json({
        created: created.filter((exp): exp is Expedition => exp !== null),
        unlocked: unlocked.filter((exp): exp is Expedition => exp !== null),
        completed,
      });
    } catch (error) {
      console.error('Error getting user expeditions:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to get user expeditions',
    });
    }
  }
);

// ============================================================================
// INTERNAL ENDPOINTS (for Reddit/Devvit)
// ============================================================================

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// ============================================================================
// NATIVE FORM for EXPEDITION CREATION (Works in Reddit App!)
// ============================================================================

// Menu action to show the native form
router.post('/internal/menu/create-expedition', async (_req, res): Promise<void> => {
  res.json({
    showForm: {
      name: 'createExpeditionForm',
      form: {
        title: '🗺️ Create New Expedition',
        description: 'Share a hidden gem or adventure in your city',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            helpText: 'Give your expedition a catchy name',
            required: true,
          },
          {
            type: 'paragraph',
            name: 'description',
            label: 'Description',
            helpText: 'What makes this place special?',
            required: true,
          },
          {
            type: 'image',
            name: 'photo',
            label: 'Photo',
            helpText: 'Upload a photo of this location',
            required: true,
          },
          {
            type: 'string',
            name: 'address',
            label: 'Address',
            helpText: 'Where is this located?',
            required: true,
          },
          {
            type: 'select',
            name: 'city',
            label: 'City',
            options: [
              { label: 'Mumbai', value: 'Mumbai' },
              { label: 'Delhi', value: 'Delhi' },
              { label: 'Bengaluru', value: 'Bengaluru' },
              { label: 'Hyderabad', value: 'Hyderabad' },
              { label: 'Chennai', value: 'Chennai' },
              { label: 'Kolkata', value: 'Kolkata' },
              { label: 'Pune', value: 'Pune' },
              { label: 'Jaipur', value: 'Jaipur' },
              { label: 'Goa', value: 'Goa' },
              { label: 'Ahmedabad', value: 'Ahmedabad' },
              { label: 'Lucknow', value: 'Lucknow' },
            ],
            required: true,
          },
          {
            type: 'select',
            name: 'tag',
            label: 'Tag',
            options: [
              { label: '🏙️ Urban Exploration', value: 'urban' },
              { label: '🌳 Nature & Outdoors', value: 'nature' },
              { label: '🏰 Heritage & Culture', value: 'heritage' },
              { label: '🍲 Food & Local Eats', value: 'food' },
              { label: '🎭 Events & Festivals', value: 'events' },
              { label: '🧩 Hidden Gems', value: 'hidden-gem' },
              { label: '📸 Insta Spots', value: 'photography' },
              { label: '🛍️ Markets & Shopping', value: 'shopping' },
              { label: '🎨 Art & Street Murals', value: 'art' },
              { label: '🚴 Adventure & Sports', value: 'adventure' },
              { label: '🌅 Sunrise/Sunset Points', value: 'sunset' },
              { label: '🕍 Spiritual & Temples', value: 'spiritual' },
              { label: '🧘 Mindful & Wellness', value: 'wellness' },
              { label: '💡 Local Legends', value: 'legends' },
              { label: '🕵️ Mystery Hunt', value: 'mystery' },
              { label: '❤️ Date Spot', value: 'date' },
              { label: '🧑‍🤝‍🧑 With Friends', value: 'friends' },
              { label: '👨‍👩‍👧‍👦 Family Friendly', value: 'family' },
              { label: '🐾 Pet Friendly', value: 'pet-friendly' },
              { label: '💸 Budget Friendly', value: 'budget' },
              { label: '✨ Luxury', value: 'luxury' },
              { label: '☕ Chill & Coffee', value: 'cafe' },
              { label: '🌃 Nightlife', value: 'nightlife' },
              { label: '🚶 Walkable Trail', value: 'trail' },
              { label: '🏞️ Weekend Getaways', value: 'getaway' },
              { label: '🚗 Road Trip Stop', value: 'road-trip' },
            ],
            required: true,
          },
          {
            type: 'select',
            name: 'difficulty',
            label: 'Difficulty',
            options: [
              { label: 'Easy (10 pts)', value: 'easy' },
              { label: 'Medium (20 pts)', value: 'medium' },
              { label: 'Hard (30 pts)', value: 'hard' },
            ],
            defaultValue: ['easy'],
            required: true,
          },
        ],
        acceptLabel: 'Create Expedition',
        cancelLabel: 'Cancel',
      },
    },
  });
});

// Form submission handler
router.post('/internal/form/create-expedition', async (req, res): Promise<void> => {
  try {
    const formData = req.body as {
      title: string;
      description: string;
      photo: string;
      address: string;
      city: string[];
      tag: string[];
      difficulty: string[];
    };

    // Extract single values from arrays (select fields return arrays)
    const city = Array.isArray(formData.city) ? formData.city[0] : formData.city;
    const tag = Array.isArray(formData.tag) ? formData.tag[0] : formData.tag;
    const difficulty = Array.isArray(formData.difficulty) ? formData.difficulty[0] : formData.difficulty;

    // Get city coordinates
    const cityCoords = {
      Mumbai: { lat: 19.076, lng: 72.8777 },
      Delhi: { lat: 28.7041, lng: 77.1025 },
      Bengaluru: { lat: 12.9716, lng: 77.5946 },
      Hyderabad: { lat: 17.385, lng: 78.4867 },
      Chennai: { lat: 13.0827, lng: 80.2707 },
      Kolkata: { lat: 22.5726, lng: 88.3639 },
      Pune: { lat: 18.5204, lng: 73.8567 },
      Jaipur: { lat: 26.9124, lng: 75.7873 },
      Goa: { lat: 15.2993, lng: 74.124 },
      Ahmedabad: { lat: 23.0225, lng: 72.5714 },
      Lucknow: { lat: 26.8467, lng: 80.9462 },
    };

    const coordinates = cityCoords[city as keyof typeof cityCoords] || cityCoords.Mumbai;

    // Get current user
    const currentUser = await reddit.getCurrentUser();
    const username = currentUser?.username || 'anonymous';

    // Generate expedition ID
    const expeditionId = await expeditionsDb.generateExpeditionId();

    // Create complete expedition object
    const expedition: Expedition = {
      id: expeditionId,
      title: formData.title,
      description: formData.description,
      location: {
        address: formData.address,
        city: city as string,
        country: 'India',
        coordinates: {
          lat: coordinates.lat,
          lng: coordinates.lng,
        },
      },
      photo: {
        url: formData.photo, // This is already an i.redd.it URL from the form
        uploadedAt: new Date().toISOString(),
      },
      tag: tag as ExpeditionTag,
      difficulty: difficulty as ExpeditionDifficulty,
      status: 'approved', // Auto-approve
      createdBy: username,
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      approvedBy: 'system',
      points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30,
      completionCount: 0,
      unlockCount: 0,
    };

    // Save expedition
    await expeditionsDb.createExpedition(expedition);

    // Track user creation
    await usersDb.trackExpeditionCreation(username, expeditionId);

    res.json({
      showToast: {
        text: '🎉 Expedition created successfully!',
        appearance: 'success',
      },
    });
  } catch (error) {
    console.error('❌ Error creating expedition:', error);
    res.json({
      showToast: {
        text: '❌ Failed to create expedition',
        appearance: 'error',
      },
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
