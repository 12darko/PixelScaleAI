import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import UploadZone from './components/UploadZone';
import ComparisonView from './components/ComparisonView';
import PricingModal from './components/PricingModal';
import AdBanner from './components/AdBanner';
import { AuthModal } from './components/AuthModal';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import SupportButton from './components/SupportButton';
import SupportModal from './components/SupportModal';
import CookieBanner from './components/CookieBanner';
import ContactPage from './components/ContactPage';
import HistoryModal from './components/HistoryModal';
import UpscaleOptionsPanel from './components/UpscaleOptionsPanel';
import SeoHead from './components/SeoHead';
import FaqSection, { getFaqData } from './components/FaqSection';
// ... imports

// ... inside App component
<SeoHead
  title={appState === AppState.LANDING ? undefined :
    appState === AppState.PRIVACY ? 'Gizlilik Politikası' :
      appState === AppState.TERMS ? 'Kullanım Şartları' :
        appState === AppState.CONTACT ? 'İletişim' : 'PixelScaleAI'}
  path={appState === AppState.LANDING ? '/' :
    appState === AppState.PRIVACY ? '/privacy' :
      appState === AppState.TERMS ? '/terms' :
        appState === AppState.CONTACT ? '/contact' : '/'}
  schemaType={appState === AppState.LANDING ? 'FAQ' : 'App'}
  faqData={appState === AppState.LANDING ? getFaqData() : undefined}
/>
user = { user }
guestCredits = { guestCredits }
onLogin = {() => setIsAuthModalOpen(true)}
onLogout = { handleLogout }
onOpenPricing = {() => setIsPricingOpen(true)}
          />

  < AuthModal
isOpen = { isAuthModalOpen }
onClose = {() => setIsAuthModalOpen(false)}
onSuccess = {() => setIsAuthModalOpen(false)}
          />

  < main className = "flex-1 container mx-auto px-4 py-8 flex flex-col items-center" >

    {/* Ad Space Top */ }
    < AdBanner slotId = "top-banner" className = "mb-8" />

      {/* PROCESSING STATE WITH STEPS */ }
{
  appState === AppState.PROCESSING && (
    <div className="w-full max-w-2xl mx-auto text-center py-12 animate-fade-in">
      <div className="w-24 h-24 mx-auto mb-6 relative">
        <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="w-8 h-8 text-purple-500 animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2">Fotoğrafınız İyileştiriliyor ({selectedScale}x)</h2>
      <p className="text-purple-300 font-medium mb-8 min-h-[1.5rem] transition-all">
        {processingStep === PROCESSING_STEPS.length - 1
          ? `${selectedScale}x çıktı oluşturuluyor...`
          : PROCESSING_STEPS[processingStep]}
      </p>

      <div className="flex justify-between max-w-md mx-auto relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 -translate-y-1/2 rounded"></div>
        {PROCESSING_STEPS.map((_, idx) => (
          <div key={idx} className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${idx <= processingStep ? 'bg-purple-500 border-purple-500 scale-125' : 'bg-gray-800 border-gray-600'}`}></div>
        ))}
      </div>
    </div>
  )
}

{/* LANDING STATE */ }
{
  appState === AppState.LANDING && !isProcessing && (
    <div className="w-full flex flex-col items-center animate-fade-in-up">
      <div className="text-center max-w-4xl mb-16 relative z-10">

        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-200 text-xs font-medium tracking-wide uppercase mb-8 shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] hover:bg-white/10 transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          PixelScale v2 Engine
        </div>

        {/* Hero Title with Glow */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight glow-text">
          Her Pikseli <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-x">Mükemmelleştirin</span>
        </h1>

        {/* Hero Description */}
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          {!user ? (
            <span>
              Yapay zeka ile fotoğraflarınızı 4K kalitesine yükseltin. <br />
              Misafir olarak <strong className="text-white">5 ücretsiz hakkınız</strong> var.
            </span>
          ) : (
            <span>Hoşgeldin {user.name.split(' ')[0]}. <strong className="text-white">{user.credits} kredin</strong> ile yaratıcılığını konuştur.</span>
          )}
        </p>

      </div>


      {/* Resolution selection moved to UpscaleOptionsPanel - no duplicate here */}

      <UploadZone
        onFileSelect={handleFileSelect}
        isProcessing={isProcessing}
      />

      {/* ADVANCED OPTIONS PANEL */}
      <div className="mt-8 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase">Gelişmiş Seçenekler</h3>
          {user && (
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              <History className="w-4 h-4" />
              İşlem Geçmişi
            </button>
          )}
        </div>
        <UpscaleOptionsPanel
          options={upscaleOptions}
          onChange={(opts) => {
            setUpscaleOptions(opts);
            setSelectedScale(opts.scale);
          }}
          userTier={user?.premiumTier || 'free'}
          onUpgradeClick={() => setIsPricingOpen(true)}
        />
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg max-w-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  )
}

{/* RESULT STATE */ }
{
  appState === AppState.RESULT && originalImage && processedImage && (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <ComparisonView
        originalUrl={originalImage}
        processedUrl={processedImage}
        onDownload={handleDownload}
        onReset={() => {
          setAppState(AppState.LANDING);
          setOriginalImage(null);
          setProcessedImage(null);
        }}
        scaleFactor={selectedScale}
        processingTime={processingTime}
      />
    </div>
  )
}

{/* PRIVACY POLICY PAGE */ }
{
  appState === AppState.PRIVACY && (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={() => navigateTo('/', AppState.LANDING)}
        className="mb-6 text-purple-400 hover:text-purple-300 flex items-center gap-2"
      >
        ← Ana Sayfaya Dön
      </button>
      <PrivacyPolicy />
    </div>
  )
}

{/* TERMS OF SERVICE PAGE */ }
{
  appState === AppState.TERMS && (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={() => navigateTo('/', AppState.LANDING)}
        className="mb-6 text-purple-400 hover:text-purple-300 flex items-center gap-2"
      >
        ← Ana Sayfaya Dön
      </button>
      <TermsOfService />
    </div>
  )
}

{/* CONTACT PAGE */ }
{
  appState === AppState.CONTACT && (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={() => navigateTo('/', AppState.LANDING)}
        className="mb-6 text-purple-400 hover:text-purple-300 flex items-center gap-2"
      >
        ← Ana Sayfaya Dön
      </button>
      <ContactPage />
    </div>
  )
}

{/* DASHBOARD & HISTORY */ }
{
  user && appState === AppState.LANDING && (
    <div className="w-full max-w-5xl mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-600 p-2 rounded-lg">
          <BarChart2 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold">İstatistikler ve Geçmiş</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* Stats Cards */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-24 h-24 text-purple-500" />
            </div>
            <div className="text-gray-400 text-sm font-medium mb-1">Mevcut Bakiye</div>
            <div className="text-4xl font-bold text-white mb-2">{user.credits}</div>
            <button
              onClick={() => setIsPricingOpen(true)}
              className="text-sm font-semibold bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 mt-4 transition-colors"
            >
              Kredi Yükle <CheckCircle2 className="w-4 h-4 text-green-600" />
            </button>
          </div>

          {/* Referral Widget */}
          <ReferralWidget userId={user.id} />

          <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
            <div className="text-gray-400 text-sm font-medium mb-4">Kullanım Özeti</div>
            <UsageChart usage={[2, 5, 1, 8, 4, 6, 3]} />
          </div>
        </div>

        {/* History List */}
        <div className="md:col-span-8 bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> İşlem Geçmişi
            </h4>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Son 10 İşlem</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center">
              <Camera className="w-12 h-12 mb-3 opacity-20" />
              <p>Henüz bir fotoğraf düzenlemediniz.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="flex items-center p-3 hover:bg-gray-800/80 bg-gray-800/40 rounded-xl transition-colors border border-transparent hover:border-gray-700 group">
                  <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden text-gray-500">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-white">4K AI Upscale</div>
                    <div className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-green-400">Tamamlandı</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

{/* Ad Space Bottom */ }
<AdBanner slotId="bottom-banner" className="mt-12" />

          </main >

  {/* FAQ SECTION (SEO & User Experience) - Only on Landing */ }
{
  appState === AppState.LANDING && (
    <div className="w-full space-y-12">
      <div className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <HowItWorks />
      </div>
      <div className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <FeaturesSection />
      </div>
      <div className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <FaqSection />
      </div>
    </div>
  )
}

          <footer className="w-full border-t border-white/10 bg-[#020205] py-12 mt-12 relative z-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                <div className="mb-4 md:mb-0">
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 block mb-2">PixelScaleAI</span>
                  <p className="opacity-60">&copy; {new Date().getFullYear()} Tüm hakları saklıdır.</p>
                </div>
                <div className="flex gap-6">
                  <button onClick={() => navigateTo('/privacy', AppState.PRIVACY)} className="hover:text-purple-400 transition-colors">Gizlilik Politikası</button>
                  <button onClick={() => navigateTo('/terms', AppState.TERMS)} className="hover:text-purple-400 transition-colors">Kullanım Şartları</button>
                  <button onClick={() => navigateTo('/contact', AppState.CONTACT)} className="hover:text-purple-400 transition-colors">İletişim</button>
                </div>
              </div>
            </div>
          </footer>



          <PricingModal
            isOpen={isPricingOpen}
            onClose={() => setIsPricingOpen(false)}
            onPurchase={handlePurchase}
            isLoggedIn={!!user}
            onLoginRequest={() => setIsAuthModalOpen(true)}
          />

{/* GLOBAL SUPPORT BUTTON */ }
<SupportButton onOpenSupportModal={() => setIsSupportModalOpen(true)} />

{/* SUPPORT MODAL */ }
<SupportModal
  isOpen={isSupportModalOpen}
  onClose={() => setIsSupportModalOpen(false)}
  userEmail={user?.email}
  isPremium={false}
/>

{/* COOKIE CONSENT BANNER */ }
<CookieBanner />

{/* HISTORY MODAL */ }
<HistoryModal
  isOpen={isHistoryModalOpen}
  onClose={() => setIsHistoryModalOpen(false)}
  userId={user?.id}
/>
        </div >
      </div >
    </HelmetProvider >
  );
};

export default App;
