import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { KeywordItem } from "../../types";
import {
  Hash,
  Search,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  Target,
  Share2,
  ExternalLink,
  Layers,
} from "lucide-react";

export const KeywordsView: React.FC = () => {
  const { keywords, addKeyword } = useApp();

  const [filterIntent, setFilterIntent] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const hashtagBanks = {
    facebook: [
      "#242Agro",
      "#AgricultureUrbaineCongo",
      "#PointeNoire",
      "#CongoBrazzaville",
      "#PotagerHorsSol",
      "#MangerSainCongo",
      "#JardinagePointeNoire",
      "#BioCongo",
      "#EconomieCirculaire",
      "#ConsommerLocalCongo",
    ],
    linkedin: [
      "#242Agro",
      "#RSECongo",
      "#AgricultureCirculaire",
      "#DéveloppementDurableAfrique",
      "#TotalEnergiesCongo",
      "#EniCongo",
      "#ContenuLocalCongo",
      "#ESGAfriqueCentrale",
      "#InnovationAgricole",
    ],
    instagram: [
      "#UrbanFarmingCongo",
      "#PotagerMaison",
      "#242Agro",
      "#PointeNoireCity",
      "#FreshGreensCongo",
      "#OrganicCongo",
      "#MicroFerme",
      "#ZeroWasteCongo",
      "#PlantsFruitiersCongo",
      "#HomeGrownVeggies",
    ],
  };

  const filteredKeywords = keywords.filter((kw) => {
    const matchIntent = filterIntent === "all" || kw.searchIntent.toLowerCase() === filterIntent.toLowerCase();
    const matchSearch =
      kw.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kw.targetAudience.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kw.suggestedAngle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchIntent && matchSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateKeywords = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/seo/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: "Pointe-Noire Agriculture Urbaine" }),
      });

      if (!res.ok) throw new Error("Erreur de génération SEO");

      const data = await res.json();
      if (data.keywords && Array.isArray(data.keywords)) {
        data.keywords.forEach((k: KeywordItem) => {
          addKeyword(k);
        });
      }
    } catch (e: any) {
      alert("Erreur : " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Hash className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Mots-clés commerciaux locaux, SEO & Banques de Hashtags
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Ciblage sémantique des requêtes des prospects à Pointe-Noire et au Congo pour maximiser les conversions.
            </p>
          </div>

          <button
            onClick={handleGenerateKeywords}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/60 transition"
          >
            <Sparkles className={`h-4 w-4 ${isGenerating ? "animate-spin text-emerald-300" : ""}`} />
            {isGenerating ? "Génération sémantique..." : "Générer de nouveaux mots-clés IA"}
          </button>
        </div>

        {/* Search & Intent filters */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrer par mot-clé, cible ou intention..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {["all", "Transactionnelle", "Commerciale", "Informationnelle"].map((intent) => (
              <button
                key={intent}
                onClick={() => setFilterIntent(intent)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  filterIntent === intent
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-700 bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                {intent === "all" ? "Toutes intentions" : intent}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ready-to-use Hashtag Sets Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Facebook Set */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="text-blue-400">📘</span> Pack Hashtags Facebook
            </span>
            <button
              onClick={() => handleCopy(hashtagBanks.facebook.join(" "), "fb")}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
            >
              {copiedKey === "fb" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedKey === "fb" ? "Copié !" : "Copier"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hashtagBanks.facebook.map((h, i) => (
              <span key={i} className="rounded bg-slate-950 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* LinkedIn Set */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="text-sky-400">💼</span> Pack Hashtags LinkedIn B2B
            </span>
            <button
              onClick={() => handleCopy(hashtagBanks.linkedin.join(" "), "li")}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
            >
              {copiedKey === "li" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedKey === "li" ? "Copié !" : "Copier"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hashtagBanks.linkedin.map((h, i) => (
              <span key={i} className="rounded bg-slate-950 px-2 py-0.5 text-[10px] text-sky-300 font-mono">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Instagram Set */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="text-pink-400">📸</span> Pack Hashtags Instagram
            </span>
            <button
              onClick={() => handleCopy(hashtagBanks.instagram.join(" "), "ig")}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
            >
              {copiedKey === "ig" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedKey === "ig" ? "Copié !" : "Copier"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hashtagBanks.instagram.map((h, i) => (
              <span key={i} className="rounded bg-slate-950 px-2 py-0.5 text-[10px] text-pink-300 font-mono">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Keywords Cards Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Mots-clés commerciaux analysés ({filteredKeywords.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredKeywords.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4.5 space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-emerald-300">{item.keyword}</h4>
                  <span className="text-[11px] text-slate-400">
                    Cible : <strong>{item.targetAudience}</strong>
                  </span>
                </div>

                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    item.searchIntent === "Transactionnelle"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : item.searchIntent === "Commerciale"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {item.searchIntent}
                </span>
              </div>

              {/* Angle de contenu suggéré */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-xs text-slate-300">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block mb-1">
                  Angle éditorial recommandé :
                </span>
                <p className="italic">« {item.suggestedAngle} »</p>
              </div>

              {/* Meta row : Competition, Channel, Copy button */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2.5 text-[11px]">
                <div className="flex items-center gap-3 text-slate-400">
                  <span>Concurrence : <strong className="text-white">{item.competitionLevel}</strong></span>
                  <span>Canal : <strong className="text-emerald-400">{item.recommendedChannel}</strong></span>
                </div>

                <button
                  onClick={() => handleCopy(item.keyword, `kw-${idx}`)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
                >
                  {copiedKey === `kw-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === `kw-${idx}` ? "Copié" : "Copier"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
