import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Exercizer from '../components/Exercizer';

const Index = () => {
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(() => {
    // Essayer de récupérer la valeur depuis les cookies ou utiliser la valeur par défaut
    return Cookies.get('exercizer_subject') || "College, Classe de 6eme, Francais, Conjugaison, Le verbe, les trois groupes verbaux";
  });
  const [currentContext, setCurrentContext] = useState(() => {
    // Essayer de récupérer la valeur depuis les cookies ou utiliser la valeur par défaut
    return Cookies.get('exercizer_context') || "Camille est une élève de 6ème au Collège Jean Moulin à Nantes, âgée de 14 ans. Elle est passionnée par la lecture, le dessin, la photographie, et l'écriture de nouvelles. Elle aime particulièrement Le Petit Prince d'Antoine de Saint-Exupéry, ainsi que des séries comme Stranger Things et des films comme Harry Potter. Ses activités incluent la natation, la danse, et le théâtre. Elle vit avec ses parents, Marc (ingénieur en informatique) et Sophie (professeure de français), ainsi que sa petite sœur Clara. Camille a un chat nommé Luna et aime passer du temps avec ses amis, notamment Emma, Lucas, Chloé, et Noah. Elle utilise Instagram et aime voyager, particulièrement en Bretagne. Ses musiques préférées incluent Dynamite et Butter de BTS, Bad Habits d'Ed Sheeran, Watermelon Sugar de Harry Styles, Levitating et Don't Start Now de Dua Lipa, Good 4 U d'Olivia Rodrigo, Blinding Lights de The Weeknd, Dance Monkey de Tones and I, et Savage Love de Jawsh 685 et Jason Derulo.";
  });
  const [showBanner, setShowBanner] = useState(() => {
    // Récupérer la valeur depuis les cookies ou utiliser true par défaut
    return Cookies.get('exercizer_showBanner') !== 'false';
  });
  const [themeColor, setThemeColor] = useState(() => {
    // Récupérer la valeur depuis les cookies ou utiliser la valeur par défaut
    return Cookies.get('exercizer_themeColor') || "#2C44FF";
  });
  
  // États temporaires pour le formulaire
  const [tempSubject, setTempSubject] = useState(currentSubject);
  const [tempContext, setTempContext] = useState(currentContext);
  const [tempShowBanner, setTempShowBanner] = useState(showBanner);
  const [tempThemeColor, setTempThemeColor] = useState(themeColor);
  
  // État pour forcer le rechargement du composant Exercizer
  const [exercizerKey, setExercizerKey] = useState(0);

  // Sauvegarder les valeurs dans les cookies lorsqu'elles changent
  useEffect(() => {
    Cookies.set('exercizer_subject', currentSubject, { expires: 30 }); // Expire dans 30 jours
  }, [currentSubject]);

  useEffect(() => {
    Cookies.set('exercizer_context', currentContext, { expires: 30 }); // Expire dans 30 jours
  }, [currentContext]);

  useEffect(() => {
    Cookies.set('exercizer_showBanner', showBanner, { expires: 30 }); // Expire dans 30 jours
  }, [showBanner]);

  useEffect(() => {
    Cookies.set('exercizer_themeColor', themeColor, { expires: 30 }); // Expire dans 30 jours
  }, [themeColor]);

  const handleExercizeComplete = (result) => {
    console.log('Exercise completed:', result);
  };
  
  // Fonction pour appliquer les changements et régénérer l'exercice
  const handleApplyChanges = () => {
    setCurrentSubject(tempSubject);
    setCurrentContext(tempContext);
    setShowBanner(tempShowBanner);
    setThemeColor(tempThemeColor);
    setExercizerKey(prevKey => prevKey + 1); // Force le rechargement du composant
    setShowConfigPanel(false); // Ferme le panneau de configuration
  };

  // Fonction pour le skeleton loading
  const Skeleton = ({ className = "", ...props }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} {...props}></div>
  );

  // Icône de configuration discrète
  const ConfigIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-gray-400 hover:text-gray-600 cursor-pointer"
      onClick={() => setShowConfigPanel(!showConfigPanel)}
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <div className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <div className="md:hidden mr-4">
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center space-x-4">
            <ConfigIcon />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>

        {/* Panneau de configuration */}
        {showConfigPanel && (
          <div className="bg-white border-b border-gray-200 p-4 shadow-md">
            <div className="max-w-4xl mx-auto space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Configuration de l'exercice</h3>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet de l'exercice
                </label>
                <input
                  type="text"
                  id="subject"
                  value={tempSubject}
                  onChange={(e) => setTempSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">
                  Contexte de l'exercice
                </label>
                <textarea
                  id="context"
                  value={tempContext}
                  onChange={(e) => setTempContext(e.target.value)}
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="themeColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Couleur du thème
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="themeColor"
                      value={tempThemeColor}
                      onChange={(e) => setTempThemeColor(e.target.value)}
                      className="h-10 w-20 border-0 p-0"
                    />
                    <span className="text-sm text-gray-600">{tempThemeColor}</span>
                  </div>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    Afficher l'image de bannière
                  </span>
                  <div className="flex items-center space-x-2 h-10">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={tempShowBanner} 
                        onChange={(e) => setTempShowBanner(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {tempShowBanner ? "Oui" : "Non"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleApplyChanges}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Régénérer l'exercice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>

          {/* Main component */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <Skeleton className="h-6 w-64" />
            </div>
            <div className="p-4">
              <Exercizer 
                key={exercizerKey}
                subject={currentSubject}
                context={currentContext}
                onComplete={handleExercizeComplete}
                themeColor={themeColor}
                showBanner={showBanner}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Exercizer Dashboard
        </div>
      </div>
    </div>
  );
};

export default Index; 