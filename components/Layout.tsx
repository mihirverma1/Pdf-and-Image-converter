import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isPro: boolean;
  onUpgradeClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isPro, onUpgradeClick }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              P
            </div>
            <span className="font-bold text-xl tracking-tight">PIConverter</span>
            {isPro && (
              <span className="ml-1 text-xs font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full">PRO</span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
              Pricing
            </a>
            {!isPro && (
              <button
                onClick={onUpgradeClick}
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.99] transition-all shadow-lg shadow-violet-500/20"
              >
                Upgrade Pro
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="border-t border-white/5 py-12 mt-12 bg-black/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-gray-600 text-sm flex flex-col md:flex-row items-center justify-center md:space-x-6 space-y-4 md:space-y-0">
            <p>© 2025 PIConverter. A <a href="https://nulltribe.com" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors">NullTribe</a> product.</p>
            <span className="hidden md:inline text-gray-800">•</span>
            <p>High Performance Media Processing</p>
            <span className="hidden md:inline text-gray-800">•</span>
            <div className="flex items-center space-x-4">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-400 transition-colors underline decoration-gray-800 underline-offset-4"
              >
                Sitemap
              </a>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-400 transition-colors underline decoration-gray-800 underline-offset-4"
              >
                Robots.txt
              </a>
              <a
                href="mailto:hello@nulltribe.com"
                className="hover:text-violet-400 transition-colors underline decoration-gray-800 underline-offset-4"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-700 uppercase tracking-widest font-semibold">Privacy First • Local Only • Secure</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
