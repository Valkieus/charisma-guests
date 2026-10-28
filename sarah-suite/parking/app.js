/* Garé Gratuit — trouver des places de parking gratuites en Île-de-France.
   Données : OpenStreetMap (API Overpass), adresses : Base Adresse Nationale (api-adresse.data.gouv.fr). */
const store = makeStore('gare:');
const toggleTheme = themeToggle(store);
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
const IDF = { s: 48.12, n: 49.24, w: 1.44, e: 3.56 };
const COLORS = { free: '#16a34a', cond: '#0891b2', unknown: '#d97706', street: '#16a34a', fav: '#db2777' };
const DEFAULT = { lat: 48.8566, lon: 2.3522, label: 'Paris — Hôtel de Ville' };
let map, layer, center = store.get('center', DEFAULT), radius = store.get('radius', 1000), spots = [], selected = null;
const filters = store.get('filters', { unknown: true, street: true, publicOnly: false, pmr: false, ev: false, covered: false, nolimit: false });
const favs = () => store.get('favs', {});

/* ---------- Données OSM ---------- */
function buildQuery(lat, lon, r) {
  const a = `(around:${r},${lat},${lon})`;
  return `[out:json][timeout:25];
nwr["amenity"="parking"]${a}->.p;
.p out tags center;
(way["parking:both:fee"="no"]${a};way["parking:left:fee"="no"]${a};way["parking:right:fee"="no"]${a};way["parking:lane:both:fee"="no"]${a};)->.s;
.s out tags geom;`;
}
async function overpass(q) {
  let last;
  for (const url of OVERPASS) {
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 30000);
      const r = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ctl.signal });
      clearTimeout(t);
      if (r.ok) return await r.json();
      last = new Error('Serveur ' + r.status);
    } catch (e) { last = e; }
  }
  throw last || new Error('Serveurs de données injoignables');
}

/* Classement d'un parking selon ses étiquettes OSM */
function classify(tags) {
  const fee = (tags.fee || '').toLowerCase();
  if (fee === 'no') return tags['fee:conditional'] ? 'cond' : 'free';
  if (fee === 'yes' || /\d/.test(fee)) return /no\s*@/.test(tags['fee:conditional'] || '') ? 'cond' : 'paid';
  if (!fee) return 'unknown';
  return 'unknown';
}
const ACCESS = { customers: 'Clients uniquement', private: 'Privé', permissive: 'Toléré', yes: 'Public', public: 'Public', destination: 'Riverains / visiteurs', permit: 'Sur autorisation', residents: 'Résidents' };
const TYPES = { surface: 'En surface', underground: 'Souterrain', 'multi-storey': 'Parking à étages', street_side: 'Bord de rue', lane: 'Sur voirie', rooftop: 'Toit', carports: 'Abrités' };
function dist(a, b) { const R = 6371000, toR = Math.PI / 180, dLa = (b.lat - a.lat) * toR, dLo = (b.lon - a.lon) * toR; const x = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); }
const fmtDist = (m) => m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`;

function toSpots(data) {
  const out = [];
  for (const el of data.elements || []) {
    const t = el.tags || {};
    if (t.amenity === 'parking') {
      const pos = el.type === 'node' ? { lat: el.lat, lon: el.lon } : el.center; if (!pos) continue;
      const kind = classify(t); if (kind === 'paid') continue;
      out.push({ id: el.type + '/' + el.id, kind, street: false, pos, tags: t,
        name: t.name || (t.park_ride && t.park_ride !== 'no' ? 'Parking relais' : t.parking === 'street_side' ? 'Places en bord de rue' : 'Parking'),
        capacity: Number(t.capacity) || null, pmr: Number(t['capacity:disabled']) > 0 || t['capacity:disabled'] === 'yes', ev: Number(t['capacity:charging']) > 0 || t['capacity:charging'] === 'yes' || !!t.charging_station,
        covered: ['underground', 'multi-storey', 'carports'].includes(t.parking) || t.covered === 'yes', access: t.access || 'yes', maxstay: t.maxstay || '', hours: t.opening_hours || '',
        cond: t['fee:conditional'] || '', parkride: t.park_ride && t.park_ride !== 'no', type: TYPES[t.parking] || '' });
    } else if (el.type === 'way' && el.geometry) {
      const g = el.geometry; const mid = g[Math.floor(g.length / 2)];
      const sides = ['both', 'left', 'right'].filter((s) => t[`parking:${s}:fee`] === 'no' || t[`parking:lane:${s}:fee`] === 'no');
      const stay = t['parking:both:maxstay'] || t['parking:left:maxstay'] || t['parking:right:maxstay'] || '';
      const restr = t['parking:both:restriction'] || t['parking:left:restriction'] || t['parking:right:restriction'] || '';
      out.push({ id: 'way/' + el.id, kind: 'street', street: true, pos: { lat: mid.lat, lon: mid.lon }, geom: g.map((p) => [p.lat, p.lon]), tags: t,
        name: t.name ? `Rue : ${t.name}` : 'Stationnement gratuit sur rue', capacity: null, pmr: false, ev: false, covered: false, access: 'yes', maxstay: stay,
        hours: '', cond: restr === 'disc' || /disc/.test(stay) ? 'Zone bleue : disque obligatoire' : '', type: sides.includes('both') ? 'Des deux côtés' : sides.length ? 'Un côté de la rue' : 'Sur voirie' });
    }
  }
  out.forEach((s) => { s.d = dist(center, s.pos); });
  return out.sort((a, b) => a.d - b.d);
}

/* ---------- Filtres ---------- */
function visible() {
  return spots.filter((s) => {
    if (s.kind === 'unknown' && !filters.unknown) return false;
    if (s.street && !filters.street) return false;
    if (filters.publicOnly && ['customers', 'private', 'permit', 'residents'].includes(s.access)) return false;
    if (filters.pmr && !s.pmr) return false;
    if (filters.ev && !s.ev) return false;
    if (filters.covered && !s.covered) return false;
    if (filters.nolimit && s.maxstay && s.maxstay !== 'no') return false;
    return true;
  });
}
const kindLabel = (s) => s.street ? ['Gratuit sur rue', 'ok'] : s.kind === 'free' ? ['Gratuit', 'ok'] : s.kind === 'cond' ? ['Gratuit sous conditions', 'info'] : ['Tarif non renseigné', 'warn'];
const color = (s) => favs()[s.id] ? COLORS.fav : COLORS[s.kind];

/* ---------- Rendu ---------- */
function popupHTML(s) {
  const [lab, cls] = kindLabel(s); const f = favs()[s.id];
  const rows = [s.type, s.capacity ? `${s.capacity} places` : '', s.access && s.access !== 'yes' ? (ACCESS[s.access] || s.access) : '', s.maxstay && s.maxstay !== 'no' ? `Durée max. : ${s.maxstay}` : '', s.hours ? `Horaires : ${s.hours}` : '', s.cond ? `Conditions : ${s.cond}` : '', s.pmr ? '♿ Places PMR' : '', s.ev ? '⚡ Recharge électrique' : '', s.parkride ? '🚆 Parking relais (P+R)' : ''].filter(Boolean);
  return `<h4>${esc(s.name)}</h4><span class="badge ${cls}">${lab}</span> <small>${fmtDist(s.d)}</small><div style="margin:6px 0">${rows.map((r) => `<div>${esc(r)}</div>`).join('')}</div>
    <div class="row" style="gap:6px"><a class="btn sm primary" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${s.pos.lat},${s.pos.lon}">Itinéraire</a><a class="btn sm" target="_blank" rel="noopener" href="https://waze.com/ul?ll=${s.pos.lat},${s.pos.lon}&navigate=yes">Waze</a>
    <button class="btn sm" data-fav="${s.id}">${f ? '★ Favori' : '☆ Favori'}</button></div>
    <small class="muted" style="display:block;margin-top:6px">Source : OpenStreetMap (${esc(s.id)}). Vérifiez toujours la signalisation sur place.</small>`;
}
function draw() {
  const list = visible();
  layer.clearLayers();
  L.circle([center.lat, center.lon], { radius, color: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4f46e5', weight: 1, fillOpacity: 0.04, interactive: false }).addTo(layer);
  L.circleMarker([center.lat, center.lon], { radius: 7, color: '#fff', weight: 3, fillColor: '#2563eb', fillOpacity: 1 }).addTo(layer).bindTooltip(esc(center.label));
  list.forEach((s) => {
    const m = s.street ? L.polyline(s.geom, { color: color(s), weight: 6, opacity: 0.85 }) : L.circleMarker([s.pos.lat, s.pos.lon], { radius: s.capacity > 100 ? 10 : 8, color: '#fff', weight: 2, fillColor: color(s), fillOpacity: 0.95 });
    m.addTo(layer).bindPopup(popupHTML(s), { maxWidth: 300 }); m.on('click', () => select(s.id, false)); s.marker = m;
  });
  const free = list.filter((s) => s.kind !== 'unknown');
  $('#count').innerHTML = spots.length ? `<strong>${free.length}</strong> lieu(x) gratuit(s) confirmé(s)${filters.unknown ? ` · <strong>${list.length - free.length}</strong> à vérifier` : ''} dans un rayon de ${fmtDist(radius)}` : '';
  $('#list').innerHTML = list.length ? list.slice(0, 150).map((s) => { const [lab, cls] = kindLabel(s);
    return `<div class="spot ${selected === s.id ? 'sel' : ''}" data-id="${s.id}"><div class="row between" style="flex-wrap:nowrap"><h4><span class="dot" style="background:${color(s)}"></span> ${esc(s.name)}</h4><small>${fmtDist(s.d)}</small></div>
      <div class="meta"><span class="badge ${cls}">${lab}</span>${s.capacity ? `<span>${s.capacity} places</span>` : ''}${s.type ? `<span>${esc(s.type)}</span>` : ''}${s.access && s.access !== 'yes' ? `<span>${esc(ACCESS[s.access] || s.access)}</span>` : ''}${s.maxstay && s.maxstay !== 'no' ? `<span>⏱ ${esc(s.maxstay)}</span>` : ''}${s.pmr ? '<span>♿</span>' : ''}${s.ev ? '<span>⚡</span>' : ''}${s.parkride ? '<span>🚆 P+R</span>' : ''}${favs()[s.id] ? '<span>★</span>' : ''}</div></div>`; }).join('')
    : spots.length ? '<div class="empty">Aucun résultat avec ces filtres. Élargissez le rayon ou retirez un filtre.</div>' : '';
  $$('.spot').forEach((el) => el.onclick = () => select(el.dataset.id, true));
}
function select(id, fly) {
  selected = id; const s = spots.find((x) => x.id === id); if (!s) return;
  $$('.spot').forEach((el) => el.classList.toggle('sel', el.dataset.id === id));
  if (fly) { $('.pk-body').classList.add('show-map'); setTab('map'); map.invalidateSize(); map.setView([s.pos.lat, s.pos.lon], Math.max(map.getZoom(), 17)); s.marker?.openPopup(); }
}
function setTab(t) { $$('.tabbar button').forEach((b) => b.classList.toggle('on', b.dataset.t === t)); $('.pk-body').classList.toggle('show-map', t === 'map'); if (t === 'map') setTimeout(() => map.invalidateSize(), 50); }

async function search() {
  const inIDF = center.lat > IDF.s && center.lat < IDF.n && center.lon > IDF.w && center.lon < IDF.e;
  $('#status').innerHTML = `<div class="loading"><span class="spin"></span> Recherche des places gratuites autour de « ${esc(center.label)} »…</div>`;
  $('#list').innerHTML = ''; $('#count').innerHTML = '';
  map.setView([center.lat, center.lon], radius > 1500 ? 14 : radius > 700 ? 15 : 16);
  try {
    const data = await overpass(buildQuery(center.lat, center.lon, radius));
    spots = toSpots(data);
    $('#status').innerHTML = inIDF ? '' : '<div class="alert warn">Ce lieu est hors Île-de-France : l\'appli fonctionne quand même, mais elle est pensée pour l\'IDF.</div>';
    if (!spots.length) $('#status').innerHTML += '<div class="alert">Aucune place gratuite référencée ici. Essayez un rayon plus grand, ou consultez les règles locales ci-dessous.</div>';
    draw();
    store.set('center', center); store.set('radius', radius);
  } catch (e) {
    spots = []; draw();
    $('#status').innerHTML = `<div class="alert bad">Impossible de joindre les serveurs de données (${esc(e.message || e)}). Vérifiez la connexion et réessayez dans un instant. <button class="btn sm" id="retry">Réessayer</button></div>`;
    $('#retry').onclick = search;
  }
}

/* ---------- Adresse et position ---------- */
let sTimer;
async function suggest(q) {
  if (q.trim().length < 3) { $('#sugg').hidden = true; return; }
  try {
    const r = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=6&lat=48.85&lon=2.35`);
    const d = await r.json(); const fs = d.features || [];
    $('#sugg').innerHTML = fs.map((f, i) => `<button type="button" data-i="${i}">${esc(f.properties.label)}<br><small class="muted">${esc(f.properties.context || '')}</small></button>`).join('');
    $('#sugg').hidden = !fs.length;
    $$('#sugg button').forEach((b) => b.onclick = () => { const f = fs[b.dataset.i]; center = { lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], label: f.properties.label }; $('#q').value = f.properties.label; $('#sugg').hidden = true; search(); });
  } catch { $('#sugg').hidden = true; }
}
function locate() {
  if (!navigator.geolocation) return toast('Géolocalisation indisponible sur cet appareil.');
  $('#status').innerHTML = '<div class="loading"><span class="spin"></span> Localisation en cours…</div>';
  navigator.geolocation.getCurrentPosition((p) => { center = { lat: p.coords.latitude, lon: p.coords.longitude, label: 'Ma position' }; $('#q').value = ''; search(); },
    () => { $('#status').innerHTML = '<div class="alert warn">Position refusée ou indisponible. Tapez une adresse à la place.</div>'; }, { enableHighAccuracy: true, timeout: 12000 });
}

/* ---------- Page ---------- */
const RULES = `<details class="card"><summary><strong>📘 Les règles à connaître en Île-de-France</strong></summary><div class="lesson" style="margin-top:10px">
<ul><li><strong>Paris</strong> : le stationnement sur voirie est en général payant du lundi au samedi de 9 h à 20 h, et gratuit les dimanches et jours fériés. Les deux-roues motorisés paient aussi depuis 2022. Vérifiez toujours l'horodateur ou l'appli de paiement.</li>
<li><strong>Petite et grande couronne</strong> : chaque commune fixe ses règles. Beaucoup ont des <strong>zones bleues</strong> (gratuit, durée limitée, disque européen obligatoire) et des rues gratuites hors centre-ville.</li>
<li><strong>Parkings relais (P+R) d'Île-de-France Mobilités</strong> : souvent gratuits ou à tarif réduit pour les abonnés Navigo, à condition de prendre les transports.</li>
<li><strong>Parkings de grandes surfaces</strong> : gratuits mais souvent réservés aux clients, avec une durée limitée et des horaires.</li>
<li>Un stationnement gênant ou très gênant (passage piéton, place PMR sans carte, livraison, trottoir) est verbalisé même dans une rue gratuite.</li></ul>
<p class="muted">Les données viennent d'OpenStreetMap, une carte collaborative : elles peuvent être incomplètes. « Tarif non renseigné » signifie que personne n'a encore indiqué si c'est gratuit. La signalisation sur place fait foi.</p></div></details>`;

function boot() {
  document.body.innerHTML = `<div class="pk"><header class="pk-head"><div class="brand"><span class="logo">P</span>Garé Gratuit <small class="muted" style="font-weight:500">IDF</small></div>
    <form class="pk-search" id="sf" autocomplete="off"><input id="q" placeholder="Adresse, gare, ville… (ex. Gare de Saint-Denis)" aria-label="Adresse"><button class="btn primary">Chercher</button><button type="button" class="btn" id="loc" title="Autour de moi">📍</button><div class="sugg" id="sugg" hidden></div></form>
    <button class="btn sm" id="th" aria-label="Changer de thème">🌓</button></header>
    <div class="pk-body"><aside class="pk-side">
      <div class="row between"><label for="rad" style="margin:0">Rayon : <strong id="radv">${fmtDist(radius)}</strong></label><input id="rad" type="range" min="300" max="3000" step="100" value="${radius}" style="width:55%"></div>
      <div class="filters">${[['unknown', 'Inclure « à vérifier »'], ['street', 'Rues gratuites'], ['publicOnly', 'Accès public uniquement'], ['nolimit', 'Sans limite de durée'], ['covered', 'Couvert'], ['pmr', '♿ PMR'], ['ev', '⚡ Recharge']].map(([k, l]) => `<button class="chip ${filters[k] ? 'on' : ''}" data-f="${k}">${l}</button>`).join('')}</div>
      <div class="legend"><span><i class="dot" style="background:${COLORS.free}"></i>Gratuit</span><span><i class="dot" style="background:${COLORS.cond}"></i>Sous conditions</span><span><i class="dot" style="background:${COLORS.unknown}"></i>À vérifier</span><span><i class="dot" style="background:${COLORS.fav}"></i>Favori</span></div>
      <div id="status"></div><div id="count"></div><div id="list" class="stack"></div>
      <div class="card"><div class="row between"><strong>★ Mes favoris</strong></div><div id="favs"></div></div>${RULES}
      <p class="muted" style="font-size:.78rem">Carte © contributeurs <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · Adresses : Base Adresse Nationale.</p>
    </aside><div id="map" role="region" aria-label="Carte"></div></div>
    <div class="tabbar"><button data-t="list" class="on">☰ Liste</button><button data-t="map">🗺️ Carte</button></div></div>`;
  map = L.map('map', { zoomControl: true }).setView([center.lat, center.lon], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '© OpenStreetMap France | © contributeurs OSM' }).addTo(map);
  layer = L.layerGroup().addTo(map);
  map.on('popupopen', (e) => { const b = e.popup.getElement().querySelector('[data-fav]'); if (b) b.onclick = () => toggleFav(b.dataset.fav); });
  map.on('contextmenu', (e) => { center = { lat: e.latlng.lat, lon: e.latlng.lng, label: 'Point choisi sur la carte' }; search(); });
  $('#th').onclick = toggleTheme;
  $('#sf').onsubmit = async (e) => { e.preventDefault(); const q = $('#q').value.trim(); if (!q) return;
    try { const d = await (await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=1&lat=48.85&lon=2.35`)).json(); const f = d.features?.[0]; if (!f) return toast('Adresse introuvable.');
      center = { lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], label: f.properties.label }; $('#sugg').hidden = true; search(); } catch { toast('Service d\'adresses injoignable.'); } };
  $('#q').addEventListener('input', (e) => { clearTimeout(sTimer); sTimer = setTimeout(() => suggest(e.target.value), 250); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.pk-search')) $('#sugg').hidden = true; });
  $('#loc').onclick = locate;
  $('#rad').oninput = (e) => { $('#radv').textContent = fmtDist(Number(e.target.value)); };
  $('#rad').onchange = (e) => { radius = Number(e.target.value); search(); };
  $$('[data-f]').forEach((b) => b.onclick = () => { filters[b.dataset.f] = !filters[b.dataset.f]; b.classList.toggle('on'); store.set('filters', filters); draw(); });
  $$('.tabbar button').forEach((b) => b.onclick = () => setTab(b.dataset.t));
  drawFavs(); search();
}
function toggleFav(id) {
  const f = favs(); const s = spots.find((x) => x.id === id);
  if (f[id]) delete f[id]; else if (s) f[id] = { name: s.name, lat: s.pos.lat, lon: s.pos.lon, label: center.label };
  store.set('favs', f); toast(f[id] ? 'Ajouté aux favoris' : 'Retiré des favoris'); draw(); drawFavs();
}
function drawFavs() {
  const f = Object.entries(favs());
  $('#favs').innerHTML = f.length ? f.map(([id, v]) => `<div class="row between" style="padding:6px 0;border-top:1px solid var(--line);flex-wrap:nowrap"><button class="btn ghost sm" data-go="${id}" style="white-space:normal;text-align:left">${esc(v.name)}<br><small class="muted">près de ${esc(v.label)}</small></button><a class="btn sm" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${v.lat},${v.lon}">Y aller</a></div>`).join('') : '<p class="muted" style="margin:6px 0 0">Touchez ☆ dans la fiche d\'un parking pour le retrouver ici.</p>';
  $$('[data-go]').forEach((b) => b.onclick = () => { const v = favs()[b.dataset.go]; center = { lat: v.lat, lon: v.lon, label: v.name }; search(); });
}
boot();
