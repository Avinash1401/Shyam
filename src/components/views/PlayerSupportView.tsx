import React from 'react';
import { HelpCircle, PhoneCall, MessageSquare, Send, ShieldAlert, FileText, ChevronDown } from 'lucide-react';

export const PlayerSupportView: React.FC = () => {
  const faqs = [
    {
      q: 'How do I deposit funds into my wallet?',
      a: 'Go to "Deposit Funds" page, select your preferred payment mode (UPI or Bank Transfer), complete payment to the system QR code, and enter the 12-digit UTR reference number. Deposit requests are approved within 2-5 minutes.',
    },
    {
      q: 'What is the minimum withdrawal amount?',
      a: 'The minimum withdrawal limit is ₹300. Payouts are credited directly to your registered UPI ID or Bank account.',
    },
    {
      q: 'How does the 2D Lottery & 12 Card Game result drawing work?',
      a: 'Result draws run automatically every 2-5 minutes with certified Return-to-Player (RTP) algorithms. Winners are instantly declared and credited.',
    },
    {
      q: 'Is my account and wallet points safe?',
      a: 'Yes, all account passwords and ledger transactions are protected with strict encrypted sessions and dual-layer authorization.',
    },
  ];

  return (
    <div className="space-y-6 animate-slide-in pb-12 max-w-4xl mx-auto">
      {/* Support Hero Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white">24/7 Player Customer Support</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Need help with deposits, withdrawals, or game rules? Our dedicated support team is online 24/7.
        </p>
      </div>

      {/* Support Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="https://wa.me/919999988888"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white block">WhatsApp Support</span>
          <span className="text-xs font-mono text-emerald-400">+91 99999 88888</span>
        </a>

        <a
          href="https://t.me/shyampanel_official"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Send className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white block">Telegram Channel</span>
          <span className="text-xs font-mono text-cyan-400">@shyampanel_official</span>
        </a>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <PhoneCall className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white block">24/7 Helpline</span>
          <span className="text-xs font-mono text-amber-400">1800-890-7712</span>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>Frequently Asked Questions (FAQ)</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1">
              <h3 className="text-xs font-bold text-cyan-300 flex items-center justify-between">
                <span>{f.q}</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
