
export interface KGNode {
  id: string;
  val: string;
  x?: number;
  y?: number;
}

export interface KGEdge {
  from: string;
  to: string;
  type?: string;
}

export interface KnowledgeGraph {
  nodes: KGNode[];
  edges: KGEdge[];
}

export enum ExecutionState {
  IDLE = 'IDLE',
  REFLECTING = 'REFLECTING',
  REFLECTED = 'REFLECTED',
  ACTING = 'ACTING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface PromptOptimizationResult {
  sentiment: {
    frustration_level: number; // 1-10
    exhaustion_level: number; // 1-10
    emotional_signals: string[];
    dominant_tone: string;
  };
  deconstruction: {
    core_intent: string;
    implicit_constraints: string[];
    technical_context: string;
    missing_parameters: string[];
  };
  optimized_prompt: string;
  json_payload: {
    system_role: string;
    instructions: string[];
    context_variables: Record<string, string>;
    format_specification: string;
  };
  jsonl_record: string; // The single-line JSONL representation
}

export interface CompareMetrics {
  rawTokensEstimated: number;
  optimizedTokensEstimated: number;
  noiseReductionPct: number;
  accuracyBoostPct: number;
  cognitiveOverheadAvoided: string;
  productivityInsight: string;
}

export interface CompareResult {
  rawOutput: string;
  optimizedOutput: string;
  metrics: CompareMetrics;
}

