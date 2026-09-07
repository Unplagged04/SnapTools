"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Palette, 
  BatteryCharging, 
  CheckCircle2, 
  XCircle,
  Eye
} from "lucide-react";

export default function ColorContrastPage() {
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#08090D");

  // Helper to convert hex to RGB
  const hexToRgb = (hex: string) => {
    let clean = hex.replace("#", "");
    if (clean.length === 3) {
      clean = clean.split("").map((c) => c + c).join("");
    }
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  // Standard WCAG Luminance calculation
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const metrics = useMemo(() => {
    try {
      const rgb1 = hexToRgb(textColor);
      const rgb2 = hexToRgb(bgColor);

      const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
      const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      const ratio = (brightest + 0.05) / (darkest + 0.05);

      // OLED Power consumption estimation: Pure white (#FFFFFF) = 100% load, #000000 = ~0%
      const bgPixelPower = (rgb2.r * 0.2126 + rgb2.g * 0.7152 + rgb2.b * 0.0722) / 255;
      const batterySavedPercent = Math.max(0, Math.round((1 - bgPixelPower) * 78)); // up to ~78% screen battery conservation

      return {
        ratio: parseFloat(ratio.toFixed(2)),
        aaNormal: ratio >= 4.5,
        aaLarge: ratio >= 3.0,
        aaaNormal: ratio >= 7.0,
        batterySavedPercent,
      };
    } catch {
      return { ratio: 1, aaNormal: false, aaLarge: false, aaaNormal: false, batterySavedPercent: 0 };
    }
  }, [textColor, bgColor]);

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Calculation
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Design & Accessibility
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Screen Contrast & OLED Battery Analyzer
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Audit WCAG readability scores and calculate how much OLED mobile battery power your color palette saves.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Color Selectors */}
        <div className="md:col-span-6 space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          <div className="space-y-4">
            {/* Text Color Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-violet-400" /> Foreground / Text Color
              </label>
              <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="bg-transparent text-xs font-mono text-slate-200 uppercase focus:outline-none w-24"
                />
              </div>
            </div>

            {/* Background Color Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-violet-400" /> Background Surface Color
              </label>
              <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="bg-transparent text-xs font-mono text-slate-200 uppercase focus:outline-none w-24"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Pairs */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="text-[11px] font-semibold text-slate-500 uppercase">Popular Palettes</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "OLED Pitch Dark", text: "#FFFFFF", bg: "#000000" },
                { name: "Cyber Cyan", text: "#00E5FF", bg: "#08090D" },
                { name: "Nordic Frost", text: "#ECEFF4", bg: "#2E3440" },
                { name: "Cream & Slate", text: "#1E293B", bg: "#F8FAFC" }
              ].map((pair) => (
                <button
                  key={pair.name}
                  onClick={() => { setTextColor(pair.text); setBgColor(pair.bg); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
                >
                  {pair.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview & Metrics */}
        <div className="md:col-span-6 space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          {/* Live Dynamic Sample Viewport */}
          <div
            style={{ backgroundColor: bgColor, color: textColor }}
            className="p-6 rounded-2xl border border-slate-800 transition-colors shadow-inner select-none space-y-2"
          >
            <p className="text-xs font-semibold tracking-wider uppercase opacity-75">Live Readability Sample</p>
            <p className="text-xl font-bold">The quick brown fox jumps over the lazy dog.</p>
            <p className="text-xs opacity-90 leading-relaxed">
              Every detail matters when designing interfaces that respect eyesight and battery longevity.
            </p>
          </div>

          {/* Scorecards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Contrast Ratio</p>
                <p className="text-lg font-black text-white font-mono">{metrics.ratio} : 1</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">OLED Battery Save</p>
                <p className="text-lg font-black text-emerald-400 font-mono">~{metrics.batterySavedPercent}%</p>
              </div>
            </div>
          </div>

          {/* Compliance Checklist */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-slate-400">WCAG Accessibility Compliance</span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-300">AA Normal Text (≥ 4.5:1)</span>
                {metrics.aaNormal ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold"><CheckCircle2 className="w-4 h-4" /> Pass</span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 font-bold"><XCircle className="w-4 h-4" /> Fail</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-300">AA Large Text (≥ 3.0:1)</span>
                {metrics.aaLarge ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold"><CheckCircle2 className="w-4 h-4" /> Pass</span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 font-bold"><XCircle className="w-4 h-4" /> Fail</span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-300">AAA Enhanced Contrast (≥ 7.0:1)</span>
                {metrics.aaaNormal ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold"><CheckCircle2 className="w-4 h-4" /> Pass</span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400 font-bold"><XCircle className="w-4 h-4" /> Needs Boost</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
