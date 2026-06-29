import { StyleSheet, View } from 'react-native';

import { CARD_HEIGHT } from '@/features/bracket/components/bracket-match-card';
import type { Match } from '@/features/matches/types';
import { useTheme } from '@/hooks/use-theme';

/** Must match `cards` gap and the chip+gap offset in bracket-board.tsx. */
export const CARD_GAP = 12;
export const COLUMN_HEADER_OFFSET = 40;
export const GUTTER_WIDTH = 28;
const STUB_WIDTH = GUTTER_WIDTH / 2;
const LINE_THICKNESS = 2;

export function isMatchDecided(match: Match): boolean {
  return (
    match.status === 'finished' &&
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.homeScore !== match.awayScore
  );
}

export function matchCenterY(index: number): number {
  return COLUMN_HEADER_OFFSET + index * (CARD_HEIGHT + CARD_GAP) + CARD_HEIGHT / 2;
}

export function columnContentHeight(matchCount: number): number {
  return COLUMN_HEADER_OFFSET + matchCount * CARD_HEIGHT + Math.max(matchCount - 1, 0) * CARD_GAP;
}

/**
 * Draws the bracket "tree" lines between two rounds — pairs of matches merge into one
 * line feeding the next round's slot. Lines light up gold once the feeding match is decided,
 * so the path to the final visibly tracks who has advanced.
 * When given a single match (e.g. the final feeding the trophy), draws one straight line.
 */
export function BracketConnector({ sourceMatches }: { sourceMatches: Match[] }) {
  const theme = useTheme();
  const height = columnContentHeight(sourceMatches.length);
  const litColor = theme.primary;
  const idleColor = theme.border;

  if (sourceMatches.length === 1) {
    const lit = isMatchDecided(sourceMatches[0]);
    return (
      <View style={[styles.gutter, { height }]}>
        <View
          style={[
            styles.hLine,
            { top: matchCenterY(0) - LINE_THICKNESS / 2, left: 0, width: GUTTER_WIDTH, backgroundColor: lit ? litColor : idleColor },
          ]}
        />
      </View>
    );
  }

  const pairs = Math.floor(sourceMatches.length / 2);

  return (
    <View style={[styles.gutter, { height }]}>
      {Array.from({ length: pairs }).map((_, i) => {
        const topMatch = sourceMatches[i * 2];
        const bottomMatch = sourceMatches[i * 2 + 1];
        const yTop = matchCenterY(i * 2);
        const yBottom = matchCenterY(i * 2 + 1);
        const yMid = (yTop + yBottom) / 2;
        const topLit = isMatchDecided(topMatch);
        const bottomLit = isMatchDecided(bottomMatch);
        const mergedLit = topLit && bottomLit;

        return (
          <View key={topMatch.id}>
            <View
              style={[
                styles.hLine,
                { top: yTop - LINE_THICKNESS / 2, left: 0, width: STUB_WIDTH, backgroundColor: topLit ? litColor : idleColor },
              ]}
            />
            <View
              style={[
                styles.hLine,
                {
                  top: yBottom - LINE_THICKNESS / 2,
                  left: 0,
                  width: STUB_WIDTH,
                  backgroundColor: bottomLit ? litColor : idleColor,
                },
              ]}
            />
            <View
              style={[
                styles.vLine,
                {
                  left: STUB_WIDTH - LINE_THICKNESS / 2,
                  top: yTop,
                  height: yBottom - yTop,
                  backgroundColor: mergedLit ? litColor : idleColor,
                },
              ]}
            />
            <View
              style={[
                styles.hLine,
                {
                  top: yMid - LINE_THICKNESS / 2,
                  left: STUB_WIDTH,
                  width: STUB_WIDTH,
                  backgroundColor: mergedLit ? litColor : idleColor,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  gutter: {
    width: GUTTER_WIDTH,
  },
  hLine: {
    position: 'absolute',
    height: LINE_THICKNESS,
    borderRadius: LINE_THICKNESS / 2,
  },
  vLine: {
    position: 'absolute',
    width: LINE_THICKNESS,
    borderRadius: LINE_THICKNESS / 2,
  },
});
