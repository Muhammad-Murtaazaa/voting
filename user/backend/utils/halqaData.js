const {
  DIVISIONS,
  PREFIX3_DISTRICTS,
  OVERSEAS_PREFIXES,
  isOverseasPrefix,
  getProvinceFromDigit,
} = require('./cnicRegionData');

/** Exact 5-digit entries with halqa (NA constituency) mappings */
const DISTRICTS = [
  {
    code: '35202',
    name: 'Lahore',
    province: 'Punjab',
    halqas: ['NA-118', 'NA-119', 'NA-120', 'NA-121', 'NA-122', 'NA-123', 'NA-124', 'NA-125', 'NA-126', 'NA-127', 'NA-128', 'NA-129', 'NA-130']
  },
  {
    code: '61101',
    name: 'Multan',
    province: 'Punjab',
    halqas: ['NA-148', 'NA-149', 'NA-150', 'NA-151']
  },
  {
    code: '37405',
    name: 'Rawalpindi',
    province: 'Punjab',
    halqas: ['NA-52', 'NA-53', 'NA-54', 'NA-55', 'NA-56', 'NA-57']
  },
  {
    code: '42101',
    name: 'Karachi Central',
    province: 'Sindh',
    halqas: ['NA-247', 'NA-248', 'NA-249', 'NA-250']
  },
  {
    code: '42201',
    name: 'Karachi East',
    province: 'Sindh',
    halqas: ['NA-236', 'NA-237', 'NA-238', 'NA-239']
  },
  {
    code: '42301',
    name: 'Karachi South',
    province: 'Sindh',
    halqas: ['NA-239', 'NA-240', 'NA-241', 'NA-242']
  },
  {
    code: '42401',
    name: 'Karachi West',
    province: 'Sindh',
    halqas: ['NA-243', 'NA-244', 'NA-245', 'NA-246']
  },
  {
    code: '61102',
    name: 'Hyderabad',
    province: 'Sindh',
    halqas: ['NA-218', 'NA-219', 'NA-220']
  },
  {
    code: '17301',
    name: 'Peshawar',
    province: 'Khyber Pakhtunkhwa',
    halqas: ['NA-28', 'NA-29', 'NA-30', 'NA-31', 'NA-32']
  },
  {
    code: '54400',
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    halqas: ['NA-46', 'NA-47', 'NA-48']
  },
  {
    code: '54401',
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    halqas: ['NA-46', 'NA-47', 'NA-48']
  },
  {
    code: '54402',
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    halqas: ['NA-46', 'NA-47', 'NA-48']
  },
  {
    code: '54403',
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    halqas: ['NA-46', 'NA-47', 'NA-48']
  },
  {
    code: '54404',
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    halqas: ['NA-46', 'NA-47', 'NA-48']
  },
  {
    code: '54405',
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    halqas: ['NA-46', 'NA-47', 'NA-48']
  },
  {
    code: '54406',
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    halqas: ['NA-46', 'NA-47', 'NA-48']
  },
  {
    code: '54407',
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    halqas: ['NA-46', 'NA-47', 'NA-48']
  },
  {
    code: '54408',
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    halqas: ['NA-46', 'NA-47', 'NA-48']
  },
  {
    code: '54409',
    name: 'Islamabad',
    province: 'Islamabad Capital Territory',
    halqas: ['NA-46', 'NA-47', 'NA-48']
  },
  {
    code: '13101',
    name: 'Quetta',
    province: 'Balochistan',
    halqas: ['NA-263', 'NA-264', 'NA-265']
  },
  {
    code: '90001',
    name: 'Overseas Pakistani (NICOP)',
    province: 'Overseas',
    halqas: [],
    isOverseas: true,
  },
  {
    code: '90101',
    name: 'Overseas Pakistani — Middle East',
    province: 'Overseas',
    halqas: [],
    isOverseas: true,
  },
  {
    code: '90201',
    name: 'Overseas Pakistani — Europe',
    province: 'Overseas',
    halqas: [],
    isOverseas: true,
  },
  {
    code: '90301',
    name: 'Overseas Pakistani — North America',
    province: 'Overseas',
    halqas: [],
    isOverseas: true,
  },
];

const normalizeCnic = (value) => String(value || '').replace(/\D/g, '');

const normalizeHalqaId = (value) => String(value || '').trim().toUpperCase();

const getDistrictByCode = (code) => DISTRICTS.find((district) => district.code === String(code || '').trim());

const resolveAmbiguousPrefix = (prefix5) => {
  // 61101 = Multan, 61102 = Hyderabad (same first 3 digits)
  if (prefix5.startsWith('6110')) {
    const fourth = prefix5[3];
    if (fourth === '2') {
      return { name: 'Hyderabad', province: 'Sindh' };
    }
    return { name: 'Multan', province: 'Punjab' };
  }
  return null;
};

const detectDistrictFromCnic = (cnic) => {
  const normalized = normalizeCnic(cnic);
  if (normalized.length < 5) return null;

  const prefix5 = normalized.slice(0, 5);
  const prefix3 = Number(prefix5.slice(0, 3));
  const prefix2 = Number(prefix5.slice(0, 2));

  const exact = getDistrictByCode(prefix5);
  if (exact) {
    return {
      ...exact,
      code: prefix5,
      detectionLevel: 'exact',
      isOverseas: Boolean(exact.isOverseas),
    };
  }

  if (isOverseasPrefix(prefix5)) {
    return {
      code: prefix5,
      name: OVERSEAS_PREFIXES[prefix5] || 'Overseas Pakistani (NICOP)',
      province: 'Overseas',
      halqas: [],
      detectionLevel: 'overseas',
      isOverseas: true,
    };
  }

  const ambiguous = resolveAmbiguousPrefix(prefix5);
  if (ambiguous) {
    return {
      code: prefix5,
      name: ambiguous.name,
      province: ambiguous.province,
      halqas: [],
      detectionLevel: 'district',
      isOverseas: false,
    };
  }

  if (PREFIX3_DISTRICTS[prefix3]) {
    const match = PREFIX3_DISTRICTS[prefix3];
    return {
      code: prefix5,
      name: match.name,
      province: match.province,
      halqas: [],
      detectionLevel: 'district',
      isOverseas: false,
    };
  }

  if (DIVISIONS[prefix2]) {
    const match = DIVISIONS[prefix2];
    return {
      code: prefix5,
      name: `${match.name} Division`,
      province: match.province,
      halqas: [],
      detectionLevel: 'division',
      isOverseas: false,
    };
  }

  const provinceName = getProvinceFromDigit(prefix5[0]);
  if (provinceName) {
    return {
      code: prefix5,
      name: provinceName,
      province: provinceName,
      halqas: [],
      detectionLevel: 'province',
      isOverseas: false,
    };
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
    halqas: district.halqas || [],
    detectionLevel: district.detectionLevel || 'exact',
    isOverseas: Boolean(district.isOverseas),
  };
};

/** All unique districts for admin dropdowns (exact + regional) */
const getAllDistrictOptions = () => {
  const seen = new Set();
  const options = [];

  const add = (entry) => {
    const key = `${entry.name}|${entry.province}`;
    if (seen.has(key)) return;
    seen.add(key);
    options.push(buildDistrictResponse(entry));
  };

  DISTRICTS.forEach(add);
  Object.entries(PREFIX3_DISTRICTS).forEach(([, value]) => {
    add({ code: '', name: value.name, province: value.province, halqas: [] });
  });

  return options;
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
};
