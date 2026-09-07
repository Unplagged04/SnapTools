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
  Layers, 
  Sliders, 
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";

export default function SvgConverterPage() {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("graphic");
  const [scale, setScale] = useState<number>(2); // 1x, 2x, 4x, 8x
  const [nativeSize, setNativeSize] = useState<{ width: number; height: number }>({ width: 512, height: 512 });
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.name.endsWith(".svg") && file.type !== "image/svg+xml") {
      alert("Please upload a valid .svg file.");
      return;
    }

    setFileName(file.name.replace(/\.svg$/i, ""));
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSvgContent(content);
      setConvertedUrl(null);

      // Parse width/height or viewBox
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "image/svg+xml");
      const svgEl = doc.querySelector("svg");

      if (svgEl) {
        let w = parseFloat(svgEl.getAttribute("width") || "0");
        let h = parseFloat(svgEl.getAttribute("height") || "0");

        if (!w || !h) {
          const viewBox = svgEl.getAttribute("viewBox");
          if (viewBox) {
            const parts = viewBox.split(/\s+|,/).map(Number);
            if (parts.length === 4) {
              w = parts[2];
              h = parts[3];
            }
          }
        }

        setNativeSize({
          width: Math.round(w) || 512,
          height: Math.round(h) || 512
        });
      }
    };

    reader.readAsText(file);
  };

  const convertToPng = () => {
    if (!svgContent) return;
    setIsProcessing(true);

    const targetWidth = nativeSize.width * scale;
    const targetHeight = nativeSize.height * scale;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            setConvertedUrl(URL.createObjectURL(pngBlob));
          }
          setIsProcessing(false);
          URL.revokeObjectURL(url);
        }, "image/png");
      } else {
        setIsProcessing(false);
      }
    };

    img.src = url;
  };

  const resetAll = () => {
    setSvgContent(null);
    setConvertedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="min-h-screen px-4 py-10 max-w-4xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Rasterization
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> High-Resolution Vector Tool
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          SVG to High-Res PNG Converter
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Convert vector SVG graphics into crisp, lossless 2K, 4K, or 8K transparent PNG images directly in your browser.
        </p>
      </div>

      {/* Upload Zone */}
      {!svgContent ? (
        <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-[#0d1117] rounded-3xl p-10 text-center relative transition-all group">
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Click or drag & drop an SVG file</p>
              <p className="text-xs text-slate-500 mt-1">Vectors, logos, icons, and illustrations supported</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          {/* File Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white truncate max-w-xs">{fileName}.svg</p>
                <p className="text-xs text-slate-400">
                  Native: {nativeSize.width} × {nativeSize.height} px
                </p>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Upload Another
            </button>
          </div>

          {/* Scale Multiplier */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Export Resolution Multiplier
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "1x (Standard)", val: 1 },
                { label: "2x (HD)", val: 2 },
                { label: "4x (Ultra HD)", val: 4 },
                { label: "8x (Print 8K)", val: 8 }
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => { setScale(item.val); setConvertedUrl(null); }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    scale === item.val
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <div>{item.label}</div>
                  <div className="text-[10px] font-mono font-normal opacity-70 mt-0.5">
                    {nativeSize.width * item.val}×{nativeSize.height * item.val}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Container */}
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-semibold uppercase">Vector Preview</span>
            <div className="w-full h-56 rounded-2xl bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] bg-[#050608] border border-slate-800 flex items-center justify-center p-4 overflow-hidden">
              <div 
                className="max-h-full max-w-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svgContent }} 
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={convertToPng}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10"
            >
              {isProcessing ? "Rasterizing Pixels..." : `Render ${nativeSize.width * scale}×${nativeSize.height * scale} PNG`}
            </button>

            {convertedUrl && (
              <a
                href={convertedUrl}
                download={`${fileName}-${nativeSize.width * scale}x${nativeSize.height * scale}.png`}
                className="py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/10 shrink-0"
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
