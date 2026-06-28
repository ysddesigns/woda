**Product Requirements Document (PRD)**  
**App Name:** Woda  
**Version:** 1.0  
**Date:** June 2026  
**Product Owner:** Yusuff Smart | Kashify Technologies
**Target Platforms:** iOS and Android (Expo / React Native)  
**Target Users:** Football fans, casual viewers, travelers attending the tournament, and anyone wanting quick, reliable World Cup 2026 info.

### 1. Executive Summary / Vision

Build a fast, beautiful, cross-platform mobile app for the **FIFA World Cup 2026** (hosted by Canada, Mexico, USA) that delivers real-time matches, scores, schedules, and tournament info.

Start simple (as in the Short: home screen with segmented tabs for Past / Today / Upcoming) and expand into a full-featured companion app. Leverage **Expo + React Native** for rapid development and **Claude (or similar AI)** to accelerate coding while maintaining human oversight for UI/UX. Use a free open-source REST API for data.

**Core Value Proposition:** One-tap access to everything happening in the World Cup with clean design, offline support, notifications, and dark mode — built and shipped quickly.

**Success Metrics:**

- 10k+ downloads in first month.
- High retention (users checking multiple times per day during tournament).
- Positive ratings (≥4.5 stars).
- Low crash rate.

### 2. Objectives & Goals

- **Primary:** Provide accurate, real-time tournament information.
- **Secondary:** Enhance fan experience with personalization, planning tools, and social features.
- Deliver a production-ready MVP quickly using AI-assisted development.
- Ensure excellent performance, accessibility, and cross-platform consistency.

### 3. User Personas

- **Casual Fan (Alex, 28):** Follows big matches, wants quick scores.
- **Die-hard Supporter (Maria, 35):** Tracks favorite team, wants stats/lineups.
- **Traveler (Jordan, 42):** Attending matches, needs venue info, times, transport.
- **Office Worker (Sam, 31):** Quick glances during work, notifications.

### 4. Key Features

#### MVP (Phase 1 – Matches the YouTube Short)

- **Home Screen** — Segmented control: Past / Today / Upcoming matches.
- Match cards displaying: Teams (flags + names), score (if played), time/venue, status (live/FT/upcoming).
- Real data from open World Cup 2026 API.
- Dark mode support.
- Basic pull-to-refresh.
- Responsive layout (team alignment, trimming long names).

#### Phase 2 Enhancements

- **Tournament Navigation**:
  - Groups / Standings (points, GD, etc.).
  - Knockout bracket (Round of 32 → Final).
  - Full schedule with filters (by date, group, stadium).

- **Match Details**:
  - Lineups, substitutions, events (goals, cards, VAR).
  - Live minute-by-minute updates.
  - Statistics (possession, shots, etc.).
  - Highlights (if API supports links).

- **Teams & Players**:
  - Team profiles (roster, coach, flag).
  - Player stats (if available).

- **Venues & Logistics**:
  - Stadium list with capacity, location, images.
  - Host city info (time zone conversion, weather).
  - Basic map integration (Expo Location + MapView).

- **Personalization**:
  - Favorite teams/countries (push notifications for their matches).
  - Custom notifications (match start, goals, live).

- **Additional**:
  - Offline caching (AsyncStorage or similar).
  - Search.
  - Settings (language, notifications, theme).
  - Share match cards.

#### Future / Nice-to-Have (Phase 3) out of scope for version 1

- Fantasy mini-league.
- Ticket links / integration.
- News feed.
- AR stadium view or 3D maps.
- Multi-language support.
- Apple Live Activities / Android Dynamic Island.
- Watch parties or social integration.

## plan the architecture to support

- arhicture the app to support the phase 3 so that we can simple integrated and push with OTA.

the architecture should be in a way that will not trigger apple app store, or play store to reject or causes delay to our app.

### 5. Technical Requirements

- **Framework:** Expo (SDK latest), React Native.
- **Language:** TypeScript.
- **State Management:** Zustand (as in video) + TanStack Query / React Query for data fetching/caching.
- **Data Source:** Primary — https://github.com/rezarahiminia/worldcup2026 (free, open-source, real-time, no key). Fallback or enrichment from other public sources if needed.
- **UI Library:** NativeBase, Tamagui, or custom with Tailwind (NativeWind).
- **Navigation:** React Navigation.
- **Storage:** AsyncStorage / MMKV + caching layer.
- **Notifications:** Expo Notifications.
- **Analytics:** Expo Analytics or Firebase (optional).
- **Deployment:** Expo EAS (EAS Build + Submit for App Store / Play Store).
- **AI Assistance:** Use Claude (or Grok/GPT) for generating types, components, stores, and prompting best practices.
- **Performance:** Target < 2s load, smooth scrolling, efficient re-renders.
- **Accessibility:** Screen reader support, high contrast, dynamic text sizes.

### 6. Non-Functional Requirements

- **Design:** Clean, modern, football-themed (greens, vibrant flags). Consistent with official branding but original. Support dark/light mode.
- **Performance:** Work well on mid-range devices.
- **Offline:** Show cached data with timestamp.
- **Security:** No sensitive data; HTTPS only.
- **Localization:** English primary; easy to add more.
- **Compliance:** App Store / Play Store guidelines, basic privacy policy (no user data collection in MVP).
- **Testing:** Unit (Jest), component testing, manual on iOS/Android, different screen sizes.

### 7. User Flows (High-Level)

1. **Onboarding** — Splash → Optional favorite teams selection → Home.
2. **Browse Matches** — Home tabs → Tap match → Details.
3. **View Standings** — Bottom tab or drawer.
4. **Notifications** — Settings to toggle per team or global.
5. **Venue Info** — From match or dedicated screen.

### 8. Assumptions & Dependencies

- API remains free, stable, and comprehensive during the tournament.
- FIFA does not restrict non-official apps (common for informational apps).
- Development primarily solo or small team using AI tools.

### 9. Roadmap & Timeline (Aggressive)

- **Week 1:** Setup + MVP (as in Short) + basic caching.
- **Week 2-3:** Match details, standings, bracket, notifications.
- **Week 4:** Polish, venues, testing, submission.
- **Post-launch:** Iterations based on feedback + Phase 2/3 features.

### 10. Risks & Mitigations

- API downtime → Caching + fallback message.
- Data accuracy → Attribute source + refresh often.
- Design polish → Manual tweaks after AI generation.
- App review delays → Follow guidelines strictly.

### 11. Success Criteria & KPIs

- App Store approval.
- Crash-free sessions > 99%.
- Daily active users during tournament.
- Positive user feedback on speed and design.

This PRD provides a complete blueprint. You can start building the MVP exactly as shown in the Short and iterate from there. Would you like me to generate:

- Detailed user stories / acceptance criteria?
- Sample prompts for Claude?
- Folder structure / tech spec?
- Figma-style UI descriptions?
- Or actual starter code snippets?

Let me know how to expand or refine this!
