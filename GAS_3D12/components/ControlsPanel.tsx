import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { SaveIcon } from './icons/SaveIcon';

interface ControlsPanelProps {
  onFileSelect: (file: File) => void;
  onSaveAsHtml: () => void;
  isModelLoaded: boolean;
  autoRotate: boolean;
  onAutoRotateChange: (checked: boolean) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({ 
  onFileSelect,
  onSaveAsHtml,
  isModelLoaded,
  autoRotate,
  onAutoRotateChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
    // Reset file input to allow re-uploading the same file
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <aside className="w-80 bg-gray-800/50 border-r border-gray-700/50 p-6 flex flex-col space-y-6 overflow-y-auto z-20">
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Load Model</h2>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".glb,.gltf,.obj,.stl"
          className="hidden"
        />
        <button
          onClick={handleUploadClick}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all duration-200"
        >
          <UploadIcon className="h-5 w-5 mr-2" />
          Upload Model
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">Supports .gltf, .glb, .obj, .stl</p>
      </div>

      <div className="border-t border-gray-700/50"></div>

      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-4">View Controls</h2>
        <label className="flex items-center space-x-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => onAutoRotateChange(e.target.checked)}
            className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500 transition-colors"
          />
          <span className="text-gray-300">Auto-rotate</span>
        </label>
      </div>

      <div className="border-t border-gray-700/50"></div>

      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Export Scene</h2>
        <button
          onClick={onSaveAsHtml}
          disabled={!isModelLoaded}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all duration-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <SaveIcon className="h-5 w-5 mr-2" />
          Save as HTML
        </button>
         <p className="text-xs text-gray-500 mt-2 text-center">Saves the current model into a single, shareable HTML file.</p>
      </div>

    </aside>
  );
};