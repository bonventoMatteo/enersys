
import { create } from 'zustand';

interface UIStore {
  viewMode: 'kanban' | 'table' | 'timeline' | 'dashboard';
  selectedTaskId: string | null;
  isCommandPaletteOpen: boolean;
  setViewMode: (mode: 'kanban' | 'table' | 'timeline' | 'dashboard') => void;
  setSelectedTask: (id: string | null) => void;
  toggleCommandPalette: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  viewMode: 'kanban',
  selectedTaskId: 'WD-8821',
  isCommandPaletteOpen: false,
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedTask: (selectedTaskId) => set({ selectedTaskId }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
}));