import React from "react";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  Globe,
  Compass,
  BrainCircuit,
  TrendingUp,
  Hash,
  FileText,
  Sparkles,
  Target,
  Users,
  FolderArchive,
  Settings,
  Leaf,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, opportunities, notifications, isScanning } = useApp();

  const priorityCount = opportunities.filter((o) => o.matchScore >= 85).length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { id: "veille", label: "Veille Internet", icon: Globe, badge: isScanning ? "Scan..." : undefined, isPulse: isScanning },
    { id: "opportunites", label: "Opportunités", icon: Compass, count: opportunities.length, priorityBadge: priorityCount > 0 ? `${priorityCount} top` : undefined },
    { id: "analyse", label: "Analyse IA (100 pts)", icon: BrainCircuit },
    { id: "besoins", label: "Besoins du marché", icon: TrendingUp },
    { id: "keywords", label: "Mots-clés & SEO", icon: Hash },
    { id: "documents", label: "Générateur de dossiers", icon: FileText },
    { id: "studio", label: "Studio publicitaire", icon: Sparkles },
    { id: "strategies", label: "Stratégies de réponse", icon: Target },
    { id: "crm", label: "CRM & Prospects", icon: Users },
    { id: "fichiers", label: "Bibliothèque", icon: FolderArchive },
    { id: "parametres", label: "Paramètres & Sources", icon: Settings, badge: unreadNotifs > 0 ? `${unreadNotifs}` : undefined },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-900/95 backdrop-blur-md transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="flex h-18 items-center justify-between border-b border-slate-800/80 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-400/40">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">242Agro</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                  IA
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Pointe-Noire, Congo</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
        </div>

        {/* Company Quick Badge */}
        <div className="mx-4 mt-3 mb-1 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Agriculture Circulaire
            </span>
            <a
              href="https://242agropn.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 transition"
            >
              Site <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 leading-tight">
            Potagers hors-sol &middot; Élevage intégré &middot; Compostage
          </p>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30 ring-1 ring-emerald-400/30"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.priorityBadge && (
                    <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                      {item.priorityBadge}
                    </span>
                  )}
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.isPulse
                          ? "animate-pulse bg-emerald-500 text-slate-950 font-bold"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && !item.priorityBadge && (
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 group-hover:text-slate-300">
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info & Founder direct */}
        <div className="border-t border-slate-800/80 p-3.5 space-y-2">
          <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
            <div className="text-[11px] font-bold text-white flex items-center justify-between">
              <span>Roc Nkouelolo</span>
              <span className="text-[9px] text-emerald-400 font-semibold uppercase">CEO & Fondateur</span>
            </div>
            <div className="text-[10px] text-emerald-300 font-mono mt-0.5">
              WhatsApp : +242 06 874 22 77
            </div>
            <div className="text-[9px] text-slate-400 truncate mt-0.5">
              242Agro &middot; Pointe-Noire
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>242Agro Intelligence</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              IA Connectée
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
