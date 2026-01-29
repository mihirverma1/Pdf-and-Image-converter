import React, { useState, useRef } from 'react';
import { ToolType, ToolConfig, FileItem } from '../types.ts';
import { processPdfToImages, processImagesToPdf, mergePdfs, shrinkPdf } from '../services/pdfService.ts';
import { shrinkImage } from '../services/imageService.ts';

interface ToolPanelProps {
  tool: ToolType;
  config: ToolConfig;
}

export const ToolPanel: React.FC<ToolPanelProps> = ({ tool, config }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles: FileItem[] = Array.from(e.target.files).map((file: File) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    if (tool === ToolType.MERGE_PDF || tool === ToolType.IMAGE_TO_PDF) {
      setFiles(prev => [...prev, ...newFiles]);
    } else {
      setFiles(newFiles);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      switch (tool) {
        case ToolType.PDF_TO_IMAGE:
          await processPdfToImages(files[0].file);
          break;
        case ToolType.IMAGE_TO_PDF:
          await processImagesToPdf(files.map(f => f.file));
          break;
        case ToolType.MERGE_PDF:
          await mergePdfs(files.map(f => f.file));
          break;
        case ToolType.SHRINK_PDF:
          await shrinkPdf(files[0].file);
          break;
        case ToolType.SHRINK_IMAGE:
          await shrinkImage(files[0].file);
          break;
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during processing. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold text-white flex items-center mb-2">
            <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center mr-4 text-2xl`}>
              {config.icon}
            </span>
            {config.title}
          </h2>
          <p className="text-gray-500 ml-16">{config.description}</p>
        </div>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer
          ${files.length > 0 ? 'border-violet-500/30 bg-violet-500/5' : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={tool === ToolType.MERGE_PDF || tool === ToolType.IMAGE_TO_PDF}
          accept={tool === ToolType.SHRINK_IMAGE ? 'image/*' : tool === ToolType.IMAGE_TO_PDF ? 'image/*' : 'application/pdf'}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📥</span>
          </div>
          <p className="text-xl font-medium text-white">
            {files.length > 0 ? `${files.length} file(s) selected` : 'Drop files here or click to browse'}
          </p>
          <p className="text-sm text-gray-500">
            {tool === ToolType.SHRINK_IMAGE ? 'Supports JPG, PNG, WEBP' : 'Supports PDF files'}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="glass rounded-3xl p-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Queue</h4>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                <div className="flex items-center space-x-3">
                  {file.preview ? (
                    <img src={file.preview} alt="preview" className="w-10 h-10 object-cover rounded-lg" />
                  ) : (
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-lg">📄</div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white truncate max-w-xs">{file.file.name}</p>
                    <p className="text-xs text-gray-500">{(file.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                  className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col space-y-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all duration-300
                ${isProcessing ? 'bg-gray-700 cursor-not-allowed' : `bg-gradient-to-r ${config.color} hover:scale-[1.01] active:scale-[0.99]`}`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : `Execute ${config.title}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};