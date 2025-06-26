import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SettingsCard = ({
  id,
  title,
  description,
  icon: Icon,
  bgColor,
  border,
  iconColor,
  textColor,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className={`rounded-xl border ${border} ${bgColor} p-4 sm:p-6 transition-all duration-300`}>
      <button
        onClick={() => onToggle(id)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${iconColor} bg-opacity-20`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="mt-6 transition-opacity duration-500 ease-in-out opacity-100">
          {children}
        </div>
      )}
    </div>
  );
};

export default SettingsCard;
