# Church Guests

Site + base de données des invités musicaux et événements d'une église : leurs chansons, la présence de déchants, le statut de traduction en français, et les fichiers disponibles (avec aperçu direct dans le navigateur).

- **Site public** : une barre latérale liste tous les invités/événements ; on choisit un nom pour voir son mini-dashboard (nombre de fichiers, combien sont déjà traduits en français), la liste de ses fichiers (aperçu direct, sans téléchargement), et un panneau avec ses chansons YouTube en ligne et ses featurings.
- **`/admin`** : interface de gestion ([Decap CMS](https://decapcms.org/)) pour ajouter/modifier un invité, une chanson ou un fichier sans toucher au code. Chaque modification crée un commit dans ce dépôt GitHub, qui redéploie automatiquement le site sur Netlify. Un bouton "+ Ajouter / modifier un fichier" sur la fiche de chaque invité ouvre directement son formulaire d'édition.

## Structure

```
site/                          # code du site (Eleventy)
site/content/invites/*.md      # un fichier = un invité/événement — géré via /admin
site/invites-data.11ty.js      # génère /invites.json consommé par l'app (site/app.js)
site/app.js                    # interface (barre latérale, dashboard, aperçus, YouTube)
uploads/<slug>/...             # fichiers attachés (uploadés via /admin)
admin/                         # panneau Decap CMS (config.yml + index.html)
netlify.toml                   # config de déploiement Netlify
```

## Schéma d'une fiche

- `nom`, `slug`, `type` (Invité externe / Événement / Équipe interne / Autre-Divers), `notes`
- `chansons[]` : année, titre, déchant présent, traduit/disponible, fichier ou lien YouTube
- `documents[]` : libellé, fichier, **traduit en français** (oui/non)
- `liens_youtube[]` : titre + lien — chansons de l'invité actuellement en ligne sur YouTube
- `collaborations[]` : featurings de l'invité (nom + lien optionnel)

## Développement local

```bash
npm install
npm run dev     # site local avec rechargement
npm run build   # build de production dans _site/
```

## Authentification `/admin`

Le CMS utilise **Netlify Identity + Git Gateway** (GitHub proposé comme provider par défaut, pas besoin de créer sa propre OAuth App) :

1. Site Netlify → **Identity** → activer si besoin.
2. Onglet **Services** → **Git Gateway** → Enable.
3. Onglet **Registration** → passer en **Invite only**, puis **Users** → inviter les comptes autorisés à éditer.

## Import initial

Les invités et fichiers ont été importés depuis un dossier Google Drive partagé (PPTX/DOC des chansons des invités et des événements de l'église). Certains fichiers volumineux (>10 Mo) ou renvoyés par l'API dans un format peu fiable à transcrire n'ont pas pu être importés automatiquement ; ces cas sont documentés dans le champ `notes` de la fiche concernée.
