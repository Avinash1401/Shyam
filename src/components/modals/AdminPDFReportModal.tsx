import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { generateAdminPDFReport, PDFReportFilterOptions } from '../../utils/pdfReportGenerator';
import { FileText, Download, X, Calendar, Filter, Sparkles, AlertCircle } from 'lucide-react';

interface AdminPDFReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPDFReportModal: React.FC<AdminPDFReportModalProps> = ({ isOpen, onClose }) => {
  const { gameTickets, liveResults, users, superDistributers, distributers, retailers, currentUser, addToast } = useAdmin();

  // Ensure only Admin can access PDF modal
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'SuperAdmin' || !currentUser?.role;

  const [reportType, setReportType] = useState<PDFReportFilterOptions['reportType']>('Daily');
  const [gameType, setGameType] = useState<string>('All');
  const [drawNumber, setDrawNumber] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [superDistributor, setSuperDistributor] = useState<string>('All');
  const [distributor, setDistributor] = useState<string>('All');
  const [retailer, setRetailer] = useState<string>('All');
  const [player, setPlayer] = useState<string>('All');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Access Restricted</h3>
          <p className="text-xs text-slate-400">PDF Report Generation is reserved strictly for Admin personnel.</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);

      const options: PDFReportFilterOptions = {
        reportType,
        gameType,
        drawNumber,
        selectedDate,
        startDate,
        endDate,
        superDistributor,
        distributor,
        retailer,
        player,
      };

      // Extract all raw user accounts for hierarchy mapping
      const allUsersList = [...users, ...superDistributers, ...distributers, ...retailers];

      await generateAdminPDFReport(options, gameTickets, liveResults, allUsersList);

      addToast('PDF Report Downloaded', `Generated official ${reportType} report with QR verification.`, 'success');
      onClose();
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      addToast('PDF Error', err.message || 'Failed to generate PDF report', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>Admin PDF Report Generator</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                Admin Exclusive
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate official PDF reports with QR verification code directly from live database records.
            </p>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Select Report Format</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(['Single Draw', 'Daily', 'Weekly', 'Monthly', 'Custom Date Range'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setReportType(type)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                  reportType === type
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          {/* Game Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Game Category</label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Games (3D, 2D, Lucky 12)</option>
              <option value="2D Lottery">2D Lottery</option>
              <option value="3D Lottery">3D Lottery</option>
              <option value="Lucky 12">Lucky 12</option>
            </select>
          </div>

          {/* Draw Number Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Draw Number / Draw Time (Optional)</label>
            <input
              type="text"
              placeholder="e.g. DRAW-101 or 12:15PM"
              value={drawNumber}
              onChange={(e) => setDrawNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Single Date / Range Selector */}
          {(reportType === 'Daily' || reportType === 'Single Draw') && (
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-400">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {reportType === 'Custom Date Range' && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </>
          )}

          {/* Super Distributor Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Super Distributor Network</label>
            <select
              value={superDistributor}
              onChange={(e) => setSuperDistributor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Super Distributors</option>
              {superDistributers.map((sd) => (
                <option key={sd.id} value={sd.username}>
                  {sd.name} ({sd.username})
                </option>
              ))}
            </select>
          </div>

          {/* Distributor Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Distributor Network</label>
            <select
              value={distributor}
              onChange={(e) => setDistributor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Distributors</option>
              {distributers.map((d) => (
                <option key={d.id} value={d.username}>
                  {d.name} ({d.username})
                </option>
              ))}
            </select>
          </div>

          {/* Retailer Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Retailer Agent</label>
            <select
              value={retailer}
              onChange={(e) => setRetailer(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Retailers</option>
              {retailers.map((r) => (
                <option key={r.id} value={r.username}>
                  {r.name} ({r.username})
                </option>
              ))}
            </select>
          </div>

          {/* Player Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Specific Player ID</label>
            <select
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Players</option>
              {users.map((u) => (
                <option key={u.id} value={u.username}>
                  {u.name} ({u.username})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <span>Generating PDF...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Official PDF Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
