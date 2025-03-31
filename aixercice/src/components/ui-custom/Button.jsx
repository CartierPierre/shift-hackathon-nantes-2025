import React from 'react';

const Button = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'default':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'outline':
        return 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-700';
      case 'destructive':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700';
      case 'link':
        return 'bg-transparent underline text-blue-500 hover:text-blue-700';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-1 px-2.5';
      case 'default':
        return 'text-sm py-2 px-4';
      case 'lg':
        return 'text-base py-2.5 px-5';
      case 'icon':
        return 'p-2';
      default:
        return 'text-sm py-2 px-4';
    }
  };

  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const buttonClasses = `${baseStyles} ${getVariantClasses()} ${getSizeClasses()} ${disabledStyles} ${className}`;

  return (
    <button 
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 