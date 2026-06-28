import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/button';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FIREBALL = require('../../../../assets/images/fireball.png');

/** Polished "coming soon" modal — used where the API has no backing data (e.g. highlights video). */
export function ComingSoonModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={(e) => e.stopPropagation()}>
          <Image source={FIREBALL} style={styles.image} contentFit="contain" />
          <Text style={[styles.title, { color: theme.text }]}>Highlights coming soon</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            We don&apos;t have video highlights for this match yet — check back after kickoff.
          </Text>
          <Button label="Got It" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['2xl'],
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  image: {
    width: 96,
    height: 96,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSize.base,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
});
