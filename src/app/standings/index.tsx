import { ApiError } from '@/api/client';
import { StyleSheet, View } from 'react-native';

import { StandingsList } from '@/features/standings/components/standings-list';
import { useStandings } from '@/features/standings/hooks/use-standings';
import { useTheme } from '@/hooks/use-theme';

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.isNetwork) {
    return 'Check your internet connection and try again.';
  }
  return 'We couldn’t reach the scores service. Please try again.';
}

export default function StandingsScreen() {
  const theme = useTheme();
  const { groups, isLoading, isError, error, refetch, isRefetching } = useStandings();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]} collapsable={false}>
      <StandingsList
        groups={groups}
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage(error)}
        onRetry={refetch}
        refreshing={isRefetching}
        onRefresh={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
