# Charisma Guests

Base de données des invités musicaux ayant participé aux cultes de l'église **Charisma** : leurs chansons, la présence de déchants, le statut de traduction, et les fichiers disponibles.

## Objectif

Pour chaque invité qui est déjà venu à l'église :

- Lister ses chansons et, quand il en existe un, le **déchant** utilisé dans l'église.
- Si la chanson est **déjà traduite et disponible** dans les fichiers de l'église → récupérer le PPTX (ou autre fichier) et le classer dans le dossier de l'invité, trié par année de présence.
- Si elle **n'est pas traduite / pas disponible** → renvoyer vers la **vidéo YouTube originale** produite par l'invité (avec tous les éléments d'origine : chant, déchant, etc.).

Ce dépôt démarre petit ; à terme il doit couvrir tous les invités et toutes leurs venues (base de données plus large : setlists par culte, historique, recherche, etc.).

## Structure

```
data/invites.csv        # index central (une ligne par chanson/invité/année)
invites/<Nom>/<Année>/   # fichiers récupérés (PPTX, paroles...) une fois traduits et disponibles
```

## Colonnes de `data/invites.csv`

| Colonne | Description |
|---|---|
| `invite` | Nom de l'invité / groupe |
| `annee` | Année de la venue à l'église |
| `chanson` | Titre de la chanson |
| `dechant_present` | `oui` / `non` — un déchant est-il utilisé dans l'église pour cette chanson |
| `traduit_disponible` | `oui` / `non` — traduction dispo dans les fichiers de l'église |
| `fichier_local` | Chemin vers le fichier dans `invites/<Nom>/<Année>/` si `traduit_disponible = oui` |
| `lien_youtube` | Lien vers la vidéo originale de l'invité si `traduit_disponible = non` |
| `notes` | Notes libres |

## Statut actuel

Invités identifiés dans le dossier Drive **CHARISMA → INVITÉS MUSICAUX** (au 2026-09-24) :

- Jordan Smith
- Family Choir
- Sinach

Leurs dossiers Drive sont pour l'instant vides — aucune chanson/fichier n'a encore été renseigné. Les lignes correspondantes dans `data/invites.csv` sont à compléter au fur et à mesure (années de venue, chansons, déchants, traductions, fichiers ou liens YouTube).
