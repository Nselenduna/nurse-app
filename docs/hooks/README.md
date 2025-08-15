# React Hooks

This directory contains documentation for custom React hooks used in the application.

## Available Hooks

- [useCpd and useCpdV2](usecpd.md) - Hooks for managing CPD (Continuing Professional Development) data

- useAppState - Hook for tracking application state

- useFileUpload - Hook for managing file uploads

- useForm - Hook for form state management and validation

- useKeyboard - Hook for keyboard event handling

- useNetworkStatus - Hook for monitoring network connectivity

## Best Practices

When using hooks in the application, follow these best practices:

1. **Component Scope**: Only call hooks at the top level of your component functions

2. **Avoid Conditionals**: Don't call hooks inside conditions or loops

3. **Use Custom Hooks**: Extract repetitive hook logic into custom hooks

4. **Memoize Values**: Use useMemo and useCallback to prevent unnecessary recalculations

5. **Cleanup Effects**: Return a cleanup function from useEffect to prevent memory leaks

6. **Stable Dependencies**: Keep effect dependencies stable to prevent unnecessary reruns

## Creating New Hooks

When creating new custom hooks:

1. **Naming**: Start the name with "use" (e.g., `useCustomHook`)

2. **Single Responsibility**: Each hook should have a single, well-defined purpose

3. **Documentation**: Add JSDoc comments explaining parameters, return values, and usage

4. **Testing**: Write tests for the hook's behavior

5. **TypeScript**: Provide proper type definitions for parameters and return values
