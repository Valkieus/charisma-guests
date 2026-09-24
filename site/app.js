(function () {
  var state = { guests: [], bySlug: {} };
  var TYPE_ORDER = ["Invité externe", "Événement", "Équipe / ministère interne", "Autre / Divers"];
  var TYPE_CLASS = {
    "Invité externe": "type-invite",
    "Événement": "type-evenement",
    "Équipe / ministère interne": "type-interne",
    "Autre / Divers": "type-autre",
  };

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function typeClass(t) {
    return TYPE_CLASS[t] || "type-invite";
  }

  function computeStats(guest) {
    var docs = guest.documents || [];
    var translated = docs.filter(function (d) { return d.traduit_fr !== false; }).length;
    return { total: docs.length, translated: translated };
  }

  function renderSidebar() {
    var list = document.getElementById("sidebar-list");
    var groups = {};
    state.guests.forEach(function (g) {
      var t = g.type || "Invité externe";
      groups[t] = groups[t] || [];
      groups[t].push(g);
    });

    var html = "";
    TYPE_ORDER.forEach(function (t) {
      var items = groups[t];
      if (!items || !items.length) return;
      items.sort(function (a, b) { return a.nom.localeCompare(b.nom); });
      html += '<div class="sidebar-group" data-group>';
      html += '<div class="sidebar-group__title">' + escapeHtml(t) + "s (" + items.length + ")</div>";
      items.forEach(function (g) {
        html +=
          '<a href="#' + encodeURIComponent(g.slug) + '" class="sidebar-item" data-slug="' +
          escapeHtml(g.slug) + '" data-name="' + escapeHtml(g.nom.toLowerCase()) + '">' +
          escapeHtml(g.nom) + "</a>";
      });
      html += "</div>";
    });
    list.innerHTML = html;
  }

  function renderGuest(slug) {
    var guest = state.bySlug[slug];
    var empty = document.getElementById("app-empty");
    var content = document.getElementById("app-content");
    var sidePanel = document.getElementById("app-side-panel");

    document.querySelectorAll(".sidebar-item").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-slug") === slug);
    });

    if (!guest) {
      empty.hidden = false;
      content.hidden = true;
      sidePanel.hidden = true;
      return;
    }

    empty.hidden = true;
    content.hidden = false;
    sidePanel.hidden = false;

    var stats = computeStats(guest);
    var docs = guest.documents || [];

    var docsHtml = docs.length
      ? docs.map(function (d) {
          var translated = d.traduit_fr !== false;
          return (
            '<li class="file-card">' +
            '<a href="' + escapeHtml(d.fichier) + '" data-preview="' + escapeHtml(d.fichier) +
            '" data-preview-label="' + escapeHtml(d.label) + '">' + escapeHtml(d.label) + "</a>" +
            '<span class="badge ' + (translated ? "oui" : "non") + '">' +
            (translated ? "FR prêt" : "à traduire") + "</span>" +
            "</li>"
          );
        }).join("")
      : '<li class="empty">Aucun fichier pour l\'instant.</li>';

    content.innerHTML =
      '<div class="detail-header">' +
      "<h1>" + escapeHtml(guest.nom) + "</h1>" +
      '<span class="badge ' + typeClass(guest.type) + '">' + escapeHtml(guest.type) + "</span>" +
      '<a class="admin-edit-link" href="/admin/#/collections/invites/entries/' +
      encodeURIComponent(slug) + '" target="_blank" rel="noopener">+ Ajouter / modifier un fichier</a>' +
      "</div>" +
      (guest.notes ? '<div class="detail-note">' + escapeHtml(guest.notes) + "</div>" : "") +
      '<div class="dash">' +
      '<div class="dash-tile"><div class="dash-num">' + stats.total + '</div><div class="dash-label">fichiers</div></div>' +
      '<div class="dash-tile"><div class="dash-num">' + stats.translated + '</div><div class="dash-label">traduits en français</div></div>' +
      '<div class="dash-tile"><div class="dash-num">' + (guest.chansons || []).length + '</div><div class="dash-label">chansons référencées</div></div>' +
      "</div>" +
      '<ul class="file-list">' + docsHtml + "</ul>";

    var yts = (guest.liens_youtube || []).slice();
    (guest.chansons || []).forEach(function (c) {
      if (c.lien_youtube) yts.push({ titre: c.titre, lien: c.lien_youtube });
    });
    var collabs = guest.collaborations || [];

    sidePanel.innerHTML =
      "<h2>Chansons en ligne (YouTube)</h2>" +
      (yts.length
        ? '<ul class="yt-list">' +
          yts.map(function (y) {
            return (
              '<li><a href="' + escapeHtml(y.lien) + '" data-preview="' + escapeHtml(y.lien) +
              '" data-preview-label="' + escapeHtml(y.titre) + '">▶ ' + escapeHtml(y.titre) + "</a></li>"
            );
          }).join("") +
          "</ul>"
        : '<p class="empty">Aucun lien renseigné pour l\'instant.</p>') +
      "<h2>Featurings</h2>" +
      (collabs.length
        ? '<ul class="collab-list">' +
          collabs.map(function (c) {
            return "<li>" + (c.lien ? '<a href="' + escapeHtml(c.lien) + '">' + escapeHtml(c.nom) + "</a>" : escapeHtml(c.nom)) + "</li>";
          }).join("") +
          "</ul>"
        : '<p class="empty">Aucune collaboration renseignée.</p>');
  }

  function route() {
    var slug = decodeURIComponent(location.hash.replace(/^#/, ""));
    renderGuest(slug);
  }

  fetch("/invites.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      state.guests = data;
      data.forEach(function (g) { state.bySlug[g.slug] = g; });
      renderSidebar();
      route();
    });

  window.addEventListener("hashchange", route);

  document.addEventListener("input", function (e) {
    if (!e.target || e.target.id !== "sidebar-search") return;
    var q = e.target.value.trim().toLowerCase();
    document.querySelectorAll("[data-group]").forEach(function (group) {
      var anyVisible = false;
      group.querySelectorAll(".sidebar-item").forEach(function (a) {
        var match = !q || a.getAttribute("data-name").indexOf(q) !== -1;
        a.style.display = match ? "" : "none";
        if (match) anyVisible = true;
      });
      group.style.display = anyVisible ? "" : "none";
    });
  });
})();
