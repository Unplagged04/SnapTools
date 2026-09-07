"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  UploadCloud, 
  Download, 
  RotateCcw, 
  Scissors, 
  Sliders,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function BgRemoverPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [threshold, setThreshold] = useState<number>(35);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setResultUrl(null);
  };

  const removeBackground = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample boundary corner color (Top-left reference)
      const targetR = data[0];
      const targetG = data[1];
      const targetB = data[2];

      const colorDist = (r: number, g: number, b: number) => {
        return Math.sqrt(
          Math.pow(r - targetR, 2) +
          Math.pow(g - targetG, 2) +
          Math.pow(b - targetB, 2)
        );
      };

      // In-browser pixel alpha mask computation
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = colorDist(r, g, b);
        if (dist < threshold * 2.5) {
          data[i + 3] = 0; // Alpha channel to 0 (Transparent)
        }
      }

      ctx.putImageData(imgData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/png");
    };
  };

  const resetAll = () => {
    setImageSrc(null);
    setResultUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Execution
        </div>
      </div>

      {/* Tool Intro */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> High-Performance Utility
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Instant Background Remover
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Erase product & portrait backgrounds directly on your machine into transparent PNGs with zero server uploads.
        </p>
      </div>

      {/* Upload Zone */}
      {!imageSrc ? (
        <div className="border-2 border-dashed border-slate-800 hover:border-pink-500/50 bg-[#0d1117] rounded-3xl p-10 text-center relative transition-all group">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Upload image to clear background</p>
              <p className="text-xs text-slate-500 mt-1">Works best with solid, light, or studio backgrounds</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-pink-400" /> Edge Sensitivity Threshold: {threshold}
              </span>
              <input
                type="range"
                min={10}
                max={80}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="accent-pink-500 cursor-pointer w-48 h-1.5 bg-slate-950 rounded-lg"
              />
            </div>

            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Upload Another
            </button>
          </div>

          {/* Canvas Comparison Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 font-semibold uppercase">Original Image</span>
              <div className="aspect-square rounded-2xl overflow-hidden bg-black/40 border border-slate-800 flex items-center justify-center">
                <img src={imageSrc} alt="Original" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-500 font-semibold uppercase">Transparent Result</span>
              <div className="aspect-square rounded-2xl overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] bg-[#050608] border border-slate-800 flex items-center justify-center relative">
                {resultUrl ? (
                  <img src={resultUrl} alt="Result" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-600">Click process to preview cutout</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={removeBackground}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 rounded-xl bg-pink-500 hover:bg-pink-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-pink-500/10"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing Pixels...
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" /> Extract Subject & Remove BG
                </>
              )}
            </button>

            {resultUrl && (
              <a
                href={resultUrl}
                download="clean-cutout.png"
                className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10 shrink-0"
              >
                <Download className="w-4 h-4" /> Download PNG
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
