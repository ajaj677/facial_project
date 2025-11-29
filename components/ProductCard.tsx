import React from 'react';
import { ProductRecommendation } from '../types';

interface ProductCardProps {
  product: ProductRecommendation;
  type: 'foundation' | 'concealer' | 'blush' | 'lipstick';
  delay: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, type, delay }) => {
  const getBgColor = () => {
    switch (type) {
      case 'foundation': return 'bg-stone-50';
      case 'concealer': return 'bg-orange-50/50';
      case 'blush': return 'bg-rose-50';
      case 'lipstick': return 'bg-red-50/50';
      default: return 'bg-white';
    }
  };

  const getBorderRadius = () => {
    // Intentional imperfection
    const corners = [
      'rounded-tl-[20px] rounded-tr-[10px] rounded-bl-[10px] rounded-br-[20px]',
      'rounded-tl-[15px] rounded-tr-[25px] rounded-bl-[20px] rounded-br-[15px]',
      'rounded-tl-[10px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[10px]',
    ];
    return corners[Math.floor(Math.random() * corners.length)];
  };

  return (
    <div 
      className={`relative p-6 ${getBgColor()} border border-stone-100 shadow-lg shadow-stone-200/40 hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-in ${getBorderRadius()}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="absolute top-4 right-4 text-stone-300">
        {/* Simple decorative dot */}
        <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>
      </div>
      
      <div className="flex flex-col h-full">
        <span className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-1">{product.brand}</span>
        <h3 className="text-lg font-serif text-stone-800 leading-tight mb-2">{product.productName}</h3>
        
        <div className="mt-auto pt-4 border-t border-stone-200/60 border-dashed">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-rose-200 border border-stone-100 shadow-inner"></div>
            <span className="font-semibold text-stone-700">{product.shade}</span>
          </div>
          <p className="text-sm text-stone-500 font-light leading-relaxed font-hand text-lg">
            "{product.reason}"
          </p>
        </div>
      </div>
    </div>
  );
};
