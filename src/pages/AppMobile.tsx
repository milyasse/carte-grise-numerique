import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuArrowLeft, LuBell, LuChevronRight, LuFingerprint, LuFolderOpen, LuHouse, LuIdCard, LuInfo,
  LuLoaderCircle, LuLogOut, LuQrCode, LuScanLine, LuShieldCheck, LuSiren, LuX,
} from "react-icons/lu";
import { CarteGriseMobile } from "../components/CarteGriseMobile";
import { AgentScanner } from "../components/demo/AgentScanner";
import { Demarches } from "../components/demo/Demarches";
import { LogoNarsa } from "../components/LogoNarsa";
import { PlaqueMaroc } from "../components/PlaqueMaroc";
import { QrCode } from "../components/QrCode";
import { USAGER, VEHICULES_USAGER } from "../data/demo";
import { ModeFinal } from "../hooks/modeFinal";
import { QR_MATRICES } from "../data/qr";
import { verificationService } from "../services/verification";

type Ecran = "accueil" | "carte" | "demarches" | "controle";
type Phase = "splash" | "connexion" | "app";

const NAV: { id: Ecran; label: string; icon: IconType }[] = [
  { id: "accueil", label: "Accueil", icon: LuHouse },
  { id: "carte", label: "Ma carte", icon: LuIdCard },
  { id: "demarches", label: "Démarches", icon: LuFolderOpen },
  { id: "controle", label: "Contrôle", icon: LuSiren },
];

/** Application mobile simulée « Carte grise numérique ». Plein écran sur téléphone, cadre de smartphone sur ordinateur. */
export function AppMobile({ onQuit }: { onQuit: () => void }) {
  const [phase, setPhase] = useState<Phase>("splash");
  const [ecran, setEcran] = useState<Ecran>("accueil");
  const [vIdx, setVIdx] = useState(0);
  const [qrPlein, setQrPlein] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "splash") return;
    const t = window.setTimeout(() => setPhase("connexion"), 1400);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [ecran, vIdx]);

  const v = VEHICULES_USAGER[vIdx];
  const ouvrirCarte = (i: number) => { setVIdx(i); setEcran("carte"); };

  return (
    <ModeFinal.Provider value={true}>
    <div className="app-stage">
      <aside className="app-aside">
        <button className="btn ghost sm" type="button" onClick={onQuit}><LuArrowLeft /> Retour à la présentation</button>
        <div>
          <span className="eyebrow">Maquette de l’application</span>
          <h2 style={{ marginTop: 6 }}>Application Carte grise numérique</h2>
          <p className="muted" style={{ marginTop: 8 }}>
            Version cible de l’application : connexion par identité numérique, carte grise sur le téléphone,
            QR code à présenter, duplicata et mutation en ligne. L’onglet Contrôle montre l’écran de l’agent.
          </p>
        </div>
        <div className="notice warn"><LuInfo /> Maquette du projet. Personnes et véhicules fictifs. Application non officielle, non connectée aux systèmes de la NARSA.</div>
      </aside>

      <div className="app-device">
        <div className="app-shell">
          <div className="app-demo-bar"><span>Maquette du projet · données fictives</span><button type="button" onClick={onQuit} aria-label="Quitter l’application"><LuX /></button></div>

          {phase === "splash" && (
            <div className="app-splash fade-in">
              <div className="app-splash-logo"><LogoNarsa size={56} variant="light" /></div>
              <h1>Carte grise<br />numérique</h1>
              <p className="ar" lang="ar">البطاقة الرمادية الرقمية</p>
              <LuLoaderCircle className="spin" style={{ width: 28, height: 28, marginTop: 24 }} />
            </div>
          )}

          {phase === "connexion" && <Connexion onOk={() => setPhase("app")} />}

          {phase === "app" && (
            <>
              <header className="app-top">
                {ecran === "accueil" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <LogoNarsa size={30} />
                    <strong>Carte grise numérique</strong>
                  </div>
                ) : (
                  <button type="button" className="app-icon-btn" onClick={() => setEcran("accueil")} aria-label="Retour à l’accueil"><LuArrowLeft /></button>
                )}
                {ecran !== "accueil" && <strong>{NAV.find((n) => n.id === ecran)?.label}</strong>}
                <button type="button" className="app-icon-btn" aria-label="Se déconnecter" onClick={() => { setPhase("connexion"); setEcran("accueil"); }}><LuLogOut /></button>
              </header>

              <div className="app-scroll" ref={scrollRef}>
                {ecran === "accueil" && <Accueil onCarte={ouvrirCarte} onGo={setEcran} />}
                {ecran === "carte" && (
                  <div className="app-pad" style={{ display: "grid", gap: 12 }}>
                    <div className="chip-row" role="group" aria-label="Véhicule">
                      {VEHICULES_USAGER.map((x, i) => (
                        <button key={x.immatriculation} type="button" className="chip" aria-pressed={i === vIdx} onClick={() => setVIdx(i)}>
                          <PlaqueMaroc plaque={x.plaque} size="sm" />
                        </button>
                      ))}
                    </div>
                    <div className="app-card-frame">
                      <CarteAvecActions vIdx={vIdx} onPresenter={() => setQrPlein(true)} onControle={() => setEcran("controle")} />
                    </div>
                  </div>
                )}
                {ecran === "demarches" && (
                  <div className="app-pad app-flat">
                    <Demarches connecte onVoirCarte={() => setEcran("carte")} />
                  </div>
                )}
                {ecran === "controle" && (
                  <div className="app-pad">
                    <AgentScanner initialScenario="valide" final />
                  </div>
                )}
              </div>

              <nav className="app-nav" aria-label="Navigation de l’application">
                {NAV.map((n) => {
                  const I = n.icon;
                  return (
                    <button key={n.id} type="button" aria-current={ecran === n.id ? "page" : undefined} onClick={() => setEcran(n.id)}>
                      <I /><span>{n.label}</span>
                    </button>
                  );
                })}
              </nav>

              {qrPlein && (
                <div className="app-qr-full fade-in" role="dialog" aria-modal="true" aria-label="Présenter le QR code">
                  <p className="small" style={{ opacity: 0.8 }}>Présentez ce QR code à l’agent</p>
                  <PlaqueMaroc plaque={v.plaque} />
                  <div className="app-qr-big"><QrCode id={v.qrId} /></div>
                  <p className="small" style={{ opacity: 0.8, textAlign: "center" }}>{v.titulaire} · {v.marque} {v.modele}</p>
                  <button className="btn" type="button" style={{ background: "#fff", color: "var(--c-primary-strong)" }} onClick={() => setQrPlein(false)}>Fermer</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </ModeFinal.Provider>
  );
}

function Connexion({ onOk }: { onOk: () => void }) {
  const [etape, setEtape] = useState(0);
  const t = useRef<number[]>([]);
  useEffect(() => () => t.current.forEach(clearTimeout), []);
  const lancer = () => {
    setEtape(1);
    t.current.push(window.setTimeout(() => setEtape(2), 900));
    t.current.push(window.setTimeout(() => setEtape(3), 1700));
    t.current.push(window.setTimeout(onOk, 2300));
  };
  const textes = ["", "Connexion au service d’identité numérique…", "Identité vérifiée", "Ouverture de votre espace…"];
  return (
    <div className="app-login fade-in">
      <LogoNarsa size={48} />
      <div>
        <h2>Bienvenue</h2>
        <p className="muted" style={{ marginTop: 6 }}>Accédez à votre carte grise et à vos démarches.</p>
      </div>
      <button className="btn" type="button" onClick={lancer} disabled={etape > 0} style={{ width: "100%" }}>
        {etape > 0 ? <LuLoaderCircle className="spin" /> : <LuFingerprint />} Se connecter avec l’identité numérique
      </button>
      {etape > 0 && <p className="small" role="status" style={{ color: "var(--c-primary)", textAlign: "center" }}>{textes[etape]}</p>}
    </div>
  );
}

function Accueil({ onCarte, onGo }: { onCarte: (i: number) => void; onGo: (e: Ecran) => void }) {
  return (
    <div className="app-pad" style={{ display: "grid", gap: 18 }}>
      <div>
        <p className="muted small">Bonjour,</p>
        <h2 style={{ fontSize: "1.4rem" }}>{USAGER.prenom}</h2>
      </div>

      <section style={{ display: "grid", gap: 10 }}>
        <h3 className="app-h">Mes véhicules</h3>
        {VEHICULES_USAGER.map((v, i) => (
          <button key={v.immatriculation} type="button" className="app-veh" onClick={() => onCarte(i)}>
            <div style={{ display: "grid", gap: 8, justifyItems: "start", minWidth: 0 }}>
              <PlaqueMaroc plaque={v.plaque} size="sm" />
              <span className="small">{v.marque} · {v.modele}</span>
              {v.statut === "valide"
                ? <span className="badge"><LuShieldCheck /> Carte grise disponible</span>
                : <span className="badge amber">Titre signalé</span>}
            </div>
            <LuChevronRight />
          </button>
        ))}
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <h3 className="app-h">Raccourcis</h3>
        <div className="app-shortcuts">
          <button type="button" onClick={() => onCarte(0)}><LuQrCode /><span>Présenter mon QR</span></button>
          <button type="button" onClick={() => onGo("demarches")}><LuFolderOpen /><span>Duplicata ou mutation</span></button>
          <button type="button" onClick={() => onGo("demarches")}><LuBell /><span>Suivre un dossier</span></button>
          <button type="button" onClick={() => onGo("controle")}><LuScanLine /><span>Contrôle routier</span></button>
        </div>
      </section>
    </div>
  );
}

function CarteAvecActions({ vIdx, onPresenter, onControle }: { vIdx: number; onPresenter: () => void; onControle: () => void }) {
  const v = VEHICULES_USAGER[vIdx];
  const [msg, setMsg] = useState("");
  useEffect(() => setMsg(""), [vIdx]);
  const verifier = async () => {
    setMsg("Vérification en cours…");
    const r = await verificationService.verifier(QR_MATRICES[v.qrId].payload);
    window.setTimeout(() => setMsg(
      r.statut === "reconnu" ? "Titre valide et à jour."
        : r.statut === "signale" ? "Titre signalé." : "Vérification non concluante.",
    ), 500);
  };
  return (
    <>
      <CarteGriseMobile final vehicule={v} onVerifier={verifier} onControle={onControle} verifMessage={msg} />
      <div style={{ padding: "0 14px 14px" }}>
        <button className="btn secondary" type="button" style={{ width: "100%" }} onClick={onPresenter}><LuQrCode /> Afficher le QR en grand</button>
      </div>
    </>
  );
}
