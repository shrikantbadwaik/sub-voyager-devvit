import React from 'react';

type FirstTimeHelpProps = {
  onClose: () => void;
};

export function FirstTimeHelp({ onClose }: FirstTimeHelpProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full p-6 my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">🗺️ Welcome to SubVoyager!</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* What is SubVoyager */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Discover Hidden Gems</h3>
            <p className="text-gray-600 text-sm">
              SubVoyager is a community-driven exploration platform. Discover secret spots, local
              favorites, and off-the-beaten-path locations shared by fellow explorers in your city.
            </p>
          </div>

          {/* How it Works */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-3">How It Works</h3>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Browse Expeditions</h4>
                  <p className="text-sm text-gray-600">
                    Explore the map or list to find interesting places in your city. Filter by
                    category (food, culture, photo spots) or difficulty.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">🔓 Unlock an Expedition</h4>
                  <p className="text-sm text-gray-600">
                    Found something interesting? Click <strong>"Unlock"</strong> to add it to your
                    adventure list. This is your commitment to explore it!
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">🚶 Visit in Real Life</h4>
                  <p className="text-sm text-gray-600">
                    Use the map or address to find the location. Take photos, enjoy the experience,
                    and immerse yourself in the hidden gem!
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">✅ Complete & Earn Points</h4>
                  <p className="text-sm text-gray-600">
                    Back in the app, click <strong>"I Visited This Place"</strong>. Upload your
                    photo, share your experience, and earn points based on difficulty!
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-sm">5</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">⭐ Level Up & Share</h4>
                  <p className="text-sm text-gray-600">
                    Earn 10-30 points per expedition. Level up every 50 points. Create your own
                    expeditions to share hidden gems with the community!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Points System */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">💎 Points & Levels</h3>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="font-bold text-green-600">Easy</div>
                <div className="text-gray-600">10 pts</div>
              </div>
              <div>
                <div className="font-bold text-yellow-600">Medium</div>
                <div className="text-gray-600">20 pts</div>
              </div>
              <div>
                <div className="font-bold text-red-600">Hard</div>
                <div className="text-gray-600">30 pts</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Level up every 50 points • Climb the leaderboard • Earn badges
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all"
        >
          Start Exploring! 🚀
        </button>
      </div>
    </div>
  );
}
