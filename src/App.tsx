import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/common/ToastContainer';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ManagementView } from './components/views/ManagementView';
import { OnlinePlayersView } from './components/views/OnlinePlayersView';
import { GameHistoryView } from './components/views/GameHistoryView';
import { WinPercentageView } from './components/views/WinPercentageView';
import { CalculatorNoteView } from './components/views/CalculatorNoteView';
import { TurnoverReportView } from './components/views/TurnoverReportView';
import { CommissionReportView } from './components/views/CommissionReportView';
import { LiveResultsView } from './components/views/LiveResultsView';
import { WinningDeclareView } from './components/views/WinningDeclareView';
import { OthersActivityView } from './components/views/OthersActivityView';
import { ProfileView } from './components/views/ProfileView';
import { UserGamePortalView } from './components/views/UserGamePortalView';
import { SourceCodeExportView } from './components/views/SourceCodeExportView';

const MainContent: React.FC = () => {
  const { currentPage } = useAdmin();

  const renderView = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardView />;

      case 'superdistributer':
        return <ManagementView role="SuperDistributer" />;
      case 'distributer':
        return <ManagementView role="Distributer" />;
      case 'retailer':
        return <ManagementView role="Retailer" />;
      case 'users':
        return <ManagementView role="User" />;

      case 'online_players':
        return <OnlinePlayersView />;
      case 'game_history':
        return <GameHistoryView />;
      case 'win_percentage':
        return <WinPercentageView />;
      case 'calculator_note':
        return <CalculatorNoteView />;

      case 'turnover_admin':
        return <TurnoverReportView level="Admin" />;
      case 'turnover_superdistributer':
        return <TurnoverReportView level="SuperDistributer" />;
      case 'turnover_distributer':
        return <TurnoverReportView level="Distributer" />;
      case 'turnover_retailer':
        return <TurnoverReportView level="Retailer" />;
      case 'turnover_user':
        return <TurnoverReportView level="User" />;

      case 'commission_user':
        return <CommissionReportView type="user" />;
      case 'commission_game':
        return <CommissionReportView type="game" />;

      case 'live_2d':
        return <LiveResultsView gameType="2D Lottery" />;
      case 'live_3d':
        return <LiveResultsView gameType="3D Lottery" />;
      case 'live_lucky12':
        return <LiveResultsView gameType="Lucky 12" />;

      case 'history_transactions':
        return <OthersActivityView section="transactions" />;
      case 'history_logs':
        return <OthersActivityView section="logs" />;
      case 'history_delete':
        return <OthersActivityView section="delete" />;
      case 'history_cancel_tickets':
        return <OthersActivityView section="cancel_tickets" />;

      case 'declare_2d':
      case 'declare_3d':
      case 'declare_lucky12':
        return <WinningDeclareView />;

      case 'user_game_portal':
        return <UserGamePortalView />;

      case 'source_code_export':
        return <SourceCodeExportView />;

      case 'profile':
        return <ProfileView />;

      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <Navbar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderView()}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <MainContent />
    </AdminProvider>
  );
}
