
import React from 'react';
import { InfoIcon } from './icons/InfoIcon';

interface InfoPanelProps {
  description: string | null;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ description }) => {
  if (!description) {
    return null;
  }

  return (
    <div className="flex-shrink-0 bg-gray-900/60 backdrop-blur-sm border-t border-gray-700/50 p-4 z-20">
      <div className="flex items-center space-x-3">
        <InfoIcon className="h-5 w-5 text-cyan-400 flex-shrink-0" />
        <p className="text-sm text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
};
