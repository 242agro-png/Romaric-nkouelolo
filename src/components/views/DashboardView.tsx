import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Compass,
  TrendingUp,
  FileText,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Building,
  Target,
  Clock,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const {
    opportunities,
    documents,
    marketNeeds,
    leads,
    campaigns,
    setActiveTab,
    setSelectedOpportunityId,
    runScheduledScan,
    isScanning,
  } = useApp();

  const priorityOpportunities = opportunities.filter((o) => o.matchScore >= 85);
  const totalFinancialValue = opportunities.reduce((acc, curr) => {
    const match = curr.budgetAmount.match(/([0-9\s]+)\s*FCFA/i);
    if (match) {
      const val = parseInt(match[1].replace(/\s/g, ""), 10);
      return isNaN(val) ? acc : acc + val;
    }
    return acc;
  }, 0);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " FCFA";
  };

  const activeLeads = leads.filter((l) => l.stage !== "won" && l.stage !== "lost");
  const urgentOpportunities = opportunities
    .filter((o) => {
      const daysLeft = Math.ceil(
        (new Date(o.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
      );
      return daysLeft > 0 && daysLeft <= 30;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <div className="space-y-6">
      {/* Top Banner : Mission 242Agro & Human Validation Shield */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 p-5 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Centre de commandement stratégique
              </span>
              <span className="text-xs text-slate-400">Pointe-Noire, Congo</span>
            </div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              242Agro Intelligence : Détecter, Analyser & Remporter
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-300">
              Surveillance continue des appels d'offres (TotalEnergies, Eni, PNUD, FAO, Écoles), détection des besoins en agriculture urbaine hors-sol et génération assistée de vos dossiers officiels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:self-end">
            <button
              onClick={() => runScheduledScan()}
              disabled={isScanning}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 transition"
            >
              <Sparkles className="h-4 w-4" />
              {isScanning ? "Veille en cours..." : "Scanner le marché"}
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
            >
              <FileText className="h-4 w-4 text-emerald-400" />
              Nouveau dossier
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 : Opportunités */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Opportunités actives</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{opportunities.length}</span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              +{priorityOpportunities.length} prioritaires
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Pointe-Noire & Congo</p>
        </div>

        {/* KPI 2 : Financements identifiés */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Potentiel financier</span>
            <div className="rounded-lg bg-teal-500/10 p-2 text-teal-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-teal-300">
              {formatFCFA(totalFinancialValue)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Subventions & contrats B2B</p>
        </div>

        {/* KPI 3 : Pipeline CRM */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Prospects en cours (CRM)</span>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeLeads.length}</span>
            <span className="text-[11px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
              {leads.filter((l) => l.stage === "won").length} gagnés
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">TotalEnergies, Écoles, Hôtels</p>
        </div>

        {/* KPI 4 : Documents générés */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Dossiers rédigés</span>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{documents.length}</span>
            <span className="text-[11px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
              {documents.filter((d) => d.isHumanValidated).length} validés
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Notes tech, Budgets & TDRs</p>
        </div>
      </div>

      {/* Main split row : Priority Opportunities + Urgent Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Opportunities List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Opportunités prioritaires (Score ≥ 85)
              </h3>
            </div>
            <button
              onClick={() => setActiveTab("opportunites")}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
            >
              Voir tout ({opportunities.length}) <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {priorityOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="group rounded-xl border border-slate-800 bg-slate-900/80 p-4.5 hover:border-emerald-500/40 hover:bg-slate-900 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                        Score {opp.matchScore}/100
                      </span>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                        {opp.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Building className="h-3 w-3 text-slate-500" />
                        {opp.issuer}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {opp.title}
                    </h4>
                  </div>

                  <div className="text-right sm:self-center">
                    <span className="text-xs font-bold text-emerald-400 block">
                      {opp.budgetAmount}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 sm:justify-end">
                      <Clock className="h-3 w-3" />
                      Limite : {opp.deadline}
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>

                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
                  <span className="text-[11px] text-emerald-400/90 font-medium">
                    💡 {opp.matchReason}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOpportunityId(opp.id);
                        setActiveTab("analyse");
                      }}
                      className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition"
                    >
                      Voir analyse IA
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOpportunityId(opp.id);
                        setActiveTab("documents");
                      }}
                      className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500 transition"
                    >
                      Générer dossier &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar inside Dashboard : Approaching Deadlines & Market Signals */}
        <div className="space-y-6">
          {/* Urgent Deadlines */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Échéances proches (≤ 30j)
                </h3>
              </div>
              <span className="rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold px-1.5 py-0.5">
                {urgentOpportunities.length} à traiter
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {urgentOpportunities.slice(0, 3).map((opp) => {
                const days = Math.ceil(
                  (new Date(opp.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                );
                return (
                  <div
                    key={opp.id}
                    onClick={() => {
                      setSelectedOpportunityId(opp.id);
                      setActiveTab("opportunites");
                    }}
                    className="cursor-pointer rounded-lg border border-slate-800/80 bg-slate-950/40 p-2.5 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-200 line-clamp-1">{opp.issuer}</span>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          days <= 10
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        J-{days}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-300 line-clamp-1">
                      {opp.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Market Signal Pulse */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Besoins observés à Pointe-Noire
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("besoins")}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                Explorer
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {marketNeeds.slice(0, 3).map((need) => (
                <div key={need.id} className="rounded-lg bg-slate-950/40 p-2.5 border border-slate-800/60">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-emerald-400">{need.targetSegment}</span>
                    <span className="text-[10px] text-slate-500">{need.signalFrequency}</span>
                  </div>
                  <h5 className="mt-1 text-xs font-semibold text-slate-200">
                    {need.needTitle}
                  </h5>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                    {need.pitchProposal}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Human Control Security reminder */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-emerald-300 mb-1">
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
              Charte de contrôle humain
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              L'application est un assistant professionnel : aucune candidature ou offre commerciale n'est transmise à l'extérieur sans votre relecture et validation finale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
