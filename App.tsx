import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { ToolCard } from './components/ToolCard.tsx';
import { ToolPanel } from './components/ToolPanel.tsx';
import { UpgradeModal } from './components/UpgradeModal.tsx';
import { ToolType, ToolConfig } from './types.ts';

const TOOLS: ToolConfig[] = [
  {
    id: ToolType.PDF_TO_IMAGE,
    title: 'PDF to Image',
    description: 'Convert PDF pages into high-quality JPEG/PNG images.',
    icon: '🖼️',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: ToolType.IMAGE_TO_PDF,
    title: 'Image to PDF',
    description: 'Bundle multiple images into a single professional PDF.',
    icon: '📄',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: ToolType.MERGE_PDF,
    title: 'Merge PDFs',
    description: 'Combine multiple PDF documents into one.',
    icon: '🔗',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: ToolType.SHRINK_PDF,
    title: 'Shrink PDF',
    description: 'Optimize PDF file size without losing readability.',
    icon: '📉',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: ToolType.SHRINK_IMAGE,
    title: 'Shrink Image',
    description: 'Compress images for web while maintaining clarity.',
    icon: '📐',
    color: 'from-amber-500 to-yellow-600'
  }
];

const FREE_DAILY_LIMIT = 3;

function getDailyUsage(): number {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('pi_usage');
  if (!stored) return 0;
  try {
    const data = JSON.parse(stored);
    if (data.date !== today) return 0;
    return data.count || 0;
  } catch {
    return 0;
  }
}

function incrementDailyUsage(): number {
  const today = new Date().toDateString();
  const current = getDailyUsage();
  const newCount = current + 1;
  localStorage.setItem('pi_usage', JSON.stringify({ date: today, count: newCount }));
  return newCount;
}

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setDailyUsage(getDailyUsage());
    // Check pro status from localStorage
    const proStatus = localStorage.getItem('pi_pro');
    if (proStatus === 'true') setIsPro(true);
  }, []);

  const handleConversionComplete = () => {
    if (!isPro) {
      const newCount = incrementDailyUsage();
      setDailyUsage(newCount);
      if (newCount >= FREE_DAILY_LIMIT) {
        setTimeout(() => setShowUpgrade(true), 1500);
      }
    }
  };

  const handleToolClick = (toolId: ToolType) => {
    if (!isPro && dailyUsage >= FREE_DAILY_LIMIT) {
      setShowUpgrade(true);
      return;
    }
    setActiveTool(toolId);
  };

  const remainingConversions = Math.max(0, FREE_DAILY_LIMIT - dailyUsage);

  return (
    <Layout isPro={isPro} remainingConversions={remainingConversions} onUpgradeClick={() => setShowUpgrade(true)}>
      {!activeTool ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
              PIConverter
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-6">
              Professional grade PDF and image manipulation tools. 100% browser-based, secure, and blazingly fast.
            </p>

            {/* Usage indicator */}
            {!isPro && (
              <div className="mb-8 inline-flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
                <div className="flex space-x-1">
                  {[...Array(FREE_DAILY_LIMIT)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i < dailyUsage ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {remainingConversions === 0
                    ? '⚠️ Daily limit reached — '
                    : `${remainingConversions} free conversion${remainingConversions !== 1 ? 's' : ''} left today — `}
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Upgrade for unlimited
                  </button>
                </span>
              </div>
            )}

            {isPro && (
              <div className="mb-8 inline-flex items-center space-x-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-5 py-2.5">
                <span className="text-violet-400 font-bold text-sm">✦ PRO</span>
                <span className="text-sm text-gray-400">Unlimited conversions active</span>
              </div>
            )}

            <div className="mb-12 p-6 glass rounded-2xl border-yellow-500/10 bg-yellow-500/5 max-w-3xl mx-auto text-left md:text-center animate-in fade-in zoom-in duration-700">
              <div className="inline-flex items-center space-x-2 text-yellow-500/80 text-xs font-bold uppercase tracking-[0.2em] mb-3">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                <span>Local Processing Disclaimer</span>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                PIConverter is built with a <strong>privacy-first architecture</strong>. All file operations are executed entirely within your browser's sandbox.
                <strong> We do not store or transmit your files.</strong> Your sensitive data never leaves your local machine.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TOOLS.map((tool) => (
              <ToolCard
                key={tool.id}
                config={tool}
                onClick={() => handleToolClick(tool.id)}
                locked={!isPro && dailyUsage >= FREE_DAILY_LIMIT}
              />
            ))}
          </div>

          {/* Pricing section */}
          <div className="mt-24" id="pricing">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-3">Simple Pricing</h2>
              <p className="text-gray-500">Start free. Upgrade when you need more.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Free */}
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Free</div>
                <div className="text-4xl font-bold text-white mb-1">₹0</div>
                <div className="text-gray-500 text-sm mb-8">Forever free</div>
                <ul className="space-y-3 mb-8">
                  {['3 conversions per day', 'All 5 tools included', 'Browser-based & private', 'No account needed'].map(f => (
                    <li key={f} className="flex items-center text-sm text-gray-400">
                      <span className="text-green-500 mr-2">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <div className="w-full py-3 rounded-xl text-center text-sm font-semibold text-gray-500 bg-white/5 border border-white/10">
                  Current Plan
                </div>
              </div>

              {/* Pro */}
              <div className="relative glass rounded-3xl p-8 border border-violet-500/40 bg-violet-500/5 shadow-xl shadow-violet-500/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</span>
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-violet-400 mb-4">Pro</div>
                <div className="text-4xl font-bold text-white mb-1">₹99<span className="text-lg font-normal text-gray-500">/mo</span></div>
                <div className="text-gray-500 text-sm mb-8">or ₹999/year (save 16%)</div>
                <ul className="space-y-3 mb-8">
                  {['Unlimited conversions', 'All 5 tools included', 'Priority processing speed', 'No ads ever', 'Email support'].map(f => (
                    <li key={f} className="flex items-center text-sm text-gray-300">
                      <span className="text-violet-400 mr-2">✦</span>{f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.99] transition-all shadow-lg shadow-violet-500/20"
                >
                  Upgrade to Pro →
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-600 glass px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>All processing happens locally on your device</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setActiveTool(null)}
            className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Tools
          </button>

          <ToolPanel
            tool={activeTool}
            config={TOOLS.find(t => t.id === activeTool)!}
            onConversionComplete={handleConversionComplete}
            isPro={isPro}
            remainingConversions={remainingConversions}
            onUpgradeClick={() => setShowUpgrade(true)}
          />
        </div>
      )}

      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          dailyUsage={dailyUsage}
          limit={FREE_DAILY_LIMIT}
        />
      )}
    </Layout>
  );
}
