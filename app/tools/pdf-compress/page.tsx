"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { 
  ArrowLeft, 
  UploadCloud, 
  ShieldCheck, 
  Download, 
  Loader2, 
  Sparkles, 
  FileText, 
  Percent, 
  CheckCircle2 
} from "lucide-react";

export default function PDFCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressionRatio, setCompressionRatio] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<"low" | "medium" | "high">("medium");

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = e.target.files[0];
    if (selected.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
      return;
    }
    setFile(selected);
    setOriginalSize(selected.size);
    setCompressedUrl(null);
    setCompressedSize(0);
    setCompressionRatio(0);
  };

  const compressPDF = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Load and clean unused object references & stream dictionaries
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      // Clean unreferenced objects and pack objects into streams
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false
      });

      const newSize = compressedBytes.byteLength;
      setCompressedSize(newSize);

      const savedPercent = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));
      setCompressionRatio(savedPercent);

      const blob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);
    } catch (err) {
      console.error(err);
      alert("Unable to compress this PDF. It may be encrypted or corrupted.");
    } finally {
      setIsProcessing(false);
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
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Compression
        </div>
      </div>

      {/* Tool Intro */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Zero-Server Tool
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          PDF Compressor
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Reduce PDF file size right inside your browser memory. Your files never leave your computer or phone.
        </p>
      </div>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-[#0d1117] rounded-3xl p-8 text-center relative transition-all group">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-3 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Click or drag & drop a PDF file here</p>
            <p className="text-xs text-slate-500 mt-1">Supports any PDF document</p>
          </div>
        </div>
      </div>

      {/* Selected File Details & Controls */}
      {file && (
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-slate-800/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-200 truncate">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">Original Size: {formatBytes(originalSize)}</p>
              </div>
            </div>
            <button
              onClick={() => { setFile(null); setCompressedUrl(null); }}
              className="text-xs text-red-400 hover:underline shrink-0 font-medium"
            >
              Change File
            </button>
          </div>

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Compression Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {(["low", "medium", "high"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setCompressionLevel(lvl)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    compressionLevel === lvl 
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-300" 
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {lvl} Compression
                </button>
              ))}
            </div>
          </div>

          {/* Compress Action */}
          <button
            onClick={compressPDF}
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/10"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Compressing in Memory...
              </>
            ) : (
              "Compress PDF Now"
            )}
          </button>

          {/* Success & Download Result */}
          {compressedUrl && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-300">Compression Complete!</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    New Size: <span className="text-white font-bold">{formatBytes(compressedSize)}</span> 
                    {compressionRatio > 0 && ` (${compressionRatio}% reduced)`}
                  </p>
                </div>
              </div>

              <a
                href={compressedUrl}
                download={`compressed_${file.name}`}
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20 shrink-0"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
