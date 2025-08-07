import React, { useState, useCallback, useEffect } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { Viewer } from './components/Viewer';
import { Header } from './components/Header';
import { InfoPanel } from './components/InfoPanel';
import { generateHtmlForModel } from './lib/htmlGenerator';

export default function App() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelExt, setModelExt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(
    'Upload a .gltf, .glb, .obj, or .stl model to view it.'
  );
  const [version, setVersion] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  useEffect(() => {
    fetch('/metadata.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.version) {
          setVersion(data.version);
        }
      })
      .catch((err) => console.error('Failed to load app version:', err));
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension && ['glb', 'gltf', 'obj', 'stl'].includes(extension)) {
        const url = URL.createObjectURL(file);
        setModelUrl(url);
        setModelFile(file);
        setModelExt(extension);
        setError(null);
        setMessage(`Viewing model: ${file.name}`);
      } else {
        setError('Invalid file type. Please upload a .glb, .gltf, .obj, or .stl file.');
        setMessage('Upload failed. Please try again with a valid file type.');
        setModelUrl(null);
        setModelFile(null);
        setModelExt(null);
      }
    }
  }, []);

  const handleSaveAsHtml = async () => {
    if (!modelFile) {
      setError("No model loaded to save.");
      return;
    }

    setMessage("Preparing HTML file for download...");
    setError(null);

    try {
      const modelDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(modelFile);
      });

      const modelName = modelFile.name;
      const htmlContent = generateHtmlForModel(modelDataUrl, modelName);
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const fileName = modelName.substring(0, modelName.lastIndexOf('.')) || modelName;
      link.download = `${fileName}.html`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(link.href);
      
      setMessage(`Successfully saved ${fileName}.html`);

    } catch (err) {
      console.error("Failed to save HTML file:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to save HTML file: ${errorMessage}`);
      setMessage("Save failed.");
    }
  };


  return (
    <div className="flex flex-col h-screen bg-gray-900 font-sans">
      <Header version={version} />
      <div className="flex flex-1 overflow-hidden">
        <ControlsPanel 
          onFileSelect={handleFileSelect}
          onSaveAsHtml={handleSaveAsHtml}
          isModelLoaded={modelFile !== null}
          autoRotate={autoRotate}
          onAutoRotateChange={setAutoRotate}
        />
        <main className="flex-1 flex flex-col relative">
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-500/90 text-white py-2 px-4 rounded-lg shadow-lg">
              {error}
            </div>
          )}
          <div className="flex-1 relative bg-gray-800">
            <Viewer modelUrl={modelUrl} modelExt={modelExt} autoRotate={autoRotate} />
          </div>
          <InfoPanel description={message} />
        </main>
      </div>
    </div>
  );
}