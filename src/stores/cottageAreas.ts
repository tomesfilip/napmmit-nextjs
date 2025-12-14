import { create } from 'zustand';

type State = {
  cottageAreas: string[];
  setCottageAreas: (data: string[]) => void;
};

export const useCottageAreas = create<State>((set) => ({
  cottageAreas: [],
  setCottageAreas: (data: string[]) => set({ cottageAreas: data }),
}));
