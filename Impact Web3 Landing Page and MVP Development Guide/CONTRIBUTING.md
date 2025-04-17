# Contributing to Impact Web3

Thank you for your interest in contributing to Impact Web3! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by the [Impact Web3 Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@impactweb3.org](mailto:conduct@impactweb3.org).

## How Can I Contribute?

### Reporting Bugs

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/impact-web3/impact-measurement-system/issues).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/impact-web3/impact-measurement-system/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

- **Check if the enhancement has already been suggested** by searching on GitHub under [Issues](https://github.com/impact-web3/impact-measurement-system/issues).
- If it hasn't, [create a new issue](https://github.com/impact-web3/impact-measurement-system/issues/new) with a clear title and description of the suggested enhancement, including as many details as possible.

### Your First Code Contribution

Unsure where to begin contributing to Impact Web3? You can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner issues](https://github.com/impact-web3/impact-measurement-system/labels/beginner) - issues which should only require a few lines of code, and a test or two.
- [Help wanted issues](https://github.com/impact-web3/impact-measurement-system/labels/help%20wanted) - issues which should be a bit more involved than `beginner` issues.

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the [JavaScript](#javascript-styleguide) and [TypeScript](#typescript-styleguide) styleguides
- Include adequate tests
- Document new code based on the [Documentation Styleguide](#documentation-styleguide)
- End all files with a newline

## Development Process

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/impact-measurement-system.git`
3. Add the original repository as upstream: `git remote add upstream https://github.com/impact-web3/impact-measurement-system.git`
4. Install dependencies: `npm install`
5. Create a new branch for your feature: `git checkout -b feature/your-feature-name`

### Development Workflow

1. Make your changes
2. Run tests: `npm test`
3. Run linting: `npm run lint`
4. Commit your changes following the [commit message guidelines](#commit-message-guidelines)
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a pull request

## Pull Request Process

1. Update the README.md or documentation with details of changes to the interface, if applicable.
2. Update the tests to reflect your changes.
3. The PR should work for all supported Node.js versions.
4. Ensure all CI checks pass.
5. Your PR will be reviewed by at least one maintainer.
6. Once approved, your PR will be merged by a maintainer.

## Coding Standards

### JavaScript Styleguide

- Use ES6+ features
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use semicolons
- 2 spaces for indentation
- Prefer `const` over `let`. Never use `var`
- Use template literals instead of string concatenation
- Use destructuring assignment
- Use arrow functions for anonymous functions
- Use async/await for asynchronous operations

### TypeScript Styleguide

- Follow the [TypeScript Deep Dive Style Guide](https://basarat.gitbook.io/typescript/styleguide)
- Use interfaces for object types
- Use explicit types (avoid `any`)
- Use type inference when the type is obvious
- Use readonly properties when applicable
- Use union types instead of enums
- Use optional parameters instead of multiple function signatures

### CSS/SCSS Styleguide

- Follow the [Airbnb CSS/Sass Styleguide](https://github.com/airbnb/css)
- Use SCSS syntax
- Use BEM naming convention
- Use variables for colors, fonts, and other repeated values
- Use mixins for repeated patterns
- Use nesting sparingly (max 3 levels)

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

Examples:
```
feat(api): add endpoint for impact verification
fix(dashboard): correct calculation of impact score
docs(readme): update installation instructions
```

## Documentation Guidelines

- Use Markdown for documentation
- Include code examples when applicable
- Document all public APIs
- Keep documentation up to date with code changes
- Use clear and concise language
- Include diagrams for complex concepts
- Link to external resources when appropriate

### JSDoc Comments

Use JSDoc comments for all functions and classes:

```javascript
/**
 * Calculates the impact score based on provided metrics
 * 
 * @param {Object} metrics - The impact metrics
 * @param {number} metrics.social - Social impact score
 * @param {number} metrics.environmental - Environmental impact score
 * @param {number} metrics.economic - Economic impact score
 * @param {number} metrics.governance - Governance impact score
 * @returns {number} The calculated overall impact score
 */
function calculateImpactScore(metrics) {
  // Implementation
}
```

## Community

### Communication Channels

- [Discord Server](https://discord.gg/impactweb3)
- [Community Forum](https://forum.impactweb3.org)
- [Twitter](https://twitter.com/ImpactWeb3)

### Meetings

- Community Call: Every other Thursday at 4:00 PM UTC
- Developer Meeting: Every Monday at 2:00 PM UTC
- Governance Meeting: First Tuesday of each month at 3:00 PM UTC

## Recognition

Contributors who make significant contributions will be recognized in the following ways:

- Listed in the [CONTRIBUTORS.md](CONTRIBUTORS.md) file
- Mentioned in release notes
- Invited to become a maintainer after consistent contributions

Thank you for contributing to Impact Web3!
