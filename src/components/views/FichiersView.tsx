import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { DocumentRecord } from "../../types";
import { exportToWord, exportToPDF } from "../../utils/exportUtils";
import {
  FolderArchive,
  Search,
  Download,
  FileText,
  ShieldCheck,
  Eye,
  Trash2,
  Calendar,
  Tag,
  Building,
} from "lucide-react";

export const FichiersView: React.FC = () => {
  const { documents, deleteDocument, setActiveTab, setSelectedOpportunityId } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [inspectingDoc, setInspectingDoc] = useState<DocumentRecord | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.opportunityTitle || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Control */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <FolderArchive className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Bibliothèque de fichiers & Archives documentaires
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Centralisation de tous les dossiers rédigés, fiches techniques et propositions financières de 242Agro.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Total archivé : <strong className="text-emerald-400">{documents.length} document(s)</strong>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un document par titre, type ou bailleur..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {["all", "Administratif", "Technique", "Financier"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-700 bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                {cat === "all" ? "Tous les documents" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4.5 space-y-3 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
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
                    <ShieldCheck className="h-3.5 w-3.5" /> Validé
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 font-medium">Brouillon</span>
                )}
              </div>

              <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                {doc.title}
              </h4>

              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Building className="h-3 w-3 text-slate-500" />
                {doc.opportunityTitle || "Projet interne 242Agro"}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500">
                {new Date(doc.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setInspectingDoc(doc)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Aperçu rapide"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => exportToWord(doc.title, doc.content)}
                  className="rounded-lg p-1.5 text-blue-400 hover:bg-slate-800"
                  title="Télécharger Word (.doc)"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => exportToPDF(doc.title, doc.content)}
                  className="rounded-lg p-1.5 text-rose-400 hover:bg-slate-800"
                  title="Télécharger PDF"
                >
                  <FileText className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inspecting Preview Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{inspectingDoc.title}</h3>
                <span className="text-xs text-slate-400">{inspectingDoc.documentType}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportToWord(inspectingDoc.title, inspectingDoc.content)}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-blue-300 font-medium hover:bg-slate-700"
                >
                  Télécharger Word
                </button>
                <button
                  onClick={() => setInspectingDoc(null)}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
                >
                  Fermer
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
              {inspectingDoc.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
