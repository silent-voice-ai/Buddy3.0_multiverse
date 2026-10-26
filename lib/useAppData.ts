'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppData } from './types';
import { getAppData, saveAppData, defaultAppData } from './storage';

export function useAppData() {
  const [data, setData] = useState<AppData>(defaultAppData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(getAppData());
    setLoaded(true);
  }, []);

  const update = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const next = updater(prev);
      saveAppData(next);
      return next;
    });
  }, []);

  return { data, update, loaded };
}
