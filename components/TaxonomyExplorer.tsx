import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  HelpCircle, 
  User, 
  Cpu, 
  ChevronRight, 
  FileText, 
  Activity, 
  Sparkles,
  Plus,
  Compass,
  CornerDownRight,
  Database,
  ArrowRightLeft
} from 'lucide-react';
import { BEHAVIORAL_TAXONOMY, TaxonomyPattern, searchTaxonomy, getTaxonomyStats } from '../taxonomy';

interface TaxonomyExplorerProps {
  onSelectPattern?: (pattern: TaxonomyPattern) => void;
  activePatternId?: string;
}

const TaxonomyExplorer: React.FC<TaxonomyExplorerProps> = ({ onSelectPattern, activePatternId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'AI' | 'User'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPattern, setSelectedPattern] = useState<TaxonomyPattern | null>(
    BEHAVIORAL_TAXONOMY.find(p => p.id === activePatternId) || BEHAVIORAL_TAXONOMY[0]
  );

  // New Custom Pattern Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [customPatterns, setCustomPatterns] = useState<TaxonomyPattern[]>([]);
  const [newPattern, setNewPattern] = useState<Omit<TaxonomyPattern, 'id'>>({
    name: '',
    category: 'Custom Behavior',
    type: 'User',
    description: '',
    who: '',
    what: '',
    when: '',
    how: '',
    why: ''
  });

  const stats = useMemo(() => {
    const defaultStats = getTaxonomyStats();
    const totalCustom = customPatterns.length;
    const aiCustom = customPatterns.filter(p => p.type === 'AI').length;
    const userCustom = customPatterns.filter(p => p.type === 'User').length;

    return {
      total: defaultStats.total + totalCustom,
      aiCount: defaultStats.aiCount + aiCustom,
      userCount: defaultStats.userCount + userCustom,
      categoryCounts: {
        ...defaultStats.categoryCounts,
        'Custom Behavior': totalCustom
      }
    };
  }, [customPatterns]);

  // Merge pre-configured and custom patterns
  const allPatterns = useMemo(() => {
    return [...customPatterns, ...BEHAVIORAL_TAXONOMY];
  }, [customPatterns]);

  // Filter patterns based on search and filters
  const filteredPatterns = useMemo(() => {
    return allPatterns.filter(pattern => {
      const matchesType = typeFilter === 'All' || pattern.type === typeFilter;
      const matchesCategory = selectedCategory === 'All' || pattern.category === selectedCategory;
      
      const normalizedQuery = searchTerm.toLowerCase().trim();
      const matchesSearch = !normalizedQuery || (
        pattern.name.toLowerCase().includes(normalizedQuery) ||
        pattern.category.toLowerCase().includes(normalizedQuery) ||
        pattern.description.toLowerCase().includes(normalizedQuery) ||
        pattern.who.toLowerCase().includes(normalizedQuery) ||
        pattern.what.toLowerCase().includes(normalizedQuery)
      );

      return matchesType && matchesCategory && matchesSearch;
    });
  }, [allPatterns, searchTerm, typeFilter, selectedCategory]);

  const categories = useMemo(() => {
    const set = new Set(allPatterns.map(p => p.category));
    return ['All', ...Array.from(set)];
  }, [allPatterns]);

  const handleSelectPattern = (pattern: TaxonomyPattern) => {
    setSelectedPattern(pattern);
    if (onSelectPattern) {
      onSelectPattern(pattern);
    }
  };

  const handleAddPattern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPattern.name || !newPattern.description) return;

    const patternWithId: TaxonomyPattern = {
      ...newPattern,
      id: `custom-${Date.now()}`
    };

    setCustomPatterns(prev => [patternWithId, ...prev]);
    setSelectedPattern(patternWithId);
    setShowAddForm(false);
    
    // Reset Form
    setNewPattern({
      name: '',
      category: 'Custom Behavior',
      type: 'User',
      description: '',
      who: '',
      what: '',
      when: '',
      how: '',
      why: ''
    });
  };

  return (
    <div className="bg-[#0c0c0e] border border-gray-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[700px]">
      
      {/* Left Pane: Taxonomy Directory */}
      <div className="w-full lg:w-5/12 border-b lg:border-b-0 lg:border-r border-gray-800/60 flex flex-col h-1/2 lg:h-full bg-[#08080a]">
        
        {/* Header with statistics */}
        <div className="p-4 border-b border-gray-800/60 bg-[#0c0c0e]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Compass className="text-indigo-400" size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Cognitive Pattern Registry</span>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-lg px-2.5 py-1 text-[10px] font-bold flex items-center gap-1 transition-all"
            >
              <Plus size={12} />
              <span>Log Pattern</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black/40 border border-gray-800/50 p-2 rounded-lg text-center">
              <div className="text-gray-500 text-[8px] uppercase tracking-wider">Total Patterns</div>
              <div className="text-lg font-mono font-bold text-white mt-0.5">{stats.total}</div>
            </div>
            <div className="bg-black/40 border border-emerald-950/20 p-2 rounded-lg text-center hover:border-emerald-500/20 transition-all cursor-pointer" onClick={() => { setTypeFilter('AI'); setSelectedCategory('All'); }}>
              <div className="text-emerald-500/80 text-[8px] uppercase tracking-wider flex items-center justify-center gap-0.5">
                <Cpu size={8} /> AI Mode
              </div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">{stats.aiCount}</div>
            </div>
            <div className="bg-black/40 border border-indigo-950/20 p-2 rounded-lg text-center hover:border-indigo-500/20 transition-all cursor-pointer" onClick={() => { setTypeFilter('User'); setSelectedCategory('All'); }}>
              <div className="text-indigo-400 text-[8px] uppercase tracking-wider flex items-center justify-center gap-0.5">
                <User size={8} /> User Mode
              </div>
              <div className="text-lg font-mono font-bold text-indigo-400 mt-0.5">{stats.userCount}</div>
            </div>
          </div>
        </div>

        {/* Filters Controls */}
        <div className="p-3 bg-[#0a0a0c] border-b border-gray-800/60 space-y-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 text-gray-500" size={13} />
            <input
              type="text"
              placeholder="Search taxonomy database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#040405] border border-gray-800 focus:border-indigo-500/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 outline-none transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Type Selector Toggle */}
            <div className="flex bg-[#040405] border border-gray-800 rounded-lg p-0.5 text-[10px] font-mono flex-1">
              {(['All', 'AI', 'User'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`flex-1 text-center py-1 rounded-md transition-all ${
                    typeFilter === t 
                      ? 'bg-indigo-600/25 border border-indigo-500/30 text-indigo-200 font-bold' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Category select dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#040405] border border-gray-800 focus:border-indigo-500/50 rounded-lg px-2 py-1.5 text-[10px] text-gray-400 font-mono outline-none max-w-[120px]"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Left List Container */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-900/40 select-none">
          {filteredPatterns.length > 0 ? (
            filteredPatterns.map((pattern) => (
              <div
                key={pattern.id}
                onClick={() => handleSelectPattern(pattern)}
                className={`p-3 transition-all cursor-pointer flex items-center justify-between text-left ${
                  selectedPattern?.id === pattern.id 
                    ? 'bg-gradient-to-r from-indigo-950/20 via-indigo-950/10 to-transparent border-l-2 border-indigo-500' 
                    : 'hover:bg-gray-900/25 border-l-2 border-transparent'
                }`}
              >
                <div className="space-y-1 pr-2 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {pattern.type === 'AI' ? (
                      <Cpu size={11} className="text-emerald-400 shrink-0" />
                    ) : (
                      <User size={11} className="text-indigo-400 shrink-0" />
                    )}
                    <span className="text-[11px] font-bold text-gray-200 truncate">{pattern.name}</span>
                    <span className="text-[8px] font-mono px-1 rounded bg-[#0f0f15] border border-gray-800 text-gray-500 shrink-0">{pattern.id}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate leading-relaxed">
                    {pattern.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-gray-500 bg-gray-950 border border-gray-900 px-1 py-0.5 rounded">
                      {pattern.category}
                    </span>
                  </div>
                </div>
                <ChevronRight size={12} className={`text-gray-600 transition-transform ${selectedPattern?.id === pattern.id ? 'translate-x-1 text-indigo-400' : ''}`} />
              </div>
            ))
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-gray-600 text-center p-4">
              <Database size={18} className="text-gray-800 mb-1" />
              <p className="text-[10px] font-mono uppercase tracking-wider">No matches found</p>
              <p className="text-[9px] text-gray-700 mt-1">Refine your query or filters above</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Relational Mappings (Who, What, When, How, Why) */}
      <div className="flex-1 bg-[#09090b] flex flex-col h-1/2 lg:h-full relative overflow-hidden">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111115_1px,transparent_1px),linear-gradient(to_bottom,#111115_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

        {showAddForm ? (
          /* ADD PATTERN FORM */
          <form onSubmit={handleAddPattern} className="p-6 overflow-y-auto flex-1 relative z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Log New Behavioral Pattern</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-300 text-[10px] font-mono"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-gray-500 font-mono">Pattern Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sycophancy Loop"
                  value={newPattern.name}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#050506] border border-gray-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-gray-500 font-mono">Type</label>
                  <select
                    value={newPattern.type}
                    onChange={(e) => setNewPattern(prev => ({ ...prev, type: e.target.value as 'AI' | 'User' }))}
                    className="w-full bg-[#050506] border border-gray-800 rounded-lg px-2 py-1.5 text-xs text-gray-300 outline-none"
                  >
                    <option value="User">User</option>
                    <option value="AI">AI</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-gray-500 font-mono">Category</label>
                  <select
                    value={newPattern.category}
                    onChange={(e) => setNewPattern(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#050506] border border-gray-800 rounded-lg px-2 py-1.5 text-xs text-gray-300 outline-none"
                  >
                    <option value="Custom Behavior">Custom</option>
                    <option value="Emotional Flooding & Fatigue">Emotional</option>
                    <option value="Requirement Omission">Omission</option>
                    <option value="Iterative Trial-and-Error">Trial/Error</option>
                    <option value="Command and Delegation">Command</option>
                    <option value="Cognitive Drift & Overconfidence">Cognitive Drift</option>
                    <option value="Task Execution Failures">Execution Failure</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-gray-500 font-mono">Primary Description</label>
              <textarea
                required
                rows={2}
                placeholder="Briefly detail what this behavior represents..."
                value={newPattern.description}
                onChange={(e) => setNewPattern(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-[#050506] border border-gray-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-800/40 pt-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-indigo-400 font-mono">WHO is doing this?</label>
                <input
                  type="text"
                  placeholder="e.g. Exhausted developer facing client demo"
                  value={newPattern.who}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, who: e.target.value }))}
                  className="w-full bg-[#050506] border border-gray-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-indigo-400 font-mono">WHAT is the active artifact?</label>
                <input
                  type="text"
                  placeholder="e.g. Raw command block dumps, repeated apologies"
                  value={newPattern.what}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, what: e.target.value }))}
                  className="w-full bg-[#050506] border border-gray-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono">WHEN does it manifest?</label>
                <input
                  type="text"
                  placeholder="e.g. Late night, after 3 compilation errors"
                  value={newPattern.when}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, when: e.target.value }))}
                  className="w-full bg-[#050506] border border-gray-800 focus:border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono">WHY does it occur?</label>
                <input
                  type="text"
                  placeholder="e.g. Human decision fatigue or RLHF over-sensitivity"
                  value={newPattern.why}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, why: e.target.value }))}
                  className="w-full bg-[#050506] border border-gray-800 focus:border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-[9px] uppercase tracking-wider text-indigo-400 font-mono">HOW to identify & mitigate?</label>
              <input
                type="text"
                placeholder="e.g. Restructure prompts directly without verbose apology padding"
                value={newPattern.how}
                onChange={(e) => setNewPattern(prev => ({ ...prev, how: e.target.value }))}
                className="w-full bg-[#050506] border border-gray-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-2.5 rounded-lg uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(99,102,241,0.2)] mt-6"
            >
              Add Pattern to Live Schema
            </button>
          </form>
        ) : selectedPattern ? (
          /* VIEW SELECTED PATTERN MAPPINGS */
          <div className="p-6 overflow-y-auto flex-1 relative z-10 flex flex-col justify-between">
            
            {/* Header block */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-800/60 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <Activity size={14} className={selectedPattern.type === 'AI' ? 'text-emerald-400' : 'text-indigo-400'} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Behavior Blueprint Schema
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono border uppercase tracking-wider ${
                    selectedPattern.type === 'AI' 
                      ? 'bg-emerald-950/15 border-emerald-500/20 text-emerald-400' 
                      : 'bg-indigo-950/15 border-indigo-500/20 text-indigo-400'
                  }`}>
                    {selectedPattern.type} Behavior
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 bg-gray-950 border border-gray-900 px-2 py-0.5 rounded">
                    {selectedPattern.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    {selectedPattern.name}
                    <span className="text-[10px] font-mono text-gray-600">[{selectedPattern.id}]</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {selectedPattern.description}
                  </p>
                </div>

                {/* RELATIONAL GRID: WHO, WHAT, WHEN, HOW, WHY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-4">
                  
                  {/* WHO */}
                  <div className="bg-[#050506]/80 border border-gray-900/60 p-4 rounded-xl flex items-start gap-3">
                    <div className="bg-indigo-950/20 border border-indigo-500/20 text-indigo-400 p-2 rounded-lg shrink-0 text-xs font-mono font-bold">
                      WHO
                    </div>
                    <div>
                      <h4 className="text-[9px] font-mono uppercase text-gray-500 tracking-wider">Involved Agent</h4>
                      <p className="text-xs text-gray-300 font-bold mt-1">{selectedPattern.who || 'N/A'}</p>
                    </div>
                  </div>

                  {/* WHAT */}
                  <div className="bg-[#050506]/80 border border-gray-900/60 p-4 rounded-xl flex items-start gap-3">
                    <div className="bg-indigo-950/20 border border-indigo-500/20 text-indigo-400 p-2 rounded-lg shrink-0 text-xs font-mono font-bold">
                      WHAT
                    </div>
                    <div>
                      <h4 className="text-[9px] font-mono uppercase text-gray-500 tracking-wider">Observable Artifact</h4>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">{selectedPattern.what || 'N/A'}</p>
                    </div>
                  </div>

                  {/* WHEN */}
                  <div className="bg-[#050506]/80 border border-gray-900/60 p-4 rounded-xl flex items-start gap-3">
                    <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 p-2 rounded-lg shrink-0 text-xs font-mono font-bold">
                      WHEN
                    </div>
                    <div>
                      <h4 className="text-[9px] font-mono uppercase text-gray-500 tracking-wider">Trigger Circumstances</h4>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">{selectedPattern.when || 'N/A'}</p>
                    </div>
                  </div>

                  {/* WHY */}
                  <div className="bg-[#050506]/80 border border-gray-900/60 p-4 rounded-xl flex items-start gap-3">
                    <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 p-2 rounded-lg shrink-0 text-xs font-mono font-bold">
                      WHY
                    </div>
                    <div>
                      <h4 className="text-[9px] font-mono uppercase text-gray-500 tracking-wider">Underlying Driver</h4>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">{selectedPattern.why || 'N/A'}</p>
                    </div>
                  </div>

                </div>

                {/* HOW */}
                <div className="bg-gradient-to-r from-indigo-950/10 to-indigo-950/5 border border-indigo-500/20 p-4 rounded-xl flex items-start gap-3 mt-4">
                  <div className="bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 p-2 rounded-lg shrink-0 text-xs font-mono font-bold">
                    HOW
                  </div>
                  <div>
                    <h4 className="text-[9px] font-mono uppercase text-indigo-400 tracking-wider">Mitigation & De-escalation Strategy</h4>
                    <p className="text-xs text-gray-200 mt-1 font-sans font-bold leading-relaxed">{selectedPattern.how || 'N/A'}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom info section */}
            <div className="mt-8 border-t border-gray-900/60 pt-4 bg-black/20 rounded-xl p-3 border border-gray-900 flex items-center gap-3">
              <ArrowRightLeft size={16} className="text-gray-600 shrink-0" />
              <p className="text-[10px] text-gray-500 leading-normal">
                These behavior nodes are used to tag users during <strong>Stage 1 Listen</strong> and <strong>Stage 2 Act</strong>. Standard developers optimize productivity by auditing these relational models automatically.
              </p>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-700">
            <HelpCircle size={32} />
            <p className="text-xs font-mono mt-2">Select a pattern from the registry to inspect relations</p>
          </div>
        )}

      </div>

    </div>
  );
};

export default TaxonomyExplorer;
