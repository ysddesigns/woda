import { SegmentedControl } from '@expo/ui/community/segmented-control';
import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { MatchBucket } from '@/features/matches/types';

const ORDER: MatchBucket[] = ['past', 'today', 'upcoming'];
const LABELS = ['Past', 'Today', 'Upcoming'];

export function SegmentedFilter({
  value,
  onChange,
}: {
  value: MatchBucket;
  onChange: (bucket: MatchBucket) => void;
}) {
  const selectedIndex = ORDER.indexOf(value);

  return (
    <View style={styles.container}>
      <SegmentedControl
        values={LABELS}
        selectedIndex={selectedIndex}
        onChange={({ nativeEvent }) => {
          const next = ORDER[nativeEvent.selectedSegmentIndex];
          if (next && next !== value) {
            if (process.env.EXPO_OS === 'ios') {
              Haptics.selectionAsync();
            }
            onChange(next);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
});
