# Contributing to LFAS v4.1 KG Prompt Engine

Thank you for your interest in contributing to the LFAS v4.1 KG Prompt Engine! This document provides guidelines and best practices for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- A Gemini API key (for testing AI features)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/LFAS-v4.1-KG-PROMPT-ENGINE.git
   cd LFAS-v4.1-KG-PROMPT-ENGINE
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/LFASProtocol/LFAS-v4.1-KG-PROMPT-ENGINE.git
   ```

### Initial Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `docs/*` - Documentation updates

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in logical, atomic commits
2. Write clear commit messages (see below)
3. Test your changes thoroughly
4. Update documentation as needed

### Commit Message Format

Follow the conventional commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(kg-utils): add validation for circular dependencies

Add utility function to detect circular references in Knowledge Graphs
to prevent infinite loops in graph traversal algorithms.

Closes #123
```

```
fix(visualization): resolve node overlap in dense graphs

Increase collision radius and adjust force simulation parameters
to prevent node overlap when graph has >50 nodes.
```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Provide type annotations for function parameters and return values
- Avoid using `any` type unless absolutely necessary
- Use interfaces for object shapes

```typescript
// Good
interface NodeConfig {
  id: string;
  val: string;
  metadata?: Record<string, unknown>;
}

function createNode(config: NodeConfig): KGNode {
  return { id: config.id, val: config.val };
}

// Avoid
function createNode(config: any) {
  return { id: config.id, val: config.val };
}
```

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract complex logic into custom hooks
- Use TypeScript for props interfaces

```typescript
interface GraphProps {
  kg: KnowledgeGraph;
  onNodeClick?: (nodeId: string) => void;
}

const GraphComponent: React.FC<GraphProps> = ({ kg, onNodeClick }) => {
  // Component implementation
};
```

### Naming Conventions

- **Files**: camelCase for utilities, PascalCase for components
  - `kgUtils.ts`, `GraphVisualization.tsx`
- **Variables**: camelCase
  - `const nodeCount = 10;`
- **Constants**: UPPER_SNAKE_CASE
  - `const MAX_NODES = 100;`
- **Interfaces/Types**: PascalCase
  - `interface KnowledgeGraph { }`
- **Functions**: camelCase, descriptive verb names
  - `validateKnowledgeGraph()`, `createNode()`

### Code Organization

```
src/
├── components/          # React components
│   └── GraphVisualization.tsx
├── services/           # API and external services
│   └── gemini.ts
├── utils/             # Utility functions
│   ├── kgUtils.ts
│   └── exportUtils.ts
├── examples/          # Example data and scenarios
│   └── scenarios.ts
├── types.ts           # TypeScript type definitions
└── App.tsx            # Main application
```

## Testing

### Manual Testing

Before submitting changes:

1. Test with multiple Knowledge Graph scenarios
2. Verify graph visualization works correctly
3. Test REFLECT and ACT phases with different inputs
4. Check error handling with invalid JSON
5. Test on different screen sizes

### Testing Checklist

- [ ] Code runs without errors
- [ ] New features work as expected
- [ ] Existing features still work (no regressions)
- [ ] Error messages are clear and helpful
- [ ] UI is responsive and accessible
- [ ] No console errors or warnings

## Submitting Changes

### Pull Request Process

1. **Update your branch** with latest upstream changes
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request** on GitHub
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changes you made and why
   - Include screenshots for UI changes
   - List any breaking changes

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Related Issues
Closes #123

## Changes Made
- Added X feature
- Fixed Y bug
- Updated Z documentation

## Screenshots (if applicable)
[Add screenshots here]

## Testing
- [ ] Tested locally
- [ ] Verified with example scenarios
- [ ] No console errors
- [ ] Documentation updated

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex sections
- [ ] Updated documentation
- [ ] No breaking changes (or documented if yes)
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, maintainers will merge your PR

## Reporting Issues

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Test with the latest version
- Gather necessary information (error messages, screenshots, etc.)

### Issue Template

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10, macOS 12.0]
- Browser: [e.g., Chrome 96, Firefox 95]
- Node.js version: [e.g., 18.0.0]

## Screenshots
If applicable, add screenshots

## Additional Context
Any other relevant information
```

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

## Development Tips

### Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit

# Format code (if prettier is added)
npx prettier --write .
```

### Debugging

- Use React DevTools for component inspection
- Check browser console for errors
- Use `console.log` strategically (remove before committing)
- Test with different Knowledge Graph structures

### Performance Considerations

- Keep Knowledge Graphs under 100 nodes for optimal visualization
- Minimize re-renders in React components
- Use React.memo for expensive components
- Consider virtualization for large lists

## Areas for Contribution

Looking for where to start? Here are some ideas:

### High Priority
- Add unit tests for utility functions
- Improve error handling and user feedback
- Add keyboard shortcuts for common actions
- Implement undo/redo functionality

### Medium Priority
- Add more example scenarios
- Create interactive tutorial/walkthrough
- Add export to PDF functionality
- Implement batch processing for multiple graphs

### Low Priority
- Add dark/light theme toggle
- Implement graph layout algorithms
- Add animation for state transitions
- Create browser extension version

## Questions?

If you have questions about contributing:

1. Check the [DEVELOPMENT.md](./DEVELOPMENT.md) guide
2. Search existing issues and discussions
3. Open a new discussion or issue
4. Contact maintainers at [appropriate contact method]

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to LFAS v4.1 KG Prompt Engine! 🚀
