import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Menu,
  Bell,
  Search,
  RefreshCw,
  PlusCircle,
  MapPin,
  CheckCheck,
  X,
  ExternalLink,
} from "lucide-react";

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    notifications,
    markNotificationRead,
    clearNotifications,
    runScheduledScan,
    isScanning,
    searchConfig,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "dashboard":
        return { title: "Tableau de bord stratégique", subtitle: "Indicateurs clés & synthèse opérationnelle" };
      case "veille":
        return { title: "Veille Internet & Marchés", subtitle: "Surveillance continue des appels d'offres et bailleurs" };
      case "opportunites":
        return { title: "Opportunités détectées", subtitle: "Appels à projets, marchés et partenariats qualifiés" };
      case "analyse":
        return { title: "Analyse IA & Notation (100 pts)", subtitle: "Évaluation multicritère et stratégie de conquête" };
      case "besoins":
        return { title: "Ce que le marché recherche", subtitle: "Détection des besoins réels à Pointe-Noire et au Congo" };
      case "keywords":
        return { title: "Mots-clés commerciaux & SEO", subtitle: "Moteur sémantique et banques de hashtags locaux" };
      case "documents":
        return { title: "Générateur de dossiers professionnels", subtitle: "Bureau de production documentaire (Admin, Tech, Finance)" };
      case "studio":
        return { title: "Studio publicitaire & Affiches", subtitle: "Campagnes multicanales et créations graphiques IA" };
      case "strategies":
        return { title: "Stratégies commerciales & Réponses", subtitle: "Plans d'action méthodiques par type d'opportunité" };
      case "crm":
        return { title: "CRM Commercial & Pipeline", subtitle: "Gestion des prospects, rendez-vous et négociations" };
      case "fichiers":
        return { title: "Bibliothèque de fichiers & Archives", subtitle: "Dossiers finalisés et modèles réutilisables" };
      case "parametres":
        return { title: "Paramètres & Sources de veille", subtitle: "Automatisation, planification et statut des connecteurs" };
      default:
        return { title: "242Agro Intelligence", subtitle: "Plateforme de veille et développement commercial" };
    }
  };

  const { title, subtitle } = getTabTitle(activeTab);

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 backdrop-blur-md lg:px-8">
      {/* Left side : Hamburger + Titles */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div>
          <h1 className="text-base font-bold text-white sm:text-lg tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="hidden text-xs text-slate-400 sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right side : Quick actions & notifications */}
      <div className="flex items-center gap-3">
        {/* Geographic zone pill */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
          <MapPin className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-medium text-white">{searchConfig.zone}</span>
          <span className="text-[10px] text-slate-500">| Congo</span>
        </div>

        {/* Scan launcher button */}
        <button
          onClick={() => runScheduledScan()}
          disabled={isScanning}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all shadow-sm ${
            isScanning
              ? "bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-950/50"
          }`}
          title="Lancer un cycle de veille maintenant"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin text-emerald-400" : ""}`} />
          <span className="hidden sm:inline">
            {isScanning ? "Veille en cours..." : "Lancer la veille"}
          </span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg border border-slate-800 bg-slate-800/60 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-slate-950 ring-2 ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">Centre de notifications</span>
                  {unreadCount > 0 && (
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-medium text-emerald-400">
                      {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        notifications.forEach((n) => markNotificationRead(n.id));
                      }}
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="h-3 w-3" /> Tout marquer lu
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">Aucune notification pour le moment.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.actionTab) {
                          setActiveTab(n.actionTab);
                          setShowNotifications(false);
                        }
                      }}
                      className={`cursor-pointer rounded-lg border p-2.5 transition text-left ${
                        !n.read
                          ? "border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/30"
                          : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-xs font-medium ${
                            !n.read ? "text-emerald-300 font-semibold" : "text-slate-300"
                          }`}
                        >
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                          {new Date(n.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="mt-2.5 border-t border-slate-800 pt-2 flex justify-between items-center text-[11px]">
                  <button
                    onClick={clearNotifications}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    Effacer l'historique
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("parametres");
                      setShowNotifications(false);
                    }}
                    className="text-emerald-400 hover:underline"
                  >
                    Configurer les alertes &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
