import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Opportunity,
  DocumentRecord,
  MarketNeed,
  KeywordItem,
  CRMLead,
  MarketingCampaign,
  AppNotification,
  CRMStage,
  OpportunityAnalysis,
} from "../types";
import {
  INITIAL_OPPORTUNITIES,
  INITIAL_MARKET_NEEDS,
  INITIAL_KEYWORDS,
  INITIAL_CRM_LEADS,
  INITIAL_DOCUMENTS,
  INITIAL_CAMPAIGNS,
} from "../data/initialData";

interface SearchConfig {
  zone: string;
  category: string;
  interval: "24h" | "3days" | "weekly";
  autoAlerts: boolean;
  email: string;
  lastRun?: string;
}

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedOpportunityId: string | null;
  setSelectedOpportunityId: (id: string | null) => void;

  opportunities: Opportunity[];
  setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
  addOpportunity: (opp: Opportunity) => void;
  updateOpportunity: (opp: Opportunity) => void;
  deleteOpportunity: (id: string) => void;
  toggleFavoriteOpportunity: (id: string) => void;
  analyzeOpportunityAction: (opp: Opportunity) => Promise<OpportunityAnalysis | null>;

  documents: DocumentRecord[];
  addDocument: (doc: DocumentRecord) => void;
  updateDocument: (doc: DocumentRecord) => void;
  deleteDocument: (id: string) => void;
  validateDocument: (id: string) => void;

  marketNeeds: MarketNeed[];
  addMarketNeed: (need: MarketNeed) => void;
  createOpportunityFromNeed: (need: MarketNeed) => void;

  keywords: KeywordItem[];
  setKeywords: React.Dispatch<React.SetStateAction<KeywordItem[]>>;
  addKeyword: (kw: KeywordItem) => void;

  campaigns: MarketingCampaign[];
  addCampaign: (camp: MarketingCampaign) => void;
  approveCampaign: (id: string) => void;

  leads: CRMLead[];
  addLead: (lead: CRMLead) => void;
  updateLead: (lead: CRMLead) => void;
  moveLeadStage: (leadId: string, stage: CRMStage) => void;
  deleteLead: (id: string) => void;

  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type?: "priority" | "deadline" | "system" | "success") => void;

  searchConfig: SearchConfig;
  updateSearchConfig: (config: Partial<SearchConfig>) => void;
  runScheduledScan: () => Promise<void>;
  isScanning: boolean;

  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>("opp-01");
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Load from localStorage or fallback to defaults
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem("242agro_opportunities");
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    const saved = localStorage.getItem("242agro_documents");
    if (!saved) return INITIAL_DOCUMENTS;
    try {
      const parsed = JSON.parse(saved);
      const upgraded = parsed.map((d: DocumentRecord) => {
        if (d.id === "doc-01" && (!d.content || d.content.length < 3000)) {
          return INITIAL_DOCUMENTS[0];
        }
        return d;
      });
      return upgraded;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [marketNeeds, setMarketNeeds] = useState<MarketNeed[]>(() => {
    const saved = localStorage.getItem("242agro_market_needs");
    return saved ? JSON.parse(saved) : INITIAL_MARKET_NEEDS;
  });

  const [keywords, setKeywords] = useState<KeywordItem[]>(() => {
    const saved = localStorage.getItem("242agro_keywords");
    return saved ? JSON.parse(saved) : INITIAL_KEYWORDS;
  });

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => {
    const saved = localStorage.getItem("242agro_campaigns");
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [leads, setLeads] = useState<CRMLead[]>(() => {
    const saved = localStorage.getItem("242agro_leads");
    return saved ? JSON.parse(saved) : INITIAL_CRM_LEADS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem("242agro_notifications");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "notif-1",
        title: "Opportunité prioritaire détectée",
        message: "L'appel à projets RSE TotalEnergies EP Congo est noté à 94/100 (Priorité absolue).",
        type: "priority",
        date: new Date().toISOString(),
        read: false,
        actionTab: "opportunites",
        actionId: "opp-01",
      },
      {
        id: "notif-2",
        title: "Échéance proche : Écoles vertes",
        message: "Date limite de candidature fixée au 30 novembre 2026.",
        type: "deadline",
        date: new Date(Date.now() - 3600000 * 4).toISOString(),
        read: false,
        actionTab: "opportunites",
        actionId: "opp-02",
      },
    ];
  });

  const [searchConfig, setSearchConfig] = useState<SearchConfig>(() => {
    const saved = localStorage.getItem("242agro_search_config");
    return saved
      ? JSON.parse(saved)
      : {
          zone: "Pointe-Noire",
          category: "all",
          interval: "24h",
          autoAlerts: true,
          email: "242agro@gmail.com",
          lastRun: new Date().toISOString(),
        };
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("242agro_opportunities", JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem("242agro_documents", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("242agro_market_needs", JSON.stringify(marketNeeds));
  }, [marketNeeds]);

  useEffect(() => {
    localStorage.setItem("242agro_keywords", JSON.stringify(keywords));
  }, [keywords]);

  useEffect(() => {
    localStorage.setItem("242agro_campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem("242agro_leads", JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem("242agro_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("242agro_search_config", JSON.stringify(searchConfig));
  }, [searchConfig]);

  const addNotification = (
    title: string,
    message: string,
    type: "priority" | "deadline" | "system" | "success" = "system"
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addOpportunity = (opp: Opportunity) => {
    setOpportunities((prev) => {
      // Avoid duplicates
      const exists = prev.some(
        (o) =>
          o.title.toLowerCase().trim() === opp.title.toLowerCase().trim() &&
          o.issuer.toLowerCase().trim() === opp.issuer.toLowerCase().trim()
      );
      if (exists) return prev;
      return [opp, ...prev];
    });

    if (opp.matchScore >= 85) {
      addNotification(
        "Nouvelle opportunité prioritaire !",
        `${opp.title} (${opp.issuer}) notée à ${opp.matchScore}/100.`,
        "priority"
      );
    }
  };

  const updateOpportunity = (opp: Opportunity) => {
    setOpportunities((prev) => prev.map((o) => (o.id === opp.id ? opp : o)));
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  };

  const toggleFavoriteOpportunity = (id: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isFavorite: !o.isFavorite } : o))
    );
  };

  const analyzeOpportunityAction = async (
    opp: Opportunity
  ): Promise<OpportunityAnalysis | null> => {
    try {
      const res = await fetch("/api/opportunities/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunity: opp }),
      });
      if (!res.ok) {
        throw new Error("Échec de l'analyse IA");
      }
      const data = await res.json();
      if (data.analysis) {
        const updatedOpp: Opportunity = {
          ...opp,
          matchScore: data.analysis.totalScore,
          analysis: {
            ...data.analysis,
            analyzedAt: new Date().toISOString(),
          },
        };
        updateOpportunity(updatedOpp);
        addNotification(
          "Analyse IA terminée",
          `L'analyse de "${opp.title}" est prête avec une note de ${data.analysis.totalScore}/100.`,
          "success"
        );
        return data.analysis;
      }
      return null;
    } catch (e: any) {
      console.error(e);
      addNotification("Erreur lors de l'analyse", e.message, "system");
      return null;
    }
  };

  const addDocument = (doc: DocumentRecord) => {
    setDocuments((prev) => [doc, ...prev]);
    addNotification("Nouveau document généré", `"${doc.title}" a été ajouté au bureau documentaire.`, "success");
  };

  const updateDocument = (doc: DocumentRecord) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...doc, updatedAt: new Date().toISOString() } : d))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const validateDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, isHumanValidated: true, updatedAt: new Date().toISOString() }
          : d
      )
    );
    addNotification("Validation humaine enregistrée", "Le document est certifié et validé pour envoi officiel.", "success");
  };

  const addMarketNeed = (need: MarketNeed) => {
    setMarketNeeds((prev) => [need, ...prev]);
  };

  const createOpportunityFromNeed = (need: MarketNeed) => {
    const newOpp: Opportunity = {
      id: `opp-need-${Date.now()}`,
      title: `Prestation sur mesure : ${need.needTitle}`,
      issuer: need.targetSegment,
      category: "Demandes de prestations agricoles",
      location: need.location,
      zone: "Pointe-Noire",
      publishedDate: new Date().toISOString().split("T")[0],
      deadline: "2026-12-31",
      budgetAmount: "Sur devis 242Agro",
      description: `${need.observedSignals}. Solution proposée : ${need.solutionBy242Agro}`,
      conditions: "Prospection commerciale directe et audit initial gratuit.",
      requiredSkills: ["Agriculture urbaine", "Aménagement sur mesure", "Conseil agronomique"],
      documentsRequired: ["Devis professionnel", "Proposition technique"],
      contactInfo: "contact@242agro.cg",
      sourceUrl: "https://242agropn.netlify.app/",
      reliability: "Haute",
      lastVerifiedAt: new Date().toISOString(),
      matchScore: need.commercialPotential === "Très élevé" || need.commercialPotential === "Stratégique" ? 90 : 75,
      matchReason: "Opportunité créée directement depuis les signaux de marché observés à Pointe-Noire.",
      status: "new",
    };
    addOpportunity(newOpp);
    setSelectedOpportunityId(newOpp.id);
    setActiveTab("opportunites");
    addNotification("Opportunité créée", `L'opportunité issue du besoin "${need.needTitle}" a été enregistrée.`, "success");
  };

  const addKeyword = (kw: KeywordItem) => {
    setKeywords((prev) => [kw, ...prev]);
  };

  const addCampaign = (camp: MarketingCampaign) => {
    setCampaigns((prev) => [camp, ...prev]);
    addNotification("Campagne créée", `La campagne "${camp.campaignName}" a été générée dans le Studio.`, "success");
  };

  const approveCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isApproved: true } : c))
    );
    addNotification("Campagne validée", "La campagne a été validée pour diffusion humaine.", "success");
  };

  const addLead = (lead: CRMLead) => {
    setLeads((prev) => [lead, ...prev]);
    addNotification("Nouveau prospect CRM", `Le prospect "${lead.clientName}" a été ajouté au pipeline.`, "success");
  };

  const updateLead = (lead: CRMLead) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === lead.id ? { ...lead, updatedAt: new Date().toISOString() } : l
      )
    );
  };

  const moveLeadStage = (leadId: string, stage: CRMStage) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const updatedHistory = [
            ...l.history,
            {
              date: new Date().toISOString().split("T")[0],
              action: `Étape changée vers : ${stage}`,
              user: "Direction 242Agro",
            },
          ];
          return {
            ...l,
            stage,
            history: updatedHistory,
            updatedAt: new Date().toISOString(),
          };
        }
        return l;
      })
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const updateSearchConfig = (config: Partial<SearchConfig>) => {
    setSearchConfig((prev) => ({ ...prev, ...config }));
  };

  const runScheduledScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/opportunities/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zone: searchConfig.zone,
          category: searchConfig.category,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.opportunities && Array.isArray(data.opportunities)) {
          let newCount = 0;
          data.opportunities.forEach((opp: any) => {
            const id = `opp-scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
            const fullOpp: Opportunity = {
              id,
              title: opp.title,
              issuer: opp.issuer,
              category: opp.category || "Appels à projets et financements",
              location: opp.location || searchConfig.zone,
              zone: (opp.zone as any) || "Pointe-Noire",
              publishedDate: opp.publishedDate || new Date().toISOString().split("T")[0],
              deadline: opp.deadline || "2026-12-31",
              budgetAmount: opp.budgetAmount || "Non spécifié",
              description: opp.description || "",
              conditions: opp.conditions || "Voir avis officiel",
              requiredSkills: opp.requiredSkills || ["Agriculture urbaine"],
              documentsRequired: opp.documentsRequired || ["Manifestation d'intérêt"],
              contactInfo: opp.contactInfo || "contact@cg.undp.org",
              sourceUrl: opp.sourceUrl || "https://242agropn.netlify.app/",
              reliability: opp.reliability || "Haute",
              lastVerifiedAt: new Date().toISOString(),
              matchScore: opp.matchScore || 85,
              matchReason: opp.matchReason || "Correspondance détectée par la veille IA.",
              status: "new",
            };
            addOpportunity(fullOpp);
            newCount++;
          });
          updateSearchConfig({ lastRun: new Date().toISOString() });
          addNotification(
            "Veille automatique terminée",
            `${newCount} opportunités analysées et rafraîchies pour ${searchConfig.zone}.`,
            "success"
          );
        }
      }
    } catch (e: any) {
      console.error(e);
      addNotification("Erreur scan de veille", e.message, "system");
    } finally {
      setIsScanning(false);
    }
  };

  const exportBackup = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      appName: "242Agro Intelligence",
      opportunities,
      documents,
      marketNeeds,
      keywords,
      campaigns,
      leads,
      searchConfig,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `242Agro_Intelligence_Sauvegarde_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification("Sauvegarde exportée", "Fichier JSON téléchargé avec succès.", "success");
  };

  const importBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.opportunities) setOpportunities(parsed.opportunities);
      if (parsed.documents) setDocuments(parsed.documents);
      if (parsed.marketNeeds) setMarketNeeds(parsed.marketNeeds);
      if (parsed.keywords) setKeywords(parsed.keywords);
      if (parsed.campaigns) setCampaigns(parsed.campaigns);
      if (parsed.leads) setLeads(parsed.leads);
      if (parsed.searchConfig) setSearchConfig(parsed.searchConfig);
      addNotification("Restauration réussie", "Toutes les données ont été synchronisées.", "success");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const resetAllData = () => {
    setOpportunities(INITIAL_OPPORTUNITIES);
    setDocuments(INITIAL_DOCUMENTS);
    setMarketNeeds(INITIAL_MARKET_NEEDS);
    setKeywords(INITIAL_KEYWORDS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setLeads(INITIAL_CRM_LEADS);
    localStorage.clear();
    addNotification("Réinitialisation", "Données restaurées aux paramètres officiels 242Agro.", "system");
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedOpportunityId,
        setSelectedOpportunityId,
        opportunities,
        setOpportunities,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        toggleFavoriteOpportunity,
        analyzeOpportunityAction,
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        validateDocument,
        marketNeeds,
        addMarketNeed,
        createOpportunityFromNeed,
        keywords,
        setKeywords,
        addKeyword,
        campaigns,
        addCampaign,
        approveCampaign,
        leads,
        addLead,
        updateLead,
        moveLeadStage,
        deleteLead,
        notifications,
        markNotificationRead,
        clearNotifications,
        addNotification,
        searchConfig,
        updateSearchConfig,
        runScheduledScan,
        isScanning,
        exportBackup,
        importBackup,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
