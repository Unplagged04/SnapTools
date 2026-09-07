"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  UploadCloud, 
  Download, 
  FileCheck, 
  RotateCcw, 
  CheckCircle2, 
  Loader2, 
  FileText,
  Type,
  Sliders
} from "lucide-react";

export default function PDFWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState<number>(50);
  const [opacity, setOpacity] = useState<number>(0.3);
  const [rotation, setRotation] = useState<number>(45);
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkedBlobUrl, setWatermarkedBlobUrl] = useState<string | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = e.target.files[0];
    if (selected.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setFile(selected);
    setWatermarkedBlobUrl(null);
  };

  const applyWatermark = async () => {
    if (!file || !watermarkText.trim()) return;
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = helveticaFont.heightAtSize(fontSize);

        // Center calculation
        const xPos = (width - textWidth) / 2;
        const yPos = (height - textHeight) / 2;

        page.drawText(watermarkText, {
          x: xPos,
          y: yPos,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.7, 0.1, 0.1), // Distinct watermark red-gray
          opacity: opacity,
          rotate: degrees(rotation),
        });
      });

      const updatedBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(updatedBytes)], { type: "application/pdf" });
      setWatermarkedBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("PDF Watermark Error:", err);
      alert("Failed to apply watermark to this PDF. It might be locked or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setWatermarkedBlobUrl(null);
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
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Stamping
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> PDF Security & Branding
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          PDF Watermark & Stamp Adder
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Add custom copyright texts, confidentiality watermarks, or draft stamps across all pages right in your browser memory.
        </p>
      </div>

      {/* Upload Box */}
      {!file ? (
        <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-[#0d1117] rounded-3xl p-10 text-center relative transition-all group">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Click or drag & drop a PDF document</p>
              <p className="text-xs text-slate-500 mt-1">Multi-page documents supported</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Choose Another
            </button>
          </div>

          {/* Watermark Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-blue-400" /> Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors uppercase font-mono"
              />
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Font Size */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Font Size</span>
                  <span className="text-white font-mono">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={90}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-900 rounded-lg"
                />
              </div>

              {/* Opacity */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Transparency</span>
                  <span className="text-white font-mono">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={0.8}
                  step={0.05}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-900 rounded-lg"
                />
              </div>

              {/* Rotation Angle */}
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Angle</span>
                  <span className="text-white font-mono">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={15}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-900 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={applyWatermark}
              disabled={isProcessing || !watermarkText.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/10"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Stamping Pages...
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" /> Apply Watermark to All Pages
                </>
              )}
            </button>

            {watermarkedBlobUrl && (
              <a
                href={watermarkedBlobUrl}
                download={`watermarked_${file.name}`}
                className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10 shrink-0"
              >
                <Download className="w-4 h-4" /> Download Watermarked PDF
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
