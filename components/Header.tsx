
import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  progress: number;
  currentStepTitle: string;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ progress, currentStepTitle, toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden mr-4 p-2 rounded-md hover:bg-base-200">
          <Menu size={24} />
        </button>
        <div className="flex items-center">
            <div className="bg-primary p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-content"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6"></path><path d="M9 15h6"></path></svg>
            </div>
            <div>
                 <h1 className="text-xl font-bold text-base-content">OmicsInsight Builder</h1>
                 <p className="text-sm text-gray-500 hidden md:block">{currentStepTitle}</p>
            </div>
        </div>
      </div>
      <div className="flex items-center w-1/3 max-w-xs">
        <span className="text-sm font-medium mr-2 hidden sm:inline">{progress}%</span>
        <div className="w-full bg-base-200 rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </header>
  );
};
