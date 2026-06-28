import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StateView } from '@/components/state-view';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useTeamCoach } from '@/features/teams/hooks/use-team-coach';
import { useTeamSquad } from '@/features/teams/hooks/use-team-squad';
import type { SquadPlayer } from '@/features/teams/hooks/use-team-squad';
import { useTeams } from '@/features/teams/hooks/use-teams';
import { useTheme } from '@/hooks/use-theme';
import { isEnabled } from '@/lib/feature-flags';

export default function TeamDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { teams } = useTeams();
  const team = teams.find((t) => t.id === id) ?? null;

  // Called unconditionally (rules of hooks) — both tolerate a null team internally.
  const squadResult = useTeamSquad(team);
  const coachResult = useTeamCoach(team);

  if (!team) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <Header onBack={() => router.back()} title="Team" />
        <StateView icon="people-outline" title="Team not found" description="This team isn't available right now." />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={{ paddingTop: insets.top }}>
        <Header onBack={() => router.back()} title={team.name} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          {team.flag ? (
            <Image source={{ uri: team.flag }} style={styles.flag} contentFit="cover" />
          ) : (
            <View style={[styles.flag, { backgroundColor: theme.backgroundElement }]} />
          )}
          <Text style={[styles.teamName, { color: theme.text }]}>{team.name}</Text>
          <View style={[styles.groupBadge, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.groupText, { color: theme.textSecondary }]}>Group {team.group}</Text>
          </View>
        </View>

        {isEnabled('teamRoster') ? <CoachCard result={coachResult} /> : null}
        {isEnabled('teamRoster') ? <SquadSection result={squadResult} /> : <RosterUnavailable />}
      </ScrollView>
    </View>
  );
}

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.header, { borderBottomColor: theme.border }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={styles.headerButton}>
        <Ionicons name="chevron-back" size={24} color={theme.text} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.headerButton} />
    </View>
  );
}

function CoachCard({ result }: { result: ReturnType<typeof useTeamCoach> }) {
  const theme = useTheme();
  if (result.status !== 'available' || !result.coach) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.cardHeading, { color: theme.textSecondary }]}>COACH</Text>
      <View style={styles.coachRow}>
        {result.coach.photo ? (
          <Image source={{ uri: result.coach.photo }} style={styles.coachPhoto} contentFit="cover" />
        ) : (
          <View style={[styles.coachPhoto, { backgroundColor: theme.backgroundElement }]} />
        )}
        <Text style={[styles.coachName, { color: theme.text }]} numberOfLines={1}>
          {result.coach.name}
        </Text>
      </View>
    </View>
  );
}

function RosterUnavailable() {
  return (
    <StateView
      icon="people-outline"
      title="Roster isn't available yet"
      description="Squad and coach details will show here once the data source provides them."
    />
  );
}

function SquadSection({ result }: { result: ReturnType<typeof useTeamSquad> }) {
  const theme = useTheme();
  if (result.status === 'loading') {
    return <Text style={[styles.hint, { color: theme.textHint }]}>Loading roster…</Text>;
  }
  if (result.status !== 'available') return <RosterUnavailable />;

  const byPosition = groupByPosition(result.players);

  return (
    <View style={styles.squad}>
      {Object.entries(byPosition).map(([position, players]) => (
        <View key={position} style={styles.section}>
          <Text style={[styles.cardHeading, { color: theme.textSecondary }]}>{position.toUpperCase()}</Text>
          {players.map((p) => (
            <PlayerRow key={p.id} player={p} />
          ))}
        </View>
      ))}
    </View>
  );
}

function groupByPosition(players: SquadPlayer[]): Record<string, SquadPlayer[]> {
  const order = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];
  const groups: Record<string, SquadPlayer[]> = {};
  for (const player of players) {
    const key = player.position || 'Other';
    (groups[key] ??= []).push(player);
  }
  const sorted: Record<string, SquadPlayer[]> = {};
  for (const key of [...order, ...Object.keys(groups).filter((k) => !order.includes(k))]) {
    if (groups[key]) sorted[key] = groups[key];
  }
  return sorted;
}

function PlayerRow({ player }: { player: SquadPlayer }) {
  const theme = useTheme();
  return (
    <View style={[styles.playerRow, { borderBottomColor: theme.border }]}>
      {player.photo ? (
        <Image source={{ uri: player.photo }} style={styles.playerPhoto} contentFit="cover" />
      ) : (
        <View style={[styles.playerPhoto, { backgroundColor: theme.backgroundElement }]} />
      )}
      <Text style={[styles.playerName, { color: theme.text }]} numberOfLines={1}>
        {player.name}
      </Text>
      <Text style={[styles.playerNumber, { color: theme.textSecondary }]}>
        {player.number !== null ? `#${player.number}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  identity: { alignItems: 'center', gap: Spacing.sm },
  flag: { width: 72, height: 52, borderRadius: 8 },
  teamName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  groupBadge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  groupText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  cardHeading: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, letterSpacing: 0.6 },
  coachRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  coachPhoto: { width: 44, height: 44, borderRadius: Radius.full },
  coachName: { fontSize: FontSize.base, fontWeight: FontWeight.medium, flex: 1 },
  hint: { fontSize: FontSize.sm, textAlign: 'center', paddingVertical: Spacing.lg },
  squad: { gap: Spacing.lg },
  section: { gap: Spacing.sm },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  playerPhoto: { width: 32, height: 32, borderRadius: Radius.full },
  playerName: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  playerNumber: { fontSize: FontSize.xs, fontVariant: ['tabular-nums'] },
});
