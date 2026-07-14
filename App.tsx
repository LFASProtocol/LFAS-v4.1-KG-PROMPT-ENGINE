import React, { useState, useCallback } from 'react';
import { 
  Terminal, 
  Search, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  Zap, 
  Play, 
  RefreshCcw, 
  Database, 
  FileJson,
  AlertTriangle,
  Filter,
  HelpCircle,
  X,
  ArrowRight,
  Copy,
  Check,
  Code2,
  HeartHandshake,
  MessageSquareCode,
  Layers,
  Smile,
  Cpu
} from 'lucide-react';
import { KnowledgeGraph, ExecutionState, PromptOptimizationResult, CompareResult } from './types';
import GraphVisualization from './components/GraphVisualization';
import { performReflection, performAction, performComparison } from './services/gemini';
import TaxonomyExplorer from './components/TaxonomyExplorer';
import PhilosophyPanel from './components/PhilosophyPanel';
import { PickPackPost } from './components/PickPackPost';

// Pre-configured messy templates for immediate testing
const TEMPLATES = [
  {
    title: "TypeScript Rage",
    short: "Compiler imports despair",
    input: "Ugh why is typescript so annoying? I've been trying to import a module for 2 hours and it keeps giving me some stupid 'has no default export' or 'implicitly has an any type' error but it literally works in vanilla JS! I'm totally exhausted and sick of fighting the compiler. Just fix this code or tell me what compiler flag I need to change. I'm too tired to read a whole essay."
  },
  {
    title: "Privacy Policy Panic",
    short: "Google Play release rush",
    input: "Look, I need to launch this basic Android game by tonight otherwise I miss the feature window, but now Google Console is demanding a privacy policy page! I have zero dollars for lawyers, I'm just a solo dev, and I'm stressed out of my mind. Please just write me a privacy policy that doesn't sound like a giant corporate lawyer wrote it, covers standard Google Play, AdMob, and Unity Ads, and don't make me fill out a 100-step form. Please hurry!"
  },
  {
    title: "React Router Despair",
    short: "Routing guide fatigue",
    input: "I am so sick of this react routing error, I've spent literally all weekend on it and nothing works. Why does every router guide on Google use a different version and why is every tutorial wrong? Can you just give me a working navbar example that compiles, doesn't throw 'useRoutes() may be used only in the context of a <Router>', and doesn't crash? I'm using react-router-dom v6.14. Thanks."
  },
  {
    title: "CSS Alignment Despair",
    short: "Zigzag flex buttons",
    input: "Why is CSS like this? I just want three simple product cards in a row that are the exact same height, with the 'Buy Now' button pinned to the absolute bottom of each card, regardless of how much text is in the description! Right now the buttons are all zig-zagging and it looks like a complete mess. I've tried flex, absolute positioning, grid, and nothing aligns. I'm ready to throw my computer out the window."
  }
];

const INITIAL_KG: KnowledgeGraph = {
  nodes: [
    { id: "RAW_INPUT", val: "TypeScript Rage: Why does it keep saying 'has no default export'..." },
    { id: "EMOTIONAL_STATE", val: "High Frustration (Exhausted, Impatient, Stressed)" },
    { id: "CORE_INTENT", val: "Configure TypeScript compiler options for ES module default imports" },
    { id: "IMPLICIT_CONSTRAINTS", val: "Pragmatic, immediate, minimal explanation, exact tsconfig flag" },
    { id: "TARGET_OUTCOME", val: "Pristine compilable solution utilizing allowSyntheticDefaultImports" }
  ],
  edges: [
    { from: "RAW_INPUT", to: "EMOTIONAL_STATE", type: "DETECTION" },
    { from: "RAW_INPUT", to: "CORE_INTENT", type: "EXTRACTION" },
    { from: "CORE_INTENT", to: "IMPLICIT_CONSTRAINTS", type: "INFERENCE" },
    { from: "IMPLICIT_CONSTRAINTS", to: "TARGET_OUTCOME", type: "REFINEMENT" }
  ]
};

// Reusable Header Component with "Mouse Activated" Hover Help
const SectionHeader: React.FC<{
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  helpText?: string;
  rightElement?: React.ReactNode;
}> = ({ icon: Icon, title, subtitle, helpText, rightElement }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="flex items-center gap-2 text-indigo-300 relative group/header">
        <Icon size={16} />
        <h2 className="text-xs font-black uppercase tracking-widest">{title}</h2>
        
        {helpText && (
          <div 
            className="ml-1 cursor-help text-indigo-500/30 hover:text-indigo-400 transition-colors relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <HelpCircle size={12} />
            {/* Hover Tooltip - Mouse Activated */}
            <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 w-56 bg-[#0a0a0a] border border-indigo-500/30 text-indigo-100 p-3 rounded-lg shadow-[0_4px_20px_rgba(99,102,241,0.25)] text-[10px] font-medium leading-relaxed z-50 pointer-events-none transition-all duration-200 origin-left ${isHovering ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 -translate-x-2'}`}>
              <div className="absolute left-0 top-1/2 -translate-x-[5px] -translate-y-1/2 w-2 h-2 bg-[#0a0a0a] border-l border-b border-indigo-500/30 transform rotate-45"></div>
              <span className="text-indigo-400 font-bold block mb-1 uppercase text-[9px] tracking-wider">Info</span>
              {helpText}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
         {subtitle && <div className="text-[10px] text-gray-500 font-mono">{subtitle}</div>}
         {rightElement}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [rawInput, setRawInput] = useState<string>(TEMPLATES[0].input);
  const [dynamicKG, setDynamicKG] = useState<KnowledgeGraph>(INITIAL_KG);
  const [executionState, setExecutionState] = useState<ExecutionState>(ExecutionState.IDLE);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [optimizedResult, setOptimizedResult] = useState<PromptOptimizationResult | null>(null);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterTerm, setFilterTerm] = useState('');
  
  // Tab for active display: 'prompt' | 'json' | 'jsonl'
  const [activeTab, setActiveTab] = useState<'prompt' | 'json' | 'jsonl'>('prompt');
  
  // Clipboard copied notifications
  const [copiedStatus, setCopiedStatus] = useState<Record<string, boolean>>({});

  // Tour State: 0 = Off, 1 = Raw Input, 2 = Reflect Monologue, 3 = Act Synthesis, 4 = Clean Outputs
  const [tourStep, setTourStep] = useState(0);

  const triggerCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStatus(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const loadTemplate = (inputTemplate: string) => {
    setRawInput(inputTemplate);
    handleReset();
  };

  const handleReflect = async () => {
    if (!rawInput.trim()) {
      setError("Please input some text or choose a template first.");
      return;
    }

    setError(null);
    setExecutionState(ExecutionState.REFLECTING);
    setReflectionText('');
    setOptimizedResult(null);
    if (tourStep === 2) setTourStep(3);

    try {
      const result = await performReflection(rawInput);
      setReflectionText(result.reflectionText);
      setDynamicKG(result.dynamicKG);
      setExecutionState(ExecutionState.REFLECTED);
    } catch (err: any) {
      setError(err.message || "Reflection analysis failed");
      setExecutionState(ExecutionState.ERROR);
    }
  };

  const handleAct = async () => {
    if (executionState !== ExecutionState.REFLECTED) {
      setError("ACT blocked. REFLECT & Intent Mapping required first.");
      return;
    }

    setError(null);
    setExecutionState(ExecutionState.ACTING);
    if (tourStep === 3) setTourStep(4);

    try {
      const result = await performAction(rawInput, dynamicKG);
      setOptimizedResult(result);
      setExecutionState(ExecutionState.COMPLETED);
    } catch (err: any) {
      setError(err.message || "Prompt synthesis failed");
      setExecutionState(ExecutionState.ERROR);
    }
  };

  const handleCompare = async () => {
    if (!optimizedResult) {
      setError("Synthesis results are required before running model comparison.");
      return;
    }

    setError(null);
    setIsComparing(true);
    setCompareResult(null);

    try {
      const result = await performComparison(rawInput, optimizedResult.optimized_prompt);
      setCompareResult(result);
    } catch (err: any) {
      setError(err.message || "Parallel model response simulation failed.");
    } finally {
      setIsComparing(false);
    }
  };

  const handleReset = () => {
    setExecutionState(ExecutionState.IDLE);
    setReflectionText('');
    setOptimizedResult(null);
    setCompareResult(null);
    setIsComparing(false);
    setDynamicKG(INITIAL_KG);
    setError(null);
    setFilterTerm('');
    setTourStep(0);
    setActiveTab('prompt');
  };

  // --- Tour Components ---
  const startTour = () => setTourStep(1);
  const nextStep = () => setTourStep(p => p + 1);
  const endTour = () => setTourStep(0);

  const TourTooltip: React.FC<{
    step: number;
    title: string;
    description: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
  }> = ({ step, title, description, position = 'bottom', className = '' }) => {
    if (tourStep !== step) return null;

    return (
      <div className={`absolute z-50 w-72 bg-[#0f0f0f] border border-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.4)] rounded-xl p-5 animate-in fade-in zoom-in-95 duration-300 ${className} ${
        position === 'top' ? 'bottom-full mb-4' : 
        position === 'bottom' ? 'top-full mt-4' : 
        position === 'left' ? 'right-full mr-4' : 'left-full ml-4'
      }`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded-full bg-indigo-500 text-black flex items-center justify-center text-[10px] font-bold">
               {step}
             </div>
             <h3 className="text-indigo-300 font-bold text-xs uppercase tracking-widest">{title}</h3>
          </div>
          <button onClick={endTour} className="text-gray-500 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
        
        <div className="text-xs text-gray-300 leading-relaxed mb-4 font-medium">
          {description}
        </div>

        <div className="flex justify-end items-center gap-3 border-t border-gray-800 pt-3">
          <span className="text-[9px] uppercase text-gray-600 font-bold tracking-widest mr-auto">
            {step} / 4
          </span>
          <button onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-lg transition-all flex items-center gap-1">
            {step === 4 ? 'Finish' : 'Next'} <ArrowRight size={10} />
          </button>
        </div>

        {/* Pointer Arrow */}
        <div className={`absolute w-3 h-3 bg-[#0f0f0f] border-indigo-400 transform rotate-45 ${
           position === 'top' ? 'bottom-[-7px] border-t-0 border-l-0 border-r border-b right-1/2 translate-x-1/2' :
           position === 'bottom' ? 'top-[-7px] border-b-0 border-r-0 border-l border-t left-8' : ''
        }`}></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 selection:bg-indigo-500/30 font-sans">
      
      {/* Dim Overlay when Tour is Active */}
      {tourStep > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 pointer-events-none transition-opacity duration-500" />
      )}

      {/* Header */}
      <header className="border-b border-indigo-900/30 bg-[#0a0a0a] px-8 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(165,180,252,0.15)]">
            <HeartHandshake className="text-indigo-300 w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">DRAMA-FREE <span className="text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.5)]">PROMPT ENGINE</span></h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Messy-to-Professional AI Translation Layer</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={startTour}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${tourStep > 0 ? 'bg-indigo-500 text-white border-indigo-400' : 'border-gray-800 text-gray-400 hover:border-indigo-500/50 hover:text-indigo-300'}`}
          >
            <HelpCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Guide</span>
          </button>

          <div className="w-px h-6 bg-gray-800 mx-2" />

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              executionState === ExecutionState.IDLE ? 'bg-gray-600' : 
              executionState === ExecutionState.REFLECTING || executionState === ExecutionState.ACTING ? 'bg-indigo-400 animate-ping' : 
              'bg-emerald-500'
            }`} />
            <span className="text-xs font-mono text-gray-400">{executionState}</span>
          </div>
          <button 
            onClick={handleReset}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Reset to initial state"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto relative z-40">
        
        {/* Pitch / Concept Intro Card */}
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-950/20 via-[#0a0a0c] to-indigo-950/20 rounded-2xl border border-indigo-900/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Aesthetic Prompt Engineering</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Turn tired, messy, emotional queries into crisp, professional AI prompts & JSON records</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              When developers or users get exhausted, their queries get messy and emotional—which leads to bad AI performance. 
              The Drama-Free Engine acts as an empathetic buffer, extracting core objectives, plotting them on an analytical relation map, and generating polished copyable <b>Prompts</b>, structured <b>JSON parameters</b>, and fine-tuning <b>JSONL dataset pairs</b>.
            </p>
          </div>
          
          {/* Preset templates selector */}
          <div className="flex flex-col gap-2 min-w-[280px] w-full md:w-auto">
            <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Select an Exhausted Scenario Template:</label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => loadTemplate(tpl.input)}
                  className={`px-3 py-2 text-left rounded-xl border text-[11px] transition-all flex flex-col justify-between h-[52px] ${
                    rawInput === tpl.input 
                      ? 'bg-indigo-950/50 border-indigo-500 text-indigo-200' 
                      : 'bg-[#08080a] border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                  }`}
                >
                  <span className="font-bold block truncate">{tpl.title}</span>
                  <span className="text-[9px] text-gray-500 block truncate font-mono">{tpl.short}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Philosophy & Meta-Listening Core Pillar Card */}
        <div className="mb-8">
          <PhilosophyPanel />
        </div>

        {/* Pick-Pack-Post Interactive Pipeline Section */}
        <div className="mb-8">
          <PickPackPost rawInputText={rawInput} />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Visualization (4 Columns) */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            
            {/* CARD 1: Raw Stressed Input */}
            <div className={`bg-[#0f0f0f] border border-gray-800/60 rounded-2xl p-6 shadow-2xl flex flex-col h-[480px] relative overflow-hidden group transition-all duration-500 ${tourStep === 1 ? 'ring-2 ring-indigo-500 scale-[1.02] z-50 bg-[#151515]' : ''}`}>
              
              <TourTooltip 
                step={1} 
                title="Your Messy Prompt" 
                description={<span>Type in a frustrating, emotional, or exhausted question or choose one of our templates. Watch how we deconstruct the drama!</span>}
                position="right"
                className="right-[-320px] top-0"
              />

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 opacity-50"></div>
              
              <SectionHeader 
                icon={MessageSquareCode} 
                title="Raw Messy / Stressed Input" 
                subtitle="The Human Side of the Query"
                helpText="Input what you are actually feeling, saying, and requesting. Gemini will filter out the exhaustion and focus purely on deconstructing the requirements."
              />

              <div className="flex-1 flex flex-col gap-3">
                <textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="Paste or type your messy, emotional, or exhausted message here..."
                  className="flex-1 bg-[#080808] rounded-xl p-4 font-mono text-xs text-indigo-100/90 border border-gray-800/60 focus:border-indigo-500/40 outline-none resize-none scroll-smooth transition-colors leading-relaxed"
                  spellCheck={false}
                />
                
                <div className="flex items-center justify-between text-[10px] text-gray-500 px-1 font-mono">
                  <span>Characters: {rawInput.length}</span>
                  <span className="text-amber-500/60">Includes cognitive noise and emotional tags</span>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3 relative z-10">
                {/* REFLECT BUTTON */}
                <div className="flex-1 relative">
                    <TourTooltip 
                        step={2} 
                        title="Phase 1: Reflect" 
                        description="Runs a cognitive monologue. Gemini listens, charts sentiment parameters, and maps constraints onto a Dynamic Knowledge Graph."
                        position="top"
                    />
                    <button 
                      onClick={handleReflect}
                      disabled={executionState === ExecutionState.REFLECTING || executionState === ExecutionState.ACTING || !rawInput.trim()}
                      className={`w-full bg-indigo-600/95 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-[0_4px_20px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.3)] ${tourStep === 2 ? 'ring-2 ring-white animate-pulse' : ''}`}
                    >
                      {executionState === ExecutionState.REFLECTING ? <RefreshCcw className="animate-spin" size={14}/> : <Zap size={14} />}
                      Reflect
                    </button>
                </div>

                {/* ACT BUTTON */}
                <div className="flex-1 relative">
                    <TourTooltip 
                        step={3} 
                        title="Phase 2: Act" 
                        description="Once reflected, the ACT button activates. This generates the final clean prompt, programmatic JSON, and JSONL training datasets!"
                        position="top"
                    />
                    <button 
                      onClick={handleAct}
                      disabled={executionState !== ExecutionState.REFLECTED}
                      className={`w-full bg-[#1b1b22] hover:bg-indigo-950 text-white font-black text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-indigo-950 hover:border-indigo-800 disabled:opacity-30 disabled:cursor-not-allowed ${tourStep === 3 ? 'ring-2 ring-white animate-pulse' : ''}`}
                    >
                      {executionState === ExecutionState.ACTING ? <RefreshCcw className="animate-spin" size={14}/> : <Play size={14} />}
                      Act
                    </button>
                </div>
              </div>
            </div>

            {/* CARD 2: Relationship Mapping (Visualizing the KG) */}
            <div className="bg-[#0f0f0f] border border-gray-800/60 rounded-2xl p-6 shadow-xl h-[360px] flex flex-col relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 opacity-50"></div>
              
              <SectionHeader 
                icon={Activity} 
                title="Intent & Sentiment Mapping"
                helpText="Deconstructed Knowledge Graph mapping emotional states to their target constraints and core goals. Drag nodes or hover to inspect deconstruction data."
                rightElement={
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="Filter nodes..."
                      value={filterTerm}
                      onChange={(e) => setFilterTerm(e.target.value)}
                      className="bg-[#080808] border border-gray-800 rounded-lg py-1 px-8 text-[10px] font-mono text-indigo-200 focus:border-indigo-500/50 outline-none w-32 focus:w-44 transition-all placeholder-gray-700"
                    />
                    <Filter size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400" />
                  </div>
                }
              />

              <div className="flex-1 min-h-0">
                <GraphVisualization kg={dynamicKG} filterTerm={filterTerm} />
              </div>
            </div>
          </div>

          {/* Right Column: Deconstruction [REFLECT] & Clean Outputs [ACT] (7 Columns) */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/10 border border-red-500/20 text-red-300 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle size={20} className="flex-shrink-0" />
                <div className="text-sm font-medium">{error}</div>
              </div>
            )}

            {/* Reflection Panel */}
            <div className="bg-[#0f0f0f] border border-gray-800/60 rounded-2xl p-6 shadow-xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 opacity-50"></div>
              
              <SectionHeader 
                icon={Terminal} 
                title="Cognitive Monologue Deconstruction [REFLECT]"
                helpText="Shows the AI's parsed analysis of your emotional/cognitive state, and what your implicit, actual technical demands are behind the stress."
              />

              <div className="bg-[#080808] border border-gray-800/60 rounded-xl p-5 min-h-[140px] font-mono text-xs leading-relaxed text-indigo-100/90 overflow-y-auto max-h-[220px]">
                {reflectionText ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-800 pb-2 mb-2 text-indigo-400 font-bold">
                      <Smile size={14} />
                      <span>EMPATHETIC COGNITIVE TRANSLATION</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed text-gray-300">{reflectionText}</pre>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-2 py-8">
                    <Search size={28} />
                    <p className="text-[10px] uppercase tracking-[0.15em] font-bold">Awaiting Cognitive Monologue...</p>
                    <p className="text-[9px] text-gray-800">Click "Reflect" to trigger deep emotional & logical parsing</p>
                  </div>
                )}
              </div>
            </div>

            {/* Clean Outputs [ACT] */}
            <div className={`bg-[#0f0f0f] border border-gray-800/60 rounded-2xl p-6 shadow-xl flex-1 relative flex flex-col transition-all duration-500 ${tourStep === 4 ? 'ring-2 ring-indigo-500 scale-[1.01] z-50 bg-[#151515]' : ''}`}>
              
              <TourTooltip 
                 step={4} 
                 title="Drama-Free Outputs" 
                 description={<span>Pragmatic, pristine results. Tap the <b>JSON</b> or <b>JSONL</b> tabs to access structured outputs ideal for automated LLM flows or dataset training!</span>}
                 position="left"
                 className="left-[-310px] top-10"
              />

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 opacity-50"></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-800/80 pb-4 mb-4 gap-4">
                <SectionHeader 
                  icon={Cpu} 
                  title="Synthesized AI-Friendly Output [ACT]"
                  helpText="The final synthesized professional material. We output plain markdown prompt (great for direct paste), clean JSON config, or dataset-ready JSONL."
                />

                {/* Tab buttons */}
                {optimizedResult && (
                  <div className="flex items-center bg-[#080808] p-1 rounded-xl border border-gray-800 gap-1 self-stretch md:self-auto">
                    <button 
                      onClick={() => setActiveTab('prompt')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'prompt' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Refined Prompt
                    </button>
                    <button 
                      onClick={() => setActiveTab('json')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'json' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      JSON Schema
                    </button>
                    <button 
                      onClick={() => setActiveTab('jsonl')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'jsonl' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      Dataset JSONL
                    </button>
                  </div>
                )}
              </div>

              {optimizedResult ? (
                <div className="flex-1 flex flex-col gap-4">
                  
                  {/* METRIC BADGES GRID (Sentiment Breakdown) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0a0a0d] p-4 rounded-xl border border-gray-800/50 font-mono text-[10px]">
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Frustration Level</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-rose-500" 
                            style={{ width: `${optimizedResult.sentiment.frustration_level * 10}%` }}
                          />
                        </div>
                        <span className="text-rose-400 font-bold">{optimizedResult.sentiment.frustration_level}/10</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Exhaustion Level</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500" 
                            style={{ width: `${optimizedResult.sentiment.exhaustion_level * 10}%` }}
                          />
                        </div>
                        <span className="text-amber-400 font-bold">{optimizedResult.sentiment.exhaustion_level}/10</span>
                      </div>
                    </div>

                    <div className="col-span-2 md:col-span-2">
                      <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Dominant Input Tone</span>
                      <div className="text-indigo-300 font-bold mt-1 uppercase tracking-wide">
                        {optimizedResult.sentiment.dominant_tone}
                      </div>
                    </div>
                  </div>

                  {/* DECONSTRUCTION INSIGHTS SUMMARY */}
                  <div className="p-4 bg-indigo-950/10 rounded-xl border border-indigo-900/20 text-xs">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">Core Objective Deconstruction</span>
                    <div className="space-y-1 text-gray-300 font-sans">
                      <p><b>Target Goal:</b> {optimizedResult.deconstruction.core_intent}</p>
                      {optimizedResult.deconstruction.implicit_constraints.length > 0 && (
                        <p><b>Implied Rules:</b> {optimizedResult.deconstruction.implicit_constraints.join(', ')}</p>
                      )}
                      {optimizedResult.deconstruction.missing_parameters.length > 0 && (
                        <p className="text-amber-400/90"><b>Missing Context:</b> {optimizedResult.deconstruction.missing_parameters.join(', ')}</p>
                      )}
                    </div>
                  </div>

                  {/* TAB OUTPUT VIEWER */}
                  <div className="flex-1 bg-[#080808] border border-gray-850 rounded-xl flex flex-col overflow-hidden relative min-h-[300px]">
                    
                    {/* Copy Button Floating */}
                    <button
                      onClick={() => {
                        const contentToCopy = 
                          activeTab === 'prompt' ? optimizedResult.optimized_prompt :
                          activeTab === 'json' ? JSON.stringify(optimizedResult.json_payload, null, 2) :
                          optimizedResult.jsonl_record;
                        triggerCopy(contentToCopy, activeTab);
                      }}
                      className="absolute top-3 right-3 bg-[#111] hover:bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest py-1.5 px-3 rounded-lg border border-gray-800 hover:border-indigo-500 transition-all flex items-center gap-1.5 z-30"
                    >
                      {copiedStatus[activeTab] ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Output</span>
                        </>
                      )}
                    </button>

                    {/* Content view based on active tab */}
                    <div className="flex-1 p-5 overflow-y-auto max-h-[340px] font-mono text-xs leading-relaxed text-gray-300">
                      {activeTab === 'prompt' && (
                        <div className="font-sans space-y-4">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-gray-900 pb-2 mb-2 text-xs">
                            <Sparkles size={14} />
                            <span>CLEAN OPTIMIZED PROMPT (READY FOR ANY LLM)</span>
                          </div>
                          <div className="prose prose-invert prose-xs max-w-none text-gray-350 leading-relaxed whitespace-pre-wrap font-sans text-xs bg-[#0b0b0b] p-4 rounded-xl border border-gray-900">
                            {optimizedResult.optimized_prompt}
                          </div>
                        </div>
                      )}

                      {activeTab === 'json' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-indigo-400 font-bold border-b border-gray-900 pb-2 mb-2 text-xs">
                            <Code2 size={14} />
                            <span>STRUCTURED COGNITIVE PARAMETERS (JSON)</span>
                          </div>
                          <pre className="text-[11px] leading-relaxed text-indigo-300 bg-[#0b0b0b] p-4 rounded-xl border border-gray-900 overflow-x-auto whitespace-pre">
                            {JSON.stringify(optimizedResult.json_payload, null, 2)}
                          </pre>
                        </div>
                      )}

                      {activeTab === 'jsonl' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-purple-400 font-bold border-b border-gray-900 pb-2 mb-2 text-xs">
                            <Layers size={14} />
                            <span>FINE-TUNING DATASET ROW (JSONL)</span>
                          </div>
                          <div className="bg-[#0b0b0b] p-4 rounded-xl border border-gray-900">
                            <p className="text-[10px] text-gray-500 mb-3 font-sans">A perfect, single-line dataset row logging the Raw to Professional mapping, structured directly for fine-tuning loops or audit datastores.</p>
                            <div className="text-[11px] text-purple-300 break-all select-all font-mono leading-relaxed bg-[#050505] p-3 rounded border border-gray-950">
                              {optimizedResult.jsonl_record}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              ) : (
                <div className="h-[320px] flex-1 flex flex-col items-center justify-center text-gray-700 gap-4 border-2 border-dashed border-gray-800/50 rounded-2xl py-12">
                  <div className="p-4 bg-gray-900/50 rounded-full">
                    <FileJson size={36} className="text-gray-800 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-600">No Professional Outputs Synthesized</p>
                    <p className="text-[10px] text-gray-800 mt-1 max-w-[280px] mx-auto leading-relaxed">
                      First load or type an exhausted scenario. Tap <b>Reflect</b> to analyze the tone, then tap <b>Act</b> to generate pristine prompt materials!
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* SECTION 3: AI Productivity Comparison Simulator */}
        <div className="mt-8 bg-[#0f0f0f] border border-gray-800/60 rounded-2xl p-6 shadow-xl relative">
          {/* Header */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/30 via-emerald-500/30 to-indigo-500/30 opacity-60"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Activity size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Stage 3: Live LFAS Performance Audit</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-1">AI Productivity Comparison Playground</h2>
              <p className="text-xs text-gray-400 mt-1">
                Witness how removing cognitive drama and styling inputs transforms LLM performance. Simulate concurrent execution of the raw vs. optimized prompt.
              </p>
            </div>
            
            {optimizedResult ? (
              <button
                onClick={handleCompare}
                disabled={isComparing}
                className="bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
              >
                {isComparing ? (
                  <>
                    <RefreshCcw className="animate-spin" size={14} />
                    <span>Running Simulation...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Run Side-by-Side Model Test</span>
                  </>
                )}
              </button>
            ) : (
              <div className="text-[10px] text-gray-500 font-mono border border-gray-800 px-3 py-1.5 rounded-lg bg-[#080808]">
                Awaiting Phase 2 ACT to unlock simulator
              </div>
            )}
          </div>

          {/* Comparison Body */}
          {compareResult ? (
            <div className="space-y-6">
              {/* Simulation Telemetry Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                
                <div className="bg-[#08080a] border border-gray-800 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider block">Est. Token Efficiency</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-emerald-400 text-lg font-mono font-bold">-{compareResult.metrics.noiseReductionPct}%</span>
                    <span className="text-gray-600 text-[10px]">fewer distractions</span>
                  </div>
                  <span className="text-[9px] text-gray-500 mt-1 font-mono">Raw: {compareResult.metrics.rawTokensEstimated}t → Opt: {compareResult.metrics.optimizedTokensEstimated}t</span>
                </div>

                <div className="bg-[#08080a] border border-gray-800 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider block">Code Accuracy Boost</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-indigo-400 text-lg font-mono font-bold">+{compareResult.metrics.accuracyBoostPct}%</span>
                    <span className="text-gray-600 text-[10px]">higher precision</span>
                  </div>
                  <span className="text-[9px] text-gray-500 mt-1 font-mono">Zero irrelevant pleasantries</span>
                </div>

                <div className="bg-[#08080a] border border-gray-800 p-4 rounded-xl flex flex-col justify-between md:col-span-1 lg:col-span-3">
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider block">Cognitive Attention Advantage</span>
                  <p className="text-gray-300 font-sans text-xs mt-1 leading-relaxed">
                    {compareResult.metrics.cognitiveOverheadAvoided}
                  </p>
                  <p className="text-emerald-500/80 font-mono text-[9px] mt-1">
                    💡 {compareResult.metrics.productivityInsight}
                  </p>
                </div>

              </div>

              {/* Side by Side Terminals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Terminal A: Raw Input Result */}
                <div className="bg-[#080808] border border-rose-950/40 rounded-xl overflow-hidden flex flex-col h-[380px]">
                  <div className="bg-rose-950/10 border-b border-rose-950/30 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                      <span className="text-[10px] font-mono font-bold text-rose-300 uppercase tracking-widest">Model Output: Raw Messy Prompt</span>
                    </div>
                    <span className="text-[9px] font-mono text-rose-500/70 uppercase">Inefficient Allocation</span>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1 font-sans text-xs text-gray-400 leading-relaxed whitespace-pre-wrap select-text">
                    {compareResult.rawOutput}
                  </div>
                </div>

                {/* Terminal B: Optimized Prompt Result */}
                <div className="bg-[#080808] border border-emerald-950/40 rounded-xl overflow-hidden flex flex-col h-[380px]">
                  <div className="bg-emerald-950/10 border-b border-emerald-950/30 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                      <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest">Model Output: Drama-Free Refined Prompt</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400/80 uppercase">Pristine Response Structure</span>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1 font-sans text-xs text-gray-200 leading-relaxed whitespace-pre-wrap select-text bg-[#090b09]/20">
                    {compareResult.optimizedOutput}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="h-[180px] flex flex-col items-center justify-center text-gray-700 bg-[#080808] rounded-xl border border-dashed border-gray-800">
              <div className="text-center p-6">
                <Cpu size={24} className="mx-auto text-gray-800 mb-2" />
                <p className="text-[11px] uppercase tracking-wider font-bold text-gray-500">Live Model Simulation Idle</p>
                <p className="text-[10px] text-gray-600 mt-1 max-w-lg mx-auto leading-relaxed">
                  {optimizedResult 
                    ? 'Pristine prompt is synthesized! Click the button above to run parallel live tests and analyze cognitive token economy side-by-side.' 
                    : 'Enter an input above, click "Reflect" then "Act" to synthesize your pristine output, which will unlock this live audit comparison.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: Cognitive Behavior Taxonomy Registry */}
        <div className="mt-8">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Database size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Stage 4: Interaction Behavior Taxonomy Schema</span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight mt-1">AI & User Behavior Taxonomy Registry</h2>
            <p className="text-xs text-gray-400 mt-1">
              Explore the structured schema of over 100 AI interaction behaviors and 40 user behavior patterns. Toggle modes, search criteria, and inspect full Who, What, When, How, Why mappings.
            </p>
          </div>
          <TaxonomyExplorer />
        </div>
      </main>

      <footer className="mt-20 border-t border-gray-900 bg-black/50 p-8 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">
          <ShieldAlert size={14} />
          <span>Drama-Free Prompt Engine v1.0 • Built on Graph-Enforced Cognitive Mapping</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
