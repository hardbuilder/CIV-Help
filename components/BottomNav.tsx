import React from 'react';
import { ActiveTool } from '../types';
import { TOOLS } from '../constants';

interface BottomNavProps {
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTool, setActiveTool }) => {
  return (
    <nav className="bg-brand-secondary shadow-t-lg sticky bottom-0 left-0 right-0 z-20">
      <div className="mx-auto flex justify-around max-w-md">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`flex flex-col items-center justify-center w-full py-2 transition-colors duration-300 relative ${
              activeTool === tool.id ? 'text-brand-cyan' : 'text-brand-light hover:text-brand-text'
            }`}
          >
            <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-300 rounded-full px-5 py-1 ${activeTool === tool.id ? 'bg-brand-cyan/20' : ''}`}>
              {tool.icon}
              <span className={`text-xs mt-1 font-medium ${activeTool === tool.id ? 'text-brand-cyan' : ''}`}>{tool.name}</span>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;