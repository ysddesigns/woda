import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type FavoritesState = {
  /** Favorite team ids (matches Team.id from the API). */
  teamIds: string[];
  toggleTeam: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      teamIds: [],
      toggleTeam: (id) =>
        set((state) => ({
          teamIds: state.teamIds.includes(id)
            ? state.teamIds.filter((t) => t !== id)
            : [...state.teamIds, id],
        })),
      isFavorite: (id) => get().teamIds.includes(id),
    }),
    {
      name: 'woda-favorites',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
