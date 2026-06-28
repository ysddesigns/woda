import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StateView } from '@/components/state-view';
import { FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { useMatches } from '@/features/matches/hooks/use-matches';
import { findStadiumEnrichment } from '@/features/venues/data/stadium-enrichment';
import { distanceKm } from '@/features/venues/lib/distance';
import { useVenueWeather } from '@/features/venues/hooks/use-venue-weather';
import { useVenues } from '@/features/venues/hooks/use-venues';
import { useTheme } from '@/hooks/use-theme';
import { isEnabled } from '@/lib/feature-flags';

// react-native-maps is bundled as a regular JS import; only actually rendering <MapView>
// requires the native module to be linked in this binary build — gated by the `venueMap`
// feature flag below, never on screen load.

export default function VenueDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { venues } = useVenues();
  const { matches } = useMatches();
  const venue = venues.find((v) => v.id === id);
  const [distanceKmValue, setDistanceKmValue] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'denied'>('idle');

  const enrichment = venue ? findStadiumEnrichment(venue) : null;
  const nextMatch = venue
    ? matches
        .filter((m) => m.venue?.name === venue.name && m.status === 'upcoming')
        .sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime())[0]
    : undefined;
  // Called unconditionally (rules of hooks) — handles null enrichment/kickoff internally.
  const weather = useVenueWeather(enrichment, nextMatch?.kickoff ?? null);

  if (!venue) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <Header onBack={() => router.back()} title="Venue" />
        <StateView icon="location-outline" title="Venue not found" description="This venue isn't available right now." />
      </View>
    );
  }

  async function showMyDistance() {
    if (!enrichment) return;
    setLocationStatus('requesting');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationStatus('denied');
      return;
    }
    const position = await Location.getCurrentPositionAsync({});
    setDistanceKmValue(
      distanceKm({ lat: position.coords.latitude, lng: position.coords.longitude }, { lat: enrichment.lat, lng: enrichment.lng }),
    );
    setLocationStatus('idle');
  }

  function openInMaps() {
    if (!enrichment || !venue) return;
    const label = encodeURIComponent(venue.name);
    const url = Platform.select({
      ios: `maps://?daddr=${enrichment.lat},${enrichment.lng}&q=${label}`,
      default: `geo:${enrichment.lat},${enrichment.lng}?q=${enrichment.lat},${enrichment.lng}(${label})`,
    });
    if (url) Linking.openURL(url).catch(() => {});
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={{ paddingTop: insets.top }}>
        <Header onBack={() => router.back()} title={venue.name} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {enrichment ? <ImagePlaceholder hostCity={enrichment.hostCity} /> : null}

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MetaRow icon="location-outline" label="City" value={`${venue.city}, ${venue.country}`} />
          <MetaRow icon="people-outline" label="Capacity" value={venue.capacity.toLocaleString()} />
          <MetaRow icon="flag-outline" label="Region" value={venue.region} />
          {enrichment ? <MetaRow icon="time-outline" label="Local time zone" value={enrichment.timezone} /> : null}
        </View>

        {isEnabled('venueWeather') ? <WeatherCard weather={weather} hasUpcomingMatch={Boolean(nextMatch)} /> : null}

        {isEnabled('venueMap') && enrichment ? (
          <View style={[styles.mapWrap, { borderColor: theme.border }]}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: enrichment.lat,
                longitude: enrichment.lng,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}>
              <Marker coordinate={{ latitude: enrichment.lat, longitude: enrichment.lng }} title={venue.name} />
            </MapView>
          </View>
        ) : null}

        <View style={styles.actions}>
          <ActionButton icon="navigate-outline" label="Open in Maps" onPress={openInMaps} disabled={!enrichment} />
          <ActionButton
            icon="locate-outline"
            label={
              locationStatus === 'requesting'
                ? 'Locating…'
                : distanceKmValue !== null
                  ? `${distanceKmValue.toFixed(0)} km away`
                  : 'Show my distance'
            }
            onPress={showMyDistance}
            disabled={!enrichment || locationStatus === 'requesting'}
          />
        </View>
        {locationStatus === 'denied' ? (
          <Text style={[styles.hint, { color: theme.textHint }]}>
            Location permission was denied — enable it in Settings to see your distance.
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.header, { borderBottomColor: theme.border }]}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={styles.headerButton}>
        <Ionicons name="chevron-back" size={24} color={theme.text} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.headerButton} />
    </View>
  );
}

function ImagePlaceholder({ hostCity }: { hostCity: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.imagePlaceholder, { backgroundColor: theme.backgroundElement }]}>
      <Ionicons name="image-outline" size={28} color={theme.textHint} />
      <Text style={[styles.imagePlaceholderText, { color: theme.textHint }]}>{hostCity}</Text>
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
      <Text style={[styles.metaValue, { color: theme.text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function WeatherCard({
  weather,
  hasUpcomingMatch,
}: {
  weather: ReturnType<typeof useVenueWeather>;
  hasUpcomingMatch: boolean;
}) {
  const theme = useTheme();
  const copy: Record<typeof weather.status, string> = {
    unconfigured: 'Weather data isn’t configured yet.',
    'no-upcoming-match': hasUpcomingMatch ? 'Loading…' : 'No upcoming match scheduled here.',
    'out-of-range': 'Forecast available closer to match day.',
    loading: 'Loading forecast…',
    error: 'Couldn’t load the forecast.',
    available: '',
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.metaLabelGroup}>
        <Ionicons name="partly-sunny-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>Match-day forecast</Text>
      </View>
      {weather.status === 'available' ? (
        <Text style={[styles.weatherValue, { color: theme.text }]}>
          {weather.tempC}°C · {weather.description}
        </Text>
      ) : (
        <Text style={[styles.hint, { color: theme.textHint }]}>{copy[weather.status]}</Text>
      )}
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.actionButton,
        { backgroundColor: theme.backgroundElement, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 },
      ]}>
      <Ionicons name={icon} size={18} color={theme.text} />
      <Text style={[styles.actionLabel, { color: theme.text }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  content: { padding: Spacing.lg, gap: Spacing.lg },
  imagePlaceholder: {
    height: 160,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  imagePlaceholderText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.lg,
  },
  metaLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  metaLabel: { fontSize: FontSize.sm },
  metaValue: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, flexShrink: 1, textAlign: 'right' },
  weatherValue: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  hint: { fontSize: FontSize.xs },
  mapWrap: {
    height: 200,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  map: { flex: 1 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
  },
  actionLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
});
