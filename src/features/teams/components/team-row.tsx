import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import type { TeamSummary } from '@/features/teams/types';
import { useTheme } from '@/hooks/use-theme';
import { useFavoritesStore } from '@/store/favorites-store';

export function TeamRow({ team }: { team: TeamSummary }) {
  const theme = useTheme();
  const toggleTeam = useFavoritesStore((s) => s.toggleTeam);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${team.name} team details`}
      onPress={() => router.push({ pathname: '/teams/team/[id]', params: { id: team.id } })}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.card, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      {team.flag ? (
        <Image source={{ uri: team.flag }} style={styles.flag} contentFit="cover" />
      ) : (
        <View style={[styles.flag, { backgroundColor: theme.backgroundElement }]} />
      )}
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {team.name}
      </Text>
      <View style={[styles.groupBadge, { backgroundColor: theme.backgroundElement }]}>
        <Text style={[styles.groupText, { color: theme.textSecondary }]}>{team.group}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={team.isFavorite ? `Unfavorite ${team.name}` : `Favorite ${team.name}`}
        onPress={() => {
          Haptics.selectionAsync();
          toggleTeam(team.id);
        }}
        style={styles.favoriteButton}>
        <Ionicons
          name={team.isFavorite ? 'heart' : 'heart-outline'}
          size={20}
          color={team.isFavorite ? theme.primary : theme.textHint}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
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
    width: 32,
    height: 23,
    borderRadius: 4,
  },
  name: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  groupBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  groupText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
