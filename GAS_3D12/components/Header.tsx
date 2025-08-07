import React from 'react';
import { CubeIcon } from './icons/CubeIcon';

interface HeaderProps {
  version?: string | null;
}

export const Header: React.FC<HeaderProps> = ({ version }) => {
  return (
    <header className="flex-shrink-0 bg-gray-900/70 backdrop-blur-sm border-b border-gray-700/50 shadow-md z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <CubeIcon className="h-8 w-8 text-cyan-400" />
            <div className="flex items-baseline space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-100">
                Interactive 3D Viewer
              </h1>
              {version && (
                <span className="text-xs font-mono text-gray-500 select-none">
                  v{version}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};