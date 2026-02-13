import React from 'react';
import { User } from '../types';
import { Sparkles, User as UserIcon, LogOut, Battery, BatteryCharging } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  guestCredits: number;
  onLogin: () => void;
  onLogout: () => void;
  onOpenPricing: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, guestCredits, onLogin, onLogout, onOpenPricing }) => {
  return (
    <nav className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              PixelScaleAI AI
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              // LOGGED IN VIEW
              <>
                <div
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full border border-gray-700 cursor-pointer hover:border-purple-500 transition-colors"
                  onClick={onOpenPricing}
                >
                  <BatteryCharging className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Hesap:</span>
                  <span className={`font-bold ${user.credits > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {user.credits} Kredi
                  </span>
                  <span className="text-xs bg-purple-600 px-2 py-0.5 rounded-full text-white ml-1 hover:bg-purple-500">
                    + Satın Al
                  </span>
                </div>

                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <img
                      src={user.avatar}
                      alt="User"
                      className="w-8 h-8 rounded-full border border-gray-600"
                    />
                    <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-700">
                      {user.email}
                    </div>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Çıkış Yap
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // GUEST VIEW
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full border border-gray-700/50">
                  <Battery className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Misafir Hakkı:</span>
                  <span className={`font-bold ${guestCredits > 0 ? 'text-white' : 'text-red-500'}`}>
                    {guestCredits}/6
                  </span>
                </div>

                <button
                  onClick={onLogin}
                  className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse-slow"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Giriş Yap (+20 Kredi)</span>
                  <span className="sm:hidden">Giriş (+20)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
