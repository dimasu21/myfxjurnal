import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Trade } from '../types/trade';

export function exportToExcel(trades: Trade[], filename = 'Jurnal_Trading_Forex.xlsx') {
  const formattedData = trades.map((t, idx) => ({
    No: idx + 1,
    Tanggal: t.tanggal,
    Pair: t.pair,
    Posisi: t.posisi,
    Entry: t.entry,
    SL: t.sl,
    TP: t.tp,
    Lot: t.lot,
    Hasil_Pips: t.pips > 0 ? `+${t.pips} Pips` : `${t.pips} Pips`,
    PnL_USD: t.pnl !== undefined ? t.pnl : '',
    Status: t.status,
    Risk_Reward: t.riskReward || '',
    Alasan_Eksekusi: t.alasan,
    Emosi: t.emosi,
    Evaluasi: t.evaluasi,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Trading Journal');

  XLSX.writeFile(workbook, filename);
}

export function exportToCsv(trades: Trade[], filename = 'Jurnal_Trading_Forex.csv') {
  const formattedData = trades.map((t, idx) => ({
    No: idx + 1,
    Tanggal: t.tanggal,
    Pair: t.pair,
    Posisi: t.posisi,
    Entry: t.entry,
    SL: t.sl,
    TP: t.tp,
    Lot: t.lot,
    Hasil: t.pips > 0 ? `+${t.pips} Pips` : `${t.pips} Pips`,
    PnL: t.pnl ?? 0,
    Status: t.status,
    RR: t.riskReward || '',
    Alasan: t.alasan,
    Emosi: t.emosi,
    Evaluasi: t.evaluasi,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPdf(trades: Trade[], filename = 'Jurnal_Trading_Forex.pdf') {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Header Bar Hijau ala Excel
  doc.setFillColor(16, 124, 65); // #107c41 Excel Green
  doc.rect(0, 0, 297, 16, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('JURNAL TRADING FOREX (EXCEL EDITION)', 12, 11);

  // Meta info
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  doc.text(`Tanggal Cetak: ${dateStr}  |  Total Baris: ${trades.length}`, 220, 11);

  // Header tabel
  const headers = [
    [
      'No',
      'Tanggal',
      'Pair',
      'Posisi',
      'Entry',
      'SL',
      'TP',
      'Lot',
      'Hasil',
      'R:R',
      'Alasan Eksekusi',
      'Emosi',
      'Evaluasi Akhir',
    ],
  ];

  const body = trades.map((t, idx) => [
    idx + 1,
    t.tanggal,
    t.pair,
    t.posisi,
    t.entry,
    t.sl,
    t.tp,
    t.lot,
    t.pips > 0 ? `+${t.pips} Pips` : `${t.pips} Pips`,
    t.riskReward || '-',
    t.alasan || '-',
    t.emosi || '-',
    t.evaluasi || '-',
  ]);

  autoTable(doc, {
    startY: 22,
    head: headers,
    body: body,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineColor: [210, 215, 220],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [16, 124, 65],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'center', fontStyle: 'bold', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'right', cellWidth: 18 },
      5: { halign: 'right', cellWidth: 18 },
      6: { halign: 'right', cellWidth: 18 },
      7: { halign: 'center', cellWidth: 14 },
      8: { halign: 'center', fontStyle: 'bold', cellWidth: 22 },
      9: { halign: 'center', cellWidth: 15 },
      10: { cellWidth: 38 },
      11: { halign: 'center', cellWidth: 25 },
      12: { cellWidth: 40 },
    },
    didParseCell: (data) => {
      // Pewarnaan Kolom Posisi
      if (data.section === 'body' && data.column.index === 3) {
        const val = String(data.cell.raw);
        if (val === 'BUY') {
          data.cell.styles.textColor = [16, 124, 65];
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'SELL') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        }
      }
      // Pewarnaan Kolom Hasil Pips
      if (data.section === 'body' && data.column.index === 8) {
        const val = String(data.cell.raw);
        if (val.startsWith('+')) {
          data.cell.styles.textColor = [16, 124, 65];
          data.cell.styles.fontStyle = 'bold';
        } else if (val.startsWith('-')) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  doc.save(filename);
}

export async function importFromSpreadsheet(file: File): Promise<Trade[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(sheet);

        const importedTrades: Trade[] = json.map((row, index) => {
          const rawPips = row['Hasil_Pips'] || row['Hasil'] || row['Pips'] || row['pips'] || '0';
          const pipsNum = typeof rawPips === 'number' 
            ? rawPips 
            : parseFloat(String(rawPips).replace(/[^\d.-]/g, '')) || 0;

          const posisiRaw = String(row['Posisi'] || row['posisi'] || 'BUY').toUpperCase();
          const posisi = posisiRaw.includes('SELL') || posisiRaw.includes('SHORT') ? 'SELL' : 'BUY';

          const entry = parseFloat(row['Entry'] || row['entry']) || 0;
          const sl = parseFloat(row['SL'] || row['sl']) || 0;
          const tp = parseFloat(row['TP'] || row['tp']) || 0;

          return {
            id: `tr-imp-${Date.now()}-${index}`,
            tanggal: String(row['Tanggal'] || row['tanggal'] || new Date().toLocaleDateString('id-ID')),
            pair: String(row['Pair'] || row['pair'] || 'EUR/USD').toUpperCase(),
            posisi,
            entry,
            sl,
            tp,
            lot: String(row['Lot'] || row['lot'] || '0.1'),
            pips: pipsNum,
            pnl: parseFloat(row['PnL_USD'] || row['PnL'] || row['pnl']) || pipsNum,
            status: pipsNum > 0 ? 'WIN' : pipsNum < 0 ? 'LOSS' : 'BE',
            alasan: String(row['Alasan_Eksekusi'] || row['Alasan'] || row['alasan'] || '-'),
            emosi: String(row['Emosi'] || row['emosi'] || 'Tenang'),
            evaluasi: String(row['Evaluasi'] || row['evaluasi'] || '-'),
            riskReward: String(row['Risk_Reward'] || row['RR'] || row['riskReward'] || '-'),
          };
        });

        resolve(importedTrades);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export function exportToJson(trades: Trade[], filename = 'Jurnal_Trading_Forex_Backup.json') {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trades, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function importFromJson(file: File): Promise<Trade[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (Array.isArray(parsed)) {
          resolve(parsed as Trade[]);
        } else {
          reject(new Error('Format file JSON bukan array trade yang valid'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
