import { Stack } from 'expo-router/stack';

export default function MatchesStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="game/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
