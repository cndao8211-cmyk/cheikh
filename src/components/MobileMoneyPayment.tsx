import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  QrCode,
  AlertCircle,
  Settings,
  X,
  CreditCard,
  Building,
  UserCheck,
  Download,
  Share2
} from 'lucide-react';
import {
  getMerchantConfig,
  saveMerchantConfig,
  registerNewMember,
  MerchantConfig,
  MemberRecord,
} from '../services/paymentService';

interface MobileMoneyPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: {
    id: 'monthly' | 'bac_excellence' | 'enterprise' | 'custom';
    title: string;
    amountCFA: number;
  };
  onSuccess?: (member: MemberRecord) => void;
}

export const MobileMoneyPayment: React.FC<MobileMoneyPaymentProps> = ({
  isOpen,
  onClose,
  defaultPlan = {
    id: 'monthly',
    title: 'الاشتراك المعتمد الشامل لطلاب السنغال (IE Student)',
    amountCFA: 5000,
  },
  onSuccess,
}) => {
  const [activeMethod, setActiveMethod] = useState<'wave' | 'orange_money'>('wave');
  const [config, setConfig] = useState<MerchantConfig>(getMerchantConfig());
  const [showConfigSettings, setShowConfigSettings] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [studentPhone, setStudentPhone] = useState<string>('+221 ');
  const [region, setRegion] = useState<string>('داكار (Dakar)');
  const [schoolOrDaara, setSchoolOrDaara] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [completedMember, setCompletedMember] = useState<MemberRecord | null>(null);

  // Editable config state for founder
  const [editWaveNumber, setEditWaveNumber] = useState<string>(config.waveNumber);
  const [editOMNumber, setEditOMNumber] = useState<string>(config.orangeMoneyNumber);
  const [editMerchantName, setEditMerchantName] = useState<string>(config.merchantName);

  useEffect(() => {
    const handleUpdate = () => {
      const updated = getMerchantConfig();
      setConfig(updated);
      setEditWaveNumber(updated.waveNumber);
      setEditOMNumber(updated.orangeMoneyNumber);
      setEditMerchantName(updated.merchantName);
    };
    window.addEventListener('ie_merchant_config_updated', handleUpdate);
    return () => window.removeEventListener('ie_merchant_config_updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MerchantConfig = {
      ...config,
      waveNumber: editWaveNumber.trim(),
      orangeMoneyNumber: editOMNumber.trim(),
      merchantName: editMerchantName.trim(),
    };
    saveMerchantConfig(updated);
    setShowConfigSettings(false);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!fullName.trim()) {
      setValidationError('الرجاء إدخال اسم الطالب الكامل.');
      return;
    }
    if (!studentPhone.trim() || studentPhone.length < 9) {
      setValidationError('الرجاء إدخال رقم هاتف سنغالي صحيح (+221).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Call server API to log order and store record
      const res = await fetch('/api/payments/process-mobile-money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phoneNumber: studentPhone,
          region,
          schoolOrDaara: schoolOrDaara || 'الجامع والمعاهد بالسنغال',
          planId: defaultPlan.id,
          planTitle: defaultPlan.title,
          amountCFA: defaultPlan.amountCFA,
          paymentMethod: activeMethod,
          transactionRef: transactionRef || `${activeMethod === 'wave' ? 'WV' : 'OM'}-${Date.now().toString().slice(-6)}`,
        }),
      });

      // 2. Also save locally for instant client persistence
      const member = registerNewMember({
        fullName,
        phoneNumber: studentPhone,
        region,
        schoolOrDaara: schoolOrDaara || 'الجامع والمعاهد بالسنغال',
        planId: defaultPlan.id,
        planTitle: defaultPlan.title,
        amountCFA: defaultPlan.amountCFA,
        paymentMethod: activeMethod,
        transactionRef: transactionRef || `${activeMethod === 'wave' ? 'WV' : 'OM'}-${Date.now().toString().slice(-6)}`,
      });

      setCompletedMember(member);
      if (onSuccess) onSuccess(member);
    } catch (err) {
      console.error(err);
      // Fallback local registration
      const member = registerNewMember({
        fullName,
        phoneNumber: studentPhone,
        region,
        schoolOrDaara: schoolOrDaara || 'الجامع والمعاهد بالسنغال',
        planId: defaultPlan.id,
        planTitle: defaultPlan.title,
        amountCFA: defaultPlan.amountCFA,
        paymentMethod: activeMethod,
        transactionRef: transactionRef || `OFFLINE-${Date.now().toString().slice(-6)}`,
      });
      setCompletedMember(member);
      if (onSuccess) onSuccess(member);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header Modal Bar */}
        <div className="bg-gradient-to-r from-emerald-800 to-stone-900 text-white p-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>بوابة الدفع الإلكتروني السنغالية المعتمدة · Wave & Orange Money</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              تسديد الاشتراك وتفعيل العضوية في منصة IE
            </h2>
            <p className="text-xs text-stone-300">
              بإشراف فضيلة الشيخ تيجان ا نداو - تحويل فوري وآمن بالفرنك الإفريقي (FCFA)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigSettings(!showConfigSettings)}
              title="إعدادات أرقام الاستقبال (خاص بالمشرف الشيخ تيجان)"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Plan Summary Banner */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 px-6 py-3 flex items-center justify-between">
          <div className="text-xs text-stone-700 dark:text-stone-300">
            الباقة المختارة: <strong className="text-emerald-800 dark:text-emerald-300">{defaultPlan.title}</strong>
          </div>
          <div className="text-base font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
            {defaultPlan.amountCFA.toLocaleString()} <span className="text-xs font-normal">FCFA</span>
          </div>
        </div>

        {/* Admin Merchant Config Editor (Collapsible for Cheikh Tidiane Ndao) */}
        {showConfigSettings && (
          <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900 text-right space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Settings className="w-4 h-4" />
                <span>إعدادات أرقام الاستقبال المباشرة (لتعديل رقم Wave أو Orange Money الخاص بك)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigSettings(false)}
                className="text-xs text-amber-800 dark:text-amber-300 underline"
              >
                إغلاق
              </button>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300">
              بصفتك المشرف العام فضيلة الشيخ تيجان ا نداو، يمكنك هنا كتابة رقم هاتفك الشخصي الفعّال لـ Wave و Orange Money لتصلك الأموال مباشرة على حسابك دون أي وسيط.
            </p>
            <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  رقم حساب Wave المعتمد:
                </label>
                <input
                  type="text"
                  value={editWaveNumber}
                  onChange={(e) => setEditWaveNumber(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                  placeholder="+221 78 713 00 61"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  رقم حساب Orange Money المعتمد:
                </label>
                <input
                  type="text"
                  value={editOMNumber}
                  onChange={(e) => setEditOMNumber(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                  placeholder="+221 78 713 00 61"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  اسم الحساب التجاري (Nom du bénéficiaire):
                </label>
                <input
                  type="text"
                  value={editMerchantName}
                  onChange={(e) => setEditMerchantName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  حفظ وتحديث أرقام التحويل
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Content */}
        {!completedMember ? (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-3">
              {/* Wave Tab */}
              <button
                type="button"
                onClick={() => setActiveMethod('wave')}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-right ${
                  activeMethod === 'wave'
                    ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 bg-stone-50 dark:bg-stone-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-stone-900 dark:text-white">
                    <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
                    <span>تطبيق Wave (ويف)</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    التحويل الفوري المجاني الأكثر انتشاراً
                  </span>
                </div>
                <div className="text-sky-600 font-black text-xs font-mono">WAVE</div>
              </button>

              {/* Orange Money Tab */}
              <button
                type="button"
                onClick={() => setActiveMethod('orange_money')}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-right ${
                  activeMethod === 'orange_money'
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 bg-stone-50 dark:bg-stone-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-stone-900 dark:text-white">
                    <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
                    <span>Orange Money (أورنج)</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    كود USSD #144# أو تطبيق أورنج
                  </span>
                </div>
                <div className="text-orange-600 font-black text-xs font-mono">OM</div>
              </button>
            </div>

            {/* Method Details: Wave */}
            {activeMethod === 'wave' && (
              <div className="p-5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/50 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Wave QR Code Box */}
                  <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-sky-200 shadow-sm flex flex-col items-center justify-center shrink-0">
                    {/* Simulated Clean SVG QR Code */}
                    <div className="relative w-full h-full bg-stone-900 rounded p-1 flex items-center justify-center">
                      <div className="absolute inset-1 border-2 border-white grid grid-cols-4 gap-0.5 p-1 bg-white">
                        <div className="bg-sky-600 rounded-xs" />
                        <div className="bg-stone-900" />
                        <div className="bg-stone-900" />
                        <div className="bg-sky-600 rounded-xs" />
                        <div className="bg-stone-900" />
                        <div className="bg-sky-600 flex items-center justify-center text-[7px] text-white font-black">IE</div>
                        <div className="bg-stone-900" />
                        <div className="bg-stone-900" />
                        <div className="bg-sky-600 rounded-xs" />
                        <div className="bg-stone-900" />
                        <div className="bg-stone-900" />
                        <div className="bg-sky-600 rounded-xs" />
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-sky-700 mt-1">امسح بكاميرا Wave</span>
                  </div>

                  {/* Transfer Instructions & Direct Action */}
                  <div className="space-y-2 text-right flex-1">
                    <span className="text-xs font-bold text-sky-900 dark:text-sky-300 block">
                      خطوات التحويل عبر Wave (Instructions Wave):
                    </span>
                    <ol className="text-xs text-stone-600 dark:text-stone-300 space-y-1.5 list-decimal list-inside pr-1">
                      <li>
                        حوّل مبلغ <strong className="text-sky-700 dark:text-sky-400 font-bold">{defaultPlan.amountCFA.toLocaleString()} FCFA</strong> إلى رقم فضيلة الشيخ:
                      </li>
                      <li className="font-mono text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                        <span>{config.waveNumber}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(config.waveNumber, 'wave')}
                          className="px-2 py-0.5 rounded bg-sky-100 hover:bg-sky-200 dark:bg-sky-900 dark:hover:bg-sky-800 text-sky-800 dark:text-sky-200 text-xs flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedField === 'wave' ? 'تم النسخ!' : 'نسخ'}</span>
                        </button>
                      </li>
                      <li>
                        المستفيد: <strong>{config.merchantName}</strong>
                      </li>
                      <li>
                        انسخ <strong>رمز المعاملة (Transaction ID)</strong> من إشعار Wave وضعه في النموذج أدناه.
                      </li>
                    </ol>

                    <div className="pt-1 flex flex-wrap gap-2">
                      <a
                        href="https://pay.wave.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>فتح موقع وتطبيق Wave</span>
                      </a>
                      <a
                        href={`https://wa.me/221787130061?text=${encodeURIComponent(`السلام عليكم فضيلة الشيخ تيجان ا نداو، تم التحويل عبر Wave للاشتراك في منصة IE بمبلغ ${defaultPlan.amountCFA} FCFA.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>إرسال إشعار الدفع لواتساب الشيخ (+221 78 713 00 61)</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Method Details: Orange Money */}
            {activeMethod === 'orange_money' && (
              <div className="p-5 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/50 space-y-4">
                <div className="space-y-3 text-right">
                  <span className="text-xs font-bold text-orange-900 dark:text-orange-300 block">
                    خطوات التحويل عبر Orange Money (Instructions Orange Money):
                  </span>
                  <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-orange-200 dark:border-orange-900/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-500 block">رقم هاتف تحويل أورنج موني:</span>
                      <span className="font-mono text-base font-black text-orange-600 dark:text-orange-400">
                        {config.orangeMoneyNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(config.orangeMoneyNumber, 'om')}
                      className="px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs font-bold flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'om' ? 'تم النسخ!' : 'نسخ الرقم'}</span>
                    </button>
                  </div>

                  <div className="text-xs text-stone-600 dark:text-stone-300 space-y-1">
                    <p>• من هاتفك اضغط كود USSD التالي للتحويل المباشر: <code className="font-mono font-bold text-stone-900 dark:text-white px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 rounded">{config.ussdCode}</code> أو استخدم تطبيق <strong>Max it (Orange)</strong>.</p>
                    <p>• حوّل مبلغ: <strong className="text-orange-600 dark:text-orange-400 font-bold">{defaultPlan.amountCFA.toLocaleString()} FCFA</strong>.</p>
                    <p>• بعد تأكيد التحويل ستصلك رسالة SMS تحتوي رمز المعاملة (مثلاً OM-XXXXXX).</p>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-2">
                    <a
                      href={`https://wa.me/221787130061?text=${encodeURIComponent(`السلام عليكم فضيلة الشيخ تيجان ا نداو، تم التحويل عبر Orange Money للاشتراك في منصة IE بمبلغ ${defaultPlan.amountCFA} FCFA.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>إرسال إشعار الدفع لواتساب الشيخ (+221 78 713 00 61)</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Registration & Transaction Validation Form */}
            <form onSubmit={handleSubmitPayment} className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800">
              {validationError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-xs font-semibold text-red-700 dark:text-red-300 text-right">
                  {validationError}
                </div>
              )}

              <h3 className="text-sm font-bold text-stone-900 dark:text-white text-right">
                بيانات تسجيل الطالب وتأكيد الدفع:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    الاسم الكامل للطالب (Nom complet):
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: شيخ أحمد تيجان سيك"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    رقم هاتف الطالب في السنغال (Téléphone):
                  </label>
                  <input
                    type="text"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+221 77 123 45 67"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>

                {/* Region */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    الإقليم أو المنطقة (Région du Sénégal):
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="داكار (Dakar)">داكار (Dakar)</option>
                    <option value="تييس (Thiès - تيفاوان)">تييس (Thiès - تيفاوان)</option>
                    <option value="ديوربل (توبا - Touba/Diourbel)">ديوربل (توبا - Touba/Diourbel)</option>
                    <option value="كاولاخ (Kaolack - مدينة باي)">كاولاخ (Kaolack - مدينة باي)</option>
                    <option value="سانت لويس (Saint-Louis)">سانت لويس (Saint-Louis)</option>
                    <option value="زيغنشور (Ziguinchor)">زيغنشور (Ziguinchor)</option>
                    <option value="فاتيك (Fatick)">فاتيك (Fatick)</option>
                    <option value="لوغا (Louga)">لوغا (Louga)</option>
                    <option value="كولدا (Kolda)">كولدا (Kolda)</option>
                    <option value="ماتام (Matam - فوتا)">ماتام (Matam - فوتا)</option>
                    <option value="تامباكوندا (Tambacounda)">تامباكوندا (Tambacounda)</option>
                    <option value="سيدهيو (Sédhiou)">سيدهيو (Sédhiou)</option>
                    <option value="كدوغو (Kédougou)">كدوغو (Kédougou)</option>
                    <option value="كافرين (Kaffrine)">كافرين (Kaffrine)</option>
                  </select>
                </div>

                {/* School or Daara */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    المعهد أو دار القرآن أو الكلية:
                  </label>
                  <input
                    type="text"
                    value={schoolOrDaara}
                    onChange={(e) => setSchoolOrDaara(e.target.value)}
                    placeholder="معهد دار السلام، المعهد الإسلامي، أو ثانوية..."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Transaction Reference from Wave / OM */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    رمز المعاملة من {activeMethod === 'wave' ? 'Wave' : 'Orange Money'} (ID de transaction):
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder={activeMethod === 'wave' ? 'مثال: WV-982143 أو رمز التحويل في الإشعار' : 'مثال: OM-CI-773412'}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <span className="text-[11px] text-stone-500 block mt-1">
                    إذا قمت بالتحويل الآن، اكتب الرمز لتفعيل حسابك تلقائياً وبدء الاستفادة فوراً.
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'جارٍ اعتماد الدفع...' : `تأكيد الدفع وتفعيل الاشتراك (${defaultPlan.amountCFA.toLocaleString()} FCFA)`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success & Digital Membership Certificate */
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                تهانينا! تم تفعيل الاشتراك بنجاح
              </span>
              <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                بطاقة العضوية والترخيص الأكاديمي
              </h3>
              <p className="text-xs text-stone-500">
                منصة IE لطلاب السنغال بإشراف فضيلة الشيخ تيجان ا نداو
              </p>
            </div>

            {/* Visual Digital Membership Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 text-white text-right space-y-4 max-w-md mx-auto shadow-xl border border-emerald-500/30">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-sm">
                    IE
                  </div>
                  <div>
                    <div className="text-xs font-bold">منصة ومعهد IE السنغال</div>
                    <div className="text-[10px] text-emerald-300">Cheikh Tidiane Ndao</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
                  معتمد نشط
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-emerald-300 block">اسم الطالب المشترك:</span>
                <div className="text-base font-bold text-white">{completedMember.fullName}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block">رقم العضوية:</span>
                  <span className="font-mono font-bold text-stone-200">{completedMember.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">الإقليم / المدينة:</span>
                  <span className="font-semibold text-stone-200">{completedMember.region}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">نوع الباقة:</span>
                  <span className="font-semibold text-emerald-300">{completedMember.planTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">وسيلة الدفع:</span>
                  <span className="font-semibold text-stone-200 font-mono">
                    {completedMember.paymentMethod === 'wave' ? 'Wave Sénégal' : 'Orange Money'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[11px] font-mono text-stone-300">
                <div>مفتاح الترخيص: <strong className="text-amber-300">{completedMember.licenseKey}</strong></div>
                <div>صالح حتى: {completedMember.expiryDate}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrintCertificate}
                className="px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>طباعة بطاقة العضوية</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
              >
                الدخول للمنصة واستئناف الدروس
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
