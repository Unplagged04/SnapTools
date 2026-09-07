"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Palette, 
  Link as LinkIcon 
} from "lucide-react";

export default function QRArchitectPage() {
  const [text, setText] = useState("https://snaptools.app");
  const [fgColor, setFgColor] = useState("#00E5FF");
  const [bgColor, setBgColor] = useState("#08090d");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQR();
  }, [text, fgColor, bgColor]);

  const generateQR = async () => {
    try {
      if (!text.trim()) {
        setDataUrl("");
        return;
      }
      const url = await QRCode.toDataURL(text, {
        width: 600,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setDataUrl(url);
    } catch (err) {
      console.error("QR Code Error:", err);
    }
  };

  const downloadQR = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "custom-qrcode.png";
    a.click();
  };

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Rendering
        </div>
      </div>

      {/* Intro */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> High-Resolution Generator
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Custom QR Code Maker
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Create high-resolution QR codes with custom styling and instant download. No watermarks, completely free forever.
        </p>
      </div>

      {/* Editor Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="md:col-span-7 space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" /> Destination URL or Text
            </label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste website link, WhatsApp message, Wi-Fi code, or text..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          {/* Color Palettes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> QR Color
              </label>
              <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300 uppercase">{fgColor}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> Background
              </label>
              <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300 uppercase">{bgColor}</span>
              </div>
            </div>
          </div>

          {/* Preset Colors */}
          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-semibold text-slate-500 uppercase">Quick Color Presets</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Cyan Glow", fg: "#00E5FF", bg: "#08090d" },
                { name: "Emerald", fg: "#10B981", bg: "#06130e" },
                { name: "Clean B&W", fg: "#000000", bg: "#FFFFFF" },
                { name: "Dark Matrix", fg: "#FFFFFF", bg: "#0d1117" },
                { name: "Sunset Gold", fg: "#F59E0B", bg: "#170f03" }
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setFgColor(preset.fg);
                    setBgColor(preset.bg);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview & Download Column */}
        <div className="md:col-span-5 flex flex-col items-center gap-4 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          <div className="p-4 rounded-2xl bg-[#08090d] border border-slate-800 shadow-xl flex items-center justify-center">
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="Generated QR Code"
                className="w-56 h-56 rounded-xl object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-500">
                Enter text to see preview
              </div>
            )}
          </div>

          <div className="w-full space-y-2 pt-2">
            <button
              onClick={downloadQR}
              disabled={!dataUrl}
              className="w-full py-3 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-lime-500/10"
            >
              <Download className="w-4 h-4" /> Download High-Res PNG
            </button>

            <button
              onClick={copyToClipboard}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Link Copied!" : "Copy Link Text"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}