import { useState, useEffect } from 'react';
import { useInit } from './hooks/useInit';
import { useExpeditions } from './hooks/useExpeditions';
import { ExpeditionForm } from './components/ExpeditionForm';
import { ExpeditionCard } from './components/ExpeditionCard';
import { ExpeditionMap } from './components/ExpeditionMap';
import { ExpeditionDetail } from './components/ExpeditionDetail';
import { UserProfile } from './components/UserProfile';
import { FirstTimeHelp } from './components/FirstTimeHelp';
import type { Expedition, ExpeditionTag } from '../shared/types/expeditions';

type View = 'map' | 'list';

export const App = () => {
  const { loading: initLoading, error: initError, username, userProfile } = useInit();
  const [view, setView] = useState<View>('map');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<ExpeditionTag | ''>('');
  const { expeditions, loading: expeditionsLoading, reload } = useExpeditions(
    selectedCity || undefined,
    selectedTag || undefined
  );

  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedExpedition, setSelectedExpedition] = useState<Expedition | null>(null);
  const [expeditionStatus, setExpeditionStatus] = useState<{
    isUnlocked: boolean;
    isCompleted: boolean;
  } | null>(null);

  // Show help on first visit
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('subvoyager_seen_help');
    if (!hasSeenHelp && !initLoading && username) {
      setShowHelp(true);
      localStorage.setItem('subvoyager_seen_help', 'true');
    }
  }, [initLoading, username]);

  // Load expedition status when selected
  useEffect(() => {
    if (selectedExpedition) {
      const fetchStatus = async () => {
        try {
          const response = await fetch(`/api/expeditions/${selectedExpedition.id}`);
          const data = await response.json();
          if (data.expedition) {
            setExpeditionStatus({
              isUnlocked: data.isUnlocked,
              isCompleted: data.isCompleted,
            });
          }
        } catch (err) {
          console.error('Failed to load expedition status:', err);
        }
      };
      fetchStatus();
    }
  }, [selectedExpedition]);

  const handleExpeditionClick = (expedition: Expedition) => {
    setSelectedExpedition(expedition);
  };

  const handleCloseDetail = () => {
    setSelectedExpedition(null);
    setExpeditionStatus(null);
  };

  const handleExpeditionUpdate = () => {
    reload();
    setSelectedExpedition(null);
    setExpeditionStatus(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    reload();
  };

  // Show loading state
  if (initLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SubVoyager...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (initError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load</h2>
          <p className="text-gray-600">{initError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-2xl font-bold">🗺️ SubVoyager</h1>
              <p className="text-xs text-orange-100">Discover hidden gems in your city</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHelp(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
                title="How it works"
              >
                <span className="text-lg">❓</span>
              </button>
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-colors"
              >
                <div className="text-right">
                  <div className="text-sm font-semibold">{username}</div>
                  <div className="text-xs text-orange-100">
                    Level {userProfile?.level} • {userProfile?.totalPoints} pts
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('map')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                view === 'map'
                  ? 'bg-white text-orange-600'
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
            >
              🗺️ Map View
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                view === 'list'
                  ? 'bg-white text-orange-600'
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
            >
              📋 List View
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-3 overflow-x-auto">
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Pune">Pune</option>
          </select>

          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value as ExpeditionTag | '')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Tags</option>
            <option value="hidden-gem">Hidden Gem</option>
            <option value="food">Food</option>
            <option value="photo-spot">Photo Spot</option>
            <option value="culture">Culture</option>
            <option value="walk">Walk</option>
            <option value="nature">Nature</option>
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="ml-auto px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 text-sm whitespace-nowrap"
          >
            + Create Expedition
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {expeditionsLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading expeditions...</p>
            </div>
          </div>
        ) : expeditions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md p-6">
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Expeditions Yet</h2>
              <p className="text-gray-600 mb-4">
                Be the first to create an expedition and start exploring!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
              >
                Create First Expedition
              </button>
            </div>
          </div>
        ) : view === 'map' ? (
          <ExpeditionMap
            expeditions={expeditions}
            onMarkerClick={handleExpeditionClick}
            center={
              expeditions.length > 0
                ? [expeditions[0]!.location.coordinates.lat, expeditions[0]!.location.coordinates.lng]
                : [19.0760, 72.8777]
            }
          />
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
              {expeditions.map(expedition => (
                <ExpeditionCard
                  key={expedition.id}
                  expedition={expedition}
                  onClick={() => handleExpeditionClick(expedition)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && <ExpeditionForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />}

      {showProfile && userProfile && (
        <UserProfile profile={userProfile} onClose={() => setShowProfile(false)} />
      )}

      {showHelp && <FirstTimeHelp onClose={() => setShowHelp(false)} />}

      {selectedExpedition && expeditionStatus && (
        <ExpeditionDetail
          expedition={selectedExpedition}
          isUnlocked={expeditionStatus.isUnlocked}
          isCompleted={expeditionStatus.isCompleted}
          onClose={handleCloseDetail}
          onUpdate={handleExpeditionUpdate}
        />
      )}
    </div>
  );
};
