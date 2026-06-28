import Ionicons from '@expo/vector-icons/Ionicons';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { StateView } from '@/components/state-view';
import { BottomTabInset, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { BracketMatchCard } from '@/features/bracket/components/bracket-match-card';
import type { BracketRound } from '@/features/bracket/lib/group-rounds';
import { useTheme } from '@/hooks/use-theme';

type BracketBoardProps = {
  rounds: BracketRound[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  refreshing: boolean;
  onRefresh: () => void;
};

const ROUND_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  r32: 'grid-outline',
  r16: 'git-branch-outline',
  qf: 'flame-outline',
  sf: 'flash-outline',
  f: 'trophy',
};

export function BracketBoard({
  rounds,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  refreshing,
  onRefresh,
}: BracketBoardProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={styles.skeletonWrap}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} style={styles.skeletonColumn}>
            <View style={[styles.skeletonChip, { backgroundColor: theme.backgroundElement }]} />
            {Array.from({ length: 2 }).map((__, j) => (
              <View key={j} style={[styles.skeletonCard, { backgroundColor: theme.backgroundElement }]} />
            ))}
          </View>
        ))}
      </View>
    );
  }

  if (isError) {
    return (
      <StateView
        icon="cloud-offline-outline"
        title="Couldn't load the bracket"
        description={errorMessage}
        actionLabel="Try Again"
        onAction={onRetry}
      />
    );
  }

  if (rounds.length === 0) {
    return (
      <StateView
        icon="trophy-outline"
        title="The bracket isn't set yet"
        description="The knockout stage will appear here once group play decides the matchups."
      />
    );
  }

  return (
    <ScrollView
      style={styles.verticalScroll}
      contentContainerStyle={styles.verticalContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.textSecondary} />
      }>
      <ScrollView horizontal contentContainerStyle={styles.content} showsHorizontalScrollIndicator={false}>
        {rounds.map((round) => {
          const isFinal = round.key === 'f';
          return (
            <View key={round.key} style={styles.column}>
              <View
                style={[
                  styles.chip,
                  { backgroundColor: isFinal ? theme.primary + '1F' : theme.backgroundElement },
                ]}>
                <Ionicons
                  name={ROUND_ICONS[round.key] ?? 'ellipse-outline'}
                  size={13}
                  color={isFinal ? theme.primary : theme.textSecondary}
                />
                <Text style={[styles.columnTitle, { color: isFinal ? theme.primary : theme.textSecondary }]}>
                  {round.label.toUpperCase()}
                </Text>
              </View>
              <View style={styles.cards}>
                {round.matches.map((match, index) => (
                  <BracketMatchCard key={match.id} match={match} index={index} isFinal={isFinal} />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  skeletonWrap: {
    flexDirection: 'row',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: BottomTabInset + Spacing.lg,
  },
  skeletonColumn: {
    gap: Spacing.md,
  },
  skeletonChip: {
    width: 100,
    height: 24,
    borderRadius: Radius.full,
  },
  skeletonCard: {
    width: 224,
    height: 116,
    borderRadius: Radius.lg,
  },
  verticalScroll: {
    flex: 1,
  },
  verticalContent: {
    paddingBottom: BottomTabInset + Spacing.lg,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.xl,
  },
  column: {
    gap: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  columnTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.6,
  },
  cards: {
    gap: Spacing.md,
  },
});
