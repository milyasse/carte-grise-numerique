import { LETTRES_PLAQUE, textePlaque, type Plaque } from "../data/demo";

/** Plaque d'immatriculation au format marocain : numéro | lettre | code région. */
export function PlaqueMaroc({ plaque, size = "md" }: { plaque: Plaque; size?: "sm" | "md" }) {
  return (
    <div className={`plaque-ma ${size}`} role="img" aria-label={`Immatriculation ${textePlaque(plaque)}`} dir="ltr">
      <span className="pm-num">{plaque.numero}</span>
      <span className="pm-sep" aria-hidden="true" />
      <span className="pm-lettre" lang="ar">{plaque.lettre}</span>
      <span className="pm-sep" aria-hidden="true" />
      <span className="pm-reg">{plaque.region}</span>
    </div>
  );
}

/** Saisie d'une immatriculation marocaine en trois parties. */
export function PlaqueInput({ id, value, onChange, invalid }: { id: string; value: Plaque; onChange: (p: Plaque) => void; invalid?: boolean }) {
  return (
    <div className="plaque-input" dir="ltr">
      <input
        id={id}
        className="input mono"
        inputMode="numeric"
        maxLength={5}
        aria-label="Numéro (1 à 5 chiffres)"
        aria-invalid={invalid}
        value={value.numero}
        onChange={(e) => onChange({ ...value, numero: e.target.value.replace(/\D/g, "") })}
        placeholder="12345"
        autoComplete="off"
      />
      <span className="pm-sep" aria-hidden="true" />
      <select className="select" aria-label="Lettre" value={value.lettre} onChange={(e) => onChange({ ...value, lettre: e.target.value })} aria-invalid={invalid}>
        {LETTRES_PLAQUE.map((l) => <option key={l.code} value={l.ar}>{l.ar}</option>)}
      </select>
      <span className="pm-sep" aria-hidden="true" />
      <input
        className="input mono"
        inputMode="numeric"
        maxLength={2}
        aria-label="Code région (1 à 89)"
        aria-invalid={invalid}
        value={value.region}
        onChange={(e) => onChange({ ...value, region: e.target.value.replace(/\D/g, "") })}
        placeholder="6"
        autoComplete="off"
      />
    </div>
  );
}
