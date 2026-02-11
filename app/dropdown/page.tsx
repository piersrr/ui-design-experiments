'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings2,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Bell,
  Sparkles
} from 'lucide-react';

// Bloom Colors
const BLOOM_COLORS = [
  { name: 'Cyber Blue', value: '#3b82f6', glow: 'rgba(59, 130, 246, 0.6)' },
  { name: 'Neon Purple', value: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' },
  { name: 'Matrix Green', value: '#22c55e', glow: 'rgba(34, 197, 94, 0.6)' },
  { name: 'Solar Orange', value: '#f97316', glow: 'rgba(249, 115, 22, 0.6)' },
  { name: 'Crimson Red', value: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)' },
];

const MENU_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

export default function BloomDropdownPage() {
  const [isOpen, setIsOpen] = useState(false);

  // Customization State
  const [bloomIntensity, setBloomIntensity] = useState(0.8);
  const [activeColor, setActiveColor] = useState(BLOOM_COLORS[0]);
  const [animationType, setAnimationType] = useState<'spring' | 'smooth'>('spring');
  const [glassEffect, setGlassEffect] = useState(true);

  // Dynamic Styles
  const bloomStyle = {
    boxShadow: isOpen
      ? `0 0 ${20 * bloomIntensity}px ${5 * bloomIntensity}px ${activeColor.glow}, 
         0 0 ${40 * bloomIntensity}px ${10 * bloomIntensity}px ${activeColor.glow}`
      : 'none',
  };

  const buttonBloomStyle = {
    boxShadow: isOpen || bloomIntensity > 0.5
      ? `0 0 ${15 * bloomIntensity}px ${2 * bloomIntensity}px ${activeColor.glow}`
      : 'none',
  };

  return (
    <div className={`flex min-h-screen bg-black text-white selection:bg-${activeColor.name.split(' ')[1].toLowerCase()}-500/30`}>

      {/* Settings Panel */}
      <aside className="w-80 border-r border-zinc-800 bg-zinc-950 p-8 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Bloom Dropdown
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Highly customizable glowing dropdown with smooth animations.
          </p>
        </div>

        {/* Intensity Control */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-zinc-300">Bloom Intensity</label>
            <span className="text-xs font-mono text-zinc-500">{(bloomIntensity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.1"
            value={bloomIntensity}
            onChange={(e) => setBloomIntensity(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        {/* Color Selection */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-300">Bloom Color</label>
          <div className="grid grid-cols-5 gap-2">
            {BLOOM_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => setActiveColor(color)}
                className={`w-8 h-8 rounded-full transition-all duration-300 ${activeColor.name === color.name ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                style={{ backgroundColor: color.value, boxShadow: `0 0 10px ${color.glow}` }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Animation & Effect Toggles */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-zinc-300">Configuration</label>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setAnimationType(prev => prev === 'spring' ? 'smooth' : 'spring')}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
            >
              <span className="text-sm text-zinc-300">Animation Type</span>
              <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-950 text-zinc-400 uppercase">
                {animationType}
              </span>
            </button>

            <button
              onClick={() => setGlassEffect(!glassEffect)}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
            >
              <span className="text-sm text-zinc-300">Glassmorphism</span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${glassEffect ? 'bg-white' : 'bg-zinc-700'}`}>
                <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-black transition-transform ${glassEffect ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden bg-black">

        {/* Ambient Background Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none blur-[100px] transition-colors duration-700"
          style={{ backgroundColor: activeColor.value }}
        />

        <div className="relative">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              relative z-20 flex items-center gap-2 px-6 py-3 rounded-full 
              text-white font-medium transition-all duration-300
              ${glassEffect ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-zinc-900 border border-zinc-800'}
            `}
            style={buttonBloomStyle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4" style={{ color: activeColor.value }} />
            <span>Actions</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 opacity-70" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, y: 10, filter: 'blur(10px)' }}
                transition={
                  animationType === 'spring'
                    ? { type: 'spring', stiffness: 400, damping: 25 }
                    : { duration: 0.2, ease: 'easeOut' }
                }
                className={`
                  absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 p-2 
                  rounded-2xl border overflow-hidden z-10
                  ${glassEffect ? 'bg-black/40 backdrop-blur-xl border-white/10' : 'bg-zinc-900 border-zinc-800'}
                `}
                style={bloomStyle}
              >
                <div className="flex flex-col gap-1">
                  {MENU_ITEMS.map((item, i) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl 
                        text-sm font-medium text-zinc-300 
                        hover:text-white transition-all group relative overflow-hidden
                      `}
                      whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    >
                      <item.icon
                        className="w-4 h-4 transition-colors duration-300"
                        style={{ color: activeColor.value }} // Icon always colored 
                      />
                      <span className="z-10 relative">{item.label}</span>

                      {/* Hover Glow on Item */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                        style={{ backgroundColor: activeColor.value }}
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
