import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { GameTicket, LiveResultDraw, UserAccount } from '../types';
import { formatISTFullString } from './timeUtils';

export interface PDFReportFilterOptions {
  reportType: 'Single Draw' | 'Daily' | 'Weekly' | 'Monthly' | 'Custom Date Range';
  gameType?: string; // 'All' | '2D Lottery' | '3D Lottery' | 'Lucky 12' | '12 Card'
  drawNumber?: string;
  selectedDate?: string; // YYYY-MM-DD
  startDate?: string;    // YYYY-MM-DD
  endDate?: string;      // YYYY-MM-DD
  superDistributor?: string;
  distributor?: string;
  retailer?: string;
  player?: string;
}

export async function generateAdminPDFReport(
  options: PDFReportFilterOptions,
  rawBets: GameTicket[],
  liveResults: LiveResultDraw[],
  allUsers: UserAccount[]
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Map users to lookup parents
  const userMap = new Map<string, UserAccount>();
  allUsers.forEach((u) => {
    userMap.set((u.username || u.id || '').toLowerCase().trim(), u);
  });

  // Helper to trace hierarchy for a player
  const getHierarchyNames = (playerUsername: string) => {
    const cleanPlayer = playerUsername.toLowerCase().trim();
    const playerAcc = userMap.get(cleanPlayer);

    let retailer = '-';
    let distributor = '-';
    let superDistributor = '-';

    if (playerAcc) {
      let currentParent = playerAcc.parentName ? userMap.get(playerAcc.parentName.toLowerCase().trim()) : null;
      
      while (currentParent) {
        if (currentParent.role === 'Retailer' && retailer === '-') {
          retailer = currentParent.name || currentParent.username;
        } else if (currentParent.role === 'Distributer' && distributor === '-') {
          distributor = currentParent.name || currentParent.username;
        } else if (currentParent.role === 'SuperDistributer' && superDistributor === '-') {
          superDistributor = currentParent.name || currentParent.username;
        }
        
        if (currentParent.parentName) {
          currentParent = userMap.get(currentParent.parentName.toLowerCase().trim()) || null;
        } else {
          break;
        }
      }
    }

    return { retailer, distributor, superDistributor };
  };

  // Filter Bets according to options
  let filteredBets = [...rawBets];

  // Game Filter
  if (options.gameType && options.gameType !== 'All') {
    filteredBets = filteredBets.filter((b) => b.gameType === options.gameType);
  }

  // Draw Number Filter
  if (options.drawNumber && options.drawNumber.trim() !== '') {
    filteredBets = filteredBets.filter((b) => b.drawTime.includes(options.drawNumber!) || (b.roundId && b.roundId.includes(options.drawNumber!)));
  }

  // Date Filters
  if (options.reportType === 'Daily' || options.reportType === 'Single Draw') {
    if (options.selectedDate) {
      filteredBets = filteredBets.filter((b) => b.createdAt.startsWith(options.selectedDate!));
    }
  } else if (options.reportType === 'Custom Date Range') {
    if (options.startDate) {
      filteredBets = filteredBets.filter((b) => b.createdAt >= options.startDate!);
    }
    if (options.endDate) {
      filteredBets = filteredBets.filter((b) => b.createdAt <= `${options.endDate!} 23:59:59`);
    }
  } else if (options.reportType === 'Weekly') {
    const nowMs = Date.now();
    const sevenDaysAgo = new Date(nowMs - 7 * 86400 * 1000).toISOString().split('T')[0];
    filteredBets = filteredBets.filter((b) => b.createdAt >= sevenDaysAgo);
  } else if (options.reportType === 'Monthly') {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400 * 1000).toISOString().split('T')[0];
    filteredBets = filteredBets.filter((b) => b.createdAt >= thirtyDaysAgo);
  }

  // User hierarchy filters
  if (options.player && options.player !== 'All') {
    filteredBets = filteredBets.filter((b) => b.username.toLowerCase() === options.player!.toLowerCase());
  }
  if (options.retailer && options.retailer !== 'All') {
    filteredBets = filteredBets.filter((b) => {
      const h = getHierarchyNames(b.username);
      return h.retailer.toLowerCase().includes(options.retailer!.toLowerCase()) || b.parentName.toLowerCase() === options.retailer!.toLowerCase();
    });
  }
  if (options.distributor && options.distributor !== 'All') {
    filteredBets = filteredBets.filter((b) => {
      const h = getHierarchyNames(b.username);
      return h.distributor.toLowerCase().includes(options.distributor!.toLowerCase());
    });
  }
  if (options.superDistributor && options.superDistributor !== 'All') {
    filteredBets = filteredBets.filter((b) => {
      const h = getHierarchyNames(b.username);
      return h.superDistributor.toLowerCase().includes(options.superDistributor!.toLowerCase());
    });
  }

  // Aggregate Metrics
  const totalBetsCount = filteredBets.length;
  const totalCollection = filteredBets.reduce((acc, b) => acc + (b.betAmount || 0), 0);
  const totalWinningAmount = filteredBets.reduce((acc, b) => acc + (b.winAmount || 0), 0);
  const totalPayout = totalWinningAmount;
  const profitLoss = totalCollection - totalPayout;

  // Draw Result Details if Single Draw
  let winningResultText = 'N/A';
  if (options.reportType === 'Single Draw') {
    const matchingDraw = liveResults.find(
      (r) =>
        (!options.gameType || options.gameType === 'All' || r.gameType === options.gameType) &&
        (options.drawNumber ? r.drawNumber === options.drawNumber || r.drawTime === options.drawNumber : true)
    );
    if (matchingDraw) {
      winningResultText = matchingDraw.winningResult || 'Declared';
    } else if (filteredBets.length > 0 && filteredBets[0].status === 'Won') {
      winningResultText = filteredBets[0].selectedNumbers.join(', ');
    }
  }

  // Report Identifiers
  const genTimestampStr = formatISTFullString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const reportId = `RPT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${randomSuffix}`;

  // Generate QR Code Data URL
  const qrDataText = `VERIFIED OFFICIAL LOTTERY REPORT\nReport ID: ${reportId}\nType: ${options.reportType}\nGenerated (IST): ${genTimestampStr}\nTotal Collection: INR ${totalCollection}\nNet House Profit: INR ${profitLoss}`;
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(qrDataText, { margin: 1, width: 100 });
  } catch (err) {
    console.error('Error generating QR code for PDF:', err);
  }

  // --- PDF RENDERING ---

  // Header Banner Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 36, 'F');

  // Accent Line
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 36, 210, 1.5, 'F');

  // Title & Logo Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SHYAM PANEL LOTTERY SYSTEM', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('AUTOMATED OFFICIAL AUDIT & TURNOVER REPORT', 14, 22);
  doc.text(`REPORT TYPE: ${options.reportType.toUpperCase()} | TIMEZONE: IST (UTC+05:30)`, 14, 28);

  // Add QR Code at Top Right
  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, 'PNG', 170, 4, 28, 28);
  }

  // Report Metadata Grid
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(14, 42, 182, 28, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 42, 182, 28, 3, 3, 'D');

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  // Col 1
  doc.setFont('helvetica', 'bold');
  doc.text('Report ID:', 18, 48);
  doc.text('Generated At (IST):', 18, 54);
  doc.text('Game Category:', 18, 60);
  doc.text('Draw Number / Date:', 18, 66);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(reportId, 55, 48);
  doc.text(genTimestampStr, 55, 54);
  doc.text(options.gameType || 'All Games', 55, 60);
  doc.text(options.drawNumber || options.selectedDate || options.startDate || 'All Draws', 55, 66);

  // Col 2
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Total Bets Count:', 110, 48);
  doc.text('Total Collection:', 110, 54);
  doc.text('Total Payouts:', 110, 60);
  doc.text('Net House Profit/Loss:', 110, 66);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${totalBetsCount} Tickets`, 148, 48);
  doc.text(`INR ${totalCollection.toLocaleString('en-IN')}`, 148, 54);
  doc.text(`INR ${totalPayout.toLocaleString('en-IN')}`, 148, 60);

  // Highlight Profit/Loss
  if (profitLoss >= 0) {
    doc.setTextColor(16, 185, 129); // emerald-600
    doc.setFont('helvetica', 'bold');
    doc.text(`+ INR ${profitLoss.toLocaleString('en-IN')} (Profit)`, 148, 66);
  } else {
    doc.setTextColor(225, 29, 72); // rose-600
    doc.setFont('helvetica', 'bold');
    doc.text(`- INR ${Math.abs(profitLoss).toLocaleString('en-IN')} (Loss)`, 148, 66);
  }

  // Summary Metrics Table
  const summaryRows = [
    [
      options.gameType || 'All',
      options.drawNumber || 'N/A',
      winningResultText,
      `${totalBetsCount}`,
      `INR ${totalCollection.toLocaleString('en-IN')}`,
      `INR ${totalWinningAmount.toLocaleString('en-IN')}`,
      `INR ${totalPayout.toLocaleString('en-IN')}`,
      `INR ${profitLoss.toLocaleString('en-IN')}`,
    ],
  ];

  autoTable(doc, {
    startY: 74,
    head: [['Game', 'Draw #', 'Winning Result', 'Bets', 'Collection', 'Win Amount', 'Payout', 'Profit/Loss']],
    body: summaryRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      7: { fontStyle: 'bold', textColor: profitLoss >= 0 ? [16, 185, 129] : [225, 29, 72] },
    },
  });

  // Detailed Player Bets Table
  const tableData = filteredBets.map((b, idx) => {
    const h = getHierarchyNames(b.username);
    return [
      `${idx + 1}`,
      b.ticketNo || b.id.substring(0, 8),
      b.username,
      h.superDistributor,
      h.distributor,
      h.retailer,
      `${b.gameType} (${b.selectedNumbers.join(', ')})`,
      `INR ${b.betAmount}`,
      b.status,
      b.winAmount > 0 ? `INR ${b.winAmount}` : 'INR 0',
      b.createdAt || b.drawTime,
    ];
  });

  const finalY = (doc as any).lastAutoTable.finalY || 95;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('COMPLETE PLAYER BET LEDGER & HIERARCHY AUDIT', 14, finalY + 8);

  autoTable(doc, {
    startY: finalY + 11,
    head: [
      ['#', 'Ticket #', 'Player ID', 'Super Dist.', 'Distributor', 'Retailer', 'Bet Details', 'Amount', 'Status', 'Payout', 'Date & Time'],
    ],
    body: tableData.length > 0 ? tableData : [['-', '-', 'No records matching filters', '-', '-', '-', '-', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
    styles: { fontSize: 7, cellPadding: 1.8 },
    columnStyles: {
      2: { fontStyle: 'bold' },
      7: { fontStyle: 'bold', textColor: [217, 119, 6] },
      8: { fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 8) {
        if (data.cell.raw === 'Won') {
          data.cell.styles.textColor = [16, 185, 129];
        } else if (data.cell.raw === 'Lost') {
          data.cell.styles.textColor = [225, 29, 72];
        } else if (data.cell.raw === 'Pending') {
          data.cell.styles.textColor = [217, 119, 6];
        }
      }
    },
  });

  // Footer & Page Numbers
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);

    // Footer divider
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 284, 196, 284);

    doc.text(`Shyam Panel Confidential Audit Report - ID: ${reportId}`, 14, 288);
    doc.text(`Page ${i} of ${totalPages}`, 180, 288);
  }

  // Save the generated PDF
  const filename = `Lottery_Report_${options.reportType.replace(/\s+/g, '_')}_${reportId}.pdf`;
  doc.save(filename);
}
