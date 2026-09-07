"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  UploadCloud, 
  Download, 
  Trash2, 
  Loader2, 
  Sliders, 
  CheckCircle2, 
  TrendingDown,
  Image as ImageIcon
} from "lucide-react";

interface OptimizedImage {
  id: string;
  originalName: string;
  originalSize: number;
  compressedSize: number;
  blobUrl: string;
  savedPercent: number;
}

export default function ImageOptimizerPage() {
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<OptimizedImage[]>([]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    setIsProcessing(true);
    const newResults: OptimizedImage[] = [];

    for (const file of files) {
      const originalSize = file.size;
      const objectUrl = URL.createObjectURL(file);

      const img = new Image();
      img.src = objectUrl;
      await new Promise((res) => { img.onload = res; });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const webpBlob = await new Promise<Blob | null>((res) => {
        canvas.toBlob(res, "image/webp", quality / 100);
      });

      if (webpBlob) {
        const compressedSize = webpBlob.size;
        const savedPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));
        newResults.push({
          id: Math.random().toString(36).substring(2, 9),
          originalName: file.name.replace(/\.[^/.]+$/, "") + ".webp",
          originalSize,
          compressedSize,
          blobUrl: URL.createObjectURL(webpBlob),
          savedPercent
        });
      }
    }

    setResults((prev) => [...prev, ...newResults]);
    setIsProcessing(false);
  };

  const removeResult = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  };

  const clearAll = () => {
    setResults([]);
  };

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Compression
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Speed & Storage Tool
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Image Size Reducer & WebP Converter
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Convert bulky JPG/PNG pictures to modern lightweight WebP format. Reduce load time and bandwidth while keeping sharp clarity.
        </p>
      </div>

      {/* Settings Bar */}
      <div className="p-4 rounded-2xl bg-[#0b0e14] border border-slate-800 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Compression Quality: {quality}%
          </span>
          <span className="text-slate-300 font-mono">
            {quality >= 80 ? "High Quality (Recommended)" : quality >= 60 ? "Balanced Compression" : "Smallest File Size"}
          </span>
        </div>
        <input
          type="range"
          min={30}
          max={95}
          step={5}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full accent-indigo-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>30% (Aggressive)</span>
          <span>80% (Sweet Spot)</span>
          <span>95% (Near Lossless)</span>
        </div>
      </div>

      {/* Drop Zone */}
      <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-[#0d1117] rounded-3xl p-8 text-center relative transition-all group">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-3 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Click or drag & drop images here</p>
            <p className="text-xs text-slate-500 mt-1">Select one or multiple PNG, JPG, or WebP files</p>
          </div>
        </div>
      </div>

      {/* Results Queue */}
      {isProcessing && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-2 text-xs text-indigo-300 font-semibold">
          <Loader2 className="w-4 h-4 animate-spin" /> Compressing in memory...
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Optimized Files ({results.length})</span>
            <button
              onClick={clearAll}
              className="text-xs text-red-400 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {results.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0b0e14] border border-slate-800/80"
              >
                <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-slate-200 truncate">{item.originalName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 font-mono">
                      <span>{formatBytes(item.originalSize)}</span>
                      <span>→</span>
                      <span className="text-emerald-400 font-bold">{formatBytes(item.compressedSize)}</span>
                      {item.savedPercent > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                          <TrendingDown className="w-2.5 h-2.5 inline mr-0.5" />
                          {item.savedPercent}% saved
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={item.blobUrl}
                    download={item.originalName}
                    className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => removeResult(item.id)}
                    className="p-2 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
