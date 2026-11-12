import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { MarketingCampaign, PosterConcept } from "../../types";
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  Download,
  Smartphone,
  Layout,
  Maximize2,
  ShieldCheck,
  Send,
  Leaf,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Palette,
  Image as ImageIcon,
} from "lucide-react";

export const StudioView: React.FC = () => {
  const { campaigns, addCampaign, approveCampaign, opportunities, selectedOpportunityId } =
    useApp();

  const [activeChannelTab, setActiveChannelTab] = useState<
    "poster" | "facebook" | "linkedin" | "whatsapp" | "email" | "pitch"
  >("poster");

  const [selectedFormat, setSelectedFormat] = useState<"square" | "portrait" | "story" | "a4">(
    "square"
  );
  const [topicInput, setTopicInput] = useState(
    "Installation de potagers urbains hors-sol et microfermes circulaires à Pointe-Noire"
  );
  const [targetAudienceInput, setTargetAudienceInput] = useState(
    "Particuliers avec cours pavées, écoles privées, restaurants et comités RSE"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || "camp-01"
  );

  const activeCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  // Poster customization state
  const [customHeadline, setCustomHeadline] = useState(
    activeCampaign?.posterConcept?.headline || "PROTÉGEZ LA SANTÉ DE VOTRE FAMILLE : VOS LÉGUMES 100% BIO CHEZ VOUS"
  );
  const [customSubheadline, setCustomSubheadline] = useState(
    activeCampaign?.posterConcept?.subheadline ||
      "Zéro pesticide, zéro chimie : cultivez vos légumes frais sur votre balcon, véranda ou cour à Pointe-Noire !"
  );
  const [customColor, setCustomColor] = useState(
    activeCampaign?.posterConcept?.accentColor || "#059669"
  );

  // Sync poster inputs when switching campaigns
  const handleSelectCampaign = (id: string) => {
    setSelectedCampaignId(id);
    const camp = campaigns.find((c) => c.id === id);
    if (camp?.posterConcept) {
      setCustomHeadline(camp.posterConcept.headline);
      setCustomSubheadline(camp.posterConcept.subheadline);
      if (camp.posterConcept.accentColor) {
        setCustomColor(camp.posterConcept.accentColor);
      }
    }
  };

  const handleGenerateCampaign = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/marketing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicInput,
          targetAudience: targetAudienceInput,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la génération marketing");
      }

      const data = await res.json();
      if (data.marketing) {
        const m = data.marketing;
        const newCamp: MarketingCampaign = {
          id: `camp-${Date.now()}`,
          campaignName: m.campaignName || "Nouvelle Campagne 242Agro",
          coreMessage: m.coreMessage || "",
          linkedinPost: m.linkedinPost || "",
          facebookPost: m.facebookPost || "",
          whatsappMessage: m.whatsappMessage || "",
          prospectingEmail: m.prospectingEmail || { subject: "", body: "" },
          salesPitch: m.salesPitch || "",
          posterConcept: m.posterConcept || {
            headline: "VOTRE POTAGER BIO EN PLEIN CŒUR DE POINTE-NOIRE",
            subheadline: "Des légumes sains et des herbes fraîches chez vous",
            bulletPoints: ["Installation en 48h", "100% sans chimie", "Suivi agronomique"],
            callToAction: "WhatsApp direct : +242 06 874 22 77 — Roc Nkouelolo",
            visualDescription: "Bacs en bois nobles sur véranda",
            accentColor: "#059669",
            suggestedFormat: "Carré 1080x1080",
          },
          createdAt: new Date().toISOString(),
          isApproved: false,
        };

        addCampaign(newCamp);
        setSelectedCampaignId(newCamp.id);
        setCustomHeadline(newCamp.posterConcept.headline);
        setCustomSubheadline(newCamp.posterConcept.subheadline);
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

  const getFormatDimensionsClass = () => {
    switch (selectedFormat) {
      case "square":
        return "aspect-square max-w-[420px]";
      case "portrait":
        return "aspect-[4/5] max-w-[390px]";
      case "story":
        return "aspect-[9/16] max-w-[340px]";
      case "a4":
        return "aspect-[1/1.414] max-w-[380px]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Generator Control Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Studio de communication & Création graphique
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Génération automatique de campagnes multicanales (Facebook, LinkedIn, WhatsApp) et conception d'affiches professionnelles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateCampaign}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/60 transition"
            >
              <Sparkles className={`h-4 w-4 ${isGenerating ? "animate-spin text-emerald-300" : ""}`} />
              {isGenerating ? "Création en cours..." : "GÉNÉRER LA STRATÉGIE MARKETING"}
            </button>
          </div>
        </div>

        {/* Inputs for prompt customization & Campaign Selector */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400">Campagne active :</span>
              <select
                value={selectedCampaignId}
                onChange={(e) => handleSelectCampaign(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none max-w-md truncate"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.campaignName}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-slate-400">
              {campaigns.length} campagne{campaigns.length > 1 ? "s" : ""} disponible{campaigns.length > 1 ? "s" : ""}
            </div>
          </div>

          {/* Quick presets buttons */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">
              Thèmes rapides prêts à l'emploi (1 clic) :
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setTopicInput("Sensibilisation santé : Danger des pesticides chimiques du marché vs potager bio à la maison (balcon, véranda, cour pavée)");
                  setTargetAudienceInput("Mères et pères de famille soucieux de la santé des enfants à Pointe-Noire (Mpita, Tié-Tié, Lumumba)");
                }}
                className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-900/40 transition"
              >
                🥬 Santé & Danger Pesticides (Balcons/Cours)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTopicInput("Potagers pédagogiques, compostage et petits élevages intégrés pour écoles et églises");
                  setTargetAudienceInput("Directeurs d'écoles privées, congrégations religieuses et comités paroissiaux de Pointe-Noire");
                }}
                className="rounded-lg border border-teal-500/30 bg-teal-950/30 px-2.5 py-1 text-[11px] font-medium text-teal-300 hover:bg-teal-900/40 transition"
              >
                🏫 Écoles & Églises (Microfermes pédagogiques)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTopicInput("Approvisionnement direct en herbes aromatiques et légumes feuilles ultra-frais sans coupure");
                  setTargetAudienceInput("Chefs cuisiniers, gérants de restaurants et hôtels à Pointe-Noire et littoral");
                }}
                className="rounded-lg border border-blue-500/30 bg-blue-950/30 px-2.5 py-1 text-[11px] font-medium text-blue-300 hover:bg-blue-900/40 transition"
              >
                🍽️ Restaurants & Hôtels (Circuit court)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTopicInput("Partenariat RSE : Création d'espaces verts nourriciers et valorisation circulaire des biodéchets de cantine");
                  setTargetAudienceInput("Directions RSE de TotalEnergies, Eni, banques et entreprises industrielles");
                }}
                className="rounded-lg border border-purple-500/30 bg-purple-950/30 px-2.5 py-1 text-[11px] font-medium text-purple-300 hover:bg-purple-900/40 transition"
              >
                🏢 TotalEnergies / RSE (Potager & Compost)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Thème de l'offre ou service promu :
              </label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Cible prioritaire à Pointe-Noire :
              </label>
              <input
                type="text"
                value={targetAudienceInput}
                onChange={(e) => setTargetAudienceInput(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Channels Tabs */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-1">
        {[
          { id: "poster", label: "Affiche Graphique IA", icon: Layout },
          { id: "facebook", label: "Publication Facebook", icon: Share2 },
          { id: "linkedin", label: "Publication LinkedIn B2B", icon: Share2 },
          { id: "whatsapp", label: "WhatsApp Business", icon: Smartphone },
          { id: "email", label: "Email de Prospection", icon: Mail },
          { id: "pitch", label: "Pitch Oral (60 sec)", icon: Phone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeChannelTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveChannelTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Area */}
      {activeChannelTab === "poster" ? (
        /* Poster Graphic Designer View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Formatting (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="h-4 w-4 text-emerald-400" />
                Format & Personnalisation de l'affiche
              </h3>

              {/* Format Selectors */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Format de diffusion :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "square", name: "Carré 1080×1080", desc: "Facebook & Instagram" },
                    { id: "portrait", name: "Portrait 1080×1350", desc: "LinkedIn & Feed" },
                    { id: "story", name: "Story 1080×1920", desc: "WhatsApp & Reels" },
                    { id: "a4", name: "A4 Impression", desc: "Flyers & Affiches" },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setSelectedFormat(fmt.id as any)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition ${
                        selectedFormat === fmt.id
                          ? "border-emerald-500 bg-emerald-950/30 text-white ring-1 ring-emerald-500/30"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <span className="font-bold block text-slate-200">{fmt.name}</span>
                      <span className="text-[10px] text-slate-500">{fmt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Headline */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Accroche principale (Titre fort) :
                </label>
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Editable Subheadline */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Bénéfice client :
                </label>
                <textarea
                  value={customSubheadline}
                  onChange={(e) => setCustomSubheadline(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Accent Color picker */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Couleur d'accentuation naturelle :
                </label>
                <div className="flex items-center gap-2">
                  {["#059669", "#0d9488", "#16a34a", "#65a30d", "#0284c7"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCustomColor(c)}
                      className={`h-7 w-7 rounded-full border-2 transition ${
                        customColor === c ? "border-white scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Human validation toggle */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Validation humaine :</span>
                {activeCampaign?.isApproved ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                    <ShieldCheck className="h-4 w-4" /> Validé pour diffusion
                  </span>
                ) : (
                  <button
                    onClick={() => approveCampaign(activeCampaign?.id)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
                  >
                    Valider le visuel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Visual Poster Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
            {/* The Live Rendered Poster */}
            <div
              className={`w-full rounded-2xl overflow-hidden shadow-2xl relative flex flex-col justify-between p-6 sm:p-8 text-white transition-all duration-300 ${getFormatDimensionsClass()}`}
              style={{
                background: `linear-gradient(145deg, #022c22 0%, #064e3b 50%, #0f172a 100%)`,
                boxShadow: `0 25px 50px -12px ${customColor}33`,
              }}
            >
              {/* Natural subtle background overlay circles */}
              <div
                className="absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl opacity-30"
                style={{ backgroundColor: customColor }}
              />
              <div
                className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: "#10b981" }}
              />

              {/* Top Header of Poster : Brand */}
              <div className="relative z-10 flex items-center justify-between border-b border-emerald-400/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Leaf className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div>
                    <span className="font-extrabold text-base tracking-wide text-white block">
                      242AGRO
                    </span>
                    <span className="text-[10px] text-emerald-200 tracking-wider uppercase font-semibold">
                      Agriculture Urbaine Circulaire &middot; Pointe-Noire
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                  100% Bio & Local
                </span>
              </div>

              {/* Center Content of Poster */}
              <div className="relative z-10 my-auto py-6 space-y-4">
                <span className="inline-block rounded-md bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-emerald-300 uppercase tracking-widest border border-white/10">
                  Solution Clés en Main
                </span>

                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight uppercase tracking-tight drop-shadow-md">
                  {customHeadline}
                </h1>

                <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-sm">
                  {customSubheadline}
                </p>

                {/* Key Benefits Bullets */}
                <div className="space-y-1.5 pt-2">
                  {(activeCampaign?.posterConcept?.bulletPoints || [
                    "Installation en 48h sur mesure",
                    "Zéro produit chimique & terreau fertile",
                    "Suivi agronomique garanti à domicile",
                  ]).map((bp, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black">
                        ✓
                      </span>
                      <span>{bp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Call to Action and Contact */}
              <div className="relative z-10 rounded-xl bg-black/50 backdrop-blur-md p-3.5 border border-white/15 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                      Roc Nkouelolo &middot; WhatsApp direct :
                    </span>
                    <span className="text-[10px] text-emerald-200">
                      242Agro &mdash; Cultivons aujourd'hui, nourrissons demain.
                    </span>
                  </div>
                  <span className="font-bold text-emerald-300 text-xs sm:text-sm whitespace-nowrap">
                    +242 06 874 22 77
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-300 border-t border-white/10 pt-1.5">
                  <span>Pointe-Noire & Littoral</span>
                  <span>https://242agropn.netlify.app/</span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-500 text-center">
              Affiche prête pour publication sur WhatsApp Status, Instagram, Facebook ou impression papier.
            </p>
          </div>
        </div>
      ) : (
        /* Textual Copywriting Channels View */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                  {activeCampaign?.campaignName}
                </span>
                {activeCampaign?.isApproved && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                    <ShieldCheck className="h-3 w-3" /> Validé
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white capitalize mt-1">
                Contenu optimisé : {activeChannelTab}
              </h3>
              <p className="text-xs text-slate-400">
                Storytelling humain orienté bénéfices santé et valorisation des espaces (balcons, vérandas, cours).
              </p>
            </div>

            <button
              onClick={() => {
                const textToCopy =
                  activeChannelTab === "facebook"
                    ? activeCampaign?.facebookPost
                    : activeChannelTab === "linkedin"
                    ? activeCampaign?.linkedinPost
                    : activeChannelTab === "whatsapp"
                    ? activeCampaign?.whatsappMessage
                    : activeChannelTab === "email"
                    ? `Objet: ${activeCampaign?.prospectingEmail?.subject}\n\n${activeCampaign?.prospectingEmail?.body}`
                    : activeCampaign?.salesPitch;
                handleCopy(textToCopy || "", activeChannelTab);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
            >
              {copiedKey === activeChannelTab ? (
                <Check className="h-3.5 w-3.5 text-white" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copiedKey === activeChannelTab ? "Copié !" : "Copier le texte"}
            </button>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-line">
            {activeChannelTab === "facebook" && activeCampaign?.facebookPost}
            {activeChannelTab === "linkedin" && activeCampaign?.linkedinPost}
            {activeChannelTab === "whatsapp" && activeCampaign?.whatsappMessage}
            {activeChannelTab === "email" && (
              <div className="space-y-3">
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-slate-500 font-semibold">Objet du courriel : </span>
                  <span className="font-bold text-emerald-400">
                    {activeCampaign?.prospectingEmail?.subject}
                  </span>
                </div>
                <div className="whitespace-pre-line">{activeCampaign?.prospectingEmail?.body}</div>
              </div>
            )}
            {activeChannelTab === "pitch" && activeCampaign?.salesPitch}
          </div>
        </div>
      )}
    </div>
  );
};
