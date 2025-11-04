import React, { useState } from 'react';
import type {
  ExpeditionTag,
  ExpeditionDifficulty,
  Coordinates,
} from '../../shared/types/expeditions';
import { createExpedition, imageToBase64 } from '../utils/api';
import { showForm } from '@devvit/web/client';

// City center coordinates (used as defaults)
const CITY_COORDINATES: Record<string, Coordinates> = {
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

// Helper function to get city coordinates with guaranteed return
function getCityCoordinates(city: string): Coordinates {
  return CITY_COORDINATES[city] ?? { lat: 19.076, lng: 72.8777 }; // Default to Mumbai
}

type ExpeditionFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export function ExpeditionForm({ onSuccess, onCancel }: ExpeditionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [tag, setTag] = useState<ExpeditionTag>('hidden-gem');
  const [difficulty, setDifficulty] = useState<ExpeditionDifficulty>('easy');
  const [photo, setPhoto] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB for base64)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image too large. Maximum size is 5MB');
      return;
    }

    try {
      const base64 = await imageToBase64(file);
      setPhoto(base64);
      setError(null);
    } catch (err) {
      setError('Failed to process image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Use city center coordinates as default
      const coordinates = getCityCoordinates(city);

      await createExpedition({
        title,
        description,
        coordinates,
        address,
        city,
        photo,
        tag,
        difficulty,
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expedition');
    } finally {
      setSubmitting(false);
    }
  };

  // Trigger native Reddit form (works in Reddit app!)
  const handleNativeForm = async () => {
    try {
      const result = await showForm({
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
      });

      // Check if form was submitted (not canceled)
      if (result && 'action' in result && result.action === 'CANCELED') {
        return; // User canceled
      }

      if (result && typeof result === 'object') {
        // Process the form result - data is nested under 'values'
        const formResponse = result as { action: string; values?: Record<string, unknown> };
        
        if (!formResponse.values) {
          throw new Error('No values returned from form');
        }
        
        const formValues = formResponse.values;
        
        const cityValue = Array.isArray(formValues.city) ? formValues.city[0] : formValues.city;
        const tagValue = Array.isArray(formValues.tag) ? formValues.tag[0] : formValues.tag;
        const difficultyValue = Array.isArray(formValues.difficulty) ? formValues.difficulty[0] : formValues.difficulty;
        const coordinates = getCityCoordinates(cityValue as string);

        const expeditionData = {
          title: formValues.title as string,
          description: formValues.description as string,
          coordinates,
          address: formValues.address as string,
          city: cityValue as string,
          photo: formValues.photo as string, // Already an i.redd.it URL
          tag: tagValue as ExpeditionTag,
          difficulty: difficultyValue as ExpeditionDifficulty,
        };

        // Submit to backend
        await createExpedition(expeditionData);

        onSuccess();
      }
    } catch (err) {
      console.error('Native form error:', err);
      setError('Failed to create expedition');
    }
  };

  // Show the full webview form for all platforms
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Create New Expedition</h2>

        {/* Alternative option for Reddit app users */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p className="text-sm text-blue-900 mb-2">
            Having trouble uploading photos?
          </p>
          <button
            type="button"
            onClick={handleNativeForm}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            🗺️ Create Expedition Here
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              placeholder="e.g., Hidden Rooftop Café with City Views"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={500}
              rows={4}
              placeholder="Describe what makes this place special..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Goa">Goa</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Lucknow">Lucknow</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag *</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as ExpeditionTag)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="urban">🏙️ Urban Exploration</option>
                <option value="nature">🌳 Nature & Outdoors</option>
                <option value="heritage">🏰 Heritage & Culture</option>
                <option value="food">🍲 Food & Local Eats</option>
                <option value="events">🎭 Events & Festivals</option>
                <option value="hidden-gem">🧩 Hidden Gems</option>
                <option value="photography">📸 Insta Spots</option>
                <option value="shopping">🛍️ Markets & Shopping</option>
                <option value="art">🎨 Art & Street Murals</option>
                <option value="adventure">🚴 Adventure & Sports</option>
                <option value="sunset">🌅 Sunrise/Sunset Points</option>
                <option value="spiritual">🕍 Spiritual & Temples</option>
                <option value="wellness">🧘 Mindful & Wellness</option>
                <option value="legends">💡 Local Legends</option>
                <option value="mystery">🕵️ Mystery Hunt</option>
                <option value="date">❤️ Date Spot</option>
                <option value="friends">🧑‍🤝‍🧑 With Friends</option>
                <option value="family">👨‍👩‍👧‍👦 Family Friendly</option>
                <option value="pet-friendly">🐾 Pet Friendly</option>
                <option value="budget">💸 Budget Friendly</option>
                <option value="luxury">✨ Luxury</option>
                <option value="cafe">☕ Chill & Coffee</option>
                <option value="nightlife">🌃 Nightlife</option>
                <option value="trail">🚶 Walkable Trail</option>
                <option value="getaway">🏞️ Weekend Getaways</option>
                <option value="road-trip">🚗 Road Trip Stop</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="e.g., Marine Drive, Bandra West, Near Cafe Madras"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide a descriptive address to help others find this expedition
            </p>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="easy"
                  checked={difficulty === 'easy'}
                  onChange={(e) => setDifficulty(e.target.value as ExpeditionDifficulty)}
                  className="mr-2"
                />
                Easy (10 pts)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="medium"
                  checked={difficulty === 'medium'}
                  onChange={(e) => setDifficulty(e.target.value as ExpeditionDifficulty)}
                  className="mr-2"
                />
                Medium (20 pts)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="hard"
                  checked={difficulty === 'hard'}
                  onChange={(e) => setDifficulty(e.target.value as ExpeditionDifficulty)}
                  className="mr-2"
                />
                Hard (30 pts)
              </label>
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              required={!photo}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max 5MB. 💡 <strong>Tip:</strong> On Reddit app with camera issues? Use the "Use Native Form" button above!
            </p>
            {photo && (
              <img src={photo} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-md" />
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Expedition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
