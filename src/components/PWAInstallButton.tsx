import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2, X, Share2, PlusSquare, ArrowDown, Sparkles, ExternalLink, AlertTriangle } from 'lucide-react';
import { usePWAInstall } from '../services/usePWAInstall';

export const openPWAInstallModal = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open_pwa_install_guide'));
  }
};

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' | 'card' }> = ({
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, isInIframe, install } = usePWAInstall();
  const [showInstallGuide, setShowInstallGuide] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  React.useEffect(() => {
    const handleOpen = () => setShowInstallGuide(true);
    window.addEventListener('open_pwa_install_guide', handleOpen);
    return () => window.removeEventListener('open_pwa_install_guide', handleOpen);
  }, []);

  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const appUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://ais-pre-svdpu537ry36nuixdlg37q-516346972590.europe-west2.run.app'
    : (typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-svdpu537ry36nuixdlg37q-516346972590.europe-west2.run.app');

  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const downloadDesktopShortcut = () => {
    const targetUrl = 'https://ais-pre-svdpu537ry36nuixdlg37q-516346972590.europe-west2.run.app';
    const content = `[InternetShortcut]\r\nURL=${targetUrl}\r\nIconIndex=0\r\nIconFile=${targetUrl}/pwa-192x192.png\r\n`;
    const blob = new Blob([content], { type: 'application/internet-shortcut;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'منصة_IE_التعليمية_السنغال.url';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccessToast('تم تنزيل ملف اختصار منصة IE بنجاح إلى حاسوبك في مجلد التنزيلات (Téléchargements)! يمكنك سحبه إلى سطح المكتب (Bureau) لفتحه مباشرة.');
    setTimeout(() => setDownloadSuccessToast(null), 8000);
  };

  const copyAppUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // If already running in standalone mode as installed PWA
  if (isInstalled) {
    if (variant === 'banner') return null;
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>التطبيق مثبت على جهازك</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInIframe) {
      setShowInstallGuide(true);
      return;
    }
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  return (
    <>
      {downloadSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-800 text-white shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          title="تثبيت التطبيق على الحاسوب أو الهاتف (Installer sur Ordinateur / PC / Téléphone)"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span>تثبيت على الكمبيوتر (Installer PC)</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white border border-emerald-600/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-800/80 border border-emerald-500 flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-300">التطبيق المكتبي والمحمول (PWA)</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black">
                  للحاسوب والهاتف
                </span>
              </div>
              <h4 className="text-base font-black text-white mt-0.5">
                تثبيت منصة شركة IE على شاشة الحاسوب الرئيسية (Écran d'accueil / Bureau)
              </h4>
              <p className="text-xs text-stone-300">
                يمكنك تنزيل وتثبيت التطبيق على جهاز الكمبيوتر (PC/Mac) أو الهاتف ليفتح بضغطة زر كبرنامج مستقل وسريع.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={downloadDesktopShortcut}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="تنزيل ملف اختصار سطح المكتب مباشرة"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>تنزيل ملف البرنامج للسطح فوراً (.url)</span>
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-950" />
              <span>تثبيت عبر المتصفح (Installer)</span>
            </button>
            <button
              onClick={() => setShowInstallGuide(true)}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <span>دليل التثبيت والرابط</span>
            </button>
          </div>
        </div>
      )}

      {/* Installation Instruction Modal for Desktop PC, Android & iOS */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 text-right space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 dark:text-white">
                    تثبيت المنصة على شاشة الحاسوب (Bureau / Écran d'accueil)
                  </h3>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Installation sur Ordinateur (PC) & Téléphone
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Iframe Warning Banner */}
            {isInIframe && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-700 text-right space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>تنبيه هام جداً: سبب عدم التثبيت داخل هذه النافذة</span>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  أنت تتصفح المنصة حالياً من داخل نافذة المعاينة (Iframe). تمنع متصفحات الويب (Chrome / Edge / Safari) تثبيت أي تطبيق PWA من داخل نوافذ المعاينة الداخلية لأسباب أمنية.
                  <br />
                  <strong>الحل الفوري:</strong> اضغط على الزر الأخضر بالأسفل لفتح الرابط في صفحة متصفح خارجية مستقلة (Nouvel onglet)، وهناك سيظهر لك زر التثبيت فوراً على شاشة الحاسوب!
                </p>
                <div className="pt-1">
                  <a
                    href="https://ais-pre-svdpu537ry36nuixdlg37q-516346972590.europe-west2.run.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح المنصة في صفحة جديدة للتثبيت المباشر ↗</span>
                  </a>
                </div>
              </div>
            )}

            {/* Toast feedback */}
            {downloadSuccessToast && (
              <div className="p-3.5 rounded-2xl bg-emerald-700 text-white text-xs font-bold shadow-lg flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
                <span>{downloadSuccessToast}</span>
              </div>
            )}

            {/* Direct Instant Download of Desktop Shortcut Box (Bilingual FR / AR) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-stone-900 to-stone-900 text-white border-2 border-emerald-400 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600/80 border border-emerald-400 flex items-center justify-center font-bold shrink-0">
                  <Download className="w-6 h-6 text-amber-300" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-stone-950">
                      Télécharger sur Ordinateur
                    </span>
                    <span className="text-[10px] text-emerald-300">Windows · Mac · Linux</span>
                  </div>
                  <h4 className="font-extrabold text-base text-white mt-1">
                    تحميل وتثبيت التطبيق على جهاز الكمبيوتر الخاص بك
                  </h4>
                  <p className="text-xs text-stone-300">
                    Téléchargez et installez l'application complète sur votre PC / Mac pour un accès direct depuis votre Bureau.
                  </p>
                </div>
              </div>

              {/* Download Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* Windows 1-Click .bat */}
                <a
                  href="/api/download/desktop-installer-windows"
                  download="Installer_IE_Academie_Windows.bat"
                  onClick={() => {
                    setDownloadSuccessToast('Téléchargement du script d\'installation Windows en cours ! Double-cliquez dessus dans vos Téléchargements.');
                    setTimeout(() => setDownloadSuccessToast(null), 8000);
                  }}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-md transition-colors cursor-pointer border border-emerald-400/50"
                >
                  <div className="flex items-center gap-2 text-right">
                    <Download className="w-4 h-4 text-amber-300 shrink-0" />
                    <div>
                      <div className="font-extrabold">Windows (.bat automatique)</div>
                      <div className="text-[10px] text-emerald-100">Crée l'icône sur le Bureau en 1 clic</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-mono">PC</span>
                </a>

                {/* Desktop Shortcut .url */}
                <button
                  type="button"
                  onClick={downloadDesktopShortcut}
                  className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-between shadow-md transition-colors cursor-pointer border border-stone-600"
                >
                  <div className="flex items-center gap-2 text-right">
                    <Download className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-extrabold">Raccourci Bureau (.url)</div>
                      <div className="text-[10px] text-stone-300">Fichier de lancement rapide</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 bg-black/30 rounded font-mono">Direct</span>
                </button>

                {/* Mac Launcher */}
                <a
                  href="/api/download/desktop-mac-launcher"
                  download="Lancer_IE_Academie_Mac.command"
                  onClick={() => {
                    setDownloadSuccessToast('Lanceur macOS téléchargé !');
                    setTimeout(() => setDownloadSuccessToast(null), 6000);
                  }}
                  className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-between shadow-md transition-colors cursor-pointer border border-stone-600"
                >
                  <div className="flex items-center gap-2 text-right">
                    <Download className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <div className="font-extrabold">Apple Mac (macOS .command)</div>
                      <div className="text-[10px] text-stone-300">Lanceur dédié MacBook & iMac</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 bg-black/30 rounded font-mono">Mac</span>
                </a>

                {/* Complete ZIP Archive for Offline / Local Execution */}
                <a
                  href="/api/download/desktop-app-zip"
                  download="IE_Academie_Application_Complete.zip"
                  onClick={() => {
                    setDownloadSuccessToast('Téléchargement du dossier complet de l\'application (ZIP) démarré !');
                    setTimeout(() => setDownloadSuccessToast(null), 8000);
                  }}
                  className="p-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center justify-between shadow-md transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-right">
                    <Download className="w-4 h-4 text-stone-950 shrink-0" />
                    <div>
                      <div className="font-black">Application Complète (ZIP)</div>
                      <div className="text-[10px] text-stone-800">Code et ressources pour votre PC</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 bg-black/15 rounded font-mono">Archive</span>
                </a>
              </div>
            </div>

            {/* Direct Link Copier Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                <span>رابط شركتك وتطبيقك المباشر لفتحه في الحاسوب:</span>
                <span className="text-[10px] text-emerald-600 font-mono">Lien officiel</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="w-full text-xs font-mono p-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white select-all text-left"
                />
                <button
                  onClick={copyAppUrl}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5"
                >
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-200" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                </button>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                يمكنك نسخ هذا الرابط وفتحه على حاسوبك الشخصي عبر متصفح Google Chrome أو Microsoft Edge.
              </p>
            </div>

            {/* Step 1: On Desktop Computer (PC / Mac) */}
            <div className="space-y-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80">
              <div className="flex items-center gap-2 font-bold text-xs text-stone-900 dark:text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>طريقة التثبيت على شاشة الحاسوب (Sur Écran d'accueil PC / Chrome / Edge):</span>
              </div>
              <ol className="text-xs text-stone-600 dark:text-stone-300 space-y-2 list-decimal list-inside pr-1 leading-relaxed">
                <li>
                  افتح الرابط أعلاه في متصفح <strong>Google Chrome</strong> أو <strong>Microsoft Edge</strong> على جهاز الحاسوب.
                </li>
                <li>
                  في شريط العنوان (URL Bar) بأعلى المتصفح جهة اليمين، ستجد أيقونة شاشة كمبيوتر صغيرة بها سهم لأسفل <span className="font-mono font-bold text-emerald-600">⊕</span> أو اضغط على القائمة (النقاط الثلاث <strong>⋮</strong>).
                </li>
                <li>
                  اختر <strong>«تثبيت منصة IE التعليمية» (Installer l'application IE)</strong>.
                </li>
                <li>
                  اضغط <strong>«تثبيت» (Installer)</strong>؛ وسيظهر اختصار التطبيق بأيقونته الرسمية على سطح المكتب (Bureau / Écran d'accueil) ليعمل كبرنامج مستقل بدون إطار المتصفح.
                </li>
              </ol>
            </div>

            {/* Step 2: Android Phones */}
            <div className="space-y-2.5 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60">
              <div className="flex items-center gap-2 font-bold text-xs text-stone-800 dark:text-stone-200">
                <span className="w-2 rounded-full bg-blue-500 h-2" />
                <span>لهواتف أندرويد (Android):</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                اضغط على النقاط الثلاث <strong>⋮</strong> في متصفح كروم ثم اختر <strong>«تثبيت التطبيق» (Installer l'application)</strong>.
              </p>
            </div>

            {/* Step 3: iPhone iOS Safari */}
            <div className="space-y-2.5 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60">
              <div className="flex items-center gap-2 font-bold text-xs text-stone-800 dark:text-stone-200">
                <span className="w-2 rounded-full bg-amber-500 h-2" />
                <span>لهواتف آيفون (iPhone - Safari):</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                اضغط على زر المشاركة <Share2 className="w-3 h-3 inline mx-1 text-sky-500" /> في أسفل Safari ثم اختر <strong>«Sur l'écran d'accueil» (إضافة إلى الصفحة الرئيسية)</strong>.
              </p>
            </div>

            {/* Close */}
            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}
    </>
  );
};
