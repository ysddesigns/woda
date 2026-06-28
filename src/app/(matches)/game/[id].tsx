import Ionicons from '@expo/vector-icons/Ionicons';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StateView } from '@/components/state-view';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { ComingSoonModal } from '@/features/matches/components/coming-soon-modal';
import { MatchTabs } from '@/features/matches/components/match-tabs';
import { StatusBadge } from '@/features/matches/components/status-badge';
import { useMatches } from '@/features/matches/hooks/use-matches';
import type { Match, MatchTeam } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';
import { isEnabled } from '@/lib/feature-flags';

const TROPHY = require('../../../../assets/images/worldcup.png');
const STADIUM = require('../../../../assets/images/stadium.png');
const FIREBALL = require('../../../../assets/images/fireball.png');
const HERO_HEIGHT = 220;

export default function GameDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { allById } = useMatches();
  const match = id ? allById.get(id) : undefined;
  const [highlightsVisible, setHighlightsVisible] = useState(false);

  if (!match) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <Header onBack={() => router.back()} />
        <StateView icon="search-outline" title="Match not found" description="This match isn’t available right now." />
      </View>
    );
  }

  const kickoff = Number.isNaN(match.kickoff.getTime())
    ? null
    : format(match.kickoff, 'EEE d MMM yyyy · HH:mm');
  const isFinished = match.status === 'finished';
  const winnerSide =
    isFinished && match.homeScore !== null && match.awayScore !== null
      ? match.homeScore > match.awayScore
        ? 'home'
        : match.awayScore > match.homeScore
          ? 'away'
          : null
      : null;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar style="light" />
      <View style={[styles.hero, { height: HERO_HEIGHT + insets.top }]}>
        <Image source={STADIUM} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityLabel="" />
        <LinearGradient
          colors={['rgba(7,11,20,0.55)', 'rgba(7,11,20,0.35)', theme.background]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={{ paddingTop: insets.top }}>
          <Header
            onBack={() => router.back()}
            onShare={isEnabled('shareMatch') ? () => Share.share({ message: shareMessage(match) }) : undefined}
            light
          />
        </View>
        <View style={styles.heroContent}>
          <Image source={TROPHY} style={styles.trophy} contentFit="contain" accessibilityLabel="" />
          <Text style={styles.brand}>FIFA World Cup 26™</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.scoreboard,
            { backgroundColor: theme.card, borderColor: theme.border, marginTop: -Spacing['3xl'] },
          ]}>
          <View style={styles.statusRow}>
            <StatusBadge match={match} />
          </View>
          {isFinished ? <Text style={[styles.fullTime, { color: theme.textHint }]}>FULL TIME</Text> : null}

          <View style={styles.scoreRow}>
            <TeamColumn team={match.home} highlighted={winnerSide === 'home'} />
            <View style={styles.scoreCenter}>
              {match.status === 'upcoming' ? (
                <Text style={[styles.vs, { color: theme.textSecondary }]}>vs</Text>
              ) : (
                <Text style={[styles.score, { color: theme.text }]} selectable>
                  {match.homeScore ?? '–'} : {match.awayScore ?? '–'}
                </Text>
              )}
            </View>
            <TeamColumn team={match.away} highlighted={winnerSide === 'away'} />
          </View>
        </View>

        <View style={styles.meta}>
          {kickoff ? <MetaRow icon="calendar-outline" label="Kickoff" value={kickoff} /> : null}
          {match.venue ? (
            <MetaRow icon="location-outline" label="Venue" value={`${match.venue.name}, ${match.venue.city}`} />
          ) : null}
          <MetaRow icon="trophy-outline" label="Stage" value={`Group ${match.group}`} />
          {match.venue?.capacity ? (
            <MetaRow icon="people-outline" label="Capacity" value={match.venue.capacity.toLocaleString()} />
          ) : null}
        </View>

        <MatchTabs match={match} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Match highlights, coming soon"
          onPress={() => setHighlightsVisible(true)}
          style={({ pressed }) => [styles.highlights, pressed && styles.pressed]}>
          <Image source={STADIUM} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityLabel="" />
          <LinearGradient
            colors={['rgba(7,11,20,0.78)', 'rgba(7,11,20,0.6)']}
            style={StyleSheet.absoluteFill}
          />
          <Image
            source={FIREBALL}
            style={styles.highlightsBall}
            contentFit="contain"
            accessibilityLabel=""
          />
          <View style={[styles.playIcon, { backgroundColor: theme.primary }]}>
            <Ionicons name="play" size={18} color={theme.onPrimary} />
          </View>
          <View style={styles.highlightsText}>
            <Text style={styles.highlightsTitle}>Match Highlights</Text>
            <Text style={styles.highlightsSubtitle}>Watch key moments</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </Pressable>
      </ScrollView>

      <ComingSoonModal visible={highlightsVisible} onClose={() => setHighlightsVisible(false)} />
    </View>
  );
}

function Header({
  onBack,
  onShare,
  light,
}: {
  onBack: () => void;
  onShare?: () => void;
  light?: boolean;
}) {
  const theme = useTheme();
  const color = light ? '#FFFFFF' : theme.text;
  return (
    <View style={[styles.header, !light && { borderBottomColor: theme.border }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={styles.headerButton}>
        <Ionicons name="chevron-back" size={24} color={color} />
      </Pressable>
      <Text style={[styles.headerTitle, { color }]}>Match Details</Text>
      {onShare ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Share match" onPress={onShare} style={styles.headerButton}>
          <Ionicons name="share-outline" size={22} color={color} />
        </Pressable>
      ) : (
        <View style={styles.headerButton} />
      )}
    </View>
  );
}

function shareMessage(match: Match): string {
  const teams = `${match.home.name} vs ${match.away.name}`;
  if (match.status === 'upcoming') {
    const kickoff = Number.isNaN(match.kickoff.getTime())
      ? ''
      : ` — kicks off ${format(match.kickoff, 'EEE d MMM, HH:mm')}`;
    return `${teams}${kickoff}\nvia Woda`;
  }
  const score = `${match.homeScore ?? '–'} : ${match.awayScore ?? '–'}`;
  const status = match.status === 'finished' ? 'FT' : 'LIVE';
  return `${teams}\n${score} (${status})\nvia Woda`;
}

function TeamColumn({ team, highlighted }: { team: MatchTeam; highlighted: boolean }) {
  const theme = useTheme();
  return (
    <View style={styles.teamCol}>
      {team.flag ? (
        <Image source={{ uri: team.flag }} style={styles.flag} contentFit="cover" transition={150} />
      ) : (
        <View style={[styles.flag, styles.flagFallback, { backgroundColor: theme.backgroundElement }]}>
          <Text style={{ color: theme.textSecondary, fontWeight: FontWeight.bold }}>{team.fifaCode ?? '?'}</Text>
        </View>
      )}
      <View style={styles.teamNameRow}>
        <Text style={[styles.teamName, { color: theme.text }]} numberOfLines={2}>
          {team.name}
        </Text>
        {highlighted ? <Ionicons name="star" size={14} color={theme.primary} /> : null}
      </View>
    </View>
  );
}

function MetaRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.metaRow, { borderBottomColor: theme.border }]}>
      <View style={styles.metaLabelGroup}>
        <Ionicons name={icon} size={16} color={theme.textSecondary} />
        <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[styles.metaValue, { color: theme.text }]} selectable>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  hero: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  heroContent: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingBottom: Spacing.lg,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    alignItems: 'center',
  },
  trophy: {
    width: 40,
    height: 46,
  },
  brand: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  scoreboard: {
    width: '100%',
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  statusRow: {
    alignItems: 'center',
  },
  fullTime: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    gap: Spacing.md,
    paddingTop: Spacing.sm,
  },
  teamCol: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  flag: {
    width: 56,
    height: 40,
    borderRadius: 6,
    borderCurve: 'continuous',
  },
  flagFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  teamName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  scoreCenter: {
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.sm,
  },
  score: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  vs: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  meta: {
    width: '100%',
    gap: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.lg,
  },
  metaLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaLabel: {
    fontSize: FontSize.base,
  },
  metaValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    flexShrink: 1,
    textAlign: 'right',
  },
  highlights: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    borderCurve: 'continuous',
    overflow: 'hidden',
    padding: Spacing.lg,
    marginBottom: Platform.select({ ios: Spacing.lg, default: Spacing['2xl'] }),
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  highlightsBall: {
    position: 'absolute',
    right: -16,
    bottom: -20,
    width: 96,
    height: 96,
    opacity: 0.9,
  },
  playIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightsText: {
    flex: 1,
    gap: 2,
  },
  highlightsTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: '#FFFFFF',
  },
  highlightsSubtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.75)',
  },
});
