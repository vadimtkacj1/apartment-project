import React from 'react';

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  text?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  type = "button", 
  text, 
  children,
  variant = "primary",
  size = "md",
  className, 
  style, 
  onClick 
}) => {
  const baseClasses = "rounded-lg font-medium transition-colors";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  const combinedClassName = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ''}`.trim();

  return (
    <button
      type={type}
      className={combinedClassName}
      style={style}
      onClick={onClick}
    >
      {children || text}
    </button>
  );
};

export default Button;