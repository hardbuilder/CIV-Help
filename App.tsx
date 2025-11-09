import React, { useState, useMemo } from 'react';
import { Tool, ActiveTool } from './types';
import { TOOLS } from './constants';
import BottomNav from './components/BottomNav';
import InclinometerView from './components/InclinometerView';
import GPSView from './components/GPSView';
import ARRulerView from './components/ARRulerView';
import AIAssistantView from './components/AIAssistantView';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>('inclinometer');

  const activeToolData = useMemo(
    () => TOOLS.find((tool) => tool.id === activeTool) as Tool,
    [activeTool]
  );

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'inclinometer':
        return <InclinometerView />;
      case 'gps':
        return <GPSView />;
      case 'arRuler':
        return <ARRulerView />;
      case 'aiAssistant':
        return <AIAssistantView />;
      default:
        return <InclinometerView />;
    }
  };

  return (
    <div className="h-screen w-screen bg-brand-primary flex flex-col font-sans overflow-hidden">
      <header className="bg-brand-secondary p-4 shadow-lg flex items-center justify-start z-10">
        <div className="flex items-center space-x-4">
            <div className="text-brand-cyan">{activeToolData.icon}</div>
            <h1 className="text-xl font-medium text-brand-text tracking-wide">{activeToolData.name}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 bg-brand-primary">
        {renderActiveTool()}
      </main>

      <BottomNav activeTool={activeTool} setActiveTool={setActiveTool} />
    </div>
  );
};

export default App;