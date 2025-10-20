
import React from 'react';
import type { ChecklistState } from '../types';

interface ChecklistProps {
  items: { text: string }[];
  stepIndex: number;
  checklistState: ChecklistState;
  onToggle: (stepIndex: number, itemIndex: number) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({ items, stepIndex, checklistState, onToggle }) => {
  return (
    <ul className="space-y-3">
      {items.map((item, itemIndex) => {
        const key = `${stepIndex}-${itemIndex}`;
        const isChecked = checklistState[key] || false;
        return (
          <li key={itemIndex}>
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(stepIndex, itemIndex)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary-focus"
              />
              <span className={`ml-3 text-base-content transition-colors group-hover:text-primary ${isChecked ? 'line-through text-gray-400' : ''}`}>
                {item.text}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
};
