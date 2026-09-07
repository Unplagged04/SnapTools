"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  UploadCloud, 
  Eye, 
  RotateCcw, 
  Sliders, 
  Flame,
  CheckCircle2
} from "lucide-react";

export default function ThumbnailABPage() {
  const [thumbA, setThumbA] = useState<string | null>(null);
  const [thumbB, setThumbB] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [blurMode, setBlurMode] = useState(false); // Simulates 3-second quick scroll blur test
  const [selectedWinner, setSelectedWinner] = useState<"A" | "B" | null>(null);

  const inputRefA = useRef<HTMLInputElement>(null);
  const inputRefB = useRef<HTMLInputElement>(null);

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    variant: "A" | "B"
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    if (variant === "A") setThumbA(url);
    if (variant === "B") setThumbB(url);
  };

  const resetAll = () => {
    setThumbA(null);
    setThumbB(null);
    setSelectedWinner(null);
    setShowHeatmap(false);
    setBlurMode(false);
    if (inputRefA.current) inputRefA.current.value = "";
    if (inputRefB.current) inputRefB.current.value = "";
  };

  return (
    <main className="min-h-screen px-4 py-10 max-w-5xl mx-auto space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% Client-Side Simulation
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> CTR Booster Tool
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Thumbnail A/B Comparison & Attention Test
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Test two thumbnail concepts side-by-side. Use eye-tracking heatmap and squint-blur tests to find which design grabs attention instantly.
        </p>
      </div>

      {/* Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0b0e14] border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHeatmap((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              showHeatmap
                ? "bg-orange-500/20 border-orange-500 text-orange-300"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            {showHeatmap ? "Hide Attention Heatmap" : "Simulate Eye Heatmap"}
          </button>

          <button
            onClick={() => setBlurMode((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              blurMode
                ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            {blurMode ? "Clear Squint Blur" : "Squint / Glance Test"}
          </button>
        </div>

        {(thumbA || thumbB) && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Both
          </button>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Variant A */}
        <div className="space-y-3 bg-[#0b0e14] border border-slate-800 p-5 rounded-3xl relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-center text-[11px] leading-5 font-bold">A</span>
              Concept Variant A
            </span>
            {selectedWinner === "A" && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected Winner
              </span>
            )}
          </div>

          {!thumbA ? (
            <div className="aspect-video border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-[#0d1117] rounded-2xl flex flex-col items-center justify-center p-6 text-center relative group cursor-pointer">
              <input
                ref={inputRefA}
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "A")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform mb-2" />
              <p className="text-xs font-bold text-slate-200">Upload Thumbnail A</p>
              <p className="text-[10px] text-slate-500 mt-1">16:9 Landscape format</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-xl">
                <img
                  src={thumbA}
                  alt="Variant A"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    blurMode ? "blur-md scale-105" : ""
                  }`}
                />
                {showHeatmap && (
                  <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge bg-gradient-radial from-red-500/70 via-yellow-500/40 to-transparent opacity-80" />
                )}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/90 text-white">
                  10:15
                </div>
              </div>
              <button
                onClick={() => setSelectedWinner("A")}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedWinner === "A"
                    ? "bg-cyan-500 text-black border-cyan-400"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                {selectedWinner === "A" ? "Preferred Pick ✓" : "Pick as Stronger Concept"}
              </button>
            </div>
          )}
        </div>

        {/* Variant B */}
        <div className="space-y-3 bg-[#0b0e14] border border-slate-800 p-5 rounded-3xl relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-300 text-center text-[11px] leading-5 font-bold">B</span>
              Concept Variant B
            </span>
            {selectedWinner === "B" && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected Winner
              </span>
            )}
          </div>

          {!thumbB ? (
            <div className="aspect-video border-2 border-dashed border-slate-800 hover:border-orange-500/50 bg-[#0d1117] rounded-2xl flex flex-col items-center justify-center p-6 text-center relative group cursor-pointer">
              <input
                ref={inputRefB}
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "B")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform mb-2" />
              <p className="text-xs font-bold text-slate-200">Upload Thumbnail B</p>
              <p className="text-[10px] text-slate-500 mt-1">16:9 Landscape format</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-xl">
                <img
                  src={thumbB}
                  alt="Variant B"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    blurMode ? "blur-md scale-105" : ""
                  }`}
                />
                {showHeatmap && (
                  <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge bg-gradient-radial from-red-500/70 via-yellow-500/40 to-transparent opacity-80" />
                )}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/90 text-white">
                  10:15
                </div>
              </div>
              <button
                onClick={() => setSelectedWinner("B")}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedWinner === "B"
                    ? "bg-orange-500 text-black border-orange-400"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                {selectedWinner === "B" ? "Preferred Pick ✓" : "Pick as Stronger Concept"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}