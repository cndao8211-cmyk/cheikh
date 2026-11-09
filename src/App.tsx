/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { EducationSuite } from './components/EducationSuite';
import { CompanyHolding } from './components/CompanyHolding';
import { MediaStudioSuite } from './components/MediaStudioSuite';
import { LiveVoiceRoom } from './components/LiveVoiceRoom';
import { Game3D } from './components/Game3D';
import { AboutCheikhNdao } from './components/AboutCheikhNdao';
import { Footer } from './components/Footer';
import { MembersDirectory } from './components/MembersDirectory';
import { MobileMoneyPayment } from './components/MobileMoneyPayment';
import { PWAInstallButton } from './components/PWAInstallButton';
import { CheikhLecturesAndPapersHub } from './components/CheikhLecturesAndPapersHub';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ie_theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ie_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ie_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleLaunchGame = () => {
    setIsGameActive(true);
  };

  const handleExitGame = () => {
    setIsGameActive(false);
  };

  const handleOpenStore = () => {
    setIsGameActive(false);
    setActiveTab('company');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If 3D Game is active, render full-viewport Game Shell without navbar/footer
  if (isGameActive) {
    return (
      <Game3D
        onExitGame={handleExitGame}
        onOpenStore={handleOpenStore}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors">
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onLaunchGame={handleLaunchGame}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <Hero
              onSelectSubject={(subj) => {
                if (subj === 'lectures') {
                  setActiveTab('lectures');
                } else {
                  setActiveTab('education');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenTutor={() => {
                setActiveTab('education');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenPayment={() => setIsPaymentModalOpen(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <PWAInstallButton variant="banner" />

              {/* Featured Showcase: Cheikh Tidiane Ndao's Video Lectures & PDF Papers */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-stone-900 to-stone-900 text-white border-2 border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-right">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-400 shrink-0 shadow-lg">
                    <img
                      src="/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png"
                      alt="فضيلة الشيخ تيجان ا نداو"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-400 block">قسم الشروحات الحصرية لطلاب السنغال</span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      قاعة شروحات ومذكرات فضيلة الشيخ تيجان ا نداو (فيديوهات الشرح & أوراق PDF)
                    </h3>
                    <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                      شاهد دروس الفيديو أثناء الشرح وتصفح وحمّل جميع مذكرات وأوراق الـ PDF الرسمية للمنهج.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('lectures');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <span>دخول قاعة الفيديوهات والمذكرات</span>
                </button>
              </div>

              <CompanyHolding
                onLaunchGame={handleLaunchGame}
                onOpenVideoStudio={() => {
                  setActiveTab('media');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenMaps={() => {
                  setActiveTab('media');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenMusic={() => {
                  setActiveTab('media');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenVoice={() => {
                  setActiveTab('voice');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
              <AboutCheikhNdao />
            </div>
          </div>
        )}

        {activeTab === 'lectures' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CheikhLecturesAndPapersHub
              onAskTutor={(q) => {
                setActiveTab('education');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'education' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EducationSuite
              onAskTutor={(q) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'company' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CompanyHolding
              onLaunchGame={handleLaunchGame}
              onOpenVideoStudio={() => {
                setActiveTab('media');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenMaps={() => {
                setActiveTab('media');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenMusic={() => {
                setActiveTab('media');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenVoice={() => {
                setActiveTab('voice');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'members' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MembersDirectory />
          </div>
        )}

        {activeTab === 'media' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MediaStudioSuite />
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LiveVoiceRoom />
          </div>
        )}
      </main>

      <MobileMoneyPayment
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        defaultPlan={{
          id: 'monthly',
          title: 'الاشتراك المعتمد الشامل لطلاب السنغال (IE Student)',
          amountCFA: 5000,
        }}
      />

      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
