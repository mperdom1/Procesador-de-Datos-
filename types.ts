export interface ProcessedRow {
  bu: string;
  geo: string;
  client: string;
  timeframe: string;
  denom: number;
  pln_shr_num: number;
  abs_num: number;
  unpln_shr_num: number;
  in_off_shr_num: number;
}

export interface RawInputRow {
  date: string;
  campaign: string;
  [key: string]: string; // For dynamic columns like Leave, Scheduled, Absent
}

export type ParsingError = string;