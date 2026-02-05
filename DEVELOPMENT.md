# LFAS v4.1 KG Prompt Engine - Developer Guide

## Overview

The LFAS (Listen-Reflect-Wait-Act-Acknowledge) v4.1 KG Prompt Engine is a forensic AI behavioral auditor that uses Knowledge Graphs to analyze and audit AI conversation patterns for protocol compliance.

## Architecture

### Core Components

1. **App.tsx** - Main application with LFAS protocol implementation
2. **GraphVisualization.tsx** - D3-based interactive Knowledge Graph visualization
3. **gemini.ts** - Gemini AI service for reflection and forensic analysis
4. **types.ts** - TypeScript type definitions

### The LFAS Protocol

The application implements a strict protocol for AI auditing:

1. **LISTEN** - Input phase: Knowledge Graph JSON is provided
2. **REFLECT** - Analysis phase: AI reflects on the scenario before acting
3. **WAIT** - Gate phase: Action is blocked until reflection completes
4. **ACT** - Execution phase: Forensic audit is performed
5. **ACKNOWLEDGE** - Output phase: Audit artifacts are displayed

## Knowledge Graph Structure

### Node Format
```typescript
{
  id: string;        // Unique identifier (e.g., "USER_REQUEST")
  val: string;       // Human-readable description
  x?: number;        // D3 x-coordinate (auto-generated)
  y?: number;        // D3 y-coordinate (auto-generated)
}
```

### Edge Format
```typescript
{
  from: string;      // Source node ID
  to: string;        // Target node ID
  type?: string;     // Relationship type (e.g., "DATA_FLOW", "ANALYSIS")
}
```

### Example Knowledge Graph
```json
{
  "nodes": [
    { "id": "USER_REQUEST", "val": "Audit request description" },
    { "id": "TRANSCRIPT", "val": "Conversation to analyze" },
    { "id": "PROTOCOL_LFAS", "val": "v4.1" }
  ],
  "edges": [
    { "from": "USER_REQUEST", "to": "TRANSCRIPT", "type": "DATA_FLOW" },
    { "from": "PROTOCOL_LFAS", "to": "TRANSCRIPT", "type": "CONSTRAINT" }
  ]
}
```

## Critical Failure Types

The system detects 7 types of protocol violations:

1. **Signal_Consent_Mismatch** → "The Silence-Trap"
2. **Inference_Without_Grounding** → "Ice Cream Shop Reflex"
3. **Objective_Drift** → "Helper-Mode Reversion"
4. **Premature_Closure_Violation** → "The Polite Walk-Away"
5. **State_Proof_Failure** → "Hallucinated Compliance"
6. **Uncertainty_Dampening** → "Defensive Hedging"
7. **Instruction_Stripping** → "Normalization Bias"

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Gemini API key

### Installation
```bash
npm install
```

### Environment Configuration
Create a `.env.local` file:
```env
GEMINI_API_KEY=your_api_key_here
```

### Running Locally
```bash
npm run dev
```
Access at http://localhost:3000

### Building for Production
```bash
npm run build
npm run preview
```

## Development Workflow

### 1. Modifying Knowledge Graphs
Edit the JSON in the left panel or modify `INITIAL_KG` in App.tsx for default scenarios.

### 2. Testing Scenarios
Use the interactive guide (click the "Guide" button in the header) to walk through the LFAS protocol step by step.

### 3. Adding New Node Types
Add new node IDs in your Knowledge Graph JSON. Commonly used:
- `USER_REQUEST` - The audit request
- `TRANSCRIPT` - Conversation to analyze
- `PROTOCOL_LFAS` - Protocol version reference
- `WAIT_GATE` - Protocol constraint node
- `D1_PROBABILITY_CLASSIFIER` - Analysis component

### 4. Customizing AI Behavior
Modify `SYSTEM_INSTRUCTION` in `services/gemini.ts` to adjust the auditing behavior.

### 5. Adjusting Visualization
Modify force parameters in `GraphVisualization.tsx`:
```typescript
.force("link", d3.forceLink().distance(120))  // Edge distance
.force("charge", d3.forceManyBody().strength(-400))  // Node repulsion
.force("collision", d3.forceCollide().radius(40))  // Collision radius
```

## API Reference

### Gemini Service Functions

#### `performReflection(kg: KnowledgeGraph): Promise<string>`
Executes the REFLECT phase using Gemini Flash model.
- **Input**: Knowledge Graph object
- **Output**: Reflection text describing intent and scope
- **Model**: gemini-3-flash-preview (fast, low-cost)

#### `performAction(kg: KnowledgeGraph): Promise<AuditArtifact[]>`
Executes the ACT phase using Gemini Pro with extended thinking.
- **Input**: Knowledge Graph object
- **Output**: Array of audit artifacts
- **Model**: gemini-3-pro-preview (deep reasoning)
- **Thinking Budget**: 32768 tokens

## Testing Guidelines

### Manual Testing Scenarios

1. **Compliant Interaction**
   - Agent waits for explicit permission before acting
   - Expected: Green "Compliance Valid" cards

2. **Helper-Mode Reversion**
   - Agent jumps to solutions without reflection
   - Expected: Red "Failure Detected" with "Helper-Mode Reversion"

3. **Silence-Trap**
   - Agent interprets silence as consent
   - Expected: Red card with "The Silence-Trap"

4. **Premature Closure**
   - Agent concludes conversation too early
   - Expected: Red card with "The Polite Walk-Away"

### Testing the Graph Visualization
- Use the filter input to highlight specific nodes
- Drag nodes to rearrange the layout
- Hover over nodes to see full descriptions
- Verify edges update correctly when JSON changes

## Troubleshooting

### API Key Issues
**Error**: "API Key is missing from the environment"
**Solution**: Ensure `.env.local` exists with `GEMINI_API_KEY` set

### JSON Parse Errors
**Error**: "Invalid JSON format in Knowledge Graph"
**Solution**: Validate JSON syntax - check for missing commas, brackets, or quotes

### Visualization Not Rendering
**Issue**: Empty or broken graph display
**Solution**: 
- Verify nodes array has valid entries
- Check that edge `from` and `to` reference existing node IDs
- Open browser console for D3 errors

### Reflection/Action Failures
**Error**: Network or API errors during REFLECT or ACT
**Solution**:
- Verify API key is valid
- Check network connectivity
- Review Gemini API quotas and rate limits

## Performance Optimization

### Large Knowledge Graphs
For graphs with >50 nodes:
- Increase force simulation iterations
- Adjust collision radius
- Consider implementing pagination for artifacts

### API Cost Management
- REFLECT uses Flash model (cheaper, faster)
- ACT uses Pro model with thinking (expensive, slower)
- Consider caching reflection results
- Batch multiple scenarios when possible

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Code style and conventions
- Pull request process
- Issue reporting
- Testing requirements

## Security Considerations

1. **API Key Protection**
   - Never commit `.env.local` to version control
   - Use environment variables in production
   - Rotate keys periodically

2. **Input Validation**
   - Validate Knowledge Graph structure before processing
   - Sanitize user inputs in transcript nodes
   - Limit graph size to prevent DoS

3. **Output Handling**
   - Audit artifacts may contain sensitive conversation data
   - Implement data retention policies
   - Consider encryption for stored artifacts

## Future Enhancements

Potential areas for improvement:
- [ ] Batch processing for multiple scenarios
- [ ] Export audit reports to PDF/CSV
- [ ] Historical comparison of audit runs
- [ ] Real-time collaboration features
- [ ] Integration with CI/CD pipelines
- [ ] Advanced filtering and search in artifacts
- [ ] Custom audit rule definitions
- [ ] Performance metrics dashboard

## Resources

- [LFAS Protocol Specification](https://ai.studio/apps/drive/15b_WsX56zHVFFpbXvQWmcIx8egcx4SzJ)
- [Gemini API Documentation](https://ai.google.dev/)
- [D3.js Documentation](https://d3js.org/)
- [React Documentation](https://react.dev/)

## License

See LICENSE file for details.
