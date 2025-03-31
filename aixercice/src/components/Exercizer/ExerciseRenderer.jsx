import React, { useState } from 'react';
import Button from '@/components/ui-custom/Button';
import MCQQuestion from './question-types/MCQQuestion';
import FillInBlankQuestion from './question-types/FillInBlankQuestion';
import MediaQuestion from './question-types/MediaQuestion';
import DragTheWordsQuestion from './question-types/DragTheWordsQuestion';

// Icône ChevronLeft
const ChevronLeftIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size || 16} 
    height={props.size || 16} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

// Icône ChevronRight
const ChevronRightIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size || 16} 
    height={props.size || 16} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// Composant pour l'image d'ambiance
const BannerImage = ({ imageUrl, title }) => {
  if (!imageUrl) return null;
  
  return (
    <div className="relative w-full h-40 mb-6 overflow-hidden rounded-lg">
      <img 
        src={imageUrl} 
        alt={`Image d'ambiance pour ${title}`} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <h2 className="absolute bottom-4 left-4 text-white text-xl font-bold">{title}</h2>
    </div>
  );
};

const ExerciseRenderer = ({ 
  exercise, 
  userAnswers, 
  onAnswerChange, 
  onSubmit,
  submitting,
  themeColor = "#0891b2", // Default teal color
  showBanner = true // Propriété pour contrôler l'affichage de la bannière
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const isCurrentQuestionAnswered = () => {
    const currentQuestion = exercise.questions[currentStep];
    return userAnswers[currentQuestion.id] !== undefined && 
           (currentQuestion.type !== 'fill-in-blank' || userAnswers[currentQuestion.id].trim() !== '');
  };
  
  const isLastStep = currentStep === exercise.questions.length - 1;
  const isFirstStep = currentStep === 0;
  
  const handleNext = () => {
    if (isLastStep) {
      onSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  const renderQuestion = (question) => {
    switch (question.type) {
      case 'mcq':
      case 'multiple_choice':
        return (
          <MCQQuestion
            key={question.id}
            question={question}
            value={userAnswers[question.id]}
            onChange={(answer) => onAnswerChange(question.id, answer)}
            themeColor={themeColor}
          />
        );
        
      case 'fill-in-blank':
      case 'fill_in_the_blank':
      case 'fill_in_the_blanks':
        return (
          <FillInBlankQuestion
            key={question.id}
            question={question}
            value={userAnswers[question.id] || ''}
            onChange={(answer) => onAnswerChange(question.id, answer)}
            themeColor={themeColor}
          />
        );
        
      case 'drag_the_words':
        return (
          <DragTheWordsQuestion
            key={question.id}
            question={question}
            value={userAnswers[question.id] || []}
            onChange={(answer) => onAnswerChange(question.id, answer)}
            themeColor={themeColor}
          />
        );
        
      case 'media-question':
        return (
          <MediaQuestion
            key={question.id}
            question={question}
            value={userAnswers[question.id]}
            onChange={(answer) => onAnswerChange(question.id, answer)}
            themeColor={themeColor}
          />
        );
        
      default:
        return (
          <div key={question.id} className="p-4 bg-red-100 text-red-800 rounded-md">
            Unknown question type: {question.type}
          </div>
        );
    }
  };

  const buttonStyle = {
    backgroundColor: themeColor,
    borderColor: themeColor,
    color: "#ffffff",
  };

  const currentQuestion = exercise.questions[currentStep];

  return (
    <div className="space-y-8">
      {/* Banner Image */}
      {showBanner && <BannerImage imageUrl={exercise.bannerImage} title={exercise.title} />}
      
      {/* Progression indicator */}
      <div className="flex items-center justify-between mb-4 gap-1">
        <div className="text-sm text-gray-500">
          Question {currentStep + 1} sur {exercise.questions.length}
        </div>
        <div className="w-3/5 bg-gray-200 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full" 
            style={{
              width: `${((currentStep + 1) / exercise.questions.length) * 100}%`,
              backgroundColor: themeColor
            }}
          ></div>
        </div>
      </div>
      
      {/* Current question */}
      {renderQuestion(currentQuestion)}
      
      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between items-center">
        {!isFirstStep && (
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="flex items-center gap-1"
          >
            <ChevronLeftIcon size={16} />
            Précédent
          </Button>
        )}
        
        {isFirstStep && <div />} {/* Empty div placeholder to maintain flex layout */}
        
        <div className="flex-grow text-center">
          {!isCurrentQuestionAnswered() && (
            <p className="text-yellow-600 text-sm">
              Veuillez répondre à cette question avant de continuer
            </p>
          )}
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!isCurrentQuestionAnswered() || submitting}
          style={buttonStyle}
          className="px-8 py-2 rounded-md hover:opacity-90 transition-opacity duration-200 flex items-center gap-1"
        >
          {submitting ? 'Envoi en cours...' : isLastStep ? 'Évaluer mes réponses' : 'Suivant'}
          {!isLastStep && <ChevronRightIcon size={16} />}
        </Button>
      </div>
    </div>
  );
};

export default ExerciseRenderer;
