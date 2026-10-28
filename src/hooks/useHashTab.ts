import { useCallback, useEffect, useState } from "react";

export function useHashTab<T extends string>(tabs: readonly T[], fallback: T) {
  const read = useCallback((): T => {
    const h = window.location.hash.replace("#", "") as T;
    return tabs.includes(h) ? h : fallback;
  }, [tabs, fallback]);

  const [tab, setTab] = useState<T>(read);

  useEffect(() => {
    const onHash = () => setTab(read());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [read]);

  const go = useCallback((t: T) => {
    if (window.location.hash !== `#${t}`) window.location.hash = t;
    setTab(t);
    window.scrollTo({ top: 0 });
  }, []);

  return [tab, go] as const;
}
