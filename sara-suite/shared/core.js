/* Outils communs aux trois applications : stockage, comptes, routage, modales. */
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);
const fmtDate = (iso) => iso ? new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtEur = (n) => (Number(n) || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const fmtEur2 = (n) => (Number(n) || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
const initials = (name) => String(name || '?').split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const pick = (a, n) => shuffle(a).slice(0, n);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* Stockage local, isolé par application (préfixe). */
function makeStore(prefix) {
  const mem = {};
  return {
    get(key, def) {
      try { const raw = localStorage.getItem(prefix + key); return raw == null ? (key in mem ? mem[key] : def) : JSON.parse(raw); }
      catch { return key in mem ? mem[key] : def; }
    },
    set(key, val) {
      mem[key] = val;
      try { localStorage.setItem(prefix + key, JSON.stringify(val)); } catch { /* stockage indisponible : on garde en mémoire */ }
    },
    del(key) { delete mem[key]; try { localStorage.removeItem(prefix + key); } catch { } },
    dump() {
      const out = {};
      try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(prefix)) out[k.slice(prefix.length)] = JSON.parse(localStorage.getItem(k)); } }
      catch { Object.assign(out, mem); }
      return out;
    },
    load(obj) { Object.entries(obj).forEach(([k, v]) => this.set(k, v)); },
    clear() { Object.keys(this.dump()).forEach((k) => this.del(k)); },
  };
}

async function hashPassword(pw, salt) {
  const data = new TextEncoder().encode(salt + '::' + pw);
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 5381; for (const b of data) h = ((h << 5) + h + b) >>> 0; return 'x' + h.toString(16);
}

/* Comptes utilisateurs (locaux au navigateur). */
function makeAuth(store) {
  return {
    users() { return store.get('users', []); },
    saveUsers(list) { store.set('users', list); },
    current() { const id = store.get('session', null); return this.users().find((u) => u.id === id) || null; },
    async create({ name, email, password, role = 'member', wsId, extra = {} }) {
      email = String(email).trim().toLowerCase();
      if (!name || !email || !password) throw new Error('Nom, e-mail et mot de passe sont obligatoires.');
      if (password.length < 6) throw new Error('Le mot de passe doit faire au moins 6 caractères.');
      if (this.users().some((u) => u.email === email)) throw new Error('Un compte existe déjà avec cet e-mail.');
      const salt = uid();
      const user = { id: uid(), name: name.trim(), email, salt, pw: await hashPassword(password, salt), role, wsId, created: todayISO(), ...extra };
      this.saveUsers([...this.users(), user]);
      return user;
    },
    async login(email, password) {
      email = String(email).trim().toLowerCase();
      const u = this.users().find((x) => x.email === email);
      if (!u || u.pw !== await hashPassword(password, u.salt)) throw new Error('E-mail ou mot de passe incorrect.');
      store.set('session', u.id);
      return u;
    },
    async setPassword(userId, password) {
      if (password.length < 6) throw new Error('Le mot de passe doit faire au moins 6 caractères.');
      const list = this.users(); const u = list.find((x) => x.id === userId); if (!u) return;
      u.salt = uid(); u.pw = await hashPassword(password, u.salt); u.mustChange = false; this.saveUsers(list);
    },
    update(userId, patch) { const list = this.users(); const u = list.find((x) => x.id === userId); if (u) Object.assign(u, patch); this.saveUsers(list); return u; },
    remove(userId) { this.saveUsers(this.users().filter((u) => u.id !== userId)); },
    logout() { store.del('session'); },
  };
}

function toast(msg, ms = 2600) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

/* Modale générique. body = HTML ; onSubmit(formData, el) peut renvoyer false pour garder ouvert. */
function modal({ title, body, submit = 'Enregistrer', cancel = 'Annuler', wide = false, onSubmit, onOpen, danger }) {
  const bg = document.createElement('div'); bg.className = 'modal-bg';
  bg.innerHTML = `<form class="modal ${wide ? 'wide' : ''}" novalidate><h2>${esc(title)}</h2><div class="mbody">${body}</div>
    <div class="actions">${danger ? `<button type="button" class="btn danger" data-danger style="margin-right:auto">${esc(danger.label)}</button>` : ''}
    ${cancel ? `<button type="button" class="btn" data-cancel>${esc(cancel)}</button>` : ''}${submit ? `<button class="btn primary">${esc(submit)}</button>` : ''}</div></form>`;
  const form = bg.querySelector('form');
  const close = () => { bg.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  bg.addEventListener('mousedown', (e) => { if (e.target === bg) close(); });
  form.querySelector('[data-cancel]')?.addEventListener('click', close);
  form.querySelector('[data-danger]')?.addEventListener('click', async () => { if (await danger.onClick() !== false) close(); });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(form).entries());
    $$('input[type=checkbox]', form).forEach((c) => { if (c.name) fd[c.name] = c.checked; });
    try { if (!onSubmit || await onSubmit(fd, form) !== false) close(); }
    catch (err) { toast(err.message || String(err)); }
  });
  document.body.appendChild(bg);
  onOpen?.(form);
  form.querySelector('input:not([type=hidden]),select,textarea')?.focus();
  return { close, form };
}
/* Confirmation intégrée à la page (les boîtes natives sont bloquées dans certains lecteurs). */
function ask(text, ok = 'Confirmer') {
  return new Promise((res) => {
    const bg = document.createElement('div'); bg.className = 'modal-bg'; bg.style.zIndex = 70;
    bg.innerHTML = `<div class="modal" role="alertdialog" style="width:min(440px,100%)"><p style="font-weight:600;margin:0">${esc(text)}</p><div class="actions"><button type="button" class="btn" data-no>Annuler</button><button type="button" class="btn primary" data-yes>${esc(ok)}</button></div></div>`;
    const done = (v) => { bg.remove(); res(v); };
    bg.querySelector('[data-no]').onclick = () => done(false);
    bg.querySelector('[data-yes]').onclick = () => done(true);
    document.body.appendChild(bg); bg.querySelector('[data-yes]').focus();
  });
}

/* Champs de formulaire */
function fInput(name, label, value = '', { type = 'text', full = false, req = false, attrs = '' } = {}) {
  return `<div class="field ${full ? 'full' : ''}"><label>${esc(label)}${req ? ' *' : ''}</label><input name="${name}" type="${type}" value="${esc(value)}" ${req ? 'required' : ''} ${attrs}></div>`;
}
function fSelect(name, label, options, value = '', { full = false } = {}) {
  const opts = options.map((o) => (typeof o === 'string' ? [o, o] : o)).map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(value) ? 'selected' : ''}>${esc(l)}</option>`).join('');
  return `<div class="field ${full ? 'full' : ''}"><label>${esc(label)}</label><select name="${name}">${opts}</select></div>`;
}
function fText(name, label, value = '', { full = true } = {}) {
  return `<div class="field ${full ? 'full' : ''}"><label>${esc(label)}</label><textarea name="${name}">${esc(value)}</textarea></div>`;
}

/* Routeur par hash : #/route/param */
function makeRouter(routes, fallback) {
  const run = () => {
    $$('.modal-bg').forEach((m) => m.remove());
    const parts = (location.hash.replace(/^#\/?/, '') || '').split('/').map(decodeURIComponent);
    const fn = routes[parts[0]] || fallback;
    fn(...parts.slice(1));
    $$('.nav a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#/' + parts[0]));
    $('.side')?.classList.remove('open');
    window.scrollTo(0, 0);
  };
  window.addEventListener('hashchange', run);
  return { run, go: (h) => { if (location.hash === h) run(); else location.hash = h; } };
}

function download(filename, content, type = 'application/json') {
  const blob = new Blob([content], { type }); const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function pickFile(accept = '.json') {
  return new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.onchange = () => { const f = i.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => res(r.result); r.readAsText(f); }; i.click(); });
}
function toCSV(rows) {
  return rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
}

/* Liens entre les trois applications de la suite */
const SUITE = [
  { id: 'pilote', name: 'Pilote — Projets', url: 'https://pilote-projets-sara.netlify.app', ico: '📋' },
  { id: 'rh', name: 'RH Studio', url: 'https://rh-studio-sara.netlify.app', ico: '🗂️' },
  { id: 'sara', name: 'Sara HR — Formation', url: 'https://sara-hr.netlify.app', ico: '🎓' },
  { id: 'parking', name: 'Garé Gratuit IDF', url: 'https://gare-gratuit-idf.netlify.app', ico: '🅿️' },
];
function suiteLinks(current) {
  return `<div class="nav"><div class="sec">La suite</div>${SUITE.filter((s) => s.id !== current).map((s) => `<a href="${s.url}" target="_blank" rel="noopener"><span class="ico">${s.ico}</span>${esc(s.name)}</a>`).join('')}</div>`;
}

function themeToggle(store) {
  const t = store.get('theme', null); if (t) document.documentElement.dataset.theme = t;
  return () => { const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); const n = cur === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = n; store.set('theme', n); };
}

/* Coquille : barre latérale + zone principale */
function shell({ brand, logo, nav, foot, current }) {
  document.body.innerHTML = `<div class="app"><aside class="side"><div class="brand"><span class="logo">${logo}</span>${esc(brand)}</div>
    <nav class="nav">${nav}</nav>${suiteLinks(current)}<div class="foot">${foot}</div></aside>
    <div><div class="topbar"><button class="btn sm" id="menuBtn" aria-label="Menu">☰</button><strong>${esc(brand)}</strong></div><main class="main" id="main"></main></div></div>`;
  $('#menuBtn').onclick = () => $('.side').classList.toggle('open');
  return $('#main');
}
function navLink(route, ico, label, extra = '') { return `<a href="#/${route}"><span class="ico">${ico}</span>${esc(label)}${extra}</a>`; }
function bar(pct, color) { return `<div class="progress"><i style="width:${clamp(pct, 0, 100)}%;${color ? 'background:' + color : ''}"></i></div>`; }
