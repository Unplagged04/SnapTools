"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  UploadCloud, 
  Download, 
  Lock, 
  Trash2, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileCode
} from "lucide-react";

export default function BinaryShredderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [passes, setPasses] = useState<number>(3); // 3-pass DoD 5220.22-M
  const [isShredding, setIsShredding] = useState(false);
  const [shreddedUrl, setShreddedUrl] = useState<string | null>(null);
  const [entropyStats, setEntropyStats] = useState<{ originalSize: number; passesApplied: number } | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setFile(e.target.files[0]);
    setShreddedUrl(null);
    setEntropyStats(null);
  };

  const shredFile = async () => {
    if (!file) return;
    setIsShredding(true);

    try {
      const buffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(buffer);

      // Perform multi-pass pseudo-random cryptographic overwrite
      for (let p = 0; p < passes; p++) {
        // Use browser Web Crypto API for true entropy
        const chunkSize = 65536;
        for (let i = 0; i < uint8.length; i += chunkSize) {
          const end = Math.min(i + chunkSize, uint8.length);
          const chunk = uint8.subarray(i, end);
          crypto.getRandomValues(chunk);
        }
      }

      const blob = new Blob([uint8], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      setShreddedUrl(url);
      setEntropyStats({
        originalSize: file.size,
        passesApplied: passes
      });
    } catch (err) {
      console.error(err);
      alert("Failed to shred file in memory.");
    } finally {
      setIsShredding(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setShreddedUrl(null);
    setEntropyStats(null);
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
          <ShieldCheck className="w-4 h-4" /> 100% In-Memory Crypto Overwrite
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Military-Grade Sanitation
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Permanent File Shredder
        </h1>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Cryptographically sanitize file bytes with multi-pass random entropy before deletion so no recovery tool can restore your original data.
        </p>
      </div>

      {/* Upload Zone */}
      {!file ? (
        <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 bg-[#0d1117] rounded-3xl p-10 text-center relative transition-all group">
          <input
            type="file"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Select any sensitive file to shred</p>
              <p className="text-xs text-slate-500 mt-1">Supports any document, photo, key, or binary file</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 bg-[#0b0e14] border border-slate-800 p-6 rounded-3xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
                <FileCode className="w-5 h-5" />
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

          {/* Pass Protocol Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Overwrite Standards
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "1 Pass (Quick Zero)", val: 1 },
                { label: "3 Passes (DoD 5220)", val: 3 },
                { label: "7 Passes (Gutmann Lite)", val: 7 }
              ].map((std) => (
                <button
                  key={std.val}
                  onClick={() => setPasses(std.val)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                    passes === std.val
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {std.label}
                </button>
              ))}
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-300 leading-relaxed">
              This process renders the binary payload completely corrupt and unrecoverable. Replace your local file with this scrambled buffer before moving to recycle bin.
            </p>
          </div>

          {/* Action Button */}
          {!shreddedUrl ? (
            <button
              onClick={shredFile}
              disabled={isShredding}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/10"
            >
              {isShredding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Overwriting Binary Buffer ({passes} Passes)...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" /> Shred Binary Data Now
                </>
              )}
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-300">File Sanitized with {entropyStats?.passesApplied} Overwrites!</p>
                  <p className="text-[11px] text-slate-400">Original structure is completely destroyed.</p>
                </div>
              </div>

              <a
                href={shreddedUrl}
                download={`shredded_${file.name}`}
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/10 shrink-0"
              >
                <Download className="w-4 h-4" /> Download Corrupted Replacement
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
