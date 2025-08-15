import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="(tabs)" 
        options={{
          headerShown: false,
          animation: 'fade',
        }} 
      />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
