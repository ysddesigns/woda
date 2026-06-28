import { Stack } from 'expo-router/stack';

export default function TeamsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Teams' }} />
    </Stack>
  );
}
