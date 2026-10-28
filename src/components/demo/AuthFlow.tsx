import { useEffect, useRef, useState } from "react";
import { LuDoorOpen, LuFileCheck, LuFingerprint, LuFolderOpen, LuLogIn } from "react-icons/lu";
import { LogoNarsa } from "../LogoNarsa";

const ETAPES = [
  { icon: LuDoorOpen, titre: "Accès à l’espace usager" },
  { icon: LuFingerprint, titre: "Authentification sécurisée" },
  { icon: LuFileCheck, titre: "Consultation des documents" },
  { icon: LuFolderOpen, titre: "Accès aux démarches" },
];

/** Représentation visuelle du futur parcours d'authentification. Aucun identifiant n'est demandé. */
export function AuthFlow({ connecte, onConnecte }: { connecte: boolean; onConnecte: (v: boolean) => void }) {
  const [etape, setEtape] = useState(connecte ? 4 : 0);
  const t = useRef<number[]>([]);
  useEffect(() => () => t.current.forEach(clearTimeout), []);

  const demarrer = () => {
    setEtape(1);
    [2, 3, 4].forEach((s, i) => t.current.push(window.setTimeout(() => setEtape(s), 650 * (i + 1))));
    t.current.push(window.setTimeout(() => onConnecte(true), 650 * 3 + 200));
  };

  return (
    <div className="card" style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <LogoNarsa size={36} />
          <div>
            <h3>Espace usager</h3>
            <p className="small muted">Parcours d’authentification simulé, sans saisie d’identifiants.</p>
          </div>
        </div>
        {connecte ? (
          <button className="btn ghost sm" type="button" onClick={() => { setEtape(0); onConnecte(false); }}>Se déconnecter</button>
        ) : (
          <button className="btn sm" type="button" onClick={demarrer} disabled={etape > 0}>
            <LuLogIn /> Simuler la connexion
          </button>
        )}
      </div>
      <ol className="auth-steps">
        {ETAPES.map((e, i) => {
          const I = e.icon;
          return (
            <li key={e.titre} className={etape > i ? "done" : ""}>
              <I />
              <span>{e.titre}</span>
            </li>
          );
        })}
      </ol>
      <p className="small muted">Le mécanisme réel (par exemple l’identité numérique nationale) sera défini avec les acteurs concernés.</p>
    </div>
  );
}
