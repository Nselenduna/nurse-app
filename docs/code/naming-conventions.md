# Naming Conventions

This document outlines the naming conventions to be followed throughout the Nurse App codebase. Consistent naming improves readability, maintainability, and collaboration.

## General Principles

1. **Be descriptive**: Names should clearly communicate purpose and intent

2. **Be consistent**: Follow established patterns within the codebase

3. **Be concise**: Avoid unnecessary verbosity while maintaining clarity

4. **Avoid abbreviations**: Use full words unless abbreviations are widely understood

5. **Use domain language**: Align names with nursing and healthcare terminology

## File and Directory Naming

### Directory Structure

- Use **kebab-case** for directory names: `cpd-logs/`, `user-profiles/`

- Group files by feature rather than by type

- Use consistent prefixes for feature directories: `feature-name/`

### File Naming

- Use **PascalCase** for React components: `CpdLogCard.tsx`

- Use **camelCase** for utility files, hooks, and services: `useCpd.ts`, `storageService.ts`

- Use **kebab-case** for configuration files: `jest.config.js`, `tsconfig.json`

- Use descriptive suffixes to indicate file type:

  - `.component.tsx` for components

  - `.hook.ts` for hooks

  - `.service.ts` for services

  - `.test.ts` or `.test.tsx` for test files

  - `.types.ts` for type definitions

  - `.styles.ts` for styled components

## Component Naming

### React Components

- Use **PascalCase** for component names

- Use descriptive, noun-based names: `CpdLogCard`, not `Card`

- Include the component's purpose in the name: `SettingsItem`, not `Item`

- Use consistent prefixes for related components:

  - `<Feature><ComponentType>`: `CpdLogCard`, `CpdStatistics`

  - `<Action><ComponentType>`: `ExportButton`, `ImportDialog`

### Props and Interfaces

- Use **PascalCase** for interface names with `Props` suffix: `CpdLogCardProps`

- Use **camelCase** for prop names: `onPress`, `isLoading`

- Use consistent naming patterns for common props:

  - Event handlers: `on<Event>` (e.g., `onPress`, `onChange`)

  - Boolean flags: `is<State>` or `has<Feature>` (e.g., `isLoading`, `hasError`)

  - Render props: `render<Component>` (e.g., `renderItem`)

## Function Naming

- Use **camelCase** for function names

- Use verb phrases that describe the action: `addLog`, not `logAdder`

- Use consistent prefixes for specific types of functions:

  - Getters: `get<Noun>` (e.g., `getLogs`, `getStatistics`)

  - Setters: `set<Noun>` (e.g., `setLogs`, `setFilter`)

  - Event handlers: `handle<Event>` (e.g., `handlePress`, `handleChange`)

  - Transformers: `transform<Noun>` or `<noun>To<Noun>` (e.g., `transformData`, `logsToJson`)

  - Validators: `validate<Noun>` or `is<Adjective>` (e.g., `validateInput`, `isValidEmail`)

## Variable Naming

- Use **camelCase** for variable names

- Use meaningful, descriptive names: `recentLogs`, not `data`

- Use plural forms for arrays: `logs`, not `log`

- Use consistent prefixes for specific types of variables:

  - Booleans: `is<State>`, `has<Feature>`, or `should<Action>` (e.g., `isLoading`, `hasError`, `shouldRefresh`)

  - Counts: `<noun>Count` (e.g., `logCount`, `errorCount`)

  - Indexes: `<noun>Index` (e.g., `selectedIndex`, `currentIndex`)

  - References: `<noun>Ref` (e.g., `buttonRef`, `inputRef`)

## Constants Naming

- Use **UPPER_SNAKE_CASE** for true constants: `MAX_LOGS`, `API_URL`

- Group related constants in objects with **PascalCase** names:

  ```typescript
  export const APP_COLORS = {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    // ...
  };

  ```


## Type and Interface Naming

- Use **PascalCase** for type and interface names

- Use descriptive, noun-based names: `CpdLog`, not `Log`

- Use consistent suffixes for specific types:

  - Props: `<Component>Props` (e.g., `ButtonProps`, `CardProps`)

  - States: `<Feature>State` (e.g., `AuthState`, `FormState`)

  - Contexts: `<Feature>Context` (e.g., `AuthContext`, `ThemeContext`)

  - Hooks: `<Hook>Return` (e.g., `UseCpdReturn`, `UseAuthReturn`)

## Enum Naming

- Use **PascalCase** for enum names: `LogLevel`, `ErrorCode`

- Use **UPPER_SNAKE_CASE** for enum values: `ERROR`, `WARNING`

- Use singular form for enum names: `ErrorCode`, not `ErrorCodes`

## CSS/Style Naming

- Use **camelCase** for style properties in StyleSheet objects

- Use descriptive, purpose-based names: `containerStyle`, not `style1`

- Use consistent prefixes for specific types of styles:

  - Containers: `<component>Container` (e.g., `cardContainer`, `headerContainer`)

  - Text: `<purpose>Text` (e.g., `titleText`, `subtitleText`)

  - Buttons: `<purpose>Button` (e.g., `submitButton`, `cancelButton`)

## Domain-Specific Naming

- Use standard nursing and healthcare terminology:

  - `CpdLog` for Continuing Professional Development logs

  - `NmcForm` for Nursing and Midwifery Council forms

  - `RevalidationRequirements` for NMC revalidation requirements

## Examples

### Component Example


```typescript
// Good: Descriptive, follows PascalCase for component
export function CpdLogCard({ log, onPress, showActions }: CpdLogCardProps) {
  // Implementation
}

// Bad: Not descriptive, doesn't follow conventions
export function Card({ data, click, actions }: any) {
  // Implementation
}

```


### Function Example


```typescript
// Good: Verb phrase, camelCase, descriptive
function handleExportData() {
  // Implementation
}

// Bad: Not descriptive, doesn't follow conventions
function exp() {
  // Implementation
}

```


### Variable Example


```typescript
// Good: Descriptive, follows camelCase
const recentLogs = logs.slice(0, 5);
const isLoading = true;
const hasError = false;

// Bad: Not descriptive, doesn't follow conventions
const data = logs.slice(0, 5);
const loading = true;
const err = false;

```


## Enforcement

- Use ESLint with naming convention rules

- Conduct code reviews with naming convention checks

- Update this document as new patterns emerge

- Refactor existing code to follow conventions when making changes
