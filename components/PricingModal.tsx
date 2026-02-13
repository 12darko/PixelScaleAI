import React from 'react';
import { X, Check, Zap, Lock } from 'lucide-react';
import { PricingPlan } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (planId: string) => void;
  isLoggedIn: boolean;
  onLoginRequest: () => void;
}

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Başlangıç',
    price: '₺79',
    credits: 75,
    features: [
      '75 Kredi',
      'Normal Hız',
      '8x Büyütme',
      'Reklamsız (kredi varken)'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₺149',
    credits: 200,
    features: [
      '200 Kredi',
      '2x Hızlı İşleme',
      '8x Büyütme',
      'Reklamsız',
      'İşlem Geçmişi',
      '5 Toplu Yükleme'
    ],
    recommended: true
  },
  {
    id: 'business',
    name: 'Business',
    price: '₺349',
    credits: 600,
    features: [
      '600 Kredi',
      '4x Hızlı İşleme',
      '16x Büyütme',
      'Reklamsız',
      'İşlem Geçmişi',
      '20 Toplu Yükleme',
      'API Erişimi'
    ]
  }
];

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onPurchase, isLoggedIn, onLoginRequest }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Kredi Bakiyesi Yükle</h2>
            <p className="text-gray-400">Profesyonel sonuçlar için hesabınıza kredi tanımlayın.</p>

            {!isLoggedIn && (
              <div className="mt-4 inline-block bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
                <p className="text-purple-300 text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  İpucu: Şimdi Google ile giriş yaparsanız anında <strong>20 Ücretsiz Kredi</strong> kazanırsınız!
                </p>
                <button onClick={onLoginRequest} className="mt-2 text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors">
                  Hemen Giriş Yap
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl p-6 border flex flex-col transition-transform hover:scale-[1.02] ${plan.recommended
                    ? 'bg-gray-800 border-purple-500 shadow-lg shadow-purple-900/20 z-10'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> EN ÇOK TERCİH EDİLEN
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      onLoginRequest();
                    } else {
                      onPurchase(plan.id);
                    }
                  }}
                  className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${plan.recommended
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                >
                  {!isLoggedIn && <Lock className="w-4 h-4" />}
                  {isLoggedIn ? 'Satın Al' : 'Giriş Yap & Satın Al'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-800 pt-6">
            <p className="mb-2">Güvenli Ödeme Altyapısı</p>
            Ödemeleriniz 256-bit SSL sertifikası ile korunmaktadır. Kredi kartı bilgileriniz saklanmaz.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;