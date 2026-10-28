/* Contenu de l'Académie Pilote : formations intégrées à la gestion de projet. */
const ACADEMY = [
  {
    id: 'outil', ico: '🧭', title: 'Prendre en main Pilote', level: 'Démarrage',
    lessons: [
      { t: 'Comptes, rôles et espace de travail', html: `
<p>Pilote fonctionne par <strong>espace de travail</strong> (votre organisation). La personne qui crée l'espace en devient <strong>administratrice</strong>.</p>
<table><tr><th>Rôle</th><th>Ce qu'il peut faire</th></tr>
<tr><td>Administrateur</td><td>Tout : paramètres, comptes, projets, suppression.</td></tr>
<tr><td>Chef de projet</td><td>Créer et modifier des projets, gérer toutes les tâches, risques, budget.</td></tr>
<tr><td>Membre</td><td>Voir les projets dont il est membre, mettre à jour ses tâches, commenter.</td></tr></table>
<h2>Créer le compte d'un collègue</h2>
<ol><li>Menu <strong>Équipe</strong> → <em>Créer un compte</em>.</li><li>Saisissez nom, e-mail, rôle et un mot de passe provisoire.</li><li>Transmettez ces identifiants : à la première connexion, la personne devra choisir son propre mot de passe.</li></ol>
<div class="callout warn">Les données sont enregistrées dans ce navigateur. Pour travailler à plusieurs sur des appareils différents, utilisez <em>Paramètres → Exporter</em> puis <em>Importer</em> sur l'autre poste.</div>` },
      { t: 'Le processus projet dans Pilote', html: `
<p>Chaque projet suit les <strong>5 phases</strong> classiques. Une phase ne devrait être franchie qu'une fois sa <em>check-list de passage</em> (le « jalon de décision ») complétée.</p>
<ol><li><strong>Cadrage</strong> — pourquoi, quoi, pour qui, avec quels moyens.</li><li><strong>Planification</strong> — découpage, planning, budget, rôles, risques.</li><li><strong>Exécution</strong> — on produit : réunions de lancement, suivi hebdomadaire.</li><li><strong>Contrôle</strong> — on mesure, on corrige, on recette.</li><li><strong>Clôture</strong> — on livre, on fait le bilan, on capitalise.</li></ol>
<p>Dans l'onglet <em>Vue d'ensemble</em> d'un projet, cochez les éléments de la phase en cours puis cliquez sur <strong>Passer à la phase suivante</strong>.</p>` },
      { t: 'Tâches, tableau et planning', html: `
<ul><li><strong>Tableau (Kanban)</strong> : glissez-déposez les cartes entre <em>À faire</em>, <em>En cours</em>, <em>En revue</em>, <em>Terminé</em>.</li>
<li><strong>Liste</strong> : vue tableur, triable, idéale pour une revue rapide.</li>
<li><strong>Planning</strong> : diagramme de Gantt calculé à partir des dates de début et d'échéance des tâches, avec les jalons.</li>
<li><strong>Mes tâches</strong> : tout ce qui vous est assigné, tous projets confondus, trié par échéance.</li></ul>
<div class="callout tip">Une tâche sans échéance n'existe pas vraiment : donnez toujours une date et un responsable unique.</div>` },
      { t: 'Risques, budget et météo du projet', html: `
<p>La <strong>météo</strong> d'un projet (☀️ / ⛅ / ⛈️) est calculée automatiquement :</p>
<ul><li>tâches en retard,</li><li>budget consommé par rapport à l'avancement,</li><li>risques critiques ouverts (probabilité × impact ≥ 9).</li></ul>
<p>Renseignez les dépenses dans l'onglet <strong>Budget</strong> et les risques dans l'onglet <strong>Risques</strong> pour que l'indicateur soit fiable.</p>` },
    ],
    quiz: [
      { q: 'Qui peut créer le compte d\'un nouveau collègue ?', c: ['Tout membre', 'L\'administrateur', 'Personne, chacun s\'inscrit seul'], a: 1, e: 'Seul l\'administrateur gère les comptes depuis le menu Équipe.' },
      { q: 'Quand passer à la phase suivante d\'un projet ?', c: ['À la date prévue, quoi qu\'il arrive', 'Quand la check-list de la phase est complète et validée', 'Quand le budget est consommé'], a: 1, e: 'Le passage de phase est un jalon de décision : on vérifie que les livrables de la phase sont là.' },
      { q: 'Que signifie une météo ⛈️ ?', c: ['Le projet est terminé', 'Plusieurs signaux d\'alerte : retards, budget ou risques critiques', 'Le projet n\'a pas de tâches'], a: 1, e: 'La météo combine retards, budget et risques critiques.' },
    ],
  },
  {
    id: 'bases', ico: '🏗️', title: 'Les fondamentaux de la gestion de projet', level: 'Débutant',
    lessons: [
      { t: 'Qu\'est-ce qu\'un projet ?', html: `
<p>Un projet est un <strong>effort temporaire</strong> entrepris pour créer un résultat <strong>unique</strong>. Il a un début, une fin, un objectif, des ressources limitées.</p>
<p>À l'inverse, une <strong>activité récurrente</strong> (faire la paie chaque mois) n'est pas un projet. Mettre en place un nouveau logiciel de paie, si.</p>
<h2>Le triangle Qualité – Coût – Délai (QCD)</h2>
<p>Toute décision projet arbitre entre trois contraintes : le <strong>périmètre/qualité</strong>, le <strong>coût</strong> et le <strong>délai</strong>. Si l'on ajoute du périmètre sans bouger le délai, il faut plus de moyens… ou accepter une qualité moindre.</p>
<div class="callout tip">Face à une demande nouvelle, posez toujours la question : « qu'est-ce qu'on enlève ou qu'est-ce qu'on décale ? »</div>` },
      { t: 'Les rôles clés', html: `
<table><tr><th>Rôle</th><th>Mission</th></tr>
<tr><td><strong>Sponsor / commanditaire</strong></td><td>Porte le projet au niveau de la direction, arbitre, débloque les moyens.</td></tr>
<tr><td><strong>MOA</strong> (maîtrise d'ouvrage)</td><td>Exprime le besoin, représente les utilisateurs, valide (recette).</td></tr>
<tr><td><strong>MOE</strong> (maîtrise d'œuvre)</td><td>Réalise la solution (équipe interne, prestataire).</td></tr>
<tr><td><strong>Chef de projet</strong></td><td>Organise, planifie, coordonne, alerte. Il n'a pas à tout faire : il fait faire.</td></tr>
<tr><td><strong>COPIL</strong></td><td>Comité de pilotage : instance de décision (sponsor, directions).</td></tr>
<tr><td><strong>COPROJ / comité projet</strong></td><td>Instance opérationnelle de suivi, plus fréquente.</td></tr></table>` },
      { t: 'Le cycle de vie', html: `
<p>Approche dite <strong>« prédictive » ou « en cascade »</strong> : Cadrage → Planification → Exécution → Contrôle → Clôture. Adaptée quand le besoin est stable (déménagement, mise en conformité réglementaire).</p>
<p>Approche <strong>agile / itérative</strong> : on livre par petits incréments et on ajuste. Adaptée quand le besoin est incertain (nouvel outil numérique, nouveau service).</p>
<p>Beaucoup d'organisations utilisent un <strong>hybride</strong> : cadrage et jalons formels, réalisation itérative.</p>` },
    ],
    quiz: [
      { q: 'Lequel est un projet ?', c: ['Établir les bulletins de paie mensuels', 'Déployer un nouveau logiciel de gestion des congés', 'Répondre aux e-mails des agents'], a: 1, e: 'Un projet est temporaire et produit un résultat unique.' },
      { q: 'Que représente le triangle QCD ?', c: ['Qualité, Coût, Délai', 'Quantité, Contrôle, Décision', 'Qualification, Compétence, Développement'], a: 0, e: 'Ce sont les trois contraintes à arbitrer.' },
      { q: 'Qui valide que le résultat répond au besoin (recette) ?', c: ['La MOE', 'La MOA', 'Le fournisseur'], a: 1, e: 'La maîtrise d\'ouvrage exprime le besoin et valide la recette.' },
      { q: 'Quand privilégier une approche agile ?', c: ['Quand le besoin est flou ou évolutif', 'Pour une obligation réglementaire au contenu figé', 'Jamais dans le secteur public'], a: 0, e: 'L\'agilité est utile quand on apprend en avançant. Elle est tout à fait utilisée dans le public.' },
    ],
  },
  {
    id: 'cadrage', ico: '🎯', title: 'Cadrer un projet', level: 'Débutant',
    lessons: [
      { t: 'La note de cadrage', html: `
<p>Document court (2 à 5 pages) validé par le sponsor. Il répond à :</p>
<ul><li><strong>Contexte et enjeux</strong> : pourquoi maintenant ?</li><li><strong>Objectifs</strong> mesurables.</li><li><strong>Périmètre</strong> : ce qui est inclus <em>et ce qui est exclu</em>.</li><li><strong>Livrables</strong> attendus.</li><li><strong>Parties prenantes</strong> et gouvernance (COPIL, fréquence).</li><li><strong>Moyens</strong> : budget, équipe, temps.</li><li><strong>Planning macro</strong> et jalons.</li><li><strong>Risques</strong> majeurs identifiés.</li></ul>` },
      { t: 'Des objectifs SMART', html: `
<p>Un objectif est <strong>S</strong>pécifique, <strong>M</strong>esurable, <strong>A</strong>tteignable, <strong>R</strong>éaliste (ou pertinent), <strong>T</strong>emporellement défini.</p>
<p>❌ « Améliorer l'intégration des nouveaux agents. »<br>✅ « D'ici le 30 juin, 100 % des nouveaux arrivants reçoivent un livret d'accueil et un entretien à 1 mois, mesuré par le tableau de suivi RH. »</p>` },
      { t: 'Cartographier les parties prenantes', html: `
<p>Listez toutes les personnes ou groupes <strong>concernés</strong> ou <strong>capables d'influencer</strong> le projet : direction, managers, agents, représentants du personnel, prestataires, usagers…</p>
<p>Placez-les sur une matrice <strong>Influence × Intérêt</strong> :</p>
<ul><li>forte influence / fort intérêt → <em>associer étroitement</em> ;</li><li>forte influence / faible intérêt → <em>satisfaire, tenir informé des décisions</em> ;</li><li>faible influence / fort intérêt → <em>informer régulièrement</em> ;</li><li>faible / faible → <em>surveiller</em>.</li></ul>
<div class="callout tip">Dans un projet RH, pensez tôt aux instances représentatives (CSE dans le privé, CST/CSA dans le public) : beaucoup de projets d'organisation doivent leur être présentés.</div>` },
    ],
    quiz: [
      { q: 'Que doit absolument contenir le périmètre ?', c: ['Uniquement ce qui est inclus', 'Ce qui est inclus ET ce qui est exclu', 'La liste des fournisseurs'], a: 1, e: 'Écrire ce qui est exclu évite les malentendus et la dérive du périmètre.' },
      { q: 'Quel objectif est SMART ?', c: ['Moderniser la fonction RH', 'Réduire de 20 % le délai de recrutement moyen d\'ici décembre', 'Faire mieux que l\'an dernier'], a: 1, e: 'Il est précis, chiffré et daté.' },
      { q: 'Une partie prenante à forte influence et faible intérêt doit être…', c: ['Ignorée', 'Satisfaite et tenue informée des décisions', 'Associée à toutes les réunions'], a: 1, e: 'On évite qu\'elle ne devienne opposante, sans la surcharger.' },
    ],
  },
  {
    id: 'planif', ico: '🗓️', title: 'Planifier', level: 'Intermédiaire',
    lessons: [
      { t: 'Découper : le WBS', html: `
<p>Le <strong>WBS</strong> (<em>Work Breakdown Structure</em>, organigramme des tâches) découpe le projet en <strong>lots</strong>, puis en <strong>tâches</strong> assez petites pour être estimées et confiées à une personne (idéalement 1 à 10 jours).</p>
<p>Exemple — <em>Campagne d'entretiens annuels</em> : Lot 1 Préparation (support, calendrier, formation des managers) · Lot 2 Réalisation (entretiens, relances) · Lot 3 Exploitation (synthèse, besoins de formation, recours).</p>` },
      { t: 'Estimer, ordonner, chemin critique', html: `
<ul><li><strong>Estimer</strong> : en jours-homme ; utilisez l'avis des personnes qui feront le travail.</li><li><strong>Dépendances</strong> : « fin → début » est la plus courante (on ne forme pas les managers avant d'avoir le support).</li><li><strong>Chemin critique</strong> : la suite de tâches dont le moindre retard retarde tout le projet. C'est là qu'il faut concentrer la vigilance.</li><li><strong>Jalon</strong> : événement de durée nulle marquant une étape clé (validation COPIL, mise en production).</li></ul>` },
      { t: 'Qui fait quoi : la matrice RACI', html: `
<table><tr><th>Lettre</th><th>Signification</th></tr><tr><td><strong>R</strong> — Responsible</td><td>Réalise la tâche.</td></tr><tr><td><strong>A</strong> — Accountable</td><td>Rend des comptes, valide. <em>Un seul A par tâche.</em></td></tr><tr><td><strong>C</strong> — Consulted</td><td>Consulté avant (avis).</td></tr><tr><td><strong>I</strong> — Informed</td><td>Informé après.</td></tr></table>
<div class="callout tip">Si une tâche a deux « A », personne n'est vraiment responsable.</div>` },
    ],
    quiz: [
      { q: 'À quoi sert le WBS ?', c: ['À calculer la paie', 'À découper le projet en lots et tâches', 'À recruter l\'équipe'], a: 1, e: 'C\'est l\'organigramme des tâches.' },
      { q: 'Le chemin critique, c\'est…', c: ['La liste des risques', 'La suite de tâches sans marge : tout retard décale la fin du projet', 'Le budget minimal'], a: 1, e: 'Les tâches critiques n\'ont aucune marge.' },
      { q: 'Combien de « A » par tâche dans un RACI ?', c: ['Un seul', 'Deux', 'Autant que nécessaire'], a: 0, e: 'Une seule personne rend des comptes.' },
      { q: 'Un jalon a une durée…', c: ['D\'une semaine', 'Nulle', 'Égale au projet'], a: 1, e: 'C\'est un point de passage, pas une tâche.' },
    ],
  },
  {
    id: 'pilotage', ico: '📈', title: 'Piloter et maîtriser les risques', level: 'Intermédiaire',
    lessons: [
      { t: 'Suivre l\'avancement', html: `
<ul><li><strong>Point hebdomadaire</strong> (15–30 min) : fait / à faire / blocages.</li><li><strong>Tableau de bord</strong> : avancement réel vs prévu, budget consommé vs prévu, jalons, risques majeurs.</li><li><strong>Météo projet</strong> : un indicateur simple pour la direction.</li><li><strong>COPIL</strong> : on y vient avec des <em>décisions à prendre</em>, pas seulement des informations.</li></ul>` },
      { t: 'Gérer les risques', html: `
<p>Un risque est un événement <strong>incertain</strong> qui aurait un impact sur les objectifs. Pour chacun : <strong>probabilité</strong> (1 à 4) × <strong>impact</strong> (1 à 4) = criticité (1 à 16).</p>
<p>Quatre réponses possibles : <strong>éviter</strong> (changer de plan), <strong>réduire</strong> (actions préventives), <strong>transférer</strong> (assurance, prestataire), <strong>accepter</strong> (avec un plan B).</p>
<div class="callout warn">Un risque qui se réalise devient un <strong>problème</strong> : il se traite immédiatement, il ne s'« analyse » plus.</div>` },
      { t: 'Les demandes de changement', html: `
<p>Toute demande qui modifie le périmètre, le coût ou le délai passe par une <strong>demande de changement</strong> : description, impact QCD, décision (COPIL ou sponsor). Cela protège l'équipe contre l'« effet tunnel » des petits ajouts.</p>` },
    ],
    quiz: [
      { q: 'Un risque de probabilité 3 et d\'impact 4 a une criticité de…', c: ['7', '12', '34'], a: 1, e: 'Criticité = probabilité × impact.' },
      { q: 'Souscrire une assurance, c\'est…', c: ['Éviter le risque', 'Transférer le risque', 'Accepter le risque'], a: 1, e: 'On transfère les conséquences à un tiers.' },
      { q: 'Au COPIL, on vient surtout avec…', c: ['Des décisions à faire prendre', 'Le détail de toutes les tâches', 'Rien de préparé'], a: 0, e: 'Le COPIL est une instance de décision.' },
    ],
  },
  {
    id: 'agile', ico: '🔁', title: 'Méthodes agiles : Scrum et Kanban', level: 'Intermédiaire',
    lessons: [
      { t: 'Scrum en 5 minutes', html: `
<p><strong>Rôles</strong> : Product Owner (priorise le besoin), Scrum Master (facilite, lève les obstacles), équipe de développement.</p>
<p><strong>Événements</strong> : Sprint (1 à 4 semaines), planification du sprint, mêlée quotidienne (15 min), revue de sprint (démonstration), rétrospective (amélioration).</p>
<p><strong>Artefacts</strong> : backlog produit, backlog du sprint, incrément livré.</p>` },
      { t: 'Kanban : visualiser et limiter', html: `
<ol><li><strong>Visualiser</strong> le flux (colonnes) — c'est l'onglet <em>Tableau</em> de Pilote.</li><li><strong>Limiter le travail en cours</strong> (WIP) : par exemple 3 cartes maximum en « En cours » par personne. Terminer avant de commencer.</li><li><strong>Mesurer le flux</strong> : temps entre « À faire » et « Terminé ».</li></ol>
<div class="callout tip">Pilote affiche un avertissement quand une personne a plus de 3 tâches « En cours ».</div>` },
    ],
    quiz: [
      { q: 'Qui priorise le backlog dans Scrum ?', c: ['Le Scrum Master', 'Le Product Owner', 'Le sponsor'], a: 1, e: 'Le Product Owner porte la valeur métier.' },
      { q: 'La rétrospective sert à…', c: ['Montrer le produit au client', 'Améliorer la façon de travailler de l\'équipe', 'Faire le planning'], a: 1, e: 'Elle porte sur le « comment ».' },
      { q: 'Limiter le WIP permet…', c: ['De commencer plus de choses', 'De finir plus vite ce qui est commencé', 'De supprimer les réunions'], a: 1, e: '« Arrêtez de commencer, commencez à finir. »' },
    ],
  },
  {
    id: 'humain', ico: '🤝', title: 'Animer l\'équipe et conduire le changement', level: 'Avancé',
    lessons: [
      { t: 'Réunions efficaces', html: `
<ul><li>Un <strong>objectif</strong> et un <strong>ordre du jour</strong> envoyés avant.</li><li>Les bonnes personnes, pas toutes les personnes.</li><li>Un <strong>compte rendu</strong> court : décisions, actions (qui / quoi / quand).</li><li>Commencer et finir à l'heure.</li></ul>` },
      { t: 'Accompagner le changement', html: `
<p>Les personnes traversent souvent les étapes de la <strong>courbe du deuil</strong> (Kübler-Ross) : choc, déni, colère, marchandage, tristesse, acceptation, engagement.</p>
<p>Leviers : <strong>donner du sens</strong> (pourquoi), <strong>associer</strong> tôt, <strong>former</strong>, <strong>communiquer</strong> souvent et de façon honnête, <strong>célébrer</strong> les premiers succès, identifier des <strong>relais</strong> (ambassadeurs).</p>` },
    ],
    quiz: [
      { q: 'Un bon compte rendu contient surtout…', c: ['La retranscription intégrale', 'Les décisions et actions (qui/quoi/quand)', 'Les absents'], a: 1, e: 'Court et actionnable.' },
      { q: 'Premier levier face aux résistances ?', c: ['Imposer', 'Donner du sens et associer', 'Attendre que ça passe'], a: 1, e: 'Comprendre le pourquoi réduit les résistances.' },
    ],
  },
  {
    id: 'cloture', ico: '🏁', title: 'Clôturer et capitaliser', level: 'Avancé',
    lessons: [
      { t: 'Recette et livraison', html: `
<p>La <strong>recette</strong> vérifie que le livrable correspond au besoin, à partir de <strong>scénarios de tests</strong> préparés en amont. Elle se conclut par un <strong>procès-verbal (PV)</strong> : recette prononcée, avec ou sans réserves.</p>` },
      { t: 'Bilan et retour d\'expérience (REX)', html: `
<ul><li>Objectifs atteints ? Écarts QCD et leurs causes.</li><li>Ce qui a bien marché / ce qu'on ferait autrement.</li><li>Transfert vers l'exploitation (qui maintient, qui forme les nouveaux).</li><li>Archivage des documents.</li><li>Remercier l'équipe — ça compte.</li></ul>
<div class="callout tip">Un REX utile est <strong>sans recherche de coupable</strong> : on analyse le système, pas les personnes.</div>` },
    ],
    quiz: [
      { q: 'Le PV de recette peut être prononcé…', c: ['Uniquement sans réserve', 'Avec ou sans réserves', 'Par le fournisseur seul'], a: 1, e: 'Les réserves listent ce qui reste à corriger.' },
      { q: 'Un REX efficace…', c: ['Désigne un responsable des échecs', 'Analyse les causes sans chercher de coupable', 'Est facultatif'], a: 1, e: 'On apprend du système, pas d\'un bouc émissaire.' },
    ],
  },
];

const PHASES = [
  { name: 'Cadrage', gates: ['Besoin et contexte formalisés', 'Objectifs SMART définis', 'Périmètre inclus / exclu écrit', 'Parties prenantes identifiées', 'Note de cadrage validée par le sponsor'] },
  { name: 'Planification', gates: ['Découpage en lots et tâches (WBS)', 'Planning avec jalons', 'Rôles définis (RACI)', 'Budget prévisionnel', 'Registre des risques initial'] },
  { name: 'Exécution', gates: ['Réunion de lancement tenue', 'Point d\'avancement hebdomadaire en place', 'Demandes de changement tracées'] },
  { name: 'Contrôle', gates: ['Tableau de bord partagé', 'Revue des risques à jour', 'Recette réalisée'] },
  { name: 'Clôture', gates: ['PV de recette signé', 'Bilan / retour d\'expérience', 'Documents archivés', 'Communication de fin de projet'] },
];

const TEMPLATES = {
  vide: { name: 'Projet vide', tasks: [] },
  rh_entretiens: { name: 'Campagne d\'entretiens annuels', tasks: [
    ['Mettre à jour le support d\'entretien', 0, 5], ['Définir le calendrier de la campagne', 0, 2], ['Former les managers à la conduite d\'entretien', 7, 3],
    ['Communiquer auprès des équipes', 10, 1], ['Réaliser les entretiens', 14, 30], ['Relancer les entretiens non faits', 35, 5],
    ['Consolider les besoins de formation', 45, 7], ['Traiter les demandes de révision', 45, 15], ['Bilan de campagne', 60, 3]] },
  recrutement: { name: 'Recrutement d\'un poste', tasks: [
    ['Rédiger la fiche de poste', 0, 3], ['Valider le budget du poste', 0, 2], ['Publier l\'offre', 3, 1], ['Trier les candidatures', 5, 10],
    ['Organiser les entretiens', 15, 7], ['Décision et proposition', 22, 3], ['Préparer l\'arrivée (matériel, accès, parrain)', 25, 10]] },
  deploiement: { name: 'Déploiement d\'un nouvel outil', tasks: [
    ['Recueillir les besoins des utilisateurs', 0, 10], ['Comparer les solutions', 10, 10], ['Choisir et contractualiser', 20, 10], ['Paramétrer l\'outil', 30, 15],
    ['Recette avec des utilisateurs pilotes', 45, 10], ['Former les utilisateurs', 55, 10], ['Mise en service', 65, 1], ['Bilan à 3 mois', 155, 2]] },
  evenement: { name: 'Organisation d\'un événement', tasks: [
    ['Fixer date, lieu et budget', 0, 5], ['Réserver le lieu', 5, 3], ['Programme et intervenants', 5, 15], ['Invitations', 20, 2],
    ['Logistique (repas, matériel)', 20, 15], ['Jour J', 40, 1], ['Questionnaire de satisfaction et bilan', 41, 5]] },
};
