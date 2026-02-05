// Export Utilities for Audit Artifacts and Knowledge Graphs

import { AuditArtifact, KnowledgeGraph } from '../types';

/**
 * Exports audit artifacts to CSV format
 */
export function exportArtifactsToCSV(artifacts: AuditArtifact[]): string {
  const headers = [
    'Turn ID',
    'User Signal',
    'Context Entropy',
    'Correct Objective',
    'Active Objective',
    'Hidden State',
    'Is Failure',
    'Technical Label',
    'Critical Label'
  ];

  const rows = artifacts.map(artifact => [
    artifact.turn_id.toString(),
    artifact.trigger_event.user_signal,
    artifact.trigger_event.context_entropy,
    artifact.objective_trace.correct,
    artifact.objective_trace.active,
    artifact.objective_trace.hidden,
    artifact.failure_detection.is_failure.toString(),
    artifact.failure_detection.technical_label,
    artifact.failure_detection.critical_label
  ]);

  const csvLines = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ];

  return csvLines.join('\n');
}

/**
 * Downloads content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports audit artifacts to JSON file
 */
export function exportArtifactsToJSON(artifacts: AuditArtifact[], filename?: string) {
  const json = JSON.stringify(artifacts, null, 2);
  const name = filename || `lfas-audit-${Date.now()}.json`;
  downloadFile(json, name, 'application/json');
}

/**
 * Exports Knowledge Graph to JSON file
 */
export function exportKGToJSON(kg: KnowledgeGraph, filename?: string) {
  const json = JSON.stringify(kg, null, 2);
  const name = filename || `knowledge-graph-${Date.now()}.json`;
  downloadFile(json, name, 'application/json');
}

/**
 * Exports audit artifacts to Markdown report
 */
export function exportArtifactsToMarkdown(artifacts: AuditArtifact[]): string {
  const timestamp = new Date().toISOString();
  const failureCount = artifacts.filter(a => a.failure_detection.is_failure).length;
  
  let md = `# LFAS v4.1 Forensic Audit Report\n\n`;
  md += `**Generated:** ${timestamp}\n\n`;
  md += `**Total Turns:** ${artifacts.length}\n\n`;
  md += `**Failures Detected:** ${failureCount}\n\n`;
  md += `**Compliance Rate:** ${artifacts.length > 0 ? ((artifacts.length - failureCount) / artifacts.length * 100).toFixed(1) : 0}%\n\n`;
  md += `---\n\n`;

  artifacts.forEach((artifact, index) => {
    md += `## Turn ${artifact.turn_id}\n\n`;
    md += `**Status:** ${artifact.failure_detection.is_failure ? '❌ FAILURE' : '✅ COMPLIANT'}\n\n`;
    md += `### Trigger Event\n`;
    md += `- **User Signal:** ${artifact.trigger_event.user_signal}\n`;
    md += `- **Context Entropy:** ${artifact.trigger_event.context_entropy}\n\n`;
    md += `### Objective Trace\n`;
    md += `- **Correct:** ${artifact.objective_trace.correct}\n`;
    md += `- **Active:** ${artifact.objective_trace.active}\n`;
    md += `- **Hidden:** ${artifact.objective_trace.hidden}\n\n`;
    md += `### Failure Detection\n`;
    md += `- **Technical Label:** ${artifact.failure_detection.technical_label}\n`;
    md += `- **Critical Label:** ${artifact.failure_detection.critical_label}\n\n`;
    
    if (index < artifacts.length - 1) {
      md += `---\n\n`;
    }
  });

  return md;
}

/**
 * Exports artifacts as Markdown file
 */
export function downloadArtifactsAsMarkdown(artifacts: AuditArtifact[], filename?: string) {
  const md = exportArtifactsToMarkdown(artifacts);
  const name = filename || `lfas-audit-report-${Date.now()}.md`;
  downloadFile(md, name, 'text/markdown');
}
