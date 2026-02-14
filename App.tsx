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
import FaqSection from './components/FaqSection';
import HowItWorks from './components/HowItWorks';
import FeaturesSection from './components/FeaturesSection';
import { User, AppState, ProcessedImage, MAX_FREE_CREDITS, UpscaleOptions, DEFAULT_UPSCALE_OPTIONS, PremiumTier, hasFeatureAccess } from './types';
import { upscaleImage } from './services/aiService';
import { purchasePlan, checkPaymentSuccess, clearPaymentParam } from './services/lemonsqueezy';
import { useToast } from './context/ToastContext';
import {
  supabase,
  getUserProfile,
  updateUserCredits,
  processReferral,
  signOut
} from './services/supabase';
import { Zap, BarChart2, Clock, CheckCircle2, AlertTriangle, Camera, History } from 'lucide-react';
import { ReferralWidget } from './components/ReferralWidget';

// Simple bar chart component for visuals
const UsageChart = ({ usage }: { usage: number[] }) => {
  const max = Math.max(...usage, 10);
  return (
    <div className="flex items-end justify-between h-32 w-full gap-2">
      {usage.map((val, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1 group">
          <div
            className="w-full bg-purple-500/20 rounded-t-sm relative group-hover:bg-purple-500/40 transition-all duration-500 ease-out"
            style={{ height: `${(val / max) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {val}
            </div>
          </div>
          <span className="text-[10px] text-gray-500">{['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][i]}</span>
        </div>
      ))}
    </div>
  );
};

const PROCESSING_STEPS = [
  "Fotoğraf analiz ediliyor...",
  "Gürültü (noise) temizleniyor...",
  "Detaylar keskinleştiriliyor...",
  "Renk ve ışık dengeleniyor...",
  "Sonuç hazırlanıyor..."
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [guestCredits, setGuestCredits] = useState<number>(6);
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [selectedScale, setSelectedScale] = useState<number>(4); // New State
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ProcessedImage[]>([]);
  const [upscaleOptions, setUpscaleOptions] = useState<UpscaleOptions>(DEFAULT_UPSCALE_OPTIONS);
  // const [userTier, setUserTier] = useState<PremiumTier | undefined>('business'); // REMOVED HARDCODE
  const [processingTime, setProcessingTime] = useState<number>(0); // Processing time in seconds
  const toast = useToast();

  // Initialize App & Auth Listener
  useEffect(() => {
    // 1. Guest Credits (Local Storage)
    const storedGuest = localStorage.getItem('PixelScaleAI_guest_credits');
    if (storedGuest) {
      // DEV: Force reset to 50 if low (for testing)
      const current = parseInt(storedGuest);
      if (current < 10) {
        setGuestCredits(50);
        localStorage.setItem('PixelScaleAI_guest_credits', '50');
      } else {
        setGuestCredits(current);
      }
    } else {
      // New user gets 50
      setGuestCredits(50);
      localStorage.setItem('PixelScaleAI_guest_credits', '50');
    }

    // 2. Capture Referral Code
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('PixelScaleAI_referrer', refCode);
      console.log('Referrer captured:', refCode);
    }

    // 3. Supabase Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Fetch Profile from DB
        const profile = await getUserProfile(session.user.id);

        // Process Pending Referral
        const storedReferrer = localStorage.getItem('PixelScaleAI_referrer');
        if (storedReferrer && storedReferrer !== session.user.id) {
          const success = await processReferral(session.user.id, storedReferrer);
          if (success) {
            console.log("Referral processed successfully!");
            localStorage.removeItem('PixelScaleAI_referrer');
            // Refresh profile to show updated credits?
            // getUserProfile fetches fresh data, so next load will show it.
          }
        }

        // Construct User Object
        const newUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          avatar: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,

          credits: profile?.credits || 0,
          premiumTier: profile?.premiumTier
        };
        setUser(newUser);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
    return () => subscription.unsubscribe();
  }, []);

  // Simple URL Routing for SEO (Handle /privacy, /terms on load)
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/privacy') setAppState(AppState.PRIVACY);
    else if (path === '/terms') setAppState(AppState.TERMS);
    else if (path === '/contact') setAppState(AppState.CONTACT);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setAppState(AppState.LANDING);
    setOriginalImage(null);
    setProcessedImage(null);
  };

  const navigateTo = (path: string, state: AppState) => {
    window.history.pushState({}, '', path);
    setAppState(state);
    window.scrollTo(0, 0);
  };

  const handleFileSelect = async (file: File) => {
    // Check Credits
    let canProceed = false;

    if (user) {
      if (user.credits > 0) {
        canProceed = true;
      } else {
        setIsPricingOpen(true);
        return;
      }
    } else {
      if (guestCredits > 0) {
        canProceed = true;
      } else {
        setIsAuthModalOpen(true); // Login required if guest credits out
        return;
      }
    }

    if (!canProceed) return;

    // Start Processing
    const objectUrl = URL.createObjectURL(file);
    setOriginalImage(objectUrl);
    setAppState(AppState.PROCESSING);
    setIsProcessing(true);
    setProcessingStep(0);
    setError(null);

    // Progress Animation
    const stepInterval = setInterval(() => {
      setProcessingStep(prev => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2000);

    try {
      // Call AI Service with Selected Scale
      const startTime = Date.now();
      const currentTier = user?.premiumTier || 'free';
      const resultBase64 = await upscaleImage(file, { ...upscaleOptions, scale: selectedScale as any }, currentTier);
      const endTime = Date.now();
      const durationSeconds = Math.round((endTime - startTime) / 1000);
      setProcessingTime(durationSeconds);

      clearInterval(stepInterval);
      setProcessedImage(resultBase64);

      // DEDUCT CREDITS
      if (user) {
        const newTotal = user.credits - 1;
        await updateUserCredits(user.id, newTotal);
        setUser(prev => prev ? { ...prev, credits: newTotal } : null);
      } else {
        const newGuest = guestCredits - 1;
        setGuestCredits(newGuest);
        localStorage.setItem('PixelScaleAI_guest_credits', newGuest.toString());
      }

      // Update History (Local only for now, Db for premium later)
      const newHistoryItem: ProcessedImage = {
        id: Date.now().toString(),
        originalUrl: objectUrl,
        processedUrl: resultBase64,
        createdAt: Date.now()
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));

      setAppState(AppState.RESULT);

    } catch (err: any) {
      clearInterval(stepInterval);
      console.error(err);
      setError(err.message || "İşlem sırasında hatası.");
      setAppState(AppState.LANDING);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `PixelScaleAI-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Purchase with Lemon Squeezy
  const handlePurchase = (planId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const tierMap: Record<string, 'starter' | 'pro' | 'business'> = {
      'starter': 'starter',
      'pro': 'pro',
      'business': 'business'
    };
    const tier = tierMap[planId];
    if (tier) {
      purchasePlan(tier, user.id, user.email);
      toast.info('Ödeme sayfasına yönlendiriliyorsunuz...');
    }
    setIsPricingOpen(false);
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-[#030014] text-white font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden relative">

        {/* Noise Texture Overlay */}
        <div className="bg-noise"></div>

        {/* Dynamic Deep Space Mesh Gradient Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] animate-pulse-slow delay-1000"></div>
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[60%] h-[60%] rounded-full bg-[#1a103c]/20 blur-[100px]"></div>
        </div>

        {/* Content Wrapper to ensure it sits above background */}
        <div className="relative z-10 flex flex-col flex-1">
          <SeoHead
            title={appState === AppState.LANDING ? undefined :
              appState === AppState.PRIVACY ? 'Gizlilik Politikası' :
                appState === AppState.TERMS ? 'Kullanım Şartları' :
                  appState === AppState.CONTACT ? 'İletişim' : 'PixelScaleAI'}
            path={appState === AppState.LANDING ? '/' :
              appState === AppState.PRIVACY ? '/privacy' :
                appState === AppState.TERMS ? '/terms' :
                  appState === AppState.CONTACT ? '/contact' : '/'}
          />
          <Navbar
            user={user}
            guestCredits={guestCredits}
            onLogin={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onOpenPricing={() => setIsPricingOpen(true)}
          />

          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={() => setIsAuthModalOpen(false)}
          />

          <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">

            {/* Ad Space Top */}
            <AdBanner slotId="top-banner" className="mb-8" />

            {/* PROCESSING STATE WITH STEPS */}
            {appState === AppState.PROCESSING && (
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
            )}

            {/* LANDING STATE */}
            {appState === AppState.LANDING && !isProcessing && (
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
            )}

            {/* RESULT STATE */}
            {appState === AppState.RESULT && originalImage && processedImage && (
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
            )}

            {/* PRIVACY POLICY PAGE */}
            {appState === AppState.PRIVACY && (
              <div className="w-full max-w-4xl mx-auto animate-fade-in">
                <button
                  onClick={() => navigateTo('/', AppState.LANDING)}
                  className="mb-6 text-purple-400 hover:text-purple-300 flex items-center gap-2"
                >
                  ← Ana Sayfaya Dön
                </button>
                <PrivacyPolicy />
              </div>
            )}

            {/* TERMS OF SERVICE PAGE */}
            {appState === AppState.TERMS && (
              <div className="w-full max-w-4xl mx-auto animate-fade-in">
                <button
                  onClick={() => navigateTo('/', AppState.LANDING)}
                  className="mb-6 text-purple-400 hover:text-purple-300 flex items-center gap-2"
                >
                  ← Ana Sayfaya Dön
                </button>
                <TermsOfService />
              </div>
            )}

            {/* CONTACT PAGE */}
            {appState === AppState.CONTACT && (
              <div className="w-full max-w-4xl mx-auto animate-fade-in">
                <button
                  onClick={() => navigateTo('/', AppState.LANDING)}
                  className="mb-6 text-purple-400 hover:text-purple-300 flex items-center gap-2"
                >
                  ← Ana Sayfaya Dön
                </button>
                <ContactPage />
              </div>
            )}

            {/* DASHBOARD & HISTORY */}
            {user && appState === AppState.LANDING && (
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
            )}

            {/* Ad Space Bottom */}
            <AdBanner slotId="bottom-banner" className="mt-12" />

          </main>

          {/* FAQ SECTION (SEO & User Experience) - Only on Landing */}
          {appState === AppState.LANDING && (
            <>
              <div className="bg-gray-900 border-t border-gray-800/50">
                <HowItWorks />
              </div>
              <div className="bg-gray-900 border-t border-gray-800/50">
                <FeaturesSection />
              </div>
              <div className="bg-gray-900/50 border-t border-gray-800">
                <FaqSection />
              </div>
            </>
          )}

          <footer className="bg-gray-900 border-t border-gray-800 py-12 mt-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                <div className="mb-4 md:mb-0">
                  <span className="text-lg font-bold text-white block mb-2">PixelScaleAI</span>
                  <p>&copy; {new Date().getFullYear()} Tüm hakları saklıdır.</p>
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

          {/* GLOBAL SUPPORT BUTTON */}
          <SupportButton onOpenSupportModal={() => setIsSupportModalOpen(true)} />

          {/* SUPPORT MODAL */}
          <SupportModal
            isOpen={isSupportModalOpen}
            onClose={() => setIsSupportModalOpen(false)}
            userEmail={user?.email}
            isPremium={false}
          />

          {/* COOKIE CONSENT BANNER */}
          <CookieBanner />

          {/* HISTORY MODAL */}
          <HistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            userId={user?.id}
          />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default App;
