import React, { useState, useEffect } from 'react';

const FillInBlankQuestion = ({ question, value, onChange, themeColor = "#0891b2" }) => {
  // État local pour stocker les réponses correctes et les valeurs saisies par l'utilisateur
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [userInputs, setUserInputs] = useState([]);
  
  // Récupérer le texte de la question selon le format
  const questionText = question.question || question.prompt || '';
  
  // Déterminer le séparateur de blancs selon le format
  // Nouveau format API: $$$, ancien format: []
  const separator = questionText.includes('$$$') ? '$$$' : '[]';
  
  // Split the prompt by the placeholder markers
  const promptParts = questionText.split(separator);
  
  // Initialiser les inputs utilisateur avec les valeurs existantes si disponibles
  useEffect(() => {
    if (value) {
      // Si value est un tableau, l'utiliser directement
      if (Array.isArray(value)) {
        setUserInputs(value);
      } else {
        // Sinon, créer un tableau avec la valeur unique répétée
        const blankCount = promptParts.length - 1;
        setUserInputs(Array(blankCount).fill(value));
      }
    } else {
      // Initialiser avec des chaînes vides
      const blankCount = promptParts.length - 1;
      setUserInputs(Array(blankCount).fill(''));
    }
  }, [value, promptParts.length]);
  
  // Extraire les réponses correctes au chargement du composant
  useEffect(() => {
    if (question.answers && question.answers.length > 0) {
      // Trier les réponses par position
      const sortedAnswers = [...question.answers].sort((a, b) => a.position - b.position);
      setCorrectAnswers(sortedAnswers);
    }
  }, [question]);

  // Fonction pour normaliser un texte (supprimer accents, casse, ponctuation)
  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
      .replace(/[^\w\s]/g, ""); // Supprimer les caractères spéciaux
  };

  // Vérifier si une réponse spécifique est correcte
  const isAnswerCorrect = (userInput, index) => {
    if (!userInput || !correctAnswers.length) return null; // Pas encore répondu
    
    // Pour le nouveau format d'API
    if (question.answers) {
      const normalizedUserAnswer = normalizeText(userInput);
      // Chercher la réponse correspondant à cet index
      const correctAnswer = correctAnswers[index];
      if (correctAnswer) {
        return normalizeText(correctAnswer.text) === normalizedUserAnswer;
      }
    }
    
    // Pour l'ancien format
    if (question.correctAnswer && index === 0) {
      return normalizeText(userInput) === normalizeText(question.correctAnswer);
    }
    
    return null;
  };

  // Gérer le changement de saisie utilisateur pour un input spécifique
  const handleInputChange = (e, index) => {
    const newValue = e.target.value;
    const newInputs = [...userInputs];
    newInputs[index] = newValue;
    setUserInputs(newInputs);
    onChange(newInputs); // Transmettre toutes les valeurs au composant parent
  };
  
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Bloc de mise en contexte de la question */}
      {question.statement && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">{question.statement}</p>
        </div>
      )}
      
      <div className="inline text-lg leading-loose">
        {promptParts.map((part, index) => (
          <React.Fragment key={index}>
            <span className="inline">{part}</span>
            {index < promptParts.length - 1 && (
              <input
                type="text"
                value={userInputs[index] || ''}
                onChange={(e) => handleInputChange(e, index)}
                className="inline-block align-baseline mx-1 w-48 md:w-40 h-8 text-center border rounded focus:ring-2 focus:ring-opacity-50 focus:outline-none"
                style={{
                  borderColor:themeColor,
                  "--tw-ring-color": themeColor,
                  marginTop: '0.25rem',
                  marginBottom: '0.25rem'
                }}
                aria-label={`Fill in the blank ${index + 1}`}
                placeholder={question.answers[index].placeholder || "Votre réponse"}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FillInBlankQuestion;
