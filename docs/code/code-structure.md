# Code Structure

This document provides an overview of the Nurse Revalidator project structure, explaining the organization of the codebase and architectural decisions.

## Directory Structure


```

nurse-app/
├── app/                     # Expo Router app directory
│   ├── _layout.tsx          # Root layout configuration
│   ├── index.tsx            # Entry point/landing page
│   ├── (auth)/              # Authentication routes
│   └── (tabs)/              # Main app tab navigation
│       ├── _layout.tsx      # Tab configuration
│       ├── index.tsx        # Dashboard tab
│       ├── cpd.tsx          # CPD portfolio tab
│       ├── log.tsx          # Activity logging tab
│       └── settings.tsx     # Settings tab
├── components/              # Reusable UI components
│   ├── LoginSignupPage.tsx  # Authentication component
│   └── NMCLandingPage.tsx   # Landing page component
├── src/
│   ├── components/          # Domain-specific components
│   │   ├── __tests__/       # Component tests
│   │   ├── layouts/         # Layout components
│   │   └── ui/              # UI components
│   ├── constants/           # App constants and configuration
│   │   ├── index.ts         # Main constants export
│   │   ├── strings.ts       # Text constants
│   │   ├── ui.ts            # UI configuration
│   │   └── voice.ts         # Voice-related constants
│   ├── hooks/               # Custom React hooks
│   │   ├── __tests__/       # Hook tests
│   │   └── ...              # Individual hook files
│   ├── services/            # Business logic services
│   │   ├── __tests__/       # Service tests
│   │   └── ...              # Individual service files
│   ├── types/               # TypeScript type definitions
│   │   ├── index.ts         # Main type definitions
│   │   └── ui.ts            # UI-specific type definitions
│   └── utils/               # Utility functions
│       ├── __tests__/       # Utility tests
│       └── ...              # Individual utility files
├── assets/                  # Static assets (images, fonts)
├── docs/                    # Documentation
└── package.json             # Dependencies and scripts

```


## Architectural Overview

### Expo Router Architecture

The app uses Expo Router, which is a file-system based routing library for React Native:

- `app/_layout.tsx`: Root layout defining the main navigation structure

- `app/index.tsx`: Landing/entry page of the application

- `app/(auth)/*`: Authentication screens (login, signup, etc.)

- `app/(tabs)/*`: Main application screens, organized in tabs

### Component Architecture

The app follows a component-based architecture with clear separation of concerns:

- **Screen Components**: Top-level components in the `app/` directory that represent full screens

- **Layout Components**: Components in `src/components/layouts/` that provide consistent screen layouts

- **UI Components**: Reusable UI elements in `src/components/ui/` that can be used across screens

- **Domain Components**: Components specific to business domains in `src/components/`

### State Management

The app uses a combination of React's built-in state management and custom hooks:

- **Local State**: `useState` for component-specific state

- **Context API**: For sharing state between components

- **Custom Hooks**: Encapsulate complex state logic and provide a clean API

  - `useCpdV2`: Manages CPD logs with race condition handling

  - Other hooks handle specific state management needs

### Data Flow

The application follows a unidirectional data flow pattern:

1. **UI Components**: Trigger actions via event handlers

2. **Hooks**: Process actions and interact with services

3. **Services**: Handle data operations and business logic

4. **Storage**: Persist and retrieve data from device storage

5. **State**: Updated state flows back to UI components

### Data Storage

The app uses a local-first approach to data storage:

- **AsyncStorage**: For non-sensitive data

- **SecureStore**: For sensitive data (credentials, tokens)

- **In-Memory Cache**: For performance optimization

### Security

Security is implemented across multiple layers:

- **Secure Storage**: `SecureStorageService` handles encrypted storage

- **Sensitive Data**: `SensitiveDataService` provides API for sensitive operations

- **Data Validation**: Input validation before storage

- **Authentication**: PIN and biometric authentication options

## Design Patterns

### Singleton Pattern

Services are implemented as singletons to ensure a single source of truth:


```typescript
class CpdService {
  private static instance: CpdService;

  static getInstance(): CpdService {
    if (!CpdService.instance) {
      CpdService.instance = new CpdService();
    }
    return CpdService.instance;
  }
}

export default CpdService.getInstance();

```


### Observer Pattern

The CPD service uses an observer pattern to notify subscribers of changes:


```typescript
class CpdService {
  private listeners: Set<(logs: CpdLog[]) => void> = new Set();

  subscribe(listener: (logs: CpdLog[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.logs]);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.logs]));
  }
}

```


### Custom Hook Pattern

Custom hooks encapsulate and reuse stateful logic:


```typescript
export const useCpdV2 = () => {
  const [state, dispatch] = useReducer(cpdReducer, initialState);

  // Hook implementation...

  return {
    logs,
    loading,
    error,
    // Other values and methods...
  };
};

```


### Reducer Pattern

Complex state is managed using the reducer pattern:


```typescript
function cpdReducer(state: CpdState, action: ActionType): CpdState {
  switch (action.type) {
    case 'SET_LOGS':
      return { ...state, logs: action.payload };
    // Other action types...
    default:
      return state;
  }
}

```


## Testing Strategy

The project follows a comprehensive testing strategy:

- **Unit Tests**: Test individual components, hooks, and services

- **Integration Tests**: Test interactions between components

- **End-to-End Tests**: Test complete user flows

### Test Structure


```

__tests__/
├── component.test.tsx       # Component tests
├── hook.test.ts             # Hook tests
├── service.test.ts          # Service tests
└── integration.test.tsx     # Integration tests

```


## Styling Approach

The app uses React Native's StyleSheet API for styling:


```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: UI_CONFIG.fontSize.large,
    fontWeight: UI_CONFIG.fontWeight.bold,
    color: APP_COLORS.white
  }
});

```


Style constants are centralized in `src/constants/ui.ts` for consistency:


```typescript
export const UI_CONFIG = {
  spacing: {
    small: 8,
    medium: 16,
    large: 24
  },
  fontSize: {
    small: 14,
    medium: 16,
    large: 18
  }
};

```


## Best Practices

1. **Component Composition**: Build complex UIs from simple, reusable components

2. **TypeScript**: Use strong typing for props, state, and function parameters

3. **Memoization**: Use React.memo, useMemo, and useCallback for performance

4. **Error Handling**: Implement proper error boundaries and error states

5. **Accessibility**: Support screen readers and keyboard navigation

6. **Testing**: Write tests for critical functionality

7. **Documentation**: Document components, hooks, and services
