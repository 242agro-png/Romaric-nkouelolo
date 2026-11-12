import {
  Opportunity,
  MarketNeed,
  KeywordItem,
  CRMLead,
  DocumentRecord,
  MarketingCampaign,
} from "../types";

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-01",
    title: "Appel à projets RSE : Création d'espaces verts nourriciers et valorisation des biodéchets",
    issuer: "TotalEnergies EP Congo (Direction RSE)",
    category: "Sponsoring et financement RSE",
    location: "Pointe-Noire (Sites Djeno & Base Industrielle)",
    zone: "Pointe-Noire",
    publishedDate: "2026-10-15",
    deadline: "2026-12-10",
    budgetAmount: "18 500 000 FCFA",
    description: "Aménagement d'un potager circulaire hors-sol pilote pour les équipes sur site, installation d'une unité de compostage des déchets de cantine et fourniture de plants d'ombrage locaux.",
    conditions: "PME congolaise immatriculée à Pointe-Noire, expertise démontrée en agriculture urbaine, engagement d'approvisionnement local et zéro intrant chimique.",
    requiredSkills: [
      "Potagers hors-sol sur mesure",
      "Compostage accéléré des biodéchets de restauration",
      "Formation du personnel et sensibilisation RSE",
      "Fourniture de plants fruitiers et plantes aromatiques"
    ],
    documentsRequired: [
      "Note conceptuelle et méthodologie d'intervention",
      "Budget détaillé en FCFA et calendrier prévisionnel",
      "Lettre de manifestation d'intérêt signée",
      "Dossier administratif de l'entreprise (RCCM, NIU)"
    ],
    contactInfo: "rse.congo@totalenergies.com",
    sourceUrl: "https://congo.totalenergies.com/appels-projets-rse",
    reliability: "Vérifiée",
    lastVerifiedAt: "2026-11-12T08:30:00Z",
    matchScore: 94,
    matchReason: "Adéquation parfaite à 100% avec les compétences circulaires de 242Agro à Pointe-Noire.",
    isFavorite: true,
    status: "in_review",
    analysis: {
      totalScore: 94,
      classification: "prioritaire",
      criteriaBreakdown: [
        { criterion: "Correspondance activités", score: 20, max: 20, comment: "100% aligné sur le potager hors-sol, compostage cantine et sensibilisation." },
        { criterion: "Accessibilité géographique", score: 15, max: 15, comment: "Sites situés à Pointe-Noire et Djeno, intervention directe immédiate." },
        { criterion: "Éligibilité de l'entreprise", score: 14, max: 15, comment: "Structure locale congolaise conforme aux critères de contenu local." },
        { criterion: "Compétences techniques", score: 15, max: 15, comment: "Toutes les compétences sont maîtrisées en interne." },
        { criterion: "Potentiel financier", score: 14, max: 15, comment: "Budget de 18.5M FCFA avec marge brute prévisionnelle de 38%." },
        { criterion: "Délais de réponse", score: 8, max: 10, comment: "Délai suffisant avant clôture en décembre 2026." },
        { criterion: "Niveau de concurrence", score: 4, max: 5, comment: "Peu d'acteurs locaux spécialisés en agriculture circulaire hors-sol." },
        { criterion: "Faisabilité opérationnelle", score: 4, max: 5, comment: "Approvisionnement en bois de palette et fûts recyclés aisé à Pointe-Noire." }
      ],
      executiveSummary: "Opportunité majeure de référence institutionnelle à Pointe-Noire. TotalEnergies EP Congo cherche à verdir ses emprises et traiter ses déchets organiques de restauration. 242Agro dispose du profil idéal pour remporter ce contrat pilote reproductible.",
      clientNeedAnalysis: "Le client souhaite valoriser ses engagements RSE auprès des parties prenantes locales, réduire l'empreinte déchet de ses cantines d'entreprises et offrir un cadre de travail apaisant et éducatif.",
      eligibilityCheck: "Entreprise enregistrée au Congo requise. Présentation d'attestations ou références sur petits espaces nécessaire.",
      agroSkillsToMobilize: [
        "Fabrication de bacs potagers surélevés en bois traité naturel",
        "Système de compostage en bacs aérés étanches",
        "Horticulture maraîchère adaptée aux embruns côtiers",
        "Sensibilisation participative des salariés"
      ],
      deliverablesOffered: [
        "Installation de 12 bacs potagers hors-sol de 3m²",
        "Unité de compostage 3 bacs (déchets cantine)",
        "30 plants d'agrumes et arbres d'ombrage en conteneurs",
        "Cycle de 4 ateliers pratiques de jardinage urbain"
      ],
      missingSkillsOrWeaknesses: [
        "Certification ISO 14001 éventuelle (à compenser par une charte d'engagement écologique stricte)"
      ],
      recommendedPartners: [
        { name: "Atelier de menuiserie locale (Mpita/Tié-Tié)", role: "Découpe et assemblage rapide des bacs en bois local résistant" }
      ],
      estimatedBudget: {
        currency: "FCFA",
        totalEstimated: "16 800 000 FCFA",
        assumptions: "Bacs bois local + terreau fertile composté + réseau goutte-à-goutte gravitaire + 6 mois d'accompagnement agronomique."
      },
      risksAndMitigations: [
        { risk: "Retard de livraison du bois", severity: "Faible", mitigation: "Pré-sélection de deux scieries et menuisiers de Tié-Tié." },
        { risk: "Régulation des odeurs de compost", severity: "Moyen", mitigation: "Apport équilibré de matière brune (sciure sèche) et aération hebdomadaire contrôlée." }
      ],
      recommendedStrategy: "Mettre en avant l'ancrage 100% ponténégrin de 242Agro, la valorisation de l'économie circulaire locale et la dimension team-building pour les collaborateurs.",
      actionPlan: [
        { step: 1, action: "Générer la lettre officielle de manifestation d'intérêt", deadline: "J+1" },
        { step: 2, action: "Finaliser la note conceptuelle avec maquette 3D de l'espace", deadline: "J+3" },
        { step: 3, action: "Demander rendez-vous technique de pré-visite sur site", deadline: "J+7" }
      ],
      analyzedAt: "2026-11-12T09:00:00Z"
    }
  },
  {
    id: "opp-02",
    title: "Projet d'écoles vertes : Installation de potagers pédagogiques dans 5 établissements",
    issuer: "Coordination de l'Enseignement Privé & ONG Éducation Littoral",
    category: "Formations et prestations éducatives",
    location: "Pointe-Noire (Centre-ville & Lumumba)",
    zone: "Pointe-Noire",
    publishedDate: "2026-10-28",
    deadline: "2026-11-30",
    budgetAmount: "8 000 000 FCFA",
    description: "Aménagement d'espaces potagers éducatifs sécurisés dans les cours d'écoles, fourniture de kits d'outils juniors et animation de modules sur la nutrition saine et l'environnement.",
    conditions: "Expérience avec le jeune public, matériel sans danger, pédagogie participative.",
    requiredSkills: [
      "Potagers pédagogiques pour enfants",
      "Ateliers ludiques de semis et récolte",
      "Fourniture de semences locales reproductibles",
      "Conception de guides pédagogiques simplifiés"
    ],
    documentsRequired: [
      "Proposition technique et programme pédagogique par niveau",
      "Devis estimatif par école",
      "Attestation d'assurance responsabilité civile"
    ],
    contactInfo: "contact@education-littoral.org",
    sourceUrl: "https://education-littoral.org/opportunites-2026",
    reliability: "Haute",
    lastVerifiedAt: "2026-11-11T14:15:00Z",
    matchScore: 91,
    matchReason: "Cœur de métier de 242Agro (domaine 7 et 8), forte visibilité locale auprès des familles.",
    isFavorite: true,
    status: "new"
  },
  {
    id: "opp-03",
    title: "Appui aux micro-initiatives d'adaptation climatique et résilience urbaine",
    issuer: "PNUD République du Congo (Programme Environnement & Développement Durable)",
    category: "Appels à projets et financements",
    location: "Brazzaville & Pointe-Noire",
    zone: "République du Congo",
    publishedDate: "2026-10-20",
    deadline: "2026-12-20",
    budgetAmount: "25 000 000 FCFA",
    description: "Subvention pour le déploiement de modèles d'agriculture urbaine résiliente réduisant la vulnérabilité alimentaire dans les quartiers précaires et périurbains.",
    conditions: "Consortium ou PME/GIE locale démontrant un impact social, inclusion des femmes et jeunes.",
    requiredSkills: [
      "Microfermes urbaines circulaires",
      "Élevage intégré (poules pondeuses / lapins)",
      "Gestion et suivi-évaluation avec indicateurs d'impact",
      "Formation de groupements communautaires"
    ],
    documentsRequired: [
      "Dossier de candidature PNUD complet (Note conceptuelle, Cadre logique)",
      "Budget détaillé sous format PNUD",
      "Plan de suivi-évaluation et théorie du changement"
    ],
    contactInfo: "registry.cg@undp.org",
    sourceUrl: "https://www.cg.undp.org/content/congo/fr/home/procurement.html",
    reliability: "Vérifiée",
    lastVerifiedAt: "2026-11-12T07:00:00Z",
    matchScore: 89,
    matchReason: "Subvention très importante permettant de passer à l'échelle sur Pointe-Noire.",
    isFavorite: false,
    status: "new"
  },
  {
    id: "opp-04",
    title: "Fourniture de 2 500 plants fruitiers greffés et plantes aromatiques pour camp de base",
    issuer: "Eni Congo - Programme Biodiversité Littorale",
    category: "Fourniture de plants et équipements",
    location: "Pointe-Noire & Kouilou",
    zone: "Pointe-Noire",
    publishedDate: "2026-11-02",
    deadline: "2026-11-28",
    budgetAmount: "12 500 000 FCFA",
    description: "Fourniture de plants sains d'avocatiers greffés, manguiers, corossoliers, agrumes et essences locales pour végétalisation et compensations écologiques.",
    conditions: "Pépinière certifiée exempte de parasites, plants endurcis en sachets biodégradables, garantie de reprise de 90%.",
    requiredSkills: [
      "Pépinière horticole et fruitière",
      "Techniques de greffage certifiées",
      "Livraison et logistique locale sécurisée",
      "Fiches techniques d'entretien"
    ],
    documentsRequired: [
      "Catalogue des plants disponibles avec photos",
      "Offre financière unitaire et globale",
      "Planning d'échelonnement des livraisons"
    ],
    contactInfo: "procurement.congo@eni.com",
    sourceUrl: "https://www.eni.com/fr-CG/fournisseurs-congo.html",
    reliability: "Haute",
    lastVerifiedAt: "2026-11-10T11:00:00Z",
    matchScore: 87,
    matchReason: "Correspondance exacte avec le domaine 9 de 242Agro, forte rentabilité.",
    isFavorite: false,
    status: "new"
  },
  {
    id: "opp-05",
    title: "Approvisionnement régulier en herbes aromatiques fraîches et micropousses bio",
    issuer: "Hôtel & Résidence Atlantic Palace / Restaurants Côte Sauvage",
    category: "Demandes de prestations agricoles",
    location: "Pointe-Noire (Côte Sauvage & Centre)",
    zone: "Pointe-Noire",
    publishedDate: "2026-11-05",
    deadline: "2026-12-15",
    budgetAmount: "4 800 000 FCFA / an (contrat récurrent)",
    description: "Recherche d'un producteur local fiable pour la livraison hebdomadaire de basilic grand vert, menthe marocaine, romarin, ciboulette, coriandre et mesclun sans pesticide.",
    conditions: "Livraison le matin en circuit court, fraîcheur garantie, régularité d'approvisionnement toute l'année.",
    requiredSkills: [
      "Production maraîchère de précision",
      "Calendrier de récolte échelonné",
      "Conditionnement hygiénique zéro déchet",
      "Facturation mensuelle claire"
    ],
    documentsRequired: [
      "Grille tarifaire hebdomadaire et mensuelle",
      "Échantillons de dégustation",
      "Contrat de prestation de service type"
    ],
    contactInfo: "restauration@atlanticpalace-pn.com",
    sourceUrl: "https://242agropn.netlify.app/projets",
    reliability: "Haute",
    lastVerifiedAt: "2026-11-11T16:20:00Z",
    matchScore: 92,
    matchReason: "Revenus récurrents prévisibles pour 242Agro, valorisant son savoir-faire maraîcher bio.",
    isFavorite: true,
    status: "in_review"
  },
  {
    id: "opp-06",
    title: "Appel à manifestation d'intérêt : Réhabilitation d'espaces verts urbains et propreté citoyenne",
    issuer: "Mairie de Pointe-Noire (Arrondissement 1 Émery Patrice Lumumba)",
    category: "Appels d'offres et marchés",
    location: "Pointe-Noire",
    zone: "Pointe-Noire",
    publishedDate: "2026-10-10",
    deadline: "2026-12-05",
    budgetAmount: "14 000 000 FCFA",
    description: "Sélection d'opérateurs pour l'embellissement floral des carrefours, l'entretien des terre-pleins et la mise en place de points de compostage de quartier.",
    conditions: "PME ponténégrine, matériel propre, encadrement de jeunes déscolarisés apprécié.",
    requiredSkills: [
      "Horticulture urbaine et aménagement paysager",
      "Compostage public et gestion des déchets verts",
      "Encadrement d'équipes terrain"
    ],
    documentsRequired: [
      "Mémoire technique d'embellissement",
      "Bordereau des prix unitaires",
      "Lettre de soumission signée"
    ],
    contactInfo: "marchespublics@mairie-pointenoire.cg",
    sourceUrl: "https://mairie-pointenoire.cg/avis-consultations",
    reliability: "Moyenne",
    lastVerifiedAt: "2026-11-09T10:00:00Z",
    matchScore: 78,
    matchReason: "Intéressant pour l'ancrage institutionnel de 242Agro mais nécessite de mobiliser de la main d'œuvre.",
    isFavorite: false,
    status: "new"
  }
];

export const INITIAL_MARKET_NEEDS: MarketNeed[] = [
  {
    id: "need-01",
    needTitle: "Impossibilité de cultiver dans les cours bétonnées ou pavées",
    targetSegment: "Particuliers & Résidents",
    location: "Pointe-Noire (Mpita, Centre-ville, Côte Sauvage, Tié-Tié)",
    observedSignals: "La majorité des concessions modernes à Pointe-Noire sont dallées ou cimentées pour éviter le sable et la boue. Les résidents regrettent de ne pas avoir de terre fraîche pour cueillir ciboulette, piments ou gombo.",
    signalFrequency: "Quotidienne",
    marketInterestLevel: "Très élevé",
    solutionBy242Agro: "Bacs potagers surélevés et tables de culture modulaires sur pieds avec substrat fertile prêt à planter, sans dégradation du sol ni salissure.",
    commercialPotential: "Très élevé",
    pitchProposal: "Transformez votre terrasse ou cour pavée en jardin gourmand 100% propre ! Vos légumes frais et herbes aromatiques à portée de main, installés en 24h par 242Agro."
  },
  {
    id: "need-02",
    needTitle: "Approvisionnement en légumes sans produits chimiques toxiques",
    targetSegment: "Particuliers & Familles soucieuses de la santé",
    location: "Pointe-Noire (Zone aéroport, Mpita, Tchimbamba)",
    observedSignals: "Inquiétude croissante sur les résidus d'insecticides dangereux utilisés dans certains maraîchages périurbains du Kouilou. Forte demande pour des légumes feuilles (ndolé, folon, oseille) garantis sans poison.",
    signalFrequency: "Très fréquente",
    marketInterestLevel: "Très élevé",
    solutionBy242Agro: "Installation de mini-potagers domestiques en agroécologie et fourniture de paniers maraîchers biologiques certifiés par la transparence de culture.",
    commercialPotential: "Élevé",
    pitchProposal: "Protégez la santé de vos enfants avec les potagers bio 242Agro : consommez ce que vous voyez pousser chez vous, arrosé à l'eau saine et nourri au compost naturel."
  },
  {
    id: "need-03",
    needTitle: "Pénurie et coût élevé des herbes aromatiques fraîches pour les restaurateurs",
    targetSegment: "Restaurants & Hôtels",
    location: "Pointe-Noire (Côte Sauvage, Grand Marché, Centre)",
    observedSignals: "Les chefs cuisiniers peinent à trouver du basilic frais, de la menthe, du thym et de la ciboulette de qualité constante sans rupture d'approvisionnement le week-end.",
    signalFrequency: "Hebdomadaire",
    marketInterestLevel: "Élevé",
    solutionBy242Agro: "Installation d'un potager d'aromatiques directement dans l'arrière-cour du restaurant ou contrat de livraison express hebdomadaire garantie.",
    commercialPotential: "Stratégique",
    pitchProposal: "Offrez à votre brigade des herbes aromatiques d'une fraîcheur absolue, cueillies à la minute dans votre propre potager d'aromatiques installé et suivi par 242Agro."
  },
  {
    id: "need-04",
    needTitle: "Besoin de projets concrets et visibles de RSE environnementale locale",
    targetSegment: "Entreprises pétrolières, Banques, Télécoms",
    location: "Pointe-Noire (Sièges & Bases de Djeno, Base industrielle, Port)",
    observedSignals: "Obligation de contenu local et de verdissement des activités. Les entreprises cherchent des projets à fort impact visuel, mobilisant les collaborateurs sans nécessiter de lourdes infrastructures.",
    signalFrequency: "Mensuelle",
    marketInterestLevel: "Élevé",
    solutionBy242Agro: "Programme clés en main « Entreprise Circulaire » : bacs potagers sur site, valorisation des résidus de cantine en compost et ateliers de team-building éco-citoyens.",
    commercialPotential: "Stratégique",
    pitchProposal: "Incarnez votre RSE au quotidien auprès de vos salariés : faites de votre siège une référence d'agriculture circulaire urbaine avec les microfermes modulaires 242Agro."
  },
  {
    id: "need-05",
    needTitle: "Éducation environnementale et activités manuelles dans les écoles",
    targetSegment: "Établissements scolaires (Primaire & Secondaire)",
    location: "Pointe-Noire (Lumumba, Tié-Tié, Mongo-Mpoukou)",
    observedSignals: "Les programmes scolaires exigent une initiation aux sciences naturelles et au développement durable, mais la plupart des cours d'écoles sont stériles ou bétonnées.",
    signalFrequency: "Fréquente",
    marketInterestLevel: "Élevé",
    solutionBy242Agro: "Potager pédagogique clé en main : bacs sécurisés à hauteur d'enfants, outils juniors, graines rapides à germer et livret d'ateliers pour les enseignants.",
    commercialPotential: "Élevé",
    pitchProposal: "Faites germer la curiosité de vos élèves ! Le potager pédagogique 242Agro transforme chaque récréation en découverte des sciences vivantes et du respect de la nature."
  },
  {
    id: "need-06",
    needTitle: "Accumulation de déchets de tonte, branchages et fientes non valorisés",
    targetSegment: "Propriétaires de villas, Jardiniers, Éleveurs",
    location: "Pointe-Noire (Côte Sauvage, Ngoyo, Vindoulou)",
    observedSignals: "Des tonnes de déchets végétaux et de fumier de poules sont brûlés ou jetés dans les ravins alors que le terreau fertile est importé ou introuvable.",
    signalFrequency: "Très fréquente",
    marketInterestLevel: "Moyen",
    solutionBy242Agro: "Installation de composteurs thermiques ventilés 242Agro avec formation accélérée pour convertir les déchets verts en or noir pour les plantes.",
    commercialPotential: "Moyen",
    pitchProposal: "Ne brûlez plus vos résidus de jardin : transformez-les gratuitement en compost ultra-fertile grâce aux composteurs en bois durable 242Agro."
  }
];

export const INITIAL_KEYWORDS: KeywordItem[] = [
  {
    keyword: "Potager hors-sol Pointe-Noire",
    searchIntent: "Transactionnelle",
    targetAudience: "Particuliers avec cours pavées, villas",
    commercialValue: "Très Haute",
    competitionLevel: "Faible",
    suggestedAngle: "Comment cultiver ses légumes sur une terrasse ou cour bétonnée à Pointe-Noire sans terre",
    associatedPhrases: ["bac potager bois congo", "jardin surélevé pointe noire", "potager terrasse congo"],
    recommendedChannel: "Facebook & WhatsApp"
  },
  {
    keyword: "Création de potager à domicile Pointe-Noire",
    searchIntent: "Commerciale",
    targetAudience: "Familles, expatriés, cadres d'entreprise",
    commercialValue: "Très Haute",
    competitionLevel: "Faible",
    suggestedAngle: "Guide pratique : installer son jardin potager en 48h chez soi à Pointe-Noire",
    associatedPhrases: ["jardinier potager domicile", "installer légumes frais maison congo"],
    recommendedChannel: "Google & Facebook"
  },
  {
    keyword: "Agriculture urbaine Congo",
    searchIntent: "Informationnelle",
    targetAudience: "Bailleurs de fonds, ONG, étudiants, journalistes",
    commercialValue: "Haute",
    competitionLevel: "Moyenne",
    suggestedAngle: "L'essor de l'agriculture circulaire à Pointe-Noire : solutions 242Agro",
    associatedPhrases: ["agroécologie république du congo", "ferme urbaine brazzaville pointe noire"],
    recommendedChannel: "LinkedIn"
  },
  {
    keyword: "Compostage déchets organiques Pointe-Noire",
    searchIntent: "Commerciale",
    targetAudience: "Restaurants, hôtels, sites industriels RSE",
    commercialValue: "Haute",
    competitionLevel: "Faible",
    suggestedAngle: "Zéro déchet de cuisine : comment valoriser ses biodéchets en compost riche au Congo",
    associatedPhrases: ["composteur bois congo", "traitement déchets organiques entreprise"],
    recommendedChannel: "LinkedIn & B2B"
  },
  {
    keyword: "Fournisseur plants fruitiers greffés Pointe-Noire",
    searchIntent: "Transactionnelle",
    targetAudience: "Propriétaires de parcelles, promoteurs agricoles",
    commercialValue: "Très Haute",
    competitionLevel: "Moyenne",
    suggestedAngle: "Catalogue des meilleurs plants fruitiers greffés adaptés au littoral congolais",
    associatedPhrases: ["avocatier greffé congo", "plants manguiers greffés", "citronnier pépinière pointe noire"],
    recommendedChannel: "WhatsApp & Facebook"
  },
  {
    keyword: "Potager scolaire pédagogique Congo",
    searchIntent: "Commerciale",
    targetAudience: "Directeurs d'écoles privées et comités de parents d'élèves",
    commercialValue: "Haute",
    competitionLevel: "Faible",
    suggestedAngle: "Pourquoi intégrer un potager éducatif dans votre école à Pointe-Noire cette rentrée",
    associatedPhrases: ["activités environnement école congo", "sensibilisation nature enfants"],
    recommendedChannel: "Prospection directe & Facebook"
  },
  {
    keyword: "Installation poulailler urbain Congo",
    searchIntent: "Transactionnelle",
    targetAudience: "Ménages voulant des œufs frais tous les matins",
    commercialValue: "Moyenne",
    competitionLevel: "Faible",
    suggestedAngle: "Avoir des œufs frais bio tous les jours dans sa cour : le kit poules pondeuses intégré",
    associatedPhrases: ["élevage poules pondeuses maison", "clôture poulailler compact"],
    recommendedChannel: "Facebook"
  },
  {
    keyword: "Projet environnemental RSE Congo",
    searchIntent: "Commerciale",
    targetAudience: "Directions RSE, QHSE de TotalEnergies, Eni, MTN, Banques",
    commercialValue: "Très Haute",
    competitionLevel: "Faible",
    suggestedAngle: "Partenariats RSE à fort impact visible : l'agriculture circulaire avec 242Agro",
    associatedPhrases: ["partenariat vert entreprise pointe noire", "action développement durable congo"],
    recommendedChannel: "LinkedIn"
  }
];

export const INITIAL_CRM_LEADS: CRMLead[] = [
  {
    id: "lead-01",
    opportunityId: "opp-01",
    title: "Projet Potager Circulaire & Compostage Cantine",
    clientName: "TotalEnergies EP Congo",
    contactPerson: "M. Mvouezolo (Responsable RSE & Contenu Local)",
    email: "rse.congo@totalenergies.com",
    phone: "+242 05 500 00 00",
    location: "Djeno / Base Industrielle, Pointe-Noire",
    stage: "dossier_prep",
    potentialValueFCFA: 18500000,
    probability: 75,
    nextFollowUpDate: "2026-11-20",
    notes: "Note conceptuelle en cours de finalisation. Visite technique de la cantine de Djeno à planifier avec le chef de site.",
    history: [
      { date: "2026-10-18", action: "Détection de l'appel à projets sur la plateforme", user: "IA 242Agro" },
      { date: "2026-10-25", action: "Téléchargement du cahier des charges et analyse d'éligibilité", user: "Direction 242Agro" },
      { date: "2026-11-05", action: "Génération de la note de cadrage avec l'IA", user: "Direction 242Agro" }
    ],
    createdAt: "2026-10-18T10:00:00Z",
    updatedAt: "2026-11-05T14:30:00Z"
  },
  {
    id: "lead-02",
    opportunityId: "opp-02",
    title: "Potagers Pédagogiques dans 5 Écoles Privées",
    clientName: "Groupe Scolaire Les Pépites du Littoral",
    contactPerson: "Mme Bouanga (Directrice Pédagogique)",
    email: "direction@pepites-littoral.cg",
    phone: "+242 06 630 12 34",
    location: "Lumumba, Pointe-Noire",
    stage: "meeting_scheduled",
    potentialValueFCFA: 3200000,
    probability: 60,
    nextFollowUpDate: "2026-11-18",
    notes: "Rendez-vous fixé le mardi 18 novembre à 10h pour présenter les maquettes de bacs potagers adaptés aux élèves de CP-CM2.",
    history: [
      { date: "2026-11-01", action: "Envoi de la plaquette commerciale par WhatsApp", user: "Équipe 242Agro" },
      { date: "2026-11-08", action: "Appel de confirmation du rendez-vous", user: "Direction 242Agro" }
    ],
    createdAt: "2026-11-01T09:00:00Z",
    updatedAt: "2026-11-08T11:00:00Z"
  },
  {
    id: "lead-03",
    opportunityId: "opp-05",
    title: "Contrat Maraîchage Aromatique Frais",
    clientName: "Hôtel Résidence Atlantic Palace",
    contactPerson: "Chef Koubemba (Chef Exécutif Restauration)",
    email: "chef@atlanticpalace-pn.com",
    phone: "+242 05 523 45 67",
    location: "Centre-ville, Pointe-Noire",
    stage: "proposal_sent",
    potentialValueFCFA: 4800000,
    probability: 80,
    nextFollowUpDate: "2026-11-16",
    notes: "Échantillons de basilic pourpre, menthe marocaine et ciboulette livrés avec succès. Offre financière mensuelle remise au directeur des achats.",
    history: [
      { date: "2026-11-04", action: "Livraison des premiers échantillons", user: "Équipe 242Agro" },
      { date: "2026-11-10", action: "Envoi du devis annuel formalisé", user: "Direction 242Agro" }
    ],
    createdAt: "2026-11-04T15:00:00Z",
    updatedAt: "2026-11-10T16:00:00Z"
  },
  {
    id: "lead-04",
    title: "Installation Potager Résidentiel Haut de Gamme",
    clientName: "M. Sassou N. (Résidence privée)",
    contactPerson: "M. Sassou",
    email: "particulier.mpita@gmail.com",
    phone: "+242 06 999 88 77",
    location: "Mpita, Pointe-Noire",
    stage: "negotiation",
    potentialValueFCFA: 1850000,
    probability: 85,
    nextFollowUpDate: "2026-11-15",
    notes: "Aménagement de 4 grands bacs en teck avec système d'arrosage automatique et poulailler design 4 poules.",
    history: [
      { date: "2026-11-02", action: "Audit de la cour pavée", user: "Technicien 242Agro" },
      { date: "2026-11-09", action: "Ajustement du devis sur le choix des essences de bois", user: "Direction 242Agro" }
    ],
    createdAt: "2026-11-02T11:00:00Z",
    updatedAt: "2026-11-09T17:00:00Z"
  }
];

export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: "doc-01",
    opportunityId: "opp-01",
    opportunityTitle: "Appel à projets RSE TotalEnergies EP Congo",
    title: "Dossier de candidature complet (Pack Intégral Clés en Main) — TotalEnergies EP Congo",
    documentType: "Dossier de candidature complet (Pack Intégral Clés en Main)",
    category: "Technique",
    content: `# 242AGRO — SOLUTIONS D'AGRICULTURE URBAINE CIRCULAIRE
**Siège social et ateliers :** Pointe-Noire, République du Congo  
**Téléphone professionnel direct WhatsApp :** +242 06 874 22 77  
**Courrier électronique :** 242agro@gmail.com  
**Plateforme officielle :** https://242agropn.netlify.app/  
**Identifiants légaux :** [Registre du Commerce et du Crédit Mobilier : RCCM-PN-2024 / NIU Officiel 242Agro]  
**Référence du dossier :** 242AGRO/DOSSIER-2026/TEP-CG-01  

---

**DESTINATAIRE OFFICIEL :**  
À l'attention de la Direction Générale et du Comité de Sélection  
**TotalEnergies EP Congo**  
Département RSE, Développement Durable et Contenu Local  
Sites de Djeno & Base Industrielle — Pointe-Noire, République du Congo  

**Date d'émission :** 12 Novembre 2026  
**Objet :** Soumission officielle et dossier technique complet pour : *« Création d'espaces verts nourriciers et valorisation circulaire des biodéchets de restauration »*  

---

### LETTRE SOLENNELLE D'ENGAGEMENT ET DE TRANSMISSION

Monsieur le Directeur, Mesdames et Messieurs les Membres du Comité de Sélection,

C'est avec un profond sens des responsabilités et une fierté toute particulière pour notre savoir-faire congolais que j'ai l'honneur de vous soumettre, au nom de l'équipe **242Agro**, le dossier technique, administratif et financier complet relatif à votre appel à projets RSE.

Fondée à Pointe-Noire, **242Agro** est née d'une conviction fondamentale : face à l'urbanisation rapide de notre ville océane, à la rareté des terres cultivables non polluées et aux défis pressants de la gestion des déchets, l'agriculture urbaine circulaire n'est pas un luxe, mais une impérieuse nécessité sociale, économique et écologique. Notre mission quotidienne est de réconcilier les citadins, les entreprises et les institutions avec une alimentation saine, fraîche et produite sur place, sans le moindre recours aux pesticides de synthèse.

Votre initiative résonne de manière exemplaire avec nos valeurs fondamentales et notre pratique agronomique quotidienne. Qu'il s'agisse de végétaliser des emprises d'entreprises, de recycler intégralement les déchets organiques de restauration ou d'aménager des potagers productifs dans des cours d'écoles ou des concessions privées, nous avons développé des méthodes robustes, éprouvées sous le climat équatorial de Pointe-Noire et mobilisant exclusivement des ressources locales.

Le présent dossier a été minutieusement élaboré pour vous apporter des réponses claires, pragmatiques et durables. Vous y découvrirez notre diagnostic de terrain, notre dispositif technique hors-sol à haut rendement, la sélection botanique adaptée à vos exigences, ainsi qu'un chiffrage rigoureux et transparent garantissant un retour sur investissement écologique et humain remarquable.

Toute l'équipe de **242Agro** se tient à votre entière disposition pour une visite de faisabilité conjointe sur le site de votre choix à Pointe-Noire ou dans le Kouilou.

En vous remerciant très sincèrement pour l'attention bienveillante que vous porterez à notre proposition, je vous prie d'agréer, Monsieur le Directeur, l'expression de ma considération la plus distinguée.

**Pour 242Agro**  
*La Direction Générale et Technique*  
Pointe-Noire, République du Congo  

---

## 1. PRÉSENTATION INSTITUTIONNELLE ET ANCRAGE LOCAL DE 242AGRO

### 1.1 Identité et raison d'être
242Agro est une entreprise éco-responsable de droit congolais, solidement implantée à Pointe-Noire. Pionnière de l'agriculture urbaine circulaire, l'entreprise conçoit, installe et accompagne des microfermes urbaines autonomes, des potagers surélevés pour cours pavées et terrasses, ainsi que des unités de compostage thermophile rapide.

### 1.2 Nos domaines de compétences directes mobilisés
1. **Conception et menuiserie agricole hors-sol :** Bacs potagers surélevés étanches en bois local dur (teck, limba traité naturellement), garantissant une isolation totale contre la pollution des sols industriels ou sableux.
2. **Biologie des sols et compostage accéléré :** Transformation des biodéchets de cantine et déchets végétaux en un amendement humique riche, 100% inodore grâce à l'équilibre matière verte / matière brune.
3. **Maraîchage agroécologique littoral :** Maîtrise des variétés locales à haute valeur nutritive adaptées à l'hygrométrie et aux embruns de la côte ponténégrine (oseille de Guinée, amarante ndolé, basilic grand vert, menthe, piments doux).
4. **Pépinière fruitière et arbres d'ombrage :** Fourniture de plants greffés sains (avocatiers nains, manguiers, agrumes) à mise à fruit rapide.
5. **Pédagogie et cohésion d'équipe (RSE) :** Ateliers pratiques de transmission de compétences, mobilisant les collaborateurs autour du travail de la terre.

---

## 2. CONTEXTE SPÉCIFIQUE ET DIAGNOSTIC DU BESOIN À POINTE-NOIRE

Pointe-Noire présente des caractéristiques environnementales singulières qui exigent des solutions techniques adaptées :
- **Des sols côtiers sableux et filtrants :** Les sols naturels retiennent mal les nutriments et l'eau, rendant les potagers traditionnels vulnérables au dessèchement et au lessivage rapide.
- **Une forte concentration de cours bétonnées ou pavées :** Dans la plupart des emprises tertiaires, industrielles ou résidentielles de Lumumba, Mpita ou Djeno, l'absence de terre franche empêche la culture au sol.
- **Le gâchis des biodéchets de cuisine :** Chaque jour, les cantines et cuisines évacuent des centaines de kilogrammes de résidus organiques qui finissent en décharge et génèrent des gaz à effet de serre, alors qu'ils constituent le meilleur fertilisant naturel disponible.
- **Le besoin impératif d'aliments sains :** Les circuits maraîchers conventionnels abusent fréquemment d'intrants chimiques toxiques. La production en circuit ultra-court sur site apporte une garantie absolue de pureté sanitaire.

La solution proposée par 242Agro répond précisément à ces quatre défis en installant une chaîne vertueuse et circulaire sur votre propre emprise.

---

## 3. PROPOSITION TECHNIQUE ET MÉTHODOLOGIE OPÉRATIONNELLE

### 3.1 Les modules potagers surélevés « Modèle Littoral 242Agro »
- **Conception ergonomique :** Bacs en bois noble local certifié, de dimensions 2,00 m x 1,00 m x 0,80 m de hauteur. Cette hauteur permet une manipulation aisée sans courbure dorsale et protège totalement les plantations des rongeurs.
- **Traitement naturel :** Le bois est protégé par application thermique d'huile végétale de lin et cire locale d'abeille, sans aucun fongicide chimique nocif pour les cultures.
- **Revêtement interne :** Géotextile imputrescible respirant de 250 g/m² assurant le drainage parfait de l'eau tout en conservant le complexe organo-minéral.
- **Substrat biofertilisé exclusif 242Agro :** Chaque bac est garni d'un mélange équilibré composé de :
  - 40% de compost mûr riche en micro-organismes bénéfiques ;
  - 40% de terre franche végétale sélectionnée et tamisée ;
  - 20% de sable fluvial lavé de rivière et sciure de bois dure stabilisée pour l'aération racinaire.

### 3.2 Le système d'irrigation économe en eau
Afin de minimiser la consommation en eau potable et d'assurer une régularité optimale sans astreinte quotidienne lourde pour vos équipes, nous déployons un réseau d'arrosage goutte-à-goutte gravitaire autonome. Ce dispositif fonctionne par micro-asperseurs régulés et tuyaux poreux basse pression connectés à une cuve tampon avec programmateur mécanique à piles (autonomie de 12 mois sans raccordement électrique complexe).

### 3.3 La station de valorisation circulaire des biodéchets (Compostage fermé inodore)
- Installation d'un composteur technique en bois à 3 compartiments distincts :
  - Compartiment 1 : Remplissage et aération des déchets frais de cantine mélangés à la matière carbonée sèche.
  - Compartiment 2 : Maturation thermophile (montée naturelle en température à 60°C détruisant les germes pathogènes).
  - Compartiment 3 : Stockage du compost mûr prêt à être incorporé aux bacs potagers.
- Fourniture d'un bac hermétique de stockage de matière sèche (sciure propre de menuiserie) et d'un aérateur hélicoïdal en acier inoxydable garantissant l'absence totale de mauvaises odeurs.

### 3.4 Sélection botanique adaptée et calendrier de cueillette
Les espèces végétales sont soigneusement sélectionnées pour leur résistance, leur rendement rapide et leur utilité immédiate pour vos cuisines :
- **Légumes feuilles traditionnels :** Oseille de Guinée (*Hibiscus sabdariffa*), Amarante verte et pourpre (*Amaranthus cruentus* / Ndolé), Épinard sauvage tropical. Première récolte dès la 4ème semaine.
- **Fines herbes et aromatiques :** Basilic grand vert de Gênes, Menthe poivrée et marocaine, Ciboulette tropicale, Citronnelle d'assaisonnement, Romarin et Piment végétarien parfumé non piquant.
- **Arbres fruitiers d'ombrage en conteneurs sur mesure :** Citronniers 4 saisons greffés, Papayers nains solo et Corossoliers nains, disposés en périphérie immédiate pour structurer l'espace de manière chaleureuse.

---

## 4. CHRONOGRAMME D'INTERVENTION ET DÉPLOIEMENT (8 SEMAINES)

| Période | Actions principales menées par l'équipe 242Agro | Livrables et Jalons vérifiables |
|---|---|---|
| **Semaine 1** | Visite d'implantation, piquetage sur site, validation des points d'eau et commande du bois d'ébénisterie locale. | Plan d'implantation validé conjointement |
| **Semaine 2** | Découpe, assemblage et traitement naturel des bacs et du composteur dans nos ateliers de Pointe-Noire. | Modules finis prêts au transport |
| **Semaine 3** | Acheminement logistique sur le site, installation des structures, pose des géotextiles et préparation du substrat. | Bacs positionnés et lestés proprement |
| **Semaine 4** | Pose du circuit hydraulique goutte-à-goutte, tests d'étanchéité, mise en eau et paillage organique de surface. | Système d'irrigation opérationnel |
| **Semaine 5** | Plantation des premiers plants horticoles et aromatiques, mise en place de la signalétique pédagogique. | Végétalisation complète effectuée |
| **Semaine 6** | Mise en service de la station de compostage et première séance de formation pratique des préposés de cantine. | Première incorporation de biodéchets |
| **Semaine 7** | Première cueillette inaugurale de fines herbes fraîches et légumes feuilles pour les cuisines. | Dégustation des premiers produits du site |
| **Semaine 8** | Atelier participatif inaugural de sensibilisation RSE pour le personnel et signature du procès-verbal de réception. | Remise du guide d'entretien et PV de réception |

---

## 5. PROPOSITION FINANCIÈRE DÉTAILLÉE ET TRANSPARENTE EN FRANCS CFA

Le présent budget est établi hors taxes, fermeté garantie pour une durée de 90 jours calendaires.

| Réf. | Désignation détaillée des postes de fournitures et prestations | Qté | Unité | Prix Unitaire (FCFA) | Montant Total (FCFA) |
|---|---|---|---|---|---|
| **1.0** | **INFRASTRUCTURES HORIZONTALES HORS-SOL** | | | | |
| 1.1 | Bacs potagers surélevés modèle *Littoral 80cm* en bois dur local teck/limba traité à l'huile de lin naturelle | 12 | Unité | 350 000 | 4 200 000 |
| 1.2 | Membrane géotextile filtrante imputrescible 250g/m² et fixations inoxydables | 12 | Module | 25 000 | 300 000 |
| 1.3 | Substrat végétal enrichi biofertilisé 242Agro (compost mûr, terre franche aérée, sable fluvial lavé) | 24 | Mètre³ | 45 000 | 1 080 000 |
| 1.4 | Paillage protecteur de coques et paille locale contre l'évaporation | 1 | Lot | 180 000 | 180 000 |
| **2.0** | **RÉSEAU HYDRAULIQUE D'IRRIGATION AUTONOME** | | | | |
| 2.1 | Cuve tampon régulatrice avec support surélevé et raccordements haute pression | 1 | Ens. | 450 000 | 450 000 |
| 2.2 | Réseau goutte-à-goutte basse pression avec micro-goutteurs régulés et raccords rapides | 1 | Kit complet | 400 000 | 400 000 |
| 2.3 | Programmateur d'arrosage automatique autonome à double sortie | 1 | Unité | 150 000 | 150 000 |
| **3.0** | **STATION DE VALORISATION DES BIODÉCHETS DE RESTAURATION** | | | | |
| 3.1 | Composteur aéré 3 compartiments en bois traité avec aérateurs latéraux anti-rongeurs | 1 | Ensemble | 1 200 000 | 1 200 000 |
| 3.2 | Coffre étanche de stockage de matière carbonée sèche (sciure et feuilles mortes) | 1 | Unité | 250 000 | 250 000 |
| 3.3 | Outillage complet de compostage (aérateur hélicoïdal inox, thermomètre à sonde 80cm, fourche) | 1 | Lot | 180 000 | 180 000 |
| **4.0** | **VÉGÉTAUX, PLANTS FRUITIERS ET SEMENCES PONTÉNÉGRINES** | | | | |
| 4.1 | Plants d'herbes aromatiques vigoureuses en mottes (menthe, basilic, ciboulette, citronnelle, romarin) | 180 | Plants | 2 500 | 450 000 |
| 4.2 | Semences maraîchères certifiées bio d'oseille, amarantes ndolé et piments doux | 1 | Lot | 220 000 | 220 000 |
| 4.3 | Arbres fruitiers greffés nains et essences d'ombrage en conteneurs décoratifs (citronniers, papayers) | 20 | Sujets | 25 000 | 500 000 |
| **5.0** | **FORMATION, ACCOMPAGNEMENT ET SUIVI AGRONOMIQUE (6 MOIS INCLUS)** | | | | |
| 5.1 | Sessions d'animation et de team-building éco-citoyen pour les équipes et salariés (4 séances) | 4 | Ateliers | 450 000 | 1 800 000 |
| 5.2 | Visites bimensuelles d'un ingénieur agronome 242Agro pendant 6 mois (contrôle, taille, fertilisation) | 12 | Passages | 150 000 | 1 800 000 |
| 5.3 | Rédaction du livret de conduite agronomique plastifié et panneaux de repérage des variétés | 1 | Lot complet | 250 000 | 250 000 |
| **6.0** | **LOGISTIQUE TERRAIN, ACHEMINEMENT ET MONTAGE À POINTE-NOIRE** | | | | |
| 6.1 | Transport lourd, manutention sécurisée sur site, pose et nettoyage complet de chantier | 1 | Forfait | 1 200 000 | 1 200 000 |
| | **TOTAL HORS TAXES DES FOURNITURES ET PRESTATIONS (FCFA)** | | | | **14 060 000** |
| | Provision pour ajustements techniques de site et contingences locales (5%) | | | | **703 000** |
| | **MONTANT TOTAL DE LA PROPOSITION GLOBALE CLÉS EN MAIN (FCFA)** | | | | **14 763 000** |

### Modalités de règlement proposées :
- **40% à la signature du marché :** Permettant le démarrage immédiat de l'usinage des bacs et l'achat du bois local.
- **40% à la livraison et installation sur site :** À la mise en eau et plantation des végétaux.
- **20% à la réception définitive :** Après 30 jours de fonctionnement et réalisation du premier atelier d'accompagnement.

---

## 6. ASSURANCE QUALITÉ, PLAN DE PÉRENNITÉ ET GARANTIE AGRONOMIQUE

242Agro s'engage formellement sur les points suivants :
1. **Garantie structurelle :** Nos bacs en bois local teck/limba sont garantis contre toute dégradation fongique prématurée pendant une durée de 3 ans.
2. **Garantie de reprise végétale :** Tout plant qui présenterait un dépérissement dans les 60 jours suivant sa plantation est remplacé immédiatement et sans frais par notre pépinière.
3. **Disponibilité continue des fertilisants :** Notre atelier assure un approvisionnement continu en compost certifié en cas de besoin exceptionnel.
4. **Impact Contenu Local :** 100% de la valeur ajoutée de ce projet est injectée dans l'économie de Pointe-Noire (scieries locales, artisans menuisiers de Tié-Tié et Mpita, collecteurs de résidus organiques et jeunes ingénieurs congolais).

---

### ATTESTATION FINALE ET SIGNATURE

Je soussigné, Responsable de l'entreprise **242Agro**, certifie sur l'honneur l'exactitude des informations techniques et financières présentées dans ce dossier, et confirme notre engagement plein et entier à exécuter les prestations dans les règles de l'art agronomique et environnemental.

Fait pour valoir ce que de droit,  
À Pointe-Noire, le 12 Novembre 2026.  

**Pour 242Agro**  
*La Direction Générale*  
[Signature et cachet officiel de l'entreprise]
`,
    isCustomized: true,
    isHumanValidated: true,
    createdAt: "2026-11-10T14:00:00Z",
    updatedAt: "2026-11-12T08:00:00Z",
    tags: ["TotalEnergies", "RSE", "Dossier Complet", "Prêt à imprimer"]
  },
  {
    id: "doc-02",
    opportunityId: "opp-01",
    opportunityTitle: "Appel à projets RSE TotalEnergies EP Congo",
    title: "Note Conceptuelle et Proposition Technique - Potager Circulaire Djeno",
    documentType: "Note conceptuelle",
    category: "Technique",
    content: `# NOTE CONCEPTUELLE ET MÉTHODOLOGIE TECHNIQUE
## PROJET DE POTAGER CIRCULAIRE ET VALORISATION DES BIODÉCHETS

**Porteur du projet :** 242Agro (Pointe-Noire, Congo)  
**Bénéficiaire :** TotalEnergies EP Congo (Site de Djeno & Base Industrielle)  
**Date :** Novembre 2026  

---

### 1. CONTEXTE ET JUSTIFICATION
Face aux défis de gestion des déchets organiques en milieu industriel et dans la volonté d'offrir aux collaborateurs un cadre de travail végétalisé, 242Agro propose une solution intégrée à boucle fermée. Le principe : valoriser 100% des épluchures et restes végétaux de la cantine pour fertiliser un potager nourricier fournissant herbes aromatiques et légumes frais sur site.

### 2. OBJECTIFS DU PROJET
- **Objectif global :** Réduire de 70% le volume des déchets organiques envoyés en décharge et créer un îlot de biodiversité productive sur site.
- **Objectifs spécifiques :**
  - Installer 12 bacs potagers hors-sol surélevés (superficie totale : 36 m² utiles).
  - Traiter 150 kg de biodéchets de cuisine par semaine dans un composteur 3 compartiments inodore.
  - Produire annuellement 450 kg de légumes feuilles bio (amarante, folon, oseille) et fines herbes.
  - Réaliser 6 sessions de team-building éco-responsable pour les équipes de TotalEnergies.

### 3. DESCRIPTION TECHNIQUE DU DISPOSITIF

#### A. Les modules potagers hors-sol
- **Structure :** Bacs en bois dur local (teck ou limba traité à l'huile végétale naturelle de lin), surélevés à 80 cm du sol pour une ergonomie optimale et une protection contre les rongeurs.
- **Substrat :** Mélange fertile 242Agro (40% compost mûr, 40% terre franche aérée, 20% sciure stabilisée et sable fluvial de rivière lavé).
- **Irrigation :** Réseau goutte-à-goutte basse pression avec réserve d'eau surélevée et minuterie mécanique autonome sans raccordement électrique complexe.

#### B. La station de compostage fermée
- Caissons aérés anti-nuisibles en bois ajouré avec grillage fin inox.
- Processus de fermentation aérobie contrôlé avec apport équilibré en matière carbonée sèche (sciure de menuiserie de Pointe-Noire).

### 4. CALENDRIER D'EXÉCUTION (6 SEMAINES)
- **Semaine 1-2 :** Fabrication des bacs et préparation du substrat à l'atelier 242Agro.
- **Semaine 3 :** Livraison sur site, pose et raccordement de l'irrigation.
- **Semaine 4 :** Repiquage des premiers plants (menthe, basilic, piment végétarien, folon) et mise en route du composteur.
- **Semaine 5-6 :** Première récolte inaugurale et atelier de lancement avec les salariés.

### 5. INDICATEURS DE SUIVI-ÉVALUATION
- Kilogrammes de déchets de cantine détournés par mois.
- Nombre de kilogrammes d'aromates et légumes récoltés.
- Taux de satisfaction des salariés participants aux ateliers.`,
    isCustomized: true,
    isHumanValidated: true,
    createdAt: "2026-11-11T10:00:00Z",
    updatedAt: "2026-11-12T08:30:00Z",
    tags: ["Technique", "Note Conceptuelle", "TotalEnergies"]
  },
  {
    id: "doc-03",
    opportunityId: "opp-01",
    opportunityTitle: "Appel à projets RSE TotalEnergies EP Congo",
    title: "Budget Détaillé et Devis Estimatif Chiffré en FCFA",
    documentType: "Budget détaillé",
    category: "Financier",
    content: `# BUDGET DÉTAILLÉ ET DEVIS ESTIMATIF
## PROJET DE POTAGER INDUSTRIEL CIRCULAIRE 242AGRO
**Monnaie :** Francs CFA (XAF)  
**Client :** TotalEnergies EP Congo  
**Validité de l'offre :** 90 jours  

---

| N° | Désignation des postes de dépenses | Qté | Unité | Prix Unitaire (FCFA) | Montant Total (FCFA) |
|---|---|---|---|---|---|
| **1** | **INFRASTRUCTURES ET POTAGERS HORS-SOL** | | | | |
| 1.1 | Bacs surélevés bois local imputrescible (2m x 1m x 0.8m) | 12 | Unité | 350 000 | 4 200 000 |
| 1.2 | Géotextile protecteur et étanchéité de fond de bac | 12 | Lot | 25 000 | 300 000 |
| 1.3 | Substrat fertile certifié bio 242Agro (compost + terre franche) | 24 | M³ | 45 000 | 1 080 000 |
| 1.4 | Kit réseau d'irrigation goutte-à-goutte gravitaire autonome | 1 | Ens. | 850 000 | 850 000 |
| **2** | **STATION DE COMPOSTAGE CIRCULAIRE** | | | | |
| 2.1 | Composteur 3 bacs aérés en bois traité naturel anti-rongeurs | 1 | Module | 1 200 000 | 1 200 000 |
| 2.2 | Bac de stockage matière brune sèche (sciure de bois) | 1 | Unité | 250 000 | 250 000 |
| 2.3 | Kit d'outils de compostage (aérateur hélicoïdal, thermomètre) | 1 | Lot | 180 000 | 180 000 |
| **3** | **VÉGÉTAUX ET PLANTATION** | | | | |
| 3.1 | Plants d'herbes aromatiques (basilic, menthe, romarin, ciboulette) | 180 | Plants | 2 500 | 450 000 |
| 3.2 | Semis maraîchers locaux (oseille, amarante, piments doux) | 1 | Lot | 220 000 | 220 000 |
| 3.3 | Arbres fruitiers greffés et plantes d'ombrage en pots | 20 | Unités | 25 000 | 500 000 |
| **4** | **FORMATION, ACCOMPAGNEMENT ET SUIVI (6 MOIS)** | | | | |
| 4.1 | Ateliers de team-building et sensibilisation RSE pour le personnel | 4 | Sessions | 450 000 | 1 800 000 |
| 4.2 | Suivi technique agronomique bimensuel (ingénieur 242Agro) | 12 | Passages | 150 000 | 1 800 000 |
| 4.3 | Manuel technique d'entretien et fiches de culture plastifiées | 1 | Lot | 250 000 | 250 000 |
| **5** | **LOGISTIQUE, TRANSPORT ET POSE À DJENO** | | | | |
| 5.1 | Acheminement matériaux, installation et mise en service | 1 | Forfait | 1 500 000 | 1 500 000 |
| | **TOTAL HORS TAXES (FCFA)** | | | | **14 380 000** |
| | Imprévus et contingences techniques (5%) | | | | **719 000** |
| | **MONTANT TOTAL DE LA PROPOSITION (FCFA)** | | | | **15 099 000** |

---

### CONDITIONS FINANCIÈRES :
- **Acompte au démarrage :** 40% à la notification du bon de commande.
- **Deuxième tranche :** 40% à la livraison et réception provisoire des installations.
- **Solde :** 20% à l'issue du premier mois d'exploitation et formation.
- **Règlement :** Virement bancaire au compte de 242Agro à Pointe-Noire.`,
    isCustomized: true,
    isHumanValidated: true,
    createdAt: "2026-11-11T11:00:00Z",
    updatedAt: "2026-11-12T08:35:00Z",
    tags: ["Financier", "Budget", "Devis"]
  }
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: "camp-01",
    campaignName: "Storytelling Santé : Du poison des pesticides à la liberté du potager bio chez soi",
    coreMessage: "Ne nourrissez plus vos enfants avec des légumes aspergés de produits chimiques : produisez vos propres feuilles saines et savoureuses sur votre balcon, véranda ou cour !",
    linkedinPost: `🌿 [TÉMOIGNAGE & SANTÉ PUBLIQUE] « Quand j'ai senti cette odeur d'insecticide chimique sur l'amarante au marché de Tié-Tié, j'ai refusé de la servir à mes enfants. »

C'est une scène vécue par des milliers de parents à Pointe-Noire. 

Chaque matin, sur nos marchés, nous achetons des légumes feuilles — ndolé, folon, oseille, épinards tropicaux — sans savoir avec quels produits ils ont été traités. Pour accélérer les récoltes et éliminer les ravageurs, certains maraîchages périurbains recourent massivement à des pesticides chimiques non contrôlés. 

Le résultat ? Des troubles digestifs récurrents, des allergies inexpliquées et, à long terme, des risques graves pour la santé de nos familles.

Face à cela, la question n'est plus : « Où trouver des légumes sains ? »
La vraie question est : « Pourquoi ne pas les produire vous-même, directement chez vous ? »

Chez 242Agro, nous avons prouvé qu'il n'y a pas besoin de posséder un hectare de terre pour manger bio :
👉 Un recoin sur votre balcon ?
👉 Une véranda dallée ou une terrasse ?
👉 Une cour entièrement bétonnée ou pavée ?

En quelques heures, nous y installons une microferme urbaine propre, surélevée et 100% organique :
✅ Un terreau vivant et fertile nourri au compost naturel
✅ Zéro produit chimique, zéro pesticide
✅ Des feuilles fraîches et herbes aromatiques à cueillir 5 minutes avant votre repas
✅ Le plaisir inestimable de voir vos enfants croquer dans un aliment sain, en toute confiance.

Notre mission est claire : faire de chaque espace disponible à Pointe-Noire un îlot de vie et de santé.

Vous avez une cour, une véranda ou un balcon ? Échangeons directement sur votre projet.

📲 Contact professionnel direct WhatsApp : +242 06 874 22 77
Roc Nkouelolo | CEO & Fondateur de 242Agro
242Agro — Cultivons aujourd’hui, nourrissons demain.

#AgricultureUrbaine #PointeNoire #MangerSain #SanteNaturelle #BioCongo #EntrepreneuriatVert #242Agro`,
    facebookPost: `⚠️ « MAMAN, POURQUOI LES LÉGUMES DU MARCHÉ ONT CETTE ODEUR BIZARRE ? » 🥬🇨🇬

Cette question, une maman de Mpita me l'a posée la semaine dernière avec les larmes aux yeux. 

Elle venait de jeter toute une botte de folon achetée au marché parce qu'en la lavant, une forte odeur de produit chimique s'en dégageait. Et elle avait raison : aujourd'hui, trop de légumes vendus en ville sont inondés d'insecticides dangereux pour gonfler les récoltes. Ce sont nos enfants et nos estomacs qui en paient le prix avec des maux de ventre, des intoxications et des maladies chroniques ! 🛑

Mais imaginez une autre réalité… ✨

Imaginez que ce soir, pour préparer votre repas :
🌱 Vous faites trois pas sur votre véranda, votre balcon ou dans votre cour pavée.
🌱 Vous tendez la main vers un beau bac en bois surélevé, propre et sans boue.
🌱 Vous coupez de l'oseille de Guinée éclatante, du ndolé tendre, de la menthe fraîche ou du basilic parfumé…
🌱 Des légumes arrosés à l'eau claire, nourris au compost naturel, 100% SANS PRODUITS CHIMIQUES !

La fierté dans les yeux de vos enfants. La tranquillité dans votre cœur. Vous savez exactement ce que mange votre famille. ❤️

Peu importe votre espace :
🏠 Même si votre cour est entièrement cimentée !
🌿 Même sur un balcon ou sous une véranda !
🪴 242Agro fabrique et installe chez vous votre potager bio sur mesure en 48 heures, avec livraison des plants et suivi agronomique complet.

La santé de votre famille commence dans votre assiette.

👉 Envoyez-nous un message WhatsApp dès maintenant au +242 06 874 22 77 pour voir nos réalisations à Pointe-Noire et commander votre potager bio !

Roc Nkouelolo — CEO & Fondateur de 242Agro
242Agro — Cultivons aujourd’hui, nourrissons demain.

#PointeNoire #SanteFamille #MangerBioCongo #PotagerMaison #AgricultureUrbaine #242Agro`,
    whatsappMessage: `Bonjour ! 🌱 Saviez-vous que vous pouvez récolter vos propres légumes 100% bio et sans aucun pesticide chimique chez vous à Pointe-Noire, même sur un balcon, une véranda ou une cour bétonnée ? 

242Agro conçoit et installe des potagers hors-sol sur mesure en bois noble avec terreau fertile et suivi agronomique. Protégez la santé de votre foyer dès aujourd'hui !

Échangez directement avec moi sur WhatsApp : +242 06 874 22 77 (Roc Nkouelolo, CEO 242Agro). Répondez "BIO" pour recevoir notre catalogue photos ! 🌿`,
    prospectingEmail: {
      subject: "Et si votre espace extérieur devenait une source d'alimentation saine et garantie sans pesticide ?",
      body: `Bonjour,

À Pointe-Noire, nous sommes de plus en plus nombreux à nous inquiéter de l'origine et des traitements chimiques appliqués aux légumes frais commercialisés sur nos marchés.

Je suis Roc Nkouelolo, CEO et fondateur de 242Agro. Nous avons créé une entreprise qui installe des microfermes urbaines et des potagers hors-sol surélevés pour permettre aux familles, écoles, restaurants et organisations de produire localement leurs propres légumes et herbes aromatiques, 100% organiques.

Qu'il s'agisse d'un balcon, d'une véranda, d'une cour dallée ou d'une terrasse, nous concevons des espaces productifs propres, sans contact avec les sols pollués, équipés d'un substrat naturel et d'un arrosage autonome.

Seriez-vous disponible pour un échange téléphonique de 5 minutes ou un passage amical sur site afin d'évaluer le potentiel de votre espace ?

Bien à vous,

Roc Nkouelolo
CEO & Fondateur de 242Agro
WhatsApp : +242 06 874 22 77
E-mail : 242agro@gmail.com
Site : https://242agropn.netlify.app/
"242Agro — Cultivons aujourd’hui, nourrissons demain."`
    },
    salesPitch: "Bonjour ! Est-ce que vous savez réellement ce qu'il y a sur les légumes que nous mangeons tous les jours à Pointe-Noire ? Entre les pesticides non dosés et les eaux de ruissellement douteuses, beaucoup de familles s'empoisonnent sans le savoir. Moi, c'est Roc Nkouelolo de 242Agro. Nous venons chez vous installer un potager surélevé en bois noble sur votre balcon, véranda ou cour pavée. Aucun produit chimique, un terreau au compost naturel, et en quelques semaines, vous cueillez vos légumes frais devant vos enfants. C'est propre, esthétique et c'est la meilleure assurance santé pour votre foyer. On regarde votre espace ensemble ?",
    posterConcept: {
      headline: "PROTÉGEZ LA SANTÉ DE VOTRE FAMILLE : VOS LÉGUMES 100% BIO CHEZ VOUS",
      subheadline: "Zéro pesticide, zéro chimie : cultivez vos légumes frais sur votre balcon, véranda ou cour à Pointe-Noire !",
      bulletPoints: [
        "100% Organique : Garantie absolue pour la santé des enfants",
        "S'installe partout : Balcon, véranda, cour bétonnée, terrasse",
        "Suivi agronomique complet par Roc Nkouelolo et l'équipe 242Agro"
      ],
      callToAction: "Contactez Roc Nkouelolo sur WhatsApp : +242 06 874 22 77",
      visualDescription: "Une famille souriante cueillant de l'amarante et de la menthe parfumée dans un bac en bois surélevé élégant posé sur une véranda lumineuse de Pointe-Noire, avec fond vert naturel émeraude et logo 242Agro officiel.",
      accentColor: "#059669",
      suggestedFormat: "Carré 1080x1080 (Réseaux) ou A4 (Impression)"
    },
    createdAt: "2026-11-12T08:30:00Z",
    isApproved: true
  },
  {
    id: "camp-02",
    campaignName: "Valorisation d'espaces pour Écoles, Églises et Organisations",
    coreMessage: "Et si votre cour, votre terrasse ou votre terrain devenait un espace de production alimentaire et d'apprentissage ?",
    linkedinPost: `🏛️ [MICROFERMES URBAINES POUR ORGANISATIONS] Comment transformer un espace inerte en lieu vivant de production et de cohésion ?

À Pointe-Noire, de nombreux établissements scolaires, églises, entreprises et associations disposent de cours, terrasses ou petites parcelles sous-utilisées.

Chez 242Agro, nous accompagnons les gestionnaires et décideurs pour transformer ces surfaces en microfermes urbaines circulaires :
🌱 Potagers pédagogiques pour éveiller les élèves au vivant
🌱 Unités de compostage pour valoriser les biodéchets
🌱 Petits élevages intégrés (poules pondeuses ou lapins selon faisabilité)
🌱 Cadre de travail apaisant et valorisation RSE tangible

Zone d'intervention : Pointe-Noire et environs.

Échangeons sur votre espace et vos objectifs.

📲 Contact professionnel WhatsApp : +242 06 874 22 77
Roc Nkouelolo | CEO & Fondateur de 242Agro
Site : https://242agropn.netlify.app/

#RSECongo #EcolesVertes #PointeNoire #AgricultureUrbaine #242Agro`,
    facebookPost: `🏫 ÉCOLES, ÉGLISES, ASSOCIATIONS DE POINTE-NOIRE : ET SI VOS COURS NOURRISSAIENT L'AVENIR ? 🇨🇬🌿

Vous avez une cour d'école, un espace d'église ou une terrasse d'entreprise ? 
Ne laissez pas ces espaces vides ou poussiéreux ! 

Avec 242Agro, nous créons des espaces de production alimentaire et d'apprentissage clés en main :
📚 Potagers pédagogiques adaptés aux enfants
🥚 Petits élevages intégrés de poules pondeuses ou lapins
🍂 Compostage des feuilles et déchets organiques
👨‍🌾 Ateliers pratiques et suivi agronomique régulier

Faire pousser, même là où la ville laisse peu de place à la terre : c'est la mission de 242Agro.

Contactez directement Roc Nkouelolo sur WhatsApp au +242 06 874 22 77 pour planifier une visite gratuite de votre site !

#PointeNoire #EducationVerte #MicrofermeUrbaine #CongoDurable #242Agro`,
    whatsappMessage: `Bonjour ! Vous gérez une école, une église, un restaurant ou une organisation à Pointe-Noire ? 242Agro étudie et installe des microfermes urbaines sur mesure (potagers, compostage, élevage intégré) adaptées à votre cour ou terrasse. Contactez directement Roc Nkouelolo au +242 06 874 22 77 pour une étude de faisabilité gratuite ! 🌿`,
    prospectingEmail: {
      subject: "Projet de valorisation d'espace : Potagers pédagogiques et microfermes pour votre organisation",
      body: `Bonjour,

Je suis Roc Nkouelolo, CEO et fondateur de 242Agro à Pointe-Noire.

Nous accompagnons les écoles, églises, restaurants et organisations dans l'aménagement d'espaces de production agricole hors-sol : potagers urbains, valorisation organique et ateliers pédagogiques.

Nous serions ravis de visiter votre établissement afin d'échanger sur vos espaces disponibles et vous proposer une étude adaptée à votre budget.

Bien cordialement,

Roc Nkouelolo
CEO & Fondateur de 242Agro
WhatsApp : +242 06 874 22 77
Site : https://242agropn.netlify.app/`
    },
    salesPitch: "Votre cour d'école ou votre espace d'organisation peut devenir le plus beau support d'apprentissage et de vie de Pointe-Noire. Avec 242Agro, nous aménageons des potagers sécurisés et productifs, où les membres apprennent à semer, composter et récolter du bio sans danger. Parlons de votre projet dès cette semaine !",
    posterConcept: {
      headline: "TRANSFORMEZ VOTRE ESPACE EN LIEU DE VIE ET DE PRODUCTION",
      subheadline: "Microfermes circulaires et potagers pour écoles, églises et organisations à Pointe-Noire.",
      bulletPoints: [
        "Potagers pédagogiques clés en main",
        "Compostage et petits élevages intégrés",
        "Accompagnement agronomique et formations"
      ],
      callToAction: "Contact WhatsApp : +242 06 874 22 77 — Roc Nkouelolo",
      visualDescription: "Des élèves et des enseignants souriants observant la pousse de légumes verts vigoureux dans un potager hors-sol en bois clair, en plein cœur de Pointe-Noire.",
      accentColor: "#0d9488",
      suggestedFormat: "Carré 1080x1080 (Réseaux)"
    },
    createdAt: "2026-11-12T08:35:00Z",
    isApproved: true
  }
];
