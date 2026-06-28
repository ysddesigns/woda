import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { EmptyTab } from '@/features/matches/components/empty-tab';
import type { ScorerEvent } from '@/features/matches/lib/parse-scorers';
import type { Match } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';
import { TabBar } from '@/features/matches/components/tab-bar';

type Tab = 'overview' | 'timeline' | 'stats' | 'lineups';
const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'stats', label: 'Stats' },
  { key: 'lineups', label: 'Lineups' },
];

type GoalEvent = { side: 'home' | 'away'; name: string; minute: number | null };

function combineGoals(match: Match): GoalEvent[] {
  const events: GoalEvent[] = [
    ...match.homeScorers.map((e: ScorerEvent) => ({ side: 'home' as const, name: e.name, minute: e.minute })),
    ...match.awayScorers.map((e: ScorerEvent) => ({ side: 'away' as const, name: e.name, minute: e.minute })),
  ];
  return events.sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999));
}

export function MatchTabs({ match }: { match: Match }) {
  const [tab, setTab] = useState<Tab>('overview');
  const goals = combineGoals(match);

  return (
    <View>
      <TabBar tabs={TABS} value={tab} onChange={setTab} />
      <View style={styles.panel}>
        {tab === 'overview' ? <OverviewPanel match={match} goals={goals} /> : null}
        {tab === 'timeline' ? <TimelinePanel goals={goals} /> : null}
        {tab === 'stats' ? (
          <EmptyTab
            icon="stats-chart-outline"
            title="Stats aren't tracked yet"
            description="Possession, shots, and other match stats aren't available for World Cup 26 matches yet."
          />
        ) : null}
        {tab === 'lineups' ? (
          <EmptyTab
            icon="clipboard-outline"
            title="Lineups aren't available yet"
            description="Starting XI and substitutions will show here once the data source provides them."
          />
        ) : null}
      </View>
    </View>
  );
}

function OverviewPanel({ match, goals }: { match: Match; goals: GoalEvent[] }) {
  const theme = useTheme();

  if (goals.length === 0) {
    return (
      <EmptyTab
        icon="football-outline"
        title="No notable moments yet"
        description="Goals and key moments will appear here as they happen."
      />
    );
  }

  const rows = goals.reduce<(GoalEvent & { home: number; away: number })[]>((acc, g) => {
    const prev = acc[acc.length - 1];
    const home = (prev?.home ?? 0) + (g.side === 'home' ? 1 : 0);
    const away = (prev?.away ?? 0) + (g.side === 'away' ? 1 : 0);
    acc.push({ ...g, home, away });
    return acc;
  }, []);
  const firstHalf = rows.filter((r) => r.minute === null || r.minute <= 45);
  const secondHalf = rows.filter((r) => r.minute !== null && r.minute > 45);

  return (
    <View style={styles.halves}>
      {firstHalf.length > 0 ? <HalfSection title="First Half" rows={firstHalf} /> : null}
      {secondHalf.length > 0 ? <HalfSection title="Second Half" rows={secondHalf} /> : null}
      <Text style={[styles.disclaimer, { color: theme.textHint }]}>
        Based on available scorer data — timing may be approximate.
      </Text>
    </View>
  );
}

function HalfSection({
  title,
  rows,
}: {
  title: string;
  rows: (GoalEvent & { home: number; away: number })[];
}) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{title.toUpperCase()}</Text>
      {rows.map((r, i) => (
        <View key={i} style={styles.goalRow}>
          {r.side === 'home' ? (
            <View style={[styles.goalLeft, styles.goalNameRow]}>
              <Ionicons name="football" size={13} color={theme.textSecondary} />
              <Text style={[styles.goalName, { color: theme.text }]} numberOfLines={1}>
                {r.name}
              </Text>
            </View>
          ) : (
            <View style={styles.goalLeft} />
          )}
          <View style={[styles.scorePill, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.scorePillText, { color: theme.text }]}>
              {r.home} : {r.away}
            </Text>
          </View>
          {r.side === 'away' ? (
            <View style={[styles.goalRight, styles.goalNameRow, styles.goalNameRowReverse]}>
              <Text style={[styles.goalName, { color: theme.text }]} numberOfLines={1}>
                {r.name}
              </Text>
              <Ionicons name="football" size={13} color={theme.textSecondary} />
            </View>
          ) : (
            <View style={styles.goalRight} />
          )}
        </View>
      ))}
    </View>
  );
}

function TimelinePanel({ goals }: { goals: GoalEvent[] }) {
  const theme = useTheme();
  if (goals.length === 0) {
    return (
      <EmptyTab
        icon="time-outline"
        title="Nothing on the timeline yet"
        description="Key moments will be logged here as the match unfolds."
      />
    );
  }

  return (
    <View style={styles.timeline}>
      {goals.map((g, i) => (
        <View key={i} style={styles.timelineRow}>
          <Text style={[styles.timelineMinute, { color: theme.primary }]}>
            {g.minute !== null ? `${g.minute}'` : '—'}
          </Text>
          <View style={[styles.timelineDot, { backgroundColor: theme.primary }]} />
          <Text style={[styles.timelineText, { color: theme.text }]} numberOfLines={1}>
            Goal — {g.name} ({g.side === 'home' ? match_side_label('home') : match_side_label('away')})
          </Text>
        </View>
      ))}
    </View>
  );
}

function match_side_label(side: 'home' | 'away') {
  return side === 'home' ? 'Home' : 'Away';
}

const styles = StyleSheet.create({
  panel: {
    paddingTop: Spacing.lg,
  },
  halves: {
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  goalLeft: {
    flex: 1,
  },
  goalRight: {
    flex: 1,
  },
  goalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  goalNameRowReverse: {
    justifyContent: 'flex-end',
  },
  goalName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    flexShrink: 1,
  },
  scorePill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    minWidth: 56,
    alignItems: 'center',
  },
  scorePillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  disclaimer: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  timeline: {
    gap: Spacing.lg,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  timelineMinute: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    width: 36,
    fontVariant: ['tabular-nums'],
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineText: {
    flex: 1,
    fontSize: FontSize.base,
  },
});
