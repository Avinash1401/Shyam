import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { PlayerHeader } from './components/layout/PlayerHeader';
import { PlayerSidebar } from './components/layout/PlayerSidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthScreen } from './components/auth/AuthScreen';

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
import { ResultSettingsView } from './components/views/ResultSettingsView';
import { AdminLucky12ConfigView } from './components/views/AdminLucky12ConfigView';
import { SourceCodeExportView } from './components/views/SourceCodeExportView';

// Player Panel Dedicated Views
import { PlayerWalletView } from './components/views/PlayerWalletView';
import { PlayerReferralView } from './components/views/PlayerReferralView';
import { PlayerSupportView } from './components/views/PlayerSupportView';

// Admin Panel Financial Views
import { AdminDepositsView } from './components/views/AdminDepositsView';
import { AdminReferralsView } from './components/views/AdminReferralsView';

const MainContent: React.FC = () => {
  const { currentPage, isLoggedIn, activeRole } = useAdmin();

  // 1. Unauthenticated state: show AuthScreen (Login/Register/OTP Reset)
  if (!isLoggedIn) {
    return (
      <>
        <AuthScreen />
        <ToastContainer />
      </>
    );
  }

  const renderView = () => {
    switch (currentPage) {
      // Admin Dashboard & Management
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

      case 'result_settings':
        return <ResultSettingsView />;

      case 'admin_lucky12_config':
        return <AdminLucky12ConfigView />;

      case 'source_code_export':
        return <SourceCodeExportView />;

      case 'profile':
        return <ProfileView />;

      // Player Panel Dedicated Views
      case 'player_wallet':
      case 'player_deposit':
      case 'player_withdrawal':
        return <PlayerWalletView />;

      case 'player_referral':
        return <PlayerReferralView />;

      case 'player_support':
        return <PlayerSupportView />;

      // Admin Panel Financial & Referral Views
      case 'admin_deposits':
      case 'admin_withdrawals':
        return <AdminDepositsView />;

      case 'admin_referrals':
        return <AdminReferralsView />;

      default:
        return activeRole === 'Player' ? <UserGamePortalView /> : <DashboardView />;
    }
  };

  // 2. Player Panel Layout
  if (activeRole === 'Player') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        <PlayerHeader />
        <div className="flex flex-1 min-w-0">
          <PlayerSidebar />
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl w-full mx-auto pl-24 lg:pl-68 transition-all">
            {renderView()}
          </main>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // 3. Admin Panel Layout
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
