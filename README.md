# Carte grise numérique · Démonstrateur

Application web de présentation du projet **Carte grise numérique**, porté par la NARSA.
Prototype réalisé dans le cadre d’une formation en conduite du changement.

> Démonstrateur de projet — Les données et les vérifications présentées sont fictives. Cette application n’est pas un service administratif officiel et n’est pas connectée aux systèmes de la NARSA.

## Contenu

| Onglet | Ce qu’il montre |
|---|---|
| **Vision du projet** | Contexte, défis, comparaison Aujourd’hui / Demain, objectifs, résultats attendus (non chiffrés), acteurs concernés. |
| **Démonstrateur** | Carte grise sur smartphone, QR code scannable, mode usager (connexion simulée, duplicata, mutation, suivi de dossier) et mode agent (contrôle routier simulé, 3 scénarios). |
| **Application v2** (`#application-v2`) | Maquette « Ma carte grise numérique » : accueil, carte grise compacte et détaillée, vérification par QR, démarches, documents, profil, menu latéral, charte graphique. La v1 reste disponible (`#application`). |
| **Parcours usager** | Parcours actuel et cible, tableau filtrable des résistances et leviers, tableau d’indicateurs à compléter. |

### Scénarios de vérification

| Scénario | Contenu du QR | Résultat |
|---|---|---|
| QR reconnu | `CGN-DEMO:12345-A-6` | Vérification simulée réussie |
| Document signalé | `CGN-DEMO:67890-B-1` | Titre signalé dans le jeu fictif |
| QR invalide | `CGN-DEMO:00000-Z-99` | Vérification simulée échouée |

Le champ « Tester le contenu d’un QR code » du mode agent accepte n’importe quel texte.

## Installation locale

```bash
npm install
npm run dev        # serveur de développement
npm run build      # vérification TypeScript + compilation dans dist/
npm run preview    # aperçu de la version compilée
```

Node.js 20 ou plus récent.

## Structure

```
src/
  components/        composants partagés (logo, téléphone, carte grise, QR code)
  components/demo/   terminal agent, authentification simulée, démarches
  pages/             les trois onglets
  data/              textes, jeu de données fictif, acteurs, indicateurs, matrices QR
  services/          verification.ts : contrat de vérification + implémentation fictive
  hooks/             navigation par onglets (#vision, #demonstrateur, #parcours), stockage local
  styles/global.css  charte graphique (toutes les couleurs sont des variables en tête de fichier)
public/assets/       emplacement du logo
.github/workflows/   déploiement automatique sur GitHub Pages
```

## Modifier le contenu

- **Textes de la vision** : `src/data/project.ts`
- **Véhicules fictifs** : `src/data/demo.ts`
- **Résistances et leviers** : `src/data/actors.ts`
- **Indicateurs** : `src/data/indicators.ts`
- **Couleurs** : variables `--c-*` au début de `src/styles/global.css`

Chaque `git push` sur la branche `main` recompile et republie le site.

### Logo NARSA

Le logo officiel n’est pas inclus. Après accord du service communication de la NARSA,
déposez le fichier sous `public/assets/logo-narsa.svg` (ou `logo-narsa.png`).
Il remplacera automatiquement l’emplacement réservé dans l’en-tête, la page d’accueil,
l’espace usager et le pied de page.

### QR codes

Les plaques suivent le format marocain : numéro (1 à 5 chiffres) | lettre arabe | code région (1 à 89). Dans le QR code, la lettre est codée en latin (أ = A, ب = B…).

Les matrices de `src/data/qr.ts` ont été générées hors ligne et vérifiées par décodage.
Pour ajouter un QR code, générez une matrice (1 = module noir) pour un contenu `CGN-DEMO:<numéro>-<lettre latine>-<région>`.

## Évolution vers un service réel

`src/services/verification.ts` définit l’interface `VerificationService`. Le prototype utilise
`MockVerificationService`, qui ne lit que le jeu de données fictif. Une intégration réelle
nécessitera un service autorisé connecté aux systèmes de référence, après validation
institutionnelle. Aucun secret ni clé n’est présent dans ce dépôt.

## Limites du prototype

- Aucune caméra : le scan est simulé.
- Aucune donnée personnelle n’est collectée. Les dossiers et indicateurs saisis restent dans le navigateur (`localStorage`).
- La connexion à l’espace usager est une animation, sans identifiant ni mot de passe.
