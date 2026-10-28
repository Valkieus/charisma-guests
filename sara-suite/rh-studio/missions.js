/* Parcours de simulation : deux organisations fictives, trois années de missions chacune.
   Missions « action » : vérifiées automatiquement sur les données de la simulation.
   Missions « décision » : un choix argumenté, noté de 0 à 10. */

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const findEmp = (o, prenom, nom) => o.employees.find((e) => norm(e.prenom) === norm(prenom) && norm(e.nom) === norm(nom));
const activeEmps = (o) => o.employees.filter((e) => !e.sortie || e.sortie > todayISO());

function E(id, civ, prenom, nom, naissance, service, poste, statut, categorie, entree, extra = {}) {
  return { id, matricule: 'M' + id.slice(1).padStart(4, '0'), civ, prenom, nom, email: `${norm(prenom)}.${norm(nom).replace(/\s/g, '')}@exemple.fr`, naissance, service, poste, managerId: '', statut, categorie,
    grade: '', echelon: '', im: '', nbi: 0, ifse: 0, brut: 0, heures: 35, quotite: 100, entree, finContrat: '', finEssai: '', motifCDD: '', sortie: '', motifSortie: '', rtt: 0, enfants: 0, notes: '', ...extra };
}

const SCENARIOS = {
  lumen: {
    id: 'lumen', sector: 'prive', title: 'Atelier Lumen — PME privée', ico: '🏭',
    pitch: 'Vous êtes la nouvelle responsable RH d\'une PME de 42 salariés qui fabrique des luminaires. Trois années pour structurer la fonction RH.',
    org() {
      const y = Number(todayISO().slice(0, 4));
      const emps = [
        E('e1', 'M.', 'Antoine', 'Roux', '1971-03-12', 'Direction', 'Directeur général', 'CDI', 'Cadre', '2009-01-05', { brut: 6200 }),
        E('e2', 'Mme', 'Claire', 'Fontaine', '1984-07-22', 'Administration', 'Responsable administrative et financière', 'CDI', 'Cadre', '2014-09-01', { brut: 4100, managerId: 'e1' }),
        E('e3', 'M.', 'Karim', 'Benali', '1979-11-02', 'Production', 'Chef d\'atelier', 'CDI', 'Technicien / agent de maîtrise', '2011-04-18', { brut: 3100, managerId: 'e1' }),
        E('e4', 'Mme', 'Sophie', 'Lambert', '1990-02-15', 'Production', 'Opératrice de montage', 'CDI', 'Ouvrier', '2017-06-12', { brut: 2050, managerId: 'e3' }),
        E('e5', 'M.', 'Paul', 'Garnier', '1986-09-30', 'Production', 'Soudeur', 'CDI', 'Ouvrier', '2015-02-02', { brut: 2300, managerId: 'e3' }),
        E('e6', 'M.', 'Hugo', 'Petit', '1999-05-08', 'Production', 'Opérateur de montage', 'CDI', 'Ouvrier', '2022-10-03', { brut: 1950, managerId: 'e3' }),
        E('e7', 'Mme', 'Nadia', 'Cherif', '1993-12-01', 'Commercial', 'Chargée d\'affaires', 'CDI', 'Cadre', '2019-03-11', { brut: 3600, managerId: 'e1' }),
        E('e8', 'M.', 'Julien', 'Moreau', '1988-08-19', 'Logistique', 'Magasinier cariste', 'CDI', 'Employé', '2016-01-04', { brut: 2100, managerId: 'e3' }),
        E('e9', 'Mme', 'Emma', 'Girard', '2003-04-27', 'Commercial', 'Assistante commerciale (alternance)', 'Apprentissage', 'Employé', `${y - 1}-09-02`, { brut: 1100, managerId: 'e7', finContrat: `${y + 1}-08-31` }),
        E('e10', 'M.', 'Thomas', 'Leroy', '1975-06-03', 'Production', 'Technicien de maintenance', 'CDI', 'Technicien / agent de maîtrise', '2008-05-05', { brut: 2900, managerId: 'e3', notes: 'Départ en retraite envisagé.' }),
        E('e11', 'Mme', 'Léonie', 'Bernard', '1995-10-10', 'Administration', 'Comptable', 'CDI', 'Employé', '2020-11-16', { brut: 2400, managerId: 'e2' }),
        E('e12', 'M.', 'Mathis', 'Fournier', '1997-01-21', 'Production', 'Opérateur de montage', 'CDD', 'Ouvrier', addDays(todayISO(), -40), { brut: 1900, managerId: 'e3', finContrat: addDays(todayISO(), 50), motifCDD: 'Accroissement temporaire d\'activité', finEssai: addDays(todayISO(), -26) }),
      ];
      const t = todayISO();
      return {
        name: 'Atelier Lumen (simulation)', sector: 'prive', versant: 'FPT', ccn: '', ville: 'Villeurbanne', adresse: '12 rue des Artisans, 69100 Villeurbanne', signataire: 'Antoine Roux, directeur général',
        effectifDeclare: 42, services: ['Direction', 'Administration', 'Production', 'Commercial', 'Logistique'], employees: emps,
        absences: [
          { id: 'a1', empId: 'e4', type: 'Congés payés', debut: addDays(t, 20), fin: addDays(t, 33), statut: 'demandee', motif: 'Vacances d\'été', jours: 0 },
          { id: 'a2', empId: 'e5', type: 'Congés payés', debut: addDays(t, 22), fin: addDays(t, 35), statut: 'demandee', motif: '', jours: 0 },
          { id: 'a3', empId: 'e6', type: 'Congés payés', debut: addDays(t, 24), fin: addDays(t, 28), statut: 'demandee', motif: 'Mariage d\'un ami', jours: 0 },
        ],
        jobs: [], candidates: [], onboardings: [], campaigns: [], reviews: [], trainings: [], projects: [], compliance: {}, journal: [],
      };
    },
    missions: [
      { id: 'l1', year: 1, kind: 'action', title: 'Faire connaissance avec l\'entreprise', route: 'settings',
        story: 'Premier jour. Le directeur vous demande : « Au fait, quelle est notre convention collective ? On ne l\'a jamais vraiment regardée. » Une PME qui fabrique des luminaires relève de la métallurgie.',
        todo: ['Ouvrez Paramètres de l\'organisation.', 'Renseignez la convention collective : « Convention collective nationale de la métallurgie (IDCC 3248) ».'],
        check: (o) => /metallurgie/.test(norm(o.ccn)) || /3248/.test(o.ccn),
        debrief: 'La convention collective (CCN) complète le Code du travail : salaires minima, classifications, préavis, primes. Elle figure sur le bulletin de paie et doit être affichée. Depuis 2024, la métallurgie a une convention nationale unique (IDCC 3248).' },
      { id: 'l2', year: 1, kind: 'action', title: 'Embaucher Léa Martin en CDD', route: 'employees',
        story: 'Une grosse commande arrive : il faut une opératrice de montage pendant 6 mois. Vous embauchez Léa Martin à partir de la semaine prochaine.',
        todo: ['Créez la fiche de Léa Martin (statut CDD, catégorie Ouvrier, service Production).', 'Motif : accroissement temporaire d\'activité.', 'Date de fin de contrat : environ 6 mois après l\'entrée.', 'Période d\'essai conforme : pour un CDD de 6 mois maximum, 1 jour par semaine dans la limite de 2 semaines.'],
        check(o) {
          const e = findEmp(o, 'Léa', 'Martin'); if (!e) return [false, 'Fiche de Léa Martin introuvable.'];
          if (e.statut !== 'CDD') return [false, 'Le statut doit être CDD.'];
          if (!/accroissement/.test(norm(e.motifCDD))) return [false, 'Le motif du CDD doit être l\'accroissement temporaire d\'activité.'];
          if (!e.finContrat || !e.entree) return [false, 'Dates d\'entrée et de fin de contrat obligatoires.'];
          const dur = daysBetween(e.entree, e.finContrat); if (dur > 200) return [false, 'Le contrat doit durer environ 6 mois.'];
          if (!e.finEssai) return [false, 'Renseignez la fin de période d\'essai.'];
          if (daysBetween(e.entree, e.finEssai) > 14) return [false, 'Période d\'essai trop longue : 2 semaines maximum pour un CDD de 6 mois ou moins.'];
          return true;
        },
        debrief: 'Un CDD doit toujours être écrit, avec un motif précis, et remis au salarié dans les 2 jours ouvrables. Durée maximale en principe 18 mois renouvellements compris (2 renouvellements). Essai : 1 jour par semaine, plafonné à 2 semaines (CDD ≤ 6 mois) ou 1 mois (au-delà). En fin de contrat : indemnité de précarité de 10 % sauf exceptions.' },
      { id: 'l3', year: 1, kind: 'action', title: 'Préparer l\'arrivée de Léa', route: 'onboarding',
        story: 'Léa arrive lundi. Le chef d\'atelier vous dit : « On verra la paperasse plus tard. » Mauvaise idée : une démarche doit être faite AVANT l\'embauche.',
        todo: ['Créez un parcours d\'intégration pour Léa Martin.', 'Cochez la DPAE comme effectuée.', 'Cochez aussi « Contrat de travail signé ».'],
        check(o) {
          const e = findEmp(o, 'Léa', 'Martin'); if (!e) return [false, 'Créez d\'abord la fiche de Léa (mission précédente).'];
          const ob = o.onboardings.find((x) => x.empId === e.id); if (!ob) return [false, 'Aucun parcours d\'intégration pour Léa.'];
          if (!ob.items.some((i) => /dpae/.test(norm(i.t)) && i.done)) return [false, 'La DPAE n\'est pas cochée.'];
          if (!ob.items.some((i) => /contrat/.test(norm(i.t)) && i.done)) return [false, 'Le contrat n\'est pas coché.'];
          return true;
        },
        debrief: 'La DPAE (déclaration préalable à l\'embauche) se fait auprès de l\'URSSAF dans les 8 jours précédant l\'embauche, au plus tard au moment de la prise de poste. Sans DPAE : risque de travail dissimulé. Pensez aussi au registre unique du personnel et à la visite d\'information et de prévention (dans les 3 mois).' },
      { id: 'l4', year: 1, kind: 'action', title: 'Les congés d\'été', route: 'absences',
        story: 'Trois opérateurs de production demandent des congés sur la même période. L\'atelier ne peut pas fonctionner sans au moins un monteur expérimenté.',
        todo: ['Ouvrez Absences & congés.', 'Traitez les trois demandes en attente (validez ou refusez chacune).', 'Gardez au moins une demande refusée ou décalée pour assurer la continuité.'],
        check(o) {
          const pending = o.absences.filter((a) => ['a1', 'a2', 'a3'].includes(a.id) && a.statut === 'demandee'); if (pending.length) return [false, `${pending.length} demande(s) encore en attente.`];
          const ok = o.absences.filter((a) => ['a1', 'a2', 'a3'].includes(a.id) && a.statut === 'validee').length; if (ok === 3) return [false, 'Les trois sont validées : l\'atelier serait sans monteur ! Refusez-en une (vous pourrez proposer d\'autres dates).'];
          return true;
        },
        debrief: 'L\'employeur fixe la période de prise des congés (elle inclut toujours la période du 1er mai au 31 octobre) et l\'ordre des départs, après avis du CSE, en tenant compte de la situation de famille et de l\'ancienneté. Les dates ne peuvent plus être modifiées moins d\'un mois avant le départ, sauf circonstances exceptionnelles.' },
      { id: 'l5', year: 1, kind: 'decision', title: 'Faut-il un CSE ?',
        story: 'Le directeur : « On a 42 salariés, mais on n\'a jamais eu de délégués. On est obligés ? »',
        options: [
          { t: 'Non, le CSE n\'est obligatoire qu\'à partir de 50 salariés.', s: 0, fb: 'Faux : 50 est le seuil des attributions élargies du CSE, pas de sa mise en place.' },
          { t: 'Oui : dès 11 salariés pendant 12 mois consécutifs, il faut organiser les élections du CSE. Sans candidat, on établit un procès-verbal de carence.', s: 10, fb: 'Exact. L\'absence de CSE expose l\'employeur au délit d\'entrave et empêche certaines procédures (ex. consultations obligatoires).' },
          { t: 'Oui, mais seulement si un salarié le demande.', s: 4, fb: 'Partiellement : un salarié ou un syndicat peut demander l\'organisation des élections, mais l\'obligation existe même sans demande.' },
        ] },
      { id: 'l6', year: 2, kind: 'action', title: 'Remplacer le technicien de maintenance', route: 'recruitment',
        story: 'Thomas Leroy part à la retraite dans 4 mois. Personne d\'autre ne sait réparer les machines : c\'est un métier critique.',
        todo: ['Créez une offre « Technicien de maintenance ».', 'Ajoutez au moins 3 candidats.', 'Faites avancer un candidat jusqu\'à « Recruté » (sa fiche salarié sera créée automatiquement).'],
        check(o) {
          const j = o.jobs.find((x) => /maintenance/.test(norm(x.titre))); if (!j) return [false, 'Aucune offre « maintenance ».'];
          const cs = o.candidates.filter((c) => c.jobId === j.id); if (cs.length < 3) return [false, `${cs.length} candidat(s) sur 3 minimum.`];
          if (!cs.some((c) => c.etape === 'Recruté')) return [false, 'Aucun candidat recruté.'];
          return true;
        },
        debrief: 'Anticiper les départs (pyramide des âges) est le cœur de la GEPP (gestion des emplois et des parcours professionnels). Un tuilage de quelques semaines entre l\'ancien et le nouveau technicien permet de transmettre le savoir-faire.' },
      { id: 'l7', year: 2, kind: 'action', title: 'Campagne d\'entretiens professionnels', route: 'reviews',
        story: 'Lors d\'un contrôle, on vous signale qu\'aucun entretien professionnel n\'a été tracé depuis des années.',
        todo: ['Créez une campagne d\'entretiens professionnels pour l\'année.', 'Réalisez (statut « Réalisé » ou « Signé ») au moins 5 entretiens.'],
        check(o) {
          const n = o.reviews.filter((r) => /professionnel/.test(norm(r.type)) && ['Réalisé', 'Signé'].includes(r.statut)).length;
          return n >= 5 ? true : [false, `${n} entretien(s) professionnel(s) réalisé(s) sur 5.`];
        },
        debrief: 'L\'entretien professionnel est obligatoire. Il porte sur les perspectives d\'évolution (formation, qualification), pas sur l\'évaluation de la performance, qui relève d\'un entretien annuel distinct (facultatif). La réforme de 2025 a fait évoluer sa périodicité : vérifiez le rythme applicable.' },
      { id: 'l8', year: 2, kind: 'action', title: 'Bâtir le plan de développement des compétences', route: 'training',
        story: 'Budget formation : 15 000 €. Les entretiens ont fait remonter des besoins. Une formation est réglementairement indispensable pour les personnes qui interviennent sur les installations électriques.',
        todo: ['Créez au moins 3 actions de formation.', 'Dont une de type « Obligatoire / adaptation au poste » (ex. habilitation électrique).', 'Coût total ≤ 15 000 €.'],
        check(o) {
          if (o.trainings.length < 3) return [false, `${o.trainings.length} formation(s) sur 3.`];
          if (!o.trainings.some((t) => /obligatoire/.test(norm(t.type)))) return [false, 'Il manque une formation obligatoire / d\'adaptation.'];
          const cost = o.trainings.reduce((s, t) => s + Number(t.cout || 0), 0); if (cost > 15000) return [false, `Budget dépassé : ${fmtEur(cost)}.`];
          return true;
        },
        debrief: 'L\'employeur a l\'obligation d\'adapter les salariés à leur poste et de veiller au maintien de leur capacité à occuper un emploi. Ces formations obligatoires se déroulent sur le temps de travail.' },
      { id: 'l9', year: 2, kind: 'action', title: 'Arrêt maladie de Karim', route: 'absences',
        story: 'Karim Benali, chef d\'atelier, envoie un arrêt de travail pour maladie (non professionnelle) de 65 jours.',
        todo: ['Enregistrez une absence « Maladie » de Karim Benali d\'au moins 60 jours, statut validée.'],
        check(o) {
          const e = findEmp(o, 'Karim', 'Benali');
          return o.absences.some((a) => a.empId === e?.id && a.type === 'Maladie' && a.statut === 'validee' && daysBetween(a.debut, a.fin) >= 59) ? true : [false, 'Aucun arrêt maladie de 60 jours ou plus validé pour Karim.'];
        },
        debrief: 'Après un arrêt pour maladie non professionnelle d\'au moins 60 jours, une visite de reprise auprès de la médecine du travail est obligatoire, au plus tard dans les 8 jours qui suivent la reprise. Un rendez-vous de liaison peut aussi être proposé pendant l\'arrêt (au-delà de 30 jours).' },
      { id: 'l10', year: 2, kind: 'decision', title: 'Index égalité femmes-hommes',
        story: 'Un consultant vous propose de vous accompagner pour publier l\'index égalité « obligatoire ». L\'effectif est de 42 salariés.',
        options: [
          { t: 'On signe : c\'est obligatoire pour toutes les entreprises.', s: 0, fb: 'Non : l\'index est obligatoire à partir de 50 salariés.' },
          { t: 'Pas d\'obligation de publication à 42 salariés, mais on vérifie quand même l\'égalité de rémunération, qui s\'impose à tous.', s: 10, fb: 'Exact. Le principe « à travail égal, salaire égal » s\'applique dès le premier salarié ; et la directive européenne sur la transparence salariale va renforcer les obligations.' },
          { t: 'Ce n\'est obligatoire que dans le public.', s: 0, fb: 'Non, c\'est une obligation du privé (le public a ses propres plans d\'action égalité).' },
        ] },
      { id: 'l11', year: 3, kind: 'decision', title: 'Paul veut partir',
        story: 'Paul Garnier, soudeur, souhaite quitter l\'entreprise pour un projet personnel et demande « une rupture conventionnelle avec le chômage ». La direction est d\'accord.',
        options: [
          { t: 'On signe la convention le jour même et Paul part le lendemain.', s: 0, fb: 'Impossible : il y a un délai de rétractation de 15 jours calendaires, puis l\'homologation par l\'administration.' },
          { t: 'Entretien(s), convention signée, 15 jours calendaires de rétractation, demande d\'homologation (DREETS) qui dispose de 15 jours ouvrables. Indemnité au moins égale à l\'indemnité légale de licenciement.', s: 10, fb: 'Parfait. La rupture ne peut intervenir qu\'au lendemain de l\'homologation (expresse ou tacite). L\'employeur verse aussi une contribution patronale sur l\'indemnité.' },
          { t: 'On lui conseille de démissionner, c\'est plus simple.', s: 3, fb: 'Plus simple pour l\'employeur, mais une démission n\'ouvre généralement pas droit au chômage. La rupture conventionnelle est un accord : aucun ne peut l\'imposer.' },
        ] },
      { id: 'l12', year: 3, kind: 'action', title: 'Enregistrer le départ de Paul', route: 'employees',
        story: 'La rupture conventionnelle de Paul Garnier est homologuée.',
        todo: ['Ouvrez la fiche de Paul Garnier.', 'Renseignez la date de sortie et le motif « Rupture conventionnelle ».'],
        check(o) { const e = findEmp(o, 'Paul', 'Garnier'); return e?.sortie && /rupture/.test(norm(e.motifSortie)) ? true : [false, 'Date de sortie ou motif manquant pour Paul Garnier.']; },
        debrief: 'À la sortie : certificat de travail, attestation France Travail, solde de tout compte (reçu dénonçable 6 mois), mise à jour du registre unique du personnel, portabilité de la mutuelle.' },
      { id: 'l13', year: 3, kind: 'action', title: 'Audit de conformité', route: 'compliance',
        story: 'Le directeur veut savoir si l\'entreprise est en règle.',
        todo: ['Ouvrez Obligations & conformité.', 'Marquez au moins 6 obligations comme à jour, dont le DUERP et le registre unique du personnel.'],
        check(o) { const c = o.compliance || {}; const n = Object.values(c).filter(Boolean).length; if (!c.duerp || !c.registre) return [false, 'DUERP et registre unique doivent être à jour.']; return n >= 6 ? true : [false, `${n} obligation(s) à jour sur 6.`]; },
        debrief: 'Le DUERP est obligatoire dès le premier salarié et sa mise à jour est au moins annuelle à partir de 11 salariés. Ne pas l\'avoir est sanctionné et aggrave la responsabilité de l\'employeur en cas d\'accident.' },
      { id: 'l14', year: 3, kind: 'action', title: 'Lancer une démarche GEPP', route: 'projects',
        story: 'Trois salariés partent à la retraite d\'ici 3 ans. La direction vous confie un projet de gestion prévisionnelle.',
        todo: ['Créez un projet RH de type « Démarche GPEEC / GEPP ».', 'Il doit compter au moins 5 tâches, dont au moins une terminée.'],
        check(o) { const p = o.projects.find((x) => /gpeec|gepp|gpec/.test(norm(x.titre))); if (!p) return [false, 'Aucun projet GEPP.']; if (p.tasks.length < 5) return [false, 'Au moins 5 tâches.']; return p.tasks.some((t) => t.done) ? true : [false, 'Terminez au moins une tâche.']; },
        debrief: 'La GEPP (ex-GPEC) consiste à anticiper les besoins en compétences : métiers en tension, départs, évolutions technologiques. Elle est obligatoire à négocier dans les entreprises de 300 salariés et plus, mais utile partout.' },
      { id: 'l15', year: 3, kind: 'decision', title: 'Le cap des 50 salariés',
        story: 'L\'activité explose : l\'effectif va dépasser 50 salariés de façon durable.',
        options: [
          { t: 'Rien ne change.', s: 0, fb: 'Beaucoup d\'obligations apparaissent à 50.' },
          { t: 'Règlement intérieur, index égalité, BDESE, attributions élargies du CSE et, à terme, participation aux bénéfices.', s: 10, fb: 'Exact. Depuis la loi PACTE, la plupart de ces obligations s\'appliquent après 12 mois consécutifs au-dessus du seuil (5 ans pour la participation).' },
          { t: 'Il faut créer une CSSCT.', s: 3, fb: 'La CSSCT est obligatoire à partir de 300 salariés (ou sur décision de l\'inspection du travail).' },
        ] },
    ],
  },

  belval: {
    id: 'belval', sector: 'public', title: 'Commune de Belval — fonction publique territoriale', ico: '🏛️',
    pitch: 'Vous prenez la responsabilité du service RH d\'une commune de 9 800 habitants (118 agents). Trois années pour maîtriser la gestion statutaire.',
    org() {
      const y = Number(todayISO().slice(0, 4)); const t = todayISO();
      const emps = [
        E('e1', 'Mme', 'Hélène', 'Duval', '1972-05-14', 'Direction générale', 'Directrice générale des services', 'Fonctionnaire titulaire', 'A', '2012-03-01', { grade: 'Attaché hors classe', echelon: 3, im: 830, ifse: 1400, nbi: 0 }),
        E('e2', 'M.', 'Bernard', 'Lefèvre', '1968-01-30', 'Services techniques', 'Responsable des services techniques', 'Fonctionnaire titulaire', 'B', '1998-09-01', { grade: 'Technicien principal de 1re classe', echelon: 5, im: 520, ifse: 520, managerId: 'e1' }),
        E('e3', 'Mme', 'Fatima', 'Haddad', '1985-11-21', 'Ressources humaines', 'Gestionnaire carrière-paie', 'Fonctionnaire titulaire', 'C', '2010-01-01', { grade: 'Adjoint administratif principal de 1re classe', echelon: 6, im: 450, ifse: 310, managerId: 'e1' }),
        E('e4', 'M.', 'Lucas', 'Robin', '1990-04-03', 'Services techniques', 'Agent des espaces verts', 'Fonctionnaire titulaire', 'C', '2016-04-01', { grade: 'Adjoint technique principal de 2e classe', echelon: 4, im: 395, ifse: 220, managerId: 'e2' }),
        E('e5', 'Mme', 'Céline', 'Marchand', '1987-07-09', 'Enfance — écoles', 'ATSEM', 'Fonctionnaire titulaire', 'C', '2013-09-01', { grade: 'ATSEM principal de 2e classe', echelon: 6, im: 410, ifse: 230, managerId: 'e1' }),
        E('e6', 'M.', 'Yanis', 'Brahimi', '1995-02-17', 'Police municipale', 'Policier municipal', 'Fonctionnaire titulaire', 'C', '2020-06-01', { grade: 'Gardien-brigadier de police municipale', echelon: 5, im: 400, ifse: 350, managerId: 'e1' }),
        E('e7', 'Mme', 'Aurélie', 'Simon', '1983-10-26', 'Finances', 'Responsable finances', 'Fonctionnaire titulaire', 'A', '2015-01-01', { grade: 'Attaché', echelon: 7, im: 560, ifse: 650, managerId: 'e1' }),
        E('e8', 'Mme', 'Marion', 'Perrin', '1992-08-12', 'Enfance — petite enfance', 'Auxiliaire de puériculture', 'Fonctionnaire titulaire', 'B', '2018-03-05', { grade: 'Auxiliaire de puériculture', echelon: 4, im: 410, ifse: 240, managerId: 'e1', notes: 'Congé de maternité prévu prochainement.' }),
        E('e9', 'M.', 'Rémi', 'Gauthier', '1979-12-05', 'Services techniques', 'Agent de voirie', 'Fonctionnaire titulaire', 'C', '2005-05-01', { grade: 'Adjoint technique principal de 1re classe', echelon: 7, im: 450, ifse: 230, managerId: 'e2' }),
        E('e10', 'Mme', 'Julie', 'Caron', '1998-06-18', 'Culture', 'Médiatrice de la médiathèque', 'Contractuel CDD', 'C', `${y - 1}-10-01`, { grade: 'Adjoint du patrimoine', im: 366, managerId: 'e1', finContrat: `${y}-12-31`, motifCDD: 'Vacance temporaire d\'emploi (L332-14)' }),
        E('e11', 'M.', 'Olivier', 'Blanc', '1966-03-08', 'Accueil — état civil', 'Agent d\'accueil et d\'état civil', 'Fonctionnaire titulaire', 'C', '1994-02-01', { grade: 'Adjoint administratif principal de 1re classe', echelon: 10, im: 473, ifse: 260, managerId: 'e1' }),
        E('e12', 'Mme', 'Sabrina', 'Leclerc', '1989-09-29', 'Enfance — périscolaire', 'Animatrice périscolaire', 'Contractuel CDI', 'C', '2014-09-01', { grade: 'Adjoint d\'animation', im: 380, managerId: 'e1' }),
      ];
      return {
        name: 'Commune de Belval (simulation)', sector: 'public', versant: 'FPT', ccn: '', ville: 'Belval', adresse: 'Hôtel de ville, place de la République', signataire: 'Le Maire',
        effectifDeclare: 118, services: ['Direction générale', 'Ressources humaines', 'Finances', 'Services techniques', 'Enfance — écoles', 'Enfance — petite enfance', 'Enfance — périscolaire', 'Police municipale', 'Culture', 'Accueil — état civil'], employees: emps,
        absences: [
          { id: 'a1', empId: 'e4', type: 'Congés annuels', debut: addDays(t, 15), fin: addDays(t, 26), statut: 'demandee', motif: '', jours: 0 },
          { id: 'a2', empId: 'e9', type: 'Congés annuels', debut: addDays(t, 16), fin: addDays(t, 29), statut: 'demandee', motif: '', jours: 0 },
          { id: 'a3', empId: 'e2', type: 'ARTT', debut: addDays(t, 17), fin: addDays(t, 17), statut: 'demandee', motif: '', jours: 0 },
        ],
        jobs: [], candidates: [], onboardings: [], campaigns: [], reviews: [], trainings: [], projects: [], compliance: {}, journal: [],
      };
    },
    missions: [
      { id: 'b1', year: 1, kind: 'decision', title: 'Qui décide ?',
        story: 'Vous venez du privé. On vous parle sans cesse de « l\'autorité territoriale ». Dans une commune, qui est-ce ?',
        options: [
          { t: 'Le directeur général des services (DGS).', s: 3, fb: 'Le DGS dirige les services, mais il agit par délégation. L\'autorité territoriale, c\'est l\'exécutif élu.' },
          { t: 'Le maire : il nomme, signe les arrêtés, prononce les sanctions. Le conseil municipal, lui, crée les emplois et vote le budget.', s: 10, fb: 'Exact. Distinction essentielle : le conseil municipal (organe délibérant) crée les postes au tableau des emplois ; le maire (autorité territoriale) gère la carrière des agents par arrêtés.' },
          { t: 'Le préfet.', s: 0, fb: 'Le préfet exerce un contrôle de légalité sur certains actes, mais il n\'est pas l\'employeur.' },
        ] },
      { id: 'b2', year: 1, kind: 'action', title: 'Accueillir une lauréate de concours', route: 'employees',
        story: 'Inès Morel a réussi le concours de rédacteur territorial. Le maire la recrute au service Ressources humaines à compter du 1er du mois prochain.',
        todo: ['Créez la fiche d\'Inès Morel.', 'Statut : Fonctionnaire stagiaire. Catégorie B. Grade : Rédacteur. Échelon 1.', 'Renseignez un indice majoré (IM) — par exemple 366 — et la date d\'entrée.'],
        check(o) {
          const e = findEmp(o, 'Inès', 'Morel'); if (!e) return [false, 'Fiche d\'Inès Morel introuvable.'];
          if (e.statut !== 'Fonctionnaire stagiaire') return [false, 'Une lauréate de concours est d\'abord nommée stagiaire.'];
          if (e.categorie !== 'B') return [false, 'Le grade de rédacteur relève de la catégorie B.'];
          if (!/^redacteur$/.test(norm(e.grade))) return [false, 'Grade attendu : Rédacteur.'];
          if (Number(e.echelon) !== 1) return [false, 'Classement au 1er échelon attendu (sauf reprise d\'ancienneté).'];
          if (!Number(e.im)) return [false, 'Indiquez l\'indice majoré.'];
          return true;
        },
        debrief: 'Réussir un concours ne donne pas un emploi : le lauréat est inscrit sur une liste d\'aptitude (valable 4 ans en FPT) et doit trouver un employeur. Il est nommé stagiaire pour un an, suit une formation d\'intégration, puis est titularisé (ou non) par arrêté.' },
      { id: 'b3', year: 1, kind: 'action', title: 'Le parcours d\'arrivée d\'Inès', route: 'onboarding',
        story: 'Il faut que tout soit carré pour l\'arrivée d\'Inès.',
        todo: ['Créez un parcours d\'intégration pour Inès Morel.', 'Cochez « Arrêté de nomination » et « Procès-verbal d\'installation ».', 'Vérifiez que l\'inscription à la formation d\'intégration figure dans la liste.'],
        check(o) {
          const e = findEmp(o, 'Inès', 'Morel'); if (!e) return [false, 'Créez d\'abord la fiche d\'Inès.'];
          const ob = o.onboardings.find((x) => x.empId === e.id); if (!ob) return [false, 'Aucun parcours pour Inès.'];
          if (!ob.items.some((i) => /arrete/.test(norm(i.t)) && i.done)) return [false, 'L\'arrêté de nomination n\'est pas coché.'];
          if (!ob.items.some((i) => /installation/.test(norm(i.t)) && i.done)) return [false, 'Le PV d\'installation n\'est pas coché.'];
          if (!ob.items.some((i) => /integration/.test(norm(i.t)))) return [false, 'La formation d\'intégration doit figurer dans la liste.'];
          return true;
        },
        debrief: 'Dans le public, la relation de travail ne naît pas d\'un contrat mais d\'un acte unilatéral : l\'arrêté de nomination. L\'agent est dans une situation « statutaire et réglementaire ». La formation d\'intégration (CNFPT en FPT) conditionne la titularisation.' },
      { id: 'b4', year: 1, kind: 'action', title: 'Congés aux services techniques', route: 'absences',
        story: 'Deux agents de voirie et d\'espaces verts demandent des congés sur la même période, et leur responsable pose une journée d\'ARTT. Une astreinte doit rester assurée.',
        todo: ['Traitez les trois demandes en attente.', 'Les deux agents ne peuvent pas être absents en même temps : refusez ou faites décaler une des deux demandes de congés annuels.'],
        check(o) {
          const pending = o.absences.filter((a) => ['a1', 'a2', 'a3'].includes(a.id) && a.statut === 'demandee'); if (pending.length) return [false, `${pending.length} demande(s) en attente.`];
          const both = ['a1', 'a2'].every((id) => o.absences.find((a) => a.id === id)?.statut === 'validee'); return both ? [false, 'Les deux agents seraient absents en même temps.'] : true;
        },
        debrief: 'Les congés annuels d\'un fonctionnaire : 5 fois ses obligations hebdomadaires de service (25 jours pour 5 jours/semaine), plus 1 ou 2 jours « de fractionnement » s\'il prend des jours hors de la période du 1er mai au 31 octobre. Le calendrier est fixé par l\'autorité, dans l\'intérêt du service.' },
      { id: 'b5', year: 1, kind: 'decision', title: 'Recruter vite… mais légalement',
        story: 'Le directeur des services techniques veut embaucher « le neveu d\'un élu, très bien » sur un poste permanent vacant, dès lundi, sans publier d\'annonce.',
        options: [
          { t: 'On le recrute en contractuel, c\'est plus souple.', s: 0, fb: 'Non : un emploi permanent a vocation à être occupé par un fonctionnaire, et la vacance doit être publiée avant tout recrutement.' },
          { t: 'Il faut d\'abord déclarer la vacance d\'emploi (CDG, Place de l\'emploi public), laisser un délai raisonnable aux candidatures, examiner les candidatures de fonctionnaires, puis seulement envisager un contractuel si les conditions légales sont réunies.', s: 10, fb: 'Exact. L\'égal accès aux emplois publics est un principe constitutionnel. Recruter sans publicité expose l\'acte à l\'annulation et l\'élu à un risque pénal (prise illégale d\'intérêts).' },
          { t: 'On publie l\'annonce une journée pour la forme.', s: 2, fb: 'Un délai trop court peut être jugé comme une absence de publicité réelle.' },
        ] },
      { id: 'b6', year: 2, kind: 'action', title: 'Remplacer pendant un congé de maternité', route: 'recruitment',
        story: 'Marion Perrin, auxiliaire de puériculture, part en congé de maternité. La crèche doit respecter des taux d\'encadrement.',
        todo: ['Créez une offre (type de recrutement : Contractuel) pour un remplacement d\'auxiliaire de puériculture.', 'Ajoutez 2 candidats minimum et recrutez-en un.', 'Sur sa fiche : statut Contractuel CDD, motif « Remplacement d\'un agent indisponible (L332-13) », date de fin renseignée.'],
        check(o) {
          const j = o.jobs.find((x) => /puericulture/.test(norm(x.titre)) && x.typeRecrut === 'Contractuel'); if (!j) return [false, 'Aucune offre contractuelle « puériculture ».'];
          const cs = o.candidates.filter((c) => c.jobId === j.id); if (cs.length < 2) return [false, 'Au moins 2 candidats.'];
          const hired = cs.find((c) => c.etape === 'Recruté'); if (!hired) return [false, 'Aucun candidat recruté.'];
          const e = o.employees.find((x) => x.id === hired.empId); if (!e) return [false, 'Fiche agent du candidat recruté introuvable.'];
          if (e.statut !== 'Contractuel CDD' || !/l332-13|remplacement/.test(norm(e.motifCDD)) || !e.finContrat) return [false, 'Vérifiez statut, motif et date de fin sur la fiche de l\'agent recruté.'];
          return true;
        },
        debrief: 'Le recrutement d\'un contractuel pour remplacer un agent momentanément indisponible (art. L332-13 du CGFP) est possible pour la durée de l\'absence. Le contrat doit viser précisément le motif et l\'agent remplacé.' },
      { id: 'b7', year: 2, kind: 'action', title: 'Les entretiens professionnels annuels', route: 'reviews',
        story: 'La campagne annuelle commence. Dans la fonction publique, l\'entretien professionnel a remplacé la notation.',
        todo: ['Créez la campagne de l\'année.', 'Réalisez au moins 5 entretiens professionnels annuels (statut « Réalisé » ou « Signé »).'],
        check(o) { const n = o.reviews.filter((r) => /professionnel annuel/.test(norm(r.type)) && ['Réalisé', 'Signé'].includes(r.statut)).length; return n >= 5 ? true : [false, `${n} / 5 entretiens réalisés.`]; },
        debrief: 'L\'entretien est conduit par le supérieur hiérarchique direct. Le compte rendu porte notamment sur les résultats, les objectifs, la manière de servir, les acquis de l\'expérience, les besoins de formation, les perspectives. L\'agent peut demander la révision (à l\'autorité, puis saisine de la CAP).' },
      { id: 'b8', year: 2, kind: 'action', title: 'Avancement d\'échelon de Bernard', route: 'employees',
        story: 'Bernard Lefèvre remplit les conditions d\'ancienneté pour passer au 6e échelon.',
        todo: ['Mettez à jour sa fiche : échelon 6 et nouvel indice majoré (supérieur à l\'actuel).', 'Générez ensuite l\'arrêté d\'avancement d\'échelon depuis l\'onglet Documents (facultatif mais recommandé).'],
        check(o) { const e = findEmp(o, 'Bernard', 'Lefèvre'); return Number(e?.echelon) >= 6 && Number(e?.im) > 520 ? true : [false, 'Échelon 6 et IM supérieur à 520 attendus.']; },
        debrief: 'L\'avancement d\'échelon est fonction de l\'ancienneté (durée unique depuis le protocole PPCR) : c\'est un droit. L\'avancement de grade, lui, se fait au choix (tableau d\'avancement, éventuellement après examen professionnel), selon les LDG et dans la limite des ratios « promus / promouvables » votés par l\'assemblée.' },
      { id: 'b9', year: 2, kind: 'decision', title: 'Avancement de grade : les règles du jeu',
        story: 'Un agent se plaint : « J\'ai l\'ancienneté requise, donc j\'ai droit à mon avancement de grade ! »',
        options: [
          { t: 'Il a raison : avec l\'ancienneté, l\'avancement de grade est automatique.', s: 0, fb: 'C\'est l\'échelon qui avance à l\'ancienneté. Le grade, non.' },
          { t: 'L\'ancienneté le rend « promouvable ». La promotion se fait au choix de l\'autorité, par inscription au tableau annuel d\'avancement, au vu de la valeur professionnelle et des acquis de l\'expérience, conformément aux LDG et dans la limite des ratios.', s: 10, fb: 'Exact. Depuis la loi du 6 août 2019, la CAP n\'est plus consultée sur les tableaux d\'avancement : les critères sont fixés dans les LDG.' },
          { t: 'C\'est la CAP qui décide.', s: 2, fb: 'La CAP ne donne plus d\'avis sur l\'avancement depuis 2021.' },
        ] },
      { id: 'b10', year: 2, kind: 'action', title: 'Arrêt maladie de Rémi', route: 'absences',
        story: 'Rémi Gauthier, agent de voirie, envoie plusieurs arrêts consécutifs : au total 4 mois de congé de maladie ordinaire.',
        todo: ['Enregistrez un congé « CMO (maladie ordinaire) » de Rémi Gauthier d\'au moins 100 jours, validé.'],
        check(o) { const e = findEmp(o, 'Rémi', 'Gauthier'); return o.absences.some((a) => a.empId === e?.id && /cmo/i.test(a.type) && a.statut === 'validee' && daysBetween(a.debut, a.fin) >= 99) ? true : [false, 'CMO de 100 jours ou plus non trouvé.']; },
        debrief: 'CMO du fonctionnaire : jusqu\'à 1 an sur une période de 12 mois. Traitement maintenu pendant 3 mois (à 90 % depuis mars 2025), puis demi-traitement pendant 9 mois. Jour de carence sur le premier jour. Au-delà de 6 mois consécutifs, le conseil médical est saisi pour une prolongation. Attention au passage à demi-traitement : prévenez l\'agent.' },
      { id: 'b11', year: 3, kind: 'decision', title: 'Les élections professionnelles de décembre 2026',
        story: 'Les élections professionnelles approchent dans toute la fonction publique.',
        options: [
          { t: 'On élit uniquement le CST.', s: 3, fb: 'Il y a aussi les CAP (fonctionnaires, une par catégorie) et la CCP (contractuels).' },
          { t: 'On élit les représentants au CST, aux CAP (par catégorie A, B, C) et à la CCP pour les contractuels, pour 4 ans. La collectivité doit préparer listes électorales, calendrier et modalités de vote. Les instances de moins de 50 agents relèvent du CDG.', s: 10, fb: 'Exact. Ces élections déterminent aussi la représentativité syndicale, qui fixe les moyens accordés aux organisations.' },
          { t: 'Ce sont les syndicats qui organisent tout.', s: 0, fb: 'L\'organisation matérielle incombe à l\'employeur (ou au CDG pour les collectivités affiliées).' },
        ] },
      { id: 'b12', year: 3, kind: 'action', title: 'Piloter le projet « Élections »', route: 'projects',
        story: 'La DGS vous confie l\'organisation des élections pour la commune.',
        todo: ['Créez un projet RH « Élections professionnelles » (modèle disponible).', 'Au moins 6 tâches dont 2 terminées.'],
        check(o) { const p = o.projects.find((x) => /election/.test(norm(x.titre))); if (!p) return [false, 'Projet « Élections » introuvable.']; if (p.tasks.length < 6) return [false, 'Au moins 6 tâches.']; return p.tasks.filter((t) => t.done).length >= 2 ? true : [false, 'Terminez au moins 2 tâches.']; },
        debrief: 'Gérer ce type d\'échéance comme un vrai projet (calendrier, responsables, jalons) évite les erreurs qui peuvent conduire à l\'annulation du scrutin.' },
      { id: 'b13', year: 3, kind: 'action', title: 'Le plan de formation', route: 'training',
        story: 'Le plan de formation doit être construit et présenté au CST.',
        todo: ['Créez au moins 3 formations.', 'Dont une « Intégration » et une « Préparation aux concours et examens ».'],
        check(o) {
          const ts = o.trainings; if (ts.length < 3) return [false, `${ts.length} / 3 formations.`];
          if (!ts.some((t) => t.type === 'Intégration')) return [false, 'Il manque une formation d\'intégration.'];
          return ts.some((t) => /concours/.test(norm(t.type))) ? true : [false, 'Il manque une préparation aux concours.'];
        },
        debrief: 'En FPT, la formation d\'intégration et de professionnalisation est obligatoire et assurée par le CNFPT, financé par une cotisation sur la masse salariale. Le plan de formation est obligatoire et transmis au CNFPT.' },
      { id: 'b14', year: 3, kind: 'decision', title: 'Un manquement de l\'agent d\'accueil',
        story: 'Olivier Blanc a eu des propos déplacés envers un usager, pour la première fois en 30 ans de carrière. Le maire veut une sanction « rapide ».',
        options: [
          { t: 'Révocation immédiate.', s: 0, fb: 'Disproportionné, et une sanction du 4e groupe exige le conseil de discipline.' },
          { t: 'Après avoir informé l\'agent de son droit à consulter son dossier et à se faire assister, une sanction du 1er groupe (avertissement, blâme, exclusion temporaire ≤ 3 jours) peut être prononcée sans conseil de discipline, si elle est proportionnée.', s: 10, fb: 'Exact. Les droits de la défense s\'appliquent à toute sanction. L\'action disciplinaire se prescrit par 3 ans à compter de la connaissance des faits.' },
          { t: 'On retient 3 jours de salaire sans formalité.', s: 0, fb: 'Une retenue sur traitement n\'est pas une sanction et ne peut être utilisée ainsi. Seule l\'absence de service fait justifie une retenue.' },
        ] },
      { id: 'b15', year: 3, kind: 'action', title: 'Conformité de la collectivité', route: 'compliance',
        story: 'Le centre de gestion fait le point sur vos obligations.',
        todo: ['Marquez comme à jour : RSU, LDG, DUERP, plan de formation.'],
        check(o) { const c = o.compliance || {}; const miss = ['rsu', 'ldg', 'duerp', 'plan_formation'].filter((k) => !c[k]); return miss.length ? [false, 'Manquant : ' + miss.join(', ').toUpperCase()] : true; },
        debrief: 'Le RSU (rapport social unique) est annuel ; les LDG définissent la stratégie RH et les critères de promotion ; le DUERP et le plan de formation sont obligatoires comme dans le privé.' },
      { id: 'b16', year: 3, kind: 'decision', title: 'La rupture conventionnelle dans le public',
        story: 'Aurélie Simon, attachée titulaire, veut se reconvertir et demande une rupture conventionnelle.',
        options: [
          { t: 'Impossible : un fonctionnaire ne peut que démissionner.', s: 2, fb: 'La loi de 2019 a ouvert la rupture conventionnelle aux fonctionnaires (à titre expérimental à partir de 2020) et aux contractuels en CDI. Vérifiez le cadre en vigueur.' },
          { t: 'C\'est possible si les deux parties sont d\'accord : entretien préalable, convention, délai de rétractation, indemnité spécifique de rupture conventionnelle (ISRC) au moins égale au minimum réglementaire. L\'agent doit rembourser l\'ISRC s\'il est à nouveau recruté, dans les 6 ans, par un employeur public visé par les textes (règles propres à chaque versant).', s: 10, fb: 'Exact. Aucun des deux ne peut l\'imposer ; l\'agent peut être assisté par un conseiller syndical. Comme le dispositif était expérimental pour les titulaires, vérifiez sa pérennisation.' },
          { t: 'C\'est automatique dès que l\'agent le demande.', s: 0, fb: 'Non, c\'est un accord : l\'administration peut refuser.' },
        ] },
    ],
  },
};
