export const DISCLAIMER =
  "Démonstrateur de projet — Les données et les vérifications présentées sont fictives. Cette application n’est pas un service administratif officiel et n’est pas connectée aux systèmes de la NARSA.";

export const SITUATION_ACTUELLE = [
  { icon: "doc", title: "Document physique", text: "Le titre existe sous forme de carte à conserver sur soi." },
  { icon: "police", title: "Présentation au contrôle", text: "Le conducteur présente la carte, vérifiée à l’œil par l’agent." },
  { icon: "guichet", title: "Démarches en présentiel", text: "Duplicata et mutation passent par le guichet." },
  { icon: "alert", title: "Perte, vol, falsification", text: "Un document perdu ou imité est difficile à contrôler." },
  { icon: "clock", title: "Déplacements et délais", text: "Trajets, files d’attente et temps de traitement." },
] as const;

export const DEFIS = [
  { icon: "shield", title: "Sécurité documentaire", text: "Garantir que le titre présenté est authentique." },
  { icon: "simplify", title: "Simplification administrative", text: "Moins de pièces, moins d’étapes." },
  { icon: "clock", title: "Réduction des délais", text: "Raccourcir le temps entre demande et délivrance." },
  { icon: "access", title: "Accessibilité des services", text: "Des démarches possibles sans se déplacer." },
  { icon: "fraud", title: "Lutte contre la fraude", text: "Rendre l’imitation du titre inutile." },
  { icon: "police", title: "Modernisation des contrôles", text: "Une vérification rapide et fiable sur le terrain." },
] as const;

export const AUJOURDHUI = [
  "Carte grise physique",
  "Vérification visuelle",
  "Déplacements au guichet",
  "Procédures administratives classiques",
  "Gestion documentaire papier",
];

export const DEMAIN = [
  "Carte grise accessible sur smartphone",
  "Vérification numérique par QR code",
  "Demandes en ligne",
  "Suivi du dossier, selon les fonctionnalités retenues",
  "Moins de déplacements, démarches simplifiées",
];

export const OBJECTIFS = [
  "Dématérialiser la carte grise",
  "Sécuriser la vérification de son authenticité",
  "Simplifier les demandes de duplicata",
  "Faciliter les mutations de propriété",
  "Améliorer le suivi des dossiers",
  "Réduire les déplacements et les délais administratifs",
];

export const RESULTATS = [
  { icon: "phone", title: "Carte grise accessible sur mobile" },
  { icon: "qr", title: "Contrôle routier assisté par QR code" },
  { icon: "cloud", title: "Démarches administratives dématérialisées" },
  { icon: "track", title: "Suivi numérique des demandes" },
  { icon: "fraud", title: "Réduction potentielle des risques de fraude" },
  { icon: "smile", title: "Amélioration de l’expérience usager" },
] as const;

export const ECOSYSTEME = [
  { sigle: "NARSA", nom: "Agence nationale de la sécurité routière", role: "Porteur du projet" },
  { sigle: "MTL", nom: "Ministère du Transport et de la Logistique", role: "Tutelle, cadre réglementaire" },
  { sigle: "DGSN", nom: "Direction Générale de la Sûreté Nationale", role: "Contrôles, identité numérique" },
  { sigle: "GR", nom: "Gendarmerie Royale", role: "Contrôles routiers" },
  { sigle: "ADD", nom: "Agence de Développement du Digital", role: "Interopérabilité, architecture" },
  { sigle: "ASS", nom: "Compagnies d’assurance", role: "Vérification des informations" },
  { sigle: "CON", nom: "Concessionnaires automobiles", role: "Vente et mutation" },
];
