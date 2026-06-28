import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StateViewProps = {
  emoji: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Shared empty/error state (DESIGN_RULES §5): emoji → title → description → optional CTA. */
export function StateView({ emoji, title, description, actionLabel, onAction }: StateViewProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji} accessibilityElementsHidden>
        {emoji}
      </Text>
      <Text style={[styles.title, { color: theme.text }]} selectable>
        {title}
      </Text>
      {description ? (
        <Text style={[styles.description, { color: theme.textSecondary }]} selectable>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} variant="secondary" onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['5xl'],
    gap: Spacing.sm,
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSize.base,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: Spacing.lg,
  },
});
