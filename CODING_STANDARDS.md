# USI React Base - Coding Standards & Patterns

This document outlines the mandatory coding standards and patterns to be followed when using this repository as a base for new projects. These standards ensure consistency, maintainability, and adherence to USI development practices.

## Table of Contents

1. [Project Structure](#project-structure)
2. [TypeScript Standards](#typescript-standards)
3. [React Component Patterns](#react-component-patterns)
4. [Service Layer Patterns](#service-layer-patterns)
5. [State Management](#state-management)
6. [Styling Patterns](#styling-patterns)
7. [Testing Standards](#testing-standards)
8. [Import Organization](#import-organization)
9. [File Naming Conventions](#file-naming-conventions)
10. [Configuration Standards](#configuration-standards)

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
└── styles.ts          # Component-specific styles
```

**Rules:**

- Use PascalCase for component directory names
- Always include an `index.ts` barrel file for clean imports
- Separate types and styles into dedicated files
- Never mix component logic with styles in the same file

## TypeScript Standards

### Required Configuration

- Use strict TypeScript configuration (`strict: true`)
- Enable `noUnusedLocals` and `noUnusedParameters`
- Use `"jsx": "react-jsx"` for React 18+ support
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
- Prefer `interface` for object shapes, `type` for unions and computed types

## React Component Patterns

### Component Structure

```typescript
// ✅ Correct component pattern
import { FC } from 'react';

import { Component } from '@mui/material';

import { componentStyles } from './styles';
import { ComponentProps } from './types';

const ComponentName: FC<ComponentProps> = ({ prop1, prop2, onAction }) => {
  // Component logic here

  return <Component sx={componentStyles}>{/* JSX content */}</Component>;
};

export default ComponentName;
```

### Higher-Order Component Pattern

```typescript
// ✅ Correct: Layout wrapper pattern
const PageComponent = () => {
  const content = (
    // Page-specific content
  );

  return <MainLayout pageContent={content} />;
};

export default PageComponent;
```

**Rules:**

- Use functional components with TypeScript
- Always type component props with interfaces/types
- Use the layout wrapper pattern for pages
- Separate business logic from presentation
- Use React hooks appropriately (useState, useEffect, etc.)

## Service Layer Patterns

### RTK Query API Structure

```typescript
// ✅ Correct: Versioned API pattern
import { createVersionedDotnetBaseApi } from '../createVersionedDotnetBaseApi';

export const api = createVersionedDotnetBaseApi('2.0');

// ✅ Correct: API service pattern
export const addTagTypes = ['Resource', 'Health Check'] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getResource: build.query<GetResourceApiResponse, GetResourceApiArg>({
        query: (queryArg) => ({
          url: `/resource`,
          headers: { 'Api-Version': '2.0' },
          params: { ...queryArg },
        }),
        providesTags: ['Resource'],
      }),
    }),
    overrideExisting: false,
  });

export { injectedRtkApi as resourceApi };
```

### Service Directory Structure

```text
services/
├── core/
│   ├── api.ts
│   ├── coreApi.ts
│   └── openApiConfig.ts
├── resourceV1_0/
│   ├── api.ts
│   └── resourceApi.ts
└── createVersionedResourceApi.ts
```

**Rules:**

- Use RTK Query for all API communication
- Version APIs in separate directories (e.g., `resourceV1_0`, `resourceV2_0`)
- Always include API version headers
- Use proper TypeScript types for API responses and arguments
- Follow the `createVersionedApi` pattern for API versioning
- Use appropriate cache tags for data invalidation

## State Management

### Redux Store Pattern

```typescript
// ✅ Correct: Store configuration
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
  [coreApi.reducerPath]: coreApi.reducer,
  [resourceApi.reducerPath]: resourceApi.reducer,
  // App-specific reducers
  appData: persistReducer(persistConfig, appDataReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(coreApi.middleware)
      .concat(resourceApi.middleware),
});

// ✅ Correct: Typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Rules:**

- Use Redux Toolkit for state management
- Include all RTK Query middleware in store configuration
- Use typed dispatch and selector hooks
- Use Redux Persist for data that needs to survive page refreshes
- Follow the established reducer naming patterns

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

```typescript
// ✅ Correct: Import order
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Typography } from '@mui/material';

import { SomeUtility } from 'third-party-library';

import { ComponentType } from '@/components/Component';
import { useAppSelector } from '@/store/store';

import { componentStyles } from './styles';
import { ComponentProps } from './types';
import { localFunction } from './utilities';
```

**Rules:**

1. React and React-related imports first
2. Material-UI imports second
3. Third-party library imports third
4. Internal imports using `@/` alias fourth
5. Relative imports last
6. Separate import groups with blank lines
7. Sort imports alphabetically within groups

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
- Use lowercase for service version directories (e.g., `dotnetBaseV1_0`)

## Configuration Standards

### Environment Configuration

```typescript
// ✅ Correct: Config pattern
import type { UsiConfig } from '@usi/core-ui';
import { baseConfigs, deepMerge, env, environment } from '@usi/core-ui';

const appConfigs: Record<string, Partial<UsiConfig> & AppSpecificConfig> = {
  [environment.Local]: {
    // Local configuration
  },
  [environment.Dev]: {
    // Development configuration
  },
  // Additional environments...
};

export default deepMerge(baseConfigs, appConfigs)[env] as UsiConfig & AppSpecificConfig;
```

### API Configuration

- Use the `@usi/core-ui` baseApi for creating API instances
- Include proper base URLs and reducer paths
- Use environment-specific configuration for API endpoints

**Rules:**

- Extend USI core configuration patterns
- Use environment-specific settings
- Include proper TypeScript typing for configuration objects
- Never commit sensitive configuration values
- Use the established deepMerge pattern for configuration composition

## Enforcement

These standards are enforced through:

- ESLint configuration (`.eslintrc`)
- TypeScript compiler settings (`tsconfig.json`)
- Prettier formatting rules
- Husky pre-commit hooks
- CI/CD pipeline checks

## Migration Guidelines

When migrating existing projects to follow these standards:

1. **Gradual Migration**: Update components incrementally to follow patterns
2. **Prioritize New Code**: All new code must follow these standards immediately
3. **Update Dependencies**: Ensure `@usi/core-ui` is at the latest version
4. **Refactor Services**: Migrate API services to RTK Query patterns
5. **Update Tests**: Ensure all tests use the TestHarness pattern

## Questions & Support

For questions about these standards or help with implementation:

- Review existing components in this repository for reference implementations
- Consult the `@usi/core-ui` documentation
- Reach out to the USI development team for guidance

---

**Note**: These standards are mandatory for all projects using this repository as a base. Deviations must be documented and approved by the development team.
