import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Expedition } from '../../shared/types/expeditions';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icon in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-expect-error - Leaflet expects _getIconUrl but it's not in types
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

type ExpeditionMapProps = {
  expeditions: Expedition[];
  onMarkerClick: (expedition: Expedition) => void;
  center?: [number, number];
  zoom?: number;
};

export function ExpeditionMap({
  expeditions,
  onMarkerClick,
  center = [19.0760, 72.8777], // Default to Mumbai
  zoom = 12,
}: ExpeditionMapProps) {
  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {expeditions.map(expedition => (
          <Marker
            key={expedition.id}
            position={[expedition.location.coordinates.lat, expedition.location.coordinates.lng]}
            eventHandlers={{
              click: () => onMarkerClick(expedition),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">{expedition.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{expedition.location.address}</p>
                <button
                  onClick={() => onMarkerClick(expedition)}
                  className="text-xs bg-orange-600 text-white px-2 py-1 rounded"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

