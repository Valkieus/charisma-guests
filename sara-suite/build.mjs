// Assemble chaque application en un seul fichier HTML autonome (dist/<app>/index.html).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const APPS = {
  pilote: {
    title: 'Pilote Projets', description: 'Gestion de projet simple et pas chère : Kanban, Gantt, risques, budget et académie intégrée.',
    accent: '#4f46e5', icon: '📋', css: ['shared/base.css'], js: ['shared/core.js', 'pilote/academy.js', 'pilote/app.js'],
  },
  'rh-studio': {
    title: 'RH Studio', description: 'Logiciel RH complet (privé et fonction publique) avec un parcours de simulation pour s\'entraîner.',
    accent: '#0f766e', icon: '🗂️', css: ['shared/base.css'], js: ['shared/core.js', 'rh-studio/data.js', 'rh-studio/missions.js', 'rh-studio/app.js'],
  },
  'sara-hr': {
    title: 'Sara HR', description: 'Plateforme de formation RH : cours, flashcards, quiz, jeux et évaluations, privé et public.',
    accent: '#be185d', icon: '🎓', css: ['shared/base.css', 'sara-hr/style.css'],
    js: ['shared/core.js', 'sara-hr/content-1.js', 'sara-hr/content-2.js', 'sara-hr/content-3.js', 'sara-hr/glossary.js', 'sara-hr/games.js', 'sara-hr/app.js'],
  },
  parking: {
    title: 'Garé Gratuit', description: 'Trouver des places de parking gratuites en Île-de-France autour d\'une adresse ou de sa position.',
    accent: '#15803d', icon: '🅿️', css: ['shared/base.css', 'parking/vendor/leaflet.css', 'parking/style.css'], js: ['shared/core.js', 'parking/vendor/leaflet.js', 'parking/app.js'],
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
  // Netlify : publier ce dossier tel quel (dossier de base = sara-suite/dist/<app>)
  writeFileSync(`dist/${id}/netlify.toml`, '[build]\n  command = "echo static"\n  publish = "."\n');
  // Variante pour une page claude.ai (le squelette html/head/body est ajouté à la publication)
  mkdirSync('dist/artifacts', { recursive: true });
  writeFileSync(`dist/artifacts/${id}.html`, html.replace(/^[\s\S]*?<head>\n/, '').replace('</head>\n<body>\n', '').replace('</body>\n</html>\n', ''));
  console.log(`dist/${id}/index.html  ${(html.length / 1024).toFixed(0)} Ko`);
}
