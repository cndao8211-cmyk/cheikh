import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Smartphone,
  MapPin,
  Building,
  CreditCard,
  TrendingUp,
  RefreshCw,
  Plus
} from 'lucide-react';
import {
  getMembers,
  calculateMembershipStats,
  registerNewMember,
  MemberRecord,
} from '../services/paymentService';
import { MobileMoneyPayment } from './MobileMoneyPayment';

export const MembersDirectory: React.FC = () => {
  const [members, setMembers] = useState<MemberRecord[]>(getMembers());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  // Sync listener
  useEffect(() => {
    const handleUpdate = () => {
      setMembers(getMembers());
    };
    window.addEventListener('ie_members_updated', handleUpdate);
    return () => window.removeEventListener('ie_members_updated', handleUpdate);
  }, []);

  const stats = calculateMembershipStats(members);

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phoneNumber.includes(searchTerm) ||
      m.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.schoolOrDaara.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.licenseKey.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion =
      selectedRegion === 'all' || m.region.includes(selectedRegion);

    const matchesPlan =
      selectedPlan === 'all' || m.planId === selectedPlan;

    const matchesStatus =
      selectedStatus === 'all' || m.status === selectedStatus;

    return matchesSearch && matchesRegion && matchesPlan && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Full Name',
      'Phone',
      'Region',
      'School/Daara',
      'Plan',
      'Amount (FCFA)',
      'Payment Method',
      'Transaction Ref',
      'Status',
      'Registration Date',
      'Expiry Date',
      'License Key',
    ];

    const rows = filteredMembers.map((m) => [
      m.id,
      `"${m.fullName.replace(/"/g, '""')}"`,
      m.phoneNumber,
      `"${m.region.replace(/"/g, '""')}"`,
      `"${m.schoolOrDaara.replace(/"/g, '""')}"`,
      `"${m.planTitle.replace(/"/g, '""')}"`,
      m.amountCFA,
      m.paymentMethod,
      m.transactionRef,
      m.status,
      m.registrationDate,
      m.expiryDate,
      m.licenseKey,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IE_Members_Senegal_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-700 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Users className="w-4 h-4" />
              <span>منظومة إدارة المشتركين والنمو الواسع (High-Capacity Member Hub)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
              سجل أعضاء واشتراكات منصة IE في السنغال
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              إدارة آلاف الطلاب والمعاهد المشتركة عبر Wave و Orange Money مع المتابعة المالية الفورية لفضيلة الشيخ تيجان ا نداو.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>تسجيل عضو / دفع جديد</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>تصدير CSV إلى Excel</span>
            </button>
          </div>
        </div>

        {/* Scalable Quantitative KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <span className="text-xs text-stone-500 block">إجمالي الأعضاء والطلاب:</span>
            <div className="text-2xl font-black text-stone-900 dark:text-white tabular-nums mt-1">
              {stats.totalMembers.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {stats.activeMembers} اشتراكاً نشطاً
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold block">
              إجمالي المداخيل المحصلة (FCFA):
            </span>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums mt-1">
              {stats.totalRevenueCFA.toLocaleString()} <span className="text-xs font-normal">FCFA</span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              عبر Wave و Orange Money
            </span>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800">
            <span className="text-xs text-sky-800 dark:text-sky-300 font-bold block">
              المشتركون عبر Wave:
            </span>
            <div className="text-2xl font-black text-sky-700 dark:text-sky-400 tabular-nums mt-1">
              {stats.waveMembers}
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              {Math.round((stats.waveMembers / Math.max(1, stats.totalMembers)) * 100)}% من إجمالي التحويلات
            </span>
          </div>

          <div className="p-4 rounded-xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800">
            <span className="text-xs text-orange-800 dark:text-orange-300 font-bold block">
              المشتركون عبر Orange Money:
            </span>
            <div className="text-2xl font-black text-orange-700 dark:text-orange-400 tabular-nums mt-1">
              {stats.omMembers}
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              {Math.round((stats.omMembers / Math.max(1, stats.totalMembers)) * 100)}% من إجمالي التحويلات
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم، الهاتف (+221)، المعهد، أو رمز المعاملة..."
              className="w-full pr-10 pl-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Region Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">كل أقاليم السنغال (14 إقليماً)</option>
              <option value="داكار">داكار (Dakar)</option>
              <option value="تييس">تييس (Thiès)</option>
              <option value="توبا">توبا / ديوربل (Touba)</option>
              <option value="كاولاخ">كاولاخ (Kaolack)</option>
              <option value="سانت لويس">سانت لويس (Saint-Louis)</option>
              <option value="زيغنشور">زيغنشور (كازامانس)</option>
              <option value="فاتيك">فاتيك (Fatick)</option>
              <option value="لوغا">لوغا (Louga)</option>
              <option value="ماتام">ماتام (Matam)</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">كل الاشتراكات</option>
              <option value="monthly">اشتراك الطلاب الشامل (5,000 FCFA)</option>
              <option value="enterprise">رخصة معهد ومؤسسة (150,000 FCFA)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشط ومعتمد</option>
              <option value="pending_verification">قيد المراجعة</option>
            </select>
          </div>
        </div>

        {/* Members Directory Table */}
        <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-700">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-100 dark:bg-stone-900/80 text-stone-600 dark:text-stone-400 border-b border-stone-200 dark:border-stone-700 font-semibold">
              <tr>
                <th className="py-3 px-4">رقم العضو</th>
                <th className="py-3 px-4">اسم الطالب</th>
                <th className="py-3 px-4">الهاتف والمنطقة</th>
                <th className="py-3 px-4">المعهد / المدرسة</th>
                <th className="py-3 px-4">الباقة والمبلغ</th>
                <th className="py-3 px-4">وسيلة الدفع والرمز</th>
                <th className="py-3 px-4">الحالة والترخيص</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-stone-900 dark:text-white">
                      {member.id}
                    </td>

                    <td className="py-3 px-4 font-semibold text-stone-900 dark:text-white">
                      {member.fullName}
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-mono text-stone-900 dark:text-white">{member.phoneNumber}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{member.region}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                      {member.schoolOrDaara}
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                        {member.amountCFA.toLocaleString()} FCFA
                      </div>
                      <div className="text-[10px] text-stone-500">{member.planTitle}</div>
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            member.paymentMethod === 'wave' ? 'bg-sky-500' : 'bg-orange-500'
                          }`}
                        />
                        <span className="font-mono">
                          {member.paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-stone-500">{member.transactionRef}</div>
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>معتمد نشط</span>
                      </span>
                      <div className="font-mono text-[10px] text-stone-400">
                        {member.licenseKey}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    لا يوجد أعضاء يطابقون شروط البحث الحالية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Directory Count Summary */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>
            عرض <strong>{filteredMembers.length}</strong> من أصل <strong>{members.length}</strong> مشتركاً مسجلاً
          </span>
          <span className="font-mono">نظام IE الآمن لتسديد الاشتراكات · Sénégal</span>
        </div>
      </div>

      {/* Payment & Registration Modal */}
      <MobileMoneyPayment
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => {
          setMembers(getMembers());
        }}
      />
    </div>
  );
};
