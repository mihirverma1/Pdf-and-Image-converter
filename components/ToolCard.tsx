
import React from 'react';
import { ToolConfig } from '../types';

interface ToolCardProps {
  config: ToolConfig;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ config, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col text-left glass rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-gradient-to-br ${config.color} shadow-lg shadow-black/40`}>
        {config.icon}
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
        {config.title}
      </h3>

      <p className="text-gray-500 text-sm leading-relaxed mb-6">
        {config.description}
      </p>

      <div className="mt-auto flex items-center text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
        LAUNCH TOOL
        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </button>
  );
};
