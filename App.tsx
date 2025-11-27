import React, { useState, useCallback } from 'react';
import { generatePixelAsset } from './services/geminiService';
import { GeneratedAsset, GenerationStatus } from './types';
import { AssetPreview } from './components/AssetPreview';
import { Button } from './components/Button';

// Default prompt based on user request: 
// "Pumpkin button with 'Start' written in vines"
const DEFAULT_PROMPT = "Pixel art button shaped like a wide orange pumpkin. The text 'START' is written across the front of the pumpkin using twisted green vines and leaves. The vines form the letters legibly. 16-bit retro game style, cute aesthetic, slight shading, white background.";

export default function App() {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [currentAsset, setCurrentAsset] = useState<GeneratedAsset | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setStatus(GenerationStatus.LOADING);
    setError(null);

    try {
      const imageUrl = await generatePixelAsset(prompt);
      
      const newAsset: GeneratedAsset = {
        id: crypto.randomUUID(),
        imageUrl,
        prompt,
        timestamp: Date.now(),
      };

      setCurrentAsset(newAsset);
      setStatus(GenerationStatus.SUCCESS);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to generate asset. Please check your API key and try again.");
      setStatus(GenerationStatus.ERROR);
    }
  }, [prompt]);

  const handleDownload = useCallback(() => {
    if (!currentAsset) return;
    const link = document.createElement('a');
    link.href = currentAsset.imageUrl;
    link.download = `pixel-pumpkin-${currentAsset.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentAsset]);

  const handlePresetClick = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎃</span>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">
              PixelForge
            </h1>
          </div>
          <div className="text-xs font-mono text-zinc-500">
            Powered by Gemini 2.5 Flash Image
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Controls */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm">
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Asset Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none placeholder-zinc-600"
              placeholder="Describe your pixel art asset..."
            />
            
            <div className="mt-4 flex flex-wrap gap-2">
               <button 
                onClick={() => handlePresetClick("A pixel art UI button shaped like a pumpkin with vine 'START' text.")}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-2 py-1 rounded border border-zinc-700 transition-colors"
               >
                 Default Pumpkin
               </button>
               <button 
                onClick={() => handlePresetClick("A purple potion bottle with a cork, pixel art style.")}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-2 py-1 rounded border border-zinc-700 transition-colors"
               >
                 Potion
               </button>
               <button 
                onClick={() => handlePresetClick("A golden pixel art chest with jewels spilling out.")}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-2 py-1 rounded border border-zinc-700 transition-colors"
               >
                 Chest
               </button>
            </div>

            <div className="mt-6">
              <Button 
                onClick={handleGenerate} 
                className="w-full" 
                isLoading={status === GenerationStatus.LOADING}
              >
                Generate Asset
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-xs">
                {error}
              </div>
            )}
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
             <h3 className="text-sm font-semibold text-zinc-300 mb-3">Tips for Pixel Art</h3>
             <ul className="text-xs text-zinc-500 space-y-2 list-disc list-inside">
               <li>Specify "Solid background" for easier editing later.</li>
               <li>Use "Front facing" for UI elements.</li>
               <li>Mention "16-bit" or "32-bit" for specific retro styles.</li>
             </ul>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="w-full md:w-2/3 flex flex-col">
           <AssetPreview asset={currentAsset} onDownload={handleDownload} />
        </div>

      </main>
    </div>
  );
}