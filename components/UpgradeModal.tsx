import React, { useState } from 'react';

interface UpgradeModalProps {
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    // Razorpay payment link — replace with your actual Razorpay payment link
    const RAZORPAY_MONTHLY_LINK = 'https://rzp.io/l/piconverter-pro'; // Replace with your link
    const RAZORPAY_YEARLY_LINK = 'https://rzp.io/l/piconverter-pro-yearly'; // Replace with your link
    
    const link = selectedPlan === 'monthly' ? RAZORPAY_MONTHLY_LINK : RAZORPAY_YEARLY_LINK;
    window.open(link, '_blank');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-violet-500/10 animate-in fade-in zoom-in duration-300">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✦</div>
          <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h2>
          <p className="text-gray-400 text-sm">No ads, priority speed, email support.</p>
        </div>

        {/* Plan toggle */}
        <div className="flex items-center bg-white/5 rounded-xl p-1 mb-6">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedPlan === 'yearly'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Yearly <span className="text-xs text-green-400 ml-1">Save 16%</span>
          </button>
        </div>

        {/* Price display */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-white mb-1">
            {selectedPlan === 'monthly' ? '₹99' : '₹999'}
          </div>
          <div className="text-gray-400 text-sm">
            {selectedPlan === 'monthly' ? 'per month' : 'per year (₹83/mo)'}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-8">
          {[
            'Unlimited conversions every day',
            'All 5 tools — PDF, Image & more',
            'No ads. Ever.',
            'Priority processing speed',
            'Email support'
          ].map(f => (
            <li key={f} className="flex items-center text-sm text-gray-300">
              <span className="text-violet-400 mr-3">✦</span>{f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.99] transition-all shadow-xl shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : `Upgrade Now — ${selectedPlan === 'monthly' ? '₹99/mo' : '₹999/yr'} →`}
        </button>

        <p className="text-center text-xs text-gray-600 mt-4">
          Secure payment via Razorpay • Cancel anytime
        </p>
      </div>
    </div>
  );
};
