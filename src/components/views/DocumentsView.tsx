import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { DocumentRecord, DocumentCategoryType } from "../../types";
import { exportToWord, exportToPDF, printDocument } from "../../utils/exportUtils";
import {
  FileText,
  FileCheck,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  Edit3,
  Plus,
  Trash2,
  FolderOpen,
  Send,
  AlertCircle,
  Building,
  Eye,
  CheckCircle2,
  Layers,
  Leaf,
  Briefcase,
  BookOpen,
} from "lucide-react";

export const DocumentsView: React.FC = () => {
  const {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    validateDocument,
    opportunities,
    selectedOpportunityId,
    setSelectedOpportunityId,
  } = useApp();

  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || "");
  const [activeCategoryTab, setActiveCategoryTab] = useState<
    DocumentCategoryType | "PackComplet"
  >("PackComplet");
  const [viewMode, setViewMode] = useState<"printPreview" | "editor">("printPreview");
  const [selectedTone, setSelectedTone] = useState<string>(
    "Partenariat RSE Entreprises (TotalEnergies, Eni, Banques)"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];
  const targetOpportunity =
    opportunities.find((o) => o.id === selectedOpportunityId) || opportunities[0];

  // Document templates list per category
  const adminDocTypes = [
    "Lettre officielle de manifestation d'intérêt",
    "Lettre de demande de partenariat",
    "Lettre de demande de sponsoring RSE",
    "Lettre de demande de financement",
    "Lettre de soumission d'offre",
    "Convention de partenariat stratégique",
    "Accord de collaboration technique",
    "Termes de référence (TDR)",
  ];

  const techDocTypes = [
    "Proposition technique intégrale",
    "Note conceptuelle de projet",
    "Méthodologie détaillée d'intervention",
    "Étude de faisabilité agronomique",
    "Chronogramme d'exécution (Semaines 1 à 8)",
    "Cadre logique & Théorie du changement",
    "Plan de suivi-évaluation et pérennité",
    "Étude d'impact environnemental simplifiée",
  ];

  const financeDocTypes = [
    "Budget détaillé chiffré en Francs CFA",
    "Devis professionnel détaillé",
    "Plan de trésorerie prévisionnel",
    "Prévisions de dépenses et marges",
    "Tableau des contributions locales",
    "Proposition de contreparties RSE",
  ];

  const packTypes = [
    "Dossier de candidature complet (Pack Intégral Clés en Main)",
    "Dossier de réponse à appel d'offres RSE",
    "Dossier de projet pédagogique scolaire complet",
  ];

  const [selectedDocType, setSelectedDocType] = useState<string>(packTypes[0]);

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    try {
      const combinedInstructions = `Ton de rédaction souhaité : ${selectedTone}. ${
        customInstructions
          ? `Consignes spécifiques de l'utilisateur : ${customInstructions}`
          : "Exiger une rédaction fluide, naturelle, humaine, exhaustive, sans aucune formule robotique."
      }`;

      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: selectedDocType,
          opportunity: targetOpportunity,
          customInstructions: combinedInstructions,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la rédaction par le serveur");
      }

      const data = await res.json();
      const cat: DocumentCategoryType =
        activeCategoryTab === "PackComplet"
          ? "Technique"
          : activeCategoryTab;

      const newDoc: DocumentRecord = {
        id: `doc-${Date.now()}`,
        opportunityId: targetOpportunity?.id,
        opportunityTitle: targetOpportunity?.title,
        title: data.title || `${selectedDocType} — ${targetOpportunity?.issuer || "242Agro"}`,
        documentType: selectedDocType,
        category: cat,
        content: data.content,
        isCustomized: true,
        isHumanValidated: false, // Strict human in the loop
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [targetOpportunity?.issuer || "Général", cat, "Prêt à imprimer"],
      };

      addDocument(newDoc);
      setSelectedDocId(newDoc.id);
      setViewMode("printPreview");
    } catch (e: any) {
      alert("Erreur de génération : " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert markdown lines for preview rendering
  const renderFormattedPreview = (markdown: string) => {
    return (
      <div className="space-y-4 text-slate-800 leading-relaxed font-sans text-xs sm:text-sm">
        {markdown.split("\n\n").map((block, idx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          // Main Header (#)
          if (trimmed.startsWith("# ")) {
            return (
              <h1
                key={idx}
                className="text-xl sm:text-2xl font-extrabold text-emerald-900 border-b-2 border-emerald-500 pb-2 pt-4 tracking-tight"
              >
                {trimmed.replace("# ", "")}
              </h1>
            );
          }

          // Subheader (##)
          if (trimmed.startsWith("## ")) {
            return (
              <h2
                key={idx}
                className="text-base sm:text-lg font-bold text-emerald-800 border-l-4 border-emerald-500 pl-3 pt-3 mt-4"
              >
                {trimmed.replace("## ", "")}
              </h2>
            );
          }

          // Small header (###)
          if (trimmed.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-sm sm:text-base font-bold text-teal-800 pt-2">
                {trimmed.replace("### ", "")}
              </h3>
            );
          }

          // Separator (---)
          if (trimmed === "---") {
            return <hr key={idx} className="border-t border-slate-300 my-4" />;
          }

          // Tables
          if (trimmed.includes("|") && trimmed.includes("\n")) {
            const tableLines = trimmed.split("\n").filter((l) => l.trim().startsWith("|"));
            if (tableLines.length >= 2) {
              const headerCells = tableLines[0]
                .slice(1, -1)
                .split("|")
                .map((c) => c.trim());
              const rowLines = tableLines.slice(2); // Skip separator line

              return (
                <div key={idx} className="overflow-x-auto my-4 rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-emerald-50 text-emerald-950 font-bold border-b border-emerald-200">
                      <tr>
                        {headerCells.map((h, i) => (
                          <th key={i} className="p-2.5 border-r border-emerald-200/60 last:border-0">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {rowLines.map((row, rIdx) => {
                        const cells = row
                          .slice(1, -1)
                          .split("|")
                          .map((c) => c.trim());
                        return (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                            {cells.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`p-2.5 border-r border-slate-200 last:border-0 ${
                                  cIdx === 0 ? "font-semibold text-slate-900" : "text-slate-700"
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }
          }

          // Bullet lists
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-700">
                {trimmed.split("\n").map((li, lIdx) => (
                  <li key={lIdx}>{li.replace(/^[-*]\s+/, "")}</li>
                ))}
              </ul>
            );
          }

          // Numbered lists
          if (/^\d+\.\s/.test(trimmed)) {
            return (
              <ol key={idx} className="list-decimal pl-5 space-y-1.5 text-slate-800 font-medium">
                {trimmed.split("\n").map((li, lIdx) => (
                  <li key={lIdx}>{li.replace(/^\d+\.\s+/, "")}</li>
                ))}
              </ol>
            );
          }

          // Standard paragraph
          return (
            <p key={idx} className="text-slate-700 leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Generator Control Center */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <FileText className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Générateur de dossiers complets & prêts à imprimer
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Rédaction humaine, riche et détaillée pour les bailleurs (PNUD, UE), grandes entreprises (TotalEnergies, Eni) et écoles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Projet ciblé :</span>
              <select
                value={targetOpportunity?.id || ""}
                onChange={(e) => setSelectedOpportunityId(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none max-w-xs truncate"
              >
                {opportunities.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.issuer} — {o.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Human Tone and Package Selectors */}
        <div className="mt-4 space-y-3.5">
          {/* Main Category Tabs */}
          <div className="flex border-b border-slate-800 gap-1 overflow-x-auto pb-0.5">
            {[
              { id: "PackComplet", label: "📦 Pack Intégral (Dossier Complet Clés en Main)" },
              { id: "Technique", label: "🌿 Proposition Technique & Méthodologie" },
              { id: "Administratif", label: "✉️ Lettres Officielles & Accords" },
              { id: "Financier", label: "💰 Budget Chiffré en FCFA & Devis" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategoryTab(cat.id as any);
                  if (cat.id === "PackComplet") setSelectedDocType(packTypes[0]);
                  if (cat.id === "Technique") setSelectedDocType(techDocTypes[0]);
                  if (cat.id === "Administratif") setSelectedDocType(adminDocTypes[0]);
                  if (cat.id === "Financier") setSelectedDocType(financeDocTypes[0]);
                }}
                className={`px-4 py-2 text-xs font-bold transition border-b-2 -mb-px whitespace-nowrap ${
                  activeCategoryTab === cat.id
                    ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Specific document model selector */}
            <div className="md:col-span-6">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Type de dossier ou pièce officielle :
              </label>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
              >
                {activeCategoryTab === "PackComplet" &&
                  packTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                {activeCategoryTab === "Technique" &&
                  techDocTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                {activeCategoryTab === "Administratif" &&
                  adminDocTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                {activeCategoryTab === "Financier" &&
                  financeDocTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
              </select>
            </div>

            {/* Human Diplomatic Tone Selector */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Ton humain & Niveau de discours :
              </label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-emerald-400 font-medium focus:border-emerald-500 focus:outline-none truncate"
              >
                <option value="Partenariat RSE Entreprises (TotalEnergies, Eni, Banques)">
                  RSE Entreprises (Pétrole, Banques)
                </option>
                <option value="Institutionnel & Bailleurs (PNUD, UE, Coopération)">
                  Institutionnel (PNUD, UE, AFD)
                </option>
                <option value="Écoles & Établissements Scolaires">
                  Écoles & Enseignement
                </option>
                <option value="Commercial & Particuliers">
                  Particuliers & Résidences
                </option>
              </select>
            </div>

            {/* Generation Button */}
            <div className="md:col-span-3 flex md:self-end">
              <button
                onClick={handleGenerateDocument}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/60 transition"
              >
                <Sparkles className={`h-4 w-4 ${isGenerating ? "animate-spin text-emerald-300" : ""}`} />
                {isGenerating ? "Rédaction complète..." : "RÉDIGER MON DOSSIER COMPLET"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace : Left Sidebar (Saved docs) + Right Main Paper/Editor Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document List Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-white">
              Dossiers & Pièces disponibles ({documents.length})
            </span>
            <span className="text-[10px] text-emerald-400">Prêts pour envoi</span>
          </div>

          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {documents.map((doc) => {
              const isSelected = doc.id === activeDoc?.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all text-left ${
                    isSelected
                      ? "border-emerald-500 bg-slate-900 shadow-md ring-1 ring-emerald-500/20"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        doc.category === "Administratif"
                          ? "bg-blue-500/20 text-blue-300"
                          : doc.category === "Technique"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {doc.category}
                    </span>
                    {doc.isHumanValidated ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <ShieldCheck className="h-3 w-3" /> Certifié
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-medium">Brouillon prêt</span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {doc.title}
                  </h4>
                  <p className="mt-1 text-[10px] text-slate-400 flex items-center gap-1">
                    <Building className="h-3 w-3 text-slate-500" />
                    {doc.opportunityTitle || "242Agro Pointe-Noire"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column : Live Document Viewer & Exporter (8 cols) */}
        <div className="lg:col-span-8">
          {activeDoc ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
              {/* Document Toolbar & Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                      {activeDoc.documentType}
                    </span>
                    {activeDoc.isHumanValidated && (
                      <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Validé pour soumission
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                    {activeDoc.title}
                  </h3>
                </div>

                {/* Switcher & Action buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Mode switcher */}
                  <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-0.5">
                    <button
                      onClick={() => setViewMode("printPreview")}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                        viewMode === "printPreview"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                      title="Aperçu document papier A4"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Aperçu A4
                    </button>
                    <button
                      onClick={() => setViewMode("editor")}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                        viewMode === "editor"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                      title="Modifier le texte en Markdown"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Éditer
                    </button>
                  </div>

                  {/* Print Button */}
                  <button
                    onClick={() => printDocument(activeDoc.title, activeDoc.content)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                    title="Imprimer directement ou exporter en PDF via le navigateur"
                  >
                    <Printer className="h-3.5 w-3.5 text-emerald-400" />
                    Imprimer
                  </button>

                  {/* Word Export Button */}
                  <button
                    onClick={() => exportToWord(activeDoc.title, activeDoc.content)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
                    title="Télécharger au format Word (.doc) complet"
                  >
                    <Download className="h-3.5 w-3.5 text-blue-400" />
                    Word (.doc)
                  </button>

                  {/* PDF Export Button */}
                  <button
                    onClick={() => exportToPDF(activeDoc.title, activeDoc.content)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
                    title="Télécharger le PDF officiel"
                  >
                    <Download className="h-3.5 w-3.5 text-rose-400" />
                    PDF
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copié" : "Copier"}
                  </button>

                  {/* Human validation */}
                  {!activeDoc.isHumanValidated ? (
                    <button
                      onClick={() => validateDocument(activeDoc.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/60 transition"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Certifier conforme
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-semibold px-2 py-1">
                      ✓ Validé
                    </span>
                  )}
                </div>
              </div>

              {/* View Container : Print Preview (A4 Card) vs Markdown Editor */}
              {viewMode === "printPreview" ? (
                /* Simulated A4 High-End Letterhead Document */
                <div className="bg-slate-950 p-2 sm:p-6 rounded-xl border border-slate-800 flex justify-center">
                  <div className="w-full max-w-3xl bg-white text-slate-900 p-6 sm:p-10 rounded-xl shadow-2xl border border-slate-200 min-h-[850px] relative">
                    {/* Official Letterhead Header */}
                    <div className="border-b-2 border-emerald-700 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-xl shadow-md">
                          🌿
                        </div>
                        <div>
                          <div className="text-base sm:text-lg font-black tracking-tight text-emerald-900 leading-none">
                            242AGRO
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 mt-1 uppercase tracking-wider">
                            Solutions d'Agriculture Urbaine Circulaire &middot; Pointe-Noire
                          </div>
                          <div className="text-[9px] text-slate-500">
                            Pointe-Noire, République du Congo &middot; WhatsApp : +242 06 874 22 77
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-[10px] text-slate-500 space-y-0.5">
                        <div>Site officiel : <strong>https://242agropn.netlify.app/</strong></div>
                        <div>E-mail : <strong>242agro@gmail.com</strong></div>
                        <div>Immatriculation : <strong>RCCM-PN-2024 / NIU Officiel</strong></div>
                      </div>
                    </div>

                    {/* Document Content Rendered */}
                    {renderFormattedPreview(activeDoc.content)}

                    {/* Official Footer Banner */}
                    <div className="mt-12 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between gap-1">
                      <span>242Agro &middot; Siège à Pointe-Noire, République du Congo</span>
                      <span>Dossier technique & financier certifié conforme</span>
                      <span>Page 1 sur 1 &middot; Tirage officiel</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Editable Markdown Box */
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Édition libre du document (Markdown supporté) :</span>
                    <span className="text-emerald-400 font-medium">
                      Toutes les modifications sont enregistrées en direct
                    </span>
                  </div>
                  <textarea
                    value={activeDoc.content}
                    onChange={(e) => updateDocument({ ...activeDoc, content: e.target.value })}
                    rows={22}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs text-slate-100 leading-relaxed focus:border-emerald-500 focus:outline-none scrollbar-thin scrollbar-thumb-slate-800"
                  />
                </div>
              )}

              {/* Bottom Metadata & Delete Option */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-3">
                <span>
                  Dernière mise à jour :{" "}
                  {new Date(activeDoc.updatedAt).toLocaleString("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <button
                  onClick={() => deleteDocument(activeDoc.id)}
                  className="text-rose-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Supprimer ce dossier
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-xs text-slate-500">
              Aucun document sélectionné. Choisissez ou générez un document.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
