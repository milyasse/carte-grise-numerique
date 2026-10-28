import { useEffect, useState } from "react";

/** État conservé dans le navigateur de l'utilisateur uniquement (aucune transmission). */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* stockage indisponible : l'état reste en mémoire */
    }
  }, [key, value]);
  return [value, setValue] as const;
}
