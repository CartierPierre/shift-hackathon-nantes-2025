import React from 'react';

const MediaQuestion = ({ question, value, onChange, themeColor = "#0891b2" }) => {
  const renderMedia = () => {
    switch (question.mediaType) {
      case 'image':
        return (
          <img 
            src={question.mediaSrc} 
            alt="Question media" 
            className="max-w-full h-auto max-h-80 mb-4 rounded-md"
          />
        );
        
      case 'video':
        return (
          <video 
            src={question.mediaSrc} 
            controls 
            className="max-w-full h-auto max-h-80 mb-4 rounded-md"
          >
            Your browser does not support the video tag.
          </video>
        );
        
      case 'audio':
        return (
          <audio 
            src={question.mediaSrc} 
            controls 
            className="w-full mb-4"
          >
            Your browser does not support the audio tag.
          </audio>
        );
        
      default:
        return (
          <div className="p-4 bg-red-100 text-red-800 rounded-md mb-4">
            Unknown media type: {question.mediaType}
          </div>
        );
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
      
      {renderMedia()}
      
      <h3 className="text-lg font-medium text-gray-900 mb-4">{question.prompt}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input 
              type="radio" 
              id={`${question.id}-option-${index}`} 
              name={`question-${question.id}`}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="h-4 w-4 cursor-pointer"
              style={{ accentColor: themeColor }}
            />
            <label 
              htmlFor={`${question.id}-option-${index}`}
              className="text-base cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaQuestion;
