/**
 * NADRA CNIC geographic decoding (first 5 digits).
 * 1st digit = province/territory, 2nd = division, 3rd–5th = district/tehsil/UC.
 * Falls back from exact 5-digit → 3-digit → 2-digit → province when no exact match.
 */

const PROVINCES = {
  '1': 'Khyber Pakhtunkhwa',
  '2': 'Ex-FATA / Merged Areas',
  '3': 'Punjab',
  '4': 'Sindh',
  '5': 'Balochistan',
  '6': 'Islamabad Capital Territory',
  '7': 'Gilgit-Baltistan',
  '8': 'Azad Jammu & Kashmir',
};

/** Division-level (first 2 digits) */
const DIVISIONS = {
  11: { name: 'Bannu', province: PROVINCES['1'] },
  12: { name: 'Dera Ismail Khan', province: PROVINCES['1'] },
  13: { name: 'Hazara', province: PROVINCES['1'] },
  14: { name: 'Kohat', province: PROVINCES['1'] },
  15: { name: 'Malakand', province: PROVINCES['1'] },
  16: { name: 'Mardan', province: PROVINCES['1'] },
  17: { name: 'Peshawar', province: PROVINCES['1'] },
  18: { name: 'Khyber Pakhtunkhwa', province: PROVINCES['1'] },

  21: { name: 'Ex-FATA / Merged Areas', province: PROVINCES['2'] },
  22: { name: 'Ex-FATA / Merged Areas', province: PROVINCES['2'] },

  31: { name: 'Sargodha', province: PROVINCES['3'] },
  32: { name: 'Gujrat', province: PROVINCES['3'] },
  33: { name: 'Faisalabad', province: PROVINCES['3'] },
  34: { name: 'Gujranwala', province: PROVINCES['3'] },
  35: { name: 'Lahore', province: PROVINCES['3'] },
  36: { name: 'Multan', province: PROVINCES['3'] },
  37: { name: 'Rawalpindi', province: PROVINCES['3'] },
  38: { name: 'Bahawalpur', province: PROVINCES['3'] },
  39: { name: 'Sahiwal', province: PROVINCES['3'] },

  41: { name: 'Karachi', province: PROVINCES['4'] },
  42: { name: 'Karachi', province: PROVINCES['4'] },
  43: { name: 'Larkana', province: PROVINCES['4'] },
  44: { name: 'Mirpurkhas / Hyderabad', province: PROVINCES['4'] },
  45: { name: 'Sukkur', province: PROVINCES['4'] },
  46: { name: 'Shaheed Benazirabad', province: PROVINCES['4'] },

  51: { name: 'Quetta', province: PROVINCES['5'] },
  52: { name: 'Kalat', province: PROVINCES['5'] },
  53: { name: 'Makran', province: PROVINCES['5'] },
  54: { name: 'Sibi', province: PROVINCES['5'] },
  55: { name: 'Nasirabad', province: PROVINCES['5'] },
  56: { name: 'Zhob', province: PROVINCES['5'] },

  61: { name: 'Islamabad', province: PROVINCES['6'] },
  62: { name: 'Islamabad', province: PROVINCES['6'] },

  71: { name: 'Gilgit', province: PROVINCES['7'] },
  72: { name: 'Baltistan', province: PROVINCES['7'] },
  73: { name: 'Gilgit-Baltistan', province: PROVINCES['7'] },

  81: { name: 'Muzaffarabad', province: PROVINCES['8'] },
  82: { name: 'Mirpur', province: PROVINCES['8'] },
  83: { name: 'Poonch', province: PROVINCES['8'] },
  84: { name: 'Azad Kashmir', province: PROVINCES['8'] },
};

/** District-level (first 3 digits) — major cities/tehsils */
const PREFIX3_DISTRICTS = {
  111: { name: 'Bannu', province: PROVINCES['1'] },
  121: { name: 'Dera Ismail Khan', province: PROVINCES['1'] },
  131: { name: 'Abbottabad', province: PROVINCES['1'] },
  132: { name: 'Mansehra', province: PROVINCES['1'] },
  133: { name: 'Haripur', province: PROVINCES['1'] },
  141: { name: 'Kohat', province: PROVINCES['1'] },
  151: { name: 'Swat', province: PROVINCES['1'] },
  152: { name: 'Malakand', province: PROVINCES['1'] },
  153: { name: 'Dir', province: PROVINCES['1'] },
  161: { name: 'Mardan', province: PROVINCES['1'] },
  162: { name: 'Swabi', province: PROVINCES['1'] },
  171: { name: 'Peshawar', province: PROVINCES['1'] },
  172: { name: 'Charsadda', province: PROVINCES['1'] },
  173: { name: 'Nowshera', province: PROVINCES['1'] },

  311: { name: 'Sargodha', province: PROVINCES['3'] },
  312: { name: 'Khushab', province: PROVINCES['3'] },
  321: { name: 'Gujrat', province: PROVINCES['3'] },
  322: { name: 'Mandi Bahauddin', province: PROVINCES['3'] },
  331: { name: 'Faisalabad', province: PROVINCES['3'] },
  332: { name: 'Jhang', province: PROVINCES['3'] },
  333: { name: 'Toba Tek Singh', province: PROVINCES['3'] },
  341: { name: 'Gujranwala', province: PROVINCES['3'] },
  342: { name: 'Hafizabad', province: PROVINCES['3'] },
  343: { name: 'Narowal', province: PROVINCES['3'] },
  344: { name: 'Sialkot', province: PROVINCES['3'] },
  351: { name: 'Kasur', province: PROVINCES['3'] },
  352: { name: 'Lahore', province: PROVINCES['3'] },
  353: { name: 'Nankana Sahib', province: PROVINCES['3'] },
  354: { name: 'Sheikhupura', province: PROVINCES['3'] },
  361: { name: 'Multan', province: PROVINCES['3'] },
  362: { name: 'Lodhran', province: PROVINCES['3'] },
  363: { name: 'Khanewal', province: PROVINCES['3'] },
  364: { name: 'Vehari', province: PROVINCES['3'] },
  371: { name: 'Rawalpindi', province: PROVINCES['3'] },
  372: { name: 'Attock', province: PROVINCES['3'] },
  373: { name: 'Chakwal', province: PROVINCES['3'] },
  374: { name: 'Jhelum', province: PROVINCES['3'] },
  381: { name: 'Bahawalpur', province: PROVINCES['3'] },
  382: { name: 'Rahim Yar Khan', province: PROVINCES['3'] },
  391: { name: 'Sahiwal', province: PROVINCES['3'] },
  392: { name: 'Okara', province: PROVINCES['3'] },
  393: { name: 'Pakpattan', province: PROVINCES['3'] },

  411: { name: 'Karachi Central', province: PROVINCES['4'] },
  412: { name: 'Karachi East', province: PROVINCES['4'] },
  413: { name: 'Karachi South', province: PROVINCES['4'] },
  414: { name: 'Karachi West', province: PROVINCES['4'] },
  415: { name: 'Karachi Korangi', province: PROVINCES['4'] },
  421: { name: 'Karachi Central', province: PROVINCES['4'] },
  422: { name: 'Karachi East', province: PROVINCES['4'] },
  423: { name: 'Karachi South', province: PROVINCES['4'] },
  424: { name: 'Karachi West', province: PROVINCES['4'] },
  431: { name: 'Larkana', province: PROVINCES['4'] },
  432: { name: 'Shikarpur', province: PROVINCES['4'] },
  441: { name: 'Hyderabad', province: PROVINCES['4'] },
  442: { name: 'Mirpurkhas', province: PROVINCES['4'] },
  443: { name: 'Tharparkar', province: PROVINCES['4'] },
  451: { name: 'Sukkur', province: PROVINCES['4'] },
  452: { name: 'Ghotki', province: PROVINCES['4'] },
  461: { name: 'Nawabshah / Benazirabad', province: PROVINCES['4'] },

  511: { name: 'Quetta', province: PROVINCES['5'] },
  512: { name: 'Pishin', province: PROVINCES['5'] },
  521: { name: 'Khuzdar', province: PROVINCES['5'] },
  531: { name: 'Gwadar', province: PROVINCES['5'] },
  541: { name: 'Quetta', province: PROVINCES['5'] },
  544: { name: 'Islamabad', province: PROVINCES['6'] },
  545: { name: 'Islamabad', province: PROVINCES['6'] },
  611: { name: 'Multan', province: PROVINCES['3'] },
  612: { name: 'Hyderabad', province: PROVINCES['4'] },

  711: { name: 'Gilgit', province: PROVINCES['7'] },
  712: { name: 'Ghizer', province: PROVINCES['7'] },
  721: { name: 'Skardu', province: PROVINCES['7'] },
  731: { name: 'Diamer', province: PROVINCES['7'] },

  811: { name: 'Muzaffarabad', province: PROVINCES['8'] },
  821: { name: 'Mirpur', province: PROVINCES['8'] },
  831: { name: 'Poonch', province: PROVINCES['8'] },
};

/** NICOP / overseas registration prefixes (embassy & mission blocks) */
const OVERSEAS_PREFIXES = {
  90001: 'Overseas Pakistani (NICOP)',
  90002: 'Overseas Pakistani (NICOP)',
  90101: 'Overseas Pakistani — Middle East',
  90201: 'Overseas Pakistani — Europe',
  90301: 'Overseas Pakistani — North America',
  90401: 'Overseas Pakistani — Asia Pacific',
  90501: 'Overseas Pakistani — Africa',
};

const isOverseasPrefix = (prefix5) => {
  if (OVERSEAS_PREFIXES[prefix5]) return true;
  // NADRA mission / NICOP blocks commonly use 90xxx
  return prefix5.startsWith('90');
};

const getProvinceFromDigit = (digit) => PROVINCES[digit] || null;

module.exports = {
  PROVINCES,
  DIVISIONS,
  PREFIX3_DISTRICTS,
  OVERSEAS_PREFIXES,
  isOverseasPrefix,
  getProvinceFromDigit,
};
