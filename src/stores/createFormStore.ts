import { CreateCottageSchemaType } from '@/lib/formSchemas';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Mode = 'create' | 'edit';

type State = Partial<CreateCottageSchemaType> & {
  mode: Mode;
  cottageId?: number;
};

type Actions = {
  setMode: (mode: Mode, cottageId?: number) => void;
  setData: (
    data: Partial<CreateCottageSchemaType> & {
      cottageId?: number;
    },
  ) => void;
  clean: () => void;
};

const initialState: State = {
  mode: 'create',
  cottageId: undefined,
};

export const useCreateFormStore = create<State & Actions>()(
  persist(
    (set, get, api) => ({
      ...initialState,
      setData: (data) => set((state) => ({ ...state, ...data })),
      setMode: (mode, cottageId) => set({ mode, cottageId }),
      clean: () => {
        set(initialState);
        api.persist.clearStorage();
      },
    }),
    {
      name: 'create_cottage_form',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
