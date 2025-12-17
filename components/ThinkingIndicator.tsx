import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl w-fit animate-pulse border border-indigo-100">
      <BrainCircuit className="w-5 h-5 text-indigo-600 animate-bounce" />
      <div className="flex flex-col">
        <span className="text-indigo-800 text-sm font-medium">Analyzing the problem...</span>
        <span className="text-indigo-500 text-xs">Thinking deeply about the best way to explain this.</span>
      </div>
    </div>
  );
};
