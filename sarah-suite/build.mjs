// Assemble chaque application en un seul fichier HTML autonome (dist/<app>/index.html).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const APPS = {
  pilote: {
    title: 'Pilote — Projets', description: 'Gestion de projet simple et pas chère : Kanban, Gantt, risques, budget et académie intégrée.',
    accent: '#4f46e5', icon: '📋', css: ['shared/base.css'], js: ['shared/core.js', 'pilote/academy.js', 'pilote/app.js'],
  },
  'rh-studio': {
    title: 'RH Studio', description: 'Logiciel RH complet (privé et fonction publique) avec un parcours de simulation pour s\'entraîner.',
    accent: '#0f766e', icon: '🗂️', css: ['shared/base.css'], js: ['shared/core.js', 'rh-studio/data.js', 'rh-studio/missions.js', 'rh-studio/app.js'],
  },
  'sarah-hr': {
    title: 'Sarah HR', description: 'Plateforme de formation RH : cours, flashcards, quiz, jeux et évaluations, privé et public.',
    accent: '#be185d', icon: '🎓', css: ['shared/base.css', 'sarah-hr/style.css'],
    js: ['shared/core.js', 'sarah-hr/content-1.js', 'sarah-hr/content-2.js', 'sarah-hr/content-3.js', 'sarah-hr/glossary.js', 'sarah-hr/games.js', 'sarah-hr/app.js'],
  },
};

const only = process.argv[2];
for (const [id, a] of Object.entries(APPS)) {
  if (only && only !== id) continue;
  const css = a.css.map((f) => readFileSync(f, 'utf8')).join('\n');
  const js = a.js.map((f) => `/* ---- ${f} ---- */\n` + readFileSync(f, 'utf8')).join('\n');
  const accent = `:root{--accent:${a.accent}}`;
  const favicon = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${a.icon}</text></svg>`)}`;
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${a.title}</title>
<meta name="description" content="${a.description}">
<link rel="icon" href="${favicon}">
<style>
${css}
${accent}
</style>
</head>
<body>
<noscript>Cette application nécessite JavaScript.</noscript>
<script>
${js.replace(/<\/script/gi, '<\\/script')}
</script>
</body>
</html>
`;
  mkdirSync(`dist/${id}`, { recursive: true });
  writeFileSync(`dist/${id}/index.html`, html);
  console.log(`dist/${id}/index.html  ${(html.length / 1024).toFixed(0)} Ko`);
}
