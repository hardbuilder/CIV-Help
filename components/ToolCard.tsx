import React from 'react';

interface ToolCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, value, unit, icon }) => {
  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-lg flex items-center space-x-4">
      {icon && <div className="text-brand-cyan">{icon}</div>}
      <div className="flex-1">
        <h3 className="text-sm font-medium text-brand-light uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-bold text-brand-text">
          {value} <span className="text-lg text-brand-light">{unit}</span>
        </p>
      </div>
    </div>
  );
};

export default ToolCard;