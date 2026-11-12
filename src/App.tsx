import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardView } from "./components/views/DashboardView";
import { VeilleView } from "./components/views/VeilleView";
import { OpportunitiesView } from "./components/views/OpportunitiesView";
import { AnalyseIAView } from "./components/views/AnalyseIAView";
import { MarketNeedsView } from "./components/views/MarketNeedsView";
import { KeywordsView } from "./components/views/KeywordsView";
import { DocumentsView } from "./components/views/DocumentsView";
import { StudioView } from "./components/views/StudioView";
import { StrategiesView } from "./components/views/StrategiesView";
import { CRMView } from "./components/views/CRMView";
import { FichiersView } from "./components/views/FichiersView";
import { ParametresView } from "./components/views/ParametresView";

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "veille":
        return <VeilleView />;
      case "opportunites":
        return <OpportunitiesView />;
      case "analyse":
        return <AnalyseIAView />;
      case "besoins":
        return <MarketNeedsView />;
      case "keywords":
        return <KeywordsView />;
      case "documents":
        return <DocumentsView />;
      case "studio":
        return <StudioView />;
      case "strategies":
        return <StrategiesView />;
      case "crm":
        return <CRMView />;
      case "fichiers":
        return <FichiersView />;
      case "parametres":
        return <ParametresView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header setMobileOpen={setMobileOpen} />

        {/* Viewport content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="mx-auto max-w-7xl">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
