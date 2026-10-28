/* Sara HR — modules de formation (3/3) + parcours */

MODULES.push({
  id: 'formation', ico: '📚', title: 'Formation et développement des compétences', tag: 'commun', level: 'Intermédiaire',
  summary: 'Formations statutaires, CPF, plan de formation, entretien professionnel, VAE, bilan de compétences.',
  lessons: [
    { t: 'La formation dans la fonction publique', html: `
<ul><li><strong>Formations statutaires obligatoires</strong> (FPT) : <strong>intégration</strong> (catégories A, B, C ; 5 à 10 jours, avant titularisation) et <strong>professionnalisation</strong> (au premier emploi, tout au long de la carrière, et lors de la prise d'un poste à responsabilité). À l'État, des écoles (IRA, INSP…) assurent la formation initiale de nombreux corps.</li>
<li><strong>Formation de perfectionnement</strong> à la demande de l'agent ou de l'employeur.</li><li><strong>Préparation aux concours et examens professionnels</strong>.</li>
<li><strong>CPF</strong> (compte personnel de formation) : alimenté en <strong>heures</strong> — 25 h par an, plafond de 150 h (50 h / an et plafond de 400 h pour les agents de catégorie C sans diplôme de niveau 4). Utilisable pour un projet d'évolution professionnelle, avec l'accord de l'employeur.</li>
<li><strong>Congé de formation professionnelle</strong> (jusqu'à 3 ans sur la carrière, indemnisé 12 mois à 85 % du traitement), <strong>bilan de compétences</strong>, <strong>VAE</strong>, <strong>congé pour formation syndicale</strong>.</li>
<li><strong>Plan de formation</strong> : obligatoire, annuel ou pluriannuel, présenté au CST / CSA ; en FPT, transmis au CNFPT, financé en partie par la <strong>cotisation CNFPT</strong> (0,9 % de la masse salariale).</li></ul>` },
    { t: 'La formation dans le privé', html: `
<ul><li>L'employeur doit <strong>adapter</strong> le salarié à son poste et veiller au <strong>maintien de sa capacité à occuper un emploi</strong> : ces formations sont du temps de travail.</li>
<li><strong>Plan de développement des compétences</strong> : ensemble des actions décidées par l'employeur.</li>
<li><strong>CPF</strong> en <strong>euros</strong> : 500 € par an, plafond 5 000 € (800 € / 8 000 € pour les salariés peu qualifiés). Depuis 2024, une participation forfaitaire reste à la charge du titulaire (sauf exceptions, ex. abondement de l'employeur).</li>
<li><strong>Alternance</strong> (apprentissage, professionnalisation), <strong>Pro-A</strong> (reconversion ou promotion par alternance), <strong>projet de transition professionnelle</strong>.</li>
<li><strong>Entretien professionnel</strong> : il porte sur les perspectives d'évolution (qualification, emploi) — pas sur l'évaluation. Rythme classique : tous les 2 ans + état des lieux tous les 6 ans ; une loi de 2025 a fait évoluer ce rythme (« entretien de parcours professionnel ») : vérifiez la règle applicable à la date du jour.</li></ul>` },
    { t: 'Construire un plan de formation utile', html: `
<ol><li><strong>Recueillir les besoins</strong> : entretiens professionnels, projets de service, obligations réglementaires (habilitations, sécurité), évolutions des métiers.</li><li><strong>Prioriser</strong> : obligatoire → adaptation au poste → développement → projets individuels.</li><li><strong>Chiffrer</strong> : coûts pédagogiques, déplacements, remplacement.</li><li><strong>Présenter</strong> aux instances (CST / CSA ; CSE dans le privé).</li><li><strong>Mettre en œuvre</strong> et suivre les inscriptions.</li><li><strong>Évaluer</strong> : satisfaction à chaud, mise en pratique à froid (3 à 6 mois).</li></ol>` },
  ],
  memo: `<table><tr><th></th><th>Public</th><th>Privé</th></tr><tr><td>CPF</td><td>25 h / an, plafond 150 h</td><td>500 € / an, plafond 5 000 €</td></tr><tr><td>Obligatoire</td><td>Intégration, professionnalisation</td><td>Adaptation au poste, maintien dans l'emploi</td></tr><tr><td>Plan</td><td>Plan de formation (CST)</td><td>Plan de développement des compétences (CSE)</td></tr><tr><td>Financement</td><td>Cotisation CNFPT (FPT)</td><td>Contribution formation (OPCO)</td></tr></table>`,
  cards: [
    ['CPF dans la fonction publique', '25 heures par an, plafond de 150 heures (davantage pour certains agents de catégorie C).'],
    ['CPF dans le privé', '500 € par an, plafond de 5 000 € (800 € / 8 000 € pour les moins qualifiés).'],
    ['Formation d\'intégration (FPT)', 'Formation statutaire obligatoire avant titularisation, assurée par le CNFPT.'],
    ['Formation de professionnalisation (FPT)', 'Obligatoire au premier emploi, tout au long de la carrière et lors d\'une prise de poste à responsabilité.'],
    ['VAE', 'Validation des acquis de l\'expérience : obtenir tout ou partie d\'un diplôme grâce à son expérience.'],
    ['Bilan de compétences', 'Analyse de ses compétences, aptitudes et motivations pour définir un projet professionnel.'],
    ['Cotisation CNFPT', '0,9 % de la masse salariale des collectivités.'],
    ['Objet de l\'entretien professionnel (privé)', 'Les perspectives d\'évolution professionnelle — pas l\'évaluation du travail.'],
    ['OPCO', 'Opérateur de compétences : finance l\'alternance et accompagne les entreprises (privé).'],
    ['Pro-A', 'Reconversion ou promotion par alternance pour les salariés en CDI (privé).'],
  ],
  quiz: [
    { q: 'Le CPF d\'un agent public est alimenté en…', c: ['Euros', 'Heures', 'Points'], a: 1, e: '25 h par an.' },
    { q: 'La formation d\'intégration en FPT est…', c: ['Facultative', 'Obligatoire pour être titularisé', 'Réservée aux catégories A'], a: 1, e: 'Pour les catégories A, B et C.' },
    { q: 'Le CPF d\'un salarié du privé est alimenté de…', c: ['250 € / an', '500 € / an', '1 000 € / an'], a: 1, e: 'Plafond 5 000 €.' },
    { q: 'Une formation d\'habilitation électrique imposée par le poste est…', c: ['Du temps personnel', 'Du temps de travail', 'Financée par le CPF'], a: 1, e: 'Formation obligatoire / d\'adaptation.' },
    { q: 'L\'évaluation d\'une formation « à froid » se fait…', c: ['Le jour même', '3 à 6 mois après', 'Jamais'], a: 1, e: 'Pour mesurer la mise en pratique.' },
    { q: 'Qui finance en grande partie la formation des agents territoriaux ?', c: ['L\'OPCO', 'Le CNFPT, via la cotisation des collectivités', 'L\'État'], a: 1, e: 'Cotisation de 0,9 %.' },
  ],
  cases: [
    { t: 'La demande de formation refusée', s: 'Une gestionnaire demande pour la 3e année consécutive une formation sur la paie, refusée chaque fois « faute de budget ».',
      opts: [{ t: 'On refuse encore, le budget est contraint.', s: 2, fb: 'Les refus répétés d\'une même formation sont encadrés : l\'agent peut obtenir une priorité, et le refus peut être soumis à la CAP.' },
        { t: 'On regarde si la formation est liée au poste (alors prioritaire), on cherche des solutions moins chères (CNFPT, formation interne, e-learning), et on lui répond par écrit de façon motivée.', s: 10, fb: 'Bonne approche : la formation liée au poste sert aussi la qualité du service.' },
        { t: 'On lui conseille d\'utiliser son CPF pour tout.', s: 4, fb: 'Le CPF sert un projet d\'évolution, pas l\'adaptation au poste qui incombe à l\'employeur.' }] },
  ],
  tf: [
    ['Dans la fonction publique, le CPF est alimenté en euros.', false, 'En heures.'],
    ['La formation d\'intégration conditionne la titularisation en FPT.', true, 'C\'est une formation statutaire obligatoire.'],
    ['L\'entretien professionnel sert à évaluer la performance du salarié.', false, 'Il porte sur les perspectives d\'évolution.'],
  ],
});

MODULES.push({
  id: 'pilotage', ico: '📊', title: 'Pilotage RH : emplois, masse salariale, indicateurs', tag: 'commun', level: 'Avancé',
  summary: 'GPEEC / GEPP, tableau des emplois, masse salariale et GVT, RSU, indicateurs, SIRH et RGPD.',
  lessons: [
    { t: 'Anticiper : la GPEEC / GEPP', html: `
<p>La <strong>gestion prévisionnelle des emplois, des effectifs et des compétences</strong> (GPEEC dans le public, GEPP dans le privé) consiste à anticiper l'écart entre les ressources (effectifs, compétences) et les besoins futurs.</p>
<ol><li>Cartographier les <strong>métiers</strong> et compétences actuels (répertoire des métiers du CNFPT en FPT).</li><li>Analyser la <strong>pyramide des âges</strong> et les départs prévisibles (retraites, mobilités).</li><li>Identifier les <strong>métiers sensibles</strong> (rares, en tension, en évolution).</li><li>Construire un <strong>plan d'actions</strong> : recrutement, formation, mobilité interne, transmission des savoirs, apprentissage.</li></ol>` },
    { t: 'Emplois et masse salariale (public)', html: `
<ul><li><strong>Tableau des emplois</strong> (FPT) : liste des emplois créés par délibération (grade, temps de travail, pourvu / vacant). Il doit être cohérent avec le budget.</li>
<li><strong>Masse salariale</strong> : premier poste de dépenses de fonctionnement d'une collectivité (souvent 50 à 60 %). Elle évolue sous l'effet :
<ul><li>des <strong>mesures générales</strong> (valeur du point, revalorisations du SMIC et des bas de grille, réformes) ;</li><li>du <strong>GVT</strong> (glissement vieillesse-technicité) : <em>GVT positif</em> = effet des avancements d'échelon, de grade, des promotions ; <em>GVT négatif</em> ou <em>effet de noria</em> = remplacement de départs (souvent mieux rémunérés) par des agents plus jeunes ;</li><li>des variations d'<strong>effectifs</strong> et des <strong>mesures catégorielles</strong>.</li></ul></li>
<li>On distingue <strong>effectif physique</strong> (nombre de personnes) et <strong>ETP</strong> (équivalents temps plein : un agent à 80 % = 0,8 ETP). Le <strong>ETPT</strong> tient aussi compte de la durée de présence sur l'année.</li></ul>` },
    { t: 'Les indicateurs et le RSU', html: `
<table><tr><th>Indicateur</th><th>Calcul usuel</th></tr><tr><td>Turnover</td><td>((entrées + sorties) / 2) / effectif moyen</td></tr><tr><td>Taux d'absentéisme</td><td>Jours d'absence (maladie…) / jours théoriques travaillés</td></tr><tr><td>Pyramide des âges</td><td>Répartition par tranches d'âge et sexe</td></tr><tr><td>Taux de formation</td><td>Agents formés / effectif ; jours de formation par agent</td></tr><tr><td>Taux d'emploi de travailleurs handicapés</td><td>Objectif légal : 6 % (≥ 20 ETP)</td></tr></table>
<p>Le <strong>rapport social unique (RSU)</strong>, annuel depuis 2021 dans la fonction publique, rassemble ces données (effectifs, carrières, rémunérations, absences, formation, santé, égalité, dialogue social) dans une <strong>base de données sociales</strong>. Il est présenté au CST / CSA et sert de diagnostic pour les LDG. Dans le privé, la <strong>BDESE</strong> joue un rôle comparable (dès 50 salariés).</p>` },
    { t: 'SIRH et protection des données', html: `
<ul><li><strong>SIRH</strong> : logiciel de gestion des ressources humaines (dossiers, carrière, paie, absences, formation…). Dans le public, il gère aussi les grilles indiciaires, les arrêtés, les déclarations (DSN pour les contractuels et désormais pour la plupart des employeurs publics).</li>
<li><strong>RGPD</strong> : les données RH sont des données personnelles, parfois sensibles (santé, syndicat). Règles : finalité déterminée, minimisation, durée de conservation limitée, accès réservé aux personnes habilitées, sécurité, information des agents, droit d'accès.</li>
<li>Le <strong>dossier individuel</strong> de l'agent doit comporter toutes les pièces relatives à sa situation administrative, enregistrées, numérotées et classées sans discontinuité ; il ne peut contenir aucune mention des opinions ou activités politiques, syndicales, religieuses ou philosophiques.</li></ul>` },
  ],
  memo: `<ul><li><strong>GPEEC</strong> : métiers → pyramide des âges → métiers sensibles → plan d'actions.</li><li><strong>GVT</strong> : hausse « mécanique » de la masse salariale par les avancements.</li><li><strong>ETP</strong> = somme des quotités.</li><li><strong>Turnover</strong> = ((E + S) / 2) / effectif.</li><li><strong>RSU</strong> annuel → diagnostic pour les LDG, présenté au CST.</li><li><strong>RGPD</strong> : finalité, minimisation, accès restreint, durée limitée.</li></ul>`,
  cards: [
    ['GPEEC', 'Gestion prévisionnelle des emplois, des effectifs et des compétences (public).'],
    ['GEPP', 'Gestion des emplois et des parcours professionnels (privé, ex-GPEC).'],
    ['GVT', 'Glissement vieillesse-technicité : évolution de la masse salariale due aux avancements et promotions.'],
    ['Effet de noria', 'Économie liée au remplacement d\'agents partants par des agents moins avancés dans leur carrière.'],
    ['ETP', 'Équivalent temps plein : somme des quotités de travail (80 % = 0,8).'],
    ['Turnover', '((entrées + sorties) / 2) / effectif moyen de la période.'],
    ['RSU', 'Rapport social unique : données sociales annuelles de l\'employeur public, présentées au CST / CSA.'],
    ['Tableau des emplois', 'Liste des emplois créés par l\'organe délibérant d\'une collectivité.'],
    ['Taux d\'emploi légal de travailleurs handicapés', '6 % pour les employeurs de 20 ETP / salariés et plus.'],
    ['SIRH', 'Système d\'information des ressources humaines.'],
    ['Données interdites dans le dossier individuel', 'Opinions ou activités politiques, syndicales, religieuses ou philosophiques.'],
  ],
  quiz: [
    { q: 'Deux agents à temps plein et un à 50 % représentent…', c: ['3 ETP', '2,5 ETP', '2 ETP'], a: 1, e: '1 + 1 + 0,5.' },
    { q: 'Le GVT positif correspond…', c: ['Aux revalorisations du point', 'À l\'effet des avancements d\'échelon et de grade', 'Aux départs en retraite'], a: 1, e: 'Hausse « mécanique » à effectif constant.' },
    { q: 'Le RSU est…', c: ['Mensuel', 'Annuel', 'Tous les 4 ans'], a: 1, e: 'Depuis 2021.' },
    { q: 'Avec 10 entrées, 6 sorties et 80 agents, le turnover est de…', c: ['10 %', '20 %', '7,5 %'], a: 0, e: '((10 + 6) / 2) / 80 = 10 %.' },
    { q: 'Peut-on noter l\'appartenance syndicale d\'un agent dans son dossier ?', c: ['Oui', 'Non', 'Seulement avec son accord oral'], a: 1, e: 'C\'est interdit.' },
    { q: 'Le tableau des emplois est adopté par…', c: ['Le maire', 'L\'organe délibérant', 'Le CDG'], a: 1, e: 'Par délibération.' },
  ],
  cases: [
    { t: 'La masse salariale qui dérape', s: 'Le directeur financier constate +3,5 % de masse salariale alors que l\'effectif est stable. Il soupçonne une erreur de paie.',
      opts: [{ t: 'C\'est forcément une erreur, on recontrôle toutes les paies.', s: 2, fb: 'Un contrôle peut être utile, mais une hausse à effectif constant est souvent normale.' },
        { t: 'On décompose : mesures générales (revalorisations, SMIC, cotisations employeur), GVT (avancements, promotions), mesures catégorielles, heures supplémentaires, remplacements. On présente ces facteurs et on intègre le GVT dans les prévisions budgétaires suivantes.', s: 10, fb: 'C\'est l\'analyse attendue d\'un pilotage RH.' },
        { t: 'On gèle tous les avancements d\'échelon.', s: 0, fb: 'Impossible : l\'avancement d\'échelon est un droit.' }] },
  ],
  tf: [
    ['Un agent à 80 % compte pour 0,8 ETP.', true, 'Somme des quotités.'],
    ['Le GVT peut augmenter la masse salariale même à effectif constant.', true, 'Par les avancements.'],
    ['Le RSU est présenté au CST / CSA.', true, 'Base de données sociales.'],
  ],
});

MODULES.push({
  id: 'management', ico: '🧭', title: 'Manager, évaluer, accompagner', tag: 'commun', level: 'Intermédiaire',
  summary: 'La posture de responsable : conduire l\'entretien professionnel, donner du feedback, gérer un conflit, déléguer.',
  lessons: [
    { t: 'L\'entretien professionnel annuel (public)', html: `
<ul><li>Conduit par le <strong>supérieur hiérarchique direct</strong>. Convocation au moins <strong>8 jours avant</strong>, avec la fiche de poste et le modèle de compte rendu.</li>
<li>Il porte sur : les <strong>résultats</strong> obtenus au regard des objectifs et des conditions d'organisation du service ; les <strong>objectifs</strong> de l'année à venir ; la <strong>manière de servir</strong> ; les <strong>acquis de l'expérience professionnelle</strong> ; le cas échéant les <strong>capacités d'encadrement</strong> ; les <strong>besoins de formation</strong> ; les <strong>perspectives</strong> d'évolution (carrière, mobilité).</li>
<li>Le <strong>compte rendu</strong> est signé par l'évaluateur, notifié à l'agent qui peut le compléter de ses observations, puis visé par l'autorité.</li>
<li><strong>Recours</strong> : demande de révision auprès de l'autorité hiérarchique (15 jours francs), puis saisine de la CAP (1 mois), en plus du recours contentieux.</li>
<li>Il sert à l'<strong>avancement de grade</strong>, à la <strong>promotion interne</strong> et au <strong>CIA</strong>.</li></ul>` },
    { t: 'Donner du feedback', html: `
<p>Méthode <strong>DESC</strong> pour un recadrage :</p>
<ul><li><strong>D</strong>écrire les faits (« Mardi et jeudi, le guichet a ouvert à 9 h 20 au lieu de 9 h »).</li><li><strong>E</strong>xprimer l'effet ou le ressenti (« Des usagers ont attendu dehors, j'ai reçu deux plaintes »).</li><li><strong>S</strong>uggérer / Solliciter une solution (« Qu'est-ce qui t'empêche d'être à l'heure ? Que proposes-tu ? »).</li><li><strong>C</strong>onclure sur les conséquences positives et l'engagement (« On fait le point dans 15 jours »).</li></ul>
<div class="callout tip">Le feedback positif compte autant : précis, sincère, rapide (« Ton tableau de suivi m'a fait gagner une heure en réunion »).</div>` },
    { t: 'Gérer un conflit dans l\'équipe', html: `
<ol><li><strong>Ne pas laisser pourrir</strong> : un conflit ignoré s'aggrave et peut dégénérer en risque psychosocial (RPS), voire en harcèlement.</li><li>Écouter <strong>chaque partie séparément</strong>, s'en tenir aux faits.</li><li>Distinguer <strong>désaccord</strong> professionnel, conflit relationnel, et comportement inacceptable (insultes, harcèlement) qui relève d'un recadrage voire du disciplinaire.</li><li>Réunir les parties, rappeler le cadre, chercher des engagements concrets, faire un suivi.</li><li>Si besoin : médiation (interne, CDG, médiateur), soutien du service de prévention, psychologue du travail.</li></ol>` },
    { t: 'Déléguer et organiser', html: `
<ul><li><strong>Déléguer</strong>, ce n'est pas se débarrasser : objectif clair, autonomie sur le « comment », moyens, points d'étape, reconnaissance.</li><li>Prioriser avec la matrice <strong>urgent / important</strong> (Eisenhower) : important et urgent → faire ; important non urgent → planifier ; urgent non important → déléguer ; ni l'un ni l'autre → abandonner.</li><li>Rituels d'équipe courts et réguliers : réunion hebdomadaire de 30 min, ordre du jour, compte rendu avec actions.</li><li>Bien connaître ses limites : le responsable RH conseille et sécurise ; il ne remplace pas le manager dans sa relation avec ses agents.</li></ul>` },
  ],
  memo: `<h3>Entretien professionnel (public)</h3><p>Convocation 8 j avant → entretien → compte rendu → notification → observations → recours (15 j francs à l'autorité, puis CAP 1 mois).</p><h3>DESC</h3><p>Décrire, Exprimer, Suggérer, Conclure.</p><h3>Eisenhower</h3><p>Urgent + important = faire ; important = planifier ; urgent = déléguer ; ni l'un ni l'autre = abandonner.</p>`,
  cards: [
    ['Qui conduit l\'entretien professionnel (public) ?', 'Le supérieur hiérarchique direct.'],
    ['Délai de convocation à l\'entretien professionnel', 'Au moins 8 jours avant.'],
    ['Contenu de l\'entretien professionnel (public)', 'Résultats, objectifs, manière de servir, acquis de l\'expérience, encadrement, formation, perspectives.'],
    ['Recours contre le compte rendu d\'entretien', 'Révision auprès de l\'autorité (15 jours francs), puis CAP (1 mois).'],
    ['Méthode DESC', 'Décrire les faits, Exprimer l\'impact, Suggérer une solution, Conclure.'],
    ['Matrice d\'Eisenhower', 'Classer les tâches selon urgence et importance.'],
    ['RPS', 'Risques psychosociaux : stress, violences internes et externes, épuisement…'],
    ['Médiation', 'Intervention d\'un tiers neutre pour aider les parties d\'un conflit à trouver une solution.'],
  ],
  quiz: [
    { q: 'L\'entretien professionnel d\'un agent est conduit par…', c: ['Le DRH', 'Son supérieur hiérarchique direct', 'Le maire'], a: 1, e: 'C\'est une obligation réglementaire.' },
    { q: 'Le « D » de DESC signifie…', c: ['Décider', 'Décrire les faits', 'Déléguer'], a: 1, e: 'Factuel, sans jugement.' },
    { q: 'Une tâche importante mais non urgente doit être…', c: ['Faite tout de suite', 'Planifiée', 'Abandonnée'], a: 1, e: 'C\'est souvent là qu\'on crée le plus de valeur.' },
    { q: 'Un agent conteste son compte rendu d\'entretien. Première étape ?', c: ['Saisir le tribunal administratif directement', 'Demander une révision à l\'autorité hiérarchique', 'Rien n\'est possible'], a: 1, e: 'Puis CAP. Le recours contentieux reste ouvert.' },
    { q: 'Face à un conflit entre deux agents, la première chose à faire est…', c: ['Attendre que ça passe', 'Écouter chaque partie séparément, sur des faits', 'Sanctionner les deux'], a: 1, e: 'Comprendre avant d\'agir.' },
  ],
  cases: [
    { t: 'L\'agent démotivé', s: 'Un agent auparavant très impliqué arrive en retard, s\'isole et fait des erreurs depuis deux mois. Son manager veut « le recadrer sévèrement ».',
      opts: [{ t: 'Avertissement immédiat.', s: 1, fb: 'Sanctionner sans comprendre peut aggraver une situation de souffrance.' },
        { t: 'Entretien bienveillant et factuel pour comprendre (charge, conflit, santé, situation personnelle), rappel du cadre attendu, proposition de solutions (aménagement, médecine du travail, formation, soutien), et point de suivi daté.', s: 10, fb: 'Un changement de comportement est un signal d\'alerte : on écoute d\'abord, sans renoncer au cadre.' },
        { t: 'On l\'ignore, ça passera.', s: 0, fb: 'Laisser faire expose aux RPS et à l\'aggravation.' }] },
  ],
  tf: [
    ['L\'entretien professionnel peut être conduit par un collègue du même grade.', false, 'Par le supérieur hiérarchique direct.'],
    ['Le feedback positif doit être précis et rapide.', true, 'Comme le feedback correctif.'],
  ],
});

MODULES.push({
  id: 'projet', ico: '🧩', title: 'Conduire un projet RH et le changement', tag: 'commun', level: 'Avancé',
  summary: 'Appliquer la gestion de projet aux chantiers RH : cadrage, planning, instances, communication, résistance au changement.',
  lessons: [
    { t: 'Un projet RH, c\'est un projet', html: `
<p>Campagne d'entretiens, nouveau régime indemnitaire, élections professionnelles, déploiement d'un SIRH, réorganisation, plan égalité… Tous ces chantiers se pilotent comme des projets :</p>
<ol><li><strong>Cadrage</strong> : objectif, périmètre, contraintes juridiques, calendrier des instances, budget, sponsor (DGS, élu).</li><li><strong>Planification</strong> : tâches, responsables, jalons — en <strong>rétro-planning</strong> depuis la date butoir (ex. date d'effet d'une délibération).</li><li><strong>Concertation</strong> : groupes de travail avec des agents, des managers, les représentants du personnel.</li><li><strong>Instances</strong> : avis du CST / CSA (ou consultation du CSE), puis délibération ou décision.</li><li><strong>Communication</strong> et accompagnement.</li><li><strong>Mise en œuvre</strong>, suivi, bilan.</li></ol>
<div class="callout tip">Pour pratiquer, ouvrez <strong>Pilote</strong> (lien dans le menu) : il contient des modèles de projets RH et sa propre académie de gestion de projet.</div>` },
    { t: 'Exemple : mettre en place le RIFSEEP', html: `
<ol><li>Diagnostic de l'existant (primes actuelles par agent, coût).</li><li>Cartographie des postes et définition des <strong>groupes de fonctions</strong> (critères : encadrement, technicité, sujétions).</li><li>Cotation des postes, montants par groupe (plafonds de l'État), règles de modulation (absences, CIA).</li><li>Simulation budgétaire et individuelle (garantie du maintien du montant antérieur, si choisie).</li><li>Concertation, avis du <strong>CST</strong>.</li><li><strong>Délibération</strong> de l'organe délibérant.</li><li><strong>Arrêtés individuels</strong> d'attribution.</li><li>Communication aux agents, paramétrage de la paie.</li></ol>` },
    { t: 'Accompagner le changement', html: `
<ul><li>Les réactions suivent souvent la <strong>courbe du changement</strong> : refus, résistance, exploration, engagement.</li><li>Les résistances sont normales et souvent légitimes : elles signalent une inquiétude (perte de repères, de compétences, de rémunération, de statut).</li><li>Leviers : <strong>sens</strong> (pourquoi), <strong>participation</strong> (associer en amont), <strong>information</strong> régulière et honnête, <strong>formation</strong>, <strong>relais</strong> (managers, ambassadeurs), <strong>célébration</strong> des étapes.</li><li>Le manager de proximité est l'acteur clé : formez-le et donnez-lui les éléments de langage avant les agents.</li></ul>` },
  ],
  memo: `<p><strong>Projet RH</strong> : cadrage → rétro-planning → concertation → instances (CST / CSE) → décision (délibération / arrêtés) → communication → mise en œuvre → bilan.</p><p><strong>Changement</strong> : sens, participation, information, formation, relais, célébration.</p>`,
  cards: [
    ['Rétro-planning', 'Planning construit à rebours à partir d\'une date butoir.'],
    ['Étapes de mise en place du RIFSEEP', 'Diagnostic, groupes de fonctions, cotation, simulation, avis du CST, délibération, arrêtés individuels.'],
    ['Groupe de fonctions (RIFSEEP)', 'Regroupement de postes de même niveau de responsabilité, d\'expertise et de sujétions, qui détermine l\'IFSE.'],
    ['Courbe du changement', 'Refus, résistance, exploration, engagement.'],
    ['Acteur clé de la conduite du changement', 'Le manager de proximité.'],
    ['Sponsor d\'un projet RH dans une collectivité', 'Souvent le DGS et / ou l\'élu en charge du personnel.'],
  ],
  quiz: [
    { q: 'Dans quel ordre ?', c: ['Délibération puis avis du CST', 'Avis du CST puis délibération', 'Arrêtés puis délibération'], a: 1, e: 'L\'avis de l\'instance précède la décision.' },
    { q: 'Les résistances au changement…', c: ['Doivent être ignorées', 'Signalent souvent une inquiétude légitime', 'Sont toujours de la mauvaise volonté'], a: 1, e: 'Les écouter permet d\'améliorer le projet.' },
    { q: 'Le montant d\'IFSE dépend avant tout…', c: ['De l\'ancienneté', 'Du groupe de fonctions du poste', 'Du nombre d\'enfants'], a: 1, e: 'Cotation des postes.' },
    { q: 'Un rétro-planning part…', c: ['D\'aujourd\'hui', 'De la date butoir', 'Du budget'], a: 1, e: 'On remonte le temps.' },
  ],
  cases: [
    { t: 'L\'annonce ratée', s: 'La réorganisation du service technique a été annoncée par e-mail un vendredi soir. Lundi, les agents sont furieux et un syndicat demande une réunion.',
      opts: [{ t: 'On maintient tout, la décision est prise.', s: 1, fb: 'Le passage en force dégrade durablement la confiance.' },
        { t: 'On organise rapidement une réunion d\'information avec la direction et les managers, on explique le sens, on écoute les inquiétudes, on précise le calendrier (dont le passage en CST si ce n\'est pas fait) et les impacts individuels, et on ouvre des temps d\'échange.', s: 10, fb: 'Rattraper par le dialogue ; et retenir pour la prochaine fois : managers informés d\'abord, annonce en présentiel.' },
        { t: 'On suspend tout le projet.', s: 3, fb: 'Pas forcément nécessaire : il faut surtout rétablir le dialogue et sécuriser la procédure.' }] },
  ],
  tf: [
    ['L\'avis du CST doit précéder la délibération.', true, 'Sinon la délibération est fragilisée.'],
    ['Il vaut mieux informer les agents avant les managers.', false, 'Les managers doivent être informés et outillés d\'abord.'],
  ],
});

MODULES.push({
  id: 'qvct', ico: '🛡️', title: 'Santé au travail, prévention et harcèlement', tag: 'commun', level: 'Intermédiaire',
  summary: 'Obligation de sécurité, DUERP, acteurs de la prévention, RPS, harcèlement moral et sexuel, signalement.',
  lessons: [
    { t: 'L\'obligation de prévention', html: `
<p>L'employeur (public ou privé) doit prendre les mesures nécessaires pour assurer la sécurité et protéger la santé physique et mentale des travailleurs. Les règles du Code du travail en matière de santé et sécurité s'appliquent largement aux employeurs publics.</p>
<ul><li><strong>DUERP</strong> (document unique d'évaluation des risques professionnels) : obligatoire dès le premier salarié / agent ; inventaire des risques par unité de travail, cotation, plan d'actions ; mis à jour au moins chaque année (dès 11 salariés dans le privé) et à chaque changement important.</li>
<li><strong>Les 9 principes généraux de prévention</strong> : éviter les risques ; évaluer ceux qui ne peuvent être évités ; combattre à la source ; adapter le travail à l'homme ; tenir compte de l'évolution technique ; remplacer ce qui est dangereux ; planifier la prévention ; privilégier la protection collective ; donner des instructions appropriées.</li></ul>` },
    { t: 'Les acteurs de la prévention (public)', html: `
<ul><li><strong>Assistant(s) et conseiller(s) de prévention</strong> : agents désignés, conseillent l'autorité.</li><li><strong>ACFI</strong> (agent chargé de la fonction d'inspection) : contrôle l'application des règles d'hygiène et sécurité (souvent mis à disposition par le CDG en FPT).</li><li><strong>Service de médecine préventive / de santé au travail</strong> : visites d'information et de prévention, aménagements de poste.</li><li><strong>F3SCT</strong> ou CST / CSA : avis, visites, enquêtes après accident.</li><li><strong>Registre de santé et sécurité au travail</strong> (observations des agents) et <strong>registre de signalement d'un danger grave et imminent</strong> (droit de retrait).</li></ul>
<p><strong>Droit de retrait</strong> : un agent peut se retirer d'une situation de travail dont il a un motif raisonnable de penser qu'elle présente un danger grave et imminent pour sa vie ou sa santé, après avoir alerté. Aucune sanction ni retenue sur traitement si le retrait est justifié.</p>` },
    { t: 'Harcèlement et agissements sexistes', html: `
<ul><li><strong>Harcèlement moral</strong> : agissements répétés ayant pour objet ou pour effet une dégradation des conditions de travail susceptible de porter atteinte aux droits, à la dignité, à la santé ou à l'avenir professionnel.</li><li><strong>Harcèlement sexuel</strong> : propos ou comportements à connotation sexuelle ou sexiste répétés, ou pression grave (même non répétée) dans le but d'obtenir un acte sexuel.</li><li><strong>Agissement sexiste</strong> : lié au sexe, ayant pour objet ou pour effet de porter atteinte à la dignité ou de créer un environnement intimidant, hostile, dégradant, humiliant ou offensant.</li></ul>
<h2>Que faire en tant que RH ?</h2><ol><li>Prendre <strong>tout signalement au sérieux</strong>, recevoir la personne, l'informer de ses droits (dispositif de signalement, protection fonctionnelle, médecin, psychologue).</li><li>Mesures de <strong>protection immédiate</strong> si nécessaire (éloignement, changement d'horaires) sans pénaliser la victime.</li><li><strong>Enquête administrative</strong> interne, impartiale, confidentielle, rapide (auditions, compte rendu).</li><li>Suites : procédure disciplinaire, signalement au procureur si infraction (article 40 du code de procédure pénale pour les agents publics), accompagnement des équipes.</li></ol>
<div class="callout warn">Les victimes et les témoins de bonne foi sont protégés contre toute mesure de représailles.</div>` },
  ],
  memo: `<ul><li><strong>DUERP</strong> obligatoire, mise à jour annuelle.</li><li>9 principes de prévention : éviter → évaluer → combattre à la source → adapter…</li><li><strong>Droit de retrait</strong> : danger grave et imminent, alerte préalable.</li><li>Harcèlement : signalement → protection → enquête → suites (discipline, article 40).</li></ul>`,
  cards: [
    ['DUERP', 'Document unique d\'évaluation des risques professionnels, obligatoire dès le premier salarié / agent.'],
    ['Droit de retrait', 'Possibilité de se retirer d\'une situation de danger grave et imminent, après avoir alerté.'],
    ['ACFI', 'Agent chargé de la fonction d\'inspection en santé et sécurité dans la fonction publique.'],
    ['Assistant de prévention', 'Agent désigné pour conseiller et assister l\'autorité en matière de prévention.'],
    ['Harcèlement moral', 'Agissements répétés dégradant les conditions de travail et portant atteinte aux droits, à la dignité, à la santé ou à l\'avenir professionnel.'],
    ['Article 40 du code de procédure pénale', 'Obligation pour tout agent public de signaler au procureur un crime ou délit dont il a connaissance dans ses fonctions.'],
    ['Premier principe général de prévention', 'Éviter les risques.'],
    ['Enquête administrative', 'Investigation interne impartiale pour établir les faits après un signalement.'],
  ],
  quiz: [
    { q: 'Le DUERP est obligatoire…', c: ['Dès 50 salariés', 'Dès le premier salarié / agent', 'Seulement dans le privé'], a: 1, e: 'Pour tous les employeurs.' },
    { q: 'Le droit de retrait suppose…', c: ['Un simple désaccord', 'Un motif raisonnable de penser à un danger grave et imminent', 'L\'accord du supérieur'], a: 1, e: 'Après alerte.' },
    { q: 'Le harcèlement sexuel peut être caractérisé par un acte unique…', c: ['Jamais', 'Oui, en cas de pression grave dans le but d\'obtenir un acte sexuel', 'Seulement s\'il y a un témoin'], a: 1, e: 'Sinon, des actes répétés.' },
    { q: 'Face à un signalement de harcèlement, la RH doit d\'abord…', c: ['Demander des preuves écrites avant tout', 'Recevoir et protéger la personne, puis enquêter', 'Confronter immédiatement la victime et l\'auteur présumé'], a: 1, e: 'Protection et enquête impartiale.' },
    { q: 'Le premier principe général de prévention est…', c: ['Former', 'Éviter les risques', 'Fournir des équipements individuels'], a: 1, e: 'La protection collective prime sur l\'individuelle.' },
  ],
  cases: [
    { t: 'Le signalement à l\'accueil', s: 'Une agente d\'accueil vous confie que son responsable fait régulièrement des « blagues » sur son physique devant les usagers et lui envoie des messages le soir. Elle ne veut pas « faire d\'histoires ».',
      opts: [{ t: 'Sans plainte écrite, on ne peut rien faire.', s: 0, fb: 'L\'employeur a une obligation d\'agir dès qu\'il a connaissance de faits possibles.' },
        { t: 'On l\'écoute, on l\'informe de ses droits et du dispositif de signalement, on prend des mesures de protection (organisation du travail), on déclenche une enquête administrative impartiale et confidentielle, et on l\'oriente vers le médecin / psychologue du travail.', s: 10, fb: 'C\'est la démarche attendue : protéger, établir les faits, agir.' },
        { t: 'On en parle au responsable pour qu\'il arrête.', s: 3, fb: 'Prévenir l\'auteur présumé sans cadre peut exposer la victime à des représailles et compromettre l\'enquête.' }] },
  ],
  tf: [
    ['Le DUERP n\'est obligatoire qu\'à partir de 11 salariés.', false, 'Dès le premier ; 11 est le seuil de la mise à jour annuelle obligatoire.'],
    ['Un témoin de harcèlement de bonne foi est protégé contre les représailles.', true, 'Comme la victime.'],
    ['Le droit de retrait peut entraîner une retenue sur traitement s\'il est justifié.', false, 'Aucune sanction ni retenue s\'il est justifié.'],
  ],
});

/* Parcours recommandés */
const PATHS = [
  { id: 'public', ico: '🏛️', title: 'Je viens du privé et je découvre le public', desc: 'Le parcours prioritaire de Sara : comprendre la logique statutaire et les sujets du quotidien.', modules: ['passerelle', 'organisation', 'statut', 'carriere', 'remuneration', 'temps', 'sante', 'obligations', 'dialogue', 'formation', 'management', 'pilotage', 'projet', 'qvct', 'recrutement'] },
  { id: 'prive', ico: '🏢', title: 'Consolider les bases du privé', desc: 'Réviser le droit du travail et la paie privée.', modules: ['droitprive', 'remuneration', 'temps', 'sante', 'dialogue', 'formation', 'recrutement', 'qvct'] },
  { id: 'manager', ico: '🧭', title: 'Responsable d\'équipe RH', desc: 'Encadrer, piloter, conduire des projets.', modules: ['management', 'pilotage', 'projet', 'qvct', 'recrutement'] },
];
