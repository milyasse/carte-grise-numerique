import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";
import {
  LuArrowLeft, LuBell, LuCar, LuCheck, LuChevronDown, LuChevronRight, LuCircleCheck, LuCircleHelp, LuCircleX,
  LuClipboardPen, LuCopy, LuDownload, LuFileCheck2, LuFilePen, LuFileText, LuFolderOpen, LuHouse, LuIdCard, LuInfo,
  LuLoaderCircle, LuLogOut, LuMenu, LuPalette, LuPlus, LuPrinter, LuQrCode, LuReceipt, LuScanLine, LuSettings,
  LuShare2, LuShieldCheck, LuTriangleAlert, LuUser, LuUserPen, LuWrench, LuX,
} from "react-icons/lu";
import { Demarches } from "../components/demo/Demarches";
import { QrCode } from "../components/QrCode";
import { Marque } from "../components/Marque";
import { textePlaque, type Plaque } from "../data/demo";
import { QR_MATRICES } from "../data/qr";
import { ModeFinal } from "../hooks/modeFinal";
import { verificationService, type ResultatVerification } from "../services/verification";

/* ---------- Données fictives propres à la v2 ---------- */

const PROFIL = { nom: "El Mehdi El Alaoui", email: "el.mehdi@exemple.ma" };

const VEHICULE = {
  marque: "Peugeot", modele: "308", genre: "VP", type: "Véhicule particulier", carrosserie: "Berline",
  couleur: "Gris métallisé", chassis: "VF3•••••••••123456", puissance: "7 CV", energie: "Essence",
  circulation: "15/06/2021", titre: "CG-2021-004512", delivrance: "18/06/2021",
  plaque: { numero: "12345", lettre: "أ", region: "6" } as Plaque, qrId: "valide",
};

type StatutDem = "En cours" | "Traitement" | "Terminée";
interface Demarche { id: string; titre: string; ref: string; statut: StatutDem; date: string; icon: IconType; etape: number }

const DEMARCHES_INIT: Demarche[] = [
  { id: "d1", titre: "Immatriculation d’un véhicule", ref: "#2026-014578", statut: "En cours", date: "22/10/2026", icon: LuClipboardPen, etape: 1 },
  { id: "d2", titre: "Changement de titulaire", ref: "#2026-012346", statut: "En cours", date: "18/10/2026", icon: LuUserPen, etape: 1 },
  { id: "d3", titre: "Duplicata de carte grise", ref: "#2026-009876", statut: "Traitement", date: "13/10/2026", icon: LuFileText, etape: 2 },
  { id: "d4", titre: "Modification des données", ref: "#2026-008732", statut: "Terminée", date: "08/10/2026", icon: LuFilePen, etape: 4 },
];

const ETAPES = ["Demande déposée", "En cours d’instruction", "Traitement du titre", "Validation", "Document disponible"];

const DOCUMENTS: { titre: string; date: string; icon: IconType; detail: string }[] = [
  { titre: "Carte grise numérique", date: "15/06/2021", icon: LuIdCard, detail: "Certificat d’immatriculation · Peugeot 308" },
  { titre: "Attestation d’assurance", date: "12/03/2026", icon: LuShieldCheck, detail: "Valable jusqu’au 11/03/2027" },
  { titre: "Contrôle technique", date: "08/01/2026", icon: LuWrench, detail: "Favorable · prochain contrôle 08/01/2027" },
  { titre: "Quittance de paiement", date: "05/02/2026", icon: LuReceipt, detail: "Taxe annuelle 2026 · réglée" },
];

type Ecran = "accueil" | "carte" | "detail" | "verif" | "demarches" | "documents" | "profil" | "charte";
const NAV: { id: Ecran; label: string; icon: IconType }[] = [
  { id: "accueil", label: "Accueil", icon: LuHouse },
  { id: "carte", label: "Carte grise", icon: LuIdCard },
  { id: "demarches", label: "Démarches", icon: LuFolderOpen },
  { id: "profil", label: "Profil", icon: LuUser },
];
const TITRES: Record<Ecran, string> = {
  accueil: "", carte: "Ma carte grise", detail: "Carte grise numérique", verif: "Vérification par QR code",
  demarches: "Mes démarches", documents: "Mes documents", profil: "Mon profil", charte: "Charte graphique",
};
const PARENT: Partial<Record<Ecran, Ecran>> = { detail: "carte", verif: "accueil", documents: "accueil", charte: "profil" };

/* ---------- Application ---------- */

export function AppV2({ onQuit, onV1 }: { onQuit: () => void; onV1: () => void }) {
  const [ecran, setEcran] = useState<Ecran>("accueil");
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [langue, setLangue] = useState<"fr" | "ar">("fr");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [ecran]);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const go = (e: Ecran) => { setEcran(e); setMenu(false); };
  const navActif: Ecran = ecran === "detail" ? "carte" : ecran === "charte" ? "profil" : ecran;

  return (
    <ModeFinal.Provider value={true}>
      <div className="app-stage v2">
        <aside className="app-aside">
          <button className="btn ghost sm" type="button" onClick={onQuit}><LuArrowLeft /> Retour à la présentation</button>
          <div>
            <span className="eyebrow">Maquette · version 2</span>
            <h2 style={{ marginTop: 6 }}>Ma carte grise numérique</h2>
            <p className="muted" style={{ marginTop: 8 }}>
              Accueil, carte grise compacte et détaillée, vérification par QR code, démarches, documents et profil.
              Ouvrez le menu (☰) pour la charte graphique.
            </p>
          </div>
          <button className="btn secondary sm" type="button" onClick={onV1}>Voir la version 1</button>
          <div className="notice warn"><LuInfo /> Maquette du projet. Personnes et véhicules fictifs. Application non officielle, non connectée aux systèmes de la NARSA.</div>
        </aside>

        <div className="app-device">
          <div className="app-shell v2-shell">
            <div className="app-demo-bar"><span>Maquette du projet · données fictives</span><button type="button" onClick={onQuit} aria-label="Quitter l’application"><LuX /></button></div>

            {ecran !== "accueil" && (
              <header className="v2-top">
                <button type="button" className="v2-top-btn" onClick={() => go(PARENT[ecran] ?? "accueil")} aria-label="Retour"><LuArrowLeft /></button>
                <h1>{TITRES[ecran]}</h1>
                {ecran === "profil"
                  ? <button type="button" className="v2-top-btn" onClick={() => go("charte")} aria-label="Paramètres d’affichage"><LuSettings /></button>
                  : <button type="button" className="v2-top-btn" onClick={() => setMenu(true)} aria-label="Ouvrir le menu"><LuMenu /></button>}
              </header>
            )}

            <div className={`v2-scroll ${ecran === "accueil" ? "home" : ""}`} ref={scrollRef}>
              <div className="screen-in" key={ecran}>
                {ecran === "accueil" && <Accueil go={go} onMenu={() => setMenu(true)} langue={langue} setLangue={setLangue} onToast={setToast} />}
                {ecran === "carte" && <MaCarte go={go} onToast={setToast} />}
                {ecran === "detail" && <Detail onToast={setToast} />}
                {ecran === "verif" && <Verification />}
                {ecran === "demarches" && <MesDemarches onToast={setToast} />}
                {ecran === "documents" && <MesDocuments go={go} />}
                {ecran === "profil" && <Profil go={go} onQuit={onQuit} />}
                {ecran === "charte" && <Charte />}
              </div>
            </div>

            <nav className="v2-nav" aria-label="Navigation">
              {NAV.map((n) => {
                const I = n.icon;
                return (
                  <button key={n.id} type="button" aria-current={navActif === n.id ? "page" : undefined} onClick={() => go(n.id)}>
                    <I /><span>{n.label}</span>
                  </button>
                );
              })}
            </nav>

            {menu && <Menu ecran={ecran} go={go} onClose={() => setMenu(false)} langue={langue} setLangue={(l) => { setLangue(l); if (l === "ar") setToast("La version arabe sera disponible dans l’application finale"); }} onQuit={onQuit} />}
            {toast && <div className="app-toast" role="status"><LuCircleCheck /> {toast}</div>}
          </div>
        </div>
      </div>
    </ModeFinal.Provider>
  );
}

/* ---------- Éléments communs ---------- */

function PlaqueTexte({ p }: { p: Plaque }) {
  return <span className="v2-plaque" dir="ltr">{p.numero}<i>|</i><b lang="ar">{p.lettre}</b><i>|</i>{p.region}</span>;
}

function Voiture({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 110" aria-hidden="true">
      <ellipse cx="110" cy="98" rx="96" ry="7" fill="rgba(15,40,80,.18)" />
      <path d="M18 78 C18 64 26 58 44 54 L66 34 C72 28 80 26 92 26 L140 26 C152 26 160 30 168 38 L186 54 C200 56 206 62 206 74 L206 84 C206 88 203 90 199 90 L24 90 C20 90 18 88 18 84 Z" fill="#3b4656" />
      <path d="M70 38 C74 33 80 31 90 31 L112 31 L112 54 L52 54 Z" fill="#9fc3e6" />
      <path d="M118 31 L140 31 C150 31 156 34 162 40 L176 54 L118 54 Z" fill="#9fc3e6" />
      <path d="M22 70 L46 66 L44 74 L22 76 Z" fill="#f2f5f9" />
      <path d="M204 68 L184 66 L186 74 L204 75 Z" fill="#c62828" opacity=".85" />
      <rect x="18" y="80" width="188" height="4" fill="#2a3340" />
      <circle cx="58" cy="88" r="15" fill="#1f2632" /><circle cx="58" cy="88" r="7" fill="#aab4c2" />
      <circle cx="166" cy="88" r="15" fill="#1f2632" /><circle cx="166" cy="88" r="7" fill="#aab4c2" />
      <path d="M44 56 L200 58" stroke="rgba(255,255,255,.25)" strokeWidth="2" />
    </svg>
  );
}

function Hero() {
  return (
    <svg className="v2-hero-art" viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1769aa" stopOpacity="0" /><stop offset="1" stopColor="#f6d58a" stopOpacity=".55" /></linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#sky)" />
      <g fill="#e9d6b3" opacity=".9">
        <rect x="300" y="40" width="26" height="120" />
        <rect x="304" y="28" width="18" height="14" />
        <rect x="309" y="16" width="8" height="12" />
        <circle cx="313" cy="13" r="3" />
        <rect x="236" y="110" width="50" height="50" /><rect x="190" y="124" width="44" height="36" /><rect x="334" y="118" width="60" height="42" />
      </g>
      <g fill="#2f6b47" opacity=".85">
        <path d="M40 160 L44 96 L48 160 Z" /><path d="M44 96 c-16 -6 -30 2 -34 10 c12 -6 22 -6 34 -10 z M44 96 c16 -6 30 2 34 10 c-12 -6 -22 -6 -34 -10 z M44 96 c-8 -12 -22 -14 -30 -10 c10 0 20 4 30 10 z M44 96 c8 -12 22 -14 30 -10 c-10 0 -20 4 -30 10 z" />
        <path d="M368 160 L371 110 L374 160 Z" /><path d="M371 110 c-12 -5 -24 1 -28 8 c10 -5 18 -5 28 -8 z M371 110 c12 -5 24 1 28 8 c-10 -5 -18 -5 -28 -8 z" />
      </g>
      <rect y="158" width="400" height="62" fill="#c9d3dd" />
      <rect y="186" width="400" height="3" fill="#ffffff" opacity=".8" />
    </svg>
  );
}

function Badge({ children, tone = "ok" }: { children: ReactNode; tone?: "ok" | "info" | "warn" | "done" }) {
  return <span className={`v2-badge ${tone}`}>{children}</span>;
}

/* ---------- Écrans ---------- */

function Accueil({ go, onMenu, langue, setLangue, onToast }: { go: (e: Ecran) => void; onMenu: () => void; langue: "fr" | "ar"; setLangue: (l: "fr" | "ar") => void; onToast: (s: string) => void }) {
  return (
    <div className="v2-home">
      <section className="v2-hero">
        <div className="v2-hero-top">
          <button type="button" className="v2-round" onClick={onMenu} aria-label="Ouvrir le menu"><LuMenu /></button>
          <Marque clair />
          <button type="button" className="v2-round" onClick={() => onToast("Aucune nouvelle notification")} aria-label="Notifications"><LuBell /><span className="v2-dot" /></button>
          <button type="button" className="v2-lang" onClick={() => { const l = langue === "fr" ? "ar" : "fr"; setLangue(l); if (l === "ar") onToast("La version arabe sera disponible dans l’application finale"); }} aria-label="Changer de langue">
            {langue === "fr" ? "FR" : "ع"} <LuChevronDown />
          </button>
        </div>
        <h2 className="v2-hero-title">Ma carte grise<br />numérique</h2>
        <p className="v2-hero-sub">Votre véhicule, vos documents,<br />en toute sécurité.</p>
        <Hero />
        <Voiture className="v2-hero-car" />
      </section>

      <div className="v2-home-body">
        <button type="button" className="v2-veh" onClick={() => go("carte")}>
          <span className="v2-veh-ico"><LuCar /></span>
          <span className="v2-veh-txt"><strong>{VEHICULE.marque} {VEHICULE.modele}</strong><PlaqueTexte p={VEHICULE.plaque} /></span>
          <Badge>Valide</Badge>
          <LuChevronRight className="v2-chev" />
        </button>

        <button type="button" className="v2-cta" onClick={() => go("carte")}>Consulter ma carte grise <LuChevronRight /></button>

        <div className="v2-tiles">
          <button type="button" onClick={() => go("demarches")}><LuFileText /><span>Mes démarches</span></button>
          <button type="button" onClick={() => go("verif")}><LuQrCode /><span>Vérifier par QR</span></button>
          <button type="button" onClick={() => go("documents")}><LuFileCheck2 /><span>Mes documents</span></button>
        </div>

        <div className="v2-banner"><LuShieldCheck /><span>La sécurité routière<br />est l’affaire de tous</span></div>
      </div>
    </div>
  );
}

function EnteteCarte({ titre, sousTitre }: { titre: string; sousTitre?: string }) {
  return (
    <div className="v2-cert-head">
      <div className="v2-cert-org">
        <span>Agence nationale de la<br />sécurité routière</span>
        <span className="ar" lang="ar">الوكالة الوطنية<br />للسلامة الطرقية</span>
      </div>
      <strong className="v2-cert-title">{titre}</strong>
      {sousTitre && <span className="v2-cert-sub">{sousTitre}</span>}
    </div>
  );
}

function MaCarte({ go, onToast }: { go: (e: Ecran) => void; onToast: (s: string) => void }) {
  return (
    <div className="v2-pad v2-stack">
      <article className="v2-gcard">
        <div className="v2-gcard-head">
          <EnteteCarte titre="Carte grise numérique" />
          <Badge>Valide</Badge>
        </div>
        <div className="v2-gcard-veh">
          <div className="v2-car-box"><Voiture /></div>
          <div className="v2-gcard-id">
            <strong>{VEHICULE.marque} {VEHICULE.modele}</strong>
            <span><PlaqueTexte p={VEHICULE.plaque} /><CopyBtn texte={textePlaque(VEHICULE.plaque)} onToast={onToast} /></span>
          </div>
        </div>
        <dl className="v2-kv">
          <div><dt>Marque</dt><dd>{VEHICULE.marque}</dd></div>
          <div><dt>Modèle</dt><dd>{VEHICULE.modele}</dd></div>
          <div><dt>Genre</dt><dd>{VEHICULE.genre}</dd></div>
          <div><dt>Type</dt><dd>{VEHICULE.type}</dd></div>
        </dl>
        <div className="v2-two">
          <div><span>Mis en circulation</span><strong>{VEHICULE.circulation}</strong></div>
          <div><span>Puissance fiscale</span><strong>{VEHICULE.puissance}</strong></div>
        </div>
        <button type="button" className="v2-valid" onClick={() => go("verif")}>
          <LuCircleCheck /> <span>Document valide</span> <LuInfo className="v2-valid-i" />
        </button>
        <button type="button" className="v2-outline" onClick={() => go("detail")}>Voir le détail <LuChevronRight /></button>
      </article>
      <div className="v2-dots" aria-hidden="true"><span className="on" /><span /><span /></div>
      <div className="v2-actions2">
        <button type="button" onClick={() => telecharger(onToast)}><LuDownload /> Télécharger</button>
        <button type="button" onClick={() => partager(onToast)}><LuShare2 /> Partager</button>
      </div>
    </div>
  );
}

function CopyBtn({ texte, onToast }: { texte: string; onToast: (s: string) => void }) {
  return (
    <button type="button" className="v2-copy" aria-label="Copier l’immatriculation" onClick={async () => {
      try { await navigator.clipboard.writeText(texte.replace(/‎/g, "")); onToast("Immatriculation copiée"); } catch { onToast(texte); }
    }}><LuCopy /></button>
  );
}

function Detail({ onToast }: { onToast: (s: string) => void }) {
  const [vue, setVue] = useState<"detail" | "compact">("detail");
  return (
    <div className="v2-pad v2-stack">
      <div className="v2-seg" role="group" aria-label="Affichage">
        <button type="button" aria-pressed={vue === "detail"} onClick={() => setVue("detail")}>Vue détaillée</button>
        <button type="button" aria-pressed={vue === "compact"} onClick={() => setVue("compact")}>Vue compacte</button>
      </div>
      <article className="v2-cert print-area" key={vue}>
        <div className="v2-cert-wm" aria-hidden="true" />
        <div className="v2-cert-top">
          <EnteteCarte titre="Certificat d’immatriculation" sousTitre="Carte grise numérique" />
          <div className="v2-cert-qr"><QrCode id={VEHICULE.qrId} /></div>
        </div>
        <div className="v2-cert-sec">
          <span className="v2-lbl">N° d’immatriculation</span>
          <strong className="v2-big"><PlaqueTexte p={VEHICULE.plaque} /></strong>
        </div>
        {vue === "detail" ? (
          <>
            <Sec titre="Véhicule" lignes={[["Marque", VEHICULE.marque], ["Modèle", VEHICULE.modele], ["Genre", VEHICULE.genre], ["Type", VEHICULE.type], ["Carrosserie", VEHICULE.carrosserie], ["Couleur", VEHICULE.couleur]]} />
            <Sec titre="Châssis" lignes={[["N° de châssis", VEHICULE.chassis], ["Puissance fiscale", VEHICULE.puissance], ["Énergie", VEHICULE.energie]]} />
            <Sec titre="Mise en circulation" lignes={[["Date de 1re mise en circulation", VEHICULE.circulation], ["N° de titre", VEHICULE.titre], ["Délivré le", VEHICULE.delivrance], ["Titulaire", PROFIL.nom]]} />
          </>
        ) : (
          <Sec titre="Résumé" lignes={[["Véhicule", `${VEHICULE.marque} ${VEHICULE.modele}`], ["Énergie", VEHICULE.energie], ["Titulaire", PROFIL.nom], ["Statut", "Valide"]]} />
        )}
        <p className="v2-cert-foot">Maquette · données fictives</p>
      </article>
      <div className="v2-actions2">
        <button type="button" onClick={() => telecharger(onToast)}><LuDownload /> Télécharger</button>
        <button type="button" onClick={() => window.print()}><LuPrinter /> Imprimer</button>
      </div>
    </div>
  );
}

function Sec({ titre, lignes }: { titre: string; lignes: [string, string][] }) {
  return (
    <div className="v2-cert-sec">
      <h3>{titre}</h3>
      <dl>{lignes.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </div>
  );
}

function Verification() {
  const [etat, setEtat] = useState<"idle" | "scan" | "fini">("idle");
  const [scenario, setScenario] = useState<"valide" | "signale" | "invalide">("valide");
  const [res, setRes] = useState<ResultatVerification | null>(null);
  const lancer = () => {
    setEtat("scan"); setRes(null);
    window.setTimeout(async () => {
      setRes(await verificationService.verifier(QR_MATRICES[scenario].payload));
      setEtat("fini");
    }, 1800);
  };
  return (
    <div className="v2-pad v2-stack">
      <div className="v2-verif-art">
        <div className={`v2-phone-ico ${etat === "scan" ? "scanning" : ""}`}>
          <LuQrCode />
          <span className="v2-scanline" aria-hidden="true" />
        </div>
        <span className="v2-shield"><LuShieldCheck /></span>
      </div>
      <div style={{ textAlign: "center", display: "grid", gap: 6 }}>
        <h2 className="v2-h2">Simuler un contrôle</h2>
        <p className="muted small">Scannez le QR code présent sur votre carte grise pour vérifier son authenticité.</p>
      </div>
      <div className="v2-seg small" role="group" aria-label="QR code à scanner">
        <button type="button" aria-pressed={scenario === "valide"} onClick={() => setScenario("valide")}>Ma carte</button>
        <button type="button" aria-pressed={scenario === "signale"} onClick={() => setScenario("signale")}>Titre signalé</button>
        <button type="button" aria-pressed={scenario === "invalide"} onClick={() => setScenario("invalide")}>QR inconnu</button>
      </div>
      <button type="button" className="v2-primary" onClick={lancer} disabled={etat === "scan"}>
        {etat === "scan" ? <LuLoaderCircle className="spin" /> : <LuScanLine />} {etat === "scan" ? "Lecture du QR code…" : "Scanner un QR code"}
      </button>
      <div className="v2-info"><LuInfo /><span>Cette fonctionnalité permet de simuler une vérification. Elle ne garantit pas l’authenticité du document.</span></div>

      {res && (
        <section className="v2-stack fade-in">
          <h3 className="v2-h3">Résultat de la vérification</h3>
          {res.statut === "reconnu" && (
            <div className="v2-res ok"><span className="v2-res-ico"><LuCheck /></span><div><strong>Document valide</strong> <span className="muted">(simulation)</span><p>Le document semble authentique et correspond aux informations fournies.</p></div></div>
          )}
          {res.statut === "signale" && (
            <div className="v2-res warn"><span className="v2-res-ico"><LuTriangleAlert /></span><div><strong>Titre signalé</strong> <span className="muted">(simulation)</span><p>{res.motif}</p></div></div>
          )}
          {(res.statut === "inconnu" || res.statut === "format") && (
            <div className="v2-res ko"><span className="v2-res-ico"><LuCircleX /></span><div><strong>QR code non reconnu</strong> <span className="muted">(simulation)</span><p>Vérification non concluante. Rapprochez-vous du service compétent.</p></div></div>
          )}
          {res.statut !== "inconnu" && res.statut !== "format" && (
            <div className="v2-veh flat">
              <span className="v2-veh-ico"><LuCar /></span>
              <span className="v2-veh-txt">
                <strong>{res.vehicule.marque === "Dacia" ? `${VEHICULE.marque} ${VEHICULE.modele}` : `${res.vehicule.marque} ${res.vehicule.modele}`}</strong>
                <PlaqueTexte p={res.vehicule.plaque} />
              </span>
              <LuChevronRight className="v2-chev" />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function MesDemarches({ onToast }: { onToast: (s: string) => void }) {
  const [filtre, setFiltre] = useState<"cours" | "fini" | "tout">("cours");
  const [items, setItems] = useState(DEMARCHES_INIT);
  const [ouvert, setOuvert] = useState<Demarche | null>(null);
  const [nouveau, setNouveau] = useState(false);
  const liste = items.filter((d) => filtre === "tout" || (filtre === "fini" ? d.statut === "Terminée" : d.statut !== "Terminée"));
  const avancer = (d: Demarche) => {
    const etape = Math.min(4, d.etape + 1);
    const statut: StatutDem = etape === 4 ? "Terminée" : etape >= 2 ? "Traitement" : "En cours";
    const maj = { ...d, etape, statut };
    setItems((all) => all.map((x) => (x.id === d.id ? maj : x)));
    setOuvert(maj);
    if (etape === 4) onToast("Démarche terminée");
  };
  return (
    <div className="v2-pad v2-stack">
      <div className="v2-seg" role="tablist" aria-label="Filtrer">
        <button type="button" role="tab" aria-selected={filtre === "cours"} aria-pressed={filtre === "cours"} onClick={() => setFiltre("cours")}>En cours</button>
        <button type="button" role="tab" aria-selected={filtre === "fini"} aria-pressed={filtre === "fini"} onClick={() => setFiltre("fini")}>Terminées</button>
        <button type="button" role="tab" aria-selected={filtre === "tout"} aria-pressed={filtre === "tout"} onClick={() => setFiltre("tout")}>Toutes</button>
      </div>
      <div className="v2-list">
        {liste.map((d) => {
          const I = d.icon;
          return (
            <button key={d.id} type="button" className="v2-row" onClick={() => setOuvert(d)}>
              <span className="v2-row-ico"><I /></span>
              <span className="v2-row-txt">
                <strong>{d.titre}</strong>
                <span>N° de demande : {d.ref}</span>
                <span className="v2-row-meta"><Badge tone={d.statut === "Terminée" ? "done" : d.statut === "Traitement" ? "info" : "ok"}>{d.statut}</Badge><span>{d.date}</span></span>
              </span>
              <LuChevronRight className="v2-chev" />
            </button>
          );
        })}
        {liste.length === 0 && <p className="muted small" style={{ textAlign: "center", padding: 20 }}>Aucune démarche dans cette catégorie.</p>}
      </div>
      <button type="button" className="v2-primary" onClick={() => setNouveau(true)}><LuPlus /> Nouvelle démarche</button>

      {ouvert && (
        <Sheet titre={ouvert.titre} onClose={() => setOuvert(null)}>
          <p className="muted small">N° de demande {ouvert.ref} · déposée le {ouvert.date}</p>
          <ol className="timeline" style={{ marginTop: 6 }}>
            {ETAPES.map((e, i) => (
              <li key={e} className={i < ouvert.etape || ouvert.etape === 4 ? "done" : i === ouvert.etape ? "current" : ""}>
                <span className="tdot">{i < ouvert.etape || ouvert.etape === 4 ? <LuCheck /> : null}</span>
                <div><strong>{e}</strong></div>
              </li>
            ))}
          </ol>
          <button type="button" className="v2-primary" disabled={ouvert.etape >= 4} onClick={() => avancer(ouvert)}>
            {ouvert.etape >= 4 ? "Démarche terminée" : "Simuler l’étape suivante"}
          </button>
        </Sheet>
      )}
      {nouveau && (
        <Sheet titre="Nouvelle démarche" onClose={() => setNouveau(false)}>
          <div className="v2-flat"><Demarches connecte onVoirCarte={() => setNouveau(false)} /></div>
        </Sheet>
      )}
    </div>
  );
}

function MesDocuments({ go }: { go: (e: Ecran) => void }) {
  const [ouvert, setOuvert] = useState<number | null>(null);
  return (
    <div className="v2-pad v2-stack">
      <div className="v2-list">
        {DOCUMENTS.map((d, i) => {
          const I = d.icon;
          return (
            <button key={d.titre} type="button" className="v2-row" onClick={() => (i === 0 ? go("detail") : setOuvert(i))}>
              <span className="v2-row-ico"><I /></span>
              <span className="v2-row-txt"><strong>{d.titre}</strong><span className="v2-row-meta"><Badge>Valide</Badge><span>{d.date}</span></span></span>
              <LuChevronRight className="v2-chev" />
            </button>
          );
        })}
      </div>
      <div className="v2-info"><LuShieldCheck /><span>Vos documents sont sécurisés et disponibles à tout moment.</span></div>
      {ouvert !== null && (
        <Sheet titre={DOCUMENTS[ouvert].titre} onClose={() => setOuvert(null)}>
          <div className="v2-res ok"><span className="v2-res-ico"><LuCheck /></span><div><strong>Document valide</strong><p>{DOCUMENTS[ouvert].detail}</p></div></div>
          <p className="muted small">Émis le {DOCUMENTS[ouvert].date} · véhicule {VEHICULE.marque} {VEHICULE.modele}</p>
        </Sheet>
      )}
    </div>
  );
}

function Profil({ go, onQuit }: { go: (e: Ecran) => void; onQuit: () => void }) {
  const items: { icon: IconType; label: string; to: Ecran }[] = [
    { icon: LuCar, label: "Mes véhicules", to: "carte" },
    { icon: LuFileCheck2, label: "Mes documents", to: "documents" },
    { icon: LuFileText, label: "Mes démarches", to: "demarches" },
    { icon: LuUser, label: "Informations personnelles", to: "profil" },
    { icon: LuPalette, label: "Charte graphique", to: "charte" },
    { icon: LuCircleHelp, label: "Aide & FAQ", to: "profil" },
  ];
  const [info, setInfo] = useState(false);
  return (
    <div className="v2-pad v2-stack">
      <div className="v2-profile">
        <span className="v2-avatar"><LuUser /></span>
        <div><strong>{PROFIL.nom.toUpperCase()}</strong><span>{PROFIL.email}</span></div>
      </div>
      <div className="v2-menu-list">
        {items.map((it) => {
          const I = it.icon;
          return (
            <button key={it.label} type="button" onClick={() => (it.label === "Informations personnelles" || it.label === "Aide & FAQ" ? setInfo(true) : go(it.to))}>
              <I /><span>{it.label}</span><LuChevronRight className="v2-chev" />
            </button>
          );
        })}
      </div>
      <button type="button" className="v2-logout" onClick={onQuit}><LuLogOut /> Se déconnecter</button>
      {info && (
        <Sheet titre="Informations personnelles" onClose={() => setInfo(false)}>
          <dl className="v2-kv">
            <div><dt>Nom</dt><dd>{PROFIL.nom}</dd></div>
            <div><dt>E-mail</dt><dd>{PROFIL.email}</dd></div>
            <div><dt>Connexion</dt><dd>Identité numérique</dd></div>
          </dl>
          <p className="muted small">Profil fictif de la maquette. Aucune donnée réelle n’est enregistrée.</p>
        </Sheet>
      )}
    </div>
  );
}

function Charte() {
  const COULEURS: [string, string, string][] = [
    ["Bleu institutionnel", "#124A8C", "#124a8c"], ["Bleu secondaire", "#1769AA", "#1769aa"], ["Jaune accent", "#F9C522", "#f9c522"],
  ];
  const NEUTRES: [string, string][] = [["Fond", "#F4F7FB"], ["Surface", "#FFFFFF"], ["Texte principal", "#1F2937"], ["Texte secondaire", "#64748B"]];
  return (
    <div className="v2-pad v2-stack">
      <div><h2 className="v2-h2">Charte graphique</h2><p className="muted small">Inspirée de l’identité visuelle de la NARSA</p></div>
      <section className="v2-card-sec">
        <h3 className="v2-h3">Couleurs principales</h3>
        <div className="v2-swatches">{COULEURS.map(([n, h, c]) => <div key={n}><span style={{ background: c }} /><strong>{n}</strong><small className="mono">{h}</small></div>)}</div>
      </section>
      <section className="v2-card-sec">
        <h3 className="v2-h3">Couleurs neutres</h3>
        <div className="v2-swatches four">{NEUTRES.map(([n, h]) => <div key={n}><span style={{ background: h, border: "1px solid var(--c-line)" }} /><strong>{n}</strong><small className="mono">{h}</small></div>)}</div>
      </section>
      <section className="v2-card-sec">
        <h3 className="v2-h3">Typographie</h3>
        <p className="v2-typo"><span style={{ fontFamily: "var(--f2-title)", fontWeight: 600, fontSize: "1.3rem" }}>Poppins</span> · <span style={{ fontFamily: "var(--f2-body)" }}>Inter</span></p>
        <p className="muted small">Titres 600 · Sous-titres 500 · Texte 400</p>
      </section>
      <section className="v2-card-sec">
        <h3 className="v2-h3">Icônes</h3>
        <div className="v2-icons"><LuCar /><LuFileText /><LuShieldCheck /><LuUser /><LuQrCode /></div>
      </section>
      <div className="v2-slogan">Une administration plus proche du citoyen</div>
    </div>
  );
}

function Menu({ ecran, go, onClose, langue, setLangue, onQuit }: { ecran: Ecran; go: (e: Ecran) => void; onClose: () => void; langue: "fr" | "ar"; setLangue: (l: "fr" | "ar") => void; onQuit: () => void }) {
  const items: { icon: IconType; label: string; to: Ecran }[] = [
    { icon: LuHouse, label: "Accueil", to: "accueil" },
    { icon: LuIdCard, label: "Ma carte grise", to: "carte" },
    { icon: LuFileText, label: "Mes démarches", to: "demarches" },
    { icon: LuFileCheck2, label: "Mes documents", to: "documents" },
    { icon: LuQrCode, label: "Vérifier par QR", to: "verif" },
    { icon: LuUser, label: "Mon profil", to: "profil" },
    { icon: LuPalette, label: "Charte graphique", to: "charte" },
  ];
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="v2-drawer-back" onClick={onClose}>
      <nav className="v2-drawer" onClick={(e) => e.stopPropagation()} aria-label="Menu">
        <div className="v2-drawer-head"><Marque /><button type="button" className="v2-top-btn dark" onClick={onClose} aria-label="Fermer le menu"><LuX /></button></div>
        <div className="v2-profile small"><span className="v2-avatar"><LuUser /></span><div><strong>{PROFIL.nom.toUpperCase()}</strong><span>{PROFIL.email}</span></div></div>
        <div className="v2-drawer-list">
          {items.map((it) => {
            const I = it.icon;
            return <button key={it.label} type="button" aria-current={ecran === it.to ? "page" : undefined} onClick={() => go(it.to)}><I /><span>{it.label}</span></button>;
          })}
          <button type="button" onClick={onQuit}><LuLogOut /><span>Se déconnecter</span></button>
        </div>
        <div className="v2-lang-switch" role="group" aria-label="Langue">
          <button type="button" aria-pressed={langue === "fr"} onClick={() => setLangue("fr")}>FR</button>
          <button type="button" aria-pressed={langue === "ar"} onClick={() => setLangue("ar")} lang="ar">عربي</button>
        </div>
        <p className="v2-drawer-foot">Maquette du projet · NARSA · données fictives</p>
      </nav>
    </div>
  );
}

function Sheet({ titre, children, onClose }: { titre: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const cible = document.querySelector(".v2-shell") ?? document.body;
  return createPortal(
    <div className="qr-sheet-back" onClick={onClose}>
      <div className="qr-sheet v2-sheet" role="dialog" aria-modal="true" aria-label={titre} onClick={(e) => e.stopPropagation()}>
        <span className="qr-grab" aria-hidden="true" />
        <div className="qr-sheet-head"><strong>{titre}</strong><button type="button" className="app-icon-btn" onClick={onClose} aria-label="Fermer"><LuX /></button></div>
        <div className="v2-sheet-body">{children}</div>
      </div>
    </div>,
    cible,
  );
}

/* ---------- Actions ---------- */

function telecharger(onToast: (s: string) => void) {
  const m = QR_MATRICES[VEHICULE.qrId];
  let d = "";
  m.rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (row[x] === "1") d += `M${x} ${y}h1v1h-1z`; });
  const lignes: [string, string][] = [
    ["Immatriculation", `${VEHICULE.plaque.numero} | ${VEHICULE.plaque.lettre} | ${VEHICULE.plaque.region}`],
    ["Véhicule", `${VEHICULE.marque} ${VEHICULE.modele}`], ["Genre", VEHICULE.genre], ["Énergie", VEHICULE.energie],
    ["Puissance fiscale", VEHICULE.puissance], ["1re mise en circulation", VEHICULE.circulation], ["N° de titre", VEHICULE.titre], ["Titulaire", PROFIL.nom],
  ];
  const txt = lignes.map(([k, v], i) => `<text x="32" y="${170 + i * 30}" font-size="15" fill="#64748b">${k}</text><text x="568" y="${170 + i * 30}" font-size="15" fill="#1f2937" text-anchor="end" font-weight="600">${v}</text>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="440" viewBox="0 0 600 440" font-family="Arial, sans-serif">
<rect width="600" height="440" rx="18" fill="#ffffff" stroke="#dce3ea"/>
<rect width="600" height="110" rx="18" fill="#124a8c"/><rect y="90" width="600" height="20" fill="#124a8c"/>
<text x="32" y="50" font-size="24" fill="#ffffff" font-weight="700">Carte grise numérique</text>
<text x="32" y="80" font-size="14" fill="#f9c522">MAQUETTE DU PROJET · DONNÉES FICTIVES · DOCUMENT NON OFFICIEL</text>
<g transform="translate(480 8) scale(3.8)"><rect width="25" height="25" fill="#fff"/><path d="${d}" fill="#1f2937"/></g>
${txt}
<text x="300" y="420" font-size="12" fill="#94a3b8" text-anchor="middle">Exemple généré par la maquette « Carte grise numérique ». Sans valeur juridique.</text>
</svg>`;
  try {
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url; a.download = "carte-grise-maquette-12345-A-6.svg";
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    onToast("Carte grise téléchargée");
  } catch {
    onToast("Téléchargement indisponible sur cet appareil");
  }
}

async function partager(onToast: (s: string) => void) {
  const texte = `Carte grise numérique (maquette) · ${VEHICULE.marque} ${VEHICULE.modele}`;
  try {
    if (navigator.share) { await navigator.share({ title: "Carte grise numérique", text: texte, url: window.location.href }); return; }
    await navigator.clipboard.writeText(`${texte} · ${window.location.href}`);
    onToast("Lien copié");
  } catch {
    onToast("Partage annulé");
  }
}
