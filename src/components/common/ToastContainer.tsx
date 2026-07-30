import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAdmin();

  if (!toasts || toasts.length === 0) return null;

  // Requirement 8: Maximum 3 active notifications on screen
  const visibleToasts = toasts.slice(-3);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {visibleToasts.map((toast) => {
        let bgColor = 'bg-slate-900/95 border-cyan-500/50 text-cyan-200';
        let barColor = 'bg-cyan-500';
        let Icon = CheckCircle2;

        if (toast.type === 'error') {
          bgColor = 'bg-slate-900/95 border-rose-500/50 text-rose-200';
          barColor = 'bg-rose-500';
          Icon = AlertCircle;
        } else if (toast.type === 'warning') {
          bgColor = 'bg-slate-900/95 border-amber-500/50 text-amber-200';
          barColor = 'bg-amber-500';
          Icon = AlertTriangle;
        } else if (toast.type === 'info') {
          bgColor = 'bg-slate-900/95 border-blue-500/50 text-blue-200';
          barColor = 'bg-blue-500';
          Icon = Info;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-slide-in ${bgColor}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white tracking-wide">{toast.title}</h4>
                {toast.timestamp && (
                  <span className="text-[10px] text-slate-400 font-mono">{toast.timestamp}</span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.description}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Requirement 4: 5s countdown progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800/50">
              <div
                className={`h-full ${barColor} transition-all duration-[5000ms] ease-linear w-0 animate-toast-timer`}
                style={{ animation: 'toastProgress 5s linear forwards' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
