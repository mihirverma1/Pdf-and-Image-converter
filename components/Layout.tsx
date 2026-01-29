
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
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Github</a>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-xs text-violet-400 border border-violet-400/30 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
              Pro Suite
            </span>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="border-t border-white/5 py-12 mt-12 bg-black/80">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8 p-6 glass rounded-2xl border-yellow-500/10 bg-yellow-500/5 max-w-3xl mx-auto text-left md:text-center">
            <div className="inline-flex items-center space-x-2 text-yellow-500/80 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>Local Processing Disclaimer</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              PIConverter is built with a <strong>privacy-first architecture</strong>. All file operations, including PDF conversion and image compression, are executed entirely within your browser's sandbox. 
              <strong>We do not store your files.</strong> We do not utilize cloud storage, nor do we ever transmit your files to any external server. Your sensitive data never leaves your local machine.
            </p>
          </div>
          
          <div className="text-gray-600 text-sm flex flex-col md:flex-row items-center justify-center md:space-x-4 space-y-2 md:space-y-0">
            <p>© 2024 PIConverter Studio.</p>
            <span className="hidden md:inline">•</span>
            <p>High Performance Media Processing</p>
            <span className="hidden md:inline">•</span>
            <p className="text-violet-500/50">Local-Only Secure Mode</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
