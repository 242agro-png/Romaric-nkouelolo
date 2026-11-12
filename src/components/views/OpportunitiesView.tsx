import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Opportunity } from "../../types";
import {
  Search,
  Filter,
  Bookmark,
  Building,
  Calendar,
  Clock,
  ExternalLink,
  BrainCircuit,
  FileText,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  X,
  Target,
  Share2,
  Trash2,
} from "lucide-react";

export const OpportunitiesView: React.FC = () => {
  const {
    opportunities,
    deleteOpportunity,
    toggleFavoriteOpportunity,
    setSelectedOpportunityId,
    selectedOpportunityId,
    setActiveTab,
    addLead,
    analyzeOpportunityAction,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZoneFilter, setSelectedZoneFilter] = useState("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // Selected opportunity for detail modal/drawer
  const activeDetailOpp =
    opportunities.find((o) => o.id === selectedOpportunityId) || opportunities[0];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZoneFilter === "all" || opp.zone === selectedZoneFilter;
    const matchesCategory =
      selectedCategoryFilter === "all" || opp.category === selectedCategoryFilter;
    const matchesFav = !onlyFavorites || opp.isFavorite;

    return matchesSearch && matchesZone && matchesCategory && matchesFav;
  });

  const handleAnalyze = async (opp: Opportunity) => {
    setAnalyzingId(opp.id);
    setSelectedOpportunityId(opp.id);
    await analyzeOpportunityAction(opp);
    setAnalyzingId(null);
    setActiveTab("analyse");
  };

  const handleCreateCRMLead = (opp: Opportunity) => {
    let budgetNum = 5000000;
    const match = opp.budgetAmount.match(/([0-9\s]+)\s*FCFA/i);
    if (match) {
      budgetNum = parseInt(match[1].replace(/\s/g, ""), 10) || 5000000;
    }

    addLead({
      id: `lead-auto-${Date.now()}`,
      opportunityId: opp.id,
      title: opp.title,
      clientName: opp.issuer,
      contactPerson: "Responsable Achats / RSE",
      email: opp.contactInfo.includes("@") ? opp.contactInfo : "contact@partenaire.cg",
      phone: "+242 06 000 00 00",
      location: opp.location,
      stage: "selected",
      potentialValueFCFA: budgetNum,
      probability: opp.matchScore >= 85 ? 75 : 50,
      nextFollowUpDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0],
      notes: `Opportunité détectée : ${opp.title}. Note de cadrage à préparer.`,
      history: [
        {
          date: new Date().toISOString().split("T")[0],
          action: "Lead créé depuis la fiche d'opportunité",
          user: "Direction 242Agro",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setActiveTab("crm");
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre, émetteur, mots-clés..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Toutes les zones</option>
              <option value="Pointe-Noire">Pointe-Noire</option>
              <option value="République du Congo">République du Congo</option>
              <option value="Afrique centrale">Afrique centrale</option>
            </select>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none max-w-xs truncate"
            >
              <option value="all">Toutes les catégories</option>
              <option value="Sponsoring et financement RSE">Sponsoring & RSE</option>
              <option value="Appels à projets et financements">Appels à projets</option>
              <option value="Appels d'offres et marchés">Appels d'offres</option>
              <option value="Formations et prestations éducatives">Formations & Écoles</option>
              <option value="Demandes de prestations agricoles">Prestations agricoles</option>
            </select>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                onlyFavorites
                  ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                  : "border-slate-700 bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5 fill-current" />
              Favoris
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout : 2-Column Grid (Cards list + Full Detail Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column : Opportunities Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>{filteredOpportunities.length} opportunité(s) trouvée(s)</span>
            <span>Triée par score de pertinence</span>
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {filteredOpportunities.map((opp) => {
              const isSelected = selectedOpportunityId === opp.id;
              const isPriority = opp.matchScore >= 85;

              return (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOpportunityId(opp.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all relative ${
                    isSelected
                      ? "border-emerald-500 bg-slate-900 shadow-lg ring-1 ring-emerald-500/30"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        isPriority
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      Score {opp.matchScore}/100
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteOpportunity(opp.id);
                      }}
                      className={`p-1 text-slate-400 hover:text-amber-400 transition ${
                        opp.isFavorite ? "text-amber-400" : ""
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${opp.isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-white leading-snug">
                    {opp.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3 text-slate-500" />
                      {opp.issuer}
                    </span>
                    <span>&bull;</span>
                    <span className="text-emerald-400 font-semibold">{opp.budgetAmount}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Limite : {opp.deadline}
                    </span>
                    <span className="text-emerald-400 font-medium">{opp.zone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column : Comprehensive Opportunity Dossier Inspector (7 cols) */}
        <div className="lg:col-span-7">
          {activeDetailOpp ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl sticky top-24 space-y-5">
              {/* Header of Inspector */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                      Score de compatibilité : {activeDetailOpp.matchScore}/100
                    </span>
                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
                      {activeDetailOpp.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Fiabilité : {activeDetailOpp.reliability}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {activeDetailOpp.title}
                  </h2>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <span>Organisme : <strong>{activeDetailOpp.issuer}</strong></span>
                    <span>&bull;</span>
                    <span>Localisation : <strong>{activeDetailOpp.location}</strong></span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-start">
                  <button
                    onClick={() => toggleFavoriteOpportunity(activeDetailOpp.id)}
                    className="rounded-lg border border-slate-800 bg-slate-800/60 p-2 text-slate-400 hover:text-amber-400"
                    title="Mettre en favori"
                  >
                    <Bookmark
                      className={`h-4 w-4 ${activeDetailOpp.isFavorite ? "fill-amber-400 text-amber-400" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => deleteOpportunity(activeDetailOpp.id)}
                    className="rounded-lg border border-slate-800 bg-slate-800/60 p-2 text-slate-400 hover:text-rose-400"
                    title="Supprimer la fiche"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons Hub */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleAnalyze(activeDetailOpp)}
                  disabled={analyzingId === activeDetailOpp.id}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/50 transition"
                >
                  <BrainCircuit className="h-3.5 w-3.5" />
                  {analyzingId === activeDetailOpp.id ? "Analyse..." : "Analyser (100 pts)"}
                </button>

                <button
                  onClick={() => {
                    setSelectedOpportunityId(activeDetailOpp.id);
                    setActiveTab("documents");
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-teal-500 transition"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Générer dossier
                </button>

                <button
                  onClick={() => handleCreateCRMLead(activeDetailOpp)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
                >
                  <UserPlus className="h-3.5 w-3.5 text-blue-400" />
                  Suivre en CRM
                </button>

                <button
                  onClick={() => {
                    setSelectedOpportunityId(activeDetailOpp.id);
                    setActiveTab("strategies");
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
                >
                  <Target className="h-3.5 w-3.5 text-amber-400" />
                  Stratégie clé
                </button>
              </div>

              {/* Data Table Matrix */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Budget estimé</span>
                    <span className="font-bold text-emerald-400 text-sm">{activeDetailOpp.budgetAmount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Date limite</span>
                    <span className="font-semibold text-white">{activeDetailOpp.deadline}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Publié le</span>
                    <span className="text-slate-300">{activeDetailOpp.publishedDate}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-200 mb-1">Description détaillée du besoin</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeDetailOpp.description}</p>
                </div>

                {/* Conditions d'éligibilité */}
                <div>
                  <h4 className="text-xs font-bold text-slate-200 mb-1">Conditions de participation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{activeDetailOpp.conditions}</p>
                </div>

                {/* Required Skills & Documents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-300 mb-1.5">Compétences demandées :</h4>
                    <ul className="space-y-1">
                      {activeDetailOpp.requiredSkills.map((sk, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                          <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" />
                          <span>{sk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-slate-300 mb-1.5">Documents exigés :</h4>
                    <ul className="space-y-1">
                      {activeDetailOpp.documentsRequired.map((doc, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Source & Contacts */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>Contact : <strong>{activeDetailOpp.contactInfo}</strong></span>
                  </div>
                  <a
                    href={activeDetailOpp.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    Consulter la source officielle <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-xs text-slate-500">
              Sélectionnez une opportunité pour voir sa fiche détaillée.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
