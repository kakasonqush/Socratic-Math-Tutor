
import React from 'react';
import { Lightbulb, FunctionSquare, Binary, PieChart } from 'lucide-react';

interface ExampleProblem {
  id: string;
  label: string;
  text: string;
  icon: React.ReactNode;
  color: string;
}

const EXAMPLES: ExampleProblem[] = [
  {
    id: 'alg-1',
    label: 'Algebra',
    text: 'Solve for x: 3(x - 4) = 15',
    icon: <Binary size={16} />,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    id: 'calc-1',
    label: 'Calculus',
    text: 'Find the derivative of f(x) = x² * sin(x)',
    icon: <FunctionSquare size={16} />,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  {
    id: 'trig-1',
    label: 'Trigonometry',
    text: 'If sin(θ) = 0.5, what is θ in the first quadrant?',
    icon: <PieChart size={16} />,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    id: 'logic-1',
    label: 'Word Problem',
    text: 'A train leaves at 60mph. Another leaves 2 hours later at 80mph. When do they meet?',
    icon: <Lightbulb size={16} />,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
];

interface ExampleProblemsProps {
  onSelect: (text: string) => void;
}

export const ExampleProblems: React.FC<ExampleProblemsProps> = ({ onSelect }) => {
  return (
    <div className="mt-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {EXAMPLES.map((example) => (
        <button
          key={example.id}
          onClick={() => onSelect(example.text)}
          className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left group"
        >
          <div className={`flex items-center gap-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 border ${example.color}`}>
            {example.icon}
            {example.label}
          </div>
          <p className="text-sm text-slate-700 font-medium group-hover:text-indigo-700 transition-colors">
            {example.text}
          </p>
        </button>
      ))}
    </div>
  );
};
