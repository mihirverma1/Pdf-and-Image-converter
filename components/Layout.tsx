import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              P
            </div>
            <span className="font-bold text-xl tracking-tight">PIConverter</span>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="border-t border-white/5 py-12 mt-12 bg-black/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-gray-600 text-sm flex flex-col md:flex-row items-center justify-center md:space-x-6 space-y-4 md:space-y-0">
            <p>© 2024 PIConverter Studio.</p>
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