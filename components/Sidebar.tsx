
import React from 'react';
import type { Step, ChecklistState } from '../types';
import { CheckCircle, Circle, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  steps: Step[];
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  checklistState: ChecklistState;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ steps, currentStepIndex, setCurrentStepIndex, checklistState, isOpen, setIsOpen }) => {
  
  const getStepProgress = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step.checklist || step.checklist.length === 0) return { completed: 0, total: 0, isComplete: false };

    const total = step.checklist.length;
    const completed = step.checklist.reduce((acc, _, itemIndex) => {
      return checklistState[`${stepIndex}-${itemIndex}`] ? acc + 1 : acc;
    }, 0);
    
    return { completed, total, isComplete: completed === total };
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`bg-white text-base-content w-72 flex-shrink-0 flex flex-col border-r border-base-200 transform transition-transform duration-300 ease-in-out z-40 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-base-200 flex justify-between items-center">
          <h2 className="text-lg font-bold">Project Steps</h2>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 rounded-md hover:bg-base-200">
            <ChevronLeft size={24} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {steps.map((step, index) => {
              const { completed, total, isComplete } = getStepProgress(index);
              const isActive = index === currentStepIndex;

              return (
                <li key={step.id} className="border-b border-base-200">
                  <button
                    onClick={() => setCurrentStepIndex(index)}
                    className={`w-full text-left p-4 flex items-start transition-colors duration-200 ${isActive ? 'bg-primary/10 text-primary-focus' : 'hover:bg-base-200/50'}`}
                  >
                    <div className="pr-4">
                      {isComplete ? <CheckCircle className="text-primary" size={20} /> : <Circle className="text-base-300" size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isActive ? 'text-primary' : ''}`}>{`Step ${step.id}: ${step.title}`}</p>
                      <p className="text-xs text-gray-500">{step.description}</p>
                      {total > 0 && (
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span>{`${completed}/${total}`}</span>
                          <div className="w-full bg-base-200 rounded-full h-1 ml-2">
                             <div className="bg-primary h-1 rounded-full" style={{ width: `${(completed / total) * 100}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
