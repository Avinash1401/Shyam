import React, { useEffect, useMemo, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  BarChart3,
  CalendarDays,
  Clock,
  Edit3,
  Grid3X3,
  Plus,
  Radio,
  Save,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';

interface LiveResultsViewProps {
  gameType: '2D Lottery' | '3D Lottery' | 'Lucky 12';
}

interface TwoDDraw {
  id: string;
  drawDate: string;
  drawTime: string;
  results: string[];
  status: 'Published' | 'Draft';
}

const INITIAL_2D_RESULTS: TwoDDraw[] = [{"id":"2d-old-1","drawDate":"2026-07-31","drawTime":"06:00PM","results":["1091","1121","1286","1368","1412","1544","1676","1739","1810","1942","3085","3101","3212","3326","3484","3502","3632","3775","3809","3998","5051","5174","5265","5331","5411","5575","5612","5717","5815","5907"],"status":"Published"},{"id":"2d-old-2","drawDate":"2026-07-31","drawTime":"05:45PM","results":["1047","1120","1251","1356","1423","1575","1618","1732","1847","1934","3066","3170","3227","3337","3486","3536","3607","3750","3831","3919","5075","5135","5214","5348","5477","5573","5674","5795","5859","5982"],"status":"Published"},{"id":"2d-old-3","drawDate":"2026-07-31","drawTime":"05:30PM","results":["1093","1106","1237","1387","1427","1527","1621","1743","1879","1916","3027","3101","3247","3306","3434","3513","3645","3704","3837","3994","5010","5137","5201","5342","5491","5535","5693","5729","5847","5910"],"status":"Published"},{"id":"2d-old-4","drawDate":"2026-07-31","drawTime":"05:15PM","results":["1086","1189","1263","1348","1445","1520","1691","1738","1854","1933","3010","3110","3202","3308","3486","3517","3612","3799","3844","3950","5073","5168","5222","5363","5487","5503","5612","5718","5873","5983"],"status":"Published"},{"id":"2d-old-5","drawDate":"2026-07-31","drawTime":"05:00PM","results":["1032","1198","1227","1358","1459","1503","1600","1745","1830","1914","3000","3168","3288","3380","3432","3522","3661","3746","3847","3909","5032","5144","5225","5351","5424","5515","5603","5775","5870","5965"],"status":"Published"},{"id":"2d-old-6","drawDate":"2026-07-31","drawTime":"04:45PM","results":["1088","1151","1291","1381","1485","1560","1616","1700","1839","1938","3074","3195","3232","3387","3418","3571","3625","3798","3821","3938","5099","5150","5246","5354","5478","5556","5666","5724","5849","5977"],"status":"Published"},{"id":"2d-old-7","drawDate":"2026-07-31","drawTime":"04:30PM","results":["1041","1126","1288","1316","1403","1535","1604","1721","1820","1901","3044","3161","3202","3339","3462","3526","3651","3772","3806","3915","5005","5162","5208","5310","5482","5515","5639","5788","5841","5956"],"status":"Published"},{"id":"2d-old-8","drawDate":"2026-07-31","drawTime":"04:15PM","results":["1027","1177","1225","1391","1431","1529","1689","1755","1898","1910","3002","3125","3276","3364","3438","3510","3617","3704","3815","3944","5015","5148","5242","5385","5423","5510","5618","5784","5874","5914"],"status":"Published"},{"id":"2d-old-9","drawDate":"2026-07-31","drawTime":"04:00PM","results":["1082","1110","1250","1322","1494","1566","1634","1713","1852","1993","3068","3157","3207","3383","3448","3563","3601","3716","3871","3968","5076","5113","5260","5370","5406","5507","5641","5735","5890","5952"],"status":"Published"},{"id":"2d-old-10","drawDate":"2026-07-31","drawTime":"03:45PM","results":["1041","1177","1263","1345","1409","1553","1647","1781","1875","1971","3097","3133","3264","3382","3428","3566","3618","3719","3820","3981","5043","5154","5239","5357","5453","5506","5664","5741","5813","5976"],"status":"Published"},{"id":"2d-old-11","drawDate":"2026-07-31","drawTime":"03:30PM","results":["1083","1167","1266","1323","1403","1564","1699","1736","1879","1904","3095","3128","3287","3312","3419","3517","3671","3786","3853","3985","5019","5140","5214","5324","5491","5542","5625","5702","5889","5905"],"status":"Published"},{"id":"2d-old-12","drawDate":"2026-07-31","drawTime":"03:15PM","results":["1057","1104","1290","1361","1460","1580","1615","1794","1870","1939","3021","3148","3290","3335","3479","3567","3601","3799","3893","3922","5094","5103","5295","5372","5460","5518","5643","5740","5843","5903"],"status":"Published"},{"id":"2d-old-13","drawDate":"2026-07-31","drawTime":"03:00PM","results":["1008","1156","1257","1302","1494","1582","1602","1782","1826","1945","3039","3106","3211","3317","3408","3522","3667","3722","3895","3953","5034","5179","5285","5322","5423","5589","5670","5740","5865","5927"],"status":"Published"},{"id":"2d-old-14","drawDate":"2026-07-31","drawTime":"02:45PM","results":["1045","1137","1242","1359","1468","1501","1616","1787","1800","1999","3091","3122","3246","3387","3469","3593","3631","3742","3838","3904","5071","5162","5279","5325","5460","5572","5688","5729","5875","5976"],"status":"Published"},{"id":"2d-old-15","drawDate":"2026-07-31","drawTime":"02:30PM","results":["1072","1151","1283","1333","1499","1542","1696","1744","1868","1906","3043","3186","3219","3335","3419","3592","3612","3787","3818","3958","5040","5127","5251","5379","5453","5549","5665","5768","5861","5962"],"status":"Published"},{"id":"2d-old-16","drawDate":"2026-07-31","drawTime":"02:15PM","results":["1049","1168","1278","1395","1402","1572","1626","1745","1847","1982","3025","3110","3214","3332","3433","3537","3610","3721","3816","3945","5059","5179","5291","5304","5475","5528","5646","5789","5875","5978"],"status":"Published"},{"id":"2d-old-17","drawDate":"2026-07-31","drawTime":"02:00PM","results":["1079","1155","1244","1321","1452","1536","1609","1780","1879","1947","3095","3131","3216","3352","3479","3510","3661","3703","3830","3972","5067","5117","5236","5365","5498","5505","5675","5786","5898","5915"],"status":"Published"},{"id":"2d-old-18","drawDate":"2026-07-31","drawTime":"01:45PM","results":["1091","1194","1285","1353","1453","1505","1684","1707","1860","1962","3059","3123","3299","3358","3492","3563","3698","3727","3838","3978","5023","5162","5250","5367","5438","5530","5606","5708","5893","5954"],"status":"Published"},{"id":"2d-old-19","drawDate":"2026-07-31","drawTime":"01:30PM","results":["1037","1123","1276","1371","1449","1568","1651","1719","1873","1954","3043","3174","3212","3324","3473","3535","3622","3755","3802","3988","5054","5182","5289","5357","5411","5572","5694","5756","5891","5978"],"status":"Published"},{"id":"2d-old-20","drawDate":"2026-07-31","drawTime":"01:15PM","results":["1097","1148","1200","1352","1467","1562","1601","1704","1828","1933","3072","3193","3215","3307","3497","3599","3669","3706","3827","3999","5018","5106","5250","5392","5446","5528","5670","5749","5870","5936"],"status":"Published"},{"id":"2d-old-21","drawDate":"2026-07-31","drawTime":"01:00PM","results":["1004","1147","1219","1363","1491","1562","1601","1768","1844","1922","3012","3132","3245","3355","3491","3516","3656","3757","3802","3997","5080","5167","5269","5321","5447","5519","5617","5732","5851","5933"],"status":"Published"},{"id":"2d-old-22","drawDate":"2026-07-31","drawTime":"12:45PM","results":["1061","1156","1208","1355","1460","1525","1631","1757","1814","1964","3006","3119","3250","3374","3452","3521","3696","3773","3877","3965","5054","5163","5275","5305","5435","5564","5624","5777","5825","5942"],"status":"Published"},{"id":"2d-old-23","drawDate":"2026-07-31","drawTime":"12:30PM","results":["1074","1134","1296","1304","1433","1522","1676","1781","1828","1994","3043","3198","3240","3381","3408","3537","3624","3744","3805","3930","5053","5155","5257","5322","5425","5503","5635","5766","5825","5944"],"status":"Published"},{"id":"2d-old-24","drawDate":"2026-07-31","drawTime":"12:15PM","results":["1027","1177","1241","1339","1469","1577","1627","1715","1851","1973","3086","3139","3202","3394","3445","3575","3623","3710","3845","3985","5094","5175","5272","5314","5447","5513","5614","5703","5890","5912"],"status":"Published"},{"id":"2d-old-25","drawDate":"2026-07-31","drawTime":"12:00PM","results":["1077","1135","1232","1341","1401","1558","1672","1781","1863","1905","3080","3101","3209","3388","3468","3528","3655","3701","3899","3976","5075","5188","5258","5353","5487","5539","5603","5779","5882","5914"],"status":"Published"},{"id":"2d-old-26","drawDate":"2026-07-31","drawTime":"11:45AM","results":["1020","1195","1237","1385","1477","1509","1650","1721","1865","1933","3044","3197","3241","3397","3416","3587","3679","3750","3802","3920","5005","5132","5269","5387","5460","5535","5608","5794","5811","5945"],"status":"Published"},{"id":"2d-old-27","drawDate":"2026-07-31","drawTime":"11:30AM","results":["1033","1184","1272","1362","1443","1578","1667","1780","1893","1917","3067","3137","3262","3313","3416","3553","3603","3768","3897","3942","5099","5120","5282","5380","5448","5575","5624","5764","5824","5925"],"status":"Published"},{"id":"2d-old-28","drawDate":"2026-07-31","drawTime":"11:15AM","results":["1074","1110","1222","1329","1435","1541","1691","1737","1800","1932","3037","3174","3251","3348","3496","3573","3687","3789","3893","3919","5033","5139","5270","5373","5439","5503","5602","5763","5850","5954"],"status":"Published"},{"id":"2d-old-29","drawDate":"2026-07-31","drawTime":"11:00AM","results":["1001","1176","1228","1380","1475","1528","1635","1746","1889","1940","3032","3149","3231","3331","3477","3561","3681","3770","3826","3945","5040","5197","5253","5332","5479","5583","5628","5717","5833","5950"],"status":"Published"},{"id":"2d-old-30","drawDate":"2026-07-31","drawTime":"10:45AM","results":["1024","1197","1292","1354","1401","1567","1600","1748","1857","1901","3011","3157","3229","3316","3477","3535","3627","3753","3859","3925","5020","5155","5284","5367","5482","5561","5607","5773","5853","5993"],"status":"Published"},{"id":"2d-old-31","drawDate":"2026-07-31","drawTime":"10:30AM","results":["1095","1184","1287","1300","1450","1501","1686","1776","1833","1946","3082","3141","3280","3350","3481","3523","3640","3761","3878","3993","5016","5168","5284","5318","5433","5539","5694","5730","5813","5923"],"status":"Published"},{"id":"2d-old-32","drawDate":"2026-07-31","drawTime":"10:15AM","results":["1068","1199","1222","1368","1496","1515","1682","1788","1850","1962","3055","3160","3266","3368","3434","3579","3676","3720","3833","3972","5059","5186","5234","5303","5499","5527","5601","5733","5886","5995"],"status":"Published"},{"id":"2d-old-33","drawDate":"2026-07-31","drawTime":"10:00AM","results":["1082","1131","1205","1317","1467","1513","1652","1706","1872","1922","3033","3103","3246","3319","3461","3586","3666","3755","3896","3920","5092","5146","5240","5396","5456","5561","5671","5786","5802","5938"],"status":"Published"},{"id":"2d-old-34","drawDate":"2026-07-31","drawTime":"09:45AM","results":["1076","1180","1252","1371","1426","1503","1626","1763","1813","1973","3052","3119","3279","3395","3441","3597","3682","3761","3854","3980","5098","5129","5269","5353","5463","5565","5642","5740","5878","5926"],"status":"Published"},{"id":"2d-old-35","drawDate":"2026-07-31","drawTime":"09:30AM","results":["1079","1126","1230","1325","1434","1536","1624","1781","1858","1938","3027","3136","3284","3391","3418","3595","3653","3732","3897","3972","5059","5118","5268","5327","5490","5567","5654","5792","5849","5957"],"status":"Published"},{"id":"2d-old-36","drawDate":"2026-07-31","drawTime":"09:15AM","results":["1034","1125","1275","1338","1424","1545","1692","1711","1855","1995","3032","3192","3246","3383","3453","3549","3628","3787","3815","3915","5061","5191","5250","5370","5465","5586","5697","5705","5835","5996"],"status":"Published"},{"id":"2d-old-37","drawDate":"2026-07-31","drawTime":"09:00AM","results":["1091","1136","1224","1362","1448","1503","1634","1781","1830","1967","3073","3147","3219","3316","3440","3536","3624","3782","3832","3936","5009","5120","5285","5382","5415","5560","5653","5720","5893","5902"],"status":"Published"}];

const parseNumbers = (value: string) =>
  value.split(/[\s,;|]+/).map((item) => item.trim()).filter(Boolean);

const timeToMinutes = (value: string) => {
  const match = value.toUpperCase().match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
  if (!match) {
    const [hour = '0', minute = '0'] = value.split(':');
    return Number(hour) * 60 + Number(minute);
  }
  let hour = Number(match[1]) % 12;
  if (match[3] === 'PM') hour += 12;
  return hour * 60 + Number(match[2]);
};

const toTimeInput = (value: string) => {
  const match = value.toUpperCase().match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
  if (!match) return value.slice(0, 5);
  let hour = Number(match[1]) % 12;
  if (match[3] === 'PM') hour += 12;
  return `${String(hour).padStart(2, '0')}:${match[2]}`;
};

const toDisplayTime = (value: string) => {
  if (/AM$|PM$/i.test(value)) return value.toUpperCase();
  const [hourText = '0', minute = '00'] = value.split(':');
  const hour = Number(hourText);
  return `${String(hour % 12 || 12).padStart(2, '0')}:${minute}${hour >= 12 ? 'PM' : 'AM'}`;
};

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const TwoDResultBoard: React.FC = () => {
  const { addToast } = useAdmin();
  const adminMode = window.location.pathname.startsWith('/admin');
  const [draws, setDraws] = useState<TwoDDraw[]>(() => {
    try {
      const saved = localStorage.getItem('shyam_2d_result_board_single');
      return saved ? JSON.parse(saved) : INITIAL_2D_RESULTS;
    } catch {
      return INITIAL_2D_RESULTS;
    }
  });
  const [selectedDate, setSelectedDate] = useState(INITIAL_2D_RESULTS[0]?.drawDate || new Date().toISOString().slice(0, 10));
  const [chartMode, setChartMode] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formTime, setFormTime] = useState('18:00');
  const [formNumbers, setFormNumbers] = useState('');
  const [formStatus, setFormStatus] = useState<'Published' | 'Draft'>('Published');

  useEffect(() => {
    localStorage.setItem('shyam_2d_result_board_single', JSON.stringify(draws));
  }, [draws]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === 'shyam_2d_result_board_single' && event.newValue) {
        try { setDraws(JSON.parse(event.newValue)); } catch { /* keep current */ }
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const dates = useMemo<string[]>(
    () => Array.from(new Set<string>(draws.map((draw) => draw.drawDate))).sort((a, b) => b.localeCompare(a)),
    [draws]
  );
  const visibleDraws = useMemo(
    () => draws
      .filter((draw) => draw.drawDate === selectedDate)
      .filter((draw) => adminMode || draw.status === 'Published')
      .sort((a, b) => timeToMinutes(b.drawTime) - timeToMinutes(a.drawTime)),
    [adminMode, draws, selectedDate]
  );
  const chartData = useMemo(() => {
    const counts = Array.from({ length: 10 }, (_, digit) => ({ digit, count: 0 }));
    visibleDraws.forEach((draw) => draw.results.forEach((result) => {
      const digit = Number(result.charAt(0));
      if (digit >= 0 && digit <= 9) counts[digit].count += 1;
    }));
    const max = Math.max(1, ...counts.map((item) => item.count));
    return counts.map((item) => ({ ...item, width: `${(item.count / max) * 100}%` }));
  }, [visibleDraws]);

  const resetForm = () => {
    setEditingId(null);
    setFormDate(selectedDate);
    setFormTime('18:00');
    setFormNumbers('');
    setFormStatus('Published');
  };

  const addNew = () => {
    resetForm();
    setEditorOpen(true);
  };

  const editDraw = (draw: TwoDDraw) => {
    setEditingId(draw.id);
    setFormDate(draw.drawDate);
    setFormTime(toTimeInput(draw.drawTime));
    setFormNumbers(draw.results.join(', '));
    setFormStatus(draw.status);
    setEditorOpen(true);
  };

  const saveDraw = (event: React.FormEvent) => {
    event.preventDefault();
    const results = parseNumbers(formNumbers);
    if (results.length !== 30) {
      addToast('30 Results Required', `Entered ${results.length}. Exactly 30 values are required.`, 'error');
      return;
    }
    if (results.some((value) => !/^\d{4}$/.test(value))) {
      addToast('Invalid Result', 'Every result must contain exactly four digits.', 'error');
      return;
    }
    const payload = {
      drawDate: formDate,
      drawTime: toDisplayTime(formTime),
      results,
      status: formStatus,
    };
    if (editingId) {
      setDraws((previous) => previous.map((draw) => draw.id === editingId ? { ...draw, ...payload } : draw));
      addToast('2D Result Updated', 'Draw changes saved successfully.', 'success');
    } else {
      const duplicate = draws.some((draw) => draw.drawDate === payload.drawDate && draw.drawTime === payload.drawTime);
      if (duplicate) {
        addToast('Duplicate Draw', 'This date and time already has a result.', 'warning');
        return;
      }
      setDraws((previous) => [{ id: `2d-${Date.now()}`, ...payload }, ...previous]);
      addToast('2D Result Published', 'New 30-number result board added.', 'success');
    }
    setSelectedDate(formDate);
    setEditorOpen(false);
    resetForm();
  };

  const removeDraw = (draw: TwoDDraw) => {
    if (window.confirm(`Delete result ${draw.drawDate} ${draw.drawTime}?`)) {
      setDraws((previous) => previous.filter((item) => item.id !== draw.id));
      addToast('2D Result Deleted', 'Selected draw removed.', 'warning');
    }
  };

  const resetOldResults = () => {
    if (window.confirm('Restore the 37 migrated old 2D draws?')) {
      setDraws(INITIAL_2D_RESULTS);
      setSelectedDate(INITIAL_2D_RESULTS[0].drawDate);
      addToast('Old Results Restored', '37 draws and 1,110 values restored.', 'success');
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 p-5 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-3 text-purple-300"><Grid3X3 className="h-6 w-6" /></div>
            <div><h1 className="text-xl font-black text-white">2D Amusement Result Board</h1><p className="mt-1 text-xs text-slate-400">15-minute history · 30 four-digit values in every draw</p></div>
          </div>
          {adminMode && <div className="flex flex-wrap gap-2"><button onClick={addNew} className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-black text-white hover:bg-purple-500"><Plus className="h-4 w-4" /> Add Result</button><button onClick={resetOldResults} className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-bold text-cyan-300 hover:border-cyan-500">Restore Old Results</button></div>}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Result Date<select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="mt-1 block min-w-52 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold normal-case text-white outline-none focus:border-purple-500">{dates.map((date) => <option key={date} value={date}>{formatDate(date)}</option>)}</select></label>
        <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1"><button onClick={() => setChartMode(false)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${!chartMode ? 'bg-purple-600 text-white' : 'text-slate-400'}`}><Grid3X3 className="h-4 w-4" /> Board</button><button onClick={() => setChartMode(true)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${chartMode ? 'bg-purple-600 text-white' : 'text-slate-400'}`}><BarChart3 className="h-4 w-4" /> Chart</button></div>
      </div>

      {chartMode ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><h2 className="mb-4 text-sm font-black text-white">Leading Digit Frequency</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-5">{chartData.map((item) => <div key={item.digit} className="rounded-xl border border-slate-800 bg-slate-950 p-3"><div className="mb-2 flex justify-between"><span className="font-mono text-lg font-black text-purple-300">{item.digit}</span><span className="text-xs font-bold text-slate-400">{item.count}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-400" style={{ width: item.width }} /></div></div>)}</div></div>
      ) : (
        <div className="space-y-4">{visibleDraws.map((draw) => <article key={draw.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl"><header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-gradient-to-r from-purple-950/80 to-slate-950 px-4 py-3"><div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 text-sm font-black text-white"><CalendarDays className="h-4 w-4 text-purple-400" />{formatDate(draw.drawDate)}</span><span className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 font-mono text-xs font-black text-purple-300"><Clock className="h-3.5 w-3.5" />{draw.drawTime}</span>{adminMode && <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${draw.status === 'Published' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/30 bg-amber-500/10 text-amber-400'}`}>{draw.status}</span>}</div>{adminMode && <div className="flex gap-2"><button onClick={() => editDraw(draw)} className="rounded-lg border border-slate-700 p-2 text-cyan-400"><Edit3 className="h-4 w-4" /></button><button onClick={() => removeDraw(draw)} className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2 text-rose-400"><Trash2 className="h-4 w-4" /></button></div>}</header><div className="grid grid-cols-5 gap-px bg-slate-800 md:grid-cols-10">{draw.results.map((result, index) => <div key={`${draw.id}-${index}`} className="bg-slate-950 px-2 py-3 text-center font-mono text-sm font-black tracking-wider text-cyan-300 hover:bg-purple-950/50">{result}</div>)}</div></article>)}</div>
      )}

      {editorOpen && adminMode && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-purple-500/30 bg-slate-900 p-6 shadow-2xl"><div className="mb-5 flex justify-between"><div><h2 className="text-lg font-black text-white">{editingId ? 'Edit 2D Result' : 'Add 2D Result'}</h2><p className="mt-1 text-xs text-slate-500">Enter exactly 30 four-digit values.</p></div><button onClick={() => setEditorOpen(false)} className="text-slate-400"><X className="h-5 w-5" /></button></div><form onSubmit={saveDraw} className="space-y-4"><div className="grid gap-3 sm:grid-cols-3"><label className="text-xs font-bold text-slate-300">Date<input required type="date" value={formDate} onChange={(event) => setFormDate(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" /></label><label className="text-xs font-bold text-slate-300">Time<input required type="time" value={formTime} onChange={(event) => setFormTime(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" /></label><label className="text-xs font-bold text-slate-300">Status<select value={formStatus} onChange={(event) => setFormStatus(event.target.value as 'Published' | 'Draft')} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white"><option>Published</option><option>Draft</option></select></label></div><label className="block text-xs font-bold text-slate-300">30 Results<textarea required rows={10} value={formNumbers} onChange={(event) => setFormNumbers(event.target.value)} placeholder="1091, 1121, 1286, ..." className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-sm leading-7 text-cyan-300 outline-none focus:border-purple-500" /></label><div className="flex justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs"><span className="text-slate-500">Numbers entered</span><span className={`font-black ${parseNumbers(formNumbers).length === 30 ? 'text-emerald-400' : 'text-amber-400'}`}>{parseNumbers(formNumbers).length} / 30</span></div><div className="flex justify-end gap-2 border-t border-slate-800 pt-4"><button type="button" onClick={() => setEditorOpen(false)} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300">Cancel</button><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2 text-xs font-black text-white"><Save className="h-4 w-4" /> Save Result</button></div></form></div></div>}
    </div>
  );
};

const StandardLiveResults: React.FC<LiveResultsViewProps> = ({ gameType }) => {
  const { liveResults } = useAdmin();
  const [secondsLeft, setSecondsLeft] = useState(142);

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((previous) => previous > 0 ? previous - 1 : 180), 1000);
    return () => clearInterval(timer);
  }, []);

  const timerText = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const gameResults = liveResults.filter((result) => result.gameType === gameType);

  return <div className="space-y-6 animate-fade-in"><div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="rounded-2xl border border-cyan-800/60 bg-cyan-950/80 p-3 text-cyan-400"><Radio className="h-6 w-6 animate-pulse" /></div><div><h1 className="text-xl font-bold text-white">{gameType} Live Result Stream</h1><p className="mt-0.5 text-xs text-slate-400">Live draw result history and upcoming draw countdown.</p></div></div></div><div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-6 md:flex-row"><div><span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs font-semibold text-cyan-400"><Clock className="h-3.5 w-3.5" />Next Scheduled Live Draw</span><h2 className="mt-2 text-2xl font-black text-white">{gameType}</h2></div><div className="rounded-xl border border-cyan-800/60 bg-cyan-950/60 px-4 py-2 font-mono text-3xl font-black tracking-widest text-cyan-400">{timerText}</div></div><div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5"><h3 className="flex items-center gap-2 text-base font-bold text-white"><Trophy className="h-5 w-5 text-amber-400" />Declared Results History</h3><div className="grid grid-cols-1 gap-4 md:grid-cols-3">{gameResults.map((result) => <div key={result.id} className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4"><div className="flex justify-between"><span className="text-xs font-bold text-slate-400">{result.drawNumber}</span><span className="font-mono text-[10px] text-slate-500">{result.drawTime}</span></div><div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center"><span className="block text-[10px] font-bold uppercase text-slate-500">Winning Number</span><span className="font-mono text-2xl font-black text-amber-400">{result.winningResult}</span></div></div>)}</div></div></div>;
};

export const LiveResultsView: React.FC<LiveResultsViewProps> = ({ gameType }) =>
  gameType === '2D Lottery' ? <TwoDResultBoard /> : <StandardLiveResults gameType={gameType} />;
