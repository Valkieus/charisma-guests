# Suite Sara — 3 applications RH & projet

Trois applications web autonomes (HTML + JavaScript, sans serveur), reliées entre elles.

| Application | Rôle | URL |
|---|---|---|
| **Pilote** (`pilote/`) | Gestion de projet simple et pas chère : comptes et rôles, projets, Kanban, Gantt, jalons, risques, budget, processus en 5 phases, académie de formation intégrée (8 formations + quiz + attestation). | https://pilote-projets-sara.netlify.app |
| **RH Studio** (`rh-studio/`) | Logiciel RH complet, secteur privé **ou** fonction publique : dossiers salariés / agents, organigramme, congés et absences (décompte ouvrés / ouvrables, jours fériés), recrutement (pipeline), intégration, entretiens, formation, projets RH, paie simplifiée (traitement indiciaire, NBI, SFT, IFSE…), documents (arrêtés, contrats, attestations), obligations par seuil d'effectif, rapports (pyramide des âges, turnover, absentéisme), comptes et espace salarié. **Parcours de simulation sur 3 ans** : une PME privée et une commune (FPT), 31 missions vérifiées automatiquement ou à choix argumenté. | https://rh-studio-sara.netlify.app |
| **Garé Gratuit IDF** (`parking/`) | Trouver des places de parking gratuites en Île-de-France : recherche d'adresse (Base Adresse Nationale) ou « autour de moi », rayon réglable, carte Leaflet, parkings gratuits / gratuits sous conditions / à vérifier et rues gratuites issus d'OpenStreetMap (API Overpass, interrogée en direct depuis le navigateur), filtres (accès public, PMR, recharge, couvert, sans limite de durée), itinéraire Google Maps / Waze, favoris, règles de stationnement en IDF. | https://gare-gratuit-idf.netlify.app |
| **Sara HR** (`sara-hr/`) | Plateforme de formation RH : 16 modules (privé, public, communs), 56 leçons, 110 questions de quiz, 170 flashcards à répétition espacée, 16 cas pratiques, fiches mémo imprimables, glossaire de 117 sigles, 5 jeux (Sigle Rush, Memory, Vrai/Faux chrono, Privé ou public, jeu de rôle « Ma première année de responsable RH »), défi du jour, examens blancs chronométrés, examen final avec attestation, XP / niveaux / badges, carnet de notes. | https://sara-hr.netlify.app |

## Données

Tout est enregistré dans le navigateur (localStorage). Chaque application propose un export / import JSON pour sauvegarder ou changer d'appareil. Les mots de passe sont hachés (SHA-256 salé), mais ce n'est pas un système d'authentification serveur : ne pas y stocker de données personnelles réelles sensibles sans ajouter un backend.

## Construire

```bash
node build.mjs            # génère dist/<app>/index.html (un fichier autonome par app)
node build.mjs sara-hr   # une seule app
```

Sources : `shared/` (styles et outils communs), puis un dossier par application. `dist/` contient les fichiers publiés.

## Avertissement

Les contenus réglementaires (valeur du point, SMIC, taux, durées) sont des repères pédagogiques arrêtés fin 2026 : vérifier sur service-public.fr / legifrance.gouv.fr avant tout usage réel. Les valeurs de paie sont modifiables dans les paramètres de RH Studio.
