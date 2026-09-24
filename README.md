# Charisma Guests

Site + base de données des invités musicaux ayant participé aux cultes de l'église **Charisma** : leurs chansons, la présence de déchants, le statut de traduction, et les fichiers disponibles.

- **Site public** : liste des invités et de leurs chansons.
- **`/admin`** : interface de gestion ([Decap CMS](https://decapcms.org/)) pour ajouter/modifier un invité ou une chanson sans toucher au code. Chaque modification crée un commit dans ce dépôt GitHub (GitHub = backend de la base de données), qui redéploie automatiquement le site sur Netlify.

## Objectif

Pour chaque invité qui est déjà venu à l'église :

- Lister ses chansons et, quand il en existe un, le **déchant** utilisé dans l'église.
- Si la chanson est **déjà traduite et disponible** dans les fichiers de l'église → attacher le fichier (PPTX, paroles...) à la chanson.
- Si elle **n'est pas traduite / pas disponible** → renseigner le lien vers la **vidéo YouTube originale** produite par l'invité (avec tous les éléments d'origine).

Ce dépôt démarre petit ; à terme il doit couvrir tous les invités et toutes leurs venues.

## Structure

```
site/                          # code du site (Eleventy)
site/content/invites/*.md      # un fichier = un invité (nom, slug, liste de chansons) — géré via /admin
uploads/<slug>/...             # fichiers attachés aux chansons (uploadés via /admin)
admin/                         # panneau Decap CMS (config.yml + index.html)
netlify.toml                   # config de déploiement Netlify
```

## Développement local

```bash
npm install
npm run dev     # site local avec rechargement
npm run build   # build de production dans _site/
```

## Statut actuel

Invités identifiés dans le dossier Drive **CHARISMA → INVITÉS MUSICAUX** (au 2026-09-24) :

- Jordan Smith
- Family Choir
- Sinach

Leurs dossiers Drive sont pour l'instant vides — aucune chanson/fichier n'a encore été trouvé à importer. Les fiches correspondantes existent déjà dans `site/content/invites/` et sont à compléter via `/admin` au fur et à mesure (années de venue, chansons, déchants, traductions, fichiers ou liens YouTube).

## Mise en place de l'authentification `/admin` (à faire une fois, manuellement)

Le CMS utilise GitHub comme backend directement. Pour que la connexion fonctionne :

1. Créer une [GitHub OAuth App](https://github.com/settings/applications/new) avec comme *Authorization callback URL* : `https://api.netlify.com/auth/done`.
2. Dans le site Netlify (Site settings → général → **OAuth**), enregistrer le *Client ID* et le *Client Secret* de cette OAuth App, avec le provider GitHub.

Tant que ce n'est pas fait, le site public fonctionne normalement mais `/admin` ne pourra pas se connecter.
