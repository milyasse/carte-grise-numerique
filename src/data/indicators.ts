export interface Indicateur {
  id: string;
  nom: string;
  definition: string;
  unite: string;
}

// Aucune valeur réelle : les valeurs sont à saisir par l'équipe projet.
export const INDICATEURS: Indicateur[] = [
  { id: "accompagnes", nom: "Usagers accompagnés", definition: "Personnes aidées lors de leur première utilisation.", unite: "usagers" },
  { id: "en-ligne", nom: "Utilisation des démarches en ligne", definition: "Part des demandes déposées en ligne.", unite: "%" },
  { id: "complets", nom: "Dossiers complets au dépôt", definition: "Part des dossiers sans pièce manquante.", unite: "%" },
  { id: "delai", nom: "Délai moyen de traitement", definition: "Du dépôt à la mise à disposition du titre.", unite: "jours" },
  { id: "controles", nom: "Réussite des contrôles", definition: "Vérifications abouties, simulées ou réelles selon le dispositif.", unite: "%" },
  { id: "satisfaction", nom: "Satisfaction des usagers", definition: "Mesurée par une enquête après la démarche.", unite: "%" },
  { id: "formes", nom: "Agents formés", definition: "Agents ayant suivi la formation au nouvel outil.", unite: "agents" },
];
