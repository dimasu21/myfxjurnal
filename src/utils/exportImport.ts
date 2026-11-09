import * as XLSX from 'xlsx';
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

