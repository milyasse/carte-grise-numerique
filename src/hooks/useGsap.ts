import { useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "gsap";

/**
 * Lance une animation GSAP limitée à un conteneur et la nettoie au démontage.
 * Si l'utilisateur a demandé moins d'animations, rien n'est animé.
 */
export function useGsap(scope: RefObject<HTMLElement | null>, anim: (ctx: { gsap: typeof gsap }) => void, deps: DependencyList = []) {
  useLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => anim({ gsap }), el);
      return () => ctx.revert();
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { gsap };
