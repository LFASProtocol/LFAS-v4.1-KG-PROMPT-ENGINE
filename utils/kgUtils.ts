// Knowledge Graph Utilities
// Provides helper functions for creating, validating, and manipulating Knowledge Graphs

import { KnowledgeGraph, KGNode, KGEdge } from '../types';

/**
 * Validates a Knowledge Graph structure
 */
export function validateKnowledgeGraph(kg: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!kg) {
    errors.push('Knowledge Graph is null or undefined');
    return { isValid: false, errors };
  }

  if (!Array.isArray(kg.nodes)) {
    errors.push('Knowledge Graph must have a nodes array');
  } else {
    kg.nodes.forEach((node: any, index: number) => {
      if (!node.id) errors.push(`Node at index ${index} is missing required 'id' field`);
      if (!node.val) errors.push(`Node at index ${index} is missing required 'val' field`);
      if (typeof node.id !== 'string') errors.push(`Node at index ${index} has non-string 'id'`);
      if (typeof node.val !== 'string') errors.push(`Node at index ${index} has non-string 'val'`);
    });

    const nodeIds = kg.nodes.map((n: any) => n.id).filter((id: any) => id);
    const uniqueIds = new Set(nodeIds);
    if (nodeIds.length !== uniqueIds.size) {
      errors.push('Duplicate node IDs detected');
    }
  }

  if (!Array.isArray(kg.edges)) {
    errors.push('Knowledge Graph must have an edges array');
  } else {
    const validNodeIds = new Set(kg.nodes?.map((n: any) => n.id) || []);
    
    kg.edges.forEach((edge: any, index: number) => {
      if (!edge.from) errors.push(`Edge at index ${index} is missing required 'from' field`);
      if (!edge.to) errors.push(`Edge at index ${index} is missing required 'to' field`);
      if (typeof edge.from !== 'string') errors.push(`Edge at index ${index} has non-string 'from'`);
      if (typeof edge.to !== 'string') errors.push(`Edge at index ${index} has non-string 'to'`);
      
      if (edge.from && !validNodeIds.has(edge.from)) {
        errors.push(`Edge at index ${index} references non-existent node '${edge.from}' in 'from' field`);
      }
      if (edge.to && !validNodeIds.has(edge.to)) {
        errors.push(`Edge at index ${index} references non-existent node '${edge.to}' in 'to' field`);
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}

export function createNode(id: string, val: string): KGNode {
  return { id, val };
}

export function createEdge(from: string, to: string, type?: string): KGEdge {
  const edge: KGEdge = { from, to };
  if (type) edge.type = type;
  return edge;
}

export function createEmptyKG(): KnowledgeGraph {
  return { nodes: [], edges: [] };
}

export function addNode(kg: KnowledgeGraph, node: KGNode): KnowledgeGraph {
  if (kg.nodes.some(n => n.id === node.id)) {
    throw new Error(`Node with ID '${node.id}' already exists`);
  }
  return { nodes: [...kg.nodes, node], edges: [...kg.edges] };
}

export function removeNode(kg: KnowledgeGraph, nodeId: string): KnowledgeGraph {
  return {
    nodes: kg.nodes.filter(n => n.id !== nodeId),
    edges: kg.edges.filter(e => e.from !== nodeId && e.to !== nodeId)
  };
}

export function parseKG(json: string): KnowledgeGraph {
  let parsed: any;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    throw new Error(`Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
  
  const validation = validateKnowledgeGraph(parsed);
  if (!validation.isValid) {
    throw new Error(`Invalid Knowledge Graph:\n${validation.errors.join('\n')}`);
  }
  
  return parsed as KnowledgeGraph;
}

export function getKGStats(kg: KnowledgeGraph) {
  const edgeTypes = new Map<string, number>();
  kg.edges.forEach(edge => {
    const type = edge.type || 'untyped';
    edgeTypes.set(type, (edgeTypes.get(type) || 0) + 1);
  });
  
  return {
    nodeCount: kg.nodes.length,
    edgeCount: kg.edges.length,
    edgeTypes: Object.fromEntries(edgeTypes),
    avgConnections: kg.nodes.length > 0 ? (kg.edges.length * 2) / kg.nodes.length : 0
  };
}
