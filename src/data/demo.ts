// Jeu de données entièrement fictif. Aucune donnée réelle de véhicule ou de personne.

export type StatutTitre = "valide" | "signale";

/** Lettres utilisées sur les plaques marocaines, avec leur code latin (utilisé dans le QR code). */
export const LETTRES_PLAQUE: { ar: string; code: string }[] = [
  { ar: "أ", code: "A" },
  { ar: "ب", code: "B" },
  { ar: "د", code: "D" },
  { ar: "هـ", code: "H" },
  { ar: "و", code: "W" },
  { ar: "ط", code: "T" },
];

export interface Plaque {
  numero: string; // 1 à 5 chiffres
  lettre: string; // lettre arabe
  region: string; // code préfectoral ou provincial (1 à 89)
}

export const lettreCode = (ar: string) => LETTRES_PLAQUE.find((l) => l.ar === ar)?.code ?? "?";
/** Clé technique, ex. 12345-A-6 */
export const cleePlaque = (p: Plaque) => `${p.numero}-${lettreCode(p.lettre)}-${p.region}`;
/** Affichage, ex. 12345 | أ | 6 */
export const textePlaque = (p: Plaque) => `${p.numero} | ${p.lettre} | ${p.region}`;

export interface VehiculeDemo {
  immatriculation: string; // clé technique
  plaque: Plaque;
  marque: string;
  modele: string;
  genre: string;
  energie: string;
  puissanceFiscale: string;
  couleur: string;
  premiereCirculation: string;
  numeroTitre: string;
  dateDelivrance: string;
  titulaire: string;
  statut: StatutTitre;
  motifSignalement?: string;
}

export const VEHICULES_DEMO: VehiculeDemo[] = [
  {
    immatriculation: "12345-A-6",
    plaque: { numero: "12345", lettre: "أ", region: "6" },
    marque: "Exemple Motors",
    modele: "Véhicule de démonstration",
    genre: "Véhicule particulier",
    energie: "Diesel",
    puissanceFiscale: "8 CV",
    couleur: "Gris",
    premiereCirculation: "15/03/2022",
    numeroTitre: "CG-DEMO-000123",
    dateDelivrance: "02/01/2026",
    titulaire: "Titulaire fictif A",
    statut: "valide",
  },
  {
    immatriculation: "67890-B-1",
    plaque: { numero: "67890", lettre: "ب", region: "1" },
    marque: "Exemple Motors",
    modele: "Utilitaire de démonstration",
    genre: "Véhicule utilitaire",
    energie: "Essence",
    puissanceFiscale: "6 CV",
    couleur: "Blanc",
    premiereCirculation: "09/11/2019",
    numeroTitre: "CG-DEMO-000456",
    dateDelivrance: "18/06/2024",
    titulaire: "Titulaire fictif B",
    statut: "signale",
    motifSignalement: "Titre déclaré invalide dans le jeu de données fictif (scénario de test).",
  },
];

export const QR_PREFIX = "CGN-DEMO:";

export type ScenarioId = "valide" | "invalide" | "signale";

export const SCENARIOS: { id: ScenarioId; label: string; description: string }[] = [
  { id: "valide", label: "QR reconnu", description: "Identifiant présent dans le scénario de démonstration." },
  { id: "invalide", label: "QR invalide", description: "Identifiant inconnu ou mal formé." },
  { id: "signale", label: "Document signalé", description: "Titre marqué invalide dans le jeu fictif." },
];

export const findVehicule = (immat: string) =>
  VEHICULES_DEMO.find((v) => v.immatriculation === immat.trim().toUpperCase());
