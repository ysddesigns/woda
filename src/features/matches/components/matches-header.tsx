import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const STADIUM_BG = require('../../../../assets/images/stadium.webp');

const HEADER_HEIGHT = 200;

/**
 * Stadium photo fading into the solid page background via stacked rgba overlays
 * (no LinearGradient yet — expo-linear-gradient needs a dev-client rebuild to work).
 */
export function MatchesHeader({ onSearchPress }: { onSearchPress?: () => void }) {
  const theme = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.background }]}>
      <Image source={STADIUM_BG} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.background, opacity: 0.55 }]} />
      <View style={[styles.fadeStep, { backgroundColor: theme.background, opacity: 0.35 }]} />
      <View style={[styles.fadeStep, styles.fadeStep2, { backgroundColor: theme.background, opacity: 0.65 }]} />
      <View style={[styles.fadeStep, styles.fadeStep3, { backgroundColor: theme.background }]} />

      {onSearchPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search teams or matches"
          onPress={onSearchPress}
          style={styles.searchButton}>
          <Ionicons name="search-outline" size={20} color={theme.text} />
        </Pressable>
      ) : null}

      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={[styles.brand, { color: theme.primary }]}>World Cup 2026</Text>
          <Text style={[styles.title, { color: theme.text }]}>Matches</Text>
        </View>
        <Ionicons name="trophy" size={56} color={theme.primary} accessibilityLabel="Trophy" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  searchButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.lg,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  fadeStep: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HEADER_HEIGHT * 0.6,
  },
  fadeStep2: {
    height: HEADER_HEIGHT * 0.4,
  },
  fadeStep3: {
    height: HEADER_HEIGHT * 0.2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  titleBlock: {
    gap: Spacing.xs,
  },
  brand: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
  },
});
