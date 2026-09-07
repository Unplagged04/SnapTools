"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  UploadCloud, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  Smartphone, 
  Monitor, 
  Tv, 
  Info,
  RotateCcw
} from "lucide-react";

export default function YTSafeCropPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<"mobile" | "desktop" | "tv">("mobile");
  const [showSafeMargin, setShowSafeMargin] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, or WebP).");
      return;
    }
    const url = URL.createObjectURL(file);
    setImageSrc(url);
  };

  return (
    <main className="min-h-screen px-4 py-10 max-w-5xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Preview
        </div>
      </div>

      {/* Tool Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Creator Studio Tool
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          YouTube Thumbnail Tester & Safe-Crop
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Simulate YouTube video player overlays and check if your thumbnail text, face, or important elements get blocked by the timestamp.
        </p>
      </div>

      {/* Viewport Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d1117] border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceView("mobile")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              deviceView === "mobile"
                ? "bg-red-500/20 border-red-500 text-red-300"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Smartphone className="w-4 h-4" /> Mobile App
          </button>
          <button
            onClick={() => setDeviceView("desktop")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              deviceView === "desktop"
                ? "bg-red-500/20 border-red-500 text-red-300"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Monitor className="w-4 h-4" /> Desktop Feed
          </button>
          <button
            onClick={() => setDeviceView("tv")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              deviceView === "tv"
                ? "bg-red-500/20 border-red-500 text-red-300"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Tv className="w-4 h-4" /> Smart TV / Big Screen
          </button>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSafeMargin}
              onChange={(e) => setShowSafeMargin(e.target.checked)}
              className="rounded accent-red-500 w-4 h-4 cursor-pointer"
            />
            Show Safe Guides
          </label>
          {imageSrc && (
            <button
              onClick={() => {
                setImageSrc(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas / Preview Stage */}
      <div className="flex flex-col items-center justify-center">
        {!imageSrc ? (
          <div className="w-full border-2 border-dashed border-slate-800 hover:border-red-500/50 bg-[#0d1117] rounded-3xl p-12 text-center relative transition-all group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-3 pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Upload your YouTube Thumbnail (16:9)</p>
                <p className="text-xs text-slate-500 mt-1">Recommended size: 1280x720 or 1920x1080 (PNG, JPG, WebP)</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-6">
            {/* The Visual Simulation Screen */}
            <div className="relative mx-auto w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-black select-none">
              {/* Uploaded Thumbnail Image */}
              <img
                src={imageSrc}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover"
              />

              {/* Safe Guidelines Overlay */}
              {showSafeMargin && (
                <div className="absolute inset-0 pointer-events-none border border-cyan-400/40 m-6 rounded-lg flex flex-col justify-between p-3">
                  <div className="text-[10px] text-cyan-300 font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 w-fit">
                    Recommended Safe Title Area
                  </div>
                  <div className="text-[10px] text-cyan-300 font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 w-fit self-end">
                    Avoid critical focal text in corners
                  </div>
                </div>
              )}

              {/* Timestamp Badge (Bottom-Right) - Shifts based on simulated device */}
              <div
                className={`absolute pointer-events-none font-bold font-mono tracking-wider rounded ${
                  deviceView === "mobile"
                    ? "bottom-2 right-2 px-1.5 py-0.5 text-[11px] bg-black/90 text-white border border-white/10"
                    : deviceView === "desktop"
                    ? "bottom-3 right-3 px-2 py-1 text-xs bg-black/85 text-slate-100 font-semibold shadow-md"
                    : "bottom-5 right-5 px-3 py-1.5 text-sm bg-black/95 text-white shadow-xl"
                }`}
              >
                12:48
              </div>

              {/* Red Watch Progress Bar (Desktop & TV simulation) */}
              {(deviceView === "desktop" || deviceView === "tv") && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-red-600 w-1/3" />
                </div>
              )}

              {/* Mobile Watch Later & 3-dot simulated overlay */}
              {deviceView === "mobile" && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white flex items-center gap-1 font-sans">
                  <span>⋮</span>
                </div>
              )}
            </div>

            {/* Checklist Insights */}
            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Info className="w-4 h-4 text-cyan-400" /> Thumbnail Optimization Checklist
              </div>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Check the <strong>bottom-right corner</strong> to make sure your face or text is not hidden behind the <strong>12:48</strong> timestamp badge.</li>
                <li>Ensure faces and primary emotions are positioned centrally or towards the left for optimal visual hierarchy.</li>
                <li>Make sure main headline text has high contrast and is clearly readable even when scaled down to mobile dimensions.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}