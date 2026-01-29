
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ToolCard } from './components/ToolCard';
import { ToolPanel } from './components/ToolPanel';
import { ToolType, ToolConfig } from './types';

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

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);

  return (
    <Layout>
      {!activeTool ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
              PIConverter
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Professional grade PDF and image manipulation tools. 100% browser-based, secure, and blazingly fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TOOLS.map((tool) => (
              <ToolCard
                key={tool.id}
                config={tool}
                onClick={() => setActiveTool(tool.id)}
              />
            ))}
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
          />
        </div>
      )}
    </Layout>
  );
}
