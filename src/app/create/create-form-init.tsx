'use client';

import { useEffect } from 'react';
import { useCreateFormStore } from '@/stores/createFormStore';

export function CreateFormInit() {
  const clean = useCreateFormStore((state) => state.clean);
  const setMode = useCreateFormStore((state) => state.setMode);

  useEffect(() => {
    clean();
    setMode('create');
  }, [clean, setMode]);

  return null;
}
