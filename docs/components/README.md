# Component Library

This directory contains documentation for the reusable UI components in the application.

## Component Categories

### Layout Components

- **ScreenLayout**: Consistent layout wrapper for all screens, providing:

  - Background gradient

  - Keyboard avoidance

  - Scrolling behavior

  - Loading state

  - Title/subtitle display

### UI Components

- **Button**: Primary action button with various states

- **OutlineButton**: Secondary action button with outline styling

- **IconButton**: Icon-only button for compact UI elements

- **Section**: Content section with title and optional subtitle

- **CardSection**: Section variant with card-like background

- **EmptyState**: Placeholder for empty content areas

- **SettingsItem**: List item for settings screens

### Domain-Specific Components

- **CategorySelector**: Component for selecting CPD categories

- **CpdLogCard**: Card component for displaying CPD log entries

## Usage Examples

### ScreenLayout


```tsx
import { ScreenLayout } from '@/src/components/layouts/ScreenLayout';

export default function MyScreen() {
  return (
    <ScreenLayout
      title="Screen Title"
      subtitle="Optional subtitle"
      loading={isLoading}
      refreshable={true}
      onRefresh={handleRefresh}
    >
      {/* Screen content */}
    </ScreenLayout>
  );
}

```


### Section and Button


```tsx
import { Section } from '@/src/components/ui/Section';
import { Button } from '@/src/components/ui/Button';

function MyComponent() {
  return (
    <Section title="Section Title" subtitle="Optional subtitle">
      <Text>Section content goes here</Text>

      <Button
        label="Press Me"
        onPress={handlePress}
        icon="checkmark-circle"
        loading={isLoading}
        disabled={isDisabled}
      />
    </Section>
  );
}

```


## Component Props

All components use TypeScript interfaces for props:


```tsx
interface ScreenProps {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  refreshable?: boolean;
  onRefresh?: () => void;
  children: ReactNode;
}

```


## Accessibility

All components are designed with accessibility in mind:

- Screen reader support via accessibility props

- Appropriate color contrast

- Properly sized touch targets

- Keyboard navigation support

## Styling

Components use a consistent styling approach:

- StyleSheet API for styling

- UI constants for consistent spacing, sizes, and colors

- Responsive design principles for different screen sizes

- Dark mode compatibility

## Adding New Components

When adding new components:

1. Follow the established naming conventions

2. Use TypeScript for prop types

3. Include proper JSDoc documentation

4. Add accessibility support

5. Write tests for the component

6. Update this documentation
