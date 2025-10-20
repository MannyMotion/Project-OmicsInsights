
import React from 'react';
import type { Step, ChecklistState } from '../types';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  steps: Step[];
  checklistState: ChecklistState;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ steps, checklistState }) => {

  const handleExport = () => {
    const exportData = {
      projectName: "OmicsInsight SaaS Plan",
      exportDate: new Date().toISOString(),
      steps: steps.map((step, stepIndex) => ({
        ...step,
        checklist: step.checklist.map((item, itemIndex) => ({
          text: item.text,
          completed: !!checklistState[`${stepIndex}-${itemIndex}`]
        }))
      }))
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'omicsinsight-plan.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center px-6 py-3 bg-secondary text-white rounded-md shadow-sm font-medium hover:bg-secondary/90 transition-colors"
    >
      <Download size={20} className="mr-2" />
      Export Project as JSON
    </button>
  );
};
