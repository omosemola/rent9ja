// ============================================================================
// Properties store (replaces PropertiesBloc)
//
// The BLoC emitted one state at a time, so e.g. opening a detail page replaced
// the home lists. Here each concern has its own slice so screens don't clobber
// each other.
// ============================================================================

import { create } from 'zustand';
import * as propertiesService from '@/services/propertiesService';
import type { Pagination, Property, PropertySearchParams } from '@/types/property';
import { parseError } from '@/utils/parseError';

interface PropertiesState {
  featured: Property[];
  newest: Property[];
  searchResults: Property[];
  pagination: Pagination | null;
  detail: Property | null;

  loading: { home: boolean; search: boolean; detail: boolean };
  error: string | null;

  loadFeatured: () => Promise<void>;
  loadNewest: () => Promise<void>;
  search: (params: PropertySearchParams) => Promise<void>;
  loadDetail: (id: string) => Promise<void>;
  /** Optimistic: flips isFavorited immediately and reverts if the request fails. */
  toggleFavorite: (id: string) => Promise<boolean>;
  clearError: () => void;
}

// "Latest request wins" guards so a slow earlier response can't overwrite a newer one.
let searchSeq = 0;
let detailSeq = 0;

function flipFavorite(list: Property[], id: string): Property[] {
  return list.map((p) => (p.id === id ? { ...p, isFavorited: !p.isFavorited } : p));
}

export const usePropertiesStore = create<PropertiesState>((set) => ({
  featured: [],
  newest: [],
  searchResults: [],
  pagination: null,
  detail: null,
  loading: { home: false, search: false, detail: false },
  error: null,

  loadFeatured: async () => {
    set((s) => ({ loading: { ...s.loading, home: true }, error: null }));
    try {
      const featured = await propertiesService.getFeatured();
      set({ featured });
    } catch (e) {
      set({ error: parseError(e) });
    } finally {
      set((s) => ({ loading: { ...s.loading, home: false } }));
    }
  },

  loadNewest: async () => {
    set((s) => ({ loading: { ...s.loading, home: true }, error: null }));
    try {
      const newest = await propertiesService.getNewest();
      set({ newest });
    } catch (e) {
      set({ error: parseError(e) });
    } finally {
      set((s) => ({ loading: { ...s.loading, home: false } }));
    }
  },

  search: async (params) => {
    const seq = ++searchSeq;
    set((s) => ({ loading: { ...s.loading, search: true }, error: null }));
    try {
      const result = await propertiesService.searchProperties(params);
      if (seq !== searchSeq) return;
      set({ searchResults: result.data, pagination: result.pagination });
    } catch (e) {
      if (seq !== searchSeq) return;
      set({ error: parseError(e) });
    } finally {
      if (seq === searchSeq) set((s) => ({ loading: { ...s.loading, search: false } }));
    }
  },

  loadDetail: async (id) => {
    const seq = ++detailSeq;
    set((s) => ({ detail: null, loading: { ...s.loading, detail: true }, error: null }));
    try {
      const detail = await propertiesService.getPropertyById(id);
      if (seq !== detailSeq) return;
      set({ detail });
    } catch (e) {
      if (seq !== detailSeq) return;
      set({ error: parseError(e) });
    } finally {
      if (seq === detailSeq) set((s) => ({ loading: { ...s.loading, detail: false } }));
    }
  },

  toggleFavorite: async (id) => {
    const apply = () =>
      set((s) => ({
        featured: flipFavorite(s.featured, id),
        newest: flipFavorite(s.newest, id),
        searchResults: flipFavorite(s.searchResults, id),
        detail: s.detail?.id === id ? { ...s.detail, isFavorited: !s.detail.isFavorited } : s.detail,
      }));
    apply();
    try {
      await propertiesService.toggleFavorite(id);
      return true;
    } catch {
      apply(); // revert
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

/** Convenience for screens that only need the load actions once on mount. */
export const loadHomeData = (): Promise<void[]> => {
  const { loadFeatured, loadNewest } = usePropertiesStore.getState();
  return Promise.all([loadFeatured(), loadNewest()]);
};
