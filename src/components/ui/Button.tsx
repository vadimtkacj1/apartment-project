import React from 'react';

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  text: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  type = "button", 
  text, 
  className, 
  style, 
  onClick 
}) => {
  return (
    <button
      type={type}
      className={className}
      style={style}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;