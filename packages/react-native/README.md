## `@cocso-ui/react-native`

React Native design-system package for Expo-based applications.

### Installation

```bash
pnpm add @cocso-ui/react-native react react-native
```

### Usage

```tsx
import { Box, Button } from '@cocso-ui/react-native';

export function ExampleScreen() {
  return (
    <Box padding="s8" backgroundColor="neutral50">
      <Button label="Continue" onPress={() => {}} />
    </Box>
  );
}
```

### Design Token Source

`@cocso-ui/react-native` consumes generated values derived from `@cocso-ui/css/token.css`.
