import { QR_MATRICES } from "../data/qr";

/** QR code de démonstration, rendu en SVG à partir d'une matrice pré-générée (scannable). */
export function QrCode({ id, className = "qr", label }: { id: keyof typeof QR_MATRICES; className?: string; label?: string }) {
  const m = QR_MATRICES[id];
  if (!m) return null;
  const n = m.rows.length;
  let d = "";
  m.rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === "1") d += `M${x} ${y}h1v1h-1z`;
  });
  return (
    <svg
      className={className}
      viewBox={`0 0 ${n} ${n}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label ?? `QR code de démonstration contenant ${m.payload}`}
    >
      <rect width={n} height={n} fill="#ffffff" />
      <path d={d} fill="#13241f" />
    </svg>
  );
}
