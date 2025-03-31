import React, { useState, useEffect } from 'react';

const DragTheWordsQuestion = ({ question, value, onChange, themeColor = "#0891b2" }) => {
  // Initialiser l'état des mots à faire glisser
  const [words, setWords] = useState([]);
  const [droppedWords, setDroppedWords] = useState(Array(10).fill(null)); // Assez d'emplacements pour les réponses

  // Extraire les mots à partir de la réponse fournie dans la question
  useEffect(() => {
    if (question.answers && question.answers.length > 0) {
      // Créer un tableau de mots basé sur les réponses
      const shuffledWords = [...question.answers].map(answer => ({
        id: `word-${answer.text}-${answer.position}-${answer.correct}`,
        text: answer.text,
        position: answer.position,
        isDragged: false
      }));
      
      // Ordonner aléatoirement les mots pour éviter de donner la solution
      setWords(shuffleArray(shuffledWords));
      
      // Préparer des espaces vides pour les réponses basées sur le nombre de trous dans la question
      const gapCount = (question.question.match(/\$\$\$/g) || []).length;
      setDroppedWords(Array(gapCount).fill(null));
      onChange(Array(gapCount).fill(null));
    }
  }, [question]);

  // Utiliser value comme état de réponse si disponible
  useEffect(() => {
    if (value && Array.isArray(value) && value.some(v => v !== null)) {
      setDroppedWords(value);
      onChange(value);
      
      // Mettre à jour l'état "dragged" des mots correspondants
      // Seulement si words contient des éléments
      if (words.length > 0) {
        const updatedWords = [...words];
        let hasChanges = false;
        
        value.forEach(droppedWord => {
          if (droppedWord) {
            const index = updatedWords.findIndex(w => w.id === droppedWord.id);
            if (index !== -1 && !updatedWords[index].isDragged) {
              updatedWords[index] = { ...updatedWords[index], isDragged: true };
              hasChanges = true;
            }
          }
        });
        
        // Ne mettre à jour words que si des changements ont été apportés
        if (hasChanges) {
          setWords(updatedWords);
        }
      }
    }
  }, [value]); // Retirer 'words' des dépendances pour éviter les boucles infinies

  // Fonction pour mélanger un tableau
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Extraire les parties du texte à partir des marqueurs $$$
  const promptParts = question.question.split('$$$');

  // Gérer le glissement d'un mot
  const handleDragStart = (e, word) => {
    e.dataTransfer.setData('wordId', word.id);
  };

  // Permettre le drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Gérer le dépôt d'un mot
  const handleDrop = (e, index) => {
    e.preventDefault();
    const wordId = e.dataTransfer.getData('wordId');
    const draggedWord = words.find(w => w.id === wordId);
    
    if (draggedWord) {
      // Marquer le mot comme déplacé
      const updatedWords = words.map(word => 
        word.id === wordId ? { ...word, isDragged: true } : word
      );
      setWords(updatedWords);
      
      // Si l'emplacement contient déjà un mot, le remettre dans la liste disponible
      if (droppedWords[index]) {
        const previousWordId = droppedWords[index].id;
        const revertedWords = updatedWords.map(word => 
          word.id === previousWordId ? { ...word, isDragged: false } : word
        );
        setWords(revertedWords);
      }
      
      // Ajouter le mot à la position de dépôt
      const newDroppedWords = [...droppedWords];
      newDroppedWords[index] = draggedWord;
      setDroppedWords(newDroppedWords);
      onChange(newDroppedWords);
    }
  };

  // Supprimer un mot déposé
  const handleRemoveWord = (index) => {
    // Marquer le mot comme non déplacé
    const removedWord = droppedWords[index];
    if (removedWord) {
      const updatedWords = words.map(word => 
        word.id === removedWord.id ? { ...word, isDragged: false } : word
      );
      setWords(updatedWords);
      
      // Supprimer le mot de la zone de dépôt
      const newDroppedWords = [...droppedWords];
      newDroppedWords[index] = null;
      setDroppedWords(newDroppedWords);
      onChange(newDroppedWords);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Bloc de mise en contexte de la question */}
      {question.statement && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">{question.statement}</p>
        </div>
      )}

      {/* Zone de phrase à compléter */}
      <h3 className="flex flex-wrap items-center gap-2 text-lg font-medium text-gray-900 mb-4">
        {promptParts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < promptParts.length - 1 && (
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`inline-flex justify-center items-center w-32 md:w-40 h-8 text-center border rounded ${!droppedWords[index] ? 'border-dashed' : 'border-solid'}`}
                style={{
                  borderColor: themeColor,
                  backgroundColor: droppedWords[index] ? `${themeColor}10` : 'transparent',
                  minWidth: '100px'
                }}
              >
                {droppedWords[index] ? (
                  <div className="flex items-center justify-between w-full px-2">
                    <span>{droppedWords[index].text}</span>
                    <button
                      onClick={() => handleRemoveWord(index)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      aria-label="Retirer le mot"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Déposez ici</span>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </h3>

      {/* Zone de mots disponibles */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-500 mb-2">Glissez et déposez les mots pour compléter la phrase :</p>
        <div className="flex flex-wrap gap-2">
          {words.map((word, idx) => (
            !word.isDragged && (
              <div
                key={word.id}
                draggable
                onDragStart={(e) => handleDragStart(e, word)}
                className="px-3 py-1 bg-white border rounded-md shadow-sm cursor-grab"
                style={{ borderColor: themeColor }}
              >
                {word.text}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default DragTheWordsQuestion; 