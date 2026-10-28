/* Pilote — gestion de projet simple et pas chère. */
const store = makeStore('pilote:');
const auth = makeAuth(store);
const toggleTheme = themeToggle(store);
const STATUSES = [['todo', 'À faire'], ['doing', 'En cours'], ['review', 'En revue'], ['done', 'Terminé']];
const PRIOS = ['Basse', 'Normale', 'Haute', 'Urgente'];
const PROJ_STATUS = ['Pas démarré', 'En cours', 'En pause', 'Terminé'];
const ROLES = { admin: 'Administrateur', manager: 'Chef de projet', member: 'Membre' };
const COLORS = ['#4f46e5', '#0891b2', '#16a34a', '#ea580c', '#db2777', '#7c3aed', '#ca8a04'];
let ME = null;
let main = null;

/* ---------- Données ---------- */
const wsKey = () => 'ws:' + ME.wsId;
function ws() { return store.get(wsKey(), null); }
function saveWs(w) { store.set(wsKey(), w); }
function mutate(fn) { const w = ws(); fn(w); saveWs(w); return w; }
function log(w, txt) { w.activity.unshift({ d: new Date().toISOString(), u: ME.id, txt }); w.activity = w.activity.slice(0, 200); }
const members = () => auth.users().filter((u) => u.wsId === ME.wsId);
const userName = (id) => auth.users().find((u) => u.id === id)?.name || '—';
const can = (what) => ({ admin: ['all'], manager: ['project', 'task'], member: ['task'] }[ME.role] || []).some((x) => x === 'all' || x === what);
const visibleProjects = (w) => ME.role === 'member' ? w.projects.filter((p) => p.members.includes(ME.id) || p.ownerId === ME.id) : w.projects;

function projectStats(w, p) {
  const tasks = w.tasks.filter((t) => t.projectId === p.id);
  const done = tasks.filter((t) => t.status === 'done').length;
  const late = tasks.filter((t) => t.status !== 'done' && t.due && t.due < todayISO()).length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const spent = (p.expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0);
  const budgetPct = p.budget ? Math.round((spent / p.budget) * 100) : 0;
  const critical = (p.risks || []).filter((r) => r.status !== 'Clos' && r.prob * r.impact >= 9).length;
  let score = 0;
  if (late > 0) score++; if (late > 2) score++;
  if (p.budget && budgetPct > progress + 15) score++; if (p.budget && budgetPct > 100) score++;
  if (critical) score++;
  const weather = p.status === 'Terminé' ? ['🏁', 'Terminé', 'ok'] : score === 0 ? ['☀️', 'Au beau fixe', 'ok'] : score <= 2 ? ['⛅', 'Vigilance', 'warn'] : ['⛈️', 'En difficulté', 'bad'];
  return { tasks, done, late, progress, spent, budgetPct, critical, weather };
}

function newWorkspace(name, ownerId) {
  return { id: uid(), name, plan: 'Gratuit', created: todayISO(), ownerId, projects: [], tasks: [], activity: [] };
}

function addProject(w, data, template = 'vide') {
  const p = { id: uid(), name: data.name, code: data.code || data.name.slice(0, 4).toUpperCase(), desc: data.desc || '', ownerId: data.ownerId || ME.id,
    sponsor: data.sponsor || '', start: data.start || todayISO(), end: data.end || addDays(data.start || todayISO(), 90), budget: Number(data.budget) || 0,
    status: data.status || 'En cours', phase: 0, gates: {}, members: [ME.id], risks: [], milestones: [], expenses: [], color: data.color || COLORS[w.projects.length % COLORS.length] };
  w.projects.push(p);
  (TEMPLATES[template]?.tasks || []).forEach(([title, off, dur]) => {
    w.tasks.push(newTask(p.id, { title, start: addDays(p.start, off), due: addDays(p.start, off + dur), estimate: Math.max(1, Math.round(dur * 2)) }));
  });
  log(w, `a créé le projet « ${p.name} »`);
  return p;
}
function newTask(projectId, d) {
  return { id: uid(), projectId, title: d.title, desc: d.desc || '', status: d.status || 'todo', priority: d.priority || 'Normale', assignee: d.assignee || '',
    start: d.start || todayISO(), due: d.due || '', estimate: Number(d.estimate) || 0, spent: Number(d.spent) || 0, checklist: d.checklist || [], comments: [], created: todayISO() };
}

function seedDemo(w) {
  const others = members().filter((m) => m.id !== ME.id).map((m) => m.id);
  const team = [ME.id, ...others];
  const start = addDays(todayISO(), -30);
  const p1 = addProject(w, { name: 'Campagne d\'entretiens 2026', code: 'ENT26', desc: 'Organiser et suivre la campagne d\'entretiens professionnels annuels de tous les agents.', start, end: addDays(start, 75), budget: 3500, sponsor: 'Directrice générale des services' }, 'rh_entretiens');
  p1.phase = 2; p1.gates = { 0: [true, true, true, true, true], 1: [true, true, true, true, false], 2: [true, false, false] };
  p1.members = team;
  p1.risks = [
    { id: uid(), title: 'Managers peu disponibles pendant la période', prob: 3, impact: 3, owner: ME.id, mitigation: 'Bloquer des créneaux dès maintenant dans les agendas', status: 'Ouvert' },
    { id: uid(), title: 'Support d\'entretien non conforme au nouveau cadre', prob: 2, impact: 4, owner: ME.id, mitigation: 'Relecture par le service juridique', status: 'Ouvert' },
  ];
  p1.milestones = [{ id: uid(), title: 'Validation du support en COPIL', date: addDays(start, 10), done: true }, { id: uid(), title: 'Fin des entretiens', date: addDays(start, 50), done: false }];
  p1.expenses = [{ id: uid(), label: 'Formation des managers (prestataire)', amount: 1800, date: addDays(start, 8), cat: 'Prestation' }];
  w.tasks.filter((t) => t.projectId === p1.id).forEach((t, i) => {
    t.assignee = team[i % team.length];
    t.status = i < 3 ? 'done' : i === 3 ? 'review' : i === 4 ? 'doing' : 'todo';
  });
  const p2 = addProject(w, { name: 'Nouveau logiciel de gestion des congés', code: 'CONG', desc: 'Remplacer les formulaires papier par un outil en ligne.', start: addDays(todayISO(), -10), budget: 12000 }, 'deploiement');
  p2.members = team; p2.gates = { 0: [true, true, false, true, false] };
  p2.risks = [{ id: uid(), title: 'Résistance des services habitués au papier', prob: 3, impact: 2, owner: ME.id, mitigation: 'Identifier un référent par service', status: 'Ouvert' }];
  w.tasks.filter((t) => t.projectId === p2.id).forEach((t, i) => { t.assignee = team[i % team.length]; if (i === 0) t.status = 'doing'; });
  log(w, 'a chargé les projets de démonstration');
}

/* ---------- Écrans publics ---------- */
function landing() {
  document.body.innerHTML = `<div style="max-width:1080px;margin:0 auto;padding:24px 16px 60px">
  <div class="row between" style="margin-bottom:40px"><div class="brand"><span class="logo">P</span>Pilote</div>
  <div class="row"><button class="btn" id="lt">🌓</button><a class="btn" href="#/login">Se connecter</a><a class="btn primary" href="#/signup">Créer un compte</a></div></div>
  <div style="text-align:center;max-width:720px;margin:0 auto 40px">
    <span class="badge acc">Simple · Pas cher · Formation intégrée</span>
    <h1 style="font-size:clamp(1.9rem,5vw,3rem);margin:14px 0">La gestion de projet sans la complexité.</h1>
    <p class="muted" style="font-size:1.1rem">Projets, tâches en Kanban, planning de Gantt, risques, budget et une académie intégrée pour apprendre la méthode en même temps que l'outil.</p>
    <div class="row" style="justify-content:center;margin-top:20px"><a class="btn primary" href="#/signup">Démarrer gratuitement</a><a class="btn" href="#/login">J'ai déjà un compte</a></div>
  </div>
  <div class="grid g3">${[
    ['📋', 'Tableau Kanban', 'Glissez-déposez vos tâches, limitez le travail en cours, voyez qui fait quoi.'],
    ['🗓️', 'Planning Gantt', 'Visualisez les tâches et jalons dans le temps, repérez les retards en un coup d\'œil.'],
    ['🚦', 'Processus en 5 phases', 'Cadrage → Planification → Exécution → Contrôle → Clôture, avec check-lists de passage.'],
    ['⚠️', 'Risques & budget', 'Matrice probabilité × impact, suivi des dépenses, météo projet automatique.'],
    ['👥', 'Comptes & rôles', 'Administrateur, chef de projet, membre : chacun voit ce qui le concerne.'],
    ['🎓', 'Académie intégrée', '8 formations courtes avec quiz pour apprendre à mener un projet.'],
  ].map(([i, t, d]) => `<div class="card"><div style="font-size:1.6rem">${i}</div><h3>${t}</h3><p class="muted">${d}</p></div>`).join('')}</div>
  <h2 style="text-align:center;margin:50px 0 20px">Tarifs</h2>
  <div class="grid g3">${[
    ['Gratuit', '0 €', 'Jusqu\'à 3 utilisateurs, 3 projets, académie complète.'],
    ['Équipe', '3 € / utilisateur / mois', 'Projets illimités, modèles, export, support e-mail.'],
    ['Organisation', '6 € / utilisateur / mois', 'Plusieurs espaces, rapports avancés, accompagnement au démarrage.'],
  ].map(([n, p, d], i) => `<div class="card" ${i === 1 ? 'style="border:2px solid var(--accent)"' : ''}><h3>${n}</h3><div class="kpi"><span class="v">${p}</span></div><p class="muted">${d}</p></div>`).join('')}</div>
  <p class="muted" style="text-align:center;margin-top:30px">Version actuelle : toutes les fonctionnalités sont accessibles, les données restent dans votre navigateur.</p></div>`;
  $('#lt').onclick = toggleTheme;
}

function authPage(mode) {
  const signup = mode === 'signup';
  document.body.innerHTML = `<div class="auth"><div class="box">
    <div class="brand" style="justify-content:center"><span class="logo">P</span>Pilote</div>
    <form class="card" id="f"><h2>${signup ? 'Créer votre espace' : 'Connexion'}</h2>
    ${signup ? fInput('name', 'Votre nom', '', { req: true }) + fInput('org', 'Nom de votre organisation / équipe', '', { req: true }) : ''}
    ${fInput('email', 'E-mail', '', { type: 'email', req: true })}${fInput('password', 'Mot de passe', '', { type: 'password', req: true })}
    ${signup ? `<label class="row" style="font-weight:500"><input type="checkbox" name="demo" checked> Ajouter des projets de démonstration</label><br>` : ''}
    <button class="btn primary" style="width:100%;justify-content:center">${signup ? 'Créer mon compte' : 'Se connecter'}</button>
    <p class="muted" style="margin-top:12px;text-align:center">${signup ? 'Déjà inscrit ? <a href="#/login">Se connecter</a>' : 'Pas encore de compte ? <a href="#/signup">Créer un espace</a>'}</p>
    <p style="text-align:center"><a href="#/">← Retour</a></p></form></div></div>`;
  $('#f').onsubmit = async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target).entries());
    try {
      if (signup) {
        const wsId = uid();
        const u = await auth.create({ name: fd.name, email: fd.email, password: fd.password, role: 'admin', wsId });
        const w = newWorkspace(fd.org, u.id); w.id = wsId;
        store.set('ws:' + wsId, w);
        await auth.login(fd.email, fd.password);
        ME = auth.current();
        if (e.target.demo.checked) { const w2 = ws(); seedDemo(w2); saveWs(w2); }
        location.hash = '#/guide'; boot();
      } else {
        await auth.login(fd.email, fd.password); location.hash = '#/dash'; boot();
      }
    } catch (err) { toast(err.message); }
  };
}

function forcePassword() {
  document.body.innerHTML = `<div class="auth"><form class="card box" id="f"><h2>Choisissez votre mot de passe</h2><p class="muted">Bienvenue ${esc(ME.name)} ! Votre compte a été créé avec un mot de passe provisoire.</p>
  ${fInput('p1', 'Nouveau mot de passe', '', { type: 'password', req: true })}${fInput('p2', 'Confirmation', '', { type: 'password', req: true })}<button class="btn primary">Valider</button></form></div>`;
  $('#f').onsubmit = async (e) => { e.preventDefault(); const { p1, p2 } = Object.fromEntries(new FormData(e.target)); if (p1 !== p2) return toast('Les deux mots de passe diffèrent.'); try { await auth.setPassword(ME.id, p1); boot(); } catch (err) { toast(err.message); } };
}

/* ---------- Application connectée ---------- */
function boot() {
  ME = auth.current();
  if (!ME) { const r = location.hash.replace(/^#\/?/, ''); return r === 'login' ? authPage('login') : r === 'signup' ? authPage('signup') : landing(); }
  if (ME.mustChange) return forcePassword();
  const w = ws();
  const myOpen = w.tasks.filter((t) => t.assignee === ME.id && t.status !== 'done').length;
  main = shell({ brand: 'Pilote', logo: 'P', current: 'pilote',
    nav: navLink('dash', '🏠', 'Tableau de bord') + navLink('projects', '📁', 'Projets') + navLink('tasks', '✅', 'Mes tâches', myOpen ? ` <span class="badge acc" style="margin-left:auto">${myOpen}</span>` : '') +
      navLink('team', '👥', 'Équipe') + '<div class="sec">Apprendre</div>' + navLink('academy', '🎓', 'Académie') + navLink('guide', '🧭', 'Guide & processus') +
      '<div class="sec">Compte</div>' + navLink('settings', '⚙️', 'Paramètres'),
    foot: `<div class="row"><span class="avatar">${initials(ME.name)}</span><div style="min-width:0"><div style="font-weight:600;color:var(--text)">${esc(ME.name)}</div><div>${ROLES[ME.role]} · ${esc(w.name)}</div></div></div>
      <div class="row" style="margin-top:8px"><button class="btn sm" id="th">🌓 Thème</button><button class="btn sm" id="lo">Déconnexion</button></div>` });
  $('#lo').onclick = () => { auth.logout(); location.hash = '#/'; boot(); };
  $('#th').onclick = toggleTheme;
  router.run();
}

const view = {
  dash() {
    const w = ws(); const projs = visibleProjects(w);
    const myTasks = w.tasks.filter((t) => t.assignee === ME.id && t.status !== 'done').sort((a, b) => (a.due || '9') < (b.due || '9') ? -1 : 1);
    const visibleIds = new Set(projs.map((p) => p.id));
    const allOpen = w.tasks.filter((t) => visibleIds.has(t.projectId) && t.status !== 'done');
    const late = allOpen.filter((t) => t.due && t.due < todayISO());
    const week = allOpen.filter((t) => t.due && t.due >= todayISO() && t.due <= addDays(todayISO(), 7));
    const budget = projs.reduce((s, p) => s + (p.budget || 0), 0); const spent = projs.reduce((s, p) => s + projectStats(w, p).spent, 0);
    const academyDone = Object.keys(ME.academy?.quiz || {}).length;
    main.innerHTML = `<div class="page-head"><div><h1>Bonjour ${esc(ME.name.split(' ')[0])} 👋</h1><p>${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} · ${esc(w.name)}</p></div>
      ${can('project') ? '<button class="btn primary" id="np">+ Nouveau projet</button>' : ''}</div>
      ${!projs.length ? `<div class="alert">Aucun projet pour l'instant. ${can('project') ? 'Créez votre premier projet ou suivez le <a href="#/guide">guide de démarrage</a>.' : 'Demandez à un chef de projet de vous ajouter à un projet.'}</div>` : ''}
      <div class="grid g4 kpis">
        <div class="card kpi"><span class="v">${projs.filter((p) => p.status === 'En cours').length}</span><span class="l">Projets en cours</span></div>
        <div class="card kpi"><span class="v" style="color:${late.length ? 'var(--bad)' : 'inherit'}">${late.length}</span><span class="l">Tâches en retard</span></div>
        <div class="card kpi"><span class="v">${week.length}</span><span class="l">Échéances sous 7 jours</span></div>
        <div class="card kpi"><span class="v">${budget ? Math.round((spent / budget) * 100) : 0}%</span><span class="l">Budget consommé (${fmtEur(spent)} / ${fmtEur(budget)})</span></div>
      </div>
      <div class="grid g2" style="margin-top:14px">
        <div class="card"><h3>Météo des projets</h3>${projs.length ? `<div class="stack">${projs.map((p) => { const s = projectStats(w, p); return `<a href="#/project/${p.id}" style="text-decoration:none;color:inherit;display:block"><div class="row between"><strong><span style="color:${p.color}">●</span> ${esc(p.name)}</strong><span title="${s.weather[1]}">${s.weather[0]} <span class="badge ${s.weather[2]}">${s.weather[1]}</span></span></div>
          <div class="row" style="margin-top:6px"><div style="flex:1">${bar(s.progress, p.color)}</div><small>${s.progress}% · ${PHASES[p.phase].name}</small></div></a>`; }).join('')}</div>` : '<p class="empty">Rien à afficher</p>'}</div>
        <div class="card"><div class="row between"><h3>Mes prochaines tâches</h3><a href="#/tasks">Tout voir</a></div>${myTasks.length ? taskTable(myTasks.slice(0, 6), w, true) : '<p class="empty">Aucune tâche ouverte 🎉</p>'}</div>
      </div>
      <div class="grid g2" style="margin-top:14px">
        <div class="card"><h3>Activité récente</h3>${w.activity.slice(0, 8).map((a) => `<div class="row" style="margin-bottom:8px"><span class="avatar">${initials(userName(a.u))}</span><div><strong>${esc(userName(a.u))}</strong> ${esc(a.txt)}<br><small>${new Date(a.d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</small></div></div>`).join('') || '<p class="empty">Pas encore d\'activité</p>'}</div>
        <div class="card"><h3>🎓 Continuer à apprendre</h3><p>${academyDone} formation(s) validée(s) sur ${ACADEMY.length}.</p>${bar((academyDone / ACADEMY.length) * 100)}
          <p style="margin-top:12px">${(() => { const next = ACADEMY.find((m) => !(ME.academy?.quiz || {})[m.id]); return next ? `Prochaine formation : <a href="#/academy/${next.id}/0">${next.ico} ${esc(next.title)}</a>` : 'Toutes les formations sont validées. Bravo ! <a href="#/academy">Voir le certificat</a>'; })()}</p></div>
      </div>`;
    $('#np')?.addEventListener('click', () => projectForm());
    bindTaskRows(main);
  },

  projects() {
    const w = ws(); const projs = visibleProjects(w);
    main.innerHTML = `<div class="page-head"><div><h1>Projets</h1><p>${projs.length} projet(s)</p></div>${can('project') ? '<button class="btn primary" id="np">+ Nouveau projet</button>' : ''}</div>
      <div class="grid g3">${projs.map((p) => { const s = projectStats(w, p); return `<a class="card" href="#/project/${p.id}" style="text-decoration:none;color:inherit;border-top:4px solid ${p.color}">
        <div class="row between"><span class="badge">${esc(p.code)}</span><span>${s.weather[0]}</span></div><h3 style="margin-top:8px">${esc(p.name)}</h3>
        <p class="muted" style="min-height:2.6em">${esc(p.desc.slice(0, 110))}${p.desc.length > 110 ? '…' : ''}</p>
        ${bar(s.progress, p.color)}<div class="row between" style="margin-top:8px"><small>${s.done}/${s.tasks.length} tâches · ${PHASES[p.phase].name}</small><span class="badge ${p.status === 'Terminé' ? 'ok' : p.status === 'En pause' ? 'warn' : ''}">${p.status}</span></div>
        <small>📅 ${fmtDate(p.start)} → ${fmtDate(p.end)}</small></a>`; }).join('') || '<div class="card empty">Aucun projet.</div>'}</div>`;
    $('#np')?.addEventListener('click', () => projectForm());
  },

  project(id, tab = 'overview') {
    const w = ws(); const p = w.projects.find((x) => x.id === id);
    if (!p) { main.innerHTML = '<div class="empty">Projet introuvable. <a href="#/projects">Retour</a></div>'; return; }
    const s = projectStats(w, p);
    const tabs = [['overview', 'Vue d\'ensemble'], ['board', 'Tableau'], ['list', 'Liste'], ['gantt', 'Planning'], ['risks', 'Risques'], ['budget', 'Budget'], ['members', 'Membres']];
    main.innerHTML = `<div class="page-head"><div><a href="#/projects" class="muted">← Projets</a><h1 style="margin-top:6px"><span style="color:${p.color}">●</span> ${esc(p.name)}</h1>
      <p>${esc(p.code)} · Responsable : ${esc(userName(p.ownerId))} · ${s.weather[0]} ${s.weather[1]}</p></div>
      <div class="row">${can('task') ? '<button class="btn primary" id="nt">+ Tâche</button>' : ''}${can('project') ? '<button class="btn" id="ep">Modifier</button>' : ''}</div></div>
      <div class="tabs">${tabs.map(([k, l]) => `<a href="#/project/${p.id}/${k}" class="${k === tab ? 'active' : ''}">${l}</a>`).join('')}</div><div id="tab"></div>`;
    $('#nt')?.addEventListener('click', () => taskForm(null, p.id));
    $('#ep')?.addEventListener('click', () => projectForm(p));
    (projectTabs[tab] || projectTabs.overview)($('#tab'), w, p, s);
  },

  tasks() {
    const w = ws();
    const mine = w.tasks.filter((t) => t.assignee === ME.id).sort((a, b) => (a.status === 'done') - (b.status === 'done') || ((a.due || '9') < (b.due || '9') ? -1 : 1));
    const open = mine.filter((t) => t.status !== 'done');
    const doing = open.filter((t) => t.status === 'doing').length;
    main.innerHTML = `<div class="page-head"><div><h1>Mes tâches</h1><p>${open.length} ouverte(s) · ${mine.length - open.length} terminée(s)</p></div></div>
      ${doing > 3 ? `<div class="alert warn">Vous avez ${doing} tâches « En cours ». Conseil Kanban : terminez-en avant d'en commencer de nouvelles (limite recommandée : 3).</div>` : ''}
      <div class="card">${mine.length ? taskTable(mine, w, true) : '<p class="empty">Aucune tâche ne vous est assignée.</p>'}</div>`;
    bindTaskRows(main);
  },

  team() {
    const w = ws(); const list = members();
    main.innerHTML = `<div class="page-head"><div><h1>Équipe</h1><p>${list.length} compte(s) dans l'espace « ${esc(w.name)} »</p></div>${ME.role === 'admin' ? '<button class="btn primary" id="nu">+ Créer un compte</button>' : ''}</div>
      <div class="table-wrap"><table><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th>Charge (tâches ouvertes)</th><th>Heures estimées restantes</th>${ME.role === 'admin' ? '<th></th>' : ''}</tr>
      ${list.map((u) => { const t = w.tasks.filter((x) => x.assignee === u.id && x.status !== 'done'); const hrs = t.reduce((s, x) => s + Math.max(0, (x.estimate || 0) - (x.spent || 0)), 0);
        return `<tr><td><div class="row"><span class="avatar">${initials(u.name)}</span>${esc(u.name)} ${u.mustChange ? '<span class="badge warn">mot de passe provisoire</span>' : ''}</div></td><td>${esc(u.email)}</td><td>${ROLES[u.role]}</td>
        <td><div class="row"><div style="width:100px">${bar(t.length * 10, t.length > 8 ? 'var(--bad)' : '')}</div>${t.length}</div></td><td>${hrs} h</td>
        ${ME.role === 'admin' ? `<td><button class="btn sm" data-edit="${u.id}">Modifier</button></td>` : ''}</tr>`; }).join('')}</table></div>
      <div class="alert" style="margin-top:14px">Pour créer un compte : saisissez un mot de passe provisoire et communiquez-le à la personne. Elle choisira le sien à sa première connexion. Les comptes sont stockés dans ce navigateur : pour un autre ordinateur, exportez l'espace depuis les Paramètres.</div>`;
    $('#nu')?.addEventListener('click', () => userForm());
    $$('[data-edit]').forEach((b) => b.onclick = () => userForm(auth.users().find((u) => u.id === b.dataset.edit)));
  },

  academy(modId, lessonIdx) {
    if (modId) return academyLesson(modId, Number(lessonIdx || 0));
    const res = ME.academy || { read: {}, quiz: {} };
    const done = ACADEMY.filter((m) => res.quiz?.[m.id]).length;
    main.innerHTML = `<div class="page-head"><div><h1>Académie Pilote</h1><p>Apprenez la gestion de projet pas à pas. Chaque formation se termine par un quiz (70 % pour valider).</p></div></div>
      <div class="card"><div class="row between"><strong>Votre progression</strong><span>${done} / ${ACADEMY.length} formations validées</span></div><div style="margin-top:8px">${bar((done / ACADEMY.length) * 100)}</div>
      ${done === ACADEMY.length ? '<p style="margin-top:12px">🏆 Parcours complet ! <button class="btn sm" id="cert">Afficher mon attestation</button></p>' : ''}</div>
      <div class="grid g2" style="margin-top:14px">${ACADEMY.map((m) => { const read = m.lessons.filter((_, i) => res.read?.[m.id + ':' + i]).length; const q = res.quiz?.[m.id];
        return `<a class="card" href="#/academy/${m.id}/0" style="text-decoration:none;color:inherit"><div class="row between"><span style="font-size:1.5rem">${m.ico}</span><span class="badge ${q ? 'ok' : ''}">${q ? '✓ Validée ' + q + '%' : m.level}</span></div>
        <h3 style="margin-top:8px">${esc(m.title)}</h3><small>${m.lessons.length} leçons · ${m.quiz.length} questions</small><div style="margin-top:8px">${bar((read / m.lessons.length) * 100)}</div></a>`; }).join('')}</div>`;
    $('#cert')?.addEventListener('click', certificate);
  },

  guide() {
    const w = ws();
    const steps = [
      ['Créer votre espace de travail', true, 'C\'est fait : vous êtes administrateur de « ' + w.name + ' ».', ''],
      ['Créer les comptes de votre équipe', members().length > 1, 'Menu Équipe → Créer un compte. Choisissez le rôle de chacun.', '#/team'],
      ['Créer un premier projet', w.projects.length > 0, 'Partez d\'un modèle (entretiens, recrutement, déploiement d\'outil…) pour gagner du temps.', '#/projects'],
      ['Compléter le cadrage', w.projects.some((p) => (p.gates[0] || []).filter(Boolean).length >= 3), 'Dans la vue d\'ensemble du projet, cochez la check-list de cadrage.', w.projects[0] ? '#/project/' + w.projects[0].id : '#/projects'],
      ['Assigner les tâches', w.tasks.some((t) => t.assignee), 'Chaque tâche : un responsable, une échéance.', w.projects[0] ? '#/project/' + w.projects[0].id + '/list' : '#/projects'],
      ['Déclarer les risques', w.projects.some((p) => p.risks.length), 'Onglet Risques : probabilité × impact.', w.projects[0] ? '#/project/' + w.projects[0].id + '/risks' : '#/projects'],
      ['Suivre en Kanban', w.tasks.some((t) => t.status === 'done'), 'Faites glisser les cartes au fil de l\'avancement.', w.projects[0] ? '#/project/' + w.projects[0].id + '/board' : '#/projects'],
      ['Se former', Object.keys(ME.academy?.quiz || {}).length > 0, 'Validez au moins une formation de l\'Académie.', '#/academy'],
    ];
    const ok = steps.filter((s) => s[1]).length;
    main.innerHTML = `<div class="page-head"><div><h1>Guide de démarrage & processus</h1><p>Le chemin complet, de la création des comptes à la clôture d'un projet.</p></div></div>
      <div class="card"><div class="row between"><strong>Mise en route</strong><span>${ok} / ${steps.length}</span></div><div style="margin:8px 0 14px">${bar((ok / steps.length) * 100)}</div>
      ${steps.map(([t, d, h, link], i) => `<div class="row" style="padding:10px 0;border-top:1px solid var(--line);flex-wrap:nowrap"><span class="badge ${d ? 'ok' : ''}" style="min-width:34px;justify-content:center">${d ? '✓' : i + 1}</span><div style="flex:1"><strong>${t}</strong><br><small>${h}</small></div>${link && !d ? `<a class="btn sm" href="${link}">Y aller</a>` : ''}</div>`).join('')}</div>
      <div class="card"><h3>Le processus projet en 5 phases</h3><div class="grid g3" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">${PHASES.map((ph, i) => `<div style="background:var(--panel-2);border-radius:10px;padding:12px"><span class="badge acc">Phase ${i + 1}</span><h4 style="margin:8px 0">${ph.name}</h4><ul style="padding-left:1.1em;margin:0;font-size:.88rem">${ph.gates.map((g) => `<li>${g}</li>`).join('')}</ul></div>`).join('')}</div>
      <p style="margin-top:12px" class="muted">Approfondissez chaque phase dans l'<a href="#/academy">Académie</a>.</p></div>`;
  },

  settings() {
    const w = ws();
    main.innerHTML = `<div class="page-head"><div><h1>Paramètres</h1></div></div>
      <div class="grid g2"><form class="card" id="wsf"><h3>Espace de travail</h3>${fInput('name', 'Nom', w.name)}${fSelect('plan', 'Formule', ['Gratuit', 'Équipe', 'Organisation'], w.plan)}
        <button class="btn primary" ${ME.role !== 'admin' ? 'disabled' : ''}>Enregistrer</button></form>
      <form class="card" id="pwf"><h3>Mon mot de passe</h3>${fInput('p1', 'Nouveau mot de passe', '', { type: 'password' })}<button class="btn">Changer</button></form></div>
      <div class="card"><h3>Sauvegarde & transfert</h3><p class="muted">Exportez tout l'espace (projets, tâches et comptes) dans un fichier, puis importez-le sur un autre ordinateur.</p>
        <div class="row"><button class="btn" id="exp">⬇️ Exporter l'espace</button><button class="btn" id="imp">⬆️ Importer un fichier</button><button class="btn" id="csv">Exporter les tâches (CSV)</button>
        ${ME.role === 'admin' ? '<button class="btn" id="demo">Ajouter les projets de démonstration</button><button class="btn danger" id="wipe">Tout effacer</button>' : ''}</div></div>`;
    $('#wsf').onsubmit = (e) => { e.preventDefault(); const fd = Object.fromEntries(new FormData(e.target)); mutate((x) => { x.name = fd.name; x.plan = fd.plan; }); toast('Enregistré'); boot(); };
    $('#pwf').onsubmit = async (e) => { e.preventDefault(); try { await auth.setPassword(ME.id, e.target.p1.value); toast('Mot de passe changé'); e.target.reset(); } catch (err) { toast(err.message); } };
    $('#exp').onclick = () => download(`pilote-${w.name}.json`, JSON.stringify({ app: 'pilote', ws: ws(), users: members() }, null, 2));
    $('#imp').onclick = async () => {
      try { const data = JSON.parse(await pickFile()); if (data.app !== 'pilote') throw new Error('Fichier non reconnu');
        store.set('ws:' + data.ws.id, data.ws); const others = auth.users().filter((u) => !data.users.some((d) => d.id === u.id || d.email === u.email)); auth.saveUsers([...others, ...data.users]);
        toast('Import réussi — reconnectez-vous'); auth.logout(); location.hash = '#/login'; boot(); } catch (err) { toast('Import impossible : ' + err.message); }
    };
    $('#csv').onclick = () => download('taches.csv', '﻿' + toCSV([['Projet', 'Tâche', 'Statut', 'Priorité', 'Responsable', 'Début', 'Échéance', 'Estimé (h)', 'Passé (h)'],
      ...w.tasks.map((t) => [w.projects.find((p) => p.id === t.projectId)?.name, t.title, STATUSES.find((s) => s[0] === t.status)[1], t.priority, userName(t.assignee), t.start, t.due, t.estimate, t.spent])]), 'text/csv');
    $('#demo')?.addEventListener('click', () => { mutate(seedDemo); toast('Projets de démonstration ajoutés'); });
    $('#wipe')?.addEventListener('click', async () => { if (await ask('Effacer définitivement tous les projets et tâches de cet espace ?')) { mutate((x) => { x.projects = []; x.tasks = []; log(x, 'a effacé toutes les données'); }); toast('Données effacées'); } });
  },
};

/* ---------- Onglets projet ---------- */
const projectTabs = {
  overview(el, w, p, s) {
    const gates = p.gates[p.phase] || [];
    const phase = PHASES[p.phase];
    const allChecked = phase.gates.every((_, i) => gates[i]);
    el.innerHTML = `<div class="grid g4 kpis"><div class="card kpi"><span class="v">${s.progress}%</span><span class="l">Avancement</span></div>
      <div class="card kpi"><span class="v" style="color:${s.late ? 'var(--bad)' : ''}">${s.late}</span><span class="l">Tâches en retard</span></div>
      <div class="card kpi"><span class="v">${p.budget ? s.budgetPct + '%' : '—'}</span><span class="l">Budget consommé</span></div>
      <div class="card kpi"><span class="v" style="color:${s.critical ? 'var(--bad)' : ''}">${s.critical}</span><span class="l">Risques critiques</span></div></div>
      <div class="grid g2" style="margin-top:14px"><div class="card"><h3>Processus projet</h3>
        <div class="row" style="gap:4px;margin-bottom:14px">${PHASES.map((ph, i) => `<span class="badge ${i < p.phase ? 'ok' : i === p.phase ? 'acc' : ''}" style="flex:1;justify-content:center">${i < p.phase ? '✓ ' : ''}${ph.name}</span>`).join('')}</div>
        <strong>Check-list « ${phase.name} »</strong>
        <div style="margin-top:8px">${phase.gates.map((g, i) => `<label class="row" style="font-weight:500;padding:4px 0;flex-wrap:nowrap"><input type="checkbox" data-gate="${i}" ${gates[i] ? 'checked' : ''} ${can('project') ? '' : 'disabled'}> ${g}</label>`).join('')}</div>
        ${can('project') ? `<div class="row" style="margin-top:12px">${p.phase > 0 ? '<button class="btn sm" id="prev">← Phase précédente</button>' : ''}${p.phase < PHASES.length - 1 ? `<button class="btn sm ${allChecked ? 'primary' : ''}" id="next">Passer à « ${PHASES[p.phase + 1].name} » →</button>` : ''}</div>` : ''}
        ${!allChecked && p.phase < PHASES.length - 1 ? '<small class="muted">Conseil : complétez la check-list avant de passer à la phase suivante.</small>' : ''}</div>
      <div class="card"><h3>Informations</h3><p>${esc(p.desc) || '<span class="muted">Pas de description</span>'}</p>
        <table><tr><td class="muted">Période</td><td>${fmtDate(p.start)} → ${fmtDate(p.end)} (${daysBetween(todayISO(), p.end)} j restants)</td></tr><tr><td class="muted">Sponsor</td><td>${esc(p.sponsor) || '—'}</td></tr>
        <tr><td class="muted">Statut</td><td>${p.status}</td></tr><tr><td class="muted">Budget</td><td>${fmtEur(s.spent)} / ${fmtEur(p.budget)}</td></tr></table></div></div>
      <div class="card"><div class="row between"><h3>Jalons</h3>${can('project') ? '<button class="btn sm" id="nm">+ Jalon</button>' : ''}</div>
        ${p.milestones.length ? p.milestones.sort((a, b) => a.date < b.date ? -1 : 1).map((m) => `<label class="row" style="font-weight:500;padding:6px 0;border-top:1px solid var(--line);flex-wrap:nowrap"><input type="checkbox" data-ms="${m.id}" ${m.done ? 'checked' : ''}> ◆ <span style="flex:1">${esc(m.title)}</span><small>${fmtDate(m.date)}</small>${!m.done && m.date < todayISO() ? '<span class="badge bad">dépassé</span>' : ''}</label>`).join('') : '<p class="muted">Aucun jalon. Un jalon marque une étape clé (validation, livraison…).</p>'}</div>`;
    $$('[data-gate]', el).forEach((c) => c.onchange = () => { mutate((x) => { const pp = x.projects.find((y) => y.id === p.id); pp.gates[pp.phase] = pp.gates[pp.phase] || []; pp.gates[pp.phase][c.dataset.gate] = c.checked; }); view.project(p.id, 'overview'); });
    $('#next', el)?.addEventListener('click', () => { mutate((x) => { const pp = x.projects.find((y) => y.id === p.id); pp.phase++; log(x, `a fait passer « ${pp.name} » en phase ${PHASES[pp.phase].name}`); }); view.project(p.id, 'overview'); });
    $('#prev', el)?.addEventListener('click', () => { mutate((x) => { x.projects.find((y) => y.id === p.id).phase--; }); view.project(p.id, 'overview'); });
    $$('[data-ms]', el).forEach((c) => c.onchange = () => { mutate((x) => { x.projects.find((y) => y.id === p.id).milestones.find((m) => m.id === c.dataset.ms).done = c.checked; }); });
    $('#nm', el)?.addEventListener('click', () => modal({ title: 'Nouveau jalon', body: fInput('title', 'Intitulé', '', { req: true }) + fInput('date', 'Date', addDays(todayISO(), 14), { type: 'date' }),
      onSubmit: (fd) => { if (!fd.title) throw new Error('Intitulé obligatoire'); mutate((x) => x.projects.find((y) => y.id === p.id).milestones.push({ id: uid(), title: fd.title, date: fd.date, done: false })); view.project(p.id, 'overview'); } }));
  },

  board(el, w, p, s) {
    el.innerHTML = `<div class="kanban">${STATUSES.map(([k, l]) => { const ts = s.tasks.filter((t) => t.status === k);
      return `<div class="col" data-col="${k}"><h4><span>${l}</span><span>${ts.length}</span></h4>${ts.map((t) => taskCard(t)).join('')}
      ${can('task') ? `<button class="btn sm ghost" data-add="${k}" style="width:100%">+ Ajouter</button>` : ''}</div>`; }).join('')}</div>`;
    $$('.tcard', el).forEach((c) => {
      c.draggable = true;
      c.ondragstart = (e) => e.dataTransfer.setData('text/plain', c.dataset.task);
      c.onclick = () => taskForm(ws().tasks.find((t) => t.id === c.dataset.task));
    });
    $$('.col', el).forEach((col) => {
      col.ondragover = (e) => { e.preventDefault(); col.classList.add('over'); };
      col.ondragleave = () => col.classList.remove('over');
      col.ondrop = (e) => { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); setStatus(id, col.dataset.col); view.project(p.id, 'board'); };
    });
    $$('[data-add]', el).forEach((b) => b.onclick = () => taskForm(null, p.id, b.dataset.add));
  },

  list(el, w, p, s) {
    el.innerHTML = `<div class="card">${s.tasks.length ? taskTable(s.tasks.sort((a, b) => (a.start < b.start ? -1 : 1)), w, false) : '<p class="empty">Aucune tâche.</p>'}</div>`;
    bindTaskRows(el);
  },

  gantt(el, w, p, s) {
    const items = s.tasks.filter((t) => t.start || t.due);
    const dates = [p.start, p.end, ...items.map((t) => t.start), ...items.map((t) => t.due), ...p.milestones.map((m) => m.date)].filter(Boolean).sort();
    const min = dates[0], max = dates[dates.length - 1]; const span = Math.max(1, daysBetween(min, max) + 1);
    const pos = (d) => (daysBetween(min, d) / span) * 100;
    const months = []; let d = new Date(min + 'T12:00:00'); d.setDate(1);
    while (d.toISOString().slice(0, 10) <= max) { months.push(d.toISOString().slice(0, 10)); d.setMonth(d.getMonth() + 1); }
    const todayPos = pos(todayISO());
    el.innerHTML = `<div class="card" style="overflow-x:auto"><div style="min-width:760px">
      <div style="display:grid;grid-template-columns:230px 1fr;border-bottom:1px solid var(--line);padding-bottom:6px"><strong>Tâche</strong><div style="position:relative;height:20px">${months.map((m) => `<small style="position:absolute;left:${Math.max(0, pos(m))}%">${new Date(m + 'T12:00:00').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })}</small>`).join('')}</div></div>
      ${items.map((t) => { const a = t.start || t.due, b = t.due || t.start; const late = t.status !== 'done' && t.due && t.due < todayISO();
        return `<div style="display:grid;grid-template-columns:230px 1fr;align-items:center;border-bottom:1px solid var(--line);min-height:34px" class="click" data-task="${t.id}">
        <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:8px;font-size:.88rem">${t.status === 'done' ? '✓ ' : ''}${esc(t.title)}</div>
        <div style="position:relative;height:34px">${todayPos >= 0 && todayPos <= 100 ? `<i style="position:absolute;left:${todayPos}%;top:0;bottom:0;border-left:2px dashed var(--bad);opacity:.5"></i>` : ''}
        <div title="${fmtDate(a)} → ${fmtDate(b)}" style="position:absolute;top:8px;height:18px;border-radius:5px;left:${pos(a)}%;width:${Math.max(0.8, ((daysBetween(a, b) + 1) / span) * 100)}%;background:${late ? 'var(--bad)' : p.color};opacity:${t.status === 'done' ? .45 : 1}"></div></div></div>`; }).join('')}
      ${p.milestones.map((m) => `<div style="display:grid;grid-template-columns:230px 1fr;align-items:center;min-height:30px;border-bottom:1px solid var(--line)"><div style="font-size:.88rem">◆ ${esc(m.title)}</div><div style="position:relative;height:30px"><span style="position:absolute;left:calc(${pos(m.date)}% - 7px);top:5px;color:${m.done ? 'var(--ok)' : 'var(--warn)'};font-size:1.1rem">◆</span></div></div>`).join('')}
      </div><p class="muted" style="margin-top:10px">Barre rouge : tâche en retard · trait pointillé : aujourd'hui · ◆ : jalon. Cliquez sur une ligne pour modifier la tâche.</p></div>`;
    $$('[data-task]', el).forEach((r) => r.onclick = () => taskForm(ws().tasks.find((t) => t.id === r.dataset.task)));
  },

  risks(el, w, p) {
    const cell = (pr, im) => p.risks.filter((r) => r.prob === pr && r.impact === im && r.status !== 'Clos');
    const color = (v) => v >= 9 ? 'var(--bad-bg)' : v >= 4 ? 'var(--warn-bg)' : 'var(--ok-bg)';
    el.innerHTML = `<div class="grid g2"><div class="card"><h3>Matrice des risques</h3><div style="display:grid;grid-template-columns:30px repeat(4,1fr);gap:4px;font-size:.8rem">
      ${[4, 3, 2, 1].map((pr) => `<div style="display:grid;place-items:center" class="muted">P${pr}</div>${[1, 2, 3, 4].map((im) => `<div style="background:${color(pr * im)};border-radius:6px;min-height:54px;padding:4px;text-align:center"><strong>${cell(pr, im).length || ''}</strong></div>`).join('')}`).join('')}
      <div></div>${[1, 2, 3, 4].map((i) => `<div style="text-align:center" class="muted">Impact ${i}</div>`).join('')}</div>
      <p class="muted" style="margin-top:10px">Criticité = probabilité × impact. Rouge ≥ 9 : à traiter en priorité.</p></div>
      <div class="card"><h3>Réponses possibles</h3><ul><li><strong>Éviter</strong> : changer le plan pour supprimer le risque.</li><li><strong>Réduire</strong> : actions préventives.</li><li><strong>Transférer</strong> : assurance, prestataire.</li><li><strong>Accepter</strong> : avec un plan de secours.</li></ul></div></div>
      <div class="card"><div class="row between"><h3>Registre des risques</h3>${can('project') ? '<button class="btn sm primary" id="nr">+ Risque</button>' : ''}</div>
      ${p.risks.length ? `<div class="table-wrap"><table><tr><th>Risque</th><th>P</th><th>I</th><th>Criticité</th><th>Action</th><th>Responsable</th><th>Statut</th></tr>
      ${p.risks.sort((a, b) => b.prob * b.impact - a.prob * a.impact).map((r) => `<tr class="click" data-risk="${r.id}"><td>${esc(r.title)}</td><td>${r.prob}</td><td>${r.impact}</td><td><span class="badge ${r.prob * r.impact >= 9 ? 'bad' : r.prob * r.impact >= 4 ? 'warn' : 'ok'}">${r.prob * r.impact}</span></td><td>${esc(r.mitigation)}</td><td>${esc(userName(r.owner))}</td><td>${r.status}</td></tr>`).join('')}</table></div>` : '<p class="empty">Aucun risque déclaré.</p>'}</div>`;
    $('#nr', el)?.addEventListener('click', () => riskForm(p));
    $$('[data-risk]', el).forEach((r) => r.onclick = () => can('project') && riskForm(p, p.risks.find((x) => x.id === r.dataset.risk)));
  },

  budget(el, w, p, s) {
    const cats = {}; p.expenses.forEach((e) => { cats[e.cat] = (cats[e.cat] || 0) + Number(e.amount); });
    const hours = s.tasks.reduce((a, t) => a + (t.spent || 0), 0); const est = s.tasks.reduce((a, t) => a + (t.estimate || 0), 0);
    el.innerHTML = `<div class="grid g3"><div class="card kpi"><span class="v">${fmtEur(p.budget)}</span><span class="l">Budget prévu</span></div>
      <div class="card kpi"><span class="v">${fmtEur(s.spent)}</span><span class="l">Dépensé (${s.budgetPct}%) — avancement ${s.progress}%</span></div>
      <div class="card kpi"><span class="v">${hours} / ${est} h</span><span class="l">Temps passé / estimé</span></div></div>
      ${p.budget && s.budgetPct > s.progress + 15 ? '<div class="alert warn" style="margin-top:14px">La consommation du budget est nettement plus rapide que l\'avancement. À signaler au sponsor.</div>' : ''}
      <div class="grid g2" style="margin-top:14px"><div class="card"><div class="row between"><h3>Dépenses</h3>${can('project') ? '<button class="btn sm primary" id="ne">+ Dépense</button>' : ''}</div>
        ${p.expenses.length ? `<table>${p.expenses.map((e) => `<tr><td>${fmtDate(e.date)}</td><td>${esc(e.label)}<br><small>${esc(e.cat)}</small></td><td style="text-align:right">${fmtEur2(e.amount)}</td>${can('project') ? `<td><button class="btn sm ghost" data-del="${e.id}">✕</button></td>` : ''}</tr>`).join('')}</table>` : '<p class="empty">Aucune dépense.</p>'}</div>
      <div class="card"><h3>Par catégorie</h3>${Object.entries(cats).map(([c, v]) => `<div style="margin-bottom:10px"><div class="row between"><span>${esc(c)}</span><strong>${fmtEur(v)}</strong></div>${bar(s.spent ? (v / s.spent) * 100 : 0)}</div>`).join('') || '<p class="muted">—</p>'}</div></div>`;
    $('#ne', el)?.addEventListener('click', () => modal({ title: 'Nouvelle dépense', body: `<div class="fields">${fInput('label', 'Libellé', '', { req: true, full: true })}${fInput('amount', 'Montant (€)', '', { type: 'number', attrs: 'step="0.01" min="0"' })}${fInput('date', 'Date', todayISO(), { type: 'date' })}${fSelect('cat', 'Catégorie', ['Prestation', 'Matériel', 'Logiciel', 'Formation', 'Déplacement', 'Communication', 'Autre'], 'Prestation', { full: true })}</div>`,
      onSubmit: (fd) => { if (!fd.label || !fd.amount) throw new Error('Libellé et montant obligatoires'); mutate((x) => x.projects.find((y) => y.id === p.id).expenses.push({ id: uid(), ...fd, amount: Number(fd.amount) })); view.project(p.id, 'budget'); } }));
    $$('[data-del]', el).forEach((b) => b.onclick = () => { mutate((x) => { const pp = x.projects.find((y) => y.id === p.id); pp.expenses = pp.expenses.filter((e) => e.id !== b.dataset.del); }); view.project(p.id, 'budget'); });
  },

  members(el, w, p) {
    const all = members();
    el.innerHTML = `<div class="card"><h3>Membres du projet</h3><p class="muted">Les membres « Membre » ne voient que les projets auxquels ils sont rattachés.</p>
      ${all.map((u) => { const n = w.tasks.filter((t) => t.projectId === p.id && t.assignee === u.id && t.status !== 'done').length;
        return `<label class="row" style="font-weight:500;padding:8px 0;border-top:1px solid var(--line);flex-wrap:nowrap"><input type="checkbox" data-mem="${u.id}" ${p.members.includes(u.id) ? 'checked' : ''} ${can('project') ? '' : 'disabled'}><span class="avatar">${initials(u.name)}</span><span style="flex:1">${esc(u.name)} <small>· ${ROLES[u.role]}</small></span><small>${n} tâche(s) ouverte(s)</small></label>`; }).join('')}</div>`;
    $$('[data-mem]', el).forEach((c) => c.onchange = () => mutate((x) => { const pp = x.projects.find((y) => y.id === p.id); pp.members = c.checked ? [...new Set([...pp.members, c.dataset.mem])] : pp.members.filter((m) => m !== c.dataset.mem); }));
  },
};

/* ---------- Tâches ---------- */
function taskCard(t) {
  const late = t.status !== 'done' && t.due && t.due < todayISO();
  const cl = t.checklist.length ? `☑ ${t.checklist.filter((c) => c.done).length}/${t.checklist.length}` : '';
  return `<div class="tcard" data-task="${t.id}"><div class="t">${esc(t.title)}</div><div class="meta">
    <span class="badge ${t.priority === 'Urgente' ? 'bad' : t.priority === 'Haute' ? 'warn' : ''}">${t.priority}</span>
    ${t.due ? `<span style="color:${late ? 'var(--bad)' : ''}">📅 ${fmtDate(t.due)}</span>` : ''}${cl ? `<span>${cl}</span>` : ''}${t.comments.length ? `<span>💬 ${t.comments.length}</span>` : ''}
    ${t.assignee ? `<span class="avatar" style="margin-left:auto;width:24px;height:24px;font-size:.68rem" title="${esc(userName(t.assignee))}">${initials(userName(t.assignee))}</span>` : ''}</div></div>`;
}
function taskTable(tasks, w, showProject) {
  return `<div class="table-wrap"><table><tr><th>Tâche</th>${showProject ? '<th>Projet</th>' : ''}<th>Statut</th><th>Priorité</th><th>Responsable</th><th>Échéance</th></tr>
    ${tasks.map((t) => { const p = w.projects.find((x) => x.id === t.projectId); const late = t.status !== 'done' && t.due && t.due < todayISO();
      return `<tr class="click" data-task="${t.id}"><td>${t.status === 'done' ? '<s>' + esc(t.title) + '</s>' : esc(t.title)}</td>${showProject ? `<td><span style="color:${p?.color}">●</span> ${esc(p?.name || '')}</td>` : ''}
      <td><span class="badge ${t.status === 'done' ? 'ok' : t.status === 'doing' ? 'info' : t.status === 'review' ? 'acc' : ''}">${STATUSES.find((s) => s[0] === t.status)[1]}</span></td><td>${t.priority}</td><td>${esc(userName(t.assignee))}</td>
      <td style="color:${late ? 'var(--bad)' : ''};white-space:nowrap">${fmtDate(t.due)}${late ? ' ⚠' : ''}</td></tr>`; }).join('')}</table></div>`;
}
function bindTaskRows(el) { $$('tr[data-task]', el).forEach((r) => r.onclick = () => taskForm(ws().tasks.find((t) => t.id === r.dataset.task))); }
function setStatus(id, status) {
  mutate((w) => { const t = w.tasks.find((x) => x.id === id); if (t && t.status !== status) { t.status = status; log(w, `a passé « ${t.title} » en ${STATUSES.find((s) => s[0] === status)[1]}`); } });
}
function rerender() { router.run(); }

function taskForm(t, projectId, status = 'todo') {
  const w = ws(); const isNew = !t;
  const pid = t?.projectId || projectId;
  const p = w.projects.find((x) => x.id === pid);
  const canEdit = can('project') || isNew || t.assignee === ME.id || !t.assignee;
  const opts = [['', '— Personne —'], ...members().map((u) => [u.id, u.name])];
  t = t || newTask(pid, { title: '', status, due: addDays(todayISO(), 7) });
  modal({
    title: isNew ? 'Nouvelle tâche' : 'Tâche', wide: true, submit: canEdit ? 'Enregistrer' : null, cancel: 'Fermer',
    body: `<p class="muted"><span style="color:${p?.color}">●</span> ${esc(p?.name || '')}</p><div class="fields">
      ${fInput('title', 'Intitulé', t.title, { req: true, full: true })}${fText('desc', 'Description', t.desc)}
      ${fSelect('status', 'Statut', STATUSES, t.status)}${fSelect('priority', 'Priorité', PRIOS, t.priority)}
      ${fSelect('assignee', 'Responsable', opts, t.assignee)}<div></div>
      ${fInput('start', 'Début', t.start, { type: 'date' })}${fInput('due', 'Échéance', t.due, { type: 'date' })}
      ${fInput('estimate', 'Temps estimé (h)', t.estimate, { type: 'number', attrs: 'min="0"' })}${fInput('spent', 'Temps passé (h)', t.spent, { type: 'number', attrs: 'min="0"' })}</div>
      <h3>Check-list</h3><div id="cl">${t.checklist.map((c, i) => `<label class="row" style="font-weight:500;flex-wrap:nowrap"><input type="checkbox" data-ci="${i}" ${c.done ? 'checked' : ''}> ${esc(c.t)}</label>`).join('')}</div>
      <div class="row" style="margin-top:6px;flex-wrap:nowrap"><input id="newci" placeholder="Ajouter un élément…"><button type="button" class="btn sm" id="addci">Ajouter</button></div>
      ${isNew ? '' : `<h3 style="margin-top:16px">Commentaires</h3><div id="cm">${t.comments.map((c) => `<div style="background:var(--panel-2);border-radius:8px;padding:8px;margin-bottom:6px"><strong>${esc(userName(c.u))}</strong> <small>${new Date(c.d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</small><br>${esc(c.t)}</div>`).join('') || '<p class="muted">Aucun commentaire.</p>'}</div>
      <div class="row" style="flex-wrap:nowrap"><input id="newcm" placeholder="Écrire un commentaire…"><button type="button" class="btn sm" id="addcm">Envoyer</button></div>`}`,
    danger: !isNew && can('project') ? { label: 'Supprimer', onClick: async () => { if (!await ask('Supprimer cette tâche ?')) return false; mutate((x) => { x.tasks = x.tasks.filter((y) => y.id !== t.id); log(x, `a supprimé la tâche « ${t.title} »`); }); rerender(); } } : null,
    onOpen(form) {
      const checklist = t.checklist.map((c) => ({ ...c }));
      form._checklist = checklist;
      const drawCl = () => { $('#cl', form).innerHTML = checklist.map((c, i) => `<label class="row" style="font-weight:500;flex-wrap:nowrap"><input type="checkbox" data-ci="${i}" ${c.done ? 'checked' : ''}> ${esc(c.t)}</label>`).join(''); $$('[data-ci]', form).forEach((cb) => cb.onchange = () => { checklist[cb.dataset.ci].done = cb.checked; }); };
      drawCl();
      $('#addci', form).onclick = () => { const v = $('#newci', form).value.trim(); if (v) { checklist.push({ t: v, done: false }); $('#newci', form).value = ''; drawCl(); } };
      $('#addcm', form)?.addEventListener('click', () => { const v = $('#newcm', form).value.trim(); if (!v) return;
        mutate((x) => { x.tasks.find((y) => y.id === t.id).comments.push({ u: ME.id, t: v, d: new Date().toISOString() }); log(x, `a commenté « ${t.title} »`); });
        $('#cm', form).insertAdjacentHTML('beforeend', `<div style="background:var(--panel-2);border-radius:8px;padding:8px;margin-bottom:6px"><strong>${esc(ME.name)}</strong><br>${esc(v)}</div>`); $('#newcm', form).value = ''; });
      if (!canEdit) $$('input,select,textarea', form).forEach((i) => { if (i.id !== 'newcm') i.disabled = true; });
    },
    onSubmit(fd, form) {
      if (!fd.title?.trim()) throw new Error('L\'intitulé est obligatoire');
      if (fd.start && fd.due && fd.due < fd.start) throw new Error('L\'échéance est avant la date de début');
      mutate((x) => {
        const data = { title: fd.title.trim(), desc: fd.desc, status: fd.status, priority: fd.priority, assignee: fd.assignee, start: fd.start, due: fd.due, estimate: Number(fd.estimate) || 0, spent: Number(fd.spent) || 0, checklist: form._checklist };
        if (isNew) { x.tasks.push({ ...t, ...data }); log(x, `a créé la tâche « ${data.title} »`); }
        else { const y = x.tasks.find((z) => z.id === t.id); if (y.status !== data.status) log(x, `a passé « ${data.title} » en ${STATUSES.find((s) => s[0] === data.status)[1]}`); Object.assign(y, data); }
      });
      rerender();
    },
  });
}

function projectForm(p) {
  const isNew = !p;
  p = p || { name: '', code: '', desc: '', ownerId: ME.id, sponsor: '', start: todayISO(), end: addDays(todayISO(), 90), budget: 0, status: 'En cours', color: COLORS[ws().projects.length % COLORS.length] };
  const managers = members().filter((u) => u.role !== 'member').map((u) => [u.id, u.name]);
  modal({
    title: isNew ? 'Nouveau projet' : 'Modifier le projet', wide: true,
    body: `<div class="fields">${fInput('name', 'Nom du projet', p.name, { req: true })}${fInput('code', 'Code court', p.code, { attrs: 'maxlength="8"' })}
      ${fText('desc', 'Description / objectif', p.desc)}${fSelect('ownerId', 'Chef de projet', managers, p.ownerId)}${fInput('sponsor', 'Sponsor / commanditaire', p.sponsor)}
      ${fInput('start', 'Début', p.start, { type: 'date' })}${fInput('end', 'Fin prévue', p.end, { type: 'date' })}
      ${fInput('budget', 'Budget (€)', p.budget, { type: 'number', attrs: 'min="0"' })}${fSelect('status', 'Statut', PROJ_STATUS, p.status)}
      ${isNew ? fSelect('template', 'Partir d\'un modèle', Object.entries(TEMPLATES).map(([k, v]) => [k, v.name]), 'vide', { full: true }) : ''}
      <div class="field full"><label>Couleur</label><div class="row">${COLORS.map((c) => `<label style="margin:0"><input type="radio" name="color" value="${c}" ${c === p.color ? 'checked' : ''}> <span style="color:${c};font-size:1.3rem">●</span></label>`).join('')}</div></div></div>`,
    danger: !isNew && ME.role === 'admin' ? { label: 'Supprimer le projet', onClick: async () => { if (!await ask('Supprimer ce projet et toutes ses tâches ?')) return false; mutate((x) => { x.projects = x.projects.filter((y) => y.id !== p.id); x.tasks = x.tasks.filter((t) => t.projectId !== p.id); log(x, `a supprimé le projet « ${p.name} »`); }); location.hash = '#/projects'; } } : null,
    onSubmit(fd) {
      if (!fd.name?.trim()) throw new Error('Le nom est obligatoire');
      if (fd.end < fd.start) throw new Error('La date de fin est avant le début');
      let id = p.id;
      mutate((w) => {
        if (isNew) id = addProject(w, fd, fd.template).id;
        else Object.assign(w.projects.find((x) => x.id === p.id), { ...fd, budget: Number(fd.budget) || 0 });
      });
      location.hash = '#/project/' + id; router.run();
    },
  });
}

function riskForm(p, r) {
  const isNew = !r; r = r || { title: '', prob: 2, impact: 2, owner: ME.id, mitigation: '', status: 'Ouvert' };
  const scale = [[1, '1 — Faible'], [2, '2 — Moyen'], [3, '3 — Élevé'], [4, '4 — Très élevé']];
  modal({ title: isNew ? 'Nouveau risque' : 'Risque',
    body: `<div class="fields">${fInput('title', 'Description du risque', r.title, { full: true, req: true })}${fSelect('prob', 'Probabilité', scale, r.prob)}${fSelect('impact', 'Impact', scale, r.impact)}
      ${fText('mitigation', 'Action (éviter / réduire / transférer / accepter)', r.mitigation)}${fSelect('owner', 'Responsable', members().map((u) => [u.id, u.name]), r.owner)}${fSelect('status', 'Statut', ['Ouvert', 'En traitement', 'Clos'], r.status)}</div>`,
    danger: !isNew ? { label: 'Supprimer', onClick: () => { mutate((x) => { const pp = x.projects.find((y) => y.id === p.id); pp.risks = pp.risks.filter((y) => y.id !== r.id); }); view.project(p.id, 'risks'); } } : null,
    onSubmit(fd) {
      if (!fd.title) throw new Error('Description obligatoire');
      mutate((x) => { const pp = x.projects.find((y) => y.id === p.id); const data = { ...fd, prob: Number(fd.prob), impact: Number(fd.impact) };
        if (isNew) { pp.risks.push({ id: uid(), ...data }); log(x, `a déclaré un risque sur « ${pp.name} »`); } else Object.assign(pp.risks.find((y) => y.id === r.id), data); });
      view.project(p.id, 'risks');
    } });
}

function userForm(u) {
  const isNew = !u;
  modal({ title: isNew ? 'Créer un compte' : 'Modifier le compte',
    body: `<div class="fields">${fInput('name', 'Nom complet', u?.name || '', { req: true })}${fInput('email', 'E-mail', u?.email || '', { type: 'email', req: true, attrs: isNew ? '' : 'disabled' })}
      ${fSelect('role', 'Rôle', Object.entries(ROLES), u?.role || 'member')}${fInput('password', isNew ? 'Mot de passe provisoire' : 'Réinitialiser le mot de passe (facultatif)', isNew ? 'Bienvenue' + Math.floor(100 + Math.random() * 900) : '')}</div>
      <p class="muted">Rôles : <strong>Administrateur</strong> (tout), <strong>Chef de projet</strong> (projets et tâches), <strong>Membre</strong> (ses projets et tâches).</p>`,
    danger: !isNew && u.id !== ME.id ? { label: 'Supprimer le compte', onClick: async () => { if (!await ask('Supprimer ce compte ?')) return false; auth.remove(u.id); mutate((w) => w.tasks.forEach((t) => { if (t.assignee === u.id) t.assignee = ''; })); view.team(); } } : null,
    async onSubmit(fd) {
      if (isNew) {
        await auth.create({ name: fd.name, email: fd.email, password: fd.password, role: fd.role, wsId: ME.wsId, extra: { mustChange: true } });
        mutate((w) => log(w, `a créé le compte de ${fd.name}`));
        modal({ title: 'Compte créé ✅', body: `<p>Transmettez ces identifiants à ${esc(fd.name)} :</p><div class="callout">Adresse : <strong>${esc(location.origin + location.pathname)}</strong><br>E-mail : <strong>${esc(fd.email)}</strong><br>Mot de passe provisoire : <strong>${esc(fd.password)}</strong></div><p class="muted">À la première connexion, un nouveau mot de passe sera demandé.</p>`, submit: 'OK', cancel: null });
      } else {
        if (u.id === ME.id && fd.role !== 'admin' && members().filter((m) => m.role === 'admin').length === 1) throw new Error('Il doit rester au moins un administrateur.');
        auth.update(u.id, { name: fd.name, role: fd.role });
        if (fd.password) { await auth.setPassword(u.id, fd.password); auth.update(u.id, { mustChange: true }); }
        if (u.id === ME.id) ME = auth.current();
      }
      view.team();
    } });
}

/* ---------- Académie ---------- */
function academyLesson(modId, idx) {
  const m = ACADEMY.find((x) => x.id === modId); if (!m) return view.academy();
  const res = ME.academy || { read: {}, quiz: {} };
  const isQuiz = idx >= m.lessons.length;
  main.innerHTML = `<div class="page-head"><div><a href="#/academy" class="muted">← Académie</a><h1 style="margin-top:6px">${m.ico} ${esc(m.title)}</h1></div></div>
    <div class="grid" style="grid-template-columns:240px minmax(0,1fr);align-items:start" id="lay"><div class="card" style="padding:10px"><div class="nav">${m.lessons.map((l, i) => `<a href="#/academy/${m.id}/${i}" class="${i === idx ? 'active' : ''}"><span class="ico">${res.read?.[m.id + ':' + i] ? '✓' : i + 1}</span>${esc(l.t)}</a>`).join('')}
    <a href="#/academy/${m.id}/${m.lessons.length}" class="${isQuiz ? 'active' : ''}"><span class="ico">${res.quiz?.[m.id] ? '🏅' : '❓'}</span>Quiz final</a></div></div><div class="card lesson" id="content"></div></div>`;
  if (matchMedia('(max-width:900px)').matches) $('#lay').style.gridTemplateColumns = '1fr';
  const c = $('#content');
  if (!isQuiz) {
    const l = m.lessons[idx];
    c.innerHTML = `<small class="muted">Leçon ${idx + 1} / ${m.lessons.length}</small><h2 style="margin-top:4px">${esc(l.t)}</h2>${l.html}<hr><div class="row between">${idx > 0 ? `<a class="btn" href="#/academy/${m.id}/${idx - 1}">← Précédent</a>` : '<span></span>'}<a class="btn primary" href="#/academy/${m.id}/${idx + 1}">${idx + 1 < m.lessons.length ? 'Leçon suivante →' : 'Passer le quiz →'}</a></div>`;
    res.read = res.read || {}; res.read[m.id + ':' + idx] = true; ME = auth.update(ME.id, { academy: res });
    return;
  }
  const answers = {};
  c.innerHTML = `<h2>Quiz — ${esc(m.title)}</h2><p class="muted">Répondez à toutes les questions. 70 % pour valider la formation.</p>
    ${m.quiz.map((q, qi) => `<div style="margin:16px 0"><strong>${qi + 1}. ${esc(q.q)}</strong>${q.c.map((ch, ci) => `<label class="row" style="font-weight:500;padding:6px 10px;margin-top:4px;border:1px solid var(--line);border-radius:8px;flex-wrap:nowrap" data-q="${qi}" data-c="${ci}"><input type="radio" name="q${qi}" value="${ci}"> ${esc(ch)}</label>`).join('')}<div class="exp" id="e${qi}"></div></div>`).join('')}
    <button class="btn primary" id="check">Valider mes réponses</button><div id="result" style="margin-top:14px"></div>`;
  $$('input[type=radio]', c).forEach((r) => r.onchange = () => { answers[r.name.slice(1)] = Number(r.value); });
  $('#check').onclick = () => {
    if (Object.keys(answers).length < m.quiz.length) return toast('Répondez à toutes les questions.');
    let good = 0;
    m.quiz.forEach((q, qi) => {
      const ok = answers[qi] === q.a; if (ok) good++;
      $$(`[data-q="${qi}"]`, c).forEach((lab) => { const ci = Number(lab.dataset.c); if (ci === q.a) lab.style.background = 'var(--ok-bg)'; else if (ci === answers[qi]) lab.style.background = 'var(--bad-bg)'; });
      $('#e' + qi).innerHTML = `<small>${ok ? '✅' : '❌'} ${esc(q.e)}</small>`;
    });
    const pct = Math.round((good / m.quiz.length) * 100);
    if (pct >= 70) { res.quiz = res.quiz || {}; res.quiz[m.id] = Math.max(pct, res.quiz[m.id] || 0); ME = auth.update(ME.id, { academy: res }); mutate((w) => log(w, `a validé la formation « ${m.title} » (${pct} %)`)); }
    const next = ACADEMY[ACADEMY.indexOf(m) + 1];
    $('#result').innerHTML = `<div class="alert ${pct >= 70 ? 'ok' : 'warn'}"><strong>${pct} %</strong> — ${pct >= 70 ? 'Formation validée ! 🎉' : 'Pas encore validée : relisez les leçons et réessayez.'}</div>
      <div class="row">${pct < 70 ? `<a class="btn" href="#/academy/${m.id}/0">Revoir les leçons</a><button class="btn" onclick="router.run()">Réessayer</button>` : ''}${next ? `<a class="btn primary" href="#/academy/${next.id}/0">Formation suivante : ${esc(next.title)} →</a>` : '<a class="btn primary" href="#/academy">Retour à l\'Académie</a>'}</div>`;
    $('#check').disabled = true;
  };
}

function certificate() {
  modal({ title: 'Attestation de formation', wide: true, submit: 'Imprimer', cancel: 'Fermer',
    body: `<div style="text-align:center;border:3px double var(--accent);border-radius:12px;padding:30px"><div style="font-size:2.5rem">🏆</div><h2>Attestation de réussite</h2><p>Pilote certifie que</p><h1>${esc(ME.name)}</h1>
      <p>a suivi et validé l'ensemble du parcours <strong>« Gestion de projet — Académie Pilote »</strong><br>(${ACADEMY.length} formations, ${ACADEMY.reduce((s, m) => s + m.lessons.length, 0)} leçons).</p><p class="muted">Le ${new Date().toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p></div>`,
    onSubmit: () => { window.print(); return false; } });
}

const guard = (fn) => (...a) => { if (!auth.current() || !document.getElementById('main')) return; ME = auth.current(); main = $('#main'); fn(...a); };
const router = makeRouter(Object.fromEntries(Object.entries(view).map(([k, fn]) => [k, guard(fn)])), guard(() => view.dash()));
window.addEventListener('hashchange', () => { if (!auth.current()) boot(); });
boot();
