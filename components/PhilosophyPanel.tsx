import React, { useState } from 'react';
import { 
  Ear, 
  VolumeX, 
  HelpCircle, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Compass, 
  Activity, 
  MessageSquare,
  Flame,
  UserCheck,
  ShieldCheck,
  EyeOff
} from 'lucide-react';

interface Scenario5W1H {
  title: string;
  input: string;
  who: string;
  what: string;
  when: string;
  where: string;
  why: string;
  how: string;
  junkPrevented: string;
}

const LFAS_SCENARIOS: Scenario5W1H[] = [
  {
    title: "Silence as Acceptance (The Silent Treatment)",
    input: "ok",
    who: "Implicit Consent Developer who respects cognitive brevity.",
    what: "Silence / raw acknowledgement (ok) representing approval of the proposed technical schema.",
    when: "Directly after a successful blueprint reflection or compilation step.",
    where: "Main execution workspace loop.",
    why: "Human working memory is focused on speed; typing redundant approvals adds conversation friction.",
    how: "Interpret the silent response as full authorization. Advance directly to file modifications/compilation with zero conversational padding or unasked-for 'junk' explanations.",
    junkPrevented: "Avoids generating paragraphs of polite fluff like 'I'm glad you liked it! Now I will proceed to carefully do x, y, and z...'"
  },
  {
    title: "The Frustrated Stack Overflow",
    input: "This is complete junk, why does my key throw 401?? I've tried everything!",
    who: "Exhausted Developer under deadline pressure facing an API authentication failure.",
    what: "HTTP 401 Unauthorized Server response.",
    when: "During the initial environment variable key connection setup.",
    where: "Server-side environment configuration pipeline.",
    why: "A missing or expired API secret inside the local `.env` configuration file.",
    how: "Disregard the dramatic words ('complete junk', 'everything'). Locate `.env.example`, explain the exact key name needed, and write a lazy-loading API guard to prevent runtime crashes.",
    junkPrevented: "Avoids defensive apologies or philosophical essays on why APIs require authorization."
  },
  {
    title: "Vague Semantic Command",
    input: "make it responsive",
    who: "UI-First Designer seeking mobile/desktop adaptability.",
    what: "A broad aesthetic layout requirement with no explicit CSS constraints.",
    when: "Post-MVP layout review phase.",
    where: "Main viewport wrapper styling classes.",
    why: "Visual layout is hard to express in raw code coordinates; easier to delegate as a general concept.",
    how: "Use Tailwind fluid layouts (`w-full max-w-7xl mx-auto`), responsive grid boundaries (`grid-cols-1 md:grid-cols-3`), and touch-friendly targets.",
    junkPrevented: "Prevents adding custom unrequested JavaScript resize listeners or heavy third-party layout libraries."
  }
];

const PhilosophyPanel: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<number>(0);
  const [customInput, setCustomInput] = useState('');
  const [showCustomResult, setShowCustomResult] = useState(false);

  // Dynamic custom mapping simulation
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setShowCustomResult(true);
  };

  const activeScenario = LFAS_SCENARIOS[selectedScenario];

  // Helper to generate dynamic custom 5W1H values based on simple heuristic
  const getCustom5W1H = (text: string) => {
    const lower = text.toLowerCase();
    
    let who = "Developer seeking technical alignment.";
    let what = "Interactive query deconstruction.";
    let when = "Active development workspace session.";
    let where = "AI & Human communication interface.";
    let why = "To bridge the gap between human intention and absolute compiler execution.";
    let how = "Apply strict 'Listen First, Act Second' criteria: extract objectives, match schema patterns, and compile silently.";
    let junkPrevented = "Unsolicited secondary visual blocks, promotional guides, and redundant dialogue steps.";

    if (lower.includes('css') || lower.includes('color') || lower.includes('style') || lower.includes('ui')) {
      who = "Visual Designer seeking interface fidelity.";
      what = "Aesthetic design and layout refinement.";
      how = "Apply standard clean Tailwind utility classes directly in the markup, avoiding hardcoded inline styles.";
      junkPrevented = "Prevent inline style overrides, custom CSS stylesheets, or unrequested interactive themes.";
    } else if (lower.includes('error') || lower.includes('bug') || lower.includes('fail') || lower.includes('break')) {
      who = "Blocked Engineer seeking immediate mitigation.";
      what = "Runtime exception or compilation blocker.";
      why = "A mismatch in expected data types, unresolved dependencies, or stale environment caches.";
      how = "Isolate the file path, examine the stack trace, and deliver the exact corrected block with a single-sentence proof.";
      junkPrevented = "Saves developer from multi-file re-architecture plans or redundant dependency installations.";
    } else if (lower.length < 5) {
      who = "Implicit Consent User utilizing Silence as Acceptance.";
      what = "Brevity optimization.";
      why = "User is in a high-speed execution loop and expects silent progress.";
      how = "Acknowledge progress in 1-3 words, complete the compilation/checks, and standby for further directives.";
      junkPrevented = "Saves user from paragraphs of polite padding and unrequested features.";
    }

    return { who, what, when, where, why, how, junkPrevented };
  };

  const custom5W1H = getCustom5W1H(customInput);

  return (
    <div className="bg-[#0c0c0e] border border-indigo-900/20 rounded-2xl overflow-hidden shadow-2xl p-6 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/30 via-indigo-600/20 to-indigo-500/30"></div>
      
      {/* Grid Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-900">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <Ear size={16} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Listen First, Act Second (LFAS) Core Philosophy</span>
          </div>
          <h2 className="text-base font-bold text-white tracking-tight mt-1">IT Communication Deconstruction: The Anti-Junk Engine</h2>
          <p className="text-xs text-gray-400 max-w-4xl leading-relaxed">
            What is <strong>IT</strong>? Information Technology is about pristine communication. To prevent the injection of unsolicited, unrequested "junk information", an AI must perform <strong>Meta Listening</strong>—reverse-thinking inputs into structured <strong>5W1H elements</strong> before acting, and fully respecting <strong>The Silent Treatment (Silence as Acceptance)</strong>.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-indigo-950/20 border border-indigo-500/10 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="text-indigo-400 shrink-0" size={14} />
          <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest">Junk Protection Shield Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-6">
        
        {/* Left Column: Core Pillars (5 Columns) */}
        <div className="xl:col-span-5 space-y-4">
          
          <div className="bg-black/40 border border-gray-900 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="text-indigo-400" size={14} />
              <span>Pillar 1: 5W1H Meta-Listening</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Instead of rushing to output code, we reverse-think the input: <strong>Who</strong> is asking? <strong>What</strong> is the true artifact? <strong>When</strong> did it manifest? <strong>Where</strong> does it live? <strong>Why</strong> does it occur? and <strong>How</strong> do we resolve it safely? This filters out noise and centers on literal intent.
            </p>
          </div>

          <div className="bg-black/40 border border-gray-900 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <VolumeX className="text-indigo-400" size={14} />
              <span>Pillar 2: Silence as Acceptance</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              When a user is silent or gives a minimal approval like "ok", they are applying the <strong>Silent Treatment</strong>. This is not a request for a chat; it is a dynamic acceptance. The AI should proceed with direct, silent technical execution without adding unsolicited visual clutter or wordy explanations.
            </p>
          </div>

          {/* Interactive Selector */}
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block">Select a deconstruction scenario:</label>
            <div className="grid grid-cols-1 gap-2">
              {LFAS_SCENARIOS.map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => { setSelectedScenario(index); setShowCustomResult(false); }}
                  className={`px-3 py-2.5 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${
                    !showCustomResult && selectedScenario === index
                      ? 'bg-indigo-950/30 border-indigo-500/60 text-indigo-200 shadow-lg'
                      : 'bg-[#08080a] border-gray-900 text-gray-400 hover:border-gray-800 hover:text-gray-200'
                  }`}
                >
                  <span className="font-bold">{scenario.title}</span>
                  <ArrowRight size={12} className={`text-gray-600 transition-transform ${!showCustomResult && selectedScenario === index ? 'translate-x-1 text-indigo-400' : ''}`} />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Visualizer (7 Columns) */}
        <div className="xl:col-span-7 bg-[#08080a] border border-gray-900 rounded-2xl p-5 flex flex-col justify-between min-h-[380px] relative">
          
          <div>
            <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="text-indigo-400 animate-pulse" size={14} />
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                  {showCustomResult ? 'Custom Meta-Listening Deconstruction' : 'Philosophy Case Study deconstruction'}
                </span>
              </div>
              <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-2 py-0.5 rounded">
                STAGE: LISTEN FIRST
              </span>
            </div>

            {/* Simulated Input Bar */}
            <div className="bg-black/60 p-3 rounded-xl border border-gray-900 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare size={10} /> Raw User Input
                </span>
                {showCustomResult && (
                  <button 
                    onClick={() => setShowCustomResult(false)}
                    className="text-[8px] font-mono text-indigo-400 hover:underline"
                  >
                    Reset to Case Studies
                  </button>
                )}
              </div>
              <p className="text-xs font-mono text-indigo-100/90 italic leading-relaxed">
                "{showCustomResult ? customInput : activeScenario.input}"
              </p>
            </div>

            {/* 5W1H GRID mapping */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'WHO (Involved Actor)', val: showCustomResult ? custom5W1H.who : activeScenario.who, color: 'text-indigo-400 border-indigo-950/40' },
                { label: 'WHAT (Observable)', val: showCustomResult ? custom5W1H.what : activeScenario.what, color: 'text-indigo-400 border-indigo-950/40' },
                { label: 'WHEN (Trigger)', val: showCustomResult ? custom5W1H.when : activeScenario.when, color: 'text-emerald-400 border-emerald-950/40' },
                { label: 'WHERE (Target)', val: showCustomResult ? custom5W1H.where : activeScenario.where, color: 'text-emerald-400 border-emerald-950/40' },
                { label: 'WHY (Underlying Driver)', val: showCustomResult ? custom5W1H.why : activeScenario.why, color: 'text-indigo-400 border-indigo-950/40' },
                { label: 'HOW (Reverse Thinking Plan)', val: showCustomResult ? custom5W1H.how : activeScenario.how, color: 'text-indigo-400 border-indigo-950/40', span: true },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`bg-black/30 border border-gray-900 p-3 rounded-xl text-left ${item.span ? 'col-span-2 md:col-span-3 border-indigo-900/30 bg-indigo-950/5' : ''}`}
                >
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block">{item.label}</span>
                  <p className="text-[11px] text-gray-300 font-medium mt-1 leading-relaxed">{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* JUNK PREVENTION BANNER */}
          <div className="mt-5 border-t border-gray-900 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-indigo-950/10 rounded-xl p-3.5 border border-indigo-900/20">
            <div className="flex items-start gap-2.5">
              <EyeOff size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Cognitive Junk Blocked Successfully</h4>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  {showCustomResult ? custom5W1H.junkPrevented : activeScenario.junkPrevented}
                </p>
              </div>
            </div>
          </div>

          {/* Custom Intent Playground */}
          <form onSubmit={handleCustomSubmit} className="mt-4 pt-3 border-t border-gray-900 flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Test the Meta-Listening reverse thinking on your own phrase..."
              className="flex-1 bg-black border border-gray-900 focus:border-indigo-500/50 rounded-xl px-3 py-1.5 text-xs text-gray-300 outline-none placeholder-gray-600 font-mono"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 hover:border-indigo-500 text-indigo-300 hover:text-white rounded-xl px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              Reverse Think
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default PhilosophyPanel;
