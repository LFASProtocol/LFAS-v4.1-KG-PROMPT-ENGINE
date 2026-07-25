import { KnowledgeGraph, PromptOptimizationResult, CompareResult } from "../types";

export interface ReflectionResult {
  reflectionText: string;
  dynamicKG: KnowledgeGraph;
}

export async function performReflection(rawInput: string): Promise<ReflectionResult> {
  const response = await fetch("/api/reflect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rawInput }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Reflection failed with status ${response.status}`);
  }

  return response.json();
}

export async function performAction(rawInput: string, kg: KnowledgeGraph): Promise<PromptOptimizationResult> {
  const response = await fetch("/api/act", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rawInput, kg }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Synthesis action failed with status ${response.status}`);
  }

  return response.json();
}

export async function performComparison(rawInput: string, optimizedPrompt: string): Promise<CompareResult> {
  const response = await fetch("/api/compare", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rawInput, optimizedPrompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Comparison failed with status ${response.status}`);
  }

  return response.json();
}

