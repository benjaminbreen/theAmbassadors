import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { checkHistoricalFact } from '../services/geminiService';
import { FactCheckResult } from '../types';
import { LucideBookOpen, LucideCheckCircle, LucideXCircle, LucideLoader } from 'lucide-react';

const FactChecker: React.FC = () => {
  const { state, dispatch } = useGame();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);

  useEffect(() => {
    if (state.factCheckQueue) {
      setLoading(true);
      setResult(null);
      
      checkHistoricalFact(state.factCheckQueue).then(res => {
        setResult(res);
        setLoading(false);
      });
    }
  }, [state.factCheckQueue]);

  if (!state.showFactCheck) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-paper-50 dark:bg-gray-800 border-2 border-gold-500 shadow-2xl rounded-lg overflow-hidden z-50 flex flex-col animate-fade-in">
      <div className="bg-gold-500 p-2 flex justify-between items-center text-ink-900 font-display font-bold text-sm">
        <span className="flex items-center gap-2"><LucideBookOpen size={16}/> Historical Veracity Engine</span>
        <button onClick={() => dispatch({ type: 'CLOSE_FACT_CHECK' })} className="hover:bg-gold-600 px-2 rounded">×</button>
      </div>

      <div className="p-4 text-sm max-h-96 overflow-y-auto font-serif">
        {loading && (
          <div className="flex flex-col items-center justify-center py-4 text-gray-500 gap-2">
             <LucideLoader className="animate-spin" />
             <span>Consulting the archives...</span>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-3">
            <div className="border-b border-gray-200 pb-2 mb-2 italic text-gray-600">
              "{result.originalEvent}"
            </div>
            
            <div className="flex items-center gap-2 font-bold">
               {result.veracityScore > 70 ? (
                   <span className="text-green-700 flex items-center gap-1"><LucideCheckCircle size={14}/> Verified Authentic</span>
               ) : (
                   <span className="text-red-700 flex items-center gap-1"><LucideXCircle size={14}/> Historically Dubious</span>
               )}
            </div>

            <p className="text-ink-900 leading-relaxed">
              {result.correction}
            </p>

            {result.sources.length > 0 && (
              <div className="mt-4 pt-2 border-t border-dashed border-gray-300">
                <p className="text-xs font-bold text-gray-500 mb-1">PRIMARY SOURCES:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {result.sources.map((source, i) => (
                    <li key={i}>
                      <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs block truncate">
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FactChecker;
