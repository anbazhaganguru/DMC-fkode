import React from 'react';

export const TherapyCard = ({
  title = 'Therapy Title',
  description = 'Therapy Description Placeholder',
  category,
  className = ''
}) => {
  return (
    <article className={`therapy-card ${className}`.trim()}>
      {category && <span className="therapy-card__category">{category}</span>}
      <h3 className="therapy-card__title">{title}</h3>
      <p className="therapy-card__description">{description}</p>
    </article>
  );
};

export default TherapyCard;
