# Development Tools and Scripts

Quick reference for using the development utilities.

## Knowledge Graph Utilities

```typescript
import { validateKnowledgeGraph, createNode } from '../utils/kgUtils';

// Validate a Knowledge Graph
const validation = validateKnowledgeGraph(myKG);
```

## Export Utilities

```typescript
import { exportArtifactsToJSON } from '../utils/exportUtils';

// Export audit results
exportArtifactsToJSON(artifacts, 'my-audit.json');
```

## Example Scenarios

```typescript
import { EXAMPLE_SCENARIOS } from '../examples/scenarios';

const kg = EXAMPLE_SCENARIOS.HELPER_MODE_REVERSION;
```

See [DEVELOPMENT.md](../DEVELOPMENT.md) for full documentation.
