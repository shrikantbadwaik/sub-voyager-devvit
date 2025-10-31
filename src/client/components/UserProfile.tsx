import type { UserProfile as UserProfileType } from '../../shared/types/expeditions';

type UserProfileProps = {
  profile: UserProfileType;
  onClose: () => void;
};

export function UserProfile({ profile, onClose }: UserProfileProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-bold mb-1">u/{profile.username}</h3>
          <p className="text-orange-100">Level {profile.level} Explorer</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{profile.totalPoints}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{profile.expeditionsCreated}</div>
            <div className="text-sm text-gray-600">Created</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{profile.expeditionsUnlocked}</div>
            <div className="text-sm text-gray-600">Unlocked</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{profile.expeditionsCompleted}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                >
                  🏆 {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Member Since */}
        <p className="text-sm text-gray-500 text-center">
          Explorer since {new Date(profile.joinedAt).toLocaleDateString()}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
