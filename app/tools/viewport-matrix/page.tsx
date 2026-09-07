"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Globe, 
  RotateCw, 
  ExternalLink,
  Laptop
} from "lucide-react";

export default function ViewportMatrixPage() {
  const [urlInput, setUrlInput] = useState("https://example.com");
  const [currentUrl, setCurrentUrl] = useState("https://example.com");
  const [activeDevice, setActiveDevice] = useState<"all" | "mobile" | "tablet" | "desktop">("all");
  const [iframeKey, setIframeKey] = useState(0);

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let formatted = urlInput.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = "https://" + formatted;
    }
    setUrlInput(formatted);
    setCurrentUrl(formatted);
    setIframeKey((prev) => prev + 1);
  };

  const reloadFrames = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen px-4 py-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Rendering
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Responsive Design Matrix
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Screen Size & Device Viewport Tester
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Simulate how any website renders across Phone, Tablet, and Desktop screen widths simultaneously in real time.
        </p>
      </div>

      {/* URL Input & Filter Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#0b0e14] border border-slate-800">
        <form onSubmit={handleApplyUrl} className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter site URL (e.g. example.com or localhost:3000)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs transition-colors shrink-0 shadow-lg shadow-sky-500/10"
          >
            Load URL
          </button>
          <button
            type="button"
            onClick={reloadFrames}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
            title="Reload iframes"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </form>

        {/* Viewport Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          {[
            { id: "all", label: "Multi View", icon: Laptop },
            { id: "mobile", label: "Mobile", icon: Smartphone },
            { id: "tablet", label: "Tablet", icon: Tablet },
            { id: "desktop", label: "Desktop", icon: Monitor },
          ].map((device) => {
            const Icon = device.icon;
            return (
              <button
                key={device.id}
                onClick={() => setActiveDevice(device.id as typeof activeDevice)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeDevice === device.id
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{device.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame Matrix Stage */}
      <div className="flex flex-wrap gap-8 items-start justify-center overflow-x-auto pb-8">
        {/* Mobile Viewport: 375px */}
        {(activeDevice === "all" || activeDevice === "mobile") && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-between w-[375px] px-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5 text-sky-400" /> Mobile (375 × 667)</span>
              <a href={currentUrl} target="_blank" rel="noreferrer" className="hover:text-sky-300 flex items-center gap-1">
                Open <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="w-[375px] h-[667px] rounded-3xl overflow-hidden border-4 border-slate-800 bg-black shadow-2xl relative">
              <iframe
                key={`mobile-${iframeKey}`}
                src={currentUrl}
                title="Mobile View"
                className="w-full h-full bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        )}

        {/* Tablet Viewport: 768px */}
        {(activeDevice === "all" || activeDevice === "tablet") && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-between w-[520px] px-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><Tablet className="w-3.5 h-3.5 text-sky-400" /> Tablet (768 × 1024 scaled)</span>
              <a href={currentUrl} target="_blank" rel="noreferrer" className="hover:text-sky-300 flex items-center gap-1">
                Open <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="w-[520px] h-[667px] rounded-3xl overflow-hidden border-4 border-slate-800 bg-black shadow-2xl relative">
              <iframe
                key={`tablet-${iframeKey}`}
                src={currentUrl}
                title="Tablet View"
                className="w-[768px] h-[985px] bg-white origin-top-left scale-[0.677]"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        )}

        {/* Desktop Viewport: 1280px */}
        {(activeDevice === "all" || activeDevice === "desktop") && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-between w-[640px] px-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><Monitor className="w-3.5 h-3.5 text-sky-400" /> Desktop (1280 × 800 scaled)</span>
              <a href={currentUrl} target="_blank" rel="noreferrer" className="hover:text-sky-300 flex items-center gap-1">
                Open <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="w-[640px] h-[400px] rounded-3xl overflow-hidden border-4 border-slate-800 bg-black shadow-2xl relative">
              <iframe
                key={`desktop-${iframeKey}`}
                src={currentUrl}
                title="Desktop View"
                className="w-[1280px] h-[800px] bg-white origin-top-left scale-[0.5]"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-[#0b0e14] border border-slate-800 text-center text-xs text-slate-500">
        💡 Note: Certain platforms (like google.com or github.com) enforce <code className="text-slate-400 font-mono">X-Frame-Options: DENY</code> which restricts rendering inside iframes. Your own websites and local development ports will render seamlessly.
      </div>
    </main>
  );
}
