import { CreateCottageSchemaType } from '@/lib/formSchemas';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = Partial<CreateCottageSchemaType> & {
  cottageId?: number;
  setData: (
    data: Partial<CreateCottageSchemaType> & { cottageId?: number },
  ) => void;
  clean: () => void;
};

export const useCreateFormStore = create<State>()(
  persist(
    (set, get, api) => ({
      setData: (data) => set(data),
      clean: () => {
        set({});
        api.persist.clearStorage();
      },
    }),
    {
      name: 'create_cottage_form',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
