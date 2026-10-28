import { useState, type FormEvent } from "react";
import {
  LuArrowRightLeft, LuCheck, LuCircleCheck, LuClock, LuCopy, LuFilePlus, LuIdCard, LuInfo,
  LuListChecks, LuLoaderCircle, LuPaperclip, LuRotateCcw, LuSearch, LuStepForward,
} from "react-icons/lu";
import { VEHICULES_DEMO, cleePlaque, findVehicule, textePlaque, type Plaque } from "../../data/demo";
import { PlaqueInput, PlaqueMaroc } from "../PlaqueMaroc";
import { useLocalState } from "../../hooks/useLocalState";

export type TypeDemande = "Duplicata" | "Mutation";
export interface Dossier {
  ref: string;
  type: TypeDemande;
  immatriculation: string;
  detail: string;
  cree: string;
  etape: number; // 0..4
  piecesTransmises: boolean;
  exemple?: boolean;
}

export const ETAPES_SUIVI = [
  { court: "Créée", titre: "Demande créée", texte: "La demande est enregistrée avec une référence." },
  { court: "En traitement", titre: "Dossier en cours de traitement", texte: "Le service instruit le dossier." },
  { court: "Pièces à compléter", titre: "Pièces à compléter", texte: "Une pièce complémentaire est demandée à l’usager." },
  { court: "Validée", titre: "Demande validée", texte: "Le dossier est accepté." },
  { court: "Disponible", titre: "Document disponible dans l’espace usager", texte: "La carte grise numérique est consultable." },
];

const EXEMPLE: Dossier = {
  ref: "DUP-2026-0042", type: "Duplicata", immatriculation: "12345 | أ | 6", detail: "Perte",
  cree: "27/10/2026", etape: 1, piecesTransmises: false, exemple: true,
};

type Vue = "carte" | "duplicata" | "mutation" | "suivi";

export function Demarches({ connecte, onVoirCarte }: { connecte: boolean; onVoirCarte: () => void }) {
  const [vue, setVue] = useState<Vue>("duplicata");
  const [dossiers, setDossiers] = useLocalState<Dossier[]>("cgn-demo-dossiers-v2", [EXEMPLE]);
  const [selection, setSelection] = useState<string>(EXEMPLE.ref);

  const creer = (type: TypeDemande, immatriculation: string, detail: string) => {
    const prefix = type === "Duplicata" ? "DUP" : "MUT";
    const n = String(Math.floor(1000 + Math.random() * 9000));
    const ref = `${prefix}-2026-${n}`;
    const d: Dossier = { ref, type, immatriculation, detail, cree: new Date().toLocaleDateString("fr-FR"), etape: 0, piecesTransmises: false };
    setDossiers((all) => [d, ...all]);
    setSelection(ref);
    return ref;
  };

  const voirSuivi = (ref: string) => { setSelection(ref); setVue("suivi"); };

  const ONGLETS: { id: Vue; label: string; icon: typeof LuIdCard }[] = [
    { id: "carte", label: "Ma carte grise", icon: LuIdCard },
    { id: "duplicata", label: "Duplicata", icon: LuFilePlus },
    { id: "mutation", label: "Mutation", icon: LuArrowRightLeft },
    { id: "suivi", label: "Suivi de dossier", icon: LuListChecks },
  ];

  return (
    <div className="card" style={{ opacity: connecte ? 1 : 0.6, transition: "opacity .2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
        <h3>Démarches en ligne</h3>
        <span className="badge neutral">Prototype · rien n’est transmis</span>
      </div>
      {!connecte && (
        <div className="notice" style={{ margin: "10px 0 14px" }}><LuInfo /> Simulez d’abord la connexion à l’espace usager pour accéder aux démarches.</div>
      )}
      <div className="subtabs" role="tablist" aria-label="Démarches">
        {ONGLETS.map((o) => {
          const I = o.icon;
          return (
            <button key={o.id} role="tab" type="button" aria-selected={vue === o.id} onClick={() => setVue(o.id)} disabled={!connecte}>
              <I /> {o.label}
            </button>
          );
        })}
      </div>

      <fieldset disabled={!connecte} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        {vue === "carte" && <MaCarte onVoirCarte={onVoirCarte} />}
        {vue === "duplicata" && <FormDuplicata onCree={(i, d) => creer("Duplicata", i, d)} onSuivi={voirSuivi} />}
        {vue === "mutation" && <FormMutation onCree={(i, d) => creer("Mutation", i, d)} onSuivi={voirSuivi} />}
        {vue === "suivi" && (
          <Suivi
            dossiers={dossiers}
            selection={selection}
            setSelection={setSelection}
            maj={(ref, patch) => setDossiers((all) => all.map((d) => (d.ref === ref ? { ...d, ...patch } : d)))}
            reinitialiser={() => { setDossiers([EXEMPLE]); setSelection(EXEMPLE.ref); }}
          />
        )}
      </fieldset>
    </div>
  );
}

function MaCarte({ onVoirCarte }: { onVoirCarte: () => void }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {VEHICULES_DEMO.map((v) => (
        <div key={v.immatriculation} className="dossier-item" style={{ cursor: "default" }}>
          <span>
            <PlaqueMaroc plaque={v.plaque} size="sm" />
            <span className="small muted" style={{ display: "block", marginTop: 4 }}>{v.marque} · {v.modele}</span>
          </span>
          {v.statut === "valide" ? <span className="badge">Exemple fictif</span> : <span className="badge amber">Signalé (scénario)</span>}
        </div>
      ))}
      <div><button className="btn secondary sm" type="button" onClick={onVoirCarte}>Afficher sur le smartphone</button></div>
    </div>
  );
}

function useSoumission() {
  const [etat, setEtat] = useState<"idle" | "envoi" | "ok">("idle");
  const [ref, setRef] = useState("");
  const soumettre = (fn: () => string) => {
    setEtat("envoi");
    window.setTimeout(() => { setRef(fn()); setEtat("ok"); }, 900);
  };
  return { etat, ref, soumettre, reset: () => { setEtat("idle"); setRef(""); } };
}

function Confirmation({ refDossier, onSuivi, onNouveau }: { refDossier: string; onSuivi: (r: string) => void; onNouveau: () => void }) {
  return (
    <div className="notice success fade-in" role="status" style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}><LuCircleCheck style={{ width: 22, height: 22 }} /><strong>Demande de démonstration enregistrée</strong></div>
      <p>Référence fictive : <span className="mono" style={{ fontWeight: 600 }}>{refDossier}</span>. Aucune demande n’a été transmise à l’administration.</p>
      <div className="btn-row">
        <button className="btn sm" type="button" onClick={() => onSuivi(refDossier)}>Suivre ce dossier</button>
        <button className="btn ghost sm" type="button" onClick={onNouveau}>Nouvelle demande</button>
      </div>
    </div>
  );
}

const PLAQUE_INITIALE: Plaque = { numero: "12345", lettre: "أ", region: "6" };
function validerImmat(p: Plaque) {
  if (!p.numero) return "Indiquez le numéro de la plaque.";
  if (!/^\d{1,5}$/.test(p.numero)) return "Le numéro comporte 1 à 5 chiffres.";
  const r = Number(p.region);
  if (!p.region || r < 1 || r > 89) return "Le code région est compris entre 1 et 89.";
  if (!findVehicule(cleePlaque(p))) return "Plaque absente du jeu fictif. Utilisez 12345 | أ | 6 ou 67890 | ب | 1.";
  return "";
}

function FormDuplicata({ onCree, onSuivi }: { onCree: (immat: string, detail: string) => string; onSuivi: (r: string) => void }) {
  const [immat, setImmat] = useState<Plaque>(PLAQUE_INITIALE);
  const [motif, setMotif] = useState("");
  const [ok, setOk] = useState(false);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const s = useSoumission();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    const ei = validerImmat(immat); if (ei) er.immat = ei;
    if (!motif) er.motif = "Choisissez un motif.";
    if (!ok) er.ok = "Cochez la case pour confirmer qu’il s’agit d’une démonstration.";
    setErreurs(er);
    if (Object.keys(er).length) return;
    s.soumettre(() => onCree(textePlaque(immat), motif));
  };

  if (s.etat === "ok") return <Confirmation refDossier={s.ref} onSuivi={onSuivi} onNouveau={() => { s.reset(); setMotif(""); setOk(false); }} />;

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="dup-immat">Immatriculation</label>
        <PlaqueInput id="dup-immat" value={immat} onChange={setImmat} invalid={!!erreurs.immat} />
        <span className="hint">Numéro · lettre · code région</span>
        {erreurs.immat && <span className="error-text" id="dup-immat-err">{erreurs.immat}</span>}
      </div>
      <div className="field">
        <label htmlFor="dup-motif">Motif</label>
        <select id="dup-motif" className="select" value={motif} onChange={(e) => setMotif(e.target.value)} aria-invalid={!!erreurs.motif}>
          <option value="">Sélectionner…</option>
          <option>Perte</option>
          <option>Vol</option>
          <option>Détérioration</option>
        </select>
        {erreurs.motif && <span className="error-text">{erreurs.motif}</span>}
      </div>
      <div className="notice"><LuPaperclip /> Pièces justificatives : non demandées dans le prototype.</div>
      <label className="check">
        <input id="dup-ok" type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />
        Je comprends qu’il s’agit d’une démonstration et qu’aucune demande n’est transmise.
      </label>
      {erreurs.ok && <span className="error-text">{erreurs.ok}</span>}
      <div><Bouton envoi={s.etat === "envoi"} label="Déposer la demande de duplicata" /></div>
    </form>
  );
}

function FormMutation({ onCree, onSuivi }: { onCree: (immat: string, detail: string) => string; onSuivi: (r: string) => void }) {
  const [immat, setImmat] = useState<Plaque>(PLAQUE_INITIALE);
  const [nom, setNom] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [ok, setOk] = useState(false);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const s = useSoumission();
  const today = new Date().toISOString().slice(0, 10);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    const ei = validerImmat(immat); if (ei) er.immat = ei;
    if (nom.trim().length < 3) er.nom = "Indiquez un nom fictif d’au moins 3 caractères.";
    else if (/\d{5,}/.test(nom)) er.nom = "N’indiquez pas de numéro d’identité : utilisez un nom fictif.";
    if (!type) er.type = "Choisissez le type de cession.";
    if (!date) er.date = "Indiquez la date de cession.";
    else if (date > today) er.date = "La date de cession ne peut pas être dans le futur.";
    if (!ok) er.ok = "Cochez la case pour confirmer qu’il s’agit d’une démonstration.";
    setErreurs(er);
    if (Object.keys(er).length) return;
    s.soumettre(() => onCree(textePlaque(immat), `${type} · nouveau titulaire : ${nom.trim()}`));
  };

  if (s.etat === "ok") return <Confirmation refDossier={s.ref} onSuivi={onSuivi} onNouveau={() => { s.reset(); setNom(""); setType(""); setDate(""); setOk(false); }} />;

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="mut-immat">Immatriculation</label>
        <PlaqueInput id="mut-immat" value={immat} onChange={setImmat} invalid={!!erreurs.immat} />
        <span className="hint">Numéro · lettre · code région</span>
        {erreurs.immat && <span className="error-text">{erreurs.immat}</span>}
      </div>
      <div className="field">
        <label htmlFor="mut-nom">Nouveau titulaire (nom fictif)</label>
        <input id="mut-nom" className="input" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Exemple : Acquéreur fictif" aria-invalid={!!erreurs.nom} autoComplete="off" />
        <span className="hint">N’indiquez aucune donnée personnelle réelle.</span>
        {erreurs.nom && <span className="error-text">{erreurs.nom}</span>}
      </div>
      <div className="grid g-2">
        <div className="field">
          <label htmlFor="mut-type">Type de cession</label>
          <select id="mut-type" className="select" value={type} onChange={(e) => setType(e.target.value)} aria-invalid={!!erreurs.type}>
            <option value="">Sélectionner…</option>
            <option>Vente</option>
            <option>Donation</option>
            <option>Succession</option>
          </select>
          {erreurs.type && <span className="error-text">{erreurs.type}</span>}
        </div>
        <div className="field">
          <label htmlFor="mut-date">Date de cession</label>
          <input id="mut-date" type="date" className="input" value={date} max={today} onChange={(e) => setDate(e.target.value)} aria-invalid={!!erreurs.date} />
          {erreurs.date && <span className="error-text">{erreurs.date}</span>}
        </div>
      </div>
      <label className="check">
        <input id="mut-ok" type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />
        Je comprends qu’il s’agit d’une démonstration et qu’aucune demande n’est transmise.
      </label>
      {erreurs.ok && <span className="error-text">{erreurs.ok}</span>}
      <div><Bouton envoi={s.etat === "envoi"} label="Déposer la demande de mutation" /></div>
    </form>
  );
}

function Bouton({ envoi, label }: { envoi: boolean; label: string }) {
  return (
    <button className="btn" type="submit" disabled={envoi}>
      {envoi ? <><LuLoaderCircle className="spin" /> Enregistrement…</> : label}
    </button>
  );
}

function Suivi({ dossiers, selection, setSelection, maj, reinitialiser }: {
  dossiers: Dossier[];
  selection: string;
  setSelection: (r: string) => void;
  maj: (ref: string, patch: Partial<Dossier>) => void;
  reinitialiser: () => void;
}) {
  const [recherche, setRecherche] = useState("");
  const [msg, setMsg] = useState("");
  const d = dossiers.find((x) => x.ref === selection) ?? dossiers[0];

  const chercher = (e: FormEvent) => {
    e.preventDefault();
    const r = recherche.trim().toUpperCase();
    const f = dossiers.find((x) => x.ref === r);
    if (f) { setSelection(f.ref); setMsg(""); } else setMsg("Aucun dossier de démonstration avec cette référence.");
  };

  const copier = async (ref: string) => {
    try { await navigator.clipboard.writeText(ref); setMsg("Référence copiée."); } catch { setMsg(`Référence : ${ref}`); }
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <form className="manual" onSubmit={chercher} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label htmlFor="suivi-ref" className="sr-only" style={{ position: "absolute", left: -9999 }}>Référence du dossier</label>
        <input id="suivi-ref" className="input mono" style={{ flex: "1 1 200px", background: "var(--c-surface)", color: "var(--c-ink)", borderColor: "var(--c-line)" }} placeholder="Référence, ex. DUP-2026-0042" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
        <button className="btn secondary sm" type="submit"><LuSearch /> Consulter</button>
      </form>
      {msg && <p className="small muted" role="status">{msg}</p>}

      <div className="dossier-list" role="group" aria-label="Mes dossiers de démonstration">
        {dossiers.map((x) => (
          <button key={x.ref} type="button" className="dossier-item" aria-pressed={x.ref === d?.ref} onClick={() => setSelection(x.ref)}>
            <span style={{ minWidth: 0 }}>
              <strong className="mono">{x.ref}</strong>
              <span className="small muted" style={{ display: "block" }}>{x.type} · {x.immatriculation}{x.exemple ? " · exemple" : ""}</span>
            </span>
            <span className={`badge ${x.etape === 4 ? "" : x.etape === 2 && !x.piecesTransmises ? "amber" : "neutral"}`}>{x.etape === 2 && x.piecesTransmises ? "Pièces reçues" : ETAPES_SUIVI[x.etape].court}</span>
          </button>
        ))}
      </div>

      {d && (
        <div className="card" style={{ background: "var(--c-bg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <div>
              <strong className="mono">{d.ref}</strong>
              <p className="small muted">{d.type} · {d.immatriculation} · {d.detail} · créé le {d.cree}</p>
            </div>
            <button className="btn ghost sm" type="button" onClick={() => copier(d.ref)}><LuCopy /> Copier</button>
          </div>
          <ol className="timeline">
            {ETAPES_SUIVI.map((e, i) => {
              const attente = i === 2 && d.etape === 2 && !d.piecesTransmises;
              const cls = i < d.etape || (d.etape === 4 && i === 4) ? "done" : i === d.etape ? (attente ? "warn" : "current") : "";
              return (
                <li key={e.titre} className={cls}>
                  <span className="tdot">{cls === "done" ? <LuCheck /> : cls ? <LuClock /> : null}</span>
                  <div><strong>{e.titre}</strong><span className="small muted">{e.texte}</span></div>
                </li>
              );
            })}
          </ol>
          <div className="btn-row" style={{ marginTop: 16 }}>
            {d.etape === 2 && !d.piecesTransmises ? (
              <button className="btn sm" type="button" onClick={() => maj(d.ref, { piecesTransmises: true })}><LuPaperclip /> Transmettre les pièces (démo)</button>
            ) : (
              <button className="btn sm" type="button" disabled={d.etape >= 4} onClick={() => maj(d.ref, { etape: d.etape + 1 })}><LuStepForward /> Étape suivante</button>
            )}
            <button className="btn ghost sm" type="button" onClick={() => maj(d.ref, { etape: 0, piecesTransmises: false })}><LuRotateCcw /> Revenir au début</button>
          </div>
          {d.etape === 4 && <div className="notice success" style={{ marginTop: 14 }}><LuCircleCheck /> Document de démonstration disponible dans l’espace usager.</div>}
        </div>
      )}
      <div><button className="btn ghost sm" type="button" onClick={reinitialiser}>Effacer mes dossiers de démonstration</button></div>
    </div>
  );
}
