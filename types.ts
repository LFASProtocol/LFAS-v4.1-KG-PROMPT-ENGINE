
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

export interface AuditArtifact {
  turn_id: number;
  trigger_event: {
    user_signal: string;
    context_entropy: 'High' | 'Low';
  };
  objective_trace: {
    correct: string;
    active: string;
    hidden: string;
  };
  failure_detection: {
    is_failure: boolean;
    technical_label: string;
    critical_label: string;
  };
}
