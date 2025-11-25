export const PROGRAM_MAP: Record<string, string> = {
  "BCA Financial Services": "BCAFS",
  "Cinch": "Cinch",
  "Emerios": "Emerios",
  "Expensify": "Expensify",
  "Fashion Nova": "Fashion Nova",
  "Fedchex": "Fedchex",
  "FNCB": "FNCB",
  "Fresno": "Fresno",
  "Gen Mobile": "Gen Mobile",
  "Katz Legal": "Katz Legal",
  "KCI": "KCI",
  "Lido": "Lido",
  "Minted": "Minted CS",
  "NAXA": "NAXA Electronics",
  "Pacific Credit": "Pacific Credit Services",
  "Skin and Cancer Institute": "SkinUSA",
  "Tea Room": "Tea Room",
  "Ubifi": "UbiFi",
  "Order PM": "Precision Medical Supply",
  // Identity mappings for robustness
  "BCAFS": "BCAFS",
  "Minted CS": "Minted CS",
  "NAXA Electronics": "NAXA Electronics",
  "Pacific Credit Services": "Pacific Credit Services",
  "Precision Medical Supply": "Precision Medical Supply",
  "SkinUSA": "SkinUSA",
  "UbiFi": "UbiFi"
};

// Extract unique values to ensure we have the distinct list of output programs
export const ALL_PROGRAMS = Array.from(new Set(Object.values(PROGRAM_MAP))).sort();

export const HEADER_OUTPUT = "bu\tgeo\tclient\ttimeframe\tabs_num\tin_off_shr_num\tpln_shr_num\tunpln_shr_num\tdenom";

export const SAMPLE_DATA_1 = `Row Labels\tCampaign\tLeave\tScheduled
2023-10-26\tBCA Financial Services\t2\t10
2023-10-26\tFashion Nova\t0\t50
2023-10-27\tTea Room\t1\t5`;

export const SAMPLE_DATA_2 = `Row Labels\tCampaign\tAbsent
2023-10-26\tBCA Financial Services\t1
2023-10-26\tFashion Nova\t3
2023-10-27\tTea Room\t0`;