import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CRMLead, CRMStage } from "../../types";
import {
  Users,
  Plus,
  Search,
  Kanban,
  Table as TableIcon,
  Phone,
  Mail,
  Calendar,
  Building,
  DollarSign,
  ChevronRight,
  Clock,
  Trash2,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";

export const CRMView: React.FC = () => {
  const { leads, addLead, updateLead, moveLeadStage, deleteLead } = useApp();

  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(leads[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form state
  const [newClientName, setNewClientName] = useState("");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLocation, setNewLocation] = useState("Pointe-Noire");
  const [newValueFCFA, setNewValueFCFA] = useState("5000000");

  const stages: { id: CRMStage; label: string; color: string }[] = [
    { id: "detected", label: "Détectée", color: "border-slate-700 bg-slate-900" },
    { id: "selected", label: "Sélectionnée", color: "border-blue-500/30 bg-blue-950/20" },
    { id: "dossier_prep", label: "Dossier en prép.", color: "border-purple-500/30 bg-purple-950/20" },
    { id: "submitted", label: "Soumis", color: "border-sky-500/30 bg-sky-950/20" },
    { id: "meeting_scheduled", label: "RDV Fixé", color: "border-amber-500/30 bg-amber-950/20" },
    { id: "proposal_sent", label: "Offre envoyée", color: "border-teal-500/30 bg-teal-950/20" },
    { id: "negotiation", label: "En négociation", color: "border-indigo-500/30 bg-indigo-950/20" },
    { id: "won", label: "Gagné 🎉", color: "border-emerald-500/40 bg-emerald-950/30" },
    { id: "lost", label: "Perdu", color: "border-rose-500/30 bg-rose-950/20" },
  ];

  const filteredLeads = leads.filter(
    (l) =>
      l.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR").format(val) + " FCFA";
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newTitle) return;

    const lead: CRMLead = {
      id: `lead-${Date.now()}`,
      title: newTitle,
      clientName: newClientName,
      contactPerson: newContactPerson || "Contact Direct",
      email: newEmail || "contact@client.cg",
      phone: newPhone || "+242 06 000 00 00",
      location: newLocation,
      stage: "selected",
      potentialValueFCFA: parseInt(newValueFCFA, 10) || 3000000,
      probability: 60,
      nextFollowUpDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0],
      notes: "Nouveau prospect ajouté manuellement.",
      history: [
        {
          date: new Date().toISOString().split("T")[0],
          action: "Création manuelle de la fiche prospect",
          user: "Direction 242Agro",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addLead(lead);
    setShowAddModal(false);
    // Reset form
    setNewClientName("");
    setNewContactPerson("");
    setNewTitle("");
    setNewEmail("");
    setNewPhone("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Users className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-white sm:text-lg">
                CRM & Pipeline Commercial 242Agro
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Suivi rigoureux des prospects, dossiers soumis, relances et contrats conclus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher */}
            <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === "kanban"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Kanban className="h-3.5 w-3.5" />
                Kanban
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === "table"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <TableIcon className="h-3.5 w-3.5" />
                Tableau
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/60 transition"
            >
              <Plus className="h-4 w-4" />
              Nouveau prospect
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par client, projet ou contact..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Valeur totale en négociation :{" "}
            <strong className="text-emerald-400">
              {formatFCFA(
                leads
                  .filter((l) => l.stage !== "lost")
                  .reduce((acc, curr) => acc + curr.potentialValueFCFA, 0)
              )}
            </strong>
          </div>
        </div>
      </div>

      {/* Main CRM View: Kanban vs Table */}
      {viewMode === "kanban" ? (
        /* Kanban Horizontal Scroll Board */
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800">
          {stages.map((stg) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stg.id);
            const stageTotal = stageLeads.reduce((acc, curr) => acc + curr.potentialValueFCFA, 0);

            return (
              <div
                key={stg.id}
                className="w-72 shrink-0 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 flex flex-col max-h-[700px]"
              >
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{stg.label}</span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.2 text-[10px] font-bold text-slate-400">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {formatFCFA(stageTotal)}
                  </span>
                </div>

                {/* Cards in column */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {stageLeads.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-800/80 p-6 text-center text-[11px] text-slate-500">
                      Aucun dossier
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`cursor-pointer rounded-xl border p-3.5 space-y-2 transition shadow-sm ${
                          selectedLead?.id === lead.id
                            ? "border-emerald-500 bg-slate-900 ring-1 ring-emerald-500/20"
                            : "border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-300 line-clamp-1">
                            {lead.clientName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {lead.location}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white line-clamp-2">
                          {lead.title}
                        </h4>

                        <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-2 text-[11px]">
                          <span className="font-bold text-white">
                            {formatFCFA(lead.potentialValueFCFA)}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lead.nextFollowUpDate}
                          </span>
                        </div>

                        {/* Quick stage mover dropdown */}
                        <div className="pt-1.5 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Étape :</span>
                          <select
                            value={lead.stage}
                            onChange={(e) => moveLeadStage(lead.id, e.target.value as CRMStage)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 px-1 py-0.5 focus:outline-none"
                          >
                            {stages.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Client & Titre</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Étape</th>
                  <th className="p-3.5">Valeur estimée</th>
                  <th className="p-3.5">Prochaine relance</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-white">{lead.clientName}</div>
                      <div className="text-[11px] text-slate-400">{lead.title}</div>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      <div>{lead.contactPerson}</div>
                      <div className="text-[10px] text-slate-500">{lead.phone}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        {stages.find((s) => s.id === lead.stage)?.label}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">
                      {formatFCFA(lead.potentialValueFCFA)}
                    </td>
                    <td className="p-3.5 text-slate-400">{lead.nextFollowUpDate}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLead(lead.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Lead Inspector Drawer / Modal */}
      {selectedLead && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{selectedLead.clientName}</span>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                  {formatFCFA(selectedLead.potentialValueFCFA)}
                </span>
              </div>
              <p className="text-xs text-slate-400">{selectedLead.title}</p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                {selectedLead.phone}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-emerald-400" />
                {selectedLead.email}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Notes */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase">
                Notes & Commentaires de suivi :
              </label>
              <textarea
                value={selectedLead.notes}
                onChange={(e) => updateLead({ ...selectedLead, notes: e.target.value })}
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* History log */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase">
                Historique des interactions :
              </label>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs space-y-2 max-h-32 overflow-y-auto">
                {selectedLead.history?.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/60 pb-1 last:border-0">
                    <span>{h.action}</span>
                    <span className="text-[10px] text-slate-500">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Ajouter un nouveau prospect CRM</h3>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nom de l'entreprise / Client :</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="ex: Hôtel Atlantic Palace ou TotalEnergies EP Congo"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Intitulé de la proposition :</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex: Installation de bacs aromatiques en terrasse"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Personne de contact :</label>
                  <input
                    type="text"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    placeholder="ex: M. Koubemba (Directeur)"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Téléphone :</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+242 06 000 00 00"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Montant estimé (FCFA) :</label>
                  <input
                    type="number"
                    value={newValueFCFA}
                    onChange={(e) => setNewValueFCFA(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Localisation :</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Pointe-Noire"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-500"
                >
                  Enregistrer le prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
