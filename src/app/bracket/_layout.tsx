import { Stack } from 'expo-router/stack';

export default function BracketStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Bracket' }} />
    </Stack>
  );
}
