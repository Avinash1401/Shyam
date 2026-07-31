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
  const { playerSession, currentPage } = useAdmin();

  // If player session is not active, redirect strictly to /player/login
  if (!playerSession?.isLoggedIn) {
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
