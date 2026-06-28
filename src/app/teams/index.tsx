import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ApiError } from '@/api/client';
import { Spacing } from '@/constants/theme';
import { TwoWayToggle } from '@/components/two-way-toggle';
import { TeamList } from '@/features/teams/components/team-list';
import { useTeams } from '@/features/teams/hooks/use-teams';
import { VenueList } from '@/features/venues/components/venue-list';
import { useVenues } from '@/features/venues/hooks/use-venues';
import { useTheme } from '@/hooks/use-theme';

type Section = 'teams' | 'venues';
const SECTIONS: { key: Section; label: string }[] = [
  { key: 'teams', label: 'Teams' },
  { key: 'venues', label: 'Venues' },
];

function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.isNetwork) {
    return 'Check your internet connection and try again.';
  }
  return 'We couldn’t reach the scores service. Please try again.';
}

export default function TeamsScreen() {
  const theme = useTheme();
  const [section, setSection] = useState<Section>('teams');
  const teamsResult = useTeams();
  const venuesResult = useVenues();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]} collapsable={false}>
      <View style={styles.controls}>
        <TwoWayToggle value={section} options={SECTIONS} onChange={setSection} />
      </View>

      {section === 'teams' ? (
        <TeamList
          teams={teamsResult.teams}
          isLoading={teamsResult.isLoading}
          isError={teamsResult.isError}
          errorMessage={errorMessage(teamsResult.error)}
          onRetry={teamsResult.refetch}
          refreshing={teamsResult.isRefetching}
          onRefresh={teamsResult.refetch}
        />
      ) : (
        <VenueList
          venues={venuesResult.venues}
          isLoading={venuesResult.isLoading}
          isError={venuesResult.isError}
          errorMessage={errorMessage(venuesResult.error)}
          onRetry={venuesResult.refetch}
          refreshing={venuesResult.isRefetching}
          onRefresh={venuesResult.refetch}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  controls: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
});
