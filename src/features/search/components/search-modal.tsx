import Ionicons from '@expo/vector-icons/Ionicons';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { TeamRow } from '@/features/teams/components/team-row';
import { useSearch } from '@/features/search/hooks/use-search';
import type { Match } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';

export function SearchModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { teams, matches } = useSearch(query);

  function handleClose() {
    setQuery('');
    onClose();
  }

  function goToMatch(id: string) {
    handleClose();
    router.push({ pathname: '/game/[id]', params: { id } });
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.header}>
          <View style={[styles.inputWrap, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Search teams or matches"
              placeholderTextColor={theme.textHint}
              style={[styles.input, { color: theme.text }]}
              returnKeyType="search"
            />
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Close search" onPress={handleClose} style={styles.closeButton}>
            <Text style={[styles.closeLabel, { color: theme.primary }]}>Cancel</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {query.trim().length === 0 ? (
            <Text style={[styles.hint, { color: theme.textHint }]}>Search by team name.</Text>
          ) : (
            <>
              {teams.length > 0 ? (
                <Section title="Teams">
                  {teams.map((t) => (
                    <TeamRow key={t.id} team={t} />
                  ))}
                </Section>
              ) : null}

              {matches.length > 0 ? (
                <Section title="Matches">
                  {matches.map((m) => (
                    <SearchMatchRow key={m.id} match={m} onPress={() => goToMatch(m.id)} />
                  ))}
                </Section>
              ) : null}

              {teams.length === 0 && matches.length === 0 ? (
                <Text style={[styles.hint, { color: theme.textHint }]}>No results for “{query}”.</Text>
              ) : null}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{title.toUpperCase()}</Text>
      <View style={styles.sectionRows}>{children}</View>
    </View>
  );
}

function SearchMatchRow({ match, onPress }: { match: Match; onPress: () => void }) {
  const theme = useTheme();
  const kickoff = Number.isNaN(match.kickoff.getTime()) ? '' : format(match.kickoff, 'd MMM, HH:mm');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.matchRow,
        { backgroundColor: theme.card, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <Flag uri={match.home.flag} fifaCode={match.home.fifaCode} />
      <Text style={[styles.matchTeams, { color: theme.text }]} numberOfLines={1}>
        {match.home.name} vs {match.away.name}
      </Text>
      <Flag uri={match.away.flag} fifaCode={match.away.fifaCode} />
      <Text style={[styles.matchDate, { color: theme.textSecondary }]}>{kickoff}</Text>
    </Pressable>
  );
}

function Flag({ uri, fifaCode }: { uri?: string; fifaCode?: string }) {
  const theme = useTheme();
  if (uri) {
    return <Image source={{ uri }} style={styles.flag} contentFit="cover" />;
  }
  return <View style={[styles.flag, { backgroundColor: theme.backgroundElement }]} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: FontSize.base,
  },
  closeButton: {
    paddingHorizontal: Spacing.xs,
  },
  closeLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['2xl'],
    gap: Spacing.xl,
  },
  hint: {
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingTop: Spacing['3xl'],
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
  },
  sectionRows: {
    gap: Spacing.sm,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  flag: {
    width: 22,
    height: 16,
    borderRadius: 2,
  },
  matchTeams: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  matchDate: {
    fontSize: FontSize.xs,
  },
});
