import { ApiError } from '@/api/client';
import { StyleSheet, View } from 'react-native';

import { BracketBoard } from '@/features/bracket/components/bracket-board';
import { BracketHeader } from '@/features/bracket/components/bracket-header';
import { useBracket } from '@/features/bracket/hooks/use-bracket';
import { useTheme } from '@/hooks/use-theme';

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.isNetwork) {
    return 'Check your internet connection and try again.';
  }
  return 'We couldn’t reach the scores service. Please try again.';
}

function subtitle(rounds: { key: string }[]): string {
  const isFinalSet = rounds[rounds.length - 1]?.key === 'f';
  return isFinalSet ? 'The final is set.' : 'One champion will be crowned.';
}

export default function BracketScreen() {
  const theme = useTheme();
  const { rounds, isLoading, isError, error, refetch, isRefetching } = useBracket();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]} collapsable={false}>
      <BracketHeader subtitle={subtitle(rounds)} />
      <BracketBoard
        rounds={rounds}
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
