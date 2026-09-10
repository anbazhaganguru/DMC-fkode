import React from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`dwc-button dwc-button--${variant} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
