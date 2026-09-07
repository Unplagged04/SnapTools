"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  FileText, 
  Gauge, 
  Sliders
} from "lucide-react";

export default function SpeechPacerPage() {
  const [script, setScript] = useState("");
  const [wpm, setWpm] = useState(140); // 130-150 standard conversational WPM
  const [isPlaying, setIsPlaying] = useState(false);
  const teleprompterRef = useRef<HTMLDivElement>(null);

  // Word count & time calculation
  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0;
  const totalSeconds = wordCount > 0 ? Math.ceil((wordCount / wpm) * 60) : 0;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    if (mins === 0) return `${remainingSecs} sec`;
    return `${mins} min ${remainingSecs} sec`;
  };

  // Teleprompter Auto-Scroll Effect
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    if (isPlaying && teleprompterRef.current) {
      scrollInterval = setInterval(() => {
        if (teleprompterRef.current) {
          teleprompterRef.current.scrollTop += 1;
          // Loop or stop if reached end
          if (
            teleprompterRef.current.scrollTop + teleprompterRef.current.clientHeight >=
            teleprompterRef.current.scrollHeight
          ) {
            setIsPlaying(false);
          }
        }
      }, Math.max(15, Math.floor(6000 / wpm)));
    }
    return () => clearInterval(scrollInterval);
  }, [isPlaying, wpm]);

  const togglePlayback = () => {
    if (!script.trim()) return;
    setIsPlaying((prev) => !prev);
  };

  const resetScroll = () => {
    setIsPlaying(false);
    if (teleprompterRef.current) {
      teleprompterRef.current.scrollTop = 0;
    }
  };

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
          <ShieldCheck className="w-4 h-4" /> 100% Private Client-Side
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Creator Studio Tool
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Video Script Speed Calculator & Pacer
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Calculate the exact runtime of your YouTube or Reels script and practice delivery with a live visual teleprompter.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0b0e14] border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Estimated Length</p>
            <p className="text-lg font-bold text-white font-mono">{formatDuration(totalSeconds)}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0e14] border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Total Words</p>
            <p className="text-lg font-bold text-white font-mono">{wordCount} words</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0e14] border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold uppercase">Speaking Pace</p>
            <p className="text-lg font-bold text-white font-mono">{wpm} WPM</p>
          </div>
        </div>
      </div>

      {/* Pace Controller */}
      <div className="p-4 rounded-2xl bg-[#0b0e14] border border-slate-800 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-400" /> Speech Rate Preset
          </span>
          <span className="text-slate-300 font-mono">
            {wpm < 130 ? "Slow & Clear" : wpm > 160 ? "Fast / Shorts / Reels" : "Natural Conversational"}
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={200}
          step={5}
          value={wpm}
          onChange={(e) => setWpm(Number(e.target.value))}
          className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>100 WPM (Educational)</span>
          <span>140 WPM (Standard YouTube)</span>
          <span>200 WPM (Fast Reels)</span>
        </div>
      </div>

      {/* Dual Section: Editor vs Teleprompter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Script Input */}
        <div className="space-y-3 bg-[#0b0e14] border border-slate-800 p-5 rounded-3xl flex flex-col justify-between">
          <div>
            <label className="text-xs font-bold text-slate-300">Paste or Write Script</label>
            <textarea
              rows={12}
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your video script here to calculate reading time and launch rehearsal..."
              className="mt-2 w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Live Visual Teleprompter Box */}
        <div className="space-y-3 bg-[#0b0e14] border border-slate-800 p-5 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">Practice Teleprompter</label>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              {isPlaying ? "Scrolling..." : "Paused"}
            </span>
          </div>

          <div
            ref={teleprompterRef}
            className="h-64 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-y-auto scroll-smooth text-slate-200 font-medium text-base leading-loose select-none"
          >
            {script.trim() ? (
              <p className="pb-40 whitespace-pre-wrap">{script}</p>
            ) : (
              <p className="text-slate-600 text-xs italic">Script text will appear here with smooth auto-scrolling during rehearsal.</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={togglePlayback}
              disabled={!script.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-500/10"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
              {isPlaying ? "Pause Teleprompter" : "Start Rehearsal"}
            </button>
            <button
              onClick={resetScroll}
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reset to Top"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
