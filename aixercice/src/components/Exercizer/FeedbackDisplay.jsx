import React from 'react';
import Button from '@/components/ui-custom/Button';

// Icône CheckCircle
const CheckCircleIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size || 20} 
    height={props.size || 20} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// Icône XCircle
const XCircleIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size || 20} 
    height={props.size || 20} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={props.className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const FeedbackDisplay = ({ evaluation, exercise, userAnswers, onContinue, themeColor = "#0891b2" }) => {
  const { success, score, feedbackItems } = evaluation;
  
  // Find question details from the exercise data
  const getQuestionDetails = (questionId) => {
    return exercise.questions.find(q => q.id === questionId);
  };

  // Formatter les réponses utilisateur en fonction du type
  const formatUserAnswer = (answer, question) => {
    if (!answer) return '(vide)';
    
    // Si la réponse est un tableau (drag_the_words)
    if (Array.isArray(answer)) {
      return answer
        .filter(item => item !== null)
        .map(item => item.text || item)
        .join(', ');
    }
    
    // Si la réponse est un objet (multiple_choice)
    if (typeof answer === 'object' && answer !== null) {
      return answer.text || JSON.stringify(answer);
    }
    
    // Si la réponse est une chaîne (fill_in_the_blanks)
    return answer;
  };

  // Formatter le texte de la solution avec une mise en forme adaptée au type de question
  const formatSolution = (question, feedback) => {
    if (!question) return feedback;

    // Pour les questions à choix multiples
    if (question.type === 'multiple_choice' || question.type === 'mcq') {
      // Trouver la réponse correcte
      const correctAnswer = question.answers ? 
        question.answers.find(a => a.correct === true) : 
        { text: question.correctAnswer };
      
      if (correctAnswer) {
        return (
          <div>
            <p className="font-medium text-gray-800 mb-2">
              {question.question || question.prompt}
            </p>
            <p className="text-green-700">
              Réponse correcte : <span className="font-bold">{correctAnswer.text}</span>
            </p>
          </div>
        );
      }
    }
    
    // Pour les questions à trous
    if (question.type === 'fill_in_the_blanks' || question.type === 'fill_in_the_blank' || question.type === 'fill-in-blank') {
      const questionText = question.question || question.prompt || '';
      const separator = questionText.includes('$$$') ? '$$$' : '[]';
      const parts = questionText.split(separator);

      if (parts.length > 1) {
        // Trouver toutes les réponses correctes
        const correctAnswers = question.answers ? 
          question.answers.filter(a => a.correct === true).sort((a, b) => a.position - b.position) : 
          [{ text: question.correctAnswer }];
        
        return (
          <div>
            <p className="font-medium text-gray-800">
              {parts.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < parts.length - 1 && (
                    <span className="font-bold text-green-700 underline italic">
                      {correctAnswers[index] ? correctAnswers[index].text : '?'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>
        );
      }
    }
    
    // Pour les questions glisser-déposer
    if (question.type === 'drag_the_words') {
      const questionText = question.question || question.prompt || '';
      const separator = questionText.includes('$$$') ? '$$$' : '[]';
      const parts = questionText.split(separator);

      if (parts.length > 1) {
        // Trouver toutes les réponses correctes
        const correctAnswers = question.answers ? 
          question.answers
            .filter(a => a.correct === true)
            .sort((a, b) => a.position - b.position) : 
          [];
        
        return (
          <div>
            <p>
              {parts.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < parts.length - 1 && (
                    <span className="font-bold text-green-700">
                      {correctAnswers[index] ? correctAnswers[index].text : '?'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>
        );
      }
    }
    
    // Par défaut, retourner le texte de feedback standard
    return (
      <div>
        <p className="font-medium text-gray-800">
          {question.question || question.prompt}
        </p>
        <p className="text-sm mt-1">{feedback}</p>
      </div>
    );
  };

  const buttonStyle = {
    backgroundColor: themeColor,
    borderColor: themeColor,
    color: "#ffffff",
  };
  
  const successStyle = {
    backgroundColor: success ? themeColor : "#f97316", // Use theme color for success, orange for needs improvement
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg text-white" style={successStyle}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {success ? 'Excellent travail !' : 'Presque là !'}
          </h3>
          <div className="text-2xl font-bold">{score}%</div>
        </div>
        <p className="mt-2">
          {success 
            ? 'Vous avez complété cet exercice avec succès.' 
            : 'Vous pouvez réviser et réessayer.'}
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Commentaires sur vos réponses</h3>
        
        {feedbackItems.map((item) => {
          const question = getQuestionDetails(item.questionId);
          return (
            <div 
              key={item.questionId}
              className={`p-4 rounded-md border ${
                item.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start gap-3">
                {item.correct ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                
                <div className="flex-1">
                  {formatSolution(question, item.feedback)}
                  
                  {!item.correct && (
                    <p className="mt-2 text-gray-600 text-sm">
                      Votre réponse : <span className="font-medium">
                        {formatUserAnswer(userAnswers[item.questionId], question)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-right">
        <Button 
          onClick={onContinue}
          style={buttonStyle}
          className="px-8 py-2 rounded-md hover:opacity-90 transition-opacity duration-200"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default FeedbackDisplay;
