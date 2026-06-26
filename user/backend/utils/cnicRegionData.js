/**
 * Comprehensive NADRA CNIC geographic registry.
 * Digit 1 = province | Digit 2 = division | Digit 3 = district within division
 * Digits 4–5 = tehsil / union council
 */

const PROVINCES = {
  '1': 'Khyber Pakhtunkhwa',
  '2': 'Ex-FATA / Merged Districts',
  '3': 'Punjab',
  '4': 'Sindh',
  '5': 'Balochistan',
  '6': 'Islamabad Capital Territory',
  '7': 'Gilgit-Baltistan',
  '8': 'Azad Jammu & Kashmir',
};

const OVERSEAS_PROVINCE = 'Overseas Pakistani (NICOP)';

/** Division metadata keyed by first two CNIC digits */
const DIVISIONS = {
  11: { name: 'Bannu', province: PROVINCES['1'] },
  12: { name: 'Dera Ismail Khan', province: PROVINCES['1'] },
  13: { name: 'Hazara', province: PROVINCES['1'] },
  14: { name: 'Kohat', province: PROVINCES['1'] },
  15: { name: 'Malakand', province: PROVINCES['1'] },
  16: { name: 'Mardan', province: PROVINCES['1'] },
  17: { name: 'Peshawar', province: PROVINCES['1'] },
  18: { name: 'Khyber', province: PROVINCES['1'] },
  19: { name: 'Khyber Pakhtunkhwa', province: PROVINCES['1'] },

  21: { name: 'Bajaur / Mohmand', province: PROVINCES['2'] },
  22: { name: 'Khyber / Orakzai', province: PROVINCES['2'] },
  23: { name: 'Kurram / North Waziristan', province: PROVINCES['2'] },
  24: { name: 'South Waziristan', province: PROVINCES['2'] },
  25: { name: 'Merged Tribal Districts', province: PROVINCES['2'] },

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
  44: { name: 'Hyderabad', province: PROVINCES['4'] },
  45: { name: 'Sukkur', province: PROVINCES['4'] },
  46: { name: 'Mirpurkhas', province: PROVINCES['4'] },
  47: { name: 'Shaheed Benazirabad', province: PROVINCES['4'] },
  48: { name: 'Sindh', province: PROVINCES['4'] },

  51: { name: 'Quetta', province: PROVINCES['5'] },
  52: { name: 'Kalat', province: PROVINCES['5'] },
  53: { name: 'Makran', province: PROVINCES['5'] },
  54: { name: 'Sibi', province: PROVINCES['5'] },
  55: { name: 'Nasirabad', province: PROVINCES['5'] },
  56: { name: 'Zhob', province: PROVINCES['5'] },
  57: { name: 'Balochistan', province: PROVINCES['5'] },

  61: { name: 'Islamabad', province: PROVINCES['6'] },
  62: { name: 'Islamabad', province: PROVINCES['6'] },
  63: { name: 'Islamabad Capital Territory', province: PROVINCES['6'] },

  71: { name: 'Gilgit', province: PROVINCES['7'] },
  72: { name: 'Baltistan', province: PROVINCES['7'] },
  73: { name: 'Diamer / Ghizer', province: PROVINCES['7'] },
  74: { name: 'Gilgit-Baltistan', province: PROVINCES['7'] },

  81: { name: 'Muzaffarabad', province: PROVINCES['8'] },
  82: { name: 'Mirpur', province: PROVINCES['8'] },
  83: { name: 'Poonch', province: PROVINCES['8'] },
  84: { name: 'Neelum / Hattian', province: PROVINCES['8'] },
  85: { name: 'Azad Jammu & Kashmir', province: PROVINCES['8'] },
};

/**
 * District names within each division (index = 3rd CNIC digit).
 * Ensures every valid division + district-digit resolves to a named district.
 */
const DIVISION_DISTRICTS = {
  11: ['Bannu', 'Lakki Marwat', 'Karak', 'North Waziristan', 'Bannu City', 'Domel', 'Baka Khel', 'Miran Shah', 'Razmak', 'Wana'],
  12: ['Dera Ismail Khan', 'Tank', 'Kulachi', 'Paroa', 'Darazinda', 'Paharpur', 'Kot Addu', 'Kulachi Town', 'DI Khan City', 'Karak'],
  13: ['Abbottabad', 'Mansehra', 'Haripur', 'Battagram', 'Kohistan', 'Tor Ghar', 'Havelian', 'Oghi', 'Balakot', 'Ghazi'],
  14: ['Kohat', 'Hangu', 'Karak', 'Orakzai', 'Tall', 'Lachi', 'Gumbat', 'Darra Adam Khel', 'Kohat City', 'Thall'],
  15: ['Swat', 'Dir Lower', 'Dir Upper', 'Malakand', 'Buner', 'Shangla', 'Chakdara', 'Mingora', 'Timergara', 'Bahrain'],
  16: ['Mardan', 'Swabi', 'Charsadda', 'Nowshera', 'Takht Bhai', 'Rustam', 'Katlang', 'Jehangira', 'Mardan City', 'Topi'],
  17: ['Peshawar', 'Charsadda', 'Nowshera', 'Khyber', 'Jamrud', 'Warsak', 'Badaber', 'Peshawar City', 'University Town', 'Hayatabad'],
  18: ['Khyber', 'Jamrud', 'Landi Kotal', 'Bara', 'Torkham', 'Michni', 'Shalman', 'Khyber Agency', 'Bara Tehsil', 'Jamrud Town'],

  21: ['Bajaur', 'Mohmand', 'Khar', 'Ghalanai', 'Ekkaghund', 'Safi', 'Prang Ghar', 'Utman Khel', 'Nawagai', 'Barang'],
  22: ['Khyber', 'Orakzai', 'Hangu', 'Kurram', 'Tall', 'Ali Khel', 'Lower Orakzai', 'Upper Orakzai', 'Ferozkhel', 'Ghiljo'],
  23: ['Kurram', 'North Waziristan', 'Mir Ali', 'Miranshah', 'Razmak', 'Datta Khel', 'Spinwam', 'Ghulam Khan', 'Shawal', 'Dossali'],
  24: ['South Waziristan', 'Wana', 'Sararogha', 'Tiarza', 'Ladha', 'Shakai', 'Kaniguram', 'Sarwakai', 'Birmal', 'Shakai Town'],
  25: ['Merged District', 'Tribal Area', 'Frontier Region', 'Peshawar Tribal', 'Kohat Tribal', 'Bannu Tribal', 'Dera Tribal', 'Lakki Tribal', 'Tank Tribal', 'Ex-FATA'],

  31: ['Sargodha', 'Khushab', 'Mianwali', 'Bhakkar', 'Lakki Marwat', 'Bhalwal', 'Kot Momin', 'Sahiwal', 'Shahpur', 'Bhera'],
  32: ['Gujrat', 'Mandi Bahauddin', 'Hafizabad', 'Wazirabad', 'Kharian', 'Kunjah', 'Lalamusa', 'Dinga', 'Sarai Alamgir', 'Malakwal'],
  33: ['Faisalabad', 'Jhang', 'Toba Tek Singh', 'Chiniot', 'Samundri', 'Gojra', 'Jaranwala', 'Tandlianwala', 'Kamalia', 'Pir Mahal'],
  34: ['Gujranwala', 'Hafizabad', 'Narowal', 'Sialkot', 'Wazirabad', 'Daska', 'Pasrur', 'Sambrial', 'Kamoke', 'Muridke'],
  35: ['Lahore', 'Kasur', 'Nankana Sahib', 'Sheikhupura', 'Raiwind', 'Chunian', 'Pattoki', 'Muridke', 'Ferozewala', 'Sharaqpur'],
  36: ['Multan', 'Lodhran', 'Khanewal', 'Vehari', 'Shujabad', 'Jalalpur Pirwala', 'Mailsi', 'Kabirwala', 'Dunyapur', 'Kot Addu'],
  37: ['Rawalpindi', 'Attock', 'Chakwal', 'Jhelum', 'Murree', 'Taxila', 'Gujar Khan', 'Kahuta', 'Kallar Syedan', 'Talagang'],
  38: ['Bahawalpur', 'Rahim Yar Khan', 'Bahawalnagar', 'Ahmadpur East', 'Hasilpur', 'Khairpur Tamewali', 'Yazman', 'Khanpur', 'Sadiqabad', 'Liaquatpur'],
  39: ['Sahiwal', 'Okara', 'Pakpattan', 'Arifwala', 'Depalpur', 'Renala Khurd', 'Chichawatni', 'Haveli Lakha', 'Qadirabad', 'Basirpur'],

  41: ['Karachi Central', 'Karachi East', 'Karachi South', 'Karachi West', 'Karachi Korangi', 'Keamari', 'Malir', 'Landhi', 'Orangi', 'Gulshan'],
  42: ['Karachi East', 'Karachi South', 'Karachi West', 'Karachi Central', 'Korangi', 'Landhi', 'Malir', 'Bin Qasim', 'Gadap', 'Shah Faisal'],
  43: ['Larkana', 'Shikarpur', 'Jacobabad', 'Kashmore', 'Kandhkot', 'Ratodero', 'Dokri', 'Bakrani', 'Mehar', 'Warah'],
  44: ['Hyderabad', 'Tando Allahyar', 'Tando Muhammad Khan', 'Matiari', 'Badin', 'Thatta', 'Sujawal', 'Jamshoro', 'Kotri', 'Hala'],
  45: ['Sukkur', 'Ghotki', 'Khairpur', 'Larkana', 'Rohri', 'Pano Aqil', 'Ubauro', 'Mirpur Mathelo', 'Daharki', 'Kandhkot'],
  46: ['Mirpurkhas', 'Umerkot', 'Tharparkar', 'Sanghar', 'Nawabshah', 'Shahdadpur', 'Sinjhoro', 'Khipro', 'Diplo', 'Mithi'],
  47: ['Nawabshah', 'Sanghar', 'Shaheed Benazirabad', 'Naushahro Feroze', 'Moro', 'Kandiaro', 'Bhiria', 'Daur', 'Sakrand', 'Qazi Ahmad'],
  48: ['Sindh District', 'Coastal Sindh', 'Interior Sindh', 'Upper Sindh', 'Lower Sindh', 'Central Sindh', 'Rural Sindh', 'Urban Sindh', 'Desert Sindh', 'Delta Sindh'],

  51: ['Quetta', 'Pishin', 'Killa Abdullah', 'Chaman', 'Quetta City', 'Sariab', 'Kuchlak', 'Mastung Road', 'Hanna', 'Brewery'],
  52: ['Khuzdar', 'Kalat', 'Mastung', 'Surab', 'Nal', 'Wadh', 'Ornach', 'Zehri', 'Gazg', 'Johan'],
  53: ['Gwadar', 'Turbat', 'Panjgur', 'Kech', 'Pasni', 'Ormara', 'Jiwani', 'Suntsar', 'Mand', 'Buleda'],
  54: ['Sibi', 'Kohlu', 'Dera Bugti', 'Barkhan', 'Ziarat', 'Harnai', 'Sibi City', 'Kahan', 'Mach', 'Faridabad'],
  55: ['Nasirabad', 'Jaffarabad', 'Jhal Magsi', 'Kachhi', 'Sohbatpur', 'Gandakha', 'Usta Muhammad', 'Dera Murad Jamali', 'Rojhan', 'Chattar'],
  56: ['Zhob', 'Sherani', 'Qilla Saifullah', 'Loralai', 'Musakhel', 'Barkhan', 'Zhob City', 'Qilla Abdullah', 'Killa Saifullah', 'Musakhail'],
  57: ['Balochistan District', 'Central Balochistan', 'Northern Balochistan', 'Southern Balochistan', 'Coastal Balochistan', 'Highland Balochistan', 'Desert Balochistan', 'Plateau Balochistan', 'Frontier Balochistan', 'Rural Balochistan'],

  61: ['Islamabad', 'Islamabad Urban', 'Islamabad Rural', 'Zone I', 'Zone II', 'Zone III', 'Zone IV', 'Zone V', 'Margalla', 'Bara Kahu'],
  62: ['Islamabad', 'Rawalpindi ICT', 'Murree ICT', 'Kahuta ICT', 'Taxila ICT', 'Tarnol', 'Sihala', 'Nilore', 'Shah Allah Ditta', 'Phulgran'],
  63: ['Islamabad Capital Territory', 'ICT Zone', 'Federal Area', 'Diplomatic Enclave', 'F-6', 'G-9', 'I-8', 'E-11', 'D-12', 'H-13'],

  71: ['Gilgit', 'Ghizer', 'Hunza', 'Nagar', 'Gilgit City', 'Jutial', 'Danyore', 'Nomal', 'Jaglot', 'Punial'],
  72: ['Skardu', 'Ghanche', 'Shigar', 'Kharmang', 'Skardu City', 'Khaplu', 'Roundu', 'Gultari', 'Tolti', 'Hussainabad'],
  73: ['Diamer', 'Astore', 'Ghizer', 'Chilas', 'Darel', 'Tangir', 'Gupis', 'Yasin', 'Ishkoman', 'Punial'],
  74: ['Gilgit-Baltistan District', 'Northern Areas', 'Baltistan', 'Diamer Division', 'Hunza Division', 'Gilgit Division', 'Skardu Division', 'Ghizer Division', 'Astore Division', 'GB Rural'],

  81: ['Muzaffarabad', 'Neelum', 'Hattian Bala', 'Muzaffarabad City', 'Garhi Dupatta', 'Chakothi', 'Patika', 'Leepa', 'Chikar', 'Authmuqam'],
  82: ['Mirpur', 'Bhimber', 'Kotli', 'Mirpur City', 'Dadyal', 'Chakswari', 'Islamgarh', 'Jatlan', 'Khuiratta', 'Sehnsa'],
  83: ['Rawalakot', 'Poonch', 'Sudhnuti', 'Bagh', 'Haveli', 'Forward Kahuta', 'Mendhar', 'Pallandri', 'Thorar', 'Rawalakot City'],
  84: ['Neelum', 'Hattian', 'Leepa', 'Sharda', 'Kel', 'Athmuqam', 'Dowarian', 'Kutton', 'Kundal Shahi', 'Taobat'],
  85: ['Azad Kashmir District', 'AJK Rural', 'AJK Urban', 'Jhelum Valley', 'Poonch Valley', 'Mirpur Division', 'Muzaffarabad Division', 'Rawalakot Division', 'Bhimber Division', 'Kotli Division'],
};

/** Exact 3-digit overrides (higher priority than division+digit map) */
const PREFIX3_OVERRIDES = {
  544: { name: 'Islamabad', province: PROVINCES['6'] },
  545: { name: 'Islamabad', province: PROVINCES['6'] },
  611: { name: 'Multan', province: PROVINCES['3'] },
  612: { name: 'Hyderabad', province: PROVINCES['4'] },
};

/** Legacy Islamabad block — many ICT CNICs use 544xx despite province digit 5 */
const SPECIAL_PREFIX_RULES = [
  { startsWith: '544', province: PROVINCES['6'], name: 'Islamabad' },
  { startsWith: '545', province: PROVINCES['6'], name: 'Islamabad' },
  { startsWith: '6110', matchFourth: '2', name: 'Hyderabad', province: PROVINCES['4'] },
  { startsWith: '6110', matchFourth: '1', name: 'Multan', province: PROVINCES['3'] },
];

const OVERSEAS_PREFIXES = {
  90001: 'Overseas Pakistani (NICOP)',
  90002: 'Overseas Pakistani (NICOP)',
  90101: 'Overseas Pakistani — Middle East',
  90102: 'Overseas Pakistani — UAE',
  90103: 'Overseas Pakistani — Saudi Arabia',
  90201: 'Overseas Pakistani — Europe',
  90202: 'Overseas Pakistani — United Kingdom',
  90301: 'Overseas Pakistani — North America',
  90302: 'Overseas Pakistani — United States',
  90303: 'Overseas Pakistani — Canada',
  90401: 'Overseas Pakistani — Asia Pacific',
  90402: 'Overseas Pakistani — Australia',
  90501: 'Overseas Pakistani — Africa',
  90601: 'Overseas Pakistani — Far East',
};

const OVERSEAS_REGIONS = {
  0: 'General',
  1: 'Middle East',
  2: 'Europe',
  3: 'North America',
  4: 'Asia Pacific',
  5: 'Africa',
  6: 'Far East',
  7: 'Central Asia',
  8: 'Scandinavia',
  9: 'Other Overseas',
};

const isOverseasPrefix = (prefix5) => {
  if (OVERSEAS_PREFIXES[prefix5]) return true;
  return prefix5.startsWith('90');
};

const getOverseasLabel = (prefix5) => {
  if (OVERSEAS_PREFIXES[prefix5]) return OVERSEAS_PREFIXES[prefix5];
  const regionDigit = prefix5[2];
  const region = OVERSEAS_REGIONS[regionDigit] || 'International';
  return `Overseas Pakistani (NICOP) — ${region}`;
};

const getProvinceFromDigit = (digit) => PROVINCES[digit] || null;

const isValidCnicProvinceDigit = (digit) => Boolean(PROVINCES[digit]);

const resolveSpecialPrefix = (prefix5) => {
  for (const rule of SPECIAL_PREFIX_RULES) {
    if (!prefix5.startsWith(rule.startsWith)) continue;
    if (rule.matchFourth !== undefined && prefix5[3] !== rule.matchFourth) continue;
    return { name: rule.name, province: rule.province };
  }
  return null;
};

const resolveFromDivisionDistrict = (prefix5) => {
  const prefix2 = Number(prefix5.slice(0, 2));
  const districtIndex = Number(prefix5[2]);
  const division = DIVISIONS[prefix2];
  if (!division) return null;

  const districts = DIVISION_DISTRICTS[prefix2];
  const districtName = districts?.[districtIndex]
    || `${division.name} District ${districtIndex}`;

  return {
    name: districtName,
    province: division.province,
    division: division.name,
  };
};

const resolveFromPrefix3 = (prefix5) => {
  const prefix3 = Number(prefix5.slice(0, 3));
  if (PREFIX3_OVERRIDES[prefix3]) {
    return { ...PREFIX3_OVERRIDES[prefix3], detectionLevel: 'district' };
  }
  return resolveFromDivisionDistrict(prefix5);
};

module.exports = {
  PROVINCES,
  OVERSEAS_PROVINCE,
  DIVISIONS,
  DIVISION_DISTRICTS,
  PREFIX3_OVERRIDES,
  OVERSEAS_PREFIXES,
  OVERSEAS_REGIONS,
  isOverseasPrefix,
  getOverseasLabel,
  getProvinceFromDigit,
  isValidCnicProvinceDigit,
  resolveSpecialPrefix,
  resolveFromDivisionDistrict,
  resolveFromPrefix3,
};
