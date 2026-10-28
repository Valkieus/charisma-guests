/* Référentiels RH : vocabulaire, statuts, absences, obligations, modèles de documents.
   Valeurs réglementaires indicatives (fin 2026) : toujours vérifier sur service-public.fr / legifrance.gouv.fr. */

const DEFAULT_SETTINGS = { point: 4.92278, smicH: 12.02, ir: 0, cpRef: 'juin' };

const SECTORS = {
  prive: {
    label: 'Secteur privé', emp: 'salarié', emps: 'salariés', Emp: 'Salarié', Emps: 'Salariés',
    statuts: ['CDI', 'CDD', 'Apprentissage', 'Contrat de professionnalisation', 'Stage', 'Intérim'],
    categories: ['Ouvrier', 'Employé', 'Technicien / agent de maîtrise', 'Cadre'],
    motifsCDD: ['Remplacement d\'un salarié absent', 'Accroissement temporaire d\'activité', 'Emploi saisonnier', 'CDD d\'usage', 'Attente de l\'arrivée d\'un salarié en CDI'],
    absences: ['Congés payés', 'RTT', 'Maladie', 'Accident du travail / maladie pro.', 'Maternité', 'Paternité et accueil de l\'enfant', 'Événement familial', 'Formation', 'Congé sans solde', 'Absence injustifiée'],
    maladie: ['Maladie', 'Accident du travail / maladie pro.'],
    cp: 'Congés payés', rtt: 'RTT',
    reviewTypes: ['Entretien professionnel', 'Entretien annuel d\'évaluation', 'État des lieux récapitulatif (6 ans)'],
    trainingTypes: ['Obligatoire / adaptation au poste', 'Développement des compétences', 'CPF', 'Alternance / Pro-A', 'Bilan de compétences / VAE'],
    instance: 'CSE',
  },
  public: {
    label: 'Fonction publique', emp: 'agent', emps: 'agents', Emp: 'Agent', Emps: 'Agents',
    statuts: ['Fonctionnaire titulaire', 'Fonctionnaire stagiaire', 'Contractuel CDD', 'Contractuel CDI', 'Contrat de projet', 'Apprenti', 'Vacataire'],
    categories: ['A', 'B', 'C'],
    motifsCDD: ['Remplacement d\'un agent indisponible (L332-13)', 'Vacance temporaire d\'emploi (L332-14)', 'Accroissement temporaire d\'activité (L332-23 1°)', 'Accroissement saisonnier (L332-23 2°)', 'Emploi permanent — besoins du service / pas de fonctionnaire (L332-8)', 'Contrat de projet (L332-24)'],
    absences: ['Congés annuels', 'ARTT', 'CMO (maladie ordinaire)', 'CLM (longue maladie)', 'CLD (longue durée)', 'CITIS (accident de service / maladie pro.)', 'Maternité', 'Paternité et accueil de l\'enfant', 'ASA (autorisation spéciale d\'absence)', 'Formation', 'CET', 'Grève', 'Absence injustifiée (service non fait)'],
    maladie: ['CMO (maladie ordinaire)', 'CLM (longue maladie)', 'CLD (longue durée)', 'CITIS (accident de service / maladie pro.)'],
    cp: 'Congés annuels', rtt: 'ARTT',
    reviewTypes: ['Entretien professionnel annuel', 'Entretien de formation', 'Entretien de fin de stage (titularisation)'],
    trainingTypes: ['Intégration', 'Professionnalisation', 'Perfectionnement', 'Préparation aux concours et examens', 'CPF', 'Hygiène et sécurité (obligatoire)'],
    instance: 'CST / CSA',
  },
};
const VERSANTS = { FPT: 'Territoriale (communes, départements, régions…)', FPE: 'État (ministères, services déconcentrés)', FPH: 'Hospitalière (hôpitaux, EHPAD publics…)' };
const GRADES_FPT = ['Adjoint administratif', 'Adjoint administratif principal de 2e classe', 'Adjoint administratif principal de 1re classe', 'Rédacteur', 'Rédacteur principal de 2e classe', 'Rédacteur principal de 1re classe', 'Attaché', 'Attaché principal', 'Attaché hors classe',
  'Adjoint technique', 'Adjoint technique principal de 2e classe', 'Adjoint technique principal de 1re classe', 'Agent de maîtrise', 'Agent de maîtrise principal', 'Technicien', 'Technicien principal de 2e classe', 'Technicien principal de 1re classe', 'Ingénieur', 'Ingénieur principal',
  'ATSEM principal de 2e classe', 'Adjoint d\'animation', 'Animateur', 'Auxiliaire de puériculture', 'Éducateur de jeunes enfants', 'Gardien-brigadier de police municipale', 'Adjoint du patrimoine', 'Assistant de conservation'];
const STAGES = ['Candidature', 'Présélection', 'Entretien', 'Proposition', 'Recruté', 'Refusé'];
const RECRUT_PUBLIC = ['Mutation (fonctionnaire)', 'Lauréat de concours (liste d\'aptitude)', 'Détachement', 'Contractuel', 'Recrutement direct (sans concours, cat. C)', 'Apprentissage'];

const ONBOARDING = {
  prive: ['DPAE effectuée (avant l\'embauche)', 'Contrat de travail signé', 'Inscription au registre unique du personnel', 'Affiliation mutuelle / prévoyance', 'Visite d\'information et de prévention (dans les 3 mois)', 'Poste, matériel et accès informatiques prêts', 'Livret d\'accueil et règlement intérieur remis', 'Parrain / marraine désigné(e)', 'Point d\'étape à 1 mois', 'Bilan avant fin de période d\'essai'],
  public: ['Arrêté de nomination ou contrat signé', 'Procès-verbal d\'installation', 'Dossier administratif complet (pièces, diplômes, casier)', 'Affiliation caisse de retraite (CNRACL / SRE / IRCANTEC)', 'Visite médicale d\'embauche', 'Fiche de poste remise', 'Poste, matériel et accès prêts', 'Livret d\'accueil remis', 'Inscription à la formation d\'intégration (CNFPT)', 'Entretien d\'étape à 3 mois', 'Préparer l\'avis de fin de stage (titularisation)'],
};

/* Obligations RH par seuil d'effectif. min = effectif à partir duquel l'obligation s'applique. */
const OBLIGATIONS = {
  prive: [
    { k: 'duerp', min: 1, t: 'Document unique d\'évaluation des risques (DUERP)', p: 'Mise à jour au moins annuelle dès 11 salariés, et à chaque changement important', d: 'Recense les risques professionnels et le plan de prévention. À conserver 40 ans dans ses versions successives.' },
    { k: 'registre', min: 1, t: 'Registre unique du personnel', p: 'À chaque entrée / sortie', d: 'Mentions obligatoires : identité, emploi, qualification, dates d\'entrée et de sortie, type de contrat.' },
    { k: 'affichage', min: 1, t: 'Affichages obligatoires', p: 'Permanent', d: 'Inspection du travail, médecine du travail, horaires, convention collective, harcèlement, égalité de rémunération, consignes incendie…' },
    { k: 'dpae', min: 1, t: 'DPAE avant chaque embauche', p: 'À chaque embauche', d: 'Déclaration préalable à l\'embauche auprès de l\'URSSAF, au plus tôt 8 jours avant.' },
    { k: 'mutuelle', min: 1, t: 'Complémentaire santé collective', p: 'Permanent', d: 'Financée au moins à 50 % par l\'employeur.' },
    { k: 'entretien_pro', min: 1, t: 'Entretiens professionnels', p: 'Tous les 2 ans + état des lieux tous les 6 ans (réforme 2025 : vérifier la nouvelle périodicité)', d: 'Porte sur les perspectives d\'évolution, pas sur l\'évaluation. Sanction (abondement CPF) dès 50 salariés en cas de manquement.' },
    { k: 'cse', min: 11, t: 'Mise en place du CSE', p: 'Élections tous les 4 ans (par défaut)', d: 'Obligatoire quand l\'effectif atteint 11 salariés pendant 12 mois consécutifs. Procès-verbal de carence si aucun candidat.' },
    { k: 'oeth', min: 20, t: 'Déclaration d\'emploi des travailleurs handicapés (DOETH)', p: 'Annuelle via la DSN', d: 'Obligation d\'emploi de 6 % de travailleurs handicapés, ou contribution.' },
    { k: 'ri', min: 50, t: 'Règlement intérieur', p: 'Dès 50 salariés (12 mois consécutifs)', d: 'Hygiène, sécurité, discipline. Soumis au CSE puis à l\'inspection du travail.' },
    { k: 'index', min: 50, t: 'Index de l\'égalité professionnelle femmes-hommes', p: 'Publication chaque année avant le 1er mars', d: 'À faire évoluer avec la transposition de la directive européenne sur la transparence salariale.' },
    { k: 'bdese', min: 50, t: 'Base de données économiques, sociales et environnementales (BDESE)', p: 'Permanente, mise à jour', d: 'Support des consultations récurrentes du CSE.' },
    { k: 'participation', min: 50, t: 'Accord de participation', p: 'Dès 50 salariés pendant 5 années civiles consécutives', d: 'Redistribution d\'une partie des bénéfices.' },
    { k: 'referent', min: 250, t: 'Référent harcèlement sexuel côté employeur', p: 'Dès 250 salariés', d: 'En plus du référent désigné par le CSE (obligatoire dans tout CSE).' },
    { k: 'cssct', min: 300, t: 'Commission santé, sécurité et conditions de travail (CSSCT)', p: 'Dès 300 salariés', d: 'Commission du CSE.' },
  ],
  public: [
    { k: 'duerp', min: 1, t: 'Document unique d\'évaluation des risques (DUERP)', p: 'Mise à jour annuelle', d: 'Obligation identique au privé. Présenté à la formation spécialisée (F3SCT) ou au CST/CSA.' },
    { k: 'tableau', min: 1, t: 'Tableau des emplois à jour (FPT)', p: 'À chaque création / suppression de poste', d: 'Les emplois sont créés par délibération de l\'organe délibérant (conseil municipal…).' },
    { k: 'vacance', min: 1, t: 'Déclaration de vacance d\'emploi / publicité', p: 'Avant tout recrutement sur emploi permanent', d: 'Publication sur la Place de l\'emploi public (et au CDG en FPT).' },
    { k: 'rsu', min: 1, t: 'Rapport social unique (RSU)', p: 'Chaque année', d: 'Données sociales de l\'année précédente, présenté au CST / CSA. Base de données sociales.' },
    { k: 'ldg', min: 1, t: 'Lignes directrices de gestion (LDG)', p: 'Pluriannuelles (6 ans max.), révisables', d: 'Stratégie RH, orientations en matière de promotion et de valorisation des parcours. Avis du CST / CSA.' },
    { k: 'plan_formation', min: 1, t: 'Plan de formation', p: 'Annuel ou pluriannuel', d: 'Obligatoire. En FPT, il est transmis au CNFPT.' },
    { k: 'entretien', min: 1, t: 'Entretiens professionnels annuels', p: 'Chaque année', d: 'Conduits par le supérieur hiérarchique direct, compte rendu notifié à l\'agent, recours possible.' },
    { k: 'signalement', min: 1, t: 'Dispositif de signalement des violences, harcèlement, discriminations', p: 'Permanent', d: 'Obligatoire pour tous les employeurs publics depuis 2020.' },
    { k: 'deonto', min: 1, t: 'Référent déontologue et référent laïcité', p: 'Permanent', d: 'Chaque agent doit pouvoir les saisir.' },
    { k: 'oeth', min: 20, t: 'Déclaration FIPHFP (emploi des travailleurs handicapés)', p: 'Annuelle', d: 'Obligation de 6 % pour les employeurs de 20 ETP et plus.' },
    { k: 'cst', min: 50, t: 'Comité social territorial / d\'administration propre', p: 'Dès 50 agents (sinon CST placé auprès du CDG en FPT)', d: 'Consulté sur l\'organisation, les LDG, le RSU, les orientations de formation…' },
    { k: 'egalite', min: 1, t: 'Plan d\'action égalité professionnelle', p: 'Pluriannuel (3 ans max.)', d: 'Obligatoire pour l\'État, les collectivités de plus de 20 000 habitants et les établissements de la FPH de plus de 50 agents.' },
    { k: 'f3sct', min: 200, t: 'Formation spécialisée en santé, sécurité et conditions de travail (F3SCT)', p: 'Dès 200 agents (FPT)', d: 'Remplace l\'ancien CHSCT depuis le renouvellement des instances de décembre 2022.' },
    { k: 'elections', min: 1, t: 'Élections professionnelles (CAP, CCP, CST / CSA)', p: 'Tous les 4 ans — prochaines : décembre 2026', d: 'Organisation des listes électorales, du vote (souvent électronique), des résultats.' },
  ],
};

/* Projets RH types */
const HR_PROJECTS = {
  entretiens: ['Campagne d\'entretiens annuels', ['Mettre à jour le support', 'Former les managers', 'Communiquer le calendrier', 'Réaliser les entretiens', 'Collecter les comptes rendus', 'Traiter les recours', 'Exploiter les besoins de formation']],
  plan_formation: ['Plan de formation', ['Recenser les besoins (entretiens)', 'Prioriser selon le budget', 'Présenter aux instances', 'Valider le plan', 'Inscrire les agents / salariés', 'Évaluer les formations']],
  gpec: ['Démarche GPEEC / GEPP', ['Cartographier les métiers et compétences', 'Pyramide des âges et départs prévisibles', 'Identifier les métiers sensibles', 'Plan d\'actions (recrutement, formation, mobilité)', 'Suivi des indicateurs']],
  elections: ['Élections professionnelles', ['Fixer le calendrier et la date du scrutin', 'Déterminer les effectifs par instance', 'Établir et afficher les listes électorales', 'Réceptionner et contrôler les candidatures', 'Organiser le vote (électronique ou urne)', 'Dépouillement et proclamation des résultats', 'Installer les nouvelles instances']],
  duerp: ['Mise à jour du DUERP', ['Constituer le groupe de travail', 'Visiter les unités de travail', 'Coter les risques', 'Définir le plan d\'actions de prévention', 'Présenter aux instances', 'Diffuser et archiver']],
  rsu: ['Rapport social unique', ['Extraire les données du SIRH', 'Contrôler les données', 'Saisir dans l\'outil national', 'Analyser les tendances', 'Présenter au CST / CSA']],
  ldg: ['Lignes directrices de gestion', ['Diagnostic RH (RSU)', 'Définir les orientations stratégiques', 'Critères de promotion et d\'avancement', 'Avis du CST / CSA', 'Arrêté et communication aux agents']],
  onboarding: ['Refonte du parcours d\'intégration', ['Interroger les derniers arrivants', 'Rédiger le livret d\'accueil', 'Créer la check-list d\'arrivée', 'Désigner des parrains', 'Évaluer après 6 mois']],
};

/* Modèles de documents. {{champ}} remplacé par les données. Trames pédagogiques à faire valider. */
const DOCS = {
  prive: [
    { id: 'cdi', t: 'Contrat de travail à durée indéterminée (trame)', body: `CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE

Entre {{org}}, {{orgAdresse}}, représentée par {{signataire}}, ci-après « l'employeur »,
Et {{civ}} {{prenom}} {{nom}}, ci-après « le salarié »,

Article 1 — Engagement
Le salarié est engagé à compter du {{entree}} sous réserve des résultats de la visite d'information et de prévention.
Convention collective applicable : {{ccn}}.

Article 2 — Fonctions
Le salarié occupe le poste de {{poste}}, catégorie {{categorie}}, au sein du service {{service}}.

Article 3 — Période d'essai
Le contrat ne deviendra définitif qu'à l'issue d'une période d'essai se terminant le {{finEssai}}.

Article 4 — Durée du travail
Durée hebdomadaire : {{heures}} heures.

Article 5 — Rémunération
Rémunération mensuelle brute : {{brut}}.

Article 6 — Congés payés, protection sociale
Le salarié bénéficie des congés payés légaux et conventionnels, de la complémentaire santé et de la prévoyance en vigueur dans l'entreprise.

Fait à {{ville}}, le {{date}}, en deux exemplaires.
L'employeur                                    Le salarié (« lu et approuvé »)` },
    { id: 'cdd', t: 'Contrat à durée déterminée (trame)', body: `CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE

Entre {{org}} et {{civ}} {{prenom}} {{nom}}.

Motif du recours : {{motifCDD}}.
Date de début : {{entree}} — Date de fin : {{finContrat}}.
Poste : {{poste}} ({{categorie}}). Période d'essai jusqu'au {{finEssai}}.
Rémunération mensuelle brute : {{brut}}.
À l'issue du contrat, une indemnité de fin de contrat égale à 10 % de la rémunération totale brute sera versée, sauf cas d'exclusion prévus par la loi.
Caisse de retraite complémentaire et organisme de prévoyance : à compléter.

ATTENTION : le CDD doit être écrit, comporter un motif précis et être transmis au salarié dans les 2 jours ouvrables suivant l'embauche.

Fait à {{ville}}, le {{date}}.` },
    { id: 'attestation', t: 'Attestation employeur', body: `ATTESTATION EMPLOYEUR

Je soussigné(e) {{signataire}}, agissant pour le compte de {{org}}, atteste que {{civ}} {{prenom}} {{nom}} est employé(e) dans notre entreprise depuis le {{entree}}, en qualité de {{poste}}, en {{statut}}.

Attestation délivrée à la demande de l'intéressé(e) pour servir et valoir ce que de droit.

Fait à {{ville}}, le {{date}}.` },
    { id: 'convocation', t: 'Convocation à entretien préalable', body: `Lettre recommandée avec AR ou remise en main propre contre décharge

Objet : convocation à un entretien préalable

{{civ}} {{nom}},

Nous envisageons à votre égard une mesure pouvant aller jusqu'au licenciement [ou : une sanction disciplinaire].
Nous vous prions de vous présenter le [date — au moins 5 jours ouvrables après la présentation de cette lettre] à [heure], à [lieu], pour un entretien préalable.
Vous pouvez vous faire assister par une personne de votre choix appartenant au personnel de l'entreprise [ou, en l'absence de représentants du personnel, par un conseiller du salarié inscrit sur la liste départementale, consultable en mairie et à la DREETS].

{{signataire}}, {{org}}` },
    { id: 'avertissement', t: 'Lettre d\'avertissement', body: `Objet : avertissement

{{civ}} {{nom}},

Le [date], [description précise et datée des faits reprochés].
Ces faits constituent un manquement à vos obligations professionnelles. Nous vous notifions par la présente un avertissement, qui sera versé à votre dossier.

Rappel : les faits ne peuvent être sanctionnés au-delà de 2 mois après que l'employeur en a eu connaissance.

{{signataire}}, {{org}}, le {{date}}` },
    { id: 'entretien', t: 'Convocation à l\'entretien professionnel', body: `Objet : votre entretien professionnel

{{civ}} {{prenom}} {{nom}},

Votre entretien professionnel aura lieu le [date] à [heure] avec [manager].
Cet entretien est consacré à vos perspectives d'évolution professionnelle (qualifications, emploi). Il ne porte pas sur l'évaluation de votre travail.
Vous pouvez le préparer à l'aide du support joint, et être informé(e) sur la VAE, le CPF, le conseil en évolution professionnelle et l'abondement du CPF par l'employeur.

{{signataire}}, le {{date}}` },
  ],
  public: [
    { id: 'arrete_stagiaire', t: 'Arrêté de nomination stagiaire (trame FPT)', body: `{{org}}
ARRÊTÉ N° ____ portant nomination stagiaire

L'autorité territoriale,
Vu le code général de la fonction publique,
Vu le décret portant statut particulier du cadre d'emplois correspondant,
Vu la délibération du ____ créant l'emploi au tableau des emplois,
Vu la liste d'aptitude établie à l'issue du concours,
Vu la déclaration de vacance d'emploi n° ____,

ARRÊTE
Article 1 : {{civ}} {{prenom}} {{nom}} est nommé(e) en qualité de {{grade}} stagiaire, catégorie {{categorie}}, à compter du {{entree}}.
Article 2 : l'intéressé(e) est classé(e) au {{echelon}}e échelon (IB ____ / IM {{im}}).
Article 3 : la durée du stage est fixée à un an, sous réserve de la formation d'intégration.
Article 4 : le directeur général des services est chargé de l'exécution du présent arrêté, notifié à l'intéressé(e) et transmis au comptable et au centre de gestion.

Fait à {{ville}}, le {{date}}. {{signataire}}
Voies et délais de recours : tribunal administratif dans un délai de deux mois à compter de la notification.` },
    { id: 'arrete_titu', t: 'Arrêté de titularisation (trame)', body: `{{org}}
ARRÊTÉ N° ____ portant titularisation

Vu le code général de la fonction publique,
Vu l'arrêté de nomination stagiaire du ____,
Vu l'attestation de suivi de la formation d'intégration,
Vu le rapport sur la manière de servir établi par le supérieur hiérarchique,

ARRÊTE
Article 1 : {{civ}} {{prenom}} {{nom}}, {{grade}} stagiaire, est titularisé(e) à compter du ____.
Article 2 : il/elle est classé(e) au {{echelon}}e échelon.

Fait à {{ville}}, le {{date}}. {{signataire}}` },
    { id: 'arrete_echelon', t: 'Arrêté d\'avancement d\'échelon (trame)', body: `{{org}}
ARRÊTÉ N° ____ portant avancement d'échelon

Vu le code général de la fonction publique,
Vu le décret fixant l'échelonnement indiciaire du grade de {{grade}},
Considérant que l'intéressé(e) remplit les conditions d'ancienneté requises,

ARRÊTE
Article 1 : {{civ}} {{prenom}} {{nom}}, {{grade}}, est promu(e) au ____e échelon à compter du ____ (IM ____).
Article 2 : ancienneté conservée : ____.

Fait à {{ville}}, le {{date}}. {{signataire}}
Voies et délais de recours : tribunal administratif, 2 mois.` },
    { id: 'contrat', t: 'Contrat de recrutement d\'un agent contractuel (trame)', body: `{{org}}
CONTRAT À DURÉE DÉTERMINÉE

Vu le code général de la fonction publique, notamment son article correspondant au motif ci-dessous,
Vu le décret n° 88-145 du 15 février 1988 relatif aux agents contractuels de la FPT,

Entre l'autorité territoriale et {{civ}} {{prenom}} {{nom}},
Article 1 — Motif : {{motifCDD}}.
Article 2 — Durée : du {{entree}} au {{finContrat}}. Période d'essai jusqu'au {{finEssai}}.
Article 3 — Fonctions : {{poste}}, emploi de catégorie {{categorie}}.
Article 4 — Rémunération : par référence à l'indice majoré {{im}}, plus le régime indemnitaire applicable.
Article 5 — L'agent est affilié au régime général de sécurité sociale et à l'IRCANTEC.
Article 6 — Fin de contrat : une indemnité de fin de contrat (10 %) peut être due pour certains contrats de moins d'un an.

Fait à {{ville}}, le {{date}}.` },
    { id: 'attestation', t: 'Attestation employeur', body: `{{org}}
ATTESTATION

Je soussigné(e) {{signataire}}, atteste que {{civ}} {{prenom}} {{nom}} exerce ses fonctions au sein de {{org}} depuis le {{entree}}, en qualité de {{poste}}, {{statut}}, grade de {{grade}} (catégorie {{categorie}}).

Fait à {{ville}}, le {{date}}, pour servir et valoir ce que de droit.` },
    { id: 'entretien', t: 'Convocation à l\'entretien professionnel annuel', body: `{{org}}
Objet : entretien professionnel annuel

{{civ}} {{prenom}} {{nom}},

Votre entretien professionnel au titre de l'année écoulée aura lieu le [date — au moins 8 jours après cette convocation] à [heure], avec votre supérieur(e) hiérarchique direct(e).
Vous trouverez ci-joint votre fiche de poste et la trame du compte rendu.
L'entretien portera sur : vos résultats, vos objectifs pour l'année à venir, votre manière de servir, vos acquis de l'expérience professionnelle, vos besoins de formation et vos perspectives d'évolution.

{{signataire}}, le {{date}}` },
  ],
};

/* Jours fériés français (métropole) */
function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${y}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
const holidayCache = {};
function holidays(y) {
  if (holidayCache[y]) return holidayCache[y];
  const e = easter(y);
  return (holidayCache[y] = new Set([`${y}-01-01`, addDays(e, 1), `${y}-05-01`, `${y}-05-08`, addDays(e, 39), addDays(e, 50), `${y}-07-14`, `${y}-08-15`, `${y}-11-01`, `${y}-11-11`, `${y}-12-25`]));
}
/* Nombre de jours décomptés : ouvrés (lun–ven) ou ouvrables (lun–sam), hors fériés */
function countDays(from, to, ouvrables = false) {
  if (!from || !to || to < from) return 0;
  let n = 0, d = from;
  for (let guard = 0; d <= to && guard < 2000; guard++, d = addDays(d, 1)) {
    const wd = new Date(d + 'T12:00:00').getDay();
    if (wd === 0 || (!ouvrables && wd === 6)) continue;
    if (holidays(Number(d.slice(0, 4))).has(d)) continue;
    n++;
  }
  return n;
}
