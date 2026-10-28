import { QR_PREFIX, findVehicule, type VehiculeDemo } from "../data/demo";

/**
 * Contrat d'un service de vérification.
 * Le prototype utilise MockVerificationService, qui ne lit que le jeu de données fictif.
 * Une future version pourra fournir une implémentation officielle (service autorisé
 * connecté à la base de référence), après validation institutionnelle.
 */
export type ResultatVerification =
  | { statut: "reconnu"; vehicule: VehiculeDemo }
  | { statut: "signale"; vehicule: VehiculeDemo; motif: string }
  | { statut: "inconnu"; contenu: string }
  | { statut: "format"; contenu: string };

export interface VerificationService {
  readonly mode: "demonstration" | "officiel";
  verifier(contenuQr: string): Promise<ResultatVerification>;
}

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockVerificationService implements VerificationService {
  readonly mode = "demonstration" as const;

  async verifier(contenuQr: string): Promise<ResultatVerification> {
    await pause(250);
    const contenu = contenuQr.trim();
    if (!contenu.startsWith(QR_PREFIX)) return { statut: "format", contenu };
    const id = contenu.slice(QR_PREFIX.length);
    const v = findVehicule(id);
    if (!v) return { statut: "inconnu", contenu };
    if (v.statut === "signale")
      return { statut: "signale", vehicule: v, motif: v.motifSignalement ?? "Titre signalé." };
    return { statut: "reconnu", vehicule: v };
  }
}

export const verificationService: VerificationService = new MockVerificationService();
