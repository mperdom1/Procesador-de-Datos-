import { PROGRAM_MAP, ALL_PROGRAMS, HEADER_OUTPUT } from './constants';
import { ProcessedRow, RawInputRow } from './types';

/**
 * Normalizes campaign names using the constant map.
 */
const getClientName = (campaignName: string): string => {
  const trimmed = campaignName.trim();
  return PROGRAM_MAP[trimmed] || trimmed;
};

/**
 * Parses raw text input into a structured array of objects.
 * Implements logic to prioritize Tab separation (Excel default) 
 * with a fallback to multi-space separation.
 */
export const parseRawData = (rawData: string, requiredColumns: string[]): RawInputRow[] | null => {
  const lines = rawData.trim().split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headerLine = lines[0].trim();
  
  // 1. Try splitting by Tab first (Standard for Excel/Sheets copy-paste)
  // We map and trim but filter empty only for header detection logic initially
  let headers = headerLine.split('\t').map(h => h.trim()).filter(h => h !== '');

  // The expected number of columns is at least Date + Campaign + Required Columns.
  // We add a buffer of 2 for Date/Campaign.
  const minExpectedCols = requiredColumns.length + 2;

  // 2. Fallback: If tab split results in too few columns, try splitting by 2+ spaces
  if (headers.length < minExpectedCols) {
    const fallbackHeaders = headerLine.split(/\s{2,}/).map(h => h.trim()).filter(h => h !== '');
    if (fallbackHeaders.length >= minExpectedCols) {
      headers = fallbackHeaders;
    }
  }

  // Detect column indices
  const dateColIndex = headers.findIndex(h => h === 'Row Labels' || h === 'Date');
  const campaignColIndex = headers.indexOf('Campaign');
  const hasMetrics = requiredColumns.every(col => headers.includes(col));

  if (dateColIndex === -1 || campaignColIndex === -1 || !hasMetrics) {
    console.warn(`Missing headers. Found: ${headers.join(', ')}. Expected: Row Labels, Campaign, ${requiredColumns.join(', ')}`);
    return null;
  }

  const data: RawInputRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    let values = currentLine.split('\t');

    // If tab split doesn't match header count, try regex split
    if (values.length < headers.length) {
      values = currentLine.split(/\s{2,}/);
    }

    if (values.length >= headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ? values[index].trim() : '';
      });

      const date = row[headers[dateColIndex]];
      const campaign = row[headers[campaignColIndex]];

      if (date && campaign) {
        data.push({
          date,
          campaign,
          ...row
        });
      }
    }
  }

  return data;
};

/**
 * Merges the two datasets and normalizes to the required output format.
 */
export const processDatasets = (
  rawInput1: string,
  rawInput2: string
): { result: string; error?: string; count?: number } => {
  
  // 1. Parse Inputs
  const data1 = parseRawData(rawInput1, ['Scheduled']); // 'Leave' is optional in logic but usually present
  const data2 = parseRawData(rawInput2, ['Absent']);

  if (data1 === null) {
    return { result: '', error: "Error al procesar: Asegúrate de pegar los encabezados correctos ('Row Labels', 'Campaign', 'Scheduled') en la Tabla 1." };
  }
  if (data2 === null) {
    return { result: '', error: "Error al procesar: Asegúrate de pegar los encabezados correctos ('Row Labels', 'Campaign', 'Absent') en la Tabla 2." };
  }

  // 2. Consolidate Data
  const dataMap = new Map<string, ProcessedRow>();
  const uniqueDates = new Set<string>();

  // Process Table 1 (Scheduled, Leave)
  data1.forEach(item => {
    const clientName = getClientName(item.campaign);
    const key = `${item.date}|${clientName}`;
    uniqueDates.add(item.date);

    const leave = parseFloat(item['Leave'] || '0') || 0;
    const scheduled = parseFloat(item['Scheduled'] || '0') || 0;

    dataMap.set(key, {
      bu: 'CS',
      geo: 'HN',
      client: clientName,
      timeframe: item.date,
      denom: scheduled,
      pln_shr_num: leave,
      abs_num: 0,
      unpln_shr_num: 0,
      in_off_shr_num: 0,
    });
  });

  // Process Table 2 (Absent)
  data2.forEach(item => {
    const clientName = getClientName(item.campaign);
    const key = `${item.date}|${clientName}`;
    uniqueDates.add(item.date);

    const absent = parseFloat(item['Absent'] || '0') || 0;
    const existingEntry = dataMap.get(key);

    if (existingEntry) {
      existingEntry.abs_num = absent;
      existingEntry.unpln_shr_num = absent;
    } else {
      dataMap.set(key, {
        bu: 'CS',
        geo: 'HN',
        client: clientName,
        timeframe: item.date,
        denom: 0,
        pln_shr_num: 0,
        abs_num: absent,
        unpln_shr_num: absent,
        in_off_shr_num: 0,
      });
    }
  });

  // 3. Fill missing programs (Zero-filling)
  const finalRows: ProcessedRow[] = [];
  const sortedDates = Array.from(uniqueDates).sort();

  sortedDates.forEach(date => {
    ALL_PROGRAMS.forEach(program => {
      const key = `${date}|${program}`;
      let row = dataMap.get(key);

      if (!row) {
        row = {
          bu: 'CS',
          geo: 'HN',
          client: program,
          timeframe: date,
          denom: 0,
          pln_shr_num: 0,
          abs_num: 0,
          unpln_shr_num: 0,
          in_off_shr_num: 0,
        };
      }
      finalRows.push(row);
    });
  });

  // 4. Generate Output String (TSV)
  const rowsStr = finalRows.map(r => 
    [
      r.bu,
      r.geo,
      r.client,
      r.timeframe,
      r.abs_num.toFixed(0),
      r.in_off_shr_num.toFixed(0),
      r.pln_shr_num.toFixed(0),
      r.unpln_shr_num.toFixed(0),
      r.denom.toFixed(0)
    ].join('\t')
  ).join('\n');

  return { 
    result: `${HEADER_OUTPUT}\n${rowsStr}`,
    count: finalRows.length 
  };
};