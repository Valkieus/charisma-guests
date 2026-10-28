/* Sarah HR — modules de formation (1/3) */
const MODULES = [];

MODULES.push({
  id: 'passerelle', ico: '🌉', title: 'Du privé au public : ce qui change vraiment', tag: 'commun', level: 'Essentiel',
  summary: 'Le module à faire en premier : les grandes différences de logique entre l\'entreprise et l\'administration, et le vocabulaire qui va avec.',
  lessons: [
    { t: 'Deux mondes, deux logiques', html: `
<p>Dans le privé, la relation de travail repose sur un <strong>contrat</strong> négocié entre deux parties (le Code du travail fixe le cadre). Dans la fonction publique, le fonctionnaire est dans une situation <strong>« statutaire et réglementaire »</strong> : ses droits et obligations sont fixés par des textes (le <strong>statut</strong>), que l'administration peut modifier à tout moment, sans son accord.</p>
<table><tr><th></th><th>Privé</th><th>Fonction publique</th></tr>
<tr><td>Texte de référence</td><td>Code du travail + convention collective</td><td>Code général de la fonction publique (CGFP) + statuts particuliers</td></tr>
<tr><td>Acte d'entrée</td><td>Contrat de travail</td><td>Arrêté de nomination (fonctionnaire) ou contrat (contractuel)</td></tr>
<tr><td>Employeur</td><td>L'entreprise</td><td>L'administration (État, collectivité, hôpital)</td></tr>
<tr><td>Accès</td><td>Libre choix de l'employeur</td><td>Principe d'égal accès : concours en règle générale</td></tr>
<tr><td>Rémunération</td><td>Négociée, minimum SMIC / grille conventionnelle</td><td>Grille indiciaire + primes fixées par des textes</td></tr>
<tr><td>Carrière</td><td>Selon l'entreprise</td><td>Grade et échelons, avancement réglementé</td></tr>
<tr><td>Fin de la relation</td><td>Démission, licenciement, rupture conventionnelle…</td><td>Retraite, démission acceptée, mutation, révocation… (licenciement rare)</td></tr>
<tr><td>Juge</td><td>Conseil de prud'hommes</td><td>Tribunal administratif</td></tr>
<tr><td>Représentants du personnel</td><td>CSE, délégués syndicaux</td><td>CAP, CCP, CST / CSA / CSE (FPH)</td></tr></table>
<div class="callout tip">Le réflexe à prendre : dans le public, avant toute décision, demandez-vous <strong>« quel texte me permet de faire cela ? »</strong>. L'administration ne peut agir que si un texte l'y autorise (principe de légalité).</div>` },
    { t: 'Le grade et l\'emploi : la distinction clé', html: `
<p>C'est LA notion qui déroute le plus en venant du privé.</p>
<ul><li>Le <strong>grade</strong> est un titre qui appartient à l'agent : il donne vocation à occuper certains emplois. Exemple : « rédacteur principal de 2e classe ».</li>
<li>L'<strong>emploi</strong> (ou poste) est la fonction exercée : « gestionnaire carrière-paie au service RH ».</li></ul>
<p>Si le poste est supprimé, l'agent conserve son grade (et son traitement). L'employeur doit lui trouver un autre emploi correspondant à son grade.</p>
<p>Les grades sont regroupés en <strong>corps</strong> (État, hôpitaux) ou en <strong>cadres d'emplois</strong> (territoriale). Exemple : le cadre d'emplois des rédacteurs territoriaux comprend trois grades : rédacteur, rédacteur principal de 2e classe, rédacteur principal de 1re classe.</p>
<div class="callout">Phrase type que vous entendrez : « Elle est attachée, mais elle occupe un poste de chargée de mission. » → grade : attaché ; emploi : chargée de mission.</div>` },
    { t: 'Fonctionnaires et contractuels', html: `
<p>Dans une administration cohabitent :</p>
<ul><li>des <strong>fonctionnaires titulaires</strong> : recrutés (en général par concours), nommés, puis titularisés ;</li>
<li>des <strong>fonctionnaires stagiaires</strong> : en période probatoire (souvent 1 an) avant la titularisation ;</li>
<li>des <strong>agents contractuels</strong> (anciennement « non-titulaires ») : recrutés par contrat de droit public dans des cas prévus par la loi ;</li>
<li>des <strong>apprentis</strong>, des <strong>vacataires</strong> (tâche précise et ponctuelle), parfois des salariés de droit privé (contrats aidés).</li></ul>
<p>Les contractuels relèvent eux aussi du droit public et du tribunal administratif, mais d'un régime différent (pas de grade, retraite IRCANTEC, contrat). Après 6 ans de contrats sur des fonctions de même catégorie, ils peuvent obtenir un <strong>CDI de droit public</strong>.</p>` },
    { t: 'Les mots qu\'on va vous dire', html: `
<p>Quelques expressions courantes, traduites :</p>
<table><tr><th>On vous dit…</th><th>Ça veut dire…</th></tr>
<tr><td>« Il faut prendre un arrêté »</td><td>Rédiger la décision écrite de l'autorité (nomination, avancement, temps partiel…).</td></tr>
<tr><td>« Passer en CST »</td><td>Soumettre un projet au comité social territorial pour avis.</td></tr>
<tr><td>« C'est une délibération »</td><td>Une décision votée par l'assemblée (conseil municipal, départemental…), ex. créer un poste.</td></tr>
<tr><td>« Le poste n'est pas au tableau des emplois »</td><td>L'emploi n'a pas été créé par délibération : on ne peut pas y nommer quelqu'un.</td></tr>
<tr><td>« Il est en dispo »</td><td>En disponibilité : position où l'agent cesse temporairement de travailler, sans traitement.</td></tr>
<tr><td>« On le détache »</td><td>Détachement : il exerce ailleurs (autre corps ou administration) tout en gardant ses droits dans son corps d'origine.</td></tr>
<tr><td>« Il a l'IFSE du groupe C1 »</td><td>Son régime indemnitaire correspond au groupe de fonctions C1 du RIFSEEP.</td></tr>
<tr><td>« Il est promouvable »</td><td>Il remplit les conditions pour un avancement de grade (ce n'est pas un droit).</td></tr>
<tr><td>« Le CDG »</td><td>Centre de gestion de la fonction publique territoriale du département.</td></tr></table>
<p>Tous les sigles sont dans le <a href="#/glossary">glossaire</a>, avec un jeu pour les mémoriser.</p>` },
  ],
  memo: `<h3>Les 10 réflexes du privé au public</h3><ol>
<li>Chercher le <strong>texte</strong> (CGFP, décret statutaire, délibération) avant de décider.</li>
<li>Distinguer le <strong>grade</strong> (à l'agent) et l'<strong>emploi</strong> (le poste).</li>
<li>Un emploi permanent doit être <strong>créé par délibération</strong> et publié avant d'être pourvu.</li>
<li>Le fonctionnaire est <strong>nommé par arrêté</strong>, il ne signe pas de contrat.</li>
<li>Le contractuel est recruté pour un <strong>motif légal précis</strong>.</li>
<li>L'avancement d'<strong>échelon</strong> est automatique, celui de <strong>grade</strong> est au choix.</li>
<li>Toute décision individuelle défavorable doit être <strong>motivée</strong> et mentionner les <strong>voies et délais de recours</strong>.</li>
<li>Les litiges vont devant le <strong>tribunal administratif</strong> (délai : 2 mois).</li>
<li>Le dialogue social passe par les <strong>CAP / CCP / CST</strong>.</li>
<li>Le <strong>CDG</strong> (FPT) est votre meilleur allié : ils ont des juristes statutaires.</li></ol>`,
  cards: [
    ['Situation juridique du fonctionnaire', 'Statutaire et réglementaire : droits et obligations fixés par des textes, pas par un contrat.'],
    ['Grade vs emploi', 'Le grade appartient à l\'agent (titre) ; l\'emploi est le poste occupé.'],
    ['Corps / cadre d\'emplois', 'Regroupement de grades : « corps » à l\'État et à l\'hôpital, « cadre d\'emplois » dans la territoriale.'],
    ['Code de référence de la fonction publique', 'Le Code général de la fonction publique (CGFP), en vigueur depuis le 1er mars 2022.'],
    ['Juge des litiges des agents publics', 'Le tribunal administratif (et non les prud\'hommes).'],
    ['Délai de recours contentieux de droit commun', '2 mois à compter de la notification ou de la publication de la décision.'],
    ['Acte de recrutement d\'un fonctionnaire', 'Un arrêté de nomination (acte unilatéral).'],
    ['CDI de droit public', 'Possible pour un contractuel après 6 ans de services publics effectifs sur des fonctions de même catégorie (cas général).'],
    ['Principe de légalité', 'L\'administration ne peut agir que dans le respect et sur le fondement des textes.'],
    ['Délibération', 'Décision votée par l\'assemblée délibérante d\'une collectivité (ex. création d\'un emploi).'],
  ],
  quiz: [
    { q: 'Un fonctionnaire titulaire est lié à son administration par…', c: ['Un contrat de travail', 'Une situation statutaire et réglementaire', 'Une convention collective'], a: 1, e: 'Le fonctionnaire n\'a pas de contrat : il est nommé et soumis au statut.' },
    { q: 'Le grade, c\'est…', c: ['Le poste occupé', 'Le titre qui appartient à l\'agent et donne vocation à certains emplois', 'Le niveau de diplôme'], a: 1, e: 'Le grade est distinct de l\'emploi.' },
    { q: 'Quel juge est compétent pour un litige avec un agent public ?', c: ['Le conseil de prud\'hommes', 'Le tribunal judiciaire', 'Le tribunal administratif'], a: 2, e: 'Les agents publics (fonctionnaires et contractuels de droit public) relèvent du juge administratif.' },
    { q: 'Depuis quand le Code général de la fonction publique est-il en vigueur ?', c: ['1983', '1er mars 2022', '2019'], a: 1, e: 'Il a regroupé à droit constant les grandes lois statutaires de 1983, 1984 et 1986.' },
    { q: 'Dans la fonction publique territoriale, les grades sont regroupés en…', c: ['Corps', 'Cadres d\'emplois', 'Branches'], a: 1, e: 'On parle de corps à l\'État et à l\'hôpital, de cadres d\'emplois en FPT.' },
    { q: 'Un agent contractuel de droit public relève…', c: ['Du Code du travail uniquement', 'Du droit public (CGFP et décrets spécifiques)', 'D\'une convention collective'], a: 1, e: 'Il a un contrat, mais de droit public.' },
    { q: '« Le poste n\'est pas au tableau des emplois » signifie que…', c: ['Le poste n\'a pas été créé par délibération', 'Le poste est déjà pourvu', 'Le poste est réservé aux contractuels'], a: 0, e: 'Sans création par l\'organe délibérant, on ne peut pas nommer d\'agent.' },
    { q: 'Le délai de recours contentieux de droit commun contre une décision administrative est de…', c: ['15 jours', '2 mois', '1 an'], a: 1, e: 'À condition que la décision mentionne les voies et délais de recours.' },
  ],
  cases: [
    { t: 'Le poste supprimé', s: 'La commune réorganise ses services : le poste de « responsable de la régie cantine » occupé par M. Durand (adjoint administratif principal) est supprimé. Le directeur propose de « le licencier comme dans le privé ».',
      opts: [{ t: 'On le licencie pour motif économique.', s: 0, fb: 'Le licenciement économique n\'existe pas pour les fonctionnaires.' },
        { t: 'Il garde son grade : on doit lui proposer un autre emploi correspondant à son grade ; la suppression de poste passe par une délibération après avis du CST. En FPT, s\'il n\'est pas reclassé, il est pris en charge par le CDG.', s: 10, fb: 'Exact : c\'est la conséquence directe de la séparation du grade et de l\'emploi.' },
        { t: 'On le met d\'office en disponibilité.', s: 0, fb: 'La disponibilité d\'office n\'est pas un outil de gestion des suppressions de poste.' }] },
  ],
  tf: [
    ['Un fonctionnaire signe un contrat de travail à son arrivée.', false, 'Il est nommé par arrêté.'],
    ['Si son poste est supprimé, un fonctionnaire conserve son grade.', true, 'Le grade appartient à l\'agent.'],
    ['Un contractuel de droit public relève du conseil de prud\'hommes.', false, 'Il relève du tribunal administratif.'],
    ['Le CGFP a remplacé les lois de 1983, 1984 et 1986.', true, 'Codification en 2022, à droit constant.'],
  ],
});

MODULES.push({
  id: 'organisation', ico: '🏛️', title: 'L\'organisation de la fonction publique', tag: 'public', level: 'Essentiel',
  summary: 'Les trois versants, qui fait quoi (DGAFP, CNFPT, CDG…), les employeurs et les catégories A, B, C.',
  lessons: [
    { t: 'Les trois versants', html: `
<p>Environ <strong>5,7 millions d'agents publics</strong> (environ 1 emploi sur 5 en France), répartis en trois versants :</p>
<table><tr><th>Versant</th><th>Employeurs</th><th>Poids</th></tr>
<tr><td><strong>FPE</strong> — fonction publique de l'État</td><td>Ministères, services déconcentrés (préfectures, DDT…), établissements publics nationaux, enseignants</td><td>≈ 44 %</td></tr>
<tr><td><strong>FPT</strong> — fonction publique territoriale</td><td>Communes, intercommunalités, départements, régions, SDIS, CCAS…</td><td>≈ 35 %</td></tr>
<tr><td><strong>FPH</strong> — fonction publique hospitalière</td><td>Hôpitaux publics, EHPAD publics, établissements sociaux et médico-sociaux publics</td><td>≈ 21 %</td></tr></table>
<p>Les trois versants partagent le même socle (le CGFP) mais ont chacun leurs particularités : en FPT, chaque collectivité est un employeur autonome, dirigé par des élus.</p>` },
    { t: 'Les catégories A, B et C', html: `
<table><tr><th>Catégorie</th><th>Fonctions</th><th>Niveau de recrutement (externe, en général)</th><th>Exemples FPT</th></tr>
<tr><td><strong>A</strong></td><td>Conception, direction, encadrement supérieur</td><td>Licence / master</td><td>Attaché, ingénieur, conseiller socio-éducatif</td></tr>
<tr><td><strong>B</strong></td><td>Application, encadrement intermédiaire</td><td>Baccalauréat (ou bac +2 pour certains grades)</td><td>Rédacteur, technicien, animateur</td></tr>
<tr><td><strong>C</strong></td><td>Exécution</td><td>Sans diplôme ou CAP / BEP</td><td>Adjoint administratif, adjoint technique, ATSEM</td></tr></table>
<p>On parle aussi de « A+ » pour les emplois de direction (administrateurs, ingénieurs en chef…).</p>` },
    { t: 'Les acteurs à connaître', html: `
<ul><li><strong>DGAFP</strong> (direction générale de l'administration et de la fonction publique) : ministère de la fonction publique, élabore les textes.</li>
<li><strong>CNFPT</strong> (Centre national de la fonction publique territoriale) : formation des agents territoriaux, organisation des concours de catégorie A+.</li>
<li><strong>CDG</strong> (centres de gestion, un par département) : concours et examens (A, B, C pour l'essentiel), bourse de l'emploi, CAP et conseil de discipline pour les collectivités affiliées, conseil statutaire, médecine préventive, secrétariat du conseil médical… Affiliation obligatoire pour les collectivités de moins de 350 fonctionnaires.</li>
<li><strong>CNRACL</strong> : caisse de retraite des fonctionnaires territoriaux et hospitaliers. <strong>SRE</strong> (service des retraites de l'État) pour la FPE. <strong>IRCANTEC</strong> : retraite complémentaire des contractuels.</li>
<li><strong>Conseil médical</strong> (départemental) : avis sur les congés pour raison de santé, l'aptitude, l'imputabilité au service.</li>
<li><strong>Tribunal administratif</strong> : juge les litiges.</li></ul>` },
    { t: 'Qui décide dans une collectivité ?', html: `
<ul><li>L'<strong>organe délibérant</strong> (conseil municipal, communautaire, départemental, régional) : crée et supprime les emplois (<strong>tableau des emplois</strong>), vote le budget, fixe le régime indemnitaire, le temps de travail, les ratios d'avancement…</li>
<li>L'<strong>autorité territoriale</strong> (maire, président) : nomme, gère les carrières, signe les arrêtés, prononce les sanctions. Elle peut déléguer sa signature.</li>
<li>Le <strong>DGS</strong> (directeur général des services) : dirige l'administration, met en œuvre les décisions.</li></ul>
<p>À l'État, l'autorité est le ministre (ou le préfet, le recteur… par délégation). À l'hôpital, le directeur d'établissement.</p>` },
  ],
  memo: `<h3>Repères</h3><ul><li>3 versants : <strong>FPE, FPT, FPH</strong>.</li><li>3 catégories : <strong>A</strong> conception, <strong>B</strong> application, <strong>C</strong> exécution.</li><li><strong>CNFPT</strong> = formation (FPT). <strong>CDG</strong> = gestion mutualisée, concours, conseil.</li><li>Conseil municipal <strong>crée</strong> l'emploi ; le maire <strong>nomme</strong>.</li><li>Retraite : <strong>CNRACL</strong> (FPT, FPH), <strong>SRE</strong> (FPE), <strong>IRCANTEC</strong> (contractuels).</li></ul>`,
  cards: [
    ['FPE, FPT, FPH', 'Fonction publique de l\'État, territoriale, hospitalière.'],
    ['Catégorie A', 'Conception et direction — recrutement externe en général niveau licence ou plus.'],
    ['Catégorie B', 'Application et encadrement intermédiaire — niveau baccalauréat (ou bac +2).'],
    ['Catégorie C', 'Exécution — sans diplôme ou niveau CAP/BEP.'],
    ['Rôle du CNFPT', 'Formation des agents territoriaux, concours A+ ; financé par une cotisation des collectivités.'],
    ['Rôle du CDG', 'Concours, bourse de l\'emploi, CAP et conseil de discipline des affiliés, conseil statutaire, médecine préventive…'],
    ['Affiliation obligatoire au CDG', 'Pour les collectivités employant moins de 350 fonctionnaires.'],
    ['Qui crée un emploi territorial ?', 'L\'organe délibérant, par délibération (tableau des emplois).'],
    ['Qui nomme un agent territorial ?', 'L\'autorité territoriale (maire, président) par arrêté.'],
    ['CNRACL', 'Caisse nationale de retraites des agents des collectivités locales (fonctionnaires FPT et FPH).'],
    ['IRCANTEC', 'Retraite complémentaire des agents contractuels de droit public.'],
    ['DGAFP', 'Direction générale de l\'administration et de la fonction publique (État).'],
  ],
  quiz: [
    { q: 'Un agent d\'un EHPAD public relève de…', c: ['La FPE', 'La FPT', 'La FPH'], a: 2, e: 'Les établissements sociaux et médico-sociaux publics relèvent de la FPH (sauf ceux gérés par un CCAS : FPT).' },
    { q: 'Qui crée un poste dans une commune ?', c: ['Le maire seul', 'Le conseil municipal par délibération', 'Le CDG'], a: 1, e: 'L\'organe délibérant crée les emplois.' },
    { q: 'Un concours d\'adjoint administratif territorial est en général organisé par…', c: ['Le CNFPT', 'Le CDG', 'La mairie'], a: 1, e: 'Les CDG organisent la plupart des concours A, B, C ; le CNFPT les concours A+.' },
    { q: 'Le rédacteur territorial est de catégorie…', c: ['A', 'B', 'C'], a: 1, e: 'Cadre d\'emplois de catégorie B, filière administrative.' },
    { q: 'La caisse de retraite d\'un fonctionnaire territorial est…', c: ['La CNRACL', 'L\'IRCANTEC', 'L\'AGIRC-ARRCO'], a: 0, e: 'L\'IRCANTEC concerne les contractuels.' },
    { q: 'Qui signe l\'arrêté de nomination dans une commune ?', c: ['Le maire (autorité territoriale)', 'Le DGS en son nom propre', 'Le préfet'], a: 0, e: 'Le DGS peut signer seulement par délégation.' },
    { q: 'Quelle part des emplois en France relève de la fonction publique ?', c: ['Environ 5 %', 'Environ 20 %', 'Environ 50 %'], a: 1, e: 'Environ 5,7 millions d\'agents, soit 1 emploi sur 5.' },
  ],
  cases: [
    { t: 'Créer un poste de chargé de communication', s: 'Le maire veut recruter un chargé de communication (catégorie A) dès le mois prochain. Il n\'existe aucun poste de ce type.',
      opts: [{ t: 'On publie l\'annonce et on recrute directement.', s: 0, fb: 'Le poste n\'existe pas juridiquement : toute nomination serait illégale.' },
        { t: 'Délibération du conseil municipal créant l\'emploi (grade, temps de travail, éventuelle ouverture aux contractuels), mise à jour du tableau des emplois, déclaration de vacance auprès du CDG, publication, puis recrutement.', s: 10, fb: 'C\'est la séquence complète. Pensez aussi à l\'inscription des crédits au budget.' },
        { t: 'On demande au CDG de nous envoyer quelqu\'un.', s: 2, fb: 'Le CDG peut aider (bourse de l\'emploi), mais il faut d\'abord créer le poste.' }] },
  ],
  tf: [
    ['Les CDG organisent l\'essentiel des concours territoriaux de catégories A, B et C.', true, 'Le CNFPT organise les concours A+.'],
    ['Le maire peut créer seul un emploi permanent.', false, 'C\'est le conseil municipal.'],
    ['La FPT est le versant qui compte le plus d\'agents.', false, 'C\'est la FPE.'],
    ['Un hôpital public emploie des agents de la FPH.', true, 'Les médecins hospitaliers ont toutefois un statut à part.'],
  ],
});

MODULES.push({
  id: 'statut', ico: '📜', title: 'Recrutement : concours, stage et contractuels', tag: 'public', level: 'Essentiel',
  summary: 'Comment on entre dans la fonction publique : concours, liste d\'aptitude, stage, titularisation, et les cas de recours aux contractuels.',
  lessons: [
    { t: 'Le concours, voie de principe', html: `
<p>L'accès aux emplois publics repose sur l'<strong>égalité d'accès</strong> (Déclaration des droits de l'homme de 1789, art. 6) : la voie normale est le <strong>concours</strong>.</p>
<ul><li><strong>Concours externe</strong> : ouvert aux candidats remplissant une condition de diplôme.</li><li><strong>Concours interne</strong> : réservé aux agents publics ayant une certaine durée de services.</li><li><strong>Troisième concours</strong> : pour les personnes ayant une expérience professionnelle dans le privé, un mandat électif ou associatif.</li></ul>
<p>Des épreuves peuvent prendre la forme d'une <strong>RAEP</strong> (reconnaissance des acquis de l'expérience professionnelle) : dossier décrivant le parcours.</p>
<p>Exceptions : certains grades de catégorie C (1er grade) sont accessibles <strong>sans concours</strong>, ainsi que les personnes en situation de handicap (recrutement contractuel ouvrant à titularisation), les emplois de direction…</p>` },
    { t: 'En FPT : la liste d\'aptitude', html: `
<p>Spécificité territoriale : réussir le concours ne donne <strong>pas</strong> de poste. Le lauréat est inscrit sur une <strong>liste d'aptitude</strong> valable <strong>4 ans</strong> (2 ans + 2 réinscriptions annuelles sur demande). Il doit lui-même chercher un emploi dans une collectivité (on l'appelle parfois « reçu-collé » s'il n'en trouve pas).</p>
<p>À l'État, le lauréat est en général affecté par l'administration sur un poste.</p>` },
    { t: 'Le stage et la titularisation', html: `
<ol><li><strong>Nomination stagiaire</strong> par arrêté, sur un emploi vacant (créé, déclaré vacant, publié).</li><li><strong>Stage</strong> : en général 1 an. En FPT, obligation de suivre la <strong>formation d'intégration</strong> (CNFPT) pour être titularisé.</li><li>À la fin : <strong>titularisation</strong>, ou <strong>prorogation</strong> du stage, ou <strong>licenciement</strong> pour insuffisance professionnelle (avec, selon les cas, avis de la CAP).</li></ol>
<div class="callout warn">Le stagiaire n'est pas un « fonctionnaire au rabais » : il a des droits (congés, rémunération). Mais un refus de titularisation en fin de stage n'est pas une sanction et n'a pas à être précédé d'une procédure disciplinaire. Il doit reposer sur l'inaptitude ou l'insuffisance professionnelle, documentée (rapports, entretiens).</div>` },
    { t: 'Les contractuels : quand et comment', html: `
<p>Les emplois permanents sont <strong>en principe occupés par des fonctionnaires</strong>. Le recours aux contractuels n'est possible que dans les cas prévus par la loi. En FPT (articles du CGFP) :</p>
<table><tr><th>Motif</th><th>Article CGFP (FPT)</th><th>Durée</th></tr>
<tr><td>Remplacer un agent momentanément indisponible (maladie, maternité, temps partiel…)</td><td>L332-13</td><td>Durée de l'absence</td></tr>
<tr><td>Vacance temporaire d'emploi dans l'attente d'un fonctionnaire</td><td>L332-14</td><td>1 an, prolongeable jusqu'à 2 ans si la procédure de recrutement n'a pas abouti</td></tr>
<tr><td>Accroissement temporaire d'activité</td><td>L332-23 1°</td><td>12 mois max. sur 18 mois</td></tr>
<tr><td>Accroissement saisonnier</td><td>L332-23 2°</td><td>6 mois max. sur 12 mois</td></tr>
<tr><td>Emplois permanents : pas de cadre d'emplois, besoins du service, petites communes…</td><td>L332-8</td><td>3 ans max., renouvelables ; CDI au-delà de 6 ans</td></tr>
<tr><td>Contrat de projet</td><td>L332-24</td><td>1 à 6 ans, fin à la réalisation du projet</td></tr></table>
<p>Depuis 2021, une <strong>indemnité de fin de contrat</strong> (prime de précarité, 10 %) est due pour certains contrats d'une durée inférieure ou égale à 1 an, sous conditions de rémunération.</p>
<div class="callout tip">Les numéros d'articles changent selon le versant : à l'État et à l'hôpital, ce sont d'autres articles du CGFP. Vérifiez sur Légifrance.</div>` },
  ],
  memo: `<h3>Parcours d'entrée d'un fonctionnaire (FPT)</h3><ol><li>Concours réussi → <strong>liste d'aptitude</strong> (4 ans).</li><li>Emploi créé par délibération + <strong>déclaration de vacance</strong>.</li><li><strong>Arrêté de nomination stagiaire</strong>.</li><li>Stage d'1 an + <strong>formation d'intégration</strong>.</li><li><strong>Titularisation</strong> (ou prorogation / refus).</li></ol><h3>Contractuel : toujours un motif légal</h3><p>Remplacement, vacance temporaire, accroissement d'activité, besoins permanents (L332-8), projet.</p>`,
  cards: [
    ['3 types de concours', 'Externe (diplôme), interne (agents publics), 3e concours (expérience privée, mandats).'],
    ['RAEP', 'Reconnaissance des acquis de l\'expérience professionnelle : épreuve sur dossier de parcours.'],
    ['Liste d\'aptitude (FPT)', 'Liste des lauréats d\'un concours territorial, valable 4 ans ; le lauréat doit trouver un employeur.'],
    ['Durée habituelle du stage', '1 an.'],
    ['Condition de titularisation en FPT', 'Avoir suivi la formation d\'intégration (et avoir donné satisfaction).'],
    ['Issues possibles à la fin du stage', 'Titularisation, prorogation, ou licenciement (refus de titularisation).'],
    ['Article de remplacement d\'un agent absent (FPT)', 'L332-13 du CGFP.'],
    ['Accroissement temporaire d\'activité (FPT)', 'L332-23 1° : 12 mois maximum sur une période de 18 mois.'],
    ['Accroissement saisonnier (FPT)', 'L332-23 2° : 6 mois maximum sur une période de 12 mois.'],
    ['Contrat de projet', 'Contrat de 1 à 6 ans pour mener un projet identifié ; prend fin avec le projet.'],
    ['CDI d\'un contractuel', 'Après 6 ans de services publics effectifs (cas général), renouvellement en CDI.'],
    ['Recrutement sans concours', 'Possible pour certains grades de catégorie C (1er grade), les personnes handicapées (voie contractuelle), les apprentis…'],
  ],
  quiz: [
    { q: 'Après la réussite à un concours territorial, le lauréat…', c: ['Est automatiquement affecté dans une commune', 'Est inscrit sur une liste d\'aptitude et doit trouver un employeur', 'Est titularisé'], a: 1, e: 'Liste d\'aptitude valable 4 ans.' },
    { q: 'La durée habituelle du stage est de…', c: ['3 mois', '1 an', '2 ans'], a: 1, e: 'Elle peut être prorogée.' },
    { q: 'Le refus de titularisation en fin de stage…', c: ['Est une sanction disciplinaire', 'Repose sur l\'insuffisance ou l\'inaptitude professionnelle', 'Est impossible'], a: 1, e: 'Ce n\'est pas une sanction, mais il doit être justifié.' },
    { q: 'Pour remplacer une ATSEM en congé de maternité, on recrute un contractuel sur le fondement de…', c: ['L332-13 (remplacement)', 'L332-23 (accroissement d\'activité)', 'L332-8 (besoins permanents)'], a: 0, e: 'Remplacement d\'un agent momentanément indisponible.' },
    { q: 'Le 3e concours s\'adresse…', c: ['Aux titulaires d\'un master', 'Aux personnes ayant une expérience professionnelle privée ou un mandat', 'Aux agents déjà fonctionnaires'], a: 1, e: 'Il valorise l\'expérience hors fonction publique.' },
    { q: 'Un contrat pour accroissement temporaire d\'activité (FPT) dure au maximum…', c: ['6 mois sur 12', '12 mois sur 18', '3 ans'], a: 1, e: 'Le saisonnier, lui, est limité à 6 mois sur 12.' },
    { q: 'Un emploi permanent est en principe occupé par…', c: ['Un contractuel', 'Un fonctionnaire', 'Un vacataire'], a: 1, e: 'Le recours au contractuel est dérogatoire et encadré.' },
    { q: 'L\'indemnité de fin de contrat dans la fonction publique concerne…', c: ['Tous les contrats', 'Certains contrats d\'1 an ou moins, sous conditions', 'Uniquement les CDI'], a: 1, e: 'Depuis 2021, sous conditions (durée, rémunération, absence de renouvellement…).' },
  ],
  cases: [
    { t: 'Le stagiaire en difficulté', s: 'Un adjoint technique stagiaire accumule les retards et les erreurs depuis 8 mois. Son responsable n\'a rien écrit, « pour ne pas le braquer ». Il veut maintenant refuser sa titularisation.',
      opts: [{ t: 'On refuse la titularisation, le responsable confirmera à l\'oral.', s: 2, fb: 'Sans éléments écrits, le refus risque d\'être annulé par le juge.' },
        { t: 'On organise vite un entretien formalisé avec objectifs écrits, on trace les faits (rapports datés), on peut proroger le stage pour lui laisser une chance réelle, puis on décide sur dossier.', s: 10, fb: 'Bonne approche : le refus doit reposer sur des faits établis et l\'agent doit avoir été mis en mesure de progresser.' },
        { t: 'On le titularise pour éviter un conflit.', s: 3, fb: 'Titulariser un agent manifestement insuffisant engage la collectivité pour toute une carrière.' }] },
  ],
  tf: [
    ['Un lauréat de concours territorial est sûr d\'obtenir un poste.', false, 'Il doit trouver un employeur pendant la validité de la liste d\'aptitude.'],
    ['Le stage dure en général un an.', true, 'Il peut être prorogé.'],
    ['On peut recruter un contractuel sur un emploi permanent sans aucune justification.', false, 'Il faut un motif légal.'],
    ['Le refus de titularisation est une sanction disciplinaire.', false, 'C\'est une mesure liée à l\'insuffisance professionnelle.'],
  ],
});

MODULES.push({
  id: 'carriere', ico: '📈', title: 'Carrière : échelons, grades, positions et mobilité', tag: 'public', level: 'Intermédiaire',
  summary: 'Comment évolue un fonctionnaire : avancement d\'échelon et de grade, promotion interne, LDG, positions statutaires, mobilité.',
  lessons: [
    { t: 'Avancement d\'échelon et de grade', html: `
<p>Chaque grade comporte une série d'<strong>échelons</strong>. À chaque échelon correspond un indice (donc un traitement).</p>
<ul><li><strong>Avancement d'échelon</strong> : en fonction de l'<strong>ancienneté</strong>, selon une durée fixée par le statut particulier (durée unique depuis le protocole PPCR). C'est un <strong>droit</strong>. Un arrêté est pris.</li>
<li><strong>Avancement de grade</strong> : passage au grade supérieur dans le même cadre d'emplois (ex. adjoint administratif → adjoint administratif principal de 2e classe). Il se fait <strong>au choix</strong> (inscription au <strong>tableau annuel d'avancement</strong>), parfois après un <strong>examen professionnel</strong>. L'agent doit remplir des conditions (échelon, ancienneté) : il est alors <strong>« promouvable »</strong>.</li>
<li>En FPT, l'organe délibérant fixe les <strong>ratios « promus / promouvables »</strong> : le pourcentage maximal d'agents promouvables pouvant être promus.</li></ul>` },
    { t: 'La promotion interne et les LDG', html: `
<p>La <strong>promotion interne</strong> permet de changer de cadre d'emplois / corps (souvent de catégorie : C → B, B → A) sans concours, par <strong>liste d'aptitude</strong> établie au choix ou après examen professionnel. Elle est contingentée (quotas liés aux recrutements).</p>
<p>Les <strong>lignes directrices de gestion (LDG)</strong>, issues de la loi du 6 août 2019 de transformation de la fonction publique, fixent :</p>
<ul><li>la <strong>stratégie pluriannuelle de pilotage des ressources humaines</strong> ;</li><li>les <strong>orientations et critères</strong> en matière de promotion et de valorisation des parcours.</li></ul>
<p>Elles sont arrêtées par l'autorité après avis du CST / CSA, pour 6 ans maximum, et communiquées aux agents. Depuis 2021, les <strong>CAP ne donnent plus d'avis</strong> préalable sur les avancements et promotions : la transparence passe par les LDG.</p>` },
    { t: 'Les positions statutaires', html: `
<p>Un fonctionnaire est toujours dans l'une de ces <strong>positions</strong> :</p>
<ul><li><strong>Activité</strong> : il exerce les fonctions de son grade (y compris à temps partiel, en congé, ou en <strong>mise à disposition</strong> auprès d'un autre organisme).</li>
<li><strong>Détachement</strong> : il est placé hors de son corps / cadre d'emplois d'origine pour exercer ailleurs (autre administration, autre corps), en continuant à bénéficier de ses droits à avancement et retraite dans son corps d'origine. Il est réintégré à l'issue.</li>
<li><strong>Disponibilité</strong> : il cesse temporairement de travailler, <strong>sans traitement</strong> et, en principe, sans droits à avancement ni retraite. Disponibilité de droit (élever un enfant de moins de 12 ans, donner des soins à un proche…) ou sur demande (convenances personnelles, création d'entreprise…), ou d'office (fin de droits à congé maladie). Depuis 2019, l'agent qui exerce une activité professionnelle pendant sa disponibilité conserve ses droits à avancement pendant 5 ans maximum.</li>
<li><strong>Congé parental</strong> : pour élever un enfant ; droits à avancement conservés (dans certaines limites).</li></ul>` },
    { t: 'La mobilité', html: `
<ul><li><strong>Mutation</strong> : changement d'employeur ou d'affectation dans le même grade. En FPT, l'agent postule dans une autre collectivité, qui le recrute par voie de mutation ; un préavis peut être imposé (3 mois maximum, sauf accord).</li>
<li><strong>Détachement</strong> puis éventuelle <strong>intégration</strong> dans un autre corps / cadre d'emplois.</li>
<li><strong>Intégration directe</strong> : changement de corps ou cadre d'emplois de même catégorie et niveau, sans détachement préalable.</li>
<li>Mobilité entre versants (État ↔ territoriale ↔ hospitalière) : possible par détachement ou intégration directe.</li></ul>
<div class="callout tip">Pour le service RH, chaque mouvement = un acte (arrêté), une mise à jour du dossier et souvent une information des caisses (CNRACL…) et du CDG.</div>` },
  ],
  memo: `<table><tr><th>Mouvement</th><th>Critère</th><th>Droit ?</th></tr><tr><td>Échelon</td><td>Ancienneté</td><td>Oui</td></tr><tr><td>Grade</td><td>Choix (tableau d'avancement) ± examen pro.</td><td>Non</td></tr><tr><td>Promotion interne</td><td>Choix ou examen, quotas</td><td>Non</td></tr><tr><td>Concours interne</td><td>Réussite</td><td>—</td></tr></table><p><strong>Positions</strong> : activité, détachement, disponibilité, congé parental.</p><p><strong>LDG</strong> : stratégie RH + critères de promotion, avis du CST.</p>`,
  cards: [
    ['Avancement d\'échelon', 'Selon l\'ancienneté, durée fixée par le statut : c\'est un droit.'],
    ['Avancement de grade', 'Au choix de l\'autorité, par tableau annuel d\'avancement, parfois après examen professionnel.'],
    ['Promouvable', 'Agent qui remplit les conditions statutaires d\'avancement de grade (sans droit à être promu).'],
    ['Ratio promus / promouvables', 'Pourcentage fixé par l\'organe délibérant (FPT) limitant le nombre de promotions de grade.'],
    ['Promotion interne', 'Changement de cadre d\'emplois / corps sans concours, par liste d\'aptitude, contingentée.'],
    ['LDG', 'Lignes directrices de gestion : stratégie RH pluriannuelle et critères de promotion (loi du 6 août 2019).'],
    ['Les 4 positions statutaires', 'Activité, détachement, disponibilité, congé parental.'],
    ['Mise à disposition', 'L\'agent reste en position d\'activité dans son administration mais travaille pour un autre organisme.'],
    ['Disponibilité', 'Cessation temporaire de fonctions, sans traitement.'],
    ['Détachement', 'L\'agent exerce hors de son corps d\'origine, en conservant ses droits à avancement et retraite dans celui-ci.'],
    ['PPCR', 'Protocole « Parcours professionnels, carrières et rémunérations » (2016-2021) : refonte des grilles, durée unique d\'échelon.'],
    ['Mutation', 'Changement d\'affectation ou d\'employeur dans le même grade.'],
  ],
  quiz: [
    { q: 'L\'avancement d\'échelon dépend…', c: ['Du mérite', 'De l\'ancienneté', 'De la CAP'], a: 1, e: 'Durée unique depuis PPCR.' },
    { q: 'Un agent « promouvable »…', c: ['Sera forcément promu', 'Remplit les conditions pour pouvoir être promu', 'A réussi un concours'], a: 1, e: 'La promotion reste au choix.' },
    { q: 'Qui fixe les ratios promus/promouvables en FPT ?', c: ['Le CDG', 'L\'organe délibérant', 'La CAP'], a: 1, e: 'Après avis du CST.' },
    { q: 'Depuis 2021, la CAP…', c: ['Donne toujours un avis sur les avancements', 'Ne donne plus d\'avis préalable sur les avancements et promotions', 'A été supprimée'], a: 1, e: 'Les LDG fixent les critères.' },
    { q: 'Un agent en disponibilité pour convenances personnelles…', c: ['Perçoit son traitement', 'Ne perçoit pas de traitement', 'Perçoit un demi-traitement'], a: 1, e: 'Sans traitement.' },
    { q: 'Le détachement permet…', c: ['D\'exercer dans un autre corps ou une autre administration en gardant ses droits dans le corps d\'origine', 'De ne plus travailler', 'De changer de grade automatiquement'], a: 0, e: 'Réintégration à l\'issue.' },
    { q: 'Combien de positions statutaires ?', c: ['2', '4', '7'], a: 1, e: 'Activité, détachement, disponibilité, congé parental.' },
    { q: 'La promotion interne permet notamment…', c: ['De passer de catégorie C à B sans concours', 'D\'augmenter son IFSE', 'D\'obtenir une mutation'], a: 0, e: 'Par liste d\'aptitude, contingentée.' },
  ],
  cases: [
    { t: 'Le tableau d\'avancement', s: 'Cinq agents sont promouvables au grade d\'adjoint technique principal de 1re classe. Le ratio est de 40 %. Un agent très ancien mais peu investi exige d\'être promu « à son tour ».',
      opts: [{ t: 'On promeut les plus anciens, c\'est plus simple.', s: 3, fb: 'L\'ancienneté peut être un critère, mais l\'avancement de grade tient compte de la valeur professionnelle et des critères des LDG.' },
        { t: 'On peut promouvoir au maximum 2 agents (40 % de 5), choisis selon les critères des LDG (valeur professionnelle, acquis de l\'expérience, entretiens professionnels…), en motivant les choix et en les expliquant aux agents.', s: 10, fb: 'Exact. Le ratio s\'applique au nombre de promouvables ; l\'arrondi suit les règles fixées par la délibération.' },
        { t: 'On demande l\'avis de la CAP.', s: 2, fb: 'La CAP n\'est plus consultée sur l\'avancement de grade depuis 2021.' }] },
  ],
  tf: [
    ['L\'avancement de grade est automatique à l\'ancienneté.', false, 'C\'est l\'avancement d\'échelon.'],
    ['Un agent mis à disposition reste en position d\'activité.', true, 'Il travaille pour un autre organisme.'],
    ['Les LDG sont arrêtées après avis du CST / CSA.', true, 'Pour 6 ans maximum.'],
    ['Un agent en disponibilité continue à percevoir son traitement.', false, 'Pas de traitement en disponibilité.'],
  ],
});

MODULES.push({
  id: 'remuneration', ico: '💶', title: 'Rémunération et paie', tag: 'commun', level: 'Intermédiaire',
  summary: 'Le traitement indiciaire, les primes (RIFSEEP, NBI…), les cotisations, et la comparaison avec un bulletin de paie privé.',
  lessons: [
    { t: 'Les éléments de la rémunération publique', html: `
<p>La rémunération d'un fonctionnaire comprend (art. L712-1 du CGFP) :</p>
<ol><li>le <strong>traitement indiciaire</strong> ;</li><li>l'<strong>indemnité de résidence</strong> (0, 1 ou 3 % du traitement selon la commune d'affectation) ;</li><li>le <strong>supplément familial de traitement (SFT)</strong>, si l'agent a des enfants à charge ;</li><li>les <strong>primes et indemnités</strong> instituées par un texte.</li></ol>
<h2>Le traitement indiciaire</h2>
<p>Chaque échelon de chaque grade correspond à un <strong>indice brut (IB)</strong> qui détermine un <strong>indice majoré (IM)</strong>. Le traitement brut mensuel = <strong>IM × valeur du point d'indice</strong>.</p>
<p>Valeur du point depuis le 1er juillet 2023 : <strong>4,92278 € par mois</strong> (soit 5 907,34 € par an pour l'indice 100). Le point est fixé par décret ; il a été peu revalorisé ces dernières années (vérifiez la valeur en vigueur).</p>
<div class="callout">Exemple : IM 400 × 4,92278 € = <strong>1 969,11 € brut par mois</strong> de traitement indiciaire.</div>` },
    { t: 'Primes : RIFSEEP, NBI et autres', html: `
<ul><li><strong>RIFSEEP</strong> (régime indemnitaire tenant compte des fonctions, des sujétions, de l'expertise et de l'engagement professionnel), régime de référence :
<ul><li><strong>IFSE</strong> : versée mensuellement, selon le <strong>groupe de fonctions</strong> du poste (ex. C1, C2 ; B1…), réexaminée en cas de changement de fonctions et au moins tous les 4 ans ;</li><li><strong>CIA</strong> : complément indemnitaire annuel, facultatif, lié à l'engagement et à la manière de servir (appréciés lors de l'entretien professionnel).</li></ul>
En FPT, le RIFSEEP est institué par <strong>délibération</strong>, dans la limite de ce que perçoivent les corps équivalents de l'État (principe de parité).</li>
<li><strong>NBI</strong> (nouvelle bonification indiciaire) : points d'indice majoré supplémentaires attachés à certains emplois (encadrement, accueil du public, quartiers prioritaires…). Elle suit l'emploi, pas l'agent.</li>
<li>Autres : indemnités horaires pour travaux supplémentaires (IHTS), astreintes, prime de fin d'année « avantages acquis » (FPT, si instituée avant 1984)…</li></ul>` },
    { t: 'Les cotisations du fonctionnaire', html: `
<table><tr><th>Retenue</th><th>Base</th><th>Taux salarié</th></tr>
<tr><td>Pension (CNRACL ou SRE)</td><td>Traitement indiciaire + NBI</td><td>11,10 %</td></tr>
<tr><td>RAFP (retraite additionnelle)</td><td>Primes, dans la limite de 20 % du traitement</td><td>5 %</td></tr>
<tr><td>CSG</td><td>98,25 % de la rémunération brute</td><td>9,2 %</td></tr>
<tr><td>CRDS</td><td>98,25 % de la rémunération brute</td><td>0,5 %</td></tr></table>
<p>Particularités : pas de cotisation chômage pour le fonctionnaire (l'employeur public est son propre assureur), la retraite de base n'est calculée que sur le traitement indiciaire (d'où l'importance de l'IM), et une retenue « transfert primes/points » (issue de PPCR) apparaît sur les bulletins.</p>
<p>Les <strong>contractuels</strong> cotisent au régime général de la Sécurité sociale (vieillesse) et à l'<strong>IRCANTEC</strong> sur l'ensemble de leur rémunération, et ont droit à l'assurance chômage.</p>` },
    { t: 'Le bulletin de paie dans le privé', html: `
<ul><li><strong>Salaire de base</strong> : ne peut être inférieur au <strong>SMIC</strong> (revalorisé au moins chaque 1er janvier) ni au minimum de la convention collective. Durée légale : 35 h / semaine, soit 151,67 h / mois.</li>
<li><strong>Heures supplémentaires</strong> : majoration de 25 % (de la 36e à la 43e heure) puis 50 %, sauf accord prévoyant un taux différent (minimum 10 %).</li>
<li><strong>Cotisations salariales</strong> : environ 22 % du brut pour un non-cadre, 25 % pour un cadre (santé, retraite de base et complémentaire AGIRC-ARRCO, CSG/CRDS…).</li>
<li><strong>Charges patronales</strong> : environ 40 à 45 % du brut, fortement réduites au niveau du SMIC (allègements généraux).</li>
<li>Mentions : net à payer avant impôt, <strong>prélèvement à la source</strong>, net payé, <strong>montant net social</strong>.</li></ul>
<div class="callout tip">Ordre de grandeur pour un salarié non-cadre : net ≈ 78 % du brut ; coût employeur ≈ 140 % du brut (moins près du SMIC).</div>` },
  ],
  memo: `<h3>Calculer un traitement</h3><p><strong>Traitement brut = IM × valeur du point</strong> (4,92278 € / mois depuis juillet 2023).</p><ul><li>+ IR (0 / 1 / 3 %) + SFT + NBI (points × valeur du point) + IFSE (+ CIA annuel).</li><li>− CNRACL 11,10 % (traitement + NBI), − RAFP 5 % (primes), − CSG 9,2 % et CRDS 0,5 % sur 98,25 % du brut.</li></ul><h3>Privé</h3><p>Net ≈ 78 % du brut (non-cadre), ≈ 75 % (cadre). Coût ≈ 1,4 × brut.</p>`,
  cards: [
    ['Formule du traitement brut', 'Indice majoré × valeur du point d\'indice.'],
    ['Valeur mensuelle du point (depuis juillet 2023)', '4,92278 € (à vérifier en cas de revalorisation).'],
    ['IB et IM', 'Indice brut (lié à l\'échelon) → indice majoré (sert au calcul de la paie).'],
    ['Les 4 éléments obligatoires de la rémunération', 'Traitement, indemnité de résidence, SFT, primes et indemnités prévues par un texte.'],
    ['RIFSEEP', 'IFSE (mensuelle, selon les fonctions) + CIA (annuel, facultatif, selon l\'engagement).'],
    ['NBI', 'Nouvelle bonification indiciaire : points supplémentaires liés à l\'emploi occupé.'],
    ['Taux de cotisation pension d\'un fonctionnaire', '11,10 % du traitement indiciaire + NBI.'],
    ['RAFP', 'Retraite additionnelle de la fonction publique : 5 % sur les primes, dans la limite de 20 % du traitement.'],
    ['Assiette de la CSG / CRDS', '98,25 % de la rémunération brute (abattement pour frais professionnels).'],
    ['Durée mensuelle légale (privé)', '151,67 heures pour 35 h par semaine.'],
    ['Majoration des heures supplémentaires (privé)', '25 % de la 36e à la 43e heure, 50 % au-delà (sauf accord, minimum 10 %).'],
    ['Indemnité de résidence', '0 %, 1 % ou 3 % du traitement selon la zone géographique d\'affectation.'],
    ['Principe de parité (FPT)', 'Le régime indemnitaire territorial ne peut être plus favorable que celui des corps équivalents de l\'État.'],
  ],
  quiz: [
    { q: 'Un agent à l\'IM 450 perçoit un traitement brut mensuel d\'environ…', c: ['1 500 €', '2 215 €', '4 500 €'], a: 1, e: '450 × 4,92278 ≈ 2 215 €.' },
    { q: 'L\'IFSE est versée…', c: ['Une fois par an', 'Mensuellement', 'Uniquement aux catégories A'], a: 1, e: 'Le CIA, lui, est annuel.' },
    { q: 'La NBI…', c: ['Suit l\'agent tout au long de sa carrière', 'Est attachée à l\'emploi occupé', 'Est une prime annuelle'], a: 1, e: 'Si l\'agent change de poste, il peut la perdre.' },
    { q: 'La cotisation retraite CNRACL d\'un fonctionnaire est calculée sur…', c: ['Tout le salaire, primes comprises', 'Le traitement indiciaire et la NBI', 'Les primes uniquement'], a: 1, e: 'Les primes cotisent au RAFP.' },
    { q: 'Le fonctionnaire cotise-t-il à l\'assurance chômage ?', c: ['Oui, comme dans le privé', 'Non', 'Seulement en catégorie C'], a: 1, e: 'L\'employeur public est en auto-assurance.' },
    { q: 'Dans le privé, la 38e heure de la semaine est majorée (sans accord) de…', c: ['10 %', '25 %', '50 %'], a: 1, e: '25 % jusqu\'à la 43e heure.' },
    { q: 'Le CIA du RIFSEEP est lié…', c: ['À l\'ancienneté', 'À l\'engagement professionnel et à la manière de servir', 'Au nombre d\'enfants'], a: 1, e: 'Il est facultatif.' },
    { q: 'L\'indemnité de résidence peut être de…', c: ['0, 1 ou 3 %', '5 %', '10 %'], a: 0, e: 'Selon la zone géographique.' },
  ],
  cases: [
    { t: 'L\'agent qui ne comprend pas sa paie', s: 'Une adjointe technique vient vous voir : « Ma collègue au même grade et au même échelon gagne 120 € de plus que moi par mois. C\'est injuste ! »',
      opts: [{ t: '« C\'est impossible, vous avez le même indice. »', s: 1, fb: 'Même indice = même traitement, mais pas forcément les mêmes primes ou compléments.' },
        { t: 'On compare les bulletins : même traitement indiciaire, mais la différence peut venir de l\'IFSE (groupe de fonctions différent), d\'une NBI liée au poste, du SFT (enfants), de l\'indemnité de résidence, d\'heures supplémentaires ou d\'une quotité différente. On explique ligne par ligne.', s: 10, fb: 'Excellente démarche pédagogique : la paie publique est très « lisible » une fois qu\'on connaît ses composantes.' },
        { t: 'On augmente son IFSE pour régler le problème.', s: 2, fb: 'L\'IFSE dépend du groupe de fonctions défini par délibération, pas d\'une négociation individuelle.' }] },
  ],
  tf: [
    ['Le traitement brut est égal à l\'indice majoré multiplié par la valeur du point.', true, 'C\'est la formule de base.'],
    ['Les primes d\'un fonctionnaire sont prises en compte pour sa pension CNRACL.', false, 'Elles cotisent au RAFP, régime additionnel.'],
    ['Le CIA est obligatoirement versé chaque année.', false, 'Il est facultatif et modulable.'],
    ['Dans le privé, un cadre a en moyenne des cotisations salariales plus élevées qu\'un non-cadre.', true, 'Environ 25 % contre 22 %.'],
  ],
});

MODULES.push({
  id: 'temps', ico: '⏱️', title: 'Temps de travail, congés et absences', tag: 'commun', level: 'Essentiel',
  summary: '1 607 heures, cycles, ARTT, congés annuels, CET, temps partiel, autorisations d\'absence — dans le public et le privé.',
  lessons: [
    { t: 'La durée du travail', html: `
<ul><li><strong>Référence commune</strong> : 35 heures par semaine, soit <strong>1 607 heures par an</strong> (journée de solidarité incluse). Depuis la loi de 2019, les collectivités ont dû supprimer les régimes dérogatoires plus favorables (sauf sujétions particulières).</li>
<li><strong>Garanties minimales</strong> (public et privé, logique proche) : 10 h de travail par jour maximum, 48 h par semaine et 44 h en moyenne sur 12 semaines, 11 h de repos quotidien, 35 h de repos hebdomadaire consécutif, pause de 20 min après 6 h de travail.</li>
<li><strong>Cycles de travail</strong> (public) : hebdomadaires, pluri-hebdomadaires, annualisés (écoles, espaces verts…). Si le cycle dépasse 35 h, l'agent bénéficie de jours d'<strong>ARTT</strong>. Exemple : 37 h 30 par semaine ≈ 15 jours d'ARTT par an ; 39 h ≈ 23 jours.</li></ul>` },
    { t: 'Les congés annuels', html: `
<table><tr><th></th><th>Fonction publique</th><th>Privé</th></tr>
<tr><td>Droit annuel</td><td>5 fois les obligations hebdomadaires de service : 25 jours ouvrés pour 5 jours / semaine</td><td>2,5 jours ouvrables par mois, soit 30 jours ouvrables (5 semaines)</td></tr>
<tr><td>Période de référence</td><td>Année civile</td><td>1er juin – 31 mai (sauf accord)</td></tr>
<tr><td>Bonus</td><td>Jours de fractionnement : +1 si 5 à 7 jours pris hors 1er mai – 31 octobre, +2 si 8 jours ou plus</td><td>Jours de fractionnement selon les règles légales / conventionnelles</td></tr>
<tr><td>Règle de prise</td><td>Pas plus de 31 jours consécutifs (sauf exceptions)</td><td>Congé principal d'au moins 12 jours continus entre mai et octobre ; 24 jours ouvrables consécutifs max.</td></tr>
<tr><td>Report</td><td>En principe non, sauf autorisation ou CET ; report de droit après une maladie</td><td>Report possible après maladie (15 mois)</td></tr></table>
<p>Le <strong>compte épargne-temps (CET)</strong> permet d'épargner des jours de congés et d'ARTT non pris (dans le public, au-delà de 20 jours de congés annuels pris dans l'année), jusqu'à 60 jours.</p>` },
    { t: 'Temps partiel, ASA et congés familiaux', html: `
<ul><li><strong>Temps partiel</strong> (public) : <em>de droit</em> (naissance ou adoption jusqu'aux 3 ans de l'enfant, soins à un proche, handicap…) à 50, 60, 70 ou 80 % ; <em>sur autorisation</em> (50 à 90 %) sous réserve des nécessités de service. Rémunération : 80 % de temps = 85,7 % du traitement (6/7), 90 % = 91,4 % (32/35).</li>
<li><strong>ASA</strong> (autorisations spéciales d'absence) : mariage, décès, garde d'enfant malade, examens médicaux liés à la grossesse, mandat syndical, juré d'assises… Certaines sont fixées par décret, d'autres par la délibération / le règlement de l'employeur.</li>
<li><strong>Maternité</strong> : 16 semaines pour les deux premiers enfants (6 avant, 10 après), plus pour le troisième et les naissances multiples. <strong>Paternité et accueil de l'enfant</strong> : 25 jours calendaires (32 en cas de naissances multiples), en plus des 3 jours de naissance. Règles identiques dans leur principe pour le public et le privé.</li></ul>` },
  ],
  memo: `<ul><li><strong>1 607 h</strong> / an = référence.</li><li>Max <strong>10 h / jour, 48 h / semaine</strong> ; repos <strong>11 h</strong> quotidien, <strong>35 h</strong> hebdomadaire.</li><li>Public : <strong>25 jours</strong> de congés (temps plein, 5 j / sem.) + fractionnement ; privé : <strong>30 jours ouvrables</strong>.</li><li>ARTT si cycle > 35 h.</li><li>Temps partiel 80 % = <strong>6/7</strong> du traitement.</li></ul>`,
  cards: [
    ['Durée annuelle de référence', '1 607 heures (journée de solidarité incluse).'],
    ['Durée maximale quotidienne', '10 heures.'],
    ['Repos quotidien minimal', '11 heures consécutives.'],
    ['Durée maximale hebdomadaire', '48 heures, et 44 heures en moyenne sur 12 semaines.'],
    ['Congés annuels d\'un fonctionnaire à temps plein (5 jours/semaine)', '25 jours ouvrés (5 fois les obligations hebdomadaires).'],
    ['Jours de fractionnement (public)', '+1 jour si 5 à 7 jours pris hors du 1er mai – 31 octobre ; +2 si 8 jours ou plus.'],
    ['Congés payés dans le privé', '2,5 jours ouvrables par mois de travail effectif, soit 30 jours par an.'],
    ['ARTT', 'Jours de réduction du temps de travail accordés quand le cycle dépasse 35 heures par semaine.'],
    ['CET', 'Compte épargne-temps : jours de congés / ARTT épargnés, 60 jours maximum.'],
    ['Rémunération d\'un temps partiel à 80 %', '6/7 du traitement, soit environ 85,7 %.'],
    ['Durée de la pause obligatoire', '20 minutes dès 6 heures de travail quotidien.'],
    ['Congé de paternité et d\'accueil de l\'enfant', '25 jours calendaires (32 en cas de naissances multiples), en plus des 3 jours de naissance.'],
  ],
  quiz: [
    { q: 'La durée annuelle de travail de référence est de…', c: ['1 547 h', '1 607 h', '1 820 h'], a: 1, e: 'Journée de solidarité incluse.' },
    { q: 'Un agent à temps plein sur 5 jours a droit à combien de jours de congés annuels ?', c: ['20', '25', '30'], a: 1, e: '5 × 5 jours.' },
    { q: 'Un salarié du privé à temps plein acquiert par mois…', c: ['2 jours ouvrés', '2,5 jours ouvrables', '3 jours'], a: 1, e: '30 jours ouvrables par an.' },
    { q: 'Un agent travaillant 37 h 30 par semaine…', c: ['N\'a droit à rien de plus', 'Bénéficie de jours d\'ARTT', 'Est payé en heures supplémentaires'], a: 1, e: 'Environ 15 jours par an.' },
    { q: 'Le repos quotidien minimal est de…', c: ['8 h', '11 h', '12 h'], a: 1, e: 'Règle commune au privé et au public.' },
    { q: 'Un agent à 80 % est payé…', c: ['80 %', '85,7 % (6/7)', '90 %'], a: 1, e: 'Règle spécifique aux quotités de 80 et 90 %.' },
    { q: 'Le temps partiel est de droit…', c: ['Pour tout agent qui le demande', 'Notamment pour élever un enfant de moins de 3 ans', 'Jamais'], a: 1, e: 'Les autres demandes sont soumises aux nécessités de service.' },
    { q: 'Un agent peut-il partir 6 semaines d\'affilée en congés annuels ?', c: ['Oui, toujours', 'Non : 31 jours consécutifs maximum, sauf exceptions', 'Oui, s\'il a un CET'], a: 1, e: 'Des dérogations existent (ex. agents originaires d\'outre-mer).' },
  ],
  cases: [
    { t: 'Les jours de fractionnement', s: 'Un agent a pris 20 jours de congés en juillet-août et ses 5 derniers jours la semaine de Noël. Il demande s\'il a droit à « un bonus ».',
      opts: [{ t: 'Non, les jours de fractionnement n\'existent que dans le privé.', s: 0, fb: 'Ils existent aussi dans la fonction publique.' },
        { t: 'Oui : il a pris 5 jours en dehors de la période du 1er mai au 31 octobre, il a droit à 1 jour supplémentaire (il en aurait eu 2 avec 8 jours ou plus).', s: 10, fb: 'Exact.' },
        { t: 'Oui, 2 jours.', s: 4, fb: 'Il faut 8 jours hors période pour obtenir 2 jours.' }] },
  ],
  tf: [
    ['La durée de référence annuelle est de 1 607 heures.', true, 'Pour un temps plein.'],
    ['Les jours de fractionnement n\'existent pas dans la fonction publique.', false, 'Ils existent : 1 ou 2 jours.'],
    ['Un agent à 80 % perçoit 80 % de son traitement.', false, 'Il perçoit 6/7, soit environ 85,7 %.'],
    ['Le CET permet d\'épargner des jours de congés non pris.', true, '60 jours maximum.'],
  ],
});
