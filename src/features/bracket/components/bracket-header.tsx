import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const STADIUM_BG = require('../../../../assets/images/stadium.png');

const HEADER_HEIGHT = 160;

/**
 * Stadium photo fading into the page background (no LinearGradient — needs a dev-client
 * rebuild to work, see matches-header.tsx). Mirrors the Matches hero for visual consistency.
 */
export function BracketHeader({ subtitle }: { subtitle: string }) {
  const theme = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.background }]}>
      <Image source={STADIUM_BG} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.background, opacity: 0.55 }]} />
      <View style={[styles.fadeStep, { backgroundColor: theme.background, opacity: 0.35 }]} />
      <View style={[styles.fadeStep, styles.fadeStep2, { backgroundColor: theme.background, opacity: 0.65 }]} />
      <View style={[styles.fadeStep, styles.fadeStep3, { backgroundColor: theme.background }]} />

      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={[styles.brand, { color: theme.primary }]}>World Cup 2026</Text>
          <Text style={[styles.title, { color: theme.text }]}>Knockout Stage</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        </View>
        <Ionicons name="trophy" size={48} color={theme.primary} accessibilityLabel="Trophy" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
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
    flex: 1,
    gap: Spacing.xs,
  },
  brand: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
});
