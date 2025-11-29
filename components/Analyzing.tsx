import React, { useEffect, useState } from 'react';

export const Analyzing: React.FC = () => {
  const [msg, setMsg] = useState("Scanning light...");
  
  useEffect(() => {
    const messages = [
      "Measuring undertones...",
      "Analyzing texture...",
      "Matching pigment...",
      "Curating your collection..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setMsg(messages[i]);
      i = (i + 1) % messages.length;
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-rose-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute inset-0 border-4 border-rose-100 rounded-full animate-spin duration-[3s]" style={{borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%'}}></div>
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-sm organic-blob">
           <div className="w-16 h-16 bg-gradient-to-tr from-orange-100 to-rose-100 rounded-full opacity-60 animate-pulse"></div>
        </div>
      </div>
      
      <h3 className="text-2xl font-serif text-stone-700 mb-2">Just a moment</h3>
      <p className="text-stone-400 font-hand text-xl animate-bounce">{msg}</p>
    </div>
  );
};
