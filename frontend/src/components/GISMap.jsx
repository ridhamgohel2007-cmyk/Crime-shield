import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation } from 'lucide-react';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different crime types
const createIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

const icons = {
  Theft: createIcon('#3b82f6'),
  Assault: createIcon('#ef4444'),
  Fraud: createIcon('#f59e0b'),
  Cyber: createIcon('#8b5cf6'),
  Vandalism: createIcon('#10b981')
};

// Custom icons for POIs
const createPoiIcon = (color, emoji) => {
  return new L.DivIcon({
    className: 'custom-poi-icon',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px;">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const poiIcons = {
  petrol_pump: createPoiIcon('#10b981', '⛽'),
  hospital: createPoiIcon('#ef4444', '🏥'),
  police_station: createPoiIcon('#3b82f6', '👮')
};

// User Location pulsing icon
const userIcon = new L.DivIcon({
  className: 'custom-user-icon',
  html: `<div style="position: relative; display: flex; align-items: center; justify-content: center;">
    <div style="position: absolute; width: 24px; height: 24px; background-color: rgba(6, 182, 212, 0.4); border-radius: 50%; animation: pulse-user 1.5s infinite;"></div>
    <div style="position: absolute; width: 12px; height: 12px; background-color: var(--accent-cyan); border: 2px solid white; border-radius: 50%; box-shadow: 0 0 6px rgba(0,0,0,0.5);"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Component to handle map center/zoom changes dynamically
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Ahmedabad Coordinates
const AHMEDABAD_CENTER = [23.0225, 72.5714];

// Helper to generate POIs dynamically around a center coordinate
const generateNearbyPOIs = (center, type) => {
  const names = {
    petrol_pump: ["HP Fuel Station", "Indian Oil Outlet", "Bharat Petroleum Center", "Shell Petrol Pump"],
    hospital: ["Apex Multi-specialty Hospital", "City Care Clinic", "Lifeline Hospital", "Metro General Hospital"],
    police_station: ["Sector 1 Police Headquarters", "Local Precinct Station", "Crime Prevention Division", "Traffic Police Booth"]
  };

  return Array.from({ length: 3 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 0.003 + Math.random() * 0.01; // 300m to 1km radius
    return {
      id: `${type}-${i}-${Date.now()}`,
      name: `${names[type][i % names[type].length]} ${i + 1}`,
      lat: center[0] + Math.sin(angle) * distance,
      lng: center[1] + Math.cos(angle) * distance,
      type: type
    };
  });
};

// Ahmedabad Zone Coordinates Map
const ZONE_COORDS = {
  "Navrangpura": [23.0373, 72.5615],
  "Vastrapur": [23.0350, 72.5293],
  "Maninagar": [22.9978, 72.6109],
  "Bapunagar": [23.0401, 72.6283],
  "Satellite": [23.0231, 72.5308],
  "Paldi": [23.0125, 72.5595],
  "Ghatlodia": [23.0674, 72.5447],
  "SG Highway": [23.0225, 72.5050]
};



export default function GISMap({ theme = 'light', highlightedZone = null, severityFilter = { critical: true, moderate: true, low: true } }) {
  const [incidents, setIncidents] = useState([]);
  const [mapCenter, setMapCenter] = useState(AHMEDABAD_CENTER);
  const [mapZoom, setMapZoom] = useState(13);
  const [userLocation, setUserLocation] = useState(null);
  const [pois, setPois] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    petrol_pump: false,
    hospital: false,
    police_station: false
  });
  
  // Simulated data load for incidents
  useEffect(() => {
    const mockData = Array.from({ length: 50 }).map((_, i) => {
      const types = ['Theft', 'Assault', 'Fraud', 'Cyber', 'Vandalism'];
      return {
        id: i,
        lat: 22.95 + Math.random() * 0.15,
        lng: 72.5 + Math.random() * 0.15,
        type: types[Math.floor(Math.random() * types.length)],
        severity: Math.floor(Math.random() * 5) + 1,
        time: new Date(Date.now() - Math.random() * 86400000).toLocaleTimeString()
      };
    });
    setIncidents(mockData);
  }, []);

  // Update POIs if the mapCenter changes and filters are active
  useEffect(() => {
    let updatedPois = [];
    Object.keys(activeFilters).forEach(type => {
      if (activeFilters[type]) {
        updatedPois = [...updatedPois, ...generateNearbyPOIs(mapCenter, type)];
      }
    });
    setPois(updatedPois);
  }, [mapCenter]);

  // Zoom and center on the specific highlighted zone when it changes
  useEffect(() => {
    if (highlightedZone && ZONE_COORDS[highlightedZone]) {
      setMapCenter(ZONE_COORDS[highlightedZone]);
      setMapZoom(14);
    }
  }, [highlightedZone]);

  const toggleFilter = (type) => {
    setActiveFilters(prev => {
      const updated = { ...prev, [type]: !prev[type] };
      
      if (updated[type]) {
        const newPOIs = generateNearbyPOIs(mapCenter, type);
        setPois(old => [...old.filter(p => p.type !== type), ...newPOIs]);
      } else {
        setPois(old => old.filter(p => p.type !== type));
      }
      
      return updated;
    });
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMapZoom(15);
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not access your location. Centering on default coordinates.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // Filter incidents based on severityFilter
  const filteredIncidents = incidents.filter(incident => {
    // severity: 1-2 = low, 3-4 = moderate, 5 = critical
    if (incident.severity === 5) return severityFilter.critical;
    if (incident.severity === 3 || incident.severity === 4) return severityFilter.moderate;
    return severityFilter.low;
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer 
        center={AHMEDABAD_CENTER} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        
        {/* Dynamic theme map tiles */}
        <TileLayer
          key={theme} // Force re-render when theme changes
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render Incidents */}
        {filteredIncidents.map((incident) => (
          <Marker 
            key={incident.id} 
            position={[incident.lat, incident.lng]}
            icon={icons[incident.type]}
          >
            <Popup>
              <div style={{ padding: '4px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>{incident.type}</h4>
                <p style={{ margin: '0 0 2px 0', fontSize: '12px' }}>Severity: {incident.severity}/5</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Time: {incident.time}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render User Current Location */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div style={{ padding: '4px' }}>
                <h4 style={{ margin: 0, color: '#1e293b' }}>Your Location</h4>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Render POIs (Petrol Pumps, Hospitals, Police Stations) */}
        {pois.map((poi) => (
          <Marker 
            key={poi.id} 
            position={[poi.lat, poi.lng]}
            icon={poiIcons[poi.type]}
          >
            <Popup>
              <div style={{ padding: '4px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>{poi.name}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', textTransform: 'capitalize' }}>Type: {poi.type.replace('_', ' ')}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Mock Hotspot Zones */}
        <Circle center={[23.03, 72.56]} radius={2000} pathOptions={{ color: '#ef4444', weight: 2, dashArray: '5, 5', fillColor: '#ef4444', fillOpacity: 0.12 }} />
        <Circle center={[22.99, 72.60]} radius={1500} pathOptions={{ color: '#f59e0b', weight: 2, dashArray: '5, 5', fillColor: '#f59e0b', fillOpacity: 0.12 }} />

        {/* Dynamic Highlighted Zone Overlay */}
        {highlightedZone && ZONE_COORDS[highlightedZone] && (
          <>
            <Circle 
              center={ZONE_COORDS[highlightedZone]} 
              radius={1800} 
              pathOptions={{ 
                color: '#22d3ee', 
                fillColor: '#22d3ee', 
                fillOpacity: 0.35,
                weight: 4,
                dashArray: '5, 5'
              }} 
            />
            <Circle 
              center={ZONE_COORDS[highlightedZone]} 
              radius={2200} 
              pathOptions={{ 
                color: '#22d3ee', 
                fillColor: 'transparent', 
                weight: 1.5,
                dashArray: '3, 6'
              }} 
            />
          </>
        )}

      </MapContainer>

      {/* Floating Toolbar at the bottom-right */}
      <div className="map-toolbar" style={{
        position: 'absolute',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 1000,
        display: 'flex',
        gap: '0.75rem',
        pointerEvents: 'auto'
      }}>
        {/* Locate Me */}
        <button 
          onClick={handleLocateMe}
          title="Locate Me"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--bg-panel)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-panel)'}
        >
          <Navigation size={18} style={{ transform: 'rotate(45deg)' }} />
        </button>

        {/* Petrol Station POI Filter */}
        <button 
          onClick={() => toggleFilter('petrol_pump')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0 1rem',
            height: '42px',
            borderRadius: '21px',
            background: activeFilters.petrol_pump ? 'rgba(16, 185, 129, 0.25)' : 'var(--bg-panel)',
            backdropFilter: 'blur(20px)',
            border: activeFilters.petrol_pump ? '1.5px solid var(--accent-green)' : '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s'
          }}
        >
          <span>⛽</span>
          <span>Petrol</span>
        </button>

        {/* Hospital POI Filter */}
        <button 
          onClick={() => toggleFilter('hospital')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0 1rem',
            height: '42px',
            borderRadius: '21px',
            background: activeFilters.hospital ? 'rgba(239, 68, 68, 0.25)' : 'var(--bg-panel)',
            backdropFilter: 'blur(20px)',
            border: activeFilters.hospital ? '1.5px solid var(--accent-red)' : '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s'
          }}
        >
          <span>🏥</span>
          <span>Hospital</span>
        </button>

        {/* Police Station POI Filter */}
        <button 
          onClick={() => toggleFilter('police_station')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0 1rem',
            height: '42px',
            borderRadius: '21px',
            background: activeFilters.police_station ? 'rgba(59, 130, 246, 0.25)' : 'var(--bg-panel)',
            backdropFilter: 'blur(20px)',
            border: activeFilters.police_station ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-color)',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s'
          }}
        >
          <span>👮</span>
          <span>Police</span>
        </button>
      </div>
    </div>
  );
}
