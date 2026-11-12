import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Settings,
  Clock,
  Mail,
  ShieldCheck,
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Building,
  Key,
  ExternalLink,
  Lock,
} from "lucide-react";

export const ParametresView: React.FC = () => {
  const {
    searchConfig,
    updateSearchConfig,
    runScheduledScan,
    isScanning,
    exportBackup,
    importBackup,
    resetAllData,
  } = useApp();

  const [importFile, setImportFile] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          importBackup(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Settings className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-white sm:text-lg">
              Paramètres, Sources de veille & Sécurité
            </h2>
            <p className="text-xs text-slate-400">
              Configuration des tâches d'automatisation, alertes par e-mail et gestion des données d'entreprise.
            </p>
          </div>
        </div>

        {/* Form settings */}
        <form onSubmit={handleSaveSettings} className="mt-5 space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Automated Schedule Interval */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                Fréquence des recherches automatiques
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Le moteur interrogera les flux officiels et notifiera l'équipe dès qu'une offre prioritaire (score ≥ 85) est détectée.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  { id: "24h", label: "Toutes les 24 heures (Quotidien - Recommandé)" },
                  { id: "3days", label: "Plusieurs fois par semaine (Tous les 3 jours)" },
                  { id: "weekly", label: "Une fois par semaine (Hebdomadaire)" },
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="interval"
                      value={item.id}
                      checked={searchConfig.interval === item.id}
                      onChange={(e) =>
                        updateSearchConfig({ interval: e.target.value as any })
                      }
                      className="accent-emerald-500"
                    />
                    <span className="text-slate-300 font-medium">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="pt-2 text-[10px] text-slate-500">
                Dernier cycle exécuté le : {new Date(searchConfig.lastRun || Date.now()).toLocaleString()}
              </div>
            </div>

            {/* Email Alerts & Notifications */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400" />
                Alertes par courriel & Synthèses périodiques
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Recevez un rapport immédiat lors des nouvelles annonces ou des changements de conditions des appels d'offres.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Adresse e-mail de réception :
                </label>
                <input
                  type="email"
                  value={searchConfig.email}
                  onChange={(e) => updateSearchConfig({ email: e.target.value })}
                  placeholder="242agro@gmail.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={searchConfig.autoAlerts}
                  onChange={(e) => updateSearchConfig({ autoAlerts: e.target.checked })}
                  className="accent-emerald-500 rounded"
                />
                <span className="text-slate-300 font-medium">
                  Activer les notifications instantanées pour les opportunités prioritaires
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => runScheduledScan()}
              disabled={isScanning}
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin" : ""}`} />
              Tester un cycle immédiat maintenant
            </button>

            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/50 transition"
            >
              {saveSuccess ? "Paramètres enregistrés !" : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>

      {/* Connected Services & Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connectors Status */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Key className="h-4 w-4 text-emerald-400" />
            Statut des connecteurs d'intelligence & API
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60">
              <div>
                <span className="font-bold text-white block">Google Gemini 3.8 Flash (Server-Side)</span>
                <span className="text-[10px] text-slate-400">Analyse 100 pts, génération de dossiers & SEO</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                Opérationnel
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60">
              <div>
                <span className="font-bold text-white block">Flux PNUD & Nations Unies Congo</span>
                <span className="text-[10px] text-slate-400">Surveillance des appels à projets et subventions</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                Connecté
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60">
              <div>
                <span className="font-bold text-white block">Réseaux RSE Entreprises (TotalEnergies, Eni)</span>
                <span className="text-[10px] text-slate-400">Surveillance des programmes de développement local</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                Connecté
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60">
              <div>
                <span className="font-bold text-white block">Marchés Mairie de Pointe-Noire</span>
                <span className="text-[10px] text-slate-400">Avis de consultation d'embellissement floral & vert</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                Connecté
              </span>
            </div>
          </div>
        </div>

        {/* Corporate Identity Reference */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="h-4 w-4 text-emerald-400" />
              Référence officielle de l'entreprise
            </h3>
            <a
              href="https://242agropn.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              Site web <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Entreprise :</span>
              <strong className="text-white">242Agro</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Fondateur & Direction :</span>
              <strong className="text-emerald-400">Roc Nkouelolo (CEO & Fondateur)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Contact WhatsApp direct :</span>
              <strong className="text-white font-mono">+242 06 874 22 77</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Localisation :</span>
              <strong className="text-white">Pointe-Noire, République du Congo</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Mission :</span>
              <span className="text-slate-300 text-right">« Nous faisons pousser la possibilité de produire localement, même là où la ville laisse peu de place à la terre. »</span>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                11 Domaines de compétences intégrés :
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Potagers hors-sol, jardins en cours pavées, maraîchage local sans chimie, élevage intégré (poules/lapins), compostage accéléré, microfermes modulaires, potagers scolaires, formations, pépinière fruitière et partenariats RSE.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Backup, Import & Factory Reset */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-400" />
          Sauvegarde, Restauration & Protection des données
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Export JSON */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs">
            <h4 className="font-bold text-white">Sauvegarde complète (JSON)</h4>
            <p className="text-[11px] text-slate-400">
              Téléchargez une archive chiffrée de toutes vos opportunités, documents, prospects CRM et campagnes.
            </p>
            <button
              onClick={exportBackup}
              className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              Exporter la sauvegarde
            </button>
          </div>

          {/* Import JSON */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs">
            <h4 className="font-bold text-white">Restaurer un fichier</h4>
            <p className="text-[11px] text-slate-400">
              Rechargez une sauvegarde précédente pour rétablir vos données d'entreprise.
            </p>
            <label className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition cursor-pointer">
              <Upload className="h-3.5 w-3.5 text-blue-400" />
              Importer une sauvegarde
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset All */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 space-y-2 text-xs">
            <h4 className="font-bold text-rose-300">Réinitialisation complète</h4>
            <p className="text-[11px] text-slate-400">
              Restaurer la base aux valeurs par défaut officielles 242Agro à Pointe-Noire.
            </p>
            <button
              onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ?")) {
                  resetAllData();
                }
              }}
              className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-900/30 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/50 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Réinitialiser l'application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
