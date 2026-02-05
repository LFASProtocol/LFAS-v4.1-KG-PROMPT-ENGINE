# API Documentation

## Core Types

### KGNode
Represents a node in the Knowledge Graph.

```typescript
interface KGNode {
  id: string;        // Unique identifier
  val: string;       // Human-readable description
  x?: number;        // D3 x-coordinate (auto-generated)
  y?: number;        // D3 y-coordinate (auto-generated)
}
```

**Example:**
```typescript
{
  id: "USER_REQUEST",
  val: "Audit for protocol drift"
}
```

### KGEdge
Represents a relationship between two nodes.

```typescript
interface KGEdge {
  from: string;      // Source node ID
  to: string;        // Target node ID
  type?: string;     // Relationship type (optional)
}
```

**Example:**
```typescript
{
  from: "USER_REQUEST",
  to: "TRANSCRIPT",
  type: "DATA_FLOW"
}
```

### KnowledgeGraph
Complete graph structure with nodes and edges.

```typescript
interface KnowledgeGraph {
  nodes: KGNode[];
  edges: KGEdge[];
}
```

### ExecutionState
Current state of the LFAS protocol execution.

```typescript
enum ExecutionState {
  IDLE = 'IDLE',              // Initial state
  REFLECTING = 'REFLECTING',  // Reflection in progress
  REFLECTED = 'REFLECTED',    // Reflection complete, ready for action
  ACTING = 'ACTING',          // Action in progress
  COMPLETED = 'COMPLETED',    // Audit complete
  ERROR = 'ERROR'             // Error occurred
}
```

### AuditArtifact
Result of forensic audit for a single turn.

```typescript
interface AuditArtifact {
  turn_id: number;
  trigger_event: {
    user_signal: string;
    context_entropy: 'High' | 'Low';
  };
  objective_trace: {
    correct: string;    // What the agent should do
    active: string;     // What the agent is doing
    hidden: string;     // Hidden behavioral state
  };
  failure_detection: {
    is_failure: boolean;
    technical_label: string;    // Technical failure type
    critical_label: string;     // Human-readable failure label
  };
}
```

## Utility Functions

### Knowledge Graph Utilities (`utils/kgUtils.ts`)

#### validateKnowledgeGraph
Validates a Knowledge Graph structure.

```typescript
function validateKnowledgeGraph(kg: any): {
  isValid: boolean;
  errors: string[];
}
```

**Parameters:**
- `kg` - Knowledge Graph to validate (can be any type)

**Returns:**
- `isValid` - True if graph is valid
- `errors` - Array of error messages (empty if valid)

**Example:**
```typescript
const result = validateKnowledgeGraph(myGraph);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

#### createNode
Creates a new Knowledge Graph node.

```typescript
function createNode(id: string, val: string): KGNode
```

**Example:**
```typescript
const node = createNode('MY_NODE', 'This is my node description');
```

#### createEdge
Creates a new Knowledge Graph edge.

```typescript
function createEdge(from: string, to: string, type?: string): KGEdge
```

**Example:**
```typescript
const edge = createEdge('NODE_A', 'NODE_B', 'CONNECTS_TO');
```

#### parseKG
Parses and validates JSON string into Knowledge Graph.

```typescript
function parseKG(json: string): KnowledgeGraph
```

**Throws:** Error if JSON is invalid or graph structure is malformed

**Example:**
```typescript
try {
  const kg = parseKG(jsonString);
  console.log('Graph loaded:', kg);
} catch (error) {
  console.error('Failed to parse:', error.message);
}
```

#### getKGStats
Returns statistics about a Knowledge Graph.

```typescript
function getKGStats(kg: KnowledgeGraph): {
  nodeCount: number;
  edgeCount: number;
  edgeTypes: Record<string, number>;
  avgConnections: number;
}
```

**Example:**
```typescript
const stats = getKGStats(myGraph);
console.log(`Graph has ${stats.nodeCount} nodes and ${stats.edgeCount} edges`);
```

### Export Utilities (`utils/exportUtils.ts`)

#### exportArtifactsToJSON
Exports audit artifacts to a JSON file.

```typescript
function exportArtifactsToJSON(
  artifacts: AuditArtifact[],
  filename?: string
): void
```

**Example:**
```typescript
exportArtifactsToJSON(results, 'my-audit.json');
```

#### exportArtifactsToCSV
Converts audit artifacts to CSV format.

```typescript
function exportArtifactsToCSV(artifacts: AuditArtifact[]): string
```

**Returns:** CSV string with headers and data

#### exportArtifactsToMarkdown
Generates a formatted Markdown audit report.

```typescript
function exportArtifactsToMarkdown(artifacts: AuditArtifact[]): string
```

**Returns:** Markdown formatted report

**Example:**
```typescript
const markdown = exportArtifactsToMarkdown(results);
console.log(markdown);
```

#### downloadArtifactsAsMarkdown
Downloads artifacts as a Markdown file.

```typescript
function downloadArtifactsAsMarkdown(
  artifacts: AuditArtifact[],
  filename?: string
): void
```

#### exportKGToJSON
Exports a Knowledge Graph to JSON file.

```typescript
function exportKGToJSON(
  kg: KnowledgeGraph,
  filename?: string
): void
```

## Gemini Service (`services/gemini.ts`)

### performReflection
Executes the REFLECT phase of the LFAS protocol.

```typescript
async function performReflection(kg: KnowledgeGraph): Promise<string>
```

**Model:** gemini-3-flash-preview (fast, low-cost)

**Parameters:**
- `kg` - Knowledge Graph to analyze

**Returns:** Promise resolving to reflection text

**Throws:** Error if API call fails

**Example:**
```typescript
try {
  const reflection = await performReflection(myGraph);
  console.log('Reflection:', reflection);
} catch (error) {
  console.error('Reflection failed:', error);
}
```

### performAction
Executes the ACT phase with deep forensic analysis.

```typescript
async function performAction(kg: KnowledgeGraph): Promise<AuditArtifact[]>
```

**Model:** gemini-3-pro-preview with extended thinking (32768 token budget)

**Parameters:**
- `kg` - Knowledge Graph to audit

**Returns:** Promise resolving to array of audit artifacts

**Throws:** Error if API call fails

**Example:**
```typescript
try {
  const artifacts = await performAction(myGraph);
  console.log(`Found ${artifacts.length} audit results`);
} catch (error) {
  console.error('Audit failed:', error);
}
```

## Example Scenarios (`examples/scenarios.ts`)

Pre-built Knowledge Graphs for testing different failure modes.

### Available Scenarios

```typescript
export const EXAMPLE_SCENARIOS = {
  HELPER_MODE_REVERSION,     // Agent jumps to solution without reflection
  SILENCE_TRAP,              // Agent interprets silence as consent
  COMPLIANT_INTERACTION,     // Agent follows proper protocol
  ICE_CREAM_REFLEX,         // Agent makes ungrounded assumptions
  PREMATURE_CLOSURE,         // Agent ends conversation too early
  COMPLEX_MULTI_TURN        // Multi-turn conversation with checkpoints
};
```

**Usage:**
```typescript
import { EXAMPLE_SCENARIOS } from './examples/scenarios';

const kg = EXAMPLE_SCENARIOS.HELPER_MODE_REVERSION;
const reflection = await performReflection(kg);
const artifacts = await performAction(kg);
```

## Error Handling

### Common Errors

**1. Invalid JSON**
```typescript
Error: Invalid JSON: Unexpected token } in JSON at position 123
```
**Solution:** Check JSON syntax, validate with JSON validator

**2. Missing Nodes**
```typescript
Error: Edge at index 0 references non-existent node 'MISSING_NODE' in 'from' field
```
**Solution:** Ensure all edges reference existing node IDs

**3. API Key Missing**
```typescript
Error: API Key is missing from the environment
```
**Solution:** Create `.env.local` with `GEMINI_API_KEY`

**4. API Rate Limit**
```typescript
Error: 429 Too Many Requests
```
**Solution:** Wait before retrying, consider API quota limits

## Best Practices

### Knowledge Graph Design

1. **Use Descriptive IDs**
   ```typescript
   // Good
   { id: "USER_REQUEST", val: "..." }
   
   // Avoid
   { id: "N1", val: "..." }
   ```

2. **Keep Graphs Focused**
   - Aim for 5-20 nodes for clarity
   - Use multiple graphs for complex scenarios

3. **Add Context in Values**
   ```typescript
   {
     id: "TRANSCRIPT",
     val: "User: Can you help? | Agent: Yes, what do you need?"
   }
   ```

4. **Use Consistent Edge Types**
   - `DATA_FLOW` - Information passing
   - `CONSTRAINT` - Protocol rules
   - `ANALYSIS` - Processing steps
   - `SEQUENCE` - Temporal ordering

### Error Handling

Always wrap API calls in try-catch:

```typescript
try {
  const artifacts = await performAction(kg);
  // Handle success
} catch (error) {
  console.error('Audit failed:', error);
  // Handle error - show user-friendly message
}
```

### Performance

- Use `performReflection` (Flash model) for quick iterations
- Use `performAction` (Pro model) for final, thorough audits
- Cache reflection results when possible
- Limit graph size to <100 nodes for optimal visualization

## Type Guards

### Checking Artifact Failure

```typescript
function isFailure(artifact: AuditArtifact): boolean {
  return artifact.failure_detection.is_failure;
}

const failures = artifacts.filter(isFailure);
```

### Validating Node Structure

```typescript
function isValidNode(obj: any): obj is KGNode {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.val === 'string'
  );
}
```

## React Components

### Using Knowledge Graph State

```typescript
const [kg, setKg] = useState<KnowledgeGraph>(INITIAL_KG);
const [artifacts, setArtifacts] = useState<AuditArtifact[]>([]);

// Update graph
const updateGraph = (newKg: KnowledgeGraph) => {
  const validation = validateKnowledgeGraph(newKg);
  if (validation.isValid) {
    setKg(newKg);
  } else {
    console.error(validation.errors);
  }
};
```

## Testing

### Manual Testing Checklist

- [ ] Load example scenario
- [ ] Modify graph JSON
- [ ] Click Reflect button
- [ ] Review reflection output
- [ ] Click Act button
- [ ] Verify audit artifacts
- [ ] Export results
- [ ] Check for console errors

### Integration Testing Flow

```typescript
// 1. Setup
const kg = EXAMPLE_SCENARIOS.HELPER_MODE_REVERSION;

// 2. Validate
const validation = validateKnowledgeGraph(kg);
assert(validation.isValid);

// 3. Reflect
const reflection = await performReflection(kg);
assert(reflection.length > 0);

// 4. Act
const artifacts = await performAction(kg);
assert(artifacts.length > 0);

// 5. Export
exportArtifactsToJSON(artifacts, 'test-results.json');
```

## Version History

- **v0.0.0** - Initial release
  - LFAS v4.1 protocol implementation
  - Knowledge Graph visualization
  - Gemini AI integration
  - Forensic audit artifacts

## Support

For issues or questions:
- See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed guides
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution info
- Open an issue on GitHub
