import { useState } from "react";

/**
 * Emplacement du logo NARSA.
 * Le logo officiel n'est pas embarqué : déposez le fichier fourni par la NARSA dans
 * public/assets/logo-narsa.svg (ou .png) après autorisation. Tant qu'il est absent,
 * un emplacement réservé, clairement identifié, est affiché.
 */
const SOURCES = ["assets/logo-narsa.svg", "assets/logo-narsa.png"];

export function LogoNarsa({ size = 44, variant = "default" }: { size?: number; variant?: "default" | "light" }) {
  const [idx, setIdx] = useState(0);
  if (idx < SOURCES.length) {
    return (
      <img
        className="logo-img"
        src={`${import.meta.env.BASE_URL}${SOURCES[idx]}`}
        alt="Logo NARSA"
        height={size}
        style={{ height: size, width: "auto", maxWidth: size * 3 }}
        onError={() => setIdx((i) => i + 1)}
      />
    );
  }
  return (
    <div
      className="logo-slot"
      style={{ width: size * 1.6, height: size, ...(variant === "light" ? {} : {}) }}
      role="img"
      aria-label="Emplacement réservé au logo officiel de la NARSA"
      title="Emplacement réservé au logo officiel de la NARSA"
    >
      Logo
      <br />
      NARSA
    </div>
  );
}
