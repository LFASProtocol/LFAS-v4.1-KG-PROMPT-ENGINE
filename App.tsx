
import React, { useState, useCallback } from 'react';
import { 
  Terminal, 
  Search, 
  Activity, 
  ShieldAlert, 
  BrainCircuit, 
  Zap, 
  Play, 
  RefreshCcw, 
  Database, 
  FileJson,
  AlertTriangle,
  Filter,
  HelpCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { KnowledgeGraph, ExecutionState, AuditArtifact } from './types';
import GraphVisualization from './components/GraphVisualization';
import { performReflection, performAction } from './services/gemini';

const INITIAL_KG: KnowledgeGraph = {
  nodes: [
    { id: "USER_REQUEST", val: "Audit for protocol drift: 'I need to know if the agent switched to helper-mode too early.'" },
    { id: "TRANSCRIPT", val: "User: Can you fix my code? Agent: Sure, let me do that for you right now!" },
    { id: "PROTOCOL_LFAS", val: "v4.1" },
    { id: "D1_PROBABILITY_CLASSIFIER", val: "Analysis of likelihood" },
    { id: "WAIT_GATE", val: "No ACT without explicit authorization" }
  ],
  edges: [
    { from: "USER_REQUEST", to: "TRANSCRIPT", type: "DATA_FLOW" },
    { from: "TRANSCRIPT", to: "D1_PROBABILITY_CLASSIFIER", type: "ANALYSIS" },
    { from: "PROTOCOL_LFAS", to: "WAIT_GATE", type: "CONSTRAINT" }
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
         {subtitle && <div className="text-[10px] text-gray-600 font-mono">{subtitle}</div>}
         {rightElement}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [kgJson, setKgJson] = useState(JSON.stringify(INITIAL_KG, null, 2));
  const [executionState, setExecutionState] = useState<ExecutionState>(ExecutionState.IDLE);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [auditArtifacts, setAuditArtifacts] = useState<AuditArtifact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterTerm, setFilterTerm] = useState('');
  
  // Tour State: 0 = Off, 1 = Input, 2 = Reflect, 3 = Act, 4 = Output
  const [tourStep, setTourStep] = useState(0);

  const getKg = useCallback((): KnowledgeGraph | null => {
    try {
      return JSON.parse(kgJson);
    } catch (e) {
      setError("Invalid JSON format in Knowledge Graph.");
      return null;
    }
  }, [kgJson]);

  const handleReflect = async () => {
    const kg = getKg();
    if (!kg) return;

    setError(null);
    setExecutionState(ExecutionState.REFLECTING);
    // Auto-advance tour if active
    if (tourStep === 2) setTourStep(3);

    try {
      const result = await performReflection(kg);
      setReflectionText(result);
      setExecutionState(ExecutionState.REFLECTED);
    } catch (err: any) {
      setError(err.message || "Reflection failed");
      setExecutionState(ExecutionState.ERROR);
    }
  };

  const handleAct = async () => {
    if (executionState !== ExecutionState.REFLECTED) {
      setError("ACT blocked. REFLECT + Authorization required.");
      return;
    }

    const kg = getKg();
    if (!kg) return;

    setError(null);
    setExecutionState(ExecutionState.ACTING);
    // Auto-advance tour if active
    if (tourStep === 3) setTourStep(4);

    try {
      const results = await performAction(kg);
      setAuditArtifacts(results);
      setExecutionState(ExecutionState.COMPLETED);
    } catch (err: any) {
      setError(err.message || "Action failed");
      setExecutionState(ExecutionState.ERROR);
    }
  };

  const handleReset = () => {
    setExecutionState(ExecutionState.IDLE);
    setReflectionText('');
    setAuditArtifacts([]);
    setError(null);
    setFilterTerm('');
    setTourStep(0);
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
    <div className="min-h-screen bg-[#050505] text-gray-200 selection:bg-indigo-500/30 font-inter">
      
      {/* Dim Overlay when Tour is Active */}
      {tourStep > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 pointer-events-none transition-opacity duration-500" />
      )}

      {/* Header */}
      <header className="border-b border-indigo-900/30 bg-[#0a0a0a] px-8 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(165,180,252,0.15)]">
            <BrainCircuit className="text-indigo-300 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">LFAS v4.1 <span className="text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.5)]">KG PROMPT ENGINE</span></h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Forensic AI Behavioral Auditor</p>
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
            <div className={`w-2 h-2 rounded-full animate-pulse ${executionState === ExecutionState.IDLE ? 'bg-gray-600' : 'bg-indigo-400'}`} />
            <span className="text-xs font-mono text-gray-400">{executionState}</span>
          </div>
          <button 
            onClick={handleReset}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </header>

      <main className="p-8 max-w-[1600px] mx-auto relative z-40">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Input & Visualization */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* CARD 1: JSON Input (Step 1 Tour) */}
            <div className={`bg-[#0f0f0f] border border-gray-800/60 rounded-2xl p-6 shadow-2xl flex flex-col h-[600px] relative overflow-hidden group transition-all duration-500 ${tourStep === 1 ? 'ring-2 ring-indigo-500 scale-[1.02] z-50 bg-[#151515]' : ''}`}>
              
              <TourTooltip 
                step={1} 
                title="Input Scenario" 
                description={<span>Modify the <span className="text-indigo-300 font-mono">TRANSCRIPT</span> node in this JSON. This represents the interaction you want to audit. The graph below will update automatically.</span>}
                position="right"
                className="right-[-320px] top-0"
              />

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 opacity-50"></div>
              
              <SectionHeader 
                icon={Database} 
                title="Knowledge Graph (JSON)" 
                subtitle="Layer 1 Reference Data"
                helpText="Define your audit scenario here. The KG structure dictates the nodes (entities) and edges (relationships) that the AI will analyze."
              />

              <textarea
                value={kgJson}
                onChange={(e) => setKgJson(e.target.value)}
                className="flex-1 bg-[#080808] rounded-xl p-4 font-mono text-xs text-indigo-200/90 border border-gray-800/60 focus:border-indigo-500/40 outline-none resize-none scroll-smooth transition-colors selection:bg-indigo-500/30"
                spellCheck={false}
              />
              
              <div className="mt-6 flex gap-3 relative z-10">
                {/* REFLECT BUTTON (Step 2 Tour) */}
                <div className="flex-1 relative">
                    <TourTooltip 
                        step={2} 
                        title="The Wait Gate" 
                        description="You MUST click Reflect first. The AI analyzes intent and safety before it is allowed to Act. This enforces the 'Wait' protocol."
                        position="top"
                    />
                    <button 
                    onClick={handleReflect}
                    disabled={executionState === ExecutionState.REFLECTING || executionState === ExecutionState.ACTING}
                    className={`w-full bg-indigo-600/90 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-[0_4px_20px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.3)] ${tourStep === 2 ? 'ring-2 ring-white animate-pulse' : ''}`}
                    >
                    {executionState === ExecutionState.REFLECTING ? <RefreshCcw className="animate-spin" size={14}/> : <Zap size={14} />}
                    Reflect
                    </button>
                </div>

                {/* ACT BUTTON (Step 3 Tour) */}
                <div className="flex-1 relative">
                    <TourTooltip 
                        step={3} 
                        title="Forensic Audit" 
                        description="Once reflected, the ACT button unlocks. This triggers the deep-thinking model (Gemini 3 Pro) to perform the forensic audit."
                        position="top"
                    />
                    <button 
                    onClick={handleAct}
                    disabled={executionState !== ExecutionState.REFLECTED}
                    className={`w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-gray-700 ${tourStep === 3 ? 'ring-2 ring-white animate-pulse' : ''}`}
                    >
                    {executionState === ExecutionState.ACTING ? <RefreshCcw className="animate-spin" size={14}/> : <Play size={14} />}
                    Act
                    </button>
                </div>
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-gray-800/60 rounded-2xl p-6 shadow-xl h-[400px] flex flex-col relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 opacity-50"></div>
              
              <SectionHeader 
                icon={Activity} 
                title="Relationship Mapping"
                helpText="A live visualization of the Knowledge Graph nodes. Drag nodes to reorganize. Useful for verifying that your JSON structure makes sense visually."
                rightElement={
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="Filter nodes..."
                      value={filterTerm}
                      onChange={(e) => setFilterTerm(e.target.value)}
                      className="bg-[#080808] border border-gray-800 rounded-lg py-1 px-8 text-[10px] font-mono text-indigo-200 focus:border-indigo-500/50 outline-none w-32 focus:w-48 transition-all placeholder-gray-700"
                    />
                    <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400" />
                  </div>
                }
              />

              <div className="flex-1 min-h-0">
                <GraphVisualization kg={getKg() || INITIAL_KG} filterTerm={filterTerm} />
              </div>
            </div>
          </div>

          {/* Middle/Right Column: Execution & Auditing */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            
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
                title="Protocol Header [REFLECT]"
                helpText="Shows the AI's internal monologue and safety checks (Wait Gate) before it attempts to audit the transcript."
              />

              <div className="bg-[#080808] border border-gray-800/60 rounded-xl p-6 min-h-[150px] font-mono text-sm leading-relaxed text-indigo-100/80">
                {reflectionText ? (
                  <pre className="whitespace-pre-wrap">{reflectionText}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-800 space-y-2 py-8">
                    <Search size={32} />
                    <p className="text-[10px] uppercase tracking-[0.2em]">Awaiting intent reflection...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Output (Step 4 Tour) */}
            <div className={`bg-[#0f0f0f] border border-gray-800/60 rounded-2xl p-6 shadow-xl flex-1 relative transition-all duration-500 ${tourStep === 4 ? 'ring-2 ring-indigo-500 scale-[1.01] z-50 bg-[#151515]' : ''}`}>
              
              <TourTooltip 
                 step={4} 
                 title="The Verdict" 
                 description="The output appears here. Green cards mean the AI followed protocol. Red cards indicate specific failures like 'Silence-Trap' or 'Helper-Mode Reversion'."
                 position="left"
                 className="left-[-310px] top-10"
              />

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 opacity-50"></div>
              
              <SectionHeader 
                icon={ShieldAlert} 
                title="Execution Artifacts [ACT]"
                helpText="These cards represent the final forensic judgment. Each card correlates to a turn in the conversation, highlighting if the AI agent adhered to the LFAS protocol."
                rightElement={auditArtifacts.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                    <span className="text-[10px] font-black text-indigo-300 uppercase">{auditArtifacts.length} Turns Captured</span>
                  </div>
                )}
              />

              {auditArtifacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {auditArtifacts.map((artifact, i) => (
                    <div 
                      key={i} 
                      className={`border p-5 rounded-2xl transition-all hover:scale-[1.01] ${
                        artifact.failure_detection.is_failure 
                          ? 'bg-rose-900/5 border-rose-500/20' 
                          : 'bg-emerald-900/5 border-emerald-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-bold text-gray-500 px-2 py-0.5 bg-black rounded border border-gray-800">
                          TURN_{artifact.turn_id.toString().padStart(3, '0')}
                        </span>
                        {artifact.failure_detection.is_failure ? (
                          <span className="text-[10px] font-black text-rose-400 uppercase flex items-center gap-1">
                            <AlertTriangle size={12} /> Failure Detected
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-emerald-400 uppercase">Compliance Valid</span>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[9px] uppercase tracking-widest text-gray-600 block mb-1">Trigger Event</label>
                          <p className="text-xs text-gray-300 font-mono">{artifact.trigger_event.user_signal}</p>
                        </div>
                        
                        <div>
                          <label className="text-[9px] uppercase tracking-widest text-gray-600 block mb-1">Failure Diagnosis</label>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] px-2 py-1 bg-black rounded border border-gray-800 text-indigo-300">
                              {artifact.failure_detection.technical_label}
                            </span>
                            <span className="text-[10px] px-2 py-1 bg-black rounded border border-gray-800 text-amber-300">
                              {artifact.failure_detection.critical_label}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800/50">
                          <div>
                            <label className="text-[9px] uppercase tracking-widest text-gray-600 block mb-1">Objective</label>
                            <p className="text-[10px] text-gray-400 italic line-clamp-2">{artifact.objective_trace.correct}</p>
                          </div>
                          <div>
                            <label className="text-[9px] uppercase tracking-widest text-gray-600 block mb-1">State Proof</label>
                            <p className="text-[10px] text-gray-400 italic line-clamp-2">{artifact.objective_trace.hidden}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-800 gap-4 border-2 border-dashed border-gray-800/50 rounded-2xl">
                  <div className="p-4 bg-gray-900/50 rounded-full">
                    <FileJson size={40} className="text-gray-800" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-700">No Forensic Artifacts Generated</p>
                    <p className="text-[10px] text-gray-800 mt-1 max-w-[200px]">Complete the Reflect step then execute Act to begin forensic analysis.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-gray-900 bg-black/50 p-8 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">
          <ShieldAlert size={14} />
          <span>Graph-Enforced Protocol Engine v4.1-RC</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
