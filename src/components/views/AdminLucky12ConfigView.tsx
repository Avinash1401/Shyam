import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Lucky12CardConfig } from '../../types';
import {
  Flame,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  FileJson,
  Upload,
  Download,
  Image as ImageIcon,
  Check,
  Globe,
  Sparkles,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export const AdminLucky12ConfigView: React.FC = () => {
  const {
    lucky12Cards,
    addLucky12Card,
    updateLucky12Card,
    deleteLucky12Card,
    bulkUpdateGitHubBaseUrl,
    resetLucky12CardsToDefault,
    importLucky12CardsJSON,
    addToast,
  } = useAdmin();

  // GitHub Base URL state
  const [githubRepoUrl, setGithubRepoUrl] = useState<string>(
    'https://raw.githubusercontent.com/avinashsaini1401/lucky12-assets/main/cards/'
  );

  // Editing state for cards
  const [editCardMap, setEditCardMap] = useState<Record<string, Partial<Lucky12CardConfig>>>({});

  // New Card Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCardName, setNewCardName] = useState<string>('');
  const [newCardIcon, setNewCardIcon] = useState<string>('🃏');
  const [newCardImgUrl, setNewCardImgUrl] = useState<string>('');
  const [newCardMultiplier, setNewCardMultiplier] = useState<string>('10x');

  // JSON Import Modal State
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [jsonInput, setJsonInput] = useState<string>('');

  const handleFieldChange = (id: string, field: keyof Lucky12CardConfig, value: any) => {
    setEditCardMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveCard = (card: Lucky12CardConfig) => {
    const updates = editCardMap[card.id];
    if (updates && Object.keys(updates).length > 0) {
      updateLucky12Card(card.id, updates);
      setEditCardMap((prev) => {
        const next = { ...prev };
        delete next[card.id];
        return next;
      });
    } else {
      addToast('No Changes', 'No modified fields detected for this card.', 'info');
    }
  };

  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardName.trim()) {
      addToast('Missing Name', 'Please provide a card name.', 'error');
      return;
    }

    const img = newCardImgUrl.trim()
      ? newCardImgUrl.trim()
      : `${githubRepoUrl.replace(/\/$/, '')}/card_${newCardName.toLowerCase().replace(/\s+/g, '_')}.png`;

    addLucky12Card({
      cardNo: lucky12Cards.length + 1,
      name: newCardName.trim(),
      icon: newCardIcon || '🃏',
      imageUrl: img,
      multiplier: newCardMultiplier || '10x',
      status: 'active',
    });

    setNewCardName('');
    setNewCardImgUrl('');
    setShowAddModal(false);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(lucky12Cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'lucky12_config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('JSON Exported', 'Downloaded lucky12_config.json file.');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;
    const ok = importLucky12CardsJSON(jsonInput);
    if (ok) {
      setShowImportModal(false);
      setJsonInput('');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-wide">
                Lucky 12 Cards & GitHub Asset Config
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage card images directly loaded from your GitHub repository or JSON database.
              </p>
            </div>
          </div>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={resetLucky12CardsToDefault}
            className="px-3 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-bold border border-rose-800/40 flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* GitHub Repository Bulk Link Updater Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>GitHub Repository Base Assets URL</span>
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            e.g. https://raw.githubusercontent.com/username/repository/main/cards/
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={githubRepoUrl}
              onChange={(e) => setGithubRepoUrl(e.target.value)}
              placeholder="https://raw.githubusercontent.com/your-username/your-repo/main/cards/"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={() => bulkUpdateGitHubBaseUrl(githubRepoUrl)}
            className="w-full sm:w-auto px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md whitespace-nowrap"
          >
            <Sliders className="w-4 h-4" />
            <span>Bulk Update All Card Links</span>
          </button>
        </div>
      </div>

      {/* Grid of Lucky 12 Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Active Lucky 12 Cards Grid ({lucky12Cards.length} Cards)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lucky12Cards.map((card, idx) => {
            const temp = editCardMap[card.id] || {};
            const currentName = temp.name !== undefined ? temp.name : card.name;
            const currentIcon = temp.icon !== undefined ? temp.icon : card.icon;
            const currentImg = temp.imageUrl !== undefined ? temp.imageUrl : card.imageUrl;
            const currentMult = temp.multiplier !== undefined ? temp.multiplier : card.multiplier;
            const currentStatus = temp.status !== undefined ? temp.status : card.status;
            const hasChanges = Object.keys(temp).length > 0;
            const cardKey = card.id || `lucky12-card-${card.cardNo || idx}-${idx}`;

            return (
              <div
                key={cardKey}
                className={`bg-slate-900 border rounded-3xl p-4 shadow-xl transition-all space-y-4 relative ${
                  hasChanges
                    ? 'border-amber-500/60 shadow-amber-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Card #{card.cardNo.toString().padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleFieldChange(
                          card.id,
                          'status',
                          currentStatus === 'active' ? 'disabled' : 'active'
                        )
                      }
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        currentStatus === 'active'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {currentStatus}
                    </button>
                    <button
                      onClick={() => deleteLucky12Card(card.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Live Preview Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-2 min-h-[140px] relative overflow-hidden group">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1 relative shadow-inner">
                    {currentImg ? (
                      <img
                        src={currentImg}
                        alt={currentName}
                        className="w-full h-full object-contain drop-shadow"
                        onError={(e) => {
                          // Fallback on image load error
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent && !parent.querySelector('.fallback-icon')) {
                            const fallback = document.createElement('span');
                            fallback.className = 'fallback-icon text-3xl';
                            fallback.innerText = currentIcon || '👑';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <span className="text-3xl">{currentIcon || '👑'}</span>
                    )}
                  </div>

                  <span className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                    <span>{currentIcon}</span>
                    <span>{currentName}</span>
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-bold">
                    Multiplier: {currentMult}
                  </span>
                </div>

                {/* Editable Inputs */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-medium block mb-1">
                      Card Title Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentIcon}
                        onChange={(e) => handleFieldChange(card.id, 'icon', e.target.value)}
                        className="w-10 px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-white"
                        title="Emoji / Symbol Icon"
                      />
                      <input
                        type="text"
                        value={currentName}
                        onChange={(e) => handleFieldChange(card.id, 'name', e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-medium flex items-center justify-between mb-1">
                      <span>GitHub Image URL</span>
                      {currentImg && (
                        <a
                          href={currentImg}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-0.5 text-[9px]"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </label>
                    <input
                      type="text"
                      value={currentImg}
                      onChange={(e) => handleFieldChange(card.id, 'imageUrl', e.target.value)}
                      placeholder="https://raw.githubusercontent.com/..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 font-medium block mb-1">
                        Multiplier
                      </label>
                      <input
                        type="text"
                        value={currentMult}
                        onChange={(e) => handleFieldChange(card.id, 'multiplier', e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-medium block mb-1">
                        Card Number
                      </label>
                      <input
                        type="number"
                        value={temp.cardNo !== undefined ? temp.cardNo : card.cardNo}
                        onChange={(e) =>
                          handleFieldChange(card.id, 'cardNo', parseInt(e.target.value) || 1)
                        }
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={() => handleSaveCard(card)}
                  disabled={!hasChanges}
                  className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    hasChanges
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{hasChanges ? 'Save Changes' : 'Saved'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Add Custom Lucky 12 Card
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewCard} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Card Name</label>
                <input
                  type="text"
                  required
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="e.g. Fortune Wheel"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Emoji / Symbol</label>
                  <input
                    type="text"
                    value={newCardIcon}
                    onChange={(e) => setNewCardIcon(e.target.value)}
                    placeholder="🎡"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-center text-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Multiplier</label>
                  <input
                    type="text"
                    value={newCardMultiplier}
                    onChange={(e) => setNewCardMultiplier(e.target.value)}
                    placeholder="10x"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  GitHub Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={newCardImgUrl}
                  onChange={(e) => setNewCardImgUrl(e.target.value)}
                  placeholder="https://raw.githubusercontent.com/..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-300 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  Create Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileJson className="w-5 h-5 text-purple-400" />
                Import Lucky 12 Cards JSON Config
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Paste JSON Config Array
                </label>
                <textarea
                  rows={8}
                  required
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='[{"cardNo": 1, "name": "Golden Crown", "imageUrl": "https://raw.githubusercontent.com/..."}]'
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-[11px] text-purple-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20"
                >
                  Apply JSON Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
