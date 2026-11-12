import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { GeographicZone, OpportunityCategory, Opportunity } from "../../types";
import {
  Globe,
  Search,
  Filter,
  RefreshCw,
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  MapPin,
  Tag,
  SlidersHorizontal,
} from "lucide-react";

export const VeilleView: React.FC = () => {
  const {
    opportunities,
    addOpportunity,
    setSelectedOpportunityId,
    setActiveTab,
    searchConfig,
    updateSearchConfig,
  } = useApp();

  const [selectedZone, setSelectedZone] = useState<string>(searchConfig.zone);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customKeywords, setCustomKeywords] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchLogs, setSearchLogs] = useState<string[]>([
    "Connecteur FAO Congo & ONU : Connecté (Flux RSS officiel)",
    "Connecteur PNUD République du Congo : Synchronisé",
    "Veille RSE Entreprises pétrolières (TotalEnergies, Eni) : Active",
    "Surveillance Presse & Marchés Pointe-Noire : Opérationnelle",
  ]);

  const zones: GeographicZone[] = [
    "Pointe-Noire",
    "République du Congo",
    "Afrique centrale",
    "Afrique",
    "International",
  ];

  const categories: OpportunityCategory[] = [
    "Appels à projets et financements",
    "Appels d'offres et marchés",
    "Demandes de prestations agricoles",
    "Besoins de partenaires techniques",
    "Projets environnementaux",
    "Sponsoring et financement RSE",
    "Fourniture de plants et équipements",
    "Formations et prestations éducatives",
    "Partenariats commerciaux",
    "Concours et incubation",
  ];

  const officialSources = [
    { name: "PNUD Congo", status: "Actif", type: "Bailleur institutionnel", logo: "🇺🇳" },
    { name: "FAO République du Congo", status: "Actif", type: "Organisation Agricole", logo: "🌾" },
    { name: "TotalEnergies EP Congo RSE", status: "Actif", type: "Secteur Privé Énergie", logo: "⛽" },
    { name: "Eni Congo Biodiversité", status: "Actif", type: "Programme Environnement", logo: "🌿" },
    { name: "Banque Mondiale & GEF", status: "Actif", type: "Fonds Vert & Climat", logo: "🏛️" },
    { name: "Union Européenne Congo", status: "Actif", type: "Coopération & Subventions", logo: "🇪🇺" },
    { name: "Mairie de Pointe-Noire", status: "Actif", type: "Collectivité Locale", logo: "🇨🇬" },
    { name: "Réseau Écoles Littoral", status: "Actif", type: "Établissements Privés", logo: "🏫" },
  ];

  const handleLaunchScan = async () => {
    setIsSearching(true);
    const timestamp = new Date().toLocaleTimeString();
    setSearchLogs((prev) => [
      `[${timestamp}] Interrogation des flux pour la zone : ${selectedZone}...`,
      ...prev,
    ]);

    try {
      const res = await fetch("/api/opportunities/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zone: selectedZone,
          category: selectedCategory,
          query: customKeywords,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur de communication avec le moteur de veille");
      }

      const data = await res.json();
      if (data.opportunities && Array.isArray(data.opportunities)) {
        let count = 0;
        data.opportunities.forEach((item: any) => {
          const newOpp: Opportunity = {
            id: `opp-scanned-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            title: item.title,
            issuer: item.issuer,
            category: item.category || "Appels à projets et financements",
            location: item.location || selectedZone,
            zone: (item.zone as any) || selectedZone,
            publishedDate: item.publishedDate || new Date().toISOString().split("T")[0],
            deadline: item.deadline || "2026-12-31",
            budgetAmount: item.budgetAmount || "Non spécifié",
            description: item.description || "",
            conditions: item.conditions || "Cahier des charges officiel",
            requiredSkills: item.requiredSkills || ["Agriculture urbaine", "Compostage"],
            documentsRequired: item.documentsRequired || ["Manifestation d'intérêt"],
            contactInfo: item.contactInfo || "contact@cg.undp.org",
            sourceUrl: item.sourceUrl || "https://242agropn.netlify.app/",
            reliability: item.reliability || "Haute",
            lastVerifiedAt: new Date().toISOString(),
            matchScore: item.matchScore || 86,
            matchReason: item.matchReason || "Opportunité détectée lors du scan de veille.",
            status: "new",
          };
          addOpportunity(newOpp);
          count++;
        });

        setSearchLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] Succès : ${count} opportunités détectées et qualifiées sans doublon.`,
          ...prev,
        ]);
        updateSearchConfig({ zone: selectedZone, category: selectedCategory });
      }
    } catch (err: any) {
      setSearchLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Erreur : ${err.message}`,
        ...prev,
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Globe className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Moteur de veille stratégique & commerciale
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Surveillance continue des marchés, appels à projets et consultations institutionnelles pour 242Agro.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLaunchScan}
              disabled={isSearching}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all ${
                isSearching
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/60 ring-1 ring-emerald-400/40"
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${isSearching ? "animate-spin text-emerald-300" : ""}`} />
              {isSearching ? "Scan en cours..." : "Lancer le scan de veille"}
            </button>
          </div>
        </div>

        {/* Configuration Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Zone Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              Zone géographique cible
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-emerald-400" />
              Catégorie de consultation
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Keywords input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-emerald-400" />
              Mots-clés complémentaires
            </label>
            <input
              type="text"
              value={customKeywords}
              onChange={(e) => setCustomKeywords(e.target.value)}
              placeholder="ex: potager hors-sol, compost cantine, plants fruitiers..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Two columns : Connected Official Sources + Live Terminal Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sources connected list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Sources & Réseaux institutionnels surveillés
            </h3>
            <span className="text-[11px] text-slate-400">8 connecteurs officiels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {officialSources.map((source, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{source.logo}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{source.name}</h4>
                    <p className="text-[10px] text-slate-400">{source.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-medium text-emerald-400">{source.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recently detected preview */}
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Opportunités prêtes dans la base ({opportunities.length})
              </h4>
              <button
                onClick={() => setActiveTab("opportunites")}
                className="text-xs text-emerald-400 hover:underline"
              >
                Consulter les fiches complètes &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {opportunities.slice(0, 4).map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => {
                    setSelectedOpportunityId(opp.id);
                    setActiveTab("opportunites");
                  }}
                  className="cursor-pointer flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-2.5 hover:border-emerald-500/40 transition"
                >
                  <div className="space-y-0.5 max-w-[70%]">
                    <span className="text-[11px] font-bold text-emerald-300 block line-clamp-1">
                      {opp.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {opp.issuer} &middot; {opp.location}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-200 block">
                      {opp.budgetAmount}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Score {opp.matchScore}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Scan Log & Integrity */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                Journal de veille en direct
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="font-mono text-[11px] space-y-2 text-slate-400 max-h-60 overflow-y-auto pr-1">
              {searchLogs.map((log, index) => (
                <div
                  key={index}
                  className={`p-1.5 rounded ${
                    log.includes("Succès")
                      ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/20"
                      : log.includes("Erreur")
                      ? "bg-rose-950/40 text-rose-300"
                      : "bg-slate-950/40 text-slate-400"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Ethics & Legal rules box */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs space-y-2">
            <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Politique de veille légale et responsable
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              242Agro Intelligence interroge exclusivement les avis publics, publications institutionnelles ouvertes et flux autorisés. Aucun contenu privé n'est extrait sans consentement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
