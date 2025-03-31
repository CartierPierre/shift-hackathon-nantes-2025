// Mock API functions to simulate backend interactions
// In a real implementation, these would make actual API calls

/**
 * Fetches an exercise based on the given subject
 * @param {string} subject - The subject for which to fetch an exercise
 * @param {string} studentContext - Optional student context for personalized exercises
 * @param {string} contentType - Optional content type preference
 * @returns {Promise<Object>} - The exercise data
 */
export const fetchExercise = (subject, studentContext = "", contentType = "multiple_choice") => {
  console.log(`Fetching exercise for: ${subject}`);
  
  const apiUrl = "https://inframatic.app.n8n.cloud/webhook/091cf9db-07c7-4db6-901c-624ac2552bdf";
  const imageApiUrl = "https://inframatic.app.n8n.cloud/webhook/091cf9db-07c7-4db6-901c-624ac2552bde";
  
  // Prepare the request body
  const requestBody = {
    student_context: studentContext || "",
    type: "string",
    skill_to_validate: subject
  };

  // Fetch image (optional)
  const fetchImage = () => {
    return fetch(`${imageApiUrl}?skill_to_validate=${encodeURIComponent(subject)}`)
      .then(response => {
        if (!response.ok) {
          console.warn(`Image fetch failed with status: ${response.status}`);
          return null;
        }
        return response.json();
      })
      .then(data => {
        return data && data.length > 0 ? data[0]?.url : null;
      })
      .catch(error => {
        console.warn("Error fetching image:", error);
        return null;
      });
  };

  // Make the actual API call
  return Promise.all([
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then(async response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }),
    fetchImage()
  ])
  .then(([exerciseData, bannerImage]) => {
    // Process the API response based on format
    let exerciseObject;
    
    if (Array.isArray(exerciseData)) {
      const questions = [];
      exerciseData.forEach(({ output }) => questions.push(...output.questions));
      
      exerciseObject = {
        id: `exercise-${subject}-${Date.now()}`,
        title: `Exercise: ${subject}`,
        description: `Exercise for skill: ${subject}`,
        type: 'quiz',
        questions: questions.map((q, index) => ({
          id: `q${index + 1}`,
          type: q.type,
          question: q.question,
          answers: q.answers,
          statement: q.statement,
        }))
      };
    } else {
      // Format existant - retourner tel quel
      exerciseObject = exerciseData;
    }
    
    // Add banner image if available
    if (bannerImage) {
      exerciseObject.bannerImage = bannerImage;
    }
    
    return exerciseObject;
  })
  .catch(error => {
    console.error("Error fetching exercise:", error);
    
    // Fallback to mock data in case of API failure
    const exercises = {
      default: {
        id: 'default-1',
        title: 'General Knowledge',
        description: 'Test your general knowledge',
        type: 'quiz',
        questions: [
          {
            "question": "Quel est le plus grand océan du monde ?",
            "type": "multiple_choice",
            "answers": [
              {
                "text": "Océan Atlantique",
                "correct": false,
                "position": 1
              },
              {
                "text": "Océan Indien",
                "correct": false,
                "position": 2
              },
              {
                "text": "Océan Pacifique",
                "correct": true,
                "position": 3
              },
              {
                "text": "Océan Arctique",
                "correct": false,
                "position": 4
              }
            ]
          },
          {
            "question": "Quel est le plus grand océan du $$$ ?",
            "type": "fill_in_the_blanks",
            "answers": [
              {
                "text": "monde",
                "correct": true,
                "position": 1
              }
            ]
          },
          {
            "question": "Quel est le plus grand $$$ du $$$ ?",
            "type": "drag_the_words",
            "answers": [
              {
                "text": "monde",
                "correct": true,
                "position": 2
              },
              {
                "text": "océan",
                "correct": true,
                "position": 1
              },
              {
                "text": "voiture",
                "correct": false,
                "position": 0
              }
            ]
          }
        ]
      }
    };

    const exercice = (exercises[subject] || exercises.default);
    exercice.questions = exercice.questions.map((e, i) => ({
      ...e,
      id: `q${i + 1}`
    }));
    
    return exercice;
  });
};

/**
 * Submits user answers for evaluation
 * @param {string} exerciseId - The ID of the exercise
 * @param {Object} answers - The user's answers
 * @returns {Promise<Object>} - The evaluation result
 */
export const submitAnswers = (exerciseId, answers) => {
  console.log(`Submitting answers for exercise ${exerciseId}:`, answers);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple evaluation logic (this would be server-side in a real app)
      let correctCount = 0;
      let totalQuestions = 0;
      const feedbackItems = [];
      
      // Fonction pour normaliser un texte (supprimer accents, casse, ponctuation)
      const normalizeText = (text) => {
        if (!text) return '';
        return text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
          .replace(/[^\w\s]/g, ""); // Supprimer les caractères spéciaux
      };
      
      // Fonction pour comparer les réponses en tenant compte de la normalisation
      const compareAnswers = (userAnswer, correctAnswer) => {
        if (typeof userAnswer === 'object' && userAnswer !== null) {
          // Pour les réponses de type objet (MCQ dans le nouveau format, drag_the_words)
          if (Array.isArray(userAnswer)) {
            // Pour les réponses de type drag_the_words
            if (Array.isArray(correctAnswer)) {
              // S'assurer que les tableaux ont la même longueur et contiennent des éléments
              if (!userAnswer.length || userAnswer.length !== correctAnswer.length) {
                return false;
              }
              
              // Vérifier chaque position
              return userAnswer.every((answer, index) => {
                // Si une position est vide, c'est incorrect
                if (!text || !correctAnswer[index]) return false;
                
                // Vérifier si le texte correspond
                const userAnswerText = normalizeText(answer.text || answer);
                const correctAnswerText = normalizeText(correctAnswer[index].text || correctAnswer[index]);
                const positionMatch = answer.position === correctAnswer[index].position;
                
                // Pour drag_the_words, l'ordre est important
                return userAnswerText === correctAnswerText && 
                       (answer.position === undefined || positionMatch);
              });
            }
          } else if (userAnswer.text) {
            // Pour les réponses de type MCQ dans le nouveau format
            return normalizeText(userAnswer.text) === normalizeText(correctAnswer.text);
          }
        } else if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
          // Pour les réponses de type texte (fill-in-blank dans l'ancien format)
          return normalizeText(userAnswer) === normalizeText(correctAnswer);
        } else if (typeof userAnswer === 'string' && typeof correctAnswer === 'object' && correctAnswer.text) {
          // Pour les réponses de type texte contre un objet (fill_in_the_blanks dans le nouveau format)
          return normalizeText(userAnswer) === normalizeText(correctAnswer.text);
        }
        
        // Si aucune condition n'est remplie, retourne false
        return false;
      };
      
      // Fetch the exercise to check against correct answers
      const allExercises = [
        {
          id: 'math-1',
          questions: [
            { id: 'q1', correctAnswer: '15' },
            { id: 'q2', correctAnswer: '7' }
          ]
        },
        {
          id: 'lang-1',
          questions: [
            { id: 'q1', correctAnswer: 'Modern' },
            { id: 'q2', correctAnswer: 'Cat' }
          ]
        },
        {
          id: 'prog-1',
          questions: [
            { id: 'q1', correctAnswer: 'Float' },
            { id: 'q2', correctAnswer: 'let' }
          ]
        },
        {
          id: 'default-1',
          questions: [
            { id: 'q1', correctAnswer: 'Mars' },
            { id: 'q2', correctAnswer: 'Paris' }
          ]
        }
      ];
      
      // Obtenir les données de l'exercice depuis le sessionStorage pour les exercices du nouveau format
      let exercise = null;
      try {
        const exerciseData = sessionStorage.getItem('current_exercise');
        if (exerciseData) {
          exercise = JSON.parse(exerciseData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'exercice:", error);
      }
      
      // Si on n'a pas trouvé l'exercice dans sessionStorage, chercher dans allExercises
      if (!exercise) {
        exercise = allExercises.find(ex => ex.id === exerciseId);
      }
      
      if (exercise) {
        exercise.questions.forEach(question => {
          totalQuestions++;
          const userAnswer = answers[question.id];
          let isCorrect = false;
          let correctAnswerText = '';
          
          // Déterminer si la réponse est correcte selon le type de question
          if (question.answers) {
            // Nouveau format d'API
            if (question.type === 'multiple_choice') {
              // Pour les questions à choix multiples, trouver la réponse correcte
              const correctAnswer = question.answers.find(a => a.correct === true);
              
              if (correctAnswer) {
                correctAnswerText = correctAnswer.text;
                
                // Vérifier si l'utilisateur a sélectionné la réponse correcte
                if (userAnswer && typeof userAnswer === 'object') {
                  isCorrect = userAnswer.correct === true || 
                             (userAnswer.text && normalizeText(userAnswer.text) === normalizeText(correctAnswer.text));
                }
              }
            } else if (question.type === 'fill_in_the_blanks' || question.type === 'fill_in_the_blank') {
              // Pour les questions à trous
              // Trouver les réponses correctes (il peut y en avoir plusieurs)
              const correctAnswers = question.answers.filter(a => a.correct === true);
              
              if (correctAnswers.length > 0) {
                correctAnswerText = correctAnswers.map(a => a.text).join(' ou ');
                
                // Vérifier si la réponse de l'utilisateur correspond à une des réponses correctes
                isCorrect = correctAnswers.some(answer => 
                  compareAnswers(userAnswer, answer)
                );
              }
            } else if (question.type === 'drag_the_words') {
              // Pour les questions de type glisser-déposer
              // Trouver les réponses correctes et les trier par position
              const correctAnswers = question.answers
                .filter(a => a.correct === true)
                .sort((a, b) => a.position - b.position);
              
              if (correctAnswers.length > 0) {
                correctAnswerText = correctAnswers.map(a => a.text).join(', ');
                
                // Préparer un tableau ordonné des réponses de l'utilisateur, en remplaçant les éléments null par des objets vides
                let orderedUserAnswers = [];
                if (Array.isArray(userAnswer)) {
                  // Transformer les éléments null en objets vides pour faciliter la comparaison
                  orderedUserAnswers = userAnswer.map(ans => ans || { text: '', position: -1 });
                }
                
                // Vérifier que les réponses sont dans le bon ordre
                if (orderedUserAnswers.length === correctAnswers.length) {
                  isCorrect = true; // Supposons que c'est correct jusqu'à preuve du contraire
                  
                  for (let i = 0; i < correctAnswers.length; i++) {
                    const userAns = orderedUserAnswers[i];
                    const correctAns = correctAnswers[i];
                    
                    // Si une réponse est vide ou ne correspond pas, c'est incorrect
                    if (!userAns || !userAns.text || normalizeText(userAns.text) !== normalizeText(correctAns.text)) {
                      isCorrect = false;
                      break;
                    }
                  }
                } else {
                  isCorrect = false; // Nombre incorrect de réponses
                }
              }
            }
          } else {
            // Ancien format
            correctAnswerText = question.correctAnswer;
            isCorrect = compareAnswers(userAnswer, question.correctAnswer);
          }
          
          if (isCorrect) {
            correctCount++;
            feedbackItems.push({
              questionId: question.id,
              correct: true,
              feedback: 'Correct!'
            });
          } else {
            feedbackItems.push({
              questionId: question.id,
              correct: false,
              feedback: `Incorrect. La réponse correcte est "${correctAnswerText}".`
            });
          }
        });
      }
      
      const score = Math.round((correctCount / totalQuestions) * 100);
      const success = score >= 70; // 70% threshold for success
      
      resolve({
        success,
        score,
        correctCount,
        totalQuestions,
        feedbackItems
      });
    }, 1000); // Simulate evaluation delay
  });
};

/**
 * Logs the result of an exercise attempt
 * @param {string} exerciseId - The ID of the exercise
 * @param {boolean} success - Whether the attempt was successful
 * @returns {Promise<void>}
 */
export const logResult = (exerciseId, success) => {
  console.log(`Logging result for exercise ${exerciseId}: ${success ? 'Success' : 'Failure'}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, this would send data to the server
      resolve();
    }, 500);
  });
};
