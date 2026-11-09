import React from 'react';
import { Award, BookOpen, Heart, CheckCircle2, MapPin } from 'lucide-react';

export const AboutCheikhNdao: React.FC = () => {
  return (
    <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-10 space-y-8">
      {/* Title & Introduction */}
      <div className="border-b border-stone-200 dark:border-stone-700 pb-6 text-right space-y-2">
        <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
          <span>رسالة المعهد والمؤسس</span>
          <span aria-hidden="true">·</span>
          <span>منصة IE التعليمية</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
          كلمة فضيلة الشيخ تيجان ا نداو (Cheikh Tidiane Ndao)
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm">
          المشرف العام والموجه الأكاديمي لطلاب الجامع والمعاهد في جمهورية السنغال
        </p>
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4 text-stone-700 dark:text-stone-200 text-sm sm:text-base leading-relaxed">
          <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-200 font-amiri text-lg leading-loose">
            « الحمد لله رب العالمين، والصلاة والسلام على خاتم النبيين وإمام المتقين.
            إن إنشاء هذا التطبيق التعليمي الخاص (IE) يأتي انطلاقاً من استشعارنا للأمانة الملقاة على عواتقنا تجاه أبنائنا وبناتنا طلاب الجامع والجامعات والمعاهد العربية الإسلامية في السنغال. إن التمكن من ناصية لغة الضاد، واستيعاب التاريخ العريق لأمتنا ومقاومتها المجيدة، وفهم الجغرافيا الوطنية بمواردها وتحدياتها، هو السلاح الأوثق لبناء جيل سنغالي معتز بهويته، قادر على خدمة وطنه وأمته بعلم راسخ وإيمان عميق. »
          </div>

          <p>
            تهدف منصة <strong>IE التعليمية</strong> إلى توفير مرجع أكاديمي رقمي رصين وميسر، يجمع بين المقررات الرسمية لوزارة التعليم السنغالية وامتحانات البكالوريا العربية (Baccalauréat Arabe)، وبين المراجع العلمية الموثوقة التي توارثها كبار علماء السنغال.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40 text-xs space-y-1">
              <span className="font-bold text-stone-900 dark:text-white block">1. التميز في العربية</span>
              <p className="text-stone-500">إتقان النحو والصرف والبلاغة وتذوق شعر علماء السنغال الأجلاء.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40 text-xs space-y-1">
              <span className="font-bold text-stone-900 dark:text-white block">2. الوعي التاريخي</span>
              <p className="text-stone-500">استلهام أمجاد تكرور وجولوف ورموز المقاومة الوطنية والروحية.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40 text-xs space-y-1">
              <span className="font-bold text-stone-900 dark:text-white block">3. التنمية الجغرافية</span>
              <p className="text-stone-500">إدراك موارد السنغال المائية والطبيعية والفرص الاقتصادية الجديدة.</p>
            </div>
          </div>
        </div>

        {/* Visual Badge Card with Founder's Photo */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-center space-y-4">
          <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-md">
            <img
              src="/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png"
              alt="فضيلة الشيخ تيجان ا نداو"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <h3 className="font-bold text-base text-stone-900 dark:text-white">فضيلة الشيخ تيجان ا نداو</h3>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold block">المؤسس والمشرف العام لمنصة IE</span>
            <span className="text-[11px] text-stone-500 font-mono">Cheikh Tidiane Ndao · Sénégal</span>
          </div>
          <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300 text-right pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>إشراف مباشر على مناهج العربية والتاريخ والجغرافيا</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>موجهة لكافة معاهد وجامعات ومناطق السنغال الـ 14</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>دعم مباشر لاشتراكات Wave و Orange Money للطلبة</span>
            </div>
          </div>

          {/* Direct Contact Info */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2 text-right">
            <div className="text-[11px] text-stone-500 font-medium">للتواصل المباشر والاستفسارات الأكاديمية:</div>
            <a
              href="tel:+221787130061"
              dir="ltr"
              className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-mono text-xs font-bold transition-colors"
            >
              <span>+221 78 713 00 61</span>
            </a>
            <a
              href="https://wa.me/221787130061"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <span>محادثة واتساب فضيلة الشيخ (WhatsApp)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
