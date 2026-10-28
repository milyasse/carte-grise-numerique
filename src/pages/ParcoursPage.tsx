import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuBuilding2, LuCircleAlert, LuClipboardList, LuFileCheck, LuFingerprint, LuFolderInput, LuHourglass,
  LuInfo, LuListChecks, LuQrCode, LuRotateCcw, LuSmartphone, LuSiren, LuCar,
} from "react-icons/lu";
import { SectionHead } from "../components/SectionHead";
import { ACTEURS, CATEGORIES, type Categorie } from "../data/actors";
import { INDICATEURS } from "../data/indicators";
import { useLocalState } from "../hooks/useLocalState";

const AUJ: [IconType, string][] = [
  [LuClipboardList, "L’usager prépare les documents nécessaires."],
  [LuCar, "Il se déplace auprès du service compétent."],
  [LuFolderInput, "Il dépose sa demande."],
  [LuHourglass, "Il attend le traitement administratif."],
  [LuBuilding2, "Il récupère le document physique."],
  [LuSiren, "Lors d’un contrôle routier, il présente sa carte grise."],
];
const DEM: [IconType, string][] = [
  [LuSmartphone, "L’usager accède à un portail ou à une application autorisée."],
  [LuFingerprint, "Il s’authentifie selon le mécanisme retenu."],
  [LuFileCheck, "Il consulte sa carte grise numérique."],
  [LuFolderInput, "Il dépose une demande de duplicata ou de mutation en ligne."],
  [LuListChecks, "Il suit l’évolution de son dossier."],
  [LuQrCode, "Lors d’un contrôle, le document peut être vérifié par QR code via un service autorisé."],
];
const DIFFICULTES = ["Déplacements", "Attente", "Dossiers incomplets", "Délais administratifs", "Perte ou détérioration", "Vérification difficile"];
const BENEFICES = ["Moins de déplacements", "Suivi en ligne", "Vérification plus fiable", "Pas de document à perdre"];

export function ParcoursPage() {
  return (
    <>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Parcours usager" title="Aujourd’hui et demain, étape par étape">
            Le parcours cible reste à confirmer avec les acteurs institutionnels concernés.
          </SectionHead>
          <div className="journey">
            <Colonne cls="today" titre="Aujourd’hui" badge="red" etapes={AUJ} chips={DIFFICULTES} chipsTitre="Difficultés possibles" />
            <Colonne cls="tomorrow" titre="Demain" badge="" etapes={DEM} chips={BENEFICES} chipsTitre="Bénéfices attendus" />
          </div>
        </div>
      </section>
      <Resistances />
      <Indicateurs />
    </>
  );
}

function Colonne({ cls, titre, badge, etapes, chips, chipsTitre }: { cls: string; titre: string; badge: string; etapes: [IconType, string][]; chips: string[]; chipsTitre: string }) {
  return (
    <div className={`compare-col ${cls}`}>
      <span className={`badge ${badge}`}>{titre}</span>
      <ol className="steps">
        {etapes.map(([I, t]) => (
          <li key={t}><span><span className="s-icon"><I /></span>{t}</span></li>
        ))}
      </ol>
      <p className="small muted" style={{ marginTop: 12, fontWeight: 600 }}>{chipsTitre}</p>
      <div className="pain">
        {chips.map((c) => <span key={c} className={`badge ${cls === "today" ? "red" : ""}`}>{c}</span>)}
      </div>
    </div>
  );
}

function Resistances() {
  const [acteur, setActeur] = useState("tous");
  const [cats, setCats] = useState<Categorie[]>([]);
  const liste = useMemo(
    () => ACTEURS.filter((a) => (acteur === "tous" || a.id === acteur) && (cats.length === 0 || a.categories.some((c) => cats.includes(c)))),
    [acteur, cats],
  );
  const toggle = (c: Categorie) => setCats((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));

  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="Conduite du changement" title="Résistances et leviers par acteur">
          Hypothèses de travail à confirmer auprès des acteurs. Elles ne reflètent aucune position officiellement exprimée.
        </SectionHead>
        <div className="filters">
          <div className="filters-row">
            <label htmlFor="f-acteur" className="small" style={{ fontWeight: 600 }}>Acteur</label>
            <select id="f-acteur" className="select" value={acteur} onChange={(e) => setActeur(e.target.value)}>
              <option value="tous">Tous les acteurs</option>
              {ACTEURS.map((a) => <option key={a.id} value={a.id}>{a.nom}</option>)}
            </select>
            {(acteur !== "tous" || cats.length > 0) && (
              <button className="btn ghost sm" type="button" onClick={() => { setActeur("tous"); setCats([]); }}><LuRotateCcw /> Effacer les filtres</button>
            )}
          </div>
          <div className="chip-row" role="group" aria-label="Catégories de résistance">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={cats.includes(c)} onClick={() => toggle(c)}>{c}</button>
            ))}
          </div>
          <p className="small muted" aria-live="polite">{liste.length} acteur{liste.length > 1 ? "s" : ""} affiché{liste.length > 1 ? "s" : ""}</p>
        </div>

        {liste.length === 0 ? (
          <div className="notice"><LuInfo /> Aucun acteur ne correspond à ces filtres.</div>
        ) : (
          <div className="table-wrap">
            <table className="rtable">
              <thead>
                <tr><th>Acteur concerné</th><th>Résistances potentielles</th><th>Impacts possibles</th><th>Leviers</th><th>Actions proposées</th></tr>
              </thead>
              <tbody>
                {liste.map((a) => (
                  <tr key={a.id}>
                    <td className="actor">
                      {a.nom}
                      <div className="cats">{a.categories.map((c) => <span key={c} className="badge neutral">{c}</span>)}</div>
                    </td>
                    <td data-label="Résistances potentielles"><ul>{a.resistances.map((r) => <li key={r}>{r}</li>)}</ul></td>
                    <td data-label="Impacts possibles">{a.impacts}</td>
                    <td data-label="Leviers"><ul>{a.leviers.map((r) => <li key={r}>{r}</li>)}</ul></td>
                    <td data-label="Actions proposées"><ul>{a.actions.map((r) => <li key={r}>{r}</li>)}</ul></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

type Saisie = Record<string, { cible: string; valeur: string }>;

function Indicateurs() {
  const [saisie, setSaisie] = useLocalState<Saisie>("cgn-demo-indicateurs", {});
  const set = (id: string, k: "cible" | "valeur", v: string) =>
    setSaisie((s) => ({ ...s, [id]: { cible: s[id]?.cible ?? "", valeur: s[id]?.valeur ?? "", [k]: v } }));

  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="Pilotage" title="Indicateurs de suivi du changement">
          Aucune valeur réelle n’est affichée. Les champs se remplissent dans votre navigateur uniquement et ne sont transmis à personne.
        </SectionHead>
        <div className="grid g-auto">
          {INDICATEURS.map((ind) => {
            const s = saisie[ind.id] ?? { cible: "", valeur: "" };
            const renseigne = s.valeur.trim() !== "";
            return (
              <article className="card kpi" key={ind.id}>
                <div className="kpi-top">
                  <h3 style={{ fontSize: "0.98rem" }}>{ind.nom}</h3>
                  <span className={`badge ${renseigne ? "" : "neutral"}`}>{renseigne ? "Renseigné" : "À mesurer"}</span>
                </div>
                <p className="small muted">{ind.definition}</p>
                <div className={`kpi-value ${renseigne ? "" : "empty"}`}>
                  {renseigne ? `${s.valeur} ${ind.unite}` : "Valeur non disponible"}
                </div>
                <div className="kpi-inputs">
                  <div className="field">
                    <label htmlFor={`k-${ind.id}-c`}>Cible ({ind.unite})</label>
                    <input id={`k-${ind.id}-c`} className="input mono" inputMode="decimal" value={s.cible} onChange={(e) => set(ind.id, "cible", e.target.value)} placeholder="—" />
                  </div>
                  <div className="field">
                    <label htmlFor={`k-${ind.id}-v`}>Constaté ({ind.unite})</label>
                    <input id={`k-${ind.id}-v`} className="input mono" inputMode="decimal" value={s.valeur} onChange={(e) => set(ind.id, "valeur", e.target.value)} placeholder="—" />
                  </div>
                </div>
                {s.cible && s.valeur && <p className="small muted">Écart à la cible : {s.cible} → {s.valeur}</p>}
              </article>
            );
          })}
        </div>
        <div className="notice" style={{ marginTop: 16 }}><LuCircleAlert /> Valeurs saisies à titre d’exercice. Elles ne constituent pas des résultats du projet.</div>
      </div>
    </section>
  );
}
