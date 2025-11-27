import React from 'react';
import { GeneratedAsset } from '../types';
import { Button } from './Button';

interface AssetPreviewProps {
  asset: GeneratedAsset | null;
  onDownload: () => void;
}

export const AssetPreview: React.FC<AssetPreviewProps> = ({ asset, onDownload }) => {
  if (!asset) {
    return (
      <div className="w-full h-96 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/50">
        <div className="w-16 h-16 mb-4 opacity-20">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <p>No asset generated yet.</p>
        <p className="text-sm opacity-60 mt-2">Enter a prompt to start.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative w-full max-w-md bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl p-8 flex items-center justify-center">
           {/* Checkerboard background for transparency visualization */}
           <div className="absolute inset-0 z-0 opacity-20" 
                style={{
                  backgroundImage: `linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)`,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}>
           </div>

           {/* The Asset */}
           <img 
            src={asset.imageUrl} 
            alt="Generated Pixel Art" 
            className="render-pixelated z-10 w-64 h-64 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform transition-transform hover:scale-105 duration-300"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Button onClick={onDownload} variant="secondary">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download .PNG
          </span>
        </Button>
      </div>
      
      <div className="mt-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800 max-w-lg w-full">
         <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Prompt Used</p>
         <p className="text-sm text-zinc-300 italic">"{asset.prompt}"</p>
      </div>
    </div>
  );
};