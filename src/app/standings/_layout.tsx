import { Stack } from 'expo-router/stack';

export default function StandingsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Standings' }} />
    </Stack>
  );
}
