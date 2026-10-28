import { useId } from "react";

/** Points d'une étoile à huit branches (khatam), centrée en (cx, cy). */
export function etoile8(cx: number, cy: number, r: number, ri = r * 0.72) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : ri;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

/** Fond zellige : étoiles à huit branches et croisillons, en traits fins. */
export function ZelligeFond({ couleur = "#f9c522", opacite = 0.16, taille = 34 }: { couleur?: string; opacite?: number; taille?: number }) {
  const id = useId().replace(/:/g, "");
  const s = taille;
  const c = s / 2;
  return (
    <svg className="mz-fond" aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={`z${id}`} width={s} height={s} patternUnits="userSpaceOnUse">
          <g fill="none" stroke={couleur} strokeWidth="0.9" opacity={opacite}>
            <polygon points={etoile8(c, c, s * 0.36)} />
            <polygon points={etoile8(c, c, s * 0.18, s * 0.13)} />
            <polygon points={etoile8(0, 0, s * 0.2, s * 0.14)} />
            <polygon points={etoile8(s, 0, s * 0.2, s * 0.14)} />
            <polygon points={etoile8(0, s, s * 0.2, s * 0.14)} />
            <polygon points={etoile8(s, s, s * 0.2, s * 0.14)} />
            <path d={`M${c} 0 V${s * 0.14} M${c} ${s} V${s * 0.86} M0 ${c} H${s * 0.14} M${s} ${c} H${s * 0.86}`} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#z${id})`} />
    </svg>
  );
}

/** Rosace : grande étoile à huit branches avec anneaux, pour un coin de carte. */
export function Rosace({ className = "", couleur = "#f9c522" }: { className?: string; couleur?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" stroke={couleur}>
        <circle cx="100" cy="100" r="96" strokeWidth="1" opacity=".5" />
        <polygon points={etoile8(100, 100, 92)} strokeWidth="1.6" />
        <polygon points={etoile8(100, 100, 66)} strokeWidth="1.2" opacity=".85" />
        <circle cx="100" cy="100" r="40" strokeWidth="1" opacity=".7" />
        <polygon points={etoile8(100, 100, 30, 21)} strokeWidth="1.4" />
        <circle cx="100" cy="100" r="6" fill={couleur} opacity=".8" />
      </g>
    </svg>
  );
}

/** Arc outrepassé (arc « en fer à cheval ») servant de cadre. */
export function Arc({ className = "", couleur = "#f9c522" }: { className?: string; couleur?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 120" preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" stroke={couleur}>
        <path d="M30 120 V64 C30 30 48 8 120 8 C192 8 210 30 210 64 V120" strokeWidth="2" />
        <path d="M40 120 V66 C40 38 56 18 120 18 C184 18 200 38 200 66 V120" strokeWidth="1" opacity=".6" />
        <path d="M30 64 C22 64 18 58 22 52 M210 64 C218 64 222 58 218 52" strokeWidth="1.5" opacity=".8" />
      </g>
    </svg>
  );
}

/** Frise de petites étoiles entre deux filets. */
export function Frise({ couleur = "#f9c522" }: { couleur?: string }) {
  const n = 14;
  return (
    <svg className="mz-frise" viewBox={`0 0 ${n * 20} 12`} preserveAspectRatio="none" aria-hidden="true">
      <g stroke={couleur} fill="none">
        <line x1="0" y1="1" x2={n * 20} y2="1" strokeWidth=".8" opacity=".7" />
        <line x1="0" y1="11" x2={n * 20} y2="11" strokeWidth=".8" opacity=".7" />
        {Array.from({ length: n }, (_, i) => (
          <polygon key={i} points={etoile8(10 + i * 20, 6, 4, 2.9)} strokeWidth=".9" />
        ))}
      </g>
    </svg>
  );
}
