import React from 'react';

export const SectionLabel = ({
  number,
  text,
  className = ''
}) => {
  return (
    <div className={`section-label ${className}`.trim()}>
      {number && <span className="section-label__number">{number}</span>}
      {text && <span className="section-label__text">{text}</span>}
    </div>
  );
};

export default SectionLabel;
