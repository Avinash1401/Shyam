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

// View Renderer Component for Admin
export const AdminViewRenderer: React.FC<{ currentPage: string }> = ({ currentPage }) => {
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
    case 'result_settings':
      return <ResultSettingsView />;
    case 'admin_lucky12_config':
      return <AdminLucky12ConfigView />;
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
  const { isLoggedIn, activeRole, currentPage, mustChangeAdminPassword } = useAdmin();

  // If not logged in or role is not Admin, redirect to /admin/login
  if (!isLoggedIn || activeRole !== 'Admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-cyan-500 selection:text-slate-950 relative">
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
