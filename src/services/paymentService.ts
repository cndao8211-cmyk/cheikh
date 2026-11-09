/**
 * Payment and Member Management Service for IE Holding & Educational Platform
 * Specifically optimized for Senegal Mobile Money ecosystems: Wave & Orange Money
 * Under supervision of Cheikh Tidiane Ndao (فضيلة الشيخ تيجان ا نداو)
 */

export interface MerchantConfig {
  waveNumber: string;
  orangeMoneyNumber: string;
  merchantName: string;
  merchantEmail: string;
  ussdCode: string;
  currency: string;
}

export interface MemberRecord {
  id: string;
  fullName: string;
  phoneNumber: string;
  region: string;
  schoolOrDaara: string;
  planId: 'monthly' | 'bac_excellence' | 'enterprise' | 'custom';
  planTitle: string;
  amountCFA: number;
  paymentMethod: 'wave' | 'orange_money' | 'cash';
  transactionRef: string;
  status: 'active' | 'pending_verification' | 'expired';
  registrationDate: string;
  expiryDate: string;
  licenseKey: string;
}

const DEFAULT_CONFIG: MerchantConfig = {
  waveNumber: '+221 78 713 00 61',
  orangeMoneyNumber: '+221 78 713 00 61',
  merchantName: 'فضيلة الشيخ تيجان ا نداو / Cheikh Tidiane Ndao',
  merchantEmail: 'cndao8211@gmail.com',
  ussdCode: '#144#399#',
  currency: 'FCFA',
};

// Seed realistic initial members representing diverse regions and Islamic institutes across Senegal
const INITIAL_MEMBERS: MemberRecord[] = [
  {
    id: 'MEM-221-001',
    fullName: 'مامادو لمين سيسيه (Mamadou Lamine Cissé)',
    phoneNumber: '+221 77 845 12 90',
    region: 'داكار (Dakar)',
    schoolOrDaara: 'معهد داكار الإسلامي العالي',
    planId: 'bac_excellence',
    planTitle: 'باقة الامتياز للبكالوريا',
    amountCFA: 25000,
    paymentMethod: 'wave',
    transactionRef: 'WV-SN-982143',
    status: 'active',
    registrationDate: '2026-05-12',
    expiryDate: '2026-11-12',
    licenseKey: 'IE-BAC-98214-SN',
  },
  {
    id: 'MEM-221-002',
    fullName: 'فاطمة الزهراء غي (Fatou Gaye)',
    phoneNumber: '+221 78 312 44 55',
    region: 'تييس (Thiès)',
    schoolOrDaara: 'معهد الحاج مالك سي - تيفاوان',
    planId: 'monthly',
    planTitle: 'الاشتراك الشهري للغة العربية',
    amountCFA: 5000,
    paymentMethod: 'orange_money',
    transactionRef: 'OM-CI-773412',
    status: 'active',
    registrationDate: '2026-05-10',
    expiryDate: '2026-06-10',
    licenseKey: 'IE-MTH-77341-SN',
  },
  {
    id: 'MEM-221-003',
    fullName: 'سيرين مصطفى امباكي (Serigne Moustapha Mbacké)',
    phoneNumber: '+221 76 119 88 77',
    region: 'ديوربل (توبا - Touba)',
    schoolOrDaara: 'دار المعارف القرآنية بتوبا',
    planId: 'enterprise',
    planTitle: 'رخصة معهد متكامل',
    amountCFA: 150000,
    paymentMethod: 'wave',
    transactionRef: 'WV-SN-110945',
    status: 'active',
    registrationDate: '2026-05-01',
    expiryDate: '2027-05-01',
    licenseKey: 'IE-ENT-11094-SN',
  },
  {
    id: 'MEM-221-004',
    fullName: 'عبد الله باري (Abdoulaye Barry)',
    phoneNumber: '+221 77 560 33 22',
    region: 'سانت لويس (Saint-Louis)',
    schoolOrDaara: 'معهد نهر السنغال التاريخي',
    planId: 'bac_excellence',
    planTitle: 'باقة الامتياز للبكالوريا',
    amountCFA: 25000,
    paymentMethod: 'wave',
    transactionRef: 'WV-SN-884512',
    status: 'active',
    registrationDate: '2026-05-14',
    expiryDate: '2026-11-14',
    licenseKey: 'IE-BAC-88451-SN',
  },
  {
    id: 'MEM-221-005',
    fullName: 'عائشة نياخاتيه (Aïssatou Niakhaté)',
    phoneNumber: '+221 78 901 22 34',
    region: 'كاولاخ (Kaolack)',
    schoolOrDaara: 'معهد مدينة باي للعلوم الإسلامية',
    planId: 'monthly',
    planTitle: 'الاشتراك الشهري',
    amountCFA: 5000,
    paymentMethod: 'orange_money',
    transactionRef: 'OM-CI-554109',
    status: 'active',
    registrationDate: '2026-05-08',
    expiryDate: '2026-06-08',
    licenseKey: 'IE-MTH-55410-SN',
  },
  {
    id: 'MEM-221-006',
    fullName: 'إبراهيم ديالو (Ibrahima Diallo)',
    phoneNumber: '+221 70 411 90 88',
    region: 'زيغنشور (Ziguinchor)',
    schoolOrDaara: 'ثانوية كازامانس العربية',
    planId: 'bac_excellence',
    planTitle: 'باقة الامتياز للبكالوريا',
    amountCFA: 25000,
    paymentMethod: 'wave',
    transactionRef: 'WV-SN-443219',
    status: 'active',
    registrationDate: '2026-05-15',
    expiryDate: '2026-11-15',
    licenseKey: 'IE-BAC-44321-SN',
  },
];

const CONFIG_STORAGE_KEY = 'ie_merchant_config_v1';
const MEMBERS_STORAGE_KEY = 'ie_members_directory_v1';

export function getMerchantConfig(): MerchantConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Auto-migrate if stored config has placeholder numbers
      if (parsed.waveNumber === '+221 77 450 12 34' || parsed.orangeMoneyNumber === '+221 78 610 88 99') {
        const migrated = { ...DEFAULT_CONFIG, ...parsed, waveNumber: '+221 78 713 00 61', orangeMoneyNumber: '+221 78 713 00 61' };
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load merchant config', e);
  }
  return DEFAULT_CONFIG;
}

export function saveMerchantConfig(config: MerchantConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('ie_merchant_config_updated'));
  } catch (e) {
    console.error('Failed to save merchant config', e);
  }
}

export function getMembers(): MemberRecord[] {
  if (typeof window === 'undefined') return INITIAL_MEMBERS;
  try {
    const raw = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load members', e);
  }
  return INITIAL_MEMBERS;
}

export function saveMembers(members: MemberRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
    window.dispatchEvent(new Event('ie_members_updated'));
  } catch (e) {
    console.error('Failed to save members', e);
  }
}

export function registerNewMember(data: {
  fullName: string;
  phoneNumber: string;
  region: string;
  schoolOrDaara: string;
  planId: 'monthly' | 'bac_excellence' | 'enterprise' | 'custom';
  planTitle: string;
  amountCFA: number;
  paymentMethod: 'wave' | 'orange_money' | 'cash';
  transactionRef: string;
}): MemberRecord {
  const currentMembers = getMembers();
  const id = `MEM-221-${(currentMembers.length + 1).toString().padStart(3, '0')}`;
  const now = new Date();
  const registrationDate = now.toISOString().split('T')[0];

  // Expiry calculation: 30 days for monthly, 180 for bac, 365 for enterprise
  const expiry = new Date(now);
  if (data.planId === 'monthly') expiry.setDate(expiry.getDate() + 30);
  else if (data.planId === 'bac_excellence') expiry.setDate(expiry.getDate() + 180);
  else expiry.setDate(expiry.getDate() + 365);

  const expiryDate = expiry.toISOString().split('T')[0];
  const licenseKey = `IE-${data.planId.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}-SN`;

  const newMember: MemberRecord = {
    id,
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    region: data.region,
    schoolOrDaara: data.schoolOrDaara,
    planId: data.planId,
    planTitle: data.planTitle,
    amountCFA: data.amountCFA,
    paymentMethod: data.paymentMethod,
    transactionRef: data.transactionRef || `TR-${Date.now().toString().slice(-6)}`,
    status: 'active',
    registrationDate,
    expiryDate,
    licenseKey,
  };

  const updated = [newMember, ...currentMembers];
  saveMembers(updated);
  return newMember;
}

export function calculateMembershipStats(members: MemberRecord[]) {
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const totalRevenueCFA = members.reduce((sum, m) => sum + m.amountCFA, 0);
  const waveMembers = members.filter((m) => m.paymentMethod === 'wave').length;
  const omMembers = members.filter((m) => m.paymentMethod === 'orange_money').length;

  // Breakdown by Senegal's regions
  const regionBreakdown: Record<string, number> = {};
  for (const m of members) {
    const reg = m.region.split(' ')[0];
    regionBreakdown[reg] = (regionBreakdown[reg] || 0) + 1;
  }

  return {
    totalMembers,
    activeMembers,
    totalRevenueCFA,
    waveMembers,
    omMembers,
    regionBreakdown,
  };
}
