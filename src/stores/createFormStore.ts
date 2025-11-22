import { CreateCottageSchemaType } from '@/lib/formSchemas';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = Partial<CreateCottageSchemaType> & {
  isEditing?: boolean;
  setData: (
    data: Partial<CreateCottageSchemaType> & { isEditing?: boolean },
  ) => void;
};

export const useCreateFormStore = create<State>()(
  persist(
    (set) => ({
      setData: (data) => set(data),
    }),
    {
      name: 'create_cottage_form',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
