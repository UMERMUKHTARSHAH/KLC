// LoyaltyTierBadge.jsx
import React from 'react';

const tierStyles = {
  bronze:
    'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300',
  silver:
    'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300',
  gold:
    'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-400',
  platinum:
    'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-400',
  diamond:
    'bg-gradient-to-r from-cyan-100 to-blue-200 text-cyan-900 border-cyan-400',
  legacy:
    'bg-gradient-to-r from-purple-100 to-fuchsia-200 text-purple-800 border-purple-300',
};

const LoyaltyTierBadge = ({ tier }) => {
  if (!tier || tier === 'N/A') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
        N/A
      </span>
    );
  }

  const key = String(tier).toLowerCase();
  const style =
    tierStyles[key] || 'bg-blue-100 text-blue-800 border-blue-200';

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${style}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
      </svg>
      {tier}
    </span>
  );
};

export default LoyaltyTierBadge;