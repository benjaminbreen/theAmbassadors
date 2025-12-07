import React, { useState, useEffect } from 'react';
import { LucideX, LucideExternalLink, LucideMapPin, LucideBookOpen } from 'lucide-react';
import { Zone } from '../types';

interface LocationModalProps {
  zone: Zone;
  onClose: () => void;
}

// Wikipedia URL mappings for locations
const LOCATION_WIKIPEDIA_DATA: Record<string, {
  url: string;
  frenchUrl?: string;
  historicalNote: string;
  yearBuilt?: string;
  architect?: string;
}> = {
  // Main Exposition areas
  'Champ de Mars': {
    url: 'https://en.wikipedia.org/wiki/Champ_de_Mars',
    historicalNote: 'The vast parade ground stretching from the Eiffel Tower to the École Militaire served as the main exhibition grounds for the 1889 Exposition.',
    yearBuilt: '18th century',
  },
  'Eiffel Tower': {
    url: 'https://en.wikipedia.org/wiki/Eiffel_Tower',
    historicalNote: 'Constructed as the entrance arch to the 1889 World\'s Fair, Gustave Eiffel\'s iron lattice tower was initially criticized but became the most iconic symbol of Paris.',
    yearBuilt: '1887-1889',
    architect: 'Gustave Eiffel',
  },
  'Palais du Trocadéro': {
    url: 'https://en.wikipedia.org/wiki/Trocad%C3%A9ro_Palace',
    historicalNote: 'The Moorish-Byzantine palace was built for the 1878 Exposition and served as the dramatic backdrop across the Seine for the 1889 fair. It housed concerts and exhibitions.',
    yearBuilt: '1878',
    architect: 'Gabriel Davioud',
  },
  'Trocadéro': {
    url: 'https://en.wikipedia.org/wiki/Trocad%C3%A9ro_Palace',
    historicalNote: 'The Moorish-Byzantine palace was built for the 1878 Exposition and served as the dramatic backdrop across the Seine for the 1889 fair.',
    yearBuilt: '1878',
    architect: 'Gabriel Davioud',
  },
  'Aquarium du Trocadéro': {
    url: 'https://en.wikipedia.org/wiki/Aquarium_de_Paris',
    frenchUrl: 'https://fr.wikipedia.org/wiki/Aquarium_de_Paris_-_Cin%C3%A9aqua',
    historicalNote: 'One of the world\'s first public aquariums, built into the gardens of the Trocadéro for the 1878 Exposition and expanded for 1889.',
    yearBuilt: '1878',
  },
  'Galerie des Machines': {
    url: 'https://en.wikipedia.org/wiki/Galerie_des_machines',
    historicalNote: 'The largest building at the Exposition, spanning 420 meters without interior supports. Its revolutionary iron and glass construction showcased the era\'s industrial achievements.',
    yearBuilt: '1889',
    architect: 'Ferdinand Dutert',
  },
  'Rue du Caire': {
    url: 'https://en.wikipedia.org/wiki/Exposition_Universelle_(1889)#Colonial_exhibits',
    historicalNote: 'A reconstructed Egyptian street complete with shops, cafés, and donkey rides. Local craftsmen were brought from Cairo to demonstrate traditional arts.',
    yearBuilt: '1889 (temporary)',
  },
  'Village Javanais': {
    url: 'https://en.wikipedia.org/wiki/Exposition_Universelle_(1889)#Colonial_exhibits',
    historicalNote: 'A recreated Javanese village where Indonesian performers presented traditional music and dance, profoundly influencing composers like Debussy.',
    yearBuilt: '1889 (temporary)',
  },
  'Esplanade des Invalides': {
    url: 'https://en.wikipedia.org/wiki/Esplanade_des_Invalides',
    historicalNote: 'The grand esplanade hosted the colonial exhibitions and military displays, connecting the main fair grounds to central Paris.',
  },
  'Pont d\'Iéna': {
    url: 'https://en.wikipedia.org/wiki/Pont_d%27I%C3%A9na',
    historicalNote: 'The bridge connecting the Champ de Mars to the Trocadéro provided spectacular views of both the Tower and the Palace.',
    yearBuilt: '1814',
  },
  'Porte Rapp': {
    url: 'https://en.wikipedia.org/wiki/Exposition_Universelle_(1889)#Exposition_sites',
    historicalNote: 'One of the ornate entrance gates to the Exposition grounds, named after the nearby Avenue Rapp.',
    yearBuilt: '1889 (temporary)',
  },
  'Pavillon Central': {
    url: 'https://en.wikipedia.org/wiki/Exposition_Universelle_(1889)',
    historicalNote: 'The Central Pavilion housed the main administrative offices and served as the ceremonial heart of the Exposition.',
    yearBuilt: '1889 (temporary)',
  },
  // Default fallback
  'default': {
    url: 'https://en.wikipedia.org/wiki/Exposition_Universelle_(1889)',
    historicalNote: 'The 1889 Exposition Universelle celebrated the centennial of the French Revolution and showcased France\'s industrial and colonial achievements to over 32 million visitors.',
  }
};

// Get Wikipedia data for a zone, with fuzzy matching
const getWikipediaData = (zoneName: string) => {
  // Direct match
  if (LOCATION_WIKIPEDIA_DATA[zoneName]) {
    return LOCATION_WIKIPEDIA_DATA[zoneName];
  }

  // Fuzzy match - check if zone name contains key
  for (const [key, data] of Object.entries(LOCATION_WIKIPEDIA_DATA)) {
    if (zoneName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(zoneName.toLowerCase())) {
      return data;
    }
  }

  // Check for common keywords
  const lowerName = zoneName.toLowerCase();
  if (lowerName.includes('tower') || lowerName.includes('eiffel')) {
    return LOCATION_WIKIPEDIA_DATA['Eiffel Tower'];
  }
  if (lowerName.includes('trocad')) {
    return LOCATION_WIKIPEDIA_DATA['Trocadéro'];
  }
  if (lowerName.includes('machine') || lowerName.includes('galerie')) {
    return LOCATION_WIKIPEDIA_DATA['Galerie des Machines'];
  }
  if (lowerName.includes('cairo') || lowerName.includes('caire') || lowerName.includes('egypt')) {
    return LOCATION_WIKIPEDIA_DATA['Rue du Caire'];
  }
  if (lowerName.includes('java') || lowerName.includes('indonesi')) {
    return LOCATION_WIKIPEDIA_DATA['Village Javanais'];
  }
  if (lowerName.includes('aquarium')) {
    return LOCATION_WIKIPEDIA_DATA['Aquarium du Trocadéro'];
  }

  return LOCATION_WIKIPEDIA_DATA['default'];
};

// Extract Wikipedia page title from URL
const getWikiPageTitle = (url: string): string => {
  const match = url.match(/\/wiki\/([^#]+)/);
  return match ? decodeURIComponent(match[1].replace(/_/g, ' ')) : '';
};

// Get Wikipedia API URL for extract
const getWikiApiUrl = (pageUrl: string): string => {
  const isFrench = pageUrl.includes('fr.wikipedia.org');
  const baseApi = isFrench ? 'https://fr.wikipedia.org/w/api.php' : 'https://en.wikipedia.org/w/api.php';
  const pageTitle = getWikiPageTitle(pageUrl);

  return `${baseApi}?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts|pageimages&exintro=true&explaintext=true&pithumbsize=400&format=json&origin=*`;
};

interface WikiData {
  extract: string;
  thumbnail?: string;
  title: string;
}

const LocationModal: React.FC<LocationModalProps> = ({ zone, onClose }) => {
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locationData = getWikipediaData(zone.name);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const fetchWikiData = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = getWikiApiUrl(locationData.url);
        const response = await fetch(apiUrl);
        const data = await response.json();

        const pages = data.query?.pages;
        if (pages) {
          const page = Object.values(pages)[0] as any;
          if (page && !page.missing) {
            setWikiData({
              extract: page.extract || '',
              thumbnail: page.thumbnail?.source,
              title: page.title || zone.name,
            });
          } else {
            setError('Wikipedia page not found');
          }
        }
      } catch (err) {
        console.error('Failed to fetch Wikipedia data:', err);
        setError('Failed to load Wikipedia data');
      } finally {
        setLoading(false);
      }
    };

    fetchWikiData();
  }, [zone.name, locationData.url]);

  // Truncate extract to reasonable length
  const truncatedExtract = wikiData?.extract
    ? wikiData.extract.length > 800
      ? wikiData.extract.substring(0, 800) + '...'
      : wikiData.extract
    : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="bg-paper-100 dark:bg-gray-900 border-4 border-gold-600 rounded-lg shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="brass-header-bar px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LucideMapPin className="text-gold-400" size={20} />
            <h2 className="brass-text font-display text-xl font-bold">{zone.name.toUpperCase()}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-200 transition-colors"
          >
            <LucideX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Zone Description */}
          <div className="border-l-4 border-gold-500 pl-4">
            <p className="font-serif text-lg italic text-ink-700 dark:text-paper-200">
              {zone.description}
            </p>
          </div>

          {/* Historical Note */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <LucideBookOpen className="text-amber-600 dark:text-amber-400 shrink-0 mt-1" size={18} />
              <div>
                <h3 className="font-display text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">Historical Context</h3>
                <p className="font-serif text-sm text-amber-900 dark:text-amber-200">
                  {locationData.historicalNote}
                </p>
                {(locationData.yearBuilt || locationData.architect) && (
                  <div className="mt-2 flex gap-4 text-xs text-amber-700 dark:text-amber-400">
                    {locationData.yearBuilt && <span><strong>Built:</strong> {locationData.yearBuilt}</span>}
                    {locationData.architect && <span><strong>Architect:</strong> {locationData.architect}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Wikipedia Section */}
          <div className="border border-gold-300 dark:border-gold-700 rounded-lg overflow-hidden">
            <div className="bg-gold-100 dark:bg-gold-900/30 px-4 py-2 border-b border-gold-300 dark:border-gold-700 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-gold-800 dark:text-gold-300">From Wikipedia</span>
              <a
                href={locationData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gold-600 dark:text-gold-400 hover:text-gold-800 dark:hover:text-gold-200 transition-colors"
              >
                Read more <LucideExternalLink size={12} />
              </a>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500 border-t-transparent"></div>
                </div>
              ) : error ? (
                <p className="text-center text-ink-400 dark:text-paper-500 py-4 font-serif italic">
                  {error}
                </p>
              ) : wikiData ? (
                <div className="flex gap-4">
                  {wikiData.thumbnail && (
                    <div className="shrink-0">
                      <img
                        src={wikiData.thumbnail}
                        alt={wikiData.title}
                        className="w-32 h-32 object-cover rounded border border-gold-300 dark:border-gold-700"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-ink-800 dark:text-paper-100 mb-2">
                      {wikiData.title}
                    </h4>
                    <p className="font-serif text-sm text-ink-600 dark:text-paper-300 leading-relaxed">
                      {truncatedExtract}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Zone Info */}
          <div className="flex items-center gap-4 text-sm text-ink-500 dark:text-paper-500">
            <span className="font-mono text-xs px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">
              {zone.biome}
            </span>
            <span>
              {zone.width}×{zone.height} area
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gold-300 dark:border-gold-700 px-6 py-3 bg-paper-50 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-ink-900 hover:bg-gold-500 active:bg-gold-600 text-gold-500 hover:text-ink-900 border border-gold-600 rounded font-display text-sm tracking-wider transition-all duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
