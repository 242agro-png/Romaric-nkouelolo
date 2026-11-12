export type OpportunityCategory =
  | "Appels à projets et financements"
  | "Appels d'offres et marchés"
  | "Demandes de prestations agricoles"
  | "Besoins de partenaires techniques"
  | "Projets environnementaux"
  | "Sponsoring et financement RSE"
  | "Fourniture de plants et équipements"
  | "Formations et prestations éducatives"
  | "Partenariats commerciaux"
  | "Concours et incubation";

export type GeographicZone =
  | "Pointe-Noire"
  | "République du Congo"
  | "Afrique centrale"
  | "Afrique"
  | "International";

export type ReliabilityLevel = "Vérifiée" | "Haute" | "Moyenne" | "À confirmer";

export type CRMStage =
  | "detected"
  | "selected"
  | "dossier_prep"
  | "submitted"
  | "prospect_contacted"
  | "meeting_scheduled"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost";

export interface CriterionScore {
  criterion: string;
  score: number;
  max: number;
  comment: string;
}

export interface PartnerSuggestion {
  name: string;
  role: string;
}

export interface RiskMitigation {
  risk: string;
  severity: "Faible" | "Moyen" | "Élevé";
  mitigation: string;
}

export interface ActionPlanStep {
  step: number;
  action: string;
  deadline: string;
}

export interface OpportunityAnalysis {
  totalScore: number;
  classification: "prioritaire" | "interessante" | "a_etudier" | "faible";
  criteriaBreakdown: CriterionScore[];
  executiveSummary: string;
  clientNeedAnalysis: string;
  eligibilityCheck: string;
  agroSkillsToMobilize: string[];
  deliverablesOffered: string[];
  missingSkillsOrWeaknesses: string[];
  recommendedPartners: PartnerSuggestion[];
  estimatedBudget: {
    currency: string;
    totalEstimated: string;
    assumptions: string;
  };
  risksAndMitigations: RiskMitigation[];
  recommendedStrategy: string;
  actionPlan: ActionPlanStep[];
  analyzedAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  issuer: string;
  category: OpportunityCategory;
  location: string;
  zone: GeographicZone;
  publishedDate: string;
  deadline: string;
  budgetAmount: string;
  description: string;
  conditions: string;
  requiredSkills: string[];
  documentsRequired: string[];
  contactInfo: string;
  sourceUrl: string;
  reliability: ReliabilityLevel;
  lastVerifiedAt: string;
  matchScore: number;
  matchReason: string;
  isFavorite?: boolean;
  status: "new" | "in_review" | "applied" | "archived";
  analysis?: OpportunityAnalysis;
}

export type DocumentCategoryType = "Administratif" | "Technique" | "Financier";

export interface DocumentRecord {
  id: string;
  opportunityId?: string;
  opportunityTitle?: string;
  title: string;
  documentType: string;
  category: DocumentCategoryType;
  content: string;
  isCustomized: boolean;
  isHumanValidated: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface PosterConcept {
  headline: string;
  subheadline: string;
  bulletPoints: string[];
  callToAction: string;
  visualDescription: string;
  accentColor: string;
  suggestedFormat: string;
}

export interface MarketingCampaign {
  id: string;
  opportunityId?: string;
  campaignName: string;
  coreMessage: string;
  linkedinPost: string;
  facebookPost: string;
  whatsappMessage: string;
  prospectingEmail: {
    subject: string;
    body: string;
  };
  salesPitch: string;
  posterConcept: PosterConcept;
  createdAt: string;
  isApproved: boolean;
}

export interface MarketNeed {
  id: string;
  needTitle: string;
  targetSegment: string;
  location: string;
  observedSignals: string;
  signalFrequency: string;
  marketInterestLevel: string;
  solutionBy242Agro: string;
  commercialPotential: "Très élevé" | "Élevé" | "Moyen" | "Stratégique";
  pitchProposal: string;
  isOpportunityCreated?: boolean;
}

export interface KeywordItem {
  keyword: string;
  searchIntent: string;
  targetAudience: string;
  commercialValue: "Haute" | "Moyenne" | "Très Haute";
  competitionLevel: "Faible" | "Moyenne" | "Élevée";
  suggestedAngle: string;
  associatedPhrases: string[];
  recommendedChannel: string;
}

export interface CRMLead {
  id: string;
  opportunityId?: string;
  title: string;
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  stage: CRMStage;
  potentialValueFCFA: number;
  probability: number;
  nextFollowUpDate: string;
  notes: string;
  history: {
    date: string;
    action: string;
    user: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface StrategyResponse {
  clientNeedDeepAnalysis: string;
  technicalOffer: string;
  recommendedGardenModel: string;
  equipmentList: string[];
  plantAndLivestockList: string[];
  trainingCurriculum: string;
  executionTimeline: string;
  provisionalBudget: string;
  commercialPitch: string;
  prospectingEmailDraft: string;
  postInstallationCarePlan: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "priority" | "deadline" | "system" | "success";
  date: string;
  read: boolean;
  actionTab?: string;
  actionId?: string;
}
