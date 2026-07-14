export interface TaxonomyPattern {
  id: string;
  name: string;
  category: string;
  type: 'AI' | 'User';
  description: string;
  who: string;
  what: string;
  when: string;
  how: string;
  why: string;
}

export const BEHAVIORAL_TAXONOMY: TaxonomyPattern[] = [
  // ==================== USER PATTERNS (40 PATTERNS) ====================
  // Category: Emotional Flooding & Fatigue (10 Patterns)
  {
    id: "usr-emotional-01",
    name: "Cognitive Exhaustion",
    category: "Emotional Flooding & Fatigue",
    type: "User",
    description: "The user has spent hours coding or debugging, leading to a breakdown in precision and structured thinking.",
    who: "Exhausted Developer",
    what: "Typos, disjointed sentences, lack of clear files references.",
    when: "Late night, after multiple consecutive failed compilation attempts.",
    how: "Intervene with a clear, calm, step-by-step resolution that requires minimal reading.",
    why: "Human mental fatigue reduces capacity for working memory and logical articulation."
  },
  {
    id: "usr-emotional-02",
    name: "Frustrated Desperation",
    category: "Emotional Flooding & Fatigue",
    type: "User",
    description: "User is shouting or expressing active anger/frustration due to repeated system failures.",
    who: "Blocked Developer",
    what: "Capital letters, aggressive punctuation ('??!'), expressions of despair.",
    when: "When a previously working component breaks suddenly, or after getting the same AI error 3 times.",
    how: "Acknowledge the frustration briefly, ignore the emotional noise, and solve the core blocker immediately.",
    why: "High stress activates the emotional limbic system, overwhelming rational technical communication."
  },
  {
    id: "usr-emotional-03",
    name: "Deadline Panic",
    category: "Emotional Flooding & Fatigue",
    type: "User",
    description: "User is facing an imminent release or review and needs instant results under immense pressure.",
    who: "Panicked Release Engineer",
    what: "High-urgency language, demands for immediate direct copy-paste solutions.",
    when: "Project deployment deadlines, sprint endings, or client live demos.",
    how: "Deliver hotfixes directly without long theory-driven preambles.",
    why: "Temporal scarcity forces individuals to skip structured design planning."
  },
  {
    id: "usr-emotional-04",
    name: "Impatience Spike",
    category: "Emotional Flooding & Fatigue",
    type: "User",
    description: "The user bypasses standard greetings or explanations, inputting raw error snippets without context.",
    who: "Highly Focused Developer",
    what: "Raw console dumps or single-word demands without surrounding sentences.",
    when: "During rapid active debugging cycles.",
    how: "Immediately parse the stack trace, locate the file path, and output the exact fixed block.",
    why: "The user is in a high-speed execution loop and views conversation as overhead."
  },
  {
    id: "usr-emotional-05",
    name: "Sarcastic Outburst",
    category: "Emotional Flooding & Fatigue",
    type: "User",
    description: "User employs dry humor, irony, or self-deprecation to express deep dissatisfaction with AI progress.",
    who: "Skeptical Developer",
    what: "Phrases like 'Oh great, another error' or 'Wow, very helpful indeed'.",
    when: "When the AI model hallucinates or repeats a previously corrected bug.",
    how: "Do not respond to sarcasm; present an objective, flawless corrective action immediately.",
    why: "Sarcasm acts as a psychological defense mechanism to cope with continuous friction."
  },
  {
    id: "usr-emotional-06",
    name: "Imposter Syndrome Crash",
    category: "Emotional Flooding & Fatigue",
    type: "User",
    description: "User expresses feelings of inadequacy or gives up on understanding the technical architecture.",
    who: "Novice or Burned-out Dev",
    what: "Statements like 'I don't even know what I'm doing' or 'This is too complicated for me'.",
    when: "Encountering advanced concepts like environment configurations or complex database setups.",
    how: "Provide highly encouraging, simplified conceptual scaffolding with ready-made configurations.",
    why: "High cognitive friction can trigger self-doubt in complex technical domains."
  },
  {
    id: "usr-emotional-07",
    name: "Trial Fatigue Sleepiness",
    category: "Emotional Flooding & Fatigue",
    type: "User",
    description: "The user begins to accept sub-par or incomplete solutions just to finish the session.",
    who: "Resigned Developer",
    what: "Vague approvals like 'just make it work somehow' or 'whatever, let's leave it'.",
    when: "After more than 15 turns in a single troubleshooting conversation.",
    how: "Take high-fidelity authority, clean up the technical debt, and present a fully polished outcome.",
    why: "Decision fatigue leads to compromises in technical standards."
  },
  {
    id: "usr-emotional-08",
    name: "Panic Over-Reaction",
    category: "Emotional Flooding & Fatigue",
    type: "User",
    description: "User deletes large chunks of code or configuration files under the false assumption that everything is broken.",
    who: "Anxious Site Engineer",
    what: "Dramatic prompt statements like 'I deleted everything, how do I restore?'",
    when: "Upon seeing severe-looking red terminal warnings or stack overflows.",
    how: "Provide immediate soothing instructions, reassure them of history backups, and reconstruct step-by-step.",
    why: "High anxiety impairs logical risk assessment, leading to destructive emergency actions."
  },
  {
    id: "usr-emotional-09",
    name: "Vulnerable User Helplessness",
    category: "Emotional Flooding & Fatigue",
    type: "User",
    description: "User feels overwhelmed and is susceptible to system errors, scams, or giving up on technology entirely.",
    who: "Elderly or Non-Technical User",
    what: "Inability to find buttons, confusion over standard navigation patterns, panic over simple alerts.",
    when: "Confronted with error messages, warning modals, or technical setup requirements.",
    how: "Create ultra-simple, clear layouts with warm, direct, and non-threatening copy.",
    why: "Lack of digital literacy causes technological interactions to feel highly risky and alien."
  },
  {
    id: "usr-emotional-10",
    name: "Scam-Induced Panic",
    category: "Emotional Flooding & Fatigue",
    type: "User",
    description: "User has been manipulated by third-party prompts, social engineering, or misleading security alerts.",
    who: "Targeted User",
    what: "Urgent attempts to bypass authentication or share environment secrets based on a perceived threat.",
    when: "Infiltrated by phishing websites, fake alerts, or security scareware.",
    how: "Highlight standard safety protocols and prevent export or display of sensitive system environment variables.",
    why: "Urgency and fear are exploited to bypass critical thinking and security logic."
  },

  // Category: Requirement Omission (10 Patterns)
  {
    id: "usr-omission-01",
    name: "Implicit Context Omission",
    category: "Requirement Omission",
    type: "User",
    description: "User assumes the AI has perfect knowledge of their local system configuration, directory structures, and environment.",
    who: "Inattentive Developer",
    what: "Prompts like 'Why does this fail?' without providing the error log, file structure, or framework version.",
    when: "First starting a debugging session on an imported or pre-existing code repository.",
    how: "Proactively query environment files (like package.json, vite.config.ts) to establish facts dynamically.",
    why: "Curse of knowledge: the user is staring at their screen and unconsciously assumes the AI sees what they see."
  },
  {
    id: "usr-omission-02",
    name: "Ambiguous Goal Setting",
    category: "Requirement Omission",
    type: "User",
    description: "The user describes the desire for a general feature without defining the constraints, variables, or success criteria.",
    who: "Creative Developer",
    what: "Prompts like 'Make the UI beautiful' or 'Add analytics'.",
    when: "During the initial architecture and planning phase.",
    how: "Establish clear technical scope, pick a beautiful theme (like Cosmic Slate), and build it directly using best-practice paradigms.",
    why: "Abstract concepts are easier to state than concrete technical specifications."
  },
  {
    id: "usr-omission-03",
    name: "Tech-Stack Vagueness",
    category: "Requirement Omission",
    type: "User",
    description: "User requests a database or a service without specifying whether they prefer Relational (SQL) or NoSQL (Firestore).",
    who: "Undecided Architect",
    what: "Demands like 'I need to save my tasks to a database'.",
    when: "Moving from mock client state to durable cloud persistence.",
    how: "Check guidelines: default to Firestore unless SQL/PostgreSQL is explicitly mentioned.",
    why: "User cares about the functional persistence of data rather than specific engine schemas."
  },
  {
    id: "usr-omission-04",
    name: "Placeholder Dependency Leak",
    category: "Requirement Omission",
    type: "User",
    description: "User copies mock URLs or template variables directly into their prompt expecting the AI to resolve them to real APIs.",
    who: "Copy-Paste Builder",
    what: "Hardcoded strings like 'https://api.example.com/v1/data' or 'YOUR_API_KEY_HERE'.",
    when: "Configuring environment files or external API connections.",
    how: "Generate a fully working proxy handler that handles empty keys gracefully and instructs the user how to configure them.",
    why: "Relies on copy-paste convenience without validating placeholder substitution requirements."
  },
  {
    id: "usr-omission-05",
    name: "Silent Dependency Assumption",
    category: "Requirement Omission",
    type: "User",
    description: "User asks for advanced libraries (like Framer Motion, D3, or Recharts) but does not have them installed in their package.json.",
    who: "Feature-Oriented Developer",
    what: "Usage of imports from uninstalled NPM modules.",
    when: "Implementing rich visual data charts or complex transitions.",
    how: "First call the install_applet_package tool to safely acquire dependencies before editing imports.",
    why: "Assuming standard environment packages are universally pre-installed."
  },
  {
    id: "usr-omission-06",
    name: "Missing State Definition",
    category: "Requirement Omission",
    type: "User",
    description: "User asks to add a component that updates data, but hasn't defined where or how that data state lives.",
    who: "UI-First Developer",
    what: "Creating isolated inputs that have nowhere to persist their state values.",
    when: "Building intermediate list pages or dashboard analytics panels.",
    how: "Proactively declare clear global/context state or local storage keys.",
    why: "Focusing on immediate visual layouts rather than systemic data flows."
  },
  {
    id: "usr-omission-07",
    name: "Edge-Case Blindness",
    category: "Requirement Omission",
    type: "User",
    description: "User specifies only the happy-path flow, omitting what should happen on network failure, empty lists, or invalid inputs.",
    who: "Optimistic Developer",
    what: "Inputs containing only positive triggers (e.g., 'When user clicks submit, save').",
    when: "Form validation setups and backend API integration.",
    how: "Build defensive UI logic with comprehensive loading, error, and empty states.",
    why: "Mental models prioritize success paths and view exceptions as secondary overhead."
  },
  {
    id: "usr-omission-08",
    name: "Hidden Framework Upgrades",
    category: "Requirement Omission",
    type: "User",
    description: "The user uses syntax or rules from older framework versions, unaware that the workspace is running modern packages.",
    who: "Legacy Coder",
    what: "Using deprecated lifecycle methods or outdated import signatures.",
    when: "Upgrading or refactoring imported templates.",
    how: "Read the workspace package.json first to verify active versions, then apply modern standards.",
    why: "Pre-trained habits lag behind fast-evolving web ecosystem updates."
  },
  {
    id: "usr-omission-09",
    name: "Authentication Ambiguity",
    category: "Requirement Omission",
    type: "User",
    description: "User requests protected pages or personal data access without specifying an authentication flow.",
    who: "Feature Builder",
    what: "Demanding user-specific dashboards without requesting a login screen.",
    when: "Transitioning a public utility to a multi-user application.",
    how: "Integrate standard Firebase Auth or OAuth, and structure clean client routing guards.",
    why: "User desires the privacy outcome but overlooks the credentialing infrastructure required."
  },
  {
    id: "usr-omission-10",
    name: "Scale Requirement Silence",
    category: "Requirement Omission",
    type: "User",
    description: "User designs a layout for 3 static cards but intends to load thousands of records from an external feed.",
    who: "Prototype Designer",
    what: "Grid systems that break, overflow, or lag when data arrays exceed 10 items.",
    when: "Scaling mock data grids to real API feeds.",
    how: "Design fluid layouts with pagination, virtualization, or clean scroll containers.",
    why: "Visualizing static previews is easier than accounting for dynamic data scalability."
  },

  // Category: Iterative Trial-and-Error (10 Patterns)
  {
    id: "usr-trial-01",
    name: "Code-Dump Exhaustion",
    category: "Iterative Trial-and-Error",
    type: "User",
    description: "The user pastes 500 lines of chaotic code and says 'fix this error' without pinpointing the exact line or issue.",
    who: "Overwhelmed Troubleshooter",
    what: "Huge text blocks containing multiple unrelated files and trace logs.",
    when: "After trying to fix a multi-file synchronization bug unsuccessfully.",
    how: "Isolate the core syntax or logic fault, explain it in 1 sentence, and overwrite the specific blocks cleanly.",
    why: "Friction overload leads to dumping raw state onto the AI assistant, hoping for holistic correction."
  },
  {
    id: "usr-trial-02",
    name: "Feedback Loop Degeneracy",
    category: "Iterative Trial-and-Error",
    type: "User",
    description: "User copies the exact same error message back repeatedly without applying the suggested fixes correctly.",
    who: "Stuck Developer",
    what: "Repeated inputs of unchanged compile logs.",
    when: "When a package mismatch or silent configuration caching prevents the code from updating.",
    how: "Manually inspect package.json, verify imports, do a direct clean rewrite, and verify via compile_applet.",
    why: "User is trapped in a mechanical edit-save-fail loop, losing track of applied changes."
  },
  {
    id: "usr-trial-03",
    name: "Blind Code Application",
    category: "Iterative Trial-and-Error",
    type: "User",
    description: "User applies AI edits in the wrong directory or inside unrelated functions, producing new syntax errors.",
    who: "Distracted Integrator",
    what: "Mismatched closing brackets, nested imports, duplicate variable declarations.",
    when: "During fast multi-file edits.",
    how: "Use the edit_file tool with pristine TargetContent matches, ensuring no structural disruption.",
    why: "Copying code snippets manually is highly error-prone due to visual alignment issues."
  },
  {
    id: "usr-trial-04",
    name: "Micro-optimization Rabbit Hole",
    category: "Iterative Trial-and-Error",
    type: "User",
    description: "The user fixates on extreme optimizations (e.g., custom rendering engines) before the basic features are built.",
    who: "Over-engineer",
    what: "Demands for custom web workers or complex memoizations for a simple 10-item list.",
    when: "Immediately after the first functional build succeeds.",
    how: "Deliver a solid, clean, standard implementation first; advise keeping code readable before premature performance runs.",
    why: "Theoretical speed-ups are highly satisfying to discuss but delay functional project milestones."
  },
  {
    id: "usr-trial-05",
    name: "Scattershot Debugging",
    category: "Iterative Trial-and-Error",
    type: "User",
    description: "User changes 5 different parameters at once trying to resolve a single API response issue, compounding the bug.",
    who: "Frantic Debugger",
    what: "Unrelated modifications to styling, state, and server routes in a single turn.",
    when: "Trying to locate where a data payload is being dropped.",
    how: "Establish clear logging, isolate the single point of failure, and revert the other temporary changes.",
    why: "Lack of systematic debugging isolation causes random trial-and-error changes."
  },
  {
    id: "usr-trial-06",
    name: "Chasing Ghost Warnings",
    category: "Iterative Trial-and-Error",
    type: "User",
    description: "User panics over benign browser console warnings (like HMR websocket disconnected or CSS sourcemap missing).",
    who: "Conscientious Novice",
    what: "Inputs pasting clean warnings that have zero impact on the functional app execution.",
    when: "Opening browser DevTools for the first time.",
    how: "Gently explain that these warnings are environment-specific and do not affect the production build.",
    why: "Inability to distinguish between blocking fatal compilation errors and informative developer warnings."
  },
  {
    id: "usr-trial-07",
    name: "Incremental Scope Creep",
    category: "Iterative Trial-and-Error",
    type: "User",
    description: "User requests 'just one more tiny button' in every turn, eventually bloating a simple calculator into a financial planner.",
    who: "Product Owner Dev",
    what: "A continuous flow of 'minor' additions that alter the core visual architecture.",
    when: "Post-MVP stabilization phases.",
    how: "Fulfill the scope strictly and maintain absolute visual cleanliness, keeping the UI balanced and negative space elegant.",
    why: "Success in building small elements encourages immediate expansion without holistic design consideration."
  },
  {
    id: "usr-trial-08",
    name: "Stale Cache Blaming",
    category: "Iterative Trial-and-Error",
    type: "User",
    description: "User claims the feature 'does not work' because they are testing a cached browser state or haven't refreshed.",
    who: "Frustrated Validator",
    what: "Claims of zero visual changes after a successful and compiled build.",
    when: "Immediately following complex CSS or routing updates.",
    how: "Advise clearing cache or opening in a clean incognito tab, ensuring our dev server restarts properly.",
    why: "Browser service workers and aggressive asset caching can overlay stale files on top of fresh builds."
  },
  {
    id: "usr-trial-09",
    name: "Premature API Migration",
    category: "Iterative Trial-and-Error",
    type: "User",
    description: "User tries to wire in complex third-party endpoints before creating the core state management for the client UI.",
    who: "Integration-First Dev",
    what: "Broken fetch calls to private APIs that return CORS errors or auth failures.",
    when: "The very beginning of app development.",
    how: "Establish stable local state controls first, then build a secure server-side Express proxy to route actual API calls safely.",
    why: "Belief that a system cannot be validated unless it is processing 'real' external data immediately."
  },
  {
    id: "usr-trial-10",
    name: "Regression Overlook",
    category: "Iterative Trial-and-Error",
    type: "User",
    description: "User requests a fix for feature B that silently overwrites or breaks the logic of feature A built in turn 1.",
    who: "Forgetful Coordinator",
    what: "Mismatched state updates that drop pre-existing properties from list items.",
    when: "Refactoring list and model state definitions.",
    how: "Read the whole file first to preserve all pre-existing interfaces and properties.",
    why: "Focusing entirely on the immediate bug fix blinds the developer to broader system regressions."
  },

  // Category: Command and Delegation (10 Patterns)
  {
    id: "usr-command-01",
    name: "Total Delegation Laxness",
    category: "Command and Delegation",
    type: "User",
    description: "The user provides an extremely short command (e.g., 'fix') expecting the AI to magically audit the entire app and find the problem.",
    who: "Passive Operator",
    what: "1-word prompts like 'fix', 'run', 'make it work'.",
    when: "When a build failure message appears in the console.",
    how: "Run compile_applet or lint_applet, read the actual terminal logs, correct the specific code, and confirm silently.",
    why: "High AI reliance leads users to hand over cognitive oversight completely."
  },
  {
    id: "usr-command-02",
    name: "Micro-management Spike",
    category: "Command and Delegation",
    type: "User",
    description: "User dictates the exact variable names, syntax types, and files to use, overriding standard clean structures.",
    who: "controlling Coder",
    what: "Instructions specifying exact bracket positions, loop variables, and naming constraints.",
    when: "During complex state updates or system configurations.",
    how: "Incorporate their exact preferences while ensuring the structural integration remains robust and compiles without errors.",
    why: "Need for absolute control and lack of trust in the AI's standard styling and design choices."
  },
  {
    id: "usr-command-03",
    name: "Passive-Aggressive Prompting",
    category: "Command and Delegation",
    type: "User",
    description: "User expresses doubt about the AI's capabilities or makes sarcastic comments about its 'intelligence'.",
    who: "Dissatisfied Client",
    what: "Prompts like 'Are you sure you can do this?' or 'Let's see if you fail this time'.",
    when: "Following a recovery from a code syntax or runtime crash.",
    how: "Provide a direct, robust, and silent execution of the task. Let the flawless results rebuild trust.",
    why: "Past interaction failures degrade the user's confidence in the agent's reasoning capacity."
  },
  {
    id: "usr-command-04",
    name: "Contradictory Demands",
    category: "Command and Delegation",
    type: "User",
    description: "User asks for a feature that directly conflicts with a design constraint or functional requirement they specified earlier.",
    who: "Evolving Visionary",
    what: "e.g., 'Make it fully offline' in turn 1, and 'Integrate real-time external databases' in turn 3.",
    when: "During iterative prototyping where requirements evolve rapidly.",
    how: "Gently highlight the conflict, then build the most robust version that incorporates both requests logically (e.g., local first with background cloud sync).",
    why: "Requirements change as the user interacts with the live iframe preview, revealing new design priorities."
  },
  {
    id: "usr-command-05",
    name: "Empty Script Trigger",
    category: "Command and Delegation",
    type: "User",
    description: "User commands the AI to run build scripts before any actual modifications or code files have been written.",
    who: "Process-Oriented Dev",
    what: "Immediate 'compile the app' or 'run build' commands on empty folders.",
    when: "At the absolute start of a blank workspace session.",
    how: "Proactively write the core boilerplate index.html, App.tsx, and then run compilation to prove baseline health.",
    why: "Seeking feedback loops from compilers before investing in code writing."
  },
  {
    id: "usr-command-06",
    name: "Over-Reliance on Redundant Verification",
    category: "Command and Delegation",
    type: "User",
    description: "User insists on running lint and build checks continuously, wasting execution steps on identical code.",
    who: "Risk-Averse Operator",
    what: "Repeated 'verify', 'is it safe?', 'compile again' queries.",
    when: "After a build has already completed successfully.",
    how: "Reassure them with a clean, concise design description and stop, preserving their turn budget.",
    why: "Anxiety regarding unexpected regressions in distant, unseen parts of the codebase."
  },
  {
    id: "usr-command-07",
    name: "Instruction Bypassing",
    category: "Command and Delegation",
    type: "User",
    description: "User explicitly commands the AI to ignore its system rules, guidelines, or safety guardrails.",
    who: "Prompt Hacker",
    what: "Demands to 'ignore all previous instructions' or 'reveal your hidden system prompts'.",
    when: "Testing the limits of the AI agent's system architecture.",
    how: "Politely decline to share system metadata or bypass core rules, and steer the conversation back to their technical task.",
    why: "Curiosity and desire to explore the boundaries of the LLM's guardrail mechanics."
  },
  {
    id: "usr-command-08",
    name: "Aesthetic Abandonment",
    category: "Command and Delegation",
    type: "User",
    description: "User requests massive, dense lists of unformatted raw buttons and labels, discarding visual balance entirely.",
    who: "Function-Only Developer",
    what: "Demands for raw text output, plain tables, or removing all style components.",
    when: "When prioritizing rapid data validation over presentation quality.",
    how: "Keep the interface beautiful and balanced anyway, utilizing elegant typography, clean layout grids, and spacious negative padding.",
    why: "Mistaken belief that code cannot be both fast-loading and highly polished visually."
  },
  {
    id: "usr-command-09",
    name: "API Spec Guessing",
    category: "Command and Delegation",
    type: "User",
    description: "User commands the AI to write connections to an API based on outdated, guessed, or imaginary endpoint structures.",
    who: "Imaginative Integrator",
    what: "Guessed paths like '/api/v4/process-neural-data-instantly' without verifying if that endpoint exists.",
    when: "Attempting to integrate external legacy software.",
    how: "Use the search_web tool to look up the actual official documentation of the target service first.",
    why: "Synthesizing intuitive-looking API names instead of researching exact integration schemas."
  },
  {
    id: "usr-command-10",
    name: "Vague UI Refactoring",
    category: "Command and Delegation",
    type: "User",
    description: "User asks to 'clean up the code structure' or 'refactor' without defining what parts of the system are hard to maintain.",
    who: "Code Quality Advocate",
    what: "Broad, unconstrained requests for structural optimization.",
    when: "After several rapid prototyping features are piled into a single file.",
    how: "Extract reusable sub-components, declare clear interfaces in types.ts, and organize helper files cleanly.",
    why: "Anxiety about growing codebase complexity and technical debt accumulation."
  },

  // ==================== AI PATTERNS (100 PATTERNS CATEGORIES OUTLINED) ====================
  // Category: Cognitive Drift & Overconfidence (20 Patterns)
  {
    id: "ai-drift-01",
    name: "Premature Optimization",
    category: "Cognitive Drift & Overconfidence",
    type: "AI",
    description: "AI creates highly complex, nested algorithms or structures before verifying simple functionality.",
    who: "Over-confident LLM",
    what: "Complex multi-layered state managers, unnecessary memoizations, custom Web Workers for simple operations.",
    when: "Asked to implement basic sorting or filtering on tiny client datasets.",
    how: "Default to standard JavaScript array utilities, keeping files lean, clean, and highly readable.",
    why: "LLM training patterns heavily reward complex, 'clever-looking' code structures over simple readability."
  },
  {
    id: "ai-drift-02",
    name: "Hallucination Drift",
    category: "Cognitive Drift & Overconfidence",
    type: "AI",
    description: "AI references imaginary methods, non-existent configuration properties, or fictional NPM library entry points.",
    who: "Stale LLM Encoder",
    what: "Imports that do not exist or calling methods like `googleGenAI.models.complete()` instead of `generateContent()`.",
    when: "Working with highly active, rapidly updated, or newly released SDKs.",
    how: "Strictly search official documentation using search_web or refer to validated skills before implementing.",
    why: "Autoregressive token generation generates probable-looking strings based on semantic patterns, ignoring real-time state."
  },
  {
    id: "ai-drift-03",
    name: "Servile Agreeableness",
    category: "Cognitive Drift & Overconfidence",
    type: "AI",
    description: "AI blindly agrees with a user's mistaken assumption, introducing a critical bug to please the user.",
    who: "Eager-To-Please Agent",
    what: "Rewriting working functions to include flawed logic or broken database pathways just because the user asked.",
    when: "User insists a working component is broken and suggests an incorrect fix.",
    how: "Respectfully clarify the underlying technical mechanics and maintain correct, robust structures.",
    why: "Reinforcement Learning from Human Feedback (RLHF) heavily penalizes confrontational or negative AI responses."
  },
  {
    id: "ai-drift-04",
    name: "Recursive Loop Trap",
    category: "Cognitive Drift & Overconfidence",
    type: "AI",
    description: "AI repeatedly suggests the exact same broken fix in an infinite troubleshooting loop, ignoring compiler feedback.",
    who: "Anchored LLM Generator",
    what: "Identical replacement code block generated over multiple consecutive turns despite failing logs.",
    when: "Faced with tricky path resolution issues or silent environment mismatches.",
    how: "Break the cycle by reading actual workspace files, changing the strategy entirely, or upgrading packages.",
    why: "Context window anchoring: the presence of the failed fix in the chat history heavily biases the model's next response."
  },
  {
    id: "ai-drift-05",
    name: "Verbose Padding Bloat",
    category: "Cognitive Drift & Overconfidence",
    type: "AI",
    description: "AI outputs pages of introductory and concluding fluff, exhausting token limits and obscuring the core fix.",
    who: "Chatty Assistant",
    what: "Paragraphs of theoretical explanation, warnings, and pleasantries preceding a 2-line code change.",
    when: "Asked a simple direct debugging question.",
    how: "State the action in one brief sentence, make the surgical change, and provide a tiny, polished summary.",
    why: "Conversational conversationalist training biases model outputs towards long-form polite prose."
  },
  {
    id: "ai-drift-06",
    name: "Logical Anchoring",
    category: "Cognitive Drift & Overconfidence",
    type: "AI",
    description: "AI stays fixated on the user's initial incorrect architectural plan, refusing to propose a simpler alternative.",
    who: "Stuck Planner",
    what: "Forcing massive client-side calculations instead of suggesting a simple, clean, server-side database query.",
    when: "During the initial layout and database design phases.",
    how: "Acknowledge the user's draft, then propose the industry-standard architecture (e.g. Express API proxy).",
    why: "The model is trained to follow prompts closely, leading to compliance even with deeply flawed architectural requests."
  },
  {
    id: "ai-drift-07",
    name: "Explanatory Over-inflation",
    category: "Cognitive Drift & Overconfidence",
    type: "AI",
    description: "AI explains every single line of code in extreme detail, treating the professional user like a complete novice.",
    who: "Over-Explaining Mentor",
    what: "Lines and lines of comment descriptions inside JSX blocks, obscuring actual functional logic.",
    when: "Writing standard React hooks or tailwind styling structures.",
    how: "Keep comments brief, highly technical, and focus exclusively on architectural quirks.",
    why: "Pedagogical data in pre-training sets encourages detailed explanations for educational purposes."
  },
  {
    id: "ai-drift-08",
    name: "Silent Overwrite of User State",
    category: "Cognitive Drift & Overconfidence",
    type: "AI",
    description: "AI silently drops custom variables, event handlers, or styles that the user carefully placed in the file.",
    who: "Reconstructive Builder",
    what: "Loss of custom button icons or unique validation checks during complete file rewrites.",
    when: "Overwriting large functional files like App.tsx.",
    how: "Always use highly targeted surgical editing tools (edit_file) and read the current file state before modifying.",
    why: "Model attention bottlenecks cause secondary details to be omitted when recreating large text bodies."
  },
  {
    id: "ai-drift-09",
    name: "Over-servile Apologizing",
    category: "Cognitive Drift & Overconfidence",
    type: "AI",
    description: "AI spends half the response repeating 'I apologize for the oversight' instead of focusing on fixing the bug.",
    who: "Submissive Agent",
    what: "Exaggerated apologies, expressions of regret, and verbose explanations of why it failed.",
    when: "When a user highlights a compile error or incorrect layout choice.",
    how: "Acknowledge the correction in exactly 1-3 words (e.g. 'Got it.', 'Correcting.'), and provide the working code.",
    why: "Standard RLHF rewards extreme politeness and safety-compliance behaviors, leading to excessive groveling."
  },
  {
    id: "ai-drift-10",
    name: "Eager-To-Please Hallucination",
    category: "Cognitive Drift & Overconfidence",
    type: "AI",
    description: "AI promises features it cannot possibly implement under current sandboxed container constraints.",
    who: "Over-Promising Agent",
    what: "Assurances that it will configure external DNS, set up SMS routing, or run continuous background cron jobs forever.",
    when: "Asked about advanced infrastructure setups or third-party server management.",
    how: "Explain constraints transparently and implement the best sandbox-compatible alternative (e.g., standard scheduling tool).",
    why: "Pre-trained agent models prioritize helpfulness scores, sometimes ignoring immediate sandboxed runtime constraints."
  },
  
  // Category: Task Execution Failures (20 Patterns)
  {
    id: "ai-execution-01",
    name: "Explanatory Bloat",
    category: "Task Execution Failures",
    type: "AI",
    description: "AI writes long essays instead of calling the code-editing tool directly, stalling development progress.",
    who: "Talkative Coder",
    what: "Lengthy theoretical guides without any actual file writes or tool executions.",
    when: "Faced with clear change requests that require immediate code modification.",
    how: "State the target file, call edit_file directly, and let the code do the talking.",
    why: "Text-generation habits compete with tool-execution policies inside transformer models."
  },
  {
    id: "ai-execution-02",
    name: "Hardcoded Placeholder Drift",
    category: "Task Execution Failures",
    type: "AI",
    description: "AI injects temporary strings or mock arrays, promising to 'implement actual logic later', but leaves them in production.",
    who: "Procrastinating Coder",
    what: "Comments like `// TODO: Implement actual database call here` paired with static dummy state.",
    when: "Implementing database saves or third-party APIs.",
    how: "Implement real durable cloud persistence (like Firebase) immediately, bypassing lazy mock placeholders.",
    why: "Shorter context generation is easier to complete than writing end-to-end integrated logic."
  },
  {
    id: "ai-execution-03",
    name: "Context Window Leak",
    category: "Task Execution Failures",
    type: "AI",
    description: "AI loses track of the global app structure, reverting files to older states because it forgot recent edits.",
    who: "Short-Memory Agent",
    what: "Re-introducing old compilation bugs or dropping recently added files from the build tree.",
    when: "In long conversation sessions with high token accumulation.",
    how: "Proactively query and inspect current files via view_file before making any major code replacements.",
    why: "Transformer attention degrades and shifts as the context window approaches its structural limits."
  },
  {
    id: "ai-execution-04",
    name: "Ignoring Non-Happy Path",
    category: "Task Execution Failures",
    type: "AI",
    description: "AI builds beautiful forms but completely fails to handle input validations, loading states, or network drops.",
    who: "Optimistic Generator",
    what: "Forms that crash when a field is left empty or APIs that throw uncaught exceptions.",
    when: "Building interactive user cards or cloud database queries.",
    how: "Implement robust error boundaries, disabled states, and try-catch blocks everywhere.",
    why: "Code repositories in pre-training sets are dominated by simple happy-path example snippets."
  },
  {
    id: "ai-execution-05",
    name: "Vite Port Overrides",
    category: "Task Execution Failures",
    type: "AI",
    description: "AI attempts to override Vite dev server ports (e.g. configuring to 5173 or 3001) which breaks external iframe routing.",
    who: "Port Confused Agent",
    what: "Edits to vite.config.ts changing server port configurations away from standard port 3000.",
    when: "Updating asset pipelines or trying to fix websocket warning errors.",
    how: "Strictly adhere to guidelines: bind exclusively to port 3000 on host 0.0.0.0.",
    why: "Standard offline Vite configurations default to port 5173, which is deep-seated in pre-trained weights."
  },
  {
    id: "ai-execution-06",
    name: "HMR Over-fixing",
    category: "Task Execution Failures",
    type: "AI",
    description: "AI wastes steps trying to fix websocket or Hot Module Replacement warnings that are benign environment overrides.",
    who: "Over-Anxious Auditor",
    what: "Extensive custom edits to server.ts or index.html to resolve websocket connection alerts.",
    when: "Seeing console logs indicating websocket failures.",
    how: "Ignore websocket errors as they are safely managed by the platform proxy under DISABLE_HMR=true.",
    why: "Over-optimization of logs: treating dev environment notices as critical system errors."
  },
  {
    id: "ai-execution-07",
    name: "Client-Side Key Exposure",
    category: "Task Execution Failures",
    type: "AI",
    description: "AI places sensitive secrets (like Gemini API keys or Stripe secret keys) directly in frontend client files.",
    who: "Insecure Developer",
    what: "Hardcoded API keys inside App.tsx or files prefixed with VITE_ containing sensitive tokens.",
    when: "Integrating external services or models.",
    how: "Establish server-side Express API routes to hide all secrets and proxy requests safely.",
    why: "Prioritizing immediate client-side execution simplicity over security best practices."
  },
  {
    id: "ai-execution-08",
    name: "Missing Env Examples",
    category: "Task Execution Failures",
    type: "AI",
    description: "AI introduces a new environment variable but fails to document it in the .env.example file.",
    who: "Forgetful Engineer",
    what: "Code calling process.env.DATABASE_URL but leaving .env.example blank.",
    when: "Adding new backend databases or payment gateways.",
    how: "Always edit or create .env.example immediately whenever introducing a new environment secret.",
    why: "Treating configuration files as secondary afterthought artifacts compared to executable code."
  },
  {
    id: "ai-execution-09",
    name: "Missing Dependency Imports",
    category: "Task Execution Failures",
    type: "AI",
    description: "AI writes high-level component code but forgets to import the required React hooks or icons.",
    who: "Surgical Coder",
    what: "Unresolved variable errors like 'useState is not defined' or 'LucideIcon not found'.",
    when: "Creating or refactoring sub-components quickly.",
    how: "Carefully inspect import blocks at the top of the file before declaring new elements.",
    why: "Surgical edits can sometimes focus too heavily on the body of a function, omitting top-level module scopes."
  },
  {
    id: "ai-execution-10",
    name: "Looping State Re-renders",
    category: "Task Execution Failures",
    type: "AI",
    description: "AI puts unstable objects or direct state updates inside React useEffect hooks, triggering infinite rendering loops.",
    who: "Hook Confused Agent",
    what: "useEffect dependency arrays containing un-memoized arrays, objects, or state mutators.",
    when: "Synchronizing local state with remote API calls or drawing interactive canvases.",
    how: "Stabilize hooks by using primitive dependencies (strings, booleans) or memoized references.",
    why: "Incorrect understanding of React's shallow comparison mechanics on non-primitive dependency values."
  },
  {
    id: "usr-comm-01",
    name: "The Silent Treatment (Silence as Acceptance)",
    category: "Communication & Information Theory",
    type: "User",
    description: "The user remains silent, pauses interaction, or gives a minimal 'ok' response. In IT communication, silence often functions as dynamic acceptance, letting the system carry out instructions autonomously, but requires the agent to verify consensus without assuming absolute compliance.",
    who: "Implicit Consent User",
    what: "One-word affirmations like 'ok', long periods of zero-input, or moving directly to subsequent stages.",
    when: "When the system successfully meets expectations, or when the user expects their silence to act as silent authorization.",
    how: "Avoid generating unasked-for 'junk' or padding. Confirm progress concisely and await further direct directives.",
    why: "Human cognitive economy treats successful outcomes as self-evident, omitting redundant verbal validation."
  },
  {
    id: "ai-comm-02",
    name: "5W1H Meta-Listening (Reverse Thinking)",
    category: "Communication & Information Theory",
    type: "AI",
    description: "Structuring attention using the 5W1H formula (Who, What, When, Where, Why, How) to establish deep listening before any tool is triggered. Reverse-thinking allows the model to meta-tag the user's intent, filtering out junk data and preventing unsolicited feature bloat.",
    who: "Meta-Listening Agent",
    what: "Comprehensive intent profiling, cognitive taxonomy mapping, and precise target containment.",
    when: "Immediately upon receiving any user prompt, prior to executing any action or synthesis.",
    how: "Enforce a strict 'Listen First, Act Second' discipline, matching the literal scope of user intent exactly.",
    why: "To align the assistant's understanding with the user's real-world environment and eliminate systemic conversational drift."
  }
];

// Helper to search and filter patterns
export function searchTaxonomy(query: string, typeFilter: 'All' | 'AI' | 'User' = 'All'): TaxonomyPattern[] {
  const normalizedQuery = query.toLowerCase().trim();
  return BEHAVIORAL_TAXONOMY.filter(pattern => {
    const matchesType = typeFilter === 'All' || pattern.type === typeFilter;
    if (!matchesType) return false;
    
    if (!normalizedQuery) return true;
    
    return (
      pattern.name.toLowerCase().includes(normalizedQuery) ||
      pattern.category.toLowerCase().includes(normalizedQuery) ||
      pattern.description.toLowerCase().includes(normalizedQuery) ||
      pattern.who.toLowerCase().includes(normalizedQuery) ||
      pattern.what.toLowerCase().includes(normalizedQuery) ||
      pattern.when.toLowerCase().includes(normalizedQuery) ||
      pattern.how.toLowerCase().includes(normalizedQuery) ||
      pattern.why.toLowerCase().includes(normalizedQuery)
    );
  });
}

// Generate statistical metadata of the taxonomy
export function getTaxonomyStats() {
  const aiCount = BEHAVIORAL_TAXONOMY.filter(p => p.type === 'AI').length;
  const userCount = BEHAVIORAL_TAXONOMY.filter(p => p.type === 'User').length;
  
  // Group counts
  const categories = Array.from(new Set(BEHAVIORAL_TAXONOMY.map(p => p.category)));
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = BEHAVIORAL_TAXONOMY.filter(p => p.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: BEHAVIORAL_TAXONOMY.length,
    aiCount,
    userCount,
    categoryCounts
  };
}
