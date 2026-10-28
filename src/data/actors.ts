// Hypothèses de travail à confirmer auprès des acteurs. Aucune position officielle.

export type Categorie =
  | "Habitudes"
  | "Compétences numériques"
  | "Sécurité et confiance"
  | "Charge de travail"
  | "Technique et terrain"
  | "Gouvernance"
  | "Interopérabilité";

export const CATEGORIES: Categorie[] = [
  "Habitudes",
  "Compétences numériques",
  "Sécurité et confiance",
  "Charge de travail",
  "Technique et terrain",
  "Gouvernance",
  "Interopérabilité",
];

export interface Acteur {
  id: string;
  nom: string;
  famille: "Usagers" | "Administration" | "Contrôle" | "Partenaires";
  resistances: string[];
  impacts: string;
  leviers: string[];
  actions: string[];
  categories: Categorie[];
}

export const ACTEURS: Acteur[] = [
  {
    id: "usagers",
    nom: "Usagers et citoyens",
    famille: "Usagers",
    resistances: ["Habitude du document physique", "Difficultés avec le numérique", "Inquiétudes sur la sécurité"],
    impacts: "Adoption lente, maintien des démarches au guichet.",
    leviers: ["Simplicité d’utilisation", "Accompagnement et assistance", "Communication"],
    actions: ["Tutoriels et guides pratiques", "Assistance aux usagers", "Dispositifs d’accompagnement"],
    categories: ["Habitudes", "Compétences numériques", "Sécurité et confiance"],
  },
  {
    id: "agents-admin",
    nom: "Agents administratifs",
    famille: "Administration",
    resistances: ["Évolution des procédures", "Crainte d’une charge accrue", "Changement des habitudes"],
    impacts: "Contournement de l’outil, double saisie pendant la transition.",
    leviers: ["Formation", "Implication dans la conception", "Simplification des tâches"],
    actions: ["Ateliers de concertation", "Formations", "Documentation opérationnelle"],
    categories: ["Habitudes", "Charge de travail"],
  },
  {
    id: "agents-controle",
    nom: "Agents chargés des contrôles routiers",
    famille: "Contrôle",
    resistances: ["Adaptation aux nouveaux outils", "Disponibilité du réseau", "Fiabilité de la vérification"],
    impacts: "Retour au contrôle visuel en cas de doute ou de panne.",
    leviers: ["Ergonomie et rapidité", "Fiabilité", "Fonctionnement adapté au terrain"],
    actions: ["Pilotes", "Scénarios de test", "Procédures de secours"],
    categories: ["Technique et terrain", "Compétences numériques", "Sécurité et confiance"],
  },
  {
    id: "narsa",
    nom: "NARSA",
    famille: "Administration",
    resistances: ["Gouvernance du projet", "Qualité des données", "Sécurité et coordination institutionnelle"],
    impacts: "Retards de décision, données incomplètes au lancement.",
    leviers: ["Gouvernance claire", "Responsabilités définies", "Suivi des indicateurs"],
    actions: ["Comité de pilotage", "Suivi des risques", "Validation des processus"],
    categories: ["Gouvernance", "Sécurité et confiance"],
  },
  {
    id: "mtl",
    nom: "Ministère du Transport et de la Logistique",
    famille: "Administration",
    resistances: ["Cohérence réglementaire", "Cohérence organisationnelle"],
    impacts: "Valeur juridique du titre numérique à clarifier.",
    leviers: ["Coordination institutionnelle", "Clarification des responsabilités"],
    actions: ["Ateliers de travail", "Validation du cadre de mise en œuvre"],
    categories: ["Gouvernance"],
  },
  {
    id: "dgsn-gr",
    nom: "DGSN et Gendarmerie Royale",
    famille: "Contrôle",
    resistances: ["Fiabilité des contrôles", "Accès autorisé aux informations"],
    impacts: "Besoin de garanties avant l’usage en conditions réelles.",
    leviers: ["Protocoles sécurisés", "Ergonomie", "Fiabilité du dispositif"],
    actions: ["Définition des besoins opérationnels", "Tests contrôlés"],
    categories: ["Sécurité et confiance", "Technique et terrain"],
  },
  {
    id: "add",
    nom: "Agence de Développement du Digital",
    famille: "Partenaires",
    resistances: ["Interopérabilité", "Identité numérique", "Architecture des services"],
    impacts: "Choix techniques à aligner avec les standards nationaux.",
    leviers: ["Standards d’interopérabilité", "Sécurité", "Gouvernance des échanges"],
    actions: ["Cadrage technique", "Coordination avec les systèmes concernés"],
    categories: ["Interopérabilité", "Gouvernance"],
  },
  {
    id: "assurances",
    nom: "Compagnies d’assurance",
    famille: "Partenaires",
    resistances: ["Évolution des processus de vérification"],
    impacts: "Adaptation de leurs systèmes et procédures internes.",
    leviers: ["Échanges sécurisés", "Modalités d’accès clarifiées"],
    actions: ["Identification des besoins", "Définition des éventuelles interfaces"],
    categories: ["Interopérabilité", "Habitudes"],
  },
  {
    id: "concessionnaires",
    nom: "Concessionnaires automobiles",
    famille: "Partenaires",
    resistances: ["Adaptation des processus de vente et de mutation"],
    impacts: "Délais de vente pendant la période d’adaptation.",
    leviers: ["Procédures simples", "Intégration progressive"],
    actions: ["Concertation", "Tests des processus concernés"],
    categories: ["Habitudes", "Charge de travail"],
  },
];
