import { Tabs, TabList, TabSlot, TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, FontWeight, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Simple web tab bar mirroring the native Matches + Settings tabs. */
export default function AppTabs() {
  const theme = useTheme();
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <View style={[styles.tabList, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <View style={styles.inner}>
            <TabTrigger name="matches" href="/" asChild>
              <TabButton>Matches</TabButton>
            </TabTrigger>
            <TabTrigger name="settings" href="/settings" asChild>
              <TabButton>Settings</TabButton>
            </TabTrigger>
          </View>
        </View>
      </TabList>
    </Tabs>
  );
}

const TabButton = forwardRef<View, TabTriggerSlotProps>(({ children, isFocused, ...props }, ref) => {
  const theme = useTheme();
  return (
    <Pressable ref={ref} {...props} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text
        style={{
          color: isFocused ? theme.primary : theme.textSecondary,
          fontSize: FontSize.base,
          fontWeight: isFocused ? FontWeight.semibold : FontWeight.medium,
        }}>
        {children}
      </Text>
    </Pressable>
  );
});
TabButton.displayName = 'TabButton';

const styles = StyleSheet.create({
  tabList: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing['2xl'],
    paddingVertical: Spacing.md,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  button: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
});
