import type { Expedition } from '../../shared/types/expeditions';

type ExpeditionCardProps = {
  expedition: Expedition;
  onClick: () => void;
  isUnlocked?: boolean;
  isCompleted?: boolean;
};

const tagColors: Record<string, string> = {
  urban: 'bg-gray-100 text-gray-800',
  nature: 'bg-emerald-100 text-emerald-800',
  heritage: 'bg-amber-100 text-amber-800',
  food: 'bg-orange-100 text-orange-800',
  events: 'bg-purple-100 text-purple-800',
  'hidden-gem': 'bg-pink-100 text-pink-800',
  photography: 'bg-blue-100 text-blue-800',
  shopping: 'bg-indigo-100 text-indigo-800',
  art: 'bg-fuchsia-100 text-fuchsia-800',
  adventure: 'bg-red-100 text-red-800',
  sunset: 'bg-rose-100 text-rose-800',
  spiritual: 'bg-violet-100 text-violet-800',
  wellness: 'bg-teal-100 text-teal-800',
  legends: 'bg-slate-100 text-slate-800',
  mystery: 'bg-zinc-100 text-zinc-800',
  date: 'bg-pink-100 text-pink-800',
  friends: 'bg-cyan-100 text-cyan-800',
  family: 'bg-lime-100 text-lime-800',
  'pet-friendly': 'bg-green-100 text-green-800',
  budget: 'bg-yellow-100 text-yellow-800',
  luxury: 'bg-purple-100 text-purple-800',
  cafe: 'bg-amber-100 text-amber-800',
  nightlife: 'bg-indigo-100 text-indigo-800',
  trail: 'bg-emerald-100 text-emerald-800',
  getaway: 'bg-sky-100 text-sky-800',
  'road-trip': 'bg-orange-100 text-orange-800',
};

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

export function ExpeditionCard({
  expedition,
  onClick,
  isUnlocked,
  isCompleted,
}: ExpeditionCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48">
        <img
          src={expedition.photo.url}
          alt={expedition.title}
          className="w-full h-full object-cover"
        />
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            ✓ Completed
          </div>
        )}
        {isUnlocked && !isCompleted && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            🔓 Unlocked
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{expedition.title}</h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{expedition.description}</p>

        {/* Location */}
        <p className="text-sm text-gray-500 mb-3">
          📍 {expedition.location.city}, {expedition.location.address}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[expedition.tag]}`}
          >
            {expedition.tag.replace('-', ' ')}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[expedition.difficulty]}`}
          >
            {expedition.difficulty}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {expedition.points} pts
          </span>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>🔓 {expedition.unlockCount} unlocked</span>
          <span>✓ {expedition.completionCount} completed</span>
        </div>
      </div>
    </div>
  );
}
