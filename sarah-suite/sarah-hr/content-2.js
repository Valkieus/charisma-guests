/* Sarah HR — modules de formation (2/3) */

MODULES.push({
  id: 'sante', ico: '🩺', title: 'Maladie, accidents et inaptitude', tag: 'commun', level: 'Intermédiaire',
  summary: 'CMO, CLM, CLD, CITIS, conseil médical, temps partiel thérapeutique, reclassement — et les règles du privé.',
  lessons: [
    { t: 'Les congés pour raison de santé du fonctionnaire', html: `
<table><tr><th>Congé</th><th>Durée maximale</th><th>Rémunération</th></tr>
<tr><td><strong>CMO</strong> — congé de maladie ordinaire</td><td>1 an sur 12 mois consécutifs</td><td>3 mois à plein traitement (90 % du traitement depuis mars 2025), puis 9 mois à demi-traitement</td></tr>
<tr><td><strong>CLM</strong> — congé de longue maladie</td><td>3 ans</td><td>1 an plein traitement, 2 ans demi-traitement</td></tr>
<tr><td><strong>CLD</strong> — congé de longue durée (5 affections : cancer, maladie mentale, tuberculose, poliomyélite, déficit immunitaire grave acquis)</td><td>5 ans par affection</td><td>3 ans plein traitement, 2 ans demi-traitement</td></tr>
<tr><td><strong>CITIS</strong> — congé pour invalidité temporaire imputable au service (accident de service, de trajet, maladie professionnelle)</td><td>Jusqu'à la reprise ou la mise à la retraite</td><td>Plein traitement + remboursement des frais médicaux</td></tr></table>
<ul><li><strong>Jour de carence</strong> : 1 jour non rémunéré au début d'un CMO (sauf exceptions : CITIS, ALD…).</li><li>L'arrêt doit être transmis dans les <strong>48 heures</strong>.</li><li>Pendant les périodes à demi-traitement, l'agent conserve l'intégralité du SFT et de l'indemnité de résidence, et peut percevoir des garanties de prévoyance.</li><li>Les contractuels relèvent principalement du régime général (indemnités journalières) avec un complément employeur selon l'ancienneté.</li></ul>` },
    { t: 'Le conseil médical et la reprise', html: `
<p>Depuis 2022, le <strong>conseil médical</strong> (formation restreinte ou plénière) a remplacé le comité médical et la commission de réforme. Il est consulté notamment pour :</p>
<ul><li>la <strong>prolongation d'un CMO au-delà de 6 mois</strong> consécutifs ;</li><li>l'octroi et le renouvellement d'un CLM / CLD ;</li><li>l'aptitude à la reprise après 12 mois de CMO, ou après CLM / CLD ;</li><li>la mise en disponibilité d'office, la retraite pour invalidité ;</li><li>l'imputabilité au service, en cas de doute (formation plénière).</li></ul>
<h2>Après la maladie : aménager, reclasser</h2>
<ul><li><strong>Temps partiel pour raison thérapeutique (TPT)</strong> : reprise progressive avec plein traitement ; possible même sans arrêt préalable ; 1 an maximum par affection (renouvelable par périodes).</li><li><strong>Aménagement de poste</strong> (médecin du travail / service de médecine préventive).</li><li><strong>Période de préparation au reclassement (PPR)</strong> : jusqu'à 1 an, rémunérée, pour l'agent inapte à ses fonctions, afin de préparer un nouveau métier.</li><li><strong>Reclassement</strong> dans un autre emploi, voire un autre corps / cadre d'emplois.</li><li>En dernier recours : disponibilité d'office pour raison de santé, retraite pour invalidité.</li></ul>` },
    { t: 'Dans le privé : arrêt maladie et accident du travail', html: `
<ul><li>Le salarié transmet l'arrêt sous <strong>48 heures</strong> à la CPAM et à l'employeur.</li><li><strong>Indemnités journalières (IJSS)</strong> de la Sécurité sociale : après <strong>3 jours de carence</strong>, 50 % du salaire journalier de base (dans la limite d'un plafond).</li><li><strong>Maintien de salaire par l'employeur</strong> (loi ou convention collective, plus favorable) : à partir d'1 an d'ancienneté, 90 % puis 66,66 % de la rémunération brute, après 7 jours de carence (souvent supprimés par la convention).</li><li><strong>Accident du travail / maladie professionnelle (AT/MP)</strong> : pas de carence Sécurité sociale, IJ plus élevées, protection contre le licenciement pendant l'arrêt. Déclaration de l'accident par l'employeur à la CPAM dans les 48 heures.</li><li><strong>Visite de reprise</strong> obligatoire après : maternité, maladie professionnelle, AT d'au moins 30 jours, maladie non professionnelle d'au moins 60 jours.</li><li><strong>Inaptitude</strong> constatée par le médecin du travail : obligation de recherche de reclassement ; à défaut, licenciement pour inaptitude.</li></ul>` },
  ],
  memo: `<table><tr><th></th><th>Durée</th><th>Plein tt</th><th>Demi-tt</th></tr><tr><td>CMO</td><td>1 an</td><td>3 mois (90 %)</td><td>9 mois</td></tr><tr><td>CLM</td><td>3 ans</td><td>1 an</td><td>2 ans</td></tr><tr><td>CLD</td><td>5 ans</td><td>3 ans</td><td>2 ans</td></tr><tr><td>CITIS</td><td>jusqu'à reprise</td><td>oui</td><td>—</td></tr></table><p>Conseil médical : CMO &gt; 6 mois, CLM, CLD, reprise après 12 mois, invalidité. Privé : carence 3 j (IJSS), visite de reprise après 60 j de maladie.</p>`,
  cards: [
    ['CMO', 'Congé de maladie ordinaire : 1 an max. sur 12 mois ; 3 mois à plein traitement (90 %) puis 9 mois à demi-traitement.'],
    ['CLM', 'Congé de longue maladie : 3 ans (1 an plein traitement, 2 ans demi).'],
    ['CLD', 'Congé de longue durée : 5 ans par affection (3 ans plein, 2 ans demi) pour 5 groupes d\'affections.'],
    ['CITIS', 'Congé pour invalidité temporaire imputable au service : plein traitement jusqu\'à la reprise, frais pris en charge.'],
    ['Conseil médical', 'Instance médicale départementale qui a remplacé en 2022 le comité médical et la commission de réforme.'],
    ['Saisine obligatoire du conseil médical pour un CMO', 'Au-delà de 6 mois consécutifs de congé.'],
    ['Jour de carence (public)', '1 jour non rémunéré au début de chaque CMO (sauf exceptions).'],
    ['Délai de carence IJSS (privé)', '3 jours.'],
    ['TPT', 'Temps partiel pour raison thérapeutique : reprise progressive à plein traitement.'],
    ['PPR', 'Période de préparation au reclassement : jusqu\'à 1 an pour préparer un changement de métier.'],
    ['Visite de reprise après maladie non professionnelle (privé)', 'Obligatoire après un arrêt d\'au moins 60 jours.'],
    ['Délai d\'envoi d\'un arrêt de travail', '48 heures.'],
  ],
  quiz: [
    { q: 'Un fonctionnaire en CMO depuis 4 mois est rémunéré…', c: ['À plein traitement', 'À demi-traitement', 'Il n\'est plus payé'], a: 1, e: 'Plein traitement les 3 premiers mois seulement.' },
    { q: 'Le CLD concerne…', c: ['Toute maladie de plus de 6 mois', '5 groupes d\'affections (cancer, maladie mentale…)', 'Les accidents de service'], a: 1, e: 'Les autres affections graves relèvent du CLM.' },
    { q: 'Un accident survenu pendant le service relève…', c: ['Du CMO', 'Du CITIS', 'Du CLD'], a: 1, e: 'Plein traitement et prise en charge des frais.' },
    { q: 'Le conseil médical doit être saisi pour prolonger un CMO au-delà de…', c: ['1 mois', '6 mois', '12 mois'], a: 1, e: 'Au-delà de 6 mois consécutifs.' },
    { q: 'Le temps partiel thérapeutique est rémunéré…', c: ['Au prorata du temps travaillé', 'À plein traitement', 'À demi-traitement'], a: 1, e: 'C\'est tout son intérêt.' },
    { q: 'Dans le privé, la carence de la Sécurité sociale est de…', c: ['1 jour', '3 jours', '7 jours'], a: 1, e: 'L\'employeur ou la convention peut compenser.' },
    { q: 'Après 65 jours d\'arrêt maladie non professionnelle, un salarié…', c: ['Reprend sans formalité', 'Doit passer une visite de reprise', 'Est licencié'], a: 1, e: 'Seuil : 60 jours.' },
    { q: 'Quelle instance a remplacé le comité médical et la commission de réforme ?', c: ['Le CST', 'Le conseil médical', 'La CAP'], a: 1, e: 'Réforme de 2022.' },
  ],
  cases: [
    { t: 'Le passage à demi-traitement', s: 'Un agent en CMO depuis bientôt 3 mois vous appelle, inquiet : son collègue lui a dit qu\'il allait « perdre la moitié de son salaire ».',
      opts: [{ t: 'On lui dit que ce n\'est pas notre problème.', s: 0, fb: 'L\'accompagnement est une mission RH.' },
        { t: 'On lui explique le passage à demi-traitement au-delà de 3 mois, le maintien du SFT et de l\'indemnité de résidence, on vérifie sa prévoyance (garantie maintien de salaire), et on lui indique la possibilité de demander un CLM si sa pathologie le justifie (avec effet rétroactif possible).', s: 10, fb: 'Exactement : anticiper évite des situations financières difficiles.' },
        { t: 'On le place d\'office en CLM.', s: 2, fb: 'Le CLM est accordé sur demande / certificat médical et avis du conseil médical.' }] },
  ],
  tf: [
    ['Le CMO est rémunéré à plein traitement pendant 1 an.', false, '3 mois à plein traitement, puis 9 mois à demi.'],
    ['Le CITIS donne droit au plein traitement.', true, 'Jusqu\'à la reprise ou la retraite.'],
    ['Le conseil médical a remplacé le comité médical.', true, 'Depuis 2022.'],
    ['Dans le privé, la visite de reprise est obligatoire après 15 jours d\'arrêt maladie.', false, 'Après 60 jours (maladie non professionnelle).'],
  ],
});

MODULES.push({
  id: 'obligations', ico: '⚖️', title: 'Droits, obligations, déontologie et discipline', tag: 'public', level: 'Intermédiaire',
  summary: 'Neutralité, laïcité, secret, cumul d\'activités, protection fonctionnelle, et la procédure disciplinaire en 4 groupes.',
  lessons: [
    { t: 'Droits et obligations de l\'agent public', html: `
<h2>Droits</h2><ul><li>Liberté d'opinion, droit syndical, droit de grève (avec des limites : service minimum, préavis).</li><li>Droit à rémunération après service fait, droit à la formation, droit à la protection de la santé.</li><li><strong>Protection fonctionnelle</strong> : l'administration doit protéger l'agent attaqué (menaces, violences, diffamation) ou poursuivi pénalement pour des faits liés à ses fonctions (sauf faute personnelle) : assistance juridique, prise en charge des frais, réparation.</li><li>Accès à son dossier individuel.</li></ul>
<h2>Obligations</h2><ul><li><strong>Dignité, impartialité, intégrité, probité</strong>.</li><li><strong>Neutralité et laïcité</strong> : pas de manifestation de ses opinions religieuses ou politiques dans le service.</li><li><strong>Obéissance hiérarchique</strong>, sauf ordre manifestement illégal et de nature à compromettre gravement un intérêt public.</li><li><strong>Secret professionnel</strong> et <strong>discrétion professionnelle</strong>.</li><li><strong>Devoir de réserve</strong> (expression publique mesurée, apprécié selon les fonctions).</li><li>Consacrer l'intégralité de son activité professionnelle à ses fonctions : <strong>cumul d'activités</strong> encadré (déclaration ou autorisation selon les cas).</li><li>Prévention des <strong>conflits d'intérêts</strong> ; déclarations d'intérêts / de patrimoine pour certains emplois.</li></ul>` },
    { t: 'Les référents', html: `
<ul><li><strong>Référent déontologue</strong> : conseille les agents sur leurs obligations (cumul, conflits d'intérêts…). Il peut aussi recevoir les alertes (lanceurs d'alerte).</li><li><strong>Référent laïcité</strong> (obligatoire depuis 2021) : conseille agents et encadrants sur l'application du principe de laïcité.</li><li><strong>Dispositif de signalement</strong> des actes de violence, de discrimination, de harcèlement moral ou sexuel et des agissements sexistes : obligatoire pour tous les employeurs publics.</li></ul>
<p>En FPT, ces fonctions sont souvent assurées par le CDG pour les collectivités affiliées.</p>` },
    { t: 'La procédure disciplinaire', html: `
<p>Les sanctions applicables aux fonctionnaires sont réparties en <strong>4 groupes</strong> (article L533-1 du CGFP) :</p>
<table><tr><th>Groupe</th><th>Sanctions</th><th>Conseil de discipline</th></tr>
<tr><td>1er</td><td>Avertissement, blâme, exclusion temporaire de fonctions de 1 à 3 jours</td><td>Non</td></tr>
<tr><td>2e</td><td>Radiation du tableau d'avancement, abaissement d'échelon, exclusion temporaire de 4 à 15 jours (et, à l'État, déplacement d'office)</td><td>Oui</td></tr>
<tr><td>3e</td><td>Rétrogradation, exclusion temporaire de 16 jours à 2 ans</td><td>Oui</td></tr>
<tr><td>4e</td><td>Mise à la retraite d'office, révocation</td><td>Oui</td></tr></table>
<ul><li><strong>Droits de la défense</strong> : l'agent est informé des faits, de son droit à consulter son dossier intégral et à se faire assister par un ou plusieurs défenseurs. Même pour un avertissement.</li><li><strong>Prescription</strong> : l'action disciplinaire doit être engagée dans les <strong>3 ans</strong> à compter de la connaissance des faits.</li><li><strong>Suspension</strong> : en cas de faute grave, mesure conservatoire (pas une sanction) de 4 mois maximum, avec maintien du traitement.</li><li>La sanction doit être <strong>proportionnée</strong>, motivée, notifiée avec les voies de recours. L'avertissement n'est pas inscrit au dossier ; blâme et exclusion ≤ 3 jours sont effacés au bout de 3 ans sans nouvelle sanction.</li></ul>
<div class="callout tip">Dans le privé : avertissement, blâme, mise à pied, mutation, rétrogradation, licenciement — fixés par le règlement intérieur. Prescription des faits : 2 mois ; sanction notifiée entre 2 jours ouvrables et 1 mois après l'entretien préalable.</div>` },
  ],
  memo: `<h3>Les 4 groupes de sanctions</h3><ol><li>Avertissement, blâme, exclusion 1–3 j (sans conseil de discipline)</li><li>Radiation tableau d'avancement, abaissement d'échelon, exclusion 4–15 j</li><li>Rétrogradation, exclusion 16 j – 2 ans</li><li>Mise à la retraite d'office, révocation</li></ol><p>Prescription : <strong>3 ans</strong>. Suspension : <strong>4 mois</strong> max., traitement maintenu. Droits de la défense : toujours.</p>`,
  cards: [
    ['Protection fonctionnelle', 'Obligation de l\'administration de protéger et défendre l\'agent attaqué ou poursuivi pour des faits liés à ses fonctions.'],
    ['Limite de l\'obéissance hiérarchique', 'Ordre manifestement illégal ET de nature à compromettre gravement un intérêt public.'],
    ['Secret vs discrétion professionnelle', 'Secret : informations sur les personnes, protégé pénalement ; discrétion : faits et documents connus dans le service.'],
    ['Devoir de réserve', 'Retenue dans l\'expression publique de ses opinions, appréciée selon le niveau de responsabilité.'],
    ['Sanctions du 1er groupe', 'Avertissement, blâme, exclusion temporaire de 1 à 3 jours — sans conseil de discipline.'],
    ['Sanctions du 4e groupe', 'Mise à la retraite d\'office, révocation.'],
    ['Prescription de l\'action disciplinaire (public)', '3 ans à compter du jour où l\'administration a eu connaissance des faits.'],
    ['Suspension', 'Mesure conservatoire en cas de faute grave : 4 mois maximum, traitement maintenu.'],
    ['Référent déontologue', 'Conseille les agents sur leurs obligations déontologiques, reçoit les alertes.'],
    ['Référent laïcité', 'Obligatoire depuis 2021 : conseille agents et chefs de service sur la laïcité.'],
    ['Prescription disciplinaire dans le privé', '2 mois à compter de la connaissance des faits par l\'employeur.'],
    ['Cumul d\'activités', 'Principe : activité consacrée aux fonctions ; exceptions sur déclaration ou autorisation.'],
  ],
  quiz: [
    { q: 'Un blâme nécessite-t-il un conseil de discipline ?', c: ['Oui', 'Non, c\'est une sanction du 1er groupe', 'Seulement en catégorie A'], a: 1, e: 'Mais les droits de la défense s\'appliquent.' },
    { q: 'La révocation appartient au…', c: ['2e groupe', '3e groupe', '4e groupe'], a: 2, e: 'Avec la mise à la retraite d\'office.' },
    { q: 'L\'action disciplinaire se prescrit dans le public par…', c: ['2 mois', '1 an', '3 ans'], a: 2, e: 'À partir de la connaissance des faits.' },
    { q: 'Un agent suspendu…', c: ['N\'est plus payé', 'Conserve son traitement', 'Perd son grade'], a: 1, e: 'Mesure conservatoire, pas une sanction.' },
    { q: 'Un agent peut refuser d\'obéir à un ordre…', c: ['Qu\'il juge inutile', 'Manifestement illégal et compromettant gravement un intérêt public', 'Jamais'], a: 1, e: 'Les deux conditions sont cumulatives.' },
    { q: 'La protection fonctionnelle s\'applique quand…', c: ['L\'agent est agressé en raison de ses fonctions', 'L\'agent a commis une faute personnelle détachable', 'L\'agent a un litige privé'], a: 0, e: 'Elle ne couvre pas la faute personnelle.' },
    { q: 'Une agente porte un signe religieux ostensible au guichet. Le principe en cause est…', c: ['La discrétion', 'La neutralité / laïcité', 'Le secret professionnel'], a: 1, e: 'Les agents publics sont soumis à une stricte neutralité religieuse dans le service.' },
    { q: 'Avant de prononcer un avertissement, il faut…', c: ['Rien', 'Informer l\'agent de son droit à consulter son dossier et à être assisté', 'Réunir la CAP'], a: 1, e: 'Les droits de la défense valent pour toute sanction.' },
  ],
  cases: [
    { t: 'Les propos sur les réseaux sociaux', s: 'Un responsable de service critique violemment et publiquement le maire et ses choix sur un réseau social, en indiquant ses fonctions.',
      opts: [{ t: 'C\'est sa liberté d\'expression, on ne fait rien.', s: 2, fb: 'La liberté d\'opinion existe, mais l\'expression publique est limitée par le devoir de réserve, d\'autant plus que les responsabilités sont élevées.' },
        { t: 'On rappelle par écrit le devoir de réserve ; si les faits sont graves ou répétés, on peut engager une procédure disciplinaire en respectant les droits de la défense et la proportionnalité.', s: 10, fb: 'Bonne gradation : rappel, puis discipline si nécessaire, sanction proportionnée.' },
        { t: 'Révocation immédiate.', s: 0, fb: 'Disproportionné et irrégulier sans conseil de discipline.' }] },
  ],
  tf: [
    ['Un avertissement nécessite un conseil de discipline.', false, 'Sanction du 1er groupe.'],
    ['La suspension est une sanction disciplinaire.', false, 'C\'est une mesure conservatoire.'],
    ['Les agents publics doivent respecter le principe de neutralité.', true, 'Y compris religieuse.'],
    ['L\'action disciplinaire dans la fonction publique se prescrit par 3 ans.', true, 'Depuis la loi de 2016.'],
  ],
});

MODULES.push({
  id: 'dialogue', ico: '🗣️', title: 'Dialogue social et instances', tag: 'commun', level: 'Intermédiaire',
  summary: 'CAP, CCP, CST / CSA, F3SCT, élections professionnelles 2026 — et le CSE dans le privé.',
  lessons: [
    { t: 'Les instances de la fonction publique', html: `
<table><tr><th>Instance</th><th>Pour qui</th><th>Compétences principales</th></tr>
<tr><td><strong>CAP</strong> — commission administrative paritaire</td><td>Fonctionnaires, une CAP par catégorie (A, B, C)</td><td>Décisions individuelles défavorables : refus de titularisation, licenciement pour insuffisance, refus de temps partiel ou de formation, révision du compte rendu d'entretien professionnel, conseil de discipline (2e à 4e groupe)</td></tr>
<tr><td><strong>CCP</strong> — commission consultative paritaire</td><td>Contractuels</td><td>Équivalent de la CAP pour les contractuels (licenciement, sanctions…)</td></tr>
<tr><td><strong>CST</strong> (territoriale) / <strong>CSA</strong> (État) / <strong>CSE</strong> (hospitalière)</td><td>Tous les agents</td><td>Questions collectives : organisation des services, LDG, RSU, plan de formation, égalité professionnelle, temps de travail, régime indemnitaire, santé et sécurité</td></tr>
<tr><td><strong>F3SCT</strong> — formation spécialisée en santé, sécurité et conditions de travail</td><td>Au sein du CST/CSA (obligatoire au-delà d'un seuil : 200 agents en FPT)</td><td>Ex-CHSCT : prévention, DUERP, accidents, visites, enquêtes</td></tr></table>
<p>Les CST / CSA ont été créés lors des élections de décembre 2022, par fusion des comités techniques (CT) et des CHSCT. En FPT, une collectivité de moins de 50 agents relève du CST placé auprès du CDG.</p>` },
    { t: 'Les élections professionnelles', html: `
<ul><li>Organisées <strong>tous les 4 ans</strong>, à la même date dans les trois versants. Les dernières : décembre 2022. <strong>Les prochaines : décembre 2026.</strong></li><li>Elles désignent les représentants du personnel aux CAP, CCP et CST / CSA.</li><li>Elles mesurent la <strong>représentativité</strong> des syndicats, qui conditionne leurs droits (sièges, moyens, décharges d'activité).</li><li>Rôle de l'employeur : fixer le nombre de représentants, établir les listes électorales, recevoir et contrôler les candidatures (dont la <strong>représentation équilibrée femmes-hommes</strong> des listes), organiser le vote (souvent électronique), dépouiller, proclamer les résultats.</li></ul>
<div class="callout warn">Une erreur de procédure (listes électorales, délais, affichage) peut entraîner l'annulation du scrutin. Calendrier serré : à piloter comme un projet.</div>` },
    { t: 'Dans le privé : CSE et négociation', html: `
<ul><li><strong>CSE</strong> (comité social et économique) : obligatoire dès <strong>11 salariés</strong> pendant 12 mois consécutifs. Élu pour <strong>4 ans</strong> (par défaut).
<ul><li>11 à 49 salariés : présenter les réclamations individuelles et collectives, promouvoir la santé et la sécurité, saisir l'inspection du travail.</li><li>50 salariés et plus : attributions économiques et sociales (consultations récurrentes sur les orientations stratégiques, la situation économique, la politique sociale), budget de fonctionnement et budget des activités sociales et culturelles, BDESE.</li></ul></li>
<li><strong>Délégués syndicaux</strong> (dès 50 salariés) : négociation des accords collectifs. <strong>NAO</strong> (négociations annuelles obligatoires) sur la rémunération, le temps de travail, l'égalité professionnelle, la qualité de vie et des conditions de travail.</li>
<li>Référent harcèlement sexuel désigné par le CSE (dans tout CSE).</li></ul>` },
  ],
  memo: `<ul><li><strong>CAP</strong> = individuel (fonctionnaires, par catégorie) · <strong>CCP</strong> = contractuels.</li><li><strong>CST / CSA</strong> = collectif (organisation, LDG, RSU, formation, santé).</li><li><strong>F3SCT</strong> = santé-sécurité (ex-CHSCT).</li><li>Élections : <strong>tous les 4 ans</strong>, prochaines <strong>décembre 2026</strong>.</li><li>Privé : <strong>CSE dès 11</strong>, attributions élargies dès 50.</li></ul>`,
  cards: [
    ['CAP', 'Commission administrative paritaire : examine des décisions individuelles concernant les fonctionnaires, une par catégorie.'],
    ['CCP', 'Commission consultative paritaire : équivalent de la CAP pour les contractuels.'],
    ['CST', 'Comité social territorial : instance collective de la FPT (organisation, LDG, RSU…).'],
    ['CSA', 'Comité social d\'administration : équivalent du CST dans la fonction publique de l\'État.'],
    ['F3SCT', 'Formation spécialisée en matière de santé, de sécurité et de conditions de travail (ex-CHSCT).'],
    ['Seuil d\'un CST propre en FPT', '50 agents ; en dessous, CST placé auprès du CDG.'],
    ['Seuil d\'une F3SCT obligatoire (FPT)', '200 agents.'],
    ['Prochaines élections professionnelles dans la fonction publique', 'Décembre 2026 (mandat de 4 ans).'],
    ['Seuil de mise en place du CSE', '11 salariés pendant 12 mois consécutifs.'],
    ['Durée du mandat du CSE (par défaut)', '4 ans.'],
    ['NAO', 'Négociations annuelles obligatoires (rémunération, temps de travail, égalité, QVCT) dans les entreprises avec délégué syndical.'],
    ['BDESE', 'Base de données économiques, sociales et environnementales, obligatoire dès 50 salariés.'],
  ],
  quiz: [
    { q: 'Un refus de titularisation est examiné par…', c: ['Le CST', 'La CAP', 'La F3SCT'], a: 1, e: 'Décision individuelle défavorable.' },
    { q: 'Une réorganisation des services passe…', c: ['En CAP', 'En CST / CSA', 'Devant le conseil médical'], a: 1, e: 'Question collective.' },
    { q: 'Les contractuels sont représentés en…', c: ['CAP', 'CCP', 'Ils n\'ont pas d\'instance'], a: 1, e: 'Commission consultative paritaire.' },
    { q: 'La F3SCT a remplacé…', c: ['Le comité technique', 'Le CHSCT', 'La CAP'], a: 1, e: 'Depuis décembre 2022.' },
    { q: 'Les élections professionnelles ont lieu tous les…', c: ['3 ans', '4 ans', '6 ans'], a: 1, e: 'Prochaines : décembre 2026.' },
    { q: 'Le CSE est obligatoire à partir de…', c: ['11 salariés', '50 salariés', '300 salariés'], a: 0, e: 'Pendant 12 mois consécutifs.' },
    { q: 'Une commune de 35 agents relève…', c: ['De son propre CST', 'Du CST placé auprès du CDG', 'D\'aucun CST'], a: 1, e: 'Seuil de 50 agents.' },
    { q: 'La demande de révision d\'un compte rendu d\'entretien professionnel peut être portée devant…', c: ['La CAP, après recours auprès de l\'autorité', 'Le CST', 'Le conseil médical'], a: 0, e: 'Recours gracieux puis saisine de la CAP.' },
  ],
  cases: [
    { t: 'Le nouveau règlement du temps de travail', s: 'La DGS veut appliquer dès le mois prochain un nouveau règlement du temps de travail, sans « perdre de temps avec les syndicats ».',
      opts: [{ t: 'On l\'applique par simple note de service.', s: 0, fb: 'Le temps de travail relève d\'une délibération après avis du CST.' },
        { t: 'Le projet doit être soumis pour avis au CST, puis adopté par délibération ; on prévoit une concertation en amont et une communication aux agents.', s: 10, fb: 'Exact. Négliger l\'instance fragilise juridiquement la décision et le climat social.' },
        { t: 'On le soumet à la CAP.', s: 2, fb: 'La CAP traite des situations individuelles.' }] },
  ],
  tf: [
    ['La CAP examine les questions collectives d\'organisation.', false, 'C\'est le CST / CSA.'],
    ['Les prochaines élections professionnelles de la fonction publique ont lieu en décembre 2026.', true, 'Mandats de 4 ans.'],
    ['Le CSE est obligatoire dès 50 salariés.', false, 'Dès 11 ; 50 est le seuil des attributions élargies.'],
    ['La F3SCT est l\'héritière du CHSCT.', true, 'Formation spécialisée du CST / CSA.'],
  ],
});

MODULES.push({
  id: 'droitprive', ico: '🏢', title: 'Droit du travail privé : contrats et ruptures', tag: 'prive', level: 'Intermédiaire',
  summary: 'CDI, CDD, période d\'essai, démission, licenciement, rupture conventionnelle : les règles du Code du travail.',
  lessons: [
    { t: 'Les contrats', html: `
<ul><li><strong>CDI</strong> : forme normale de la relation de travail. Écrit recommandé (obligatoire pour un temps partiel).</li>
<li><strong>CDD</strong> : uniquement pour une tâche précise et temporaire, dans les cas prévus par la loi : remplacement d'un salarié absent, accroissement temporaire d'activité, emploi saisonnier, CDD d'usage… <strong>Écrit obligatoire</strong> avec le motif, remis dans les 2 jours ouvrables. Durée maximale en principe <strong>18 mois</strong>, renouvellements compris (2 renouvellements). Délai de carence entre deux CDD sur le même poste. <strong>Indemnité de fin de contrat : 10 %</strong> de la rémunération brute totale (sauf exceptions).</li>
<li>Un CDD irrégulier peut être <strong>requalifié en CDI</strong> par le juge.</li>
<li>Autres : intérim (contrat de mission), apprentissage, contrat de professionnalisation, temps partiel (24 h / semaine minimum en principe).</li></ul>` },
    { t: 'La période d\'essai', html: `
<table><tr><th>Catégorie (CDI)</th><th>Durée maximale initiale</th><th>Renouvellement compris (si accord de branche)</th></tr>
<tr><td>Ouvriers, employés</td><td>2 mois</td><td>4 mois</td></tr><tr><td>Agents de maîtrise, techniciens</td><td>3 mois</td><td>6 mois</td></tr><tr><td>Cadres</td><td>4 mois</td><td>8 mois</td></tr></table>
<p>CDD : 1 jour par semaine, dans la limite de 2 semaines (contrat ≤ 6 mois) ou 1 mois (contrat > 6 mois).</p>
<p>La période d'essai doit être <strong>prévue au contrat</strong>. Sa rupture est libre mais doit respecter un <strong>délai de prévenance</strong> (de 24 heures à 1 mois selon la présence du salarié) et ne pas être abusive ou discriminatoire.</p>` },
    { t: 'Les modes de rupture du CDI', html: `
<ul><li><strong>Démission</strong> : volonté claire et non équivoque du salarié ; préavis selon la convention. Depuis 2023, l'<strong>abandon de poste</strong> peut, après mise en demeure, valoir présomption de démission.</li>
<li><strong>Licenciement pour motif personnel</strong> : cause réelle et sérieuse (faute, insuffisance professionnelle, inaptitude…). Procédure : convocation à un <strong>entretien préalable</strong> (LRAR ou remise en main propre), entretien au moins <strong>5 jours ouvrables</strong> après, notification motivée au moins <strong>2 jours ouvrables</strong> après l'entretien. Préavis (sauf faute grave ou lourde) : 1 mois entre 6 mois et 2 ans d'ancienneté, 2 mois au-delà (ou plus selon la convention).</li>
<li><strong>Indemnité légale de licenciement</strong> (dès 8 mois d'ancienneté, sauf faute grave) : 1/4 de mois de salaire par année jusqu'à 10 ans, 1/3 de mois par année au-delà.</li>
<li><strong>Licenciement économique</strong> : suppression ou transformation d'emploi liée à des difficultés économiques, des mutations technologiques, une réorganisation ou une cessation d'activité ; obligation de reclassement, procédure renforcée.</li>
<li><strong>Rupture conventionnelle</strong> : accord des deux parties, un ou plusieurs entretiens, convention signée, <strong>15 jours calendaires de rétractation</strong>, puis demande d'<strong>homologation</strong> à la DREETS qui dispose de <strong>15 jours ouvrables</strong> (silence = homologation). Indemnité au moins égale à l'indemnité légale. Ouvre droit au chômage.</li></ul>
<p>En cas de litige : conseil de prud'hommes. Licenciement sans cause réelle et sérieuse : indemnités encadrées par un <strong>barème</strong> (sauf nullité : harcèlement, discrimination…).</p>` },
  ],
  memo: `<ul><li>CDD : motif légal, écrit, 18 mois max., 10 % de fin de contrat.</li><li>Essai CDI : 2 / 3 / 4 mois (×2 avec renouvellement).</li><li>Licenciement : entretien préalable ≥ 5 j ouvrables après convocation, notification ≥ 2 j ouvrables après.</li><li>Indemnité légale : 1/4 mois / an (≤ 10 ans), 1/3 au-delà, dès 8 mois.</li><li>Rupture conventionnelle : 15 j calendaires de rétractation + 15 j ouvrables d'homologation.</li></ul>`,
  cards: [
    ['Durée maximale d\'un CDD (cas général)', '18 mois, renouvellements compris.'],
    ['Indemnité de fin de CDD', '10 % de la rémunération brute totale (sauf exceptions).'],
    ['Période d\'essai d\'un cadre en CDI', '4 mois maximum, 8 mois avec renouvellement si l\'accord de branche le prévoit.'],
    ['Période d\'essai d\'un employé en CDI', '2 mois maximum, 4 mois renouvellement compris.'],
    ['Délai entre convocation et entretien préalable', 'Au moins 5 jours ouvrables.'],
    ['Délai entre entretien préalable et notification du licenciement', 'Au moins 2 jours ouvrables.'],
    ['Indemnité légale de licenciement', '1/4 de mois par année jusqu\'à 10 ans, 1/3 de mois par année au-delà ; dès 8 mois d\'ancienneté.'],
    ['Délai de rétractation de la rupture conventionnelle', '15 jours calendaires.'],
    ['Délai d\'instruction de l\'homologation', '15 jours ouvrables (le silence vaut homologation).'],
    ['Présomption de démission', 'Depuis 2023, abandon de poste après mise en demeure restée sans effet.'],
    ['Requalification', 'Transformation par le juge d\'un CDD irrégulier en CDI.'],
    ['Juge du contrat de travail', 'Le conseil de prud\'hommes.'],
  ],
  quiz: [
    { q: 'Un CDD doit être transmis au salarié…', c: ['Dans le mois', 'Dans les 2 jours ouvrables suivant l\'embauche', 'À la fin du contrat'], a: 1, e: 'À défaut, risque de requalification et indemnité.' },
    { q: 'La période d\'essai initiale maximale d\'un technicien en CDI est de…', c: ['2 mois', '3 mois', '4 mois'], a: 1, e: '6 mois avec renouvellement si prévu.' },
    { q: 'L\'entretien préalable a lieu au moins…', c: ['24 heures après la convocation', '5 jours ouvrables après', '15 jours après'], a: 1, e: 'Délai minimal légal.' },
    { q: 'Après 12 ans d\'ancienneté et 3 000 € de salaire, l\'indemnité légale de licenciement est d\'environ…', c: ['9 000 €', '9 500 €', '12 000 €'], a: 1, e: '10 × 1/4 × 3 000 = 7 500 + 2 × 1/3 × 3 000 = 2 000 → 9 500 €.' },
    { q: 'Le délai de rétractation de la rupture conventionnelle est de…', c: ['7 jours', '15 jours calendaires', '1 mois'], a: 1, e: 'Puis homologation.' },
    { q: 'Une rupture conventionnelle ouvre-t-elle droit au chômage ?', c: ['Oui', 'Non', 'Seulement pour les cadres'], a: 0, e: 'Contrairement à la démission (sauf cas légitimes).' },
    { q: 'L\'indemnité de fin de CDD est de…', c: ['5 %', '10 %', '15 %'], a: 1, e: 'Sauf exceptions (saisonnier, étudiant, CDI proposé…).' },
    { q: 'Un licenciement pour faute grave…', c: ['Ouvre droit au préavis', 'Prive du préavis et de l\'indemnité de licenciement', 'Est impossible'], a: 1, e: 'Les congés payés acquis restent dus.' },
  ],
  cases: [
    { t: 'Le CDD sans motif', s: 'Un manager a embauché un salarié en CDD « pour voir ce qu\'il vaut avant de le prendre en CDI ». Le contrat ne mentionne aucun motif.',
      opts: [{ t: 'Ce n\'est pas grave, c\'est l\'usage.', s: 0, fb: 'Un CDD ne peut servir de période d\'essai déguisée et doit mentionner un motif légal.' },
        { t: 'Risque de requalification en CDI : on régularise (vraie période d\'essai dans un CDI) et on forme les managers aux cas de recours au CDD.', s: 10, fb: 'Exact : le motif est une mention obligatoire.' },
        { t: 'On ajoute un motif après coup.', s: 2, fb: 'Antidater ou modifier un contrat signé n\'efface pas le risque, et peut aggraver la situation.' }] },
  ],
  tf: [
    ['Un CDD peut être utilisé pour tester un salarié avant un CDI.', false, 'C\'est le rôle de la période d\'essai.'],
    ['La rupture conventionnelle doit être homologuée par l\'administration.', true, 'Par la DREETS.'],
    ['L\'indemnité légale de licenciement est due dès 8 mois d\'ancienneté.', true, 'Sauf faute grave ou lourde.'],
    ['L\'abandon de poste ne peut jamais être assimilé à une démission.', false, 'Présomption de démission depuis 2023, après mise en demeure.'],
  ],
});

MODULES.push({
  id: 'recrutement', ico: '🔎', title: 'Recruter et intégrer', tag: 'commun', level: 'Essentiel',
  summary: 'De l\'analyse du besoin au premier jour : fiche de poste, non-discrimination, entretien structuré, intégration.',
  lessons: [
    { t: 'Définir le besoin et la fiche de poste', html: `
<ol><li><strong>Analyser le besoin</strong> : remplacement à l'identique ? Évolution du poste ? Mutualisation possible ? Budget disponible ? (Public : le poste existe-t-il au tableau des emplois ?)</li>
<li><strong>Rédiger la fiche de poste</strong> : intitulé, positionnement (service, N+1, encadrement), missions principales et activités, compétences (savoirs, savoir-faire, savoir-être), conditions (horaires, lieu, contraintes), cadre statutaire (catégorie, cadres d'emplois / grades ouverts) ou classification.</li>
<li><strong>Définir les critères de sélection</strong> avant de lire les candidatures : 3 à 6 critères objectifs et pondérés.</li></ol>
<div class="callout tip">La fiche de poste sert aussi après le recrutement : base de l'entretien professionnel, de la cotation RIFSEEP, des besoins de formation.</div>` },
    { t: 'Recruter sans discriminer', html: `
<p>Plus de <strong>25 critères de discrimination</strong> sont interdits par la loi, dont : origine, sexe, mœurs, orientation sexuelle, identité de genre, âge, situation de famille, grossesse, caractéristiques génétiques, particulière vulnérabilité économique, appartenance (vraie ou supposée) à une ethnie / nation / prétendue race, opinions politiques, activités syndicales, convictions religieuses, apparence physique, nom de famille, lieu de résidence, domiciliation bancaire, état de santé, perte d'autonomie, handicap, capacité à s'exprimer dans une autre langue que le français, qualité de lanceur d'alerte…</p>
<ul><li>Questions interdites en entretien : « Avez-vous des enfants ? », « Êtes-vous enceinte ? », « Quelle est votre religion ? »…</li><li>Les informations demandées doivent avoir un <strong>lien direct et nécessaire</strong> avec l'emploi.</li><li>Dans le public : <strong>égal accès</strong>, publicité de la vacance, et obligation de motiver certains choix.</li></ul>` },
    { t: 'L\'entretien structuré', html: `
<ul><li>Même grille, mêmes questions pour tous les candidats.</li><li>Questions <strong>comportementales</strong> : « Racontez-moi une situation où… » (méthode STAR : Situation, Tâche, Action, Résultat).</li><li>Questions <strong>situationnelles</strong> : « Que feriez-vous si un agent refusait d'appliquer une consigne ? »</li><li>Jury d'au moins deux personnes, notation individuelle puis harmonisation.</li><li>Prise de notes factuelles. Réponse à <strong>tous</strong> les candidats.</li></ul>` },
    { t: 'Réussir l\'intégration (onboarding)', html: `
<p>Les premières semaines déterminent souvent la suite : beaucoup de départs ou de difficultés naissent d'une intégration ratée.</p>
<ul><li><strong>Avant</strong> : formalités (DPAE ou arrêté/contrat, dossier, affiliation), poste de travail, accès, information de l'équipe, désignation d'un <strong>parrain / tuteur</strong>.</li><li><strong>Jour 1</strong> : accueil par le responsable, visite, présentation, livret d'accueil, planning des premières semaines.</li><li><strong>Premier mois</strong> : formations utiles, rencontres clés, point d'étape.</li><li><strong>Fin de période d'essai / de stage</strong> : bilan formalisé, décision argumentée.</li><li>FPT : inscription rapide à la <strong>formation d'intégration</strong> (condition de titularisation).</li></ul>` },
  ],
  memo: `<ol><li>Besoin → fiche de poste → critères</li><li>Publication (public : déclaration de vacance)</li><li>Tri sur critères objectifs</li><li>Entretiens structurés (STAR), jury</li><li>Décision, réponses à tous</li><li>Intégration : avant / J1 / M1 / fin d'essai</li></ol><p>⚠️ 25+ critères de discrimination interdits.</p>`,
  cards: [
    ['Contenu d\'une fiche de poste', 'Intitulé, positionnement, missions, activités, compétences, conditions d\'exercice, cadre statutaire.'],
    ['Méthode STAR', 'Situation, Tâche, Action, Résultat : structure des questions comportementales.'],
    ['Question interdite en entretien', 'Toute question sans lien direct et nécessaire avec l\'emploi (enfants, grossesse, religion…).'],
    ['Nombre de critères de discrimination légaux', 'Plus de 25 (âge, sexe, origine, santé, handicap, lieu de résidence…).'],
    ['Entretien structuré', 'Mêmes questions et même grille pour tous, idéalement devant un jury de 2 personnes ou plus.'],
    ['Onboarding', 'Processus d\'intégration d\'une nouvelle recrue, avant et après son arrivée.'],
    ['Parrain / tuteur', 'Collègue désigné pour accompagner la nouvelle recrue dans ses premières semaines.'],
    ['Condition de titularisation en FPT liée à la formation', 'Suivre la formation d\'intégration du CNFPT.'],
  ],
  quiz: [
    { q: 'Les critères de sélection doivent être définis…', c: ['Après les entretiens', 'Avant de lire les candidatures', 'Par le candidat'], a: 1, e: 'Pour garantir l\'objectivité.' },
    { q: 'Quelle question est autorisée ?', c: ['Avez-vous des enfants ?', 'Pouvez-vous décrire une situation où vous avez géré un conflit ?', 'Êtes-vous syndiqué ?'], a: 1, e: 'Question comportementale liée au poste.' },
    { q: 'La méthode STAR signifie…', c: ['Situation, Tâche, Action, Résultat', 'Savoir, Talent, Aptitude, Rigueur', 'Stage, Titularisation, Avancement, Retraite'], a: 0, e: 'Pour obtenir des exemples concrets.' },
    { q: 'Le lieu de résidence d\'un candidat…', c: ['Peut justifier un refus', 'Est un critère de discrimination interdit', 'Doit figurer sur la fiche de poste'], a: 1, e: 'Sauf contrainte réelle et objective (astreinte avec délai d\'intervention, par exemple, sans exclure par principe).' },
    { q: 'Un bon processus prévoit de répondre…', c: ['Uniquement au candidat retenu', 'À tous les candidats', 'Aux candidats internes seulement'], a: 1, e: 'Respect et image employeur.' },
  ],
  cases: [
    { t: 'Le jury qui dérape', s: 'En entretien, un membre du jury demande à une candidate de 34 ans si elle « compte avoir des enfants bientôt, parce que le poste est exigeant ».',
      opts: [{ t: 'On laisse faire, la candidate n\'est pas obligée de répondre.', s: 0, fb: 'La question elle-même est discriminatoire et engage l\'employeur.' },
        { t: 'On recadre immédiatement et poliment (« cette question n\'a pas de lien avec le poste, nous passons à la suite »), on n\'en tient aucun compte dans l\'évaluation, puis on reprend le sujet avec le membre du jury après l\'entretien et on le forme.', s: 10, fb: 'Réaction professionnelle : protéger la candidate et l\'employeur, puis prévenir la récidive.' },
        { t: 'On arrête l\'entretien.', s: 3, fb: 'Pénalise la candidate. Mieux vaut recadrer et poursuivre normalement.' }] },
  ],
  tf: [
    ['On peut demander à un candidat sa situation de famille.', false, 'Sans lien avec l\'emploi : interdit.'],
    ['La fiche de poste sert aussi à l\'entretien professionnel.', true, 'C\'est un outil RH central.'],
    ['L\'entretien structuré pose les mêmes questions à tous les candidats.', true, 'Pour comparer objectivement.'],
  ],
});
