import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Send, 
  CheckCircle, 
  Zap, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  Activity, 
  Sliders, 
  Sun, 
  EyeOff,
  Eye,
  Layers,
  ArrowUpRight,
  UserCheck,
  ShieldCheck,
  Filter,
  Check
} from 'lucide-react';

interface PickPackPostProps {
  rawInputText: string;
}

export const PickPackPost: React.FC<PickPackPostProps> = ({ rawInputText }) => {
  const [pipelineStep, setPipelineStep] = useState<number>(0); // 0: Idle, 1: Pick, 2: Pack, 3: Post, 4: Delivered
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Real-time "Makeup & Nip/Tuck" state variables
  const [glowIntensity, setGlowIntensity] = useState<number>(75);
  const [glassmorphism, setGlassmorphism] = useState<number>(80);
  const [borderSharpness, setBorderSharpness] = useState<number>(12); // rounded corner radius px

  // Simulated data extraction based on input text
  const getSimulatedData = () => {
    const text = rawInputText || "TypeScript is throwing implicitly has an any type, help!";
    const words = text.split(/\s+/).filter(w => w.length > 3);
    
    // Picked concepts (e.g. keywords)
    const pickedWords = Array.from(new Set(words.slice(0, 4)));
    
    // Packed variables (the metadata)
    const packedSchema = {
      "origin": "Human Intent Stream",
      "authentic_intent": "Resolve TS type compliance & eliminate implicit any",
      "demoralization_factor": text.length > 100 ? "High (Cognitive overload detected)" : "Moderate (Task-focused drift)",
      "silence_override": text.toLowerCase().includes("ok") ? "ENABLED (Silence accepted)" : "DISABLED (Direct query active)",
      "format": "Optimized Markdown + JSON Node"
    };

    return { pickedWords, packedSchema };
  };

  const { pickedWords, packedSchema } = getSimulatedData();

  // Automate pipeline playback
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setPipelineStep(prev => {
          if (prev >= 4) {
            setIsPlaying(false);
            return 4;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleStartPipeline = () => {
    setPipelineStep(1);
    setIsPlaying(true);
  };

  const handleResetPipeline = () => {
    setPipelineStep(0);
    setIsPlaying(false);
  };

  return (
    <div 
      className="border transition-all duration-700 relative overflow-hidden shadow-2xl p-6"
      style={{
        backgroundColor: `rgba(12, 12, 14, ${glassmorphism / 100})`,
        borderColor: `rgba(99, 102, 241, ${glowIntensity / 350})`,
        borderRadius: `${borderSharpness}px`,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.6), 0 0 ${glowIntensity / 3}px rgba(99, 102, 241, ${glowIntensity / 600})`
      }}
    >
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e12_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e12_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-40"></div>
      
      {/* Dynamic Glow Aura */}
      <div 
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[120px] pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, rgba(99, 102, 241, ${glowIntensity / 400}) 0%, transparent 70%)`
        }}
      />
      <div 
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-[120px] pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, rgba(16, 185, 129, ${glowIntensity / 500}) 0%, transparent 70%)`
        }}
      />

      {/* Title & Nip/Tuck Configuration Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-900/60 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-indigo-400">
            <Sliders size={15} className="animate-pulse text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Interactive Pipeline & Presentation Tuning</span>
          </div>
          <h2 className="text-md font-bold text-white tracking-tight mt-1">The Pick-Pack-Post Delivery Concept</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            How we market AI/User interactions: No raw unformatted label outputs. We <strong>Pick</strong> target signals, <strong>Pack</strong> strict intent into structured packages, and <strong>Post</strong> the final pristine request. Use the <strong>Makeup & Nip/Tuck</strong> sliders to style the interface live.
          </p>
        </div>

        {/* Live Nip/Tuck Controls */}
        <div className="bg-black/50 border border-gray-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center shrink-0">
          <div className="space-y-1 w-full md:w-32">
            <div className="flex justify-between text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider">
              <span>Makeup Glow</span>
              <span className="text-indigo-400">{glowIntensity}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="150" 
              value={glowIntensity}
              onChange={(e) => setGlowIntensity(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1 w-full md:w-32">
            <div className="flex justify-between text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider">
              <span>Glass Tint</span>
              <span className="text-indigo-400">{glassmorphism}%</span>
            </div>
            <input 
              type="range" 
              min="30" 
              max="100" 
              value={glassmorphism}
              onChange={(e) => setGlassmorphism(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1 w-full md:w-32">
            <div className="flex justify-between text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider">
              <span>Nip/Tuck Rounding</span>
              <span className="text-indigo-400">{borderSharpness}px</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="24" 
              value={borderSharpness}
              onChange={(e) => setBorderSharpness(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6 relative z-10">
        
        {/* Left Interactive Flow Steps (7 Columns) */}
        <div className="xl:col-span-8 flex flex-col justify-between">
          
          {/* Stepper Header */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: 1, name: "1. PICK (Extract)", desc: "Isolate true signals", active: pipelineStep === 1, done: pipelineStep > 1 },
              { num: 2, name: "2. PACK (Structure)", desc: "Build metadata envelope", active: pipelineStep === 2, done: pipelineStep > 2 },
              { num: 3, name: "3. POST (Deliver)", desc: "Compile & Stream cleanly", active: pipelineStep === 3, done: pipelineStep > 3 },
            ].map((step, idx) => (
              <button
                key={idx}
                onClick={() => { setPipelineStep(step.num); setIsPlaying(false); }}
                className={`p-3 text-left border rounded-xl transition-all duration-300 relative ${
                  step.active 
                    ? 'bg-indigo-950/40 border-indigo-500/70 text-white shadow-lg' 
                    : step.done 
                      ? 'bg-emerald-950/10 border-emerald-900/30 text-emerald-400'
                      : 'bg-black/30 border-gray-900 text-gray-500 hover:border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{step.name}</span>
                  {step.done ? (
                    <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                  ) : (
                    <div className={`w-1.5 h-1.5 rounded-full ${step.active ? 'bg-indigo-400 animate-ping' : 'bg-gray-800'}`} />
                  )}
                </div>
                <p className="text-[9px] text-gray-400 mt-1">{step.desc}</p>
                {step.active && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                )}
              </button>
            ))}
          </div>

          {/* Interactive Step Content Viewer */}
          <div className="bg-black/40 border border-gray-900 rounded-xl p-5 mt-4 min-h-[190px] flex flex-col justify-between">
            
            {pipelineStep === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-indigo-950/50 border border-indigo-900/30 flex items-center justify-center">
                  <Activity size={18} className="text-indigo-400 animate-pulse" />
                </div>
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Active Delivery Pipeline Idle</h4>
                <p className="text-[10px] text-gray-500 max-w-md">
                  Click 'Initiate Pipeline' to see the high-end Pick-Pack-Post deconstruction map the human communication wave without any junk information.
                </p>
              </div>
            )}

            {pipelineStep === 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-900 pb-2">
                  <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Filter size={11} /> Extraction Module
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono">Stage: Signal Scrape</span>
                </div>
                
                <p className="text-xs text-gray-300 leading-relaxed">
                  We sweep the human intention stream, discard raw conversational fillers, and capture core technical entities.
                </p>

                <div className="space-y-2 mt-2 bg-black/50 p-3 rounded-lg border border-gray-900">
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider block">Extracted Cognitive Signals:</span>
                  <div className="flex flex-wrap gap-2">
                    {pickedWords.map((word, i) => (
                      <span key={i} className="text-[9px] font-mono px-2 py-0.5 bg-indigo-950/50 text-indigo-300 rounded border border-indigo-900/30 flex items-center gap-1 animate-pulse">
                        <Check size={9} /> {word}
                      </span>
                    ))}
                    {pickedWords.length === 0 && <span className="text-gray-600 text-[10px]">Awaiting source wave...</span>}
                  </div>
                </div>
              </div>
            )}

            {pipelineStep === 2 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-900 pb-2">
                  <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Package size={11} /> Packaging Module
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono">Stage: Structured Enveloping</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  The picked signals are structured into highly precise 5W1H schema containers, ready for the LLM to process without confusing corporate padding.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {Object.entries(packedSchema).map(([key, value], i) => (
                    <div key={i} className="bg-black/60 p-2 rounded border border-gray-950">
                      <span className="text-[8px] font-mono text-gray-500 uppercase block">{key}</span>
                      <span className="text-[10px] text-purple-300 font-medium block truncate mt-0.5">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pipelineStep === 3 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-900 pb-2">
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Send size={11} /> Transmission Module
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono">Stage: Stream Posting</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  The clean metadata package is posted into the execution context. Unsolicited formatting and fluff are blocked at the firewall.
                </p>

                <div className="p-3 bg-emerald-950/5 rounded-lg border border-emerald-900/20 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest block">Firewall Filter Active</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">Blocked 140 unnecessary chat parameters & boilerplate warnings.</p>
                  </div>
                  <ShieldCheck className="text-emerald-400 animate-pulse" size={18} />
                </div>
              </div>
            )}

            {pipelineStep === 4 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-900 pb-2">
                  <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle size={11} /> Completed Pipeline
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono">Status: Stream Online</span>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="text-emerald-400" size={24} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">Perfect Zero-Junk Synthesis</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      By reverse-thinking the input flow, we prevented compiler noise and saved 400 unnecessary input tokens. The system successfully understood intent.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Controls */}
            <div className="flex items-center justify-between border-t border-gray-900/60 pt-3 mt-3">
              <span className="text-[9px] font-mono text-gray-600 uppercase">
                {pipelineStep > 0 ? `Active Step: ${pipelineStep} / 3` : 'Awaiting initialization'}
              </span>
              <div className="flex gap-2">
                {pipelineStep > 0 && (
                  <button
                    onClick={handleResetPipeline}
                    className="px-3 py-1 bg-black hover:bg-gray-900 text-gray-400 hover:text-white rounded-lg border border-gray-800 text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Reset
                  </button>
                )}
                {pipelineStep < 4 ? (
                  <button
                    onClick={handleStartPipeline}
                    disabled={isPlaying}
                    className="px-4 py-1.5 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 shadow-lg"
                  >
                    {isPlaying ? 'Running...' : 'Initiate Pipeline'} <ArrowRight size={10} />
                  </button>
                ) : (
                  <button
                    onClick={handleResetPipeline}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Run Again
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right Conceptual Sidebar: The AI/User Future Marketing Banner (4 Columns) */}
        <div className="xl:col-span-4 bg-[#070709] border border-gray-900 rounded-xl p-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">Aesthetic Packaging Paradigm</span>
            </div>
            
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">How to Market the Interaction</h3>
            
            <p className="text-[11px] text-gray-400 leading-relaxed">
              In the future, the primary competitive edge is not raw parameters, but how smoothly the AI and human align. When we make enough <strong>makeup</strong>, apply <strong>nip & tuck</strong> aesthetic structures, and use the <strong>pick-pack-post</strong> paradigm, we bridge the gap.
            </p>

            <ul className="space-y-2 pt-2">
              {[
                { label: "Eliminate Junk Input", desc: "Filters out exhausting meta-noise automatically" },
                { label: "5W1H Alignment", desc: "Guarantees exact semantic mapping" },
                { label: "Silence Acceptance", desc: "Respects brief 'ok' actions as consent" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[10px] text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0" />
                  <div>
                    <strong className="text-indigo-300">{item.label}</strong>: {item.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-indigo-950/10 rounded-lg border border-indigo-900/20 text-center">
            <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">Communication Value Prop</span>
            <p className="text-[10px] text-gray-400 mt-1">"Listen first, act second—delivered with high fidelity."</p>
          </div>

        </div>

      </div>
    </div>
  );
};
