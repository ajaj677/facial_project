import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadIcon, CameraIcon, LipstickIcon } from './components/Icons';
import { Analyzing } from './components/Analyzing';
import { ProductCard } from './components/ProductCard';
import { analyzeImage, fileToGenerativePart } from './services/geminiService';
import { AppState, AnalysisResult } from './types';

function App() {
  const [state, setState] = useState<AppState>('home');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setState('analyzing');
    setErrorMsg(null);

    try {
      const base64Data = await fileToGenerativePart(file);
      const analysis = await analyzeImage(base64Data);
      setResult(analysis);
      setState('results');
    } catch (err) {
      console.error(err);
      setErrorMsg("We couldn't quite see that clearly. Please try a well-lit photo.");
      setState('error');
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const reset = () => {
    setState('home');
    setResult(null);
    setImagePreview(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-rose-100">
      {/* Organic Background Shapes */}
      <div className="fixed -top-20 -left-20 w-96 h-96 bg-stone-100 rounded-full blur-3xl opacity-60 -z-10 animate-pulse"></div>
      <div className="fixed top-40 -right-20 w-[30rem] h-[30rem] bg-rose-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      
      <Header />

      <main className="max-w-6xl mx-auto px-6 pb-20 pt-8">
        
        {state === 'home' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl mx-auto animate-fade-in-up">
            <span className="font-hand text-3xl text-rose-400 mb-4 transform -rotate-2 inline-block">Reveal your radiance</span>
            <h1 className="text-5xl md:text-7xl font-light text-stone-800 mb-8 tracking-tight leading-tight">
              Find Your <br/>
              <span className="font-serif italic text-stone-600">Perfect Match.</span>
            </h1>
            
            <p className="text-lg text-stone-500 mb-12 max-w-md font-light">
              Upload a selfie in natural light. We'll analyze your unique undertones to curate your personal beauty wardrobe.
            </p>

            {/* Upload Zone */}
            <div 
              onDrop={onDrop}
              onDragOver={onDragOver}
              className="w-full max-w-lg aspect-video md:aspect-[2/1] bg-white rounded-[2rem] border-2 border-dashed border-stone-200 hover:border-rose-300 transition-all cursor-pointer shadow-xl shadow-stone-100 hover:shadow-2xl hover:shadow-rose-100/50 flex flex-col items-center justify-center gap-4 group relative overflow-hidden"
            >
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              />
              
              <div className="p-4 bg-stone-50 rounded-full group-hover:scale-110 transition-transform duration-300">
                <UploadIcon />
              </div>
              <div className="text-stone-400 font-medium group-hover:text-stone-600 transition-colors">
                Drop your photo here or <span className="text-rose-400 underline decoration-wavy decoration-1 underline-offset-4">browse</span>
              </div>
            </div>

            <p className="mt-8 text-sm text-stone-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Privacy first. Photos are processed instantly and never stored.
            </p>
          </div>
        )}

        {state === 'analyzing' && <Analyzing />}

        {state === 'error' && (
           <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
             <div className="text-4xl mb-4">🙈</div>
             <h2 className="text-2xl font-serif text-stone-700 mb-2">Oops!</h2>
             <p className="text-stone-500 mb-6">{errorMsg}</p>
             <button onClick={reset} className="px-6 py-2 bg-stone-800 text-stone-50 rounded-full hover:bg-stone-700 transition-colors">Try Again</button>
           </div>
        )}

        {state === 'results' && result && (
          <div className="animate-fade-in space-y-16">
            
            {/* Top Analysis Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                 {/* Photo Frame */}
                <div className="absolute inset-0 bg-stone-900 rounded-[2.5rem] rotate-1 opacity-5 transition-transform group-hover:rotate-2"></div>
                <img 
                  src={imagePreview || ''} 
                  alt="Your selfie" 
                  className="relative w-full aspect-[4/5] object-cover rounded-[2rem] shadow-2xl shadow-stone-200"
                />
                <button 
                  onClick={reset}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-105 transition-transform text-stone-600 z-10"
                  title="Start Over"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-sm font-bold tracking-widest text-stone-400 uppercase mb-2">Analysis Complete</h2>
                  <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
                    You have <span className="text-rose-400 italic">{result.undertone}</span> undertones.
                  </h1>
                  <p className="text-lg text-stone-600 leading-relaxed font-light">
                    {result.skinTexture}. Based on your unique complexion, we've curated a selection of products to enhance your natural glow, not hide it.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-stone-100 shadow-xl shadow-stone-100/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FCD3C1] to-[#E6B9A6] shadow-inner ring-4 ring-stone-50"></div>
                    <div>
                      <div className="text-xs text-stone-400 font-bold uppercase">Your Match</div>
                      <div className="text-xl text-stone-800 font-serif">{result.skinTone}</div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-stone-100 my-4"></div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl mb-1">✨</div>
                      <div className="text-xs text-stone-500">Natural</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">💧</div>
                      <div className="text-xs text-stone-500">Dewy</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">🌸</div>
                      <div className="text-xs text-stone-500">Soft</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto">
                <span className="font-hand text-2xl text-rose-400 block mb-2">Handpicked for you</span>
                <h3 className="text-3xl font-serif text-stone-800">Your Custom Routine</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {result.foundations.map((p, i) => (
                  <ProductCard key={i} product={p} type="foundation" delay={i * 100} />
                ))}
                {result.concealers.map((p, i) => (
                  <ProductCard key={i} product={p} type="concealer" delay={300 + i * 100} />
                ))}
                {result.blushes.map((p, i) => (
                  <ProductCard key={i} product={p} type="blush" delay={500 + i * 100} />
                ))}
                {result.lipsticks.map((p, i) => (
                  <ProductCard key={i} product={p} type="lipstick" delay={700 + i * 100} />
                ))}
              </div>
            </div>

            <div className="text-center pb-20 pt-10">
              <button 
                onClick={reset} 
                className="inline-flex items-center gap-2 px-8 py-4 bg-stone-800 text-stone-50 rounded-full hover:bg-stone-700 transition-all hover:scale-105 shadow-xl shadow-stone-300"
              >
                <CameraIcon />
                <span>Analyze Another Photo</span>
              </button>
            </div>

          </div>
        )}
      </main>

      <footer className="text-center py-12 text-stone-400 text-sm font-light">
        <p>&copy; {new Date().getFullYear()} VelvetMatch. Crafted with care.</p>
      </footer>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;
