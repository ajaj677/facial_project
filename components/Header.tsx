import React from 'react';
import { BrushIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center z-10 relative">
      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
        <div className="p-2 bg-rose-100 rounded-full group-hover:rotate-12 transition-transform duration-300">
          <BrushIcon />
        </div>
        <span className="text-2xl font-semibold tracking-tight text-stone-800">
          Velvet<span className="text-rose-400 font-hand text-3xl ml-1">Match</span>
        </span>
      </div>
      
      <div className="hidden md:flex gap-8 text-stone-500 font-medium">
        <a href="#" className="hover:text-rose-400 transition-colors">How it Works</a>
        <a href="#" className="hover:text-rose-400 transition-colors">Our Ethos</a>
        <a href="#" className="hover:text-rose-400 transition-colors">Stories</a>
      </div>
    </nav>
  );
};
