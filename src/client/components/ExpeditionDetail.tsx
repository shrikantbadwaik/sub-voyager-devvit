import { useState } from 'react';
import type { Expedition } from '../../shared/types/expeditions';
import { unlockExpedition, completeExpedition, imageToBase64 } from '../utils/api';

type ExpeditionDetailProps = {
  expedition: Expedition;
  isUnlocked: boolean;
  isCompleted: boolean;
  onClose: () => void;
  onUpdate: () => void;
};

export function ExpeditionDetail({
  expedition,
  isUnlocked,
  isCompleted,
  onClose,
  onUpdate,
}: ExpeditionDetailProps) {
  const [unlocking, setUnlocking] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [completionPhoto, setCompletionPhoto] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    setUnlocking(true);
    setError(null);

    try {
      await unlockExpedition(expedition.id);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock expedition');
    } finally {
      setUnlocking(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    setError(null);

    try {
      await completeExpedition(expedition.id, {
        photo: completionPhoto || undefined,
        notes: completionNotes || undefined,
      });
      setShowCompleteForm(false);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete expedition');
    } finally {
      setCompleting(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image too large. Maximum size is 5MB');
      return;
    }

    try {
      const base64 = await imageToBase64(file);
      setCompletionPhoto(base64);
      setError(null);
    } catch (err) {
      setError('Failed to process image');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Image */}
        <div className="relative h-64">
          <img
            src={expedition.photo.url}
            alt={expedition.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{expedition.title}</h2>

          <p className="text-gray-600 mb-4">{expedition.description}</p>

          {/* Location */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">📍 Location</h3>
            <p className="text-sm text-gray-600">{expedition.location.address}</p>
            <p className="text-sm text-gray-600">{expedition.location.city}, {expedition.location.country}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{expedition.points}</div>
              <div className="text-xs text-gray-600">Points</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{expedition.unlockCount}</div>
              <div className="text-xs text-gray-600">Unlocked</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{expedition.completionCount}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {expedition.tag.replace('-', ' ')}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {expedition.difficulty}
            </span>
          </div>

          {/* Author */}
          <p className="text-sm text-gray-500 mb-6">
            Created by u/{expedition.createdBy} on {new Date(expedition.createdAt).toLocaleDateString()}
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Actions */}
          {isCompleted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
              ✓ You've completed this expedition!
            </div>
          ) : isUnlocked ? (
            showCompleteForm ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Complete Your Expedition</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {completionPhoto && (
                    <img
                      src={completionPhoto}
                      alt="Completion"
                      className="mt-2 w-full h-48 object-cover rounded-md"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={completionNotes}
                    onChange={e => setCompletionNotes(e.target.value)}
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCompleteForm(false)}
                    disabled={completing}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {completing ? 'Submitting...' : 'Complete Expedition'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCompleteForm(true)}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Mark as Completed
              </button>
            )
          ) : (
            <button
              onClick={handleUnlock}
              disabled={unlocking}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
            >
              {unlocking ? 'Unlocking...' : '🔓 Unlock This Expedition'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

