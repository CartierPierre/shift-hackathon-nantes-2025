import React from 'react';
import Button from '@/components/ui-custom/Button';

const RetryPrompt = ({ success, score, onRetryDecision, themeColor = "#0891b2" }) => {
  const buttonStyle = {
    backgroundColor: themeColor,
    borderColor: themeColor,
    color: "#ffffff",
  };

  return (
    <div className="text-center py-8">
      <h3 className="text-2xl font-bold mb-2">
        {success ? 'Bravo !' : 'Continuez à vous entraîner !'}
      </h3>
      
      <p className="text-lg text-gray-600 mb-6">
        {success 
          ? `Vous avez obtenu ${score}%. Voulez-vous essayer un autre exercice ?` 
          : `Vous avez obtenu ${score}%. Voulez-vous réessayer ?`}
      </p>
      
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => onRetryDecision(false)}
          className="border-gray-300 hover:bg-gray-100 px-8 py-2"
        >
          Abandonner
        </Button>
        
        <Button
          onClick={() => onRetryDecision(true)}
          style={buttonStyle}
          className="px-8 py-2 rounded-md hover:opacity-90 transition-opacity duration-200"
        >
          {success ? 'Suivant' : 'Réessayer'}
        </Button>
      </div>
    </div>
  );
};

export default RetryPrompt;
