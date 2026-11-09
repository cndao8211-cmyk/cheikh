import React, { useState } from 'react';
import { Building2, DollarSign, TrendingUp, ShieldCheck, CreditCard, Sparkles, CheckCircle2, ShoppingCart, Award, Users, BookOpen, Layers } from 'lucide-react';
import { MobileMoneyPayment } from './MobileMoneyPayment';
import { MembersDirectory } from './MembersDirectory';

interface CompanyHoldingProps {
  onLaunchGame: () => void;
  onOpenVideoStudio: () => void;
  onOpenMaps: () => void;
  onOpenMusic: () => void;
  onOpenVoice: () => void;
}

export const CompanyHolding: React.FC<CompanyHoldingProps> = ({
  onLaunchGame,
  onOpenVideoStudio,
  onOpenMaps,
  onOpenMusic,
  onOpenVoice,
}) => {
  const [subscribersCount, setSubscribersCount] = useState<number>(2500);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<{
    id: 'monthly' | 'enterprise' | 'custom';
    title: string;
    amountCFA: number;
  }>({
    id: 'monthly',
    title: 'اشتراك منصة IE المعتمد الشامل لطلاب السنغال',
    amountCFA: 5000,
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  // Revenue calculation metrics based on 5,000 FCFA per student
  const pricePerStudentAvg = 5000; // 5,000 FCFA per student as set by Cheikh Tidiane Ndao
  const annualGrossRevenueCFA = subscribersCount * pricePerStudentAvg;
  const estimatedCostCFA = annualGrossRevenueCFA * 0.20; // 20% infrastructure & operations
  const netProfitCFA = annualGrossRevenueCFA - estimatedCostCFA;
  const netProfitUSD = Math.round(netProfitCFA / 610); // approximate conversion 1 USD = 610 XOF

  const handleCheckout = (
    planId: 'monthly' | 'enterprise' | 'custom',
    amount: number,
    title: string
  ) => {
    setSelectedPlanForPayment({
      id: planId,
      title,
      amountCFA: amount,
    });
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* Company Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-800 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-xs font-bold text-emerald-300">
              <Building2 className="w-4 h-4" />
              <span>مجموعة ومؤسسات IE القابضة (IE Group Holding)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              منظومة شركة <span className="text-emerald-400">IE</span> المتكاملة ونموذج الربحية والاستثمار
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              المؤسس والمشرف العام: <strong className="text-white">فضيلة الشيخ تيجان ا نداو</strong>. ندمج التعليم واللغة والتاريخ والجغرافيا مع التقنيات المستقبلية (الألعاب ثلاثية الأبعاد، واستوديو الفيديو، والخرائط الحية، والصوتيات) في منظومة أعمال تجارية رابحة تخدم طلاب وأسواق السنغال وغرب إفريقيا.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700 text-center min-w-[220px] shrink-0 space-y-1">
            <span className="text-xs text-stone-400 block">صافي الأرباح السنوية المتوقعة</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
              {netProfitCFA.toLocaleString()} <span className="text-xs text-stone-300 font-normal">FCFA</span>
            </div>
            <span className="text-xs text-stone-400 font-mono tabular-nums">~ ${netProfitUSD.toLocaleString()} USD</span>
          </div>
        </div>

        {/* 6 Strategic Company Sectors Quick Launcher */}
        <div>
          <h3 className="text-xs font-bold text-stone-400 mb-3">قطاعات ومجالات أعمال الشركة (6 مجالات استراتيجية):</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              className="p-3.5 rounded-xl bg-stone-800/70 hover:bg-stone-700/80 border border-stone-700 text-right text-xs transition-all space-y-1"
            >
              <div className="text-emerald-400 font-bold">1. التعليم والجامع</div>
              <div className="text-[11px] text-stone-400">منصة العربية والتاريخ</div>
            </button>

            <button
              onClick={onLaunchGame}
              className="p-3.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700 text-right text-xs transition-all space-y-1"
            >
              <div className="text-emerald-300 font-bold">2. الألعاب 3D</div>
              <div className="text-[11px] text-stone-400">قوافل السنغال Three.js</div>
            </button>

            <button
              onClick={onOpenVideoStudio}
              className="p-3.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700 text-right text-xs transition-all space-y-1"
            >
              <div className="text-purple-300 font-bold">3. استوديو الفيديو</div>
              <div className="text-[11px] text-stone-400">Omni Flash Video</div>
            </button>

            <button
              onClick={onOpenMaps}
              className="p-3.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-700 text-right text-xs transition-all space-y-1"
            >
              <div className="text-sky-300 font-bold">4. الخرائط الحية</div>
              <div className="text-[11px] text-stone-400">Google Maps Grounding</div>
            </button>

            <button
              onClick={onOpenMusic}
              className="p-3.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-700 text-right text-xs transition-all space-y-1"
            >
              <div className="text-rose-300 font-bold">5. الأناشيد والموسيقى</div>
              <div className="text-[11px] text-stone-400">Google Lyria Audio</div>
            </button>

            <button
              onClick={onOpenVoice}
              className="p-3.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700 text-right text-xs transition-all space-y-1"
            >
              <div className="text-amber-300 font-bold">6. المحادثة الحية</div>
              <div className="text-[11px] text-stone-400">Gemini Live Voice</div>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Revenue & Profit Calculator */}
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-200 dark:border-stone-700 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>حاسبة الإيرادات والنمو المالي لشركة IE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
            محاكي الأرباح التجارية وعوائد الاشتراكات بالسنغال
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            عدّل عدد الطلاب المشتركين في السنغال وغرب إفريقيا لمشاهدة التوقعات المالية الفورية لشركتك.
          </p>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200">
            <span>عدد الطلاب والمشتركين النشطين:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-black text-base tabular-nums">
              {subscribersCount.toLocaleString()} طالب ومعهد
            </span>
          </div>

          <input
            type="range"
            min={500}
            max={50000}
            step={500}
            value={subscribersCount}
            onChange={(e) => setSubscribersCount(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-stone-400 font-mono">
            <span>500 طالب</span>
            <span>25,000 طالب</span>
            <span>50,000 طالب</span>
          </div>
        </div>

        {/* Financial Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <span className="text-xs text-stone-500">إجمالي الإيرادات السنوية (Gross Revenue):</span>
            <div className="text-xl font-bold text-stone-900 dark:text-white tabular-nums mt-1">
              {annualGrossRevenueCFA.toLocaleString()} FCFA
            </div>
            <span className="text-[11px] text-stone-400">متوسط 15,000 فرنك لكل طالب سنوياً</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <span className="text-xs text-stone-500">التكاليف التشغيلية (28% Servers & Tech):</span>
            <div className="text-xl font-bold text-stone-600 dark:text-stone-300 tabular-nums mt-1">
              {estimatedCostCFA.toLocaleString()} FCFA
            </div>
            <span className="text-[11px] text-stone-400">استضافة وسيرفرات وحوافز المشرفين</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">صافي الربح التجاري للشركة (Net Profit):</span>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums mt-1">
              {netProfitCFA.toLocaleString()} FCFA
            </div>
            <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
              هامش ربحي فائق يبلغ 72%
            </span>
          </div>
        </div>
      </div>

      {/* Commercial Plans & Subscriptions (Monetization Store) */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
            باقات الاشتراك ومبيعات متجر IE التجاري
          </h2>
          <p className="text-xs text-stone-500">
            قنوات الدخل المباشرة لشركة ومعهد IE مع دعم وسائل الدفع الإلكتروني في السنغال (Wave, Orange Money).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Sole Student Plan: 5,000 FCFA */}
          <div className="lg:col-span-7 bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 text-white rounded-3xl border-2 border-emerald-500 p-8 flex flex-col justify-between space-y-6 shadow-xl relative">
            <div className="absolute -top-3.5 right-6 px-4 py-1 rounded-full bg-amber-400 text-stone-950 font-black text-xs shadow-md">
              الاشتراك الشامل المعتمد لجميع طلاب السنغال · 5,000 FCFA فقط
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
                <div>
                  <span className="text-xs text-emerald-300 font-bold block">منظومة معهد IE بإشراف الشيخ تيجان ا نداو</span>
                  <h3 className="text-2xl font-black text-white">الاشتراك الأكاديمي الشامل (IE Student All-Inclusive)</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-black text-amber-300 tabular-nums">
                    5,000 <span className="text-xs font-normal text-emerald-200">FCFA</span>
                  </div>
                  <span className="text-[11px] text-emerald-300">في متناول كل طالب علم</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                بتوجيه من <strong>فضيلة الشيخ تيجان ا نداو</strong>، تم اعتماد مبلغ رمزي موحد (5,000 فرنك فقط) لتمكين كافة أبناء وبنات السنغال في الجامع والمدارس والمعاهد من الوصول الكامل لجميع العلوم والامتحانات:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-100 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>دروس النحو، الصرف، البلاغة، والشعر السنغالي</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>تاريخ السنغال والممالك والخرائط الحية الـ 14</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>بنك امتحانات البكالوريا مع التصحيح الفوري</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>مرشد الشيخ تيجان الذكي والمحادثة الصوتية</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>الخدمات الأكاديمية: تصحيح المقال والعروض</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>إصدار بطاقة العضوية والترخيص المعتمد فوراً</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCheckout('monthly', 5000, 'الاشتراك الأكاديمي الشامل لطلاب السنغال')}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-stone-950" />
              <span>تأكيد الدفع وتفعيل الاشتراك (5,000 FCFA فقط)</span>
            </button>
          </div>

          {/* Institutional License: 150,000 FCFA */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-800/80 rounded-3xl border border-stone-200 dark:border-stone-700 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs text-stone-500 font-semibold block">المعاهد القرآنية والجامعات والمدارس الكبرى</span>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">رخصة المعهد والمؤسسة (IE Daara & Enterprise)</h3>
              <div className="text-3xl font-black text-stone-900 dark:text-white tabular-nums">
                150,000 <span className="text-xs font-normal text-stone-500">FCFA / سنة</span>
              </div>
              <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-2.5 pt-2 border-t border-stone-100 dark:border-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>رخصة تشغيل لكافة طلاب المعهد (حتى 200 طالب)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>لوحة متابعة إدارية خاصة بمدرسي ومشرفي المعهد</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>تنسيق ومتابعة مع فضيلة الشيخ تيجان ا نداو</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('enterprise', 150000, 'رخصة معهد ومؤسسة تعليمية كاملة')}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              شراء رخصة المعهد (150,000 FCFA)
            </button>
          </div>
        </div>
      </div>

      {/* High-Capacity Members Management Directory for Senegal (Wave & Orange Money) */}
      <MembersDirectory />

      {/* Mobile Money Payment & Registration Modal */}
      <MobileMoneyPayment
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        defaultPlan={selectedPlanForPayment}
      />
    </div>
  );
};
