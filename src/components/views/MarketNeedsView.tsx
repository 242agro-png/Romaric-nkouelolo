import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { MarketNeed } from "../../types";
import {
  TrendingUp,
  Search,
  Sparkles,
  ArrowRight,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  PlusCircle,
} from "lucide-react";

export const MarketNeedsView: React.FC = () => {
  const { marketNeeds, addMarketNeed, createOpportunityFromNeed } = useApp();

  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const segments = [
    "Particuliers",
    "Écoles",
    "Restaurants & Hôtels",
    "Entreprises & Industries",
    "ONG & Bailleurs",
    "Collectivités",
  ];

  const filteredNeeds = marketNeeds.filter(
    (n) => selectedSegment === "all" || n.targetSegment.toLowerCase().includes(selectedSegment.toLowerCase())
  );

  const handleScanNewNeeds = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/market/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector: selectedSegment,
          location: "Pointe-Noire",
        }),
      });

      if (!res.ok) throw new Error("Échec de détection des besoins");

      const data = await res.json();
      if (data.needs && Array.isArray(data.needs)) {
        data.needs.forEach((item: any) => {
          const newNeed: MarketNeed = {
            id: `need-ai-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            needTitle: item.needTitle,
            targetSegment: item.targetSegment || "Particuliers",
            location: item.location || "Pointe-Noire",
            observedSignals: item.observedSignals || "",
            signalFrequency: item.signalFrequency || "Fréquente",
            marketInterestLevel: item.marketInterestLevel || "Élevé",
            solutionBy242Agro: item.solutionBy242Agro || "",
            commercialPotential: item.commercialPotential || "Élevé",
            pitchProposal: item.pitchProposal || "",
          };
          addMarketNeed(newNeed);
        });
      }
    } catch (e: any) {
      alert("Erreur : " + e.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopyPitch = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Filter Control */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Ce que le marché recherche à Pointe-Noire & au Congo
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Détection des besoins réels, signaux faibles et opportunités commerciales non exploitées en agriculture urbaine.
            </p>
          </div>

          <button
            onClick={handleScanNewNeeds}
            disabled={isScanning}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/60 transition"
          >
            <Sparkles className={`h-4 w-4 ${isScanning ? "animate-spin text-emerald-300" : ""}`} />
            {isScanning ? "Analyse des signaux..." : "Détecter de nouveaux besoins"}
          </button>
        </div>

        {/* Segment Filter pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Filtrer par segment :</span>
          <button
            onClick={() => setSelectedSegment("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
              selectedSegment === "all"
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-slate-700 bg-slate-950 text-slate-300 hover:text-white"
            }`}
          >
            Tous les segments ({marketNeeds.length})
          </button>
          {segments.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSegment(s)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                selectedSegment === s
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-slate-700 bg-slate-950 text-slate-300 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Market Needs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNeeds.map((need) => (
          <div
            key={need.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4 hover:border-emerald-500/30 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Badges & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  {need.targetSegment}
                </span>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    {need.location}
                  </span>
                  <span className="rounded bg-slate-800 text-slate-300 px-1.5 py-0.5 text-[10px] font-medium">
                    {need.signalFrequency}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-white leading-snug">
                {need.needTitle}
              </h3>

              {/* Observed Signals */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Signaux de terrain observés :
                </span>
                <p className="leading-relaxed">{need.observedSignals}</p>
              </div>

              {/* Solution by 242Agro */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-xs space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Solution 242Agro recommandée :
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {need.solutionBy242Agro}
                </p>
              </div>

              {/* Ready Pitch Message */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    Message d'accroche commerciale prêt à l'emploi :
                  </span>
                  <button
                    onClick={() => handleCopyPitch(need.pitchProposal, need.id)}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px]"
                  >
                    {copiedId === need.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copiedId === need.id ? "Copié !" : "Copier"}
                  </button>
                </div>
                <p className="text-emerald-200/90 italic font-mono text-[11px] leading-relaxed">
                  "{need.pitchProposal}"
                </p>
              </div>
            </div>

            {/* Bottom Actions : Transform to Opportunity */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400">
                Potentiel commercial : {need.commercialPotential}
              </span>

              <button
                onClick={() => createOpportunityFromNeed(need)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-950/50"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Transformer en Opportunité
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
