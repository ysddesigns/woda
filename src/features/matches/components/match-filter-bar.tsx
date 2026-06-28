import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { FilterPickerModal } from '@/features/matches/components/filter-picker-modal';
import type { MatchFilters } from '@/features/matches/lib/group-by-date';
import { useTheme } from '@/hooks/use-theme';

type Picker = 'group' | 'stadium' | null;

export function MatchFilterBar({
  groups,
  stadiums,
  filters,
  onChange,
}: {
  groups: string[];
  stadiums: string[];
  filters: MatchFilters;
  onChange: (filters: MatchFilters) => void;
}) {
  const [openPicker, setOpenPicker] = useState<Picker>(null);

  if (groups.length === 0 && stadiums.length === 0) return null;

  return (
    <View style={styles.row}>
      {groups.length > 0 ? (
        <FilterChip
          label={filters.group ?? 'Group'}
          active={filters.group !== null}
          onPress={() => setOpenPicker('group')}
        />
      ) : null}
      {stadiums.length > 0 ? (
        <FilterChip
          label={filters.stadium ?? 'Stadium'}
          active={filters.stadium !== null}
          onPress={() => setOpenPicker('stadium')}
        />
      ) : null}

      <FilterPickerModal
        visible={openPicker === 'group'}
        title="Filter by Group"
        options={groups}
        value={filters.group}
        onSelect={(group) => onChange({ ...filters, group })}
        onClose={() => setOpenPicker(null)}
      />
      <FilterPickerModal
        visible={openPicker === 'stadium'}
        title="Filter by Stadium"
        options={stadiums}
        value={filters.stadium}
        onSelect={(stadium) => onChange({ ...filters, stadium })}
        onClose={() => setOpenPicker(null)}
      />
    </View>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? theme.primary : theme.backgroundElement,
          borderColor: theme.border,
        },
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.chipLabel, { color: active ? theme.onPrimary : theme.textSecondary }]} numberOfLines={1}>
        {label}
      </Text>
      <Ionicons name="chevron-down" size={14} color={active ? theme.onPrimary : theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 160,
  },
  pressed: {
    opacity: 0.8,
  },
  chipLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    flexShrink: 1,
  },
});
