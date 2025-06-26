import React, { useState } from 'react';
import SettingsCard from './SettingsCard';

const SettingsCardsList = ({ cards }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const toggleSection = (sectionId) => {
    setActiveSection((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <div className="space-y-6">
      {cards.map(({ id, title, description, icon, bgColor, border, iconColor, textColor, content }) => (
        <SettingsCard
          key={id}
          id={id}
          title={title}
          description={description}
          icon={icon}
          bgColor={bgColor}
          border={border}
          iconColor={iconColor}
          textColor={textColor}
          isOpen={activeSection === id}
          onToggle={toggleSection}
        >
          <div className={isFadingOut ? 'fade-out' : 'fade-in'}>
            {content}
          </div>
        </SettingsCard>
      ))}
    </div>
  );
};

export default SettingsCardsList;
