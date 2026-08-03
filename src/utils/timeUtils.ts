// IST Time Utility for Automated Lottery Management System

export function getISTDate(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 5.5 * 3600000); // UTC+5:30 IST
}

export function formatISTTimeString(date: Date = getISTDate()): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${h12 < 10 ? '0' : ''}${h12}:${mStr}${ampm}`;
}

export function formatISTFullString(date: Date = getISTDate()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

export interface BettingScheduleStatus {
  isOpen: boolean;
  reason: string;
  secondsToNextEvent: number;
  nextEventLabel: string;
}

export function getBettingScheduleStatus(): BettingScheduleStatus {
  const ist = getISTDate();
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const seconds = ist.getSeconds();

  const currentSec = hours * 3600 + minutes * 60 + seconds;
  const openSec = 9 * 3600; // 09:00 AM IST (32400 sec)
  const closeSec = 22 * 3600; // 10:00 PM IST (79200 sec)

  if (currentSec < openSec) {
    // Before 9:00 AM IST
    const secsToOpen = openSec - currentSec;
    return {
      isOpen: false,
      reason: 'Betting starts daily at 09:00 AM IST',
      secondsToNextEvent: secsToOpen,
      nextEventLabel: 'Betting Opens (09:00 AM IST)',
    };
  } else if (currentSec >= closeSec) {
    // After 10:00 PM IST
    const secsToMidnight = 86400 - currentSec;
    const secsToOpen = secsToMidnight + openSec;
    return {
      isOpen: false,
      reason: 'Betting closed for today. Reopens at 09:00 AM IST',
      secondsToNextEvent: secsToOpen,
      nextEventLabel: 'Betting Opens Tomorrow (09:00 AM IST)',
    };
  } else {
    // Between 09:00 AM and 10:00 PM IST -> Open
    const secsToClose = closeSec - currentSec;
    return {
      isOpen: true,
      reason: 'Betting Active',
      secondsToNextEvent: secsToClose,
      nextEventLabel: 'Final Draw & Close (10:00 PM IST)',
    };
  }
}

export function formatCountdownHMS(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00:00';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const hh = h < 10 ? `0${h}` : `${h}`;
  const mm = m < 10 ? `0${m}` : `${m}`;
  const ss = s < 10 ? `0${s}` : `${s}`;
  return `${hh}:${mm}:${ss}`;
}
