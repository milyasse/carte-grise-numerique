import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuArrowLeft, LuArrowRightLeft, LuBell, LuChevronRight, LuCircleCheck, LuFilePlus, LuFingerprint, LuFolderOpen,
  LuHouse, LuIdCard, LuInfo, LuListChecks, LuLoaderCircle, LuLogOut, LuQrCode, LuRotateCw, LuScanLine,
  LuShieldAlert, LuShieldCheck, LuSiren, LuX,
} from "react-icons/lu";
import { AgentScanner } from "../components/demo/AgentScanner";
import { Demarches, ETAPES_SUIVI, type Dossier } from "../components/demo/Demarches";
import { LogoNarsa } from "../components/LogoNarsa";
import { PlaqueMaroc } from "../components/PlaqueMaroc";
import { QrCode } from "../components/QrCode";
import { Arc, Frise, Rosace, ZelligeFond } from "../components/MotifsMarocains";
import { USAGER, VEHICULES_USAGER, type VehiculeDemo } from "../data/demo";
import { QR_MATRICES } from "../data/qr";
import { ModeFinal } from "../hooks/modeFinal";
import { useLocalState } from "../hooks/useLocalState";
import { verificationService } from "../services/verification";

type Ecran = "accueil" | "carte" | "demarches" | "controle";
type Phase = "splash" | "connexion" | "app";

const NAV: { id: Ecran; label: string; icon: IconType }[] = [
  { id: "accueil", label: "Accueil", icon: LuHouse },
  { id: "carte", label: "Ma carte", icon: LuIdCard },
  { id: "demarches", label: "Démarches", icon: LuFolderOpen },
  { id: "controle", label: "Contrôle", icon: LuSiren },
];

const TITRES: Record<Ecran, string> = { accueil: "", carte: "Ma carte grise", demarches: "Démarches", controle: "Contrôle routier" };

/** Application mobile « Carte grise numérique » (maquette). Plein écran sur téléphone, cadre de smartphone sur ordinateur. */
export function AppMobile({ onQuit }: { onQuit: () => void }) {
  const [phase, setPhase] = useState<Phase>("splash");
  const [ecran, setEcran] = useState<Ecran>("accueil");
  const [vIdx, setVIdx] = useState(0);
  const [qrPlein, setQrPlein] = useState(false);
  const [toast, setToast] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "splash") return;
    const t = window.setTimeout(() => setPhase("connexion"), 2100);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [ecran]);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const v = VEHICULES_USAGER[vIdx];
  const ouvrirCarte = (i: number) => { setVIdx(i); setEcran("carte"); };

  return (
    <ModeFinal.Provider value={true}>
      <div className="app-stage">
        <aside className="app-aside">
          <button className="btn ghost sm" type="button" onClick={onQuit}><LuArrowLeft /> Retour à la présentation</button>
          <div>
            <span className="eyebrow">Maquette de l’application</span>
            <h2 style={{ marginTop: 6 }}>Carte grise numérique</h2>
            <p className="muted" style={{ marginTop: 8 }}>
              Connexion par identité numérique, carte grise dans le téléphone, QR code à présenter,
              duplicata et mutation en ligne. L’onglet Contrôle montre l’écran de l’agent.
            </p>
          </div>
          <ul className="app-aside-tips">
            <li><LuRotateCw /> Touchez la carte pour la retourner</li>
            <li><LuQrCode /> Le bouton central affiche le QR code</li>
            <li><LuSiren /> L’onglet Contrôle scanne le QR</li>
          </ul>
          <div className="notice warn"><LuInfo /> Maquette du projet. Personnes et véhicules fictifs. Application non officielle, non connectée aux systèmes de la NARSA.</div>
        </aside>

        <div className="app-device">
          <div className="app-shell">
            <div className="app-demo-bar"><span>Maquette du projet · données fictives</span><button type="button" onClick={onQuit} aria-label="Quitter l’application"><LuX /></button></div>

            {phase === "splash" && <Splash />}
            {phase === "connexion" && <Connexion onOk={() => { setPhase("app"); setToast(`Bienvenue, ${USAGER.prenom}`); }} />}

            {phase === "app" && (
              <>
                {ecran !== "accueil" && (
                  <header className="app-top">
                    <button type="button" className="app-icon-btn" onClick={() => setEcran("accueil")} aria-label="Retour à l’accueil"><LuArrowLeft /></button>
                    <strong>{TITRES[ecran]}</strong>
                    <span style={{ width: 38 }} aria-hidden="true" />
                  </header>
                )}

                <div className="app-scroll" ref={scrollRef}>
                  <div className="screen-in" key={ecran}>
                    {ecran === "accueil" && (
                      <Accueil
                        vIdx={vIdx}
                        setVIdx={setVIdx}
                        onCarte={ouvrirCarte}
                        onGo={setEcran}
                        onQr={() => setQrPlein(true)}
                        onLogout={() => { setPhase("connexion"); setEcran("accueil"); }}
                      />
                    )}
                    {ecran === "carte" && (
                      <EcranCarte vIdx={vIdx} setVIdx={setVIdx} onQr={() => setQrPlein(true)} onToast={setToast} onControle={() => setEcran("controle")} />
                    )}
                    {ecran === "demarches" && (
                      <div className="app-pad app-flat"><Demarches connecte onVoirCarte={() => setEcran("carte")} /></div>
                    )}
                    {ecran === "controle" && (
                      <div className="app-pad"><AgentScanner initialScenario="valide" final /></div>
                    )}
                  </div>
                </div>

                <nav className="app-nav2" aria-label="Navigation de l’application">
                  {NAV.slice(0, 2).map((n) => <NavBtn key={n.id} n={n} actif={ecran === n.id} onClick={() => setEcran(n.id)} />)}
                  <button type="button" className="app-fab" onClick={() => setQrPlein(true)} aria-label="Afficher mon QR code">
                    <LuQrCode />
                  </button>
                  {NAV.slice(2).map((n) => <NavBtn key={n.id} n={n} actif={ecran === n.id} onClick={() => setEcran(n.id)} />)}
                </nav>

                {qrPlein && <QrPlein v={v} onClose={() => setQrPlein(false)} />}
                {toast && <div className="app-toast" role="status"><LuCircleCheck /> {toast}</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </ModeFinal.Provider>
  );
}

function NavBtn({ n, actif, onClick }: { n: (typeof NAV)[number]; actif: boolean; onClick: () => void }) {
  const I = n.icon;
  return (
    <button type="button" className="app-nav-btn" aria-current={actif ? "page" : undefined} onClick={onClick}>
      <span className="app-nav-ico"><I /></span>
      <span>{n.label}</span>
    </button>
  );
}

function Splash() {
  return (
    <div className="app-splash2">
      <div className="splash-rings" aria-hidden="true"><span /><span /><span /></div>
      <div className="splash-mark"><LuIdCard /></div>
      <h1 className="splash-title">Carte grise<br />numérique</h1>
      <p className="ar splash-ar" lang="ar">البطاقة الرمادية الرقمية</p>
      <div className="splash-bar" aria-hidden="true"><span /></div>
    </div>
  );
}

function Connexion({ onOk }: { onOk: () => void }) {
  const [etape, setEtape] = useState(0);
  const t = useRef<number[]>([]);
  useEffect(() => () => t.current.forEach(clearTimeout), []);
  const lancer = () => {
    setEtape(1);
    t.current.push(window.setTimeout(() => setEtape(2), 1000));
    t.current.push(window.setTimeout(() => setEtape(3), 1800));
    t.current.push(window.setTimeout(onOk, 2400));
  };
  const textes = ["Touchez pour vous identifier", "Connexion au service d’identité numérique…", "Identité vérifiée", "Ouverture de votre espace…"];
  return (
    <div className="app-login2">
      <div className="login-hero">
        <div className="login-pattern" aria-hidden="true" />
        <LogoNarsa size={40} variant="light" />
        <h2>Bienvenue</h2>
        <p>Votre carte grise et vos démarches, au même endroit.</p>
      </div>
      <div className="login-body">
        <button type="button" className={`finger ${etape > 0 ? "busy" : ""} ${etape >= 2 ? "ok" : ""}`} onClick={lancer} disabled={etape > 0} aria-label="Se connecter avec l’identité numérique">
          <span className="finger-pulse" aria-hidden="true" />
          <span className="finger-pulse d2" aria-hidden="true" />
          {etape >= 2 ? <LuCircleCheck /> : <LuFingerprint />}
        </button>
        <p className="login-state" role="status">{textes[etape]}</p>
        <button className="btn" type="button" onClick={lancer} disabled={etape > 0} style={{ width: "100%" }}>
          {etape > 0 && etape < 2 ? <LuLoaderCircle className="spin" /> : <LuShieldCheck />} Se connecter avec l’identité numérique
        </button>
        <ul className="login-features">
          <li><LuIdCard /> Carte grise toujours sur vous</li>
          <li><LuQrCode /> Contrôle rapide par QR code</li>
          <li><LuFolderOpen /> Duplicata et mutation en ligne</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Carte au format ID-1, recto : véhicule ; verso : QR code.
 * Le retournement se fait en deux demi-tours (0° → 90°, changement de face, -90° → 0°) :
 * une seule face est affichée à la fois, le texte n'apparaît donc jamais en miroir.
 */
function CarteNumerique({ v, flippable = false, retournee = false, onFlip }: { v: VehiculeDemo; flippable?: boolean; retournee?: boolean; onFlip?: () => void }) {
  const valide = v.statut === "valide";
  const [face, setFace] = useState(retournee);
  const [stade, setStade] = useState<"repos" | "sortie" | "entree">("repos");

  useEffect(() => {
    if (retournee === face) return;
    const reduit = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduit) { setFace(retournee); return; }
    setStade("sortie");
    const t = window.setTimeout(() => {
      setFace(retournee);
      setStade("entree");
    }, 230);
    return () => clearTimeout(t);
  }, [retournee, face]);

  useEffect(() => {
    if (stade !== "entree") return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setStade("repos")); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [stade]);

  const recto = (
    <span className="dcard-face dcard-front mz-front">
      <ZelligeFond />
      <Rosace className="mz-rosace" />
      <span className="dcard-sheen" aria-hidden="true" />
      <span className="mz-head">
        <span className="mz-fr">
          <strong>Carte grise</strong>
          <span>numérique</span>
        </span>
        <span className={`dcard-status ${valide ? "ok" : "ko"}`}>{valide ? <LuShieldCheck /> : <LuShieldAlert />}{valide ? "Valide" : "Signalé"}</span>
        <span className="mz-ar" lang="ar">البطاقة الرمادية<br />الرقمية</span>
      </span>
      <Frise />
      <span className="mz-arch-zone">
        <Arc className="mz-arc" />
        <span className="mz-plate"><PlaqueMaroc plaque={v.plaque} /></span>
      </span>
      <span className="dcard-row dcard-bottom">
        <span>
          <span className="dcard-label">Véhicule · <span lang="ar">المركبة</span></span>
          <span className="dcard-val">{v.marque} {v.modele}</span>
        </span>
        <span style={{ textAlign: "right" }}>
          <span className="dcard-label">N° de titre</span>
          <span className="dcard-val mono">{v.numeroTitre}</span>
        </span>
      </span>
    </span>
  );
  const verso = (
    <span className="dcard-face dcard-back mz-back">
      <ZelligeFond couleur="#124a8c" opacite={0.1} taille={30} />
      <span className="mz-qr-arch">
        <Arc className="mz-arc" couleur="#c9a227" />
        <span className="dcard-qr"><QrCode id={v.qrId} /></span>
      </span>
      <span className="dcard-back-txt">
        <span className="mz-ar dark" lang="ar">قدّم هذا الرمز لعون المراقبة</span>
        <strong>{v.titulaire}</strong>
        <span>Présentez ce QR code à l’agent</span>
        <span className="mz-back-plate"><PlaqueMaroc plaque={v.plaque} size="sm" /></span>
      </span>
    </span>
  );
  const contenu = <span className={`dcard-inner stade-${stade}`}>{face ? verso : recto}</span>;

  if (flippable) {
    return (
      <button
        type="button"
        className="dcard flippable"
        onClick={onFlip}
        aria-label={retournee ? "Afficher le recto de la carte" : "Retourner la carte pour afficher le QR code"}
      >
        {contenu}
      </button>
    );
  }
  return <div className="dcard">{contenu}</div>;
}

function Accueil({ vIdx, setVIdx, onCarte, onGo, onQr, onLogout }: {
  vIdx: number; setVIdx: (i: number) => void; onCarte: (i: number) => void; onGo: (e: Ecran) => void; onQr: () => void; onLogout: () => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [dossiers] = useLocalState<Dossier[]>("cgn-demo-dossiers-v2", []);
  const salut = new Date().getHours() < 18 ? "Bonjour" : "Bonsoir";

  const pas = () => {
    const el = railRef.current;
    const slot = el?.querySelector<HTMLElement>(".wallet-slot");
    return slot ? slot.offsetWidth + 12 : 1;
  };
  const onScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / pas());
    if (i !== vIdx && i >= 0 && i < VEHICULES_USAGER.length) setVIdx(i);
  };
  const allerA = (i: number) => {
    railRef.current?.scrollTo({ left: i * pas(), behavior: "smooth" });
    setVIdx(i);
  };

  const ACTIONS: { icon: IconType; label: string; tone: string; onClick: () => void }[] = [
    { icon: LuQrCode, label: "Mon QR code", tone: "t1", onClick: onQr },
    { icon: LuFilePlus, label: "Duplicata", tone: "t2", onClick: () => onGo("demarches") },
    { icon: LuArrowRightLeft, label: "Mutation", tone: "t3", onClick: () => onGo("demarches") },
    { icon: LuListChecks, label: "Mes dossiers", tone: "t4", onClick: () => onGo("demarches") },
  ];

  return (
    <div className="home">
      <div className="home-head">
        <div className="home-pattern" aria-hidden="true" />
        <div className="home-top">
          <div className="home-avatar" aria-hidden="true">{USAGER.prenom[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="home-hello">{salut},</span>
            <strong className="home-name">{USAGER.prenom}</strong>
          </div>
          <button type="button" className="home-ico" aria-label="Notifications"><LuBell /><span className="home-dot" /></button>
          <button type="button" className="home-ico" aria-label="Se déconnecter" onClick={onLogout}><LuLogOut /></button>
        </div>
        <p className="home-sub">{VEHICULES_USAGER.length} véhicules · cartes grises à jour</p>
      </div>

      <div className="wallet">
        <div className="wallet-rail" ref={railRef} onScroll={onScroll}>
          {VEHICULES_USAGER.map((v, i) => (
            <div className="wallet-slot" key={v.immatriculation} style={{ animationDelay: `${120 + i * 90}ms` }}>
              <button type="button" className="wallet-open" onClick={() => onCarte(i)} aria-label={`Ouvrir la carte grise ${v.marque} ${v.modele}`}>
                <CarteNumerique v={v} />
              </button>
            </div>
          ))}
        </div>
        <div className="wallet-dots" role="tablist" aria-label="Choisir une carte">
          {VEHICULES_USAGER.map((v, i) => (
            <button key={v.immatriculation} type="button" role="tab" aria-selected={i === vIdx} aria-label={`${v.marque} ${v.modele}`} onClick={() => allerA(i)} />
          ))}
        </div>
      </div>

      <section className="home-sec">
        <h3 className="app-h">Accès rapide</h3>
        <div className="quick">
          {ACTIONS.map((a, i) => {
            const I = a.icon;
            return (
              <button key={a.label} type="button" className="quick-btn" onClick={a.onClick} style={{ animationDelay: `${200 + i * 60}ms` }}>
                <span className={`quick-ico ${a.tone}`}><I /></span>
                <span>{a.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="home-sec">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 className="app-h">Activité récente</h3>
          <button type="button" className="link-btn" onClick={() => onGo("demarches")}>Tout voir</button>
        </div>
        <div className="activity">
          {dossiers.slice(0, 3).map((d) => (
            <button key={d.ref} type="button" className="act-item" onClick={() => onGo("demarches")}>
              <span className={`act-ico ${d.etape === 4 ? "done" : d.etape === 2 && !d.piecesTransmises ? "warn" : ""}`}>
                {d.type === "Duplicata" ? <LuFilePlus /> : <LuArrowRightLeft />}
              </span>
              <span className="act-txt">
                <strong>{d.type} · <span className="mono">{d.ref}</span></strong>
                <span>{ETAPES_SUIVI[d.etape].titre}</span>
                <span className="act-bar" aria-hidden="true"><span style={{ width: `${((d.etape + 1) / 5) * 100}%` }} /></span>
              </span>
              <LuChevronRight className="act-chev" />
            </button>
          ))}
          <button type="button" className="act-item" onClick={() => onCarte(0)}>
            <span className="act-ico done"><LuShieldCheck /></span>
            <span className="act-txt">
              <strong>Carte grise vérifiée</strong>
              <span>{VEHICULES_USAGER[0].marque} {VEHICULES_USAGER[0].modele} · titre en règle</span>
            </span>
            <LuChevronRight className="act-chev" />
          </button>
        </div>
      </section>
    </div>
  );
}

function EcranCarte({ vIdx, setVIdx, onQr, onToast, onControle }: {
  vIdx: number; setVIdx: (i: number) => void; onQr: () => void; onToast: (s: string) => void; onControle: () => void;
}) {
  const v = VEHICULES_USAGER[vIdx];
  const [retournee, setRetournee] = useState(false);
  const [verif, setVerif] = useState(false);
  useEffect(() => setRetournee(false), [vIdx]);

  const verifier = async () => {
    setVerif(true);
    const r = await verificationService.verifier(QR_MATRICES[v.qrId].payload);
    window.setTimeout(() => {
      setVerif(false);
      onToast(r.statut === "reconnu" ? "Titre valide et à jour" : r.statut === "signale" ? "Titre signalé" : "Vérification non concluante");
    }, 700);
  };

  return (
    <div className="app-pad carte-screen">
      <div className="seg-plates" role="group" aria-label="Véhicule">
        {VEHICULES_USAGER.map((x, i) => (
          <button key={x.immatriculation} type="button" aria-pressed={i === vIdx} onClick={() => setVIdx(i)}>
            {x.marque} {x.modele}
          </button>
        ))}
      </div>

      <div className="carte-stage" key={v.immatriculation}>
        <CarteNumerique v={v} flippable retournee={retournee} onFlip={() => setRetournee((r) => !r)} />
        <p className="flip-hint"><LuRotateCw /> Touchez la carte pour {retournee ? "revenir au recto" : "afficher le QR code"}</p>
      </div>

      <div className="carte-actions">
        <button type="button" className="ca-btn" onClick={onQr}><span className="quick-ico t1"><LuQrCode /></span>QR plein écran</button>
        <button type="button" className="ca-btn" onClick={verifier} disabled={verif}>
          <span className="quick-ico t2">{verif ? <LuLoaderCircle className="spin" /> : <LuShieldCheck />}</span>{verif ? "Vérification…" : "Vérifier"}
        </button>
        <button type="button" className="ca-btn" onClick={onControle}><span className="quick-ico t3"><LuScanLine /></span>Contrôle</button>
      </div>

      <Details titre="Véhicule" lignes={[
        ["Marque", v.marque], ["Modèle", v.modele], ["Genre", v.genre], ["Énergie", v.energie],
        ["Puissance fiscale", v.puissanceFiscale], ["Couleur", v.couleur], ["1re mise en circulation", v.premiereCirculation],
      ]} />
      <Details titre="Titre" lignes={[
        ["N° de titre", v.numeroTitre], ["Délivré le", v.dateDelivrance], ["Titulaire", v.titulaire], ["Statut", v.statut === "valide" ? "En circulation" : "Titre signalé"],
      ]} />
    </div>
  );
}

function Details({ titre, lignes }: { titre: string; lignes: [string, string][] }) {
  return (
    <section className="details">
      <h3 className="app-h">{titre}</h3>
      <dl>
        {lignes.map(([k, val]) => (
          <div key={k} className="details-row"><dt>{k}</dt><dd>{val}</dd></div>
        ))}
      </dl>
    </section>
  );
}

function QrPlein({ v, onClose }: { v: VehiculeDemo; onClose: () => void }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { clearInterval(t); window.removeEventListener("keydown", onKey); };
  }, [onClose]);
  return (
    <div className="qr-sheet-back" onClick={onClose}>
      <div className="qr-sheet" role="dialog" aria-modal="true" aria-label="Mon QR code" onClick={(e) => e.stopPropagation()}>
        <span className="qr-grab" aria-hidden="true" />
        <div className="qr-sheet-head">
          <strong>Présentez ce code à l’agent</strong>
          <button type="button" className="app-icon-btn" onClick={onClose} aria-label="Fermer"><LuX /></button>
        </div>
        <div className="qr-live">
          <div className="qr-live-inner"><QrCode id={v.qrId} /></div>
        </div>
        <PlaqueMaroc plaque={v.plaque} />
        <p className="qr-meta">{v.marque} {v.modele} · {v.titulaire}</p>
        <p className="qr-clock"><span className="live-dot" /> Code actif · <span className="mono">{now.toLocaleTimeString("fr-FR")}</span></p>
      </div>
    </div>
  );
}
