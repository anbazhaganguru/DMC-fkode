import React from 'react';
import TherapyCard from '../../components/therapy/TherapyCard';
import { therapyData } from '../../data/therapy';

export const Therapy = () => {
  return (
    <div id="therapy" className="cinematic-overlay-content">
      <h2>Therapy Section</h2>
      <p>Cinematic sequence through lab equipment with layered treatment cards.</p>
      <div className="therapy-cards-grid">
        {therapyData.map((item) => (
          <TherapyCard
            key={item.id}
            title={item.title}
            description={item.description}
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
};

export default Therapy;
