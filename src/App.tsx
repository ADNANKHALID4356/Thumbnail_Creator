/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Edit3, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface ShowcaseImage {
  url: string;
  id: string;
}

export default function App() {
  const [images, setImages] = useState<ShowcaseImage[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [title, setTitle] = useState('Modern Platform Showcase');
  const [description, setDescription] = useState('Click any image to focus and explore the details of this interface design.');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ShowcaseImage[] = [];
    const remainingSlots = 5 - images.length;
    
    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      const url = URL.createObjectURL(file as Blob);
      newImages.push({ url, id: Math.random().toString(36).substr(2, 9) });
    });

    setImages(prev => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages(prev => prev.filter(img => img.id !== id));
    if (focusedIndex !== null) setFocusedIndex(null);
  };

  const resetFocus = () => {
    setFocusedIndex(null);
  };

  // Predefined professional positions for the "scattered" look
  const initialPositions = [
    { x: -150, y: -40, rotate: -8, z: 10 },
    { x: 150, y: -20, rotate: 6, z: 20 },
    { x: -50, y: 30, rotate: -4, z: 30 },
    { x: 80, y: 60, rotate: 3, z: 40 },
    { x: 0, y: -10, rotate: 0, z: 50 },
  ];

  return (
    <div 
      id="showcase-container"
      className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30 flex flex-col items-center justify-center p-8 overflow-hidden relative"
      onClick={resetFocus}
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center mb-12 w-full flex justify-center px-4"
      >
        {isEditingTitle ? (
          <div className="relative group w-full max-w-2xl">
            <input 
              autoFocus
              className="bg-zinc-900/50 border border-white/20 text-3xl md:text-5xl font-bold tracking-tight text-center outline-none focus:border-orange-500 transition-all w-full py-4 px-8 rounded-2xl shadow-2xl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              onBlur={() => setIsEditingTitle(false)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 font-bold">
              Press Enter to Save
            </div>
          </div>
        ) : (
          <h1 
            id="showcase-title"
            className="text-4xl md:text-6xl font-bold tracking-tight cursor-pointer group hover:text-white/90 transition-colors"
            onClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
          >
            {title}
            <Edit3 className="inline-block ml-3 w-6 h-6 opacity-0 group-hover:opacity-40 transition-opacity" />
          </h1>
        )}
      </motion.div>

      {/* Interactive Stage */}
      <div className="relative w-full max-w-5xl h-[420px] flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {images.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="z-50 pointer-events-auto"
            >
              <button 
                id="upload-button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="flex flex-col items-center gap-4 p-12 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-white/50" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium">Upload Screenshots</p>
                  <p className="text-sm text-white/40">Select up to 5 images to showcase</p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scattered Image Cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          {images.map((img, index) => {
            const isFocused = focusedIndex === index;
            const pos = initialPositions[index] || { x: 0, y: 0, rotate: 0, z: index };
            
            return (
              <motion.div
                key={img.id}
                layoutId={img.id}
                className={`absolute cursor-pointer pointer-events-auto rounded-xl overflow-hidden shadow-2xl transition-all ${
                  isFocused 
                    ? 'shadow-orange-500/20 ring-4 ring-orange-500/50' 
                    : 'ring-1 ring-white/20 hover:ring-white/40 shadow-black/50'
                }`}
                style={{ 
                  zIndex: isFocused ? 100 : pos.z,
                  width: 'min(80vw, 600px)',
                  aspectRatio: '16/10'
                }}
                initial={pos}
                animate={isFocused ? { 
                  x: 0, 
                  y: 0, 
                  rotate: 0, 
                  scale: 1,
                  zIndex: 100 
                } : { 
                  x: pos.x, 
                  y: pos.y, 
                  rotate: pos.rotate,
                  scale: 0.85,
                  zIndex: pos.z 
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setFocusedIndex(index);
                }}
              >
                <img 
                  src={img.url} 
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
                
                {/* Overlay controls - Only visible on the front (focused) image */}
                <AnimatePresence>
                  {isFocused && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/10 pointer-events-none flex items-start justify-end p-6"
                    >
                      <button 
                        onClick={(e) => removeImage(img.id, e)}
                        className="p-3 bg-red-500 hover:bg-red-600 rounded-full shadow-xl transition-all transform hover:scale-110 pointer-events-auto"
                        title="Delete screenshot"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Description Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="z-10 mt-4 w-full max-w-2xl text-center px-4"
      >
        {isEditingDescription ? (
          <div className="relative w-full">
            <textarea 
              autoFocus
              className="bg-zinc-900/50 border border-white/20 p-6 rounded-2xl text-lg text-white/80 text-center outline-none focus:border-orange-500 transition-all w-full resize-none h-32 shadow-2xl block"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setIsEditingDescription(false)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 font-bold whitespace-nowrap">
              Click away to Save
            </div>
          </div>
        ) : (
          <div 
            id="showcase-description"
            className="group cursor-pointer p-6 rounded-2xl hover:bg-white/5 transition-all"
            onClick={(e) => { e.stopPropagation(); setIsEditingDescription(true); }}
          >
            <p className="text-xl text-white/60 leading-relaxed max-w-xl mx-auto">
              {description}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all text-[10px] text-white/30 uppercase tracking-widest font-bold">
              <Edit3 className="w-4 h-4" /> Edit Description
            </div>
          </div>
        )}
      </motion.div>

      {/* Global Actions */}
      <div className="fixed bottom-8 right-8 flex gap-3 z-50">
        {images.length > 0 && (
          <>
            <button 
              id="reset-all-button"
              onClick={(e) => { e.stopPropagation(); setImages([]); setFocusedIndex(null); }}
              className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-full transition-all group"
              title="Clear all images"
            >
              <RotateCcw className="w-5 h-5 text-white/40 group-hover:text-red-400 group-hover:rotate-[-90deg] transition-all" />
            </button>
            <button 
              id="add-more-button"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-medium transition-all"
              disabled={images.length >= 5}
            >
              <ImageIcon className="w-5 h-5" />
              {images.length < 5 ? "Add More" : "Max (5/5)"}
            </button>
          </>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*"
        multiple
      />

      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/10 tracking-widest uppercase font-mono pointer-events-none">
        Professional Showcase Engine // Interactive Layered Canvas
      </footer>
    </div>
  );
}
