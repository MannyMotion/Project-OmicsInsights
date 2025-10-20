
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { StepViewer } from './components/StepViewer';
import { Header } from './components/Header';
import { useLocalStorage } from './hooks/useLocalStorage';
import { steps } from './data/steps';
import type { ChecklistState } from './types';

const App: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useLocalStorage<number>('omicsinsight-current-step', 0);
  const [checklistState, setChecklistState] = useLocalStorage<ChecklistState>('omicsinsight-checklist', {});
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleChecklistItemToggle = (stepIndex: number, itemIndex: number) => {
    const key = `${stepIndex}-${itemIndex}`;
    setChecklistState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const progress = useMemo(() => {
    const totalItems = steps.reduce((acc, step) => acc + step.checklist.length, 0);
    const completedItems = Object.values(checklistState).filter(Boolean).length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [checklistState]);

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="flex h-screen bg-base-100 text-base-content font-sans">
      <Sidebar
        steps={steps}
        currentStepIndex={currentStepIndex}
        setCurrentStepIndex={setCurrentStepIndex}
        checklistState={checklistState}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          progress={progress} 
          currentStepTitle={steps[currentStepIndex].title} 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <StepViewer
            step={steps[currentStepIndex]}
            stepIndex={currentStepIndex}
            checklistState={checklistState}
            onChecklistToggle={handleChecklistItemToggle}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            isFirstStep={currentStepIndex === 0}
            isLastStep={currentStepIndex === steps.length - 1}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
