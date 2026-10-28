/* Sarah HR — plateforme de formation RH */
const store = makeStore('sarahhr:');
const auth = makeAuth(store);
const toggleTheme = themeToggle(store);
const LEVELS = [[0, 'Stagiaire RH'], [200, 'Gestionnaire RH'], [500, 'Chargée RH'], [1000, 'Responsable RH'], [2000, 'DRH en devenir'], [3500, 'Experte statutaire']];
const BOX_DAYS = [0, 1, 3, 7, 15, 30];
const TAGS = { pub: ['Public', 'tagpub'], public: ['Public', 'tagpub'], prive: ['Privé', 'tagpriv'], priv: ['Privé', 'tagpriv'], commun: ['Public & privé', 'tagcom'], com: ['Public & privé', 'tagcom'] };
const BADGES = [
  ['first_lesson', '📖', 'Première leçon'], ['first_quiz', '✅', 'Premier quiz'], ['perfect', '💯', 'Quiz parfait'], ['cards50', '🃏', '50 cartes révisées'],
  ['streak3', '🔥', '3 jours d\'affilée'], ['streak7', '🏅', '7 jours d\'affilée'], ['rush15', '⚡', '15 sigles en 60 s'], ['story', '🎭', 'Année RH terminée'],
  ['exam70', '🎓', 'Examen réussi (70 %)'], ['exam90', '🏆', 'Examen brillant (90 %)'], ['allmods', '🌟', 'Tous les modules validés'], ['daily', '☀️', 'Défi du jour'],
];
let ME = null, main = null;
const modById = (id) => MODULES.find((m) => m.id === id);
const tagBadge = (t) => `<span class="badge ${TAGS[t][1]}">${TAGS[t][0]}</span>`;

/* ---------- Progression ---------- */
const progKey = () => 'prog:' + ME.id;
function P() { return { xp: 0, read: {}, quiz: {}, cards: {}, cases: {}, games: {}, exams: [], notes: {}, streak: { last: '', count: 0 }, badges: {}, daily: {}, reviews: 0, ...store.get(progKey(), {}) }; }
function saveP(p) { store.set(progKey(), p); }
function award(p, id) { if (!p.badges[id]) { p.badges[id] = todayISO(); const b = BADGES.find((x) => x[0] === id); setTimeout(() => toast(`Badge débloqué : ${b[1]} ${b[2]}`, 3500), 300); } }
function addXP(n, fn) {
  const p = P(); p.xp += Math.round(n); fn?.(p);
  const t = todayISO();
  if (p.streak.last !== t) { p.streak.count = p.streak.last === addDays(t, -1) ? p.streak.count + 1 : 1; p.streak.last = t; }
  if (p.streak.count >= 3) award(p, 'streak3'); if (p.streak.count >= 7) award(p, 'streak7');
  if (MODULES.every((m) => (p.quiz[m.id]?.best || 0) >= 70)) award(p, 'allmods');
  saveP(p); refreshSide(p); return p;
}
function level(xp) { let i = 0; LEVELS.forEach(([min], k) => { if (xp >= min) i = k; }); const next = LEVELS[i + 1]; return { name: LEVELS[i][1], idx: i, pct: next ? ((xp - LEVELS[i][0]) / (next[0] - LEVELS[i][0])) * 100 : 100, next: next ? next[0] - xp : 0 }; }
function modProgress(p, m) {
  const read = Object.keys(p.read[m.id] || {}).length;
  const best = p.quiz[m.id]?.best || 0;
  const pct = Math.round(((read / m.lessons.length) * 0.5 + Math.min(1, best / 70) * 0.5) * 100);
  return { read, best, pct, done: read === m.lessons.length && best >= 70 };
}
function allCards() {
  const out = [];
  MODULES.forEach((m) => m.cards.forEach(([f, b], i) => out.push({ id: `${m.id}:${i}`, f, b, mod: m })));
  return out;
}
function glossCards() { return GLOSSARY.map(([t, d, s]) => ({ id: 'g:' + t, f: t, b: d, tag: s })); }
function dueCards(p, list) { const t = todayISO(); return list.filter((c) => !p.cards[c.id] || p.cards[c.id].due <= t); }
function allQuestions(filter) { const out = []; MODULES.forEach((m) => { if (!filter || filter(m)) m.quiz.forEach((q) => out.push({ ...q, mod: m })); }); return out; }

/* ---------- Connexion ---------- */
function authPage(signup) {
  const users = auth.users();
  document.body.innerHTML = `<div class="auth"><div class="box" style="width:min(460px,100%)">
    <div class="hero" style="text-align:center"><div style="font-size:2.6rem">🎓</div><h1>Sarah HR</h1><p class="muted" style="margin:0">Ta plateforme pour maîtriser les RH, du privé au public.</p></div>
    <form class="card" id="f"><h2>${signup ? 'Créer mon profil' : 'Me connecter'}</h2>
    ${fInput('name', 'Prénom', signup ? 'Sarah' : (users[0]?.name || ''), { req: true })}${fInput('password', 'Mot de passe', '', { type: 'password', req: true })}
    <button class="btn primary big-btn" style="width:100%;justify-content:center">${signup ? 'Commencer ma formation' : 'Entrer'}</button>
    <p class="muted" style="text-align:center;margin-top:12px">${signup ? (users.length ? '<a href="#/login">J\'ai déjà un profil</a>' : '') : '<a href="#/signup">Créer un nouveau profil</a>'}</p></form></div></div>`;
  $('#f').onsubmit = async (e) => {
    e.preventDefault(); const fd = Object.fromEntries(new FormData(e.target).entries()); const id = norm(fd.name).replace(/\s+/g, '.') + '@sarah-hr';
    try { if (signup) await auth.create({ name: fd.name, email: id, password: fd.password, role: 'learner', wsId: 'local' }); await auth.login(id, fd.password); location.hash = '#/home'; boot(); }
    catch (err) { toast(err.message.replace('E-mail', 'Prénom').replace('cet e-mail', 'ce prénom')); }
  };
}
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

function refreshSide(p = P()) {
  const lv = level(p.xp); const el = $('#sideLv'); if (!el) return;
  el.innerHTML = `<div class="row between"><strong style="color:var(--text)">${lv.name}</strong><span>${p.xp} XP</span></div>${bar(lv.pct)}<div class="row between" style="margin-top:4px"><small>🔥 ${p.streak.last === todayISO() || p.streak.last === addDays(todayISO(), -1) ? p.streak.count : 0} jour(s)</small><small>${lv.next ? lv.next + ' XP → niveau suivant' : 'Niveau max'}</small></div>`;
}

function boot() {
  ME = auth.current();
  if (!ME) return authPage(!auth.users().length || location.hash.includes('signup'));
  const p = P(); const due = dueCards(p, allCards()).length;
  main = shell({ brand: 'Sarah HR', logo: '🎓', current: 'sarah',
    nav: navLink('home', '🏠', 'Accueil') + navLink('paths', '🧭', 'Mes parcours') + navLink('modules', '📚', 'Tous les modules') +
      '<div class="sec">S\'entraîner</div>' + navLink('review', '🃏', 'Révisions', due ? ` <span class="badge acc" style="margin-left:auto">${due}</span>` : '') + navLink('games', '🎮', 'Jeux') + navLink('cases', '🧩', 'Cas pratiques') + navLink('exams', '📝', 'Évaluations') +
      '<div class="sec">Ressources</div>' + navLink('glossary', '🔤', 'Glossaire des sigles') + navLink('memos', '📌', 'Fiches mémo') + navLink('resources', '🔗', 'Sources officielles') + navLink('notes', '✏️', 'Mon carnet') + navLink('profile', '👤', 'Mon profil'),
    foot: `<div id="sideLv"></div><div class="row" style="margin-top:8px"><button class="btn sm" id="th">🌓</button><button class="btn sm" id="lo">Déconnexion</button></div>` });
  refreshSide(p);
  $('#lo').onclick = () => { auth.logout(); location.hash = '#/login'; boot(); };
  $('#th').onclick = toggleTheme;
  router.run();
}

/* ---------- Vues ---------- */
const view = {
  home() {
    const p = P(); const lv = level(p.xp); const due = dueCards(p, allCards()).length;
    const path = PATHS[0]; const next = path.modules.map(modById).find((m) => !modProgress(p, m).done);
    const doneMods = MODULES.filter((m) => modProgress(p, m).done).length;
    const dailyDone = p.daily[todayISO()];
    main.innerHTML = `<div class="hero"><div class="row between"><div><h1>Bonjour ${esc(ME.name)} 👋</h1><p class="muted" style="margin:0">${lv.name} · ${p.xp} XP · 🔥 ${p.streak.last >= addDays(todayISO(), -1) ? p.streak.count : 0} jour(s) d'affilée</p></div><div style="font-size:2.4rem">${['🌱', '🌿', '🌳', '⭐', '🌟', '👑'][lv.idx]}</div></div>
      <div style="margin-top:12px">${bar(lv.pct)}</div><small>${lv.next ? `Encore ${lv.next} XP pour le niveau suivant` : 'Niveau maximum atteint !'}</small></div>
      <div class="grid g3">
        <div class="card"><h3>☀️ Défi du jour</h3><p class="muted">5 cartes + 5 questions, environ 5 minutes. +30 XP bonus.</p>${dailyDone ? '<span class="badge ok">Fait aujourd\'hui ✓</span>' : '<a class="btn primary" href="#/daily">Relever le défi</a>'}</div>
        <div class="card"><h3>🧭 Continuer</h3>${next ? `<p><strong>${next.ico} ${esc(next.title)}</strong></p><a class="btn primary" href="#/module/${next.id}">Reprendre</a>` : '<p>Parcours « public » terminé 🎉</p><a class="btn" href="#/exams">Passer l\'examen final</a>'}</div>
        <div class="card"><h3>🃏 Révisions</h3><p><strong>${due}</strong> carte(s) à revoir aujourd'hui.</p><a class="btn ${due ? 'primary' : ''}" href="#/review">Réviser</a></div>
      </div>
      <div class="card"><div class="row between"><h3>Ma progression</h3><span>${doneMods} / ${MODULES.length} modules validés</span></div>
        <div class="grid g4" style="margin-top:8px">${MODULES.map((m) => { const mp = modProgress(p, m); return `<a href="#/module/${m.id}" class="mod-card" style="background:var(--panel-2);border-radius:10px;padding:10px"><div class="row between"><span>${m.ico}</span><small>${mp.done ? '✅' : mp.pct + ' %'}</small></div><small style="color:var(--text);font-weight:600">${esc(m.title)}</small>${bar(mp.pct)}</a>`; }).join('')}</div></div>
      <div class="card"><h3>Mes badges</h3><div class="grid g4" style="grid-template-columns:repeat(auto-fill,minmax(110px,1fr))">${BADGES.map(([id, i, t]) => `<div class="badge-big ${p.badges[id] ? '' : 'locked'}"><span class="i">${i}</span>${t}</div>`).join('')}</div></div>
      <div class="alert">💡 <strong>Conseil :</strong> commence par le module <a href="#/module/passerelle">« Du privé au public »</a> et garde le <a href="#/glossary">glossaire</a> ouvert quand on te parle en sigles. Pour t'entraîner sur un vrai logiciel RH, ouvre <a href="${SUITE[1].url}" target="_blank" rel="noopener">RH Studio</a> et son parcours de simulation.</div>`;
  },

  paths() {
    const p = P();
    main.innerHTML = `<div class="page-head"><div><h1>Mes parcours</h1><p>Des chemins guidés à travers les modules.</p></div></div>` + PATHS.map((pa) => {
      const mods = pa.modules.map(modById); const done = mods.filter((m) => modProgress(p, m).done).length;
      return `<div class="card"><div class="row between"><h3>${pa.ico} ${esc(pa.title)}</h3><span>${done} / ${mods.length}</span></div><p class="muted">${esc(pa.desc)}</p>${bar((done / mods.length) * 100)}
        <ol style="margin-top:12px">${mods.map((m) => { const mp = modProgress(p, m); return `<li style="margin-bottom:6px"><a href="#/module/${m.id}">${m.ico} ${esc(m.title)}</a> ${mp.done ? '<span class="badge ok">validé</span>' : mp.pct ? `<span class="badge">${mp.pct} %</span>` : ''}</li>`; }).join('')}</ol></div>`;
    }).join('');
  },

  modules() {
    const p = P(); const f = store.get('modFilter', '');
    main.innerHTML = `<div class="page-head"><div><h1>Tous les modules</h1><p>${MODULES.length} modules · ${MODULES.reduce((s, m) => s + m.lessons.length, 0)} leçons · ${allQuestions().length} questions · ${allCards().length} flashcards</p></div>
      <div class="row">${[['', 'Tous'], ['public', 'Public'], ['prive', 'Privé'], ['commun', 'Communs']].map(([k, l]) => `<button class="btn sm ${f === k ? 'primary' : ''}" data-f="${k}">${l}</button>`).join('')}</div></div>
      <div class="grid g3">${MODULES.filter((m) => !f || m.tag === f).map((m) => { const mp = modProgress(p, m); return `<a class="card mod-card" href="#/module/${m.id}"><div class="row between"><span class="mod-ico">${m.ico}</span>${tagBadge(m.tag)}</div><h3 style="margin:0">${esc(m.title)}</h3><p class="muted" style="margin:0;flex:1">${esc(m.summary)}</p>
        <small>${m.lessons.length} leçons · ${m.quiz.length} questions · ${m.cards.length} cartes · ${m.level}</small>${bar(mp.pct)}<small>${mp.done ? '✅ Validé' : `Quiz : ${mp.best ? mp.best + ' %' : 'non passé'}`}</small></a>`; }).join('')}</div>`;
    $$('[data-f]').forEach((b) => b.onclick = () => { store.set('modFilter', b.dataset.f); view.modules(); });
  },

  module(id, tab = 'cours', arg) {
    const m = modById(id); if (!m) return view.modules();
    const p = P(); const mp = modProgress(p, m);
    const tabs = [['cours', '📖 Cours'], ['memo', '📌 Fiche mémo'], ['cards', '🃏 Flashcards'], ['quiz', '❓ Quiz'], ['cases', '🧩 Cas pratique'], ['notes', '✏️ Mes notes']];
    main.innerHTML = `<div class="page-head"><div><a href="#/modules" class="muted">← Modules</a><h1 style="margin-top:6px">${m.ico} ${esc(m.title)}</h1><p>${tagBadge(m.tag)} · ${m.level} · ${mp.read}/${m.lessons.length} leçons lues · meilleur quiz : ${mp.best ? mp.best + ' %' : '—'}</p></div></div>
      <div class="tabs">${tabs.map(([k, l]) => `<a href="#/module/${m.id}/${k}" class="${k === tab ? 'active' : ''}">${l}</a>`).join('')}</div><div id="tab"></div>`;
    const el = $('#tab');
    ({ cours: () => lessonView(el, m, Number(arg || 0)), memo: () => memoView(el, m), cards: () => flashSession(el, m.cards.map(([f, b], i) => ({ id: `${m.id}:${i}`, f, b, mod: m })), { all: true }),
      quiz: () => quizStart(el, m), cases: () => casesView(el, m.cases.map((c, i) => ({ ...c, id: `${m.id}:${i}`, mod: m }))), notes: () => notesView(el, m) }[tab] || (() => lessonView(el, m, 0)))();
  },

  review() {
    const p = P(); const mode = store.get('reviewMode', 'modules');
    const pool = mode === 'gloss' ? glossCards() : mode === 'both' ? [...allCards(), ...glossCards()] : allCards();
    const due = dueCards(p, pool);
    const boxes = [0, 1, 2, 3, 4, 5].map((b) => pool.filter((c) => (p.cards[c.id]?.box || 0) === b).length);
    main.innerHTML = `<div class="page-head"><div><h1>Révisions espacées</h1><p>Chaque carte revient au bon moment : 1, 3, 7, 15 puis 30 jours si tu la sais. Si tu te trompes, elle revient vite.</p></div>
      <div class="row">${[['modules', 'Cartes des cours'], ['gloss', 'Glossaire'], ['both', 'Tout']].map(([k, l]) => `<button class="btn sm ${mode === k ? 'primary' : ''}" data-mode="${k}">${l}</button>`).join('')}</div></div>
      <div class="card"><div class="row between"><strong>${due.length} carte(s) à revoir aujourd'hui</strong><small>${pool.length} cartes au total</small></div>
      <div class="grid" style="grid-template-columns:repeat(6,1fr);gap:6px;margin-top:10px">${boxes.map((n, b) => `<div style="text-align:center;background:var(--panel-2);border-radius:8px;padding:6px"><small>${b === 0 ? 'Nouvelles' : 'Boîte ' + b}</small><div style="font-weight:800">${n}</div></div>`).join('')}</div></div><div id="sess"></div>`;
    $$('[data-mode]').forEach((b) => b.onclick = () => { store.set('reviewMode', b.dataset.mode); view.review(); });
    flashSession($('#sess'), shuffle(due).slice(0, 30), { emptyMsg: 'Rien à réviser pour aujourd\'hui. Reviens demain, ou change de paquet ci-dessus.' });
  },

  daily() {
    const p = P();
    const cards = pick(dueCards(p, allCards()).length >= 5 ? dueCards(p, allCards()) : allCards(), 5);
    const qs = pick(allQuestions(), 5);
    main.innerHTML = `<div class="page-head"><div><h1>☀️ Défi du jour</h1><p>Étape 1 : 5 flashcards · Étape 2 : 5 questions</p></div></div><div id="d"></div>`;
    flashSession($('#d'), cards, { onDone: () => {
      $('#d').innerHTML = '<h2>Étape 2 : 5 questions</h2><div id="q"></div>';
      runQuiz($('#q'), qs, { onFinish: (score, total) => {
        const pp = addXP(30 + score * 2, (x) => { x.daily[todayISO()] = { score, total }; award(x, 'daily'); });
        $('#d').innerHTML = `<div class="card" style="text-align:center"><div style="font-size:3rem">${score >= 4 ? '🌟' : '👍'}</div><h2>Défi terminé : ${score} / ${total}</h2><p>+${30 + score * 2} XP · série : 🔥 ${pp.streak.count} jour(s)</p><a class="btn primary" href="#/home">Retour à l'accueil</a></div>`;
      } });
    } });
  },

  games(game) {
    if (game) return (GAMES[game] || GAMES.hub)();
    GAMES.hub();
  },

  cases() {
    const p = P(); const list = MODULES.flatMap((m) => m.cases.map((c, i) => ({ ...c, id: `${m.id}:${i}`, mod: m })));
    main.innerHTML = `<div class="page-head"><div><h1>Cas pratiques</h1><p>${list.length} situations réelles de service RH. Choisis la meilleure réponse et lis le débriefing.</p></div></div><div id="c"></div>`;
    casesView($('#c'), list, true);
  },

  exams(kind) {
    if (kind) return examRun(kind);
    const p = P();
    const nPub = allQuestions((m) => m.tag !== 'prive').length, nPriv = allQuestions((m) => m.tag !== 'public').length;
    main.innerHTML = `<div class="page-head"><div><h1>Évaluations</h1><p>Mode examen : pas de correction avant la fin, chronomètre, résultat détaillé par module.</p></div></div>
      <div class="grid g3">
        <div class="card"><h3>🏛️ Examen blanc — Fonction publique</h3><p class="muted">20 questions · 20 minutes · banque de ${nPub} questions</p><a class="btn primary" href="#/exams/public">Commencer</a></div>
        <div class="card"><h3>🏢 Examen blanc — Secteur privé</h3><p class="muted">20 questions · 20 minutes · banque de ${nPriv} questions</p><a class="btn primary" href="#/exams/prive">Commencer</a></div>
        <div class="card" style="border:2px solid var(--accent)"><h3>🎓 Examen final Sarah HR</h3><p class="muted">40 questions · 40 minutes · tous modules. 70 % pour obtenir l'attestation.</p><a class="btn primary" href="#/exams/final">Commencer</a></div>
      </div>
      <div class="card"><h3>Mes résultats</h3>${p.exams.length ? `<div class="table-wrap"><table><tr><th>Date</th><th>Examen</th><th>Score</th><th>Durée</th><th></th></tr>${p.exams.slice().reverse().map((x, i) => `<tr><td>${fmtDate(x.date)}</td><td>${esc(x.title)}</td><td><span class="badge ${x.pct >= 70 ? 'ok' : 'warn'}">${x.score} / ${x.total} (${x.pct} %)</span></td><td>${Math.round(x.dur / 60)} min</td><td>${x.kind === 'final' && x.pct >= 70 ? `<button class="btn sm" data-cert="${p.exams.length - 1 - i}">Attestation</button>` : ''}</td></tr>`).join('')}</table></div>` : '<p class="muted">Aucun examen passé.</p>'}</div>`;
    $$('[data-cert]').forEach((b) => b.onclick = () => certificate(P().exams[b.dataset.cert]));
  },

  glossary() {
    const q = store.get('glossQ', ''), f = store.get('glossF', '');
    main.innerHTML = `<div class="page-head"><div><h1>Glossaire des sigles</h1><p>${GLOSSARY.length} termes. Quand quelqu'un te parle en sigles, c'est ici !</p></div><a class="btn" href="#/games/rush">⚡ Jouer à Sigle Rush</a></div>
      <div class="card" style="margin-bottom:14px"><div class="row"><input id="gq" placeholder="Rechercher (ex. CAP, traitement, congé…)" value="${esc(q)}" style="flex:1;min-width:200px">${[['', 'Tous'], ['pub', 'Public'], ['priv', 'Privé'], ['com', 'Communs']].map(([k, l]) => `<button class="btn sm ${f === k ? 'primary' : ''}" data-gf="${k}">${l}</button>`).join('')}</div></div><div id="gl"></div>`;
    const draw = () => { const v = norm($('#gq').value); store.set('glossQ', $('#gq').value);
      const list = GLOSSARY.filter(([t, d, s]) => (!f || s === f) && (!v || norm(t + ' ' + d).includes(v)));
      $('#gl').innerHTML = list.length ? `<div class="table-wrap"><table>${list.map(([t, d, s]) => `<tr><td style="width:150px"><strong>${esc(t)}</strong></td><td>${esc(d)}</td><td style="width:120px">${tagBadge(s)}</td></tr>`).join('')}</table></div>` : '<div class="card empty">Aucun terme trouvé.</div>'; };
    $('#gq').addEventListener('input', draw); draw();
    $$('[data-gf]').forEach((b) => b.onclick = () => { store.set('glossF', b.dataset.gf); view.glossary(); });
  },

  memos() {
    main.innerHTML = `<div class="page-head"><div><h1>Fiches mémo</h1><p>L'essentiel de chaque module sur une page. Imprimables.</p></div><button class="btn no-print" onclick="window.print()">🖨️ Tout imprimer</button></div>
      ${CHEATS.map((c) => `<div class="card lesson" style="max-width:none"><h2 style="margin-top:0">${c.t}</h2>${c.html}</div>`).join('')}
      ${MODULES.map((m) => `<div class="card lesson" style="max-width:none;break-inside:avoid"><div class="row between"><h2 style="margin:0">${m.ico} ${esc(m.title)}</h2>${tagBadge(m.tag)}</div>${m.memo}</div>`).join('')}`;
  },

  resources() {
    const links = [
      ['Fonction publique', [['service-public.fr — Fonction publique', 'https://www.service-public.fr/particuliers/vosdroits/N19811', 'Fiches pratiques à jour pour les agents (congés, carrière, rémunération…).'], ['Légifrance — Code général de la fonction publique', 'https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000044416551', 'Le texte officiel, article par article.'],
        ['Portail de la fonction publique (DGAFP)', 'https://www.fonction-publique.gouv.fr', 'Actualités, statistiques, guides, rapport annuel.'], ['Collectivités locales — statut de la FPT', 'https://www.collectivites-locales.gouv.fr', 'Ressources de la DGCL pour les employeurs territoriaux.'],
        ['CNFPT', 'https://www.cnfpt.fr', 'Formations, répertoire des métiers territoriaux, concours A+.'], ['Place de l\'emploi public', 'https://choisirleservicepublic.gouv.fr', 'Les offres d\'emploi des trois versants.'],
        ['Votre centre de gestion (CDG)', 'https://www.fncdg.com', 'Fédération des CDG : trouver le CDG de votre département, ses notes juridiques et son service carrières.'], ['CNRACL', 'https://www.cnracl.retraites.fr', 'Retraite des fonctionnaires territoriaux et hospitaliers.']]],
      ['Secteur privé', [['service-public.fr — Travail', 'https://www.service-public.fr/particuliers/vosdroits/N19806', 'Droits des salariés et obligations de l\'employeur.'], ['Code du travail numérique', 'https://code.travail.gouv.fr', 'Réponses personnalisées selon la convention collective.'],
        ['Ministère du Travail', 'https://travail-emploi.gouv.fr', 'Fiches pratiques du droit du travail.'], ['URSSAF', 'https://www.urssaf.fr', 'Cotisations, DPAE, taux en vigueur.']]],
      ['Santé et prévention', [['INRS', 'https://www.inrs.fr', 'Prévention des risques professionnels, DUERP, RPS.'], ['Défenseur des droits', 'https://www.defenseurdesdroits.fr', 'Discriminations, lanceurs d\'alerte.']]],
    ];
    main.innerHTML = `<div class="page-head"><div><h1>Sources officielles</h1><p>Les règles évoluent : vérifie toujours une règle importante sur ces sites avant de l'appliquer.</p></div></div>` + links.map(([t, l]) => `<div class="card"><h3>${t}</h3>${l.map(([n, u, d]) => `<div style="padding:8px 0;border-top:1px solid var(--line)"><a href="${u}" target="_blank" rel="noopener"><strong>${esc(n)}</strong> ↗</a><br><small class="muted">${esc(d)}</small></div>`).join('')}</div>`).join('') +
      `<div class="card"><h3>Mes outils pour pratiquer</h3>${SUITE.filter((s) => s.id !== 'sarah').map((s) => `<p><a href="${s.url}" target="_blank" rel="noopener">${s.ico} ${esc(s.name)} ↗</a> — ${s.id === 'rh' ? 'logiciel RH complet avec simulation sur 3 ans (commune ou PME).' : 'gestion de projet avec modèles RH et académie.'}</p>`).join('')}</div>
      <div class="alert warn">Le contenu de Sarah HR est une synthèse pédagogique arrêtée fin 2026. Il ne remplace ni les textes officiels, ni l'avis de ton CDG / service juridique.</div>`;
  },

  notes() {
    const p = P();
    main.innerHTML = `<div class="page-head"><div><h1>Mon carnet</h1><p>Tes notes par module et tes questions à poser à ton responsable.</p></div></div>
      <div class="card"><h3>❓ Questions à poser au travail</h3><textarea id="qa" style="min-height:140px" placeholder="Ex. : Quel est notre régime de temps de travail ? Avons-nous un CST propre ou celui du CDG ?">${esc(p.notes._questions || '')}</textarea></div>
      ${MODULES.filter((m) => p.notes[m.id]).map((m) => `<div class="card"><div class="row between"><h3>${m.ico} ${esc(m.title)}</h3><a href="#/module/${m.id}/notes">Modifier</a></div><p style="white-space:pre-wrap">${esc(p.notes[m.id])}</p></div>`).join('') || '<p class="muted">Aucune note de module pour l\'instant (onglet « Mes notes » dans chaque module).</p>'}`;
    $('#qa').addEventListener('input', (e) => { const x = P(); x.notes._questions = e.target.value; saveP(x); });
  },

  profile() {
    const p = P();
    main.innerHTML = `<div class="page-head"><div><h1>Mon profil</h1></div></div><div class="grid g2"><div class="card"><h3>${esc(ME.name)}</h3><p>${level(p.xp).name} · ${p.xp} XP</p><p>${Object.keys(p.badges).length} badge(s) · ${p.reviews} cartes révisées · ${p.exams.length} examen(s)</p>
      <form id="pw">${fInput('p1', 'Nouveau mot de passe', '', { type: 'password' })}<button class="btn">Changer</button></form></div>
      <div class="card"><h3>Sauvegarde</h3><p class="muted">Ta progression est enregistrée dans ce navigateur. Exporte-la pour la retrouver sur un autre appareil.</p><div class="row"><button class="btn" id="ex">⬇️ Exporter</button><button class="btn" id="im">⬆️ Importer</button><button class="btn danger" id="rs">Réinitialiser</button></div></div></div>`;
    $('#pw').onsubmit = async (e) => { e.preventDefault(); try { await auth.setPassword(ME.id, e.target.p1.value); toast('Mot de passe changé'); } catch (err) { toast(err.message); } };
    $('#ex').onclick = () => download('sarah-hr-progression.json', JSON.stringify({ app: 'sarahhr', prog: P() }, null, 2));
    $('#im').onclick = async () => { try { const d = JSON.parse(await pickFile()); if (d.app !== 'sarahhr') throw new Error('fichier non reconnu'); saveP(d.prog); toast('Progression importée'); boot(); } catch (err) { toast('Import impossible : ' + err.message); } };
    $('#rs').onclick = async () => { if (await ask('Effacer toute ta progression ?')) { store.del(progKey()); boot(); } };
  },
};

/* ---------- Cours ---------- */
function lessonView(el, m, idx) {
  idx = clamp(idx, 0, m.lessons.length - 1); const l = m.lessons[idx];
  const first = !P().read[m.id]?.[idx];
  if (first) addXP(10, (p) => { p.read[m.id] = p.read[m.id] || {}; p.read[m.id][idx] = true; award(p, 'first_lesson'); });
  const p = P();
  el.innerHTML = `<div class="grid" style="grid-template-columns:minmax(0,1fr) 260px;align-items:start" id="lay"><div class="card lesson" style="max-width:none"><small class="muted">Leçon ${idx + 1} / ${m.lessons.length}${first ? ' · +10 XP' : ''}</small><h2 style="margin-top:4px">${esc(l.t)}</h2>${l.html}
    <hr><div class="row between">${idx > 0 ? `<a class="btn" href="#/module/${m.id}/cours/${idx - 1}">← Précédente</a>` : '<span></span>'}${idx < m.lessons.length - 1 ? `<a class="btn primary" href="#/module/${m.id}/cours/${idx + 1}">Leçon suivante →</a>` : `<a class="btn primary" href="#/module/${m.id}/quiz">Passer au quiz →</a>`}</div></div>
    <div class="card" style="padding:10px"><div class="nav">${m.lessons.map((x, i) => `<a href="#/module/${m.id}/cours/${i}" class="${i === idx ? 'active' : ''}"><span class="ico">${p.read[m.id]?.[i] ? '✓' : i + 1}</span>${esc(x.t)}</a>`).join('')}</div>
    <hr><small class="muted">Après le cours : <a href="#/module/${m.id}/cards">flashcards</a>, <a href="#/module/${m.id}/quiz">quiz</a>, <a href="#/module/${m.id}/cases">cas pratique</a>.</small></div></div>`;
  if (matchMedia('(max-width:900px)').matches) $('#lay').style.gridTemplateColumns = '1fr';
}
function memoView(el, m) {
  el.innerHTML = `<div class="card lesson" style="max-width:none">${m.memo}<hr><div class="row no-print"><button class="btn" onclick="window.print()">🖨️ Imprimer</button><a class="btn" href="#/memos">Toutes les fiches</a></div></div>`;
}
function notesView(el, m) {
  const p = P();
  el.innerHTML = `<div class="card"><h3>Mes notes sur « ${esc(m.title)} »</h3><textarea id="nt" style="min-height:260px" placeholder="Ce que je retiens, ce que je dois vérifier dans ma collectivité…">${esc(p.notes[m.id] || '')}</textarea><small class="muted">Enregistrement automatique.</small></div>`;
  $('#nt').addEventListener('input', (e) => { const x = P(); x.notes[m.id] = e.target.value; saveP(x); });
}

/* ---------- Flashcards (Leitner) ---------- */
function flashSession(el, cards, { all = false, onDone, emptyMsg } = {}) {
  let queue = [...(all ? shuffle(cards) : cards)]; let i = 0, known = 0, seen = 0; const again = new Set();
  if (!queue.length) { el.innerHTML = `<div class="card empty">${emptyMsg || 'Aucune carte.'}</div>`; onDone?.(); return; }
  const draw = () => {
    if (i >= queue.length) {
      el.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:2.5rem">🎉</div><h2>Session terminée</h2><p>${known} / ${seen} cartes sues du premier coup.</p>${onDone ? '<button class="btn primary" id="cont">Continuer →</button>' : '<button class="btn primary" id="again">Recommencer</button>'}</div>`;
      $('#cont', el)?.addEventListener('click', onDone); $('#again', el)?.addEventListener('click', () => flashSession(el, cards, { all, onDone, emptyMsg })); return;
    }
    const c = queue[i]; const box = P().cards[c.id]?.box || 0;
    el.innerHTML = `<div class="card"><div class="row between" style="margin-bottom:12px"><small>Carte ${i + 1} / ${queue.length}${c.mod ? ' · ' + c.mod.ico + ' ' + esc(c.mod.title) : ''}</small><small>${box ? 'Boîte ' + box : 'Nouvelle'}</small></div>
      <div class="flash" id="fc"><div class="flash-inner"><div class="flash-face flash-front"><small>Question</small>${esc(c.f)}<div class="muted" style="font-size:.8rem;font-weight:500;margin-top:14px">Clique pour retourner</div></div><div class="flash-face flash-back"><small>Réponse</small>${esc(c.b)}</div></div></div>
      <div class="row" style="justify-content:center;margin-top:16px" id="acts"><button class="btn primary big-btn" id="flip">Voir la réponse</button></div></div>`;
    const flip = () => { $('#fc', el).classList.add('flipped'); $('#acts', el).innerHTML = '<button class="btn big-btn" id="ko">🔁 À revoir</button><button class="btn primary big-btn" id="ok">✓ Je savais</button>'; $('#ok', el).onclick = () => answer(true); $('#ko', el).onclick = () => answer(false); };
    $('#fc', el).onclick = flip; $('#flip', el).onclick = flip;
  };
  const answer = (ok) => {
    const c = queue[i]; const firstTime = !again.has(c.id); if (firstTime) { seen++; if (ok) known++; }
    addXP(1, (p) => { const cur = p.cards[c.id] || { box: 0 }; const box = ok ? Math.min(5, cur.box + 1) : 1; p.cards[c.id] = { box, due: addDays(todayISO(), ok ? BOX_DAYS[box] : 0) }; p.reviews = (p.reviews || 0) + 1; if (p.reviews >= 50) award(p, 'cards50'); });
    if (!ok && !again.has(c.id)) { again.add(c.id); queue.push(c); }
    i++; draw();
  };
  draw();
}

/* ---------- Quiz ---------- */
function prepQ(q) { const order = shuffle(q.c.map((_, k) => k)); return { ...q, c: order.map((k) => q.c[k]), a: order.indexOf(q.a) }; }
function runQuiz(el, questions, { onFinish, exam = false, seconds = 0, title = '' } = {}) {
  const qs = questions.map(prepQ); const answers = new Array(qs.length).fill(null); let i = 0; const t0 = Date.now(); let timer = null, finished = false;
  const finish = () => {
    if (finished) return; finished = true; clearInterval(timer);
    const score = qs.reduce((s, q, k) => s + (answers[k] === q.a ? 1 : 0), 0);
    onFinish?.(score, qs.length, { qs, answers, dur: Math.round((Date.now() - t0) / 1000) });
  };
  if (seconds) timer = setInterval(() => { const left = seconds - Math.floor((Date.now() - t0) / 1000); const t = $('#tm', el); if (!document.body.contains(el)) return clearInterval(timer); if (t) t.textContent = `${Math.floor(Math.max(0, left) / 60)}:${String(Math.max(0, left) % 60).padStart(2, '0')}`; if (left <= 0) { toast('Temps écoulé !'); finish(); } }, 1000);
  const draw = () => {
    const q = qs[i]; const done = answers[i] !== null;
    el.innerHTML = `<div class="card"><div class="row between"><small>${title ? esc(title) + ' · ' : ''}Question ${i + 1} / ${qs.length}${q.mod ? ' · ' + q.mod.ico + ' ' + esc(q.mod.title) : ''}</small>${seconds ? '<span class="timer" id="tm">…</span>' : ''}</div>
      <div style="margin:8px 0 14px">${bar(((i + (done ? 1 : 0)) / qs.length) * 100)}</div><h3 style="font-size:1.12rem">${esc(q.q)}</h3>
      ${q.c.map((ch, k) => `<button class="choice ${exam && answers[i] === k ? 'sel' : ''} ${!exam && done ? (k === q.a ? 'good' : k === answers[i] ? 'bad' : '') : ''}" data-k="${k}" ${!exam && done ? 'disabled' : ''}>${String.fromCharCode(65 + k)}. ${esc(ch)}</button>`).join('')}
      <div id="fb">${!exam && done ? `<div class="alert ${answers[i] === q.a ? 'ok' : 'bad'}">${answers[i] === q.a ? '✅ Bonne réponse.' : '❌ Pas tout à fait.'} ${esc(q.e)}</div>` : ''}</div>
      <div class="row between" style="margin-top:10px">${exam && i > 0 ? '<button class="btn" id="prev">← Précédente</button>' : '<span></span>'}<div class="row">${exam ? '<button class="btn" id="end">Terminer l\'examen</button>' : ''}${(done || exam) && i < qs.length - 1 ? '<button class="btn primary" id="next">Suivante →</button>' : ''}${(done || exam) && i === qs.length - 1 ? '<button class="btn primary" id="fin">Voir mon résultat</button>' : ''}</div></div></div>`;
    $$('[data-k]', el).forEach((b) => b.onclick = () => { answers[i] = Number(b.dataset.k); if (exam && i < qs.length - 1) { i++; } draw(); });
    $('#next', el)?.addEventListener('click', () => { i++; draw(); });
    $('#prev', el)?.addEventListener('click', () => { i--; draw(); });
    $('#fin', el)?.addEventListener('click', async () => { if (exam && answers.includes(null) && !await ask(`${answers.filter((a) => a === null).length} question(s) sans réponse. Terminer quand même ?`)) return; finish(); });
    $('#end', el)?.addEventListener('click', async () => { if (await ask('Terminer l\'examen maintenant ?')) finish(); });
  };
  draw();
}
function quizStart(el, m) {
  const qs = shuffle(m.quiz).slice(0, 10);
  runQuiz(el, qs, { onFinish: (score, total, det) => {
    const pct = Math.round((score / total) * 100);
    addXP(score * 2, (p) => { const cur = p.quiz[m.id] || { best: 0, attempts: 0 }; p.quiz[m.id] = { best: Math.max(cur.best, pct), last: pct, attempts: cur.attempts + 1 }; award(p, 'first_quiz'); if (pct === 100) award(p, 'perfect'); });
    el.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:3rem">${pct >= 90 ? '🏆' : pct >= 70 ? '✅' : '📚'}</div><h2>${score} / ${total} — ${pct} %</h2><p>${pct >= 70 ? 'Module validé ! ' : 'Il faut 70 % pour valider le module. '}+${score * 2} XP</p>
      <div class="row" style="justify-content:center"><button class="btn" id="re">Refaire un quiz</button><a class="btn" href="#/module/${m.id}/cards">Réviser les flashcards</a>${(() => { const n = MODULES[MODULES.indexOf(m) + 1]; return n ? `<a class="btn primary" href="#/module/${n.id}">Module suivant →</a>` : ''; })()}</div></div>${reviewList(det)}`;
    $('#re', el).onclick = () => quizStart(el, m);
  } });
}
function reviewList({ qs, answers }) {
  const wrong = qs.map((q, k) => ({ q, a: answers[k] })).filter((x) => x.a !== x.q.a);
  return wrong.length ? `<div class="card"><h3>À retenir (${wrong.length} erreur${wrong.length > 1 ? 's' : ''})</h3>${wrong.map(({ q, a }) => `<div style="padding:10px 0;border-top:1px solid var(--line)"><strong>${esc(q.q)}</strong><br>${a !== null ? `<small style="color:var(--bad)">Ta réponse : ${esc(q.c[a])}</small><br>` : '<small class="muted">Sans réponse</small><br>'}<small style="color:var(--ok)">Bonne réponse : ${esc(q.c[q.a])}</small><br><small class="muted">${esc(q.e)}${q.mod ? ` — <a href="#/module/${q.mod.id}">revoir le module</a>` : ''}</small></div>`).join('')}</div>` : '';
}

/* ---------- Cas pratiques ---------- */
function casesView(el, list, showMod) {
  const p = P();
  el.innerHTML = list.map((c, k) => `<div class="card" id="case${k}"><div class="row between"><h3>🧩 ${esc(c.t)}</h3><span>${showMod ? `<small>${c.mod.ico} ${esc(c.mod.title)}</small> ` : ''}${p.cases[c.id] !== undefined ? `<span class="badge ${p.cases[c.id] >= 7 ? 'ok' : 'warn'}">${p.cases[c.id]}/10</span>` : ''}</span></div>
    <p>${esc(c.s)}</p><p><strong>Que fais-tu ?</strong></p>${shuffle(c.opts.map((o, i) => ({ ...o, i }))).map((o) => `<button class="choice" data-case="${k}" data-o="${o.i}">${esc(o.t)}</button>`).join('')}<div class="cfb"></div></div>`).join('') || '<div class="card empty">Aucun cas.</div>';
  $$('[data-case]', el).forEach((b) => b.onclick = () => {
    const k = Number(b.dataset.case), c = list[k], o = c.opts[b.dataset.o]; const box = $('#case' + k, el);
    $$('[data-case]', box).forEach((x) => { x.disabled = true; const oo = c.opts[x.dataset.o]; if (oo.s === 10) x.classList.add('good'); else if (x === b) x.classList.add('bad'); });
    $('.cfb', box).innerHTML = `<div class="alert ${o.s >= 7 ? 'ok' : o.s >= 4 ? 'warn' : 'bad'}"><strong>${o.s}/10</strong> — ${esc(o.fb)}</div>${o.s < 10 ? `<div class="callout"><strong>La meilleure réponse :</strong> ${esc(c.opts.find((x) => x.s === 10).fb)}</div>` : ''}`;
    addXP(o.s, (pp) => { pp.cases[c.id] = Math.max(pp.cases[c.id] ?? 0, o.s); });
  });
}

/* ---------- Évaluations ---------- */
function examRun(kind) {
  const cfg = { public: ['Examen blanc — Fonction publique', 20, 1200, (m) => m.tag !== 'prive'], prive: ['Examen blanc — Secteur privé', 20, 1200, (m) => m.tag !== 'public'], final: ['Examen final Sarah HR', 40, 2400, null] }[kind];
  if (!cfg) return view.exams();
  const [title, n, secs, filter] = cfg;
  main.innerHTML = `<div class="page-head"><div><a href="#/exams" class="muted">← Évaluations</a><h1 style="margin-top:6px">📝 ${title}</h1><p>${n} questions · ${secs / 60} minutes · correction à la fin</p></div></div><div id="ex"><div class="card" style="text-align:center"><p>Prête ? Le chronomètre démarre dès que tu cliques.</p><button class="btn primary big-btn" id="go">Démarrer l'examen</button></div></div>`;
  $('#go').onclick = () => runQuiz($('#ex'), pick(allQuestions(filter), n), { exam: true, seconds: secs, title, onFinish: (score, total, det) => {
    const pct = Math.round((score / total) * 100);
    const byMod = {}; det.qs.forEach((q, k) => { const id = q.mod.id; byMod[id] = byMod[id] || { ok: 0, n: 0, m: q.mod }; byMod[id].n++; if (det.answers[k] === q.a) byMod[id].ok++; });
    const rec = { date: todayISO(), kind, title, score, total, pct, dur: det.dur };
    addXP(score * 3, (p) => { p.exams.push(rec); if (pct >= 70) award(p, 'exam70'); if (pct >= 90) award(p, 'exam90'); });
    const weak = Object.values(byMod).filter((x) => x.ok / x.n < 0.6);
    $('#ex').innerHTML = `<div class="card" style="text-align:center"><div style="font-size:3rem">${pct >= 90 ? '🏆' : pct >= 70 ? '🎓' : '📚'}</div><h2>${score} / ${total} — ${pct} %</h2><p>Durée : ${Math.floor(det.dur / 60)} min ${det.dur % 60} s · +${score * 3} XP</p>
      ${kind === 'final' && pct >= 70 ? '<button class="btn primary" id="cert">Voir mon attestation</button>' : pct >= 70 ? '<p>Réussi ! Tente l\'examen final quand tu te sens prête.</p>' : '<p>Continue : révise les modules ci-dessous et retente.</p>'}</div>
      <div class="card"><h3>Résultat par module</h3>${Object.values(byMod).sort((a, b) => a.ok / a.n - b.ok / b.n).map((x) => `<div style="margin-bottom:8px"><div class="row between"><a href="#/module/${x.m.id}">${x.m.ico} ${esc(x.m.title)}</a><strong>${x.ok} / ${x.n}</strong></div>${bar((x.ok / x.n) * 100, x.ok / x.n < 0.6 ? 'var(--bad)' : '')}</div>`).join('')}
      ${weak.length ? `<div class="alert warn">À retravailler en priorité : ${weak.map((x) => `<a href="#/module/${x.m.id}">${esc(x.m.title)}</a>`).join(', ')}.</div>` : ''}</div>${reviewList(det)}`;
    $('#cert')?.addEventListener('click', () => certificate(rec));
  } });
}
function certificate(rec) {
  main.innerHTML = `<div class="no-print row" style="margin-bottom:12px"><a class="btn" href="#/exams">← Évaluations</a><button class="btn primary" onclick="window.print()">🖨️ Imprimer</button></div>
    <div class="cert"><div style="font-size:3rem">🎓</div><p class="muted" style="letter-spacing:.2em;text-transform:uppercase">Attestation de réussite</p><h1 style="font-size:2.2rem">${esc(ME.name)}</h1>
    <p>a réussi l'<strong>${esc(rec.title)}</strong> avec un score de <strong>${rec.score} / ${rec.total} (${rec.pct} %)</strong></p>
    <p>couvrant ${MODULES.length} modules : statut de la fonction publique, carrière, rémunération, temps de travail, santé, discipline, dialogue social, droit du travail privé, recrutement, formation, pilotage RH, management, projets RH et prévention.</p>
    <p class="muted">Le ${fmtDate(rec.date)} — Sarah HR</p></div>`;
}

/* ---------- Jeux ---------- */
const SIGLES = GLOSSARY.filter(([t]) => /^[A-Z0-9/]{2,8}$/.test(t));
const GAMES = {
  hub() {
    const p = P(); const g = p.games;
    const list = [['rush', '⚡', 'Sigle Rush', '60 secondes pour reconnaître un maximum de sigles.', g.rush ? `Record : ${g.rush}` : ''], ['memory', '🧠', 'Memory des sigles', 'Associe chaque sigle à sa définition.', g.memory ? `Record : ${g.memory} coups` : ''],
      ['vf', '✔️', 'Vrai ou faux chrono', '90 secondes, un maximum d\'affirmations.', g.vf ? `Record : ${g.vf}` : ''], ['pp', '⚖️', 'Privé, public ou les deux ?', 'Classe 12 règles selon le secteur.', g.pp ? `Record : ${g.pp} / 12` : ''],
      ['story', '🎭', 'Jeu de rôle : ma première année de responsable RH', '12 situations, 3 indicateurs : confiance de l\'équipe, sécurité juridique, confiance de la direction.', g.story ? `Meilleur score : ${g.story}` : '']];
    main.innerHTML = `<div class="page-head"><div><h1>Jeux</h1><p>Apprendre en s'amusant : chaque partie rapporte de l'XP.</p></div></div><div class="grid g3">${list.map(([id, i, t, d, r]) => `<a class="card mod-card" href="#/games/${id}"><span class="mod-ico">${i}</span><h3 style="margin:0">${t}</h3><p class="muted" style="margin:0;flex:1">${d}</p>${r ? `<span class="badge acc">${r}</span>` : ''}</a>`).join('')}</div>`;
  },
  rush() {
    let score = 0, streak = 0, t0 = 0, over = false; const asked = [];
    const head = `<div class="page-head"><div><a href="#/games" class="muted">← Jeux</a><h1 style="margin-top:6px">⚡ Sigle Rush</h1><p>Que signifie ce sigle ? 60 secondes. Bonus si tu enchaînes.</p></div></div>`;
    main.innerHTML = head + `<div id="g"><div class="card" style="text-align:center"><button class="btn primary big-btn" id="go">Go !</button></div></div>`;
    const el = $('#g');
    const end = () => { if (over) return; over = true; const best = Math.max(P().games.rush || 0, score);
      addXP(score * 2, (p) => { p.games.rush = best; if (score >= 15) award(p, 'rush15'); });
      el.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:3rem">⚡</div><h2>${score} point(s)</h2><p>Record : ${best} · +${score * 2} XP</p><button class="btn primary" id="re">Rejouer</button> <a class="btn" href="#/glossary">Revoir le glossaire</a></div>${asked.filter((a) => !a.ok).length ? `<div class="card"><h3>Sigles à revoir</h3>${asked.filter((a) => !a.ok).map((a) => `<p><strong>${esc(a.t)}</strong> — ${esc(a.d)}</p>`).join('')}</div>` : ''}`;
      $('#re', el).onclick = GAMES.rush; };
    const next = () => {
      if (over) return; const left = 60 - Math.floor((Date.now() - t0) / 1000); if (left <= 0) return end();
      const [t, d] = SIGLES[Math.floor(Math.random() * SIGLES.length)]; const opts = shuffle([d, ...pick(SIGLES.filter((x) => x[0] !== t), 3).map((x) => x[1])]);
      el.innerHTML = `<div class="card"><div class="row between"><strong>Score : ${score}${streak >= 3 ? ` 🔥×${streak}` : ''}</strong><span class="timer" id="tm">${left}s</span></div><h2 style="text-align:center;font-size:2.4rem;margin:18px 0">${esc(t)}</h2>${opts.map((o) => `<button class="choice" data-d="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
      $$('.choice', el).forEach((b) => b.onclick = () => { const ok = b.dataset.d === d; asked.push({ t, d, ok }); if (ok) { streak++; score += streak >= 3 ? 2 : 1; } else streak = 0;
        b.classList.add(ok ? 'good' : 'bad'); $$('.choice', el).forEach((x) => { x.disabled = true; if (x.dataset.d === d) x.classList.add('good'); }); setTimeout(next, ok ? 350 : 1100); });
    };
    $('#go').onclick = () => { t0 = Date.now(); const iv = setInterval(() => { const tm = $('#tm'); if (over || !document.body.contains(el)) return clearInterval(iv); const left = 60 - Math.floor((Date.now() - t0) / 1000); if (tm) tm.textContent = Math.max(0, left) + 's'; if (left <= 0) { clearInterval(iv); end(); } }, 250); next(); };
  },
  memory() {
    const pairs = pick(SIGLES, 6); const cards = shuffle(pairs.flatMap(([t, d], k) => [{ k, txt: t }, { k, txt: d.length > 70 ? d.slice(0, 67) + '…' : d }]));
    let open = [], found = 0, moves = 0, lock = false;
    main.innerHTML = `<div class="page-head"><div><a href="#/games" class="muted">← Jeux</a><h1 style="margin-top:6px">🧠 Memory des sigles</h1><p>Retourne deux cartes : un sigle et sa définition.</p></div><strong id="mv">0 coup</strong></div><div class="memory" id="mem">${cards.map((c, i) => `<div class="mcard" data-i="${i}">?</div>`).join('')}</div>`;
    $$('.mcard').forEach((el) => el.onclick = () => {
      const i = Number(el.dataset.i); if (lock || el.classList.contains('open') || el.classList.contains('done')) return;
      el.classList.add('open'); el.textContent = cards[i].txt; open.push(el);
      if (open.length === 2) { moves++; $('#mv').textContent = moves + ' coup' + (moves > 1 ? 's' : ''); const [a, b] = open;
        if (cards[a.dataset.i].k === cards[b.dataset.i].k) { a.classList.add('done'); b.classList.add('done'); open = []; found++;
          if (found === 6) { const best = Math.min(P().games.memory || 999, moves); addXP(Math.max(10, 40 - moves * 2), (p) => { p.games.memory = best; });
            setTimeout(() => { $('#mem').insertAdjacentHTML('afterend', `<div class="card" style="text-align:center;margin-top:14px"><h2>Bravo ! ${moves} coups</h2><p>Record : ${best}</p><button class="btn primary" id="re">Rejouer</button></div>`); $('#re').onclick = GAMES.memory; }, 300); } }
        else { lock = true; setTimeout(() => { [a, b].forEach((x) => { x.classList.remove('open'); x.textContent = '?'; }); open = []; lock = false; }, 1100); } }
    });
  },
  vf() {
    const pool = shuffle(MODULES.flatMap((m) => m.tf.map((x) => ({ s: x[0], v: x[1], e: x[2], m }))));
    let i = 0, score = 0, t0 = 0, over = false; const wrong = [];
    main.innerHTML = `<div class="page-head"><div><a href="#/games" class="muted">← Jeux</a><h1 style="margin-top:6px">✔️ Vrai ou faux chrono</h1><p>90 secondes. Une erreur = la correction s'affiche 2 secondes.</p></div></div><div id="g"><div class="card" style="text-align:center"><button class="btn primary big-btn" id="go">Go !</button></div></div>`;
    const el = $('#g');
    const end = () => { if (over) return; over = true; const best = Math.max(P().games.vf || 0, score); addXP(score * 2, (p) => { p.games.vf = best; });
      el.innerHTML = `<div class="card" style="text-align:center"><h2>${score} bonne(s) réponse(s)</h2><p>Record : ${best} · +${score * 2} XP</p><button class="btn primary" id="re">Rejouer</button></div>${wrong.length ? `<div class="card"><h3>Corrections</h3>${wrong.map((w) => `<p><strong>${w.v ? 'VRAI' : 'FAUX'}</strong> — ${esc(w.s)}<br><small class="muted">${esc(w.e)}</small></p>`).join('')}</div>` : ''}`; $('#re', el).onclick = GAMES.vf; };
    const next = () => { if (over) return; if (i >= pool.length) return end(); const q = pool[i];
      el.innerHTML = `<div class="card"><div class="row between"><strong>Score : ${score}</strong><span class="timer" id="tm"></span></div><h3 style="text-align:center;font-size:1.25rem;margin:24px 0;min-height:3em">${esc(q.s)}</h3>
        <div class="row" style="justify-content:center"><button class="btn big-btn" data-v="1" style="min-width:130px">✔️ Vrai</button><button class="btn big-btn" data-v="0" style="min-width:130px">✖️ Faux</button></div><div id="fb" style="margin-top:12px"></div></div>`;
      $$('[data-v]', el).forEach((b) => b.onclick = () => { const ok = (b.dataset.v === '1') === q.v; i++; if (ok) { score++; next(); } else { wrong.push(q); $$('[data-v]', el).forEach((x) => { x.disabled = true; }); $('#fb', el).innerHTML = `<div class="alert bad">C'était <strong>${q.v ? 'VRAI' : 'FAUX'}</strong> : ${esc(q.e)}</div>`; setTimeout(next, 2000); } }); };
    $('#go').onclick = () => { t0 = Date.now(); const iv = setInterval(() => { if (over || !document.body.contains(el)) return clearInterval(iv); const left = 90 - Math.floor((Date.now() - t0) / 1000); const tm = $('#tm'); if (tm) tm.textContent = Math.max(0, left) + 's'; if (left <= 0) { clearInterval(iv); end(); } }, 250); next(); };
  },
  pp() {
    const qs = pick(PRIVE_PUBLIC, 12); let i = 0, score = 0;
    main.innerHTML = `<div class="page-head"><div><a href="#/games" class="muted">← Jeux</a><h1 style="margin-top:6px">⚖️ Privé, public ou les deux ?</h1><p>À quel secteur s'applique cette règle ?</p></div></div><div id="g"></div>`;
    const el = $('#g'); const L = { prive: '🏢 Privé', public: '🏛️ Public', deux: '🤝 Les deux' };
    const draw = () => {
      if (i >= qs.length) { const best = Math.max(P().games.pp || 0, score); addXP(score * 2, (p) => { p.games.pp = best; }); el.innerHTML = `<div class="card" style="text-align:center"><h2>${score} / ${qs.length}</h2><p>Record : ${best} · +${score * 2} XP</p><button class="btn primary" id="re">Rejouer</button></div>`; $('#re', el).onclick = GAMES.pp; return; }
      const [s, a, e] = qs[i];
      el.innerHTML = `<div class="card"><div class="row between"><small>${i + 1} / ${qs.length}</small><strong>Score : ${score}</strong></div><h3 style="text-align:center;font-size:1.2rem;margin:22px 0">${esc(s)}</h3><div class="grid g3">${Object.entries(L).map(([k, l]) => `<button class="choice" data-a="${k}" style="text-align:center">${l}</button>`).join('')}</div><div id="fb"></div></div>`;
      $$('[data-a]', el).forEach((b) => b.onclick = () => { const ok = b.dataset.a === a; if (ok) score++; $$('[data-a]', el).forEach((x) => { x.disabled = true; if (x.dataset.a === a) x.classList.add('good'); else if (x === b) x.classList.add('bad'); });
        $('#fb', el).innerHTML = `<div class="alert ${ok ? 'ok' : 'bad'}" style="margin-top:10px">${ok ? '✅' : '❌'} ${esc(e)}</div><button class="btn primary" id="nx">Suivante →</button>`; $('#nx', el).onclick = () => { i++; draw(); }; });
    };
    draw();
  },
  story() {
    const st = { equipe: 50, droit: 50, direction: 50 }; let i = 0; const log = [];
    main.innerHTML = `<div class="page-head"><div><a href="#/games" class="muted">← Jeux</a><h1 style="margin-top:6px">🎭 Ma première année de responsable RH</h1><p>Tu prends la responsabilité RH d'une communauté de communes. Chaque choix fait bouger trois indicateurs.</p></div></div><div id="g"></div>`;
    const el = $('#g');
    const gauges = () => [['equipe', '👥 Confiance équipe'], ['droit', '⚖️ Sécurité juridique'], ['direction', '🏛️ Confiance direction']].map(([k, l]) => `<div class="gauge"><span>${l}</span>${bar(st[k], st[k] < 30 ? 'var(--bad)' : st[k] > 70 ? 'var(--ok)' : '')}<strong>${st[k]}</strong></div>`).join('');
    const draw = () => {
      if (i >= STORY.length) {
        const total = st.equipe + st.droit + st.direction; const best = Math.max(P().games.story || 0, total);
        const profil = total >= 330 ? ['🌟', 'Responsable RH accomplie', 'Tu as su écouter, sécuriser et convaincre. Ta collectivité est entre de bonnes mains.'] : total >= 250 ? ['👍', 'Bonne première année', 'Des bases solides. Repère dans le bilan les situations où tu as perdu des points.'] : ['📚', 'Année difficile', 'Reprends les modules liés aux situations ratées, puis rejoue.'];
        addXP(Math.round(total / 10), (p) => { p.games.story = best; award(p, 'story'); });
        el.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:3rem">${profil[0]}</div><h2>${profil[1]}</h2><p>${profil[2]}</p><p><strong>Score : ${total} / 450</strong> · record ${best}</p></div><div class="card">${gauges()}</div>
          <div class="card"><h3>Bilan de l'année</h3>${log.map((x) => `<div style="padding:8px 0;border-top:1px solid var(--line)"><strong>${esc(x.t)}</strong> — ${esc(x.c)}<br><small class="muted">${esc(x.fb)}</small></div>`).join('')}</div><button class="btn primary" id="re">Rejouer</button>`;
        $('#re', el).onclick = GAMES.story; return;
      }
      const sc = STORY[i];
      el.innerHTML = `<div class="card">${gauges()}</div><div class="card"><small class="muted">Situation ${i + 1} / ${STORY.length} · ${esc(sc.t)}</small><h3 style="margin-top:6px;font-size:1.12rem">${esc(sc.s)}</h3>${shuffle(sc.c.map((c, k) => ({ ...c, k }))).map((c) => `<button class="choice" data-k="${c.k}">${esc(c.t)}</button>`).join('')}<div id="fb"></div></div>`;
      $$('[data-k]', el).forEach((b) => b.onclick = () => {
        const c = sc.c[b.dataset.k]; Object.entries(c.e).forEach(([k, v]) => { st[k] = clamp(st[k] + v, 0, 100); });
        const bestK = sc.c.reduce((bi, x, k) => (Object.values(x.e).reduce((s, v) => s + v, 0) > Object.values(sc.c[bi].e).reduce((s, v) => s + v, 0) ? k : bi), 0);
        log.push({ t: sc.t, c: c.t, fb: c.fb });
        $$('[data-k]', el).forEach((x) => { x.disabled = true; if (Number(x.dataset.k) === bestK) x.classList.add('good'); else if (x === b) x.classList.add('bad'); });
        const delta = Object.entries(c.e).filter(([, v]) => v).map(([k, v]) => `${{ equipe: '👥', droit: '⚖️', direction: '🏛️' }[k]} ${v > 0 ? '+' : ''}${v}`).join('  ');
        $('#fb', el).innerHTML = `<div class="alert ${Number(b.dataset.k) === bestK ? 'ok' : 'warn'}" style="margin-top:10px"><strong>${delta || 'Aucun effet'}</strong><br>${esc(c.fb)}</div><button class="btn primary" id="nx">${i < STORY.length - 1 ? 'Situation suivante →' : 'Voir mon bilan'}</button>`;
        $('#nx', el).onclick = () => { i++; draw(); };
      });
    };
    draw();
  },
};

/* Fiches transverses */
const CHEATS = [
  { t: '🔁 Comparatif privé / public', html: MODULES[0].lessons[0].html.split('<div class="callout')[0] },
  { t: '📅 Calendrier RH annuel (collectivité)', html: `<table><tr><th>Période</th><th>À faire</th></tr>
<tr><td>Janvier</td><td>Revalorisations éventuelles (SMIC, indices), mise à jour de la paie, bilan des congés et du CET, déclarations annuelles.</td></tr>
<tr><td>Février – mars</td><td>Préparation du budget : masse salariale, GVT, créations / suppressions de postes. Tableau d'avancement de l'année.</td></tr>
<tr><td>Mars – juin</td><td>Collecte et saisie du RSU de l'année précédente ; DOETH / déclaration FIPHFP ; calendrier des congés d'été.</td></tr>
<tr><td>Septembre – octobre</td><td>Plan de formation de l'année suivante ; inscriptions CNFPT ; préparation des avancements.</td></tr>
<tr><td>Octobre – décembre</td><td>Campagne d'entretiens professionnels (selon la collectivité) ; mise à jour du DUERP ; LDG à réviser si besoin.</td></tr>
<tr><td>Décembre 2026</td><td><strong>Élections professionnelles</strong> (CAP, CCP, CST).</td></tr></table><p class="muted">Calendrier indicatif : il varie selon les collectivités.</p>` },
  { t: '✅ Check-list : arrivée d\'un agent', html: `<ol><li>Emploi au tableau des emplois, vacance déclarée et publiée</li><li>Arrêté de nomination (ou contrat visant le motif)</li><li>Dossier : pièces d'identité, diplômes, casier judiciaire (B2), RIB, carte vitale</li><li>Affiliation caisse de retraite (CNRACL / IRCANTEC)</li><li>Visite médicale d'embauche</li><li>PV d'installation, fiche de poste remise</li><li>Matériel, accès, badge</li><li>Inscription à la formation d'intégration (stagiaire FPT)</li><li>Entretien d'étape ; avis de fin de stage avant l'échéance</li></ol>` },
];

const guard = (fn) => (...a) => { if (!auth.current() || !document.getElementById('main')) return; ME = auth.current(); main = $('#main'); fn(...a); };
const router = makeRouter(Object.fromEntries(Object.entries(view).map(([k, fn]) => [k, guard(fn)])), guard(() => view.home()));
window.addEventListener('hashchange', () => { if (!auth.current()) boot(); });
boot();
