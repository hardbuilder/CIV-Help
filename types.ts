import React from 'react';

export type ActiveTool = 'inclinometer' | 'gps' | 'arRuler' | 'aiAssistant';

export interface Tool {
  id: ActiveTool;
  name: string;
  icon: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
}