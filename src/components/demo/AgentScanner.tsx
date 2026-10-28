import { useEffect, useRef, useState } from "react";
import { LuCheck, LuCircleCheck, LuCircleX, LuLoaderCircle, LuPlay, LuRotateCcw, LuTriangleAlert } from "react-icons/lu";
import { QR_MATRICES } from "../../data/qr";
import { SCENARIOS, type ScenarioId } from "../../data/demo";
import { verificationService, type ResultatVerification } from "../../services/verification";
import { QrCode } from "../QrCode";

const ETAPES = [
  "Lecture du QR code présenté",
  "Décodage de l’identifiant",
  "Recherche dans le jeu de données fictif",
  "Affichage du résultat",
];

export function AgentScanner({ initialScenario = "valide" }: { initialScenario?: ScenarioId }) {
  const [scenario, setScenario] = useState<ScenarioId>(initialScenario);
  const [manuel, setManuel] = useState("");
  const [etape, setEtape] = useState(-1); // -1 attente, 0..3 progression, 4 terminé
  const [resultat, setResultat] = useState<ResultatVerification | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => setScenario(initialScenario), [initialScenario]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setEtape(-1);
    setResultat(null);
  };

  const lancer = (contenu: string) => {
    reset();
    setEtape(0);
    [1, 2, 3].forEach((s, i) => timers.current.push(window.setTimeout(() => setEtape(s), 700 * (i + 1))));
    timers.current.push(
      window.setTimeout(async () => {
        const r = await verificationService.verifier(contenu);
        setResultat(r);
        setEtape(4);
      }, 2600),
    );
  };

  const enCours = etape >= 0 && etape < 4;

  return (
    <div className="terminal">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <h3>Terminal de contrôle · mode agent</h3>
          <p className="muted small">Simulation. Aucune caméra n’est utilisée et aucune base nationale n’est interrogée.</p>
        </div>
        <span className="badge amber">Démonstration</span>
      </div>

      <div role="group" aria-label="Scénario de test" className="chip-row">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="chip"
            aria-pressed={scenario === s.id}
            onClick={() => { setScenario(s.id); reset(); }}
            title={s.description}
            disabled={enCours}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="terminal-grid">
        <div className="scan-zone scan-corners">
          <QrCode id={scenario} label={`QR code du scénario « ${SCENARIOS.find((s) => s.id === scenario)?.label} »`} />
          {enCours && <div className="scan-line" aria-hidden="true" />}
        </div>

        <div style={{ display: "grid", gap: 16, alignContent: "start", minWidth: 0 }}>
          <div className="btn-row">
            <button className="btn" type="button" style={{ background: "#6fd3ad", color: "var(--c-primary-strong)" }} onClick={() => lancer(QR_MATRICES[scenario].payload)} disabled={enCours}>
              <LuPlay /> Scanner le QR présenté
            </button>
            {(resultat || enCours) && (
              <button className="btn ghost" type="button" style={{ color: "#cfe6dc", borderColor: "#2d5a4a" }} onClick={reset}>
                <LuRotateCcw /> Réinitialiser
              </button>
            )}
          </div>

          <ol className="progress" aria-live="polite">
            {ETAPES.map((e, i) => {
              const cls = etape > i || etape === 4 ? "done" : etape === i ? "active" : "";
              return (
                <li key={e} className={cls}>
                  <span className="dot">
                    {cls === "done" ? <LuCheck /> : cls === "active" ? <LuLoaderCircle className="spin" /> : null}
                  </span>
                  {e}
                </li>
              );
            })}
          </ol>

          {resultat && <Resultat r={resultat} />}

          <form
            className="manual"
            onSubmit={(e) => { e.preventDefault(); if (manuel.trim()) lancer(manuel); }}
          >
            <label htmlFor="qr-manuel" className="small" style={{ flexBasis: "100%", color: "#cfe6dc" }}>
              Tester le contenu d’un QR code (exemple : CGN-DEMO:DEMO-12345)
            </label>
            <input id="qr-manuel" className="input mono" value={manuel} onChange={(e) => setManuel(e.target.value)} placeholder="CGN-DEMO:…" autoComplete="off" />
            <button className="btn secondary sm" type="submit" disabled={enCours || !manuel.trim()}>Tester</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Resultat({ r }: { r: ResultatVerification }) {
  if (r.statut === "reconnu") {
    const v = r.vehicule;
    return (
      <div className="result ok fade-in" role="status">
        <div className="result-head"><LuCircleCheck /><div><strong>Vérification simulée réussie</strong><p className="small muted">Identifiant de démonstration reconnu, informations cohérentes avec le scénario de test.</p></div></div>
        <dl className="kv">
          <dt>Immatriculation</dt><dd className="mono">{v.immatriculation}</dd>
          <dt>Véhicule</dt><dd>{v.marque} · {v.modele}</dd>
          <dt>Type · énergie</dt><dd>{v.genre} · {v.energie}</dd>
          <dt>N° de titre</dt><dd className="mono">{v.numeroTitre}</dd>
        </dl>
        <span className="status-stamp">DOCUMENT FICTIF DE DÉMONSTRATION</span>
      </div>
    );
  }
  if (r.statut === "signale") {
    const v = r.vehicule;
    return (
      <div className="result flag fade-in" role="status">
        <div className="result-head"><LuTriangleAlert /><div><strong>Document signalé comme invalide</strong><p className="small muted">{r.motif}</p></div></div>
        <dl className="kv">
          <dt>Immatriculation</dt><dd className="mono">{v.immatriculation}</dd>
          <dt>N° de titre</dt><dd className="mono">{v.numeroTitre}</dd>
        </dl>
        <p className="small">Conduite à tenir dans le scénario : appliquer la procédure prévue et orienter vers le service compétent.</p>
        <span className="status-stamp">SCÉNARIO FICTIF · TITRE SIGNALÉ</span>
      </div>
    );
  }
  return (
    <div className="result ko fade-in" role="status">
      <div className="result-head"><LuCircleX /><div><strong>Vérification simulée échouée</strong><p className="small muted">{r.statut === "format" ? "Contenu du QR code non reconnu." : "Identifiant inconnu ou invalide."} Vérification non concluante.</p></div></div>
      <p className="small mono" style={{ overflowWrap: "anywhere" }}>Contenu lu : {r.contenu || "(vide)"}</p>
      <p className="small">Invitation à consulter le service compétent.</p>
    </div>
  );
}
