---
applyTo: '**'
---

# Organization overview

USI has served over 500,000 clients meeting their property & casualty, employee benefit, personal risk and retirement needs nationwide. We have more than 150 years of consulting and brokerage experience through our acquired agencies, with local offices dating back in their communities as far as the late 1800s.

# Coding Standards

This document outlines the mandatory coding standards and patterns to be followed when using this repository as a base for new projects. These standards ensure consistency, maintainability, and adherence to USI development practices.

## Project Structure

### Mandatory Directory Structure

```text
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts
├── layout/             # Layout components
├── pages/              # Page components
├── routes/             # Routing configuration
├── services/           # API services (RTK Query)
├── store/              # Redux store configuration
├── utilities/          # Utility functions and constants
├── mocks/              # Mock data and MSW handlers
└── _test/              # Test utilities and harnesses
```

### Component Directory Structure

Each component must follow this structure:

```text
ComponentName/
├── index.ts            # Export barrel file
├── ComponentName.tsx   # Main component file
├── types.ts           # Component-specific types
├── styles.ts          # Component-specific styles
└── logic.ts          # Component-specific logic (if needed) # check felipe's branch for an example
```

**Rules:**

- Use PascalCase for component directory names
- Always include an `index.ts` barrel file for clean imports
- Separate types and styles into dedicated files
- Never mix component logic with styles in the same file
- todo: go in to details on how/when to use logic.ts
- When creating child components that are ONLY used by the parent component, place it in a new directory under the parent component directory, e.g., `ComponentName/ChildComponent/ChildComponent.tsx`.

## TypeScript Standards

### Required Configuration

- refer to the `tsconfig.json` file in this repository for the complete configuration
- Always use TypeScript for new code (no JavaScript files)

### Type Definitions

```typescript
// ✅ Correct: Export types from dedicated files
export type ComponentProps = {
  title: string;
  isVisible?: boolean;
  onAction: (data: string) => void;
};

// ✅ Correct: Use Record for key-value objects
export type ApiVersions = Record<string, ApiResponse>;

// ❌ Incorrect: Using any type
const data: any = fetchData();

// ✅ Correct: Use proper typing
const data: ApiResponse = fetchData();
```

**Rules:**

- Never use `any` type (ESLint warning enforced)
- Use proper type definitions for all props, state, and API responses
- Export types from dedicated `types.ts` files
- Use `Record<K, V>` for key-value object types

## React Component Patterns

### Component Structure

```typescript
// ✅ Correct component pattern
import { Component } from '@mui/material';

import { componentStyles } from './styles';
import { ComponentProps } from './types';

const ComponentName = ({ prop1, prop2, onAction }: ComponentProps) => {
  // Component logic here

  return <Component sx={componentStyles}>{/* JSX content */}</Component>;
};

export default ComponentName;
```

### Higher-Order Component Pattern

```typescript
// ✅ Correct: Layout wrapper pattern
const PageComponent = () => {
  return (
    // Page-specific content
  );
};

const Page = () => <MainLayout pageContent={<PageComponent />}></MainLayout>;
export default Page;
```

**Rules:**

- Use functional components with TypeScript
- Always type component props with types
- Use the layout wrapper pattern for pages
- Separate business logic from presentation
- Use React hooks appropriately (useState, useEffect, etc.)

## Service Layer Patterns

**Rules:**

- API services must be created using RTK Query code generation
- Use RTK Query for all API communication
- You can create enhanced versions of API files inside of `src/services/**`
- Never edit any file inside of `src/services/**` OTHER than ones with the `enhanced` prefix

## State Management

### Redux Store Pattern

**Rules:**

- Use Redux Toolkit for state management
- Include all RTK Query middleware in store configuration
- Use typed dispatch and selector hooks
- Use Redux Persist for data that needs to survive page refreshes
- Follow the established reducer naming patterns
- The preferred pattern is to use a single store for the entire application, but under some circumstances (e.g., a shared component library), it is allowable to include a separate slice.ts file within that component's folder.

## Styling Patterns

### Material-UI Styling

```typescript
// ✅ Correct: Separate styles file
export const componentContainer = {
  maxWidth: '1200px',
  mx: 'auto',
  my: 2,
};

export const titleStyle = {
  mb: 2,
  fontWeight: 'bold',
};

// ✅ Correct: Component usage
<Box sx={componentContainer}>
  <Typography variant="h1" sx={titleStyle}>
    Title
  </Typography>
</Box>;
```

### Theme Usage

```typescript
// ✅ Correct: Extend core theme
import { createTheme } from '@mui/material/styles';

import { coreTheme } from '@usi/core-ui';

const theme = createTheme({
  ...coreTheme,
  components: {
    ...coreTheme.components,
    // Custom component overrides
  },
});
```

**Rules:**

- Use Material-UI's `sx` prop for component styling
- Define styles in separate `styles.ts` files
- Extend the USI core theme, don't replace it
- Use theme breakpoints for responsive design
- Prefer theme spacing units over hardcoded values

## Testing Standards

### Test Structure

```typescript
// ✅ Correct: Test pattern
import { render } from '@testing-library/react';

import { TestHarness } from '@/_test/TestHarness';

import ComponentName from './ComponentName';

const renderComponent = (props: Partial<ComponentProps> = {}) =>
  render(
    <TestHarness>
      <ComponentName {...defaultProps} {...props} />
    </TestHarness>,
  ).container;

describe('<ComponentName />', () => {
  test('should render with required props', () => {
    renderComponent({ title: 'Test Title' });

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

### Test Configuration

- Use the provided `TestHarness` component for consistent test setup
- Mock MSW handlers in `src/mocks/endpoints.ts`
- Follow the established coverage exclusion patterns
- Use descriptive test names

**Rules:**

- All components must have associated tests
- Use React Testing Library for component testing
- Use the TestHarness wrapper for consistent test environment
- Mock external dependencies appropriately
- Maintain high test coverage for business logic

## Import Organization

### ESLint Import Order

- Do not worry about this because it is already enforce by ESLint and Prettier

## File Naming Conventions

### Naming Standards

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Pages**: PascalCase (e.g., `Home.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useUserData.ts`)
- **Utilities**: camelCase (e.g., `formatter.ts`)
- **Constants**: camelCase file, UPPER_CASE exports (e.g., `constants.ts`)
- **Types**: camelCase file, PascalCase exports (e.g., `types.ts`)
- **API Services**: camelCase with 'Api' suffix (e.g., `userApi.ts`)

### Directory Naming

- Use PascalCase for component directories
- Use camelCase for utility directories

## Enforcement

These standards are enforced through:

- ESLint configuration (`.eslintrc`)
- TypeScript compiler settings (`tsconfig.json`)
- Prettier formatting rules
- Husky pre-commit hooks

## Migration Guidelines

When migrating existing projects to follow these standards:

1. **Gradual Migration**: Update components incrementally to follow patterns
2. **Prioritize New Code**: All new code must follow these standards immediately
