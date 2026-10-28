/** Marque de l'application (symbole bleu/jaune + nom), partagée par la v1 et la v2. */
export function Marque({ clair = false, compact = false }: { clair?: boolean; compact?: boolean }) {
  return (
    <div className={`v2-marque ${clair ? "clair" : ""} ${compact ? "compact" : ""}`}>
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <path className="mq-a" d="M2 30 L26 4 L34 4 L12 30 Z" fill="currentColor" opacity=".9" />
        <path className="mq-b" d="M16 30 L36 8 L44 8 L26 30 Z" fill="#f9c522" />
      </svg>
      <span><strong>Carte grise</strong><small>numérique · NARSA</small></span>
    </div>
  );
}
