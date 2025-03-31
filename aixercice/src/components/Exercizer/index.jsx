import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast-custom';
import { fetchExercise, submitAnswers, logResult } from './api';
import LoadingState from './LoadingState';
import ExerciseRenderer from './ExerciseRenderer';
import FeedbackDisplay from './FeedbackDisplay';
import RetryPrompt from './RetryPrompt';
import Button from '@/components/ui-custom/Button';

// Icône RefreshCw
const RefreshCwIcon = (props) => (
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
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const Exercizer = ({ 
  subject, 
  context,
  contentType,
  onComplete,
  themeColor = "#0891b2", // Default teal color
  showBanner = true // Nouvelle propriété pour contrôler l'affichage de la bannière
}) => {
  const [exercise, setExercise] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('loading'); // loading, exercise, feedback, retry
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const { toast } = useToast();

  // Fetch exercise on mount or when subject changes
  useEffect(() => {
    loadExercise();
  }, [subject]);

  const loadExercise = async () => {
    setCurrentStep('loading');
    setLoading(true);
    setUserAnswers({});
    setEvaluation(null);
    
    try {
      const data = await fetchExercise(subject, context, contentType);
      setExercise(data);
      
      // Sauvegarder l'exercice dans sessionStorage pour une utilisation ultérieure
      try {
        sessionStorage.setItem('current_exercise', JSON.stringify(data));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'exercice dans sessionStorage:", error);
      }
      
      setCurrentStep('exercise');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'exercice. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error("Erreur lors du chargement de l'exercice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const result = await submitAnswers(exercise.id, userAnswers);
      setEvaluation(result);
      setExerciseCompleted(true);
      setCurrentStep('feedback');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de soumettre les réponses. Veuillez réessayer.",
        variant: "destructive"
      });
      console.error("Erreur lors de la soumission des réponses:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = (retry) => {
    if (retry) {
      toast({
        title: "Redémarrage de l'exercice",
        description: "Chargement de nouvelles questions..."
      });
      loadExercise();
    } else {
      // Log final result and notify completion
      logResult(exercise.id, evaluation.success);
      
      if (onComplete) {
        onComplete({
          subject,
          success: evaluation.success,
          score: evaluation.score
        });
      }
      
      toast({
        title: "Exercice terminé",
        description: `Vous avez terminé cet exercice de ${subject}.`
      });
    }
  };

  // Custom styling based on theme color
  const customStyles = {
    header: {
      borderLeft: `4px solid ${themeColor}`,
      paddingLeft: '1rem',
    },
    iconButton: {
      color: themeColor,
    }
  };

  // Render different states based on currentStep
  const renderContent = () => {
    switch (currentStep) {
      case 'loading':
        return <LoadingState themeColor={themeColor} />;
      
      case 'exercise':
        return (
          <ExerciseRenderer
            exercise={exercise}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            themeColor={themeColor}
            showBanner={showBanner}
          />
        );
      
      case 'feedback':
        return (
          <FeedbackDisplay
            evaluation={evaluation}
            exercise={exercise}
            userAnswers={userAnswers}
            onContinue={() => setCurrentStep('retry')}
            themeColor={themeColor}
          />
        );
      
      case 'retry':
        return (
          <RetryPrompt
            success={evaluation.success}
            score={evaluation.score}
            onRetryDecision={handleRetry}
            themeColor={themeColor}
          />
        );
      
      default:
        return <div>Une erreur s'est produite</div>;
    }
  };


  return (
    <div  className="exercizer-container w-full max-w-3xl mx-auto sm:p-6 bg-white">
      
      <div className="exercizer-content">
        {renderContent()}
      </div>

      <div className="exercizer-header mb-8 flex justify-between items-center">
        {/* <div style={customStyles.header}>
          <h2 className="text-2xl font-bold text-gray-800">
            {exercise?.title || `Exercice de ${subject}`}
          </h2>
          {exercise?.description && (
            <p className="text-gray-600 mt-2">{exercise.description}</p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Exercizer;
