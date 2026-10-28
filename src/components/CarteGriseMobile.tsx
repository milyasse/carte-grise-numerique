import { LuBadgeCheck, LuScanLine, LuShieldCheck } from "react-icons/lu";
import type { VehiculeDemo } from "../data/demo";
import { QrCode } from "./QrCode";

interface Props {
  vehicule: VehiculeDemo;
  qrId: "valide" | "signale" | "invalide";
  onVerifier?: () => void;
  onControle?: () => void;
  verifMessage?: string;
}

export function CarteGriseMobile({ vehicule, qrId, onVerifier, onControle, verifMessage }: Props) {
  return (
    <>
      <div className="cg-head">
        <div className="cg-head-top">
          <h3>Carte grise numérique</h3>
          <span className="badge amber" style={{ fontSize: "0.66rem" }}>Démonstration</span>
        </div>
        <span className="ar" lang="ar">البطاقة الرمادية الرقمية</span>
      </div>
      <div className="cg-body">
        <div className="plate" aria-label={`Immatriculation ${vehicule.immatriculation}`}>{vehicule.immatriculation}</div>

        <div className="cg-block">
          <h4>Véhicule</h4>
          <dl className="kv">
            <dt>Marque</dt><dd>{vehicule.marque}</dd>
            <dt>Modèle</dt><dd>{vehicule.modele}</dd>
            <dt>Type</dt><dd>{vehicule.genre}</dd>
            <dt>Énergie</dt><dd>{vehicule.energie}</dd>
            <dt>Puissance</dt><dd>{vehicule.puissanceFiscale}</dd>
          </dl>
        </div>

        <div className="cg-block">
          <h4>Titre</h4>
          <dl className="kv">
            <dt>N° de titre</dt><dd className="mono">{vehicule.numeroTitre}</dd>
            <dt>Délivré le</dt><dd className="mono">{vehicule.dateDelivrance}</dd>
            <dt>Titulaire</dt><dd>{vehicule.titulaire}</dd>
            <dt>Statut</dt><dd style={{ color: "var(--c-amber)" }}>Exemple fictif</dd>
          </dl>
        </div>

        <div className="cg-block cg-qr">
          <QrCode id={qrId} />
          <p className="small muted">QR code de démonstration. Il ne certifie pas l’authenticité d’un document réel.</p>
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
                <LuScanLine /> Simuler un contrôle routier
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
