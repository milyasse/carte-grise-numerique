import { LuBadgeCheck, LuScanLine, LuShieldAlert, LuShieldCheck } from "react-icons/lu";
import type { VehiculeDemo } from "../data/demo";
import { QrCode } from "./QrCode";
import { PlaqueMaroc } from "./PlaqueMaroc";

interface Props {
  vehicule: VehiculeDemo;
  qrId?: string;
  onVerifier?: () => void;
  onControle?: () => void;
  verifMessage?: string;
  /** Apparence du produit final (sans mentions de démonstration dans la carte). */
  final?: boolean;
}

export function CarteGriseMobile({ vehicule, qrId, onVerifier, onControle, verifMessage, final = false }: Props) {
  const valide = vehicule.statut === "valide";
  return (
    <>
      <div className="cg-head">
        <div className="cg-head-top">
          <h3>Carte grise numérique</h3>
          {final ? (
            <span className={`cg-status ${valide ? "ok" : "ko"}`}>
              {valide ? <LuShieldCheck /> : <LuShieldAlert />} {valide ? "Valide" : "Signalé"}
            </span>
          ) : (
            <span className="badge amber" style={{ fontSize: "0.66rem" }}>Démonstration</span>
          )}
        </div>
        <span className="ar" lang="ar">البطاقة الرمادية الرقمية</span>
      </div>
      <div className="cg-body">
        <PlaqueMaroc plaque={vehicule.plaque} />

        <div className="cg-block">
          <h4>Véhicule</h4>
          <dl className="kv">
            <dt>Marque</dt><dd>{vehicule.marque}</dd>
            <dt>Modèle</dt><dd>{vehicule.modele}</dd>
            <dt>Genre</dt><dd>{vehicule.genre}</dd>
            <dt>Énergie</dt><dd>{vehicule.energie}</dd>
            <dt>Puissance fiscale</dt><dd>{vehicule.puissanceFiscale}</dd>
            {final && <><dt>Couleur</dt><dd>{vehicule.couleur}</dd></>}
            {final && <><dt>1re mise en circulation</dt><dd className="mono">{vehicule.premiereCirculation}</dd></>}
          </dl>
        </div>

        <div className="cg-block">
          <h4>Titre</h4>
          <dl className="kv">
            <dt>N° de titre</dt><dd className="mono">{vehicule.numeroTitre}</dd>
            <dt>Délivré le</dt><dd className="mono">{vehicule.dateDelivrance}</dd>
            <dt>Titulaire</dt><dd>{vehicule.titulaire}</dd>
            <dt>Statut</dt>
            {final
              ? <dd style={{ color: valide ? "var(--c-primary)" : "var(--c-red)" }}>{valide ? "En circulation" : "Titre signalé"}</dd>
              : <dd style={{ color: "var(--c-amber)" }}>Exemple fictif</dd>}
          </dl>
        </div>

        <div className="cg-block cg-qr">
          <QrCode id={qrId ?? vehicule.qrId} />
          <p className="small muted">
            {final
              ? "Présentez ce QR code à l’agent lors d’un contrôle routier."
              : "QR code de démonstration. Il ne certifie pas l’authenticité d’un document réel."}
          </p>
        </div>

        {(onVerifier || onControle) && (
          <div className="cg-actions">
            {onVerifier && (
              <button className="btn sm" type="button" onClick={onVerifier}>
                <LuShieldCheck /> Vérifier le document
              </button>
            )}
            {onControle && (
              <button className="btn sm secondary" type="button" onClick={onControle}>
                <LuScanLine /> {final ? "Vue contrôle routier" : "Simuler un contrôle routier"}
              </button>
            )}
            {verifMessage && (
              <p className="small fade-in" role="status" style={{ display: "flex", gap: 6, alignItems: "center", color: "var(--c-primary)" }}>
                <LuBadgeCheck /> {verifMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
