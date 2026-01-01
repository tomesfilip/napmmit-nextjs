'use client';

import { useCreateFormStore } from '@/stores/createFormStore';
import { useEffect } from 'react';

export function CreateFormInit() {
  const clean = useCreateFormStore((state) => state.clean);
  const setMode = useCreateFormStore((state) => state.setMode);

  useEffect(() => {
    clean();
    setMode('create');
  }, [clean, setMode]);

  return null;
}
