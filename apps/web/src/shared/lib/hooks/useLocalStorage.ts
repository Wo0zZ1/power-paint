"use client";

import { useCallback, useEffect, useState } from "react";

type SetValue<T> = T | ((prev: T) => T);
type Listener<T> = (value: T) => void;

// Module-level: все экземпляры хука с одним ключом получают обновления напрямую
const keyListeners = new Map<string, Set<Listener<unknown>>>();

function notifyListeners<T>(key: string, value: T) {
  keyListeners.get(key)?.forEach((fn) => (fn as Listener<T>)(value));
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void] {
  const readFromStorage = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readFromStorage);

  useEffect(() => {
    if (!keyListeners.has(key)) keyListeners.set(key, new Set());
    const listener: Listener<T> = (v) => setStoredValue(v);
    keyListeners.get(key)!.add(listener as Listener<unknown>);

    // Синхронизация между вкладками
    const handleCrossTab = (e: StorageEvent) => {
      if (e.key !== key) return;
      setStoredValue(readFromStorage());
    };
    window.addEventListener("storage", handleCrossTab);

    return () => {
      keyListeners.get(key)?.delete(listener as Listener<unknown>);
      window.removeEventListener("storage", handleCrossTab);
    };
  }, [key, readFromStorage]);

  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        notifyListeners(key, newValue);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}
