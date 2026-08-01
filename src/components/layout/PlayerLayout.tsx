import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { PlayerHeader } from './PlayerHeader';
import { PlayerSidebar } from './PlayerSidebar';
import { ToastContainer } from '../common/ToastContainer';

// Player Views ONLY
import { UserGamePortalView } from '../views/UserGamePortalView';
import { PlayerWalletView } from '../views/PlayerWalletView';
import { PlayerReferralView } from '../views/PlayerReferralView';
import { PlayerSupportView } from '../views/PlayerSupportView';
import { ProfileView } from '../views/ProfileView';
import { GameHistoryView } from '../views/GameHistoryView';
import { LiveResultsView } from '../views/LiveResultsView';
import { OthersActivityView } from '../views/OthersActivityView';

// View Renderer Component for Player
export const PlayerViewRenderer: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  switch (currentPage) {
    case 'user_game_portal':
      return <UserGamePortalView />;
    case 'player_wallet':
    case 'player_deposit':
    case 'player_withdrawal':
      return <PlayerWalletView />;
    case 'game_history':
      return <GameHistoryView />;
    case 'live_2d':
      return <LiveResultsView gameType="2D Lottery" />;
    case 'live_3d':
      return <LiveResultsView gameType="3D Lottery" />;
    case 'live_lucky12':
      return <LiveResultsView gameType="Lucky 12" />;
    case 'history_transactions':
      return <OthersActivityView section="transactions" />;
    case 'player_referral':
      return <PlayerReferralView />;
    case 'player_support':
      return <PlayerSupportView />;
    case 'profile':
      return <ProfileView />;
    default:
      return <UserGamePortalView />;
  }
};

export const PlayerLayout: React.FC = () => {
  const { isLoggedIn, userRole, isAuthLoading, currentPage } = useAdmin();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-mono text-amber-400">Authenticating Player Access...</p>
      </div>
    );
  }

  // Requirement: If an admin opens /player, redirect to /admin/dashboard
  if (userRole === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Requirement: Protect every route using role-based authentication
  if (!isLoggedIn || userRole !== 'player') {
    return <Navigate to="/player/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <PlayerHeader />
      <div className="flex flex-1 min-w-0">
        <PlayerSidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl w-full mx-auto pl-20 lg:pl-64 transition-all">
          <PlayerViewRenderer currentPage={currentPage} />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
