import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

let SelectedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

let OriginIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

const resorts = [
  // MAINE - Alpine
  { name: "Lost Valley", location: "Auburn, ME", lat: 44.1094, lng: -70.2839, vertical: 240, trails: 15, night: true, xc: false, driveTime: 60, website: "https://www.lostvalleyski.com" },
  { name: "Mt. Abram", location: "Greenwood, ME", lat: 44.3906, lng: -70.7042, vertical: 1150, trails: 44, night: false, xc: false, driveTime: 90, website: "https://www.mtabram.com" },
  { name: "Black Mountain of Maine", location: "Rumford, ME", lat: 44.4689, lng: -70.5467, vertical: 1380, trails: 50, night: true, xc: false, driveTime: 100, website: "https://www.skiblackmountain.com" },
  { name: "Camden Snow Bowl", location: "Camden, ME", lat: 44.2164, lng: -69.1058, vertical: 950, trails: 20, night: false, xc: false, driveTime: 95, website: "https://www.camdensnowbowl.com" },
  { name: "Big Moose Mountain", location: "Greenville, ME", lat: 45.4631, lng: -69.5903, vertical: 600, trails: 18, night: false, xc: false, driveTime: 165, website: "https://www.bigmoosemountain.com" },
  { name: "Saddleback", location: "Rangeley, ME", lat: 44.9367, lng: -70.5031, vertical: 2028, trails: 68, night: false, xc: false, driveTime: 165, website: "https://www.saddlebackmaine.com" },
  { name: "Big Rock", location: "Mars Hill, ME", lat: 46.5331, lng: -67.8728, vertical: 980, trails: 50, night: true, xc: false, driveTime: 300, website: "https://www.bigrockmaine.com" },

  // NEW HAMPSHIRE - Alpine
  { name: "McIntyre Ski Area", location: "Manchester, NH", lat: 42.9739, lng: -71.4903, vertical: 175, trails: 8, night: true, xc: false, driveTime: 70, website: "https://www.mcintyreskiarea.com" },
  { name: "Pats Peak", location: "Henniker, NH", lat: 43.1653, lng: -71.9036, vertical: 770, trails: 28, night: true, xc: false, driveTime: 85, website: "https://www.patspeak.com" },
  { name: "Ragged Mountain", location: "Danbury, NH", lat: 43.4881, lng: -71.8464, vertical: 1250, trails: 57, night: false, xc: false, driveTime: 100, website: "https://www.raggedmountainresort.com" },
  { name: "Whaleback Mountain", location: "Enfield, NH", lat: 43.6017, lng: -72.1802, vertical: 700, trails: 30, night: true, xc: false, driveTime: 115, website: "https://www.whaleback.com" },
  { name: "Dartmouth Skiway", location: "Lyme, NH", lat: 43.7869, lng: -72.1008, vertical: 968, trails: 32, night: false, xc: false, driveTime: 125, website: "https://www.skiway.dartmouth.edu" },
  { name: "Tenney Mountain", location: "Plymouth, NH", lat: 43.7667, lng: -71.7167, vertical: 1400, trails: 45, night: false, xc: false, driveTime: 115, website: "https://www.tenneymtn.com" },
  { name: "Waterville Valley", location: "Waterville Valley, NH", lat: 43.9503, lng: -71.5281, vertical: 2020, trails: 50, night: false, xc: false, driveTime: 160, website: "https://www.waterville.com" },
  { name: "Cannon Mountain", location: "Franconia, NH", lat: 44.1773, lng: -71.7015, vertical: 2180, trails: 97, night: false, xc: false, driveTime: 170, website: "https://www.cannonmt.com" },
  { name: "Black Mountain NH", location: "Jackson, NH", lat: 44.1453, lng: -71.1539, vertical: 1100, trails: 45, night: false, xc: false, driveTime: 115, website: "https://www.blackmt.com" },

  // VERMONT - Alpine
  { name: "Magic Mountain", location: "Londonderry, VT", lat: 43.2003, lng: -72.7781, vertical: 1600, trails: 50, night: false, xc: false, driveTime: 150, website: "https://www.magicmtn.com" },
  { name: "Saskadena Six", location: "Pomfret, VT", lat: 43.7047, lng: -72.5089, vertical: 650, trails: 30, night: false, xc: false, driveTime: 145, website: "https://www.saskadenasix.com" },
  { name: "Middlebury Snow Bowl", location: "Hancock, VT", lat: 43.9383, lng: -72.9261, vertical: 1020, trails: 17, night: false, xc: false, driveTime: 175, website: "https://www.middleburysnowbowl.com" },
  { name: "Bolton Valley", location: "Bolton, VT", lat: 44.4317, lng: -72.8503, vertical: 1704, trails: 71, night: true, xc: true, driveTime: 195, website: "https://www.boltonvalley.com" },
  { name: "Jay Peak", location: "Jay, VT", lat: 44.9378, lng: -72.5078, vertical: 2153, trails: 81, night: false, xc: false, driveTime: 270, website: "https://www.jaypeakresort.com" },
  { name: "Burke Mountain", location: "East Burke, VT", lat: 44.5750, lng: -71.9003, vertical: 2011, trails: 50, night: false, xc: false, driveTime: 200, website: "https://www.skiburke.com" },

  // MASSACHUSETTS
  { name: "Berkshire East", location: "Charlemont, MA", lat: 42.6253, lng: -72.8878, vertical: 1180, trails: 45, night: true, xc: false, driveTime: 165, website: "https://www.berkshireeast.com" },
  { name: "Catamount", location: "South Egremont, MA", lat: 42.1689, lng: -73.4817, vertical: 1000, trails: 36, night: true, xc: false, driveTime: 210, website: "https://www.catamountski.com" },
  { name: "Bousquet", location: "Pittsfield, MA", lat: 42.4428, lng: -73.2786, vertical: 750, trails: 24, night: true, xc: false, driveTime: 195, website: "https://www.bousquets.com" },

  // QUEBEC - Eastern Townships
  { name: "Mont Sutton", location: "Sutton, QC", lat: 45.1044, lng: -72.5611, vertical: 1509, trails: 60, night: false, xc: false, driveTime: 280, website: "https://www.montsutton.com" },
  { name: "Owls Head", location: "Mansonville, QC", lat: 45.0478, lng: -72.2506, vertical: 1770, trails: 50, night: false, xc: false, driveTime: 290, website: "https://www.owlshead.com" },
  // QUEBEC - South of Quebec City
  { name: "Massif du Sud", location: "Saint-Philémon, QC", lat: 46.6833, lng: -70.4833, vertical: 1686, trails: 37, night: false, xc: false, driveTime: 345, website: "https://www.massifdusud.com" },
  // QUEBEC - Laurentians
  { name: "Mont Habitant", location: "Saint-Sauveur, QC", lat: 45.9167, lng: -74.1500, vertical: 600, trails: 43, night: true, xc: false, driveTime: 320, website: "https://www.monthabitant.com" },
  { name: "Ski Vallée Bleue", location: "Val-David, QC", lat: 46.0333, lng: -74.2167, vertical: 350, trails: 52, night: false, xc: false, driveTime: 330, website: "https://www.valleebleue.com" },
  { name: "Mont Rigaud", location: "Rigaud, QC", lat: 45.4667, lng: -74.3167, vertical: 394, trails: 15, night: true, xc: false, driveTime: 406, website: "https://www.montrigaud.com" },
  // QUEBEC - Ottawa area
  { name: "Camp Fortune", location: "Chelsea, QC", lat: 45.5167, lng: -75.8333, vertical: 627, trails: 27, night: true, xc: false, driveTime: 390, website: "https://www.campfortune.com" },
  { name: "Centre Vorlage", location: "Wakefield, QC", lat: 45.6500, lng: -75.9167, vertical: 509, trails: 18, night: true, xc: false, driveTime: 400, website: "https://www.vorlage.ca" },

  // NOVA SCOTIA
  { name: "Cape Smokey", location: "Ingonish Beach, NS", lat: 46.6167, lng: -60.6500, vertical: 1000, trails: 16, night: false, xc: false, driveTime: 660, website: "https://www.capesmokey.ca" },
];

const IndyPassMap = () => {
  const [selectedResort, setSelectedResort] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  // Mobile UX state
  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileView, setMobileView] = useState('map'); // 'map' | 'list'

  // Initialize from localStorage or default to Portland, ME
  const [origin, setOrigin] = useState(() => {
    return localStorage.getItem('indyPassOrigin') || 'Portland, ME';
  });
  const [tempOrigin, setTempOrigin] = useState(() => {
    return localStorage.getItem('indyPassOrigin') || 'Portland, ME';
  });
  const [originCoords, setOriginCoords] = useState(null);
  const [resortsWithTimes, setResortsWithTimes] = useState(resorts);
  const [isCalculating, setIsCalculating] = useState(false);

  // Refs for markers to control popups
  const markerRefs = React.useRef({});
  // Ref for list container to handle scrolling
  const listRef = React.useRef(null);

  // Handle selection changes (scroll to item and open popup)
  React.useEffect(() => {
    if (selectedResort) {
      // 1. Scroll list to item (if list is visible)
      const listItem = document.getElementById(`resort-item-${selectedResort.name}`);
      if (listItem) {
        listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // 2. Open popup on map
      const marker = markerRefs.current[selectedResort.name];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedResort]);

  // Save to localStorage whenever origin changes
  React.useEffect(() => {
    localStorage.setItem('indyPassOrigin', origin);

    // Simple geocoding
    const geocodeOrigin = async () => {
      if (!origin) return;
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(origin)}`);
        const data = await response.json();
        if (data && data.length > 0) {
          setOriginCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (error) {
        console.error("Failed to geocode origin:", error);
      }
    };

    geocodeOrigin();
  }, [origin]);

  // Calculate drive times when originCoords changes
  React.useEffect(() => {
    if (!originCoords) return;

    const calculateTimes = async () => {
      // Check cache first
      const cachedData = localStorage.getItem('indyPassDriveTimes_v5');
      if (cachedData) {
        try {
          const { origin: cachedOrigin, resorts: cachedResorts } = JSON.parse(cachedData);
          if (cachedOrigin === origin) {
            setResortsWithTimes(cachedResorts);
            return; // Use cache and skip fetch
          }
        } catch (e) {
          console.error("Failed to parse cached drive times", e);
        }
      }

      setIsCalculating(true);

      try {
        // Prepare coordinates string: origin;resort1;resort2...
        // Format: lng,lat
        const coordinates = [
          `${originCoords[1]},${originCoords[0]}`, // Origin is first
          ...resorts.map(r => `${r.lng},${r.lat}`)
        ].join(';');

        // Use Table API
        // sources=0 means calculate from the 0th coordinate (origin) to all others
        const url = `https://router.project-osrm.org/table/v1/driving/${coordinates}?sources=0`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.durations && data.durations[0]) {
          const updatedResorts = [...resorts];
          // data.durations[0] contains array of durations from origin to each point
          // The first element is origin->origin (0), subsequent are origin->resorts
          const durations = data.durations[0];

          updatedResorts.forEach((resort, index) => {
            // durations array includes the origin itself at index 0, so resort i corresponds to durations[i+1]
            const durationSeconds = durations[index + 1];
            if (durationSeconds !== null) {
              resort.driveTime = adjustDriveTime(Math.round(durationSeconds / 60));
            }
          });

          setResortsWithTimes(updatedResorts);

          // Save to cache
          localStorage.setItem('indyPassDriveTimes_v5', JSON.stringify({
            origin: origin,
            resorts: updatedResorts
          }));
        }
      } catch (error) {
        console.error("Failed to fetch drive times:", error);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateTimes();
  }, [originCoords]);


  // NOTE: In the actual file, the resorts array definition is here.
  // We need to make sure we don't shadow it or cause issues.
  // Actually, let's move the resorts definition OUT of the component or use useMemo so it doesn't re-create.
  // For this edit, I will assume the resorts array is static and I can just reference it.
  // Wait, I need to be careful about the variable names.
  // The original code has `const resorts = [...]`.
  // I should rename the static list to `staticResorts` or similar, and initialize state with it.

  // Adjust OSM drive times to better match real-world driving
  // OSM uses posted speed limits which overestimate by ~22%
  const adjustDriveTime = (osmMinutes) => {
    return Math.round(osmMinutes * 0.78);
  };

  const getTimeColor = (minutes) => {
    if (minutes <= 60) return '#22c55e';
    if (minutes <= 120) return '#eab308';
    if (minutes <= 180) return '#f97316';
    return '#ef4444';
  };

  const formatDriveTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const filteredResorts = useMemo(() => {
    let filtered = [...resortsWithTimes];

    if (filter === 'under2') filtered = filtered.filter(r => r.driveTime <= 120);
    else if (filter === 'under3') filtered = filtered.filter(r => r.driveTime <= 180);
    else if (filter === 'night') filtered = filtered.filter(r => r.night);
    else if (filter === 'vertical') filtered = filtered.filter(r => r.vertical >= 1000);
    else if (filter === 'alpine') filtered = filtered.filter(r => !r.xc);
    else if (filter === 'xc') filtered = filtered.filter(r => r.xc);

    if (sortBy === 'distance') filtered.sort((a, b) => a.driveTime - b.driveTime);
    else if (sortBy === 'vertical') filtered.sort((a, b) => b.vertical - a.vertical);
    else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [filter, sortBy, resortsWithTimes]);

  const getGoogleMapsUrl = (resort) => {
    const destination = encodeURIComponent(`${resort.name}, ${resort.location}`);
    const originParam = encodeURIComponent(origin);
    return `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destination}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-2 md:p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-center">
          Indy Pass - New England & Eastern Canada
          {isCalculating && <span className="ml-2 text-sm font-normal text-yellow-400 animate-pulse">(Calculating...)</span>}
        </h1>

        {/* Origin Input */}
        <div className="bg-blue-900 border-2 border-blue-500 rounded-lg p-2 md:p-4 mb-2 md:mb-4">
          {/* Mobile: Collapsed view */}
          <div className="md:hidden">
            <button
              onClick={() => setHeaderExpanded(!headerExpanded)}
              className="w-full flex justify-between items-center min-h-[44px] px-2"
            >
              <span className="text-sm text-blue-200">📍 From: <strong className="text-white">{origin}</strong></span>
              <span className="text-blue-300 text-lg">{headerExpanded ? '▲' : '▼'}</span>
            </button>
            {headerExpanded && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={tempOrigin}
                  onChange={(e) => setTempOrigin(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setOrigin(tempOrigin)}
                  placeholder="Enter your address or city"
                  className="flex-1 bg-white text-gray-900 border-2 border-blue-400 rounded px-3 py-3 text-base font-medium min-h-[44px]"
                />
                <button
                  onClick={() => { setOrigin(tempOrigin); setHeaderExpanded(false); }}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded text-base font-bold min-h-[44px]"
                >
                  Update
                </button>
              </div>
            )}
          </div>

          {/* Desktop: Always expanded */}
          <div className="hidden md:block">
            <label className="block text-sm font-semibold text-blue-200 mb-2">📍 Starting Location (for Google Maps directions)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tempOrigin}
                onChange={(e) => setTempOrigin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setOrigin(tempOrigin)}
                placeholder="Enter your address or city"
                className="flex-1 bg-white text-gray-900 border-2 border-blue-400 rounded px-3 py-2 text-sm font-medium"
              />
              <button
                onClick={() => setOrigin(tempOrigin)}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm font-bold"
              >
                Update
              </button>
            </div>
            <p className="text-sm text-blue-300 mt-2">Current origin: <strong>{origin}</strong></p>
          </div>
        </div>

        {/* Filters - Mobile */}
        <div className="md:hidden flex items-center gap-2 mb-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-slate-700 px-4 min-h-[44px] rounded flex items-center gap-2"
          >
            <span>Filters</span>
            {filter !== 'all' && <span className="bg-blue-600 px-2 py-0.5 rounded text-xs">1</span>}
          </button>
          {/* Compact legend dots */}
          <div className="flex gap-1.5 items-center">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
          <span className="text-slate-400 text-sm ml-auto">{filteredResorts.length} resorts</span>
        </div>

        {/* Mobile filter dropdown */}
        {showFilters && (
          <div className="md:hidden bg-slate-800 rounded-lg p-3 mb-2 space-y-2">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 min-h-[44px] text-base">
              <option value="all">All Resorts</option>
              <option value="alpine">Alpine Only</option>
              <option value="xc">XC Only</option>
              <option value="under2">Under 2 Hours</option>
              <option value="under3">Under 3 Hours</option>
              <option value="night">Night Skiing</option>
              <option value="vertical">1000+ ft Vert</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 min-h-[44px] text-base">
              <option value="distance">By Drive Time</option>
              <option value="vertical">By Vertical</option>
              <option value="name">By Name</option>
            </select>
          </div>
        )}

        {/* Filters - Desktop */}
        <div className="hidden md:flex flex-wrap gap-3 mb-3 items-center text-sm">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-slate-800 border border-slate-600 rounded px-2 py-1">
            <option value="all">All Resorts</option>
            <option value="alpine">Alpine Only</option>
            <option value="xc">XC Only</option>
            <option value="under2">Under 2 Hours</option>
            <option value="under3">Under 3 Hours</option>
            <option value="night">Night Skiing</option>
            <option value="vertical">1000+ ft Vert</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-slate-800 border border-slate-600 rounded px-2 py-1">
            <option value="distance">By Drive Time</option>
            <option value="vertical">By Vertical</option>
            <option value="name">By Name</option>
          </select>
          <span className="text-slate-400">{filteredResorts.length} resorts</span>
        </div>

        {/* Legend - Desktop */}
        <div className="hidden md:flex flex-wrap gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>&lt;1h</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span>1-2h</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span>2-3h</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div><span>3+h</span></div>
          <div className="flex items-center gap-1 ml-2"><div className="w-3 h-3 rounded-full border-2 border-white"></div><span>XC</span></div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden flex mb-2 bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setMobileView('map')}
            className={`flex-1 py-3 rounded-md text-sm font-medium min-h-[44px] transition-colors ${
              mobileView === 'map'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setMobileView('list')}
            className={`flex-1 py-3 rounded-md text-sm font-medium min-h-[44px] transition-colors ${
              mobileView === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            List ({filteredResorts.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Map */}
          <div className={`bg-slate-800 rounded-lg p-1 h-[300px] lg:h-[400px] overflow-hidden relative z-0 ${
            mobileView !== 'map' ? 'hidden lg:block' : ''
          }`}>
            <MapContainer center={[44.5, -70]} zoom={6} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {originCoords && (
                <Marker position={originCoords} icon={OriginIcon}>
                  <Popup>
                    <strong>Start: {origin}</strong>
                  </Popup>
                </Marker>
              )}
              {filteredResorts.map((resort, idx) => (
                <Marker
                  key={idx}
                  position={[resort.lat, resort.lng]}
                  icon={selectedResort?.name === resort.name ? SelectedIcon : DefaultIcon}
                  ref={(ref) => markerRefs.current[resort.name] = ref}
                  eventHandlers={{
                    click: () => setSelectedResort(resort),
                  }}
                >
                  <Popup>
                    <strong>{resort.name}</strong><br />
                    {formatDriveTime(resort.driveTime)}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Resort List */}
          <div className={`bg-slate-800 rounded-lg p-3 h-[300px] lg:h-auto lg:max-h-[400px] overflow-y-auto ${
            mobileView !== 'list' ? 'hidden lg:block' : ''
          }`} ref={listRef}>
            <div className="space-y-1.5">
              {filteredResorts.map((resort, idx) => (
                <div
                  key={idx}
                  id={`resort-item-${resort.name}`}
                  className={`p-2 py-3 md:py-2 rounded cursor-pointer text-sm min-h-[48px] md:min-h-0 ${selectedResort?.name === resort.name ? 'bg-slate-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                  onClick={() => setSelectedResort(resort)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{resort.name}</span>
                      {resort.xc && <span className="ml-1 text-xs bg-blue-600 px-1 rounded">XC</span>}
                      {resort.night && <span className="ml-1 text-xs bg-purple-600 px-1 rounded">Night</span>}
                      <div className="text-xs text-slate-400">{resort.location}</div>
                    </div>
                    <div className="font-bold" style={{ color: getTimeColor(resort.driveTime) }}>
                      {formatDriveTime(resort.driveTime)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Resort Detail - Desktop */}
        {selectedResort && (
          <div className="hidden lg:block mt-4 bg-slate-800 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{selectedResort.name}</h2>
                <p className="text-slate-400 text-sm">{selectedResort.location}</p>
              </div>
              <button onClick={() => setSelectedResort(null)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-3">
              <div className="bg-slate-700 rounded p-2">
                <div className="text-slate-400 text-xs">Drive Time</div>
                <div className="text-lg font-bold" style={{ color: getTimeColor(selectedResort.driveTime) }}>
                  {formatDriveTime(selectedResort.driveTime)}
                </div>
              </div>
              {!selectedResort.xc && (
                <>
                  <div className="bg-slate-700 rounded p-2">
                    <div className="text-slate-400 text-xs">Vertical</div>
                    <div className="text-lg font-bold">{selectedResort.vertical}'</div>
                  </div>
                  <div className="bg-slate-700 rounded p-2">
                    <div className="text-slate-400 text-xs">Trails</div>
                    <div className="text-lg font-bold">{selectedResort.trails}</div>
                  </div>
                </>
              )}
              <div className="bg-slate-700 rounded p-2">
                <div className="text-slate-400 text-xs">Features</div>
                <div className="text-sm">
                  {selectedResort.xc ? 'Cross-Country' : selectedResort.night ? 'Night Skiing' : 'Day only'}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <a href={selectedResort.website} target="_blank" rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium">
                Website
              </a>
              <a href={getGoogleMapsUrl(selectedResort)} target="_blank" rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-medium">
                Directions
              </a>
            </div>
          </div>
        )}

        {/* Selected Resort Detail - Mobile Bottom Sheet */}
        {selectedResort && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelectedResort(null)}
            />

            {/* Sheet */}
            <div className="absolute inset-x-0 bottom-0 bg-slate-800 rounded-t-2xl p-4 pb-8 max-h-[70vh] overflow-y-auto">
              {/* Drag handle */}
              <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4" />

              {/* Close button */}
              <button
                onClick={() => setSelectedResort(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white text-2xl"
                aria-label="Close"
              >
                ×
              </button>

              {/* Content */}
              <div>
                <h2 className="text-xl font-bold">{selectedResort.name}</h2>
                <p className="text-slate-400 text-sm">{selectedResort.location}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-700 rounded p-3">
                  <div className="text-slate-400 text-xs">Drive Time</div>
                  <div className="text-lg font-bold" style={{ color: getTimeColor(selectedResort.driveTime) }}>
                    {formatDriveTime(selectedResort.driveTime)}
                  </div>
                </div>
                {!selectedResort.xc && (
                  <>
                    <div className="bg-slate-700 rounded p-3">
                      <div className="text-slate-400 text-xs">Vertical</div>
                      <div className="text-lg font-bold">{selectedResort.vertical}'</div>
                    </div>
                    <div className="bg-slate-700 rounded p-3">
                      <div className="text-slate-400 text-xs">Trails</div>
                      <div className="text-lg font-bold">{selectedResort.trails}</div>
                    </div>
                  </>
                )}
                <div className="bg-slate-700 rounded p-3">
                  <div className="text-slate-400 text-xs">Features</div>
                  <div className="text-sm">
                    {selectedResort.xc ? 'Cross-Country' : selectedResort.night ? 'Night Skiing' : 'Day only'}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                <a
                  href={selectedResort.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded text-sm font-medium text-center min-h-[48px] flex items-center justify-center"
                >
                  Website
                </a>
                <a
                  href={getGoogleMapsUrl(selectedResort)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-3 rounded text-sm font-medium text-center min-h-[48px] flex items-center justify-center"
                >
                  Directions
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-center text-xs text-slate-500">
          Drive times estimated from {origin}. Click "Directions" for accurate routing. | Indy Pass 2025-26
        </div>
      </div>
    </div>
  );
};

export default IndyPassMap;