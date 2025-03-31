import React, { useEffect, useState } from 'react';

const LoadingState = ({ themeColor = "#0891b2" }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 4 : 0));
    }, 150);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 max-w-md mx-auto">
      <div className="w-full bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        {/* Titre du formulaire */}
        <div className="mb-6 border-l-4 h-8 flex items-center" style={{ borderColor: themeColor }}>
          <div 
            className="h-4 bg-gray-300 rounded ml-3 animate-pulse" 
            style={{ width: `${Math.min(progress, 70)}%` }}
          ></div>
        </div>
        
        {/* Champs du formulaire */}
        <div className="space-y-5 w-full">
          {/* Champ 1 */}
          <div className={`transition-opacity duration-300 ${progress > 20 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>
            <div 
              className="h-10 bg-gray-200 rounded w-full" 
              style={{
                background: progress > 30 ? 
                  `linear-gradient(90deg, ${themeColor}20 ${Math.min((progress-30)*2, 100)}%, #f3f4f6 0%)` : 
                  '#f3f4f6'
              }}
            ></div>
          </div>
          
          {/* Champ 2 */}
          <div className={`transition-opacity duration-300 ${progress > 40 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
            <div 
              className="h-10 bg-gray-200 rounded w-full"
              style={{
                background: progress > 50 ? 
                  `linear-gradient(90deg, ${themeColor}20 ${Math.min((progress-50)*2, 100)}%, #f3f4f6 0%)` : 
                  '#f3f4f6'
              }}
            ></div>
          </div>
          
          {/* Champ 3 */}
          <div className={`transition-opacity duration-300 ${progress > 60 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-3 w-28 bg-gray-300 rounded mb-2"></div>
            <div 
              className="h-20 bg-gray-200 rounded w-full"
              style={{
                background: progress > 70 ? 
                  `linear-gradient(90deg, ${themeColor}20 ${Math.min((progress-70)*2, 100)}%, #f3f4f6 0%)` : 
                  '#f3f4f6'
              }}
            ></div>
          </div>
          
          {/* Bouton */}
          <div 
            className={`h-10 rounded mt-4 transition-all duration-300 ${progress > 85 ? 'opacity-100' : 'opacity-30'}`}
            style={{ 
              backgroundColor: themeColor,
              width: `${Math.min((progress-80)*5, 30)}%`,
              marginLeft: 0
            }}
          ></div>
        </div>
      </div>
      
      <p className="mt-4 text-gray-600 font-medium">Préparation de l'exercice...</p>
    </div>
  );
};

export default LoadingState;
