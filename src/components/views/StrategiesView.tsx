import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StrategyResponse } from "../../types";
import { exportToWord, exportToPDF } from "../../utils/exportUtils";
import {
  Target,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Building,
  Sprout,
  Wrench,
  BookOpen,
  DollarSign,
  Send,
} from "lucide-react";

export const StrategiesView: React.FC = () => {
  const { opportunities, selectedOpportunityId, setSelectedOpportunityId, setActiveTab } =
    useApp();

  const selectedOpp =
    opportunities.find((o) => o.id === selectedOpportunityId) || opportunities[0];

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Pre-loaded strategy for the default opportunity
  const [strategy, setStrategy] = useState<StrategyResponse | null>({
    clientNeedDeepAnalysis:
      "L'établissement a besoin d'une solution éco-responsable visible pour répondre aux exigences RSE et valoriser ses déchets de cantine sans générer de nuisances olfactives ni mobiliser trop de temps de ses salariés.",
    technicalOffer:
      "Déploiement d'une microferme circulaire pilote 242Agro : 12 bacs hors-sol en bois local étanches + station de compostage 3 bacs aérée anti-rongeurs + réseau d'irrigation goutte-à-goutte autonome.",
    recommendedGardenModel:
      "Bacs surélevés 242Agro modèle 'Littoral 80cm' en bois dur teck traité à l'huile végétale naturelle avec substrat bio enrichi (40% compost, 40% terre franche, 20% sciure/sable fluvial lavé).",
    equipmentList: [
      "12 bacs potagers surélevés (2m x 1m x 0.8m)",
      "Composteur thermique aéré 3 compartiments",
      "Kit goutte-à-goutte basse pression avec programmateur autonome",
      "Kit outillage ergonomique junior/adulte (griffes, transplantoirs, arrosoirs)",
      "Sachets de semences reproductibles certifiées bio",
    ],
    plantAndLivestockList: [
      "Légumes feuilles : Oseille de Guinée (Bissap), Amarante (Ndole), Épinard tropical",
      "Aromatiques & Médicinales : Basilic grand vert, Menthe marocaine, Citronnelle, Thym",
      "Arbres en conteneurs : Avocatiers greffés, Citronniers 4 saisons, Corossoliers nains",
    ],
    trainingCurriculum:
      "Cycle de 4 ateliers thématiques de 2 heures : 1. Semis et repiquage - 2. Gestion de l'eau et paillage - 3. Secrets du compostage sans odeur - 4. Récolte et dégustation culinaire saine.",
    executionTimeline:
      "Semaine 1 : Validation de l'implantation & fabrication en atelier. Semaine 2 : Livraison et assemblage sur site. Semaine 3 : Remplissage substrat et mise en eau. Semaine 4 : Repiquage et inauguration officielle.",
    provisionalBudget: "15 099 000 FCFA clés en main (matériel, installation, 6 mois de suivi agronomique inclus).",
    commercialPitch:
      "En choisissant 242Agro, vous ne commandez pas simplement des bacs potagers : vous dotez votre organisation d'une vitrine écologique vivante, 100% ponténégrine, qui transforme vos biodéchets en légumes frais et fédère vos équipes autour de la fierté locale.",
    prospectingEmailDraft: `Madame, Monsieur,\n\nFace aux enjeux actuels de développement durable à Pointe-Noire, 242Agro vous propose de transformer vos espaces extérieurs en îlots nourriciers et circulaires clés en main.\n\nNos solutions de potagers surélevés hors-sol et de compostage inodore s'adaptent parfaitement à vos installations.\n\nSeriez-vous ouvert à une courte rencontre sur site la semaine prochaine pour une étude de faisabilité gratuite ?\n\nBien cordialement,\nLa Direction 242Agro`,
    postInstallationCarePlan:
      "Visite bimensuelle d'un technicien agronomique 242Agro pendant 6 mois : contrôle sanitaire des plantes, apport de compost mûr, rotation des cultures et réapprovisionnement gratuit en cas de perte.",
  });

  const handleGenerateStrategy = async () => {
    if (!selectedOpp) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/strategy/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityTitle: selectedOpp.title,
          opportunityIssuer: selectedOpp.issuer,
          contextDetails: selectedOpp.description,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la génération de la stratégie");

      const data = await res.json();
      if (data.strategy) {
        setStrategy(data.strategy);
      }
    } catch (e: any) {
      alert("Erreur : " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Target className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Générateur de stratégie de réponse commerciale
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Plan d'action complet et livrables techniques adaptés au contexte de chaque opportunité.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedOpp?.id || ""}
              onChange={(e) => setSelectedOpportunityId(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none max-w-xs truncate"
            >
              {opportunities.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.issuer} — {o.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateStrategy}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/60 transition"
            >
              <Sparkles className={`h-4 w-4 ${isGenerating ? "animate-spin text-emerald-300" : ""}`} />
              {isGenerating ? "Élaboration du plan..." : "GÉNÉRER LE PLAN D'ACTION"}
            </button>
          </div>
        </div>
      </div>

      {strategy && (
        <div className="space-y-6">
          {/* 3 Pillars Quick Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1 : Technical Offer */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sprout className="h-4 w-4" />
                Offre technique 242Agro
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {strategy.technicalOffer}
              </p>
            </div>

            {/* Pillar 2 : Recommended Model */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                <Layers className="h-4 w-4" />
                Modèle de potager adapté
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {strategy.recommendedGardenModel}
              </p>
            </div>

            {/* Pillar 3 : Budget & Timeline */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <DollarSign className="h-4 w-4" />
                Budget & Calendrier
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>
                  Budget estimé : <strong className="text-emerald-400">{strategy.provisionalBudget}</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  Délais : {strategy.executionTimeline}
                </div>
              </div>
            </div>
          </div>

          {/* Equipment & Plants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment list */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="h-4 w-4 text-emerald-400" />
                Liste des équipements & fournitures
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {strategy.equipmentList?.map((eq, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Plants list */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sprout className="h-4 w-4 text-emerald-400" />
                Végétaux & Semences adaptés au littoral
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {strategy.plantAndLivestockList?.map((pl, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{pl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Commercial Pitch & Prospecting Draft */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Argumentaire commercial & Email d'introduction
              </h3>
              <button
                onClick={() => handleCopy(strategy.commercialPitch, "pitch")}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
              >
                {copiedKey === "pitch" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedKey === "pitch" ? "Copié !" : "Copier le pitch"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-200 leading-relaxed">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-2">
                  Argumentaire oral percutant :
                </span>
                <p className="italic">« {strategy.commercialPitch} »</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-line">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    Modèle de courriel de prise de contact :
                  </span>
                  <button
                    onClick={() => handleCopy(strategy.prospectingEmailDraft, "email")}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === "email" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    Copier
                  </button>
                </div>
                {strategy.prospectingEmailDraft}
              </div>
            </div>

            {/* Post installation care */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-xs text-emerald-200">
              <span className="font-bold block mb-1">Plan de maintenance et suivi agronomique :</span>
              <p className="text-slate-300">{strategy.postInstallationCarePlan}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
