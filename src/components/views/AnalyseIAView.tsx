import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Opportunity } from "../../types";
import {
  BrainCircuit,
  Award,
  CheckCircle2,
  AlertTriangle,
  Users,
  Coins,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileCheck,
  RefreshCw,
  Sparkles,
  Building,
} from "lucide-react";

export const AnalyseIAView: React.FC = () => {
  const {
    opportunities,
    selectedOpportunityId,
    setSelectedOpportunityId,
    analyzeOpportunityAction,
    setActiveTab,
  } = useApp();

  const [loading, setLoading] = useState(false);

  const selectedOpp =
    opportunities.find((o) => o.id === selectedOpportunityId) || opportunities[0];

  const analysis = selectedOpp?.analysis;

  const handleRunAnalysis = async () => {
    if (!selectedOpp) return;
    setLoading(true);
    await analyzeOpportunityAction(selectedOpp);
    setLoading(false);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) {
      return {
        label: "Opportunité Prioritaire (85-100)",
        bg: "bg-emerald-500/20",
        border: "border-emerald-500/40",
        text: "text-emerald-300",
      };
    }
    if (score >= 70) {
      return {
        label: "Opportunité Intéressante (70-84)",
        bg: "bg-teal-500/20",
        border: "border-teal-500/40",
        text: "text-teal-300",
      };
    }
    if (score >= 50) {
      return {
        label: "Opportunité à Étudier (50-69)",
        bg: "bg-amber-500/20",
        border: "border-amber-500/40",
        text: "text-amber-300",
      };
    }
    return {
      label: "Faible Pertinence (< 50)",
      bg: "bg-slate-800",
      border: "border-slate-700",
      text: "text-slate-400",
    };
  };

  return (
    <div className="space-y-6">
      {/* Target Opportunity Selector Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4" />
              Système de notation officiel sur 100 points
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedOpp?.id || ""}
                onChange={(e) => setSelectedOpportunityId(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none max-w-md truncate"
              >
                {opportunities.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.issuer} — {o.title}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-400">
                Budget : <strong className="text-emerald-400">{selectedOpp?.budgetAmount}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all ${
                loading
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/60 ring-1 ring-emerald-400/30"
              }`}
            >
              <Sparkles className={`h-4 w-4 ${loading ? "animate-spin text-emerald-300" : ""}`} />
              {loading ? "Analyse en cours..." : "ANALYSER CETTE OPPORTUNITÉ"}
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
            >
              Générer le dossier &rarr;
            </button>
          </div>
        </div>
      </div>

      {analysis ? (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Big Score Box */}
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 p-5 flex flex-col justify-center items-center text-center shadow-lg">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Note Globale IA
              </span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-5xl font-black text-emerald-400">
                  {analysis.totalScore}
                </span>
                <span className="text-xl font-bold text-slate-500">/100</span>
              </div>
              {(() => {
                const b = getScoreBadge(analysis.totalScore);
                return (
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold border ${b.bg} ${b.border} ${b.text}`}
                  >
                    {b.label}
                  </span>
                );
              })()}
            </div>

            {/* Executive Summary */}
            <div className="md:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-emerald-400" />
                  Résumé exécutif de l'analyse stratégique
                </h3>
                <span className="text-[10px] text-slate-500">242Agro Pointe-Noire</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.executiveSummary}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-4 text-[11px] text-slate-400">
                <span>
                  Besoin client : <strong className="text-slate-200">{analysis.clientNeedAnalysis}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 8 Criteria Detailed Grid */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Décomposition des 8 critères d'évaluation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {analysis.criteriaBreakdown?.map((crit, idx) => {
                const percentage = Math.round((crit.score / crit.max) * 100);
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{crit.criterion}</span>
                      <span className="font-bold text-emerald-400">
                        {crit.score} / {crit.max} pts
                      </span>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug">
                      {crit.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational Strengths & Partner Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mobilized Skills & Deliverables */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Compétences 242Agro mobilisées & Prestations
              </h3>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Savoir-faire 242Agro :</span>
                  <ul className="mt-1 space-y-1">
                    {analysis.agroSkillsToMobilize?.map((skill, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Livrables concrets proposés :</span>
                  <ul className="mt-1 space-y-1">
                    {analysis.deliverablesOffered?.map((deliv, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                        {deliv}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Missing Skills & Partner Recommendations */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                Compétences manquantes & Partenaires recommandés
              </h3>

              <div className="space-y-3">
                {analysis.missingSkillsOrWeaknesses?.length > 0 && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 text-xs text-amber-200">
                    <span className="font-semibold block mb-1">Points de vigilance identifiés :</span>
                    <ul className="space-y-1 text-[11px]">
                      {analysis.missingSkillsOrWeaknesses.map((w, i) => (
                        <li key={i}>&bull; {w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    Partenariats stratégiques à nouer :
                  </span>
                  <div className="mt-2 space-y-2">
                    {analysis.recommendedPartners?.map((p, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 flex items-start justify-between gap-2"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-white">{p.name}</h4>
                          <p className="text-[11px] text-slate-400">{p.role}</p>
                        </div>
                        <span className="rounded bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 font-medium">
                          Synergie
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Estimation & Risks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estimated Budget */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Coins className="h-4 w-4 text-emerald-400" />
                  Budget estimatif & Hypothèses explicites
                </h3>
                <span className="text-xs font-bold text-emerald-400">
                  {analysis.estimatedBudget?.totalEstimated}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                {analysis.estimatedBudget?.assumptions}
              </p>
            </div>

            {/* Risk & Mitigation Matrix */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                Matrice des risques & Mesures d'atténuation
              </h3>
              <div className="space-y-2">
                {analysis.risksAndMitigations?.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-2.5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{r.risk}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          r.severity === "Élevé"
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {r.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400">
                      Solution : {r.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Plan Timeline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Plan d'action chronologique recommandé
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {analysis.actionPlan?.map((ap, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-emerald-500/20 bg-slate-950/60 p-3.5 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">Étape {ap.step}</span>
                    <span className="text-[10px] text-slate-500">{ap.deadline}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">{ap.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-3">
          <BrainCircuit className="h-10 w-10 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Cette opportunité n'a pas encore été analysée</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Cliquez sur « ANALYSER CETTE OPPORTUNITÉ » pour calculer la note sur 100 points, le profil d'éligibilité et le budget estimatif.
          </p>
          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/60 transition"
          >
            {loading ? "Analyse en cours..." : "Lancer l'analyse complète maintenant"}
          </button>
        </div>
      )}
    </div>
  );
};
