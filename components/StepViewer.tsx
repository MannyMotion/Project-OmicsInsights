import React from 'react';
import type { Step, ChecklistState } from '../types';
import { Checklist } from './Checklist';
import { CodeSnippet } from './CodeSnippet';
import { ExportButton } from './ExportButton';
import { steps } from '../data/steps';

interface StepViewerProps {
  step: Step;
  stepIndex: number;
  checklistState: ChecklistState;
  onChecklistToggle: (stepIndex: number, itemIndex: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const StepViewer: React.FC<StepViewerProps> = ({ step, stepIndex, checklistState, onChecklistToggle, onNext, onPrev, isFirstStep, isLastStep }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-3xl font-extrabold text-base-content mb-2">{`Step ${step.id}: ${step.title}`}</h2>
        <p className="text-lg text-gray-600 mb-6">{step.longDescription}</p>

        <div className="space-y-6">
            {step.examples.map((example, index) => (
                <div key={index}>
                    <h4 className="font-semibold text-base-content mb-2">{example.title}</h4>
                    {example.type === 'code' && <CodeSnippet language={example.language || 'bash'} code={example.content} />}
                    {example.type === 'text' && <p className="text-sm bg-base-200/50 p-4 rounded-md text-gray-700 whitespace-pre-wrap font-mono">{example.content}</p>}
                    {example.type === 'image' && <img src={example.content} alt={example.title} className="rounded-lg border border-base-200" />}
                    {/* FIX: Removed invalid check for example.type === 'json'. This is now handled by example.type === 'code' */}
                </div>
            ))}
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-base-content mb-4">Your Checklist</h3>
        <Checklist
          items={step.checklist}
          stepIndex={stepIndex}
          checklistState={checklistState}
          onToggle={onChecklistToggle}
        />
      </div>
      
       {isLastStep && (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-8 text-center">
            <h3 className="text-2xl font-bold text-base-content mb-4">Project Complete!</h3>
            <p className="text-gray-600 mb-6">You've planned all the steps to build OmicsInsight. Export your project plan as a JSON file for your records.</p>
            <ExportButton steps={steps} checklistState={checklistState} />
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onPrev}
          disabled={isFirstStep}
          className="px-6 py-2 bg-white border border-base-300 rounded-md shadow-sm text-base-content font-medium hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={isLastStep}
          className="px-6 py-2 bg-primary text-primary-content rounded-md shadow-sm font-medium hover:bg-primary-focus disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};