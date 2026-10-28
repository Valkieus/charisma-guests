/* RH Studio — logiciel RH (privé / fonction publique) avec parcours de simulation. */
const store = makeStore('rhstudio:');
const auth = makeAuth(store);
const toggleTheme = themeToggle(store);
const ROLES = { admin: 'Responsable RH', gestionnaire: 'Gestionnaire RH', manager: 'Manager', salarie: 'Salarié / agent' };
let ME = null, main = null;

/* ---------- Organisation courante (réelle ou simulation) ---------- */
const modeKey = () => 'mode:' + ME.id;
const simKey = (sc) => `sim:${ME.id}:${sc}`;
function mode() { return store.get(modeKey(), 'real'); }
function inSim() { return mode() !== 'real'; }
function orgKey() { return inSim() ? simKey(mode()) : 'org:' + ME.wsId; }
function org() { const o = store.get(orgKey(), null); if (o) o.settings = { ...DEFAULT_SETTINGS, ...(o.settings || {}) }; return o; }
function saveOrg(o) { store.set(orgKey(), o); }
function mutate(fn) { const o = org(); fn(o); saveOrg(o); return o; }
function journal(o, txt) { o.journal = o.journal || []; o.journal.unshift({ d: new Date().toISOString(), u: ME.name, txt }); o.journal = o.journal.slice(0, 300); }
const S = (o = org()) => SECTORS[o.sector];
const isPublic = (o = org()) => o.sector === 'public';
const empName = (o, id) => { const e = o.employees.find((x) => x.id === id); return e ? `${e.prenom} ${e.nom}` : '—'; };
const isActive = (e) => !e.sortie || e.sortie >= todayISO();
const age = (iso) => iso ? Math.floor(daysBetween(iso, todayISO()) / 365.25) : null;
const seniority = (e) => e.entree ? Math.max(0, daysBetween(e.entree, e.sortie && e.sortie < todayISO() ? e.sortie : todayISO()) / 365.25) : 0;
const canManage = () => inSim() || ['admin', 'gestionnaire'].includes(ME.role);

function blankOrg(name, sector, versant) {
  return { id: uid(), name, sector, versant: versant || 'FPT', ccn: '', ville: '', adresse: '', signataire: '', effectifDeclare: 0, settings: { ...DEFAULT_SETTINGS },
    services: sector === 'public' ? ['Direction générale', 'Ressources humaines', 'Finances', 'Services techniques', 'Enfance'] : ['Direction', 'Administration', 'Production', 'Commercial'],
    employees: [], absences: [], jobs: [], candidates: [], onboardings: [], campaigns: [], reviews: [], trainings: [], projects: [], compliance: {}, journal: [] };
}
function newEmp(o, d) {
  return { id: uid(), matricule: 'M' + String(o.employees.length + 1).padStart(4, '0'), civ: 'Mme', prenom: '', nom: '', email: '', naissance: '', service: o.services[0] || '', poste: '', managerId: '',
    statut: S(o).statuts[0], categorie: S(o).categories[0], grade: '', echelon: '', im: '', nbi: 0, ifse: 0, brut: 0, heures: 35, quotite: 100, entree: todayISO(), finContrat: '', finEssai: '',
    motifCDD: '', sortie: '', motifSortie: '', rtt: 0, enfants: 0, notes: '', ...d };
}

/* ---------- Calculs RH ---------- */
function absenceDays(o, a) {
  if (S(o).maladie.includes(a.type) || /maternit|paternit/i.test(a.type)) return daysBetween(a.debut, a.fin) + 1;
  return countDays(a.debut, a.fin, !isPublic(o) && a.type === 'Congés payés');
}
function leaveBalance(o, e) {
  const t = todayISO(), y = Number(t.slice(0, 4));
  if (isPublic(o)) {
    const start = `${y}-01-01`, from = e.entree > start ? e.entree : start;
    const months = Math.max(0, Math.min(12, (y - Number(from.slice(0, 4))) * 12 + 12 - Number(from.slice(5, 7)) + 1));
    const droit = Math.round(25 * (e.quotite / 100) * (months / 12) * 2) / 2;
    const pris = o.absences.filter((a) => a.empId === e.id && a.type === 'Congés annuels' && a.statut === 'validee' && a.debut >= start).reduce((s, a) => s + absenceDays(o, a), 0);
    const rttPris = o.absences.filter((a) => a.empId === e.id && a.type === 'ARTT' && a.statut === 'validee' && a.debut >= start).reduce((s, a) => s + absenceDays(o, a), 0);
    return { label: 'Congés annuels ' + y, unit: 'jours ouvrés', droit, pris, reste: droit - pris, rtt: Number(e.rtt) || 0, rttPris };
  }
  const refStart = t.slice(5) >= '06-01' ? `${y}-06-01` : `${y - 1}-06-01`;
  const from = e.entree > refStart ? e.entree : refStart;
  const months = Math.max(0, Math.floor(daysBetween(from, t) / 30.4));
  const acquis = Math.min(30, months * 2.5);
  const prevStart = `${Number(refStart.slice(0, 4)) - 1}-06-01`;
  const droitN1 = e.entree <= prevStart ? 30 : Math.min(30, Math.floor(Math.max(0, daysBetween(e.entree, refStart)) / 30.4) * 2.5);
  const pris = o.absences.filter((a) => a.empId === e.id && a.type === 'Congés payés' && a.statut === 'validee' && a.debut >= refStart).reduce((s, a) => s + absenceDays(o, a), 0);
  const rttPris = o.absences.filter((a) => a.empId === e.id && a.type === 'RTT' && a.statut === 'validee' && a.debut >= `${y}-01-01`).reduce((s, a) => s + absenceDays(o, a), 0);
  return { label: 'Congés payés', unit: 'jours ouvrables', droit: droitN1, pris, reste: droitN1 - pris, acquis, rtt: Number(e.rtt) || 0, rttPris };
}

function payslip(o, e) {
  const st = o.settings;
  if (isPublic(o) && /Fonctionnaire|Contractuel|Contrat de projet/.test(e.statut) && Number(e.im)) {
    const q = (Number(e.quotite) || 100) / 100, pt = Number(st.point);
    const tib = Number(e.im) * pt * q, nbi = (Number(e.nbi) || 0) * pt * q, ir = tib * (Number(st.ir) || 0) / 100;
    const n = Number(e.enfants) || 0, base = clamp(Number(e.im), 449, 717) * pt;
    const sft = n === 0 ? 0 : n === 1 ? 2.29 : n === 2 ? 10.67 + base * 0.03 : 15.24 + base * 0.08 + (n - 3) * (4.57 + base * 0.06);
    const ifse = Number(e.ifse) || 0; const gross = tib + nbi + ir + sft + ifse;
    const lines = [['Traitement indiciaire brut', `IM ${e.im} × ${pt} €${q < 1 ? ' × ' + q * 100 + ' %' : ''}`, tib], ['NBI', `${e.nbi || 0} points`, nbi], ['Indemnité de résidence', `${st.ir} %`, ir], ['Supplément familial de traitement', `${n} enfant(s)`, sft], ['IFSE (RIFSEEP)', 'mensuelle', ifse]];
    let ret;
    if (/Fonctionnaire/.test(e.statut)) {
      ret = [['Retraite CNRACL / SRE (11,10 %)', (tib + nbi) * 0.111], ['RAFP (5 % des primes, plafonné)', Math.min(ir + sft + ifse, tib * 0.2) * 0.05], ['CSG (9,2 % × 98,25 %)', gross * 0.9825 * 0.092], ['CRDS (0,5 % × 98,25 %)', gross * 0.9825 * 0.005]];
    } else {
      ret = [['Vieillesse régime général (≈ 7,3 %)', gross * 0.073], ['IRCANTEC tranche A (2,80 %)', gross * 0.028], ['CSG (9,2 % × 98,25 %)', gross * 0.9825 * 0.092], ['CRDS (0,5 % × 98,25 %)', gross * 0.9825 * 0.005]];
    }
    const totalRet = ret.reduce((s, r) => s + r[1], 0);
    const cost = /Fonctionnaire/.test(e.statut) ? (tib + nbi) * 1.55 + (ir + sft + ifse) * 1.2 : gross * 1.38;
    return { gross, net: gross - totalRet, lines, ret, cost, note: 'Estimation pédagogique : hors transfert primes/points, mutuelle, prélèvement à la source et cotisations spécifiques. Coût employeur : ordre de grandeur (le taux employeur CNRACL augmente chaque année de 2025 à 2028).' };
  }
  const brut = Number(e.brut) || 0; const smicM = Number(st.smicH) * 151.67;
  const rate = /Apprentissage/.test(e.statut) ? 0.02 : e.categorie === 'Cadre' ? 0.25 : 0.22;
  const ratio = smicM ? brut / smicM : 2; const emp = ratio <= 1 ? 0.08 : ratio < 1.6 ? 0.08 + (ratio - 1) / 0.6 * 0.34 : e.categorie === 'Cadre' ? 0.45 : 0.42;
  return { gross: brut, net: brut * (1 - rate), lines: [['Salaire de base', `${e.heures || 35} h / semaine`, brut]], ret: [[`Cotisations salariales (≈ ${Math.round(rate * 100)} %)`, brut * rate]], cost: brut * (1 + emp),
    note: `Estimation pédagogique : taux moyens. Près du SMIC (${fmtEur(smicM)} brut / mois pour 35 h), les allègements de cotisations patronales réduisent fortement le coût employeur. Hors prélèvement à la source.` };
}

/* ---------- Pages publiques ---------- */
function authPage(signup) {
  document.body.innerHTML = `<div class="auth"><div class="box" style="width:min(480px,100%)"><div class="brand" style="justify-content:center"><span class="logo">RH</span>RH Studio</div>
    <form class="card" id="f"><h2>${signup ? 'Créer votre espace RH' : 'Connexion'}</h2>
    ${signup ? fInput('name', 'Votre nom', '', { req: true }) + fInput('orgname', 'Nom de l\'organisation', '', { req: true }) + fSelect('sector', 'Secteur', [['public', 'Fonction publique'], ['prive', 'Secteur privé']], 'public') + fSelect('versant', 'Versant (si public)', Object.entries(VERSANTS), 'FPT') : ''}
    ${fInput('email', 'E-mail', '', { type: 'email', req: true })}${fInput('password', 'Mot de passe', '', { type: 'password', req: true })}
    <button class="btn primary" style="width:100%;justify-content:center">${signup ? 'Créer mon espace' : 'Se connecter'}</button>
    <p class="muted" style="text-align:center;margin-top:12px">${signup ? 'Déjà un compte ? <a href="#/login">Se connecter</a>' : 'Pas encore de compte ? <a href="#/signup">Créer un espace</a>'}</p></form>
    <div class="card"><h3>🎮 Ce que vous trouverez</h3><p class="muted">Dossiers ${'salariés / agents'}, congés, recrutement, intégration, entretiens, formation, paie simplifiée, documents, obligations, tableaux de bord — et un <strong>parcours de simulation sur 3 ans</strong> (PME privée ou commune) pour s'entraîner sans risque.</p></div></div></div>`;
  $('#f').onsubmit = async (ev) => {
    ev.preventDefault(); const fd = Object.fromEntries(new FormData(ev.target).entries());
    try {
      if (signup) {
        const wsId = uid(); await auth.create({ name: fd.name, email: fd.email, password: fd.password, role: 'admin', wsId });
        const o = blankOrg(fd.orgname, fd.sector, fd.versant); store.set('org:' + wsId, o);
      }
      await auth.login(fd.email, fd.password); location.hash = signup ? '#/simulation' : '#/dash'; boot();
    } catch (err) { toast(err.message); }
  };
}

function forcePassword() {
  document.body.innerHTML = `<div class="auth"><form class="card box" id="f"><h2>Choisissez votre mot de passe</h2><p class="muted">Bienvenue ${esc(ME.name)}.</p>${fInput('p1', 'Nouveau mot de passe', '', { type: 'password' })}<button class="btn primary">Valider</button></form></div>`;
  $('#f').onsubmit = async (e) => { e.preventDefault(); try { await auth.setPassword(ME.id, e.target.p1.value); boot(); } catch (err) { toast(err.message); } };
}

/* ---------- Coquille ---------- */
function boot() {
  ME = auth.current();
  if (!ME) return authPage(location.hash.includes('signup'));
  if (ME.mustChange) return forcePassword();
  if (ME.role === 'salarie' && inSim()) store.set(modeKey(), 'real');
  const o = org();
  const pending = o.absences.filter((a) => a.statut === 'demandee').length;
  const sim = inSim() ? SCENARIOS[mode()] : null;
  const V = S(o);
  const nav = ME.role === 'salarie' && !sim
    ? navLink('me', '🙂', 'Mon espace') + navLink('absences', '🌴', 'Mes congés')
    : navLink('dash', '🏠', 'Tableau de bord') + '<div class="sec">Gestion</div>' + navLink('employees', '👤', V.Emps) + navLink('orgchart', '🌳', 'Organigramme') +
      navLink('absences', '🌴', 'Absences & congés', pending ? ` <span class="badge warn" style="margin-left:auto">${pending}</span>` : '') + navLink('recruitment', '📣', 'Recrutement') + navLink('onboarding', '🧳', 'Intégration') +
      '<div class="sec">Développement</div>' + navLink('reviews', '💬', 'Entretiens') + navLink('training', '📚', 'Formation') + navLink('projects', '🧩', 'Projets RH') +
      '<div class="sec">Pilotage</div>' + navLink('payroll', '💶', 'Paie & masse salariale') + navLink('documents', '📄', 'Documents') + navLink('compliance', '✅', 'Obligations') + navLink('reports', '📊', 'Rapports') +
      '<div class="sec">S\'entraîner</div>' + navLink('simulation', '🎮', 'Parcours de simulation') + '<div class="sec">Administration</div>' + navLink('settings', '⚙️', 'Paramètres') + (ME.role === 'admin' && !sim ? navLink('accounts', '🔑', 'Comptes') : '');
  main = shell({ brand: 'RH Studio', logo: 'RH', current: 'rh', nav,
    foot: `${sim ? `<div class="alert warn" style="margin:0 0 10px;padding:8px 10px"><strong>Mode simulation</strong><br>${esc(sim.title)}<br><button class="btn sm" id="exitSim" style="margin-top:6px">Revenir à mon organisation</button></div>` : ''}
      <div class="row"><span class="avatar">${initials(ME.name)}</span><div style="min-width:0"><div style="font-weight:600;color:var(--text)">${esc(ME.name)}</div><div>${ROLES[ME.role]}</div><div>${esc(o.name)} · ${V.label}</div></div></div>
      <div class="row" style="margin-top:8px"><button class="btn sm" id="th">🌓</button><button class="btn sm" id="lo">Déconnexion</button></div>` });
  $('#lo').onclick = () => { auth.logout(); location.hash = '#/login'; boot(); };
  $('#th').onclick = toggleTheme;
  $('#exitSim')?.addEventListener('click', () => { store.set(modeKey(), 'real'); location.hash = '#/dash'; boot(); });
  router.run();
}

function missionBar() {
  if (!inSim()) return '';
  const sc = SCENARIOS[mode()]; const o = org(); const active = o.sim?.active; const m = sc.missions.find((x) => x.id === active);
  if (!m || o.sim?.done?.[m.id]) return '';
  return `<div class="alert warn no-print" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span style="flex:1;min-width:200px">🎯 <strong>Mission en cours :</strong> ${esc(m.title)}</span><a class="btn sm" href="#/simulation/${m.id}">Voir les consignes</a>${m.kind === 'action' ? `<button class="btn sm primary" data-checkm="${m.id}">Vérifier ma mission</button>` : ''}</div>`;
}
function page(title, sub, actions = '') {
  return `${missionBar()}<div class="page-head"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div><div class="row">${actions}</div></div>`;
}
function after() { $$('[data-checkm]', main).forEach((b) => b.onclick = () => checkMission(b.dataset.checkm)); }

/* ---------- Vues ---------- */
const view = {
  dash() {
    const o = org(), V = S(o); const act = o.employees.filter(isActive);
    const etp = act.reduce((s, e) => s + (Number(e.quotite) || 100) / 100, 0);
    const pending = o.absences.filter((a) => a.statut === 'demandee');
    const t = todayISO(), in60 = addDays(t, 60);
    const alerts = [];
    act.forEach((e) => {
      if (e.finContrat && e.finContrat >= t && e.finContrat <= in60) alerts.push(['warn', `Fin de contrat de ${e.prenom} ${e.nom} le ${fmtDate(e.finContrat)}`, `#/employee/${e.id}`]);
      if (e.finEssai && e.finEssai >= t && e.finEssai <= addDays(t, 21)) alerts.push(['info', `Fin de période d'essai de ${e.prenom} ${e.nom} le ${fmtDate(e.finEssai)}`, `#/employee/${e.id}`]);
      if (e.statut === 'Fonctionnaire stagiaire' && e.entree && daysBetween(e.entree, t) > 300) alerts.push(['warn', `Titularisation de ${e.prenom} ${e.nom} à préparer (stage d'un an)`, `#/employee/${e.id}`]);
      if (age(e.naissance) >= 62) alerts.push(['info', `${e.prenom} ${e.nom} a ${age(e.naissance)} ans : anticiper un départ en retraite`, `#/employee/${e.id}`]);
    });
    o.absences.filter((a) => a.statut === 'validee' && S(o).maladie.includes(a.type) && a.fin >= t).forEach((a) => {
      const d = daysBetween(a.debut, a.fin) + 1;
      if (!isPublic(o) && d >= 60) alerts.push(['warn', `Arrêt de ${empName(o, a.empId)} ≥ 60 jours : visite de reprise obligatoire au retour`, '#/absences']);
      if (isPublic(o) && /CMO/.test(a.type) && d > 90) alerts.push(['warn', `CMO de ${empName(o, a.empId)} > 3 mois : passage à demi-traitement`, '#/absences']);
    });
    const ob = o.onboardings.filter((x) => x.items.some((i) => !i.done));
    main.innerHTML = page(`${o.name}`, `${V.label}${isPublic(o) ? ' · ' + o.versant : ''} · ${new Date().toLocaleDateString('fr-FR', { dateStyle: 'full' })}`, canManage() ? `<a class="btn primary" href="#/employee/new">+ ${V.Emp}</a>` : '') + `
      ${!o.employees.length ? `<div class="alert">Votre organisation est vide. Ajoutez vos ${V.emps}, ou entraînez-vous d'abord avec le <a href="#/simulation">parcours de simulation</a> (données fictives déjà prêtes).</div>` : ''}
      <div class="grid g4 kpis"><div class="card kpi"><span class="v">${act.length}</span><span class="l">${V.Emps} présents${o.effectifDeclare ? ` (effectif déclaré : ${o.effectifDeclare})` : ''}</span></div>
      <div class="card kpi"><span class="v">${etp.toFixed(1)}</span><span class="l">ETP</span></div>
      <div class="card kpi"><span class="v" style="color:${pending.length ? 'var(--warn)' : ''}">${pending.length}</span><span class="l">Demandes d'absence à traiter</span></div>
      <div class="card kpi"><span class="v">${o.jobs.filter((j) => j.statut === 'Ouvert').length}</span><span class="l">Recrutements en cours</span></div></div>
      <div class="grid g2" style="margin-top:14px"><div class="card"><h3>⚠️ Alertes & échéances</h3>${alerts.length ? alerts.slice(0, 10).map(([k, txt, l]) => `<a href="${l}" class="alert ${k}" style="display:block;text-decoration:none;color:inherit;margin-bottom:6px">${esc(txt)}</a>`).join('') : '<p class="muted">Aucune échéance proche.</p>'}</div>
      <div class="card"><h3>Absents aujourd'hui</h3>${(() => { const abs = o.absences.filter((a) => a.statut === 'validee' && a.debut <= t && a.fin >= t); return abs.length ? abs.map((a) => `<div class="row" style="margin-bottom:6px"><span class="avatar">${initials(empName(o, a.empId))}</span><span style="flex:1">${esc(empName(o, a.empId))}</span><span class="badge">${esc(a.type)}</span><small>→ ${fmtDate(a.fin)}</small></div>`).join('') : '<p class="muted">Tout le monde est là.</p>'; })()}
      <h3 style="margin-top:16px">Intégrations en cours</h3>${ob.length ? ob.map((x) => { const d = x.items.filter((i) => i.done).length; return `<div style="margin-bottom:8px"><div class="row between"><span>${esc(empName(o, x.empId))}</span><small>${d}/${x.items.length}</small></div>${bar((d / x.items.length) * 100)}</div>`; }).join('') : '<p class="muted">Aucune.</p>'}</div></div>
      <div class="card"><h3>Journal</h3>${(o.journal || []).slice(0, 8).map((j) => `<div style="padding:4px 0;border-top:1px solid var(--line)"><small>${new Date(j.d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })} · ${esc(j.u)}</small> — ${esc(j.txt)}</div>`).join('') || '<p class="muted">Rien pour l\'instant.</p>'}</div>`;
    after();
  },

  employees() {
    const o = org(), V = S(o);
    const q = store.get('empFilter', { q: '', statut: '', service: '', actifs: true });
    main.innerHTML = page(V.Emps, `${o.employees.filter(isActive).length} présent(s) · ${o.employees.length} dossier(s)`, canManage() ? `<button class="btn" id="csv">Registre (CSV)</button><a class="btn primary" href="#/employee/new">+ ${V.Emp}</a>` : '') + `
      <div class="card" style="margin-bottom:14px"><div class="row"><input id="fq" placeholder="Rechercher un nom, un poste…" value="${esc(q.q)}" style="flex:2;min-width:180px">
      <select id="fs" style="flex:1;min-width:140px"><option value="">Tous statuts</option>${V.statuts.map((s) => `<option ${q.statut === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <select id="fv" style="flex:1;min-width:140px"><option value="">Tous services</option>${o.services.map((s) => `<option ${q.service === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select>
      <label class="row" style="margin:0;font-weight:500"><input type="checkbox" id="fa" ${q.actifs ? 'checked' : ''}> Présents uniquement</label></div></div><div id="list"></div>`;
    const draw = () => {
      const f = { q: $('#fq').value, statut: $('#fs').value, service: $('#fv').value, actifs: $('#fa').checked }; store.set('empFilter', f);
      const list = o.employees.filter((e) => (!f.actifs || isActive(e)) && (!f.statut || e.statut === f.statut) && (!f.service || e.service === f.service) && (!f.q || norm(`${e.prenom} ${e.nom} ${e.poste} ${e.grade}`).includes(norm(f.q))))
        .sort((a, b) => a.nom.localeCompare(b.nom));
      $('#list').innerHTML = list.length ? `<div class="table-wrap"><table><tr><th>Nom</th><th>Poste</th><th>Service</th><th>Statut</th><th>${isPublic(o) ? 'Cat. / grade' : 'Catégorie'}</th><th>Entrée</th></tr>
        ${list.map((e) => `<tr class="click" data-e="${e.id}"><td><div class="row" style="flex-wrap:nowrap"><span class="avatar">${initials(e.prenom + ' ' + e.nom)}</span><div><strong>${esc(e.nom.toUpperCase())}</strong> ${esc(e.prenom)}<br><small>${esc(e.matricule)}</small></div></div></td>
        <td>${esc(e.poste)}</td><td>${esc(e.service)}</td><td><span class="badge ${/CDD|stagiaire|Apprent|Stage|Intérim|projet|Vacat/.test(e.statut) ? 'warn' : 'ok'}">${esc(e.statut)}</span>${!isActive(e) ? ' <span class="badge bad">Sorti</span>' : ''}</td>
        <td>${esc(e.categorie)}${e.grade ? `<br><small>${esc(e.grade)}${e.echelon ? ', éch. ' + e.echelon : ''}</small>` : ''}</td><td>${fmtDate(e.entree)}</td></tr>`).join('')}</table></div>` : '<div class="card empty">Aucun résultat.</div>';
      $$('[data-e]').forEach((r) => r.onclick = () => location.hash = '#/employee/' + r.dataset.e);
    };
    ['#fq', '#fs', '#fv', '#fa'].forEach((s) => $(s).addEventListener('input', draw));
    draw();
    $('#csv')?.addEventListener('click', () => download('registre-unique-du-personnel.csv', '﻿' + toCSV([['Matricule', 'Nom', 'Prénom', 'Civilité', 'Date de naissance', 'Emploi / poste', 'Statut / contrat', 'Catégorie', 'Grade', 'Date d\'entrée', 'Date de sortie', 'Motif de sortie'],
      ...o.employees.map((e) => [e.matricule, e.nom, e.prenom, e.civ, e.naissance, e.poste, e.statut, e.categorie, e.grade, e.entree, e.sortie, e.motifSortie])]), 'text/csv'));
    after();
  },

  employee(id, tab = 'infos') {
    const o = org(), V = S(o); const isNew = id === 'new';
    const e = isNew ? newEmp(o, {}) : o.employees.find((x) => x.id === id);
    if (!e) { main.innerHTML = '<div class="empty">Dossier introuvable.</div>'; return; }
    if (isNew) return employeeForm(o, e, true);
    const tabs = [['infos', 'Dossier'], ['absences', 'Absences'], ['reviews', 'Entretiens'], ['training', 'Formations'], ['pay', 'Rémunération'], ['docs', 'Documents']];
    main.innerHTML = page(`${esc(e.prenom)} ${esc(e.nom.toUpperCase())}`, `${esc(e.poste)} · ${esc(e.service)} · ${esc(e.statut)}${!isActive(e) ? ' · <span class="badge bad">sorti le ' + fmtDate(e.sortie) + '</span>' : ''}`,
      `<a class="btn" href="#/employees">← Liste</a>${canManage() ? '<button class="btn primary" id="ed">Modifier</button>' : ''}`) +
      `<div class="tabs">${tabs.map(([k, l]) => `<a href="#/employee/${e.id}/${k}" class="${k === tab ? 'active' : ''}">${l}</a>`).join('')}</div><div id="tab"></div>`;
    $('#ed')?.addEventListener('click', () => employeeForm(o, e, false));
    const el = $('#tab');
    if (tab === 'infos') {
      const row = (l, v) => v || v === 0 ? `<tr><td class="muted" style="width:42%">${l}</td><td>${v}</td></tr>` : '';
      el.innerHTML = `<div class="grid g2"><div class="card"><h3>Identité</h3><table>${row('Matricule', esc(e.matricule))}${row('Civilité', esc(e.civ))}${row('Date de naissance', e.naissance ? fmtDate(e.naissance) + ` (${age(e.naissance)} ans)` : '')}${row('E-mail', esc(e.email))}${row('Enfants à charge', e.enfants)}</table></div>
        <div class="card"><h3>${isPublic(o) ? 'Situation statutaire' : 'Contrat'}</h3><table>${row('Statut', esc(e.statut))}${row('Catégorie', esc(e.categorie))}${row('Grade', esc(e.grade))}${row('Échelon', esc(e.echelon))}${row('Indice majoré', esc(e.im))}
          ${row('Date d\'entrée', fmtDate(e.entree) + ` · ancienneté ${seniority(e).toFixed(1)} ans`)}${row('Fin de période d\'essai', e.finEssai ? fmtDate(e.finEssai) : '')}${row('Fin de contrat', e.finContrat ? fmtDate(e.finContrat) : '')}${row('Motif du contrat', esc(e.motifCDD))}
          ${row('Temps de travail', `${e.quotite} %${isPublic(o) ? '' : ' · ' + e.heures + ' h / sem.'}`)}${row('Responsable', esc(empName(o, e.managerId)))}${row('Sortie', e.sortie ? fmtDate(e.sortie) + ' — ' + esc(e.motifSortie) : '')}</table></div></div>
        ${e.notes ? `<div class="card"><h3>Notes</h3><p>${esc(e.notes)}</p></div>` : ''}`;
    } else if (tab === 'absences') {
      const b = leaveBalance(o, e); const list = o.absences.filter((a) => a.empId === e.id).sort((a, c) => a.debut < c.debut ? 1 : -1);
      el.innerHTML = `<div class="grid g3"><div class="card kpi"><span class="v">${b.reste}</span><span class="l">${b.label} : restant (${b.unit}) — droit ${b.droit}, pris ${b.pris}</span></div>
        ${b.acquis !== undefined ? `<div class="card kpi"><span class="v">${b.acquis}</span><span class="l">En cours d'acquisition (2,5 j / mois)</span></div>` : ''}<div class="card kpi"><span class="v">${b.rtt - b.rttPris}</span><span class="l">${V.rtt} restants (${b.rtt} / an)</span></div></div>
        <div class="card"><div class="row between"><h3>Historique</h3><button class="btn sm primary" id="na">+ Absence</button></div>${absTable(o, list, false)}</div>`;
      $('#na').onclick = () => absenceForm(o, null, e.id);
    } else if (tab === 'reviews') {
      const list = o.reviews.filter((r) => r.empId === e.id);
      el.innerHTML = `<div class="card">${list.length ? list.map((r) => `<div class="row between" style="padding:8px 0;border-top:1px solid var(--line)"><span>${esc(r.type)} ${esc(r.annee)}</span><span class="badge">${esc(r.statut)}</span><button class="btn sm" data-r="${r.id}">Ouvrir</button></div>`).join('') : '<p class="muted">Aucun entretien.</p>'}</div>`;
      $$('[data-r]', el).forEach((b) => b.onclick = () => reviewForm(o, o.reviews.find((r) => r.id === b.dataset.r)));
    } else if (tab === 'training') {
      const list = o.trainings.filter((t) => (t.participants || []).includes(e.id));
      el.innerHTML = `<div class="card">${list.length ? list.map((t) => `<div class="row between" style="padding:8px 0;border-top:1px solid var(--line)"><span>${esc(t.intitule)}</span><small>${esc(t.type)} · ${fmtDate(t.date)}</small><span class="badge">${esc(t.statut)}</span></div>`).join('') : '<p class="muted">Aucune formation.</p>'}</div>`;
    } else if (tab === 'pay') {
      el.innerHTML = payslipHTML(o, e);
    } else if (tab === 'docs') {
      el.innerHTML = `<div class="card"><h3>Générer un document</h3><div class="grid g2">${DOCS[o.sector].map((d) => `<button class="btn" data-doc="${d.id}" style="justify-content:flex-start;white-space:normal">📄 ${esc(d.t)}</button>`).join('')}</div></div>`;
      $$('[data-doc]', el).forEach((b) => b.onclick = () => docModal(o, b.dataset.doc, e.id));
    }
    bindAbs(el); after();
  },

  orgchart() {
    const o = org(); const act = o.employees.filter(isActive);
    const ids = new Set(act.map((e) => e.id));
    const node = (e, depth = 0) => { const kids = act.filter((k) => k.managerId === e.id); if (depth > 12) return '';
      return `<li><a href="#/employee/${e.id}" class="card" style="display:inline-block;padding:8px 12px;text-decoration:none;color:inherit;margin:4px 0"><div class="row" style="flex-wrap:nowrap"><span class="avatar">${initials(e.prenom + ' ' + e.nom)}</span><div><strong>${esc(e.prenom)} ${esc(e.nom)}</strong><br><small>${esc(e.poste)}${isPublic(o) && e.categorie ? ' · cat. ' + e.categorie : ''}</small></div></div></a>${kids.length ? `<ul>${kids.map((k) => node(k, depth + 1)).join('')}</ul>` : ''}</li>`; };
    const roots = act.filter((e) => !e.managerId || !ids.has(e.managerId));
    main.innerHTML = page('Organigramme', 'Construit à partir du champ « Responsable » de chaque dossier.') + `<div class="card" style="overflow-x:auto"><style>.tree ul{list-style:none;padding-left:28px;border-left:2px solid var(--line);margin-left:14px}.tree{list-style:none;padding:0}</style>
      <ul class="tree">${roots.map((r) => node(r)).join('') || '<p class="muted">Aucun dossier.</p>'}</ul></div>
      <div class="card"><h3>Par service</h3><div class="grid g3">${o.services.map((s) => { const n = act.filter((e) => e.service === s); return `<div style="background:var(--panel-2);border-radius:10px;padding:12px"><strong>${esc(s)}</strong> <span class="badge">${n.length}</span><div style="margin-top:6px;font-size:.88rem">${n.map((e) => esc(e.prenom + ' ' + e.nom)).join(', ') || '<span class="muted">—</span>'}</div></div>`; }).join('')}</div></div>`;
    after();
  },

  absences(sub = 'list') {
    const o = org(), V = S(o);
    const self = ME.role === 'salarie' && !inSim();
    const mine = self ? o.absences.filter((a) => a.empId === ME.empId) : o.absences;
    const pending = mine.filter((a) => a.statut === 'demandee');
    main.innerHTML = page(self ? 'Mes congés' : 'Absences & congés', self ? '' : `Décompte : ${isPublic(o) ? 'jours ouvrés' : 'congés payés en jours ouvrables, autres absences en jours ouvrés'} · jours fériés exclus`, '<button class="btn primary" id="na">+ Demande / absence</button>') + `
      ${self ? '' : `<div class="tabs"><a href="#/absences/list" class="${sub === 'list' ? 'active' : ''}">Demandes & historique</a><a href="#/absences/planning" class="${sub === 'planning' ? 'active' : ''}">Planning du mois</a><a href="#/absences/soldes" class="${sub === 'soldes' ? 'active' : ''}">Soldes</a><a href="#/absences/regles" class="${sub === 'regles' ? 'active' : ''}">Règles à connaître</a></div>`}<div id="abs"></div>`;
    const el = $('#abs');
    if (sub === 'list' || self) {
      el.innerHTML = `${pending.length ? `<div class="card"><h3>À traiter (${pending.length})</h3>${absTable(o, pending, !self)}</div>` : ''}<div class="card"><h3>Toutes les absences</h3>${absTable(o, mine.filter((a) => a.statut !== 'demandee').sort((a, b) => a.debut < b.debut ? 1 : -1).slice(0, 80), false)}</div>`;
    } else if (sub === 'planning') {
      const m = store.get('planMonth', todayISO().slice(0, 7)); const [y, mo] = m.split('-').map(Number); const nDays = new Date(y, mo, 0).getDate();
      const days = Array.from({ length: nDays }, (_, i) => `${m}-${String(i + 1).padStart(2, '0')}`);
      const rows = o.employees.filter(isActive).filter((e) => o.absences.some((a) => a.empId === e.id && a.statut !== 'refusee' && a.debut <= days[nDays - 1] && a.fin >= days[0]));
      const col = (a) => a.statut === 'demandee' ? 'var(--warn)' : S(o).maladie.includes(a.type) ? 'var(--bad)' : 'var(--accent)';
      el.innerHTML = `<div class="card" style="overflow-x:auto"><div class="row between" style="margin-bottom:10px"><button class="btn sm" id="pm">←</button><strong>${new Date(y, mo - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</strong><button class="btn sm" id="nm">→</button></div>
        <table style="font-size:.75rem;min-width:900px"><tr><th style="min-width:140px">${V.Emp}</th>${days.map((d) => { const wd = new Date(d + 'T12:00:00').getDay(); return `<th style="padding:4px 2px;text-align:center;${wd === 0 || wd === 6 || holidays(y).has(d) ? 'opacity:.45' : ''}">${Number(d.slice(8))}</th>`; }).join('')}</tr>
        ${rows.map((e) => `<tr><td>${esc(e.prenom + ' ' + e.nom)}</td>${days.map((d) => { const a = o.absences.find((x) => x.empId === e.id && x.statut !== 'refusee' && x.debut <= d && x.fin >= d); return `<td style="padding:0;height:26px;${a ? 'background:' + col(a) : ''}" title="${a ? esc(a.type) : ''}"></td>`; }).join('')}</tr>`).join('') || `<tr><td colspan="${nDays + 1}" class="empty">Aucune absence ce mois-ci.</td></tr>`}</table>
        <p class="muted" style="margin-top:8px"><span style="color:var(--accent)">■</span> validée · <span style="color:var(--warn)">■</span> en attente · <span style="color:var(--bad)">■</span> maladie / accident</p></div>`;
      const shift = (n) => { const d = new Date(y, mo - 1 + n, 1); store.set('planMonth', `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`); view.absences('planning'); };
      $('#pm').onclick = () => shift(-1); $('#nm').onclick = () => shift(1);
    } else if (sub === 'soldes') {
      el.innerHTML = `<div class="table-wrap"><table><tr><th>${V.Emp}</th><th>Droit</th><th>Pris</th><th>Restant</th>${isPublic(o) ? '' : '<th>En cours d\'acquisition</th>'}<th>${V.rtt} restants</th></tr>
        ${o.employees.filter(isActive).map((e) => { const b = leaveBalance(o, e); return `<tr><td>${esc(e.prenom + ' ' + e.nom)}</td><td>${b.droit}</td><td>${b.pris}</td><td><strong>${b.reste}</strong></td>${isPublic(o) ? '' : `<td>${b.acquis}</td>`}<td>${b.rtt - b.rttPris} / ${b.rtt}</td></tr>`; }).join('')}</table></div>
        <p class="muted" style="margin-top:8px">${isPublic(o) ? 'Droit annuel : 25 jours ouvrés pour un temps plein (5 × obligations hebdomadaires), au prorata de la quotité et de la date d\'arrivée. Jours de fractionnement non inclus.' : 'Droit : 30 jours ouvrables (2,5 j par mois) acquis sur la période de référence précédente (1er juin – 31 mai). Le nombre de jours de RTT se règle dans chaque dossier.'}</p>`;
    } else {
      el.innerHTML = `<div class="card lesson">${isPublic(o) ? `
        <h3>Fonction publique — l'essentiel</h3><ul><li><strong>Congés annuels</strong> : 5 fois les obligations hebdomadaires de service (25 jours pour 5 jours / semaine). +1 jour de fractionnement si 5 à 7 jours pris hors 1er mai – 31 octobre, +2 jours si 8 jours ou plus. Absence de service de plus de 31 jours consécutifs interdite sauf exceptions.</li>
        <li><strong>ARTT</strong> : jours de réduction du temps de travail si le cycle dépasse 35 h (référence 1 607 h / an).</li><li><strong>CET</strong> (compte épargne-temps) : épargne de congés et ARTT non pris, au-delà de 20 jours de congés pris dans l'année.</li>
        <li><strong>CMO</strong> : jusqu'à 1 an sur 12 mois glissants ; 3 mois à plein traitement (90 % depuis mars 2025) puis 9 mois à demi-traitement ; 1 jour de carence.</li><li><strong>CLM</strong> : jusqu'à 3 ans (1 an plein traitement, 2 ans demi). <strong>CLD</strong> : jusqu'à 5 ans (3 ans plein, 2 ans demi). Sur avis du <strong>conseil médical</strong>.</li>
        <li><strong>CITIS</strong> : accident de service ou maladie professionnelle, plein traitement jusqu'à la reprise ou la retraite, frais médicaux pris en charge.</li><li><strong>ASA</strong> : autorisations spéciales d'absence (événements familiaux, mandats syndicaux, examens médicaux…), selon les règles de l'employeur.</li></ul>` : `
        <h3>Secteur privé — l'essentiel</h3><ul><li><strong>Congés payés</strong> : 2,5 jours ouvrables par mois de travail effectif, soit 30 jours (5 semaines) par an. Depuis 2024, les arrêts maladie non professionnels ouvrent aussi des droits (2 jours ouvrables par mois, dans la limite de 24 jours par an).</li>
        <li>L'employeur fixe la période de prise des congés et l'ordre des départs après avis du CSE ; le congé principal est d'au moins 12 jours ouvrables continus entre le 1er mai et le 31 octobre.</li><li><strong>Arrêt maladie</strong> : délai de carence de 3 jours pour les indemnités journalières de la Sécurité sociale ; maintien de salaire par l'employeur après 1 an d'ancienneté (selon la loi ou la convention collective).</li>
        <li><strong>Visite de reprise</strong> obligatoire après un congé de maternité, une maladie professionnelle, un accident du travail d'au moins 30 jours, ou une maladie non professionnelle d'au moins 60 jours.</li><li><strong>Événements familiaux</strong> : mariage / PACS 4 jours, naissance 3 jours, décès d'un enfant 5 à 14 jours selon les cas… (minima légaux, souvent améliorés par la convention collective).</li></ul>`}
        <p class="muted">Repères indicatifs : vérifiez toujours sur service-public.fr et dans vos accords locaux.</p></div>`;
    }
    $('#na').onclick = () => absenceForm(o, null, self ? ME.empId : '');
    bindAbs(el); after();
  },

  recruitment(jobId) {
    const o = org();
    if (jobId) return jobPipeline(o, jobId);
    main.innerHTML = page('Recrutement', 'Offres, candidats et processus de sélection', canManage() ? '<button class="btn primary" id="nj">+ Offre</button>' : '') + `
      ${isPublic(o) ? '<div class="alert">Rappel : avant de recruter sur un emploi permanent, déclarez la vacance d\'emploi (CDG, Place de l\'emploi public) et laissez un délai raisonnable aux candidatures.</div>' : ''}
      <div class="grid g3">${o.jobs.map((j) => { const cs = o.candidates.filter((c) => c.jobId === j.id); return `<a class="card" href="#/recruitment/${j.id}" style="text-decoration:none;color:inherit"><div class="row between"><span class="badge ${j.statut === 'Ouvert' ? 'ok' : ''}">${j.statut}</span><small>${fmtDate(j.ouvert)}</small></div><h3 style="margin-top:8px">${esc(j.titre)}</h3><p class="muted">${esc(j.service)} · ${esc(j.contrat)}${j.typeRecrut ? ' · ' + esc(j.typeRecrut) : ''}</p>
        <div class="row" style="gap:4px">${STAGES.map((s) => `<span class="badge" title="${s}">${s.slice(0, 4)}. ${cs.filter((c) => c.etape === s).length}</span>`).join('')}</div></a>`; }).join('') || '<div class="card empty">Aucune offre. Créez-en une.</div>'}</div>
      <div class="card"><h3>Les étapes d'un recrutement réussi</h3><ol><li>Analyser le besoin (remplacement ? création ? ${isPublic(o) ? 'poste au tableau des emplois et budget' : 'budget'})</li><li>Rédiger la fiche de poste (missions, compétences, ${isPublic(o) ? 'cadre d\'emplois, catégorie' : 'classification'})</li><li>Publier ${isPublic(o) ? '(déclaration de vacance obligatoire)' : '(sans mention discriminatoire)'}</li><li>Trier selon des critères objectifs définis à l'avance</li><li>Entretiens structurés, mêmes questions pour tous</li><li>Décision, proposition, réponses aux candidats non retenus</li><li>Préparer l'intégration</li></ol>
      <p class="muted">25+ critères de discrimination sont interdits (âge, sexe, origine, état de santé, handicap, situation de famille, grossesse, opinions, activités syndicales, lieu de résidence, apparence physique…).</p></div>`;
    $('#nj')?.addEventListener('click', () => jobForm(o));
    after();
  },

  onboarding() {
    const o = org();
    main.innerHTML = page('Intégration', 'Check-lists d\'arrivée : rien n\'est oublié, de la veille de l\'arrivée à la fin de la période d\'essai / du stage.', canManage() ? '<button class="btn primary" id="no">+ Parcours d\'intégration</button>' : '') + `
      <div class="grid g2">${o.onboardings.map((x) => { const d = x.items.filter((i) => i.done).length; return `<div class="card"><div class="row between"><h3>${esc(empName(o, x.empId))}</h3><small>${d}/${x.items.length}</small></div>${bar((d / x.items.length) * 100)}
        <div style="margin-top:10px">${x.items.map((i, k) => `<label class="row" style="font-weight:500;padding:3px 0;flex-wrap:nowrap"><input type="checkbox" data-ob="${x.id}" data-k="${k}" ${i.done ? 'checked' : ''}> <span style="${i.done ? 'text-decoration:line-through;opacity:.6' : ''}">${esc(i.t)}</span></label>`).join('')}</div>
        <div class="row" style="margin-top:8px;flex-wrap:nowrap"><input placeholder="Ajouter une étape…" data-add="${x.id}"><button class="btn sm danger" data-delob="${x.id}">Supprimer</button></div></div>`; }).join('') || '<div class="card empty">Aucun parcours. Un parcours est créé automatiquement quand vous recrutez un candidat.</div>'}</div>`;
    $('#no')?.addEventListener('click', () => {
      const without = o.employees.filter((e) => isActive(e) && !o.onboardings.some((x) => x.empId === e.id));
      if (!without.length) return toast('Tous les dossiers ont déjà un parcours.');
      modal({ title: 'Nouveau parcours d\'intégration', body: fSelect('empId', S(o).Emp, without.map((e) => [e.id, e.prenom + ' ' + e.nom])) + `<p class="muted">La check-list type « ${S(o).label} » sera utilisée. Vous pourrez ajouter des étapes.</p>`,
        onSubmit: (fd) => { mutate((x) => { x.onboardings.push({ id: uid(), empId: fd.empId, items: ONBOARDING[x.sector].map((t) => ({ t, done: false })) }); journal(x, `Parcours d'intégration créé pour ${empName(x, fd.empId)}`); }); view.onboarding(); } });
    });
    $$('[data-ob]').forEach((c) => c.onchange = () => { mutate((x) => { x.onboardings.find((y) => y.id === c.dataset.ob).items[c.dataset.k].done = c.checked; }); view.onboarding(); });
    $$('[data-add]').forEach((i) => i.onkeydown = (ev) => { if (ev.key === 'Enter' && i.value.trim()) { mutate((x) => x.onboardings.find((y) => y.id === i.dataset.add).items.push({ t: i.value.trim(), done: false })); view.onboarding(); } });
    $$('[data-delob]').forEach((b) => b.onclick = async () => { if (await ask('Supprimer ce parcours ?')) { mutate((x) => { x.onboardings = x.onboardings.filter((y) => y.id !== b.dataset.delob); }); view.onboarding(); } });
    after();
  },

  reviews() {
    const o = org(), V = S(o); const y = String(new Date().getFullYear());
    const camp = o.campaigns.slice().sort((a, b) => b.annee - a.annee);
    main.innerHTML = page('Entretiens', isPublic(o) ? 'Entretien professionnel annuel (il a remplacé la notation), conduit par le supérieur hiérarchique direct.' : 'Entretien professionnel obligatoire (perspectives d\'évolution) et entretien annuel d\'évaluation (facultatif).', canManage() ? '<button class="btn primary" id="nc">+ Campagne</button>' : '') + `
      ${camp.map((c) => { const rs = o.reviews.filter((r) => r.campaignId === c.id); const done = rs.filter((r) => ['Réalisé', 'Signé'].includes(r.statut)).length;
        return `<div class="card"><div class="row between"><h3>${esc(c.type)} ${esc(c.annee)}</h3><span>${done} / ${rs.length} réalisés</span></div>${bar(rs.length ? (done / rs.length) * 100 : 0)}
        <div class="table-wrap" style="margin-top:10px"><table><tr><th>${V.Emp}</th><th>Évaluateur</th><th>Date</th><th>Statut</th><th></th></tr>${rs.map((r) => `<tr><td>${esc(empName(o, r.empId))}</td><td>${esc(empName(o, r.managerId))}</td><td>${fmtDate(r.date)}</td>
        <td><span class="badge ${r.statut === 'Signé' ? 'ok' : r.statut === 'Réalisé' ? 'info' : r.statut === 'Recours' ? 'bad' : ''}">${esc(r.statut)}</span></td><td><button class="btn sm" data-r="${r.id}">Ouvrir</button></td></tr>`).join('')}</table></div></div>`; }).join('') || '<div class="card empty">Aucune campagne. Lancez-en une : un entretien sera créé pour chaque personne présente.</div>'}
      <div class="card lesson"><h3>Bien mener un entretien</h3><ul><li>Convoquer à l'avance (au moins 8 jours dans la fonction publique) avec la fiche de poste et le support.</li><li>Parler de faits, d'exemples, de résultats — pas de la personnalité.</li><li>Fixer 3 à 5 objectifs SMART.</li><li>Recueillir les besoins de formation et les souhaits d'évolution.</li><li>${isPublic(o) ? 'Notifier le compte rendu à l\'agent, qui peut y porter ses observations et demander une révision (puis saisir la CAP).' : 'Remettre une copie écrite au salarié.'}</li></ul></div>`;
    $('#nc')?.addEventListener('click', () => modal({ title: 'Nouvelle campagne', body: fInput('annee', 'Année', y) + fSelect('type', 'Type', V.reviewTypes),
      onSubmit: (fd) => { mutate((x) => { const c = { id: uid(), annee: fd.annee, type: fd.type }; x.campaigns.push(c);
        x.employees.filter(isActive).forEach((e) => x.reviews.push({ id: uid(), campaignId: c.id, type: fd.type, annee: fd.annee, empId: e.id, managerId: e.managerId, date: '', statut: 'À planifier', bilan: '', objectifs: '', formation: '', evolution: '', avisAgent: '' }));
        journal(x, `Campagne « ${fd.type} ${fd.annee} » lancée`); }); view.reviews(); } }));
    $$('[data-r]').forEach((b) => b.onclick = () => reviewForm(o, o.reviews.find((r) => r.id === b.dataset.r)));
    after();
  },

  training() {
    const o = org(), V = S(o); const budget = Number(o.settings.trainingBudget) || 0;
    const cost = o.trainings.reduce((s, t) => s + Number(t.cout || 0), 0);
    main.innerHTML = page(isPublic(o) ? 'Plan de formation' : 'Plan de développement des compétences', `${o.trainings.length} action(s) · coût total ${fmtEur(cost)}${budget ? ' / budget ' + fmtEur(budget) : ''}`, canManage() ? '<button class="btn" id="bud">Budget</button><button class="btn primary" id="nt">+ Formation</button>' : '') + `
      ${budget && cost > budget ? '<div class="alert bad">Budget formation dépassé.</div>' : ''}
      ${o.trainings.length ? `<div class="table-wrap"><table><tr><th>Intitulé</th><th>Type</th><th>Organisme</th><th>Date</th><th>Durée</th><th>Coût</th><th>Participants</th><th>Statut</th></tr>${o.trainings.map((t) => `<tr class="click" data-t="${t.id}"><td>${esc(t.intitule)}</td><td><span class="badge">${esc(t.type)}</span></td><td>${esc(t.organisme)}</td><td>${fmtDate(t.date)}</td><td>${esc(t.duree)} h</td><td>${fmtEur(t.cout)}</td><td>${(t.participants || []).length}</td><td>${esc(t.statut)}</td></tr>`).join('')}</table></div>` : '<div class="card empty">Aucune formation.</div>'}
      <div class="card lesson"><h3>Repères</h3>${isPublic(o) ? '<ul><li><strong>Formations statutaires obligatoires</strong> (FPT) : intégration (avant titularisation) et professionnalisation (au 1er emploi, tout au long de la carrière, prise de poste à responsabilité).</li><li><strong>CPF</strong> : 25 h par an, plafond 150 h (davantage pour les agents de catégorie C sans diplôme de niveau 4).</li><li>Préparation aux concours, congé de formation professionnelle, bilan de compétences, VAE.</li><li>En FPT, le <strong>CNFPT</strong> est financé par une cotisation sur la masse salariale.</li></ul>' : '<ul><li><strong>Obligation d\'adaptation</strong> au poste et de maintien dans l\'emploi : formations sur le temps de travail.</li><li><strong>CPF</strong> en euros : 500 € par an (800 € pour les moins qualifiés), plafond 5 000 € (8 000 €), avec un reste à charge forfaitaire pour le salarié.</li><li>Entretien professionnel : recense les besoins.</li><li>Alternance, Pro-A, VAE, bilan de compétences, projet de transition professionnelle.</li></ul>'}</div>`;
    $('#nt')?.addEventListener('click', () => trainingForm(o));
    $('#bud')?.addEventListener('click', () => modal({ title: 'Budget formation annuel', body: fInput('b', 'Montant (€)', budget, { type: 'number' }), onSubmit: (fd) => { mutate((x) => { x.settings.trainingBudget = Number(fd.b) || 0; }); view.training(); } }));
    $$('[data-t]').forEach((r) => r.onclick = () => trainingForm(o, o.trainings.find((t) => t.id === r.dataset.t)));
    after();
  },

  projects() {
    const o = org();
    main.innerHTML = page('Projets RH', 'Pilotez vos chantiers RH. Pour un suivi complet (Kanban, Gantt, risques, budget), utilisez Pilote.', canManage() ? '<button class="btn primary" id="np">+ Projet RH</button>' : '') + `
      <div class="grid g2">${o.projects.map((p) => { const d = p.tasks.filter((t) => t.done).length; const late = p.echeance && p.echeance < todayISO() && d < p.tasks.length;
        return `<div class="card"><div class="row between"><h3>${esc(p.titre)}</h3><span class="badge ${late ? 'bad' : d === p.tasks.length && p.tasks.length ? 'ok' : ''}">${late ? 'En retard' : d === p.tasks.length && p.tasks.length ? 'Terminé' : 'En cours'}</span></div><small>Échéance : ${fmtDate(p.echeance)} · Pilote : ${esc(p.pilote || '—')}</small>
        <div style="margin:8px 0">${bar(p.tasks.length ? (d / p.tasks.length) * 100 : 0)}</div>${p.tasks.map((t, k) => `<label class="row" style="font-weight:500;padding:3px 0;flex-wrap:nowrap"><input type="checkbox" data-p="${p.id}" data-k="${k}" ${t.done ? 'checked' : ''}><span style="flex:1;${t.done ? 'text-decoration:line-through;opacity:.6' : ''}">${esc(t.t)}</span>${t.due ? `<small>${fmtDate(t.due)}</small>` : ''}</label>`).join('')}
        <div class="row" style="margin-top:8px;flex-wrap:nowrap"><input placeholder="Nouvelle tâche (Entrée)…" data-addp="${p.id}"><button class="btn sm danger" data-delp="${p.id}">✕</button></div></div>`; }).join('') || '<div class="card empty">Aucun projet RH.</div>'}</div>
      <div class="card"><h3>Gestion de projet avancée</h3><p>Pour un projet RH important (réorganisation, nouveau SIRH, élections), créez-le dans <a href="${SUITE[0].url}" target="_blank" rel="noopener">Pilote</a> : tableau Kanban, planning de Gantt, risques, budget et formation à la gestion de projet.</p></div>`;
    $('#np')?.addEventListener('click', () => modal({ title: 'Nouveau projet RH', body: fSelect('tpl', 'Modèle', [['', 'Projet vide'], ...Object.entries(HR_PROJECTS).map(([k, v]) => [k, v[0]])]) + fInput('titre', 'Titre (laisser vide pour reprendre le modèle)') + fInput('pilote', 'Pilote du projet', ME.name) + fInput('echeance', 'Échéance', addDays(todayISO(), 90), { type: 'date' }),
      onSubmit: (fd) => { const tpl = HR_PROJECTS[fd.tpl]; const titre = fd.titre || tpl?.[0]; if (!titre) throw new Error('Donnez un titre'); const n = tpl ? tpl[1].length : 0;
        mutate((x) => { x.projects.push({ id: uid(), titre, pilote: fd.pilote, echeance: fd.echeance, tasks: (tpl?.[1] || []).map((t, i) => ({ t, done: false, due: addDays(todayISO(), Math.round(((i + 1) / n) * daysBetween(todayISO(), fd.echeance))) })) }); journal(x, `Projet RH « ${titre} » créé`); }); view.projects(); } }));
    $$('[data-p]').forEach((c) => c.onchange = () => { mutate((x) => { x.projects.find((p) => p.id === c.dataset.p).tasks[c.dataset.k].done = c.checked; }); view.projects(); });
    $$('[data-addp]').forEach((i) => i.onkeydown = (ev) => { if (ev.key === 'Enter' && i.value.trim()) { mutate((x) => x.projects.find((p) => p.id === i.dataset.addp).tasks.push({ t: i.value.trim(), done: false, due: '' })); view.projects(); } });
    $$('[data-delp]').forEach((b) => b.onclick = async () => { if (await ask('Supprimer ce projet ?')) { mutate((x) => { x.projects = x.projects.filter((p) => p.id !== b.dataset.delp); }); view.projects(); } });
    after();
  },

  payroll(sub = 'mass') {
    const o = org(), V = S(o); const act = o.employees.filter(isActive);
    const rows = act.map((e) => ({ e, p: payslip(o, e) }));
    const tot = rows.reduce((s, r) => ({ g: s.g + r.p.gross, n: s.n + r.p.net, c: s.c + r.p.cost }), { g: 0, n: 0, c: 0 });
    main.innerHTML = page('Paie & masse salariale', 'Estimations pédagogiques pour comprendre la construction d\'une rémunération.') + `
      <div class="tabs"><a href="#/payroll/mass" class="${sub === 'mass' ? 'active' : ''}">Masse salariale</a><a href="#/payroll/sim" class="${sub === 'sim' ? 'active' : ''}">Simulateur</a><a href="#/payroll/learn" class="${sub === 'learn' ? 'active' : ''}">Comprendre ${isPublic(o) ? 'la rémunération publique' : 'le bulletin'}</a></div><div id="pay"></div>`;
    const el = $('#pay');
    if (sub === 'mass') {
      el.innerHTML = `<div class="grid g3"><div class="card kpi"><span class="v">${fmtEur(tot.g)}</span><span class="l">Brut mensuel total</span></div><div class="card kpi"><span class="v">${fmtEur(tot.c * 12)}</span><span class="l">Coût employeur annuel estimé</span></div><div class="card kpi"><span class="v">${fmtEur(tot.n)}</span><span class="l">Net mensuel total estimé</span></div></div>
        <div class="table-wrap" style="margin-top:14px"><table><tr><th>${V.Emp}</th><th>Statut</th>${isPublic(o) ? '<th>IM</th>' : ''}<th>Brut mensuel</th><th>Net estimé</th><th>Coût employeur / an</th></tr>${rows.map(({ e, p }) => `<tr class="click" data-pe="${e.id}"><td>${esc(e.prenom + ' ' + e.nom)}</td><td>${esc(e.statut)}</td>${isPublic(o) ? `<td>${esc(e.im)}</td>` : ''}<td>${fmtEur(p.gross)}</td><td>${fmtEur(p.net)}</td><td>${fmtEur(p.cost * 12)}</td></tr>`).join('')}</table></div>
        ${isPublic(o) ? '<div class="alert" style="margin-top:14px"><strong>GVT</strong> (glissement vieillesse-technicité) : la masse salariale augmente chaque année même à effectif constant, à cause des avancements d\'échelon et de grade. À intégrer dans le budget primitif.</div>' : ''}`;
      $$('[data-pe]').forEach((r) => r.onclick = () => location.hash = `#/employee/${r.dataset.pe}/pay`);
    } else if (sub === 'sim') {
      el.innerHTML = `<div class="grid g2"><form class="card" id="sf"><h3>Paramètres</h3><div class="fields">${isPublic(o)
        ? fSelect('statut', 'Statut', ['Fonctionnaire titulaire', 'Contractuel CDD']) + fInput('im', 'Indice majoré', 400, { type: 'number' }) + fInput('nbi', 'NBI (points)', 0, { type: 'number' }) + fInput('ifse', 'IFSE mensuelle (€)', 250, { type: 'number' }) + fInput('enfants', 'Enfants à charge', 0, { type: 'number' }) + fInput('quotite', 'Quotité (%)', 100, { type: 'number' })
        : fSelect('categorie', 'Catégorie', V.categories) + fSelect('statut', 'Contrat', ['CDI', 'Apprentissage']) + fInput('brut', 'Salaire brut mensuel (€)', 2200, { type: 'number' }) + fInput('heures', 'Heures / semaine', 35, { type: 'number' })}</div></form><div id="sr"></div></div>`;
      const run = () => { const fd = Object.fromEntries(new FormData($('#sf')).entries()); $('#sr').innerHTML = payslipHTML(o, newEmp(o, { ...fd, quotite: Number(fd.quotite) || 100 })); };
      $('#sf').addEventListener('input', run); run();
    } else {
      el.innerHTML = `<div class="card lesson">${isPublic(o) ? `<h3>La rémunération d'un fonctionnaire</h3>
        <p>Elle comprend obligatoirement (article L712-1 du CGFP) : le <strong>traitement</strong>, l'<strong>indemnité de résidence</strong>, le <strong>supplément familial de traitement</strong>, et les <strong>primes et indemnités</strong> instituées par un texte.</p>
        <ul><li><strong>Grille indiciaire</strong> : chaque grade comporte des échelons. Chaque échelon correspond à un <strong>indice brut (IB)</strong>, qui donne un <strong>indice majoré (IM)</strong>.</li><li><strong>Traitement brut mensuel = IM × valeur du point</strong>. Valeur mensuelle du point : ${o.settings.point} € (modifiable dans les paramètres).</li>
        <li><strong>NBI</strong> (nouvelle bonification indiciaire) : points d'indice supplémentaires liés à certaines fonctions (encadrement, accueil du public…).</li><li><strong>RIFSEEP</strong> : <strong>IFSE</strong> (indemnité de fonctions, de sujétions et d'expertise, mensuelle, selon le groupe de fonctions) + <strong>CIA</strong> (complément indemnitaire annuel, facultatif, lié à l'engagement et à la manière de servir). Mis en place par délibération en FPT.</li>
        <li><strong>Cotisations</strong> du titulaire : retraite CNRACL (FPT, FPH) ou pension civile (État) à 11,10 % du traitement + NBI ; RAFP (retraite additionnelle) sur les primes ; CSG / CRDS. Le contractuel cotise au régime général et à l'IRCANTEC.</li></ul>` : `<h3>Lire un bulletin de paie</h3>
        <ul><li><strong>Salaire de base</strong> : horaire × heures mensualisées (35 h = 151,67 h / mois). Il ne peut être inférieur au SMIC ni au minimum conventionnel.</li><li><strong>Heures supplémentaires</strong> : +25 % de la 36e à la 43e heure, +50 % au-delà (sauf accord, minimum 10 %).</li><li><strong>Primes</strong> : ancienneté, 13e mois… selon la convention collective ou l'usage.</li>
        <li><strong>Cotisations salariales</strong> : environ 22 % (non-cadre) à 25 % (cadre) du brut — santé, retraite de base et complémentaire (AGIRC-ARRCO), chômage côté employeur, CSG/CRDS.</li><li><strong>Net à payer avant impôt</strong>, puis <strong>prélèvement à la source</strong>.</li><li><strong>Net social</strong> : montant à déclarer pour les prestations sociales (obligatoire sur le bulletin depuis 2024).</li></ul>`}</div>`;
    }
    after();
  },

  documents() {
    const o = org();
    main.innerHTML = page('Documents', 'Trames pré-remplies avec les données des dossiers. À relire et adapter avant signature.') + `<div class="grid g2">${DOCS[o.sector].map((d) => `<div class="card"><h3>📄 ${esc(d.t)}</h3><div class="row" style="flex-wrap:nowrap"><select data-sel="${d.id}">${o.employees.filter(isActive).map((e) => `<option value="${e.id}">${esc(e.prenom + ' ' + e.nom)}</option>`).join('')}</select><button class="btn primary" data-doc="${d.id}">Générer</button></div></div>`).join('')}</div>`;
    $$('[data-doc]').forEach((b) => b.onclick = () => { const empId = $(`[data-sel="${b.dataset.doc}"]`).value; if (!empId) return toast('Aucun dossier.'); docModal(o, b.dataset.doc, empId); });
    after();
  },

  compliance() {
    const o = org(); const eff = Math.max(o.effectifDeclare || 0, o.employees.filter(isActive).length);
    const list = OBLIGATIONS[o.sector]; const appl = list.filter((x) => eff >= x.min), future = list.filter((x) => eff < x.min);
    const done = appl.filter((x) => o.compliance?.[x.k]).length;
    main.innerHTML = page('Obligations & conformité', `Effectif pris en compte : ${eff}. ${done} / ${appl.length} obligations marquées à jour.`) + `${bar((done / Math.max(1, appl.length)) * 100)}
      <div class="card" style="margin-top:14px"><h3>Obligations applicables</h3>${appl.map((x) => `<div style="padding:10px 0;border-top:1px solid var(--line)"><label class="row" style="flex-wrap:nowrap;margin:0"><input type="checkbox" data-c="${x.k}" ${o.compliance?.[x.k] ? 'checked' : ''}><span style="flex:1">${esc(x.t)}</span>${o.compliance?.[x.k] ? `<span class="badge ok">à jour · ${fmtDate(o.compliance[x.k])}</span>` : '<span class="badge warn">à vérifier</span>'}</label><small class="muted" style="display:block;padding-left:26px">${esc(x.p)} — ${esc(x.d)}</small></div>`).join('')}</div>
      ${future.length ? `<div class="card"><h3>Seuils à venir</h3>${future.map((x) => `<div style="padding:6px 0;border-top:1px solid var(--line)"><span class="badge">≥ ${x.min}</span> ${esc(x.t)} <small class="muted">— ${esc(x.d)}</small></div>`).join('')}</div>` : ''}`;
    $$('[data-c]').forEach((c) => c.onchange = () => { mutate((x) => { x.compliance = x.compliance || {}; x.compliance[c.dataset.c] = c.checked ? todayISO() : ''; }); view.compliance(); });
    after();
  },

  reports() {
    const o = org(), V = S(o); const t = todayISO(), y1 = addDays(t, -365);
    const act = o.employees.filter(isActive);
    const group = (fn) => { const g = {}; act.forEach((e) => { const k = fn(e) || '—'; g[k] = (g[k] || 0) + 1; }); return Object.entries(g).sort((a, b) => b[1] - a[1]); };
    const exits = o.employees.filter((e) => e.sortie && e.sortie >= y1 && e.sortie <= t).length;
    const entries = o.employees.filter((e) => e.entree >= y1 && e.entree <= t).length;
    const turnover = act.length ? (((exits + entries) / 2) / act.length) * 100 : 0;
    const sickDays = o.absences.filter((a) => a.statut === 'validee' && S(o).maladie.includes(a.type)).reduce((s, a) => { const from = a.debut > y1 ? a.debut : y1, to = a.fin < t ? a.fin : t; return s + Math.max(0, daysBetween(from, to) + 1); }, 0);
    const absRate = act.length ? (sickDays / (act.length * 365)) * 100 : 0;
    const avgSen = act.length ? act.reduce((s, e) => s + seniority(e), 0) / act.length : 0;
    const avgAge = act.filter((e) => e.naissance).length ? act.filter((e) => e.naissance).reduce((s, e) => s + age(e.naissance), 0) / act.filter((e) => e.naissance).length : 0;
    const bands = ['< 30', '30-39', '40-49', '50-59', '60 +'], bandOf = (a) => a < 30 ? 0 : a < 40 ? 1 : a < 50 ? 2 : a < 60 ? 3 : 4;
    const pyr = bands.map(() => ({ f: 0, h: 0 })); act.filter((e) => e.naissance).forEach((e) => { pyr[bandOf(age(e.naissance))][e.civ === 'M.' ? 'h' : 'f']++; });
    const maxP = Math.max(1, ...pyr.map((p) => Math.max(p.f, p.h)));
    const dist = (title, data) => `<div class="card"><h3>${title}</h3>${data.map(([k, v]) => `<div style="margin-bottom:8px"><div class="row between"><span>${esc(k)}</span><strong>${v} <small class="muted">(${Math.round((v / act.length) * 100)} %)</small></strong></div>${bar((v / act.length) * 100)}</div>`).join('') || '<p class="muted">—</p>'}</div>`;
    main.innerHTML = page('Rapports', isPublic(o) ? 'Ces indicateurs alimentent le rapport social unique (RSU).' : 'Indicateurs sociaux clés (utiles pour la BDESE).', '<button class="btn" onclick="window.print()">🖨️ Imprimer</button>') + `
      <div class="grid g4 kpis"><div class="card kpi"><span class="v">${act.length}</span><span class="l">Effectif physique</span></div><div class="card kpi"><span class="v">${turnover.toFixed(1)} %</span><span class="l">Turnover 12 mois ((entrées + sorties) / 2 / effectif)</span></div>
      <div class="card kpi"><span class="v">${absRate.toFixed(1)} %</span><span class="l">Absentéisme maladie 12 mois</span></div><div class="card kpi"><span class="v">${avgAge.toFixed(0)} ans</span><span class="l">Âge moyen · ancienneté ${avgSen.toFixed(1)} ans</span></div></div>
      <div class="card" style="margin-top:14px"><h3>Pyramide des âges</h3><div style="max-width:560px;margin:auto">${bands.map((b, i) => `<div style="display:grid;grid-template-columns:1fr 60px 1fr;align-items:center;gap:6px;margin-bottom:6px"><div style="display:flex;justify-content:flex-end"><div style="height:18px;width:${(pyr[i].f / maxP) * 100}%;background:var(--accent);border-radius:4px 0 0 4px;min-width:${pyr[i].f ? 4 : 0}px"></div></div><small style="text-align:center">${b} · ${pyr[i].f}/${pyr[i].h}</small><div><div style="height:18px;width:${(pyr[i].h / maxP) * 100}%;background:var(--info);border-radius:0 4px 4px 0;min-width:${pyr[i].h ? 4 : 0}px"></div></div></div>`).join('')}
      <p class="muted" style="text-align:center"><span style="color:var(--accent)">■</span> Femmes · <span style="color:var(--info)">■</span> Hommes</p></div></div>
      <div class="grid g3">${dist('Par statut', group((e) => e.statut))}${dist(isPublic(o) ? 'Par catégorie' : 'Par catégorie socioprofessionnelle', group((e) => e.categorie))}${dist('Par service', group((e) => e.service))}</div>
      <div class="card"><h3>Mouvements sur 12 mois</h3><p>${entries} entrée(s), ${exits} sortie(s).</p>${o.employees.filter((e) => e.sortie && e.sortie >= y1).map((e) => `<div>↘ ${esc(e.prenom + ' ' + e.nom)} — ${fmtDate(e.sortie)} — ${esc(e.motifSortie)}</div>`).join('')}</div>`;
    after();
  },

  simulation(missionId) {
    const cur = mode();
    if (missionId && inSim()) return missionView(missionId);
    main.innerHTML = page('Parcours de simulation', 'Entraînez-vous dans une organisation fictive : chaque mission se réalise dans le vrai logiciel et se vérifie automatiquement.') + `
      <div class="grid g2">${Object.values(SCENARIOS).map((sc) => { const so = store.get(simKey(sc.id), null); const done = so ? Object.keys(so.sim?.done || {}).length : 0; const score = so ? Object.values(so.sim?.done || {}).reduce((s, d) => s + d.score, 0) : 0;
        return `<div class="card" style="${cur === sc.id ? 'border:2px solid var(--accent)' : ''}"><div style="font-size:2rem">${sc.ico}</div><h3>${esc(sc.title)}</h3><p class="muted">${esc(sc.pitch)}</p>
        <p>${sc.missions.length} missions sur 3 ans · ${done} réalisée(s) · score ${score} / ${sc.missions.length * 10}</p>${bar((done / sc.missions.length) * 100)}
        <div class="row" style="margin-top:12px">${cur === sc.id ? '<span class="badge acc">Simulation active</span>' : `<button class="btn primary" data-start="${sc.id}">${so ? 'Reprendre' : 'Commencer'}</button>`}${so ? `<button class="btn sm danger" data-reset="${sc.id}">Recommencer à zéro</button>` : ''}</div></div>`; }).join('')}</div>
      ${inSim() ? missionsList() : '<div class="alert">En mode simulation, tout le logiciel fonctionne sur les données fictives : votre organisation réelle n\'est pas touchée. Un bandeau rappelle la mission en cours.</div>'}`;
    $$('[data-start]').forEach((b) => b.onclick = () => {
      const sc = SCENARIOS[b.dataset.start];
      if (!store.get(simKey(sc.id), null)) { const o = { id: uid(), ...sc.org(), settings: { ...DEFAULT_SETTINGS } }; o.sim = { done: {}, active: sc.missions[0].id }; store.set(simKey(sc.id), o); }
      store.set(modeKey(), sc.id); location.hash = '#/simulation'; boot();
    });
    $$('[data-reset]').forEach((b) => b.onclick = async () => { if (!await ask('Effacer toute la progression de ce scénario ?')) return; store.del(simKey(b.dataset.reset)); if (mode() === b.dataset.reset) store.set(modeKey(), 'real'); boot(); });
    $$('[data-m]').forEach((b) => b.onclick = () => location.hash = '#/simulation/' + b.dataset.m);
    after();
  },

  settings() {
    const o = org();
    main.innerHTML = page('Paramètres', inSim() ? 'Paramètres de l\'organisation fictive.' : '') + `<form class="card" id="sf"><h3>Organisation</h3><div class="fields">
      ${fInput('name', 'Nom', o.name)}${fSelect('sector', 'Secteur', [['public', 'Fonction publique'], ['prive', 'Secteur privé']], o.sector)}
      ${fSelect('versant', 'Versant (public)', Object.entries(VERSANTS), o.versant)}${fInput('ccn', 'Convention collective (privé)', o.ccn)}
      ${fInput('adresse', 'Adresse', o.adresse)}${fInput('ville', 'Ville', o.ville)}${fInput('signataire', 'Signataire des documents', o.signataire)}${fInput('effectifDeclare', 'Effectif total (si tous les dossiers ne sont pas saisis)', o.effectifDeclare, { type: 'number' })}
      ${fInput('services', 'Services (séparés par des virgules)', o.services.join(', '), { full: true })}</div>
      <h3>Paramètres de paie</h3><div class="fields">${fInput('point', 'Valeur mensuelle du point d\'indice (€)', o.settings.point, { type: 'number', attrs: 'step="0.00001"' })}${fInput('smicH', 'SMIC horaire brut (€)', o.settings.smicH, { type: 'number', attrs: 'step="0.01"' })}
      ${fSelect('ir', 'Zone d\'indemnité de résidence', [[0, 'Zone 3 — 0 %'], [1, 'Zone 2 — 1 %'], [3, 'Zone 1 — 3 %']], o.settings.ir)}</div>
      <p class="muted">Valeurs par défaut indicatives : vérifiez-les et mettez-les à jour lors de chaque revalorisation.</p><button class="btn primary">Enregistrer</button></form>
      ${inSim() ? '' : `<div class="card"><h3>Sauvegarde</h3><div class="row"><button class="btn" id="exp">⬇️ Exporter</button><button class="btn" id="imp">⬆️ Importer</button></div><p class="muted">Les données sont stockées dans ce navigateur. Exportez régulièrement.</p></div>`}`;
    $('#sf').onsubmit = (ev) => { ev.preventDefault(); const fd = Object.fromEntries(new FormData(ev.target).entries());
      mutate((x) => { Object.assign(x, { name: fd.name, sector: fd.sector, versant: fd.versant, ccn: fd.ccn, adresse: fd.adresse, ville: fd.ville, signataire: fd.signataire, effectifDeclare: Number(fd.effectifDeclare) || 0, services: fd.services.split(',').map((s) => s.trim()).filter(Boolean) });
        x.settings = { ...x.settings, point: Number(fd.point), smicH: Number(fd.smicH), ir: Number(fd.ir) }; journal(x, 'Paramètres mis à jour'); });
      toast('Enregistré'); boot(); };
    $('#exp')?.addEventListener('click', () => download('rh-studio-sauvegarde.json', JSON.stringify({ app: 'rhstudio', org: org(), users: auth.users().filter((u) => u.wsId === ME.wsId) }, null, 2)));
    $('#imp')?.addEventListener('click', async () => { try { const d = JSON.parse(await pickFile()); if (d.app !== 'rhstudio') throw new Error('fichier non reconnu'); store.set('org:' + ME.wsId, d.org);
      const keep = auth.users().filter((u) => !d.users.some((x) => x.email === u.email)); auth.saveUsers([...keep, ...d.users.map((u) => ({ ...u, wsId: ME.wsId }))]); toast('Import réussi'); boot(); } catch (err) { toast('Import impossible : ' + err.message); } });
    after();
  },

  accounts() {
    const o = org(); const list = auth.users().filter((u) => u.wsId === ME.wsId);
    main.innerHTML = page('Comptes', 'Créez les accès de votre équipe. Un compte « Salarié / agent » relié à un dossier donne accès à son espace personnel (congés, informations).', '<button class="btn primary" id="nu">+ Compte</button>') + `
      <div class="table-wrap"><table><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th>Dossier lié</th><th></th></tr>${list.map((u) => `<tr><td>${esc(u.name)}${u.mustChange ? ' <span class="badge warn">provisoire</span>' : ''}</td><td>${esc(u.email)}</td><td>${ROLES[u.role]}</td><td>${esc(empName(o, u.empId))}</td><td>${u.id !== ME.id ? `<button class="btn sm danger" data-del="${u.id}">Supprimer</button>` : ''}</td></tr>`).join('')}</table></div>`;
    $('#nu').onclick = () => modal({ title: 'Nouveau compte', body: `<div class="fields">${fInput('name', 'Nom', '', { req: true })}${fInput('email', 'E-mail', '', { type: 'email', req: true })}${fSelect('role', 'Rôle', Object.entries(ROLES), 'salarie')}${fSelect('empId', 'Dossier lié', [['', '—'], ...o.employees.filter(isActive).map((e) => [e.id, e.prenom + ' ' + e.nom])])}${fInput('password', 'Mot de passe provisoire', 'Bienvenue' + Math.floor(100 + Math.random() * 900), { full: true })}</div>`,
      async onSubmit(fd) { await auth.create({ name: fd.name, email: fd.email, password: fd.password, role: fd.role, wsId: ME.wsId, extra: { empId: fd.empId, mustChange: true } }); toast(`Compte créé — mot de passe provisoire : ${fd.password}`, 6000); view.accounts(); } });
    $$('[data-del]').forEach((b) => b.onclick = async () => { if (await ask('Supprimer ce compte ?')) { auth.remove(b.dataset.del); view.accounts(); } });
  },

  me() {
    const o = org(); const e = o.employees.find((x) => x.id === ME.empId);
    if (!e) { main.innerHTML = page('Mon espace') + '<div class="alert warn">Votre compte n\'est relié à aucun dossier. Contactez le service RH.</div>'; return; }
    const b = leaveBalance(o, e);
    main.innerHTML = page(`Bonjour ${esc(e.prenom)}`, `${esc(e.poste)} · ${esc(e.service)}`, '<a class="btn primary" href="#/absences">Demander un congé</a>') + `<div class="grid g3"><div class="card kpi"><span class="v">${b.reste}</span><span class="l">${b.label} restants (${b.unit})</span></div><div class="card kpi"><span class="v">${b.rtt - b.rttPris}</span><span class="l">${S(o).rtt} restants</span></div><div class="card kpi"><span class="v">${seniority(e).toFixed(1)} ans</span><span class="l">Ancienneté</span></div></div>
      <div class="card"><h3>Mes informations</h3><table><tr><td class="muted">Statut</td><td>${esc(e.statut)}</td></tr><tr><td class="muted">Catégorie</td><td>${esc(e.categorie)}</td></tr>${e.grade ? `<tr><td class="muted">Grade / échelon</td><td>${esc(e.grade)} — ${esc(e.echelon)}</td></tr>` : ''}<tr><td class="muted">Responsable</td><td>${esc(empName(o, e.managerId))}</td></tr></table></div>`;
  },
};

/* ---------- Formulaires ---------- */
function employeeForm(o, e, isNew) {
  const V = S(o); const pub = isPublic(o);
  const managers = [['', '— Aucun —'], ...o.employees.filter((x) => isActive(x) && x.id !== e.id).map((x) => [x.id, x.prenom + ' ' + x.nom])];
  const html = `<div class="fields">${fSelect('civ', 'Civilité', ['Mme', 'M.'], e.civ)}${fInput('matricule', 'Matricule', e.matricule)}${fInput('prenom', 'Prénom', e.prenom, { req: true })}${fInput('nom', 'Nom', e.nom, { req: true })}
    ${fInput('naissance', 'Date de naissance', e.naissance, { type: 'date' })}${fInput('email', 'E-mail', e.email, { type: 'email' })}
    ${fSelect('service', 'Service', o.services, e.service)}${fInput('poste', 'Poste / emploi', e.poste)}${fSelect('managerId', 'Responsable hiérarchique', managers, e.managerId)}${fSelect('statut', pub ? 'Statut' : 'Type de contrat', V.statuts, e.statut)}
    ${fSelect('categorie', 'Catégorie', V.categories, e.categorie)}${pub ? `<div class="field"><label>Grade</label><input name="grade" list="grades" value="${esc(e.grade)}"><datalist id="grades">${GRADES_FPT.map((g) => `<option value="${esc(g)}">`).join('')}</datalist></div>` + fInput('echelon', 'Échelon', e.echelon, { type: 'number' }) + fInput('im', 'Indice majoré', e.im, { type: 'number' }) + fInput('nbi', 'NBI (points)', e.nbi, { type: 'number' }) + fInput('ifse', 'IFSE mensuelle (€)', e.ifse, { type: 'number' }) : fInput('brut', 'Salaire brut mensuel (€)', e.brut, { type: 'number' }) + fInput('heures', 'Heures / semaine', e.heures, { type: 'number' })}
    ${fInput('quotite', 'Quotité de temps de travail (%)', e.quotite, { type: 'number' })}${fInput('rtt', V.rtt + ' par an', e.rtt, { type: 'number' })}${fInput('enfants', 'Enfants à charge', e.enfants, { type: 'number' })}
    ${fInput('entree', 'Date d\'entrée', e.entree, { type: 'date' })}${fInput('finEssai', pub ? 'Fin de période d\'essai (contractuels)' : 'Fin de période d\'essai', e.finEssai, { type: 'date' })}${fInput('finContrat', 'Fin de contrat (si CDD)', e.finContrat, { type: 'date' })}
    ${fSelect('motifCDD', 'Motif du contrat à durée déterminée', [['', '—'], ...V.motifsCDD.map((m) => [m, m])], e.motifCDD, { full: true })}
    ${fInput('sortie', 'Date de sortie', e.sortie, { type: 'date' })}${fSelect('motifSortie', 'Motif de sortie', ['', ...(pub ? ['Mutation', 'Retraite', 'Démission', 'Fin de contrat', 'Disponibilité', 'Détachement sortant', 'Rupture conventionnelle', 'Licenciement', 'Révocation', 'Décès'] : ['Démission', 'Fin de CDD', 'Rupture conventionnelle', 'Licenciement pour motif personnel', 'Licenciement économique', 'Fin de période d\'essai', 'Retraite', 'Décès'])], e.motifSortie)}
    ${fText('notes', 'Notes', e.notes)}</div>
    <div class="callout tip" style="font-size:.88rem">${pub ? 'Un lauréat de concours est d\'abord <strong>stagiaire</strong> (en général un an) avant titularisation. Les contractuels ont un contrat qui doit viser le motif légal de recrutement.' : 'Période d\'essai CDI (maximum légal, renouvellement compris si l\'accord de branche le prévoit) : ouvriers / employés 2 mois (4), techniciens / agents de maîtrise 3 mois (6), cadres 4 mois (8). CDD : 1 jour par semaine, limite 2 semaines (≤ 6 mois) ou 1 mois.'}</div>`;
  const onSubmit = (fd) => {
    if (!fd.prenom?.trim() || !fd.nom?.trim()) throw new Error('Prénom et nom obligatoires');
    if (fd.finContrat && fd.finContrat < fd.entree) throw new Error('La fin de contrat est avant l\'entrée');
    if (/CDD/.test(fd.statut) && !fd.finContrat) throw new Error('Un contrat à durée déterminée doit avoir une date de fin');
    const nums = ['echelon', 'im', 'nbi', 'ifse', 'brut', 'heures', 'quotite', 'rtt', 'enfants'];
    const data = { ...fd }; nums.forEach((k) => { if (k in data) data[k] = data[k] === '' ? '' : Number(data[k]); });
    let id = e.id;
    mutate((x) => { if (isNew) { const ne = newEmp(x, data); id = ne.id; x.employees.push(ne); journal(x, `Dossier créé : ${data.prenom} ${data.nom}`); } else { Object.assign(x.employees.find((y) => y.id === e.id), data); journal(x, `Dossier modifié : ${data.prenom} ${data.nom}`); } });
    location.hash = '#/employee/' + id; router.run();
  };
  modal({ title: isNew ? `Nouveau dossier ${V.emp}` : 'Modifier le dossier', body: html, wide: true, onSubmit,
    danger: !isNew ? { label: 'Supprimer le dossier', onClick: async () => { if (!await ask('Supprimer définitivement ce dossier ? (Pour un départ, renseignez plutôt la date de sortie.)')) return false; mutate((x) => { x.employees = x.employees.filter((y) => y.id !== e.id); x.absences = x.absences.filter((a) => a.empId !== e.id); journal(x, `Dossier supprimé : ${e.prenom} ${e.nom}`); }); location.hash = '#/employees'; } } : null });
  if (isNew) main.innerHTML = page('Nouveau dossier') + '<p class="muted">Remplissez le formulaire.</p>';
}

function absTable(o, list, actions) {
  if (!list.length) return '<p class="muted">Aucune absence.</p>';
  return `<div class="table-wrap"><table><tr><th>${S(o).Emp}</th><th>Type</th><th>Du</th><th>Au</th><th>Jours</th><th>Statut</th>${actions ? '<th></th>' : ''}</tr>${list.map((a) => `<tr class="click" data-abs="${a.id}"><td>${esc(empName(o, a.empId))}</td><td>${esc(a.type)}</td><td>${fmtDate(a.debut)}</td><td>${fmtDate(a.fin)}</td><td>${absenceDays(o, a)}</td>
    <td><span class="badge ${a.statut === 'validee' ? 'ok' : a.statut === 'refusee' ? 'bad' : 'warn'}">${{ validee: 'Validée', refusee: 'Refusée', demandee: 'En attente' }[a.statut]}</span></td>${actions ? `<td style="white-space:nowrap"><button class="btn sm" data-ok="${a.id}">✓ Valider</button> <button class="btn sm danger" data-ko="${a.id}">✕ Refuser</button></td>` : ''}</tr>`).join('')}</table></div>`;
}
function bindAbs(el) {
  const decide = (id, st) => { mutate((x) => { const a = x.absences.find((y) => y.id === id); a.statut = st; journal(x, `Absence de ${empName(x, a.empId)} ${st === 'validee' ? 'validée' : 'refusée'}`); }); router.run(); };
  $$('[data-ok]', el).forEach((b) => b.onclick = (ev) => { ev.stopPropagation(); decide(b.dataset.ok, 'validee'); });
  $$('[data-ko]', el).forEach((b) => b.onclick = (ev) => { ev.stopPropagation(); decide(b.dataset.ko, 'refusee'); });
  $$('[data-abs]', el).forEach((r) => r.onclick = () => { const o = org(); absenceForm(o, o.absences.find((a) => a.id === r.dataset.abs)); });
}
function absenceForm(o, a, empId) {
  const V = S(o); const isNew = !a; const self = ME.role === 'salarie' && !inSim();
  a = a || { empId: empId || '', type: V.absences[0], debut: addDays(todayISO(), 7), fin: addDays(todayISO(), 11), statut: self ? 'demandee' : 'validee', motif: '' };
  const emps = o.employees.filter((e) => isActive(e) || e.id === a.empId);
  modal({ title: isNew ? 'Nouvelle absence' : 'Absence', body: `<div class="fields">${self ? `<input type="hidden" name="empId" value="${esc(ME.empId)}">` : fSelect('empId', V.Emp, emps.map((e) => [e.id, e.prenom + ' ' + e.nom]), a.empId)}${fSelect('type', 'Type', V.absences, a.type)}
    ${fInput('debut', 'Du', a.debut, { type: 'date' })}${fInput('fin', 'Au (inclus)', a.fin, { type: 'date' })}${self ? '' : fSelect('statut', 'Statut', [['demandee', 'En attente'], ['validee', 'Validée'], ['refusee', 'Refusée']], a.statut)}${fText('motif', 'Commentaire', a.motif)}</div><p class="muted" id="cnt"></p>`,
    onOpen(f) { const upd = () => { const fd = Object.fromEntries(new FormData(f).entries()); $('#cnt', f).textContent = `Décompte : ${absenceDays(o, fd)} jour(s).`; }; f.addEventListener('input', upd); upd(); },
    danger: !isNew && !self ? { label: 'Supprimer', onClick: () => { mutate((x) => { x.absences = x.absences.filter((y) => y.id !== a.id); }); router.run(); } } : null,
    async onSubmit(fd) {
      if (!fd.empId) throw new Error('Choisissez la personne'); if (fd.fin < fd.debut) throw new Error('La date de fin est avant le début');
      const overlap = o.absences.find((x) => x.id !== a.id && x.empId === fd.empId && x.statut !== 'refusee' && x.debut <= fd.fin && x.fin >= fd.debut);
      if (overlap && !await ask(`Attention : chevauchement avec une absence existante (${overlap.type}, ${fmtDate(overlap.debut)} – ${fmtDate(overlap.fin)}). Enregistrer quand même ?`)) return false;
      mutate((x) => { const data = { ...fd, statut: self ? 'demandee' : fd.statut }; if (isNew) { x.absences.push({ id: uid(), ...data }); journal(x, `Absence saisie pour ${empName(x, fd.empId)} (${fd.type})`); } else Object.assign(x.absences.find((y) => y.id === a.id), data); });
      router.run();
    } });
}

function jobForm(o, j) {
  const isNew = !j; const pub = isPublic(o);
  j = j || { titre: '', service: o.services[0], contrat: S(o).statuts[0], typeRecrut: pub ? RECRUT_PUBLIC[0] : '', statut: 'Ouvert', ouvert: todayISO(), description: '', vacance: false };
  modal({ title: isNew ? 'Nouvelle offre' : 'Modifier l\'offre', wide: true, body: `<div class="fields">${fInput('titre', 'Intitulé du poste', j.titre, { req: true, full: true })}${fSelect('service', 'Service', o.services, j.service)}${fSelect('contrat', 'Statut / contrat visé', S(o).statuts, j.contrat)}
    ${pub ? fSelect('typeRecrut', 'Voie de recrutement', RECRUT_PUBLIC, j.typeRecrut) : ''}${fSelect('statut', 'Statut de l\'offre', ['Ouvert', 'Pourvu', 'Suspendu', 'Annulé'], j.statut)}${fInput('ouvert', 'Date d\'ouverture', j.ouvert, { type: 'date' })}
    ${pub ? `<label class="row full" style="font-weight:500"><input type="checkbox" name="vacance" ${j.vacance ? 'checked' : ''}> Déclaration de vacance d'emploi publiée</label>` : ''}${fText('description', 'Fiche de poste : missions, compétences, conditions', j.description)}</div>`,
    danger: !isNew ? { label: 'Supprimer', onClick: () => { mutate((x) => { x.jobs = x.jobs.filter((y) => y.id !== j.id); x.candidates = x.candidates.filter((c) => c.jobId !== j.id); }); location.hash = '#/recruitment'; } } : null,
    onSubmit(fd) { if (!fd.titre) throw new Error('Intitulé obligatoire'); let id = j.id;
      mutate((x) => { if (isNew) { id = uid(); x.jobs.push({ id, ...fd }); journal(x, `Offre créée : ${fd.titre}`); } else Object.assign(x.jobs.find((y) => y.id === j.id), fd); });
      location.hash = '#/recruitment/' + id; router.run(); } });
}

function jobPipeline(o, jobId) {
  const j = o.jobs.find((x) => x.id === jobId); if (!j) return view.recruitment();
  const cs = o.candidates.filter((c) => c.jobId === j.id);
  main.innerHTML = page(esc(j.titre), `${esc(j.service)} · ${esc(j.contrat)}${j.typeRecrut ? ' · ' + esc(j.typeRecrut) : ''} · ${j.statut}`, `<a class="btn" href="#/recruitment">← Offres</a><button class="btn" id="ej">Modifier</button><button class="btn primary" id="nc">+ Candidat</button>`) + `
    ${isPublic(o) && !j.vacance && /Mutation|Lauréat|Détachement|Contractuel/.test(j.typeRecrut) ? '<div class="alert warn">La déclaration de vacance d\'emploi n\'est pas cochée : elle est obligatoire avant la nomination sur un emploi permanent.</div>' : ''}
    ${j.description ? `<div class="card"><h3>Fiche de poste</h3><p style="white-space:pre-wrap">${esc(j.description)}</p></div>` : ''}
    <div class="kanban" style="margin-top:14px">${STAGES.map((s) => `<div class="col" data-col="${s}"><h4><span>${s}</span><span>${cs.filter((c) => c.etape === s).length}</span></h4>${cs.filter((c) => c.etape === s).map((c) => `<div class="tcard" data-c="${c.id}"><div class="t">${esc(c.nom)}</div><div class="meta"><span>${esc(c.source)}</span>${c.note ? `<span>${'★'.repeat(Number(c.note))}</span>` : ''}${c.empId ? '<span class="badge ok">dossier créé</span>' : ''}</div></div>`).join('')}</div>`).join('')}</div>
    <p class="muted">Glissez les cartes d'une étape à l'autre (ou ouvrez une carte pour changer d'étape). Passer un candidat en « Recruté » crée son dossier et son parcours d'intégration.</p>`;
  $('#ej').onclick = () => jobForm(o, j);
  $('#nc').onclick = () => candidateForm(o, j);
  $$('.tcard').forEach((c) => { c.draggable = true; c.ondragstart = (ev) => ev.dataTransfer.setData('text/plain', c.dataset.c); c.onclick = () => candidateForm(o, j, o.candidates.find((x) => x.id === c.dataset.c)); });
  $$('.col').forEach((col) => { col.ondragover = (ev) => { ev.preventDefault(); col.classList.add('over'); }; col.ondragleave = () => col.classList.remove('over'); col.ondrop = (ev) => { ev.preventDefault(); moveCandidate(ev.dataTransfer.getData('text/plain'), col.dataset.col); jobPipeline(org(), jobId); }; });
  after();
}
function moveCandidate(cid, etape) {
  mutate((x) => {
    const c = x.candidates.find((y) => y.id === cid); if (!c || c.etape === etape) return; c.etape = etape;
    const j = x.jobs.find((y) => y.id === c.jobId);
    if (etape === 'Recruté' && !c.empId) {
      const [prenom, ...rest] = c.nom.trim().split(/\s+/);
      const pub = x.sector === 'public';
      const statut = SECTORS[x.sector].statuts.includes(j.contrat) ? j.contrat : SECTORS[x.sector].statuts[0];
      const e = newEmp(x, { prenom, nom: rest.join(' ') || '?', email: c.email, service: j.service, poste: j.titre, statut, entree: addDays(todayISO(), 14), finContrat: /CDD/.test(statut) ? addDays(todayISO(), 194) : '',
        motifCDD: /CDD/.test(statut) && pub && /remplacement|maternit/i.test(j.titre + ' ' + j.description) ? SECTORS.public.motifsCDD[0] : '' });
      x.employees.push(e); c.empId = e.id;
      x.onboardings.push({ id: uid(), empId: e.id, items: ONBOARDING[x.sector].map((t) => ({ t, done: false })) });
      j.statut = 'Pourvu';
      journal(x, `${c.nom} recruté(e) sur « ${j.titre} » — dossier et parcours d'intégration créés`);
      setTimeout(() => toast(`Dossier de ${c.nom} créé : complétez-le (dates, ${pub ? 'grade, indice' : 'salaire'}…)`, 5000), 50);
    } else journal(x, `${c.nom} → ${etape}`);
  });
}
function candidateForm(o, j, c) {
  const isNew = !c; c = c || { nom: '', email: '', source: 'Site emploi', etape: 'Candidature', note: '', commentaire: '' };
  modal({ title: isNew ? 'Nouveau candidat' : c.nom, body: `<div class="fields">${fInput('nom', 'Prénom Nom', c.nom, { req: true })}${fInput('email', 'E-mail', c.email, { type: 'email' })}
    ${fSelect('source', 'Source', ['Site emploi', 'Place de l\'emploi public', 'France Travail', 'Candidature spontanée', 'Cooptation', 'LinkedIn', 'Mobilité interne', 'Liste d\'aptitude / concours'], c.source)}${fSelect('etape', 'Étape', STAGES, c.etape)}
    ${fSelect('note', 'Évaluation', [['', '—'], ['1', '★'], ['2', '★★'], ['3', '★★★'], ['4', '★★★★'], ['5', '★★★★★']], c.note)}${fText('commentaire', 'Notes d\'entretien (faits, critères objectifs)', c.commentaire)}</div>`,
    danger: !isNew ? { label: 'Supprimer', onClick: () => { mutate((x) => { x.candidates = x.candidates.filter((y) => y.id !== c.id); }); jobPipeline(org(), j.id); } } : null,
    onSubmit(fd) { if (!fd.nom) throw new Error('Nom obligatoire');
      let cid = c.id; const etape = fd.etape;
      mutate((x) => { if (isNew) { cid = uid(); x.candidates.push({ id: cid, jobId: j.id, ...fd, etape: 'Candidature' }); } else Object.assign(x.candidates.find((y) => y.id === c.id), { ...fd, etape: c.etape }); });
      moveCandidate(cid, etape); jobPipeline(org(), j.id); } });
}

function reviewForm(o, r) {
  const pub = isPublic(o);
  modal({ title: `${r.type} ${r.annee} — ${empName(o, r.empId)}`, wide: true, body: `<div class="fields">${fSelect('managerId', 'Évaluateur', [['', '—'], ...o.employees.filter(isActive).map((e) => [e.id, e.prenom + ' ' + e.nom])], r.managerId)}${fInput('date', 'Date de l\'entretien', r.date, { type: 'date' })}
    ${fSelect('statut', 'Statut', ['À planifier', 'Planifié', 'Réalisé', 'Signé', 'Recours'], r.statut, { full: true })}
    ${fText('bilan', pub ? 'Résultats professionnels obtenus et manière de servir' : (/professionnel/i.test(r.type) ? 'Parcours depuis le dernier entretien (formations, certifications, évolutions)' : 'Bilan de l\'année'), r.bilan)}
    ${fText('objectifs', 'Objectifs pour l\'année à venir', r.objectifs)}${fText('formation', 'Besoins de formation', r.formation)}${fText('evolution', 'Perspectives d\'évolution professionnelle', r.evolution)}
    ${fText('avisAgent', pub ? 'Observations de l\'agent' : 'Commentaires du salarié', r.avisAgent)}</div>`,
    onSubmit(fd) { mutate((x) => { Object.assign(x.reviews.find((y) => y.id === r.id), fd); if (fd.statut !== r.statut) journal(x, `Entretien de ${empName(x, r.empId)} : ${fd.statut}`); }); router.run(); } });
}

function trainingForm(o, t) {
  const isNew = !t; t = t || { intitule: '', type: S(o).trainingTypes[0], organisme: isPublic(o) ? 'CNFPT' : '', date: addDays(todayISO(), 30), duree: 7, cout: 0, participants: [], statut: 'Prévue' };
  modal({ title: isNew ? 'Nouvelle formation' : t.intitule, wide: true, body: `<div class="fields">${fInput('intitule', 'Intitulé', t.intitule, { req: true, full: true })}${fSelect('type', 'Type', S(o).trainingTypes, t.type)}${fInput('organisme', 'Organisme', t.organisme)}
    ${fInput('date', 'Date', t.date, { type: 'date' })}${fInput('duree', 'Durée (heures)', t.duree, { type: 'number' })}${fInput('cout', 'Coût total (€)', t.cout, { type: 'number' })}${fSelect('statut', 'Statut', ['Demandée', 'Prévue', 'Réalisée', 'Annulée'], t.statut)}
    <div class="field full"><label>Participants</label><div style="max-height:180px;overflow:auto;border:1px solid var(--line);border-radius:8px;padding:8px">${o.employees.filter(isActive).map((e) => `<label class="row" style="font-weight:500;margin:0"><input type="checkbox" name="p_${e.id}" ${t.participants.includes(e.id) ? 'checked' : ''}> ${esc(e.prenom + ' ' + e.nom)}</label>`).join('')}</div></div></div>`,
    danger: !isNew ? { label: 'Supprimer', onClick: () => { mutate((x) => { x.trainings = x.trainings.filter((y) => y.id !== t.id); }); view.training(); } } : null,
    onSubmit(fd) { if (!fd.intitule) throw new Error('Intitulé obligatoire');
      const participants = Object.keys(fd).filter((k) => k.startsWith('p_') && fd[k] === true).map((k) => k.slice(2));
      const data = { intitule: fd.intitule, type: fd.type, organisme: fd.organisme, date: fd.date, duree: Number(fd.duree) || 0, cout: Number(fd.cout) || 0, statut: fd.statut, participants };
      mutate((x) => { if (isNew) { x.trainings.push({ id: uid(), ...data }); journal(x, `Formation ajoutée : ${data.intitule}`); } else Object.assign(x.trainings.find((y) => y.id === t.id), data); }); view.training(); } });
}

function payslipHTML(o, e) {
  const p = payslip(o, e);
  return `<div class="card"><h3>Bulletin simplifié (mensuel)</h3><table>${p.lines.filter((l) => l[2]).map(([l, d, v]) => `<tr><td>${l}<br><small class="muted">${esc(d)}</small></td><td style="text-align:right">${fmtEur2(v)}</td></tr>`).join('')}
    <tr><td><strong>Total brut</strong></td><td style="text-align:right"><strong>${fmtEur2(p.gross)}</strong></td></tr>${p.ret.map(([l, v]) => `<tr><td class="muted">− ${l}</td><td style="text-align:right">− ${fmtEur2(v)}</td></tr>`).join('')}
    <tr><td><strong>Net estimé (avant impôt)</strong></td><td style="text-align:right"><strong>${fmtEur2(p.net)}</strong></td></tr><tr><td class="muted">Coût employeur mensuel estimé</td><td style="text-align:right">${fmtEur2(p.cost)}</td></tr></table><p class="muted" style="margin-top:10px;font-size:.85rem">${esc(p.note)}</p></div>`;
}

function fillDoc(o, tpl, e) {
  const p = payslip(o, e);
  const map = { org: o.name, orgAdresse: o.adresse || '[adresse]', signataire: o.signataire || '[signataire]', ville: o.ville || '[ville]', date: fmtDate(todayISO()), civ: e.civ === 'M.' ? 'Monsieur' : 'Madame', prenom: e.prenom, nom: e.nom,
    poste: e.poste || '[poste]', categorie: e.categorie, service: e.service, statut: e.statut, grade: e.grade || '[grade]', echelon: e.echelon || '[échelon]', im: e.im || '[IM]', entree: fmtDate(e.entree), finEssai: e.finEssai ? fmtDate(e.finEssai) : '[date]',
    finContrat: e.finContrat ? fmtDate(e.finContrat) : '[date]', motifCDD: e.motifCDD || '[motif précis]', ccn: o.ccn || '[convention collective]', heures: e.heures || 35, brut: fmtEur2(p.gross) };
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => map[k] ?? '');
}
function docModal(o, docId, empId) {
  const d = DOCS[o.sector].find((x) => x.id === docId); const e = o.employees.find((x) => x.id === empId);
  modal({ title: d.t, wide: true, submit: 'Imprimer', cancel: 'Fermer', body: `<textarea id="doctext" style="min-height:420px;font-family:ui-monospace,monospace;font-size:.85rem">${esc(fillDoc(o, d.body, e))}</textarea><div class="row" style="margin-top:8px"><button type="button" class="btn sm" id="dl">⬇️ Télécharger (.txt)</button></div><p class="muted">Trame pédagogique : faites-la valider (juriste, CDG, convention collective) avant usage réel.</p>`,
    onOpen(f) { $('#dl', f).onclick = () => download(`${d.id}-${e.nom}.txt`, $('#doctext', f).value, 'text/plain'); },
    onSubmit(fd, f) { const w = window.open('', '_blank'); if (!w) { toast('Autorisez les fenêtres pour imprimer'); return false; } w.document.write(`<pre style="font:14px/1.6 Georgia,serif;white-space:pre-wrap;max-width:720px;margin:40px auto">${esc($('#doctext', f).value)}</pre>`); w.document.close(); w.print(); return false; } });
  mutate((x) => journal(x, `Document généré : ${d.t} (${e.prenom} ${e.nom})`));
}

/* ---------- Simulation : missions ---------- */
function missionsList() {
  const sc = SCENARIOS[mode()]; const o = org(); const done = o.sim?.done || {};
  const yearScore = (y) => sc.missions.filter((m) => m.year === y).reduce((s, m) => s + (done[m.id]?.score || 0), 0);
  return [1, 2, 3].map((y) => { const ms = sc.missions.filter((m) => m.year === y); const all = ms.every((m) => done[m.id]);
    return `<div class="card"><div class="row between"><h3>Année ${y}</h3><span>${ms.filter((m) => done[m.id]).length} / ${ms.length} · ${yearScore(y)} / ${ms.length * 10} pts</span></div>
    ${ms.map((m) => `<div class="row click" data-m="${m.id}" style="padding:10px;border-top:1px solid var(--line);cursor:pointer;flex-wrap:nowrap"><span class="badge ${done[m.id] ? (done[m.id].score >= 7 ? 'ok' : 'warn') : o.sim?.active === m.id ? 'acc' : ''}" style="min-width:56px;justify-content:center">${done[m.id] ? done[m.id].score + '/10' : m.kind === 'action' ? '🛠️ action' : '🤔 choix'}</span><span style="flex:1"><strong>${esc(m.title)}</strong></span>${o.sim?.active === m.id && !done[m.id] ? '<span class="badge acc">en cours</span>' : ''}<span>›</span></div>`).join('')}
    ${all ? `<div class="alert ok" style="margin-top:10px">🎉 Année ${y} terminée : ${yearScore(y)} / ${ms.length * 10}. ${yearScore(y) >= ms.length * 8 ? 'Excellent travail !' : 'Relisez les débriefings des missions où vous avez perdu des points.'}</div>` : ''}</div>`; }).join('');
}
function missionView(id) {
  const sc = SCENARIOS[mode()]; const m = sc.missions.find((x) => x.id === id); if (!m) return view.simulation();
  const o = org(); const res = o.sim?.done?.[m.id];
  if (!o.sim.active || o.sim.active !== m.id) { mutate((x) => { x.sim.active = m.id; }); }
  main.innerHTML = page(`${m.kind === 'action' ? '🛠️' : '🤔'} ${esc(m.title)}`, `${esc(sc.title)} · Année ${m.year}`, '<a class="btn" href="#/simulation">← Toutes les missions</a>') + `
    <div class="card lesson"><h3>Situation</h3><p>${esc(m.story)}</p>
    ${m.kind === 'action' ? `<h3>À faire</h3><ol>${m.todo.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><div class="row"><a class="btn" href="#/${m.route}">Aller à l'écran concerné →</a><button class="btn primary" data-checkm="${m.id}">Vérifier ma mission</button></div><div id="mres" style="margin-top:12px"></div>`
      : `<h3>Que faites-vous ?</h3>${m.options.map((op, i) => `<button class="btn" data-op="${i}" style="display:block;width:100%;text-align:left;white-space:normal;margin-bottom:8px;padding:12px">${String.fromCharCode(65 + i)}. ${esc(op.t)}</button>`).join('')}<div id="mres"></div>`}
    ${res ? `<div class="alert ok" style="margin-top:12px">Mission déjà réalisée : ${res.score}/10.${m.kind === 'decision' ? ' Vous pouvez la rejouer pour améliorer votre score.' : ''}</div><div class="callout"><strong>Débriefing</strong><br>${esc(m.debrief || m.options?.find((x) => x.s === 10)?.fb || '')}</div>` : ''}</div>`;
  $$('[data-op]').forEach((b) => b.onclick = () => {
    const op = m.options[b.dataset.op];
    $$('[data-op]').forEach((x, i) => { x.disabled = true; x.style.background = m.options[i].s === 10 ? 'var(--ok-bg)' : x === b ? 'var(--bad-bg)' : ''; });
    completeMission(m, op.s);
    $('#mres').innerHTML = `<div class="alert ${op.s >= 7 ? 'ok' : op.s >= 4 ? 'warn' : 'bad'}"><strong>${op.s}/10</strong> — ${esc(op.fb)}</div>${nextBtn(m)}`;
  });
  after();
}
function nextBtn(m) {
  const sc = SCENARIOS[mode()]; const next = sc.missions[sc.missions.indexOf(m) + 1];
  return next ? `<a class="btn primary" href="#/simulation/${next.id}">Mission suivante : ${esc(next.title)} →</a>` : '<a class="btn primary" href="#/simulation">🏁 Scénario terminé — voir le bilan</a>';
}
function completeMission(m, score) {
  const sc = SCENARIOS[mode()]; const next = sc.missions[sc.missions.indexOf(m) + 1];
  mutate((x) => { const prev = x.sim.done[m.id]?.score ?? -1; if (score > prev) x.sim.done[m.id] = { score, date: todayISO() }; x.sim.active = next ? next.id : null; journal(x, `Mission « ${m.title} » : ${score}/10`); });
}
function checkMission(id) {
  const sc = SCENARIOS[mode()]; const m = sc.missions.find((x) => x.id === id); const o = org();
  const r = m.check(o); const ok = r === true; const msg = ok ? '' : (Array.isArray(r) ? r[1] : 'Pas encore.');
  if (ok) {
    const first = !o.sim.done[m.id]; const tries = (o.sim.tries?.[m.id] || 0); const score = Math.max(6, 10 - tries);
    if (first) completeMission(m, score);
    modal({ title: '✅ Mission réussie !', submit: null, cancel: 'Fermer', body: `<p><strong>${esc(m.title)}</strong> — ${first ? score : o.sim.done[m.id].score}/10${tries ? ` (${tries} vérification(s) infructueuse(s) avant)` : ''}</p><div class="callout"><strong>Débriefing</strong><br>${esc(m.debrief)}</div>${nextBtn(m)}` });
    $$('.modal a.btn').forEach((a) => a.addEventListener('click', () => $('.modal-bg')?.remove()));
  } else {
    mutate((x) => { x.sim.tries = x.sim.tries || {}; x.sim.tries[m.id] = (x.sim.tries[m.id] || 0) + 1; });
    const el = $('#mres'); const html = `<div class="alert warn">Pas encore : ${esc(msg)}</div>`;
    if (el) el.innerHTML = html; else toast('Pas encore : ' + msg, 4000);
  }
}

const guard = (fn) => (...a) => { if (!auth.current() || !document.getElementById('main')) return; ME = auth.current(); main = $('#main'); fn(...a); };
const router = makeRouter(Object.fromEntries(Object.entries(view).map(([k, fn]) => [k, guard(fn)])), guard(() => (ME.role === 'salarie' && !inSim() ? view.me() : view.dash())));
window.addEventListener('hashchange', () => { if (!auth.current()) boot(); });
boot();
