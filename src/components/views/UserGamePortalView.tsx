import React, { useEffect, useMemo, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

type LuckyCard = {
  id: string;
  name: string;
  image: string;
};

const cards: LuckyCard[] = [
  { id: 'football', name: 'Football', image: '/Game/Lucky_12/assets/images/football111.gif' },
  { id: 'kite', name: 'Kite', image: '/Game/Lucky_12/assets/images/kitework123.gif' },
  { id: 'cat', name: 'Cat', image: '/Game/Lucky_12/assets/images/cat1212.gif' },
  { id: 'horse', name: 'Horse', image: '/Game/Lucky_12/assets/images/horse1.gif' },
  { id: 'umbrella', name: 'Umbrella', image: '/Game/Lucky_12/assets/images/umbrela11.gif' },
  { id: 'bullet', name: 'Bullet Bike', image: '/Game/Lucky_12/assets/images/bullet121.gif' },
  { id: 'butterfly', name: 'Butterfly', image: '/Game/Lucky_12/assets/images/butterfly2121.gif' },
  { id: 'rose', name: 'Rose', image: '/Game/Lucky_12/assets/images/rose132.gif' },
  { id: 'tiger', name: 'Tiger', image: '/Game/Lucky_12/assets/images/tiger11.gif' },
  { id: 'diya', name: 'Diya', image: '/Game/Lucky_12/assets/images/dipak1231.gif' },
  { id: 'pigeon', name: 'Pigeon', image: '/Game/Lucky_12/assets/images/kabutar123.gif' },
  { id: 'rabbit', name: 'Rabbit', image: '/Game/Lucky_12/assets/images/rabit132.gif' },
];

const panelGradient =
  'bg-gradient-to-b from-[#ff6565] via-[#8e4747] to-[#3f3f3f] text-white';
const actionGradient =
  'bg-gradient-to-br from-[#39d8b4] via-[#526d86] to-[#b20075] text-white';

const formatDrawTime = (date: Date) =>
  date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const getDrawBoundary = (now: Date) => {
  const boundary = new Date(now);
  boundary.setSeconds(0, 0);
  const remainder = boundary.getMinutes() % 5;
  boundary.setMinutes(boundary.getMinutes() + (remainder === 0 && now.getSeconds() === 0 ? 0 : 5 - remainder));
  return boundary;
};

export const UserGamePortalView: React.FC = () => {
  const {
    currentUser,
    playerSession,
    users,
    liveResults,
    placeBet,
    addToast,
    setCurrentPage,
  } = useAdmin();

  const activeUser =
    playerSession?.isLoggedIn && playerSession.user
      ? playerSession.user
      : currentUser || users[0] || null;

  const [now, setNow] = useState(new Date());
  const [bets, setBets] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const currentDraw = useMemo(() => getDrawBoundary(now), [now]);
  const remainingSeconds = Math.max(0, Math.ceil((currentDraw.getTime() - now.getTime()) / 1000));
  const lastDraw = new Date(currentDraw.getTime() - 5 * 60 * 1000);

  const previousDraws = useMemo(
    () =>
      Array.from({ length: 4 }, (_, index) => ({
        time: new Date(lastDraw.getTime() - index * 5 * 60 * 1000),
        card: cards[index === 0 ? 0 : 6],
      })),
    [lastDraw.getTime()]
  );

  const luckyResults = liveResults.filter((item) => item.gameType === 'Lucky 12').slice(0, 4);
  const displayDraws = previousDraws.map((slot, index) => {
    const result = luckyResults[index]?.winningResult?.toLowerCase() || '';
    const matchedCard = cards.find(
      (card) => result.includes(card.id) || result.includes(card.name.toLowerCase())
    );
    return { ...slot, card: matchedCard || slot.card };
  });

  const selectedCards = cards.filter((card) => Number(bets[card.id] || 0) > 0);
  const totalBet = selectedCards.reduce((total, card) => total + Number(bets[card.id] || 0), 0);

  const updateBet = (cardId: string, value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 7);
    setBets((previous) => ({ ...previous, [cardId]: digitsOnly }));
  };

  const clearBets = () => setBets({});

  const submitBet = () => {
    if (!activeUser) {
      addToast('Login Required', 'Please login again before placing a bet.', 'error');
      return;
    }
    if (selectedCards.length === 0 || totalBet <= 0) {
      addToast('Enter Points', 'Enter points below at least one Lucky 12 symbol.', 'warning');
      return;
    }

    setSubmitting(true);
    const success = placeBet(
      activeUser.username,
      'Lucky 12',
      selectedCards.map((card) => card.name),
      totalBet
    );
    if (success) clearBets();
    setSubmitting(false);
  };

  const dateLabel = now
    .toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, '-');

  return (
    <div className="min-h-[calc(100vh-7rem)] overflow-x-hidden bg-[#f5f2ea] text-[#171717] shadow-2xl">
      <div className="grid grid-cols-1 gap-1 p-1 xl:grid-cols-[20%_60%_20%]">
        <section className="grid grid-cols-2 gap-1 xl:grid-cols-1">
          <div className={`${panelGradient} flex min-h-24 items-center justify-center text-center text-2xl font-black shadow-inner`}>
            {activeUser?.name || activeUser?.username || 'Player'}
          </div>
          <div className={`${panelGradient} flex min-h-16 flex-col items-center justify-center text-center font-bold shadow-inner`}>
            <span>Free Point</span>
            <span>{Math.floor(activeUser?.points || 0).toLocaleString('en-IN')}</span>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 px-1 sm:grid-cols-4">
          {displayDraws.map(({ time, card }, index) => (
            <div key={`${card.id}-${index}`} className="min-w-0">
              <div className="flex h-32 items-center justify-center rounded-xl border-[6px] border-[#9e0805] bg-[#e7e7e7] p-2 shadow-md sm:h-36">
                <img src={card.image} alt={card.name} className="h-full w-full object-contain" />
              </div>
              <div className="mx-auto mt-1 w-4/5 rounded-xl bg-gradient-to-r from-[#1d4471] to-[#446b98] py-1 text-center text-lg font-black text-white sm:text-xl">
                {formatDrawTime(time)}
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-1 text-center font-black">
          <div className={`${panelGradient} flex items-center justify-center gap-1 px-2 py-2 text-sm`}>
            <span>{dateLabel}</span>
            <span className="bg-white px-1 text-xl text-red-600">
              {now.toLocaleTimeString('en-GB')}
            </span>
          </div>
          <div className={`${panelGradient} py-1 text-sm`}>
            Last Draw :- {formatDrawTime(lastDraw)}
          </div>
          <div className={`${panelGradient} py-2 text-sm`}>
            Current Draw :- {formatDrawTime(currentDraw)}
          </div>
          <div className="border-2 border-[#777] bg-[#d4d4d4] px-2 py-2 text-base">
            Remain Time -{' '}
            <span className="text-2xl text-red-600">
              {Math.floor(remainingSeconds / 60)
                .toString()
                .padStart(2, '0')}
              :{(remainingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-2 gap-1 px-1 pb-1 text-lg md:grid-cols-5 xl:grid-cols-[20%_20%_14%_21%_25%] xl:text-xl">
        <div className="grid grid-rows-2 gap-1">
          <button className={`${actionGradient} border border-[#555] py-1`} onClick={() => setNow(new Date())}>
            Refresh
          </button>
          <button className={`${actionGradient} border border-[#555] py-1`} onClick={() => setCurrentPage('game_history')}>
            History
          </button>
        </div>
        <div className="grid grid-rows-2 gap-1">
          <button className={`${actionGradient} border border-[#555] py-1`} onClick={() => setCurrentPage('live_lucky12')}>
            Result
          </button>
          <button className={`${actionGradient} border border-[#555] py-1`} onClick={() => addToast('Advance', 'Advance booking will follow the active admin schedule.', 'info')}>
            Advance
          </button>
        </div>
        <button className={`${actionGradient} min-h-20 border border-[#555]`} onClick={clearBets}>
          Cancel
        </button>
        <div className="flex min-h-20 items-center justify-center border-2 border-[#8a8172] bg-[#fff4df] text-4xl font-black tracking-wider">
          L-12
        </div>
        <div className="grid grid-rows-2 gap-1">
          <button className="border-2 border-[#82766d] bg-gradient-to-r from-[#188337] to-[#412071] py-1 text-white" onClick={() => setCurrentPage('live_2d')}>
            2D Game
          </button>
          <button className="border-2 border-[#82766d] bg-gradient-to-r from-[#188337] to-[#412071] py-1 text-white" onClick={() => setCurrentPage('live_3d')}>
            3D Game
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t-2 border-[#9b1a16] bg-[#f0ede5] p-2 sm:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => {
          const amount = Number(bets[card.id] || 0);
          const selected = amount > 0;
          return (
            <article
              key={card.id}
              className={`flex min-h-44 flex-col items-center justify-between rounded-xl border-[6px] bg-[#e5e5e5] p-3 shadow-md transition ${
                selected ? 'border-[#0e8e33] ring-2 ring-[#56ff24]' : 'border-[#9e0805]'
              }`}
            >
              <img src={card.image} alt={card.name} title={card.name} className="h-28 w-full object-contain" />
              <input
                type="text"
                inputMode="numeric"
                aria-label={`${card.name} bet points`}
                value={bets[card.id] || ''}
                onChange={(event) => updateBet(card.id, event.target.value)}
                className={`h-12 w-4/5 rounded-full border-[3px] px-3 text-center text-lg font-black outline-none ${
                  selected
                    ? 'border-black bg-[#4dff17] shadow-[0_0_8px_#ff5a00]'
                    : 'border-black bg-white focus:bg-[#fff9cf]'
                }`}
              />
            </article>
          );
        })}
      </div>

      <div className="sticky bottom-0 flex flex-col items-center justify-between gap-3 border-t-4 border-[#8b0905] bg-[#2f2f2f] p-3 text-white sm:flex-row">
        <div className="text-center text-sm font-bold sm:text-left">
          Selected: <span className="text-[#65ff42]">{selectedCards.length}</span> &nbsp;|&nbsp; Total Points:{' '}
          <span className="text-[#65ff42]">{totalBet.toLocaleString('en-IN')}</span>
        </div>
        <button
          type="button"
          disabled={submitting || totalBet <= 0}
          onClick={submitBet}
          className="rounded-lg border-2 border-white bg-gradient-to-b from-[#66f72a] to-[#108c16] px-10 py-3 text-lg font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Please Wait...' : 'Confirm Bet'}
        </button>
      </div>
    </div>
  );
};
