import React, { useState, useEffect } from 'react';

const MCQQuestion = ({ question, value, onChange, themeColor = "#0891b2" }) => {
  // État pour suivre la sélection de l'utilisateur
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  // Synchroniser avec la valeur externe si elle existe
  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setSelectedOptions(value);
      } else {
        setSelectedOptions([value]);
      }
    }
  }, [value]);
  
  // Déterminer la source des options en fonction du format de données
  // Nouveau format d'API vs format existant
  const options = question.answers 
    ? question.answers.sort((a, b) => a.position - b.position) 
    : question.options || [];
  
  // Récupérer le texte de la question selon le format
  const questionText = question.question || question.prompt || '';
  
  // Vérifier si plusieurs réponses sont possibles
  const isMultipleChoice = question.answers 
    ? question.answers.filter(a => a.correct === true).length > 1
    : false;
  
  // Gérer la sélection d'une réponse
  const handleOptionSelect = (option) => {
    let newSelectedOptions;
    
    if (isMultipleChoice) {
      // Mode checkbox - plusieurs sélections possibles
      const isAlreadySelected = isSelected(option);
      if (isAlreadySelected) {
        // Retirer l'option si déjà sélectionnée
        newSelectedOptions = selectedOptions.filter(opt => 
          question.answers 
            ? opt.text !== option.text 
            : opt !== option
        );
      } else {
        // Ajouter l'option
        newSelectedOptions = [...selectedOptions, option];
      }
    } else {
      // Mode radio - une seule sélection
      newSelectedOptions = [option];
    }
    
    setSelectedOptions(newSelectedOptions);
    onChange(isMultipleChoice ? newSelectedOptions : option);
  };
  
  // Vérifier si une option est sélectionnée
  const isSelected = (option) => {
    if (!selectedOptions.length) return false;
    
    if (question.answers) {
      // Nouveau format: comparaison basée sur le texte
      return selectedOptions.some(selected => selected.text === option.text);
    } else {
      // Ancien format: comparaison basée sur le texte
      return selectedOptions.some(selected => selected === option);
    }
  };
  
  // Gestion de la navigation au clavier
  const handleKeyDown = (e, option) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionSelect(option);
    }
  };
  
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      {/* Bloc de mise en contexte de la question */}
      {/* {question.statement && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">{question.statement}</p>
        </div>
      )} */}
      
      <h3 className="text-xl font-medium text-gray-900 mb-6">{questionText}</h3>
      
      <div className="space-y-4">
        {options.map((option, index) => {
          // Déterminer le texte à afficher selon le format
          const optionText = question.answers ? option.text : option;
          const selected = isSelected(option);
          
          return (
            <div 
              key={index}
              className={`
                flex items-center p-4 rounded-lg transition-all duration-200
                ${selected ? 'bg-opacity-20 border-2' : 'hover:bg-opacity-10 border'}
                ${selected ? `` : 'border-gray-200'}
                cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-opacity-75
              `}
              onClick={() => handleOptionSelect(option)}
              onKeyDown={(e) => handleKeyDown(e, option)}
              tabIndex="0"
              role={isMultipleChoice ? "checkbox" : "radio"}
              aria-checked={selected}
              style={{ 
                border: selected ? `2px solid ${themeColor}` : '',
                "--tw-ring-color": `${themeColor}80` // Ajout d'une transparence (80 = 50%)
              }}
            >
              <div className="mr-4 flex-shrink-0">
                <div 
                  className={`
                    ${isMultipleChoice ? 'rounded-md' : 'rounded-full'} 
                    w-6 h-6 border-2 flex items-center justify-center
                    ${selected 
                      ? `bg-[${themeColor}] border-[${themeColor}]` 
                      : 'bg-white border-gray-400'}
                    transition-colors duration-200
                  `}
                  style={{
                    backgroundColor: selected ? `${themeColor}` : "",
                    borderColor: selected ? `${themeColor}` : "",
                  }}
                >
                  {selected && (
                    isMultipleChoice ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )
                  )}
                </div>
              </div>
              <label 
                htmlFor={`${question.id || 'q'}-option-${index}`}
                className="text-base flex-grow font-medium"
              >
                {optionText}
              </label>
              <input 
                type={isMultipleChoice ? "checkbox" : "radio"}
                id={`${question.id || 'q'}-option-${index}`} 
                name={`question-${question.id || 'q'}`}
                value={optionText}
                checked={selected}
                onChange={() => handleOptionSelect(option)}
                className="sr-only" // Masquer visuellement tout en gardant l'accessibilité
                style={{ accentColor: themeColor }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MCQQuestion;
