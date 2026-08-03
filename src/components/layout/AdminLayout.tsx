import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '../common/ToastContainer';
import { ForcePasswordChangeModal } from '../auth/ForcePasswordChangeModal';

// Admin Views
import { DashboardView } from '../views/DashboardView';
import { ManagementView } from '../views/ManagementView';
import { OnlinePlayersView } from '../views/OnlinePlayersView';
import { GameHistoryView } from '../views/GameHistoryView';
import { WinPercentageView } from '../views/WinPercentageView';
import { CalculatorNoteView } from '../views/CalculatorNoteView';
import { TurnoverReportView } from '../views/TurnoverReportView';
import { CommissionReportView } from '../views/CommissionReportView';
import { LiveResultsView } from '../views/LiveResultsView';
import { WinningDeclareView } from '../views/WinningDeclareView';
import { OthersActivityView } from '../views/OthersActivityView';
import { ProfileView } from '../views/ProfileView';
import { ResultSettingsView } from '../views/ResultSettingsView';
import { AdminLucky12ConfigView } from '../views/AdminLucky12ConfigView';
import { SourceCodeExportView } from '../views/SourceCodeExportView';
import { AdminDepositsView } from '../views/AdminDepositsView';
import { AdminReferralsView } from '../views/AdminReferralsView';
import { LiveBetsDashboardView } from '../views/LiveBetsDashboardView';
import { Admin2DLotteryView } from '../views/Admin2DLotteryView';
import { AdminLucky12View } from '../views/AdminLucky12View';
import { Admin3DLotteryView } from '../views/Admin3DLotteryView';

// View Renderer Component for Admin
export const AdminViewRenderer: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  switch (currentPage) {
    case 'dashboard':
      return <DashboardView />;
    case '2d_lottery':
    case '2d_lottery_admin':
      return <Admin2DLotteryView />;
    case 'lucky12_admin':
    case 'lucky12_dashboard':
      return <AdminLucky12View />;
    case 'live_bets_dashboard':
      return <LiveBetsDashboardView />;
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
      return <WinningDeclareView />;
    case 'declare_3d':
    case '3d_lottery':
    case '3d_lottery_admin':
    case 'admin_3d':
      return <Admin3DLotteryView />;
    case 'result_settings':
      return <ResultSettingsView />;
    case 'declare_lucky12':
    case 'admin_lucky12_config':
      return <AdminLucky12View />;
    case 'source_code_export':
      return <SourceCodeExportView />;
    case 'profile':
      return <ProfileView />;
    case 'admin_deposits':
    case 'admin_withdrawals':
      return <AdminDepositsView />;
    case 'admin_referrals':
      return <AdminReferralsView />;
    default:
      return <DashboardView />;
  }
};

export const AdminLayout: React.FC = () => {
  const { isLoggedIn, userRole, isAuthLoading, currentPage, mustChangeAdminPassword } = useAdmin();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-mono text-cyan-400">Authenticating Admin Access...</p>
      </div>
    );
  }

  // Requirement: If a player opens /admin, redirect to /player/login
  if (userRole === 'player') {
    return <Navigate to="/player/login" replace />;
  }

  // Requirement: Protect every route using role-based authentication
  if (!isLoggedIn || userRole !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex font-sans selection:bg-emerald-500 selection:text-slate-950 relative">
      {/* Forced Password Change Modal for First Admin Login */}
      {mustChangeAdminPassword && <ForcePasswordChangeModal />}

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <Navbar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <AdminViewRenderer currentPage={currentPage} />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
