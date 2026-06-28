import { Stack } from 'expo-router/stack';

export default function MatchesStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Matches' }} />
      <Stack.Screen name="game/[id]" options={{ title: 'Match' }} />
    </Stack>
  );
}
