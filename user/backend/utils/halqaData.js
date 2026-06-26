const {
  DIVISIONS,
  OVERSEAS_PREFIXES,
  isOverseasPrefix,
  getOverseasLabel,
  getProvinceFromDigit,
  isValidCnicProvinceDigit,
  resolveSpecialPrefix,
  resolveFromPrefix3,
  OVERSEAS_PROVINCE,
} = require('./cnicRegionData');

/** Exact 5-digit entries with halqa (NA constituency) mappings */
const DISTRICTS = [
  { code: '35202', name: 'Lahore', province: 'Punjab', halqas: ['NA-118', 'NA-119', 'NA-120', 'NA-121', 'NA-122', 'NA-123', 'NA-124', 'NA-125', 'NA-126', 'NA-127', 'NA-128', 'NA-129', 'NA-130'] },
  { code: '61101', name: 'Multan', province: 'Punjab', halqas: ['NA-148', 'NA-149', 'NA-150', 'NA-151'] },
  { code: '37405', name: 'Rawalpindi', province: 'Punjab', halqas: ['NA-52', 'NA-53', 'NA-54', 'NA-55', 'NA-56', 'NA-57'] },
  { code: '42101', name: 'Karachi Central', province: 'Sindh', halqas: ['NA-247', 'NA-248', 'NA-249', 'NA-250'] },
  { code: '42201', name: 'Karachi East', province: 'Sindh', halqas: ['NA-236', 'NA-237', 'NA-238', 'NA-239'] },
  { code: '42301', name: 'Karachi South', province: 'Sindh', halqas: ['NA-239', 'NA-240', 'NA-241', 'NA-242'] },
  { code: '42401', name: 'Karachi West', province: 'Sindh', halqas: ['NA-243', 'NA-244', 'NA-245', 'NA-246'] },
  { code: '61102', name: 'Hyderabad', province: 'Sindh', halqas: ['NA-218', 'NA-219', 'NA-220'] },
  { code: '17301', name: 'Peshawar', province: 'Khyber Pakhtunkhwa', halqas: ['NA-28', 'NA-29', 'NA-30', 'NA-31', 'NA-32'] },
  { code: '54400', name: 'Islamabad', province: 'Islamabad Capital Territory', halqas: ['NA-46', 'NA-47', 'NA-48'] },
  { code: '54401', name: 'Islamabad', province: 'Islamabad Capital Territory', halqas: ['NA-46', 'NA-47', 'NA-48'] },
  { code: '54402', name: 'Islamabad', province: 'Islamabad Capital Territory', halqas: ['NA-46', 'NA-47', 'NA-48'] },
  { code: '54403', name: 'Islamabad', province: 'Islamabad Capital Territory', halqas: ['NA-46', 'NA-47', 'NA-48'] },
  { code: '54404', name: 'Islamabad', province: 'Islamabad Capital Territory', halqas: ['NA-46', 'NA-47', 'NA-48'] },
  { code: '54405', name: 'Islamabad', province: 'Islamabad Capital Territory', halqas: ['NA-46', 'NA-47', 'NA-48'] },
  { code: '54406', name: 'Islamabad', province: 'Islamabad Capital Territory', halqas: ['NA-46', 'NA-47', 'NA-48'] },
  { code: '54407', name: 'Islamabad', province: 'Islamabad Capital Territory', halqas: ['NA-46', 'NA-47', 'NA-48'] },
  { code: '54408', name: 'Islamabad', province: 'Islamabad Capital Territory', halqas: ['NA-46', 'NA-47', 'NA-48'] },
  { code: '54409', name: 'Islamabad', province: 'Islamabad Capital Territory', halqas: ['NA-46', 'NA-47', 'NA-48'] },
  { code: '13101', name: 'Quetta', province: 'Balochistan', halqas: ['NA-263', 'NA-264', 'NA-265'] },
  { code: '33101', name: 'Faisalabad', province: 'Punjab', halqas: [] },
  { code: '34101', name: 'Gujranwala', province: 'Punjab', halqas: [] },
  { code: '36101', name: 'Multan', province: 'Punjab', halqas: ['NA-148', 'NA-149', 'NA-150', 'NA-151'] },
  { code: '81101', name: 'Muzaffarabad', province: 'Azad Jammu & Kashmir', halqas: [] },
  { code: '82101', name: 'Mirpur', province: 'Azad Jammu & Kashmir', halqas: [] },
  { code: '71101', name: 'Gilgit', province: 'Gilgit-Baltistan', halqas: [] },
  { code: '72101', name: 'Skardu', province: 'Gilgit-Baltistan', halqas: [] },
  { code: '90001', name: 'Overseas Pakistani (NICOP)', province: OVERSEAS_PROVINCE, halqas: [], isOverseas: true },
  { code: '90101', name: 'Overseas Pakistani — Middle East', province: OVERSEAS_PROVINCE, halqas: [], isOverseas: true },
  { code: '90201', name: 'Overseas Pakistani — Europe', province: OVERSEAS_PROVINCE, halqas: [], isOverseas: true },
  { code: '90301', name: 'Overseas Pakistani — North America', province: OVERSEAS_PROVINCE, halqas: [], isOverseas: true },
  { code: '90401', name: 'Overseas Pakistani — Asia Pacific', province: OVERSEAS_PROVINCE, halqas: [], isOverseas: true },
  { code: '90501', name: 'Overseas Pakistani — Africa', province: OVERSEAS_PROVINCE, halqas: [], isOverseas: true },
];

const normalizeCnic = (value) => String(value || '').replace(/\D/g, '');

const normalizeHalqaId = (value) => String(value || '').trim().toUpperCase();

const getDistrictByCode = (code) => DISTRICTS.find((district) => district.code === String(code || '').trim());

const buildResult = (base, prefix5, detectionLevel) => ({
  code: prefix5,
  name: base.name,
  province: base.province,
  division: base.division || null,
  halqas: base.halqas || [],
  detectionLevel,
  isOverseas: Boolean(base.isOverseas),
});

/**
 * Decode CNIC geographic area from first 5 digits.
 * Always resolves for valid domestic (1–8) and overseas (90xxx) CNIC prefixes.
 */
const detectDistrictFromCnic = (cnic) => {
  const normalized = normalizeCnic(cnic);
  if (normalized.length < 5) return null;

  const prefix5 = normalized.slice(0, 5);
  const prefix2 = Number(prefix5.slice(0, 2));

  const exact = getDistrictByCode(prefix5);
  if (exact) {
    return buildResult(exact, prefix5, 'exact');
  }

  if (isOverseasPrefix(prefix5)) {
    return buildResult(
      {
        name: getOverseasLabel(prefix5),
        province: OVERSEAS_PROVINCE,
        halqas: [],
        isOverseas: true,
      },
      prefix5,
      'overseas'
    );
  }

  const special = resolveSpecialPrefix(prefix5);
  if (special) {
    return buildResult(special, prefix5, 'district');
  }

  const fromPrefix3 = resolveFromPrefix3(prefix5);
  if (fromPrefix3) {
    return buildResult(fromPrefix3, prefix5, 'district');
  }

  if (DIVISIONS[prefix2]) {
    const division = DIVISIONS[prefix2];
    return buildResult(
      { name: `${division.name} Division`, province: division.province, division: division.name },
      prefix5,
      'division'
    );
  }

  const provinceDigit = prefix5[0];
  if (isValidCnicProvinceDigit(provinceDigit)) {
    const provinceName = getProvinceFromDigit(provinceDigit);
    return buildResult(
      { name: provinceName, province: provinceName },
      prefix5,
      'province'
    );
  }

  return null;
};

const getHalqasForDistrict = (districtCode) => {
  const district = getDistrictByCode(districtCode);
  return district ? district.halqas : [];
};

const isValidHalqaForDistrict = (districtCode, halqaId) => {
  const normalizedHalqa = normalizeHalqaId(halqaId);
  return getHalqasForDistrict(districtCode).includes(normalizedHalqa);
};

const buildDistrictResponse = (district) => {
  if (!district) return null;
  return {
    code: district.code,
    name: district.name,
    province: district.province,
    division: district.division || null,
    halqas: district.halqas || [],
    detectionLevel: district.detectionLevel || 'exact',
    isOverseas: Boolean(district.isOverseas),
  };
};

const getAllDistrictOptions = () => {
  const { DIVISION_DISTRICTS, DIVISIONS: DIVS } = require('./cnicRegionData');
  const seen = new Set();
  const options = [];

  const add = (entry) => {
    const key = `${entry.name}|${entry.province}`;
    if (seen.has(key)) return;
    seen.add(key);
    options.push(buildDistrictResponse(entry));
  };

  DISTRICTS.forEach(add);

  Object.entries(DIVISION_DISTRICTS).forEach(([divCode, districtNames]) => {
    const division = DIVS[Number(divCode)];
    if (!division) return;
    districtNames.forEach((name) => {
      add({ code: '', name, province: division.province, division: division.name, halqas: [] });
    });
  });

  return options.sort((a, b) => a.province.localeCompare(b.province) || a.name.localeCompare(b.name));
};

/** List all provinces + overseas for public API */
const getAllProvinces = () => {
  const { PROVINCES } = require('./cnicRegionData');
  return [
    ...Object.entries(PROVINCES).map(([code, name]) => ({ code, name, type: 'province' })),
    { code: '90', name: OVERSEAS_PROVINCE, type: 'overseas' },
  ];
};

module.exports = {
  DISTRICTS,
  normalizeCnic,
  normalizeHalqaId,
  getDistrictByCode,
  detectDistrictFromCnic,
  getHalqasForDistrict,
  isValidHalqaForDistrict,
  buildDistrictResponse,
  getAllDistrictOptions,
  getAllProvinces,
};
